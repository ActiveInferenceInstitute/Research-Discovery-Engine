# Differential sensing with arrays of de novo designed peptide assemblies

__Paper Type:__ Hybrid

## M1: System Overview & Implementation
*   **Vector ID:** M1
*   **Vector Type:** Overview

### **1.1 System Description**

*   **Vector ID:** M1.1
*   **Vector Type:** Description
    *   Content: The system is a differential sensor array composed of 46 unique, de novo designed self-assembling α-helical barrel (αHB) peptides, plus two controls. These αHBs form channels of varying sizes, shapes, and chemistries. The channels accommodate an environment-sensitive fluorescent dye (1,6-diphenyl-1,3,5-hexatriene, DPH). The purpose is to identify analytes (small biomolecules, complex mixtures like drinks or biological samples) by challenging the dye-loaded array with the analyte. Analyte binding causes differential displacement of the dye across the array members, resulting in a unique fluorimetric fingerprint. This fingerprint is then analyzed using machine learning (ML) models to classify the analyte or mixture. The system components are the de novo peptides, the DPH dye, buffer solutions, analytes, multi-well plates, liquid handling robots, a fluorescence plate reader, and ML algorithms for data analysis.
    *   CT-GIN Mapping: `SystemNode` attributes: `systemType`: SensorArray, `domain`: Biochemistry/MaterialsScience, `mechanism`: CompetitiveBinding/FluorescenceDisplacement, `components`: [`PeptideAssemblyNode`, `DyeNode`, `AnalyteNode`, `MLClassifierNode`], `purpose`: AnalyteDiscrimination/Classification
    *   Implicit/Explicit: Explicit
        *  Justification: The paper's abstract, introduction (Fig. 1), and Results section explicitly describe the components, mechanism (dye displacement), and purpose (differential sensing, analyte discrimination).

### **1.2 Implementation Clarity**

*   **Vector ID:** M1.2
*   **Vector Type:** Score
    *   Score: 9
    *   Justification: The paper provides detailed methods for peptide synthesis, purification, characterization (HPLC, MALDI-TOF, CD, AUC, X-ray crystallography), array preparation (concentrations, buffers, liquid handling), analyte preparation, fluorescence measurements (plate reader settings), and ML analysis (algorithms used, cross-validation, feature selection). Peptide sequences and characterization data are provided in supplementary files. Minor details like specific liquid handling parameters might be omitted, but overall, the implementation is very clearly described and reproducible.
    *   Implicit/Explicit: Explicit
        * Justification: The Methods section and Supplementary Information provide explicit details on experimental setup and procedures.

### **1.3 Key Parameters**

*   **Vector ID:** M1.3
*   **Vector Type:** ParameterTable
    *   Table:
        | Parameter Name | Value | Units | Source (Fig/Table/Section) | Implicit/Explicit | Data Reliability (High/Medium/Low) | Derivation Method (if Implicit) |
        | :------------- | :---: | :---: | :-----------------------: | :-----------------: | :-----------------------------: | :-------------------------------: |
        | Peptide Concentration (Final) | 10 | µM | Methods (α-Helical barrel sensor array assay) | Explicit | High | N/A |
        | DPH Concentration (Final) | 1 | µM | Methods (α-Helical barrel sensor array assay) | Explicit | High | N/A |
        | Analyte Concentration (AA/CHO) | 10 | mM | Methods (α-Helical barrel sensor array assay) | Explicit | High | N/A |
        | Analyte Concentration (FA) | 10 | µM | Methods (α-Helical barrel sensor array assay) | Explicit | High | N/A |
        | Fluorescence Excitation λ | 350±15 | nm | Methods (α-Helical barrel sensor array assay) | Explicit | High | N/A |
        | Fluorescence Emission λ | 450±20 | nm | Methods (α-Helical barrel sensor array assay) | Explicit | High | N/A |
        | Number of αHB types in array | 46 (+2 controls) | N/A | Fig. 1, Fig. 2 | Explicit | High | N/A |

    *   **Note:** Table lists key operational parameters for the sensing assay.

## M2: Energy Flow
*   **Vector ID:** M2
*   **Vector Type:** Energy

### **2.1 Energy Input**

*   **Vector ID:** M2.1
*   **Vector Type:** Input
    *   Content: Two primary energy inputs: 1) Chemical potential energy related to the binding affinities between the dye, analytes, and αHB channels. 2) Optical energy from the plate reader's excitation light source used to induce fluorescence.
    *   Value: N/A (Binding energies not quantified); Excitation wavelength provided.
    *   Units: N/A (Binding energies); nm (Wavelength).
    *   CT-GIN Mapping: `EnergyInputNode`: attributes - `source`: ChemicalBinding/OpticalExcitation, `type`: ChemicalPotential/PhotonEnergy
    *   Implicit/Explicit: Mixed
        *  Justification: Optical excitation wavelength is explicit. Chemical binding energy as an input driving the displacement is implicit based on the description of competitive binding, although not quantified.

### **2.2 Energy Transduction**

*   **Vector ID:** M2.2
*   **Vector Type:** Transduction
    *   Content: 1) Chemical potential energy drives the competitive binding process: higher affinity analytes displace lower affinity DPH dye from the αHB channels. 2) Absorbed optical energy (excitation light at 350 nm) by the bound DPH is transduced into emitted optical energy (fluorescence at 450 nm). Dye displacement reduces the amount of DPH in the hydrophobic channel environment, decreasing fluorescence intensity upon excitation.
    *   CT-GIN Mapping: `EnergyTransductionEdge`: attributes - `mechanism`: CompetitiveBinding/Fluorescence, `from_node`: ChemicalPotential/PhotonEnergy, `to_node`: DyeDisplacement/FluorescenceEmission
    *   Implicit/Explicit: Mixed
        *  Justification: Fluorescence excitation/emission is explicit. The role of chemical potential in driving displacement is implicitly described via the competitive binding mechanism.

