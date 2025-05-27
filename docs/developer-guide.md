# Research Discovery Engine - Developer Guide

This guide provides comprehensive technical information for developers who want to contribute to, extend, or integrate with the Research Discovery Engine (RDE).

## Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Architecture Overview](#architecture-overview)
3. [Codebase Structure](#codebase-structure)
4. [Core Technologies](#core-technologies)
5. [API Reference](#api-reference)
6. [Component Development](#component-development)
7. [Data Models](#data-models)
8. [Testing Framework](#testing-framework)
9. [Deployment](#deployment)
10. [Contributing Guidelines](#contributing-guidelines)

## Development Environment Setup

### Prerequisites

```bash
# Node.js (18+)
node --version  # Should be 18.0 or higher

# npm or yarn
npm --version   # 8.0 or higher

# Python (3.8+) for ResNEI
python --version  # 3.8 or higher

# Git
git --version
```

### Local Development Setup

#### 1. Fork and Clone
```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/your-username/Research-Discovery-Engine.git
cd Research-Discovery-Engine

# Add upstream remote
git remote add upstream https://github.com/original-owner/Research-Discovery-Engine.git
```

#### 2. Install Dependencies
```bash
# Discovery Engine (DE)
cd DE
npm install

# Web Platform
cd ../website_explore_the_unknown
npm install

# Research Processing Engine (ResNEI)
cd ../resnei
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### 3. Development Scripts
```bash
# Discovery Engine - Development server
cd DE
npm run dev        # http://localhost:5173

# Build for production
npm run build

# Linting
npm run lint

# Preview production build
npm run preview
```

### IDE Configuration

#### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "html"
  }
}
```

#### Recommended Extensions
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Auto Rename Tag
- GitLens

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Research Discovery Engine            │
├─────────────────────────────────────────────────────────┤
│  Frontend (React + TypeScript)                         │
│  ├── Discovery Engine (DE/)                            │
│  │   ├── Graph Visualization                           │
│  │   ├── Agent Console                                 │
│  │   ├── Concept Designer                              │
│  │   └── Knowledge Browser                             │
│  │                                                     │
│  └── Web Platform (website_explore_the_unknown/)       │
│      ├── Public Website                                │
│      ├── API Routes                                    │
│      └── Authentication                                │
├─────────────────────────────────────────────────────────┤
│  Backend Services                                       │
│  ├── ResNEI (resnei/)                                  │
│  │   ├── Document Processing                           │
│  │   ├── Knowledge Extraction                          │
│  │   └── Data Management                               │
│  │                                                     │
│  └── Knowledge Graph Engine                            │
│      ├── Graph Database                                │
│      ├── Search Engine                                 │
│      └── AI Agents                                     │
└─────────────────────────────────────────────────────────┘
```

### Component Architecture

#### Discovery Engine (DE/)
- **Technology**: React 18, TypeScript, Vite
- **State Management**: React hooks + Context API
- **Visualization**: 3D Force Graph, D3.js
- **Styling**: Tailwind CSS
- **Build**: Vite with hot reload

#### Web Platform (website_explore_the_unknown/)
- **Technology**: Next.js 14, React Server Components
- **Routing**: App Router
- **API**: Route handlers
- **Styling**: Tailwind CSS + Custom components

#### ResNEI (resnei/)
- **Technology**: Django, Python
- **Database**: PostgreSQL (recommended)
- **Processing**: NLP pipelines, document parsing
- **API**: Django REST Framework

### Data Flow

```
User Input → React Components → State Management → API Calls → Backend Services
     ↓                                                              ↓
Knowledge Graph ← Data Processing ← Document Processing ← External Data
     ↓
Visualization Updates → UI Feedback → User Experience
```

## Codebase Structure

### Discovery Engine (DE/)

```
DE/
├── src/
│   ├── components/           # React components
│   │   ├── GraphVisualization/
│   │   │   ├── GraphVisualization.tsx
│   │   │   ├── GraphControls.tsx
│   │   │   └── ForceGraph3D.tsx
│   │   ├── ConceptDesigner/
│   │   │   ├── ConceptDesigner.tsx
│   │   │   ├── ComponentSelector.tsx
│   │   │   └── DesignValidation.tsx
│   │   ├── AgentConsole/
│   │   │   ├── AgentConsole.tsx
│   │   │   ├── MessageDisplay.tsx
│   │   │   └── AgentActions.tsx
│   │   ├── ContextPanel/
│   │   ├── WikiView/
│   │   ├── NodeView/
│   │   └── Modals/
│   ├── hooks/               # Custom React hooks
│   │   ├── useGraphData.ts
│   │   ├── useConceptDesign.ts
│   │   └── useAgentSystem.ts
│   ├── types/               # TypeScript definitions
│   │   ├── index.ts
│   │   ├── graph.ts
│   │   ├── agents.ts
│   │   └── concepts.ts
│   ├── utils/               # Utility functions
│   │   ├── graphUtils.ts
│   │   ├── markdownParser.ts
│   │   └── dataTransforms.ts
│   ├── api/                 # API integration
│   │   ├── graphApi.ts
│   │   ├── agentApi.ts
│   │   └── documentApi.ts
│   ├── data/                # Static data and samples
│   └── constants.ts         # Application constants
├── KG/                      # Knowledge Graph data
│   ├── mechanisms.md
│   ├── materials.md
│   ├── methods.md
│   └── ...
├── publications/            # Research publications
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### Key Components

#### GraphVisualization Component
```typescript
// src/components/GraphVisualization/GraphVisualization.tsx
interface GraphVisualizationProps {
  data: GraphData;
  selectedNodeId?: string;
  onNodeClick: (node: NodeObject) => void;
  searchQuery: string;
  showLabels: boolean;
  showLinks: boolean;
  enablePhysics: boolean;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  data,
  selectedNodeId,
  onNodeClick,
  searchQuery,
  showLabels,
  showLinks,
  enablePhysics
}) => {
  // Component implementation
};
```

#### ConceptDesigner Component
```typescript
// src/components/ConceptDesigner/ConceptDesigner.tsx
interface ConceptDesignerProps {
  conceptState: ConceptDesignState;
  onUpdateConcept: (updates: Partial<ConceptDesignState>) => void;
  onTriggerAgent: (action: string, payload?: any) => void;
}

const ConceptDesigner: React.FC<ConceptDesignerProps> = ({
  conceptState,
  onUpdateConcept,
  onTriggerAgent
}) => {
  // Component implementation
};
```

#### AgentConsole Component
```typescript
// src/components/AgentConsole/AgentConsole.tsx
interface AgentConsoleProps {
  messages: AgentMessage[];
  onTriggerAgent: (action: string, payload?: any) => void;
}

const AgentConsole: React.FC<AgentConsoleProps> = ({
  messages,
  onTriggerAgent
}) => {
  // Component implementation
};
```

## Core Technologies

### Frontend Stack

#### React 18 with TypeScript
```typescript
// Example component with proper typing
interface ComponentProps {
  data: GraphData;
  onAction: (action: ActionType) => void;
}

const Component: React.FC<ComponentProps> = ({ data, onAction }) => {
  const [state, setState] = useState<StateType>(initialState);
  
  useEffect(() => {
    // Effect logic
  }, [data]);

  return (
    <div className="component-container">
      {/* JSX */}
    </div>
  );
};
```

#### State Management with Custom Hooks
```typescript
// src/hooks/useGraphData.ts
export const useGraphData = () => {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGraphData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchGraphData();
      setGraphData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGraphData();
  }, [loadGraphData]);

  return { graphData, loading, error, setGraphData, reload: loadGraphData };
};
```

#### 3D Visualization with Force Graph
```typescript
// src/components/GraphVisualization/ForceGraph3D.tsx
import ForceGraph3D from '3d-force-graph';

export const ForceGraph3DComponent = ({ data, onNodeClick }) => {
  const fgRef = useRef();

  useEffect(() => {
    const fg = ForceGraph3D()
      .graphData(data)
      .nodeAutoColorBy('type')
      .nodeThreeObject(node => {
        // Custom 3D object rendering
      })
      .onNodeClick(onNodeClick);

    fg(fgRef.current);
  }, [data, onNodeClick]);

  return <div ref={fgRef} />;
};
```

### Backend Technologies

#### Django + Django REST Framework
```python
# resnei/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Document, Concept
from .serializers import DocumentSerializer

class DocumentProcessingView(APIView):
    def post(self, request):
        serializer = DocumentSerializer(data=request.data)
        if serializer.is_valid():
            document = serializer.save()
            # Process document and extract concepts
            concepts = self.extract_concepts(document)
            return Response({'concepts': concepts})
        return Response(serializer.errors, status=400)
```

#### Knowledge Graph Processing
```python
# resnei/knowledge_graph.py
class KnowledgeGraphBuilder:
    def __init__(self):
        self.graph = nx.Graph()
    
    def add_concept(self, concept_data):
        """Add a concept node to the graph"""
        self.graph.add_node(
            concept_data['id'],
            **concept_data['properties']
        )
    
    def add_relationship(self, source_id, target_id, relationship_type):
        """Add a relationship edge between concepts"""
        self.graph.add_edge(
            source_id,
            target_id,
            type=relationship_type
        )
```

## API Reference

### Graph Data API

#### Get Graph Data
```typescript
// GET /api/graph
interface GraphDataResponse {
  nodes: NodeObject[];
  links: LinkObject[];
  metadata: {
    nodeCount: number;
    linkCount: number;
    lastUpdated: string;
  };
}
```

#### Search Graph
```typescript
// POST /api/graph/search
interface SearchRequest {
  query: string;
  filters?: {
    nodeTypes?: string[];
    categories?: string[];
    properties?: Record<string, any>;
  };
  limit?: number;
}

interface SearchResponse {
  results: NodeObject[];
  totalCount: number;
  query: string;
}
```

### Agent System API

#### Trigger Agent Action
```typescript
// POST /api/agents/action
interface AgentActionRequest {
  action: string;
  payload?: any;
  context?: {
    selectedNodeId?: string;
    searchQuery?: string;
    conceptState?: ConceptDesignState;
  };
}

interface AgentActionResponse {
  messages: AgentMessage[];
  updates?: {
    graphData?: Partial<GraphData>;
    conceptState?: Partial<ConceptDesignState>;
  };
}
```

### Document Processing API

#### Upload Document
```typescript
// POST /api/documents/upload
interface DocumentUploadRequest {
  file: File;
  metadata?: {
    title?: string;
    authors?: string[];
    year?: number;
  };
}

interface DocumentUploadResponse {
  documentId: string;
  status: 'processing' | 'completed' | 'failed';
  extractedConcepts?: ConceptData[];
}
```

## Component Development

### Creating New Components

#### 1. Component Structure
```typescript
// src/components/NewComponent/NewComponent.tsx
import React, { useState, useEffect } from 'react';
import { ComponentProps } from './types';
import './NewComponent.css';

const NewComponent: React.FC<ComponentProps> = ({ 
  prop1, 
  prop2, 
  onAction 
}) => {
  const [localState, setLocalState] = useState(initialValue);

  useEffect(() => {
    // Setup effect
    return () => {
      // Cleanup
    };
  }, []);

  const handleAction = () => {
    // Handle user action
    onAction(actionData);
  };

  return (
    <div className="new-component">
      {/* Component JSX */}
    </div>
  );
};

export default NewComponent;
```

#### 2. Type Definitions
```typescript
// src/components/NewComponent/types.ts
export interface ComponentProps {
  prop1: string;
  prop2: number;
  onAction: (data: ActionData) => void;
}

export interface ActionData {
  type: string;
  payload: any;
}
```

#### 3. Styling with Tailwind
```typescript
// Use Tailwind classes for consistent styling
const Component = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
      Component Title
    </h2>
    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
      Action Button
    </button>
  </div>
);
```

### Component Guidelines

#### State Management
- Use local state for component-specific data
- Use custom hooks for shared state logic
- Lift state up when needed by multiple components
- Consider context for deeply nested prop passing

#### Performance Optimization
```typescript
// Use React.memo for expensive renders
const ExpensiveComponent = React.memo<Props>(({ data }) => {
  return <ComplexVisualization data={data} />;
});

// Use useMemo for expensive calculations
const processedData = useMemo(() => {
  return expensiveDataTransformation(rawData);
}, [rawData]);

// Use useCallback for stable function references
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);
```

#### Accessibility
```typescript
// Include proper ARIA attributes
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  onClick={handleClose}
>
  <CloseIcon />
</button>

// Use semantic HTML
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/explore">Explore</a></li>
    <li><a href="/create">Create</a></li>
  </ul>
</nav>
```

## Data Models

### Core Data Types

#### Node Object
```typescript
export interface NodeObject {
  id: string;
  type: NodeType;
  label?: string;
  description?: string;
  properties?: Record<string, any>;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  metadata?: {
    source?: string;
    confidence?: number;
    created?: string;
    updated?: string;
  };
}

export type NodeType = 
  | 'MaterialNode'
  | 'MechanismNode'
  | 'MethodNode'
  | 'PhenomenonNode'
  | 'ApplicationNode'
  | 'TheoreticalNode'
  | 'DocumentationNode'
  | 'KnowledgeArtifactNode';
```

#### Link Object
```typescript
export interface LinkObject {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  weight?: number;
  properties?: Record<string, any>;
  metadata?: {
    confidence?: number;
    source?: string;
    created?: string;
  };
}

export type RelationshipType =
  | 'enables'
  | 'inhibits'
  | 'composed-of'
  | 'similar-to'
  | 'applied-in'
  | 'uses'
  | 'produces';
```

#### Graph Data
```typescript
export interface GraphData {
  nodes: NodeObject[];
  links: LinkObject[];
  metadata?: {
    version: string;
    lastUpdated: string;
    nodeCount: number;
    linkCount: number;
  };
}
```

#### Agent Message
```typescript
export interface AgentMessage {
  id: string;
  sourceAgent: AgentType;
  type: MessageType;
  content: string;
  timestamp: number;
  action?: {
    type: string;
    label: string;
    payload: any;
  };
  relatedNodeIds?: string[];
}

export type AgentType =
  | 'Discovery Engine'
  | 'Search Agent'
  | 'Exploration Agent'
  | 'Protocol Agent'
  | 'Consistency Agent'
  | 'ConceptAgent'
  | 'Orchestration Agent'
  | 'Analogy Agent'
  | 'Nexus Weaver'
  | 'Research Assistant';

export type MessageType = 
  | 'info'
  | 'suggestion'
  | 'warning'
  | 'opportunity'
  | 'error';
```

#### Concept Design State
```typescript
export interface ConceptDesignState {
  id: string;
  objective: string;
  status: ConceptStatus;
  components: {
    materials: string[];
    mechanisms: string[];
    methods: string[];
    applications: string[];
    phenomena: string[];
  };
  cssFields: Record<string, any>;
  protocolOutline?: string;
  fieldSuggestions: Record<string, string[]>;
  metadata: {
    created: string;
    updated: string;
    version: number;
  };
}

export type ConceptStatus = 
  | 'Draft'
  | 'Proposed'
  | 'Validated'
  | 'Protocol Ready'
  | 'Ready for Implementation';
```

### Data Validation

#### Schema Validation
```typescript
import { z } from 'zod';

const NodeSchema = z.object({
  id: z.string(),
  type: z.enum(['MaterialNode', 'MechanismNode', /* ... */]),
  label: z.string().optional(),
  description: z.string().optional(),
  properties: z.record(z.any()).optional(),
});

const validateNode = (node: unknown): NodeObject => {
  return NodeSchema.parse(node);
};
```

#### Runtime Type Checking
```typescript
export const isNodeObject = (obj: any): obj is NodeObject => {
  return obj && typeof obj.id === 'string' && typeof obj.type === 'string';
};

export const isLinkObject = (obj: any): obj is LinkObject => {
  return obj && 
         typeof obj.source === 'string' && 
         typeof obj.target === 'string';
};
```

## Testing Framework

### Unit Testing with Vitest

#### Setup
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

#### Component Testing
```typescript
// src/components/GraphVisualization/GraphVisualization.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GraphVisualization from './GraphVisualization';

describe('GraphVisualization', () => {
  const mockData = {
    nodes: [{ id: 'node1', type: 'MaterialNode', label: 'Test Node' }],
    links: []
  };

  it('renders without crashing', () => {
    render(
      <GraphVisualization 
        data={mockData}
        onNodeClick={vi.fn()}
        searchQuery=""
        showLabels={true}
        showLinks={true}
        enablePhysics={true}
      />
    );
    expect(screen.getByRole('application')).toBeInTheDocument();
  });

  it('calls onNodeClick when node is clicked', () => {
    const handleNodeClick = vi.fn();
    render(
      <GraphVisualization 
        data={mockData}
        onNodeClick={handleNodeClick}
        searchQuery=""
        showLabels={true}
        showLinks={true}
        enablePhysics={true}
      />
    );
    
    // Test node click behavior
    // Implementation depends on 3D graph component
  });
});
```

#### Hook Testing
```typescript
// src/hooks/useGraphData.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useGraphData } from './useGraphData';

// Mock API
vi.mock('../api/graphApi', () => ({
  fetchGraphData: vi.fn().mockResolvedValue({
    nodes: [],
    links: []
  })
}));

describe('useGraphData', () => {
  it('loads graph data on mount', async () => {
    const { result } = renderHook(() => useGraphData());
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.graphData).toBeDefined();
  });
});
```

### Integration Testing

#### API Integration Tests
```typescript
// src/api/graphApi.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { fetchGraphData, searchGraph } from './graphApi';

const server = setupServer(
  rest.get('/api/graph', (req, res, ctx) => {
    return res(ctx.json({
      nodes: [],
      links: [],
      metadata: { nodeCount: 0, linkCount: 0 }
    }));
  })
);

beforeEach(() => server.listen());
afterEach(() => server.resetHandlers());

describe('Graph API', () => {
  it('fetches graph data successfully', async () => {
    const data = await fetchGraphData();
    expect(data).toHaveProperty('nodes');
    expect(data).toHaveProperty('links');
  });
});
```

### End-to-End Testing with Playwright

#### E2E Test Setup
```typescript
// tests/e2e/graph-exploration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Graph Exploration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display the knowledge graph', async ({ page }) => {
    await expect(page.locator('[data-testid="graph-container"]')).toBeVisible();
  });

  test('should search for concepts', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', 'polymer');
    await page.press('[data-testid="search-input"]', 'Enter');
    
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
  });

  test('should switch to create mode', async ({ page }) => {
    await page.click('[data-testid="create-mode-button"]');
    await expect(page.locator('[data-testid="concept-designer"]')).toBeVisible();
  });
});
```

## Deployment

### Development Deployment

#### Local Development
```bash
# Start all services in development mode
npm run dev:all

# Or start individually
cd DE && npm run dev              # Frontend
cd website_explore_the_unknown && npm run dev  # Web platform
cd resnei && python manage.py runserver        # Backend
```

### Production Deployment

#### Docker Deployment
```dockerfile
# Dockerfile for Discovery Engine
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./DE
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
  
  backend:
    build: ./resnei
    ports:
      - "8000:8000"
    environment:
      - DJANGO_SETTINGS_MODULE=resnei.settings.production
    depends_on:
      - db
  
  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=resnei
      - POSTGRES_USER=resnei
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### Cloud Deployment (Vercel/Railway)
```bash
# Deploy frontend to Vercel
cd DE
vercel --prod

# Deploy backend to Railway
cd resnei
railway login
railway deploy
```

### Environment Configuration

#### Environment Variables
```bash
# .env.local (Frontend)
VITE_API_BASE_URL=https://api.research-discovery-engine.org
VITE_GRAPH_WS_URL=wss://api.research-discovery-engine.org/ws
VITE_ENABLE_ANALYTICS=true

# .env (Backend)
DATABASE_URL=postgresql://user:pass@localhost:5432/resnei
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com
```

## Contributing Guidelines

### Development Workflow

#### 1. Issue Creation
```markdown
# Bug Report Template
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior.

**Expected behavior**
What you expected to happen.

**Environment**
- OS: [e.g. Windows, macOS, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 1.0.0]
```

#### 2. Branch Naming
```bash
# Feature branches
git checkout -b feature/graph-search-improvements

# Bug fix branches
git checkout -b bugfix/agent-console-rendering

# Documentation branches
git checkout -b docs/api-reference-update
```

#### 3. Commit Messages
```bash
# Follow conventional commits
git commit -m "feat(graph): add semantic search functionality"
git commit -m "fix(agents): resolve message ordering issue"
git commit -m "docs(readme): update installation instructions"
```

#### 4. Pull Request Process
```markdown
# PR Template
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots
Include screenshots for UI changes
```

### Code Quality Standards

#### TypeScript Guidelines
```typescript
// Use explicit types
interface ComponentProps {
  data: GraphData;
  onAction: (action: ActionType) => void;
}

// Avoid 'any' type
const processData = (data: unknown): ProcessedData => {
  // Type guards and validation
  if (isValidData(data)) {
    return transformData(data);
  }
  throw new Error('Invalid data format');
};

// Use proper error handling
const fetchData = async (): Promise<Result<Data, Error>> => {
  try {
    const response = await api.getData();
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error };
  }
};
```

#### React Best Practices
```typescript
// Use proper component composition
const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="container">{children}</div>
);

// Proper prop drilling solutions
const useGraphContext = () => {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraphContext must be used within GraphProvider');
  }
  return context;
};

// Proper cleanup
useEffect(() => {
  const subscription = observable.subscribe(handler);
  return () => subscription.unsubscribe();
}, []);
```

### Documentation Standards

#### Code Documentation
```typescript
/**
 * Processes graph data to extract semantic relationships
 * @param graphData - The raw graph data to process
 * @param options - Processing options
 * @returns Processed graph with enhanced relationships
 * @throws {Error} When graph data is invalid
 */
export const processGraphData = (
  graphData: RawGraphData,
  options: ProcessingOptions = {}
): ProcessedGraphData => {
  // Implementation
};
```

#### Component Documentation
```typescript
/**
 * Interactive 3D knowledge graph visualization component
 * 
 * @example
 * ```tsx
 * <GraphVisualization
 *   data={graphData}
 *   onNodeClick={handleNodeClick}
 *   searchQuery="polymer"
 *   showLabels={true}
 * />
 * ```
 */
export const GraphVisualization: React.FC<GraphVisualizationProps> = (props) => {
  // Component implementation
};
```

This developer guide provides the technical foundation for contributing to the Research Discovery Engine. For additional support, please refer to the [API Reference](api-reference.md) or reach out to the development team. 