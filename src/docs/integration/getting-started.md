# Integration Getting Started Guide

This guide helps you integrate the Research Discovery Engine (RDE) into your existing projects and workflows.

## Quick Integration Checklist

- [ ] RDE backend running and accessible
- [ ] API credentials configured (if required)
- [ ] Client library installed
- [ ] First API call successful
- [ ] Error handling implemented
- [ ] Real-time updates configured (optional)

## Installation Options

### Option 1: JavaScript/TypeScript Projects

```bash
# Using the provided client library
cp -r src/utils/de-client/ your-project/lib/
npm install node-fetch  # If using Node.js
```

```javascript
import DiscoveryEngineClient from './lib/de-client/index.js';

const client = new DiscoveryEngineClient({
    baseURL: 'http://localhost:8000/api/v1',
    apiKey: 'your-api-key' // Optional
});
```

### Option 2: Python Projects

```python
import requests
import json

class DEClient:
    def __init__(self, base_url='http://localhost:8000/api/v1', api_key=None):
        self.base_url = base_url
        self.headers = {'Content-Type': 'application/json'}
        if api_key:
            self.headers['Authorization'] = f'Bearer {api_key}'
    
    def search(self, query, **options):
        response = requests.post(
            f'{self.base_url}/search',
            headers=self.headers,
            json={'query': query, 'options': options}
        )
        return response.json()
```

### Option 3: cURL/HTTP Requests

```bash
# Basic search request
curl -X POST "http://localhost:8000/api/v1/search" \
     -H "Content-Type: application/json" \
     -d '{"query": "smart materials", "options": {"limit": 10}}'
```

## Basic Integration Patterns

### 1. Knowledge Graph Explorer

Integrate RDE as a knowledge exploration component:

