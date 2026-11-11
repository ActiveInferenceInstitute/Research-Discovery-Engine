# Research-Discovery-Engine — agent guidance

This repository is a set of related research prototypes, not one installable package. The human entry point is [README.md](README.md); contribution and validation expectations are in [CONTRIBUTING.md](CONTRIBUTING.md), and the open documentation backlog is [TO-DO.md](TO-DO.md).

## Components

| Path | What it is | Guide |
| --- | --- | --- |
| `DE/` | React/TypeScript/Vite Discovery Engine frontend | [DE/README.md](DE/README.md), [DE/docs/README.md](DE/docs/README.md) |
| `path/` | Python network-analysis pipeline over `DE/KG/` | [path/README.md](path/README.md) |
| `resnei/` | Flask ResNei prototype | [resnei/README.md](resnei/README.md) |
| `website_explore_the_unknown/` | Next.js + Flask website prototype | [website README](website_explore_the_unknown/README.md) |
| `Docs/` | Numbered system-design series, indexed by `Docs/0. DE-Paper-Outline.md` | root `README.md` |
| `ResNei SDD/` | ResNei software design document and figures | `ResNei SDD/resnei.md` |

## Generated and data trees: do not add guides inside them

- `DE/KG/*.md` and `DE/publications/*.md` are **content**, not documentation. `DE/scripts/sync-kg.mjs` reads every `.md` in both directories, mirrors them to the generated `DE/public/KG/`, and asserts the built `dist/KG/`; a README or AGENTS file there would become a knowledge-base document or publication record. Use `DE/README.md` for their guide.
- `DE/public/KG/` is generated and ignored; `DE/public/prompts/` is served directly at `/prompts/`. Do not add documentation files under `DE/public/`.
- `DE/scripts/output/`, `DE/scripts/outputs/`, and `DE/scripts/test-batch/` are retained run records from the 2025-06-11 sessions, cited in `COHERENCE_ASSESSMENT.md` and `README_HEADLESS.md`. They are evidence, not disposable build output. `DE/scripts/README.md` is their guide; do not add a README inside a timestamped run.
- `path/results/` is checked-in analysis output; `path/README.md` documents every stage. Add analysis commentary there, not inside a results directory.
- `Docs/videos/` and `ResNei SDD/images/` are media leaves; their parent documents are the guides.

## Validation

- Frontend (`DE/`): `cd DE && npm ci && npm run build`. CI also runs the credential-free harness subsets with `npx tsx scripts/run-tests.ts --test-type unit|integration|validation` and asserts `Failed: 0`; the harness exits 0 even when tests fail, so a gate must parse the report. `npm run lint` is currently broken and `npm run build` runs `tsc` before Vite; see `DE/docs/FINAL_STATUS.md`.
- Analysis (`path/`): `cd path && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && python research_paths.py`.
- Flask prototypes: `resnei/` needs `flask` and `markdown`; `website_explore_the_unknown/` needs its Node dependencies and Python `requirements.txt`. See each component guide.
- There is no repository-wide test runner. Change one component at a time, run its check, and state what you could not run.

## Rules

- Keep changes scoped to the component they affect; update the nearest guide when commands, paths, configuration names, or outputs change.
- Never commit `.env` files, API keys, generated caches, or private research data.
- Do not add a README or AGENTS file inside a generated, data, or build-output directory; extend the parent guide instead.
