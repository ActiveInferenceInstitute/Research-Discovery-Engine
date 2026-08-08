// src/components/ContextPanel/WikiNodeContextDisplay.tsx
import React from 'react';
import { NodeObject, LinkObject } from '../../types';
import { Link2, Brain, FlaskConical, Zap, FileText, Lightbulb, Network } from 'lucide-react'; // Adjusted icons

interface WikiNodeContextDisplayProps {
  node: NodeObject;
  relatedLinks: LinkObject[];
  allNodes: NodeObject[]; // For getNodeById
  darkMode: boolean;
  onSelectNode: (node: NodeObject | null) => void;
  onStartDesign?: (seedNodeId: string) => void;
  onTriggerAgent?: (action: string, payload?: any) => void;
}

const WikiNodeContextDisplay: React.FC<WikiNodeContextDisplayProps> = ({
    node, relatedLinks = [], allNodes, darkMode, 
    onSelectNode, onStartDesign, onTriggerAgent
}) => {
    
    const getNodeById = (id: string): NodeObject | undefined => allNodes.find(n => n.id === id);

    const groupedLinks: { [key: string]: { link: LinkObject, targetNode: NodeObject }[] } = {};
    relatedLinks.forEach(link => {
        const targetNodeId = typeof link.target === 'object' ? link.target.id : String(link.target);
        const sourceNodeId = typeof link.source === 'object' ? link.source.id : String(link.source);
        const otherNodeId = targetNodeId === node.id ? sourceNodeId : targetNodeId;
        const otherNode = getNodeById(otherNodeId);

        if (otherNode && otherNode.id !== node.id) {
            const linkType = link.type || 'related-to';
            if (!groupedLinks[linkType]) groupedLinks[linkType] = [];
            if (!groupedLinks[linkType].some(item => item.targetNode.id === otherNode.id)) {
                groupedLinks[linkType].push({ link: link, targetNode: otherNode });
            }
        }
    });
    const isDesignable = node.type && !node.type.includes('_Category') && !node.type.includes('_Class') && 
                         (node.type.startsWith('Material') || node.type.startsWith('Mechanism') || node.type.startsWith('Method'));


    return (
        <div className={`p-4 space-y-5 text-sm overflow-y-auto h-full ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <div>
                <h4 className="text-lg font-semibold mb-0.5 text-slate-800 dark:text-slate-100">{node.label || node.id}</h4>
                <p className={`text-xs font-mono ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>ID: {node.id}</p>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Type: {node.type}</p>
            </div>

            {Object.keys(groupedLinks).length > 0 && (
                <div>
                    <h5 className="text-md font-semibold mb-2 border-b pb-1 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        Graph Connections
                    </h5>
                    <div className="space-y-2.5">
                        {Object.entries(groupedLinks).map(([type, connections]) => (
                            <div key={type}>
                                <h6 className={`text-xs font-medium uppercase tracking-wider mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                    {type.replace(/-/g, ' ').replace(/_/g, ' ') + ':'}
                                </h6>
                                <div className="flex flex-wrap gap-1.5">
                                    {connections.map(({ targetNode }) => (
                                        <button
                                            key={targetNode.id + type}
                                            onClick={() => onSelectNode(targetNode)}
                                            className={`px-2 py-0.5 rounded-full text-xs flex items-center space-x-1 ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'} transition-colors`}
                                            title={targetNode.label || targetNode.id}
                                        >
                                          {/* Optional: Tiny icon based on targetNode.type */}
                                          <span>{targetNode.label || targetNode.id}</span>
                                          <Link2 size={10} className="opacity-60"/>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isDesignable && onStartDesign && onTriggerAgent && (
                <div className={`mt-4 pt-4 ${darkMode ? 'border-slate-700' : 'border-slate-300'} border-t`}>
                <h4 className="text-md font-semibold mb-3 text-slate-700 dark:text-slate-300">Node Actions</h4>
                <div className="grid grid-cols-1 gap-2 text-xs">
                    <button 
                    className={`w-full text-left p-2 rounded-md flex items-center space-x-2 ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`} 
                    onClick={() => onStartDesign(node.id)}
                    > <Lightbulb size={14} /> <span>Start New Concept</span> </button>
                    <button 
                    className={`w-full text-left p-2 rounded-md flex items-center space-x-2 ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`} 
                    onClick={() => onTriggerAgent('explore-neighbors', { nodeId: node.id })}
                    > <Network size={14} /> <span>Explore Neighbors</span> </button>
                </div>
                </div>
            )}

            {!Object.keys(groupedLinks).length && (!isDesignable || !onStartDesign) && (
                <p className="italic text-xs text-slate-500 dark:text-slate-400">
                    Main content for this wiki node is shown in the Wiki View. This panel shows its graph connections.
                </p>
            )}
        </div>
    );
};