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

## Open migration blocker

The contract's shared-concern replacement is not complete. At the pinned revision:

- [Canonical cli.py](https://github.com/ActiveInferenceInstitute/ActiveInferenceJournal/blob/d8ec888a8f3051a66bed9af047ee4b206050bdce/scripts/gate/cli.py)
  hard-codes Journal arms (`identity`, `full`, `bench`) and does not dispatch this
  member's `build`, `website`, `types`, `metrics` or `strict` arms.
- [Canonical arm_docs.py](https://github.com/ActiveInferenceInstitute/ActiveInferenceJournal/blob/d8ec888a8f3051a66bed9af047ee4b206050bdce/scripts/gate/arm_docs.py)
  requires `.github/journal-utilities-pin.json` and
  `docs/_generated/gate-timings.md`. This member has neither; its measured output
  is `Docs/GATE_METRICS.md`. Its documentation tree is `Docs/`, not `docs/`.
- [Canonical arm_bench.py](https://github.com/ActiveInferenceInstitute/ActiveInferenceJournal/blob/d8ec888a8f3051a66bed9af047ee4b206050bdce/scripts/gate/arm_bench.py)
  measures Journal-only arms and renders Journal transcript/utility claims.

Replacing these modules unchanged would remove actual member commands and require
Journal-specific inputs or measurements that this member does not have. Adapting
them would create another private implementation rather than the byte-identical
canonical copies the contract requests. Unused copies would not replace a concern.
No Journal pin, corpus or timing data has been invented. Existing gate, docs,
metrics and GNN consumers remain intact. The PR stays open pending a canonical
member-compatible consumption path or an explicit contract clarification from the
lead; no lead files are changed by this member migration.
