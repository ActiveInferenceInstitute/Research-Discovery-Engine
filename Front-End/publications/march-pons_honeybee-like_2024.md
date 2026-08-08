# Honeybee-like collective decision making in a kilobot swarm

__Paper Type:__ Hybrid

## M1: System Overview & Implementation
*   **Vector ID:** M1
*   **Vector Type:** Overview

### **1.1 System Description**

*   **Vector ID:** M1.1
*   **Vector Type:** Description
    *   Content: The system consists of a swarm of Kilobots (up to 35 robots) programmed to mimic the nest-site selection process of honeybees within a circular arena (radius R=20cm). The Kilobots implement a mathematical model based on List et al. [10], where each robot can be in one of three states: uncommitted (searching), committed to site 1 (lower quality), or committed to site 2 (higher quality). Committed bots "dance" (advertise) their site for a duration proportional to the site's perceived quality (`q_j`), moving as Persistent Random Walkers (PRWs). Uncommitted bots remain stationary and assess the opinions of nearby "dancing" bots within a limited communication range (`r_int` ≈ 7cm) over a time step (`Δt`). An uncommitted bot `i` decides to commit to site `j` at time `t+1` based on a probability `p_j,t+1 = (1-λ)π_j + λf_j,t`, where `π_j` is the intrinsic self-discovery probability for site `j`, `λ` is the interdependence parameter (weight given to social information), and `f_j,t` is the *locally observed* fraction of neighbors dancing for site `j`. The purpose is to investigate how factors like interdependence (`λ`), swarm density, robot motion, and communication limitations affect the swarm's ability to reach consensus on the best quality site, comparing physical experiments and simulations to mean-field predictions.
    *   CT-GIN Mapping: `SystemNode` attributes: `systemType`: Swarm Robotics, `domain`: Collective Decision Making / Bio-inspired Robotics, `mechanism`: Agent-Based Model (List et al. variant) / Local Interaction / Stochastic Opinion Dynamics / PRW Motion, `components`: Kilobots, Arena, Communication Protocol (IR), Decision Algorithm (Eq. 1), `purpose`: Study consensus formation under restricted communication and mobility.
    *   Implicit/Explicit: Explicit
        *  Justification: The paper explicitly describes the Kilobot system, the honeybee model inspiration, the mathematical model used (Eq. 1), the robot states, movement (PRW), communication mechanism, arena, and the research goals (Sections I, II.A, III.A, IV.A).

### **1.2 Implementation Clarity**

*   **Vector ID:** M1.2
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The paper clearly describes the mathematical model (Eq. 1), the three states (uncommitted, site 1, site 2), the role of parameters `λ`, `π_j`, `q_j`, the experimental setup (Kilobots in arena), the communication principle (local IR sensing up to ~7cm), and the basic robot behavior (PRW for committed, stationary for uncommitted). The simulation aspects (KILOMBO, quenched, mean-field) are also well-defined. Minor ambiguities might exist in the exact implementation details of the PRW (e.g., turn angle distribution, speed) and the precise timing (`Δt` in simulation loops vs. seconds), but the core logic is clear. Appendix A2 adds detail on PRW.
    *   Implicit/Explicit: Explicit
        * Justification: The core implementation details are explicitly stated in Sections II, III, IV, and Appendix A.

### **1.3 Key Parameters**

*   **Vector ID:** M1.3
*   **Vector Type:** ParameterTable
    *   Table:
        | Parameter Name | Value | Units | Source (Fig/Table/Section) | Implicit/Explicit | Data Reliability (High/Medium/Low) | Derivation Method (if Implicit) |
        | :------------- | :---: | :---: | :-----------------------: | :-----------------: | :-----------------------------: | :-------------------------------: |
        | Number of Robots (N) | 5-35 (Experiments), up to 492 (Simulations) | bots | Sec III.A, IV.A, Fig 5, Fig 8 | Explicit | High | N/A |
        | Arena Radius (R) | 20 | cm | Sec IV.A, Fig 8 | Explicit | High | N/A |
        | Site Qualities (q1, q2) | 7, 10 | time units (model steps) | Sec IV.A, Fig 3 | Explicit | High | N/A |
        | Interdependence (λ) | 0 - 0.9 (tested range) | dimensionless | Sec IV.A, Fig 2, Fig 4 | Explicit | High | N/A |
        | Self-discovery Prob. (π1, π2) | e.g., (0.3, 0.3) or (0.4, 0.2) | dimensionless | Sec IV.A, Fig 2, Fig 3 | Explicit | High | N/A |
        | Communication Radius (r_int) | ~7 (Experiments), 3-12 (Simulations) | cm | Sec III.A, Appendix B, Fig 7 | Explicit | Medium (Experimental value approximate) | N/A |
        | Sensing Time Step (Δt) | 800 (KILOMBO loops) / 8.24 (Approx) | loops / seconds | Sec IV.A, Appendix A2, Fig 5 | Explicit | Medium (Conversion to seconds approximate) | N/A |

    *   **Note:** Parameter `q` represents the duration of advertisement in discrete time steps of the model/simulation logic loop.

## M2: Energy Flow
*   **Vector ID:** M2
*   **Vector Type:** Energy

### **2.1 Energy Input**

*   **Vector ID:** M2.1
*   **Vector Type:** Input
    *   Content: The paper does not explicitly discuss the energy source for the Kilobots. Kilobots are powered by onboard batteries (rechargeable Li-Po). The relevant energy input for the described *dynamics* is implicit in the computational execution of the algorithm and the physical actuation (vibration motors for movement, LEDs, IR communication).
    *   Value: N/A
    *   Units: N/A
    *   CT-GIN Mapping: `EnergyInputNode`: attributes - `source`: Battery (Implicit), `type`: Electrical (Implicit)
    *   Implicit/Explicit: Implicit
        *  Justification: Standard knowledge about Kilobots indicates battery power, but the paper itself does not mention the power source or energy consumption.

### **2.2 Energy Transduction**

*   **Vector ID:** M2.2
*   **Vector Type:** Transduction
    *   Content: The paper does not detail energy transduction. Implicitly, electrical energy from the battery is transduced into:
        1.  Mechanical energy (vibrations) for locomotion (PRW).
        2.  Electromagnetic energy (infrared light) for communication.
        3.  Electromagnetic energy (visible light) for state indication (LED).
        4.  Thermal energy (heat) due to computational processing and motor/LED operation (dissipation).
    *   CT-GIN Mapping: `EnergyTransductionEdge`: attributes - `mechanism`: e.g., ElectricalToMechanical (Motor), ElectricalToEM (IR LED), ElectricalToEM (Visible LED), `from_node`: Battery, `to_node`: Actuator/Sensor/Processor
    *   Implicit/Explicit: Implicit
        *  Justification: Based on general knowledge of Kilobot operation; the paper does not discuss these physical energy transformation processes.

### **2.3 Energy Efficiency**

