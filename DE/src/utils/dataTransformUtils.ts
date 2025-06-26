/**
 * Data Transformation Utilities
 * 
 * This module contains utilities for transforming and processing data
 * specifically for the Discovery Engine application, including graph data,
 * knowledge artifacts, and scientific content processing.
 */

import { GraphData, NodeObject, LinkObject, ConceptDesignState, AgentMessage } from '../types';

/**
 * Interface for search result highlighting
 */
export interface SearchHighlight {
  field: string;
  matches: { start: number; end: number }[];
}

/**
 * Interface for graph statistics
 */
export interface GraphStats {
  totalNodes: number;
  totalLinks: number;
  nodeTypes: Record<string, number>;
  linkTypes: Record<string, number>;
  averageDegree: number;
  isolatedNodes: number;
}

/**
 * Filters graph data based on a search query
 * 
 * @param graphData - The graph data to filter
 * @param searchQuery - The search query string
 * @param searchFields - Fields to search in (defaults to common searchable fields)
 * @returns Filtered graph data with highlighted matches
 */
export const filterGraphBySearch = (
  graphData: GraphData,
  searchQuery: string,
  searchFields: (keyof NodeObject)[] = ['label', 'description', 'id']
): { 
  filteredData: GraphData; 
  highlights: Map<string, SearchHighlight[]>;
} => {
  if (!searchQuery.trim()) {
    return { 
      filteredData: graphData, 
      highlights: new Map() 
    };
  }

  const query = searchQuery.toLowerCase();
  const matchedNodes = new Set<string>();
  const highlights = new Map<string, SearchHighlight[]>();

  // Find matching nodes
  const filteredNodes = graphData.nodes.filter(node => {
    const nodeHighlights: SearchHighlight[] = [];
    let hasMatch = false;

    searchFields.forEach(field => {
      const value = node[field];
      if (typeof value === 'string') {
        const lowerValue = value.toLowerCase();
        const index = lowerValue.indexOf(query);
        if (index !== -1) {
          hasMatch = true;
          matchedNodes.add(node.id);
          nodeHighlights.push({
            field: field as string,
            matches: [{ start: index, end: index + query.length }]
          });
        }
      }
    });

    if (hasMatch) {
      highlights.set(node.id, nodeHighlights);
    }

    return hasMatch;
  });

  // Include connected nodes (one hop away)
  const connectedNodeIds = new Set<string>();
  graphData.links.forEach(link => {
    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    
    if (matchedNodes.has(sourceId)) {
      connectedNodeIds.add(targetId);
    }
    if (matchedNodes.has(targetId)) {
      connectedNodeIds.add(sourceId);
    }
  });

  // Add connected nodes to filtered results
  const allRelevantNodeIds = new Set([...matchedNodes, ...connectedNodeIds]);
  const allFilteredNodes = graphData.nodes.filter(node => 
    allRelevantNodeIds.has(node.id)
  );

  // Filter links to only include those between relevant nodes
  const filteredLinks = graphData.links.filter(link => {
    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    return allRelevantNodeIds.has(sourceId) && allRelevantNodeIds.has(targetId);
  });

  return {
    filteredData: {
      nodes: allFilteredNodes,
      links: filteredLinks
    },
    highlights
  };
};

/**
 * Calculates comprehensive statistics for graph data
 * 
 * @param graphData - The graph data to analyze
 * @returns Graph statistics object
 */
