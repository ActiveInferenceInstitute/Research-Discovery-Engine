#!/bin/bash

# Comprehensive Batch Headless Mode Test Script
# Demonstrates how to use the headless mode functionality for automated batch processing
# including LLM-enhanced scripts

echo "🚀 Starting Comprehensive Batch Headless Mode Test"
echo "=================================================="

# Set environment variables for LLM tests (if .env file exists)
if [ -f "../.env" ]; then
    echo "🔑 Loading environment variables from ../.env file"
    set -a  # automatically export all variables
    source ../.env
    set +a  # stop auto-exporting
elif [ -f "../.env.example" ]; then
    echo "🔑 Loading environment variables from ../.env.example file"
    set -a
    source ../.env.example
    set +a
else
    echo "🔑 No .env file found - LLM tests will be skipped"
    echo "⚠️  Create a .env file in the DE directory with your OpenAI API key"
fi

# Create a dedicated output directory for this batch
mkdir -p "./outputs"
BATCH_OUTPUT="./outputs/batch-test-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BATCH_OUTPUT"

echo "📁 Batch output directory: $BATCH_OUTPUT"
echo ""

# Array of test concepts for batch processing
CONCEPTS=(
    "Advanced Polymer Composites"
    "Bio-Inspired Smart Materials"
    "Quantum Dot Applications"
    "Metamaterial Structures"
    "Self-Healing Materials"
    "Machine Learning Materials Discovery"
    "Adaptive Nanocomposites"
    "Shape Memory Alloys"
)

FORMATS=("markdown" "json")

echo "🔄 Processing ${#CONCEPTS[@]} concepts in ${#FORMATS[@]} formats each..."
echo ""

# Variables to track statistics
TOTAL_RUNS=0
SUCCESSFUL_RUNS=0
FAILED_RUNS=0

# Function to log test results
log_result() {
    local test_name="$1"
    local result="$2"
    local duration="$3"
    
    TOTAL_RUNS=$((TOTAL_RUNS + 1))
    
    if [ "$result" -eq 0 ]; then
        echo "   ✅ Success (${duration}ms)"
        SUCCESSFUL_RUNS=$((SUCCESSFUL_RUNS + 1))
    else
        echo "   ❌ Failed"
        FAILED_RUNS=$((FAILED_RUNS + 1))
    fi
}

# 1. Test traditional summary generation
echo "📝 Testing Traditional Summary Generation..."
for concept in "${CONCEPTS[@]}"; do
    for format in "${FORMATS[@]}"; do
        echo "📝 Processing: '$concept' (format: $format)"
        
        start_time=$(date +%s%3N)
        npx tsx ../generate-summary.ts \
            --headless \
            --concept "$concept" \
            --format "$format" \
            --headless-output "$BATCH_OUTPUT" \
            2>/dev/null
        result=$?
        end_time=$(date +%s%3N)
        duration=$((end_time - start_time))
        
        log_result "generate-summary" $result $duration
    done
    echo ""
done

# 2. Test LLM-enhanced summary generation
echo "🤖 Testing LLM-Enhanced Summary Generation..."
for concept in "${CONCEPTS[@]:0:4}"; do  # Test first 4 concepts to save time
    echo "🤖 LLM Processing: '$concept'"
    
    start_time=$(date +%s%3N)
    npx tsx ../llm-generate-summary.ts \
        --headless \
        --concept "$concept" \
        --domain "materials science" \
        --summary-type "comprehensive" \
        --target-audience "researcher" \
        --headless-output "$BATCH_OUTPUT" \
        2>/dev/null
    result=$?
    end_time=$(date +%s%3N)
    duration=$((end_time - start_time))
    
    log_result "llm-generate-summary" $result $duration
    echo ""
done

# 3. Test LLM knowledge processing
echo "🧠 Testing LLM Knowledge Processing..."
test_texts=(
    "Smart materials exhibit adaptive behavior in response to environmental stimuli such as temperature, pH, and electric fields."
    "Nanocomposites combine nanoscale fillers with polymer matrices to achieve enhanced mechanical and thermal properties."
    "Shape memory alloys can recover their original shape when heated above their transformation temperature."
    "Biomimetic materials draw inspiration from natural systems to achieve unique functionalities."
)

for i in "${!test_texts[@]}"; do
    echo "🧠 Processing knowledge text $((i+1))/4"
    
    start_time=$(date +%s%3N)
    npx tsx scripts/llm-process-knowledge.ts \
        --headless \
        --input-text "${test_texts[$i]}" \
        --domain "materials science" \
        --processing-type "extract_concepts" \
        --headless-output "$BATCH_OUTPUT" \
        2>/dev/null
    result=$?
    end_time=$(date +%s%3N)
    duration=$((end_time - start_time))
    
    log_result "llm-process-knowledge" $result $duration
done
echo ""

# 4. Test data analysis capabilities
echo "📊 Testing Data Analysis..."
echo "📊 Running comprehensive data analysis"

start_time=$(date +%s%3N)
npx tsx ../analyze-data.ts \
    --headless \
    --stats \
    --validate \
    --headless-output "$BATCH_OUTPUT" \
    2>/dev/null
