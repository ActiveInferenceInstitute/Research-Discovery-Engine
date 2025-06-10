# Discovery Engine - Development Guide

## Overview

The Discovery Engine is a React-based application for exploring and designing with scientific knowledge graphs. It provides an integrated environment for visualizing complex research networks, designing new concepts, and generating experimental protocols with AI assistance.

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Discovery Engine                          │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React + TypeScript)                              │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │ Graph Viz       │ │ Concept Design  │ │ Knowledge Wiki  │ │
│  │ (Three.js)      │ │ (CSS Framework) │ │ (Markdown)      │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ AI Agent Console (Real-time Communication)             │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Backend Services (Future Integration)                      │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │ Graph Database  │ │ AI Agents       │ │ Protocol Gen    │ │
│  │ (Neo4j/GraphQL) │ │ (LLM Services)  │ │ (Templates)     │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend
- **React 18** - UI framework with concurrent features
- **TypeScript** - Type safety and development experience
- **Three.js** - 3D graph visualization
- **Vite** - Fast development build tool
- **TailwindCSS** - Utility-first styling
- **Lodash** - Utility functions for data manipulation

#### Data Management
- **Custom React Hooks** - State management and data flow
- **Markdown Parser** - Knowledge content processing
- **Local Storage** - Client-side data persistence

#### Development Tools
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing

## Project Structure

```
DE/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── AgentConsole/   # AI interaction interface
│   │   ├── ConceptDesigner/# Concept design workflow
│   │   ├── ContextPanel/   # Contextual information display
│   │   ├── GraphVisualization/ # 3D graph rendering
│   │   ├── NodeView/       # Detailed node information
│   │   └── WikiView/       # Knowledge browsing interface
│   ├── hooks/              # Custom React hooks
│   │   ├── useGraphData.ts # Graph data management
│   │   ├── useConceptDesign.ts # Concept workflow
│   │   └── useAgentInteraction.ts # AI communication
│   ├── types/              # TypeScript definitions
│   │   ├── index.ts        # Core types
│   │   └── css.ts          # CSS Vector schema
│   ├── utils/              # Utility functions
│   │   ├── graphUtils.ts   # Graph manipulation
│   │   ├── markdownParser.ts # Content parsing
│   │   └── cnmBuilder.ts   # Graph construction
│   ├── api/                # API client code
│   ├── data/               # Static data and fixtures
│   └── __tests__/          # Test suites
├── docs/                   # Documentation
└── package.json
```

## Key Concepts

### Knowledge Graph Structure

The application uses a node-link graph structure where:

- **Nodes** represent knowledge entities (Materials, Mechanisms, Methods, etc.)
- **Links** represent relationships between entities
- **Node Types** follow the Core-Category-User taxonomy
- **CSS Vectors** provide systematic description framework

### Conceptual System Schema (CSS)

The CSS framework provides structured description of systems across nine dimensions:

1. **Context** - Environmental and material context
2. **State** - System state variables and representations
3. **Interface** - Input/output mechanisms
4. **Dynamics** - Temporal behavior and processes
5. **Memory** - Information storage and retrieval
6. **Adaptation** - Learning and plasticity mechanisms
7. **Constraints** - Limitations and boundaries
8. **Interactions** - Multi-system relationships
9. **Hierarchy** - Organizational levels and emergence

### View Modes

The application supports four primary view modes:

1. **Graph View** - Interactive 3D visualization of the knowledge network
2. **Concept Designer** - Systematic design of new research concepts
3. **Wiki View** - Hierarchical browsing of knowledge content
4. **Node Detail** - Deep exploration of individual knowledge entities

## Development Workflow

### Setting Up Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd Research-Discovery-Engine/DE

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Code Style and Standards

#### TypeScript Guidelines

- Use strict type checking
- Prefer interfaces over types for object shapes
- Use proper JSDoc comments for public APIs
- Avoid `any` types - use proper typing or `unknown`

```typescript
// Good
interface NodeData {
  id: string;
  type: NodeType;
  label?: string;
}

// Avoid
const nodeData: any = { ... };
```

#### Component Guidelines

- Use functional components with hooks
- Prefer named exports over default exports
- Keep components focused and single-purpose
- Use proper prop typing

```typescript
// Good
interface GraphVisualizationProps {
  graphData: GraphData;
  selectedNode: NodeObject | null;
  onNodeSelect: (node: NodeObject) => void;
}

export const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  graphData,
  selectedNode,
  onNodeSelect
}) => {
  // Component implementation
};
```

#### Hook Guidelines

