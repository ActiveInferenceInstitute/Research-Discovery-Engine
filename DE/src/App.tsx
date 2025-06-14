// src/App.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sun, Moon, Search, Lightbulb, Compass, Layers, Upload, AlertCircle, Loader, Menu, X as CloseIcon, Brain, FlaskConical, Zap, Activity, Target, HelpCircle, BookOpen } from 'lucide-react';
import Navbar from './components/Navbar';
import GraphVisualization from './components/GraphVisualization/GraphVisualization';
import GraphControls from './components/GraphVisualization/GraphControls';
import ConceptDesigner from './components/ConceptDesigner/ConceptDesigner';
import AgentConsole from './components/AgentConsole/AgentConsole';
import PDFUploader from './components/Modals/PDFUploader';
import ContextPanel from './components/ContextPanel/ContextPanel';
import KnowledgeBrowserSidebar from './components/KnowledgeBrowserSidebar';
import BreadcrumbPanel from './components/BreadcrumbPanel';
import { useAgent } from './contexts/AgentContext';

import { GraphData, NodeObject, AgentMessage, ConceptDesignState, LinkObject, BreadcrumbItem } from './types';
import { useGraphData } from './hooks/useGraphData';
import { useConceptDesign } from './hooks/useConceptDesign';
import { cloneDeep } from 'lodash';
import { slugify } from './utils/markdownParser';
import { AgentOperationType } from './types/api.types';

export const WIKI_BROWSER_CONFIG = [
    { key: 'mechanisms', label: 'Mechanisms', icon: Brain, file: 'KG/mechanisms.md', indexSectionTitleSlug: "index-of-mechanisms"},
    { key: 'materials', label: 'Materials', icon: FlaskConical, file: 'KG/materials.md', indexSectionTitleSlug: "index-of-material-classes-specific-materials"},
    { key: 'methods', label: 'Methods', icon: Zap, file: 'KG/methods.md', indexSectionTitleSlug: "index-of-methods"},
    { key: 'phenomena', label: 'Phenomena', icon: Activity, file: 'KG/phenomena.md', indexSectionTitleSlug: "index-of-phenomena"},
    { key: 'applications', label: 'Applications', icon: Target, file: 'KG/applications.md', indexSectionTitleSlug: "index-of-applications"},
    { key: 'theoretical', label: 'Theory', icon: HelpCircle, file: 'KG/theoretical.md', indexSectionTitleSlug: "index-of-theoretical-concepts"},
    { key: 'css', label: 'Schema (CSS)', icon: BookOpen, file: 'KG/css.md', indexSectionTitleSlug: "conceptual-nexus-model-cnm-core-schema-specification-css"},
    { key: 'process', label: 'Discovery Process', icon: Layers, file: 'process.md', indexSectionTitleSlug: "discovery-engine-process-for-creating-new-knowledge-system-protocol"},
];


