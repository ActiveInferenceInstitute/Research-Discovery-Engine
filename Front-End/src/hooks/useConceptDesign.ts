// src/hooks/useConceptDesign.ts
import { useState, useCallback } from 'react';
import { CSSVector, ConceptDesignState, AgentMessage, NodeObject } from '../types';
import { cloneDeep, set as lodashSet } from 'lodash';

const getInitialConceptDesignState = (seedNode?: NodeObject | null): ConceptDesignState => {
  const newId = `concept_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  let objective = '';
  let status: NodeObject['status'] = 'Hypothetical';
  const components: ConceptDesignState['components'] = { // Initialize all component arrays
    materials: [],
    mechanisms: [],
    methods: [],
    phenomena: [],
    applications: [],
    theoretical_concepts: [],
  };
  let cssVectorDraft: Partial<CSSVector> = {
    meta: { id: newId, analysis_date: new Date().toISOString(), source_keys: [] },
    context: {}, state: {}, interface: {}, dynamics: {}, memory: {},
    adaptation: {}, constraints: {}, interactions: {}, hierarchy: {}
  };

  if (seedNode && seedNode.id) {
    objective = `New concept based on ${seedNode.label || seedNode.id}`;
    status = 'Proposed';
    if (seedNode.type === 'Material' || seedNode.type === 'Material_Category') components.materials.push(seedNode.id);
    else if (seedNode.type === 'Mechanism' || seedNode.type === 'Mechanism_Category') components.mechanisms.push(seedNode.id);
    else if (seedNode.type === 'Method' || seedNode.type === 'Method_Category') components.methods.push(seedNode.id);
    else if (seedNode.type === 'Phenomenon' || seedNode.type === 'Phenomenon_Category') (components.phenomena = components.phenomena || []).push(seedNode.id);
    else if (seedNode.type === 'Application' || seedNode.type === 'Application_Category') (components.applications = components.applications || []).push(seedNode.id);
    else if (seedNode.type === 'TheoreticalConcept' || seedNode.type === 'TheoreticalConcept_Category') components.theoretical_concepts.push(seedNode.id);
    
    if (cssVectorDraft.meta) {
        cssVectorDraft.meta.source_keys = cssVectorDraft.meta.source_keys ? [...cssVectorDraft.meta.source_keys, seedNode.id] : [seedNode.id];
    }
  }

  return {
    id: newId, objective, status, components, cssVectorDraft,
    fieldSuggestions: {}, protocolOutline: undefined, targetKnowledgeGapIds: [],
  };
};

export const useConceptDesign = () => {
  const [conceptDesignState, setConceptDesignState] = useState<ConceptDesignState>(getInitialConceptDesignState(null));

  const initializeConcept = useCallback((seedNode?: NodeObject | null) => {
    setConceptDesignState(getInitialConceptDesignState(seedNode));
  }, []);

  const updateObjective = useCallback((objective: string) => { /* ... as before ... */ 
    setConceptDesignState(prevState => ({
      ...prevState,
      objective: objective,
      status: prevState.status === 'Hypothetical' && objective ? 'Proposed' : prevState.status,
    }));
  }, []);

  const updateComponentSelection = useCallback((componentType: keyof ConceptDesignState['components'], selectedIds: string[]) => {
    setConceptDesignState(prevState => {
      const newState = cloneDeep(prevState);
      // Ensure the componentType array exists
      if (!newState.components[componentType]) {
        (newState.components as any)[componentType] = []; // Initialize if not present
      }
      (newState.components[componentType] as string[]) = selectedIds;
      
      if (prevState.status === 'Hypothetical' && (newState.components.materials.length > 0 || newState.components.mechanisms.length > 0)) {
        newState.status = 'Proposed';
      }
      return newState;
    });
  }, []);

  const updateCssField = useCallback((fieldPath: string, value: any) => { /* ... as before ... */ 
    setConceptDesignState(prevState => {
      const newState = cloneDeep(prevState);
      lodashSet(newState.cssVectorDraft, fieldPath, value);
      if (prevState.status === 'Hypothetical' && value && (!Array.isArray(value) || value.length > 0)) {
        newState.status = 'Proposed';
      }
      return newState;
    });
  }, []);
  
  const updateFullConceptState = useCallback((newStateUpdates: Partial<ConceptDesignState>) => { /* ... as before ... */ 
      setConceptDesignState(prevState => ({...prevState, ...newStateUpdates}));
  }, []);

  const addFieldSuggestions = useCallback((fieldPath: string, messages: AgentMessage[]) => { /* ... as before ... */ 
    setConceptDesignState(prevState => {
      const currentSuggestions = prevState.fieldSuggestions[fieldPath] || [];
      const newUniqueMessages = messages.filter(
        msg => !currentSuggestions.some(existing => existing.id === msg.id)
      );
      if (newUniqueMessages.length === 0) return prevState;

      const newState = cloneDeep(prevState);
      newState.fieldSuggestions[fieldPath] = [
        ...currentSuggestions,
        ...newUniqueMessages
      ];
      return newState;
    });
  }, []);

  const clearFieldSuggestions = useCallback((fieldPath: string) => { /* ... as before ... */ 
    setConceptDesignState(prevState => {
      if (!prevState.fieldSuggestions[fieldPath]) return prevState;
      const newState = cloneDeep(prevState);
      delete newState.fieldSuggestions[fieldPath];
      return newState;
    });
  }, []);

  return {
    conceptDesignState, initializeConcept, updateObjective, updateComponentSelection,
    updateCssField, addFieldSuggestions, clearFieldSuggestions,
    setConceptDesignState: updateFullConceptState,
  };
};