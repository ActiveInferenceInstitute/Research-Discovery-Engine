# Documentation review log — 2026-08-02

## Scope

DOCS-DEEP review of the public repository, including the root README and metadata, the numbered `Docs/` design series, `DE/` application and script documentation, `path/` analysis documentation, ResNei SDD, website descriptions, issue templates, and repository-wide Markdown links.

## Preflight

- Branch: `main`
- Default remote branch: `origin/main`
- Initial HEAD: `e03774d`
- Working tree: clean before this pass
- Inventory: 568 tracked/non-Git files; 407,492 bytes across the principal Markdown documentation set measured during review
- No root `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `SECURITY.md`, or CI workflow was present at review start.

## Verified findings

- Root `ReadMe.md` had an incorrect MIT license statement; the repository license is CC-BY-4.0.
- Root `ReadMe.md` contained placeholder repository, paper, and blog links; referenced missing `CONTRIBUTING.md`, lowercase `docs/`, and a non-existent `intellide.core` example.
- The `Docs/` series is numbered 0–12, but `Docs/12. Direction.md` was headed and sectioned as 10; `Docs/9. Use Cases.md` ended mid-table row.
- `DE/README.md` documented `public/KG/`, `process.md`, and `.cursorrules` paths that do not exist in `DE`; the knowledge base is in `DE/KG/`, and the code uses Vite environment names prefixed with `VITE_`.
- `DE/docs/README.md` had an anchor to a heading that does not exist and advertised unsupported/uncorroborated performance, security, and platform guarantees.
- `DE/docs/DEVELOPMENT_GUIDE.md` contained a placeholder clone URL, a missing `REFACTORING_PROGRESS.md` link, a missing `.cursorrules` link, and a `type-check` command absent from `DE/package.json`.
- `DE/docs/STARTUP_GUIDE.md` contained links resolved from the wrong directory.
- `path/README.md` named a missing `knowledge_graph_analyzer.py`, stale output filenames, and an output directory not used by `path/research_paths.py`; the live pipeline writes to `path/results/` and uses different gap/trajectory names.
- `.github/ISSUE_TEMPLATE/general-improvement.md` contained two YAML front matters in one file.
- `website_explore_the_unknown/README.md` was an uncustomized Next.js scaffold and did not describe the actual routes or project.
- A repository-wide scan also found many intentional ellipses/placeholders inside generated knowledge-base/publication content; these were not mass-edited because they are content examples rather than documentation navigation defects. KG anchor behavior is application-specific and was not changed in this docs-only pass.

## Implementation

Changes are recorded in `TO-DO.md`; completed items are marked there with the commit references:

- `4ae3d9a` — root README overhaul, CONTRIBUTING.md, Docs/ series fixes, review log and TODO
- `ebedc6c` — Discovery Engine documentation aligned with implemented code and script parsers
- `b419782` — ResNei SDD, website prototype docs, path-analysis guide, issue templates, and the
  resnei compile fix (repeated `template_folder` keyword + missing imports)
- `46a2df7` — follow-up runtime fix: outer resnei app template folder resolution and
  module-relative, sanitized upload handling (found by running the apps in a throwaway
  Flask venv, see "Verification performed" below)

### Verification performed

- `python3 -m py_compile` passes for `resnei/app.py`, `resnei/resnei/app.py`,
  `resnei/uploads/markdown_renderer.py`, `config.py`, and `path/research_paths.py`.
- A GitHub-slug-aware repo-wide Markdown link scan reports no remaining broken
  documentation links or dead anchors (remaining hits are math notation such as
  `N[m](Δa_max)` in knowledge-base records, a directory link, and a %20-encoded link,
  all GitHub-valid).
- The DE TypeScript build (`npm run build`) and full test suites were not run: the
  repository has no committed test suite for the frontend and `node_modules` is absent;
  only the seven scripts' argument parsers were inspected directly.
- Runtime verification of both `resnei` Flask entry points in a throwaway venv
  (`/tmp/resnei-verify-venv`, flask + markdown installed, removed after use):
  `GET /`, `GET /network-data`, and `POST /render-article` all return 200 on both
  `resnei/app.py` and `resnei/resnei/app.py`. The first run exposed the two defects
  fixed in `46a2df7`; the second run passed all eight checks.
