# Training all-mechanical neural networks for task learning through in situ backpropagation

__Paper Type:__ Hybrid

## M1: System Overview & Implementation
*   **Vector ID:** M1
*   **Vector Type:** Overview

### **1.1 System Description**

*   **Vector ID:** M1.1
*   **Vector Type:** Description
    *   Content: The system is a Mechanical Neural Network (MNN), implemented physically using 3D-printed flexible material (Agilus30) forming a network of nodes connected by bonds (analogous to springs). It performs machine learning tasks (behavior learning, regression, classification) by mapping input forces applied to specific nodes to output displacements measured at other nodes. The MNN learns by adjusting the stiffness (spring constants, implemented as bond widths) of its constituent bonds using an *in situ* backpropagation algorithm derived from the adjoint variable method. The purpose is to demonstrate a physical hardware platform for machine learning that leverages mechanical principles and local learning rules for potentially faster and more energy-efficient computation compared to digital systems, and to create adaptable material systems.
    *   CT-GIN Mapping: `SystemNode` attributes: `systemType`: MNN, `domain`: Mechanics/Materials Science/Machine Learning, `mechanism`: Elastic deformation, Adjoint method backpropagation, `components`: Nodes, Bonds (Springs), Input nodes, Output nodes, `purpose`: Physical ML hardware, Behavior learning, Adaptive material systems.
    *   Implicit/Explicit: Mixed
        *  Justification: The system (MNN), components (nodes, springs/bonds), purpose (ML tasks, physical hardware), and mechanism (in situ backprop, adjoint method) are explicitly described. The analogy to springs and the specific implementation details (Agilus30, widths represent stiffness) are explicit. The potential benefits (speed, energy efficiency) are explicitly mentioned as motivations. The precise physical interaction details are implicitly based on standard mechanics.

### **1.2 Implementation Clarity**

*   **Vector ID:** M1.2
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The paper clearly describes the theoretical basis of the *in situ* backpropagation (adjoint method) with equations. The experimental setup (3D printing, material, force application via weights, displacement measurement via imaging and correlation algorithms) is described well, including Figure 1. Simulation methods (bar elements, FEM validation, Adam optimizer details) are also mentioned, with key parameters provided in the Methods section. Some details, like the exact mapping function from width to stiffness or potential non-linear material effects at larger deformations, could be slightly clearer, but overall the implementation is well-documented for reproducibility.
    *   Implicit/Explicit: Mixed
        * Justification: The description of the theory, experimental setup, materials, and primary simulation methods is explicit. The score justification involves assessing the completeness and clarity of these explicit descriptions. Potential ambiguities or missing minor details are implicitly noted as limitations.

### **1.3 Key Parameters**

*   **Vector ID:** M1.3
*   **Vector Type:** ParameterTable
    *   Table:
        | Parameter Name | Value | Units | Source (Fig/Table/Section) | Implicit/Explicit | Data Reliability (High/Medium/Low) | Derivation Method (if Implicit) |
        | :------------- | :---: | :---: | :-----------------------: | :-----------------: | :-----------------------------: | :-------------------------------: |
        | Material | Agilus30 | N/A | Methods | Explicit | High | N/A |
        | MNN Dimensionality | 2D | N/A | Fig. 1, Methods | Explicit | High | N/A |
        | Initial Bond Width | 2 | mm | Methods | Explicit | High | N/A |
        | Bond Width Range (Training) | 1.5 - 2.5 | mm | Methods | Explicit | High | N/A |
        | Learning Rate (α, example) | 0.005 / 0.1 / 0.006 | N/A | Methods | Explicit | High | N/A |

    *   **Note:** Learning rates provided are examples for specific tasks mentioned. Other parameters like node count (n), bond count (m), spatial dimensionality (d) are mentioned theoretically but not always specified for each experiment. Reliability is High as these are directly stated design/method parameters.

## M2: Energy Flow
*   **Vector ID:** M2
*   **Vector Type:** Energy

### **2.1 Energy Input**

*   **Vector ID:** M2.1
*   **Vector Type:** Input
    *   Content: The primary energy source is mechanical work done by external forces applied to the input nodes. In the experiments described, this is gravitational potential energy converted via hanging weights.
    *   Value: Variable (e.g., 0.005*9.8 N, 0.01*9.8 N)
    *   Units: N (force), J (work/energy)
    *   CT-GIN Mapping: `EnergyInputNode`: attributes - `source`: External Force (Gravity/Weights), `type`: Mechanical Work / Potential Energy
    *   Implicit/Explicit: Mixed
        *  Justification: The application of external forces (F) is explicit (Eq. 1, experiments). The use of weights and gravity as the source in experiments is explicitly shown (Fig 1b, Fig 3e). The magnitude of force is specified for examples. The concept of energy input as mechanical work is implicit based on physics principles.

### **2.2 Energy Transduction**

*   **Vector ID:** M2.2
*   **Vector Type:** Transduction
    *   Content: Gravitational potential energy of weights is converted into kinetic energy as weights are applied, then into mechanical work done on the MNN. This work is primarily stored as elastic potential energy in the deformed bonds (springs) of the network. Energy flows from the input nodes through the connected bonds to the rest of the network, resulting in node displacements. During training, the calculated gradients implicitly guide the modification of bond stiffness, which changes how energy is stored and distributed in subsequent operations.
    *   CT-GIN Mapping: `EnergyTransductionEdge`: attributes - `mechanism`: Mechanical Work -> Elastic Potential Energy, `from_node`: EnergyInputNode, `to_node`: SystemNode (specifically, its elastic components).
    *   Implicit/Explicit: Implicit
        *  Justification: The paper focuses on the static equilibrium equations (Du=F) and the gradient calculation, not the energy transformations explicitly. The description of energy transduction (potential to elastic) is based on standard mechanical principles applied to the described system.

### **2.3 Energy Efficiency**

*   **Vector ID:** M2.3
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification/Metrics: The paper does not quantify energy efficiency. It mentions energy efficiency as a motivation compared to digital and optical networks ("offering faster and more energy-efficient information processing", "hold promise for better energy efficiency") but doesn't provide measurements or calculations for the MNN itself during operation or training. Efficiency would involve comparing useful computational work (related to loss function reduction or task performance) to total energy input, considering dissipation. Qualitative Assessment: Likely low for a single computation compared to the potential energy input, but potentially high parallelism could offer system-level advantages. The training efficiency benefit mentioned relates to obtaining the gradient in two steps vs finite differences.
    *   CT-GIN Mapping: Attribute of relevant `EnergyTransductionEdge`s
    *   Implicit/Explicit: Implicit
      *  Justification: Efficiency is mentioned as a motivation (explicit) but not measured or analyzed for the system itself (implicit lack of data). The justification discussion is inferred.

### **2.4 Energy Dissipation**

