# Integrated sensing and communication based on space-time-coding metasurfaces

__Paper Type:__ Hybrid

## M1: System Overview & Implementation
*   **Vector ID:** M1
*   **Vector Type:** Overview

### **1.1 System Description**

*   **Vector ID:** M1.1
*   **Vector Type:** Description
    *   Content: The system is a Space-Time-Coding Metasurface (STCM) designed for Integrated Sensing and Communication (ISAC). It uses a programmable metasurface composed of unit cells (with PIN diodes) controlled by an FPGA to manipulate incoming electromagnetic (EM) waves. The system simultaneously controls the fundamental frequency (carrier) wave for communication (beam steering towards a user) and generates spatially distributed harmonics for sensing (estimating Direction of Arrival - DOA of targets or the transmitter). Key components include the STCM (16x16 unit cells, 2-bit control), PIN diodes, FPGA for control, RF signal source (transmitter), receiving antennas (for harmonics and communication signal), a USRP for signal processing/generation, and optionally an Artificial Neural Network (ANN) or sensing matrix algorithm for DOA estimation. Its purpose is to demonstrate a hardware platform that integrates sensing and communication functions cost-effectively, eliminating the need for separate sensors and potentially dedicated control links. Two specific coding strategies are proposed: "adjustable partitioning" (splitting the metasurface for dedicated sensing/communication tasks) and "full-aperture" (using the entire metasurface for both via STC matrix design).
    *   CT-GIN Mapping: `SystemNode` attributes: `systemType`: STCM-ISAC, `domain`: Microwave_RF, `mechanism`: Space-Time_Coding_EM_Manipulation, `components`: [STCM, Unit_Cells, PIN_Diodes, FPGA, USRP, Antennas, ANN(optional)], `purpose`: Integrated_Sensing_Communication
    *   Implicit/Explicit: Explicit
        *  Justification: The paper explicitly describes the system, its components, operating principles (STCM, ISAC, harmonic generation, beam steering, DOA), and purpose throughout the abstract, introduction, results, and methods sections, supported by Figures 1 and 3.

### **1.2 Implementation Clarity**

*   **Vector ID:** M1.2
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The paper provides a clear conceptual illustration (Fig 1), system architecture diagrams (Fig 3), details on the STCM prototype fabrication (Fig 4b, Methods, Supp. Note 7), experimental setup (Fig 4a, Fig 6a), and key operational principles (coding strategies, DOA estimation via ANN/sensing matrix). Equations for far-field patterns (Eq 1, 2) and references to supplementary notes for detailed calculations enhance clarity. Specific hardware components (USRP, PIN diodes, FPGA) are mentioned. Some details on the specific ANN architecture (layers, neurons, activation function, training) are provided in the Methods section and Supplementary Note 5. However, finer details of the FPGA implementation, specific control algorithms beyond the conceptual level, and precise optimization details for the STC matrices are primarily in supplementary information, slightly reducing the score from 10 within the main text provided.
    *   Implicit/Explicit: Mixed
        * Justification: Key components, setup, and principles are explicit. Specific implementation details (e.g., FPGA code, optimization specifics) are either implicit or referenced in supplementary material not fully provided in the excerpt. ANN details are explicit in Methods.

### **1.3 Key Parameters**

*   **Vector ID:** M1.3
*   **Vector Type:** ParameterTable
    *   Table:
        | Parameter Name | Value | Units | Source (Fig/Table/Section) | Implicit/Explicit | Data Reliability (High/Medium/Low) | Derivation Method (if Implicit) |
        | :------------- | :---: | :---: | :-----------------------: | :-----------------: | :-----------------------------: | :-------------------------------: |
        | Operating Frequency (f_c) | 10.3 | GHz | Experimental verification section, Fig 4 caption, Section: STCM-based ISAC system | Explicit | High | N/A |
        | Metasurface Size (Unit Cells) | 16x16 | N/A | Experimental verification section | Explicit | High | N/A |
        | Unit Cell Control | 2-bit | N/A | Results (Principle...), Experimental verification section | Explicit | High | N/A |
        | Number of Columns (N, theory) | 16 | N/A | Results (Principle...), Fig 2 caption | Explicit | High | N/A |
        | Modulation Frequency (f_0) | 2 (for ANN test) | MHz | Fig 5 caption text | Explicit | High | N/A |

    *   **Note:** Parameters listed are key specifications of the demonstrated STCM system. Reliability is high as they are stated design/experimental parameters.

## M2: Energy Flow
*   **Vector ID:** M2
*   **Vector Type:** Energy

### **2.1 Energy Input**

*   **Vector ID:** M2.1
*   **Vector Type:** Input
    *   Content: The primary energy source is the incoming electromagnetic wave (microwave frequency) illuminating the metasurface, originating from a transmitting antenna (ANT1 connected to USRP via mixer). Additional energy input is required for the FPGA and biasing the PIN diodes to control the metasurface states.
    *   Value: Not specified for EM wave power; Control power not specified.
    *   Units: N/A (Power typically in W or dBm)
    *   CT-GIN Mapping: `EnergyInputNode`: attributes - `source`: EM_Wave, `type`: Microwave_RF; `EnergyInputNode`: attributes - `source`: Electrical_Power, `type`: DC_Biasing_Control
    *   Implicit/Explicit: Mixed
        *  Justification: The EM wave illumination is explicitly stated as the input to be manipulated (Introduction, Results). The need for controlling the unit cells via FPGA and PIN diodes implies electrical power input, which is explicitly mentioned regarding PIN diode states ("OFF-OFF", "ON-OFF" etc.) requiring bias voltage, but the power consumption itself is not quantified.

