# Directed motion of cognitive active agents in a crowded three-way intersection

__Paper Type:__ Theoretical/Computational

## M1: System Overview & Implementation
*   **Vector ID:** M1
*   **Vector Type:** Overview

### **1.1 System Description**

*   **Vector ID:** M1.1
*   **Vector Type:** Description
    *   Content: The system studied is a simulation model of cognitive active agents navigating a crowded three-way intersection. It uses intelligent active Brownian particles (iABPs) simulated via Langevin dynamics in two spatial dimensions. The purpose is to understand emergent collective behavior in pedestrian dynamics, specifically focusing on navigation strategies in semi-dense crowds. Key components are:
        1.  **Agents (iABPs):** Modeled as point particles with position `r_i`, orientation `e_i`, and constant speed `v_0`. Associated with a type `t_i` indicating goal direction.
        2.  **Propulsion Force:** `f_p * e_i`.
        3.  **Friction:** `-γ * r_dot_i`.
        4.  **Rotational Dynamics:** Governed by noise `Λ_i`, a vision-based avoidance torque `M_vis`, and a goal-following torque `M_goal`. (Eq. 2, 8).
        5.  **Vision-based Avoidance:** Non-reciprocal interaction torque (Eq. 4) dependent on relative positions (`r_ij`), orientations (`e_i`, `e_j`), a vision cone (`VC`) defined by angle `ψ` and range `R_v`, and a weighting factor `T_ij` distinguishing oncoming/co-moving agents (Eq. 5, 6). Interactions are limited to agents within the vision cone.
        6.  **Goal Following:** Torque `M_goal` aligning agent orientation `e_i` with the goal direction `d_hat(t_i)` (Eq. 7). Strength `K`.
        7.  **Rotational Noise:** Gaussian white noise `Λ_i` (or `ξ_i` in Eq. 8) with diffusion coefficient `D_r`.
        8.  **Environment:** A circular region with three inflow points (separated by 2π/3) and corresponding outflow regions, simulating a multi-stream intersection (Fig 1a). Agents are added at a specific inflow rate `Γ`.
    *   CT-GIN Mapping: `SystemNode` attributes: `systemType=Simulation`, `domain=ActiveMatter/PedestrianDynamics`, `model=iABP_Langevin`, `components=[iABP, VisionInteraction, GoalFollowing, RotationalNoise, IntersectionEnvironment]`, `purpose=StudyEmergentCollectiveBehavior`
    *   Implicit/Explicit: Explicit
        *  Justification: The paper clearly describes the model components, dynamics (equations), and simulation setup in the "Model and cross-stream setup" section and Fig. 1.

### **1.2 Implementation Clarity**

*   **Vector ID:** M1.2
*   **Vector Type:** Score
    *   Score: 9
    *   Justification: The model equations (1-8), parameters (Δ, ψ, Γ, Pe, K, D_r, R_v, R_0, R_int, σ), and simulation setup (Fig 1a, Methods) are described clearly and in detail. The core mechanisms (vision-based avoidance, goal following, noise) are mathematically defined. Minor ambiguity might exist in specific implementation details not covered (e.g., exact boundary condition handling beyond "absorbing boundary", precise noise generation method - though standard methods are implied), but the overall framework is very clear.
    *   Implicit/Explicit: Explicit
        * Justification: The score is based on the explicit description of the model, equations, parameters, and simulation setup provided in the text and figures.

### **1.3 Key Parameters**

*   **Vector ID:** M1.3
*   **Vector Type:** ParameterTable
    *   Table:
        | Parameter Name         | Value                     | Units       | Source (Fig/Table/Section) | Implicit/Explicit | Data Reliability (High/Medium/Low) | Derivation Method (if Implicit) |
        | :--------------------- | :------------------------: | :---------: | :-----------------------: | :-----------------: | :-----------------------------: | :-------------------------------: |
        | Relative Maneuverability (Δ) | Varied (e.g., 1 to 8+)   | Dimensionless | Text (Results), Fig 2, Fig 5 | Explicit          | High                            | N/A                             |
        | Vision Angle (ψ)       | Varied (e.g., π/4 to π)  | Radians     | Text (Results), Fig 2, Fig 5 | Explicit          | High                            | N/A                             |
        | Inflow Rate (Γ)        | Varied (e.g., 0.4 to 4)   | τ<sub>r</sub><sup>-1</sup> | Text (Dependence on...), Fig 6 | Explicit          | High                            | N/A                             |
        | Goal Fixation Strength (K) | 8 * D<sub>r</sub>            | τ<sub>r</sub><sup>-1</sup> | Text (Results)            | Explicit          | High                            | N/A                             |
        | Vision Range (R<sub>v</sub>) | 4 * R<sub>0</sub>            | R<sub>0</sub>    | Text (Results)            | Explicit          | High                            | N/A                             |
    *   **Note:** R<sub>0</sub> is the characteristic length scale, τ<sub>r</sub> = 1/D<sub>r</sub> is the rotational diffusion time. Parameter values are often varied across simulations to explore phase space.

## M2: Energy Flow
*   **Vector ID:** M2
*   **Vector Type:** Energy

### **2.1 Energy Input**

*   **Vector ID:** M2.1
*   **Vector Type:** Input
    *   Content: The energy input is implicitly represented by the constant propulsion force `f_p` acting along the agent's orientation `e_i`. This force drives the agent's motion against the frictional drag. It's not a physical energy source but a parameter defining the agent's self-propulsion activity in the model.
    *   Value: N/A (Model parameter `f_p`, related to speed `v_0 = f_p / γ`)
    *   Units: N (Force)
    *   CT-GIN Mapping: `EnergyInputNode`: attributes - `source=ModelParameter`, `type=SelfPropulsionForce`
    *   Implicit/Explicit: Implicit
        *  Justification: The force `f_p` is explicitly defined (Eq. 1), but its interpretation as an "energy input" in a thermodynamic sense requires inference, as the model focuses on overdamped dynamics, not energy conservation.

### **2.2 Energy Transduction**

*   **Vector ID:** M2.2
*   **Vector Type:** Transduction
    *   Content: 1. **Propulsion to Kinetic:** The propulsion force `f_p` is transduced into translational kinetic energy, balanced by frictional dissipation (`-γ * r_dot_i`) resulting in a constant speed `v_0` in the overdamped limit. 2. **Interactions/Goal to Rotational:** Agent interactions (via `M_vis`) and goal alignment (`M_goal`) exert torques that change the agent's orientation `e_i`, thus redirecting the propulsion force and influencing kinetic energy allocation. 3. **Noise to Rotational:** Random thermal/internal fluctuations are modeled as a stochastic torque (`Λ_i` or `ξ_i`), transduced into changes in orientation.
    *   CT-GIN Mapping: `EnergyTransductionEdge`: attributes - `mechanism=PropulsionToKinetic`, `from_node=EnergyInputNode`, `to_node=KineticEnergyNode`; `EnergyTransductionEdge`: `mechanism=TorqueToRotational`, `from_node=[VisionInteractionNode, GoalFollowingNode, NoiseNode]`, `to_node=OrientationNode`
    *   Implicit/Explicit: Mixed
        *  Justification: The forces and torques (Eq. 1, 2, 4, 7) are explicit. Their interpretation as energy transduction pathways is implicit, based on understanding the physics of the Langevin model.

### **2.3 Energy Efficiency**

