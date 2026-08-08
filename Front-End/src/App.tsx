/**
 * Main Application Component - Discovery Engine (Step-by-Step Workflow)
 * 
 * Redesigned to provide a cleaner, more intuitive workflow that guides users
 * through the discovery process step by step, hiding complexity until needed.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { 
  AlertCircle, 
  Loader, 
  ArrowRight, 
  ArrowLeft,
  Brain, 
  FlaskConical, 
  Zap, 
  Activity, 
  Target, 
  HelpCircle, 
  BookOpen,
  Eye,
  Compass,
  Lightbulb,
  Settings,
  Menu,
  X as CloseIcon
} from 'lucide-react';

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

// New step components
import FieldExplorationStep from './components/Steps/FieldExplorationStep';
import DiscoveryStep from './components/Steps/DiscoveryStep';
import InnovationStep from './components/Steps/InnovationStep';

// Hooks and utilities
import { useAppState } from './hooks/useAppState';
import { slugify } from './utils/markdownParser';
import { TerminologyService } from '../../utils/terminology';

/**
 * Discovery workflow steps
 */
export type DiscoveryStepType = 'explore' | 'discover' | 'innovate' | 'classic';

export const DISCOVERY_STEPS = [
  { 
    key: 'explore' as DiscoveryStepType, 
    label: 'Explore', 
    icon: Eye,
    title: 'Field Exploration',
    description: 'Discover research communities and innovation archetypes'
  },
  { 
    key: 'discover' as DiscoveryStepType, 
    label: 'Discover', 
    icon: Compass,
    title: 'Knowledge Gap Discovery', 
    description: 'AI-powered identification of research opportunities'
  },
  { 
    key: 'innovate' as DiscoveryStepType, 
    label: 'Innovate', 
    icon: Lightbulb,
    title: 'Innovation Trajectory',
    description: 'Synthesize multi-step research pathways'
  }
];

/**
 * Configuration for the knowledge browser sidebar (for classic mode)
 */
export const WIKI_BROWSER_CONFIG = [
  { key: 'mechanisms', label: 'Mechanisms', icon: Brain, file: 'KG/mechanisms.md', indexSectionTitleSlug: "index-of-mechanisms"},
  { key: 'materials', label: 'Materials', icon: FlaskConical, file: 'KG/materials.md', indexSectionTitleSlug: "index-of-material-classes-specific-materials"},
  { key: 'methods', label: 'Methods', icon: Zap, file: 'KG/methods.md', indexSectionTitleSlug: "index-of-methods"},
  { key: 'phenomena', label: 'Phenomena', icon: Activity, file: 'KG/phenomena.md', indexSectionTitleSlug: "index-of-phenomena"},
  { key: 'applications', label: 'Applications', icon: Target, file: 'KG/applications.md', indexSectionTitleSlug: "index-of-applications"},
  { key: 'theoretical', label: 'Theory', icon: HelpCircle, file: 'KG/theoretical.md', indexSectionTitleSlug: "index-of-theoretical-concepts"},
  { key: 'css', label: 'Schema (CSS)', icon: BookOpen, file: 'KG/css.md', indexSectionTitleSlug: "conceptual-nexus-model-cnm-core-schema-specification-css"},
];

/**
 * Main App Component with improved step-by-step workflow
 */