*   **Vector ID:** M2.4
*   **Vector Type:** Dissipation
    *   Content: Dissipation mechanisms are not explicitly discussed or quantified. Potential mechanisms include:
        1.  Internal material damping within the flexible Agilus30 material during deformation.
        2.  Friction at the points where the MNN is suspended or where forces are applied (e.g., string friction).
        3.  Air resistance (likely negligible).
        4.  Energy loss during the physical process of changing bond widths (if implemented physically).
        The analysis assumes quasi-static equilibrium, implicitly neglecting dynamic dissipation effects like damping during the computation step. Qualitative Assessment: Likely Medium internal damping for a rubber-like material.
    *   CT-GIN Mapping: Creates `EnergyDissipationNode`s (e.g., `MaterialDamping`, `Friction`) and `EnergyDissipationEdge`s (from `SystemNode` to `EnergyDissipationNode`).
    *    Implicit/Explicit: Implicit
        *  Justification: The paper does not mention or quantify energy dissipation. The identification of potential mechanisms is inferred based on the physical nature of the system (flexible material, mechanical setup).

## M3: Memory
*   **Vector ID:** M3
*   **Vector Type:** Memory

### **3.1 Memory Presence:**

*   **Vector ID:** M3.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The training process modifies the spring constants (k) of the MNN's bonds (physically represented by bond widths). This change (Δk) persists after the training step for a given input is complete. The modified spring constants constitute the system's memory, as they encode the learned information from the training data and directly influence the network's response (output displacements u) to future input forces F.
    *    Implicit/Explicit: Mixed
        * Justification: The update rule k → k - α∇L (Eq. 7) explicitly describes the change in system parameters (k). The fact that this change persists and influences future behavior (Du=F depends on k) is explicitly fundamental to the concept of training a neural network, though the term "memory" isn't used in this specific context. The interpretation as memory is explicit in the context of physical learning systems.

### **3.2 Memory Type:**

*   **Vector ID:** M3.2
*   **Vector Type:** Score
*   Score: 6
*   Justification: The memory is encoded in the physical structure (bond widths/stiffnesses). It is non-volatile (persists physically), potentially rewritable (via retraining), and analog (stiffness is continuous, though potentially discretized by fabrication/tuning limits). Capacity depends on the number of tunable bonds (m). Read-out is through the physical response (displacements u) under input forces (F). Retention is potentially long-term (stable physical change). Accuracy depends on the precision of the physical implementation and measurement. Compared to high-fidelity electronic memory, the write speed (training iterations) is slow, and density might be lower. The score reflects the presence of persistent, rewritable structural memory but acknowledges potential limitations in speed, density, and precise control compared to advanced memory technologies.
*   CT-GIN Mapping: Defines the `MemoryNode` type, attributes: `encoding`: Structural (Spring Constants/Bond Widths), `volatility`: Non-Volatile, `readout`: Mechanical Response (Displacement), `write_mechanism`: Gradient Descent (In Situ Backprop).
*    Implicit/Explicit: Mixed
    * Justification: The mechanism of change (adjusting k via Eq. 7) is explicit. The characteristics (non-volatile, structural encoding, readout via response) are directly inferable from the system description (Implicit/Mixed). The score justification compares these characteristics to general memory concepts (Inferred).

### **3.3 Memory Retention Time:**

*   **Vector ID:** M3.3
*   **Vector Type:** Parameter
*   Value: Long-term
*    Units: N/A
*   Justification: The memory is stored as physical changes in the bond stiffnesses (widths of 3D printed material). Assuming the material itself is stable, these changes should persist indefinitely or over the lifetime of the material structure, qualifying as long-term. The paper doesn't quantify degradation.
*    Implicit/Explicit: Implicit
        * Justification: The paper doesn't explicitly state a retention time. The "Long-term" assessment is inferred based on the physical nature of the memory encoding (material structure change).
*   CT-GIN Mapping: Key attribute `retention_time` of the `MemoryNode`.

### **3.4 Memory Capacity (Optional - if applicable)**

* **Vector ID:** M3.4
* **Vector Type:** Parameter
*  Value: m (number of bonds)
*   Units: tunable parameters (spring constants)
*   Justification: Each of the 'm' bonds in the network has a spring constant 'k_i' that can potentially be tuned during training (Eq. 7). Therefore, the memory capacity corresponds to the number of independent parameters that store the learned information. The magnitude or precision of each parameter also contributes, but the primary measure is the number of tunable elements.
*    Implicit/Explicit: Implicit
        *  Justification: The paper defines 'm' as the number of linear springs and 'k' as the vector of spring constants (trainable degrees of freedom), implying capacity relates to 'm'. It doesn't explicitly state "memory capacity".
*   CT-GIN Mapping: Key attribute `capacity` of the `MemoryNode`.

### **3.5 Readout Accuracy (Optional - if applicable)**

* **Vector ID:** M3.5
* **Vector Type:** Parameter
*   Value: High (Qualitative) / Low Error (Quantitative, e.g., <0.1 gradient error experimentally)
*   Units: N/A / error ratio
*   Justification: Readout involves applying an input force F and measuring the output displacement u. The accuracy of this readout depends on the precision of applying the force and measuring the displacement. Fig 1e shows experimental gradient error < 0.1 compared to simulation, suggesting high precision is achievable in measuring the quantities needed for learning (which rely on displacement/elongation measurements). The accuracy of the final task (regression/classification) also reflects readout fidelity (e.g., Fig 3c shows good agreement between experiment and simulation for regression).
*    Implicit/Explicit: Mixed
       *  Justification: Experimental results demonstrating high accuracy in gradient estimation (Fig 1e) and task performance (Fig 3c, Fig 4d) are explicit. The term "Readout Accuracy" is not used, but the concept is implicitly demonstrated by the experimental results.
*   CT-GIN Mapping: Attribute `readout_accuracy` of `MemoryNode` or related `ReadoutEdge`.

### **3.6 Degradation Rate (Optional - if applicable)**
* **Vector ID:** M3.6
* **Vector Type:** Parameter
    *   Value: N/A
    *   Units: N/A
    *   Justification: The paper does not discuss the degradation of the stored memory (i.e., changes in bond stiffness over time due to material fatigue, creep, or environmental factors).
    *    Implicit/Explicit: N/A
            * Justification: Information not present.
    *   CT-GIN Mapping: Attribute `degradation_rate` of the `MemoryNode`.

### **3.7 Memory Operations Energy Cost (Optional - if applicable)**
* **Vector ID:** M3.7
* **Vector Type:** Table
*   Table:
    | Memory Operation ID | Energy Consumption per Bit | Power Usage during Operation| Units | Uncertainty | Data Source Reference | Implicit/Explicit | Justification |
    | :------------------ | :--------------------------: | :-----------------------------: | :---: |:-----------------:|:-----------------:|:-----------------:| :------------------ |
    | Write (Single Parameter Update) | N/A | N/A | N/A | N/A | N/A | N/A | Paper doesn't quantify energy costs of memory operations. Update involves calculation (local multiplication) and physical change (if implemented). |
    | Read (System Response) | N/A | N/A | N/A | N/A | N/A | N/A | Reading is part of the system's mechanical response; energy cost relates to M2. |
