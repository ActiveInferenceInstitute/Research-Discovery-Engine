#!/bin/bash

# Deployment Script for Research Discovery Engine
# This script handles deployment to various environments

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
DEFAULT_ENVIRONMENT="production"
DEFAULT_PLATFORM="vercel"

print_usage() {
    echo "Usage: $0 [OPTIONS] [ENVIRONMENT]"
    echo ""
    echo "Deploy Research Discovery Engine to various platforms"
    echo ""
    echo "Arguments:"
    echo "  ENVIRONMENT    Target environment (development|staging|production) [default: production]"
    echo ""
    echo "Options:"
    echo "  -p, --platform PLATFORM   Deployment platform (vercel|railway|aws|gcp|docker) [default: vercel]"
    echo "  -c, --component COMP      Deploy specific component (de|backend|web|all) [default: all]"
    echo "  -d, --domain DOMAIN       Custom domain for deployment"
    echo "  -b, --build-only          Only build, don't deploy"
    echo "  -v, --verify              Verify deployment after completion"
    echo "  -f, --force               Force deployment even if checks fail"
    echo "  -h, --help                Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 production                           # Deploy all to production on Vercel"
    echo "  $0 --platform railway staging          # Deploy to Railway staging"
    echo "  $0 --component de --domain my.domain   # Deploy only DE with custom domain"
    echo "  $0 --build-only development            # Build for development without deploying"
    echo ""
    echo "Supported Platforms:"
    echo "  vercel   - Vercel (recommended for frontend)"
    echo "  railway  - Railway (full-stack deployment)"
    echo "  aws      - AWS (EC2 + RDS + S3)"
    echo "  gcp      - Google Cloud Platform"
    echo "  docker   - Docker containers"
}

# Parse command line arguments
ENVIRONMENT="$DEFAULT_ENVIRONMENT"
PLATFORM="$DEFAULT_PLATFORM"
COMPONENT="all"
CUSTOM_DOMAIN=""
BUILD_ONLY=false
VERIFY=false
FORCE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--platform)
            PLATFORM="$2"
            shift 2
            ;;
        -c|--component)
            COMPONENT="$2"
            shift 2
            ;;
        -d|--domain)
            CUSTOM_DOMAIN="$2"
            shift 2
            ;;
        -b|--build-only)
            BUILD_ONLY=true
            shift
            ;;
        -v|--verify)
            VERIFY=true
            shift
            ;;
        -f|--force)
            FORCE=true
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
            ENVIRONMENT="$1"
            shift
            ;;
    esac
done

check_prerequisites() {
    log_info "Checking deployment prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is required for deployment"
        exit 1
    fi
    log_success "Node.js found"
    
    # Check platform-specific tools
    case "$PLATFORM" in
        vercel)
            if ! command -v vercel &> /dev/null; then
                log_error "Vercel CLI is required. Install with: npm i -g vercel"
                exit 1
            fi
            log_success "Vercel CLI found"
            ;;
        railway)
            if ! command -v railway &> /dev/null; then
                log_error "Railway CLI is required. Install from: https://railway.app/cli"
                exit 1
            fi
            log_success "Railway CLI found"
            ;;
        aws)
            if ! command -v aws &> /dev/null; then
                log_error "AWS CLI is required. Install from: https://aws.amazon.com/cli/"
                exit 1
            fi
            log_success "AWS CLI found"
            ;;
        docker)
            if ! command -v docker &> /dev/null; then
                log_error "Docker is required"
                exit 1
            fi
            log_success "Docker found"
            ;;
    esac
    
    # Check Git status
    if ! git diff-index --quiet HEAD --; then
        if [ "$FORCE" = false ]; then
            log_error "Working directory has uncommitted changes"
            log_info "Use --force to deploy anyway or commit your changes"
            exit 1
        else
            log_warning "Deploying with uncommitted changes"
        fi
    fi
    
    log_success "Prerequisites check passed"
}

run_tests() {
    log_info "Running tests before deployment..."
    
    if [ "$COMPONENT" = "de" ] || [ "$COMPONENT" = "all" ]; then
        cd "$PROJECT_ROOT/DE"
        if [ -f "package.json" ]; then
            log_info "Running Discovery Engine tests..."
            npm test || { log_error "DE tests failed"; exit 1; }
        fi
    fi
    
    if [ "$COMPONENT" = "backend" ] || [ "$COMPONENT" = "all" ]; then
        cd "$PROJECT_ROOT/resnei"
        if [ -f "manage.py" ] && [ -d "venv" ]; then
            log_info "Running backend tests..."
            source venv/bin/activate
            python manage.py test || { log_error "Backend tests failed"; exit 1; }
            deactivate
        fi
    fi
    
    cd "$PROJECT_ROOT"
    log_success "All tests passed"
}

