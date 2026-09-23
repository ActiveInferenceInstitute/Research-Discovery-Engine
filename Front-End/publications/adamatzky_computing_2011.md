# Computing with liquid crystal fingers: Models of geometric and logical computation

__Paper Type:__ Hybrid

## M1: System Overview & Implementation
*   **Vector ID:** M1
*   **Vector Type:** Overview

### **1.1 System Description**

*   **Vector ID:** M1.1
*   **Vector Type:** Description
    *   Content: The system uses cholesteric liquid crystals (LCs) confined in a thin layer between transparent electrodes. Applying an AC voltage above a threshold causes the formation and propagation of "cholesteric fingers" – localized domains of twisted LC alignment, visualized using dichroic dyes. These fingers nucleate at pre-defined defects/structures (e.g., SU8 protrusions). The system demonstrates computational capabilities: 1) Approximating planar Voronoi diagrams via branching fingers at higher voltages. 2) Performing convex subdivision of concave polygons using non-branching fingers originating from indentations. 3) Implementing a one-bit half-adder using collision-based computing principles, where fingers interact with obstacles and each other. A mobile automata model is also presented to simulate finger dynamics and computation. The purpose is to demonstrate geometric and logical computation using the physical dynamics of LC fingers. Components include cholesteric LC (MLC2037 doped with chiral additive zli811 and dichroic dyes), glass substrates with ITO electrodes, patterned SU8 structures for nucleation control, and an AC voltage source.
    *   CT-GIN Mapping: `SystemNode` attributes: `systemType`: LiquidCrystal, `domain`: MaterialComputation, `mechanism`: Electrohydrodynamics/CollisionBased, `components`: CholestericLC, Electrodes, VoltageSource, NucleationSites, `purpose`: GeometricComputation, LogicalComputation
    *   Implicit/Explicit: Explicit
        *  Justification: The Abstract, Introduction (Sec 1), Fabrications (Sec 2), and subsequent sections explicitly describe the materials, setup, finger behavior, computational tasks demonstrated, and the simulation model.

### **1.2 Implementation Clarity**

*   **Vector ID:** M1.2
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The paper clearly describes the experimental fabrication of the LC cells (Sec 2), including materials (LC type, dopants, dyes, substrate, structures), dimensions (feature sizes, intended cell spacing tied to pitch), and operating conditions (voltage, frequency). The mobile automata model's rules are explicitly stated (Sec 3). The setups for Voronoi diagrams, convex subdivision, and the half-adder logic gates are described with diagrams. Some aspects could be clearer, such as the exact quantitative relationship between voltage and branching/speed, or the precise derivation/fitting of the automata rules to experimental data (it's stated as phenomenological). The reproducibility of complex logic gate interactions in experiments vs. simulation isn't exhaustively demonstrated.
    *   Implicit/Explicit: Mixed
        * Justification: Experimental details (materials, fabrication, operating conditions) are explicit. Model details are explicit. The link between the model parameters (e.g., rotation angle π/360) and physical reality is less explicit (stated as phenomenological, "exact angle .. not known"). The reliability/yield of the computational gates in physical experiments is implicitly low, as it's mostly shown via simulation after demonstrating basic finger interactions experimentally.

### **1.3 Key Parameters**

*   **Vector ID:** M1.3
*   **Vector Type:** ParameterTable
    *   Table:
        | Parameter Name | Value | Units | Source (Fig/Table/Section) | Implicit/Explicit | Data Reliability (High/Medium/Low) | Derivation Method (if Implicit) |
        | :------------- | :---: | :---: | :-----------------------: | :-----------------: | :-----------------------------: | :-------------------------------: |
        | AC Voltage (Propagation) | ~1.5 | V | Sec 2, Fig 2 caption | Explicit | High | N/A |
        | AC Voltage (Branching) | >1.7 | V | Sec 4 | Explicit | High | N/A |
        | AC Frequency | 1 | kHz | Sec 2 | Explicit | High | N/A |
        | LC Material | MLC2037 (+ zli811 + dyes) | N/A | Sec 2 | Explicit | High | N/A |
        | Cell Spacing / Pitch | ~5 (structures height) / Close to spacing | µm / µm | Sec 2 | Explicit/Mixed | Medium | Cell spacing inferred from structure height; Pitch relation explicitly stated as 'very close'. |
    *   **Note:** Other parameters like finger propagation speed or automata step size `d=0.5` exist but their direct physical correlation or units aren't consistently provided for the experiments.

## M2: Energy Flow
*   **Vector ID:** M2
*   **Vector Type:** Energy

### **2.1 Energy Input**

*   **Vector ID:** M2.1
*   **Vector Type:** Input
    *   Content: The primary energy source is an external AC voltage applied across the ITO electrodes sandwiching the liquid crystal layer.
    *   Value: ~1.5 - >1.7 (Amplitude)
    *   Units: V
    *   CT-GIN Mapping: `EnergyInputNode`: attributes - `source`: AC_VoltageSource, `type`: Electrical
    *   Implicit/Explicit: Explicit
        *  Justification: Section 2 explicitly states the use of a 1kHz sinusoidal voltage with amplitude around 1.5V, and Section 4 mentions branching above 1.7V.

### **2.2 Energy Transduction**

*   **Vector ID:** M2.2
*   **Vector Type:** Transduction
    *   Content: Electrical energy input drives electrohydrodynamic effects in the cholesteric LC. The applied electric field interacts with the LC's negative dielectric anisotropy, tending to rotate the director parallel to the substrates (Fig 1). This destabilizes the initial homeotropic alignment, and combined with the LC's chirality and elastic properties, leads to the formation and propagation of localized twisted structures (cholesteric fingers). Electrical energy is transduced into potential energy stored in the elastic deformation of the LC director field and kinetic energy associated with finger propagation and fluid flow (electroconvection mentioned as related phenomenon in Sec 1).
    *   CT-GIN Mapping: `EnergyTransductionEdge`: attributes - `mechanism`: Electrohydrodynamics/DielectricInteraction/ElasticDeformation, `from_node`: EnergyInputNode(Electrical), `to_node`: SystemNode(LC)/FingerNode(Mechanical/Structural)
    *   Implicit/Explicit: Mixed
        *  Justification: The paper explicitly states the field rotates the director due to negative dielectric anisotropy (Sec 1, Fig 1) and that this leads to finger formation. The connection to elastic energy minimization is mentioned (Sec 1). The precise flow dynamics and quantitative energy conversion pathways are implicit or rely on background LC physics knowledge.

