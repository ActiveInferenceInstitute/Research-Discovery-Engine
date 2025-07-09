/**
 * App State Management Hook
 * 
 * This hook centralizes and manages the core application state,
 * extracting complex state logic from the main App component.
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { AgentMessage, ConceptDesignState, BreadcrumbItem, NodeObject, LinkObject, GraphData } from '../types';
import { AgentService } from '../services/AgentService';
import { useGraphData } from './useGraphData';
import { useConceptDesign } from './useConceptDesign';
import { useDebouncedValue } from '../utils/performanceUtils';
import { generateProtocol, formatProtocolAsMarkdown } from '../utils/protocolGenerator';
import { generateSummary, formatSummaryAsMarkdown } from '../utils/summaryGenerator';

/**
 * App state interface for centralized state management
 */
interface AppState {
  // UI State
  darkMode: boolean;
  activeMode: 'explore' | 'create';
  searchQuery: string;
  selectedNodeId: string | null;
  breadcrumbPath: BreadcrumbItem[];
  
  // Control States
  showLabels: boolean;
  showLinks: boolean;
  enablePhysics: boolean;
  showParticles: boolean;
  showPDFUploader: boolean;
  isBrowserSidebarOpen: boolean;
  
  // LLM Result Modal State
  showLLMResultModal: boolean;
  llmResultTitle: string;
  llmResultContent: string;
  isLLMResultLoading: boolean;
  
  // Search Filter States
  lastFilterCounts: { nodes: number; links: number } | null;
  pendingSearchFilterCounts: { nodes: number; links: number } | null;
  
  // Agent Messages
  agentMessages: AgentMessage[];
}

/**
 * App actions interface for state management
 */