### **2.3 Energy Efficiency**

*   **Vector ID:** M2.3
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification/Metrics: The paper does not provide information to assess the energy efficiency of either the chemical binding displacement process or the fluorescence quantum yield of DPH within the barrels. Evaluating the overall system efficiency would also require considering the energy consumption of the plate reader and computational analysis, which is not discussed.
    *   CT-GIN Mapping: N/A
    *   Implicit/Explicit: N/A
      *  Justification: No data or discussion regarding energy efficiency is present.

### **2.4 Energy Dissipation**

*   **Vector ID:** M2.4
*   **Vector Type:** Dissipation
    *   Content: Energy dissipation mechanisms include: Non-radiative decay pathways for the excited DPH molecules (reducing fluorescence quantum yield), potential heat generation during binding/unbinding events (though likely negligible at the concentrations used), and energy loss within the optical components of the plate reader. These are not quantified in the paper. Assessment: Likely Low for binding events, Medium for fluorescence (typical quantum yields are <1).
    *   CT-GIN Mapping: Creates `EnergyDissipationNode`s (e.g., Heat, NonRadiativeDecay) and `EnergyDissipationEdge`s from `EnergyTransductionEdge`s.
    *    Implicit/Explicit: Implicit
        *  Justification: Standard physical processes like non-radiative decay are implied in any fluorescence measurement but are not explicitly mentioned or quantified. Heat from binding is a general thermodynamic principle, not discussed.

## M3: Memory
*   **Vector ID:** M3
*   **Vector Type:** Memory

### **3.1 Memory Presence:**

*   **Vector ID:** M3.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The αHB-dye system is described as a sensor where analyte presence causes immediate dye displacement and a change in fluorescence. There is no indication that the peptide assemblies undergo persistent structural or chemical changes based on past analyte exposure that would influence future sensing events. The "memory" in the system resides within the trained ML models, which are external to the material itself.
    *    Implicit/Explicit: Implicit
        * Justification: The paper describes a sensing mechanism based on equilibrium or near-equilibrium binding and displacement. The absence of discussion about hysteresis, persistent state changes in the peptides, or history-dependent responses implies a lack of intrinsic material memory.

**(Conditional: M3.1 is "No", skipping to Module 4.)**

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
    | N/A                 | N/A                          | N/A                             | N/A   | N/A               | N/A               | N/A               | No intrinsic material memory described. |
*   Implicit/Explicit: N/A
    *   Justification: N/A

### **3.8 Memory Fidelity & Robustness Metrics (Optional - if applicable)**
* **Vector ID:** M3.8
* **Vector Type:** Table
*   Table:
    | Metric ID | Description | Value | Units | CT-GIN Mapping | Data Source | Implicit/Explicit | Justification |
    | :-------- | :---------- | :----: | :---: | :-------------: | :----------: |:-----------------:| :-----------------:|
    | N/A       | N/A         | N/A    | N/A   | N/A             | N/A          | N/A               | No intrinsic material memory described. |
*   Implicit/Explicit: N/A
*   Justification: N/A
---

## M4: Self-Organization and Emergent Order
*   **Vector ID:** M4
*   **Vector Type:** Self-Organization

### **4.1 Self-Organization Presence:**

*   **Vector ID:** M4.1
*   **Vector Type:** Binary
    *   Content: Yes
    *   Justification: The individual de novo designed peptides *self-assemble* into the intended α-helical barrel structures (αHBs) in solution. This formation of specific oligomeric states (pentamers to heptamers confirmed by AUC) based on the peptide sequence and local interactions (hydrophobic packing, charge pairing) is a form of self-organization. However, this is a *designed* self-assembly into stable structures, not an emergent pattern formation *during* the sensing process in response to analytes or environmental changes.
    *   Implicit/Explicit: Explicit
        *  Justification: The paper explicitly states the peptides "assemble into coiled-coil structures" (Introduction) and confirms the formation of discrete species via AUC and X-ray crystallography (Results).

**(Conditional: M4.1 is "Yes", including M4.2-M4.7)**

### **4.2 Local Interaction Rules:**

*   **Vector ID:** M4.2
*   **Vector Type:** Rules
    *   Content: The self-assembly is governed by local interactions defined by the heptad repeat (abcdefg) sequence: Hydrophobic residues typically at 'a' and 'd' positions drive core packing. Charged residues at 'b', 'c', 'e', 'g' positions influence oligomeric state and solubility through inter-helical electrostatic interactions (e.g., Glu-Lys/Arg pairs planned at 'b' and 'c'). Alanine at 'e' stabilizes interfaces. Residue identity at 'g' significantly impacts oligomer state (e=Ala, varied g=Ala, Asn, Gln, Glu, Ile, Ser). Specific mutations at 'a' and 'd' fine-tune channel chemistry and size (e.g., polar, charged, aromatic substitutions). These rules are based on established principles of coiled-coil design.
    *   CT-GIN Mapping: Part of the `PeptideNode` description and `AssemblyEdge`s connecting `PeptideNode`s to form `PeptideAssemblyNode`. Rules dictate edge formation/stability based on `PeptideNode` attributes (`sequence`, `heptadPositionProperties`). Defines "HelixPackingInteraction" and "ElectrostaticInteraction" categories.
    * **Implicit/Explicit**: Explicit
        *  Justification: The paper explicitly describes the heptad repeat rules, the role of specific positions (a, d, e, g), the use of complementary charges, and the mutations made to control oligomer state and channel chemistry in the "Rational design..." section.

### **4.2.1 Local Interaction Parameters:**

