import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { AgentService } from '../api/agentService';
import { settingsStore } from '../store/settingsStore';
import { AgentMessage } from '../types';
import { AgentOperationType, AgentError } from '../types/api.types';

interface AgentContextType {
  messages: AgentMessage[];
  isProcessing: boolean;
  error: AgentError | null;
  currentOperation: AgentOperationType | null;
  executeOperation: (operationType: AgentOperationType, params: any) => Promise<void>;
  cancelOperation: () => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
};

interface AgentProviderProps {
  children: React.ReactNode;
}

export const AgentProvider: React.FC<AgentProviderProps> = ({
  children
}) => {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<AgentError | null>(null);
  const [currentOperation, setCurrentOperation] = useState<AgentOperationType | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const addMessage = useCallback((message: AgentMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const cancelOperation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsProcessing(false);
      setCurrentOperation(null);
      addMessage({
        id: Date.now().toString(),
        type: 'info',
        sourceAgent: 'System',
        content: 'Process stopped',
        timestamp: Date.now(),
        relatedNodeIds: []
      });
    }
  }, [addMessage]);

  const executeOperation = useCallback(async (operationType: AgentOperationType, params: any) => {
    // Prevent multiple operations from running simultaneously
    if (isProcessing) {
      addMessage({
        id: Date.now().toString(),
        type: 'warning',
        sourceAgent: 'System',
        content: `Operation ${currentOperation} is already in progress. Please wait for it to complete.`,
        timestamp: Date.now(),
        relatedNodeIds: []
      });
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCurrentOperation(operationType);
    abortControllerRef.current = new AbortController();

    try {
      const agentService = new AgentService(settingsStore.getApiKey() || '', addMessage);
      await agentService.executeOperation(operationType, {
        ...params,
        signal: abortControllerRef.current.signal
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Operation was cancelled, no need to show error
        return;
      }
      setError(error instanceof Error ? error : new Error('An unknown error occurred'));
      addMessage({
        id: Date.now().toString(),
        type: 'error',
        sourceAgent: 'System',
        content: error instanceof Error ? error.message : 'An unknown error occurred',
        timestamp: Date.now(),
        relatedNodeIds: []
      });
    } finally {
      setIsProcessing(false);
      setCurrentOperation(null);
      abortControllerRef.current = null;
    }
  }, [isProcessing, currentOperation, addMessage]);

  const value = {
    messages,
    isProcessing,
    error,
    currentOperation,
    executeOperation,
    cancelOperation
  };

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
}; 