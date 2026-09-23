# Hydrodynamic pursuit by cognitive self-steering microswimmers

__Paper Type:__ Theoretical/Computational

## M1: System Overview & Implementation
*   **Vector ID:** M1
*   **Vector Type:** Overview

### **1.1 System Description**

*   **Vector ID:** M1.1
*   **Vector Type:** Description
    *   Content: The system comprises two interacting microswimmers (a pursuer and a target) modelled as spherical squirmers immersed in a fluid simulated using Multiparticle Collision Dynamics (MPC). The target moves with a prescribed propulsion (straight or helical trajectory) characterised by speed v_t and stresslet parameter β (pusher/puller). The pursuer is an "intelligent Squirmer" (iSquirmer) with speed v_p and the same β. Its key feature is self-steering: it adapts its surface flow field (non-axisymmetric modes) to generate an angular velocity ω0 aimed at reorienting its propulsion direction e_p towards a desired direction e_aim. Two steering strategies are studied: (1) Reorientation towards the target's position (e_aim = e_c = r_c/|r_c|), and (2) Alignment with the target's propulsion direction (e_aim = e_t) combined with speed adaptation based on relative position (accelerating when behind, decelerating when ahead). The purpose is to investigate pursuit dynamics, capture strategies, and stable cooperative states mediated by hydrodynamic interactions and influenced by thermal noise, swimmer type (pusher/puller), and steering parameters (Péclet number Pe, maneuverability Ω). It also explores how the pursuer can influence the target's trajectory.
    *   CT-GIN Mapping: `SystemNode` attributes: `systemType`: "Multi-agent microswimmer simulation", `domain`: "Fluid Dynamics, Active Matter", `mechanism`: "Hydrodynamics, Stochastic Dynamics, Self-Steering Control", `components`: ["iSquirmer (Pursuer)", "Squirmer (Target)", "MPC Fluid", "Steric Repulsion Potential"], `purpose`: "Investigate hydrodynamic pursuit strategies and emergent cooperative states"
    *   Implicit/Explicit: Explicit
        *  Justification: The paper explicitly describes the components (squirmers, fluid), their properties (pusher/puller, β, speeds), the simulation method (MPC), the interaction potentials (steric), the steering mechanisms (Eqs. 1, 10-14, 19), and the research goals.

### **1.2 Implementation Clarity**

*   **Vector ID:** M1.2
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The paper clearly describes the model components (squirmers, fluid), the simulation method (MPC), the governing equations for propulsion (Eqs. 7-9), steering (Eqs. 1, 10-12), speed adaptation (Eqs. 19-22), and steric interactions (Eq. 23). Key dimensionless parameters (Pe, Ω, α, β, ξ) are defined (Eq. 2). Simulation setup details (box size, particle numbers, timestep, etc.) are provided in the Methods section. Some details (e.g., specific parameter derivation for helical motion, exact MBS thermostat implementation details) might require consulting supplementary info or cited works, slightly reducing the score from 10.
    *   Implicit/Explicit: Mixed
        * Justification: Most implementation details are explicitly stated in the Methods section, including equations and simulation parameters. Some finer points might rely on implicit understanding from cited standard methods (MPC, squirmer model).

### **1.3 Key Parameters**

*   **Vector ID:** M1.3
*   **Vector Type:** ParameterTable
    *   Table:
        | Parameter Name | Value | Units | Source (Fig/Table/Section) | Implicit/Explicit | Data Reliability (High/Medium/Low) | Derivation Method (if Implicit) |
        | :------------- | :---: | :---: | :-----------------------: | :-----------------: | :-----------------------------: | :-------------------------------: |
        | Squirmer Stresslet (β) | ±3 | Dimensionless | Main Text (Results) / Methods | Explicit | High | N/A |
        | Péclet Number (Pe) | 8, 32, 128 | Dimensionless | Methods / Fig 2, 3, 4, 5 | Explicit | High | N/A |
        | Maneuverability (Ω) | Varied (e.g., ≤ 4Pe, 75.9, 8Ω_hel) | Dimensionless (in units of D_R) | Methods / Fig 2, 3, 4, 5 | Explicit | High | N/A |
        | Speed Ratio (α = v_t/v_p) | Varied (e.g., 0.6, 1.0, 1.4) | Dimensionless | Fig 2, S1, S5 | Explicit | High | N/A |
        | Speed Adaptation Friction (κ) | 1 | Dimensionless | Fig 4, 5 (Caption) | Explicit | High | N/A |

## M2: Energy Flow
*   **Vector ID:** M2
*   **Vector Type:** Energy

### **2.1 Energy Input**

*   **Vector ID:** M2.1
*   **Vector Type:** Input
    *   Content: Energy input is implicitly chemical potential energy converted into mechanical work via the prescribed surface slip velocity (u_sq) on both squirmers. This active process drives self-propulsion and overcomes viscous drag. Additionally, thermal energy from the environment drives Brownian motion (accounted for by MPC fluid and D_R). For steering and speed adaptation, there's an implicit energy cost associated with modifying the surface flow field (changing C_11, C~11, B_1 parameters).
    *   Value: N/A (Not quantified in terms of standard energy units like Joules)
    *   Units: N/A
    *   CT-GIN Mapping: `EnergyInputNode`: attributes - `source`: ["Chemical Potential (implicit)", "Thermal Bath"], `type`: ["Active Propulsion", "Brownian Motion", "Control Actuation"]
    *   Implicit/Explicit: Implicit
        *  Justification: The paper describes the propulsion mechanism (surface slip) and thermal environment (MPC, D_R) but does not explicitly quantify energy input rates or sources in physical units. The energy source is inherent to the active nature of the squirmer model.

### **2.2 Energy Transduction**

*   **Vector ID:** M2.2
*   **Vector Type:** Transduction
    *   Content: Implicit Chemical Energy -> Kinetic Energy of squirmer motion (translation and rotation) via surface slip velocity (u_sq). Kinetic Energy -> Fluid Kinetic Energy via viscous interactions (hydrodynamic coupling). Thermal Energy -> Squirmer Kinetic Energy (Brownian motion). Implicit Control Energy -> Squirmer Rotational Kinetic Energy (steering via modification of non-axisymmetric flow modes C_11, C~11). Implicit Control Energy -> Squirmer Translational Kinetic Energy (speed adaptation via modification of B_1). Energy is also transduced between squirmers via hydrodynamic interactions and steric repulsion forces.
    *   CT-GIN Mapping: `EnergyTransductionEdge`: attributes - `mechanism`: ["Surface Slip Propulsion", "Viscous Drag", "Hydrodynamic Interaction", "Thermal Fluctuation", "Steric Repulsion", "Steering Actuation", "Speed Adaptation"], `from_node`: ["ChemicalPotential", "ThermalBath", "ControlSystem", "SquirmerKinetic"], `to_node`: ["SquirmerKinetic", "FluidKinetic", "SquirmerPotential(Steric)"]
    *   Implicit/Explicit: Implicit
        *  Justification: The paper describes the physical processes (propulsion, hydrodynamics, steering, noise, repulsion) through which energy is exchanged and transformed, but not in terms of explicit energy conversion pathways or efficiencies.

