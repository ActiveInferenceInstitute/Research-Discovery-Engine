import { BaseAlgorithm } from '../base/BaseAlgorithm';
import { AlgorithmParameter, AlgorithmParameters, AlgorithmResult, GraphData } from '../../types/algorithm.types';
import { ComponentIdentifier } from '../utils/ComponentIdentifier';
import { NodeObject, LinkObject } from '../../types';

interface ResearchCluster {
  id: string;
  nodes: string[];
  type: 'theoretical' | 'experimental' | 'methodological' | 'mixed';
  cohesion: number;
  description: string;
  keyNodes: {
    nodeId: string;
    role: 'central' | 'connector' | 'specialist';
    importance: number;
  }[];
  metadata: {
    size: number;
    density: number;
    citationCount: number;
    primaryTopics: string[];
  };
}

export class ResearchClusterDetector extends BaseAlgorithm {
  name = 'Research Cluster Detector';
  category = 'Pattern Recognition' as const;
  description = 'Identifies cohesive research clusters by analyzing structural relationships, semantic content, and citation patterns.';

  parameters: AlgorithmParameter[] = [
    {
      name: 'minClusterSize',
      type: 'number',
      description: 'Minimum number of nodes required to form a cluster',
      defaultValue: 3,
      validation: (value: any) => typeof value === 'number' && value >= 2
    },
    {
      name: 'minCohesion',
      type: 'number',
      description: 'Minimum cohesion score for a valid cluster (0-1)',
      defaultValue: 0.4,
      validation: (value: any) => typeof value === 'number' && value >= 0 && value <= 1
    },
    {
      name: 'considerCitations',
      type: 'boolean',
      description: 'Whether to consider citation patterns in cluster detection',
      defaultValue: true,
      validation: (value: any) => typeof value === 'boolean'
    }
  ];

  protected async executeAlgorithm(graph: GraphData, params: AlgorithmParameters): Promise<AlgorithmResult> {
    const { minClusterSize, minCohesion, considerCitations } = params;
    const startTime = Date.now();

    // Identify initial components
    const componentIdentifier = new ComponentIdentifier(graph);
    const components = componentIdentifier.identifyComponents();

    // Initialize results
    const clusters: ResearchCluster[] = [];

    // Process each component
    for (const component of components) {
      if (component.nodes.length < minClusterSize) continue;

      // Find clusters within the component
      const componentClusters = this.findClustersInComponent(
        graph,
        component,
        minCohesion,
        considerCitations
      );

      // Filter and add valid clusters
      const validClusters = componentClusters.filter(cluster => 
        cluster.nodes.length >= minClusterSize && 
        cluster.cohesion >= minCohesion
      );
      clusters.push(...validClusters);
    }

    // Sort clusters by cohesion
    const sortedClusters = clusters.sort((a, b) => b.cohesion - a.cohesion);

    return this.createResult(sortedClusters, params, startTime);
  }

  private findClustersInComponent(
    graph: GraphData,
    component: { id: string; nodes: string[] },
    minCohesion: number,
    considerCitations: boolean
  ): ResearchCluster[] {
    const clusters: ResearchCluster[] = [];
    const nodes = graph.nodes.filter(n => component.nodes.includes(n.id));

    // Start with each node as a potential cluster center
    for (const centerNode of nodes) {
      // Find nodes that could form a cluster with the center
      const potentialClusterNodes = this.findPotentialClusterNodes(
        graph,
        centerNode,
        nodes,
        considerCitations
      );

      if (potentialClusterNodes.length < 2) continue;

      // Calculate cluster properties
      const cohesion = this.calculateClusterCohesion(
        graph,
        potentialClusterNodes,
        considerCitations
      );

      if (cohesion >= minCohesion) {
        const cluster = this.createCluster(
          graph,
          potentialClusterNodes,
          cohesion,
          considerCitations
        );
        clusters.push(cluster);
      }
    }

    return this.mergeOverlappingClusters(clusters);
  }