### **2.2 Energy Transduction**

*   **Vector ID:** M2.2
*   **Vector Type:** Transduction
    *   Content: 1. Incoming EM wave energy is reflected by the metasurface. 2. The phase of the reflected wave at each unit cell (or column) is modulated based on the applied STC matrix codes implemented via PIN diode switching (electrical control energy transduced to change EM properties - reflection phase). 3. This space-time modulation converts energy from the fundamental frequency (f_c) into harmonic frequencies (f_c + ν*f_0). 4. The spatial distribution of energy at different frequencies (fundamental and harmonics) is controlled (beamforming/steering). Electrical energy is consumed by the PIN diodes during switching and to maintain states, and by the FPGA/USRP for control and processing.
    *   CT-GIN Mapping: `EnergyTransductionEdge`: attributes - `mechanism`: Reflection_Phase_Modulation, `from_node`: EM_Input, `to_node`: Reflected_EM_Output; `EnergyTransductionEdge`: attributes - `mechanism`: Frequency_Conversion_Harmonic_Generation, `from_node`: EM_Input_Fundamental, `to_node`: EM_Output_Harmonics; `EnergyTransductionEdge`: attributes - `mechanism`: Diode_Switching, `from_node`: Electrical_Control_Input, `to_node`: EM_Phase_Change
    *   Implicit/Explicit: Mixed
        *  Justification: Reflection and phase modulation are explicit. Harmonic generation as a result of STC modulation is explicit (Eq 2, Fig 2, Fig 5). The underlying mechanism involving PIN diode state changes altering EM properties is explicit. Energy consumption by control circuitry is implicit but necessary.

### **2.3 Energy Efficiency**

*   **Vector ID:** M2.3
*   **Vector Type:** Score
    *   Score: 3
    *   Justification/Metrics: The paper does not quantify the overall energy efficiency of the ISAC process or the metasurface reflection/conversion efficiency. However, metasurfaces, especially reflective ones with diode losses, are generally not highly efficient. Energy is lost in diodes, imperfect reflection, and significant power is spread into multiple desired/undesired harmonics and sidelobes. The primary goal stated is reduced hardware cost and integration, not necessarily high energy efficiency compared to dedicated systems. The score reflects low expected efficiency for the overall system (RF and control), particularly the harmonic generation process. Qualitative assessment: Low.
    *   CT-GIN Mapping: Attribute of relevant `EnergyTransductionEdge`s (e.g., Reflection_Efficiency, Harmonic_Conversion_Efficiency)
    *   Implicit/Explicit: Implicit
      *  Justification: Efficiency is not discussed or quantified in the text provided. The low score is inferred based on general knowledge of metasurface and RF system losses, especially involving active components and harmonic generation.

### **2.4 Energy Dissipation**

*   **Vector ID:** M2.4
*   **Vector Type:** Dissipation
    *   Content: Major dissipation mechanisms include: 1. Resistive losses in the PIN diodes when switched ON. 2. Insertion loss/reflection loss from the metasurface structure itself (dielectric and conductor losses). 3. Energy scattered into unwanted directions/sidelobes or unmodulated specular reflection. 4. Energy converted into unwanted harmonic frequencies. 5. Power consumption by the FPGA and control circuitry. 6. Power consumption by the USRP and mixers. These are not quantified in the paper. Qualitative assessment: Medium to High (due to active components, harmonic generation, and control overhead).
    *   CT-GIN Mapping: Creates `EnergyDissipationNode`s (e.g., Diode_Loss, Scattering_Loss, Control_Circuit_Loss) and `EnergyDissipationEdge`s connecting relevant transduction steps to dissipation nodes.
    *    Implicit/Explicit: Implicit
        *  Justification: The paper does not explicitly detail or quantify dissipation mechanisms. These are inferred based on the physical components and processes involved (PIN diodes, EM scattering, control electronics).

## M3: Memory
*   **Vector ID:** M3
*   **Vector Type:** Memory

### **3.1 Memory Presence:**

*   **Vector ID:** M3.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The system state (STC coding pattern) is determined by external control (FPGA based on computations from sensor input via USRP/ANN). While the PIN diodes hold their state (0/1/2/3) based on the applied bias voltage from the FPGA, this state represents the *current* command, not a memory of past interactions stored intrinsically within the *material structure* that influences future behavior independently of the immediate control signal. The system adapts based on *real-time* sensing processed externally, not based on a persistent, self-modified material state resulting from past EM interactions.
    *    Implicit/Explicit: Implicit
        * Justification: The paper describes a controlled, reconfigurable system. The absence of intrinsic material memory is inferred from the description of the control loop (sensing -> computation -> FPGA -> STCM state change).

**(Conditional: M3.1 is "No", skipping M3.2-M3.8)**

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
    | N/A                 | N/A                          | N/A                             | N/A   | N/A               | N/A               | N/A               | No intrinsic memory operation described |
*   Implicit/Explicit: N/A
    *   Justification: N/A

