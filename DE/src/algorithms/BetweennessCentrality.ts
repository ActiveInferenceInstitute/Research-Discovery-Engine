import { GraphAlgorithm, AlgorithmResult, AlgorithmParameters, AlgorithmCategory, AlgorithmParameter } from '../types/algorithm.types';
import { GraphData } from '../types/index';
import { ComponentIdentifier, Component } from './utils/ComponentIdentifier';

interface BetweennessResult {
  components: {
    id: string;
    nodes: string[];
    betweenness: Map<string, number>;
    size: number;
    isIsolated: boolean;
  }[];
  globalBetweenness: Map<string, number>;
  componentStats: {
    totalComponents: number;
    isolatedNodes: number;
    componentSizes: number[];
  };
}

export class BetweennessCentrality implements GraphAlgorithm {
  name = 'BetweennessCentrality';
  category: AlgorithmCategory = 'Pattern Recognition';
  description = 'Identifies nodes that act as bridges between different parts of the graph, properly handling disconnected components';
  parameters: AlgorithmParameter[] = [
    {
      name: 'normalize',
      type: 'boolean',
      description: 'Whether to normalize the betweenness scores within each component',
      defaultValue: true
    }
  ];

  async execute(graph: GraphData, params: AlgorithmParameters): Promise<AlgorithmResult> {
    const startTime = performance.now();
    const { normalize = true } = params;

    // Validate graph data
    if (!graph.nodes.length) {
      throw new Error('Graph must contain nodes for betweenness centrality calculation');
    }

    // Identify components
    const componentIdentifier = new ComponentIdentifier(graph);
    const components = componentIdentifier.identifyComponents();
    console.log('Identified components:', components);

    // Initialize result structure
    const result: BetweennessResult = {
      components: [],
      globalBetweenness: new Map<string, number>(),
      componentStats: componentIdentifier.getComponentStats()
    };

    // Calculate betweenness for each component
    for (const component of components) {
      if (component.isIsolated) {
        // Handle isolated nodes
        result.components.push({
          ...component,
          betweenness: new Map([[component.nodes[0], 0]])
        });
        result.globalBetweenness.set(component.nodes[0], 0);
        continue;
      }

      // Calculate betweenness within the component
      const componentBetweenness = this.calculateComponentBetweenness(
        graph,
        component.nodes,
        normalize
      );

      // Add component results
      result.components.push({
        ...component,
        betweenness: componentBetweenness
      });

      // Update global betweenness
      for (const [nodeId, score] of componentBetweenness.entries()) {
        result.globalBetweenness.set(nodeId, score);
      }
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    // Format result for algorithm interface
    return {
      algorithmName: this.name,
      timestamp: Date.now(),
      data: Array.from(result.globalBetweenness.entries()).map(([nodeId, betweenness]) => ({
        nodeId,
        betweenness,
        componentId: result.components.find(c => c.nodes.includes(nodeId))?.id
      })),
      metadata: {
        executionTime,
        graphSize: graph.nodes.length,
        parameters: params,
        category: this.category,
        componentStats: result.componentStats
      }
    };
  }

  private calculateComponentBetweenness(
    graph: GraphData,
    componentNodes: string[],
    normalize: boolean
  ): Map<string, number> {
    const betweenness = new Map<string, number>();
    componentNodes.forEach(nodeId => betweenness.set(nodeId, 0));

    // For each node in the component, calculate shortest paths
    for (const source of componentNodes) {
      // Initialize data structures for BFS
      const distances = new Map<string, number>();
      const predecessors = new Map<string, string[]>();
      const sigma = new Map<string, number>();
      const queue: string[] = [source];
      
      // Initialize for source node
      distances.set(source, 0);
      sigma.set(source, 1);
      predecessors.set(source, []);

      // BFS to find shortest paths
      while (queue.length > 0) {
        const current = queue.shift()!;
        const currentDistance = distances.get(current)!;
        const currentSigma = sigma.get(current)!;

        // Find neighbors within the component
        const neighbors = this.getComponentNeighbors(graph, current, componentNodes);

        for (const neighbor of neighbors) {
          // If this is the first time we're seeing this node
          if (!distances.has(neighbor)) {
            distances.set(neighbor, currentDistance + 1);
            sigma.set(neighbor, currentSigma);
            predecessors.set(neighbor, [current]);
            queue.push(neighbor);
          }
          // If we found another shortest path
          else if (distances.get(neighbor) === currentDistance + 1) {
            sigma.set(neighbor, sigma.get(neighbor)! + currentSigma);
            predecessors.get(neighbor)!.push(current);
          }
        }
      }

      // Calculate dependency scores
      const dependency = new Map<string, number>();
      componentNodes.forEach(node => dependency.set(node, 0));

      // Process nodes in reverse order of distance
      const sortedNodes = Array.from(distances.entries())
        .sort((a, b) => b[1] - a[1]);

      for (const [node, _] of sortedNodes) {
        if (node !== source) {
          const nodePredecessors = predecessors.get(node) || [];
          for (const pred of nodePredecessors) {
            const ratio = sigma.get(pred)! / sigma.get(node)!;
            dependency.set(pred, dependency.get(pred)! + ratio * (1 + dependency.get(node)!));
          }
          if (node !== source) {
            betweenness.set(node, betweenness.get(node)! + dependency.get(node)!);
          }
        }
      }
    }

    // Normalize scores if requested
    if (normalize) {
      const maxScore = Math.max(...betweenness.values());
      if (maxScore > 0) {
        for (const [node, score] of betweenness.entries()) {
          betweenness.set(node, score / maxScore);
        }
      }
    }

    return betweenness;
  }

  private getComponentNeighbors(graph: GraphData, nodeId: string, componentNodes: string[]): string[] {
    const neighbors = new Set<string>();
    
    // Check all links for connections within the component
    for (const link of graph.links) {
      if (link.source === nodeId && componentNodes.includes(link.target)) {
        neighbors.add(link.target);
      } else if (link.target === nodeId && componentNodes.includes(link.source)) {
        neighbors.add(link.source);
      }
    }

    return Array.from(neighbors);
  }
} 