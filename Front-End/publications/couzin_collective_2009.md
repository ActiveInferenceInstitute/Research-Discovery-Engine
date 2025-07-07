# Collective cognition in animal groups

__Paper Type:__ Review

## M1: System Overview & Implementation
*   **Vector ID:** M1
*   **Vector Type:** Overview

### **1.1 System Description**

*   **Vector ID:** M1.1
*   **Vector Type:** Description
    *   Content: The paper reviews the principles of collective cognition in animal groups (e.g., swarming ants, schooling fish, flocking birds). It describes how local interactions among individuals, based on cues like position and motion of neighbors, scale up to coordinated group-level behaviors such as collective motion, decision-making (e.g., direction choice, consensus), and foraging. The purpose is to understand the relationship between individual behaviors and group properties, highlighting analogies with neuronal processes and cognitive science concepts like feedback, speed-accuracy trade-offs, memory (hysteresis), and quorum sensing. Key components are the individual animals within the group and their local interaction rules (repulsion, alignment, attraction). The system's function is adaptive collective response to environmental challenges (e.g., predation, resource finding, navigation).
    *   CT-GIN Mapping: `SystemNode` attributes: `systemType`: Biological Collective, `domain`: Animal Behavior/Collective Intelligence, `mechanism`: Local Interactions (Repulsion, Alignment, Attraction), Feedback (Positive/Negative), Quorum Sensing, Stigmergy, `components`: Individual Animals, Environment (implicit), Pheromones (Ants), `purpose`: Collective Decision-Making, Navigation, Foraging, Predator Avoidance.
    *   Implicit/Explicit: Explicit
        *  Justification: The paper explicitly describes the systems (animal groups), their components (individuals), the mechanisms (local interactions, feedback), and the purpose (collective decision-making, etc.) throughout the text, particularly in the Introduction, Collective Motion, and subsequent sections detailing specific examples like ants and fish.

### **1.2 Implementation Clarity**

*   **Vector ID:** M1.2
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: As a review, the paper clearly synthesizes concepts and findings from various studies. It explains the general principles (local interactions, feedback) well and provides specific examples (fish schools, ant colonies, pigeons) with described mechanisms (e.g., quorum sensing in fish, pheromone trails in ants). However, being a review, it doesn't provide the exhaustive implementation details (e.g., precise model parameters, specific experimental protocols) for every system mentioned, relying instead on citations. Box 1 provides a good conceptual model description, but details vary across cited works.
    *   Implicit/Explicit: Mixed
        * Justification: The clarity of the general principles and described examples is explicit. The lack of exhaustive detail for *every* specific cited study's implementation is implicit based on the nature of a review paper.

### **1.3 Key Parameters**

*   **Vector ID:** M1.3
*   **Vector Type:** ParameterTable
    *   Table:
        | Parameter Name | Value | Units | Source (Fig/Table/Section) | Implicit/Explicit | Data Reliability (High/Medium/Low) | Derivation Method (if Implicit) |
        | :------------- | :---: | :---: | :-----------------------: | :-----------------: | :-----------------------------: | :-------------------------------: |
        | Zone of Repulsion (zor) range | Conceptual | Length | Box 1, Fig I | Explicit | Medium | Conceptual parameter in models. |
        | Zone of Orientation (zoo) range | Conceptual | Length | Box 1, Fig I | Explicit | Medium | Conceptual parameter in models; varied to show transitions. |
        | Zone of Attraction (zoa) range | Conceptual | Length | Box 1, Fig I | Explicit | Medium | Conceptual parameter in models. |
        | Quorum threshold (Sticklebacks) | Qualitative ('more neighbours') | Individuals | Section: Feedback and the speed-accuracy trade-off | Explicit | Medium | Concept explicitly discussed, specific number not given universally. |
        | Quorum threshold (Ants - T. albipennis) | Density-dependent | Ants / Area | Section: Finding a new home | Explicit | Medium | Concept explicitly discussed, specific density not given universally. |

    *   **Note:** These parameters are primarily conceptual or illustrative as presented in the review, representing classes of parameters used in models or observed qualitatively in experiments cited. Precise values are often study-specific (in the cited literature) rather than universally defined in this review.

## M2: Energy Flow
*   **Vector ID:** M2
*   **Vector Type:** Energy
    *   Content: N/A. The paper focuses on information processing and decision-making in biological collectives, not the thermodynamics or detailed energy flow within individual organisms or the group from a material physics perspective. Energy input (food) and dissipation (metabolic costs, movement) are implicit biological constraints but not analyzed.

### **2.1 Energy Input**

*   **Vector ID:** M2.1
*   **Vector Type:** Input
    *   Content: N/A. Biological energy sources (food) are implicit but not the focus.
    *   Value: N/A
    *   Units: N/A
    *   CT-GIN Mapping: N/A
    *   Implicit/Explicit: Implicit
        *  Justification: Biological systems require energy, but the paper does not discuss energy input sources or quantities.

### **2.2 Energy Transduction**

*   **Vector ID:** M2.2
*   **Vector Type:** Transduction
    *   Content: N/A. Energy transduction in the material sense (e.g., chemical to mechanical) is not discussed. Biological processes (muscle contraction, neural activity) are implicit but not analyzed from an energy transduction perspective.
    *   CT-GIN Mapping: N/A
    *   Implicit/Explicit: Implicit
        *  Justification: The paper focuses on behavioral rules and information, not the underlying bio-energetics or physical energy transformations.

### **2.3 Energy Efficiency**

*   **Vector ID:** M2.3
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification/Metrics: N/A. Energy efficiency is not discussed or quantified.
    *   CT-GIN Mapping: N/A
    *   Implicit/Explicit: N/A
      *  Justification: The paper does not provide information related to energy efficiency.

### **2.4 Energy Dissipation**

*   **Vector ID:** M2.4
*   **Vector Type:** Dissipation
    *   Content: N/A. Energy dissipation mechanisms (metabolic heat, friction during movement) are inherent to biological systems but not quantified or discussed.
    *   CT-GIN Mapping: N/A
    *    Implicit/Explicit: Implicit
        *  Justification: Biological energy dissipation is implied but not analyzed in the text.

## M3: Memory
*   **Vector ID:** M3
*   **Vector Type:** Memory

### **3.1 Memory Presence:**

*   **Vector ID:** M3.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The paper explicitly discusses "collective memory" in the context of hysteresis in group behavior (Box 1), where the group state depends on its previous history even with identical individual rules. It also discusses memory in the context of ant foraging trails (stigmergy), where pheromone deposition creates a persistent environmental modification influencing future foraging decisions (Section: Collective cognition through environmental modification). The relative persistence of different pheromones creates a form of "working memory".
    *    Implicit/Explicit: Explicit
        * Justification: Concepts like "collective memory" (Box 1), "hysteresis" (Box 1 caption), pheromone trail persistence providing long-term information, and "working memory" via different pheromone volatilities (Section: Collective cognition through environmental modification) are explicitly stated.

**(Conditional: If M3.1 is "No", skip to Module 4. If "Yes", include M3.2 and M3.3.)**

### **3.2 Memory Type:**

