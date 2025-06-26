# API Reference - Research Discovery Engine

## Overview

This document provides a comprehensive reference for all public APIs, hooks, utilities, and services in the Research Discovery Engine.

## Custom Hooks

### useAppState

**Location**: `src/hooks/useAppState.ts`

**Purpose**: Centralized state management for the entire application

```typescript
const {
  state,           // Application state
  actions,         // Action creators
  graphData,       // Graph data
  graphLoading,    // Loading state
  graphError       // Error state
} = useAppState();
```

**State Interface**:
```typescript
interface AppState {
  // UI State
  darkMode: boolean;
  activeMode: 'explore' | 'create';
  isKnowledgeBrowserOpen: boolean;
  
  // Selection State
  selectedNodeId: string | null;
  searchQuery: string;
  
  // Modal State
  showPDFUploader: boolean;
  
  // Agent State
  agentMessages: AgentMessage[];
  
  // Concept Design State
  conceptDesignState: ConceptDesignState;
  
  // Navigation State
  breadcrumbItems: BreadcrumbItem[];
}
```

**Actions**:
- `toggleDarkMode()`: Toggle dark/light mode
- `setActiveMode(mode)`: Switch between explore/create modes
- `handleNodeSelect(node)`: Select a graph node
- `handleSearch(query)`: Update search query
- `addAgentMessage(message)`: Add new agent message
- `updateConceptDesign(updates)`: Update concept design state
- `updateBreadcrumbs(items)`: Update navigation breadcrumbs

### useGraphData

**Location**: `src/hooks/useGraphData.ts`

**Purpose**: Manage graph data loading and manipulation

```typescript
const { 
  graphData, 
  loading, 
  error, 
  setGraphData 
} = useGraphData();
```

**Return Values**:
- `graphData: GraphData | null` - Current graph data
- `loading: boolean` - Loading state
- `error: string | null` - Error message if loading fails
- `setGraphData: (data: GraphData) => void` - Update graph data

### useConceptDesign

**Location**: `src/hooks/useConceptDesign.ts`

**Purpose**: Manage concept creation workflow state

```typescript
const { 
  conceptState, 
  updateConcept, 
  resetConcept 
} = useConceptDesign();
```

## Services

### AgentService

**Location**: `src/services/AgentService.ts`

**Purpose**: Simulate AI agent interactions and responses

```typescript
const agentService = createAgentService();

// Trigger agent action
const response = await agentService.triggerAction({
  type: 'search',
  payload: { query: 'materials' }
});
```

**Agent Actions**:
- `search` - Search graph for relevant nodes
- `explore` - Suggest exploration paths
- `consistency` - Check concept consistency
- `protocol` - Suggest validation protocols
- `concept` - Generate concept suggestions
- `orchestrate` - Coordinate multiple agents

## Utility Libraries

### commonUtils

**Location**: `src/utils/commonUtils.ts`

**Functions**:

#### `debounce(func, delay)`
Debounce function calls to prevent excessive execution
```typescript
const debouncedSearch = debounce(performSearch, 300);
```

#### `throttle(func, limit)`
Throttle function calls to limit execution frequency
```typescript
const throttledScroll = throttle(handleScroll, 100);
```

#### `deepClone(obj)`
Create a deep copy of an object
```typescript
const cloned = deepClone(originalData);
```

#### `formatBytes(bytes)`
Format byte values for human-readable display
```typescript
const readable = formatBytes(1024); // "1 KB"
```

#### `formatTimestamp(date)`
Format timestamps for consistent display
```typescript
const formatted = formatTimestamp(new Date());
```

### performanceUtils

**Location**: `src/utils/performanceUtils.ts`

**React Performance Hooks**:

#### `useStableCallback(callback, deps)`
Create stable callback references for performance
```typescript
const stableHandler = useStableCallback(
  (data) => handleAction(data),
  [dependency]
);
```

#### `useStableMemo(factory, deps)`
Stable memoization for expensive calculations
```typescript
const expensiveValue = useStableMemo(
  () => performCalculation(data),
  [data]
);
```

#### `useDebouncedValue(value, delay)`
Debounce rapidly changing values
```typescript
const debouncedQuery = useDebouncedValue(searchQuery, 300);
```

#### `useVirtualList(items, options)`
Virtual scrolling for large lists
```typescript
const { visibleItems, totalHeight, onScroll } = useVirtualList(
  items,
  { itemHeight: 50, containerHeight: 400 }
);
```

### dataTransformUtils

**Location**: `src/utils/dataTransformUtils.ts`

**Graph Processing Functions**:

#### `filterGraphBySearch(graphData, query)`
Filter graph nodes and links by search query
```typescript
const { filteredData, highlights } = filterGraphBySearch(
  graphData, 
  searchQuery
);
```

#### `calculateGraphStats(graphData)`
Calculate comprehensive graph statistics
```typescript
const stats = calculateGraphStats(graphData);
// Returns: { nodeCount, linkCount, density, clusters, etc. }
```

