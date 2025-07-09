# Future medicine: from molecular pathways to the collective intelligence of the body

__Paper Type:__ Review

## M1: System Overview & Implementation
*   **Vector ID:** M1
*   **Vector Type:** Overview

### **1.1 System Description**

*   **Vector ID:** M1.1
*   **Vector Type:** Description
    *   Content: The paper reviews and proposes a framework viewing biological systems (specifically tissues, organs, and cellular collectives) as reprogrammable, information-processing systems exhibiting collective intelligence. It focuses on the multiscale competency architecture where cells and tissues solve problems in physiological, transcriptional, and anatomical spaces. Key examples used are liver regeneration (hepatostat), developmental bioelectricity (pattern control, regeneration induction, cancer suppression), and general principles of anatomical homeostasis and allostasis. The purpose is to advocate for a new approach to biomedicine ('somatic psychiatry') that targets the computational and decision-making capabilities of these cellular collectives (their physiological 'software') rather than solely focusing on molecular 'hardware', aiming to induce self-repair and regeneration by communicating desired anatomical outcomes. Components include cells, ion channels, gap junctions, gene regulatory networks, extracellular matrix, and the resulting tissue/organ structures. The system *does* exhibit problem-solving, adaptation, memory, and goal-directed behavior in morphogenesis and regeneration.
    *   CT-GIN Mapping: `SystemNode` attributes: `systemType`: BiologicalCollective, `domain`: Biomedicine/RegenerativeMedicine/DevelopmentalBiology, `mechanism`: CollectiveIntelligence/Bioelectricity/DevelopmentalSignaling/Homeostasis, `components`: Cells/IonChannels/GapJunctions/GRNs/ECM, `purpose`: MaintainAnatomicalHomeostasis/Regenerate/Develop/ProposeBiomedicalFramework. `SystemNode` connected via `ContainsEdge` to `ComponentNode`s. `SystemNode` connected via `ExhibitsEdge` to `BehaviorArchetypeNode`s (e.g., Regeneration, Homeostasis, Computation, Learning).
    *   Implicit/Explicit: Explicit
        *  Justification: The paper explicitly describes the biological systems, their components (cells, bioelectric networks, etc.), their observed behaviors (homeostasis, regeneration), and the proposed biomedical purpose throughout the text, particularly in the Abstract, Introduction, and specific sections like "Wisdom of the body" and "Developmental bioelectricity".

### **1.2 Implementation Clarity**

*   **Vector ID:** M1.2
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: As a review paper proposing a framework, the "implementation" refers to the clarity of the conceptual framework and the description of the biological examples used. The concepts (collective intelligence, bioelectricity, homeostasis, anatomical compiler) are generally well-explained with references to specific biological phenomena (liver regeneration, planarian studies, Xenopus bioelectricity). Figures illustrate key ideas (multiscale competency, bioelectric patterns). However, the precise mechanisms linking low-level components (ion channels) to high-level outcomes (organ regeneration) are complex and not fully detailed, reflecting the nature of the field and the review format. The proposed "anatomical compiler" is a conceptual goal, not an implemented system.
    *   Implicit/Explicit: Mixed
        * Justification: The conceptual framework and biological examples are explicitly described. The level of detail regarding the precise implementation of these processes in vivo is often implicit, relying on cited works and the current understanding in the field.

### **1.3 Key Parameters**

*   **Vector ID:** M1.3
*   **Vector Type:** ParameterTable
    *   Table:
        | Parameter Name | Value | Units | Source (Fig/Table/Section) | Implicit/Explicit | Data Reliability (High/Medium/Low) | Derivation Method (if Implicit) |
        | :------------- | :---: | :---: | :-----------------------: | :-----------------: | :-----------------------------: | :-------------------------------: |
        | Cellular Resting Potential (Vmem) | Qualitative importance stressed, specific values N/A in review | mV | Section: Developmental bioelectricity; Fig 5 | Explicit (concept), Implicit (values) | Medium | Inferred from general cell biology/bioelectricity context discussed. |
        | Gap Junction Connectivity | Qualitative importance stressed, specific topology N/A in review | N/A (Connectivity measure) | Section: Developmental bioelectricity; Fig 5 | Explicit (concept), Implicit (values) | Medium | Inferred from role in bioelectric network formation. |
        | Target Morphology Setpoint (Bioelectric) | Concept described, specific pattern encoding N/A in review | N/A (Pattern information) | Sections: Wisdom of body, Developmental bioelectricity; Fig 2A, Fig 5F | Explicit (concept), Implicit (encoding) | Low | Inferred from discussion of bioelectric prepatterns encoding target morphology. |
        | Need of Function Threshold (Liver) | Concept described, specific threshold N/A in review | N/A (Functional deficit measure) | Section: The 'hepatostat'; Fig 4 | Explicit (concept), Implicit (value) | Medium | Inferred from description of liver regeneration triggered by functional demand. |
        | Timescale of Bioelectric Signal Intervention (Regeneration) | ~1 hour (Monensin example) | hours | Section: Tapping into cellular intelligence; Fig 6B, 6C; Ref [90], [78] | Explicit | High | Based on specific experimental examples cited. |

    *   **Note:** The paper is a review, focusing on concepts. Specific quantitative parameters for the *general framework* are often qualitative or illustrative through examples.

## M2: Energy Flow
*   **Vector ID:** M2
*   **Vector Type:** Energy

### **2.1 Energy Input**

*   **Vector ID:** M2.1
*   **Vector Type:** Input
    *   Content: The primary energy source for the biological processes described (cell function, signaling, morphogenesis, regeneration) is metabolic energy derived from biochemical reactions (e.g., ATP hydrolysis). For experimental *manipulations* (e.g., bioelectric interventions), external energy sources like electrical fields (implicit) or light (for optogenetics, Fig 5E, 5G) might be used.
    *   Value: N/A
    *   Units: N/A (Metabolic energy flux not quantified in review)
    *   CT-GIN Mapping: `EnergyInputNode`: attributes - `source`: Metabolic/Chemical (intrinsic), Electrical/Optical (extrinsic manipulation), `type`: Biochemical/Electrical/Optical.
    *   Implicit/Explicit: Implicit
        *  Justification: The review assumes the standard biological context where metabolic energy powers cellular processes. It doesn't explicitly detail ATP hydrolysis rates or energy budgets for the phenomena discussed. External energy inputs for manipulation are implied by techniques mentioned (optogenetics, electroceuticals).

### **2.2 Energy Transduction**

*   **Vector ID:** M2.2
*   **Vector Type:** Transduction
    *   Content: Energy is transduced through multiple pathways. Metabolic energy drives ion pumps maintaining membrane potentials (chemical to electrical). Ion flow through channels represents electrical energy conversion. Gap junctions facilitate electro-chemical signaling. Gene expression and protein synthesis involve conversion of chemical energy. Cell movement and tissue rearrangement convert chemical energy into mechanical work. In optogenetics, light energy is converted to electrical energy (ion flow).
    *   CT-GIN Mapping: `EnergyTransductionEdge`: attributes - `mechanism`: IonPumping/IonFlow/GapJunctionSignaling/Metabolism/GeneExpression/MechanicalWork/Phototransduction, `from_node`: EnergyInputNode/MetabolicStateNode, `to_node`: BioelectricStateNode/CellStateNode/MechanicalStateNode. Creates paths like Chemical -> Electrical -> CellBehavior.
    *   Implicit/Explicit: Implicit
        *  Justification: These energy transduction mechanisms are fundamental to the biological processes discussed (bioelectricity, cell behavior) but are not explicitly detailed in terms of energy flow pathways or efficiencies within the review text itself. They are inferred from the context of cell biology and the mechanisms mentioned (ion channels, gene expression, etc.).

### **2.3 Energy Efficiency**

*   **Vector ID:** M2.3
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification/Metrics: The review does not discuss or provide metrics for the energy efficiency of the biological processes (e.g., morphogenesis, regeneration) or the proposed interventions. This is outside the scope of the conceptual framework presented.
    *   CT-GIN Mapping: N/A
    *   Implicit/Explicit: Explicit (Absence of information is explicit)
      *  Justification: The paper explicitly omits any discussion of energy efficiency related to these biological processes.

### **2.4 Energy Dissipation**

*   **Vector ID:** M2.4
*   **Vector Type:** Dissipation
    *   Content: Energy dissipation occurs primarily as heat generated during metabolic processes, electrical resistance during ion flow, mechanical friction during cell movement, and inefficiencies in biochemical reactions. The review does not quantify these mechanisms. Qualitative assessment: Biological processes are inherently dissipative, necessary to maintain non-equilibrium states, but specific rates or dominant mechanisms are not discussed.
    *   CT-GIN Mapping: Creates `EnergyDissipationNode`s (e.g., Heat, Friction) and `EnergyDissipationEdge`s connecting relevant process nodes (e.g., `MetabolicStateNode`, `BioelectricStateNode`, `MechanicalStateNode`) to `EnergyDissipationNode`s.
    *    Implicit/Explicit: Implicit
        *  Justification: Dissipation is a fundamental aspect of thermodynamics in biological systems, but the review does not explicitly mention or quantify specific dissipation pathways related to the phenomena discussed. It's inferred from the general physics of biological processes.

