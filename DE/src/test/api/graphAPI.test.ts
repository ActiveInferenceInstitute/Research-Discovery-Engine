import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiClient, APIError } from '../../api/graphAPI';
import { GraphData, NodeObject } from '../../types';

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock
    global.fetch = vi.fn();
  });

  describe('getGraphData', () => {
    it('should fetch graph data successfully', async () => {
      const mockGraphData: GraphData = {
        nodes: [
          { id: 'test1', type: 'Material', label: 'Test Material' },
          { id: 'test2', type: 'Mechanism', label: 'Test Mechanism' }
        ],
        links: [
          { source: 'test1', target: 'test2', type: 'concept-uses-component' }
        ]
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockGraphData,
          timestamp: new Date().toISOString()
        })
      });

      const result = await apiClient.getGraphData();
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/graph',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
      expect(result).toEqual(mockGraphData);
    });

    it('should handle API errors gracefully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          error: 'Internal server error',
          timestamp: new Date().toISOString()
        })
      });

      await expect(apiClient.getGraphData()).rejects.toThrow(APIError);
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(apiClient.getGraphData()).rejects.toThrow('Network error occurred');
    });

    it('should return empty graph data when API returns no data', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: null,
          timestamp: new Date().toISOString()
        })
      });

      const result = await apiClient.getGraphData();
      expect(result).toEqual({ nodes: [], links: [] });
    });
  });

  describe('searchNodes', () => {
    it('should search nodes with query', async () => {
      const mockNodes: NodeObject[] = [
        { id: 'material1', type: 'Material', label: 'Polymer Material' }
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockNodes,
          timestamp: new Date().toISOString()
        })
      });

      const result = await apiClient.searchNodes('polymer');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/graph/search?q=polymer',
        expect.any(Object)
      );
      expect(result).toEqual(mockNodes);
    });

    it('should search nodes with filters', async () => {
      const mockNodes: NodeObject[] = [
        { id: 'material1', type: 'Material', label: 'Polymer Material' }
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockNodes,
          timestamp: new Date().toISOString()
        })
      });

      const filters = {
        type: ['Material', 'Mechanism'],
        dateRange: ['2023-01-01', '2023-12-31'] as [string, string]
      };

      const result = await apiClient.searchNodes('polymer', filters);
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/graph/search?q=polymer&types=Material%2CMechanism&dateFrom=2023-01-01&dateTo=2023-12-31',
        expect.any(Object)
      );
      expect(result).toEqual(mockNodes);
    });
  });

  describe('uploadDocument', () => {
    it('should upload document successfully', async () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            documentId: 'doc123',
            status: 'processing'
          },
          timestamp: new Date().toISOString()
        })
      });

      const result = await apiClient.uploadDocument(mockFile, 'template1');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/documents/upload',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      );
      expect(result.documentId).toBe('doc123');
      expect(result.status).toBe('processing');
    });
  });

  describe('triggerAgent', () => {
    it('should trigger agent action successfully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            agentId: 'agent123',
            status: 'started',
            result: null
          },
          timestamp: new Date().toISOString()
        })
      });

      const result = await apiClient.triggerAgent('suggest-components', { nodeId: 'test' });
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/agents/trigger',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            action: 'suggest-components',
            payload: { nodeId: 'test' }
          })
        })
      );
      expect(result.agentId).toBe('agent123');
      expect(result.status).toBe('started');
    });
  });

  describe('validateConceptDesign', () => {
    it('should validate concept design', async () => {
      const mockDesign = {
        id: 'concept1',
        objective: 'Test concept',
        status: 'Hypothetical' as const,
        components: {
          materials: ['material1'],
          mechanisms: ['mechanism1'],
          methods: [],
          theoretical_concepts: []
        },
        cssVectorDraft: { meta: { id: 'concept1', analysis_date: new Date().toISOString() } },
        fieldSuggestions: {}
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            isValid: true,
            issues: [],
            suggestions: [
              {
                type: 'component',
                suggestion: { id: 'material2', type: 'Material' },
                confidence: 0.8
              }
            ]
          },
          timestamp: new Date().toISOString()
        })
      });

      const result = await apiClient.validateConceptDesign(mockDesign);
      
      expect(result.isValid).toBe(true);
      expect(result.suggestions?.length).toBe(1);
      expect(result.suggestions?.[0].confidence).toBe(0.8);
    });
  });

  describe('detectKnowledgeGaps', () => {
    it('should detect knowledge gaps', async () => {
      const mockGaps = [
        {
          id: 'gap1',
          type: 'missing_link' as const,
          description: 'Missing connection between materials and mechanisms',
          priority: 0.8,
          relatedNodes: ['node1', 'node2']
        }
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockGaps,
          timestamp: new Date().toISOString()
        })
      });

      const result = await apiClient.detectKnowledgeGaps('materials');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/analysis/gaps?domain=materials',
        expect.any(Object)
      );
      expect(result).toEqual(mockGaps);
    });
  });

  describe('semanticSearch', () => {
    it('should perform semantic search', async () => {
      const mockResults = [
        {
          node: { id: 'node1', type: 'Material', label: 'Relevant Material' },
          relevance: 0.95,
          excerpt: 'This material shows relevant properties...'
        }
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockResults,
          timestamp: new Date().toISOString()
        })
      });

      const result = await apiClient.semanticSearch('smart materials with memory', 10);
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/search/semantic',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            query: 'smart materials with memory',
            limit: 10
          })
        })
      );
      expect(result).toEqual(mockResults);
    });
  });
}); 