#### `findShortestPath(graphData, startId, endId)`
Find shortest path between nodes
```typescript
const path = findShortestPath(graphData, 'node1', 'node2');
```

#### `extractKeywords(text, options)`
Extract keywords using NLP techniques
```typescript
const keywords = extractKeywords(content, { 
  maxKeywords: 10,
  minLength: 3 
});
```

### stateUtils

**Location**: `src/utils/stateUtils.ts`

**State Management Patterns**:

#### `createReducer(initialState, actionMap)`
Create Redux-like reducer with action creators
```typescript
const { reducer, actionCreators } = createReducer(initialState, {
  UPDATE_DATA: (state, action) => ({
    ...state,
    data: action.payload
  })
});
```

#### `useEnhancedReducer(reducer, initialState)`
Enhanced useReducer with additional utilities
```typescript
const { state, dispatch, dispatchAction } = useEnhancedReducer(
  reducer, 
  initialState
);
```

#### `immer` object
Immutable state update utilities
```typescript
// Safe nested updates
const newState = immer.setIn(state, 'user.name', 'New Name');

// Array operations
const withItem = immer.addToArray(state, 'items', newItem);
const without = immer.removeFromArray(state, 'items', 
  item => item.id === targetId
);
```

### testUtils

**Location**: `src/utils/testUtils.ts`

**Testing Utilities**:

#### `createMockGraphData(nodeCount, linkDensity)`
Generate mock graph data for testing
```typescript
const mockData = createMockGraphData(50, 0.3);
```

#### `createMockAgentMessages(count)`
Generate mock agent messages
```typescript
const mockMessages = createMockAgentMessages(10);
```

#### `testSetup.setupMockEnvironment()`
Setup test environment with mocks
```typescript
beforeEach(() => {
  testSetup.setupMockEnvironment();
});
```

#### `graphTestUtils`
Graph-specific testing utilities
```typescript
const isValid = graphTestUtils.validateGraphStructure(graphData);
const analysis = graphTestUtils.analyzeConnectivity(graphData);
```

## Component APIs

### GraphVisualization

**Props**:
```typescript
interface GraphVisualizationProps {
  graphData: GraphData;
  selectedNodeId: string | null;
  searchQuery: string;
  darkMode: boolean;
  onNodeClick: (node: NodeObject | null) => void;
  onNodeHover: (node: NodeObject | null) => void;
}
```

### ConceptDesigner

**Props**:
```typescript
interface ConceptDesignerProps {
  conceptState: ConceptDesignState;
  onUpdateConcept: (updates: Partial<ConceptDesignState>) => void;
  onAddComponent: (component: Component) => void;
  darkMode: boolean;
}
```

### AgentConsole

**Props**:
```typescript
interface AgentConsoleProps {
  messages: AgentMessage[];
  onTriggerAgent: (action: AgentAction) => void;
  darkMode: boolean;
}
```

## Error Handling

### ErrorBoundary

**Props**:
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  componentName?: string;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}
```

**Usage**:
```typescript
<ErrorBoundary componentName="MyFeature">
  <MyFeatureComponent />
</ErrorBoundary>
```

## Type Definitions

### Core Types

**Location**: `src/types/`

```typescript
// Graph Data Types
interface GraphData {
  nodes: NodeObject[];
  links: LinkObject[];
}

interface NodeObject {
  id: string;
  name: string;
  type: string;
  group: number;
  content?: string;
  // ... additional properties
}

// Agent Types
interface AgentMessage {
  id: string;
  agentType: string;
  message: string;
  timestamp: Date;
  actions?: AgentAction[];
}

interface AgentAction {
  type: string;
  label: string;
  payload?: any;
}

// Concept Design Types
interface ConceptDesignState {
  objective: string;
  scope: string;
  components: Component[];
  relationships: Relationship[];
  parameters: Parameter[];
  // ... additional properties
}
```

## Constants and Configuration

### WIKI_BROWSER_CONFIG

**Location**: `src/constants.ts`

Configuration for knowledge browser categories:
```typescript
const WIKI_BROWSER_CONFIG = [
  { 
    key: 'mechanisms', 
    label: 'Mechanisms', 
    icon: Brain, 
    file: 'KG/mechanisms.md' 
  },
  // ... additional categories
];
```

## Best Practices

### Hook Usage
- Always use `useStableCallback` for event handlers passed to child components
- Use `useDebouncedValue` for search inputs and frequently changing values
- Implement error boundaries around components that might fail

### Performance
- Use `useStableMemo` for expensive calculations
- Implement virtual scrolling for large datasets
- Debounce user inputs to prevent excessive API calls

### State Management
- Use `useAppState` for global application state
- Use local state for component-specific data
- Implement immutable updates using the `immer` utilities

### Error Handling
- Wrap components in ErrorBoundary for graceful degradation
- Provide user-friendly error messages
- Log errors appropriately for debugging

---

This API reference covers all major public interfaces in the Research Discovery Engine. For implementation details, refer to the source code and comprehensive JSDoc comments throughout the codebase. 