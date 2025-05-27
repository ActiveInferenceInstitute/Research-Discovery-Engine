#!/bin/bash

# Import Concepts Script for Research Discovery Engine
# This script imports concept data into the knowledge graph

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
DEFAULT_FORMAT="json"

print_usage() {
    echo "Usage: $0 [OPTIONS] INPUT_FILE"
    echo ""
    echo "Import concepts into the Research Discovery Engine knowledge graph"
    echo ""
    echo "Options:"
    echo "  -f, --format FORMAT     Input format (json|csv|markdown) [default: json]"
    echo "  -u, --url URL          API base URL [default: $API_BASE_URL]"
    echo "  -b, --batch-size SIZE  Batch size for import [default: 100]"
    echo "  -v, --validate         Validate data before import"
    echo "  -d, --dry-run          Show what would be imported without making changes"
    echo "  -h, --help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 concepts.json"
    echo "  $0 --format csv --validate materials.csv"
    echo "  $0 --dry-run --batch-size 50 large-dataset.json"
    echo ""
    echo "Input Format Examples:"
    echo ""
    echo "JSON Format:"
    echo '  {'
    echo '    "concepts": ['
    echo '      {'
    echo '        "id": "graphene-material",'
    echo '        "type": "MaterialNode",'
    echo '        "label": "Graphene",'
    echo '        "description": "Single-layer carbon atoms in hexagonal lattice",'
    echo '        "category": "materials",'
    echo '        "properties": {'
    echo '          "conductivity": 1000000,'
    echo '          "youngModulus": 1000'
    echo '        }'
    echo '      }'
    echo '    ],'
    echo '    "relationships": ['
    echo '      {'
    echo '        "source": "graphene-material",'
    echo '        "target": "electronic-devices",'
    echo '        "type": "applied-in",'
    echo '        "weight": 0.8'
    echo '      }'
    echo '    ]'
    echo '  }'
}

# Parse command line arguments
BATCH_SIZE=100
VALIDATE=false
DRY_RUN=false
FORMAT="$DEFAULT_FORMAT"
URL="$API_BASE_URL"
INPUT_FILE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--format)
            FORMAT="$2"
            shift 2
            ;;
        -u|--url)
            URL="$2"
            shift 2
            ;;
        -b|--batch-size)
            BATCH_SIZE="$2"
            shift 2
            ;;
        -v|--validate)
            VALIDATE=true
            shift
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
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
            if [ -z "$INPUT_FILE" ]; then
                INPUT_FILE="$1"
            else
                log_error "Multiple input files specified"
                print_usage
                exit 1
            fi
            shift
            ;;
    esac
done

if [ -z "$INPUT_FILE" ]; then
    log_error "Input file is required"
    print_usage
    exit 1
fi

if [ ! -f "$INPUT_FILE" ]; then
    log_error "Input file not found: $INPUT_FILE"
    exit 1
fi

check_dependencies() {
    # Check if jq is available for JSON processing
    if ! command -v jq &> /dev/null; then
        log_error "jq is required for JSON processing"
        log_info "Install with: sudo apt install jq (Ubuntu) or brew install jq (macOS)"
        exit 1
    fi
    
    # Check if curl is available
    if ! command -v curl &> /dev/null; then
        log_error "curl is required for API calls"
        exit 1
    fi
}

test_api_connection() {
    log_info "Testing API connection..."
    
    if curl -s --fail "$URL/health/" >/dev/null 2>&1; then
        log_success "API connection successful"
    else
        if [ "$DRY_RUN" = true ]; then
            log_warning "API not available - continuing in dry-run mode"
            return 0
        else
            log_error "Cannot connect to API at $URL"
            log_info "Make sure the backend is running: cd resnei && python manage.py runserver"
            log_info "Or use --dry-run flag to preview import structure"
            exit 1
        fi
    fi
}

validate_json_schema() {
    local file="$1"
    
    log_info "Validating JSON schema..."
    
    # Check if file is valid JSON
    if ! jq empty "$file" 2>/dev/null; then
        log_error "Invalid JSON format"
        return 1
    fi
    
    # Check required fields
    if ! jq -e '.concepts' "$file" >/dev/null; then
        log_error "Missing 'concepts' array in JSON"
        return 1
    fi
    
    # Validate concept structure
    local invalid_concepts=$(jq -r '.concepts[] | select(.id == null or .type == null or .label == null) | .id // "unknown"' "$file")
    if [ -n "$invalid_concepts" ]; then
        log_error "Invalid concept structure found. Required fields: id, type, label"
        echo "Invalid concepts: $invalid_concepts"
        return 1
    fi
    
    log_success "JSON schema validation passed"
    return 0
}

