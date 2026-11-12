"""Selftest for the type-check verdict `scripts/gnn_conformance.py` accepts.

`GNNTypeChecker.validate_gnn_files` returns `True` when every file validates,
`2` when the run completed but files were invalid or none were found, and
`False` on a hard failure. `2` is truthy, so a truthiness test reports
`"verified"` for a rejected model. This drives `conformance_body` with a stub
`gnn` package and asserts the accepted set: `True` verifies, while `2`, `False`,
`None` and `0` are refused with the returned value reported.

Deterministic, offline, no pinned environment and no repository state touched.
Run from the `gnn` arm so it cannot rot.
"""

from __future__ import annotations

import contextlib
import io
import json
import sys
import tempfile
import types
from pathlib import Path

import gnn_conformance

PIN = {
    "schema": "gnn-importer-pin/v1",
    "repository": "ActiveInferenceInstitute/Generalized_Notation_Notation",
    "revision": "8f293d9ba810e6eda5c09842d9c7ed9ffa5f92c1",
    "tag": "v5.0.3",
}

STUBBED_MODULES = ("gnn", "gnn.parsers", "gnn.parsers.basic", "gnn.type_checker")


class _Parsed:
    parse_errors: list[str] = []


@contextlib.contextmanager
def _gnn_stub(checker_result: bool | int | None):
    """Install a fake `gnn` package whose checker returns `checker_result`."""
    saved = {name: sys.modules.get(name) for name in STUBBED_MODULES}

    gnn = types.ModuleType("gnn")
    gnn.__version__ = PIN["tag"].removeprefix("v")
    parsers = types.ModuleType("gnn.parsers")
    basic = types.ModuleType("gnn.parsers.basic")
    basic.parse_gnn_formal = lambda path: _Parsed()
    basic.validate_gnn_syntax = lambda text: (True, [])
    type_checker = types.ModuleType("gnn.type_checker")

    class _Checker:
        def validate_gnn_files(self, target_dir, output_dir, **kwargs):
            return checker_result

    type_checker.GNNTypeChecker = _Checker
    gnn.parsers = parsers
    parsers.basic = basic
    sys.modules.update(
        {
            "gnn": gnn,
            "gnn.parsers": parsers,
            "gnn.parsers.basic": basic,
            "gnn.type_checker": type_checker,
        }
    )
    try:
        yield
    finally:
        for name, module in saved.items():
            if module is None:
                sys.modules.pop(name, None)
            else:
                sys.modules[name] = module


def _run(checker_result: bool | int | None) -> tuple[bool, str]:
    """Run `conformance_body` once; return (passed, printed output or refusal)."""
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        (root / "sketch.gnn.md").write_text("# stub sketch\n", encoding="utf-8")
        stream = io.StringIO()
        with _gnn_stub(checker_result), contextlib.redirect_stdout(stream):
            try:
                gnn_conformance.conformance_body(root, PIN)
            except SystemExit as exit_error:
                return False, str(exit_error.code)
        return True, stream.getvalue()


def run() -> list[str]:
    failures: list[str] = []

    passed, output = _run(True)
    if not passed:
        failures.append(f"selftest: True was refused: {output}")
    else:
        try:
            recorded = json.loads(output).get("result")
        except ValueError:
            recorded = None
        if recorded != "verified":
            failures.append(f"selftest: True did not report verified: {output!r}")

    for verdict in (2, False, None, 0):
        passed, output = _run(verdict)
        if passed:
            failures.append(f"selftest: {verdict!r} was accepted as verified: {output!r}")
        elif repr(verdict) not in output:
            failures.append(f"selftest: refusing {verdict!r} did not report the value: {output!r}")
    return failures


if __name__ == "__main__":  # pragma: no cover - the arm imports run()
    problems = run()
    for message in problems:
        print(message, file=sys.stderr)
    sys.exit(1 if problems else 0)
