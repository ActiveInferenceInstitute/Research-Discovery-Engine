# Perceived risk determines spatial position in fish shoals through altered rules of interaction

__Paper Type:__ Experimental

## M1: System Overview & Implementation
*   **Vector ID:** M1
*   **Vector Type:** Overview

### **1.1 System Description**

*   **Vector ID:** M1.1
*   **Vector Type:** Description
    *   Content: The system consists of a shoal of 16 black neon tetra fish (Hyphessobrycon herbertaxelrodi), composed of two subgroups (8 habituated, 8 non-habituated) in a quasi-two-dimensional experimental tank. The purpose is to investigate how differences in perceived risk (manipulated via habituation) affect individual spatial positioning and interaction rules within the shoal. The system's behavior (individual trajectories) is recorded and analyzed using methods like force maps and machine learning to understand collective dynamics and interaction rules.
    *   CT-GIN Mapping: `SystemNode` attributes: `systemType: BiologicalCollective`, `domain: AnimalBehavior/CollectiveMotion`, `mechanism: SocialInteraction/RiskPerception`, `components: [BlackNeonTetra (habituated), BlackNeonTetra (non-habituated), ExperimentalTank]`, `purpose: StudyRiskPerceptionEffectsOnShoaling`
    *   Implicit/Explicit: Explicit
        *  Justification: The paper explicitly describes the fish species, group composition, experimental setup, manipulation (habituation), and the overall goal of the study in the Abstract and Introduction/Methods sections.

### **1.2 Implementation Clarity**

*   **Vector ID:** M1.2
*   **Vector Type:** Score
    *   Score: 9
    *   Justification: The Methods section provides clear and detailed descriptions of the subjects (species, number, housing), apparatus (tank dimensions, water conditions, recording setup), procedure (habituation protocol, test trial, merging), and data extraction/preprocessing (tracking software, filtering). The experimental manipulation (habituation vs. non-habituation) is well-defined. Minor ambiguities might exist in fine details not crucial for replication (e.g., exact lighting spectrum), but overall clarity is very high.
    *   Implicit/Explicit: Explicit
        * Justification: The score is based on the explicit, detailed information provided in the Methods section.

### **1.3 Key Parameters**

*   **Vector ID:** M1.3
*   **Vector Type:** ParameterTable
    *   Table:
        | Parameter Name | Value | Units | Source (Fig/Table/Section) | Implicit/Explicit | Data Reliability (High/Medium/Low) | Derivation Method (if Implicit) |
        | :------------- | :---: | :---: | :-----------------------: | :-----------------: | :-----------------------------: | :-------------------------------: |
        | Number of Fish | 16 | individuals | Methods: Subjects | Explicit | High | N/A |
        | Subgroup Size | 8 | individuals | Methods: Subjects | Explicit | High | N/A |
        | Tank Dimensions | 100 x 100 x 7 (water column height) | cm | Methods: Apparatus | Explicit | High | N/A |
        | Recording Duration | 120 | minutes | Methods: Test trial | Explicit | High | N/A |
        | Frame Rate | 50 | fps | Methods: Apparatus | Explicit | High | N/A |

    *   **Note:** These parameters define the core setup of the experiment. Data reliability is high as these are directly stated experimental conditions.

## M2: Energy Flow
*   **Vector ID:** M2
*   **Vector Type:** Energy

### **2.1 Energy Input**

*   **Vector ID:** M2.1
*   **Vector Type:** Input
    *   Content: The primary energy source is metabolic energy derived from food consumed by the fish, powering their muscle contractions for swimming. External energy inputs include lighting for visibility (necessary for visual interaction and recording) and potentially heating to maintain water temperature.
    *   Value: N/A
    *   Units: N/A
    *   CT-GIN Mapping: `EnergyInputNode`: attributes - `source: [Metabolic (fish), Electrical (lighting/heating)]`, `type: [Chemical (food), Radiant (light), Thermal (heat)]`
    *   Implicit/Explicit: Implicit
        *  Justification: The paper studies behavior, not energetics. Metabolic energy input is fundamental to animal movement but not explicitly discussed or quantified. Lighting and heating are mentioned as experimental conditions but not analyzed as energy inputs to the *behavioral dynamics*.

### **2.2 Energy Transduction**

*   **Vector ID:** M2.2
*   **Vector Type:** Transduction
    *   Content: Metabolic energy (chemical) is transduced into kinetic energy (swimming motion) via muscle contractions. Sensory information (visual, potentially lateral line) about neighbors and the environment is transduced into neural signals, which inform motor commands, influencing the kinetic energy output (changes in speed and direction).
    *   CT-GIN Mapping: `EnergyTransductionEdge`: attributes - `mechanism: MuscleContraction`, `from_node: MetabolicEnergy`, `to_node: KineticEnergy`; `InformationTransductionEdge`: attributes - `mechanism: NeuralProcessing`, `from_node: SensoryInput`, `to_node: MotorOutput(KineticEnergy)`
    *   Implicit/Explicit: Implicit
        *  Justification: These are fundamental biological processes underlying fish movement and interaction, inferred from the context of animal behavior, but not explicitly detailed or analyzed in the paper.

### **2.3 Energy Efficiency**

*   **Vector ID:** M2.3
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification/Metrics: The paper does not discuss or quantify the energy efficiency of swimming, sensory processing, or information transfer in the fish. Assigning a score would be purely speculative.
    *   CT-GIN Mapping: N/A
    *   Implicit/Explicit: Explicit
      *  Justification: The absence of information on energy efficiency is explicit.

### **2.4 Energy Dissipation**

*   **Vector ID:** M2.4
*   **Vector Type:** Dissipation
    *   Content: Energy is dissipated primarily as heat due to metabolic processes and hydrodynamic drag during swimming. Sound production might represent minor dissipation.
    *   CT-GIN Mapping: `EnergyDissipationNode`: attributes - `mechanism: [MetabolicHeat, HydrodynamicDrag]`; `EnergyDissipationEdge`: `from_node: KineticEnergy`, `to_node: HydrodynamicDragLoss`; `from_node: MetabolicEnergy`, `to_node: MetabolicHeatLoss`
    *    Implicit/Explicit: Implicit
        *  Justification: These dissipation mechanisms are inherent to biological locomotion in fluids but are not quantified or discussed in the paper.

## M3: Memory
*   **Vector ID:** M3
*   **Vector Type:** Memory

### **3.1 Memory Presence:**

*   **Vector ID:** M3.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The core experimental manipulation relies on habituation, where one subgroup of fish has prior experience (memory) of the experimental tank, leading to a reduced perception of risk compared to the non-habituated group. This difference in past experience directly influences their current behavior (spatial positioning, interaction rules). This constitutes memory as a change in system state (internal risk perception based on experience) that persists and influences future behavior.
    *    Implicit/Explicit: Mixed
        * Justification: The paper explicitly describes the habituation process and the resulting behavioral differences. It implicitly treats habituation as a form of memory influencing risk perception, using terms like "experience" and "familiarity". It doesn't explicitly use the term "memory" in a theoretical cognitive sense but describes a phenomenon functionally equivalent to memory affecting behavior.