convert_csv_to_json() {
    local csv_file="$1"
    local json_file="/tmp/converted_concepts.json"
    
    log_info "Converting CSV to JSON..."
    
    # Simple CSV to JSON conversion (requires header row)
    python3 << EOF
import csv
import json
import sys

concepts = []
relationships = []

try:
    with open('$csv_file', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            concept = {
                'id': row.get('id', ''),
                'type': row.get('type', 'MaterialNode'),
                'label': row.get('label', ''),
                'description': row.get('description', ''),
                'category': row.get('category', 'materials'),
                'properties': {}
            }
            
            # Add any additional columns as properties
            for key, value in row.items():
                if key not in ['id', 'type', 'label', 'description', 'category']:
                    if value:
                        try:
                            concept['properties'][key] = float(value)
                        except ValueError:
                            concept['properties'][key] = value
            
            concepts.append(concept)
    
    data = {
        'concepts': concepts,
        'relationships': relationships
    }
    
    with open('$json_file', 'w') as f:
        json.dump(data, f, indent=2)
    
    print("Conversion successful")
    
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
EOF

    if [ $? -eq 0 ]; then
        echo "$json_file"
    else
        log_error "CSV conversion failed"
        exit 1
    fi
}

import_concepts() {
    local data_file="$1"
    
    # Convert CSV if needed
    if [ "$FORMAT" = "csv" ]; then
        data_file=$(convert_csv_to_json "$INPUT_FILE")
    fi
    
    # Validate if requested
    if [ "$VALIDATE" = true ]; then
        if ! validate_json_schema "$data_file"; then
            exit 1
        fi
    fi
    
    # Get concept count
    local concept_count=$(jq '.concepts | length' "$data_file")
    local relationship_count=$(jq '.relationships | length' "$data_file")
    
    log_info "Found $concept_count concepts and $relationship_count relationships"
    
    if [ "$DRY_RUN" = true ]; then
        log_info "DRY RUN - Would import:"
        jq -r '.concepts[] | "  - \(.type): \(.label) (\(.id))"' "$data_file" | head -10
        if [ "$concept_count" -gt 10 ]; then
            echo "  ... and $(($concept_count - 10)) more concepts"
        fi
        
        if [ "$relationship_count" -gt 0 ]; then
            echo ""
            log_info "Relationships:"
            jq -r '.relationships[] | "  - \(.source) --[\(.type)]--> \(.target)"' "$data_file" | head -5
            if [ "$relationship_count" -gt 5 ]; then
                echo "  ... and $(($relationship_count - 5)) more relationships"
            fi
        fi
        return 0
    fi
    
    # Import concepts in batches
    log_info "Importing concepts in batches of $BATCH_SIZE..."
    
    local imported_concepts=0
    local imported_relationships=0
    local batch_num=0
    
    # Process concepts
    while [ $imported_concepts -lt $concept_count ]; do
        batch_num=$((batch_num + 1))
        local start=$imported_concepts
        local end=$((start + BATCH_SIZE))
        
        if [ $end -gt $concept_count ]; then
            end=$concept_count
        fi
        
        local batch_size=$((end - start))
        log_info "Importing concept batch $batch_num: concepts $((start + 1))-$end"
        
        # Extract batch
        local batch_data=$(jq ".concepts[$start:$end]" "$data_file")
        
        # Import batch
        local response=$(curl -s -X POST "$URL/graph/nodes/batch" \
            -H "Content-Type: application/json" \
            -d "{\"nodes\": $batch_data}")
        
        if echo "$response" | jq -e '.success' >/dev/null 2>&1; then
            local created_count=$(echo "$response" | jq '.data.created | length')
            log_success "Batch $batch_num: imported $created_count concepts"
            imported_concepts=$end
        else
            local error_msg=$(echo "$response" | jq -r '.error.message // "Unknown error"')
            log_error "Batch $batch_num failed: $error_msg"
            exit 1
        fi
        
        # Small delay between batches
        sleep 0.5
    done
    
    # Import relationships if any
    if [ "$relationship_count" -gt 0 ]; then
        log_info "Importing relationships..."
        
        local relationships=$(jq '.relationships' "$data_file")
        local response=$(curl -s -X POST "$URL/graph/relationships/batch" \
            -H "Content-Type: application/json" \
            -d "{\"relationships\": $relationships}")
        
        if echo "$response" | jq -e '.success' >/dev/null 2>&1; then
            imported_relationships=$(echo "$response" | jq '.data.created | length')
            log_success "Imported $imported_relationships relationships"
        else
            local error_msg=$(echo "$response" | jq -r '.error.message // "Unknown error"')
            log_warning "Relationship import failed: $error_msg"
        fi
    fi
    
    log_success "Import completed!"
    log_info "Summary:"
    echo "  - Concepts imported: $imported_concepts"
    echo "  - Relationships imported: $imported_relationships"
}

main() {
    log_info "Starting concept import process..."
    log_info "Input file: $INPUT_FILE"
    log_info "Format: $FORMAT"
    log_info "API URL: $URL"
    
    check_dependencies
    test_api_connection
    import_concepts "$INPUT_FILE"
    
    log_success "Concept import process completed!"
}

# Run main function
main "$@" 