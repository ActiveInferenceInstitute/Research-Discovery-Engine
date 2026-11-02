# Research Discovery Engine — current status

**Verified against this tree on 2026-11-02** with Node 26.13.0 and npm 11.20.0: `npm ci` and `npm run build` both exit 0, and the knowledge-base assertion passes.

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
| `ReadMe.md`, `CONTRIBUTING.md`, `TO-DO.md`, `REVIEW_LOG_2026-08-02.md` | repository-level guides and records |

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
- The repository ships `DE/scripts/run-tests.ts` (652 lines), a standalone harness: `npx tsx scripts/run-tests.ts --test-type unit|integration|validation|llm|all`.
- Measured without provider credentials: `unit` 5/5, `integration` 3/3 and `validation` 3/3 pass; `--test-type llm` reports 7 failures. The harness exits 0 in every case, including when tests fail, so a gate has to assert the reported failure count rather than the exit code.
- `.github/workflows/ci.yml` is the repository's CI: Node 24 on `ubuntu-24.04`, `actions/checkout` and `actions/setup-node` pinned by commit SHA, `npm ci` from `package-lock.json`, the three credential-free harness subsets (asserting `Failed: 0`), then `npm run build`, which covers the type check, the Vite build, the knowledge-base mirror and its assertion. It runs no secrets and no scanners. Measured from a fresh checkout under Node 24.22.2: every step exits 0, and removing a document from `dist/KG/` makes the assertion exit 1.
- `npm run lint` cannot run: the script passes `--ext ts,tsx`, which a flat config rejects, and `eslint.config.js` imports `@eslint/js`, `globals` and `typescript-eslint`, none of which the manifest depends on (it lists the older `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` instead). CI does not invoke it.

## Known gaps

- The agent and LLM features in the interface are simulated in the frontend; the script tooling that talks to a provider (`llm-generate-summary.ts`, `llm-process-knowledge.ts`, `test-openai.ts`, `openrouter-test.ts`) needs credentials and is not exercised without them.
- `DE/src/App.new.tsx` (311 lines) is referenced by nothing in the tree.
- `resnei/resnei/` duplicates the outer prototype: `templates/index.html` is byte-identical to `resnei/index.html` and `app.py` differs in one line (the Flask `template_folder` argument).
- The root `config.py` has no importer among tracked Python files.
- Frontend anchors for knowledge-base links are generated by an application-specific slugifier that does not always match Markdown/GitHub anchors.
- The pipeline output-directory mismatch described above is unresolved by design; the checked-in results are the record.
- The generated script run records under `DE/scripts/output/`, `DE/scripts/outputs/` and `DE/scripts/test-batch/` stay tracked on purpose (`DE/scripts/README_HEADLESS.md` documents them as the archival record of processing runs).

## Recent changes

- 2026-11-02 — CI added (`.github/workflows/ci.yml`), and this status record rewritten around the tree's measured behaviour.
- 2026-11-02 — dead `.cursorrules` references removed from the DE documentation.
- 2026-11-02 — single knowledge-base home: the analysis pipeline reads `DE/KG/`, and the duplicate copies that used to live in `path/` are gone.
- 2026-11-02 — the runtime knowledge-base wiring is fixed: `DE/public/KG/` is generated at dev and build time instead of being missing.
- 2026-11-02 — the only tracked `.DS_Store` removed; branch and pull-request review completed (no branch was proven merged, so none was pruned).

## Documentation map

| document | content |
| --- | --- |
| `ReadMe.md`, `CONTRIBUTING.md`, `TO-DO.md` | repository overview, contribution guide, open documentation items |
| `DE/README.md`, `DE/docs/README.md` | application overview, LLM configuration, documentation index |
| `DE/docs/DEVELOPMENT_GUIDE.md`, `STARTUP_GUIDE.md`, `TROUBLESHOOTING.md` | setup, development commands, coding standards, common failures |
| `DE/docs/DEPLOYMENT.md` | static hosting, container and CI deployment options |
| `DE/docs/COMPONENTS.md`, `API_REFERENCE.md` | component and utility reference |
| `DE/docs/SCRIPT_USAGE.md`, `DE/scripts/README.md`, `HEADLESS_MODE.md`, `README_HEADLESS.md` | the standalone script toolkit |
| `DE/scripts/COHERENCE_ASSESSMENT.md`, `LLM_API_VALIDATION_REPORT.md` | script-run records from the June 2025 sessions |
| `DE/docs/OUTPUT_DIRECTORY_STRUCTURE.md` | where script runs write their output |
| `DE/docs/TECHNICAL_ASSESSMENT.md`, `FINAL_STATUS.md` | assessment and this status record |
| `path/README.md` | the analysis pipeline and its results |
| `Docs/` | the numbered design-document series |
| `REVIEW_LOG_2026-08-02.md` | dated review record |
