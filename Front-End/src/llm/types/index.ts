/**
 * LLM Module Type Definitions
 * 
 * Comprehensive types for flexible LLM integration with OpenAI API
 */

// API Provider Types
export type APIProvider = 'openai' | 'openrouter';

// Core LLM Configuration Types
export interface LLMConfig {
  apiProvider: APIProvider;
  apiKey: string;
  model: ModelType;
  maxTokens: number;
  temperature: number;
  baseURL?: string;
  organization?: string;
  project?: string;
  maxRetries?: number;
  retryDelay?: number;
}

// Supported Model Types
export type ModelType = 
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4-turbo'
  | 'gpt-4'
  | 'gpt-3.5-turbo'
  | 'gpt-3.5-turbo-16k'
  | 'google/gemini-2.0-flash-exp:free'
  | 'google/gemini-2.0-pro-exp-02-05:free'
  | 'google/gemini-2.0-flash-thinking-exp:free'
  | 'deepseek/deepseek-r1-distill-llama-70b:free'
  | 'openrouter/quasar-alpha'
  | string; // Allow custom models

// Message Types
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

// Request Configuration
export interface LLMRequestConfig {
  model?: ModelType;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string | string[];
  stream?: boolean;
  seed?: number;
  logitBias?: { [token: string]: number };
}

// Core LLM Request
export interface LLMRequest {
  systemPrompt?: string;
  userPrompt: string;
  context?: string;
  examples?: Array<{ input: string; output: string }>;
  config?: LLMRequestConfig;
}

// Usage Statistics
export interface LLMUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

// LLM Response
export interface LLMResult {
  content: string;
  success: boolean;
  error?: string;
  usage: LLMUsage;
  metadata: {
    model: string;
    temperature: number;
    maxTokens: number;
    requestId: string;
    timestamp: number;
    duration: number;
    finishReason: string;
  };
  rawResponse?: any;
}

// Error Types
export interface LLMError {
  type: 'rate_limit_error' | 'api_error' | 'validation_error' | 'network_error' | 'timeout_error';
  message: string;
  code?: string;
  statusCode?: number;
  retryAfter?: number;
  details?: any;
}

// Retry Policy
export interface RetryPolicy {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryCondition: (error: LLMError) => boolean;
}

// Batch Processing
export interface LLMBatchRequest {
  requests: LLMRequest[];
  concurrency?: number;
  onProgress?: (completed: number, total: number) => void;
  onError?: (error: LLMError, request: LLMRequest, index: number) => void;
}

export interface LLMBatchResult {
  results: (LLMResult | LLMError)[];
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalDuration: number;
  totalUsage: LLMUsage;
}

// Analytics
export interface LLMAnalytics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalTokensUsed: number;
  averageResponseTime: number;
  costEstimate: number;
  modelUsage: { [model: string]: number };
  errorBreakdown: { [errorType: string]: number };
}

// Research Context Types
export interface ResearchLLMContext {
  concept: string;
  domain: string;
  materials?: string[];
  mechanisms?: string[];
  methods?: string[];
  phenomena?: string[];
  applications?: string[];
  theoreticalConcepts?: string[];
}

// Summary Generation Types
export interface SummaryLLMRequest {
  context: ResearchLLMContext;
  summaryType: 'technical' | 'executive' | 'educational' | 'comprehensive';
  targetAudience: 'researcher' | 'student' | 'industry' | 'general';
  length: 'brief' | 'standard' | 'detailed' | 'comprehensive';
  includeReferences: boolean;
  includeFutureWork: boolean;
  systemPrompt?: string;
  userPrompt: string;
  config?: LLMRequestConfig;
}

// Knowledge Processing Types
export interface KnowledgeProcessingLLMRequest {
  sourceText: string;
  processingType: 'extract_concepts' | 'find_relationships' | 'generate_questions' | 'summarize' | 'classify';
  domain: string;
  outputFormat: 'structured' | 'narrative' | 'bullets' | 'json';
  extractionTargets?: string[];
  systemPrompt?: string;
  userPrompt: string;
  config?: LLMRequestConfig;
}

// Protocol Generation Types
export interface ProtocolLLMRequest {
  context: ResearchLLMContext;
  protocolType: 'synthesis' | 'characterization' | 'testing' | 'analysis' | 'comprehensive';
  detailLevel: 'basic' | 'intermediate' | 'advanced';
  timeConstraints?: string;
  resourceConstraints?: string[];
  safetyRequirements?: string[];
  systemPrompt?: string;
  userPrompt: string;
  config?: LLMRequestConfig;
}

// Analysis Types
export interface AnalysisLLMRequest {
  dataType: 'experimental' | 'simulation' | 'literature' | 'mixed';
  analysisGoal: string;
  data: string;
  context: ResearchLLMContext;
  methodologies?: string[];
  outputFormat: 'report' | 'insights' | 'recommendations' | 'structured';
  systemPrompt?: string;
  userPrompt: string;
  config?: LLMRequestConfig;
}

// Specialized Response Types
export interface SummaryLLMResult extends LLMResult {
  summary: {
    abstract: string;
    keyFindings: string[];
    methodology: string;
    implications: string[];
    futureWork?: string[];
    references?: string[];
  };
}

export interface KnowledgeProcessingResult extends LLMResult {
  extractedData: {
    concepts: string[];
    relationships: Array<{ source: string; target: string; relationship: string }>;
    questions: string[];
    classifications: { [key: string]: string };
  };
}

export interface ProtocolLLMResult extends LLMResult {
  protocol: {
    title: string;
    objective: string;
    materials: string[];
    equipment: string[];
    procedures: Array<{ step: number; description: string; duration?: string; safety?: string[] }>;
    analysis: string[];
    expectedOutcomes: string[];
    troubleshooting?: Array<{ issue: string; solution: string }>;
  };
}

export interface AnalysisLLMResult extends LLMResult {
  analysis: {
    summary: string;
    insights: string[];
    recommendations: string[];
    methodology: string;
    limitations: string[];
    confidence: 'low' | 'medium' | 'high';
    nextSteps: string[];
  };
}

// Prompt Templates
export interface PromptTemplate {
  name: string;
  description: string;
  systemPrompt: string;
  userPromptTemplate: string;
  variables: string[];
  examples?: Array<{ input: Record<string, any>; output: string }>;
  defaultConfig?: LLMRequestConfig;
}

// LLM Service Events
export type LLMServiceEvent = 
  | { type: 'request_started'; requestId: string; timestamp: number }
  | { type: 'request_completed'; requestId: string; duration: number; tokens: number }
  | { type: 'request_failed'; requestId: string; error: LLMError }
  | { type: 'rate_limit_hit'; retryAfter: number }
  | { type: 'batch_progress'; completed: number; total: number };

export interface LLMEventListener {
  (event: LLMServiceEvent): void;
} 