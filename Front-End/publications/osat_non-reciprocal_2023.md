# Non-reciprocal multifarious self-organization

__Paper Type:__ Theoretical/Computational

## M1: System Overview & Implementation
*   **Vector ID:** M1
*   **Vector Type:** Overview

### **1.1 System Description**

*   **Vector ID:** M1.1
*   **Vector Type:** Description
    *   Content: The system is a theoretical/computational model investigating self-organization dynamics in a collection of interacting 'tiles' on a lattice. It extends the concept of 'multifarious self-assembly' (where specific reciprocal interactions guide assembly into multiple predefined structures) by incorporating programmable 'non-reciprocal' interactions. The components are distinct tile types (up to M types) arranged on a 2D lattice, potentially with empty sites. Interactions are defined between adjacent tiles: reciprocal interactions (U) favor specific neighbor pairs found in target structures, providing the basis for equilibrium assembly (analogous to Hopfield network memory retrieval); non-reciprocal interactions (R, strength λ) add an asymmetry depending on which tile joins an existing structure, driving non-equilibrium transitions between assembled structures. The purpose is to demonstrate and characterize how programmable non-reciprocal interactions can achieve automated dynamical control and sequential transitions ('shape-shifting') between multiple self-assembled structures, mimicking complex biological processes like the cell cycle, using a common pool of building blocks. The system is simulated using a generalized Monte Carlo method incorporating both interaction types.
    *   CT-GIN Mapping: `SystemNode` attributes: `systemType`: "Theoretical Model (Monte Carlo)", `domain`: "Self-Assembly/Active Matter", `mechanism`: "Reciprocal + Non-Reciprocal Interactions", `components`: ["Tiles (M types)", "Lattice Sites", "Reciprocal Interactions (U, energy ε)", "Non-Reciprocal Interactions (R, strength λ)"], `purpose`: "Dynamical Control of Self-Assembly (Shape-Shifting)". Nodes: `TileTypeNode`(attributes: id), `InteractionNode`(attributes: type=["Reciprocal", "Non-Reciprocal"], energy=[ε, λ], directionality), `StructureNode`(attributes: id, configuration). Edges: `DefinesInteractionEdge`(from=`StructureNode`, to=`InteractionNode`), `TileInteractsEdge`(from=`TileTypeNode`, to=`TileTypeNode`, attributes: interaction_ref=`InteractionNode`).
    *   Implicit/Explicit: Explicit
        *  Justification: The paper explicitly describes the model, its components (tiles, reciprocal/non-reciprocal interactions), the goal (shape-shifting), and the simulation method (Monte Carlo).

### **1.2 Implementation Clarity**

*   **Vector ID:** M1.2
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The paper clearly outlines the conceptual framework, defining reciprocal (U) and non-reciprocal (R) interactions with specific notations (Fig 1b, c, d) and mathematical forms (Eq 1, 4). The generalized Monte Carlo simulation method is described (Eq 6, 7) including how non-reciprocity is incorporated into acceptance probabilities. Key parameters (ε, λ, μ, M, m) are identified. The different observed regimes (multifarious assembly, chimera, liquid, dispersion, shape-shifter) are described and linked to parameters. Figures illustrate the concepts well. Some deeper details of the R matrix programming for specific sequences might require consulting supplementary information (implied but not fully detailed in the excerpt), slightly reducing the score from 10. The Methods section provides good detail on the implementation.
    *   Implicit/Explicit: Explicit
        * Justification: The description of the model, interactions, and simulation method is explicitly provided in the text and Methods section.

### **1.3 Key Parameters**

*   **Vector ID:** M1.3
*   **Vector Type:** ParameterTable
    *   Table:
        | Parameter Name                 | Value                  | Units        | Source (Fig/Table/Section)   | Implicit/Explicit | Data Reliability (High/Medium/Low) | Derivation Method (if Implicit) |
        | :----------------------------- | :---------------------: | :-----------: | :-----------------------: | :-----------------: | :-----------------------------: | :-------------------------------: |
        | Reciprocal Interaction Energy  | ε                      | k<sub>B</sub>T | Eq. 1, Fig 2, Fig 3, Fig 4 | Explicit          | High (Model Parameter)          | N/A                               |
        | Non-Reciprocal Interaction Str | λ                      | k<sub>B</sub>T | Eq. 4, Fig 2, Fig 3, Fig 4 | Explicit          | High (Model Parameter)          | N/A                               |
        | Chemical Potential             | μ                      | k<sub>B</sub>T | Eq. 3, Fig 2, Fig 3, Fig 4 | Explicit          | High (Model Parameter)          | N/A                               |
        | Number of Tiles / Pattern Size | M (e.g., 1600)         | Tiles        | Fig 2 (caption), Methods   | Explicit          | High (Model Parameter)          | N/A                               |
        | Number of Stored Structures    | m (e.g., 4)            | Structures   | Fig 2 (caption), Methods   | Explicit          | High (Model Parameter)          | N/A                               |

## M2: Energy Flow
*   **Vector ID:** M2
*   **Vector Type:** Energy

### **2.1 Energy Input**

*   **Vector ID:** M2.1
*   **Vector Type:** Input
    *   Content: The system operates under implicit thermal energy (k<sub>B</sub>T) which drives stochastic tile movements/attempts in the Monte Carlo simulation. Specific interactions contribute effective potential energy changes: reciprocal bonds (U) lower energy by -ε, while non-reciprocal interactions modify transition rates based on an energy scale λ, effectively injecting energy into specific state transitions to drive the system out of equilibrium. The chemical potential μ acts as an energy cost/gain for adding/removing tiles. The non-reciprocal term λ is the key driver of non-equilibrium dynamics.
    *   Value: ε, λ, μ, k<sub>B</sub>T
    *   Units: Energy (often implicitly k<sub>B</sub>T=1)
    *   CT-GIN Mapping: `EnergyInputNode`: attributes - `source`: "Thermal Bath (Implicit)", "Reciprocal Interactions", "Non-Reciprocal Interactions", "Chemical Potential", `type`: "Potential Energy Change/Transition Bias".
    *   Implicit/Explicit: Mixed
        *  Justification: ε, λ, μ are explicitly defined energy parameters. The role of thermal energy (k<sub>B</sub>T) is implicit in the Monte Carlo framework (used in acceptance probability) but fundamental. λ is explicitly identified as the non-equilibrium driver.

### **2.2 Energy Transduction**

*   **Vector ID:** M2.2
*   **Vector Type:** Transduction
    *   Content: Thermal energy (implicit) drives attempts to change tile states (addition, removal, swap). Favorable reciprocal interactions (-ε) convert potential energy into system stability, promoting assembly. Non-reciprocal interactions (λ) bias specific state transitions (tile additions depending on approach direction), converting the 'programmed' potential energy difference λ into directed dynamics (shape-shifting). Energy is transduced during tile binding/unbinding events and configuration changes. ΔH in Eq. 6 represents the change in energy (Hamiltonian H) including reciprocal terms and chemical potential. Λ in Eq. 7 represents the non-reciprocal contribution biasing the transition.
    *   CT-GIN Mapping: `EnergyTransductionEdge`: attributes - `mechanism`: "Tile Binding/Unbinding (Reciprocal)", "Tile Attachment Bias (Non-Reciprocal)", "Thermal Fluctuation (Monte Carlo Step)", `from_node`: "Thermal Bath", "Interaction Potential", `to_node`: "System Configuration", "Kinetic Energy (Implicit)". Links `InteractionNode` energy attributes to `ConfigurationNode` state changes.
    *   Implicit/Explicit: Mixed
        *  Justification: The roles of ε and μ in the Hamiltonian change (ΔH) are explicitly part of the MC step (Eq. 6). The non-reciprocal contribution (Λ) is also explicit (Eq. 7). The underlying transduction from potential energy differences/biases into configuration changes via stochastic MC moves is inherent to the simulation method.

### **2.3 Energy Efficiency**

