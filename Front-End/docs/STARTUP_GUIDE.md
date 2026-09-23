# Research Discovery Engine - Startup Guide

## Overview

This guide documents the **proven, reliable startup process** for the Research Discovery Engine. The automated `main.py` script encapsulates all best practices for consistent application startup.

## ✅ Proven Working Method

### Automated Startup (Recommended)

```bash
# Navigate to the application directory
cd Research-Discovery-Engine/DE

# Run the automated startup script
python3 main.py
```

This will automatically:
1. ✅ Check system requirements (Python, Node.js, npm, Git)
2. ✅ Verify project structure and dependencies
3. ✅ Install dependencies if needed
4. ✅ Start Vite development server with proper detection
5. ✅ Open browser to http://localhost:5173
6. ✅ Keep server running with monitoring

### Manual Startup (Alternative)

```bash
# Navigate to the application directory
cd Research-Discovery-Engine/DE

# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

The server will be available at: http://localhost:5173

## 🔧 How It Works

### Server Detection Logic

The automated script uses a **multi-layered detection approach**:

1. **Output Parsing**: Monitors Vite server output for readiness indicators:
   - `"Local: http://localhost:5173/"` 
   - `"ready in [time]"`

2. **HTTP Health Check**: Validates server responds to HTTP requests

3. **Process Monitoring**: Ensures the npm/vite process remains healthy

### Key Success Factors

- **Correct Directory**: Must run from `DE/` directory (contains package.json)
- **Output Streaming**: Real-time monitoring of server initialization
- **Generous Timeouts**: 60-second timeout for slower systems
- **Graceful Degradation**: Fallback detection methods
- **Error Reporting**: Clear feedback on any startup issues

## 🚨 Troubleshooting

### Common Issues & Solutions

#### "package.json not found"
```bash
# Ensure you're in the correct directory
pwd  # Should show: .../Research-Discovery-Engine/DE
ls package.json  # Should exist
```

#### "Port 5173 already in use"
```bash
# Kill existing server
lsof -i :5173
kill -9 [PID]

# Or use a different port
npm run dev -- --port 5174
```

#### "Dependencies missing"
```bash
# Force reinstall dependencies
python3 main.py --install
# OR manually:
rm -rf node_modules package-lock.json
npm install
```

#### "Server timeout"
```bash
# Check manual startup first
npm run dev

# If manual works but script doesn't, check system resources
htop  # Check memory/CPU usage
```

## 📋 Command Reference

### main.py Options

| Option | Description |
|--------|-------------|
| `python3 main.py` | Full automated startup (recommended) |
| `python3 main.py --check-only` | System requirements check only |
| `python3 main.py --no-browser` | Start server without opening browser |
| `python3 main.py --install` | Force dependency reinstallation |
| `python3 main.py --help` | Show all available options |

### Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm install` | Install/update dependencies |

## 🎯 System Requirements

### Verified Working Versions
- **Python**: 3.8+ (tested: 3.10, 3.12)
- **Node.js**: 16+ (tested: 18.20, 22.14)
- **npm**: 8+ (tested: 10.8, 11.2)
- **OS**: Linux, macOS, Windows
- **Browser**: Chrome, Firefox, Safari, Edge (WebGL support required)

### Hardware Recommendations
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space for dependencies
- **Network**: Internet connection for initial dependency download

## 🔄 Continuous Operations

### Running in Background
```bash
# Start server in background
nohup python3 main.py --no-browser > server.log 2>&1 &

# Monitor logs
tail -f server.log

# Stop background server
pkill -f "npm run dev"
```

### Production Deployment
```bash
# Build for production
npm run build

# Serve production build
npm run preview
```

## 📊 Performance Notes

- **Initial Startup**: 10-30 seconds (depends on system and network)
- **Hot Reload**: < 1 second for code changes
- **Memory Usage**: ~200-400MB for development server
- **Bundle Size**: Optimized chunks (main: 133KB, vendor: 1.2MB)

## 🔗 Related Documentation

- [Technical Assessment](../TECHNICAL_ASSESSMENT.md) - Comprehensive system analysis
- [Component Guide](docs/COMPONENTS.md) - Application architecture
- [API Reference](docs/API_REFERENCE.md) - Development interfaces
- [README](../README.md) - Project overview and quick start

---

## ✅ Success Verification

When everything is working correctly, you should see:

```
✅ Development server running at http://localhost:5173
✨ Setup complete! The Research Discovery Engine is now running.
📈 Monitor server output below. Press Ctrl+C to stop.
```

And the browser should display the **3D Knowledge Graph interface** with:
- Interactive 3D visualization
- Search functionality
- Agent console
- Navigation controls
- Dark/light mode toggle

**Troubleshooting Tip**: If you see a blank page, check the browser console (F12) for JavaScript errors. 