### **2.3 Energy Efficiency**

*   **Vector ID:** M2.3
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification/Metrics: The paper does not discuss or quantify the thermodynamic efficiency of propulsion, steering, or speed adaptation (e.g., work done against drag / energy input). Efficiency is not a focus of the study. Qualitatively, microswimmer propulsion at low Reynolds numbers is known to be generally inefficient.
    *   CT-GIN Mapping: Attribute of relevant `EnergyTransductionEdge`s
    *   Implicit/Explicit: N/A
      *  Justification: No information provided in the text.

### **2.4 Energy Dissipation**

*   **Vector ID:** M2.4
*   **Vector Type:** Dissipation
    *   Content: Energy is primarily dissipated through viscous friction between the squirmers and the surrounding fluid (inherent in the low Reynolds number regime and MPC simulation). This dissipation occurs during translation, rotation, and due to the flow fields generated by the surface slip velocities. Dissipation also occurs implicitly during the steric repulsion interactions (energy lost/gained during collision compression/decompression is ultimately dissipated viscously). The MPC method itself conserves momentum locally but globally dissipates energy consistent with fluid viscosity. Thermal fluctuations represent an equilibrium energy exchange, not net dissipation, but contribute to random motion which is then damped viscously.
    *   CT-GIN Mapping: Creates `EnergyDissipationNode`s (e.g., "Viscous Damping") and `EnergyDissipationEdge`s (linking `SquirmerKinetic`, `FluidKinetic` to `ViscousDamping`)
    *    Implicit/Explicit: Implicit
        *  Justification: Viscous dissipation is inherent to the low Reynolds number physics and MPC simulation methodology described, but specific dissipation rates or mechanisms beyond viscous friction are not quantified or detailed.

## M3: Memory
*   **Vector ID:** M3
*   **Vector Type:** Memory

### **3.1 Memory Presence:**

*   **Vector ID:** M3.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The pursuer's steering and speed adaptation actions are based *only* on the *instantaneous* state of the system (relative position r_c or target orientation e_t). There is no mechanism described where past interactions or states persist and influence future decisions or dynamics beyond the current configuration. The system is Markovian in its control logic. While trajectories reveal the history of motion, the control decisions themselves do not rely on stored past information.
    *    Implicit/Explicit: Implicit
        * Justification: The control laws (Eqs. 1, 13, 14, 19) are defined based on current state variables (e_p, e_aim(r_c or e_t), v_p). The absence of terms integrating past states implies no memory in the control system.

**(Conditional: M3.1 is "No", skipping M3.2-M3.8)**

### **3.2 Memory Type:** N/A
### **3.3 Memory Retention Time:** N/A
### **3.4 Memory Capacity (Optional - if applicable)** N/A
### **3.5 Readout Accuracy (Optional - if applicable)** N/A
### **3.6 Degradation Rate (Optional - if applicable)** N/A
### **3.7 Memory Operations Energy Cost (Optional - if applicable)** N/A
### **3.8 Memory Fidelity & Robustness Metrics (Optional - if applicable)** N/A
---

## M4: Self-Organization and Emergent Order
*   **Vector ID:** M4
*   **Vector Type:** Self-Organization

### **4.1 Self-Organization Presence:**

*   **Vector ID:** M4.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: Stable cooperative states (e.g., head-to-tail touching configuration for pullers, leader-follower arrangement for pushers, specific relative orientations for helical pursuit, cooperative circular motion) emerge from the local interactions (hydrodynamic forces, torques, steric repulsion) and the pursuer's local steering/adaptation rules, without external control dictating the specific pair configuration. The resulting stable trajectories and configurations are emergent properties of the interacting system dynamics.
    *   Implicit/Explicit: Explicit
        *  Justification: The paper explicitly describes the emergence of "stable cooperatively moving states" (Abstract, Intro, Results) and details specific configurations (e.g., Fig 2a, 3a, 4a, 5a) that arise from the defined local rules and interactions.

**(Conditional: M4.1 is "Yes", including M4.2-M4.7)**

### **4.2 Local Interaction Rules:**

*   **Vector ID:** M4.2
*   **Vector Type:** Rules
    *   Content:
        1.  **Hydrodynamic Interactions:** Squirmers interact via the flow fields they generate (pusher/puller characteristics determined by β) and experience from each other, mediated by the MPC fluid. These implicitly defined forces and torques depend on relative position and orientation. (Implicitly governed by Stokes flow for squirmers + MPC dynamics).
        2.  **Steric Repulsion:** Short-range repulsive force based on the separation-shifted Lennard-Jones potential U_LJ(d_s) (Eq. 23), preventing overlap. Acts along the center-to-center vector r_c.
        3.  **Pursuer Steering (Strategy 1 - Aiming):** The pursuer calculates a target angular velocity ω0 = C0 * e_p × e_aim, where e_aim = r_c / |r_c| (Eqs. 1, 13). This angular velocity is realized by adjusting surface slip modes C_11, C~_11 (Eqs. 10, 11). C0 determines maneuverability Ω (Eq. 2).
        4.  **Pursuer Steering (Strategy 2 - Alignment+Adaptation):**
            *   Alignment: As above, but e_aim = e_t (Eq. 14).
            *   Speed Adaptation: Pursuer acceleration v_p_dot is determined by its relative position (sign of e_p ⋅ e_c) and current speed relative to v_max, using friction coefficient κ (Eq. 19). Speed is updated via Euler scheme (Eq. 22).
        5.  **Target Dynamics:** Propelled with fixed speed v_t along e_t (potentially precessing for helical motion, Eqs. 15-18), subject to hydrodynamic forces/torques from the pursuer and fluid, steric repulsion, and thermal noise (implicit via D_R).
        6.  **Thermal Noise:** Both squirmers experience translational and rotational Brownian motion governed by temperature T and fluid viscosity η (implicit in MPC and represented by D_R).
    *   CT-GIN Mapping: Defines `AdjunctionEdge`s (linking SquirmerState to SquirmerForce/Torque), `InteractionEdge`s (Hydrodynamic, Steric), `ControlEdge`s (Steering, SpeedAdaptation). Rules are attributes of these edges. `LocalInteraction` category.
    * **Implicit/Explicit**: Mixed
        *  Justification: Steric potential (Eq. 23), steering laws (Eqs. 1, 13, 14), and speed adaptation (Eq. 19) are explicit. Hydrodynamic interactions are explicitly mentioned but the detailed forces/torques are implicitly determined by the squirmer model and MPC simulation. Thermal noise is explicitly mentioned but derived implicitly from the simulation parameters (T, η, R_sq).

### **4.2.1 Local Interaction Parameters:** N/A (Parameters listed in M1.3 govern these rules)

### **4.3 Global Order:**

