# Selective social interactions and speed-induced leadership in schooling fish

__Paper Type:__ Hybrid

## M1: System Overview & Implementation
*   **Vector ID:** M1
*   **Vector Type:** Overview

### **1.1 System Description**

*   **Vector ID:** M1.1
*   **Vector Type:** Description
    *   Content: The system studied is collective motion (schooling) in fish (black neon tetra, *Hyphessobrycon herbertaxelrodi*). The work investigates the social interaction rules governing this behavior, specifically alignment forces. It uses a combination of experimental data analysis (tracking N=39 and N=8 fish in a tank), agent-based modeling (standard model with attraction-repulsion, alignment, friction-propulsion, noise; explicit anti-alignment model; selective interactions model), and a "force map" technique to infer effective forces from acceleration patterns relative to neighbors' position and velocity. The purpose is to understand the mechanisms of movement coordination and emergent leadership in fish schools, proposing that fish selectively interact with (align to) faster neighbors and effectively anti-align with (ignore) slower ones, linking this to speed-based leader-follower dynamics. Components include individual fish agents, their positions, velocities, accelerations, social interaction forces (attraction, repulsion, alignment/anti-alignment), individual forces (friction, propulsion, noise), and the tank environment.
    *   CT-GIN Mapping: `SystemNode` attributes: `systemType`: Biological Collective Behavior, `domain`: Biophysics/Ethology, `mechanism`: Social Interactions (Force-based), `components`: [`FishAgentNode`, `EnvironmentNode`], `purpose`: Understand Coordination/Leadership in Schooling. `FishAgentNode` attributes: `position`, `velocity`, `acceleration`, `species`. `InteractionEdge` attributes: `type` (Attraction, Repulsion, Alignment, SelectiveAlignment), `neighborType` (Nearest, Voronoi), `relativeSpeed`, `relativePosition`.
    *   Implicit/Explicit: Mixed
        *  Justification: The overall system (fish schooling), methods (force maps, modeling), and purpose are explicitly stated. The specific components and their roles are explicitly described in the introduction and methods sections (e.g., fish species, tank, forces in the model). The link between selective interaction and leadership is a key explicit finding.

### **1.2 Implementation Clarity**

*   **Vector ID:** M1.2
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The paper clearly describes the experimental setup (fish species, number, tank size, recording details, tracking software), the force map methodology (binning acceleration based on relative position/velocity), and the agent-based models (equations for forces, parameters in Table I, interaction types). The validation steps using models and comparing observables are also well-explained. Some minor details about data processing (e.g., specific spline interpolation parameters beyond 'supervised way', exact warping details beyond 'proper square') might be implicit but the overall implementation is described with high clarity.
    *   Implicit/Explicit: Mixed
        * Justification: Most details are explicit in Methods and Results. The score reflects high overall clarity, with minor points potentially requiring inference or reference to supplementary info (mentioned but not provided in excerpt).

### **1.3 Key Parameters**

*   **Vector ID:** M1.3
*   **Vector Type:** ParameterTable
    *   Table:
        | Parameter Name | Value | Units | Source (Fig/Table/Section) | Implicit/Explicit | Data Reliability (High/Medium/Low) | Derivation Method (if Implicit) |
        | :------------- | :---: | :---: | :-----------------------: | :-----------------: | :-----------------------------: | :-------------------------------: |
        | Fish Number (Experiment 1) | 39 | individuals | Experimental data | Explicit | High | N/A |
        | Fish Number (Experiment 2) | 8 | individuals | Experimental data | Explicit | High | N/A |
        | Tank Side Length | 100 | cm | Experimental data | Explicit | High | N/A |
        | Frame Rate | 50 | fps (or Hz) | Experimental data | Explicit | High | N/A |
        | Standard Model: *d*<sub>0</sub> (Equilibrium distance) | 5.8 | cm | Table I (Methods) | Explicit | Medium | Selected to match experimental data (Fig 4b) |
        | Standard Model: *v*<sub>0</sub> (Preferred speed) | 11 | cm/s | Table I (Methods) | Explicit | Medium | Chosen from average experimental speeds (Supp. Fig S10a) |

    *   **Note:** Table I provides several model parameters. Only a subset is listed here as key examples characterizing both experiment and model implementation. Data reliability for model parameters is "Medium" as they are chosen/fitted rather than directly measured fundamental constants.

## M2: Energy Flow
*   **Vector ID:** M2
*   **Vector Type:** Energy

### **2.1 Energy Input**

*   **Vector ID:** M2.1
*   **Vector Type:** Input
    *   Content: N/A (The paper models behavior based on effective forces and information, not the underlying metabolic energy input from food).
    *   Value: N/A
    *   Units: N/A
    *   CT-GIN Mapping: N/A
    *   Implicit/Explicit: Implicit
        *  Justification: The paper focuses on biomechanics and social interactions, not the bioenergetics of the fish. Energy input (food) is implicit to the fish being alive and moving but not analyzed.

### **2.2 Energy Transduction**

*   **Vector ID:** M2.2
*   **Vector Type:** Transduction
    *   Content: N/A (Energy transduction from metabolic processes to kinetic energy of movement is fundamental to fish swimming but not analyzed or modeled in detail in the excerpt).
    *   CT-GIN Mapping: N/A
    *   Implicit/Explicit: Implicit
        *  Justification: The mechanisms of muscle contraction converting chemical energy to motion are outside the scope defined by the excerpt. The model uses a simplified friction-propulsion term (F_fric-prop), which abstracts this process.

### **2.3 Energy Efficiency**

*   **Vector ID:** M2.3
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification/Metrics: N/A (The paper does not discuss or quantify the energy efficiency of swimming or schooling).
    *   CT-GIN Mapping: N/A
    *   Implicit/Explicit: Implicit
      *  Justification: Energy efficiency is not mentioned or measured in the excerpt.

### **2.4 Energy Dissipation**

*   **Vector ID:** M2.4
*   **Vector Type:** Dissipation
    *   Content: The model includes a friction term (-v_i / τ) within F_fric-prop, which represents energy dissipation due to hydrodynamic drag. Noise terms (F_noise) also imply energy input/dissipation related to maintaining non-equilibrium movement. However, these are not quantified in terms of energy units or detailed physical mechanisms in the excerpt. Qualitative assessment: Medium (inherent to movement in a fluid).
    *   CT-GIN Mapping: `EnergyDissipationNode` attributes: `mechanism` (Hydrodynamic Drag, Active Fluctuations). `EnergyTransductionEdge` (from Kinetic to Thermal via Friction) might be implied.
    *    Implicit/Explicit: Mixed
        *  Justification: The friction term is explicit in the model description (Methods). Its interpretation as energy dissipation is implicit based on physics. Noise terms are explicit, their energetic interpretation is implicit. Quantification is absent.

