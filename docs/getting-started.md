# Getting Started with Research Discovery Engine

Welcome to the Research Discovery Engine (RDE)! This guide will help you set up the platform and take your first steps in exploring and creating knowledge through our AI-powered interface.

## Table of Contents

1. [Quick Overview](#quick-overview)
2. [System Requirements](#system-requirements)
3. [Installation Guide](#installation-guide)
4. [First Run](#first-run)
5. [Interface Overview](#interface-overview)
6. [Your First Exploration](#your-first-exploration)
7. [Basic Operations](#basic-operations)
8. [Next Steps](#next-steps)
9. [Troubleshooting](#troubleshooting)

## Quick Overview

The Research Discovery Engine is a comprehensive platform for scientific knowledge discovery consisting of three main components:

- **Discovery Engine (DE)**: Interactive 3D knowledge graph visualization and AI-assisted concept design
- **Web Platform**: Public interface for research showcases and collaboration
- **ResNEI**: Backend processing for document analysis and knowledge extraction

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+
- **RAM**: 4GB (8GB recommended)
- **Storage**: 2GB free space
- **Internet Connection**: Broadband connection for real-time features
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

### For Development
- **Node.js**: Version 18.0 or higher
- **Python**: Version 3.8 or higher (for ResNEI backend)
- **Git**: Latest version for version control

### Recommended Setup
- **RAM**: 8GB or more for smooth performance with large knowledge graphs
- **CPU**: Multi-core processor (4+ cores recommended)
- **Graphics**: Dedicated GPU for optimal 3D visualization performance
- **Display**: 1920x1080 or higher resolution for best UI experience

## Installation Guide

### Option 1: Automated Setup (Recommended) ⭐

The fastest and most reliable way to get started using our script orchestrator:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/Research-Discovery-Engine.git
cd Research-Discovery-Engine

# 2. Run automated setup and launch
python3 src/scripts/main.py --categories setup --launch
```

This single command will:
- ✅ Install all Discovery Engine dependencies
- ✅ Verify system readiness  
- ✅ Launch the web interface at `http://localhost:5173`
- ✅ Open your browser automatically
- ✅ Provide detailed logging with emojis

**Alternative automated options:**
```bash
# Setup only (no auto-launch)
python3 src/scripts/main.py --categories setup

# Full pipeline with data processing (advanced)
python3 src/scripts/main.py

# Preview what would run (dry-run mode)
python3 src/scripts/main.py --dry-run
```

### Option 2: Manual Setup (Advanced Users)

If you prefer manual control or need customization:

#### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/Research-Discovery-Engine.git
cd Research-Discovery-Engine
```

#### Step 2: Discovery Engine Setup
```bash
cd DE
npm install
cd ..
```

#### Step 3: Launch Discovery Engine
```bash
cd DE
npm run dev
```

The Discovery Engine will be available at `http://localhost:5173`

### Option 3: Full Platform Setup (All Components)

For the complete experience including web platform and document processing:

#### Discovery Engine + Web Platform
```bash
# Discovery Engine
cd DE && npm install && cd ..

# Web Platform  
cd website_explore_the_unknown && npm install && cd ..
```

#### ResNEI Backend Setup (Optional)
```bash
cd resnei

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
cd ..
```

#### Database Setup (For Full Backend)
```bash
# Install PostgreSQL (if not already installed)
# Windows: Download from https://www.postgresql.org/download/windows/
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql

# Create database
createdb resnei_dev

# Run database migrations
cd resnei
python manage.py migrate
cd ..
```

## First Run

### Using Automated Setup (Recommended)

If you used the automated setup, the Discovery Engine should already be running! Look for:

```
🚀 DISCOVERY ENGINE LAUNCHING
========================================
🌐 WEB INTERFACE STARTING...
   📍 Location: /path/to/DE
   🔗 URL: http://localhost:5173
   📊 Logs: Real-time output below
========================================
🚀 Starting Vite development server...
⏳ Server initializing... (will auto-open browser)
🔗 Manual access: http://localhost:5173
```

Your browser should open automatically to `http://localhost:5173`.

### Manual Startup

If you need to start the Discovery Engine manually:

```bash
cd DE
npm run dev
```

Or use our convenient launcher:
```bash
./start-de.sh
# or
src/scripts/setup/launch-de.sh
```

### Starting Additional Components (Optional)

In separate terminal windows:

```bash
# Web Platform
cd website_explore_the_unknown
npm run dev
# Available at http://localhost:3000

# ResNEI Backend (if database is set up)
cd resnei
source venv/bin/activate  # Windows: venv\Scripts\activate
python manage.py runserver
# Available at http://localhost:8000
```

### Verification

You should see:
1. **Discovery Engine**: 3D graph visualization with floating nodes and connections
2. **Navigation Sidebar**: Categories like Mechanisms, Materials, Methods, etc.
3. **Agent Console**: AI agents providing information and suggestions
4. **Search Bar**: For finding specific concepts

### Script Orchestrator Features

The automated setup provides:
- 📊 **Beautiful Logging**: Emoji-enhanced progress messages
- ⚡ **Smart Dependencies**: Automatic prerequisite checking
- 🔄 **Error Recovery**: Graceful handling of common issues
- 📈 **Progress Tracking**: Real-time status updates
- 🚀 **Auto-Launch**: Automatic browser opening
- 📁 **Results Logging**: Detailed execution reports saved to `src/orchestrator-results/`

## Interface Overview

### Main Components

#### 1. Central Graph Visualization
- **3D Interactive Space**: Navigate with mouse to rotate, zoom, and explore
- **Nodes**: Represent concepts (materials, mechanisms, methods, etc.)
- **Links**: Show relationships between concepts
- **Physics Simulation**: Nodes arrange themselves naturally based on connections

#### 2. Left Navigation Panel
Browse knowledge by category:
- 🧠 **Mechanisms**: Biological and physical processes
- ⚗️ **Materials**: Substances and their properties
- ⚡ **Methods**: Experimental and analytical techniques
- 🌊 **Phenomena**: Observable effects and behaviors
- 🎯 **Applications**: Practical uses and devices
- 🤔 **Theory**: Conceptual frameworks and models

#### 3. Agent Console (Bottom)
AI assistants that help with:
- **Discovery Engine**: Overall system coordination
- **Search Agent**: Finding relevant concepts
- **Exploration Agent**: Discovering connections and analogies
- **Protocol Agent**: Generating experimental procedures
- **Consistency Agent**: Validating concept coherence

#### 4. Context Panel (Right)
Shows detailed information about selected concepts:
- Properties and characteristics
- Related concepts and relationships
- Source information and references
- Available actions and operations

### Operating Modes

#### Explore Mode (Default)
- Navigate existing knowledge
- Search for concepts
- Discover relationships
- Browse by category

#### Create Mode
- Design new concepts
- Select components and materials
- Generate experimental protocols
- Validate design consistency

Switch modes using buttons in the top toolbar.

## Your First Exploration

### Basic Navigation

1. **Start with the Graph**: The 3D visualization shows the knowledge network. Click and drag to rotate, scroll to zoom.

2. **Select a Node**: Click on any colored sphere (node) to see its details in the right panel.

3. **Follow Relationships**: Click on connected nodes to explore how concepts relate to each other.

4. **Use the Breadcrumb Trail**: Track your navigation path at the top of the interface.

### Try These First Steps

#### 1. Explore Materials
```
1. Click "Materials" in the left sidebar
2. Browse through different material categories
3. Click on "graphene" or "polymers" to see examples
4. Select a material node to see its properties
5. Notice the connections to related concepts
```

#### 2. Search for Concepts
```
1. Use the search bar at the top
2. Try searching for "energy harvesting"
3. See how the graph filters to show relevant nodes
4. Click on search results to explore them
```

#### 3. Discover Cross-Domain Connections
```
1. Start with a material (e.g., "piezoelectric materials")
2. Follow links to mechanisms (e.g., "piezoelectric effect")
3. Explore applications (e.g., "energy harvesting devices")
4. See how different domains connect
```

#### 4. Ask the AI Agents
```
1. Look at messages in the Agent Console
2. Click on suggested actions from agents
3. Use agents to get explanations and recommendations
4. Let the Exploration Agent suggest related concepts
```

## Basic Operations

### Searching and Filtering

#### Text Search
- **Simple Terms**: Type "polymer" to find polymer-related concepts
- **Multiple Words**: "shape memory alloy" for specific materials
- **Properties**: "high conductivity" to find materials with specific characteristics

#### Category Filtering
- Use checkboxes in the navigation panel to show/hide categories
- Combine multiple categories to find intersections
- Apply property filters for more specific results

### Graph Interaction

#### Navigation Controls
- **Rotate**: Click and drag in empty space
- **Zoom**: Mouse wheel or trackpad scroll
- **Pan**: Hold Shift while dragging
- **Center**: Double-click empty space to reset view
- **Focus**: Double-click a node to center on it

#### Node Selection
- **Single Click**: Select node and show details
- **Double Click**: Center view on node
- **Right Click**: Access context menu with additional options

#### Relationship Exploration
- **Visual Connections**: Lines between nodes show relationships
- **Relationship Types**: Different line styles indicate different relationship types
- **Strength Indicators**: Line thickness may indicate relationship strength

### Using AI Agents

#### Getting Suggestions
1. Select a concept you're interested in
2. Check the Agent Console for relevant suggestions
3. Click on agent-suggested actions to explore further

#### Asking for Help
1. Use the "Ask Agent" feature (if available)
2. Agents can explain concepts, suggest related ideas, or help with exploration

#### Following Agent Guidance
- Agents provide context-aware recommendations
- They can guide you through exploration workflows
- Use their suggestions to discover unexpected connections

## Next Steps

### Deepen Your Knowledge

1. **Read the User Guide**: Comprehensive coverage of all features in [docs/user-guide.md](user-guide.md)

2. **Explore Specific Domains**: Focus on your area of interest using category browsing

3. **Try Concept Design**: Switch to Create mode and design your own concepts

4. **Upload Documents**: Use document processing to add your own research papers

### Advanced Features

1. **Custom Visualizations**: Adjust graph layout and appearance settings

2. **Export Capabilities**: Save interesting views and concept designs

3. **Collaboration**: Share discoveries and designs with others

4. **API Integration**: Connect external tools and databases

### Get Involved

1. **Join the Community**: Participate in discussions and forums

2. **Contribute Content**: Add knowledge, improve descriptions, validate relationships

3. **Report Issues**: Help improve the platform by reporting bugs or suggesting features

4. **Develop Extensions**: Create custom components or integrations

## Troubleshooting

### Common Startup Issues

#### Port Already in Use
```bash
# If port 5173 is busy, specify a different port
npm run dev -- --port 3001
```

#### Node.js Version Issues
```bash
# Check your Node.js version
node --version

# Should be 18.0 or higher
# Update Node.js if necessary from https://nodejs.org/
```

#### Installation Failures
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Performance Issues

#### Slow Graph Rendering
1. **Reduce Node Count**: Use filters to show fewer nodes
2. **Disable Physics**: Turn off physics simulation in settings
3. **Hide Labels**: Remove text labels for better performance
4. **Lower Quality**: Reduce visualization quality in settings

#### Memory Usage
1. **Close Unused Tabs**: Free up browser memory
2. **Restart Browser**: Fresh start can help with memory issues
3. **Update Browser**: Newer versions handle memory better

### Display Issues

#### Graph Not Loading
1. **Check Console**: Open browser developer tools to see errors
2. **Disable Extensions**: Browser extensions might interfere
3. **Try Different Browser**: Test with Chrome, Firefox, or Safari
4. **Clear Cache**: Clear browser cache and cookies

#### Interface Elements Missing
1. **Zoom Level**: Reset browser zoom to 100%
2. **Screen Resolution**: Ensure adequate screen resolution
3. **Browser Compatibility**: Use a supported browser version

### Getting Help

#### Documentation Resources
- **User Guide**: [docs/user-guide.md](user-guide.md) - Comprehensive feature documentation
- **Developer Guide**: [docs/developer-guide.md](developer-guide.md) - Technical information
- **API Reference**: [docs/api-reference.md](api-reference.md) - API documentation

#### Community Support
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions in GitHub Discussions
- **Community Forum**: Connect with other users and researchers

#### Contact Information
- **Email Support**: support@research-discovery-engine.org
- **Technical Issues**: tech-support@research-discovery-engine.org
- **General Inquiries**: info@research-discovery-engine.org

#### Additional Resources
- **[Troubleshooting Guide](troubleshooting.md)** - Comprehensive solutions for common issues
- **[Developer Guide](developer-guide.md)** - Technical documentation for developers
- **[API Reference](api-reference.md)** - Complete API documentation

### Frequently Asked Questions

#### Q: Do I need to install all components to use the platform?
A: No, you can start with just the Discovery Engine for knowledge exploration. The other components add document processing and web platform features.

#### Q: Can I use this offline?
A: The Discovery Engine can work offline once loaded, but some features like document processing and real-time collaboration require internet connectivity.

#### Q: How do I add my own research data?
A: You can upload PDF documents through the document processing feature, or manually add concepts through the concept design interface.

#### Q: Is there a mobile version?
A: The platform is optimized for desktop use, but basic browsing works on tablets. Mobile support is planned for future releases.

#### Q: Can I export my discoveries?
A: Yes, you can export concept designs, graph snapshots, and research findings in various formats including PDF, JSON, and citation formats.

---

**Congratulations!** You're now ready to start exploring the vast network of scientific knowledge with the Research Discovery Engine. Begin with simple searches and let the AI agents guide you toward exciting discoveries and innovations.

For more detailed information, proceed to the [User Guide](user-guide.md) or explore specific aspects using the other documentation resources. 