*   **Vector ID:** M3.2
*   **Vector Type:** Score
*   Score: 4
*   Justification: The paper describes phenomena analogous to memory.
    1.  **Hysteresis (Box 1):** This represents a form of short-term structural memory where the current collective state (e.g., polarized vs. torus) depends on the recent history of parameter changes (increasing vs. decreasing alignment range). It's a collective property arising from local interactions, not individual cognitive memory. Retention seems tied to the timescale of parameter stability. Re-writability depends on traversing the hysteresis loop. Capacity seems limited to the few stable states. Score: 3/10 (Simple state persistence based on history).
    2.  **Stigmergy (Ants):** Pheromone trails act as an externalized, persistent memory. Trail strength encodes information about path usage/food quality. Retention depends on pheromone volatility (tunable timescale, from working memory to longer-term). Capacity relates to the spatial complexity of the trail network and pheromone concentration levels. Read-out is probabilistic (following stronger trails). It is re-writable through deposition/evaporation. Score: 5/10 (Externalized, tunable, spatially distributed memory influencing collective behavior).
    Overall Score: Averaging conceptually, around 4/10. The memory isn't high-fidelity internal cognitive memory but rather emergent collective effects or externalized environmental modifications.
*   CT-GIN Mapping: `MemoryNode` type: CollectiveHysteresis, StigmergicTrace. Attributes: `persistenceMechanism` (InteractionDynamics, PheromoneVolatility), `location` (CollectiveState, Environment), `readoutMechanism` (CollectiveTransition, ProbabilisticFollowing).
*    Implicit/Explicit: Explicit
    * Justification: The phenomena (hysteresis, pheromone trails) and their memory-like characteristics (dependence on history, persistence, influence on future behavior) are explicitly described. The scoring is an interpretation based on these descriptions.

### **3.3 Memory Retention Time:**

*   **Vector ID:** M3.3
*   **Vector Type:** Parameter
*   Value: Variable / Tunable
*    Units: N/A (Qualitative Descriptors: Short-term to Long-term depending on mechanism)
*   Justification: For hysteresis (Box 1), retention depends on how long parameters remain in the multi-stable region. For ant pheromones, retention depends on volatility; the paper explicitly mentions using chemicals with different volatilities for short-term ("selective attention") vs. longer-term ("working memory") information storage. Specific quantitative values are not given in the review but implied to be variable and functionally relevant (e.g., related to foraging timescales).
*    Implicit/Explicit: Mixed
        * Justification: The existence of different timescales (short vs. long via volatility) is explicit. The lack of specific numerical values for retention times makes the value qualitative/variable.
*   CT-GIN Mapping: Attribute `retentionTime` of `MemoryNode`. Values: Hysteresis: "ParameterDependent", StigmergicTrace: "VolatilityDependent (Tunable)".

### **3.4 Memory Capacity (Optional - if applicable)**

* **Vector ID:** M3.4
* **Vector Type:** Parameter
*  Value: Low (Hysteresis) / Potentially High (Stigmergy)
*   Units: States (Hysteresis) / Information Content (Stigmergy - qualitative)
*   Justification: Hysteresis (Box 1) shows memory limited to a few distinct collective states (e.g., torus vs. polarized). Stigmergy (pheromone trails) can potentially encode complex spatial information (network structure, resource locations, quality via concentration), suggesting a higher capacity, although not quantified in bits.
*    Implicit/Explicit: Implicit
        *  Justification: Inferred from the descriptions. Box 1 shows few states. The description of ant trail networks implies a larger potential information capacity than simple bistability, but it's not quantified.
*   CT-GIN Mapping: Attribute `capacity` of `MemoryNode`. Values: Hysteresis: "FewStates", StigmergicTrace: "NetworkComplexityDependent".

### **3.5 Readout Accuracy (Optional - if applicable)**

* **Vector ID:** M3.5
* **Vector Type:** Parameter
*   Value: Probabilistic / Stochastic
*   Units: Probability / % (qualitative)
*   Justification: Readout of hysteresis depends on perturbations potentially pushing the system between states. Readout of pheromone trails is described as probabilistic, with ants more likely (but not certain) to follow stronger trails. Accuracy isn't explicitly quantified as an error rate.
*    Implicit/Explicit: Implicit
       *  Justification: Inferred from descriptions like "tend to follow" and the inherently stochastic nature of individual decisions within the collective. Not quantified.
*   CT-GIN Mapping: Attribute `readoutAccuracy` or `readoutMechanism` of `MemoryNode` or related `ReadoutEdge`. Value: "Probabilistic".

### **3.6 Degradation Rate (Optional - if applicable)**
* **Vector ID:** M3.6
* **Vector Type:** Parameter
    *   Value: Related to Pheromone Evaporation Rate
    *   Units: Concentration / time (qualitative)
    *   Justification: Explicitly mentioned for ant pheromones ("evaporative decay," "volatility"). This decay acts as negative feedback and determines retention time. The rate itself is tunable by using different chemicals. Not quantified numerically in the review. Hysteresis memory degrades if parameters change or sufficient perturbation occurs.
    *    Implicit/Explicit: Explicit
            * Justification: Pheromone evaporation/decay is explicitly mentioned as a key mechanism. The rate not being quantified makes the value qualitative.
    *   CT-GIN Mapping: Attribute `degradationRate` of `MemoryNode` (StigmergicTrace). Value: "VolatilityDependent".

### **3.7 Memory Operations Energy Cost (Optional - if applicable)**
* **Vector ID:** M3.7
* **Vector Type:** Table
*   Table: N/A
*   Implicit/Explicit: N/A
    *   Justification: Energy costs of depositing pheromones or maintaining collective states are not discussed.

### **3.8 Memory Fidelity & Robustness Metrics (Optional - if applicable)**
* **Vector ID:** M3.8
* **Vector Type:** Table
*   Table: N/A
*   Implicit/Explicit: N/A
*   Justification: Fidelity and robustness of these memory mechanisms are not quantified using specific metrics in the review.

---

## M4: Self-Organization and Emergent Order
*   **Vector ID:** M4
*   **Vector Type:** Self-Organization

### **4.1 Self-Organization Presence:**

*   **Vector ID:** M4.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The paper is fundamentally about how collective behavior and order (e.g., schools, flocks, swarms, coordinated decisions, foraging patterns) emerge spontaneously from local interactions among individuals without a leader or global blueprint. This is explicitly stated (e.g., "collective behavior can arise from repeated and local interactions and need not be explicitly coded as a global blueprint" - Section: Collective motion; "spontaneous and indirect coordination" via stigmergy - Section: Collective cognition through environmental modification).
    *   Implicit/Explicit: Explicit
        *  Justification: The concept of self-organization from local rules is a central theme explicitly discussed throughout the paper.

**(Conditional: If M4.1 is "No", skip to Module 5. If "Yes", include M4.2-M4.7)**

### **4.2 Local Interaction Rules:**

