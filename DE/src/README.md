# Discovery Engine Frontend - Source Code Documentation

## Overview

The Discovery Engine is a React-based knowledge graph visualization and concept design application built with TypeScript, Vite, and Three.js. It enables researchers to explore scientific knowledge graphs, design new concepts, and generate experimental protocols through AI-powered assistance.

## Architecture Overview

The application follows a modular React architecture with clear separation of concerns:

```
src/
├── components/          # React UI components organized by feature
├── hooks/              # Custom React hooks for state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
├── api/                # API client and data fetching
├── data/               # Static data and constants
└── App.tsx             # Main application entry point
```

## Core Concepts

### Knowledge Graph
- **Nodes**: Represent concepts, materials, mechanisms, methods, etc.
- **Links**: Relationships between nodes (categorizes, related-to, etc.)
- **CNM (Conceptual Nexus Model)**: The underlying data model for knowledge representation

### Operating Modes
1. **Explore Mode**: Navigate and visualize the knowledge graph
2. **Create Mode**: Design new concepts using existing knowledge components

### CSS Vector
A structured data model (Conceptual System Schema) that captures:
- Context (materials, environment, energy sources)
- State (basis, dimensionality, determinism)
- Interface (input/output mechanisms)
- Dynamics (computational processes)
- Memory (storage mechanisms)
- Adaptation (learning capabilities)
- Constraints (physical limitations)
- Interactions (coupling patterns)
- Hierarchy (multi-scale organization)

## Key Components

### Main Application (`App.tsx`)
Central orchestrator managing:
- Application state and mode switching
- Agent communication and message handling
- Node selection and navigation
- Search functionality

### Graph Visualization (`components/GraphVisualization/`)
- **GraphVisualization.tsx**: 3D force-directed graph using Three.js
- **GraphControls.tsx**: Interactive controls for graph display options

### Agent Console (`components/AgentConsole/`)
- **AgentConsole.tsx**: AI agent interaction interface
- **AgentMessageStream.tsx**: Real-time message display from AI agents

### Concept Designer (`components/ConceptDesigner/`)
- **ConceptDesigner.tsx**: Interface for creating new concepts
- **CSSField.tsx**: Editable fields for CSS vector properties
- **CSSSection.tsx**: Grouped sections of related CSS fields

### Context Panel (`components/ContextPanel/`)
- **ContextPanel.tsx**: Side panel showing detailed information
- **ConceptDetails.tsx**: Detailed view of concept designs
- **WikiNodeContextDisplay.tsx**: Context for wiki-based nodes

### Node Visualization (`components/NodeView/`)
Detailed view components for individual nodes:
- **NodeView.tsx**: Main node display component
- **NodeDescription.tsx**: Markdown-rendered descriptions
- **NodeConnectionsTabs.tsx**: Related nodes and connections

## Data Flow

1. **Graph Data Loading**: `useGraphData` hook loads CNM from markdown files
2. **Node Selection**: User clicks trigger `onNodeSelect` callbacks
3. **Agent Actions**: User interactions trigger `onTriggerAgent` with specific actions
4. **State Updates**: Hooks manage local state while App.tsx orchestrates global state
5. **UI Updates**: React re-renders components based on state changes

## API Integration

The application communicates with a backend API through:
- **graphAPI.ts**: RESTful API client with comprehensive error handling
- **Types**: Strongly typed request/response interfaces
- **Real-time**: WebSocket connections for agent communications (planned)

## Styling and Theming

- **Tailwind CSS**: Utility-first CSS framework
- **Dark/Light Mode**: Application-wide theme switching
- **Responsive Design**: Mobile-friendly layouts
- **Custom CSS**: Specialized styles in `index.css` for wiki content

## Development Guidelines

### Component Structure
```typescript
interface ComponentProps {
  // Props with clear documentation
}

/**
 * Component description
 * @param props - Documented parameters
 * @returns JSX element
 */
const Component: React.FC<ComponentProps> = ({ props }) => {
  // Implementation
};
```

### State Management
- Use custom hooks for complex state logic
- Props drilling for simple parent-child communication
- Context for theme and global settings

### Error Handling
- Try-catch blocks for API calls
- Graceful degradation for missing data
- User-friendly error messages through agent system

## Testing Strategy

### Recommended Test Structure
```
src/
├── __tests__/          # Test files
│   ├── components/     # Component tests
│   ├── hooks/          # Hook tests
│   ├── utils/          # Utility tests
│   └── integration/    # Integration tests
└── test-utils/         # Test utilities and setup
```

### Testing Approaches
- **Unit Tests**: Individual functions and components
- **Integration Tests**: Component interactions
- **E2E Tests**: Complete user workflows
- **Visual Regression**: Graph visualization consistency

## Performance Considerations

### Graph Rendering
- Efficient node filtering and clustering
- Level-of-detail rendering for large graphs
- WebGL acceleration through Three.js

### Memory Management
- Memoization for expensive computations
- Lazy loading of large datasets
- Proper cleanup of event listeners

## Contributing

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Semantic commit messages

### Component Guidelines
- Single responsibility principle
- Proper prop typing
- Comprehensive JSDoc comments
- Error boundary wrapping for complex components

## Key Dependencies

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Three.js**: 3D graphics rendering
- **D3**: Force simulation algorithms
- **React Markdown**: Content rendering
- **Tailwind CSS**: Styling framework
- **Vite**: Build tool and development server

## Environment Variables

```
VITE_API_BASE_URL=http://localhost:8000/api  # Backend API endpoint
```

## Known Limitations

1. Large graphs (>1000 nodes) may impact performance
2. Mobile experience needs optimization for touch interactions
3. Offline mode not currently supported
4. Limited undo/redo functionality in concept designer

## Future Enhancements

- Real-time collaborative editing
- Advanced graph analytics
- Machine learning-powered suggestions
- Export capabilities for protocols and concepts
- Integration with external research databases 