**(Conditional: If M3.1 is "No", skip to Module 4. If "Yes", include M3.2 and M3.3.)**

### **3.2 Memory Type:**

*   **Vector ID:** M3.2
*   **Vector Type:** Score
*   Score: 3
*   Justification: The memory involved is related to habituation – a simple form of non-associative learning where response to a repeated stimulus decreases. It represents a persistent change based on past environmental exposure (familiarity with the tank). It's not actively re-writable in the experiment context (fish are either habituated or not) and likely represents a change in internal state (risk perception) rather than encoding specific events. The capacity seems limited to 'familiar/safe' vs 'unfamiliar/risky'. Read-out is via altered behavior. On a scale of memory capabilities, it's present but basic compared to associative learning or episodic memory.
*   CT-GIN Mapping: `MemoryNode` type: `HabituationMemory`, attributes: `encoding: EnvironmentalExposure`, `readout: BehavioralChange (RiskPerception)`
*    Implicit/Explicit: Implicit
    * Justification: The score and type are inferred from the description of the habituation process and its effects, applying a cognitive interpretation not explicitly stated in the paper.

### **3.3 Memory Retention Time:**

*   **Vector ID:** M3.3
*   **Vector Type:** Parameter
*   Value: > 5 days, < lifetime
*    Units: days (Qualitative Descriptor: "Long-term" relative to experiment duration)
*   Justification: The habituation occurred over 5 days prior to the test trial. The effects persisted for the 2-hour experiment. The exact decay time is unknown but is longer than the experimental duration and likely shorter than the fish's lifetime. It's long-term in the context of the experiment.
*    Implicit/Explicit: Implicit
        * Justification: The 5-day habituation period and 2-hour test are explicit. The retention time being longer than 2 hours but shorter than a lifetime is inferred.
*   CT-GIN Mapping: Attribute `retentionTime: LongTerm (>2hours)` of the `MemoryNode`

### **3.4 Memory Capacity (Optional - if applicable)**

* **Vector ID:** M3.4
* **Vector Type:** Parameter
*  Value: Low (Essentially binary: Familiar/Unfamiliar)
*   Units: states
*   Justification: Based on the experimental design, the memory primarily distinguishes between the familiar (habituated) and unfamiliar (non-habituated) state concerning the experimental tank. The capacity seems limited to this distinction.
*    Implicit/Explicit: Implicit
        *  Justification: Inferred from the binary nature of the experimental manipulation (habituated vs. non-habituated).
*   CT-GIN Mapping: Attribute `capacity: Low (Binary)` of the `MemoryNode`

### **3.5 Readout Accuracy (Optional - if applicable)**

* **Vector ID:** M3.5
* **Vector Type:** Parameter
*   Value: N/A
*   Units: N/A
*   Justification: The paper doesn't quantify the accuracy of memory readout. It demonstrates *that* the memory (habituation state) influences behavior, but not with what fidelity this internal state translates to specific actions. The ML classification accuracy (Table I) reflects the discriminability of behaviors *resulting* from the memory state, not the accuracy of the memory readout itself.
*    Implicit/Explicit: Explicit
       *  Justification: The absence of information on readout accuracy is explicit.
*   CT-GIN Mapping: N/A

### **3.6 Degradation Rate (Optional - if applicable)**
* **Vector ID:** M3.6
* **Vector Type:** Parameter
    *   Value: N/A
    *   Units: N/A
    *   Justification: The experiment doesn't track the decay of the habituation effect over time beyond the 2-hour trial.
    *    Implicit/Explicit: Explicit
            * Justification: The absence of information on degradation rate is explicit.
    *   CT-GIN Mapping: N/A

### **3.7 Memory Operations Energy Cost (Optional - if applicable)**
* **Vector ID:** M3.7
* **Vector Type:** Table
*   Table:
    | Memory Operation ID | Energy Consumption per Bit | Power Usage during Operation| Units | Uncertainty | Data Source Reference | Implicit/Explicit | Justification |
    | :------------------ | :--------------------------: | :-----------------------------: | :---: |:-----------------:|:-----------------:|:-----------------:| :------------------ |
    | N/A                 | N/A                          | N/A                            | N/A  | N/A        | N/A     | Explicit | The paper does not discuss the energetics of habituation. |
*   Implicit/Explicit: Explicit
    *   Justification: The paper focuses on behavior, not the energetics of learning/memory processes.

### **3.8 Memory Fidelity & Robustness Metrics (Optional - if applicable)**
* **Vector ID:** M3.8
* **Vector Type:** Table
*   Table:
    | Metric ID | Description | Value | Units | CT-GIN Mapping | Data Source | Implicit/Explicit | Justification |
    | :-------- | :---------- | :----: | :---: | :-------------: | :----------: |:-----------------:| :-----------------:|
    | N/A       | N/A         | N/A    | N/A   | N/A             | N/A          | Explicit        | The paper does not provide specific metrics for memory fidelity or robustness beyond the persistence of behavioral differences during the experiment. |
*   Implicit/Explicit: Explicit
*   Justification: The absence of these specific metrics is explicit.
---

## M4: Self-Organization and Emergent Order
*   **Vector ID:** M4
*   **Vector Type:** Self-Organization

### **4.1 Self-Organization Presence:**

*   **Vector ID:** M4.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The formation and maintenance of a cohesive, polarized fish shoal from the interactions of individual fish is a classic example of self-organization in biological systems. Global properties like shoal shape, size (radius of gyration), polarization, and spatial sorting (central positioning of non-habituated fish) emerge from local interactions between individuals (attraction, repulsion, alignment, risk-dependent modifications). There is no external controller dictating the global shoal structure.
    *   Implicit/Explicit: Mixed
        *  Justification: The paper explicitly describes the collective behaviors (shoal formation, polarization, spatial assortment) and analyzes local interaction rules (force maps, nearest-neighbor interactions). It implicitly frames the global patterns as emerging from these local rules, consistent with the definition of self-organization in collective behavior literature, although the term "self-organization" isn't explicitly used frequently.

**(Conditional: If M4.1 is "No", skip to Module 5. If "Yes", include M4.2-M4.7)**

### **4.2 Local Interaction Rules:**

