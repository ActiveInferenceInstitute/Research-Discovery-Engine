# Test Suite Documentation

## Overview

This directory contains comprehensive test coverage for the Discovery Engine frontend application. Tests are organized by feature area and include unit tests, integration tests, and end-to-end scenarios.

## Test Structure

```
__tests__/
├── components/           # Component unit and integration tests
│   ├── AgentConsole/
│   ├── ConceptDesigner/
│   ├── ContextPanel/
│   ├── GraphVisualization/
│   └── ...
├── hooks/               # Custom hook tests
├── utils/               # Utility function tests
├── api/                 # API client tests
├── types/               # Type definition tests
├── integration/         # Cross-component integration tests
├── e2e/                 # End-to-end user workflow tests
├── setup/               # Test configuration and helpers
└── __mocks__/          # Mock implementations
```

## Testing Philosophy

### Unit Tests
- Test individual functions and components in isolation
- Mock external dependencies
- Focus on pure logic and state management
- Achieve high code coverage (>90%)

### Integration Tests
- Test component interactions
- Test hook combinations
- Test API integration with components
- Test data flow between related modules

### End-to-End Tests
- Test complete user workflows
- Test graph visualization interactions
- Test concept design workflows
- Test agent communication flows

## Test Coverage Goals

| Area | Target Coverage | Current Status |
|------|----------------|----------------|
| Utils | 95% | ⏳ Pending |
| Hooks | 90% | ⏳ Pending |
| Components | 85% | ⏳ Pending |
| API | 90% | ⏳ Pending |
| Types | 100% | ⏳ Pending |
| Integration | 80% | ⏳ Pending |

## Testing Technologies

- **Jest**: Test runner and framework
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking
- **Jest Environment JSDOM**: Browser environment simulation
- **@testing-library/user-event**: User interaction simulation

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test files
npm test -- GraphVisualization

# Run integration tests only
npm test -- --testPathPattern=integration

# Run e2e tests
npm run test:e2e
```

## Test File Naming Conventions

- Unit tests: `ComponentName.test.tsx` or `functionName.test.ts`
- Integration tests: `feature.integration.test.tsx`
- E2E tests: `workflow.e2e.test.tsx`
- Mock files: `__mocks__/moduleName.ts`

## Writing Tests

### Component Testing Pattern

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  it('should render with default props', () => {
    render(<ComponentName />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    
    render(<ComponentName onSubmit={onSubmit} />);
    
    await user.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
```

### Hook Testing Pattern

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCustomHook } from '../useCustomHook';

describe('useCustomHook', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useCustomHook());
    
    expect(result.current.state).toEqual(expectedDefaultState);
  });

  it('should update state correctly', () => {
    const { result } = renderHook(() => useCustomHook());
    
    act(() => {
      result.current.updateFunction(newValue);
    });
    
    expect(result.current.state).toEqual(expectedNewState);
  });
});
```

### Utility Testing Pattern

```typescript
import { utilityFunction } from '../utilityFunction';

describe('utilityFunction', () => {
  it('should handle valid input correctly', () => {
    const input = { /* valid input */ };
    const result = utilityFunction(input);
    
    expect(result).toEqual(expectedOutput);
  });

  it('should handle edge cases', () => {
    expect(() => utilityFunction(null)).toThrow('Invalid input');
    expect(utilityFunction([])).toEqual([]);
  });
});
```

## Mock Strategy

### API Mocking
Use MSW to mock API calls:

```typescript
// __mocks__/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/graph', (req, res, ctx) => {
    return res(ctx.json(mockGraphData));
  }),
];
```

### Component Mocking
Mock complex child components:

```typescript
// __mocks__/GraphVisualization.tsx
export const GraphVisualization = jest.fn(() => 
  <div data-testid="mock-graph-visualization">Mock Graph</div>
);
```

## Test Data Management

### Fixtures
Store test data in dedicated fixture files:

```typescript
// fixtures/graphData.ts
export const mockGraphData: GraphData = {
  nodes: [
    { id: 'test-node-1', type: 'Material', label: 'Test Material' },
    // ... more test nodes
  ],
  links: [
    { source: 'test-node-1', target: 'test-node-2', type: 'related-to' }
  ]
};
```

### Test Utilities
Create reusable test utilities:

```typescript
// utils/testUtils.tsx
export const renderWithProviders = (component: ReactElement) => {
  return render(
    <TestProviders>
      {component}
    </TestProviders>
  );
};
```

## Continuous Integration

Tests are automatically run on:
- Pull request creation
- Push to main branch
- Release preparation

CI requirements:
- All tests must pass
- Coverage must meet minimum thresholds
- No linting errors
- Type checking must pass

## Performance Testing

### Component Performance
Test component render performance:

```typescript
import { performance } from 'perf_hooks';

it('should render large datasets efficiently', () => {
  const start = performance.now();
  render(<GraphVisualization nodes={largeNodeSet} />);
  const end = performance.now();
  
  expect(end - start).toBeLessThan(100); // 100ms threshold
});
```

### Memory Leak Testing
Test for memory leaks in long-running components:

```typescript
it('should not leak memory on repeated renders', () => {
  const { rerender, unmount } = render(<Component />);
  
  for (let i = 0; i < 100; i++) {
    rerender(<Component key={i} />);
  }
  
  unmount();
  // Add memory usage assertions
});
```

## Accessibility Testing

Include accessibility tests for all interactive components:

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  
  expect(results).toHaveNoViolations();
});
```

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how
2. **Use Descriptive Test Names**: Test names should clearly state what is being tested
3. **Arrange-Act-Assert**: Structure tests with clear setup, action, and verification phases
4. **Mock Appropriately**: Mock external dependencies but not the code under test
5. **Test Edge Cases**: Include tests for error conditions and boundary values
6. **Keep Tests Fast**: Unit tests should run quickly to encourage frequent execution
7. **Test User Scenarios**: Write tests that reflect actual user workflows

## Troubleshooting

### Common Issues

#### Tests Timing Out
- Increase timeout for async operations
- Use `waitFor` for async state updates
- Check for infinite loops in useEffect

#### Mock Issues
- Ensure mocks are properly cleared between tests
- Verify mock implementations match real API contracts
- Use `jest.clearAllMocks()` in beforeEach

#### Flaky Tests
- Avoid relying on specific timing
- Use proper async/await patterns
- Mock random or time-dependent behavior

### Debug Commands

```bash
# Debug specific test
npm test -- --testNamePattern="specific test" --verbose

# Run with debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Generate detailed coverage report
npm run test:coverage -- --verbose
``` 