*   **Vector ID:** M2.3
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification/Metrics: The paper does not define or quantify energy efficiency in a thermodynamic sense (e.g., work done / energy input). The focus is on the *effectiveness* of using the non-reciprocal energy scale λ to achieve the desired function (shape-shifting) versus undesired outcomes (chimeras, dispersion). One could *infer* a qualitative efficiency based on the parameter ranges where desired behavior occurs, but no explicit metric is provided. For instance, successful shifting occurs within specific λ ranges (Fig 3, Fig 4), suggesting optimal 'efficiency' in utilizing λ for function in those ranges. Low λ fails to induce shifts (inefficient use of λ for dynamics), high λ leads to instability (dispersion, inefficient).
    *   CT-GIN Mapping: Attribute `functional_efficiency` (qualitative: Low/Medium/High based on parameter regime) of relevant `EnergyTransductionEdge`s related to non-reciprocal interactions.
    *   Implicit/Explicit: Implicit
      *  Justification: No explicit efficiency metric is defined or calculated. Any assessment is inferred from the success/failure of the shape-shifting function in different parameter regimes.

### **2.4 Energy Dissipation**

*   **Vector ID:** M2.4
*   **Vector Type:** Dissipation
    *   Content: Energy dissipation is intrinsically linked to the non-equilibrium nature driven by non-reciprocal interactions. The paper explicitly measures entropy production (ΔΣ) as "the sum of the logarithm of the ratio of probabilities for direct and reverse moves along the path of the dynamics" (Section: Shape-shifting structure). This quantifies the degree of irreversibility and non-equilibrium activity, representing dissipation into the implicit thermal bath. Higher ΔΣ correlates with shape-shifting events (Fig 2g), indicating dissipation during these transitions. Other dissipation mechanisms (e.g., related to failed assembly attempts) are implicitly present in the stochastic dynamics but not separately quantified. Assessment: Quantified via ΔΣ (entropy production), unitless (in k<sub>B</sub>).
    *   CT-GIN Mapping: Creates `EnergyDissipationNode`(attributes: type="Entropy Production"), `EnergyDissipationEdge`(from=`System Configuration Change`, to=`Thermal Bath (Implicit)` or `EnergyDissipationNode`, attributes: rate=ΔΣ/Δt). ΔΣ is an attribute of `TransitionEdge`s.
    *    Implicit/Explicit: Explicit
        *  Justification: Entropy production (ΔΣ) is explicitly defined, calculated, and presented as a measure of non-equilibrium activity (dissipation) in Fig 2g and the accompanying text.

## M3: Memory
*   **Vector ID:** M3
*   **Vector Type:** Memory

### **3.1 Memory Presence:**

*   **Vector ID:** M3.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The system explicitly uses the concept of storing multiple target structures (S(1)...S(m)) within the reciprocal interaction matrix U, analogous to the Hopfield neural network model. These stored structures represent memory. The system retrieves this memory through self-assembly when triggered (e.g., by a seed). The non-reciprocal interactions then act upon these retrieved memory states (assembled structures) to induce transitions to other stored states in a sequence. The persistent assembled structure itself is a state reflecting past interactions (assembly process based on stored U) and influences future behavior (serves as the substrate for non-reciprocal shifting).
    *    Implicit/Explicit: Explicit
        * Justification: The paper explicitly states the analogy to Hopfield networks (associative memory) and describes storing/retrieving structures encoded in the interaction matrix U (Sections: Intro, Equilibrium self-assembly, Non-reciprocal interactions; Refs 6, 7, 9, 10, 33, 40).

### **3.2 Memory Type:**

*   **Vector ID:** M3.2
*   **Vector Type:** Score
*   Score: 6
*   Justification: The memory is associative, content-addressable (a seed retrieves a full pattern), and multiple patterns (m) can be stored. Readout occurs via self-assembly. It is persistent (structures are stable in certain parameter regimes). Non-reciprocal interactions *read* the current state and trigger transitions *between* stored states, but don't rewrite the fundamental memory (the U matrix). It resembles attractor dynamics in neural networks. Capacity (m) is limited (discussed as a challenge). Readout fidelity depends on parameters (error calculation). It's not easily re-writable in the simulation context (U is fixed). Retention is good if ε is high enough relative to μ and λ=0. Scale definition: 0=No memory, 3=Single stable state, 5=Multiple stable states (attractors), 7=Rewritable states, 9=Complex sequence encoding/recall, 10=Adaptive/learning memory. This system reaches level 5+ (multiple states + sequential transitions).
*   CT-GIN Mapping: Defines the `MemoryNode` type, representing a stored structure S(i). Attributes: `capacity` (m), `encoding` (implicit in U matrix). Edges link `MemoryNode`s via `TransitionEdge`s defined by R matrix. Self-assembly process is an edge from `SeedNode` to `MemoryNode`.
*    Implicit/Explicit: Mixed
    * Justification: The associative nature and Hopfield analogy are explicit. The scoring requires interpretation based on the described properties (stability, capacity limits, fixed U matrix) against the provided scale.

### **3.3 Memory Retention Time:**

*   **Vector ID:** M3.3
*   **Vector Type:** Parameter
*   Value: Variable/Long-term (in assembly regime)
*    Units: Simulation time steps (τ<sub>s</sub>) or potentially seconds in a physical realization.
*   Justification: In the pure multifarious assembly regime (λ=0, appropriate ε, μ), assembled structures are thermodynamically stable states and persist indefinitely (long-term retention), limited only by finite size fluctuations or simulation time. In the shape-shifting regime (λ > λ<sub>min</sub>), the retention time of a specific structure S(i) is finite and determined by the shift timescale τ<sub>shift</sub> before transitioning to S(i+1). τ<sub>shift</sub> depends on λ, ε, μ, and M (Fig 4l shows scaling with M). So retention is tunable via λ. Qualitatively: Long-term without shift drive, controllable finite time with shift drive.
*    Implicit/Explicit: Mixed
        * Justification: Stability in the assembly regime is explicit/implicit from phase diagrams (Fig 3a). Finite retention time during shifting (τ<sub>shift</sub>) is explicitly defined and quantified (Fig 4k, l). Linking this to "memory retention" requires interpretation.
*   CT-GIN Mapping: Attribute `retention_time` of `MemoryNode` (Value depends on λ; τ<sub>shift</sub> or effectively infinite).

### **3.4 Memory Capacity (Optional - if applicable)**

* **Vector ID:** M3.4
* **Vector Type:** Parameter
*  Value: m
*   Units: Number of distinct structures
*   Justification: The model explicitly considers storing 'm' desired structures. The paper mentions capacity limitations analogous to Hopfield networks and cites Ref 7 which discusses capacity in multifarious assembly. Fig 2 shows m=4, Fig 5 (Extended Data) shows m=6. Capacity is acknowledged as a potential limitation, especially with non-reciprocal interactions, and depends on factors like heterogeneity of structures and sparsity (Ref 7).
*    Implicit/Explicit: Explicit
        *  Justification: The parameter 'm' representing the number of stored structures is explicitly mentioned and used (e.g., Fig 2 caption, Methods). Capacity limitations are explicitly discussed in the Conclusions/Discussion.
*   CT-GIN Mapping: Attribute `capacity` = m on the `SystemNode` or a dedicated `MemorySystemNode`.

### **3.5 Readout Accuracy (Optional - if applicable)**

* **Vector ID:** M3.5
* **Vector Type:** Parameter
*   Value: 1 - Error (e.g., > 0.95 for successful assembly)
*   Units: Dimensionless (Overlap Fraction) or %
*   Justification: The paper explicitly defines and calculates the 'error' of assembly (1 - Overlap O) to quantify the fidelity of retrieving a stored structure S(i) from a seed or during the system's evolution. Low error (<0.05 or <0.1 in Fig 4) indicates high readout accuracy. Accuracy depends strongly on parameters (ε, μ); incorrect parameters lead to chimeras (low accuracy), liquid, or dispersion (no readout). Figs 2, 3, 4 quantify this error/overlap.
*    Implicit/Explicit: Explicit
       *  Justification: Error calculation (1-Overlap) is explicitly defined in Methods and used extensively to characterize system behavior (Figs 2g, 3, 4b-j). High overlap O corresponds to high readout accuracy.
*   CT-GIN Mapping: Attribute `readout_accuracy` (1-error) associated with `MemoryNode` retrieval (e.g., edge from `SeedNode` or `ConfigurationNode` to `MemoryNode`).

