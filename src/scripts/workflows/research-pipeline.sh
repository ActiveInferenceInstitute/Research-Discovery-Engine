#!/bin/bash

# Research Pipeline Script for Discovery Engine
# This script automates complete research workflows from data ingestion to collaboration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
API_BASE_URL="http://localhost:8000/api/v1"
PIPELINE_NAME="research-pipeline-$(date +%Y%m%d_%H%M%S)"
RESULTS_DIR="$PROJECT_ROOT/pipeline-results/$PIPELINE_NAME"

print_usage() {
    echo "Usage: $0 [OPTIONS] RESEARCH_DOMAIN"
    echo ""
    echo "Run complete research pipeline for Discovery Engine"
    echo ""
    echo "Arguments:"
    echo "  RESEARCH_DOMAIN    Research domain to analyze (materials-science|biology|chemistry|physics)"
    echo ""
    echo "Options:"
    echo "  -d, --data-dir DIR         Directory containing research documents [default: ./data]"
    echo "  -o, --output-dir DIR       Output directory for results [default: ./pipeline-results]"
    echo "  -u, --api-url URL          API base URL [default: $API_BASE_URL]"
    echo "  -s, --steps STEPS          Comma-separated list of steps to run [default: all]"
    echo "  -p, --parallel             Run compatible steps in parallel"
    echo "  -r, --resume               Resume from last successful step"
    echo "  -c, --clean                Clean previous results before starting"
    echo "  -v, --verbose              Verbose output"
    echo "  -h, --help                 Show this help message"
    echo ""
    echo "Pipeline Steps:"
    echo "  1. ingest        - Process and ingest research documents"
    echo "  2. analyze       - Analyze knowledge graph structure"
    echo "  3. gaps          - Identify knowledge gaps"
    echo "  4. connections   - Discover hidden connections"
    echo "  5. hypotheses    - Generate research hypotheses"
    echo "  6. validate      - Validate generated concepts"
    echo "  7. protocols     - Generate experimental protocols"
    echo "  8. collaborate   - Prepare collaboration packages"
    echo "  9. export        - Export results in multiple formats"
    echo ""
    echo "Examples:"
    echo "  $0 materials-science                    # Run complete pipeline"
    echo "  $0 --steps analyze,gaps biology         # Run only analysis and gap identification"
    echo "  $0 --parallel --data-dir ~/docs chemistry  # Run with parallel processing"
    echo "  $0 --resume materials-science          # Resume interrupted pipeline"
}

# Parse command line arguments
DATA_DIR="./data"
OUTPUT_DIR="./pipeline-results"
URL="$API_BASE_URL"
STEPS="all"
PARALLEL=false
RESUME=false
CLEAN=false
VERBOSE=false
RESEARCH_DOMAIN=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--data-dir)
            DATA_DIR="$2"
            shift 2
            ;;
        -o|--output-dir)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        -u|--api-url)
            URL="$2"
            shift 2
            ;;
        -s|--steps)
            STEPS="$2"
            shift 2
            ;;
        -p|--parallel)
            PARALLEL=true
            shift
            ;;
        -r|--resume)
            RESUME=true
            shift
            ;;
        -c|--clean)
            CLEAN=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        --dry-run)
            # For compatibility with orchestrator demo mode
            log_info "Demo mode: Would run research pipeline for $2"
            exit 0
            ;;
        -h|--help)
            print_usage
            exit 0
            ;;
        -*)
            log_error "Unknown option $1"
            print_usage
            exit 1
            ;;
        *)
            RESEARCH_DOMAIN="$1"
            shift
            ;;
    esac
done

if [ -z "$RESEARCH_DOMAIN" ]; then
    log_error "Research domain is required"
    print_usage
    exit 1
fi

# Update results directory based on output directory
RESULTS_DIR="$OUTPUT_DIR/$PIPELINE_NAME"

