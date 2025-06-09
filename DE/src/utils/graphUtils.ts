/**
 * @fileoverview Graph Utility Functions
 * 
 * Collection of utility functions for manipulating and analyzing knowledge graph data.
 * Includes functions for finding neighbors, filtering data, generating mock content,
 * and performing graph-based computations.
 */

import { GraphData, NodeObject, LinkObject } from '../types';
import type { CSSVector } from '../types/css';
import { cloneDeep } from 'lodash';

/**
 * Finds all nodes and links within a specified distance from a given node
 * 
 * @param graphData - Complete graph data to search within
 * @param nodeId - ID of the central node to start from
 * @param depth - Maximum distance to traverse (default: 1)
 * @returns Object containing sets of connected nodes and their connecting links
 * 
 * @example
 * ```typescript
 * const graph = { nodes: [...], links: [...] };
 * const { nodes, links } = getNeighbors(graph, 'neural-networks', 2);
 * console.log(`Found ${nodes.size} neighbors within distance 2`);
 * ```
 */
export function getNeighbors(graphData: GraphData, nodeId: string, depth: number = 1): { nodes: Set<NodeObject>, links: Set<LinkObject> } {
  const nodes = new Set<NodeObject>();
  const links = new Set<LinkObject>();
  const visitedNodes = new Set<string>();
  const queue: { id: string, d: number }[] = [{ id: nodeId, d: 0 }];

  /**
   * Helper function to find a node by its ID
   * @param id - Node identifier to search for
   * @returns NodeObject if found, undefined otherwise
   */
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
          const sourceId = typeof link.source === 'object' ? (link.source as NodeObject).id : String(link.source);
          const targetId = typeof link.target === 'object' ? (link.target as NodeObject).id : String(link.target);

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

/**
 * Filters graph data based on a search query, including semantic expansion
 * 
 * @param graphData - Complete graph data to filter
 * @param searchQuery - Search terms to match against node content
 * @returns Filtered graph containing only relevant nodes and their connections
 * 
 * @description This function performs a multi-stage filtering process:
 * 1. Direct text matching against node properties
 * 2. Neighbor expansion to include related nodes
 * 3. Link filtering to maintain graph connectivity
 * 
 * @example
 * ```typescript
 * const fullGraph = await loadGraphData();
 * const filtered = filterGraphData(fullGraph, 'neural networks');
 * console.log(`Filtered to ${filtered.nodes.length} relevant nodes`);
 * ```
 */
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

/**
 * Generates mock AI suggestions for concept design based on current state
 * 
 * @param conceptState - Partial CSS vector representing current concept
 * @param cnmData - Complete knowledge graph for finding suggestions
 * @returns Array of suggestion objects with field paths and recommendation data
 * 
 * @description Creates realistic AI suggestions by analyzing the concept state
 * and finding relevant nodes in the knowledge graph. Used for development
 * and testing when backend AI services are unavailable.
 * 
 * @example
 * ```typescript
 * const suggestions = generateMockSuggestions(
 *   { context: { material_primary: ['graphene'] } },
 *   graphData
 * );
 * suggestions.forEach(suggestion => {
 *   console.log(`Field: ${suggestion.fieldPath}`);
 *   suggestion.suggestions.forEach(s => console.log(`  - ${s.value}`));
 * });
 * ```
 */
export function generateMockSuggestions(conceptState: Partial<CSSVector>, cnmData: GraphData): { fieldPath: string, suggestions: { value: string; node?: NodeObject; explanation: string; action?: any }[] }[] {
  if (!cnmData || !cnmData.nodes || cnmData.nodes.length === 0) {
    console.warn("generateMockSuggestions: Missing or empty graph data");
    return [];
  }
  
  const suggestions: { fieldPath: string, suggestions: { value: string; node?: NodeObject; explanation: string; action?: any }[] }[] = [];
  const currentCSS = conceptState || {};
  const nodes = cnmData.nodes;

  /**
   * Helper function to find nodes matching a condition
   * @param condition - Predicate function to test nodes
   * @returns First matching node or undefined
   */
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

/**
 * Generates a mock experimental protocol based on concept design state
 * 
 * @param conceptState - Partial CSS vector describing the concept
 * @returns Formatted protocol string in markdown format
 * 
 * @description Creates a structured experimental protocol that includes
 * setup procedures, measurement protocols, and analysis steps based on
 * the components and configuration specified in the concept state.
 * 
 * @example
 * ```typescript
 * const concept = {
 *   context: { material_primary: ['graphene'], energy_source_primary: 'electrical' },
 *   dynamics: { computational_power: '100 TOPS/W' }
 * };
 * const protocol = generateMockProtocol(concept);
 * console.log(protocol);
 * ```
 */
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