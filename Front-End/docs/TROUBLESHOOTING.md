# Troubleshooting Guide - Research Discovery Engine

## Overview

This guide covers common issues and their solutions when working with the Research Discovery Engine.

## 🚀 Quick Start Issues

### 1. Python Command Not Found

**Problem**: `Command 'python' not found`

**Solutions**:
```bash
# Use python3 instead
python3 main.py

# Or create an alias (Ubuntu/Debian)
sudo apt install python-is-python3

# Or use the full path
/usr/bin/python3 main.py
```

### 2. Node.js Version Too Old

**Problem**: `Node.js v14.x is too old (required: v16.0+)`

**Solutions**:
```bash
# Update Node.js using Node Version Manager (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Or use NodeSource repository (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. npm Permission Issues

**Problem**: `EACCES: permission denied` during npm install

**Solutions**:
```bash
# Option 1: Configure npm to use different directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Option 2: Use npx for one-time operations
npx create-react-app@latest my-app

# Option 3: Fix npm permissions (not recommended for security)
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

## 🔧 Installation Issues

### 4. npm install Fails with Network Errors

**Problem**: Network timeouts or DNS resolution issues

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Use different registry
npm install --registry https://registry.npmjs.org/

# Increase timeout
npm install --timeout=60000

# Use yarn as alternative
npm install -g yarn
yarn install
```

### 5. TypeScript Compilation Errors

**Problem**: TypeScript build failures

**Solutions**:
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
rm -rf dist

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript configuration
npx tsc --noEmit

# Update TypeScript
npm update typescript
```

### 6. Vite Build Issues

**Problem**: Vite build or dev server failures

**Solutions**:
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Check for port conflicts
lsof -i :5173
kill -9 <PID>

# Use alternative port
npm run dev -- --port 3000

# Check for file watching limits (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## 🌐 Browser and Runtime Issues

### 7. Browser Won't Open Automatically

**Problem**: `Could not open browser` error

**Solutions**:
```bash
# Manually open browser
python3 main.py --no-browser
# Then open http://localhost:5173 manually

# Check default browser settings
xdg-settings get default-web-browser

# Set default browser (Ubuntu)
sudo update-alternatives --config x-www-browser
```

### 8. canberra-gtk-module Warnings (Linux)

**Problem**: Console shows GTK module warnings
```bash
Gtk-Message: Failed to load module "canberra-gtk-module"
```

**Cause**: Missing audio feedback libraries for GTK applications

**Solutions**:
```bash
# Ubuntu/Debian
sudo apt-get install libcanberra-gtk-module libcanberra-gtk3-module

# Fedora/RHEL  
sudo dnf install libcanberra-gtk2 libcanberra-gtk3

# Arch Linux
sudo pacman -S libcanberra
```

**Note**: These warnings are harmless and don't affect functionality, but installing the packages will eliminate the console clutter.

### 9. White Screen in Browser

**Problem**: Application loads but shows blank/white screen

**Solutions**:
1. **Check Browser Console** (F12 → Console):
   - Look for JavaScript errors
   - Check for CORS issues
   - Verify asset loading

2. **Clear Browser Cache**:
   ```bash
   # Hard refresh
   Ctrl+Shift+R (Chrome/Firefox)
   Cmd+Shift+R (Mac)
   ```

3. **Check Network Tab**:
   - Ensure all assets are loading (200 status)
   - Look for failed resource requests

### 10. 3D Graph Not Rendering

**Problem**: Graph visualization area is empty or shows errors

**Solutions**:
1. **Check WebGL Support**:
   - Visit `chrome://gpu/` or `about:support` (Firefox)
   - Enable hardware acceleration if disabled

2. **Update Graphics Drivers**:
   ```bash
   # Ubuntu/Debian - NVIDIA
   sudo apt update
   sudo apt install nvidia-driver-470

   # Ubuntu/Debian - AMD
   sudo apt install mesa-vulkan-drivers
   ```

3. **Fallback Options**:
   - Try different browser
   - Disable browser extensions
   - Use software rendering mode

## 📊 Performance Issues

### 11. Slow Application Loading

**Problem**: Application takes too long to load

**Solutions**:
1. **Check Bundle Size**:
   ```bash
   npm run build
   npx vite-bundle-analyzer dist
   ```

2. **Optimize Dependencies**:
   ```bash
   # Analyze bundle
   npm install --save-dev webpack-bundle-analyzer
   ```

3. **System Resources**:
   ```bash
   # Check available memory
   free -h
   
   # Check CPU usage
   top
   
   # Close unnecessary applications
   ```

### 12. Graph Performance Issues

**Problem**: 3D graph is slow or laggy with large datasets

**Solutions**:
1. **Reduce Graph Complexity**:
   - Limit number of visible nodes (< 1000 recommended)
   - Use graph filtering/clustering
   - Implement level-of-detail rendering

2. **Browser Optimization**:
   - Close other tabs
   - Disable browser extensions
   - Enable hardware acceleration

3. **System Optimization**:
   ```bash
   # Increase Node.js memory limit
   export NODE_OPTIONS="--max_old_space_size=4096"
   npm run dev
   ```

## 🔍 Development Issues

### 13. Hot Module Replacement Not Working

**Problem**: Changes not reflected immediately in browser

