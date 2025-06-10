# Components Documentation

## Overview

This directory contains all React components for the Discovery Engine application. Components are organized by feature area and follow consistent patterns for props, state management, and styling.

## Architecture Principles

### Component Hierarchy

```
App
├── Navbar (navigation and search)
├── BreadcrumbPanel (hierarchical navigation)
├── Main Content Area
│   ├── KnowledgeBrowserSidebar (content navigation)
│   ├── Primary View Component
│   │   ├── GraphVisualization (3D graph display)
│   │   ├── ConceptDesigner (concept design workflow)
│   │   ├── WikiView (knowledge browsing)
│   │   └── NodeView (detailed node information)
│   └── ContextPanel (contextual information)
└── AgentConsole (AI interaction)
```

### Design Patterns

#### Container/Presentational Pattern
- **Container Components**: Handle state and data fetching
- **Presentational Components**: Focus on UI rendering
- **Custom Hooks**: Extract and reuse stateful logic

#### Composition over Inheritance
- Use component composition for flexibility
- Implement render props and children patterns
- Create reusable UI primitives

#### Consistent Props Interface
```typescript
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

interface DataComponentProps<T> extends BaseComponentProps {
  data: T;
  loading?: boolean;
  error?: string | null;
}
```

## Component Categories

### Layout Components

#### App.tsx
**Purpose**: Root application component managing global state and routing
**Key Features**:
- View mode management (graph, concept designer, wiki, node detail)
- State coordination between features
- Keyboard shortcuts and navigation
- Error boundary handling

**Props**: None (root component)
**State**: View mode, selected node, breadcrumbs, search query

#### Navbar.tsx
**Purpose**: Top navigation bar with view switching and search
**Key Features**:
- View mode toggle buttons
- Global search interface
- Agent status indicator
- Theme switching

**Props**:
```typescript
interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  agentActive?: boolean;
}
```

#### BreadcrumbPanel.tsx
**Purpose**: Hierarchical navigation breadcrumbs
**Key Features**:
- Path visualization
- Click-to-navigate functionality
- Overflow handling for long paths

**Props**:
```typescript
interface BreadcrumbPanelProps {
  breadcrumbs: BreadcrumbItem[];
  onBreadcrumbClick: (item: BreadcrumbItem) => void;
  onClear: () => void;
}
```

### Visualization Components

#### GraphVisualization/
**Purpose**: Interactive 3D knowledge graph visualization
**Key Components**:
- `GraphVisualization.tsx` - Main 3D scene container
- `GraphControls.tsx` - Camera and interaction controls

**Key Features**:
- Three.js 3D rendering
- Node selection and highlighting
- Dynamic filtering and search
- Performance optimization for large graphs

**Props**:
```typescript
interface GraphVisualizationProps {
  graphData: GraphData;
  selectedNode: NodeObject | null;
  onNodeSelect: (node: NodeObject) => void;
  searchQuery?: string;
}
```

**Implementation Notes**:
- Uses instanced rendering for performance
- Implements spatial indexing for selection
- Handles responsive canvas sizing
- Provides accessibility fallbacks

### Content Components

#### WikiView/
**Purpose**: Wiki-style knowledge browsing interface
**Key Components**:
- `WikiView.tsx` - Main wiki container
- `WikiContent.tsx` - Markdown content renderer

**Key Features**:
- Hierarchical section navigation
- Markdown content rendering
- Cross-reference link handling
- Search within wiki content

**Props**:
```typescript
interface WikiViewProps {
  currentSection: ParsedSection | null;
  onSectionChange: (section: ParsedSection) => void;
  onNodeSelect: (node: NodeObject) => void;
}
```

#### NodeView/
**Purpose**: Detailed view of individual knowledge nodes
**Key Components**:
- `NodeView.tsx` - Main node container
- `NodeHeader.tsx` - Node title and metadata
- `NodeDescription.tsx` - Content display
- `NodeConnectionsTabs.tsx` - Related nodes and connections
- `NodeMetadataCard.tsx` - Structured metadata display

**Key Features**:
- Comprehensive node information display
- CSS Vector visualization
- Connection exploration
- Edit capabilities

**Props**:
```typescript
interface NodeViewProps {
  node: NodeObject | null;
  graphData: GraphData;
  onNodeSelect: (node: NodeObject) => void;
  onEditNode?: (node: NodeObject) => void;
}
```

### Workflow Components

#### ConceptDesigner/
**Purpose**: Systematic concept design workflow
**Key Components**:
- `ConceptDesigner.tsx` - Main design interface
- `CSSSection.tsx` - CSS Vector field groups
- `CSSField.tsx` - Individual field editors

**Key Features**:
- Step-by-step concept building
- CSS Vector configuration
- AI suggestion integration
- Component selection from graph

**Props**:
```typescript
interface ConceptDesignerProps {
  conceptState: ConceptDesignState;
  graphData: GraphData;
  onObjectiveChange: (objective: string) => void;
  onComponentSelectionChange: (type: ComponentType, ids: string[]) => void;
  onCssFieldChange: (fieldPath: string, value: any) => void;
  onNodeSelect: (node: NodeObject) => void;
}
```

### Communication Components

#### AgentConsole/
**Purpose**: AI agent interaction interface
**Key Components**:
- `AgentConsole.tsx` - Main console interface
- `AgentMessageStream.tsx` - Message display and streaming

**Key Features**:
- Real-time message streaming
- Message history management
- Action button handling
- Context-aware suggestions