### **2.3 Energy Efficiency**

*   **Vector ID:** M2.3
*   **Vector Type:** Score
    *   Score: 1
    *   Justification/Metrics: The paper does not provide any metrics for energy efficiency regarding the computation performed. Liquid crystal displays are generally low power, but the purpose here is computation via physical movement/interaction. Energy is primarily used to sustain the electric field and overcome viscous dissipation during finger propagation and LC reorientation. It's highly likely that only a tiny fraction of the input electrical energy is directly converted into the "work" of computation (changing finger trajectories). Efficiency is expected to be very Low.
    *   CT-GIN Mapping: Attribute `efficiency` (Low) of relevant `EnergyTransductionEdge`s
    *   Implicit/Explicit: Implicit
      *  Justification: Efficiency is not discussed or quantified. The low score is inferred based on the nature of the physical process (driving bulk material changes for computation) and general knowledge of LC device power consumption versus computational work.

### **2.4 Energy Dissipation**

*   **Vector ID:** M2.4
*   **Vector Type:** Dissipation
    *   Content: Energy dissipation mechanisms include: 1) Dielectric losses within the LC material due to the AC field. 2) Viscous dissipation associated with the movement of the LC molecules during director reorientation and finger propagation (LCs are fluids). 3) Potential losses at the electrode interfaces or in the driving circuitry (not discussed). Quantification is not provided. Qualitatively, viscous dissipation is likely significant given the movement of fingers through the fluid medium. Dielectric losses are inherent to AC operation. Assessment: Medium to High dissipation relative to computational work.
    *   CT-GIN Mapping: Creates `EnergyDissipationNode`s (DielectricLoss, ViscousDissipation) and `EnergyDissipationEdge`s from `SystemNode(LC)`/`FingerNode`.
    *    Implicit/Explicit: Implicit
        *  Justification: Dissipation mechanisms are not explicitly detailed or quantified in the paper. Their presence (dielectric loss, viscosity) is inferred from the standard physics of liquid crystals under AC fields and fluid dynamics.

## M3: Memory
*   **Vector ID:** M3
*   **Vector Type:** Memory

### **3.1 Memory Presence:**

*   **Vector ID:** M3.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The paper describes computations performed *during* the propagation and interaction of fingers while the voltage is applied. Section 2 states that fingers "retract when the voltage is removed," indicating the system state (finger presence/pattern) is not maintained after the stimulus ceases. While the *path* traced by a finger represents a history of its movement (and is modeled as an absorbing state '1' in the automata), this doesn't constitute memory in the sense of a persistent, potentially modifiable state influencing *future, distinct* computational runs after the system is reset or reconfigured. The computation relies on the dynamic process itself, not on stored information from previous runs.
    *    Implicit/Explicit: Mixed
        * Justification: The retraction upon voltage removal is explicit (Sec 2). The lack of persistent state influencing future computations is implicit, inferred from the description of the computational processes (Voronoi, subdivision, half-adder) which rely on active finger dynamics driven by the applied voltage.

**(Conditional: M3.1 is "No", skipping M3.2-M3.8)**

---

## M4: Self-Organization and Emergent Order
*   **Vector ID:** M4
*   **Vector Type:** Self-Organization

### **4.1 Self-Organization Presence:**

*   **Vector ID:** M4.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The formation of finger patterns, particularly the branching structures leading to Voronoi diagram approximations (Sec 4) and the spiral patterns (Fig 4), arise from local interactions (nucleation at defects, propagation driven by field/elasticity, chirality-induced turning bias, mutual repulsion/avoidance upon collision) without a global blueprint dictating the final pattern. The voltage level acts as a global parameter influencing local behavior (branching vs. non-branching), but the specific spatial arrangement emerges from local rules and initial/boundary conditions.
    *   Implicit/Explicit: Mixed
        *  Justification: Finger formation/propagation driven by local physics (field, elasticity, chirality) is explicit. The statement that fingers "repel each other" (Sec 1) and "deviate ... to avoid contact" (Sec 3) describes local interaction rules explicitly. The emergent nature of the Voronoi diagram ("approximate a planar Voronoi diagram," Abstract) and spiral patterns (Fig 4) is shown as a result of these local interactions, hence the emergent order is explicit. The explicit mapping to "self-organization" terminology is implicit, inferred from the definition.

**(Conditional: M4.1 is "Yes", including M4.2-M4.7)**

### **4.2 Local Interaction Rules:**

*   **Vector ID:** M4.2
*   **Vector Type:** Rules
    *   Content:
        1.  **Nucleation:** Fingers nucleate at specific points (defects, structure protrusions) when voltage exceeds a threshold (Sec 1, 2).
        2.  **Propagation:** Fingers extend/propagate while voltage is applied (Sec 2). The simulation model uses `xt+1 = xt+dsinα` and `yt+1 = yt+dcosα` with `d = 0.5` (Sec 3).
        3.  **Branching:** Above a critical voltage (~1.7V), fingers start to branch recursively (Sec 1, 4).
        4.  **Collision Avoidance/Repulsion:** Fingers repel each other (Sec 1) and deviate to avoid contact (Sec 3).
        5.  **Chirality Bias:** Fingers tend to turn in a preferred direction (e.g., left) upon collision or when avoiding obstacles, attributed to LC chirality (Sec 3, 5). In the model: If the target node is occupied, rotate left (`α = α + π/360`) and increment state `s` until a free node is found or `s` exceeds a threshold (Sec 3).
        6.  **Front Stoppage (Branching):** Wave-fronts formed by branching fingers stop propagating when they meet other fronts (Sec 4).
        7.  **Obstacle Interaction:** Fingers interact with predefined obstacles (regions of state '1' in the model), turning left upon collision (Sec 5, 6).
    *   CT-GIN Mapping: Defines "LocalInteraction" category edges between `FingerNode`s or `FingerNode` and `ObstacleNode`. Rules map to edge attributes like `type`: CollisionAvoidance/Branching/Stopping, `turn_bias`: Left, `threshold_voltage`: 1.7V. Propagation rule defines `FingerNode` state update.
    * **Implicit/Explicit**: Mixed
        *  Justification: Nucleation, propagation, branching, repulsion, turn bias, and front stopping are explicitly described. The specific mathematical/algorithmic form of the rules is explicit for the *model* (Sec 3, 5) but described phenomenologically for the experiment (e.g., "tend to turn," "repel"). The obstacle interaction rule is explicit for the model.