## M3: Memory
*   **Vector ID:** M3
*   **Vector Type:** Memory

### **3.1 Memory Presence:**

*   **Vector ID:** M3.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The excerpt describes behavioral rules (interactions based on relative speed/position) and leader-follower dynamics inferred from correlations over time delays (τ). While these imply information persistence over short timescales (reaction times, correlation windows), the paper does not describe or model a persistent change in the internal state of individual fish (like a material memory) that influences *future interaction rules* or long-term behavior beyond the immediate context of relative kinematics. The models presented use instantaneous state variables (position, velocity) to determine forces. Leadership is described as dynamically changing based on relative speeds, not stored internal states.
    *    Implicit/Explicit: Implicit
        * Justification: The absence of material-like memory mechanisms is inferred from the description of the models and analyses, which focus on instantaneous interactions and short-term correlations. The paper explicitly discusses leadership based on *instantaneous* relative speeds.

**(Conditional: M3.1 is "No", skip to Module 4.)**

### **3.2 Memory Type:**

*   **Vector ID:** M3.2
*   **Vector Type:** Score
*   Score: N/A
*   Justification: N/A
*   CT-GIN Mapping: N/A
*    Implicit/Explicit: N/A
    * Justification: N/A

### **3.3 Memory Retention Time:**

*   **Vector ID:** M3.3
*   **Vector Type:** Parameter
*   Value: N/A
*    Units: N/A
*   Justification: N/A
*    Implicit/Explicit: N/A
        * Justification: N/A
*   CT-GIN Mapping: N/A

### **3.4 Memory Capacity (Optional - if applicable)**

* **Vector ID:** M3.4
* **Vector Type:** Parameter
*  Value: N/A
*   Units: N/A
*   Justification: N/A
*    Implicit/Explicit: N/A
        *  Justification: N/A
*   CT-GIN Mapping: N/A

### **3.5 Readout Accuracy (Optional - if applicable)**

* **Vector ID:** M3.5
* **Vector Type:** Parameter
*   Value: N/A
*   Units: N/A
*   Justification: N/A
*    Implicit/Explicit: N/A
       *  Justification: N/A
*   CT-GIN Mapping: N/A

### **3.6 Degradation Rate (Optional - if applicable)**
* **Vector ID:** M3.6
* **Vector Type:** Parameter
    *   Value: N/A
    *   Units: N/A
    *   Justification: N/A
    *    Implicit/Explicit: N/A
            * Justification: N/A
    *   CT-GIN Mapping: N/A

### **3.7 Memory Operations Energy Cost (Optional - if applicable)**
* **Vector ID:** M3.7
* **Vector Type:** Table
*   Table:
    | Memory Operation ID | Energy Consumption per Bit | Power Usage during Operation| Units | Uncertainty | Data Source Reference | Implicit/Explicit | Justification |
    | :------------------ | :--------------------------: | :-----------------------------: | :---: |:-----------------:|:-----------------:|:-----------------:| :------------------ |
    |      N/A               |            N/A                |         N/A                        | N/A      |    N/A        |    N/A  |     N/A             |         N/A            |
*   Implicit/Explicit: N/A
    *   Justification: N/A

### **3.8 Memory Fidelity & Robustness Metrics (Optional - if applicable)**
* **Vector ID:** M3.8
* **Vector Type:** Table
*   Table:
    | Metric ID | Description | Value | Units | CT-GIN Mapping | Data Source | Implicit/Explicit | Justification |
    | :-------- | :---------- | :----: | :---: | :-------------: | :----------: |:-----------------:| :-----------------:|
    | N/A          | N/A            | N/A       | N/A      | N/A                | N/A             | N/A                | N/A      |
*   Implicit/Explicit: N/A
*   Justification: N/A
---

## M4: Self-Organization and Emergent Order
*   **Vector ID:** M4
*   **Vector Type:** Self-Organization

### **4.1 Self-Organization Presence:**

*   **Vector ID:** M4.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: Fish schooling is a classic example of self-organization. The paper explicitly states that "coherent collective motion emerges spontaneously from symmetrical interactions" (though it challenges symmetry) and describes how models based on local interactions (attraction, repulsion, alignment) reproduce global patterns like polarized movement and milling. The focus is on how local rules (standard model, selective interaction model) lead to emergent group-level structures and dynamics (schooling patterns, leader-follower relationships).
    *   Implicit/Explicit: Explicit
        *  Justification: The concept of collective behavior emerging from local interactions is central and explicitly discussed in the Introduction and Results.

**(Conditional: M4.1 is "Yes", include M4.2-M4.7)**

### **4.2 Local Interaction Rules:**

*   **Vector ID:** M4.2
*   **Vector Type:** Rules
    *   Content: The paper investigates several sets of local interaction rules:
        1.  **Standard Model:**
            *   Attraction/Repulsion (Eq. 1): `F_att-rep = -k(d_ij - d0) * (x_i - x_j) / d_ij`, where `k=k_rep` if `d_ij <= d0` and `k=k_att` if `d_ij > d0`. Acts towards/away from equilibrium distance `d0`.
            *   Alignment (Eq. 2): `F_alig = µ(v_j - v_i)`. Acts to equalize velocities.
            *   Interaction Scope: Averaged over Voronoi neighbors, weighted by inverse distance `w_ij = 1/d_ij`.
            *   Individual Forces: Friction/Propulsion `F_fric-prop = -(v_i - v0*v_hat_i) / τ` and Noise `F_noise = σ_v*ξ_v(t)*v_hat_i + σ_φ*ξ_φ(t)*φ_hat_i`.
        2.  **Explicit Anti-alignment Model:** Replaces standard alignment `F_alig` with a force interpolated from the experimental alignment force map (Fig 2b), which includes alignment with faster neighbors and anti-alignment with slower neighbors. Other forces remain the same.
        3.  **Selective Interactions Model:** Standard model rules apply, but social interactions (attraction, repulsion, alignment) are *only* considered with neighbors `j` moving faster than the focal individual `i` (`v_j > v_i`). Interactions with slower neighbors are ignored (effectively switched off). Weights `w_ij` recalculated considering only faster neighbors.
    *   CT-GIN Mapping: Interactions map to `SocialInteractionEdge` between `FishAgentNode`s. Attributes include `type` (AttractionRepulsion, Alignment, SelectiveAttention), `parameters` (k_att, k_rep, d0, µ, v0, τ, σ_v, σ_φ), `weight` (1/d_ij or modified), `condition` (Always On, FasterNeighborOnly). These edges define the local update rules for agent states (acceleration). The rules themselves can be represented as functions or computational graphs associated with the edges.
    * **Implicit/Explicit**: Explicit
        *  Justification: The interaction rules for all models are explicitly defined in the text, equations (Methods section), and figure captions (Fig 1, 3), including the conditions for the selective model.

