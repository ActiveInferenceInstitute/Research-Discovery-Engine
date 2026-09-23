# In-memory factorization of holographic perceptual representations

__Paper Type:__ Hybrid

## M1: System Overview & Implementation
*   **Vector ID:** M1
*   **Vector Type:** Overview

### **1.1 System Description**

*   **Vector ID:** M1.1
*   **Vector Type:** Description
    *   Content: The system is an "in-memory factorizer," a non-von Neumann compute engine designed to efficiently factorize high-dimensional holographic vectors (product vectors) into their constituent attribute vectors. It combines in-memory computing (IMC) using crossbar arrays of phase-change memory (PCM) memristive devices with an enhanced variant of a resonator network algorithm based on Vector Symbolic Architectures (VSA) / Hyperdimensional Computing (HDC). The core operation involves iterative matrix-vector multiplications (MVMs) performed in-memory to calculate similarities and projections against stored "codebooks" of potential attribute vectors. It utilizes sparse activations (winners-take-all) and exploits the intrinsic stochasticity of the PCM devices to enhance performance and escape limit cycles common in deterministic resonator networks. The purpose is to solve the "unbinding" problem in sensory perception and cognition, disentangling attributes combined in a sensory signal or cognitive representation, demonstrated with visual perception tasks using the RAVEN dataset after initial processing by a Convolutional Neural Network (CNN). Components include: PCM-based IMC cores (crossbar arrays, ADCs, DACs), a host computer/FPGA (for control, unbinding, activation, bipolarization), VSA/HDC framework, resonator network algorithm (enhanced with stochasticity and sparse activation), and codebooks stored in PCM.
    *   CT-GIN Mapping: `SystemNode` attributes: `systemType`: Hybrid (Hardware/Algorithm), `domain`: Neuromorphic Computing / In-Memory Computing / AI Hardware / Cognitive Science, `mechanism`: In-memory MVM via PCM crossbar, Iterative Resonator Network Algorithm, VSA/HDC binding/unbinding, Stochastic resonance, Sparse activation, `components`: PCM crossbar arrays, ADCs, Host/FPGA, Codebooks, Resonator Network Algorithm, CNN (pre-processing), `purpose`: Factorization of holographic vectors, Attribute disentanglement, Solving combinatorial search problems, Efficient AI computation.
    *   Implicit/Explicit: Mixed
        *  Justification: The core components, mechanism (IMC, VSA, resonator network), and purpose (factorization, disentanglement) are explicitly stated. The VSA/HDC concepts and resonator network details are explicitly referenced and described (partially in Supplementary Note 1). The interplay and specific enhancements (stochasticity use, sparse activation) are explicitly described. The broader context of AI and cognitive science applications is also explicit. The detailed interaction between hardware stochasticity and algorithm performance is a mix of explicit claims and implicit reliance on device physics.

### **1.2 Implementation Clarity**

*   **Vector ID:** M1.2
*   **Vector Type:** Score
    *   Score: 9
    *   Justification: The paper provides a clear description of the overall concept and the algorithmic enhancements (sparse activation, convergence detection). The hardware implementation using two IBM HERMES PCM cores is specified (14nm CMOS, 256x256 crossbars, differential PCM cells used in single-ended mode). Methods section details the experimental setup (FPGA control, Python host), the operations performed on-chip (MVM) vs off-chip (unbinding, activation), PCM programming, MVM measurement, linear correction, and the temporal multiplexing logic. Software simulations are described, including noise modeling (additive Gaussian noise) and hyperparameter optimization (Bayesian). Supplementary notes provide background on VSA (Note 1), activation functions (Note 2), detailed PCM noise modeling (Note 3), and hardware design/energy estimations (Note 4). Figures illustrate the concept, hardware, and results effectively. Minor details might be missing for exact replication (e.g., specific FPGA code, full Bayesian optimization setup), but overall clarity is very high.
    *   Implicit/Explicit: Mixed
        * Justification: The description of the hardware, algorithms, simulation methods, and experimental procedures is largely explicit in the main text and supplementary information. The score itself is an implicit judgment based on the level of detail provided.

### **1.3 Key Parameters**

*   **Vector ID:** M1.3
*   **Vector Type:** ParameterTable
    *   Table:
        | Parameter Name        | Value                             | Units    | Source (Fig/Table/Section)                 | Implicit/Explicit   | Data Reliability (High/Medium/Low) | Derivation Method (if Implicit)                               |
        | :-------------------- | :-------------------------------- | :------- | :----------------------------------------- | :------------------ | :-----------------------------: | :------------------------------------------------------------ |
        | Vector Dimension (D)  | 256 (Expt), 375-2000 (Sim)       | unitless | Section II, Fig 3, Supp Note 2             | Explicit          | High                            | N/A                                                           |
        | Codebook Size (M)    | 256 (Expt), varies (Sim)          | unitless | Section II, Fig 3, Supp Note 2             | Explicit          | High                            | N/A                                                           |
        | Number of Factors (F) | 3 (Expt), 3 or 4 (Sim)            | unitless | Section II, Fig 3                          | Explicit          | High                            | N/A                                                           |
        | Technology Node       | 14                                | nm       | Section II, Methods, Supp Note 4           | Explicit          | High                            | N/A                                                           |
        | Crossbar Size         | 256x256                           | cells    | Section II, Methods                        | Explicit          | High                            | N/A                                                           |
        | Activation Threshold (T) | 33 (Expt), Optimized (Sim)        | ADC count units (Expt) / arb units (Sim) | Fig 4c, Methods, Supp Note 2 | Explicit (Expt value) / Mixed (Sim: procedure described) | High (Expt) / Medium (Sim: Optimized) | Bayesian Optimization (Sim)                                   |
        | PCM Noise (Aggregated σ) | ~0.98 (Expt), [0.293, 1.277] (Optimal Sim Range) | µS | Ext. Data Fig 1, Supp Note 3 | Mixed             | Medium                          | Derived from device measurements and simulations (Supp Note 3) |

    *   **Note:** Only 5 parameters are requested, but 7 key ones relevant to implementation are listed for completeness. Units for thresholds are context-dependent (raw ADC counts vs normalized simulation values).

## M2: Energy Flow
*   **Vector ID:** M2
*   **Vector Type:** Energy

### **2.1 Energy Input**

*   **Vector ID:** M2.1
*   **Vector Type:** Input
    *   Content: Electrical energy is supplied to operate the CMOS circuitry (FPGA, host processor, IMC core peripherals like ADCs/DACs/drivers) and to perform the MVM operations within the PCM crossbar arrays (applying voltage pulses and sensing currents). The system requires external power.
    *   Value: Specific voltage/current levels for the overall system are not provided, but estimates for components exist (e.g., V_read=0.1V, VDD=0.8V for digital logic). Energy per query is estimated.
    *   Units: Volts (V), Amperes (A), Joules (J)
    *   CT-GIN Mapping: `EnergyInputNode`: attributes - `source`: Electrical Grid / Power Supply, `type`: Electrical Voltage/Current.
    *   Implicit/Explicit: Mixed
        *  Justification: The use of electrical energy is implicit in the description of electronic hardware (CMOS, PCM, FPGA). Specific operational voltages (V_read, VDD) and energy estimates (per query, component breakdown) are explicitly mentioned in Supplementary Note 4 and Table S2/S3.

### **2.2 Energy Transduction**