### **3.8 Memory Fidelity & Robustness Metrics (Optional - if applicable)**
* **Vector ID:** M3.8
* **Vector Type:** Table
*   Table:
    | Metric ID | Description | Value | Units | CT-GIN Mapping | Data Source | Implicit/Explicit | Justification |
    | :-------- | :---------- | :----: | :---: | :-------------: | :----------: |:-----------------:| :-----------------:|
    | N/A       | N/A         | N/A    | N/A   | N/A             | N/A          | N/A             | No intrinsic memory described |
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
    *   Justification: The patterns on the metasurface (STC matrices) that dictate its function are explicitly calculated and imposed externally by the FPGA based on desired outcomes (beam direction, harmonic distribution) derived from sensing data. While the interaction of the EM wave with this programmed structure results in complex field patterns, the underlying configuration (the arrangement of '0's,'1's,'2's,'3's across space and time) is designed and controlled globally, not emergent from purely local interaction rules without a global blueprint.
    *   Implicit/Explicit: Implicit
        *  Justification: The paper describes a system where coding patterns are designed and applied via FPGA control (Results, Fig 3c). This implies a top-down control strategy, contradicting the definition of self-organization based on purely local rules leading to emergent global order.

**(Conditional: M4.1 is "No", skipping M4.2-M4.7)**

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
    | N/A     | N/A         | N/A            | N/A         | N/A   | N/A          | N/A                | N/A           |
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
| N/A     | N/A         | N/A       | N/A         | N/A   | N/A                | N/A            | N/A     |

### **4.6. Globally Emergent Order and Order Parameters**
* **Vector ID:** M4.6
* **Vector Type:** Table
*   Table:
| Property ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Protocol | Source |
| :---------- | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :------: | :-----: |
| N/A         | N/A         | N/A       | N/A         | N/A   | N/A                | N/A            | N/A      | N/A     |

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
    *   Content: Partial
    *   Justification: The STCM *itself*, when programmed with a specific STC matrix, performs a physical transformation on the incident EM wave. This manipulation (phase shifting, harmonic generation, spatial redirection) can be viewed as a form of analog computation embodied in the material structure's interaction with the wave. However, the *design* of the STC matrix and the *interpretation* of the results (DOA estimation via ANN from harmonic amplitudes) involve computation performed by external systems (computer, FPGA, USRP). The metasurface computes the wave transformation based on its state, but it doesn't compute the state itself based on cognitive processes.
    *    Implicit/Explicit: Mixed
        *  Justification: The paper explicitly describes the wave manipulation capabilities (beam steering, harmonic generation) achieved by the programmed STCM. Interpreting this physical transformation as embodied computation is implicit based on the definition. The external computation (DOA estimation, pattern calculation) is explicitly mentioned.

**(Conditional: M5.1 is "Partial", including M5.2-5.4 for the embodied part)**

### **5.2 Computation Type:**

*   **Vector ID:** M5.2
*   **Vector Type:** Classification
    *   Content: Analog
    *   CT-GIN Mapping: `ComputationNode` attributes: `computationType`: Analog_Wave_Transformation
    *    Implicit/Explicit: Implicit
    *    Justification: The interaction of the continuous EM wave with the metasurface structure (with discrete states approximating continuous phase profiles) results in analog transformations of the wavefront (amplitude, phase, frequency, direction). This is inferred from the physics of wave interaction with the structure described.

### **5.3 Computational Primitive:**

*   **Vector ID:** M5.3
*   **Vector Type:** Function
    *   Content: Wavefront Transformation (including phase shifting, spatial filtering/beamforming, frequency mixing/harmonic generation). The basic operation is the local phase shift applied by each unit cell (or column) to the incident wave according to the time-varying code, contributing to the overall far-field pattern described by Equations 1 and 2.
    *   **Sub-Type (if applicable):** N/A
    *   CT-GIN Mapping: `ComputationNode` attributes: `primitiveFunction`: Wavefront_Transformation, `subFunctions`: [Phase_Shift, Beamforming, Harmonic_Generation]
    *   Implicit/Explicit: Mixed
    *   Justification: Phase shifting and beamforming (Eq 1) and harmonic generation (Eq 2) are explicitly described as results of the STCM operation. Characterizing these collectively as "Wavefront Transformation" is an implicit functional abstraction. Describing the local phase shift as the most basic operation is inferred from the description of unit cell states and control.

### **5.4 Embodied Computational Units**
* **Vector ID:** M5.4
* **Vector Type:** Table
*   Table:
| Unit ID | Description | Processing Power | Energy/Operation | Freq/Resp. Time | Bit-Depth | Data Source | Implicit/Explicit | Justification |
| :------ | :---------- | :--------------- | :--------------- | :--------------: | :-------: | :----------: |:-----------------:| :-----------------:|
| STCM Unit Cell | Local phase shifter for incident EM wave | N/A (Analog transformation) | N/A (PIN diode switching energy) | ~GHz (EM wave), ~MHz (Modulation f0) | 2-bit (control state) | Results, Methods | Mixed | Description of 2-bit unit cells explicitly provides bit-depth. Timescales explicit. Energy/Power not quantified explicitly for the computation aspect. Interpreting wave interaction as processing is implicit. |

## M6: Temporal Dynamics
*   **Vector ID:** M6
*   **Vector Type:** Temporal

### **6.1 Timescales:**