### **4.2.1 Local Interaction Parameters:**

* **Vector ID:** M4.2.1
* **Vector Type:** Table
*   Table:
    | Rule ID | Description | Parameter Name | Parameter Value Range | Units | Data Source | Implicit/Explicit | Justification |
    | :------ | :---------- | :------------- | :-------------------: | :---: | :----------: | :----------------: | :------------: |
    | 3 | Branching | Voltage Threshold | > 1.7 | V | Sec 4 | Explicit | Explicitly stated voltage for branching onset. |
    | 5 | Collision Turning Bias (Model) | Rotation Increment | π/360 | rad | Sec 3 | Explicit | Explicitly defined rotation step in the model. |
    | 5 | Collision Turning Bias (Model) | Stop Threshold | Not Specified (`s` exceeds threshold) | N/A | Sec 3 | Explicit | Existence of threshold `s` mentioned. |
    | 2 | Propagation Step (Model) | Step Size `d` | 0.5 | Lattice Units | Sec 3 | Explicit | Explicitly defined step size in the model. |

### **4.3 Global Order:**

*   **Vector ID:** M4.3
*   **Vector Type:** Order
    *   Content:
        1.  **Approximate Voronoi Diagram:** Edges formed by the non-occupied spaces where branching finger fronts meet (Sec 4, Figs 5, 6).
        2.  **Convex Subdivision:** Partitioning of a concave polygon into convex regions by the paths traced by non-branching fingers (Sec 5, Fig 7).
        3.  **Spiral Patterns:** Formation of spirals by interacting fingers when initiated sites are far apart (Sec 3, Fig 4).
        4.  **Logic Gate Function:** Specific output trajectories based on input finger presence/absence and collisions (Sec 6, Figs 8, 9, 10).
    *   CT-GIN Mapping: Defines `ConfigurationalNode` types: VoronoiApproximation, ConvexSubdivision, SpiralPattern, LogicGateState.
    * **Implicit/Explicit**: Explicit
        *  Justification: The paper explicitly identifies and shows figures/simulations of Voronoi approximations, convex subdivisions, spirals, and logic gate operations as outcomes of the finger dynamics.

### **4.4 Predictability of Global Order:**

*   **Vector ID:** M4.4
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: For the *simulations* (mobile automata model), the global order seems highly predictable given fixed initial conditions, rules, and obstacle placements (as needed for logic gates). For the *experiments*, predictability seems lower. Fig 5 shows reasonable approximation of Voronoi, but accuracy depends on branching density (Sec 4). Finger propagation can be influenced by uncontrolled defects or minor non-uniformities. The paper states fingers show "(almost) deterministic behaviour" (Sec 7), suggesting high but not perfect predictability. The model is phenomenological, hinting experimental outcomes might have variability not captured. Logic gates are primarily shown via simulation; experimental realization might be less predictable/reliable. Score reflects higher predictability in simulation, moderate predictability suggested for experiments. No quantitative predictability metrics provided.
    * **Implicit/Explicit**: Mixed
    *  Justification: The paper claims "(almost) deterministic behaviour" (Explicit, Sec 7) but also notes the model is phenomenological (Explicit, Sec 3) and accuracy depends on experimental conditions (Explicit, Sec 4). The high predictability of the simulation is implicit from its deterministic rules. The lower predictability of experiments is implicitly suggested by variability in real systems and lack of extensive experimental validation for logic gates.
    *   CT-GIN Mapping: Contributes to the `AdjunctionEdge` weight connecting local rules (`FingerNode` interactions) to global patterns (`ConfigurationalNode`).

### **4.5. Local Interaction Rules (for Self-Organization)**
* **Vector ID:** M4.5
* **Vector Type:** Table
*   Table:
| Rule ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Source |
| :------ | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :-----: |
| 3 | Branching Onset | Voltage | > 1.7 | V | Explicit | Stated threshold voltage. | Sec 4 |
| 5 | Collision Turn Bias (Model) | Turn Angle Increment | π/360 | rad | Explicit | Model parameter definition. | Sec 3 |
| 4/5 | Collision Avoidance | N/A (Implicit Interaction Potential) | N/A | N/A | Implicit | Rule described qualitatively ("repel," "avoid contact"). | Sec 1, 3 |
| 6 | Front Stoppage | N/A (Contact condition) | N/A | N/A | Explicit | Described as stopping on meeting. | Sec 4 |

### **4.6. Globally Emergent Order and Order Parameters**
* **Vector ID:** M4.6
* **Vector Type:** Table
*   Table:
| Property ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Protocol | Source |
| :---------- | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :------: | :-----: |
| Voronoi Approx. | Diagram Edges | Loci of non-occupied space | N/A | N/A | Explicit | Description of how diagram is formed. | Visual inspection / Algorithm comparison (Fig 5, 6) | Sec 4 |
| Convex Subdivision | Polygon Boundaries | Traced finger paths | N/A | N/A | Explicit | Description of how subdivision occurs. | Visual inspection (Fig 7) | Sec 5 |
| Spiral Formation | Spiral Shape | N/A (e.g., pitch, radius) | N/A | N/A | Explicit | Observation of spirals. | Visual inspection (Fig 4) | Sec 3 |
| Logic Output | Finger Trajectory | Presence/Absence at output | Boolean (0/1) | N/A | Explicit | Definition of logic states. | Simulation / Visual inspection (Fig 8, 10) | Sec 6 |
*   **Note:** Order parameters are mostly qualitative descriptions or boolean states in this work, not continuously varying quantitative measures of order.

### **4.7 Yoneda Embedding and Local-to-Global Mapping Fidelity**