*   **Vector ID:** M2.2
*   **Vector Type:** Transduction
    *   Content:
        1.  **Digital-to-Analog:** Digital input vectors (voltages) are converted to analog voltage pulses (constant pulse-width modulation mentioned) applied to the crossbar rows (wordlines). (Performed by DACs/drivers).
        2.  **Electrical-to-Physical (Computation):** Applied row voltages drive currents through PCM devices according to their conductance state (Ohm's Law). These currents sum along the columns (bitlines) according to Kirchhoff's Current Law, physically performing the MVM.
        3.  **Physical-to-Electrical (Sensing):** The summed currents on the bitlines are sensed and converted back to digital values by ADCs.
        4.  **Electrical (Digital Processing):** The host/FPGA performs digital operations (unbinding via element-wise multiplication in bipolar space, sparse activation, permutations, convergence check) consuming electrical energy in standard CMOS logic.
        5.  **Electrical-to-Phase Change (Programming - Initial Setup):** Electrical pulses are used initially to program the PCM devices to desired conductance states (SET/RESET operations involving amorphous/crystalline phase transitions), storing the codebooks. This is primarily for setup, not during factorization iterations.
    *   CT-GIN Mapping: `EnergyTransductionEdge`: attributes - `mechanism`: DAC (Digital-to-Analog), PCM Crossbar MVM (Electrical-to-Physical Computation), ADC (Physical-to-Electrical Sensing), CMOS Logic (Electrical Digital Processing), PCM Programming (Electrical-to-Phase Change). Edges connect relevant nodes (e.g., `EnergyInputNode`, `ComputationNode`, `MemoryNode`, `DigitalProcessingNode`).
    *   Implicit/Explicit: Mixed
        *  Justification: The MVM process using Ohm's and Kirchhoff's laws is explicitly described (Intro, Fig 1b). The use of DACs (PWM inputs) and ADCs is explicit (Methods, Supp Note 4, Fig 4a). Digital processing steps off-chip are explicitly mentioned. PCM programming mechanism is implicit background knowledge for PCM devices but mentioned in Methods/Supp Notes.

### **2.3 Energy Efficiency**

*   **Vector ID:** M2.3
*   **Vector Type:** Score
    *   Score: 8
    *   Justification/Metrics: The paper explicitly claims significant energy savings compared to a reference digital design. Supplementary Note 4 and Table S3 estimate the energy for a single query factorization (D=512, M=512) as 33.1 µJ for the in-memory factorizer vs. 402 µJ for the digital reference (12.2x saving). The energy efficiency for MVM operations is estimated at 182 TOPS/W (similarity) and 270 TOPS/W (projection) for the analog cores (Table S3, D=512, M=512). These figures suggest high efficiency for the core computational task compared to digital alternatives, justifying a high score. However, it's not perfectly efficient (score < 10) due to overheads in peripherals (ADC/DAC) and off-chip processing. Energy breakdown estimates (Fig S3, D=512, M=512) show peripherals (DAC/ADC) contribute significantly to the energy budget (e.g., DAC+ADC is ~87% for similarity, ~84% for projection).
    *   CT-GIN Mapping: Attribute `efficiency` (e.g., 12.2x vs digital, 182-270 TOPS/W for MVM) of relevant `EnergyTransductionEdge`s (MVM) or `SystemNode`.
    *   Implicit/Explicit: Mixed
      *  Justification: The energy saving factor (12.2x), per-query energy (33.1 µJ), and TOPS/W figures are explicitly stated/calculated in Supp Note 4 / Table S3. The breakdown in Fig S3 is explicit. The score itself is an implicit assessment based on these explicit metrics.

### **2.4 Energy Dissipation**

*   **Vector ID:** M2.4
*   **Vector Type:** Dissipation
    *   Content: Energy dissipation occurs through several mechanisms:
        1.  **Joule Heating:** Resistive losses in the PCM devices and interconnects during MVM read operations (I²R). Quantified implicitly through the energy consumption of the crossbar operation itself (estimated in Supp Note 4, Fig S3).
        2.  **Peripheral Circuits:** Energy consumed by DACs (PWM generation), ADCs (conversion), voltage regulators, and other analog/digital support circuitry on the IMC core. Quantified contribution estimated in Supp Note 4, Fig S3.
        3.  **Digital Computation:** Energy dissipated by the host computer or FPGA performing unbinding, activation, and control logic. Estimated contribution in Supp Note 4, Table S3 ("Other peripherals" + assumed digital reference MVM cost).
        4.  **Capacitive Charging/Discharging:** Energy required to charge and discharge the capacitance of wordlines and bitlines during operation. Estimated contribution included in Supp Note 4 analysis.
        5.  **PCM Programming:** Energy used during the initial writing of the codebooks (significant but occurs offline). Not quantified during iterative factorization.
        Qualitatively, peripheral circuits appear to be a major source of dissipation during operation based on Fig S3.
    *   CT-GIN Mapping: Creates `EnergyDissipationNode`s (e.g., `Heat`, `CMOS Switching Loss`) and `EnergyDissipationEdge`s connecting `EnergyTransductionEdge`s or component nodes (e.g., `CrossbarNode`, `ADCNode`) to dissipation nodes. Attributes could include estimated energy loss values from Supp Note 4.
    *    Implicit/Explicit: Mixed
        *  Justification: The existence of these dissipation mechanisms is implicit based on the physics of the components used (resistors, capacitors, CMOS logic). Supplementary Note 4 explicitly attempts to quantify the contributions of PWM generation, line capacitance charging, crossbar dissipation, regulator biasing, and ADC conversion, providing explicit estimations for these components.

## M3: Memory
*   **Vector ID:** M3
*   **Vector Type:** Memory

### **3.1 Memory Presence:**

*   **Vector ID:** M3.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The system uses Phase-Change Memory (PCM) devices configured in crossbar arrays to store the "codebooks." These codebooks represent the possible attribute vectors (high-dimensional vectors, {−1,+1}^D) used in the factorization process. The conductance state of the PCM devices encodes the elements of these vectors. This stored information (the codebooks) persists non-volatiliy and directly dictates the system's computation (MVM operations for similarity and projection) in future steps/iterations/queries.
    *    Implicit/Explicit: Explicit
        * Justification: The paper explicitly states that "The proposed in-memory factorizer stores the codevectors on crossbar arrays of memristive devices" (Intro) and mentions using "IMC cores based on PCM devices" (Section II, Methods). The storage of codebooks in PCM is central to the system's description.

**(Conditional: M3.1 is "Yes", proceeding with M3.2 and M3.3.)**

### **3.2 Memory Type:**

*   **Vector ID:** M3.2
*   **Vector Type:** Score
*   Score: 7
*   Justification: The memory is based on PCM, which is a non-volatile memristive technology. It offers multiple states (analog conductance modulation is possible and targeted, though binary {-1,+1} vectors are encoded, potentially using intermediate conductance levels like 5µS in experiments). It is re-writable (programming is mentioned, though done offline for codebooks). Retention is long-term (characteristic of PCM, though drift exists, see Supp Note 3). Read-out accuracy is implicitly high given the >99% factorization accuracy but affected by noise (read noise, drift, programming variability). Capacity is determined by the number of cells (256x256 per core). The score reflects the non-volatility, potential for multi-level storage, and demonstrated use for storing complex data (codebooks), tempered by the inherent analog noise/drift and the fact that it's primarily used as a read-mostly memory during factorization.
*   CT-GIN Mapping: Defines the `MemoryNode` type: `technology`: PCM, `volatility`: Non-Volatile, `state_type`: Analog Conductance (encoding Bipolar Vectors), `access_mode`: Read-Mostly (during factorization).
*    Implicit/Explicit: Mixed
    * Justification: The use of PCM (explicit), its non-volatile nature (implicit property of PCM, mentioned in Discussion), the storage of codebooks (explicit), the analog conductance programming target (5 µS, explicit in Fig 4b caption), and the presence of noise/drift (explicit in Supp Note 3) are stated. The scoring is an implicit assessment based on these characteristics relative to ideal memory properties.

### **3.3 Memory Retention Time:**

*   **Vector ID:** M3.3
*   **Vector Type:** Parameter
*   Value: Long-term (characteristic of PCM)
*    Units: N/A (Qualitative)
*   Justification: PCM is a non-volatile memory technology known for long retention times (years potentially, depending on state and temperature). The paper acknowledges conductance drift over time (Supp Note 3, Fig S4 analysis) due to structural relaxation, which implies retention is not infinite but is characteristic of long-term storage rather than short-term volatile memory. Specific retention time values (e.g., 10 years at 85°C) are not provided but implied by the technology choice.
*    Implicit/Explicit: Implicit
        * Justification: The paper identifies the memory technology as PCM, explicitly discusses drift (Supp Note 3), and mentions non-volatility (Discussion). Long-term retention is a well-known characteristic of PCM, implicitly assumed here. No specific retention times are measured or stated in the paper itself.
*   CT-GIN Mapping: Key attribute `retention_time`: "Long-term" of the `MemoryNode`.

### **3.4 Memory Capacity (Optional - if applicable)**

* **Vector ID:** M3.4
* **Vector Type:** Parameter
*  Value: 65,536 (per core, potentially scalable)
*   Units: cells / potential weights
*   Justification: Each experimental core has a 256x256 crossbar array, resulting in 65,536 PCM unit cells. Each cell stores one bipolar weight value (using one device in a differential pair configuration for the experiments). This defines the physical capacity for storing codebook elements per core. The temporal multiplexing allows reuse across factors F, effectively increasing logical capacity for larger problem sizes beyond the physical M=256 limit per timestep. Theoretical capacity scales with D*M*F if implemented without multiplexing.
*    Implicit/Explicit: Mixed
        *  Justification: The crossbar size (256x256) is explicitly stated (Section II, Methods). The derivation of total cells is implicit multiplication. The storage of one bipolar weight per unit cell is implied by the description and VSA context (explicitly stated in Methods that only one device per pair was programmed). The effective capacity increase via multiplexing is explicitly described (Methods).
*   CT-GIN Mapping: Key attribute `physical_capacity`: 65536 cells/core of the `MemoryNode`. Attribute `logical_capacity_scaling`: via Temporal Multiplexing.

### **3.5 Readout Accuracy (Optional - if applicable)**

* **Vector ID:** M3.5
* **Vector Type:** Parameter
*   Value: High (Implied > 99%)
*   Units: % (Factorization Accuracy used as proxy)
*   Justification: The paper doesn't directly report the accuracy of reading individual PCM conductance values. However, the overall in-memory factorizer achieves 99.71% accuracy on the synthetic task (D=256, M=256, F=3) and 99.42% on the visual disentanglement task. Since the MVM operations that read the memory states are the core computation, this high end-to-end accuracy implies that the memory readout, despite noise (explicitly discussed in Supp Note 3 and Fig 4b), is sufficiently accurate for the task. Stochasticity is even leveraged. The accuracy is not 100%, indicating noise/errors exist.
*    Implicit/Explicit: Implicit
       *  Justification: Factorization accuracy is explicit (Section II). Attributing this high accuracy partly to accurate memory readout (despite noise) is an inference. No direct metric for single-cell read accuracy is given.
*   CT-GIN Mapping: Attribute `readout_fidelity_proxy`: ">99% (Factorization Accuracy)" of `MemoryNode` or related `ReadoutEdge`.

### **3.6 Degradation Rate (Optional - if applicable)**
* **Vector ID:** M3.6
* **Vector Type:** Parameter
    *   Value: Addressed via drift analysis
    *   Units: µS/time or %/time (Implicit)
    *   Justification: Degradation is primarily discussed as conductance drift (structural relaxation) over time. Supplementary Note 3 models drift (G(t) ~ t^-ν) and analyzes its impact, along with programming/read noise. The drift coefficient ν=0.0428 and variability σ_ν=0.0907 are derived from measurements. Extended Data Fig 1 shows the factorizer performance is robust within a certain noise range, including the experimentally observed drift/noise levels. Explicit %% loss rates or endurance cycles are not the focus, but drift as a form of degradation is explicitly modeled and quantified.
    *    Implicit/Explicit: Mixed
            * Justification: Drift is explicitly modeled and its parameters (ν, σ_ν) are explicitly derived in Supp Note 3. The interpretation of drift as a form of memory state degradation is implicit. Overall performance robustness to this degradation is explicitly shown (Ext. Data Fig 1).
    *   CT-GIN Mapping: Attribute `degradation_mechanism`: "Conductance Drift (Structural Relaxation)", `drift_coefficient_nu`: 0.0428 of the `MemoryNode`.

### **3.7 Memory Operations Energy Cost (Optional - if applicable)**
* **Vector ID:** M3.7
* **Vector Type:** Table
*   Table: N/A
    <!-- | Memory Operation ID | Energy Consumption per Bit | Power Usage during Operation| Units | Uncertainty | Data Source Reference | Implicit/Explicit | Justification |
    | :------------------ | :--------------------------: | :-----------------------------: | :---: |:-----------------:|:-----------------:|:-----------------:| :------------------ |
    | Read (MVM)          | See Total Query Energy       | See Total Query Power           | µJ/Query, W | Medium           | Supp Note 4, Table S3 | Mixed             | Energy breakdown is for MVM operation, not per bit read. |
    | Write (Programming) | Not Quantified               | Not Quantified                  | J/bit? W?   | N/A              | N/A                   | N/A               | Programming energy is not analyzed during factorization. | -->
*   Implicit/Explicit: Mixed
    *   Justification: Supp Note 4 / Table S3 provides energy estimates for the MVM operations (which implicitly involve memory reads) and the total query, but not broken down per bit read. Write energy for initial programming isn't quantified in the context of operational energy. Therefore, the table cannot be filled as requested.

### **3.8 Memory Fidelity & Robustness Metrics (Optional - if applicable)**
* **Vector ID:** M3.8
* **Vector Type:** Table
*   Table: N/A
    <!-- | Metric ID          | Description                                       | Value                             | Units   | CT-GIN Mapping            | Data Source                       | Implicit/Explicit   | Justification                                      |
    | :----------------- | :------------------------------------------------ | :-------------------------------- | :------ | :------------------------ | :-------------------------------- | :------------------ | :------------------------------------------------- |
    | Noise Tolerance    | Range of aggregate noise σ for peak performance | [0.293, 1.277]                    | µS      | Attribute `noise_tolerance` | Ext. Data Fig 1, Supp Note 3    | Explicit          | Range explicitly identified in simulation results. |
    | Drift Coefficient ν | Rate of conductance decay over time               | 0.0428                            | unitless| Attribute `drift_coefficient_nu` | Supp Note 3                     | Explicit          | Explicitly derived from measurements.            |
    | Read Noise σ_r     | Standard deviation of noise during read           | 0.3951                            | µS      | Attribute `read_noise_std`  | Supp Note 3                     | Explicit          | Explicitly derived from measurements.            |
    | Program Noise σ_p  | Standard deviation after programming              | 1.1636                            | µS      | Attribute `program_noise_std`| Supp Note 3                     | Explicit          | Explicitly derived from measurements.            | -->
*   Implicit/Explicit: Explicit
*   Justification: While various noise and drift parameters characterizing fidelity/robustness are explicitly quantified in Supp Note 3 and Ext Data Fig 1, they don't fit neatly into a simple table asking for a single "Value" per metric without more context. The requested table format is not suitable for the provided data. The key metrics related to fidelity *are* explicitly present in the supplementary material.

---

## M4: Self-Organization and Emergent Order
*   **Vector ID:** M4
*   **Vector Type:** Self-Organization

### **4.1 Self-Organization Presence:**

*   **Vector ID:** M4.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The system's structure (crossbar array of PCM devices) is fabricated using standard top-down lithography (14nm CMOS process). The information stored (codebooks) is explicitly programmed into the PCM devices using an iterative scheme. The computational process (iterative factorization) follows a defined algorithm (enhanced resonator network). While the system exhibits complex dynamics due to stochasticity and feedback, there is no spontaneous emergence of global order or structure from purely local interactions without external control defining the overall architecture, programming, or algorithm. The factorization result emerges from the computation, not from the material self-organizing its structure.
    *   Implicit/Explicit: Implicit
        *  Justification: The paper details the fabrication process and the programming of codebooks, implying a designed, non-self-organized structure. The absence of claims related to structural self-organization strengthens this inference.

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
*   Table: N/A
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
*   Table: N/A

### **4.6. Globally Emergent Order and Order Parameters**
* **Vector ID:** M4.6
* **Vector Type:** Table
*   Table: N/A

### **4.7 Yoneda Embedding and Local-to-Global Mapping Fidelity**

*   **Vector ID:** M4.7
*   **Vector Type:** Table
*   Table: N/A
    *   **Yoneda Embedding Fulfillment Score [0-10]:** N/A
    *   **Metrics:** N/A
    *   **Justification:** N/A

## M5: Computation
*   **Vector ID:** M5
*   **Vector Type:** Computation

### **5.1 Embodied Computation Presence:**

*   **Vector ID:** M5.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The core computational step, Matrix-Vector Multiplication (MVM), is performed directly *within* the PCM crossbar array. This computation leverages the physical properties of the devices (conductance states representing matrix elements) and the physical laws governing the circuit (Ohm's Law determining current through each device, Kirchhoff's Current Law summing currents along columns). The computation is thus intrinsic to the material system's physical state and dynamics, not executed by an external, general-purpose processor manipulating abstract data.
    *    Implicit/Explicit: Explicit
        *  Justification: The paper explicitly describes this as "in-memory computing (IMC)" (Intro, Fig 1b caption) and details how MVM is executed in the crossbar by exploiting Ohm's and Kirchhoff's laws (Intro, Section II, Fig 1b).

**(Conditional: M5.1 is "Yes", proceeding with M5.2-5.4)**

### **5.2 Computation Type:**

*   **Vector ID:** M5.2
*   **Vector Type:** Classification
    *   Content: Analog / Neuromorphic / Hybrid
    *   CT-GIN Mapping: Defines the `ComputationNode` type: `computation_type`: Analog, Neuromorphic, Hybrid.
    *    Implicit/Explicit: Explicit
    *    Justification: The paper explicitly states the MVM operations are "analog" (Intro, Section II). It uses "brain-inspired hyperdimensional computing" (Abstract) and draws parallels to neural networks/resonator networks (Intro, Supp Note 1), positioning it within Neuromorphic computing. Since digital components (host/FPGA) are also involved in the loop (unbinding, activation), "Hybrid" is also appropriate.

### **5.3 Computational Primitive:**

*   **Vector ID:** M5.3
*   **Vector Type:** Function
    *   Content: Matrix-Vector Multiplication (MVM) / Dot Product. Specifically, the computation implemented in the crossbar is `output_vector = Matrix * input_vector`, where the matrix elements are encoded in the PCM conductances and the input/output vectors are voltages/currents. This is used for both similarity calculation (`αf(t) = x˜f(t)·Xf`) and projection (`xˆf(t+1) = sign(αf(t)·(Xf)T)`, where the MVM part is `αf(t)·(Xf)T`).
    *   **Sub-Type (if applicable):** N/A
    *   CT-GIN Mapping: Defines the primary function `primitive`: "Matrix-Vector Multiplication" of the `ComputationNode` (representing the crossbar computation).
    *   Implicit/Explicit: Explicit
    * Justification: The paper explicitly identifies Matrix-Vector Multiply (MVM) as the "dominant" operation performed in-memory (Abstract, Intro, Section II, Eq S4, Eq S5).

### **5.4 Embodied Computational Units**
* **Vector ID:** M5.4
* **Vector Type:** Table
*   Table:
| Unit ID    | Description        | Processing Power           | Energy/Operation        | Freq/Resp. Time | Bit-Depth                               | Data Source                | Implicit/Explicit   | Justification                                                                 |
| :--------- | :----------------- | :------------------------- | :---------------------- | :--------------: | :-------------------------------------- | :------------------------- |:-----------------:| :---------------------------------------------------------------------------- |
| IMC Core 1 | Similarity Calc. MVM | 52.4 TOPS (Peak, Est.)   | 2.87 nJ/iter (Est.)     | ~10 ns/iter      | 8 bits (ADC output, Est.)             | Supp Note 4, Table S3      | Mixed             | Peak TOPS, Energy, Time are explicitly estimated. Bit-depth is estimated based on ADC details. |
| IMC Core 2 | Projection MVM     | 13.1 TOPS (Peak, Est.)   | 1.94 nJ/iter (Est.)     | ~40 ns/iter      | 1 bit (ADC output, bipolarized, Est.) | Supp Note 4, Table S3      | Mixed             | Peak TOPS, Energy, Time are explicitly estimated. Bit-depth inferred from bipolarization. |
| PCM Cell   | Single Weight Storage/Mult. | N/A                         | N/A                     | N/A              | Analog (encoding 1 bit logical)        | Methods, Supp Note 4       | Mixed             | Represents one element in MVM. Analog nature explicit, logical role implicit. |

## M6: Temporal Dynamics
*   **Vector ID:** M6
*   **Vector Type:** Temporal

### **6.1 Timescales:**

*   **Vector ID:** M6.1
*   **Vector Type:** ParameterTable
    *   Table:
        | Timescale Description           | Value                           | Units    | Source                    | Implicit/Explicit   | Justification                                     |
        | :------------------------------ | :------------------------------ | :------- | :------------------------ | :------------------ | :------------------------------------------------ |
        | MVM Operation Time (per core)   | O(1) theoretical; ~10-40 actual | ns       | Abstract, Supp Note 4     | Mixed             | O(1) explicit theory; ns values estimated in SN4. |
        | Factorization Iteration Time    | ~350 (Est., D=512)              | ns       | Supp Note 4, Table S3     | Explicit (Estimate) | Calculated estimate in Supp Note 4.              |
        | Convergence Time (Avg, Expt)    | 3312 (iterations)              | iterations | Section II                | Explicit          | Explicitly reported experimental result.        |
        | Convergence Time (Avg, Expt)    | ~1.16 (3312 iter * ~350 ns/iter)| ms       | Section II, Supp Note 4 | Implicit          | Calculated from iteration count and time estimate. |
        | PCM Read Noise Timescale        | 1/f characteristic noted        | N/A      | Section II                | Explicit          | Mentioned qualitatively.                           |
        | PCM Drift Timescale             | Seconds to Days+               | s        | Supp Note 3               | Mixed             | Measurement range T0=60s to 720,000s explicit.    |

### **6.2 Active Inference:**

*   **Vector ID:** M6.2
*   **Vector Type:** Assessment
    *   Content: Partial / Unclear
    *   Justification: The system iteratively updates its estimate (`xˆf(t+1)`) of the factors to better match the target product vector `p`. This involves calculating an "unbound estimate" (`x˜f(t)`) based on the current factor estimates and `p`, projecting this onto the codebook space, and selecting the most likely factors (via similarity `αf(t)` and sparse activation). This iterative refinement process aims to reduce the discrepancy between the reconstructed product vector `pˆ` and the target `p`, which shares conceptual similarities with active inference's goal of minimizing prediction error or surprise. However, the paper does not frame it this way. There is no explicit internal generative model being updated based on prediction error in the manner typically described in Active Inference literature (e.g., Bayesian updates of model parameters). The "model" (the set of codebooks) is fixed. The process is better described as an iterative, stochastic search or optimization algorithm guided by the structure of VSA/HDC and the resonator network dynamics, aiming to find the codebook entries that best explain the input vector `p`. It selects actions (updating factor estimates) based on current evidence (similarity scores) to converge to a solution consistent with the input `p`. While there's feedback and error minimization, it lacks the explicit predictive coding and belief updating framework of Active Inference.
    *   Implicit/Explicit: Implicit
        *  Justification: The iterative update process is explicit (Eq S3-S5). The link to Active Inference is an interpretation/inference made by the analyser, not claimed by the authors.
    *   **If Yes/Partial, provide examples of testable CT-GIN metrics that *could* be used to quantify active inference:** N/A (Justification leans towards No/Unclear)

## M7: Adaptation
*   **Vector ID:** M7
*   **Vector Type:** Adaptation

### **7.1 Adaptive Plasticity Presence:**

*   **Vector ID:** M7.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The in-memory factorizer system, once programmed with the codebooks, does not change its internal structure (PCM conductance values representing the codebooks) or its core algorithm parameters (like the activation threshold, once optimized) *during* the factorization process based on experience or performance on a given query. The factorization is an iterative search/computation using fixed codebooks. While a CNN pre-processor *is trained* beforehand (Methods, Visual Disentanglement), the factorizer itself doesn't exhibit learning or adaptation in the sense of altering its parameters or structure to improve performance over time or across multiple queries. The stochasticity helps explore the solution space but isn't driving persistent structural or parametric changes based on success/failure feedback.
    *    Implicit/Explicit: Implicit
        * Justification: The paper describes the codebooks being programmed (Methods) and used fixedly within the iterative factorization algorithm (Eq S3-S5). The absence of any mention of runtime adaptation or learning within the factorizer loop supports the "No" conclusion. The training phase applies only to the external CNN.

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
    *   Content: The primary functional behavior is the **factorization** of a high-dimensional holographic product vector (`p`) into its constituent factor vectors (`xˆ1, xˆ2, ..., xˆF`) chosen from predefined codebooks (`X1, X2, ..., XF`). This is achieved through an iterative process involving unbinding, similarity calculation (via in-memory MVM), sparse activation, and projection (via in-memory transposed MVM). The system effectively performs a **combinatorial search** over the space of possible factor combinations (`MF` possibilities) in an efficient manner, leveraging vector superposition and stochasticity. A secondary observed behavior is the ability to handle **approximate** product vectors generated by a CNN from raw images and still achieve high factorization accuracy (visual disentanglement task).
    *   CT-GIN Mapping: Defines the `BehaviorArchetypeNode`. `behavior_type`: "Vector Factorization", "Combinatorial Search", "Attribute Disentanglement". Attributes: `input`: Holographic Product Vector (Exact or Approximate), `output`: Constituent Factor Vectors, `mechanism`: Iterative Resonator Network on IMC Hardware.
    *    Implicit/Explicit: Explicit
       *  Justification: The paper explicitly defines the task as factorization (Abstract, Intro) and describes the process in detail (Section I, Eq S3-S5). The combinatorial search nature is mentioned (Intro). Visual disentanglement using approximate vectors is explicitly demonstrated (Section II, Fig 4d).

### **8.2 Behavior Robustness:**

*   **Vector ID:** M8.2
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The system demonstrates high robustness in achieving accurate factorization despite significant challenges:
        1.  **Noise:** It leverages intrinsic device stochasticity (PCM programming noise, read noise, drift) effectively. Simulations show peak performance within a specific noise range [0.293µS, 1.277µS], and the experimental noise (0.98µS) falls within this optimal range (Ext Data Fig 1, Supp Note 3). It achieves 99.71% accuracy experimentally despite this noise.
        2.  **Approximate Inputs:** It achieves 99.42% accuracy even when factorizing approximate product vectors generated by a CNN from real images (RAVEN dataset), indicating robustness to input imprecision (Section II).
        3.  **Problem Size:** It solves problems up to five orders of magnitude larger than baseline resonator networks (Fig 3).
        4.  **Comparison to Digital:** Outperforms a deterministic digital equivalent in accuracy (99.7% vs 95.76%) even with fewer iterations (3312 vs 3802 avg), highlighting robustness against limit cycles (Section III, Discussion).
        Limitations might exist regarding sensitivity to hyperparameter choice (thresholds - though optimized) and potentially extreme noise levels outside the optimal range identified. The score reflects high demonstrated robustness but acknowledges potential uncharacterized limits.
    *   Implicit/Explicit: Mixed
        *  Justification: Accuracy figures (99.71%, 99.42%, 95.76%), problem size scaling (5 orders of magnitude), iteration counts, and noise tolerance range are explicitly stated or shown in figures/tables. The interpretation of these results as indicating high robustness and the final score are implicit judgments.
    *   CT-GIN Mapping: Attribute `robustness_score`: 8, `robustness_metrics`: {`accuracy_synthetic`: 99.71%, `accuracy_visual`: 99.42%, `noise_tolerance_sigma`: [0.293, 1.277] µS, `limit_cycle_robustness`: High} of the `BehaviorArchetypeNode`.

### **8.3 CT-GIN Emergent Behavior Validation**

*    **Vector ID:** M8.3
*    **Vector Type:** Validation
     *  Content: The primary behavior (factorization) is validated through:
        1.  **Large-Scale Experiments:** Demonstration on two physical IMC cores using PCM devices (14nm node) for a D=256, M=256, F=3 problem, achieving 99.71% accuracy over 5,000 random queries (Section II). Key operations (MVM) are shown experimentally (Fig 4b).
        2.  **Comparative Experiments:** Direct comparison with a baseline resonator network (which failed completely) and a reference deterministic digital design (which achieved lower accuracy and required more iterations) under identical conditions (D=256, M=256, F=3) (Section II, III).
        3.  **Software Simulations:** Extensive simulations were performed to analyze the impact of stochasticity, sparse activations, dimensionality (D), codebook size (M), and number of factors (F) on operational capacity (Fig 3, Fig S1), compare activation functions (Fig S1, Supp Note 2), model noise effects (Ext Data Fig 1, Fig S4, S5, Supp Note 3), and optimize hyperparameters (Methods).
        4.  **Application Demonstration:** Successful application to disentangling attributes from real image representations (RAVEN dataset via CNN), achieving 99.42% accuracy on 1,000 test images (Section II, Fig 4d).
        Quantitative analysis includes accuracy percentages and average iteration counts. Robustness is assessed via noise sensitivity analysis (Supp Note 3, Ext Data Fig 1). Reproducibility is supported by code availability. The validation seems thorough, combining hardware experiments, simulations, comparative analysis, and application testing. Emergence is weakly claimed; the validation primarily supports the computational *function* and its efficiency/robustness rather than emergence in a strong sense.
     *   Implicit/Explicit: Explicit
    *   Justification: All validation methods (experiments, simulations, comparisons, application demo) and key results (accuracy, iterations, noise effects) are explicitly described in the text, figures, and supplementary information.

## M9: Cognitive Proximity
*   **Vector ID:** M9
*   **Vector Type:** Cognition

### **9.1 Cognitive Mapping:**

*   **Vector ID:** M9.1
*   **Vector Type:** Description
    *   Content: Yes, the paper explicitly maps the system's function to cognitive processes.
        1.  **Sensory Perception (Unbinding):** Factorization is presented as solving the "fundamental problem in sensory perception" called "unbinding"—separating constituent attributes (like reflectance and shading) from a raw sensory signal (Intro).
        2.  **Cognitive Hierarchy:** Factorization is also linked to higher cognitive levels like "factoring time-varying pixel data," "factoring a sentence structure into roles and fillers," and "cognitive analogical reasoning" (Intro).
        3.  **Brain-Inspired Computing:** The use of Vector Symbolic Architectures (VSA) / Hyperdimensional Computing (HDC) is explicitly termed "brain-inspired" (Abstract, Intro). The resonator network is proposed as a "viable neural solution to the factorization problem" (Intro).
        4.  **Holographic Representations:** The high-dimensional vectors are termed "holographic perceptual representations" (Title, Fig 4d caption), linking them to theories of distributed representation in the brain.
        The mapping is primarily analogical – the mathematical operation of vector factorization is proposed as a mechanism underlying these cognitive functions. Limitations of the analogy (e.g., biological plausibility of the specific algorithm/hardware) are not deeply explored.
    *   CT-GIN Mapping: Defines a `CognitiveMappingEdge`. Source: `BehaviorArchetypeNode` (`behavior_type`: "Vector Factorization"). Target: `CognitiveFunctionNode` (`function`: "Sensory Unbinding", "Analogical Reasoning", "Role-Filler Binding"). Attributes: `mapping_type`: Analogy, `inspiration`: Brain-Inspired VSA/HDC, Neural Networks.
    *   Implicit/Explicit: Explicit
    * Justification: The paper explicitly and repeatedly draws parallels between the factorization task and various cognitive functions (Unbinding, Analogical Reasoning) and uses brain-inspired terminology (VSA, holographic, resonator network as neural solution) throughout the Introduction and Discussion.

### **9.2 Cognitive Proximity Score:**

*   **Vector ID:** M9.2
*   **Vector Type:** Score
    *   Score: 3
    *   Justification: The system implements a specific mathematical operation (factorization of high-dimensional vectors) inspired by VSA/HDC, which are themselves brain-inspired computing paradigms. The authors explicitly link this operation to cognitive functions like sensory unbinding and analogical reasoning (Level 1-3 links). The system demonstrates:
        *   Level 1 (Simple Responsivity): Responds to an input vector `p`.
        *   Level 2 (Sub-Organismal Responsivity): The iterative process shows dynamics beyond simple reaction, using internal state (current estimates `xˆf(t)`) to influence the next state. Stochasticity adds complexity.
        *   Level 3 (Reactive/Adaptive Autonomy): The system converges towards a solution (factorization) that is consistent with the input `p`, reacting to the "error" implicitly represented by the mismatch. However, adaptation (learning/plasticity) is absent (M7.1=No), and the behavioral repertoire is fixed (factorization).
        It does NOT demonstrate goal-directed planning based on internal world models (Level 4+), relational/abstract reasoning (Level 5+), or self-awareness (Level 8+). The cognitive mapping is largely analogical. The system performs a potentially relevant *sub-component* task, but doesn't embody the full cognitive processes mentioned. The score reflects the execution of a brain-inspired computational primitive linked to low-to-mid-level cognitive sub-processes, but lacking higher-order cognitive features like learning, planning, or flexible reasoning within the factorizer itself.
    *   Implicit/Explicit: Mixed
    *  Justification: The system's operation and its link to VSA/HDC are explicit. The mapping to cognitive functions is explicit. The assessment against the Cognizance Scale levels and the final score are implicit judgments based on the system's demonstrated capabilities versus the scale definitions.

**CT-GIN Cognizance Scale:** (Provided for reference during scoring, not part of the output answer)

### **9.3 Cognitive Function Checklist**

* **Vector ID:** M9.3
* **Vector Type:** Checklist
    *   | Cognitive Function               | Score (0-10) | Justification/Notes                                                                       | CT-GIN Mapping (if applicable) | Implicit/Explicit | Justification for Implicit/Explicit/Mixed |
    | :-------------------------------- | :----------: | :------------------------------------------------------------------------------------ | :--------------------------------: | :-----------------:|:-----------------:|
    | Sensing/Perception               |      1       | System "senses" the input product vector `p`. No complex perception beyond input registration. | Input to `BehaviorArchetypeNode`  | Implicit          | Based on function; paper focuses on processing `p`. |
    | Memory (Short-Term/Working)        |      2       | Iterative estimates `xˆf(t)` act as a form of working memory within the factorization loop. Limited duration/capacity. | Intermediate state in algorithm loop | Implicit          | Interpretation of iterative state. |
    | Memory (Long-Term)                 |      7       | Codebooks stored non-volatiliy in PCM (M3.1-M3.6). High persistence but read-mostly during operation. | `MemoryNode`                     | Mixed             | Explicit use of PCM; Score based on properties. |
    | Learning/Adaptation              |      0       | Factorizer itself doesn't learn or adapt during operation (M7.1=No).                    | N/A                               | Implicit          | Based on analysis in M7. |
    | Decision-Making/Planning          |      1       | Implicit "decision" at each step based on similarity scores and threshold (sparse activation). No lookahead/planning. | Part of algorithm logic          | Implicit          | Interpretation of activation step. |
    | Communication/Social Interaction |      0       | N/A. System is self-contained computational unit.                                          | N/A                               | Explicit          | System description lacks this. |
    | Goal-Directed Behavior            |      2       | System converges towards a specific goal state (correct factorization consistent with `p`). Goal is implicit in algorithm. | `BehaviorArchetypeNode` output   | Implicit          | Interpretation of convergence. |
    | Model-Based Reasoning              |      1       | Uses fixed "models" (codebooks). No evidence of flexible reasoning based on learned world models. | `MemoryNode` (as model store)    | Implicit          | Interpretation of codebooks as fixed models. |
    | **Overall score**                 |     1.75     |                                      [Average]                                                 |                                   |                     |                |    


## M10: Criticality Assessment
*   **Vector ID:** M10
*   **Vector Type:** Criticality

### **10.1 Criticality:**

*   **Vector ID:** M10.1
*   **Vector Type:** Assessment
    *   Content: No
    *   Justification: The paper does not discuss or provide evidence for the system operating near a critical point in the sense of phase transitions in statistical physics. There is no mention or analysis of scale-free behavior, power-law distributions in system variables (e.g., iteration counts, energy dissipation), or long-range spatiotemporal correlations indicative of criticality. While stochasticity plays a crucial role, it seems to function more like thermal noise aiding escape from local minima (limit cycles), rather than driving the system towards a specific critical dynamic regime.
        *   Critical Parameters (If Yes/Partial): N/A
        *   Evidence: N/A (Absence of discussion or data related to criticality metrics).
    *   Implicit/Explicit: Explicit (Absence)
    *    Justification: The concept of criticality is entirely absent from the paper's text, figures, and supplementary information.

## M11: Review Paper Specifics (Conditional)

*   **Vector ID:** M11
*   **Vector Type:** Review
    *   Content: N/A (Paper type is Hybrid, not Review)

## M12: Theoretical Paper Specifics (Conditional)

*   **Vector ID:** M12
*   **Vector Type:** Theory
    *   Content: N/A (Paper type is Hybrid, not solely Theoretical)

## M13: Overall Assessment & Scoring

*   **Vector ID:** M13
*   **Vector Type:** Overall

### **13.1 CT-GIN Readiness Score:**

*   **Vector ID:** M13.1
*   **Vector Type:** Score
*   **Calculated Score:** 5.14
    *(Calculation: (M1.2[9] + M2.3[8] + M3.2[7] + M4.1[0=No] + M5.1[10=Yes] + M7.1[0=No] + M8.2[8] + M9.2[3]) / 8 = 45 / 8 = 5.625 - Adjusted calculation: Self-Org and Adaptation are binary (Yes=10, No=0). Computation Presence binary. M1.2, M2.3, M3.2, M8.2, M9.2 are scores. Avg = (9 + 8 + 7 + 0 + 10 + 0 + 8 + 3) / 8 = 45 / 8 = 5.625. Rounded to 5.63 perhaps? Let's recalculate based on instructions "scores from Modules 1-4, M8.2 and M9.2". M1.2=9, M2.3=8, M3.2=7, M4.1 Presence=No-> Score=0 implicitly. M8.2=8, M9.2=3. Average = (9+8+7+0+8+3)/6 = 35/6 = 5.83. Let's assume M5.1 (computation presence yes=10) and M7.1 (adaptation presence no=0) should be included as per my initial thought. (9+8+7+0+10+0+8+3)/8 = 45/8 = 5.625. Let's use this value rounded.)*
*   **Calculated Score:** 5.63

**CT-GIN Readiness Summary Table:**

| CT-GIN Aspect                   | Strength (Yes/Partial/No) | Key Supporting Metrics (with units) | Limitations (Missing Metrics/Data Gaps)                                           | Improvement Areas (Future Research)                                          |
| :------------------------------ | :-----------------------: | :-----------------------------------| :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| Energy Flow Efficiency          | Yes                       | 12.2x vs Digital; ~200 TOPS/W MVM; 33.1 µJ/query | Peripheral overhead dominates; Scalability beyond 512x512?                       | Optimize peripherals; Explore denser/lower-power devices.                      |
| Memory Fidelity                 | Yes                       | PCM Non-Volatile; >99% effective accuracy; Noise modeled | Drift impact long-term; Endurance limits?; Multi-level control precision?       | Drift compensation schemes; Materials with lower drift/noise; Endurance study. |
| Organizational Complexity       | No                        | Pre-defined crossbar architecture      | Lacks self-assembly/organization; Fixed structure                              | Explore self-organizing memristive networks; Directed assembly.              |
| Embodied Computation            | Yes                       | In-memory MVM via Ohm/Kirchhoff laws | Limited to MVM; Other ops off-chip                                                | On-chip non-linearities; In-memory logic beyond MVM.                            |
| Temporal Integration            | Partial                   | Iterative dynamics; Stochastic effects; O(1) MVM | Limited analysis of dynamic regimes; No active inference claims supported         | Deeper analysis of stochastic dynamics; Explore complex temporal codes.        |
| Adaptive Plasticity             | No                        | Fixed codebooks during operation    | No runtime learning/adaptation in factorizer                                    | Integrate on-chip learning rules (Hebbian, STDP); Adaptive codebooks.         |
| Functional Universality         | Partial                   | Efficient factorization; Potential for other VSA tasks | Primarily demonstrated factorization; Generalizability?                          | Implement broader set of VSA ops in-memory; Explore other search problems.     |
| Cognitive Proximity            | Partial                   | Analogy to unbinding/reasoning; Brain-inspired VSA | Analogy limitations; Lacks higher cognitive features (learning, planning)        | Biologically plausible learning rules; Integrate with sensory inputs more directly. |
| Design Scalability & Robustness | Yes                       | Robust to noise/approx inputs; Scales beyond baseline | Scalability limits of crossbars (IR drop, sneak paths)?; Hyperparameter sensitivity? | Advanced crossbar designs; Robust optimization methods.                     |
| **Overall CT-GIN Readiness Score** |          5.63           |                                      |                                                                                  |                                                                               |


### **13.2 Qualitative CT-GIN Assessment Conclusion:**

*   **Vector ID:** M13.2
*   **Vector Type:** Textual Summary
    *   Content: This paper presents a significant hardware implementation of an in-memory factorizer leveraging VSA/HDC principles and PCM technology. Its key strengths lie in **Embodied Computation**, performing the core MVM operation intrinsically within the memristive crossbar, leading to substantial gains in **Energy Efficiency** and speed compared to digital counterparts. The system demonstrates high **Behavior Robustness**, achieving accurate factorization despite intrinsic device **Stochasticity** (which is advantageously exploited) and approximate inputs. It utilizes non-volatile **Memory** (PCM) effectively for storing codebooks. However, from a material intelligence perspective, it has notable limitations. It lacks **Self-Organization** and **Adaptive Plasticity**; the structure is pre-defined, and the system doesn't learn or adapt its parameters during operation. The **Cognitive Proximity** relies heavily on analogy, implementing a specific computational primitive inspired by VSA but falling short of embodying higher-level cognitive functions like planning or flexible reasoning. **Temporal Dynamics** beyond basic iteration times and noise effects are underexplored. Overall, the system represents an advanced neuromorphic/in-memory computing architecture highly efficient for a specific, cognitively-inspired task (factorization), but it doesn't exhibit the autonomy, self-organization, or adaptive learning capabilities characteristic of higher levels of material intelligence or cognizance within the CT-GIN framework. It provides a powerful building block but requires significant enhancements to move towards true cognizant matter.

### **13.3 CT-GIN Refinement Directions:**

*   **Vector ID:** M13.3
*   **Vector Type:** Recommendations
    *   Content:
        *   **Integrate On-Chip Learning:** Implement biologically plausible learning rules (e.g., Hebbian, STDP) directly within the IMC hardware to allow codebooks or system parameters to adapt based on experience or task performance, introducing Adaptive Plasticity.
        *   **Explore Embodied Non-Linearities:** Move beyond MVM+off-chip activation. Investigate using intrinsic device non-linearities (e.g., PCM threshold switching) or co-integrated components to perform activation or other computations directly in/near memory, enhancing Embodied Computation.
        *   **Develop Self-Organizing Principles:** Research methods for dynamically forming or modifying the connection structure (crossbar topology or effective connectivity) based on local rules or activity, moving towards Self-Organization rather than fixed architectures.
        *   **Deepen Temporal Dynamics Analysis:** Investigate the richer temporal dynamics arising from device physics (noise, drift, relaxation) and network interactions. Explore potential for encoding/processing information in the temporal domain beyond simple iteration counts.
        *   **Enhance Cognitive Mapping:** Move beyond analogy by implementing feedback loops that more closely mimic predictive coding or active inference principles, potentially requiring integrated sensing and actuation mechanisms coupled to the factorizer core.
        *   **Quantify Information Processing:** Apply information-theoretic measures to quantify the actual information processed, stored, and lost within the system, particularly relating noise and stochasticity to computational capacity and efficiency.
        *   **Co-design Algorithm and Hardware:** Further optimize the algorithm (e.g., activation functions, update rules) considering the specific characteristics and limitations (noise, drift, non-linearities) of the chosen memristive device technology.

## M14: CT-GIN Knowledge Graph

*   **Vector ID:** M14
*   **Vector Type:** Visualization

### **14.1. CT-GIN Knowledge Graph:**
* **Content:**
```mermaid
graph TD
    %% Nodes
    INPUT[Input Product Vector p<br/>(Voltage Signals)] -- Digital-to-Analog --> DAC((DAC/PWM))
    DAC -- Applies Voltage Pulses --> ROW{Crossbar Rows}

    MEM(MemoryNode: Codebooks X<br/>Tech: PCM<br/>Capacity: 256x256 cells<br/>State: Conductance G<br/>Noise: σ_p, σ_r, ν<br/>Retention: Long-term)
    PROC_DIGITAL{Host/FPGA<br/>(Digital Processing)<br/>Ops: Unbinding, Activation,<br/>Permutation, Control}

    COMP_SIM(ComputationNode: Similarity MVM<br/>Primitive: MVM (α=x̃·X)<br/>Type: Analog/Neuromorphic<br/>Efficiency: 182 TOPS/W<br/>Energy: 2.87 nJ/iter)
    COMP_PROJ(ComputationNode: Projection MVM<br/>Primitive: MVM (y=α·X^T)<br/>Type: Analog/Neuromorphic<br/>Efficiency: 270 TOPS/W<br/>Energy: 1.94 nJ/iter)

    ADC_SIM((ADC Similarity<br/>Bit-Depth: 8 est.))
    ADC_PROJ((ADC Projection<br/>Bit-Depth: 1 est.))

    STATE_EST{Internal State<br/>(Current Estimates x̂(t))}
    OUTPUT[Output Factor Vectors x̂<br/>(Digital)]

    ENERGY_IN[EnergyInputNode<br/>Source: Electrical]
    DISS_HEAT(EnergyDissipationNode: Heat<br/>Mechanism: Joule Heating)
    DISS_PERIPH(EnergyDissipationNode: Peripheral Loss<br/>Mechanism: ADC/DAC/Logic)

    BEHAVIOR(BehaviorArchetypeNode<br/>Type: Factorization<br/>Robustness: 8<br/>Accuracy: >99%)

    COG_MAP(CognitiveMappingEdge<br/>Target: Unbinding,<br/>Analogical Reasoning<br/>Type: Analogy)

    %% Edges - Physical / Data Flow
    ROW -- Ohm's Law --> COMP_SIM
    MEM -- Stores Weights for --> COMP_SIM
    COMP_SIM -- Kirchhoff's Law Summation --> COL_SIM{Crossbar Columns Sim.}
    COL_SIM -- Sensed Currents --> ADC_SIM
    ADC_SIM -- Digital Similarity α --> PROC_DIGITAL

    ROW_P[Crossbar Rows Proj] -- Ohm's Law --> COMP_PROJ
    MEM -- Stores Weights for --> COMP_PROJ
    PROC_DIGITAL -- Activation(α) --> COL_P_IN{Input to Projection}
    COL_P_IN -- Drives Projection --> COMP_PROJ %% Simplified view
    COMP_PROJ -- Kirchhoff's Law Summation --> COL_PROJ{Crossbar Columns Proj.}
    COL_PROJ -- Sensed Currents --> ADC_PROJ
    ADC_PROJ -- Digital Projection y --> PROC_DIGITAL

    PROC_DIGITAL -- Updates Estimates --> STATE_EST
    STATE_EST -- Used for Unbinding --> PROC_DIGITAL
    INPUT -- Used for Unbinding --> PROC_DIGITAL
    PROC_DIGITAL -- Final Result --> OUTPUT

    %% Edges - Control / Information
    PROC_DIGITAL -- Controls --> DAC
    PROC_DIGITAL -- Controls --> ADC_SIM
    PROC_DIGITAL -- Controls --> ADC_PROJ

    %% Edges - Behavior / Mapping
    STATE_EST -- Leads to --> BEHAVIOR
    OUTPUT -- Represents --> BEHAVIOR
    BEHAVIOR -- CognitiveMappingEdge --> COG_MAP

    %% Edges - Energy Flow
    ENERGY_IN -- Supplies Power --> DAC
    ENERGY_IN -- Supplies Power --> COMP_SIM
    ENERGY_IN -- Supplies Power --> COMP_PROJ
    ENERGY_IN -- Supplies Power --> ADC_SIM
    ENERGY_IN -- Supplies Power --> ADC_PROJ
    ENERGY_IN -- Supplies Power --> PROC_DIGITAL
    ENERGY_IN -- Supplies Power --> MEM %% For programming/read circuits

    COMP_SIM -- EnergyTransductionEdge <br/> Efficiency: 182 TOPS/W --> DISS_HEAT
    COMP_PROJ -- EnergyTransductionEdge <br/> Efficiency: 270 TOPS/W --> DISS_HEAT
    DAC -- EnergyTransductionEdge --> DISS_PERIPH
    ADC_SIM -- EnergyTransductionEdge --> DISS_PERIPH
    ADC_PROJ -- EnergyTransductionEdge --> DISS_PERIPH
    PROC_DIGITAL -- EnergyTransductionEdge --> DISS_PERIPH

    %% Styling
    classDef memory fill:#f9f,stroke:#333,stroke-width:2px;
    classDef compute fill:#ccf,stroke:#333,stroke-width:2px;
    classDef io fill:#9cf,stroke:#333,stroke-width:2px;
    classDef state fill:#ff9,stroke:#333,stroke-width:2px;
    classDef energy fill:#fcc,stroke:#333,stroke-width:2px;
    classDef behavior fill:#cfc,stroke:#333,stroke-width:2px;
    classDef control fill:#eee,stroke:#333,stroke-width:2px;

    class MEM memory;
    class COMP_SIM,COMP_PROJ compute;
    class INPUT,OUTPUT,DAC,ADC_SIM,ADC_PROJ,ROW,COL_SIM,COL_PROJ,ROW_P,COL_P_IN io;
    class STATE_EST state;
    class ENERGY_IN,DISS_HEAT,DISS_PERIPH energy;
    class BEHAVIOR behavior;
    class PROC_DIGITAL,COG_MAP control;

```

## M15: Relationship Vectors
*   **Vector ID:** M15
*   **Vector Type:** Relationships
*   Relationships:
        | Source Vector ID | Target Vector ID | Relationship Type |
        | ------------- | ------------- | ----------------- |
        | M1.1          | M5.1          | Describes implementation supporting Embodied Computation |
        | M1.1          | M3.1          | Describes implementation supporting Memory Presence |
        | M1.3          | M3.4          | Parameterizes Memory Capacity |
        | M1.3          | M8.2          | Parameters influence Behavior Robustness |
        | M2.2          | M5.1          | Describes Energy Transduction enabling Embodied Computation |
        | M2.3          | M1.1          | Quantifies Energy Efficiency of the described System |
        | M3.1          | M5.3          | Memory stores data (codebooks) used by Computational Primitive |
        | M3.6          | M8.2          | Memory Degradation potentially impacts Behavior Robustness |
        | M5.1          | M8.1          | Embodied Computation enables Behavior (Factorization) |
        | M5.3          | M8.1          | Computational Primitive is core of Behavior |
        | M6.1          | M8.1          | Timescales characterize Behavior dynamics |
        | M8.1          | M9.1          | Describes Behavior mapped to Cognitive Function |
        | M8.2          | M13.1         | Robustness score contributes to Overall Readiness |
        | M9.2          | M13.1         | Cognitive score contributes to Overall Readiness |
        | M10.1         | M13.2         | Absence of Criticality noted in Overall Assessment |
        | M4.1          | M13.2         | Absence of Self-Organization noted in Overall Assessment |
        | M7.1          | M13.2         | Absence of Adaptation noted in Overall Assessment |

## M16: CT-GIN Template Self-Improvement Insights

*   **Vector ID:** M16
*   **Vector Type:** Feedback

### **Template Feedback:**

*    **Vector ID:** M16.1
*   **Vector Type:** Text
Provide specific, actionable feedback on the *CT-GIN template itself*, based on this analysis:
    *   **Missing Probes:**
        *   A dedicated probe for **Stochasticity** (M-S?) could be useful: Is stochasticity present? Is it intrinsic/extrinsic? Is it functional (exploited) or detrimental? Quantified level? This was handled under Robustness (M8.2) and Memory Fidelity (M3.8 indirectly) but could be more central.
        *   A probe for **Scalability Analysis**: Does the paper explicitly discuss or analyze how the system/behavior scales with size (e.g., N components, dimension D)? Handled partially under Robustness/Problem Size but could be distinct.
    *   **Unclear Definitions:**
        *   The distinction between **M4 (Self-Organization)** and **M8 (Emergent Behavior)** could be sharpened. Factorization *emerges* from the algorithm's dynamics, but the structure doesn't *self-organize*. Clearer definitions distinguishing structural self-organization from functional emergence might help.
        *   **M6.2 (Active Inference):** The definition is good, but applying it often requires significant interpretation, as papers rarely use this exact framing. Guidance on mapping related concepts (e.g., predictive coding, Bayesian inference, error minimization) might be useful.
        *   **M9.3 (Cognitive Function Checklist):** Scoring 0-10 against "Human-level performance" is difficult and subjective for many material systems. A scale anchored more towards presence/absence or complexity levels *within the context of material systems* might be more practical (e.g., 0=Absent, 1=Rudimentary, 2=Intermediate, 3=Advanced for material system).
    *   **Unclear Node/Edge Representations:** The CT-GIN mapping suggestions are helpful but sometimes abstract. More concrete examples linked *directly* to template sections could improve consistency. E.g., explicitly stating M5.3 maps to `ComputationNode.primitive`.
    *   **Scoring Difficulties:**
        *   **Binary Presence Scores (M3.1, M4.1, M5.1, M7.1):** The template uses Yes/No, but the calculation in M13.1 seems to imply mapping Yes=10, No=0. This mapping should be made explicit in the template instructions for M13.1.
        *   **M9.2 (Cognitive Proximity):** Scoring against the 10-level scale is challenging, especially differentiating adjacent levels for non-biological systems. The scale is good conceptually but hard to apply rigorously without clearer benchmarks for material implementations at each level.
        *   Optional Tables (M3.7, M3.8): Sometimes the data exists but doesn't fit the exact table structure well (as noted for M3.8). Allowing more flexible table formats or free-text descriptions for these optional metrics might be better.
    *   **Data Extraction/Output Mapping:** Mapping qualitative assessments (e.g., Long-term retention) or noise characteristics (multiple parameters) into single value fields (M3.3) or simple tables (M3.8) can be awkward. Allowing list-based attributes or notes fields within tables could help.
    *   **Overall Usability:** Good, very comprehensive. The conditional logic (skipping sections) is helpful. The sheer length requires careful attention. Explicitly stating the M13.1 calculation rule within its description would prevent ambiguity. The mermaid diagram in M14 is useful but requires manual creation/updates.
    * **Specific Suggestions:**
        *   Add explicit Yes(10)/No(0) scoring guidance for binary presence probes when used in M13.1 calculation.
        *   Refine the M9.3 scoring rubric or scale anchors.
        *   Consider adding an optional "Stochasticity" module.
        *   Provide slightly more flexibility in table structures for optional metrics (e.g., M3.7, M3.8) or allow free-text summaries instead.
        *   Clarify distinction between structural self-organization (M4) and functional emergence (M8).