# Troubleshooting Guide

This guide helps you resolve common issues when setting up and using the Research Discovery Engine.

## 🚀 Quick Diagnostics

### First, Try the Automated Setup
Most issues can be resolved by running the automated setup:

```bash
# Run automated setup and launch
python3 src/scripts/main.py --categories setup --launch

# If that fails, try dry-run to see what would happen
python3 src/scripts/main.py --categories setup --dry-run
```

### Check System Status
```bash
# Verify Node.js version (should be 18+)
node --version

# Verify npm is available
npm --version

# Check Python version (should be 3.8+)
python3 --version

# Check if Discovery Engine is running
curl -s http://localhost:5173 > /dev/null && echo "✅ DE is running" || echo "❌ DE not accessible"
```

## 🔧 Installation Issues

### Node.js Version Problems

**Problem**: `Error: Node.js version not supported`

**Solution**:
```bash
# Check current version
node --version

# If version is less than 18, update Node.js
# Visit https://nodejs.org/ to download latest version

# Or use nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### Python Version Issues

**Problem**: `python3: command not found` or version too old

**Solution**:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip

# macOS with Homebrew
brew install python3

# Windows: Download from https://python.org
```

### Permission Errors

**Problem**: `EACCES: permission denied`

**Solution**:
```bash
# Fix npm permissions
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Or use sudo (not recommended)
sudo npm install
```

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE :::5173`

**Solution**:
```bash
# Find what's using port 5173
lsof -i :5173

# Kill the process (replace PID with actual process ID)
kill [PID]

# Or use a different port
cd DE && npm run dev -- --port 3000
```

## 🌐 Web Interface Issues

### Blank or Loading Screen

**Problem**: Discovery Engine loads but shows blank screen or endless loading

**Diagnosis**:
```bash
# Check browser console for errors (F12 → Console)
# Look for JavaScript errors or network failures

# Check if development server is actually running
curl -I http://localhost:5173
```

**Solutions**:
```bash
# 1. Clear browser cache and cookies
# Chrome: Settings → Privacy → Clear browsing data

# 2. Try different browser (Chrome, Firefox, Safari)

# 3. Restart development server
cd DE
npm run dev

# 4. Rebuild the application
npm run build
npm run preview

# 5. Check for JavaScript errors in browser console
# Right-click → Inspect → Console tab
```

### 3D Visualization Not Loading

**Problem**: Interface loads but 3D graph doesn't appear

**Solutions**:
```bash
# 1. Check WebGL support
# Visit: https://get.webgl.org/

# 2. Update graphics drivers

# 3. Try disabling browser extensions

# 4. Lower graphics settings in browser
# Chrome: Settings → Advanced → System → Use hardware acceleration
```

### Slow Performance

**Problem**: Interface is slow or unresponsive

**Solutions**:
```bash
# 1. Reduce graph complexity in settings
# 2. Close other browser tabs
# 3. Restart browser
# 4. Check system resources (RAM, CPU)

# For development, use faster build mode
cd DE
npm run dev -- --mode development
```

## 🔄 Script Orchestrator Issues

### Script Execution Failures

**Problem**: `python3 src/scripts/main.py` fails with errors

**Diagnosis**:
```bash
# Run with verbose output
python3 src/scripts/main.py --categories setup --dry-run

# Check execution logs
ls -la src/orchestrator-results/
cat src/orchestrator-results/execution-report-*.json
```

**Common Solutions**:
```bash
# 1. Missing dependencies
pip install -r resnei/requirements.txt

