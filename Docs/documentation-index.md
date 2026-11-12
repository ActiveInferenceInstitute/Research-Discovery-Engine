# Documentation index

Flat index of the repository's long-lived documents. The hub is
[`README.md`](README.md); the repository entry point is
[`../README.md`](../README.md). Generated facts live in
[`GATE_METRICS.md`](GATE_METRICS.md) and are refreshed by `./run.sh metrics`.

`Docs/` spells the directory with a capital D. This checkout lives on a
case-insensitive volume, so a second `docs/` directory cannot exist beside it;
link to `Docs/` wherever a repository would otherwise say `docs/`.

## Repository level

- [`../README.md`](../README.md) — what the repository is, quick starts, configuration.
- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — contribution scope and the validation gate.
- [`../TO-DO.md`](../TO-DO.md) — documentation backlog with per-item evidence.
- [`../REVIEW_LOG_2026-08-02.md`](../REVIEW_LOG_2026-08-02.md) — dated review record.
- [`../AGENTS.md`](../AGENTS.md) — component map, generated trees, validation rules.
- [`../LICENSE`](../LICENSE) — CC BY 4.0.
- [`../.env.example`](../.env.example) — the configuration names the Python tooling reads.

## Gate and CI

- [`RUN_GUIDE.md`](RUN_GUIDE.md) — the arms of `./run.sh`, the CI mapping, and the checks that are known red.
- [`GATE_METRICS.md`](GATE_METRICS.md) — **generated**: per-arm wall time, test counts and finding counts.
- [`../.github/GNN.md`](../.github/GNN.md) — what the pinned GNN conformance job parses.
- [`../.github/gnn-pin.json`](../.github/gnn-pin.json) — canonical parser pin, schema `gnn-importer-pin/v1`.
- [`../.github/workflows/ci.yml`](../.github/workflows/ci.yml) — the workflows that call the arms.
- [`../.github/dependabot.yml`](../.github/dependabot.yml) — dependency update policy.

## System design

The numbered series, in reading order, is indexed by [`README.md`](README.md).

- [`0. DE-Paper-Outline.md`](0.%20DE-Paper-Outline.md) — condensed paper outline (arXiv 2505.17500).
- [`1. Overview.md`](1.%20Overview.md) through [`12. Direction.md`](12.%20Direction.md) — the design series.

## Components

- [`../DE/README.md`](../DE/README.md) — the React/TypeScript Discovery Engine frontend.
- [`../DE/docs/README.md`](../DE/docs/README.md) — the frontend's documentation hub.
- [`../DE/docs/DEVELOPMENT_GUIDE.md`](../DE/docs/DEVELOPMENT_GUIDE.md) — setup, commands, coding standards.
- [`../DE/docs/STARTUP_GUIDE.md`](../DE/docs/STARTUP_GUIDE.md) — launch paths and requirements.
- [`../DE/docs/DEPLOYMENT.md`](../DE/docs/DEPLOYMENT.md) — hosting and deployment options.
- [`../DE/docs/COMPONENTS.md`](../DE/docs/COMPONENTS.md) — component architecture.
- [`../DE/docs/API_REFERENCE.md`](../DE/docs/API_REFERENCE.md) — hooks, services and utilities.
- [`../DE/docs/SCRIPT_USAGE.md`](../DE/docs/SCRIPT_USAGE.md) — the standalone script toolkit.
- [`../DE/docs/OUTPUT_DIRECTORY_STRUCTURE.md`](../DE/docs/OUTPUT_DIRECTORY_STRUCTURE.md) — where script runs write output.
- [`../DE/docs/FINAL_STATUS.md`](../DE/docs/FINAL_STATUS.md) — verified current state and known gaps.
- [`../DE/docs/TECHNICAL_ASSESSMENT.md`](../DE/docs/TECHNICAL_ASSESSMENT.md) — protocol/summary issue record.
- [`../DE/docs/TROUBLESHOOTING.md`](../DE/docs/TROUBLESHOOTING.md) — common failures and fixes.
- [`../DE/scripts/README.md`](../DE/scripts/README.md) — every script, with its run-record caveat.
- [`../DE/scripts/HEADLESS_MODE.md`](../DE/scripts/HEADLESS_MODE.md) — headless processing.
- [`../DE/scripts/README_HEADLESS.md`](../DE/scripts/README_HEADLESS.md) — headless benefits and archival record.
- [`../DE/scripts/COHERENCE_ASSESSMENT.md`](../DE/scripts/COHERENCE_ASSESSMENT.md) — 2025-06-11 session record.
- [`../DE/scripts/LLM_API_VALIDATION_REPORT.md`](../DE/scripts/LLM_API_VALIDATION_REPORT.md) — provider validation record.
- [`../path/README.md`](../path/README.md) — the Python knowledge-graph analysis pipeline.
- [`../website_explore_the_unknown/README.md`](../website_explore_the_unknown/README.md) — the Next.js site and its Flask API.
- [`../resnei/README.md`](../resnei/README.md) — the Flask ResNei prototype.
- [`../ResNei SDD/README.md`](../ResNei%20SDD/README.md) — the ResNei software design document index.

## Machine-facing metadata

- [`../.aii/README.md`](../.aii/README.md) — the committed `aii-sidecar/v1` block.
- [`../.aii/AGENTS.md`](../.aii/AGENTS.md) — sidecar editing rules.