* **Vector ID:** M4.2.1
* **Vector Type:** Table
*   Table:
    | Rule ID | Description | Parameter Name | Parameter Value Range | Units | Data Source | Implicit/Explicit | Justification |
    | :------ | :---------- | :------------- | :---------- | :---: | :----------: | :----------------: | :------------: |
    | Hydrophobic Packing | Residue Type at 'a', 'd' | Identity | Leu, Ile, Val, Met (typically) | N/A | Intro/Results (Rational design...) | Explicit | Text describes common hydrophobic residues used. |
    | Oligomer State Control | Residue Type at 'g' | Identity | Ala, Asn, Gln, Glu, Ile, Ser | N/A | Intro/Results (Rational design...) | Explicit | Text lists the 'g' residues used to target oligomer states. |
    | Interface Stabilization | Residue Type at 'e' | Identity | Ala (mostly) | N/A | Intro/Results (Rational design...) | Explicit | Text states 'e' was kept as Ala in most designs. |
    | Solubility/Interactions | Residue pairing at 'b', 'c' | Charged Pair | Glu-Lys, Glu-Arg | N/A | Intro/Results (Rational design...) | Explicit | Text describes use of complementary charged pairs. |

### **4.3 Global Order:**

*   **Vector ID:** M4.3
*   **Vector Type:** Order
    *   Content: The emergent global order is the formation of discrete, stable α-helical barrel oligomers (mostly pentamers, hexamers, heptamers) with well-defined central channels. Specific examples confirmed by X-ray crystallography show highly ordered structures.
    *   CT-GIN Mapping: Defines a `ConfigurationalNode` (`PeptideAssemblyNode`) with attributes like `oligomericState`, `channelDimensions`, `stability`.
    * **Implicit/Explicit**: Explicit
        *  Justification: The formation of specific oligomers is explicitly confirmed by AUC (Supplementary Fig. 6, Supplementary Table 1) and X-ray crystallography (Fig. 2, Supplementary Fig. 7, Supplementary Table 2).

### **4.4 Predictability of Global Order:**

*   **Vector ID:** M4.4
*   **Vector Type:** Score
    *   Score: 8
    *   Justification: The paper states that "Robust rational and computational methods have been developed to design αHBs" allowing "oligomer-state specification." AUC results generally confirm the formation of single discrete species close to the targeted oligomeric state, and X-ray structures confirm the αHB fold. While not every design yielded the exact target state or crystallized perfectly, the design rules provide high predictability for forming stable αHBs. The success in obtaining 12 crystal structures out of 33 new designs further supports this.
    * **Implicit/Explicit**: Mixed
    *  Justification: Predictability is explicitly claimed ("oligomer-state specification", "design rules... allow αHBs to be constructed... with confidence"). The score is based on the high success rate implicitly shown by the characterization data (AUC, X-ray).
    *   CT-GIN Mapping: Contributes to the `AssemblyEdge` weight/probability.

### **4.5. Local Interaction Rules (for Self-Organization)**
* **Vector ID:** M4.5
* **Vector Type:** Table
*   Table:
| Rule ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Source |
| :------ | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :-----: |
| Heptad Repeat | Basic sequence motif | Sequence Pattern | abcdefg | N/A | Explicit | Stated in text defining coiled-coils. | Intro/Results |
| Hydrophobic Core | Packing of nonpolar residues | Residue Hydrophobicity | N/A (Qualitative) | N/A | Explicit | Explicitly mentioned role of 'a', 'd' sites. | Intro/Results |
| Electrostatics | Interaction between charged residues | Residue Charge | +/- | N/A | Explicit | Explicitly mentioned use of Glu/Lys/Arg pairs. | Intro/Results |
| Oligomer Control ('g' site) | Steric/polar effects at 'g' position | Residue Type at 'g' | Ala, Asn, Gln, Glu, Ile, Ser | N/A | Explicit | Explicitly lists 'g' variations used. | Intro/Results |

### **4.6. Globally Emergent Order and Order Parameters**
* **Vector ID:** M4.6
* **Vector Type:** Table
*   Table:
| Property ID | Description | Parameter | Value Range | Units | Implicit/Explicit | Justification | Protocol | Source |
| :---------- | :---------- | :-------- | :---------- | :---: | :----------------: | :------------: | :------: | :-----: |
| Oligomeric State | Number of peptides per barrel | Integer | 5 - 7 (observed) | N/A | Explicit | Measured oligomeric states from AUC. | AUC (SEDFIT analysis) | Supp. Fig. 6, Supp. Table 1 |
| Helicity | Degree of alpha-helical structure | Mean Residue Ellipticity @ 222nm | Approx. -25000 to -35000 | deg cm² dmol⁻¹ | Explicit | CD spectra show high helicity. Values estimated from Supp. Fig. 4. | CD Spectroscopy | Supp. Fig. 4 |
| Thermal Stability | Melting Temperature | T<sub>m</sub> | Most > 95 | °C | Explicit | Measured via thermal denaturation CD. | CD Thermal Denaturation | Supp. Fig. 5 |
| Channel Accessibility | Open central channel | N/A (Qualitative) | N/A | N/A | Explicit | Confirmed by X-ray structures. | X-ray Crystallography | Fig. 2, Supp. Fig. 7 |

### **4.7 Yoneda Embedding and Local-to-Global Mapping Fidelity**

*   **Vector ID:** M4.7
*   **Vector Type:** Table
*   Table:
    | Link Type | Description | Predictability | Yoneda Score | Metrics | Implicit/Explicit | Justification | Source |
    | :-------- | :---------- | :------------- | :----------- | :------ | :----------------: | :------------: | :-----: |
    | Sequence-Structure | Mapping peptide sequence rules to final assembled αHB structure | High (Score 8) | N/A | Oligomeric state, Helicity, T<sub>m</sub>, X-ray structure confirmation | Mixed | Predictability based on design success (Implicit), Rules are explicit. | N/A |
    *   **Yoneda Embedding Fulfillment Score [0-10]:** N/A
    *   **Metrics:** N/A (Yoneda embedding not discussed or measured).
    *   **Justification:** The paper focuses on designing structures based on sequence rules and validating the outcome. It uses established biophysical principles (local interactions lead to global fold) but does not explicitly frame this using Category Theory or Yoneda embedding, nor does it quantify the fidelity of this mapping in those terms.

