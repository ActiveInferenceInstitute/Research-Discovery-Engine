# Conceptual Nexus Model (CNM): Core Schema Specification (CSS)

**Purpose:** This document defines the schema for the Conceptual Nexus Model (CNM), a knowledge graph representing concepts, entities, and relationships relevant to domains like material cognition and embodied intelligence. It specifies the types of nodes and edges used to structure the knowledge synthesized from scientific literature and research processes.

---

## Index of Node Types

*   [System Node](#system-node)
*   [Mechanism Node](#mechanism-node)
*   [Method Node](#method-node)
*   [Material Node](#material-node)
*   [Parameter Node](#parameter-node)
*   [Phenomenon/Behavior Node](#phenomenonbehavior-node)
*   [Application Node](#application-node)
*   [Theoretical Concept Node](#theoretical-concept-node)
*   [Publication Node](#publication-node)
*   [Metric Node](#metric-node)
*   [Energy Type Node](#energy-type-node)
*   [Knowledge Gap Node](#knowledge-gap-node)
*   [Knowledge Artifact Node](#knowledge-artifact-node)

*(Note: Vector representations (`VectorNode`) are derived from this graph structure and defined separately in `[[./vectors.md]]`)*

## Index of Edge Types

*   [Implements Mechanism Edge](#implements-mechanism-edge)
*   [Utilizes Method Edge](#utilizes-method-edge)
*   [Composed Of Material Edge](#composed-of-material-edge)
*   [Exhibits Phenomenon Edge](#exhibits-phenomenon-edge)
*   [Targets Application Edge](#targets-application-edge)
*   [Requires Energy Edge](#requires-energy-edge)
*   [Enables Mechanism Edge](#enables-mechanism-edge)
*   [Constrained By Parameter Edge](#constrained-by-parameter-edge)
*   [Measures Property Edge](#measures-property-edge)
*   [Models System Edge](#models-system-edge)
*   [Validated By Edge](#validated-by-edge)
*   [Based On Concept Edge](#based-on-concept-edge)
*   [References Publication Edge](#references-publication-edge)
*   [Addresses Knowledge Gap Edge](#addresses-knowledge-gap-edge)
*   [Suggests Knowledge Gap Edge](#suggests-knowledge-gap-edge)
*   [Packaged In Artifact Edge](#packaged-in-artifact-edge)
*   [Related To Edge](#related-to-edge)
*   [PartOf Edge](#partof-edge)

---

## Node Types

### System Node
*   **Definition:** Represents a specific system (experimental, theoretical, computational, proposed, etc.) analyzed or described, which integrates materials, mechanisms, etc., to perform functions or exhibit behaviors. This includes systems under design via the Discovery Engine process.
*   **Key Attributes:**
    *   `system_id`: Unique Identifier (e.g., `PublicationNode:key` for described systems, `KA_` prefix for proposed artifacts).
    *   `system_type`: Categorical (e.g., Experimental, Theoretical, Computational, Hybrid, Review, **Hypothetical**).
    *   `description`: Textual summary of the system's core components and purpose.
    *   `design_rationale`: Text (Optional, describes the motivation, possibly linking to Knowledge Gaps addressed).
    *   `domain`: Categorical List (e.g., Soft Robotics, Neuromorphic Computing, Active Matter, Bioengineering, Materials Science, Fundamental Physics).
    *   `primary_focus`: Categorical List (e.g., Sensing, Computation, Memory, Adaptation, Actuation, Self-Organization, Emergence, Theory Development, Material Synthesis).
    *   `scale`: Numerical (Characteristic length scale, nm/µm/mm/cm/m).
    *   `status`: Categorical (e.g., Proposed, Simulated, ValidatedExperimental, Published).
*   **Connections:** Linked via Edges to `[[#Mechanism Node]]`, `[[#Method Node]]`, `[[#Material Node]]`, `[[#PhenomenonBehavior Node]]`, `[[#Application Node]]`, `[[#Theoretical Concept Node]]`, `[[#Publication Node]]`, `[[#Parameter Node]]`, `[[#Energy Type Node]]`, `[[#Knowledge Gap Node]]`. May be described by a `[[#Knowledge Artifact Node]]`.

### Mechanism Node
*   **Definition:** Represents a fundamental process or causal pathway enabling system functionality (e.g., energy flow, sensing, computation, memory, adaptation, actuation, self-organization). *Conceptually corresponds to sections in `[[./mechanisms.md]]` documentation.*
*   **Key Attributes:**
    *   `mechanism_id`: Unique Identifier (e.g., `neuromorphic-computation`, `reaction-diffusion`). *Conceptual Example: `[[./mechanisms.md#neuromorphic-computation]]`*
    *   `description`: Expanded definition of the mechanism, its principles, and primitives.
    *   `category`: High-level functional category (e.g., Sensing, Computation, Memory, Adaptation, Actuation, Self-Organization, Energy).
    *   `timescale_qualitative`: Qualitative typical speed (e.g., Ultrafast, Fast, Medium, Slow, Variable).
    *   `energy_domain`: Primary energy type involved (e.g., Chemical, Electrical, Mechanical) or `None`.
*   **Connections:** Implemented by `[[#System Node]]`. Enabled by `[[#Material Node]]`, `[[#Method Node]]`, `[[#Theoretical Concept Node]]`. Can require `[[#Energy Type Node]]`. Related to other `[[#Mechanism Node]]` instances. Underpins `[[#PhenomenonBehavior Node]]`. Targeted by `[[#Application Node]]`. Basis described in `[[#Publication Node]]`. Hierarchically linked via `[[#PartOf Edge]]` to broader categories. Can be associated with `[[#Knowledge Gap Node]]`.

### Method Node
*   **Definition:** Represents a specific experimental, computational, or analytical technique used to fabricate, control, measure, or model a system or its components. *Conceptually corresponds to sections in `[[./methods.md]]` documentation.*
*   **Key Attributes:**
    *   `method_id`: Unique Identifier (e.g., `microscopy_afm`, `simulation_fem`). *Conceptual Example: `[[./methods.md#microscopy]]`*
    *   `description`: Details of the method and its purpose in context.
    *   `category`: High-level method type (e.g., Fabrication, Actuation, Characterization, Simulation, Analysis, Synthesis, Control).
    *   `output_type`: Type of data/result produced (e.g., Image, Electrical Signal, Force Data, Simulation Trajectory, Statistical Metric, Synthesized Material).
*   **Connections:** Utilized by `[[#System Node]]` or `[[#Publication Node]]` or specified in `[[#Knowledge Artifact Node]]`. Measures properties represented by `[[#Parameter Node]]`, `[[#PhenomenonBehavior Node]]`, `[[#Metric Node]]`. Utilizes `[[#Material Node]]` or specific equipment (represented abstractly or as `[[#Material Node]]`). Can require `[[#Energy Type Node]]`. Related to other `[[#Method Node]]` instances. Can validate `[[#Mechanism Node]]` or `[[#PhenomenonBehavior Node]]`. Models `[[#System Node]]`, `[[#Mechanism Node]]`, `[[#PhenomenonBehavior Node]]`. Associated with `[[#Knowledge Gap Node]]` if validation methods are missing.

### Material Node
*   **Definition:** Represents a specific substance, material composition, or class used as a component, substrate, or reagent in a system. *Conceptually corresponds to sections in `[[./materials.md]]` documentation.*
*   **Key Attributes:**
    *   `material_id`: Unique Identifier (e.g., `polymer_pdms`, `lc_nematic_5cb`). *Conceptual Example: `[[./materials.md#elastomers-general]]`*
    *   `description`: Key properties and characteristics.
    *   `category`: High-level material class (e.g., Polymer, Composite, Biological, Inorganic, Fluid, LC, **ComputationalModel**).
    *   `state_of_matter`: Categorical (e.g., Solid, Soft Solid, Liquid, Gel, Gas, Mesophase, Plasma).
    *   `key_properties`: List/Vector (e.g., Elasticity, Conductivity, Responsiveness_Thermal, Responsiveness_Optical, Biocompatibility, Sequence).
*   **Connections:** Component of `[[#System Node]]` (`[[#ComposedOf Material Edge]]`). Enables `[[#Mechanism Node]]`. Fabricated/Processed by `[[#Method Node]]`. Subject of `[[#Publication Node]]`. Hierarchically linked via `[[#PartOf Edge]]` to broader classes.

### Parameter Node
*   **Definition:** Represents a specific quantitative variable or qualitative setting that defines a system, controls its operation, characterizes its behavior, or is measured/computed.
*   **Key Attributes:**
    *   `parameter_id`: Name of the parameter (e.g., `temperature`, `learning_rate`, `assembly_index`, `youngs_modulus`, `director_field_orientation`).
    *   `value_range`: Numerical range or Categorical set observed/used. Includes specific `value` if fixed.
    *   `units`: Physical or dimensionless units.
    *   `role`: Categorical (e.g., Control, MaterialProperty, PerformanceMetric, ModelInput, StateVariable, OrderParameter, **Constraint**).
    *   `source`: Origin or context (e.g., `PublicationNode:key`, `MethodNode` ID, `SystemNode` ID).
*   **Connections:** Constrains `[[#System Node]]`, `[[#Mechanism Node]]`, `[[#PhenomenonBehavior Node]]`. Measured by `[[#Method Node]]`. Influences `[[#PhenomenonBehavior Node]]`. Quantified by `[[#Metric Node]]` (if `role=PerformanceMetric`). Defined in `[[#Publication Node]]`.

### PhenomenonBehavior Node
*   **Definition:** Represents an observable emergent behavior, property, dynamic pattern, or phenomenon exhibited by a system. *Conceptually corresponds to sections in `[[./phenomena.md]]` documentation.*
*   **Key Attributes:**
    *   `phenomenon_id`: Name (e.g., `self_propulsion`, `criticality`, `morphogenesis`, `memristance`, `pattern_classification`). *Conceptual Example: `[[./phenomena.md#criticality--phase-transitions]]`*
    *   `description`: Explanation of the behavior/property.
    *   `scale`: Macro/Meso/Micro scale of manifestation.
    *   `emergent_level`: Qualitative description of emergence (e.g., Designed Outcome, Collective Dynamics, Material Response).
*   **Connections:** Exhibited by `[[#System Node]]`. Underpinned by `[[#Mechanism Node]]`. Measured/Validated by `[[#Method Node]]` or `[[#Publication Node]]`. Quantified by `[[#Metric Node]]` or `[[#Parameter Node]]`. Enables `[[#Application Node]]`. Associated with `[[#Knowledge Gap Node]]`.

### Application Node
*   **Definition:** Represents a potential or demonstrated use case, technological domain, or functional target for a system, mechanism, or material. *Conceptually corresponds to sections in `[[./applications.md]]` documentation.*
*   **Key Attributes:**
    *   `application_id`: Name (e.g., `drug_delivery`, `soft_robotics`, `neuromorphic_hardware`, `biosensing`, `materials_discovery`).
    *   `description`: Context and scope of the application.
*   **Connections:** Targeted by `[[#System Node]]`, `[[#Mechanism Node]]`, `[[#PhenomenonBehavior Node]]`, `[[#Material Node]]`. Referenced in `[[#Publication Node]]`.

### Theoretical Concept Node
*   **Definition:** Represents a major theoretical framework, principle, abstract concept, or mathematical formalism used to model, analyze, or interpret a system or its behavior. *Conceptually corresponds to sections in `[[./theoretical.md]]` documentation.*
*   **Key Attributes:**
    *   `concept_id`: Name (e.g., `FreeEnergyPrinciple`, `StatisticalMechanics`, `AssemblyTheory`, `CategoryTheory`, `NetworkTheory`). *Conceptual Example: `[[./theoretical.md#active-inference-fep]]`*
    *   `description`: Summary of the core idea and scope.
    *   `field`: Originating discipline(s) (e.g., Physics, Biology, InfoTheory, CS, Mathematics).
*   **Connections:** Applied by `[[#System Node]]`, `[[#Publication Node]]`. Used to model/explain `[[#Mechanism Node]]`, `[[#PhenomenonBehavior Node]]`. May be instantiated/tested via `[[#Method Node]]` (especially `[[./methods.md#simulation--modeling-methods]]` or `[[./methods.md#mathematical-analysis]]`).

### Publication Node
*   **Definition:** Represents a specific scientific publication included in the analysis corpus.
*   **Key Attributes:**
    *   `publication_id`: Unique bibliographic key (e.g., `fodor_connectionism_1988`).
    *   `title`, `authors`, `year`, `journal`, `doi`, etc.
    *   `paper_type`: Categorical (Experimental, Theoretical, Review, Hybrid, **Perspective/Editorial**).
    *   `(Optional) key_findings`: Textual summary of main reported results.
*   **Connections:** Describes/Analyzes/Validates `[[#System Node]]`, `[[#Mechanism Node]]`, `[[#PhenomenonBehavior Node]]`, `[[#Material Node]]`. Uses/Introduces `[[#Method Node]]`, `[[#Theoretical Concept Node]]`. Reports `[[#Parameter Node]]`, `[[#Metric Node]]`. References other `[[#Publication Node]]` (via citation analysis, outside primary edge scope). Any node can link via `[[#References Publication Edge]]` to its source(s). Can suggest `[[#Knowledge Gap Node]]`. May propose a `[[#Knowledge Artifact Node]]`.

### Metric Node
*   **Definition:** Represents a specific quantitative measure used to evaluate performance, quality, robustness, efficiency, or other characteristics of a system, mechanism, or phenomenon.
*   **Key Attributes:**
    *   `metric_id`: Name (e.g., `accuracy_percent`, `mean_squared_error`, `correlation_length`, `power_law_exponent`, `efficiency_percent`, `retention_time_sec`, `reaction_time_ms`).
    *   `description`: What the metric quantifies.
    *   `units`: Units of measurement (or dimensionless).
    *   `optimization_goal`: Categorical (e.g., Minimize, Maximize, TargetValue, Descriptive).
*   **Connections:** Quantifies `[[#Parameter Node]]`(role=PerformanceMetric) or `[[#PhenomenonBehavior Node]]`. Assessed using `[[#Method Node]]` (Analysis/Characterization). Reported in `[[#Publication Node]]`.

### Energy Type Node
*   **Definition:** Represents a type or domain of energy relevant to the operation of systems, mechanisms, or methods.
*   **Key Attributes:**
    *   `energy_type_id`: Name (e.g., `Chemical`, `Electrical`, `Mechanical`, `Thermal`, `Optical`, `Acoustic`).
    *   `description`: Nature of the energy form.
*   **Connections:** Linked *from* energy-requiring nodes (`[[#System Node]]`, `[[#Mechanism Node]]`, `[[#Method Node]]`) via `[[#Requires Energy Edge]]`.

### Knowledge Gap Node
*   **Definition:** Represents an identified gap, open question, inconsistency, or area of uncertainty within the knowledge graph. Explicitly identified by human experts or AI agents during analysis or synthesis.
*   **Key Attributes:**
    *   `gap_id`: Unique Identifier (e.g., `KG_missing_material_for_mech_X`, `KG_conflicting_findings_phenom_Y`).
    *   `description`: Textual description of the specific gap or question.
    *   `gap_type`: Categorical (e.g., MissingData, MissingLink, Inconsistency, ValidationNeeded, MechanismUnknown, ParameterUnspecified, NeedsMethod).
    *   `related_nodes`: List of Node IDs defining the context of the gap (e.g., `mechanism:mech_X`, `material:mat_A`).
    *   `priority`: Categorical/Numerical (Optional, indicates perceived importance).
    *   `source`: How identified (e.g., `PublicationNode:key`, `DiscoveryEngineAnalysis:timestamp`, `User:username`).
*   **Connections:** Linked via `[[#Suggests Knowledge Gap Edge]]` from Nodes identifying the gap (e.g., `[[#Publication Node]]`, `ExplorationAgentOutput` [if modeled as Node]). Linked via `[[#Addresses Knowledge Gap Edge]]` from Nodes aiming to fill the gap (e.g., **Hypothetical** `[[#System Node]]`, proposed `[[#Knowledge Artifact Node]]`, `[[#Publication Node]]`).

### Knowledge Artifact Node
*   **Definition:** Represents a synthesized output from the Discovery Engine process, typically proposing a novel `[[#System Node]]` and an associated experimental/computational protocol (`[[#Method Node]]` sequence). Encapsulates a design resulting from exploring the knowledge graph.
*   **Key Attributes:**
    *   `artifact_id`: Unique Identifier (e.g., `KA_20240516_physical_rc_healing`).
    *   `description`: Textual summary generated by the design process (corresponds to Phase 4 output in `process.md`).
    *   `timestamp`: Creation date/time.
    *   `status`: Categorical (e.g., Proposed, UnderReview, AcceptedAsHypothetical).
    *   `defining_system_id`: Link to the hypothetical `[[#System Node]]` ID defined by this artifact.
    *   `protocol_description`: Text or links defining the validation protocol.
*   **Connections:** Contains/Defines a hypothetical `[[#System Node]]`. References constituent `[[#Mechanism Node]]`, `[[#Method Node]]`, `[[#Material Node]]`, `[[#Theoretical Concept Node]]` via `[[#Packaged In Artifact Edge]]`. Can link to the `[[#Publication Node]]` if later described in a paper. May link to `[[#Knowledge Gap Node]]` it aims to address. Uses `[[#Method Node]]` sequence.

---

## Edge Types (Relationships)

*(Note: Define directed links between Node pairs, potentially with attributes)*

### Implements Mechanism Edge
*   `Start Node Type:` System Node
*   `End Node Type:` Mechanism Node
*   `Relationship:` System X *implements* Mechanism Y.

### Utilizes Method Edge
*   `Start Node Type:` System Node / Publication Node / **Knowledge Artifact Node**
*   `End Node Type:` Method Node
*   `Relationship:` System/Publication/Artifact X *utilizes* Method Y (for fabrication, control, measurement, analysis, validation protocol).

### Composed Of Material Edge
*   `Start Node Type:` System Node
*   `End Node Type:` Material Node
*   `Relationship:` System X *is composed of* Material Y (as a core component).

### Exhibits Phenomenon Edge
*   `Start Node Type:` System Node
*   `End Node Type:` Phenomenon/Behavior Node
*   `Relationship:` System X *exhibits* Phenomenon/Behavior Y.
*   `Attributes:` `conditions`: Text/Structured (Specific parameter values or context needed), `quantitative_details`: Link to `ParameterNode`/`MetricNode` values.

### Targets Application Edge
*   `Start Node Type:` System Node / Mechanism Node / Phenomenon/Behavior Node / Material Node
*   `End Node Type:` Application Node
*   `Relationship:` Element X *targets* or *enables* Application Y.

### Requires Energy Edge
*   `Start Node Type:` System Node / Mechanism Node / Method Node
*   `End Node Type:` **Energy Type Node**
*   `Relationship:` Process/System X *requires* energy of type Y.
*   `Attributes:` `purpose`: Text (e.g., actuation, computation, sensing, fabrication, maintenance), `efficiency`: Numerical (Optional, %).

### Enables Mechanism Edge
*   `Start Node Type:` Material Node / Method Node / Theoretical Concept Node
*   `End Node Type:` Mechanism Node
*   `Relationship:` Element X *enables* or *is required for* Mechanism Y.

### Constrained By Parameter Edge
*   `Start Node Type:` System Node / Mechanism Node / Phenomenon/Behavior Node
*   `End Node Type:` Parameter Node
*   `Relationship:` Element X *is constrained/defined/controlled by* Parameter Y.

### Measures Property Edge
*   `Start Node Type:` Method Node
*   `End Node Type:` Parameter Node / Phenomenon/Behavior Node / Metric Node
*   `Relationship:` Method X *measures* or *quantifies* Property/Phenomenon/Metric Y.

### Models System Edge
*   `Start Node Type:` Theoretical Concept Node / Method Node (Simulation)
*   `End Node Type:` System Node / Mechanism Node / Phenomenon/Behavior Node
*   `Relationship:` Concept/Simulation X *models* or *aims to explain* System/Mechanism/Phenomenon Y.

### Validated By Edge
*   `Start Node Type:` Method Node (Experimental/Computational) / Publication Node
*   `End Node Type:` Mechanism Node / Phenomenon/Behavior Node
*   `Relationship:` Method/Publication X *provides validation for* Mechanism/Phenomenon Y.
*   `Attributes:` `validation_type`: Categorical (e.g., Experimental, Computational, Theoretical), `strength`: Categorical (e.g., Qualitative, Quantitative, Correlational, Causal), `confidence_score`: Numerical (Optional, 0-1).

### Based On Concept Edge
*   `Start Node Type:` System Node / Mechanism Node / Method Node
*   `End Node Type:` Theoretical Concept Node
*   `Relationship:` Element X *is based on* or *derived from* or *motivated by* Theoretical Concept Y.

### References Publication Edge
*   `Start Node Type:` Any Node (System, Mechanism, Concept, Material, Parameter, etc.)
*   `End Node Type:` Publication Node
*   `Relationship:` Node X *is described/analyzed/defined/introduced/validated/referenced in* Publication Y (`key`).
*   `Attributes:` `context`: Text (Describes the relevance of the publication to the node).

### Addresses Knowledge Gap Edge
*   `Start Node Type:` Knowledge Artifact Node / **Hypothetical** System Node / Publication Node / Method Node
*   `End Node Type:` Knowledge Gap Node
*   `Relationship:` Node X *attempts to address* or *provides potential resolution for* Knowledge Gap Y.

### Suggests Knowledge Gap Edge
*   `Start Node Type:` Any Node (typically `PublicationNode` reporting limitations or `SystemNode` analysis)
*   `End Node Type:` Knowledge Gap Node
*   `Relationship:` Node X *suggests* or *highlights* Knowledge Gap Y.

### Packaged In Artifact Edge
*   `Start Node Type:` Any core Node (Mechanism, Method, Material, TheoreticalConcept, Parameter, Phenomenon)
*   `End Node Type:` Knowledge Artifact Node
*   `Relationship:` Node X *is a constituent component* referenced or included in the proposal defined by Knowledge Artifact Y.

### Related To Edge
*   `Start Node Type:` Any Node
*   `End Node Type:` Any Node
*   `Relationship:` Node X *is conceptually related to* Node Y. (Use Sparingly for non-specific relations).
*   `Attributes:` `relation_type`: Text/Categorical (e.g., Analogy, Contrast, Precursor, ExampleOf, Synonym, **SeeAlso**), `description`: Text (Explain the relation).

### PartOf Edge
*   `Start Node Type:` Specific Node instance (e.g., `MechanismNode`=`memristance`, `MaterialNode`=`polymer_pdms`)
*   `End Node Type:` Broader Category Node (e.g., `MechanismNode`=`physical_structural_memory`, `MaterialNode`=`elastomer_general`)
*   `Relationship:` Node X *is a part of* / *type of* / *instance of* Node Y. Primarily used for building taxonomies and classification hierarchies.

---
