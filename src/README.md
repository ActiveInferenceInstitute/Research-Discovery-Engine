# Research Discovery Engine - Modular Documentation & Scripts

This directory contains modular documentation, scripts, and utilities for interacting with the Research Discovery Engine (DE). It provides code examples, automation scripts, and detailed integration guides that complement the main documentation.

## Directory Structure

```
src/
├── docs/                    # Modular documentation
│   ├── integration/         # Integration guides
│   ├── examples/           # Code examples
│   ├── workflows/          # Common workflows
│   └── troubleshooting/    # Specific issue guides
├── scripts/                # Automation scripts
│   ├── setup/             # Setup and configuration scripts
│   ├── data/              # Data management scripts
│   ├── deployment/        # Deployment utilities
│   └── maintenance/       # Maintenance and monitoring scripts
├── examples/              # Complete example projects
│   ├── basic-usage/       # Simple DE integration
│   ├── research-workflow/ # Complete research pipeline
│   └── custom-agents/     # Custom agent development
├── utils/                 # Utility libraries
│   ├── de-client/         # DE client library
│   ├── graph-utils/       # Graph manipulation utilities
│   └── data-processors/   # Data processing utilities
└── templates/             # Project templates
    ├── research-project/  # Research project template
    └── integration/       # Integration project template
```

## Quick Start

### Using Discovery Engine Scripts

```bash
# Setup the Discovery Engine
./scripts/setup/quick-setup.sh

# Start DE development environment
./scripts/setup/start-de-dev.sh

# Run a complete research workflow
./scripts/workflows/research-pipeline.sh

# Data management
./scripts/data/import-concepts.sh your-data.json
./scripts/data/export-graph.sh --format json --output graph-data.json
```

### Code Examples

```bash
# Basic DE client usage
cd examples/basic-usage
npm install
npm run demo

# Research workflow example
cd examples/research-workflow
python setup.py install
python run_workflow.py
```

## Features

### 🔧 Automation Scripts
- **Setup Scripts**: Automated DE installation and configuration
- **Data Scripts**: Import/export knowledge graphs, process documents
- **Deployment Scripts**: Production deployment automation
- **Maintenance Scripts**: Monitoring, backup, and optimization

### 📚 Modular Documentation
- **Integration Guides**: Step-by-step integration instructions
- **Code Examples**: Practical usage examples in multiple languages
- **Workflow Documentation**: Common research and development workflows
- **Troubleshooting Guides**: Specific solutions for common issues

### 🛠️ Utility Libraries
- **DE Client**: Simplified API client for Discovery Engine
- **Graph Utilities**: Tools for knowledge graph manipulation
- **Data Processors**: Document and data processing utilities

### 📝 Templates
- **Research Project Template**: Complete setup for research projects
- **Integration Template**: Boilerplate for DE integration projects

## Main Documentation Links

- **[Getting Started](../docs/getting-started.md)** - Initial setup and first steps
- **[User Guide](../docs/user-guide.md)** - Complete feature documentation
- **[Developer Guide](../docs/developer-guide.md)** - Development and contribution guide
- **[API Reference](../docs/api-reference.md)** - Complete API documentation
- **[Deployment Guide](../docs/deployment.md)** - Production deployment instructions

## Contributing

When adding new scripts or documentation:

1. Follow the existing directory structure
2. Include comprehensive documentation
3. Add error handling and logging
4. Include usage examples
5. Update this README with new additions

## License

This documentation and scripts are part of the Research Discovery Engine project and follow the same MIT license. 