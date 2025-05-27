/**
 * Research Discovery Engine - JavaScript Client Library
 * 
 * This client library provides a simplified interface for interacting with
 * the Discovery Engine API, including graph operations, search, and agent interactions.
 */

class DiscoveryEngineClient {
    constructor(options = {}) {
        this.baseURL = options.baseURL || 'http://localhost:8000/api/v1';
        this.apiKey = options.apiKey;
        this.timeout = options.timeout || 30000;
        this.headers = {
            'Content-Type': 'application/json',
            ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
            ...options.headers
        };
    }

    /**
     * Make HTTP request to the API
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: 'GET',
            headers: this.headers,
            ...options
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Request failed' }));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error?.message || 'API request failed');
            }

            return data.data;
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Failed to connect to Discovery Engine API. Make sure the backend is running.');
            }
            throw error;
        }
    }

    /**
     * Graph API Methods
     */
    graph = {
        /**
         * Get complete graph data or filtered subset
         */
        getGraph: async (filters = {}) => {
            const params = new URLSearchParams();
            
            if (filters.categories) {
                params.append('categories', Array.isArray(filters.categories) 
                    ? filters.categories.join(',') 
                    : filters.categories);
            }
            if (filters.limit) params.append('limit', filters.limit);
            if (filters.offset) params.append('offset', filters.offset);
            if (filters.minConnections) params.append('min_connections', filters.minConnections);
            if (filters.format) params.append('format', filters.format);
            
            const query = params.toString() ? `?${params.toString()}` : '';
            return await this.request(`/graph${query}`);
        },

        /**
         * Get detailed information about a specific node
         */
        getNode: async (nodeId, options = {}) => {
            const params = new URLSearchParams();
            
            if (options.includeNeighbors) params.append('include_neighbors', 'true');
            if (options.includeProperties) params.append('include_properties', 'true');
            if (options.neighborDepth) params.append('neighbor_depth', options.neighborDepth);
            
            const query = params.toString() ? `?${params.toString()}` : '';
            return await this.request(`/graph/nodes/${nodeId}${query}`);
        },

        /**
         * Create a new node in the graph
         */
        createNode: async (nodeData) => {
            return await this.request('/graph/nodes', {
                method: 'POST',
                body: nodeData
            });
        },

        /**
         * Update an existing node
         */
        updateNode: async (nodeId, updates) => {
            return await this.request(`/graph/nodes/${nodeId}`, {
                method: 'PUT',
                body: updates
            });
        },

        /**
         * Delete a node from the graph
         */
        deleteNode: async (nodeId, options = {}) => {
            const params = new URLSearchParams();
            
            if (options.cascade) params.append('cascade', 'true');
            if (options.preserveRelationships) params.append('preserve_relationships', 'true');
            
            const query = params.toString() ? `?${params.toString()}` : '';
            return await this.request(`/graph/nodes/${nodeId}${query}`, {
                method: 'DELETE'
            });
        },

        /**
         * Find paths between nodes
         */
        findPaths: async (source, target, options = {}) => {
            return await this.request('/graph/paths', {
                method: 'POST',
                body: {
                    source,
                    target,
                    algorithm: options.algorithm || 'shortest',
                    max_length: options.maxLength,
                    filters: options.filters
                }
            });
        },

        /**
         * Get graph analytics
         */
        getAnalytics: async (options = {}) => {
            const params = new URLSearchParams();
            
            if (options.metrics) {
                params.append('metrics', Array.isArray(options.metrics) 
                    ? options.metrics.join(',') 
                    : options.metrics);
            }
            if (options.timePeriod) params.append('time_period', options.timePeriod);
            if (options.categories) {
                params.append('categories', Array.isArray(options.categories) 
                    ? options.categories.join(',') 
                    : options.categories);
            }
            
            const query = params.toString() ? `?${params.toString()}` : '';
            return await this.request(`/graph/analytics${query}`);
        }
    };