*   **Vector ID:** M6.1
*   **Vector Type:** ParameterTable
    *   Table:
        | Timescale Description | Value | Units | Source | Implicit/Explicit | Justification |
        | :-------------------- | :---: | :---: | :----: | :----------------: | :------------: |
        | EM Wave Frequency (f_c) | 10.3 | GHz | Experimental verification section | Explicit | Stated operating frequency. |
        | STCM Modulation Frequency (f_0) | e.g., 2 | MHz | Fig 5 caption text | Explicit | Stated modulation frequency for specific experiment. Variable in principle. |
        | Diode Switching Speed | ~MHz (range) | N/A | Implied by f_0=2MHz test; general PIN diode capability | Implicit | The system operates with f_0=2MHz, implying diodes switch at least this fast. Practical limits not stated. |
        | Signal Bandwidth (QPSK Example) | ~0.5+ | Mbps (Symbol Rate) | Fig 5 text | Explicit | Stated symbol rate implies minimum bandwidth. |
        | DOA Estimation/Update Latency | Low (claimed) | N/A | Results (Principle...) text | Explicit (Qualitative) | Claimed low latency for amplitude-based DOA, but not quantified. |
        | Communication Signal Recovery | Real-time (implied) | N/A | Fig 6 results | Implicit | Successful demodulation implies processing within relevant communication timescales. |

    *   **Note:** Timescales cover the EM wave, control modulation, device physics, and system operation.

### **6.2 Active Inference:**

*   **Vector ID:** M6.2
*   **Vector Type:** Assessment
    *   Content: No
    *   Justification: The system implements a feedback control loop: it senses the environment (DOA estimation via harmonics), processes this information externally (ANN/sensing matrix on USRP/computer), and adjusts its state (STCM coding pattern via FPGA) to achieve a goal (maintain communication link). While this involves sensing, acting, and a goal, it lacks evidence of an *internal predictive model* within the STCM material itself that guides action to minimize surprise. The "model" and decision logic reside in the external computational components (ANN/FPGA programming). The STCM passively implements the commands derived from this external processing.
    *   Implicit/Explicit: Implicit
        *  Justification: The paper describes a reactive control system based on external computation. The absence of internal predictive modeling within the material itself is inferred based on the described architecture and the definition of active inference.
    *   **If Yes/Partial, provide examples of testable CT-GIN metrics that *could* be used to quantify active inference:** N/A

## M7: Adaptation
*   **Vector ID:** M7
*   **Vector Type:** Adaptation

### **7.1 Adaptive Plasticity Presence:**

*   **Vector ID:** M7.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The system is *reconfigurable* in real-time, changing its STC coding pattern based on sensor input (DOA estimate) to maintain performance (communication link quality). This is adaptive *control*. However, it does not exhibit adaptive *plasticity* in the material intelligence sense: the intrinsic properties of the STCM material itself do not change or learn based on experience. The adaptation logic resides entirely in the external control system (FPGA/ANN/algorithm) that determines the configuration. The metasurface executes the externally decided adaptation.
    *    Implicit/Explicit: Implicit
        * Justification: The paper describes real-time reconfiguration and uses terms like "self-adaptive beamsteering" (Fig 1 caption) and "autonomously configure the corresponding coding pattern" (Results). However, the mechanism described is external control based on sensing, fitting the definition of adaptive control rather than intrinsic material plasticity/learning.

**(Conditional: M7.1 is "No", skipping M7.2)**

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
    *   Content: 1. **Beam Steering:** Control of the propagation direction of the fundamental frequency EM wave for communication. 2. **Harmonic Generation & Spatial Distribution:** Conversion of fundamental frequency energy into multiple harmonic frequencies with controllable, distinct spatial radiation patterns for sensing. 3. **Integrated Sensing and Communication (ISAC):** Simultaneous execution of beam steering for communication and harmonic generation/analysis for DOA sensing using the same hardware platform. 4. **Self-Adaptive Operation:** Real-time adjustment of the communication beam direction based on the DOA estimated from the harmonics.
    *   CT-GIN Mapping: `BehaviorArchetypeNode` types: "Beam_Steering", "Harmonic_Generation_Spatial_Control", "ISAC", "Adaptive_Control_Loop"
    *    Implicit/Explicit: Explicit
       *  Justification: These behaviors are the core functionalities explicitly described and experimentally demonstrated in the paper (Abstract, Introduction, Results, Figs 1-6).

### **8.2 Behavior Robustness:**

*   **Vector ID:** M8.2
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: The system demonstrates successful operation (beam steering, communication link recovery, DOA estimation) across a wide range of incidence angles (-61° to +62° in Fig 6). DOA estimation accuracy is shown to be within 3° using an ANN trained on monochromatic data but tested with modulated signals (Fig 5f), indicating some robustness to signal type. Performance validation in outdoor and indoor settings (Supp. Note 11, not in excerpt) suggests robustness to different environments. However, sensitivity to noise, interference, multi-target scenarios (mentioned as possible in Supp Note 6 but not demonstrated in main figures), and the precise limits of bandwidth or modulation schemes are not fully quantified in the provided text. The dependence on external components (USRP, FPGA, Mixers, Antennas) also affects overall system robustness.
    *   Implicit/Explicit: Mixed
        *  Justification: Robustness across angles and to modulated signals is explicitly shown/stated (Figs 5, 6). Robustness to environment is mentioned as validated in supplementary info. Limits and sensitivity to other factors (noise, interference) are implicit or unstated.
    *   CT-GIN Mapping: Attribute `robustnessScore` of `BehaviorArchetypeNode`s.

### **8.3 CT-GIN Emergent Behavior Validation**

