import { OpenRouterClient } from './openRouter';
import { AgentOperationType, OpenRouterConfig, AgentError, AlgorithmAnalysisParams } from '../types/api.types';
import { AgentMessage, NodeObject, LinkObject, NodeType, EdgeType } from '../types';
import { AgentResponse } from '../types/api.types';

export class AgentService {
  private client: OpenRouterClient;
  private onMessage: (message: AgentMessage) => void;
  private retryCount: number = 0;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second
  private operationQueue: Array<{
    type: AgentOperationType;
    params: any;
    retryCount: number;
  }> = [];
  private isProcessingQueue: boolean = false;

  constructor(apiKey: string, onMessage: (message: AgentMessage) => void) {
    const config: OpenRouterConfig = {
      apiKey,
      baseUrl: 'https://openrouter.ai/api',
      model: 'anthropic/claude-3-opus-20240229',
      maxTokens: 4000,
      temperature: 0.7
    };
    this.client = new OpenRouterClient(config);
    this.onMessage = onMessage;
  }

  async validateApiKey(): Promise<boolean> {
    return this.client.validateApiKey();
  }

  async executeOperation(operationType: AgentOperationType, params: any): Promise<void> {
    try {
      // Add operation to queue
      this.operationQueue.push({
        type: operationType,
        params,
        retryCount: 0
      });

      // Process queue if not already processing
      if (!this.isProcessingQueue) {
        await this.processOperationQueue();
      }
    } catch (error) {
      this.handleOperationError(error, operationType, params);
    }
  }

  private async processOperationQueue(): Promise<void> {
    if (this.isProcessingQueue || this.operationQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      while (this.operationQueue.length > 0) {
        const operation = this.operationQueue[0];
        
        try {
          await this.executeOperationWithRetry(operation.type, operation.params);
          this.operationQueue.shift(); // Remove successful operation
        } catch (error) {
          if (operation.retryCount < this.MAX_RETRIES) {
            // Move to end of queue for retry
            operation.retryCount++;
            this.operationQueue.push(this.operationQueue.shift()!);
            await this.delay(this.RETRY_DELAY * operation.retryCount);
          } else {
            // Max retries exceeded, remove operation
            this.operationQueue.shift();
            this.handleOperationError(error, operation.type, operation.params);
          }
        }
      }
    } finally {
      this.isProcessingQueue = false;
    }
  }

  private async executeOperationWithRetry(operationType: AgentOperationType, params: any): Promise<void> {
    try {
      switch (operationType) {
        case 'launch-exploratory-analysis':
          await this.handleExploratoryAnalysis(params as AlgorithmAnalysisParams);
          break;
        case 'initiate-new-concept-from-goal':
          await this.handleNewConceptFromGoal(params);
          break;
        case 'initiate-new-concept-from-selection':
          await this.handleConceptFromSelection(params);
          break;
        case 'suggest-compatible-components':
          await this.handleCompatibleComponents(params);
          break;
        case 'check-consistency':
          await this.handleConsistencyCheck(params);
          break;
        default:
          await this.handleGenericOperation(operationType, params);
      }
    } catch (error) {
      this.handleOperationError(error, operationType, params);
      throw error; // Re-throw for queue processing
    }
  }

  private handleOperationError(error: any, operationType: AgentOperationType, params: any): void {
    const agentError: AgentError = {
      code: this.getErrorCode(error),
      message: this.getErrorMessage(error),
      retryable: this.isRetryableError(error),
      action: operationType
    };

    this.onMessage({
      id: crypto.randomUUID(),
      sourceAgent: 'system',
      type: 'error',
      content: agentError.message,
      timestamp: Date.now(),
      action: {
        type: 'trigger-agent-action',
        label: operationType,
        payload: { error: agentError }
      }
    });
  }

  private getErrorCode(error: any): string {
    if (error instanceof Error) {
      if (error.message.includes('timeout')) return 'TIMEOUT';
      if (error.message.includes('network')) return 'NETWORK';
      if (error.message.includes('rate limit')) return 'RATE_LIMIT';
      if (error.message.includes('invalid')) return 'INVALID_INPUT';
      if (error.message.includes('unauthorized')) return 'AUTH';
      if (error.message.includes('API key')) return 'AUTH';
    }
    return 'UNKNOWN';
  }