build_components() {
    log_info "Building components for $ENVIRONMENT environment..."
    
    # Build Discovery Engine
    if [ "$COMPONENT" = "de" ] || [ "$COMPONENT" = "all" ]; then
        log_info "Building Discovery Engine..."
        cd "$PROJECT_ROOT/DE"
        
        # Set environment variables
        export NODE_ENV="$ENVIRONMENT"
        
        case "$ENVIRONMENT" in
            development)
                export VITE_API_BASE_URL="http://localhost:8000/api/v1"
                ;;
            staging)
                export VITE_API_BASE_URL="https://staging-api.discovery-engine.com/api/v1"
                ;;
            production)
                export VITE_API_BASE_URL="https://api.discovery-engine.com/api/v1"
                ;;
        esac
        
        npm install
        npm run build
        
        log_success "Discovery Engine built successfully"
    fi
    
    # Build Web Platform
    if [ "$COMPONENT" = "web" ] || [ "$COMPONENT" = "all" ]; then
        if [ -d "$PROJECT_ROOT/website_explore_the_unknown" ]; then
            log_info "Building Web Platform..."
            cd "$PROJECT_ROOT/website_explore_the_unknown"
            
            export NODE_ENV="$ENVIRONMENT"
            
            npm install
            npm run build
            
            log_success "Web Platform built successfully"
        fi
    fi
    
    # Prepare Backend
    if [ "$COMPONENT" = "backend" ] || [ "$COMPONENT" = "all" ]; then
        if [ -d "$PROJECT_ROOT/resnei" ]; then
            log_info "Preparing backend..."
            cd "$PROJECT_ROOT/resnei"
            
            if [ -d "venv" ]; then
                source venv/bin/activate
                pip install -r requirements.txt
                python manage.py collectstatic --noinput
                deactivate
            fi
            
            log_success "Backend prepared successfully"
        fi
    fi
    
    cd "$PROJECT_ROOT"
}

deploy_to_vercel() {
    log_info "Deploying to Vercel..."
    
    if [ "$COMPONENT" = "de" ] || [ "$COMPONENT" = "all" ]; then
        cd "$PROJECT_ROOT/DE"
        
        # Create vercel.json if it doesn't exist
        if [ ! -f "vercel.json" ]; then
            cat > vercel.json << EOF
{
  "name": "research-discovery-engine",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "$ENVIRONMENT"
  }
}
EOF
        fi
        
        # Deploy
        if [ "$ENVIRONMENT" = "production" ]; then
            vercel --prod
        else
            vercel
        fi
        
        # Set custom domain if provided
        if [ -n "$CUSTOM_DOMAIN" ]; then
            vercel domains add "$CUSTOM_DOMAIN"
        fi
    fi
    
    if [ "$COMPONENT" = "web" ] || [ "$COMPONENT" = "all" ]; then
        if [ -d "$PROJECT_ROOT/website_explore_the_unknown" ]; then
            cd "$PROJECT_ROOT/website_explore_the_unknown"
            
            if [ "$ENVIRONMENT" = "production" ]; then
                vercel --prod
            else
                vercel
            fi
        fi
    fi
}

deploy_to_railway() {
    log_info "Deploying to Railway..."
    
    cd "$PROJECT_ROOT"
    
    # Create railway.json if it doesn't exist
    if [ ! -f "railway.json" ]; then
        cat > railway.json << EOF
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:all",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  },
  "environment": {
    "NODE_ENV": "$ENVIRONMENT"
  }
}
EOF
    fi
    
    railway login
    
    if [ "$ENVIRONMENT" = "production" ]; then
        railway deploy --environment production
    else
        railway deploy --environment staging
    fi
}

deploy_to_aws() {
    log_info "Deploying to AWS..."
    
    # This is a simplified AWS deployment
    # In practice, you'd use CloudFormation, Terraform, or CDK
    
    AWS_REGION="${AWS_REGION:-us-west-2}"
    S3_BUCKET="discovery-engine-$ENVIRONMENT-$(date +%s)"
    
    # Upload frontend to S3
    if [ "$COMPONENT" = "de" ] || [ "$COMPONENT" = "all" ]; then
        log_info "Uploading frontend to S3..."
        aws s3 mb "s3://$S3_BUCKET" --region "$AWS_REGION"
        aws s3 sync "$PROJECT_ROOT/DE/dist" "s3://$S3_BUCKET" --delete
        
        # Configure S3 for static hosting
        aws s3 website "s3://$S3_BUCKET" \
            --index-document index.html \
            --error-document index.html
        
        log_success "Frontend deployed to S3: http://$S3_BUCKET.s3-website-$AWS_REGION.amazonaws.com"
    fi
    
    # Deploy backend to EC2 (simplified)
    if [ "$COMPONENT" = "backend" ] || [ "$COMPONENT" = "all" ]; then
        log_warning "Backend deployment to EC2 requires manual setup or Infrastructure as Code tools"
        log_info "Consider using AWS App Runner, ECS, or Lambda for backend deployment"
    fi
}