interface AppActions {
  // UI Actions
  toggleDarkMode: () => void;
  setActiveMode: (mode: 'explore' | 'create') => void;
  setSearchQuery: (query: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setBreadcrumbPath: (path: BreadcrumbItem[]) => void;
  
  // Control Actions
  toggleLabels: () => void;
  toggleLinks: () => void;
  togglePhysics: () => void;
  toggleParticles: () => void;
  togglePDFUploader: () => void;
  toggleBrowserSidebar: () => void;
  
  // Agent Actions
  addAgentMessage: (message: Omit<AgentMessage, 'id' | 'timestamp'>) => void;
  triggerAgent: (action: string, payload?: any) => void;
  
  // Graph Actions
  handleNodeSelect: (node: NodeObject | null, sectionSlug?: string) => void;
  handleBreadcrumbNavigate: (nodeId: string) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  // Mode Actions
  handleSetExploreMode: () => void;
  handleSetCreateMode: (seedNode?: NodeObject | null) => void;
  
  // Search Filter Actions
  handleSearchFilterComplete: (filteredNodeCount: number, filteredLinkCount: number) => void;
}

/**
 * Custom hook for comprehensive app state management
 * 
 * This hook provides centralized state management for the entire application,
 * reducing the complexity of the main App component and providing a clean
 * interface for state access and mutations.
 * 
 * @returns Object containing app state, graph data, concept design state, and actions
 */
export const useAppState = () => {
  // Core app state
  const [state, setState] = useState<AppState>({
    // UI State
    darkMode: true,
    activeMode: 'explore',
    searchQuery: '',
    selectedNodeId: null,
    breadcrumbPath: [],
    
    // Control States
    showLabels: true,
    showLinks: true,
    enablePhysics: true,
    showParticles: false,
    showPDFUploader: false,
    isBrowserSidebarOpen: true,

    // LLM Result Modal State
    showLLMResultModal: false,
    llmResultTitle: '',
    llmResultContent: '',
    isLLMResultLoading: false,
    
    // Search Filter States
    lastFilterCounts: null,
    pendingSearchFilterCounts: null,
    
    // Agent Messages
    agentMessages: [{
      id: `welcome_initial_app_${Date.now()}`,
      sourceAgent: 'Nexus Weaver',
      type: 'info',
      content: 'Welcome! Initializing Discovery Engine...',
      timestamp: Date.now()
    }]
  });

  // External hooks
  const { graphData, loading: graphLoading, error: graphError, setGraphData } = useGraphData();
  const {
    conceptDesignState,
    initializeConcept,
    updateObjective,
    updateComponentSelection,
    updateCssField,
    addFieldSuggestions,
    clearFieldSuggestions,
    setConceptDesignState
  } = useConceptDesign();

  /**
   * Add agent message with unique ID and timestamp
   */
  const addAgentMessage = useCallback((message: Omit<AgentMessage, 'id' | 'timestamp'>) => {
    setState(prev => ({
      ...prev,
      agentMessages: [...prev.agentMessages, {
        ...message,
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        timestamp: Date.now()
      }]
    }));
  }, []);

  // Initialize agent service
  const agentService = useMemo(() => new AgentService(addAgentMessage), [addAgentMessage]);

  /**
   * Enhanced agent trigger function with state management integration
   */
  const triggerAgent = useCallback((action: string, payload?: any) => {
    // Handle special actions that require direct state updates
    switch (action) {
      case 'initiate-new-concept-from-selection':
        setState(prev => ({
          ...prev,
          activeMode: 'create',
          selectedNodeId: null,
          breadcrumbPath: []
        }));
        const seedNode = graphData.nodes.find(n => n.id === payload.nodeId);
        initializeConcept(seedNode);
        agentService.triggerAgent(action, payload, conceptDesignState, { nodes: graphData.nodes });
        break;
        
      case 'initiate-new-concept-from-goal':
        setState(prev => ({
          ...prev,
          activeMode: 'create',
          selectedNodeId: null,
          breadcrumbPath: []
        }));
        initializeConcept();
        if (payload && payload.goalText) updateObjective(payload.goalText);
        agentService.triggerAgent(action, payload, conceptDesignState, { nodes: graphData.nodes });
        break;
        
      case 'package-knowledge-artifact':
        // Create artifact and update graph
        const newArtifactNode: NodeObject = {
          id: `ka_${conceptDesignState.id}`,
          type: 'KnowledgeArtifactNode',
          label: `Artifact: ${conceptDesignState.objective || conceptDesignState.id}`,
          description: `This artifact details the proposed system '${conceptDesignState.objective}'.\nObjective: ${conceptDesignState.objective}\nMaterials: ${conceptDesignState.components.materials.join(', ')}\nMechanisms: ${conceptDesignState.components.mechanisms.join(', ')}\nProtocol Outline:\n${conceptDesignState.protocolOutline || 'Not generated.'}`,
          sourceFileKey: 'generated_artifacts',
          size: 1,
          color: '#10B981'
        };
        
        const newLinks: LinkObject[] = [];
        conceptDesignState.components.materials.forEach(materialId => {
          if (graphData.nodes.find(n => n.id === materialId)) {
            newLinks.push({
              source: newArtifactNode.id,
              target: materialId,
              type: 'ComponentsEdge',
              sourceFileKey: 'generated_artifacts'
            });
          }
        });
        
        setGraphData(prev => ({
          nodes: [...prev.nodes, newArtifactNode],
          links: [...prev.links, ...newLinks]
        }));
        
        agentService.triggerAgent(action, payload, conceptDesignState, { nodes: graphData.nodes });
        addAgentMessage({
          sourceAgent: 'ConceptAgent',
          type: 'success',
          content: `Knowledge Artifact '${newArtifactNode.label}' created and added to the graph.`,
          action: { type: 'select-node', payload: newArtifactNode.id, label: "View Artifact" }
        });
        break;
        
      case 'integrate-data':
        const newData = payload;
        if (newData && newData.nodes && newData.links) {
          // Check if there's a view-llm-result action in the payload
          if (payload.action && payload.action.type === 'view-llm-result') {
            // Show the LLM result modal
            setState(prev => ({
              ...prev,
              showLLMResultModal: true,
              llmResultTitle: payload.action.payload.title || 'Analysis Result',
              llmResultContent: payload.action.payload.content || '',
              isLLMResultLoading: false
            }));
          }
          
          setGraphData(prevData => ({
            nodes: [...prevData.nodes, ...newData.nodes],
            links: [...prevData.links, ...newData.links]
          }));
          addAgentMessage({
            sourceAgent: "Nexus Weaver",
            type: "info",
            content: `Integrated ${newData.nodes.length} new nodes and ${newData.links.length} new links from uploaded file.`
          });
        }
        break;
        
      case 'add-field-suggestion':
        if (payload && payload.field && payload.suggestion) {
          addFieldSuggestions(payload.field, [payload.suggestion]);
        }
        break;
        
      case 'clear-suggestions':
        if (payload && payload.field) {
          clearFieldSuggestions(payload.field);
        }
        break;
        
      case 'add-message':
        addAgentMessage(payload);
        break;
        
      case 'open-publication':
        window.open(`/KG/publications/${payload.key}.md`, '_blank');
        addAgentMessage({
          sourceAgent: "Reference Manager",
          type: 'info',
          content: `Opening publication source: ${payload.key}.md`
        });
        break;
        
      case 'check-consistency':
        agentService.triggerAgent(action, payload, conceptDesignState, { nodes: graphData.nodes });
        setTimeout(() => {
          const isConsistent = Math.random() > 0.3;
          if (isConsistent) {
            setConceptDesignState(prev => ({ ...prev, status: 'Proposed' }));
          }
        }, 1500);
        break;
        
      case 'generate-protocol-outline':
        agentService.triggerAgent(action, payload, conceptDesignState, { nodes: graphData.nodes });
        break;
        
      default:
        // Delegate to agent service for standard actions
        agentService.triggerAgent(action, payload, conceptDesignState, { nodes: graphData.nodes });
    }
  }, [
    agentService, graphData.nodes, initializeConcept, conceptDesignState, updateObjective,
    addFieldSuggestions, clearFieldSuggestions, setGraphData, setConceptDesignState, addAgentMessage
  ]);

  /**
   * Handle node selection with breadcrumb navigation
   */
  const handleNodeSelect = useCallback((node: NodeObject | null, sectionSlug?: string) => {
    setState(prev => ({
      ...prev,
      selectedNodeId: node ? node.id : null
    }));

    if (node) {
      if (sectionSlug) (window as any).__targetSectionSlugForNodeView = sectionSlug;
      else delete (window as any).__targetSectionSlugForNodeView;

      setState(prev => ({
        ...prev,
        breadcrumbPath: (() => {
          const newPathItem: BreadcrumbItem = { id: node.id, label: node.label || node.id, type: node.type };
          const existingIndex = prev.breadcrumbPath.findIndex(item => item.id === node.id);

          if (existingIndex !== -1) {
            return prev.breadcrumbPath.slice(0, existingIndex + 1);
          } else {
            const lastItem = prev.breadcrumbPath.length > 0 ? prev.breadcrumbPath[prev.breadcrumbPath.length - 1] : null;
            let isChild = false;
            if (lastItem && graphData.links) {
              isChild = graphData.links.some(link => 
                (link.source === lastItem.id && link.target === node.id && (link.type === 'categorizes' || link.type === 'PartOfEdge')) ||
                (link.target === lastItem.id && link.source === node.id && (link.type === 'categorizes' || link.type === 'PartOfEdge'))
              );
            }
            if (isChild || prev.breadcrumbPath.length === 0) {
              return [...prev.breadcrumbPath, newPathItem];
            } else {
              return [newPathItem];
            }
          }
        })()
      }));
      
      if (state.activeMode === 'create') {
        setState(prev => ({ ...prev, activeMode: 'explore' }));
      }
    } else {
      delete (window as any).__targetSectionSlugForNodeView;
      setState(prev => ({
        ...prev,
        breadcrumbPath: []
      }));
    }
  }, [state.activeMode, graphData.links]);

  // Initialize graph loaded messages
  useEffect(() => {
    if (!graphLoading && !graphError && graphData.nodes.length > 0) {
      const graphLoadedMessageExists = state.agentMessages.some(msg => msg.id.startsWith('init_graph_loaded'));
      if (!graphLoadedMessageExists) {
        setState(prev => ({
          ...prev,
          agentMessages: [...prev.agentMessages,
            {
              id: `init_graph_loaded_${Date.now()}`,
              sourceAgent: 'Discovery Engine',
              type: 'info',
              content: `Knowledge Graph successfully loaded with ${graphData.nodes.length} nodes and ${graphData.links.length} links.`,
              timestamp: Date.now() + 1
            },
            {
              id: `tip_initial_${Date.now() + 2}`,
              sourceAgent: 'Research Assistant',
              type: 'info',
              content: 'Use the Browser sidebar, explore the graph, or start creating a new concept.',
              timestamp: Date.now() + 2
            }
          ]
        }));
      }
    }
  }, [graphLoading, graphError, graphData.nodes.length, graphData.links.length, state.agentMessages]);

  // Handle protocol and summary generation based on agent messages
  useEffect(() => {
    const latestMessage = state.agentMessages[state.agentMessages.length - 1];
    if (!latestMessage?.action) return;

    // Handle LLM result actions
    if (latestMessage.action.type === 'view-llm-result') {
      const payload = latestMessage.action.payload;
      
      // Handle protocol generation completion
      if (payload.protocolGenerated && latestMessage.sourceAgent === 'Protocol Agent') {
        try {
          // Use the protocol from the LLM response
          const protocolMarkdown = payload.protocol || '';
          
          setConceptDesignState({
            protocolOutline: protocolMarkdown,
            status: 'Validated'
          });
        } catch (error) {
          console.error('Error generating protocol:', error);
          addAgentMessage({
            sourceAgent: 'Protocol Agent',
            type: 'error',
            content: 'Failed to generate protocol. Please check the concept definition.'
          });
        }
      }

      // Show the LLM result in the modal
      actions.showLLMResult(
        payload.title || 'LLM Result',
        payload.content || ''
      );
    }
  }, [state.agentMessages, conceptDesignState, graphData, setConceptDesignState, addAgentMessage]);

  // Handle search filter updates
  useEffect(() => {
    if (state.pendingSearchFilterCounts) {
      setState(prev => ({ ...prev, lastFilterCounts: prev.pendingSearchFilterCounts }));
      
      const currentSearchAgentMsgIndex = state.agentMessages.findIndex(m => 
        m.sourceAgent === "Search Agent" && 
        m.content.startsWith(`Searching graph for: "${state.searchQuery}"`) && 
        m.content.endsWith("...")
      );
      
      if (state.searchQuery && currentSearchAgentMsgIndex !== -1) {
        setState(prev => ({
          ...prev,
          agentMessages: prev.agentMessages.map((msg, index) => 
            index === currentSearchAgentMsgIndex 
              ? { ...msg, content: `Search for "${state.searchQuery}" filtered to ${state.pendingSearchFilterCounts!.nodes} relevant nodes.` }
              : msg
          ),
          pendingSearchFilterCounts: null
        }));
      }
    }
  }, [state.pendingSearchFilterCounts, state.searchQuery, state.agentMessages]);

  // Handle LLM result actions from agent messages
  useEffect(() => {
    const latestMessage = state.agentMessages[state.agentMessages.length - 1];
    if (!latestMessage?.action) return;

    if (latestMessage.action.type === 'view-llm-result') {
      const payload = latestMessage.action.payload;
      
      if (payload.protocolGenerated) {
        actions.showLLMResult(
          payload.title || 'Protocol',
          payload.protocol
        );
      } else if (payload.summaryGenerated) {
        actions.showLLMResult(
          payload.title || 'Summary',
          payload.fullSummary
        );
      } else if (payload.content) {
        actions.showLLMResult(
          payload.title || 'Analysis',
          payload.content
        );
      }
    }
  }, [state.agentMessages]);

  // Create actions object
  const actions: AppActions = {
    // UI Actions
    toggleDarkMode: () => setState(prev => ({ ...prev, darkMode: !prev.darkMode })),
    setActiveMode: (mode) => setState(prev => ({ ...prev, activeMode: mode })),
    setSearchQuery: (query) => setState(prev => ({ ...prev, searchQuery: query })),
    setSelectedNodeId: (id) => setState(prev => ({ ...prev, selectedNodeId: id })),
    setBreadcrumbPath: (path) => setState(prev => ({ ...prev, breadcrumbPath: path })),
    
    // Control Actions
    toggleLabels: () => setState(prev => ({ ...prev, showLabels: !prev.showLabels })),
    toggleLinks: () => setState(prev => ({ ...prev, showLinks: !prev.showLinks })),
    togglePhysics: () => setState(prev => ({ ...prev, enablePhysics: !prev.enablePhysics })),
    toggleParticles: () => setState(prev => ({ ...prev, showParticles: !prev.showParticles })),
    togglePDFUploader: () => setState(prev => ({ ...prev, showPDFUploader: !prev.showPDFUploader })),
    toggleBrowserSidebar: () => setState(prev => ({ ...prev, isBrowserSidebarOpen: !prev.isBrowserSidebarOpen })),
    
    // LLM Result Modal Actions
    showLLMResult: (title: string, content: string) => setState(prev => ({ 
      ...prev, 
      showLLMResultModal: true, 
      llmResultTitle: title, 
      llmResultContent: content,
      isLLMResultLoading: false
    })),
    startLLMLoading: (title: string) => setState(prev => ({ 
      ...prev, 
      showLLMResultModal: true, 
      llmResultTitle: title, 
      llmResultContent: '',
      isLLMResultLoading: true
    })),
    closeLLMResultModal: () => setState(prev => ({ ...prev, showLLMResultModal: false })),
    
    // Agent Actions
    addAgentMessage,
    triggerAgent,
    
    // Graph Actions
    handleNodeSelect,
    handleBreadcrumbNavigate: useCallback((nodeId: string) => {
      if (nodeId === '') {
        handleNodeSelect(null);
        return;
      }
      const nodeToSelect = graphData.nodes.find(n => n.id === nodeId);
      if (nodeToSelect) {
        handleNodeSelect(nodeToSelect);
      }
    }, [graphData.nodes, handleNodeSelect]),
    
    handleSearchSubmit: useCallback((e: React.FormEvent) => {
      e.preventDefault();
      if (state.searchQuery.trim()) {
        triggerAgent('search-graph', { query: state.searchQuery });
      }
    }, [state.searchQuery, triggerAgent]),
    
    handleSearchInputChange: useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setState(prev => ({ ...prev, searchQuery: e.target.value }));
    }, []),
    