export const calculateGraphStats = (graphData: GraphData): GraphStats => {
  const nodeTypes: Record<string, number> = {};
  const linkTypes: Record<string, number> = {};
  const nodeDegrees: Record<string, number> = {};

  // Initialize node degrees
  graphData.nodes.forEach(node => {
    nodeDegrees[node.id] = 0;
    const nodeType = node.type || 'unknown';
    nodeTypes[nodeType] = (nodeTypes[nodeType] || 0) + 1;
  });

  // Count link types and calculate node degrees
  graphData.links.forEach(link => {
    const linkType = link.type || 'unknown';
    linkTypes[linkType] = (linkTypes[linkType] || 0) + 1;

    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    
    nodeDegrees[sourceId] = (nodeDegrees[sourceId] || 0) + 1;
    nodeDegrees[targetId] = (nodeDegrees[targetId] || 0) + 1;
  });

  const degrees = Object.values(nodeDegrees);
  const averageDegree = degrees.length > 0 ? degrees.reduce((a, b) => a + b, 0) / degrees.length : 0;
  const isolatedNodes = degrees.filter(degree => degree === 0).length;

  return {
    totalNodes: graphData.nodes.length,
    totalLinks: graphData.links.length,
    nodeTypes,
    linkTypes,
    averageDegree,
    isolatedNodes
  };
};

/**
 * Groups nodes by a specified property
 * 
 * @param nodes - Array of nodes to group
 * @param groupBy - Property to group by
 * @returns Map of grouped nodes
 */
export const groupNodesByProperty = <K extends keyof NodeObject>(
  nodes: NodeObject[],
  groupBy: K
): Map<NodeObject[K], NodeObject[]> => {
  const groups = new Map<NodeObject[K], NodeObject[]>();
  
  nodes.forEach(node => {
    const key = node[groupBy];
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(node);
  });
  
  return groups;
};

/**
 * Finds the shortest path between two nodes in the graph
 * 
 * @param graphData - The graph data
 * @param startNodeId - Starting node ID
 * @param endNodeId - Target node ID
 * @returns Array of node IDs representing the shortest path, or null if no path exists
 */
export const findShortestPath = (
  graphData: GraphData,
  startNodeId: string,
  endNodeId: string
): string[] | null => {
  if (startNodeId === endNodeId) return [startNodeId];

  // Build adjacency list
  const adjacencyList = new Map<string, string[]>();
  graphData.nodes.forEach(node => {
    adjacencyList.set(node.id, []);
  });

  graphData.links.forEach(link => {
    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    
    adjacencyList.get(sourceId)?.push(targetId);
    adjacencyList.get(targetId)?.push(sourceId); // Treat as undirected
  });

  // BFS to find shortest path
  const queue: { nodeId: string; path: string[] }[] = [{ nodeId: startNodeId, path: [startNodeId] }];
  const visited = new Set<string>([startNodeId]);

  while (queue.length > 0) {
    const { nodeId, path } = queue.shift()!;
    
    if (nodeId === endNodeId) {
      return path;
    }

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ nodeId: neighbor, path: [...path, neighbor] });
      }
    }
  }

  return null; // No path found
};

/**
 * Extracts keywords from text content using simple NLP techniques
 * 
 * @param text - Text to extract keywords from
 * @param maxKeywords - Maximum number of keywords to return
 * @returns Array of extracted keywords
 */
export const extractKeywords = (
  text: string,
  maxKeywords: number = 10
): string[] => {
  if (!text) return [];

  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
    'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
    'after', 'above', 'below', 'between', 'among', 'is', 'are', 'was', 'were',
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this',
    'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
  ]);

  // Extract words and count frequencies
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  });

  // Sort by frequency and return top keywords
  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
};

/**
 * Transforms concept design state into a knowledge artifact node
 * 
 * @param conceptState - The concept design state
 * @returns Knowledge artifact node object
 */