**Solutions**:
```bash
# Restart development server
Ctrl+C
npm run dev

# Clear cache and restart
rm -rf node_modules/.vite
npm run dev

# Check file watching limits (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 14. Import/Export Errors

**Problem**: Module import/export issues

**Solutions**:
1. **Check File Extensions**:
   ```typescript
   // Correct
   import Component from './Component';
   import Component from './Component.tsx';
   
   // Check tsconfig.json paths
   ```

2. **Verify Module Resolution**:
   ```bash
   # Check if module exists
   npm list <package-name>
   
   # Reinstall if needed
   npm uninstall <package-name>
   npm install <package-name>
   ```

### 14. ESLint/TypeScript Errors

**Problem**: Linting or type checking failures

**Solutions**:
```bash
# Fix auto-fixable issues
npm run lint -- --fix

# Check specific TypeScript errors
npx tsc --noEmit --pretty

# Update type definitions
npm update @types/react @types/react-dom
```

## 📁 File System Issues

### 15. Permission Denied Errors

**Problem**: Cannot read/write files

**Solutions**:
```bash
# Check current permissions
ls -la

# Fix directory permissions
chmod 755 <directory>
chmod 644 <file>

# Fix ownership (if needed)
sudo chown -R $USER:$USER <directory>
```

### 16. Path Not Found Errors

**Problem**: Files or directories not found

**Solutions**:
1. **Verify Current Directory**:
   ```bash
   pwd
   ls -la
   ```

2. **Check Relative Paths**:
   ```bash
   # Ensure you're in the correct directory
   cd /path/to/Research-Discovery-Engine/DE
   python3 main.py
   ```

3. **Verify Project Structure**:
   ```bash
   python3 main.py --check-only
   ```

## 🔒 Security and Network Issues

### 17. Firewall Blocking Connections

**Problem**: Cannot access development server

**Solutions**:
```bash
# Ubuntu/Debian - allow port
sudo ufw allow 5173

# CentOS/RHEL - allow port
sudo firewall-cmd --permanent --add-port=5173/tcp
sudo firewall-cmd --reload

# Check if port is in use
netstat -tulpn | grep 5173
```

### 18. CORS Errors

**Problem**: Cross-Origin Resource Sharing errors

**Solutions**:
1. **Development Server Configuration**:
   ```typescript
   // vite.config.ts
   export default defineConfig({
     server: {
       cors: true,
       proxy: {
         '/api': 'http://localhost:3001'
       }
     }
   });
   ```

2. **Browser Settings**:
   ```bash
   # Disable CORS for testing (Chrome)
   google-chrome --disable-web-security --user-data-dir="/tmp/chrome_dev"
   ```

## 🐛 Debugging Techniques

### 19. Enable Debug Mode

**Problem**: Need more verbose output for debugging

**Solutions**:
```bash
# Enable debug output
DEBUG=* npm run dev

# Node.js debugging
node --inspect npm run dev

# Browser debugging
# Open DevTools (F12)
# Check Console, Network, and Sources tabs
```

### 20. Log Analysis

**Problem**: Need to analyze application logs

**Solutions**:
1. **Browser Console**:
   - Enable verbose logging
   - Check for warnings and errors
   - Use console filters

2. **Network Tab**:
   - Monitor HTTP requests
   - Check response times
   - Verify asset loading

3. **Performance Tab**:
   - Profile application performance
   - Identify bottlenecks
   - Monitor memory usage

## 🔄 Recovery Procedures

### 21. Complete Reset

**Problem**: Multiple issues, need fresh start

**Solutions**:
```bash
# Complete cleanup and reinstall
rm -rf node_modules
rm -f package-lock.json
npm cache clean --force
npm install

# Reset git repository (if needed)
git clean -fdx
git reset --hard HEAD

# Restart with fresh install
python3 main.py --install
```

### 22. Backup and Recovery

**Problem**: Need to backup/restore project state

**Solutions**:
```bash
# Backup project (excluding node_modules)
tar --exclude='node_modules' --exclude='.git' -czf backup.tar.gz .

# Restore from backup
tar -xzf backup.tar.gz
npm install
```

## 📞 Getting Help

### 23. Where to Get Support

**Resources**:
1. **Documentation**:
   - [Development Guide](DEVELOPMENT_GUIDE.md)
   - [Component Documentation](COMPONENTS.md)
   - [API Reference](API_REFERENCE.md)

2. **System Information**:
   ```bash
   # Gather system info for support
   python3 main.py --check-only > system-info.txt
   npm run build > build-output.txt 2>&1
   ```

3. **Log Collection**:
   ```bash
   # Collect browser console logs
   # Network tab export (HAR file)
   # Terminal output
   ```

### 24. Creating Bug Reports

**Include This Information**:
- Operating system and version
- Node.js and npm versions
- Browser and version
- Steps to reproduce
- Error messages (full text)
- Screenshots if relevant
- System info from `python3 main.py --check-only`

**Example Bug Report Template**:
```markdown
## Bug Description
Brief description of the issue

## Environment
- OS: Ubuntu 22.04
- Node.js: v18.20.0
- npm: v10.8.0
- Browser: Chrome 120.0

## Steps to Reproduce
1. Run python3 main.py
2. Click on graph node
3. Error appears

## Expected Behavior
Should show node details

## Actual Behavior
Error message: "Cannot read property..."

## Additional Context
Screenshots, logs, etc.
```

---

This troubleshooting guide covers the most common issues encountered when working with the Research Discovery Engine. For additional support, refer to the other documentation files or create a detailed bug report with the information outlined above. 