    // Mode Actions
    handleSetExploreMode: () => setState(prev => ({
      ...prev,
      activeMode: 'explore',
      selectedNodeId: null,
      breadcrumbPath: []
    })),
    
    handleSetCreateMode: useCallback((seedNode?: NodeObject | null) => {
      setState(prev => ({
        ...prev,
        activeMode: 'create',
        selectedNodeId: null,
        breadcrumbPath: []
      }));
      initializeConcept(seedNode);
      addAgentMessage({
        sourceAgent: "Orchestration Agent",
        type: "info",
        content: "Switched to Concept Creation mode."
      });
    }, [initializeConcept, addAgentMessage]),
    
    // Search Filter Actions
    handleSearchFilterComplete: useCallback((filteredNodeCount: number, filteredLinkCount: number) => {
      setState(prev => ({
        ...prev,
        pendingSearchFilterCounts: { nodes: filteredNodeCount, links: filteredLinkCount }
      }));
    }, [])
  };

  return {
    // State
    state,
    actions,
    
    // External hook data
    graphData,
    graphLoading,
    graphError,
    conceptDesignState,
    
    // External hook actions
    initializeConcept,
    updateObjective,
    updateComponentSelection,
    updateCssField,
    addFieldSuggestions,
    clearFieldSuggestions,
    setConceptDesignState,
    setGraphData,
    
    // Computed values
    isContextPanelVisible: state.activeMode === 'create' || state.selectedNodeId !== null,
    
    // LLM Result Modal State
    llmResultModalState: {
      show: state.showLLMResultModal,
      title: state.llmResultTitle,
      content: state.llmResultContent,
      isLoading: state.isLLMResultLoading
    }
  };
};