/**
 * Graph Data Hook - Manages knowledge graph data loading and state
 * 
 * This hook handles the asynchronous loading of the knowledge graph from markdown files,
 * providing loading states, error handling, and the resulting graph data structure.
 * 
 * @returns Object containing graph data, loading state, error state, and setter function
 */

import { useState, useEffect } from 'react';
import { GraphData } from '../types';
import { buildCNMGraph } from '../utils/cnmBuilder';

/**
 * Custom hook for managing graph data state and loading
 * 
 * Features:
 * - Asynchronous graph data loading from markdown files
 * - Loading state management
 * - Error handling and reporting
 * - Component unmount cleanup
 * - Graph data updates via setter function
 * 
 * @example
 * const { graphData, loading, error, setGraphData } = useGraphData();
 * 
 * if (loading) return <LoadingSpinner />;
 * if (error) return <ErrorDisplay error={error} />;
 * return <GraphVisualization data={graphData} />;
 */
export const useGraphData = () => {
  /** Graph data state containing nodes and links */
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  
  /** Loading state indicator */
  const [loading, setLoading] = useState(true);
  
  /** Error state for any loading failures */
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      console.log("[useGraphData] Starting data load...");
      if (!isMounted) return; // Check before async call
      
      setLoading(true);
      setError(null);
      
      try {
        console.log("[useGraphData] Calling buildCNMGraph...");
        const data = await buildCNMGraph(); // This might throw or return empty
        console.log("[useGraphData] buildCNMGraph completed.", `Nodes: ${data?.nodes?.length}, Links: ${data?.links?.length}`);

        if (!isMounted) return; // Check after async call

        if (data && data.nodes && data.links && data.nodes.length > 0) { // Check for actual nodes
             setGraphData(data);
             setError(null); // Clear previous error on success
             console.log("[useGraphData] Graph data state updated successfully.");
        } else if (data && data.nodes && data.nodes.length === 0) {
             console.error("[useGraphData] buildCNMGraph returned empty node list.");
             setError("Failed to build graph: No nodes generated. Check logs.");
        } else {
             console.error("[useGraphData] buildCNMGraph returned invalid data structure:", data);
             throw new Error("buildCNMGraph returned invalid data structure.");
        }
      } catch (err) {
        console.error('[useGraphData] Error loading graph data:', err);
        if (isMounted) {
            setError(err instanceof Error ? err.message : 'Failed to build graph data. Check console for details.');
        }
      } finally {
        console.log("[useGraphData] Load attempt finished.");
        if (isMounted) {
            setLoading(false);
        }
      }
    }

    loadData();

    return () => { isMounted = false; console.log("[useGraphData] Component unmounted."); };
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Returns graph data management interface
   * @returns {Object} Hook return object
   * @returns {GraphData} graphData - Current graph data with nodes and links
   * @returns {boolean} loading - Whether data is currently being loaded
   * @returns {string|null} error - Error message if loading failed, null otherwise
   * @returns {Function} setGraphData - Function to update graph data state
   */
  return { graphData, loading, error, setGraphData };
};