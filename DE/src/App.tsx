/**
 * Main Application Component - Discovery Engine (Refactored)
 * 
 * This is the completely refactored root component that uses centralized state management
 * through the useAppState hook, dramatically reducing complexity and improving maintainability.
 */

import React, { useCallback, useState } from 'react';
import { AlertCircle, Loader, Search, Lightbulb, Compass, Layers, Upload, Menu, X as CloseIcon, Brain, FlaskConical, Zap, Activity, Target, HelpCircle, BookOpen } from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import GraphVisualization from './components/GraphVisualization/GraphVisualization';
import GraphControls from './components/GraphVisualization/GraphControls';
import ConceptDesigner from './components/ConceptDesigner/ConceptDesigner';
import AgentConsole from './components/AgentConsole/AgentConsole';
import PDFUploader from './components/Modals/PDFUploader';
import ContextPanel from './components/ContextPanel/ContextPanel';
import KnowledgeBrowserSidebar from './components/KnowledgeBrowserSidebar';
import BreadcrumbPanel from './components/BreadcrumbPanel';
import ErrorBoundary from './components/ErrorBoundary';
import LLMResultModal from './components/Modals/LLMResultModal';

// Hooks and utilities
import { useAppState } from './hooks/useAppState';
import { slugify } from './utils/markdownParser';

/**
 * Configuration for the knowledge browser sidebar
 */
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

/**
 * Main App Component using centralized state management
 */
