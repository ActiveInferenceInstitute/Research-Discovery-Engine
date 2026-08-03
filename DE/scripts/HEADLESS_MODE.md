# Headless Mode Implementation with LLM Integration

This document describes the comprehensive headless mode functionality implemented across all standalone scripts in the Research Discovery Engine, including full LLM integration testing. Headless mode allows scripts to run without displaying output to the console, instead saving structured results to timestamped output folders.

> **Status (audited 2026-08-02):** Not every script implements headless mode. Only `generate-summary.ts` and `analyze-data.ts` parse `--headless`/`--headless-output`; the LLM scripts have their own option sets. Sections below mark the actual parser state per script.

## Overview

When headless mode is enabled, each script:
1. Creates a timestamped output folder in the format `{script-name}_{timestamp}`
2. Generates structured outputs including:
   - `core-output.json` - Main results in JSON format
   - `processing-report.json` - Detailed execution metadata
   - `report-summary.md` - Human-readable summary report
   - Additional format-specific outputs (e.g., `summary.md`, `protocol.md`)

## Common Options

All scripts support these headless mode options:

- `--headless` - Enable headless mode with default output location (`./output`)
- `--headless-output <directory>` - Enable headless mode with custom output directory

## Implemented Scripts

### 1. generate-summary.ts ✅ IMPLEMENTED

Generates research summaries with comprehensive metadata.

### 2. llm-generate-summary.ts ✅ IMPLEMENTED

LLM-enhanced summary generation with advanced AI capabilities.

**Traditional Usage:**
```bash
# Basic headless mode
npx tsx DE/scripts/generate-summary.ts --headless

# Custom concept and output directory
npx tsx DE/scripts/generate-summary.ts --headless --concept "Bio-Inspired Materials" --headless-output ./my-summaries

# JSON format output
npx tsx DE/scripts/generate-summary.ts --headless --format json
```

**LLM-Enhanced Usage:**
```bash
# LLM-powered comprehensive summary
npx tsx DE/scripts/llm-generate-summary.ts --headless \
  --concept "Advanced Smart Materials" \
  --domain "materials science" \
  --summary-type "comprehensive" \
  --target-audience "researcher"

# Executive summary for industry
npx tsx DE/scripts/llm-generate-summary.ts --headless \
  --concept "Nanocomposite Applications" \
  --summary-type "executive" \
  --target-audience "industry" \
  --length "brief"
```

**Output Structure:**
```
generate-summary_2025-06-10T21-03-55/
├── core-output.json       # Complete results with metadata
├── processing-report.json # Execution details and timing
├── report-summary.md      # Human-readable report
└── summary.md            # Generated summary content
```

**Unique Options:**
- `--concept "name"` - Target concept for summary
- `--format markdown|json` - Output format

### 2. generate-protocol.ts 🚧 PARTIAL

Generates experimental protocols from concept definitions.

**Usage (CLI implemented; headless options not parsed):**
```bash
# Generate a protocol from an objective
npx tsx DE/scripts/generate-protocol.ts --objective "Smart Hydrogel Actuator"

# With specific materials and mechanisms
npx tsx DE/scripts/generate-protocol.ts \
  --objective "Adaptive Material System" \
  --materials "PEG_Hydrogel,Iron_Nanoparticles" \
  --mechanisms "Magnetic_Actuation,pH_Response" \
  --detail-level advanced
```

The source header documents `--headless` and `--headless-output`, but the argument parser does not handle them; headless execution for this script is not implemented.

**Unique Options:**
- `--objective "text"` - Concept objective (required)
- `--materials "a,b,c"` - Comma-separated materials list
- `--mechanisms "x,y,z"` - Comma-separated mechanisms list
- `--methods "m1,m2"` - Comma-separated methods list
- `--detail-level basic|intermediate|advanced` - Protocol complexity
- `--output-file path` - Write the protocol to a file

### 3. analyze-data.ts ✅ IMPLEMENTED

Performs comprehensive data analysis on graph structures.

**Usage:**
```bash
# Statistical analysis in headless mode
npx tsx DE/scripts/analyze-data.ts --headless --stats --validate

# Search analysis with custom output
npx tsx DE/scripts/analyze-data.ts --headless \
  --search-query "polymer" \
  --input-file graph.json \
  --headless-output ./analysis-results

# Path finding analysis
npx tsx DE/scripts/analyze-data.ts --headless \
  --find-path "node-a" "node-b" \
  --input-file graph.json
```

**Unique Options:**
- `--input-file path` - Input graph data JSON file
- `--search-query "terms"` - Search for nodes matching terms
- `--stats` - Calculate comprehensive statistics
- `--validate` - Validate graph structure
- `--find-path source target` - Find shortest path between nodes
- `--output-format json|readable` - Output format

### 4. process-knowledge.ts ✅ IMPLEMENTED (no headless mode)

Processes and transforms knowledge graph data.

**Usage:**
```bash
# Process a single markdown file
npx tsx DE/scripts/process-knowledge.ts --source-file path/to/file.md

# Process a directory and extract references
npx tsx DE/scripts/process-knowledge.ts --source-dir ../KG/ --extract-refs --output-file ./knowledge.json
```

The parser supports `--source-file`, `--source-dir`, `--extract-refs`, `--validate-links`, `--output-format`, `--output-file`, and `--stats`. It does not implement `--headless` or `--operation`.

### 5. run-tests.ts ✅ IMPLEMENTED (no headless mode)