## M5: Computation
*   **Vector ID:** M5
*   **Vector Type:** Computation

### **5.1 Embodied Computation Presence:**

*   **Vector ID:** M5.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The computation (classification of analytes based on fluorescence fingerprints) is performed by external machine learning algorithms (Gaussian Naive Bayes, k-NN, LDA, AdaBoost, SVC) run on conventional computers using the `scikit-learn` Python package. The peptide array itself acts as a transducer, converting chemical binding events into optical signals, but does not perform the computation intrinsically.
    *    Implicit/Explicit: Explicit
        *  Justification: The paper explicitly states that ML models are used to classify fingerprints (Abstract, Fig. 1, Methods - Data processing and machine learning analysis), detailing the software and algorithms used.

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
| N/A     | N/A         | N/A              | N/A              | N/A              | N/A       | N/A          | N/A               | No embodied computation described. |

## M6: Temporal Dynamics
*   **Vector ID:** M6
*   **Vector Type:** Temporal

### **6.1 Timescales:**

*   **Vector ID:** M6.1
*   **Vector Type:** ParameterTable
    *   Table:
        | Timescale Description | Value | Units | Source | Implicit/Explicit | Justification |
        | :-------------------- | :---: | :---: | :----: | :----------------: | :------------: |
        | Peptide Self-Assembly | N/A | N/A | N/A | Implicit | Assumed to occur prior to use, timescale not measured. |
        | Dye Binding/Displacement | N/A | N/A | N/A | Implicit | Assumed to reach equilibrium or steady-state before measurement, kinetics not reported. |
        | Fluorescence Measurement | N/A | N/A | Methods | Implicit | Plate reader measurement time is typically seconds per well, but not specified. |
        | Analyte Incubation Time | N/A | N/A | Methods | Implicit | Time between analyte addition and measurement not specified, assumed sufficient for equilibration. |
        | ML Model Training/Prediction | N/A | N/A | N/A | Implicit | Computational time depends on hardware and dataset size, not reported. |
    *   **Note:** The paper does not report specific timescales for the dynamic processes involved in sensing, only for peptide characterization (thermal melts).

### **6.2 Active Inference:**

*   **Vector ID:** M6.2
*   **Vector Type:** Assessment
    *   Content: No
    *   Justification: The system does not exhibit active inference. The peptide array responds passively to the presence of analytes. The ML models learn static patterns from training data but do not actively interact with the environment, predict future states based on an internal model, or select actions to minimize prediction error during the sensing process itself. The system identifies patterns, it doesn't actively seek to confirm or refine an internal world model through action.
    *   Implicit/Explicit: Implicit
        *  Justification: The description focuses on passive sensing and pattern recognition via ML. There is no mention of internal models, prediction error minimization, or action selection by the material system itself.
    *   **If Yes/Partial, provide examples of testable CT-GIN metrics that *could* be used to quantify active inference:** N/A

## M7: Adaptation
*   **Vector ID:** M7
*   **Vector Type:** Adaptation

### **7.1 Adaptive Plasticity Presence:**

*   **Vector ID:** M7.1
*   **Vector Type:** Binary
    *   Content: No
    *   Justification: The peptide array components (αHBs) are static during the sensing process. Their structure and binding properties are fixed by their designed sequence. While the *ML models adapt* during the training phase by adjusting their parameters to better classify the data, this adaptation is external to the material sensing components. The material itself does not change its structure or behavior based on experience to improve performance over time.
    *    Implicit/Explicit: Implicit
        * Justification: The paper describes the αHBs as stable, pre-designed structures. The adaptation occurs solely within the external ML algorithms during training, not within the physical sensing array.

**(Conditional: M7.1 is "No", skip to Module 8.)**

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
    *   Content: The primary functional behavior is *differential sensing* leading to *analyte classification/discrimination*. The array of αHBs, when loaded with DPH dye and exposed to an analyte, produces a specific pattern of fluorescence changes (a fingerprint) across its different elements due to varying degrees of dye displacement. This fingerprint serves as the input for ML models that classify the analyte (e.g., distinguishing between different amino acids, fatty acids, teas, or serum samples).
    *   CT-GIN Mapping: Defines the `BehaviorArchetypeNode`: `type`: DifferentialSensing/Classification. Links `SystemNode` to `AnalyteClassificationOutputNode`.
    *    Implicit/Explicit: Explicit
       *  Justification: The abstract, introduction, Fig. 1, and results explicitly describe the differential sensing behavior and its use for classification.

### **8.2 Behavior Robustness:**

*   **Vector ID:** M8.2
*   **Vector Type:** Score
    *   Score: 7
    *   Justification: The peptides are described as hyperthermostable (Tm > 95°C for most) and form stable assemblies (AUC). The sensing process involves data pre-processing to remove outliers (e.g., from liquid handling errors), suggesting some sensitivity to experimental noise. Classification accuracy varies depending on the analyte class (100% for FAs, ~60-70% for AAs/CHOs, ~84-90% for teas/sera), indicating robustness depends on the difficulty of the classification task and the signal difference between classes. The use of relatively simple peptides and synthesis methods suggests potential for scalable production. Robustness to component failure (e.g., one faulty peptide well) is partially addressed by using an array and ML feature selection, which can down-weight noisy or uninformative sensors.
    *   Implicit/Explicit: Mixed
        *  Justification: Peptide stability (Tm, AUC) and classification accuracies are explicit. Robustness to noise is implied by the need for outlier removal. Scalability is implied by the use of peptide synthesis. Robustness assessment requires integrating these explicit data points with implicit understanding of array sensing.
    *   CT-GIN Mapping: This score contributes to the reliability attributes of the `BehaviorArchetypeNode` (`DifferentialSensing/Classification`).

