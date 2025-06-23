# Discovery Engine: Interactive Knowledge Synthesis Platform

**An Interactive Environment for Human-AI Collaborative Discovery on Synthesized Knowledge Graphs.**

This project, the "Discovery Engine," is a frontend application designed to facilitate the exploration of complex scientific knowledge and support the collaborative generation of novel scientific concepts and research artifacts. It operates on a **Conceptual Nexus Model (CNM)**, a dynamic knowledge graph constructed by parsing and structuring information from a corpus of Markdown (`.md`) files. These files represent an interconnected knowledge tree of scientific domains, including mechanisms, materials, methods, phenomena, theoretical principles, and associated publications.

The platform aims to transform how researchers interact with and build upon scientific knowledge by:
1.  **Synthesizing a Knowledge Graph:** Automatically building the CNM from structured `.md` files located in the `public/KG/` directory.
2.  **Intuitive Exploration:** Providing users with interactive tools, including a 3D graph visualization and a browsable "Knowledge Browser" sidebar, to navigate and understand the CNM.
3.  **AI-Assisted Discovery (Simulated):** Integrating a suite of (currently simulated) AI agents designed to:
    *   Identify knowledge gaps and inconsistencies within the CNM.
    *   Suggest relevant components and analogous concepts.
    *   Assess compatibility and consistency of new ideas.
4.  **Collaborative Concept Creation:** Offering a "Concept Designer" workspace where users can iteratively construct new hypothetical `SystemNode` configurations, guided by AI suggestions and grounded in the CNM.
5.  **Systematic Protocol Design:** Assisting users in outlining validation protocols (`MethodNode` sequences) for their proposed concepts.
6.  **Artifact Generation:** Enabling the creation of well-defined `KnowledgeArtifactNode`s that encapsulate novel concepts, their constituent components, and their validation plans, ready for integration back into the CNM.

This application is built with **React, TypeScript, Vite, and Tailwind CSS**, utilizing `3d-force-graph` for dynamic graph visualization.

## Core Philosophy & Workflow

The Discovery Engine embodies a human-AI co-creation process. It leverages the strengths of human expertise for ideation and critical evaluation, augmented by AI's capability for large-scale information processing, pattern recognition, and suggestion generation. The detailed workflow is described in `process.md` and involves:

1.  **Defining Scope & Initiating Design:** Users start by exploring the CNM or stating a high-level goal. AI assistants (simulated) help refine the scope.
2.  **Component Integration & Novel Combination:** Users build concepts by adding and relating components from the CNM, with AI providing suggestions and consistency checks.
3.  **Protocol Design Assistance:** AI tools help outline validation protocols by querying the CNM for relevant methods and parameters.
4.  **Artifact Formalization & Knowledge Integration:** The co-created design is formalized into a `KnowledgeArtifactNode` and integrated into the CNM.

## Project Structure

*   **`public/KG/`**: The knowledge base.
    *   `mechanisms.md`, `materials.md`, `methods.md`, `phenomena.md`, `applications.md`, `theoretical.md`: Core domain knowledge.
    *   `css.md`: **Crucial Schema Definition** for all node and edge types in the CNM. This file defines the structure and attributes that the system expects.
    *   `process.md`: Outlines the human-AI workflow.
    *   `publications/`: Markdown files for individual cited publications (e.g., `author_year_title.md`).
*   **`src/`**: React application source.
    *   **`App.tsx`**: Main application component.
    *   **`components/`**:
        *   `GraphVisualization/`: 3D graph display.
        *   `NodeView/`: Detailed view for any selected graph node.
        *   `KnowledgeBrowserSidebar/`: Accordion-style browser for `KG/*.md` file contents.
        *   `ContextPanel/`: Right-hand panel, hosting `NodeView` or `ConceptDetails`.
        *   `ConceptDesigner/`: Workspace for user-driven concept creation.
        *   `AgentConsole/`: UI for (simulated) AI agent interactions.
        *   `BreadcrumbPanel/`: Displays navigation path.
        *   `utils/markdownLinkRenderer.tsx`: Centralized component for rendering custom markdown links.
    *   **`hooks/`**: `useGraphData.ts`, `useConceptDesign.ts`.
    *   **`types/`**: TypeScript definitions (`index.ts`, `css.ts`).
    *   **`utils/`**:
        *   `cnmBuilder.ts`: Parses all `.md` files in `public/KG/` to build the graph data (`nodes` and `links`) based on headings and link syntax.
        *   `markdownParser.ts`: Parses raw markdown into a structured format (document title, preamble, hierarchical sections).
        *   `parseNodeData.ts`: Extracts and formats content from a `NodeObject`'s description for display in `NodeView`.
        *   `graphUtils.ts`: Graph-related helper functions.