### **4.2.1 Local Interaction Parameters:**

* **Vector ID:** M4.2.1
* **Vector Type:** Table
*   Table:
    | Rule ID | Description | Parameter Name | Parameter Value Range | Units | Data Source | Implicit/Explicit | Justification |
    | :------ | :---------- | :------------- | :---------- | :---: | :----------: | :----------------: | :------------: |
    | StdModel_AttRep | Attraction/Repulsion Force | k_rep | 12.5 | s<sup>-2</sup> | Table I | Explicit | N/A |
    | StdModel_AttRep | Attraction/Repulsion Force | k_att | 5 | s<sup>-2</sup> | Table I | Explicit | N/A |
    | StdModel_AttRep | Attraction/Repulsion Force | d0 | 5.8 | cm | Table I | Explicit | N/A |
    | StdModel_Align | Alignment Force | µ | 1.5 | s<sup>-1</sup> | Table I | Explicit | N/A |
    | StdModel_FricProp | Friction/Propulsion | v0 | 11 | cm/s | Table I | Explicit | N/A |
    | StdModel_FricProp | Friction/Propulsion | τ | 1.6 | s | Table I | Explicit | N/A |
    | StdModel_Noise | Noise (parallel) | σ_v | 6.4 | cm/s<sup>3/2</sup> | Table I | Explicit | N/A |
    | StdModel_Noise | Noise (perpendicular) | σ_φ | 2.6 | cm/s<sup>3/2</sup> | Table I | Explicit | N/A |
    | SelectiveModel | Selective Interaction Condition | N/A | v_neighbor > v_focal | N/A | Text (Results) | Explicit | N/A |

### **4.3 Global Order:**

*   **Vector ID:** M4.3
*   **Vector Type:** Order
    *   Content: The emergent global order described is fish schooling, characterized by collective polarization (individuals moving globally in the same direction) and group cohesion (maintaining proximity). Other patterns like milling (rotation around a core) are mentioned as possibilities in general models but not the focus for the studied species. The paper also studies emergent leader-follower structures based on relative speed.
    *   CT-GIN Mapping: Defines `ConfigurationalNode` representing the global state of the school. Attributes: `patternType` (Polarized, Milling, Swarming), `orderParameter` (Polarization ϕ), `cohesionMetric` (Average Nearest Neighbor Distance <d_NN>), `spatialExtent` (Convex Hull Area s). Leadership structure could be a `NetworkTopologyNode` derived from `InteractionEdges`.
    * **Implicit/Explicit**: Explicit
        *  Justification: Global patterns like polarized movement are explicitly mentioned in the Introduction and Discussion. Observables quantifying global order (ϕ, <d_NN>, s, t_V) are explicitly defined and analyzed in Fig 4. Leadership structures are explicitly investigated.

### **4.4 Predictability of Global Order:**

*   **Vector ID:** M4.4
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: The models presented (standard, selective interactions) are shown to reproduce qualitative features of schooling (Fig 1, 3, 4). The selective interactions model provides a better match to several experimental observables (Fig 4: polarization PDF, NN distance PDF, convex hull area PDF, Voronoi neighbor contact time PDF) compared to the standard model, suggesting a degree of predictability. However, perfect quantitative prediction is not claimed, and stochastic elements (noise) ensure behavior is not perfectly deterministic. The models capture statistical distributions rather than exact trajectories. Predictability is good for qualitative patterns and statistical properties, but likely lower for precise moment-to-moment configurations.
    * **Implicit/Explicit**: Mixed
    *  Justification: The ability of models to reproduce experimental observables (Fig 4) is explicit evidence for predictability. The score is an interpretation of how well the models capture the global order based on this comparison. The inherent stochasticity limiting perfect prediction is explicit (noise term) and implicit (biological variability).

### **4.5. Local Interaction Rules (for Self-Organization)**
* **Vector ID:** M4.5
* **Vector Type:** Table
*   Table:
| Rule ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Source |
| :------ | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :-----: |
| AttRep | Attraction/Repulsion | k_rep, k_att, d0 | See M4.2.1 | Various | Explicit | Defined in Methods/Table I | Eq.1, Table I |
| Align | Standard Alignment | µ | See M4.2.1 | s<sup>-1</sup> | Explicit | Defined in Methods/Table I | Eq.2, Table I |
| FricProp | Friction/Propulsion | v0, τ | See M4.2.1 | Various | Explicit | Defined in Methods/Table I | Methods, Table I |
| Noise | Active Fluctuations | σ_v, σ_φ | See M4.2.1 | cm/s<sup>3/2</sup> | Explicit | Defined in Methods/Table I | Methods, Table I |
| Select | Selective Interaction | condition | v_neighbor > v_focal | N/A | Explicit | Defined in Results | Results |
| AntiAlign | Explicit Anti-Alignment | force map interp. | N/A | N/A | Explicit | Defined in Results | Results, Fig 2b |

