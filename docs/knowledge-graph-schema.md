# Knowledge Graph Schema - Conceptual Nexus Model (CNM)

The Research Discovery Engine uses the Conceptual Nexus Model (CNM) as its core knowledge representation framework. This document describes the schema, structure, and relationships that define how knowledge is organized and connected within the system.

## Table of Contents

1. [Overview](#overview)
2. [Core Principles](#core-principles)
3. [Node Types](#node-types)
4. [Relationship Types](#relationship-types)
5. [Property Schema](#property-schema)
6. [Metadata Standards](#metadata-standards)
7. [Knowledge Categories](#knowledge-categories)
8. [Schema Validation](#schema-validation)
9. [Extensions and Customization](#extensions-and-customization)

## Overview

### What is the Conceptual Nexus Model (CNM)?

The Conceptual Nexus Model is a structured knowledge representation framework designed to capture and interconnect scientific concepts across multiple domains. It provides:

- **Standardized Vocabulary**: Consistent terminology and classification
- **Relationship Mapping**: Explicit connections between concepts
- **Multi-Scale Integration**: Links across different levels of abstraction
- **Extensible Structure**: Ability to add new concept types and relationships

### Schema Architecture

```
┌─────────────────────────────────────────────┐
│                CNM Schema                   │
├─────────────────────────────────────────────┤
│  Node Types                                 │
│  ├── Materials                              │
│  ├── Mechanisms                             │
│  ├── Methods                                │
│  ├── Phenomena                              │
│  ├── Applications                           │
│  ├── Theoretical Concepts                   │
│  └── Documentation                          │
├─────────────────────────────────────────────┤
│  Relationship Types                         │
│  ├── Enables/Inhibits                       │
│  ├── Composed-of/Part-of                    │
│  ├── Similar-to/Analogous                   │
│  ├── Applied-in/Used-for                    │
│  └── Produces/Consumes                      │
├─────────────────────────────────────────────┤
│  Properties & Metadata                      │
│  ├── Physical Properties                    │
│  ├── Performance Metrics                    │
│  ├── Source Attribution                     │
│  └── Confidence Scores                      │
└─────────────────────────────────────────────┘
```

## Core Principles

### 1. Semantic Consistency
Every concept is defined with clear, unambiguous terminology and consistent classification across domains.

### 2. Relationship Richness
Connections between concepts are explicitly typed and weighted to capture the nature and strength of relationships.

### 3. Multi-Domain Integration
The schema supports concepts from multiple scientific domains while maintaining coherent cross-domain relationships.

### 4. Scalability
The structure can accommodate growing knowledge bases and new types of concepts without breaking existing relationships.

### 5. Provenance Tracking
All concepts and relationships include metadata about their sources, confidence levels, and validation status.

## Node Types

### Material Nodes (`MaterialNode`)

Represent substances, compounds, and materials with their properties and behaviors.

#### Core Properties
```typescript
interface MaterialNodeProperties {
  // Basic Classification
  materialClass: string;          // e.g., "polymer", "ceramic", "metal"
  subclass?: string;              // e.g., "conductive polymer"
  composition: string[];          // Chemical composition or constituents
  
  // Physical Properties
  density?: number;               // kg/m³
  meltingPoint?: number;          // °C
  glassTransitionTemp?: number;   // °C for polymers
  crystallinity?: number;         // % crystalline
  
  // Mechanical Properties
  youngModulus?: number;          // GPa
  tensileStrength?: number;       // MPa
  elongationAtBreak?: number;     // %
  hardness?: string;              // Shore A, Rockwell, etc.
  
  // Electrical Properties
  conductivity?: number;          // S/m
  dielectricConstant?: number;    // relative permittivity
  bandgap?: number;               // eV for semiconductors
  
  // Thermal Properties
  thermalConductivity?: number;   // W/m·K
  heatCapacity?: number;          // J/g·K
  thermalExpansion?: number;      // 1/K
  
  // Optical Properties
  refractiveIndex?: number;       // n
  transparency?: string;          // "transparent", "translucent", "opaque"
  color?: string;                 // visible color
  
  // Processing Information
  synthesisMethod?: string[];     // How it's made
  processability?: string[];      // Processing techniques applicable
  
  // Application Context
  commonUses?: string[];          // Typical applications
  limitations?: string[];         // Known constraints
}
```

#### Examples
- `graphene--2d-materials`: Single-layer graphene with exceptional electrical and mechanical properties
- `pedot-pss--conductive-polymers`: Conductive polymer blend for flexible electronics
- `titanium-dioxide--ceramics`: TiO₂ with photocatalytic properties

### Mechanism Nodes (`MechanismNode`)

Represent processes, phenomena, and underlying principles that govern behavior.

#### Core Properties
```typescript
interface MechanismNodeProperties {
  // Classification
  mechanismType: string;          // "energy-conversion", "transport", "self-assembly"
  scale: string;                  // "molecular", "microscopic", "macroscopic"
  domain: string[];               // Scientific domains involved
  
  // Process Description
  inputStimuli: string[];         // What triggers the mechanism
  outputs: string[];              // What the mechanism produces
  intermediateSteps?: string[];   // Process stages
  
  // Quantitative Aspects
  efficiency?: number;            // % efficiency if applicable
  responseTime?: number;          // Time scale (seconds)
  energyRequired?: number;        // Activation energy (kJ/mol)
  
  // Environmental Factors
  temperatureRange?: [number, number]; // Operating temperature (°C)
  pressureRange?: [number, number];    // Operating pressure (Pa)
  pHRange?: [number, number];          // pH dependence
  
  // Governing Equations
  fundamentalEquations?: string[];     // Mathematical descriptions
  keyParameters?: string[];            // Important variables
  
  // Biological Context (if applicable)
  biologicalOrigin?: string;           // Where found in nature
  evolutionaryAdvantage?: string;      // Why it evolved
}
```

#### Examples
- `piezoelectric-effect`: Mechanical-to-electrical energy conversion in crystals
- `self-assembly-amphiphiles`: Spontaneous organization of molecules with hydrophilic/hydrophobic parts
- `shape-memory-effect`: Temperature-induced recovery of original shape

### Method Nodes (`MethodNode`)

Represent experimental techniques, analytical methods, and fabrication processes.

#### Core Properties
```typescript
interface MethodNodeProperties {
  // Classification
  methodType: string;             // "characterization", "synthesis", "fabrication"
  category: string;               // "microscopy", "spectroscopy", "mechanical-testing"
  
  // Technical Specifications
  resolution?: string;            // Spatial, temporal, or energy resolution
  accuracy?: number;              // Measurement accuracy
  precision?: number;             // Repeatability
  detectionLimit?: string;        // Minimum detectable amount
  
  // Operational Parameters
  sampleRequirements: string[];   // Sample preparation needs
  environmentalConditions?: string[]; // Required conditions
  duration?: string;              // Time required
  
  // Equipment and Resources
  requiredEquipment: string[];    // Necessary instruments
  consumables?: string[];         // Materials consumed
  expertise?: string;             // Required skill level
  cost?: string;                  // Relative cost (low/medium/high)
  
  // Data Output
  dataTypes: string[];            // Types of data produced
  dataFormat?: string[];          // Output formats
  analysisTools?: string[];       // Software for analysis
  
  // Limitations and Considerations
  limitations: string[];          // Known constraints
  interferences?: string[];       // Potential sources of error
  complementaryMethods?: string[]; // Methods often used together
}
```

#### Examples
- `atomic-force-microscopy`: High-resolution surface imaging technique
- `differential-scanning-calorimetry`: Thermal analysis method for phase transitions
- `electrospinning`: Fiber fabrication technique using electric fields

### Phenomenon Nodes (`PhenomenonNode`)

Represent observable effects, behaviors, and emergent properties.

#### Core Properties
```typescript
interface PhenomenonNodeProperties {
  // Classification
  phenomenonType: string;         // "physical", "chemical", "biological"
  observationScale: string;       // Scale at which observed
  emergentLevel: string;          // Level of emergence
  
  // Observable Characteristics
  manifestations: string[];       // How it appears/is detected
  measurableQuantities: string[]; // What can be quantified
  typicalMagnitude?: string;      // Typical size/strength
  
  // Conditions for Occurrence
  requiredConditions: string[];   // Necessary conditions
  triggerEvents?: string[];       // What initiates it
  sustainingFactors?: string[];   // What maintains it
  
  // Temporal Aspects
  timeScale: string;              // How long it takes/lasts
  reversibility: string;          // "reversible", "irreversible", "partially-reversible"
  
  // Spatial Aspects
  spatialExtent: string;          // How far it extends
  propagation?: string;           // How it spreads
  
  // Dependencies and Relationships
  dependentVariables: string[];   // What affects its magnitude
  correlatedPhenomena?: string[]; // Related observable effects
}
```

#### Examples
- `superhydrophobicity`: Extreme water repellency with contact angles >150°
- `thermochromism`: Color change in response to temperature
- `mechano-luminescence`: Light emission under mechanical stress

### Application Nodes (`ApplicationNode`)

Represent practical uses, devices, and implementations.

#### Core Properties
```typescript
interface ApplicationNodeProperties {
  // Classification
  applicationType: string;        // "device", "system", "process"
  industryDomain: string[];       // Target industries
  technologyReadiness: number;    // TRL 1-9
  
  // Functional Description
  primaryFunction: string;        // Main purpose
  keyFeatures: string[];          // Important characteristics
  performanceMetrics: string[];   // How success is measured
  
  // Technical Requirements
  operatingConditions: string[];  // Environmental requirements
  powerRequirements?: string;     // Energy needs
  sizeConstraints?: string;       // Physical limitations
  
  // Market and Commercial Aspects
  targetMarket: string[];         // Intended users/markets
  competitiveAdvantages: string[]; // What makes it better
  challenges: string[];           // Current limitations
  
  // Development Status
  developmentStage: string;       // Current maturity level
  keyMilestones?: string[];       // Important achievements
  futureDevelopments?: string[];  // Planned improvements
}
```

#### Examples
- `flexible-displays`: Bendable electronic display technology
- `self-healing-materials-aerospace`: Materials that repair damage autonomously
- `wearable-health-monitoring`: Body-worn sensors for continuous health tracking

### Theoretical Nodes (`TheoreticalNode`)

Represent conceptual frameworks, models, and abstract principles.

#### Core Properties
```typescript
interface TheoreticalNodeProperties {
  // Classification
  theoryType: string;             // "model", "framework", "principle"
  abstractionLevel: string;       // Level of abstraction
  mathematicalFormalism: string;  // Mathematical approach used
  
  // Conceptual Description
  fundamentalAssumptions: string[]; // Core assumptions
  scopeOfApplication: string[];    // Where it applies
  limitations: string[];           // Known bounds
  
  // Mathematical Representation
  keyEquations?: string[];         // Important mathematical expressions
  variables: string[];             // Key variables/parameters
  constants?: string[];            // Important constants
  
  // Validation and Evidence
  experimentalSupport: string;     // Level of experimental validation
  keyExperiments?: string[];       // Supporting experiments
  contradictoryEvidence?: string[]; // Conflicting data
  
  // Relationships to Other Theories
  derivedFrom?: string[];          // Parent theories
  derivedTheories?: string[];      // Child theories
  competingTheories?: string[];    // Alternative approaches
}
```

#### Examples
- `density-functional-theory`: Quantum mechanical modeling method
- `percolation-theory`: Framework for understanding connectivity transitions
- `active-inference-principle`: Theoretical framework for adaptive behavior

### Documentation Nodes (`DocumentationNode`)

Represent schema specifications, protocols, and structural information.

#### Core Properties
```typescript
interface DocumentationNodeProperties {
  // Classification
  documentType: string;           // "schema", "protocol", "specification"
  version: string;                // Version identifier
  status: string;                 // "draft", "active", "deprecated"
  
  // Content Description
  purpose: string;                // What it documents
  scope: string[];                // What it covers
  audience: string[];             // Intended users
  
  // Structure and Organization
  sections: string[];             // Main sections
  dependencies?: string[];        // Required knowledge
  references?: string[];          // External references
  
  // Maintenance Information
  lastUpdated: string;            // ISO date string
  maintainer: string;             // Who maintains it
  reviewCycle?: string;           // How often reviewed
}
```

## Relationship Types

### Causal Relationships

#### `enables`
One concept enables or facilitates another.

```typescript
interface EnablesRelationship {
  type: "enables";
  strength: number;              // 0-1, strength of enabling
  conditions?: string[];         // Under what conditions
  efficiency?: number;           // How efficiently
  mechanism?: string;            // How it enables
}
```

**Examples:**
- `piezoelectric-materials` enables `energy-harvesting-devices`
- `self-assembly-mechanisms` enables `bottom-up-fabrication`

#### `inhibits`
One concept prevents or reduces another.

```typescript
interface InhibitsRelationship {
  type: "inhibits";
  strength: number;              // 0-1, strength of inhibition
  reversible: boolean;           // Can it be overcome?
  mechanism?: string;            // How it inhibits
}
```

**Examples:**
- `high-temperature` inhibits `polymer-stability`
- `moisture` inhibits `adhesion-performance`

### Compositional Relationships

#### `composed-of`
One concept is made up of another.

```typescript
interface ComposedOfRelationship {
  type: "composed-of";
  fraction?: number;             // 0-1, what fraction
  role: string;                  // Role of component
  essential: boolean;            // Is it essential?
}
```

**Examples:**
- `conductive-composites` composed-of `carbon-nanotubes`
- `smart-materials` composed-of `shape-memory-alloys`

#### `part-of`
One concept is part of a larger system.

```typescript
interface PartOfRelationship {
  type: "part-of";
  function: string;              // Function within the whole
  replaceable: boolean;          // Can it be substituted?
  criticality: string;           // How critical is it?
}
```

### Similarity Relationships

#### `similar-to`
Concepts share common properties or behaviors.

```typescript
interface SimilarToRelationship {
  type: "similar-to";
  similarity: number;            // 0-1, degree of similarity
  aspects: string[];             // In what ways similar
  differences?: string[];        // How they differ
}
```

**Examples:**
- `graphene` similar-to `carbon-nanotubes` (both carbon-based 2D/1D materials)
- `gecko-adhesion` similar-to `synthetic-dry-adhesives`

#### `analogous-to`
Concepts function similarly in different contexts.

```typescript
interface AnalogousToRelationship {
  type: "analogous-to";
  functionalSimilarity: number;  // 0-1, functional similarity
  context: string[];             // Different contexts
  transferability: string;       // How transferable is insight?
}
```

### Functional Relationships

#### `applied-in`
One concept is used in another context.

```typescript
interface AppliedInRelationship {
  type: "applied-in";
  role: string;                  // Role in application
  maturity: string;              // How mature is application?
  performance?: string;          // How well does it work?
}
```

#### `produces`
One concept generates or creates another.

```typescript
interface ProducesRelationship {
  type: "produces";
  yield?: number;                // How much produced
  efficiency?: number;           // Efficiency of production
  conditions: string[];          // Required conditions
}
```

## Property Schema

### Physical Properties

#### Dimensional Properties
```typescript
interface DimensionalProperties {
  length?: number;               // m
  width?: number;                // m
  height?: number;               // m
  diameter?: number;             // m
  thickness?: number;            // m
  area?: number;                 // m²
  volume?: number;               // m³
}
```

#### Mechanical Properties
```typescript
interface MechanicalProperties {
  density: number;               // kg/m³
  youngModulus?: number;         // GPa
  poissonRatio?: number;         // dimensionless
  tensileStrength?: number;      // MPa
  compressiveStrength?: number;  // MPa
  flexuralStrength?: number;     // MPa
  hardness?: number;             // Various scales
  toughness?: number;            // kJ/m²
  fatigueTesting?: string;       // Fatigue behavior
}
```

#### Electrical Properties
```typescript
interface ElectricalProperties {
  conductivity?: number;         // S/m
  resistivity?: number;          // Ω⋅m
  dielectricConstant?: number;   // relative permittivity
  dielectricStrength?: number;   // V/m
  bandgap?: number;              // eV
  carrierMobility?: number;      // m²/(V⋅s)
  workFunction?: number;         // eV
}
```

#### Thermal Properties
```typescript
interface ThermalProperties {
  meltingPoint?: number;         // °C
  boilingPoint?: number;         // °C
  glassTransitionTemp?: number;  // °C
  thermalConductivity?: number;  // W/(m⋅K)
  thermalDiffusivity?: number;   // m²/s
  heatCapacity?: number;         // J/(kg⋅K)
  thermalExpansion?: number;     // K⁻¹
}
```

#### Optical Properties
```typescript
interface OpticalProperties {
  refractiveIndex?: number;      // n
  extinction?: number;           // k
  transmittance?: number;        // % or fraction
  reflectance?: number;          // % or fraction
  absorbance?: number;           // dimensionless
  bandgap?: number;              // eV
  photoluminescence?: string;    // emission characteristics
}
```

### Performance Metrics

#### Efficiency Metrics
```typescript
interface EfficiencyMetrics {
  energyEfficiency?: number;     // % or fraction
  quantumEfficiency?: number;    // % for photonic processes
  conversionEfficiency?: number; // % for energy conversion
  selectivity?: number;          // % for chemical processes
  yield?: number;                // % for manufacturing
}
```

#### Durability Metrics
```typescript
interface DurabilityMetrics {
  cycleLife?: number;            // number of cycles
  operatingLifetime?: number;    // hours or cycles
  degradationRate?: number;      // % per unit time
  environmentalStability?: string; // stability under conditions
  chemicalCompatibility?: string[]; // compatible chemicals
}
```

### Quality and Confidence Metrics

#### Source Attribution
```typescript
interface SourceAttribution {
  primarySource: string;         // Original publication/database
  doi?: string;                  // Digital Object Identifier
  authors?: string[];            // Authors if applicable
  publicationYear?: number;      // Year published
  experimentalMethod?: string;   // How data was obtained
  measurementUncertainty?: number; // ± uncertainty
}
```

#### Confidence Scoring
```typescript
interface ConfidenceMetrics {
  dataQuality: number;           // 0-1, quality of source data
  validationLevel: number;       // 0-1, how well validated
  reproducibility: number;       // 0-1, how reproducible
  expertCuration: number;        // 0-1, level of expert review
  communityConsensus: number;    // 0-1, agreement level
  overallConfidence: number;     // 0-1, combined confidence
}
```

## Metadata Standards

### Node Metadata
```typescript
interface NodeMetadata {
  // Identification
  id: string;                    // Unique identifier
  version: string;               // Schema version
  created: string;               // ISO date string
  lastModified: string;          // ISO date string
  
  // Classification
  category: string;              // Primary category
  subcategories?: string[];      // Additional classifications
  tags: string[];                // Searchable tags
  
  // Quality and Provenance
  confidence: ConfidenceMetrics;
  sources: SourceAttribution[];
  validationStatus: string;      // "draft", "reviewed", "validated"
  
  // Relationships
  relationshipCount: number;     // Total relationships
  inboundLinks: number;          // Incoming relationships
  outboundLinks: number;         // Outgoing relationships
  
  // Usage and Analytics
  viewCount?: number;            // How often accessed
  searchRank?: number;           // Search relevance score
  lastAccessed?: string;         // ISO date string
}
```

### Relationship Metadata
```typescript
interface RelationshipMetadata {
  // Identification
  id: string;                    // Unique relationship ID
  source: string;                // Source node ID
  target: string;                // Target node ID
  
  // Classification
  type: RelationshipType;        // Type of relationship
  strength: number;              // 0-1, relationship strength
  confidence: number;            // 0-1, confidence in relationship
  
  // Provenance
  derivedFrom: string[];         // Source of relationship
  validatedBy?: string[];        // Who validated it
  created: string;               // ISO date string
  lastModified: string;          // ISO date string
  
  // Context
  contextualFactors?: string[];  // Conditions affecting relationship
  temporalAspects?: string;      // Time-dependent aspects
  bidirectional: boolean;        // Is relationship symmetric?
}
```

## Knowledge Categories

### Materials Category

#### Hierarchical Structure
```
Materials
├── Organic Materials
│   ├── Polymers
│   │   ├── Thermoplastics
│   │   ├── Thermosets
│   │   └── Elastomers
│   ├── Biomaterials
│   └── Small Molecules
├── Inorganic Materials
│   ├── Metals
│   ├── Ceramics
│   ├── Semiconductors
│   └── Glasses
├── Composite Materials
│   ├── Fiber-reinforced
│   ├── Particle-reinforced
│   └── Layered
└── Nanomaterials
    ├── 0D (quantum dots)
    ├── 1D (nanotubes, nanowires)
    ├── 2D (graphene, MoS₂)
    └── 3D (nanostructured)
```

#### Material Properties Classification
- **Structural Properties**: Mechanical, thermal, dimensional
- **Functional Properties**: Electrical, optical, magnetic
- **Surface Properties**: Adhesion, wetting, friction
- **Chemical Properties**: Reactivity, stability, compatibility
- **Processing Properties**: Moldability, machinability, solubility

### Mechanisms Category

#### Process Classifications
```
Mechanisms
├── Energy Conversion
│   ├── Mechanical ↔ Electrical
│   ├── Thermal ↔ Electrical
│   ├── Optical ↔ Electrical
│   └── Chemical ↔ Electrical
├── Transport Phenomena
│   ├── Mass Transport
│   ├── Heat Transport
│   ├── Charge Transport
│   └── Momentum Transport
├── Phase Transitions
│   ├── Solid-Liquid
│   ├── Liquid-Gas
│   ├── Solid-Solid
│   └── Order-Disorder
├── Self-Assembly
│   ├── Molecular Assembly
│   ├── Supramolecular Assembly
│   └── Hierarchical Assembly
└── Signal Transduction
    ├── Mechanical Sensing
    ├── Chemical Sensing
    ├── Optical Sensing
    └── Electrical Sensing
```

### Methods Category

#### Technique Classifications
```
Methods
├── Synthesis & Fabrication
│   ├── Chemical Synthesis
│   ├── Physical Deposition
│   ├── Solution Processing
│   └── Additive Manufacturing
├── Characterization
│   ├── Structural Analysis
│   ├── Compositional Analysis
│   ├── Property Measurement
│   └── Performance Testing
├── Computational Methods
│   ├── Molecular Modeling
│   ├── Continuum Simulation
│   ├── Machine Learning
│   └── Data Analysis
└── Processing & Treatment
    ├── Thermal Treatment
    ├── Mechanical Processing
    ├── Chemical Treatment
    └── Surface Modification
```

## Schema Validation

### Validation Rules

#### Node Validation
```typescript
const nodeValidationRules = {
  // Required fields
  required: ['id', 'type', 'category'],
  
  // Type-specific requirements
  MaterialNode: {
    required: ['materialClass', 'composition'],
    optional: ['density', 'meltingPoint', 'conductivity']
  },
  
  MechanismNode: {
    required: ['mechanismType', 'scale', 'inputStimuli', 'outputs'],
    optional: ['efficiency', 'responseTime']
  },
  
  // Property constraints
  constraints: {
    density: { min: 0, max: 30000 },      // kg/m³
    temperature: { min: -273, max: 10000 }, // °C
    efficiency: { min: 0, max: 1 }         // fraction
  }
};
```

#### Relationship Validation
```typescript
const relationshipValidationRules = {
  // Valid relationship combinations
  validCombinations: {
    'MaterialNode → MechanismNode': ['enables', 'inhibits', 'produces'],
    'MechanismNode → ApplicationNode': ['applied-in', 'enables'],
    'MaterialNode → MaterialNode': ['similar-to', 'composed-of', 'analogous-to']
  },
  
  // Strength constraints
  strengthRules: {
    'enables': { min: 0.1, max: 1.0 },
    'similar-to': { min: 0.1, max: 0.9 },  // Can't be identical
    'composed-of': { min: 0.01, max: 1.0 }
  },
  
  // Logical constraints
  logicalRules: [
    'enables_inhibits_exclusive',  // Can't both enable and inhibit
    'composed_of_reflexive',       // Can't be composed of itself
    'similarity_symmetric'         // Similarity should be bidirectional
  ]
};
```

### Validation Implementation

#### Schema Validator
```typescript
class CNMValidator {
  validateNode(node: NodeObject): ValidationResult {
    const errors: string[] = [];
    
    // Check required fields
    if (!node.id || !node.type) {
      errors.push('Missing required fields: id, type');
    }
    
    // Type-specific validation
    const typeRules = nodeValidationRules[node.type];
    if (typeRules) {
      typeRules.required.forEach(field => {
        if (!node.properties?.[field]) {
          errors.push(`Missing required property: ${field}`);
        }
      });
    }
    
    // Property constraints
    this.validateProperties(node.properties, errors);
    
    return {
      valid: errors.length === 0,
      errors,
      warnings: this.generateWarnings(node)
    };
  }
  
  validateRelationship(rel: LinkObject, sourceNode: NodeObject, targetNode: NodeObject): ValidationResult {
    const errors: string[] = [];
    
    // Check valid combinations
    const combo = `${sourceNode.type} → ${targetNode.type}`;
    const validTypes = relationshipValidationRules.validCombinations[combo];
    
    if (!validTypes?.includes(rel.type)) {
      errors.push(`Invalid relationship type ${rel.type} for ${combo}`);
    }
    
    // Check strength constraints
    const strengthRule = relationshipValidationRules.strengthRules[rel.type];
    if (strengthRule && rel.weight) {
      if (rel.weight < strengthRule.min || rel.weight > strengthRule.max) {
        errors.push(`Relationship strength ${rel.weight} outside valid range`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings: []
    };
  }
}
```

## Extensions and Customization

### Adding New Node Types

#### Custom Node Type Definition
```typescript
interface CustomNodeType extends NodeObject {
  type: 'CustomNode';
  properties: CustomNodeProperties;
}

interface CustomNodeProperties {
  // Define custom properties
  customProperty1: string;
  customProperty2: number;
  // Inherit common properties
  category: string;
  description: string;
}
```

#### Registration Process
```typescript
// Register new node type
CNMSchema.registerNodeType('CustomNode', {
  validationRules: customValidationRules,
  propertySchema: customPropertySchema,
  relationships: customRelationshipRules
});
```

### Custom Relationship Types

#### Definition
```typescript
interface CustomRelationship extends LinkObject {
  type: 'custom-relationship';
  properties: {
    customAspect: string;
    intensity: number;
  };
}
```

#### Implementation
```typescript
CNMSchema.registerRelationshipType('custom-relationship', {
  validSourceTypes: ['MaterialNode', 'CustomNode'],
  validTargetTypes: ['ApplicationNode'],
  propertySchema: customRelPropertySchema,
  validationFunction: customRelValidation
});
```

### Domain-Specific Extensions

#### Biological Systems Extension
```typescript
interface BiologicalNodeProperties extends NodeProperties {
  organism?: string;
  tissue?: string;
  cellType?: string;
  biologicalFunction: string[];
  evolutionaryOrigin?: string;
}
```

#### Energy Systems Extension
```typescript
interface EnergyNodeProperties extends NodeProperties {
  energyType: string;            // "electrical", "thermal", "mechanical"
  powerDensity?: number;         // W/m³
  energyDensity?: number;        // J/m³
  efficiency?: number;           // %
  scalability: string;           // "laboratory", "pilot", "commercial"
}
```

This schema documentation provides the foundation for understanding and working with the CNM knowledge representation system. For implementation details, see the [Developer Guide](developer-guide.md) and [API Reference](api-reference.md). 