*   **Vector ID:** M4.7
*   **Vector Type:** Table
*   Table:
    | Link Type | Description | Predictability | Yoneda Score | Metrics | Implicit/Explicit | Justification | Source |
    | :-------- | :---------- | :------------- | :----------- | :------ | :----------------: | :------------: | :-----: |
    | Local Rules -> Global Pattern | Mapping from finger interactions (collision, branching) to emergent Voronoi, subdivision, spirals, logic outputs. | Medium-High (See 4.4) | 4 | Qualitative comparison (simulation vs. target), Logic truth table | Mixed | Predictability assessed in 4.4. Fidelity assessed by visual comparison (Figs 5,6,7) and logic function verification (Fig 10, Sec 6). Yoneda score reflects qualitative match but lack of rigorous quantitative mapping fidelity measures. | Sec 4, 5, 6 |
    *   **Yoneda Embedding Fulfillment Score [0-10]:** 4. Rubric: 0=No relation; 2=Qualitative similarity; 4=Consistent qualitative mapping demonstrated via examples/simulations; 6=Quantitative mapping for some aspects; 8=Quantitative mapping rigorously validated; 10=Formal proof of equivalence. Example: Score 4 assigned as the paper shows via simulation and some experiments that local rules consistently produce the described global patterns, but without quantitative metrics of mapping accuracy or formal proofs.
    *   **Metrics:** Visual comparison of simulated/experimental patterns to ideal geometric constructs (Voronoi, convex shapes). Verification of logic gate truth tables via simulation.
    *   **Justification:** The paper demonstrates a relationship between local interaction rules and emergent global patterns/computations, primarily through simulation and qualitative experimental examples. The mapping is shown to work for the presented cases, but its general fidelity, sensitivity to parameters, and quantitative accuracy are not rigorously analyzed. The Yoneda embedding concept isn't used, but the score assesses the observed consistency of the local-to-global mapping.

## M5: Computation
*   **Vector ID:** M5
*   **Vector Type:** Computation

### **5.1 Embodied Computation Presence:**

*   **Vector ID:** M5.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The system performs computation (Voronoi diagram approximation, convex subdivision, logic gates) directly through the physical dynamics and interactions (propagation, collision, branching) of the liquid crystal fingers themselves, driven by the applied voltage. The computation is intrinsic to the material's behavior under the imposed conditions, not performed by an external controller interpreting sensor data.
    *    Implicit/Explicit: Explicit
        *  Justification: The paper's title and abstract explicitly state the goal is "Computing with liquid crystal fingers." Sections 4, 5, and 6 describe specific computational tasks performed by the fingers' physical behavior. Section 6 explicitly frames the half-adder in terms of collision-based computing intrinsic to the medium.

**(Conditional: M5.1 is "Yes", including M5.2-5.4)**

### **5.2 Computation Type:**

*   **Vector ID:** M5.2
*   **Vector Type:** Classification
    *   Content: Hybrid (Analog for geometric tasks, Collision-based/Digital-like logic for gates)
    *   CT-GIN Mapping: Defines the `ComputationNode` type attributes `computationStyle`: Hybrid, `subTypes`: [AnalogGeometry, CollisionLogic].
    *    Implicit/Explicit: Mixed
    *    Justification: The geometric computations (Voronoi, subdivision) rely on the continuous propagation and interaction of fronts/fingers in space, characteristic of analog computation in physical systems. The logic gates operate based on the presence/absence of fingers (digital-like states) and their discrete interaction outcomes (collision -> specific deflection/annihilation), fitting the paradigm of collision-based computing (explicitly mentioned in Sec 1, 6).

### **5.3 Computational Primitive:**

*   **Vector ID:** M5.3
*   **Vector Type:** Function
    *   Content: The most basic operations are:
        1.  **Collision/Interaction:** Two fingers colliding results in mutual deflection (typically left turn bias) or stopping. Finger colliding with an obstacle results in deflection (left turn bias). Finger colliding with a boundary/wall results in turning (left turn bias) and following the wall. (Sections 3, 5, 6).
        2.  **Branching:** A single finger tip splitting into two under higher voltage (Sec 1, 4).
        3.  **Propagation:** Movement of a finger tip through the medium (Sec 3).
        *   **Sub-Type (if applicable):** Collision/Interaction (Deflection/Annihilation/Stopping), Branching (Tip-splitting), Propagation (Directed Movement). These primitives combine to perform higher-level functions like logic gates (e.g., AND via selective collision/deflection in Fig 8) or geometric partitioning.
    *   CT-GIN Mapping: Defines the primary function attributes of `ComputationNode` or related `InteractionEdge`s, e.g., `primitive`: Collision, Branching, Propagation; `collision_outcome`: Deflection/Stop.
    *   Implicit/Explicit: Explicit
    * Justification: Finger propagation, branching, and collision behaviors (including deflection rules based on chirality/model) are explicitly described in Sections 1, 3, 4, 5, and 6 as the basis for the observed phenomena and computations.

### **5.4 Embodied Computational Units**
* **Vector ID:** M5.4
* **Vector Type:** Table
*   Table:
| Unit ID | Description | Processing Power | Energy/Operation | Freq/Resp. Time | Bit-Depth | Data Source | Implicit/Explicit | Justification |
| :------ | :---------- | :--------------- | :--------------- | :--------------: | :-------: | :----------: |:-----------------:| :-----------------:|
| Finger Tip | Mobile localization representing information/process | N/A | N/A | Speed implicitly meters/sec (Fig 2: ~80s for ~100s µm?), Interaction time ~seconds | N/A (Analog position) / 1 bit (Presence/Absence for logic) | Fig 2, Sec 2, 6 | Implicit | Identity as unit explicit; Metrics are N/A or inferred. Speed estimate crude. |
| Collision Point | Location where two fingers or finger/obstacle interact | N/A (performs deflection logic) | N/A | ~seconds (duration of interaction/deflection) | N/A | Fig 2, 8, 10 | Implicit | Interaction is explicit; Metrics N/A or inferred timeframe. |
| Branching Point | Location where a finger splits | N/A (performs duplication/spread) | N/A | N/A | N/A | Fig 5 | Implicit | Branching is explicit; Metrics N/A. |
*   **Note:** Processing power, energy/operation, and bit-depth are not discussed or quantified in the paper. Timescales are suggested by experimental images (Fig 2) but not precisely measured or generalized.

## M6: Temporal Dynamics
*   **Vector ID:** M6
*   **Vector Type:** Temporal

### **6.1 Timescales:**

