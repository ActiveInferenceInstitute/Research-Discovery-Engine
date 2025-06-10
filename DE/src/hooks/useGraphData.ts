/**
 * @fileoverview Custom React Hook for Knowledge Graph Data Management
 * 
 * This hook manages the loading, caching, and state of knowledge graph data
 * from the Discovery Engine backend. It provides reactive access to graph
 * data with loading states and error handling.
 */

import { useState, useEffect } from 'react';
import { GraphData } from '../types';
import { buildCNMGraph } from '../utils/cnmBuilder';

/**
 * Custom hook for managing knowledge graph data with loading states
 * 
 * @returns Object containing graph data, loading state, error state, and setter function
 * 
 * @description This hook handles the asynchronous loading of knowledge graph data
 * from markdown files and provides reactive state management for the UI components.
 * It automatically triggers data loading on mount and provides error handling.
 * 
 * @example
 * ```typescript
 * function GraphComponent() {
 *   const { graphData, loading, error, setGraphData } = useGraphData();
 *   
 *   if (loading) return <div>Loading graph...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   
 *   return (
 *     <div>
 *       <p>Loaded {graphData.nodes.length} nodes</p>
 *       <button onClick={() => setGraphData({ nodes: [], links: [] })}>
 *         Clear Graph
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Using in combination with other hooks
 * function App() {
 *   const { graphData, loading, error } = useGraphData();
 *   const [selectedNode, setSelectedNode] = useState<string | null>(null);
 *   
 *   useEffect(() => {
 *     if (!loading && graphData.nodes.length > 0) {
 *       console.log('Graph loaded successfully');
 *     }
 *   }, [loading, graphData]);
 *   
 *   // ... rest of component
 * }
 * ```
 */
export const useGraphData = () => {
  /** Current graph data state */
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  
  /** Whether data is currently being loaded */
  const [loading, setLoading] = useState(true);
  
  /** Error message if data loading failed */
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Asynchronously loads graph data from the backend/markdown files
     * 
     * @description This function handles the complete data loading process:
     * 1. Sets loading state to true
     * 2. Calls the CNM builder to process markdown files
     * 3. Updates state with loaded data or error information
     * 4. Clears loading state when complete
     */
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

  return {
    /** 
     * The complete knowledge graph data containing nodes and links
     * Will be empty until loading completes successfully
     */
    graphData,
    
    /** 
     * Whether graph data is currently being loaded from the backend
     * Use this to show loading indicators in the UI
     */
    loading,
    
    /** 
     * Error message if graph loading failed, null if no error
     * Use this to display error messages to users
     */
    error,
    
    /** 
     * Function to manually update the graph data
     * Useful for integrating user uploads or real-time updates
     * 
     * @param newData - Complete graph data to replace current state
     * 
     * @example
     * ```typescript
     * // Add new nodes from user upload
     * const newNodes = [...graphData.nodes, ...uploadedNodes];
     * const newLinks = [...graphData.links, ...uploadedLinks];
     * setGraphData({ nodes: newNodes, links: newLinks });
     * ```
     */
    setGraphData
  };
};