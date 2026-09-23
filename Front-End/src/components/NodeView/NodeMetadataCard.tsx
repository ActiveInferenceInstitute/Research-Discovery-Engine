// src/components/NodeView/NodeMetadataCard.tsx
import React from 'react';
import { NodeObject } from '../../types';
import { slugify } from '../../utils/markdownParser'; // If needed for creating links
import { Link2, BookOpen, FileText, ExternalLink } from 'lucide-react'; // Example icons

interface Item {
  text: string;
  link?: string; // Pre-formatted href from parseNodeData
  originalMatch?: string; // The original matched text, e.g. [[link]] or [citation]
}

interface NodeMetadataCardProps {
  title: string;
  items: Item[];
  icon: React.ReactNode;
  darkMode: boolean;
  allNodes: NodeObject[];
  onSelectNode: (node: NodeObject, sectionSlug?: string) => void;
  onNavigateToWikiSection: (fileKey: string, sectionSlug: string) => void;
  onPaperClick: (pubKey: string) => void;
}

const NodeMetadataCard: React.FC<NodeMetadataCardProps> = ({ 
    title, items, icon, darkMode, allNodes, 
    onSelectNode, onNavigateToWikiSection, onPaperClick 
}) => {
  if (!items || items.length === 0) return null;

  const getNodeById = (id: string) => allNodes.find(n => n.id === id);

  const renderItem = (item: Item, index: number) => {
    if (item.link) {
      if (item.link.startsWith('#CITATION__')) {
        const refKey = item.link.substring(11);
        return (
          <button key={index} onClick={() => onPaperClick(refKey)} title={`Open publication: ${refKey}.md`}
            className={`font-mono text-xs px-1.5 py-0.5 rounded-full mr-1.5 mb-1.5 inline-flex items-center group transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-teal-400 hover:text-teal-300' : 'bg-slate-200 hover:bg-slate-300 text-teal-700 hover:text-teal-600'}`}>
            <FileText size={11} className="mr-1 flex-shrink-0" /> {item.text} <ExternalLink size={11} className="ml-1 opacity-0 group-hover:opacity-100"/>
          </button>
        );
      } else if (item.link.startsWith('##wiki-nav::')) {
        const parts = item.link.substring('##wiki-nav::'.length).split('::');
        return (
          <button key={index} onClick={() => onNavigateToWikiSection(parts[0], parts[1])} title={`View wiki: ${parts[0]}${parts[1] ? '#'+parts[1] : ''}`}
            className={`text-xs px-1.5 py-0.5 rounded-full mr-1.5 mb-1.5 inline-flex items-center group transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-blue-400 hover:text-blue-300' : 'bg-slate-200 hover:bg-slate-300 text-blue-600 hover:text-blue-700'} hover:underline`}>
            <BookOpen size={11} className="mr-1 flex-shrink-0" /> {item.text}
          </button>
        );
      } else if (item.link.startsWith('#')) { // Could be #nodeId__sectionSlug or #nodeId or #localSlug
        const targetIdFull = item.link.substring(1);
        let targetNodeId = targetIdFull;
        let targetSectionSlug: string | undefined;
        if (targetIdFull.includes('__')) {
            const parts = targetIdFull.split('__');
            targetNodeId = parts[0];
            targetSectionSlug = parts[1];
        }
        const targetNode = getNodeById(targetNodeId);
        if (targetNode) {
            return (
                <button key={index} onClick={() => {(window as any).__targetSectionSlugForNodeView = targetSectionSlug; onSelectNode(targetNode, targetSectionSlug);}} title={`View node: ${targetNode.label || targetNode.id}`}
                    className={`text-xs px-1.5 py-0.5 rounded-full mr-1.5 mb-1.5 inline-flex items-center group transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-blue-400 hover:text-blue-300' : 'bg-slate-200 hover:bg-slate-300 text-blue-600 hover:text-blue-700'} hover:underline`}>
                    <Link2 size={11} className="mr-1 flex-shrink-0" /> {item.text}
                </button>
            );
        }
      }
    }
    // If no specific link type matched, or if item.link is undefined
    return (
      <span key={index} className={`text-xs px-1.5 py-0.5 rounded-full mr-1.5 mb-1.5 inline-block ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
        {getCleanTextForDisplay(item.text)}
      </span>
    );
  };

  return (
    <div className={`p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
      <div className="flex items-center mb-3">
        {icon}
        <h3 id={`${slugify(title)}-heading`} className="ml-2 text-md font-semibold text-slate-700 dark:text-slate-300">
          {title}
        </h3>
      </div>
      <div className="flex flex-wrap">
        {items.map(renderItem)}
      </div>
    </div>
  );
};
export default NodeMetadataCard;