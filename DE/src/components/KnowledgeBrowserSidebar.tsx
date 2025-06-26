// src/components/KnowledgeBrowserSidebar.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader, AlertCircle, ChevronDown, ChevronUp, BookOpen, ExternalLink, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { GraphData, NodeObject, ParsedSection } from '../../types';
import { parseMarkdownToStructuredDocument, ParserOutput, slugify } from '../utils/markdownParser';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { WIKI_BROWSER_CONFIG } from '../App';
import { humanizeSlugForDisplay, findSectionById_local, flattenSections } from './WikiView/wikiViewUtils'; // Ensure path is correct

interface KnowledgeBrowserSidebarProps {
  darkMode: boolean;
  onSelectNode: (node: NodeObject) => void;
  graphData: GraphData;
}

interface FileContent {
  key: string;
  label: string;
  icon?: React.ElementType;
  parsedDoc: ParserOutput | null;
  isLoading: boolean;
  error?: string | null;
  isOpen?: boolean;
}

const KnowledgeBrowserSidebar: React.FC<KnowledgeBrowserSidebarProps> = ({
  darkMode,
  onSelectNode,
  graphData,
}) => {
  const [filesContent, setFilesContent] = useState<FileContent[]>([]);
  // Ensure a default key is selected if WIKI_BROWSER_CONFIG is not empty
  const defaultOpenKey = WIKI_BROWSER_CONFIG.length > 0 ? WIKI_BROWSER_CONFIG[0].key : '';


  useEffect(() => {
    const fetchAllFiles = async () => {
      const initialFileStates: FileContent[] = WIKI_BROWSER_CONFIG.map((config, index) => ({ // Added index
        key: config.key,
        label: config.label,
        icon: config.icon || BookOpen,
        parsedDoc: null,
        isLoading: true,
        isOpen: index === 0, // CORRECTED: Only the first tab (e.g., Mechanisms) is open by default
      }));
      setFilesContent(initialFileStates);

      const updatedFileStates = await Promise.all(
        initialFileStates.map(async (fileState) => {
          const config = WIKI_BROWSER_CONFIG.find(c => c.key === fileState.key);
          if (!config) {
            return { ...fileState, isLoading: false, error: `Config not found for ${fileState.key}`};
          }
          try {
            const response = await fetch(config.file.startsWith('/') ? config.file : `/${config.file}`);
            if (!response.ok) {
              return { ...fileState, isLoading: false, error: `Failed to load ${fileState.label}` };
            }
            const markdown = await response.text();
            const parsedDoc = parseMarkdownToStructuredDocument(markdown, fileState.key);
            return { ...fileState, isLoading: false, parsedDoc };
          } catch (e) {
            console.error(`Error fetching/parsing ${fileState.label}:`, e);
            return { ...fileState, isLoading: false, error: `Error processing ${fileState.label}` };
          }
        })
      );
      setFilesContent(updatedFileStates);
    };
    fetchAllFiles();
  }, []); // Removed defaultOpenKey from deps, it's constant for initialization

  const toggleFileOpen = (fileKey: string) => {
    setFilesContent(prev => prev.map(f => f.key === fileKey ? { ...f, isOpen: !f.isOpen } : f));
  };

  const handleSectionSelect = useCallback((sectionId: string, fileKey: string) => {
    const targetNode = graphData.nodes.find(n => n.id === sectionId && n.sourceFileKey === fileKey);
    if (targetNode) {
      onSelectNode(targetNode);
    } else {
        const overviewNodeId = slugify(fileKey); 
        const overviewNode = graphData.nodes.find(n => n.id === overviewNodeId && n.sourceFileKey === fileKey);
        if (overviewNode) {
            onSelectNode(overviewNode);
        } else {
            console.warn(`[KBS] Node not found for sectionId: ${sectionId} in file: ${fileKey}. Overview node for '${overviewNodeId}' also not found.`);
        }
    }
  }, [graphData.nodes, onSelectNode]);


  const renderIndexSections = useCallback((sections: ParsedSection[], fileKey: string, level = 0): JSX.Element[] => {
    return sections.map((section) => {
      if (section.title.toLowerCase().startsWith("index of")) {
        return section.subsections && section.subsections.length > 0 ?
               <React.Fragment key={`${section.id}-${fileKey}-subs`}>{renderIndexSections(section.subsections, fileKey, level)}</React.Fragment> : null;
      }
      return (
        <React.Fragment key={section.id + fileKey}>
          <li>
            <button
              onClick={() => handleSectionSelect(section.id, fileKey)}
              className={`w-full text-left py-1 pr-2 text-xs flex items-center 
                          ${darkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-700'} 
                          ${level === 0 ? 'font-semibold' : 'font-normal'}`}
              style={{ paddingLeft: `${0.5 + level * 0.75}rem` }}
              title={section.title}
            >
              {level > 0 && section.subsections && section.subsections.length > 0 && <ChevronRightIcon size={10} className="mr-1 opacity-50 flex-shrink-0" />}
              {level > 0 && (!section.subsections || section.subsections.length === 0) && <span className="w-3 mr-1 inline-block"></span>}
              <span className="truncate">{section.title}</span>
            </button>
          </li>
          {section.subsections && section.subsections.length > 0 && (
            <ul className="pl-1">
              {renderIndexSections(section.subsections, fileKey, level + 1)}
            </ul>
          )}
        </React.Fragment>
      )
    }).filter(Boolean) as JSX.Element[];
  }, [darkMode, handleSectionSelect]);


  const indexMarkdownComponents = useMemo(() => ({
    a: ({node: _n, href, children, ...props}: any) => {
        const linkText = React.Children.toArray(children).join('');
        const displayTitle = humanizeSlugForDisplay(linkText); 
        if (href && href.startsWith('#')) {
            const targetId = href.substring(1);
            const currentFileKeyForIndex = filesContent.find(f => f.isOpen)?.key || WIKI_BROWSER_CONFIG[0]?.key || ""; 
            return (
                <button {...props} onClick={() => handleSectionSelect(targetId, currentFileKeyForIndex)}
                    className={`wiki-index-link text-left w-full block py-1 px-1.5 focus:outline-none rounded-sm
                                ${darkMode ? 'text-slate-300 hover:text-blue-300 hover:bg-slate-700' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'}
                                font-normal text-sm leading-snug`} >
                    {displayTitle}
                </button>
            );
        }
        return ( <a href={href} {...props} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center ${darkMode ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700'} hover:underline text-sm`}> {displayTitle} <ExternalLink size={12} className="ml-1 opacity-70"/></a> ); 
    },
    ul: ({node: _n,ordered, className, children, ...props}: any) => <ul className={`wiki-index-ul ${ordered ? 'list-decimal' : ''} ${className || ''} pl-3 space-y-0.5`} {...props}>{children}</ul>,
    li: ({node: _n,children, className, ...props}: any) => <li className={`wiki-index-li ${className|| ''}`} {...props}>{children}</li>,
   // Use span instead of p to avoid nesting issues
   p: ({node: _n, children, className, ...props}:any) => <span className={`block ${className || ''}`}>{children}</span>,
    h1: ({node: _n, ...props}: any) => <h2 className="text-xs font-semibold mt-1 mb-0.5" {...props} />,
    h2: ({node: _n, ...props}: any) => <h3 className="text-xs font-medium mt-1 mb-0.5" {...props} />,
    h3: ({node: _n, ...props}: any) => <h4 className="text-xs font-medium mt-1 mb-0.5" {...props} />,
}), [darkMode, filesContent, handleSectionSelect]);

  return (
    <div className={`h-full flex flex-col rounded-lg shadow-md ${darkMode ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-white text-slate-800 border border-slate-200'}`}>
      <h2 className={`p-3 text-sm font-semibold border-b ${darkMode ? 'border-slate-700' : 'border-slate-600'} flex-shrink-0`}>
        Knowledge Browser
      </h2>
      <div className="overflow-y-auto flex-grow scrollbar-thin">
        {filesContent.map(file => {
          const Icon = file.icon || BookOpen;
          const tabConfig = WIKI_BROWSER_CONFIG.find(c => c.key === file.key);
          const indexSectionForFile = file.parsedDoc ? findSectionById_local(file.parsedDoc.sections, tabConfig?.indexSectionTitleSlug || '') : null;

          return (
            <div key={file.key} className={`border-b ${darkMode ? 'border-slate-700' : 'border-slate-600'}`}>
              <button
                onClick={() => toggleFileOpen(file.key)}
                className={`w-full flex items-center justify-between p-2.5 text-xs font-medium ${darkMode ? 'hover:bg-slate-700/70' : 'hover:bg-slate-50'}`}
              >
                <span className="flex items-center">
                  <Icon size={14} className="mr-1.5 opacity-80 flex-shrink-0" />
                  {file.label}
                </span>
                {file.isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {file.isOpen && (
                <div className={`p-1.5 pl-2 border-t text-xs ${darkMode ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-slate-50/30'}`}>
                  {file.isLoading && <div className="p-2 text-center text-xs"><Loader size={16} className="animate-spin inline-block" /></div>}
                  {file.error && <div className="p-2 text-center text-xs text-red-500"><AlertCircle size={14} className="inline mr-1"/> {file.error}</div>}
                  {file.parsedDoc && (
                    <ul>
                        {file.parsedDoc.documentTitle && ( 
                         <li>
                            <button
                                onClick={() => handleSectionSelect(slugify(file.key), file.key)}
                                className={`w-full text-left py-1 pr-2 text-xs flex items-center font-semibold italic
                                            ${darkMode ? 'hover:bg-slate-700 text-blue-400' : 'hover:bg-slate-100 text-blue-600'}`}
                                style={{ paddingLeft: `0.5rem` }}
                                title={`Overview of ${file.label}`}
                            >
                                {file.parsedDoc.documentTitle} (Overview)
                            </button>
                        </li>
                      )}
                      {indexSectionForFile && indexSectionForFile.content ?
                            <ReactMarkdown components={indexMarkdownComponents} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                {indexSectionForFile.content}
                            </ReactMarkdown>
                          : file.parsedDoc.sections && renderIndexSections(file.parsedDoc.sections.filter(s => s.level > 0), file.key, 0)
                        }
                    </ul>
                  )}
                  {!file.isLoading && !file.error && (!file.parsedDoc || (!indexSectionForFile && (!file.parsedDoc.sections || file.parsedDoc.sections.length === 0))) &&
                     <p className="p-2 text-xs italic text-slate-500">No index or sections found for {file.label}.</p>
                  }
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KnowledgeBrowserSidebar;