import { GraphData } from '../../types';

export interface Component {
  id: string;
  nodes: string[];
  size: number;
  isIsolated: boolean;
}

export class ComponentIdentifier {
  private graph: GraphData;
  private visited: Set<string>;
  private components: Component[];

  constructor(graph: GraphData) {
    this.graph = graph;
    this.visited = new Set<string>();
    this.components = [];
  }

  /**
   * Identifies all connected components in the graph
   * Returns an array of components, where each component contains its nodes and metadata
   */
  public identifyComponents(): Component[] {
    this.visited.clear();
    this.components = [];

    // Handle empty graph
    if (!this.graph.nodes.length) {
      return [];
    }

    // Process each unvisited node
    for (const node of this.graph.nodes) {
      if (!this.visited.has(node.id)) {
        const componentNodes = this.exploreComponent(node.id);
        this.components.push({
          id: `component-${this.components.length}`,
          nodes: componentNodes,
          size: componentNodes.length,
          isIsolated: componentNodes.length === 1
        });
      }
    }

    return this.components;
  }

  /**
   * Explores a component starting from a given node using BFS
   * Returns all nodes in the component
   */
  private exploreComponent(startNodeId: string): string[] {
    const componentNodes: string[] = [];
    const queue: string[] = [startNodeId];
    this.visited.add(startNodeId);
    componentNodes.push(startNodeId);

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      
      // Find all neighbors of the current node
      const neighbors = this.getNeighbors(currentId);
      
      for (const neighborId of neighbors) {
        if (!this.visited.has(neighborId)) {
          this.visited.add(neighborId);
          componentNodes.push(neighborId);
          queue.push(neighborId);
        }
      }
    }

    return componentNodes;
  }

  /**
   * Gets all neighbors of a node
   * A neighbor is any node connected by an edge
   */
  private getNeighbors(nodeId: string): string[] {
    const neighbors = new Set<string>();
    
    // Check all links for connections
    for (const link of this.graph.links) {
      if (link.source === nodeId) {
        neighbors.add(link.target);
      } else if (link.target === nodeId) {
        neighbors.add(link.source);
      }
    }

    return Array.from(neighbors);
  }

  /**
   * Gets the component that contains a specific node
   */
  public getComponentForNode(nodeId: string): Component | undefined {
    return this.components.find(component => component.nodes.includes(nodeId));
  }

  /**
   * Checks if two nodes are in the same component
   */
  public areNodesConnected(node1Id: string, node2Id: string): boolean {
    const component1 = this.getComponentForNode(node1Id);
    const component2 = this.getComponentForNode(node2Id);
    return component1 !== undefined && component1 === component2;
  }

  /**
   * Gets statistics about the components
   */
  public getComponentStats(): {
    totalComponents: number;
    isolatedNodes: number;
    componentSizes: number[];
  } {
    return {
      totalComponents: this.components.length,
      isolatedNodes: this.components.filter(c => c.isIsolated).length,
      componentSizes: this.components.map(c => c.size)
    };
  }
} 