setup_pipeline() {
    log_info "Setting up research pipeline..."
    
    # Create results directory
    mkdir -p "$RESULTS_DIR"
    
    # Clean if requested
    if [ "$CLEAN" = true ]; then
        log_info "Cleaning previous results..."
        rm -rf "$OUTPUT_DIR"/*
        mkdir -p "$RESULTS_DIR"
    fi
    
    # Create subdirectories
    mkdir -p "$RESULTS_DIR"/{data,analysis,gaps,connections,hypotheses,protocols,exports,logs}
    
    # Initialize pipeline state
    cat > "$RESULTS_DIR/pipeline-state.json" << EOF
{
    "pipeline_name": "$PIPELINE_NAME",
    "research_domain": "$RESEARCH_DOMAIN",
    "start_time": "$(date -Iseconds)",
    "status": "running",
    "steps": {
        "ingest": "pending",
        "analyze": "pending",
        "gaps": "pending",
        "connections": "pending",
        "hypotheses": "pending",
        "validate": "pending",
        "protocols": "pending",
        "collaborate": "pending",
        "export": "pending"
    },
    "data_dir": "$DATA_DIR",
    "output_dir": "$RESULTS_DIR"
}
EOF
    
    log_success "Pipeline setup complete: $RESULTS_DIR"
}

check_prerequisites() {
    log_info "Checking pipeline prerequisites..."
    
    # Check if jq is available
    if ! command -v jq &> /dev/null; then
        log_error "jq is required for JSON processing"
        exit 1
    fi
    
    # Check if curl is available
    if ! command -v curl &> /dev/null; then
        log_error "curl is required for API calls"
        exit 1
    fi
    
    # Check if Python is available for advanced processing
    if ! command -v python3 &> /dev/null; then
        log_warning "Python3 not found - some advanced features may be unavailable"
    fi
    
    # Test API connection
    if ! curl -s --fail "$URL/health/" >/dev/null 2>&1; then
        log_error "Cannot connect to Discovery Engine API at $URL"
        log_info "Make sure the backend is running: cd resnei && python manage.py runserver"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

update_step_status() {
    local step="$1"
    local status="$2"
    
    jq --arg step "$step" --arg status "$status" \
        '.steps[$step] = $status' \
        "$RESULTS_DIR/pipeline-state.json" > "$RESULTS_DIR/pipeline-state.tmp" && \
    mv "$RESULTS_DIR/pipeline-state.tmp" "$RESULTS_DIR/pipeline-state.json"
}

step_ingest() {
    if should_skip_step "ingest"; then return 0; fi
    
    log_info "Step 1: Ingesting research documents..."
    update_step_status "ingest" "running"
    
    local ingest_log="$RESULTS_DIR/logs/ingest.log"
    
    # Find documents to ingest
    if [ ! -d "$DATA_DIR" ]; then
        log_warning "Data directory not found: $DATA_DIR"
        log_info "Creating sample data directory..."
        mkdir -p "$DATA_DIR"
        echo "Place your research documents (PDF, TXT, MD) in: $DATA_DIR"
        update_step_status "ingest" "skipped"
        return 0
    fi
    
    local doc_count=$(find "$DATA_DIR" -type f \( -name "*.pdf" -o -name "*.txt" -o -name "*.md" \) | wc -l)
    
    if [ "$doc_count" -eq 0 ]; then
        log_warning "No documents found in $DATA_DIR"
        update_step_status "ingest" "skipped"
        return 0
    fi
    
    log_info "Found $doc_count documents to process"
    
    # Process documents
    local processed=0
    find "$DATA_DIR" -type f \( -name "*.pdf" -o -name "*.txt" -o -name "*.md" \) | while read -r doc; do
        log_info "Processing document: $(basename "$doc")"
        
        # Upload document via API
        local response=$(curl -s -X POST "$URL/documents/upload" \
            -F "file=@$doc" \
            -F "metadata={\"category\":\"research-paper\",\"domain\":\"$RESEARCH_DOMAIN\"}" \
            -F "processing_options={\"extract_concepts\":true,\"extract_relationships\":true}")
        
        if echo "$response" | jq -e '.success' >/dev/null 2>&1; then
            local doc_id=$(echo "$response" | jq -r '.data.id')
            echo "$(basename "$doc"): $doc_id" >> "$RESULTS_DIR/data/processed-documents.txt"
            processed=$((processed + 1))
            log_success "Processed: $(basename "$doc") -> $doc_id"
        else
            log_error "Failed to process: $(basename "$doc")"
            echo "$response" >> "$ingest_log"
        fi
        
        # Small delay between uploads
        sleep 1
    done
    
    # Wait for processing to complete
    log_info "Waiting for document processing to complete..."
    
    if [ -f "$RESULTS_DIR/data/processed-documents.txt" ]; then
        while read -r line; do
            local doc_id=$(echo "$line" | cut -d':' -f2 | tr -d ' ')
            local status="processing"
            
            while [ "$status" = "processing" ]; do
                sleep 5
                local status_response=$(curl -s "$URL/documents/$doc_id/status")
                status=$(echo "$status_response" | jq -r '.data.status')
                
                if [ "$VERBOSE" = true ]; then
                    log_info "Document $doc_id status: $status"
                fi
            done
            
            if [ "$status" = "completed" ]; then
                log_success "Document $doc_id processing completed"
            else
                log_error "Document $doc_id processing failed: $status"
            fi
        done < "$RESULTS_DIR/data/processed-documents.txt"
    fi
    
    update_step_status "ingest" "completed"
    log_success "Document ingestion completed"
}

step_analyze() {
    if should_skip_step "analyze"; then return 0; fi
    
    log_info "Step 2: Analyzing knowledge graph structure..."
    update_step_status "analyze" "running"
    
    # Get graph analytics
    local analytics=$(curl -s "$URL/graph/analytics?metrics=centrality,clustering,density&domain=$RESEARCH_DOMAIN")
    
    if echo "$analytics" | jq -e '.success' >/dev/null 2>&1; then
        echo "$analytics" | jq '.data' > "$RESULTS_DIR/analysis/graph-analytics.json"
        
        # Generate analysis summary
        local total_nodes=$(echo "$analytics" | jq '.data.overview.total_nodes')
        local total_relationships=$(echo "$analytics" | jq '.data.overview.total_relationships')
        local density=$(echo "$analytics" | jq '.data.overview.density')
        
        cat > "$RESULTS_DIR/analysis/summary.md" << EOF
# Graph Analysis Summary

## Overview
- **Domain**: $RESEARCH_DOMAIN
- **Total Concepts**: $total_nodes
- **Total Relationships**: $total_relationships
- **Graph Density**: $density

## Key Insights
$(echo "$analytics" | jq -r '.data.insights[]? // "No specific insights available"')

## Most Central Concepts
$(echo "$analytics" | jq -r '.data.centrality.most_central[]? | "- \(.label) (\(.category))"' | head -10)
EOF
        
        log_success "Graph analysis completed"
    else
        log_error "Failed to get graph analytics"
        echo "$analytics" > "$RESULTS_DIR/logs/analyze-error.log"
        update_step_status "analyze" "failed"
        return 1
    fi
    
    update_step_status "analyze" "completed"
}

step_gaps() {
    if should_skip_step "gaps"; then return 0; fi
    
    log_info "Step 3: Identifying knowledge gaps..."
    update_step_status "gaps" "running"
    
    # Use the gap discovery workflow
    cat > "$RESULTS_DIR/gaps/gap-analysis.js" << 'EOF'
import DiscoveryEngineClient from '../../utils/de-client/index.js';

const client = new DiscoveryEngineClient({
    baseURL: process.env.API_URL || 'http://localhost:8000/api/v1'
});

async function analyzeGaps() {
    try {
        const gapAnalysis = await client.agents.triggerAction(
            'exploration-agent',
            'identify_knowledge_gaps',
            {
                domain: process.env.RESEARCH_DOMAIN,
                analysis_depth: 'comprehensive'
            }
        );
        
        console.log(JSON.stringify(gapAnalysis, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

analyzeGaps();
EOF
    
    # Run gap analysis
    if command -v node &> /dev/null; then
        cd "$PROJECT_ROOT"
        API_URL="$URL" RESEARCH_DOMAIN="$RESEARCH_DOMAIN" node "$RESULTS_DIR/gaps/gap-analysis.js" > "$RESULTS_DIR/gaps/gaps.json" 2> "$RESULTS_DIR/logs/gaps-error.log"
        
        if [ $? -eq 0 ]; then
            # Generate gap summary
            if command -v jq &> /dev/null && [ -f "$RESULTS_DIR/gaps/gaps.json" ]; then
                local gap_count=$(jq '.results.gaps | length' "$RESULTS_DIR/gaps/gaps.json" 2>/dev/null || echo "0")
                log_info "Identified $gap_count knowledge gaps"
                
                jq -r '.results.gaps[]? | "- \(.description) (\(.severity))"' "$RESULTS_DIR/gaps/gaps.json" > "$RESULTS_DIR/gaps/gap-summary.txt" 2>/dev/null || true
            fi
            
            log_success "Gap analysis completed"
        else
            log_error "Gap analysis failed"
            update_step_status "gaps" "failed"
            return 1
        fi
    else
        log_warning "Node.js not available - using simplified gap analysis"
        # Simplified gap analysis using curl
        local response=$(curl -s -X POST "$URL/agents/action" \
            -H "Content-Type: application/json" \
            -d "{\"agent\":\"exploration-agent\",\"action\":\"identify_knowledge_gaps\",\"context\":{\"domain\":\"$RESEARCH_DOMAIN\"}}")
        
        echo "$response" > "$RESULTS_DIR/gaps/gaps.json"
    fi
    
    update_step_status "gaps" "completed"
}

step_connections() {
    if should_skip_step "connections"; then return 0; fi
    
    log_info "Step 4: Discovering hidden connections..."
    update_step_status "connections" "running"
    
    # Get top concepts from previous analysis
    local top_concepts=$(jq -r '.data.centrality.most_central[0:10] | map(.id) | join(",")' "$RESULTS_DIR/analysis/graph-analytics.json" 2>/dev/null || echo "")
    
    if [ -n "$top_concepts" ]; then
        local response=$(curl -s -X POST "$URL/agents/action" \
            -H "Content-Type: application/json" \
            -d "{\"agent\":\"exploration-agent\",\"action\":\"find_hidden_connections\",\"context\":{\"concepts\":[\"$top_concepts\"],\"max_distance\":3}}")
        
        echo "$response" > "$RESULTS_DIR/connections/connections.json"
        
        if echo "$response" | jq -e '.success' >/dev/null 2>&1; then
            log_success "Connection discovery completed"
        else
            log_error "Connection discovery failed"
            update_step_status "connections" "failed"
            return 1
        fi
    else
        log_warning "No concepts available for connection analysis"
        echo '{"connections": [], "message": "No concepts available"}' > "$RESULTS_DIR/connections/connections.json"
    fi
    
    update_step_status "connections" "completed"
}

step_hypotheses() {
    if should_skip_step "hypotheses"; then return 0; fi
    
    log_info "Step 5: Generating research hypotheses..."
    update_step_status "hypotheses" "running"
    
    # Generate hypotheses based on gaps and connections
    local response=$(curl -s -X POST "$URL/agents/action" \
        -H "Content-Type: application/json" \
        -d "{\"agent\":\"hypothesis-agent\",\"action\":\"generate_hypotheses\",\"context\":{\"domain\":\"$RESEARCH_DOMAIN\",\"novelty_threshold\":0.7}}")
    
    echo "$response" > "$RESULTS_DIR/hypotheses/hypotheses.json"
    
    if echo "$response" | jq -e '.success' >/dev/null 2>&1; then
        # Generate hypothesis summary
        local hypothesis_count=$(echo "$response" | jq '.results.hypotheses | length' 2>/dev/null || echo "0")
        log_info "Generated $hypothesis_count research hypotheses"
        
        echo "$response" | jq -r '.results.hypotheses[]? | "- \(.statement) (Novelty: \(.novelty), Feasibility: \(.feasibility))"' > "$RESULTS_DIR/hypotheses/hypothesis-summary.txt" 2>/dev/null || true
        
        log_success "Hypothesis generation completed"
    else
        log_error "Hypothesis generation failed"
        update_step_status "hypotheses" "failed"
        return 1
    fi
    
    update_step_status "hypotheses" "completed"
}

step_validate() {
    if should_skip_step "validate"; then return 0; fi
    
    log_info "Step 6: Validating generated concepts..."
    update_step_status "validate" "running"
    
    # Validate top hypotheses
    if [ -f "$RESULTS_DIR/hypotheses/hypotheses.json" ]; then
        local hypothesis_ids=$(jq -r '.results.hypotheses[0:3][]?.id // empty' "$RESULTS_DIR/hypotheses/hypotheses.json" 2>/dev/null)
        
        if [ -n "$hypothesis_ids" ]; then
            echo "$hypothesis_ids" | while read -r hypothesis_id; do
                if [ -n "$hypothesis_id" ]; then
                    log_info "Validating hypothesis: $hypothesis_id"
                    
                    local validation=$(curl -s -X POST "$URL/concepts/$hypothesis_id/validate" \
                        -H "Content-Type: application/json" \
                        -d '{"validation_types":["compatibility","feasibility"],"strictness":"standard"}')
                    
                    echo "$validation" > "$RESULTS_DIR/hypotheses/validation-$hypothesis_id.json"
                fi
            done
            
            log_success "Concept validation completed"
        else
            log_warning "No hypotheses available for validation"
        fi
    else
        log_warning "No hypotheses file found - skipping validation"
    fi
    
    update_step_status "validate" "completed"
}

step_protocols() {
    if should_skip_step "protocols"; then return 0; fi
    
    log_info "Step 7: Generating experimental protocols..."
    update_step_status "protocols" "running"
    
    # Generate protocols for validated concepts
    if [ -f "$RESULTS_DIR/hypotheses/hypotheses.json" ]; then
        local concept_ids=$(jq -r '.results.hypotheses[0:2][]?.id // empty' "$RESULTS_DIR/hypotheses/hypotheses.json" 2>/dev/null)
        
        echo "$concept_ids" | while read -r concept_id; do
            if [ -n "$concept_id" ]; then
                log_info "Generating protocol for concept: $concept_id"
                
                local protocol=$(curl -s -X POST "$URL/concepts/$concept_id/protocol" \
                    -H "Content-Type: application/json" \
                    -d '{"type":"full","detail_level":"detailed","constraints":{"equipment_availability":"standard_lab"}}')
                
                echo "$protocol" > "$RESULTS_DIR/protocols/protocol-$concept_id.json"
                
                if echo "$protocol" | jq -e '.success' >/dev/null 2>&1; then
                    log_success "Protocol generated for: $concept_id"
                else
                    log_warning "Protocol generation failed for: $concept_id"
                fi
            fi
        done
        
        log_success "Protocol generation completed"
    else
        log_warning "No concepts available for protocol generation"
    fi
    
    update_step_status "protocols" "completed"
}

step_collaborate() {
    if should_skip_step "collaborate"; then return 0; fi
    
    log_info "Step 8: Preparing collaboration packages..."
    update_step_status "collaborate" "running"
    
    # Create collaboration summary
    cat > "$RESULTS_DIR/collaborate/collaboration-package.md" << EOF
# Research Collaboration Package

## Domain: $RESEARCH_DOMAIN
## Generated: $(date)

### Knowledge Gaps Identified
$(cat "$RESULTS_DIR/gaps/gap-summary.txt" 2>/dev/null || echo "No gaps identified")

### Research Hypotheses
$(cat "$RESULTS_DIR/hypotheses/hypothesis-summary.txt" 2>/dev/null || echo "No hypotheses generated")

### Collaboration Opportunities
- Cross-domain research projects
- Experimental validation studies
- Knowledge integration initiatives

### Required Expertise
- Domain experts in $RESEARCH_DOMAIN
- Experimental researchers
- Data analysis specialists

### Next Steps
1. Review identified opportunities
2. Contact potential collaborators
3. Design validation experiments
4. Secure funding and resources
EOF
    
    # Package all results
    cd "$RESULTS_DIR"
    tar -czf "collaboration-package.tar.gz" \
        analysis/ gaps/ connections/ hypotheses/ protocols/ collaborate/collaboration-package.md \
        2>/dev/null || log_warning "Failed to create collaboration package archive"
    
    log_success "Collaboration package prepared"
    update_step_status "collaborate" "completed"
}

step_export() {
    if should_skip_step "export"; then return 0; fi
    
    log_info "Step 9: Exporting results..."
    update_step_status "export" "running"
    
    # Export graph data in multiple formats
    "$PROJECT_ROOT/src/scripts/data/export-graph.sh" \
        --format json \
        --output "$RESULTS_DIR/exports/graph-data" \
        --categories "$RESEARCH_DOMAIN" \
        --metadata >/dev/null 2>&1 || log_warning "JSON export failed"
    
    "$PROJECT_ROOT/src/scripts/data/export-graph.sh" \
        --format csv \
        --output "$RESULTS_DIR/exports/graph-data" \
        --categories "$RESEARCH_DOMAIN" >/dev/null 2>&1 || log_warning "CSV export failed"
    
    # Create comprehensive results report
    cat > "$RESULTS_DIR/exports/pipeline-report.md" << EOF
# Research Pipeline Results

## Pipeline Information
- **Pipeline ID**: $PIPELINE_NAME
- **Domain**: $RESEARCH_DOMAIN
- **Execution Date**: $(date)
- **Status**: $(jq -r '.status' "$RESULTS_DIR/pipeline-state.json")

## Summary Statistics
- **Documents Processed**: $(wc -l < "$RESULTS_DIR/data/processed-documents.txt" 2>/dev/null || echo "0")
- **Knowledge Gaps**: $(jq '.results.gaps | length' "$RESULTS_DIR/gaps/gaps.json" 2>/dev/null || echo "0")
- **Hypotheses Generated**: $(jq '.results.hypotheses | length' "$RESULTS_DIR/hypotheses/hypotheses.json" 2>/dev/null || echo "0")
- **Protocols Created**: $(find "$RESULTS_DIR/protocols" -name "protocol-*.json" | wc -l)

## Key Findings
$(head -10 "$RESULTS_DIR/gaps/gap-summary.txt" 2>/dev/null || echo "No findings available")

## Files Generated
\`\`\`
$(find "$RESULTS_DIR" -type f -name "*.json" -o -name "*.md" -o -name "*.txt" | sort)
\`\`\`

## Usage Instructions
1. Review the analysis results in \`analysis/\`
2. Examine identified gaps in \`gaps/\`
3. Consider the generated hypotheses in \`hypotheses/\`
4. Use the protocols in \`protocols/\` for experimental design
5. Share the collaboration package for partnerships

EOF
    
    log_success "Results exported successfully"
    update_step_status "export" "completed"
}

should_skip_step() {
    local step="$1"
    
    # Check if we should run only specific steps
    if [ "$STEPS" != "all" ]; then
        if ! echo "$STEPS" | grep -q "$step"; then
            return 0 # Skip this step
        fi
    fi
    
    # Check if resuming and step is already completed
    if [ "$RESUME" = true ]; then
        local status=$(jq -r ".steps.$step" "$RESULTS_DIR/pipeline-state.json" 2>/dev/null || echo "pending")
        if [ "$status" = "completed" ]; then
            log_info "Skipping already completed step: $step"
            return 0 # Skip this step
        fi
    fi
    
    return 1 # Don't skip this step
}

run_pipeline() {
    log_info "Starting research pipeline: $PIPELINE_NAME"
    log_info "Domain: $RESEARCH_DOMAIN"
    log_info "Steps: $STEPS"
    
    # Update pipeline status
    jq '.status = "running"' "$RESULTS_DIR/pipeline-state.json" > "$RESULTS_DIR/pipeline-state.tmp" && \
    mv "$RESULTS_DIR/pipeline-state.tmp" "$RESULTS_DIR/pipeline-state.json"
    
    local start_time=$(date +%s)
    
    # Run pipeline steps
    if [ "$PARALLEL" = true ]; then
        log_info "Running compatible steps in parallel..."
        
        # Run independent steps in parallel
        step_ingest &
        INGEST_PID=$!
        
        wait $INGEST_PID
        
        # Run analysis-dependent steps
        step_analyze
        
        # Run parallel analysis steps
        step_gaps &
        GAPS_PID=$!
        
        step_connections &
        CONNECTIONS_PID=$!
        
        wait $GAPS_PID $CONNECTIONS_PID
        
        # Run sequential final steps
        step_hypotheses
        step_validate
        step_protocols
        step_collaborate
        step_export
    else
        log_info "Running steps sequentially..."
        
        step_ingest
        step_analyze
        step_gaps
        step_connections
        step_hypotheses
        step_validate
        step_protocols
        step_collaborate
        step_export
    fi
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    # Update final pipeline status
    jq --arg end_time "$(date -Iseconds)" \
       --arg duration "$duration" \
       '.status = "completed" | .end_time = $end_time | .duration_seconds = ($duration | tonumber)' \
       "$RESULTS_DIR/pipeline-state.json" > "$RESULTS_DIR/pipeline-state.tmp" && \
    mv "$RESULTS_DIR/pipeline-state.tmp" "$RESULTS_DIR/pipeline-state.json"
    
    log_success "Research pipeline completed successfully!"
    log_info "Duration: $duration seconds"
    log_info "Results available in: $RESULTS_DIR"
    
    # Display summary
    echo ""
    echo "=================================================="
    echo "  Pipeline Summary"
    echo "=================================================="
    echo "Domain: $RESEARCH_DOMAIN"
    echo "Duration: $duration seconds"
    echo "Results: $RESULTS_DIR"
    echo ""
    echo "Key Outputs:"
    [ -f "$RESULTS_DIR/analysis/graph-analytics.json" ] && echo "✓ Graph analysis"
    [ -f "$RESULTS_DIR/gaps/gaps.json" ] && echo "✓ Knowledge gaps"
    [ -f "$RESULTS_DIR/hypotheses/hypotheses.json" ] && echo "✓ Research hypotheses"
    [ -f "$RESULTS_DIR/collaborate/collaboration-package.md" ] && echo "✓ Collaboration package"
    echo ""
    echo "Next steps:"
    echo "1. Review results in $RESULTS_DIR/exports/pipeline-report.md"
    echo "2. Share collaboration package with potential partners"
    echo "3. Begin experimental validation of top hypotheses"
}

cleanup_on_exit() {
    # Update status if pipeline was interrupted
    if [ -f "$RESULTS_DIR/pipeline-state.json" ]; then
        local current_status=$(jq -r '.status' "$RESULTS_DIR/pipeline-state.json")
        if [ "$current_status" = "running" ]; then
            jq '.status = "interrupted"' "$RESULTS_DIR/pipeline-state.json" > "$RESULTS_DIR/pipeline-state.tmp" && \
            mv "$RESULTS_DIR/pipeline-state.tmp" "$RESULTS_DIR/pipeline-state.json"
        fi
    fi
}

main() {
    trap cleanup_on_exit EXIT
    
    check_prerequisites
    setup_pipeline
    run_pipeline
}

# Run main function
main "$@" 