*   Implicit/Explicit: N/A
    *   Justification: The paper does not provide information on the energy costs associated with writing (updating spring constants) or reading (measuring displacement response) the memory.

### **3.8 Memory Fidelity & Robustness Metrics (Optional - if applicable)**
* **Vector ID:** M3.8
* **Vector Type:** Table
*   Table:
    | Metric ID | Description | Value | Units | CT-GIN Mapping | Data Source | Implicit/Explicit | Justification |
    | :-------- | :---------- | :----: | :---: | :-------------: | :----------: |:-----------------:| :-----------------:|
    | Retrainability (Damage) | Ability to recover performance after bond pruning | ~80% accuracy recovered (Iris task) | % | `MemoryNode` attribute `robustness` | Fig 5e | Explicit | Demonstrates robustness/recoverability of the learned memory/function. |
    | Retrainability (Task Switch) | Ability to learn a new task starting from a previously trained state | High accuracy achieved (Class -> Reg -> Class) | % / MSE | `MemoryNode` attribute `rewritability` | Fig 5b, 5c | Explicit | Demonstrates the memory (parameters) can be overwritten/adapted for new tasks. |
*   Implicit/Explicit: Explicit
*   Justification: The retrainability experiments explicitly demonstrate aspects of memory robustness (damage recovery) and rewritability (task switching).

---

## M4: Self-Organization and Emergent Order
*   **Vector ID:** M4
*   **Vector Type:** Self-Organization

### **4.1 Self-Organization Presence:**

*   **Vector ID:** M4.1
*   **Vector Type:** Binary
    *   Content: Partial
    *   Justification: The system does not exhibit spontaneous self-organization in the classical sense (e.g., pattern formation without external templating or goal direction). The initial network structure is designed/fabricated. However, the *training process* uses *local* rules (gradient calculation based on local bond elongations, Eq. 6 & 7) to adapt the system's structure (spring constants) to achieve a *global* objective (minimizing the loss function). The final, functional configuration of spring constants *emerges* from this locally driven optimization process interacting with the training data. It's adaptive organization rather than spontaneous structure formation.
    *   Implicit/Explicit: Mixed
        *  Justification: The local update rule (Eq. 7) and the goal-directed nature (minimizing L) are explicit. The interpretation as partial self-organization (emergence of functional structure from local rules + global objective) is inferred/interpretive.

**(Conditional: If M4.1 is "No", skip to Module 5. If "Yes", include M4.2-M4.7)**
*(Proceeding as M4.1 is "Partial")*

### **4.2 Local Interaction Rules:**

*   **Vector ID:** M4.2
*   **Vector Type:** Rules
    *   Content: The key local rule governs the update of each bond's spring constant k_i. The gradient of the loss function L with respect to k_i is calculated locally as the Hadamard (element-wise) product of the bond's elongation in the forward pass (e_i) and its elongation in the adjoint pass (e_adj,i): ∇L_i = e_adj,i * e_i (Eq. 6). The update rule is then a form of gradient descent: k_i(t+1) = k_i(t) - α * ∇L_i = k_i(t) - α * e_adj,i * e_i (Eq. 7), potentially using optimizers like Adam. The forward and adjoint elongations depend on the local displacement differences across bond i.
    *   CT-GIN Mapping: Part of the `AdaptationEdge` (`Monad` edge in CT terms) description. Defines the update mechanism based on local information (`e_i`, `e_adj,i`).
    * **Implicit/Explicit**: Explicit
        *  Justification: Equations 6 and 7 explicitly define the local gradient calculation and the update rule based on local elongations.

### **4.2.1 Local Interaction Parameters:**

* **Vector ID:** M4.2.1
* **Vector Type:** Table
*   Table:
    | Rule ID | Description | Parameter Name | Parameter Value Range | Units | Data Source | Implicit/Explicit | Justification |
    | :------ | :---------- | :------------- | :---------- | :---: | :----------: | :----------------: | :------------: |
    | Eq. 7 | Gradient Descent Update | Learning Rate (α) | e.g., 0.005 - 0.1 | N/A | Methods | Explicit | Parameter controlling update step size. |
    | Eq. 7 | Gradient Descent Update | Forward Elongation (e_i) | Variable | mm or N/A (strain) | Measured/Simulated | Explicit | Local physical state variable used in update. |
    | Eq. 7 | Gradient Descent Update | Adjoint Elongation (e_adj,i) | Variable | mm or N/A (strain) | Measured/Simulated | Explicit | Local physical state variable used in update. |
    | Adam | Optimizer Parameter | β1 (Momentum Decay) | 0.9 | N/A | Methods | Explicit | Standard parameter for Adam optimizer. |
    | Adam | Optimizer Parameter | β2 (Squared Gradient Decay) | 0.999 | N/A | Methods | Explicit | Standard parameter for Adam optimizer. |

### **4.3 Global Order:**

*   **Vector ID:** M4.3
*   **Vector Type:** Order
    *   Content: The "global order" that emerges is the specific spatial pattern of bond stiffnesses (k_i values) across the entire network after training. This pattern is not arbitrary but is functionally organized to perform the desired computation (e.g., implement the regression function or classification boundaries) by appropriately mapping input forces to output displacements. Different tasks result in different emergent patterns of stiffnesses (compare insets in Fig 3d, 4b, 5a, 5b, 5c, 5e).
    *   CT-GIN Mapping: Defines a `ConfigurationalNode` representing the trained state (pattern of k_i). Attributes: `task_optimized_for`, `stiffness_pattern`.
    * **Implicit/Explicit**: Mixed
        *  Justification: The fact that training modifies bond stiffnesses (k) is explicit. The idea that the resulting pattern of stiffnesses constitutes a functional "global order" is an interpretation based on the system's behavior (Implicit). The figures showing different trained MNNs explicitly visualize these different patterns.

### **4.4 Predictability of Global Order:**

*   **Vector ID:** M4.4
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: Given the same network topology, training data, loss function, and optimization hyperparameters (like learning rate, initialization), the training process (gradient descent) is largely deterministic (though sensitive to initialization and data partitioning). Therefore, the resulting global pattern of stiffnesses should be highly predictable, converging to a local (or potentially global) minimum of the loss function. Stochasticity in data presentation (e.g., mini-batches) or initialization might lead to minor variations or convergence to different local minima, preventing perfect predictability (hence score < 10). The paper shows consistent convergence behavior (e.g., Fig 3b, 4b loss curves with error bars).
    * **Implicit/Explicit**: Implicit
    *  Justification: The paper doesn't explicitly discuss the predictability of the final stiffness pattern. The high predictability score is inferred based on the deterministic nature of the physics (Du=F) and the gradient descent algorithm used for training, supported implicitly by the presented consistent training curves.
    *   CT-GIN Mapping: Contributes to the `AdaptationEdge` reliability/determinism.

