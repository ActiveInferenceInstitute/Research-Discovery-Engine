# Research Discovery Engine - Development Guide

## Overview

This guide provides comprehensive information for developers working with the Research Discovery Engine. The platform has undergone extensive refactoring to establish professional standards, modular architecture, and comprehensive documentation.

## 🛠️ Development Environment Setup

### Prerequisites
- **Node.js**: Version 16 or higher
- **npm**: Latest version (comes with Node.js)
- **TypeScript**: Included in project dependencies
- **Git**: For version control
- **Modern Browser**: Chrome, Firefox, Safari, or Edge with WebGL support

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/ActiveInferenceInstitute/Research-Discovery-Engine.git
cd Research-Discovery-Engine

# Navigate to the application directory
cd DE

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands
```bash
# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

## 🏗️ Architecture Overview

### Project Structure
```
DE/
├── src/
│   ├── components/          # React components
│   │   ├── ErrorBoundary/   # Error handling components
│   │   ├── GraphVisualization/ # 3D graph components
│   │   ├── Layout/          # Layout components
│   │   └── ...              # Feature-specific components
│   ├── hooks/               # Custom React hooks
│   │   ├── useAppState.ts   # Centralized state management
│   │   ├── useGraphData.ts  # Graph data management
│   │   └── useConceptDesign.ts # Concept design workflow
│   ├── services/            # Business logic services
│   │   └── AgentService.ts  # AI agent simulation
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   │   ├── commonUtils.ts   # General utilities
│   │   ├── performanceUtils.ts # Performance optimizations
│   │   ├── dataTransformUtils.ts # Data processing
│   │   ├── stateUtils.ts    # State management patterns
│   │   └── testUtils.ts     # Testing utilities
│   └── data/                # Static data and configurations
├── docs/                    # Documentation
└── public/                  # Static assets
```

### Key Architecture Principles

1. **Modular Design**: Each component has a single responsibility
2. **Centralized State**: Using `useAppState` hook for global state
3. **Service Layer**: Business logic separated from UI components
4. **Error Boundaries**: Comprehensive error handling at component level
5. **Performance First**: Optimized rendering and data processing
6. **Type Safety**: Strict TypeScript throughout codebase

## 📋 Coding Standards

### Following .cursorrules

The project follows comprehensive coding standards defined in `.cursorrules`. Key principles:

- **Professional**: Clean, well-structured code
- **Functional**: Focus on functionality and user experience
- **Intelligent**: Smart architectural decisions
- **Modular**: Reusable, composable components
- **Documented**: Comprehensive JSDoc for all public functions

### TypeScript Standards
```typescript
/**
 * Example of proper function documentation
 * 
 * @param data - The graph data to process
 * @param options - Processing options
 * @returns Processed graph data with statistics
 * @example
 * const result = processGraphData(data, { enableValidation: true });
 */
export const processGraphData = (
  data: GraphData,
  options: ProcessingOptions = {}
): ProcessedGraphData => {
  // Implementation
};
```

### Component Standards
```typescript
/**
 * Component documentation with comprehensive prop descriptions
 */
interface ComponentProps {
  /** Whether dark mode is enabled */
  darkMode: boolean;
  /** Callback function when node is selected */
  onNodeSelect: (node: NodeObject | null) => void;
}

const MyComponent: React.FC<ComponentProps> = ({ darkMode, onNodeSelect }) => {
  // Implementation with error boundaries and performance optimization
};
```

## 🔧 Utility System

### Common Utilities (`commonUtils.ts`)
Essential functions for everyday development:

```typescript
import { debounce, throttle, deepClone, formatBytes } from '../utils/commonUtils';

// Debounce expensive operations
const debouncedSearch = debounce(performSearch, 300);

// Throttle high-frequency events
const throttledScroll = throttle(handleScroll, 100);

// Deep clone objects safely
const clonedData = deepClone(originalData);
```

### Performance Utilities (`performanceUtils.ts`)
React performance optimizations:

```typescript
import { useStableMemo, useStableCallback, useDebouncedValue } from '../utils/performanceUtils';

const MyComponent = () => {
  // Stable memoization
  const expensiveValue = useStableMemo(() => 
    performExpensiveCalculation(data), [data]
  );
  
  // Stable callbacks
  const handleClick = useStableCallback(
    () => handleAction(data), [data]
  );
  
  // Debounced values
  const debouncedQuery = useDebouncedValue(searchQuery, 300);
};
```

### Data Transform Utilities (`dataTransformUtils.ts`)
Graph and data processing:

```typescript
import { filterGraphBySearch, calculateGraphStats } from '../utils/dataTransformUtils';

