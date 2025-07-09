// src/utils/graphUtils.ts
// Helper functions for graph manipulation and analysis.

import { GraphData, NodeObject, LinkObject, CSSVector, NodeType } from '../types';
import { cloneDeep } from 'lodash';
import * as d3 from 'd3';

/**
 * Assigns nodes to clusters for force-directed clustering visualization
 * 
 * @param nodes - Array of nodes to cluster
 * @param numClusters - Number of clusters to create
 * @returns Nodes with cluster assignments
 */
export function assignNodesToClusters(nodes: NodeObject[], numClusters: number): NodeObject[] {
  // Simple implementation of force-directed clustering
  const clusters = Array.from({ length: numClusters }, (_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    z: Math.random() * 100 - 50
  }));
  
  // Assign initial random cluster to each node
  const clonedNodes = nodes.map(node => ({
    ...node,
    cluster: Math.floor(Math.random() * numClusters)
  }));
  
  return clonedNodes;
}

/**
 * Find all neighbors of a given node up to a certain depth
 * 
 * @param graphData - The graph data
 * @param nodeId - ID of the node to find neighbors for
 * @param depth - Maximum depth to search (default: 1)
 * @returns Sets of neighbor nodes and connecting links
 */
export function getNeighbors(graphData: GraphData, nodeId: string, depth: number = 1): { nodes: Set<NodeObject>, links: Set<LinkObject> } {
  const nodes = new Set<NodeObject>();
  const links = new Set<LinkObject>();
  const visitedNodes = new Set<string>();
  const queue: { id: string, d: number }[] = [{ id: nodeId, d: 0 }];

  const getNode = (id: string): NodeObject | undefined => 
    graphData.nodes.find(n => n.id === id);

  while (queue.length > 0) {
    const { id, d } = queue.shift()!;

    if (visitedNodes.has(id) || d > depth) continue;
    visitedNodes.add(id);

    const currentNode = getNode(id);
    if (currentNode) {
      nodes.add(currentNode);
    }

    if (d < depth) {
      graphData.links.forEach(link => {
        try {
          const sourceId = typeof link.source === 'object' ? link.source.id : String(link.source);
          const targetId = typeof link.target === 'object' ? link.target.id : String(link.target);

          if (sourceId === id) {
            const targetNode = getNode(targetId);
            if (targetNode) {
              links.add(link);
              if (!visitedNodes.has(targetId)) {
                queue.push({ id: targetId, d: d + 1 });
              }
            }
          } else if (targetId === id) {
            const sourceNode = getNode(sourceId);
            if (sourceNode) {
              links.add(link);
              if (!visitedNodes.has(sourceId)) {
                queue.push({ id: sourceId, d: d + 1 });
              }
            }
          }
        } catch (error) {
          console.warn("Error processing link in getNeighbors:", error);
        }
      });
    }
  }

  // Always include the starting node if found
  const startNode = getNode(nodeId);
  if (startNode) nodes.add(startNode);
  
  return { nodes, links };
}