- Start hook names with `use`
- Return objects with named properties
- Include comprehensive JSDoc documentation
- Handle loading and error states

```typescript
export const useGraphData = () => {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Implementation...

  return { graphData, loading, error, setGraphData };
};
```

### Testing Strategy

#### Unit Tests
- Test individual functions and components in isolation
- Mock external dependencies
- Achieve high code coverage (>90% for utilities)

#### Integration Tests
- Test component interactions
- Test data flow between hooks
- Test user workflows

#### Component Testing Pattern

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { GraphVisualization } from '../GraphVisualization';

describe('GraphVisualization', () => {
  const mockProps = {
    graphData: { nodes: [], links: [] },
    selectedNode: null,
    onNodeSelect: jest.fn()
  };

  it('should render without crashing', () => {
    render(<GraphVisualization {...mockProps} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('should handle node selection', () => {
    const onNodeSelect = jest.fn();
    render(<GraphVisualization {...mockProps} onNodeSelect={onNodeSelect} />);
    
    // Simulate node click
    fireEvent.click(screen.getByTestId('node-graphene'));
    
    expect(onNodeSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'graphene' })
    );
  });
});
```

### Performance Considerations

#### Graph Visualization
- Use instanced rendering for large node sets
- Implement level-of-detail (LOD) for complex scenes
- Debounce user interactions
- Use Web Workers for heavy computations

#### React Optimization
- Use `React.memo` for expensive components
- Implement proper dependency arrays in hooks
- Avoid inline object creation in render methods
- Use `useCallback` and `useMemo` appropriately

#### Data Management
- Implement virtual scrolling for large lists
- Cache computed values with `useMemo`
- Batch state updates when possible
- Use proper key props for list rendering

## API Integration

### Graph Data API

The application expects graph data in the following format:

```typescript
interface GraphData {
  nodes: NodeObject[];
  links: LinkObject[];
}

interface NodeObject {
  id: string;
  type: NodeType;
  label?: string;
  description?: string;
  cssVector?: Partial<CSSVector>;
  // ... other properties
}

interface LinkObject {
  source: string;
  target: string;
  type: EdgeType;
  justification?: string;
}
```

### Agent Communication

AI agents communicate through a message-based interface:

```typescript
interface AgentMessage {
  id: string;
  sourceAgent: string;
  type: 'info' | 'suggestion' | 'warning' | 'error';
  content: string;
  timestamp: number;
  action?: {
    type: string;
    label?: string;
    payload?: any;
  };
}
```

## Deployment

### Build Process

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Environment Configuration

Create environment files for different deployment stages:

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3001
VITE_ENABLE_DEBUG=true

# .env.production
VITE_API_BASE_URL=https://api.discovery-engine.com
VITE_ENABLE_DEBUG=false
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Troubleshooting

### Common Issues

#### Graph Rendering Problems
- Check WebGL support in browser
- Verify Three.js version compatibility
- Monitor browser performance tools

#### State Management Issues
- Use React DevTools to inspect state
- Check hook dependency arrays
- Verify proper cleanup in useEffect

#### TypeScript Errors
- Ensure proper type imports
- Check for circular dependencies
- Verify version compatibility

#### Performance Issues
- Profile with React DevTools Profiler
- Check for unnecessary re-renders
- Monitor memory usage in DevTools

### Debug Tools

#### React DevTools
- Install browser extension
- Use Profiler tab for performance analysis
- Inspect component props and state

#### Three.js Inspector
- Use browser DevTools for WebGL debugging
- Monitor rendering performance
- Check geometry and material usage

## Contributing

### Git Workflow

1. Create feature branch from `main`
2. Implement changes with tests
3. Run full test suite
4. Submit pull request with description
5. Address review feedback
6. Merge after approval

### Code Review Checklist

- [ ] All tests pass
- [ ] Type checking passes
- [ ] Code follows style guidelines
- [ ] Components are properly documented
- [ ] Performance impact considered
- [ ] Accessibility requirements met
- [ ] Browser compatibility verified

### Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release tag
4. Deploy to production
5. Monitor for issues

## Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Three.js Documentation](https://threejs.org/docs)
- [Vite Guide](https://vitejs.dev/guide)

### Learning Resources
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [TypeScript Best Practices](https://typescript-eslint.io/docs/linting/troubleshooting)
- [Performance Optimization](https://web.dev/performance)

### Community
- [GitHub Issues](./issues) - Bug reports and feature requests
- [Discussions](./discussions) - General questions and ideas
- [Wiki](./wiki) - Additional documentation and guides 