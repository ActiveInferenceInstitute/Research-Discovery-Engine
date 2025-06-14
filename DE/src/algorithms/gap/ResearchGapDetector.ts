import { BaseAlgorithm } from '../base/BaseAlgorithm';
import { AlgorithmParameter, AlgorithmParameters, AlgorithmResult, GraphData } from '../../types/algorithm.types';
import { ComponentIdentifier } from '../utils/ComponentIdentifier';
import { NodeObject, LinkObject } from '../../types';

interface ResearchGap {
  id: string;
  type: 'conceptual' | 'methodological' | 'experimental' | 'theoretical';
  sourceNodes: string[];
  targetNodes: string[];
  confidence: number;
  description: string;
  potentialConnections: {
    nodeId: string;
    type: string;
    relevance: number;
  }[];
}

export class ResearchGapDetector extends BaseAlgorithm {
  name = 'Research Gap Detector';
  category = 'Gap Detection' as const;
  description = 'Identifies potential research gaps by analyzing node relationships, citations, and semantic content to find opportunities for scientific discovery.';
  
  parameters: AlgorithmParameter[] = [
    {
      name: 'minConfidence',
      type: 'number',
      description: 'Minimum confidence threshold for gap detection (0-1)',
      defaultValue: 0.6,
      validation: (value: any) => typeof value === 'number' && value >= 0 && value <= 1
    },
    {
      name: 'maxGapDistance',
      type: 'number',
      description: 'Maximum distance between nodes to consider for gap detection',
      defaultValue: 3,
      validation: (value: any) => typeof value === 'number' && value > 0
    },
    {
      name: 'considerCitations',
      type: 'boolean',
      description: 'Whether to consider citation patterns in gap detection',
      defaultValue: true,
      validation: (value: any) => typeof value === 'boolean'
    }
  ];

  protected async executeAlgorithm(graph: GraphData, params: AlgorithmParameters): Promise<AlgorithmResult> {
    const { minConfidence, maxGapDistance, considerCitations } = params;
    const startTime = Date.now();

    // Identify components for analysis
    const componentIdentifier = new ComponentIdentifier(graph);
    const components = componentIdentifier.identifyComponents();
    
    // Initialize results
    const gaps: ResearchGap[] = [];

    // Analyze each component
    for (const component of components) {
      if (component.isIsolated) continue;

      // Find potential gaps within the component
      const componentGaps = this.findGapsInComponent(
        graph,
        component,
        maxGapDistance,
        considerCitations
      );

      // Filter gaps by confidence
      const validGaps = componentGaps.filter(gap => gap.confidence >= minConfidence);
      gaps.push(...validGaps);
    }

    // Find gaps between components
    const interComponentGaps = this.findGapsBetweenComponents(
      graph,
      components,
      maxGapDistance,
      considerCitations
    );

    // Combine and sort results
    const allGaps = [...gaps, ...interComponentGaps]
      .sort((a, b) => b.confidence - a.confidence);

    return this.createResult(allGaps, params, startTime);
  }