*   **Vector ID:** M2.3
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification/Metrics: The paper provides no information on the energy efficiency of the Kilobots or the decision-making process. Efficiency is not a focus of this study. Qualitatively, Kilobots are known to be low-power, but efficiency metrics are absent.
    *   CT-GIN Mapping: N/A
    *   Implicit/Explicit: N/A
      *  Justification: No data or discussion regarding energy efficiency in the paper.

### **2.4 Energy Dissipation**

*   **Vector ID:** M2.4
*   **Vector Type:** Dissipation
    *   Content: The paper does not quantify energy dissipation. Implicit dissipation mechanisms include:
        1.  Heat from the microcontroller during computation.
        2.  Heat from the vibration motors during locomotion.
        3.  Heat from the IR and RGB LEDs.
        4.  Friction between Kilobot legs and the arena surface during movement.
        Quantification is not possible from the text. Qualitatively likely Low per bot, but cumulative for the swarm.
    *   CT-GIN Mapping: Creates `EnergyDissipationNode`s (e.g., Heat, Friction) and `EnergyDissipationEdge`s from relevant component nodes.
    *    Implicit/Explicit: Implicit
        *  Justification: Based on general physics and robotics knowledge; not discussed or quantified in the paper.

## M3: Memory
*   **Vector ID:** M3
*   **Vector Type:** Memory

### **3.1 Memory Presence:**

*   **Vector ID:** M3.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: Each Kilobot maintains an internal state (`s_i,t`: 0, 1, or 2) representing its current commitment (uncommitted, site 1, or site 2). When committed (`s_i,t` = 1 or 2), it also retains a 'dance duration' (`d_i,t`). This internal state persists over time (until the dance duration expires or a new commitment is made) and directly influences the robot's future behavior (advertising via movement and communication) and its influence on other robots' decisions (via `f_j,t` in Eq. 1). This fits the definition of memory as a persistent state change influencing future behavior.
    *    Implicit/Explicit: Explicit
        * Justification: The paper explicitly describes the internal state vector `x_i,t = (s_i,t, d_i,t)` (Sec II.A) and how it governs robot behavior and updates (Sec II.A, Eq. 1, Sec IV.A).

### **3.2 Memory Type:**

*   **Vector ID:** M3.2
*   **Vector Type:** Score
*   Score: 3
*   Justification: The memory is short-term and volatile. The state (`s_i,t`) represents the current opinion/commitment and persists only for the duration (`d_i,t`) determined by the site quality `q_j`. Once `d_i,t` reaches zero, the robot reverts to the uncommitted state (0), losing the memory of its previous commitment unless it immediately recommits based on new information. There are only 3 distinct states possible for `s_i,t`. The 'memory' is essentially the current phase of the opinion dynamics process for that agent. It's not a mechanism for long-term storage or complex information encoding beyond the current opinion and its associated timer. Retention is fixed by `q_j`. Capacity is very low (3 states + timer). Read-out is via LED color and IR communication. It allows the system to track the current collective opinion distribution but doesn't store historical information beyond the fixed decay time.
*   CT-GIN Mapping: Defines the `MemoryNode` type, representing the internal state (s_i,t, d_i,t) of each agent. Attributes: `state_type`: Discrete (Opinion + Timer), `capacity`: 3 states + duration, `volatility`: High.
*    Implicit/Explicit: Mixed
    * Justification: The existence of the state is explicit. The assessment of its properties (volatility, capacity) relative to typical memory systems is an interpretation (Implicit) based on the explicit description.

### **3.3 Memory Retention Time:**

*   **Vector ID:** M3.3
*   **Vector Type:** Parameter
*   Value: `q_j` * (duration of one model time step)
*    Units: time units (e.g., seconds)
*   Justification: The memory of being committed to site `j` persists for a duration `d_i,t` which is initialized to `q_j` (the site quality) upon commitment. The paper uses `q1=7` and `q2=10` model time steps. One time step (`Δt`) is approx 8.24 s (800 loops). So retention is approx 7 * 8.24s ≈ 58s for site 1 and 10 * 8.24s ≈ 82s for site 2. This is relatively short-term dynamic memory tied directly to the task execution.
*    Implicit/Explicit: Mixed
        * Justification: `q_j` values (7, 10) are explicit (Sec IV.A). The duration of a time step (`Δt`) is explicitly given in loops (800) and approximate seconds (8.24s) (Sec IV.A, Appendix A2). Calculating the physical retention time in seconds combines these explicit values.
*   CT-GIN Mapping: Key attribute `retention_time = q_j * Δt` of the `MemoryNode`.

### **3.4 Memory Capacity (Optional - if applicable)**

* **Vector ID:** M3.4
* **Vector Type:** Parameter
*  Value: 3 primary states (0, 1, 2) + timer value
*   Units: States + Integer
*   Justification: Each Kilobot can be in one of 3 main opinion states (uncommitted, site 1, site 2). Additionally, when committed, it stores a decreasing timer value representing remaining dance duration. The capacity is very limited.
*    Implicit/Explicit: Explicit
        *  Justification: The three states are explicitly defined (Sec II.A, IV.A). The dance duration `d_i,t` is also explicitly mentioned (Sec II.A).

*   CT-GIN Mapping: Key attribute `capacity` of the `MemoryNode`.

### **3.5 Readout Accuracy (Optional - if applicable)**

* **Vector ID:** M3.5
* **Vector Type:** Parameter
*   Value: N/A (Assumed High within communication range)
*   Units: N/A
*   Justification: The state (color via LED, opinion via IR message) is directly represented. Accuracy depends on successful IR communication within the 7cm range and line-of-sight, and visual tracking for external observation. The model assumes perfect state transmission/reception between connected bots for calculating `f_j,t`. Errors are likely due to communication failures (range, obstruction, collisions) rather than readout inaccuracy of the stored state itself. The paper doesn't quantify communication error rates.
*    Implicit/Explicit: Implicit
       *  Justification: The paper doesn't discuss readout accuracy. The assessment is based on the description of the communication mechanism and typical swarm robotics assumptions.

*   CT-GIN Mapping: Attribute `readout_fidelity` of `MemoryNode` or related `CommunicationEdge`.

### **3.6 Degradation Rate (Optional - if applicable)**
* **Vector ID:** M3.6
* **Vector Type:** Parameter
    *   Value: N/A (Memory erased deterministically)
    *   Units: N/A
    *   Justification: The memory (commitment state) doesn't degrade stochastically; it expires deterministically when the dance duration `d_i,t` reaches zero. The only 'degradation' is the timer countdown.
    *    Implicit/Explicit: Implicit
            * Justification: Inferred from the deterministic description of the state update rule where `d_i,t` decreases by one unit per time step until zero (Sec II.A).
    *   CT-GIN Mapping: Attribute of the `MemoryNode`.