*   **`README.md`**: This file.

## Key Functionalities

*   **Dynamic Knowledge Graph:** Built on page load from local Markdown files.
*   **Interactive Graph Visualization:** Explore nodes and relationships in 3D.
*   **Knowledge Browser:** Navigate content hierarchically via a sidebar.
*   **Unified Node View:** Consistent display of all node types (parsed from MD or user-created) in a dedicated right-hand panel.
*   **Concept Design Workflow:** Guided process for creating new `SystemNode`s.
*   **Custom Markdown Link Processing:**
    *   `[[target-id]]` or `[[file#section-id]]` links resolve to other nodes or trigger navigation.
    *   `[citation_key]` links open corresponding publication files.
*   **Simulated AI Agents:** The Agent Console provides a glimpse into the intended AI-assisted functionalities.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd discovery-engine-platform
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Verify Knowledge Base:**
    *   Ensure your core knowledge Markdown files (`mechanisms.md`, `materials.md`, etc.) are present in the `public/KG/` directory.
    *   Ensure `css.md` and `process.md` are also in `public/KG/` (or update paths in `cnmBuilder.ts` and `WIKI_BROWSER_CONFIG` in `App.tsx`).
    *   Place markdown files for individual publications (e.g., `smith_etal_2023.md`) in `public/KG/publications/`.
4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
5.  Open your browser to the local address provided by Vite (e.g., `http://localhost:5173`).

## Automated Knowledge Extraction (for LLMs)

A [dedicated Markdown template](template_llm_extraction.md) (you would link this file here if it exists) is designed to guide Large Language Models (LLMs) in systematically extracting information from scientific papers. This template directly maps to the CNM schema defined in `css.md`, facilitating the population of `SystemNode` attributes and its connections to materials, mechanisms, methods, etc. The output of this LLM-driven process can then be parsed to further enrich the CNM.

## Current Status & Known Issues

*   **AI Agent Simulation:** Most advanced AI agent functionalities (e.g., automated knowledge gap identification, hypothesis generation beyond basic suggestions) are currently simulated in the frontend. Full realization requires backend AI services.
*   **React Warnings:**
    *   `setState-in-render`: Efforts have been made to minimize this by deferring state updates from child component callbacks using `useEffect`. Further review may be needed for complex interactions.
    *   DOM Nesting (`<pre>` in `<p>`): This typically indicates a need for better separation (blank lines) around fenced code blocks in the source `.md` files.
*   **Markdown Link Robustness:** While significantly improved, complex or non-standard link syntax in source `.md` files might still pose challenges for the `cnmBuilder.ts` and the display renderers. Ensure links to section headings use their slugified form.
*   **Materials Index Display:** If the "Materials" index (or any other specific file index) does not appear in the `KnowledgeBrowserSidebar`, verify that the `indexSectionTitleSlug` in `WIKI_BROWSER_CONFIG` (in `App.tsx`) precisely matches the slug generated from the actual "Index of..." H2 heading in the corresponding `.md` file.

## Future Directions

*   **Backend AI Agent Implementation:** Transition simulated agent functionalities to robust backend services performing graph analysis, NLP, and machine learning.
*   **Graph Database Integration:** For scalability and advanced querying, migrate the CNM to a dedicated graph database (e.g., Neo4j).
*   **Enhanced Concept Designer:** Provide richer tools for defining complex `CSSVector` attributes and inter-component relationships during concept creation.
*   **LLM Integration for Extraction:** Build a pipeline to use the LLM extraction template with actual papers and parse the output to populate/update the CNM.
*   **Collaborative Features:** Introduce versioning, user roles, and real-time collaboration on the CNM and concept designs.
*   **UI/UX Refinements:** Continuously improve the user experience for knowledge exploration and creation.

---
