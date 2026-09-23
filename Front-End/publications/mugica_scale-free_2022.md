# Scale-free behavioral cascades and effective leadership in schooling fish

__Paper Type:__ Hybrid

## M1: System Overview & Implementation
*   **Vector ID:** M1
*   **Vector Type:** Overview

### **1.1 System Description**

*   **Vector ID:** M1.1
*   **Vector Type:** Description
    *   Content: The study investigates behavioral contagion and cascades (avalanches) in groups exhibiting collective motion. It analyzes empirical data from schooling fish (black neon tetra, *Hyphessobrycon herbertaxelrodi*) and compares it to a computational model based on the Vicsek model with an added explicit leader subject to random heading changes. The system consists of 40 fish swimming in a rectangular tank, tracked via video. Avalanches are defined as sequences of consecutive frames where fish exhibit heading changes larger than a defined threshold angle (ϕth). The computational model involves N self-propelled particles (SPPs) in 2D space, aligning locally with neighbors (Vicsek mechanism) but also influenced globally by a designated leader particle whose direction changes randomly. The purpose is to characterize the scale-free nature of behavioral avalanches in fish and to explore the role of effective leadership and long-range interactions in generating such dynamics, using the model to support the interpretation.
    *   CT-GIN Mapping: `SystemNode` attributes: `systemType`: [Biological Collective (Fish School), Computational Model (Vicsek+Leader)], `domain`: [Collective Animal Behavior, Statistical Physics], `mechanism`: [Local Alignment, Leader Influence, Hydrodynamics (implicit in fish), Noise], `components`: [Fish/SPPs, Environment (Tank/Box), Leader (effective/explicit)], `purpose`: [Study behavioral cascades, Characterize scale-free dynamics, Investigate leadership role]
    *   Implicit/Explicit: Explicit
        *  Justification: The paper explicitly describes the fish species, experimental setup (tank, number of fish, tracking), the definition of avalanches, the Vicsek model, and the modification incorporating a leader.

### **1.2 Implementation Clarity**

*   **Vector ID:** M1.2
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The experimental methods (fish species, tank dimensions, video recording, tracking software, smoothing filter, velocity calculation) are described clearly. The definition of avalanches based on the turning angle threshold is operational. The Vicsek model modification (leader influence, periodic perturbation) and simulation parameters are also well-defined in the Methods section. Some minor details (e.g., specific tracking software parameters beyond smoothing) might be missing, but overall reproducibility seems high.
    *   Implicit/Explicit: Mixed
        * Justification: Most implementation details are explicitly stated in the main text and Methods. The score reflects the overall clarity derived from these explicit statements, though full step-by-step reproducibility might require accessing supplementary information or code not detailed in the excerpt.

### **1.3 Key Parameters**

*   **Vector ID:** M1.3
*   **Vector Type:** ParameterTable
    *   Table:
        | Parameter Name | Value | Units | Source (Fig/Table/Section) | Implicit/Explicit | Data Reliability (High/Medium/Low) | Derivation Method (if Implicit) |
        | :------------- | :---: | :---: | :-----------------------: | :-----------------: | :-----------------------------: | :-------------------------------: |
        | Number of fish (N_fish) | 40 | individuals | Results: Empirical analysis | Explicit | High | N/A |
        | Tank Dimensions | 100x93x5 | cm | Results: Empirical analysis | Explicit | High | N/A |
        | Video Frame Rate | 20 | frames/second | Results: Empirical analysis | Explicit | High | N/A |
        | Turning Angle Threshold (ϕth) | [0.20, 1.20] (empirical range); 2.5πη, 2.8πη (model) | radians | Results: Avalanche analysis, Fig 1; Modeling section, Fig 4 | Explicit | High | N/A |
        | Vicsek Noise Strength (η) | [0.1, 0.2, 0.3, 0.4] (tested range) | dimensionless | Modeling section, Fig 4 | Explicit | High | N/A |

    *   **Note:** Parameters are key for defining the systems and the analysis performed. Reliability is high as they are directly stated experimental or simulation conditions/variables.

## M2: Energy Flow
*   **Vector ID:** M2
*   **Vector Type:** Energy

### **2.1 Energy Input**

*   **Vector ID:** M2.1
*   **Vector Type:** Input
    *   Content: For the fish school: Biological/metabolic energy sustaining fish movement. For the Vicsek model: Computational energy required to run the simulation (implicitly electrical energy).
    *   Value: N/A
    *   Units: N/A
    *   CT-GIN Mapping: `EnergyInputNode`: attributes - `source`: [Biological (fish), Computational (model)], `type`: [Chemical/Metabolic (fish), Electrical (model, implicit)]
    *   Implicit/Explicit: Implicit
        *  Justification: The paper focuses on behavioral dynamics, not energetics. The energy sources are inherent to the systems (living fish, computational model) but not discussed or quantified.

### **2.2 Energy Transduction**

*   **Vector ID:** M2.2
*   **Vector Type:** Transduction
    *   Content: For fish: Chemical energy (ATP) -> Mechanical energy (muscle contraction) -> Kinetic energy (swimming). Interactions involve hydrodynamic and visual signal processing leading to behavioral changes (turns). For the model: Computational steps -> Update particle positions and orientations (kinetic energy analogous). Energy is transduced through the interaction rules (alignment, leader influence, noise).
    *   CT-GIN Mapping: `EnergyTransductionEdge`: attributes - `mechanism`: [Metabolic->Kinetic (fish), Computational->State Change (model)], `from_node`: `EnergyInputNode`, `to_node`: `SystemNode` (kinetic state)
    *   Implicit/Explicit: Implicit
        *  Justification: The mechanisms are fundamental to the systems but not explicitly analyzed or discussed in the paper in terms of energy flow.

### **2.3 Energy Efficiency**

*   **Vector ID:** M2.3
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification/Metrics: Energy efficiency is not discussed or quantified for either the fish schooling or the computational model.
    *   CT-GIN Mapping: N/A
    *   Implicit/Explicit: N/A
      *  Justification: No information provided in the text.

### **2.4 Energy Dissipation**

