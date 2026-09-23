// src/types/index.ts
import { CSSVector } from './css';

export type CoreNodeType =
  | 'Material' | 'Mechanism' | 'Method' | 'Phenomenon' | 'Application' | 'TheoreticalConcept'
  | 'KnowledgeGapNode' | 'KnowledgeArtifactNode' | 'SystemNode'
  | 'MetricNode' | 'ParameterNode' | 'EnergyTypeNode';

export type CategoryNodeType =
  | 'Material_Category' | 'Mechanism_Category' | 'Method_Category'
  | 'Phenomenon_Category' | 'Application_Category' | 'TheoreticalConcept_Category';

export type UserNodeType = 'Concept' | 'UserUploaded';
export type NodeType = CoreNodeType | CategoryNodeType | UserNodeType | 'Documentation' | `${CoreNodeType}_Overview`; // Added _Overview

export interface NodeObject {
  id: string; type: NodeType;
  origin?: 'wiki_section' | 'user_upload' | 'concept_design' | 'system_derived';
  status?: 'Hypothetical' | 'Proposed' | 'Validated' | 'Archived' | 'Identified';
  group?: number; value?: number; label?: string; description?: string;
  cssVector?: Partial<CSSVector>;
  sourceWikiSectionId?: string; sourceFileKey?: string;
  references?: string[];
  validationScore?: number; cognitionScore?: number; criticalityScore?: number;
  x?: number; y?: number; z?: number; fx?: number; fy?: number; fz?: number;
  color?: string;
}

export type EdgeType =
  | 'categorizes' | 'cites-source' | 'concept-uses-component' | 'related-to' | 'interplay'
  | 'EnablesMechanismEdge' | 'ComposedOfMaterialEdge' | 'UtilizesMethodEdge' | 'ValidatedByEdge'
  | 'SuggestsKnowledgeGapEdge' | 'AddressesKnowledgeGapEdge' | 'ImplementsMechanismEdge'
  | 'RequiresEnergyEdge' | 'Defines' | 'PackagedInArtifactEdge';

export interface LinkObject {
  source: string; target: string; type: EdgeType;
  value?: number; justification?: string;
}

export interface GraphData { nodes: NodeObject[]; links: LinkObject[]; }

export interface ParsedSection {
  title: string; content: string; level: number; id: string;
  sourceFileKey?: string; subsections: ParsedSection[];
  references?: string[]; parentPath?: string;
}

export interface AgentMessage { /* ... (as before) ... */
  id: string; sourceAgent: string;
  type: 'info' | 'opportunity' | 'suggestion' | 'warning' | 'error' | 'command_confirmation' | 'user_query';
  content: string; timestamp: number; relatedNodeIds?: string[]; relatedFieldId?: string;
  action?: { type: 'accept-suggestion' | 'view-details' | 'view-llm-result' | 'trigger-agent-action' | 'integrate-data' | 'explore-node'; label?: string; payload?: any; };
}

export interface ConceptDesignState {
  id: string;
  objective: string;
  status: NodeObject['status'];
  components: {
    materials: string[];
    mechanisms: string[];
    methods: string[]; // Added
    phenomena?: string[]; // Added - optional for now
    applications?: string[]; // Added - optional
    theoretical_concepts: string[]; // Added
  };
  cssVectorDraft: Partial<CSSVector>;
  fieldSuggestions: { [fieldPath: string]: AgentMessage[]; };
  protocolOutline?: string;
  targetKnowledgeGapIds?: string[];
}
export interface BreadcrumbItem {
  id: string;
  label: string;
  type?: NodeType; // Optional: for styling or context
}