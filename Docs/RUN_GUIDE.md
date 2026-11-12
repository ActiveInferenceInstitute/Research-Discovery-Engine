# Run guide — the repository gate

`./run.sh` is this repository's single entry point for every check it runs. Each
arm is one command, and [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)
calls these arms instead of restating them, so there is exactly one copy of every
command in the tree.

GitHub Actions is billing-locked for this estate, so **the local gate is the
authority**. A green workflow run is not available today; a green `./run.sh all`
is what a change has to produce.

## Setup once

Each component installs from its own lockfile:

```bash
cd DE && npm ci && cd ..
cd website_explore_the_unknown && npm ci && cd ..
```

The Python arms need only `python3`; `./run.sh gnn` creates its own environment.

## Arms

| Arm | Command | What it proves | CI job |
| --- | --- | --- | --- |
| `fast` | `./run.sh fast` | the credential-free harness subsets (`unit`, `integration`, `validation`) pass and each report says `Failed: 0` | `gate` |
| `build` | `./run.sh build` | `DE/` builds, the knowledge-base mirror is regenerated, and `dist/KG` carries every document and publication record | `gate` |
| `website` | `./run.sh website` | the Next.js site builds, including its own TypeScript step | `website` |
| `docs` | `./run.sh docs` | relative Markdown links and anchors resolve; Publishing artifact digests match and the canonical drift selftest passes | `gate` |
| `gnn` | `./run.sh gnn` | the pinned GNN parser installs at the pinned revision, then parses and type-checks the conformance target | `gnn-conformance` |
| `lint` | `./run.sh lint` | ESLint findings in `DE/` (currently red — see below) | none |
| `types` | `./run.sh types` | `tsc -b` findings in `DE/` (currently red — see below) | none |
| `all` | `./run.sh all` | `fast` + `build` + `website` + `docs` + `gnn` | all three |
| `strict` | `./run.sh strict` | `all` + `lint` + `types` | none |
| `metrics` | `./run.sh metrics` | re-measures every arm and rewrites [`GATE_METRICS.md`](GATE_METRICS.md) | none |

The frontend build is deliberately **not** part of `fast`: `fast` has to stay
usable on every edit, and the Next.js build takes an order of magnitude longer
than the harness. Use `./run.sh website` before touching `website_explore_the_unknown/`.

### GNN conformance arm

- Canonical pin: `.github/gnn-pin.json`, schema `gnn-importer-pin/v1`.
- The pin's parser declares `requires-python = ">=3.11,<3.15"`. The arm selects a
  compatible interpreter automatically (PATH, then uv-managed interpreters), or
  takes one through `--python` / `GNN_PYTHON`. The host's default `python3` may be
  outside that range; the CI job passes the uv-installed 3.12 explicitly.
- The pinned environment lives in `.gate/gnn-venv` and is rebuilt only when the
  pin or the dependency set changes. The first run needs network access to install
  the pin; later runs do not.
- The arm parses every `*.gnn.md` sketch in the repository. When there is none it
  parses the pinned upstream exemplar, which proves the pin and pipeline rather
  than a model this repository does not contain. See
  [`.github/GNN.md`](../.github/GNN.md).

### Docs arm

The arm first runs the pinned lead identity checker and drift selftest against
[`workflows/publishing.md`](workflows/publishing.md). The schema and checker are
unmodified canonical copies; explicit `Docs/` paths preserve this member's case
on case-sensitive systems. No Journal corpus is claimed or synthesized here.

`scripts/check_docs_links.py` walks `git ls-files '*.md'` and skips generated
content rather than a hand-maintained list: the knowledge base (`DE/KG/`), the
publication records, the generated `public/KG` mirror, retained script-run
records, dependencies and build output. It checks the target exists, that the
case matches (APFS would hide a mismatch), and that a `#fragment` matches a
heading anchor.

```bash
./run.sh docs --verbose   # counts the links and files it walked
```

## Known red checks

Two checks are runnable and non-zero today. They are reported by `./run.sh
strict` and by the generated [gate metrics](GATE_METRICS.md); they are **not**
enforced by `./run.sh all` or by CI.

**This is a blocking debt, not an exemption.** [Issue
#79](https://github.com/ActiveInferenceInstitute/Research-Discovery-Engine/issues/79)
is the acceptance line: `./run.sh strict` must exit 0, and adding `lint` and
`types` to `./run.sh all` (and therefore to CI) is the closure action for that
issue — not a separate decision. The gate landed with both arms red; that is
recorded here and in the issue so the deviation stays visible.

| Check | Command | State |
| --- | --- | --- |
| `lint` | `./run.sh lint` | `npm run lint` runs after the ESLint 10 flat-config migration, but reports pre-existing findings: mainly `@typescript-eslint/no-explicit-any` and `@typescript-eslint/no-unused-vars`, and `--max-warnings 0` turns them into a failure. |
| `types` | `./run.sh types` | `tsc -b` runs to completion after the 2026-11-06 parse repair and reports the real, pre-existing error surface — most of them missing exports, a stale `LinkObject` shape, and a handful of identifiers that no longer exist. |

Neither check is a formality: the counts are recorded by `./run.sh metrics`, so a
change that makes either worse shows up in the diff of `Docs/GATE_METRICS.md`.
The DE build still runs a bare `tsc` that checks nothing (`tsconfig.json` is a
solution file), so `build` does not prove the type surface.

## Measuring

Wall time is measured, never estimated:

```bash
./run.sh metrics            # all arms, one run each
./run.sh metrics --only fast
```

`scripts/gate_metrics.py` runs each arm via `./run.sh`, records the wall time,
exit status, test counts and finding counts, writes the logs to `.gate/metrics/`,
and rewrites [`GATE_METRICS.md`](GATE_METRICS.md). Do not hand-edit that file; the
numbers are the script's.