deploy_docker() {
    log_info "Building and deploying with Docker..."
    
    cd "$PROJECT_ROOT"
    
    # Create docker-compose.production.yml if needed
    if [ ! -f "docker-compose.$ENVIRONMENT.yml" ]; then
        log_info "Creating Docker Compose configuration for $ENVIRONMENT..."
        
        cat > "docker-compose.$ENVIRONMENT.yml" << EOF
version: '3.8'

services:
  discovery-engine:
    build:
      context: ./DE
      dockerfile: Dockerfile
      args:
        - NODE_ENV=$ENVIRONMENT
    ports:
      - "80:80"
    environment:
      - NODE_ENV=$ENVIRONMENT
    restart: unless-stopped

  backend:
    build:
      context: ./resnei
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DJANGO_SETTINGS_MODULE=config.settings.$ENVIRONMENT
    restart: unless-stopped
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=discovery_engine
      - POSTGRES_USER=de_user
      - POSTGRES_PASSWORD=secure_password_change_me
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  postgres_data:
EOF
    fi
    
    # Build and start services
    docker-compose -f "docker-compose.$ENVIRONMENT.yml" build
    
    if [ "$BUILD_ONLY" = false ]; then
        docker-compose -f "docker-compose.$ENVIRONMENT.yml" up -d
        log_success "Docker deployment completed"
    else
        log_success "Docker build completed"
    fi
}

verify_deployment() {
    if [ "$VERIFY" = false ]; then
        return
    fi
    
    log_info "Verifying deployment..."
    
    # Add verification logic based on platform and component
    case "$PLATFORM" in
        vercel)
            if [ "$COMPONENT" = "de" ] || [ "$COMPONENT" = "all" ]; then
                # Get Vercel deployment URL
                local url=$(vercel ls | grep "discovery-engine" | head -1 | awk '{print $2}')
                if [ -n "$url" ]; then
                    log_info "Checking deployment at: $url"
                    if curl -f "$url" >/dev/null 2>&1; then
                        log_success "Deployment verification successful"
                    else
                        log_error "Deployment verification failed"
                    fi
                fi
            fi
            ;;
        docker)
            log_info "Checking Docker containers..."
            if docker-compose -f "docker-compose.$ENVIRONMENT.yml" ps | grep -q "Up"; then
                log_success "Docker containers are running"
            else
                log_error "Some Docker containers are not running"
            fi
            ;;
    esac
}

cleanup() {
    log_info "Cleaning up temporary files..."
    
    # Remove temporary build artifacts if needed
    find "$PROJECT_ROOT" -name "*.tmp" -type f -delete 2>/dev/null || true
    
    log_success "Cleanup completed"
}

main() {
    log_info "Starting deployment process..."
    log_info "Environment: $ENVIRONMENT"
    log_info "Platform: $PLATFORM"
    log_info "Component: $COMPONENT"
    
    if [ "$BUILD_ONLY" = true ]; then
        log_info "Build-only mode enabled"
    fi
    
    check_prerequisites
    
    if [ "$FORCE" = false ]; then
        run_tests
    else
        log_warning "Skipping tests due to --force flag"
    fi
    
    build_components
    
    if [ "$BUILD_ONLY" = false ]; then
        case "$PLATFORM" in
            vercel)
                deploy_to_vercel
                ;;
            railway)
                deploy_to_railway
                ;;
            aws)
                deploy_to_aws
                ;;
            gcp)
                log_error "GCP deployment not implemented yet"
                exit 1
                ;;
            docker)
                deploy_docker
                ;;
            *)
                log_error "Unsupported platform: $PLATFORM"
                exit 1
                ;;
        esac
        
        verify_deployment
    fi
    
    cleanup
    
    log_success "Deployment process completed!"
    
    if [ "$BUILD_ONLY" = false ]; then
        echo ""
        log_info "Deployment Summary:"
        echo "  Environment: $ENVIRONMENT"
        echo "  Platform: $PLATFORM"
        echo "  Component: $COMPONENT"
        
        if [ -n "$CUSTOM_DOMAIN" ]; then
            echo "  Domain: $CUSTOM_DOMAIN"
        fi
        
        echo ""
        log_info "Next steps:"
        echo "  - Monitor deployment health"
        echo "  - Update DNS records if using custom domain"
        echo "  - Run integration tests against deployed environment"
        echo "  - Update environment variables if needed"
    fi
}

# Trap to ensure cleanup on exit
trap cleanup EXIT

# Run main function
main "$@" 