  private getErrorMessage(error: any): string {
    if (error instanceof Error) {
      // Handle specific error cases
      if (error.message.includes('timeout')) {
        return 'Operation timed out. Please try again.';
      }
      if (error.message.includes('network')) {
        return 'Network error. Please check your internet connection.';
      }
      if (error.message.includes('rate limit')) {
        return 'Rate limit exceeded. Please wait a moment before trying again.';
      }
      if (error.message.includes('unauthorized') || error.message.includes('API key')) {
        return 'Invalid or missing API key. Please check your settings.';
      }
      if (error.message.includes('invalid')) {
        return 'Invalid input parameters. Please check your request.';
      }
      return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
  }

  private isRetryableError(error: any): boolean {
    const code = this.getErrorCode(error);
    return ['TIMEOUT', 'NETWORK', 'RATE_LIMIT'].includes(code);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async handleExploratoryAnalysis(params: AlgorithmAnalysisParams): Promise<void> {
    console.log('Starting exploratory analysis with algorithm results...');
    
    if (!params.algorithmResults || params.algorithmResults.length === 0) {
      throw new Error('Algorithm results are required for exploratory analysis');
    }

    try {
      console.log('Calling exploreGraph with algorithm results...');
      const response = await this.client.exploreGraph(
        params.algorithmResults,
        params.focusArea,
        params.depth
      );
      console.log('Received response:', response);
      
      // Format and send the complete analysis
      const message: AgentMessage = {
        id: crypto.randomUUID(),
        type: 'analysis',
        content: this.formatAnalysisOutput(response),
        timestamp: Date.now(),
        sourceAgent: 'exploratory-analysis'
      };
      console.log('Sending message:', message);
      this.onMessage(message);
    } catch (error) {
      console.error('Error in exploratory analysis:', error);
      if (error instanceof Error && error.message === 'Operation aborted') {
        throw error;
      }
      this.handleOperationError(error, 'launch-exploratory-analysis', params);
    }
  }

  private formatAnalysisOutput(response: AgentResponse): string {
    try {
      // Try to parse the content as JSON if it's in JSON format
      try {
        const jsonContent = JSON.parse(response.content);
        return `Analysis Results:\n${JSON.stringify(jsonContent, null, 2)}`;
      } catch {
        // If not JSON, return the content as is
        return `Analysis Results:\n${response.content}`;
      }
    } catch (error) {
      return 'Error formatting analysis output';
    }
  }

  private async handleNewConceptFromGoal(params: any): Promise<void> {
    const { goal, constraints, context } = params;
    
    const prompt = `You are an AI agent specialized in scientific concept design.
                   Create a new concept based on the following specifications:
                   
                   Goal: ${goal}
                   Constraints: ${JSON.stringify(constraints || {})}
                   Context: ${JSON.stringify(context || {})}
                   
                   The concept should include:
                   1. Core components and their relationships
                   2. Required structural elements
                   3. Key properties and attributes
                   4. Integration points with existing concepts
                   5. Validation criteria
                   
                   Respond with:
                   1. A detailed concept description
                   2. Graph updates representing the concept structure
                   3. Implementation considerations`;

    await this.processOperation(prompt, 'initiate-new-concept-from-goal');
  }

  private async handleConceptFromSelection(params: any): Promise<void> {
    const { selection, context } = params;
    
    const prompt = `You are an AI agent specialized in concept design from existing components.
                   Create a new concept based on the following selection:
                   
                   Selection: ${JSON.stringify(selection)}
                   Context: ${JSON.stringify(context || {})}
                   
                   Please:
                   1. Analyze the selected components
                   2. Identify potential relationships
                   3. Propose a cohesive concept
                   4. Suggest additional components if needed
                   
                   Respond with:
                   1. Concept analysis
                   2. Proposed structure
                   3. Graph updates for the new concept`;

    await this.processOperation(prompt, 'initiate-new-concept-from-selection');
  }

  private async handleCompatibleComponents(params: any): Promise<void> {
    const { targetId, context, constraints } = params;
    
    const prompt = `You are an AI agent specialized in component compatibility analysis.
                   Suggest compatible components for:
                   Target: ${targetId}
                   
                   Context: ${JSON.stringify(context)}
                   Constraints: ${JSON.stringify(constraints)}
                   
                   Please:
                   1. Analyze compatibility requirements
                   2. Identify potential matches
                   3. Justify each suggestion
                   4. Consider integration impact
                   
                   Respond with:
                   1. Compatibility analysis
                   2. Component suggestions
                   3. Graph updates for new connections`;

    await this.processOperation(prompt, 'suggest-compatible-components');
  }

  private async handleConsistencyCheck(params: any): Promise<void> {
    const { conceptId, criteria } = params;
    
    const prompt = `You are an AI agent specialized in concept consistency validation.
                   Check consistency for concept: ${conceptId}
                   
                   Validation criteria: ${JSON.stringify(criteria)}
                   
                   Please:
                   1. Evaluate internal consistency
                   2. Check external compatibility
                   3. Identify inconsistencies
                   4. Suggest resolutions
                   
                   Respond with:
                   1. Consistency analysis
                   2. Issues found
                   3. Resolution suggestions
                   4. Graph updates if needed`;

    await this.processOperation(prompt, 'check-consistency');
  }

  private async handleGenericOperation(operationType: AgentOperationType, params: any): Promise<void> {
    const prompt = `You are an AI agent specialized in scientific research and concept design. 
                   Current operation: ${operationType}
                   
                   Parameters: ${JSON.stringify(params)}
                   
                   Please:
                   1. Understand the operation requirements
                   2. Process the parameters
                   3. Generate appropriate response
                   4. Provide relevant graph updates if applicable`;

    await this.processOperation(prompt, operationType);
  }

  private async processOperation(prompt: string, operationType: AgentOperationType): Promise<void> {
    try {
      const response = await this.client.complete(prompt);
      
      // Process the complete response
      this.onMessage({
        id: crypto.randomUUID(),
        sourceAgent: 'system',
        type: 'info',
        content: response.content,
        timestamp: Date.now(),
        action: {
          type: 'trigger-agent-action',
          label: operationType,
          payload: { content: response.content }
        }
      });
    } catch (error) {
      this.handleOperationError(error, operationType, { prompt });
      throw error;
    }
  }

  private processGraphUpdate(update: any): void {
    // 1. Validate update structure
    if (!this.isValidGraphUpdate(update)) {
      throw new Error('Invalid graph update structure');
    }

    // 2. Format update for graph system
    const formattedUpdate = this.formatGraphUpdate(update);

    // 3. Emit update
    this.emitGraphUpdate(formattedUpdate);
  }

  private isValidGraphUpdate(update: any): boolean {
    // Validate update structure
    return (
      update &&
      typeof update === 'object' &&
      Array.isArray(update.nodes) &&
      Array.isArray(update.edges) &&
      update.nodes.every((node: any) => this.isValidNode(node)) &&
      update.edges.every((edge: any) => this.isValidEdge(edge))
    );
  }

  private isValidNode(node: any): boolean {
    return (
      node &&
      typeof node === 'object' &&
      typeof node.id === 'string' &&
      typeof node.type === 'string'
    );
  }

  private isValidEdge(edge: any): boolean {
    return (
      edge &&
      typeof edge === 'object' &&
      typeof edge.source === 'string' &&
      typeof edge.target === 'string' &&
      typeof edge.type === 'string'
    );
  }

  private formatGraphUpdate(update: any): { nodes: NodeObject[]; links: LinkObject[] } {
    return {
      nodes: update.nodes.map(this.formatNode),
      links: update.edges.map(this.formatEdge)
    };
  }

  private formatNode(node: any): NodeObject {
    return {
      id: node.id,
      type: node.type as NodeType,
      origin: 'system_derived',
      status: 'Proposed',
      label: node.label,
      description: node.description,
      x: node.position?.x,
      y: node.position?.y,
      z: node.position?.z
    };
  }

  private formatEdge(edge: any): LinkObject {
    return {
      source: edge.source,
      target: edge.target,
      type: edge.type as EdgeType,
      justification: edge.justification
    };
  }

  private emitGraphUpdate(update: { nodes: NodeObject[]; links: LinkObject[] }): void {
    // Use existing onMessage callback
    this.onMessage({
      id: crypto.randomUUID(),
      sourceAgent: 'system',
      type: 'info',
      content: JSON.stringify({
        type: 'graph_update',
        data: update
      }),
      timestamp: Date.now()
    });
  }
} 