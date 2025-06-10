// src/App.tsx
import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
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

import { GraphData, NodeObject, AgentMessage, ConceptDesignState, LinkObject, BreadcrumbItem } from './types';
import { useGraphData } from './hooks/useGraphData';
import { useConceptDesign } from './hooks/useConceptDesign';
import { cloneDeep } from 'lodash';
import { slugify } from './utils/markdownParser';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Discovery Engine Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#ffe6e6', margin: '20px', borderRadius: '8px' }}>
          <h2>🚫 Component Error</h2>
          <p>Error: {this.state.error}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy loading components with error boundaries
const LazyNavbar = React.lazy(() => import('./components/Navbar').catch(() => ({ default: () => <div>Navbar Error</div> })));
const LazyGraphVisualization = React.lazy(() => import('./components/GraphVisualization/GraphVisualization').catch(() => ({ default: () => <div>Graph Error</div> })));
const LazyGraphControls = React.lazy(() => import('./components/GraphVisualization/GraphControls').catch(() => ({ default: () => <div>Controls Error</div> })));
const LazyConceptDesigner = React.lazy(() => import('./components/ConceptDesigner/ConceptDesigner').catch(() => ({ default: () => <div>Designer Error</div> })));
const LazyAgentConsole = React.lazy(() => import('./components/AgentConsole/AgentConsole').catch(() => ({ default: () => <div>Agent Error</div> })));
const LazyContextPanel = React.lazy(() => import('./components/ContextPanel/ContextPanel').catch(() => ({ default: () => <div>Context Error</div> })));

// Simple fallback components for critical missing pieces
const FallbackBreadcrumb = ({ path, onNavigate }) => (
  <div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '10px' }}>
    Breadcrumb: {path?.map(p => p.label).join(' > ') || 'Home'}
  </div>
);