### **4.5. Local Interaction Rules (for Self-Organization)**
* **Vector ID:** M4.5
* **Vector Type:** Table
*   Table:
| Rule ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Source |
| :------ | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :-----: |
| Eq. 6 | Local Gradient Calculation | e_i | Variable | mm or N/A | Explicit | Forward elongation of bond i. | Eq. 6 |
| Eq. 6 | Local Gradient Calculation | e_adj,i | Variable | mm or N/A | Explicit | Adjoint elongation of bond i. | Eq. 6 |
| Eq. 7 | Stiffness Update Rule | α | e.g., 0.005 - 0.1 | N/A | Explicit | Learning rate parameter. | Methods |

### **4.6. Globally Emergent Order and Order Parameters**
* **Vector ID:** M4.6
* **Vector Type:** Table
*   Table:
| Property ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Protocol | Source |
| :---------- | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :------: | :-----: |
| Stiffness Pattern | Spatial distribution of bond stiffnesses | Vector k | [1.5mm, 2.5mm] widths -> corresponding stiffness range | N/m | Mixed | Represents the learned configuration. Width range explicit, stiffness implicit. | Training (Gradient Descent) | Fig 3d, 4b, 5a,b,c,e (Insets) |
| Task Performance | Accuracy/Loss on specific task | Accuracy / MSE | e.g., >90% / ~10^-7 | % / (units of L) | Explicit | Quantifies the function implemented by the emergent stiffness pattern. | Testing on dataset | Fig 3b, 4b |

### **4.7 Yoneda Embedding and Local-to-Global Mapping Fidelity**

*   **Vector ID:** M4.7
*   **Vector Type:** Table
*   Table:
    | Link Type | Description | Predictability | Yoneda Score | Metrics | Implicit/Explicit | Justification | Source |
    | :-------- | :---------- | :------------- | :----------- | :------ | :----------------: | :------------: | :-----: |
    | Local Rule -> Global Order | Mapping from local gradient updates (Eq. 7) to the final global stiffness pattern (vector k) | High (Score 8 in M4.4) | N/A | N/A | Implicit | The link exists (training process), predictability is high, but Yoneda formalisms are not used. | N/A |
    | Global Order -> Global Behavior | Mapping from the trained stiffness pattern (vector k) to the overall system behavior (e.g., regression accuracy, classification boundaries) | High | N/A | Accuracy, MSE Loss | Explicit | The trained network reliably performs the task. | Figs 3, 4 |
    *   **Yoneda Embedding Fulfillment Score [0-10]:** N/A
    *   **Metrics:** N/A
    *   **Justification:** The paper does not employ Category Theory or the Yoneda Lemma formalism to analyze the relationship between local rules and global behavior. Therefore, assessing fulfillment is not applicable based on the provided text.

## M5: Computation
*   **Vector ID:** M5
*   **Vector Type:** Computation

### **5.1 Embodied Computation Presence:**

*   **Vector ID:** M5.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The MNN performs computations (mapping input forces F to output displacements u) that implement machine learning tasks like regression and classification. This computation is intrinsic to the physical structure (nodes and bonds with specific stiffnesses) and the governing physics (Du=F). The computation *is* the physical response of the material system, not executed by an external controller based on sensor readings from the material.
    *    Implicit/Explicit: Mixed
        *  Justification: The system performing ML tasks (regression, classification) is explicit. The governing equation Du=F describing the physical response is explicit. The interpretation that this physical response *is* the embodied computation is implicit, though central to the concept of physical neural networks.

### **5.2 Computation Type:**

*   **Vector ID:** M5.2
*   **Vector Type:** Classification
    *   Content: Analog / Neuromorphic
    *   CT-GIN Mapping: Defines the `ComputationNode` type, attributes: `computation_type`: Analog, Neuromorphic.
    *    Implicit/Explicit: Mixed
    *    Justification: The inputs (forces) and outputs (displacements) are continuous physical quantities (Analog). The system is explicitly described as a Mechanical *Neural Network*, trained similarly to artificial neural networks (Neuromorphic).

### **5.3 Computational Primitive:**

*   **Vector ID:** M5.3
*   **Vector Type:** Function
    *   Content: The fundamental computation is the linear transformation defined by the system's stiffness matrix D (or its inverse, the compliance matrix D^-1), mapping input forces F to output displacements u: u = D^-1 * F. In the linear regime, interactions are analogous to weighted sums mediated by the network structure. The training process modifies the elements of D (since D depends on k) to implement a desired complex mapping (regression function or classification boundary). For classification, the primitive includes comparing output displacements.
    *   **Sub-Type (if applicable):** Linear Transformation (Matrix Multiplication) / Weighted Summation / Comparison (for classification).
    *   CT-GIN Mapping: Defines the primary function (`operator`) of the `ComputationNode`, e.g., `operator`: Linear Transformation (u = D^-1 * F).
    *   Implicit/Explicit: Mixed
    * Justification: The governing equation Du=F is explicit. Its interpretation as a linear transformation u = D^-1 * F is explicit in the theoretical derivation. The analogy to weighted sums in neural networks is implicit. The comparison step for classification is implicit in the task description.

### **5.4 Embodied Computational Units**
* **Vector ID:** M5.4
* **Vector Type:** Table
*   Table:
| Unit ID | Description | Processing Power | Energy/Operation | Freq/Resp. Time | Bit-Depth | Data Source | Implicit/Explicit | Justification |
| :------ | :---------- | :--------------- | :--------------- | :--------------: | :-------: | :----------: |:-----------------:| :-----------------:|
| MNN System | Entire network performing task (e.g., classification) | N/A (Task specific, e.g., classifications/sec) | N/A | Quasi-static (Implicit) / Speed of sound (Potential limit) | Analog (Implicit) | N/A | N/A | The paper doesn't quantify processing power, energy/op, or response time of the computation itself. Speed of sound mentioned as potential limit in discussion. |
| Bond Interaction | Local force transmission/elongation | N/A | N/A | Quasi-static (Implicit) | Analog (Implicit) | N/A | N/A | Individual bond interactions contribute to the overall computation but aren't characterized computationally. |

## M6: Temporal Dynamics
*   **Vector ID:** M6
*   **Vector Type:** Temporal

### **6.1 Timescales:**