// Filter graph data with search
const { filteredData, highlights } = filterGraphBySearch(
  graphData, 
  searchQuery
);

// Calculate graph statistics
const stats = calculateGraphStats(graphData);
```

## 🎣 Hooks System

### Central State Management (`useAppState`)
```typescript
import { useAppState } from '../hooks/useAppState';

const MyComponent = () => {
  const {
    state,           // Application state
    actions,         // Action creators
    graphData,       // Graph data
    graphLoading,    // Loading state
    graphError       // Error state
  } = useAppState();
  
  // Use centralized actions
  const handleNodeClick = (node) => {
    actions.handleNodeSelect(node);
  };
};
```

### Graph Data Management (`useGraphData`)
```typescript
import { useGraphData } from '../hooks/useGraphData';

const GraphComponent = () => {
  const { 
    graphData, 
    loading, 
    error, 
    setGraphData 
  } = useGraphData();
  
  // Graph data is automatically loaded and managed
};
```

## 🛡️ Error Handling

### Error Boundaries
Wrap components in error boundaries for graceful degradation:

```typescript
import ErrorBoundary from '../components/ErrorBoundary';

<ErrorBoundary componentName="MyFeature">
  <MyFeatureComponent />
</ErrorBoundary>
```

### Error Handling Patterns
```typescript
// Service layer error handling
const myService = {
  async performAction(data: any) {
    try {
      const result = await riskyOperation(data);
      return { success: true, data: result };
    } catch (error) {
      console.error('Service error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
};
```

## 🧪 Testing

### Testing Utilities
Use the comprehensive testing utilities:

```typescript
import { 
  createMockGraphData, 
  createMockAgentMessages,
  graphTestUtils,
  testSetup 
} from '../utils/testUtils';

describe('MyComponent', () => {
  beforeEach(() => {
    testSetup.setupMockEnvironment();
  });
  
  afterEach(() => {
    testSetup.cleanup();
  });
  
  it('should handle graph data correctly', () => {
    const mockData = createMockGraphData(10, 0.3);
    const isValid = graphTestUtils.validateGraphStructure(mockData);
    expect(isValid).toBe(true);
  });
});
```

### Mock Data Generation
```typescript
// Generate test data
const mockGraphData = createMockGraphData(
  nodeCount: 50,     // Number of nodes
  linkDensity: 0.2   // Link density (0-1)
);

const mockMessages = createMockAgentMessages(10);
const mockConceptState = createMockConceptDesignState({
  objective: 'Test concept'
});
```

## 🎨 Component Development

### Component Template
```typescript
/**
 * Component Description
 * 
 * Detailed description of what this component does,
 * its responsibilities, and how it fits into the larger system.
 */

import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { useStableCallback } from '../../utils/performanceUtils';

interface MyComponentProps {
  /** Prop description */
  darkMode: boolean;
  /** Callback description */
  onAction: (data: any) => void;
}

/**
 * MyComponent - Brief description
 * 
 * @param props - Component props
 * @returns JSX element
 */
const MyComponent: React.FC<MyComponentProps> = ({ 
  darkMode, 
  onAction 
}) => {
  // Stable callbacks for performance
  const handleAction = useStableCallback(
    (data: any) => onAction(data),
    [onAction]
  );
  
  return (
    <ErrorBoundary componentName="MyComponent">
      <div className={`component-container ${
        darkMode ? 'dark' : 'light'
      }`}>
        {/* Component content */}
      </div>
    </ErrorBoundary>
  );
};

export default MyComponent;
```

### Service Development
```typescript
/**
 * Service Description
 * 
 * Business logic service that handles specific domain operations.
 */

export interface MyServiceInterface {
  performAction(data: any): Promise<ServiceResult>;
}

export interface ServiceResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Creates an instance of MyService
 * 
 * @param dependencies - Service dependencies
 * @returns Service instance
 */
export const createMyService = (
  dependencies: ServiceDependencies
): MyServiceInterface => {
  return {
    async performAction(data: any): Promise<ServiceResult> {
      try {
        // Business logic here
        return { success: true, data: result };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    }
  };
};
```

## 🎯 Performance Guidelines

### Rendering Optimization
- Use `useStableMemo` for expensive calculations
- Use `useStableCallback` for callback functions
- Implement `useDebouncedValue` for frequently changing inputs
- Apply error boundaries to prevent cascading failures

### Large Dataset Handling
```typescript
import { useVirtualList } from '../utils/performanceUtils';

const LargeListComponent = ({ items }) => {
  const { visibleItems, totalHeight, onScroll } = useVirtualList(
    items,
    itemHeight: 50,
    containerHeight: 400
  );
  
  return (
    <div 
      style={{ height: 400, overflow: 'auto' }}
      onScroll={onScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, style }) => (
          <div key={index} style={style}>
            {/* Render item */}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 🔄 State Management Patterns

### Redux-like Patterns
```typescript
import { createReducer, useEnhancedReducer } from '../utils/stateUtils';

// Define actions and reducer
const { reducer, actionCreators } = createReducer(initialState, {
  UPDATE_DATA: (state, action) => ({
    ...state,
    data: action.payload
  }),
  RESET: () => initialState
});

// Use in component
const MyComponent = () => {
  const { state, dispatch, dispatchAction } = useEnhancedReducer(
    reducer, 
    initialState
  );
  
  // Dispatch actions
  const updateData = (newData) => {
    dispatchAction('UPDATE_DATA', newData);
  };
};
```

### Immutable Updates
```typescript
import { immer } from '../utils/stateUtils';

// Safe nested updates
const newState = immer.setIn(state, 'user.profile.name', 'New Name');

// Array operations
const withNewItem = immer.addToArray(state, 'items', newItem);
const withoutItem = immer.removeFromArray(state, 'items', item => item.id === targetId);
```

## 🐛 Debugging

### Development Tools
- React Developer Tools browser extension
- Redux DevTools (for state inspection)
- TypeScript compiler for type checking
- Browser debugger for runtime debugging

### Logging Patterns
```typescript
// Use consistent logging
console.group('Component: MyComponent');
console.log('Props:', props);
console.log('State:', state);
console.groupEnd();

// Error logging
try {
  // Risky operation
} catch (error) {
  console.error('Operation failed:', {
    component: 'MyComponent',
    action: 'performAction',
    error: error.message,
    stack: error.stack
  });
}
```

## 📝 Documentation Standards

### Component Documentation
- Comprehensive JSDoc for all components
- Prop descriptions with types and examples
- Usage examples in component files
- Architecture decisions documented

### Code Comments
```typescript
// GOOD: Explains WHY, not WHAT
// Using debounce to prevent excessive API calls during rapid user input
const debouncedSearch = useDebouncedValue(searchQuery, 300);

// GOOD: Complex logic explanation
// Calculate graph statistics using adjacency list for O(V+E) complexity
// instead of matrix approach which would be O(V²)
const stats = calculateGraphStats(graphData);
```

## 🚀 Deployment

### Build Process
```bash
# Type checking
npm run type-check

# Build for production
npm run build

# Preview build locally
npm run preview
```

### Environment Variables
Create `.env.local` for local development:
```
VITE_API_URL=http://localhost:3001
VITE_DEBUG_MODE=true
```

## 🔮 Future Development

### Recommended Patterns
1. **Feature Flags**: Implement feature toggling for gradual rollouts
2. **Performance Monitoring**: Add metrics collection for optimization
3. **Accessibility**: Enhance keyboard navigation and screen reader support
4. **Internationalization**: Prepare for multi-language support
5. **Progressive Web App**: Add offline capabilities and app-like features

### Extension Points
- **Plugin System**: Architecture supports pluggable components
- **Custom Hooks**: Utility hooks can be extended for specific needs
- **Service Layer**: Additional services can be added following established patterns
- **Data Sources**: Graph data loading can be extended for multiple sources

---

## 📞 Support

For development questions and support:

1. **Check Documentation**: Start with this guide and component documentation
2. **Code Examples**: Refer to existing components for patterns
3. **Testing**: Use provided test utilities for consistent testing
4. **Issues**: Create GitHub issues for bugs or feature requests

## 📚 Additional Resources

- **[Component Architecture](COMPONENTS.md)**: Detailed component documentation
- **Development History**: See the repository commit history and `FINAL_STATUS.md`
- **Coding Standards**: Project conventions documented in this guide and enforced with `npm run lint`
- **TypeScript Documentation**: [Official TypeScript docs](https://www.typescriptlang.org/docs/)
- **React Documentation**: [Official React docs](https://react.dev/)

**Happy Coding! 🎉** The Research Discovery Engine is now a professional, maintainable platform ready for continued development and innovation. 