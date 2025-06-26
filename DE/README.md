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

## LLM Integration

The Research Discovery Engine now supports multiple LLM providers:

### OpenAI Integration

By default, the system uses OpenAI's API for LLM capabilities. To use OpenAI:

1. Create a `.env` file with your OpenAI API key:
   ```
   API_PROVIDER=openai
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4o-mini
   ```

### OpenRouter Integration

The system also supports OpenRouter, which provides access to various models including Google's Gemini:

1. Create a `.env` file with your OpenRouter API key:
   ```
   API_PROVIDER=openrouter
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
   ```

2. Available OpenRouter models:
   - `google/gemini-2.0-flash-exp:free`
   - `google/gemini-2.0-pro-exp-02-05:free`
   - `google/gemini-2.0-flash-thinking-exp:free`
   - `deepseek/deepseek-r1-distill-llama-70b:free`
   - `openrouter/quasar-alpha`

3. Test your OpenRouter connection:
   ```bash
   npx tsx scripts/openrouter-test.ts
   ```

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
    *   **`llm/`**: LLM integration modules.
        *   `LLMService.ts`: Core service for LLM interactions.
        *   `services/`: Specialized LLM services.
        *   `config/`: LLM configuration management.
        *   `types/`: LLM-related type definitions.
        *   `utils/`: LLM utility functions.
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
*   **LLM Integration:** Support for multiple LLM providers (OpenAI and OpenRouter) for enhanced AI capabilities.

## Quick Start

### Automated Setup (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd Research-Discovery-Engine/DE

# Run the automated setup and launch
python3 main.py
```
The `main.py` script will automatically verify requirements, install dependencies, and launch the application.

### Manual Setup
```bash
# Navigate to the application directory
cd DE

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Verify Setup
All system requirements and project structure will be automatically verified when using `python3 main.py`.

### LLM Setup

