# Contributing

Thank you for contributing to the Research Discovery Engine. The repository contains several independent prototypes, so keep changes scoped to the component they affect and update the nearest README or guide when behavior changes.

## Before opening a pull request

1. Confirm the working tree and inspect the component you intend to change.
2. For `DE/`, run `npm run build` and `npm run lint` after installing dependencies with `npm install`.
3. For Python changes, run a syntax check (for example, `python -m compileall`) and the component's available checks.
4. Update documentation and examples when commands, paths, configuration names, or outputs change.
5. Never commit `.env` files, API keys, generated caches, or private research data.

## Scope and review

Use a focused commit and explain which component is affected. Pull requests should state what was verified and call out checks that could not be run. Changes to research interpretations, knowledge-base records, or design claims should identify the source or rationale rather than presenting unverified results as facts.

Issues and feature requests can be opened using the templates in `.github/ISSUE_TEMPLATE/`.
