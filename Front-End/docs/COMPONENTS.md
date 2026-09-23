# Component Documentation

## Overview

The Discovery Engine is built with a modular React component architecture that separates concerns into specialized, reusable components. Each component follows the established patterns and handles specific aspects of the knowledge discovery workflow.

## Architecture Diagram

```
App.tsx (Main Container)
├── Navbar.tsx (Navigation & Controls)
├── KnowledgeBrowserSidebar.tsx (Knowledge Navigation)
├── GraphVisualization/ (3D Graph Display)
│   ├── GraphVisualization.tsx
│   └── GraphControls.tsx
├── ContextPanel/ (Right Panel)
│   ├── ContextPanel.tsx
│   ├── NodeView/ (Node Details)
│   └── ConceptDesigner/ (Concept Creation)
├── AgentConsole/ (AI Assistant Interface)
├── BreadcrumbPanel.tsx (Navigation Path)
└── Modals/ (Dialog Components)
    └── PDFUploader.tsx
```

## Core Components

### App.tsx
**Purpose**: Main application container and state orchestrator
**Responsibilities**:
- Global state management (selected nodes, modes, search)
- Agent message coordination
- Route-like mode switching (explore/create)
- Event delegation between components

**Key State**:
- `activeMode`: 'explore' | 'create'
- `selectedNodeId`: Currently selected graph node
- `conceptDesignState`: Current concept being designed
- `agentMessages`: AI assistant message history

**Key Patterns**:
- Uses custom hooks for complex state (`useGraphData`, `useConceptDesign`)
- Implements callback patterns for child component communication
- Manages breadcrumb navigation state

### GraphVisualization/
**Purpose**: Interactive 3D knowledge graph display

#### GraphVisualization.tsx
**Responsibilities**:
- 3D force-directed graph rendering using `3d-force-graph`
- Node/link filtering based on search queries
- User interaction handling (click, hover)
- Visual customization (colors, sizes, labels)

**Key Features**:
- Real-time search filtering
- Node type-based styling
- Zoom and pan controls
- Dynamic label display

#### GraphControls.tsx
**Responsibilities**:
- Graph display options (labels, links, physics)
- Visual control toggles
- Performance optimization settings

### KnowledgeBrowserSidebar.tsx
**Purpose**: Hierarchical navigation of knowledge base content
**Responsibilities**:
- Accordion-style file browsing
- Markdown content parsing and display
- Section-based navigation
- Link resolution to graph nodes

**Key Features**:
- Collapsible sections per knowledge domain
- Real-time content rendering
- Cross-reference link handling
- Search integration

### ContextPanel/
**Purpose**: Right-hand panel for detailed views

#### ContextPanel.tsx
**Container Component**:
- Switches between NodeView and ConceptDesigner
- Manages panel state and transitions
- Handles resize and responsive behavior

#### NodeView/
**Purpose**: Displays detailed information for selected graph nodes
**Responsibilities**:
- Markdown content rendering
- Node metadata display
- Related node suggestions
- Citation and reference handling

#### ConceptDesigner/
**Purpose**: Guided workflow for creating new knowledge concepts
**Responsibilities**:
- Step-by-step concept creation wizard
- Component selection and integration
- AI-assisted suggestions
- Validation and consistency checking

**Workflow Steps**:
1. Define objective and scope
2. Select and integrate components
3. Define relationships and parameters
4. Generate validation protocols
5. Package as knowledge artifact

### AgentConsole/
**Purpose**: AI assistant interface and message display
**Responsibilities**:
- Message history display
- Agent action triggers
- Suggestion handling
- Conversation context management

**Agent Types**:
- Discovery Engine (general)
- Search Agent (graph search)
- Exploration Agent (suggestions)
- Consistency Agent (validation)
- Protocol Agent (methodology)
- Concept Agent (synthesis)

### BreadcrumbPanel.tsx
**Purpose**: Navigation path display
**Responsibilities**:
- Show current location in knowledge hierarchy
- Enable quick navigation to previous contexts
- Visual path representation

### Modals/
**Purpose**: Dialog components for specialized interactions

#### PDFUploader.tsx
**Responsibilities**:
- File upload interface
- PDF processing simulation
- Progress indication
- Error handling

## Component Communication Patterns

### Props Down, Events Up
```typescript
// Parent passes data down
<ChildComponent 
  data={parentData} 
  onEvent={handleChildEvent} 
/>

// Child emits events up
const handleAction = () => {
  onEvent(eventData);
};
```

### Custom Hooks for Shared Logic
```typescript
// useGraphData.ts - Shared graph state
const { graphData, loading, error } = useGraphData();

// useConceptDesign.ts - Concept creation state
const { conceptState, updateConcept } = useConceptDesign();
```

### Context for Deep State
```typescript
// Used sparingly for app-wide state
const AppContext = createContext(appState);
```

## Styling Architecture

### Tailwind CSS Classes
- Utility-first approach
- Responsive design patterns
- Dark/light theme support
- Custom component classes

### Theme System
```typescript
// Dark mode toggle
const [darkMode, setDarkMode] = useState(true);

// Applied via className conditional
className={`${darkMode ? 'dark' : ''} app-container`}
```

## Data Flow

### Graph Data Loading
1. `useGraphData` hook loads markdown files
2. `cnmBuilder.ts` parses content into graph structure
3. Graph visualization renders the data
4. User interactions update selected state

### Concept Creation Flow
1. User initiates concept creation
2. `ConceptDesigner` guides through steps
3. `useConceptDesign` manages state
4. AI agents provide suggestions
5. Final concept becomes new graph node

### Search and Navigation
1. User enters search query
2. Graph filters nodes/links
3. Browser sidebar highlights matches
4. Breadcrumbs update with path

## Performance Considerations

### Optimization Strategies
- React.memo for expensive components
- useMemo for computed values
- useCallback for stable function references
- Lazy loading for large datasets

### Graph Rendering
- Node culling for performance
- Level-of-detail for zoom levels
- Debounced search/filter operations
- Efficient force simulation parameters

## Error Handling

### Error Boundaries
```typescript
// Wrap components that might fail
<ErrorBoundary fallback={<ErrorDisplay />}>
  <GraphVisualization />
</ErrorBoundary>
```

### Async Error Handling
```typescript
// Custom hooks handle loading/error states
const { data, loading, error } = useAsyncData();

if (error) return <ErrorDisplay error={error} />;
if (loading) return <LoadingSpinner />;
```

## Testing Strategy

### Component Testing
- Unit tests for utility functions
- Integration tests for component interactions
- Visual regression tests for graph rendering
- E2E tests for critical workflows

### Mock Strategies
- Mock graph data for consistent testing
- Mock AI agents for predictable responses
- Mock file loading for faster tests

## Future Architecture Considerations

### Scalability
- Component virtualization for large lists
- Graph database integration
- Backend API integration
- Real-time collaboration features

### Modularity
- Plugin architecture for new agent types
- Configurable workflow steps
- Extensible node type system
- Theme customization system

---

This documentation serves as a guide for understanding, maintaining, and extending the Discovery Engine component architecture. 