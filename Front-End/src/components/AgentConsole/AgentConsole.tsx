// src/components/AgentConsole/AgentConsole.tsx

import React, { useState } from 'react';
// Corrected and ensured ALL icons used are imported from lucide-react
import { 
    ChevronsLeft, ChevronsRight, Brain, Network, FlaskConical, 
    Lightbulb, GitMerge, AlertTriangle, ChevronDown, ChevronUp, 
    Loader, MessageSquare, Layers 
} from 'lucide-react';
import AgentMessageStream from './AgentMessageStream'; // Correct import for AgentMessageStream
import { AgentMessage, GraphData, NodeObject, ConceptDesignState } from '../../types';
// Add terminology-aware message processing
import { TerminologyService } from '../../utils/terminology';

const enhanceMessageWithTerminology = (message: string): string => {
  const terms = TerminologyService.getHighlightableTerms(message);
  let enhancedMessage = message;
  
  terms.forEach(term => {
    const regex = new RegExp(`\\b${term.name}\\b`, 'gi');
    enhancedMessage = enhancedMessage.replace(regex, 
      `<span class="terminology-highlight" data-term="${term.id}">${term.name}</span>`
    );
  });
  
  return enhancedMessage;
};

interface AgentConsoleProps {
  darkMode: boolean;
  messages: AgentMessage[];
  cnmData: GraphData;
  activeMode: 'explore' | 'create';
  conceptDesignState: ConceptDesignState;
  selectedNodeId: string | null;
  onTriggerAgent: (action: string, payload?: any) => void;
  onSelectNode: (node: NodeObject) => void;
}

