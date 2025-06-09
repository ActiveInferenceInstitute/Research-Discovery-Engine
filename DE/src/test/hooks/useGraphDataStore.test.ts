import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGraphDataStore } from '../../hooks/useGraphDataStore';
import { GraphData, NodeObject } from '../../types';

describe('useGraphDataStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useGraphDataStore.getState();
    act(() => {
      store.setGraphData({ nodes: [], links: [] });
      store.setLoading(false);
      store.setError(null);
      store.selectNode(null);
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useGraphDataStore());
      
      expect(result.current.graphData).toEqual({ nodes: [], links: [] });
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.selectedNodeId).toBeNull();
      expect(result.current.conceptDesignState.status).toBe('Hypothetical');
    });
  });

  describe('actions', () => {
    it('should set graph data', () => {
      const { result } = renderHook(() => useGraphDataStore());
      const mockData: GraphData = {
        nodes: [
          { id: 'test1', type: 'Material', label: 'Test Material' }
        ],
        links: [
          { source: 'test1', target: 'test2', type: 'related-to' }
        ]
      };

      act(() => {
        result.current.setGraphData(mockData);
      });

      expect(result.current.graphData).toEqual(mockData);
    });

    it('should set loading state', () => {
      const { result } = renderHook(() => useGraphDataStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.loading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.loading).toBe(false);
    });

    it('should set error state', () => {
      const { result } = renderHook(() => useGraphDataStore());
      const errorMessage = 'Test error';

      act(() => {
        result.current.setError(errorMessage);
      });

      expect(result.current.error).toBe(errorMessage);

      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });

    it('should select node', () => {
      const { result } = renderHook(() => useGraphDataStore());
      const nodeId = 'test-node';

      act(() => {
        result.current.selectNode(nodeId);
      });

      expect(result.current.selectedNodeId).toBe(nodeId);

      act(() => {
        result.current.selectNode(null);
      });

      expect(result.current.selectedNodeId).toBeNull();
    });

    it('should update concept design', () => {
      const { result } = renderHook(() => useGraphDataStore());
      const updates = {
        objective: 'Test objective',
        status: 'Proposed' as const
      };

      act(() => {
        result.current.updateConceptDesign(updates);
      });

      expect(result.current.conceptDesignState.objective).toBe(updates.objective);
      expect(result.current.conceptDesignState.status).toBe(updates.status);
    });
  });

  describe('derived state', () => {
    it('should return selected node', () => {
      const { result } = renderHook(() => useGraphDataStore());
      const mockNode: NodeObject = { 
        id: 'test-node', 
        type: 'Material', 
        label: 'Test Material' 
      };
      const mockData: GraphData = {
        nodes: [mockNode],
        links: []
      };

      act(() => {
        result.current.setGraphData(mockData);
        result.current.selectNode('test-node');
      });

      const selectedNode = result.current.selectedNode();
      expect(selectedNode).toEqual(mockNode);
    });

    it('should return null when no node is selected', () => {
      const { result } = renderHook(() => useGraphDataStore());
      
      const selectedNode = result.current.selectedNode();
      expect(selectedNode).toBeNull();
    });

    it('should return null when selected node does not exist', () => {
      const { result } = renderHook(() => useGraphDataStore());
      const mockData: GraphData = {
        nodes: [{ id: 'other-node', type: 'Material', label: 'Other Material' }],
        links: []
      };

      act(() => {
        result.current.setGraphData(mockData);
        result.current.selectNode('non-existent-node');
      });

      const selectedNode = result.current.selectedNode();
      expect(selectedNode).toBeNull();
    });

    it('should filter nodes by query', () => {
      const { result } = renderHook(() => useGraphDataStore());
      const mockData: GraphData = {
        nodes: [
          { id: 'material1', type: 'Material', label: 'Polymer Material', description: 'A flexible polymer' },
          { id: 'material2', type: 'Material', label: 'Metal Material', description: 'A strong metal' },
          { id: 'mechanism1', type: 'Mechanism', label: 'Memory Mechanism', description: 'Stores information' }
        ],
        links: []
      };

      act(() => {
        result.current.setGraphData(mockData);
      });

      // Test filtering by label
      let filteredNodes = result.current.filteredNodes('polymer');
      expect(filteredNodes).toHaveLength(1);
      expect(filteredNodes[0].id).toBe('material1');

      // Test filtering by description
      filteredNodes = result.current.filteredNodes('strong');
      expect(filteredNodes).toHaveLength(1);
      expect(filteredNodes[0].id).toBe('material2');

      // Test filtering by type
      filteredNodes = result.current.filteredNodes('mechanism');
      expect(filteredNodes).toHaveLength(1);
      expect(filteredNodes[0].id).toBe('mechanism1');

      // Test case insensitive search
      filteredNodes = result.current.filteredNodes('MEMORY');
      expect(filteredNodes).toHaveLength(1);
      expect(filteredNodes[0].id).toBe('mechanism1');

      // Test empty query returns all nodes
      filteredNodes = result.current.filteredNodes('');
      expect(filteredNodes).toHaveLength(3);

      // Test no matches
      filteredNodes = result.current.filteredNodes('nonexistent');
      expect(filteredNodes).toHaveLength(0);
    });
  });
}); 