*   **Vector ID:** M6.1
*   **Vector Type:** ParameterTable
    *   Table:
        | Timescale Description | Value | Units | Source | Implicit/Explicit | Justification |
        | :-------------------- | :---: | :---: | :----: | :----------------: | :------------: |
        | Computational Response Time (Prediction) | Quasi-static | s (?) | Implicit | Implicit | Assumed static equilibrium (Du=F) for computation/prediction. Actual time depends on achieving equilibrium (speed of sound/damping). |
        | Training Step Time (Forward + Adjoint + Update) | N/A | s (?) | Implicit | Implicit | Time to apply force, measure, apply adjoint force, measure, calculate update. Depends on experimental procedure. Mentioned as "two steps" algorithmically. |
        | Training Convergence Time | 100s - 1000s | Epochs | Fig 3b, 4b, 5 | Explicit | Number of iterations needed for the loss to converge during training simulations. |
        | Memory Retention | Long-term | N/A | Section M3.3 | Implicit | Persistence of the physical changes (bond stiffnesses). |

### **6.2 Active Inference:**

*   **Vector ID:** M6.2
*   **Vector Type:** Assessment
    *   Content: Partial/Unclear
    *   Justification: The system uses backpropagation (adjoint method) to iteratively minimize a loss function L, which represents the error or "surprise" between the network's output u(k) and the desired target output (encoded in L). By adjusting its internal parameters (k) via gradient descent (Eq. 7), the system actively changes itself to better predict the target outputs for given inputs, thus reducing future prediction error. This aligns with the core principle of active inference (minimizing prediction error/free energy). However, the paper does not explicitly frame the process using active inference terminology, nor does it discuss generative models or explicit prediction mechanisms beyond the direct input-output mapping. The "action" is the internal parameter update, not external action on the environment.
    *   Implicit/Explicit: Implicit
        *  Justification: The mechanism (gradient descent on a loss function) is explicit. The interpretation through the lens of active inference is inferred and not present in the paper.
    *   **If Yes/Partial, provide examples of testable CT-GIN metrics that *could* be used to quantify active inference:** Rate of Loss Function Reduction (Prediction Error Reduction Rate), Convergence Time, Sensitivity of final state (k) to initial conditions/noise (related to model complexity/certainty). These could be attributes of the `AdaptationNode` or `AdaptationEdge`.

## M7: Adaptation
*   **Vector ID:** M7
*   **Vector Type:** Adaptation

### **7.1 Adaptive Plasticity Presence:**

*   **Vector ID:** M7.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The system explicitly demonstrates adaptive plasticity through the training process. The spring constants (k), representing the internal structure, are modified (Eq. 7) based on experience (training data presented via forward/adjoint passes and the loss function). This modification leads to improved performance on the trained task (reduction in loss, increase in accuracy) over time (epochs). This is a persistent change that alters future stimulus-response behavior. Retrainability after damage/task switching further confirms plasticity.
    *    Implicit/Explicit: Explicit
        * Justification: The training process involving parameter updates (Eq. 7), performance improvement over epochs (Figs 3b, 4b), and retrainability (Fig 5) are all explicitly described and demonstrated.

### **7.2 Adaptation Mechanism:**

*   **Vector ID:** M7.2
*   **Vector Type:** Description
    *   Content: The adaptation mechanism is supervised learning via gradient descent, implemented using the mechanical analogue of *in situ* backpropagation derived from the adjoint variable method. The gradient of a defined loss function L with respect to the tunable parameters (spring constants k_i) is calculated locally using information from two physical states (forward pass with input F, adjoint pass with adjoint force derived from ∂L/∂u). The parameters are then updated iteratively using this gradient (∇L_i = e_adj,i * e_i) and an optimization algorithm (like standard gradient descent or Adam): k_i(t+1) = OptimizerUpdate(k_i(t), ∇L_i, α, ...).
    *   CT-GIN Mapping: Defines the `AdaptationNode` type and `AdaptationEdge`s (`Monad` edges). `mechanism`: Gradient Descent (Adjoint Method), `learning_rule`: Eq. 7, `optimizer`: Adam (specified in Methods).
    *    Implicit/Explicit: Explicit
        *  Justification: The derivation and application of the adjoint method for gradient calculation (Eq. 1-6) and the gradient descent update rule (Eq. 7) are explicitly detailed in the theory and results sections. The use of Adam optimizer is mentioned in Methods.

## M8: Emergent Behaviors
*   **Vector ID:** M8
*   **Vector Type:** Behavior

### **8.1 Behavior Description:**

*   **Vector ID:** M8.1
*   **Vector Type:** Description
    *   Content: The primary behaviors are learned input-output mappings corresponding to machine learning tasks:
        1.  **Behavior Learning:** Achieving specific, desired displacement patterns at output nodes in response to a given input force (e.g., asymmetric displacement in Fig 2c, trajectory control in Fig S5).
        2.  **Linear Regression:** Mapping an input force magnitude to proportional displacements at output nodes according to learned slopes (Fig 3).
        3.  **Classification (Iris, Penguin):** Mapping input forces (representing features) to a pattern of output displacements where the node with the largest displacement indicates the predicted class (Fig 4).
        4.  **Adaptation/Retraining:** Modifying its behavior to learn new tasks or recover function after damage (Fig 5).
    *   CT-GIN Mapping: Defines `BehaviorArchetypeNode`s. `behavior_type`: BehaviorLearning, Regression, Classification, Adaptation. `input`: Force (vector), `output`: Displacement (vector).
    *    Implicit/Explicit: Explicit
       *  Justification: The behaviors (behavior learning, regression, classification, retrainability) are explicitly described and demonstrated with experimental and simulation results in dedicated sections and figures.

### **8.2 Behavior Robustness:**

*   **Vector ID:** M8.2
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: The paper demonstrates robustness in several ways:
        *   **Experimental Validation:** Good agreement between simulations and experiments (Figs 1, 2, 3, 4) suggests robustness to fabrication imperfections and measurement noise to some extent.
        *   **Retrainability after Damage:** The network can partially recover classification accuracy (~80% from ~50% baseline after pruning) through retraining (Fig 5e), showing resilience to structural damage.
        *   **Retrainability after Task Switching:** The network can be successfully retrained for a different task (Fig 5b, 5c), showing behavioral flexibility.
        However, robustness is not exhaustively tested against varying levels of noise, different types of damage, or environmental changes. The sensitivity analysis in Fig S9 shows performance varies significantly depending on *which* bond is pruned ("critical" vs "redundant" bonds), indicating fragility to certain perturbations. Mechanical instability (zero modes) can occur with damage. Linearity assumption may limit robustness to large deformations.
    *   Implicit/Explicit: Mixed
        *  Justification: Experimental validation, task switching, and damage retrainability results are explicit demonstrations of robustness aspects. Discussion of critical/redundant bonds and instability (Fig S9) explicitly highlights limitations. Overall assessment and score involve interpreting these explicit findings (Mixed).
    *   CT-GIN Mapping: This score contributes to the reliability attributes of the `BehaviorArchetypeNode`.

