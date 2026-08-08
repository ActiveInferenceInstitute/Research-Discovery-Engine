// src/components/ContextPanel/ContextPanel.tsx
import React from 'react';
import { NodeObject, GraphData, ConceptDesignState, LinkObject as CNMLinkObject, NodeType } from '../../types';
import NodeView from '../NodeView/NodeView';
import ConceptDetails from './ConceptDetails';
// Corrected: Added X as CloseIcon
import { X as CloseIcon, Link2, Lightbulb, Network, Brain, Zap, FlaskConical, Activity, Target, HelpCircle, Layers, BookOpen } from 'lucide-react';

interface ContextPanelProps {
  darkMode: boolean;
  activeMode: 'explore' | 'create';
  selectedNodeId: string | null;
  conceptDesignState: ConceptDesignState;
  graphData: GraphData;
  onSelectNode: (node: NodeObject | null, sectionSlug?: string) => void;
  onStartDesign: (seedNodeId: string) => void;
  onTriggerAgent: (action: string, payload?: any) => void;
  onNavigateToWikiSection: (fileKey: string, sectionSlug: string) => void; // Renamed in App.tsx to handleNavigateFromNodeView
}

const ContextPanel: React.FC<ContextPanelProps> = ({
  darkMode, activeMode, selectedNodeId,
  conceptDesignState, graphData, onSelectNode, onStartDesign,
  onTriggerAgent, onNavigateToWikiSection
}) => {
    const selectedNode = graphData.nodes.find(n => n.id === selectedNodeId) || null;

    const selectedNodeLinks = selectedNode ? graphData.links.filter(link =>
        (typeof link.source === 'object' ? (link.source as NodeObject).id : String(link.source)) === selectedNode.id ||
        (typeof link.target === 'object' ? (link.target as NodeObject).id : String(link.target)) === selectedNode.id
    ) : [];
    
  return (
    <div
      className={`rounded-lg shadow-lg flex flex-col ${
        darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'
      } overflow-hidden h-full`}
    >
      <div className={`p-3 sm:p-4 flex items-center justify-between border-b ${darkMode ? 'border-slate-700' : 'border-slate-600'} flex-shrink-0`}>
        <h3 className="font-semibold text-md sm:text-lg truncate">
            {activeMode === 'create' ? 'Concept Design Workspace' :
             selectedNode ? "Selected Node Details"
                          : "Context Panel"}
        </h3>
        {/* Show close button if a node is selected (in explore or create mode) OR if in create mode without a node selected (to go back to explore) */}
        {(selectedNodeId || activeMode === 'create') && (
             <button 
                onClick={() => {
                    if (activeMode === 'create' && !selectedNodeId) { // If in create mode and no node is selected, this implies wanting to exit create mode
                        onTriggerAgent('set-explore-mode', {}); // App.tsx needs to handle this to set activeMode='explore'
                    } else {
                        onSelectNode(null); // Deselect node
                    }
                }} 
                className={`p-1 rounded-full ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`} 
                title={activeMode === 'create' && !selectedNodeId ? "Back to Explore" : "Close Details"}
            > 
                <CloseIcon size={18} /> 
            </button>
        )}
      </div>

       <div className="flex-grow overflow-y-auto">
            {activeMode === 'create' ? (
                <ConceptDetails darkMode={darkMode} designState={conceptDesignState} onTriggerAgent={onTriggerAgent} />
            ) : selectedNode ? (
                <NodeView
                    darkMode={darkMode}
                    node={selectedNode}
                    allNodes={graphData.nodes}
                    relatedLinks={selectedNodeLinks}
                    onSelectNode={onSelectNode}
                    onStartDesign={onStartDesign}
                    onTriggerAgent={onTriggerAgent}
                    onNavigateToWikiSection={onNavigateToWikiSection}
                    onPaperClick={(pubKey: string) => onTriggerAgent('open-publication', { key: pubKey })}
                />
            ) : ( <div className="p-6 text-slate-500 dark:text-slate-400 italic flex items-center justify-center text-center h-full"><span>Select an item from the Browser or Graph to see details.</span></div> )}
       </div>
    </div>
  );
};


const getTerminologyForNode = (node: NodeObject): Term[] => {
  if (!node.description) return [];
  return TerminologyService.getHighlightableTerms(node.description);
};
export default ContextPanel;