*   **Vector ID:** M6.1
*   **Vector Type:** ParameterTable
    *   Table:
        | Timescale Description | Value | Units | Source | Implicit/Explicit | Justification |
        | :-------------------- | :---: | :---: | :----: | :----------------: | :------------: |
        | Finger Propagation (Experiment, Fig 2) | ~4 to 80 | s | Fig 2 caption | Explicit | Time points given for snapshots showing propagation distance (~100s µm). |
        | Finger Propagation Speed (Estimate) | ~1-10 | µm/s | Fig 2 | Implicit | Estimated crudely from distance/time in Fig 2 snapshots. |
        | Voltage Application Frequency | 1 | kHz | Sec 2 | Explicit | Stated operating parameter. |
        | Computation Time (Voronoi, Fig 5) | Not specified (likely minutes) | s / min | Fig 5 | Implicit | Observation of complex pattern formation; comparison to Fig 2 suggests longer times. |
        | Computation Time (Half-adder, Sim Fig 10) | Not specified (relative steps) | Simulation Steps | Fig 10 | Implicit | Simulation shows sequential steps, but real-time duration not provided. |
    *   **Note:** Timescales are primarily qualitative or estimated from figures.

### **6.2 Active Inference:**

*   **Vector ID:** M6.2
*   **Vector Type:** Assessment
    *   Content: No
    *   Justification: The system's behavior (finger propagation, collision, branching) appears reactive, determined by the applied field, initial conditions, LC physics, and pre-defined obstacles. There is no evidence presented that the fingers (or the system as a whole) possess an internal model of their environment, predict future states, or actively select actions to minimize surprise or prediction error. The paths taken are consequences of physics and interactions, not goal-directed choices based on internal prediction.
    *   Implicit/Explicit: Implicit
        *  Justification: Active inference is not mentioned. The description focuses on the physics of finger dynamics and their use for computation based on these predetermined dynamics. The absence of evidence for prediction, internal models, or goal-directed action selection leads to the "No" conclusion.
    *   **If Yes/Partial, provide examples of testable CT-GIN metrics that *could* be used to quantify active inference:** N/A

## M7: Adaptation
*   **Vector ID:** M7
*   **Vector Type:** Adaptation

### **7.1 Adaptive Plasticity Presence:**

*   **Vector ID:** M7.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The paper does not describe or demonstrate any changes in the system's behavior or internal structure based on experience that lead to improved performance or altered functionality over time. The computational processes (Voronoi, subdivision, logic gates) rely on fixed physical laws and pre-designed structures (nucleation sites, obstacles). There is no learning or adaptation mechanism presented; the system executes the computation based on its current state and inputs, but doesn't modify its rules or structure for future runs based on past outcomes.
    *    Implicit/Explicit: Implicit
        * Justification: Adaptation and learning are not discussed. The described behaviors are presented as direct outcomes of the physics under specific conditions, implying a fixed stimulus-response or computational pathway for a given setup, rather than evolving behavior.

**(Conditional: M7.1 is "No", skipping M7.2)**

## M8: Emergent Behaviors
*   **Vector ID:** M8
*   **Vector Type:** Behavior

### **8.1 Behavior Description:**

*   **Vector ID:** M8.1
*   **Vector Type:** Description
    *   Content:
        1.  **Geometric Partitioning:** Approximating planar Voronoi diagrams using branching fingers competing for space (Sec 4). Subdividing concave polygons into convex shapes using non-branching fingers originating from indentations (Sec 5).
        2.  **Logical Computation:** Implementing Boolean logic gates (specifically a one-bit half-adder composed of AND-like gates) via controlled collisions between fingers and obstacles (Sec 6).
        3.  **Pattern Formation:** Generation of spiral patterns from interacting fingers under specific initial conditions (Sec 3, Fig 4).
    *   CT-GIN Mapping: Defines `BehaviorArchetypeNode` types: GeometricPartitioning (subtypes: VoronoiApproximation, ConvexSubdivision), LogicalComputation (subtype: HalfAdder), PatternFormation (subtype: Spiral).
    *    Implicit/Explicit: Explicit
       *  Justification: These behaviors (computing Voronoi diagrams, convex subdivision, logic gates, forming spirals) are explicitly described and demonstrated (experimentally or via simulation) as the key outcomes and applications of the LC finger system.

### **8.2 Behavior Robustness:**

*   **Vector ID:** M8.2
*   **Vector Type:** Score
    *   Score: 3
    *   Justification: Robustness is not quantitatively assessed. Qualitatively: Geometric partitioning (Voronoi) accuracy depends on branching density (Sec 4), suggesting sensitivity to voltage/parameters. Logic gates are demonstrated via idealized simulations; experimental robustness to noise, defects, minor misalignments, or parameter drift is questionable and not shown. The "(almost) deterministic" claim (Sec 7) suggests some robustness, but the reliance on specific collision outcomes and trajectories in the logic design seems potentially fragile in a real physical system with inherent fluctuations and imperfections. The mobile automata model is noted as coarse-grained and phenomenological (Sec 3). Overall, robustness seems low, especially for complex computations like the half-adder in a physical implementation.
    *   Implicit/Explicit: Implicit
        *  Justification: Robustness is not explicitly discussed or quantified. The low score is inferred from the sensitivity mentioned for Voronoi diagrams, the reliance on idealized simulations for logic, the phenomenological nature of the model, and general knowledge about the sensitivity of physical computing systems to noise and imperfections.
    *   CT-GIN Mapping: This score contributes to the reliability attributes of the `BehaviorArchetypeNode`.

### **8.3 CT-GIN Emergent Behavior Validation**

*    **Vector ID:** M8.3
*    **Vector Type:** Validation
     *  Content:
        *   **Voronoi/Subdivision:** Claims validated through experimental observation (optical microscopy images, Figs 2, 5) and corresponding mobile automata simulations (Figs 3, 6, 7). Visual comparison between experimental/simulated patterns and ideal geometric constructs is used (e.g., calculated Voronoi edges overlaid in Figs 5, 6). Reliability/reproducibility not quantified.
        *   **Logic Gates:** Primarily validated through mobile automata simulations demonstrating the correct truth table behavior for the designed half-adder (Sec 6, Fig 10) and the basic gate (Fig 8). Experimental validation is limited to showing basic finger collision/deflection (Fig 2), which provides plausibility but doesn't demonstrate functional gates. Robustness/yield not assessed.
        *   **Spiral Patterns:** Validated through simulation (Fig 4). Link to specific experimental conditions less clear.
     *   Implicit/Explicit: Explicit
    *   Justification: The methods of validation (experimental images, simulations, comparison to ideal constructs, truth table verification) are explicitly presented in the text and figures cited.

