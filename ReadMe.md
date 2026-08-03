# Research Discovery Engine (IntelliDE)

[![DOI](https://zenodo.org/badge/948595787.svg)](https://doi.org/10.5281/zenodo.15084931)

The Research Discovery Engine is a collection of research prototypes and supporting analyses for exploring scientific knowledge as structured, connected information. The repository currently includes:

- `DE/`: a React, TypeScript, Vite, and Tailwind frontend for browsing the Discovery Engine knowledge graph and experimenting with concept design and LLM-assisted workflows.
- `path/`: a Python network-analysis pipeline over the linked Markdown knowledge base, with checked-in outputs under `path/results/`.
- `resnei/`: a small Flask-based ResNei prototype.
- `website_explore_the_unknown/`: a Next.js website prototype.
- `Docs/`: the numbered Discovery Engine system-design documentation.
- `ResNei SDD/`: the ResNei software design document and diagrams.

The repository is experimental and contains multiple related prototypes rather than one installable package. Read the component README before running a component.

## Quick start: Discovery Engine frontend

```bash
git clone https://github.com/ActiveInferenceInstitute/Research-Discovery-Engine.git
cd Research-Discovery-Engine/DE
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The frontend reads the knowledge base from `DE/KG/` at runtime.

To run the automated launcher instead:

```bash
python3 main.py
```

For the frontend's detailed setup, LLM configuration, scripts, and troubleshooting, see [`DE/docs/README.md`](DE/docs/README.md).

## Analysis pipeline

The Python analysis pipeline is run from `path/`:

```bash
cd path
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python research_paths.py
```

It reads the Markdown knowledge-base files in `path/` and writes staged artifacts beneath `path/results/`. See [`path/README.md`](path/README.md) for the current output layout.

## Design documentation

The system-design series is indexed by [`Docs/0. DE-Paper-Outline.md`](Docs/0.%20DE-Paper-Outline.md). It describes the proposed Conceptual Nexus Model, template system, synthesis pipeline, FAIR goals, limitations, assumptions, and future direction. These documents describe the design and research direction; they should not be read as a claim that every proposed capability is implemented in the current prototypes.

## Configuration and credentials

The root `.env.example` documents configuration used by the Python tooling. Keep credentials in an untracked `.env` file and never commit API keys. The DE frontend uses Vite-prefixed variables such as `VITE_API_PROVIDER`, `VITE_OPENAI_API_KEY`, and `VITE_OPENROUTER_API_KEY`; see `DE/src/llm/config/LLMConfig.ts` for the current names.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the scope of contributions and the local validation expectations.

## License and citation

Repository materials are licensed under [CC BY 4.0](LICENSE). The repository has a Zenodo DOI: [10.5281/zenodo.15084931](https://doi.org/10.5281/zenodo.15084931).

For the institute, see [Active Inference Institute](https://www.activeinference.institute/). The public project prototype is also presented at [explore-the-unknown.vercel.app](https://explore-the-unknown.vercel.app/).