  private findGapsInComponent(
    graph: GraphData,
    component: { id: string; nodes: string[] },
    maxDistance: number,
    considerCitations: boolean
  ): ResearchGap[] {
    const gaps: ResearchGap[] = [];
    const nodes = graph.nodes.filter(n => component.nodes.includes(n.id));

    // Analyze each pair of nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];

        // Skip if nodes are directly connected
        if (this.areNodesConnected(graph, node1.id, node2.id)) continue;

        // Calculate distance and potential connections
        const { distance, path } = this.findShortestPath(graph, node1.id, node2.id);
        if (distance > maxDistance) continue;

        // Analyze potential gap
        const gap = this.analyzePotentialGap(graph, node1, node2, path, considerCitations);
        if (gap) {
          gaps.push({
            ...gap,
            id: `gap-${node1.id}-${node2.id}`,
            sourceNodes: [node1.id],
            targetNodes: [node2.id]
          });
        }
      }
    }

    return gaps;
  }

  private findGapsBetweenComponents(
    graph: GraphData,
    components: { id: string; nodes: string[] }[],
    maxDistance: number,
    considerCitations: boolean
  ): ResearchGap[] {
    const gaps: ResearchGap[] = [];

    // Analyze each pair of components
    for (let i = 0; i < components.length; i++) {
      for (let j = i + 1; j < components.length; j++) {
        const comp1 = components[i];
        const comp2 = components[j];

        // Find closest nodes between components
        const { node1, node2, distance } = this.findClosestNodes(graph, comp1, comp2);
        if (distance > maxDistance) continue;

        // Analyze potential gap
        const gap = this.analyzePotentialGap(
          graph,
          graph.nodes.find(n => n.id === node1)!,
          graph.nodes.find(n => n.id === node2)!,
          [],
          considerCitations
        );

        if (gap) {
          gaps.push({
            ...gap,
            id: `gap-${comp1.id}-${comp2.id}`,
            sourceNodes: comp1.nodes,
            targetNodes: comp2.nodes
          });
        }
      }
    }

    return gaps;
  }

  private analyzePotentialGap(
    graph: GraphData,
    node1: NodeObject,
    node2: NodeObject,
    path: string[],
    considerCitations: boolean
  ): ResearchGap | null {
    // Calculate base confidence from node types and metadata
    let confidence = this.calculateBaseConfidence(node1, node2);

    // Adjust confidence based on citations if enabled
    if (considerCitations) {
      confidence *= this.calculateCitationConfidence(graph, node1, node2);
    }

    // Determine gap type
    const type = this.determineGapType(node1, node2);

    // Find potential connecting nodes
    const potentialConnections = this.findPotentialConnections(graph, node1, node2, path);

    // Only return if we have meaningful results
    if (confidence < 0.3 || potentialConnections.length === 0) {
      return null;
    }

    return {
      id: '', // Will be set by caller
      type,
      sourceNodes: [], // Will be set by caller
      targetNodes: [], // Will be set by caller
      confidence,
      description: this.generateGapDescription(node1, node2, type),
      potentialConnections
    };
  }

  private calculateBaseConfidence(node1: NodeObject, node2: NodeObject): number {
    let confidence = 0.5;

    // Adjust based on node types
    if (this.areCompatibleTypes(node1.type, node2.type)) {
      confidence += 0.2;
    }

    // Adjust based on metadata
    if (node1.cssVector && node2.cssVector) {
      confidence += this.calculateMetadataConfidence(node1.cssVector, node2.cssVector);
    }

    return Math.min(confidence, 1);
  }

  private calculateCitationConfidence(graph: GraphData, node1: NodeObject, node2: NodeObject): number {
    // Count citations between nodes
    const citations = graph.links.filter(link => 
      (link.source === node1.id || link.target === node1.id) &&
      (link.source === node2.id || link.target === node2.id) &&
      link.type === 'cites-source'
    ).length;

    // More citations = higher confidence
    return Math.min(1, 0.5 + (citations * 0.1));
  }

  private determineGapType(node1: NodeObject, node2: NodeObject): ResearchGap['type'] {
    // Determine gap type based on node types and metadata
    if (node1.type.includes('Method') || node2.type.includes('Method')) {
      return 'methodological';
    }
    if (node1.type.includes('Theoretical') || node2.type.includes('Theoretical')) {
      return 'theoretical';
    }
    if (node1.type.includes('Material') || node2.type.includes('Material')) {
      return 'experimental';
    }
    return 'conceptual';
  }

  private findPotentialConnections(
    graph: GraphData,
    node1: NodeObject,
    node2: NodeObject,
    path: string[]
  ): ResearchGap['potentialConnections'] {
    const connections: ResearchGap['potentialConnections'] = [];

    // Find nodes that could bridge the gap
    const potentialNodes = graph.nodes.filter(node => 
      node.id !== node1.id && 
      node.id !== node2.id &&
      !path.includes(node.id)
    );

    for (const node of potentialNodes) {
      const relevance = this.calculateConnectionRelevance(graph, node1, node2, node);
      if (relevance > 0.3) {
        connections.push({
          nodeId: node.id,
          type: node.type,
          relevance
        });
      }
    }

    return connections.sort((a, b) => b.relevance - a.relevance);
  }

  private calculateConnectionRelevance(
    graph: GraphData,
    node1: NodeObject,
    node2: NodeObject,
    potentialNode: NodeObject
  ): number {
    let relevance = 0;

    // Check if potential node is connected to both nodes
    const connectedToNode1 = this.areNodesConnected(graph, potentialNode.id, node1.id);
    const connectedToNode2 = this.areNodesConnected(graph, potentialNode.id, node2.id);

    if (connectedToNode1 && connectedToNode2) {
      relevance += 0.4;
    } else if (connectedToNode1 || connectedToNode2) {
      relevance += 0.2;
    }

    // Check type compatibility
    if (this.areCompatibleTypes(potentialNode.type, node1.type) ||
        this.areCompatibleTypes(potentialNode.type, node2.type)) {
      relevance += 0.3;
    }

    // Check metadata similarity
    if (potentialNode.cssVector && node1.cssVector && node2.cssVector) {
      relevance += this.calculateMetadataConfidence(
        potentialNode.cssVector,
        node1.cssVector
      ) * 0.15;
      relevance += this.calculateMetadataConfidence(
        potentialNode.cssVector,
        node2.cssVector
      ) * 0.15;
    }

    return Math.min(relevance, 1);
  }

  private areCompatibleTypes(type1: string, type2: string): boolean {
    // Define compatible type pairs
    const compatiblePairs = [
      ['Material', 'Material_Category'],
      ['Mechanism', 'Mechanism_Category'],
      ['Method', 'Method_Category'],
      ['Phenomenon', 'Phenomenon_Category'],
      ['Application', 'Application_Category'],
      ['TheoreticalConcept', 'TheoreticalConcept_Category']
    ];

    return compatiblePairs.some(([t1, t2]) => 
      (type1.includes(t1) && type2.includes(t2)) ||
      (type1.includes(t2) && type2.includes(t1))
    );
  }

  private calculateMetadataConfidence(vector1: any, vector2: any): number {
    let confidence = 0;
    let totalFields = 0;

    // Compare relevant fields
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
        const similarity = this.calculateFieldSimilarity(vector1[field], vector2[field]);
        confidence += similarity;
        totalFields++;
      }
    }

    return totalFields > 0 ? confidence / totalFields : 0;
  }

  private calculateFieldSimilarity(field1: any, field2: any): number {
    if (Array.isArray(field1) && Array.isArray(field2)) {
      const common = field1.filter(f => field2.includes(f));
      return common.length / Math.max(field1.length, field2.length);
    }
    return field1 === field2 ? 1 : 0;
  }

  private generateGapDescription(
    node1: NodeObject,
    node2: NodeObject,
    type: ResearchGap['type']
  ): string {
    const typeDescriptions = {
      conceptual: 'conceptual understanding',
      methodological: 'methodological approach',
      experimental: 'experimental validation',
      theoretical: 'theoretical framework'
    };

    return `Potential ${typeDescriptions[type]} gap between ${node1.label || node1.id} and ${node2.label || node2.id}`;
  }

  private areNodesConnected(graph: GraphData, node1Id: string, node2Id: string): boolean {
    return graph.links.some(link =>
      (link.source === node1Id && link.target === node2Id) ||
      (link.source === node2Id && link.target === node1Id)
    );
  }

  private findShortestPath(
    graph: GraphData,
    startId: string,
    endId: string
  ): { distance: number; path: string[] } {
    const queue: { id: string; distance: number; path: string[] }[] = [
      { id: startId, distance: 0, path: [startId] }
    ];
    const visited = new Set<string>([startId]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (current.id === endId) {
        return { distance: current.distance, path: current.path };
      }

      // Find neighbors
      const neighbors = graph.links
        .filter(link => link.source === current.id || link.target === current.id)
        .map(link => link.source === current.id ? link.target : link.source);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push({
            id: neighbor,
            distance: current.distance + 1,
            path: [...current.path, neighbor]
          });
        }
      }
    }

    return { distance: Infinity, path: [] };
  }

  private findClosestNodes(
    graph: GraphData,
    comp1: { id: string; nodes: string[] },
    comp2: { id: string; nodes: string[] }
  ): { node1: string; node2: string; distance: number } {
    let minDistance = Infinity;
    let closestPair = { node1: '', node2: '', distance: Infinity };

    for (const node1 of comp1.nodes) {
      for (const node2 of comp2.nodes) {
        const { distance } = this.findShortestPath(graph, node1, node2);
        if (distance < minDistance) {
          minDistance = distance;
          closestPair = { node1, node2, distance };
        }
      }
    }

    return closestPair;
  }
} 