1. Create a `.env` file in the project root with your API keys:
   ```
   # For OpenAI
   API_PROVIDER=openai
   OPENAI_API_KEY=your_openai_api_key_here
   
   # OR for OpenRouter
   API_PROVIDER=openrouter
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

2. Test your LLM connection:
   ```bash
   # For OpenAI
   npx tsx scripts/test-openai.ts
   
   # For OpenRouter
   npx tsx scripts/openrouter-test.ts
   ```

## 📚 Documentation

**Complete documentation is available in the [`docs/`](docs/) directory:**

### For New Users
- **[Startup Guide](docs/STARTUP_GUIDE.md)** - Complete setup and launch instructions
- **[Documentation Index](docs/README.md)** - Complete navigation guide for all documentation

### For Developers
- **[Development Guide](docs/DEVELOPMENT_GUIDE.md)** - Comprehensive developer documentation
- **[Component Architecture](docs/COMPONENTS.md)** - Detailed component specifications
- **[API Reference](docs/API_REFERENCE.md)** - Complete API and utility reference

### For Researchers
- **[Script Usage Guide](docs/SCRIPT_USAGE.md)** - 7 standalone utilities for research workflows
- **[Technical Assessment](docs/TECHNICAL_ASSESSMENT.md)** - Technical implementation details

### For Deployment
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment strategies
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions

### Project Status
- **[Final Status Report](docs/FINAL_STATUS.md)** - Complete project achievements and status

## Comprehensive LLM Integration & Testing

The Discovery Engine now includes full LLM integration with comprehensive testing capabilities:

### 🤖 **LLM-Enhanced Research Capabilities**
*   **LLM Summary Generation**: AI-powered research summaries with configurable depth and audience
*   **Knowledge Processing**: Automated concept extraction and relationship identification
*   **Research Question Generation**: AI-assisted formulation of research questions
*   **Domain-Specific Analysis**: Tailored processing for materials science, nanotechnology, and related fields

### 🧪 **Comprehensive LLM Testing Suite**
*   **Unit Testing**: Full mock LLM service testing with response validation
*   **Integration Testing**: End-to-end LLM workflow testing across all scripts
*   **Performance Testing**: Token usage optimization and response time benchmarking
*   **Load Testing**: Concurrent request handling and rate limiting validation
*   **Error Handling**: Comprehensive testing of failure scenarios and recovery

### 📊 **LLM Testing Scripts**
*   **`run-tests.ts`**: Comprehensive test suite including LLM integration tests
*   **`analyze-performance.ts`**: LLM performance benchmarking and optimization analysis
*   **`llm-generate-summary.ts`**: Production-ready LLM summary generation
*   **`llm-process-knowledge.ts`**: LLM-powered knowledge extraction and processing
*   **`batch-test-headless.sh`**: Automated batch testing of all LLM capabilities

### 🔬 **Testing Coverage**
*   **Configuration Testing**: OpenAI API integration and parameter validation
*   **Service Layer Testing**: Mock implementations for development and testing
*   **Response Validation**: Token usage tracking and content quality assessment
*   **Performance Metrics**: Response time, token efficiency, and throughput analysis
*   **Error Scenarios**: API failures, timeout handling, and graceful degradation

A dedicated LLM extraction template directly maps to the CNM schema defined in `css.md`, facilitating the population of `SystemNode` attributes and its connections to materials, mechanisms, methods, etc. The output of this LLM-driven process can then be parsed to further enrich the CNM.

## Current Development Status

### ✅ **Functional Components**
*   **Core Platform**: Fully operational with development server running on Vite
*   **Knowledge Graph**: Successfully loads and displays complex scientific knowledge base
*   **3D Visualization**: Interactive force-directed graph with real-time filtering
*   **Browser Interface**: Hierarchical knowledge navigation with markdown rendering
*   **Concept Designer**: Guided workflow for creating new knowledge concepts
*   **AI Agent Console**: Simulated AI assistant with conversation interface
*   **Search & Navigation**: Real-time graph filtering and breadcrumb navigation
*   **LLM Integration**: Complete OpenAI integration with production-ready services
*   **Comprehensive Testing**: Full LLM testing suite with performance benchmarking
*   **Headless Mode**: Automated batch processing for all scripts including LLM
*   **Mock Testing**: Complete mock LLM services for development and CI/CD

### 🔄 **In Active Development**
*   **Code Architecture**: Refactoring large components into smaller, focused modules
*   **Documentation**: Comprehensive inline documentation and component guides
*   **Error Handling**: Implementing proper error boundaries and validation
*   **Performance**: Optimizing graph rendering and component memoization
*   **Testing**: Establishing comprehensive test coverage for critical components

### 🚧 **Known Technical Debt**
*   **App.tsx Size**: Main component is large (425 lines) and needs decomposition
*   **Agent Simulation**: AI functionalities are frontend-simulated, awaiting backend integration
*   **React Warnings**: Minor `setState-in-render` issues being addressed through refactoring
*   **Bundle Optimization**: Code splitting and lazy loading implementation pending

### 📋 **Recent Improvements**
*   **Project Standards**: Comprehensive `.cursorrules` file with coding guidelines
*   **Component Documentation**: Detailed architecture documentation in `docs/COMPONENTS.md`
*   **TypeScript**: Enhanced type safety and interface definitions
*   **Code Organization**: Improved file structure and naming conventions
*   **LLM Integration**: Support for multiple LLM providers (OpenAI and OpenRouter)

### 🎯 **Next Milestones**
1. **Component Decomposition**: Break down App.tsx into feature-specific modules
2. **Service Layer**: Extract agent simulation logic into dedicated services
3. **Error Boundaries**: Implement comprehensive error handling
4. **Performance Optimization**: Add memoization and lazy loading
5. **LLM Production Deployment**: Scale LLM services for production workloads
6. **Advanced LLM Features**: Implement fine-tuning and domain-specific models
7. **Real-time LLM Integration**: Connect frontend directly to LLM services

## Future Directions

*   **Backend AI Agent Implementation:** Transition simulated agent functionalities to robust backend services performing graph analysis, NLP, and machine learning.
*   **Graph Database Integration:** For scalability and advanced querying, migrate the CNM to a dedicated graph database (e.g., Neo4j).
*   **Enhanced Concept Designer:** Provide richer tools for defining complex `CSSVector` attributes and inter-component relationships during concept creation.
*   **LLM Integration for Extraction:** Build a pipeline to use the LLM extraction template with actual papers and parse the output to populate/update the CNM.
*   **Collaborative Features:** Introduce versioning, user roles, and real-time collaboration on the CNM and concept designs.
*   **UI/UX Refinements:** Continuously improve the user experience for knowledge exploration and creation.

---
