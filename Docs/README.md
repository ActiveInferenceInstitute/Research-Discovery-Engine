# Discovery Engine — system-design documentation

This directory holds the numbered Discovery Engine (DE) system-design series. It
describes the proposed Conceptual Nexus Model (CNM), the template and synthesis
pipeline, and the repository's FAIR goals, limitations, assumptions, and future
direction. These documents describe the **design and research direction**; they are
not a claim that every proposed capability is implemented in the current prototypes.

The human entry point for the repository is [`../README.md`](../README.md); the
component the design targets is [`../DE/`](../DE/README.md).

## Reading order

| # | Document | Topic |
| --- | --- | --- |
| 0 | [`0. DE-Paper-Outline.md`](0.%20DE-Paper-Outline.md) | Condensed outline that mirrors the published paper (arXiv 2505.17500); start here. |
| 1 | [`1. Overview.md`](1.%20Overview.md) | Framework overview and the case for a machine-operable knowledge system. |
| 2 | [`2. Motivation.md`](2.%20Motivation.md) | Why document-centric literature does not scale. |
| 3 | [`3. Architecture.md`](3.%20Architecture.md) | Component architecture of the Discovery Engine. |
| 4 | [`4. Key Concepts.md`](4.%20Key%20Concepts.md) | Concepts and vocabulary used by the CNM. |
| 5 | [`5. System.md`](5.%20System.md) | Template system and self-consistent refinement. |
| 6 | [`6. FAIR Principles.md`](6.%20FAIR%20Principles.md) | FAIR principles and interoperability. |
| 7 | [`7. AI Integration.md`](7.%20AI%20Integration.md) | LLM/agent integration points. |
| 8 | [`8. Synthesis.md`](8.%20Synthesis.md) | Knowledge synthesis pipeline. |
| 9 | [`9. Use Cases.md`](9.%20Use%20Cases.md) | Worked use cases. |
| 10 | [`10. Limitations.md`](10.%20Limitations.md) | Known limitations. |
| 11 | [`11. Assumptions.md`](11.%20Assumptions.md) | Working assumptions. |
| 12 | [`12. Direction.md`](12.%20Direction.md) | Planned future direction. |

## Media

`videos/` holds rendered media referenced by the series, such as
`videos/DE.gif` (the Discovery Engine interaction animation).

## Related documentation

- [`../DE/docs/README.md`](../DE/docs/README.md) — the frontend's implementation documentation.
- [`../path/README.md`](../path/README.md) — the Python network-analysis pipeline.
- [`../ResNei SDD/resnei.md`](../ResNei%20SDD/resnei.md) — the ResNei software design document.