  private findPotentialClusterNodes(
    graph: GraphData,
    centerNode: NodeObject,
    allNodes: NodeObject[],
    considerCitations: boolean
  ): NodeObject[] {
    const potentialNodes: NodeObject[] = [centerNode];
    const visited = new Set<string>([centerNode.id]);

    // Use BFS to find connected nodes
    const queue: NodeObject[] = [centerNode];
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      // Find neighbors
      const neighbors = allNodes.filter(node => 
        !visited.has(node.id) &&
        this.areNodesConnected(graph, current.id, node.id) &&
        this.areNodesCompatible(current, node)
      );

      for (const neighbor of neighbors) {
        visited.add(neighbor.id);
        potentialNodes.push(neighbor);
        queue.push(neighbor);
      }
    }

    return potentialNodes;
  }

  private calculateClusterCohesion(
    graph: GraphData,
    nodes: NodeObject[],
    considerCitations: boolean
  ): number {
    let cohesion = 0;
    let totalComparisons = 0;

    // Calculate structural cohesion
    const structuralCohesion = this.calculateStructuralCohesion(graph, nodes);
    cohesion += structuralCohesion * 0.4;
    totalComparisons++;

    // Calculate semantic cohesion
    const semanticCohesion = this.calculateSemanticCohesion(nodes);
    cohesion += semanticCohesion * 0.4;
    totalComparisons++;

    // Calculate citation cohesion if enabled
    if (considerCitations) {
      const citationCohesion = this.calculateCitationCohesion(graph, nodes);
      cohesion += citationCohesion * 0.2;
      totalComparisons++;
    }

    return cohesion / totalComparisons;
  }

  private calculateStructuralCohesion(graph: GraphData, nodes: NodeObject[]): number {
    const nodeIds = nodes.map(n => n.id);
    let edges = 0;
    let possibleEdges = (nodes.length * (nodes.length - 1)) / 2;

    // Count existing edges
    for (const link of graph.links) {
      if (nodeIds.includes(link.source) && nodeIds.includes(link.target)) {
        edges++;
      }
    }

    return edges / possibleEdges;
  }

  private calculateSemanticCohesion(nodes: NodeObject[]): number {
    let cohesion = 0;
    let comparisons = 0;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].cssVector && nodes[j].cssVector) {
          cohesion += this.calculateMetadataSimilarity(
            nodes[i].cssVector,
            nodes[j].cssVector
          );
          comparisons++;
        }
      }
    }

    return comparisons > 0 ? cohesion / comparisons : 0;
  }

  private calculateCitationCohesion(graph: GraphData, nodes: NodeObject[]): number {
    const nodeIds = nodes.map(n => n.id);
    let citations = 0;
    let possibleCitations = nodes.length * (nodes.length - 1);

    // Count citations between cluster nodes
    for (const link of graph.links) {
      if (link.type === 'cites-source' &&
          nodeIds.includes(link.source) &&
          nodeIds.includes(link.target)) {
        citations++;
      }
    }

    return possibleCitations > 0 ? citations / possibleCitations : 0;
  }

  private createCluster(
    graph: GraphData,
    nodes: NodeObject[],
    cohesion: number,
    considerCitations: boolean
  ): ResearchCluster {
    // Determine cluster type
    const type = this.determineClusterType(nodes);

    // Identify key nodes
    const keyNodes = this.identifyKeyNodes(graph, nodes, considerCitations);

    // Calculate metadata
    const metadata = this.calculateClusterMetadata(graph, nodes, considerCitations);

    return {
      id: `cluster-${nodes[0].id}`,
      nodes: nodes.map(n => n.id),
      type,
      cohesion,
      description: this.generateClusterDescription(nodes, type, keyNodes),
      keyNodes,
      metadata
    };
  }

  private determineClusterType(nodes: NodeObject[]): ResearchCluster['type'] {
    const typeCounts = {
      theoretical: 0,
      experimental: 0,
      methodological: 0
    };

    nodes.forEach(node => {
      if (node.type.includes('Theoretical')) typeCounts.theoretical++;
      if (node.type.includes('Material') || node.type.includes('Phenomenon')) typeCounts.experimental++;
      if (node.type.includes('Method')) typeCounts.methodological++;
    });

    const maxType = Object.entries(typeCounts)
      .reduce((max, [type, count]) => count > max.count ? { type, count } : max,
        { type: 'mixed', count: 0 });

    return maxType.count > nodes.length * 0.5 ? maxType.type as ResearchCluster['type'] : 'mixed';
  }

  private identifyKeyNodes(
    graph: GraphData,
    nodes: NodeObject[],
    considerCitations: boolean
  ): ResearchCluster['keyNodes'] {
    const keyNodes: ResearchCluster['keyNodes'] = [];

    // Calculate node importance scores
    const importanceScores = new Map<string, number>();
    nodes.forEach(node => {
      let score = 0;

      // Structural importance
      const degree = graph.links.filter(link =>
        link.source === node.id || link.target === node.id
      ).length;
      score += degree / (nodes.length - 1);

      // Citation importance
      if (considerCitations) {
        const citations = graph.links.filter(link =>
          link.type === 'cites-source' &&
          (link.source === node.id || link.target === node.id)
        ).length;
        score += citations / (nodes.length - 1);
      }

      importanceScores.set(node.id, score);
    });

    // Identify central nodes
    const centralNodes = Array.from(importanceScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, Math.ceil(nodes.length * 0.2));

    centralNodes.forEach(([nodeId, importance]) => {
      const role = this.determineNodeRole(graph, nodeId, nodes);
      keyNodes.push({ nodeId, role, importance });
    });

    return keyNodes;
  }

  private determineNodeRole(
    graph: GraphData,
    nodeId: string,
    clusterNodes: NodeObject[]
  ): 'central' | 'connector' | 'specialist' {
    const node = clusterNodes.find(n => n.id === nodeId)!;
    const neighbors = this.getNeighbors(graph, nodeId);

    // Count connections to nodes outside the cluster
    const externalConnections = neighbors.filter(n => 
      !clusterNodes.some(cn => cn.id === n)
    ).length;

    if (externalConnections > neighbors.length * 0.5) {
      return 'connector';
    }

    if (node.type.includes('Category')) {
      return 'specialist';
    }

    return 'central';
  }

  private calculateClusterMetadata(
    graph: GraphData,
    nodes: NodeObject[],
    considerCitations: boolean
  ): ResearchCluster['metadata'] {
    const nodeIds = nodes.map(n => n.id);
    
    // Calculate density
    const edges = graph.links.filter(link =>
      nodeIds.includes(link.source) && nodeIds.includes(link.target)
    ).length;
    const possibleEdges = (nodes.length * (nodes.length - 1)) / 2;
    const density = possibleEdges > 0 ? edges / possibleEdges : 0;

    // Calculate citation count
    const citationCount = considerCitations ? graph.links.filter(link =>
      link.type === 'cites-source' &&
      nodeIds.includes(link.source) &&
      nodeIds.includes(link.target)
    ).length : 0;

    // Extract primary topics
    const topics = new Map<string, number>();
    nodes.forEach(node => {
      if (node.cssVector) {
        Object.entries(node.cssVector).forEach(([key, value]) => {
          if (typeof value === 'string' || Array.isArray(value)) {
            const topic = Array.isArray(value) ? value[0] : value;
            topics.set(topic, (topics.get(topic) || 0) + 1);
          }
        });
      }
    });

    const primaryTopics = Array.from(topics.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);

    return {
      size: nodes.length,
      density,
      citationCount,
      primaryTopics
    };
  }

  private generateClusterDescription(
    nodes: NodeObject[],
    type: ResearchCluster['type'],
    keyNodes: ResearchCluster['keyNodes']
  ): string {
    const centralNode = keyNodes.find(n => n.role === 'central');
    const connectorNode = keyNodes.find(n => n.role === 'connector');
    
    let description = `A ${type} research cluster of ${nodes.length} nodes`;
    
    if (centralNode) {
      const node = nodes.find(n => n.id === centralNode.nodeId)!;
      description += ` centered around ${node.label || node.id}`;
    }
    
    if (connectorNode) {
      const node = nodes.find(n => n.id === connectorNode.nodeId)!;
      description += ` with ${node.label || node.id} acting as a connector`;
    }

    return description;
  }

  private mergeOverlappingClusters(clusters: ResearchCluster[]): ResearchCluster[] {
    const merged: ResearchCluster[] = [];
    const processed = new Set<string>();

    for (const cluster of clusters) {
      if (processed.has(cluster.id)) continue;

      // Find overlapping clusters
      const overlapping = clusters.filter(c =>
        c.id !== cluster.id &&
        !processed.has(c.id) &&
        this.calculateOverlap(cluster.nodes, c.nodes) > 0.5
      );

      if (overlapping.length === 0) {
        merged.push(cluster);
        processed.add(cluster.id);
        continue;
      }

      // Merge overlapping clusters
      const mergedCluster = this.mergeClusters([cluster, ...overlapping]);
      merged.push(mergedCluster);
      processed.add(cluster.id);
      overlapping.forEach(c => processed.add(c.id));
    }

    return merged;
  }

  private calculateOverlap(nodes1: string[], nodes2: string[]): number {
    const set1 = new Set(nodes1);
    const set2 = new Set(nodes2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    return intersection.size / Math.min(set1.size, set2.size);
  }

  private mergeClusters(clusters: ResearchCluster[]): ResearchCluster {
    const allNodes = new Set<string>();
    let totalCohesion = 0;
    const allKeyNodes = new Map<string, ResearchCluster['keyNodes'][0]>();

    clusters.forEach(cluster => {
      cluster.nodes.forEach(node => allNodes.add(node));
      totalCohesion += cluster.cohesion;
      cluster.keyNodes.forEach(keyNode => {
        if (!allKeyNodes.has(keyNode.nodeId) ||
            keyNode.importance > allKeyNodes.get(keyNode.nodeId)!.importance) {
          allKeyNodes.set(keyNode.nodeId, keyNode);
        }
      });
    });

    const nodes = Array.from(allNodes);
    const type = this.determineClusterType(
      nodes.map(id => this.graph.nodes.find(n => n.id === id)!)
    );

    return {
      id: `merged-${clusters[0].id}`,
      nodes,
      type,
      cohesion: totalCohesion / clusters.length,
      description: this.generateClusterDescription(
        nodes.map(id => this.graph.nodes.find(n => n.id === id)!),
        type,
        Array.from(allKeyNodes.values())
      ),
      keyNodes: Array.from(allKeyNodes.values()),
      metadata: this.calculateClusterMetadata(
        this.graph,
        nodes.map(id => this.graph.nodes.find(n => n.id === id)!),
        true
      )
    };
  }

  private areNodesConnected(graph: GraphData, node1Id: string, node2Id: string): boolean {
    return graph.links.some(link =>
      (link.source === node1Id && link.target === node2Id) ||
      (link.source === node2Id && link.target === node1Id)
    );
  }

  private areNodesCompatible(node1: NodeObject, node2: NodeObject): boolean {
    // Check type compatibility
    if (node1.type.includes('Category') && node2.type.includes('Category')) {
      return false;
    }

    // Check metadata compatibility
    if (node1.cssVector && node2.cssVector) {
      const similarity = this.calculateMetadataSimilarity(node1.cssVector, node2.cssVector);
      return similarity > 0.3;
    }

    return true;
  }

  private calculateMetadataSimilarity(vector1: any, vector2: any): number {
    let similarity = 0;
    let totalFields = 0;

    const fieldsToCompare = [
      'material_primary',
      'mechanism_primary',
      'method_primary',
      'phenomenon_primary',
      'application_primary',
      'theoretical_concept_primary'
    ];

    for (const field of fieldsToCompare) {
      if (vector1[field] && vector2[field]) {
        const fieldSimilarity = this.calculateFieldSimilarity(vector1[field], vector2[field]);
        similarity += fieldSimilarity;
        totalFields++;
      }
    }

    return totalFields > 0 ? similarity / totalFields : 0;
  }

  private calculateFieldSimilarity(field1: any, field2: any): number {
    if (Array.isArray(field1) && Array.isArray(field2)) {
      const common = field1.filter(f => field2.includes(f));
      return common.length / Math.max(field1.length, field2.length);
    }
    return field1 === field2 ? 1 : 0;
  }

  private getNeighbors(graph: GraphData, nodeId: string): string[] {
    const neighbors = new Set<string>();
    
    graph.links.forEach(link => {
      if (link.source === nodeId) neighbors.add(link.target);
      if (link.target === nodeId) neighbors.add(link.source);
    });

    return Array.from(neighbors);
  }
} 