*   **Vector ID:** M2.3
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification/Metrics: The paper does not discuss energy efficiency. The model operates in the overdamped limit, focusing on trajectories and collective states rather than energy conversion efficiency. Concepts like thermodynamic efficiency are not applicable to this model as presented.
    *   CT-GIN Mapping: N/A
    *   Implicit/Explicit: N/A
      *  Justification: Efficiency is not mentioned or calculable from the provided information.

### **2.4 Energy Dissipation**

*   **Vector ID:** M2.4
*   **Vector Type:** Dissipation
    *   Content: The primary dissipation mechanism explicitly modeled is friction, represented by the term `-γ * r_dot_i` in the translational equation of motion (Eq. 1). This term represents energy loss to the surrounding medium (analogous to viscous drag). Rotational dynamics also involve dissipation implicitly through the rotational diffusion term `D_r`, balancing the stochastic input. Quantification: The magnitude of translational dissipation is proportional to the friction coefficient `γ` and the agent's velocity `r_dot_i`. Qualitative Assessment: High, as the system is explicitly in the overdamped regime where inertial effects are negligible and motion is dominated by the balance of propulsion and friction.
    *   CT-GIN Mapping: Creates `EnergyDissipationNode` (type=`Friction`) and `EnergyDissipationEdge` from `KineticEnergyNode`. Implicit dissipation related to `D_r` could be mapped similarly for rotational dynamics.
    *    Implicit/Explicit: Mixed
        *  Justification: The friction term `-γ * r_dot_i` is explicitly stated (Eq. 1). Its role as the primary energy dissipation pathway in the overdamped limit is an explicit feature of the model framework. Quantifying the exact energy dissipated per unit time would require calculating `γ * |r_dot_i|^2`, which is implicitly derivable but not explicitly calculated in the paper.

## M3: Memory
*   **Vector ID:** M3
*   **Vector Type:** Memory

### **3.1 Memory Presence:**

*   **Vector ID:** M3.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The system exhibits memory in the sense of temporal correlations in agent motion. The paper explicitly states that individual agent motion can be characterized by fractional Brownian motion (fBM) with Hurst exponent H > 1/2 (Fig 5a), indicating long-range positive correlations ("long-memory effect"). This persistence arises from the goal-oriented motion and interactions, meaning the direction of motion at one time influences the direction at later times beyond immediate forces/torques. This is not cognitive memory (storing/recalling specific information) but rather statistical persistence in the dynamics. The orientational auto-correlation function `C(t)` (Eq. 11) also shows slow decay for `Δ >= 1`, indicating persistence.
    *    Implicit/Explicit: Mixed
        * Justification: The existence of temporal correlations and their characterization via fBM (H > 0.5) and slow decay of C(t) are explicitly stated and shown (Fig 5a, Supp Fig S1). Interpreting this as a form of "memory" (persistence influencing future behavior) is a standard interpretation in statistical physics but requires linking the explicit metrics to the concept of memory.

### **3.2 Memory Type:**

*   **Vector ID:** M3.2
*   **Vector Type:** Score
*   Score: 2
*   Justification: The memory observed is purely statistical persistence or temporal correlation arising from the continuous dynamics (goal following and interactions), typical of persistent random walks or fBM with H > 0.5. There are no distinct, re-writable internal states representing past experiences, nor mechanisms for encoding or retrieving specific information. The system's future state depends on the immediate past state and current interactions/goal, with correlations decaying over time (albeit slowly). It lacks capacity, specific read-out, and is not actively used for decision-making beyond maintaining a general direction influenced by the goal. It reflects the "inertia" of the goal-directed motion within the crowded environment.
*   CT-GIN Mapping: Defines the `MemoryNode` type: `TemporalCorrelation`. Attributes: `mechanism=GoalFollowing/Interactions`, `persistenceMetric=HurstExponent/CorrelationDecay`.
*    Implicit/Explicit: Mixed
    * Justification: The fBM/LW characteristics and correlation decay are explicit. Assigning a low score on a cognitive memory scale requires interpreting these physical characteristics in the context of memory definitions, which is implicit.

### **3.3 Memory Retention Time:**

*   **Vector ID:** M3.3
*   **Vector Type:** Parameter
*   Value: N/A (Qualitative: Long-range correlations)
*    Units: τ<sub>r</sub> (or seconds if parameters were dimensionalized)
*   Justification: The paper demonstrates long-range correlations (H > 0.5, slow C(t) decay) but does not quantify a specific retention time or correlation time constant from the decay curves (e.g., by fitting an exponential or power law to C(t) and extracting a timescale). The 'memory' persists over timescales longer than the basic rotational diffusion time `τ_r`, as indicated by H > 0.5 implying persistence beyond random reorientation.
*    Implicit/Explicit: Mixed
        * Justification: The presence of long-range correlations (implying long retention relative to basic timescales) is explicitly supported by H > 0.5 and C(t) plots. The lack of a specific quantitative value is also explicit. Stating it's "Long-term" relative to `τ_r` is an interpretation of the explicit data.
*   CT-GIN Mapping: Key attribute (`retention=LongRangeQualitative`) of the `MemoryNode`.

### **3.4 Memory Capacity (Optional - if applicable)**

* **Vector ID:** M3.4
* **Vector Type:** Parameter
*  Value: N/A
*   Units: N/A
*   Justification: The concept of memory capacity (e.g., number of distinct states, bits) is not applicable to the type of temporal correlation memory observed in this system.
*    Implicit/Explicit: N/A
        *  Justification: The paper provides no information related to memory capacity.
*   CT-GIN Mapping: N/A

### **3.5 Readout Accuracy (Optional - if applicable)**

* **Vector ID:** M3.5
* **Vector Type:** Parameter
*   Value: N/A
*   Units: N/A
*   Justification: There is no mechanism for reading out stored information. The "memory" manifests as persistence in the ongoing dynamics.
*    Implicit/Explicit: N/A
       *  Justification: The paper provides no information related to memory readout.
*   CT-GIN Mapping: N/A

### **3.6 Degradation Rate (Optional - if applicable)**
* **Vector ID:** M3.6
* **Vector Type:** Parameter
    *   Value: N/A (Qualitative: Slow decay)
    *   Units: τ<sub>r</sub><sup>-1</sup>
    *   Justification: The orientational auto-correlation function C(t) displays a slow power-law decay for `Δ >= 1` (Supp. Fig S1), indicating slow degradation of the directional persistence ("memory"). However, a specific rate constant is not extracted.
    *    Implicit/Explicit: Mixed
            * Justification: The slow decay of C(t) is explicitly shown. Describing this as a "slow degradation rate" is an interpretation. No quantitative rate is provided.
    *   CT-GIN Mapping: Attribute (`degradation=SlowPowerLaw`) of the `MemoryNode`.

### **3.7 Memory Operations Energy Cost (Optional - if applicable)**
* **Vector ID:** M3.7
* **Vector Type:** Table
*   Table: N/A
*   Implicit/Explicit: N/A
    *   Justification: The paper does not discuss memory operations or their energy costs.

### **3.8 Memory Fidelity & Robustness Metrics (Optional - if applicable)**
* **Vector ID:** M3.8
* **Vector Type:** Table
*   Table: N/A
*   Implicit/Explicit: N/A
*   Justification: The paper does not discuss memory fidelity or robustness metrics.
---

## M4: Self-Organization and Emergent Order
*   **Vector ID:** M4
*   **Vector Type:** Self-Organization

### **4.1 Self-Organization Presence:**