    /**
     * Search API Methods
     */
    search = {
        /**
         * Perform semantic search across the knowledge graph
         */
        search: async (query, options = {}) => {
            return await this.request('/search', {
                method: 'POST',
                body: {
                    query,
                    filters: options.filters,
                    options: {
                        limit: options.limit || 50,
                        offset: options.offset,
                        include_snippets: options.includeSnippets,
                        highlight: options.highlight,
                        semantic_threshold: options.semanticThreshold
                    }
                }
            });
        },

        /**
         * Get search auto-completion suggestions
         */
        autocomplete: async (partialQuery, options = {}) => {
            const params = new URLSearchParams();
            params.append('q', partialQuery);
            
            if (options.limit) params.append('limit', options.limit);
            if (options.categories) {
                params.append('categories', Array.isArray(options.categories) 
                    ? options.categories.join(',') 
                    : options.categories);
            }
            
            return await this.request(`/search/autocomplete?${params.toString()}`);
        },

        /**
         * Get saved searches
         */
        getSavedSearches: async () => {
            return await this.request('/search/saved');
        },

        /**
         * Save a search query
         */
        saveSearch: async (name, query, filters = {}) => {
            return await this.request('/search/saved', {
                method: 'POST',
                body: { name, query, filters }
            });
        },

        /**
         * Delete a saved search
         */
        deleteSavedSearch: async (searchId) => {
            return await this.request(`/search/saved/${searchId}`, {
                method: 'DELETE'
            });
        }
    };

    /**
     * Agent System API Methods
     */
    agents = {
        /**
         * Trigger an agent action
         */
        triggerAction: async (agent, action, context = {}, parameters = {}) => {
            return await this.request('/agents/action', {
                method: 'POST',
                body: {
                    agent,
                    action,
                    context,
                    parameters
                }
            });
        },

        /**
         * Start a conversation with an agent
         */
        startConversation: async (agent, initialMessage, context = {}) => {
            return await this.request('/agents/conversation', {
                method: 'POST',
                body: {
                    agent,
                    initial_message: initialMessage,
                    context
                }
            });
        },

        /**
         * Continue an existing conversation
         */
        continueConversation: async (conversationId, message, contextUpdates = {}) => {
            return await this.request('/agents/conversation', {
                method: 'POST',
                body: {
                    conversation_id: conversationId,
                    message,
                    context_updates: contextUpdates
                }
            });
        },

        /**
         * Get conversation history
         */
        getConversation: async (conversationId) => {
            return await this.request(`/agents/conversation/${conversationId}`);
        }
    };

    /**
     * Concept Design API Methods
     */
    concepts = {
        /**
         * Create a new concept design
         */
        create: async (objective, initialComponents = {}, constraints = {}) => {
            return await this.request('/concepts', {
                method: 'POST',
                body: {
                    objective,
                    initial_components: initialComponents,
                    design_constraints: constraints
                }
            });
        },

        /**
         * Update a concept design
         */
        update: async (conceptId, updates) => {
            return await this.request(`/concepts/${conceptId}`, {
                method: 'PUT',
                body: updates
            });
        },

        /**
         * Get concept design details
         */
        get: async (conceptId) => {
            return await this.request(`/concepts/${conceptId}`);
        },

        /**
         * Generate protocol for a concept
         */
        generateProtocol: async (conceptId, options = {}) => {
            return await this.request(`/concepts/${conceptId}/protocol`, {
                method: 'POST',
                body: {
                    protocol_type: options.type || 'full',
                    detail_level: options.detailLevel || 'detailed',
                    constraints: options.constraints
                }
            });
        },

        /**
         * Validate a concept design
         */
        validate: async (conceptId, validationTypes = ['compatibility', 'physics'], strictness = 'standard') => {
            return await this.request(`/concepts/${conceptId}/validate`, {
                method: 'POST',
                body: {
                    validation_types: validationTypes,
                    strictness
                }
            });
        },

        /**
         * List user's concept designs
         */
        list: async () => {
            return await this.request('/concepts');
        },

        /**
         * Delete a concept design
         */
        delete: async (conceptId) => {
            return await this.request(`/concepts/${conceptId}`, {
                method: 'DELETE'
            });
        }
    };

