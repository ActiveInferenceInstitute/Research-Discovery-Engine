#!/usr/bin/env node

/**
 * Basic Usage Example for Research Discovery Engine
 * 
 * This example demonstrates the fundamental operations you can perform
 * with the Discovery Engine, including graph exploration, search, and
 * concept design.
 */

import DiscoveryEngineClient from '../../utils/de-client/index.js';

// Configuration
const config = {
    baseURL: process.env.DE_API_URL || 'http://localhost:8000/api/v1',
    apiKey: process.env.DE_API_KEY, // Optional for local development
};

async function main() {
    console.log('🚀 Research Discovery Engine - Basic Usage Example\n');

    // Initialize the client
    const client = new DiscoveryEngineClient(config);

    try {
        // 1. Health Check
        console.log('1. Testing connection...');
        const isHealthy = await client.healthCheck();
        if (!isHealthy) {
            console.error('❌ Cannot connect to Discovery Engine API');
            console.log('💡 Make sure the backend is running:');
            console.log('   cd resnei && python manage.py runserver');
            return;
        }
        console.log('✅ Connected to Discovery Engine API\n');

        // 2. Explore the Knowledge Graph
        console.log('2. Exploring the knowledge graph...');
        const graphData = await client.graph.getGraph({
            limit: 20,
            categories: ['materials', 'mechanisms']
        });
        
        console.log(`   📊 Found ${graphData.nodes.length} nodes and ${graphData.links.length} relationships`);
        
        if (graphData.nodes.length > 0) {
            console.log('   📝 Sample nodes:');
            graphData.nodes.slice(0, 3).forEach(node => {
                console.log(`      - ${node.label} (${node.type})`);
            });
        }
        console.log();

        // 3. Search for Concepts
        console.log('3. Searching for concepts...');
        const searchResults = await client.search.search('conductive materials', {
            limit: 5,
            includeSnippets: true
        });
        
        console.log(`   🔍 Found ${searchResults.results.length} search results`);
        searchResults.results.forEach((result, index) => {
            console.log(`      ${index + 1}. ${result.node.label} (relevance: ${result.relevance_score.toFixed(2)})`);
        });
        console.log();

        // 4. Get Node Details
        if (graphData.nodes.length > 0) {
            console.log('4. Getting detailed node information...');
            const firstNode = graphData.nodes[0];
            const nodeDetails = await client.graph.getNode(firstNode.id, {
                includeNeighbors: true,
                includeProperties: true
            });
            
            console.log(`   📋 Details for: ${nodeDetails.node.label}`);
            console.log(`      Type: ${nodeDetails.node.type}`);
            console.log(`      Category: ${nodeDetails.node.category}`);
            console.log(`      Description: ${nodeDetails.node.description || 'No description'}`);
            
            if (nodeDetails.neighbors && nodeDetails.neighbors.length > 0) {
                console.log(`      Connected to ${nodeDetails.neighbors.length} other concepts`);
            }
            console.log();
        }

        // 5. Agent Interaction
        console.log('5. Interacting with AI agents...');
        try {
            const agentResponse = await client.agents.triggerAction(
                'exploration-agent',
                'suggest_related_concepts',
                {
                    selected_nodes: graphData.nodes.slice(0, 2).map(n => n.id),
                    user_input: 'Find materials with similar properties'
                }
            );
            
            console.log(`   🤖 Agent response: ${agentResponse.messages[0].content}`);
            
            if (agentResponse.results && agentResponse.results.suggested_nodes) {
                console.log(`      💡 Suggested ${agentResponse.results.suggested_nodes.length} related concepts`);
            }
        } catch (error) {
            console.log(`   ⚠️  Agent interaction not available: ${error.message}`);
        }
        console.log();

        // 6. Concept Design
        console.log('6. Creating a concept design...');
        try {
            const concept = await client.concepts.create(
                'Develop a flexible electronic material',
                {
                    materials: ['polymer-matrix'],
                    mechanisms: ['conductivity-mechanism']
                },
                {
                    temperature_range: [250, 350],
                    flexibility: 'high'
                }
            );
            
            console.log(`   🧪 Created concept: ${concept.id}`);
            console.log(`      Objective: ${concept.objective}`);
            console.log(`      Status: ${concept.status}`);
            
            // Try to validate the concept
            const validation = await client.concepts.validate(concept.id, ['compatibility']);
            console.log(`      ✅ Validation status: ${validation[0].status}`);
            
        } catch (error) {
            console.log(`   ⚠️  Concept design not available: ${error.message}`);
        }
        console.log();

        // 7. Get Auto-completion Suggestions
        console.log('7. Testing search auto-completion...');
        const suggestions = await client.search.autocomplete('carbon', { limit: 5 });
        
        console.log('   💭 Auto-completion suggestions:');
        suggestions.suggestions.forEach(suggestion => {
            console.log(`      - ${suggestion.text} (${suggestion.type})`);
        });
        console.log();

        // 8. Graph Analytics
        console.log('8. Getting graph analytics...');
        try {
            const analytics = await client.graph.getAnalytics({
                metrics: ['centrality', 'clustering']
            });
            
            console.log('   📈 Graph analytics:');
            console.log(`      Total nodes: ${analytics.overview.total_nodes}`);
            console.log(`      Total relationships: ${analytics.overview.total_relationships}`);
            console.log(`      Graph density: ${analytics.overview.density.toFixed(3)}`);
            
            if (analytics.centrality && analytics.centrality.most_central.length > 0) {
                console.log('      Most central concepts:');
                analytics.centrality.most_central.slice(0, 3).forEach(node => {
                    console.log(`        - ${node.label} (centrality: ${node.score.toFixed(3)})`);
                });
            }
        } catch (error) {
            console.log(`   ⚠️  Analytics not available: ${error.message}`);
        }
        console.log();

        console.log('🎉 Basic usage example completed successfully!');
        console.log('\n📖 Next steps:');
        console.log('   - Explore the full API documentation: docs/api-reference.md');
        console.log('   - Try the specialized examples in src/examples/');
        console.log('   - Check out the user guide: docs/user-guide.md');

    } catch (error) {
        console.error('❌ Error occurred:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Make sure the Discovery Engine backend is running');
        console.log('   2. Check the API URL configuration');
        console.log('   3. Verify your API key (if using authentication)');
        console.log('   4. See docs/troubleshooting/ for more help');
    }
}