*   **Vector ID:** M4.3
*   **Vector Type:** Order
    *   Content: The primary global order described is the formation of stable, cooperatively moving pursuer-target pairs with characteristic configurations and trajectories. Specific examples include:
        *   Stable head-to-tail touching configurations (Pullers, Aiming Strategy, Fig 2a-i).
        *   Stable leader-follower configurations with finite separation (Pushers, Aiming Strategy, Fig 2a-ii, 2b).
        *   Stable tracing configurations for helical target trajectories (Fig 3a).
        *   Stable cooperative circular motion (Pushers, Alignment+Adaptation Strategy, Fig 5a).
    *   CT-GIN Mapping: Defines `ConfigurationalNode`s like "HeadToTailPair", "LeaderFollowerPair", "HelicalTracePair", "CooperativeCircularMotion".
    * **Implicit/Explicit**: Explicit
        *  Justification: The paper explicitly identifies and describes these stable cooperative states and configurations in the Results section and associated figures.

### **4.4 Predictability of Global Order:**

*   **Vector ID:** M4.4
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: Within specific parameter regimes (Pe, Ω, α, β, strategy), the emergent global order (stable cooperative state) appears predictable and reproducible across simulation runs (implied by averaged results like <r_c> in Fig 2b, <e_p ⋅ e_t> in Fig 2d, phase diagram in Fig 2e). However, the system includes stochasticity (thermal noise), meaning individual trajectories are not perfectly predictable, and transitions between stable/unstable pursuit depend sensitively on parameters (boundaries in Fig 2e). Predictability is high within stable regimes but lower near boundaries or in unstable regimes. No quantitative predictability metrics (e.g., probability of capture, variance of distance) are provided, preventing a higher score.
    * **Implicit/Explicit**: Implicit
    *  Justification: Predictability is inferred from the presentation of averaged results, phase diagrams showing distinct regions of stability, and the discussion of stable states. The influence of noise introduces inherent unpredictability not explicitly quantified.
    *   CT-GIN Mapping: Contributes to the `AdjunctionEdge` description (relationship between local rules and global configuration).

### **4.5. Local Interaction Rules (for Self-Organization)** N/A (Covered in M4.2)

### **4.6. Globally Emergent Order and Order Parameters**

* **Vector ID:** M4.6
* **Vector Type:** Table
*   Table:
| Property ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Protocol | Source |
| :---------- | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :------: | :-----: |
| PairSeparation | Average distance between pursuer and target | <r_c> | ~1σ to >2σ (pushers) / ~σ (pullers) | σ (squirmer diameter) | Explicit | Reported average values from simulations. | Time-averaging simulation trajectories. | Fig 2b, 3c, 4c |
| PairAlignment | Average alignment of propulsion directions | <e_p ⋅ e_t> | ~0.1 to ~1.0 | Dimensionless | Explicit | Reported average values from simulations. | Time-averaging simulation trajectories. | Fig 2d, 3b |
| RelativeOrientation | Orientation of pursuer relative to target center vector | P(e_t ⋅ e_c) | Distribution shown | Dimensionless | Explicit | Reported distributions from simulations. | Histogramming simulation trajectories. | Fig 4d, 4e |
| CooperativeSpeed | Center-of-mass speed of the pair | U_cm | ~0.5v_p to ~1.5v_p | v_p (pursuer speed) | Explicit | Reported average values from simulations. | Time-averaging simulation trajectories. | Fig 2c |
| InducedRotation | Angular frequency of target induced by pusher pursuer | Ω_ind | ~0 to ~0.38 Ω | D_R (rotational diffusion coeff.) | Explicit | Calculated from simulation data via Eq. 6 or autocorrelation fits. | Eq. 6 / Autocorrelation analysis. | Fig 5d |
| TrajectoryCurvature | Radius of induced circular motion | R_ind | ~5σ to ~30σ | σ (squirmer diameter) | Explicit | Calculated from v_t / Ω_ind. | Derived from v_t and Ω_ind. | Fig 5e |

### **4.7 Yoneda Embedding and Local-to-Global Mapping Fidelity**

*   **Vector ID:** M4.7
*   **Vector Type:** Table
*   Table:
    | Link Type | Description | Predictability | Yoneda Score | Metrics | Implicit/Explicit | Justification | Source |
    | :-------- | :---------- | :------------- | :----------- | :------ | :----------------: | :------------: | :-----: |
    | SteeringLogic -> PairConfiguration | How local steering affects the stable pair state | Medium-High | 6 | <r_c>, <e_p⋅e_t>, Stability Regions (Fig 2e) | Implicit | Predictable within stable parameter regimes, but sensitive near boundaries & stochastic. Score reflects good qualitative mapping but lack of quantitative prediction across all parameters. | Figs 2, 3, 4, 5 |
    | Hydrodynamics(β) -> PairConfiguration | How pusher/puller nature influences stable state | High | 8 | <r_c>, <e_p⋅e_t>, U_cm | Explicit | Clear, distinct differences observed and partly explained by theory (Eqs 3-5). | Figs 2, 3, 4, 5 |
    | Noise(Pe) -> PairConfiguration | How thermal noise affects stability/configuration | Medium | 5 | <r_c>, <e_p⋅e_t>, Stability Boundary Shift (Fig 2e) | Mixed | Noise generally destabilizes (explicitly stated), shifting stability boundaries. Effect on average values (<r_c>) shown, but quantitative impact on predictability not fully explored. | Fig 2, 4, 5 |
    | SpeedAdaptation -> PairConfiguration | How speed adaptation affects stable state (Pusher Alignment) | High | 8 | <r_c>, <e_t⋅e_c>, Ω_ind, R_ind | Explicit | Clear dependence of emergent configuration (distance, relative orientation, circular motion) on v_max. | Figs 4, 5 |
    *   **Yoneda Embedding Fulfillment Score [0-10]:** 7 (Rubric: 0=No link between local rules & global order; 5=Qualitative link established; 8=Quantitative link shown for key aspects; 10=Complete predictive model from local rules to all global features). The paper establishes clear qualitative and some quantitative links (e.g., Eqs 3-5 approximate some results) but lacks a full predictive theory covering all observed emergent states from the local rules, especially considering noise and complex near-field hydrodynamics.
    *   **Metrics:** Average distance <r_c>, alignment parameter <e_p⋅e_t>, stability phase boundaries (Fig 2e), center-of-mass velocity U_cm, induced angular velocity Ω_ind, radius of curvature R_ind, probability distributions P(e_t⋅e_c).
    *   **Justification:** The study successfully demonstrates that specific local interaction rules (steering, hydrodynamics, noise, speed adaptation) lead to distinct, observable global emergent states (stable pair configurations, cooperative motion). The relationship is investigated systematically by varying parameters (β, Pe, Ω, α, v_max). While not a complete predictive mathematical map, the link between local rules and emergent global order is the core finding and is well-supported by simulation data and analysis.

## M5: Computation
*   **Vector ID:** M5
*   **Vector Type:** Computation

### **5.1 Embodied Computation Presence:**