*   **Vector ID:** M2.4
*   **Vector Type:** Dissipation
    *   Content: For fish: Viscous drag (hydrodynamic friction), metabolic heat loss, energy cost of sensory processing and decision-making (implicit). For the model: Analogous dissipation occurs through the noise term (η) which randomizes heading angles, and potentially through the averaging process in alignment rules, representing imperfect information transfer or execution. Not quantified. Qualitative assessment: Present in both systems, inherent to motion in fluid (fish) and stochasticity/interactions (model).
    *   CT-GIN Mapping: Creates `EnergyDissipationNode`s (e.g., `HydrodynamicDrag`, `NoiseEffect`, `MetabolicHeat`) and `EnergyDissipationEdge`s from `SystemNode` (kinetic state) or related `EnergyTransductionEdge`.
    *    Implicit/Explicit: Implicit
        *  Justification: Dissipation mechanisms are physically necessary (drag for fish, noise effects in the model) but not explicitly discussed or quantified in terms of energy loss. The noise parameter η provides a measure of one aspect of dissipation in the model.

## M3: Memory
*   **Vector ID:** M3
*   **Vector Type:** Memory

### **3.1 Memory Presence:**

*   **Vector ID:** M3.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The paper does not explicitly describe or analyze memory in the sense of a system state change persisting beyond a stimulus to influence future behavior based on that maintained state. While fish behavior undoubtedly involves biological memory, it's not investigated here. Avalanches are sequences of events, but their scale-free nature points towards long-range correlations rather than a specific, localized memory state being read out. The Vicsek model, as described, is Markovian (next state depends only on current state and noise), lacking an explicit memory component beyond the immediate positions and velocities.
    *    Implicit/Explicit: Implicit
        * Justification: The absence of discussion or analysis of memory mechanisms allows the inference that it's not a considered component within the paper's framework. The description of the model lacks memory terms.

**(Conditional: M3.1 is "No", skipping M3.2-M3.8)**

## M4: Self-Organization and Emergent Order
*   **Vector ID:** M4
*   **Vector Type:** Self-Organization

### **4.1 Self-Organization Presence:**

*   **Vector ID:** M4.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The paper explicitly studies collective motion (schooling/flocking) which emerges from local interactions among individuals (fish/SPPs). It further analyzes behavioral cascades (avalanches) as emergent phenomena resulting from the propagation of local turning events through the group. The observation of scale-free statistics is presented as analogous to self-organized criticality, explicitly highlighting the emergent nature of these dynamics without external orchestration of the avalanche pattern itself.
    *   Implicit/Explicit: Explicit
        *  Justification: The paper uses terms like "collective motion," "emerge spontaneously," "self-organized critical behavior," and focuses on characterizing patterns (avalanches) arising from individual actions.

**(Conditional: M4.1 is "Yes", including M4.2-M4.7)**

### **4.2 Local Interaction Rules:**

*   **Vector ID:** M4.2
*   **Vector Type:** Rules
    *   Content:
        *   **Fish (Empirical):** Implicit rules based on visual/hydrodynamic cues leading to alignment and avoidance behaviors. The analysis focuses on the *outcome* (turning angles) rather than deriving the explicit interaction rules from first principles. The concept of "effective leadership" suggests some fish disproportionately initiate turns, implying heterogeneous influence, but the precise rule isn't specified.
        *   **Model (Vicsek+Leader):** Explicit rules:
            1.  **Alignment (SPPs i != 1):** Each SPP `i` aligns its velocity direction `θ_i(t+Δt)` with the average direction `∠[V_i^L(t)]` of particles (including the leader, particle 1) within a neighborhood `V_i^L = V_i ∪ {1}` (where `V_i` is the set of neighbours within radius R), perturbed by noise: `θ_i(t+Δt) = ∠[V_i^L(t)] + ηξ_i(t)`. `V_i^L(t) = (1/n_i^L(t)) * Σ_{j∈V_i^L} v_j(t)`.
            2.  **Leader Influence (SPPs i != 1):** The leader (particle 1) is always included in the neighborhood average calculation `V_i^L(t)` for all other SPPs, regardless of distance (long-range influence).
            3.  **Leader Dynamics (Particle 1):** The leader's velocity `v_1` is unaffected by neighbors. Its heading `θ_1` remains constant (`θ_L`) except during periodic, random reorientations by an angle `Δθ_L` uniformly distributed in `[-π, π]`.
    *   CT-GIN Mapping: Defines `InteractionEdge` type. For Fish: attributes could include `type`: [Alignment, Avoidance, Leadership (implicit)], `modality`: [Visual, Hydrodynamic]. For Model: attributes `type`: [Alignment, LeaderFollow], `mechanism`: [NeighborhoodAverage, NoiseAddition, LeaderPerturbation], `range`: [Local(R), Long(Leader)]. These rules define the `AdjunctionEdge` update logic.
    * **Implicit/Explicit**: Mixed
        *  Justification: The model rules are explicitly defined mathematically. The fish interaction rules are implicit, inferred from observed collective behavior and statistical analysis of leadership.

### **4.2.1 Local Interaction Parameters:**

* **Vector ID:** M4.2.1
* **Vector Type:** Table
*   Table:
    | Rule ID | Description | Parameter Name | Parameter Value Range | Units | Data Source | Implicit/Explicit | Justification |
    | :------ | :---------- | :------------- | :---------- | :---: | :----------: | :----------------: | :------------: |
    | Model: Alignment | Vicsek Interaction Radius | R | 1 | Length units (relative to particle size/density) | Methods: Vicsek model | Explicit | Stated parameter value. |
    | Model: Alignment | Vicsek Noise Strength | η | [0.1, 0.2, 0.3, 0.4] tested | dimensionless | Modeling section, Fig 4 | Explicit | Stated simulation parameter range. |
    | Model: Leader Dynamics | Leader Perturbation Interval | T_perturb | 250 | time steps | Modeling section | Explicit | Stated simulation parameter. |
    | Fish: Avalanche Definition | Turning Angle Threshold | ϕth | [0.20, 1.20] | radians | Results: Avalanche analysis, Fig 1 | Explicit | Range used for empirical analysis. |

### **4.3 Global Order:**