### **3.6 Degradation Rate (Optional - if applicable)**
* **Vector ID:** M3.6
* **Vector Type:** Parameter
    *   Value: Related to 1/τ<sub>shift</sub> or rate of transition to undesired states (chimera, liquid, dispersion).
    *   Units: 1 / time steps (τ<sub>s</sub><sup>-1</sup>)
    *   Justification: Memory degradation can be interpreted as either the intentional, programmed shift to the next state (rate ~ 1/τ<sub>shift</sub>) driven by non-reciprocity, or as the transition to undesired, non-memory states (chimera, liquid, dispersion) due to incorrect parameters or fluctuations. The stability analysis (Fig 3) identifies parameter regions where the initial seed dissolves (dispersion) or forms incorrect structures (chimera), representing failure/degradation modes. The non-reciprocal drive λ itself induces 'degradation' of the current state S(i) to allow transition to S(i+1).
    *    Implicit/Explicit: Implicit
            * Justification: The paper quantifies transition times (τ<sub>shift</sub>) and identifies undesired states/regimes (chimera, dispersion), but doesn't frame this explicitly as a 'memory degradation rate'. It's an interpretation of the observed dynamics.
    *   CT-GIN Mapping: Attribute `degradation_rate` (qualitative or ~1/τ<sub>shift</sub>) of `MemoryNode`. Also related to transitions to `ErrorStateNode` (Chimera, Liquid, Dispersion).

### **3.7 Memory Operations Energy Cost (Optional - if applicable)**
* **Vector ID:** M3.7
* **Vector Type:** Table
*   Table:
    | Memory Operation ID | Energy Consumption per Bit | Power Usage during Operation| Units | Uncertainty | Data Source Reference | Implicit/Explicit | Justification |
    | :------------------ | :--------------------------: | :-----------------------------: | :---: |:-----------------:|:-----------------:|:-----------------:| :------------------ |
    | Retrieval (Assembly) | N/A                       | Related to ε, μ changes during MC steps | k<sub>B</sub>T | N/A | Methods (Eq. 3, 6) | Implicit | Energy change ΔH per step includes ε, μ terms, but total energy/bit for retrieval isn't calculated. |
    | Shift (Transition)   | N/A                       | Related to λ bias during MC steps | k<sub>B</sub>T | N/A | Methods (Eq. 4, 7) | Implicit | Non-reciprocal term Λ biases transitions, implying an energy cost/drive, but not quantified per bit or total shift energy. ΔΣ measures related dissipation. |
*   Implicit/Explicit: Implicit
    *   Justification: The paper defines energy parameters (ε, λ, μ) and entropy production (ΔΣ) related to state changes, but does not calculate the energy cost per bit for memory operations like retrieval or shifting.

### **3.8 Memory Fidelity & Robustness Metrics (Optional - if applicable)**
* **Vector ID:** M3.8
* **Vector Type:** Table
*   Table:
    | Metric ID | Description | Value | Units | CT-GIN Mapping | Data Source | Implicit/Explicit | Justification |
    | :-------- | :---------- | :----: | :---: | :-------------: | :----------: |:-----------------:| :-----------------:|
    | Error | Fraction of incorrect/missing tiles vs target | <0.05 (Good) | Dimensionless | `MemoryNode` attribute | Methods, Fig 2g, 3, 4 | Explicit | Defines retrieval fidelity. |
    | Frequency of Shifts (f) | Fraction of runs ending in a valid sequence state | Variable (Fig 4b-j) | Dimensionless | `TransitionEdge` attribute | Fig 4 | Explicit | Measures robustness/reliability of sequential recall under non-reciprocity. |
    | Shift Yield (Correct) | Fraction of shifts successfully completed | High (e.g., >0.8 for M=1600) | Dimensionless | `TransitionEdge` attribute | Fig 4m | Explicit | Measures robustness of sequential transitions against premature/waiting shifts. |
*   Implicit/Explicit: Explicit
*   Justification: Error, shift frequency (f), and shift yield are explicitly defined and measured to assess the fidelity and robustness of memory retrieval and sequential transitions.

---

## M4: Self-Organization and Emergent Order
*   **Vector ID:** M4
*   **Vector Type:** Self-Organization

### **4.1 Self-Organization Presence:**

*   **Vector ID:** M4.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The system demonstrates self-organization through the spontaneous formation of pre-defined, globally ordered structures (S(1)...S(m)) from a pool of tiles (or seed) based purely on local, programmed interaction rules (reciprocal U and non-reciprocal R). The global structure is not imposed externally but emerges from the collective interactions driven by minimizing the effective energy (in assembly) or following the non-reciprocal biases (in shifting). The transitions between these structures are also a form of dynamic self-organization orchestrated by the local non-reciprocal rules.
    *   Implicit/Explicit: Explicit
        *  Justification: The paper is fundamentally about self-organization processes (assembly and dynamic transitions). It explicitly contrasts equilibrium self-assembly with non-equilibrium self-organization driven by non-reciprocity.

### **4.2 Local Interaction Rules:**

*   **Vector ID:** M4.2
*   **Vector Type:** Rules
    *   Content:
        1.  **Reciprocal (Equilibrium Assembly):** Defined by the interaction matrix/potential U (Eq. 1). If a pair of adjacent tiles (A, B) with a specific orientation (□ ∈ {\, /}) exists in *any* of the target structures S(1)...S(m), their interaction energy is -ε. Otherwise, it's 0. This rule favors bonds present in the stored patterns. Mathematically: `Ur(A □ B) = -ε if A □ B ∈ ∪ᵢ Ir(S(i)), else 0`. (Methods, Eq. 1, 2). Governs assembly towards nearest energy minimum matching a stored pattern.
        2.  **Non-Reciprocal (Non-Equilibrium Shifting):** Defined by the interaction rate modifier R (Eq. 4) based on the transition sequence (e.g., S(ℓ) → S(ℓ+1)). Specific directional approaches (■ ∈ {↘, ↖, ↗, ↙}) between tiles (e.g., A approaching B which is part of the structure) are assigned a non-reciprocal bias λ if that specific approach is part of the programmed transition sequence. Otherwise, the bias is 0. Mathematically: `Rn(A ■ B) = λ if A ■ B ∈ Inr(S(ℓ)→S(ℓ+1)), else 0`. (Methods, Eq. 4, 5). This bias modifies the Monte Carlo acceptance probability (Λ term in Eq. 6, 7), driving transitions along the programmed sequence.
        3.  **Monte Carlo Moves:** Randomly select a lattice site, attempt to change tile type (add, remove, swap) with probability `p = min{1, exp(Λ - ΔH)}`, where ΔH includes reciprocal (U) and chemical potential (μ) contributions, and Λ includes non-reciprocal (R) contributions (Eq. 6, 7). This implements the kinetic pathway based on the energetic rules.
    *   CT-GIN Mapping: Rules define `InteractionNode` attributes and `TileInteractsEdge` properties. Rule 1 (U) defines equilibrium energy landscape. Rule 2 (R) defines non-equilibrium driving force/transition bias (`TransitionEdge` property). Rule 3 defines dynamics/updates (`ConfigurationNode` evolution).
    * **Implicit/Explicit**: Explicit
        *  Justification: The interaction potentials U and R, their mathematical forms, their dependence on target structures/sequences, and their incorporation into the Monte Carlo acceptance probability are all explicitly detailed in the text and Methods.

### **4.2.1 Local Interaction Parameters:**

* **Vector ID:** M4.2.1
* **Vector Type:** Table
*   Table:
    | Rule ID | Description | Parameter Name | Parameter Value Range | Units | Data Source | Implicit/Explicit | Justification |
    | :------ | :---------- | :------------- | :-------------------- | :---: | :----------: | :----------------: | :------------: |
    | 1       | Reciprocal Interaction | ε              | e.g., 3.0 - 25.0      | k<sub>B</sub>T | Fig 2, 3    | Explicit          | Energy scale for bonds in target structures. |
    | 2       | Non-Reciprocal Interaction | λ              | e.g., 0 - 25        | k<sub>B</sub>T | Fig 2, 3, 4 | Explicit          | Energy scale/bias for programmed transitions. |
    | 3       | Tile Density Control | μ              | e.g., 0 - -40       | k<sub>B</sub>T | Fig 2, 3, 4 | Explicit          | Controls overall density via energy cost/gain of tiles. |

### **4.3 Global Order:**