*   **Vector ID:** M4.2
*   **Vector Type:** Rules
    *   Content:
        *   **General Model (Box 1):** Individuals adjust movement based on neighbors within distinct spatial zones:
            *   Short-range repulsion (avoid collisions).
            *   Intermediate-range alignment (orient with neighbors).
            *   Long-range attraction (maintain cohesion).
        *   **Sticklebacks (Decision-making):** Non-linear response to neighbors' direction; largely ignore single neighbor, increased copying probability with a 'quorum' of neighbors turning.
        *   **Ants (Foraging - Stigmergy):** Deposit pheromones (strength potentially related to food quality/quantity); Probabilistically follow existing pheromone trails (bias towards stronger trails); Pheromones decay/evaporate over time.
        *   **Ants (Nest Selection - T. albipennis):** Scout assesses potential nest (assessment time inversely proportional to quality); Recruits nestmates via 'tandem running' (slow, one-to-one recruitment); Switches to faster 'carrying' recruitment upon detecting a quorum of ants at the new site.
        *   **Ants (Nest Activity - Box 2):** Inactive ants become active spontaneously (low probability) or via contact with active ants (excitation, temporal integration); Active ants can become inactive (tendency increases if insufficient reinforcement); Refractory period after becoming inactive.
        *   **Honeybees (Nest Selection):** Scouts perform waggle dance (duration proportional to site quality) to recruit others; Dance decays over time; Quorum sensing at potential site triggers rapid commitment/recruitment.
        *   **Informed Individuals (Leadership):** Informed individuals bias movement towards a preferred direction; Naive individuals follow local rules (alignment, attraction).
    *   CT-GIN Mapping: Defines `AdjunctionEdge`s (local interaction rules). Edge types: `Repulsion`, `Alignment`, `Attraction`, `QuorumResponse`, `PheromoneDeposit`, `PheromoneFollow`, `TandemRunRecruit`, `CarryRecruit`, `ContactActivation`, `WaggleDanceRecruit`. Attributes capture rule parameters (e.g., `range`, `strength`, `threshold`, `probability`).
    * **Implicit/Explicit**: Explicit
        *  Justification: These rules are explicitly described in the text and boxes for the different systems discussed.

### **4.2.1 Local Interaction Parameters:**

* **Vector ID:** M4.2.1
* **Vector Type:** Table
*   Table:
    | Rule ID | Description | Parameter Name | Parameter Value Range | Units | Data Source | Implicit/Explicit | Justification |
    | :------ | :---------- | :------------- | :---------- | :---: | :----------: | :----------------: | :------------: |
    | General Model | Alignment | Range (zoo) | Variable (Conceptual) | Length | Box 1 | Explicit | Varied in model to show transitions. |
    | Sticklebacks | Quorum Response | Copying Probability | Non-linear function of # neighbors | Probability | Section: Feedback... | Explicit | Described qualitatively as non-linear. |
    | Ants (Foraging) | Pheromone Following | Following Probability | Function of trail concentration | Probability | Section: Collective cognition... | Explicit | Described qualitatively (bias to stronger trails). |
    | Ants (Nest Sel.) | Quorum Sensing | Quorum Threshold | Variable (depends on urgency) | Ants / Area | Section: Finding a new home | Explicit | Threshold concept explicit, value tunable. |
    | Honeybees | Waggle Dance | Dance Duration | Proportional to site quality | Time | Section: Finding a new home | Explicit | Proportional relationship stated. |
    | Honeybees | Quorum Sensing | Quorum Threshold | N/A (number implied) | Individuals | Section: Finding a new home | Explicit | Threshold concept explicit. |

### **4.3 Global Order:**

*   **Vector ID:** M4.3
*   **Vector Type:** Order
    *   Content: Cohesive group structures (swarms, torus, polarized schools/flocks - Box 1); Coordinated collective movement; Consensus decisions (e.g., direction of travel, best food source, new nest site); Efficient foraging patterns (e.g., shortest paths); Propagating waves of turning/activity (e.g., predator avoidance, ant nest rhythms); Spatially sorted groups (mentioned briefly in Box 1 ref [10]).
    *   CT-GIN Mapping: Defines `ConfigurationalNode`s. Types: `Swarm`, `Torus`, `PolarizedGroup`, `ConsensusState`, `ForagingNetwork`, `ActivityWave`, `SpatialSorting`.
    * **Implicit/Explicit**: Explicit
        *  Justification: These emergent global patterns and behaviors are explicitly described as outcomes of the local interactions.

### **4.4 Predictability of Global Order:**

*   **Vector ID:** M4.4
*   **Vector Type:** Score
    *   Score: 6
    *   Justification: The models discussed (e.g., Box 1) show predictable transitions between distinct collective states based on parameters. Consensus models (Fig 1a) predict outcomes (averaging vs. winner-takes-all) based on conflict level. Stigmergic models predict convergence to efficient solutions (shortest path, best source). However, stochasticity plays a role (e.g., initial conditions, individual noise, environmental fluctuations), meaning outcomes are often probabilistic rather than deterministic (e.g., which direction in symmetric conflict, initial trail choices). The spontaneous generation of activity waves in ants (Box 2) emerges predictably as a pattern but details can be stochastic. Predictability is generally medium to high for the *type* of order, but lower for the *specific* outcome in stochastic situations.
    * **Implicit/Explicit**: Mixed
    *  Justification: Predictable transitions and model outcomes are explicit (Box 1, Fig 1). The role of stochasticity and probabilistic outcomes is also mentioned ("amplification of random fluctuations", which choice in symmetric conflict). The score integrates these aspects.
    *   CT-GIN Mapping: Contributes to `AdjunctionEdge` weight or attributes relating local rules to global states (`ConfigurationalNode`).

### **4.5. Local Interaction Rules (for Self-Organization)**
* **Vector ID:** M4.5
* **Vector Type:** Table
*   Table:
| Rule ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Source |
| :------ | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :-----: |
| Alignment | Tendency to align with neighbors | Range (zoo) | Variable (conceptual) | Length | Explicit | Key parameter varied in model. | Box 1 |
| Quorum | Non-linear response to neighbor number | Threshold | Qualitative ('a quorum') | Individuals | Explicit | Explicit concept, specific value varies. | Section: Feedback... |
| Pheromone Following | Bias towards stronger trails | Following Probability | f(Concentration) | Probability | Explicit | Qualitative description of mechanism. | Section: Collective cognition... |
| Tandem Recruitment | Slow one-to-one leading | Recruitment Rate | ~1/3 of carrying | Rate | Explicit | Compared to carrying rate. | Section: Finding a new home |
| Contact Activation | Excitation by active neighbors | Activation Threshold | Qualitative ('above a threshold') | Inputs/Time | Explicit | Analogous to neuronal threshold. | Box 2 |

### **4.6. Globally Emergent Order and Order Parameters**
* **Vector ID:** M4.6
* **Vector Type:** Table
*   Table:
| Property ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Protocol | Source |
| :---------- | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :------: | :-----: |
| Polarity | Group alignment | Polarization Vector Magnitude | 0 (swarm) to ~1 (polarized) | Dimensionless | Explicit | Implied by descriptions of swarm vs polarized group. | Simulation (Box 1) | Box 1 |
| Consensus | Agreement on direction | % Choosing Majority | High (approaching 100%) | % | Explicit | Result of consensus model simulation. | Simulation (Fig 1a) | Fig 1a, Ref [31] |
| Trail Efficiency | Path selection | Path Length Chosen | Converges to shortest | Length | Explicit | Outcome of stigmergy models/experiments. | Experiment/Model | Section: Collective cognition... |
| Activity Rhythm | Synchronized activity | Period | ~20 | min | Explicit | Measured from ant colony activity. | Experiment (Box 2) | Box 2, Fig I |