*   **Vector ID:** M4.2
*   **Vector Type:** Rules
    *   Content: The paper infers interaction rules using force maps and nearest-neighbor analysis:
        1.  **Local Spatial Interactions (Attraction-Repulsion):** Inferred from acceleration vs. relative position to nearest neighbor (Fig 2d,e,f). Shows repulsion at very short distances, attraction at longer distances, and an equilibrium distance. Non-habituated fish show weaker repulsion. Mechanism: Likely visual/lateral line sensing leading to speed/direction adjustments to maintain preferred distance.
        2.  **Local Alignment:** Inferred from acceleration vs. relative velocity to nearest neighbor (Fig S13). Fish tend to align with neighbors, particularly faster ones ("selective alignment"). Non-habituated fish show different occupancy in the alignment force map phase space, suggesting modified alignment responses. Mechanism: Likely visual/lateral line sensing of neighbor orientation/speed leading to turning adjustments.
        3.  **Risk-Dependent Modification:** Non-habituated fish exhibit altered rules compared to habituated fish (weaker repulsion, potentially different alignment strength/response characteristics, tendency to follow).
    *   CT-GIN Mapping: Defines `LocalInteractionEdge` between `AgentNode` (fish). Attributes capture `interactionType: [Repulsion, Attraction, Alignment]`, `strength`, `range`, `dependency: RiskPerception(HabituationState)`. The force maps represent averaged/effective rules.
    * **Implicit/Explicit**: Mixed
        *  Justification: The force maps and neighbor analyses explicitly derive *average* interaction patterns (Figs 1e-g, 2d-f, S13). The interpretation as specific "rules" (attraction, repulsion, alignment) and the underlying sensory-motor mechanisms are implicitly based on standard models of collective motion referenced in the introduction/discussion (e.g., [17-19, 25, 26]). Risk-dependency is explicitly shown through comparisons between subgroups.

### **4.2.1 Local Interaction Parameters:**

* **Vector ID:** M4.2.1
* **Vector Type:** Table
*   Table:
    | Rule ID | Description | Parameter Name | Parameter Value Range | Units | Data Source | Implicit/Explicit | Justification |
    | :------ | :---------- | :------------- | :---------- | :---: | :----------: | :----------------: | :------------: |
    | Attr/Rep | Equilibrium Distance | Preferred NN Distance (Peak of PDF) | ~3-4 | cm | Fig 2c | Explicit | Peak value from plotted PDF. |
    | Attr/Rep | Repulsion Strength | Max Repulsive Acceleration (Radial) | Hab: ~17.5, Non-hab: ~12.5-15 | cm/s² | Fig 2f | Explicit | Peak values from plotted force map analysis. |
    | Attr/Rep | Attraction Strength | Attractive Acceleration (Radial) @ 10cm | ~5 | cm/s² | Fig 2f | Explicit | Approximate value read from graph. |
    | Alignment | N/A | N/A | N/A | N/A | Fig S13 | Explicit | Force map shown, but specific parameters like alignment strength coefficient not extracted numerically. |
    | Group | Attraction to Center | Attractive Acceleration (Radial) @ 20cm | ~10-15 | cm/s² | Fig 1g | Explicit | Approximate value read from graph. |

### **4.3 Global Order:**

*   **Vector ID:** M4.3
*   **Vector Type:** Order
    *   Content: The global order emerging includes:
        1.  **Cohesive Shoal Formation:** Fish maintain proximity, forming a distinct group (quantified by radius of gyration Rg, Figs S2c,d).
        2.  **Polarization:** Individuals tend to align their velocity vectors, leading to coordinated group movement (quantified by polarization ϕ, Fig 3b).
        3.  **Spatial Assortment:** Non-random distribution of individuals based on risk perception state. Non-habituated fish occupy more central positions (Figs 1a,b,c) and spend less time on the border (Fig 1d). Habituated fish tend towards the front (Fig 1c).
    *   CT-GIN Mapping: Defines `ConfigurationalNode` attributes: `structure: PolarizedShoal`, `orderParameter: [Polarization(ϕ), RadiusOfGyration(Rg)]`, `spatialPattern: RiskBasedAssortment`. Links to `SystemNode` via `EmergenceEdge`.
    * **Implicit/Explicit**: Explicit
        *  Justification: The paper explicitly describes and quantifies these global patterns (cohesion, polarization, spatial assortment) in the Results section using specific metrics and figures.

### **4.4 Predictability of Global Order:**

*   **Vector ID:** M4.4
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: The general formation of a polarized shoal and the trend of risk-based spatial assortment are predictable outcomes based on the local rules and the setup. The specific metrics (e.g., Rg, ϕ, density distributions) show consistent trends across replicates (Figs S1, S5, S7, etc.), indicating predictability. However, stochasticity inherent in individual fish behavior introduces variability, meaning the exact configuration at any moment isn't perfectly predictable. The ML tool's moderate instantaneous accuracy (~53.5%, Table Ia) suggests moment-to-moment behavior related to subgroup identity (driving assortment) has significant unpredictability, while temporal averaging improves predictability (77-79%, Table Ib).
    * **Implicit/Explicit**: Mixed
    *  Justification: The consistency of results across replicates (explicit) supports predictability. The discussion of stochasticity and ML accuracy (explicit) indicates limits to predictability. The score itself is an inferred judgment based on this evidence.
    *   CT-GIN Mapping: Weight/attribute associated with `EmergenceEdge` linking `LocalInteractionEdge`s to `ConfigurationalNode`.

### **4.5. Local Interaction Rules (for Self-Organization)**
* **Vector ID:** M4.5
* **Vector Type:** Table
*   Table:
| Rule ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Source |
| :------ | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :-----: |
| Attr/Rep | Attraction/Repulsion vs NN distance | Max Repulsion Accel. | ~12.5 - 17.5 | cm/s² | Explicit | Value read from Fig 2f | Fig 2f |
| Attr/Rep | Attraction/Repulsion vs NN distance | Equilibrium Distance | ~3-4 | cm | Explicit | Peak of PDF in Fig 2c | Fig 2c |
| Align | Alignment vs NN relative velocity | N/A (Qualitative map) | N/A | N/A | Explicit | Force map presented, no scalar parameter | Fig S13 |
| GrpAttr | Attraction vs CM distance | Max Attraction Accel. | ~10-15 | cm/s² | Explicit | Value read from Fig 1g | Fig 1g |
| Follow | Leader-Follower Delay (Orientation) | Max Correlation Delay | -0.04 to +0.04 | s | Explicit | Peak positions in Fig 5a | Fig 5a |
| Follow | Leader-Follower Delay (Speed) | Max Correlation Delay | -0.04 to +0.04 | s | Explicit | Peak positions in Fig 5b | Fig 5b |

### **4.6. Globally Emergent Order and Order Parameters**
* **Vector ID:** M4.6
* **Vector Type:** Table
*   Table:
| Property ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Protocol | Source |
| :---------- | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :------: | :-----: |
| Cohesion | Group Size/Spread | Radius of Gyration (Rg) | ~10-15 (start), ~15-20 (end) | cm | Explicit | Approx. range from center in Fig 1g/S2f | Calculation from trajectories | Fig 1g, S2c/d/f |
| Polarization | Group Alignment | Polarization (ϕ) | Mean ~0.7-0.8 | dimensionless | Explicit | PDF peak/range in Fig 3b | Calculation from velocities | Fig 3b |
| Assortment | Spatial Segregation | Relative Density (Non-Hab center vs Hab) | >1 (center), <1 (periphery) | dimensionless | Explicit | Color scale Fig 1a, PDF ratios Fig 1b/c | Normalised counts | Fig 1a,b,c |
| Assortment | Border Occupancy | Avg. time on border (∆t_border) | Mean ~0.15 (short), Hab > Non-hab (long) | s | Explicit | PDF peak/tails Fig 1d | Convex hull analysis | Fig 1d |