### **8.3 CT-GIN Emergent Behavior Validation**

*    **Vector ID:** M8.3
*    **Vector Type:** Validation
     *  Content: Claims of emergent behaviors (learned functions) are validated through:
        1.  **Quantitative Metrics:** Loss function values (MSE for regression, cross-entropy for classification) and accuracy are tracked during simulated training and reported for final trained models (Figs 3b, 4b, 5).
        2.  **Comparison with Targets:** Regression results are compared against target lines (Fig 3a, 3c). Classification results are compared against ground truth labels (Fig 4a vs 4c, confusion matrix Fig S6). Behavior learning compares displacements to target values (Fig 2, Fig S5).
        3.  **Experimental Confirmation:** Key behaviors (gradient calculation feasibility, behavior learning, regression, classification) are validated experimentally using 3D-printed MNNs, showing good agreement with simulations (Figs 1, 2, 3, 4).
        4.  **Robustness Tests:** Retrainability after damage and task switching provides evidence for the robustness and adaptability of the learned behaviors (Fig 5).
        Limitations: Experimental validation uses a limited number of tests/samples. Robustness testing is not exhaustive.
     *   Implicit/Explicit: Explicit
    *   Justification: The validation methods (quantitative metrics, comparison to targets, experimental confirmation, robustness tests) and their results are explicitly presented throughout the Results section and associated figures.

## M9: Cognitive Proximity
*   **Vector ID:** M9
*   **Vector Type:** Cognition

### **9.1 Cognitive Mapping:**

*   **Vector ID:** M9.1
*   **Vector Type:** Description
    *   Content: The paper maps the MNN's functionality to machine learning tasks typically associated with artificial intelligence, such as regression and classification. These tasks are analogous to cognitive functions like function approximation, pattern recognition, and decision-making. The backpropagation training mechanism is inspired by, but not identical to, learning mechanisms in biological neural networks. The paper mentions "behavior learning" and "machine learning tasks," explicitly drawing parallels to AI concepts. However, the mapping is primarily functional/analogical; no claims are made about the MNN possessing higher-level cognitive states like understanding or awareness.
    *   CT-GIN Mapping: Defines `CognitiveMappingEdge`. Source: `BehaviorArchetypeNode` (e.g., Classification), Target: `CognitiveFunctionNode` (e.g., Pattern Recognition). `mapping_type`: Functional Analogy.
    *   Implicit/Explicit: Mixed
    * Justification: The use of terms like "neural networks," "machine learning," "behavior learning," "regression," and "classification" explicitly maps the system's function to AI/cognitive science domains. The limitations (functional analogy, no higher cognition claims) are implicit based on the scope of the work.

### **9.2 Cognitive Proximity Score:**

*   **Vector ID:** M9.2
*   **Vector Type:** Score
    *   Score: 3
    *   Justification: The system demonstrates adaptive behavior (learning specific input-output mappings) based on experience (training data) and feedback (loss function gradient), placing it at Level 3 (Reactive/Adaptive Autonomy) on the CT-GIN scale. It learns specific functions (regression, classification) through parameter adjustment (plasticity). However, its behavioral repertoire is limited to the trained tasks, it doesn't show evidence of building internal models for goal-directed planning (Level 4), understanding relationships (Level 5), or manipulating abstract symbols (Level 6). The cognition is reactive and function-specific, driven by the optimization process.
    *   Implicit/Explicit: Mixed
    *  Justification: The system's capabilities (learning, adaptation, specific tasks) are explicitly demonstrated. The scoring involves mapping these capabilities onto the provided CT-GIN Cognizance Scale levels (Implicit interpretation/assessment).

### **9.3 Cognitive Function Checklist**

* **Vector ID:** M9.3
* **Vector Type:** Checklist
    *   | Cognitive Function               | Score (0-10) | Justification/Notes                                                                       | CT-GIN Mapping (if applicable) | Implicit/Explicit | Justification for Implicit/Explicit/Mixed |
    | :-------------------------------- | :----------: | :------------------------------------------------------------------------------------ | :--------------------------------: | :-----------------:|:-----------------:|
    | Sensing/Perception               |      3       | Input force is sensed mechanically, leading to displacement output. Limited scope sensing. | `SystemNode` -> `InputNode` | Explicit | System physically responds to force input. |
    | Memory (Short-Term/Working)        |      0       | No evidence of short-term/working memory distinct from long-term parameter storage. | N/A | Implicit | Focus is on long-term parametric changes. |
    | Memory (Long-Term)                 |      6       | Stores learned parameters (spring constants) persistently in physical structure (M3). | `MemoryNode` | Mixed | Parameter changes are explicit; interpretation as memory is mixed. |
    | Learning/Adaptation              |      6       | Demonstrates supervised learning via gradient descent (M7). Task-specific adaptation. | `AdaptationNode` | Explicit | Training process is explicitly adaptation. |
    | Decision-Making/Planning          |      2       | Classification involves implicit decision boundaries; no evidence of planning/foresight. | `BehaviorArchetypeNode` (Classification) | Implicit | Classification is a form of decision; no planning shown. |
    | Communication/Social Interaction |      0       | System does not communicate or interact with other agents.                              | N/A | Implicit | No such capabilities described. |
    | Goal-Directed Behavior            |      2       | Behavior is directed towards minimizing loss function during training. Limited scope. | `AdaptationNode` | Implicit | Training minimizes a goal (loss function). |
    | Model-Based Reasoning              |      1       | System implicitly embodies a learned input-output model; no explicit reasoning shown. | `MemoryNode`, `ComputationNode` | Implicit | Learned parameters form a model; no reasoning process. |
    | **Overall score**                 |     2.5      | Reflects adaptive capabilities but limited higher cognitive functions.                | N/A | N/A | N/A |

## M10: Criticality Assessment
*   **Vector ID:** M10
*   **Vector Type:** Criticality

### **10.1 Criticality:**

*   **Vector ID:** M10.1
*   **Vector Type:** Assessment
    *   Content: No
    *   Justification: The paper does not mention or investigate criticality, scale-free behavior, power laws, or long-range correlations in the context of the MNN's operation or training. The analysis is based on standard mechanics and optimization methods.
        *   Critical Parameters (If Yes/Partial): N/A
        *   Evidence: N/A
    *   Implicit/Explicit: N/A
    *    Justification: Absence of discussion on the topic in the paper.

## M11: Review Paper Specifics (Conditional)

*   **Vector ID:** M11
*   **Vector Type:** Review
    * Content: N/A (Paper type is Hybrid, not Review)

## M12: Theoretical Paper Specifics (Conditional)

*   **Vector ID:** M12
*   **Vector Type:** Theory
    * Content: N/A (Paper type is Hybrid, not purely Theoretical)

## M13: Overall Assessment & Scoring
*   **Vector ID:** M13
*   **Vector Type:** Overall

