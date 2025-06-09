import { describe, it, expect, beforeEach } from 'vitest';
import { GraphOptimizer } from '../../utils/graphOptimizations';
import { GraphData, NodeObject, NodeType } from '../../types';

describe('GraphOptimizer', () => {
  let sampleGraphData: GraphData;

  beforeEach(() => {
    sampleGraphData = {
      nodes: [
        { id: 'node1', type: 'Material' as NodeType, label: 'Material 1', x: 0, y: 0, value: 5 },
        { id: 'node2', type: 'Mechanism' as NodeType, label: 'Mechanism 1', x: 10, y: 10, value: 3 },
        { id: 'node3', type: 'Method' as NodeType, label: 'Method 1', x: 20, y: 20, value: 2 },
        { id: 'node4', type: 'SystemNode' as NodeType, label: 'System 1', x: 30, y: 30, value: 8 },
        { id: 'node5', type: 'Phenomenon' as NodeType, label: 'Phenomenon 1', x: 40, y: 40, value: 1 },
      ],
      links: [
        { source: 'node1', target: 'node2', type: 'concept-uses-component' },
        { source: 'node2', target: 'node3', type: 'related-to' },
        { source: 'node3', target: 'node4', type: 'concept-uses-component' },
        { source: 'node1', target: 'node4', type: 'related-to' },
      ]
    };
  });

  describe('clusterNodes', () => {
    it('should create clusters with connected nodes', () => {
      const clusters = GraphOptimizer.clusterNodes(sampleGraphData, 3);
      
      expect(clusters).toBeDefined();
      expect(clusters.length).toBeGreaterThan(0);
      
      // Each cluster should have nodes
      clusters.forEach(cluster => {
        expect(cluster.nodes.length).toBeGreaterThan(0);
        expect(cluster.nodes.length).toBeLessThanOrEqual(3);
        expect(cluster.centerNode).toBeDefined();
        expect(cluster.boundingBox).toBeDefined();
      });
    });

    it('should respect maxNodesPerCluster limit', () => {
      const maxSize = 2;
      const clusters = GraphOptimizer.clusterNodes(sampleGraphData, maxSize);
      
      clusters.forEach(cluster => {
        expect(cluster.nodes.length).toBeLessThanOrEqual(maxSize);
      });
    });

    it('should include all nodes across clusters', () => {
      const clusters = GraphOptimizer.clusterNodes(sampleGraphData, 10);
      const allClusterNodes = clusters.flatMap(cluster => cluster.nodes);
      const uniqueNodeIds = new Set(allClusterNodes.map(n => n.id));
      
      expect(uniqueNodeIds.size).toBe(sampleGraphData.nodes.length);
    });
  });

  describe('shouldRenderNode', () => {
    it('should render important nodes at high distances', () => {
      const importantNode: NodeObject = { 
        id: 'important', 
        type: 'SystemNode' as NodeType, 
        value: 10 
      };
      
      const shouldRender = GraphOptimizer.shouldRenderNode(importantNode, 5);
      expect(shouldRender).toBe(true);
    });

    it('should not render unimportant nodes at high distances', () => {
      const unimportantNode: NodeObject = { 
        id: 'unimportant', 
        type: 'Documentation' as NodeType, 
        value: 0.1 
      };
      
      const shouldRender = GraphOptimizer.shouldRenderNode(unimportantNode, 10);
      expect(shouldRender).toBe(false);
    });

    it('should render all nodes at close distances', () => {
      const node: NodeObject = { 
        id: 'test', 
        type: 'Material' as NodeType
      };
      
      const shouldRender = GraphOptimizer.shouldRenderNode(node, 0.1);
      expect(shouldRender).toBe(true);
    });
  });

  describe('buildSearchIndex', () => {
    it('should create search index from node data', () => {
      const index = GraphOptimizer.buildSearchIndex(sampleGraphData.nodes);
      
      expect(index).toBeDefined();
      expect(index.size).toBeGreaterThan(0);
      
      // Should be able to find nodes by terms
      const materialNodes = index.get('material') || [];
      expect(materialNodes.length).toBeGreaterThan(0);
      expect(materialNodes[0].type).toBe('Material');
    });

    it('should index multiple terms per node', () => {
      const testNode: NodeObject = {
        id: 'test-node',
        type: 'Material' as NodeType,
        label: 'Test Material System',
        description: 'A complex polymer composite'
      };
      
      const index = GraphOptimizer.buildSearchIndex([testNode]);
      
      // Should find by different terms
      expect(index.get('test')).toContain(testNode);
      expect(index.get('material')).toContain(testNode);
      expect(index.get('polymer')).toContain(testNode);
      expect(index.get('composite')).toContain(testNode);
    });

    it('should skip very short terms', () => {
      const testNode: NodeObject = {
        id: 'a',
        type: 'Material' as NodeType,
        label: 'A B Material',
        description: 'An is the test'
      };
      
      const index = GraphOptimizer.buildSearchIndex([testNode]);
      
      // Should not index single letters or very short words
      expect(index.has('a')).toBe(false);
      expect(index.has('b')).toBe(false);
      expect(index.has('an')).toBe(false);
      expect(index.has('is')).toBe(false);
      
      // Should index longer terms
      expect(index.has('material')).toBe(true);
      expect(index.has('test')).toBe(true);
    });
  });
}); 