**Props**:
```typescript
interface AgentConsoleProps {
  messages: AgentMessage[];
  isStreaming: boolean;
  onSendMessage: (content: string, agentType: AgentType) => void;
  onClearMessages: () => void;
  selectedNode?: NodeObject | null;
  conceptState?: ConceptDesignState;
}
```

### Panel Components

#### ContextPanel/
**Purpose**: Contextual information display
**Key Components**:
- `ContextPanel.tsx` - Main panel container
- `ConceptDetails.tsx` - Concept design information
- `WikiNodeContextDisplay.tsx` - Wiki context display

**Key Features**:
- Context-sensitive content
- Related information display
- Quick action access

**Props**:
```typescript
interface ContextPanelProps {
  selectedNode: NodeObject | null;
  conceptDesignState: ConceptDesignState;
  currentWikiSection: ParsedSection | null;
  agentMessages: AgentMessage[];
  onNodeSelect: (node: NodeObject) => void;
  onInitializeConcept: (node?: NodeObject) => void;
}
```

#### KnowledgeBrowserSidebar.tsx
**Purpose**: Navigation sidebar for knowledge exploration
**Key Features**:
- Hierarchical content browsing
- Search and filtering
- Quick node access
- Bookmark management

**Props**:
```typescript
interface KnowledgeBrowserSidebarProps {
  graphData: GraphData;
  selectedNode: NodeObject | null;
  onNodeSelect: (node: NodeObject) => void;
  onViewModeChange: (mode: ViewMode) => void;
  searchQuery: string;
}
```

## Component Development Guidelines

### Props Design

#### Required vs Optional Props
```typescript
// Good: Clear distinction between required and optional
interface ComponentProps {
  // Required props first
  data: GraphData;
  onAction: (item: string) => void;
  
  // Optional props with defaults
  loading?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}
```

#### Event Handler Naming
```typescript
// Good: Consistent event handler naming
interface ComponentProps {
  onSelect: (item: Item) => void;
  onChange: (value: string) => void;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}
```

### State Management

#### Local State
Use `useState` for component-specific state:
```typescript
const [isExpanded, setIsExpanded] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
```

#### Shared State
Use custom hooks for shared state logic:
```typescript
const { graphData, loading, error } = useGraphData();
const { conceptState, updateConcept } = useConceptDesign();
```

#### Performance Optimization
```typescript
// Memoize expensive calculations
const filteredData = useMemo(() => 
  data.filter(item => item.name.includes(searchTerm)),
  [data, searchTerm]
);

// Memoize event handlers
const handleClick = useCallback((id: string) => {
  onItemSelect(id);
}, [onItemSelect]);

// Memoize component rendering
const ExpensiveComponent = React.memo(({ data }) => {
  // Component implementation
});
```

### Error Handling

#### Error Boundaries
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ComponentErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

#### Async Error Handling
```typescript
const [error, setError] = useState<string | null>(null);

const handleAsyncAction = async () => {
  try {
    setError(null);
    await performAction();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error');
  }
};
```

### Accessibility

#### ARIA Labels and Roles
```typescript
<button
  role="button"
  aria-label="Select node"
  aria-pressed={isSelected}
  onClick={handleClick}
>
  {label}
</button>
```

#### Keyboard Navigation
```typescript
const handleKeyDown = (event: React.KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      handleSelect();
      break;
    case 'Escape':
      handleCancel();
      break;
  }
};
```

#### Focus Management
```typescript
const focusRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  if (shouldFocus) {
    focusRef.current?.focus();
  }
}, [shouldFocus]);
```

### Testing Patterns

#### Component Testing
```typescript
describe('GraphVisualization', () => {
  const mockProps = {
    graphData: { nodes: [], links: [] },
    selectedNode: null,
    onNodeSelect: jest.fn()
  };

  it('renders without crashing', () => {
    render(<GraphVisualization {...mockProps} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('handles node selection', async () => {
    const user = userEvent.setup();
    const onNodeSelect = jest.fn();
    
    render(<GraphVisualization {...mockProps} onNodeSelect={onNodeSelect} />);
    
    await user.click(screen.getByTestId('node-graphene'));
    
    expect(onNodeSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'graphene' })
    );
  });
});
```

#### Hook Testing
```typescript
describe('useGraphData', () => {
  it('loads data successfully', async () => {
    const { result } = renderHook(() => useGraphData());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.graphData).toBeDefined();
  });
});
```

## Common Patterns

### Loading States
```typescript
if (loading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage message={error} />;
}

return <ComponentContent data={data} />;
```

### Conditional Rendering
```typescript
{showAdvanced && (
  <AdvancedOptions
    options={advancedOptions}
    onChange={handleAdvancedChange}
  />
)}
```

### List Rendering
```typescript
{items.map(item => (
  <ItemComponent
    key={item.id}
    item={item}
    selected={selectedId === item.id}
    onSelect={handleItemSelect}
  />
))}
```

### Form Handling
```typescript
const [formData, setFormData] = useState(initialData);

const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
  onSubmit(formData);
};

const handleChange = (field: string, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

## Future Enhancements

### Planned Improvements
- Virtual scrolling for large lists
- Advanced animation system
- Improved accessibility features
- Component library extraction
- Storybook integration

### Performance Optimizations
- Bundle splitting by feature
- Lazy loading for heavy components
- Web Worker integration for processing
- Service Worker for offline capability

### Developer Experience
- Component generator scripts
- Visual regression testing
- Automated accessibility testing
- Performance monitoring integration 