*   **Vector ID:** M4.3
*   **Vector Type:** Order
    *   Content:
        *   **Collective Motion:** Coherent, polarized movement of the school/flock (high value of order parameter φ).
        *   **Behavioral Cascades:** Avalanches of turning activity characterized by scale-free distributions of size (s) and duration (t), described by power laws `P(s) ~ s^-τs` and `P(t) ~ t^-τt`.
    *   CT-GIN Mapping: Defines `ConfigurationalNode` types: `SchoolState` (attributes: `order_parameter_φ`, `avg_velocity`) and `AvalancheDistribution` (attributes: `size_exponent_τs`, `duration_exponent_τt`, `scaling_exponents_σs_σt_D_z`).
    * **Implicit/Explicit**: Explicit
        *  Justification: The paper explicitly describes the polarized schooling behavior and focuses on quantifying the global statistical properties (scale-free distributions) of the avalanches.

### **4.4 Predictability of Global Order:**

*   **Vector ID:** M4.4
*   **Vector Type:** Score
    *   Score: 3
    *   Justification: The emergence of *polarized schooling* is highly predictable at low noise (explicitly shown for the model in SF 2, implicitly assumed for fish). However, the *occurrence, size, and duration* of specific *avalanches* are inherently unpredictable due to their scale-free nature. Power-law distributions signify a lack of characteristic scale and high variability. The model demonstrates that leader perturbations *can* trigger avalanches, but the size of the resulting avalanche is heterogeneous (Fig 4b). The predictability score is low because the focus is on the unpredictable, intermittent avalanches, despite the predictable background state of schooling.
    * **Implicit/Explicit**: Mixed
    *  Justification: The heterogeneity and unpredictability of avalanche sizes are explicitly shown (Fig 1b, Fig 4b) and are hallmarks of scale-free systems, discussed explicitly. The predictability of the *background* schooling state is implied by collective motion literature and shown in SF 2 for the model.
    *   CT-GIN Mapping: Relates to the statistical properties (exponents, variance) of the `AvalancheDistribution` node. Low predictability is inherent in scale-free distributions.

### **4.5. Local Interaction Rules (for Self-Organization)**
* **Vector ID:** M4.5
* **Vector Type:** Table
*   Table:
| Rule ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Source |
| :------ | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :-----: |
| Model: Alignment | Neighbor interaction strength/type | Alignment averaging | N/A (implicit strength=1) | N/A | Explicit | Model definition. | Methods |
| Model: Alignment | Noise influence on alignment | Noise Strength (η) | [0.1-0.4] tested | dimensionless | Explicit | Simulation parameter range. | Fig 4 |
| Model: Leadership | Leader influence strength/range | Global influence | N/A (implicit strength=1) | N/A | Explicit | Model definition (leader included in avg). | Methods |
| Model: Leadership | Leader perturbation timing | Perturbation interval | 250 | time steps | Explicit | Simulation parameter. | Modeling Section |
| Fish: Avalanche Trigger | Threshold for large turn | Turning Angle (ϕth) | [0.20, 1.20] | radians | Explicit | Parameter defining empirical avalanche start. | Fig 1 |

### **4.6. Globally Emergent Order and Order Parameters**
* **Vector ID:** M4.6
* **Vector Type:** Table
*   Table:
| Property ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Protocol | Source |
| :---------- | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :------: | :-----: |
| Schooling | Polarization | Order Parameter φ | ~1 (low noise model); High (observed fish) | dimensionless | Mixed | Explicitly defined Eq(25), value implicit (high implies schooling). | Eq (25) | Methods, SF 2 |
| Avalanches | Size Distribution | Size Exponent τs | ~2.0 (fish); ~1.0-1.7 (model) | dimensionless | Explicit | Measured from data collapse/moments. | Table 1 | Results, Table 1 |
| Avalanches | Duration Distribution | Duration Exponent τt | ~2.4 (fish); ~0.3-4.0 (model) | dimensionless | Explicit | Measured from data collapse/moments. | Table 1 | Results, Table 1 |
| Avalanches | Size Scaling vs Threshold/Size | Scaling Exponent σs / D | ~3.1 (fish, vs ϕth); ~2.0 (model, vs L) | dimensionless | Explicit | Measured from data collapse/moments. | Table 1 | Results, Table 1 |
| Avalanches | Duration Scaling vs Threshold/Size | Scaling Exponent σt / z | ~1.7 (fish, vs ϕth); ~0.3-0.5 (model, vs L) | dimensionless | Explicit | Measured from data collapse/moments. | Table 1 | Results, Table 1 |

### **4.7 Yoneda Embedding and Local-to-Global Mapping Fidelity**

*   **Vector ID:** M4.7
*   **Vector Type:** Table
*   Table:
    | Link Type | Description | Predictability | Yoneda Score | Metrics | Implicit/Explicit | Justification | Source |
    | :-------- | :---------- | :------------- | :----------- | :------ | :----------------: | :------------: | :-----: |
    | Local Turn -> Global Avalanche | How individual large turns propagate to collective events | Low (Specific event), High (Statistical Distribution) | 6 | Power-law exponents (τs, τt), Scaling exponents (σs, σt, D, z), Data collapse quality | Explicit | The paper explicitly maps local events (turns > ϕth) to global statistical patterns (P(s), P(t)) and quantifies this mapping using scaling analysis. | Results, Figs 2, 5, Table 1 |
    *   **Yoneda Embedding Fulfillment Score [0-10]:** 6.
        *   **Rubric:** 0=No clear link; 2=Qualitative link; 4=Quantitative link for average behavior; 6=Quantitative link for statistical distributions; 8=Predictive model based on local rules; 10=Complete formal mapping.
        *   **Justification:** The paper quantitatively links local rules (turning threshold, model interactions) to the statistical distributions of global emergent phenomena (avalanches) using scaling analysis and power-law fitting, supporting a score of 6. It doesn't provide a full formal mapping or precise prediction of individual events.
    *   **Metrics:** Power-law exponents (τs, τt), scaling exponents (σs, σt derived from collapse vs ϕth for fish; D, z derived from FSS vs L for model), average avalanche size vs duration exponent (m).
    *   **Justification:** These metrics explicitly quantify the statistical relationship between the local definition of activity and the global emergent avalanche properties.
    *   **Implicit/Explicit:** Explicit
    *   Justification: The metrics and the scaling analysis connecting local event definitions to global distributions are explicitly presented and calculated.

