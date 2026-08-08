// src/components/NodeView/NodeDescription.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { NodeObject } from '../../types';
import { slugify } from '../../utils/markdownParser';
import { ExternalLink, Link2, BookOpen, FileText } from 'lucide-react'; // Import icons

interface NodeDescriptionProps {
  descriptionHtml: string; // This is ALREADY PROCESSED markdown string with special links
  darkMode: boolean;
  allNodes: NodeObject[]; // For resolving node IDs
  onSelectNode: (node: NodeObject, sectionSlug?: string) => void;
  onNavigateToWikiSection: (fileKey: string, sectionSlug: string) => void;
  onPaperClick: (pubKey: string) => void;
}

const NodeDescription: React.FC<NodeDescriptionProps> = ({ 
    descriptionHtml, darkMode, allNodes, 
    onSelectNode, onNavigateToWikiSection, onPaperClick 
}) => {

  const getNodeById = (id: string) => allNodes.find(n => n.id === id);

  const markdownComponents = {
    // Pass id to headings for intra-node scrolling
    h1: ({ node: _n, children, ...props }: any) => <h1 {...props} id={(props as any).id} className="text-xl font-bold mt-6 mb-2 pb-1 border-b dark:border-slate-700">{children}</h1>,
    h2: ({ node: _n, children, ...props }: any) => <h2 {...props} id={(props as any).id} className="text-lg font-semibold mt-5 mb-1.5">{children}</h2>,
    h3: ({ node: _n, children, ...props }: any) => <h3 {...props} id={(props as any).id} className="text-base font-semibold mt-4 mb-1">{children}</h3>,
    h4: ({ node: _n, children, ...props }: any) => <h4 {...props} id={(props as any).id} className="text-sm font-semibold mt-3 mb-0.5">{children}</h4>,
    // Use div instead of p to avoid nesting issues with pre/code elements
    p: ({ node: _n, children, ...props }: any) => <div {...props} className="text-base leading-relaxed my-3">{children}</div>,
    ul: ({ node: _n, children, ...props }: any) => <ul {...props} className="list-disc pl-6 my-3 space-y-1 text-base">{children}</ul>,
    ol: ({ node: _n, children, ...props }: any) => <ol {...props} className="list-decimal pl-6 my-3 space-y-1 text-base">{children}</ol>,
    li: ({ node: _n, children, ...props }: any) => <li {...props} className="my-1 text-base">{children}</li>,
    code: ({ node: _n, inline, className, children, ...props }: any) => {
      const childText = React.Children.toArray(children).join('');
      return inline 
        ? <code {...props} className={`px-1.5 py-0.5 rounded ${darkMode ? 'bg-slate-700 text-amber-400' : 'bg-slate-200 text-amber-700'} text-xs font-mono`}>{childText.trim()}</code>
        : <pre {...props} className={`${darkMode ? 'bg-slate-800' : 'bg-slate-100'} p-3 rounded-md overflow-x-auto text-xs my-3`}><code className={`font-mono ${className}`}>{childText.trim()}</code></pre>;
    },
    a: ({ node: _n, href, children, ...props }: any) => {
        // This 'a' component receives HREFs processed by parseNodeData
        if (!href) return <span {...props}>{children}</span>;

        if (href.startsWith('#CITATION__')) {
            const refKey = href.substring(11); 
            return ( <button className={`font-mono text-xs px-1 py-0.5 rounded mx-0.5 inline-flex items-center group ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-teal-400 hover:text-teal-300' : 'bg-slate-200 hover:bg-slate-300 text-teal-700 hover:text-teal-600'}`} onClick={() => onPaperClick(refKey)} title={`Open publication: ${refKey}.md`} {...props} > <FileText size={11} className="mr-0.5 flex-shrink-0" />  <span className="truncate">{children}</span>  <ExternalLink size={11} className="ml-0.5 opacity-0 group-hover:opacity-100" /> </button> );
        }
        if (href.startsWith('##wiki-nav::')) {
            const parts = href.substring('##wiki-nav::'.length).split('::');
            const fileKey = parts[0]; const sectionSlug = parts[1];
            return ( <button onClick={(e) => { e.preventDefault(); onNavigateToWikiSection(fileKey, sectionSlug); }} className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center text-base" title={`View wiki: ${fileKey}${sectionSlug ? '#'+sectionSlug : ''}`} {...props} > <BookOpen size={14} className="mr-1" />{children} </button> );
        }
        if (href.startsWith('#') && href.includes('__')) { // #nodeId__sectionSlug (inter-node section link)
            const parts = href.substring(1).split('__'); const targetNodeId = parts[0]; const targetSectionSlug = parts[1]; 
            const targetNode = getNodeById(targetNodeId); 
            if (targetNode) { return (  <button onClick={() => { (window as any).__targetSectionSlugForNodeView = targetSectionSlug; onSelectNode(targetNode, targetSectionSlug); }} className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center text-base" title={`View: ${targetNode.label || targetNode.id}${targetSectionSlug ? '#'+targetSectionSlug : ''}`} {...props} > <Link2 size={14} className="mr-1" /> {children} </button> ); }
        }
        if (href.startsWith('#')) { // #nodeId (simple node) or #section-slug (intra-page)
            const targetId = href.substring(1);
            const targetNode = getNodeById(targetId);
            if (targetNode) { return ( <button onClick={() => { delete (window as any).__targetSectionSlugForNodeView; onSelectNode(targetNode);}} className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center text-base" title={`View node: ${targetNode.label || targetNode.id}`} {...props} > <Link2 size={14} className="mr-1" /> {children} </button> );
            } else { // Intra-page anchor
                const element = document.getElementById(targetId); 
                if (element) return ( <a href={href} onClick={(e) => { e.preventDefault(); element.scrollIntoView({behavior: 'smooth', block: 'start'}); }} className="text-blue-600 dark:text-blue-400 hover:underline text-base" {...props}> {children} </a> );
                return ( <a href={href} className="text-slate-500 dark:text-slate-400 hover:underline text-base" {...props}> {children} (section) </a> );
            } 
        }
        if(href.startsWith('http') || href.startsWith('mailto')) return ( <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center group text-base" {...props} > {children} <ExternalLink size={14} className="ml-1 opacity-50 group-hover:opacity-100" /> </a> );
        return <span className="text-orange-500 italic" {...props}>{children}</span>; // Fallback
    }
  };

  return (
    <section aria-labelledby="node-description-heading">
      {/* <h2 id="node-description-heading" className="text-xl font-semibold mb-3 border-b pb-2 dark:border-slate-700">Description</h2> */}
      {/* The "Description" h2 might be redundant if descriptionHtml already starts with it */}
      <div className={`prose prose-slate dark:prose-invert max-w-none 
                       prose-p:text-base prose-li:text-base prose-headings:font-semibold
                       prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline
                       prose-code:text-amber-700 dark:prose-code:text-amber-400 prose-code:text-xs prose-code:font-mono
                       prose-blockquote:border-blue-500 dark:prose-blockquote:border-blue-400`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]} // Important for rendering spans for broken links from parser
          components={markdownComponents}
        >
          {descriptionHtml}
        </ReactMarkdown>
      </div>
    </section>
  );
};
export default NodeDescription;