# Research Discovery Engine — current status

**Verified against this tree on 2026-11-02** with Node 26.13.0 and npm 11.20.0: `npm ci` and `npm run build` both exit 0, and the knowledge-base assertion passes. **Re-measured 2026-11-12** under Node 26.13.0, npm 11.20.0 and Python 3.15.2 through the repository gate `./run.sh`; the per-arm numbers are generated in [`../../Docs/GATE_METRICS.md`](../../Docs/GATE_METRICS.md).

This document replaces the earlier "final status" report. That revision carried a June 2025 refactoring summary whose benchmark tables and coverage claims could not be reproduced from the tree (the scripts index in `DE/scripts/README.md` carries the same caveat). Everything below is either measured from the tree or explicitly marked as a gap.

## What the repository contains

| path | what it is |
| --- | --- |
| `DE/` | the React/TypeScript application (Vite), its scripts, and its documentation |
| `DE/KG/` | the single canonical knowledge base: 9 Markdown documents |
| `DE/publications/` | 270 Markdown publication records cited by the knowledge base |
| `DE/public/KG/` | **generated** mirror of the two directories above; ignored by git (see "Knowledge base" below) |
| `path/` | the Python knowledge-graph analysis pipeline, its inputs and its checked-in results |
| `resnei/` | Flask prototypes for the "ResNei" document-analyser experiments |
| `website_explore_the_unknown/` | the separate Next.js marketing/onboarding site |
| `Docs/` | the numbered design-document series |
| `README.md`, `CONTRIBUTING.md`, `TO-DO.md`, `REVIEW_LOG_2026-08-02.md` | repository-level guides and records |

The application itself: 63 TypeScript/TSX files under `DE/src`, 8 component directories and 14 files in `DE/src/utils`.

## Knowledge base

- The canonical documents live in `DE/KG/` (`applications`, `css`, `materials`, `mechanisms`, `merged_ISM`, `methods`, `phenomena`, `theoretical`, `vectors`) and the publication records in `DE/publications/`.
- The document list lives in `DE/src/constants.ts` (mirrored in `DE/src/App.tsx` and `DE/src/components/WikiView/WikiView.tsx`) as `KG/<file>.md`; `DE/src/utils/cnmBuilder.ts`, `DE/src/components/KnowledgeBrowserSidebar.tsx` and `WikiView.tsx` fetch those paths, and publications open as `/KG/publications/<key>.md` (`DE/src/hooks/useAppState.ts`). Vite serves `public/` and copies it into `dist/`, so those files must exist under `DE/public/KG/`.
- `DE/scripts/sync-kg.mjs` builds that mirror from the canonical directories. It runs automatically as `predev` and `prebuild`, can be run directly with `npm run sync-kg`, and `postbuild` asserts that the built `dist/KG/` carries every document. `public/KG/` is ignored, so the canonical directories remain the single committed copy.
- Measured: the build mirrors 9 documents and 270 publication records; removing a document from `dist/KG/` makes `node scripts/sync-kg.mjs --check-dist` exit 1 with the missing file named.

## Analysis pipeline (`path/`)

- `path/research_paths.py` reads the six category documents from the canonical `DE/KG/`, resolved from the script's own location rather than the working directory.
- It writes to `OUTPUT_DIR = knowledge_graph_final_definitive` relative to the working directory, while the checked-in artifacts were consolidated under `path/results/`; `path/README.md` documents that mismatch.
- Measured against the checked-in results in a temporary workspace (Python 3.12.15 with `path/requirements.txt`): stage 1 has the same 267 nodes and categories with PageRank agreeing to 1.7e-18 and identical entropy; stage 2 is byte-identical; stage 4 has all 2,823 node pairs identical with zero score deltas; stages 3 and 5 agree modulo the order of tied rows.

## Testing and automation