    /**
     * Document Processing API Methods
     */
    documents = {
        /**
         * Upload and process a document
         */
        upload: async (file, metadata = {}, processingOptions = {}) => {
            const formData = new FormData();
            formData.append('file', file);
            
            if (Object.keys(metadata).length > 0) {
                formData.append('metadata', JSON.stringify(metadata));
            }
            
            if (Object.keys(processingOptions).length > 0) {
                formData.append('processing_options', JSON.stringify(processingOptions));
            }

            const headers = { ...this.headers };
            delete headers['Content-Type']; // Let browser set multipart boundary

            return await this.request('/documents/upload', {
                method: 'POST',
                headers,
                body: formData
            });
        },

        /**
         * Get document processing status
         */
        getStatus: async (documentId) => {
            return await this.request(`/documents/${documentId}/status`);
        },

        /**
         * Get document processing results
         */
        getResults: async (documentId) => {
            return await this.request(`/documents/${documentId}/results`);
        },

        /**
         * List processed documents
         */
        list: async () => {
            return await this.request('/documents');
        },

        /**
         * Delete a document
         */
        delete: async (documentId) => {
            return await this.request(`/documents/${documentId}`, {
                method: 'DELETE'
            });
        }
    };

    /**
     * Health check
     */
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL.replace('/api/v1', '')}/health/`);
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * WebSocket connection for real-time updates
     */
    connectWebSocket(options = {}) {
        const wsUrl = this.baseURL.replace('http://', 'ws://').replace('https://', 'wss://').replace('/api/v1', '/ws');
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            // Authenticate if API key is available
            if (this.apiKey) {
                ws.send(JSON.stringify({
                    type: 'authenticate',
                    token: this.apiKey
                }));
            }

            // Subscribe to channels
            if (options.channels) {
                ws.send(JSON.stringify({
                    type: 'subscribe',
                    channels: options.channels,
                    filters: options.filters
                }));
            }

            if (options.onConnect) options.onConnect();
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (options.onMessage) options.onMessage(message);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        ws.onerror = (error) => {
            if (options.onError) options.onError(error);
        };

        ws.onclose = () => {
            if (options.onClose) options.onClose();
        };

        return ws;
    }
}

/**
 * Utility functions
 */
export const utils = {
    /**
     * Format node data for display
     */
    formatNode: (node) => ({
        id: node.id,
        label: node.label || node.id,
        type: node.type,
        category: node.category,
        description: node.description,
        properties: node.properties || {}
    }),

    /**
     * Format relationship data for display
     */
    formatRelationship: (rel) => ({
        id: rel.id,
        source: rel.source,
        target: rel.target,
        type: rel.type,
        weight: rel.weight || 1.0,
        label: rel.type.replace('-', ' ').replace('_', ' ')
    }),

    /**
     * Filter nodes by category
     */
    filterByCategory: (nodes, categories) => {
        const categorySet = new Set(Array.isArray(categories) ? categories : [categories]);
        return nodes.filter(node => categorySet.has(node.category));
    },

    /**
     * Find connected components in graph
     */
    findConnectedComponents: (nodes, links) => {
        const nodeMap = new Map(nodes.map(n => [n.id, n]));
        const adjacency = new Map();
        
        // Build adjacency list
        nodes.forEach(node => adjacency.set(node.id, new Set()));
        links.forEach(link => {
            if (adjacency.has(link.source)) adjacency.get(link.source).add(link.target);
            if (adjacency.has(link.target)) adjacency.get(link.target).add(link.source);
        });

        const visited = new Set();
        const components = [];

        const dfs = (nodeId, component) => {
            if (visited.has(nodeId)) return;
            visited.add(nodeId);
            component.push(nodeMap.get(nodeId));
            
            for (const neighbor of adjacency.get(nodeId) || []) {
                dfs(neighbor, component);
            }
        };

        for (const node of nodes) {
            if (!visited.has(node.id)) {
                const component = [];
                dfs(node.id, component);
                components.push(component);
            }
        }

        return components;
    },

    /**
     * Calculate node centrality measures
     */
    calculateCentrality: (nodes, links) => {
        const nodeIds = nodes.map(n => n.id);
        const adjacency = new Map();
        
        // Initialize adjacency list
        nodeIds.forEach(id => adjacency.set(id, []));
        links.forEach(link => {
            if (adjacency.has(link.source)) adjacency.get(link.source).push(link.target);
            if (adjacency.has(link.target)) adjacency.get(link.target).push(link.source);
        });

        // Calculate degree centrality
        const centrality = {};
        nodeIds.forEach(id => {
            centrality[id] = {
                degree: adjacency.get(id).length,
                normalized: adjacency.get(id).length / (nodeIds.length - 1)
            };
        });

        return centrality;
    }
};

export default DiscoveryEngineClient; 