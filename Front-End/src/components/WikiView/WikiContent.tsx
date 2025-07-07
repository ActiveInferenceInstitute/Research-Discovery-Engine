// src/components/WikiView/WikiContent.tsx
import React, { useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronRight, Hash } from 'lucide-react';
import { NodeObject, ParsedSection } from '../../types';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { slugify } from '../../utils/markdownParser';
import { preprocessMarkdownForDisplayUtil } from '../../utils/parseNodeData';
import { createMarkdownLinkRenderer } from '../../utils/markdownLinkRenderer';

interface WikiContentProps {
  darkMode: boolean;
  section: ParsedSection; // The specific section to render (could be preamble or a regular section)
  cnmNodes: NodeObject[];
  onSelectNode: (node: NodeObject, sectionSlug?: string) => void;
  onPaperClick: (citationKey: string) => void;
  activeSectionId: string | null; // To highlight if this section is active
  onNavigateToSection?: (targetNav: string) => void; // For intra-file/inter-file navigation from links
}

const WikiContent: React.FC<WikiContentProps> = ({
  darkMode, section, cnmNodes, onSelectNode, onPaperClick, activeSectionId, onNavigateToSection
}) => {
   const sectionRef = useRef<HTMLDivElement>(null);

   const processedContent = useMemo(() => {
    if (!section || !section.content) return "";
    return preprocessMarkdownForDisplayUtil(section.content, section.sourceFileKey, cnmNodes);
   }, [section.content, section.sourceFileKey, cnmNodes]);

    const markdownLinkComponent = useMemo(() => createMarkdownLinkRenderer({
        darkMode,
        allNodes: cnmNodes,
        onSelectNode,
        onPaperClick,
        onNavigateToWikiSection: onNavigateToSection,
        currentFileKey: section.sourceFileKey,
    }), [darkMode, cnmNodes, onSelectNode, onPaperClick, onNavigateToSection, section.sourceFileKey]);

    const components = {
      h1: ({node: _n, ...props}: any) => <h1 id={(props.id && props.id !== "undefined") ? props.id : slugify(React.Children.toArray(props.children).join(''))} className="text-2xl font-bold mt-5 mb-3 border-b pb-1 dark:border-slate-600" {...props}></h1>,
      h2: ({node: _n, ...props}: any) => <h2 id={(props.id && props.id !== "undefined") ? props.id : slugify(React.Children.toArray(props.children).join(''))} className="text-xl font-semibold mt-4 mb-2 border-b pb-1 dark:border-slate-700" {...props}></h2>,
      h3: ({node: _n, ...props}: any) => <h3 id={(props.id && props.id !== "undefined") ? props.id : slugify(React.Children.toArray(props.children).join(''))} className="text-lg font-semibold mt-3 mb-1.5" {...props}></h3>,
      h4: ({node: _n, ...props}: any) => ( <h4 id={(props.id && props.id !== "undefined") ? props.id : slugify(React.Children.toArray(props.children).join(''))} className="text-base font-semibold mt-2 mb-1 flex items-center" {...props}> <Hash size={14} className="mr-1.5 text-slate-500 dark:text-slate-400 opacity-70 flex-shrink-0" /> {props.children} </h4> ),
     // Use div instead of p to avoid nesting issues with pre/code elements
     p: ({node: _n, ...props}: any) => <div className="mb-2 leading-relaxed text-sm" {...props}></div>,
      ul: ({node: _n, ...props}: any) => <ul className="list-disc pl-5 mb-2 space-y-0.5 text-sm" {...props}></ul>,
      ol: ({node: _n, ...props}: any) => <ol className="list-decimal pl-5 mb-2 space-y-0.5 text-sm" {...props}></ol>,
      li: ({node: _n, ...props}: any) => <li className="mb-0.5 text-sm leading-relaxed" {...props}></li>,
      code: ({ node: _n, inline, className, children, ...props }: any) => {
        const childText = React.Children.toArray(children).join('');
        return inline
          ? <code {...props} className={`px-1 py-0.5 rounded text-xs font-mono ${darkMode ? 'bg-slate-700 text-amber-300' : 'bg-slate-200 text-amber-700'}`}>{childText.trim()}</code>
          : <pre {...props} className={`p-2 my-1.5 rounded-md overflow-x-auto text-xs border ${darkMode ? 'bg-slate-900/70 border-slate-700' : 'bg-slate-50 border-slate-300'}`}><code className={`font-mono ${className}`}>{childText.trim()}</code></pre>;
      },
      blockquote: ({node: _n, ...props}: any) => <blockquote className={`border-l-4 pl-3 italic my-1.5 py-0.5 text-sm ${darkMode ? 'border-slate-600 text-slate-400 bg-slate-700/30' : 'border-slate-300 text-slate-600 bg-slate-100/50'}`} {...props}></blockquote>,
      a: markdownLinkComponent,
    };

  // The section title is now expected to be rendered by KnowledgeBrowserSidebar's main content area for the preamble,
  // or as part of the recursive structure if WikiContent is called for subsections.
  // So, we only render the ReactMarkdown part here.
  // If section.level is 0 (preamble), it effectively just renders its content.

  return (
     <div
        ref={sectionRef}
        id={section.id} // ID for scrolling, if needed directly
        className={`wiki-section-render prose ${darkMode ? 'prose-invert' : ''} max-w-none
                    ${ section.id === activeSectionId ? (darkMode ? 'bg-blue-900/5' : 'bg-blue-500/5') : ''} `}
     >
        {/* Only render an explicit heading tag if it's not the special preamble display (level > 0)
            AND if the section itself is what we want to display (not just its subsections recursively)
            The parent (KnowledgeBrowserSidebar or another WikiContent instance) will handle the main title.
        */}
        {section.level > 0 && section.title !== "Introduction" /* Avoid double title for preamble */}
         {(
           React.createElement(
             `h${Math.min(6, section.level)}`, // Use actual level for H tag
             { 
               id: section.id, 
               className: `font-semibold ${
                 section.level === 1 ? 'text-xl mt-3 mb-2 border-b pb-1 dark:border-slate-700' :
                 section.level === 2 ? 'text-lg mt-2 mb-1.5 border-b pb-0.5 dark:border-slate-700/70' :
                 section.level === 3 ? 'text-base mt-1.5 mb-1' :
                 'text-sm mt-1 mb-0.5 flex items-center'
               }`
             },
             section.level >= 4 && <ChevronRight size={15} className="mr-1 text-blue-500 dark:text-blue-400 flex-shrink-0" />,
             section.title
           )
        )}
        <ReactMarkdown components={components} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
           {processedContent}
        </ReactMarkdown>

         {section.subsections && section.subsections.length > 0 && (
              <div className={`mt-1 space-y-1 pl-3 ${section.level < 3 && section.level > 0 ? 'border-l border-slate-300 dark:border-slate-600/50' : ''}`}>
                  {section.subsections.map(subsection => (
                     <WikiContent
                        key={subsection.id}
                        darkMode={darkMode}
                        section={subsection}
                        cnmNodes={cnmNodes}
                        onSelectNode={onSelectNode}
                        onPaperClick={onPaperClick}
                        activeSectionId={activeSectionId}
                        onNavigateToSection={onNavigateToSection}
                     />
                  ))}
              </div>
           )}
     </div>
  );
};
export default WikiContent;