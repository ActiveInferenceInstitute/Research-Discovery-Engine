# Fully hardware-implemented memristor convolutional neural network

__Paper Type:__ Experimental

## M1: System Overview & Implementation
*   **Vector ID:** M1
*   **Vector Type:** Overview

### **1.1 System Description**

*   **Vector ID:** M1.1
*   **Vector Type:** Description
    *   Content: The system is a fully hardware-implemented 5-layer memristor-based Convolutional Neural Network (mCNN) designed for image recognition (MNIST dataset). It utilizes eight integrated 2,048-cell memristor crossbar arrays (TiN/TaOₓ/HfOₓ/TiN material stack in a 1T1R configuration) as processing elements (PEs). These arrays perform parallel in-memory multiply-accumulate (MAC) operations, embodying the synaptic weights of the CNN layers (convolutional and fully connected). The system incorporates a customized PCB, an FPGA evaluation board (Xilinx ZC706) for control and interfacing, an ARM core for certain functions (pooling, activation, updates), and peripheral circuits like on-chip decoders, ADCs, multiplexers, and voltage generators. Its purpose is to demonstrate a fast, energy-efficient non-von Neumann computing architecture for deep neural networks, capable of achieving software-comparable accuracy despite device imperfections, leveraging a proposed hybrid training method.
    *   CT-GIN Mapping: `SystemNode` attributes: `systemType`: memristor_CNN, `domain`: neuromorphic_computing, `mechanism`: resistive_switching, in-memory_computing, `components`: memristor_array(1T1R), FPGA, PCB, ARM_core, ADC, MUX, `purpose`: image_recognition, energy_efficient_computing
    *   Implicit/Explicit: Explicit
        *  Justification: The paper explicitly describes the system's architecture (Fig 1a, Fig 2a), components (Abstract, Introduction, Methods), materials (Methods), configuration (1T1R), and purpose (Abstract, Introduction).

### **1.2 Implementation Clarity**

*   **Vector ID:** M1.2
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The paper provides a clear high-level description of the system architecture (Fig 1a), the memristor array structure (Fig 1b, Methods), the CNN model implemented (Fig 2a), and the overall experimental setup (Introduction, Methods). Details on the memristor fabrication (Methods) and material stack are given. The mapping of CNN layers to PEs is explained (Fig 2a, Methods). However, specific details about the peripheral circuit implementation (e.g., ADC resolution beyond bit-depth, specific MUX design, control logic on FPGA) are less detailed in the main text, requiring reference to supplementary information or external sources (e.g., simulation details in Methods for benchmarking). The hybrid training method flow is clearly depicted (Fig 3a).
    *   Implicit/Explicit: Mixed
        * Justification: The overall architecture and core components are explicitly described and illustrated. Some finer implementation details of peripheral circuits are mentioned but not fully elaborated within the main text, making their precise implementation implicit or requiring external references cited in the Methods.

### **1.3 Key Parameters**

*   **Vector ID:** M1.3
*   **Vector Type:** ParameterTable
    *   Table:
        | Parameter Name | Value | Units | Source (Fig/Table/Section) | Implicit/Explicit | Data Reliability (High/Medium/Low) | Derivation Method (if Implicit) |
        | :------------- | :---: | :---: | :-----------------------: | :-----------------: | :-----------------------------: | :-------------------------------: |
        | Memristor Array Size (per PE) | 2048 | cells | Abstract, Fig 1b caption | Explicit | High | N/A |
        | Memristor Configuration | 1T1R | N/A | Fig 1a, Methods | Explicit | High | N/A |
        | CNN Layers | 5 | N/A | Abstract, Fig 2a | Explicit | High | N/A |
        | Programming Pulse Width | 50 | ns | Fig 1c caption, Methods | Explicit | High | N/A |
        | Technology Node (CMOS for transistors) | 130 | nm | Methods | Explicit | High | N/A |

    *   **Note:** These are key hardware implementation parameters. CNN-specific parameters (kernel sizes, etc.) are also explicit but not listed here for brevity.

## M2: Energy Flow
*   **Vector ID:** M2
*   **Vector Type:** Energy

### **2.1 Energy Input**

*   **Vector ID:** M2.1
*   **Vector Type:** Input
    *   Content: The primary energy source is electrical, supplied as voltage pulses to the memristor arrays for programming (SET/RESET operations to write weights) and reading (inference/MAC operations), and for powering the peripheral CMOS circuitry (FPGA, ARM core, ADCs, MUXs, etc.).
    *   Value: Programming: 1.8-4.7 V pulses; Reading: 0.2 V pulses. (Specific power supply values for entire system not detailed)
    *   Units: V (Volts)
    *   CT-GIN Mapping: `EnergyInputNode`: attributes - `source`: electrical_power_supply, `type`: voltage_pulse, CMOS_power
    *   Implicit/Explicit: Explicit
        *  Justification: Programming and read voltages/pulse conditions are explicitly stated (Fig 1c caption, Methods). The need to power CMOS circuitry is explicitly stated in benchmarking (Methods, Extended Data Fig. 5).

### **2.2 Energy Transduction**