### **3.7 Memory Operations Energy Cost (Optional - if applicable)**
* **Vector ID:** M3.7
* **Vector Type:** Table
*   Table: N/A
*   Implicit/Explicit: N/A
    *   Justification: The paper does not discuss energy costs associated with maintaining or changing the internal state.

### **3.8 Memory Fidelity & Robustness Metrics (Optional - if applicable)**
* **Vector ID:** M3.8
* **Vector Type:** Table
*   Table: N/A
*   Implicit/Explicit: N/A
*   Justification: The paper does not quantify memory fidelity or robustness metrics.

---

## M4: Self-Organization and Emergent Order
*   **Vector ID:** M4
*   **Vector Type:** Self-Organization

### **4.1 Self-Organization Presence:**

*   **Vector ID:** M4.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The global consensus (majority opinion favoring one site) emerges spontaneously from the local interactions between individual Kilobots following simple rules (Eq. 1, communication within 7cm, PRW movement). There is no central controller dictating the final consensus state; it arises from the collective dynamics influenced by parameters like `λ`, `π_j`, `q_j`, density, and mobility. The paper studies how these local interactions and system parameters lead to the emergent collective decision. The formation of a percolating communication network due to mobility is also an emergent structural feature enabling global information flow from local interactions.
    *   Implicit/Explicit: Explicit
        *  Justification: The paper explicitly frames the study around "collective decision making" emerging in a "decentralized manner" (Abstract, Sec I, IV). It investigates how consensus emerges and depends on various factors influencing local interactions (Sec V).

### **4.2 Local Interaction Rules:**

*   **Vector ID:** M4.2
*   **Vector Type:** Rules
    *   Content:
        1.  **State Update (Uncommitted Bots):** An uncommitted bot `i` gathers information about the states (`s_k,t`) of neighboring bots `k` within its communication radius (`r_int` ≈ 7cm) during a time step (`Δt`). It calculates the local fraction `f_j,t` of neighbors committed to site `j`. It then commits to site `j` with probability `p_j,t+1 = (1-λ)π_j + λf_j,t` (Eq. 1). If it commits, its state becomes `s_i,t+1 = j` and dance duration `d_i,t+1 = q_j`.
        2.  **State Update (Committed Bots):** A bot `i` committed to site `j` remains committed (`s_i,t+1 = j`) but decreases its dance duration (`d_i,t+1 = d_i,t - 1`) until `d_i,t` reaches zero, at which point it becomes uncommitted (`s_i,t+1 = 0`).
        3.  **Movement:** Committed bots perform a Persistent Random Walk (PRW). Uncommitted bots remain stationary. (Sec IV.A, Appendix A2)
        4.  **Communication:** Bots broadcast their state (`s_i,t`) via IR. Bots receive messages from neighbors within `r_int`. (Sec III.A)
        5.  **Physical Interaction:** Implicit excluded volume interactions occur due to Kilobot size (diameter ≈ 3.3cm).
    *   CT-GIN Mapping: Defines `InteractionEdge` (or `AdjunctionEdge`). Attributes encode `interaction_type` (Communication, StateUpdate, MovementInfluence), parameters (`λ`, `π_j`, `q_j`, `r_int`, `Δt`). Rules are implemented in the update function associated with nodes/edges.
    * **Implicit/Explicit**: Explicit
        *  Justification: Eq. 1, state descriptions, PRW mention, communication range, and time step definitions are explicitly provided (Sec II.A, III.A, IV.A, Appendix A2).

### **4.2.1 Local Interaction Parameters:**

* **Vector ID:** M4.2.1
* **Vector Type:** Table
*   Table:
    | Rule ID | Description | Parameter Name | Parameter Value Range | Units | Data Source | Implicit/Explicit | Justification |
    | :------ | :---------- | :------------- | :---------- | :---: | :----------: | :----------------: | :------------: |
    | 1       | State Update Prob. | λ (Interdependence) | 0 - 0.9 | dimensionless | Eq. 1, Fig 4 | Explicit | Parameter varied in study |
    | 1       | State Update Prob. | π_j (Self-Discovery) | e.g., 0.2, 0.3, 0.4 | dimensionless | Eq. 1, Fig 2, 3 | Explicit | Parameter varied in study |
    | 2       | Dance Duration | q_j (Site Quality) | 7, 10 | time steps | Sec IV.A | Explicit | Fixed parameter in study |
    | 4       | Communication | r_int (Interaction Radius) | ~7 (Exp), 3-12 (Sim) | cm | Sec III.A, Fig 7 | Explicit | Parameter described/varied |
    | 1, 4    | Information Gathering | Δt (Sensing Window) | 800 / ~8.24 | loops / s | Sec IV.A, Fig 5 | Explicit | Parameter used in study |
    | 3       | Movement | PRW Parameters (Speed, Turn Rate/Angle) | Not specified | variés | Appendix A2 | Mixed | PRW mentioned explicitly, parameters implicit |

### **4.3 Global Order:**

*   **Vector ID:** M4.3
*   **Vector Type:** Order
    *   Content: The emergent global order is the collective consensus state, characterized by the stationary distribution of opinions across the swarm. Specifically, it is quantified by the average proportions of bots in each state (`<f_0>`, `<f_1>`, `<f_2>`) and the consensus parameter `Q = <f_2> - 2<f_1>`. A state of strong consensus (`Q > 0`) for the high-quality option (site 2) represents the desired emergent order. The structure of the time-integrated communication network (specifically, its percolation status and giant component size) is another emergent structural order.
    *   CT-GIN Mapping: Defines a `ConfigurationalNode` representing the macroscopic state of the system. Attributes: `f0`, `f1`, `f2`, `Q`, `network_percolated`.
    * **Implicit/Explicit**: Explicit
        *  Justification: The paper explicitly defines and analyzes the proportions `f_j` and the consensus metric `Q` as the outcomes of the collective process (Sec IV.A, Eq. 2, Fig 2, 3, 4). Network percolation is also explicitly analyzed as an emergent property (Sec V, Fig 5, 6).

### **4.4 Predictability of Global Order:**

*   **Vector ID:** M4.4
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: The *average* stationary global order (mean values of `f_j`, `Q`) is highly predictable given the model parameters (`λ`, `π_j`, `q_j`, N, density), as shown by the agreement between experiments, KILOMBO simulations, and mean-field theory (Fig 3, 4, 8). The deterministic mean-field equations (Appendix A1) accurately predict these average values. However, individual runs exhibit significant stochastic fluctuations, especially for smaller N (Fig 2a), making the exact state at any given moment less predictable. The *emergence* of consensus (Q > 0) is predictable based on crossing the λ* threshold (Fig 3d, 3e). Predictability decreases near phase transitions/crossovers or in sparse/quenched systems (Fig 4).
    * **Implicit/Explicit**: Mixed
    *  Justification: The agreement between models and experiments (explicit in Figs 3, 4, 8) supports high predictability of average behavior. The presence of fluctuations (explicit in Fig 2a) limits predictability of instantaneous states. The score balances these aspects.
    *   CT-GIN Mapping: Contributes to the `AdjunctionEdge` weight (linking local rules to global state) or attributes of the `ConfigurationalNode` related to variance/stability.