### **4.6. Globally Emergent Order and Order Parameters**
* **Vector ID:** M4.6
* **Vector Type:** Table
*   Table:
| Property ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Protocol | Source |
| :---------- | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :------: | :-----: |
| Polarization | Group alignment level | ϕ | [0, 1] | Dimensionless | Explicit | Defined in Results | Eq. in text | Fig 4a |
| Cohesion | Avg. proximity | <d_NN> | ~2-7 (peak ~3-4) | cm | Explicit | Defined in Results | Averaging NN distances | Fig 4b |
| Spatial Extent | Normalized group area | s | PDF shown | cm<sup>2</sup> | Explicit | Defined in Results | Convex hull area / N | Fig 4c |
| Neighbor Stability | Voronoi neighbor persistence | t_V | PDF shown | s | Explicit | Defined in Results | Contact duration time | Fig 4d |
| Leadership | Info flow direction (speed corr.) | Max Corr Time Delay τ | ~ -0.1 to +0.1 | s | Explicit | Defined in Results/Fig 6 | Pearson correlation | Fig 6 |
| Leadership | Info flow direction (orient. corr.) | Max Corr Time Delay τ | ~ -0.05 to +0.05 | s | Explicit | Defined in Results/Fig 6 | Dot product correlation | Fig 6 |

### **4.7 Yoneda Embedding and Local-to-Global Mapping Fidelity**

*   **Vector ID:** M4.7
*   **Vector Type:** Table
*   Table:
    | Link Type | Description | Predictability | Yoneda Score | Metrics | Implicit/Explicit | Justification | Source |
    | :-------- | :---------- | :------------- | :----------- | :------ | :----------------: | :------------: | :-----: |
    | Local Rules -> Global Order | Mapping from individual interaction rules (Att/Rep/Align/Select) to emergent school patterns (Polarization, Cohesion, etc.) | Medium (See M4.4) | N/A | Comparison of model vs experimental PDFs (Fig 4), Force Map recovery (Fig 1, 3) | Mixed | Predictability assessed in M4.4. Yoneda embedding is a CT concept not used in the paper. | Fig 1, 3, 4 |
    *   **Yoneda Embedding Fulfillment Score [0-10]:** N/A
 Rubric: Assess how well the global behavior (Hom(C(A,-), B)) can be predicted solely from the local interaction rules applied to individual components (Hom(A, B)), where A is an individual agent state, B is the global state/observable, and C(A,-) probes the local neighborhood. High score requires faithful representation of local interactions determining global state.
    *   **Metrics:** Yoneda embedding not assessed in paper. Predictability metrics are qualitative comparisons of PDFs and force maps.
    *   **Justification:** The paper implicitly performs a local-to-global mapping by simulating models with defined local rules and comparing emergent global properties to experiments. The success of the selective interaction model suggests a reasonably faithful mapping for statistical properties. However, the formal CT concept of Yoneda embedding is not used or tested. Predictability justification is in M4.4.

## M5: Computation
*   **Vector ID:** M5
*   **Vector Type:** Computation

### **5.1 Embodied Computation Presence:**

*   **Vector ID:** M5.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The computation (information processing, decision-making like selective attention) occurs within the biological fish (nervous system, sensory perception). The paper models this computation via mathematical rules (e.g., alignment force calculations, selective interaction condition) implemented in an external simulation or inferred statistically. There is no claim or evidence of computation being embodied within the *physical material properties* of the fish or their environment in the sense required by the definition (intrinsic material computation).
    *    Implicit/Explicit: Implicit
        *  Justification: The focus is on modeling biological behavior, not material computation. The absence is inferred from the type of system studied and the modeling approach.

**(Conditional: M5.1 is "No", skip to Module 6.)**

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
| N/A      | N/A          | N/A               | N/A               | N/A              | N/A       | N/A          | N/A                | N/A                 |

## M6: Temporal Dynamics
*   **Vector ID:** M6
*   **Vector Type:** Temporal

### **6.1 Timescales:**

*   **Vector ID:** M6.1
*   **Vector Type:** ParameterTable
    *   Table:
        | Timescale Description | Value | Units | Source | Implicit/Explicit | Justification |
        | :-------------------- | :---: | :---: | :----: | :----------------: | :------------: |
        | Experimental Frame Interval | 1 / 50 = 0.02 | s | Experimental data | Explicit | Inverse of frame rate. |
        | Correlation Time Delay (τ) | approx -0.2 to +0.2 | s | Fig 5, Fig 6 | Explicit | Range observed in leadership correlation plots. |
        | Model Time Step (Δt) | 0.02 | s | Methods | Explicit | Simulation parameter. |
        | Model Speed Relaxation Time (τ) | 1.6 | s | Table I | Explicit | Model parameter. |
        | Voronoi Neighbor Contact Time (t_V) | Median ~1-10 (PDF peak) | s | Fig 4d | Explicit | Measured observable characterizing neighbor stability timescale. |
        | Burst-and-Coast Oscillation Period | ~2-5 (visual estimate) | s | Supp. Fig S15c | Implicit | Estimated from oscillations in speed plots; not explicitly quantified. |

### **6.2 Active Inference:**