## M9: Cognitive Proximity
*   **Vector ID:** M9
*   **Vector Type:** Cognition

### **9.1 Cognitive Mapping:**

*   **Vector ID:** M9.1
*   **Vector Type:** Description
    *   Content: The paper uses the term "computing" explicitly and implements functions analogous to computational geometry algorithms (Voronoi diagram, convex subdivision) and digital logic circuits (half-adder). This maps the system's behavior to specific computational tasks. However, there is no explicit mapping to broader cognitive processes like learning, memory (in a persistent sense), decision-making beyond gate logic, or consciousness. The mapping is strictly functional at the level of specific computational operations.
    *   CT-GIN Mapping: Defines `CognitiveMappingEdge` from `BehaviorArchetypeNode` (e.g., GeometricPartitioning, LogicalComputation) to `CognitiveFunctionNode` (e.g., SpatialReasoning_Analog, BooleanLogic).
    *   Implicit/Explicit: Explicit
    * Justification: The use of "computing," "Voronoi diagram," "convex subdivision," and "half-adder" explicitly maps the system's functions to known computational concepts.

### **9.2 Cognitive Proximity Score:**

*   **Vector ID:** M9.2
*   **Vector Type:** Score
    *   Score: 2
    *   Justification: The system demonstrates **Level 1 (Simple Responsivity)** through basic finger propagation in response to voltage and **Level 2 (Sub-Organismal Responsivity)** through the complex, non-trivial pattern formation (Voronoi, spirals) and rule-based interactions implementing logic. However, it lacks demonstrated persistence/memory beyond the active process, adaptation/learning based on experience, internal models, goal-directedness beyond executing the pre-determined physics/logic design, and other higher cognitive functions. The computation, while complex, is largely reactive based on physics and initial/boundary conditions. It performs specific computations but doesn't exhibit broader cognitive capabilities.
    *   Implicit/Explicit: Mixed
    *  Justification: The score is assigned based on assessing the explicitly described behaviors (responsivity, pattern formation, logic execution) against the definitions in the Cognizance Scale. The absence of evidence for higher levels (memory, adaptation, internal models etc.) is implicit based on the paper's content.

**CT-GIN Cognizance Scale:** (Provided in template)

### **9.3 Cognitive Function Checklist**

* **Vector ID:** M9.3
* **Vector Type:** Checklist
    *   | Cognitive Function               | Score (0-10) | Justification/Notes                                                                       | CT-GIN Mapping (if applicable) | Implicit/Explicit | Justification for Implicit/Explicit/Mixed |
    | :-------------------------------- | :----------: | :------------------------------------------------------------------------------------ | :--------------------------------: | :-----------------:|:-----------------:|
    | Sensing/Perception               |      3       | Senses voltage level (influences branching), obstacles/boundaries, presence of other fingers (triggers collision rule). Limited scope. | SensingNode | Explicit/Implicit | Sensing voltage/obstacles is explicit; Perceiving detailed features is absent (implicit). |
    | Memory (Short-Term/Working)        |      1       | Path traced is a form of transient spatial memory within the automata model (absorbing state), but not persistent/reusable physical memory. | N/A | Implicit | No evidence for working memory in physical system; model has path memory. |
    | Memory (Long-Term)                 |      0       | No evidence of persistent state changes influencing future computations after stimulus removal. | N/A | Implicit | Explicitly retracts; no mention of persistent memory. |
    | Learning/Adaptation              |      0       | No mechanism described for behavior modification based on experience or feedback. | N/A | Implicit | No mention or evidence of learning/adaptation. |
    | Decision-Making/Planning          |      2       | Basic decisions inherent in logic gates (output path depends on input collisions). No planning or complex decision-making. | ComputationNode (Logic) | Explicit/Implicit | Logic gate function is explicit; termed "decision" is an interpretation. |
    | Communication/Social Interaction |      1       | Fingers "interact" via collision/repulsion, influencing each other's paths. No symbolic communication. | InteractionEdge | Explicit/Implicit | Interaction is explicit; termed "communication" is analogy. |
    | Goal-Directed Behavior            |      1       | System achieves pre-defined goals (compute Voronoi, logic function) via physics, not internal goal representation or flexible planning. | BehaviorArchetypeNode | Implicit | Achieves computational task, but lacks internal goal representation. |
    | Model-Based Reasoning              |      0       | No evidence of internal models used for prediction or reasoning. | N/A | Implicit | No mention or evidence of internal models. |
    | **Overall score**                 |    ~1.1      | Reflects basic sensing/interaction and computation, but lacks memory, learning, and higher cognitive functions. | N/A | N/A | Calculated average. |

## M10: Criticality Assessment
*   **Vector ID:** M10
*   **Vector Type:** Criticality

### **10.1 Criticality:**

*   **Vector ID:** M10.1
*   **Vector Type:** Assessment
    *   Content: Unclear
    *   Justification: The paper does not explicitly discuss criticality, power laws, scale-free behavior, or operation near a phase transition in the context of information processing or optimal function. While the onset of branching occurs above a "critical voltage" (Sec 4), this likely refers to a bifurcation or threshold phenomenon, not necessarily criticality in the sense of complex systems physics (e.g., optimized information transmission or dynamic range). There is no analysis presented to support or refute operation near a critical point for computational benefit.
        *   Critical Parameters (If Yes/Partial): N/A
        *   Evidence: N/A
    *   Implicit/Explicit: Implicit
    *    Justification: Criticality is not mentioned. The assessment is based on the absence of evidence or discussion related to criticality concepts in the paper.

## M11: Review Paper Specifics (Conditional)

N/A (Paper Type is Hybrid)

## M12: Theoretical Paper Specifics (Conditional)

N/A (Paper Type is Hybrid)

## M13: Overall Assessment & Scoring

*   **Vector ID:** M13
*   **Vector Type:** Overall

### **13.1 CT-GIN Readiness Score:**

