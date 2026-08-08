// src/components/WikiView/WikiView.tsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// Ensure ALL icons used in WIKI_CONFIG are imported
import { 
    BookOpen, Loader, AlertCircle, Search, ChevronRight, 
    FlaskConical, Brain, Zap, ArrowLeft, Activity, Target, HelpCircle, ExternalLink, Link2 
} from 'lucide-react';
import { GraphData, NodeObject, ParsedSection } from '../../types';
import { parseMarkdownToStructuredDocument, ParserOutput } from '../../utils/markdownParser';
import WikiContent from './WikiContent';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { humanizeSlugForDisplay, findSectionById_local, flattenSections, findSectionByIdAcrossWikis } from './wikiViewUtils';

interface WikiViewProps {
  data: GraphData;
  darkMode: boolean;
  searchQuery: string;
  onSelectNode: (node: NodeObject, sectionSlug?: string) => void;
  onPaperClick: (citationKey: string) => void;
  selectedNodeId: string | null;
  initialTarget: { fileKey: string, sectionSlug: string } | null;
  onNavComplete: () => void;
}

// WIKI_CONFIG definition remains here as it's specific to WikiView's tabbing structure
const WIKI_CONFIG = [
    { key: 'mechanisms', label: 'Mechanisms', icon: Brain, file: 'KG/mechanisms.md', indexSectionTitleSlug: "index-of-mechanisms"},
    { key: 'materials', label: 'Materials', icon: FlaskConical, file: 'KG/materials.md', indexSectionTitleSlug: "index-of-material-classes-specific-materials"},
    { key: 'methods', label: 'Methods', icon: Zap, file: 'KG/methods.md', indexSectionTitleSlug: "index-of-methods"},
    { key: 'phenomena', label: 'Phenomena', icon: Activity, file: 'KG/phenomena.md', indexSectionTitleSlug: "index-of-phenomena"},
    { key: 'applications', label: 'Applications', icon: Target, file: 'KG/applications.md', indexSectionTitleSlug: "index-of-applications"},
    { key: 'theoretical', label: 'Theory', icon: HelpCircle, file: 'KG/theoretical.md', indexSectionTitleSlug: "index-of-theoretical-concepts"},
];
type WikiTabKey = typeof WIKI_CONFIG[number]['key'];
interface WikiDataState { [key: string]: ParserOutput | null; }

