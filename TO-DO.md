# Documentation TODO

Last reviewed: 2026-11-02 (reference and hygiene pass) after 2026-08-02

Severity definitions: Minor = typo, broken link, or formatting defect. Medium = stale section rewrite, documentation restructure, or missing focused guide. Major = cross-cutting documentation-system overhaul or new documentation site.

## Minor

- [ ] Fix remaining application-specific KG anchor behavior where the frontend slugifier differs from Markdown/GitHub anchors (`DE/src/utils/markdownParser.ts`, `DE/KG/*.md`). This is a code-adjacent compatibility issue and was deferred from this docs-only pass.
- [ ] Review intentional placeholder/ellipsis content in generated knowledge-base and publication records (`DE/KG/*.md`, `DE/publications/*.md`) when those records are next regenerated; do not treat prose examples as broken repository documentation.

## Medium

- [✓] Correct root README license, repository links, documentation paths, examples, and project status (`ReadMe.md`, `CONTRIBUTING.md`) — completed in commit `4ae3d9a`.
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

## Major

- [ ] Introduce automated Markdown link/anchor validation in CI. Deferred: this repository has no CI workflow and the KG uses application-specific link syntax; adding a validator safely requires first separating ordinary Markdown from CNM navigation syntax.
- [ ] Establish a generated documentation/reference pipeline for the DE API and research scripts. Deferred: current docs are partly aspirational and there is no single source-of-truth schema from which such references can be generated.

## Open / deferred

Open items in this list are the two Minor application/content follow-ups and the two Major documentation-system items above.

Decisions recorded but not yet acted on (owner): the seven unmerged 2025 branches and two open pull requests were reviewed — none is proven merged, so nothing was pruned. PR #27 "Add requirements" contributes 861 `.venv/` files, two `.DS_Store` files and an empty `requirements.txt` (main already has a populated one), and PR #28 "feat: test new UI" adds a second top-level `Front-End/` tree including its own copy of the knowledge base. Both are recommended for closing rather than merging.

Generated script run outputs stay tracked by design: `DE/scripts/README_HEADLESS.md` lists "Archival: Permanent record of all processing runs with inputs and outputs" among the headless mode's achieved benefits, `DE/scripts/output/generate-summary_2025-06-11T15-08-08/` and `DE/scripts/outputs/batch-test-20250611-084316/` are cited as evidence in `DE/scripts/COHERENCE_ASSESSMENT.md`, and the remaining run directories are records of the same 2025-06-11 sessions. They are not disposable build output.