*   **Vector ID:** M13.1
*   **Vector Type:** Score
*   **Calculated Score:** 3.5
    * Calculation: (M1.2[8] + M2.3[1] + M3.1[No=0] + M4.1[Yes=10] + M8.2[3] + M9.2[2]) / 6 = (8 + 1 + 0 + 10 + 3 + 2) / 6 = 24 / 6 = 4.0. Re-evaluating M3.1 based on the definition (change in state persists *beyond* stimulus, influencing *future* behavior). Since the state doesn't persist, score 0. Re-evaluating M4.1 (Self-Organization Presence): Yes -> Map Yes/No to 10/0 score. Score is 10. Final calculation: (8+1+0+10+3+2) / 6 = 24/6 = 4.0. Let's check the template: "(Average of scores from Modules 1-4, M8.2 and M9.2, scores with N/A convert in 0)". This refers to *primary* scores for the modules/aspects, not just binary presence. Assume M2.3 (Efficiency) = 1, M3 (Memory) = 0 (since M3.1 is No), M4 (Self-Org) needs a score - let's use M4.4 Predictability=7. So, (M1.2[8] + M2.3[1] + M3.2[N/A=0] + M4.4[7] + M8.2[3] + M9.2[2]) / 6 = (8+1+0+7+3+2)/6 = 21/6 = 3.5.

**CT-GIN Readiness Summary Table:**

| CT-GIN Aspect                   | Strength (Yes/Partial/No) | Key Supporting Metrics (with units) | Limitations (Missing Metrics/Data Gaps)                                           | Improvement Areas (Future Research)                                          |
| :------------------------------ | :-----------------------: | :-----------------------------------| :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| Energy Flow Efficiency          | No                       | Voltage (V), Frequency (kHz)         | Efficiency not quantified, Dissipation pathways unclear.                     | Quantify energy consumption per operation, analyze dissipation mechanisms.   |
| Memory Fidelity                 | No                       | N/A                                  | No persistent memory demonstrated.                                               | Investigate mechanisms for state retention (e.g., metastable LC structures). |
| Organizational Complexity       | Yes                      | Branching voltage threshold (>1.7V), Visual patterns (Voronoi, Spirals) | Quantitative order parameters missing, Predictability limited experimentally.    | Develop quantitative measures of emergent order, improve predictability analysis. |
| Embodied Computation            | Yes                      | Logic functions (AND-like, XOR, SUM), Geometric partitioning | Processing speed/power/accuracy not quantified, Primarily simulation-based for logic. | Quantify computational metrics, demonstrate robust experimental logic gates. |
| Temporal Integration            | Partial                  | Propagation time (s), Speed (~µm/s)  | Limited quantitative timescale data, No active inference.                     | Characterize dynamics more rigorously, explore time-dependent computations. |
| Adaptive Plasticity             | No                       | N/A                                  | No mechanism for learning or adaptation present.                                | Introduce feedback mechanisms enabling structural/behavioral modification. |
| Functional Universality         | No                       | Specific gates (Half-adder), Specific geometric tasks | Limited computational repertoire shown, Turing completeness unlikely.     | Explore realization of universal gate sets, expand computational tasks. |
| Cognitive Proximity            | Partial                  | Low Cognizance Score (2), Basic sensing/logic | Lacks memory, learning, planning, internal models.                             | Integrate memory and adaptation mechanisms.                                  |
| Design Scalability & Robustness | No                       | Feature sizes (~µm)                  | Robustness low (inferred), Scalability for complex computation unclear. | Assess noise tolerance, develop scalable fabrication/control methods.      |
| **Overall CT-GIN Readiness Score** | 3.5                      | N/A                                  | N/A                                                                              | N/A                                                                           |


### **13.2 Qualitative CT-GIN Assessment Conclusion:**

*   **Vector ID:** M13.2
*   **Vector Type:** Textual Summary
    *   Content: This work demonstrates computation embodied directly within the physics of cholesteric liquid crystal fingers. Key strengths include the clear linkage of local electrohydrodynamic phenomena and interaction rules (propagation, branching, collision avoidance) to emergent global behaviors performing specific computational tasks (geometric partitioning, Boolean logic). The system exhibits self-organization leading to patterns like Voronoi approximations. However, key limitations restrict its classification as truly cognizant matter within the CT-GIN framework. Primarily, there is no evidence of persistent memory influencing future behavior, nor any mechanism for adaptive plasticity or learning. Energy efficiency and computational robustness are likely low and are not quantified. While mapping to computational functions is explicit, the cognitive proximity is low (Level 2), lacking higher-order functions. The reliance on simulation for complex logic gate validation highlights potential challenges in experimental robustness and scalability. Overall, the system represents an interesting example of unconventional, embodied computation using material dynamics, but significant advancements in memory, adaptation, and robustness are needed to progress towards higher levels of material intelligence.
### **13.3 CT-GIN Refinement Directions:**

*   **Vector ID:** M13.3
*   **Vector Type:** Recommendations
    *   Content:
        *   **Memory Implementation:** Investigate methods to create persistent or metastable LC structures/patterns that can encode information beyond the duration of the applied voltage, potentially using different LC phases, boundary conditions, or photo-switchable dopants.
        *   **Adaptive Mechanisms:** Explore incorporating feedback mechanisms where computational outcomes (e.g., path choices, error signals) modify local properties (e.g., nucleation sites, obstacle properties, local fields) to enable learning or adaptation over time.
        *   **Robustness & Scalability Analysis:** Quantitatively characterize the system's robustness to noise, parameter variations, and defects, particularly for logic operations. Investigate methods for scaling the system to perform more complex computations reliably.
        *   **Energy Efficiency Quantification:** Measure the energy consumed per computational operation (e.g., per gate switching, per unit area processed for Voronoi) and analyze dissipation pathways to identify potential optimizations.
        *   **Quantitative Dynamics/Order:** Develop and apply quantitative metrics to characterize finger dynamics (speed, branching rate vs. voltage) and the fidelity/accuracy of the emergent geometric patterns (e.g., deviation from ideal Voronoi).
        *   **Explore Universality:** Investigate whether a universal set of logic gates can be reliably implemented using this collision-based approach.

## M14: CT-GIN Knowledge Graph

*   **Vector ID:** M14
*   **Vector Type:** Visualization

