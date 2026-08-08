// src/components/NodeView/NodeView.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NodeObject, LinkObject as CNMLinkObject } from '../../types';
import { FileText, ExternalLink, Brain, Zap, FlaskConical, Lightbulb, Network, Link2, BookOpen, Activity, Target, HelpCircle, Layers, Hash, ArrowDownCircle, ArrowUpCircle, Tag, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { slugify } from '../../utils/markdownParser';
import { parseNodeDetails, ParsedNodeDetails } from '../../utils/parseNodeData';
import { createMarkdownLinkRenderer } from '../../utils/markdownLinkRenderer';

interface NodeViewProps {
  darkMode: boolean;
  node: NodeObject;
  allNodes: NodeObject[];
  relatedLinks?: CNMLinkObject[];
  onSelectNode: (node: NodeObject, sectionSlug?: string) => void;
  onStartDesign?: (seedNodeId: string) => void;
  onTriggerAgent?: (action: string, payload?: any) => void;
  onNavigateToWikiSection: (fileKey: string, sectionSlug: string) => void;
  onPaperClick: (citationKey: string) => void;
}

const NodeViewHeader: React.FC<{ 
    title: string; 
    subtitle?: string; 
    id?: string, 
    type?: NodeObject['type'], 
    status?: NodeObject['status'], 
    sourceFileKey?: string, 
    sourceWikiSectionId?: string, 
    onNavigateToWikiSection: NodeViewProps['onNavigateToWikiSection'],
    darkMode: boolean 
}> = ({ title, subtitle, id, type, status, sourceFileKey, sourceWikiSectionId, onNavigateToWikiSection, darkMode }) => {
  
  const NodeIcon = ({ type, className }: { type?: NodeObject['type'], className?: string }) => {
    const iconSize = 20; 
    const defaultClass = `mr-1.5 flex-shrink-0 ${className}`;
    if (!type) return <Layers size={iconSize} className={defaultClass} />;
    if (type.startsWith('Material')) return <FlaskConical size={iconSize} className={`${defaultClass} ${darkMode ? 'text-teal-400' : 'text-teal-500'}`} />;
    if (type.startsWith('Mechanism')) return <Brain size={iconSize} className={`${defaultClass} ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />;
    if (type.startsWith('Method')) return <Zap size={iconSize} className={`${defaultClass} ${darkMode ? 'text-orange-400' : 'text-orange-500'}`} />;
    if (type.startsWith('Phenomenon')) return <Activity size={iconSize} className={`${defaultClass} ${darkMode ? 'text-red-400' : 'text-red-500'}`} />;
    if (type.startsWith('Application')) return <Target size={iconSize} className={`${defaultClass} ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />;
    if (type.startsWith('TheoreticalConcept')) return <HelpCircle size={iconSize} className={`${defaultClass} ${darkMode ? 'text-pink-400' : 'text-pink-500'}`} />;
    if (type === 'Concept' || type === 'SystemNode') return <Lightbulb size={iconSize} className={`${defaultClass} ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />;
    if (type === 'KnowledgeGapNode') return <Lightbulb size={iconSize} className={`${defaultClass} ${darkMode ? 'text-yellow-500' : 'text-yellow-600'}`} />
    if (type === 'KnowledgeArtifactNode') return <Layers size={iconSize} className={`${defaultClass} ${darkMode ? 'text-cyan-400' : 'text-cyan-500'}`} />
    if (type === 'Documentation') return <BookOpen size={iconSize} className={`${defaultClass} ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
    return <Layers size={iconSize} className={defaultClass} />;
  };

  return (
    <header className="pb-3 mb-3 border-b border-slate-200 dark:border-slate-700">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-50 flex items-center">
        <NodeIcon type={type} />
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-xs sm:text-sm italic text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
      <div className="mt-1.5 space-x-2 text-[11px] sm:text-xs">
            <span className={`font-medium text-slate-500 dark:text-slate-400`}>Type: {type}</span>
            {status && <span className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold
                ${status === 'Hypothetical' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' :
                  status === 'Proposed' ? 'bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100' :
                  status === 'Validated' ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100' :
                  'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100'}`}>
                Status: {status}
            </span>}
      </div>
      {sourceFileKey && sourceWikiSectionId && (
            <button onClick={() => onNavigateToWikiSection(sourceFileKey!, sourceWikiSectionId!)}
                className={`mt-1 text-[11px] sm:text-xs flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline`}>
                <BookOpen size={11} className="mr-1"/> Source: {sourceFileKey}/{sourceWikiSectionId}
            </button>
        )}
    </header>
  );
};

const NodeViewDescription: React.FC<{ description: string; darkMode: boolean; markdownComponents: any; }> =
 ({ description, darkMode, markdownComponents }) => {
  if (!description || description.trim() === '' || description.startsWith('*No detailed description')) {
    return <p className="italic text-sm text-slate-500 dark:text-slate-400 my-4">No primary description content provided for this node. Select a different node to view its details.</p>;
  }
  return (
    <section className="mb-5" aria-labelledby="node-main-description">
      <h2 id="node-main-description" className="sr-only">Main Description</h2>
      <div className={`prose prose-sm dark:prose-invert max-w-none 
                      prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 
                      prose-headings:mt-2.5 prose-headings:mb-1 prose-headings:border-b prose-headings:pb-0.5 dark:prose-headings:border-slate-600/80
                      ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>
          {description}
        </ReactMarkdown>
      </div>
    </section>
  );
};

const NodeViewAttributes: React.FC<{ 
    attributes: ParsedNodeDetails['attributes']; 
    inputs: ParsedNodeDetails['inputs'];
    outputs: ParsedNodeDetails['outputs'];
    darkMode: boolean; markdownComponents: any; 
}> = ({ attributes, inputs, outputs, darkMode, markdownComponents }) => {
  const hasInputs = inputs && inputs.length > 0;
  const hasOutputs = outputs && outputs.length > 0;
  const hasAttributes = attributes && attributes.length > 0;

  if (!hasInputs && !hasOutputs && !hasAttributes) return null;

  const renderLinkableItem = (item: { text: string; link?: string; originalMatch?: string }, index: number) => (
    <li key={index} className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-snug">
        {item.link ? (
            <ReactMarkdown components={markdownComponents}> 
                {`[${item.text}](${item.link})`}
            </ReactMarkdown>
        ) : (
            <ReactMarkdown components={markdownComponents}>
                {item.originalMatch || item.text}
            </ReactMarkdown>
        )
        }
    </li>
  );

  return (
    <section className={`grid grid-cols-1 ${(hasInputs || hasOutputs) && hasAttributes ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-3 mb-5`}>
      {(hasInputs || hasOutputs) && (
        <div className="space-y-3">
        {hasInputs && (
            <div className={`p-2.5 rounded-lg shadow-sm border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center mb-1.5">
                <ArrowDownCircle className="text-blue-500 dark:text-blue-400 mr-1.5 h-4 w-4" />
                <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Key Inputs / Properties</h3>
            </div>
            <ul className="list-none pl-1 space-y-0.5">{inputs.map(renderLinkableItem)}</ul>
            </div>
        )}
        {hasOutputs && (
            <div className={`p-2.5 rounded-lg shadow-sm border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center mb-1.5">
                <ArrowUpCircle className="text-teal-500 dark:text-teal-400 mr-1.5 h-4 w-4" />
                <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Key Outputs / Behaviors</h3>
            </div>
            <ul className="list-none pl-1 space-y-0.5">{outputs.map(renderLinkableItem)}</ul>
            </div>
        )}
        </div>
      )}
      
      {hasAttributes && (
        <div className={`p-2.5 rounded-lg shadow-sm border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">Other Attributes</h3>
          <dl className="text-xs sm:text-sm space-y-1.5">
            {attributes.map(attr => (
              <div key={attr.key}>
                <dt className="font-medium text-[11px] text-slate-500 dark:text-slate-400">{attr.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</dt>
                <dd className={`ml-2 text-slate-700 dark:text-slate-200 prose prose-xs dark:prose-invert max-w-none child-p:my-0.5 child-ul:my-0.5 child-li:my-0 ${darkMode ? 'prose-dark-text' : ''}`}>
                    <ReactMarkdown components={markdownComponents}>{attr.value}</ReactMarkdown>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
};

const NodeViewConnections: React.FC<{
  connectionsText?: string | null;
  relatedConcepts: ParsedNodeDetails['relatedConcepts'];
  exampleCitations: ParsedNodeDetails['exampleCitations'];
  graphLinks: { [key: string]: { link: CNMLinkObject, targetNode: NodeObject }[] };
  darkMode: boolean;
  markdownComponents: any;
  onSelectNode: NodeViewProps['onSelectNode'];
}> = ({ connectionsText, relatedConcepts, exampleCitations, graphLinks, darkMode, markdownComponents, onSelectNode }) => {
  
  const getInitialActiveTab = () => {
    if (relatedConcepts && relatedConcepts.length > 0) return 'related';
    if (Object.keys(graphLinks).length > 0) return 'graph';
    if (connectionsText && connectionsText.trim && connectionsText.trim() !== "") return 'text';
    if (exampleCitations && exampleCitations.length > 0) return 'citations';
    return 'related'; 
  };
  const [activeTab, setActiveTab] = useState<'related' | 'graph' | 'text' | 'citations'>(getInitialActiveTab());
  
  useEffect(() => { 
    setActiveTab(getInitialActiveTab());
  }, [relatedConcepts, graphLinks, connectionsText, exampleCitations]);

  const hasRelated = relatedConcepts && relatedConcepts.length > 0;
  const hasGraphLinks = Object.keys(graphLinks).length > 0;
  const hasTextLinks = !!connectionsText && typeof connectionsText === 'string' && connectionsText.trim() !== "";
  const hasCitations = exampleCitations && exampleCitations.length > 0;

  if (!hasRelated && !hasGraphLinks && !hasTextLinks && !hasCitations) return null;
  
  const NodeIconMini = ({ type, className }: { type?: NodeObject['type'], className?: string }) => { 
    const iconSize = 10;
    const defaultClass = `mr-0.5 flex-shrink-0 ${className}`;
    if (!type) return <Layers size={iconSize} className={defaultClass} />;
    if (type.startsWith('Material')) return <FlaskConical size={iconSize} className={`${defaultClass} text-current opacity-70`} />;
    if (type.startsWith('Mechanism')) return <Brain size={iconSize} className={`${defaultClass} text-current opacity-70`} />;
    if (type.startsWith('Method')) return <Zap size={iconSize} className={`${defaultClass} text-current opacity-70`} />;
    if (type.startsWith('Phenomenon')) return <Activity size={iconSize} className={`${defaultClass} text-current opacity-70`} />;
    if (type.startsWith('Application')) return <Target size={iconSize} className={`${defaultClass} text-current opacity-70`} />;
    if (type.startsWith('TheoreticalConcept')) return <HelpCircle size={iconSize} className={`${defaultClass} text-current opacity-70`} />;
    if (type === 'Documentation') return <BookOpen size={iconSize} className={`${defaultClass} text-current opacity-70`} />;
    if (type === 'Concept' || type === 'SystemNode') return <Lightbulb size={iconSize} className={`${defaultClass} text-current opacity-70`} />;
    return <Layers size={iconSize} className={defaultClass} />;
  };

  return (
    <section className="mb-5">
      <div className={`border rounded-lg overflow-hidden ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
        <div className={`flex border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'} flex-wrap`}>
          {hasRelated && <button className={`px-2.5 py-1.5 text-[11px] sm:text-xs font-medium flex items-center ${activeTab === 'related' ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 border-blue-500 dark:border-blue-400 border-b-2 -mb-px' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 border-transparent'}`} onClick={() => setActiveTab('related')}> <Tag className="w-3 h-3 mr-1" /> Related (from text)</button>}
          {hasGraphLinks && <button className={`px-2.5 py-1.5 text-[11px] sm:text-xs font-medium flex items-center ${activeTab === 'graph' ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 border-blue-500 dark:border-blue-400 border-b-2 -mb-px' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 border-transparent'}`} onClick={() => setActiveTab('graph')}> <Network className="w-3 h-3 mr-1" /> Graph Links</button>}
          {hasTextLinks && <button className={`px-2.5 py-1.5 text-[11px] sm:text-xs font-medium flex items-center ${activeTab === 'text' ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 border-blue-500 dark:border-blue-400 border-b-2 -mb-px' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 border-transparent'}`} onClick={() => setActiveTab('text')}> <Link2 className="w-3 h-3 mr-1" /> Links (from text)</button>}
          {hasCitations && <button className={`px-2.5 py-1.5 text-[11px] sm:text-xs font-medium flex items-center ${activeTab === 'citations' ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 border-blue-500 dark:border-blue-400 border-b-2 -mb-px' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 border-transparent'}`} onClick={() => setActiveTab('citations')}> <FileText className="w-3 h-3 mr-1" /> Citations</button>}
        </div>
        <div className="p-2.5">
          {activeTab === 'related' && hasRelated && (
            <div className="flex flex-wrap gap-1">
              {relatedConcepts.map((item, index) => (
                <div key={index} className={`inline-block px-1.5 py-0.5 rounded-full text-[11px] font-medium transition-colors ${darkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>
                   {item.link ? (
                        <ReactMarkdown components={markdownComponents}>
                            {`[${item.text}](${item.link})`}
                        </ReactMarkdown>
                    ) : item.text}
                </div>
              ))}
            </div>
          )}
          {activeTab === 'graph' && hasGraphLinks && ( 
             <div className="space-y-2">
                {Object.entries(graphLinks).map(([type, links]) => (
                    <div key={type}>
                        <h5 className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-0.5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                            {type.replace(/-/g, ' ').replace(/_/g, ' ').replace('Edge','').replace('edge','')}
                        </h5>
                        <div className="flex flex-wrap gap-1">
                            {links.map(({ targetNode }) => (
                                <button
                                    key={targetNode.id + type}
                                    onClick={() => onSelectNode(targetNode)}
                                    className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs flex items-center space-x-0.5 transition-colors
                                                ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-slate-200'
                                                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                                    title={`View node: ${targetNode.label || targetNode.id}`}
                                >
                                  <NodeIconMini type={targetNode.type} />
                                  <span className="truncate max-w-[90px] sm:max-w-[120px]">{targetNode.label || targetNode.id}</span>
                                  <Link2 size={9} className="opacity-70"/>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
          )}
          {activeTab === 'text' && hasTextLinks && (
            <div className={`prose prose-xs dark:prose-invert max-w-none ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <ReactMarkdown components={markdownComponents}>{connectionsText!}</ReactMarkdown>
            </div>
          )}
          {activeTab === 'citations' && hasCitations && (
            <div className="flex flex-wrap gap-1">
              {exampleCitations.map((citation, index) => (
                 <button
                   key={index}
                   onClick={() => onPaperClick(citation.key)}
                   className={`font-mono text-sm px-3 py-2 rounded-md mr-2 mb-2 inline-flex items-center group transition-colors
                               ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-teal-300 hover:text-teal-200'
                                         : 'bg-slate-200 hover:bg-slate-300 text-teal-700 hover:text-teal-600'}`}
                   title={`Open publication source: ${citation.key}.md`}
                 >
                   <FileText size={16} className="mr-2 flex-shrink-0" />
                   <span className="group-hover:underline font-medium">{citation.key}</span>
                   <ExternalLink size={16} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};


const NodeView: React.FC<NodeViewProps> = ({
  darkMode, node, allNodes, relatedLinks = [],
  onSelectNode, onStartDesign, onTriggerAgent,
  onNavigateToWikiSection, onPaperClick
}) => {

  const scrollRef = useRef<HTMLDivElement>(null);
  const parsedDetails = useMemo(() => parseNodeDetails(node, allNodes), [node, allNodes]);

  // Ensure we're using the correct description field
  const mainDescription = parsedDetails.mainDescription || parsedDetails.description;
  useEffect(() => {
    const targetSlug = (window as any).__targetSectionSlugForNodeView;
    if (targetSlug && scrollRef.current) {
      const element = scrollRef.current.querySelector(`#${targetSlug}`);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
      }
      delete (window as any).__targetSectionSlugForNodeView;
    } else if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [node.id]);

  const nodeViewMarkdownLinkRenderer = useMemo(() => createMarkdownLinkRenderer({
    darkMode,
    allNodes,
    onSelectNode,
    onPaperClick,
    onNavigateToWikiSection, 
    onNavigateToNodeViewSection: (sectionSlug) => {
        const element = scrollRef.current?.querySelector(`#${sectionSlug}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    currentFileKey: node.sourceFileKey 
  }), [darkMode, allNodes, onSelectNode, onPaperClick, onNavigateToWikiSection, node.sourceFileKey]);

  const nodeViewMarkdownComponents = useMemo(() => ({
    h1: ({node: _n, ...props}: any) => <h1 id={props.id || slugify(React.Children.toArray(props.children).join(''))} className="text-xl font-bold mt-4 mb-2 border-b pb-1 dark:border-slate-600" {...props}></h1>,
    h2: ({node: _n, ...props}: any) => <h2 id={props.id || slugify(React.Children.toArray(props.children).join(''))} className="text-lg font-semibold mt-3 mb-1.5 border-b pb-0.5 dark:border-slate-700" {...props}></h2>,
    h3: ({node: _n, ...props}: any) => <h3 id={props.id || slugify(React.Children.toArray(props.children).join(''))} className="text-base font-semibold mt-2 mb-1" {...props}></h3>,
    h4: ({node: _n, ...props}: any) => <h4 id={props.id || slugify(React.Children.toArray(props.children).join(''))} className="text-sm font-semibold mt-1.5 mb-0.5 flex items-center" {...props}><Hash size={13} className="mr-1 text-slate-500 dark:text-slate-400 opacity-70"/>{props.children}</h4>,
   // Use div instead of p to avoid nesting issues with pre/code elements
   p: ({node: _n, ...props}: any) => <div className="my-1.5 leading-relaxed text-sm" {...props}></div>,
    ul: ({node: _n, ...props}: any) => <ul className="list-disc pl-5 my-1.5 space-y-0.5 text-sm" {...props}></ul>,
    // CORRECTED THE ol COMPONENT HERE
    ol: ({node: _n, ...props}: any) => <ol className="list-decimal pl-5 my-1.5 space-y-0.5 text-sm" {...props}></ol>,
    li: ({node: _n, ...props}: any) => <li className="my-0.5 text-sm leading-relaxed" {...props}></li>,
    code: ({ node: _n, inline, className, children, ...props }: any) => {
        const childText = React.Children.toArray(children).join('');
        return inline
            ? <code {...props} className={`px-1 py-0.5 rounded text-xs font-mono ${darkMode ? 'bg-slate-700 text-amber-300' : 'bg-slate-200 text-amber-700'}`}>{childText.trim()}</code>
            : <pre {...props} className={`p-2 my-1.5 rounded-md overflow-x-auto text-xs border ${darkMode ? 'bg-slate-900/70 border-slate-700' : 'bg-slate-50 border-slate-300'}`}><code className={`font-mono ${className}`}>{childText.trim()}</code></pre>;
    },
    blockquote: ({node: _n, ...props}: any) => <blockquote className={`border-l-4 pl-3 italic my-1.5 py-0.5 text-sm ${darkMode ? 'border-slate-600 text-slate-400 bg-slate-700/30' : 'border-slate-300 text-slate-600 bg-slate-100/50'}`} {...props}></blockquote>,
    a: nodeViewMarkdownLinkRenderer,
  }), [darkMode, nodeViewMarkdownLinkRenderer]);


  const isDesignable = node.type && !String(node.type).includes('_Category') &&
                       (node.type.startsWith('Material') || node.type.startsWith('Mechanism') || node.type.startsWith('Method') || node.type === 'Phenomenon' || node.type === 'Application');

  return (
    <div ref={scrollRef} className={`node-view-panel h-full overflow-y-auto scrollbar-thin p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4
                   ${darkMode ? 'bg-slate-800 text-slate-200 scrollbar-thumb-slate-700 scrollbar-track-slate-800'
                               : 'bg-white text-slate-800 scrollbar-thumb-slate-300 scrollbar-track-slate-100'}`}
          id={`node-view-for-${node.id}`}>

      <NodeViewHeader
        title={parsedDetails.title}
        subtitle={parsedDetails.humanReadableTitle}
        id={parsedDetails.idForDisplay}
        type={node.type}
        status={node.status}
        sourceFileKey={node.sourceFileKey}
        sourceWikiSectionId={node.sourceWikiSectionId}
        onNavigateToWikiSection={onNavigateToWikiSection}
        darkMode={darkMode}
      />

      <NodeViewAttributes
        attributes={parsedDetails.attributes}
        inputs={parsedDetails.inputs}
        outputs={parsedDetails.outputs}
        darkMode={darkMode}
        markdownComponents={nodeViewMarkdownComponents}
      />
      
      <NodeViewDescription
        description={mainDescription}
        darkMode={darkMode}
        markdownComponents={nodeViewMarkdownComponents}
      />

      <NodeViewConnections
        connectionsText={parsedDetails.connectionsText}
        relatedConcepts={parsedDetails.relatedConcepts}
        exampleCitations={parsedDetails.exampleCitations}
        graphLinks={useMemo(() => {
            const groups: { [key: string]: { link: CNMLinkObject, targetNode: NodeObject }[] } = {};
            relatedLinks.forEach(link => {
                const targetNodeId = typeof link.target === 'object' ? (link.target as NodeObject).id : String(link.target);
                const sourceNodeId = typeof link.source === 'object' ? (link.source as NodeObject).id : String(link.source);
                const otherNodeId = targetNodeId === node.id ? sourceNodeId : targetNodeId;
                const otherNode = allNodes.find(n => n.id === otherNodeId);
                if (otherNode && otherNode.id !== node.id) {
                    const linkType = link.type || 'related-to';
                    if (!groups[linkType]) groups[linkType] = [];
                    if (!groups[linkType].some(item => item.targetNode.id === otherNode.id)) {
                        groups[linkType].push({ link: link, targetNode: otherNode });
                    }
                }
            });
            return groups;
        }, [relatedLinks, node.id, allNodes])}
        darkMode={darkMode}
        markdownComponents={nodeViewMarkdownComponents}
        onSelectNode={onSelectNode}
      />

      {isDesignable && onStartDesign && onTriggerAgent && (
        <section className={`mt-4 pt-3 ${darkMode ? 'border-slate-700' : 'border-slate-300'} border-t`}>
          <h3 className="text-xs font-semibold mb-1.5 text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
              <button
                className={`w-full text-left p-1.5 rounded-md flex items-center space-x-1.5 transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`}
                onClick={() => onStartDesign(node.id)}
              > <Lightbulb size={13} /> <span>Start New Concept From This</span> </button>
              {onTriggerAgent &&
                  <button
                    className={`w-full text-left p-1.5 rounded-md flex items-center space-x-1.5 transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`}
                    onClick={() => onTriggerAgent('launch-exploratory-analysis', { targetId: node.id })}
                  > <Network size={13} /> <span>Explore Node Connections</span> </button>
              }
          </div>
        </section>
      )}
    </div>
  );
};
export default NodeView;