### **8.3 CT-GIN Emergent Behavior Validation**

*    **Vector ID:** M8.3
*    **Vector Type:** Validation
     *  Content: The primary emergent behavior claimed is the ability of the array's *collective* differential response to discriminate analytes, which is validated through ML classification performance. Validation methods include:
        1.  **Cross-Validation:** Nested stratified k-folds cross-validation is used to train and test ML models, providing an estimate of generalization performance (Methods, Table 1).
        2.  **Performance Metrics:** Accuracy, Precision, F1 Score are reported for classifications (Table 1).
        3.  **Comparison to Controls:** Performance is compared against dummy classifiers (random guessing) using statistical tests (5x2CV F-test) to ensure performance is significantly above chance (Methods, Supplementary Tables 3-5, 7, 10, 11).
        4.  **Feature Analysis:** Methods like KBest and permutation analysis identify which αHBs contribute most, validating that the discrimination arises from the differential response across the array (Results, Fig. 5).
        Limitations: Validation relies heavily on ML performance; direct validation of the *emergence* aspect (i.e., predicting classification success purely from local binding interactions) is not performed. Reproducibility across different labs/batches is not shown.
     *   Implicit/Explicit: Explicit
    *   Justification: The ML validation methods (cross-validation, metrics, controls, feature analysis) and results are explicitly described in the Methods and Results sections, including Table 1 and supplementary tables/figures.

## M9: Cognitive Proximity
*   **Vector ID:** M9
*   **Vector Type:** Cognition

### **9.1 Cognitive Mapping:**

*   **Vector ID:** M9.1
*   **Vector Type:** Description
    *   Content: The paper explicitly draws an analogy between the differential sensing array and mammalian olfaction (sense of smell). It states: "Differential sensing attempts to mimic the mammalian senses of smell and taste... In place of hundreds of complex, membrane-bound G-protein coupled receptors, differential sensors employ arrays of small molecules." It further notes that olfactory GPCRs respond non-specifically, and the composite response is interpreted, similar to how the αHB array generates a composite fingerprint interpreted by ML. The αHBs are presented as analogous to "olfactory GPCRs and other synthetic receptor-based systems." Limitations: This is explicitly an analogy; the αHBs lack the complexity, signal transduction pathways, and integration with a nervous system seen in biological olfaction. The "interpretation" is done by external ML, not an embodied cognitive process.
    *   CT-GIN Mapping: Defines a `CognitiveMappingEdge` from `BehaviorArchetypeNode` (`DifferentialSensing/Classification`) to `CognitiveFunctionNode` (`OlfactionAnalogue`).
    *   Implicit/Explicit: Explicit
    * Justification: The analogy to olfaction and GPCRs is explicitly stated multiple times in the Introduction and Discussion sections.

### **9.2 Cognitive Proximity Score:**

*   **Vector ID:** M9.2
*   **Vector Type:** Score
    *   Score: 2
    *   Justification: The system demonstrates Level 1 (Simple Responsivity) by reacting to analytes with fluorescence changes. It arguably reaches Level 2 (Sub-Organismal Responsivity) as the *array* shows a pattern-based differential response analogous to basic sensory discrimination (like olfaction). However, it lacks key features of higher cognitive levels: no intrinsic memory (Level 3+), no adaptation/learning within the material itself (Level 3+), no embodied computation (computation is external ML), no evidence of goal-directedness beyond the designed sensing function (Level 4+), no internal models, planning, or self-awareness. The analogy to olfaction is superficial regarding the underlying mechanisms and cognitive depth.
    *   Implicit/Explicit: Mixed
    *  Justification: The score is based on evaluating the system's explicitly described behaviors (sensing, classification via external ML) against the implicit criteria of the CT-GIN Cognizance Scale. The lack of described intrinsic memory, adaptation, or computation supports the low score.

**CT-GIN Cognizance Scale:** (Provided in template)

### **9.3 Cognitive Function Checklist**

* **Vector ID:** M9.3
* **Vector Type:** Checklist
    *   | Cognitive Function               | Score (0-10) | Justification/Notes                                                                       | CT-GIN Mapping (if applicable) | Implicit/Explicit | Justification for Implicit/Explicit/Mixed |
    | :-------------------------------- | :----------: | :------------------------------------------------------------------------------------ | :--------------------------------: | :-----------------:|:-----------------:|
    | Sensing/Perception               |      4       | Array detects analytes and generates differential patterns (fingerprints). Limited scope compared to biological perception. | `BehaviorArchetypeNode`: `DifferentialSensing` | Explicit | Explicit description of sensing and pattern generation. |
    | Memory (Short-Term/Working)        |      0       | No evidence of intrinsic short-term state retention influencing subsequent measurements. | N/A                                | Implicit | Lack of description of such mechanisms. |
    | Memory (Long-Term)                 |      0       | No evidence of persistent changes in the material based on experience. Memory is in external ML model. | N/A                                | Implicit | Lack of description of such mechanisms. |
    | Learning/Adaptation              |      1       | Adaptation occurs solely in the external ML model during training, not in the material itself. | `MLClassifierNode` (external)       | Explicit | Explicit description of ML training. |
    | Decision-Making/Planning          |      1       | Basic classification "decision" made by external ML model. No planning or complex decision-making by the material. | `MLClassifierNode` (external)       | Explicit | Explicit description of ML classification. |
    | Communication/Social Interaction |      0       | No interaction between array elements or with other systems described.              | N/A                                | Implicit | Lack of description of communication. |
    | Goal-Directed Behavior            |      1       | System achieves the designed goal of analyte classification. No autonomous goal setting or flexible pursuit. | `SystemNode`: `purpose`           | Implicit | Goal is designer-imposed, achieved via fixed mechanism. |
    | Model-Based Reasoning              |      0       | Reasoning/classification based on patterns learned by external ML, not an internal world model within the material. | N/A                                | Implicit | Lack of description of internal models. |
    | **Overall score**                 |    **~1.4**    | System primarily functions as a sophisticated transducer coupled to external pattern recognition. | N/A                                | N/A                 | N/A                 |    

    *   **Note:** Scores reflect the capabilities of the *material system itself*, largely excluding the external ML component except where noted.

