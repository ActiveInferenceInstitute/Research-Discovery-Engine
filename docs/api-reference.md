# API Reference - Research Discovery Engine

This document provides comprehensive API documentation for the Research Discovery Engine, covering all available endpoints, data structures, and integration methods.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Graph Data API](#graph-data-api)
4. [Search API](#search-api)
5. [Agent System API](#agent-system-api)
6. [Concept Design API](#concept-design-api)
7. [Document Processing API](#document-processing-api)
8. [Knowledge Graph API](#knowledge-graph-api)
9. [User Management API](#user-management-api)
10. [WebSocket API](#websocket-api)
11. [Error Handling](#error-handling)
12. [Rate Limiting](#rate-limiting)
13. [SDKs and Libraries](#sdks-and-libraries)

## Overview

### Base URLs

```
Development: http://localhost:8000/api/v1
Production:  https://api.research-discovery-engine.org/v1
```

### Data Format

All API endpoints accept and return JSON data unless otherwise specified. The Content-Type header should be set to `application/json` for POST and PUT requests.

### Versioning

The API uses URL versioning with the current version being `v1`. All endpoints are prefixed with `/api/v1/`.

### Response Format

All API responses follow a consistent structure:

```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    version: string;
    requestId: string;
  };
}
```

## Authentication

### API Key Authentication

```http
GET /api/v1/graph/nodes
Authorization: Bearer your-api-key-here
Content-Type: application/json
```

### OAuth 2.0 (For User-Specific Operations)

```http
GET /api/v1/user/concepts
Authorization: Bearer oauth-access-token
Content-Type: application/json
```

### Request Headers

```typescript
interface RequestHeaders {
  'Authorization': string;        // Required: Bearer token
  'Content-Type': string;         // application/json
  'X-Request-ID'?: string;        // Optional: Unique request identifier
  'X-Client-Version'?: string;    // Optional: Client version
}
```

## Graph Data API

### Get Graph Data

Retrieve the complete knowledge graph data or filtered subsets.

```http
GET /api/v1/graph
```

#### Query Parameters

```typescript
interface GraphQueryParams {
  categories?: string[];          // Filter by node categories
  limit?: number;                 // Maximum nodes to return (default: 1000)
  offset?: number;                // Pagination offset
  include_relationships?: boolean; // Include relationship data (default: true)
  min_connections?: number;       // Minimum connections per node
  format?: 'full' | 'minimal';   // Data detail level
}
```

#### Response

```typescript
interface GraphDataResponse {
  nodes: NodeObject[];
  links: LinkObject[];
  metadata: {
    totalNodes: number;
    totalLinks: number;
    categories: string[];
    lastUpdated: string;
    version: string;
  };
}

interface NodeObject {
  id: string;
  type: NodeType;
  label: string;
  description?: string;
  category: string;
  properties: Record<string, any>;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  metadata: {
    created: string;
    updated: string;
    source: string;
    confidence: number;
  };
}

interface LinkObject {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  weight: number;
  properties?: Record<string, any>;
  metadata: {
    created: string;
    confidence: number;
    source: string;
  };
}
```

#### Example Request

```bash
curl -X GET "https://api.research-discovery-engine.org/v1/graph?categories=materials,mechanisms&limit=500" \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json"
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "graphene-2d-material",
        "type": "MaterialNode",
        "label": "Graphene",
        "description": "Single-layer carbon atoms arranged in hexagonal lattice",
        "category": "materials",
        "properties": {
          "conductivity": 1000000,
          "youngModulus": 1000,
          "transparency": 0.977
        },
        "position": { "x": 0, "y": 0, "z": 0 },
        "metadata": {
          "created": "2023-01-01T00:00:00Z",
          "updated": "2023-12-01T00:00:00Z",
          "source": "materials-database",
          "confidence": 0.95
        }
      }
    ],
    "links": [
      {
        "id": "rel-001",
        "source": "graphene-2d-material",
        "target": "electronic-devices",
        "type": "applied-in",
        "weight": 0.8,
        "metadata": {
          "created": "2023-01-01T00:00:00Z",
          "confidence": 0.9,
          "source": "literature-analysis"
        }
      }
    ],
    "metadata": {
      "totalNodes": 1250,
      "totalLinks": 3800,
      "categories": ["materials", "mechanisms", "methods"],
      "lastUpdated": "2023-12-01T12:00:00Z",
      "version": "1.2.0"
    }
  }
}
```

### Get Single Node

Retrieve detailed information about a specific node.

```http
GET /api/v1/graph/nodes/{node_id}
```

#### Path Parameters

- `node_id` (string): Unique identifier of the node

#### Query Parameters

```typescript
interface NodeQueryParams {
  include_neighbors?: boolean;    // Include directly connected nodes
  include_properties?: boolean;   // Include all node properties
  neighbor_depth?: number;        // Depth of neighbor traversal (1-3)
}
```

#### Response

```typescript
interface NodeDetailResponse {
  node: NodeObject;
  neighbors?: NodeObject[];
  relationships?: LinkObject[];
  analytics?: {
    centrality: number;
    clustering: number;
    connections: number;
  };
}
```

### Create Node

Add a new node to the knowledge graph.

```http
POST /api/v1/graph/nodes
```

#### Request Body

```typescript
interface CreateNodeRequest {
  type: NodeType;
  label: string;
  description?: string;
  category: string;
  properties: Record<string, any>;
  relationships?: {
    target: string;
    type: RelationshipType;
    weight?: number;
  }[];
}
```

#### Response

```typescript
interface CreateNodeResponse {
  node: NodeObject;
  created_relationships?: LinkObject[];
}
```

### Update Node

Update an existing node's properties and metadata.

```http
PUT /api/v1/graph/nodes/{node_id}
```

#### Request Body

```typescript
interface UpdateNodeRequest {
  label?: string;
  description?: string;
  properties?: Record<string, any>;
  metadata?: Partial<NodeMetadata>;
}
```

### Delete Node

Remove a node and its relationships from the graph.

```http
DELETE /api/v1/graph/nodes/{node_id}
```

#### Query Parameters

```typescript
interface DeleteNodeParams {
  cascade?: boolean;              // Delete orphaned nodes (default: false)
  preserve_relationships?: boolean; // Keep relationships as metadata
}
```

## Search API

### Semantic Search

Perform semantic search across the knowledge graph.

```http
POST /api/v1/search
```

#### Request Body

```typescript
interface SearchRequest {
  query: string;
  filters?: {
    categories?: string[];
    node_types?: NodeType[];
    properties?: Record<string, any>;
    date_range?: {
      start: string;
      end: string;
    };
  };
  options?: {
    limit?: number;               // Max results (default: 50)
    offset?: number;              // Pagination offset
    include_snippets?: boolean;   // Include text snippets
    highlight?: boolean;          // Highlight matching terms
    semantic_threshold?: number;  // Minimum semantic similarity (0-1)
  };
}
```

#### Response

```typescript
interface SearchResponse {
  results: SearchResult[];
  total_count: number;
  query_analysis: {
    processed_query: string;
    extracted_concepts: string[];
    semantic_expansion: string[];
  };
  suggestions?: string[];
}

interface SearchResult {
  node: NodeObject;
  relevance_score: number;
  match_type: 'exact' | 'semantic' | 'property';
  snippets?: string[];
  highlighted_fields?: Record<string, string>;
}
```

#### Example Request

```bash
curl -X POST "https://api.research-discovery-engine.org/v1/search" \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "high conductivity materials for flexible electronics",
    "filters": {
      "categories": ["materials"],
      "properties": {
        "conductivity": {"min": 1000}
      }
    },
    "options": {
      "limit": 20,
      "include_snippets": true,
      "semantic_threshold": 0.7
    }
  }'
```

### Auto-Complete

Get search suggestions and auto-completion.

```http
GET /api/v1/search/autocomplete
```

#### Query Parameters

```typescript
interface AutoCompleteParams {
  q: string;                      // Partial query
  limit?: number;                 // Max suggestions (default: 10)
  categories?: string[];          // Filter by categories
}
```

#### Response

```typescript
interface AutoCompleteResponse {
  suggestions: {
    text: string;
    type: 'concept' | 'property' | 'category';
    count?: number;               // Number of matching items
  }[];
}
```

### Saved Searches

Manage saved search queries.

```http
GET /api/v1/search/saved
POST /api/v1/search/saved
DELETE /api/v1/search/saved/{search_id}
```

## Agent System API

### Trigger Agent Action

Invoke AI agents to perform specific actions.

```http
POST /api/v1/agents/action
```

#### Request Body

```typescript
interface AgentActionRequest {
  agent: AgentType;
  action: string;
  context?: {
    selected_nodes?: string[];
    search_query?: string;
    concept_state?: ConceptDesignState;
    user_input?: string;
  };
  parameters?: Record<string, any>;
}

type AgentType = 
  | 'discovery-engine'
  | 'search-agent'
  | 'exploration-agent'
  | 'protocol-agent'
  | 'consistency-agent'
  | 'concept-agent';
```

#### Response

```typescript
interface AgentActionResponse {
  agent: AgentType;
  action: string;
  messages: AgentMessage[];
  results?: {
    graph_updates?: {
      highlighted_nodes?: string[];
      suggested_nodes?: NodeObject[];
      new_relationships?: LinkObject[];
    };
    concept_updates?: Partial<ConceptDesignState>;
    recommendations?: Recommendation[];
  };
  metadata: {
    processing_time: number;
    confidence: number;
    reasoning?: string;
  };
}

interface AgentMessage {
  id: string;
  agent: AgentType;
  type: 'info' | 'suggestion' | 'warning' | 'question';
  content: string;
  timestamp: string;
  actions?: AgentAction[];
}

interface AgentAction {
  type: string;
  label: string;
  payload: any;
}
```

#### Example: Exploration Agent

```bash
curl -X POST "https://api.research-discovery-engine.org/v1/agents/action" \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "agent": "exploration-agent",
    "action": "find_analogies",
    "context": {
      "selected_nodes": ["piezoelectric-effect"],
      "user_input": "Find biological analogies for energy harvesting"
    }
  }'
```

### Agent Conversation

Maintain ongoing conversations with agents.

```http
POST /api/v1/agents/conversation
GET /api/v1/agents/conversation/{conversation_id}
```

#### Start Conversation

```typescript
interface StartConversationRequest {
  agent: AgentType;
  initial_message: string;
  context?: ConversationContext;
}

interface ConversationContext {
  workspace_id?: string;
  selected_nodes?: string[];
  current_task?: string;
}
```

#### Continue Conversation

```typescript
interface ContinueConversationRequest {
  conversation_id: string;
  message: string;
  context_updates?: Partial<ConversationContext>;
}
```

## Concept Design API

### Create Concept

Initialize a new concept design session.

```http
POST /api/v1/concepts
```

#### Request Body

```typescript
interface CreateConceptRequest {
  objective: string;
  initial_components?: {
    materials?: string[];
    mechanisms?: string[];
    methods?: string[];
  };
  design_constraints?: {
    temperature_range?: [number, number];
    size_constraints?: {
      max_width?: number;
      max_height?: number;
      max_depth?: number;
    };
    cost_target?: 'low' | 'medium' | 'high';
    performance_requirements?: Record<string, any>;
  };
}
```

#### Response

```typescript
interface ConceptDesignState {
  id: string;
  objective: string;
  status: ConceptStatus;
  components: {
    materials: ComponentSelection[];
    mechanisms: ComponentSelection[];
    methods: ComponentSelection[];
    applications: ComponentSelection[];
    phenomena: ComponentSelection[];
  };
  design_properties: Record<string, any>;
  validation_results?: ValidationResult[];
  protocol_outline?: ProtocolOutline;
  metadata: {
    created: string;
    updated: string;
    version: number;
    confidence: number;
  };
}

interface ComponentSelection {
  id: string;
  label: string;
  role: string;
  properties: Record<string, any>;
  confidence: number;
  alternatives?: ComponentSelection[];
}

type ConceptStatus = 
  | 'draft'
  | 'components-selected'
  | 'validated'
  | 'protocol-generated'
  | 'ready-for-implementation';
```

### Update Concept

Modify concept components and properties.

```http
PUT /api/v1/concepts/{concept_id}
```

#### Request Body

```typescript
interface UpdateConceptRequest {
  components?: {
    add?: ComponentSelection[];
    remove?: string[];
    modify?: Partial<ComponentSelection>[];
  };
  design_properties?: Record<string, any>;
  validation_requests?: string[];
}
```

### Generate Protocol

Generate experimental protocols for a concept.

```http
POST /api/v1/concepts/{concept_id}/protocol
```

#### Request Body

```typescript
interface ProtocolGenerationRequest {
  protocol_type: 'synthesis' | 'characterization' | 'testing' | 'full';
  detail_level: 'outline' | 'detailed' | 'step-by-step';
  constraints?: {
    available_equipment?: string[];
    time_constraints?: number;        // Hours
    budget_constraints?: number;      // USD
    safety_level?: 'standard' | 'high' | 'extreme';
  };
}
```

#### Response

```typescript
interface ProtocolOutline {
  id: string;
  type: string;
  overview: string;
  phases: ProtocolPhase[];
  timeline: {
    total_duration: number;         // Hours
    critical_path: string[];
  };
  resources: {
    equipment: EquipmentRequirement[];
    materials: MaterialRequirement[];
    personnel: PersonnelRequirement[];
    estimated_cost: number;
  };
  safety_considerations: string[];
  expected_outcomes: ExpectedOutcome[];
}

interface ProtocolPhase {
  id: string;
  name: string;
  description: string;
  duration: number;                 // Hours
  steps: ProtocolStep[];
  dependencies: string[];           // Phase IDs
  quality_controls: QualityControl[];
}

interface ProtocolStep {
  id: string;
  instruction: string;
  parameters: Record<string, any>;
  expected_result: string;
  troubleshooting?: string[];
}
```

### Validate Concept

Check concept consistency and feasibility.

```http
POST /api/v1/concepts/{concept_id}/validate
```

#### Request Body

```typescript
interface ValidationRequest {
  validation_types: ValidationTypeChoses[];
  strictness: 'permissive' | 'standard' | 'strict';
}

type ValidationTypes = 
  | 'compatibility'              // Component compatibility
  | 'physics'                   // Physical feasibility
  | 'synthesis'                 // Synthesis feasibility
  | 'performance'               // Performance predictions
  | 'cost'                      // Cost estimation
  | 'safety';                   // Safety assessment
```

#### Response

```typescript
interface ValidationResult {
  type: ValidationTypes;
  status: 'pass' | 'warning' | 'fail';
  confidence: number;
  details: {
    summary: string;
    issues?: ValidationIssue[];
    recommendations?: string[];
    alternatives?: ComponentSelection[];
  };
}

interface ValidationIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  affected_components: string[];
  suggested_resolution?: string;
}
```

## Document Processing API

### Upload Document

Upload and process research documents.

```http
POST /api/v1/documents/upload
```

#### Request Body (Multipart Form Data)

```typescript
interface DocumentUploadRequest {
  file: File;                     // PDF file
  metadata?: {
    title?: string;
    authors?: string[];
    journal?: string;
    year?: number;
    doi?: string;
    keywords?: string[];
  };
  processing_options?: {
    extract_concepts?: boolean;   // Extract concept entities
    extract_relationships?: boolean; // Extract relationships
    generate_summary?: boolean;   // Generate abstract summary
    confidence_threshold?: number; // Minimum confidence for extraction
  };
}
```

#### Response

```typescript
interface DocumentUploadResponse {
  document_id: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  metadata: DocumentMetadata;
  processing_results?: {
    extracted_concepts?: ExtractedConcept[];
    extracted_relationships?: ExtractedRelationship[];
    summary?: string;
    key_insights?: string[];
  };
}

interface ExtractedConcept {
  text: string;
  type: NodeType;
  confidence: number;
  context: string;
  properties?: Record<string, any>;
  suggested_node_id?: string;
}

interface ExtractedRelationship {
  source_concept: string;
  target_concept: string;
  relationship_type: RelationshipType;
  confidence: number;
  context: string;
}
```

### Get Processing Status

Check the status of document processing.

```http
GET /api/v1/documents/{document_id}/status
```

#### Response

```typescript
interface ProcessingStatus {
  document_id: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;               // 0-100
  current_stage?: string;
  estimated_completion?: string;  // ISO timestamp
  error_details?: string;
}
```

### Get Processed Results

Retrieve processing results for a document.

```http
GET /api/v1/documents/{document_id}/results
```

#### Response

```typescript
interface ProcessingResults {
  document_id: string;
  metadata: DocumentMetadata;
  extracted_concepts: ExtractedConcept[];
  extracted_relationships: ExtractedRelationship[];
  summary: string;
  key_insights: string[];
  quality_metrics: {
    extraction_confidence: number;
    completeness_score: number;
    novelty_score: number;
  };
  suggested_actions: {
    add_to_graph?: string[];      // Concept IDs to add
    update_nodes?: string[];      // Existing nodes to update
    new_relationships?: string[]; // Relationships to create
  };
}
```

### Batch Processing

Process multiple documents simultaneously.

```http
POST /api/v1/documents/batch
```

#### Request Body

```typescript
interface BatchProcessingRequest {
  documents: {
    file: File;
    metadata?: DocumentMetadata;
  }[];
  processing_options: ProcessingOptions;
  batch_options?: {
    priority?: 'low' | 'normal' | 'high';
    notification_webhook?: string;
    merge_results?: boolean;
  };
}
```

## Knowledge Graph API

### Graph Analytics

Get analytical insights about the knowledge graph.

```http
GET /api/v1/graph/analytics
```

#### Query Parameters

```typescript
interface AnalyticsParams {
  metrics?: AnalyticsMetric[];
  time_period?: 'day' | 'week' | 'month' | 'year' | 'all';
  categories?: string[];
}

type AnalyticsMetric = 
  | 'centrality'                 // Node centrality measures
  | 'clustering'                 // Clustering coefficients
  | 'communities'                // Community detection
  | 'growth'                     // Graph growth over time
  | 'connectivity'               // Connectivity patterns
  | 'diversity';                 // Category diversity
```

#### Response

```typescript
interface GraphAnalytics {
  overview: {
    total_nodes: number;
    total_relationships: number;
    categories: CategoryStats[];
    density: number;
    average_clustering: number;
  };
  centrality: {
    most_central: NodeRanking[];
    least_central: NodeRanking[];
    centrality_distribution: number[];
  };
  communities: {
    detected_communities: Community[];
    modularity_score: number;
  };
  growth_trends: {
    nodes_over_time: TimeSeriesPoint[];
    relationships_over_time: TimeSeriesPoint[];
    category_growth: CategoryGrowth[];
  };
}

interface NodeRanking {
  node_id: string;
  label: string;
  score: number;
  category: string;
}

interface Community {
  id: string;
  nodes: string[];
  size: number;
  density: number;
  dominant_categories: string[];
  description?: string;
}
```

### Path Finding

Find connections between nodes in the graph.

```http
POST /api/v1/graph/paths
```

#### Request Body

```typescript
interface PathFindingRequest {
  source: string;                 // Source node ID
  target: string;                 // Target node ID
  algorithm?: 'shortest' | 'weighted' | 'semantic';
  max_length?: number;            // Maximum path length
  filters?: {
    allowed_relationships?: RelationshipType[];
    forbidden_nodes?: string[];
    required_categories?: string[];
  };
}
```

#### Response

```typescript
interface PathFindingResponse {
  paths: GraphPath[];
  total_found: number;
  search_metadata: {
    algorithm_used: string;
    search_space_explored: number;
    computation_time: number;
  };
}

interface GraphPath {
  nodes: string[];
  relationships: string[];
  total_weight: number;
  semantic_coherence?: number;
  explanation?: string;
}
```

### Graph Export

Export graph data in various formats.

```http
GET /api/v1/graph/export
```

#### Query Parameters

```typescript
interface ExportParams {
  format: 'json' | 'graphml' | 'gexf' | 'csv' | 'neo4j';
  filters?: GraphFilters;
  options?: {
    include_metadata?: boolean;
    compress?: boolean;
    split_by_category?: boolean;
  };
}
```

#### Response

The response format depends on the requested export format. For JSON:

```typescript
interface GraphExport {
  metadata: ExportMetadata;
  nodes: NodeObject[];
  relationships: LinkObject[];
  schema: SchemaDefinition;
}
```

## User Management API

### User Profile

Manage user profiles and preferences.

```http
GET /api/v1/user/profile
PUT /api/v1/user/profile
```

#### User Profile Structure

```typescript
interface UserProfile {
  id: string;
  username: string;
  email: string;
  preferences: {
    default_categories: string[];
    visualization_settings: VisualizationSettings;
    notification_settings: NotificationSettings;
    research_interests: string[];
  };
  usage_statistics: {
    sessions_count: number;
    concepts_created: number;
    documents_processed: number;
    last_active: string;
  };
}
```

### User Concepts

Manage user-created concepts.

```http
GET /api/v1/user/concepts
POST /api/v1/user/concepts
PUT /api/v1/user/concepts/{concept_id}
DELETE /api/v1/user/concepts/{concept_id}
```

### User Collections

Organize saved concepts and searches.

```http
GET /api/v1/user/collections
POST /api/v1/user/collections
PUT /api/v1/user/collections/{collection_id}
DELETE /api/v1/user/collections/{collection_id}
```

#### Collection Structure

```typescript
interface Collection {
  id: string;
  name: string;
  description?: string;
  type: 'concepts' | 'searches' | 'documents' | 'mixed';
  items: CollectionItem[];
  tags: string[];
  shared: boolean;
  created: string;
  updated: string;
}

interface CollectionItem {
  id: string;
  type: 'concept' | 'node' | 'search' | 'document';
  title: string;
  added_date: string;
  notes?: string;
}
```

## WebSocket API

### Real-time Updates

Connect to receive real-time updates about graph changes, agent activity, and processing status.

#### Connection

```javascript
const ws = new WebSocket('wss://api.research-discovery-engine.org/v1/ws');
```

#### Authentication

```javascript
// Send authentication message after connection
ws.send(JSON.stringify({
  type: 'authenticate',
  token: 'your-access-token'
}));
```

#### Subscription

```javascript
// Subscribe to specific updates
ws.send(JSON.stringify({
  type: 'subscribe',
  channels: ['graph-updates', 'agent-activity', 'concept-changes'],
  filters: {
    categories: ['materials', 'mechanisms']
  }
}));
```

#### Message Types

```typescript
interface WebSocketMessage {
  type: 'graph-update' | 'agent-message' | 'concept-update' | 'processing-status';
  timestamp: string;
  data: any;
}

// Graph Update
interface GraphUpdateMessage {
  type: 'graph-update';
  data: {
    action: 'node-added' | 'node-updated' | 'relationship-added' | 'relationship-updated';
    affected_nodes: string[];
    changes: GraphChange[];
  };
}

// Agent Activity
interface AgentActivityMessage {
  type: 'agent-message';
  data: {
    agent: AgentType;
    message: AgentMessage;
    context?: any;
  };
}
```

## Error Handling

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    validation_errors?: ValidationError[];
  };
  meta: {
    timestamp: string;
    request_id: string;
  };
}

interface ValidationError {
  field: string;
  message: string;
  rejected_value?: any;
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|------------|-------------|
| `INVALID_REQUEST` | 400 | Malformed request body or parameters |
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Requested resource not found |
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

### Error Examples

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": "Node type 'InvalidType' is not supported",
    "validation_errors": [
      {
        "field": "type",
        "message": "Must be one of: MaterialNode, MechanismNode, MethodNode, PhenomenonNode, ApplicationNode, TheoreticalNode",
        "rejected_value": "InvalidType"
      }
    ]
  },
  "meta": {
    "timestamp": "2023-12-01T12:00:00Z",
    "request_id": "req_123456789"
  }
}
```

## Rate Limiting

### Rate Limit Headers

All responses include rate limiting information:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Window: 3600
```

### Rate Limits by Endpoint

| Endpoint Category | Requests per Hour | Burst Limit |
|------------------|-------------------|-------------|
| Graph Data | 1000 | 100 |
| Search | 500 | 50 |
| Agent Actions | 200 | 20 |
| Document Processing | 50 | 10 |
| WebSocket Connections | 10 | 5 |

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Rate limit exceeded.",
    "details": {
      "limit": 1000,
      "window": 3600,
      "reset_time": "2023-12-01T13:00:00Z"
    }
  }
}
```

## SDKs and Libraries

### JavaScript/TypeScript SDK

```bash
npm install @research-discovery-engine/sdk
```

#### Basic Usage

```typescript
import { RDEClient } from '@research-discovery-engine/sdk';

const client = new RDEClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.research-discovery-engine.org/v1'
});

// Get graph data
const graphData = await client.graph.getGraph({
  categories: ['materials', 'mechanisms'],
  limit: 500
});

// Search for concepts
const searchResults = await client.search.search({
  query: 'conductive polymers',
  filters: { categories: ['materials'] }
});

// Trigger agent action
const agentResponse = await client.agents.triggerAction({
  agent: 'exploration-agent',
  action: 'find_analogies',
  context: { selected_nodes: ['graphene-material'] }
});
```

### Python SDK

```bash
pip install research-discovery-engine-sdk
```

#### Basic Usage

```python
from rde_sdk import RDEClient

client = RDEClient(
    api_key='your-api-key',
    base_url='https://api.research-discovery-engine.org/v1'
)

# Get graph data
graph_data = client.graph.get_graph(
    categories=['materials', 'mechanisms'],
    limit=500
)

# Search for concepts
search_results = client.search.search(
    query='conductive polymers',
    filters={'categories': ['materials']}
)

# Create concept
concept = client.concepts.create_concept(
    objective='Develop flexible solar cell',
    initial_components={
        'materials': ['organic-photovoltaics'],
        'mechanisms': ['photovoltaic-effect']
    }
)
```

### CLI Tool

```bash
npm install -g @research-discovery-engine/cli
```

#### Usage Examples

```bash
# Configure authentication
rde auth login

# Search the knowledge graph
rde search "shape memory alloys"

# Export graph data
rde export --format json --categories materials --output materials.json

# Upload document
rde upload document.pdf --extract-concepts --generate-summary

# Create concept
rde create-concept --objective "Smart material for robotics" --interactive
```

---

This API reference provides comprehensive documentation for integrating with the Research Discovery Engine. For additional examples, troubleshooting, and best practices, see the [Developer Guide](developer-guide.md) and [Getting Started Guide](getting-started.md). 