// Filter graph data based on search query
export function filterGraphData(graphData: GraphData, searchQuery: string): GraphData {
  if (!graphData || !graphData.nodes || !graphData.links) {
    console.warn("filterGraphData: Missing or empty graph data");
    return { nodes: [], links: [] };
  }
  
  if (!searchQuery) return graphData;

  const lowerQuery = searchQuery.toLowerCase().trim();
  const relevantNodeIds = new Set<string>();

  // Find nodes matching query in ID, Label, or Description
  graphData.nodes.forEach(node => {
    if (!node || !node.id) return; // Skip invalid nodes
    
    const isMatch = node.id.toLowerCase().includes(lowerQuery) ||
                  (node.label || '').toLowerCase().includes(lowerQuery) ||
                  (node.description || '').toLowerCase().includes(lowerQuery);
    if (isMatch) {
      relevantNodeIds.add(node.id);
    }
  });

  // Add direct neighbors of matching nodes
  const nodesToExplore = Array.from(relevantNodeIds);
  const neighborsToAdd = new Set<string>();
  
  nodesToExplore.forEach(nodeId => {
    try {
      const { nodes: neighbors } = getNeighbors(graphData, nodeId, 1);
      neighbors.forEach(neighbor => {
        if (!relevantNodeIds.has(neighbor.id)) {
          neighborsToAdd.add(neighbor.id);
        }
      });
    } catch (error) {
      console.warn(`Error getting neighbors for node ${nodeId}:`, error);
    }
  });
  
  neighborsToAdd.forEach(id => relevantNodeIds.add(id));

  // Filter nodes based on relevance
  const filteredNodes = graphData.nodes.filter(node => node && node.id && relevantNodeIds.has(node.id));
  
  // Create lookup map for filtered node IDs
  const filteredNodeIds = new Set(filteredNodes.map(node => node.id));
  
  // Filter links - only include those where both source and target exist in filtered nodes
  const filteredLinks = graphData.links.filter(link => {
    try {
      if (!link || !link.source || !link.target) return false;
      
      const sourceId = typeof link.source === 'object' ? link.source.id : String(link.source);
      const targetId = typeof link.target === 'object' ? link.target.id : String(link.target);
      
      return sourceId && targetId && 
             filteredNodeIds.has(sourceId) && 
             filteredNodeIds.has(targetId);
    } catch (error) {
      console.warn("Error filtering link:", error);
      return false;
    }
  });

  return { nodes: filteredNodes, links: filteredLinks };
}

// Simulate generating suggestions based on a partial CSS vector
export function generateMockSuggestions(conceptState: Partial<CSSVector>, cnmData: GraphData): { fieldPath: string, suggestions: { value: string; node?: NodeObject; explanation: string; action?: any }[] }[] {
  if (!cnmData || !cnmData.nodes || cnmData.nodes.length === 0) {
    console.warn("generateMockSuggestions: Missing or empty graph data");
    return [];
  }
  
  const suggestions: { fieldPath: string, suggestions: { value: string; node?: NodeObject; explanation: string; action?: any }[] }[] = [];
  const currentCSS = conceptState || {};
  const nodes = cnmData.nodes;

  // Find node helper
  const findNode = (condition: (node: NodeObject) => boolean): NodeObject | undefined => 
    nodes.find(condition);

  // Suggest materials based on mechanism
  if (currentCSS.dynamics?.mechanism_primary?.length) {
    const mechanismId = currentCSS.dynamics.mechanism_primary[0];
    const mechanismNode = findNode(n => n.id === mechanismId);
    
    if (mechanismNode) {
      const mechanismLabel = mechanismNode.label || mechanismNode.id;
      const compatibleMaterials = nodes
        .filter(node => 
          node.type === 'Material' && 
          (node.description?.toLowerCase().includes(mechanismLabel.toLowerCase()) || 
          node.references?.some(ref => mechanismNode.references?.includes(ref)))
        )
        .slice(0, 3);

      if (compatibleMaterials.length) {
        suggestions.push({
          fieldPath: 'context.material_primary',
          suggestions: compatibleMaterials.map(mat => ({
            value: mat.id,
            node: mat,
            explanation: `Related to ${mechanismLabel}`
          }))
        });
      }
    }
  }

  // Suggest environment based on material
  if (currentCSS.context?.material_primary?.length) {
    const materialId = currentCSS.context.material_primary[0];
    const materialNode = findNode(n => n.id === materialId);
    
    if (materialNode) {
      const materialLabel = materialNode.label || materialNode.id;
      
      if (materialLabel.includes('Hydrogel')) {
        suggestions.push({
          fieldPath: 'context.environment_type',
          suggestions: [{ 
            value: 'AqueousElectrolyte', 
            explanation: `Likely needed for ${materialLabel}` 
          }]
        });
      }
    }
  }

  // Always add a novel idea suggestion for key fields
  const novelFields = [
    'context.material_primary',
    'dynamics.mechanism_primary',
    'interface.input_mechanism',
    'interface.output_mechanism',
    'memory.mechanism_primary'
  ];
  
  novelFields.forEach(fieldPath => {
    if (!suggestions.some(s => s.fieldPath === fieldPath)) {
      suggestions.push({
        fieldPath: fieldPath,
        suggestions: [{ 
          value: 'Generate Novel Idea...', 
          explanation: 'Let AI suggest something unexpected', 
          action: { 
            type: 'trigger-agent', 
            payload: { 
              task: 'generate-idea', 
              field: fieldPath 
            } 
          } 
        }]
      });
    }
  });

  return suggestions;
}

