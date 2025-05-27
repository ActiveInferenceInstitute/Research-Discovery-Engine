#!/bin/bash

# Quick Setup Script for Research Discovery Engine
# This script automates the setup process for the Discovery Engine

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
BACKEND_PATH="$PROJECT_ROOT/resnei"
WEB_PATH="$PROJECT_ROOT/website_explore_the_unknown"

print_header() {
    echo "=================================================="
    echo "  Research Discovery Engine - Quick Setup"
    echo "=================================================="
    echo ""
}

check_prerequisites() {
    log_info "Checking system prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is required but not installed"
        log_info "Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    if [ "$(printf '%s\n' "18.0.0" "$NODE_VERSION" | sort -V | head -n1)" != "18.0.0" ]; then
        log_error "Node.js 18+ is required (found: $NODE_VERSION)"
        exit 1
    fi
    log_success "Node.js $NODE_VERSION found"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is required but not installed"
        exit 1
    fi
    log_success "npm $(npm --version) found"
    
    # Check Python (optional)
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
        log_success "Python $PYTHON_VERSION found"
    else
        log_warning "Python3 not found - backend features will be unavailable"
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        log_error "Git is required but not installed"
        exit 1
    fi
    log_success "Git found"
}

setup_discovery_engine() {
    log_info "Setting up Discovery Engine..."
    
    if [ ! -d "$DE_PATH" ]; then
        log_error "Discovery Engine directory not found: $DE_PATH"
        exit 1
    fi
    
    cd "$DE_PATH"
    
    # Install dependencies
    log_info "Installing npm dependencies..."
    npm install
    
    # Create environment configuration
    if [ ! -f ".env.local" ]; then
        log_info "Creating environment configuration..."
        cat > .env.local << EOF
# Discovery Engine Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_GRAPH_WS_URL=ws://localhost:8000/ws
VITE_ENABLE_ANALYTICS=false
VITE_VERSION=1.0.0
VITE_DEBUG=true
EOF
        log_success "Environment configuration created"
    else
        log_info "Environment configuration already exists"
    fi
    
    # Build to check for errors
    log_info "Testing build process..."
    npm run build
    
    log_success "Discovery Engine setup completed"
}

setup_backend() {
    if [ ! -d "$BACKEND_PATH" ]; then
        log_warning "Backend directory not found - skipping backend setup"
        return
    fi
    
    if ! command -v python3 &> /dev/null; then
        log_warning "Python3 not found - skipping backend setup"
        return
    fi
    
    # Ask user if they want to install backend (it takes a long time)
    log_info "Backend setup includes heavy dependencies (PyTorch, ML libraries)."
    log_info "This can take 5-10 minutes and requires ~2GB of disk space."
    
    if [ -t 0 ]; then  # Only ask if running interactively
        read -p "Do you want to install the backend now? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Skipping backend setup. You can run it later with: cd resnei && pip install -r requirements.txt"
            return
        fi
    else
        log_info "Non-interactive mode: skipping backend setup to avoid hanging"
        log_info "To install backend later: cd resnei && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
        return
    fi
    
    log_info "Setting up ResNEI Backend..."
    
    cd "$BACKEND_PATH"
    
    # Create virtual environment
    if [ ! -d "venv" ]; then
        log_info "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install dependencies with timeout
    log_info "Installing Python dependencies (this may take several minutes)..."
    pip install --upgrade pip
    
    # Install with timeout to prevent hanging
    timeout 600s pip install -r requirements.txt || {
        log_warning "Backend installation timed out or failed"
        log_info "You can complete it manually later with:"
        log_info "  cd resnei && source venv/bin/activate && pip install -r requirements.txt"
        deactivate
        return
    }
    
    # Create environment configuration
    if [ ! -f ".env" ]; then
        log_info "Creating backend environment configuration..."
        cat > .env << EOF
# ResNEI Backend Configuration
DEBUG=True
SECRET_KEY=dev-secret-key-change-in-production
DATABASE_URL=sqlite:///db.sqlite3
REDIS_URL=redis://localhost:6379/0
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Celery Configuration (optional)
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/1

# Logging
LOG_LEVEL=INFO
EOF
        log_success "Backend environment configuration created"
    fi
    
    # Run migrations if Django is available
    if python -c "import django" 2>/dev/null; then
        log_info "Running database migrations..."
        python manage.py migrate
    else
        log_warning "Django not available - skipping migrations"
    fi
    
    deactivate
    log_success "Backend setup completed"
}

