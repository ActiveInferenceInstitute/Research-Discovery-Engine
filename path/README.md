# Conceptual Ecology: Knowledge-graph analysis

`path/` contains the Python analysis pipeline used to analyse the linked Markdown knowledge base in this directory. The pipeline builds a directed graph from the category files, computes network and innovation measures, identifies probabilistic knowledge gaps, and synthesises a trajectory between two configured concepts.

## Setup

The pipeline targets Python 3.11+ and uses the dependencies in [`requirements.txt`](requirements.txt).

```bash
cd path
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python research_paths.py
```

`research_paths.py` currently has no command-line argument parser; its input files, output directory, and trajectory endpoints are configured in the module. It reads these knowledge-base files from `path/`:

- `applications.md`
- `materials.md`
- `mechanisms.md`
- `methods.md`
- `phenomena.md`
- `theoretical.md`

## Output layout

The checked-in results are grouped by pipeline stage under `path/results/`:

| Stage | Current outputs |
| --- | --- |
| `1_Master_Node_List/` | `node_master_list_with_metrics.csv` |
| `2_Landscape_Analysis/` | `centrality_analysis.png`, `concept_communities.csv`, `conceptual_landscape_map_silos.png`, `top_20_influential_concepts.csv` |
| `3_Innovation_Strategies/` | `innovation_strategies.png`, `innovation_strategies_scores.csv`, `interactive_innovation_strategies.html` |
| `4_Knowledge_Gap_Atlas/` | `probabilistic_knowledge_gap_atlas.png`, `probabilistic_knowledge_gaps_full_list.csv` |
| `5_Research_Trajectory_Synthesis/` | `top_trajectories_nanowires_to_neuromorphic-computing--hardware.csv`, `trajectory_nanowires_to_neuromorphic-computing--hardware_network.png` |

The output directory is defined by `OUTPUT_DIR` in `research_paths.py` and defaults to `knowledge_graph_final_definitive` relative to the `path/` working directory. The previously generated artifacts checked into the repository were consolidated under `path/results/`; running the pipeline now writes to its configured output directory and may overwrite files with the same names.

## Interpretation

CSV files contain intermediate and ranked data used by the analysis. PNG files are static visualisations, and the Plotly HTML file is an interactive exploration artifact. These outputs are analysis products, not independent evidence: interpret them alongside the source knowledge-base records and the methods in `research_paths.py`.