// Generate a protocol outline from a CSS vector
export function generateMockProtocol(conceptState: Partial<CSSVector>): string {
  const css = conceptState || {};
  let protocol = `# Experimental Protocol Outline\n\n`;
  protocol += `**Concept ID:** ${css.meta?.id || 'New Concept'}\n`;
  if (css.constraints?.objective_type) protocol += `**Objective:** ${css.constraints.objective_type}\n`;
  protocol += `\n`;

  protocol += `## 1. Fabrication / Synthesis\n`;
  if (css.context?.material_primary?.length) 
    protocol += `- **Materials:** ${css.context.material_primary.join(', ')}\n`;
  if (css.context?.morphology_type) 
    protocol += `- **Target Morphology:** ${css.context.morphology_type} (Scale: ${css.context.morphology_scale || 'N/A'})\n`;
  if (css.context?.fabrication_primary?.length) 
    protocol += `- **Method(s):** ${css.context.fabrication_primary.join(', ')}\n`;
  else 
    protocol += `- Fabrication method needed.\n`;
  protocol += `  - (Add specific steps based on chosen materials and methods)\n\n`;

  protocol += `## 2. Characterization\n`;
  if (css.state?.basis?.length) 
    protocol += `- **State Measurement:** Use [${css.interface?.output_mechanism?.join(', ') || 'Appropriate Method'}] to measure ${css.state.basis.join(', ')}\n`;
  else 
    protocol += `- Define state basis and measurement method.\n`;
  if (css.memory?.mechanism_primary?.length) 
    protocol += `- **Memory:** Characterize ${css.memory.mechanism_primary.join(', ')} (Retention: ${css.memory.timescale_retention || 'N/A'}, Capacity: ${css.memory.capacity_estimate || 'N/A'})\n`;
  protocol += `  - (Add steps for structural and property analysis)\n\n`;

  protocol += `## 3. Experiment Setup\n`;
  if (css.context?.environment_type) 
    protocol += `- **Environment:** ${css.context.environment_type}\n`;
  if (css.interface?.input_mechanism?.length) 
    protocol += `- **Input:** Apply ${css.interface.input_mechanism.join(', ')} stimuli.\n`;
  else 
    protocol += `- Define input stimuli.\n`;
  if (css.context?.energy_source_primary) 
    protocol += `- **Energy Source:** ${css.context.energy_source_primary}\n`;
  protocol += `  - (Detail setup for applying inputs and monitoring outputs)\n\n`;

  protocol += `## 4. Testing Protocol\n`;
  if (css.constraints?.objective_type) 
    protocol += `- **Goal:** Evaluate based on ${css.constraints.objective_type}.\n`;
  if (css.hierarchy?.emergence_manifestation?.length) 
    protocol += `- **Observe:** Look for ${css.hierarchy.emergence_manifestation.join(', ')}.\n`;
  if (css.adaptation?.mechanism_primary?.length) 
    protocol += `- **Adaptation Test:** Apply ${css.adaptation.guidance || 'relevant feedback'} to test ${css.adaptation.mechanism_primary.join(', ')} over ${css.adaptation.timescale || 'appropriate time'}.\n`;
  protocol += `  - (Define specific experimental runs, control groups, data acquisition)\n\n`;

  protocol += `## 5. Data Analysis\n`;
  protocol += `- Process measurements (output signals, state changes, tracking data).\n`;
  if (css.constraints?.uncertainty_handling) 
    protocol += `- Account for variability using ${css.constraints.uncertainty_handling}.\n`;
  protocol += `- Compare results against objective metrics and controls.\n\n`;

  return protocol;
}