*    **Vector ID:** M8.3
*    **Vector Type:** Validation
     *  Content: Claims are validated through experimental measurements presented in Figures 4, 5, and 6.
        *   **Beam Steering:** Measured far-field patterns at the fundamental frequency for different coding sequences confirm directional control (Fig 2b theory, Fig 4c, Fig 5a measured).
        *   **Harmonic Generation/Distribution:** Measured far-field patterns (Fig 4d-f, Fig 5b-c) and received spectra (Fig 5d-e) confirm the generation and spatial separation of harmonics.
        *   **DOA Estimation:** ANN-based estimation from measured harmonic amplitudes shows accuracy within 3° across a range of angles (Fig 5f).
        *   **ISAC & Self-Adaptation:** System-level tests (Fig 6) demonstrate successful image transmission recovery when the STCM actively steers the beam based on the estimated DOA, compared to failure when inactive, across various transmitter positions (angles).
        *   **Reproducibility:** Experimental results are presented, implying reproducibility, though statistical analysis of multiple runs is not shown. Theoretical calculations (Fig 2) align with experimental trends.
        *   **Limitations:** Validation primarily in controlled lab/anechoic chamber settings (Fig 4a) or specific indoor/outdoor setups (Fig 6a, Supp Note 11). Scalability to larger arrays or different frequency bands not shown. Multi-target sensing validation not detailed in main text. Robustness to interference not explicitly tested.
     *   Implicit/Explicit: Explicit
    *   Justification: The validation methods (experimental measurements, comparison with theory/simulation, system-level tests) and results supporting the claimed behaviors are explicitly presented in the text and figures.

## M9: Cognitive Proximity
*   **Vector ID:** M9
*   **Vector Type:** Cognition

### **9.1 Cognitive Mapping:**

*   **Vector ID:** M9.1
*   **Vector Type:** Description
    *   Content: None. The paper describes the system using RF engineering, signal processing, and electromagnetics terminology (metasurfaces, beamforming, harmonics, DOA estimation, ISAC, ANN). There is no attempt to map these functions to cognitive processes, even metaphorically. Terms like "smart wireless propagation environments" or "intelligent wireless environments" refer to reconfigurability and adaptability in the engineering sense, not cognitive function. The ANN used for DOA is a computational tool, not presented as analogous to biological neural processing in this context.
    *   CT-GIN Mapping: N/A
    *   Implicit/Explicit: Explicit
    * Justification: The absence of cognitive terminology or analogies is clear from the text.

### **9.2 Cognitive Proximity Score:**

*   **Vector ID:** M9.2
*   **Vector Type:** Score
    *   Score: 2
    *   Justification: The system exhibits Level 1 (Simple Responsivity) as the STCM responds to control signals to change state. It shows elements of Level 2 (Sub-Organismal Responsivity) due to its adaptive control loop (sensing DOA and adjusting beam), demonstrating a basic form of behavioral adaptation driven by environmental input, albeit mediated externally. However, it lacks characteristics of higher levels: the adaptation is pre-programmed external control, there's no evidence of internal models, goal-directed planning beyond the fixed control loop, complex representation, learning in the material sense, or any other higher cognitive functions defined in the scale. The intelligence lies in the overall system design and external processing (ANN/FPGA), not intrinsically within the material's behavior.
    *   Implicit/Explicit: Implicit
    *  Justification: The score is assigned based on comparing the system's described functionalities (adaptive control, reconfigurability) against the definitions in the CT-GIN Cognizance Scale. The justification requires interpreting the system's behavior in the context of the scale's levels.

### **9.3 Cognitive Function Checklist**

* **Vector ID:** M9.3
* **Vector Type:** Checklist
    *   | Cognitive Function               | Score (0-10) | Justification/Notes                                                                       | CT-GIN Mapping (if applicable) | Implicit/Explicit | Justification for Implicit/Explicit/Mixed |
    | :-------------------------------- | :----------: | :------------------------------------------------------------------------------------ | :--------------------------------: | :-----------------:|:-----------------:|
    | Sensing/Perception               |      6       | System senses EM environment (DOA via harmonics). Processed externally. Specific, not general perception. | `BehaviorArchetypeNode`: "Sensing_DOA" | Mixed | Explicitly senses DOA; Score interpretation is implicit. |
    | Memory (Short-Term/Working)        |      1       | State holding by PIN diodes/FPGA registers is akin to very basic, volatile working memory for current instruction. No dynamic cognitive working memory. | N/A | Implicit | Inferred analogy; absence of cognitive memory explicit from design. |
    | Memory (Long-Term)                 |      0       | Absent. No evidence of persistent information storage influencing future behavior based on past interactions within the material. | N/A | Implicit | Inferred absence based on system description. |
    | Learning/Adaptation              |      2       | System adapts beam based on sensing (adaptive control), but no intrinsic learning/plasticity in the material. ANN learns offline (or potentially online - unclear if ANN retrains in real-time). Score reflects system-level adaptation, not material learning. | `BehaviorArchetypeNode`: "Adaptive_Control_Loop" | Mixed | Explicit adaptive control; Implicit assessment of lack of material learning. ANN learning explicit but external. |
    | Decision-Making/Planning          |      1       | Simple decision (select STC pattern based on DOA) made externally by FPGA/algorithm. No complex planning. | N/A | Implicit | Inferred based on control loop description. |
    | Communication/Social Interaction |      1       | System facilitates EM communication (primary function). No social interaction. | `BehaviorArchetypeNode`: "Communication" | Explicit | Core function is communication link; lack of social aspect is explicit. |
    | Goal-Directed Behavior            |      3       | System acts to achieve a fixed goal (maintain communication link). Goal and strategy are externally defined. | `BehaviorArchetypeNode`: "Adaptive_Control_Loop" | Mixed | Explicit goal-directed control loop; Implicit assessment of limited scope. |
    | Model-Based Reasoning              |      1       | ANN/Sensing Matrix implicitly models relationship between harmonics and DOA. Model is external, used for estimation, not complex reasoning within the material. | N/A | Implicit | Inferred nature of ANN/matrix as a model; lack of reasoning explicit. |
    | **Overall score**                 |    [1.875]     | Reflects primarily engineered sensing and adaptive control, lacking core cognitive features like intrinsic memory, learning, and complex decision-making. | N/A                                | Implicit            | Calculated average; Interpretation is implicit. |    

    *   **Note:** Scores reflect the absence of most cognitive functions at the *material* level. Sensing and adaptive behavior are present but largely externally orchestrated or interpreted.

