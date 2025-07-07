// src/types/css.ts
// Based on css.md - Defines the structure used in ConceptDesigner & Paper Node metadata

export interface CSSVector {
  meta: {
    id: string; // System ID (e.g., paper key or concept ID)
    classification?: string; // Optional classification
    analysis_date: string; // ISO string
    source_keys?: string[]; // Links to PublicationNode IDs [key]
  };
  context: {
    material_primary?: string[]; // Links to MaterialNode IDs
    material_property_key?: string[]; // Keywords or links to ParameterNode?
    morphology_type?: string; // Link to specific Morphology term Node?
    morphology_scale?: string; // Numerical + Unit
    morphology_hierarchy?: boolean | number;
    fabrication_primary?: string[]; // Links to MethodNode IDs
    environment_type?: string; // Link to Environment term Node?
    energy_source_primary?: string; // Link to EnergyTypeNode ID
  };
  state: {
    basis?: string[]; // Links to ParameterNode IDs or descriptive terms
    type?: string; // Categorical: Discrete, Continuous, Hybrid, Field
    dimensionality?: string | number; // Low, High, Count
    determinism?: string; // Deterministic, Stochastic
  };
  interface: {
    input_mechanism?: string[]; // Links to MechanismNode IDs
    input_bandwidth?: string | number; // Numerical/Qualitative + Unit (Hz)
    output_mechanism?: string[]; // Links to MechanismNode IDs
    output_bandwidth?: string | number; // Numerical/Qualitative + Unit (Hz)
    signal_form?: string; // Categorical
  };
  dynamics: {
    mechanism_primary?: string[]; // Links to MechanismNode IDs
    timescale?: string | number; // Numerical/Qualitative + Unit (s, ms, steps)
    computational_power?: string | number; // Numerical/Qualitative + Unit (TOPS/W, Accuracy)
    energy_cost_operation?: string | number; // Numerical/Qualitative + Unit (J, kBT)
    process_type?: string; // Link to ProcessType term Node? (Filtering, Classification)
    mathematical_model?: string; // Categorical/Text (ODEs, PDEs)
  };
  memory: {
    mechanism_primary?: string[]; // Links to MechanismNode IDs
    capacity_estimate?: string | number; // Numerical/Qualitative + Unit (Bits, #States)
    timescale_retention?: string | number; // Numerical/Qualitative + Unit (s, hrs, Volatile)
    access_speed?: string | number; // Numerical/Qualitative + Unit (Hz, s)
    rewritability?: boolean | string; // Boolean or Qualitative (cycles)
    energy_cost_access?: string | number; // Numerical/Qualitative + Unit
  };
  adaptation: {
    mechanism_primary?: string[]; // Links to MechanismNode IDs
    scope?: string[]; // Categorical List (Parameters, Structure, Behavior)
    guidance?: string; // Categorical (Supervised, Reinforcement, Unsupervised)
    timescale?: string | number; // Numerical/Qualitative + Unit
    energy_cost?: string | number; // Numerical/Qualitative + Unit
  };
  constraints: {
    objective_type?: string; // Link to Objective term Node? (TaskPerformance, FE Min)
    uncertainty_handling?: string; // Categorical (Stochastic, RobustDesign)
    physical?: string[]; // Text list (ConservationLaws, Thermodynamics)
  };
  interactions: {
    dominant_coupling?: string[]; // Text describing couplings (Sensor->Compute)
    coupling_strength?: string | number; // Qualitative/Numerical
    feedback_type?: string[]; // Categorical List (Negative, Positive)
    network_topology?: string; // Categorical/Text (RandomGraph, Lattice)
  };
  hierarchy: {
    num_levels?: number;
    crossscale_mechanism?: string[]; // Links to MechanismNode IDs
    emergence_manifestation?: string[]; // Links to PhenomenonNode IDs
  };
  // Optional scores extracted from analysis (usually stored on PaperNode directly too)
  validation_score?: number;
  cognition_score?: number;
  criticality_score?: number;
}

export interface NodeObject {
  id: string;
  type: NodeType;
  origin?: 'wiki_section' | 'wiki_entity_file' | 'user_upload' | 'concept_design' | 'paper_analysis';
  status?: 'canonical' | 'proposed' | 'hypothetical' | 'validated' | 'deprecated'; // Added status
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
  type: 'categorizes' | 'cites-paper' | 'concept-uses' | 'related-to' | 'interplay' | 'addresses-gap' | 'defines-artifact'; // Added more types based on process.md
  value?: number;
  justification?: string;
}