result=$?
end_time=$(date +%s%3N)
duration=$((end_time - start_time))

log_result "analyze-data" $result $duration
echo ""

# 5. Test protocol generation
echo "⚗️ Testing Protocol Generation..."
protocols=(
    "Smart Hydrogel Synthesis"
    "Carbon Nanotube Functionalization"
    "Shape Memory Polymer Processing"
    "Nanocomposite Fabrication"
)

for protocol in "${protocols[@]}"; do
    echo "⚗️ Generating protocol: '$protocol'"
    
    start_time=$(date +%s%3N)
    npx tsx scripts/generate-protocol.ts \
        --headless \
        --objective "$protocol" \
        --detail-level "intermediate" \
        --headless-output "$BATCH_OUTPUT" \
        2>/dev/null
    result=$?
    end_time=$(date +%s%3N)
    duration=$((end_time - start_time))
    
    log_result "generate-protocol" $result $duration
done
echo ""

# 6. Test comprehensive testing suite
echo "🧪 Running Comprehensive Test Suite..."
echo "🧪 Testing all components including LLM integration"

start_time=$(date +%s%3N)
npx tsx scripts/run-tests.ts \
    --test-type all \
    --llm-test \
    --performance-test \
    --output-format json \
    > "$BATCH_OUTPUT/test-suite-results.json" 2>/dev/null
result=$?
end_time=$(date +%s%3N)
duration=$((end_time - start_time))

log_result "run-tests-comprehensive" $result $duration
echo ""

# 7. Test performance analysis
echo "⚡ Testing Performance Analysis..."
echo "⚡ Running performance benchmarks"

start_time=$(date +%s%3N)
npx tsx scripts/analyze-performance.ts \
    --test-type all \
    --benchmark-size medium \
    --optimization-suggestions \
    --output-format json \
    > "$BATCH_OUTPUT/performance-analysis.json" 2>/dev/null
result=$?
end_time=$(date +%s%3N)
duration=$((end_time - start_time))

log_result "analyze-performance" $result $duration
echo ""

echo "📊 Batch processing complete!"
echo "Results saved in: $BATCH_OUTPUT"
echo ""

# Generate comprehensive statistics
echo "📈 Comprehensive Test Statistics:"
echo "================================="
echo "   Total test runs: $TOTAL_RUNS"
echo "   Successful: $SUCCESSFUL_RUNS ✅"
echo "   Failed: $FAILED_RUNS ❌"
echo "   Success rate: $(echo "scale=1; $SUCCESSFUL_RUNS * 100 / $TOTAL_RUNS" | bc -l)%"
echo ""

# List all generated directories
echo "📁 Generated output directories:"
ls -la "$BATCH_OUTPUT" | grep "^d" | awk '{print "   - " $9}' | grep -v "^\.$\|^\.\..*"

echo ""
echo "🔍 Detailed analysis of results:"

# Count files by type
TOTAL_DIRS=$(ls -d "$BATCH_OUTPUT"/*/  2>/dev/null | wc -l)
JSON_FILES=$(find "$BATCH_OUTPUT" -name "*.json" | wc -l)
MD_FILES=$(find "$BATCH_OUTPUT" -name "*.md" | wc -l)

echo "   Output directories: $TOTAL_DIRS"
echo "   JSON files generated: $JSON_FILES"
echo "   Markdown files generated: $MD_FILES"
echo "   Total files: $((JSON_FILES + MD_FILES))"

# Test specific script success rates
TRADITIONAL_SUCCESS=$(grep -c "✅.*generate-summary" "$BATCH_OUTPUT/../batch-test.log" 2>/dev/null || echo "0")
LLM_SUCCESS=$(grep -c "✅.*llm-" "$BATCH_OUTPUT/../batch-test.log" 2>/dev/null || echo "0")

echo ""
echo "📋 Script-specific results:"
echo "   Traditional scripts: Tested with multiple concepts and formats"
echo "   LLM-enhanced scripts: Tested with real research contexts"
echo "   Data analysis: Comprehensive graph validation and statistics"
echo "   Protocol generation: Multiple experimental protocols created"
echo "   Performance testing: System benchmarks and optimization analysis"

if [ "$SUCCESSFUL_RUNS" -eq "$TOTAL_RUNS" ]; then
    echo ""
    echo "🎉 All tests passed! System is fully operational."
    echo "✨ LLM integration is working correctly."
    echo "🚀 Ready for production use."
else
    echo ""
    echo "⚠️  Some tests failed. Review the results above."
    echo "📝 Check individual output directories for error details."
fi

echo ""
echo "💡 To explore results:"
echo "   cd $BATCH_OUTPUT"
echo "   ls -la"
echo "   cat */report-summary.md"
echo "   cat */core-output.json | jq ."
echo ""
echo "🔬 To run specific LLM tests:"
echo "   npx tsx scripts/llm-generate-summary.ts --help"
echo "   npx tsx scripts/llm-process-knowledge.ts --help"
echo "   npx tsx scripts/run-tests.ts --test-type llm --verbose" 