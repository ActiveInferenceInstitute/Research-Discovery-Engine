// src/types/css.ts
// Based on css.md - Defines the structure used in ConceptDesigner & Paper Node metadata

/**
 * @fileoverview Conceptual System Schema (CSS) Vector Type Definitions
 * 
 * The CSS Vector provides a structured framework for describing physical 
 * and computational systems across multiple dimensions including context,
 * state, interface, dynamics, memory, adaptation, constraints, interactions,
 * and hierarchy.
 * 
 * This schema enables systematic comparison and analysis of diverse systems
 * from biological neural networks to artificial physical reservoirs.
 */

import type { NodeType } from './index';

/**
 * Complete CSS Vector specification for describing complex systems
 * 
 * @interface CSSVector
 * @description A comprehensive data structure that captures the essential
 * characteristics of a system across nine key dimensions. Each field can
 * contain references to knowledge graph nodes, quantitative measurements,
 * or categorical classifications.
 * 
 * @example
 * ```typescript
 * const reservoirSystem: CSSVector = {
 *   meta: {
 *     id: 'liquid-state-machine',
 *     classification: 'Physical Reservoir Computer',
 *     analysis_date: '2024-01-15T10:00:00Z'
 *   },
 *   context: {
 *     material_primary: ['liquid-crystalline-polymers'],
 *     environment_type: 'laboratory-controlled',
 *     energy_source_primary: 'electrical-stimulation'
 *   },
 *   dynamics: {
 *     mechanism_primary: ['nonlinear-dynamics'],
 *     timescale: '10ms',
 *     computational_power: '100 TOPS/W'
 *   }
 * };
 * ```
 */
export interface CSSVector {
  /**
   * Metadata for tracking and classification
   */
  meta: {
    /** System identifier (e.g., paper key or concept ID) */
    id: string;
    
    /** Optional high-level classification category */
    classification?: string;
    
    /** ISO timestamp of when analysis was performed */
    analysis_date: string;
    
    /** References to source publications or data */
    source_keys?: string[];
  };

  /**
   * Environmental and compositional context of the system
   * 
   * @description Captures the physical substrate, fabrication methods,
   * environmental conditions, and energy sources that define the system's
   * operational context.
   */
  context: {
    /** Primary material constituents (links to MaterialNode IDs) */
    material_primary?: string[];
    
    /** Key material properties or characteristics */
    material_property_key?: string[];
    
    /** Structural organization type (e.g., 'random', 'ordered', 'hierarchical') */
    morphology_type?: string;
    
    /** Characteristic size scale with units (e.g., '100nm', 'microscale') */
    morphology_scale?: string;
    
    /** Whether structure exhibits hierarchical organization */
    morphology_hierarchy?: boolean | number;
    
    /** Primary fabrication or assembly methods (links to MethodNode IDs) */
    fabrication_primary?: string[];
    
    /** Operating environment conditions (e.g., 'ambient', 'vacuum', 'aqueous') */
    environment_type?: string;
    
    /** Primary energy input type (links to EnergyTypeNode ID) */
    energy_source_primary?: string;
  };

  /**
   * Internal state representation characteristics
   * 
   * @description Defines how information is encoded and represented
   * within the system's internal state space.
   */
  state: {
    /** Physical or mathematical basis for state representation */
    basis?: string[];
    
    /** State space type: 'Discrete', 'Continuous', 'Hybrid', 'Field' */
    type?: string;
    
    /** Dimensionality of state space ('Low', 'High', or specific count) */
    dimensionality?: string | number;
    
    /** Whether state evolution is deterministic or stochastic */
    determinism?: string;
  };

  /**
   * Input-output interface characteristics
   * 
   * @description Specifies how the system receives input signals and
   * produces output responses, including bandwidth and signal processing.
   */
  interface: {
    /** Mechanisms for receiving input (links to MechanismNode IDs) */
    input_mechanism?: string[];
    
    /** Input processing bandwidth with units (e.g., '1kHz', 'broadband') */
    input_bandwidth?: string | number;
    
    /** Mechanisms for generating output (links to MechanismNode IDs) */
    output_mechanism?: string[];
    
    /** Output generation bandwidth with units */
    output_bandwidth?: string | number;
    
    /** Form of signal representation (e.g., 'analog', 'digital', 'spike-based') */
    signal_form?: string;
  };

  /**
   * Temporal dynamics and computational characteristics
   * 
   * @description Captures how the system processes information over time,
   * including computational capabilities and energy efficiency.
   */
  dynamics: {
    /** Primary computational mechanisms (links to MechanismNode IDs) */
    mechanism_primary?: string[];
    
    /** Characteristic processing timescale with units (e.g., '10ms', 'real-time') */
    timescale?: string | number;
    
    /** Computational performance metrics with units (e.g., 'TOPS/W', '95% accuracy') */
    computational_power?: string | number;
    
    /** Energy cost per operation with units (e.g., 'pJ/op', 'kBT') */
    energy_cost_operation?: string | number;
    
    /** Type of computational process (e.g., 'classification', 'filtering', 'prediction') */
    process_type?: string;
    
    /** Mathematical framework used for modeling (e.g., 'ODEs', 'PDEs', 'neural networks') */
    mathematical_model?: string;
  };