## M10: Criticality Assessment
*   **Vector ID:** M10
*   **Vector Type:** Criticality

### **10.1 Criticality:**

*   **Vector ID:** M10.1
*   **Vector Type:** Assessment
    *   Content: No
    *   Justification: The paper does not mention or provide any evidence suggesting that the STCM system operates near a critical point (in the sense of phase transitions, power laws, scale-free behavior, etc.). The system's behavior is described using standard electromagnetics, signal processing, and control theory.
        *   Critical Parameters (If Yes/Partial): N/A
        *   Evidence: N/A
    *   Implicit/Explicit: Implicit
    *    Justification: Inferred from the absence of any discussion or data related to criticality in the provided text.

## M11: Review Paper Specifics (Conditional)

N/A

*   **Vector ID:** M11
*   **Vector Type:** Review

### **11.1 Literature Synthesis Quality:**

N/A

### **11.2 Gap Identification:**

N/A

### **11.3 Future Directions:**

N/A

### **11.4 Review Paper CT-GIN Alignment Score**

N/A

## M12: Theoretical Paper Specifics (Conditional)

N/A

*   **Vector ID:** M12
*   **Vector Type:** Theory

### **12.1 Theoretical Rigor:**

N/A

### **12.2 Realization Potential:**

N/A

### **12.3 Potential for Future CT-GIN Implementation Score**

N/A

## M13: Overall Assessment & Scoring

*   **Vector ID:** M13
*   **Vector Type:** Overall

### **13.1 CT-GIN Readiness Score:**

*   **Vector ID:** M13.1
*   **Vector Type:** Score
*   **Calculated Score:** 2.00  *(Average of M1.2=8, M2.3=3, M3.1=0 (No)*, M4.1=0 (No)*, M8.2=7, M9.2=2 -> (8+3+0+0+7+2)/6 = 20/6 ≈ 3.33. Re-evaluating: Scores M3.1 and M4.1 are binary Yes/No; instructions say "scores from Modules 1-4, M8.2 and M9.2". If M3.1/M4.1=No counts as 0 for numerical scoring purpose: M1.2=8, M2.3=3, M3.2=N/A (0?), M4.4=N/A (0?), M8.2=7, M9.2=2. Let's assume N/A due to "No" in M3.1/M4.1 means the conditional scores aren't included. Let's use the scores clearly assigned: M1.2=8, M2.3=3, M8.2=7, M9.2=2. Average = (8+3+7+2)/4 = 20/4 = 5.0. Let's re-read instruction "Average of scores from Modules 1-4, M8.2 and M9.2". This implies M1.2 (Score), M2.3 (Score), M3.2 (Score - conditional), M4.4 (Score - conditional), M8.2 (Score), M9.2 (Score). Since M3.1 and M4.1 were No, scores M3.2 and M4.4 are N/A. How to handle N/A in average? "scores with N/A convert in 0". OK. So M1.2=8, M2.3=3, M3.2=0, M4.4=0, M8.2=7, M9.2=2. Average = (8+3+0+0+7+2)/6 = 20/6 = 3.33)*
*Average requires clarification on which scores exactly to include when prerequisites (like M3.1 yes) are not met. Using the rule N/A=0 for M3.2, M4.4.
**(8 + 3 + 0 + 0 + 7 + 2) / 6 = 20 / 6 = 3.33*

**CT-GIN Readiness Summary Table:**

