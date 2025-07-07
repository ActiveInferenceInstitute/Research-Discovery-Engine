# Deployment Guide - Research Discovery Engine

## Overview

This guide covers deployment strategies for the Research Discovery Engine, from development to production environments.

## 🏗️ Build Process

### Development Build
```bash
# Navigate to application directory
cd DE

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
# Type checking
npm run type-check

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 🚀 Deployment Options

### 1. Static Site Deployment

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
cd DE
vercel

# For production deployment
vercel --prod
```

**Configuration** - Create `vercel.json`:
```json
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
    "NODE_ENV": "production"
  }
}
```

#### Netlify
```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables (optional)
NODE_ENV=production
```

**Configuration** - Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_ENV = "production"
```

#### GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts
"deploy": "gh-pages -d dist"

# Build and deploy
npm run build
npm run deploy
```

### 2. Container Deployment

#### Docker
Create `Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

**Build and run**:
```bash
# Build Docker image
docker build -t research-discovery-engine .

# Run container
docker run -p 8080:80 research-discovery-engine
```

#### Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  # Optional: Add reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - web
    restart: unless-stopped
```

### 3. Cloud Platform Deployment

#### AWS S3 + CloudFront
```bash
# Build the application
npm run build

# Sync to S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

#### Google Cloud Platform
```bash
# Build the application
npm run build

# Deploy to Google Cloud Storage
gsutil -m rsync -r -d dist/ gs://your-bucket-name

# Set up load balancer and CDN
gcloud compute backend-buckets create research-discovery-backend --gcs-bucket-name=your-bucket-name
```

## 🔧 Environment Configuration

### Environment Variables
Create environment-specific `.env` files:

**.env.development**:
```bash
VITE_APP_ENV=development
VITE_API_URL=http://localhost:3001
VITE_DEBUG_MODE=true
VITE_GRAPH_DEBUG=true
```

**.env.production**:
```bash
VITE_APP_ENV=production
VITE_API_URL=https://api.yourdomain.com
VITE_DEBUG_MODE=false
VITE_GRAPH_DEBUG=false
VITE_ANALYTICS_ID=your-analytics-id
```

### Build Configuration
Update `vite.config.ts` for production optimizations:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          graph: ['3d-force-graph', 'three'],
          utils: ['lodash', 'd3']
        }
      }
    },
    sourcemap: false, // Disable in production
    minify: 'esbuild',
    target: 'es2015'
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
})
```

## 📊 Performance Optimization

### Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true
    })
  ]
})

# Build and analyze
npm run build
```

### Optimization Checklist
- ✅ Enable gzip/brotli compression
- ✅ Configure proper caching headers
- ✅ Optimize images and assets
- ✅ Code splitting for large libraries
- ✅ Remove unused dependencies
- ✅ Minify CSS and JavaScript
- ✅ Use CDN for static assets

## 🔒 Security Configuration

### Security Headers
Configure security headers in your deployment:

```nginx
# Nginx example
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;" always;
```

### HTTPS Configuration
Always use HTTPS in production:

```bash
# Let's Encrypt with Certbot
sudo certbot --nginx -d yourdomain.com

# Or manual certificate configuration
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    # ... rest of configuration
}
```

## 📈 Monitoring and Analytics

### Application Monitoring
Integrate monitoring services:

```typescript
// src/utils/monitoring.ts
export const initMonitoring = () => {
  if (import.meta.env.PROD) {
    // Initialize error tracking
    // Initialize performance monitoring
    // Initialize user analytics
  }
}
```

### Health Checks
Create health check endpoints:

```nginx
# Nginx health check
location /health {
    access_log off;
    return 200 "healthy\n";
    add_header Content-Type text/plain;
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: 'DE/package-lock.json'
    
    - name: Install dependencies
      working-directory: ./DE
      run: npm ci
    
    - name: Type check
      working-directory: ./DE
      run: npm run type-check
    
    - name: Lint
      working-directory: ./DE
      run: npm run lint
    
    - name: Build
      working-directory: ./DE
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        working-directory: ./DE
        vercel-args: '--prod'
```

## 🎯 Production Checklist

### Pre-Deployment
- [ ] Run type checking (`npm run type-check`)
- [ ] Run linting (`npm run lint`)
- [ ] Test production build (`npm run build && npm run preview`)
- [ ] Verify all environment variables
- [ ] Check bundle size and performance
- [ ] Validate all external links and resources

### Post-Deployment
- [ ] Verify application loads correctly
- [ ] Test core functionality (graph visualization, search, etc.)
- [ ] Check performance metrics
- [ ] Verify error tracking is working
- [ ] Test on different devices and browsers
- [ ] Monitor for any console errors

### Maintenance
- [ ] Regular dependency updates
- [ ] Security scanning
- [ ] Performance monitoring
- [ ] Backup strategies
- [ ] Disaster recovery procedures

## 🚨 Troubleshooting

### Common Issues

**Build Failures**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version compatibility
node --version  # Should be 16+
```

**Memory Issues**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max_old_space_size=4096"
npm run build
```

**Large Bundle Size**:
```bash
# Analyze bundle
npm run build
npx vite-bundle-analyzer dist
```

### Performance Issues
- Check for large assets in `dist/assets/`
- Verify code splitting is working correctly
- Monitor network requests in browser DevTools
- Use lighthouse for performance auditing

---

This deployment guide covers all major deployment scenarios and best practices for the Research Discovery Engine. Choose the deployment method that best fits your infrastructure and requirements. 