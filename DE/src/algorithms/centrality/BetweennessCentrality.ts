import { BaseAlgorithm } from '../base/BaseAlgorithm';
import { AlgorithmParameter, AlgorithmParameters, AlgorithmResult, GraphData } from '../../types/algorithm.types';
import { NodeObject } from '../../types';

interface NodeBetweenness {
  nodeId: string;
  betweenness: number;
}

export class BetweennessCentrality extends BaseAlgorithm {
  name = 'Betweenness Centrality';
  category = 'Relationship Analysis' as const;
  description = 'Calculates the betweenness centrality of each node in the graph, measuring how often a node appears on shortest paths between other nodes.';
  
  parameters: AlgorithmParameter[] = [
    {
      name: 'normalize',
      type: 'boolean',
      description: 'Whether to normalize the betweenness scores by the number of possible pairs of nodes',
      defaultValue: true,
      validation: (value: any) => typeof value === 'boolean'
    },
    {
      name: 'directed',
      type: 'boolean',
      description: 'Whether to treat the graph as directed',
      defaultValue: false,
      validation: (value: any) => typeof value === 'boolean'
    }
  ];

  protected async executeAlgorithm(graph: GraphData, params: AlgorithmParameters): Promise<AlgorithmResult> {
    const { normalize, directed } = params;
    const startTime = Date.now();

    // Create adjacency list representation
    const adjacencyList = new Map<string, Set<string>>();
    graph.nodes.forEach(node => {
      adjacencyList.set(node.id, new Set());
    });

    // Add edges to adjacency list
    graph.links.forEach(link => {
      const sourceId = typeof link.source === 'object' ? (link.source as NodeObject).id : String(link.source);
      const targetId = typeof link.target === 'object' ? (link.target as NodeObject).id : String(link.target);
      
      adjacencyList.get(sourceId)?.add(targetId);
      if (!directed) {
        adjacencyList.get(targetId)?.add(sourceId);
      }
    });

    // Calculate betweenness centrality
    const betweenness = new Map<string, number>();
    graph.nodes.forEach(node => betweenness.set(node.id, 0));

    // For each node as source
    for (const source of graph.nodes) {
      // BFS to find shortest paths
      const queue: string[] = [source.id];
      const visited = new Set<string>([source.id]);
      const distance = new Map<string, number>([[source.id, 0]]);
      const paths = new Map<string, string[]>();
      paths.set(source.id, [source.id]);

      while (queue.length > 0) {
        const current = queue.shift()!;
        const currentDistance = distance.get(current)!;

        for (const neighbor of adjacencyList.get(current) || []) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            distance.set(neighbor, currentDistance + 1);
            paths.set(neighbor, [...paths.get(current)!, neighbor]);
            queue.push(neighbor);
          } else if (distance.get(neighbor) === currentDistance + 1) {
            // Multiple shortest paths found - just update the count
            const currentPath = paths.get(current)!;
            const existingPath = paths.get(neighbor)!;
            if (currentPath.length === existingPath.length) {
              // Only count unique paths
              const currentPathStr = currentPath.join(',');
              const existingPathStr = existingPath.join(',');
              if (currentPathStr !== existingPathStr) {
                paths.set(neighbor, [...existingPath, ...currentPath]);
              }
            }
          }
        }
      }

      // Update betweenness scores
      for (const [nodeId, path] of paths) {
        if (nodeId !== source.id) {
          const uniqueNodes = new Set(path);
          for (const node of uniqueNodes) {
            if (node !== source.id && node !== nodeId) {
              betweenness.set(node, betweenness.get(node)! + 1);
            }
          }
        }
      }
    }

    // Normalize scores if requested
    if (normalize) {
      const n = graph.nodes.length;
      const normalizationFactor = (n - 1) * (n - 2) / 2;
      for (const [nodeId, score] of betweenness) {
        betweenness.set(nodeId, score / normalizationFactor);
      }
    }

    // Convert to array and sort by betweenness
    const result: NodeBetweenness[] = Array.from(betweenness.entries())
      .map(([nodeId, betweenness]) => ({ nodeId, betweenness }))
      .sort((a, b) => b.betweenness - a.betweenness);

    return this.createResult(result, params, startTime);
  }
} 