import { useState, useCallback } from 'react';
import { cloneDeep, set as lodashSet } from 'lodash';
import { NodeObject, ConceptDesignState, AgentMessage } from '../types';

const getInitialConceptDesignState = (seedNode?: NodeObject | null): ConceptDesignState => {
  return {
    id: `concept_${Date.now()}`,
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
    cssVectorDraft: {
      meta: {
        id: `concept_${Date.now()}`,
        analysis_date: new Date().toISOString(),
      },
    },
    fieldSuggestions: {},
  };
};

export const useConceptDesign = () => {
  const [conceptDesignState, setConceptDesignState] = useState<ConceptDesignState>(
    getInitialConceptDesignState()
  );

  const initializeConcept = useCallback((seedNode?: NodeObject | null) => {
    setConceptDesignState(getInitialConceptDesignState(seedNode));
  }, []);

  const updateObjective = useCallback((objective: string) => {
    setConceptDesignState(prev => ({
      ...prev,
      objective,
      status: objective ? 'Proposed' : 'Hypothetical',
    }));
  }, []);

  const updateComponentSelection = useCallback((
    componentType: keyof ConceptDesignState['components'],
    selectedIds: string[]
  ) => {
    setConceptDesignState(prev => {
      const newState = cloneDeep(prev);
      if (!newState.components[componentType]) {
        (newState.components as any)[componentType] = [];
      }
      (newState.components[componentType] as string[]) = selectedIds;
      
      if (prev.status === 'Hypothetical' && (newState.components.materials.length > 0 || newState.components.mechanisms.length > 0)) {
        newState.status = 'Proposed';
      }
      return newState;
    });
  }, []);

  const updateCssField = useCallback((fieldPath: string, value: any) => {
    setConceptDesignState(prev => {
      const newState = cloneDeep(prev);
      lodashSet(newState.cssVectorDraft, fieldPath, value);
      if (prev.status === 'Hypothetical' && value && (!Array.isArray(value) || value.length > 0)) {
        newState.status = 'Proposed';
      }
      return newState;
    });
  }, []);
  
  const updateFullConceptState = useCallback((newStateUpdates: Partial<ConceptDesignState>) => {
    setConceptDesignState(prevState => ({...prevState, ...newStateUpdates}));
  }, []);

  const addFieldSuggestions = useCallback((fieldPath: string, messages: AgentMessage[]) => {
    setConceptDesignState(prev => {
      const currentSuggestions = prev.fieldSuggestions[fieldPath] || [];
      const newUniqueMessages = messages.filter(
        msg => !currentSuggestions.some(existing => existing.id === msg.id)
      );
      if (newUniqueMessages.length === 0) return prev;

      const newState = cloneDeep(prev);
      newState.fieldSuggestions[fieldPath] = [
        ...currentSuggestions,
        ...newUniqueMessages
      ];
      return newState;
    });
  }, []);

  const clearFieldSuggestions = useCallback((fieldPath: string) => {
    setConceptDesignState(prev => {
      if (!prev.fieldSuggestions[fieldPath]) return prev;
      const newState = cloneDeep(prev);
      delete newState.fieldSuggestions[fieldPath];
      return newState;
    });
  }, []);

  return {
    conceptDesignState,
    initializeConcept,
    updateObjective,
    updateComponentSelection,
    updateCssField,
    addFieldSuggestions,
    clearFieldSuggestions,
    setConceptDesignState: updateFullConceptState,
  };
}; 