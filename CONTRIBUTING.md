# Contributing

Thank you for contributing to the Research Discovery Engine. The repository contains several independent prototypes, so keep changes scoped to the component they affect and update the nearest README or guide when behavior changes.

## Before opening a pull request

1. Confirm the working tree and inspect the component you intend to change.
2. For `DE/`, install from the lockfile with `npm ci` and run `npm run build` (bundle plus the knowledge-base mirror and its `dist/KG` assertion; the build's `tsc` step does not currently type-check, and the real check `npx tsc -b` reports pre-existing errors — see `DE/docs/FINAL_STATUS.md`). The `npm run lint` script cannot currently run; see the same document. `.github/workflows/ci.yml` runs exactly that build plus the credential-free `run-tests.ts` subsets, and the pinned GNN conformance baseline (see `.github/GNN.md`).
3. For Python changes, run a syntax check (for example, `python -m compileall`) and the component's available checks.
4. Update documentation and examples when commands, paths, configuration names, or outputs change.
5. Never commit `.env` files, API keys, generated caches, or private research data.

## Scope and review

Use a focused commit and explain which component is affected. Pull requests should state what was verified and call out checks that could not be run. Changes to research interpretations, knowledge-base records, or design claims should identify the source or rationale rather than presenting unverified results as facts.

Issues and feature requests can be opened using the templates in `.github/ISSUE_TEMPLATE/`.