setup_web_platform() {
    if [ ! -d "$WEB_PATH" ]; then
        log_warning "Web platform directory not found - skipping web platform setup"
        return
    fi
    
    log_info "Setting up Web Platform..."
    
    cd "$WEB_PATH"
    
    # Install dependencies
    log_info "Installing npm dependencies..."
    npm install
    
    # Create environment configuration
    if [ ! -f ".env.local" ]; then
        log_info "Creating web platform environment configuration..."
        cat > .env.local << EOF
# Web Platform Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-nextauth-secret-change-in-production
DATABASE_URL=sqlite:///website.db
EOF
        log_success "Web platform environment configuration created"
    fi
    
    log_success "Web platform setup completed"
}

create_start_scripts() {
    log_info "Creating start scripts..."
    
    # Discovery Engine start script
    cat > "$PROJECT_ROOT/src/scripts/setup/start-de.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/../../../DE"
echo "Starting Discovery Engine on http://localhost:5173"
npm run dev
EOF
    chmod +x "$PROJECT_ROOT/src/scripts/setup/start-de.sh"
    
    # Backend start script
    cat > "$PROJECT_ROOT/src/scripts/setup/start-backend.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/../../../resnei"
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "Starting ResNEI Backend on http://localhost:8000"
    python manage.py runserver
else
    echo "Backend not configured. Run quick-setup.sh first."
fi
EOF
    chmod +x "$PROJECT_ROOT/src/scripts/setup/start-backend.sh"
    
    # All services start script
    cat > "$PROJECT_ROOT/src/scripts/setup/start-all.sh" << 'EOF'
#!/bin/bash
echo "Starting all Research Discovery Engine services..."

# Function to kill background processes on exit
cleanup() {
    echo "Stopping all services..."
    jobs -p | xargs -r kill
    exit
}
trap cleanup SIGINT SIGTERM

# Start backend in background
if [ -d "$(dirname "$0")/../../../resnei/venv" ]; then
    echo "Starting backend..."
    ./start-backend.sh &
    BACKEND_PID=$!
    sleep 5
fi

# Start Discovery Engine
echo "Starting Discovery Engine..."
./start-de.sh &
DE_PID=$!

echo "Services started!"
echo "- Discovery Engine: http://localhost:5173"
if [ ! -z "$BACKEND_PID" ]; then
    echo "- Backend API: http://localhost:8000"
fi
echo "Press Ctrl+C to stop all services"

# Wait for all background processes
wait
EOF
    chmod +x "$PROJECT_ROOT/src/scripts/setup/start-all.sh"
    
    log_success "Start scripts created"
}

print_completion_message() {
    echo ""
    log_success "Setup completed successfully!"
    echo ""
    echo "=================================================="
    echo "  Next Steps"
    echo "=================================================="
    echo ""
    log_info "To start the Discovery Engine:"
    echo "  cd DE && npm run dev"
    echo "  # Access at http://localhost:5173"
    echo ""
    
    if [ -d "$BACKEND_PATH/venv" ]; then
        log_info "To start the backend:"
        echo "  cd resnei && source venv/bin/activate && python manage.py runserver"
        echo "  # Access at http://localhost:8000"
        echo ""
    fi
    
    log_info "Or use the convenience scripts:"
    echo "  ./src/scripts/setup/start-de.sh          # Start Discovery Engine only"
    echo "  ./src/scripts/setup/start-backend.sh     # Start backend only"
    echo "  ./src/scripts/setup/start-all.sh         # Start all services"
    echo ""
    log_info "Documentation:"
    echo "  docs/getting-started.md  - Detailed setup guide"
    echo "  docs/user-guide.md       - How to use the platform"
    echo "  src/docs/               - Modular documentation"
    echo ""
    log_info "Examples:"
    echo "  src/examples/           - Code examples and integrations"
    echo ""
}

main() {
    print_header
    check_prerequisites
    
    cd "$PROJECT_ROOT"
    
    setup_discovery_engine
    setup_backend
    setup_web_platform
    create_start_scripts
    
    print_completion_message
}

# Run main function
main "$@" 