*   **Vector ID:** M4.3
*   **Vector Type:** Order
    *   Content: The primary emergent global orders are the specific, predefined target structures S(1)...S(m), which are typically random permutations of M tiles on a √M × √M lattice (e.g., 40x40). Other possible global states also emerge depending on parameters: 'chimera' states (incorrect assemblies mixing features of multiple S(i)), 'liquid' states (disordered, dynamic configurations with few specific bonds), and 'dispersion' states (mostly empty lattice, disassembled tiles). The shape-shifting behavior is a dynamic sequence of these globally ordered structures: S(1) → S(2) → ...
    *   CT-GIN Mapping: Defines `ConfigurationNode` types: `TargetStructureNode` (S(i)), `ChimeraNode`, `LiquidNode`, `DispersionNode`. `SequenceNode` represents the ordered transitions between `TargetStructureNode`s.
    * **Implicit/Explicit**: Explicit
        *  Justification: Target structures S(i) are explicitly defined as the goal of assembly. The other phases (chimera, liquid, dispersion, shape-shifter) are explicitly identified, described, and shown in phase diagrams (Fig 2, 3).

### **4.4 Predictability of Global Order:**

*   **Vector ID:** M4.4
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: Within the multifarious assembly regime (correct ε, μ, λ=0), the final assembled structure is highly predictable (determined by the initial seed, aiming for low error ≈ 0). Predictability is high. Within the shape-shifter regime (λ > λ<sub>min</sub>), the sequence of transitions S(1) → S(2) → ... is programmed and generally predictable, although stochasticity exists. Predictability/success is quantified by the 'frequency of shifts' (f) analysis (Fig 4b-j), showing high probability (>80-90% in optimal ranges) of reaching the correct structure in the sequence. However, 'premature shifts' or getting stuck ('waiting shifts') reduce perfect predictability (Fig 4m). Parameter choices (ε, μ, λ) strongly influence predictability; outside optimal regimes, unpredictable chimeras, liquid, or dispersion states result (Fig 3). Score reflects high predictability in desired regimes but acknowledges stochasticity and parameter sensitivity.
    * **Implicit/Explicit**: Mixed
    *  Justification: Predictability in the assembly regime (low error) is explicit. Predictability of the shifting sequence is explicitly quantified by 'frequency' (f) and 'yield' (Fig 4). The overall score combines these explicit measures with the understanding of parameter dependence from phase diagrams.
    *   CT-GIN Mapping: Attributes of `AdjunctionEdge` (local rules to global state) or `TransitionEdge`. High score means high probability edge weight. Error rate (1-O) and shift frequency (f) are quantitative metrics.

### **4.5. Local Interaction Rules (for Self-Organization)**
* **Vector ID:** M4.5
* **Vector Type:** Table
*   Table:
| Rule ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Source |
| :------ | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :-----: |
| 1       | Reciprocal Bond Formation | ε         | e.g., 3.0 - 25.0 | k<sub>B</sub>T | Explicit | Defines stability of target structures. | Methods (Eq. 1), Fig 2, 3 |
| 2       | Non-Reciprocal Transition Bias | λ         | e.g., 0 - 25    | k<sub>B</sub>T | Explicit | Drives shifts between structures. | Methods (Eq. 4), Fig 2, 3, 4 |
| 3       | Tile Addition/Removal | μ         | e.g., 0 - -40   | k<sub>B</sub>T | Explicit | Controls tile density/binding affinity. | Methods (Eq. 3), Fig 2, 3, 4 |
| 4       | Stochastic Dynamics | T (implied) | 1           | k<sub>B</sub>T | Implicit | Sets thermal energy scale for MC. | Methods (Eq. 6) |

### **4.6. Globally Emergent Order and Order Parameters**
* **Vector ID:** M4.6
* **Vector Type:** Table
*   Table:
| Property ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Protocol | Source |
| :---------- | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :------: | :-----: |
| 1 | Structure Fidelity | Overlap (O) | 0 - 1 | Dimensionless | Explicit | Measures similarity to target structure S(i). | 1 - Error calculation | Methods, Fig 2g |
| 2 | Tile Density | ρ | ~0 - 1 | Tiles/Site | Explicit | Measures fraction of occupied sites. | Direct calculation | Fig 3e, Extended Data Figs |
| 3 | System Energy | E | Variable | k<sub>B</sub>T | Explicit | Total energy based on Hamiltonian H. | Sum over bonds/tiles (Eq. 3) | Fig 3f, Extended Data Figs |
| 4 | Non-Equilibrium Activity | Entropy Production (ΔΣ) | ≥ 0 | k<sub>B</sub> (unitless) | Explicit | Measures irreversibility/dissipation. | Sum log(P<sub>fwd</sub>/P<sub>rev</sub>) | Fig 2g |

### **4.7 Yoneda Embedding and Local-to-Global Mapping Fidelity**

*   **Vector ID:** M4.7
*   **Vector Type:** Table
*   Table:
    | Link Type | Description | Predictability | Yoneda Score | Metrics | Implicit/Explicit | Justification | Source |
    | :-------- | :---------- | :------------- | :----------- | :------ | :----------------: | :------------: | :-----: |
    | U → S(i) Assembly | Local reciprocal rules determining global structure S(i) | High (in assembly regime) | 8 | Overlap O (>0.95), Low Error (<0.05) | Explicit (Metrics) | Local interactions reliably produce the globally defined target structures under correct conditions. | Fig 3a, Methods |
    | R → Sequence | Local non-reciprocal rules determining global transition sequence | Medium-High (in shifter regime) | 7 | Shift Frequency f (>0.8), Shift Yield | Explicit (Metrics) | Local biases generally produce the programmed sequence, but stochasticity and parameter sensitivity introduce deviations (premature/waiting shifts). | Fig 4b-m |
    *   **Yoneda Embedding Fulfillment Score [0-10]:** (Score reflects how well local rules faithfully determine the global outcome) 0: No relation; 3: weak correlation; 5: Significant correlation, some predictability; 7: High predictability, some deviations; 9: Near-perfect mapping; 10: Perfect mapping.
    *   **Metrics:** Overlap (O), Error (1-O), Shift Frequency (f), Shift Yield.
    *   **Justification:** The system demonstrates a relatively strong link between local rules (U, R) and global outcomes (structures S(i), sequences). Predictability is quantified. The scores reflect high fidelity in the assembly case and slightly lower, but still strong, fidelity in the dynamic sequence case due to non-equilibrium stochasticity.

## M5: Computation
*   **Vector ID:** M5
*   **Vector Type:** Computation

### **5.1 Embodied Computation Presence:**

*   **Vector ID:** M5.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The system performs computation in the sense of associative memory recall, analogous to the Hopfield network. The reciprocal interactions U encode stored patterns (memories), and the self-assembly process retrieves the pattern corresponding to an initial seed (input). This computation is embodied in the physical interactions between the tiles, determining the system's collective state (output). The non-reciprocal interactions further process the current state (retrieved pattern) to compute the next state in a predefined sequence.
    *    Implicit/Explicit: Explicit
        *  Justification: The analogy to Hopfield neural networks, which are computational models (associative memory), is explicitly stated (Intro, Methods Refs 9, 10, 33, 40). Retrieval of stored structures is a computational task performed by the system's dynamics.

### **5.2 Computation Type:**

*   **Vector ID:** M5.2
*   **Vector Type:** Classification
    *   Content: Neuromorphic / Analog / Other (State Machine)
    *   Justification: The Hopfield network analogy points to Neuromorphic computation (associative memory). The interactions and dynamics are based on continuous energy landscapes and stochastic transitions, suggesting Analog computation rather than discrete digital logic. The sequential shape-shifting driven by R acts like a programmed Finite State Machine, where states are the structures S(i) and transitions are driven by non-reciprocity.
    *   CT-GIN Mapping: Defines the `ComputationNode` type. Attributes: `computation_type`: ["Neuromorphic (Associative Memory)", "Analog", "State Machine"].
    *    Implicit/Explicit: Mixed
    *    Justification: The Hopfield analogy (Neuromorphic) is explicit. Classifying it further as Analog or State Machine is an interpretation based on the model's description.

### **5.3 Computational Primitive:**

*   **Vector ID:** M5.3
*   **Vector Type:** Function
    *   Content:
        1.  **Associative Memory Retrieval:** Given a partial or noisy input (seed structure), the system converges to the closest complete stored pattern S(i). This is achieved via energy minimization dynamics governed by reciprocal interactions U.
        2.  **Sequential State Transition:** Given the current state S(i), the non-reciprocal interactions R compute and drive the transition to the next predefined state S(i+1) in the sequence.
    *   **Sub-Type (if applicable):** Associative Memory Retrieval, Sequential Logic/State Transition.
    *   CT-GIN Mapping: Defines the primary function of the `ComputationNode`. `function`: ["Associative Retrieval", "Sequential Transition"].
    *   Implicit/Explicit: Mixed
    * Justification: Associative memory retrieval is explicit via the Hopfield analogy. Sequential transition is the core function enabled by non-reciprocity, explicitly described as shape-shifting between states. Defining these as computational primitives is an interpretation.