const FallbackSidebar = ({ onSelectNode }) => (
  <div style={{ width: '250px', background: '#f8f9fa', padding: '15px', height: '100%' }}>
    <h3>📚 Knowledge Browser</h3>
    <p>Loading knowledge graph...</p>
    <div style={{ marginTop: '20px' }}>
      <button onClick={() => onSelectNode?.({ id: 'test', label: 'Test Node', type: 'Material' })}>
        Sample Material
      </button>
    </div>
  </div>
);

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

  const [activeMode, setActiveMode] = useState<'explore' | 'create'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbItem[]>([]);

  const {
    conceptDesignState, initializeConcept, updateObjective, updateComponentSelection,
    updateCssField, addFieldSuggestions, clearFieldSuggestions, setConceptDesignState
  } = useConceptDesign();

  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([
    {
      id: `welcome_initial_app_${Date.now()}`,
      sourceAgent: 'Nexus Weaver',
      type: 'info',
      content: 'Welcome! Initializing Discovery Engine...',
      timestamp: Date.now()
    }
  ]);

  const [showLabels, setShowLabels] = useState(true);
  const [showLinks, setShowLinks] = useState(true);
  const [enablePhysics, setEnablePhysics] = useState(true);
  const [showParticles, setShowParticles] = useState(false);
  const [showPDFUploader, setShowPDFUploader] = useState(false);
  const [isBrowserSidebarOpen, setIsBrowserSidebarOpen] = useState(true);

  const [lastFilterCounts, setLastFilterCounts] = useState<{nodes: number, links: number} | null>(null);
  const [pendingSearchFilterCounts, setPendingSearchFilterCounts] = useState<{nodes: number, links: number} | null>(null);

  const addAgentMessage = useCallback((message: Omit<AgentMessage, 'id' | 'timestamp'>) => {
    setAgentMessages(prev => [...prev, { ...message, id: `msg_${Date.now()}_${Math.random().toString(36).substring(2,9)}`, timestamp: Date.now() }]);
  }, []);

  useEffect(() => {
    if (!graphLoading && !graphError && graphData.nodes.length > 0) {
      const graphLoadedMessageExists = agentMessages.some(msg => msg.id.startsWith('init_graph_loaded'));
      if (!graphLoadedMessageExists) {
        const newMessages: AgentMessage[] = [
          { id: `init_graph_loaded_${Date.now()}`, sourceAgent: 'Discovery Engine', type: 'info', content: `Knowledge Graph successfully loaded with ${graphData.nodes.length} nodes and ${graphData.links.length} links.`, timestamp: Date.now() + 1 },
          { id: `tip_initial_${Date.now() + 2}`, sourceAgent: 'Research Assistant', type: 'info', content: 'Use the Browser sidebar, explore the graph, or start creating a new concept.', timestamp: Date.now() + 2 }
        ];
        setAgentMessages(prev => {
            if (prev.length <=1 && prev[0]?.id.startsWith('welcome_initial_app_')) return [...prev, ...newMessages];
            return [...prev, ...newMessages];
        });
      }
    }
  }, [graphLoading, graphError, graphData.nodes.length, graphData.links.length, agentMessages]);


  const handleSearchFilterComplete = useCallback((filteredNodeCount: number, filteredLinkCount: number) => {
    setPendingSearchFilterCounts({ nodes: filteredNodeCount, links: filteredLinkCount });
  }, []);

  useEffect(() => {
    if (pendingSearchFilterCounts) {
      setLastFilterCounts(pendingSearchFilterCounts);
      const currentSearchAgentMsgIndex = agentMessages.findIndex(m => 
        m.sourceAgent === "Search Agent" && 
        m.content.startsWith(`Searching graph for: "${searchQuery}"`) && 
        m.content.endsWith("...")
      );
      if (searchQuery && currentSearchAgentMsgIndex !== -1) {
          const updatedMessages = [...agentMessages];
          updatedMessages[currentSearchAgentMsgIndex].content = `Search for "${searchQuery}" filtered to ${pendingSearchFilterCounts.nodes} relevant nodes.`;
          setAgentMessages(updatedMessages);
      }
      setPendingSearchFilterCounts(null);
    }
  }, [pendingSearchFilterCounts, searchQuery, agentMessages]);


  const onTriggerAgent = useCallback((action: string, payload?: any) => {
    let sourceAgent = "Discovery Engine";
    let messageContent = `Triggered action: ${action}`;
    let messageType: AgentMessage['type'] = 'info';

    if (action.startsWith('search')) sourceAgent = "Search Agent";
    else if (action.startsWith('suggest') || action.startsWith('find-analogies')) sourceAgent = "Exploration Agent";
    else if (action.startsWith('check') || action.startsWith('validate')) sourceAgent = "Consistency Agent";
    else if (action.startsWith('generate-protocol')) sourceAgent = "Protocol Agent";
    else if (action.startsWith('generate-concept') || action.startsWith('package-artifact')) sourceAgent = "ConceptAgent";
    else if (action.startsWith('start-design') || action.startsWith('add-component') || action.startsWith('initiate-new-concept')) sourceAgent = "Orchestration Agent";

    switch (action) {
      case 'search-graph':
        messageContent = `Searching graph for: "${payload.query}"...`;
        addAgentMessage({ sourceAgent, type: messageType, content: messageContent });
        break;
      case 'initiate-new-concept-from-selection':
        setActiveMode('create');
        const seedNode = graphData.nodes.find(n => n.id === payload.nodeId);
        initializeConcept(seedNode);
        setSelectedNodeId(null);
        setBreadcrumbPath([]); 
        addAgentMessage({ sourceAgent, type: 'info', content: `New concept design initiated from ${seedNode ? seedNode.label || seedNode.id : 'a blank state'}.` });
        break;
      case 'initiate-new-concept-from-goal':
        setActiveMode('create');
        initializeConcept();
        if(payload && payload.goalText) updateObjective(payload.goalText);
        setSelectedNodeId(null);
        setBreadcrumbPath([]); 
        addAgentMessage({ sourceAgent, type: 'info', content: `New concept design initiated with goal: "${payload?.goalText || 'Not specified'}". Orchestration Agent suggesting starting points...` });
        setTimeout(() => {
            addAgentMessage({ sourceAgent: "Orchestration Agent", type: 'suggestion', content: "Consider starting with 'energy-flow-dissipation' or 'hydrogels-general'.", action: {type: "explore-node", payload: "energy-flow-dissipation", label: "Explore Energy Flow"} });
        }, 1500);
        break;
      case 'launch-exploratory-analysis':
        addAgentMessage({ sourceAgent: "Exploration Agent", type: 'info', content: `Exploration Agents analyzing neighborhood of ${payload.targetId || conceptDesignState.id}...` });
        setTimeout(() => {
            addAgentMessage({ sourceAgent: "Exploration Agent", type: 'opportunity', content: `Found potential knowledge gap related to ${payload.targetId || 'current concept'}: 'Untested specific polymer for high-frequency actuation'.`, relatedNodeIds: payload.targetId ? [payload.targetId] : undefined});
        }, 2000);
        break;
      case 'add-component-to-design':
        addAgentMessage({ sourceAgent:"Orchestration Agent", type: 'info', content: `Component ${payload.componentId} added to design.` });
        break;
      case 'suggest-compatible-components':
        addAgentMessage({ sourceAgent:"Exploration Agent", type: 'info', content: `Searching for compatible components for '${conceptDesignState.objective || conceptDesignState.id}'...` });
        setTimeout(() => {
            addAgentMessage({ sourceAgent: "Exploration Agent", type: 'suggestion', content: `Material 'graphene--2d-materials' might be compatible.`, action: {type: 'accept-suggestion', label: 'Add Graphene', payload: { fieldPath: 'components.materials', value: 'graphene--2d-materials'}}});
        }, 1800);
        break;
      case 'find-analogies':
        addAgentMessage({ sourceAgent: 'Analogy Agent', type: 'info', content: `Searching for analogies related to '${conceptDesignState.objective || conceptDesignState.id}'...` });
        setTimeout(() => {
            addAgentMessage({ sourceAgent: "Analogy Agent", type: 'info', content: `Mechanism 'biological-plasticity-mechanisms' shows analogous adaptive patterns.`});
        }, 2200);
        break;
      case 'check-consistency':
        addAgentMessage({ sourceAgent: 'Consistency Agent', type: 'info', content: `Checking design consistency for '${conceptDesignState.objective || conceptDesignState.id}'...`});
        setTimeout(() => {
            const isConsistent = Math.random() > 0.3;
            if (isConsistent) {
                addAgentMessage({ sourceAgent: "Consistency Agent", type: 'info', content: `Design for '${conceptDesignState.id}' appears consistent with current components.`});
                setConceptDesignState(prev => ({...prev, status: 'Proposed'}));
            } else {
                addAgentMessage({ sourceAgent: "Consistency Agent", type: 'warning', content: `Potential conflict: Material '${conceptDesignState.components.materials[0] || 'X'}' may require conditions incompatible with Mechanism '${conceptDesignState.components.mechanisms[0] || 'Y'}'.`});
            }
        }, 1000);
        break;
      case 'generate-protocol-outline':
        addAgentMessage({ sourceAgent: 'Protocol Agent', type: 'info', content: `Generating protocol outline for '${conceptDesignState.objective || conceptDesignState.id}'...`});
        setTimeout(() => {
            const materialList = conceptDesignState.components.materials.length > 0 ? conceptDesignState.components.materials.join(', ') : 'specified materials';
            const mechanismList = conceptDesignState.components.mechanisms.length > 0 ? conceptDesignState.components.mechanisms.join(', ') : 'key mechanisms';
            const mockProtocol = `# Protocol for: ${conceptDesignState.objective}\n\n## 1. System Setup\n   - Synthesize/acquire ${materialList}.\n   - Assemble system to realize ${mechanismList}.\n\n## 2. Validation Steps\n   - Define key performance metrics.\n   - Apply stimuli.\n   - Measure outputs.\n\n## 3. Data Analysis\n   - Analyze collected data.`;
            addAgentMessage({ sourceAgent: 'Protocol Agent', type: 'info', content: 'Protocol outline generated.', action: {type: 'view-details', label: "View Protocol Draft", payload: {protocol: mockProtocol}}});
            setConceptDesignState(prev => ({...prev, protocolOutline: mockProtocol, status: 'Validated' }));
        }, 1500);
        break;
      case 'generate-concept-summary':
        addAgentMessage({ sourceAgent: 'ConceptAgent', type: 'info', content: `Generating summary for '${conceptDesignState.objective || conceptDesignState.id}'...`});
        setTimeout(() => {
            const summary = `Concept Summary for: ${conceptDesignState.objective || conceptDesignState.id}\nObjective: ${conceptDesignState.objective}\nKey Materials: ${conceptDesignState.components.materials.join(', ') || 'N/A'}\nKey Mechanisms: ${conceptDesignState.components.mechanisms.join(', ') || 'N/A'}\nStatus: ${conceptDesignState.status}`;
             addAgentMessage({ sourceAgent: 'ConceptAgent', type: 'info', content: `Summary ready: ${summary.substring(0,100)}...`, action: {type: 'view-details', label: "View Full Summary", payload: {summary}} });
        }, 1000);
        break;
      case 'package-knowledge-artifact':
        addAgentMessage({ sourceAgent: 'Orchestration Agent', type: 'info', content: `Packaging Knowledge Artifact for '${conceptDesignState.objective || conceptDesignState.id}'...`});
        const newArtifactNode: NodeObject = {
            id: `ka_${conceptDesignState.id}`, type: 'KnowledgeArtifactNode',
            label: `Artifact: ${conceptDesignState.objective || conceptDesignState.id}`,
            description: `This artifact details the proposed system '${conceptDesignState.objective}'.\nObjective: ${conceptDesignState.objective}\nMaterials: ${conceptDesignState.components.materials.join(', ')}\nMechanisms: ${conceptDesignState.components.mechanisms.join(', ')}\nProtocol Outline:\n${conceptDesignState.protocolOutline || 'Not generated.'}`,
            origin: 'system_derived', status: 'Proposed', references: [conceptDesignState.id],
        };
        const systemNodeFromDesign: NodeObject = {
            id: conceptDesignState.id, type: 'SystemNode',
            label: conceptDesignState.objective || conceptDesignState.id,
            status: 'Proposed', origin: 'concept_design',
            cssVector: conceptDesignState.cssVectorDraft,
            description: `A proposed system for '${conceptDesignState.objective}'. Components: Materials - ${conceptDesignState.components.materials.join(', ')}; Mechanisms - ${conceptDesignState.components.mechanisms.join(', ')}.`,
            references: [...conceptDesignState.components.materials, ...conceptDesignState.components.mechanisms],
        };
        const definesLink: LinkObject = { source: newArtifactNode.id, target: systemNodeFromDesign.id, type: 'Defines' };
        setGraphData(prev => {
            const nodesWithoutOld = prev.nodes.filter(n => n.id !== systemNodeFromDesign.id && n.id !== newArtifactNode.id);
            const linksWithoutOld = prev.links.filter(l => !(l.source === newArtifactNode.id && l.target === systemNodeFromDesign.id && l.type === 'Defines'));
            return { nodes: [...nodesWithoutOld, systemNodeFromDesign, newArtifactNode], links: [...linksWithoutOld, definesLink] };
        });
        addAgentMessage({ sourceAgent: 'Orchestration Agent', type: 'info', content: `Knowledge Artifact ${newArtifactNode.id} and System Node ${systemNodeFromDesign.id} created/updated and integrated into CNM.`});
        break;
      case 'integrate-data':
        const newData = payload as GraphData;
        const newNodesWithOrigin = newData.nodes.map(n => ({...n, origin: 'user_upload' as const, status: 'Validated' as const }));
        setGraphData(prev => ({
            nodes: [...prev.nodes, ...newNodesWithOrigin],
            links: [...prev.links, ...newData.links]
        }));
        addAgentMessage({ sourceAgent: "Nexus Weaver", type: "info", content: `Integrated ${newData.nodes.length} new nodes and ${newData.links.length} new links from uploaded file.` });
        break;
      case 'add-field-suggestion':
        if (payload && payload.field && payload.suggestion) {
            addFieldSuggestions(payload.field, [payload.suggestion]);
        } else { console.warn("add-field-suggestion called with invalid payload:", payload); }
        break;
      case 'clear-suggestions':
        if (payload && payload.field) { clearFieldSuggestions(payload.field); }
        break;
      case 'add-message':
        addAgentMessage(payload);
        break;
      case 'open-publication':
        window.open(`/KG/publications/${payload.key}.md`, '_blank');
        addAgentMessage({sourceAgent: "Reference Manager", type: 'info', content: `Opening publication source: ${payload.key}.md`});
        break;
      default:
        console.warn('Unknown agent action in App.tsx:', action, payload);
        addAgentMessage({ sourceAgent: 'System Monitor', type: 'warning', content: `Unknown agent action received: ${action}` });
    }
  }, [addAgentMessage, graphData.nodes, initializeConcept, conceptDesignState, updateObjective, addFieldSuggestions, clearFieldSuggestions, setGraphData, setConceptDesignState, lastFilterCounts, searchQuery]);


  const toggleDarkMode = () => setDarkMode(!darkMode);
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onTriggerAgent('search-graph', { query: searchQuery });
    }
  };

  const handleNodeSelect = useCallback((node: NodeObject | null, sectionSlug?: string) => {
    setSelectedNodeId(node ? node.id : null);

    if (node) {
        if (sectionSlug) (window as any).__targetSectionSlugForNodeView = sectionSlug;
        else delete (window as any).__targetSectionSlugForNodeView;

        setBreadcrumbPath(prevPath => {
            const newPathItem: BreadcrumbItem = { id: node.id, label: node.label || node.id, type: node.type };
            const existingIndex = prevPath.findIndex(item => item.id === node.id);

            if (existingIndex !== -1) {
                return prevPath.slice(0, existingIndex + 1);
            } else {
                 // Basic hierarchical check: is the new node a direct child of the last item in breadcrumbs?
                const lastItem = prevPath.length > 0 ? prevPath[prevPath.length - 1] : null;
                let isChild = false;
                if(lastItem && graphData.links) {
                    isChild = graphData.links.some(link => 
                        (link.source === lastItem.id && link.target === node.id && (link.type === 'categorizes' || link.type === 'PartOfEdge')) ||
                        (link.target === lastItem.id && link.source === node.id && (link.type === 'categorizes' || link.type === 'PartOfEdge')) // PartOf is child->parent
                    );
                }
                if (isChild || prevPath.length === 0) { // If child or path is empty, append
                    return [...prevPath, newPathItem];
                } else { // Otherwise, not a direct child or ancestor in current path, so reset
                    return [newPathItem]; 
                }
            }
        });
        if (activeMode === 'create') setActiveMode('explore');

    } else {
        delete (window as any).__targetSectionSlugForNodeView;
        setBreadcrumbPath([]);
    }
  }, [activeMode, graphData.links, graphData.nodes]); // Added graphData.links and .nodes

  const handleBreadcrumbNavigate = useCallback((nodeId: string) => {
    if (nodeId === '') {
        handleNodeSelect(null);
        return;
    }
    const nodeToSelect = graphData.nodes.find(n => n.id === nodeId);
    if (nodeToSelect) {
        handleNodeSelect(nodeToSelect); 
    }
  }, [graphData.nodes, handleNodeSelect]);

  // For links from NodeView like [[file#section]]
  const handleNavigateToNodeViewTarget = useCallback((fileKey: string, sectionSlug: string) => {
    const targetNode = graphData.nodes.find(n => n.sourceFileKey === fileKey && n.id === sectionSlug);
    if (targetNode) {
        handleNodeSelect(targetNode, sectionSlug);
        if (activeMode === 'create') setActiveMode('explore');
    } else {
        const overviewNodeId = slugify(fileKey); 
        const overviewNode = graphData.nodes.find(n => n.id === overviewNodeId && n.sourceFileKey === fileKey);
        if (overviewNode) {
            handleNodeSelect(overviewNode);
            if (activeMode === 'create') setActiveMode('explore');
        } else {
          addAgentMessage({type: 'warning', sourceAgent: "Navigation", content: `NodeView target not found: ${fileKey}#${sectionSlug}`});
        }
    }
  }, [graphData.nodes, handleNodeSelect, activeMode, addAgentMessage]);


  const handleSetExploreMode = () => { setActiveMode('explore'); setSelectedNodeId(null); setBreadcrumbPath([]); };
  const handleSetCreateMode = (seedNode?: NodeObject | null) => {
    setActiveMode('create');
    initializeConcept(seedNode);
    setSelectedNodeId(null);
    setBreadcrumbPath([]);
    addAgentMessage({ sourceAgent: "Orchestration Agent", type: "info", content: "Switched to Concept Creation mode." });
  };

  const isContextPanelVisible = activeMode === 'create' || selectedNodeId !== null;

  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <ErrorBoundary>
        <Suspense fallback={<div style={{ padding: '10px', background: darkMode ? '#374151' : '#e5e7eb' }}>Loading Navigation...</div>}>
          <LazyNavbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </Suspense>
      </ErrorBoundary>
      <div className="flex flex-col flex-grow overflow-hidden container mx-auto px-2 sm:px-4 py-4 space-y-2">
        <div className="flex flex-wrap items-center justify-between mb-2 flex-shrink-0 gap-y-2 gap-x-4">
           <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap gap-y-2">
                <button onClick={() => setIsBrowserSidebarOpen(!isBrowserSidebarOpen)} title="Toggle Knowledge Browser" className={`p-2 rounded-lg flex items-center space-x-1 sm:space-x-2 text-sm ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}>
                    {isBrowserSidebarOpen ? <CloseIcon size={18} /> : <Menu size={18} />}
                    <span className="hidden xl:inline">Browse</span>
                </button>
                <button onClick={handleSetExploreMode} title="Explore Knowledge Graph" className={`p-2 rounded-lg flex items-center space-x-1 sm:space-x-2 text-sm ${ activeMode === 'explore' ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : (darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300') }`} > <Compass size={18} /> <span className="hidden sm:inline">Explore</span> </button>
                <button onClick={() => handleSetCreateMode(null)} title="Create New Concept" className={`p-2 rounded-lg flex items-center space-x-1 sm:space-x-2 text-sm ${ activeMode === 'create' ? (darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white') : (darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300') }`} > <Lightbulb size={18} /> <span className="hidden sm:inline">Create</span> </button>
           </div>
           <div className="flex items-center space-x-2 flex-wrap">
                <form onSubmit={handleSearchSubmit} className="relative"> <input type="search" placeholder={`Search graph...`} className={`pl-10 pr-4 py-2 rounded-full w-48 sm:w-64 text-sm focus:outline-none focus:ring-2 ${ darkMode ? 'bg-slate-800 text-white focus:ring-blue-500' : 'bg-slate-100 text-slate-900 focus:ring-blue-400' }`} value={searchQuery} onChange={handleSearchInputChange} /> <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" /> </form>
                <button onClick={() => setShowPDFUploader(true)} className={`p-2 rounded-lg flex items-center space-x-1 sm:space-x-2 text-sm ${ darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200' }`} title="Upload File" > <Upload size={18} /> <span className="hidden sm:inline">Upload</span> </button>
           </div>
        </div>
        
        {activeMode === 'explore' && breadcrumbPath.length > 0 && (
            <ErrorBoundary>
                <FallbackBreadcrumb path={breadcrumbPath} onNavigate={handleBreadcrumbNavigate} />
            </ErrorBoundary>
        )}

        <div className="flex flex-1 space-x-4 overflow-hidden">
            {isBrowserSidebarOpen && activeMode === 'explore' && (
                <div className="w-60 md:w-72 flex-shrink-0 h-full overflow-hidden">
                    <ErrorBoundary>
                        <FallbackSidebar onSelectNode={handleNodeSelect} />
                    </ErrorBoundary>
                </div>
            )}

            <div className="w-64 md:w-72 xl:w-80 flex-shrink-0 h-full overflow-hidden">
                <ErrorBoundary>
                    <Suspense fallback={<div style={{ padding: '20px', background: darkMode ? '#374151' : '#e5e7eb', height: '100%' }}>Loading Agent Console...</div>}>
                        <LazyAgentConsole
                            darkMode={darkMode}
                            messages={agentMessages}
                            cnmData={graphData}
                            activeMode={activeMode}
                            conceptDesignState={conceptDesignState}
                            selectedNodeId={selectedNodeId}
                            onTriggerAgent={onTriggerAgent}
                            onSelectNode={handleNodeSelect}
                        />
                    </Suspense>
                </ErrorBoundary>
            </div>

            <div className="flex-grow relative h-full overflow-hidden flex flex-col">
                {graphLoading ? ( <div className="flex flex-col items-center justify-center h-full text-center"><Loader className="w-10 h-10 animate-spin text-blue-500 mb-3" />Loading Knowledge Graph...</div> )
                : graphError ? ( <div className={`p-6 rounded-lg ${darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-700'} flex flex-col items-center justify-center h-full text-center`}><AlertCircle className="w-12 h-12 mb-3"/>Graph Load Error: {graphError}</div> )
                : activeMode === 'explore' ? (
                    <div className="relative rounded-lg overflow-hidden flex-grow">
                        <ErrorBoundary>
                            <Suspense fallback={<div style={{ padding: '50px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Loader className="w-10 h-10 animate-spin text-blue-500 mb-3 mx-auto" />
                                <p>Loading 3D Knowledge Graph...</p>
                            </div>}>
                                <LazyGraphVisualization
                                    data={graphData} darkMode={darkMode} searchQuery={searchQuery}
                                    onNodeSelect={handleNodeSelect} showLabels={showLabels}
                                    showLinks={showLinks} enablePhysics={enablePhysics}
                                    showParticles={showParticles} selectedNodeId={selectedNodeId}
                                    conceptDesignState={conceptDesignState}
                                    onFilterComplete={handleSearchFilterComplete}
                                />
                            </Suspense>
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <Suspense fallback={<div>Loading controls...</div>}>
                                <LazyGraphControls
                                    darkMode={darkMode}
                                    showLabels={showLabels}
                                    showLinks={showLinks}
                                    enablePhysics={enablePhysics}
                                    showParticles={showParticles}
                                    onToggleLabels={()=>setShowLabels(!showLabels)}
                                    onToggleLinks={()=>setShowLinks(!showLinks)}
                                    onTogglePhysics={()=>setEnablePhysics(!enablePhysics)}
                                    onToggleParticles={()=>setShowParticles(!showParticles)}
                                />
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                ) : ( 
                    <div className="h-full overflow-hidden rounded-lg">
                        <ErrorBoundary>
                            <Suspense fallback={<div style={{ padding: '50px', textAlign: 'center' }}>Loading Concept Designer...</div>}>
                                <LazyConceptDesigner
                                    darkMode={darkMode}
                                    designState={conceptDesignState}
                                    graphData={graphData}
                                    onUpdateObjective={updateObjective}
                                    onUpdateComponentSelection={updateComponentSelection}
                                    onUpdateCssField={updateCssField}
                                    onAcceptSuggestion={(fp, val) => onTriggerAgent('accept-suggestion', {field: fp, value: val})}
                                    onTriggerAgent={onTriggerAgent}
                                    agentMessages={agentMessages}
                                />
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                )}
            </div>

            {isContextPanelVisible && (
                 <div className="w-80 xl:w-96 flex-shrink-0 h-full overflow-hidden">
                     <ErrorBoundary>
                         <Suspense fallback={<div style={{ padding: '20px', background: darkMode ? '#374151' : '#e5e7eb', height: '100%' }}>Loading Context Panel...</div>}>
                             <LazyContextPanel
                                 darkMode={darkMode}
                                 activeMode={activeMode}
                                 selectedNodeId={selectedNodeId}
                                 conceptDesignState={conceptDesignState}
                                 graphData={graphData}
                                 onSelectNode={handleNodeSelect}
                                 onStartDesign={(nodeId) => onTriggerAgent('initiate-new-concept-from-selection', { nodeId })}
                                 onTriggerAgent={onTriggerAgent}
                                 onNavigateToWikiSection={handleNavigateToNodeViewTarget} 
                             />
                         </Suspense>
                     </ErrorBoundary>
                </div>
            )}
        </div>
      </div>
      {showPDFUploader && ( <PDFUploader darkMode={darkMode} onClose={() => setShowPDFUploader(false)} onFileProcessed={(parsedData) => onTriggerAgent('integrate-data', parsedData)} onTriggerAgent={onTriggerAgent} /> )}
    </div>
  );
}

export default App;