- There is **no automated test suite**: no Jest, Vitest, Playwright or Cypress configuration, and no `test` script in `package.json`.
- The repository ships `DE/scripts/run-tests.ts`, a standalone harness: `npx tsx scripts/run-tests.ts --test-type unit|integration|validation|llm|all`.
- Measured without provider credentials: `unit` 5/5, `integration` 3/3 and `validation` 3/3 pass; `--test-type llm` reports 7 failures. The harness exits 0 in every case, including when tests fail, so a gate has to assert the reported failure count rather than the exit code.
- **One gate entry point.** `./run.sh <arm>` at the repository root is the only definition of the checks: `fast` (the three credential-free subsets, asserting `Failed: 0`), `build`, `website`, `docs`, `gnn`, plus `lint` and `types`, which are runnable and currently red. `./run.sh all` is the blocking set; `./run.sh strict` adds the two red checks; `./run.sh metrics` regenerates [`../../Docs/GATE_METRICS.md`](../../Docs/GATE_METRICS.md), which carries the measured wall times, test counts and finding counts. See [`../../Docs/RUN_GUIDE.md`](../../Docs/RUN_GUIDE.md).
- `.github/workflows/ci.yml` calls those arms instead of restating their commands. It has three jobs: `gate` (Node 24 on `ubuntu-24.04`, `actions/checkout` and `actions/setup-node` pinned by commit SHA, `npm ci` from `package-lock.json`, then `./run.sh fast`, `./run.sh build`, `./run.sh docs`), `website` (Next.js build from its own lockfile), and `gnn-conformance`, which installs Python through the estate composite action `ActiveInferenceInstitute/.github/.github/actions/setup-python-uv` pinned at `7159e67315330aac8e414aebae0ad1e999a41448` and then runs `./run.sh gnn`. GitHub Actions is billing-locked for this estate, so the local gate is the authority and no workflow run is claimed here. Measured locally under Node 26.13.0 on 2026-11-12: every blocking arm exits 0, and removing a document from `dist/KG/` still makes the build assertion exit 1.
- `npm run build` does **not** type-check. `tsconfig.json` is a solution file (`"files": []`, referencing `tsconfig.app.json` and `tsconfig.node.json`), so the bare `tsc` in the build script exits 0 without looking at a single file. A real check is `npx tsc -b`; after the 2026-11-06 parse repair and the unused-symbol removal it runs to completion and reports **97 pre-existing errors** (TS2339, TS2322, TS7006, TS2459, TS2367, …) across 26 files. The earlier "231 errors" figure included 126 mechanical unused-symbol findings that have since been removed, and the long-recorded "42 errors" was a truncated surface produced while two files failed to parse.
- `npm run lint` **runs** after the ESLint 10 flat-config migration (dependency PR #71): `eslint . --report-unused-disable-directives --max-warnings 0` against `eslint.config.js`, which uses `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`. It reports **400 problems (387 errors, 13 warnings)** — mostly `@typescript-eslint/no-explicit-any` and `@typescript-eslint/no-unused-vars` — so with `--max-warnings 0` the script exits 1. Neither red check is enforced by CI; the exact counts are generated in `Docs/GATE_METRICS.md`.

## Known gaps

- The agent and LLM features in the interface are simulated in the frontend; the script tooling that talks to a provider (`llm-generate-summary.ts`, `llm-process-knowledge.ts`, `test-openai.ts`, `openrouter-test.ts`) needs credentials and is not exercised without them.
- `DE/src/App.new.tsx` (311 lines) is referenced by nothing in the tree.
- `resnei/resnei/` duplicates the outer prototype: `templates/index.html` is byte-identical to `resnei/index.html` and `app.py` differs in one line (the Flask `template_folder` argument).
- The root `config.py` has no importer among tracked Python files.
- Frontend anchors for knowledge-base links are generated by an application-specific slugifier that does not always match Markdown/GitHub anchors.
- The pipeline output-directory mismatch described above is unresolved by design; the checked-in results are the record.
- The generated script run records under `DE/scripts/output/`, `DE/scripts/outputs/` and `DE/scripts/test-batch/` stay tracked on purpose (`DE/scripts/README_HEADLESS.md` documents them as the archival record of processing runs).

## Recent changes

- 2026-11-12 — one gate entry point (`run.sh`) with separately runnable arms, and `.github/workflows/ci.yml` rewritten to call those arms (`gate`, `website`, `gnn-conformance` jobs) instead of restating commands. Measured per-arm wall times and finding counts are generated into `Docs/GATE_METRICS.md` by `./run.sh metrics`. No frontend behaviour changed: `lint` still reports its pre-existing findings and `tsc -b` its pre-existing errors, both now recorded by the gate rather than described in prose.
- 2026-11-12 — dependency migrations landed for both frontends: the DE frontend on ESLint 10 with a flat config, Tailwind CSS 4 and Vite 8 (PR #71), and `website_explore_the_unknown/` on Next.js 16, React 19, Tailwind CSS 4 and ESLint 10 (PR #66). The website's `next build` now runs its own TypeScript step.
- 2026-11-06 — the two syntax-broken source files are gone: the `src/hooks/useAgentInteraction.ts` stub deleted and `src/utils/stateUtils.ts` repaired (`createElement` for the JSX in a `.ts` file, unused-parameter and generic-action renames). `npx tsc -b` now runs to completion and reports the real surface; the earlier 42-error figure was truncated by the parse failures. No gate was wired and no semantic error was fixed in this change.
- 2026-11-02 — CI added (`.github/workflows/ci.yml`), and this status record rewritten around the tree's measured behaviour.
- 2026-11-02 — dead `.cursorrules` references removed from the DE documentation.
- 2026-11-02 — single knowledge-base home: the analysis pipeline reads `DE/KG/`, and the duplicate copies that used to live in `path/` are gone.
- 2026-11-02 — the runtime knowledge-base wiring is fixed: `DE/public/KG/` is generated at dev and build time instead of being missing.
- 2026-11-02 — the only tracked `.DS_Store` removed; branch and pull-request review completed (no branch was proven merged, so none was pruned).

## Documentation map

| document | content |
| --- | --- |
| `README.md`, `CONTRIBUTING.md`, `TO-DO.md` | repository overview, contribution guide, open documentation items |
| `DE/README.md`, `DE/docs/README.md` | application overview, LLM configuration, documentation index |
| `DE/docs/DEVELOPMENT_GUIDE.md`, `STARTUP_GUIDE.md`, `TROUBLESHOOTING.md` | setup, development commands, coding standards, common failures |
| `DE/docs/DEPLOYMENT.md` | static hosting, container and CI deployment options |
| `DE/docs/COMPONENTS.md`, `API_REFERENCE.md` | component and utility reference |
| `DE/docs/SCRIPT_USAGE.md`, `DE/scripts/README.md`, `HEADLESS_MODE.md`, `README_HEADLESS.md` | the standalone script toolkit |
| `DE/scripts/COHERENCE_ASSESSMENT.md`, `LLM_API_VALIDATION_REPORT.md` | script-run records from the June 2025 sessions |
| `DE/docs/OUTPUT_DIRECTORY_STRUCTURE.md` | where script runs write their output |
| `DE/docs/TECHNICAL_ASSESSMENT.md`, `FINAL_STATUS.md` | assessment and this status record |
| `path/README.md` | the analysis pipeline and its results |
| `Docs/` | the numbered design-document series, its hub [`Docs/README.md`](../../Docs/README.md) and flat index [`Docs/documentation-index.md`](../../Docs/documentation-index.md) |
| `Docs/RUN_GUIDE.md`, `Docs/GATE_METRICS.md` | the gate arms, the checks that are known red, and the generated measurements |
| `website_explore_the_unknown/README.md` | the Next.js 16 site, its Flask API and its toolchain |
| `REVIEW_LOG_2026-08-02.md` | dated review record |