### **4.7 Yoneda Embedding and Local-to-Global Mapping Fidelity**

*   **Vector ID:** M4.7
*   **Vector Type:** Table
    *   Content: N/A. The paper does not employ Category Theory or Yoneda Embedding concepts to analyze the local-to-global mapping. While it discusses how local rules *lead* to global order, it doesn't formalize this mapping in CT terms or assess its fidelity using related metrics.
    *   **Yoneda Embedding Fulfillment Score [0-10]:** N/A
    *   **Metrics:** N/A
    *   **Justification:** N/A (Concepts not used in the paper).

## M5: Computation
*   **Vector ID:** M5
*   **Vector Type:** Computation

### **5.1 Embodied Computation Presence:**

*   **Vector ID:** M5.1
*   **Vector Type:** Binary
    *   Content: Yes (by analogy)
    *   Justification: The paper argues that collective decision-making processes in animal groups perform computations (e.g., selecting the best option, integrating information, finding shortest paths). This computation is 'embodied' in the sense that it arises from the physical interactions and dynamics of the individuals within the group and their environment (e.g., pheromone landscape), rather than being executed by a central controller or abstract algorithm separate from the physical system. Examples include consensus decision-making (analogous to winner-takes-all in neural circuits) and shortest path finding by ants (emerging from trail dynamics).
    *    Implicit/Explicit: Mixed
        *  Justification: The paper explicitly draws analogies to computation and information processing in cognitive science and neuroscience. The term "embodied computation" isn't used, but the concept of computation arising from the system's physical dynamics is strongly implied and argued through these analogies. The "Yes" is based on interpreting the described collective processes *as* embodied computation.

**(Conditional: If M5.1 is "No", skip to Module 6. If "Yes", include M5.2-5.4)**

### **5.2 Computation Type:**

*   **Vector ID:** M5.2
*   **Vector Type:** Classification
    *   Content: Analog / Neuromorphic / Other (Distributed Collective Computation)
    *   CT-GIN Mapping: Defines the `ComputationNode` type. Attributes: `computationStyle`: Analog, Distributed, Collective.
    *    Implicit/Explicit: Mixed
    *    Justification: The processes described involve continuous interactions (movement, pheromone levels) and threshold-like dynamics (quorum sensing), suggesting analog components. The explicit comparisons to neural systems (information integration, competition, waves, oscillations) support a 'Neuromorphic' analogy. The computation is inherently distributed across the collective.

### **5.3 Computational Primitive:**

*   **Vector ID:** M5.3
*   **Vector Type:** Function
    *   Content:
        *   **Information Integration/Averaging:** Combining noisy individual estimates or preferences (e.g., fish integrating personal/social info, pigeons averaging routes below conflict threshold).
        *   **Thresholding/Quorum Sensing:** Switching behavior based on a threshold number/density of neighbors exhibiting a certain state/action (e.g., fish copying, ants switching recruitment, bees committing to site).
        *   **Competition/Winner-Takes-All:** Selecting one option among alternatives through feedback dynamics (e.g., consensus decision above conflict threshold in groups/pigeons, selection of best/shortest ant trail via reinforcement/decay).
        *   **Signal Amplification:** Positive feedback enhances signals (e.g., turning waves, trail reinforcement).
        *   **Signal Damping/Negative Feedback:** Mechanisms limit amplification or decay signals (e.g., pheromone evaporation, ant refractory periods).
    *   **Sub-Type (if applicable):** N/A
    *   CT-GIN Mapping: Defines the primary function of the `ComputationNode`. Functions: `InformationIntegration`, `Thresholding`, `Competition`, `Amplification`, `Damping`.
    *   Implicit/Explicit: Explicit
    * Justification: These computational operations (integration, thresholding, competition, amplification, damping/feedback) are explicitly discussed as mechanisms underlying collective behavior and decision-making throughout the text and boxes.

### **5.4 Embodied Computational Units**
* **Vector ID:** M5.4
* **Vector Type:** Table
*   Table: N/A
    | Unit ID | Description | Processing Power | Energy/Operation | Freq/Resp. Time | Bit-Depth | Data Source | Implicit/Explicit | Justification |
    | :------ | :---------- | :--------------- | :--------------- | :--------------: | :-------: | :----------: |:-----------------:| :-----------------:|
    | N/A     | Individual animal acting within local rules | N/A | N/A | Response timescales vary (see M6.1) | N/A (Analog implied) | Paper Text | Implicit | Individuals are the units, but their computational specs are not defined in these terms. |

## M6: Temporal Dynamics
*   **Vector ID:** M6
*   **Vector Type:** Temporal

### **6.1 Timescales:**

*   **Vector ID:** M6.1
*   **Vector Type:** ParameterTable
    *   Table:
        | Timescale Description | Value | Units | Source | Implicit/Explicit | Justification |
        | :-------------------- | :---: | :---: | :----: | :----------------: | :------------: |
        | Individual Reaction Time | Implicitly Fast | ms - s | General Biology | Implicit | Needed for coordination, but not quantified. |
        | Wave Propagation Speed | Qualitative ('rapid') | Distance / Time | Section: Amplification... | Explicit | Mentioned for turning waves. |
        | Decision Time (Speed-Accuracy Trade-off) | Variable | Time | Section: Feedback... | Explicit | Central concept discussed. |
        | Pheromone Decay Time | Variable (Tunable) | Time | Section: Collective cognition... | Explicit | Different volatilities give different timescales. |
        | Ant Nest Activity Rhythm Period | ~20 | min | Box 2, Fig I | Explicit | Measured period. |
        | Recruitment Time (Ants - Tandem) | Slow | Time | Section: Finding a new home | Explicit | Relative description. |
        | Recruitment Time (Ants - Carrying) | ~3x Faster than Tandem | Time | Section: Finding a new home | Explicit | Relative description. |
        | Bee Dance Duration | Proportional to Quality | Time | Section: Finding a new home | Explicit | Qualitative relationship. |

### **6.2 Active Inference:**

*   **Vector ID:** M6.2
*   **Vector Type:** Assessment
    *   Content: Unclear / Partial
    *   Justification: The paper doesn't explicitly use the Active Inference framework. However, some concepts align partially:
        (1) *Prediction:* Implicitly, animals might predict neighbor movements based on local cues, but predictive internal models are not explicitly described. Ants using long-term trails might be seen as using a model of resource locations.
        (2) *Action Selection:* Animals clearly select actions (move, turn, follow trail, recruit) based on local information (neighbors, pheromones, quorum) and internal state/goals (find food, new nest, avoid predator). This action aims to achieve goals (maintain cohesion, reach resource), which *could* be framed as minimizing prediction error relative to a goal state, but isn't framed this way in the paper. Speed-accuracy trade-offs imply optimization.
        (3) *Internal Models:* Explicit internal models are not discussed. Pheromone trails act as an externalized environmental model. Hysteresis suggests a simple 'memory' of past state.
        Overall, while goal-directed behavior and adaptation exist, the formal structure of Active Inference (explicit predictive models, free energy minimization) is not invoked or demonstrated. The parallels drawn are more with general cognitive processes like decision-making and feedback control.
    *   Implicit/Explicit: Inferred
        *  Justification: This assessment requires interpreting the described behaviors through the lens of the Active Inference framework, which is external to the paper itself.
    *   **If Yes/Partial, provide examples of testable CT-GIN metrics that *could* be used to quantify active inference:** N/A (Content is Unclear/Partial, and the paper does not provide data suitable for such metrics).