const AgentConsole: React.FC<AgentConsoleProps> = ({
  darkMode,
  messages = [], 
  cnmData = { nodes: [], links: [] }, 
  activeMode,
  conceptDesignState,
  selectedNodeId,
  onTriggerAgent,
  onSelectNode
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [commandsExpanded, setCommandsExpanded] = useState(true);

  const userFacingMessages = messages.filter(msg =>
    msg.type !== 'suggestion' || !msg.relatedFieldId
  );

  const safeNodes = cnmData?.nodes || [];
  const isGraphStillLoading = cnmData.nodes.length === 0 && messages.some(m => m.content.includes("Initializing"));

  return (
    <div
      className={`rounded-lg shadow-lg transition-all duration-300 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      } ${
        collapsed ? 'w-12' : 'w-full'
      } overflow-hidden h-full flex flex-col`}
    >
      <div className={`p-2 flex items-center justify-between border-b ${darkMode ? 'border-gray-700' : 'border-gray-600'} flex-shrink-0`}>
        <h3 className={`font-medium flex items-center ${collapsed ? 'hidden' : 'block'} text-sm`}>
          <Brain size={16} className="mr-1.5"/> Agent Console
        </h3>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          title={collapsed ? "Show Agent Console" : "Hide Agent Console"}
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
      </div>

      {!collapsed && (
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className={`p-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-600'} flex-shrink-0`}>
            <button
              className="w-full flex items-center justify-between text-xs font-medium mb-1.5"
              onClick={() => setCommandsExpanded(!commandsExpanded)}
            >
              <span>AGENT ACTIONS</span>
              {commandsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {commandsExpanded && (
              <div className="grid grid-cols-1 gap-1.5 text-xs">
                {activeMode === 'explore' ? (
                  <>
                    <button
                      className={`w-full text-left p-1.5 rounded-md flex items-center space-x-1.5 ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`}
                      onClick={() => onTriggerAgent('launch-exploratory-analysis', { scope: 'all', targetId: selectedNodeId || 'cnm-overview' })}
                      title={selectedNodeId ? `Explore around ${selectedNodeId}` : "Find knowledge gaps across the graph"}
                    >
                      <AlertTriangle size={14} /> <span>Explore/Find Gaps</span>
                    </button>
                    <button
                      className={`w-full text-left p-1.5 rounded-md flex items-center space-x-1.5 ${darkMode ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                      onClick={() => onTriggerAgent('initiate-new-concept-from-goal', { goalText: "Define a high-level research goal..." })}
                      title="Start designing a new concept based on a goal"
                    >
                      <Lightbulb size={14} /> <span>Start New Concept (Goal)</span>
                    </button>
                  </>
                ) : ( 
                  <>
                     <button
                      className={`w-full text-left p-1.5 rounded-md flex items-center space-x-1.5 ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`}
                      onClick={() => onTriggerAgent('suggest-compatible-components', { currentDesign: conceptDesignState })}
                      title="Suggest components compatible with current design"
                    >
                      <GitMerge size={14} /> <span>Suggest Components</span>
                    </button>
                    <button
                      className={`w-full text-left p-1.5 rounded-md flex items-center space-x-1.5 ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`}
                      onClick={() => onTriggerAgent('check-consistency', { designToValidate: conceptDesignState })}
                      title="Check the consistency of the current design"
                    >
                      <AlertTriangle size={14} /> <span>Check Consistency</span>
                    </button>
                    <button
                      className={`w-full text-left p-1.5 rounded-md flex items-center space-x-1.5 ${
                        !conceptDesignState.objective && conceptDesignState.components.materials.length === 0 && conceptDesignState.components.mechanisms.length === 0 ?
                        (darkMode ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-slate-300 text-slate-500 cursor-not-allowed') :
                        (darkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')
                      }`}
                      onClick={() => onTriggerAgent('generate-concept-summary', { conceptDesign: conceptDesignState })}
                      title="Generate a textual summary of the current concept"
                      disabled={!conceptDesignState.objective && conceptDesignState.components.materials.length === 0 && conceptDesignState.components.mechanisms.length === 0}
                    >
                      <Brain size={14} /> <span>Gen. Summary</span>
                    </button>
                    <button
                      className={`w-full text-left p-1.5 rounded-md flex items-center space-x-1.5 ${
                        (conceptDesignState.status !== 'Proposed' && conceptDesignState.status !== 'Validated') ?
                        (darkMode ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-slate-300 text-slate-500 cursor-not-allowed') :
                        (darkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white')
                      }`}
                      onClick={() => onTriggerAgent('generate-protocol-outline', { conceptDesign: conceptDesignState })}
                      title="Generate a validation protocol outline"
                      disabled={conceptDesignState.status !== 'Proposed' && conceptDesignState.status !== 'Validated'}
                    >
                      <FlaskConical size={14} /> <span>Gen. Protocol</span>
                    </button>
                    <button
                      className={`w-full text-left p-1.5 rounded-md flex items-center space-x-1.5 ${
                        (conceptDesignState.status !== 'Validated' || !conceptDesignState.protocolOutline) ?
                        (darkMode ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-slate-300 text-slate-500 cursor-not-allowed') :
                        (darkMode ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white')
                      }`}
                      onClick={() => onTriggerAgent('package-knowledge-artifact', { finalDesign: conceptDesignState })}
                      title="Package the design into a formal Knowledge Artifact"
                      disabled={conceptDesignState.status !== 'Validated' || !conceptDesignState.protocolOutline}
                    >
                      <Layers size={14} /> <span>Package Artifact</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {userFacingMessages.length > 0 ? (
            <AgentMessageStream
              darkMode={darkMode}
              messages={userFacingMessages}
              cnmNodes={safeNodes}
              onSelectNode={onSelectNode}
              onTriggerAgent={onTriggerAgent}
            />
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center p-6 space-y-3 text-center">
              {isGraphStillLoading ? (
                <Loader className="w-10 h-10 animate-spin text-blue-500" />
              ) : (
                <MessageSquare className={`w-10 h-10 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              )}
              <div className="space-y-1">
                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {isGraphStillLoading ? 'Loading Knowledge Graph...' : 'No Agent Messages Yet'}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {isGraphStillLoading
                    ? 'Please wait while the system initializes.'
                    : 'Interact with the graph or use Agent Actions to start.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentConsole;