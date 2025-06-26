// src/utils/markdownLinkRenderer.tsx
import React from 'react';
import { ExternalLink, FileText, Link2, BookOpen } from 'lucide-react';
import { NodeObject } from '../types';
import { slugify } from './markdownParser';

interface LinkRendererSharedProps {
  darkMode: boolean;
  allNodes: NodeObject[];
  onSelectNode: (node: NodeObject, sectionSlug?: string) => void;
  onPaperClick: (citationKey: string) => void;
  onNavigateToWikiSection?: (targetNav: string) => void;
  onNavigateToNodeViewSection?: (sectionSlug: string) => void;
  currentFileKey?: string;
}

export const createMarkdownLinkRenderer = (rendererProps: LinkRendererSharedProps) =>
  ({ node: _n, href, children, ...props }: any): JSX.Element => {
    const {
        darkMode, allNodes, onSelectNode, onPaperClick,
        onNavigateToWikiSection, onNavigateToNodeViewSection, currentFileKey
    } = rendererProps;

    if (!href) return <span {...props}>{children}</span>;
    const linkText = React.Children.toArray(children).join('');

    if (href.startsWith('#CITATION__')) {
        const refKey = href.substring(11);
        return (
            <button
                className={`font-mono text-sm px-2.5 py-1.5 rounded-md mx-0.5 inline-flex items-center group transition-colors
                            ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-teal-300 hover:text-teal-200'
                                      : 'bg-slate-200 hover:bg-slate-300 text-teal-700 hover:text-teal-600'}`}
                onClick={() => onPaperClick(refKey)} 
                title={`Open publication source: ${refKey}.md`} 
                {...props} >
                <FileText size={14} className="mr-2 flex-shrink-0" />
                <span className="group-hover:underline font-medium">{linkText || refKey}</span>
                <ExternalLink size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
        );
    }
    if (href.startsWith('##WIKI_NAV__')) {
        const parts = href.substring(13).split('__');
        const targetFileKey = parts[0];
        const targetSectionSlug = parts[1]; // This should be a slug from preprocessing
        const targetGraphNode = allNodes.find(n => n.sourceFileKey === targetFileKey && n.id === targetSectionSlug);

        if (targetGraphNode) {
            return ( <button onClick={() => onSelectNode(targetGraphNode, targetSectionSlug)} className={`text-sm font-medium inline-flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} hover:underline`} title={`View node: ${targetGraphNode.label || targetGraphNode.id}`} {...props} > <Link2 size={12} className="mr-0.5" /> {children} </button> );
        } else if (onNavigateToWikiSection) { // Primarily for WikiContent calling this renderer
            const navTarget = (targetFileKey === 'SELF' || targetFileKey === currentFileKey) ? targetSectionSlug : `${targetFileKey}::${targetSectionSlug}`;
            return ( <button onClick={(e) => { e.preventDefault(); onNavigateToWikiSection(navTarget); }} className={`text-sm font-medium inline-flex items-center ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'} hover:underline`} title={`Navigate to: ${targetFileKey || 'current file'}${targetSectionSlug ? '#'+targetSectionSlug : ''}`} {...props} > <BookOpen size={12} className="mr-0.5" />{children}</button>);
        }
        // Fallback if no specific handler and not a graph node
        return <span className="text-orange-400 italic text-sm" title={`Wiki link target not found: ${targetFileKey}#${targetSectionSlug}`} {...props}>{children}</span>;
    }
    if (href.startsWith('#NODE__')) {
        const targetNodeId = href.substring(7);
        const targetNode = allNodes.find(n => n.id === targetNodeId);
        if (targetNode) return ( <button onClick={() => onSelectNode(targetNode)} className={`text-sm font-medium inline-flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} hover:underline`} title={`View node: ${targetNode.label || targetNode.id}`} {...props} > <Link2 size={12} className="mr-0.5" /> {children} </button> );
    }
    if (href.startsWith('#INTRA_NODE__') && onNavigateToNodeViewSection) {
        const targetId = href.substring(13);
        return ( <a href={`#${targetId}`} onClick={(e) => { e.preventDefault(); onNavigateToNodeViewSection(targetId); }} className={`text-sm ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} hover:underline`} {...props}> {children} (section) </a> );
    }
    if (href.startsWith('#') && !href.startsWith('#BROKEN_LINK__')) {
        const targetId = href.substring(1);
        if (onNavigateToNodeViewSection) { // If in NodeView, assume intra-page scroll
            return ( <a href={href} onClick={(e) => {e.preventDefault(); onNavigateToNodeViewSection(targetId);}} className={`text-sm ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} hover:underline`} {...props}> {children}</a> );
        } else if (onNavigateToWikiSection) { // If in WikiContent, assume intra-page scroll
            return ( <a href={href} onClick={(e) => {e.preventDefault(); onNavigateToWikiSection(targetId);}} className={`text-sm ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} hover:underline`} {...props}> {children}</a> );
        }
        return ( <a href={href} className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'} underline`} {...props}> {children} (raw anchor) </a> );
    }
    if (href.startsWith('http') || href.startsWith('mailto')) {
        return ( <a href={href} target="_blank" rel="noopener noreferrer" className={`text-sm inline-flex items-center group ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'} hover:underline`} {...props} > {children} <ExternalLink size={12} className="ml-0.5 opacity-60 group-hover:opacity-100" /> </a> );
    }
    const brokenLinkTarget = href.startsWith("#BROKEN_LINK__") ? href.substring(14) : href;
    return <span className="text-red-400 dark:text-red-500 italic text-sm" title={`Could not resolve link: ${brokenLinkTarget}`} {...props}>{children}</span>;
};