```javascript
// React component example
import { useState, useEffect } from 'react';
import DiscoveryEngineClient from './lib/de-client';

export function KnowledgeExplorer({ category = 'materials' }) {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const client = new DiscoveryEngineClient();
    
    useEffect(() => {
        async function loadData() {
            try {
                const data = await client.graph.getGraph({
                    categories: [category],
                    limit: 50
                });
                setNodes(data.nodes);
            } catch (error) {
                console.error('Failed to load graph data:', error);
            } finally {
                setLoading(false);
            }
        }
        
        loadData();
    }, [category]);
    
    if (loading) return <div>Loading knowledge graph...</div>;
    
    return (
        <div>
            <h2>Knowledge Graph: {category}</h2>
            <ul>
                {nodes.map(node => (
                    <li key={node.id}>
                        <strong>{node.label}</strong> - {node.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

### 2. Intelligent Search Interface

Add AI-powered search to your application:

```javascript
export function SmartSearch({ onResult }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const client = new DiscoveryEngineClient();
    
    // Auto-completion
    const handleInputChange = async (value) => {
        setQuery(value);
        if (value.length > 2) {
            const suggestions = await client.search.autocomplete(value);
            setSuggestions(suggestions.suggestions);
        }
    };
    
    // Search execution
    const handleSearch = async () => {
        const results = await client.search.search(query, {
            limit: 20,
            includeSnippets: true
        });
        onResult(results);
    };
    
    return (
        <div>
            <input
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Search knowledge base..."
            />
            <button onClick={handleSearch}>Search</button>
            
            {suggestions.length > 0 && (
                <ul>
                    {suggestions.map(suggestion => (
                        <li key={suggestion.text} onClick={() => setQuery(suggestion.text)}>
                            {suggestion.text} ({suggestion.type})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
```

### 3. Concept Design Assistant

Integrate AI-assisted concept design:

```javascript
export function ConceptDesigner() {
    const [objective, setObjective] = useState('');
    const [concept, setConcept] = useState(null);
    const client = new DiscoveryEngineClient();
    
    const createConcept = async () => {
        const newConcept = await client.concepts.create(
            objective,
            {}, // Initial components
            {} // Constraints
        );
        setConcept(newConcept);
    };
    
    const validateConcept = async () => {
        if (!concept) return;
        
        const validation = await client.concepts.validate(
            concept.id,
            ['compatibility', 'physics']
        );
        
        console.log('Validation results:', validation);
    };
    
    return (
        <div>
            <input
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Describe your concept objective..."
            />
            <button onClick={createConcept}>Create Concept</button>
            
            {concept && (
                <div>
                    <h3>Concept: {concept.objective}</h3>
                    <p>Status: {concept.status}</p>
                    <button onClick={validateConcept}>Validate Design</button>
                </div>
            )}
        </div>
    );
}
```

## Advanced Integration

### Real-time Updates

Subscribe to real-time graph updates:

```javascript
function setupRealtimeUpdates() {
    const client = new DiscoveryEngineClient();
    
    const ws = client.connectWebSocket({
        channels: ['graph-updates', 'agent-activity'],
        filters: { categories: ['materials'] },
        
        onConnect: () => {
            console.log('Connected to real-time updates');
        },
        
        onMessage: (message) => {
            switch (message.type) {
                case 'graph-update':
                    handleGraphUpdate(message.data);
                    break;
                case 'agent-message':
                    handleAgentMessage(message.data);
                    break;
            }
        }
    });
    
    return ws;
}
```

### Error Handling & Retry Logic

Implement robust error handling:

```javascript
class RobustDEClient extends DiscoveryEngineClient {
    async requestWithRetry(endpoint, options = {}, maxRetries = 3) {
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                return await this.request(endpoint, options);
            } catch (error) {
                if (attempt === maxRetries - 1) throw error;
                
                // Exponential backoff
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                
                console.log(`Retrying request (attempt ${attempt + 2}/${maxRetries})`);
            }
        }
    }
}
```

### Caching Strategy

Implement client-side caching:

```javascript
class CachedDEClient extends DiscoveryEngineClient {
    constructor(options = {}) {
        super(options);
        this.cache = new Map();
        this.cacheTimeout = options.cacheTimeout || 5 * 60 * 1000; // 5 minutes
    }
    
    async graph.getGraph(filters = {}) {
        const cacheKey = JSON.stringify(filters);
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        
        const data = await super.graph.getGraph(filters);
        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
        
        return data;
    }
}
```

## Integration with Popular Frameworks

### React/Next.js

```javascript
// hooks/useDiscoveryEngine.js
import { useState, useEffect, useContext, createContext } from 'react';
import DiscoveryEngineClient from '../lib/de-client';

const DEContext = createContext();

export function DEProvider({ children, config }) {
    const client = new DiscoveryEngineClient(config);
    
    return (
        <DEContext.Provider value={client}>
            {children}
        </DEContext.Provider>
    );
}

export function useDiscoveryEngine() {
    const client = useContext(DEContext);
    if (!client) {
        throw new Error('useDiscoveryEngine must be used within DEProvider');
    }
    return client;
}

export function useGraphData(filters = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const client = useDiscoveryEngine();
    
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const graphData = await client.graph.getGraph(filters);
                setData(graphData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        
        fetchData();
    }, [JSON.stringify(filters)]);
    
    return { data, loading, error };
}
```

### Vue.js

```javascript
// plugins/discovery-engine.js
import DiscoveryEngineClient from '../lib/de-client';

export default {
    install(Vue, options) {
        const client = new DiscoveryEngineClient(options);
        
        Vue.prototype.$de = client;
        Vue.mixin({
            beforeCreate() {
                if (this.$options.discoveryEngine) {
                    this._de = this.$options.discoveryEngine;
                } else if (this.$parent && this.$parent._de) {
                    this._de = this.$parent._de;
                }
            }
        });
    }
};

// Component usage
export default {
    data() {
        return {
            nodes: [],
            loading: true
        };
    },
    
    async mounted() {
        try {
            const data = await this.$de.graph.getGraph({
                categories: ['materials']
            });
            this.nodes = data.nodes;
        } catch (error) {
            console.error('Failed to load graph data:', error);
        } finally {
            this.loading = false;
        }
    }
};
```

### Angular

```typescript
// services/discovery-engine.service.ts
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import DiscoveryEngineClient from '../lib/de-client';

@Injectable({
    providedIn: 'root'
})
export class DiscoveryEngineService {
    private client: DiscoveryEngineClient;
    
    constructor() {
        this.client = new DiscoveryEngineClient({
            baseURL: environment.deApiUrl
        });
    }
    
    getGraph(filters: any = {}): Observable<any> {
        return from(this.client.graph.getGraph(filters));
    }
    
    search(query: string, options: any = {}): Observable<any> {
        return from(this.client.search.search(query, options));
    }
}

// Component usage
export class GraphComponent implements OnInit {
    nodes$ = this.deService.getGraph({ categories: ['materials'] });
    
    constructor(private deService: DiscoveryEngineService) {}
}
```

## Configuration Management

### Environment-based Configuration

```javascript
// config/discovery-engine.js
const configs = {
    development: {
        baseURL: 'http://localhost:8000/api/v1',
        timeout: 30000,
        retries: 3
    },
    
    staging: {
        baseURL: 'https://staging-api.discovery-engine.com/api/v1',
        apiKey: process.env.DE_API_KEY,
        timeout: 15000,
        retries: 2
    },
    
    production: {
        baseURL: 'https://api.discovery-engine.com/api/v1',
        apiKey: process.env.DE_API_KEY,
        timeout: 10000,
        retries: 5
    }
};

export default configs[process.env.NODE_ENV] || configs.development;
```

### Feature Flags

```javascript
// config/features.js
export const features = {
    realtimeUpdates: process.env.ENABLE_REALTIME === 'true',
    conceptDesign: process.env.ENABLE_CONCEPT_DESIGN === 'true',
    advancedAnalytics: process.env.ENABLE_ANALYTICS === 'true'
};

// Usage in components
if (features.conceptDesign) {
    // Show concept design interface
}
```

## Testing Integration

### Unit Tests

```javascript
// tests/discovery-engine.test.js
import { jest } from '@jest/globals';
import DiscoveryEngineClient from '../lib/de-client';

describe('DiscoveryEngineClient', () => {
    let client;
    
    beforeEach(() => {
        client = new DiscoveryEngineClient({
            baseURL: 'http://localhost:8000/api/v1'
        });
    });
    
    test('should fetch graph data', async () => {
        const mockData = { nodes: [], links: [] };
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ success: true, data: mockData })
        });
        
        const result = await client.graph.getGraph();
        expect(result).toEqual(mockData);
    });
    
    test('should handle API errors', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            json: () => Promise.resolve({ 
                success: false, 
                error: { message: 'API Error' } 
            })
        });
        
        await expect(client.graph.getGraph()).rejects.toThrow('API Error');
    });
});
```

### Integration Tests

```javascript
// tests/integration.test.js
describe('Discovery Engine Integration', () => {
    let client;
    
    beforeAll(async () => {
        client = new DiscoveryEngineClient();
        
        // Wait for backend to be ready
        let retries = 10;
        while (retries > 0) {
            try {
                const healthy = await client.healthCheck();
                if (healthy) break;
            } catch (error) {
                // Backend not ready yet
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            retries--;
        }
        
        if (retries === 0) {
            throw new Error('Backend not available for integration tests');
        }
    });
    
    test('should perform end-to-end search', async () => {
        const results = await client.search.search('materials');
        expect(results.results).toBeDefined();
        expect(Array.isArray(results.results)).toBe(true);
    });
});
```

## Common Integration Issues

### CORS Configuration

If experiencing CORS issues:

```python
# In your Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React dev server
    "http://127.0.0.1:3000",
    "https://your-frontend-domain.com",
]