*   **Vector ID:** M5.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The pursuer performs computations intrinsic to its physical state and interaction rules. Specifically, it computes: (1) The target direction e_aim based on relative position r_c or target orientation e_t. (2) The required angular velocity ω0 based on e_p and e_aim (Eq. 1). (3) The necessary adjustments to surface slip modes (C_11, C~_11) to achieve ω0 (Eqs. 10, 11). (4) For the adaptation strategy, it computes its acceleration based on relative position (e_p ⋅ e_c) and current speed (Eq. 19). These computations are embodied in the swimmer's physical model and control logic, not performed by an external controller acting on the swimmer.
    *    Implicit/Explicit: Implicit
        *  Justification: The paper defines the mathematical rules (Eqs. 1, 10, 11, 13, 14, 19) that the pursuer follows. That these rules represent a form of computation performed by the simulated entity is implicit.

**(Conditional: M5.1 is "Yes", including M5.2-5.4)**

### **5.2 Computation Type:**

*   **Vector ID:** M5.2
*   **Vector Type:** Classification
    *   Content: Analog/Hybrid
    *   CT-GIN Mapping: Defines the `ComputationNode` type: "Analog Control".
    *    Implicit/Explicit: Implicit
    *    Justification: The computations involve continuous variables (vectors e_p, r_c, e_t; scalar v_p) and vector operations (cross product, dot product). The speed adaptation involves a comparison (e_p ⋅ e_c >= 0) which is effectively a thresholding operation (digital-like aspect within an analog framework), hence "Hybrid". Primarily, it's an analog control system using continuous physical state information.

### **5.3 Computational Primitive:**

*   **Vector ID:** M5.3
*   **Vector Type:** Function
    *   Content: The most basic computational primitives are:
        *   **Vector Normalization:** Calculating unit vectors like e_c = r_c / |r_c| or e_t (assumed known).
        *   **Vector Cross Product:** Calculating e_p × e_aim to determine the axis of rotation (Eq. 1).
        *   **Scalar Multiplication:** Scaling the rotation axis by C0 (or κ for acceleration).
        *   **Vector Dot Product:** Calculating e_p ⋅ e_c for speed adaptation logic (Eq. 19) and e_p ⋅ e_x, e_p ⋅ e_y for determining slip modes (Eqs. 10, 11).
        *   **Thresholding/Comparison:** Comparing e_p ⋅ e_c to zero to switch between acceleration/deceleration modes (Eq. 19).
        *   **Linear Function/Saturation:** Calculating acceleration based on (v_max - v_p) or (-v_p) (Eq. 19).
    *   CT-GIN Mapping: Defines the primary function of the `ComputationNode` built from primitives like "VectorOperation", "Thresholding", "LinearFunction".
    *   Implicit/Explicit: Implicit
    * Justification: These primitive operations are directly identifiable within the explicit equations (Eqs. 1, 10, 11, 13, 14, 19) defining the pursuer's control logic.

### **5.4 Embodied Computational Units** N/A (The computation is embedded in the continuous physics model, not discrete units)

## M6: Temporal Dynamics
*   **Vector ID:** M6
*   **Vector Type:** Temporal

### **6.1 Timescales:**

*   **Vector ID:** M6.1
*   **Vector Type:** ParameterTable
    *   Table:
        | Timescale Description | Value | Units | Source | Implicit/Explicit | Justification |
        | :-------------------- | :---: | :---: | :----: | :----------------: | :------------: |
        | Rotational Diffusion Time (Characteristic) | 1 / D_R | s (Implicit via D_R units) | Methods (D_R definition) | Implicit | Fundamental timescale for orientation randomization. D_R = kBT/(πησ^3). |
        | Pursuer Reorientation Time (Inverse Maneuverability) | 1 / (C0) ~ 1 / (Ω * D_R) | s (Implicit via Ω, D_R) | Eq. 1, 2 | Implicit | Timescale for the pursuer to significantly change direction via steering. |
        | MPC Collision Time | h = 0.02 | a√(m/kBT) | Methods | Explicit | Simulation timestep, shortest relevant timescale. |
        | Squirmer Transit Time (across diameter) | σ / v_p ~ σ^2 Pe D_R | s | Eq. 2 | Implicit | Time for squirmer to move its own diameter. Varies with Pe. |
        | Velocity Relaxation Time (Speed Adaptation) | R_sq / (κ * v_max) or R_sq / (κ * v_p(t)) | s | Eq. 19 (Implicitly) | Implicit | Timescale over which pursuer speed changes significantly during adaptation. Depends on mode (accel/decel) and current speed. |
        | Cooperative Oscillation Period (Induced Rotation) | 1 / Ω_ind ~ 1 / (0.1 - 0.4 Ω D_R) | s | Fig 5b, 5d | Explicit | Period observed in autocorrelation function for cooperative circular motion (Alignment strategy). |

### **6.2 Active Inference:**

*   **Vector ID:** M6.2
*   **Vector Type:** Assessment
    *   Content: No
    *   Justification: The system exhibits reactive control based on the current state (position/orientation). There is no evidence of: (1) The pursuer predicting the target's future position or orientation. (2) Action selection based on minimizing a prediction error or surprise (actions are direct responses to current state via fixed rules). (3) An internal model of the target's dynamics or the environment that gets updated. The pursuer simply reacts to where the target *is* or how it *is oriented* right now. While the emergent behavior might seem purposeful (pursuit), the underlying mechanism lacks the predictive modeling characteristic of active inference.
    *   Implicit/Explicit: Implicit
        *  Justification: Inferred from the reactive nature of the control laws (Eqs. 1, 13, 14, 19) which lack predictive or model-updating terms.
    *   **If Yes/Partial, provide examples of testable CT-GIN metrics that *could* be used to quantify active inference:** N/A

## M7: Adaptation
*   **Vector ID:** M7
*   **Vector Type:** Adaptation

### **7.1 Adaptive Plasticity Presence:**

*   **Vector ID:** M7.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The pursuer exhibits adaptation in one specific scenario: the alignment strategy combined with *speed adaptation*. The pursuer changes its propulsion speed (an internal state/parameter determining behavior) based on its performance relative to the target (its position e_p ⋅ e_c). It accelerates when behind and decelerates when ahead (Eq. 19). This is a change in behavior (speed) driven by interaction history (implicitly, via current relative position) leading to a stable cooperative state (altered functionality). The steering itself (adjusting ω0) is reactive control, not adaptive plasticity in this sense, as the underlying *rule* doesn't change based on experience.
    *    Implicit/Explicit: Explicit
        * Justification: The speed adaptation mechanism (Eq. 19) is explicitly described as a way for the pursuer to adjust its velocity based on relative position, which fits the definition of adaptive plasticity leading to altered behavior (speed) and functionality (stable cooperative motion).

**(Conditional: M7.1 is "Yes", include M7.2)**

### **7.2 Adaptation Mechanism:**

