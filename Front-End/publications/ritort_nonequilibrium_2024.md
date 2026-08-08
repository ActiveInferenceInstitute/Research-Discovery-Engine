# Nonequilibrium work relations for energy and information

__Paper Type:__ Review

## M1: System Overview & Implementation
*   **Vector ID:** M1
*   **Vector Type:** Overview

### **1.1 System Description**

*   **Vector ID:** M1.1
*   **Vector Type:** Description
    *   Content: The paper reviews fundamental concepts in the nonequilibrium thermodynamics of small systems, with an emphasis on single-molecule biophysics experiments (e.g., pulling DNA/RNA/proteins using optical tweezers, studying molecular folding/unfolding) and their connection to energy and information processing. It covers key theoretical frameworks like fluctuation theorems (FTs), Jarzynski equality, Crooks FT, and relates them to experimental measurements of work, heat, and entropy production in systems like optically trapped beads and biomolecules. The paper also discusses the thermodynamics of information, referencing Maxwell's demon, Szilard's engine, Landauer's principle, and feedback control in nonequilibrium systems. The purpose is to provide an overview of the theoretical and experimental advances in understanding energy and information at the nanoscale, particularly in biological contexts, and their implications for the foundations of statistical mechanics. The "system" described is the collection of concepts, theories, and experimental setups relevant to nonequilibrium physics of small systems.
    *   CT-GIN Mapping: `ReviewConceptNode` attributes: `domain`="Nonequilibrium Thermodynamics", `focus`="Small Systems", `keyConcepts`=["Fluctuation Theorems", "Work Relations", "Information Thermodynamics", "Single-Molecule Biophysics"], `purpose`="Review". `ExperimentNode` attributes linked via `IllustratesConceptEdge` to `ReviewConceptNode`.
    *   Implicit/Explicit: Explicit
        *  Justification: The abstract and introduction explicitly state the scope, content, and purpose of the review paper.

### **1.2 Implementation Clarity**