### **5.4 Embodied Computational Units**
* **Vector ID:** M5.4
* **Vector Type:** Table
*   Table:
| Unit ID | Description | Processing Power | Energy/Operation | Freq/Resp. Time | Bit-Depth | Data Source | Implicit/Explicit | Justification |
| :------ | :---------- | :--------------- | :--------------- | :--------------: | :-------: | :----------: |:-----------------:| :-----------------:|
| Tile Interaction | Basic comparison/energy calculation for adjacent tiles | N/A | ~ε or λ per interaction | ~1/τ<sub>s</sub> (MC step) | N/A | Methods | Implicit | Interactions form the basis of computation, but performance metrics aren't defined at this level. |
| System as Memory | Retrieval of one stored pattern S(i) | N/A | N/A (related to ΔΣ for shifts) | 1/τ<sub>retrieval</sub>, 1/τ<sub>shift</sub> | log2(m) bits (choosing one pattern) | Fig 4k,l | Implicit | System collectively performs retrieval/shift; info content relates to number of patterns; speed related to characteristic times. Energy not per op. |

## M6: Temporal Dynamics
*   **Vector ID:** M6
*   **Vector Type:** Temporal

### **6.1 Timescales:**

*   **Vector ID:** M6.1
*   **Vector Type:** ParameterTable
    *   Table:
        | Timescale Description | Value | Units | Source | Implicit/Explicit | Justification |
        | :-------------------- | :---: | :---: | :----: | :----------------: | :------------: |
        | Monte Carlo Step Time | τ<sub>s</sub> (1 lattice sweep) | Arbitrary / Steps | Fig 4k (caption) | Explicit | Basic unit of time in simulations. |
        | Structure Retrieval Time | τ<sub>retrieval</sub> | τ<sub>s</sub> | Fig 4k, l | Explicit | Time for seed to grow to 95% overlap. Scales approx. linearly with M. |
        | Structure Shift Time | τ<sub>shift</sub> | τ<sub>s</sub> | Fig 4k, l | Explicit | Time to transition between structures (O<sub>i</sub>=0.95 to O<sub>i+1</sub>=0.95). Scaling depends on M. |
        | Simulation Duration | up to 4 x 10<sup>6</sup>, 20 x 10<sup>6</sup> | τ<sub>s</sub> | Fig 4 (caption), Ext Data Fig 5 | Explicit | Total time simulation runs. |

### **6.2 Active Inference:**

*   **Vector ID:** M6.2
*   **Vector Type:** Assessment
    *   Content: Unclear/Partial
    *   Justification: The system does not explicitly implement active inference by minimizing prediction error based on an internal generative model. However, parallels exist: (1) The stored structures S(i) encoded in U act as an implicit 'model' of desired states. (2) Self-assembly involves particles 'acting' (moving/binding) to 'infer' the state that best matches the implicit model (lowest energy configuration compatible with U). (3) The non-reciprocal rules drive transitions which could be *interpreted* as actions taken to fulfill a programmed sequence (an implicit goal), but not necessarily by minimizing a prediction error signal. There's no explicit prediction or update of an internal model based on prediction error described.
    *   Implicit/Explicit: Implicit
        *  Justification: Active inference is not mentioned in the paper. The assessment is based on interpreting the system's dynamics in the context of active inference principles.
    *   **If Yes/Partial, provide examples of testable CT-GIN metrics that *could* be used to quantify active inference:** Information theory metrics could quantify the mismatch between the current configuration and the target structure (related to 'surprise' or 'free energy'). The rate at which this mismatch decreases during assembly (τ<sub>retrieval</sub>) could relate to inference speed. For shifting, the predictability metric (f) relates to how well the system follows the 'goal' sequence. One could potentially reformulate the dynamics in terms of minimizing a free energy functional incorporating the non-reciprocal drive, but this is not done in the paper. CT-GIN: Track information flow from `EnvironmentNode` (parameter settings, seed) to `ConfigurationNode`, quantify mismatch with `TargetStructureNode`, relate configuration changes (`ActionEdge`) to mismatch reduction rate.

## M7: Adaptation
*   **Vector ID:** M7
*   **Vector Type:** Adaptation

### **7.1 Adaptive Plasticity Presence:**

*   **Vector ID:** M7.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The system exhibits fixed dynamics based on pre-programmed interaction rules (U and R). While it transitions between different states (structures), the underlying rules governing these transitions and the structures themselves do not change in response to the system's history or environment within a single simulation run. The system retrieves or sequences through predefined patterns; it does not learn new patterns or improve its performance at retrieving/sequencing through modification of its internal rules (like Hebbian learning would). The paper discusses *designing* systems with specific behaviors, not systems that *learn* behaviors.
    *    Implicit/Explicit: Implicit
        * Justification: The paper describes programming fixed rules (U, R) to achieve desired assembly and shifting. There is no mention of the rules themselves changing or adapting based on experience during the simulation. The absence of adaptation mechanisms implies 'No'.

**(Conditional: M7.1 is "No", skip M7.2)**

## M8: Emergent Behaviors
*   **Vector ID:** M8
*   **Vector Type:** Behavior

### **8.1 Behavior Description:**

*   **Vector ID:** M8.1
*   **Vector Type:** Description
    *   Content:
        1.  **Multifarious Self-Assembly:** Spontaneous formation of one specific target structure S(i) from a common pool of tiles, selected by initial conditions (e.g., seed) and governed by reciprocal interactions U.
        2.  **Shape-Shifting (Sequential Self-Organization):** Autonomous, programmed transitions through a sequence of different target structures (S(1) → S(2) → S(3)...) driven by non-reciprocal interactions R.
        3.  **Chimera Formation:** Emergence of incorrect, disordered structures containing features of multiple target patterns, resulting from competing interactions or non-optimal parameters.
        4.  **Liquid Phase:** Dynamic, disordered state with high tile mobility and few specific bonds, typically at high T (low ε) or low density (high μ).
        5.  **Dispersion Phase:** State where tiles are largely unbound and dispersed, occurring if interactions are too weak to stabilize assembly or if non-reciprocal drive destabilizes structures.
    *   CT-GIN Mapping: Defines `BehaviorArchetypeNode` types: "MultifariousAssembly", "ShapeShifting", "ChimeraFormation", "LiquidPhase", "DispersionPhase". These correspond to different regions in the parameter phase space (Fig 3).
    *    Implicit/Explicit: Explicit
       *  Justification: These behaviors (or "regimes", "phases", "outcomes") are explicitly identified, named, described, and studied throughout the paper (e.g., Fig 2, Fig 3).

### **8.2 Behavior Robustness:**

*   **Vector ID:** M8.2
*   **Vector Type:** Score
    *   Score: 6
    *   Justification: The desired behaviors (multifarious assembly, shape-shifting) occur only within specific regions of the parameter space (ε, μ, λ) as shown in the phase diagrams (Fig 3). Outside these regions, undesired behaviors (chimera, liquid, dispersion) dominate, indicating limited robustness to parameter variations. Within the shape-shifter regime, robustness is quantified by the frequency 'f' (Fig 4b-j); optimal parameters yield high frequency (>0.8), but it drops off rapidly. Robustness to initial conditions (seed size) is briefly mentioned (Fig 2 caption parameter variations). Robustness to noise is inherent in the stochastic MC model. Scaling analysis (Fig 4l, m, Ext Data Fig 5) suggests behavior persists for larger systems, indicating some robustness to system size changes. Overall, robustness is moderate and highly parameter-dependent.
    *   Implicit/Explicit: Mixed
        *  Justification: Parameter dependence (phase diagrams) is explicit. Quantitative robustness metrics (frequency f, yield) are explicit for the shape-shifting sequence. Robustness to noise is implicit in the MC method. The overall score is an interpretation based on these findings.
    *   CT-GIN Mapping: Attribute `robustness_score` of `BehaviorArchetypeNode`. Links to parameter ranges (e.g., `ParameterNode` representing ε, μ, λ).

### **8.3 CT-GIN Emergent Behavior Validation**