*   **Vector ID:** M7.2
*   **Vector Type:** Description
    *   Content: The mechanism is a continuous-time velocity relaxation process based on relative position feedback. If the pursuer is behind the target (e_p ⋅ e_c < 0), it experiences a deceleration proportional to its current speed (-κ*v_p(t)^2 / R_sq term in Eq. 19, assuming the paper means v_dot ~ -kappa*v_p not -kappa*v_p^2 as written for deceleration in Methods for consistency with acceleration eq and units). If the pursuer is ahead (e_p ⋅ e_c > 0), it experiences an acceleration proportional to the difference between a maximum speed v_max and its current speed (κ*v_max*(v_max - v_p(t))/R_sq term in Eq. 19). The (dimensionless) parameter κ controls the rate of adaptation, and v_max sets the speed limit. This resembles a simple feedback control loop adjusting speed based on positional error relative to the target. It's a form of parameter tuning (adjusting v_p) based on performance feedback.
    *   CT-GIN Mapping: Defines the `AdaptationNode` type: "FeedbackControlSpeedAdaptation". Defines `Monad` edges representing the speed update process. Mechanism: "Parameter Tuning".
    *    Implicit/Explicit: Explicit
        *  Justification: The mechanism, including the governing equations (Eq. 19) and parameters (κ, v_max), is explicitly detailed in the Methods section.

## M8: Emergent Behaviors
*   **Vector ID:** M8
*   **Vector Type:** Behavior

### **8.1 Behavior Description:**

*   **Vector ID:** M8.1
*   **Vector Type:** Description
    *   Content:
        1.  **Pursuit:** The primary behavior is the pursuer actively following the target, attempting to reduce the distance or maintain a specific relative configuration.
        2.  **Capture/Stable Pairing:** Formation of stable, long-lasting cooperative states where the pursuer and target move together. This includes head-to-tail contact (pullers), stable finite-distance leader-follower arrangements (pushers), and stable relative configurations during helical motion.
        3.  **Target Manipulation (Indirect Steering):** In the alignment+adaptation strategy for pushers, the pursuing squirmer exerts hydrodynamic torques on the target, inducing a cooperative circular motion of the pair. The pursuer indirectly steers the target.
        4.  **Hydrodynamic Pushing/Pulling:** Depending on β and relative configuration, the swimmers exert hydrodynamic forces on each other, modifying their speeds and trajectories (e.g., pushers pushing the target, enhancing U_cm; pullers attracting, reducing U_cm).
    *   CT-GIN Mapping: Defines `BehaviorArchetypeNode`s: "Pursuit", "StablePairFormation", "TargetManipulation", "HydrodynamicCoupling".
    *    Implicit/Explicit: Explicit
       *  Justification: These behaviors (pursuit, stable states, induced rotation, hydrodynamic effects on speed) are the main results presented and discussed explicitly in the text and figures.

### **8.2 Behavior Robustness:**

*   **Vector ID:** M8.2
*   **Vector Type:** Score
    *   Score: 6
    *   Justification: The emergent stable states exhibit robustness to thermal noise within certain parameter ranges (indicated by persistence in simulations with noise and regions in the phase diagram Fig 2e). For instance, stable pairs form even for Pe=8. However, robustness is limited. Increasing noise (lower Pe) or insufficient maneuverability (lower Ω relative to Pe) can destabilize the cooperative states (Fig 2e). Pursuit is sensitive to the speed ratio α (unstable above certain thresholds, Eq. 3 approximation, Fig 2e). The alignment strategy without speed adaptation is explicitly stated as unstable. Robustness against variations in β or initial conditions beyond those tested is not explored. The score reflects observed stability against noise but sensitivity to key parameters (Pe, Ω, α).
    *   Implicit/Explicit: Mixed
        *  Justification: Robustness to noise is explicitly demonstrated by running simulations at different Pe values and shown in the phase diagram. Sensitivity to parameters Ω and α is also explicitly shown (Fig 2e). Statements about instability (e.g., alignment without adaptation) are explicit. Robustness to other potential perturbations (e.g., variations in β) is implicit (assumed stable if not mentioned otherwise, but not tested).
    *   CT-GIN Mapping: Contributes to the reliability attributes of the `BehaviorArchetypeNode`s.

### **8.3 CT-GIN Emergent Behavior Validation**

*    **Vector ID:** M8.3
*    **Vector Type:** Validation
     *  Content: Claims of emergent behaviors are validated through:
        *   **Numerical Simulations:** Using the MPC method to simulate the system dynamics under the defined rules.
        *   **Observation of Trajectories:** Visualizing and analyzing simulated trajectories (Figs 2a, 3a, 5a, Supp. Movies) provides qualitative evidence of pursuit, pairing, and cooperative motion.
        *   **Quantitative Analysis:** Calculating order parameters and average quantities like mean distance <r_c> (Fig 2b, 3c, 4c), mean alignment <e_p ⋅ e_t> (Fig 2d, 3b), orientation distributions P(e_t ⋅ e_c) (Fig 4d), center-of-mass speed U_cm (Fig 2c), induced angular velocity Ω_ind (Fig 5d), and radius of curvature R_ind (Fig 5e). These quantify the emergent states.
        *   **Phase Diagrams:** Mapping regions of stable vs. unstable pursuit as a function of key parameters (Pe, Ω, α) (Fig 2e) defines the conditions for emergence.
        *   **Comparison with Theory:** Comparing simulation results (e.g., for U_cm, stability threshold α) with analytical far-field approximations (Eqs. 3-5) provides further validation, showing semi-quantitative agreement in some regimes.
        *   **Control Simulations (Implicit):** Comparing different strategies (aiming vs alignment vs alignment+adaptation) and different parameters (pusher vs puller, different α, Ω, Pe) acts as a form of control to isolate the factors leading to specific emergent behaviors.
        *   **Reproducibility:** Averaging over multiple realizations (stated in Methods) demonstrates statistical reproducibility of the emergent average properties.
     *   Implicit/Explicit: Explicit
    *   Justification: The paper explicitly details the simulation methods, the quantitative metrics calculated, the phase diagram construction, and the comparison with theoretical approximations used to identify and validate the emergent behaviors shown in the figures and discussed in the text.

## M9: Cognitive Proximity
*   **Vector ID:** M9
*   **Vector Type:** Cognition

### **9.1 Cognitive Mapping:**

*   **Vector ID:** M9.1
*   **Vector Type:** Description
    *   Content: The paper uses the terms "cognitive", "intelligent", "sensing", and "cognition" to describe the pursuer's self-steering capabilities. It explicitly frames the pursuer as having an "implicit sensing mechanism" (sensing relative position or target orientation) and "hydrodynamic response and adaptation mechanisms" (steering and speed adjustments). It relates the model to a "minimal cognitive flocking model" and extensions. The Discussion section mentions the potential for increasing "cognitive capacity" by incorporating more complex sensing (target velocity) and adaptation rules, potentially using machine learning. However, the mapping is primarily analogical; the 'cognition' described is a direct stimulus-response or simple feedback loop based on instantaneous physical cues, rather than involving internal representation, prediction, or complex decision-making in a biological sense.
    *   CT-GIN Mapping: Defines a `CognitiveMappingEdge` between `BehaviorArchetypeNode` ("Pursuit", "StablePairFormation") and `CognitiveFunctionNode` ("Sensing", "Reactive Control", "Simple Adaptation").
    *   Implicit/Explicit: Explicit
    * Justification: The paper explicitly uses cognitive terminology (cognitive, intelligent, sensing, adaptation) throughout the text (Abstract, Intro, Results, Discussion, Methods) to describe the pursuer's capabilities and relates the model to cognitive flocking models.

