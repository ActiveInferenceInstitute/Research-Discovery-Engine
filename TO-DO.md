# Documentation TODO

Last reviewed: 2026-11-11 (docs index pass) after 2026-11-02

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

- [ ] Repair the `lint` script and its configuration: `npm run lint` cannot run today because it passes `--ext ts,tsx` (rejected when a flat config is present) and `eslint.config.js` imports `@eslint/js`, `globals` and `typescript-eslint`, none of which `DE/package.json` depends on (it carries the older `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser`). `DE/docs/DEVELOPMENT_GUIDE.md` no longer claims lint enforcement; the CI workflow does not invoke lint.

- [✓] Add the repository's CI workflow (`.github/workflows/ci.yml`): Node 24 on `ubuntu-24.04`, SHA-pinned `actions/checkout` and `actions/setup-node`, `npm ci` from `DE/package-lock.json`, the credential-free `run-tests.ts` subsets with their reported failure count asserted, and `npm run build` with its `dist/KG` assertion. No secrets, no scanners. Verified from a fresh checkout under Node 24.22.2 before the pull request, and by the workflow's own run on it — completed in commit `9646871`.

- [ ] Make the type check real: `npm run build` runs a bare `tsc`, which does nothing while `tsconfig.json` is a solution file with `files: []`, so a deliberate type error passes the build. `npx tsc -b` is the real check and reports 42 pre-existing errors — 34 from the 3-line stub `src/hooks/useAgentInteraction.ts` (nothing imports it) and 7 from `src/utils/stateUtils.ts`. Fix or delete the stub, resolve the rest, then wire `tsc -b` into the build or the CI workflow; the guides now say exactly this instead of the previous no-op commands.

- [✓] Add a `Docs/README.md` index for the numbered system-design series (table of contents plus related component guides) and point the root `README.md` and `AGENTS.md` at it — completed 2026-11-11.

## Major

- [ ] Introduce automated Markdown link/anchor validation in CI. Deferred: the repository now runs a CI workflow (`.github/workflows/ci.yml`), but the KG uses application-specific link syntax, so adding a validator safely requires first separating ordinary Markdown from CNM navigation syntax.
- [ ] Establish a generated documentation/reference pipeline for the DE API and research scripts. Deferred: current docs are partly aspirational and there is no single source-of-truth schema from which such references can be generated.

## Open / deferred

Open items in this list are the two Minor application/content follow-ups, the `lint`-script and type-check repairs above, and the two Major documentation-system items.

Branch and pull-request cleanup is done: all seven unmerged 2025 branches were reviewed against `main` (none is proven merged, so nothing was pruned). PR #27 "Add requirements" — 861 `.venv/` files, two `.DS_Store` files and an empty `requirements.txt` while `main` carries a populated one — was closed and its branch `setup-dependencies` deleted. PR #28 "feat: test new UI" was closed with the rationale recorded on the pull request: it adds a second top-level `Front-End/` tree including its own copy of the knowledge base, and nothing from it was merged; its branch is kept so no work is lost. Kept untouched: `DE_tech_focus`, `data-pipeline`, `kg-algos`, `minimal`, `setup`. Nothing is left waiting on a decision: PRs #31–#35 (`.cursorrules` removal, hygiene pass, knowledge-base serving fix, status-report rewrite, CI workflow) are merged.

Generated script run outputs stay tracked by design: `DE/scripts/README_HEADLESS.md` lists "Archival: Permanent record of all processing runs with inputs and outputs" among the headless mode's achieved benefits, `DE/scripts/output/generate-summary_2025-06-11T15-08-08/` and `DE/scripts/outputs/batch-test-20250611-084316/` are cited as evidence in `DE/scripts/COHERENCE_ASSESSMENT.md`, and the remaining run directories are records of the same 2025-06-11 sessions. They are not disposable build output.
