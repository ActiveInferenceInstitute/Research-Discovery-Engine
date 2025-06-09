/**
 * @fileoverview Main type definitions for the Discovery Engine application
 * 
 * This file contains the core type definitions for nodes, links, and data structures
 * used throughout the knowledge graph visualization and concept design system.
 */

import { CSSVector } from './css';

/**
 * Core node types representing fundamental knowledge entities in the CNM
 */
export type CoreNodeType =
  | 'Material' | 'Mechanism' | 'Method' | 'Phenomenon' | 'Application' | 'TheoreticalConcept'
  | 'KnowledgeGapNode' | 'KnowledgeArtifactNode' | 'SystemNode'
  | 'MetricNode' | 'ParameterNode' | 'EnergyTypeNode';

/**
 * Category node types for hierarchical organization of core entities
 */
export type CategoryNodeType =
  | 'Material_Category' | 'Mechanism_Category' | 'Method_Category'
  | 'Phenomenon_Category' | 'Application_Category' | 'TheoreticalConcept_Category';

/**
 * User-generated node types for custom content
 */
export type UserNodeType = 'Concept' | 'UserUploaded';

/**
 * All possible node types in the system, including overview pages
 */
export type NodeType = CoreNodeType | CategoryNodeType | UserNodeType | 'Documentation' | `${CoreNodeType}_Overview`;

/**
 * Represents a single node in the knowledge graph
 * 
 * @interface NodeObject
 * @example
 * ```typescript
 * const materialNode: NodeObject = {
 *   id: 'graphene--2d-materials',
 *   type: 'Material',
 *   label: 'Graphene',
 *   description: 'Single layer of carbon atoms arranged in hexagonal lattice',
 *   origin: 'wiki_section',
 *   status: 'Validated'
 * };
 * ```
 */
export interface NodeObject {
  /** Unique identifier for the node */
  id: string;
  
  /** Classification of the node type */
  type: NodeType;
  
  /** Source of the node data */
  origin?: 'wiki_section' | 'user_upload' | 'concept_design' | 'system_derived';
  
  /** Validation status of the node's information */
  status?: 'Hypothetical' | 'Proposed' | 'Validated' | 'Archived' | 'Identified';
  
  /** Grouping identifier for visualization clustering */
  group?: number;
  
  /** Numerical value for node sizing in visualizations */
  value?: number;
  
  /** Human-readable display name */
  label?: string;
  
  /** Detailed description of the node */
  description?: string;
  
  /** Structured metadata following CSS schema */
  cssVector?: Partial<CSSVector>;
  
  /** ID of the source wiki section if applicable */
  sourceWikiSectionId?: string;
  
  /** Key of the source file for wiki-based nodes */
  sourceFileKey?: string;
  
  /** Array of related node IDs or citation keys */
  references?: string[];
  
  /** Validation confidence score (0-1) */
  validationScore?: number;
  
  /** Cognitive complexity score (0-1) */
  cognitionScore?: number;
  
  /** System criticality score (0-1) */
  criticalityScore?: number;
  
  /** 3D position coordinates for graph layout */
  x?: number;
  y?: number;
  z?: number;
  
  /** Fixed position coordinates (disables physics) */
  fx?: number;
  fy?: number;
  fz?: number;
  
  /** Custom color override for visualization */
  color?: string;
}

/**
 * Types of relationships between nodes in the knowledge graph
 */
export type EdgeType =
  | 'categorizes' | 'cites-source' | 'concept-uses-component' | 'related-to' | 'interplay'
  | 'EnablesMechanismEdge' | 'ComposedOfMaterialEdge' | 'UtilizesMethodEdge' | 'ValidatedByEdge'
  | 'SuggestsKnowledgeGapEdge' | 'AddressesKnowledgeGapEdge' | 'ImplementsMechanismEdge'
  | 'RequiresEnergyEdge' | 'Defines' | 'PackagedInArtifactEdge';

