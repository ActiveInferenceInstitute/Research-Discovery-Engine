/**
 * @fileoverview API Client for Discovery Engine Backend Communication
 * 
 * This module provides a comprehensive API client for interacting with the
 * Discovery Engine backend services. It handles knowledge graph operations,
 * document processing, AI agent interactions, and concept design workflows
 * with robust error handling and type safety.
 * 
 * @example
 * ```typescript
 * import { apiClient, getGraphData } from './api/graphAPI';
 * 
 * // Get complete graph data
 * const graph = await getGraphData();
 * 
 * // Search for specific nodes
 * const results = await apiClient.searchNodes('neural networks', {
 *   type: ['Mechanism', 'Material']
 * });
 * ```
 */

import { GraphData, NodeObject, LinkObject, ConceptDesignState, AgentMessage } from '../types';

// API Configuration
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8000/api';

/**
 * Standard API response wrapper
 * 
 * @template T - Type of the response data
 */
interface APIResponse<T> {
  /** Whether the request was successful */
  success: boolean;
  
  /** Response data payload */
  data?: T;
  
  /** Error message if request failed */
  error?: string;
  
  /** ISO timestamp of response */
  timestamp: string;
}

/**
 * Paginated API response with metadata
 * 
 * @template T - Type of the response data
 */
interface PaginatedResponse<T> extends APIResponse<T> {
  /** Pagination metadata */
  pagination?: {
    /** Current page number (1-indexed) */
    page: number;
    
    /** Number of items per page */
    pageSize: number;
    
    /** Total number of items */
    total: number;
    
    /** Whether more pages are available */
    hasMore: boolean;
  };
}

/**
 * Custom error class for API-related errors
 * 
 * @extends Error
 * @example
 * ```typescript
 * try {
 *   await apiClient.getGraphData();
 * } catch (error) {
 *   if (error instanceof APIError) {
 *     console.log(`API Error ${error.status}: ${error.message}`);
 *   }
 * }
 * ```
 */
