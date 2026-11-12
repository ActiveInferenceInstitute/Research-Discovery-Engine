# .aii — InstituteOS sidecar

This folder is the committed [InstituteOS](https://github.com/ActiveInferenceInstitute/InstituteOS)
sidecar for **`ActiveInferenceInstitute/Research-Discovery-Engine`**. It records curated institutional metadata that the GitHub
API cannot provide — identity, category, maturity, ecosystem relations, key artifacts,
provenance, and portable tasks — so InstituteOS can federate a unified view across
Institute repositories without touching this project's own content. The schema is
`aii-sidecar/v1`.

## Contents

| File | Purpose |
| --- | --- |
| [`config.yaml`](config.yaml) | Machine-readable metadata; the single source of truth. |
| [`readiness.json`](readiness.json) | Declared tier, baseline commit, and waivers for the AII readiness standard. |
| [`docs/`](docs/README.md) | Sidecar documents: the [`README.md`](docs/README.md) · [`AGENTS.md`](docs/AGENTS.md) folder guides, and [`INTEGRATION.md`](docs/INTEGRATION.md) — how this repository is federated, validated, and operated through InstituteOS. |
| [`README.md`](README.md) · [`AGENTS.md`](AGENTS.md) | Human and agent guidance for this folder. |

## Repository profile

| Field | Value |
| --- | --- |
| Repository | `ActiveInferenceInstitute/Research-Discovery-Engine` |
| Category | `research` |
| Status | `active` |
| Maturity | `released` |
| License | `CC-BY-4.0` |
| Default branch | `main` |
| Homepage | — |
| Tags | `research-discovery`, `knowledge-graph`, `literature`, `intellide`, `python` |

## Capabilities

- documentation
- ci

## Portable tasks

The executable task registry is [`config.yaml`](config.yaml), with one task per
documented `./run.sh` arm. Commands and known-red checks are described in the
[run guide](../Docs/RUN_GUIDE.md); the docs index is
[`Docs/documentation-index.md`](../Docs/documentation-index.md), the GNN pin is
[`.github/gnn-pin.json`](../.github/gnn-pin.json), and this member has no manuscript
command. Publishing migration status and canonical artifact digests are in the
[member contract record](../Docs/workflows/publishing.md).

## Links

- **github:** https://github.com/ActiveInferenceInstitute/Research-Discovery-Engine
- **website:** https://www.activeinference.org

## Validate

The authoritative validator ships in the private `aii-platform` kernel:

```bash
python -m aii_platform.aii_sidecar.validate <repo> --completeness
python -m aii_platform.aii_sidecar docs <repo> --overwrite
python -m aii_platform.aii_sidecar.run <repo> --list
```

If the private environment is unavailable, review `config.yaml` as plain YAML and
check that every declared path exists in the repository.
