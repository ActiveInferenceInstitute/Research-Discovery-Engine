# InstituteOS integration — Research-Discovery-Engine

## Identity

| Field | Value |
| --- | --- |
| Repository | `ActiveInferenceInstitute/Research-Discovery-Engine` |
| Affiliation | `institute` |
| Category | `research` |
| Status | `active` |
| Maturity | `released` |
| Steward | Active Inference Institute |
| Default branch | `main` |
| Current release | — |
| License | `CC-BY-4.0` |
| Citation | Active Inference Institute — Research-Discovery-Engine. |

## Federation

| Setting | Value |
| --- | --- |
| Dashboard mode | `repos` |
| Analytics | `true` |
| Dashboard | `true` |
| Sync policy | `pull` |
| Registries | — |
| Tags | research-discovery, knowledge-graph, literature, intellide, python |

## Ecosystem relations

| Repository | Relation | Note |
| --- | --- | --- |
| `ActiveInferenceInstitute/InstituteOS` | `referenced-by` | Federated via the InstituteOS .aii manifest. |

## Key artifacts

| Path | Kind | Description |
| --- | --- | --- |
| `README.md` | `doc` | Repository overview. |
| `AGENTS.md` | `doc` | Agent guidance. |
| `LICENSE` | `doc` | License. |
| `DE` | `code` | React/TypeScript/Vite Discovery Engine frontend and its tests. |
| `path` | `code` | Python network-analysis pipeline and checked-in results. |
| `resnei` | `code` | Flask ResNei prototype. |
| `website_explore_the_unknown` | `code` | Next.js website prototype. |
| `Docs` | `doc` | Numbered Discovery Engine system-design series. |
| `requirements.txt` | `code` | Root Python requirements. |

## Portable tasks

| Task | Command | Working directory | Description |
| --- | --- | --- | --- |
| `install` | `pip install -r requirements.txt` | `.` | Install dependencies. |
| `inventory` | `git ls-files` | `.` | List tracked files. |
| `build` | `npm ci && npm run build` | `DE` | Build the Discovery Engine frontend and assert the knowledge base in dist. |

## Validation

```bash
python -m aii_platform.aii_sidecar.validate <repo> --completeness
python -m aii_platform.aii_sidecar docs <repo> --overwrite
python -m aii_platform.aii_sidecar.run <repo> --list
```

The sidecar is valid when `validate` prints `OK` and reports no missing artifact,
manifest, link, or declared-doc path. Completeness is a curation target, not a
runtime requirement.

## Data boundary

This sidecar carries metadata only. It does not grant execution permission, does not
replace the repository's own documentation, and must not be used to move private
content into a public repository. Task execution is limited to trusted checkouts.