function App() {
  // Centralized state management through useAppState hook
  const {
    state,
    actions,
    graphData,
    graphLoading,
    graphError,
    conceptDesignState,
    updateObjective,
    updateComponentSelection,
    updateCssField,
    isContextPanelVisible,
    llmResultModalState
  } = useAppState();

  // Add new state for graph visualization controls
  const [graphColorBy, setGraphColorBy] = useState<'type' | 'group' | 'status' | 'origin' | 'custom'>('type');
  const [graphGroupBy, setGraphGroupBy] = useState<'none' | 'type' | 'status' | 'origin' | 'connections' | 'cluster'>('none');

  /**
   * Handle navigation to wiki section from NodeView links
   */
  const handleNavigateToNodeViewTarget = useCallback((fileKey: string, sectionSlug: string) => {
    const targetNode = graphData.nodes.find(n => n.sourceFileKey === fileKey && n.id === sectionSlug);
    if (targetNode) {
      actions.handleNodeSelect(targetNode, sectionSlug);
      if (state.activeMode === 'create') actions.setActiveMode('explore');
    } else {
      const overviewNodeId = slugify(fileKey);
      const overviewNode = graphData.nodes.find(n => n.id === overviewNodeId && n.sourceFileKey === fileKey);
      if (overviewNode) {
        actions.handleNodeSelect(overviewNode);
        if (state.activeMode === 'create') actions.setActiveMode('explore');
      } else {
        actions.addAgentMessage({
          type: 'warning',
          sourceAgent: "Navigation",
          content: `NodeView target not found: ${fileKey}#${sectionSlug}`
        });
      }
    }
  }, [graphData.nodes, actions, state.activeMode]);

  return (
    <ErrorBoundary componentName="App">
      <div className={`h-screen flex flex-col transition-colors duration-300 ${
        state.darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        
        {/* Navigation Bar */}
        <ErrorBoundary componentName="Navbar">
          <Navbar 
            darkMode={state.darkMode} 
            toggleDarkMode={actions.toggleDarkMode} 
          />
        </ErrorBoundary>

        {/* Main Content Container */}
        <div className="flex flex-col flex-grow overflow-hidden container mx-auto px-2 sm:px-4 py-4 space-y-2">
          
          {/* Top Controls */}
          <div className="flex flex-wrap items-center justify-between mb-2 flex-shrink-0 gap-y-2 gap-x-4">
            {/* Left Controls */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap gap-y-2">
              <button 
                onClick={actions.toggleBrowserSidebar} 
                title="Toggle Knowledge Browser" 
                className={`p-2 rounded-lg flex items-center space-x-1 sm:space-x-2 text-sm ${
                  state.darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                }`}
              >
                {state.isBrowserSidebarOpen ? <CloseIcon size={18} /> : <Menu size={18} />}
                <span className="hidden xl:inline">Browse</span>
              </button>
              
              <button 
                onClick={actions.handleSetExploreMode} 
                title="Explore Knowledge Graph" 
                className={`p-2 rounded-lg flex items-center space-x-1 sm:space-x-2 text-sm ${
                  state.activeMode === 'explore' 
                    ? (state.darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                    : (state.darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300')
                }`}
              >
                <Compass size={18} />
                <span className="hidden sm:inline">Explore</span>
              </button>
              
              <button 
                onClick={() => actions.handleSetCreateMode(null)} 
                title="Create New Concept" 
                className={`p-2 rounded-lg flex items-center space-x-1 sm:space-x-2 text-sm ${
                  state.activeMode === 'create'
                    ? (state.darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white')
                    : (state.darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300')
                }`}
              >
                <Lightbulb size={18} />
                <span className="hidden sm:inline">Create</span>
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2 flex-wrap">
              <form onSubmit={actions.handleSearchSubmit} className="relative">
                <input 
                  type="search" 
                  placeholder="Search graph..." 
                  className={`pl-10 pr-4 py-2 rounded-full w-48 sm:w-64 text-sm focus:outline-none focus:ring-2 ${
                    state.darkMode 
                      ? 'bg-slate-800 text-white focus:ring-blue-500' 
                      : 'bg-slate-100 text-slate-900 focus:ring-blue-400'
                  }`}
                  value={state.searchQuery} 
                  onChange={actions.handleSearchInputChange} 
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </form>
              
              <button 
                onClick={actions.togglePDFUploader} 
                className={`p-2 rounded-lg flex items-center space-x-1 sm:space-x-2 text-sm ${
                  state.darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'
                }`}
                title="Upload File"
              >
                <Upload size={18} />
                <span className="hidden sm:inline">Upload</span>
              </button>
            </div>
          </div>
          
          {/* Breadcrumb Panel */}
          {state.activeMode === 'explore' && state.breadcrumbPath.length > 0 && (
            <ErrorBoundary componentName="BreadcrumbPanel">
              <BreadcrumbPanel 
                darkMode={state.darkMode} 
                path={state.breadcrumbPath} 
                onNavigate={actions.handleBreadcrumbNavigate} 
              />
            </ErrorBoundary>
          )}

          {/* Main Content Area */}
          <div className="flex flex-1 space-x-4 overflow-hidden">
            
            {/* Browser Sidebar */}
            {state.isBrowserSidebarOpen && state.activeMode === 'explore' && (
              <div className="w-60 md:w-72 flex-shrink-0 h-full overflow-hidden">
                <ErrorBoundary componentName="KnowledgeBrowserSidebar">
                  <KnowledgeBrowserSidebar
                    darkMode={state.darkMode}
                    onSelectNode={actions.handleNodeSelect}
                    graphData={graphData}
                  />
                </ErrorBoundary>
              </div>
            )}

            {/* Agent Console */}
            <div className="w-64 md:w-72 xl:w-80 flex-shrink-0 h-full overflow-hidden">
              <ErrorBoundary componentName="AgentConsole">
                <AgentConsole 
                  darkMode={state.darkMode} 
                  messages={state.agentMessages} 
                  cnmData={graphData} 
                  activeMode={state.activeMode} 
                  conceptDesignState={conceptDesignState} 
                  selectedNodeId={state.selectedNodeId} 
                  onTriggerAgent={actions.triggerAgent} 
                  onSelectNode={actions.handleNodeSelect} 
                />
              </ErrorBoundary>
            </div>

            {/* Main Graph/Content Area */}
            <div className="flex-grow relative h-full overflow-hidden flex flex-col">
              <ErrorBoundary componentName="MainContent">
                {graphLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Loader className="w-10 h-10 animate-spin text-blue-500 mb-3" />
                    Loading Knowledge Graph...
                  </div>
                ) : graphError ? (
                  <div className={`p-6 rounded-lg ${
                    state.darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-700'
                  } flex flex-col items-center justify-center h-full text-center`}>
                    <AlertCircle className="w-12 h-12 mb-3"/>
                    Graph Load Error: {graphError}
                  </div>
                ) : state.activeMode === 'explore' ? (
                  <div className="relative rounded-lg overflow-hidden flex-grow">
                    <GraphVisualization
                      data={graphData} 
                      darkMode={state.darkMode} 
                      searchQuery={state.searchQuery}
                      onNodeSelect={actions.handleNodeSelect} 
                      showLabels={state.showLabels}
                      showLinks={state.showLinks} 
                      enablePhysics={state.enablePhysics}
                      showParticles={state.showParticles} 
                      selectedNodeId={state.selectedNodeId}
                      conceptDesignState={conceptDesignState}
                      onFilterComplete={actions.handleSearchFilterComplete}
                      colorBy={graphColorBy}
                      groupBy={graphGroupBy}
                    />
                    <GraphControls 
                      darkMode={state.darkMode} 
                      showLabels={state.showLabels} 
                      showLinks={state.showLinks} 
                      enablePhysics={state.enablePhysics} 
                      showParticles={state.showParticles} 
                      onToggleLabels={actions.toggleLabels}
                      onToggleLinks={actions.toggleLinks}
                      onTogglePhysics={actions.togglePhysics}
                      onToggleParticles={actions.toggleParticles}
                      colorBy={graphColorBy}
                      onChangeColorBy={(value) => setGraphColorBy(value as any)}
                      groupBy={graphGroupBy}
                      onChangeGroupBy={(value) => setGraphGroupBy(value as any)}
                    />
                  </div>
                ) : (
                  <div className="h-full overflow-hidden rounded-lg">
                    <ConceptDesigner
                      darkMode={state.darkMode} 
                      designState={conceptDesignState} 
                      graphData={graphData}
                      onUpdateObjective={updateObjective}
                      onUpdateComponentSelection={updateComponentSelection}
                      onUpdateCssField={updateCssField}
                      onAcceptSuggestion={(fp, val) => actions.triggerAgent('accept-suggestion', {field: fp, value: val})}
                      onTriggerAgent={actions.triggerAgent}
                      agentMessages={state.agentMessages}
                    />
                  </div>
                )}
              </ErrorBoundary>
            </div>

            {/* Context Panel */}
            {isContextPanelVisible && (
              <div className="w-80 xl:w-96 flex-shrink-0 h-full overflow-hidden">
                <ErrorBoundary componentName="ContextPanel">
                  <ContextPanel
                    darkMode={state.darkMode} 
                    activeMode={state.activeMode}
                    selectedNodeId={state.selectedNodeId} 
                    conceptDesignState={conceptDesignState}
                    graphData={graphData} 
                    onSelectNode={actions.handleNodeSelect}
                    onStartDesign={(nodeId) => actions.triggerAgent('initiate-new-concept-from-selection', { nodeId })}
                    onTriggerAgent={actions.triggerAgent}
                    onNavigateToWikiSection={handleNavigateToNodeViewTarget}
                  />
                </ErrorBoundary>
              </div>
            )}
          </div>
        </div>

        {/* PDF Uploader Modal */}
        {state.showPDFUploader && (
          <ErrorBoundary componentName="PDFUploader">
            <PDFUploader 
              darkMode={state.darkMode} 
              onClose={actions.togglePDFUploader} 
              onFileProcessed={(parsedData) => actions.triggerAgent('integrate-data', parsedData)} 
              onTriggerAgent={actions.triggerAgent} 
            />
          </ErrorBoundary>
        )}
        
        {/* LLM Result Modal */}
        {llmResultModalState.show && (
          <ErrorBoundary componentName="LLMResultModal">
            <LLMResultModal
              darkMode={state.darkMode}
              title={llmResultModalState.title}
              content={llmResultModalState.content}
              isLoading={llmResultModalState.isLoading}
              onClose={actions.closeLLMResultModal}
              allNodes={graphData.nodes}
              onSelectNode={actions.handleNodeSelect}
              onPaperClick={(citationKey) => actions.triggerAgent('open-publication', { key: citationKey })}
            />
          </ErrorBoundary>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;