### **9.2 Cognitive Proximity Score:**

*   **Vector ID:** M9.2
*   **Vector Type:** Score
    *   Score: 2
    *   Justification: The system exhibits stimulus-response (Level 1: reacting to relative position/orientation) and simple adaptation (Level 2: speed adaptation based on positional feedback). The pursuer senses its immediate environment (relative target state) and reacts according to fixed rules or simple feedback loops. It lacks internal models, prediction, planning, goal representation beyond the implicit goal of 'aiming' or 'aligning', and memory influencing future actions based on past states. The term "cognitive" is used loosely to mean "responsive to sensed information with internal adjustment capability". It doesn't demonstrate behaviours associated with Level 3 (complex adaptation within a repertoire) or higher.
    *   Implicit/Explicit: Inferred
    *  Justification: The score is based on comparing the explicitly described mechanisms (reactive steering, simple speed feedback) against the definitions in the CT-GIN Cognizance Scale. The system clearly operates at the lower levels of the scale.

**CT-GIN Cognizance Scale:** (Provided in template)

### **9.3 Cognitive Function Checklist**

* **Vector ID:** M9.3
* **Vector Type:** Checklist
    *   | Cognitive Function               | Score (0-10) | Justification/Notes                                                                       | CT-GIN Mapping (if applicable) | Implicit/Explicit | Justification for Implicit/Explicit/Mixed |
    | :-------------------------------- | :----------: | :------------------------------------------------------------------------------------ | :--------------------------------: | :-----------------:|:-----------------:|
    | Sensing/Perception               |      3       | Implicit sensing of relative position (r_c) or target orientation (e_t). No complex perception. | `SensingNode`                       | Explicit         | Explicit mention of "implicit sensing". |
    | Memory (Short-Term/Working)        |      0       | No mechanism for holding information beyond the instantaneous state.                       | N/A                                | Implicit         | Inferred from lack of mechanism in equations. |
    | Memory (Long-Term)                 |      0       | No mechanism for persistent storage influencing future behavior.                         | N/A                                | Implicit         | Inferred from lack of mechanism in equations. |
    | Learning/Adaptation              |      2       | Simple speed adaptation based on immediate feedback (Eq. 19). No learning of rules or models. | `AdaptationNode`                    | Explicit         | Speed adaptation mechanism explicit. |
    | Decision-Making/Planning          |      1       | Rudimentary decision (accelerate/decelerate based on e_p⋅e_c). No planning or complex choice. | `ComputationNode` (Thresholding)    | Implicit         | Inferred from speed adaptation logic. |
    | Communication/Social Interaction |      1       | Interaction is purely via hydrodynamics and steric forces. No explicit communication.       | `InteractionEdge`                   | Implicit         | Hydrodynamics mediate interaction. |
    | Goal-Directed Behavior            |      2       | Behavior directed towards aiming/alignment via fixed rules. Not flexible goal pursuit.     | `BehaviorArchetypeNode`             | Explicit         | Pursuit is the explicit goal of the model. |
    | Model-Based Reasoning              |      0       | No evidence of internal models or reasoning based on them.                              | N/A                                | Implicit         | Inferred from reactive control laws. |
    | **Overall score**                 |      [1.5]       | N/A                                                                                        | N/A                                | N/A                 | N/A |

## M10: Criticality Assessment
*   **Vector ID:** M10
*   **Vector Type:** Criticality

### **10.1 Criticality:**

*   **Vector ID:** M10.1
*   **Vector Type:** Assessment
    *   Content: Unclear
    *   Justification: The paper does not explicitly investigate or discuss criticality (phase transitions, scale-free behavior, power laws) in the context of the observed emergent behaviors or the underlying dynamics. While phase diagrams are presented (Fig 2e), showing transitions between stable and unstable pursuit, these are analyzed as parameter-dependent stability boundaries rather than critical phenomena in the statistical physics sense. There is no analysis of fluctuations, correlation lengths, or power laws that would indicate operation near a critical point.
        *   Critical Parameters (If Yes/Partial): N/A
        *   Evidence: N/A
    *   Implicit/Explicit: N/A
    *    Justification: The paper does not mention or analyze criticality.

## M11: Review Paper Specifics (Conditional) N/A (Paper type is Theoretical/Computational)

## M12: Theoretical Paper Specifics (Conditional)

*   **Vector ID:** M12
*   **Vector Type:** Theory

### **12.1 Theoretical Rigor:**

*   **Vector ID:** M12.1
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The theoretical model is well-defined based on established concepts (squirmer model, MPC, low Reynolds number hydrodynamics). The steering and adaptation rules are mathematically specified (Eqs. 1, 10-14, 19). The simulation methodology (MPC) is standard and appropriate for the problem. Assumptions (e.g., spherical shape, specific potential, far-field approximations for comparison) are identifiable. The derivation of steering equations (Eqs. 10-12) from the desired angular velocity (Eq. 1) appears sound. The far-field analysis (Eqs. 3-5) provides a consistent, though approximate, theoretical check. Potential minor inconsistency in deceleration formulation in Eq. 19 noted earlier. Overall, the framework is logically consistent and mathematically sound within its stated scope.
       * Implicit/Explicit: Mixed
       *  Justification: Model equations and simulation methods are explicit. Soundness and consistency are assessed based on these explicit components and standard physics principles (implicit knowledge).

### **12.2 Realization Potential:**

*   **Vector ID:** M12.2
*   **Vector Type:** Score
    *   Score: 5
    *   Justification: Realizing this system physically presents significant challenges. While synthetic microswimmers (Janus particles, bacteria-powered bots) exist, implementing the precise, adaptable surface flow fields of the squirmer model, especially the non-axisymmetric modes required for steering (Eqs. 7-9), is extremely difficult. Current artificial swimmers often rely on simpler propulsion (e.g., phoretic flows) and external fields for steering. The "implicit sensing" assumes the pursuer knows r_c or e_t instantaneously, requiring potentially complex on-board sensors or external tracking and feedback in a real system. Speed adaptation also requires integrated sensing and actuation. While conceptually feasible with future advances in micro-robotics, direct physical realization with the specified hydrodynamic control seems distant. Puller/pusher characteristics (β) can be mimicked to some extent.
    *   Implicit/Explicit: Inferred
    *  Justification: This assessment relies on broader knowledge of the current state of micro-robotics and artificial swimmer fabrication, which is not contained within the paper itself. The paper focuses on theoretical possibilities.

### **12.3 Potential for Future CT-GIN Implementation Score**