### **4.7 Yoneda Embedding and Local-to-Global Mapping Fidelity**

*   **Vector ID:** M4.7
*   **Vector Type:** Table
*   Table:
    | Link Type | Description | Predictability | Yoneda Score | Metrics | Implicit/Explicit | Justification | Source |
    | :-------- | :---------- | :------------- | :----------- | :------ | :----------------: | :------------: | :-----: |
    | Local Attr/Rep -> Cohesion | Local NN interactions aggregate to form cohesive group | Medium-High | N/A | Rg stability, NN distance PDF | Mixed | Qualitative link strong, quantitative mapping complex. Yoneda not applied. | Fig 1g, 2c |
    | Local Align -> Polarization | Local alignment interactions lead to global polarization | Medium-High | N/A | ϕ value, Alignment force map | Mixed | Qualitative link strong, quantitative mapping complex. Yoneda not applied. | Fig 3b, S13 |
    | Risk-modified Local Rules -> Assortment | Differences in local NN interactions (esp. repulsion) lead to central positioning of Non-Hab | Medium | N/A | Density maps, Border time PDF, Repulsion strength difference | Mixed | Plausible mechanism proposed, direct quantitative link complex. Yoneda not applied. | Fig 1a-d, 2f |
    *   **Yoneda Embedding Fulfillment Score [0-10]:** N/A
    *   **Metrics:** Radius of Gyration (Rg), Polarization (ϕ), Nearest-Neighbor Distance PDF, Relative Density Maps, Border Time PDF, Interaction Force Maps (Attraction, Repulsion, Alignment), Leader-Follower Correlations.
    *   **Justification:** The paper establishes correlations between local interaction differences (e.g., weaker repulsion for non-habituated fish) and emergent global patterns (central positioning). This suggests a mapping exists, but it's complex and mediated by the collective dynamics. Predictability is reasonable for average behaviors but limited instantaneously due to stochasticity. The Yoneda embedding concept is not used or tested in the paper. Assigning a score would require a dedicated theoretical analysis beyond the scope of the publication.

## M5: Computation
*   **Vector ID:** M5
*   **Vector Type:** Computation

### **5.1 Embodied Computation Presence:**

*   **Vector ID:** M5.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The computation described in the paper (e.g., force map inference, machine learning classification) is performed *externally* by the researchers *on the data* collected from the fish shoal. The fish themselves are processing sensory information and making decisions based on internal states (risk perception) and local interactions, which can be viewed as a form of biological computation, but the paper does not frame it as embodied computation intrinsic to the *material* properties of the shoal in the sense used in material intelligence literature. The ML tool *analyzes* behavior, it is not *part* of the fish system's operation.
    *    Implicit/Explicit: Explicit
        *  Justification: The paper clearly describes the analysis methods (force maps, ML) as tools applied *by the researchers* to understand the system, not as computational processes occurring *within* the system itself.

**(Conditional: If M5.1 is "No", skip to Module 6. If "Yes", include M5.2-5.4)**

### **5.2 Computation Type:**

*   **Vector ID:** M5.2
*   **Vector Type:** Classification
    *   Content: N/A
    *   CT-GIN Mapping: N/A
    *    Implicit/Explicit: N/A
    *    Justification: N/A

### **5.3 Computational Primitive:**

*   **Vector ID:** M5.3
*   **Vector Type:** Function
    *   Content: N/A
    *   CT-GIN Mapping: N/A
    *   Implicit/Explicit: N/A
    * Justification: N/A

### **5.4 Embodied Computational Units**
* **Vector ID:** M5.4
* **Vector Type:** Table
*   Table:
| Unit ID | Description | Processing Power | Energy/Operation | Freq/Resp. Time | Bit-Depth | Data Source | Implicit/Explicit | Justification |
| :------ | :---------- | :--------------- | :--------------- | :--------------: | :-------: | :----------: |:-----------------:| :-----------------:|
| N/A     | N/A         | N/A              | N/A              | N/A             | N/A       | N/A          | Explicit        | No embodied computation identified in the system itself. |

## M6: Temporal Dynamics
*   **Vector ID:** M6
*   **Vector Type:** Temporal

### **6.1 Timescales:**

*   **Vector ID:** M6.1
*   **Vector Type:** ParameterTable
    *   Table:
        | Timescale Description | Value | Units | Source | Implicit/Explicit | Justification |
        | :-------------------- | :---: | :---: | :----: | :----------------: | :------------: |
        | Frame Rate (Sampling Interval) | 0.02 | s | Methods: Apparatus | Explicit | 1 / 50 fps |
        | Reaction Time (Leader-Follower Delay) | ~0.02 - 0.04 | s | Fig 5a,b; S14 | Explicit | Peak offset in correlation functions. |
        | Burst-and-Coast Period (∆t_BC) | Peak ~0.5-1 | s | Fig 6c | Explicit | Peak of PDF distribution. |
        | Short Border Duration | ~0.15 | s | Fig 1d | Explicit | Peak of PDF distribution. |
        | Long Border Duration | > 5 | s | Fig 1d | Explicit | Tail behavior of PDF. |
        | Habituation Period | 5 | days | Methods: Procedure | Explicit | Duration of pre-exposure. |
        | Experiment Duration | 120 | minutes | Methods: Test trial | Explicit | Duration of recording. |
        | Temporal Trend Analysis Window | 30 | minutes | Fig S2, S6, S8, S12, S15, S17 | Explicit | Comparison of first/last half-hour. |
    *   **Note:** Various timescales are relevant, from rapid reactions and movements (<1s) to experimental durations (hours) and learning (days).

### **6.2 Active Inference:**

*   **Vector ID:** M6.2
*   **Vector Type:** Assessment
    *   Content: No
    *   Justification: The paper does not frame fish behavior in terms of active inference. While fish adjust behavior based on perceived risk (internal state) and social cues (external state) to achieve desirable outcomes (e.g., safety in the center, shoal cohesion), there is no explicit mention or analysis of prediction error minimization, generative models, or surprise reduction. The observed behaviors are explained via inferred interaction rules (force maps) and established hypotheses (selfish herd), not active inference principles.
    *   Implicit/Explicit: Explicit
        *  Justification: Active inference terminology and concepts are absent from the paper.
    *   **If Yes/Partial, provide examples of testable CT-GIN metrics that *could* be used to quantify active inference:** N/A

## M7: Adaptation
*   **Vector ID:** M7
*   **Vector Type:** Adaptation

### **7.1 Adaptive Plasticity Presence:**

