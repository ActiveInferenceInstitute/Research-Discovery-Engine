#!/bin/bash

# Launch Discovery Engine Script
# This script starts the DE and opens the browser automatically

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
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
DE_PATH="$PROJECT_ROOT/DE"
DE_URL="http://localhost:5173"

print_header() {
    echo ""
    echo "🚀================================================================🚀"
    echo "  LAUNCHING DISCOVERY ENGINE WEB INTERFACE"
    echo "🚀================================================================🚀"
    echo ""
}

open_browser() {
    local url="$1"
    
    # Wait a bit for the server to start
    sleep 3
    
    # Try to open browser based on OS
    if command -v xdg-open > /dev/null 2>&1; then
        # Linux
        xdg-open "$url" > /dev/null 2>&1 &
        log_success "🌐 Browser opened: $url"
    elif command -v open > /dev/null 2>&1; then
        # macOS
        open "$url" > /dev/null 2>&1 &
        log_success "🌐 Browser opened: $url"
    elif command -v cmd > /dev/null 2>&1; then
        # Windows
        cmd /c start "$url" > /dev/null 2>&1 &
        log_success "🌐 Browser opened: $url"
    else
        log_info "🌐 Please open your browser and go to: $url"
    fi
}

check_if_running() {
    # Check if already running on port 5173
    if curl -s "http://localhost:5173" > /dev/null 2>&1; then
        log_info "🎯 Discovery Engine is already running!"
        log_success "🌐 Access at: $DE_URL"
        
        # Just open browser
        open_browser "$DE_URL"
        return 0
    fi
    return 1
}

start_de() {
    log_info "🔧 Starting Discovery Engine development server..."
    
    if [ ! -d "$DE_PATH" ]; then
        log_error "❌ Discovery Engine directory not found: $DE_PATH"
        log_info "💡 Please run setup first: python src/scripts/main.py"
        exit 1
    fi
    
    cd "$DE_PATH"
    
    # Check if dependencies are installed
    if [ ! -d "node_modules" ]; then
        log_error "❌ Dependencies not installed"
        log_info "💡 Please run setup first: python src/scripts/main.py"
        exit 1
    fi
    
    # Start the development server in background and capture PID
    log_info "🚀 Starting Vite development server..."
    npm run dev > /tmp/de-server.log 2>&1 &
    DE_PID=$!
    
    # Wait for server to start
    log_info "⏳ Waiting for server to start..."
    local attempts=0
    local max_attempts=30
    
    while [ $attempts -lt $max_attempts ]; do
        if curl -s "$DE_URL" > /dev/null 2>&1; then
            log_success "✅ Server started successfully!"
            break
        fi
        sleep 1
        attempts=$((attempts + 1))
        
        # Show progress
        if [ $((attempts % 5)) -eq 0 ]; then
            log_info "⏳ Still waiting... ($attempts/$max_attempts)"
        fi
    done
    
    if [ $attempts -eq $max_attempts ]; then
        log_error "❌ Server failed to start within timeout"
        log_info "💡 Check logs: tail -f /tmp/de-server.log"
        kill $DE_PID 2>/dev/null || true
        exit 1
    fi
    
    # Open browser
    open_browser "$DE_URL"
    
    # Show running info
    echo ""
    log_success "🎉 Discovery Engine is now running!"
    echo ""
    echo "🌐 WEB INTERFACE: $DE_URL"
    echo "📊 Server PID: $DE_PID"
    echo "📝 Logs: tail -f /tmp/de-server.log"
    echo ""
    echo "✨ FEATURES AVAILABLE:"
    echo "  🧠 Interactive 3D Knowledge Graph Visualization"
    echo "  🎨 Concept Design and AI-Assisted Discovery"
    echo "  🤖 Agent-Based Research Assistance"
    echo "  📚 Multi-Modal Knowledge Browsing"
    echo "  🔍 Real-time Graph Exploration"
    echo ""
    echo "🛑 To stop: Press Ctrl+C or kill $DE_PID"
    echo ""
    
    # Keep script running and handle cleanup
    cleanup() {
        echo ""
        log_info "🛑 Stopping Discovery Engine..."
        kill $DE_PID 2>/dev/null || true
        log_success "✅ Discovery Engine stopped"
        exit 0
    }
    
    trap cleanup SIGINT SIGTERM
    
    # Wait for the development server
    wait $DE_PID
}

main() {
    print_header
    
    # Check if already running
    if check_if_running; then
        return 0
    fi
    
    # Start the server
    start_de
}

# Run main function
main "$@" 