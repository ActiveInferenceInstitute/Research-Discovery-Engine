# Conceptual Ecology: A Knowledge Graph Analysis

This repository contains the complete Python-based analysis pipeline for the paper "Navigating the Conceptual Landscape: Trajectory Analysis for Causal Discovery and Hypothesis Generation in Material Intelligence." The project treats a curated, interlinked knowledge base of scientific concepts as a complex network, applying tools from systems biology and network theory to map the field, identify innovation strategies, and predict high-potential "knowledge gaps."

The core of this project is a set of linked Markdown files (`applications.md`, `materials.md`, etc.), which together form a knowledge graph. This pipeline analyzes that graph to generate all the figures, tables, and data files presented in the manuscript.

## Overview of the Analysis Pipeline

The main script, `knowledge_graph_analyzer.py`, orchestrates a multi-stage analysis:

1.  **Master Node List Generation:** Creates and saves an authoritative CSV (`node_master_list_with_metrics.csv`) of all concepts with their categories and calculated metrics (PageRank, Influence, Interdisciplinarity).
2.  **Landscape & Centrality Analysis:**
    *   Calculates key network centrality metrics to identify "Intellectual Hubs."
    *   Performs community detection (Louvain) to map "Research Silos."
    *   Generates `centrality_analysis.png` and `conceptual_landscape_map_silos.png`.
3.  **Innovation Strategy Analysis:**
    *   Calculates Influence vs. Interdisciplinarity for each concept.
    *   Generates a static `innovation_strategies.png` and an interactive `interactive_innovation_strategies.html`.
    *   Saves the raw scores to `innovation_strategies_scores.csv`.
4.  **Knowledge Gap Atlas:**
    *   Systematically scores all non-existent links between categories to predict opportunities for innovation.
    *   Generates a summary heatmap `probabilistic_knowledge_gap_atlas.png`.
    *   Saves the full ranked list of opportunities to `probabilistic_knowledge_gaps_full_list.csv`.
5.  **Causal Trajectory Synthesis:**
    *   For a user-defined start and end concept (e.g., `nanowires` -> `neuromorphic-computing--hardware`), it finds the most plausible multi-step research paths.
    *   Saves the top-ranked paths and their scores to a detailed CSV (`top_trajectories_....csv`).
    *   Generates a "Visual Protocol" network diagram of the single best path (`synthesized_research_trajectory_network.png`).

## Setup and Installation

This project is written in Python 3.11+.

1.  **Clone the repository or download the files.**
2.  **Place your Markdown knowledge base files** (`applications.md`, `materials.md`, etc.) in the same root directory as the `knowledge_graph_analyzer.py` script.
3.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```
4.  **Install the required dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## How to Run the Analysis

After setting up the environment and placing your `.md` files in the root directory, simply run the main script from your terminal:

```bash
python research_paths.py
```

The script will print its progress for each stage of the analysis. All outputs, including figures and CSV files, will be saved into a new directory named `knowledge_graph_analysis_final`.

## Interpreting the Output

*   **CSVs:** The generated CSV files in the output subdirectories contain the raw data, scores, and ranked lists that form the basis for the paper's quantitative claims.
*   **Static Plots (.png):** These are the publication-quality figures intended for direct use in the manuscript.
*   **Interactive Plots (.html):** These plots (`interactive_innovation_strategies.html` and `knowledge_flow_chord.html`) are designed for exploration. Open them in a web browser to hover over data points, zoom, and filter categories.
```

#### **`requirements.txt`**

```
pandas>=1.5.0
numpy>=1.23.0
matplotlib>=3.6.0
seaborn>=0.12.0
networkx>=3.0
python-louvain>=0.16
adjustText>=0.8
plotly>=5.10.0
holoviews>=1.15.0
bokeh>=3.0.0
scipy>=1.9.0
tqdm>=4.64.0
```