function App() {
  // Discovery workflow state
  const [currentStep, setCurrentStep] = useState<DiscoveryStepType>('explore');
  const [showClassicMode, setShowClassicMode] = useState(false);
  
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

  // Navigation handlers
  const handleStepChange = useCallback((step: DiscoveryStepType) => {
    setCurrentStep(step);
    if (actions.setDiscoveryStep) {
      actions.setDiscoveryStep(step);
    }
  }, [actions]);

  const handleNextStep = useCallback(() => {
    const currentIndex = DISCOVERY_STEPS.findIndex(step => step.key === currentStep);
    if (currentIndex < DISCOVERY_STEPS.length - 1) {
      const nextStep = DISCOVERY_STEPS[currentIndex + 1].key;
      setCurrentStep(nextStep);
      if (actions.setDiscoveryStep) {
        actions.setDiscoveryStep(nextStep);
      }
    }
  }, [currentStep, actions]);

  const handlePrevStep = useCallback(() => {
    const currentIndex = DISCOVERY_STEPS.findIndex(step => step.key === currentStep);
    if (currentIndex > 0) {
      const prevStep = DISCOVERY_STEPS[currentIndex - 1].key;
      setCurrentStep(prevStep);
      if (actions.setDiscoveryStep) {
        actions.setDiscoveryStep(prevStep);
      }
    }
  }, [currentStep, actions]);

  // Classic mode toggle
  const toggleClassicMode = useCallback(() => {
    setShowClassicMode(!showClassicMode);
    if (!showClassicMode) {
      setCurrentStep('classic');
      if (actions.setActiveMode) {
        actions.setActiveMode('classic');
      }
    } else {
      setCurrentStep('explore');
      if (actions.setActiveMode) {
        actions.setActiveMode('explore');
      }
    }
  }, [showClassicMode, actions]);

  // Handle navigation to wiki section from NodeView links
  const handleNavigateToNodeViewTarget = useCallback((fileKey: string, sectionSlug: string) => {
    const targetNode = graphData?.nodes.find(n => n.sourceFileKey === fileKey && n.id === sectionSlug);
    if (targetNode) {
      actions.handleNodeSelect(targetNode, sectionSlug);
      if (state.activeMode === 'create') actions.setActiveMode('explore');
    } else {
      const overviewNodeId = slugify(fileKey);
      const overviewNode = graphData?.nodes.find(n => n.id === overviewNodeId && n.sourceFileKey === fileKey);
      if (overviewNode) {
        actions.handleNodeSelect(overviewNode);
        if (state.activeMode === 'create') actions.setActiveMode('explore');
      } else {
        actions.addAgentMessage({
          type: 'agent',
          sourceAgent: "Navigation",
          content: `NodeView target not found: ${fileKey}#${sectionSlug}`
        });
      }
    }
  }, [graphData?.nodes, actions, state.activeMode]);

  // Step indicator component
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8 bg-gray-900 rounded-full px-6 py-3">
      {DISCOVERY_STEPS.map((step, index) => (
        <React.Fragment key={step.key}>
          <div 
            className={`flex items-center space-x-2 px-4 py-2 rounded-full cursor-pointer transition-all ${
              currentStep === step.key 
                ? 'bg-blue-600 text-white' 
                : DISCOVERY_STEPS.findIndex(s => s.key === currentStep) > index
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => handleStepChange(step.key)}
          >
            <step.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{step.label}</span>
          </div>
          {index < DISCOVERY_STEPS.length - 1 && (
            <ArrowRight className={`w-4 h-4 mx-2 ${
              DISCOVERY_STEPS.findIndex(s => s.key === currentStep) > index ? 'text-green-400' : 'text-gray-600'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Render classic mode (original interface)
  const renderClassicMode = () => (
    <div className={`h-screen flex flex-col transition-colors duration-300 ${
      state.darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Navigation Bar */}
      <Navbar 
        darkMode={state.darkMode} 
        toggleDarkMode={actions.toggleDarkMode} 
        onToggleMode={toggleClassicMode}
        currentMode="classic"
      />

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
              <Eye size={18} />
              <span className="hidden lg:inline">Explore</span>
            </button>
            
            <button 
              onClick={() => actions.handleSetCreateMode()} 
              title="Create New Concept" 
              className={`p-2 rounded-lg flex items-center space-x-1 sm:space-x-2 text-sm ${
                state.activeMode === 'create' 
                  ? (state.darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white')
                  : (state.darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300')
              }`}
            >
              <Lightbulb size={18} />
              <span className="hidden lg:inline">Create</span>
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={actions.handleSearchSubmit} className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search knowledge graph..."
              value={state.searchQuery}
              onChange={actions.handleSearchInputChange}
              className={`w-full px-4 py-2 rounded-lg border text-sm ${
                state.darkMode 
                  ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-400' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </form>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-grow overflow-hidden gap-2">
          {/* Knowledge Browser Sidebar */}
          {state.isBrowserSidebarOpen && (
            <div className="w-80 flex-shrink-0">
              <KnowledgeBrowserSidebar 
                config={WIKI_BROWSER_CONFIG}
                selectedNodeId={state.selectedNodeId}
                onSelectNode={actions.setSelectedNodeId}
                searchQuery={state.searchQuery}
                onNavigateToTarget={handleNavigateToNodeViewTarget}
              />
            </div>
          )}

          {/* Graph Visualization */}
          <div className="flex-1 relative min-w-0">
            {graphLoading && (
              <div className="absolute inset-0 bg-gray-900/75 flex items-center justify-center z-10">
                <div className="text-center">
                  <Loader className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-300">Loading knowledge graph...</p>
                </div>
              </div>
            )}
            
            {graphError && (
              <div className="absolute inset-0 bg-gray-900/75 flex items-center justify-center z-10">
                <div className="text-center text-red-400">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>Error loading graph: {graphError}</p>
                </div>
              </div>
            )}

            <GraphVisualization 
              graphData={graphData}
              selectedNodeId={state.selectedNodeId}
              onNodeSelect={actions.handleNodeSelect}
              searchQuery={state.searchQuery}
              showLabels={state.showLabels}
              showLinks={state.showLinks}
              enablePhysics={state.enablePhysics}
            />
            
            <GraphControls 
              showLabels={state.showLabels}
              showLinks={state.showLinks}
              enablePhysics={state.enablePhysics}
              onToggleLabels={actions.toggleLabels}
              onToggleLinks={actions.toggleLinks}
              onTogglePhysics={actions.togglePhysics}
            />
          </div>

          {/* Right Panel */}
          {isContextPanelVisible && (
            <div className="w-96 flex-shrink-0">
              <ContextPanel 
                selectedNodeId={state.selectedNodeId}
                conceptDesignState={conceptDesignState}
                updateObjective={updateObjective}
                updateComponentSelection={updateComponentSelection}
                updateCssField={updateCssField}
                mode={state.activeMode}
                onNavigateToTarget={handleNavigateToNodeViewTarget}
              />
            </div>
          )}
        </div>

        {/* Breadcrumb Panel */}
        {state.breadcrumbPath && state.breadcrumbPath.length > 0 && (
          <BreadcrumbPanel 
            breadcrumbPath={state.breadcrumbPath}
            onNavigate={actions.handleBreadcrumbNavigate}
          />
        )}
      </div>

      {/* Agent Console */}
      <div className={`h-48 border-t flex-shrink-0 ${
        state.darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-100'
      }`}>
        <AgentConsole 
          messages={state.agentMessages}
          onSendMessage={(content) => actions.addAgentMessage({
            type: 'user',
            sourceAgent: 'User',
            content
          })}
          onClearMessages={actions.clearAgentMessages}
          darkMode={state.darkMode}
        />
      </div>
    </div>
  );

  // Render step-by-step mode
  const renderStepMode = () => (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <nav className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-400 mr-3" />
              <span className="text-xl font-bold text-white">Discovery Engine</span>
              <span className="ml-2 text-sm text-gray-400">Scientific Knowledge Synthesis</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleClassicMode}
                className="px-3 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
              >
                Classic View
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StepIndicator />
        
        <div className="max-w-6xl mx-auto">
          {currentStep === 'explore' && (
            <FieldExplorationStep 
              onNext={handleNextStep}
              graphData={graphData}
              searchQuery={state.searchQuery}
              onSearchChange={actions.setSearchQuery}
            />
          )}
          {currentStep === 'discover' && (
            <DiscoveryStep 
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              graphData={graphData}
              selectedCommunities={state.selectedCommunities || []}
              onSelectCommunity={actions.setSelectedCommunities || (() => {})}
            />
          )}
          {currentStep === 'innovate' && (
            <InnovationStep 
              onPrev={handlePrevStep}
              selectedGap={state.selectedKnowledgeGap || null}
              onSelectGap={actions.setSelectedKnowledgeGap || (() => {})}
              conceptDesignState={conceptDesignState}
              updateConceptDesignState={(update) => {
                if (update.objective !== undefined) updateObjective(update.objective);
                if (update.components !== undefined) updateComponentSelection(update.components);
                if (update.cssField !== undefined) updateCssField(update.cssField);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );

  // Show loading state while graph is loading
  if (graphLoading && !graphData) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Initializing Discovery Engine...</p>
          <p className="text-gray-500 text-sm mt-2">Loading knowledge graph and AI agents</p>
        </div>
      </div>
    );
  }

  // Show error state if graph failed to load
  if (graphError && !graphData) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg mb-2">Failed to Initialize Discovery Engine</p>
          <p className="text-gray-400 text-sm mb-4">{graphError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {showClassicMode ? renderClassicMode() : renderStepMode()}
      
      {/* Modals */}
      {state.showPDFUploader && (
        <PDFUploader onClose={actions.togglePDFUploader} />
      )}
      
      {llmResultModalState && llmResultModalState.show && (
        <LLMResultModal 
          title={llmResultModalState.title}
          content={llmResultModalState.content}
          isLoading={llmResultModalState.isLoading}
          onClose={() => actions.setShowLLMResult && actions.setShowLLMResult(false)}
        />
      )}
    </ErrorBoundary>
  );
}

export default App;