*   **Vector ID:** M2.2
*   **Vector Type:** Transduction
    *   Content: 1. **Programming:** Electrical energy (voltage pulses) is converted into electrochemical potential, driving ion/vacancy migration within the TaOₓ/HfOₓ layers. This modulates the conductive filament structure, changing the memristor's resistance state (Stored Potential Energy/Chemical Energy). 2. **Reading (Inference):** Electrical energy (read voltage pulse) is applied across the memristor. Based on its resistance state (stored information), this energy is converted into electrical current (Ohm's Law). Currents from multiple memristors are summed (Kirchhoff's Law) representing the MAC operation. 3. **Peripheral Circuits:** Electrical energy powers standard CMOS logic operations within the FPGA, ARM core, ADCs (converting analog current/voltage signals to digital), MUXs, etc., involving charging/discharging of transistor gates and interconnects, leading to heat dissipation.
    *   CT-GIN Mapping: `EnergyTransductionEdge`: attributes - `mechanism`: resistive_switching, ionic_migration, Ohms_law, Kirchhoffs_law, CMOS_logic_switching, analog_digital_conversion, `from_node`: EnergyInputNode, `to_node`: MemristorNode(State), ComputationNode(MAC), PeripheralCircuitNode, EnergyDissipationNode
    *   Implicit/Explicit: Mixed
        *  Justification: The use of Ohm's and Kirchhoff's laws for MAC is explicitly stated (Introduction). Resistive switching mechanism (filament modulation) is implied by the memristor context and material choice (TiN/TaOₓ/HfOₓ/TiN). Energy use in peripheral CMOS circuits is explicitly calculated in the benchmarking section (Methods, Extended Data Table 1). The detailed physics of ionic migration is implicit based on common understanding of oxide memristors.

### **2.3 Energy Efficiency**

*   **Vector ID:** M2.3
*   **Vector Type:** Score
    *   Score: 8
    *   Justification/Metrics: The paper explicitly benchmarks the system's energy efficiency at 11,014 GOP s⁻¹ W⁻¹ (for simulated 8-bit input), claiming it is >100 times better than a state-of-the-art GPU (Tesla V100). This high score reflects the core advantage of in-memory computing, eliminating von Neumann bottlenecks. The benchmarking considers memristor operations and peripheral circuits (ADC, MUX, drivers etc. simulated at 65nm, S&H/ADC from refs). However, the score is not 10 because the benchmarking excludes some functions (pooling, activation, routing - handled by ARM core in the experiment) and relies partly on simulations/external refs for peripheral circuits rather than solely on the fully integrated experimental system's measurement.
    *   CT-GIN Mapping: Attribute (`efficiency_GOPs_per_W`) of `ComputationNode` or relevant `EnergyTransductionEdge`s
    *   Implicit/Explicit: Explicit
      *  Justification: The energy efficiency value (11,014 GOP s⁻¹ W⁻¹) and the comparison to GPU are explicitly stated in the Abstract, Discussion, and calculated in detail in Methods (Benchmarking section, Extended Data Table 2). The justification for the high efficiency (in-memory computing) is also explicit. Limitations of the benchmark are mentioned.

### **2.4 Energy Dissipation**

*   **Vector ID:** M2.4
*   **Vector Type:** Dissipation
    *   Content: Energy dissipation occurs through several mechanisms: 1. **Memristor Programming:** Joule heating during SET/RESET pulses due to current flow through the device and forming/rupturing filaments. 2. **Memristor Reading:** Joule heating due to read current flowing through the memristor resistance. 3. **Peripheral CMOS Circuits:** Dynamic power dissipation (charging/discharging capacitances in FPGA, ARM, ADCs, MUXs, drivers) and static power dissipation (leakage currents). The benchmarking section (Methods, Extended Data Table 1) quantifies energy consumption for key blocks during a 1-bit inference: Memristor Array (0.91 pJ), Drivers/MUX (1.72 pJ), S&H (19.2 pJ), ADC (2.55 pJ per conversion x 32 ADCs x (50ns/50ns) = 81.6 pJ - *calculation corrected based on text stating ADC completes 4 conversions per 1-bit inference cycle, so 32 ADCs * 4 conversions * 2.55 pJ/conv = 326.4pJ for ADC block during 1-bit inference* - Re-reading methods: "8-bit ADC completes four conversations during the 1-bit inference stage" & consumes 2.55pJ *per conversion*. Total ADC energy is 32 ADCs * 4 conv/ADC/cycle * 2.55 pJ/conv = 326.4 pJ. Periph total = 0.91+1.72+19.2+326.4 = 348.23 pJ for 1-bit inference across the array. The relative contribution is dominated by ADCs and S&H blocks. Qualitative Assessment: Medium-High, dominated by analog/mixed-signal peripherals (ADC, S&H).
    *   CT-GIN Mapping: Creates `EnergyDissipationNode`s (type: Joule_heating, CMOS_switching_loss, Leakage) and `EnergyDissipationEdge`s from MemristorNode, PeripheralCircuitNode.
    *    Implicit/Explicit: Mixed
        *  Justification: Energy consumption values for specific blocks (array, drivers, S&H, ADC per conversion) are explicitly provided in Extended Data Table 1, derived from simulation/measurement/references as detailed in Methods. The underlying physical mechanisms (Joule heating, CMOS switching) are implicit based on standard device physics. The relative contribution analysis is based on the explicit values.

## M3: Memory
*   **Vector ID:** M3
*   **Vector Type:** Memory

### **3.1 Memory Presence:**

*   **Vector ID:** M3.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The conductance states of the memristors are used to store the synaptic weights of the CNN. These states are non-volatile (persist after power removal, though drift is discussed) and directly influence the computation (MAC operations) during inference, thus influencing future behavior (classification output). Programming pulses (SET/RESET) modify these states.
    *    Implicit/Explicit: Explicit
        * Justification: The paper explicitly states that memristors store weights (Abstract: "data are stored", Introduction: "weights into different arrays", Fig 2c caption: "w represents element value in weight matrix, g represents device conductance"), and that conductance is tuned (Fig 1c, Fig 3a/b).

### **3.2 Memory Type:**

*   **Vector ID:** M3.2
*   **Vector Type:** Score
*   Score: 6
*   Justification: The memristors provide analog memory capabilities, demonstrated with 32 distinct conductance states experimentally (Fig 1c) and used effectively as 15-level differential weights (Methods: "15-level fixed-point type"). This allows storing continuous-valued weights required for NNs. Retention is shown over hours/days (Extended Data Fig 3), but drift is a significant issue, degrading accuracy. Capacity is multi-level (up to 32 levels shown, 8 used per device for 15 differential levels). Read-out accuracy is affected by noise, variation, and drift (Fig 3c-e error distributions). Write accuracy depends on closed-loop programming (Methods). It's re-writable. Score reflects good multi-level capability but significant issues with drift/retention/variation compared to ideal memory.
*   CT-GIN Mapping: Defines the `MemoryNode` type (attributes: `mechanism`: resistive_switching, `storage`: analog_conductance, `levels`: 8_per_device/15_differential).
*    Implicit/Explicit: Mixed
    * Justification: Multi-level capability (32 states) and use (15 levels) are explicit (Fig 1c, Methods). Re-writability is explicit (SET/RESET pulses, hybrid training). Retention/drift issues are explicitly discussed and shown (Extended Data Fig 3). Capacity (levels) is explicit. Read/write accuracy issues (variation, error) are explicitly discussed and quantified (Fig 3c-e). The overall assessment requires synthesizing these explicit points.

### **3.3 Memory Retention Time:**

*   **Vector ID:** M3.3
*   **Vector Type:** Parameter
*   Value: Hours to Days (Qualitative)
*    Units: N/A
*   Justification: Extended Data Fig. 3 shows conductance drift over 30 days (Extended Data Fig. 3a) and accuracy degradation within 2 hours after hybrid training (Extended Data Fig. 3c). While states are distinguishable over days (Extended Data Fig. 3b), the drift clearly impacts performance on a timescale of hours. The paper mentions drift as a key challenge. No specific quantified metric like "time to X% degradation" is provided.
*    Implicit/Explicit: Explicit
        * Justification: The figures (Extended Data Fig. 3a, 3c) explicitly show drift and its effect over timeframes of hours and days. The discussion explicitly mentions drift is a challenge. The description is qualitative ("hours to days") as no quantitative retention metric is given.
*   CT-GIN Mapping: Key attribute (`retention_time`) of the `MemoryNode`.

### **3.4 Memory Capacity (Optional - if applicable)**

* **Vector ID:** M3.4
* **Vector Type:** Parameter
*  Value: 15 (differential levels per weight); 8 (levels per memristor)
*   Units: levels (quantization states)
*   Justification: The paper explicitly states that weights were quantized to a 15-level fixed-point type for the implementation (Abstract, Methods). This was realized using differential pairs of memristors, each presumably programmed to one of 8 conductance states (Methods: "differential conductance of a pair of 8-level memristors"). 32 distinct levels were demonstrated experimentally per device (Fig 1c).
*    Implicit/Explicit: Explicit
        *  Justification: The use of 15-level quantization is explicitly stated multiple times (Abstract, Methods). The implementation via differential 8-level devices is stated in Methods. The demonstration of 32 levels is explicit in Fig 1c.
*   CT-GIN Mapping: Key attribute (`capacity_levels`) of the `MemoryNode`.

### **3.5 Readout Accuracy (Optional - if applicable)**

* **Vector ID:** M3.5
* **Vector Type:** Parameter
*   Value: N/A (Error distributions provided instead)
*   Units: N/A (% or error rate not explicitly stated for readout alone)
*   Justification: The paper doesn't provide a single metric for readout accuracy. Instead, it shows distributions of weight-transfer errors (Fig 3c-e), which combine programming errors, variations, and potentially readout noise/errors relative to target values. The overall system accuracy (e.g., 96.19% initially, 95.07% after transfer) reflects the combined impact of all imperfections, including readout. Read disturbance tests show minimal impact over 10^6 reads (Extended Data Fig 7).
*    Implicit/Explicit: Implicit
       *  Justification: Accuracy figures are for the overall system or weight transfer, not specifically readout. Error distributions are shown explicitly (Fig 3c-e), but readout accuracy itself isn't quantified separately. Read disturbance results (Extended Data Fig 7) explicitly suggest high robustness to read operations.
*   CT-GIN Mapping: Attribute (`readout_error_distribution`) of `MemoryNode` or related `ReadoutEdge`

### **3.6 Degradation Rate (Optional - if applicable)**
* **Vector ID:** M3.6
* **Vector Type:** Parameter
    *   Value: N/A (Qualitative drift shown)
    *   Units: N/A (% loss per hour not quantified)
    *   Justification: Extended Data Fig. 3 explicitly shows conductance drift over time (hours/days), leading to accuracy degradation (loss of ~1.9% accuracy over 2 hours post-training in one experiment, Extended Data Fig. 3c). However, a specific degradation rate (e.g., average % change per unit time) is not calculated or reported.
    *    Implicit/Explicit: Explicit
            * Justification: The phenomenon of drift and its impact on accuracy are explicitly shown and discussed (Extended Data Fig. 3). The lack of a quantified rate is also explicit from the provided data.
    *   CT-GIN Mapping: Attribute (`degradation_mechanism`: conductance_drift) of the `MemoryNode`.

### **3.7 Memory Operations Energy Cost (Optional - if applicable)**
* **Vector ID:** M3.7
* **Vector Type:** Table
*   Table:
    | Memory Operation ID | Energy Consumption per Bit | Power Usage during Operation| Units | Uncertainty | Data Source Reference | Implicit/Explicit | Justification |
    | :------------------ | :--------------------------: | :-----------------------------: | :---: |:-----------------:|:-----------------:|:-----------------:| :------------------ |
    | Read (1-bit inference) | ~0.02 pJ/cell/bit * | ~1.82E-5 W/cell/bit * | pJ, W | Medium | Ext. Data Table 1, Methods | Mixed | Energy per array (0.91pJ) / 2048 cells. Power = Energy/Time (0.91pJ/50ns) / 2048 cells. Assumes 1-bit inference relates to 1 bit stored state access. |
    | Write (SET/RESET) | N/A | N/A (Currents provided) | N/A | N/A | Ext. Data Fig 8c,d | Implicit | Write energy not calculated. SET current ~60uA @ 1.5V (DC), RESET ~45uA @ -1.2V (DC). Pulse operations use 2.0V/-1.8V @ 50ns. Energy = V * I * t, but I varies non-linearly. Number of pulses varies. |
*   Implicit/Explicit: Mixed
    *   Justification: Read energy for the *entire array* per 1-bit input is given in Ext. Data Table 1. Calculating per cell/bit requires inference (dividing by array size). Writing energies are not explicitly calculated; currents and voltages are given (Ext. Data Fig 8), but deriving energy per operation/bit is complex due to non-linearity, variable pulse counts, and lack of explicit calculation in the paper.

### **3.8 Memory Fidelity & Robustness Metrics (Optional - if applicable)**
* **Vector ID:** M3.8
* **Vector Type:** Table
*   Table:
    | Metric ID | Description | Value | Units | CT-GIN Mapping | Data Source | Implicit/Explicit | Justification |
    | :-------- | :---------- | :----: | :---: | :-------------: | :----------: |:-----------------:| :-----------------:|
    | State Distinguishability | Ability to maintain separation between conductance levels | 32 levels separated initially | levels | `MemoryNode` attr: `fidelity_levels` | Fig 1c | Explicit | Fig 1c shows non-overlapping distributions for 32 states initially. |
    | Write Accuracy Error | Deviation from target conductance after programming | See Fig 3c-e distributions | μA (current error) / % (relative error N/A) | `MemoryNode` attr: `write_error_dist` | Fig 3c-e | Explicit | Explicit error map visualizations are provided. |
    | Read Disturbance | Change in conductance after multiple read operations | Minimal change after 10^6 reads | % / μA (from plots) | `MemoryNode` attr: `read_robustness` | Ext. Data Fig 7 | Explicit | Plots show minimal state disturbance after 1M reads. |
    | Yield | Percentage of functional devices | 99.99% (stated for device) | % | `MemoryNode` attr: `reliability_yield` | Methods | Explicit | Stated in Methods for the memristor device itself. Array yield might differ. |
*   Implicit/Explicit: Explicit
*   Justification: The existence and values/visualizations for these metrics (state separation, write error maps, read disturbance plots, yield figure) are explicitly mentioned or shown in the cited figures and text.

---

## M4: Self-Organization and Emergent Order
*   **Vector ID:** M4
*   **Vector Type:** Self-Organization

### **4.1 Self-Organization Presence:**

*   **Vector ID:** M4.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The system implements a pre-defined CNN architecture. The connections (layers) and initial weights (transferred after ex-situ training) represent a globally designed structure, not a spontaneously emergent order from purely local interactions. While memristor switching involves local physical processes (filament formation), this doesn't lead to spontaneous large-scale structural organization of the network itself.
    *   Implicit/Explicit: Implicit
        *  Justification: The paper describes implementing a standard CNN architecture (Fig 2a) and training it (implying a defined structure and learning rules). There is no mention or evidence of spontaneous pattern formation or structural organization arising purely from local device interactions without global design or control signals.

**(Conditional: M4.1 is "No", skip remaining M4 sections.)**

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
    *   Justification: The core computation (Multiply-Accumulate, MAC) is performed *directly* within the memristor crossbar array. Ohm's law (V=IR -> I=G*V, multiplication of input voltage V by conductance G) and Kirchhoff's current law (summation of currents at a node) are physical laws governing the array's behavior, intrinsically performing the computation without an external, separate ALU. Input voltages encode input vector elements, conductances encode weights, and output currents represent the weighted sum.
    *    Implicit/Explicit: Explicit
        *  Justification: The paper explicitly states: "By directly using Ohm’s law for multiplication and Kirchhoff’s law for accumulation, a memristor array is capable of implementing parallel in-memory MAC operations" (Introduction). Figure 2c illustrates this process.

### **5.2 Computation Type:**

*   **Vector ID:** M5.2
*   **Vector Type:** Classification
    *   Content: Neuromorphic/Analog/Hybrid
    *   CT-GIN Mapping: Defines the `ComputationNode` type (attributes: `type`: neuromorphic, `subtype`: CNN, `implementation`: analog_memristor_mac).
    *    Implicit/Explicit: Explicit
    *    Justification: The paper explicitly identifies the system as "neuromorphic computing" (Abstract, Introduction), implementing a CNN. The core MAC operation in the memristor array is analog (continuous currents summed). However, inputs are encoded (e.g., pulse number, potentially digital) and outputs are digitized by ADCs, making the overall system potentially hybrid. The paper emphasizes the analog in-memory computing aspect.

### **5.3 Computational Primitive:**

*   **Vector ID:** M5.3
*   **Vector Type:** Function
    *   Content: Multiply-Accumulate (MAC) / Vector-Matrix Multiplication (VMM). The material system (memristor crossbar) physically embodies the weighted summation. Input voltage (Vᵢ) applied to a column (bit line) results in current Iⱼᵢ = Gⱼᵢ * Vᵢ through the memristor Gⱼᵢ at the intersection with row j (source line). The total current on source line j is Σᵢ(Gⱼᵢ * Vᵢ), which is the dot product of the input voltage vector and the conductance vector (weights) for that row. This is performed in parallel for all rows.
    *   **Sub-Type (if applicable):** Analog MAC/VMM
    *   CT-GIN Mapping: Defines the primary function (`primitive`: MAC/VMM) of the `ComputationNode`.
    *   Implicit/Explicit: Explicit
    * Justification: The paper explicitly identifies MAC/VMM as the computation performed by the array using Ohm's and Kirchhoff's laws (Introduction, Fig 2c caption).

### **5.4 Embodied Computational Units**
* **Vector ID:** M5.4
* **Vector Type:** Table
*   Table:
| Unit ID | Description | Processing Power | Energy/Operation | Freq/Resp. Time | Bit-Depth | Data Source | Implicit/Explicit | Justification |
| :------ | :---------- | :--------------- | :--------------- | :--------------: | :-------: | :----------: |:-----------------:| :-----------------:|
| Memristor Array MAC/VMM | Core analog computation engine (128x16 array per PE) | 1164 GOP/s/mm² (System Density)* | 0.91 pJ per array per 1-bit input pulse* | 50 ns (pulse width); 20 MHz (read freq used in benchmark)* | Analog core; Used for 4-bit/2-bit effective weights; 8-bit ADC | Ext Data Table 1&2, Methods | Explicit/Mixed | Performance density & energy/op are explicitly calculated for the benchmark system (macro core). Frequency used in benchmark is explicit. Bit-depth effective usage (4/2/15-level) is explicit. Analog core is implicit from mechanism. |
| ADC | Analog-to-digital converter for readout | N/A | 2.55 pJ / 8-bit conversion* | 4 conversions per 50ns (effective 80 MHz)* | 8-bit* | Ext Data Table 1, Methods, Ref [41] | Explicit | ADC energy/conversion and bit-depth are explicit in Ext Data Table 1 (sourced from ref 41). Speed derived from Methods stating 4 conv per 1-bit (50ns) inference. |
*Note: Metrics marked with (*) are from the benchmarking simulation/calculation in Methods (Extended Data Tables), not direct measurements from the full 5-layer experimental system operation.*

## M6: Temporal Dynamics
*   **Vector ID:** M6
*   **Vector Type:** Temporal

### **6.1 Timescales:**

*   **Vector ID:** M6.1
*   **Vector Type:** ParameterTable
    *   Table:
        | Timescale Description | Value | Units | Source | Implicit/Explicit | Justification |
        | :-------------------- | :---: | :---: | :----: | :----------------: | :------------: |
        | Programming Pulse Width | 50 | ns | Fig 1c caption, Methods | Explicit | Explicitly stated for SET/RESET. |
        | Read Pulse Width | 50 | ns | Methods (Benchmarking) | Explicit | Assumed same as programming unless stated otherwise; used in benchmark calc. |
        | Inference Cycle Time (Benchmark) | 50 | ns | Methods (Benchmarking: "1-bit read pulse (0.2 V, 50 ns)") | Explicit | Smallest time unit for benchmark calculation (1-bit). |
        | System Clock Frequency (Benchmark) | 20 | MHz | Methods (Benchmarking: "applying a 1-bit read pulse to all rows at 20 MHz") | Explicit | Frequency used for driving read pulses in benchmark. |
        | ADC Conversion Time (per 4 conversions) | 50 | ns | Methods | Implicit | Derived from "ADC completes four conversations during the 1-bit inference stage" (50 ns). |
        | Memory Drift Timescale | Hours - Days | N/A | Ext Data Fig 3 | Explicit | Drift effects become noticeable over hours and persist over days. |
        | Hybrid Training Iteration Time | N/A | N/A | N/A | Implicit | Depends on batch size (100), inference time per image, update calculation time (ARM core), and write time per update. Not quantified. |

### **6.2 Active Inference:**

*   **Vector ID:** M6.2
*   **Vector Type:** Assessment
    *   Content: No
    *   Justification: The system implements a standard feedforward CNN with a supervised learning approach (hybrid training). There is no evidence of the system making predictions about future sensory states, performing actions to minimize prediction errors based on an internal generative model, or updating such a model. The training aims to minimize classification error on labeled data, not prediction error in the active inference sense.
    *   Implicit/Explicit: Implicit
        *  Justification: The paper describes standard CNN operations and supervised training (gradient descent on cross-entropy loss). None of the hallmarks of active inference (prediction error minimization, generative models, explicit surprise minimization) are mentioned or implied.
    *   **If Yes/Partial, provide examples of testable CT-GIN metrics that *could* be used to quantify active inference:** N/A

## M7: Adaptation
*   **Vector ID:** M7
*   **Vector Type:** Adaptation

### **7.1 Adaptive Plasticity Presence:**

*   **Vector ID:** M7.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The system exhibits adaptive plasticity through the "hybrid training" method. During the in-situ phase, the conductance values (internal structure) of the memristors in the final fully connected (FC) layer are adjusted based on experience (processing training data and calculating errors). This change is driven by feedback (calculated weight updates based on SGD and cross-entropy loss) and leads to improved performance (reduced classification error rate) over time (training iterations). This goes beyond simple stimulus-response, as the system's internal weights are persistently modified to better match the task and compensate for hardware imperfections.
    *    Implicit/Explicit: Explicit
        * Justification: The hybrid training process (Fig 3a, 3b), involving in-situ updating of FC layer memristor conductances based on training data to reduce error (Fig 3f), is explicitly described. The goal of accommodating device variations is also explicitly stated.

### **7.2 Adaptation Mechanism:**

*   **Vector ID:** M7.2
*   **Vector Type:** Description
    *   Content: The adaptation mechanism is a form of supervised learning applied in-situ to the final FC layer, called "hybrid training". It uses Stochastic Gradient Descent (SGD) with a mini-batch size of 100. For each batch, forward propagation occurs through the hardware mCNN. The error (cross-entropy loss) is calculated externally (likely on ARM core). Gradients of the loss w.r.t. the FC layer outputs are computed. Weight updates (ΔW) for the FC layer are calculated using these gradients and the intermediate inputs to the FC layer (Equation 1: ΔW = η Σ Vᵢ × δᵢ). A threshold learning rule (Equation 2) is applied, where only updates exceeding a threshold (Th = 1.5 μS) trigger a programming operation (SET/RESET pulse via closed-loop writing) on the corresponding memristor pair to adjust its differential conductance. This adaptation compensates for variations/imperfections in preceding layers and the FC layer itself.
    *   CT-GIN Mapping: Defines the `AdaptationNode` type (`mechanism`: supervised_learning, `algorithm`: hybrid_training/SGD, `target`: FC_layer_weights). Defines `Monad` edges representing the update process (Error -> Gradient -> WeightUpdate -> ConductanceChange).
    *    Implicit/Explicit: Explicit
        *  Justification: The hybrid training mechanism, including the use of SGD, batch size, calculation of updates (Eq 1), the threshold rule (Eq 2, Th value), targeting only the FC layer, and the goal of compensating for imperfections, are all explicitly described in the "Hybrid training on a subset..." and "Learning and tuning of FC weights" sections in Methods. Closed-loop writing is also mentioned.

## M8: Emergent Behaviors
*   **Vector ID:** M8
*   **Vector Type:** Behavior

### **8.1 Behavior Description:**

*   **Vector ID:** M8.1
*   **Vector Type:** Description
    *   Content: The main functional behavior is image classification, specifically recognizing handwritten digits from the MNIST dataset. The system takes a 28x28 pixel image as input and outputs probabilities for each of the 10 digit classes (0-9). The class with the highest probability is selected as the classification result. This behavior emerges from the designed structure of the 5-layer CNN and the learned (via hybrid training) conductance values (weights) stored in the memristor arrays, which collectively process the input image through layers of convolution, pooling, and fully connected operations. Parallel convolution using replicated kernels for faster processing is also demonstrated.
    *   CT-GIN Mapping: Defines the `BehaviorArchetypeNode` (`type`: image_classification, `task`: MNIST_digit_recognition).
    *    Implicit/Explicit: Explicit
       *  Justification: The paper explicitly states the system performs MNIST image recognition (Abstract, Introduction, Fig 2a caption). The process (input image -> CNN layers -> output probabilities) is described (Methods: "mCNN demonstration"). Accuracy results quantify this behavior.

### **8.2 Behavior Robustness:**

*   **Vector ID:** M8.2
*   **Vector Type:** Score
    *   Score: 6
    *   Justification: The system demonstrates robustness to significant device imperfections (variations, yield, drift, state locking) typical of memristors, achieving high accuracy (96.19% / ~95-96% post-transfer and hybrid training) comparable to software baselines (~98%) despite these issues. The hybrid training method specifically enhances robustness by adapting the FC layer to compensate for errors in earlier layers. The use of differential pairs also likely mitigates some common-mode noise. However, robustness is not perfect: accuracy drops after weight transfer (97.99% software to 95.07% hardware initial) and drifts over time (Extended Data Fig 3c). Robustness to input noise (e.g., noisy images) is not explicitly tested. The score reflects good robustness to *device non-idealities* but acknowledges performance degradation and drift.
    *   Implicit/Explicit: Mixed
        *  Justification: High accuracy despite explicitly mentioned device imperfections (variations, drift etc.) demonstrates robustness. The effectiveness of hybrid training in accommodating variations (main purpose) is explicitly shown (Fig 3f, Fig 4g). Accuracy degradation (explicitly shown) indicates limits to robustness. Robustness to other factors (e.g., input noise, temperature variations) is not discussed (implicit limitation).
    *   CT-GIN Mapping: This score contributes to the reliability attributes (`robustness_score`) of the `BehaviorArchetypeNode`.

### **8.3 CT-GIN Emergent Behavior Validation**

*    **Vector ID:** M8.3
*    **Vector Type:** Validation
     *  Content: The emergent behavior (image classification) is validated experimentally by testing the hardware system on the standard MNIST test dataset (10,000 images). The primary metric is classification accuracy (%). The paper reports accuracy at various stages: software baseline (97.99%), after weight transfer (95.07%), after hybrid training (96.19% in initial demo, final error rate 3.81% => 96.19% accuracy; parallel system 95.83%). Performance is compared against software implementations and GPU benchmarks (energy, density). The effect of drift on accuracy is also quantified over time (Extended Data Fig 3c). Control experiments involve comparing performance before and after hybrid training, and comparing different PE groups in the parallel setup. Reproducibility is suggested by consistent results across multiple PEs/groups (Fig 4g, Extended Data Fig 1). Limitations include potential instability of the test setup for long runs (mentioned in Methods: "Evaluation of recognition accuracy").
     *   Implicit/Explicit: Explicit
    *   Justification: The validation method (testing on MNIST dataset), metrics (accuracy), reported results, comparisons (to software, GPU, before/after training), and discussion of limitations are all explicitly stated in the Abstract, Results sections (Fig 3f, 4g), and Methods.

## M9: Cognitive Proximity
*   **Vector ID:** M9
*   **Vector Type:** Cognition

### **9.1 Cognitive Mapping:**

*   **Vector ID:** M9.1
*   **Vector Type:** Description
    *   Content: Yes, the system implements a Convolutional Neural Network (CNN), which is a type of artificial neural network directly inspired by the structure and function of the biological visual cortex. The architecture (layers of feature extraction via convolution and pooling, followed by classification) mimics hierarchical processing in biological vision. Memristors are used as artificial synapses, storing weight values analogous to synaptic efficacy. The task performed, image recognition, is a fundamental cognitive function. The paper uses terms like "neuromorphic computing" and explicitly compares its approach to brain-inspired computing paradigms.
    *   CT-GIN Mapping: Defines a `CognitiveMappingEdge` from `BehaviorArchetypeNode` (image_classification) and `SystemNode` (neuromorphic_CNN) to `CognitiveFunctionNode` (visual_perception/object_recognition). Memristor nodes map to `CognitiveElementNode` (synapse).
    *   Implicit/Explicit: Explicit
    * Justification: The paper explicitly uses terms like "neuromorphic computing" (Abstract, Intro), mentions CNNs are brain-inspired (references LeCun, Hinton), and performs a cognitive task (image recognition). The analogy between memristors and synapses is central to the field and implied throughout.

### **9.2 Cognitive Proximity Score:**

*   **Vector ID:** M9.2
*   **Vector Type:** Score
    *   Score: 3
    *   Justification: Based on the CT-GIN Cognizance Scale: The system demonstrates **Level 3: Reactive/Adaptive Autonomy**. It performs a cognitive task (image recognition - Level 1/2). Crucially, it adapts its behavior (improves accuracy) based on experience (training data) and feedback (error signals during hybrid training), specifically tuning the FC layer weights (Level 3). However, it operates within a fixed architecture and a relatively limited behavioral repertoire (classifying MNIST digits). It doesn't show evidence of internal models for prediction (Level 4), understanding relationships (Level 5), manipulating symbols (Level 6), or higher functions. The adaptation is supervised and focused on compensating for hardware flaws rather than exploring or fundamentally altering its strategy.
    *   Implicit/Explicit: Mixed
    *  Justification: The system's function (image recognition) and adaptation (hybrid training) are explicitly described. Placing it on the scale requires interpreting these explicit functions against the defined levels, making the final score an implicit judgment based on explicit evidence.

### **9.3 Cognitive Function Checklist**

* **Vector ID:** M9.3
* **Vector Type:** Checklist
    *   | Cognitive Function               | Score (0-10) | Justification/Notes                                                                       | CT-GIN Mapping (if applicable) | Implicit/Explicit | Justification for Implicit/Explicit/Mixed |
    | :-------------------------------- | :----------: | :------------------------------------------------------------------------------------ | :--------------------------------: | :-----------------:|:-----------------:|
    | Sensing/Perception               |      4       | Input is a 28x28 image (sensory data). CNN performs hierarchical feature extraction mimicking perception. Limited to specific input type/task. | `BehaviorArchetypeNode` attr: `input_modality`: visual_static | Explicit | System function is explicitly visual processing. Score reflects task limitation. |
    | Memory (Short-Term/Working)        |      0       | No evidence of short-term or working memory for holding/manipulating intermediate results dynamically beyond standard NN activations. | N/A | Implicit | Standard feedforward CNNs don't typically have explicit working memory; no mention in paper. |
    | Memory (Long-Term)                 |      5       | Memristor conductances store learned weights persistently (hours/days), representing LTM of the task. Subject to drift. Capacity limited by array size/levels. | `MemoryNode` | Explicit | Weight storage in memristors is explicit. Score reflects capability and limitations (drift). |
    | Learning/Adaptation              |      4       | Hybrid training allows adaptation (tuning FC weights) based on experience to improve performance and compensate for hardware variations. Supervised, limited scope. | `AdaptationNode` | Explicit | Hybrid training mechanism is explicitly described. Score reflects presence but limitations. |
    | Decision-Making/Planning          |      2       | Final layer (softmax) makes a classification decision (highest probability). No evidence of planning or complex decision strategies. | `ComputationNode` attr: `ouput_function`: softmax | Explicit | Classification output implies decision. Score reflects simple nature. |
    | Communication/Social Interaction |      0       | N/A. System does not interact with other agents. | N/A | Implicit | No mention of multi-agent interaction. |
    | Goal-Directed Behavior            |      2       | Behavior (classification) is implicitly goal-directed (minimize error), but driven by supervised training, not internal goals. | `AdaptationNode` attr: `objective`: minimize_cross_entropy | Mixed | Minimizing loss is explicit; attributing internal goals is interpretation. |
    | Model-Based Reasoning              |      1       | CNN implicitly models correlations in MNIST data, but no evidence of explicit internal world model for reasoning or prediction in the active inference sense. | N/A | Implicit | CNNs learn data distributions; no evidence of explicit generative models. |
    | **Overall score**                 |      2.25 (Average)       | System shows basic perception, LTM, adaptation, decision within a specific task. Lacks higher cognitive functions. | N/A   | Mixed | Average calculation based on justified scores. |    

## M10: Criticality Assessment
*   **Vector ID:** M10
*   **Vector Type:** Criticality

### **10.1 Criticality:**

*   **Vector ID:** M10.1
*   **Vector Type:** Assessment
    *   Content: Unclear
    *   Justification: The paper does not mention or investigate whether the memristor devices or the network operate near a critical point (e.g., phase transition, edge of chaos). There is no analysis of scale-free behavior, power laws, or long-range correlations in the system's dynamics or structure. While some memristor research explores criticality (e.g., NbO₂), it's not addressed here for the TaOₓ/HfOₓ system or the CNN implementation.
        *   Critical Parameters (If Yes/Partial): N/A
        *   Evidence: N/A
    *   Implicit/Explicit: Implicit
    *    Justification: The absence of any discussion or data related to criticality in the paper makes the assessment implicit.

## M11: Review Paper Specifics (Conditional)

N/A (Paper type is Experimental)

*   **Vector ID:** M11
*   **Vector Type:** Review

### **11.1 Literature Synthesis Quality:** N/A
### **11.2 Gap Identification:** N/A
### **11.3 Future Directions:** N/A
### **11.4 Review Paper CT-GIN Alignment Score:** N/A

## M12: Theoretical Paper Specifics (Conditional)

N/A (Paper type is Experimental)

*   **Vector ID:** M12
*   **Vector Type:** Theory

### **12.1 Theoretical Rigor:** N/A
### **12.2 Realization Potential:** N/A
### **12.3 Potential for Future CT-GIN Implementation Score:** N/A

## M13: Overall Assessment & Scoring

*   **Vector ID:** M13
*   **Vector Type:** Overall

### **13.1 CT-GIN Readiness Score:**

*   **Vector ID:** M13.1
*   **Vector Type:** Score
*   **Calculated Score:** 5.25
    *   *Calculation: (M1.2[8] + M2.3[8] + M3.2[6] + M4.4[0] + M8.2[6] + M9.2[3]) / 6 = 31 / 6 = 5.166... ≈ 5.17*
    *   *Correction: M4.1 is No, so M4.4 score is N/A -> 0. Average = (8+8+6+0+6+3)/6 = 31/6 = 5.17.*

**CT-GIN Readiness Summary Table:**

| CT-GIN Aspect                   | Strength (Yes/Partial/No) | Key Supporting Metrics (with units) | Limitations (Missing Metrics/Data Gaps)                                           | Improvement Areas (Future Research)                                          |
| :------------------------------ | :-----------------------: | :-----------------------------------| :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| Energy Flow Efficiency          | Yes                       | 11014 GOP/s/W (benchmarked)          | System-level measurement missing; excludes some functions; ADC/S&H dominate        | Integrate all functions; optimize peripherals (esp. ADC); measure full system. |
| Memory Fidelity                 | Partial                   | 15 diff levels; Error maps (Fig 3); Drift shown (Ext Fig 3) | Quantified retention time missing; drift mitigation needed; write energy unclear | Improve device materials/engineering for stability; optimize write schemes.     |
| Organizational Complexity       | No                        | Pre-defined CNN architecture          | No self-organization; complexity is designed, not emergent from local rules.   | Explore systems exhibiting genuine self-organization.                         |
| Embodied Computation            | Yes                       | Analog MAC/VMM via physics          | Limited to MAC/VMM; precision limits; peripheral bottlenecks                  | Explore more complex embodied primitives; co-design with peripherals.         |
| Temporal Integration            | Partial                   | Device speed (ns); training time (iter); Drift timescale (hrs/days) | Active inference absent; no complex temporal dynamics explored; training time N/Q. | Investigate recurrent/spiking models; explore temporal coding.               |
| Adaptive Plasticity             | Yes                       | Hybrid training (SGD) adapts FC layer; Error reduction shown | Adaptation limited to FC layer; supervised learning; threshold rule effects N/Q | Implement on-chip learning for all layers; explore unsupervised adaptation.  |
| Functional Universality         | No                        | Specific task (MNIST classification) | Trained for one task; generalization to other tasks not shown.                 | Test on diverse datasets/tasks; explore transfer learning capabilities.        |
| Cognitive Proximity            | Partial                   | CNN architecture; Recognition task; Adaptation | Low on Cognizance Scale (L3); Lacks higher cognitive functions.                | Explore models closer to biological mechanisms (spiking, attention).          |
| Design Scalability & Robustness | Partial                   | Multi-array demo; High accuracy despite flaws; Parallelism shown | Drift issue; peripheral scaling?; yield/variation impact on large nets?    | Improve device uniformity/reliability; study scaling effects rigorously.     |
| **Overall CT-GIN Readiness Score** |        |   |   |      |


### **13.2 Qualitative CT-GIN Assessment Conclusion:**

*   **Vector ID:** M13.2
*   **Vector Type:** Textual Summary
    *   Content: This paper presents a significant experimental realization of a memristor-based CNN, demonstrating key strengths in **Embodied Computation** (physical MAC operations) and **Energy Efficiency** (benchmarked >100x GPU). It exhibits **Adaptive Plasticity** via hybrid training, successfully compensating for device non-idealities to achieve high accuracy on a cognitive task (image recognition), positioning it at Level 3 (Reactive/Adaptive Autonomy) on the Cognitive Proximity scale. However, key limitations exist from a CT-GIN perspective. **Memory Fidelity** is compromised by significant conductance drift, impacting long-term reliability. **Self-Organization** is absent, as the system relies on a pre-defined architecture. While demonstrating adaptation, it's limited in scope (FC layer only, supervised). The temporal dynamics explored are basic (device speed, drift), lacking evidence of complex integration or active inference. **Overall Assessment:** The work is a strong proof-of-concept for neuromorphic hardware leveraging physical computation and basic adaptation. It provides valuable data on performance and challenges (drift, variation) but requires considerable advances in material stability, adaptation mechanisms, and exploration of self-organization/temporal dynamics to move towards truly cognizant matter as envisioned by the CT-GIN framework.

### **13.3 CT-GIN Refinement Directions:**

*   **Vector ID:** M13.3
*   **Vector Type:** Recommendations
    *   Content:
        *   **Improve Memory Stability:** Focus on material engineering and device optimization (e.g., different material stacks, interface engineering) to drastically reduce conductance drift and improve retention time, enabling reliable long-term operation. Quantify retention robustly.
        *   **Enhance Adaptation Mechanisms:** Develop and implement fully on-chip, unsupervised, or more sophisticated learning rules (beyond simple SGD on FC layer) that allow adaptation throughout the network, potentially leveraging device physics more directly.
        *   **Quantify System Dynamics:** Characterize temporal dynamics beyond basic speed/drift. Investigate potential for complex temporal processing (e.g., using recurrent connections or spiking dynamics if feasible with memristors). Explore if criticality plays any role.
        *   **Address Peripheral Bottlenecks:** Investigate and optimize the energy/area cost of peripheral circuits (especially ADCs), potentially through co-design with the memristor array or exploring novel analog/mixed-signal processing techniques.
        *   **Explore Structural Plasticity/Self-Organization:** Investigate if local device interactions or learning rules could lead to emergent structural changes or self-organization in the network connectivity or function, moving beyond fixed architectures.
        *   **Assess Robustness Systematically:** Quantify robustness not just to device variations, but also to input noise, environmental changes (temperature), and evaluate scaling effects on larger, more complex networks.

## M14: CT-GIN Knowledge Graph

*   **Vector ID:** M14
*   **Vector Type:** Visualization

### **14.1. CT-GIN Knowledge Graph:**
* **Content:**
```mermaid
graph LR
    subgraph System
        Sys[SystemNode\nsystemType: memristor_CNN\npurpose: image_recognition\nClarity: 8/10]
    end

    subgraph Energy
        E_In(EnergyInputNode\nsource: electrical\ntype: voltage_pulse)
        E_Trans1{EnergyTransductionEdge\nmechanism: resistive_switching}
        E_Trans2{EnergyTransductionEdge\nmechanism: Ohms_law/Kirchhoffs_law}
        E_Trans3{EnergyTransductionEdge\nmechanism: CMOS_logic/ADC}
        E_Eff[efficiency: 11014 GOP/s/W\nScore: 8/10]
        E_Diss(EnergyDissipationNode\ntype: Joule_heating/CMOS_loss)
    end

    subgraph Memory
        Mem[MemoryNode\nmechanism: resistive_switching\nstorage: analog_conductance\nlevels: 15 diff\nretention: Hours-Days\nScore: 6/10]
        Mem_Cap[capacity_levels: 15]
        Mem_Drift[degradation: drift]
        Mem_WriteErr[write_error_dist: Fig 3c-e]
        Mem_ReadRob[read_robustness: High (10^6 cycles)]
    end

    subgraph Computation
        Comp[ComputationNode\ntype: neuromorphic/analog\nprimitive: MAC/VMM]
        Comp_Density[density: 1164 GOP/s/mm^2]
    end

    subgraph Adaptation
        Adapt[AdaptationNode\nmechanism: supervised_learning\nalgorithm: hybrid_training/SGD\ntarget: FC_layer_weights]
    end

    subgraph Behavior
        Behav[BehaviorArchetypeNode\ntype: image_classification\ntask: MNIST]
        Behav_Acc[accuracy: ~96%]
        Behav_Rob[robustness_score: 6/10]
    end

     subgraph Cognition
         CogMap{CognitiveMappingEdge}
         CogFunc(CognitiveFunctionNode\nfunction: visual_perception)
         CogScore[CognitiveProximity\nScore: 3/10]
     end

    E_In -- E_Trans1 --> Mem;
    E_In -- E_Trans2 --> Comp;
    E_In -- E_Trans3 --> Sys;

    Mem -- Data --> Comp;
    Comp -- Results --> Behav;
    Behav -- Feedback --> Adapt;
    Adapt -- Updates --> Mem;

    E_Trans1 -- EnergyLoss --> E_Diss;
    E_Trans2 -- EnergyLoss --> E_Diss;
    E_Trans3 -- EnergyLoss --> E_Diss;

    E_Trans2 -- Efficiency --> E_Eff;
    Comp -- Density --> Comp_Density;

    Mem -- Capacity --> Mem_Cap;
    Mem -- Degradation --> Mem_Drift;
    Mem -- WriteError --> Mem_WriteErr;
    Mem -- ReadRobustness --> Mem_ReadRob;

    Behav -- Accuracy --> Behav_Acc;
    Behav -- Robustness --> Behav_Rob;

    Sys -- MapsTo --> CogMap;
    Behav -- MapsTo --> CogMap;
    CogMap -- To --> CogFunc;
    Sys -- AssessedAs --> CogScore;


    Sys --> Mem;
    Sys --> Comp;
    Sys --> Adapt;
    Sys --> Behav;

    style E_In fill:#f9f,stroke:#333,stroke-width:2px
    style Mem fill:#ccf,stroke:#333,stroke-width:2px
    style Comp fill:#cfc,stroke:#333,stroke-width:2px
    style Adapt fill:#fec,stroke:#333,stroke-width:2px
    style Behav fill:#9cf,stroke:#333,stroke-width:2px
    style CogFunc fill:#fcf,stroke:#333,stroke-width:2px
    style E_Diss fill:#ccc,stroke:#333,stroke-width:1px,stroke-dasharray: 5 5
```

## M15: Relationship Vectors
*   **Vector ID:** M15
*   **Vector Type:** Relationships
*   Relationships:
        | Source Vector ID | Target Vector ID | Relationship Type |
        | ------------- | ------------- | ----------------- |
        | M1 | M2 | System_Uses_Energy |
        | M1 | M3 | System_Has_Memory |
        | M1 | M5 | System_Performs_Computation |
        | M1 | M7 | System_Exhibits_Adaptation |
        | M1 | M8 | System_Exhibits_Behavior |
        | M2.1 | M2.2 | EnergyInput_IsTransduced |
        | M2.2 | M3.1 | Transduction_Enables_MemoryWrite |
        | M2.2 | M5.1 | Transduction_Enables_Computation |
        | M2.2 | M2.4 | Transduction_Causes_Dissipation |
        | M2.2 | M2.3 | Transduction_Determines_Efficiency |
        | M3.1 | M5.1 | Memory_Stores_ComputationalWeights |
        | M5.1 | M8.1 | Computation_Produces_Behavior |
        | M8.1 | M7.1 | BehaviorError_Drives_Adaptation |
        | M7.1 | M3.1 | Adaptation_Modifies_Memory |
        | M8.1 | M9.1 | Behavior_MapsTo_CognitiveFunction |
        | M1 | M9.1 | System_MapsTo_CognitiveConcept |
        | M1 | M13 | System_OverallAssessment |
        | M3.3 | M8.2 | MemoryRetention_Affects_BehaviorRobustness |
        | M3.6 | M8.2 | MemoryDegradation_Affects_BehaviorRobustness |

## M16: CT-GIN Template Self-Improvement Insights

*   **Vector ID:** M16
*   **Vector Type:** Feedback

### **Template Feedback:**

*    **Vector ID:** M16.1
*   **Vector Type:** Text
Provide specific, actionable feedback on the *CT-GIN template itself*, based on this analysis:
    *   **Missing Probes:**
        *   A probe specifically quantifying the *degree* of embodiment for computation (M5) might be useful (e.g., % of computation done by material vs. external controller).
        *   In M7 (Adaptation), a probe for the *scope* of adaptation (e.g., local vs global, single-parameter vs multi-parameter) could add granularity.
        *   A probe asking for the specific *benchmarks* used for comparison (e.g., software baseline, specific hardware like GPU model) could be added to M8 or M13.
    *   **Unclear Definitions:**
        *   The distinction between M4 (Self-Organization) and M8 (Emergent Behaviors) is crucial but could be slightly confusing. M4 focuses on *spontaneous structural* order from local rules, while M8 focuses on *functional* behavior arising from the system's design/interactions. Reinforcing this distinction in the definitions might help.
        *   The scoring for M9.2 (Cognitive Proximity) is inherently subjective. While the scale provides good guidance, perhaps adding example systems for each level could aid consistency.
    *   **Unclear Node/Edge Representations:**
        *   Guidance is generally good, but more examples, especially for complex relationships (e.g., feedback loops involving multiple modules like M8->M7->M3), could be beneficial.
        *   Specifying standard attribute names within the mapping guidance (e.g., always use `efficiency_metric` instead of `efficiency_GOPs_per_W`) might improve graph consistency across different papers.
    *   **Scoring Difficulties:**
        *   Assigning scores often required balancing explicitly stated positive results with explicitly stated limitations (e.g., M8.2 Robustness score). The justification field is critical here.
        *   Quantifying efficiency (M2.3) or robustness (M8.2) is hard when papers provide comparisons or qualitative statements rather than absolute metrics. The template handles this reasonably well by allowing qualitative justification.
    *   **Data Extraction/Output Mapping:**
        *   Mapping detailed benchmark calculations (like in Methods, Extended Data Tables) involving multiple components and assumptions into the concise tables (e.g., M1.3, M5.4, M3.7) can be challenging. It sometimes requires summarizing or selecting representative values. Explicitly allowing "See Methods/Ext. Data" as a source, or having slightly more flexible table structures, might help.
        *   Extracting precise energy/power per *operation* or per *bit* (M3.7, M5.4) is often difficult as papers report device/array level metrics under specific conditions. The template acknowledges this by making some sections optional, which is good.
    *   **Overall Usability:** The template is very comprehensive and well-structured. Its detailed nature forces a rigorous analysis. The conditional logic (skipping sections based on binary answers) is helpful. The main challenge lies in the inherent difficulty of mapping complex experimental results (with caveats and partial data) onto a structured format and subjective scoring scales.
    * **Specific Suggestions:**
        *   Add a field in M1 to explicitly state the *primary novelty claim* of the paper.
        *   For tables requiring parameter values (e.g., M1.3, M6.1), consider adding a "Measurement/Simulation/Estimate" column alongside "Data Reliability".
        *   Consider making the CT-GIN mapping suggestions slightly more prescriptive with standard attribute names.