*   **Vector ID:** M4.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The paper explicitly investigates and identifies emergent self-organization resulting from local interactions (vision-based avoidance, goal following, noise) among the iABPs. Specific emergent patterns like localized flocking, jamming, percolation, scattering states, and self-organized rotational flows are reported and depend on system parameters (Δ, ψ, Γ). This order arises spontaneously from the local rules without external templating or global control dictating the patterns.
    *   Implicit/Explicit: Explicit
        *  Justification: The abstract and introduction explicitly state the goal is to study emergent self-organization, and the results section describes various self-organized collective behaviors (e.g., "emergent self-organization dependson agent maneuverability...", "identify several formsof collective behavior, including localizedflocking, jamming and percolation, and self-organizedrotational flows."). Fig 2 explicitly shows different emergent states.

### **4.2 Local Interaction Rules:**

*   **Vector ID:** M4.2
*   **Vector Type:** Rules
    *   Content: The local rules governing agent behavior are:
        1.  **Vision-based Avoidance Torque (M<sub>vis</sub>):** An agent `i` adjusts its orientation based on other agents `j` within its vision cone (`VC`, Eq. 6: angle `ψ`, range `R_v`). The torque (Eq. 4) depends on the relative position `r_ij`, relative orientation `e_i \cdot e_j` (via `T_ij`, Eq. 5, which penalizes head-on approaches), and the number of visible neighbors `N_i`. Strength `Ω`. This interaction is non-reciprocal for `ψ < π`.
        2.  **Goal-Following Torque (M<sub>goal</sub>):** An agent `i` tries to align its orientation `e_i` with its designated goal direction `d_hat(t_i)`. The torque (Eq. 7) depends on the angle between `e_i` and `d_hat(t_i)`. Strength `K`.
        3.  **Rotational Noise (Λ<sub>i</sub> or ξ<sub>i</sub>):** A stochastic torque representing random fluctuations, characterized by rotational diffusion coefficient `D_r` (Eq. 2, 3, 8).
        4.  **Propulsion/Friction:** Constant speed `v_0` resulting from propulsion `f_p` balanced by friction `γ` (Eq. 1). Although primarily translational, it determines the rate at which agents encounter each other, influencing interactions.
    *   CT-GIN Mapping: Defines `InteractionEdge` between `AgentNode`s. Attributes include `type=VisionAvoidance`, `strength=Ω`, `range=R_v`, `angle=ψ`, `nonReciprocal=True/False`. Also defines `GoalFollowingEdge` from `AgentNode` to `GoalNode` with `strength=K`. `NoiseNode` connected via `NoiseEdge` with `strength=D_r`.
    * **Implicit/Explicit**: Explicit
        *  Justification: The interaction rules are explicitly defined by mathematical equations (Eq. 1-8) and accompanying text descriptions in the "Model and cross-stream setup" section.

### **4.2.1 Local Interaction Parameters:**

* **Vector ID:** M4.2.1
* **Vector Type:** Table
*   Table:
    | Rule ID          | Description                  | Parameter Name         | Parameter Value Range     | Units       | Data Source | Implicit/Explicit | Justification                             |
    | :--------------- | :--------------------------- | :--------------------- | :------------------------: | :---------: | :----------: | :----------------: | :---------------------------------------- |
    | Vision Avoidance | Strength of avoidance torque | Ω                      | Δ * K = Δ * 8 * D<sub>r</sub> | τ<sub>r</sub><sup>-1</sup> | Text (Eq. 2, 8) | Explicit          | Ω is defined relative to K via Δ.       |
    | Vision Avoidance | Angle of vision cone         | ψ                      | π/4 to π                  | Radians     | Text, Fig 2  | Explicit          | Parameter varied in simulations.         |
    | Vision Avoidance | Range of vision cone         | R<sub>v</sub>            | 4 * R<sub>0</sub>            | R<sub>0</sub>    | Text          | Explicit          | Fixed parameter value stated.            |
    | Goal Following   | Strength of goal torque      | K                      | 8 * D<sub>r</sub>            | τ<sub>r</sub><sup>-1</sup> | Text          | Explicit          | Fixed parameter value stated.            |
    | Rotational Noise | Strength of random torque    | D<sub>r</sub>            | Implicitly 1/τ<sub>r</sub> | τ<sub>r</sub><sup>-1</sup> | Text (units)  | Mixed             | Sets the timescale τ<sub>r</sub>=1/D<sub>r</sub>. |
    | Relative Strength| Avoidance vs Goal            | Δ                      | 1 to 8+                   | Dimensionless | Text, Fig 2  | Explicit          | Ratio Ω/K, primary parameter varied. |

### **4.3 Global Order:**

*   **Vector ID:** M4.3
*   **Vector Type:** Order
    *   Content: Several distinct global (or system-spanning) ordered states emerge depending on the parameters (Δ, ψ, Γ):
        1.  **Unhindered Passage (Low Δ):** Agents largely ignore each other, moving almost directly towards goals (Fig 2b).
        2.  **Scattering State (Intermediate Δ, ψ ≥ π/2):** Complex, disordered motion with frequent avoidance maneuvers (Fig 2c). No stable global order like lanes.
        3.  **Jamming/Percolation State (High Δ, ψ=π):** Strong clustering, agents form large groups (clusters) that can span the interaction zone ('percolation'), exhibiting power-law size distributions (Fig 2d, Fig 3a,b). High density regions form.
        4.  **Localized Flocking State (Intermediate/High Δ, ψ < π/2):** Agents form local co-moving clusters by aligning with oncoming agents as an avoidance strategy (Fig 2e, Fig 3c,d). Characterized by parallel trajectories within the interaction zone.
        5.  **Rotational Flow/Roundabout Motion (High Γ, ψ=π/2):** Agents form vortex-like structures, flowing around the center of the interaction zone (Fig 6c, Fig 7b). Creates a low-density 'eye' at the center.
    *   CT-GIN Mapping: Defines a `ConfigurationalNode` for each distinct state (e.g., `State=JammingPercolation`). Attributes can include order parameters (e.g., cluster size exponent, polarization).
    * **Implicit/Explicit**: Explicit
        *  Justification: These global states are explicitly described in the text (Results subsections: Dynamic state diagram, Cluster-size distributions, Dependence on inflow rate) and illustrated in figures (Fig 2, Fig 3, Fig 6c, Fig 7).

### **4.4 Predictability of Global Order:**

*   **Vector ID:** M4.4
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: The emergence of specific global states (flocking, jamming, scattering, rotation) is highly predictable based on the key control parameters Δ (relative maneuverability), ψ (vision angle), and Γ (inflow rate), as summarized in the state diagram (Fig 2a) and the fundamental diagram analysis (Fig 6). The transitions between states appear relatively sharp in the parameter space explored. However, within a given state (especially scattering or jammed states), the microscopic behavior of individual agents involves stochasticity (noise, complex interactions) making precise individual trajectories unpredictable, even if the global state is stable or characteristic. The predictability is high for the *type* of global order, but lower for the exact microscopic configuration at any given time. No quantitative predictability metrics (e.g., based on information theory) are provided.
    * **Implicit/Explicit**: Mixed
    *  Justification: The state diagram (Fig 2a) explicitly shows predictable regions for different global behaviors based on Δ and ψ. The text explicitly links Γ to jamming/rotational states. This demonstrates predictability of the *type* of global order. The score assignment balances this macroscopic predictability with the inherent stochasticity at the microscopic level (implicit understanding of Langevin dynamics).
    *   CT-GIN Mapping: Contributes to the `AdjunctionEdge` weight linking local rules (`InteractionNode`) to global states (`ConfigurationalNode`).