*   **Vector ID:** M7.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: Two forms of adaptation/plasticity are present:
        1.  **Habituation (Learning):** The habituated group exhibits altered behavior (reduced risk perception, different positioning/interactions) due to prior experience in the tank. This is a persistent change resulting from environmental exposure (learning).
        2.  **Temporal Trends (Within-Trial Adaptation):** The paper notes changes over the 2-hour experiment (e.g., group expands, interactions weaken, Figs S2, S6, S8, S12, S15, S17). This suggests adaptation to the ongoing conditions within the trial, potentially due to decreasing novelty/stress or accumulating familiarity even for the non-habituated group over time, consistent with previous work [6].
    *    Implicit/Explicit: Mixed
        * Justification: Habituation is explicitly designed and its effects shown. The interpretation as adaptive plasticity/learning is standard in behavioral ecology but implicit in the paper's framing. The within-trial temporal trends are explicitly shown, and their interpretation as adaptation is suggested by comparison to previous work [6] and the context.

**(Conditional: If M7.1 is "No", skip to Module 8. If "Yes", include M7.2)**

### **7.2 Adaptation Mechanism:**

*   **Vector ID:** M7.2
*   **Vector Type:** Description
    *   Content:
        1.  **Habituation:** The mechanism is non-associative learning through repeated exposure to the experimental tank environment, leading to decreased perception of risk/novelty. The underlying neural/physiological mechanism is not investigated.
        2.  **Within-Trial Adaptation:** The mechanisms are not explicitly determined but likely involve factors such as decreasing stress/fear over time, increasing familiarity with the tank environment even for non-habituated fish, or potentially physiological changes (e.g., fatigue, changing motivation). The paper notes consistency with previous work [6] suggesting ongoing adaptation.
    *   CT-GIN Mapping: Defines `AdaptationNode`. `mechanism: [Habituation (NonAssociativeLearning), WithinTrialAdaptation (StressReduction/Familiarization)]`. Links to `MemoryNode` (for habituation) and influences `LocalInteractionEdge` attributes over time.
    *    Implicit/Explicit: Implicit
        *  Justification: The paper describes the habituation *procedure* and observes temporal *trends*. The interpretation of the underlying mechanisms (non-associative learning, stress reduction) is based on standard behavioral principles and comparison to other work, not direct investigation within this paper.

## M8: Emergent Behaviors
*   **Vector ID:** M8
*   **Vector Type:** Behavior

### **8.1 Behavior Description:**

*   **Vector ID:** M8.1
*   **Vector Type:** Description
    *   Content: The primary behaviors described are:
        1.  **Collective Motion/Shoaling:** Fish form and maintain a cohesive, polarized group.
        2.  **Spatial Positioning/Assortment:** Individuals occupy specific locations within the shoal based on their habituation state (perceived risk), consistent with the Selfish Herd Hypothesis (non-habituated central, habituated peripheral/frontal).
        3.  **Altered Local Interactions:** Differences in nearest-neighbor interactions (attraction, repulsion, alignment) and leader-follower dynamics depending on the habituation state of the interacting pair.
        4.  **Burst-and-Coast Locomotion:** Individual fish exhibit characteristic oscillations in speed.
    *   CT-GIN Mapping: `BehaviorArchetypeNode` types: `CollectiveMotion`, `SpatialAssortment`, `ModifiedLocalInteraction`, `IndividualLocomotion`. Attributes capture details like polarization level, central bias strength, NN interaction parameters, burst-coast parameters.
    *    Implicit/Explicit: Explicit
       *  Justification: These behaviors are the main focus of the Results section, explicitly described and quantified through various metrics and figures.

### **8.2 Behavior Robustness:**

*   **Vector ID:** M8.2
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The main emergent behaviors (shoaling, spatial assortment based on risk) appear robust. They are consistently observed across three experimental replicates (Series A, B, C, shown in Supplementary Figures). While individual trajectories are stochastic, the aggregate statistical patterns (PDFs, averages) defining the behaviors are reproducible. The system maintains cohesion and the distinction between subgroups persists over the 2-hour duration, although quantitative aspects evolve (temporal trends). Robustness to other perturbations (e.g., environmental changes, different group sizes) is not tested.
    *   Implicit/Explicit: Mixed
        *  Justification: Consistency across replicates (explicit evidence from supplementary figures) supports robustness. The score is an inferred judgment based on this evidence and the persistence over time, acknowledging the lack of specific perturbation tests.
    *   CT-GIN Mapping: Reliability attribute of the `BehaviorArchetypeNode`s.

### **8.3 CT-GIN Emergent Behavior Validation**

*    **Vector ID:** M8.3
*    **Vector Type:** Validation
     *  Content: Claims of emergent behaviors are validated through:
         1.  **Quantitative Analysis:** Trajectory data is processed to calculate specific metrics (Rg, ϕ, relative positions, NN distances/velocities, border time, burst-coast parameters, correlations). Statistical distributions (PDFs) and averages are computed and compared between subgroups and over time (Figs 1-6, S1-S17).
         2.  **Force Map Method:** Used to infer average local interaction rules from observed accelerations and relative positions/velocities (Figs 1e-g, 2d-f, S13).
         3.  **Machine Learning:** An XGBoost classifier is trained on instantaneous or temporally aggregated features to predict subgroup identity, validating that behavioral differences are statistically significant and quantifiable (Table I, Fig S18).
         4.  **Replication:** The experiment was replicated three times (Series A, B, C) and consistency checked (Supplementary Figures).
         *   **Limitations:** Force maps show *average* interactions, potentially masking individual variation or state-dependent rules. ML classification provides statistical separability but doesn't fully elucidate causal mechanisms. Validation relies on statistical patterns in aggregate data.
     *   Implicit/Explicit: Explicit
    *   Justification: The paper explicitly details the quantitative methods, force maps, ML approach, and replication used to analyze and validate the observed behaviors in the Methods and Results sections.

## M9: Cognitive Proximity
*   **Vector ID:** M9
*   **Vector Type:** Cognition

### **9.1 Cognitive Mapping:**

*   **Vector ID:** M9.1
*   **Vector Type:** Description
    *   Content: The paper maps the fish's internal state to "perceived risk" or "informational state" influenced by habituation (experience/memory). Behavioral differences (spatial positioning, interaction rules) are interpreted as consequences of this internal cognitive/affective state, referencing cognitive concepts like the Selfish Herd Hypothesis and reliance on social information. The term "collective mind" is mentioned metaphorically in the introduction.
    *   CT-GIN Mapping: `CognitiveMappingEdge`: `source: BehaviorArchetypeNode (SpatialAssortment, ModifiedLocalInteraction)`, `target: CognitiveFunctionNode (RiskPerception, DecisionMaking, SocialCognition?)`. Attributes: `analogy: SelfishHerd, SocialInformationUse`.
    *   Implicit/Explicit: Mixed
    * Justification: The paper explicitly uses terms like "perceived risk" and links behavior to the "selfish herd hypothesis" and "social information". The interpretation as mapping to specific cognitive functions (decision-making, etc.) is implicit based on the context of behavioral ecology.

### **9.2 Cognitive Proximity Score:**

