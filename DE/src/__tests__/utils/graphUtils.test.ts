/**
 * @fileoverview Test suite for graph utility functions
 * 
 * Tests cover neighbor finding, filtering, mock generation, and edge cases
 * for all graph manipulation utilities used throughout the application.
 */

import { getNeighbors, filterGraphData, generateMockSuggestions, generateMockProtocol } from '../../utils/graphUtils';
import { GraphData, NodeObject, LinkObject } from '../../types';
import type { CSSVector } from '../../types/css';

describe('Graph Utilities', () => {
  // Test data fixtures
  const mockNodes: NodeObject[] = [
    {
      id: 'graphene',
      type: 'Material',
      label: 'Graphene',
      description: 'Single layer of carbon atoms arranged in a hexagonal lattice'
    },
    {
      id: 'carbon-nanotubes',
      type: 'Material', 
      label: 'Carbon Nanotubes',
      description: 'Cylindrical carbon structures with extraordinary properties'
    },
    {
      id: 'neural-networks',
      type: 'Mechanism',
      label: 'Neural Networks',
      description: 'Computational model inspired by biological neural networks'
    },
    {
      id: 'machine-learning',
      type: 'Mechanism',
      label: 'Machine Learning',
      description: 'Algorithms that improve through experience'
    }
  ];

  const mockLinks: LinkObject[] = [
    {
      source: 'graphene',
      target: 'carbon-nanotubes', 
      type: 'related-to',
      justification: 'Both are carbon-based nanomaterials'
    },
    {
      source: 'neural-networks',
      target: 'machine-learning',
      type: 'related-to',
      justification: 'Neural networks are a type of machine learning'
    },
    {
      source: 'graphene',
      target: 'neural-networks',
      type: 'EnablesMechanismEdge',
      justification: 'Graphene can be used in neural network hardware'
    }
  ];

  const mockGraphData: GraphData = {
    nodes: mockNodes,
    links: mockLinks
  };

  describe('getNeighbors', () => {
    it('should find direct neighbors at depth 1', () => {
      const { nodes, links } = getNeighbors(mockGraphData, 'graphene', 1);
      
      expect(nodes.size).toBe(3); // graphene + 2 neighbors
      expect(links.size).toBe(2); // 2 connecting links
      
      const nodeIds = Array.from(nodes).map(n => n.id);
      expect(nodeIds).toContain('graphene');
      expect(nodeIds).toContain('carbon-nanotubes');
      expect(nodeIds).toContain('neural-networks');
    });

    it('should find neighbors at depth 2', () => {
      const { nodes, links } = getNeighbors(mockGraphData, 'graphene', 2);
      
      expect(nodes.size).toBe(4); // All nodes should be reachable
      expect(links.size).toBe(3); // All links should be included
    });

    it('should handle non-existent node gracefully', () => {
      const { nodes, links } = getNeighbors(mockGraphData, 'non-existent', 1);
      
      expect(nodes.size).toBe(0);
      expect(links.size).toBe(0);
    });

    it('should handle empty graph data', () => {
      const emptyGraph: GraphData = { nodes: [], links: [] };
      const { nodes, links } = getNeighbors(emptyGraph, 'any-node', 1);
      
      expect(nodes.size).toBe(0);
      expect(links.size).toBe(0);
    });

    it('should handle depth 0 correctly', () => {
      const { nodes, links } = getNeighbors(mockGraphData, 'graphene', 0);
      
      expect(nodes.size).toBe(1); // Only the starting node
      expect(links.size).toBe(0); // No links at depth 0
      
      const nodeArray = Array.from(nodes);
      expect(nodeArray[0].id).toBe('graphene');
    });

    it('should not include duplicate nodes at higher depths', () => {
      // Create a graph with cycles to test deduplication
      const cyclicLinks: LinkObject[] = [
        ...mockLinks,
        {
          source: 'machine-learning',
          target: 'graphene',
          type: 'related-to',
          justification: 'ML can help design materials'
        }
      ];
      
      const cyclicGraph: GraphData = {
        nodes: mockNodes,
        links: cyclicLinks
      };
      
      const { nodes } = getNeighbors(cyclicGraph, 'graphene', 3);
      
      // Should still have only 4 unique nodes despite the cycle
      expect(nodes.size).toBe(4);
    });
  });

  describe('filterGraphData', () => {
    it('should return full graph when search query is empty', () => {
      const filtered = filterGraphData(mockGraphData, '');
      
      expect(filtered.nodes).toHaveLength(mockNodes.length);
      expect(filtered.links).toHaveLength(mockLinks.length);
    });

    it('should filter nodes by ID match', () => {
      const filtered = filterGraphData(mockGraphData, 'graphene');
      
      expect(filtered.nodes.some(n => n.id === 'graphene')).toBe(true);
      expect(filtered.nodes.some(n => n.id === 'carbon-nanotubes')).toBe(true); // Should include neighbors
    });

    it('should filter nodes by label match', () => {
      const filtered = filterGraphData(mockGraphData, 'Neural');
      
      expect(filtered.nodes.some(n => n.id === 'neural-networks')).toBe(true);
      expect(filtered.nodes.some(n => n.id === 'machine-learning')).toBe(true); // Should include neighbors
    });

    it('should filter nodes by description match', () => {
      const filtered = filterGraphData(mockGraphData, 'carbon atoms');
      
      expect(filtered.nodes.some(n => n.id === 'graphene')).toBe(true);
    });

    it('should be case insensitive', () => {
      const filtered = filterGraphData(mockGraphData, 'GRAPHENE');
      
      expect(filtered.nodes.some(n => n.id === 'graphene')).toBe(true);
    });

    it('should only include links between filtered nodes', () => {
      const filtered = filterGraphData(mockGraphData, 'machine-learning');
      
      // Should include neural-networks as neighbor
      const nodeIds = filtered.nodes.map(n => n.id);
      expect(nodeIds).toContain('machine-learning');
      expect(nodeIds).toContain('neural-networks');
      
      // Should only include the link between these nodes
      expect(filtered.links).toHaveLength(1);
      expect(filtered.links[0].source).toBe('neural-networks');
      expect(filtered.links[0].target).toBe('machine-learning');
    });

    it('should handle missing graph data gracefully', () => {
      const emptyGraph: GraphData = { nodes: [], links: [] };
      const filtered = filterGraphData(emptyGraph, 'test');
      
      expect(filtered.nodes).toHaveLength(0);
      expect(filtered.links).toHaveLength(0);
    });

    it('should handle whitespace-only queries', () => {
      const filtered = filterGraphData(mockGraphData, '   ');
      
      expect(filtered.nodes).toHaveLength(mockNodes.length);
      expect(filtered.links).toHaveLength(mockLinks.length);
    });
  });

  describe('generateMockSuggestions', () => {
    const mockConceptState: Partial<CSSVector> = {
      context: {
        material_primary: ['graphene']
      },
      dynamics: {
        mechanism_primary: ['neural-networks']
      }
    };

    it('should generate material suggestions when materials are present', () => {
      const suggestions = generateMockSuggestions(mockConceptState, mockGraphData);
      
      expect(suggestions).toBeInstanceOf(Array);
      expect(suggestions.length).toBeGreaterThan(0);
      
      // Should have suggestions for various field paths
      const fieldPaths = suggestions.map(s => s.fieldPath);
      expect(fieldPaths.some(path => path.includes('material'))).toBe(true);
    });

    it('should suggest mechanisms when none are selected', () => {
      const conceptWithoutMechanisms: Partial<CSSVector> = {
        context: {
          material_primary: ['graphene']
        }
      };
      
      const suggestions = generateMockSuggestions(conceptWithoutMechanisms, mockGraphData);
      
      const mechanismSuggestions = suggestions.find(s => 
        s.fieldPath.includes('mechanism')
      );
      
      expect(mechanismSuggestions).toBeDefined();
      if (mechanismSuggestions) {
        expect(mechanismSuggestions.suggestions.length).toBeGreaterThan(0);
        expect(mechanismSuggestions.suggestions[0]).toHaveProperty('value');
        expect(mechanismSuggestions.suggestions[0]).toHaveProperty('explanation');
      }
    });

    it('should handle empty concept state', () => {
      const suggestions = generateMockSuggestions({}, mockGraphData);
      
      expect(suggestions).toBeInstanceOf(Array);
      // Should still generate some basic suggestions
    });

    it('should handle empty graph data', () => {
      const emptyGraph: GraphData = { nodes: [], links: [] };
      const suggestions = generateMockSuggestions(mockConceptState, emptyGraph);
      
      expect(suggestions).toHaveLength(0);
    });

    it('should include action objects in suggestions', () => {
      const suggestions = generateMockSuggestions(mockConceptState, mockGraphData);
      
      if (suggestions.length > 0) {
        const firstSuggestion = suggestions[0];
        if (firstSuggestion.suggestions.length > 0) {
          const suggestion = firstSuggestion.suggestions[0];
          expect(suggestion).toHaveProperty('action');
          
          if (suggestion.action) {
            expect(suggestion.action).toHaveProperty('type');
          }
        }
      }
    });

    it('should provide explanations for all suggestions', () => {
      const suggestions = generateMockSuggestions(mockConceptState, mockGraphData);
      
      suggestions.forEach(suggestionGroup => {
        suggestionGroup.suggestions.forEach(suggestion => {
          expect(suggestion.explanation).toBeDefined();
          expect(typeof suggestion.explanation).toBe('string');
          expect(suggestion.explanation.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('generateMockProtocol', () => {
    const mockConceptState: Partial<CSSVector> = {
      context: {
        material_primary: ['graphene'],
        energy_source_primary: 'electrical'
      },
      dynamics: {
        computational_power: '100 TOPS/W',
        mechanism_primary: ['neural-networks']
      }
    };

    it('should generate a comprehensive protocol', () => {
      const protocol = generateMockProtocol(mockConceptState);
      
      expect(typeof protocol).toBe('string');
      expect(protocol.length).toBeGreaterThan(100);
      
      // Should include key sections
      expect(protocol).toMatch(/# Experimental Protocol/);
      expect(protocol).toMatch(/## 1\. System Fabrication/);
      expect(protocol).toMatch(/## 2\. Experimental Procedures/);
      expect(protocol).toMatch(/## 3\. Data Collection/);
    });

    it('should incorporate concept materials in protocol', () => {
      const protocol = generateMockProtocol(mockConceptState);
      
      expect(protocol).toContain('graphene');
    });

    it('should incorporate energy source in protocol', () => {
      const protocol = generateMockProtocol(mockConceptState);
      
      expect(protocol).toContain('electrical');
    });

    it('should incorporate computational metrics', () => {
      const protocol = generateMockProtocol(mockConceptState);
      
      expect(protocol).toContain('100 TOPS/W');
    });

    it('should handle empty concept state gracefully', () => {
      const protocol = generateMockProtocol({});
      
      expect(typeof protocol).toBe('string');
      expect(protocol.length).toBeGreaterThan(0);
      
      // Should still generate a valid protocol structure
      expect(protocol).toMatch(/# Experimental Protocol/);
    });

    it('should include safety considerations', () => {
      const protocol = generateMockProtocol(mockConceptState);
      
      expect(protocol).toMatch(/Safety/i);
    });

    it('should include analysis procedures', () => {
      const protocol = generateMockProtocol(mockConceptState);
      
      expect(protocol).toMatch(/Analysis/i);
      expect(protocol).toMatch(/statistical/i);
    });

    it('should be formatted as markdown', () => {
      const protocol = generateMockProtocol(mockConceptState);
      
      // Should have markdown headers
      expect(protocol).toMatch(/^#/m);
      expect(protocol).toMatch(/^##/m);
      expect(protocol).toMatch(/^###/m);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed graph data', () => {
      const malformedGraph: any = {
        nodes: [{ id: 'test' }], // Missing required fields
        links: [{ source: 'test' }] // Missing target
      };
      
      expect(() => getNeighbors(malformedGraph, 'test', 1)).not.toThrow();
      expect(() => filterGraphData(malformedGraph, 'test')).not.toThrow();
    });

    it('should handle null/undefined inputs gracefully', () => {
      expect(() => getNeighbors(null as any, 'test', 1)).not.toThrow();
      expect(() => filterGraphData(undefined as any, 'test')).not.toThrow();
      expect(() => generateMockSuggestions(null as any, mockGraphData)).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should handle large graphs efficiently', () => {
      // Create a large graph for performance testing
      const largeNodes: NodeObject[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `node-${i}`,
        type: 'Material',
        label: `Node ${i}`
      }));

      const largeLinks: LinkObject[] = Array.from({ length: 2000 }, (_, i) => ({
        source: `node-${i % 500}`,
        target: `node-${(i + 1) % 500}`,
        type: 'related-to'
      }));

      const largeGraph: GraphData = {
        nodes: largeNodes,
        links: largeLinks
      };

      const startTime = performance.now();
      const { nodes } = getNeighbors(largeGraph, 'node-0', 2);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
      expect(nodes.size).toBeGreaterThan(0);
    });
  });
}); 