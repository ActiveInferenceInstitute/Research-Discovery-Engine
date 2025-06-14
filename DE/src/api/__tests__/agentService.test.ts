import { AgentService } from '../agentService';
import { OpenRouterClient } from '../openRouter';
import { AgentOperationType } from '../../types/api.types';
import { AgentMessage } from '../../types';

// Mock OpenRouterClient
jest.mock('../openRouter', () => ({
  OpenRouterClient: jest.fn().mockImplementation(() => ({
    complete: jest.fn()
  }))
}));

describe('AgentService', () => {
  let agentService: AgentService;
  let mockOnMessage: jest.Mock;
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    mockOnMessage = jest.fn();
    agentService = new AgentService(mockApiKey, mockOnMessage);
    jest.clearAllMocks();
  });

  describe('Operation Execution', () => {
    it('should execute exploratory analysis operation', async () => {
      const mockComplete = (OpenRouterClient as jest.Mock).mock.results[0].value.complete;
      mockComplete.mockResolvedValueOnce(undefined);

      const params = {
        graphData: { nodes: [], links: [] },
        focusArea: 'test-area',
        depth: 'comprehensive'
      };

      await agentService.executeOperation('launch-exploratory-analysis', params);

      expect(mockComplete).toHaveBeenCalledWith(
        expect.stringContaining('scientific research analysis'),
        expect.any(Object)
      );
    });

    it('should execute new concept from goal operation', async () => {
      const mockComplete = (OpenRouterClient as jest.Mock).mock.results[0].value.complete;
      mockComplete.mockResolvedValueOnce(undefined);

      const params = {
        goal: 'test-goal',
        constraints: { test: 'constraint' },
        context: { test: 'context' }
      };

      await agentService.executeOperation('initiate-new-concept-from-goal', params);

      expect(mockComplete).toHaveBeenCalledWith(
        expect.stringContaining('scientific concept design'),
        expect.any(Object)
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle operation errors and retry', async () => {
      const mockComplete = (OpenRouterClient as jest.Mock).mock.results[0].value.complete;
      mockComplete
        .mockRejectedValueOnce(new Error('network error'))
        .mockResolvedValueOnce(undefined);

      const params = { test: 'params' };

      await agentService.executeOperation('launch-exploratory-analysis', params);

      expect(mockComplete).toHaveBeenCalledTimes(2);
      expect(mockOnMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          content: 'network error'
        })
      );
    });

    it('should handle max retries exceeded', async () => {
      const mockComplete = (OpenRouterClient as jest.Mock).mock.results[0].value.complete;
      mockComplete.mockRejectedValue(new Error('persistent error'));

      const params = { test: 'params' };

      await expect(
        agentService.executeOperation('launch-exploratory-analysis', params)
      ).rejects.toThrow();

      expect(mockComplete).toHaveBeenCalledTimes(3); // MAX_RETRIES + 1
    });
  });

  describe('Message Handling', () => {
    it('should process graph updates correctly', async () => {
      const mockComplete = (OpenRouterClient as jest.Mock).mock.results[0].value.complete;
      const mockGraphUpdate = {
        nodes: [
          {
            id: 'test-node',
            type: 'Material',
            label: 'Test Material'
          }
        ],
        edges: [
          {
            source: 'test-node',
            target: 'other-node',
            type: 'related-to'
          }
        ]
      };

      mockComplete.mockImplementation((prompt, handlers) => {
        handlers.onChunk(JSON.stringify(mockGraphUpdate));
        return Promise.resolve();
      });

      await agentService.executeOperation('launch-exploratory-analysis', {});

      expect(mockOnMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'info',
          content: expect.stringContaining('graph_update')
        })
      );
    });

    it('should handle non-JSON messages correctly', async () => {
      const mockComplete = (OpenRouterClient as jest.Mock).mock.results[0].value.complete;
      mockComplete.mockImplementation((prompt, handlers) => {
        handlers.onChunk('Regular message');
        return Promise.resolve();
      });

      await agentService.executeOperation('launch-exploratory-analysis', {});

      expect(mockOnMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'info',
          content: 'Regular message'
        })
      );
    });
  });

  describe('Operation Queue', () => {
    it('should process operations in queue order', async () => {
      const mockComplete = (OpenRouterClient as jest.Mock).mock.results[0].value.complete;
      mockComplete.mockResolvedValue(undefined);

      const operations = [
        { type: 'launch-exploratory-analysis' as AgentOperationType, params: { test: '1' } },
        { type: 'initiate-new-concept-from-goal' as AgentOperationType, params: { test: '2' } }
      ];

      await Promise.all(
        operations.map(op => agentService.executeOperation(op.type, op.params))
      );

      expect(mockComplete).toHaveBeenCalledTimes(2);
      expect(mockComplete.mock.calls[0][0]).toContain('scientific research analysis');
      expect(mockComplete.mock.calls[1][0]).toContain('scientific concept design');
    });

    it('should handle queue processing errors', async () => {
      const mockComplete = (OpenRouterClient as jest.Mock).mock.results[0].value.complete;
      mockComplete
        .mockRejectedValueOnce(new Error('queue error'))
        .mockResolvedValueOnce(undefined);

      const operations = [
        { type: 'launch-exploratory-analysis' as AgentOperationType, params: { test: '1' } },
        { type: 'initiate-new-concept-from-goal' as AgentOperationType, params: { test: '2' } }
      ];

      await Promise.all(
        operations.map(op => agentService.executeOperation(op.type, op.params))
      );

      expect(mockComplete).toHaveBeenCalledTimes(3); // 2 initial + 1 retry
      expect(mockOnMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          content: 'queue error'
        })
      );
    });
  });

  describe('Error Classification', () => {
    it('should classify timeout errors correctly', async () => {
      const mockComplete = (OpenRouterClient as jest.Mock).mock.results[0].value.complete;
      mockComplete.mockRejectedValue(new Error('timeout error'));

      await agentService.executeOperation('launch-exploratory-analysis', {});

      expect(mockOnMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          action: expect.objectContaining({
            payload: expect.objectContaining({
              error: expect.objectContaining({
                code: 'TIMEOUT',
                retryable: true
              })
            })
          })
        })
      );
    });

    it('should classify network errors correctly', async () => {
      const mockComplete = (OpenRouterClient as jest.Mock).mock.results[0].value.complete;
      mockComplete.mockRejectedValue(new Error('network error'));

      await agentService.executeOperation('launch-exploratory-analysis', {});

      expect(mockOnMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          action: expect.objectContaining({
            payload: expect.objectContaining({
              error: expect.objectContaining({
                code: 'NETWORK',
                retryable: true
              })
            })
          })
        })
      );
    });
  });
}); 