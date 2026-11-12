#!/usr/bin/env python3
"""Check relative links in the repository's tracked Markdown.

The repository has no documentation site, so this is its documentation check:
every relative Markdown link target must exist on disk, with exact case, and
every in-file `#fragment` must match a heading anchor in the target document.

Scope is `git ls-files '*.md'` minus the trees that are generated content rather
than documentation: the knowledge base, publication records, the generated
`public/KG` mirror, retained script-run records, dependencies and build output.
Those are excluded by path prefix, never by a hand-maintained file list.

Exit status is 0 when every link resolves.
"""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
import unicodedata
from pathlib import Path
from urllib.parse import unquote

# Generated content, dependencies and build output. Prefixes are relative to the
# repository root and always end with a slash.
EXCLUDED_PREFIXES = (
    "DE/KG/",
    "DE/publications/",
    "DE/public/",
    "DE/scripts/output/",
    "DE/scripts/outputs/",
    "DE/scripts/test-batch/",
    "DE/dist/",
    "DE/node_modules/",
    "website_explore_the_unknown/node_modules/",
    "website_explore_the_unknown/.next/",
    "path/results/",
    ".gate/",
)

FENCE = re.compile(r"^(```|~~~)")
CODE_SPAN = re.compile(r"`[^`\n]*`")
INLINE_LINK = re.compile(r"!?\[(?P<text>[^\]]*)\]\((?P<target>[^)\s]+)(?:\s+\"[^\"]*\")?\)")
HEADING = re.compile(r"^(?P<hashes>#{1,6})\s+(?P<title>.+?)\s*#*\s*$")
EXPLICIT_ANCHOR = re.compile(r"<a\s+(?:name|id)=\"(?P<anchor>[^\"]+)\"")


def tracked_markdown(root: Path) -> list[Path]:
    out = subprocess.run(
        ["git", "-C", str(root), "ls-files", "-z", "*.md"],
        check=True,
        capture_output=True,
    ).stdout.decode("utf-8")
    return [Path(p) for p in out.split("\0") if p]


def slugify_heading(title: str) -> str:
    """GitHub's heading-anchor algorithm, close enough for this repository."""
    title = re.sub(r"`", "", title)
    title = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", title)  # links -> text
    title = re.sub(r"<[^>]+>", "", title)  # inline HTML
    title = title.strip().lower()
    title = unicodedata.normalize("NFKD", title)
    title = "".join(ch for ch in title if not unicodedata.combining(ch))
    title = re.sub(r"[^\w\s-]", "", title)
    return re.sub(r"\s+", "-", title).strip("-")


def anchors_of(path: Path) -> set[str]:
    anchors: set[str] = set()
    in_fence = False
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        if FENCE.match(line.strip()):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        heading = HEADING.match(line)
        if heading:
            anchors.add(slugify_heading(heading.group("title")))
        anchors.update(EXPLICIT_ANCHOR.findall(line))
    return anchors


def iter_links(path: Path):
    in_fence = False
    for lineno, line in enumerate(path.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
        if FENCE.match(line.strip()):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        for match in INLINE_LINK.finditer(CODE_SPAN.sub("", line)):
            yield lineno, match.group("target")


def is_external(target: str) -> bool:
    return bool(
        re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", target)  # http:, mailto:, tel:
        or target.startswith("//")
        or target.startswith("#")
    )


def resolve(root: Path, source: Path, target: str) -> tuple[str, Path | None, str]:
    """Returns (kind, path, fragment) where kind is file/fragment/ok."""
    target = target.split("#", 1)
    path_part = unquote(target[0])
    fragment = unquote(target[1]) if len(target) > 1 else ""

    if not path_part:
        return "fragment", source, fragment
    candidate = (source.parent / path_part).resolve()
    try:
        candidate.relative_to(root)
    except ValueError:
        return "outside", candidate, fragment
    if not candidate.exists():
        return "missing", candidate, fragment
    if candidate.is_dir():
        readme = candidate / "README.md"
        if readme.exists():
            return "file", readme, fragment
        return "missing", candidate, fragment
    return "file", candidate, fragment


def exact_case(root: Path, path: Path) -> bool:
    """APFS is case-insensitive; a wrong-case link still 404s on GitHub."""
    try:
        parts = path.resolve().relative_to(root).parts
    except ValueError:
        return True
    current = root
    for part in parts:
        try:
            names = {entry.name for entry in current.iterdir()}
        except OSError:
            return True
        if part not in names:
            return False
        current = current / part
    return True


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parent.parent)
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args(argv)

    root = args.root.resolve()
    failures: list[str] = []
    checked = 0
    files = [
        path
        for path in tracked_markdown(root)
        if not str(path).startswith(EXCLUDED_PREFIXES)
    ]
    anchor_cache: dict[Path, set[str]] = {}

    for relative in files:
        source = root / relative
        if not source.is_file():
            failures.append(f"{relative}: tracked but missing on disk")
            continue
        for lineno, target in iter_links(source):
            if is_external(target):
                continue
            kind, resolved, fragment = resolve(root, source, target)
            checked += 1
            where = f"{relative}:{lineno}"
            if kind == "outside":
                failures.append(f"{where}: link escapes the repository: {target}")
                continue
            if kind == "missing":
                failures.append(f"{where}: missing target: {target}")
                continue
            assert resolved is not None
            if not exact_case(root, resolved):
                failures.append(f"{where}: wrong case for target: {target}")
                continue
            if fragment and resolved.suffix == ".md":
                if resolved not in anchor_cache:
                    anchor_cache[resolved] = anchors_of(resolved)
                if fragment not in anchor_cache[resolved]:
                    failures.append(f"{where}: missing anchor #{fragment} in {resolved.relative_to(root)}")

    if args.verbose:
        print(f"checked {checked} relative links in {len(files)} tracked Markdown files")
    for failure in failures:
        print(failure, file=sys.stderr)
    if failures:
        print(f"{len(failures)} broken relative link(s)", file=sys.stderr)
        return 1
    print(f"docs links: {checked} relative links in {len(files)} files resolve")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