### **4.5. Local Interaction Rules (for Self-Organization)**
* **Vector ID:** M4.5
* **Vector Type:** Table
*   Table:
| Rule ID          | Description                     | Parameter              | Value Range                | Units          | Implicit/Explicit | Justification                               | Source           |
| :--------------- | :------------------------------ | :--------------------- | :-------------------------: | :------------: | :----------------: | :------------------------------------------ | :--------------- |
| Vision Avoidance | Controls aversion to neighbors  | Relative Maneuverability (Δ) | Varied (e.g., 1 to 8+)    | Dimensionless  | Explicit          | Key parameter controlling interaction strength vs goal. | Text, Figs 2, 5  |
| Vision Avoidance | Determines field of view        | Vision Angle (ψ)       | Varied (e.g., π/4 to π)     | Radians        | Explicit          | Key parameter controlling interaction scope.  | Text, Figs 2, 5  |
| Goal Following   | Controls adherence to goal path | Goal Fixation (K)      | 8 * D<sub>r</sub>                | τ<sub>r</sub><sup>-1</sup>      | Explicit          | Fixed parameter setting baseline goal drive. | Text (Results)   |
| System Density   | Controls crowding             | Inflow Rate (Γ)        | Varied (e.g., 0.4 to 4)     | τ<sub>r</sub><sup>-1</sup>      | Explicit          | Controls agent density in interaction zone.   | Text, Fig 6      |

### **4.6. Globally Emergent Order and Order Parameters**
* **Vector ID:** M4.6
* **Vector Type:** Table
*   Table:
| Property ID           | Description                                     | Parameter                    | Value Range                  | Units       | Implicit/Explicit | Justification                                                | Protocol             | Source         |
| :-------------------- | :---------------------------------------------- | :--------------------------- | :---------------------------: | :---------: | :----------------: | :----------------------------------------------------------- | :------------------- | :------------- |
| Jamming/Percolation   | Cluster size distribution decay                 | Power-law exponent           | ~2.2                         | Dimensionless | Explicit          | Value consistent with percolation universality class stated. | Cluster analysis     | Fig 3a         |
| Localized Flocking    | Average alignment within clusters               | Average Cluster Polarization (P<sub>c</sub>) | ~0.5 (low Δ) to ~1 (high Δ) | Dimensionless | Explicit          | Defined in Eq. 16, plotted in Fig 3c.                      | Clustering, Eq. 16 | Fig 3c         |
| Localized Flocking    | Average size of clusters (all types)          | Mean Cluster Size (⟨n<sub>c</sub>⟩) | Increases strongly with Δ   | Dimensionless | Explicit          | Plotted in Fig 3d.                                         | Cluster analysis     | Fig 3d         |
| Localized Flocking    | Number of clusters                              | Number of Clusters (N<sub>c</sub>) | Increases strongly with Δ   | Count         | Explicit          | Plotted in Fig 3d.                                         | Cluster analysis     | Fig 3d         |
| System Flow           | Average speed of agents in interaction zone     | Average Velocity (⟨v⟩)     | Decreases with ρ (density) | v<sub>0</sub>    | Explicit          | Measured and plotted vs density in Fig 6b.                 | Velocity averaging | Fig 6b         |
| System Flow           | Overall throughput                              | Flux (J)                     | J = ρ⟨v⟩, see Fig 6a         | v<sub>0</sub>/R<sub>0</sub><sup>2</sup> | Explicit          | Measured and plotted vs density in Fig 6a.                 | Flux calculation   | Fig 6a         |
| System Density        | Average density in central interaction zone     | Density (ρ)                  | Varied via Γ, see Fig 6     | R<sub>0</sub><sup>-2</sup> | Explicit          | Calculated based on neighbor distance (Methods), plotted.    | Density calculation  | Fig 6a,b       |

### **4.7 Yoneda Embedding and Local-to-Global Mapping Fidelity**

*   **Vector ID:** M4.7
*   **Vector Type:** Table
*   Table: N/A
    *   **Yoneda Embedding Fulfillment Score [0-10]:** N/A
    *   **Metrics:** N/A
    *   **Justification:** The paper does not utilize Category Theory or concepts like the Yoneda embedding to analyze the local-to-global mapping. The relationship between local rules and global order is explored through simulation and analysis of emergent states via statistical measures (state diagrams, cluster analysis, flow diagrams), but not formal categorical methods.

## M5: Computation
*   **Vector ID:** M5
*   **Vector Type:** Computation

### **5.1 Embodied Computation Presence:**

*   **Vector ID:** M5.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The computation occurs within the simulation framework executing the model equations on a computer. The agents (iABPs) themselves are mathematical constructs following rules; they do not intrinsically perform computation based on their physical properties. The agents' "decisions" (changes in orientation) are direct calculations based on perceived inputs (positions/orientations of neighbors, goal direction) according to fixed rules (Eq. 4, 7, 8), not an emergent computational process within a physical material.
    *    Implicit/Explicit: Implicit
        *  Justification: The paper describes a simulation model. The absence of claims about the simulated particles *themselves* performing computation implies it's not present in the intended sense of embodied computation.

## M6: Temporal Dynamics
*   **Vector ID:** M6
*   **Vector Type:** Temporal

### **6.1 Timescales:**

*   **Vector ID:** M6.1
*   **Vector Type:** ParameterTable
    *   Table:
        | Timescale Description           | Value                | Units                 | Source           | Implicit/Explicit | Justification                                                                          |
        | :------------------------------ | :-------------------: | :-------------------: | :--------------: | :----------------: | :------------------------------------------------------------------------------------- |
        | Rotational Diffusion Time       | τ<sub>r</sub>        | s (implicit units)  | Text (Results)   | Explicit          | Defined as 1/D<sub>r</sub>, used as the fundamental unit for time scaling.               |
        | Simulation Time Step            | 0.0005               | τ<sub>r</sub>         | Methods          | Explicit          | Value used in Velocity-Verlet integration scheme.                                      |
        | Total Simulation Time           | 4000                 | τ<sub>r</sub>         | Methods          | Explicit          | Duration of each simulation run.                                                       |
        | Goal Passage Time (approx)      | t<sub>0</sub> = 2R<sub>int</sub>/v<sub>0</sub> | τ<sub>r</sub> (if Pe given) | Fig 4 caption    | Explicit          | Characteristic time to cross diameter, used for averaging path lengths.                  |
        | Correlation Time (Qualitative)  | Long (relative to τ<sub>r</sub>) | τ<sub>r</sub>         | Text (Dynamics...) | Mixed             | Inferred from H > 0.5 and slow C(t) decay; specific value not extracted.             |

### **6.2 Active Inference:**

*   **Vector ID:** M6.2
*   **Vector Type:** Assessment
    *   Content: No
    *   Justification: The agents operate based on reactive rules: they perceive the current state of neighbors within their vision cone and their goal direction, and calculate a torque to adjust their orientation accordingly (Eq. 8). There is no mention or evidence of agents (1) predicting future states of themselves or others, (2) explicitly minimizing a prediction error or surprise based on an internal model, or (3) possessing or updating an internal model of the environment or other agents' intentions. Their behavior is driven by immediate perception and fixed goals, characteristic of reactive agents rather than active inference agents.
    *   Implicit/Explicit: Implicit
        *  Justification: Based on the explicit description of the agent's behavioral rules (Eq. 1-8), the core components of active inference (prediction, error minimization, internal models) are absent.
    *   **If Yes/Partial, provide examples of testable CT-GIN metrics that *could* be used to quantify active inference:** N/A