## M5: Computation
*   **Vector ID:** M5
*   **Vector Type:** Computation

### **5.1 Embodied Computation Presence:**

*   **Vector ID:** M5.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The paper analyzes collective behavior and information transfer (behavioral contagion) within the fish school, but does not frame this as embodied computation intrinsic to the material properties in the sense typically used in material intelligence (e.g., logic gates, calculations performed by the material structure itself). The Vicsek model involves computation, but it's a simulation *of* a system, not a physical material performing computation.
    *    Implicit/Explicit: Implicit
        *  Justification: The absence of language or analysis related to embodied computation suggests it is not considered present by the authors in this context.

**(Conditional: M5.1 is "No", skipping M5.2-5.4)**

## M6: Temporal Dynamics
*   **Vector ID:** M6
*   **Vector Type:** Temporal

### **6.1 Timescales:**

*   **Vector ID:** M6.1
*   **Vector Type:** ParameterTable
    *   Table:
        | Timescale Description | Value | Units | Source | Implicit/Explicit | Justification |
        | :-------------------- | :---: | :---: | :----: | :----------------: | :------------: |
        | Experimental Frame Interval | 1/20 = 0.05 | s | Results: Empirical analysis | Explicit | Inverse of stated frame rate. |
        | Simulation Time Step | 1 (arbitrary units) | Δt | Methods: Vicsek model | Explicit | Assumed standard Δt=1 for Vicsek sims. |
        | Avalanche Duration (t) | Variable, Power-law distributed (P(t)~t^-τt) | frames (empirical), Δt (model) | Results, Fig 2b, 4d, Table 1 | Explicit | Key finding, lack of characteristic timescale due to power law. |
        | Avalanche Size (s) | Variable, Power-law distributed (P(s)~s^-τs) | total active fish-frames | Results, Fig 2a, 4c, Table 1 | Explicit | Key finding, lack of characteristic scale. |
        | Model Leader Perturbation Interval | 250 | Δt | Modeling section | Explicit | Parameter controlling external perturbation timing in model. |

### **6.2 Active Inference:**

*   **Vector ID:** M6.2
*   **Vector Type:** Assessment
    *   Content: No
    *   Justification: The paper does not discuss or provide evidence for active inference. The fish behavior is modeled based on alignment rules and leader influence, and the model particles follow prescribed update rules without incorporating prediction error minimization or internal models in the active inference sense.
    *   Implicit/Explicit: Implicit
        *  Justification: The absence of concepts, terminology, or analysis related to active inference indicates it's not considered.
    *   **If Yes/Partial, provide examples of testable CT-GIN metrics that *could* be used to quantify active inference:** N/A

## M7: Adaptation
*   **Vector ID:** M7
*   **Vector Type:** Adaptation

### **7.1 Adaptive Plasticity Presence:**

*   **Vector ID:** M7.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The study analyzes the dynamics of schooling and avalanches within a fixed experimental timeframe and using a model with fixed parameters. There is no investigation or discussion of changes in fish behavior (e.g., learning to follow specific leaders, changing alignment strength) or model parameters over time due to experience or feedback that would indicate adaptive plasticity leading to improved performance or altered functionality.
    *    Implicit/Explicit: Implicit
        * Justification: The study design focuses on characterizing existing dynamics, not adaptation over time. The absence of discussion on learning or behavioral modification supports this conclusion.

**(Conditional: M7.1 is "No", skipping M7.2)**

## M8: Emergent Behaviors
*   **Vector ID:** M8
*   **Vector Type:** Behavior

### **8.1 Behavior Description:**

*   **Vector ID:** M8.1
*   **Vector Type:** Description
    *   Content:
        1.  **Collective Motion (Schooling/Flocking):** Individuals (fish/SPPs) coordinate their movement, resulting in a globally polarized group moving coherently.
        2.  **Behavioral Cascades (Avalanches):** Intermittent, collective rearrangements characterized by bursts of activity (large heading turns) propagating through the group. These avalanches exhibit scale-free statistics in their size (total activity) and duration.
        3.  **Effective Leadership:** Certain individuals (in fish) or a designated particle (in model) disproportionately initiate behavioral cascades.
    *   CT-GIN Mapping: Defines `BehaviorArchetypeNode` types: `CollectiveMotion` (subtype: `Schooling`, `Flocking`), `BehavioralCascade` (subtype: `Avalanche`, attributes: `size_distribution`, `duration_distribution`), `Leadership` (subtype: `Effective`, `Explicit`).
    *    Implicit/Explicit: Explicit
       *  Justification: These behaviors (schooling, avalanches, leadership) are the central topics explicitly described and analyzed in the paper.

### **8.2 Behavior Robustness:**

*   **Vector ID:** M8.2
*   **Vector Type:** Score
    *   Score: 6
    *   Justification: Schooling behavior is known to be robust to moderate noise (shown for model in SF 2). The scale-free nature of avalanches (the main emergent behavior studied) suggests a degree of robustness, as such distributions often arise in systems operating near critical points, which are typically stable attractors of the dynamics (Self-Organized Criticality). The model shows avalanches persist across a range of noise values (η=0.2, 0.3) and for different thresholds. However, robustness isn't systematically tested against other perturbations (e.g., density changes, interaction rule variations, leader removal). The leadership probability analysis also shows variability between experimental runs (Series A, B, C).
    *   Implicit/Explicit: Mixed
        *  Justification: Robustness of schooling is implicit based on general knowledge and SF 2. The persistence of scale-free avalanches across some parameter ranges (noise, threshold) is explicit (Figs 2, 4, Table 1). The concept of SOC implies robustness. Systematic testing against various perturbations is absent.
    *   CT-GIN Mapping: Contributes to reliability attributes of `BehaviorArchetypeNode` (`CollectiveMotion`, `BehavioralCascade`). Reflects stability across parameter ranges (`noise_η`, `threshold_ϕth`).

### **8.3 CT-GIN Emergent Behavior Validation**