*   **Vector ID:** M6.2
*   **Vector Type:** Assessment
    *   Content: Partial
    *   Justification: The proposed selective interaction mechanism, where fish preferentially attend to faster neighbors, can be interpreted through an active inference lens. Fish might possess an implicit internal model predicting that faster neighbors possess more relevant information (e.g., about predators, food, or desired direction). (1) *Prediction:* Fish implicitly predict faster neighbors are better indicators of future movement. (2) *Action selection:* They adjust their own movement (align) primarily based on these "more informative" neighbors, effectively minimizing prediction error about the group's optimal heading or state by attending to perceived leaders. (3) *Internal models:* While not explicitly modeled, the selective attention rule implies a heuristic internal model about information content related to speed. The paper doesn't frame it explicitly as Active Inference, lacking formal prediction error calculations or model updates, hence "Partial". The leader-follower dynamics (follower aligning with leader's delayed state) also align with predictive processing.
    *   Implicit/Explicit: Implicit
        *  Justification: The interpretation as Active Inference is based on inferring underlying cognitive processes from the observed behavior and proposed mechanism. The paper itself doesn't use this terminology.
    *   **If Yes/Partial, provide examples of testable CT-GIN metrics that *could* be used to quantify active inference:**
        *   **Prediction Error Dynamics:** Measure the rate at which a follower's velocity converges to a leader's future velocity after a behavioral change by the leader. `Metric`: Time constant of error decay (`TemporalEvolutionEdge` property).
        *   **Model Complexity/Evidence:** Quantify the statistical evidence (e.g., Bayesian model comparison) favoring the selective interaction model over models with uniform attention, interpretable as evidence for the 'faster is informative' internal model. `Metric`: Bayes Factor (`CognitiveMappingEdge` weight).
        *   **Anticipation Timescale:** Refine the correlation analysis (Fig 6) to precisely measure the average time delay (τ) at which follower velocity best predicts leader velocity, representing the timescale of predictive alignment. `Metric`: Peak correlation delay (`TemporalEvolutionEdge` property).

## M7: Adaptation
*   **Vector ID:** M7
*   **Vector Type:** Adaptation

### **7.1 Adaptive Plasticity Presence:**

*   **Vector ID:** M7.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The paper proposes a specific, fixed behavioral rule (selective interaction based on relative speed). While this rule allows the *behavior* of the fish (alignment/anti-alignment patterns, leader/follower roles) to *adapt* dynamically to the changing context of neighbor speeds, the excerpt does not provide evidence that the *rule itself* changes or that the fish's internal structure/parameters undergo persistent modification based on experience (plasticity in the material sense). The adaptation described is behavioral flexibility based on a potentially hardwired or fixed strategy, not structural/parametric learning or plasticity of the agent itself.
    *    Implicit/Explicit: Implicit
        * Justification: Inferred from the description of the models and findings. The selective interaction is presented as *the* mechanism, not as a state that changes over time due to learning.

**(Conditional: M7.1 is "No", skip to Module 8.)**

### **7.2 Adaptation Mechanism:**

*   **Vector ID:** M7.2
*   **Vector Type:** Description
    *   Content: N/A
    *   CT-GIN Mapping: N/A
    *    Implicit/Explicit: N/A
        *  Justification: N/A

## M8: Emergent Behaviors
*   **Vector ID:** M8
*   **Vector Type:** Behavior

### **8.1 Behavior Description:**

*   **Vector ID:** M8.1
*   **Vector Type:** Description
    *   Content: The primary emergent behaviors studied are:
        1.  **Collective Schooling:** Coordinated movement of the group, maintaining cohesion and often polarization (alignment of velocities).
        2.  **Alignment/Anti-alignment Patterns:** Specific patterns observed in the alignment force map (Fig 2b), where fish tend to align with faster neighbors and effectively anti-align (turn away) from slower ones.
        3.  **Speed-Induced Leadership:** Dynamically changing leader-follower relationships where faster individuals tend to lead and slower individuals tend to follow, inferred from time-delayed velocity correlations (Fig 6).
    *   CT-GIN Mapping: `BehaviorArchetypeNode` types: `Schooling`, `AlignmentPattern`, `LeadershipDynamics`. Attributes could include quantitative metrics like polarization (ϕ), alignment strength, correlation peak value/delay. `Schooling` emerges from `FishAgentNode` interactions via `SocialInteractionEdge`. `AlignmentPattern` is an observable derived from `ForceMapNode`. `LeadershipDynamics` emerges from `TemporalEvolutionEdge` analysis between agents.
    *    Implicit/Explicit: Explicit
       *  Justification: These behaviors (schooling, alignment patterns in force maps, leadership) are the central topics explicitly described and analyzed in the paper.

### **8.2 Behavior Robustness:**

*   **Vector ID:** M8.2
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: Schooling behavior itself is generally robust in the studied species (*H. herbertaxelrodi* is described as "highly social" forming "polarized, compact" schools). The selective interaction mechanism is found to be robust across different conditions: number of fish (N=8 vs N=39), distances between neighbors, distance to walls, relative approach/avoidance, heading differences, and focal individual speeds (Supp. Figs S5-S11). The models also produce schooling behavior. However, robustness to significant perturbations or different environmental conditions beyond those tested is not fully assessed in the excerpt. The explicit anti-alignment model showed *unrealistic* dynamics (individuals acquiring large speeds), indicating lack of robustness for that specific mechanism. The selective interaction model performed better across observables (Fig 4), suggesting robustness.
    *   Implicit/Explicit: Mixed
        *  Justification: Robustness of the alignment/anti-alignment signature is explicitly tested against several factors (Supp Figs). Robustness of schooling in the species is explicitly stated. The score reflects this evidence but acknowledges limitations as extreme conditions aren't tested. Lack of robustness in the explicit anti-alignment model is explicitly mentioned.

### **8.3 CT-GIN Emergent Behavior Validation**

*    **Vector ID:** M8.3
*    **Vector Type:** Validation
     *  Content: Validation methods include:
        1.  **Force Map Analysis:** Inferring effective forces (alignment/anti-alignment patterns) from experimental trajectory data (Results, Fig 2). Technique validated using a standard model first (Fig 1).
        2.  **Agent-Based Modeling:** Implementing different interaction rules (standard, explicit anti-alignment, selective) and comparing simulation results (force maps, statistical observables) with experimental data (Results, Fig 1, 3, 4, Supp Figs). The selective interaction model provided better qualitative and quantitative agreement (Fig 4).
        3.  **Correlation Analysis:** Calculating time-delayed correlations in velocity (orientation and speed) between neighbors to identify leader-follower relationships based on relative speed (Results, Fig 6), supporting the selective interaction hypothesis.
        4.  **Robustness Checks:** Repeating force map analysis under various conditions (different N, distances, wall proximity, etc.) to ensure the main finding isn't an artifact (Results, Supp Figs S5-S11).
        5.  **Surrogate Data Analysis:** Using time-delayed data of the *same* individual to simulate pure follower/leader scenarios and comparing resulting force maps (Fig 5) to experimental ones.
        Limitations: Force map inferences might not be unique; model parameters are chosen, not rigorously fitted; biological complexity likely exceeds models. Reproducibility depends on access to data/code (links provided).
     *   Implicit/Explicit: Explicit
    *   Justification: The validation methods (force maps, modeling, correlations, robustness checks, surrogate data) are explicitly described in the Results section and supported by figures. Limitations are briefly mentioned in the Discussion introduction and Results regarding force maps.

## M9: Cognitive Proximity
*   **Vector ID:** M9
*   **Vector Type:** Cognition

### **9.1 Cognitive Mapping:**

*   **Vector ID:** M9.1
*   **Vector Type:** Description
    *   Content: Yes, the paper explicitly maps the observed selective interaction mechanism to cognitive processes:
        *   **Selective Attention:** The core hypothesis is that the observed alignment/anti-alignment pattern results from fish "paying less attention" or "ignoring" slower neighbors, focusing on faster ones. This is framed as a "selective attention mechanism" potentially reducing "cognitive load".
        *   **Decision-Making:** Interaction rules are described as originating from "individual decision-making processes". The choice to align or not based on relative speed is an implicit decision.
        *   **Information Processing:** Social interactions are viewed as transferring information. Faster individuals are hypothesized to provide more "relevant" or "salient" information (motion cues), potentially related to environmental cues like predators or food.
        Limitations: These mappings are interpretations of behavior based on cognitive science concepts. The underlying neural mechanisms are not investigated. The term "attention" is used functionally to describe the behavioral outcome.
    *   CT-GIN Mapping: Creates `CognitiveMappingEdge` from `BehaviorArchetypeNode` (e.g., `AlignmentPattern`, `LeadershipDynamics`) or `InteractionEdge` (e.g., `SelectiveAttention`) to `CognitiveFunctionNode` (e.g., `SelectiveAttention`, `DecisionMaking`, `InformationProcessing`). Attributes: `mappingType` (Analogy/Hypothesis).
    *   Implicit/Explicit: Explicit
    * Justification: The paper explicitly uses terms like "selective attention mechanism", "decision-making processes", "information flow", "cognitive load", "perceptually more salient" in the Introduction, Results, and Discussion sections when interpreting the findings.

### **9.2 Cognitive Proximity Score:**

*   **Vector ID:** M9.2
*   **Vector Type:** Score
    *   Score: 3
    *   Justification: Based on the CT-GIN Cognizance Scale:
        *   The system clearly goes beyond Level 0 (Non-Cognitive) and Level 1 (Simple Responsivity) due to the complex, context-dependent interactions (relative speed matters).
        *   It demonstrates Level 2 (Sub-Organismal Responsivity) as the selective interaction is a form of adaptive behavioral selection based on specific cues (relative speed).
        *   It aligns well with Level 3 (Reactive/Adaptive Autonomy). The fish adapt their alignment behavior based on the immediate social context (neighbor speeds) and feedback (implied goal of maintaining cohesion/following information). The leader-follower dynamics represent an adaptive structure within the group.
        *   There's little evidence for Level 4 (Goal-Directed/Model-Based Cognition). While minimizing prediction error (active inference interpretation) could imply goal-directedness, internal models are not explicitly demonstrated or required by the proposed mechanism. The behavior seems more like a sophisticated reactive strategy.
        *   Higher levels (5-10) are clearly not applicable based on the excerpt.
        The score of 3 reflects strong evidence for adaptive autonomy within a specific behavioral context (schooling interactions) but lacking clear evidence for explicit internal models or higher cognitive functions *as described in the paper*.
    *   Implicit/Explicit: Implicit
    *  Justification: The score is an interpretation based on matching the paper's findings (explicitly stated behaviors and mechanisms) to the provided scale's definitions (explicit).

**CT-GIN Cognizance Scale:** (Provided in template, not repeated here)

### **9.3 Cognitive Function Checklist**

* **Vector ID:** M9.3
* **Vector Type:** Checklist
    *   | Cognitive Function               | Score (0-10) | Justification/Notes                                                                       | CT-GIN Mapping (if applicable) | Implicit/Explicit | Justification for Implicit/Explicit/Mixed |
    | :-------------------------------- | :----------: | :------------------------------------------------------------------------------------ | :--------------------------------: | :-----------------:|:-----------------:|
    | Sensing/Perception               |      7       | Fish perceive relative positions/velocities of neighbors (visually, lateral line - implied). Accuracy/details not quantified in excerpt. | `FishAgentNode` -> `SensingModule` (Implied) | Implicit | Required for interactions, sensing modalities mentioned in Discussion. |
    | Memory (Short-Term/Working)        |      3       | Required for comparing current state to neighbor state, reacting to changes over short delays (τ ~0.1s). Not long-term material memory. | `FishAgentNode` -> `ShortTermMemory` (Implied) | Implicit | Inferred from time delays in correlations and need to react to dynamic context. |
    | Memory (Long-Term)                 |      0       | No evidence presented for long-term changes in interaction rules or behavioral strategies based on past experience. | N/A | Implicit | Absence inferred from focus on immediate interactions. |
    | Learning/Adaptation              |      4       | Behavioral adaptation based on immediate context (relative speed) is key finding. No evidence for learning/change of the *rules* over time. | `BehaviorArchetypeNode` property: Adaptive | Mixed | Behavioral adaptation explicit, rule plasticity absent/implicit. |
    | Decision-Making/Planning          |      3       | Implicit decision to align/ignore based on relative speed ("selective attention mechanism"). No evidence of multi-step planning. | Linked to `SelectiveAttention` `InteractionEdge` | Mixed | Explicitly mentioned term, mechanism implies simple decision. |
    | Communication/Social Interaction |      8       | Social interactions (forces, selective attention) are the core subject, mediating coordination and leadership. | `SocialInteractionEdge` | Explicit | Central theme of the paper. |
    | Goal-Directed Behavior            |      2       | Behavior seems directed towards maintaining cohesion/alignment, potentially following info cues. Goals are implicit, likely basic drives. | `BehaviorArchetypeNode` property: Goal (Implied) | Implicit | Schooling itself implies goals; higher-level goals not evidenced. |
    | Model-Based Reasoning              |      1       | Selective attention *could* imply a simple internal model ("faster = informative"), but not explicitly modeled or tested. See M6.2. | `CognitiveMappingEdge` to `InternalModelNode` (Hypothetical) | Implicit | Interpretation based on Active Inference framework, not explicit in paper. |
    | **Overall score**                 |      3.5       |                                                                                       |                                   |                     |                |

    *   **Note:** Scores reflect assessment based *only* on the provided excerpt compared to general cognitive functions, not strictly material intelligence.

## M10: Criticality Assessment
*   **Vector ID:** M10
*   **Vector Type:** Criticality

### **10.1 Criticality:**

*   **Vector ID:** M10.1
*   **Vector Type:** Assessment
    *   Content: N/A
    *   Justification: The concept of criticality (operation near a phase transition, power laws, scale-free behavior, long-range correlations) is not mentioned or investigated in the provided excerpt.
        *   Critical Parameters (If Yes/Partial): N/A
        *   Evidence: N/A
    *   Implicit/Explicit: Implicit
    *    Justification: Absence inferred from the text. Collective behavior studies sometimes investigate criticality, but this paper focuses on specific interaction rules and force maps.

## M11: Review Paper Specifics (Conditional)

*   **Vector ID:** M11
*   **Vector Type:** Review
    *   Content: N/A (Paper type is Hybrid, not Review).

## M12: Theoretical Paper Specifics (Conditional)

*   **Vector ID:** M12
*   **Vector Type:** Theory
    *   Content: N/A (Paper type is Hybrid, not purely Theoretical).

## M13: Overall Assessment & Scoring

*   **Vector ID:** M13
*   **Vector Type:** Overall

### **13.1 CT-GIN Readiness Score:**

*   **Vector ID:** M13.1
*   **Vector Type:** Score
*   **Calculated Score:** 4.17 (Average of M1.2=8, M4.4=7, M8.2=7, M9.2=3. N/A scores for M2.3, M3.2 treated as 0 for calculation per instruction: (8+0+0+7+0+0+7+3)/8 = 25/8 ≈ 3.125. Re-calculating based on *available* scores only: (8+7+7+3)/4 = 25/4 = 6.25. Clarification: Instruction says "scores with N/A convert in 0". Let's use that rule: (M1.2=8 + M2.3=0 + M3.2=0 + M4.4=7 + M8.2=7 + M9.2=3) / 6 = 25 / 6 = 4.17 )

**CT-GIN Readiness Summary Table:**

| CT-GIN Aspect                   | Strength (Yes/Partial/No) | Key Supporting Metrics (with units) | Limitations (Missing Metrics/Data Gaps)                                           | Improvement Areas (Future Research)                                          |
| :------------------------------ | :-----------------------: | :-----------------------------------| :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| Energy Flow Efficiency          | No                       | N/A                                     | Energy input, transduction, efficiency, detailed dissipation not quantified.    | Integrate bioenergetic models; measure metabolic cost of interactions.         |
| Memory Fidelity                 | No                       | N/A                                     | No persistent material-like memory identified or modeled.                       | Investigate longer-term learning/adaptation of interaction rules.             |
| Organizational Complexity       | Yes                      | ϕ, <d_NN>, s, t_V, Force Maps, Correlation Delays | Higher-order correlations, network topology dynamics less explored.             | Analyze dynamic interaction networks; multilevel analysis (dyads, triads, group). |
| Embodied Computation            | No                       | N/A                                     | Computation is biological, not material-embodied as per definition.           | N/A (outside scope of this biological system for material computation).      |
| Temporal Integration            | Partial                  | Frame rate (0.02s), Interaction delays (~0.1s), Relaxation (1.6s), Neighbor contact (~1-10s) | Precise reaction times, multiscale temporal dependencies need more analysis. | Model explicit reaction times; wavelet/spectral analysis of trajectories.    |
| Adaptive Plasticity             | No                       | N/A                                     | Behavioral adaptation present, but no evidence for plasticity of rules/structure. | Investigate if interaction rules change with experience/environment.          |
| Functional Universality         | No                       | N/A                                     | Behaviors specific to schooling context.                                        | Explore behavior in different contexts (foraging, predator avoidance).         |
| Cognitive Proximity            | Partial                  | Selective attention, decision-making analogies; Score=3 | Mapping is functional/analogical; lacks neural basis; limited complexity.    | Integrate neuro-ethological data; develop more complex cognitive models.     |
| Design Scalability & Robustness | Partial                  | Robustness checks (Supp Figs); N=8 vs N=39 | Robustness to major perturbations untested; model scalability TBD.             | Test resilience to noise/perturbations; simulate much larger groups.        |
| **Overall CT-GIN Readiness Score** |        4.17 (Calculated)            |                                      |                                                                                  |                                                                               |


### **13.2 Qualitative CT-GIN Assessment Conclusion:**

*   **Vector ID:** M13.2
*   **Vector Type:** Textual Summary
    *   Content: This study provides a detailed analysis of local interaction rules and emergent collective behavior in a biological system (fish schooling), aligning well with the self-organization aspects of the CT-GIN framework. Key strengths include the clear identification and modeling of local rules (especially the novel selective interaction mechanism based on relative speed), the demonstration of how these rules lead to emergent global patterns (alignment/anti-alignment force maps) and dynamics (leadership), and rigorous validation through model-experiment comparison and robustness checks. The mapping of behavioral mechanisms to cognitive concepts like selective attention provides a link, albeit analogical, to cognitive functions. Key limitations from a strict material intelligence perspective are the absence of material-embodied memory, computation, and adaptive plasticity. Energy flow is not considered. While demonstrating adaptive *behavior*, the system doesn't show adaptation *of* the underlying rules or structure in a persistent way. Overall, the paper offers valuable insights into emergent behavior from local rules and information processing in a biological collective, providing a strong case study for self-organization (M4) and temporal dynamics (M6), with partial relevance to cognition (M9), but limited direct applicability to material-specific aspects like energy (M2) and memory (M3) as defined in the CT-GIN template.
### **13.3 CT-GIN Refinement Directions:**

*   **Vector ID:** M13.3
*   **Vector Type:** Recommendations
    *   Content:
        *   **Explicitly Model Information Flow:** Quantify information transfer rates between agents based on different interaction types (CT-GIN: `InformationFlowEdge` attributes).
        *   **Investigate Memory Effects:** Design experiments or models to test for longer-term memory effects, e.g., does past leadership status influence current interactions beyond instantaneous speed? (CT-GIN: Explore potential for `MemoryNode`).
        *   **Multi-Scale Temporal Analysis:** Analyze system dynamics across multiple timescales, from fast reactions to slow drift in group structure or leadership persistence (CT-GIN: `TemporalEvolutionEdge` characterization).
        *   **Network Dynamics:** Analyze the structure and evolution of the dynamic interaction network (who interacts with whom based on selective rules) and relate it to global behavior (CT-GIN: `NetworkTopologyNode` evolution).
        *   **Formal CT Modeling:** Apply explicit Category Theory constructs (e.g., functors mapping local neighborhood configurations to agent actions, limits/colimits for consensus dynamics) to formalize the local-to-global mapping.
        *   **Comparative Energetics (Hypothetical):** If extended, model the energetic cost associated with different interaction strategies (e.g., cost of sensing all neighbors vs. selective sensing). (CT-GIN: Refine `EnergyDissipationNode` modeling).
        *   **Refine Cognitive Mapping:** Develop more detailed agent models incorporating internal states representing attention or prediction to test cognitive hypotheses more directly (CT-GIN: Enhance `CognitiveMappingEdge` links).

## M14: CT-GIN Knowledge Graph

*   **Vector ID:** M14
*   **Vector Type:** Visualization

### **14.1. CT-GIN Knowledge Graph:**
* **Content:**
    *   **(Schematic Description - No Image):**
        *   **Central Nodes:** `SystemNode` (Fish Schooling), `FishAgentNode` (representing individual fish).
        *   **Agent Attributes:** `position`, `velocity`, `acceleration`.
        *   **Interaction Edges:** `SocialInteractionEdge` connecting pairs/groups of `FishAgentNode`s. Attributes: `type` (AttractionRepulsion, Alignment, SelectiveAttention), `parameters` (k, d0, µ, etc.), `weight`, `condition`.
        *   **Configuration Nodes:** `ConfigurationalNode` (Global State) linked from `SystemNode` or aggregated from `FishAgentNode`s. Attributes: `patternType`, `orderParameter` (ϕ), `cohesionMetric` (<d_NN>), etc. `ForceMapNode` representing the binned acceleration data.
        *   **Behavior Nodes:** `BehaviorArchetypeNode` (`Schooling`, `AlignmentPattern`, `LeadershipDynamics`) linked from `ConfigurationalNode` or derived from agent dynamics.
        *   **Temporal Edges:** `TemporalEvolutionEdge` representing dynamics (e.g., linking agent states over time, capturing correlations with delay τ).
        *   **Cognitive Mapping:** `CognitiveMappingEdge` linking `SocialInteractionEdge` (SelectiveAttention) or `BehaviorArchetypeNode` (Leadership) to `CognitiveFunctionNode` (SelectiveAttention, DecisionMaking).
        *   **Model Nodes:** `ModelNode` (Standard, ExplicitAntiAlign, Selective) linked to `SystemNode`, specifying the `SocialInteractionEdge` rules they implement.
        *   **Energy/Memory/Computation Nodes:** Largely absent or having only basic representation (e.g., `EnergyDissipationNode` for friction) due to limited information in the excerpt.

## M15: Relationship Vectors
*   **Vector ID:** M15
*   **Vector Type:** Relationships
*   Relationships:
        | Source Vector ID | Target Vector ID | Relationship Type |
        | ------------- | ------------- | ----------------- |
        | M1.1          | M4.1          | Describes System Exhibiting |
        | M1.3          | M4.2.1        | Provides Parameters For |
        | M4.2          | M4.3          | Leads To Emergence Of |
        | M4.2          | M8.1          | Governs Local Rules For |
        | M4.3          | M8.1          | Manifests As |
        | M4.6          | M4.3          | Quantifies |
        | M6.1          | M6.2          | Provides Timescales For |
        | M6.1          | M8.1          | Characterizes Dynamics Of |
        | M8.1          | M9.1          | Interpreted As Cognitive |
        | M8.3          | M8.1          | Validates Claims Of |
        | M1.1          | M13.2         | Is Summarized By |
        | M13.1         | M13.2         | Is Basis For |

## M16: CT-GIN Template Self-Improvement Insights

*   **Vector ID:** M16
*   **Vector Type:** Feedback

### **Template Feedback:**

*    **Vector ID:** M16.1
*   **Vector Type:** Text
    *   **Missing Probes:**
        *   A probe specifically for "Information Processing" distinct from "Computation" might be useful, especially for biological systems where information transfer/use is key, but not necessarily material computation (e.g., quantify information flow rates, mutual information between agents).
        *   Probes related to the *validation strength* of model-experiment comparisons could be added (e.g., quantitative goodness-of-fit metrics).
    *   **Unclear Definitions:**
        *   The distinction between "Adaptation" (M7) and "Active Inference" (M6.2) in the context of behavioral changes could be clearer. M7 focuses on *persistent changes* while M6.2 on *dynamic adjustment*, but overlap exists.
        *   "Cognitive Proximity" (M9) vs. the Cognitive Function Checklist (M9.3): The relationship could be clarified – does the checklist *determine* the proximity score, or are they parallel assessments? The scale (0-10) seems very high for current material systems.
    *   **Unclear Node/Edge Representations:**
        *   Guidance on representing *dynamic* aspects (like changing leadership or network structure) in a static graph representation could be enhanced. Maybe suggest specific ways to encode time evolution (e.g., sequences of graphs, edge attributes changing over time).
        *   Mapping cognitive analogies (M9.1) needs careful handling to avoid overstating claims in the graph structure.
    *   **Scoring Difficulties:**
        *   Assigning scores for M4.4 (Predictability), M8.2 (Robustness), and especially M9.2/M9.3 (Cognitive Proximity/Functions) is inherently subjective when quantitative metrics are lacking in the source paper. Providing more detailed rubrics or anchor points for biological vs. material systems might help standardize scoring.
        *   The instruction to treat N/A as 0 for the M13.1 score calculation might heavily penalize papers from domains (like this one) where certain modules (Energy, Material Memory) are inherently not applicable, potentially misrepresenting their relevance within their own field or for specific CT-GIN aspects like self-organization. Suggestion: Calculate the score based only on *applicable* modules or provide separate scores for different dimensions.
    *   **Data Extraction/Output Mapping:**
        *   Extracting implicit information (e.g., energy dissipation from friction, memory absence) requires careful judgment and justification, which the template handles well by requiring it.
        *   Mapping biological computation/information processing onto the "Computation" module (M5) designed for *material* computation is problematic; it correctly resulted in "No" here, but highlights a potential domain mismatch for the module's current definition.
    *   **Overall Usability:**
        *   The template is very comprehensive but quite long. For papers focused on specific aspects (e.g., only self-organization), many sections become N/A. Perhaps a modular structure where users select relevant modules could streamline the process.
        *   The application to a biological system highlighted the need to constantly differentiate between the behavior *of* the components (fish) and the properties *of* the material system itself, which are conflated in cognizant matter. The template prompts generally encourage this distinction, but it requires careful application by the user.
    * **Specific Suggestions:**
        *   Add a "Domain Applicability" field to each module description, guiding the user on expected relevance for different system types (Material, Biological, Computational, Hybrid).
        *   Modify M13.1 calculation to average only over modules scored > N/A, or provide sub-scores for groups of modules (e.g., Structure/Dynamics, Energy/Memory, Cognition).
        *   Refine M5 definition to clarify if it *only* applies to computation *by* the material substrate, or if it can represent information processing modeled *within* the system's components, even if biological. (Current definition seems to exclude the latter).