*   **Vector ID:** M9.2
*   **Vector Type:** Score
    *   Score: 2
    *   Justification: The system involves biological agents (fish) exhibiting behavior influenced by an internal state related to past experience (habituation affecting risk perception). This aligns with Level 2 (Sub-Organismal Responsivity) or potentially Level 3 (Reactive/Adaptive Autonomy) due to the adaptive nature of interactions based on perceived risk and social cues. Fish respond differently based on their habituation 'memory' and adjust interactions locally. However, the paper focuses on characterizing these responses rather than exploring higher cognitive functions like goal-directed planning, model-based reasoning, or abstract thought (Levels 4+). The "cognition" is primarily reactive and adaptive based on perceived risk and local social cues.
    *   Implicit/Explicit: Implicit
    *  Justification: The score is an interpretation based on applying the provided Cognizance Scale to the behaviors described in the paper. The paper provides evidence for adaptive responses (Level 2/3) but not for higher levels.

**CT-GIN Cognizance Scale:** (Provided for reference, not part of the output)

### **9.3 Cognitive Function Checklist**

* **Vector ID:** M9.3
* **Vector Type:** Checklist
    *   | Cognitive Function               | Score (0-10) | Justification/Notes                                                                       | CT-GIN Mapping (if applicable) | Implicit/Explicit | Justification for Implicit/Explicit/Mixed |
    | :-------------------------------- | :----------: | :------------------------------------------------------------------------------------ | :--------------------------------: | :-----------------:|:-----------------:|
    | Sensing/Perception               |      6       | Fish perceive neighbors (visual/lateral line) & environment (implied by habituation effect). Assumed functional, not explicitly measured detail. |  N/A                              | Implicit          | Inferred necessity for observed behavior. |
    | Memory (Short-Term/Working)        |      1       | Possibly involved in tracking neighbor states briefly, but not studied. Burst-coast might involve short-term motor patterns.  | N/A                               | Inferred          | Speculative, no direct evidence. |
    | Memory (Long-Term)                 |      3       | Habituation effect demonstrates memory lasting days, influencing risk perception. Simple, non-associative form. | `MemoryNode (HabituationMemory)` | Mixed             | Explicit manipulation, implicit cognitive interpretation. |
    | Learning/Adaptation              |      4       | Habituation is learning. Within-trial adaptation observed. Fish adapt interactions based on neighbor state (risk). | `AdaptationNode`                   | Mixed             | Explicit evidence of adaptation, implicit interpretation of mechanism. |
    | Decision-Making/Planning          |      2       | Fish make moment-to-moment decisions (speed/direction) based on local cues/risk. No evidence of complex planning. | N/A                               | Implicit          | Inferred from behavioral adjustments. |
    | Communication/Social Interaction |      5       | Rich social interactions (attraction, repulsion, alignment, leader-follower). Information transfer implied by correlations. | `LocalInteractionEdge`           | Explicit          | Interactions explicitly studied and quantified. |
    | Goal-Directed Behavior            |      2       | Behavior consistent with goals (safety via selfish herd, group cohesion), but primarily reactive based on local rules/internal state. | N/A                               | Implicit          | Interpreted via hypotheses (e.g., Selfish Herd). |
    | Model-Based Reasoning              |      0       | No evidence presented.                                                                      | N/A                               | Explicit          | Absence of evidence. |
    | **Overall score**                 |    [2.88]    | Primarily demonstrates robust sensing, social interaction, and basic learning/adaptation influencing collective behavior. | N/A                               | N/A               | N/A |

    *   **Note:** Scores reflect the extent to which the paper provides evidence *for* these functions operating *within the context of the study*. Fish possess these capabilities more broadly, but the score reflects what's demonstrated/analyzed here.

## M10: Criticality Assessment
*   **Vector ID:** M10
*   **Vector Type:** Criticality

### **10.1 Criticality:**

*   **Vector ID:** M10.1
*   **Vector Type:** Assessment
    *   Content: Unclear
    *   Justification: The paper does not analyze the system for signatures of criticality (e.g., scale-free correlations, power-law distributions in relevant variables like velocity fluctuations or cluster sizes, susceptibility peaks). While collective behavior systems, especially near phase transitions (like order-disorder), can exhibit criticality, this study doesn't investigate it. Some PDFs might hint at power laws (e.g., Fig 1d tail), but this isn't systematically tested or discussed in the context of criticality.
        *   Critical Parameters (If Yes/Partial): N/A
        *   Evidence: N/A
    *   Implicit/Explicit: Explicit
    *    Justification: The paper explicitly lacks any analysis or discussion related to criticality.

## M11: Review Paper Specifics (Conditional)

*   **Vector ID:** M11
*   **Vector Type:** Review
    * Content: N/A (Paper type is Experimental)

## M12: Theoretical Paper Specifics (Conditional)

*   **Vector ID:** M12
*   **Vector Type:** Theory
    * Content: N/A (Paper type is Experimental)

## M13: Overall Assessment & Scoring

*   **Vector ID:** M13
*   **Vector Type:** Overall

### **13.1 CT-GIN Readiness Score:**

*   **Vector ID:** M13.1
*   **Vector Type:** Score
*   **Calculated Score:** [5.67] (Average of M1.2=9, M2.3=0 (N/A), M3.2=3, M4.4=7, M8.2=8, M9.2=2. Note: N/A scores treated as 0)

**CT-GIN Readiness Summary Table:**

| CT-GIN Aspect                   | Strength (Yes/Partial/No) | Key Supporting Metrics (with units) | Limitations (Missing Metrics/Data Gaps)                                           | Improvement Areas (Future Research)                                          |
| :------------------------------ | :-----------------------: | :-----------------------------------| :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| Energy Flow Efficiency          | No                       | N/A                                  | No energy analysis provided.                                                     | Quantify metabolic cost of different behaviors/risk states.                     |
| Memory Fidelity                 | Partial                  | Habituation effect (>5 days retention implicitly), Subgroup classification accuracy (proxy for state readout) | Specific memory metrics (capacity, degradation, readout accuracy) absent.       | Detailed study of habituation decay, factors influencing memory consistency.   |
| Organizational Complexity       | Yes                      | Rg, ϕ, Density Maps, Border Time PDF  | Quantitative local-to-global mapping complex, criticality analysis absent.     | Model relationship between local rules & global patterns, test for criticality. |
| Embodied Computation            | No                       | N/A                                  | Computation is external analysis, not intrinsic system function.                 | N/A for this biological system in material intelligence context.             |
| Temporal Integration            | Yes                      | Reaction times, Burst-Coast periods, Adaptation timescales | Explicit link between timescales and information processing limited. Active Inference untested. | Model information flow latency, test Active Inference framework.             |
| Adaptive Plasticity             | Yes                      | Habituation effect, Within-trial trends | Mechanisms (neural basis, specific drivers of temporal trends) unclear.          | Investigate neural correlates of habituation, controlled study of temporal adaptation factors. |
| Functional Universality         | No                       | N/A                                  | System performs specific social behaviors, not general computation.                | N/A for this biological system.                                               |
| Cognitive Proximity            | Partial                  | Qualitative mapping to Risk Perception, Selfish Herd; Low score (2) on scale. | Lacks evidence for higher cognitive functions (planning, reasoning).             | Test for more complex decision-making, model-based behaviors.             |
| Design Scalability & Robustness | Partial                  | Robust behavior across replicates; Scalability untested. | Limited perturbation testing; Scalability to different group sizes/species unknown. | Test robustness to noise/perturbations; Study effect of group size/density.   |
| **Overall CT-GIN Readiness Score** |        **[5.67]**       |   |   |      |


