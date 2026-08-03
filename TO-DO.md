# Documentation TODO

Last reviewed: 2026-08-02

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

## Major

- [ ] Introduce automated Markdown link/anchor validation in CI. Deferred: this repository has no CI workflow and the KG uses application-specific link syntax; adding a validator safely requires first separating ordinary Markdown from CNM navigation syntax.
- [ ] Establish a generated documentation/reference pipeline for the DE API and research scripts. Deferred: current docs are partly aspirational and there is no single source-of-truth schema from which such references can be generated.

## Open / deferred

Only the two Minor application/content follow-ups and the two Major documentation-system items above remain open.
