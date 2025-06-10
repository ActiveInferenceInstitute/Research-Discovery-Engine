// src/hooks/useAgentInteraction.ts
/**
 * @fileoverview Custom React Hook for AI Agent Interaction Management
 * 
 * This hook manages real-time communication with AI agents for concept design
 * assistance, field suggestions, protocol generation, and other AI-powered
 * features. It handles message streaming, state management, and error recovery.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { AgentMessage, ConceptDesignState, NodeObject } from '../types';

/**
 * Available agent types for specialized assistance
 * 
 * @description Each agent type provides domain-specific expertise:
 * - MaterialAgent: Material science and properties expertise
 * - MechanismAgent: Physical mechanism and process knowledge
 * - ProtocolAgent: Experimental protocol design and validation
 * - AnalysisAgent: Data analysis and interpretation assistance
 */
type AgentType = 'MaterialAgent' | 'MechanismAgent' | 'ProtocolAgent' | 'AnalysisAgent';

/**
 * Custom hook for managing AI agent interactions and message streaming
 * 
 * @returns Object containing agent communication state and control functions
 * 
 * @description This hook provides a complete interface for interacting with
 * AI agents throughout the concept design workflow. It manages message history,
 * handles streaming responses, provides error recovery, and maintains separate
 * conversation contexts for different agent types.
 * 
 * @example
 * ```typescript
 * function ConceptDesigner() {
 *   const {
 *     messages,
 *     isStreaming,
 *     sendMessage,
 *     requestFieldSuggestions,
 *     generateProtocol,
 *     clearMessages
 *   } = useAgentInteraction();
 *   
 *   const handleGetSuggestions = async () => {
 *     await requestFieldSuggestions(
 *       'context.material_primary',
 *       conceptState,
 *       'MaterialAgent'
 *     );
 *   };
 *   
 *   return (
 *     <div>
 *       {messages.map(msg => (
 *         <div key={msg.id}>{msg.content}</div>
 *       ))}
 *       {isStreaming && <div>Agent is thinking...</div>}
 *     </div>
 *   );
 * }
 * ```
 */
