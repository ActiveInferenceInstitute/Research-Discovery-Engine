/**
 * @fileoverview Test suite for useGraphData hook
 * 
 * Tests cover hook initialization, data loading, error handling,
 * and state management for knowledge graph data.
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useGraphData } from '../../hooks/useGraphData';
import { buildCNMGraph } from '../../utils/cnmBuilder';

// Mock the CNM builder
jest.mock('../../utils/cnmBuilder');
const mockBuildCNMGraph = buildCNMGraph as jest.MockedFunction<typeof buildCNMGraph>;

describe('useGraphData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty graph data and loading state', () => {
    // Mock a delayed response to keep loading state
    mockBuildCNMGraph.mockImplementation(() => new Promise(() => {}));
    
    const { result } = renderHook(() => useGraphData());
    
    expect(result.current.graphData).toEqual({ nodes: [], links: [] });
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should load graph data successfully', async () => {
    const mockData = {
      nodes: [
        { id: 'test-node', type: 'Material', label: 'Test Material' }
      ],
      links: [
        { source: 'node1', target: 'node2', type: 'related-to' }
      ]
    };

    mockBuildCNMGraph.mockResolvedValue(mockData);
    
    const { result } = renderHook(() => useGraphData());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.graphData).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it('should handle loading errors gracefully', async () => {
    const errorMessage = 'Failed to load graph data';
    mockBuildCNMGraph.mockRejectedValue(new Error(errorMessage));
    
    const { result } = renderHook(() => useGraphData());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.graphData).toEqual({ nodes: [], links: [] });
  });

  it('should handle unknown errors', async () => {
    mockBuildCNMGraph.mockRejectedValue('Non-error object');
    
    const { result } = renderHook(() => useGraphData());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.error).toBe('Unknown error occurred');
  });

  it('should allow manual graph data updates', async () => {
    const initialData = {
      nodes: [{ id: 'initial', type: 'Material', label: 'Initial' }],
      links: []
    };
    
    const updatedData = {
      nodes: [{ id: 'updated', type: 'Material', label: 'Updated' }],
      links: []
    };

    mockBuildCNMGraph.mockResolvedValue(initialData);
    
    const { result } = renderHook(() => useGraphData());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.graphData).toEqual(initialData);
    
    // Update data manually
    result.current.setGraphData(updatedData);
    
    expect(result.current.graphData).toEqual(updatedData);
  });

  it('should only load data once on mount', async () => {
    const mockData = { nodes: [], links: [] };
    mockBuildCNMGraph.mockResolvedValue(mockData);
    
    const { rerender } = renderHook(() => useGraphData());
    
    await waitFor(() => {
      expect(mockBuildCNMGraph).toHaveBeenCalledTimes(1);
    });
    
    // Rerender should not trigger another load
    rerender();
    
    expect(mockBuildCNMGraph).toHaveBeenCalledTimes(1);
  });

  it('should log successful data loading', async () => {
    const mockData = {
      nodes: Array(10).fill(null).map((_, i) => ({ 
        id: `node-${i}`, 
        type: 'Material', 
        label: `Node ${i}` 
      })),
      links: Array(5).fill(null).map((_, i) => ({ 
        source: `node-${i}`, 
        target: `node-${i + 1}`, 
        type: 'related-to' 
      }))
    };

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    mockBuildCNMGraph.mockResolvedValue(mockData);
    
    const { result } = renderHook(() => useGraphData());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Successfully loaded 10 nodes and 5 links'
    );
    
    consoleSpy.mockRestore();
  });

  it('should log errors when data loading fails', async () => {
    const error = new Error('Network error');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockBuildCNMGraph.mockRejectedValue(error);
    
    const { result } = renderHook(() => useGraphData());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(consoleSpy).toHaveBeenCalledWith('Failed to load graph data:', error);
    
    consoleSpy.mockRestore();
  });
}); 