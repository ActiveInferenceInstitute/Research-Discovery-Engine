# Research Discovery Engine - User Guide

This comprehensive guide covers all features and capabilities of the Research Discovery Engine (RDE), helping you make the most of this powerful research platform.

## Table of Contents

1. [Interface Overview](#interface-overview)
2. [Knowledge Graph Exploration](#knowledge-graph-exploration)
3. [Search and Discovery](#search-and-discovery)
4. [Concept Design and Creation](#concept-design-and-creation)
5. [AI Agent System](#ai-agent-system)
6. [Knowledge Browsing](#knowledge-browsing)
7. [Document Processing](#document-processing)
8. [Collaboration Features](#collaboration-features)
9. [Advanced Features](#advanced-features)
10. [Tips and Best Practices](#tips-and-best-practices)

## Interface Overview

### Main Layout

The Research Discovery Engine interface consists of several integrated components:

#### 1. Central Graph Visualization
The heart of the RDE is the interactive 3D knowledge graph that displays concepts as nodes and relationships as links. This visualization supports:

- **3D Navigation**: Click and drag to rotate, scroll to zoom
- **Node Selection**: Click nodes to view details and explore relationships
- **Dynamic Filtering**: Real-time updates based on search queries and filters
- **Physics Simulation**: Realistic force-directed layout for intuitive clustering

#### 2. Navigation Sidebar
Located on the left side, this panel provides structured access to knowledge:

**Categories Available:**
- 🧠 **Mechanisms**: Biological and physical processes
- ⚗️ **Materials**: Substances, polymers, composites, and their properties
- ⚡ **Methods**: Experimental techniques, analytical methods, fabrication processes
- 🌊 **Phenomena**: Observable effects, behaviors, and emergent properties
- 🎯 **Applications**: Practical implementations, devices, and use cases
- 🤔 **Theory**: Theoretical frameworks, models, and conceptual foundations
- 📖 **CNM Schema**: Conceptual Nexus Model specification and documentation

#### 3. Agent Console
The bottom panel displays messages from AI agents:

- **Discovery Engine**: Overall system orchestration
- **Search Agent**: Handles graph queries and filtering
- **Exploration Agent**: Finds analogies and suggests related concepts
- **Protocol Agent**: Generates experimental procedures
- **Consistency Agent**: Validates concept coherence
- **ConceptAgent**: Assists with concept design and summarization

#### 4. Context Panel
The right panel shows detailed information about selected items:

- **Node Properties**: Type, description, relationships
- **Metadata**: Sources, classifications, tags
- **Related Concepts**: Connected nodes and relationship types
- **Actions**: Available operations for the selected concept

### Mode Switching

The RDE operates in two primary modes:

#### Explore Mode (Default)
- **Purpose**: Navigate and discover existing knowledge
- **Features**: Graph exploration, search, browsing, relationship discovery
- **Best for**: Understanding existing concepts, finding connections, literature review

#### Create Mode
- **Purpose**: Design new concepts and research hypotheses
- **Features**: Concept designer, component selection, protocol generation
- **Best for**: Hypothesis formation, experimental design, innovation

Switch between modes using the buttons in the top toolbar.

## Knowledge Graph Exploration

### Basic Navigation

#### Viewing and Selecting Nodes
```
1. Click on any node to select it
2. View node details in the context panel
3. See immediate neighbors highlighted
4. Use breadcrumb trail to track navigation path
```

#### 3D Graph Controls
- **Rotate**: Click and drag in empty space
- **Zoom**: Mouse wheel or trackpad scroll
- **Pan**: Hold Shift while dragging
- **Center**: Double-click empty space to reset view
- **Focus on Node**: Double-click a node to center it

#### Graph Visualization Settings
Access via the controls panel (gear icon):

- **Show Labels**: Toggle node text labels
- **Show Links**: Toggle relationship lines
- **Enable Physics**: Turn physics simulation on/off
- **Show Particles**: Add visual effects (impacts performance)
- **Node Size**: Adjust based on importance/connections
- **Link Strength**: Filter by relationship strength

### Advanced Graph Features

#### Relationship Types
Different link styles indicate relationship types:

- **Enables**: A enables B (solid blue)
- **Inhibits**: A inhibits B (dashed red)
- **Composed-of**: A is composed of B (thick green)
- **Similar-to**: A is similar to B (dotted purple)
- **Applied-in**: A is applied in B (dash-dot orange)

#### Node Clustering
Nodes naturally cluster based on:

- **Semantic Similarity**: Related concepts group together
- **Category Type**: Similar types cluster (materials with materials)
- **Relationship Density**: Highly connected concepts form hubs
- **Research Domain**: Disciplinary boundaries create clusters

#### Graph Metrics
The system calculates and displays:

- **Centrality**: Most important/connected nodes
- **Communities**: Related concept clusters
- **Shortest Paths**: Connection routes between concepts
- **Clustering Coefficients**: Local connectivity density

## Search and Discovery

### Basic Search

#### Text Search
The search bar supports multiple query types:

```
Single terms: "polymer"
Multiple terms: "energy harvesting"
Natural language: "materials for flexible electronics"
Specific properties: "high conductivity low cost"
```

#### Search Results
When you search, the system:

1. **Filters the graph** to show relevant nodes
2. **Highlights matches** with increased node size/color
3. **Updates the Agent Console** with search statistics
4. **Suggests related terms** for query expansion

#### Search Tips
- Use **specific terminology** for precise results
- Try **synonyms and variants** if first search doesn't work
- **Combine concepts** to find intersections
- Use **property descriptors** to refine results

### Advanced Search Features

#### Semantic Search
The RDE uses advanced NLP to understand:

- **Conceptual Relationships**: "materials similar to graphene"
- **Property Queries**: "transparent conductive materials"
- **Functional Queries**: "mechanisms for energy conversion"
- **Cross-Domain Queries**: "biological inspiration for robotics"

#### Filtered Search
Combine text search with filters:

```
1. Enter search query
2. Apply category filters (Materials, Mechanisms, etc.)
3. Set relationship strength thresholds
4. Filter by node properties or metadata
```

#### Search History
The system maintains:

- **Recent Searches**: Quick access to previous queries
- **Saved Searches**: Bookmark important search patterns
- **Search Sessions**: Track exploration paths
- **Query Suggestions**: Learn from usage patterns

### Discovery Workflows

#### Analogical Discovery
Find concepts similar to your area of interest:

```
1. Select a concept node
2. Right-click or use context menu
3. Choose "Find Analogies"
4. Explore suggested analogous concepts from different domains
```

#### Gap Analysis
Identify unexplored areas:

```
1. Use the Exploration Agent
2. Select "Launch Exploratory Analysis"
3. Review identified knowledge gaps
4. Explore opportunities for new research
```

#### Cross-Domain Exploration
Bridge different research areas:

```
1. Start in one domain (e.g., Materials)
2. Follow relationships to other domains
3. Use breadcrumb trail to track cross-domain paths
4. Identify novel interdisciplinary connections
```

## Concept Design and Creation

### Getting Started with Concept Design

#### Switching to Create Mode
```
1. Click "Create" in the top toolbar
2. Choose initialization method:
   - From selected node (use existing concept as starting point)
   - From research goal (start with objective)
   - Blank slate (completely new concept)
```

#### Setting Research Objectives
```
1. Define your research goal clearly
2. Use specific, measurable objectives
3. Consider feasibility and scope
4. Examples:
   - "Develop self-healing polymer for aerospace applications"
   - "Create bio-inspired sensor for environmental monitoring"
   - "Design energy-efficient actuator for soft robotics"
```

### Component Selection Process

#### Materials Selection
The system helps you choose appropriate materials:

```
1. Browse materials catalog
2. Filter by properties (conductivity, flexibility, etc.)
3. Use AI suggestions based on your objective
4. Consider compatibility with other components
```

**Material Categories:**
- **Polymers**: Flexible, processable, tunable properties
- **Ceramics**: High temperature, electrical insulation
- **Metals**: Conductivity, mechanical strength
- **Composites**: Combined properties from multiple materials
- **Biomaterials**: Biocompatibility, biodegradability
- **2D Materials**: Graphene, MoS2, unique properties

#### Mechanism Selection
Choose relevant mechanisms for your concept:

```
1. Browse mechanism categories
2. Consider how mechanisms enable your objective
3. Look for synergistic combinations
4. Validate feasibility with selected materials
```

**Mechanism Categories:**
- **Energy Conversion**: Transform one energy type to another
- **Signal Transduction**: Convert stimuli to responses
- **Self-Assembly**: Autonomous organization of components
- **Adaptive Responses**: Dynamic property changes
- **Transport Phenomena**: Mass, heat, charge transfer

#### Method Integration
Select appropriate methods and techniques:

```
1. Choose synthesis/fabrication methods
2. Select characterization techniques
3. Plan testing and validation procedures
4. Consider scalability and reproducibility
```

### AI-Assisted Design

#### Suggestion Engine
The AI system provides intelligent recommendations:

- **Component Compatibility**: Check if selected components work together
- **Property Predictions**: Estimate system properties
- **Optimization Suggestions**: Improve design performance
- **Risk Assessment**: Identify potential issues

#### Consistency Validation
The Consistency Agent checks your design:

```
1. Analyzes component interactions
2. Identifies potential conflicts
3. Suggests modifications
4. Validates against known science
```

#### Protocol Generation
The Protocol Agent creates experimental procedures:

```
1. Generates step-by-step synthesis protocols
2. Suggests characterization methods
3. Proposes testing procedures
4. Estimates timelines and resources
```

### Design Refinement

#### Iterative Improvement
```
1. Review AI feedback and suggestions
2. Modify components based on recommendations
3. Re-validate with Consistency Agent
4. Repeat until design is optimized
```

#### Design Documentation
The system helps document your concept:

- **Concept Summary**: Automated overview generation
- **Component Specifications**: Detailed material/mechanism descriptions
- **Protocol Outlines**: Step-by-step procedures
- **Expected Outcomes**: Predicted properties and performance

#### Design Status Tracking
Monitor your concept's development status:

- **Draft**: Initial concept formation
- **Proposed**: Basic design complete
- **Validated**: Consistency checked
- **Protocol Ready**: Experimental procedures defined
- **Ready for Implementation**: Complete design package

## AI Agent System

### Understanding the Agents

#### Discovery Engine (Orchestrator)
- **Role**: Coordinates overall workflow and agent interactions
- **Capabilities**: Task routing, priority management, system orchestration
- **When Active**: Throughout all platform interactions

#### Search Agent
- **Role**: Handles graph querying and semantic search
- **Capabilities**: Natural language processing, result filtering, relevance ranking
- **When Active**: During search operations and graph filtering

#### Exploration Agent
- **Role**: Discovers relationships and suggests new directions
- **Capabilities**: Analogy detection, gap analysis, cross-domain connections
- **When Active**: During exploration workflows and concept development

#### Protocol Agent
- **Role**: Generates experimental procedures and methodological guidance
- **Capabilities**: Protocol synthesis, method selection, procedure optimization
- **When Active**: During concept design and experimental planning

#### Consistency Agent
- **Role**: Validates concept coherence and identifies conflicts
- **Capabilities**: Compatibility checking, physics validation, constraint satisfaction
- **When Active**: During concept validation and design review

#### ConceptAgent
- **Role**: Assists with concept creation and documentation
- **Capabilities**: Summary generation, design packaging, artifact creation
- **When Active**: During concept finalization and documentation

### Interacting with Agents

#### Agent Messages
Agents communicate through the console panel:

- **Info Messages**: Status updates and information
- **Suggestions**: Recommendations for action
- **Warnings**: Potential issues or conflicts
- **Opportunities**: Identified research opportunities

#### Agent Actions
Many agent messages include actionable items:

```
Click on suggested actions to:
- Explore recommended concepts
- Add suggested components
- View detailed explanations
- Accept or reject recommendations
```

#### Agent Triggers
You can explicitly invoke agent actions:

- **Right-click on nodes**: Context-sensitive agent options
- **Use action buttons**: Trigger specific agent workflows
- **Voice commands**: Natural language agent interaction (if available)

### Agent Workflows

#### Discovery Workflow
```
1. Search Agent filters relevant content
2. Exploration Agent suggests related concepts
3. Discovery Engine coordinates exploration
4. ConceptAgent documents findings
```

#### Design Workflow
```
1. ConceptAgent initializes design space
2. Exploration Agent suggests components
3. Consistency Agent validates selections
4. Protocol Agent generates procedures
```

#### Validation Workflow
```
1. Consistency Agent checks design coherence
2. Protocol Agent validates experimental feasibility
3. Exploration Agent identifies potential improvements
4. Discovery Engine coordinates refinements
```

## Knowledge Browsing

### Category-Based Browsing

#### Hierarchical Navigation
Each category provides structured access to knowledge:

```
Mechanisms
├── Energy Conversion
│   ├── Photovoltaic Effect
│   ├── Thermoelectric Effect
│   └── Piezoelectric Effect
├── Signal Transduction
├── Self-Assembly
└── Transport Phenomena
```

#### Category Features
- **Index Sections**: Overview of all items in category
- **Detailed Descriptions**: In-depth explanations of concepts
- **Cross-References**: Links to related concepts in other categories
- **Recent Updates**: Latest additions and modifications

### Context-Aware Browsing

#### Breadcrumb Navigation
Track your browsing path:

```
Home > Materials > Polymers > Conductive Polymers > PEDOT:PSS
```

- **Click any breadcrumb**: Jump back to that level
- **Use browser back/forward**: Navigate browsing history
- **Save paths**: Bookmark important navigation routes

#### Related Concept Suggestions
The system suggests related items:

- **Similar Concepts**: Items with comparable properties
- **Complementary Concepts**: Items that work well together
- **Cross-Domain Relations**: Connections to other categories
- **Recent Additions**: Newly added related content

### Knowledge Graph Context

#### Node Neighborhood
When browsing, see:

- **Direct Connections**: Immediately related concepts
- **Second-Degree Connections**: Concepts connected through intermediates
- **Clustering Information**: Local concept communities
- **Centrality Metrics**: Importance within the network

#### Dynamic Filtering
Browse with active filters:

- **Filter by Properties**: Show only items matching criteria
- **Filter by Relationships**: Focus on specific connection types
- **Filter by Recency**: Show recently added or updated items
- **Filter by Relevance**: Prioritize based on current interests

## Document Processing

### PDF Upload and Processing

#### Supported Document Types
- **Research Papers**: Academic journal articles
- **Conference Proceedings**: Conference papers and abstracts
- **Technical Reports**: Government and industry reports
- **Theses and Dissertations**: Graduate research documents
- **Patents**: Patent applications and grants

#### Upload Process
```
1. Click the upload button (📄 icon)
2. Select PDF files from your computer
3. Wait for processing (may take several minutes)
4. Review extracted concepts and relationships
5. Validate and refine as needed
```

#### Processing Pipeline
The system automatically:

1. **Extracts Text**: OCR for scanned documents, direct extraction for text PDFs
2. **Identifies Concepts**: Named entity recognition and concept extraction
3. **Analyzes Relationships**: Determines connections between concepts
4. **Creates Graph Nodes**: Adds new concepts to the knowledge graph
5. **Updates Connections**: Links new concepts to existing knowledge

### Knowledge Extraction

#### Concept Identification
The system identifies:

- **Materials**: Substances, compounds, composites mentioned
- **Mechanisms**: Processes, phenomena, and behaviors described
- **Methods**: Techniques, procedures, and protocols used
- **Applications**: Use cases, implementations, and devices
- **Properties**: Characteristics, measurements, and specifications

#### Relationship Extraction
The system detects:

- **Causal Relationships**: What causes what
- **Compositional Relationships**: What is made of what
- **Functional Relationships**: What enables what
- **Similarity Relationships**: What is similar to what
- **Temporal Relationships**: What happens when

#### Quality Control
The system provides:

- **Confidence Scores**: Reliability of extracted information
- **Source Attribution**: Links back to original document sections
- **Human Validation**: Options to review and correct extractions
- **Conflict Resolution**: Handling of contradictory information

### Integration with Knowledge Graph

#### New Node Creation
Extracted concepts become new graph nodes with:

- **Unique Identifiers**: Systematic naming conventions
- **Rich Descriptions**: Detailed property and context information
- **Source References**: Links to originating documents
- **Confidence Metrics**: Reliability indicators

#### Relationship Integration
New relationships are added considering:

- **Existing Connections**: Avoid duplication, strengthen existing links
- **Consistency Checking**: Validate against current knowledge
- **Conflict Resolution**: Handle contradictory information
- **Weight Adjustment**: Update relationship strengths

## Collaboration Features

### Sharing and Export

#### Concept Sharing
Share your designed concepts:

```
1. Complete your concept design
2. Generate concept summary
3. Export as:
   - PDF report
   - JSON data
   - Shareable link
   - Citation format
```

#### Graph Snapshots
Save and share graph states:

- **Current View**: Save exactly what you're seeing
- **Filtered State**: Save with current filters applied
- **Node Selection**: Save with specific nodes highlighted
- **Annotation**: Add notes and comments to shared views

#### Export Formats
Multiple export options:

- **Academic Formats**: LaTeX, Word, PDF with proper citations
- **Data Formats**: JSON, CSV, GraphML for further analysis
- **Visual Formats**: PNG, SVG, interactive HTML
- **Code Formats**: Python, R scripts for data analysis

### Version Control

#### Design Versioning
Track concept design evolution:

- **Version History**: See all design iterations
- **Change Tracking**: What changed between versions
- **Branching**: Create alternative design paths
- **Merging**: Combine different design approaches

#### Knowledge Graph Updates
Monitor graph evolution:

- **Change Logs**: Track additions, modifications, deletions
- **Source Attribution**: Who contributed what
- **Quality Metrics**: Track improvement over time
- **Conflict Resolution**: Handle competing updates

### Community Features

#### User Contributions
Contribute to the knowledge base:

- **Add Concepts**: Propose new nodes and relationships
- **Improve Descriptions**: Enhance existing content
- **Validate Relationships**: Review and confirm connections
- **Report Issues**: Flag problems or inconsistencies

#### Peer Review
Quality assurance through community:

- **Review Submissions**: Evaluate proposed additions
- **Rating System**: Rate quality of contributions
- **Discussion Threads**: Discuss complex concepts
- **Expert Validation**: Specialist review for technical content

## Advanced Features

### Custom Visualizations

#### Graph Layouts
Choose from multiple layout algorithms:

- **Force-Directed**: Natural clustering based on relationships
- **Hierarchical**: Tree-like structure showing dependencies
- **Circular**: Circular arrangement with categories as sectors
- **Grid**: Organized grid layout for systematic exploration

#### Visual Customization
Customize the appearance:

- **Color Schemes**: Choose colors for different node types
- **Node Shapes**: Different shapes for different categories
- **Size Mapping**: Map node size to importance metrics
- **Edge Styling**: Customize relationship line appearance

#### Performance Optimization
For large graphs:

- **Level of Detail**: Show more detail when zoomed in
- **Culling**: Hide distant nodes for better performance
- **Clustering**: Group distant nodes into clusters
- **Progressive Loading**: Load content as needed

### Analytics and Insights

#### Graph Analytics
Understand your knowledge graph:

- **Centrality Analysis**: Identify most important concepts
- **Community Detection**: Find related concept clusters
- **Path Analysis**: Discover connection pathways
- **Growth Analysis**: Track knowledge graph evolution

#### Usage Analytics
Track your exploration patterns:

- **Search Patterns**: What you search for most
- **Navigation Paths**: How you move through the graph
- **Time Spent**: Where you focus your attention
- **Concept Preferences**: Your areas of interest

#### Research Insights
Discover research opportunities:

- **Knowledge Gaps**: Underexplored areas
- **Emerging Connections**: New relationship patterns
- **Trending Concepts**: Growing areas of interest
- **Collaboration Opportunities**: Potential research partnerships

### API and Integration

#### REST API
Programmatic access to platform features:

- **Graph Queries**: Search and retrieve graph data
- **Concept CRUD**: Create, read, update, delete concepts
- **User Management**: Handle user accounts and permissions
- **Analytics**: Access usage and performance metrics

#### Webhook Support
Real-time updates:

- **Graph Changes**: Notifications when graph is updated
- **New Documents**: Alerts for new document processing
- **User Actions**: Track important user activities
- **System Events**: Monitor system health and performance

#### Third-Party Integrations
Connect with external tools:

- **Reference Managers**: Zotero, Mendeley integration
- **Laboratory Systems**: LIMS and instrument data
- **Publication Platforms**: arXiv, PubMed, journal APIs
- **Collaboration Tools**: Slack, Teams, Discord notifications

## Tips and Best Practices

### Effective Graph Exploration

#### Start Broad, Then Focus
```
1. Begin with category browsing to understand scope
2. Use search to narrow to your area of interest
3. Follow relationships to explore connections
4. Use breadcrumbs to track your exploration path
```

#### Use Multiple Discovery Methods
- **Keyword Search**: Find specific concepts
- **Category Browsing**: Understand knowledge structure
- **Relationship Following**: Discover unexpected connections
- **Analogical Reasoning**: Find cross-domain insights

#### Leverage AI Agents
- **Ask for Suggestions**: Use agents to guide exploration
- **Validate Ideas**: Use Consistency Agent for design checking
- **Generate Protocols**: Let Protocol Agent help with methods
- **Find Gaps**: Use Exploration Agent to identify opportunities

### Efficient Concept Design

#### Start with Clear Objectives
```
1. Define specific, measurable goals
2. Consider constraints and requirements
3. Identify success criteria
4. Plan evaluation methods
```

#### Build Incrementally
- **Start Simple**: Begin with core components
- **Add Complexity**: Gradually increase sophistication
- **Validate Frequently**: Check consistency at each step
- **Document Decisions**: Record rationale for choices

#### Use Agent Feedback
- **Accept Suggestions**: AI recommendations are often valuable
- **Question Conflicts**: Investigate consistency warnings
- **Explore Alternatives**: Consider multiple design paths
- **Iterate Based on Feedback**: Refine designs based on agent input

### Knowledge Management

#### Organize Your Work
- **Use Bookmarks**: Save important concepts and searches
- **Create Collections**: Group related concepts together
- **Document Progress**: Keep notes on your discoveries
- **Version Designs**: Track evolution of your concepts

#### Contribute to Community
- **Share Discoveries**: Upload your research documents
- **Improve Descriptions**: Enhance concept documentation
- **Validate Content**: Help review community contributions
- **Report Issues**: Flag problems for community attention

#### Stay Current
- **Monitor Updates**: Watch for new content additions
- **Follow Research Trends**: Track emerging concept patterns
- **Participate in Discussions**: Engage with community forums
- **Provide Feedback**: Help improve platform functionality

### Performance Optimization

#### For Large Graphs
- **Use Filters**: Reduce visual complexity
- **Disable Physics**: Improve rendering performance
- **Hide Labels**: Reduce text rendering overhead
- **Adjust Quality**: Lower detail for better performance

#### For Slow Searches
- **Use Specific Terms**: More precise queries are faster
- **Apply Filters**: Narrow search scope before querying
- **Avoid Wildcards**: Specific terms work better than broad patterns
- **Cache Results**: Save frequent searches for quick access

#### For Memory Issues
- **Close Unused Tabs**: Reduce browser memory usage
- **Restart Regularly**: Fresh starts improve performance
- **Update Browser**: Newer versions handle memory better
- **Increase RAM**: More memory helps with large graphs

This comprehensive user guide should help you master all aspects of the Research Discovery Engine. For more specific technical information, see the [Developer Guide](developer-guide.md) or [API Reference](api-reference.md). 