* **Vector ID:** M12.3
*   **Vector Type:** Score
    *   Score: 6
    *   Justification: If physically realized, this system would provide a valuable platform for studying embodied sensing, reactive control, simple adaptation, and emergent cooperative behavior mediated by hydrodynamics. It explores basic elements relevant to CT-GIN (local rules -> global behavior, simple adaptation). Its minimalism makes it a good theoretical testbed. However, the lack of memory, complex computation, or higher cognitive features limits its immediate potential for exploring more advanced cognizant matter principles. Its main contribution would be in understanding the interplay of hydrodynamics, noise, and simple control strategies in emergent multi-agent systems.
    *    Implicit/Explicit: Inferred
    *   Justification: Score based on evaluating the described system's features (minimal cognition, focus on hydrodynamics+control) against the broader goals and concepts outlined in the (unseen by me but assumed) CT-GIN framework for cognizant matter.

## M13: Overall Assessment & Scoring

*   **Vector ID:** M13
*   **Vector Type:** Overall

### **13.1 CT-GIN Readiness Score:**

*   **Vector ID:** M13.1
*   **Vector Type:** Score
*   **Calculated Score:** 4.83  *(Average of M1.2(8), M2.3(0 - N/A as 0), M3.1(0 - No), M4.1(10 - Yes), M8.2(6), M9.2(2). Note: M3.1 = No means M3.x scores are 0 for average. M4.1=Yes means M4.x are included contextually but not scored directly here. M2.3 N/A treated as 0)*

**CT-GIN Readiness Summary Table:**

| CT-GIN Aspect                   | Strength (Yes/Partial/No) | Key Supporting Metrics (with units) | Limitations (Missing Metrics/Data Gaps)                                           | Improvement Areas (Future Research)                                          |
| :------------------------------ | :-----------------------: | :-----------------------------------| :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| Energy Flow Efficiency          | No                        | N/A                                 | Efficiency not studied/quantified.                                               | Quantify energy cost of propulsion, steering, adaptation.                     |
| Memory Fidelity                 | No                        | N/A                                 | No memory mechanism implemented.                                                 | Incorporate state persistence, history-dependent control rules.              |
| Organizational Complexity       | Yes                       | <r_c>, <e_p⋅e_t>, Stability Regions (Fig 2e), Ω_ind, R_ind                       | Simple pair interactions studied. Limited complexity of emergent states.        | Study larger groups, more complex environments, diverse interaction rules.    |
| Embodied Computation            | Yes                       | Vector ops, Thresholding (Eqs. 1, 19) | Computation limited to reactive control logic.                                     | Implement prediction, planning, learning algorithms within the swimmer model.   |
| Temporal Integration            | Partial                   | D_R, 1/Ω, Adaptation Timescale      | Dynamics are Markovian wrt control. No integration of past information.           | Introduce memory, time-delayed feedback, history-dependent adaptation.        |
| Adaptive Plasticity             | Partial                   | Speed Adaptation (Eq. 19, Fig 4, 5) | Only speed adaptation shown. Rules are fixed.                                  | Implement adaptation of steering strategy, sensitivity (Ω), or internal model. |
| Functional Universality         | No                        | N/A                                 | System designed for pursuit task only.                                           | Explore diverse tasks, reconfigurable behaviors.                             |
| Cognitive Proximity            | No                        | Cognitive Score: 2                     | Limited to reactive control/simple adaptation. Lacks higher cognitive functions. | Add internal models, prediction, learning, selective attention.              |
| Design Scalability & Robustness | Partial                   | Stability vs Pe, Ω, α (Fig 2e)       | Scalability to N>2 not studied. Robustness tested mainly vs noise & parameters. | Study N-swimmer systems, robustness to diverse perturbations/heterogeneity. |
| **Overall CT-GIN Readiness Score** |        4.83 / 10          |   |   |      |

### **13.2 Qualitative CT-GIN Assessment Conclusion:**

*   **Vector ID:** M13.2
*   **Vector Type:** Textual Summary
    *   Content: This theoretical study presents a minimal model of interacting microswimmers where a pursuer uses implicit sensing and reactive control (steering, speed adaptation) to follow a target. Its key strength lies in demonstrating how well-defined local physical interactions (hydrodynamics, steric repulsion) and simple control rules can lead to emergent, stable cooperative behaviors (pair formation, specific configurations, target manipulation). The system clearly maps local rules to global order and exhibits basic adaptive plasticity through speed adjustments. However, from a CT-GIN perspective on cognizant matter, its limitations are significant. It lacks memory, relying solely on instantaneous state information. The embodied computation is restricted to reactive vector operations and thresholding, without prediction or planning. Consequently, its cognitive proximity score is low (Level 2). While valuable for understanding hydrodynamically mediated pursuit and simple adaptation in active matter, it serves primarily as a baseline reactive system rather than a model exhibiting substantial material intelligence or cognizance. Its potential lies in extensions incorporating memory, learning, and more complex internal states.
### **13.3 CT-GIN Refinement Directions:**

*   **Vector ID:** M13.3
*   **Vector Type:** Recommendations
    *   Content:
        *   **Implement Memory:** Introduce internal state variables that store information about past encounters (e.g., average target velocity, previous path segments) and modify steering/adaptation rules based on this history.
        *   **Add Prediction:** Incorporate a simple internal model allowing the pursuer to predict the target's short-term future position and use this prediction in the steering logic (e.g., aiming towards predicted position).
        *   **Enhance Adaptation:** Allow adaptation of the steering parameters (e.g., maneuverability Ω) based on pursuit success metrics (e.g., time-averaged distance or capture rate). Explore reinforcement learning approaches for rule optimization.
        *   **Increase Sensory Input:** Include sensing of target velocity or hydrodynamic gradients, not just position/orientation, enabling more sophisticated pursuit strategies.
        *   **Study Collective Behavior:** Extend the model to N>2 swimmers to investigate emergence of collective patterns (flocking, swarming) based on the defined pairwise interactions and steering rules.
        *   **Quantify Energetics:** Analyze the energy cost associated with different steering strategies and adaptation mechanisms to assess efficiency trade-offs.
        *   **Bridge Theory-Experiment Gap:** Propose specific, simplified experimental systems (e.g., using controlled external fields for steering active colloids) that could test key predictions of the model regarding pusher/puller differences or stability boundaries.

## M14: CT-GIN Knowledge Graph

*   **Vector ID:** M14
*   **Vector Type:** Visualization