## M10: Criticality Assessment
*   **Vector ID:** M10
*   **Vector Type:** Criticality

### **10.1 Criticality:**

*   **Vector ID:** M10.1
*   **Vector Type:** Assessment
    *   Content: No
    *   Justification: The paper does not discuss or provide evidence suggesting that the αHB array operates near a critical point. There is no mention of scale-free behavior, power laws, long-range correlations, or other hallmarks of criticality in the context of the sensing mechanism or the peptide self-assembly process described.
        *   Critical Parameters (If Yes/Partial): N/A
        *   Evidence: N/A
    *   Implicit/Explicit: Implicit
    *    Justification: The absence of any discussion related to criticality concepts implies it is not a relevant feature of the system as described.

## M11: Review Paper Specifics (Conditional)

*   **Vector ID:** M11
*   **Vector Type:** Review
N/A (Paper type is Hybrid, not Review)

### **11.1 Literature Synthesis Quality:**
*   **Vector ID:** M11.1
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification: N/A
    *    Implicit/Explicit: N/A
         *  Justification: N/A

### **11.2 Gap Identification:**
*   **Vector ID:** M11.2
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification: N/A
    *   Implicit/Explicit: N/A
        *  Justification: N/A

### **11.3 Future Directions:**
*   **Vector ID:** M11.3
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification: N/A
    *    Implicit/Explicit: N/A
    *   Justification: N/A

### **11.4 Review Paper CT-GIN Alignment Score**
*   **Vector ID:** M11.4
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification: N/A
    *    Implicit/Explicit: N/A
        *  Justification: N/A

## M12: Theoretical Paper Specifics (Conditional)

*   **Vector ID:** M12
*   **Vector Type:** Theory
N/A (Paper type is Hybrid, not Theoretical)

### **12.1 Theoretical Rigor:**
*   **Vector ID:** M12.1
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification: N/A
       * Implicit/Explicit: N/A
       *  Justification: N/A

### **12.2 Realization Potential:**
*   **Vector ID:** M12.2
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification: N/A
    *   Implicit/Explicit: N/A
    *  Justification: N/A

### **12.3 Potential for Future CT-GIN Implementation Score**
* **Vector ID:** M12.3
*   **Vector Type:** Score
    *   Score: N/A
    *   Justification: N/A
    *    Implicit/Explicit: N/A
    *   Justification: N/A

## M13: Overall Assessment & Scoring

*   **Vector ID:** M13
*   **Vector Type:** Overall

### **13.1 CT-GIN Readiness Score:**