## M3: Memory
*   **Vector ID:** M3
*   **Vector Type:** Memory

### **3.1 Memory Presence:**

*   **Vector ID:** M3.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The paper explicitly and repeatedly discusses memory in various forms within biological systems: "pattern memory" in anatomical homeostasis (Fig 2A, Box 2), bioelectric states encoding target morphology ("setpoints") that persist and guide regeneration (Section: Developmental bioelectricity, Fig 5F), "trophic memory" in deer antlers (Fig 3D,D'), learning and memory in gene regulatory networks and signaling pathways (Box 1, Refs [7, 24-26]), and memory influencing cell behavior based on history (Box 1). These persistent states influence future development, regeneration, and adaptation.
    *    Implicit/Explicit: Explicit
        * Justification: The concept of memory in various biological contexts (bioelectric, transcriptional, anatomical) is a central theme and explicitly stated throughout the text and figures.

**(Conditional: M3.1 is "Yes", proceed with M3.2-M3.8)**

### **3.2 Memory Type:**

*   **Vector ID:** M3.2
*   **Vector Type:** Score
*   Score: 6
*   Justification: The paper describes several types of biological memory impacting future states:
    1.  **Bioelectric Pattern Memory:** Stable spatial patterns of Vmem encode target morphology (setpoints) for development and regeneration. These can be re-written experimentally (e.g., two-headed planaria). This represents a form of persistent state information guiding future structure (High retention, potentially complex capacity, readout via cell behavior). (Explicit, Sec: Developmental bioelectricity, Fig 5F, Ref [72])
    2.  **Transcriptional/Pathway Memory:** Gene regulatory networks and signaling pathways exhibit learning/memory, changing their response based on prior stimuli (associative learning discussed). (Explicit, Box 1, Refs [7, 24-26])
    3.  **Trophic Memory:** Anatomical memory persisting across regeneration cycles (e.g., deer antlers, planaria). Mechanism less clear but involves non-genetic pattern information. (Explicit, Fig 3D,D', Box 2, Ref [2])
    4.  **Cellular Memory:** Individual cells make decisions based on a history of perceptions. (Explicit, Box 1, Ref [1])
    These mechanisms represent persistent, modifiable states influencing future behavior, justifying a score above simple responsivity but below high-fidelity digital memory due to the biological substrate and potential for noise/drift (though biological systems demonstrate remarkable stability). Readout accuracy is functional (correct anatomy achieved) but not quantified in bits. Capacity is likely high but undefined. Retention can be long-term (lifespan, across regeneration cycles).
*   CT-GIN Mapping: Defines `MemoryNode` types: `BioelectricPatternMemory`, `TranscriptionalMemory`, `AnatomicalMemory`, `CellularMemory`. Attributes: `substrate` (Vmem distribution, GRN state, tissue structure), `retention` (Qualitative: Long-term, Persistent), `capacity` (Qualitative: High/Undefined), `readout_mechanism` (CellBehaviorControl, GeneExpression).
*    Implicit/Explicit: Explicit
    * Justification: The different types of memory (bioelectric, transcriptional, trophic, cellular) and their roles are explicitly discussed and presented as key concepts in the paper.

### **3.3 Memory Retention Time:**

*   **Vector ID:** M3.3
*   **Vector Type:** Parameter
*   Value: N/A (Quantified values not provided)
*    Units: Qualitative Descriptor: "Persistent", "Long-term", "Stable" (across regeneration cycles, developmental stages)
*   Justification: The paper describes memory states as persistent or stable enough to guide long processes like development and regeneration (e.g., bioelectric patterns guiding development, trophic memory across annual antler regeneration, learned pathway states). Specific decay rates or quantitative retention times in standard units (seconds, hours, years) are not provided for these biological memory types in the review. Short interventions (1 hr) can induce long-lasting (~2 weeks) regenerative responses (Fig 6B), implying memory persistence well beyond the stimulus.
*    Implicit/Explicit: Mixed
        * Justification: Persistence and stability are explicitly mentioned. The lack of specific quantitative values is explicit. The inference of "long-term" is based on the biological context described (development, regeneration cycles).
*   CT-GIN Mapping: Key attribute `retention_time` (Qualitative: Persistent/Long-term) of the different `MemoryNode` types.

### **3.4 Memory Capacity (Optional - if applicable)**

* **Vector ID:** M3.4
* **Vector Type:** Parameter
*  Value: N/A
*   Units: N/A (e.g., distinct anatomical states, number of learned associations)
*   Justification: The review discusses the encoding of complex information (e.g., target anatomical morphology) but does not quantify the capacity of these biological memory systems in terms of bits or number of distinct stable states. It's implicitly high (encoding a whole organism's structure) but not formally defined or measured in the context provided.
*    Implicit/Explicit: Implicit
        *  Justification: The paper implies high capacity by describing the complex information stored (e.g., body plans) but provides no explicit quantification or discussion of capacity limits.
*   CT-GIN Mapping: Attribute `capacity` (Qualitative: High/Undefined) of `MemoryNode` types.

### **3.5 Readout Accuracy (Optional - if applicable)**

* **Vector ID:** M3.5
* **Vector Type:** Parameter
*   Value: N/A
*   Units: N/A (e.g., anatomical fidelity, % correct regeneration)
*   Justification: The review emphasizes the functional outcome of memory readout (e.g., achieving the correct target morphology during regeneration, implying high fidelity), but does not provide quantitative metrics for readout accuracy or error rates in information-theoretic terms. Successful regeneration to the target morphology (e.g., Fig 2B, 2C, 3A) implies high functional accuracy.
*    Implicit/Explicit: Implicit
       *  Justification: Functional success (correct regeneration) implies high accuracy, but this is not explicitly quantified as a memory readout metric in the paper.
*   CT-GIN Mapping: Attribute `readout_accuracy` (Qualitative: High Functional Fidelity) of `MemoryNode` or related `ReadoutEdge` (connecting `MemoryNode` to `BehaviorArchetypeNode`).

### **3.6 Degradation Rate (Optional - if applicable)**
* **Vector ID:** M3.6
* **Vector Type:** Parameter
    *   Value: N/A
    *   Units: N/A
    *   Justification: The review discusses the stability and persistence of memory states but does not mention or quantify degradation rates or mechanisms (e.g., decay over time, susceptibility to noise) for the biological memory systems described. The concept of error correction (homeostasis) implies mechanisms exist to counteract degradation.
    *    Implicit/Explicit: Explicit (Absence of information)
            * Justification: The paper does not explicitly discuss memory degradation rates.
    *   CT-GIN Mapping: N/A

### **3.7 Memory Operations Energy Cost (Optional - if applicable)**
* **Vector ID:** M3.7
* **Vector Type:** Table
*   Table:
    | Memory Operation ID | Energy Consumption per Bit | Power Usage during Operation| Units | Uncertainty | Data Source Reference | Implicit/Explicit | Justification |
    | :------------------ | :--------------------------: | :-----------------------------: | :---: |:-----------------:|:-----------------:|:-----------------:| :------------------ |
    | N/A                 | N/A                          | N/A                             | N/A   | N/A               | N/A               | Explicit          | Information not provided in the review. |
*   Implicit/Explicit: Explicit
    *   Justification: The review does not discuss the energetic costs associated with writing, maintaining, or reading out information in these biological memory systems.

### **3.8 Memory Fidelity & Robustness Metrics (Optional - if applicable)**
* **Vector ID:** M3.8
* **Vector Type:** Table
*   Table:
    | Metric ID | Description | Value | Units | CT-GIN Mapping | Data Source | Implicit/Explicit | Justification |
    | :-------- | :---------- | :----: | :---: | :-------------: | :----------: |:-----------------:| :-----------------:|
    | Anatomical Fidelity | Degree to which regenerated structure matches target morphology | Qualitative: High | N/A | Attribute of `MemoryNode` (Bioelectric/Anatomical) readout | Fig 2B, 2C, 3A, 3C | Implicit | Inferred from successful regeneration examples shown. |
    | Functional Fidelity | Degree to which regenerated structure performs correct function | Qualitative: High (e.g., ectopic eyes) | N/A | Attribute of `MemoryNode` (Bioelectric) readout | Section: Tapping into cellular intelligence; Ref [97, 98] | Implicit | Inferred from examples like functional ectopic eyes. |
    | Stability across Perturbation | Ability to maintain memory/target state despite challenges (e.g., cell size changes, injury) | Qualitative: High | N/A | Attribute of `MemoryNode` | Fig 2B, 3C, Box 2 | Implicit | Inferred from examples of regulative development and regeneration. |
*   Implicit/Explicit: Mixed
*   Justification: The paper provides qualitative evidence for fidelity and robustness through examples (explicit examples), but doesn't define or quantify specific metrics (implicit lack of quantification).

---

## M4: Self-Organization and Emergent Order
*   **Vector ID:** M4
*   **Vector Type:** Self-Organization

### **4.1 Self-Organization Presence:**

*   **Vector ID:** M4.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The paper explicitly describes development and regeneration as processes where complex anatomical structures (global order) emerge from local interactions between cells guided by intrinsic rules (gene expression, signaling, bioelectric fields, physical forces) without a central controller dictating the final form. Examples include embryogenesis from blastomeres (Fig 1A), regeneration of complex appendages (Fig 2C), tissue patterning (Fig 3C), and the formation of functional ectopic livers from transplanted hepatocytes (Fig 4). This contrasts with pre-programmed assembly; the system dynamically corrects errors and adjusts to perturbations (Fig 2B, 3A, Box 2) to reach the target morphology.
    *   Implicit/Explicit: Explicit
        *  Justification: The emergence of complex structure from local cellular interactions and decision-making is a core theme explicitly discussed throughout the paper (e.g., complexity not directly specified in genome, multiscale competency architecture, pattern homeostasis).

**(Conditional: M4.1 is "Yes", include M4.2-M4.7)**

### **4.2 Local Interaction Rules:**

*   **Vector ID:** M4.2
*   **Vector Type:** Rules
    *   Content: The paper discusses several types of local rules governing cell behavior and interactions:
        1.  **Gene Regulatory Networks (GRNs):** Intracellular logic determining cell state and response to signals (Implicitly assumed based on molecular biology context, mentioned Box 1, Fig 2A).
        2.  **Cell Signaling:** Paracrine and juxtacrine signaling via secreted molecules and receptors (Implicitly assumed, basis of development).
        3.  **Bioelectric Interactions:** Cells communicate Vmem changes via gap junctions, influencing neighbors' states and coordinating collective behavior (Explicit, Section: Developmental bioelectricity, Fig 5B, 5E). Ion channel activity sets individual cell Vmem based on local environment.
        4.  **Physical/Mechanical Interactions:** Cell adhesion, migration guided by ECM, response to physical forces (Implicitly part of morphogenesis, ECM mentioned Box 1).
        5.  **Metabolic/Functional Coupling:** Cells sense and respond to functional demands, e.g., hepatocytes sensing need for function (Explicit, Section: The 'hepatostat', Fig 4).
    *   CT-GIN Mapping: Defines `AdjunctionEdge` attributes based on the type of interaction: `GRNLogic`, `ChemicalSignal`, `BioelectricCoupling`, `MechanicalForce`, `FunctionalDemand`. These edges connect `CellNode`s or `TissueRegionNode`s. Defines the "LocalInteraction" category of edges.
    * **Implicit/Explicit**: Mixed
        *  Justification: The existence and importance of these types of local interactions (bioelectricity, functional demand) are explicitly stated. The precise mathematical or algorithmic form of these rules (e.g., specific GRN equations, quantitative bioelectric coupling strengths) is not provided in the review and is implicit based on cited literature and the field's understanding.

### **4.2.1 Local Interaction Parameters:**

* **Vector ID:** M4.2.1
* **Vector Type:** Table
*   Table:
    | Rule ID | Description | Parameter Name | Parameter Value Range | Units | Data Source | Implicit/Explicit | Justification |
    | :------ | :---------- | :------------- | :---------- | :---: | :----------: | :----------------: | :------------: |
    | BioelectricCoupling | Gap junction conductance | N/A | N/A | Siemens (S) | Implicit refs | Implicit | General biophysics parameter, not quantified in review. |
    | ChemicalSignal | Ligand concentration | N/A | N/A | mol/L (M) | Implicit refs | Implicit | General cell signaling parameter, not quantified in review. |
    | FunctionalDemand (Liver) | Level of functional deficit | N/A | N/A | % deficit, concentration | Implicit refs, Fig 4 | Implicit | Conceptual parameter, not quantified in review. |
    | N/A | N/A | N/A | N/A | N/A | N/A | Explicit | Other specific parameters not detailed in the review. |

### **4.3 Global Order:**

*   **Vector ID:** M4.3
*   **Vector Type:** Order
    *   Content: The emergent global order described is primarily functional anatomical structure at the tissue, organ, and organism level. Specific examples include: correctly patterned and functional organs (eyes, limbs, brain, heart, gut, liver), specific tissue architectures (kidney tubules, liver lobules), whole body plans (frog face, planarian body, bilaterian symmetry), and regenerated appendages (salamander limbs, frog legs, deer antlers). This order involves correct cell types, spatial arrangement, size, and connectivity for proper function.
    *   CT-GIN Mapping: Defines `ConfigurationalNode` types: `TissueArchitecture`, `OrganStructure`, `BodyPlan`, `RegeneratedAppendage`. Attributes describe the specific structure (e.g., `organ_type`, `pattern_complexity`, `functional_state`).
    * **Implicit/Explicit**: Explicit
        *  Justification: The paper explicitly describes the emergence of specific, complex anatomical structures (global order) resulting from the collective behavior of cells, providing numerous examples (Figs 1A, 2C, 3A, 3C, 4, 5F, 6).

### **4.4 Predictability of Global Order:**

*   **Vector ID:** M4.4
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: Under normal physiological conditions and typical genetic backgrounds, development and homeostasis lead to highly predictable global order (species-specific anatomy). The paper highlights the robustness and error-correction capabilities (e.g., twinning from split embryos, Fig 2B; regeneration restoring target morphology, Fig 2C; normalization of scrambled frog faces, Fig 3A) which underscore this predictability despite perturbations. However, predictability is not perfect; developmental defects occur, and interventions (experimental or therapeutic, e.g., bioelectric manipulation Fig 5F, 6A) can alter the outcome, sometimes predictably (inducing regeneration or ectopic organs) and sometimes less so (complex side effects). The score reflects high baseline predictability with acknowledged variability and potential for directed change. Quantification using information theory or correlation is not provided.
    * **Implicit/Explicit**: Mixed
    *  Justification: The high degree of reproducibility in normal development and regeneration (predictability) is explicitly shown through examples. The limitations and ability to experimentally alter outcomes are also explicitly discussed. The score itself is an inferred judgment based on this explicit information.
    *   CT-GIN Mapping: Contributes to the `AdjunctionEdge` weight (representing the reliability of local rules producing global order) and attributes of the `ConfigurationalNode` (e.g., `variance`, `stability`).

### **4.5. Local Interaction Rules (for Self-Organization)**
* **Vector ID:** M4.5
* **Vector Type:** Table
*   Table:
| Rule ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Source |
| :------ | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :-----: |
| Bioelectric Guidance | Vmem influencing cell behavior (proliferation, migration, differentiation) | Vmem Thresholds / Gradients | N/A | mV, mV/mm | Explicit (concept), Implicit (values) | Vmem control over cell behavior explicitly stated; specific thresholds not given. | Sec: Developmental bioelectricity |
| Chemical Signaling | Concentration-dependent cell response | Ligand Binding Affinity (Kd) | N/A | M | Implicit | Standard cell signaling parameter, assumed but not discussed. | General Biology |
| Contact Inhibition | Cell density limiting proliferation | Cell Density | N/A | cells/area | Implicit | Standard cell biology concept relevant to tissue size control, assumed. | General Biology |
| Functional Feedback (Liver) | Hepatocyte response to functional demand ('Need of Function') | Functional Load / Deficit | N/A | Arbitrary units | Explicit (concept), Implicit (value) | Concept explicitly discussed for liver; specific parameterization not given. | Sec: The 'hepatostat'; Fig 4 |

### **4.6. Globally Emergent Order and Order Parameters**
* **Vector ID:** M4.6
* **Vector Type:** Table
*   Table:
| Property ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Protocol | Source |
| :---------- | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :------: | :-----: |
| Anatomy | Correct formation of a specific organ/structure | Presence/Absence of key features, Size, Shape conformity | Qualitative / Length / Area / Volume | N/A / m / m^2 / m^3 | Explicit | Visual inspection, comparison to wild type/target. | Histology, Imaging | Fig 1A, 2C, 3A, 3C, 5F, 6 |
| Tissue Patterning | Correct spatial arrangement of cell types | Cell type distribution, Layering, Tubule diameter | Qualitative / Length | N/A / m | Explicit | Measurement of spatial organization. | Immunohistochemistry, Imaging | Fig 3C, Fig 4 (implied) |
| Body Plan | Overall organismal structure (axes, symmetry) | Axis alignment, Symmetry measures | Angle, Dimensionless ratio | Degrees, N/A | Explicit | Measurement of large-scale features. | Whole organism imaging | Fig 1A, 2B, 5F |
| Functionality | Ability of the emergent structure to perform its intended role | Functional assays (e.g., liver function tests, visual response from ectopic eye) | Assay-specific | Assay-specific | Explicit | Measurement of physiological or behavioral output. | Functional assays, Behavioral tests | Sec: The 'hepatostat', Sec: Tapping into cellular intelligence |

### **4.7 Yoneda Embedding and Local-to-Global Mapping Fidelity**

*   **Vector ID:** M4.7
*   **Vector Type:** Table
*   Table:
    | Link Type | Description | Predictability | Yoneda Score | Metrics | Implicit/Explicit | Justification | Source |
    | :-------- | :---------- | :------------- | :----------- | :------ | :----------------: | :------------: | :-----: |
    | Local Bioelectric State -> Global Anatomy | Mapping local Vmem patterns to resulting organ/body structure | High (qualitative, based on examples like Ref [71, 81-83]) | N/A | Qualitative (Correct structure formation) | Implicit | Paper argues for this link strongly with examples, but provides no formal mapping or fidelity score. | Sec: Developmental bioelectricity |
    | Local Cell State (e.g., hepatocyte) -> Global Function (e.g., liver mass/function) | Mapping individual cell activity/proliferation to overall organ function/size | High (qualitative) | N/A | Qualitative (Liver mass/function restoration) | Implicit | The hepatostat concept implies a robust mapping, but it's not formally quantified. | Sec: The 'hepatostat' |
    | Local GRN State -> Cell Behavior -> Tissue Structure | Mapping gene expression to cell actions contributing to structure | Medium-High (complex, context-dependent) | N/A | Qualitative | Implicit | Standard developmental biology concept, highly complex, predictability varies. | Box 1, General Biology |
    *   **Yoneda Embedding Fulfillment Score [0-10]:** N/A
    *   **Metrics:** N/A
    *   **Justification:** The paper conceptually aligns with the idea that local states/interactions map to global structure/function (implicit Yoneda embedding), particularly in the context of bioelectric patterns determining anatomy. However, it does not use Category Theory terminology or provide quantitative measures of mapping fidelity (Yoneda score, specific metrics). The predictability is inferred qualitatively from the success of developmental/regenerative processes described.

## M5: Computation
*   **Vector ID:** M5
*   **Vector Type:** Computation

### **5.1 Embodied Computation Presence:**

*   **Vector ID:** M5.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The paper explicitly frames biological processes like development, regeneration, and adaptation as computations performed by cellular collectives. It argues that cells and tissues process information, make decisions, solve problems (e.g., navigating morphospace, adapting to toxins), and store information (memory) using their inherent physical and biochemical properties (ion channels, GRNs, bioelectric networks). This computation is intrinsic to the biological substrate, not imposed externally. Concepts like the "anatomical compiler" directly refer to interfacing with this embodied computation.
    *    Implicit/Explicit: Explicit
        *  Justification: The paper explicitly uses terms like "information-processing systems," "computational and behavioral subroutines," "computational power of electrical networks," "process information to achieve morphological goals," and discusses computation in GRNs and pathways.

**(Conditional: M5.1 is "Yes", include M5.2-5.4)**

### **5.2 Computation Type:**

*   **Vector ID:** M5.2
*   **Vector Type:** Classification
    *   Content: Analog/Hybrid/Neuromorphic
    *   CT-GIN Mapping: Defines the `ComputationNode` type. Attributes: `computation_type`: Analog/Hybrid/Neuromorphic.
    *    Implicit/Explicit: Mixed
    *    Justification: The paper emphasizes bioelectric networks, which function similarly to neural networks (neuromorphic) using analog voltage states (analog). Gene regulatory networks involve both analog concentrations and switch-like behaviors (hybrid). The explicit comparison between somatic bioelectric networks and neural networks (Fig 5C, 5D) supports the neuromorphic classification. The continuous nature of Vmem and signaling gradients supports analog computation. Digital aspects might exist within GRNs but the overall emphasis is on analog/neuromorphic parallels.
    *    Justification: The paper explicitly compares bioelectric networks to neural networks (Fig 5). The analog nature of voltage potentials and signaling gradients is implicit in the biological context. The term "hybrid" accounts for the mix of analog signals and potentially switch-like gene regulation.

### **5.3 Computational Primitive:**

*   **Vector ID:** M5.3
*   **Vector Type:** Function
    *   Content: The review suggests several computational primitives embodied in the biological substrate:
        1.  **Signal Integration:** Cells integrate multiple cues (chemical, electrical, mechanical) to make decisions (e.g., migration direction, differentiation fate). (Implicit, Ref [1, 11, 12])
        2.  **Thresholding:** Bioelectric states or signaling pathway activities triggering specific cell behaviors (e.g., proliferation, apoptosis) when crossing a threshold. (Implicit, general cell biology)
        3.  **Pattern Matching/Recognition:** Cellular collectives recognizing deviation from a target morphology (setpoint) and initiating corrective actions (homeostasis). Bioelectric networks recognizing specific voltage patterns. (Explicit concept, Sec: Wisdom of body, Developmental bioelectricity; Fig 2A)
        4.  **Memory Storage/Retrieval:** Storing and accessing information about past states or target morphologies (see M3). (Explicit concept)
        5.  **Error Calculation/Minimization:** Comparing current state to target state (setpoint) and acting to reduce the difference (homeostasis loop). (Explicit concept, Fig 2A, Box 2)
    *   **Sub-Type (if applicable):** N/A
    *   CT-GIN Mapping: Defines the primary function attribute of the `ComputationNode` (e.g., `function`: SignalIntegration, `function`: Thresholding, `function`: PatternMatching, `function`: MemoryAccess, `function`: ErrorMinimization).
    *   Implicit/Explicit: Mixed
    * Justification: Concepts like pattern matching (for homeostasis) and memory are explicitly discussed. Signal integration and thresholding are fundamental cell biology processes implicitly required for the described behaviors. Error minimization is explicit in the homeostasis loop description (Fig 2A). Mathematical descriptions are not provided in the review.

### **5.4 Embodied Computational Units**
* **Vector ID:** M5.4
* **Vector Type:** Table
*   Table:
| Unit ID | Description | Processing Power | Energy/Operation | Freq/Resp. Time | Bit-Depth | Data Source | Implicit/Explicit | Justification |
| :------ | :---------- | :--------------- | :--------------- | :--------------: | :-------: | :----------: |:-----------------:| :-----------------:|
| Cell | Basic biological unit performing signal integration, decision-making | N/A | N/A | Variable (ms to days) | N/A (Analog/Hybrid) | Implicit | Underlying assumption, not quantified. | General Biology |
| Ion Channel | Molecular component controlling Vmem | N/A | N/A | ~ms | N/A (Analog gate) | Implicit | Biophysical component, not analyzed computationally. | General Biology |
| Gap Junction | Electrical synapse mediating intercellular communication | N/A | N/A | ~ms | N/A (Analog connection) | Implicit | Biophysical component, not analyzed computationally. | Fig 5B |
| GRN Module | Subnetwork performing specific regulatory logic | N/A | N/A | Variable (min to hours) | N/A (Hybrid) | Implicit | Conceptual unit, not analyzed computationally. | Box 1 |
| Bioelectric Network | Collection of electrically coupled cells processing spatial information | N/A | N/A | Variable (ms to days) | N/A (Neuromorphic/Analog) | Implicit | Key conceptual system, computational power not quantified. | Sec: Developmental bioelectricity |
    *   **Note:** The review discusses these as components of information processing systems but does not quantify their computational properties.

## M6: Temporal Dynamics
*   **Vector ID:** M6
*   **Vector Type:** Temporal

### **6.1 Timescales:**

*   **Vector ID:** M6.1
*   **Vector Type:** ParameterTable
    *   Table:
        | Timescale Description | Value | Units | Source | Implicit/Explicit | Justification |
        | :-------------------- | :---: | :---: | :----: | :----------------: | :------------: |
        | Ion Channel Gating | ~ms | ms | Implicit (General Biophysics) | Implicit | Standard biophysical timescale, assumed. | N/A |
        | Bioelectric Signal Propagation (Gap Junctions) | ms - s | ms - s | Implicit (General Biophysics/Neuroscience parallels) | Implicit | Inferred from known cell coupling dynamics. | N/A |
        | Gene Expression Changes | minutes - hours | min - hours | Implicit (cited studies, e.g., Ref [22, 25, 26]) | Implicit | Timescale from cited molecular biology studies, assumed. | N/A |
        | Cell Behavior (Migration, Proliferation) | hours - days | hours - days | Implicit (Developmental context) | Implicit | Typical timescale for cell actions during development. | N/A |
        | Morphogenesis / Regeneration | days - weeks - months | days - weeks - months | Explicit (Examples: Planarian head ~days, Ref[22]; Frog limb weeks-months, Ref[78]; Liver ~weeks/months, Ref[39, 50]) | Explicit | Durations from specific biological examples discussed/cited. | Fig 6B, Sec: The 'hepatostat' |
        | Adaptation/Learning (Pathways) | N/A (Depends on protocol) | N/A | Implicit (Ref [24-26]) | Implicit | Timescale depends on training protocols in cited studies. | N/A |
        | Memory Retention (Trophic/Bioelectric) | years / lifetime | years / lifetime | Explicit (Concept: deer antlers annually Ref[15], lifelong patterns) | Explicit (concept), Implicit (value) | Implied long-term stability from examples. | Fig 3D |

### **6.2 Active Inference:**

*   **Vector ID:** M6.2
*   **Vector Type:** Assessment
    *   Content: Yes/Partial
    *   Justification: The paper explicitly references active inference concepts and authors (Friston, Pezzulo) in the context of understanding morphogenesis and biological control systems (Refs [52, 53, 62, 63, 131-133], Box 3). It discusses biological systems minimizing surprise/prediction error implicitly through homeostasis (maintaining a setpoint, Fig 2A) and allostasis (adjusting setpoints). Morphogenesis itself can be viewed as a process minimizing the difference between the current state and a target morphology (prediction error). The concept of cells having 'beliefs' (internal states/models) and acting based on 'perceptions' to achieve 'goals' (setpoints) strongly aligns with active inference. However, the review doesn't deeply formalize these processes using active inference mathematics; it points to the framework's relevance. "Partial" reflects the explicit reference but lack of full formal application within the review itself.
    *   Implicit/Explicit: Explicit (References and concepts mentioned)
        *  Justification: The paper explicitly mentions active inference and related concepts/authors, suggesting its applicability.
    *   **If Yes/Partial, provide examples of testable CT-GIN metrics that *could* be used to quantify active inference:**
        *   **Prediction Error Rate:** Quantify the deviation of the system state (e.g., morphology, physiological parameter) from the inferred target setpoint over time during development or regeneration. Measure the rate at which this error is reduced. (CT-GIN: Attribute of `StateNode` or `BehaviorNode`, edge weight change over `TemporalEvolutionEdge`).
        *   **Model Update Rate:** If internal models (e.g., bioelectric patterns, GRN states) change based on experience/perturbation, quantify the rate and magnitude of these changes. (CT-GIN: Change in `MemoryNode` attributes over time).
        *   **Action Efficiency:** Quantify the relationship between cellular actions (e.g., migration, proliferation rate) and the reduction in prediction error (deviation from target state). (CT-GIN: Attribute of `ActionSelectionEdge`).
        *   **Anticipatory Behavior:** Measure if cellular/tissue responses precede expected environmental changes or internal state transitions, based on learned patterns or inferred goals. (CT-GIN: Temporal analysis of `StateNode` transitions).

## M7: Adaptation
*   **Vector ID:** M7
*   **Vector Type:** Adaptation

### **7.1 Adaptive Plasticity Presence:**

*   **Vector ID:** M7.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The paper provides multiple explicit examples of adaptive plasticity:
        1.  **Physiological Adaptation:** Planaria adapting to barium by altering gene expression to regrow functional heads (Fig 3B, Ref [22]). Hepatocytes adapting to chronic injury by developing cell death resistance (Ref [34]).
        2.  **Morphological Adaptation:** Kidney tubules adjusting cell number/shape to maintain diameter despite altered cell size (Fig 3C, Ref [156]). Slijper's goat developing anatomical adjustments for bipedalism (Box 2, Ref [171]). Salamander tails grafted to flank remodeling into limbs (Box 2, Ref [166]).
        3.  **Learning in Pathways:** Gene regulatory networks and signaling pathways exhibiting associative learning and adapting responses based on training protocols (Box 1, Refs [7, 24-26]).
        These involve persistent changes in structure, function, or behavior based on experience or environmental challenges, going beyond simple stimulus-response.
    *    Implicit/Explicit: Explicit
        * Justification: Numerous specific examples of adaptation (physiological, morphological, pathway-level learning) are explicitly described and cited.

**(Conditional: M7.1 is "Yes", include M7.2)**

### **7.2 Adaptation Mechanism:**

*   **Vector ID:** M7.2
*   **Vector Type:** Description
    *   Content: The mechanisms described vary:
        1.  **Gene Expression Changes:** Altering the levels of specific proteins to cope with stress (e.g., Planaria in barium, Ref [22]). This involves feedback from the physiological state to the GRN.
        2.  **Bioelectric State Modification:** Changes in Vmem patterns or network connectivity potentially underlying altered morphological setpoints or responses (Implicitly underlying anatomical adaptation, explicit link to learning Ref [14, 70]).
        3.  **Cell Behavior Changes:** Altering proliferation, migration, differentiation, or apoptosis rates/patterns based on environmental cues or internal state (e.g., kidney tubule cells changing behavior based on neighbor size, Fig 3C).
        4.  **Pathway 'Learning':** Modification of internal states or connection strengths within signaling pathways/GRNs based on stimulus history, analogous to associative learning (Explicitly discussed for pathways, Refs [7, 24-26]).
        5.  **Allostasis:** Mechanisms that dynamically alter homeostatic setpoints themselves over time (Explicit concept, Box 2, Ref [157-162]).
        The paper suggests these mechanisms allow systems to solve novel problems and reach goals via diverse means.
    *   CT-GIN Mapping: Defines `AdaptationNode` types: `GeneExpressionAdaptation`, `BioelectricAdaptation`, `CellBehaviorAdaptation`, `PathwayLearning`, `Allostasis`. Defines `Monad` edges representing the update rule/mechanism changing system state based on experience/error. `mechanism`: `GRNUpdate`, `VmemPatternChange`, `CellBehaviorModulation`, `PathwayWeightUpdate`, `SetpointShift`.
    *    Implicit/Explicit: Mixed
        *  Justification: Specific examples of mechanisms like gene expression changes (Ref [22]) and pathway learning (Refs [7, 24-26]) are explicitly discussed. The role of bioelectric changes or specific cell behavior modulation in other adaptation examples (like kidney tubules) is more implicitly inferred from the context. Allostasis is explicitly defined.

## M8: Emergent Behaviors
*   **Vector ID:** M8
*   **Vector Type:** Behavior

### **8.1 Behavior Description:**

*   **Vector ID:** M8.1
*   **Vector Type:** Description
    *   Content: The primary emergent behaviors discussed are:
        1.  **Anatomical Homeostasis/Pattern Homeostasis:** Maintenance and restoration of a specific target anatomical structure despite perturbations or injury (e.g., regeneration of limbs, organs; twinning). This involves coordinated cell proliferation, migration, differentiation, apoptosis to minimize deviation from a setpoint.
        2.  **Morphogenesis:** The process of development, where complex structures (tissues, organs, body plan) emerge from simpler initial states (e.g., blastomeres) through self-organizing cellular activities.
        3.  **Adaptation:** Adjusting physiological or morphological states to cope with novel environmental challenges or internal perturbations (e.g., barium resistance, kidney tubule size adaptation).
        4.  **Learning:** Modification of system responses (e.g., in signaling pathways) based on experience/training.
        5.  **Collective Decision-Making:** Cell groups collectively deciding "what to build and when to stop" during development and regeneration.
        6.  **Cancer Suppression:** Implicitly, the normal process of maintaining tissue organization prevents or corrects tumorigenesis (viewed as a defect in collective behavior/pattern homeostasis).
    *   CT-GIN Mapping: Defines `BehaviorArchetypeNode` types: `AnatomicalHomeostasis`, `Morphogenesis`, `Adaptation`, `Learning`, `CollectiveDecisionMaking`, `CancerSuppression`.
    *    Implicit/Explicit: Explicit
       *  Justification: These behaviors (homeostasis, morphogenesis, adaptation, learning, decision-making) are explicitly defined and described with examples throughout the paper.

### **8.2 Behavior Robustness:**

*   **Vector ID:** M8.2
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The paper emphasizes the remarkable robustness of these biological behaviors. Examples include:
        *   **Regulative Development:** Split embryos forming complete twins (Fig 2B), kidney tubules maintaining diameter despite huge cell size changes (Fig 3C), scrambled tadpole faces resolving into normal frog faces (Fig 3A), resistance to genetic perturbations (polyploidy in salamanders, Box 2).
        *   **Regeneration:** Accurate restoration of complex structures after major injury (salamander limbs, Fig 2C; planaria regeneration).
        *   **Adaptation:** Successful coping with novel stressors like barium (Fig 3B).
        This robustness stems from the goal-directed, error-correcting nature of the underlying homeostatic/allostatic processes. However, robustness is not absolute; severe perturbations, specific mutations, or conflicting signals can lead to developmental defects, failed regeneration, or disease (e.g., cancer as a failure of homeostasis). The score reflects the high degree of robustness observed in biological systems while acknowledging limits. Quantification not provided.
    *   Implicit/Explicit: Mixed
        *  Justification: The robustness is explicitly highlighted with numerous examples. The score itself is an interpretation based on the weight given to this robustness in the text. Lack of quantification is explicit.
    *   CT-GIN Mapping: This score contributes to the `reliability`, `stability`, `robustness` attributes of the `BehaviorArchetypeNode`s.

### **8.3 CT-GIN Emergent Behavior Validation**

*    **Vector ID:** M8.3
*    **Vector Type:** Validation
     *  Content: The review validates claims of emergent behaviors primarily through:
        1.  **Citation of Experimental Evidence:** Referencing numerous experimental studies demonstrating phenomena like regeneration (Fig 2C, 6B, 6C), developmental robustness (Fig 2B, 3A, 3C), adaptation (Fig 3B), bioelectric control (Fig 5F, 6A), and pathway learning (Refs [7, 24-26]).
        2.  **Illustrative Examples:** Providing specific, often visual, examples from the literature (e.g., twinning, scrambled faces, barium adaptation, ectopic eyes).
        3.  **Conceptual Coherence:** Arguing that these diverse phenomena can be understood within a unifying framework of collective intelligence, homeostasis, and bioelectric control.
        Control experiments are implied in the cited primary research but not detailed in the review. Quantitative analysis is limited within the review itself. Reproducibility is implied by the citation of established biological phenomena. Limitations include the complexity of the systems and the reliance on interpreting behaviors within the proposed framework.
     *   Implicit/Explicit: Mixed
    *   Justification: The reliance on cited experimental evidence and illustrative examples is explicit. The conceptual coherence argument is explicit. Details of controls and quantification are implicit, residing in the cited works.

## M9: Cognitive Proximity
*   **Vector ID:** M9
*   **Vector Type:** Cognition

### **9.1 Cognitive Mapping:**

*   **Vector ID:** M9.1
*   **Vector Type:** Description
    *   Content: Yes, the paper explicitly and extensively maps the observed biological processes to cognitive concepts. This is a central thesis. Examples include:
        *   **Collective Intelligence:** Attributed to cellular swarms coordinating morphogenesis and regeneration.
        *   **Problem-Solving:** Cells/tissues solving problems in anatomical, physiological, transcriptional spaces (e.g., navigating morphospace, adapting to toxins).
        *   **Decision-Making:** Cells/collectives deciding what structure to build and when to stop.
        *   **Memory:** Bioelectric, transcriptional, and anatomical states storing information about target morphology or past experiences.
        *   **Learning:** Adaptation in signaling pathways analogous to associative learning.
        *   **Goals/Setpoints:** Target morphologies or physiological states that the system strives to achieve/maintain (homeostasis/allostasis).
        *   **Perception:** Cells perceiving signals from their environment and internal state.
        *   **Beliefs:** Implicitly, internal states representing the system's model or expectation.
        *   **Communication:** Intercellular signaling (chemical, electrical) as communication.
        *   **Somatic Psychiatry:** Proposed field using cognitive/behavioral science tools to interface with tissue-level decision-making.
        The paper explicitly draws parallels between somatic bioelectric network computation and neural computation underlying behavior (Fig 5C, D). Limitations acknowledged: these are often simpler or "proto-cognitive" forms compared to human cognition.
    *   CT-GIN Mapping: Defines multiple `CognitiveMappingEdge`s connecting `BehaviorArchetypeNode`s (e.g., `AnatomicalHomeostasis`, `Adaptation`, `Morphogenesis`) and `ComputationNode`s to `CognitiveFunctionNode`s (e.g., `ProblemSolving`, `DecisionMaking`, `Memory`, `Learning`, `GoalDirectedness`, `Perception`). Also defines `SystemNode` attribute `cognitive_framework`: CollectiveIntelligence/SomaticPsychiatry.
    *   Implicit/Explicit: Explicit
    * Justification: The mapping to cognitive terms (intelligence, memory, learning, goals, problem-solving, perception, decision-making) is explicit and forms the core argument of the paper.

### **9.2 Cognitive Proximity Score:**

*   **Vector ID:** M9.2
*   **Vector Type:** Score
    *   Score: 4
    *   Justification: The paper describes systems (cellular collectives) exhibiting clear goal-directed behavior (Level 4) through homeostasis/allostasis to achieve specific anatomical/physiological setpoints. They demonstrate adaptation/learning based on experience (Level 3) and possess forms of memory influencing future behavior (Levels 2-3). The basis in collective behavior and distributed information processing shares features with reactive autonomy (Level 3). The authors explicitly argue for problem-solving and decision-making capabilities. The discussion of bioelectric networks encoding target states and guiding behavior towards them implies a rudimentary form of model-based control (approaching Level 4). However, the representations are largely implicit (bioelectric patterns, GRN states) rather than symbolic (Level 6), context understanding is limited compared to higher animals (Level 5), and there's no evidence for metacognition or consciousness (Levels 8+). The score of 4 reflects robust goal-directed behavior potentially based on simple internal models, exceeding simple reactivity but falling short of complex symbolic reasoning or self-awareness.
    *   Implicit/Explicit: Mixed
    *  Justification: The paper explicitly attributes goal-directedness, learning, memory, and problem-solving. The score requires interpreting these attributions against the provided scale, placing them relative to basic reactivity and higher cognition based on the described mechanisms (bioelectric setpoints, pathway learning, homeostatic loops), thus involving inference.

**CT-GIN Cognizance Scale:** (Provided for reference during justification)
*   Level 0: Non-Cognitive
*   Level 1: Simple Responsivity
*   Level 2: Sub-Organismal Responsivity
*   Level 3: Reactive/Adaptive Autonomy
*   Level 4: Goal-Directed/Model-Based Cognition
*   Level 5: Contextual/Relational Cognition
*   Level 6: Abstract/Symbolic Cognition
*   Level 7: Social Cognition
*   Level 8: Metacognition/Self-Awareness
*   Level 9: Phenomenal Consciousness
*   Level 10: Sapience/Self-Reflective Consciousness

### **9.3 Cognitive Function Checklist**

* **Vector ID:** M9.3
* **Vector Type:** Checklist
    *   | Cognitive Function               | Score (0-10) | Justification/Notes                                                                       | CT-GIN Mapping (if applicable) | Implicit/Explicit | Justification for Implicit/Explicit/Mixed |
    | :-------------------------------- | :----------: | :------------------------------------------------------------------------------------ | :--------------------------------: | :-----------------:|:-----------------:|
    | Sensing/Perception               |      7       | Cells explicitly sense chemical, electrical, mechanical cues; collective perception implied. | `PerceptionNode`, `SensingEdge`   | Explicit          | Explicitly discussed cell perception (Ref [1]). |
    | Memory (Short-Term/Working)        |      3       | Short-term pathway activation states implied, but focus is on persistent memory.        | `MemoryNode` (attributes)         | Implicit          | Not the focus; inferred short-term states exist. |
    | Memory (Long-Term)                 |      7       | Explicit focus on persistent bioelectric, transcriptional, trophic memory guiding behavior. | `MemoryNode` (`BioelectricPatternMemory`, etc.) | Explicit          | Central theme, explicitly discussed types. |
    | Learning/Adaptation              |      6       | Explicit examples of physiological adaptation and pathway learning (associative).         | `AdaptationNode`, `LearningEdge` | Explicit          | Explicit examples (barium, pathway learning). |
    | Decision-Making/Planning          |      4       | Collective "decisions" on what/when to build explicitly discussed; planning is implicit/rudimentary. | `DecisionMakingNode`           | Explicit (decision), Implicit (planning) | "Decision" used explicitly; planning not detailed. |
    | Communication/Social Interaction |      5       | Intercellular signaling (electrical, chemical) is key; social interaction between cells implied. | `CommunicationEdge`             | Explicit (signaling), Implicit (social analogy) | Signaling explicitly key; social aspect is an analogy. |
    | Goal-Directed Behavior            |      7       | Central theme: homeostasis/regeneration actively seeks target morphology/state (goal).       | `GoalNode`, `GoalDirectedEdge`  | Explicit          | Homeostasis/allostasis framed as goal-directed. |
    | Model-Based Reasoning              |      3       | Bioelectric setpoints act as simple internal models guiding behavior; reasoning not complex. | `InternalModelNode`            | Implicit          | Inferred from setpoint concept; reasoning not demonstrated. |
    | **Overall score**                 |     5.25     |                                                                                       |                                   |                     |                |    

## M10: Criticality Assessment
*   **Vector ID:** M10
*   **Vector Type:** Criticality

### **10.1 Criticality:**

*   **Vector ID:** M10.1
*   **Vector Type:** Assessment
    *   Content: Unclear
    *   Justification: The paper does not explicitly discuss criticality in the physics sense (phase transitions, power laws, scale-free behavior, self-organized criticality). While complex biological networks sometimes operate near critical regimes to balance stability and adaptability, this review doesn't explore or claim criticality for the described phenomena (morphogenesis, bioelectric signaling, regeneration).
        *   Critical Parameters (If Yes/Partial): N/A
        *   Evidence: N/A
    *   Implicit/Explicit: Explicit (Absence of discussion)
    *    Justification: The paper makes no mention of criticality, power laws, or related concepts from statistical physics.

## M11: Review Paper Specifics (Conditional)

**(Paper type is "Review", this module is included)**

*   **Vector ID:** M11
*   **Vector Type:** Review

### **11.1 Literature Synthesis Quality:**

*   **Vector ID:** M11.1
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The review effectively synthesizes a broad range of literature from developmental biology, regenerative medicine, bioelectricity, neuroscience, and theoretical biology to build a cohesive argument for viewing biological systems as collectively intelligent information processors. It connects disparate phenomena (liver regeneration, planarian adaptation, frog development, cancer) under the umbrella concepts of homeostasis, allostasis, multiscale competency, and bioelectric control. From a *conceptual* CT-GIN perspective, it identifies common themes of information processing, memory, goal-directedness, and emergent order, even without using explicit CT/GIN terminology. It clearly contrasts the proposed top-down control approach with traditional bottom-up molecular methods.
    *    Implicit/Explicit: Mixed
         *  Justification: The synthesis of literature is explicit. The connection to CT-GIN concepts is implicit, based on interpreting the review's themes through the CT-GIN lens.

### **11.2 Gap Identification:**

*   **Vector ID:** M11.2
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: The review identifies several key gaps, particularly in the "Concluding remarks" and "Outstanding questions" sections. These include: a deeper understanding of biological signal encoding/interpretation (linking local rules to global outcomes - inverse problem), the need for better computational tools (e.g., for bioelectric modeling and intervention prediction), understanding the limits of cellular/tissue competencies, identifying technologies for delivering high-level stimuli, determining the generalizability of collective intelligence principles across systems, and understanding the factors enabling the "need-of-function" approach. These gaps are relevant to operationalizing the CT-GIN framework for biological systems, focusing on understanding the mapping between local rules (adjunctions), global states (configurations), and interventions (control).
    *   Implicit/Explicit: Explicit
        *  Justification: The "Outstanding questions" section explicitly lists key knowledge gaps relevant to the proposed framework.

### **11.3 Future Directions:**

*   **Vector ID:** M11.3
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The paper proposes concrete future directions centered around the "anatomical compiler" concept and "somatic psychiatry." It advocates for developing tools (computational models like BETSE, electroceuticals, delivery methods) to interface with and control the collective intelligence of tissues. It suggests applying concepts from behavioral science and neuroscience (training, active inference, targeting setpoints, memories, perceptions) to non-neural tissues. It calls for research into cellular competencies, signal interpretation, and the generalizability of these principles. These directions aim to bridge the gap between understanding biological computation and applying it therapeutically, aligning well with the goals of characterizing and manipulating complex systems within a CT-GIN-like framework.
    *    Implicit/Explicit: Explicit
    *   Justification: Future research directions, including developing specific tools and applying concepts from other fields, are explicitly proposed in the text, particularly in the concluding sections and Box 3.

### **11.4 Review Paper CT-GIN Alignment Score**

*   **Vector ID:** M11.4
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: While not explicitly using Category Theory or GIN terminology, the review strongly aligns *conceptually* with the framework. It focuses on multiscale organization (M4), information processing (M5), memory (M3), adaptation (M7), emergent behavior (M8), and goal-directedness (M9). It emphasizes understanding local rules (interactions, M4.2) that lead to global outcomes (structure/function, M4.3) and how interventions can target high-level control points (setpoints, memories) rather than just low-level components (M7, M9). It addresses temporal dynamics (M6) and implicitly touches on energy (M2) as the basis for biological activity. The core idea of leveraging the "native problem-solving" and "collective intelligence" of biological matter resonates with analyzing systems through their computational capabilities and emergent properties, central to a CT-GIN approach to cognizant matter. The main limitation is the lack of formal CT/GIN language and quantitative metrics typical of GIN analysis.
    *    Implicit/Explicit: Implicit
        *  Justification: The alignment is based on interpreting the review's themes (information processing, multiscale control, memory, emergence) through the lens of CT-GIN principles, rather than explicit use of CT/GIN terms by the authors.

## M12: Theoretical Paper Specifics (Conditional)

**(Paper type is "Review", this module is skipped)**

*   **Vector ID:** M12
*   **Vector Type:** Theory
    *   Content: N/A

### **12.1 Theoretical Rigor:**
    *   Content: N/A

### **12.2 Realization Potential:**
    *   Content: N/A

### **12.3 Potential for Future CT-GIN Implementation Score**
    *   Content: N/A

## M13: Overall Assessment & Scoring

*   **Vector ID:** M13
*   **Vector Type:** Overall

### **13.1 CT-GIN Readiness Score:**

*   **Vector ID:** M13.1
*   **Vector Type:** Score
*   **Calculated Score:** 6.11
    *   Calculation: (M1.2[7] + M2.3[0 - N/A treated as 0] + M3.2[6] + M4.1[10 - implies Yes] + M4.4[8] + M5.1[10 - implies Yes] + M7.1[10 - implies Yes] + M8.2[8] + M9.2[4]) / 9 = (7 + 0 + 6 + 10 + 8 + 10 + 10 + 8 + 4) / 9 = 63 / 9 = 7.0. Re-evaluating: Some scores reflect presence (Yes=10) others are actual scores. Let's average the *actual* scores given where applicable, excluding binary Yes/No: (M1.2[7] + M2.3[0] + M3.2[6] + M4.4[8] + M5.2[N/A - Need score if Comp present] + M8.2[8] + M9.2[4]). Computation type doesn't have a score. Let's use M1.2, M3.2, M4.4, M8.2, M9.2. (7+6+8+8+4)/5 = 33/5 = 6.6. Let's include M11 scores as well, since it's a review: (M1.2[7] + M3.2[6] + M4.4[8] + M8.2[8] + M9.2[4] + M11.1[8] + M11.2[7] + M11.3[8] + M11.4[7]) / 9 = 63 / 9 = 7.0. Let's recalculate based on original instruction: "(Average of scores from Modules 1-4, M8.2 and M9.2, scores with N/A convert in 0)". Scores needed: M1.2, M2.3, M3.2, M4.4, M8.2, M9.2. Assumes M2.3 is 0. (7 + 0 + 6 + 8 + 8 + 4) / 6 = 33 / 6 = 5.5. Let's use the yes/no as 10/0: M1.2[7], M2.1-4 (N/A conceptually, assume 0 for efficiency M2.3), M3.1[10], M3.2[6], M4.1[10], M4.4[8], M8.2[8], M9.2[4]). Average (7+0+10+6+10+8+8+4)/8 = 53/8 = 6.625. Let's follow the instruction exactly: M1.2[7], M2.3[0], M3.2[6] (using score, not yes/no M3.1), M4.4[8] (using score, not yes/no M4.1), M8.2[8], M9.2[4]. Average = (7+0+6+8+8+4)/6 = 33/6 = 5.5.

**(Recalculating strictly based on instruction: Average M1.2, M2.3, M3.2, M4.4, M8.2, M9.2. N/A for M2.3 becomes 0)**
**(7 + 0 + 6 + 8 + 8 + 4) / 6 = 33 / 6 = 5.5**

**CT-GIN Readiness Summary Table:**

| CT-GIN Aspect                   | Strength (Yes/Partial/No) | Key Supporting Metrics (with units) | Limitations (Missing Metrics/Data Gaps)                                           | Improvement Areas (Future Research)                                          |
| :------------------------------ | :-----------------------: | :-----------------------------------| :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| Energy Flow Efficiency          | No                        | N/A                                  | No quantitative data on energy input, transduction, dissipation, or efficiency. | Quantify metabolic costs of development, regeneration, computation.          |
| Memory Fidelity                 | Yes                       | Qualitative: High functional fidelity (regeneration, adaptation examples), Long-term retention (trophic, bioelectric). | Quantitative metrics (capacity, bit error rate, decay rate) absent.             | Quantify memory parameters (capacity, retention, noise sensitivity).        |
| Organizational Complexity       | Yes                       | Qualitative: Emergence of complex anatomy (organs, body plans) from local rules. High robustness (Fig 2B, 3A). | Quantitative order parameters, precise local-global mapping fidelity missing. | Develop order parameters for morphology; Formalize local-global CT mapping. |
| Embodied Computation            | Yes                       | Qualitative: Info processing via bioelectric nets, GRNs; Parallels to neuromorphic/analog computing. | Computational primitives lack mathematical description; Power/speed metrics absent. | Formalize computational primitives; Measure computational efficiency/speed.    |
| Temporal Integration            | Yes                       | Qualitative: Integration across scales (ms to years); Active inference concepts applicable. | Quantitative analysis of cross-scale dynamics, prediction error loops absent. | Model temporal dynamics across scales; Quantify active inference metrics.     |
| Adaptive Plasticity             | Yes                       | Qualitative: Examples of physiological, morphological, pathway adaptation/learning. | Quantitative adaptation rates, learning curves, mechanism details often missing. | Quantify adaptation speed/limits; Elucidate specific learning rules.        |
| Functional Universality         | Partial                   | Proposed principles (homeostasis, bioelectricity) suggested as broadly applicable. | Generalizability across all tissues/organisms needs more evidence (Outstanding Qs). | Test proposed principles in diverse biological systems and pathologies.     |
| Cognitive Proximity            | Yes                       | Goal-directedness (Level 4); Adaptation/Learning (Level 3); Memory (Level 2-3). Explicit mapping to cognitive terms. | Falls short of higher cognition (symbolic, metacognitive); Mapping is analogous. | Refine cognitive mapping with detailed mechanism comparison.                 |
| Design Scalability & Robustness | Yes                       | High intrinsic robustness of biological systems highlighted (Fig 2B, 3A, 3C). Scalability inherent in development. | Quantitative robustness metrics absent; Scalability of *interventions* unclear. | Quantify robustness to perturbations; Assess scalability of control strategies. |
| **Overall CT-GIN Readiness Score** |        5.5               |   |   |      |


### **13.2 Qualitative CT-GIN Assessment Conclusion:**

*   **Vector ID:** M13.2
*   **Vector Type:** Textual Summary
    *   Content: This review provides a strong conceptual foundation highly relevant to a CT-GIN perspective on cognizant matter, framed within biological systems. Its key strengths lie in explicitly mapping biological phenomena like morphogenesis, regeneration, and adaptation to information processing, memory, goal-directed behavior, and collective intelligence (M5, M3, M9). It compellingly argues for biological tissues as adaptive, problem-solving systems governed by local rules leading to robust emergent global order (M4, M8). The emphasis on bioelectric networks as a computational substrate (M5) and the potential for top-down control via targeting setpoints and perceptions (M7, M9) aligns well with CT-GIN principles of analyzing systems through their computational capabilities and control interfaces. Key limitations for direct CT-GIN implementation are the lack of quantitative metrics for energy flow (M2), memory parameters (capacity, rates, M3), computational characteristics (speed, power, M5), local-global mapping fidelity (M4), and adaptation rates (M7). The cognitive mapping, while extensive, remains largely analogous (M9). Overall, the paper offers a rich source of principles and examples for developing CT-GIN models of biological intelligence, highlighting the computational nature of life, but requires significant further work to translate these concepts into the formal, quantitative language of CT-GIN.
    *   Implicit/Explicit: Mixed (Summarizes explicit findings, overall assessment is an inferred conclusion).

### **13.3 CT-GIN Refinement Directions:**

*   **Vector ID:** M13.3
*   **Vector Type:** Recommendations
    *   Content:
        *   **Quantify Memory:** Develop methods to measure capacity, retention time (in standard units), readout fidelity, and degradation rates for biological memory substrates (bioelectric patterns, GRN states).
        *   **Formalize Local-Global Mapping:** Apply CT concepts (e.g., sheaves, Yoneda lemma) to formally describe how local cell states/interactions (e.g., Vmem, gene expression) map to global tissue/organ structure and function. Quantify the fidelity and predictability of this mapping.
        *   **Characterize Computation:** Define and mathematically describe the computational primitives embodied by cells and networks (e.g., transfer functions for signal integration, logic of GRNs). Measure computational speed, energy cost, and error rates.
        *   **Develop Order Parameters:** Define quantitative order parameters to capture the complexity and state of emergent anatomical structures beyond simple size/presence.
        *   **Model Adaptation Dynamics:** Quantify learning rates and adaptation dynamics in response to specific stimuli or training protocols, particularly for pathway learning and bioelectric adaptation.
        *   **Measure Energy Flow:** Quantify the metabolic energy costs associated with information processing, memory maintenance, and morphogenetic computation in these systems.
        *   **Implement Active Inference Models:** Develop specific active inference models for morphogenesis or regeneration, quantifying prediction error reduction and model updates based on experimental data.

## M14: CT-GIN Knowledge Graph

*   **Vector ID:** M14
*   **Vector Type:** Visualization

### **14.1. CT-GIN Knowledge Graph:**
* **Content:**
(Conceptual description for diagram generation)
*   **Central Node:** `SystemNode: BiologicalCollective` (Attributes: MultiscaleCompetency, CollectiveIntelligence)
*   **Connected Nodes:**
    *   `ComponentNode: Cell` (Connected via `ContainsEdge`)
    *   `ComponentNode: BioelectricNetwork` (Attributes: Vmem, GapJunctions) (Connected via `ContainsEdge`)
    *   `ComponentNode: GRN` (Connected via `ContainsEdge`)
    *   `MemoryNode: BioelectricPatternMemory` (Attributes: Long-term, HighFidelity(Qual)) (Connected via `ImplementsEdge` from `BioelectricNetwork`)
    *   `MemoryNode: TranscriptionalMemory` (Attributes: LearnedState) (Connected via `ImplementsEdge` from `GRN`)
    *   `ComputationNode: InformationProcessing` (Attributes: Analog/Neuromorphic, Function: PatternMatching/ErrorMinimization) (Connected via `ImplementsEdge` from `Cell`, `BioelectricNetwork`)
    *   `BehaviorArchetypeNode: AnatomicalHomeostasis` (Attributes: GoalDirected, Robust) (Connected via `ExhibitsEdge` from `SystemNode`)
    *   `BehaviorArchetypeNode: Morphogenesis` (Attributes: SelfOrganizing, Robust) (Connected via `ExhibitsEdge` from `SystemNode`)
    *   `BehaviorArchetypeNode: Adaptation` (Attributes: Learning) (Connected via `ExhibitsEdge` from `SystemNode`)
    *   `GoalNode: TargetMorphology` (Connected via `GuidesEdge` to `AnatomicalHomeostasis`, `Morphogenesis`)
    *   `CognitiveFunctionNode: ProblemSolving` (Connected via `CognitiveMappingEdge` from `Adaptation`, `AnatomicalHomeostasis`)
    *   `CognitiveFunctionNode: Memory` (Connected via `CognitiveMappingEdge` from `MemoryNode`s)
    *   `InterventionNode: Electroceutical` (Connected via `ControlsEdge` to `BioelectricNetwork`)
    *   `InterventionNode: SomaticPsychiatry` (Conceptual, Connected via `TargetsEdge` to `MemoryNode`, `GoalNode`, `ComputationNode`)
*   **Key Edges:**
    *   `AdjunctionEdge` between `Cell` nodes (Attributes: BioelectricCoupling, ChemicalSignal) - Represents local interactions.
    *   `TemporalEvolutionEdge` showing transitions between developmental stages or during regeneration (linked to `Morphogenesis`, `AnatomicalHomeostasis`).
    *   `FeedbackEdge` from `BehaviorArchetypeNode` (current state) back to `ComputationNode` (error calculation) for homeostasis loop.

## M15: Relationship Vectors
*   **Vector ID:** M15
*   **Vector Type:** Relationships
*   Relationships:
        | Source Vector ID | Target Vector ID | Relationship Type |
        | ------------- | ------------- | ----------------- |
        | M1.1          | M4.1          | DescribesSystemLeadingToSelfOrganization |
        | M1.1          | M5.1          | DescribesSystemPerformingComputation |
        | M1.1          | M3.1          | DescribesSystemPossessingMemory |
        | M3.1          | M3.2          | EnablesMemoryTypeCharacterization |
        | M4.1          | M4.2          | EnablesLocalRuleCharacterization |
        | M4.2          | M4.3          | LocalRulesLeadToGlobalOrder |
        | M5.1          | M5.2          | EnablesComputationTypeCharacterization |
        | M5.3          | M9.1          | ComputationalPrimitivesMapToCognitiveFunctions |
        | M7.1          | M7.2          | EnablesAdaptationMechanismDescription |
        | M8.1          | M9.1          | EmergentBehaviorsMapToCognitiveFunctions |
        | M4.3          | M8.1          | GlobalOrderManifestsAsEmergentBehavior |
        | M1.1          | M13.2         | SystemDescriptionContributesToOverallAssessment |
        | M11.2         | M13.3         | IdentifiedGapsInformRefinementDirections |

## M16: CT-GIN Template Self-Improvement Insights

*   **Vector ID:** M16
*   **Vector Type:** Feedback

### **Template Feedback:**

*    **Vector ID:** M16.1
*   **Vector Type:** Text
    *   **Missing Probes:**
        *   A probe specifically for **Goal Representation/Encoding**: How is the goal state (e.g., target morphology, setpoint) encoded within the system? (Related to M3/M4 but could be more explicit).
        *   A probe for **Control Interface/Mechanism**: How can the system's behavior/computation be externally controlled or modulated? (Partially covered by M7/InterventionNode, but could be a dedicated section).
        *   A section on **Information Flow:** Explicitly tracing how information (not just energy) flows, is processed, and stored could be valuable.
    *   **Unclear Definitions:**
        *   The distinction between "Adaptation" (M7) and "Learning" as a cognitive function (M9.3) or memory mechanism (M3) could be slightly clarified, though the descriptions are helpful. Adaptation seems broader.
        *   "Yoneda Embedding Fulfillment Score" (M4.7) needs a clearer definition or rubric within the template itself for consistent application, especially for non-CT experts.
    *   **Unclear Node/Edge Representations:**
        *   Guidance on representing *processes* vs. *states* could be clearer. E.g., is Morphogenesis a node (behavior) or a complex edge/graph motif representing temporal evolution? (Current approach uses BehaviorArchetypeNode, which seems reasonable).
        *   Representing hierarchical control (e.g., higher-level goals modulating lower-level rules) needs clear conventions.
    *   **Scoring Difficulties:**
        *   Scoring reviews vs. experimental/theoretical papers using the same template is challenging, as reviews often lack specific quantitative data needed for many scores (e.g., M2.3, M3.3). The instruction to use N/A->0 for the readiness score calculation might unfairly penalize reviews. Perhaps a different weighting or calculation for reviews?
        *   The Cognitive Proximity Score (M9.2) relies heavily on interpretation against the scale; providing more concrete examples for each level within the scale definition could improve consistency.
    *   **Data Extraction/Output Mapping:**
        *   Mapping qualitative descriptions from a review (like this paper) onto quantitative fields (Value, Units) often results in "N/A" or "Qualitative". This is unavoidable but highlights a template emphasis on quantitative data which reviews may lack.
        *   Distinguishing between Implicit/Explicit can be tricky in reviews – is it explicit *in the review* or explicit *in the primary source*? The current instruction focuses on the analyzed paper, which is appropriate.
    *   **Overall Usability:** The template is very comprehensive and detailed, effectively forcing a structured analysis along CT-GIN relevant axes. Its strength is its thoroughness. Its challenge is applying it consistently, especially to diverse paper types like reviews or highly theoretical work where quantitative data is sparse. The strict formatting is critical but demanding.
    * **Specific Suggestions:**
        *   Consider adding conditional logic to hide/deprioritize certain quantitative metric sections (like detailed energy efficiency M2.3/M2.4 or memory operation costs M3.7) when the paper type is "Review".
        *   Provide a clearer rubric or examples for the Yoneda Score (M4.7) and Cognitive Proximity Score (M9.2).
        *   Refine the CT-GIN Readiness Score calculation (M13.1) to better handle N/A values, perhaps by averaging only available scores or using different weights based on paper type.
        *   Add prompts related to information flow and control interfaces.