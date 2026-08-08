#!/bin/bash

# LLM Integration Batch Test Script
# Tests all LLM methods with real OpenAI API calls
# Includes proper environment setup and timeout handling

echo "🤖 Starting LLM Integration Batch Test"
echo "======================================"

# Load environment variables from .env file
if [ -f "../.env" ]; then
    echo "🔑 Loading environment variables from ../.env file"
    set -a  # automatically export all variables
    source ../.env
    set +a  # stop auto-exporting
    echo "✅ Environment variables loaded successfully"
elif [ -f "../.env.example" ]; then
    echo "🔑 Loading environment variables from ../.env.example file"
    set -a
    source ../.env.example
    set +a
    echo "⚠️  Using example environment - replace with actual API key"
else
    echo "❌ No .env file found in parent directory"
    echo "Create a .env file in the DE directory with your OpenAI API key"
    exit 1
fi

# Verify API key is loaded
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ OPENAI_API_KEY not found in environment variables"
    echo "Please add OPENAI_API_KEY to your .env file"
    exit 1
else
    echo "🔑 API Key loaded: ${OPENAI_API_KEY:0:20}..."
fi

# Set environment variables explicitly
export OPENAI_MODEL="gpt-4o-mini"
export OPENAI_MAX_TOKENS="2000"
export OPENAI_TEMPERATURE="0.7"

# Create batch output directory
mkdir -p "./outputs"
BATCH_OUTPUT="./outputs/llm-batch-test-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BATCH_OUTPUT"
echo "📁 Batch output directory: $BATCH_OUTPUT"

# Test timeout (in seconds)
TIMEOUT_DURATION=120

# Statistics tracking
TOTAL_TESTS=0
SUCCESSFUL_TESTS=0
FAILED_TESTS=0

# Function to run test with timeout and logging
run_test_with_timeout() {
    local test_name="$1"
    local command="$2"
    
    echo ""
    echo "🧪 Testing: $test_name"
    echo "⏱️  Timeout: ${TIMEOUT_DURATION}s"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    start_time=$(date +%s%3N)
    
    # Run command with timeout
    timeout ${TIMEOUT_DURATION}s bash -c "$command"
    result=$?
    
    end_time=$(date +%s%3N)
    duration=$((end_time - start_time))
    
    if [ $result -eq 0 ]; then
        echo "   ✅ Success (${duration}ms)"
        SUCCESSFUL_TESTS=$((SUCCESSFUL_TESTS + 1))
    elif [ $result -eq 124 ]; then
        echo "   ⏰ Timeout after ${TIMEOUT_DURATION}s"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    else
        echo "   ❌ Failed (exit code: $result, duration: ${duration}ms)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

echo ""
echo "🔗 Step 1: Test OpenAI Connection"
run_test_with_timeout "OpenAI API Connection" "npx tsx scripts/test-openai.ts"

echo ""
echo "🧪 Step 2: Test Core LLM Test Suite"
run_test_with_timeout "Core LLM Test Suite" "npx tsx scripts/run-tests.ts --test-type llm --verbose"

echo ""
echo "📝 Step 3: Test LLM Summary Generation"
concepts=("Smart Materials" "Nanocomposites" "Shape Memory Alloys")

for concept in "${concepts[@]}"; do
    run_test_with_timeout "LLM Summary: $concept" "npx tsx scripts/llm-generate-summary.ts --concept '$concept' --verbose --headless --headless-output '$BATCH_OUTPUT'"
done

echo ""
echo "🧠 Step 4: Test LLM Knowledge Processing"
test_texts=(
    "Smart materials exhibit adaptive behavior in response to environmental stimuli."
    "Nanocomposites combine nanoscale fillers with polymer matrices for enhanced properties."
    "Shape memory alloys can recover their original shape when heated above transformation temperature."
)

for i in "${!test_texts[@]}"; do
    run_test_with_timeout "Knowledge Processing $((i+1))" "npx tsx scripts/llm-process-knowledge.ts --text '${test_texts[$i]}' --type extract_concepts --verbose --headless --headless-output '$BATCH_OUTPUT'"
done

echo ""
echo "⚡ Step 5: Test LLM Performance"
run_test_with_timeout "LLM Performance Test" "npx tsx scripts/run-tests.ts --test-type llm --performance-test --verbose"

echo ""
echo "📊 Final Results Summary"
echo "======================="
echo "Total Tests: $TOTAL_TESTS"
echo "Successful: $SUCCESSFUL_TESTS ✅"
echo "Failed: $FAILED_TESTS ❌"
echo "Success Rate: $(( (SUCCESSFUL_TESTS * 100) / TOTAL_TESTS ))%"

if [ $FAILED_TESTS -eq 0 ]; then
    echo ""
    echo "🎉 All LLM tests passed! OpenAI integration is working correctly."
else
    echo ""
    echo "⚠️  Some tests failed. Check the output above for details."
fi

echo ""
echo "📁 Output files saved to: $BATCH_OUTPUT"
echo "📋 Test completed at: $(date)"

# List generated files
echo ""
echo "📄 Generated Files:"
find "$BATCH_OUTPUT" -type f -name "*.json" -o -name "*.md" | head -10

exit $FAILED_TESTS 