*   **Vector ID:** M13.1
*   **Vector Type:** Score
*   **Calculated Score:** 3.25 *(Average of M1.2=9, M2.3=0 (N/A counts as 0), M3.1=0 (No), M4.1=1 (Yes, but designed), M4.4=8, M8.2=7, M9.2=2 -> (9+0+0+1*0+8+7+2)/6 = 26/6 = 4.33. Recalculating: M1.2(9), M2.3(0), M3.2(0), M4.4(8), M8.2(7), M9.2(2). Average = (9+0+0+8+7+2)/6 = 26/6 = 4.33. Let's verify instructions: "Average of scores from Modules 1-4, M8.2 and M9.2". This means M1.2, M2.3, M3.2, M4.4. Average = (9+0+0+8+7+2)/6 = 4.33. Correcting based on module selection, it implies we average the module scores? Or key scores within? Re-reading: "Average of scores from Modules 1-4, M8.2 and M9.2". This is ambiguous. Interpreting as the primary *score* within each listed module/item: M1.2 (9), M2.3 (0), M3.2 (0, since M3.1 is No), M4.4 (8), M8.2 (7), M9.2 (2). Average = (9+0+0+8+7+2)/6 = 26/6 = 4.33)*
*   **Calculated Score:** 4.33

**CT-GIN Readiness Summary Table:**

| CT-GIN Aspect                   | Strength (Yes/Partial/No) | Key Supporting Metrics (with units) | Limitations (Missing Metrics/Data Gaps)                                           | Improvement Areas (Future Research)                                          |
| :------------------------------ | :-----------------------: | :-----------------------------------| :------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| Energy Flow Efficiency          | No                        | N/A                                  | No efficiency data provided (quantum yield, binding thermodynamics, operational energy). | Quantify fluorescence quantum yields, binding affinities/thermodynamics, system power use. |
| Memory Fidelity                 | No                        | N/A                                  | No intrinsic material memory; reliance on external ML for history dependence.      | Explore peptide modifications or system designs enabling persistent state changes. |
| Organizational Complexity       | Partial                   | Oligomeric State (5-7), High Helicity (CD), T<sub>m</sub> (>95°C mostly) | Designed self-assembly, not dynamically emergent during function. Complexity limited to static barrels. | Design systems where structure dynamically reorganizes during sensing/computation. |
| Embodied Computation            | No                        | N/A                                  | Computation performed by external ML algorithms.                                  | Explore material systems capable of intrinsic information processing (e.g., molecular logic). |
| Temporal Integration            | No                        | N/A                                  | System dynamics (binding, response times) not characterized; operates quasi-statically. | Characterize system kinetics; explore designs with inherent temporal processing. |
| Adaptive Plasticity             | No                        | N/A                                  | Material properties are fixed; adaptation only in external ML training.            | Design materials that modify their properties based on sensing history (e.g., self-modification). |
| Functional Universality         | No                        | Classification Accuracy (Analyte-dependent: 60-100%) | Specific function (differential sensing/classification); not general-purpose computation. | Explore programmability or integration of diverse computational primitives. |
| Cognitive Proximity            | Partial                   | Analogy to Olfaction (Explicit), Cognitive Function Score (~1.4) | Low score; lacks key cognitive features (memory, learning, embodied computation, autonomy). | Integrate intrinsic memory, learning, and decision-making into the material system. |
| Design Scalability & Robustness | Partial                   | Peptide Synthesis (Scalable), Thermal Stability (High), Outlier removal needed. | Robustness varies with task; sensitivity to handling errors. Full scalability needs validation. | Improve signal-to-noise; validate large-scale production and long-term stability. |
| **Overall CT-GIN Readiness Score** | N/A                     | 4.33 (Calculated)                      | N/A                                                                              | N/A                                                                           |


### **13.2 Qualitative CT-GIN Assessment Conclusion:**

*   **Vector ID:** M13.2
*   **Vector Type:** Textual Summary
    *   Content: This paper presents a well-characterized differential sensor array based on de novo designed peptide barrels (αHBs). Its key strength lies in the rational design and predictable self-assembly (M4) of diverse, stable peptide structures, enabling the creation of a sophisticated chemical-to-optical transducer. The system successfully demonstrates differential sensing behavior (M8) for various analytes, including complex biological mixtures, achieving high classification accuracy for certain tasks when coupled with external machine learning. However, from a CT-GIN perspective focused on material intelligence, significant limitations exist. The system lacks intrinsic memory (M3), embodied computation (M5), adaptive plasticity (M7), and autonomous goal-directed behavior (M9). The self-organization observed is designed structural formation, not functional emergence. Energy flow (M2) and temporal dynamics (M6) are insufficiently characterized. While analogous to olfaction (M9.1), its cognitive proximity is low (M9.2 Score: 2), functioning primarily as a Level 1/2 responsive system requiring external processing for interpretation. Overall, the αSA is an advanced biomolecular sensor array but does not currently embody higher levels of material intelligence as defined by the CT-GIN framework. Its potential lies in providing a versatile platform upon which rudimentary cognitive functions might be layered in future work.

### **13.3 CT-GIN Refinement Directions:**

*   **Vector ID:** M13.3
*   **Vector Type:** Recommendations
    *   Content:
        *   **Integrate Intrinsic Memory:** Explore modifications to αHBs or array design to enable persistent state changes based on analyte exposure history (e.g., slow conformational changes, covalent modifications, analyte trapping).
        *   **Embodied Computation:** Investigate possibilities for rudimentary computation within the array, such as designing αHBs whose binding/fluorescence properties implement simple logic or thresholding functions locally, reducing reliance on external ML for initial processing.
        *   **Adaptive Mechanisms:** Design feedback loops where sensing output modifies subsequent peptide assembly, dye loading, or binding characteristics, enabling the array to adapt its sensitivity or selectivity over time.
        *   **Characterize Dynamics:** Measure the kinetics of dye/analyte binding and displacement to understand the system's temporal response characteristics (M6).
        *   **Energy Flow Analysis:** Quantify binding thermodynamics and fluorescence quantum yields to better understand energy transduction and efficiency (M2).
        *   **Explore Dynamic Self-Organization:** Move beyond static self-assembly; investigate systems where analyte binding triggers reversible changes in αHB organization or array structure.
        *   **Quantify Robustness:** Systematically evaluate robustness to noise, environmental fluctuations (temperature, pH), and component variability/failure (M8.2).

## M14: CT-GIN Knowledge Graph

*   **Vector ID:** M14
*   **Vector Type:** Visualization

### **14.1. CT-GIN Knowledge Graph:**
* **Content:**
```mermaid
graph LR
    subgraph System
        S[SystemNode αSA \n systemType: SensorArray \n purpose: AnalyteDiscrimination]
        P[PeptideAssemblyNode αHB (n=46+2) \n oligomericState: 5-7 \n stability: High]
        D[DyeNode DPH \n type: Fluorophore]
        ML[MLClassifierNode \n type: External(SVM, LDA etc.)]
        IN[EnergyInputNode \n source: ChemicalBinding, OpticalExcitation]
        OUT[AnalyteClassificationOutputNode]
        BEH[BehaviorArchetypeNode \n type: DifferentialSensing/Classification \n robustness: 7/10]
    end

    subgraph Interactions
        A[AnalyteNode]
        E[EnergyTransductionEdge Fluorescence \n from: OpticalExcitation \n to: FluorescenceEmission]
        E2[EnergyTransductionEdge CompetitiveBinding \n from: ChemicalBinding \n to: DyeDisplacement]
        Diss[EnergyDissipationNode \n type: NonRadiativeDecay, Heat]
    end

    subgraph Mapping
        COG[CognitiveFunctionNode OlfactionAnalogue]
    end

    %% Edges
    P -- Forms --> S
    D -- Loads --> P
    S -- Uses --> ML
    IN -- Powers --> S
    A -- Challenges --> S
    P -- Binds --> D
    P -- Binds --> A
    IN -- Excites --> D
    D -- Emits --> BEH
    A -- Displaces --> D -- Modulates --> BEH
    BEH -- InputTo --> ML
    ML -- Produces --> OUT

    %% Self-Org
    Pep[PeptideNode (n=48)]
    Pep -- AssemblyEdge --> P

    %% Energy
    IN -- EnergyTransductionEdge --> E
    IN -- EnergyTransductionEdge --> E2
    E -- EnergyDissipationEdge --> Diss
    E2 -- EnergyDissipationEdge --> Diss

    %% Cognitive
    BEH -- CognitiveMappingEdge --> COG

    %% Style
    classDef node fill:#f9f,stroke:#333,stroke-width:2px;
    class S,P,D,ML,IN,OUT,BEH,A,Pep,COG,Diss node;

```
**Diagram Description:** The graph shows the SystemNode (αSA) composed of Peptide Assemblies (αHB) loaded with Dye (DPH). Analyte binding competes with Dye binding, driven by Chemical Energy Input. Optical Energy Input excites the bound Dye, leading to Fluorescence emission, which constitutes the Behavior (Differential Sensing). This behavior is modulated by dye displacement. The fluorescence fingerprint (Behavior) is input to an external ML Classifier, producing the Classification Output. Peptide Nodes self-assemble into the αHB structures. Energy is transduced via binding and fluorescence, with dissipation pathways. The Differential Sensing behavior is explicitly mapped (analogously) to Olfaction. Key limitations (no intrinsic Memory, Computation, Adaptation) are absent from the graph structure originating *within* the material system nodes.

## M15: Relationship Vectors
*   **Vector ID:** M15
*   **Vector Type:** Relationships
*   Relationships:
        | Source Vector ID | Target Vector ID | Relationship Type |
        | ------------- | ------------- | ----------------- |
        | M1.1 | M8.1 | Describes_System_Producing_Behavior |
        | M4.1 | M1.1 | Describes_Component_Formation |
        | M4.2 | M4.1 | Defines_Rules_For_SelfOrganization |
        | M4.3 | M4.1 | Describes_Outcome_Of_SelfOrganization |
        | M8.1 | M9.1 | Behavior_Mapped_To_CognitiveFunction |
        | M1.2 | M13.1 | Contributes_To_ReadinessScore |
        | M2.3 | M13.1 | Contributes_To_ReadinessScore |
        | M3.1 | M13.1 | Contributes_To_ReadinessScore (Absence) |
        | M4.4 | M13.1 | Contributes_To_ReadinessScore |
        | M5.1 | M13.1 | Contributes_To_ReadinessScore (Absence) |
        | M7.1 | M13.1 | Contributes_To_ReadinessScore (Absence) |
        | M8.2 | M13.1 | Contributes_To_ReadinessScore |
        | M9.2 | M13.1 | Contributes_To_ReadinessScore |
        | M13.1 | M13.2 | Summarized_By_Conclusion |
        | M13.2 | M13.3 | Identifies_Limitations_Addressed_By_Refinements |

## M16: CT-GIN Template Self-Improvement Insights

*   **Vector ID:** M16
*   **Vector Type:** Feedback

### **Template Feedback:**

*    **Vector ID:** M16.1
*   **Vector Type:** Text
Provide specific, actionable feedback on the *CT-GIN template itself*, based on this analysis:
    *   **Missing Probes:**
        *   A probe specifically for "Transduction Fidelity" might be useful (how accurately does the material convert input energy/signal to the measured output signal?).
        *   A probe for "Environmental Sensitivity" beyond the target analyte (e.g., robustness to pH, temperature, ionic strength variations *during operation*). M8.2 partially covers this but could be more specific.
        *   Consider explicitly separating "Designed Self-Assembly" (like in this paper) from "Emergent Functional Self-Organization" (patterns forming *during* operation in response to stimuli/gradients). M4 currently covers both but distinction is important for cognitive assessment.
    *   **Unclear Definitions:**
        *   The scope for calculating the "CT-GIN Readiness Score" (M13.1) was ambiguous ("Average of scores from Modules 1-4, M8.2 and M9.2"). Clarify if it means averaging *all* scores within those modules or specific designated scores (like M1.2, M2.3 etc.). Assuming the latter is more useful.
        *   The definition of "Memory" (M3.1) is good, but adding examples of physical mechanisms (conformational change, phase transition, covalent modification etc.) might help classification.
    *   **Unclear Node/Edge Representations:**
        *   Guidance was generally sufficient, but providing a *standardized library* of common Node/Edge types relevant to material intelligence (e.g., `SensorNode`, `ActuatorNode`, `LogicGateNode`, `MemoryElementNode`, `StructuralNode`, `BindingEdge`, `ForceTransmissionEdge`, `SignalPropagationEdge`) could improve consistency across analyses.
        *   Clarifying how to represent *external* components (like the ML model here) vs. *internal/embodied* components in the GIN mapping guidance would be helpful.
    *   **Scoring Difficulties:**
        *   Assigning scores for N/A parameters in M13.1 (assuming 0) heavily penalizes papers not focused on certain aspects (like energy efficiency). Consider alternative averaging methods (e.g., ignoring N/A) or clarifying the score's intent (is it overall paper quality for CT-GIN, or material intelligence level?). Current method seems biased towards papers explicitly measuring everything, even if the material shows low intelligence.
        *   The Cognitive Proximity scale (M9.2) jumps significantly between levels. Finer gradations or clearer examples for intermediate scores (e.g., 1 vs 2 vs 3) might be useful.
    *   **Data Extraction/Output Mapping:**
        *   Tables with many columns (e.g., M3.7, M3.8, M4.2.1, M5.4) can be cumbersome if the paper provides little information. Perhaps making some columns optional or providing clearer "N/A" guidance within tables.
        *   Vector IDs are helpful for structure but add length.
    *   **Overall Usability:** The template is very comprehensive and detailed, forcing rigorous analysis. However, its length and the requirement to address aspects often absent in typical materials papers (e.g., detailed energy analysis, cognitive mapping) makes it time-consuming. The strict formatting is crucial but demanding. Conditional sections help reduce unnecessary work.
    * **Specific Suggestions:**
        *   Clarify M13.1 calculation.
        *   Refine distinction between designed vs. emergent self-organization (M4).
        *   Consider adding a "Transduction Fidelity" probe.
        *   Provide standardized Node/Edge library examples.
        *   Refine scoring rubrics/examples, especially for M9.2.