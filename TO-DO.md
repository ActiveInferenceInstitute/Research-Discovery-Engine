# Documentation TODO

Last reviewed: 2026-11-12 (gate and documentation-index pass) after 2026-11-11

Severity definitions: Minor = typo, broken link, or formatting defect. Medium = stale section rewrite, documentation restructure, or missing focused guide. Major = cross-cutting documentation-system overhaul or new documentation site.

## Minor

- [ ] Fix remaining application-specific KG anchor behavior where the frontend slugifier differs from Markdown/GitHub anchors (`DE/src/utils/markdownParser.ts`, `DE/KG/*.md`). This is a code-adjacent compatibility issue and was deferred from this docs-only pass.
- [ ] Review intentional placeholder/ellipsis content in generated knowledge-base and publication records (`DE/KG/*.md`, `DE/publications/*.md`) when those records are next regenerated; do not treat prose examples as broken repository documentation.

## Medium

- [✓] Correct root README license, repository links, documentation paths, examples, and project status (`README.md`, `CONTRIBUTING.md`) — completed in commit `4ae3d9a`.
- [✓] Make the resnei prototypes runnable and verified (template resolution, upload
  handling) — completed in commit `46a2df7`.
- [✓] Add auditable review record (`REVIEW_LOG_2026-08-02.md`) — completed in commit `4ae3d9a`.
- [✓] Repair the numbered design-document series and truncated use-case table (`Docs/9. Use Cases.md`, `Docs/12. Direction.md`) — completed in commit `4ae3d9a`.
- [✓] Align the DE README and developer/startup indexes with actual files, scripts, environment variables, and package commands (`DE/README.md`, `DE/docs/README.md`, `DE/docs/DEVELOPMENT_GUIDE.md`, `DE/docs/STARTUP_GUIDE.md`) — completed in commit `ebedc6c`.
- [✓] Align the path-analysis guide with the actual pipeline and generated result tree (`path/README.md`) — completed in commit `b419782`.
- [✓] Replace the website's scaffold README with an accurate local setup and route overview (`website_explore_the_unknown/README.md`) — completed in commit `b419782`.
- [✓] Repair duplicate YAML front matter in the general improvement issue template (`.github/ISSUE_TEMPLATE/general-improvement.md`) — completed in commit `b419782`.
- [✓] Remove the dead `.cursorrules` references (`DE/README.md`, `DE/docs/DEVELOPMENT_GUIDE.md`, `DE/docs/README.md`) — completed in commit `ac77bfc`. The file is not in the tree and never was on `main` (it existed only as a 1-byte placeholder on the unmerged `minimal` branch), so there were no live rules to migrate; the standards are documented in the Development Guide's "Coding Standards" section. The dated `REVIEW_LOG_2026-08-02.md` finding is retained as history.
- [✓] Remove the only tracked `.DS_Store` (`path/results/5_Research_Trajectory_Synthesis/.DS_Store`) — completed in commit `d527b21`. Both the root and `DE/` ignore files already list the name.
- [✓] Give the analysis pipeline a single knowledge-base home: `path/research_paths.py` now reads the six category records from the canonical `DE/KG/` (resolved from the script's own location rather than the working directory), the six duplicate `path/*.md` copies are removed, and `path/README.md` documents the arrangement — completed in commit `f289b17`. Node-header sets and wikilink multisets are equal across the renditions, so the graph the pipeline builds is unchanged.
- [✓] Fix the runtime knowledge-base wiring: `DE/public/KG/` never existed on `main` (that layout lived only on the unmerged `kg-algos` branch), so every `/KG/<file>.md` fetch 404ed on a fresh clone. `DE/scripts/sync-kg.mjs` now mirrors the canonical `KG/` documents and the `publications/` records into `public/KG/` as `predev`/`prebuild` and asserts the built `dist/KG/` as `postbuild`; `public/KG/` is ignored, so no second copy is committed — completed in commit `594d0d8`. Verified with `npm ci` and `npm run build` in a temporary copy: both exit 0, 9 documents and 270 publication records land in `dist/KG/`, and removing one document makes the assertion exit 1.

- [✓] Replace the aspirational status report with a verified current-state record: `DE/docs/FINAL_STATUS.md` now describes the repository and knowledge-base layout, the generated `public/KG/` mirror and its assertion, the analysis pipeline with its checked-in results, the credential-free subsets of `scripts/run-tests.ts` (and the fact that the harness exits 0 even when tests fail), and the known gaps; the DE README and documentation index lost their unsupported testing claims in the same change — completed in commit `0a18e6d`.

- [✓] Make the `lint` script runnable — completed by the ESLint 10 / flat-config migration (dependency PR #71). `npm run lint` now executes `eslint . --report-unused-disable-directives --max-warnings 0` against `eslint.config.js` and exits 1 on the code, not on the configuration.
- [ ] Resolve the ESLint findings that keep `npm run lint` red: **400 problems (387 errors, 13 warnings)** measured on 2026-11-12, dominated by `@typescript-eslint/no-explicit-any` and `@typescript-eslint/no-unused-vars`, with `no-case-declarations` and `prefer-const` behind them. The counts are generated into `Docs/GATE_METRICS.md` by `./run.sh metrics`; `./run.sh lint` reproduces them. `--max-warnings 0` means a fix has to reach zero, so the work is a typed-API pass over `src/`, not a config change. Not enforced by CI until then.

- [✓] Add the repository's CI workflow (`.github/workflows/ci.yml`): Node 24 on `ubuntu-24.04`, SHA-pinned `actions/checkout` and `actions/setup-node`, `npm ci` from `DE/package-lock.json`, the credential-free `run-tests.ts` subsets with their reported failure count asserted, and `npm run build` with its `dist/KG` assertion. No secrets, no scanners. Verified from a fresh checkout under Node 24.22.2 before the pull request, and by the workflow's own run on it — completed in commit `9646871`.

- [ ] Make the type check real: `npm run build` runs a bare `tsc`, which does nothing while `tsconfig.json` is a solution file with `files: []`, so a deliberate type error passes the build. Progress 2026-11-06: the 3-line stub `src/hooks/useAgentInteraction.ts` was deleted (it imported nothing) and `src/utils/stateUtils.ts` was parse-repaired, so `npx tsc -b` now runs to completion and reports the real surface — 231 errors at the time (126 unused-symbol, ~105 semantic), not the previously recorded 42; that figure was what `tsc -b` reported while the two syntax-broken files masked the rest. Progress 2026-11-12: the mechanical unused-symbol findings are gone, leaving **97 pre-existing errors across 26 files** (counted by `./run.sh types`; recorded in `Docs/GATE_METRICS.md`). Remaining: resolve those errors — several are real defects, not annotations: missing exports (`CSSVector`, `FormattedNodeData`), a stale `LinkObject.source/target` shape that makes 18 narrowing sites resolve to `never`, an incomplete `AppActions` interface, wrong relative import paths in two components, and identifiers that no longer exist (`getCleanTextForDisplay`, `onPaperClick` in `NodeViewConnections`, `currentKeyFieldTarget`) — then wire `tsc -b` into the build or CI workflow. `Docs/RUN_GUIDE.md` documents the arm instead of the previous no-op commands.

- [✓] Add a `Docs/README.md` index for the numbered system-design series (table of contents plus related component guides) and point the root `README.md` and `AGENTS.md` at it — completed 2026-11-11.

## Major

- [✓] Introduce automated Markdown link/anchor validation. Done 2026-11-12 as the gate's `docs` arm: `scripts/check_docs_links.py` walks `git ls-files '*.md'`, excludes generated content by path prefix (the KG, publication records, `public/KG`, retained run records, dependencies, build output) rather than a hand-maintained list, and verifies target existence, exact case and heading anchors. `./run.sh docs` reproduces it; CI runs it in the `gate` job.
- [✓] One gate entry point with separately runnable arms: `run.sh` (`fast`, `build`, `website`, `docs`, `gnn`, `lint`, `types`, `all`, `strict`, `metrics`), `.github/workflows/ci.yml` calling those arms from three jobs, and `Docs/GATE_METRICS.md` generated by `./run.sh metrics` so no measured number is hand-edited — completed 2026-11-12.
- [ ] Establish a generated documentation/reference pipeline for the DE API and research scripts. Deferred: current docs are partly aspirational and there is no single source-of-truth schema from which such references can be generated.

## Open / deferred

Open items in this list are the two Minor application/content follow-ups, the ESLint-findings and type-error repairs above, and the generated-reference pipeline item. Both red checks are runnable through `./run.sh` and measured in `Docs/GATE_METRICS.md`, so the backlog item is the repair, not the tooling.

Branch and pull-request cleanup is done: all seven unmerged 2025 branches were reviewed against `main` (none is proven merged, so nothing was pruned). PR #27 "Add requirements" — 861 `.venv/` files, two `.DS_Store` files and an empty `requirements.txt` while `main` carries a populated one — was closed and its branch `setup-dependencies` deleted. PR #28 "feat: test new UI" was closed with the rationale recorded on the pull request: it adds a second top-level `Front-End/` tree including its own copy of the knowledge base, and nothing from it was merged; its branch is kept so no work is lost. Kept untouched: `DE_tech_focus`, `data-pipeline`, `kg-algos`, `minimal`, `setup`. Nothing is left waiting on a decision: PRs #31–#35 (`.cursorrules` removal, hygiene pass, knowledge-base serving fix, status-report rewrite, CI workflow) are merged.

Generated script run outputs stay tracked by design: `DE/scripts/README_HEADLESS.md` lists "Archival: Permanent record of all processing runs with inputs and outputs" among the headless mode's achieved benefits, `DE/scripts/output/generate-summary_2025-06-11T15-08-08/` and `DE/scripts/outputs/batch-test-20250611-084316/` are cited as evidence in `DE/scripts/COHERENCE_ASSESSMENT.md`, and the remaining run directories are records of the same 2025-06-11 sessions. They are not disposable build output.