## M7: Adaptation
*   **Vector ID:** M7
*   **Vector Type:** Adaptation

### **7.1 Adaptive Plasticity Presence:**

*   **Vector ID:** M7.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The paper describes several forms of adaptation:
        1.  **Behavioral Tuning:** Groups adaptively tune their collective response (e.g., speed vs. accuracy) based on context (e.g., urgency in ant nest selection modifies quorum thresholds and recruitment speed).
        2.  **Learning (Stigmergy):** Ant colonies 'learn' the locations of better/closer food sources or efficient paths through the reinforcement and decay dynamics of pheromone trails. The trail network adapts over time based on foraging success.
        3.  **Rule Adaptation (Implicit):** While not the focus, individual animals can learn and adapt their responses over their lifetime (e.g., learning routes, predator recognition), which would influence collective outcomes. The paper mentions pigeons learning homing routes. Tandem running in ants allows followers to learn the route.
    *    Implicit/Explicit: Explicit
        * Justification: Adaptive tuning of collective response, learning via pheromones, and individual route learning (pigeons, ants) are explicitly mentioned.

**(Conditional: If M7.1 is "No", skip to Module 8. If "Yes", include M7.2)**

### **7.2 Adaptation Mechanism:**

*   **Vector ID:** M7.2
*   **Vector Type:** Description
    *   Content:
        *   **Feedback Adjustment:** Collective adaptation often involves tuning the balance between positive and negative feedback (e.g., trail reinforcement vs. evaporation; recruitment amplification vs. limited pool of scouts). Urgency can shift parameters like quorum thresholds (Ants).
        *   **Stigmergic Learning:** Environmental modification (pheromone deposition) coupled with probabilistic response (trail following) and decay leads to reinforcement of successful behaviors/paths (analogous to reinforcement learning or Hebbian reinforcement). Quality influences deposition/recruitment strength.
        *   **Individual Learning:** Route learning in pigeons and ants involves individual cognitive processes (e.g., landmark navigation), not detailed in this review but mentioned as relevant.
    *   CT-GIN Mapping: Defines `AdaptationNode` type and potentially `Monad` edges. Mechanism types: `FeedbackTuning`, `StigmergicReinforcement`, `IndividualLearning` (less detailed). Adaptation nodes could be linked to `SystemNode` (collective tuning) or `MemoryNode`/Environment (stigmergy).
    *    Implicit/Explicit: Explicit
        *  Justification: The mechanisms of feedback adjustment (speed-accuracy, urgency effects) and stigmergic learning (trail dynamics) are explicitly described. Individual learning is mentioned but mechanisms aren't detailed.

## M8: Emergent Behaviors
*   **Vector ID:** M8
*   **Vector Type:** Behavior

### **8.1 Behavior Description:**</h3>

*   **Vector ID:** M8.1
*   **Vector Type:** Description
    *   Content: Coordinated Collective Motion (schooling, flocking, swarming); Collective Decision-Making (direction choice, site selection, foraging choices); Information Transfer and Amplification (e.g., predator detection waves); Collective Sensing (increased effective range); Efficient Collective Search/Exploitation (e.g., shortest path finding, focusing on best resources); Synchronization (e.g., ant activity cycles); Consensus Formation; Emergent Leadership.
    *   CT-GIN Mapping: Defines `BehaviorArchetypeNode`s. Types: `CollectiveMotion`, `ConsensusDecisionMaking`, `InformationCascade`, `CollectiveSensing`, `DistributedSearch`, `Synchronization`, `EmergentLeadership`.
    *    Implicit/Explicit: Explicit
       *  Justification: These behaviors are the primary focus of the review and are explicitly described throughout.

### **8.2 Behavior Robustness:**

*   **Vector ID:** M8.2
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The paper explicitly highlights the robustness of collective behaviors arising from distributed control based on local rules. "Because distributed coordination does not depend on a specific subset of individuals, groups are inherently robust to perturbation." (Section: Collective motion). This robustness applies to individual loss or error. Robustness to noise is implied by mechanisms that integrate information or use quorum thresholds to filter noise. However, systems can be sensitive to initial conditions or manipulation (e.g., informational cascades from arbitrary choices). The reliance on local rules provides inherent robustness compared to centralized control.
    *   Implicit/Explicit: Explicit
        *  Justification: The robustness due to distributed control is explicitly stated. Sensitivity to noise/cascades is also mentioned. The score reflects the strong emphasis on robustness as a key feature.
    *   CT-GIN Mapping: This score contributes to the reliability attributes of the `BehaviorArchetypeNode`.

### **8.3 CT-GIN Emergent Behavior Validation**

*    **Vector ID:** M8.3
*    **Vector Type:** Validation
     *  Content: The review cites validation methods from the primary literature (which are not fully detailed here). These include:
         *   **Computational Modeling/Simulation:** Used extensively to demonstrate how local rules generate global patterns (Box 1, Fig 1a). Model predictions are compared conceptually or quantitatively to real systems.
         *   **Experimental Observation & Quantification:** Field and lab studies observe and measure collective behaviors (e.g., fish schooling dynamics by Ward et al. [25, 26], pigeon navigation by Biro et al. [33], ant behavior by Pratt et al. [53, 58, 60]). Computer vision is mentioned for data collection [68-70].
         *   **Comparative Analysis:** Comparing behaviors across different species or contexts (e.g., ants vs. bees nest selection).
         *   **Analogy to Other Systems:** Comparing collective animal behavior to neural systems provides conceptual validation [Explicitly drawn analogy].
         Operational definitions are implicit in the models and experiments cited. Robustness is discussed as an emergent property validated by the distributed nature of control. Limitations are discussed, e.g., need for more kinematic data (Box 3).
     *   Implicit/Explicit: Mixed
    *   Justification: The types of validation methods (modeling, experiments) are explicitly mentioned or implied by the cited studies. The specific details of validation for each claim reside in the primary literature, making the validation depth implicit in the context of this review. The analogy to neural systems is explicit validation reasoning.

## M9: Cognitive Proximity
*   **Vector ID:** M9
*   **Vector Type:** Cognition

### **9.1 Cognitive Mapping:**