function App() {
  const [darkMode, setDarkMode] = useState(true);
  const { graphData, loading: graphLoading, error: graphError, setGraphData } = useGraphData();
  const { messages, executeOperation } = useAgent();

  const [activeMode, setActiveMode] = useState<'explore' | 'create'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbItem[]>([]);

  const {
    conceptDesignState, initializeConcept, updateObjective, updateComponentSelection,
    updateCssField, addFieldSuggestions, clearFieldSuggestions, setConceptDesignState
  } = useConceptDesign();

  const [showLabels, setShowLabels] = useState(true);
  const [showLinks, setShowLinks] = useState(true);
  const [enablePhysics, setEnablePhysics] = useState(true);
  const [showParticles, setShowParticles] = useState(false);
  const [showPDFUploader, setShowPDFUploader] = useState(false);
  const [isBrowserSidebarOpen, setIsBrowserSidebarOpen] = useState(true);

  const [lastFilterCounts, setLastFilterCounts] = useState<{nodes: number, links: number} | null>(null);
  const [pendingSearchFilterCounts, setPendingSearchFilterCounts] = useState<{nodes: number, links: number} | null>(null);

  const handleTriggerAgent = useCallback((action: string, payload?: any) => {
    executeOperation(action as AgentOperationType, payload);
  }, [executeOperation]);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleTriggerAgent('search-graph', { query: searchQuery });
    }
  }, [searchQuery, handleTriggerAgent]);

  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleNodeSelect = useCallback((node: NodeObject | null) => {
    if (node) {
      setSelectedNodeId(node.id);
      setBreadcrumbPath(prev => [...prev, { id: node.id, label: node.label || node.id }]);
    } else {
      setSelectedNodeId(null);
      setBreadcrumbPath([]);
    }
  }, []);

  const handleBreadcrumbNavigate = useCallback((nodeId: string) => {
    const nodeIndex = breadcrumbPath.findIndex(item => item.id === nodeId);
    if (nodeIndex !== -1) {
      setBreadcrumbPath(breadcrumbPath.slice(0, nodeIndex + 1));
      const node = graphData.nodes.find(n => n.id === nodeId);
      if (node) {
        setSelectedNodeId(nodeId);
      }
    }
  }, [breadcrumbPath, graphData.nodes]);

  const handleSetExploreMode = useCallback(() => {
    setActiveMode('explore');
    setSelectedNodeId(null);
    setBreadcrumbPath([]);
  }, []);

  const handleSetCreateMode = useCallback((nodeId: string | null) => {
    setActiveMode('create');
    if (nodeId) {
      const seedNode = graphData.nodes.find(n => n.id === nodeId);
      initializeConcept(seedNode);
    } else {
      initializeConcept();
    }
    setSelectedNodeId(null);
    setBreadcrumbPath([]);
  }, [graphData.nodes, initializeConcept]);

  const handleSearchFilterComplete = useCallback((nodeCount: number, linkCount: number) => {
    setPendingSearchFilterCounts({ nodes: nodeCount, links: linkCount });
  }, []);

  const handleNavigateToNodeViewTarget = useCallback((nodeId: string, target: string) => {
    // Implementation for navigating to specific sections in node view
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const isContextPanelVisible = useMemo(() => {
    return selectedNodeId !== null || activeMode === 'create';
  }, [selectedNodeId, activeMode]);

  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex flex-col flex-grow overflow-hidden container mx-auto px-2 sm:px-4 py-4 space-y-2">
        <div className="flex flex-wrap items-center justify-between mb-2 flex-shrink-0 gap-y-2 gap-x-4">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap gap-y-2">
            <button onClick={() => setIsBrowserSidebarOpen(!isBrowserSidebarOpen)} title="Toggle Knowledge Browser" className={`p-2 rounded-lg flex items-center space-x-1 sm:space-x-2 text-sm ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}>
              {isBrowserSidebarOpen ? <CloseIcon size={18} /> : <Menu size={18} />}
              <span className="hidden xl:inline">Browse</span>
            </button>
            <button onClick={handleSetExploreMode} title="Explore Knowledge Graph" className={`p-2 rounded-lg flex items-center space-x-1 sm:space-x-2 text-sm ${activeMode === 'explore' ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : (darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300')}`}>
              <Compass size={18} />
              <span className="hidden sm:inline">Explore</span>
            </button>
            <button onClick={() => handleSetCreateMode(null)} title="Create New Concept" className={`p-2 rounded-lg flex items-center space-x-1 sm:space-x-2 text-sm ${activeMode === 'create' ? (darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white') : (darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300')}`}>
              <Lightbulb size={18} />
              <span className="hidden sm:inline">Create</span>
            </button>
          </div>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input type="search" placeholder="Search graph..." className={`pl-10 pr-4 py-2 rounded-full w-48 sm:w-64 text-sm focus:outline-none focus:ring-2 ${darkMode ? 'bg-slate-800 text-white focus:ring-blue-500' : 'bg-slate-100 text-slate-900 focus:ring-blue-400'}`} value={searchQuery} onChange={handleSearchInputChange} />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          </form>
          <button onClick={() => setShowPDFUploader(true)} className={`p-2 rounded-lg flex items-center space-x-1 sm:space-x-2 text-sm ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`} title="Upload File">
            <Upload size={18} />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>
        
        {activeMode === 'explore' && breadcrumbPath.length > 0 && (
          <BreadcrumbPanel darkMode={darkMode} path={breadcrumbPath} onNavigate={handleBreadcrumbNavigate} />
        )}

        <div className="flex flex-grow overflow-hidden gap-4">
          {isBrowserSidebarOpen && activeMode === 'explore' && (
            <div className="w-60 md:w-72 flex-shrink-0 h-full overflow-hidden">
              <KnowledgeBrowserSidebar
                darkMode={darkMode}
                onSelectNode={handleNodeSelect}
                graphData={graphData}
              />
            </div>
          )}

          <div className="w-64 md:w-72 xl:w-80 flex-shrink-0 h-full overflow-hidden">
            <AgentConsole
              darkMode={darkMode}
              cnmData={graphData}
              activeMode={activeMode}
              conceptDesignState={conceptDesignState}
              selectedNodeId={selectedNodeId}
              onSelectNode={handleNodeSelect}
            />
          </div>

          <div className="flex-grow h-full overflow-hidden">
            {graphLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Loader className="w-10 h-10 animate-spin text-blue-500 mb-3" />
                Loading Knowledge Graph...
              </div>
            ) : graphError ? (
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-700'} flex flex-col items-center justify-center h-full text-center`}>
                <AlertCircle className="w-12 h-12 mb-3" />
                Graph Load Error: {graphError}
              </div>
            ) : activeMode === 'explore' ? (
              <div className="relative rounded-lg overflow-hidden flex-grow">
                <GraphVisualization
                  data={graphData}
                  darkMode={darkMode}
                  searchQuery={searchQuery}
                  onNodeSelect={handleNodeSelect}
                  showLabels={showLabels}
                  showLinks={showLinks}
                  enablePhysics={enablePhysics}
                  showParticles={showParticles}
                  selectedNodeId={selectedNodeId}
                  conceptDesignState={conceptDesignState}
                  onFilterComplete={handleSearchFilterComplete}
                />
                <GraphControls
                  darkMode={darkMode}
                  showLabels={showLabels}
                  showLinks={showLinks}
                  enablePhysics={enablePhysics}
                  showParticles={showParticles}
                  onToggleLabels={() => setShowLabels(!showLabels)}
                  onToggleLinks={() => setShowLinks(!showLinks)}
                  onTogglePhysics={() => setEnablePhysics(!enablePhysics)}
                  onToggleParticles={() => setShowParticles(!showParticles)}
                />
              </div>
            ) : (
              <div className="h-full overflow-hidden rounded-lg">
                <ConceptDesigner
                  darkMode={darkMode}
                  designState={conceptDesignState}
                  graphData={graphData}
                  onUpdateObjective={updateObjective}
                  onUpdateComponentSelection={updateComponentSelection}
                  onUpdateCssField={updateCssField}
                  onAcceptSuggestion={(fp, val) => handleTriggerAgent('accept-suggestion', { field: fp, value: val })}
                  onTriggerAgent={handleTriggerAgent}
                  agentMessages={messages}
                />
              </div>
            )}
          </div>

          {isContextPanelVisible && (
            <div className="w-80 xl:w-96 flex-shrink-0 h-full overflow-hidden">
              <ContextPanel
                darkMode={darkMode}
                activeMode={activeMode}
                selectedNodeId={selectedNodeId}
                conceptDesignState={conceptDesignState}
                graphData={graphData}
                onSelectNode={handleNodeSelect}
                onStartDesign={(nodeId) => handleTriggerAgent('initiate-new-concept-from-selection', { nodeId })}
                onTriggerAgent={handleTriggerAgent}
                onNavigateToWikiSection={handleNavigateToNodeViewTarget}
              />
            </div>
          )}
        </div>
      </div>
      {showPDFUploader && (
        <PDFUploader
          darkMode={darkMode}
          onClose={() => setShowPDFUploader(false)}
          onFileProcessed={(parsedData) => handleTriggerAgent('integrate-data', parsedData)}
          onTriggerAgent={handleTriggerAgent}
        />
      )}
    </div>
  );
}

export default App;