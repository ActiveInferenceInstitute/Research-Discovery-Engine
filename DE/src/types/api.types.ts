// src/types/api.types.ts

// OpenRouter API Configuration
export interface OpenRouterConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

// Agent Configuration
export interface AgentConfig {
  openRouter: OpenRouterConfig;
  maxRetries?: number;
  timeout?: number;
  streaming?: boolean;
}

// API Response Types
export interface AgentResponse {
  content: string;
  status: 'success' | 'error';
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// API Error Types
export interface AgentError {
  code: string;
  message: string;
  retryable: boolean;
  action?: string;
}

// Stream Handler Types
export interface StreamHandler {
  onChunk: (chunk: string) => void;
  onComplete: (response: AgentResponse) => void;
  onError: (error: AgentError) => void;
}

// Algorithm Analysis Types
export interface AlgorithmAnalysisParams {
  algorithmResults: Array<{
    algorithmName: string;
    timestamp: number;
    data: any;
    metadata: {
      executionTime: number;
      graphSize: number;
      parameters: Record<string, any>;
      category: string;
    };
  }>;
  focusArea?: string;
  depth?: string;
}

// Agent Operation Types
export type AgentOperationType = 
  | 'launch-exploratory-analysis'
  | 'initiate-new-concept-from-goal'
  | 'initiate-new-concept-from-selection'
  | 'suggest-compatible-components'
  | 'check-consistency'
  | 'exploratory-analysis'
  | 'generate-concept-summary'
  | 'generate-protocol-outline'
  | 'package-knowledge-artifact'
  | 'search-graph'
  | 'accept-suggestion'
  | 'integrate-data'
  | 'add-field-suggestion'
  | 'clear-suggestions'
  | 'add-message'
  | 'open-publication';

export interface AgentOperation {
  type: AgentOperationType;
  handler: (params: any) => Promise<AgentResponse>;
  validate: (params: any) => boolean;
}

// API Status Types
export type APIStatus = 'idle' | 'loading' | 'error' | 'success';

export interface APIStatusState {
  status: APIStatus;
  lastError?: AgentError;
  lastSuccess?: AgentResponse;
  isStreaming: boolean;
}

export type AgentMessageType = 
  | 'error'
  | 'info'
  | 'opportunity'
  | 'suggestion'
  | 'warning'
  | 'command_confirmation'
  | 'user_query'
  | 'analysis';

export interface AgentMessage {
  id: string;
  type: AgentMessageType;
  content: string;
  timestamp: number;
  sourceAgent: string;
  severity?: 'info' | 'warning' | 'error';
} 