*   **Vector ID:** M9.1
*   **Vector Type:** Description
    *   Content: Yes, extensive mapping is central to the paper's thesis. The paper explicitly proposes that "important commonalities exist with the understanding of neuronal processes" and suggests considering collective behavior "in the framework of cognitive science." Specific analogies drawn include:
        *   Collective decision-making mechanisms sharing functional characteristics across species and with brain decision-making (Introduction, Section: Leadership...).
        *   Distributed control in groups analogous to decentralized coordination in neuronal assemblies (Section: Collective motion).
        *   Multistability in groups analogous to multistability in neural systems (memory storage, pattern recognition) (Section: Collective motion).
        *   Information amplification/damping via feedback in groups analogous to signal processing within/across neurons (action potentials, traveling waves) (Section: Amplification...).
        *   Speed-accuracy trade-offs in group decisions analogous to those in perceptual choices in the brain (Section: Feedback...). Non-linear/quorum responses in groups potentially analogous to threshold processes in neural decision circuits.
        *   Competition among options (e.g., ant trails, group direction choice) analogous to competition among neural groups (Section: Leadership..., Collective cognition...). Transition from averaging to winner-takes-all in groups matches findings in primate visual choice tasks.
        *   Ant activity rhythms analogous to synchronous firing/oscillations in neural networks (input selection, energy efficiency) (Box 2).
        *   Pheromone dynamics providing "working memory" and "selective attention" (Section: Collective cognition...).
        Limitations are implicitly acknowledged (e.g., mechanisms differ in detail, brain decisions may involve higher-level assessment circuits).
    *   CT-GIN Mapping: Defines `CognitiveMappingEdge`. Source: `BehaviorArchetypeNode` (e.g., `ConsensusDecisionMaking`, `CollectiveMotion`, `DistributedSearch`) or `ComputationNode` (e.g., `InformationIntegration`, `Competition`). Target: `CognitiveFunctionNode` (e.g., DecisionMaking, Memory, Attention, NeuralOscillation, InformationProcessing). Edge attributes: `analogyStrength` (High, based on paper's emphasis), `mechanismSimilarity` (Functional/Conceptual).
    *   Implicit/Explicit: Explicit
    * Justification: The paper explicitly and repeatedly draws these analogies between collective animal behavior and cognitive/neural processes. It's a core theme.

### **9.2 Cognitive Proximity Score:**

*   **Vector ID:** M9.2
*   **Vector Type:** Score
    *   Score: 3
    *   Justification: The paper describes systems exhibiting collective behaviors that function *analogously* to certain cognitive processes (Level 3: Reactive/Adaptive Autonomy with elements suggesting Level 4).
        *   **Level 1/2 (Responsivity):** Basic stimulus-response and simple adaptation are clearly present (e.g., individual reactions, trail following).
        *   **Level 3 (Reactive/Adaptive Autonomy):** Systems adapt collective behavior based on feedback and experience (speed-accuracy tuning, stigmergic learning). Behavior is complex but often emerges from relatively simple individual rules within a defined repertoire.
        *   **Level 4 (Goal-Directed/Model-Based):** Goal-directedness is evident (foraging, nest selection). The presence of true internal *models* is weak; stigmergic trails act as externalized environmental models. Consensus decisions might imply simple models of preference. The comparison to neural decision-making hints at this level, but the mechanisms are functionally analogous rather than identical or proven to involve internal world models in the same way.
        *   **Higher Levels (5-10):** Not supported. No evidence for relational, abstract, social (beyond simple interaction rules), or meta-cognitive processing is presented for the collective itself.
        The score of 3 reflects robust adaptive behavior emerging from local rules, with strong functional analogies to Level 4 processes, but lacking clear evidence for complex internal models or higher cognitive functions within the collective entity itself.
    *   Implicit/Explicit: Inferred
    *  Justification: The score is an interpretation based on applying the provided external scale (CT-GIN Cognizance Scale) to the behaviors explicitly described in the paper and the analogies drawn by the author.

### **9.3 Cognitive Function Checklist**

* **Vector ID:** M9.3
* **Vector Type:** Checklist
    *   | Cognitive Function               | Score (0-10) | Justification/Notes                                                                       | CT-GIN Mapping (if applicable) | Implicit/Explicit | Justification for Implicit/Explicit/Mixed |
    | :-------------------------------- | :----------: | :------------------------------------------------------------------------------------ | :--------------------------------: | :-----------------:|:-----------------:|
    | Sensing/Perception               |      6       | Collective sensing enhances individual capabilities (e.g., predator detection range). Distributed sensing via individuals. | `CollectiveSensing` BehaviorNode | Explicit          | Enhanced sensing explicitly discussed. |
    | Memory (Short-Term/Working)        |      4       | Hysteresis provides short-term state memory. Pheromones allow for tunable working memory (volatility). | `MemoryNode` (Hysteresis, StigmergicTrace) | Explicit          | Concepts explicitly discussed. |
    | Memory (Long-Term)                 |      3       | Persistent pheromone trails can provide longer-term spatial memory. Individual learning adds long-term memory. Mechanisms differ from cognitive long-term memory. | `MemoryNode` (StigmergicTrace), Implicit Individual Memory | Mixed             | Trail persistence explicit, individual learning mentioned. |
    | Learning/Adaptation              |      5       | Collective adaptation via feedback tuning. Stigmergic learning of optimal paths/sources. Individual learning contribution. | `AdaptationNode` (FeedbackTuning, StigmergicReinforcement) | Explicit          | Mechanisms explicitly discussed. |
    | Decision-Making/Planning          |      5       | Consensus decisions, speed-accuracy trade-offs, quorum sensing. Distributed decision-making. Planning ability is minimal/emergent (e.g., path finding). | `ConsensusDecisionMaking` BehaviorNode, `ComputationNode` | Explicit          | Decision mechanisms explicitly discussed. |
    | Communication/Social Interaction |      7       | Based on local interactions (visual, chemical cues). Implicit communication via environmental modification (stigmergy). Essential for collective behavior. | `AdjunctionEdge`s (Interaction rules) | Explicit          | Local interactions are the core mechanism. |
    | Goal-Directed Behavior            |      5       | Clear biological goals (survival, foraging, reproduction) drive collective actions. Behavior is adaptive towards these goals. | `SystemNode` (Purpose attribute) | Explicit          | Goal-oriented nature of behaviors is clear. |
    | Model-Based Reasoning              |      2       | Weak evidence. Stigmergic trails as external environmental models. No clear evidence of internal predictive models *at the collective level*. Analogy to neural models made. | `CognitiveMappingEdge` to ModelBasedReasoning | Inferred          | Inferred based on lack of evidence and nature of mechanisms. |
    | **Overall score**                 |     4.6       | Average score reflects strengths in adaptation, interaction, and decision-making analogies, but weaknesses in higher cognitive functions like model-based reasoning. |                                   |                     |                |

## M10: Criticality Assessment
*   **Vector ID:** M10
*   **Vector Type:** Criticality

### **10.1 Criticality:**

*   **Vector ID:** M10.1
*   **Vector Type:** Assessment
    *   Content: Unclear
    *   Justification: The paper mentions analogies to neuronal avalanches and self-organized criticality in neural networks (Refs [21, 22]) in the context of feedback balance and propagating activity (e.g., Box 2 description aligns conceptually). It also mentions sudden transitions between collective states (Box 1), which occur near critical parameter values in many models of collective behavior. However, the paper itself does not explicitly state or provide evidence (e.g., power-law distributions, long-range correlations) that the described animal groups operate *at* criticality as a general principle, although some cited work (e.g., [21, 22, 71]) explores these ideas. The connexion is suggestive rather than firmly established within this review.
        *   Critical Parameters (If Yes/Partial): N/A
        *   Evidence: Refs [21, 22, 71] cited; mention of sudden transitions (Box 1).
    *   Implicit/Explicit: Implicit
    *    Justification: The link is implied through citations and analogies, particularly concerning neural systems, but not explicitly claimed or evidenced for the animal groups within this specific text.

## M11: Review Paper Specifics (Conditional)

*   **Vector ID:** M11
*   **Vector Type:** Review

### **11.1 Literature Synthesis Quality:**

*   **Vector ID:** M11.1
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: The review effectively synthesizes literature on collective animal behavior, identifying common principles like local interactions, feedback (positive/negative), speed-accuracy trade-offs, and quorum sensing across diverse systems (fish, birds, ants, bees). It explicitly draws strong analogies to cognitive science and neuroscience, which aligns with identifying functional similarities (a CT-GIN relevant goal). However, it doesn't explicitly use CT or GIN terminology or frameworks. The synthesis focuses on functional parallels rather than a formal structural analysis applicable to GINs.
    *    Implicit/Explicit: Mixed
         *  Justification: The synthesis of biological principles is explicit. The quality assessment from a *CT-GIN perspective* is an implicit interpretation, noting the lack of explicit CT/GIN terminology.

### **11.2 Gap Identification:**

*   **Vector ID:** M11.2
*   **Vector Type:** Score
    *   Score: 6
    *   Justification: Box 3 explicitly lists "Questions for future research". Several gaps relevant to understanding the underlying mechanisms and dynamics are identified: need for kinematic data, understanding the role of individual complexity/heterogeneity, how rules are adopted, relationship between individual rules and emergent dynamics, mechanisms for balancing adaptation and robustness. These are relevant for building better CT-GIN models. However, the gaps are not framed specifically in CT-GIN terms (e.g., characterizing adjunctions, monads, functors).
    *   Implicit/Explicit: Explicit
        *  Justification: Gaps are explicitly listed in Box 3. Assessing their relevance to CT-GIN is an interpretation.

### **11.3 Future Directions:**

*   **Vector ID:** M11.3
*   **Vector Type:** Score
    *   Score: 6
    *   Justification: The questions in Box 3 implicitly point towards future research directions aimed at filling the identified gaps (e.g., collect kinematic data, model heterogeneity, investigate rule switching). The conclusion also advocates for integrated research using tools from cognitive science. These directions are valuable for advancing the field and could inform CT-GIN models. However, they are not formulated as specific CT-GIN-based research proposals (e.g., "Characterize the category of local interaction rules leading to consensus").
    *    Implicit/Explicit: Explicit
    *   Justification: Future research needs are explicitly laid out in Box 3 and the conclusion. Assessing their alignment with CT-GIN is an interpretation.

### **11.4 Review Paper CT-GIN Alignment Score**

*   **Vector ID:** M11.4
*   **Vector Type:** Score
    *   Score: 5
    *   Justification: The paper aligns conceptually with CT-GIN goals by focusing on mapping local interactions (micro-level) to global emergent behavior (macro-level) and identifying common functional patterns (analogies/isomorphisms) across different systems (biological collectives, neural systems). It emphasizes key concepts like feedback, memory (hysteresis/stigmergy), adaptation, and computation emerging from interactions. However, it lacks the formal mathematical structure of CT and the graph-based representation of GINs. The analogies, while insightful, are functional rather than formally structural. It provides rich source material for *building* CT-GIN models but doesn't use the framework itself.
    *    Implicit/Explicit: Inferred
        *  Justification: The score is based on interpreting the paper's content and approach through the lens of the CT-GIN framework, assessing conceptual overlap despite the absence of explicit CT/GIN methods.

## M12: Theoretical Paper Specifics (Conditional)

*   **Vector ID:** M12
*   **Vector Type:** Theory
    *   Content: N/A. The paper is a review, not primarily a theoretical proposal.

### **12.1 Theoretical Rigor:**

*   **Vector ID:** M12.1
*   **Vector Type:** Score
    *   Score: N/A

### **12.2 Realization Potential:**

*   **Vector ID:** M12.2
*   **Vector Type:** Score
    *   Score: N/A

### **12.3 Potential for Future CT-GIN Implementation Score**

* **Vector ID:** M12.3
*   **Vector Type:** Score
    *   Score: N/A

## M13: Overall Assessment & Scoring

*   **Vector ID:** M13
*   **Vector Type:** Overall

### **13.1 CT-GIN Readiness Score:**

*   **Vector ID:** M13.1
*   **Vector Type:** Score
*   **Calculated Score:** 4.5
    *   (Calculation: Average of M1.2(7), M3.2(4), M4.4(6), M8.2(8), M9.2(3). M2 scores are N/A=0, M5.1=Yes but subsequent scores relate to analogy -> Conceptual fit poor for material computation, not scored directly. M7.1=Yes, but mechanism score harder to assign numerically. Using available numeric scores representing clarity, predictability, robustness, cognitive proximity, and memory analogy directly gives (7+4+6+8+3)/5 = 5.6. If we include M5/M7 adaptation/computation analogy scores conceptually low (~3), average drops. If we include M11 scores (Review specifics) 7+6+6+5 = 24/4 = 6. A blended score acknowledging the good review quality but limited direct material applicability seems appropriate. Let's stick to core modules M1.2, M3.2, M4.4, M8.2, M9.2 -> (7+4+6+8+3)/5 = 5.6. Acknowledging N/A in M2 and weak fit M5, M7 lowers the *material* readiness. Let's use M1.2(7), M3.1(Y->M3.2=4), M4.1(Y->M4.4=6), M5.1(Y(analogy)->score=2), M7.1(Y->score=5), M8.2(8), M9.2(3) -> (7+4+6+2+5+8+3)/7 = 5.0. Rounded to 4.5 for conservatism due to analogical nature).

**CT-GIN Readiness Summary Table:**

| CT-GIN Aspect                   | Strength (Yes/Partial/No) | Key Supporting Metrics (with units) | Limitations (Missing Metrics/Data Gaps)                                           | Improvement Areas (Future Research)                                          |
| :------------------------------ | :-----------------------: | :-----------------------------------| :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| Energy Flow Efficiency          |            No             | N/A                                  | Paper does not address energy flow/efficiency.                                   | N/A (Outside paper's scope)                                                  |
| Memory Fidelity                 |          Partial          | Hysteresis (States); Stigmergy (Qualitative: Persistence/Capacity) | Lack of quantitative metrics (retention time, capacity, fidelity). Analogical memory types. | Quantify pheromone dynamics, model hysteresis effects rigorously.             |
| Organizational Complexity       |            Yes            | Emergent states (Polarized, Torus, Swarm); Consensus dynamics; Activity waves. | Quantitative order parameters often missing in review; Predictability affected by stochasticity. | Develop better order parameters; quantify local-global predictability.          |
| Embodied Computation            |       Partial (Analogy)    | Functional analogies (Integration, Thresholding, Competition). | Lacks material computation; analogies are functional, not mechanistic for materials. Computational power/efficiency not quantified. | Develop material systems mimicking these functions; quantify computation. |
| Temporal Integration            |            Yes            | Multiple timescales identified (Reaction, Decay, Decision, Rhythm). | Lack of precise quantification for many timescales; Speed-accuracy trade-off qualitatively described. | Measure propagation speeds, decision times, decay rates accurately.           |
| Adaptive Plasticity             |            Yes            | Feedback tuning; Stigmergic learning; Individual learning mentioned. | Mechanisms described qualitatively; adaptation rates/limits not quantified.      | Quantify adaptation dynamics; model interplay of collective/individual learning. |
| Functional Universality         |          Partial          | Common principles across species identified; analogies to neural systems drawn. | Focus on specific biological examples; universality claims are conceptual/functional. | Formalize commonalities using CT; test principles in different contexts (e.g., robotics). |
| Cognitive Proximity            |          Partial          | Strong analogies drawn (Decision-Making, Memory, Attention). | Analogies primarily functional; lacks higher cognitive functions/internal models at collective level. | Develop systems with more direct cognitive mappings; test for model-based reasoning. |
| Design Scalability & Robustness |            Yes            | Robustness via distributed control highlighted. Scalability inherent in collective systems. | Robustness limits not fully quantified; scalability factors (communication range, density) not analyzed in depth. | Quantify robustness boundaries; analyze scalability limits.                  |
| **Overall CT-GIN Readiness Score** |        **4.5**        |   | Primary limitation: Biological system, not material intelligence system. Many metrics N/A or qualitative. | Translate principles to material systems; quantify dynamics and information flow. |

### **13.2 Qualitative CT-GIN Assessment Conclusion:**

*   **Vector ID:** M13.2
*   **Vector Type:** Textual Summary
    *   Content: This review provides a strong synthesis of principles underlying collective behavior in animal groups, emphasizing emergence from local interactions, feedback, adaptation, and information processing. Its key strength, from a CT-GIN perspective, lies in explicitly drawing functional analogies between these collective biological processes and cognitive/neural computations (decision-making, memory, attention, synchronization), highlighting potential universal principles of distributed intelligence. The paper clearly discusses concepts relevant to CT-GIN like self-organization, emergent order, memory (hysteresis, stigmergy), adaptation, and robustness via distributed control. However, its primary limitation for direct CT-GIN application to *material intelligence* is its biological focus. Energy flow, material memory mechanisms, and embodied computation in a physical material substrate are not addressed. Metrics are often qualitative or based on cited works rather than quantified within the review. While rich in conceptual inspiration for designing cognizant matter, the paper describes biological systems whose mapping to CT-GIN nodes/edges intended for materials science is largely analogical rather than direct. Overall, it serves as an excellent source of bio-inspired principles but has low direct readiness for CT-GIN *material* analysis due to the domain mismatch.

### **13.3 CT-GIN Refinement Directions:**

*   **Vector ID:** M13.3
*   **Vector Type:** Recommendations
    *   Content:
        *   **Formalize Analogies:** Use CT to formally describe the functional isomorphisms suggested between collective behavior, neural computation, and cognitive processes.
        *   **Quantify Dynamics:** Pursue research identified in Box 3, focusing on obtaining quantitative kinematic data and interaction parameters for real animal groups to enable more rigorous modeling.
        *   **Develop Material Mimics:** Design and implement physical/material systems (e.g., robotic swarms, active matter, chemical systems) that explicitly embody the principles discussed (quorum sensing, stigmergy, feedback control, hysteresis) and quantify their performance using CT-GIN metrics.
        *   **Model Information Flow:** Use GINs or related graph methods to explicitly model the flow of information through the collective network (individuals as nodes, interactions as edges) and relate network structure/dynamics to computational capabilities (e.g., information integration, decision accuracy).
        *   **Integrate Energy:** Incorporate thermodynamic considerations into models of collective behavior to understand energy costs, efficiency, and constraints, bridging the gap with material systems.
        *   **Explore Heterogeneity:** Investigate the role of individual differences (informational status, motivation, physical properties) on collective computation and adaptation, mapping this to GIN node attributes.

## M14: CT-GIN Knowledge Graph

*   **Vector ID:** M14
*   **Vector Type:** Visualization

### **14.1. CT-GIN Knowledge Graph:**
* **Content:** N/A. A CT-GIN Knowledge Graph focused on *material intelligence* cannot be meaningfully constructed based *solely* on this review paper, as the system described is biological. A graph could be constructed representing the *biological* principles and their relationships (e.g., Local Rules -> Collective Motion; Quorum Sensing -> Decision Making; Pheromones -> Stigmergic Memory -> Foraging Behavior; Feedback -> Adaptation), potentially using the CT-GIN node/edge types analogically, but this would not represent a material system analysis as intended by the template.

## M15: Relationship Vectors
*   **Vector ID:** M15
*   **Vector Type:** Relationships
*   Relationships: N/A (This section typically links vectors *within* a knowledge graph representation, which is not fully applicable here).

## M16: CT-GIN Template Self-Improvement Insights

*   **Vector ID:** M16
*   **Vector Type:** Feedback

### **Template Feedback:**

*    **Vector ID:** M16.1
*   **Vector Type:** Text
Provide specific, actionable feedback on the *CT-GIN template itself*, based on this analysis:
    *   **Missing Probes:** The template is heavily geared towards physical material systems. If intended to cover bio-inspired intelligence from biological systems (like this paper), probes specifically addressing biological mechanisms (e.g., signaling pathways, genetic vs. learned rules, evolutionary context) might be needed, or a separate template branch developed. M9 (Cognition) is good but assumes a system to map *from*.
    *   **Unclear Definitions:** The definition of "Embodied Computation" (M5.1) could be clarified regarding its application to biological systems where computation is inherent but via different substrates (neural/chemical vs. material physics). "Memory" (M3) could explicitly differentiate between internal cognitive memory, material state memory, and externalized/environmental memory (like stigmergy).
    *   **Unclear Node/Edge Representations:** Mapping biological interactions (e.g., quorum sensing based on visual cues) or stigmergy onto edges designed for material interactions felt forced. Guidance on representing information flow vs. physical forces vs. chemical signals in biological contexts would be helpful. Clarifying if `AdjunctionEdge` encompasses information exchange vs. physical interaction.
    *   **Scoring Difficulties:** Scoring was difficult due to the domain mismatch. Many scores were N/A or required heavy inference/analogy (marked as "Inferred" or justified based on analogy). The Cognitive Proximity Score (M9.2) relies heavily on interpreting the external Cognizance Scale relative to described behaviors, which is subjective. The Cognitive Function Checklist (M9.3) required similar interpretation. CT-GIN Readiness Score calculation needs clearer rules for handling N/A or analogical fits.
    *   **Data Extraction/Output Mapping:** Extracting information was straightforward as the review is well-structured. Mapping it to the template was challenging due to the material focus (especially M2, M5, parts of M3). Distinguishing "Implicit" vs. "Inferred" was sometimes difficult when applying a material concept to a biological description.
    *   **Overall Usability:** The template is very detailed and structured, which is good for consistency. However, its strong material bias makes it cumbersome and yields many N/A sections when applied to purely biological collective intelligence reviews like this one.
    * **Specific Suggestions:**
        *   Consider adding a "System Domain" (e.g., Material, Biological, Computational, Hybrid) selector at the beginning that conditionally displays/emphasizes relevant modules (e.g., de-emphasize M2 for purely computational/biological reviews).
        *   Refine definitions in M3 (Memory) and M5 (Computation) to better accommodate non-material substrates or clearly state the focus is *only* material embodiment.
        *   Provide clearer guidance or examples for CT-GIN mapping in biological contexts if intended to be covered.
        *   Refine the calculation method for the CT-GIN Readiness Score (M13.1) to handle N/A values more systematically and potentially weight modules based on relevance to the system domain.
        *   Clarify the scope of "Implicit" vs. "Inferred" - perhaps "Inferred" should be used when applying a concept from the template's framework that isn't present in the paper's own framing.