### **13.2 Qualitative CT-GIN Assessment Conclusion:**

*   **Vector ID:** M13.2
*   **Vector Type:** Textual Summary
    *   Content: This study demonstrates robust self-organization in a biological collective (fish shoal), where global patterns like cohesion, polarization, and spatial assortment emerge from local interactions. It successfully links an internal state (perceived risk, manipulated via habituation memory) to modifications in local interaction rules and subsequent changes in the emergent global structure, consistent with the Selfish Herd Hypothesis. Key strengths include clear experimental implementation, detailed quantification of behavior using advanced tracking and analysis (force maps, ML), and demonstration of behavioral adaptation (habituation, temporal trends). Key limitations from a CT-GIN/material intelligence perspective include the lack of intrinsic computation (analysis is external), limited exploration of memory beyond basic habituation, absence of energy flow analysis, and no investigation of criticality. While showcasing adaptive collective behavior influenced by internal state (memory/risk perception), the system operates at a lower level of cognitive proximity (Level 2/3), primarily showing reactive/adaptive autonomy based on local cues and perceived risk, without evidence for higher cognitive functions like planning or model-based reasoning as defined in material intelligence contexts. The work provides valuable insights into biological collective behavior but has limited direct mapping to embodied computation or complex cognizance as envisioned for synthetic cognizant matter.

### **13.3 CT-GIN Refinement Directions:**

*   **Vector ID:** M13.3
*   **Vector Type:** Recommendations
    *   Content:
        *   **Model Local-to-Global Links:** Develop computational models explicitly linking the quantified differences in local interaction rules (e.g., repulsion strength, alignment dynamics) to the emergent global patterns (spatial assortment metrics).
        *   **Investigate Information Flow:** Use information-theoretic measures (e.g., transfer entropy) to quantify information flow between individuals beyond simple correlations, potentially revealing more about distributed processing.
        *   **Probe Memory Dynamics:** Design experiments to study the decay rate of habituation memory or test for associative learning capabilities related to risk/social cues.
        *   **Energetics Analysis:** Estimate or measure the metabolic cost associated with different behavioral states (e.g., central vs. peripheral position, high vs. low alignment) to understand energy trade-offs.
        *   **Criticality Testing:** Analyze fluctuations (e.g., velocity, position relative to CM) and correlation functions to test whether the shoal operates near a critical point, potentially linking dynamics to information processing capacity.
        *   **Explore Decision-Making Complexity:** Design scenarios requiring more complex decisions (e.g., navigating obstacles, responding to dynamic threats) to probe beyond reactive risk avoidance.

## M14: CT-GIN Knowledge Graph

*   **Vector ID:** M14
*   **Vector Type:** Visualization

### **14.1. CT-GIN Knowledge Graph:**
* **Content:**
    ```mermaid
    graph TD
        subgraph System
            S[SystemNode: Fish Shoal\n systemType: BiologicalCollective\n components: Fish(Hab/NonHab), Tank\n purpose: StudyRiskPerception]
        end

        subgraph Energy
            E_In(EnergyInputNode: Metabolic/Light/Heat)
            E_T1(EnergyTransductionEdge: Muscle Contraction)
            E_T2(InformationTransductionEdge: Sensory->Motor)
            E_Out(EnergyDissipationNode: Drag/MetabolicHeat)
            E_Kin(KineticEnergyNode: Swimming)
            E_Sens(SensoryInputNode: Visual/LateralLine)

            E_In -- Chemical --> E_T1
            E_In -- Radiant/Thermal --> S
            E_T1 -- Kinetic --> E_Kin
            E_Sens -- NeuralProcessing --> E_T2
            E_T2 -- MotorOutput --> E_Kin
            E_Kin -- HydrodynamicDrag --> E_Out
            E_In -- MetabolicProcess --> E_Out
        end

        subgraph Memory
            M(MemoryNode: Habituation\n type: NonAssociative\n retention: >5days\n capacity: Low)
        end

        subgraph SelfOrganization
            SO_Rule(LocalInteractionEdge: Attr/Rep/Align\n dependency: RiskPerception)
            SO_Global(ConfigurationalNode: PolarizedShoal, RiskAssortment\n metrics: ϕ, Rg, Density)
            Fish_i(AgentNode: Fish_i\n state: Hab/NonHab, Risk)
            Fish_j(AgentNode: Fish_j\n state: Hab/NonHab, Risk)

            Fish_i -- SO_Rule --> Fish_j
            SO_Rule -- Emergence --> SO_Global
            M -- Influences --> Fish_i
            M -- Influences --> Fish_j
            M -- Influences --> SO_Rule
        end

         subgraph Adaptation
            A(AdaptationNode: Habituation/WithinTrial)
            A -- Modifies --> SO_Rule
            A -- RelatedTo --> M
         end

        subgraph Behavior
            B_CM(BehaviorArchetypeNode: CollectiveMotion)
            B_SA(BehaviorArchetypeNode: SpatialAssortment)
            B_LI(BehaviorArchetypeNode: ModifiedLocalInteraction)
            B_IL(BehaviorArchetypeNode: IndividualLocomotion)

            SO_Global -- ManifestsAs --> B_CM
            SO_Global -- ManifestsAs --> B_SA
            SO_Rule -- ManifestsAs --> B_LI
            E_Kin -- ManifestsAs --> B_IL
        end

        subgraph Cognition
            C_RP(CognitiveFunctionNode: RiskPerception)
            C_DM(CognitiveFunctionNode: DecisionMaking (Local))
            C_Map1(CognitiveMappingEdge: SelfishHerd)
            C_Map2(CognitiveMappingEdge: SocialInfoUse)

            M -- LeadsTo --> C_RP
            B_SA -- C_Map1 --> C_RP
            B_LI -- C_Map2 --> C_DM
            C_RP -- Influences --> C_DM
            C_DM -- Influences --> SO_Rule
        end

        S -- Contains --> Fish_i
        S -- Contains --> Fish_j
        S -- Exhibits --> SO_Global
        S -- Exhibits --> B_CM
        S -- Exhibits --> B_SA
        S -- CharacterizedBy --> A
        S -- CharacterizedBy --> M

    style S fill:#f9f,stroke:#333,stroke-width:2px
    style E_In fill:#ff9,stroke:#333,stroke-width:1px
    style E_Out fill:#ff9,stroke:#333,stroke-width:1px
    style E_Kin fill:#ff9,stroke:#333,stroke-width:1px
    style E_Sens fill:#ccf,stroke:#333,stroke-width:1px
    style M fill:#9cf,stroke:#333,stroke-width:2px
    style SO_Global fill:#9f9,stroke:#333,stroke-width:2px
    style Fish_i fill:#eee,stroke:#333,stroke-width:1px
    style Fish_j fill:#eee,stroke:#333,stroke-width:1px
    style A fill:#fcc,stroke:#333,stroke-width:2px
    style B_CM fill:#cff,stroke:#333,stroke-width:1px
    style B_SA fill:#cff,stroke:#333,stroke-width:1px
    style B_LI fill:#cff,stroke:#333,stroke-width:1px
    style B_IL fill:#cff,stroke:#333,stroke-width:1px
    style C_RP fill:#fcf,stroke:#333,stroke-width:1px
    style C_DM fill:#fcf,stroke:#333,stroke-width:1px
    ```
    *Note: This graph visually summarizes the relationships between the different modules analyzed, based on the paper's content. Edge labels indicate the nature of the relationship.*

