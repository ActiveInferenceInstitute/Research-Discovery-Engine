# Publishing — Research-Discovery-Engine migration

Canonical authority: [the Publishing contract](https://github.com/ActiveInferenceInstitute/ActiveInferenceJournal/blob/d8ec888a8f3051a66bed9af047ee4b206050bdce/docs/workflows/publishing.md)
in ActiveInferenceJournal. This page records this member's adoption, not a second
identity grammar. The schema below is an unmodified copy from that revision.

## Member facts

- Gate: `./run.sh <arm>`; the executable tasks are in [the sidecar](../../.aii/config.yaml).
- Arms: `fast build website docs gnn lint types metrics all strict`.
- Docs index: [`Docs/documentation-index.md`](../documentation-index.md).
- Manuscript command: none.
- GNN pin: [`.github/gnn-pin.json`](../../.github/gnn-pin.json).
- `lint` and `types` remain admitted red, excluded from `all`; see the
  [run guide](../RUN_GUIDE.md#known-red-checks).

## Pinned canonical artifacts

Source: ActiveInferenceJournal revision `d8ec888a8f3051a66bed9af047ee4b206050bdce`.
The identity schema, checker and drift selftest are copied byte-for-byte. The
existing GNN pin already matches the contract; it is not replaced.

```text
record-identity.schema.json  84f6c4df6efc3f15f0d8a9a05c8aabd0cbdc08b0f4feac5fcc8ae860a81e306b
identity.py  847328ff163fa90c869495164869caf4e83313748e8a444dbab8d4e459b11074
identity_selftest.py  bf029061b62c0b1d0275d71126fc7f962242ee7d32847958dc481fc2877fbe49
gnn-pin.json  eb83f7f1b73eb31e116bd05b1f457dd07e6874a2a4ba0e9e95e5bc91f094cd55
```

`./run.sh docs` runs the copied lead checker with explicit `--schema` and
`--contract` paths under `Docs/workflows/`, verifies each artifact with
`--verify-copy`, and runs the canonical selftest that accepts a matching Python
copy and rejects a diverged copy. The existing member link/anchor check then runs.
This verifies adoption artifacts, not a Journal corpus or research-record join.

## Scope: why this member keeps its gate

The contract's migration step is one step, not a rewrite, and its numbered items are
the sidecar facts and paths, the byte-identical identity copies with recorded digests,
and the schema-prose pointer. It also directs members to keep checks their own gate
already proves ("keep that and do not duplicate it") and not to adopt an arm they
cannot run offline. The contract's member table names `./run.sh <arm>` as this
repository's gate entry point and lists its own arm set, so the member gate, the
link/anchor checker and the metrics generator remain here.

The lead's Journal-specific gate modules are not copied into this member:

- `scripts/gate/cli.py` registers the lead's arms (`lint`, `docs`, `identity`,
  `fast`, `full`, `gnn`, `all`, `bench`); it has no `build`, `website`, `types`,
  `metrics` or `strict` dispatch.
- `scripts/gate/common.py` requires `.github/journal-utilities-pin.json`, and
  `scripts/gate/arm_docs.py` requires `docs/_generated/gate-timings.md`; this member
  has neither and keeps its measurements in `Docs/GATE_METRICS.md`.
- `scripts/gate/arm_docs.py` walks a lowercase `docs/` tree; this member's tree is
  `Docs/`.

The shared concern this member adopts is the record identity grammar: the canonical
schema, checker and drift selftest are copied byte-for-byte and pinned above. No lead
file, Journal pin, corpus or timing data is invented, and no member command is
removed. The contract's member table keeps each repository's gate entry point
distinct for exactly this reason.