/**
 * Represents a directed edge between two nodes in the knowledge graph
 * 
 * @interface LinkObject
 * @example
 * ```typescript
 * const link: LinkObject = {
 *   source: 'graphene--2d-materials',
 *   target: 'carbon-based-materials',
 *   type: 'categorizes',
 *   justification: 'Graphene is a specific type of carbon-based material'
 * };
 * ```
 */
export interface LinkObject {
  /** Source node identifier */
  source: string;
  
  /** Target node identifier */
  target: string;
  
  /** Type of relationship */
  type: EdgeType;
  
  /** Numerical weight for the relationship */
  value?: number;
  
  /** Explanation for why this relationship exists */
  justification?: string;
}

/**
 * Complete graph data structure containing nodes and their relationships
 */
export interface GraphData {
  /** Array of all nodes in the graph */
  nodes: NodeObject[];
  
  /** Array of all links between nodes */
  links: LinkObject[];
}

/**
 * Represents a section of parsed markdown content with hierarchical structure
 * 
 * @interface ParsedSection
 */
export interface ParsedSection {
  /** Section title */
  title: string;
  
  /** Markdown content of the section */
  content: string;
  
  /** Heading level (1-6) */
  level: number;
  
  /** Unique identifier for the section */
  id: string;
  
  /** Source file key for wiki sections */
  sourceFileKey?: string;
  
  /** Nested subsections */
  subsections: ParsedSection[];
  
  /** Referenced citations or nodes */
  references?: string[];
  
  /** Hierarchical path to this section */
  parentPath?: string;
}

/**
 * Message from an AI agent with optional actions and metadata
 * 
 * @interface AgentMessage
 */
export interface AgentMessage {
  /** Unique message identifier */
  id: string;
  
  /** Name of the AI agent that sent the message */
  sourceAgent: string;
  
  /** Category of message for styling and handling */
  type: 'info' | 'opportunity' | 'suggestion' | 'warning' | 'error' | 'command_confirmation' | 'user_query';
  
  /** Message content in markdown format */
  content: string;
  
  /** Timestamp when message was created */
  timestamp: number;
  
  /** Node IDs related to this message */
  relatedNodeIds?: string[];
  
  /** Field ID for field-specific suggestions */
  relatedFieldId?: string;
  
  /** Optional action that can be triggered from this message */
  action?: {
    /** Type of action to perform */
    type: 'accept-suggestion' | 'view-details' | 'trigger-agent-action' | 'integrate-data' | 'explore-node';
    
    /** Display label for action button */
    label?: string;
    
    /** Data needed to perform the action */
    payload?: any;
  };
}

/**
 * State object for concept design workflow
 * 
 * @interface ConceptDesignState
 * @description Tracks the current state of a concept being designed, including
 * selected components, configuration parameters, and workflow status
 */
export interface ConceptDesignState {
  /** Unique identifier for the concept */
  id: string;
  
  /** High-level goal or purpose of the concept */
  objective: string;
  
  /** Current validation status */
  status: NodeObject['status'];
  
  /** Selected knowledge components */
  components: {
    /** Selected material node IDs */
    materials: string[];
    
    /** Selected mechanism node IDs */
    mechanisms: string[];
    
    /** Selected method node IDs for validation */
    methods: string[];
    
    /** Selected phenomenon node IDs (optional) */
    phenomena?: string[];
    
    /** Selected application node IDs (optional) */
    applications?: string[];
    
    /** Selected theoretical concept node IDs */
    theoretical_concepts: string[];
  };
  
  /** Draft CSS vector configuration */
  cssVectorDraft: Partial<CSSVector>;
  
  /** AI suggestions for specific fields */
  fieldSuggestions: { [fieldPath: string]: AgentMessage[]; };
  
  /** Generated experimental protocol outline */
  protocolOutline?: string;
  
  /** Knowledge gaps this concept aims to address */
  targetKnowledgeGapIds?: string[];
}

/**
 * Breadcrumb navigation item for hierarchical navigation
 * 
 * @interface BreadcrumbItem
 */
export interface BreadcrumbItem {
  /** Node or section identifier */
  id: string;
  
  /** Display name for the breadcrumb */
  label: string;
  
  /** Node type for styling context */
  type?: NodeType;
}