| CT-GIN Aspect                   | Strength (Yes/Partial/No) | Key Supporting Metrics (with units) | Limitations (Missing Metrics/Data Gaps)                                           | Improvement Areas (Future Research)                                          |
| :------------------------------ | :-----------------------: | :-----------------------------------| :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| Energy Flow Efficiency          | No                       | N/A                                  | Efficiency not quantified, expected low (Score=3)                                | Characterize reflection/conversion losses, optimize STC for efficiency.   |
| Memory Fidelity                 | No                       | N/A                                  | No intrinsic material memory (M3.1=No)                                           | Explore materials with intrinsic memory mechanisms coupled to EM fields.      |
| Organizational Complexity       | No                       | N/A                                  | No self-organization (M4.1=No); structure externally imposed.                  | Investigate local interaction rules for emergent pattern formation.           |
| Embodied Computation            | Partial                  | Analog wave transformation (M5.2/3)   | Computation limited to wave physics; complex processing external.                | Embed more complex computational primitives directly into the material.    |
| Temporal Integration            | Partial                  | f_c, f_0, low latency claim (M6.1/2) | Active inference absent (M6.2=No); dynamics mostly reactive control.         | Implement internal predictive models; explore longer timescales (memory). |
| Adaptive Plasticity             | No                       | N/A                                  | Reconfigurable control, not intrinsic material adaptation (M7.1=No).             | Design materials whose properties genuinely adapt based on EM interaction history.|
| Functional Universality         | Partial                  | ISAC demonstrated (M8.1)             | Limited to specific EM manipulation tasks; requires external systems.          | Explore broader range of functionalities, reduce external dependency.       |
| Cognitive Proximity            | No                       | Low score (M9.2=2); Checklist avg 1.88 | Lacks features beyond engineered sensing/control.                              | Integrate features higher on the cognizance scale (memory, learning, etc.). |
| Design Scalability & Robustness | Partial                  | Works across angles (M8.2=7)       | Scalability to larger arrays/freq unclear; robustness limits not fully tested. | Test scalability; perform rigorous robustness analysis (noise, interference). |
| **Overall CT-GIN Readiness Score** | **3.33** |        | Significant gaps in memory, self-organization, adaptation, cognition. | Focus on embedding intelligence locally within the material. |      |


### **13.2 Qualitative CT-GIN Assessment Conclusion:**

*   **Vector ID:** M13.2
*   **Vector Type:** Textual Summary
    *   Content: This paper presents a sophisticated engineered system demonstrating Integrated Sensing and Communication (ISAC) using a Space-Time-Coding Metasurface (STCM). Its key strength lies in the functional integration achieved through clever manipulation of electromagnetic waves (beam steering, harmonic generation) via externally controlled space-time coding patterns. The system successfully implements an adaptive control loop, adjusting communication beams based on real-time sensing (DOA estimation). However, from a material intelligence (CT-GIN) perspective, the system exhibits significant limitations. There is no evidence of intrinsic material memory, self-organization emerging from local rules, or adaptive plasticity within the material itself. The observed "intelligence" (adaptation, computation for DOA) resides primarily in the external control and processing units (FPGA, USRP, ANN). The STCM acts as a highly versatile, reconfigurable physical transducer implementing the results of external computation, rather than an autonomous cognitive entity. Its embodied computation is limited to the analog transformation of incident waves based on the programmed state. Therefore, while a significant achievement in RF engineering and ISAC, its current implementation ranks low on the CT-GIN cognizance scale, primarily showing engineered responsiveness and adaptive control, highlighting the gap between advanced reconfigurable materials and genuine material intelligence.
### **13.3 CT-GIN Refinement Directions:**

*   **Vector ID:** M13.3
*   **Vector Type:** Recommendations
    *   Content:
        *   **Embed Intrinsic Memory:** Explore integrating materials (e.g., phase change materials, ferroelectrics) into the unit cell design that allow the metasurface state to be influenced by past EM interactions or environmental conditions, creating a persistent local memory independent of constant FPGA control.
        *   **Incorporate Local Processing:** Design unit cells capable of performing simple computations locally (e.g., thresholding, filtering) based on incident wave properties or neighboring cell states, reducing reliance on centralized FPGA computation for pattern generation.
        *   **Develop Adaptive Material Properties:** Investigate materials whose EM properties (e.g., permittivity, conductivity) intrinsically adapt over time based on cumulative exposure or feedback signals, enabling genuine material learning rather than just reconfigurability.
        *   **Explore Emergent Behavior:** Design local interaction rules (e.g., coupling between adjacent unit cells mediated by surface waves or local feedback) that could lead to emergent, self-organized patterns relevant to ISAC functions, reducing the need for explicit global programming.
        *   **Quantify Energy Efficiency & Dissipation:** Perform detailed analysis of energy consumption and losses associated with different STCM operations to guide the design of more energy-efficient intelligent metasurfaces.
        *   **Integrate Multi-Modal Sensing:** Enhance local unit cells with capabilities to sense other modalities (e.g., temperature, strain) and incorporate this information into local decision-making or state adaptation.

## M14: CT-GIN Knowledge Graph

*   **Vector ID:** M14
*   **Vector Type:** Visualization

