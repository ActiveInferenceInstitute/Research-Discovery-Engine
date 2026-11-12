# GNN conformance

The conformance check exists in two places that are the same code: the local arm
`./run.sh gnn` and the `gnn-conformance` job in
[`workflows/ci.yml`](workflows/ci.yml), whose display name is
`gnn conformance (pinned)`. The workflow does not embed the check; it runs

```bash
GNN_PYTHON="$(uv python find 3.12)" ./run.sh gnn
```

which executes [`../scripts/gnn_conformance.py`](../scripts/gnn_conformance.py).

## The pin

Canonical pin file: [`.github/gnn-pin.json`](gnn-pin.json), schema
`gnn-importer-pin/v1`.

```json
{
  "schema": "gnn-importer-pin/v1",
  "repository": "ActiveInferenceInstitute/Generalized_Notation_Notation",
  "revision": "8f293d9ba810e6eda5c09842d9c7ed9ffa5f92c1",
  "tag": "v5.0.3",
  "recorded": "2026-11-12"
}
```

The script refuses a pin whose schema is not `gnn-importer-pin/v1`, and refuses
an installed parser whose `gnn.__version__` does not match the pin's `tag`
(`v` prefix removed).

## What the job parses

1. It installs the pinned package from
   `git+https://github.com/<repository>.git@<revision>` with `--no-deps`, plus
   its three direct dependencies (`defusedxml`, `psutil`, `pyyaml`).
2. It collects every `*.gnn.md` sketch in the repository, outside `node_modules`,
   `.git`, `dist`, `.next` and `.gate`, and for each one:
   - `gnn.parsers.basic.parse_gnn_formal(...)` must return a parse with no
     `parse_errors`;
   - `gnn.parsers.basic.validate_gnn_syntax(...)` must report valid;
   - the whole set must pass `gnn.type_checker.GNNTypeChecker().validate_gnn_files(...)`.
3. When the repository has no sketch yet, it parses the pinned upstream exemplar
   `input/gnn_files/basics/static_perception.md` at the pinned revision and
   type-checks that instead. This is a pin and pipeline conformance baseline, not
   a claim that this repository already contains a model.

On success it prints one JSON object:

```json
{"gnn-version": "5.0.3", "models": 1, "pin-revision": "8f293d9ba810e6eda5c09842d9c7ed9ffa5f92c1", "result": "verified", "source": "pinned-exemplar"}
```

## Environment

- The pinned parser declares `requires-python = ">=3.11,<3.15"`. The script
  selects a compatible interpreter (PATH, then uv-managed interpreters) or takes
  one from `--python` / `GNN_PYTHON`. The CI job supplies the uv-installed 3.12
  through the estate composite action
  `ActiveInferenceInstitute/.github/.github/actions/setup-python-uv@7159e67315330aac8e414aebae0ad1e999a41448`
  with `python-version: "3.12"` and `enable-cache: "false"` (there is no
  `uv.lock`, so the default cache key would match nothing).
- Locally the interpreter and dependencies live in `.gate/gnn-venv`, which is
  ignored by git and rebuilt only when the pin or the dependency set changes.
  The first run needs network access; later runs do not.

## Changing the pin

Update `gnn-pin.json` (`revision`, `tag`, `recorded`) and run `./run.sh gnn`.
The arm deletes and rebuilds `.gate/gnn-venv` when the installed version no
longer matches the pin, so a stale environment cannot mask a bad pin.
