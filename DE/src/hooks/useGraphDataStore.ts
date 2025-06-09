import { create } from 'zustand';
import { GraphData, NodeObject, LinkObject, ConceptDesignState } from '../types';

interface GraphDataStore {
  // State
  graphData: GraphData;
  loading: boolean;
  error: string | null;
  selectedNodeId: string | null;
  conceptDesignState: ConceptDesignState;
  
  // Actions
  setGraphData: (data: GraphData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  selectNode: (nodeId: string | null) => void;
  updateConceptDesign: (updates: Partial<ConceptDesignState>) => void;
  
  // Derived state
  selectedNode: () => NodeObject | null;
  filteredNodes: (query: string) => NodeObject[];
}

export const useGraphDataStore = create<GraphDataStore>()((set, get) => ({
  // Initial state
  graphData: { nodes: [], links: [] },
  loading: false,
  error: null,
  selectedNodeId: null,
  conceptDesignState: {
    id: '',
    objective: '',
    status: 'Hypothetical',
    components: {
      materials: [],
      mechanisms: [],
      methods: [],
      phenomena: [],
      applications: [],
      theoretical_concepts: [],
    },
    cssVectorDraft: { meta: { id: '', analysis_date: new Date().toISOString() } },
    fieldSuggestions: {},
  },

  // Actions
  setGraphData: (data: GraphData) => set({ graphData: data }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  selectNode: (nodeId: string | null) => set({ selectedNodeId: nodeId }),
  updateConceptDesign: (updates: Partial<ConceptDesignState>) => 
    set((state) => ({
      conceptDesignState: { ...state.conceptDesignState, ...updates }
    })),

  // Derived state
  selectedNode: () => {
    const { graphData, selectedNodeId } = get();
    return graphData.nodes.find((n: NodeObject) => n.id === selectedNodeId) || null;
  },
  
  filteredNodes: (query: string) => {
    const { graphData } = get();
    if (!query.trim()) return graphData.nodes;
    
    const lowerQuery = query.toLowerCase();
    return graphData.nodes.filter((node: NodeObject) =>
      node.label?.toLowerCase().includes(lowerQuery) ||
      node.description?.toLowerCase().includes(lowerQuery) ||
      node.id.toLowerCase().includes(lowerQuery)
    );
  },
})); 