export class APIError extends Error {
  constructor(
    message: string,
    /** HTTP status code if available */
    public status?: number,
    /** Error code for programmatic handling */
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * HTTP client for Discovery Engine API with comprehensive error handling
 * and type safety for all backend operations.
 * 
 * @class APIClient
 * @example
 * ```typescript
 * const client = new APIClient('https://api.discoveryengine.com');
 * const graph = await client.getGraphData();
 * ```
 */
class APIClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  /**
   * Creates a new API client instance
   * 
   * @param baseURL - Base URL for the API endpoints
   */
  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Makes an HTTP request with error handling and response parsing
   * 
   * @template T - Expected response data type
   * @param endpoint - API endpoint path (excluding base URL)
   * @param options - Fetch options for the request
   * @returns Promise resolving to API response
   * @throws {APIError} When request fails or returns error response
   * 
   * @private
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });

      const data: APIResponse<T> = await response.json();

      if (!response.ok) {
        throw new APIError(
          data.error || 'API request failed',
          response.status,
          response.status.toString()
        );
      }

      return data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Network error occurred');
    }
  }

  // Knowledge Graph Operations

  /**
   * Retrieves the complete knowledge graph data
   * 
   * @returns Promise resolving to complete graph with nodes and links
   * @throws {APIError} When graph data cannot be retrieved
   * 
   * @example
   * ```typescript
   * const graph = await apiClient.getGraphData();
   * console.log(`Loaded ${graph.nodes.length} nodes and ${graph.links.length} links`);
   * ```
   */
  async getGraphData(): Promise<GraphData> {
    const response = await this.request<GraphData>('/graph');
    return response.data || { nodes: [], links: [] };
  }

  /**
   * Searches for nodes matching the given query and filters
   * 
   * @param query - Search query string to match against node content
   * @param filters - Optional filters to narrow search results
   * @param filters.type - Node types to include in results
   * @param filters.dateRange - Date range filter for time-based content
   * @returns Promise resolving to array of matching nodes
   * 
   * @example
   * ```typescript
   * const materials = await apiClient.searchNodes('carbon nanotube', {
   *   type: ['Material', 'Material_Category'],
   *   dateRange: ['2020-01-01', '2024-01-01']
   * });
   * ```
   */
  async searchNodes(query: string, filters?: {
    type?: string[];
    dateRange?: [string, string];
  }): Promise<NodeObject[]> {
    const params = new URLSearchParams({ q: query });
    if (filters?.type) {
      params.append('types', filters.type.join(','));
    }
    if (filters?.dateRange) {
      params.append('dateFrom', filters.dateRange[0]);
      params.append('dateTo', filters.dateRange[1]);
    }

    const response = await this.request<NodeObject[]>(`/graph/search?${params}`);
    return response.data || [];
  }

  /**
   * Retrieves detailed information for a specific node
   * 
   * @param nodeId - Unique identifier of the node
   * @returns Promise resolving to node details or null if not found
   * 
   * @example
   * ```typescript
   * const node = await apiClient.getNodeDetails('graphene--2d-materials');
   * if (node) {
   *   console.log(`Node: ${node.label}`);
   * }
   * ```
   */
  async getNodeDetails(nodeId: string): Promise<NodeObject | null> {
    const response = await this.request<NodeObject>(`/graph/nodes/${nodeId}`);
    return response.data || null;
  }

  /**
   * Finds nodes and links related to a specific node within a given depth
   * 
   * @param nodeId - ID of the central node
   * @param depth - Maximum relationship distance to traverse (default: 1)
   * @returns Promise resolving to subgraph of related nodes and links
   * 
   * @example
   * ```typescript
   * const neighborhood = await apiClient.getRelatedNodes('neural-networks', 2);
   * console.log(`Found ${neighborhood.nodes.length} related nodes`);
   * ```
   */
  async getRelatedNodes(nodeId: string, depth: number = 1): Promise<{
    nodes: NodeObject[];
    links: LinkObject[];
  }> {
    const response = await this.request<{ nodes: NodeObject[]; links: LinkObject[] }>(
      `/graph/nodes/${nodeId}/related?depth=${depth}`
    );
    return response.data || { nodes: [], links: [] };
  }

  // Document Processing

  /**
   * Uploads a document for processing and knowledge extraction
   * 
   * @param file - File to upload (PDF, DOC, etc.)
   * @param extractionTemplate - Optional template for guided extraction
   * @returns Promise resolving to upload status and document ID
   * @throws {APIError} When upload fails or file is invalid
   * 
   * @example
   * ```typescript
   * const fileInput = document.getElementById('file') as HTMLInputElement;
   * const file = fileInput.files?.[0];
   * if (file) {
   *   const result = await apiClient.uploadDocument(file, 'research-paper');
   *   console.log(`Document uploaded: ${result.documentId}`);
   * }
   * ```
   */
  async uploadDocument(file: File, extractionTemplate?: string): Promise<{
    documentId: string;
    status: 'processing' | 'completed' | 'failed';
  }> {
    const formData = new FormData();
    formData.append('file', file);
    if (extractionTemplate) {
      formData.append('template', extractionTemplate);
    }

    const response = await this.request<{
      documentId: string;
      status: 'processing' | 'completed' | 'failed';
    }>('/documents/upload', {
      method: 'POST',
      headers: {}, // Remove Content-Type for FormData
      body: formData,
    });

    return response.data!;
  }

  /**
   * Checks the processing status of an uploaded document
   * 
   * @param documentId - ID of the uploaded document
   * @returns Promise resolving to processing status and extracted data
   * 
   * @example
   * ```typescript
   * const status = await apiClient.getDocumentStatus(docId);
   * if (status.status === 'completed' && status.extractedNodes) {
   *   console.log(`Extracted ${status.extractedNodes.length} new nodes`);
   * }
   * ```
   */
  async getDocumentStatus(documentId: string): Promise<{
    status: 'processing' | 'completed' | 'failed';
    extractedNodes?: NodeObject[];
    extractedLinks?: LinkObject[];
    error?: string;
  }> {
    const response = await this.request<{
      status: 'processing' | 'completed' | 'failed';
      extractedNodes?: NodeObject[];
      extractedLinks?: LinkObject[];
      error?: string;
    }>(`/documents/${documentId}/status`);
    return response.data!;
  }

  // AI Agent Operations

  /**
   * Triggers an AI agent to perform a specific action
   * 
   * @param action - Type of action for the agent to perform
   * @param payload - Optional data needed for the action
   * @returns Promise resolving to agent execution status and results
   * 
   * @example
   * ```typescript
   * const result = await apiClient.triggerAgent('analyze-concept', {
   *   conceptId: 'my-concept',
   *   analysisType: 'feasibility'
   * });
   * console.log(`Agent ${result.agentId} status: ${result.status}`);
   * ```
   */
  async triggerAgent(action: string, payload?: any): Promise<{
    agentId: string;
    status: 'started' | 'completed' | 'failed';
    result?: any;
  }> {
    const response = await this.request<{
      agentId: string;
      status: 'started' | 'completed' | 'failed';
      result?: any;
    }>('/agents/trigger', {
      method: 'POST',
      body: JSON.stringify({ action, payload }),
    });
    return response.data!;
  }

  /**
   * Checks the status and progress of a running AI agent
   * 
   * @param agentId - ID of the agent to check
   * @returns Promise resolving to agent status and results
   * 
   * @example
   * ```typescript
   * const status = await apiClient.getAgentStatus(agentId);
   * if (status.status === 'completed') {
   *   console.log('Agent finished:', status.result);
   * }
   * ```
   */
  async getAgentStatus(agentId: string): Promise<{
    status: 'running' | 'completed' | 'failed';
    progress?: number;
    result?: any;
    error?: string;
  }> {
    const response = await this.request<{
      status: 'running' | 'completed' | 'failed';
      progress?: number;
      result?: any;
      error?: string;
    }>(`/agents/${agentId}/status`);
    return response.data!;
  }

  // Concept Design Operations

  /**
   * Saves a concept design to the backend
   * 
   * @param design - Complete concept design state to save
   * @returns Promise resolving to saved concept ID and version
   * 
   * @example
   * ```typescript
   * const saved = await apiClient.saveConceptDesign(myConceptState);
   * console.log(`Saved concept ${saved.conceptId} v${saved.version}`);
   * ```
   */
  async saveConceptDesign(design: ConceptDesignState): Promise<{
    conceptId: string;
    version: number;
  }> {
    const response = await this.request<{
      conceptId: string;
      version: number;
    }>('/concepts', {
      method: 'POST',
      body: JSON.stringify(design),
    });
    return response.data!;
  }

  /**
   * Validates a concept design and provides feedback
   * 
   * @param design - Concept design to validate
   * @returns Promise resolving to validation results and suggestions
   * 
   * @example
   * ```typescript
   * const validation = await apiClient.validateConceptDesign(concept);
   * if (!validation.isValid) {
   *   validation.issues.forEach(issue => 
   *     console.log(`${issue.type}: ${issue.message}`)
   *   );
   * }
   * ```
   */
  async validateConceptDesign(design: ConceptDesignState): Promise<{
    isValid: boolean;
    issues: Array<{
      type: 'error' | 'warning' | 'suggestion';
      message: string;
      field?: string;
    }>;
    suggestions?: Array<{
      type: 'component' | 'method' | 'parameter';
      suggestion: any;
      confidence: number;
    }>;
  }> {
    const response = await this.request<{
      isValid: boolean;
      issues: Array<{
        type: 'error' | 'warning' | 'suggestion';
        message: string;
        field?: string;
      }>;
      suggestions?: Array<{
        type: 'component' | 'method' | 'parameter';
        suggestion: any;
        confidence: number;
      }>;
    }>('/concepts/validate', {
      method: 'POST',
      body: JSON.stringify(design),
    });
    return response.data!;
  }

  // Knowledge Gap Analysis

  /**
   * Detects knowledge gaps in the current graph or specific domain
   * 
   * @param domain - Optional domain to focus gap detection on
   * @returns Promise resolving to array of identified knowledge gaps
   * 
   * @example
   * ```typescript
   * const gaps = await apiClient.detectKnowledgeGaps('neural-networks');
   * gaps.forEach(gap => {
   *   console.log(`${gap.type}: ${gap.description} (priority: ${gap.priority})`);
   * });
   * ```
   */
  async detectKnowledgeGaps(domain?: string): Promise<Array<{
    id: string;
    type: 'missing_link' | 'parameter_gap' | 'method_gap' | 'inconsistency';
    description: string;
    priority: number;
    relatedNodes: string[];
  }>> {
    const params = domain ? `?domain=${encodeURIComponent(domain)}` : '';
    const response = await this.request<Array<{
      id: string;
      type: 'missing_link' | 'parameter_gap' | 'method_gap' | 'inconsistency';
      description: string;
      priority: number;
      relatedNodes: string[];
    }>>(`/analysis/gaps${params}`);
    return response.data || [];
  }

  // Vector Search and Embeddings

  /**
   * Finds nodes similar to a given node using vector embeddings
   * 
   * @param nodeId - ID of the reference node
   * @param limit - Maximum number of similar nodes to return (default: 10)
   * @returns Promise resolving to similar nodes with similarity scores
   * 
   * @example
   * ```typescript
   * const similar = await apiClient.findSimilarNodes('graphene', 5);
   * similar.forEach(item => {
   *   console.log(`${item.node.label}: ${item.similarity.toFixed(3)}`);
   * });
   * ```
   */
  async findSimilarNodes(nodeId: string, limit: number = 10): Promise<Array<{
    node: NodeObject;
    similarity: number;
  }>> {
    const response = await this.request<Array<{
      node: NodeObject;
      similarity: number;
    }>>(`/graph/nodes/${nodeId}/similar?limit=${limit}`);
    return response.data || [];
  }

  /**
   * Performs semantic search across the knowledge graph
   * 
   * @param query - Natural language search query
   * @param limit - Maximum number of results to return (default: 20)
   * @returns Promise resolving to semantically relevant nodes
   * 
   * @example
   * ```typescript
   * const results = await apiClient.semanticSearch(
   *   'materials for flexible electronics', 10
   * );
   * results.forEach(result => {
   *   console.log(`${result.node.label} (${result.relevance.toFixed(3)})`);
   * });
   * ```
   */
  async semanticSearch(query: string, limit: number = 20): Promise<Array<{
    node: NodeObject;
    relevance: number;
    excerpt?: string;
  }>> {
    const response = await this.request<Array<{
      node: NodeObject;
      relevance: number;
      excerpt?: string;
    }>>('/search/semantic', {
      method: 'POST',
      body: JSON.stringify({ query, limit }),
    });
    return response.data || [];
  }
}

/**
 * Singleton API client instance for use throughout the application
 * 
 * @example
 * ```typescript
 * import { apiClient } from './api/graphAPI';
 * const graph = await apiClient.getGraphData();
 * ```
 */
export const apiClient = new APIClient();

/**
 * Convenience functions that use the singleton client instance.
 * These provide a simpler API for common operations without requiring
 * direct instantiation of the APIClient class.
 */
export const {
  getGraphData,
  searchNodes,
  getNodeDetails,
  getRelatedNodes,
  uploadDocument,
  getDocumentStatus,
  triggerAgent,
  getAgentStatus,
  saveConceptDesign,
  validateConceptDesign,
  detectKnowledgeGaps,
  findSimilarNodes,
  semanticSearch,
} = apiClient; 