Executes comprehensive test suites and validation.

**Usage:**
```bash
# Full test suite
npx tsx DE/scripts/run-tests.ts --test-type all

# Specific test categories
npx tsx DE/scripts/run-tests.ts --test-type integration --verbose
```

The parser supports `--test-type`, `--component`, `--generate-mock-data`, `--validate-graph`, `--performance-test`, `--llm-test`, `--output-format`, and `--verbose`. It does not implement `--headless` or `--suite`.

### 6. simulate-agents.ts ⚠️ NO CLI PARSER

Simulates agent interactions and workflows.

**Usage:**
```bash
npx tsx DE/scripts/simulate-agents.ts
```

This script has no command-line argument parser; it runs its built-in simulation with default parameters.

### 7. analyze-performance.ts ⚠️ NO CLI PARSER

Analyzes system performance and generates reports including LLM performance testing.

**Usage:**
```bash
npx tsx DE/scripts/analyze-performance.ts
```

This script has no command-line argument parser; it runs its built-in benchmark suite with default parameters.

### 8. llm-process-knowledge.ts ✅ IMPLEMENTED

LLM-powered knowledge extraction and processing.

**Usage:**
```bash
# Extract concepts from research text
npx tsx DE/scripts/llm-process-knowledge.ts --headless \
  --domain "materials science" \
  --input-text "Your research text here" \
  --processing-type "extract_concepts"

# Generate research questions
npx tsx DE/scripts/llm-process-knowledge.ts --headless \
  --domain "nanotechnology" \
  --input-file "./research-paper.txt" \
  --processing-type "generate_questions" \
  --question-type "exploratory"
```

### 9. run-tests.ts — LLM integration testing

Comprehensive testing suite including full LLM integration testing.

**Usage:**
```bash
# Full test suite including LLM
npx tsx DE/scripts/run-tests.ts --headless \
  --test-type all \
  --llm-test \
  --performance-test

# LLM-specific testing only
npx tsx DE/scripts/run-tests.ts --headless \
  --test-type llm \
  --verbose
```

## Output Structure

Each headless mode execution creates a folder with this structure:

```
{script-name}_{timestamp}/
├── core-output.json       # Main results in structured JSON format
├── processing-report.json # Detailed execution metadata including:
│                          #   - Script name and timestamp
│                          #   - Processing duration
│                          #   - Input files and metadata
│                          #   - Step-by-step processing log
│                          #   - Output files generated
│                          #   - Errors and warnings
│                          #   - Summary of results
├── report-summary.md      # Human-readable summary report
└── [additional files]     # Script-specific outputs like:
                          #   - summary.md (for generate-summary)
                          #   - protocol.md (for generate-protocol)
                          #   - analysis-charts.json (for analyze-data)
```

## Implementation Status

- ✅ **generate-summary.ts** - Fully implemented and tested
- 🚧 **generate-protocol.ts** - Partially implemented (CLI options added)
- 🚧 **analyze-data.ts** - Partially implemented (headless functions added)
- 📋 **process-knowledge.ts** - Planned for implementation
- 📋 **run-tests.ts** - Planned for implementation
- 📋 **simulate-agents.ts** - Planned for implementation
- 📋 **analyze-performance.ts** - Planned for implementation

## Example Workflow

Here's an example of using multiple scripts in sequence with headless mode:

```bash
# 1. Generate a research summary
npx tsx DE/scripts/generate-summary.ts --headless \
  --concept "Adaptive Smart Materials" \
  --format json

# 2. Generate experimental protocol
npx tsx DE/scripts/generate-protocol.ts --headless \
  --objective "Adaptive Smart Materials" \
  --materials "Shape_Memory_Alloy,Hydrogel" \
  --detail-level advanced

# 3. Analyze existing data
npx tsx DE/scripts/analyze-data.ts --headless \
  --stats --validate \
  --input-file data/materials.json

# All outputs will be in ./output/ with timestamped folders
```

## Benefits

1. **Automation-Friendly**: No interactive prompts or console output to interfere with scripts
2. **Structured Results**: Consistent JSON format for programmatic processing
3. **Audit Trail**: Complete processing logs with timestamps and metadata
4. **Archival**: Each run creates a permanent record with all inputs and outputs
5. **Integration**: Easy to integrate into CI/CD pipelines or batch processing systems

## Advanced Usage

### Batch Processing
```bash
#!/bin/bash
# Process multiple concepts in batch
CONCEPTS=("Smart Polymers" "Adaptive Alloys" "Bio-Inspired Materials")

for concept in "${CONCEPTS[@]}"; do
  npx tsx DE/scripts/generate-summary.ts --headless \
    --concept "$concept" \
    --headless-output "./batch-results"
done
```

### Integration with Other Tools
```bash
# Generate summary and extract keywords for further processing
OUTPUT_DIR=$(npx tsx DE/scripts/generate-summary.ts --headless --concept "AI Materials" | grep "Headless output saved to:" | cut -d' ' -f5)
KEYWORDS=$(jq -r '.summary.metadata.keywords | join(",")' "$OUTPUT_DIR/core-output.json")
echo "Extracted keywords: $KEYWORDS"
```

## Error Handling

In headless mode, errors are:
1. Logged to the processing report
2. Saved in the output directory even on failure
3. Still printed to stderr for immediate visibility
4. Include full stack traces in the JSON report

This ensures that failed runs can be diagnosed and debugged even when running in automated environments. 