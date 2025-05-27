# Scripts Directory

This directory contains automated scripts for setting up, managing, and deploying the Research Discovery Engine.

## Quick Start

The main script orchestrator (`main.py`) coordinates all scripts in the proper order with beautiful emoji-structured logging:

```bash
# 🚀 FASTEST START - Setup and launch web interface automatically
python src/scripts/main.py --categories setup --launch

# Run all scripts in proper order
python src/scripts/main.py

# Run only setup (recommended for first time)
python src/scripts/main.py --categories setup

# Preview what would run (dry run)
python src/scripts/main.py --dry-run

# Skip optional scripts (faster, setup only)
python src/scripts/main.py --skip-optional

# List all available scripts
python src/scripts/main.py --list
```

### 🎯 Recommended Workflow

1. **First Time Setup**: `python src/scripts/main.py --categories setup --launch`
2. **Access Web Interface**: Automatically opens at `http://localhost:5173`
3. **Additional Features**: Run other categories as needed

## Script Categories

### 🔧 Setup Phase
- **quick-setup.sh** - Complete environment setup and dependency installation
  - Installs Node.js dependencies
  - Sets up Python virtual environment
  - Creates configuration files
  - Required for all other scripts

### 📊 Data Phase  
- **import-concepts.sh** - Import concept data into knowledge graph
  - Supports JSON, CSV, and Markdown formats
  - Batch processing capabilities
  - Optional (requires existing data files)

- **export-graph.sh** - Export knowledge graph in multiple formats
  - JSON, CSV, GraphML, GEXF, Cytoscape formats
  - Configurable filters and compression
  - Optional (requires existing graph data)

### 🔬 Workflow Phase
- **research-pipeline.sh** - Complete research discovery pipeline
  - Document processing and analysis
  - Knowledge gap identification
  - Hypothesis generation
  - Protocol creation
  - Optional (requires backend running)

### 🚀 Deployment Phase
- **deploy.sh** - Deploy to production environments
  - Supports Vercel, Railway, AWS, Docker
  - Environment-specific configurations
  - Build and test validation
  - Optional (for production deployment)

## Script Orchestrator Features

### 🎯 Smart Dependency Management
- Automatically checks script dependencies
- Ensures proper execution order
- Skips scripts with unmet dependencies

### 📝 Beautiful Logging
- Emoji-structured output for easy reading
- Color-coded messages by importance
- Real-time progress tracking
- Detailed execution reports

### 🔄 Execution Control
- Dry run mode for previewing actions
- Category filtering for targeted execution
- Optional script skipping
- Interactive failure handling

### 📊 Comprehensive Reporting
- JSON execution reports with detailed metrics
- Success/failure statistics
- Duration tracking
- Individual script status

## Individual Script Usage

Each script can also be run independently:

```bash
# Setup
./src/scripts/setup/quick-setup.sh

# Data operations
./src/scripts/data/import-concepts.sh data/concepts.json
./src/scripts/data/export-graph.sh --format json --output graph-export

# Research pipeline
./src/scripts/workflows/research-pipeline.sh materials-science

# Deployment
./src/scripts/deployment/deploy.sh production --platform vercel
```

## Configuration

### Environment Variables
Scripts respect these environment variables:
- `API_BASE_URL` - Backend API URL (default: http://localhost:8000/api/v1)
- `NODE_ENV` - Environment mode (development/staging/production)

### Script Arguments
Most scripts support:
- `--help` - Show usage information
- `--verbose` - Enable detailed output
- `--dry-run` - Preview without executing (where applicable)

## Output and Results

### Execution Reports
The orchestrator saves detailed reports in `orchestrator-results/`:
```
orchestrator-results/
├── execution-report-<timestamp>.json
└── pipeline-logs/
```

### Individual Script Results
Scripts save results in their respective output directories:
- Setup: Configuration files in project directories
- Data: Exported files in specified output locations  
- Workflows: Results in `pipeline-results/`
- Deployment: Deployment URLs and configurations

## Error Handling

### Graceful Failure Management
- Required scripts prompt for continuation on failure
- Optional scripts continue execution automatically
- Detailed error logging with actionable messages
- Execution state preservation for resuming

### Common Issues and Solutions

#### Prerequisites Missing
```bash
# Install missing dependencies
sudo apt install jq curl python3 nodejs npm  # Ubuntu
brew install jq curl python3 node            # macOS
```

#### API Connection Errors
```bash
# Ensure backend is running
cd resnei && python manage.py runserver
```

#### Permission Errors
```bash
# Make scripts executable
chmod +x src/scripts/**/*.sh
```

## Examples

### Complete Setup Workflow
```bash
# 1. Full setup from scratch
python src/scripts/main.py --categories setup

# 2. Import sample data
python src/scripts/main.py --categories data

# 3. Run research pipeline
python src/scripts/main.py --categories workflow

# 4. Deploy to staging
python src/scripts/main.py --categories deployment
```

### Selective Execution
```bash
# Only required scripts
python src/scripts/main.py --skip-optional

# Development workflow (setup + data)
python src/scripts/main.py --categories setup data

# Production deployment only
python src/scripts/main.py --categories deployment
```

### Troubleshooting Mode
```bash
# Preview all actions
python src/scripts/main.py --dry-run

# Verbose output for debugging
python src/scripts/main.py --categories setup --verbose

# Check what scripts would run
python src/scripts/main.py --list
```

## Contributing

When adding new scripts:

1. **Add to Orchestrator**: Update `main.py` with new script information
2. **Follow Conventions**: Use consistent logging and error handling
3. **Add Documentation**: Include help text and examples
4. **Test Integration**: Ensure compatibility with orchestrator execution

### Script Template
```bash
#!/bin/bash
# Description: What this script does
# Usage: ./script.sh [options] [arguments]

set -e

# Standard logging functions
log_info() { echo -e "\033[94m[INFO]\033[0m $1"; }
log_success() { echo -e "\033[92m[SUCCESS]\033[0m $1"; }
log_error() { echo -e "\033[91m[ERROR]\033[0m $1"; }

# Main script logic here
main() {
    log_info "Starting script execution..."
    # Implementation
    log_success "Script completed successfully!"
}

main "$@"
```

For more details, see individual script documentation and the main project README. 