### **4.5. Local Interaction Rules (for Self-Organization)**
* **Vector ID:** M4.5
* **Vector Type:** Table
*   Table:
| Rule ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Source |
| :------ | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :-----: |
| 1 | State Update Probability | λ | 0 - 0.9 | dimensionless | Explicit | Parameter swept | Eq.1, Fig 4 |
| 1 | State Update Probability | π_j | e.g., 0.2-0.4 | dimensionless | Explicit | Parameter set | Eq.1, Fig 2 |
| 2 | Dance Duration Update | d_i,t | Decreases by 1 | step^-1 | Explicit | Model definition | Sec II.A |
| 3 | Movement Rule | Movement Type | PRW / Stationary | categorical | Explicit | Model definition | Sec IV.A |
| 4 | Communication Rule | r_int | ~7 (Exp) | cm | Explicit | Experimental setup | Sec III.A |

### **4.6. Globally Emergent Order and Order Parameters**
* **Vector ID:** M4.6
* **Vector Type:** Table
*   Table:
| Property ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Protocol | Source |
| :---------- | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :------: | :-----: |
| 1 | Opinion Distribution | f_j | 0 - 1 | dimensionless | Explicit | Measured observable | Image Analysis / Simulation output | Fig 2, 4 |
| 2 | Consensus Metric | Q | Approx -0.7 to 0.8 | dimensionless | Explicit | Calculated observable | Q = f2 - 2*f1 | Eq. 2, Fig 4 |
| 3 | Network Connectivity | <S_max>/N | 0 - 1 | dimensionless | Explicit | Calculated observable | Cluster analysis | Fig 5b |
| 4 | Network Connectivity | <S> | 1 - ~50 | bots | Explicit | Calculated observable | Cluster analysis | Fig 5a |
| 5 | Network Connectivity | Percolation Threshold η* | Varies (e.g., ~0.3 for N=35, Δt=800) | dimensionless | Explicit | Calculated observable | Analysis of <S> vs η | Sec V.B, Fig 8e,f |

### **4.7 Yoneda Embedding and Local-to-Global Mapping Fidelity**

*   **Vector ID:** M4.7
*   **Vector Type:** Table
*   Table: N/A
    *   **Yoneda Embedding Fulfillment Score [0-10]:** N/A
    *   **Metrics:** N/A
    *   **Justification:** The paper does not employ Category Theory concepts like the Yoneda Lemma to formally analyze the local-to-global mapping. While it studies how local rules lead to global order, it uses statistical physics and network theory approaches, not CT.

## M5: Computation
*   **Vector ID:** M5
*   **Vector Type:** Computation

### **5.1 Embodied Computation Presence:**

*   **Vector ID:** M5.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The collective decision-making process itself can be viewed as a form of distributed computation. Each Kilobot performs local computation: sensing neighbors' states, calculating local fractions `f_j,t`, applying the probabilistic rule Eq. 1 to update its own state. These local computations, integrated across the mobile swarm and mediated by physical interactions (movement, communication), lead to the global computation of the consensus state (which site is 'best' according to the dynamics). The computation is embodied in the physical robots and their interactions, not performed by an external controller overseeing the swarm.
    *    Implicit/Explicit: Implicit
        *  Justification: The paper describes the decision-making process and the rules followed by the robots explicitly. Interpreting this process *as* embodied computation is an implicit step based on definitions from the field of unconventional computing.

### **5.2 Computation Type:**

*   **Vector ID:** M5.2
*   **Vector Type:** Classification
    *   Content: Hybrid / Stochastic Analog
    *   CT-GIN Mapping: Defines the `ComputationNode` type. Attributes: `computation_class`: Hybrid.
    *    Implicit/Explicit: Implicit
    *    Justification: The computation involves processing continuous-like local fractions (`f_j,t` - though derived from discrete neighbors) and applying probabilities (analog aspect), combined with discrete states (0, 1, 2) and discrete time steps. Stochasticity is inherent in the probability rule and PRW. It doesn't fit neatly into standard digital or purely analog categories.

### **5.3 Computational Primitive:**

*   **Vector ID:** M5.3
*   **Vector Type:** Function
    *   Content: The most basic computational operation performed *by each agent* is the stochastic state update based on local sampling and weighted preference.
        Mathematically: `s_i,t+1 = Sample( P(s | f_0,t, f_1,t, f_2,t, π_0, π_1, π_2, λ) )`
        where P is derived from Eq. 1 (and normalization). This involves:
        1. **Local Sensing/Sampling:** Estimating `f_j,t` from neighbors within `r_int`.
        2. **Weighted Averaging/Integration:** Combining self-discovery (`π_j`) and social influence (`f_j,t`) using weight `λ` via Eq. 1.
        3. **Stochastic Thresholding/Selection:** Choosing the next state based on the calculated probabilities `p_j,t+1`.
    *   **Sub-Type (if applicable):** Stochastic Weighted Opinion Update.
    *   CT-GIN Mapping: Defines the primary function of the `ComputationNode` associated with each agent.
    *   Implicit/Explicit: Mixed
    * Justification: Eq. 1 is explicit. Describing the steps involved (sensing, weighting, sampling) is an explicit breakdown of the formula. Characterizing this as the "computational primitive" is an implicit interpretation.

### **5.4 Embodied Computational Units**
* **Vector ID:** M5.4
* **Vector Type:** Table
*   Table: N/A
| Unit ID | Description | Processing Power | Energy/Operation | Freq/Resp. Time | Bit-Depth | Data Source | Implicit/Explicit | Justification |
| :------ | :---------- | :--------------- | :--------------- | :--------------: | :-------: | :----------: |:-----------------:| :-----------------:|
| Kilobot Agent | Performs local state update | N/A | N/A | 1 / Δt ≈ 0.12 Hz | ~log2(3) + timer bits | N/A | N/A | Parameters like computational power, energy, bit-depth are not discussed. Response time is Δt. |

## M6: Temporal Dynamics
*   **Vector ID:** M6
*   **Vector Type:** Temporal

### **6.1 Timescales:**

