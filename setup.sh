#!/bin/bash

# Research Discovery Engine - Setup Script
# This script automates the installation and setup process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        REQUIRED_VERSION="18.0.0"
        
        if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
            return 0
        else
            return 1
        fi
    else
        return 1
    fi
}

# Function to check Python version
check_python_version() {
    if command_exists python3; then
        PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
        REQUIRED_VERSION="3.8.0"
        
        if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
            return 0
        else
            return 1
        fi
    else
        return 1
    fi
}

# Header
echo "=================================="
echo "Research Discovery Engine Setup"
echo "=================================="
echo ""

# Check system requirements
print_status "Checking system requirements..."

# Check operating system
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    print_status "Detected Linux system"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
    print_status "Detected macOS system"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
    print_status "Detected Windows system"
else
    print_error "Unsupported operating system: $OSTYPE"
    exit 1
fi

# Check Node.js
if check_node_version; then
    print_success "Node.js $(node --version) found"
else
    print_error "Node.js 18+ is required but not found"
    print_status "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check npm
if command_exists npm; then
    print_success "npm $(npm --version) found"
else
    print_error "npm is required but not found"
    exit 1
fi

# Check Python
if check_python_version; then
    print_success "Python $(python3 --version) found"
else
    print_error "Python 3.8+ is required but not found"
    print_status "Please install Python from https://python.org/"
    exit 1
fi

# Check pip
if command_exists pip3 || command_exists pip; then
    PIP_CMD="pip3"
    if ! command_exists pip3; then
        PIP_CMD="pip"
    fi
    print_success "pip found"
else
    print_error "pip is required but not found"
    exit 1
fi

# Check Git
if command_exists git; then
    print_success "Git $(git --version | cut -d' ' -f3) found"
else
    print_error "Git is required but not found"
    exit 1
fi

echo ""

# Setup options
echo "Setup Options:"
echo "1. Full setup (all components)"
echo "2. Discovery Engine only (frontend)"
echo "3. Discovery Engine + Web Platform"
echo "4. Backend only (ResNEI)"
echo ""

read -p "Choose setup option [1-4]: " SETUP_OPTION

case $SETUP_OPTION in
    1)
        SETUP_DE=true
        SETUP_WEB=true
        SETUP_BACKEND=true
        print_status "Setting up all components"
        ;;
    2)
        SETUP_DE=true
        SETUP_WEB=false
        SETUP_BACKEND=false
        print_status "Setting up Discovery Engine only"
        ;;
    3)
        SETUP_DE=true
        SETUP_WEB=true
        SETUP_BACKEND=false
        print_status "Setting up Discovery Engine and Web Platform"
        ;;
    4)
        SETUP_DE=false
        SETUP_WEB=false
        SETUP_BACKEND=true
        print_status "Setting up backend only"
        ;;
    *)
        print_error "Invalid option. Exiting."
        exit 1
        ;;
esac

echo ""

# Database setup for backend
if [ "$SETUP_BACKEND" = true ]; then
    echo "Database Setup (for backend):"
    echo "1. Skip database setup"
    echo "2. PostgreSQL (recommended)"
    echo "3. SQLite (development only)"
    echo ""
    
    read -p "Choose database option [1-3]: " DB_OPTION
    
    case $DB_OPTION in
        1)
            USE_DB="none"
            print_status "Skipping database setup"
            ;;
        2)
            USE_DB="postgresql"
            print_status "Will setup PostgreSQL"
            ;;
        3)
            USE_DB="sqlite"
            print_status "Will use SQLite"
            ;;
        *)
            print_error "Invalid option. Using SQLite."
            USE_DB="sqlite"
            ;;
    esac
fi

echo ""
print_status "Starting installation..."

# Setup Discovery Engine
if [ "$SETUP_DE" = true ]; then
    print_status "Setting up Discovery Engine..."
    
    cd DE
    
    # Install dependencies
    print_status "Installing npm dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Discovery Engine dependencies installed"
    else
        print_error "Failed to install Discovery Engine dependencies"
        exit 1
    fi
    
    # Create environment file if it doesn't exist
    if [ ! -f ".env.local" ]; then
        print_status "Creating environment configuration..."
        cat > .env.local << EOF
# Discovery Engine Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_GRAPH_WS_URL=ws://localhost:8000/ws
VITE_ENABLE_ANALYTICS=false
VITE_VERSION=1.0.0
EOF
        print_success "Environment configuration created"
    fi
    
    cd ..
fi

# Setup Web Platform
if [ "$SETUP_WEB" = true ]; then
    print_status "Setting up Web Platform..."
    
    cd website_explore_the_unknown
    
    # Install dependencies
    print_status "Installing npm dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Web Platform dependencies installed"
    else
        print_error "Failed to install Web Platform dependencies"
        exit 1
    fi
    
    # Create environment file if it doesn't exist
    if [ ! -f ".env.local" ]; then
        print_status "Creating environment configuration..."
        cat > .env.local << EOF
