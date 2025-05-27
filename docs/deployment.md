# Deployment Guide

This guide covers deploying the Research Discovery Engine in various environments, from local development to production cloud deployments.

## Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Environment Configuration](#environment-configuration)
3. [Local Development](#local-development)
4. [Production Deployment](#production-deployment)
5. [Cloud Platforms](#cloud-platforms)
6. [Docker Deployment](#docker-deployment)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Troubleshooting](#troubleshooting)

## Deployment Overview

### Architecture Components

The Research Discovery Engine consists of three main deployable components:

```
┌─────────────────────────────────────────────────┐
│                Load Balancer                    │
├─────────────────────────────────────────────────┤
│  Frontend Applications                          │
│  ├── Discovery Engine (DE/) - Port 5173/3000   │
│  └── Web Platform - Port 3000                  │
├─────────────────────────────────────────────────┤
│  Backend Services                               │
│  ├── ResNEI API - Port 8000                    │
│  ├── Knowledge Graph Service                   │
│  └── Document Processing Pipeline              │
├─────────────────────────────────────────────────┤
│  Data Layer                                     │
│  ├── PostgreSQL Database                       │
│  ├── Redis Cache                               │
│  └── File Storage (S3/Local)                   │
└─────────────────────────────────────────────────┘
```

### Deployment Strategies

#### 1. Monolithic Deployment
- All components on single server
- Suitable for: Development, small teams, proof of concept
- Resource requirements: 4GB RAM, 2 CPU cores, 50GB storage

#### 2. Microservices Deployment
- Components deployed separately
- Suitable for: Production, scaling, high availability
- Resource requirements: Varies by component and load

#### 3. Containerized Deployment
- Docker containers with orchestration
- Suitable for: Cloud deployment, DevOps automation
- Platforms: Docker Compose, Kubernetes, cloud container services

## Environment Configuration

### Environment Variables

#### Frontend (Discovery Engine)
```bash
# .env.local
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_GRAPH_WS_URL=wss://api.yourdomain.com/ws
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=your-sentry-dsn
VITE_VERSION=1.0.0
```

#### Frontend (Web Platform)
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-nextauth-secret
DATABASE_URL=postgresql://user:pass@localhost:5432/website
```

#### Backend (ResNEI)
```bash
# .env
DEBUG=False
SECRET_KEY=your-django-secret-key
DATABASE_URL=postgresql://user:pass@localhost:5432/resnei
REDIS_URL=redis://localhost:6379/0
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Storage
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_STORAGE_BUCKET_NAME=your-s3-bucket
AWS_S3_REGION_NAME=us-east-1

# Processing
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/1

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=INFO
```

### Configuration Management

#### Development Environment
```bash
# Create environment files
cp .env.example .env.local
cp backend/.env.example backend/.env

# Edit with your values
nano .env.local
nano backend/.env
```

#### Production Environment
```bash
# Use environment-specific configs
cp .env.production .env.local
cp backend/.env.production backend/.env

# Use secrets management
kubectl create secret generic app-secrets \
  --from-env-file=.env.production
```

## Local Development

### Quick Start
```bash
# Clone repository
git clone https://github.com/your-org/Research-Discovery-Engine.git
cd Research-Discovery-Engine

# Install dependencies
cd DE && npm install && cd ..
cd website_explore_the_unknown && npm install && cd ..
cd resnei && pip install -r requirements.txt && cd ..

# Start development servers
npm run dev:all
```

### Individual Component Setup

#### Discovery Engine (DE)
```bash
cd DE
npm install
cp .env.example .env.local
npm run dev  # Runs on http://localhost:5173
```

#### Web Platform
```bash
cd website_explore_the_unknown
npm install
cp .env.example .env.local
npm run dev  # Runs on http://localhost:3000
```

#### ResNEI Backend
```bash
cd resnei
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver  # Runs on http://localhost:8000
```

### Database Setup

#### PostgreSQL (Recommended)
```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt install postgresql  # Ubuntu

# Create databases
createdb resnei_dev
createdb website_dev

# Run migrations
cd resnei
python manage.py migrate

cd ../website_explore_the_unknown
npx prisma migrate dev
```

#### Redis Setup
```bash
# Install Redis
brew install redis  # macOS
sudo apt install redis-server  # Ubuntu

# Start Redis
redis-server
```

## Production Deployment

### Server Requirements

#### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 50GB SSD
- **Network**: 100 Mbps
- **OS**: Ubuntu 20.04+ or CentOS 8+

#### Recommended Requirements
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 100GB+ SSD
- **Network**: 1 Gbps
- **Load Balancer**: Nginx or HAProxy

### Server Setup

#### System Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python 3.8+
sudo apt install python3 python3-pip python3-venv

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Redis
sudo apt install redis-server

# Install Nginx
sudo apt install nginx

# Install certbot for SSL
sudo apt install certbot python3-certbot-nginx
```

#### Application Deployment

##### Frontend Deployment
```bash
# Build Discovery Engine
cd DE
npm ci --production
npm run build
sudo cp -r dist/* /var/www/discovery-engine/

# Build Web Platform
cd ../website_explore_the_unknown
npm ci --production
npm run build
sudo cp -r .next/* /var/www/website/
```

##### Backend Deployment
```bash
# Setup Python environment
cd resnei
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate

# Setup Gunicorn service
sudo cp deployment/gunicorn.service /etc/systemd/system/
sudo systemctl enable gunicorn
sudo systemctl start gunicorn
```

### Nginx Configuration

#### Main Configuration
```nginx
# /etc/nginx/sites-available/research-discovery-engine
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Main website
    location / {
        root /var/www/website;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Discovery Engine app
    location /app/ {
        alias /var/www/discovery-engine/;
        try_files $uri $uri/ /index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # File uploads
    client_max_body_size 100M;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
```

#### SSL Setup
```bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Process Management

#### Systemd Services

##### Gunicorn Service
```ini
# /etc/systemd/system/resnei.service
[Unit]
Description=ResNEI Django App
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/opt/research-discovery-engine/resnei
Environment=PATH=/opt/research-discovery-engine/resnei/venv/bin
EnvironmentFile=/opt/research-discovery-engine/resnei/.env
ExecStart=/opt/research-discovery-engine/resnei/venv/bin/gunicorn \
    --workers 3 \
    --bind 127.0.0.1:8000 \
    --timeout 120 \
    --max-requests 1000 \
    --max-requests-jitter 100 \
    resnei.wsgi:application
Restart=always

[Install]
WantedBy=multi-user.target
```

##### Celery Worker Service
```ini
# /etc/systemd/system/celery.service
[Unit]
Description=Celery Worker Service
After=network.target

[Service]
Type=forking
User=www-data
Group=www-data
EnvironmentFile=/opt/research-discovery-engine/resnei/.env
WorkingDirectory=/opt/research-discovery-engine/resnei
ExecStart=/opt/research-discovery-engine/resnei/venv/bin/celery \
    -A resnei worker \
    --loglevel=info \
    --detach \
    --pidfile=/var/run/celery/worker.pid
ExecStop=/bin/kill -s TERM $MAINPID
Restart=always

[Install]
WantedBy=multi-user.target
```

#### Service Management
```bash
# Enable and start services
sudo systemctl enable resnei celery
sudo systemctl start resnei celery

# Check status
sudo systemctl status resnei celery

# View logs
sudo journalctl -u resnei -f
sudo journalctl -u celery -f
```

## Cloud Platforms

### Vercel (Frontend)

#### Discovery Engine Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from DE directory
cd DE
vercel --prod

# Configure environment variables in Vercel dashboard
# VITE_API_BASE_URL=https://api.yourdomain.com
```

#### Vercel Configuration
```json
{
  "name": "discovery-engine",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "@api-base-url"
  }
}
```

### Railway (Backend)

#### Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway add

# Configure environment variables
railway variables set DATABASE_URL=postgresql://...
railway variables set REDIS_URL=redis://...
```

#### Railway Configuration
```toml
# railway.toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "python manage.py migrate && gunicorn resnei.wsgi:application"
healthcheckPath = "/health/"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### AWS Deployment

#### EC2 Instance Setup
```bash
# Launch EC2 instance (t3.medium or larger)
# Configure security groups (80, 443, 22, 8000)
# Connect via SSH

# Install dependencies (as shown in Server Setup)
# Deploy application (as shown in Production Deployment)
```

#### RDS Database
```bash
# Create PostgreSQL RDS instance
aws rds create-db-instance \
    --db-instance-identifier rde-postgres \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username admin \
    --master-user-password your-password \
    --allocated-storage 20
```

#### S3 Storage
```bash
# Create S3 bucket for file storage
aws s3 mb s3://rde-storage-bucket

# Configure CORS
aws s3api put-bucket-cors \
    --bucket rde-storage-bucket \
    --cors-configuration file://cors.json
```

### Google Cloud Platform

#### App Engine Deployment
```yaml
# app.yaml (for ResNEI)
runtime: python39

env_variables:
  DATABASE_URL: postgresql://user:pass@/dbname?host=/cloudsql/project:region:instance
  REDIS_URL: redis://redis-instance-ip:6379

automatic_scaling:
  min_instances: 1
  max_instances: 10
  target_cpu_utilization: 0.6
```

#### Cloud Run Deployment
```bash
# Build and deploy container
gcloud builds submit --tag gcr.io/project-id/resnei
gcloud run deploy resnei \
    --image gcr.io/project-id/resnei \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```

## Docker Deployment

### Docker Compose Setup

#### Complete Stack
```yaml
# docker-compose.yml
version: '3.8'

services:
  # Frontend - Discovery Engine
  frontend:
    build:
      context: ./DE
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      - VITE_API_BASE_URL=http://localhost:8000
    depends_on:
      - backend

  # Backend - ResNEI
  backend:
    build:
      context: ./resnei
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/resnei
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    volumes:
      - media_files:/app/media
      - static_files:/app/static

  # Database
  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=resnei
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Background worker
  worker:
    build:
      context: ./resnei
      dockerfile: Dockerfile
    command: celery -A resnei worker --loglevel=info
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/resnei
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    volumes:
      - media_files:/app/media

  # Reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  redis_data:
  media_files:
  static_files:
```

#### Individual Dockerfiles

##### Frontend Dockerfile
```dockerfile
# DE/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production image
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

##### Backend Dockerfile
```dockerfile
# resnei/Dockerfile
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Start Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "resnei.wsgi:application"]
```

### Kubernetes Deployment

#### Namespace and ConfigMap
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: research-discovery-engine

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: research-discovery-engine
data:
  DATABASE_URL: "postgresql://postgres:password@postgres:5432/resnei"
  REDIS_URL: "redis://redis:6379/0"
  DEBUG: "False"
```

#### Backend Deployment
```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: research-discovery-engine
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/resnei:latest
        ports:
        - containerPort: 8000
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"

---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: research-discovery-engine
spec:
  selector:
    app: backend
  ports:
  - port: 8000
    targetPort: 8000
  type: ClusterIP
```

#### Ingress Configuration
```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: research-discovery-engine
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - yourdomain.com
    secretName: app-tls
  rules:
  - host: yourdomain.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 8000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
```

## Monitoring and Maintenance

### Health Checks

#### Backend Health Check
```python
# resnei/health/views.py
from django.http import JsonResponse
from django.db import connection
from django.core.cache import cache

def health_check(request):
    """Basic health check endpoint."""
    health_status = {
        'status': 'healthy',
        'database': check_database(),
        'cache': check_cache(),
        'version': '1.0.0'
    }
    
    if not all([health_status['database'], health_status['cache']]):
        health_status['status'] = 'unhealthy'
        return JsonResponse(health_status, status=503)
    
    return JsonResponse(health_status)

def check_database():
    """Check database connectivity."""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        return True
    except Exception:
        return False

def check_cache():
    """Check cache connectivity."""
    try:
        cache.set('health_check', 'ok', 1)
        return cache.get('health_check') == 'ok'
    except Exception:
        return False
```

#### Frontend Health Check
```typescript
// DE/src/utils/healthCheck.ts
export const performHealthCheck = async (): Promise<HealthStatus> => {
  try {
    const response = await fetch('/api/health/');
    const data = await response.json();
    
    return {
      status: response.ok ? 'healthy' : 'unhealthy',
      details: data
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
};
```

### Logging Configuration

#### Structured Logging
```python
# resnei/settings/logging.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'json': {
            'format': '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "logger": "%(name)s", "message": "%(message)s"}',
            'datefmt': '%Y-%m-%d %H:%M:%S'
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'json',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/resnei/app.log',
            'maxBytes': 1024*1024*100,  # 100MB
            'backupCount': 5,
            'formatter': 'json',
        },
    },
    'loggers': {
        'resnei': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

### Backup and Recovery

#### Database Backup
```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
DB_NAME="resnei"

# Create backup
pg_dump $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://backup-bucket/postgres/
```

#### Media Files Backup
```bash
#!/bin/bash
# backup-media.sh

DATE=$(date +%Y%m%d_%H%M%S)
MEDIA_DIR="/opt/resnei/media"
BACKUP_DIR="/backups/media"

# Create compressed archive
tar czf $BACKUP_DIR/media_$DATE.tar.gz -C $MEDIA_DIR .

# Upload to S3
aws s3 cp $BACKUP_DIR/media_$DATE.tar.gz s3://backup-bucket/media/
```

### Performance Monitoring

#### Application Metrics
```python
# resnei/monitoring/middleware.py
import time
import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger('performance')

class PerformanceMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.start_time = time.time()
    
    def process_response(self, request, response):
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            logger.info(f"Request {request.path} took {duration:.3f}s")
        return response
```

#### Resource Monitoring
```bash
# monitor.sh - System resource monitoring
#!/bin/bash

while true; do
    echo "$(date): CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')%, Memory: $(free | grep Mem | awk '{printf("%.1f%%", $3/$2 * 100.0)}'), Disk: $(df -h / | awk 'NR==2{print $5}')"
    sleep 60
done >> /var/log/system-monitor.log
```

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Python dependencies
pip cache purge
pip install -r requirements.txt --force-reinstall
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Reset connections
sudo systemctl restart postgresql

# Check connection limits
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
```

#### Performance Issues
```bash
# Check running processes
htop

# Check disk usage
df -h
du -sh /var/log/*

# Check memory usage
free -h
```

#### SSL Certificate Issues
```bash
# Check certificate expiry
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/cert.pem -text -noout | grep "Not After"

# Renew certificates
sudo certbot renew --dry-run
sudo certbot renew
```

### Debug Mode

#### Enable Debug Logging
```python
# Temporary debug settings
DEBUG = True
LOGGING['loggers']['resnei']['level'] = 'DEBUG'

# Database query logging
LOGGING['loggers']['django.db.backends'] = {
    'level': 'DEBUG',
    'handlers': ['console'],
}
```

#### Frontend Debug Mode
```typescript
// Enable verbose logging
localStorage.setItem('debug', 'true');

// Monitor API calls
const originalFetch = window.fetch;
window.fetch = (...args) => {
  console.log('API Call:', args);
  return originalFetch(...args);
};
```

### Recovery Procedures

#### Database Recovery
```bash
# Restore from backup
gunzip backup_20231201_120000.sql.gz
psql resnei < backup_20231201_120000.sql

# Reset migrations (if needed)
python manage.py migrate --fake-initial
```

#### Service Recovery
```bash
# Restart all services
sudo systemctl restart nginx resnei celery redis postgresql

# Check service status
sudo systemctl status nginx resnei celery redis postgresql

# View error logs
sudo journalctl -u resnei --since "1 hour ago"
```

This deployment guide provides comprehensive instructions for deploying the Research Discovery Engine in various environments. For specific platform requirements or advanced configurations, consult the platform-specific documentation or contact the development team. 