### **14.1. CT-GIN Knowledge Graph:**
* **Content:**
    *(Conceptual Description - Diagram generation requires tools)*
    *   **Nodes:**
        *   `SystemNode` (Type: STCM-ISAC) [Key Params: f_c=10.3GHz, 2-bit]
        *   `EnergyInputNode` (Type: EM_Wave)
        *   `EnergyInputNode` (Type: Electrical_Control)
        *   `ComponentNode` (Type: STCM_Unit_Cell) [Params: 2-bit state]
        *   `ComponentNode` (Type: FPGA)
        *   `ComponentNode` (Type: ANN)
        *   `ComputationNode` (Type: External_DOA_Estimation) [Attrib: ANN/Matrix based]
        *   `ComputationNode` (Type: External_STC_Calculation) [Attrib: FPGA based]
        *   `ComputationNode` (Type: Embodied_Wave_Transformation) [Attrib: Analog, Primitive: Phase_Shift/Beamforming/Harmonics] (Linked to STCM)
        *   `BehaviorArchetypeNode` (Type: Beam_Steering) [Attrib: Robustness=7]
        *   `BehaviorArchetypeNode` (Type: Harmonic_Generation) [Attrib: Robustness=7]
        *   `BehaviorArchetypeNode` (Type: Sensing_DOA) [Attrib: Accuracy < 3 deg]
        *   `BehaviorArchetypeNode` (Type: Communication)
        *   `BehaviorArchetypeNode` (Type: Adaptive_Control_Loop)
        *   `EnergyDissipationNode` (Type: Diode_Loss, Scattering_Loss)
    *   **Edges:**
        *   `EnergyInputNode` (EM) -> `ComputationNode` (Embodied) [Type: Energy_Flow]
        *   `ComputationNode` (Embodied) -> `BehaviorArchetypeNode` (Beam_Steering, Harmonic_Gen) [Type: Functional_Coupling]
        *   `ComputationNode` (Embodied) -> `EnergyDissipationNode` [Type: Energy_Flow]
        *   `BehaviorArchetypeNode` (Harmonic_Gen) -> `ComponentNode` (ANN/USRP) [Type: Information_Flow for Sensing]
        *   `ComponentNode` (ANN/USRP) -> `ComputationNode` (External_DOA) [Type: Information_Flow]
        *   `ComputationNode` (External_DOA) -> `ComputationNode` (External_STC) [Type: Information_Flow]
        *   `ComputationNode` (External_STC) -> `ComponentNode` (FPGA) [Type: Control_Signal]
        *   `ComponentNode` (FPGA) -> `ComponentNode` (STCM_Unit_Cell) [Type: Control_Signal]
        *   `EnergyInputNode` (Electrical) -> `ComponentNode` (FPGA, STCM_Unit_Cell) [Type: Energy_Flow]
        *   Relationships forming the Adaptive Control Loop connect Sensing_DOA -> External_DOA -> External_STC -> FPGA -> STCM -> Beam_Steering.

## M15: Relationship Vectors
*   **Vector ID:** M15
*   **Vector Type:** Relationships
*   Relationships:
        | Source Vector ID | Target Vector ID | Relationship Type |
        | ------------- | ------------- | ----------------- |
        | M1.1          | M8.1          | Describes_Behavior |
        | M2.1          | M2.2          | Input_To_Transduction |
        | M2.2          | M8.1          | Enables_Behavior |
        | M5.1          | M5.3          | Has_Computational_Primitive |
        | M8.1          | M6.1          | Exhibits_Timescales |
        | M8.1 (Sensing) | M1.1 (Control Loop) | Feedback_Input |
        | M1.1 (FPGA Control) | M8.1 (Beam Steering) | Control_Output |
        | M13.2         | M13.3         | Motivation_For_Refinement |
        | M9.2          | M13.1         | Contributes_To_Score |

## M16: CT-GIN Template Self-Improvement Insights

*   **Vector ID:** M16
*   **Vector Type:** Feedback

### **Template Feedback:**

*    **Vector ID:** M16.1
*   **Vector Type:** Text
Provide specific, actionable feedback on the *CT-GIN template itself*, based on this analysis:
    *   **Missing Probes:** The template could benefit from probes differentiating between *intrinsic material* properties/behaviors and *system-level* properties/behaviors resulting from external control or components. This was a recurring challenge in evaluating this paper, which describes an engineered system where "intelligence" is distributed between the material and external controllers/processors. A probe on "Locus of Control" (Internal/External/Hybrid) for key functions like Memory, Computation, Adaptation might be useful.
    *   **Unclear Definitions:** The definitions of "Memory" (M3.1) and "Adaptive Plasticity" (M7.1) are good but might need slight refinement to more strongly emphasize the *intrinsic material change* aspect versus state-holding or reconfigurability common in engineered systems. The distinction between adaptive control and intrinsic adaptation could be clearer in the prompts.
    *   **Unclear Node/Edge Representations:** Guidance is generally clear, but specifying how to represent external components (like the FPGA, ANN, USRP in this case) and their interactions with the core material system within the CT-GIN graph structure would be helpful. Should they be distinct `ComponentNode` types or attributes of the `SystemNode`?
    *   **Scoring Difficulties:** Calculating the CT-GIN Readiness Score (M13.1) needs a clear, unambiguous rule for handling N/A scores resulting from conditional paths (e.g., when M3.1 is No). Explicitly stating whether N/A=0 or if the N/A score is excluded from the average calculation is needed. The scoring rubrics (e.g., M9.2, M9.3) require careful interpretation, especially when mapping engineered functions to cognitive analogs; providing more detailed guidance or anchor examples for different score levels might improve consistency.
    *   **Data Extraction/Output Mapping:** For hybrid experimental/theoretical papers, mapping theoretical aspects (like Eq 1, 2) versus experimental results (Figs 4-6) to the appropriate sections (e.g., distinguishing theoretical parameters from measured ones in M1.3) was manageable but required careful reading. Explicitly asking for both theoretical predictions and experimental validation values where applicable might be useful.
    *   **Overall Usability:** The template is comprehensive and well-structured, forcing detailed analysis. However, its length and detail level make it time-consuming to apply. For systems that clearly lack certain features (like intrinsic memory or self-organization), having a mechanism to collapse or clearly mark subsequent dependent sections as N/A automatically could improve flow.
    * **Specific Suggestions:**
        * Add a "Locus of Control" field (Internal/External/Hybrid) to modules M3, M5, M7.
        * Clarify the averaging rule for M13.1 when conditional scores are N/A.
        * Provide clearer guidelines or examples for differentiating material-level adaptation/memory from system-level reconfigurability/state-holding.
        * Suggest a standard way to represent key external computational/control elements in the M14 graph description.