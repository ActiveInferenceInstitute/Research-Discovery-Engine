# Research Discovery Engine (RDE)

[![DOI](https://zenodo.org/badge/948595787.svg)](https://doi.org/10.5281/zenodo.15084931)

## Transforming Scientific Research Through AI-Powered Knowledge Discovery

The Research Discovery Engine (RDE) is an advanced platform that leverages artificial intelligence to accelerate scientific discovery, foster interdisciplinary collaboration, and democratize access to knowledge through interactive knowledge graph visualization and intelligent agent systems.

## 🌟 Vision

The Research Discovery Engine aims to overcome key limitations in traditional scientific research:
- **Knowledge Fragmentation**: Breaking down silos between research domains
- **Information Overload**: Intelligently filtering and connecting relevant information
- **Discovery Bottlenecks**: Accelerating hypothesis generation and validation
- **Collaboration Barriers**: Facilitating interdisciplinary research connections

## 🏗️ Architecture Overview

The RDE consists of three main components:

### 1. Discovery Engine (DE) - Interactive Knowledge Graph Platform
**Location**: `DE/`
- **Technology**: React + TypeScript + Vite
- **Purpose**: Interactive visualization and exploration of knowledge graphs
- **Features**: 3D graph visualization, concept design, agent-based discovery assistance

### 2. Web Platform - Public Interface
**Location**: `website_explore_the_unknown/`
- **Technology**: Next.js + React
- **Purpose**: Public-facing website and research collaboration platform
- **Features**: Research showcases, team information, subscription management

### 3. Research Processing Engine (ResNEI)
**Location**: `resnei/`
- **Technology**: Python + Django
- **Purpose**: Document processing, knowledge extraction, and data management
- **Features**: PDF processing, markdown rendering, knowledge graph construction

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **Python** 3.8+ and pip
- **Git** for version control

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Research-Discovery-Engine.git
cd Research-Discovery-Engine
```

### 2. Automated Setup (Recommended) ⭐
Use the script orchestrator for one-command setup with auto-launch:

```bash
# 🚀 FASTEST START: Setup and launch Discovery Engine automatically
python3 src/scripts/main.py --categories setup --launch

# 🎯 Setup only (recommended for first run)  
python3 src/scripts/main.py --categories setup

# 🔍 Preview what would be executed (dry-run)
python3 src/scripts/main.py --dry-run

# 📋 List all available scripts
python3 src/scripts/main.py --list

# ⚡ Fast setup (skip optional scripts)
python3 src/scripts/main.py --skip-optional

# 🚀 Complete setup including data operations
python3 src/scripts/main.py --categories setup data

# 🌐 Full pipeline (all categories)
python3 src/scripts/main.py
```

**The `--launch` option will:**
- ✅ Complete setup automatically
- ✅ Launch Discovery Engine at `http://localhost:5173`  
- ✅ Open your browser automatically
- ✅ Keep the server running with real-time logs

### 3. Manual Setup (Alternative)

#### Start the Discovery Engine (DE)
```bash
cd DE
npm install
npm run dev
```
Access at: `http://localhost:5173`

#### Start the Web Platform (Optional)
```bash
cd website_explore_the_unknown
npm install
npm run dev
```
Access at: `http://localhost:3000`

#### Start the Research Processing Engine (Optional)
```bash
cd resnei
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Access at: `http://localhost:8000`

## 🧠 Core Technology Stack

### Knowledge Representation
- **Conceptual Nexus Model (CNM)**: Structured knowledge representation framework
- **Vector-Based Knowledge System**: Semantic embedding for concept relationships
- **Graph Database**: Neo4j-compatible knowledge graph storage

### AI & Machine Learning
- **Active Inference**: Probabilistic modeling for hypothesis generation
- **Advanced NLP**: BERTopic, SciBERT for literature analysis
- **Graph Neural Networks**: CT-GIN framework for relationship discovery

### Visualization & Interaction
- **3D Force Graph**: Interactive knowledge graph exploration
- **React Components**: Modular UI for different exploration modes
- **Agent-Based Interface**: AI assistants for guided discovery

## 🤖 Script Orchestrator

The Research Discovery Engine includes a powerful script orchestrator (`src/scripts/main.py`) that automates setup, data management, workflows, and deployment with intelligent dependency management and beautiful emoji-structured logging.

### ✨ Orchestrator Features
- **🎯 Smart Dependencies** - Automatically resolves and executes scripts in correct order
- **📝 Beautiful Logging** - Emoji-structured output with color-coded messages  
- **🔄 Execution Control** - Dry-run mode, category filtering, and interactive failure handling
- **📊 Comprehensive Reporting** - JSON reports with detailed metrics and execution history
- **⚡ Flexible Execution** - Run all scripts, specific categories, or individual components
- **🛡️ Error Recovery** - Graceful failure handling with continuation options
- **📁 Organized Output** - All results saved in `src/orchestrator-results/`

### 🛠️ Available Script Categories
- **⚙️ Setup** - Environment setup and dependency installation
  - `fast-setup.sh` - Quick DE environment setup
  - `verify-de-ready.sh` - Final verification and launch instructions
- **📊 Data** - Import/export knowledge graph data in multiple formats  
  - `import-concepts.sh` - Import concepts from JSON/CSV/Markdown
  - `export-graph.sh` - Export graphs in JSON/CSV/GraphML/GEXF formats
- **🔬 Workflow** - Complete research discovery pipelines
  - `research-pipeline.sh` - End-to-end research workflow automation
- **🚀 Deployment** - Production deployment to various platforms
  - `deploy.sh` - Deploy to Vercel, Railway, AWS, Docker

### 📖 Script Usage Examples
```bash
# 🚀 One-command setup and launch (recommended)
python3 src/scripts/main.py --categories setup --launch

# Development setup only (recommended for first use)
python3 src/scripts/main.py --categories setup

# Setup with data import
python3 src/scripts/main.py --categories setup data

# Complete pipeline with all components
python3 src/scripts/main.py

# Preview without execution
python3 src/scripts/main.py --dry-run

# List all available scripts
python3 src/scripts/main.py --list

# Skip optional scripts (faster execution)
python3 src/scripts/main.py --skip-optional
```

### 🔧 Individual Script Usage
```bash
# Run individual scripts directly
./src/scripts/setup/fast-setup.sh
./src/scripts/data/import-concepts.sh data/concepts.json
./src/scripts/data/export-graph.sh --format json --output my-graph
./src/scripts/workflows/research-pipeline.sh materials-science
./src/scripts/deployment/deploy.sh production --platform vercel
```

### 📊 Orchestrator Output
- **Execution Reports**: Saved in `src/orchestrator-results/execution-report-<timestamp>.json`
- **Pipeline Logs**: Detailed logs in `src/orchestrator-results/pipeline-logs/`
- **Real-time Progress**: Beautiful emoji-structured console output
- **Error Details**: Comprehensive error reporting with actionable suggestions

## 🔧 Key Features

### Knowledge Graph Exploration
- **Interactive 3D Visualization**: Navigate complex knowledge relationships
- **Multi-Modal Browsing**: Mechanisms, Materials, Methods, Phenomena, Applications, Theory
- **Semantic Search**: Find relevant concepts across domains
- **Context-Aware Navigation**: Breadcrumb trails and related concept suggestions

### Concept Design & Discovery
- **Guided Concept Creation**: AI-assisted hypothesis formation
- **Component Selection**: Intelligent material and mechanism recommendations
- **Protocol Generation**: Automated experimental procedure outlines
- **Consistency Validation**: Cross-domain compatibility checking

### Intelligent Agent System
- **Discovery Engine**: Orchestrates exploration and creation workflows
- **Search Agent**: Semantic graph querying and filtering
- **Exploration Agent**: Finds analogies and knowledge gaps
- **Protocol Agent**: Generates experimental procedures
- **Consistency Agent**: Validates concept coherence

### Research Integration
- **PDF Document Processing**: Extract knowledge from scientific papers
- **Literature Analysis**: Automated topic modeling and clustering
- **Knowledge Extraction**: Convert documents to structured representations
- **Collaborative Features**: Share and build upon research concepts

## 📁 Project Structure

```
Research-Discovery-Engine/
├── DE/                          # Discovery Engine (Main Application)
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── GraphVisualization/
│   │   │   ├── ConceptDesigner/
│   │   │   ├── AgentConsole/
│   │   │   └── ...
│   │   ├── hooks/               # Custom React hooks
│   │   ├── types/               # TypeScript definitions
│   │   ├── utils/               # Utility functions
│   │   └── data/                # Sample data
│   ├── KG/                      # Knowledge Graph Data
│   │   ├── mechanisms.md        # Mechanism knowledge base
│   │   ├── materials.md         # Materials knowledge base
│   │   ├── methods.md           # Methods knowledge base
│   │   └── ...
│   └── publications/            # Research publications
├── src/                         # Automation Scripts & Utilities
│   ├── scripts/                 # Automated scripts and orchestrator
│   │   ├── main.py             # Script orchestrator (run-scripts.py calls this)
│   │   ├── setup/              # Setup and configuration scripts
│   │   ├── data/               # Data management scripts
│   │   ├── workflows/          # Research workflow scripts
│   │   └── deployment/         # Deployment utilities
│   ├── orchestrator-results/   # Script execution reports and logs
│   ├── docs/                   # Modular documentation
│   ├── examples/               # Complete example projects
│   └── utils/                  # Utility libraries (de-client, graph-utils)
├── website_explore_the_unknown/ # Public Website
├── resnei/                      # Research Processing Engine
├── docs/                        # Core Documentation
├── run-scripts.py              # Main script orchestrator entry point
└── README.md                    # This file
```

## 📖 Documentation

### Core Documentation
- **[Getting Started Guide](docs/getting-started.md)** - Detailed setup and first steps
- **[User Guide](docs/user-guide.md)** - How to use the Discovery Engine
- **[Developer Guide](docs/developer-guide.md)** - Contributing and extending the platform
- **[API Reference](docs/api-reference.md)** - Technical API documentation
- **[Knowledge Graph Schema](docs/knowledge-graph-schema.md)** - CNM specification
- **[Deployment Guide](docs/deployment.md)** - Production deployment instructions

### Modular Documentation
- **[Scripts Documentation](src/scripts/README.md)** - Automated scripts and orchestrator
- **[Script Orchestrator](src/scripts/main.py)** - Main orchestrator with dependency management
- **[Integration Guides](src/docs/integration/)** - Framework and tool integrations
- **[Workflow Documentation](src/docs/workflows/)** - Research discovery workflows
- **[Example Projects](src/examples/)** - Complete usage examples and templates
- **[Utility Libraries](src/utils/)** - DE client, graph utilities, and data processors

## 🤝 Contributing

We welcome contributions from researchers, developers, and domain experts!

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

## 📊 Current Status

**Alpha Version** - Core functionality implemented, active development ongoing

### Completed Features ✅
- Interactive 3D knowledge graph visualization
- Multi-category knowledge browsing (Mechanisms, Materials, Methods, etc.)
- Concept design interface with AI assistance
- Agent-based discovery system
- PDF document processing pipeline
- Markdown-based knowledge representation

### In Development 🚧
- Enhanced graph algorithms for relationship discovery
- Improved AI agent reasoning capabilities
- Real-time collaboration features
- Advanced analytics and insights dashboard
- Mobile-responsive design improvements

### Planned Features 📋
- Integration with external research databases
- Advanced ML models for hypothesis generation
- Automated literature review capabilities
- Research project management tools
- API for third-party integrations

## 🔗 Related Resources

- **[Project Website](https://explore-the-unknown.vercel.app/)** - Live demonstration and information
- **[Active Inference Institute](https://www.activeinference.institute/)** - Supporting organization
- **[Research Papers](docs/research-papers.md)** - Academic publications and references
- **[Community Forum](https://github.com/your-username/Research-Discovery-Engine/discussions)** - Discussions and support

## 👥 Team

The Research Discovery Engine is developed by a multidisciplinary team combining expertise in:
- **Computer Science**: AI/ML, graph algorithms, software engineering
- **Cognitive Science**: Active inference, knowledge representation
- **Research Methods**: Scientific discovery, literature analysis
- **User Experience**: Interface design, visualization, interaction

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact & Support

- **GitHub Issues**: [Report bugs and request features](https://github.com/your-username/Research-Discovery-Engine/issues)
- **Discussions**: [Community forum](https://github.com/your-username/Research-Discovery-Engine/discussions)
- **Email**: [Contact the team](mailto:contact@research-discovery-engine.org)

## 🙏 Acknowledgments

Special thanks to the Active Inference Institute and all contributors who have helped shape this platform. This work builds upon decades of research in knowledge representation, graph theory, and cognitive science.

---

**Ready to transform how research is discovered and conducted?** Start with the [Getting Started Guide](docs/getting-started.md) or explore the live [Discovery Engine](DE/)!