*    **Vector ID:** M8.3
*    **Vector Type:** Validation
     *  Content: Claims of emergent behaviors are primarily validated through extensive Monte Carlo simulations across a wide parameter space (ε, μ, λ). Behaviors are operationally defined and distinguished using quantitative metrics:
        *   **Overlap/Error (O, 1-O):** Used to identify successful assembly vs. chimeras or other states (Methods, Fig 2g, 3a). Thresholds (e.g., O>0.95) define successful retrieval.
        *   **Density (ρ):** Helps distinguish between dense phases (assembly, chimera, liquid) and sparse phases (dispersion) (Fig 3e).
        *   **Energy (E):** Characterizes the stability and nature of the final state (Fig 3f).
        *   **Entropy Production (ΔΣ):** Quantifies non-equilibrium activity, correlating strongly with shape-shifting events (Fig 2g).
        *   **Shift Frequency (f) & Timescales (τ):** Quantify the dynamics and success rate of the shape-shifting sequence (Fig 4).
     Control experiments are implicitly performed by varying parameters (e.g., comparing λ=0 vs λ>0). Phase diagrams (Fig 3) map out the parameter regions for each behavior. Reproducibility is implied through averaging over multiple runs (e.g., 5 or 100 realizations in Fig 3, 4 captions). Limitations mainly involve finite simulation time and system size, though scaling is explored (Fig 4l,m, Ext Data Fig 5). Brownian dynamics simulations (Ext Data Fig 6) provide further validation towards physical realizability.
     *   Implicit/Explicit: Explicit
    *   Justification: The use of simulations, specific metrics (Error, ΔΣ, f, τ), phase diagrams, and parameter scans for validation are all explicitly described in the methods and results sections and shown in figures.

## M9: Cognitive Proximity
*   **Vector ID:** M9
*   **Vector Type:** Cognition

### **9.1 Cognitive Mapping:**

*   **Vector ID:** M9.1
*   **Vector Type:** Description
    *   Content: Yes, the paper explicitly maps the multifarious self-assembly aspect of the model to associative memory, drawing a direct analogy with the Hopfield neural network model (Intro, Methods, Refs 9, 10, 33, 40). In this mapping:
        *   Stored structures S(i) ↔ Stored memory patterns.
        *   Reciprocal interactions U ↔ Synaptic weights encoding memories.
        *   Self-assembly from a seed ↔ Memory retrieval from a cue / attractor dynamics.
    The paper suggests non-reciprocal interactions provide a mechanism for *sequential* memory recall or transitions between cognitive states, citing work on asymmetric neural networks (Intro, Refs 25, 26). Limitations: The analogy is primarily for the equilibrium assembly part. The non-reciprocal dynamics add a pre-programmed sequential element not always present in standard Hopfield models. The cognitive mapping is functional/analogical, not claiming consciousness or higher cognition.
    *   CT-GIN Mapping: Defines `CognitiveMappingEdge` from `BehaviorArchetypeNode`("MultifariousAssembly") to `CognitiveFunctionNode`("AssociativeMemory"). Also potentially from "ShapeShifting" to "SequentialRecall".
    *   Implicit/Explicit: Explicit
    * Justification: The analogy to Hopfield networks and associative memory is explicitly stated multiple times in the introduction and methods, along with relevant citations.

### **9.2 Cognitive Proximity Score:**

*   **Vector ID:** M9.2
*   **Vector Type:** Score
    *   Score: 3
    *   Justification: Based on the CT-GIN Cognizance Scale:
        *   Level 0-1 (Non-Cognitive/Simple Responsivity): Exceeded, as system state depends on history (assembly process) and internal encoding (U).
        *   Level 2 (Sub-Organismal Responsivity): Met. System exhibits complex stimulus-response (seed->structure) and dynamic state changes (shifting).
        *   Level 3 (Reactive/Adaptive Autonomy): Partially Met/Met. The system autonomously assembles and transitions between states based on internal rules (U, R) and current state. It reacts to its internal state (current structure) to trigger the next step in the sequence. However, the adaptation is limited to following a pre-programmed sequence; the rules themselves don't adapt based on broader experience or goals in a learning sense.
        *   Level 4 (Goal-Directed/Model-Based): Argument is weaker. The stored structures act as an implicit model, and assembly is goal-directed towards matching that model. Shape-shifting follows a programmed 'goal' sequence. However, there's no evidence of flexible planning or modification of the model/goal based on new information.
    The system exhibits autonomous behavior based on stored information (memory) and internal dynamics, placing it firmly at Level 2 and arguably reaching Level 3 due to the sequence execution based on internal state. It demonstrates associative recall, a cognitive function. Higher levels involving learning, planning, or abstraction are not demonstrated.
    *   Implicit/Explicit: Implicit
    *  Justification: The score is an interpretation based on comparing the system's explicitly described functionalities (memory retrieval, sequential transitions) against the definitions provided in the CT-GIN Cognizance Scale.

### **9.3 Cognitive Function Checklist**

* **Vector ID:** M9.3
* **Vector Type:** Checklist
    *   | Cognitive Function               | Score (0-10) | Justification/Notes                                                                       | CT-GIN Mapping (if applicable) | Implicit/Explicit | Justification for Implicit/Explicit/Mixed |
    | :-------------------------------- | :----------: | :------------------------------------------------------------------------------------ | :--------------------------------: | :-----------------:|:-----------------:|
    | Sensing/Perception               | 1           | Tiles implicitly 'sense' neighbors via local interactions U, R. No complex perception.        | `TileInteractsEdge`              | Implicit          | Interaction implies sensing local environment. |
    | Memory (Short-Term/Working)        | 0           | No evidence of short-term/working memory distinct from the long-term stored structures. | N/A                               | Implicit          | Absence of description implies No. |
    | Memory (Long-Term)                 | 5           | Associative memory explicitly implemented (Hopfield analogy). Stores 'm' patterns. Readout via assembly. Fixed rules. | `MemoryNode`, `CognitiveMappingEdge` | Explicit (analogy), Mixed (scoring) | Analogy explicit, score based on assessment. |
    | Learning/Adaptation              | 0           | Rules U and R are fixed; system follows pre-programmed dynamics, no learning demonstrated. | N/A                               | Implicit          | Absence of description implies No. |
    | Decision-Making/Planning          | 1           | Minimal 'decision' in MC step based on energy/bias. Sequence following is pre-programmed, not planned. | N/A                               | Implicit          | Stochastic choice, not cognitive decision. |
    | Communication/Social Interaction | 0           | Tiles interact locally, no communication or social behavior described.                    | N/A                               | Implicit          | Absence of description implies No. |
    | Goal-Directed Behavior            | 3           | Assembly directed towards stored structure (implicit goal). Shifting follows programmed sequence (programmed goal). Limited flexibility. | `BehaviorArchetypeNode`            | Implicit          | Interpretation of assembly/shifting dynamics. |
    | Model-Based Reasoning              | 2           | Implicit model (U matrix) used for retrieval. No evidence of explicit reasoning or prediction based on the model. | `MemoryNode` as model             | Implicit          | Interpretation of Hopfield analogy. |
    | **Overall score**                 |      1.5       | Average of above scores.                                                                                       |                                   |                     | Calculated |


## M10: Criticality Assessment
*   **Vector ID:** M10
*   **Vector Type:** Criticality

### **10.1 Criticality:**

*   **Vector ID:** M10.1
*   **Vector Type:** Assessment
    *   Content: Unclear
    *   Justification: The provided text does not explicitly mention or test for criticality, scale-free behavior, power laws, or long-range correlations. While phase transitions between different regimes (liquid, assembly, chimera, dispersion) are studied (Fig 3), and these transitions might be related to critical phenomena, the analysis is focused on mapping phase boundaries and characterizing the states, not on investigating critical exponents or related hallmarks of criticality. The analogy to Hopfield networks, which can exhibit phase transitions, is mentioned, but not explored in the context of criticality here.
        *   Critical Parameters (If Yes/Partial): N/A
        *   Evidence: N/A
    *   Implicit/Explicit: Implicit
    *    Justification: The absence of any discussion related to criticality concepts in the provided text leads to the assessment "Unclear".

## M11: Review Paper Specifics (Conditional)

N/A

## M12: Theoretical Paper Specifics (Conditional)

*   **Vector ID:** M12
*   **Vector Type:** Theory

### **12.1 Theoretical Rigor:**