# Web Platform Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-in-production
DATABASE_URL=postgresql://postgres:password@localhost:5432/website
EOF
        print_success "Environment configuration created"
    fi
    
    cd ..
fi

# Setup Backend
if [ "$SETUP_BACKEND" = true ]; then
    print_status "Setting up ResNEI Backend..."
    
    cd resnei
    
    # Create virtual environment
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Upgrade pip
    print_status "Upgrading pip..."
    pip install --upgrade pip
    
    # Install dependencies
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt
    
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    
    # Create environment file if it doesn't exist
    if [ ! -f ".env" ]; then
        print_status "Creating environment configuration..."
        
        if [ "$USE_DB" = "postgresql" ]; then
            DATABASE_URL="postgresql://postgres:password@localhost:5432/resnei"
        else
            DATABASE_URL="sqlite:///db.sqlite3"
        fi
        
        cat > .env << EOF
# ResNEI Backend Configuration
DEBUG=True
SECRET_KEY=your-secret-key-change-in-production
DATABASE_URL=$DATABASE_URL
REDIS_URL=redis://localhost:6379/0
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Celery Configuration
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/1

# Logging
LOG_LEVEL=INFO

# Optional: Add your API keys here
# OPENAI_API_KEY=your-openai-key
# ANTHROPIC_API_KEY=your-anthropic-key
EOF
        print_success "Backend environment configuration created"
    fi
    
    # Database setup
    if [ "$USE_DB" = "postgresql" ]; then
        print_status "Setting up PostgreSQL database..."
        
        # Check if PostgreSQL is installed
        if command_exists psql; then
            # Create database if it doesn't exist
            createdb resnei 2>/dev/null || print_warning "Database 'resnei' may already exist"
            print_success "PostgreSQL database setup complete"
        else
            print_warning "PostgreSQL not found. Please install and configure PostgreSQL manually."
            print_status "Install instructions:"
            if [ "$OS" = "linux" ]; then
                print_status "  Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
                print_status "  CentOS/RHEL: sudo yum install postgresql postgresql-server"
            elif [ "$OS" = "macos" ]; then
                print_status "  macOS: brew install postgresql"
            fi
        fi
    fi
    
    # Run migrations
    print_status "Running database migrations..."
    python manage.py migrate
    
    if [ $? -eq 0 ]; then
        print_success "Database migrations completed"
    else
        print_warning "Database migrations failed. You may need to configure the database manually."
    fi
    
    # Create superuser (optional)
    read -p "Create admin superuser? [y/N]: " CREATE_SUPERUSER
    if [[ $CREATE_SUPERUSER =~ ^[Yy]$ ]]; then
        print_status "Creating superuser..."
        python manage.py createsuperuser
    fi
    
    deactivate
    cd ..
fi

echo ""
print_success "Setup completed successfully!"

echo ""
echo "=================================="
echo "Getting Started"
echo "=================================="

if [ "$SETUP_DE" = true ]; then
    echo ""
    print_status "To start the Discovery Engine:"
    echo "  cd DE"
    echo "  npm run dev"
    echo "  # Access at http://localhost:5173"
fi

if [ "$SETUP_WEB" = true ]; then
    echo ""
    print_status "To start the Web Platform:"
    echo "  cd website_explore_the_unknown"
    echo "  npm run dev"
    echo "  # Access at http://localhost:3000"
fi

if [ "$SETUP_BACKEND" = true ]; then
    echo ""
    print_status "To start the ResNEI Backend:"
    echo "  cd resnei"
    echo "  source venv/bin/activate"
    echo "  python manage.py runserver"
    echo "  # Access at http://localhost:8000"
    
    if [ "$USE_DB" = "postgresql" ] && ! command_exists psql; then
        echo ""
        print_warning "Remember to install and configure PostgreSQL:"
        print_status "  1. Install PostgreSQL"
        print_status "  2. Create database: createdb resnei"
        print_status "  3. Update DATABASE_URL in resnei/.env"
    fi
    
    if ! command_exists redis-server; then
        echo ""
        print_warning "Consider installing Redis for background tasks:"
        if [ "$OS" = "linux" ]; then
            print_status "  Ubuntu/Debian: sudo apt install redis-server"
        elif [ "$OS" = "macos" ]; then
            print_status "  macOS: brew install redis"
        fi
        print_status "  Start with: redis-server"
    fi
fi

echo ""
print_status "Documentation:"
echo "  - Getting Started: docs/getting-started.md"
echo "  - User Guide: docs/user-guide.md"
echo "  - Developer Guide: docs/developer-guide.md"
echo "  - API Reference: docs/api-reference.md"

echo ""
print_status "Need help? Check the troubleshooting section in docs/getting-started.md"

echo ""
print_success "Welcome to the Research Discovery Engine!" 