*   **Vector ID:** M6.1
*   **Vector Type:** ParameterTable
    *   Table:
        | Timescale Description | Value | Units | Source | Implicit/Explicit | Justification |
        | :-------------------- | :---: | :---: | :----: | :----------------: | :------------: |
        | Algorithm Step / Sensing Window (Δt) | ~8.24 | s | Sec IV.A, Appendix A2 | Explicit | Duration of one loop iteration provided |
        | Memory Retention / Dance Duration (Site 1) | ~58 | s | Calculated from q1=7, Δt=8.24s | Mixed | Based on explicit q1 and Δt |
        | Memory Retention / Dance Duration (Site 2) | ~82 | s | Calculated from q2=10, Δt=8.24s | Mixed | Based on explicit q2 and Δt |
        | PRW Straight Segment | ~3.8 | s | Appendix A2 | Explicit | Average duration given |
        | PRW Turn Duration | ~2.8 or ~5.8 | s | Appendix A2 | Explicit | Turn durations given |
        | Consensus Convergence Time | ~50 * Δt ≈ 412 (Transient); varies | s | Fig 2a | Mixed | Visual estimate from graph; depends on parameters |
        | Network Integration Time | 0 - 800 loops (explored) | loops / s | Fig 5 | Explicit | Parameter varied in percolation analysis |

    *   **Note:** Convergence time to steady state is parameter-dependent (Sec IV.A).

### **6.2 Active Inference:**

*   **Vector ID:** M6.2
*   **Vector Type:** Assessment
    *   Content: No
    *   Justification: The Kilobots follow fixed probabilistic rules based on *current* local information (`f_j,t`) and fixed internal parameters (`π_j`, `λ`). There is no evidence of:
        1.  *Prediction*: Agents don't predict future states of neighbors or the environment.
        2.  *Action selection to minimize prediction error*: Actions (committing, moving) are based on Eq. 1 and PRW rules, not on minimizing a prediction error or surprise relative to an internal model.
        3.  *Internal models*: Agents don't possess or update an internal model of the environment or other agents' behavior beyond the simple rules they follow.
        The system reaches consensus through reinforcement dynamics (higher quality sites get advertised longer, increasing `f_j,t`), but this doesn't equate to active inference's generative model framework.
    *   Implicit/Explicit: Implicit
        *  Justification: The assessment is based on the absence of described mechanisms corresponding to Active Inference principles in the explicitly stated model rules.
    *   **If Yes/Partial, provide examples of testable CT-GIN metrics that *could* be used to quantify active inference:** N/A

## M7: Adaptation
*   **Vector ID:** M7
*   **Vector Type:** Adaptation

### **7.1 Adaptive Plasticity Presence:**

*   **Vector ID:** M7.1
*   **Vector Type:** Binary
    *   Content: Partial
    *   Justification: The *individual* Kilobots do not adapt their internal rules (`π_j`, `λ`), movement patterns, or communication capabilities based on experience. However, the *collective* system exhibits a form of structural adaptation: the dynamic communication network topology changes due to robot mobility. The paper shows that this mobility and the resulting time-integrated network structure (especially its percolation properties) are crucial for achieving high consensus levels (Sec V, Fig 8). The system adapts its effective connectivity over time (`Δt`) through movement, allowing it to perform better (reach stronger consensus) than static (quenched) networks under the same density conditions, especially below the static percolation threshold. This adaptation is structural/physical (network topology) rather than parametric (rule change).
    *    Implicit/Explicit: Mixed
        * Justification: The lack of rule adaptation is implicit (rules are stated as fixed). The adaptive nature of the communication network due to mobility and its positive effect on consensus is explicitly studied and presented as a key finding (Sec V, VI). Categorizing this as "Partial" adaptive plasticity is an interpretation.

**(Conditional: If M7.1 is "No", skip to Module 8. If "Yes", include M7.2)**

### **7.2 Adaptation Mechanism:**

*   **Vector ID:** M7.2
*   **Vector Type:** Description
    *   Content: The adaptation mechanism is the dynamic restructuring of the communication network topology via the Persistent Random Walk (PRW) of committed agents. Over a time window (`Δt`), moving agents encounter different neighbors than they would in a static configuration. This increases the effective number of interaction partners and facilitates information propagation across the swarm, lowering the effective percolation threshold (Fig 5). This improved information flow allows the swarm to better integrate opinions and converge towards the globally optimal consensus, overcoming limitations of purely local communication in sparse or static settings. The adaptation is physical/structural (changing network edges over time) driven by agent mobility, not by changes in internal agent parameters or rules.
    *   CT-GIN Mapping: Defines the `AdaptationNode` type (or attributes of `SystemNode`). `mechanism`: Dynamic Network Restructuring via Agent Mobility. Edges representing communication links (`InteractionEdge`) would have temporally changing weights or existence based on proximity derived from PRW dynamics.
    *    Implicit/Explicit: Explicit
        *  Justification: The paper explicitly describes the PRW (Appendix A2), analyzes the time-integrated network structure (Sec V.A, Fig 5, 6), and links mobility-induced network percolation to improved consensus reaching (Sec V.B, Fig 8).

## M8: Emergent Behaviors
*   **Vector ID:** M8
*   **Vector Type:** Behavior

### **8.1 Behavior Description:**

*   **Vector ID:** M8.1
*   **Vector Type:** Description
    *   Content: The primary emergent behavior is **collective decision-making**, specifically achieving **consensus** on one of two options with differing qualities (`q1`, `q2`) and discovery probabilities (`π1`, `π2`). This involves the swarm dynamically converging to a state where a majority (ideally a strong majority, `Q > 0`) of agents advocate for the higher-quality option (site 2), even when it might be harder to discover initially (asymmetric `π`). The strength and accuracy of this consensus depend on system parameters (`λ`), agent density, and mobility. A related emergent behavior is the formation of a **percolating communication network** due to agent mobility integrated over time.
    *   CT-GIN Mapping: Defines the `BehaviorArchetypeNode`. `type`: Collective Decision Making / Consensus Formation. Attributes describe the outcome (e.g., `consensus_strength`: Q, `dominant_opinion`: f2/f1). Another node could be `type`: Network Formation, `outcome`: Percolation Status.
    *    Implicit/Explicit: Explicit
       *  Justification: Collective decision making and consensus are the central theme and explicitly analyzed throughout (Abstract, Sec I, IV, V, VI). Network percolation is explicitly studied as a key factor (Sec V).

### **8.2 Behavior Robustness:**

*   **Vector ID:** M8.2
*   **Vector Type:** Score
    *   Score: 6
    *   Justification: The consensus-reaching behavior is robust in the sense that it reliably occurs across a range of parameters, as demonstrated by agreement between experiments, KILOMBO, and mean-field models (Fig 4). Consensus on the *best* option is robustly achieved for sufficiently high interdependence (`λ > λ*`), even with asymmetric discovery probabilities favoring the wrong option (Fig 3, 4). However, the *strength* of consensus (`Q`) and the convergence time are sensitive to parameters (`λ`, `π_j`, `q_j`), swarm density, and mobility (Fig 3, 4, 8). Below the percolation threshold or for low `λ`, the system may fail to reach strong consensus or even favor the wrong option (Fig 4b, Fig 8). Stochasticity leads to fluctuations, reducing robustness of the instantaneous state (Fig 2a). Robustness to individual robot failures is not explicitly tested but is typically a feature of swarm systems.
    *   Implicit/Explicit: Mixed
        *  Justification: The achievement of consensus is explicitly shown to be repeatable (Fig 4). Sensitivity to parameters and conditions (e.g., λ, density) is explicitly analyzed (Fig 3, 4, 8). The overall robustness score is an interpretation balancing these findings. Robustness to failures is implicit based on swarm characteristics.
    *   CT-GIN Mapping: This score contributes to the reliability attributes of the `BehaviorArchetypeNode` (Consensus Formation).