const WikiView: React.FC<WikiViewProps> = ({
  data, darkMode, searchQuery, onSelectNode, onPaperClick, selectedNodeId,
  initialTarget, onNavComplete
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [wikiData, setWikiData] = useState<WikiDataState>({});
    const [activeTabKey, setActiveTabKey] = useState<WikiTabKey>(WIKI_CONFIG[0]?.key || 'mechanisms');
    const [displayState, setDisplayState] = useState<{ mode: 'index' | 'content'; sectionId: string | null }>({ mode: 'index', sectionId: null });
    const isMountedRef = useRef(true);
    const mainContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        isMountedRef.current = true;
        const fetchAllWikis = async () => {
            setLoading(true); setError(null);
            const fetchedData: WikiDataState = {};
            let anyError = false;
            for (const config of WIKI_CONFIG) {
                try {
                    const response = await fetch(config.file.startsWith('/') ? config.file : `/${config.file}`);
                    if (!response.ok) {
                        console.warn(`[WikiView] Failed to fetch ${config.file}: ${response.status}`);
                        fetchedData[config.key] = { sections: [] }; 
                        if (response.status !== 404) anyError = true;
                        continue;
                    }
                    const markdown = await response.text();
                    fetchedData[config.key] = parseMarkdownToStructuredDocument(markdown, config.key);
                } catch (e) {
                    console.error(`[WikiView] Error fetching or parsing ${config.file}:`, e);
                    fetchedData[config.key] = { sections: [] };
                    anyError = true;
                }
            }
            if (isMountedRef.current) {
                setWikiData(fetchedData); setLoading(false);
                if (anyError) setError("Some wiki files could not be loaded. Check console.");
                else setError(null);
            }
        };
        fetchAllWikis();
        return () => { isMountedRef.current = false; };
    }, []);

    const currentTabData = useMemo(() => wikiData[activeTabKey], [wikiData, activeTabKey]);

    const scrollToSection = useCallback((sectionId: string) => {
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element && mainContentRef.current) {
                const contentAreaTop = mainContentRef.current.getBoundingClientRect().top;
                const elementTop = element.getBoundingClientRect().top;
                const scrollTop = mainContentRef.current.scrollTop + (elementTop - contentAreaTop) - 20;
                mainContentRef.current.scrollTo({ top: scrollTop, behavior: 'smooth' });
            }
        }, 150);
    }, []);

    useEffect(() => {
        if (initialTarget && !loading) {
            if (WIKI_CONFIG.some(c => c.key === initialTarget.fileKey)) {
                const tabSwitched = activeTabKey !== initialTarget.fileKey;
                if (tabSwitched) {
                    setActiveTabKey(initialTarget.fileKey as WikiTabKey);
                }
                // The effect below that watches `activeTabKey` and `currentTabData` will handle setting the display state
            }
            onNavComplete(); // Signal completion regardless of whether the tab was switched or section found
        }
    }, [initialTarget, loading, activeTabKey, onNavComplete]);
    
    // Effect to handle display state changes when activeTabKey or currentTabData changes,
    // especially after an initialTarget has set a new activeTabKey.
    useEffect(() => {
        if (initialTarget && initialTarget.fileKey === activeTabKey && currentTabData) {
            const targetSection = findSectionById_local(currentTabData.sections, initialTarget.sectionSlug);
            if (targetSection) {
                if(displayState.mode !== 'content' || displayState.sectionId !== initialTarget.sectionSlug){
                    setDisplayState({ mode: 'content', sectionId: initialTarget.sectionSlug });
                    scrollToSection(initialTarget.sectionSlug);
                }
            } else {
                 if(displayState.mode !== 'index'){
                    setDisplayState({ mode: 'index', sectionId: null });
                 }
            }
        } else if (selectedNodeId && currentTabData) {
            const node = data.nodes.find(n => n.id === selectedNodeId);
            if (node && node.sourceFileKey === activeTabKey && node.sourceWikiSectionId) {
                if (displayState.sectionId !== node.sourceWikiSectionId || displayState.mode !== 'content') {
                    setDisplayState({ mode: 'content', sectionId: node.sourceWikiSectionId });
                    scrollToSection(node.sourceWikiSectionId);
                }
            } else if (node && node.sourceFileKey !== activeTabKey && displayState.mode === 'content') {
                // If a node from another file is selected, current tab should go to index.
                // The tab switch itself is handled by the App.tsx -> GraphVis -> App.tsx selectedNodeId effect
                // that then sets initialTarget for this WikiView.
                // Here we just ensure if the current tab IS NOT the node's source, it shows index.
                // setDisplayState({ mode: 'index', sectionId: null });
            }
        } else if (!initialTarget && !selectedNodeId && displayState.mode === 'content') {
            // If no target and no selection, but we are in content view, switch to index.
            setDisplayState({mode: 'index', sectionId: null});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTabKey, currentTabData, initialTarget, selectedNodeId, data.nodes, scrollToSection]);
    // displayState itself is removed from deps to prevent loops when it's set inside.


    const handleNavigateToSectionById = useCallback((targetNav: string) => {
        let targetFileKey = activeTabKey;
        let targetSectionId = targetNav;

        if (targetNav.includes("::")) {
            const parts = targetNav.split("::");
            targetFileKey = parts[0] as WikiTabKey;
            targetSectionId = parts[1];
        }
        
        const navigate = (tabDataForNav: ParserOutput | null) => {
            if (!tabDataForNav) {
                setDisplayState({ mode: 'index', sectionId: null }); return;
            }
            const section = findSectionById_local(tabDataForNav.sections, targetSectionId);
            if (section) {
                setDisplayState({ mode: 'content', sectionId: section.id });
                scrollToSection(section.id);
            } else {
                const graphNode = data.nodes.find(n => n.id === targetSectionId || (n.sourceFileKey === targetFileKey && n.sourceWikiSectionId === targetSectionId));
                if (graphNode) onSelectNode(graphNode, targetSectionId);
                else setDisplayState({ mode: 'index', sectionId: null }); 
            }
        };

        if (activeTabKey !== targetFileKey && WIKI_CONFIG.some(c => c.key === targetFileKey)) {
            setActiveTabKey(targetFileKey);
            // Navigation will be picked up by the useEffect that watches activeTabKey/currentTabData
            // and initialTarget (if we were to re-set initialTarget, but that's for App->WikiView)
            // For direct inter-tab nav from within WikiView, we can set display state after tab change
            setTimeout(() => navigate(wikiData[targetFileKey]), 50); 
        } else {
            navigate(currentTabData);
        }
    }, [activeTabKey, wikiData, currentTabData, data.nodes, onSelectNode, scrollToSection]);

    const indexSidebarContent = useMemo(() => {
        if (!currentTabData || !currentTabData.sections) return null;
        const tabConfig = WIKI_CONFIG.find(c => c.key === activeTabKey);
        if (!tabConfig) return null;
        const foundSection = findSectionById_local(currentTabData.sections, tabConfig.indexSectionTitleSlug);
        // if (activeTabKey === 'materials' && !foundSection) { /* ... debugging logs from before ... */ }
        return foundSection;
    }, [activeTabKey, currentTabData]);

    const mainPageIntroPreambleContent = useMemo(() => {
        return currentTabData?.preambleContent || "";
    }, [currentTabData]);
    const mainPageDocumentTitle = useMemo(() => {
        return currentTabData?.documentTitle || WIKI_CONFIG.find(c=>c.key===activeTabKey)?.label || "Knowledge Base";
    }, [currentTabData, activeTabKey]);

    const sectionToDisplay = useMemo(() => {
      if (displayState.mode === 'content' && displayState.sectionId && currentTabData) {
        return findSectionById_local(currentTabData.sections, displayState.sectionId);
      }
      return null;
    }, [displayState, currentTabData]);

    const searchResults = useMemo(() => {
        if (!searchQuery.trim() || loading) return [];
        const lowerQuery = searchQuery.toLowerCase();
        const results: Array<ParsedSection & {fileLabel: string}> = [];
        WIKI_CONFIG.forEach(config => {
            const tabOutput = wikiData[config.key];
            if (tabOutput) {
                const fileLabel = WIKI_CONFIG.find(c => c.key === config.key)?.label || config.key;
                if (tabOutput.documentTitle?.toLowerCase().includes(lowerQuery) || tabOutput.preambleContent?.toLowerCase().includes(lowerQuery)) {
                    results.push({
                        id: `${config.key}-introduction-preamble`, 
                        title: tabOutput.documentTitle || config.label,
                        content: tabOutput.preambleContent || "",
                        level: 0, 
                        sourceFileKey: config.key,
                        fileLabel: fileLabel,
                        subsections: [], // Preamble has no subsections in this context
                    });
                }
                flattenSections(tabOutput.sections).forEach(section => {
                    if (section.title.toLowerCase().includes(lowerQuery) || section.content?.toLowerCase().includes(lowerQuery)) {
                        results.push({...section, fileLabel: fileLabel});
                    }
                });
            }
        });
        return results;
    }, [searchQuery, wikiData, loading]);

    const indexMarkdownComponents = {
        a: ({node: _n, href, children, ...props}: any) => {
            const linkText = React.Children.toArray(children).join('');
            const displayTitle = humanizeSlugForDisplay(linkText); 
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                return (
                    <button {...props} onClick={() => handleNavigateToSectionById(targetId)}
                        className={`wiki-index-link text-left w-full block py-1 px-1.5 focus:outline-none rounded-sm ${darkMode ? 'text-slate-300 hover:text-blue-300 hover:bg-slate-700' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'} font-normal text-sm leading-snug`} >
                        {displayTitle}
                    </button>
                );
            }
            return ( <a href={href} {...props} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center ${darkMode ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700'} hover:underline text-sm`}> {displayTitle} <ExternalLink size={12} className="ml-1 opacity-70"/></a> ); 
        },
        ul: ({node: _n,ordered, className, children, ...props}: any) => <ul className={`wiki-index-ul ${ordered ? 'list-decimal' : ''} ${className || ''} pl-3 space-y-0.5`} {...props}>{children}</ul>,
        li: ({node: _n,children, className, ...props}: any) => <li className={`wiki-index-li ${className|| ''}`} {...props}>{children}</li>,
        p: ({node: _n, children, className, ...props}:any) => <span className={`block ${className || ''}`}>{children}</span>, 
        h1: ({node: _n, ...props}: any) => <h1 className="text-sm font-semibold mt-1 mb-0.5" {...props} />,
        h2: ({node: _n, ...props}: any) => <h2 className="text-sm font-medium mt-1 mb-0.5" {...props} />,
        h3: ({node: _n, ...props}: any) => <h3 className="text-xs font-medium mt-1 mb-0.5" {...props} />,
    };

  return (
    <div className={`h-full flex flex-col overflow-hidden ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-lg shadow-md`}>
        <div className={`flex-shrink-0 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex space-x-1 px-2 pt-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-slate-500/50 scrollbar-track-transparent">
                 {WIKI_CONFIG.map(config => {
                     const Icon = config.icon;
                     return (
                        <button key={config.key} onClick={() => { setActiveTabKey(config.key as WikiTabKey); setDisplayState({ mode: 'index', sectionId: null }); }}
                            className={`pb-2 pt-1 px-3 text-sm font-medium flex items-center space-x-1.5 border-b-2 transition-colors ${ activeTabKey === config.key ? (darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600') : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-200 hover:border-gray-500' : 'text-gray-500 hover:text-gray-700 hover:border-gray-400'}` }`}
                            title={config.label} > <Icon size={14}/> <span>{config.label}</span> </button>
                     );
                 })}
            </div>
        </div>

      <div className="flex flex-grow overflow-hidden">
          {!searchQuery && !loading && !error && currentTabData && (
              <div className={`w-60 md:w-72 flex-shrink-0 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} h-full overflow-y-auto p-3 md:p-4 flex flex-col wiki-index-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
                   <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider text-gray-500 dark:text-gray-400 flex-shrink-0"> {WIKI_CONFIG.find(c => c.key === activeTabKey)?.label || activeTabKey} Index </h3>
                   <div className={`flex-grow overflow-y-auto text-sm `}>
                       {indexSidebarContent && indexSidebarContent.content ? (
                           <ReactMarkdown components={indexMarkdownComponents} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                               {indexSidebarContent.content}
                           </ReactMarkdown>
                       ) : ( <p className="text-xs text-gray-500 italic mt-2"> Index for '{WIKI_CONFIG.find(c=>c.key===activeTabKey)?.label}' not found or empty. </p> )}
                       {(!indexSidebarContent || !indexSidebarContent.content) && currentTabData && currentTabData.sections && currentTabData.sections.filter(s => s.level > 0).length > 0 && (
                           <ul className="mt-2 space-y-1 wiki-index-ul">
                               {currentTabData.sections.filter(s => s.level <= 2 && s.level > 0).map(section => ( 
                                   <li key={section.id} className="wiki-index-li">
                                       <button onClick={() => handleNavigateToSectionById(section.id)}
                                            className={`wiki-index-link text-left w-full block py-1 px-1.5 focus:outline-none rounded-sm ${darkMode ? 'text-slate-300 hover:text-blue-300 hover:bg-slate-700' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'} font-normal text-sm leading-snug ${section.level ===1 ? 'font-medium' : ''}`}>
                                           {section.title}
                                       </button>
                                   </li>
                               ))}
                           </ul>
                       )}
                   </div>
              </div>
          )}

          <div ref={mainContentRef} className="flex-grow overflow-y-auto p-4 md:p-6 relative scrollbar-thin scrollbar-thumb-slate-400/50 dark:scrollbar-thumb-slate-600/50 scrollbar-track-transparent">
            {displayState.mode === 'content' && !searchQuery && sectionToDisplay && ( <button onClick={() => setDisplayState({ mode: 'index', sectionId: null })} className={`absolute top-3 right-3 z-10 p-1.5 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-300 text-gray-600'}`} title="Back to Index" > <ArrowLeft size={16} /> </button> )}
            {loading && ( <div className="flex flex-col items-center justify-center h-full text-center"> <Loader className="w-8 h-8 animate-spin text-blue-500 mb-2" /> <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading Wiki Content...</span> </div> )}
            {error && !loading && ( <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-800/30 text-red-400' : 'bg-red-100 text-red-700'} flex flex-col items-center justify-center text-center h-full`}> <AlertCircle className="w-10 h-10 mb-3 flex-shrink-0" /> <p className="text-lg font-semibold mb-1">Content Load Error</p> <span className="text-sm">{error}</span> </div> )}

            {!loading && !error && (
                 searchQuery ? ( 
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4"> <h2 className="text-2xl font-bold flex items-center"> <Search size={20} className="mr-2" /> Results for "{searchQuery}" </h2> <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}> {searchResults.length} matches </span> </div> {searchResults.length > 0 ? ( <div className="space-y-3"> {searchResults.map(section => ( <button key={section.id + '-searchresult' + section.sourceFileKey} onClick={() => { handleNavigateToSectionById(`${section.sourceFileKey}::${section.id}`) }} className={`w-full text-left p-3 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`} > <h4 className="text-md font-semibold text-blue-500 dark:text-blue-400 hover:underline">{section.title}</h4> {section.sourceFileKey && section.sourceFileKey !== activeTabKey && ( <p className="text-xs text-gray-500 dark:text-gray-400">In: {section.fileLabel}</p> )} <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm leading-snug`}> {section.content?.split('\n')[0]?.substring(0, 150)}...</p> </button> ))} </div> ) : ( <div className={`p-8 text-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}> <p className="text-lg">No matches for "{searchQuery}"</p> </div> )} 
                    </div>
                 ) : displayState.mode === 'index' ? (
                    <div className="wiki-preamble-content">
                        <h1 className={`text-2xl font-bold mb-4 border-b pb-2 ${darkMode ? 'border-slate-700' : 'border-slate-300'}`}>
                            {mainPageDocumentTitle}
                        </h1>
                        {mainPageIntroPreambleContent ? (
                            <WikiContent
                                key={`${activeTabKey}-preamble-display`}
                                darkMode={darkMode}
                                section={{ 
                                    id: `${activeTabKey}-introduction-preamble-display`,
                                    title: "Introduction", 
                                    content: mainPageIntroPreambleContent, // Already preprocessed by parser stage if needed
                                    level: 1, 
                                    subsections: [],
                                    sourceFileKey: activeTabKey,
                                }}
                                cnmNodes={data.nodes}
                                onSelectNode={onSelectNode}
                                onPaperClick={onPaperClick}
                                activeSectionId={null} 
                                onNavigateToSection={handleNavigateToSectionById}
                            />
                        ) : (
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm py-4`}>
                                Select an item from the index. No specific introductory content found for this topic.
                            </p>
                        )}
                    </div>
                 ) : sectionToDisplay ? (
                    <WikiContent
                        key={sectionToDisplay.id + activeTabKey}
                        darkMode={darkMode}
                        section={sectionToDisplay}
                        cnmNodes={data.nodes}
                        onSelectNode={onSelectNode}
                        onPaperClick={onPaperClick}
                        activeSectionId={displayState.sectionId}
                        onNavigateToSection={handleNavigateToSectionById}
                    />
                 ) : ( <p className="italic pt-8 text-center text-gray-500">Section content not found for '{displayState.sectionId}'.</p> )
            )}
          </div>
      </div>
    </div>
  );
};

export default WikiView;