import { GraphData, NodeObject, LinkObject } from '../types';

// Graph clustering for performance
export interface GraphCluster {
  id: string;
  nodes: NodeObject[];
  centerNode: NodeObject;
  boundingBox: { x: number; y: number; width: number; height: number };
}

export class GraphOptimizer {
  static clusterNodes(graphData: GraphData, maxNodesPerCluster = 50): GraphCluster[] {
    const clusters: GraphCluster[] = [];
    const visited = new Set<string>();
    
    for (const node of graphData.nodes) {
      if (visited.has(node.id)) continue;
      
      const cluster = this.buildCluster(node, graphData, maxNodesPerCluster, visited);
      if (cluster.nodes.length > 0) {
        clusters.push(cluster);
      }
    }
    
    return clusters;
  }
  
  private static buildCluster(
    startNode: NodeObject, 
    graphData: GraphData, 
    maxNodes: number, 
    visited: Set<string>
  ): GraphCluster {
    const clusterNodes: NodeObject[] = [startNode];
    visited.add(startNode.id);
    
    const queue = [startNode];
    const adjacencyMap = this.buildAdjacencyMap(graphData.links);
    
    while (queue.length > 0 && clusterNodes.length < maxNodes) {
      const currentNode = queue.shift()!;
      const neighbors = adjacencyMap.get(currentNode.id) || [];
      
      for (const neighborId of neighbors) {
        if (!visited.has(neighborId) && clusterNodes.length < maxNodes) {
          const neighborNode = graphData.nodes.find(n => n.id === neighborId);
          if (neighborNode) {
            clusterNodes.push(neighborNode);
            visited.add(neighborId);
            queue.push(neighborNode);
          }
        }
      }
    }
    
    const boundingBox = this.calculateBoundingBox(clusterNodes);
    
    return {
      id: `cluster-${startNode.id}`,
      nodes: clusterNodes,
      centerNode: startNode,
      boundingBox
    };
  }
  
  private static buildAdjacencyMap(links: LinkObject[]): Map<string, string[]> {
    const adjacencyMap = new Map<string, string[]>();
    
    for (const link of links) {
      const sourceId = typeof link.source === 'string' ? link.source : (link.source as NodeObject).id;
      const targetId = typeof link.target === 'string' ? link.target : (link.target as NodeObject).id;
      
      if (!adjacencyMap.has(sourceId)) {
        adjacencyMap.set(sourceId, []);
      }
      if (!adjacencyMap.has(targetId)) {
        adjacencyMap.set(targetId, []);
      }
      
      adjacencyMap.get(sourceId)!.push(targetId);
      adjacencyMap.get(targetId)!.push(sourceId);
    }
    
    return adjacencyMap;
  }
  
  private static calculateBoundingBox(nodes: NodeObject[]): { x: number; y: number; width: number; height: number } {
    if (nodes.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
    
    const positions = nodes.map(n => ({ x: n.x || 0, y: n.y || 0 }));
    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxY = Math.max(...positions.map(p => p.y));
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
  
  // Level-of-detail rendering based on distance and importance
  static shouldRenderNode(node: NodeObject, distanceFromCenter: number): boolean {
    // Always render if very close (distance < 1)
    if (distanceFromCenter < 1) {
      return true;
    }
    
    // Calculate importance score
    const importance = this.calculateNodeImportance(node);
    
    // Distance threshold based on importance
    const threshold = importance * 10; // Max distance of 10 for most important nodes
    
    return distanceFromCenter < threshold;
  }
  
  private static calculateNodeImportance(node: NodeObject): number {
    let importance = 0.5; // Base importance
    
    // Add importance based on node value/size
    if (node.value) {
      importance += Math.min(node.value / 10, 0.4); // Max 0.4 from value
    }
    
    // Add importance based on node type
    const typeImportance: { [key: string]: number } = {
      'SystemNode': 0.3,
      'Material': 0.2,
      'Mechanism': 0.2,
      'Method': 0.15,
      'Phenomenon': 0.15,
      'Application': 0.1,
      'Theoretical': 0.1,
      'Documentation': 0.05
    };
    
    importance += typeImportance[node.type] || 0.1;
    
    return Math.min(importance, 1.0); // Cap at 1.0
  }
  
  // Full-text search index for fast node searching
  static buildSearchIndex(nodes: NodeObject[]): Map<string, NodeObject[]> {
    const index = new Map<string, NodeObject[]>();
    
    for (const node of nodes) {
      const terms = this.extractSearchTerms(node);
      
      for (const term of terms) {
        if (!index.has(term)) {
          index.set(term, []);
        }
        index.get(term)!.push(node);
      }
    }
    
    return index;
  }
  
  private static extractSearchTerms(node: NodeObject): string[] {
    const terms: string[] = [];
    
    // Extract from label
    if (node.label) {
      terms.push(...this.tokenize(node.label));
    }
    
    // Extract from description
    if (node.description) {
      terms.push(...this.tokenize(node.description));
    }
    
    // Add type
    terms.push(node.type.toLowerCase());
    
    // Add ID parts if meaningful
    terms.push(...this.tokenize(node.id));
    
    // Filter out very short terms
    return terms.filter(term => term.length > 2);
  }
  
  private static tokenize(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0);
  }
} 