### **8.3 CT-GIN Emergent Behavior Validation**

*    **Vector ID:** M8.3
*    **Vector Type:** Validation
     *  Content: Claims of emergent behavior (consensus, network percolation) are validated through:
        1.  **Physical Experiments:** Using N=5-35 Kilobots in a physical arena, tracking states over time (Sec III, IV.A, Fig 2, 4, 8). Multiple repetitions (5 per condition for N=35) provide statistical validation.
        2.  **Agent-Based Simulations (KILOMBO):** Emulating the Kilobot dynamics with larger N (up to 492) and more repetitions (50-100) to confirm experimental trends and explore parameter space (Sec III.B, IV, V, Fig 4, 5, 8).
        3.  **Simplified Model Simulations:** Mean-field (fully connected) and quenched (static network) simulations provide theoretical baselines for comparison (Sec II.A, II.B, IV.B, Fig 3, 4, 7, 8).
        4.  **Quantitative Analysis:** Measuring order parameters (`f_j`, `Q`), network properties (`<S>`, `<S_max>`, `P(k)`, `η*`), and their dependence on system parameters (`λ`, `π_j`, N, `r_int`, `Δt`) (Sec IV, V, Fig 2-8).
        5.  **Comparison Across Models:** Showing agreement/disagreement between experiments, KILOMBO, quenched, and mean-field results helps isolate the effects of mobility and limited communication (Fig 4, 8).
        Limitations include the limited number of physical robot experiments and potential simulator-reality gaps (though KILOMBO is shown to match well).
     *   Implicit/Explicit: Explicit
    *   Justification: The paper explicitly describes the experimental methods, simulation types, measured quantities, and comparisons used for validation throughout Sections III, IV, V and associated figures.

## M9: Cognitive Proximity
*   **Vector ID:** M9
*   **Vector Type:** Cognition

### **9.1 Cognitive Mapping:**

*   **Vector ID:** M9.1
*   **Vector Type:** Description
    *   Content: Yes, the paper explicitly maps the Kilobot swarm's behavior to the cognitive process of **collective decision-making** observed in **honeybee swarms selecting a new nest site** (Abstract, Sec I, II). The model parameters `π_j` (self-discovery) and `λ` (interdependence/imitation via waggle dance observation) are directly inspired by honeybee behaviors. The states (uncommitted/scouting, dancing/advertising) and the goal (choosing the best site based on quality `q_j`) mirror the biological process. The paper aims to replicate this "captivating example of collective decision making" (Abstract). Limitations: The mapping is an analogy; Kilobots lack the biological complexity, sensory richness, and communication nuances (waggle dance details) of real bees. The model used is a simplified abstraction (e.g., no cross-inhibition).
    *   CT-GIN Mapping: Defines a `CognitiveMappingEdge` from `BehaviorArchetypeNode` (Consensus Formation) to `CognitiveFunctionNode` (Collective Decision Making / Social Cognition). Attributes could specify the biological analogue (Honeybee Nest Selection).
    *   Implicit/Explicit: Explicit
    * Justification: The analogy to honeybee decision-making is explicitly stated and used as the primary motivation and framing for the study (Abstract, Sec I, II).

### **9.2 Cognitive Proximity Score:**

*   **Vector ID:** M9.2
*   **Vector Type:** Score
    *   Score: 3
    *   Justification: Based on the CT-GIN Cognizance Scale:
        *   Level 0-1 (Non-Cognitive/Simple Responsivity): Exceeded. The system integrates information and exhibits collective behavior beyond simple stimulus-response.
        *   Level 2 (Sub-Organismal Responsivity): Exceeded. Collective adaptation occurs (network structure).
        *   **Level 3 (Reactive/Adaptive Autonomy):** Best fit. The swarm adapts its collective state (opinion distribution) based on feedback (local opinions `f_j,t`) within a fixed behavioral repertoire (Eq. 1, PRW). The network structure adapts physically. It achieves a collective goal (consensus) autonomously.
        *   Level 4 (Goal-Directed/Model-Based): Not met. Agents lack internal models of the world or other agents; their behavior is reactive based on local rules, not model-based planning.
        *   Level 5-10: Clearly not met. No evidence of relational reasoning, symbolic thought, social understanding beyond simple imitation, metacognition, or consciousness.
        The system demonstrates autonomous collective behavior analogous to a specific biological cognitive function (group decision-making) but relies on simple reactive agents with limited memory and no planning or deep representation.
    *   Implicit/Explicit: Implicit
    *  Justification: The score is an interpretation based on comparing the explicitly described system behavior against the definitions in the provided Cognizance Scale.

### **9.3 Cognitive Function Checklist**

* **Vector ID:** M9.3
* **Vector Type:** Checklist
    *   | Cognitive Function               | Score (0-10) | Justification/Notes                                                                       | CT-GIN Mapping (if applicable) | Implicit/Explicit | Justification for Implicit/Explicit/Mixed |
    | :-------------------------------- | :----------: | :------------------------------------------------------------------------------------ | :--------------------------------: | :-----------------:|:-----------------:|
    | Sensing/Perception               |      3       | Local IR sensing of neighbor states (presence, opinion) within ~7cm. Limited range/modality. | `SensingNode`/`InteractionEdge` | Explicit | Sensing mechanism described. Score reflects limitations. |
    | Memory (Short-Term/Working)        |      2       | Holds current opinion state (3 options) + timer (`q_j`). Volatile, limited capacity. | `MemoryNode` | Explicit | State `(s_i,t, d_i,t)` described. Score reflects limitations. |
    | Memory (Long-Term)                 |      0       | Absent. No mechanism for storing information beyond the current dance cycle. | N/A | Implicit | Rules show state resets after `d_i,t`=0. |
    | Learning/Adaptation              |      3       | Collective adaptation via dynamic network restructuring due to mobility. No individual rule/parameter learning. | `AdaptationNode` | Explicit/Mixed | Network adaptation explicit, scoring is interpretation. |
    | Decision-Making/Planning          |      2       | Local, probabilistic decision (Eq.1) based on immediate social info + bias. No planning/foresight. Collective decision emerges. | `ComputationNode` / `BehaviorArchetypeNode` | Explicit | Eq. 1 is explicit decision rule. Score reflects local/reactive nature. |
    | Communication/Social Interaction |      3       | Simple broadcast/reception of current state via IR. Weighted imitation (`λf_j,t`) captures social influence. | `InteractionEdge` | Explicit | IR comms & Eq. 1 described. Score reflects simplicity. |
    | Goal-Directed Behavior            |      2       | Collective behavior converges towards consensus (implicit goal), but individual agents follow local rules reactively, not pursuing explicit goals. | `BehaviorArchetypeNode` | Implicit | Goal is emergent property, not explicit in agent rules. |
    | Model-Based Reasoning              |      0       | Absent. Agents lack internal models for prediction or reasoning. | N/A | Implicit | Agent rules are reactive, model-free. |
    | **Overall score**                 |    [~2.25]    | Primarily reactive system with simple memory, local communication, and emergent collective decision. Strongest aspect is collective phenomena mimicking social process. | - | - | - |