// Utility function to demonstrate graph operations
export async function demonstrateGraphOperations() {
    const client = new DiscoveryEngineClient(config);
    
    console.log('🔗 Graph Operations Demo\n');
    
    // Get materials and find connections
    const materials = await client.graph.getGraph({
        categories: ['materials'],
        limit: 10
    });
    
    if (materials.nodes.length >= 2) {
        const source = materials.nodes[0].id;
        const target = materials.nodes[1].id;
        
        console.log(`Finding paths between ${materials.nodes[0].label} and ${materials.nodes[1].label}...`);
        
        try {
            const paths = await client.graph.findPaths(source, target, {
                algorithm: 'shortest',
                maxLength: 3
            });
            
            console.log(`Found ${paths.paths.length} connection paths`);
            paths.paths.slice(0, 2).forEach((path, index) => {
                console.log(`  Path ${index + 1}: ${path.nodes.join(' → ')}`);
            });
        } catch (error) {
            console.log('Path finding not available:', error.message);
        }
    }
}

// Utility function to demonstrate search capabilities
export async function demonstrateSearchCapabilities() {
    const client = new DiscoveryEngineClient(config);
    
    console.log('🔍 Search Capabilities Demo\n');
    
    const searchQueries = [
        'smart materials',
        'energy harvesting',
        'biocompatible polymers',
        'quantum dots'
    ];
    
    for (const query of searchQueries) {
        try {
            const results = await client.search.search(query, {
                limit: 3,
                semanticThreshold: 0.7
            });
            
            console.log(`Query: "${query}" (${results.results.length} results)`);
            results.results.forEach(result => {
                console.log(`  - ${result.node.label} (${result.relevance_score.toFixed(2)})`);
            });
            console.log();
        } catch (error) {
            console.log(`Search failed for "${query}":`, error.message);
        }
    }
}

// Utility function to demonstrate WebSocket real-time updates
export function demonstrateWebSocket() {
    const client = new DiscoveryEngineClient(config);
    
    console.log('🔄 WebSocket Real-time Updates Demo\n');
    
    const ws = client.connectWebSocket({
        channels: ['graph-updates', 'agent-activity'],
        onConnect: () => {
            console.log('✅ Connected to real-time updates');
        },
        onMessage: (message) => {
            console.log('📨 Real-time update:', message.type);
            if (message.type === 'graph-update') {
                console.log(`   Graph change: ${message.data.action}`);
            } else if (message.type === 'agent-message') {
                console.log(`   Agent: ${message.data.agent} - ${message.data.message.content}`);
            }
        },
        onError: (error) => {
            console.log('❌ WebSocket error:', error);
        },
        onClose: () => {
            console.log('🔌 WebSocket connection closed');
        }
    });
    
    // Close connection after 10 seconds
    setTimeout(() => {
        ws.close();
        console.log('Demo completed - connection closed');
    }, 10000);
    
    return ws;
}

// Run the main demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
} 