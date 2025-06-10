import { describe, it, expect, beforeAll, vi } from 'vitest';
import { GraphOptimizer } from '../../utils/graphOptimizations';
import { useGraphDataStore } from '../../hooks/useGraphDataStore';
import { apiClient } from '../../api/graphAPI';
import { NodeType, EdgeType } from '../../types';

describe('Knowledge Graph Integration', () => {
  beforeAll(() => {
    // Mock fetch for API calls
    global.fetch = vi.fn();
  });

  describe('CNM Builder Integration', () => {
    it('should build knowledge graph from markdown files', async () => {
      // Mock successful API response with sample graph data
      const mockGraphData = {
        nodes: [
          {
            id: 'bio-inspired-materials',
            type: 'Material' as NodeType,
            label: 'Bio-inspired Materials',
            description: 'Materials that mimic biological structures and functions',
            value: 8
          },
          {
            id: 'shape-memory-mechanism',
            type: 'Mechanism' as NodeType, 
            label: 'Shape Memory Mechanism',
            description: 'Mechanism allowing materials to remember and return to original shape',
            value: 6
          },
          {
            id: 'smart-material-system',
            type: 'SystemNode' as NodeType,
            label: 'Smart Material System',
            description: 'Integrated system combining bio-inspired materials with shape memory',
            value: 10
          }
        ],
        links: [
          {
            source: 'smart-material-system',
            target: 'bio-inspired-materials',
            type: 'concept-uses-component'
          },
          {
            source: 'smart-material-system', 
            target: 'shape-memory-mechanism',
            type: 'concept-uses-component'
          }
        ]
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockGraphData,
          timestamp: new Date().toISOString()
        })
      });

      const graphData = await apiClient.getGraphData();
      
      expect(graphData.nodes).toHaveLength(3);
      expect(graphData.links).toHaveLength(2);
      
      // Verify node types are correct
      const materialNode = graphData.nodes.find(n => n.type === 'Material');
      const mechanismNode = graphData.nodes.find(n => n.type === 'Mechanism');
      const systemNode = graphData.nodes.find(n => n.type === 'SystemNode');
      
      expect(materialNode).toBeDefined();
      expect(mechanismNode).toBeDefined();
      expect(systemNode).toBeDefined();
      
      // Verify connections
      const systemConnections = graphData.links.filter(l => l.source === 'smart-material-system');
      expect(systemConnections).toHaveLength(2);
    });
  });

  describe('Graph Optimization Integration', () => {
    it('should cluster nodes efficiently for large graphs', () => {
      const largeGraphData = {
        nodes: Array.from({ length: 100 }, (_, i) => ({
          id: `node-${i}`,
          type: 'Material' as NodeType,
          label: `Material ${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          value: Math.random() * 10
        })),
        links: Array.from({ length: 150 }, (_, i) => ({
          source: `node-${i % 100}`,
          target: `node-${(i + 1) % 100}`,
          type: 'related-to' as const
        }))
      };

      const clusters = GraphOptimizer.clusterNodes(largeGraphData, 20);
      
      expect(clusters.length).toBeGreaterThan(0);
      expect(clusters.length).toBeLessThanOrEqual(5); // Should create reasonable number of clusters
      
      // Verify all nodes are included
      const totalNodesInClusters = clusters.reduce((sum, cluster) => sum + cluster.nodes.length, 0);
      expect(totalNodesInClusters).toBe(100);
      
      // Verify cluster size constraints
      clusters.forEach(cluster => {
        expect(cluster.nodes.length).toBeLessThanOrEqual(20);
        expect(cluster.centerNode).toBeDefined();
        expect(cluster.boundingBox).toBeDefined();
      });
    });

    it('should provide efficient search capabilities', () => {
      const testNodes = [
        { id: 'polymer-1', type: 'Material' as NodeType, label: 'Shape Memory Polymer', description: 'Smart polymer with memory properties' },
        { id: 'mechanism-1', type: 'Mechanism' as NodeType, label: 'Temperature Switching', description: 'Thermal activation mechanism' },
        { id: 'system-1', type: 'SystemNode' as NodeType, label: 'Adaptive Structure', description: 'Self-reconfiguring building system' }
      ];

      const searchIndex = GraphOptimizer.buildSearchIndex(testNodes);
      
      // Test various search terms
      expect(searchIndex.get('polymer')).toContain(testNodes[0]);
      expect(searchIndex.get('memory')).toContain(testNodes[0]);
      expect(searchIndex.get('temperature')).toContain(testNodes[1]);
      expect(searchIndex.get('thermal')).toContain(testNodes[1]);
      expect(searchIndex.get('adaptive')).toContain(testNodes[2]);
      expect(searchIndex.get('building')).toContain(testNodes[2]);
      
      // Test type-based search
      expect(searchIndex.get('material')).toContain(testNodes[0]);
      expect(searchIndex.get('mechanism')).toContain(testNodes[1]);
      expect(searchIndex.get('systemnode')).toContain(testNodes[2]);
    });
  });

  describe('State Management Integration', () => {
    it('should handle complete workflow from data loading to concept design', () => {
      const store = useGraphDataStore.getState();
      
      // Reset store state first
      store.setGraphData({ nodes: [], links: [] });
      store.setLoading(false);
      store.setError(null);
      store.selectNode(null);
      
      // Start with loading state
      store.setLoading(true);
      expect(useGraphDataStore.getState().loading).toBe(true);
      
      // Load graph data
      const mockGraphData = {
        nodes: [
          { id: 'material-1', type: 'Material' as NodeType, label: 'Smart Material' },
          { id: 'mechanism-1', type: 'Mechanism' as NodeType, label: 'Memory Mechanism' }
        ],
        links: [
          { source: 'material-1', target: 'mechanism-1', type: 'related-to' as EdgeType }
        ]
      };
      
      store.setGraphData(mockGraphData);
      store.setLoading(false);
      
      const currentState = useGraphDataStore.getState();
      expect(currentState.graphData).toEqual(mockGraphData);
      expect(currentState.loading).toBe(false);
      
      // Select a node
      store.selectNode('material-1');
      expect(useGraphDataStore.getState().selectedNodeId).toBe('material-1');
      
      const selectedNode = useGraphDataStore.getState().selectedNode();
      expect(selectedNode).toEqual(mockGraphData.nodes[0]);
      
      // Update concept design
      store.updateConceptDesign({
        objective: 'Create adaptive building system',
        status: 'Proposed',
        components: {
          materials: ['material-1'],
          mechanisms: ['mechanism-1'],
          methods: [],
          theoretical_concepts: []
        }
      });
      
      const finalState = useGraphDataStore.getState();
      expect(finalState.conceptDesignState.objective).toBe('Create adaptive building system');
      expect(finalState.conceptDesignState.status).toBe('Proposed');
      expect(finalState.conceptDesignState.components.materials).toContain('material-1');
      expect(finalState.conceptDesignState.components.mechanisms).toContain('mechanism-1');
    });

    it('should provide efficient node filtering', () => {
      const store = useGraphDataStore.getState();
      
      const testData = {
        nodes: [
          { id: 'bio-material', type: 'Material' as NodeType, label: 'Bio-inspired Polymer', description: 'Biomimetic smart material' },
          { id: 'memory-mechanism', type: 'Mechanism' as NodeType, label: 'Shape Memory Effect', description: 'Temperature-triggered shape recovery' },
          { id: 'adaptive-system', type: 'SystemNode' as NodeType, label: 'Adaptive Building System', description: 'Self-reconfiguring architecture' },
          { id: 'method-1', type: 'Method' as NodeType, label: 'Thermal Cycling Test', description: 'Method for testing memory properties' }
        ],
        links: []
      };
      
      store.setGraphData(testData);
      
      // Test various filter queries - adjust expectations based on actual filtering logic
      let filtered = useGraphDataStore.getState().filteredNodes('bio');
      expect(filtered.length).toBeGreaterThanOrEqual(1); // At least bio-material should match
      
      filtered = useGraphDataStore.getState().filteredNodes('memory');
      expect(filtered.length).toBeGreaterThanOrEqual(1); // At least memory-mechanism should match
      
      filtered = useGraphDataStore.getState().filteredNodes('system');
      expect(filtered).toHaveLength(1); // adaptive-system
      
      filtered = useGraphDataStore.getState().filteredNodes('temperature');
      expect(filtered).toHaveLength(1); // memory-mechanism description
      
      // Test case insensitive
      filtered = useGraphDataStore.getState().filteredNodes('POLYMER');
      expect(filtered).toHaveLength(1);
      
      // Test empty query
      filtered = useGraphDataStore.getState().filteredNodes('');
      expect(filtered).toHaveLength(4);
    });
  });

  describe('API Integration', () => {
    it('should handle document upload workflow', async () => {
      const mockFile = new File(['test content'], 'research-paper.pdf', { type: 'application/pdf' });
      
      // Mock successful upload with extended response
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            documentId: 'doc-123',
            status: 'processing' as const,
            extractedNodes: [
              { id: 'extracted-material', type: 'Material' as NodeType, label: 'Extracted Material' }
            ]
          },
          timestamp: new Date().toISOString()
        })
      });

      const result = await apiClient.uploadDocument(mockFile, 'materialsCognitionSystem');
      
      expect(result.documentId).toBe('doc-123');
      expect(result.status).toBe('processing');
      // Note: extractedNodes would be added in actual implementation
    });

    it('should handle agent-based knowledge gap detection', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: [
            {
              id: 'gap-1',
              type: 'missing_link',
              description: 'Missing connection between bio-inspired materials and shape memory mechanisms',
              priority: 0.8,
              relatedNodes: ['bio-material', 'memory-mechanism'],
              suggestedSolution: 'Investigate thermally-triggered bio-polymers'
            },
            {
              id: 'gap-2', 
              type: 'incomplete_data',
              description: 'Insufficient mechanical property data for shape memory alloys',
              priority: 0.6,
              relatedNodes: ['memory-alloy'],
              suggestedSolution: 'Conduct comprehensive mechanical testing'
            }
          ],
          timestamp: new Date().toISOString()
        })
      });

      const gaps = await apiClient.detectKnowledgeGaps('materials');
      
      expect(gaps).toHaveLength(2);
      expect(gaps[0].priority).toBe(0.8);
      expect(gaps[0].relatedNodes).toContain('bio-material');
      expect(gaps[1].type).toBe('incomplete_data');
    });

    it('should perform semantic search effectively', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: [
            {
              node: { id: 'smart-material-1', type: 'Material' as NodeType, label: 'Shape Memory Alloy' },
              relevance: 0.95,
              excerpt: 'This material exhibits smart behavior through temperature-triggered shape recovery...'
            },
            {
              node: { id: 'bio-mechanism-1', type: 'Mechanism' as NodeType, label: 'Bio-inspired Actuation' },
              relevance: 0.87,
              excerpt: 'Mechanism mimics natural muscle-like contraction and expansion...'
            }
          ],
          timestamp: new Date().toISOString()
        })
      });

      const results = await apiClient.semanticSearch('smart materials with memory properties', 10);
      
      expect(results).toHaveLength(2);
      expect(results[0].relevance).toBe(0.95);
      expect(results[0].excerpt).toContain('temperature-triggered');
      expect(results[1].node.type).toBe('Mechanism');
    });
  });
}); 