#!/usr/bin/env python3
"""Pinned GNN conformance check.

Single implementation shared by `./run.sh gnn` and the `gnn-conformance` job in
`.github/workflows/ci.yml`. It reads the canonical pin file
`.github/gnn-pin.json` (schema `gnn-importer-pin/v1`), installs the pinned
parser into an isolated virtual environment, and then parses and type-checks
every `*.gnn.md` sketch in the repository. When the repository has no sketch
yet, it parses the pinned upstream exemplar instead, so the job proves the pin
and pipeline rather than a model this repository does not contain.

Exit status is 0 only when the pin, the installed version and the parser results
all agree. The type checker must return literal ``True``: its ``2`` verdict
(invalid files, or none found) is a refusal, not a pass.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

PIN_SCHEMA = "gnn-importer-pin/v1"
REQUIRED_DISTRIBUTIONS = ("defusedxml", "psutil", "pyyaml")
PIN_FILE = Path(".github/gnn-pin.json")
# A disposable environment for the pinned parser. Ignored by git (see .gitignore).
DEFAULT_VENV = Path(".gate/gnn-venv")
# The pinned parser declares `requires-python = ">=3.11,<3.15"`; the environment
# below has to satisfy that regardless of which interpreter runs this script.
PYTHON_FLOOR = (3, 11)
PYTHON_CEILING = (3, 15)
INTERPRETER_CANDIDATES = ("python3.12", "python3.13", "python3.11", "python3.14")


def load_pin(root: Path) -> dict:
    pin_path = root / PIN_FILE
    pin = json.loads(pin_path.read_text(encoding="utf-8"))
    if pin.get("schema") != PIN_SCHEMA:
        raise SystemExit(f"{pin_path} has schema {pin.get('schema')!r}, expected {PIN_SCHEMA!r}")
    for field in ("repository", "revision", "tag"):
        if not pin.get(field):
            raise SystemExit(f"{pin_path} is missing {field!r}")
    return pin


def interpreter_version(python: Path) -> tuple[int, int] | None:
    result = subprocess.run(
        [str(python), "-c", "import sys; print('%d.%d' % sys.version_info[:2])"],
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        return None
    major, minor = result.stdout.strip().split(".")
    return int(major), int(minor)


def select_interpreter(explicit: Path | None) -> Path:
    """The pinned package refuses interpreters outside its declared range."""
    if explicit is not None:
        version = interpreter_version(explicit)
        if version is None:
            raise SystemExit(f"{explicit} is not a usable Python interpreter")
        if not (PYTHON_FLOOR <= version < PYTHON_CEILING):
            raise SystemExit(
                f"{explicit} is Python {version[0]}.{version[1]}; the pin needs "
                f">={PYTHON_FLOOR[0]}.{PYTHON_FLOOR[1]},<{PYTHON_CEILING[0]}.{PYTHON_CEILING[1]}"
            )
        return explicit

    candidates: list[Path] = []
    for name in INTERPRETER_CANDIDATES:
        found = shutil.which(name)
        if found:
            candidates.append(Path(found))
    uv_python_root = Path.home() / ".local" / "share" / "uv" / "python"
    if uv_python_root.is_dir():
        candidates.extend(sorted(uv_python_root.glob("cpython-3.12*/bin/python3.12")))
        candidates.extend(sorted(uv_python_root.glob("cpython-3.13*/bin/python3.13")))
        candidates.extend(sorted(uv_python_root.glob("cpython-3.11*/bin/python3.11")))
    candidates.append(Path(sys.executable))

    for candidate in candidates:
        version = interpreter_version(candidate)
        if version is not None and PYTHON_FLOOR <= version < PYTHON_CEILING:
            return candidate
    raise SystemExit(
        "no Python in "
        f">={PYTHON_FLOOR[0]}.{PYTHON_FLOOR[1]},<{PYTHON_CEILING[0]}.{PYTHON_CEILING[1]} found; "
        "install one (for example `uv python install 3.12`) or pass --python"
    )


def environment_is_current(python: Path, expected_version: str) -> bool:
    if not python.exists():
        return False
    probe = (
        "import gnn, defusedxml, psutil, yaml\n"
        "print(gnn.__version__)\n"
    )
    result = subprocess.run(
        [str(python), "-c", probe],
        capture_output=True,
        text=True,
        check=False,
    )
    return result.returncode == 0 and result.stdout.strip() == expected_version


def build_environment(
    root: Path, venv: Path, pin: dict, expected_version: str, base_python: Path
) -> Path:
    python = venv / "bin" / "python"
    if environment_is_current(python, expected_version):
        return python

    # A stale or partial environment is replaced rather than patched.
    if venv.exists():
        shutil.rmtree(venv)
    venv.parent.mkdir(parents=True, exist_ok=True)
    subprocess.check_call([str(base_python), "-m", "venv", str(venv)], cwd=root)

    subprocess.check_call(
        [str(python), "-m", "pip", "install", "--disable-pip-version-check", *REQUIRED_DISTRIBUTIONS],
        cwd=root,
    )
    spec = (
        "generalized-notation-notation @ "
        f"git+https://github.com/{pin['repository']}.git@{pin['revision']}"
    )
    subprocess.check_call(
        [str(python), "-m", "pip", "install", "--disable-pip-version-check", "--no-deps", spec],
        cwd=root,
    )
    if not environment_is_current(python, expected_version):
        raise SystemExit("pinned GNN parser did not import at the expected version after installation")
    return python


def require_verified_type_check(
    result: bool | int | None, subject: str, output_dir: Path
) -> None:
    """Refuse every type-check verdict except the checker's literal ``True``.

    ``GNNTypeChecker.validate_gnn_files`` returns ``True`` when every file
    validates, ``2`` when the run completed but files were invalid **or none
    were found**, and ``False`` on a hard failure. ``2`` is truthy, so a
    truthiness test lets a rejected model print ``"verified"``; only ``True``
    means the checked set passed.
    """
    if result is True:
        return
    details: list[str] = []
    results_file = output_dir / "type_check_results.json"
    if results_file.is_file():
        try:
            recorded = json.loads(results_file.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            recorded = {}
        details.extend(str(error) for error in recorded.get("errors", []))
        for validation in recorded.get("validation_results", []):
            details.extend(str(error) for error in validation.get("errors", []))
    report = "".join(f"\n  - {detail}" for detail in details)
    raise SystemExit(
        f"GNN type checker did not verify the {subject}: it returned {result!r}, "
        f"and only True passes{report}"
    )


def conformance_body(root: Path, pin: dict) -> None:
    """Runs inside the pinned interpreter's environment; imports the parser."""
    from gnn import __version__
    from gnn.parsers.basic import parse_gnn_formal, validate_gnn_syntax
    from gnn.type_checker import GNNTypeChecker

    expected_version = pin["tag"].removeprefix("v")
    if __version__ != expected_version:
        raise SystemExit(f"installed GNN {__version__!r} does not match {pin['tag']!r}")

    sketches = sorted(root.rglob("*.gnn.md"))
    sketches = [
        path
        for path in sketches
        if not any(
            part in {"node_modules", ".git", "dist", ".next", ".gate"}
            for part in path.relative_to(root).parts
        )
    ]

    if sketches:
        for sketch in sketches:
            parsed = parse_gnn_formal(sketch)
            if parsed is None or getattr(parsed, "parse_errors", None):
                raise SystemExit(f"{sketch} did not parse cleanly")
            valid, errors = validate_gnn_syntax(sketch.read_text(encoding="utf-8"))
            if not valid:
                raise SystemExit(f"{sketch} syntax errors: {errors!r}")
        with tempfile.TemporaryDirectory(prefix="repo-gnn-") as output_dir:
            model_dir = Path(output_dir) / "models"
            model_dir.mkdir()
            for index, sketch in enumerate(sketches):
                shutil.copy2(sketch, model_dir / f"{index:03d}_{sketch.name}")
            require_verified_type_check(
                GNNTypeChecker().validate_gnn_files(model_dir, Path(output_dir)),
                "repository sketches",
                Path(output_dir),
            )
        checked = len(sketches)
        source = "repository"
    else:
        exemplar_url = (
            "https://raw.githubusercontent.com/"
            f"{pin['repository']}/{pin['revision']}/input/gnn_files/basics/static_perception.md"
        )
        with tempfile.TemporaryDirectory(prefix="pinned-exemplar-") as output_dir:
            exemplar = Path(output_dir) / "static_perception.md"
            urllib.request.urlretrieve(exemplar_url, exemplar)
            parsed = parse_gnn_formal(exemplar)
            if parsed is None or getattr(parsed, "parse_errors", None):
                raise SystemExit("pinned exemplar did not parse cleanly")
            valid, errors = validate_gnn_syntax(exemplar.read_text(encoding="utf-8"))
            if not valid:
                raise SystemExit(f"pinned exemplar syntax errors: {errors!r}")
            model_dir = Path(output_dir) / "models"
            model_dir.mkdir()
            shutil.copy2(exemplar, model_dir / exemplar.name)
            require_verified_type_check(
                GNNTypeChecker().validate_gnn_files(model_dir, Path(output_dir)),
                "pinned exemplar",
                Path(output_dir),
            )
        checked = 1
        source = "pinned-exemplar"

    print(
        json.dumps(
            {
                "gnn-version": __version__,
                "pin-revision": pin["revision"],
                "models": checked,
                "source": source,
                "result": "verified",
            },
            sort_keys=True,
        )
    )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument(
        "--root",
        type=Path,
        default=Path(__file__).resolve().parent.parent,
        help="repository root (default: the checkout this script lives in)",
    )
    parser.add_argument(
        "--venv",
        type=Path,
        default=None,
        help=f"virtual environment for the pinned parser (default: <root>/{DEFAULT_VENV})",
    )
    parser.add_argument(
        "--python",
        type=Path,
        default=None,
        help="interpreter used to create the environment (default: first compatible on PATH)",
    )
    parser.add_argument(
        "--no-venv",
        action="store_true",
        help="use the current interpreter instead of creating an isolated environment",
    )
    args = parser.parse_args(argv)

    root = args.root.resolve()
    pin = load_pin(root)
    expected_version = pin["tag"].removeprefix("v")

    if args.no_venv:
        if not environment_is_current(Path(sys.executable), expected_version):
            raise SystemExit(
                "the current interpreter lacks the pinned parser; run without --no-venv "
                "or install the pin yourself"
            )
        conformance_body(root, pin)
        return 0

    venv = (args.venv or (root / DEFAULT_VENV)).resolve()
    explicit = args.python or (Path(os.environ["GNN_PYTHON"]) if os.environ.get("GNN_PYTHON") else None)
    base_python = select_interpreter(explicit)
    python = build_environment(root, venv, pin, expected_version, base_python)
    return subprocess.call([str(python), str(Path(__file__).resolve()), "--root", str(root), "--no-venv"])


if __name__ == "__main__":
    raise SystemExit(main())
