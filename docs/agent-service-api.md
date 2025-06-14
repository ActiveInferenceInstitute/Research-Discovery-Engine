# Agent Service API Documentation

## Overview

The `AgentService` class provides a robust interface for executing AI-powered operations in the research discovery engine. It handles operation queuing, error recovery, and graph updates through a streaming interface.

## Installation

```bash
npm install @research-discovery/agent-service
```

## Basic Usage

```typescript
import { AgentService } from '@research-discovery/agent-service';

const agentService = new AgentService(apiKey, (message) => {
  console.log('Received message:', message);
});

// Execute an operation
await agentService.executeOperation('launch-exploratory-analysis', {
  graphData: { nodes: [], links: [] },
  focusArea: 'materials-science',
  depth: 'comprehensive'
});
```

## API Reference

### Constructor

```typescript
constructor(apiKey: string, onMessage: (message: AgentMessage) => void)
```

Creates a new instance of the AgentService.

- `apiKey`: Your OpenRouter API key
- `onMessage`: Callback function for receiving messages and updates

### Methods

#### executeOperation

```typescript
executeOperation(operationType: AgentOperationType, params: any): Promise<void>
```

Executes an AI operation with the specified parameters.

- `operationType`: The type of operation to execute
- `params`: Operation-specific parameters

### Operation Types

#### launch-exploratory-analysis

Analyzes the current graph to identify knowledge gaps and opportunities.

```typescript
await agentService.executeOperation('launch-exploratory-analysis', {
  graphData: {
    nodes: NodeObject[],
    links: LinkObject[]
  },
  focusArea?: string,
  depth?: 'basic' | 'comprehensive'
});
```

#### initiate-new-concept-from-goal

Creates a new concept based on a specified goal.

```typescript
await agentService.executeOperation('initiate-new-concept-from-goal', {
  goal: string,
  constraints?: Record<string, any>,
  context?: Record<string, any>
});
```

#### initiate-new-concept-from-selection

Creates a new concept from selected components.

```typescript
await agentService.executeOperation('initiate-new-concept-from-selection', {
  selection: {
    nodes: string[],
    links: string[]
  },
  context?: Record<string, any>
});
```

#### suggest-compatible-components

Suggests compatible components for a target node.

```typescript
await agentService.executeOperation('suggest-compatible-components', {
  targetId: string,
  context?: Record<string, any>,
  constraints?: Record<string, any>
});
```

#### check-consistency

Validates the consistency of a concept.

```typescript
await agentService.executeOperation('check-consistency', {
  conceptId: string,
  criteria: Record<string, any>
});
```

### Message Types

The service emits various types of messages through the `onMessage` callback:

```typescript
interface AgentMessage {
  id: string;
  sourceAgent: string;
  type: 'info' | 'opportunity' | 'suggestion' | 'warning' | 'error' | 'command_confirmation' | 'user_query';
  content: string;
  timestamp: number;
  relatedNodeIds?: string[];
  relatedFieldId?: string;
  action?: {
    type: 'accept-suggestion' | 'view-details' | 'trigger-agent-action' | 'integrate-data' | 'explore-node';
    label?: string;
    payload?: any;
  };
}
```

### Error Handling

The service includes robust error handling with automatic retries for transient errors:

```typescript
// Error types
type ErrorCode = 'TIMEOUT' | 'NETWORK' | 'RATE_LIMIT' | 'INVALID_INPUT' | 'AUTH' | 'UNKNOWN';

interface AgentError {
  code: ErrorCode;
  message: string;
  retryable: boolean;
  action?: AgentOperationType;
}
```

## Examples

### Basic Operation Execution

```typescript
const agentService = new AgentService(apiKey, (message) => {
  if (message.type === 'error') {
    console.error('Error:', message.content);
  } else {
    console.log('Message:', message.content);
  }
});

try {
  await agentService.executeOperation('launch-exploratory-analysis', {
    graphData: currentGraph,
    focusArea: 'materials-science'
  });
} catch (error) {
  console.error('Operation failed:', error);
}
```

### Handling Graph Updates

```typescript
const agentService = new AgentService(apiKey, (message) => {
  if (message.type === 'info' && message.content.includes('graph_update')) {
    const update = JSON.parse(message.content).data;
    // Process graph update
    updateGraph(update.nodes, update.links);
  }
});
```

### Error Recovery

```typescript
const agentService = new AgentService(apiKey, (message) => {
  if (message.type === 'error') {
    const error = message.action?.payload?.error;
    if (error.retryable) {
      console.log('Retrying operation...');
    } else {
      console.error('Non-retryable error:', error.message);
    }
  }
});
```

## Best Practices

1. **Error Handling**
   - Always implement proper error handling in the `onMessage` callback
   - Check for retryable errors and implement appropriate recovery logic
   - Log errors for debugging purposes

2. **Operation Parameters**
   - Provide complete and valid parameters for each operation
   - Include context and constraints when available
   - Validate parameters before execution

3. **Message Processing**
   - Handle all message types appropriately
   - Process graph updates promptly
   - Implement proper state management for long-running operations

4. **Resource Management**
   - Monitor operation queue size
   - Implement proper cleanup for completed operations
   - Handle API rate limits appropriately

## Troubleshooting

### Common Issues

1. **Operation Timeouts**
   - Check network connectivity
   - Verify API key validity
   - Monitor operation complexity

2. **Graph Update Failures**
   - Validate graph data structure
   - Check for circular dependencies
   - Verify node and edge types

3. **Queue Processing Issues**
   - Monitor queue size
   - Check for stuck operations
   - Verify error handling

### Debugging

```typescript
const agentService = new AgentService(apiKey, (message) => {
  console.log('Message:', {
    type: message.type,
    content: message.content,
    action: message.action,
    timestamp: new Date(message.timestamp).toISOString()
  });
});
```

## Related Documentation

- [API Reference](../api-reference.md) - General API documentation
- [Developer Guide](../developer-guide.md) - Development guidelines
- [Troubleshooting Guide](../troubleshooting.md) - Common issues and solutions 