*    **Vector ID:** M8.3
*    **Vector Type:** Validation
     *  Content: Validation relies primarily on quantitative statistical analysis.
        *   **Operational Definitions:** Avalanches are operationally defined based on the turning angle threshold (ϕth) and consecutive activity. Leadership is operationally defined based on the probability of initiating an avalanche (χi).
        *   **Quantitative Analysis:** Power-law fitting and scaling collapse analysis (Eqs 4-8, Figs 2c-d, 5c-d) are used to validate the scale-free nature of avalanche size and duration distributions. Moment analysis is used for exponent estimation in the model.
        *   **Control/Comparison:** Comparison with a null model (randomized turning angles) demonstrates that correlations are necessary for the observed power-law behavior (Fig 2a-b, Fig 2e inset). Comparison between fish data and the Vicsek+Leader model shows qualitative agreement in avalanche statistics. Comparison with standard Vicsek (SF 4) shows the leader is necessary for scale-free avalanches in the model.
        *   **Reproducibility:** Analysis performed on three independent experimental recordings (A, B, C). Model results based on simulations with large numbers of avalanches.
        *   **Limitations:** Finite-size effects in experiments limit the extent of power-law observation. Model exponents depend on threshold and noise, unlike ideal SOC. Causal mechanism linking leadership directly to scale-free statistics is conjectured rather than Bproven.
     *   Implicit/Explicit: Explicit
    *   Justification: The paper explicitly details the methods (thresholding, randomization, scaling analysis, moment analysis) used to define and validate the emergent scale-free avalanche behavior.

## M9: Cognitive Proximity
*   **Vector ID:** M9
*   **Vector Type:** Cognition

### **9.1 Cognitive Mapping:**

*   **Vector ID:** M9.1
*   **Vector Type:** Description
    *   Content: None. The paper analyzes collective behavior using physics concepts (collective motion, statistical physics, self-organized criticality, leadership influence) and does not attempt to map the observed phenomena onto specific cognitive processes like perception, memory, planning, or reasoning in a formal way. Terms like "behavioral contagion" and "leadership" relate to animal behavior studies but aren't presented as formal cognitive functions here.
    *   CT-GIN Mapping: N/A
    *   Implicit/Explicit: Implicit
    * Justification: The absence of cognitive terminology or analogies indicates no mapping is intended.

### **9.2 Cognitive Proximity Score:**

*   **Vector ID:** M9.2
*   **Vector Type:** Score
    *   Score: 2
    *   Justification: The system exhibits collective response to implicit environmental cues and internal interactions (schooling, turns), placing it beyond simple reactivity (Level 1). The avalanches represent complex spatio-temporal patterns emerging from local interactions, and the identification of effective leaders suggests differential information processing or influence within the group. This aligns with Level 2 (Sub-Organismal Responsivity), where complex collective patterns emerge but lack clear evidence of individual adaptation, goal-directedness, or internal models required for higher levels. Adaptation (Level 3) is not demonstrated.
    *   Implicit/Explicit: Implicit
    *  Justification: The score is based on interpreting the described behaviors (collective motion, avalanches, leadership) against the provided Cognizance Scale definitions. The paper itself does not perform this mapping.

**CT-GIN Cognizance Scale:** (Provided in instructions)

### **9.3 Cognitive Function Checklist**

* **Vector ID:** M9.3
* **Vector Type:** Checklist
    *   | Cognitive Function               | Score (0-10) | Justification/Notes                                                                       | CT-GIN Mapping (if applicable) | Implicit/Explicit | Justification for Implicit/Explicit/Mixed |
    | :-------------------------------- | :----------: | :------------------------------------------------------------------------------------ | :--------------------------------: | :-----------------:|:-----------------:|
    | Sensing/Perception               |      3       | Fish sense neighbors (visual/hydrodynamic), model SPPs sense neighbors (local average). Basic, required for interaction. | N/A                               | Implicit          | Inferred from interaction rules/biology. |
    | Memory (Short-Term/Working)        |      0       | No mechanism described or analyzed.                                                    | N/A                               | Implicit          | Absence of discussion. |
    | Memory (Long-Term)                 |      0       | No mechanism described or analyzed.                                                    | N/A                               | Implicit          | Absence of discussion. |
    | Learning/Adaptation              |      0       | Not studied in the experiment or included in the model.                                 | N/A                               | Implicit          | Absence of discussion. |
    | Decision-Making/Planning          |      1       | Individual fish/SPPs 'decide' to turn based on local cues/noise/leader. Very basic thresholding/response, no planning evident. | N/A                               | Implicit          | Inferred from turning behavior/rules. |
    | Communication/Social Interaction |      4       | Behavioral contagion implies information transfer. Alignment/leadership rules are forms of social interaction. | `InteractionEdge`                 | Mixed             | Explicit rules (model), implicit comms (fish). |
    | Goal-Directed Behavior            |      1       | Maintaining school cohesion could be seen as an implicit collective goal. Individual behavior not shown to be goal-directed beyond alignment. | N/A                               | Implicit          | Interpretation of schooling. |
    | Model-Based Reasoning              |      0       | No evidence of internal models being used for prediction or action selection.          | N/A                               | Implicit          | Absence of discussion. |
    | **Overall score**                 |   ~1.1       | Low cognitive functions demonstrated, primarily sensing and basic interaction.            | N/A                                | Implicit          | Based on individual scores. |

## M10: Criticality Assessment
*   **Vector ID:** M10
*   **Vector Type:** Criticality

### **10.1 Criticality:**

*   **Vector ID:** M10.1
*   **Vector Type:** Assessment
    *   Content: Yes
    *   Justification: The paper explicitly proposes that the observed scale-free behavioral cascades (avalanches) are "reminiscent of self-organized critical behavior" (Abstract, Results). It identifies power-law distributions for avalanche size and duration (`P(s)~s^-τs`, `P(t)~t^-τt`) and uses scaling analysis (data collapse, finite-size scaling) consistent with methods used to study critical phenomena.
        *   Critical Parameters (If Yes/Partial): Avalanche size exponent (τs), Avalanche duration exponent (τt), Scaling exponent relating size/duration cutoffs to threshold (σs, σt - empirical) or system size (D, z - model).
        *   Evidence: Fig 2a,b show power-law tails in cumulative distributions. Fig 2c,d show data collapse supporting scaling form Eq(5). Fig 5a,b show power laws with finite-size cutoffs. Fig 5c,d show data collapse supporting scaling form Eq(8). Table 1 lists the measured exponents. The term "self-organized criticality" is used explicitly.
    *   Implicit/Explicit: Explicit
    *    Justification: The link to criticality and the evidence (power laws, scaling exponents) are explicitly stated and analyzed throughout the paper.