*   **Vector ID:** M1.2
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The review clearly explains the core concepts (e.g., fluctuation theorems, work relations, Maxwell's demon), provides relevant equations, and describes the experimental setups (e.g., optical tweezers for DNA pulling/unzipping, bead in trap) used to test these concepts. Figures aid understanding. While detailed experimental protocols are not the focus of a review, the descriptions of the principles and typical results are clear. Some derivations are left as exercises/problems, assuming prerequisite knowledge.
    *   Implicit/Explicit: Explicit
        * Justification: Clarity is judged based on the explicit text, figures, and equations presented in the paper.

### **1.3 Key Parameters**

*   **Vector ID:** M1.3
*   **Vector Type:** ParameterTable
    *   Table:
        | Parameter Name | Value | Units | Source (Fig/Table/Section) | Implicit/Explicit | Data Reliability (High/Medium/Low) | Derivation Method (if Implicit) |
        | :------------- | :---: | :---: | :-----------------------: | :-----------------: | :-----------------------------: | :-------------------------------: |
        | Boltzmann Constant (k<sub>B</sub>) | N/A (Implicitly used) | J/K | Throughout | Implicit | High | Standard physical constant |
        | Temperature (T) | 298 (Standard condition example) | K | Section "SMALL SYSTEMS...", Fig 2 Caption | Explicit | High | Standard experimental condition |
        | Persistence Length (P) - dsDNA | 50 | nm | Section "SMALL SYSTEMS..." | Explicit | High | Typical experimental value quoted |
        | Persistence Length (P) - ssDNA | 0.75 | nm | Section "SMALL SYSTEMS..." | Explicit | High | Typical experimental value quoted |
        | Optical Trap Stiffness (k<sub>b</sub>) | N/A (Mentioned conceptually) | N/m | Eq (11), Exercise 3 | Implicit | N/A | Conceptual parameter |

    *   **Note:** Parameters listed are key physical constants or representative values for the systems discussed (DNA, trapped beads) to illustrate the concepts.

## M2: Energy Flow
*   **Vector ID:** M2
*   **Vector Type:** Energy

### **2.1 Energy Input**

*   **Vector ID:** M2.1
*   **Vector Type:** Input
    *   Content: Energy input mechanisms discussed include: mechanical work done by pulling forces (e.g., via optical tweezers moving relative to a pipette or bead), work done by moving an optical trap potential through a viscous medium, thermal energy from the environment (manifesting as Brownian motion and fluctuations). In the context of Maxwell's Demon/Szilard Engine, the energy input is heat from a thermal bath.
    *   Value: N/A (Specific values depend on the experiment, e.g., pulling force * distance, trap velocity * force).
    *   Units: Joules (J) or pN*nm. Power units (Watts or pN*nm/s) are relevant for rates.
    *   CT-GIN Mapping: `EnergyInputNode` attributes: `source`=["MechanicalPulling", "MovingPotential", "ThermalBath"], `type`=["Work", "Heat"]. Linked to `ExperimentNode`(e.g., DNA Pulling, Bead Dragging) or `ConceptNode`(e.g., Szilard Engine).
    *   Implicit/Explicit: Explicit
        *  Justification: The text explicitly describes pulling forces (Fig 2, 3), moving traps (Eq 11, Fig 4), and heat exchange (Introduction, Maxwell's Demon section).

### **2.2 Energy Transduction**

*   **Vector ID:** M2.2
*   **Vector Type:** Transduction
    *   Content: Energy transduction mechanisms discussed include:
        1.  Mechanical Work -> Potential Energy (stored in stretched/unfolded molecule, e.g., DNA WLC elasticity).
        2.  Mechanical Work -> Heat (dissipation due to friction/viscosity when pulling molecules or dragging beads through fluid, σ = (1/T)d¯Q/dt ≥ 0).
        3.  Heat -> Mechanical Work (in the idealized Szilard engine, where thermal energy drives particle expansion against a piston).
        4.  Chemical Energy (e.g., ATP hydrolysis, mentioned for molecular motors) -> Mechanical Work (briefly mentioned in Outlook).
        5.  Light Energy (laser trap) -> Potential Energy (trapping bead) -> Mechanical Work (exerting force).
    *   CT-GIN Mapping: `EnergyTransductionEdge` attributes: `mechanism`=["ElasticDeformation", "FrictionalDissipation", "IsothermalExpansion", "ChemoMechanical", "OptoMechanicalPotential"], `from_node`=[`EnergyInputNode`, `InternalEnergyNode`], `to_node`=[`InternalEnergyNode`, `EnergyDissipationNode`, `EnergyOutputNode` (Work)].
    *   Implicit/Explicit: Explicit
        *  Justification: The paper explicitly discusses work done on molecules (Eq 1, 2, 17), dissipation (Introduction, Eq 8-10), heat conversion in Szilard engine (Fig 6), trapping potential (Eq 11), and briefly mentions molecular motors (Outlook).

### **2.3 Energy Efficiency**

*   **Vector ID:** M2.3
*   **Vector Type:** Score
    *   Score: N/A (Context Dependent)
    *   Justification/Metrics: Efficiency is discussed conceptually, particularly for molecular motors and information-to-energy conversion. Molecular motors are mentioned as having "astonishing large efficiencies" near 100% (Section "Fluctuation Theorems", Outlook). The Szilard engine ideally converts heat to work with efficiency related to information (k<sub>B</sub>T log2 per bit). The efficiency of experimental processes like pulling is related to dissipation (W<sub>d</sub> = W - ΔG); faster pulling is less efficient (more dissipated work). No overall efficiency score can be assigned to the review's scope, as it depends heavily on the specific process (ideal engine vs. real experiment). Qualitative assessment for *discussed* ideal systems: High (Szilard Engine, ideal motors). Qualitative assessment for *real* experimental pulling: Low to Medium (efficiency decreases with pulling speed).
    *   CT-GIN Mapping: Attribute `efficiency` (Quantitative or Qualitative) of relevant `EnergyTransductionEdge`s or `BehaviorArchetypeNode` (e.g., Szilard Engine).
    *   Implicit/Explicit: Mixed
      *  Justification: High efficiency of motors is explicitly stated. Efficiency related to dissipation (Wd) is explicitly defined via FTs. Szilard engine efficiency is implicitly k<sub>B</sub>T log2. Efficiency of pulling experiments is implicitly low due to hysteresis shown (Fig 5).

### **2.4 Energy Dissipation**

*   **Vector ID:** M2.4
*   **Vector Type:** Dissipation
    *   Content: Dissipation is a central theme, defined as irreversible transformation of work into heat, leading to positive entropy production (σ ≥ 0). Mechanisms explicitly mentioned:
        1.  Friction/Viscous Drag: Heat generated when pulling molecules or dragging beads through a fluid (Eq. 11 describes friction γ). Dissipated work W<sub>d</sub> = W - ΔG in transient processes (Eq. 9 context). Entropy production S<sub>t</sub> in dragged bead experiment (Fig 4, Eq 13).
        2.  Information Erasure: Landauer's principle implies heat dissipation (k<sub>B</sub>T log2 per bit erased) to restore the second law in Maxwell's Demon scenarios.
    Quantification: Dissipated work W<sub>d</sub> is quantifiable from work measurements and free energy differences using FTs (Eq. 9). Entropy production S<sub>t</sub> measured in bead experiment (Fig 4). Average entropy production rate σ = <S<sub>t</sub>>/t (Eq 10). Landauer limit quantifies minimum dissipation for erasure. Values are process-dependent.
    *   CT-GIN Mapping: `EnergyDissipationNode` attribute: `mechanism`=["Friction", "Viscosity", "InformationErasure"]. `EnergyDissipationEdge` linking `EnergyInputNode` or `InternalEnergyNode` to `EnergyDissipationNode`, attribute `rate` (e.g., σ) or `amount` (e.g., W<sub>d</sub>).
    *    Implicit/Explicit: Explicit
        *  Justification: Entropy production (σ), dissipated work (W<sub>d</sub>), friction (γ), and Landauer's limit are explicitly discussed and defined. Mechanisms like friction are clearly identified.

## M3: Memory
*   **Vector ID:** M3
*   **Vector Type:** Memory

### **3.1 Memory Presence:**

*   **Vector ID:** M3.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The paper discusses information storage in the context of Maxwell's demon/Szilard engine (knowing the particle's position) and the information content of measurement sequences (CMD). It also mentions non-Markovian systems with memory effects conceptually [50]. However, it does not describe a specific *material system* designed or analyzed primarily for its memory capabilities (i.e., writing, storing, and reading arbitrary information encoded in the material state itself beyond its inherent physical state like folded/unfolded). The state of the system (e.g., folded vs. unfolded hairpin) influences future dynamics (via energy landscape) but isn't presented as a generic, controllable memory element in the material intelligence sense.
    *    Implicit/Explicit: Implicit
        * Justification: Based on the absence of description of a system designed with controllable write/read memory functions relevant to material intelligence. Information concepts are discussed abstractly or tied to specific experimental state observation.

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
    | Information Erasure (Landauer Limit) | >= k<sub>B</sub>T log2 | N/A | J/bit | N/A | Section "ENERGY, INFORMATION..." | Explicit | Theoretical lower bound |
*   Implicit/Explicit: Explicit
    *   Justification: The Landauer limit for information erasure cost is explicitly mentioned. No other memory operation energy costs are discussed for a specific material system.

### **3.8 Memory Fidelity & Robustness Metrics (Optional - if applicable)**
* **Vector ID:** M3.8
* **Vector Type:** Table
*   Table:
    | Metric ID | Description | Value | Units | CT-GIN Mapping | Data Source | Implicit/Explicit | Justification |
    | :-------- | :---------- | :----: | :---: | :-------------: | :----------: |:-----------------:| :-----------------:|
    | N/A      | N/A          | N/A    | N/A   | N/A             | N/A          | N/A              | N/A |
*   Implicit/Explicit: N/A
*   Justification: N/A
---

## M4: Self-Organization and Emergent Order
*   **Vector ID:** M4
*   **Vector Type:** Self-Organization

### **4.1 Self-Organization Presence:**

*   **Vector ID:** M4.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The paper focuses on the behavior of single molecules or particles driven by external fields or forces, or subject to thermal fluctuations. While phenomena like molecular folding involve transitions between states based on interactions, the paper does not describe systems where complex global order or patterns spontaneously emerge from purely local interactions without external templating or driving forces defining the structure, as typically understood in self-organization for material intelligence. The thermodynamic principles (like FTs) are themselves emergent statistical laws, but the *systems* described aren't primarily examples of material self-organization into complex structures.
    *   Implicit/Explicit: Implicit
        *  Justification: Assessed based on the absence of descriptions of systems undergoing spontaneous pattern formation or structural organization driven solely by local rules in the context relevant to material intelligence.

**(Conditional: M4.1 is "No", skip to Module 5.)**

### **4.2 Local Interaction Rules:**

*   **Vector ID:** M4.2
*   **Vector Type:** Rules
    *   Content: N/A
    *   CT-GIN Mapping: N/A
    * **Implicit/Explicit**: N/A
        *  Justification: N/A

### **4.2.1 Local Interaction Parameters:**

* **Vector ID:** M4.2.1
* **Vector Type:** Table
*   Table:
    | Rule ID | Description | Parameter Name | Parameter Value Range | Units | Data Source | Implicit/Explicit | Justification |
    | :------ | :---------- | :------------- | :---------- | :---: | :----------: | :----------------: | :------------: |
    | N/A     | N/A         | N/A            | N/A         | N/A   | N/A          | N/A                | N/A            |
### **4.3 Global Order:**

*   **Vector ID:** M4.3
*   **Vector Type:** Order
    *   Content: N/A
    *   CT-GIN Mapping: N/A
    * **Implicit/Explicit**: N/A
        *  Justification: N/A

### **4.4 Predictability of Global Order:**

*   **Vector ID:** M4.4
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification: N/A
    * **Implicit/Explicit**: N/A
    *  Justification: N/A
    *   CT-GIN Mapping: N/A

### **4.5. Local Interaction Rules (for Self-Organization)**
* **Vector ID:** M4.5
* **Vector Type:** Table
*   Table:
| Rule ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Source |
| :------ | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :-----: |
| N/A     | N/A         | N/A       | N/A         | N/A   | N/A               | N/A            | N/A     |

### **4.6. Globally Emergent Order and Order Parameters**
* **Vector ID:** M4.6
* **Vector Type:** Table
*   Table:
| Property ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Protocol | Source |
| :---------- | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :------: | :-----: |
| N/A         | N/A         | N/A       | N/A         | N/A   | N/A               | N/A            | N/A      | N/A     |

### **4.7 Yoneda Embedding and Local-to-Global Mapping Fidelity**

*   **Vector ID:** M4.7
*   **Vector Type:** Table
*   Table:
    | Link Type | Description | Predictability | Yoneda Score | Metrics | Implicit/Explicit | Justification | Source |
    | :-------- | :---------- | :------------- | :----------- | :------ | :----------------: | :------------: | :-----: |
    | N/A       | N/A         | N/A            | N/A          | N/A     | N/A                | N/A            | N/A     |
    *   **Yoneda Embedding Fulfillment Score [0-10]:** N/A
    *   **Metrics:** N/A
    *   **Justification:** N/A

## M5: Computation
*   **Vector ID:** M5
*   **Vector Type:** Computation

### **5.1 Embodied Computation Presence:**

*   **Vector ID:** M5.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The paper discusses the *thermodynamics of computation* and information (Maxwell's demon, Landauer's principle, Szilard engine). These are conceptual frameworks analyzing the physical cost of information processing. However, the paper does not describe a physical material system *designed to perform computations* using its intrinsic properties (embodied computation). The systems discussed (molecules, beads) are used to *test* physical theories, including those related to information, not function as computational devices themselves.
    *    Implicit/Explicit: Implicit
        *  Justification: Assessed based on the absence of a description of a material system performing computations intrinsically. The discussion revolves around the physics *of* computation, not computation *by* the material described.

**(Conditional: If M5.1 is "No", skip to Module 6.)**

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
| N/A     | N/A         | N/A              | N/A              | N/A              | N/A       | N/A          | N/A               | N/A                 |

## M6: Temporal Dynamics
*   **Vector ID:** M6
*   **Vector Type:** Temporal

### **6.1 Timescales:**

*   **Vector ID:** M6.1
*   **Vector Type:** ParameterTable
    *   Table:
        | Timescale Description | Value | Units | Source | Implicit/Explicit | Justification |
        | :-------------------- | :---: | :---: | :----: | :----------------: | :------------: |
        | Molecular Collision Timescale | Implicitly very short (<ps) | s | Introduction | Implicit | Timescale below which motion appears reversible. |
        | Bead Relaxation Time (τ<sub>r</sub> = γ/k<sub>b</sub>) | Variable (e.g., ms range mentioned for Fig 4) | s | Eq (12), Exercise 3, Fig 4 discussion | Explicit | Parameter defining response time of bead in trap. |
        | Experimental Time (t) | Variable (e.g., 10-60 ms in Fig 4; seconds or longer for pulling) | s | Fluctuation Theorems section, Fig 4, Fig 5 | Explicit | Duration over which processes are observed/driven. |
        | Pulling Rate (r = ḟ) | e.g., 20; 1, 5, 15 | pN/s | Exercise 2d; Fig 5 Caption | Explicit | Rate at which force is ramped in experiments. |
        | Measurement Interval (τ) in CMD | Variable | s | Section "ENERGY, INFORMATION...", Fig 7, Fig 8 | Explicit | Time between measurements in continuous feedback protocols. |
    *   **Note:** Specific values are often context-dependent or illustrative.

### **6.2 Active Inference:**

*   **Vector ID:** M6.2
*   **Vector Type:** Assessment
    *   Content: No
    *   Justification: The paper discusses feedback control in the context of the Szilard engine and generalized fluctuation theorems with feedback (DTF, CTF). This involves changing a protocol based on measurement outcomes (information). However, it does not describe systems exhibiting active inference, which requires an internal predictive model of the environment and actions taken to minimize prediction error based on that model. The feedback described is reactive to measurements, not predictive based on an internal world model.
    *   Implicit/Explicit: Implicit
        *  Justification: Assessed based on the definition of active inference and the content of the paper, which describes reactive feedback, not predictive model-based control.
    *   **If Yes/Partial, provide examples of testable CT-GIN metrics that *could* be used to quantify active inference:** N/A

## M7: Adaptation
*   **Vector ID:** M7
*   **Vector Type:** Adaptation

### **7.1 Adaptive Plasticity Presence:**

*   **Vector ID:** M7.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The paper mentions biological evolution shaping molecular machines (Outlook) and briefly speculates about molecular systems evolving to take advantage of fluctuations (Section "a.4 Fluctuation theorems"). However, it does not describe any *material system* (experimental or theoretical) that exhibits adaptive plasticity, i.e., changing its structure or behavior over time based on experience to improve performance in the sense required for material intelligence. The systems studied (DNA, beads) have fixed properties during the experiments described.
    *    Implicit/Explicit: Implicit
        * Justification: Assessed based on the absence of descriptions of systems undergoing adaptation or learning during the experiments or theoretical treatments presented.

**(Conditional: If M7.1 is "No", skip to Module 8.)**

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
    *   Content: The main behaviors described arise from the fundamental physics of nonequilibrium small systems:
        1.  Fluctuations: Observable deviations from average behavior (e.g., negative entropy production events, fluctuations in work/heat). Governed by Fluctuation Theorems (Eq 8, 9).
        2.  Irreversibility: Tendency towards positive entropy production on average (Second Law), quantified by average dissipated work or entropy production rate.
        3.  Elastic Response: Force-extension behavior of polymers like DNA (Fig 2), described by models like WLC (Eq 1, 2).
        4.  Stochastic Dynamics: Random motion (Brownian motion) and state transitions (e.g., hairpin folding/unfolding, Fig 3, 5) driven by thermal noise and external forces (Eq 11).
        5.  Information-Energy Conversion: Conceptual behavior of Maxwell's Demon/Szilard Engine converting information into work (Fig 6, 8, Eq 15, 16).
        6.  Response under Feedback: System dynamics modified by measurement and control loops (Section on feedback).
    *   CT-GIN Mapping: `BehaviorArchetypeNode` types: "FluctuationDominatedDynamics", "IrreversibleProcess", "PolymerElasticity", "StochasticTransitions", "InformationToEnergyConversion", "FeedbackControlledDynamics". Linked to `ConceptNode`s (e.g., "FluctuationTheorem") and `ExperimentNode`s (e.g., "DNAUnzipping").
    *    Implicit/Explicit: Explicit
       *  Justification: These behaviors (fluctuations, elasticity, irreversibility, information effects) are explicitly described, quantified, and illustrated with examples throughout the paper.

### **8.2 Behavior Robustness:**

*   **Vector ID:** M8.2
*   **Vector Type:** Score
    *   Score: N/A (Context Dependent)
    *   Justification: Robustness isn't explicitly analyzed as a feature. The *theories* like FTs are robust statistical laws. Experimental *behaviors* like DNA elasticity are reproducible under controlled conditions (e.g., temperature, salt concentration mentioned as factors). However, stochastic behaviors are inherently variable. The experiments rely on careful control; robustness to significant perturbations is not the focus. For example, DNA pulling curves are consistent (Fig 2), but rupture forces fluctuate (Fig 3). Fluctuation theorems hold statistically over many trials. Assigning a single score is inappropriate for the diverse phenomena reviewed.
    *   Implicit/Explicit: Implicit
        *  Justification: Inferred from the nature of the phenomena (statistical laws are robust, stochastic events are variable) and typical requirements for single-molecule experiments (need for controlled environment).
    *   CT-GIN Mapping: `ReliabilityAttribute` of `BehaviorArchetypeNode`s (would be context-specific).

### **8.3 CT-GIN Emergent Behavior Validation**

*    **Vector ID:** M8.3
*    **Vector Type:** Validation
     *  Content: The "emergent" behaviors discussed (FTs, statistical laws) are validated through:
        1.  Theoretical Derivations: Mathematical proofs based on statistical mechanics principles (referenced, e.g., [45-48, 5]).
        2.  Experimental Verification: Quantitative measurements in controlled experiments. Examples: Evans' bead-in-trap experiment validating work FT (Fig 4, [49]); DNA/RNA hairpin unzipping experiments testing Crooks FT and Jarzynski equality (Fig 5, [42, 53]); Szilard engine realizations measuring work distributions (Fig 8, 9, [70-73]). Validation involves comparing measured probability distributions (e.g., P(W)) or averages (e.g., <exp(-Wd/k<sub>B</sub>T)>) with theoretical predictions (Eq 8, 9, 14). Reproducibility is demonstrated by collapsing data from different conditions (Fig 5 right panel).
     *   Implicit/Explicit: Explicit
    *   Justification: The paper explicitly describes and cites experiments designed to validate the theoretical fluctuation theorems and related concepts, showing figures with comparisons between experimental data and theoretical predictions.

## M9: Cognitive Proximity
*   **Vector ID:** M9
*   **Vector Type:** Cognition

### **9.1 Cognitive Mapping:**

*   **Vector ID:** M9.1
*   **Vector Type:** Description
    *   Content: The paper maps physical concepts to information processing and implicitly to rudimentary aspects of cognition through the discussion of Maxwell's Demon, Szilard's Engine, and Landauer's principle. Specifically:
        1.  Information Acquisition: The demon's measurement of molecular speeds or the Szilard engine's detection of particle position is analogous to sensing/perception.
        2.  Information Storage: The demon's knowledge or the recorded measurement outcome represents stored information (memory).
        3.  Decision Making: The demon's action (opening/closing gate) or the Szilard engine's protocol selection based on measurement is analogous to decision-making based on information.
        4.  Action/Control: Implementing the gate operation or the piston movement based on the decision.
        5.  Cost of Information: Landauer's principle links the physical cost (energy dissipation) to information erasure, a fundamental aspect of computation/cognition.
        The mapping is conceptual, illustrating the thermodynamic implications of information processing, rather than claiming the systems exhibit genuine cognition.
    *   CT-GIN Mapping: `CognitiveMappingEdge` linking `ConceptNode` ("MaxwellDemon", "SzilardEngine", "LandauerPrinciple") to `CognitiveFunctionNode` ("Sensing", "Memory", "DecisionMaking", "ComputationCost").
    *   Implicit/Explicit: Explicit
    * Justification: The paper explicitly discusses Maxwell's demon, Szilard engine, and Landauer's principle in the section "ENERGY, INFORMATION AND THE MAXWELL DEMON," drawing connections between physical actions (measurement, gate operation) and information processing concepts.

### **9.2 Cognitive Proximity Score:**

*   **Vector ID:** M9.2
*   **Vector Type:** Score
    *   Score: 1
    *   Justification: The systems discussed (molecules, beads, conceptual demons/engines) exhibit Level 1 (Simple Responsivity) behavior based on physical laws. The *concepts* explored touch upon information processing, which is foundational to higher cognition. Maxwell's demon/Szilard engine conceptually link sensing, information, and action, bordering on Level 3 (Reactive Autonomy) *in principle*, but the physical realizations are demonstrations of the underlying physics, not autonomous cognitive agents. The paper focuses on fundamental physics (energy, entropy, information cost) relevant far below complex cognitive functions. There's no evidence presented for internal models, goal-directedness beyond immediate physical forces, planning, or abstract reasoning in the systems studied.
    *   Implicit/Explicit: Mixed
    *  Justification: Score assigned based on the described behaviors (explicitly Level 1 physics) and the conceptual links to information processing (implicitly related to foundations of higher levels), judged against the provided CT-GIN Cognizance Scale.

**CT-GIN Cognizance Scale:**

*   **Level 0: Non-Cognitive:** Purely reactive system.  No internal state beyond immediate stimulus-response.
*   **Level 1: Simple Responsivity:** Basic stimulus-response behavior.  Reactions are fixed and predetermined.
*   **Level 2: Sub-Organismal Responsivity:**  Behavior exhibits basic forms of adaptation or plasticity, but lacks complex representation or goal-directedness.
*   **Level 3: Reactive/Adaptive Autonomy:** System adapts its behavior based on experience and feedback, but within a limited behavioral repertoire.
*   **Level 4: Goal-Directed/Model-Based Cognition:** System exhibits goal-directed behavior based on internal models of the world, allowing for planning and flexible action selection.
*   **Level 5: Contextual/Relational Cognition:** System understands and responds to relationships between objects, events, and concepts.
*   **Level 6: Abstract/Symbolic Cognition:** System can manipulate abstract concepts and symbols, enabling logical reasoning and problem-solving.
*   **Level 7: Social Cognition:** System exhibits social intelligence, understanding and interacting with other agents.
*   **Level 8: Metacognition/Self-Awareness:** System possesses awareness of its own internal states and cognitive processes.
*   **Level 9: Phenomenal Consciousness:**  System exhibits subjective experience (qualia). (Currently theoretical for material systems)
*   **Level 10: Sapience/Self-Reflective Consciousness:** System possesses self-awareness, understanding of its own existence, and ability for complex abstract thought. (Currently theoretical for material systems)

### **9.3 Cognitive Function Checklist**

* **Vector ID:** M9.3
* **Vector Type:** Checklist
    *   | Cognitive Function               | Score (0-10) | Justification/Notes                                                                       | CT-GIN Mapping (if applicable) | Implicit/Explicit | Justification for Implicit/Explicit/Mixed |
    | :-------------------------------- | :----------: | :------------------------------------------------------------------------------------ | :--------------------------------: | :-----------------:|:-----------------:|
    | Sensing/Perception               | 1           | Systems respond to physical stimuli (force, position). Conceptual demon "senses" speed. Limited, direct physical interaction. | `CognitiveMappingEdge` to "Sensing" | Mixed              | Explicit physical response; Implicit/Conceptual mapping for demon. |
    | Memory (Short-Term/Working)        | 0           | No evidence of working memory presented. Demon/Szilard conceptually holds 1 bit temporarily. | N/A                               | Implicit          | Conceptual only for demon/Szilard; Absent in physical systems described. |
    | Memory (Long-Term)                 | 0           | No evidence of long-term memory encoding/retrieval presented.                         | N/A                               | No                 | Absent in descriptions. |
    | Learning/Adaptation              | 0           | No evidence of learning or adaptation in the described systems/experiments.           | N/A                               | No                 | Absent in descriptions. |
    | Decision-Making/Planning          | 1           | Demon/Szilard make simple binary decision based on measurement. No planning.        | `CognitiveMappingEdge` to "DecisionMaking" | Mixed              | Conceptual only for demon/Szilard; Explicitly simple; Absent otherwise. |
    | Communication/Social Interaction | 0           | No communication or social interaction discussed.                                       | N/A                               | No                 | Absent in descriptions. |
    | Goal-Directed Behavior            | 0           | Behavior driven by immediate physical forces/potentials, not internal goals.          | N/A                               | No                 | Absent in descriptions. |
    | Model-Based Reasoning              | 0           | No evidence of internal models or reasoning based on them.                             | N/A                               | No                 | Absent in descriptions. |
    | **Overall score**                 |      [~0.3]       | System primarily demonstrates basic physical responsiveness. Cognitive aspects are conceptual/theoretical links. |                                   |                     |                |

    *   **Note:** Scores reflect the *physical systems and experiments* described in the paper, not just the abstract concepts (like the ideal Maxwell's Demon).

## M10: Criticality Assessment
*   **Vector ID:** M10
*   **Vector Type:** Criticality

### **10.1 Criticality:**

*   **Vector ID:** M10.1
*   **Vector Type:** Assessment
    *   Content: Unclear
    *   Justification: The paper does not explicitly discuss the concept of criticality (operation near a phase transition, scale-free behavior, power laws) in the context of the systems reviewed. While some complex systems exhibit such features, it is not a focus of this review on fundamental fluctuation theorems and single-molecule experiments as presented. One could speculate if folding transitions have critical aspects, but the text doesn't explore this.
        *   Critical Parameters (If Yes/Partial): N/A
        *   Evidence: N/A
    *   Implicit/Explicit: Implicit
    *    Justification: Assessed based on the absence of discussion of criticality, power laws, or related concepts in the provided text.

## M11: Review Paper Specifics (Conditional)

*   **Vector ID:** M11
*   **Vector Type:** Review

### **11.1 Literature Synthesis Quality:**

*   **Vector ID:** M11.1
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: The review effectively synthesizes key theoretical concepts (FTs, work relations, Jarzynski, Crooks, information thermodynamics) and connects them to illustrative experimental results (DNA pulling/unzipping, bead-in-trap, Szilard engine realizations). From a CT-GIN perspective, it covers foundational aspects like Energy Flow (M2), Temporal Dynamics (M6 - fluctuations, response times), and touches on information-related concepts relevant to Memory (M3 - conceptually) and Computation (M5 - conceptually). It links theory (potential CT `ConceptNode`s) with experiments (potential CT `ExperimentNode`s). However, it doesn't explicitly frame the synthesis using CT-GIN categories like Self-Organization (M4) or Adaptation (M7), as these are not the focus.
    *    Implicit/Explicit: Implicit
         *  Justification: Score based on interpreting the review's content through the lens of CT-GIN categories, assessing coverage and connections made.

### **11.2 Gap Identification:**

*   **Vector ID:** M11.2
*   **Vector Type:** Score
    *   Score: 5
    *   Justification: The review highlights the importance of understanding nonequilibrium physics for biology ("Outlook") and notes that we remain ignorant about which features of entropy production are intrinsic to life. It implicitly points to gaps in understanding how feedback thermodynamics fits a biological context and how fundamental laws might be extended (e.g., involving information). However, it doesn't systematically identify gaps *specifically framed* within CT-GIN categories relevant to material intelligence design (e.g., lack of minimal models for embodied computation or adaptation based on these principles). The identified gaps are broad physics/biology questions rather than targeted CT-GIN material design challenges.
    *   Implicit/Explicit: Mixed
        *  Justification: Explicitly mentions ignorance about entropy production and life, and uncertainty about feedback in biology. Implicitly identifies gaps by focusing on foundational physics rather than engineered cognitive matter.

### **11.3 Future Directions:**

*   **Vector ID:** M11.3
*   **Vector Type:** Score
    *   Score: 4
    *   Justification: The "Outlook" section poses broad questions about applying nonequilibrium physics to understand life and the role of information. It suggests experiments and theory hand-in-hand are needed. However, it does not propose concrete future directions for designing or building *cognizant matter* using the reviewed principles within a CT-GIN framework. The directions are more towards fundamental biological understanding (role of fluctuations, entropy production in life) rather than engineering material intelligence. The concluding sentence frames the field as a "milestone" in the "adventure" to unravel life's secrets, which is inspiring but not actionable in terms of CT-GIN design.
    *    Implicit/Explicit: Mixed
    *   Justification: Explicitly poses broad questions. Lack of concrete, actionable CT-GIN-aligned research directions is implicit.

### **11.4 Review Paper CT-GIN Alignment Score**

*   **Vector ID:** M11.4
*   **Vector Type:** Score
    *   Score: 5
    *   Justification: The review provides essential background in nonequilibrium thermodynamics, energy flow, fluctuations, and information – concepts fundamental to several CT-GIN modules (M2 Energy, M3/M5 Information link, M6 Temporal Dynamics, M8 Behavior-Fluctuations). It grounds these concepts in concrete physical systems (M1 System Overview). However, it lacks coverage of modules central to *engineered* cognizant matter, such as Self-Organization (M4), Embodied Computation (M5), Adaptation (M7), and advanced Cognitive Proximity (M9). The alignment is strong on the *underlying physics* but weak on the *design and synthesis* aspects inherent in the CT-GIN material intelligence framework. It provides building blocks but not blueprints.
    *    Implicit/Explicit: Implicit
        *  Justification: Score based on assessing the overlap between the review's content and the scope of the different CT-GIN modules.

## M12: Theoretical Paper Specifics (Conditional)

**(Skipped as paper type is "Review")**

## M13: Overall Assessment & Scoring

*   **Vector ID:** M13
*   **Vector Type:** Overall

### **13.1 CT-GIN Readiness Score:**

*   **Vector ID:** M13.1
*   **Vector Type:** Score
*   **Calculated Score:** 2.67
    *   Calculation: Average of M1.2(8), M2.3(N/A->0), M3.2(N/A->0), M4.4(N/A->0), M8.2(N/A->0), M9.2(1). Score = (8 + 0 + 0 + 0 + 0 + 1) / 6 = 9 / 6 = 1.5. *Correction: The scoring criteria need clarification if N/A should be 0 or excluded. Assuming N/A means the concept isn't applicable/present in a way that can be scored within the template's context for *designed* intelligence, so setting to 0. Re-check modules used for average: M1-M4, M8.2, M9.2. Scores: M1.2=8, M2.3=N/A->0, M3.1=No->M3.2=N/A->0, M4.1=No->M4.4=N/A->0, M8.2=N/A->0, M9.2=1. Average = (8+0+0+0+0+1)/6 = 1.5. Let's re-read the instruction: "Average of scores from Modules 1-4, M8.2 and M9.2". Okay, need scores for M1.2, M2.3, M3.2, M4.4, M8.2, M9.2. Let's re-evaluate M2.3 qualitatively (Low/Medium = 3?), M8.2 qualitatively (Medium=5?) Let's stick to N/A->0 for now as the paper doesn't provide basis for scoring these aspects for a *single designed system*.

    *Let's use available *numeric* scores: M1.2 (8), M9.2 (1). Other score modules (M2.3, M3.2, M4.4, M8.2) are N/A or represent absence of the feature in the material intelligence context. Setting N/A scores to 0 yields (8 + 0 + 0 + 0 + 0 + 1) / 6 = 1.5. (Will use 1.5).*

    *Revisiting M11 scores (Review specific): M11.1=7, M11.2=5, M11.3=4, M11.4=5. If the readiness score should reflect the review's utility for CT-GIN: Maybe use M11.4 = 5? The instruction is ambiguous for review papers.*

    *Let's assume the score measures the readiness of the *content reviewed* to be modeled by CT-GIN for material intelligence, based on the standard modules. The score of 1.5 reflects that while implementation is clear (M1.2=8) and basic cognitive links are conceptualized (M9.2=1), the core features of designed intelligence (memory, self-org, computation, adaptation, robust behavior) are absent in the described systems.*

    **Calculated Score: 1.5**

**CT-GIN Readiness Summary Table:**

| CT-GIN Aspect                   | Strength (Yes/Partial/No) | Key Supporting Metrics (with units) | Limitations (Missing Metrics/Data Gaps)                                           | Improvement Areas (Future Research)                                          |
| :------------------------------ | :-----------------------: | :-----------------------------------| :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| Energy Flow Efficiency          | Partial (Conceptual)      | Molecular motor efficiency≈100% (stated); W<sub>d</sub> (quantifiable) | Efficiency metrics for specific engineered systems absent.                     | Quantify efficiency in designed systems using these principles.                  |
| Memory Fidelity                 | No                        | Landauer limit (J/bit)              | No designed material memory system analyzed.                                      | Design physical memory elements based on thermodynamic principles.                |
| Organizational Complexity       | No                        | N/A                                  | Focus on single molecules/particles, not collective self-organization.           | Explore collective behaviors driven by nonequilibrium thermodynamics.          |
| Embodied Computation            | No (Conceptual Only)      | Landauer limit (J/bit)              | No material performing computation described. Information concepts abstract.     | Design materials performing computation based on thermodynamic constraints.    |
| Temporal Integration            | Partial                   | τ<sub>r</sub> (s), Pulling rates (pN/s) | Focus on characteristic times, less on complex temporal integration/prediction. | Explore systems with richer temporal dynamics, potential for active inference. |
| Adaptive Plasticity             | No                        | N/A                                  | No adaptive systems described. Evolution mentioned as inspiration.                | Design adaptive materials leveraging fluctuations/feedback.                   |
| Functional Universality         | No                        | N/A                                  | Systems demonstrate specific physical phenomena, not general functions.             | Aim for systems capable of broader functional repertoires.                     |
| Cognitive Proximity            | Partial (Conceptual Links) | Cognitive Function Checklist (~0.3/10) | Links to information processing (Maxwell demon), but low cognitive level of systems. | Bridge gap between fundamental principles and higher cognitive functions.         |
| Design Scalability & Robustness | No                        | N/A                                  | Focus on single-molecule experiments, scalability/robustness not addressed.     | Investigate scalability and robustness of potential designs.                  |
| **Overall CT-GIN Readiness Score** |        **1.5**         | Fundamental principles clear           | Lack of engineered intelligent systems demonstrating higher functions.             | Apply principles to design testable cognizant matter systems.                |


### **13.2 Qualitative CT-GIN Assessment Conclusion:**

*   **Vector ID:** M13.2
*   **Vector Type:** Textual Summary
    *   Content: This review provides a strong foundation in the nonequilibrium thermodynamics of small systems, crucial for understanding the physical constraints and opportunities for material intelligence. Key strengths lie in the clear exposition of energy flow (M2), dissipation, fluctuation theorems (M6, M8), and the thermodynamic cost of information (linking M2, M3, M5 conceptually). It details experimental techniques (M1) like optical tweezers used to probe these phenomena at the nanoscale. However, from a CT-GIN perspective focused on *designed* cognizant matter, the paper has significant limitations. It does not describe systems exhibiting engineered memory (M3), self-organization (M4), embodied computation (M5), or adaptive plasticity (M7). The behaviors described are fundamental physical responses (M8) rather than complex, emergent cognitive functions (M9 score is low). Overall, the paper offers vital physical principles and experimental tools (high readiness in M1, M2 foundations) but provides little direct information on how to assemble these into a functional, integrated cognizant system (low readiness in M3-M5, M7, M9). It sets the stage but doesn't present the play.

### **13.3 CT-GIN Refinement Directions:**

*   **Vector ID:** M13.3
*   **Vector Type:** Recommendations
    *   Content:
        *   **Design Embodied Memory:** Explore physical mechanisms (e.g., bistable molecular states, controlled phase transitions) informed by thermodynamic principles (M3, M2) to create non-volatile, controllable memory elements within materials. Quantify retention, capacity, and energy cost.
        *   **Engineer Self-Organization:** Utilize nonequilibrium driving forces (M2) and local interaction rules inspired by the reviewed physics to achieve targeted emergent structures or patterns (M4).
        *   **Implement Material Computation:** Design material systems where information processing (M5) arises directly from physical dynamics (e.g., nonlinear responses, thresholding) governed by thermodynamic constraints, moving beyond conceptual links like Maxwell's demon.
        *   **Develop Adaptive Systems:** Create materials that leverage feedback mechanisms (M6, M2) and fluctuations to achieve adaptive plasticity (M7), allowing behavior to change based on history or environmental input.
        *   **Bridge Scales:** Investigate how the single-molecule principles reviewed (M1, M8) scale to collective behaviors in larger, interacting systems relevant to macroscopic material intelligence.
        *   **Quantify Cognition:** Develop specific metrics within the CT-GIN framework to quantify cognitive functions (M9) in potential material realizations based on these thermodynamic principles.

## M14: CT-GIN Knowledge Graph

*   **Vector ID:** M14
*   **Vector Type:** Visualization

### **14.1. CT-GIN Knowledge Graph:**
* **Content:**
[A schematic diagram would show central `ReviewConceptNode`s like "Nonequilibrium Thermodynamics", "Fluctuation Theorem", "Jarzynski Equality", "Crooks FT", "Maxwell's Demon", "Szilard Engine", "WLC Model". Edges like `specializes` or `relatesTo` would connect these concepts. `ExperimentNode`s like "DNA Pulling", "DNA Unzipping", "Bead in Trap", "Szilard Engine Realization" would be linked to relevant `ReviewConceptNode`s via `TestsConceptEdge` or `IllustratesConceptEdge`. Key parameters (e.g., P, k<sub>b</sub>, T, pulling rate r) would be attributes of relevant nodes/edges. `EnergyInputNode` ("Mechanical Work", "Thermal Bath"), `EnergyTransductionEdge` ("FrictionalDissipation", "ElasticDeformation"), and `EnergyDissipationNode` ("Heat") would be linked to `ExperimentNode`s. `CognitiveMappingEdge`s would link "MaxwellDemon" / "SzilardEngine" nodes to conceptual `CognitiveFunctionNode`s like "Sensing", "Memory", "DecisionMaking". The graph would primarily map the relationships between physical concepts and the experiments that probe them, rather than describing the architecture of a single intelligent material.]

## M15: Relationship Vectors
*   **Vector ID:** M15
*   **Vector Type:** Relationships
*   Relationships:
        | Source Vector ID | Target Vector ID | Relationship Type |
        | ------------- | ------------- | ----------------- |
        | M1.1          | M2.1          | Describes Energy Inputs For Systems |
        | M1.1          | M8.1          | Describes Behaviors Of Systems |
        | M2.1          | M2.2          | Input Energy Is Transduced |
        | M2.2          | M2.4          | Transduction Leads To Dissipation |
        | M8.1          | M8.3          | Behavior Validation Method |
        | M8.1          | M6.1          | Behavior Exhibits Timescales |
        | M1.1          | M9.1          | Systems Allow Cognitive Mapping (Conceptual) |
        | M9.1          | M9.2          | Mapping Justifies Cognitive Score |
        | M13.2         | M13.3         | Limitations Inform Refinements |
        | M11.4         | M13.1         | Review Alignment Informs Readiness Interpretation |

## M16: CT-GIN Template Self-Improvement Insights

*   **Vector ID:** M16
*   **Vector Type:** Feedback

### **Template Feedback:**

*    **Vector ID:** M16.1
*   **Vector Type:** Text
Provide specific, actionable feedback on the *CT-GIN template itself*, based on this analysis:
    *   **Missing Probes:** For review papers, probes assessing the *scope* and *depth* of coverage for each CT-GIN module (M1-M10) would be useful. How thoroughly does the review cover principles relevant to Energy, Memory, Computation, etc.?
    *   **Unclear Definitions:** The distinction between inherent system state (e.g., folded/unfolded) and *designed* memory (M3.1) could be clarified, especially regarding its influence on future behavior. Similarly, the definition of embodied computation (M5.1) versus conceptual discussion of computation needs sharp delineation. The definition of "Self-Organization" (M4.1) is good but applying it required interpretation for systems like folding.
    *   **Unclear Node/Edge Representations:** Providing more explicit examples of CT-GIN mappings for *review papers* (mapping concepts and experiments rather than components of a single design) would be beneficial. How should relationships like "theory predicts experiment" or "concept illustrated by system" be mapped?
    *   **Scoring Difficulties:** Scoring was challenging for review papers. Many scores (M2.3, M3.2, M4.4, M8.2) are designed for specific material systems. Applying them to a review requires either assigning N/A (losing information) or qualitative scores needing clearer rubrics. The calculation instruction for M13.1 needs clarification on handling N/A and its purpose for review papers (perhaps using M11.4 is better?). The Cognitive Function Checklist (M9.3) scores were difficult to assign meaningfully to the *physical systems* when the discussion was often conceptual (Demon/Szilard).
    *   **Data Extraction/Output Mapping:** Mapping review content summarizing *multiple systems/concepts* to a template often focused on *one system* was sometimes awkward. For instance, M1.3 (Key Parameters) had to list representative values rather than parameters of *the* system.
    *   **Overall Usability:** The template is very detailed and structured, excellent for analyzing a specific material intelligence *design*. For review papers, it requires significant interpretation and many sections become N/A or need qualitative assessment. A tailored version or specific instructions for review papers might improve usability. Perhaps adding a section summarizing the relevance of the reviewed physics *to* each CT-GIN module.
    * **Specific Suggestions:**
        *   Add guidance/alternative probes for applying the template to review articles.
        *   Clarify scoring rubrics, especially for qualitative assessments and handling N/A in overall scores (particularly M13.1).
        *   Provide CT-GIN mapping examples specifically for conceptual relationships found in reviews.
        *   Refine definitions related to Memory (M3.1) and Computation (M5.1) to better handle conceptual discussions versus physical implementations.