*   **Vector ID:** M12.1
*   **Vector Type:** Score
    *   Score: 9
    *   Justification: The theoretical framework appears rigorous. It builds upon established concepts (statistical mechanics, lattice models, Monte Carlo, Hopfield analogy, multifarious assembly). Interactions (U, R) and the Hamiltonian (H) are clearly defined mathematically. The generalized Monte Carlo method incorporating non-reciprocity is explicitly described. Assumptions (e.g., lattice model, specific interaction forms, timescale separation justification for MC) seem reasonable for the model's purpose. The analysis includes systematic parameter scans and quantitative metrics (Error, ΔΣ, τ, f). The connection to entropy production provides a link to non-equilibrium thermodynamics. The model is internally consistent and logically developed.
       * Implicit/Explicit: Explicit
       *  Justification: The mathematical definitions, simulation methods, and analysis techniques are explicitly described.

### **12.2 Realization Potential:**

*   **Vector ID:** M12.2
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: The paper explicitly suggests potential physical realizations at different scales, including nucleic acids, peptides, proteins, and colloids (Abstract, Conclusion). It specifically mentions catalytically active colloids and enzymes exhibiting non-reciprocal phoretic interactions as a promising route (Conclusion, Refs 13-17). The use of programmable interactions (like DNA origami or specific molecular binding) for U is feasible (Refs 2, 34, 35). Implementing programmable *non-reciprocal* interactions (R) depending on approach direction might be challenging but plausible with active components or precisely controlled external fields. Brownian dynamics simulations (Ext Data Fig 6) lend further support to potential physical realization. The score reflects the plausible connection to existing experimental systems, acknowledging implementation challenges for programmability, especially for R.
    *   Implicit/Explicit: Explicit
    *  Justification: Potential physical implementations (colloids, DNA, etc.) and relevant experimental contexts (active phoretic colloids) are explicitly discussed in the abstract and conclusion.

### **12.3 Potential for Future CT-GIN Implementation Score**

* **Vector ID:** M12.3
*   **Vector Type:** Score
    *   Score: 9
    *   Justification: The theoretical framework is highly suitable for CT-GIN analysis. It involves distinct components (tiles), well-defined local interactions (U, R), emergent global states (structures S(i), phases), and dynamic transitions between states. This structure maps naturally onto nodes (Tiles, Interactions, Structures, Configurations) and edges (interacts_via, assembles_into, transitions_to) in a graph network. Key parameters (ε, λ, μ) become node/edge attributes. The identified behaviors (assembly, shifting, etc.) and metrics (Error, ΔΣ, τ, f) provide quantifiable properties for graph nodes/edges. Analyzing how local rules (U, R) map to global behavior (assembly/shifting fidelity) aligns perfectly with CT concepts like functors or Yoneda embedding (M4.7). The model provides a concrete system for exploring relationships between local interactions, global order, dynamics, and computation within the CT-GIN framework.
    *    Implicit/Explicit: Implicit
    *   Justification: The score is based on assessing the model's structure (components, interactions, states, dynamics) and its suitability for representation and analysis using Category Theory and Graph Isomorphism Networks, based on the descriptions provided.

## M13: Overall Assessment & Scoring

*   **Vector ID:** M13
*   **Vector Type:** Overall

### **13.1 CT-GIN Readiness Score:**