## M10: Criticality Assessment
*   **Vector ID:** M10
*   **Vector Type:** Criticality

### **10.1 Criticality:**

*   **Vector ID:** M10.1
*   **Vector Type:** Assessment
    *   Content: Yes
    *   Justification: The paper explicitly investigates and provides evidence for criticality related to the **percolation transition** in the **time-integrated communication network** formed by the mobile Kilobots. The system's ability to reach strong consensus is strongly linked to the formation of a giant connected component in this network.
        *   Critical Parameters (If Yes/Partial): Interaction radius (`r_int`), Number density (`n=N/πR²`), Sensing time window (`Δt`). These combine into the control parameter `η = N r_int² / R²`. The percolation transition occurs at a critical threshold `η*(Δt, N)`.
        *   Evidence:
            *   Fig 5a: Peak in mean cluster size (`<S>`) vs. `r_int` indicates the percolation threshold `r_int*`, which shifts with `Δt`.
            *   Fig 5b: Sharp increase in the giant component size (`<S_max>`) around `r_int*`.
            *   Fig 6: Cluster size distribution `P(s)` at the percolation threshold exhibits a power-law decay (`P(s) ~ s^-τ` with `τ ≈ 2.055`), consistent with 2D continuous percolation theory.
            *   Fig 8e,f: Collapse of consensus data (`f2`, `Q`) when plotted against the rescaled control parameter `η/η*`, suggesting behavior is governed by proximity to the percolation threshold.
            *   Section V explicitly discusses the percolation transition and its link to information spreading and consensus.
            *   Finite-size scaling analysis of `r_int*` vs N (Eq. 6, Supp Fig 5) also suggests consistency with percolation critical exponents.
    *   Implicit/Explicit: Explicit
    *    Justification: The analysis of network percolation, including calculation of thresholds, cluster sizes, distributions, power laws, and scaling, is a major explicit component of Section V and associated figures.

## M11: Review Paper Specifics (Conditional)

N/A

## M12: Theoretical Paper Specifics (Conditional)

N/A

## M13: Overall Assessment & Scoring

*   **Vector ID:** M13
*   **Vector Type:** Overall

### **13.1 CT-GIN Readiness Score:**

*   **Vector ID:** M13.1
*   **Vector Type:** Score
*   **Calculated Score:** 4.71
*(Calculation: (M1.2[8] + M2.3[0=N/A] + M3.2[3] + M4.4[7] + M8.2[6] + M9.2[3]) / 6 = 27 / 6 = 4.5 --> Rechecking template, score includes M1-4. M2.3 is 0 if N/A. (M1.2[8] + M2.3[0] + M3.2[3] + M4.4[7] + M8.2[6] + M9.2[3]) / 6 = 27 / 6 = 4.5. Average of scores from Modules 1-4 includes M1.2, M2.3, M3.2, M4.4. So (8+0+3+7)/4=4.5. Then add M8.2 and M9.2. (4.5 + 6 + 3) / 3 = 13.5 / 3 = 4.5. Let's assume it means average of *all* scores in M1-M4 plus M8.2, M9.2. M1.2=8, M2.3=0, M3.2=3, M4.4=7. Scores: 8, 0, 3, 7, 6, 3. Sum=27. Average=27/6 = 4.5. Let's try average of M1.2, M2.3, M3.2, M4.4, M5.1(Yes=1?), M6.2(No=0?), M7.1(Partial=0.5?), M8.2, M9.2, M10.1(Yes=1?). Need clarification on how binary/categorical scores convert. Assuming only numbered scores M1.2, M2.3, M3.2, M4.4, M8.2, M9.2: Average = (8 + 0 + 3 + 7 + 6 + 3) / 6 = 4.5*)
*   **(Recalculating based on M1-4, M8.2, M9.2 numerical scores):** (M1.2[8] + M2.3[0] + M3.2[3] + M4.4[7] + M8.2[6] + M9.2[3]) / 6 = 27 / 6 = **4.5**

**CT-GIN Readiness Summary Table:**

| CT-GIN Aspect                   | Strength (Yes/Partial/No) | Key Supporting Metrics (with units) | Limitations (Missing Metrics/Data Gaps)                                           | Improvement Areas (Future Research)                                          |
| :------------------------------ | :-----------------------: | :-----------------------------------| :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| Energy Flow Efficiency          | No | N/A | Energy consumption/efficiency not studied. | Quantify energy costs of computation, communication, movement. |
| Memory Fidelity                 | Partial | Retention time (~60-80s), Capacity (3 states+timer) | Volatility high, no long-term storage, fidelity metrics absent. | Implement mechanisms for persistent, rewritable memory beyond current opinion state. |
| Organizational Complexity       | Yes | Q (Consensus), <S_max>/N (Percolation), η* (Threshold) | Formal CT analysis (Yoneda) absent. | Apply formal CT methods to local-global mapping. Explore more complex emergent patterns. |
| Embodied Computation            | Yes | Eq. 1 (Local update rule) | Processing power, energy/op not quantified. Computation is simple weighted averaging + sampling. | Explore more complex local computations (e.g., prediction, filtering). |
| Temporal Integration            | Partial | Multi-timescales present (Δt, qj, PRW, convergence). Network integration over Δt crucial. | Active inference absent. Limited temporal prediction/anticipation. | Incorporate predictive mechanisms or history dependence beyond simple decay. |
| Adaptive Plasticity             | Partial | Network structure adapts via mobility. | No adaptation of agent rules/parameters. Adaptation is passive consequence of movement. | Implement rule/parameter adaptation (e.g., learning λ or π based on success). |
| Functional Universality         | No | Specialized for binary choice consensus. | Limited computational capability. Fixed behavioral repertoire. | Explore if system can solve other problems (e.g., pattern formation, optimization). |
| Cognitive Proximity            | Partial | Explicit analogy to honeybee decision-making (Level 3 Autonomy). | Lacks higher cognitive functions (planning, models, symbols). Analogy is simplified. | Introduce internal models, planning capabilities, or richer communication. |
| Design Scalability & Robustness | Yes/Partial | Scalability demonstrated via simulations (N=492). Robustness to parameters shown, but consensus strength varies. | Robustness to individual failures not explicitly tested. Scalability of physical experiments limited. | Test robustness to agent failures. Analyze scalability limits more formally. |
| **Overall CT-GIN Readiness Score** |        |  **4.5** | Limited memory/adaptation/computation. Energy ignored. | Integrate richer memory, adaptive rules, energy analysis, formal CT. |