### **14.1. CT-GIN Knowledge Graph:**
* **Content:**
[Conceptual Description: The graph would center around a `SystemNode` (Cholesteric LC). An `EnergyInputNode` (AC Voltage) connects via an `EnergyTransductionEdge` (Electrohydrodynamics) to the `SystemNode` and `FingerNode`s. `FingerNode`s represent individual propagating fingers, possessing attributes like `position`, `velocity_vector`, `state` (propagating/stopped). Local interactions between `FingerNode`s (or `FingerNode` and `ObstacleNode`) are represented by `InteractionEdge`s (type: Collision/Repulsion, turn_bias: Left). Branching is an attribute/event associated with a `FingerNode` linked to the `EnergyInputNode`'s voltage attribute exceeding a threshold. These local interactions and dynamics (represented potentially by TemporalEvolution edges) lead to `ConfigurationalNode`s (Voronoi, Subdivision, LogicState, Spiral) via `AdjunctionEdge`s representing the local-to-global mapping. `BehaviorArchetypeNode`s (GeometricPartitioning, LogicalComputation) encapsulate the functional outcomes, linked from `ConfigurationalNode`s. A `CognitiveMappingEdge` connects `BehaviorArchetypeNode`s to `CognitiveFunctionNode`s (BooleanLogic, SpatialReasoning_Analog). Reliability/Robustness attributes would modify relevant nodes/edges. Energy dissipation would be represented by edges from `SystemNode`/`FingerNode` to `EnergyDissipationNode`s (Viscous, Dielectric).]

## M15: Relationship Vectors
*   **Vector ID:** M15
*   **Vector Type:** Relationships
*   Relationships:
        | Source Vector ID | Target Vector ID | Relationship Type |
        | ------------- | ------------- | ----------------- |
        | M1.1          | M2.1          | System Requires Energy |
        | M2.1          | M2.2          | Energy Input Transduced |
        | M2.2          | M1.1          | Transduction Enables System Function |
        | M2.2          | M4.1          | Energy Drives Self-Organization |
        | M4.2          | M4.3          | Local Rules Cause Global Order |
        | M4.1          | M5.1          | Self-Organization Enables Computation |
        | M4.2          | M5.3          | Local Interactions are Computational Primitives |
        | M5.1          | M8.1          | Computation is System Behavior |
        | M8.1          | M9.1          | Behavior Mapped to Cognitive Function |
        | M1.3          | M4.2.1        | System Parameters Define Local Rules |
        | M1.3          | M6.1          | System Parameters Influence Timescales |
        | M8.1          | M8.2          | Behavior has Robustness Property |
        | M1.2          | M13.1         | Clarity influences Readiness Assessment |
        | M3.1          | M13.1         | Memory influences Readiness Assessment |
        | M7.1          | M13.1         | Adaptation influences Readiness Assessment |
        | M9.2          | M13.1         | Cognition Score influences Readiness Assessment |

## M16: CT-GIN Template Self-Improvement Insights

*   **Vector ID:** M16
*   **Vector Type:** Feedback

### **Template Feedback:**

*    **Vector ID:** M16.1
*   **Vector Type:** Text
Provide specific, actionable feedback on the *CT-GIN template itself*, based on this analysis:
    *   **Missing Probes:**
        *   A probe specifically addressing the *fidelity* or *accuracy* of the computation (e.g., How close is the Voronoi approximation? What is the error rate of the logic gates?) would be valuable under M5 or M8.
        *   A probe on *Control* mechanisms (How is computation initiated, terminated, or steered?) could be useful under M1.
        *   Explicit probe for *Information Representation*: How is information encoded (e.g., finger presence/absence, position, trajectory, pattern)? Currently implicit in M5/M8.
    *   **Unclear Definitions:**
        *   The distinction between M4 (Self-Organization) and M8 (Emergent Behaviors) could be clarified. Self-organization describes the *process* of pattern formation from local rules, while emergent behavior describes the *functional outcome*. The template uses them correctly, but perhaps a note reinforcing this distinction would help.
        *   The scope of "Memory" (M3) vs. transient states during computation needs careful application. The definition ("persists beyond stimulus, influencing future behavior") is good but requires strict interpretation, as done here (ruling out the simulation's path memory as sufficient for the *physical* system).
    *   **Unclear Node/Edge Representations:**
        *   Guidance on representing *processes* vs. *states* could be enhanced. E.g., Is 'Collision' an edge attribute or a transient node? The conceptual description in M14.1 helps, but formalizing this might be useful.
        *   Representing the link between global parameters (like Voltage in M1.3) and local rules (like Branching in M4.2) within the CT-GIN mapping suggestions could be more explicit.
    *   **Scoring Difficulties:**
        *   Assigning the Yoneda Score (M4.7) was difficult without the paper using CT concepts; relying on analogy/interpretation of local-to-global mapping fidelity felt imprecise. Providing a clearer rubric tied to observable/measurable system properties rather than CT formalism might be more applicable universally.
        *   Calculating the CT-GIN Readiness Score (M13.1) required interpretation of *which* scores to average (module presence vs. specific quantitative scores). Explicitly listing the Vector IDs to be averaged would be clearer. Mapping Yes/No binary answers to a 0/10 scale for averaging felt necessary but wasn't explicitly stated.
    *   **Data Extraction/Output Mapping:**
        *   Extracting quantitative data for robustness (M8.2), efficiency (M2.3), or computational metrics (M5.4) was often impossible as papers may not report them. The template handles this with N/A or qualitative assessment, which is appropriate.
        *   Mapping qualitative descriptions (like local rules) to concise CT-GIN attribute values required some summarization/interpretation.
    *   **Overall Usability:** The template is very detailed and comprehensive, forcing a thorough analysis. Its strength lies in its structured approach. The main challenge is the potential lack of information in source papers to fill all probes quantitatively, requiring careful use of qualitative assessment and justification for implicit/inferred answers. The conditional skipping of sections (M3, M4, M5, M7 dependent on binary answers) works well.
    * **Specific Suggestions:**
        *   Clarify the calculation method for M13.1 (list specific Vector IDs, specify how to handle Yes/No).
        *   Refine the Yoneda Score (M4.7) rubric to be less dependent on explicit CT knowledge in the source paper, focusing instead on measurable local-to-global mapping fidelity.
        *   Add optional probes for computational accuracy/fidelity and information representation.
        *   Consider adding a section on *Information Flow* separate from energy flow.