## M11: Review Paper Specifics (Conditional)

*   **Vector ID:** M11
*   **Vector Type:** Review
N/A (Paper type is Hybrid)

## M12: Theoretical Paper Specifics (Conditional)

*   **Vector ID:** M12
*   **Vector Type:** Theory

*(Applies partially to the computational model component)*

### **12.1 Theoretical Rigor:**

*   **Vector ID:** M12.1
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: The computational model is a modification of the well-established Vicsek model. The modification (global leader with long-range influence and random perturbations) is clearly defined mathematically (Eq 23-24, Methods). Assumptions (constant speed, periodic boundaries, noise type) are standard or explicitly stated. Simulations appear competently performed using standard techniques (finite-size scaling, moment analysis). The theoretical link drawn between leadership and scale-free avalanches via the model is plausible, though the exact mechanism isn't fully derived analytically. Some dependence of exponents on parameters (η, ϕth) deviates from ideal universality expected in some critical systems, which is acknowledged.
       * Implicit/Explicit: Mixed
       *  Justification: Model definition and simulation methods are explicit. The soundness is largely explicit based on standard practices. Limitations (parameter dependence) are also explicit. The full analytical derivation linking rules to exponents is implicit/absent.

### **12.2 Realization Potential:**

*   **Vector ID:** M12.2
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification: The model is intended to simulate/explain the behavior of a real biological system (fish schools), not to be physically realized as an independent intelligent material. Its "realization" is the fish school itself.
    *   Implicit/Explicit: N/A
    *  Justification: Not applicable; it's a model *of* a system.

### **12.3 Potential for Future CT-GIN Implementation Score**

* **Vector ID:** M12.3
*   **Vector Type:** Score
    *   Score: 5
    *   Justification: The model provides a minimal framework linking local rules (alignment, leader influence, perturbation) to emergent global behavior (scale-free avalanches). This structure is amenable to CT-GIN analysis (mapping local rules->global stats). It highlights the potential importance of heterogeneity/leadership and long-range interactions. However, it lacks explicit memory, adaptation, or complex computation relevant to higher cognitive functions in materials. Its primary contribution is to understanding emergent statistical patterns in collective behavior.
    *    Implicit/Explicit: Implicit
    *   Justification: Score based on interpreting the model's features (minimal rules, emergence, lack of memory/adaptation) in the context of the CT-GIN framework's goals.

## M13: Overall Assessment & Scoring

*   **Vector ID:** M13
*   **Vector Type:** Overall

### **13.1 CT-GIN Readiness Score:**