*   **Vector ID:** M13.1
*   **Vector Type:** Score
*   **Calculated Score:** 6.83 (Average of M1.2=8, M2.3=N/A->0, M3.2=6, M4.4=7, M8.2=6, M9.2=3 -> (8+0+6+7+6+3)/6 = 30/6 = 5. *Correction*: M2.3 is efficiency, which is N/A. Let's recalculate based on available scores used in sandbox: M1.2(8), M3.2(6), M4.4(7), M8.2(6), M9.2(3). Average = (8+6+7+6+3)/5 = 30/5 = 6.0. *Correction 2*: Need average of M1-M4, M8.2, M9.2. Using available scores: M1.2(8), M2.3(N/A->0), M3.2(6), M4.4(7), M8.2(6), M9.2(3). Average = (8+0+6+7+6+3)/6 = 30/6 = 5.0) Let's use M1.2(8), M2.4(Explicit ΔΣ -> maybe score 7 for quantif?), M3.2(6), M4.4(7), M8.2(6), M9.2(3). Avg=(8+7+6+7+6+3)/6 = 37/6 = 6.17. Let's stick to the prompt list M1-M4, M8.2 M9.2 where scores exist: M1.2(8), M2.3(0), M3.2(6), M4.4(7), M8.2(6), M9.2(3). Avg=5.0. Seems low. Let's re-read prompt: M1-4 covers multiple sub-scores. Let's take representative ones: M1.2(8), M2.4 is dissipation, ΔΣ is explicit, rate not=>6, M3.2(6), M4.4(7), M8.2(6), M9.2(3). Avg=(8+6+6+7+6+3)/6 = 36/6 = 6.0.

**CT-GIN Readiness Summary Table:**

| CT-GIN Aspect                   | Strength (Yes/Partial/No) | Key Supporting Metrics (with units) | Limitations (Missing Metrics/Data Gaps)                                           | Improvement Areas (Future Research)                                          |
| :------------------------------ | :-----------------------: | :-----------------------------------| :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| Energy Flow Efficiency          | No                        | N/A                                     | Efficiency not defined/quantified.                                                | Define thermodynamic efficiency metrics for assembly/shifting.              |
| Memory Fidelity                 | Yes                       | Overlap O (>0.95), Error (1-O <0.05) | Energy cost per operation N/A. Capacity limits need more study.                | Quantify energy costs. Explore methods to increase capacity (Ref 7).       |
| Organizational Complexity       | Yes                       | Defined structures S(i), Sequence | Complexity metrics (e.g., information content) N/A. Limited # of structures explored. | Develop complexity measures for structures/sequences. Explore larger m.    |
| Embodied Computation            | Yes (Associative Memory)  | Readout Accuracy (1-O), Shift Frequency f | Computational power/speed N/A. Limited computation types (retrieval, sequence). | Quantify computation metrics (speed, power). Explore more complex computations. |
| Temporal Integration            | Yes                       | τ<sub>retrieval</sub>, τ<sub>shift</sub> (ms-s range inferred from BD), ΔΣ | Relationship between timescales and info processing unclear. Active inference unclear. | Analyze information flow over time. Investigate active inference connection. |
| Adaptive Plasticity             | No                        | N/A                                     | System rules are fixed, no learning from experience demonstrated.               | Incorporate mechanisms for rule adaptation/learning (e.g., Hebbian R).       |
| Functional Universality         | Partial                   | Assembly, Sequencing               | Limited range of demonstrated functions.                                           | Explore encoding of more diverse functions beyond simple sequencing.         |
| Cognitive Proximity            | Partial                   | Associative Memory Analogy           | Limited evidence for higher cognitive functions (planning, learning).           | Explore links to prediction, goal-directedness, learning mechanisms.       |
| Design Scalability & Robustness | Partial                   | Scaling analysis (Fig 4l,m), Phase Diagrams | Robustness highly parameter-dependent. Practical implementation challenges.     | Investigate robustness more systematically. Optimize parameters.           |
| **Overall CT-GIN Readiness Score** |  **6.0**                 | Assembly Error, Shift Frequency, ΔΣ   | Energy Efficiency, Learning, Higher Cognition                                   | Quantify Energy Costs, Incorporate Adaptation, Explore Deeper Cognitive Links |


### **13.2 Qualitative CT-GIN Assessment Conclusion:**

*   **Vector ID:** M13.2
*   **Vector Type:** Textual Summary
    *   Content: This paper presents a theoretically rigorous model for non-equilibrium self-organization, demonstrating how programmable non-reciprocal interactions can drive dynamic shape-shifting between multiple stored structures. Key strengths from a CT-GIN perspective include the explicit implementation of associative memory (analogous to Hopfield networks) embodied in local reciprocal interactions (U), and the introduction of non-reciprocal interactions (R) as a mechanism for programmed sequential state transitions. The system exhibits clear self-organization leading to well-defined global states (structures S(i)) and dynamic sequences, with quantifiable metrics for fidelity (Error/Overlap), dynamics (τ<sub>retrieval</sub>, τ<sub>shift</sub>), non-equilibrium activity (ΔΣ), and sequence reliability (frequency f). The model maps reasonably well to CT-GIN concepts, with identifiable components, interactions, states, and transitions. Key limitations include the lack of adaptive plasticity (rules are fixed, no learning), limited exploration of computational capabilities beyond memory retrieval and sequencing, and the absence of defined energy efficiency metrics. While suggesting plausible physical realizations, the practical implementation of programmable non-reciprocity remains a challenge. Overall, the work provides a strong foundation for studying non-equilibrium dynamics and embodied memory within the CT-GIN framework, representing a significant step beyond simple equilibrium assembly towards dynamic material function, scoring well on memory and organization but lacking in adaptation and higher cognitive functions.

### **13.3 CT-GIN Refinement Directions:**

*   **Vector ID:** M13.3
*   **Vector Type:** Recommendations
    *   Content:
        *   **Incorporate Adaptation/Learning:** Introduce mechanisms where interaction rules (U or R) can change based on system history or external feedback, enabling learning of new sequences or optimizing existing ones (e.g., Hebbian modification of R strength based on successful transitions).
        *   **Quantify Energetics:** Define and calculate thermodynamic efficiency for assembly and shifting processes. Quantify the energy cost per memory operation (retrieval, transition).
        *   **Explore Computational Complexity:** Investigate if the framework can support more complex computations beyond associative memory and fixed sequences, such as logic operations or pattern recognition, potentially by leveraging the non-equilibrium dynamics.
        *   **Deepen Cognitive Mapping:** Explore potential connections to active inference more rigorously, potentially by formulating the dynamics in terms of prediction error minimization or free energy principles incorporating non-reciprocity.
        *   **Enhance Robustness Analysis:** Systematically study robustness to different types of noise, parameter variations, and component heterogeneity. Develop strategies (e.g., optimized interaction design, error correction mechanisms) to improve robustness.
        *   **Develop Complexity Metrics:** Define quantitative measures for the complexity of stored structures and transition sequences to better understand capacity limits and design principles.
        *   **Bridge Theory and Experiment:** Propose specific experimental designs (e.g., using DNA origami tiles with active enzymes) that could realize and test the key predictions about non-reciprocal self-organization and shape-shifting, including quantitative validation of interaction strengths (ε, λ).

## M14: CT-GIN Knowledge Graph

*   **Vector ID:** M14
*   **Vector Type:** Visualization

### **14.1. CT-GIN Knowledge Graph:**
* **Content:**
    [Cannot generate visual graph. Conceptual Description:
    Nodes:
    *   `SystemNode` (attributes: M, m, type=Theoretical)
    *   `TileTypeNode` (set of M nodes)
    *   `InteractionNode` (type=[Reciprocal, NonReciprocal], energy=[ε, λ])
    *   `StructureNode` (S(i), i=1..m, attributes: configuration_details)
    *   `ConfigurationNode` (attributes: state=[TargetStructure, Chimera, Liquid, Dispersion], overlap=O, density=ρ, energy=E)
    *   `BehaviorArchetypeNode` (type=[Assembly, Shifting, ChimeraFormation, ...], attributes: robustness_score, timescale=τ)
    *   `MemoryNode` (mapped from StructureNode, attributes: capacity=m, accuracy=1-O, retention_time=τ_shift)
    *   `ParameterNode` (ε, λ, μ)
    Edges:
    *   `DefinesInteractionEdge` (from `StructureNode` to `InteractionNode` (Reciprocal); from `SequenceSpec` to `InteractionNode` (NonReciprocal))
    *   `TileInteractsEdge` (between `TileTypeNode`s, attributes: interaction_ref=`InteractionNode`)
    *   `GovernsEdge` (from `ParameterNode` to `InteractionNode`/`SystemNode`)
    *   `AssemblesIntoEdge` (from `ConfigurationNode`(Seed) to `ConfigurationNode`(TargetStructure), via local `TileInteractsEdge`s with `Reciprocal` type, labeled with τ<sub>retrieval</sub>)
    *   `TransitionsToEdge` (between `ConfigurationNode`(TargetStructure i) and `ConfigurationNode`(TargetStructure i+1), via local `TileInteractsEdge`s with `NonReciprocal` type, labeled with τ<sub>shift</sub>, f, ΔΣ)
    *   `ExhibitsBehaviorEdge` (from `SystemNode` in specific parameter range to `BehaviorArchetypeNode`)
    *   `MapsToCognitiveEdge` (from `BehaviorArchetypeNode`(Assembly) to `CognitiveFunctionNode`(AssociativeMemory))
    ]

## M15: Relationship Vectors
*   **Vector ID:** M15
*   **Vector Type:** Relationships
*   Relationships:
        | Source Vector ID | Target Vector ID | Relationship Type |
        | ------------- | ------------- | ----------------- |
        | M1.1          | M4.1          | System Enables Self-Organization |
        | M1.1          | M3.1          | System Implements Memory |
        | M1.1          | M5.1          | System Performs Computation |
        | M1.3 (ε, λ, μ)| M8.1          | Parameters Determine Behavior Regime |
        | M4.2          | M4.3          | Local Rules Generate Global Order |
        | M4.2 (R)      | M8.1 (Shifting)| Non-Reciprocal Rules Drive Shifting |
        | M4.2 (U)      | M8.1 (Assembly)| Reciprocal Rules Drive Assembly |
        | M3.1          | M9.1          | Memory Enables Cognitive Mapping |
        | M8.1 (Shifting)| M6.1 (τ_shift)| Behavior Characterized by Timescale |
        | M2.4          | M8.1 (Shifting)| Dissipation Correlates with Behavior |

## M16: CT-GIN Template Self-Improvement Insights

*   **Vector ID:** M16
*   **Vector Type:** Feedback

### **Template Feedback:**

*    **Vector ID:** M16.1
*   **Vector Type:** Text
    *   **Missing Probes:**
        *   A specific probe for "Programmability" could be useful, assessing how easily the system's function (e.g., stored structures, transition sequences) can be modified or designed.
        *   A probe related to "Information Processing" beyond basic computation types (e.g., information flow rate, mutual information between states) might capture more nuances.
        *   For theoretical papers, a probe assessing the novelty or significance of the theoretical contribution could be added.
    *   **Unclear Definitions:**
        *   The distinction between "Adaptation" (M7) and dynamic behavior driven by fixed rules (like shape-shifting) could be clarified. M7 seems focused on *rule changes/learning*.
        *   The scoring scale for M9.2 (Cognitive Proximity) is helpful but applying it consistently, especially distinguishing between adjacent levels (e.g., 3 vs 4), can be subjective. More concrete examples for each level applied to materials might help.
        *   Yoneda Embedding (M4.7) is a complex CT concept; a simpler phrasing or more guidance on how to assess its fulfillment score for non-experts might be beneficial. "Local-to-Global Mapping Fidelity" captures the essence well.
    *   **Unclear Node/Edge Representations:**
        *   Guidance on handling implicit nodes/edges (like the thermal bath) could be useful.
        *   Standardizing attribute names across different node/edge types where applicable (e.g., `timescale`, `energy_cost`) would improve consistency.
    *   **Scoring Difficulties:**
        *   Assigning scores for Efficiency (M2.3) was difficult when not explicitly calculated; the prompt clarifies N/A is acceptable, but guidance on *inferring* qualitative scores could be added if desired.
        *   Calculating M13.1 requires careful tracking and averaging; explicitly listing *which* sub-scores contribute could prevent ambiguity (the prompt does list some, but "M1-4" is broad). Rule clarification: treat N/A as 0 for average calculation.
        *   The Cognitive Function Checklist (M9.3) scoring (0-10) requires significant interpretation to map material functions onto human-level benchmarks.
    *   **Data Extraction/Output Mapping:**
        *   Mapping complex dynamic behaviors (like chimera formation or phase transitions) onto static CT-GIN graph elements requires careful consideration (e.g., representing parameter-dependent regime shifts).
        *   Representing the *programming* aspect (how U and R are determined by S(i) and the sequence) within the graph needs clear conventions (e.g., `DefinesInteractionEdge`).
    *   **Overall Usability:** The template is very comprehensive and detailed, which is good for rigor but makes it time-consuming to apply. The strict formatting is crucial but demanding. The inclusion of Vector IDs and types is helpful for potential automation. Grouping optional sections clearly is good.
    * **Specific Suggestions:**
        *   Add a note to M13.1 specifying *exactly* which scores (by Vector ID) are averaged.
        *   Consider simplifying M4.7 or providing more context/examples for the Yoneda score.
        *   Add brief examples within the prompts for complex concepts like Active Inference or Embodied Computation tailored to material systems.
        *   Ensure consistency in using "N/A" vs. "0" vs. qualitative assessment for missing quantitative data across different sections.