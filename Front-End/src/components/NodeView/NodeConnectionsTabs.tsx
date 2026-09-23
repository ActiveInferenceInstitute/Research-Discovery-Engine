// src/components/NodeView/NodeConnectionsTabs.tsx
import React, { useState } from 'react';
import { FormattedNodeData, NodeObject } from '../../types'; // Import FormattedNodeData
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
// ... (import icons and link rendering helpers like in NodeDescription)

interface NodeConnectionsTabsProps {
  parsedNodeData: FormattedNodeData;
  darkMode: boolean;
  allNodes: NodeObject[]; 
  onSelectNode: (node: NodeObject, sectionSlug?: string) => void;
  onNavigateToWikiSection: (fileKey: string, sectionSlug: string) => void;
  onPaperClick: (pubKey: string) => void;
}

const NodeConnectionsTabs: React.FC<NodeConnectionsTabsProps> = ({ 
    parsedNodeData, darkMode, allNodes,
    onSelectNode, onNavigateToWikiSection, onPaperClick 
}) => {
  const [activeTab, setActiveTab] = useState<'connections' | 'theory' | 'methods' | 'citations'>('connections');

  // Use the same markdownComponents as NodeDescription for consistency, or a simplified one
  const connectionMarkdownComponents = { /* ... copy/adapt from NodeDescription ... */ };


  return (
    <section aria-labelledby="connections-heading" className="mt-8">
      <h2 id="connections-heading" className="text-xl font-semibold mb-4 border-b pb-2 dark:border-slate-700">
        Relationships & Context
      </h2>
      <div className="mb-4 border-b border-slate-300 dark:border-slate-700">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button onClick={() => setActiveTab('connections')} className={`${activeTab === 'connections' ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>
            Connections
          </button>
          {parsedNodeData.theoreticalConcepts.length > 0 && (
            <button onClick={() => setActiveTab('theory')} className={`${activeTab === 'theory' ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>
              Theoretical Concepts
            </button>
          )}
          {/* Add more tabs as needed */}
        </nav>
      </div>

      {activeTab === 'connections' && parsedNodeData.connectionsRaw && (
        <div className={`prose prose-slate dark:prose-invert max-w-none prose-p:text-sm prose-li:text-sm`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={connectionMarkdownComponents}>
            {parsedNodeData.connectionsRaw}
          </ReactMarkdown>
        </div>
      )}
      {activeTab === 'theory' && (
        <div className="flex flex-wrap gap-2">
          {parsedNodeData.theoreticalConcepts.map((item, idx) => (
            <span key={idx} className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full text-xs">{item.text}</span> // Simplistic for now
          ))}
        </div>
      )}
      {/* Add content for other tabs */}
    </section>
  );
};
export default NodeConnectionsTabs;