export const createKnowledgeArtifact = (
  conceptState: ConceptDesignState
): NodeObject => {
  const keywords = extractKeywords(
    `${conceptState.objective} ${conceptState.components.materials.join(' ')} ${conceptState.components.mechanisms.join(' ')}`
  );

  return {
    id: `ka_${conceptState.id}`,
    type: 'KnowledgeArtifactNode',
    label: `Artifact: ${conceptState.objective || conceptState.id}`,
    description: `Knowledge artifact for: ${conceptState.objective}\n\nMaterials: ${conceptState.components.materials.join(', ')}\nMechanisms: ${conceptState.components.mechanisms.join(', ')}\n\nProtocol:\n${conceptState.protocolOutline || 'Not generated'}`,
    origin: 'system_derived',
    status: conceptState.status || 'Proposed',
    references: [
      conceptState.id,
      ...conceptState.components.materials,
      ...conceptState.components.mechanisms
    ],
    keywords
  };
};

/**
 * Validates graph data integrity and reports issues
 * 
 * @param graphData - The graph data to validate
 * @returns Validation report with errors and warnings
 */
export const validateGraphData = (graphData: GraphData): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const nodeIds = new Set(graphData.nodes.map(node => node.id));

  // Check for duplicate node IDs
  const seenIds = new Set<string>();
  graphData.nodes.forEach(node => {
    if (seenIds.has(node.id)) {
      errors.push(`Duplicate node ID: ${node.id}`);
    }
    seenIds.add(node.id);
  });

  // Check for orphaned links
  graphData.links.forEach(link => {
    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    
    if (!nodeIds.has(sourceId)) {
      errors.push(`Link references non-existent source node: ${sourceId}`);
    }
    if (!nodeIds.has(targetId)) {
      errors.push(`Link references non-existent target node: ${targetId}`);
    }
  });

  // Check for nodes without required properties
  graphData.nodes.forEach(node => {
    if (!node.id) {
      errors.push('Node missing required ID property');
    }
    if (!node.label && !node.description) {
      warnings.push(`Node ${node.id} has no label or description`);
    }
  });

  // Check for self-referencing links
  graphData.links.forEach(link => {
    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    
    if (sourceId === targetId) {
      warnings.push(`Self-referencing link found on node: ${sourceId}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Merges multiple graph datasets intelligently
 * 
 * @param graphs - Array of graph data to merge
 * @returns Merged graph data
 */
export const mergeGraphData = (...graphs: GraphData[]): GraphData => {
  const allNodes = new Map<string, NodeObject>();
  const allLinks = new Set<string>();
  const mergedLinks: LinkObject[] = [];

  // Merge nodes (later graphs override earlier ones for conflicts)
  graphs.forEach(graph => {
    graph.nodes.forEach(node => {
      allNodes.set(node.id, { ...allNodes.get(node.id), ...node });
    });
  });

  // Merge links (deduplicate based on source-target-type combination)
  graphs.forEach(graph => {
    graph.links.forEach(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      const linkKey = `${sourceId}-${targetId}-${link.type || 'default'}`;
      
      if (!allLinks.has(linkKey)) {
        allLinks.add(linkKey);
        mergedLinks.push(link);
      }
    });
  });

  return {
    nodes: Array.from(allNodes.values()),
    links: mergedLinks
  };
};

/**
 * Sanitizes and formats agent messages for display
 * 
 * @param messages - Array of agent messages
 * @returns Sanitized and formatted messages
 */
export const sanitizeAgentMessages = (messages: AgentMessage[]): AgentMessage[] => {
  return messages.map(message => ({
    ...message,
    content: message.content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .trim(),
    timestamp: message.timestamp || Date.now()
  }));
};

/**
 * Formats a timestamp for display in the UI
 * 
 * @param timestamp - Unix timestamp
 * @param format - Format type ('relative' | 'absolute' | 'time-only')
 * @returns Formatted time string
 */
export const formatTimestamp = (
  timestamp: number,
  format: 'relative' | 'absolute' | 'time-only' = 'relative'
): string => {
  const date = new Date(timestamp);
  const now = new Date();
  
  switch (format) {
    case 'relative':
      const diffMs = now.getTime() - timestamp;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffSecs < 60) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
      
    case 'time-only':
      return date.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
    case 'absolute':
    default:
      return date.toLocaleString();
  }
}; 