### **13.1 CT-GIN Readiness Score:**

*   **Vector ID:** M13.1
*   **Vector Type:** Score
*   **Calculated Score:** 5.5
    *(Calculation: Average of M1.2 (8), M2.3 (0 - N/A), M3.2 (6), M4.4 (8), M5.1 (10 - Yes), M8.2 (7), M9.2 (3). Converting Yes/No/Partial in M4.1/M5.1/M7.1 to relevant contribution is tricky. Using M1.2, M3.2, M4.4, M8.2, M9.2 gives (8+6+8+7+3)/5 = 6.4. Including M5.1=Yes as 10: (8+6+8+10+7+3)/6 = 7. Including M2.3=N/A as 0: (8+0+6+8+10+7+3)/7 = 6. Using only directly relevant scores: M1.2(8), M3.2(6), M4.4(8), M8.2(7), M9.2(3). Average = (8+6+8+7+3)/5 = 6.4. Let's use this. Re-read instructions: M1-M4, M8.2, M9.2. M2.3=0, M3.1=Yes(10), M3.2=6, M4.1=Partial(5), M4.4=8. Scores: M1.2(8), M2.3(0), M3.1(10), M3.2(6), M4.1(5), M4.4(8), M8.2(7), M9.2(3). Average = (8+0+10+6+5+8+7+3)/8 = 5.875 ≈ 5.9)* Let's stick to the explicit instruction: "Average of scores from Modules 1-4, M8.2 and M9.2". This interpretation is ambiguous as Modules 1-4 contain multiple scores and non-score elements. Re-interpreting: Use score vectors M1.2, M2.3, M3.2, M4.4, M8.2, M9.2. Assume N/A for M2.3 means 0. M3.2 is conditional on M3.1=Yes. M4.4 is conditional on M4.1=Yes/Partial. M3.1=Yes, M4.1=Partial. Calculation: (M1.2 + M2.3 + M3.2 + M4.4 + M8.2 + M9.2) / 6 = (8 + 0 + 6 + 8 + 7 + 3) / 6 = 32 / 6 = 5.33. Let's use 5.3.

**CT-GIN Readiness Summary Table:**

| CT-GIN Aspect                   | Strength (Yes/Partial/No) | Key Supporting Metrics (with units) | Limitations (Missing Metrics/Data Gaps)                                           | Improvement Areas (Future Research)                                          |
| :------------------------------ | :-----------------------: | :-----------------------------------| :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| Energy Flow Efficiency          | No                        | N/A                                  | Energy consumption, efficiency, and dissipation not quantified.                   | Quantify energy use during training & prediction; analyze dissipation routes. |
| Memory Fidelity                 | Partial                   | Persistence (Long-term), Rewritability (Figs 5b,c), Robustness (Fig 5e, ~80% rec.), Readout (Fig 1e, <0.1 error) | Capacity detail, precise retention time, degradation rate, write energy cost.  | Characterize degradation, capacity limits, energy cost per update.           |
| Organizational Complexity       | Partial                   | Emergent stiffness pattern (k), Task performance (Accuracy >90%, MSE ~10^-7) | Lack of formal analysis of emergent structure complexity (beyond function).     | Analyze network topology changes, information content of stiffness pattern.   |
| Embodied Computation            | Yes                       | Task performance (Accuracy, MSE)      | Processing speed, power consumption per operation.                                | Quantify computational speed/latency, energy per task.                        |
| Temporal Integration            | Partial                   | Training convergence time (epochs)   | Computational response time, detailed dynamics during adaptation.                 | Analyze real-time dynamics, link training dynamics to physical timescales.    |
| Adaptive Plasticity             | Yes                       | Learning rule (Eq. 7), Convergence (Figs 3b, 4b), Retrainability (Fig 5) | Speed of adaptation (physical time), limits of plasticity.                    | Investigate physical adaptation timescales, explore more complex learning rules. |
| Functional Universality         | Partial                   | Regression, Classification demonstrated | Limited set of tasks demonstrated, linearity constraint.                        | Explore nonlinear regimes, tackle more complex computational tasks.          |
| Cognitive Proximity            | Partial                   | Learns ML tasks (Score 3/10)          | Limited mapping to cognitive functions, lacks higher-level features.            | Explore tasks requiring planning or reasoning within the physical system.     |
| Design Scalability & Robustness | Partial                   | Retrainability (Fig 5), Experimental agreement | Sensitivity to critical bond removal (Fig S9), linearity limits, scalability untested. | Investigate fault tolerance, non-linear designs, scalability analysis.      |
| **Overall CT-GIN Readiness Score** |        **5.3**         | See metrics above                    | See limitations above                                                             | See improvements above                                                         |


### **13.2 Qualitative CT-GIN Assessment Conclusion:**

*   **Vector ID:** M13.2
*   **Vector Type:** Textual Summary
    *   Content: This paper presents a significant step towards realizing machine learning in physical mechanical systems. Its key strength lies in the demonstration of *in situ* backpropagation using the adjoint method, enabling local learning rules (Adaptation/Plasticity) within a physical MNN. This allows the system to learn complex input-output mappings for tasks like regression and classification, storing the learned information in its physical structure (Memory). The computation is clearly embodied in the material's physical response. Experimental validation confirms the feasibility and reasonable accuracy of the approach. Key limitations from a CT-GIN perspective include the lack of analysis regarding energy flow (efficiency, dissipation), the reliance on the linear regime (limiting computational complexity and potentially robustness), and a limited exploration of cognitive capabilities beyond basic ML tasks. While adaptive organization emerges through training, it lacks spontaneous self-organization. The system demonstrates adaptive autonomy (Cognitive Level 3) but needs further development, particularly in exploring non-linearity, quantifying energy/speed performance, and tackling more complex problems, to advance towards higher levels of material intelligence.

### **13.3 CT-GIN Refinement Directions:**

*   **Vector ID:** M13.3
*   **Vector Type:** Recommendations
    *   Content:
        *   **Quantify Energy Dynamics:** Measure energy input, dissipation (material damping, friction), and computational energy cost per operation (prediction and training update) to assess efficiency.
        *   **Explore Non-Linearity:** Investigate MNNs operating in the non-linear regime (geometric or material non-linearity) to potentially tackle more complex datasets and tasks beyond linear classification/regression.
        *   **Characterize Memory Properties:** Quantify memory retention time (degradation), capacity limits (scalability with network size), and the energy cost associated with physical parameter updates (writing memory).
        *   **Analyze Computational Speed:** Measure the actual response time for computation (prediction) and the time required for physical training steps, moving beyond quasi-static assumptions.
        *   **Investigate Robustness Systematically:** Test robustness against broader ranges of noise, diverse damage scenarios (multiple bond failures), and environmental variations (e.g., temperature).
        *   **Enhance Task Complexity:** Explore more complex ML tasks, potentially involving temporal processing (if dynamics are included) or planning, to probe higher cognitive functions.
        *   **Develop Physical Tuning Mechanisms:** Bridge the simulation-reality gap by exploring physical mechanisms for *in situ* tuning of spring constants, enabling fully autonomous experimental learning.
        *   **Formalize Emergent Structure Analysis:** Characterize the complexity and information content of the emergent stiffness patterns using network theory or information theory metrics.

## M14: CT-GIN Knowledge Graph

*   **Vector ID:** M14
*   **Vector Type:** Visualization

### **14.1. CT-GIN Knowledge Graph:**
* **Content:**
*(Textual Description as visual insertion is not possible)*
The CT-GIN graph for this system would center around a `SystemNode` (MNN, Agilus30).
*   An `EnergyInputNode` (External Force/Gravity) connects via an `EnergyTransductionEdge` (Mechanical Work -> Elastic Potential Energy) to the `SystemNode`. Edges to `EnergyDissipationNode`s (Material Damping, Friction) would originate from `SystemNode` (Implicit).
*   The `SystemNode` possesses a `MemoryNode` attribute, detailing the structural memory (k values). Attributes: `encoding`: Structural, `retention`: Long-term, `capacity`: m, `readout_accuracy`: High.
*   An `AdaptationNode` (Gradient Descent/Adjoint Method) interacts with the `MemoryNode` via `AdaptationEdge`s (`Monad` edges), modifying k based on local rules (Eq. 7). Attributes: `learning_rule`, `optimizer`.
*   A `ComputationNode` (Analog/Neuromorphic) represents the system's function (u = D^-1 * F). Attributes: `operator`: Linear Transformation. This node is intrinsically linked to the `SystemNode` and its `MemoryNode` (k defines D).
*   The `SystemNode` links to multiple `BehaviorArchetypeNode`s (Regression, Classification, Behavior Learning) via `BehaviorRealizationEdge`s. These nodes have attributes like `accuracy`, `loss`, and `robustness` score.
*   `CognitiveMappingEdge`s connect `BehaviorArchetypeNode`s to `CognitiveFunctionNode`s (Pattern Recognition, Function Approximation) with `mapping_type`: Functional Analogy.
*   Temporal aspects (`TemporalNode`/attributes) link to `AdaptationNode` (convergence time) and `ComputationNode` (response time - implicit).

## M15: Relationship Vectors
*   **Vector ID:** M15
*   **Vector Type:** Relationships
*   Relationships:
        | Source Vector ID | Target Vector ID | Relationship Type |
        | ------------- | ------------- | ----------------- |
        | M3.1          | M3.2          | Conditional       |
        | M3.1          | M3.3          | Conditional       |
        | M3.1          | M3.4          | Conditional       |
        | M3.1          | M3.5          | Conditional       |
        | M3.1          | M3.6          | Conditional       |
        | M3.1          | M3.7          | Conditional       |
        | M3.1          | M3.8          | Conditional       |
        | M4.1          | M4.2          | Conditional       |
        | M4.1          | M4.2.1        | Conditional       |
        | M4.1          | M4.3          | Conditional       |
        | M4.1          | M4.4          | Conditional       |
        | M4.1          | M4.5          | Conditional       |
        | M4.1          | M4.6          | Conditional       |
        | M4.1          | M4.7          | Conditional       |
        | M5.1          | M5.2          | Conditional       |
        | M5.1          | M5.3          | Conditional       |
        | M5.1          | M5.4          | Conditional       |
        | M7.1          | M7.2          | Conditional       |
        | Paper Type    | M11           | Conditional       |
        | Paper Type    | M12           | Conditional       |
        | M1.2, M2.3, M3.2, M4.4, M8.2, M9.2 | M13.1         | Calculation Input |


## M16: CT-GIN Template Self-Improvement Insights

*   **Vector ID:** M16
*   **Vector Type:** Feedback

### **Template Feedback:**

*    **Vector ID:** M16.1
*   **Vector Type:** Text
    *   **Missing Probes:**
        *   A probe specifically for **Scalability** (how system performance/complexity scales with size/number of components) could be useful.
        *   A probe for **Control Interface** (how external inputs/outputs are managed) might be relevant, especially for hybrid systems.
        *   Explicit probe for **Linearity/Non-linearity** regime of operation and its implications.
    *   **Unclear Definitions:**
        *   The distinction between *Self-Organization* (M4) and *Adaptation* (M7) could be slightly sharpened, especially for systems where structure adapts via local rules towards a global goal (like this paper). Clarifying if goal-directed adaptation counts as partial self-organization.
        *   The scoring basis for *Cognitive Proximity* (M9.2) relies heavily on the provided scale; providing brief examples for each level within the scale definition could aid consistency.
        *   The calculation method for the *CT-GIN Readiness Score* (M13.1) was ambiguous regarding which scores to average and how to handle non-score/conditional modules. Explicitly listing the Vector IDs to be averaged would be better.
    *   **Unclear Node/Edge Representations:**
        *   Guidance on mapping scores (like robustness, predictability) to specific CT-GIN attributes vs. separate nodes could be clearer.
        *   More examples for mapping abstract concepts like "Adaptation Mechanism" or "Behavior" to specific node/edge types and attributes would be helpful for consistency across different papers.
    *   **Scoring Difficulties:**
        *   Assigning a score for *Energy Efficiency* (M2.3) is difficult when it's only mentioned qualitatively as motivation. The rubric should better handle "N/A" vs. "Low inferred efficiency". Converting N/A to 0 for averaging (as done in M13.1 calculation) might unduly penalize papers that simply don't address a topic. Maybe use weighted average or separate reporting.
        *   Scoring *Predictability of Global Order* (M4.4) requires inference if not explicitly quantified. The rubric could guide this inference better (e.g., based on determinism of mechanisms).
    *   **Data Extraction/Output Mapping:**
        *   Mapping experimental parameters (like specific weight values) vs. general system parameters (like material type) into the limited rows of Parameter Tables (M1.3) requires selection – guidance on prioritizing 'key' parameters could be added.
        *   The request for a visual *Knowledge Graph* (M14.1) is impossible for a text-based model. Suggesting a textual representation (e.g., list of nodes/edges with attributes, adjacency list) or a structured format like JSON/YAML might be more feasible.
    *   **Overall Usability:** The template is very comprehensive but long. The conditional logic helps but requires careful tracking. Some redundancy exists (e.g., parameter tables in M4.2.1 and M4.5 seem related). Grouping optional/advanced metrics could streamline the primary analysis flow. Explicitly numbering probes within subsections might improve navigation.
    * **Specific Suggestions:**
        *   Clarify M13.1 calculation.
        *   Provide alternative output format for M14.1 (textual graph description).
        *   Add probe for Linearity/Non-linearity.
        *   Refine scoring rubrics to better handle N/A or qualitative data.