  /**
   * Memory and information storage capabilities
   * 
   * @description Characterizes how the system stores and retrieves
   * information, including capacity, persistence, and access patterns.
   */
  memory: {
    /** Primary memory mechanisms (links to MechanismNode IDs) */
    mechanism_primary?: string[];
    
    /** Storage capacity estimate with units (e.g., 'bits', 'states', 'patterns') */
    capacity_estimate?: string | number;
    
    /** Information retention timescale (e.g., 'persistent', '1hr', 'volatile') */
    timescale_retention?: string | number;
    
    /** Memory access speed with units (e.g., 'ns', 'real-time') */
    access_speed?: string | number;
    
    /** Whether memory can be rewritten (boolean or cycle count) */
    rewritability?: boolean | string;
    
    /** Energy cost for memory access with units */
    energy_cost_access?: string | number;
  };

  /**
   * Learning and adaptation capabilities
   * 
   * @description Describes the system's ability to modify its behavior
   * or structure based on experience or environmental changes.
   */
  adaptation: {
    /** Primary adaptation mechanisms (links to MechanismNode IDs) */
    mechanism_primary?: string[];
    
    /** Scope of adaptation: ['Parameters', 'Structure', 'Behavior'] */
    scope?: string[];
    
    /** Learning paradigm: 'Supervised', 'Reinforcement', 'Unsupervised', 'Self-organizing' */
    guidance?: string;
    
    /** Learning timescale with units (e.g., 'online', 'batch', '100 epochs') */
    timescale?: string | number;
    
    /** Energy cost of learning process with units */
    energy_cost?: string | number;
  };

  /**
   * System constraints and optimization objectives
   * 
   * @description Defines the limitations, trade-offs, and objectives
   * that govern system behavior and design choices.
   */
  constraints: {
    /** Primary optimization objective (e.g., 'TaskPerformance', 'EnergyEfficiency') */
    objective_type?: string;
    
    /** Approach to handling uncertainty: 'Stochastic', 'RobustDesign', 'Adversarial' */
    uncertainty_handling?: string;
    
    /** Physical constraints (e.g., ['ConservationLaws', 'Thermodynamics', 'Causality']) */
    physical?: string[];
  };

  /**
   * Component interactions and coupling patterns
   * 
   * @description Characterizes how different parts of the system
   * interact with each other and the resulting emergent behaviors.
   */
  interactions: {
    /** Dominant coupling pathways (e.g., ['Sensor->Compute', 'Compute->Memory']) */
    dominant_coupling?: string[];
    
    /** Strength of component coupling ('weak', 'strong', or numerical value) */
    coupling_strength?: string | number;
    
    /** Types of feedback present: ['Negative', 'Positive', 'Delayed'] */
    feedback_type?: string[];
    
    /** Network connectivity pattern: 'RandomGraph', 'SmallWorld', 'ScaleFree', 'Lattice' */
    network_topology?: string;
  };

  /**
   * Multi-scale hierarchical organization
   * 
   * @description Captures the hierarchical structure and cross-scale
   * interactions that give rise to emergent system properties.
   */
  hierarchy: {
    /** Number of distinct organizational levels */
    num_levels?: number;
    
    /** Mechanisms enabling cross-scale interactions (links to MechanismNode IDs) */
    crossscale_mechanism?: string[];
    
    /** Emergent phenomena at higher scales (links to PhenomenonNode IDs) */
    emergence_manifestation?: string[];
  };

  // Optional derived scores from analysis
  /** Overall validation confidence score (0-1) */
  validation_score?: number;
  
  /** Cognitive/computational capability score (0-1) */
  cognition_score?: number;
  
  /** System criticality or importance score (0-1) */
  criticality_score?: number;
}

// Legacy interface - kept for backward compatibility
// TODO: Remove this and update all references to use the main NodeObject interface
export interface NodeObject {
  id: string;
  type: NodeType;
  origin?: 'wiki_section' | 'wiki_entity_file' | 'user_upload' | 'concept_design' | 'paper_analysis';
  status?: 'canonical' | 'proposed' | 'hypothetical' | 'validated' | 'deprecated';
  group?: number;
  value?: number;
  label?: string;
  description?: string;
  cssVector?: Partial<CSSVector>;
  sourceWikiSectionId?: string;
  references?: string[];
  validationScore?: number;
  cognitionScore?: number;
  criticalityScore?: number;
  x?: number; y?: number; z?: number; fx?: number; fy?: number; fz?: number;
  color?: string;
}

export interface LinkObject {
  source: string;
  target: string;
  type: 'categorizes' | 'cites-paper' | 'concept-uses' | 'related-to' | 'interplay' | 'addresses-gap' | 'defines-artifact';
  value?: number;
  justification?: string;
}