export const useAgentInteraction = () => {
  /** All messages in the current conversation */
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  
  /** Whether an agent is currently generating a response */
  const [isStreaming, setIsStreaming] = useState(false);
  
  /** Last error that occurred during agent communication */
  const [lastError, setLastError] = useState<string | null>(null);
  
  /** Reference to current abort controller for canceling requests */
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Cleanup function to cancel ongoing requests
   * 
   * @description Cancels any active agent requests when component unmounts
   * or when starting a new request to prevent race conditions.
   */
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Sends a direct message to an AI agent and streams the response
   * 
   * @param content - Message content to send to the agent
   * @param agentType - Type of agent to communicate with
   * @param context - Optional context object for the conversation
   * @returns Promise that resolves when the message is complete
   * 
   * @description Initiates a conversation with the specified agent type.
   * The response is streamed back in real-time and added to the message
   * history. Includes automatic error handling and retry logic.
   * 
   * @example
   * ```typescript
   * // Ask the material agent about graphene properties
   * await sendMessage(
   *   'What are the key properties of graphene for neural networks?',
   *   'MaterialAgent',
   *   { currentMaterials: ['graphene'] }
   * );
   * 
   * // Request protocol guidance
   * await sendMessage(
   *   'How should I measure computational capacity?',
   *   'ProtocolAgent',
   *   { targetMetrics: ['TOPS/W', 'latency'] }
   * );
   * ```
   */
  const sendMessage = useCallback(async (
    content: string,
    agentType: AgentType,
    context?: any
  ): Promise<void> => {
    if (isStreaming) {
      console.warn('Agent is already streaming, cannot send new message');
      return;
    }

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

         const userMessage: AgentMessage = {
       id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
       sourceAgent: 'User',
       content,
       timestamp: Date.now(),
       type: 'user_query'
     };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);
    setLastError(null);

    try {
      // Create placeholder for agent response
             const agentMessage: AgentMessage = {
         id: `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
         sourceAgent: agentType,
         content: '',
         timestamp: Date.now(),
         type: 'info'
       };

      setMessages(prev => [...prev, agentMessage]);

      // Simulate streaming response (replace with actual API call)
      const fullResponse = `This is a simulated ${agentType} response to: "${content}". In a real implementation, this would be streamed from the backend AI service.`;
      
      // Simulate character-by-character streaming
      for (let i = 0; i <= fullResponse.length; i++) {
        if (abortController.signal.aborted) {
          throw new Error('Request was cancelled');
        }

        await new Promise(resolve => setTimeout(resolve, 20)); // Simulate network delay
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === agentMessage.id 
              ? { ...msg, content: fullResponse.substring(0, i) }
              : msg
          )
        );
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setLastError(errorMessage);
      
      if (!abortController.signal.aborted) {
        // Add error message to conversation
        const errorMsg: AgentMessage = {
          id: `err_${Date.now()}`,
          sourceAgent: agentType,
          content: `Error: ${errorMessage}`,
          timestamp: Date.now(),
          type: 'error'
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [isStreaming]);

  /**
   * Requests AI suggestions for a specific concept design field
   * 
   * @param fieldPath - Dot-notation path to the field needing suggestions
   * @param conceptState - Current concept design state for context
   * @param agentType - Type of agent to request suggestions from
   * @returns Promise resolving to array of suggestion messages
   * 
   * @description Asks an AI agent to provide targeted suggestions for improving
   * a specific aspect of the concept design. The agent analyzes the current
   * state and provides contextual recommendations with explanations.
   * 
   * @example
   * ```typescript
   * // Get material suggestions
   * const suggestions = await requestFieldSuggestions(
   *   'context.material_primary',
   *   currentConcept,
   *   'MaterialAgent'
   * );
   * 
   * // Get mechanism suggestions based on selected materials
   * const mechSuggestions = await requestFieldSuggestions(
   *   'dynamics.mechanism_primary',
   *   currentConcept,
   *   'MechanismAgent'
   * );
   * ```
   */
  const requestFieldSuggestions = useCallback(async (
    fieldPath: string,
    conceptState: ConceptDesignState,
    agentType: AgentType
  ): Promise<AgentMessage[]> => {
    const requestContent = `Please provide suggestions for the field "${fieldPath}" based on the current concept design state.`;
    
    await sendMessage(requestContent, agentType, {
      fieldPath,
      conceptState,
      requestType: 'field_suggestions'
    });

    // In a real implementation, this would return parsed suggestions
    return [];
  }, [sendMessage]);

  /**
   * Requests generation of an experimental protocol from an agent
   * 
   * @param conceptState - Current concept design state
   * @param requirements - Optional specific requirements for the protocol
   * @returns Promise resolving to the generated protocol content
   * 
   * @description Asks the ProtocolAgent to generate a comprehensive experimental
   * protocol based on the current concept design. The protocol includes setup
   * procedures, measurement methods, analysis steps, and safety considerations.
   * 
   * @example
   * ```typescript
   * // Generate basic protocol
   * const protocol = await generateProtocol(conceptState);
   * 
   * // Generate protocol with specific requirements
   * const customProtocol = await generateProtocol(conceptState, {
   *   focusAreas: ['energy efficiency', 'scalability'],
   *   constraints: ['budget < $10k', 'timeline < 6 months']
   * });
   * ```
   */
  const generateProtocol = useCallback(async (
    conceptState: ConceptDesignState,
    requirements?: {
      focusAreas?: string[];
      constraints?: string[];
      targetMetrics?: string[];
    }
  ): Promise<string> => {
    const requestContent = `Please generate a detailed experimental protocol for this concept design.`;
    
    await sendMessage(requestContent, 'ProtocolAgent', {
      conceptState,
      requirements,
      requestType: 'protocol_generation'
    });

    // In a real implementation, this would return the generated protocol
    return 'Generated protocol content would be returned here';
  }, [sendMessage]);

  /**
   * Cancels any ongoing agent communication
   * 
   * @description Immediately stops any active agent requests and clears
   * the streaming state. Useful for implementing cancel buttons or when
   * the user wants to interrupt a long-running agent response.
   * 
   * @example
   * ```typescript
   * // Cancel button handler
   * const handleCancel = () => {
   *   cancelRequest();
   *   console.log('Agent request cancelled');
   * };
   * ```
   */
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  }, []);

  /**
   * Clears all messages from the conversation history
   * 
   * @description Resets the message history to start a fresh conversation.
   * This is useful when switching between different concept designs or
   * when the user wants to start over with agent interactions.
   * 
   * @example
   * ```typescript
   * // Clear conversation when starting new concept
   * const handleNewConcept = () => {
   *   clearMessages();
   *   initializeConcept();
   * };
   * ```
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setLastError(null);
  }, []);

  /**
   * Retries the last failed agent request
   * 
   * @description Attempts to resend the last message that resulted in an error.
   * This is useful for handling temporary network issues or service interruptions.
   * 
   * @example
   * ```typescript
   * // Retry button in error UI
   * {lastError && (
   *   <button onClick={retryLastRequest}>
   *     Retry Last Request
   *   </button>
   * )}
   * ```
   */
  const retryLastRequest = useCallback(() => {
    if (messages.length === 0) return;
    
         // Find the last user message
     const lastUserMessage = [...messages].reverse().find(msg => msg.type === 'user_query');
     if (lastUserMessage && lastUserMessage.sourceAgent === 'User') {
       sendMessage(
         lastUserMessage.content,
         'MaterialAgent' // Default agent type for retry
       );
     }
  }, [messages, sendMessage]);

  return {
    /**
     * Array of all messages in the current conversation
     * Includes both user messages and agent responses
     */
    messages,
    
    /**
     * Whether an agent is currently generating a response
     * Use this to show loading indicators and disable input
     */
    isStreaming,
    
    /**
     * Last error message if agent communication failed
     * null if no recent errors occurred
     */
    lastError,
    
    /**
     * Function to send a message to an AI agent
     * Handles streaming responses and error management
     */
    sendMessage,
    
    /**
     * Function to request field-specific suggestions
     * Returns contextual recommendations for concept design
     */
    requestFieldSuggestions,
    
    /**
     * Function to generate experimental protocols
     * Creates comprehensive testing procedures for concepts
     */
    generateProtocol,
    
    /**
     * Function to cancel ongoing agent requests
     * Immediately stops any active communication
     */
    cancelRequest,
    
    /**
     * Function to clear all conversation messages
     * Resets the message history for fresh start
     */
    clearMessages,
    
    /**
     * Function to retry the last failed request
     * Useful for handling temporary errors
     */
    retryLastRequest
  };
};