### **13.2 Qualitative CT-GIN Assessment Conclusion:**

*   **Vector ID:** M13.2
*   **Vector Type:** Textual Summary
    *   Content: This study presents a hybrid experimental/computational system where a Kilobot swarm performs collective decision-making analogous to honeybees. Key strengths from a CT-GIN perspective include the clear demonstration of emergent global order (consensus) arising from well-defined local interaction rules, and the explicit analysis of self-organized network structure (percolation) critically influencing this global behavior. The system embodies computation in a distributed manner, and its temporal dynamics involve multiple relevant timescales, including memory retention tied to task execution.
        Key limitations are the simplicity of the embodied memory (short-term, low capacity, volatile state representing current opinion), the lack of adaptive plasticity in individual agent rules (adaptation is primarily structural via network dynamics), and the absence of higher cognitive functions like planning or model-based reasoning. The computation performed is basic stochastic weighted averaging. Energy flow and efficiency are not considered.
        Overall, the system represents a valuable model for studying the emergence of collective behavior from local rules in a physically embodied system with communication constraints and mobility. It strongly demonstrates self-organization and criticality in the communication network structure. However, its cognitive capabilities are limited (CT-GIN Level 3), primarily reactive/adaptive autonomy within a fixed rule set, lacking persistent memory, learning, or complex computation needed for higher cognizance. Its readiness for deeper CT-GIN analysis is moderate, offering a good basis for studying emergence but requiring significant extensions for memory, adaptation, and computation aspects.

### **13.3 CT-GIN Refinement Directions:**

*   **Vector ID:** M13.3
*   **Vector Type:** Recommendations
    *   Content:
        *   **Enhance Memory:** Implement mechanisms for longer-term, rewritable memory within Kilobots, perhaps encoding past experiences (e.g., success rates of sites) or learned environmental features, moving beyond the transient opinion state.
        *   **Introduce Adaptation:** Allow agents to adapt their parameters (e.g., `λ`, `π_j`) based on experience or local success rates, implementing reinforcement learning or similar mechanisms.
        *   **Complexify Computation:** Equip agents with capabilities for more complex local computation, such as prediction of neighbor states, environmental modeling, or signal filtering, enabling more sophisticated decision strategies.
        *   **Formalize Local-Global Mapping:** Apply Category Theory tools (e.g., sheaves, Yoneda embedding) to rigorously analyze the mapping from local interactions/observations to the emergent global consensus state and network structure.
        *   **Analyze Energy Flow:** Quantify the energy costs associated with communication, computation, and movement to understand the thermodynamic constraints and efficiency of the collective decision process.
        *   **Explore Different Dynamics:** Investigate the impact of different movement strategies (beyond PRW) or communication protocols on network formation and consensus dynamics.
        *   **Richer Cognitive Mapping:** Design experiments where the swarm tackles problems requiring goal-directed behavior, planning, or representation, moving beyond simple binary choice.
        *   **Study Robustness:** Systematically investigate the system's robustness to noise, agent failures, and environmental dynamics.

## M14: CT-GIN Knowledge Graph

*   **Vector ID:** M14
*   **Vector Type:** Visualization

### **14.1. CT-GIN Knowledge Graph:**
* **Content:** N/A (Cannot generate images).
    *   *Conceptual Description:* A graph would show N `AgentNodes`, each having attributes for `state` (0,1,2), `timer` (d_i,t), `position`, movement parameters (`PRW`). `InteractionEdges` (Communication) would connect agents within `r_int`, weighted by `λ`. `MemoryNodes` could represent the internal state. `ComputationNodes` represent the update rule (Eq. 1). `SystemNode` links to `BehaviorArchetypeNode` (Consensus Formation, Q) and `ConfigurationalNode` (Network Percolation, η). `AdaptationNode` describes network restructuring via mobility. `CognitiveMappingEdge` links Consensus to Bee Decision Making. Criticality parameters (`η*`, `τ`) annotate the network structure. Energy nodes/edges would be largely absent/implicit.

## M15: Relationship Vectors
*   **Vector ID:** M15
*   **Vector Type:** Relationships
*   Relationships: N/A (Requires definition of specific vectors across multiple papers for meaningful relationships).

## M16: CT-GIN Template Self-Improvement Insights

*   **Vector ID:** M16
*   **Vector Type:** Feedback

### **Template Feedback:**

*    **Vector ID:** M16.1
*   **Vector Type:** Text
    *   **Missing Probes:**
        *   A probe specifically for "Stochasticity" could be useful (Source, Level, Role in dynamics).
        *   A probe for "Information Flow" quantifying information transmission rate, bottlenecks, or Shannon entropy changes.
    *   **Unclear Definitions:**
        *   The distinction between M4.2 "Local Interaction Rules" and M4.5 "Local Interaction Rules (for Self-Organization)" is slightly unclear; perhaps merge or clarify the focus of each. M4.5 seems redundant given M4.2.1.
        *   The conversion of Yes/No/Partial scores to numerical values for the overall score calculation in M13.1 needs explicit definition in the instructions.
        *   The "Yoneda Embedding Fulfillment Score" rubric and metrics need to be provided within the template for consistent application.
    *   **Unclear Node/Edge Representations:** Generally sufficient, but examples could be more diverse. For dynamic networks (like in this paper), guidance on representing temporally evolving edges would be helpful.
    *   **Scoring Difficulties:** Scoring Cognitive Proximity (M9.2, M9.3) relies heavily on subjective interpretation of the scale levels, even with justifications. More behavioral anchors or examples for each level might help consistency. The CT-GIN Readiness Score calculation method in M13.1 needs clarification.
    *   **Data Extraction/Output Mapping:** Mapping the concept of a dynamic communication network enabling better consensus to "Adaptive Plasticity" (M7) felt like a slight stretch of the definition provided; perhaps a dedicated category for "Structural Adaptation" or "Dynamic Topology Effects" could be considered if common. The split between M4.2/M4.5 and M4.3/M4.6 seems slightly redundant.
    *   **Overall Usability:** Quite comprehensive but very long. Some redundancy noted (e.g., M4.2 vs M4.5). The conditional logic is clear. Strict formatting demands high attention.
    * **Specific Suggestions:**
        1.  Clarify M13.1 score calculation (which scores are included, how non-numeric ones are treated).
        2.  Merge or clarify M4.2/M4.5 and M4.3/M4.6.
        3.  Provide the rubric/metrics for Yoneda score (M4.7).
        4.  Consider adding probes for Stochasticity and Information Flow.
        5.  Add behavioral examples for Cognitive Scale levels (M9.2/M9.3).
        6.  Provide guidance on representing dynamic network structures in CT-GIN mapping.