## M15: Relationship Vectors
*   **Vector ID:** M15
*   **Vector Type:** Relationships
*   Relationships:
        | Source Vector ID | Target Vector ID | Relationship Type |
        | ------------- | ------------- | ----------------- |
        | M3.1 (Memory Presence) | M3.2 (Memory Type) | Conditional |
        | M3.1 (Memory Presence) | M3.3 (Memory Retention) | Conditional |
        | M4.1 (SelfOrg Presence) | M4.2 (Local Rules) | Conditional |
        | M4.1 (SelfOrg Presence) | M4.3 (Global Order) | Conditional |
        | M4.1 (SelfOrg Presence) | M4.4 (Predictability) | Conditional |
        | M4.1 (SelfOrg Presence) | M4.7 (Yoneda) | Conditional |
        | M7.1 (Adaptation Presence) | M7.2 (Adaptation Mech) | Conditional |
        | M4.2 (Local Rules) | M4.3 (Global Order) | Emergence |
        | M3.1 (Memory Presence) | M4.2 (Local Rules) | Influence |
        | M3.1 (Memory Presence) | M9.1 (Cognitive Mapping) | BasisFor |
        | M7.1 (Adaptation Presence) | M4.2 (Local Rules) | Modification |
        | M4.3 (Global Order) | M8.1 (Behavior Desc) | Manifestation |
        | M4.2 (Local Rules) | M8.1 (Behavior Desc) | Manifestation |
        | M8.1 (Behavior Desc) | M9.1 (Cognitive Mapping) | CognitiveInterpretation |
        | M1.1 (System Desc) | M4.1 (SelfOrg Presence) | Context |
        | M1.1 (System Desc) | M3.1 (Memory Presence) | Context (via Habitation) |
        | M1.3 (Key Params) | M1.1 (System Desc) | Characterization |
        | M6.1 (Timescales) | M3.3 (Memory Retention) | Context |
        | M6.1 (Timescales) | M7.1 (Adaptation Presence) | Context |
        | M6.1 (Timescales) | M8.1 (Behavior Desc) | Characterization |
        | M13.1 (CT-GIN Score) | M1.2, M2.3, M3.2, M4.4, M8.2, M9.2 | CalculationDependency |
        | M13.2 (Conclusion) | M1-M10 | Summary |
        | M13.3 (Refinement) | M13.2 (Conclusion) | AddressesLimitations |

## M16: CT-GIN Template Self-Improvement Insights

*   **Vector ID:** M16
*   **Vector Type:** Feedback

### **Template Feedback:**

*    **Vector ID:** M16.1
*   **Vector Type:** Text
Provide specific, actionable feedback on the *CT-GIN template itself*, based on this analysis:
    *   **Missing Probes:**
        *   A probe specifically addressing *Information Processing* (distinct from Embodied Computation) could be useful, especially for biological systems or systems where information flow is key but computation isn't physically embodied in the material structure itself. This could include metrics like information transfer rates, mutual information between components, etc. (Relevant given M5 was 'No' but information is clearly processed).
        *   A probe distinguishing between *individual* adaptation and *collective* adaptation might be helpful.
    *   **Unclear Definitions:**
        *   The distinction between "Adaptability/Learning-Based Cognizance" (Section II.B background) and "Adaptation" (Module M7) could be slightly clearer. M7 focuses on plasticity, while II.B links it more strongly to memory/feedback.
        *   "Embodied Computation" (M5.1) needs careful application for biological systems. Clarifying if it strictly refers to computation *by non-biological material properties* vs. computation *inherent in the system's physical dynamics* (even biological) might be needed depending on the corpus scope. The current analysis interpreted it as the former.
        *   The Yoneda Embedding probe (M4.7) is highly specific and likely requires CT expertise beyond typical experimental papers. Its purpose and expected input could be elaborated, or it might be relegated to a more specialized sub-template. Its application to this paper was not feasible.
    *   **Unclear Node/Edge Representations:**
        *   Guidance on mapping *dependencies* (e.g., interaction rules depending on risk state/memory) could be more explicit (e.g., using edge attributes vs. intermediate nodes).
        *   Representing *emergent* relationships (local rules -> global order) could have more specific edge type suggestions beyond a generic 'EmergenceEdge'.
    *   **Scoring Difficulties:**
        *   Scoring Cognitive Proximity (M9.2/M9.3) is inherently subjective when applying a scale designed for general intelligence to specific biological systems studied for particular behaviors. Providing clearer anchors or examples for each score level, specifically in the context of *material* or *collective* systems, would help consistency.
        *   Scoring N/A parameters in the overall CT-GIN score (M13.1) defaults to 0, which might unduly penalize papers not focused on certain aspects (like energy). A different weighting or handling method might be considered.
    *   **Data Extraction/Output Mapping:**
        *   Extracting specific numeric parameter values for interaction rules (M4.2.1, M4.5) often required estimating from graphs, which introduces imprecision. The template handles this via reliability/justification, which is good.
        *   Mapping biological concepts (habituation, risk perception) to the template's categories (Memory, Cognition) requires careful interpretation, as noted.
    *   **Overall Usability:** The template is extremely detailed and comprehensive, which is valuable for structured analysis. However, its length and the specificity of some probes (like Yoneda) make it time-consuming. For biological systems, some sections (Embodied Computation, certain Cognitive aspects) require careful framing to avoid misapplication. The conditional logic (skipping sections) is helpful.
    * **Specific Suggestions:**
        *   Consider adding optional sub-modules specifically for biological systems analysis within this framework, clarifying how concepts like memory, computation, and adaptation map differently than in synthetic materials.
        *   Refine the guidance/rubric for cognitive scoring (M9) with examples relevant to collective/material systems.
        *   Re-evaluate the calculation method for the overall CT-GIN score (M13.1) regarding N/A values.
        *   Provide more explicit examples for CT-GIN mappings, especially for complex relationships like dependencies and emergence.
        *   Maybe slightly reduce the number of optional parameters in M3 (Memory) unless analyzing papers specifically focused on memory devices.