CORS_ALLOW_CREDENTIALS = True
```

### Authentication Issues

```javascript
// Check if authentication is working
async function testAuth() {
    const client = new DiscoveryEngineClient({
        apiKey: 'your-api-key'
    });
    
    try {
        await client.graph.getGraph();
        console.log('Authentication successful');
    } catch (error) {
        if (error.message.includes('401')) {
            console.log('Authentication failed - check API key');
        }
    }
}
```

### Performance Optimization

```javascript
// Implement request batching
class BatchedDEClient extends DiscoveryEngineClient {
    constructor(options = {}) {
        super(options);
        this.batchSize = options.batchSize || 10;
        this.requestQueue = [];
        this.batchTimeout = null;
    }
    
    async batchRequest(endpoint, options) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ endpoint, options, resolve, reject });
            
            if (this.requestQueue.length >= this.batchSize) {
                this.processBatch();
            } else if (!this.batchTimeout) {
                this.batchTimeout = setTimeout(() => this.processBatch(), 100);
            }
        });
    }
    
    async processBatch() {
        const batch = this.requestQueue.splice(0, this.batchSize);
        this.batchTimeout = null;
        
        // Process batch requests
        const promises = batch.map(({ endpoint, options, resolve, reject }) => {
            this.request(endpoint, options).then(resolve).catch(reject);
        });
        
        await Promise.allSettled(promises);
    }
}
```

## Next Steps

1. **Choose your integration pattern** based on your application needs
2. **Implement error handling** and retry logic
3. **Add caching** for better performance
4. **Set up monitoring** to track API usage
5. **Test thoroughly** with different scenarios
6. **Consider real-time features** for dynamic applications

For more detailed examples, see:
- `src/examples/` - Complete example projects
- `docs/api-reference.md` - Full API documentation
- `src/docs/troubleshooting/` - Common issues and solutions 