// src/components/AgentConsole/AgentMessageStream.tsx
// Displays a stream of messages from AI agents.

import React, { useEffect, useRef } from 'react';
import { AgentMessage, NodeObject } from '../../types';
import { Info, Sparkles, Lightbulb, AlertTriangle, Brain, MessageSquare, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { AgentOperationType } from '../../types/api.types';

interface AgentMessageStreamProps {
  darkMode: boolean;
  messages: AgentMessage[];
  cnmNodes: NodeObject[];
  onSelectNode?: (node: NodeObject) => void;
  onTriggerAgent?: (operationType: AgentOperationType, params: any) => Promise<void>;
}

const AgentMessageStream: React.FC<AgentMessageStreamProps> = ({
  darkMode,
  messages,
  cnmNodes,
  onSelectNode,
  onTriggerAgent
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Helper to safely get node by ID
  const getNodeById = (id: string): NodeObject | undefined => {
    if (!cnmNodes || cnmNodes.length === 0) {
      return undefined;
    }
    return cnmNodes.find(n => n.id === id);
  };

  const renderMessageIcon = (type: AgentMessage['type']) => {
    switch (type) {
      case 'info': return <Info size={16} className="text-blue-500" />;
      case 'opportunity': return <Sparkles size={16} className="text-yellow-500" />;
      case 'suggestion': return <Lightbulb size={16} className="text-green-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-orange-500" />;
      case 'error': return <AlertTriangle size={16} className="text-red-500" />;
      case 'command_confirmation': return <Brain size={16} className="text-purple-500" />;
      case 'user_query': return <MessageSquare size={16} className="text-blue-500" />;
      default: return <MessageSquare size={16} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />;
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center text-sm text-gray-500 italic p-4">
        <span>No messages yet. Interact with the system to see agent responses.</span>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto p-3 text-sm space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
        >
          <div className="flex items-center mb-1">
            {renderMessageIcon(msg.type)}
            <span className="font-semibold ml-2">{msg.sourceAgent}:</span>
            <span className={`ml-auto text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {format(new Date(msg.timestamp), 'HH:mm:ss')}
            </span>
          </div>
          <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>

          {/* Render related nodes */}
          {msg.relatedNodeIds && msg.relatedNodeIds.length > 0 && onSelectNode && (
            <div className="mt-2">
              <span className={`font-medium text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Related:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {msg.relatedNodeIds.map(nodeId => {
                  const relatedNode = getNodeById(nodeId);
                  return relatedNode ? (
                    <button
                      key={nodeId}
                      className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} flex items-center space-x-1`}
                      onClick={() => onSelectNode(relatedNode)}
                      title={`Select node: ${relatedNode.id}`}
                    >
                      <span>{relatedNode.label || relatedNode.id}</span>
                      <ExternalLink size={10}/>
                    </button>
                  ) : (
                    <span 
                      key={nodeId} 
                      className={`px-2 py-0.5 text-xs rounded-full italic ${darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-500'}`}
                    >
                      {nodeId}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Render action button */}
          {msg.action && onTriggerAgent && (
            <div className="mt-2 text-right">
              <button
                className={`px-3 py-1 rounded-md text-xs ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
                onClick={() => onTriggerAgent(msg.action!.type as AgentOperationType, msg.action!.payload)}
              >
                {msg.action.type === 'view-details' ? 'View Details' : 'Perform Action'}
              </button>
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default AgentMessageStream;