#!/bin/bash

# Export Graph Script for Research Discovery Engine
# This script exports knowledge graph data in various formats

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
DEFAULT_OUTPUT="graph-export"

print_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Export knowledge graph data from the Research Discovery Engine"
    echo ""
    echo "Options:"
    echo "  -f, --format FORMAT        Export format (json|csv|graphml|gexf|cytoscape) [default: json]"
    echo "  -o, --output FILE          Output file name [default: graph-export]"
    echo "  -u, --url URL             API base URL [default: $API_BASE_URL]"
    echo "  -c, --categories CATS     Comma-separated list of categories to export"
    echo "  -n, --nodes-only          Export only nodes (no relationships)"
    echo "  -r, --relationships-only  Export only relationships (no nodes)"
    echo "  -l, --limit NUMBER        Limit number of nodes to export"
    echo "  -m, --metadata            Include metadata in export"
    echo "  -z, --compress            Compress output file"
    echo "  -h, --help                Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --format json --output my-graph.json"
    echo "  $0 --format csv --categories materials,mechanisms"
    echo "  $0 --format graphml --compress --output network.graphml"
    echo "  $0 --nodes-only --categories materials"
    echo ""
    echo "Supported Formats:"
    echo "  json      - JSON format with nodes and relationships"
    echo "  csv       - Two CSV files: nodes.csv and relationships.csv"
    echo "  graphml   - GraphML format for network analysis tools"
    echo "  gexf      - GEXF format for Gephi"
    echo "  cytoscape - Cytoscape.js format"
}

# Parse command line arguments
FORMAT="$DEFAULT_FORMAT"
OUTPUT="$DEFAULT_OUTPUT"
URL="$API_BASE_URL"
CATEGORIES=""
NODES_ONLY=false
RELATIONSHIPS_ONLY=false
LIMIT=""
METADATA=false
COMPRESS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--format)
            FORMAT="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT="$2"
            shift 2
            ;;
        -u|--url)
            URL="$2"
            shift 2
            ;;
        -c|--categories)
            CATEGORIES="$2"
            shift 2
            ;;
        -n|--nodes-only)
            NODES_ONLY=true
            shift
            ;;
        -r|--relationships-only)
            RELATIONSHIPS_ONLY=true
            shift
            ;;
        -l|--limit)
            LIMIT="$2"
            shift 2
            ;;
        -m|--metadata)
            METADATA=true
            shift
            ;;
        -z|--compress)
            COMPRESS=true
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
            log_error "Unexpected argument $1"
            print_usage
            exit 1
            ;;
    esac
done

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
        log_error "Cannot connect to API at $URL"
        log_info "Make sure the backend is running: cd resnei && python manage.py runserver"
        exit 1
    fi
}