### **14.1. CT-GIN Knowledge Graph:**
* **Content:**
    ```mermaid
    graph LR
        subgraph System
            Pursuer(iSquirmer: Pe, Ω, β, v_p(t))
            Target(Squirmer: β, v_t, TrajType)
            Fluid(MPC Fluid: η, T)
            Rules(Local Rules)
        end

        subgraph Interactions
            Hydro(Hydrodynamic: β, r_c, e_p, e_t)
            Steric(Steric Repulsion: U_LJ)
            Noise(Thermal Noise: D_R)
        end

        subgraph ControlLogic [Pursuer Internal]
            Sensing(Implicit Sensing: r_c, e_t)
            Computation(Control Computation)
            Actuation(Surface Slip Adjust: C11, C~11, B1)
            Adaptation(Speed Adaptation: κ, v_max) --- Rules
        end

        subgraph EmergentBehavior
            PairState(Stable Pair Configuration: <r_c>, <e_p⋅e_t>)
            CoopMotion(Cooperative Motion: U_cm, Ω_ind, R_ind)
            PursuitDyn(Pursuit Dynamics)

        end

        subgraph Energy
          InputEnergy[Energy Input: Chemical, Thermal]
          Transduction[Energy Transduction]
          Dissipation(Viscous Dissipation)
        end

        Pursuer -- Hydro --> Fluid
        Target -- Hydro --> Fluid
        Fluid -- Hydro --> Pursuer
        Fluid -- Hydro --> Target
        Pursuer -- Steric --> Target
        Target -- Steric --> Pursuer
        Fluid -- Noise --> Pursuer
        Fluid -- Noise --> Target

        Pursuer -- Sensing --> Computation
        Target -- Sensing --> Computation
        Computation -- Actuation --> Pursuer
        Computation -- Adaptation --> Pursuer

        Rules -- LeadsTo --> PairState
        Rules -- LeadsTo --> CoopMotion
        Rules -- LeadsTo --> PursuitDyn

        Actuation -- Uses --> InputEnergy
        Adaptation -- Uses --> InputEnergy
        Pursuer -- Transduction --> Dissipation
        Target -- Transduction --> Dissipation
        Fluid -- Transduction --> Dissipation

        %% Style
        classDef system fill:#c9d4ff,stroke:#333,stroke-width:2px;
        classDef interaction fill:#f9f,stroke:#333,stroke-width:2px;
        classDef control fill:#ffc,stroke:#333,stroke-width:2px;
        classDef emergent fill:#cfc,stroke:#333,stroke-width:2px;
        classDef energy fill:#fce,stroke:#333,stroke-width:2px;

        class Pursuer,Target,Fluid,Rules system;
        class Hydro,Steric,Noise interaction;
        class Sensing,Computation,Actuation,Adaptation control;
        class PairState,CoopMotion,PursuitDyn emergent;
        class InputEnergy,Transduction,Dissipation energy;

    ```
    **Notes:** Nodes represent key components/concepts. Edges show primary relationships (physical interaction, control flow, emergence). Attributes (like Pe, Ω, β, <r_c>) are associated with relevant nodes/edges as described in previous sections. This is a simplified representation.

## M15: Relationship Vectors
*   **Vector ID:** M15
*   **Vector Type:** Relationships
*   Relationships:
        | Source Vector ID | Target Vector ID | Relationship Type    |
        | :--------------- | :--------------- | :------------------- |
        | M1.1             | M4.3             | SystemLeadsToOrder   |
        | M4.2             | M4.3             | RulesGenerateOrder   |
        | M4.2             | M8.1             | RulesGenerateBehavior|
        | M7.1             | M7.2             | AdaptationMechanism  |
        | M5.1             | M5.3             | ComputationPrimitive |
        | M1.3             | M4.4             | ParametersAffectOrder|
        | M1.3             | M8.2             | ParametersAffectRobustness |
        | M9.1             | M9.2             | MappingSupportsScore |
        | M1.1             | M12.2            | SystemRealizability  |
        | M8.1             | M13.2            | BehaviorSummary      |
        | M3.1             | M13.2            | LimitationsSummary   |

## M16: CT-GIN Template Self-Improvement Insights

*   **Vector ID:** M16
*   **Vector Type:** Feedback

### **Template Feedback:**

*    **Vector ID:** M16.1
*   **Vector Type:** Text
    *   **Missing Probes:**
        *   Explicit probe for "Information Flow": How is information (sensed data) acquired, processed, and used for action/adaptation? Could distinguish between internal/external info sources.
        *   Probe for "Hierarchy": Does the system exhibit hierarchical organization or control? (e.g., multiple levels of adaptation, nested control loops). Relevant for more complex systems.
        *   Probe for "Goal Representation": How is the system's objective (if any) represented or implemented? (e.g., optimization function, target state, implicit in rules). Important for goal-directedness (Level 4+ cognition).
    *   **Unclear Definitions:**
        *   The distinction between "Adaptation" (M7) and "Self-Organization" (M4) could be slightly clearer, especially when adaptation leads to new stable organized states. M7 focuses on changes *within* the agent's rules/parameters over time due to experience, while M4 focuses on the *emergent patterns* arising from fixed (or adapting) rules. This seems okay but needs careful application.
        *   "Cognitive Proximity Score" (M9.2) rubric is helpful, but applying it consistently requires careful judgement, especially distinguishing adjacent levels (e.g., 2 vs 3). More concrete examples for each level tied to material systems might help.
        *   Yoneda Embedding (M4.7) is a complex CT concept. Briefly explaining its *purpose* in this context (quantifying the fidelity of mapping local rules to global emergent behavior) within the probe description would be beneficial for users less familiar with CT.
    *   **Unclear Node/Edge Representations:**
        *   Guidance is generally good. Maybe explicitly suggest standardizing attribute names (e.g., `value`, `unit`, `source`, `reliability`) where applicable across different nodes/edges.
        *   Representing the *control logic/computation* (M5) within the graph could be challenging. Suggesting ways to represent conditional logic or specific algorithms (beyond just node type) might be useful for complex cases.
    *   **Scoring Difficulties:**
        *   Assigning numerical scores for qualitative aspects like "Implementation Clarity" (M1.2) or "Robustness" (M8.2) is inherently subjective. Providing more anchored examples within the justification prompts could improve consistency.
        *   The CT-GIN Readiness Score calculation (M13.1) averaging different kinds of scores (binary presence mapped to 0/10 implicitly, direct scores) might need refinement or weighting. The current method is simple but might obscure nuances. Explicitly stating how Yes/No maps to 10/0 for averaging would be clearer. Treating N/A as 0 might unfairly penalize papers not focused on certain aspects (like energy efficiency). Maybe exclude N/A from average or use a different imputation.
    *   **Data Extraction/Output Mapping:**
        *   Handling theoretical/computational papers requires careful mapping of model parameters and simulation results to template categories often designed with experiments in mind (e.g., Energy, Memory). The template handles this reasonably well by allowing N/A and qualitative assessments, but explicitly acknowledging this mapping challenge in an introductory note might be helpful.
        *   Ensuring all "Justification" fields are filled, even if brief, is important but sometimes feels repetitive if the Implicit/Explicit status is obvious from the main content.
    *   **Overall Usability:** The template is extremely comprehensive and detailed, which is its strength for rigorous analysis. However, its length and detail make it time-consuming to complete. For rapid screening, a shorter/subset version might be useful. The strict formatting requirement is crucial for parsing but demands high user attention.
    * **Specific Suggestions:**
        *   Add a brief explanation of the purpose/interpretation of the Yoneda Embedding score (M4.7).
        *   Clarify the averaging method for the CT-GIN Readiness Score (M13.1), especially handling of N/A and Yes/No mapping.
        *   Consider adding optional probes for "Information Flow", "Hierarchy", and "Goal Representation".
        *   Refine scoring rubrics with more concrete, material-system-specific examples where possible (e.g., for M9.2).