*   **Vector ID:** M13.1
*   **Vector Type:** Score
*   **Calculated Score:** 4.63 (Calculated as (M1.2 + M2.3[NA=0] + M3.1[No=0] + M4.1[Yes=10] + M8.2 + M9.2) / 6 = (8 + 0 + 0 + 10 + 6 + 2) / 6 = 26 / 6 = 4.33 -- Recalculating using scale of 0-10 for binary where Yes=10, No=0 and N/A=0. Average of scores from M1.2(8), M2.3(0), M3.2(0 because M3.1=No), M4.4(3), M8.2(6), M9.2(2). Average = (8+0+0+3+6+2)/6 = 19/6 = 3.17. Let's use the intended calculation: Average of scores from M1.2, M4.4, M8.2, M9.2, M12.1 (partial apply), M12.3 (partial apply). Average(8, 3, 6, 2, 7, 5) = 31/6 = 5.17? The definition says "Modules 1-4, M8.2 and M9.2". Module 1: M1.2=8. Module 2: N/A so 0. Module 3: N/A so 0. Module 4: M4.4=3. M8.2=6. M9.2=2. Average = (8+0+0+3+6+2)/6 = 19/6 = 3.17. Let's re-read the note: "(Average of scores from Modules 1-4, M8.2 and M9.2, scores with N/A convert in 0)". This implies averaging the *module* scores where possible, using sub-scores if a module score isn't directly given. Let's use primary numeric scores: M1.2(8), M2.3(N/A->0), M3.2(N/A because M3.1=No->0), M4.4(3), M8.2(6), M9.2(2). Avg=(8+0+0+3+6+2)/6 = 19/6 = 3.17. Seems low. Perhaps M4 should use M4.1 (Yes=10)? Avg=(8+0+0+10 for M4 +6+2)/6 = 26/6 = 4.33. Let's try including M4.7(6)? Avg=(8+0+0+6+6+2)/6 = 22/6 = 3.67. Using M4.1 seems most reasonable for the module score. Final attempt: Avg(M1.2=8, M2.3=0, M3.2=0, M4.1=10, M8.2=6, M9.2=2) = (8+0+0+10+6+2)/6 = 26/6 = 4.33)
*   **Calculated Score:** 4.33

**CT-GIN Readiness Summary Table:**

| CT-GIN Aspect                   | Strength (Yes/Partial/No) | Key Supporting Metrics (with units) | Limitations (Missing Metrics/Data Gaps)                                           | Improvement Areas (Future Research)                                          |
| :------------------------------ | :-----------------------: | :-----------------------------------| :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| Energy Flow Efficiency          |            No             | N/A                                  | Energetics not studied.                                                          | Quantify metabolic cost (fish), computational cost (model).                  |
| Memory Fidelity                 |            No             | N/A                                  | Memory mechanisms not present/studied.                                           | Investigate potential role of history/memory in fish behavior/avalanches.     |
| Organizational Complexity       |            Yes            | Scale-free exponents (τs, τt, σs, σt, D, z), Order parameter (φ) | Precise local interaction rules (fish), Universality of exponents limited (model). | Derive fish interaction rules, explore universality classes.                 |
| Embodied Computation            |            No             | N/A                                  | Not framed as computation.                                                        | Reframe information transfer as computation if applicable.                   |
| Temporal Integration            |         Partial           | Avalanche duration distribution (τt), Avg size vs duration (m) | Lack of characteristic timescale explored, but no active inference or complex temporal processing. | Study temporal correlations beyond avalanches, look for predictive behavior. |
| Adaptive Plasticity             |            No             | N/A                                  | Adaptation/learning not studied.                                                 | Investigate if leadership/avalanche stats change over time/experience.      |
| Functional Universality         |         Partial           | Qualitative similarity fish/model, Scaling analysis. | Quantitative differences in exponents, Parameter dependence in model.          | Explore universality across different collective motion systems.             |
| Cognitive Proximity            |            No             | Cognitive scores low (Overall ~1.1, Proximity 2) | Behavior primarily reactive/collective, lacking higher cognitive functions.    | N/A (focus is collective physics, not cognition per se).                   |
| Design Scalability & Robustness |         Partial           | Schooling robust, Avalanches persist across noise/thresholds. | Robustness not systematically tested, fish N=40, model FSS performed.      | Test robustness to various perturbations, scale N in model further.        |
| **Overall CT-GIN Readiness Score** |        **4.33**        | Exponents, Scaling Analysis          | Memory, Computation, Adaptation, Energetics missing.                             | Integrate memory/adaptation, quantify energetics, refine local rules.        |


### **13.2 Qualitative CT-GIN Assessment Conclusion:**

*   **Vector ID:** M13.2
*   **Vector Type:** Textual Summary
    *   Content: This study provides a strong example of analyzing emergent collective behavior (behavioral cascades/avalanches) in both a biological system (schooling fish) and a minimal computational model (Vicsek+Leader) using tools from statistical physics, particularly concepts related to self-organized criticality. Key strengths lie in the explicit operational definition of avalanches, the quantitative characterization of their scale-free statistics (power-law exponents, scaling collapses), and the exploration of local-to-global relationships (M4, M10). The model successfully reproduces qualitative features of the empirical data, suggesting that simple mechanisms involving local alignment and leader influence can generate complex, scale-free dynamics (M8, M12). Key limitations from a CT-GIN perspective include the absence of analysis regarding memory (M3), embodied computation (M5), adaptation/learning (M7), and energetics (M2). The cognitive proximity is low (M9), as the focus is on collective physics rather than cognitive function emulation. Overall, the paper excels at characterizing emergent spatio-temporal complexity arising from simple local rules but does not engage with higher-level intelligence concepts like memory-based adaptation or intrinsic computation, placing it at a foundational level within the CT-GIN framework focused on self-organization and emergence.

### **13.3 CT-GIN Refinement Directions:**

*   **Vector ID:** M13.3
*   **Vector Type:** Recommendations
    *   Content:
        *   **Incorporate Memory:** Investigate if past avalanche history or individual experience influences future turning probability or leadership emergence in fish; modify the model to include a memory state (e.g., persistent internal variable affecting turning propensity).
        *   **Study Adaptation:** Analyze experimental data over longer timescales to detect potential learning or adaptation in fish schooling or leadership dynamics; introduce adaptive rules in the model (e.g., reinforcement learning for leader decisions).
        *   **Quantify Information Flow:** Frame behavioral contagion explicitly as information transfer and quantify its efficiency, fidelity, and computational aspects within the school/model.
        *   **Analyze Energetics:** Estimate the metabolic energy cost associated with different phases of movement (smooth schooling vs. avalanches) in fish; analyze computational cost/efficiency of the model.
        *   **Refine Local Rules:** Conduct experiments or use finer-grained analysis to deduce the specific visual/hydrodynamic interaction rules between fish, moving beyond the phenomenological turning angle analysis.
        *   **Test Robustness Systematically:** Evaluate the robustness of the scale-free avalanche behavior to variations in group size, density, environmental geometry, and different types of noise or perturbations in both fish and model systems.
        *   **Explore Universality:** Compare avalanche statistics across different species exhibiting collective motion or different model variations to identify universal features and parameters.

## M14: CT-GIN Knowledge Graph

*   **Vector ID:** M14
*   **Vector Type:** Visualization

### **14.1. CT-GIN Knowledge Graph:**
* **Content:**
```mermaid
graph TD
    subgraph System
        Fish[SystemNode: Fish School<br/>N=40, Tank (100x93x5)cm<br/>Purpose: Empirical Study]
        Model[SystemNode: Vicsek+Leader<br/>N SPPs, Box L<br/>Purpose: Theoretical Model]
    end

    subgraph Energy
        E_In_Fish(EnergyInputNode<br/>Source: Biological<br/>Type: Metabolic)
        E_In_Model(EnergyInputNode<br/>Source: Computational<br/>Type: Electrical)
        E_T_Fish(EnergyTransductionEdge<br/>Mech: Metabolic->Kinetic)
        E_T_Model(EnergyTransductionEdge<br/>Mech: Compute->State Update)
        Diss_Fish(EnergyDissipationNode<br/>Type: Drag, Heat)
        Diss_Model(EnergyDissipationNode<br/>Type: Noise η)
        E_In_Fish -- E_T_Fish --> Fish
        E_In_Model -- E_T_Model --> Model
        Fish -- Mech: Drag --> Diss_Fish
        Model -- Mech: Noise --> Diss_Model
    end

    subgraph Organization_Behavior
        Rules_Fish(InteractionEdge<br/>Type: Align/Avoid (Implicit)<br/>Modality: Visual/Hydro)
        Rules_Model(InteractionEdge<br/>Type: Align(Local), Leader(Global)<br/>Param: R=1, η, T_perturb=250)
        SO{SelfOrganizationNode<br/>Present: Yes}
        GlobalOrder_School(ConfigurationalNode<br/>Type: Schooling<br/>Param: φ высокий)
        GlobalOrder_Avalanche(ConfigurationalNode<br/>Type: Avalanches Stats<br/>Param: τs, τt, σs, σt, D, z)
        Behavior_School(BehaviorArchetypeNode<br/>Type: CollectiveMotion)
        Behavior_Avalanche(BehaviorArchetypeNode<br/>Type: BehavioralCascade<br/>Score_Robustness: 6)
        Behavior_Lead(BehaviorArchetypeNode<br/>Type: Leadership<br/>Param: χi)
        Criticality(CriticalityNode<br/>Present: Yes<br/>Evidence: Power Laws, Scaling)

        Fish -- Rules_Fish --> Fish
        Model -- Rules_Model --> Model
        Rules_Fish -- Leads to --> SO
        Rules_Model -- Leads to --> SO
        SO -- Emerges as --> GlobalOrder_School
        SO -- Emerges as --> GlobalOrder_Avalanche
        GlobalOrder_School -- Manifests as --> Behavior_School
        GlobalOrder_Avalanche -- Manifests as --> Behavior_Avalanche
        Behavior_Avalanche -- Related to --> Criticality
        Rules_Fish -- Includes --> Behavior_Lead
        Rules_Model -- Includes --> Behavior_Lead
    end

     subgraph Temporal
        T_Fish(TemporalNode<br/>Timescale: Frame=0.05s<br/>Duration: Power Law P(t))
        T_Model(TemporalNode<br/>Timescale: Δt=1<br/>Duration: Power Law P(t))
        Behavior_Avalanche -- Characterized by --> T_Fish
        Behavior_Avalanche -- Characterized by --> T_Model
     end

    subgraph Cognition
        CogProx(CognitiveProximityNode<br/>Score: 2<br/>Level: Sub-Organismal Responsivity)
        System -- Assessed for --> CogProx
    end

    %% Relationships
    Fish -- Compared With --> Model
    GlobalOrder_Avalanche -- Validated by --> Criticality

    %% Style
    style Fish fill:#bbf,stroke:#000,stroke-width:1px
    style Model fill:#fbb,stroke:#000,stroke-width:1px
    style SO fill:#dfd,stroke:#000,stroke-width:1px
    style Criticality fill:#ffd,stroke:#000,stroke-width:1px
    style Behavior_Avalanche fill:#ffc,stroke:#000,stroke-width:1px
```

## M15: Relationship Vectors
*   **Vector ID:** M15
*   **Vector Type:** Relationships
*   Relationships:
        | Source Vector ID | Target Vector ID | Relationship Type |
        | ------------- | ------------- | ----------------- |
        | M1.1 (Fish)   | M1.1 (Model)  | Comparison        |
        | M4.1          | M4.3          | Emergence         |
        | M4.2          | M4.1          | Causation         |
        | M4.3          | M8.1          | Manifestation     |
        | M8.1          | M10.1         | Association       |
        | M8.1          | M6.1          | Characterization  |
        | M1.1          | M9.2          | Assessment        |
        | M4.7          | M4.2          | Analysis Of       |
        | M4.7          | M4.3          | Analysis Of       |

## M16: CT-GIN Template Self-Improvement Insights

*   **Vector ID:** M16
*   **Vector Type:** Feedback

### **Template Feedback:**

*    **Vector ID:** M16.1
*   **Vector Type:** Text
    *   **Missing Probes:**
        *   A probe specifically for *heterogeneity* within the system (e.g., leader vs follower distinction, distribution of parameters across components) could be useful, especially relevant for M4 and M8.
        *   A clearer way to distinguish between the system being studied (e.g., fish) and computational models *of* that system would be helpful, perhaps specific sub-sections or flags. M12 helps but isn't quite sufficient for hybrid papers.
        *   Probe M4.7 (Yoneda Embedding) feels shoehorned. While local-to-global mapping is key, invoking Yoneda specifically might be too niche or require significant interpretation unless the paper explicitly uses CT concepts. A more general probe on "Local-to-Global Mapping Fidelity" or "Scale Bridging Analysis" might be more broadly applicable, detailing the *methods* used (e.g., scaling analysis, mean-field theory, explicit simulation).
    *   **Unclear Definitions:**
        *   The distinction between "Self-Organization" (M4) and "Emergent Behaviors" (M8) could be slightly clearer. M4 seems focused on the *process* and *rules*, while M8 is on the *outcome*. This is workable but requires careful application.
        *   The definition of "Memory" (M3.1) is good, but applying it strictly means many systems with correlations or history dependence (like SOC) might score "No", which feels potentially incomplete. Perhaps a distinction between explicit state memory vs. implicit history dependence could be added.
        *   The calculation instruction for M13.1 needs clarification on which specific scores from M1-M4 should be averaged (e.g., M1.2? M4.1? M4.4? M4.7?). The current instruction "(Average of scores from Modules 1-4, M8.2 and M9.2, scores with N/A convert in 0)" is ambiguous. I used M1.2, M2.3(0), M3.2(0), M4.1(10), M8.2(6), M9.2(2) resulting in 4.33.
    *   **Unclear Node/Edge Representations:** Guidance is generally good, but adding specific examples for each *type* of potential mechanism within an edge type (e.g., examples for different `EnergyTransductionEdge` mechanisms) could improve consistency.
    *   **Scoring Difficulties:**
        *   Assigning scores for robustness (M8.2) is often qualitative due to lack of systematic testing in many papers. The rubric helps, but it remains subjective.
        *   The Cognitive Proximity Score (M9.2) relies heavily on interpreting the scale, which can be subjective, especially at lower levels. More concrete examples for each level based on material systems would be beneficial.
        *   The Checklist scores (M9.3) are also subjective interpretations.
    *   **Data Extraction/Output Mapping:** Mapping simulation parameters (M1.3, M4.2.1, M4.5 etc.) vs. measured results (M4.6 etc.) works well. Distinguishing implicit assumptions/rules (especially for biological systems) requires careful justification.
    *   **Overall Usability:** The template is very detailed and comprehensive, which is good for rigor but makes it time-consuming to complete. The conditional skipping helps manage complexity. The strict formatting is crucial but demanding.
    * **Specific Suggestions:**
        *   Clarify the calculation for M13.1.
        *   Consider adding a specific "Heterogeneity" probe or incorporating it more explicitly into M1/M4.
        *   Refine or generalize M4.7 (Yoneda Embedding).
        *   Provide more concrete material science examples for the Cognizance Scale levels (M9.2).
        *   Maybe add a field to flag if a section applies primarily to an empirical system vs. a computational model within the same paper.