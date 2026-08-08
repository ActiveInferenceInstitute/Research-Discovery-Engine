# Output Directory Structure

## Overview

All batch test outputs are now organized under a single top-level `outputs/` directory with timestamped subdirectories for each batch run.

## Directory Structure

```
DE/
├── outputs/                              # Top-level output directory
│   ├── batch-test-YYYYMMDD-HHMMSS/      # Headless batch test results
│   │   ├── generate-summary_TIMESTAMP/   # Individual script outputs
│   │   ├── analyze-data_TIMESTAMP/       # 
│   │   ├── test-suite-results.json       # Comprehensive test results
│   │   └── performance-analysis.json     # Performance benchmarks
│   │
│   └── llm-batch-test-YYYYMMDD-HHMMSS/  # LLM batch test results
│       ├── llm-summary_TIMESTAMP/        # LLM-enhanced summaries
│       ├── llm-knowledge_TIMESTAMP/      # LLM knowledge processing
│       └── *.json                        # Test reports and metadata
```

## Output Types

### Headless Batch Tests (`batch-test-*`)
- Traditional research processing workflows
- Multiple concept summaries in various formats
- Data analysis and validation reports
- Protocol generation results
- Comprehensive test suite results

### LLM Batch Tests (`llm-batch-test-*`)
- AI-enhanced research summaries
- Knowledge extraction and processing
- OpenAI API integration tests
- Token usage and performance metrics

## Individual Run Directories

Each timestamped subdirectory contains:
- `core-output.json` - Complete structured results
- `processing-report.json` - Execution log with timing
- `*.md` - Human-readable summaries and reports
- Format-specific outputs (markdown, JSON, etc.)

## Benefits

1. **Centralized Organization**: All outputs in one place
2. **Temporal Tracking**: Timestamped directories for version control
3. **Easy Comparison**: Compare results across different runs
4. **Clean Repository**: Keeps main directory structure clean
5. **Archival Ready**: Complete audit trail for research workflows

## Usage

The output directory structure is automatically created by the batch test scripts:

```bash
# Headless batch tests
./scripts/examples/batch-test-headless.sh

# LLM batch tests  
./scripts/batch-test-llm.sh
```

Both scripts now automatically create `./outputs/` directory and organize all results within timestamped subdirectories. 