build_api_query() {
    local query_params=""
    
    if [ -n "$CATEGORIES" ]; then
        query_params="${query_params}&categories=${CATEGORIES}"
    fi
    
    if [ -n "$LIMIT" ]; then
        query_params="${query_params}&limit=${LIMIT}"
    fi
    
    if [ "$METADATA" = true ]; then
        query_params="${query_params}&include_metadata=true"
    fi
    
    if [ "$NODES_ONLY" = true ]; then
        query_params="${query_params}&include_relationships=false"
    fi
    
    # Remove leading &
    query_params=${query_params#&}
    
    if [ -n "$query_params" ]; then
        echo "?${query_params}"
    fi
}

fetch_graph_data() {
    local query=$(build_api_query)
    local endpoint
    
    if [ "$RELATIONSHIPS_ONLY" = true ]; then
        endpoint="$URL/graph/relationships$query"
    else
        endpoint="$URL/graph$query"
    fi
    
    log_info "Fetching graph data from API..."
    log_info "Endpoint: $endpoint"
    
    local response=$(curl -s "$endpoint")
    
    if echo "$response" | jq -e '.success' >/dev/null 2>&1; then
        echo "$response" | jq '.data'
    else
        local error_msg=$(echo "$response" | jq -r '.error.message // "Unknown error"')
        log_error "API request failed: $error_msg"
        exit 1
    fi
}

export_json() {
    local data="$1"
    local output_file="${OUTPUT}.json"
    
    log_info "Exporting to JSON format..."
    
    echo "$data" | jq '.' > "$output_file"
    
    local node_count=$(echo "$data" | jq '.nodes | length // 0')
    local rel_count=$(echo "$data" | jq '.links | length // 0')
    
    log_success "JSON export completed: $output_file"
    log_info "Exported $node_count nodes and $rel_count relationships"
}

export_csv() {
    local data="$1"
    local nodes_file="${OUTPUT}_nodes.csv"
    local rels_file="${OUTPUT}_relationships.csv"
    
    log_info "Exporting to CSV format..."
    
    # Export nodes
    if echo "$data" | jq -e '.nodes' >/dev/null; then
        echo "$data" | jq -r '
            .nodes // [] |
            (["id", "type", "label", "description", "category"] + 
             (map(.properties | keys) | add | unique // [])) as $headers |
            $headers,
            (.[] | 
             [.id, .type, .label, .description, .category] + 
             ($headers[5:] as $props | $props | map(. as $key | (.properties[$key] // ""))))
            | @csv
        ' > "$nodes_file"
        
        local node_count=$(echo "$data" | jq '.nodes | length // 0')
        log_success "Nodes exported: $nodes_file ($node_count nodes)"
    fi
    
    # Export relationships
    if echo "$data" | jq -e '.links' >/dev/null; then
        echo "$data" | jq -r '
            .links // [] |
            ["source", "target", "type", "weight", "properties"],
            (.[] | [.source, .target, .type, .weight, (.properties | tostring)])
            | @csv
        ' > "$rels_file"
        
        local rel_count=$(echo "$data" | jq '.links | length // 0')
        log_success "Relationships exported: $rels_file ($rel_count relationships)"
    fi
}

export_graphml() {
    local data="$1"
    local output_file="${OUTPUT}.graphml"
    
    log_info "Exporting to GraphML format..."
    
    python3 << EOF
import json
import sys
import xml.etree.ElementTree as ET

try:
    data = json.loads('''$data''')
    
    # Create GraphML structure
    graphml = ET.Element("graphml")
    graphml.set("xmlns", "http://graphml.graphdrawing.org/xmlns")
    graphml.set("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
    graphml.set("xsi:schemaLocation", "http://graphml.graphdrawing.org/xmlns http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd")
    
    # Define attributes
    attr_id = ET.SubElement(graphml, "key")
    attr_id.set("id", "id")
    attr_id.set("for", "node")
    attr_id.set("attr.name", "id")
    attr_id.set("attr.type", "string")
    
    attr_label = ET.SubElement(graphml, "key")
    attr_label.set("id", "label")
    attr_label.set("for", "node")
    attr_label.set("attr.name", "label")
    attr_label.set("attr.type", "string")
    
    attr_type = ET.SubElement(graphml, "key")
    attr_type.set("id", "type")
    attr_type.set("for", "node")
    attr_type.set("attr.name", "type")
    attr_type.set("attr.type", "string")
    
    attr_weight = ET.SubElement(graphml, "key")
    attr_weight.set("id", "weight")
    attr_weight.set("for", "edge")
    attr_weight.set("attr.name", "weight")
    attr_weight.set("attr.type", "double")
    
    # Create graph
    graph = ET.SubElement(graphml, "graph")
    graph.set("id", "knowledge_graph")
    graph.set("edgedefault", "directed")
    
    # Add nodes
    for node in data.get("nodes", []):
        node_elem = ET.SubElement(graph, "node")
        node_elem.set("id", node["id"])
        
        # Add node attributes
        for attr_name, attr_value in [("id", node["id"]), ("label", node.get("label", "")), ("type", node.get("type", ""))]:
            data_elem = ET.SubElement(node_elem, "data")
            data_elem.set("key", attr_name)
            data_elem.text = str(attr_value)
    
    # Add edges
    edge_id = 0
    for link in data.get("links", []):
        edge_elem = ET.SubElement(graph, "edge")
        edge_elem.set("id", f"e{edge_id}")
        edge_elem.set("source", link["source"])
        edge_elem.set("target", link["target"])
        
        # Add weight
        weight_elem = ET.SubElement(edge_elem, "data")
        weight_elem.set("key", "weight")
        weight_elem.text = str(link.get("weight", 1.0))
        
        edge_id += 1
    
    # Write to file
    tree = ET.ElementTree(graphml)
    tree.write("$output_file", encoding="utf-8", xml_declaration=True)
    
    print("GraphML export successful")
    
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
EOF

    if [ $? -eq 0 ]; then
        log_success "GraphML export completed: $output_file"
    else
        log_error "GraphML export failed"
        exit 1
    fi
}

export_gexf() {
    local data="$1"
    local output_file="${OUTPUT}.gexf"
    
    log_info "Exporting to GEXF format..."
    
    python3 << EOF
import json
import sys
import xml.etree.ElementTree as ET
from datetime import datetime

try:
    data = json.loads('''$data''')
    
    # Create GEXF structure
    gexf = ET.Element("gexf")
    gexf.set("xmlns", "http://www.gexf.net/1.2draft")
    gexf.set("version", "1.2")
    
    # Metadata
    meta = ET.SubElement(gexf, "meta")
    meta.set("lastmodifieddate", datetime.now().strftime("%Y-%m-%d"))
    
    creator = ET.SubElement(meta, "creator")
    creator.text = "Research Discovery Engine"
    
    description = ET.SubElement(meta, "description")
    description.text = "Knowledge graph export"
    
    # Graph
    graph = ET.SubElement(gexf, "graph")
    graph.set("mode", "static")
    graph.set("defaultedgetype", "directed")
    
    # Attributes
    attributes = ET.SubElement(graph, "attributes")
    attributes.set("class", "node")
    
    attr_type = ET.SubElement(attributes, "attribute")
    attr_type.set("id", "0")
    attr_type.set("title", "type")
    attr_type.set("type", "string")
    
    attr_category = ET.SubElement(attributes, "attribute")
    attr_category.set("id", "1")
    attr_category.set("title", "category")
    attr_category.set("type", "string")
    
    # Nodes
    nodes = ET.SubElement(graph, "nodes")
    for node in data.get("nodes", []):
        node_elem = ET.SubElement(nodes, "node")
        node_elem.set("id", node["id"])
        node_elem.set("label", node.get("label", ""))
        
        # Attributes values
        attvalues = ET.SubElement(node_elem, "attvalues")
        
        type_val = ET.SubElement(attvalues, "attvalue")
        type_val.set("for", "0")
        type_val.set("value", node.get("type", ""))
        
        cat_val = ET.SubElement(attvalues, "attvalue")
        cat_val.set("for", "1")
        cat_val.set("value", node.get("category", ""))
    
    # Edges
    edges = ET.SubElement(graph, "edges")
    edge_id = 0
    for link in data.get("links", []):
        edge_elem = ET.SubElement(edges, "edge")
        edge_elem.set("id", str(edge_id))
        edge_elem.set("source", link["source"])
        edge_elem.set("target", link["target"])
        edge_elem.set("weight", str(link.get("weight", 1.0)))
        edge_id += 1
    
    # Write to file
    tree = ET.ElementTree(gexf)
    tree.write("$output_file", encoding="utf-8", xml_declaration=True)
    
    print("GEXF export successful")
    
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
EOF

    if [ $? -eq 0 ]; then
        log_success "GEXF export completed: $output_file"
    else
        log_error "GEXF export failed"
        exit 1
    fi
}

export_cytoscape() {
    local data="$1"
    local output_file="${OUTPUT}_cytoscape.json"
    
    log_info "Exporting to Cytoscape.js format..."
    
    echo "$data" | jq '{
        elements: {
            nodes: [
                .nodes[]? | {
                    data: {
                        id: .id,
                        label: .label,
                        type: .type,
                        category: .category
                    }
                }
            ],
            edges: [
                .links[]? | {
                    data: {
                        id: "\(.source)_\(.target)",
                        source: .source,
                        target: .target,
                        type: .type,
                        weight: .weight
                    }
                }
            ]
        }
    }' > "$output_file"
    
    log_success "Cytoscape.js export completed: $output_file"
}

compress_file() {
    local file="$1"
    
    if [ -f "$file" ]; then
        log_info "Compressing $file..."
        gzip "$file"
        log_success "Compressed: ${file}.gz"
    fi
}

main() {
    log_info "Starting graph export process..."
    log_info "Format: $FORMAT"
    log_info "Output: $OUTPUT"
    log_info "API URL: $URL"
    
    if [ -n "$CATEGORIES" ]; then
        log_info "Categories: $CATEGORIES"
    fi
    
    check_dependencies
    test_api_connection
    
    # Fetch data
    local graph_data=$(fetch_graph_data)
    
    # Export based on format
    case "$FORMAT" in
        json)
            export_json "$graph_data"
            if [ "$COMPRESS" = true ]; then
                compress_file "${OUTPUT}.json"
            fi
            ;;
        csv)
            export_csv "$graph_data"
            if [ "$COMPRESS" = true ]; then
                compress_file "${OUTPUT}_nodes.csv"
                compress_file "${OUTPUT}_relationships.csv"
            fi
            ;;
        graphml)
            export_graphml "$graph_data"
            if [ "$COMPRESS" = true ]; then
                compress_file "${OUTPUT}.graphml"
            fi
            ;;
        gexf)
            export_gexf "$graph_data"
            if [ "$COMPRESS" = true ]; then
                compress_file "${OUTPUT}.gexf"
            fi
            ;;
        cytoscape)
            export_cytoscape "$graph_data"
            if [ "$COMPRESS" = true ]; then
                compress_file "${OUTPUT}_cytoscape.json"
            fi
            ;;
        *)
            log_error "Unsupported format: $FORMAT"
            log_info "Supported formats: json, csv, graphml, gexf, cytoscape"
            exit 1
            ;;
    esac
    
    log_success "Graph export process completed!"
}

# Run main function
main "$@" 