# 2. File permissions
chmod +x src/scripts/setup/*.sh
chmod +x src/scripts/data/*.sh

# 3. Path issues - run from project root
cd Research-Discovery-Engine
python3 src/scripts/main.py --categories setup
```

### Individual Script Failures

**Problem**: Specific scripts fail during orchestration

**Solutions by Script**:

#### fast-setup.sh fails
```bash
# Common issue: Node.js not found
which node || echo "Node.js not installed"

# Manual run to see specific error
./src/scripts/setup/fast-setup.sh
```

#### verify-de-ready.sh fails
```bash
# Usually indicates dependency issues
cd DE && npm install

# Check if all files are present
ls -la DE/src/components/
```

#### import-concepts.sh fails
```bash
# Backend API may not be running
curl -s http://localhost:8000/api/v1/health/ || echo "Backend not running"

# Try with dry-run mode
./src/scripts/data/import-concepts.sh --dry-run DE/KG/materials.md
```

### Permission Denied Errors

**Problem**: `Permission denied` when running scripts

**Solution**:
```bash
# Make scripts executable
find src/scripts -name "*.sh" -exec chmod +x {} \;

# Or individually
chmod +x src/scripts/setup/fast-setup.sh
chmod +x src/scripts/setup/verify-de-ready.sh
```

## 🔍 Common Error Messages

### "Command not found" Errors

**Error**: `npm: command not found`
```bash
# Install Node.js and npm
# Visit https://nodejs.org/ for installation
```

**Error**: `python3: command not found`
```bash
# Install Python 3
# Ubuntu: sudo apt install python3
# macOS: brew install python3
# Windows: Download from python.org
```

### npm Installation Errors

**Error**: `npm ERR! code ENOENT`
```bash
# Delete node_modules and package-lock.json
cd DE
rm -rf node_modules package-lock.json
npm install
```

**Error**: `npm ERR! peer dep missing`
```bash
# Install peer dependencies
npm install --legacy-peer-deps
```

**Error**: `ERESOLVE unable to resolve dependency tree`
```bash
# Force resolution
npm install --force

# Or use legacy resolver
npm install --legacy-peer-deps
```

### Network and Connectivity Issues

**Error**: `Request failed with status code 404`
```bash
# Check if backend is running
curl http://localhost:8000/api/v1/health/

# Start backend if needed
cd resnei
python manage.py runserver
```

**Error**: `Network Error` or `ERR_CONNECTION_REFUSED`
```bash
# Check if service is running on expected port
netstat -tlnp | grep :5173
netstat -tlnp | grep :8000

# Restart services
cd DE && npm run dev
cd resnei && python manage.py runserver
```

## 🗂️ File and Path Issues

### Missing Files or Directories

**Problem**: `Error: Cannot find module` or `No such file or directory`

**Solution**:
```bash
# Verify project structure
ls -la DE/src/components/
ls -la src/scripts/

# Re-clone repository if files are missing
git status
git pull origin main
```

### Incorrect Working Directory

**Problem**: Scripts fail because of wrong directory

**Solution**:
```bash
# Always run scripts from project root
cd Research-Discovery-Engine
pwd  # Should show path ending in Research-Discovery-Engine

# Then run scripts
python3 src/scripts/main.py --categories setup
```

## 💾 Data and Storage Issues

### Database Connection Issues

**Problem**: Database errors when using ResNEI backend

**Solution**:
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Create database if missing
createdb resnei_dev

# Run migrations
cd resnei
python manage.py migrate
```

### Disk Space Issues

**Problem**: `ENOSPC: no space left on device`

**Solution**:
```bash
# Check disk space
df -h

# Clean npm cache
npm cache clean --force

# Remove node_modules to free space
find . -name "node_modules" -type d -exec rm -rf {} +
```

## 🔧 Performance Issues

### Slow Startup

**Problem**: Discovery Engine takes long time to start

**Solutions**:
```bash
# 1. Use development mode for faster builds
cd DE && npm run dev

# 2. Clear npm cache
npm cache clean --force

# 3. Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# 4. Use faster package manager
npm install -g yarn
yarn install
yarn dev
```

### High Memory Usage

**Problem**: Browser or Node.js using too much memory

**Solutions**:
```bash
# 1. Restart browser and Node.js processes
# 2. Close unnecessary browser tabs
# 3. Reduce graph complexity in settings
# 4. Use production build for lower memory usage
cd DE && npm run build && npm run preview
```

## 🌐 Browser-Specific Issues

### Chrome Issues
```bash
# Clear cache: Settings → Privacy → Clear browsing data
# Disable extensions: Settings → Extensions
# Reset to defaults: Settings → Advanced → Reset
```

### Firefox Issues
```bash
# Clear cache: Settings → Privacy → Clear Data
# Disable add-ons: Add-ons Manager → Extensions
# Refresh Firefox: Help → Refresh Firefox
```

### Safari Issues
```bash
# Clear cache: Safari → Preferences → Privacy → Manage Website Data
# Enable developer features: Safari → Preferences → Advanced → Show Develop menu
```

## 🚨 Emergency Recovery

### Complete Reset

If everything fails, try a complete reset:

```bash
# 1. Save any important data
cp DE/KG/* /backup/location/

# 2. Clean everything
rm -rf node_modules
rm -rf DE/node_modules
rm -rf website_explore_the_unknown/node_modules
rm -rf resnei/venv

# 3. Fresh start
git stash  # Save local changes
git pull origin main

# 4. Run automated setup
python3 src/scripts/main.py --categories setup --launch
```

### Fresh Installation

For complete fresh start:

```bash
# 1. Clone to new directory
cd ~/
git clone https://github.com/your-username/Research-Discovery-Engine.git RDE-fresh
cd RDE-fresh

# 2. Run setup
python3 src/scripts/main.py --categories setup --launch
```

## 📞 Getting Additional Help

### Gather Debug Information

Before seeking help, gather this information:

```bash
# System information
echo "OS: $(uname -a)"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Python: $(python3 --version)"

# Project status
cd Research-Discovery-Engine
git status
git log --oneline -5

# Error logs
ls -la src/orchestrator-results/
tail -20 src/orchestrator-results/execution-report-*.json
```

### Community Support

1. **GitHub Issues**: Create an issue with debug information
2. **Discussions**: Ask questions in GitHub Discussions
3. **Documentation**: Check all guides in `docs/` directory

### Contact Information

- **Technical Support**: tech-support@research-discovery-engine.org
- **Bug Reports**: Create GitHub issue with debug information
- **General Questions**: info@research-discovery-engine.org

## 📋 Preventive Measures

### Regular Maintenance

```bash
# Keep dependencies updated
cd DE && npm update
cd resnei && pip install -r requirements.txt --upgrade

# Clean caches periodically
npm cache clean --force
pip cache purge

# Update Documentation
git pull origin main
```

### Best Practices

1. **Always run from project root directory**
2. **Use automated setup when possible**
3. **Keep Node.js and Python updated**
4. **Check browser console for errors**
5. **Save execution logs for debugging**
6. **Test in multiple browsers if issues occur**

---

**Still having issues?** Create a GitHub issue with your debug information and we'll help you get up and running! 