## M7: Adaptation
*   **Vector ID:** M7
*   **Vector Type:** Adaptation

### **7.1 Adaptive Plasticity Presence:**

*   **Vector ID:** M7.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The agents' internal parameters (K, Ω, D_r, v_0, ψ, R_v) and the rules governing their behavior (Eq. 1-8) are fixed throughout a simulation run. While the system exhibits different collective behaviors depending on the *chosen* parameter values (Δ, ψ, Γ), the agents do not *change* their rules or parameters based on experience within a single simulation. There is no learning or adaptation mechanism described that modifies agent behavior over time beyond the immediate reaction to the changing environment (positions/orientations of neighbors).
    *    Implicit/Explicit: Implicit
        * Justification: The paper describes the model with fixed parameters for given simulation runs. The absence of any mention of parameter updates, learning rules, or changes in agent strategy based on past performance implies adaptive plasticity is not a feature of the model.

## M8: Emergent Behaviors
*   **Vector ID:** M8
*   **Vector Type:** Behavior

### **8.1 Behavior Description:**

*   **Vector ID:** M8.1
*   **Vector Type:** Description
    *   Content: The main functional behaviors are emergent collective movement patterns of the agent population within the three-way intersection, depending on parameters:
        1.  **Unhindered Passage:** Agents move towards goals with minimal deviation. (Low Δ)
        2.  **Scattering:** Disordered, seemingly random movement with frequent avoidance maneuvers. (Intermediate Δ, ψ ≥ π/2)
        3.  **Jamming/Percolation:** Formation of high-density clusters, slow movement, and system-spanning clusters. (High Δ, ψ=π)
        4.  **Localized Flocking:** Formation of temporary, co-moving clusters aligned locally. (Intermediate/High Δ, ψ < π/2)
        5.  **Rotational Flow:** Organized circular motion around the intersection center. (High Γ, ψ=π/2)
        Individual agent behavior is characterized by super-diffusive motion resembling fractional Brownian motion or Lévy walks (Fig 5).
    *   CT-GIN Mapping: Defines `BehaviorArchetypeNode` for each collective state (e.g., `Behavior=LocalizedFlocking`, `Behavior=JammingPercolation`) and for individual dynamics (`Behavior=fBM/LW`).
    *    Implicit/Explicit: Explicit
       *  Justification: These behaviors are explicitly described and named in the Results section (Dynamic state diagram, Cluster-size distributions, Dynamics..., Dependence on inflow rate) and illustrated in figures.

### **8.2 Behavior Robustness:**

*   **Vector ID:** M8.2
*   **Vector Type:** Score
    *   Score: 6
    *   Justification: The different collective behaviors (flocking, jamming, scattering, etc.) appear as distinct phases in the parameter space (Δ, ψ, Γ) as shown in the state diagram (Fig 2a) and flow diagram analysis (Fig 6). This suggests the behaviors are robust within certain parameter ranges. The fundamental flow diagram showing data collapse for different ψ (Fig 6) further indicates robustness of the overall flow characteristics. However, the transitions between states might be sensitive to parameter changes near phase boundaries. Robustness against noise is inherent (stochastic dynamics), but sensitivity to specific noise levels (D_r) or other perturbations (e.g., agent heterogeneity, environmental obstacles - not studied here) is not quantified. The score reflects the observation of stable phases but acknowledges the lack of specific perturbation analysis.
    *   Implicit/Explicit: Mixed
        *  Justification: The existence of distinct phases across parameter ranges (Fig 2a, Fig 6) is explicit evidence for robustness. The interpretation of this robustness in the absence of specific perturbation studies and quantification leads to a mixed assessment.
    *   CT-GIN Mapping: Contributes to reliability attributes of the relevant `BehaviorArchetypeNode`.

### **8.3 CT-GIN Emergent Behavior Validation**

*    **Vector ID:** M8.3
*    **Vector Type:** Validation
     *  Content: Claims of emergent behaviors are validated through:
        1.  **Visualisation:** Agent trajectories are plotted for different parameter regimes, providing qualitative visual evidence of patterns like scattering, flocking, jamming, and rotation (Fig 2b-e, Fig 6c). Snapshots and movies (Supplementary) support this.
        2.  **State Diagram:** A phase diagram (Fig 2a) maps observed collective states onto the parameter space (Δ, ψ), quantitatively delineating regions where different behaviors emerge.
        3.  **Quantitative Analysis:**
            *   Cluster Analysis: Cluster size distributions (Fig 3a) are analyzed, showing power-law scaling for the jammed/percolation state, consistent with percolation theory. Average cluster size and polarization (Fig 3c,d) quantify the localized flocking state.
            *   Dynamical Analysis: MSD and orientational correlation functions (Supp Fig S1) are calculated and fitted to fBM/LW models (Fig 5a,b) to characterize single-particle dynamics within the collective states. Path length distributions are analyzed (Fig 4).
            *   Flow Analysis: Fundamental diagrams (Flux vs Density, Velocity vs Density) are constructed (Fig 6) to characterize macroscopic flow properties and identify jamming transitions. Local density plots (Fig 7) visualize flow patterns.
        *   **Limitations:** Validation relies on simulation results. Comparison to experimental pedestrian data is limited (mention of log-normal path lengths matching antipode experiments). Robustness tests against model variations or different noise types are not presented.
     *   Implicit/Explicit: Explicit
    *   Justification: The methods used for validation (visualization, state diagrams, cluster analysis, dynamical analysis, flow diagrams) are explicitly described in the Results section and Methods, with supporting figures.

## M9: Cognitive Proximity
*   **Vector ID:** M9
*   **Vector Type:** Cognition

### **9.1 Cognitive Mapping:**

*   **Vector ID:** M9.1
*   **Vector Type:** Description
    *   Content: Yes, the paper explicitly uses cognitive language and draws analogies to cognitive processes in pedestrians and animals. Terms used include: "cognitive active agents," "intelligent active Brownian particles (iABPs)," "directed visual perception," "cognitive information processing," "self-steering avoidance," "vision-based sensing and cognitive steering," and comparison to "pedestrian crowds" and "animal herds." The vision-based avoidance mechanism (Eq. 4-6) is presented as a model for how pedestrians or animals might visually perceive and react to neighbors to avoid collisions. Goal-following (Eq. 7) models purposeful movement. The emergent collective behaviors are discussed in the context of pedestrian dynamics phenomena (jamming, lane formation implicitly contrasted, roundabout flow). Limitations: The "cognition" is limited to reactive perception-action loops based on simple rules; there's no evidence of higher-level reasoning, planning, learning (beyond persistence effects), or internal state representation beyond position/orientation.
    *   CT-GIN Mapping: Defines `CognitiveMappingEdge` from `SystemNode` or specific `InteractionNode`s (e.g., `VisionInteraction`, `GoalFollowing`) and `BehaviorArchetypeNode`s (e.g., `Jamming`, `Flocking`) to potential `CognitiveFunctionNode`s (e.g., `Perception`, `CollisionAvoidance`, `GoalNavigation`, `CollectiveMovement`).
    *   Implicit/Explicit: Explicit
    * Justification: The paper consistently uses cognitive terminology ("cognitive active agents," "intelligent ABPs," "visual perception," "cognitive steering") and explicitly relates the model and results to pedestrian and animal behavior throughout the introduction and discussion.

### **9.2 Cognitive Proximity Score:**

*   **Vector ID:** M9.2
*   **Vector Type:** Score
    *   Score: 2
    *   Justification: The system models agents with perception (vision cone) and goal-directedness, leading to complex emergent collective behaviors analogous to pedestrian/animal groups. This fits Level 2 (Sub-Organismal Responsivity) as the behavior goes beyond simple stimulus-response and involves interactions and internal direction (goal). However, it clearly falls short of higher levels. There is no adaptation based on experience (Level 3 requires plasticity), no internal world model for planning (Level 4), no understanding of relationships (Level 5), and certainly no abstract reasoning (Level 6+) or self-awareness. The agents are fundamentally reactive, following pre-programmed rules based on immediate sensory input and a fixed goal. The observed "memory" (fBM/LW) is statistical persistence, not cognitive recall. While the emergent collective patterns are complex, the underlying agent "cognition" is minimal and reactive.
    *   Implicit/Explicit: Mixed
    *  Justification: The score is based on interpreting the explicitly described agent rules and emergent behaviors against the provided Cognizance Scale definitions. The model exhibits features aligning with Level 2, while explicitly lacking features required for higher levels.

**CT-GIN Cognizance Scale:** (Provided for reference in scoring)
*   Level 0: Non-Cognitive
*   Level 1: Simple Responsivity
*   **Level 2: Sub-Organismal Responsivity**
*   Level 3: Reactive/Adaptive Autonomy
*   Level 4: Goal-Directed/Model-Based Cognition
*   ... (Levels 5-10)

### **9.3 Cognitive Function Checklist**

* **Vector ID:** M9.3
* **Vector Type:** Checklist
    *   | Cognitive Function               | Score (0-10) | Justification/Notes                                                                       | CT-GIN Mapping (if applicable) | Implicit/Explicit | Justification for Implicit/Explicit/Mixed |
    | :-------------------------------- | :----------: | :------------------------------------------------------------------------------------ | :--------------------------------: | :-----------------:|:-----------------:|
    | Sensing/Perception               |      3       | Limited, reactive visual perception of neighbor positions/orientations within a cone (Eq. 6). No object recognition, scene understanding. | `InteractionNode` (Vision)         | Explicit          | Explicitly modelled via vision cone and torque calculation.               |
    | Memory (Short-Term/Working)        |      0       | Absent. Agents react to instantaneous state.                                            | `MemoryNode` (Type=None)           | Implicit          | No mechanism described for holding/manipulating info over short term.   |
    | Memory (Long-Term)                 |      1       | Only statistical persistence (H>0.5, slow C(t) decay). No encoding/retrieval of specific info. | `MemoryNode` (Type=TemporalCorr.)   | Mixed             | fBM/LW dynamics explicit, interpretation as LTM is weak/metaphorical. |
    | Learning/Adaptation              |      0       | Absent. Rules and parameters are fixed.                                               | `AdaptationNode` (Type=None)       | Implicit          | No mechanism described for changing behavior based on experience.       |
    | Decision-Making/Planning          |      1       | Minimal, reactive "decision" to turn based on torques (Eq. 8). No lookahead, strategy selection, or planning. | `InteractionNode` (Torque Calc)    | Mixed             | Torque calculation explicit, interpretation as decision-making is weak. |
    | Communication/Social Interaction |      2       | Implicit interaction via visual avoidance torque (Eq. 4). No explicit communication signals. | `InteractionEdge` (Vision)       | Explicit          | Interaction mechanism explicitly modelled.                           |
    | Goal-Directed Behavior            |      4       | Explicit goal-following torque (Eq. 7) drives directed motion towards a target. Simple form. | `GoalFollowingEdge`              | Explicit          | Goal torque explicitly modelled.                                     |
    | Model-Based Reasoning              |      0       | Absent. Agents react directly to perception, no internal world model used for reasoning/prediction. | N/A                                | Implicit          | No evidence of internal models or prediction mechanisms.            |
    | **Overall score**                 |     **1.38**      | Reflects primarily reactive agents with simple perception, goal-following, and interaction. |                                   |                     |                |    

## M10: Criticality Assessment
*   **Vector ID:** M10
*   **Vector Type:** Criticality

### **10.1 Criticality:**

*   **Vector ID:** M10.1
*   **Vector Type:** Assessment
    *   Content: Yes/Partial
    *   Justification: The paper provides evidence suggesting operation near critical points in certain regimes:
        1.  **Percolation:** In the jammed state (high Δ, ψ=π), the cluster size distribution exhibits a power-law decay `P[n_c] ~ n_c^{-2.2}` (Fig 3a), which is explicitly stated to be "consistent with the percolation universality class". This strongly suggests the system is near a percolation critical point.
        2.  **Jamming Transition:** The fundamental diagram analysis (Fig 6, 7) shows a transition to a jammed state at high inflow rates `Γ` for `ψ=π`, marked by a sudden density increase and velocity decrease. While not explicitly analyzed in terms of critical exponents, jamming transitions in active matter systems are often associated with critical phenomena.
        The paper doesn't systematically explore criticality across the whole phase space or measure critical exponents beyond the percolation cluster size, hence "Partial".
        *   Critical Parameters (If Yes/Partial): Relative Maneuverability (Δ), Vision Angle (ψ), Inflow Rate (Γ)/Density (ρ).
        *   Evidence: Fig 3a (power-law cluster size distribution), Text describing consistency with percolation universality class. Fig 6, Fig 7 showing jamming transition at critical density/inflow for specific ψ.
    *   Implicit/Explicit: Mixed
    *    Justification: The link to percolation universality class via the power-law exponent is explicitly stated. The observation of a jamming transition is explicit. Interpreting the jamming transition itself as evidence of criticality (common in the field, but not explicitly analyzed as such here) is implicit.

## M11: Review Paper Specifics (Conditional)
*   **Vector ID:** M11
*   **Vector Type:** Review
*   N/A (Paper is Theoretical/Computational)

## M12: Theoretical Paper Specifics (Conditional)
*   **Vector ID:** M12
*   **Vector Type:** Theory

### **12.1 Theoretical Rigor:**

*   **Vector ID:** M12.1
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The theoretical framework is based on the well-established Active Brownian Particle (ABP) model, extended with specific, mathematically defined vision-based and goal-following torques. The dynamics are described by standard Langevin equations (Eq. 1, 8). Assumptions (overdamped motion, point particles, specific interaction forms) are clearly stated or implied by the model choice. The mathematical derivations presented (e.g., simplifying Eq. 2 to Eq. 8) appear sound. The model is internally consistent. The comparison to fBM/LW models is appropriate for characterizing the observed dynamics. Rigor could be rated higher if more detailed mathematical analysis of the model's properties (e.g., stability analysis, derivation of phase boundaries) were included, but for a simulation-focused study, the theoretical basis is solid.
       * Implicit/Explicit: Mixed
       *  Justification: The core equations and model components are explicit. The assessment of soundness and consistency is based on comparing these to standard practices in the field (implicitly known theoretical background).

### **12.2 Realization Potential:**

*   **Vector ID:** M12.2
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: The model aims to simulate pedestrian or animal group behavior. Physical realization could mean:
        1.  **Robotic systems:** Implementing similar vision-based avoidance and goal-following algorithms in a swarm of simple robots is highly feasible.
        2.  **Active Colloids:** Engineering colloidal particles with directional sensing and response (e.g., via phoretic or magnetic means) to mimic the vision/goal mechanisms is challenging but conceptually possible, representing a frontier in active matter research.
        3.  **Biological systems:** The model serves as an abstraction of pedestrian/animal behavior. Direct 'realization' isn't the goal, but validating the model against real biological system data is possible (as partially done by comparing path lengths to antipode experiments).
    The model uses point particles (no volume exclusion), which simplifies realization compared to models needing specific shapes/sizes. Overdamped dynamics are appropriate for many microscale/biological systems. The specific form of vision interaction might be hard to replicate perfectly. The score reflects high potential in robotics/simulation and moderate potential in direct material/biological systems.
    *   Implicit/Explicit: Mixed
    *  Justification: The paper explicitly links the model to pedestrians/animals/active matter. Assessing the feasibility requires knowledge of current experimental capabilities in robotics and active matter (implicit knowledge).

### **12.3 Potential for Future CT-GIN Implementation Score**

* **Vector ID:** M12.3
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The paper presents a clear example of complex emergent collective behavior arising from well-defined local interaction rules among relatively simple agents. This structure is highly amenable to CT-GIN analysis. Local rules (interactions, goal following, noise) can be mapped to GIN edge types/attributes, agents to nodes, and emergent global states (flocking, jamming, etc.) to configurations or behaviors. Analyzing the relationship between local rule parameters (Δ, ψ, Γ) and global emergent states via the CT-GIN framework could provide deeper insights into the principles governing self-organization in such systems. The clearly defined components and interactions facilitate the construction of a meaningful knowledge graph. The focus on emergence from local rules aligns well with CT-GIN goals.
    *    Implicit/Explicit: Mixed
    *   Justification: The clear definition of local rules and emergent states is explicit. Assessing the *potential* for applying CT-GIN requires an understanding of the CT-GIN framework and how well the paper's structure maps onto it (implicit framework knowledge applied to explicit paper content).

## M13: Overall Assessment & Scoring

*   **Vector ID:** M13
*   **Vector Type:** Overall

### **13.1 CT-GIN Readiness Score:**

*   **Vector ID:** M13.1
*   **Vector Type:** Score
*   **Calculated Score:** 4.57 (Average of M1.2(9), M2.3(0 - N/A treated as 0), M3.2(2), M4.4(7), M5.1(0 - No), M8.2(6), M9.2(2)) *Note: Corrected calculation includes M5.1 as 0 since computation is absent.*

**CT-GIN Readiness Summary Table:**

| CT-GIN Aspect                   | Strength (Yes/Partial/No) | Key Supporting Metrics (with units) | Limitations (Missing Metrics/Data Gaps)                                           | Improvement Areas (Future Research)                                          |
| :------------------------------ | :-----------------------: | :-----------------------------------| :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| Energy Flow Efficiency          | No                       | N/A                                  | No thermodynamic analysis; overdamped model ignores efficiency.                  | Incorporate energy costs for sensing/action; analyze thermodynamic efficiency. |
| Memory Fidelity                 | Partial                  | Hurst Exp. H ~ 0.8-0.9; Slow C(t) decay | Only statistical persistence; no info encoding/retrieval; poor cognitive mapping. | Implement internal states, learning rules for true adaptive memory.           |
| Organizational Complexity       | Yes                      | State Diagram (Fig 2a); Cluster Metrics (Fig 3); Flow Diagram (Fig 6) | Limited quantification of transition dynamics; no formal local-global mapping. | Deeper analysis of phase transitions; application of CT methods (Yoneda).      |
| Embodied Computation            | No                       | N/A                                  | Computation is external simulation; agents are reactive.                         | Explore models where material properties themselves compute (e.g., physical RC). |
| Temporal Integration            | Yes                      | fBM/LW exponents (Fig 5); Correlation decay (Supp Fig S1) | Limited analysis beyond fBM/LW fitting; no active inference.                 | Analyze higher-order correlations; explore models with predictive capabilities. |
| Adaptive Plasticity             | No                       | N/A                                  | Fixed agent rules/parameters within simulation.                                  | Implement learning mechanisms (e.g., reinforcement learning) to adapt rules.   |
| Functional Universality         | Partial                  | Fundamental Diagram Collapse (Fig 6) | Limited set of behaviors explored; model specific to scenario.                   | Test model in different environments; explore wider range of tasks.           |
| Cognitive Proximity            | Partial                  | Cognitive language used; Analogies to pedestrians/animals | Low cognitive score (Level 2); reactive agents; lacks higher functions.        | Incorporate internal models, planning, learning for higher cognitive fidelity. |
| Design Scalability & Robustness | Partial                  | Stable phases observed (Fig 2a, 6)    | Limited robustness testing; point particles simplify physical realization.      | Analyze sensitivity to noise/perturbations; incorporate finite size/volume.    |
| **Overall CT-GIN Readiness Score** |        **4.57**           |                                      |                                                                                  |                                                                               |


### **13.2 Qualitative CT-GIN Assessment Conclusion:**

*   **Vector ID:** M13.2
*   **Vector Type:** Textual Summary
    *   Content: This paper presents a well-defined computational model of intelligent Active Brownian Particles (iABPs) exhibiting complex emergent self-organization at a three-way intersection, analogous to pedestrian dynamics. Its key strength lies in the clear definition of local interaction rules (vision-based avoidance, goal-following) and the detailed characterization of multiple emergent global states (scattering, flocking, jamming/percolation, rotation) through simulation and quantitative analysis (state diagrams, cluster metrics, flow diagrams, dynamical exponents). The model demonstrates how simple, non-reciprocal local interactions coupled with goal directionality can lead to rich collective behavior. However, from a CT-GIN perspective focused on material intelligence, significant limitations exist. The system lacks genuine embodied computation, adaptive plasticity (learning), and cognitive memory beyond statistical persistence. Energy flow analysis is absent due to the overdamped model focus. While cognitive language is used, the agents remain fundamentally reactive, scoring low on cognitive proximity (Level 2). Overall, the paper provides an excellent foundation for studying emergence from local rules, highly suitable for graph-based analysis within CT-GIN, but the modeled system itself represents a low level of material intelligence, primarily demonstrating complex responsiveness and self-organization without adaptation or computation.
### **13.3 CT-GIN Refinement Directions:**

*   **Vector ID:** M13.3
*   **Vector Type:** Recommendations
    *   Content:
        *   **Introduce Adaptive Plasticity:** Modify agent rules (e.g., vision angle ψ, relative maneuverability Δ) based on experience (e.g., collision frequency, goal achievement time) using reinforcement learning or similar mechanisms.
        *   **Implement Internal State/Memory:** Add internal state variables to agents that store information about past interactions or environmental conditions, influencing future decisions beyond immediate perception (e.g., remembering crowded areas).
        *   **Model Embodied Computation:** Explore physical realizations (e.g., using active colloids or robotic swarms) where sensing, processing, and actuation are intrinsically linked within the agent's physical structure, moving beyond simulation.
        *   **Incorporate Volume Exclusion:** Replace point particles with finite-sized agents to study the interplay between steering-based avoidance and physical collisions, particularly relevant at higher densities.
        *   **Analyze Thermodynamic Costs:** Extend the model to include energy consumption associated with sensing (vision), computation (torque calculation), and actuation (steering), allowing for analysis of energy efficiency.
        *   **Quantify Robustness:** Systematically study the robustness of emergent states to various perturbations (e.g., noise levels, parameter heterogeneity, environmental obstacles).
        *   **Apply Formal CT Methods:** Use concepts like the Yoneda Lemma to formally analyze the mapping between local interaction rules and emergent global structures, quantifying information flow and predictability.

## M14: CT-GIN Knowledge Graph

*   **Vector ID:** M14
*   **Vector Type:** Visualization

### **14.1. CT-GIN Knowledge Graph:**
* **Content:**
```mermaid
graph TD
    %% Nodes
    Sys(System: iABP Simulation @ Intersection);
    Mod(Model: iABP Langevin);
    Env(Environment: 3-Way Intersection);
    Param(Parameters: Δ, ψ, Γ, K, D<sub>r</sub>, v<sub>0</sub>, R<sub>v</sub>);
    Agent(Component: iABP Agent);
    Vis(Local Rule: Vision Interaction);
    Goal(Local Rule: Goal Following);
    Noise(Local Rule: Rotational Noise);
    Prop(Local Rule: Propulsion/Friction);
    StateSO(Global State: Self-Organization);
    StateSc(SO State: Scattering);
    StateFl(SO State: Localized Flocking);
    StateJam(SO State: Jamming/Percolation);
    StateRot(SO State: Rotational Flow);
    Dyn(Dynamics: fBM/LW);
    Mem(Memory: Temporal Correlation);
    Cog(Cognitive Mapping: Level 2);
    Crit(Criticality: Percolation/Jamming);

    %% Edges
    Sys -->|Contains| Mod;
    Sys -->|Contains| Env;
    Mod -->|Uses| Agent;
    Mod -->|Defined by| Param;
    Agent -->|Subject to| Vis;
    Agent -->|Subject to| Goal;
    Agent -->|Subject to| Noise;
    Agent -->|Subject to| Prop;
    Vis -->|Characterized by| Param;
    Goal -->|Characterized by| Param;
    Noise -->|Characterized by| Param;
    Prop -->|Characterized by| Param;
    Agent -- Interaction --> Agent;

    subgraph "Local Rules & Dynamics"
        Vis; Goal; Noise; Prop; Agent; Dyn; Mem
    end

    subgraph "Emergence & Global Order"
        StateSO; StateSc; StateFl; StateJam; StateRot; Crit; Cog;
    end

    Agent -- Collective Behavior --> StateSO;
    StateSO -->|Manifests as| StateSc;
    StateSO -->|Manifests as| StateFl;
    StateSO -->|Manifests as| StateJam;
    StateSO -->|Manifests as| StateRot;

    Prop -->|Leads to| Dyn;
    Goal -->|Contributes to| Dyn;
    Vis -->|Contributes to| Dyn;
    Noise -->|Contributes to| Dyn;
    Dyn -->|Exhibits| Mem [H~0.8-0.9];

    StateSO -->|Implies Low| Cog [Score=2];
    StateJam -->|Related to| Crit [Exponent=2.2];
    StateSO -->|Dependent on| Param;

    %% Styling (Optional)
    classDef component fill:#f9f,stroke:#333,stroke-width:2px;
    classDef rule fill:#ccf,stroke:#333,stroke-width:2px;
    classDef state fill:#cfc,stroke:#333,stroke-width:2px;
    class Agent,Env component;
    class Vis,Goal,Noise,Prop rule;
    class StateSO,StateSc,StateFl,StateJam,StateRot,Dyn,Mem,Cog,Crit state;
```
*(Note: This Mermaid graph is a simplified representation. A full GIN would capture more detailed attributes on nodes and edges based on the tables above.)*

## M15: Relationship Vectors
*   **Vector ID:** M15
*   **Vector Type:** Relationships
*   Relationships:
        | Source Vector ID | Target Vector ID | Relationship Type |
        | ------------- | ------------- | ----------------- |
        | M1.1          | M4.2          | Defines Components For |
        | M4.2          | M4.1 / M4.3   | Drives / Leads To |
        | M1.3          | M4.3          | Determines        |
        | M1.3          | M8.1          | Determines        |
        | M4.3          | M8.1          | Characterizes     |
        | M4.2          | M3.1 / M3.3   | Generates         |
        | M6.1          | M3.3          | Defines Timescale Of |
        | M8.1          | M9.1          | Is Analogous To   |
        | M9.1          | M9.2          | Justifies         |
        | M4.3          | M10.1         | Exhibits Near     |
        | M1.1          | M12.1/M12.2   | Is Assessed For   |
        | M1-M10        | M13.1         | Aggregates Into   |
        | M13.1         | M13.2         | Is Summarized By  |
        | M13.2         | M13.3         | Motivates         |

## M16: CT-GIN Template Self-Improvement Insights

*   **Vector ID:** M16
*   **Vector Type:** Feedback

### **Template Feedback:**

*    **Vector ID:** M16.1
*   **Vector Type:** Text
    *   **Missing Probes:**
        *   A probe specifically targeting the *mechanism* of emergence (how local rules map to global order) beyond just listing rules and order might be useful, perhaps related to information transfer or amplification. M4.7 tries, but Yoneda might be too specific/advanced for many papers. Maybe a qualitative 'Mechanism of Emergence' description?
        *   Probe for explicit comparison/validation against experimental data could be stronger/more distinct.
    *   **Unclear Definitions:**
        *   "Embodied Computation" (M5.1) could be slightly ambiguous. Does simulation of physics count if the physics *could* compute (like physical reservoir computing)? The current use implies computation *by* the material itself, which is good, but maybe needs an explicit clarification/boundary definition.
        *   The line between 'Memory' (M3) as persistence vs. cognitive memory could be sharpened in the M3.1 justification prompt or M3.2 scoring guide.
        *   "Yoneda Embedding Fulfillment Score" (M4.7) is highly specific and likely requires significant external knowledge/interpretation beyond what most experimental/simulation papers provide. It might be better suited for purely theoretical CT papers or need simplification/rephrasing for broader applicability (e.g., "Local-to-Global Mapping Fidelity Score").
    *   **Unclear Node/Edge Representations:** Guidance is generally clear, but providing example Mermaid/GraphViz syntax alongside the abstract CT-GIN mapping suggestions could make M14 more directly usable. Specifying whether an attribute belongs on a Node vs. Edge could sometimes be clearer in the prompts.
    *   **Scoring Difficulties:**
        *   Scoring "Cognitive Proximity" (M9.2) relies heavily on the provided scale, which is helpful but inherently subjective, especially at lower levels. Providing more concrete examples for each level within the rubric might help consistency.
        *   Scoring "Robustness" (M8.2) is often difficult without specific perturbation studies in the paper, leading to reliance on qualitative assessment. The prompt acknowledges this, which is good.
        *   Handling N/A values in the `CT-GIN Readiness Score` calculation needed explicit clarification (clarified here as converting to 0).
    *   **Data Extraction/Output Mapping:**
        *   Some parameters might be defined differently across papers (e.g., characteristic timescales). The template requires selecting key ones, which works but might lose some nuances.
        *   Tables (e.g., M3.7, M3.8, M4.2.1, M4.5, M4.6, M5.4) are often entirely N/A for simulation papers lacking detailed performance/cost analysis. This is expected but leads to sparse sections.
    *   **Overall Usability:** The template is extremely comprehensive and detailed, forcing rigorous analysis. However, its length and specificity mean applying it is time-consuming. For papers clearly lacking certain features (e.g., computation, adaptation), the conditional skipping helps, but many sections still require careful "N/A" or "No" justifications. The strict formatting rules are critical but demanding.
    * **Specific Suggestions:**
        *   Add a brief "How to handle N/A in scoring" note near M13.1.
        *   Simplify or provide a more generally applicable alternative to M4.7 (Yoneda).
        *   Consider adding explicit examples to the Cognitive Proximity scale levels (M9.2).
        *   Perhaps add an optional 'Model Limitations' subsection under M1, distinct from implementation clarity, specifically for theoretical/computational papers to discuss inherent model assumptions/simplifications.