# Methods: Fabrication, Characterization, Simulation, and Analysis Techniques

**Description:** This document outlines the fundamental methods (nodes defined via `[[./css.md#MethodNode]]`) used in the reviewed literature to fabricate, manipulate, measure, simulate, or analyze systems related to material cognition and embodied intelligence. These represent the experimental and computational 'toolkits' employed to implement or understand the `[[./mechanisms.md]]`, `[[./materials.md]]`, `[[./phenomena.md]]`, and `[[./theoretical.md]]` concepts.

---

## Index of Methods

*   [Energy Flow / Thermodynamics Methods](#energy-flow--thermodynamics-methods)
    *   [statistical-mechanics--stochastic-thermodynamics](#statistical-mechanics--stochastic-thermodynamics)
    *   [thermal-analysis-dsc](#thermal-analysis-dsc)
*   [Stimulus Control and Measurement Methods](#stimulus-control-and-measurement-methods)
    *   [electrical-measurements](#electrical-measurements)
    *   [mechanical-testing](#mechanical-testing) (Category)
        *   [mechanical-input-control](#mechanical-input-control)
        *   [mechanical-property-testing](#mechanical-property-testing)
    *   [spectroscopy](#spectroscopy) (Category)
        *   [spectroscopic-techniques](#spectroscopic-techniques)
        *   [external-field-control](#external-field-control)
    *   [thermal-stimuli-control](#thermal-stimuli-control)
    *   [chemical-stimuli-control](#chemical-stimuli-control)
*   [Fabrication and Synthesis Methods](#fabrication-and-synthesis-methods)
    *   [micro-nano-fabrication](#micro-nano-fabrication) (Category)
        *   [lithography](#lithography)
        *   [thin-film-deposition-pvd-cvd-etc](#thin-film-deposition-pvd-cvd-etc)
        *   [etching](#etching)
        *   [soft-lithography](#soft-lithography)
    *   [3d-printing-additive-manufacturing](#3d-printing-additive-manufacturing)
    *   [polymer-synthesis-processing](#polymer-synthesis-processing)
    *   [self-assembly-methods](#self-assembly-methods) (Category)
        *   [dna-directed-assembly](#dna-directed-assembly)
        *   [evaporation-driven-assembly](#evaporation-driven-assembly)
        *   [colloidal-synthesis-assembly](#colloidal-synthesis-assembly) <!-- Renamed from colloidal-assembly for clarity -->
        *   [capillarity-assisted-particle-assembly](#capillarity-assisted-particle-assembly)
        *   [bcp-phase-separation](#bcp-phase-separation)
    *   [biological-construction](#biological-construction)
    *   [microfluidics](#microfluidics)
    *   [composite-fabrication](#composite-fabrication)
    *   [dna-synthesis-functionalization](#dna-synthesis-functionalization)
    *   [drop-casting](#drop-casting) <!-- Added -->
*   [Observation and Imaging Methods](#observation-and-imaging-methods)
    *   [microscopy](#microscopy)
    *   [x-ray-techniques](#x-ray-techniques)
    *   [neuroimaging](#neuroimaging)
    *   [particle-cell-tracking-analysis](#particle-cell-tracking-analysis)
*   [Modeling and Simulation Methods](#simulation--modeling-methods)
    *   [particle-based-modeling](#particle-based-modeling) (Category)
        *   [molecular-dynamics-md](#molecular-dynamics-md)
        *   [monte-carlo-mc](#monte-carlo-mc)
        *   [langevin-dynamics](#langevin-dynamics)
        *   [dissipative-particle-dynamics-dpd](#dissipative-particle-dynamics-dpd)
        *   [discrete-element-method-dem](#discrete-element-method-dem)
    *   [agent-based-modeling-abm](#agent-based-modeling-abm)
    *   [continuum-modeling](#continuum-modeling) (Category)
        *   [finite-element-method-femfea](#finite-element-method-femfea)
        *   [numerical-ode-pde-solvers](#numerical-ode-pde-solvers)
    *   [network-modeling](#network-modeling) (Category)
        *   [network-topology-analysis](#network-topology-analysis)
        *   [artificial-neural-networks](#artificial-neural-networks)
        *   [chemical-pathway-network-modeling](#chemical-pathway-network-modeling)
    *   [quantum-simulation](#quantum-simulation) <!-- Added -->
*   [Data Analysis and Learning Methods](#data-analysis-and-learning-methods)
    *   [statistical-analysis](#statistical-analysis)
    *   [time-series-analysis](#time-series-analysis)
    *   [image-video-analysis](#image-video-analysis)
    *   [information-theory-metrics](#information-theory-metrics)
    *   [ml-classificationregression-svm-mlp-k-means-som](#ml-classificationregression-svm-mlp-k-means-som)
    *   [optimization-algorithms](#optimization-algorithms) (Category)
        *   [backpropagation-and-training](#backpropagation-and-training)
        *   [reinforcement-learning](#reinforcement-learning)
        *   [evolutionary-algorithms](#evolutionary-algorithms)
        *   [topology-optimization](#topology-optimization)
        *   [inverse-design](#inverse-design)
        *   [simulated-annealing](#simulated-annealing) <!-- Added from MC -->
    *   [feedback-control-loops](#feedback-control-loops)
    *   [theoretical-framework-application](#theoretical-framework-application)
    *   [mathematical-analysis](#mathematical-analysis)
    *   [miscellaneous-characterization](#miscellaneous-characterization) (Category)
        *   [dynamic-light-scattering](#dynamic-light-scattering)
        *   [gel-electrophoresis](#gel-electrophoresis)
        *   [magnetic-measurements](#magnetic-measurements)
        *   [biological-assays](#biological-assays)
        *   [thermomechanical-programming](#thermomechanical-programming)
        *   [surface-functionalization](#surface-functionalization)
        *   [biological-manipulation](#biological-manipulation) <!-- Added -->
        *   [modeling-cell--tissue](#modeling-cell--tissue) <!-- Added -->

---

## Energy Flow / Thermodynamics Methods

### statistical-mechanics--stochastic-thermodynamics
*   **Method ID:** `statistical-mechanics--stochastic-thermodynamics` (`[[./css.md#MethodNode]](category=Analysis, output_type=Theoretical Relations/Predictions)`)
*   **Human-Readable Title:** Theoretical Thermodynamics & Fluctuation Analysis
*   **Description:** Theoretical and analytical methods derived from `[[./theoretical.md#statistical-mechanics--stochastic-thermodynamics]]` used to model and analyze energy flow, dissipation, fluctuations, and information-thermodynamics relationships in systems, particularly non-equilibrium ones. Includes formulating master equations, Fokker-Planck equations, Langevin dynamics, applying fluctuation theorems (`[ritort_nonequilibrium_2024]`), calculating entropy production (`[freitas_emergent_2022]`), deriving TURs (`[ziyin_universal_2023]`, `[dieball_direct_2023]`).
*   **Input:** Model definition (states, rates, energies), System `[[./css.md#ParameterNode]]`s.
*   **Output:** Analytical relations, Probability distributions, Thermodynamic quantities (`[[./css.md#ParameterNode]](role=StateVariable, e.g., Sigma, W, Q, DeltaF)`), Fluctuation properties (`[[./css.md#MetricNode]]`).
*   **Links:** Enables analysis of `[[./mechanisms.md#energy-flow-dissipation]]`, `[[./mechanisms.md#driven-by-thermodynamic-statistical-principles]]`, computation costs (`[sartori_thermodynamic_2014]`), `[[./mechanisms.md#bayesian-inference--probabilistic-computation]]`. Used to study `[[./phenomena.md#information-thermodynamics-effects]]` (`[parrondo_thermodynamics_2015]`), `[[./phenomena.md#dissipation-accuracy-tradeoff]]` (`[cocconi_dissipation-accuracy_2025]`). Derives `[[./phenomena.md#thermodynamic-uncertainty-relations-results]]`. Related to `[[#particle-based-modeling]]`, `[[#continuum-modeling]]`.
*   **Example Citations:** `[sagawa_thermodynamics_2013]`, `[sartori_thermodynamics_2015]`, `[govern_optimal_2014]`, `[freitas_emergent_2022]`, `[yu_energy_2022]`, `[friston_free_2023]`.

### thermal-analysis-dsc
*   **Method ID:** `thermal-analysis-dsc` (`[[./css.md#MethodNode]](category=Characterization, output_type=Thermal Data)`)
*   **Human-Readable Title:** Measuring Heat Flow & Phase Transitions (Calorimetry)
*   **Description:** Experimental techniques like Differential Scanning Calorimetry (DSC) or Isothermal Titration Calorimetry (ITC) measuring heat flow associated with temperature changes or interactions, allowing identification of phase transitions, enthalpy changes, and heat capacity.
*   **Input:** Material sample (`[[./materials.md]]`), Temperature program.
*   **Output:** Heat flow vs. T/t curves, Transition temperatures (`[[./css.md#ParameterNode]](name=transition_temperature)`), ΔH (`[[./css.md#ParameterNode]](name=enthalpy_change)`), C<sub>p</sub> (`[[./css.md#ParameterNode]](name=heat_capacity)`).
*   **Links:** Characterizes drivers for `[[./mechanisms.md#thermal-transduction]]`. Measures aspects of `[[./mechanisms.md#energy-flow-dissipation]]`. Validates `[[./mechanisms.md#phase-conformation-memory]]`. Characterizes `[[./phenomena.md#phase-transitions]]`. Tests materials like `[[./materials.md#phase-change-composites]]` (`[zhao_phase_2021]`), `[[./materials.md#pnipam-networks-in-ionic-liquid]]` (`[chen_enormous-stiffness-changing_2022]`). Complements `[[#thermal-stimuli-control]]`.

---

## Stimulus Control and Measurement Methods

### electrical-measurements
*   **Method ID:** `electrical-measurements` (`[[./css.md#MethodNode]](category=Characterization, output_type=Electrical Signal)`)
*   **Human-Readable Title:** Electrical Control and Probing
*   **Description:** Applying controlled electrical inputs (V, I, E) and measuring resulting electrical properties (V, I, R, G, C, Z). Uses power supplies, electrometers, LCR meters, network analyzers (VNA `[crepaldi_evidence_2022]`), patch clamp (`[robin_long-term_2023]`). Also functions as control mechanism (applying stimuli).
*   **Input:** Device/sample (`[[./materials.md]]`), Input signal sequence (V(t), I(t), E(t)).
*   **Output:** Electrical response (`[[./css.md#ParameterNode]](R, G, C, Z, etc.)`), I-V curves, Impedance spectra (`[[./css.md#MetricNode]]`).
*   **Links:** Drives/Reads `[[./mechanisms.md#electrical-ionic-transduction]]`, `[[./mechanisms.md#electrical-response]]`. Drives electrokinetics `[[./mechanisms.md#driven-by-physical-forces-dynamics]` (`[alapan_shape-encoded_2019]`). Input/Output for `[[./mechanisms.md#neuromorphic-computation]]`, `[[./mechanisms.md#physical-structural-memory]]` (memristors `[yao_fully_2020]`, `[yang_memristor_2022]`). Reads out other sensing (`[[./mechanisms.md#mechanical-transduction]]`, `[[./mechanisms.md#chemical-transduction]` (`[luo_highly_2023]`). Characterizes `[[./phenomena.md#memristance]]`, `[[./phenomena.md#synaptic-plasticity-emulation]]`. Used with NEMS `[tzanov_multi-frequency_2020]`, electrokinetics `[esplandiu_electrophoretic_2020]`.

### mechanical-testing
*   **Method ID:** `mechanical-testing` (`[[./css.md#MethodNode]](category=Characterization)`) (Represents the overall category)
*   **Human-Readable Title:** Applying & Measuring Mechanical Forces/Deformations (Category)
*   **Description:** Encompasses techniques for controlled mechanical stimulation (`[[#mechanical-input-control]]`) and measurement of material response (`[[#mechanical-property-testing]]`).
*   **Links:** See subtypes. Validates models based on `[[./theoretical.md#continuum-mechanics]]`. Used for systems realizing `[[./mechanisms.md#mechanical-actuation]]`, `[[./mechanisms.md#mechanical-transduction]]`, `[[./mechanisms.md#physical-embodied-computation]]`. Assesses `[[./phenomena.md#self-healing--self-repair]]` `[wool_self-healing_2008]`, `[[./phenomena.md#shape-memory-effect]]`.

#### mechanical-input-control
*   **Method ID:** `mechanical-input-control` (`[[./css.md#MethodNode]](category=Actuation, output_type=Controlled Mechanical State)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#mechanical-testing]]`
*   **Human-Readable Title:** Applying Controlled Mechanical Stimuli
*   **Description:** Applying defined forces, stresses, strains, displacements, or vibrations. Uses tensile/compression testers (`[yan_soft_2020]`), indentation (`[hu_multi-compartment_2022]`), shakers (`[varela-rosales_granular_2023]`).
*   **Output:** Controlled mechanical stimulus applied to a `[[./materials.md]]` or `[[./css.md#SystemNode]]`.
*   **Links:** Triggers `[[./mechanisms.md#mechanical-transduction]]`. Input for `[[./mechanisms.md#physical-embodied-computation]]`. Induces damage for studying `[[./phenomena.md#self-healing--self-repair]]`. Input for `[[./phenomena.md#energy-harvesting--conversion]]` (`[kwak_optimal_2021]`). Part of `[[#mechanical-property-testing]]`.

#### mechanical-property-testing
*   **Method ID:** `mechanical-property-testing` (`[[./css.md#MethodNode]](category=Characterization, output_type=Mechanical Properties)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#mechanical-testing]]`
*   **Human-Readable Title:** Measuring Mechanical Properties
*   **Description:** Quantifying material response to mechanical stimuli. Includes tensile/compression tests, indentation (AFM `[madhusudanan_relaxation_2024]`), DMA (`[chen_enormous-stiffness-changing_2022]`), rheometry.
*   **Input:** Material (`[[./materials.md]]`), Mechanical Stimulus from `[[#mechanical-input-control]]`.
*   **Output:** Stress-strain curves, Modulus (`[[./css.md#ParameterNode]](name=youngs_modulus)`), Poisson's ratio (`[[./css.md#ParameterNode]](name=poissons_ratio)` `[liao_tunable_2018]`), Hardness, Toughness (`[wegst_bioinspired_2015]`), Adhesion, Viscoelasticity (`[[./css.md#MetricNode]]`).
*   **Links:** Characterizes `[[./phenomena.md#unusual-mechanical-properties]]` (e.g. J-shaped stress-strain `[yan_soft_2020]`). Input for `[[./theoretical.md#continuum-mechanics]]`. Often combined with `[[#microscopy]]`.

### spectroscopy
*   **Method ID:** `spectroscopy` (`[[./css.md#MethodNode]](category=Characterization/Actuation)`) (Represents the overall category)
*   **Human-Readable Title:** Probing Matter with Light and Fields (Category)
*   **Description:** Broad category using electromagnetic radiation or fields to probe or control materials. Includes `[[#spectroscopic-techniques]]` (analysis) and `[[#external-field-control]]` (manipulation).
*   **Links:** See subtypes. Enables/Characterizes `[[./mechanisms.md#optical-transduction]]`, `[[./mechanisms.md#optical-response]]`, `[[./mechanisms.md#chemical-transduction]]`, `[[./mechanisms.md#mechanical-actuation]]`, `[[./mechanisms.md#physical-structural-memory]]`. Related to `[[./theoretical.md#quantum-mechanics]]`.

#### spectroscopic-techniques
*   **Method ID:** `spectroscopic-techniques` (`[[./css.md#MethodNode]](category=Characterization, output_type=Spectral Data)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#spectroscopy]]`
*   **Human-Readable Title:** Analyzing Light-Matter Interaction (Spectroscopy)
*   **Description:** Probing composition, structure, or dynamics via analysis of absorbed/emitted/scattered light/EM radiation. Includes UV-Vis, Fluorescence, IR (FTIR), Raman (SERS `[de_nicola_graphene_2020]`), NMR, EPR, Ellipsometry (`[sasaki_large-scale_2016]`). 2DES (`[cao_quantum_2020]`).
*   **Input:** Material Sample (`[[./materials.md]]`), Incident Radiation.
*   **Output:** Spectra → Chemical identity, Bonds, Electronic states, Conformation, Thickness (`[[./css.md#ParameterNode]]`).
*   **Links:** Characterizes `[[./mechanisms.md#optical-response]]`, `[[./mechanisms.md#chemical-transduction]]`, `[[./mechanisms.md#physical-structural-memory]]`, `[[./mechanisms.md#quantum-coherence-transport]]` (`[cao_quantum_2020]`). Tests materials like polymers (`[urban_key-and-lock_2018]`), dyes (`[bayat_self-indicating_2024]`), quantum systems (`[babcock_ultraviolet_2024]`). Used in validation `[archer_ph-responsive_2020]`.

#### external-field-control
*   **Method ID:** `external-field-control` (`[[./css.md#MethodNode]](category=Actuation, output_type=Controlled Field)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#spectroscopy]]` (overlaps conceptually, but focuses on *control*)
*   **Human-Readable Title:** Controlling Systems with External Fields
*   **Description:** Applying controlled external fields (Magnetic, Electric, Optical/Light, Acoustic) to manipulate system state or behavior. E.g., Magnetic (`[hu_small-scale_2018]`), Electric (`[sasaki_large-scale_2016]`, `[kos_nematic_2022]`), Light (`[lee_nanograin_2023]`, `[lavergne_group_2019]`), Acoustic (`[ziepke_acoustic_2024]`).
*   **Input:** Control signal, Field generation hardware.
*   **Output:** Applied external field to a `[[./css.md#SystemNode]]`.
*   **Links:** Drives `[[./mechanisms.md#mechanical-actuation]]`, `[[./mechanisms.md#optical-transduction]]`, `[[./mechanisms.md#electrical-ionic-transduction]]`, `[[./mechanisms.md#magnetic-transduction]]`. Writes/Reads `[[./mechanisms.md#physical-structural-memory]]`. Drives `[[./mechanisms.md#driven-by-physical-forces-dynamics]` (`[ceron_programmable_2023]`, `[wang_collective_2019]`, `[alapan_shape-encoded_2019]`). Input for `[[#feedback-control-loops]]`. Programs metamaterials (`[louvet_reprogrammable_2024]`, `[barnaveli_pressure-gated_2024]`). Controls particle motion (`[esplandiu_electrophoretic_2020]`).

### thermal-stimuli-control
*   **Method ID:** `thermal-stimuli-control` (`[[./css.md#MethodNode]](category=Actuation, output_type=Controlled Temperature)`)
*   **Human-Readable Title:** Applying Controlled Temperature Changes
*   **Description:** Actively changing and controlling system temperature. Uses heating stages, Peltier elements, ovens, integrated heaters (`[yang_self-amputating_2024]`). Different from passive observation `[[#thermal-analysis-dsc]]`.
*   **Input:** Target temperature/profile, Sample.
*   **Output:** Controlled thermal stimulus.
*   **Links:** Input for `[[./mechanisms.md#thermal-transduction]]`. Triggers thermal `[[./mechanisms.md#mechanical-actuation]` (`[zhao_phase_2021]`). Writes/Erases `[[./mechanisms.md#physical-structural-memory]` (`[lee_shape_2022]`). Drives assembly via `[[./mechanisms.md#driven-by-thermodynamic-statistical-principles]` (annealing `[rothemund_folding_2006]`). Modulates processes (`[hadorn_specific_2016]`, `[foumthuim_solvent_2024]`, `[lin_intelligent_2021]`). Triggers release `[hu_multi-compartment_2022]`. Used with `[[#microscopy]]`, `[[#mechanical-testing]]`.

### chemical-stimuli-control
*   **Method ID:** `chemical-stimuli-control` (`[[./css.md#MethodNode]](category=Actuation, output_type=Controlled Chemical Environment)`)
*   **Human-Readable Title:** Controlling Chemical Environments
*   **Description:** Adding, removing, or changing chemical species (pH, ions, fuel, drugs) to stimulate/perturb a system. Uses pipetting, perfusion (`[[#microfluidics]]` `[thorsen_microfluidic_2002]`), release mechanisms.
*   **Input:** Chemicals, Concentrations, Flow rates, Sample.
*   **Output:** Controlled chemical stimulus.
*   **Links:** Input for `[[./mechanisms.md#chemical-transduction]` (`[wang_liquid_2022]`). Fuels `[[./phenomena.md#autonomous-self-propulsion]` (`[boniface_self-propulsion_2019]`). Triggers `[[./mechanisms.md#chemical-actuation]]`. Modulates memory `[kamsma_chemically_2024]`. Used in bio studies (`[kukushkin_massed-spaced_2024]`). Controls assembly (`[hadorn_specific_2016]`). Used in learning (`[banda_online_2013]`). Controls polymers (`[kim_polymeric_2015]`). Chemotaxis assays (`[cejkova_dynamics_2014]`). Drives phoresis (`[esplandiu_radial_2022]`).

---

## Fabrication and Synthesis Methods

### micro-nano-fabrication
*   **Method ID:** `micro-nano-fabrication` (`[[./css.md#MethodNode]](category=Fabrication)`) (Represents the overall category)
*   **Human-Readable Title:** Building Structures at Micro/Nano Scales (Top-Down)
*   **Description:** Top-down techniques for creating µm/nm features. Includes `[[#lithography]]`, `[[#thin-film-deposition-pvd-cvd-etc]]`, `[[#etching]]`, `[[#soft-lithography]]`. Enables electronics (`[yao_fully_2020]`), MEMS/NEMS (`[tzanov_multi-frequency_2020]`), microfluidics (`[thorsen_microfluidic_2002]`). Key for `[[./theoretical.md#physical-intelligence-pi]]` (`[sitti_physical_2021]`).
*   **Links:** Creates physical devices for testing `[[./mechanisms.md]]`. Creates templates for self-assembly (`[alapan_shape-encoded_2019]`). Output characterized by `[[#microscopy]]`.

#### lithography
*   **Method ID:** `lithography` (`[[./css.md#MethodNode]](category=Fabrication, output_type=Patterned Substrate/Resist)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#micro-nano-fabrication]]`
*   **Human-Readable Title:** Pattern Transfer (Lithography)
*   **Description:** Defining patterns using light, e-beams, or stamps. Creates masks/templates for deposition/etching. E.g., Photolithography (`[luo_highly_2023]`), EBL (`[tzanov_multi-frequency_2020]`). Used for integrated circuits (`[mead_neuromorphic_1990]`, `[yao_fully_2020]`), MEMS/NEMS, templates (`[hu_modular_2023]`), LC alignment patterns (`[sasaki_large-scale_2016]`).
*   **Links:** Core step in `[[#micro-nano-fabrication]]`. Used with `[[#thin-film-deposition-pvd-cvd-etc]]`, `[[#etching]]`.

#### thin-film-deposition-pvd-cvd-etc
*   **Method ID:** `thin-film-deposition-pvd-cvd-etc` (`[[./css.md#MethodNode]](category=Fabrication, output_type=Thin Film Material)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#micro-nano-fabrication]]`
*   **Human-Readable Title:** Thin Layer Deposition
*   **Description:** Depositing thin layers via PVD (sputtering, evaporation) or CVD. Creates electrodes (`[[./materials.md#metals]]` `[de_nicola_graphene_2020]`), dielectrics (`[[./materials.md#oxides]]`), functional layers (`[[./materials.md#graphene--2d-materials]]`), coatings (`[khalil_precise_2015]`).
*   **Links:** Used within `[[#micro-nano-fabrication]]`, often with `[[#lithography]]`.

#### etching
*   **Method ID:** `etching` (`[[./css.md#MethodNode]](category=Fabrication, output_type=Patterned/Structured Material)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#micro-nano-fabrication]]`
*   **Human-Readable Title:** Material Removal (Etching)
*   **Description:** Selective material removal (wet or dry plasma/RIE). Used for shaping structures like MEMS/NEMS (`[tzanov_multi-frequency_2020]`) or nanowires (`[lee_nanograin_2023]`).
*   **Links:** Part of `[[#micro-nano-fabrication]]`, requires `[[#lithography]]`.

#### soft-lithography
*   **Method ID:** `soft-lithography` (`[[./css.md#MethodNode]](category=Fabrication, output_type=Patterned Soft Material/Device)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#micro-nano-fabrication]]`
*   **Human-Readable Title:** Patterning Soft Materials (Soft Lithography)
*   **Description:** Patterning soft materials using elastomeric (e.g., `[[./materials.md#pdms]]`) stamps or molds. Makes microfluidics (`[thorsen_microfluidic_2002]`). Example usage (`[wehner_integrated_2016]`, `[hu_self-reporting_2025]`). Prints magnetic domains (`[xia_dynamic_2022]`).
*   **Materials:** `[[./materials.md#elastomers-general]]`, `[[./materials.md#hydrogels-general]]`.
*   **Links:** Overlaps with `[[#microfluidics]]` fab. Uses master molds from `[[#lithography]]`.

### 3d-printing-additive-manufacturing
*   **Method ID:** `3d-printing-additive-manufacturing` (`[[./css.md#MethodNode]](category=Fabrication, output_type=3D Structure)`)
*   **Human-Readable Title:** 3D Printing & Layer-by-Layer Building
*   **Description:** Layer-by-layer fabrication creating complex 3D geometries. Includes FDM (`[xiao_artificial_2020]`), PolyJet (`[yan_soft_2020]`, `[wehner_integrated_2016]`), SLA, SLS, TPL/DLW (`[alapan_shape-encoded_2019]`). Key for `[[./theoretical.md#physical-intelligence-pi]]`. Soft Robotics `[rus_design_2015]`.
*   **Output:** 3D structures like `[[./materials.md#mechanical-metamaterials]]` (`[louvet_reprogrammable_2024]`, `[bordiga_automated_2024]`).
*   **Links:** Realizes geometries for `[[./mechanisms.md#mechanical-actuation]]`, `[[./mechanisms.md#physical-embodied-computation]]`. Input from `[[#topology-optimization]]`, `[[#ai-driven-design]]`. Prints materials (`[[./materials.md#elastomers-general]]`, `[[./materials.md#hydrogels-general]]`). Used for robots (`[lu_bioinspired_2018]`). Characterized by `[[#mechanical-testing]]`, `[[#microscopy]]`.

### polymer-synthesis-processing
*   **Method ID:** `polymer-synthesis-processing` (`[[./css.md#MethodNode]](category=Fabrication, output_type=Polymer Material)`)
*   **Human-Readable Title:** Creating & Shaping Polymers
*   **Description:** Synthesizing polymers (e.g., ATRP `[urban_key-and-lock_2018]`, ROMP `[kim_polymeric_2015]`) and processing into forms (films `[madhusudanan_relaxation_2024]`, gels, fibers, molding `[thorsen_microfluidic_2002]`). Includes functionalization, crosslinking.
*   **Output:** Specific `[[./materials.md#polymers-and-elastomers]]` or `[[./materials.md#composites]]`. E.g., creates `[[./materials.md#microcapsule-composites]]` (`[hu_multi-compartment_2022]`), smart materials (`[bayat_self-indicating_2024]`).
*   **Links:** Basis for responsive (`[[./mechanisms.md#mechanical-actuation]]`, `[[./mechanisms.md#optical-response]]`, `[[./mechanisms.md#mechanical-transduction]]`) and memory (`[[./mechanisms.md#physical-structural-memory]]`) materials. Defines properties relevant for `[[./mechanisms.md#physical-embodied-computation]]` (`[foumthuim_solvent_2024]`). Relates to `[[./theoretical.md#assembly-theory-at]]`. Feedstock for `[[#3d-printing-additive-manufacturing]]`.

### self-assembly-methods
*   **Method ID:** `self-assembly-methods` (`[[./css.md#MethodNode]](category=Fabrication)`) (Represents the overall category)
*   **Human-Readable Title:** Building Structures Bottom-Up (Self-Assembly Category)
*   **Description:** Exploiting spontaneous organization via local interactions. Key for nanotechnology `[thedford_promise_2023]`. Includes `[[#dna-directed-assembly]]`, `[[#evaporation-driven-assembly]]`, `[[#colloidal-synthesis-assembly]]`, `[[#capillarity-assisted-particle-assembly]]`, `[[#bcp-phase-separation]]`.
*   **Links:** Underpinned by `[[./mechanisms.md#driven-by-thermodynamic-statistical-principles]]`. Creates structures for various mechanisms. Validated by `[[#microscopy]]`. Framework `[[./theoretical.md#assembly-theory-at]]`.

#### dna-directed-assembly
*   **Method ID:** `dna-directed-assembly` (`[[./css.md#MethodNode]](category=Fabrication, output_type=Programmed Nanostructure)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#self-assembly-methods]]`
*   **Human-Readable Title:** Programming Assembly with DNA
*   **Description:** Using specific DNA hybridization (`[[./materials.md#dna]]`) to guide component assembly. E.g., DNA origami/bricks `[rothemund_folding_2006]`, colloid/vesicle assembly `[mcmullen_self-assembly_2022]`, nanoparticle logic `[kim_nanoparticle-based_2020]`.
*   **Links:** Implements `[[./mechanisms.md#driven-by-algorithmic-computational-rules]]`. Driven by `[[./mechanisms.md#driven-by-thermodynamic-statistical-principles]]`. Creates `[[./phenomena.md#discrete-nanostructure-formation]]`. Materials: `[[./materials.md#dna]]`, nanoparticles/colloids. Requires `[[#dna-synthesis-functionalization]]`. Often uses `[[#thermal-stimuli-control]]`. Analyzed via `[[#microscopy]]`.

#### evaporation-driven-assembly
*   **Method ID:** `evaporation-driven-assembly` (`[[./css.md#MethodNode]](category=Fabrication, output_type=Dried Particulate Assembly)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#self-assembly-methods]]`
*   **Human-Readable Title:** Structure Formation by Drying
*   **Description:** Using solvent evaporation to drive assembly of dispersed particles (e.g., `[[./materials.md#other-nanoparticles]]`) into structures like supraparticles (`[hu_shaping_2019]`, `[hu_multi-compartment_2022]`).
*   **Links:** Mechanism `[[./mechanisms.md#driven-by-physical-forces-dynamics]]`. Creates `[[./mechanisms.md#phase-conformation-memory]]`. Materials: Particles, volatile `[[./materials.md#organic-solvents]]`. Characterized by `[[#microscopy]]`.

#### colloidal-synthesis-assembly
*   **Method ID:** `colloidal-synthesis-assembly` (`[[./css.md#MethodNode]](category=Fabrication), output_type=Colloidal Aggregate/Crystal/Nanoparticle)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#self-assembly-methods]]`
*   **Human-Readable Title:** Synthesizing and Assembling Micrometer/Nanometer-Scale Particles
*   **Description:** Methods for synthesizing colloidal particles (e.g., `[[./materials.md#fe3o4-nanoparticles]]`, `[[./materials.md#quantum-dots]]`) and assembling them using weak forces or fields. Creates crystals `[kamsma_brain-inspired_2024]` or aggregates `[ceron_programmable_2023]`. Related work: `[angioletti-uberti_re-entrant_2012]`. Application context (`[tzanov_multi-frequency_2020]` cites related methods).
*   **Links:** Relies on `[[./mechanisms.md#driven-by-physical-forces-dynamics]` or `[[./mechanisms.md#driven-by-thermodynamic-statistical-principles]]`. Creates `[[./phenomena.md#periodic-pattern-formation]]`. Materials: `[[./materials.md#colloidal-particles]]`, `[[./materials.md#other-nanoparticles]]`. Controlled `[[#external-field-control]]`. Observed `[[#microscopy]]`.

#### capillarity-assisted-particle-assembly
*   **Method ID:** `capillarity-assisted-particle-assembly` (`[[./css.md#MethodNode]](category=Fabrication, output_type=Patterned Microparticle Array)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#self-assembly-methods]]`
*   **Human-Readable Title:** Directed Assembly using Capillary Forces (sCAPA)
*   **Description:** Sequential assembly using capillary forces to position microparticles into topographic traps (`[hu_self-reporting_2025]`, `[hu_multi-compartment_2022]`).
*   **Links:** Mechanism `[[./mechanisms.md#driven-by-physical-forces-dynamics]]`. Template needs `[[#micro-nano-fabrication]]`. Output checked `[[#microscopy]]`. Materials: `[[./materials.md#microcapsule-composites]]`.

#### bcp-phase-separation
*   **Method ID:** `bcp-phase-separation` (`[[./css.md#MethodNode]](category=Fabrication, output_type=Nanopatterned Film)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#self-assembly-methods]]`
*   **Human-Readable Title:** Nanopatterning via Block Copolymer Segregation
*   **Description:** Utilizing block copolymer microphase separation into periodic nanomorphologies. Used as templates `[thedford_promise_2023]` or interfaces `[yang_self-amputating_2024]`.
*   **Links:** Driven by `[[./mechanisms.md#driven-by-thermodynamic-statistical-principles]]`. Creates `[[./phenomena.md#periodic-pattern-formation]]`. Requires `[[./materials.md#block-copolymers]]` and often annealing (`[[#thermal-stimuli-control]]`, `[[#chemical-stimuli-control]]`), templating (`[[#micro-nano-fabrication]]`). Characterized `[[#microscopy]]`, `[[#x-ray-techniques]]`.

### biological-construction
*   **Method ID:** `biological-construction` (`[[./css.md#MethodNode]](category=Fabrication, output_type=Biological System/Construct)`)
*   **Human-Readable Title:** Building with Cells and Tissues
*   **Description:** Techniques using `[[./materials.md#living-cells-and-tissues]` or biological processes. Cell culture, tissue engineering (`[gumuskaya_motile_2024]`), genetic engineering (`[elowitz_synthetic_2000]`), differentiation (`[sole_open_2024]`), microinjection (`[levin_multiscale_2024]`), aggregation (`[kriegman_scalable_2020]`), manipulation/surgery (`[maroudas-sacks_topological_2021]`), encapsulation (`[holler_autoselective_2020]`).
*   **Output:** Biological constructs (cell lines, tissues, biobots `[gumuskaya_motile_2024]`).
*   **Links:** Investigates `[[./mechanisms.md#driven-by-biological-processes]]`, `[[./mechanisms.md#biological-plasticity-mechanisms]`. Tests models `[scheidegger_modelling_2020]`, computation (`[harrison_mind_2022]`), memory (`[mcconnell_effects_1959]`). Validates sensors (`[dawson_differential_2023]`). Studies physics `[monzel_energetics_2024]`. Quantum biology `[cao_quantum_2020]`. Requires sterile techniques, `[[#microscopy]]`.

### microfluidics
*   **Method ID:** `microfluidics` (`[[./css.md#MethodNode]](category=Fabrication / Manipulation, output_type=Controlled Fluidic Environment/Products)`)
*   **Human-Readable Title:** Manipulating Fluids at the Microscale
*   **Description:** Controlling small fluid volumes in µm-channels. Includes fabrication (`[[#soft-lithography]]`), flow control (`[gepner_fluidic_2024]`), droplet generation (`[hu_multi-compartment_2022]`), mixing, sorting (`[lentz_low_2019]`). Used for LSI chem (`[thorsen_microfluidic_2002]`). Review `[fair_digital_2007]`.
*   **Output:** Controlled microenvironment, Droplets (`[hadorn_hierarchical_2012]`), Sorted outputs.
*   **Links:** Enables studies of chemical `[[./mechanisms.md#chemical-transduction]]`, ionic `[[./mechanisms.md#electrical-ionic-transduction]` (`[kamsma_chemically_2024]`), assembly (`[mcmullen_self-assembly_2022]`), active matter (`[negi_collective_2024]`). Manipulates swimmers/particles (`[boniface_self-propulsion_2019]`, `[khalil_precise_2015]`). Drug delivery (`[hu_modular_2023]`). Requires `[[#micro-nano-fabrication]]`. Analyzed `[[#microscopy]]`.

### composite-fabrication
*   **Method ID:** `composite-fabrication` (`[[./css.md#MethodNode]](category=Fabrication, output_type=Composite Material)`)
*   **Human-Readable Title:** Making Composite Materials
*   **Description:** General methods for combining filler materials (particles, fibers) with a matrix (polymer, ceramic, metal). Techniques include mixing, infiltration, co-extrusion, layer-by-layer assembly. Specific implementation depends on materials. (Implicit method for creating all `[[./materials.md#composites]]`). Used for `[[./materials.md#piezoresistive-composites]]` (`[thuruthel_soft_2019]`), `[[./materials.md#magneto-elastic-composites]]`, `[[./materials.md#microcapsule-composites]]`, `[[./materials.md#phase-change-composites]]` (`[zhao_phase_2021]`), LCE metamaterials `[li_computational_2024]`. Bioinspired context `[wegst_bioinspired_2015]`.
*   **Input:** Matrix material, Filler material, Processing parameters.
*   **Output:** `[[./materials.md#composites]]`.
*   **Links:** Often relies on `[[#polymer-synthesis-processing]` for matrix or filler coating. May involve `[[#3d-printing-additive-manufacturing]]` or molding.

### dna-synthesis-functionalization
*   **Method ID:** `dna-synthesis-functionalization` (`[[./css.md#MethodNode]](category=Fabrication, output_type=Functionalized DNA/Components)`)
*   **Human-Readable Title:** Preparing DNA for Nanotechnology
*   **Description:** Synthesizing specific DNA sequences (oligonucleotides) and chemically attaching them to other components (e.g., nanoparticles `[lee_shape_2022]`, surfaces, proteins) to enable programmable interactions. Crucial prerequisite for `[[#dna-directed-assembly]]`. (Implicit method in many DNA nanotechnology papers e.g., `[rothemund_folding_2006]`, `[hadorn_specific_2012]`). Includes designing sequences for specific binding (`[ke_three-dimensional_2012]`, `[mcmullen_self-assembly_2022]`) or function (walkers `[sherman_precisely_2004]`, logic gates `[kim_nanoparticle-based_2020]`).
*   **Input:** Nucleotides, Chemical linkers, Components to functionalize (e.g., `[[./materials.md#other-nanoparticles]]`).
*   **Output:** Custom DNA strands, DNA-functionalized components.
*   **Links:** Required for using `[[./materials.md#dna]` as a structural/functional material. Characterized via `[[./methods.md#spectroscopy]]` (UV-Vis), `[[./methods.md#gel-electrophoresis]]`.

### drop-casting
*   **Method ID:** `drop-casting` (`[[./css.md#MethodNode]](category=Fabrication, output_type=Thin Film/Network)`)
*   **Human-Readable Title:** Drop Casting (Simple Film/Network Deposition)
*   **Description:** A simple technique for depositing a thin film or network of material from a solution or suspension by dispensing a droplet onto a substrate and allowing the solvent to evaporate. Used for creating nanowire networks (`[kuncic_emergent_2018]`).
*   **Input:** Solution/suspension of material (e.g., `[[./materials.md#nanowires]]`), Substrate.
*   **Output:** Deposited film or network of material.
*   **Links:** Simpler alternative to `[[#thin-film-deposition-pvd-cvd-etc]]` for some applications. Can be combined with `[[#evaporation-driven-assembly]]`. Characterized by `[[#microscopy]]` and `[[#electrical-measurements]]`.

---

## Observation and Imaging Methods

### microscopy
*   **Method ID:** `microscopy` (`[[./css.md#MethodNode]](category=Characterization, output_type=Image/Video)`)
*   **Human-Readable Title:** Visualizing the Small (Microscopy)
*   **Description:** Techniques magnifying small objects. Optical (Brightfield, Phase, DIC `[hanczyc_fatty_2007]`, Fluorescence/Confocal `[hu_multi-compartment_2022]`, POM `[wang_liquid_2022]`). Electron (SEM `[hu_shaping_2019]`, TEM `[rothemund_folding_2006]`). Scanning Probe (AFM `[madhusudanan_relaxation_2024]`). Pervasive technique.
*   **Input:** Sample, Appropriate sample preparation.
*   **Output:** Images, Videos, Topography maps.
*   **Links:** Essential for visualizing results of `[[#self-assembly-methods]]`, `[[#micro-nano-fabrication]]`, `[[#biological-construction]]`. Validates `[[./phenomena.md]]` like motion (`[cejkova_dynamics_2014]`), patterns (`[sasaki_large-scale_2016]`), healing (`[urban_key-and-lock_2018]`), defects (`[kos_nematic_2022]`). Provides input for `[[#image-video-analysis]]`, `[[#particle-cell-tracking-analysis]]`.

### x-ray-techniques
*   **Method ID:** `x-ray-techniques` (`[[./css.md#MethodNode]](category=Characterization, output_type=Structural/Compositional Data)`)
*   **Human-Readable Title:** Probing Structure with X-Rays
*   **Description:** Using X-ray scattering/absorption to probe atomic/nanoscale structure. XRD (crystallinity `[zhao_phase_2021]`), SAXS/WAXS (nanostructure `[lee_shape_2022]`), XPS (composition), NanoCT (`[chen_enormous-stiffness-changing_2022]`).
*   **Input:** Sample, X-ray source/detector.
*   **Output:** Diffraction patterns, Scattering curves, Spectra → Structural `[[./css.md#ParameterNode]]`s (crystal structure, particle size, crystallinity), Composition.
*   **Links:** Characterizes structures from `[[./mechanisms.md#self-organization--emergence-mechanisms]]`. Probes memory states (`[[./mechanisms.md#physical-structural-memory]]`, phase `[zhao_phase_2021]`). Used for materials like `[[./materials.md#quantum-systems]]`, biomaterials (`[wegst_bioinspired_2015]`), oxides (`[[./materials.md#oxides]]`).

### neuroimaging
*   **Method ID:** `neuroimaging` (`[[./css.md#MethodNode]](category=Characterization, output_type=Brain Activity/Structure Data)`)
*   **Human-Readable Title:** Imaging Brain Structure and Activity
*   **Description:** Measuring brain activity/structure non-invasively. fMRI, MEG, EEG. Used to correlate dynamics with cognition (`[kringelbach_thermodynamics_2024]`).
*   **Input:** Subject (`[[./materials.md#living-cells-and-tissues]]` - Brain), Task/Stimulus.
*   **Output:** Brain activity maps, Network dynamics, Correlations.
*   **Links:** Investigates `[[./mechanisms.md#neuromorphic-computation]]`, collective effects (`[[./mechanisms.md#collective-swarm-computation]]`). Validates FEP (`[parr_active_2022]`). Probes `[[./phenomena.md#criticality--phase-transitions]]` (`[obyrne_how_2022]`). Needs `[[#time-series-analysis]]`, `[[#statistical-analysis]`, `[[#network-modeling]]`.

### particle-cell-tracking-analysis
*   **Method ID:** `particle-cell-tracking-analysis` (`[[./css.md#MethodNode]](category=Analysis, output_type=Trajectory/Dynamic Data)`)
*   **Human-Readable Title:** Tracking and Analyzing Motion
*   **Description:** Extracting quantitative motion/interaction data from time-lapse imagery. Includes tracking, velocity calculation, MSD analysis, order parameter calculation.
*   **Input:** Time-lapse images/video (from `[[#microscopy]]`).
*   **Output:** Trajectories, Velocities, MSD curves (`[negi_collective_2024]`), Order parameters (`[cavagna_scale-free_2010]`), Statistical distributions (`[puy_perceived_2024]`). `[[./css.md#MetricNode]]`s quantifying motion.
*   **Links:** Quantifies `[[./mechanisms.md#driven-by-physical-forces-dynamics]` in active matter (`[goh_hydrodynamic_2023]`). Validates `[[./mechanisms.md#chemical-transduction]` (`[holler_autoselective_2020]`). Characterizes `[[./mechanisms.md#mechanical-actuation]]`. Validates `[[./phenomena.md]]` like `[[./phenomena.md#collective-motion--phase-behavior]]`, `[[./phenomena.md#autonomous-self-propulsion]]`, `[[./phenomena.md#chemotaxis--taxis-behaviors]]`. Needs `[[#image-video-analysis]]` and `[[#statistical-analysis]]`.

---

## Modeling and Simulation Methods

*   **Method ID:** `simulation--modeling-methods` (`[[./css.md#MethodNode]](category=Simulation)`) (Represents overall category)
*   **Human-Readable Title:** Modeling and Simulation Methods (Category)
*   **Description:** Computational techniques used to simulate or model system behavior. Output generally requires `[[#statistical-analysis]]` and `[[#time-series-analysis]]`.

### particle-based-modeling
*   **Method ID:** `particle-based-modeling` (`[[./css.md#MethodNode]](category=Simulation)`) (Category)
*   **Human-Readable Title:** Simulating Systems as Collections of Particles
*   **Description:** Computational methods simulating system dynamics by modeling interactions between discrete entities. Encompasses MD, MC, Langevin, DPD, DEM. Key for `[[#statistical-mechanics--stochastic-thermodynamics]]`.
*   **Links:** Subtypes `[[#molecular-dynamics-md]]`, `[[#monte-carlo-mc]]`, `[[#langevin-dynamics]]`, `[[#dissipative-particle-dynamics-dpd]]`, `[[#discrete-element-method-dem]]`.

#### molecular-dynamics-md
*   **Method ID:** `molecular-dynamics-md` (`[[./css.md#MethodNode]](category=Simulation, output_type=Simulation Trajectory)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#particle-based-modeling]]`
*   **Human-Readable Title:** Simulating Atomic Motion (MD)
*   **Description:** Solves Newton's equations for atoms/molecules using classical force fields `[[./materials.md#molecular-force-fields]]` (`[foumthuim_solvent_2024]`). Includes reactive fields `[zhang_active_2024]`.
*   **Output:** Atomic trajectories, thermodynamic properties (`[[./css.md#ParameterNode]]`), dynamic correlations, free energy landscapes.
*   **Links:** Probes `[[./mechanisms.md#phase-conformation-memory]]`, `[[./phenomena.md#self-healing--self-repair]` (`[urban_key-and-lock_2018]`), thermal properties, transport (`[madhusudanan_relaxation_2024]` context). Complementary to `[[#monte-carlo-mc]]`, `[[#langevin-dynamics]]`.

#### monte-carlo-mc
*   **Method ID:** `monte-carlo-mc` (`[[./css.md#MethodNode]](category=Simulation, output_type=Sampled Configurations/Averages)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#particle-based-modeling]]`
*   **Human-Readable Title:** Statistical Sampling (Monte Carlo)
*   **Description:** Methods using random sampling for numerical results, often simulating equilibrium stat mech via Metropolis (`[koehler_how_2024]`). Can optimize (see `[[#simulated-annealing]]`).
*   **Output:** Equilibrium averages, Phase diagrams (`[angioletti-uberti_re-entrant_2012]`), Optimal configurations.
*   **Links:** Tool for `[[./mechanisms.md#driven-by-thermodynamic-statistical-principles]]`. Validates theory (`[angioletti-uberti_re-entrant_2012]`). Models systems (`[stamps_active_2024]`, `[morningstar_deep_2018]`, `[decelle_inferring_2024]`). Tests robustness `[yang_memristor_2022]`. Needs `[[#statistical-analysis]]`.

#### langevin-dynamics
*   **Method ID:** `langevin-dynamics` (`[[./css.md#MethodNode]](category=Simulation, output_type=Simulation Trajectory)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#particle-based-modeling]]`
*   **Human-Readable Title:** Simulating Brownian Motion (Langevin Dynamics)
*   **Description:** Integrates equations of motion including deterministic forces, friction, and stochastic forces. Describes Brownian motion (`[[./theoretical.md#statistical-mechanics--stochastic-thermodynamics]]`) `[parr_active_2022]`. Includes Active Brownian Particle (ABP) models (`[negi_emergent_2022]`). Foundation for Active Inference `[friston_path_2023]`.
*   **Links:** Simulates dissipative `[[./mechanisms.md#driven-by-physical-forces-dynamics]]`. Models transport `[[./mechanisms.md#energy-flow-dissipation]`. Analyzes `[[./mechanisms.md#memory--adaptation-mechanisms]`. Stochastic version of `[[#molecular-dynamics-md]]`. Links to Fokker-Planck `[[#continuum-modeling]]`.

#### dissipative-particle-dynamics-dpd
*   **Method ID:** `dissipative-particle-dynamics-dpd` (`[[./css.md#MethodNode]](category=Simulation, output_type=Simulation Trajectory)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#particle-based-modeling]]`
*   **Human-Readable Title:** Coarse-Grained Particle Simulation (DPD)
*   **Description:** Mesoscale simulation technique conserving momentum, incorporating conservative, dissipative, and random forces. Used for complex fluids, self-assembly `[mcmullen_self-assembly_2022]`.
*   **Links:** Models `[[./mechanisms.md#equilibrium-self-assembly]]`, complex `[[./mechanisms.md#driven-by-physical-forces-dynamics]]`.

#### discrete-element-method-dem
*   **Method ID:** `discrete-element-method-dem` (`[[./css.md#MethodNode]](category=Simulation, output_type=Simulation Trajectory)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#particle-based-modeling]]`
*   **Human-Readable Title:** Simulating Granular Matter (DEM)
*   **Description:** Simulates motion/interaction of discrete granular particles based on contact mechanics (`[varela-rosales_granular_2023]`).
*   **Output:** Particle trajectories, Forces, Energy dissipation (`[[./css.md#ParameterNode]]`).
*   **Links:** Studies collective behavior in `[[./materials.md#granular-media]]`, `[[./mechanisms.md#energy-flow-dissipation]]`, `[[./phenomena.md#clustering--aggregation--phase-separation]]`.

### agent-based-modeling-abm
*   **Method ID:** `agent-based-modeling-abm` (`[[./css.md#MethodNode]](category=Simulation, output_type=Agent States/Trajectories)`)
*   **Human-Readable Title:** Simulating Systems of Interacting Agents (ABM)
*   **Description:** Computational simulation of autonomous agents following local rules in an environment. Focuses on emergence from local interactions. Tool for `[[./theoretical.md#collective-intelligence-conceptual]]` (`[couzin_collective_2009]`). Models bio (`[march-pons_honeybee-like_2024]`, `[theraulaz_spatial_2002]`), robotic (`[rubenstein_programmable_2014]`), or conceptual (`[schmickl_how_2016]`) systems.
*   **Output:** Agent states/trajectories, Global metrics (`[[./css.md#MetricNode]]`), Emergent `[[./phenomena.md]]`.
*   **Links:** Simulates `[[./mechanisms.md#collective-swarm-computation]]`, `[[./mechanisms.md#driven-by-algorithmic-computational-rules]]`. Explores `[[./mechanisms.md#self-organization--emergence-mechanisms]]`. Models learning `[lowen_towards_2025]`. Needs `[[#statistical-analysis]]`.

### continuum-modeling
*   **Method ID:** `continuum-modeling` (`[[./css.md#MethodNode]](category=Simulation)`) (Category)
*   **Human-Readable Title:** Modeling Systems as Continuous Fields
*   **Description:** Representing systems via continuous fields (stress, concentration, order parameter) governed by PDEs from `[[./theoretical.md#continuum-mechanics]]`, `[[./theoretical.md#liquid-crystal-theory]]`, `[[./theoretical.md#reaction-diffusion-systems]]`, transport theory (`[freitas_emergent_2022]`, `[kamsma_iontronic_2023]`).
*   **Links:** Includes subtypes `[[#finite-element-method-femfea]]`, `[[#numerical-ode-pde-solvers]]`. Complements `[[#particle-based-modeling]]`. Requires `[[#mathematical-analysis]]`.

#### finite-element-method-femfea
*   **Method ID:** `finite-element-method-femfea` (`[[./css.md#MethodNode]](category=Simulation, output_type=Field Distribution)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#continuum-modeling]]`
*   **Human-Readable Title:** Numerical Mechanics Simulation (FEM/FEA)
*   **Description:** Numerical technique solving PDEs governing mechanics (stress, strain, deformation) by discretizing domain. Handles complex geometry/nonlinearity. Models metamaterials (`[jiao_mechanical_2023-1]`), LCEs (`[li_computational_2024]`), robotics (`[bordiga_automated_2024]`), MEMS (`[tzanov_multi-frequency_2020]`). Chemo-mechanics (`[boniface_self-propulsion_2019]`). Electrokinetics (`[esplandiu_electrophoretic_2020]`).
*   **Output:** Stress/strain distributions, displacement fields, load-response curves.
*   **Links:** Core of `[[#continuum-modeling]]` for mechanics. Validates `[[./mechanisms.md#mechanical-actuation]]`, `[[./mechanisms.md#physical-embodied-computation]]`. Needs material parameters from `[[#mechanical-testing]]`. Used in `[[#inverse-design]]`.

#### numerical-ode-pde-solvers
*   **Method ID:** `numerical-ode-pde-solvers` (`[[./css.md#MethodNode]](category=Simulation, output_type=Numerical Solution to DEs)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#continuum-modeling]]`
*   **Human-Readable Title:** Solving Differential Equations Numerically
*   **Description:** Algorithms (Euler, RK, Finite Difference, Spectral) for solving ODEs/PDEs. Underpins `[[#continuum-modeling]]`, `[[#network-modeling]]`, some `[[#particle-based-modeling]]`. Examples: CPNs `[lin_intelligent_2021]`, Active Inference `[friston_free_2023]`, RL training `[lowen_towards_2025]`. FEP dynamics `[friston_path_2023]`.
*   **Links:** Required for simulating dynamics from `[[./theoretical.md#dynamical-systems-theory]]`, `[[./theoretical.md#reaction-diffusion-systems]]`, Langevin/Fokker-Planck, LC theory `[zhang_logic_2022]`, FEP flows `[ramstead_bayesian_2023]`.

### network-modeling
*   **Method ID:** `network-modeling` (`[[./css.md#MethodNode]](category=Simulation / Analysis)`) (Category)
*   **Human-Readable Title:** Analyzing/Simulating Networks
*   **Description:** Constructing, simulating, and analyzing systems as networks based on `[[./theoretical.md#network-theory]]`. Includes subtypes `[[#network-topology-analysis]]`, `[[#artificial-neural-networks]]`, `[[#chemical-pathway-network-modeling]]`.
*   **Links:** Studies `[[./mechanisms.md#neuromorphic-computation]]`, `[[./mechanisms.md#collective-swarm-computation]]`, self-organization. Models physical systems (`[kuncic_emergent_2018]`). Analyses criticality (`[obyrne_how_2022]`). FEP `[friston_free-energy_2010]`. Immune net `[chen_synthetic_2024]`.

#### network-topology-analysis
*   **Method ID:** `network-topology-analysis` (`[[./css.md#MethodNode]](category=Analysis, output_type=Topological Metrics)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#network-modeling]]`
*   **Human-Readable Title:** Analyzing Network Structure
*   **Description:** Calculating metrics describing network structure (degree, clustering, paths, centrality, communities, topology `[millan_topology_2025]`). Applies `[[./theoretical.md#network-theory]]`. Used in `[march-pons_consensus_2024]`, `[negi_collective_2024]`.
*   **Output:** Structural metrics (`[[./css.md#MetricNode]]`), Community assignments.
*   **Links:** Requires network structure input. Results inform analysis of dynamics or `[[./mechanisms.md]]`.

#### artificial-neural-networks
*   **Method ID:** `artificial-neural-networks` (`[[./css.md#MethodNode]](category=Simulation / Analysis, output_type=Trained Model/Predictions)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#network-modeling]]`
*   **Human-Readable Title:** Using Artificial Neural Networks (ANNs)
*   **Description:** Implementing/simulating ANNs (Feedforward, RNNs `[yang_task_2019]`, CNNs `[yao_fully_2020]`, Boltzmann `[aguilera_exploring_2018]`, ESNs `[nakajima_information_2015]`, LLMs `[heyman_supermind_2024]`). Using specific activations `[feng_optimal_2020]`.
*   **Output:** Trained models, Predictions/Classifications (`[[./phenomena.md#classification--regression-performance]]`), internal representations.
*   **Links:** Simulates `[[./mechanisms.md#neuromorphic-computation]]`. Readout for `[[./mechanisms.md#reservoir-computing]]`. Policies for `[[#reinforcement-learning]]`. Fit sensor data (`[luo_machine-learning-assisted_2022]`). Model cognition (`[benjamin_role_2023]`). Inverse design `[paixao_leveraging_2022]`. Training via `[[#backpropagation-and-training]]`. Evaluation `[[#ml-classificationregression-svm-mlp-k-means-som]]`. Metamaterials (`[chen_metamaterials_2023]`, `[malevich_very-large-scale_2025]`). Theory `[seung_statistical_1992]`.

#### chemical-pathway-network-modeling
*   **Method ID:** `chemical-pathway-network-modeling` (`[[./css.md#MethodNode]](category=Simulation, output_type=Concentration Time Courses)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#network-modeling]]`
*   **Human-Readable Title:** Modeling Chemical Reaction Networks
*   **Description:** Simulating dynamics of chemical species based on reaction kinetics. Uses ODEs. Basis for Artificial Chemistries `[harrison_mind_2022]`. Examples: CPNs `[lin_intelligent_2021]`, GRNs `[elowitz_synthetic_2000]`, metabolic nets `[monzel_energetics_2024]`. Chemotaxis sensing `[wadhams_making_2004]`. Assembly kinetics `[sharma_assembly_2023]`. Logic (`[banda_online_2013]`). Cascades (`[kim_polymeric_2015]`). OoL `[xavier_autocatalytic_2020]`. Proofreading `[sartori_thermodynamics_2015]`.
*   **Output:** Concentration time courses, Steady states, Bifurcations.
*   **Links:** Models `[[./mechanisms.md#chemical-transduction]]`, `[[./mechanisms.md#chemical-actuation]]`, `[[./mechanisms.md#driven-by-thermodynamic-statistical-principles]]`, oscillations (`[[./phenomena.md#dynamic-chemicalcellular-patterns]]`). Requires `[[#numerical-ode-pde-solvers]]`.

### quantum-simulation
*   **Method ID:** `quantum-simulation` (`[[./css.md#MethodNode]](category=Simulation, output_type=Quantum States/Observables)`)
*   **Human-Readable Title:** Simulating Quantum Mechanical Systems
*   **Description:** Computational methods for simulating the behavior of quantum systems, such as solving the Schrödinger equation, density matrix evolution, or quantum Monte Carlo. Used for studying `#quantum-coherent-effects` (`[cao_quantum_2020]`, `[sakurai_quantum_2022]`).
*   **Output:** Wavefunctions, Density matrices, Expectation values of observables, Energy spectra.
*   **Links:** Models `[[./materials.md#quantum-systems]]`. Investigates `[[./mechanisms.md#quantum-coherence-transport]]`. Complements experimental `#spectroscopy`.
*   **Related Concepts:** `[[./theoretical.md#quantum-mechanics]]`.

---

## Data Analysis and Learning Methods

### statistical-analysis
*   **Method ID:** `statistical-analysis` (`[[./css.md#MethodNode]](category=Analysis, output_type=Statistical Results)`)
*   **Human-Readable Title:** Analyzing Data Statistically
*   **Description:** Extracting meaning via statistical principles: descriptives (mean, variance `[goh_hydrodynamic_2023]`), distributions (`[puy_signatures_2024]`), correlations (`[maroudas-sacks_topological_2021]`), spectral analysis (PSD `[kuncic_emergent_2018]`), hypothesis tests (`[boussard_memory_2019]`), scaling (`[cavagna_scale-free_2010]`, `[mugica_scale-free_2022]`). Underpins fluctuation analysis (`[[./theoretical.md#statistical-mechanics--stochastic-thermodynamics]]`). Used in info theory `[aguilera_exploring_2018]`.
*   **Output:** `[[./css.md#MetricNode]]`s, `[[./css.md#ParameterNode]]`s, Distributions, p-values.
*   **Links:** Essential validation tool for experiments/simulations. Validates `[[./phenomena.md#scale-free-dynamics--criticality]]`. Analyses collective behavior (`[masila_emergence_2023]`). Evaluates ML `[[#ml-classificationregression-svm-mlp-k-means-som]]`. Often requires `[[#time-series-analysis]]`.

### time-series-analysis
*   **Method ID:** `time-series-analysis` (`[[./css.md#MethodNode]](category=Analysis, output_type=Temporal Analysis Results)`)
*   **Human-Readable Title:** Analyzing Data Over Time
*   **Description:** Techniques for sequential data. PSD `[kuncic_emergent_2018]`, Correlation funcs (`[cavagna_scale-free_2010]`), RQA `[yang_emergent_2022]`, MSD `[negi_emergent_2022]`, Fourier/Wavelet `[elowitz_synthetic_2000]`. Analyzes trajectories (`[[#particle-cell-tracking-analysis]]`).
*   **Output:** Frequencies, Periods, Correlation times, Exponents (`[[./css.md#MetricNode]]`), Dynamical states.
*   **Links:** Investigates `[[./theoretical.md#dynamical-systems-theory]]`, oscillations (`[scheidegger_modelling_2020]`), memory timescales (`[[./mechanisms.md#dynamic-state-memory]]`). Used in thermo (`[dieball_direct_2023]`) and neuro analysis (`[kringelbach_thermodynamics_2024]`, `[obyrne_how_2022]`). Analyzes `[[./phenomena.md#scale-free-dynamics--criticality]]`, `[[./phenomena.md#dynamic-chemicalcellular-patterns]]`.

### image-video-analysis
*   **Method ID:** `image-video-analysis` (`[[./css.md#MethodNode]](category=Analysis, output_type=Quantitative Image Features)`)
*   **Human-Readable Title:** Extracting Information from Images/Videos
*   **Description:** Computational techniques for image/video data. Tracking (`[[#particle-cell-tracking-analysis]]`), feature extraction (shape `[lee_shape_2022]`), texture, PIV `[alapan_shape-encoded_2019]`, DIC `[bordiga_automated_2024]`. Used for classification `[gumuskaya_motile_2024]`.
*   **Input:** Images/Videos (from `[[#microscopy]]`).
*   **Output:** Trajectories, Velocities (`[[./phenomena.md#velocity-fields]]`), Shape parameters, Texture maps, Object counts, Intensity maps (`[elowitz_synthetic_2000]`).
*   **Links:** Quantifies `[[./mechanisms.md#self-organization--emergence-mechanisms]]`. Tracks `[[./mechanisms.md#mechanical-actuation]` (`[son_emergent_2024]`). Reads visual `[[./mechanisms.md#optical-response]` (`[hu_self-reporting_2025]`). Validates assembly `[hu_multi-compartment_2022]`. Sensory perception `[luo_machine-learning-assisted_2022]`. Tracks repair `[grodstein_closing_2023]`. Validates transport `[holler_autoselective_2020]`. Used for microrobots `[yao_nematic_2022]`.

### information-theory-metrics
*   **Method ID:** `information-theory-metrics` (`[[./css.md#MethodNode]](category=Analysis, output_type=Information Quantities)`)
*   **Human-Readable Title:** Quantifying Information Theoretic Measures
*   **Description:** Calculation of metrics from `[[./theoretical.md#information-theory]]` (Shannon entropy H, mutual info I, transfer entropy, KL divergence, complexity). Used in FEP (`[[./theoretical.md#active-inference-fep]]`).
*   **Input:** Probability distributions, Time series data.
*   **Output:** H, I, KL Divergence, etc. (`[[./css.md#MetricNode]]`).
*   **Links:** Quantifies `[[./mechanisms.md#information-processing--computation-mechanisms]]`. Measures `[[./mechanisms.md#memory--adaptation-mechanisms]` capacity (`[boussard_memory_2019]`). Evaluates models (`[benjamin_role_2023]`). Measures complexity (`[feng_optimal_2020]`). Cost analysis `[[./theoretical.md#thermodynamics-of-information]]` (`[sartori_thermodynamic_2014]`). Links to physics (`[bryant_physical_2023]`). Used in neuro (`[kringelbach_thermodynamics_2024]`) & agent (`[aguilera_exploring_2018]`) analysis.

### ml-classificationregression-svm-mlp-k-means-som
*   **Method ID:** `ml-classificationregression-svm-mlp-k-means-som` (`[[./css.md#MethodNode]](category=Analysis / Computation, output_type=Model Predictions/Cluster Assignments)`)
*   **Human-Readable Title:** Machine Learning (Classification, Regression, Clustering)
*   **Description:** Learning patterns from data. Supervised: SVM, MLP (`[[#artificial-neural-networks]]`). Unsupervised: K-Means, SOM (`[horibe_mode_2011]`). Use cases: Pattern recognition (`[yao_fully_2020]`), sensor interpretation (`[dawson_differential_2023]`, `[luo_machine-learning-assisted_2022]`), simulation analysis (`[koehler_how_2024]`), behavior classification (`[gumuskaya_motile_2024]`). RL (`[[#reinforcement-learning]]`). Model discovery (`[zhang_active_2024]`). Inverse design (`[paixao_leveraging_2022]`). Supermind tool (`[heyman_supermind_2024]`). Biological response analysis (`[kukushkin_massed-spaced_2024]`). Readout for phys comp (`[kamsma_brain-inspired_2024]`).
*   **Output:** Trained Models, Predictions, Cluster assignments, Performance `[[./css.md#MetricNode]]`.
*   **Links:** Evaluates `[[./mechanisms.md#information-processing--computation-mechanisms]]`. Validates sensing (`[[./phenomena.md#classification--regression-performance]]`). Part of `[[./mechanisms.md#algorithmic-adaptation-learning]]`. Trained via `[[#optimization-algorithms]]`. Evaluated `[[#statistical-analysis]]`.

### optimization-algorithms
*   **Method ID:** `optimization-algorithms` (`[[./css.md#MethodNode]](category=Analysis / Design)`) (Category)
*   **Human-Readable Title:** Finding Optimal Parameters/Designs
*   **Description:** Algorithms finding min/max of objective function. Gradient Descent (`[li_training_2024]`), EA (`[howard_evolving_2019]`), SA (`[[#simulated-annealing]]`), PSO, Bayesian Optimization (`[zhang_edge_2021]`), MMA (`[bordiga_automated_2024]`). Used in ML training (`[[#ml-classificationregression-svm-mlp-k-means-som]]`, `[[#reinforcement-learning]]`, `[[#backpropagation-and-training]]`).
*   **Links:** Subtypes `[[#backpropagation-and-training]]`, `[[#reinforcement-learning]]`, `[[#evolutionary-algorithms]]`, `[[#topology-optimization]]`, `[[#inverse-design]]`. Drives `[[./mechanisms.md#algorithmic-adaptation-learning]]`. Basis for `[[#inverse-design]]`. Evaluated via `[[#simulation--modeling-methods]]`.

#### backpropagation-and-training
*   **Method ID:** `backpropagation-and-training` (`[[./css.md#MethodNode]](category=Computation, output_type=Trained ANN Weights)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#optimization-algorithms]]`
*   **Human-Readable Title:** Training Neural Networks (Backpropagation)
*   **Description:** Core supervised learning for `[[#artificial-neural-networks]]`. Calculates loss gradient w.r.t. weights via chain rule for updates. Variants (`[wright_deep_2022]`). Analogues (`[li_training_2024]`).
*   **Links:** Implements `[[./mechanisms.md#supervised-learning-algorithms]]`. Used for `[[./mechanisms.md#neuromorphic-computation]]`. Basis for RL `[benjamin_role_2023]`. Theory (`[feng_optimal_2020]`). Training for applications (`[rauba_self-healing_2024]`).

#### reinforcement-learning
*   **Method ID:** `reinforcement-learning` (`[[./css.md#MethodNode]](category=Computation, output_type=Learned Policy/Value Function)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#optimization-algorithms]]`
*   **Human-Readable Title:** Learning from Rewards (Reinforcement Learning)
*   **Description:** Agents learn policies by interaction and rewards. Includes Q-learning, Policy Gradients, Actor-Critic. Use cases: control (`[lowen_towards_2025]`), robotics (`[zhao_exploring_2024]`, `[paixao_leveraging_2022]` design), cognition modeling (`[seifert_reinforcement_2024]`, `[aguilera_exploring_2018]`).
*   **Links:** Implements `[[./mechanisms.md#reinforcement-learning-algorithms]]`. Uses `[[#optimization-algorithms]]`. Drives phenomena `[[./phenomena.md#learning--adaptive-behavior]]`.

#### evolutionary-algorithms
*   **Method ID:** `evolutionary-algorithms` (`[[./css.md#MethodNode]](category=Design), output_type=Optimized Design/Controller)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#optimization-algorithms]]`
*   **Human-Readable Title:** Optimization via Simulated Evolution
*   **Description:** Population-based optimization inspired by evolution (selection, mutation, crossover). GAs, ES, GP, Illumination Algs (`[howard_evolving_2019]`). Use cases: design/control (`[howard_evolving_2019]`, `[kriegman_scalable_2020]`, `[fuchslin_evolving_2006]`, `[scheidegger_modelling_2020]`, `[banda_online_2013]`, `[falk_learning_2023]`).
*   **Links:** Implements `[[./mechanisms.md#evolutionary-algorithms]]`. Requires fitness evaluation via `[[#simulation--modeling-methods]]`.

#### topology-optimization
*   **Method ID:** `topology-optimization` (`[[./css.md#MethodNode]](category=Design), output_type=Optimized Material Topology)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#optimization-algorithms]]`
*   **Human-Readable Title:** Designing Material Structure for Function
*   **Description:** Computational methods optimizing material distribution for functional objective (`[bordiga_automated_2024]`). Uses gradient methods + simulation (`[li_computational_2024]`).
*   **Output:** Optimized topology.
*   **Links:** Designs structures embodying `[[./mechanisms.md#physical-embodied-computation]]`. Relies on `[[#finite-element-method-femfea]]`, `[[#optimization-algorithms]]`. Designs `[[./materials.md#mechanical-metamaterials]]`, LCEs (`[li_computational_2024]`).

#### inverse-design
*   **Method ID:** `inverse-design` (`[[./css.md#MethodNode]](category=Design), output_type=Candidate Design/Parameters)`)
*   **Human-Readable Title:** Finding Designs for Target Functions
*   **Description:** Specify target function, find design/parameters that produce it using optimization/ML (`[chen_metamaterials_2023]`). Uses `[[#topology-optimization]]`, `[[#evolutionary-algorithms]]`, `[[#artificial-neural-networks]]`. Use cases: metamaterials (`[chen_metamaterials_2023]`), robots (`[howard_evolving_2019]`, `[kriegman_scalable_2020]`), molecules. PI link `[sitti_physical_2021]`. Chemistry `[pervan_algorithmic_2020]`. Adaptive mats `[paixao_leveraging_2022]`. Materials (`[falk_learning_2023]`).
*   **Links:** Finds structures implementing desired `[[./mechanisms.md]]`. Relies on `[[#optimization-algorithms]]`, `[[#ml-classificationregression-svm-mlp-k-means-som]]`, `[[#simulation--modeling-methods]]`.

#### simulated-annealing
*   **Method ID:** `simulated-annealing` (`[[./css.md#MethodNode]](category=Optimization/Simulation, output_type=Optimized Configuration/Ground State)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#optimization-algorithms]]`, `[[#monte-carlo-mc]]`
*   **Human-Readable Title:** Simulated Annealing (Optimization via Cooling)
*   **Description:** A probabilistic technique for approximating the global optimum of a given function. Largely used in optimization problems, it is a metaheuristic that simulates the physical process of heating a material and then slowly lowering the temperature to decrease defects, thus minimizing system energy. Used for finding ground states (`[stamps_active_2024]`).
*   **Output:** Globally (or near-globally) optimized configuration or parameter set.
*   **Links:** A specific type of Monte Carlo method. Used in design and optimization problems, e.g., finding low-energy states of complex systems.

### feedback-control-loops
*   **Method ID:** `feedback-control-loops` (`[[./css.md#MethodNode]](category=Control), output_type=Controlled System State)`)
*   **Human-Readable Title:** Closing the Loop: Feedback Control Implementation
*   **Description:** Control systems where output is measured and fed back to influence input. Formalized by Control Theory (`[[./theoretical.md#control-theory]]`). Foundational for robotics (`[khalil_precise_2015]`), active inference (`[parr_active_2022]`). Applied (`[yao_fully_2020]`, `[jiao_mechanical_2023]`). Regulation (`[huang_self-regulation_2018]`). Chem (`[banda_online_2013]`). Collective (`[rubenstein_programmable_2014]`). MC (`[fuchslin_morphological_2013]`). Thermo (`[parrondo_thermodynamics_2015]`). Learning (`[buckley_natural_2024]`). NEMS (`[tzanov_multi-frequency_2020]`). Bio (`[wadhams_making_2004]`).
*   **Links:** Implements adaptive `[[./mechanisms.md#algorithmic-adaptation-learning]]`. Basis for homeostasis `[[./phenomena.md#morphogenesis--regeneration--homeostasis]]`. Sensorimotor loop (`[santoli_nanomacro-integrated_2010]`). Needs sensors (`[[./mechanisms.md#information-interface-sensing--transduction-mechanisms]]`), actuators (`[[./mechanisms.md#actuation--response-mechanisms]]`), controllers (`[[#optimization-algorithms]]` for design).

### theoretical-framework-application
*   **Method ID:** `theoretical-framework-application` (`[[./css.md#MethodNode]](category=Analysis, output_type=Interpretations/Predictions)`)
*   **Human-Readable Title:** Applying Abstract Conceptual Models
*   **Description:** Using specific named theories from `[[./theoretical.md]]` as analytical tools. Applying FEP (`[friston_free_2023]`), Bayesian Mechanics (`[ramstead_bayesian_2023]`), info theory (`[aguilera_exploring_2018]`), stochastic thermo (`[ritort_nonequilibrium_2024]`), criticality (`[obyrne_how_2022]`), network theory (`[shaberi_optimal_2025]`), etc., to interpret observations or guide modeling. Applies minimal cognition (`[rouleau_multiple_2023]`), PI (`[sitti_physical_2021]`).
*   **Links:** Structures understanding of `[[./mechanisms.md]]`. Guides model selection `[[#simulation--modeling-methods]]`. Complements `[[#statistical-analysis]]`. Requires understanding `[[./theoretical.md]]`.

### mathematical-analysis
*   **Method ID:** `mathematical-analysis` (`[[./css.md#MethodNode]](category=Analysis, output_type=Mathematical Proofs/Derivations)`)
*   **Human-Readable Title:** Rigorous Mathematical Derivations and Proofs
*   **Description:** Formal math techniques (calculus, algebra, topology `[maroudas-sacks_topological_2021]`, geometry, probability `[seung_statistical_1992]`, graph theory `[sakurai_quantum_2022]`) to derive results, bounds, stability, prove properties. Used for TURs (`[ziyin_universal_2023]`), active matter (`[pak_generalized_2014]`), phase diagrams (`[angioletti-uberti_re-entrant_2012]`). Stability (`[shaberi_optimal_2025]`). Learning (`[seung_statistical_1992]`). Quantum (`[goettems_physics_2024]`). Morphological Comp (`[hauser_towards_2011-1]`). Category theory `[yuan_categorical_2023]`.
*   **Output:** Proofs, Derived equations, Theorems, Bounds.
*   **Links:** Validates `[[./theoretical.md]]`. Foundation for modeling `[[#continuum-modeling]]`. Different from `#statistical-analysis`. Basis for `[[#theoretical-framework-application]]`.

### miscellaneous-characterization
*   **Method ID:** `miscellaneous-characterization` (`[[./css.md#MethodNode]](category=Characterization)`) (Represents the overall category)
*   **Human-Readable Title:** Other Characterization Techniques (Category)
*   **Description:** Other experimental methods used for characterization, not fitting neatly into primary categories.

#### dynamic-light-scattering
*   **Method ID:** `dynamic-light-scattering` (`[[./css.md#MethodNode]](category=Characterization, output_type=Particle Size Distribution)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#miscellaneous-characterization]]`
*   **Human-Readable Title:** Dynamic Light Scattering (DLS)
*   **Description:** Measures size distribution of small particles/molecules in suspension by analyzing fluctuations in scattered light intensity due to Brownian motion. (Likely used for characterizing materials like `[[./materials.md#other-nanoparticles]]`, `[[./materials.md#colloidal-particles]]`, etc., - commonly associated).
*   **Output:** Particle size distribution, hydrodynamic radius (`[[./css.md#ParameterNode]]`).

#### gel-electrophoresis
*   **Method ID:** `gel-electrophoresis` (`[[./css.md#MethodNode]](category=Characterization, output_type=Separated Molecules (Size/Charge))`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#miscellaneous-characterization]]`
*   **Human-Readable Title:** Gel Electrophoresis
*   **Description:** Separating macromolecules (DNA `[ke_three-dimensional_2012]`, RNA, proteins) based on size/charge by driving them through a gel matrix with an electric field. Standard biochemical analysis.
*   **Output:** Band patterns indicating size/presence of molecules.
*   **Links:** Characterizes outputs of `[[#dna-synthesis-functionalization]]`. Validates `[[#dna-directed-assembly]]` products.

#### magnetic-measurements
*   **Method ID:** `magnetic-measurements` (`[[./css.md#MethodNode]](category=Characterization, output_type=Magnetic Properties)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#miscellaneous-characterization]]`
*   **Human-Readable Title:** Measuring Magnetic Properties
*   **Description:** Techniques to measure magnetic properties, such as Vibrating Sample Magnetometry (VSM), SQUID magnetometry (`[wegst_bioinspired_2015]`).
*   **Input:** Material sample, Applied magnetic field.
*   **Output:** Magnetization curves (M-H loops), Magnetic susceptibility (`[[./css.md#ParameterNode]]`), Coercivity, Remanence (`[[./css.md#MetricNode]]`).
*   **Links:** Characterizes `[[./materials.md#ferromagnetic-materials]]`, `[[./materials.md#fe3o4-nanoparticles]]`. Needed for understanding `[[./mechanisms.md#magnetic-transduction]` and related phenomena.

#### biological-assays
*   **Method ID:** `biological-assays` (`[[./css.md#MethodNode]](category=Characterization, output_type=Biological Activity/Concentration)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#miscellaneous-characterization]]`
*   **Human-Readable Title:** Biological Assays
*   **Description:** Experimental protocols to quantify biological activity, presence/concentration of specific biomolecules, or cell state/response. E.g., ELISAs, Western Blots, PCR, flow cytometry, cell viability assays, functional screens (`[holler_autoselective_2020]` Implicitly). Required for characterizing outputs of `[[#biological-construction]]` and effects of agents on `[[./materials.md#living-cells-and-tissues]]`. (Implicitly used in many biological studies e.g. `[gumuskaya_motile_2024]`, `[monzel_energetics_2024]`).
*   **Output:** Quantitative measures of biological function/state.

#### thermomechanical-programming
*   **Method ID:** `thermomechanical-programming` (`[[./css.md#MethodNode]](category=Fabrication / Actuation, output_type=Programmed Material Shape)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#miscellaneous-characterization]]` (but closer to Actuation/Fabrication)
*   **Human-Readable Title:** Programming Shape Memory Materials
*   **Description:** Process of setting the temporary shape in a shape memory material (e.g., `[[./materials.md#shape-memory-polymers-smps]]`) by deforming it above its transition temperature, cooling under constraint, and then removing the constraint. Key for utilizing `[[./mechanisms.md#shape-memory]]`. Referenced in `[terryn_review_2021]`.
*   **Links:** Required method to enable the `[[./phenomena.md#shape-memory-effect]]`. Involves `[[#thermal-stimuli-control]]` and `[[#mechanical-input-control]]`.

#### surface-functionalization
*   **Method ID:** `surface-functionalization` (`[[./css.md#MethodNode]](category=Fabrication, output_type=Chemically Modified Surface)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#miscellaneous-characterization]]` (but closer to Fabrication)
*   **Human-Readable Title:** Modifying Surface Chemistry
*   **Description:** Chemical modification of surfaces to alter properties like wettability, adhesion, or to attach specific molecules (e.g., for alignment `[[./materials.md#nematic-lcs]]`, binding `[[./materials.md#dna]]`, sensing `[[./mechanisms.md#chemical-transduction]]`). E.g., LC alignment layers `[wang_liquid_2022]`. Coating electrodes `[de_nicola_graphene_2020]`. Used in many nanoscale applications (`[thedford_promise_2023]`). Implicit for DNA on vesicles (`[hadorn_specific_2012]`), peptides on surfaces (`[dawson_differential_2023]`).
*   **Links:** Enables `[[#dna-directed-assembly]]`. Creates interaction sites for self-assembly or sensing. Changes material surface properties (`[[./css.md#ParameterNode]](role=MaterialProperty)`).

#### biological-manipulation
*   **Method ID:** `biological-manipulation` (`[[./css.md#MethodNode]](category=Actuation/Fabrication, output_type=Manipulated Biological System)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#miscellaneous-characterization]]` (can be complex)
*   **Human-Readable Title:** Manipulating Biological Systems
*   **Description:** Techniques for physically or chemically altering biological samples, such as microinjection, cell sorting, surgical manipulation, or targeted drug/gene delivery at the cellular/tissue level (`[levin_multiscale_2024]` context, `[kriegman_scalable_2020]` embryo manipulation).
*   **Links:** Used in `[[#biological-construction]]`. Can be a form of `[[#chemical-stimuli-control]]` or `[[#mechanical-input-control]]` at small scales.

#### modeling-cell--tissue
*   **Method ID:** `modeling-cell--tissue` (`[[./css.md#MethodNode]](category=Simulation, output_type=Cell/Tissue Model Predictions)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#simulation--modeling-methods]]`
*   **Human-Readable Title:** Modeling Cell and Tissue Dynamics
*   **Description:** Computational models specifically focused on simulating cellular behaviors, cell-cell interactions, tissue mechanics, and morphogenesis. Often multi-scale, combining aspects of `#agent-based-modeling-abm` (for cells) and `#continuum-modeling` (for tissue-level fields or environment). E.g., Cellular Potts Model, vertex models (`[scheidegger_modelling_2020]`).
*   **Output:** Simulated tissue structures, cell migration patterns, morphogenetic dynamics.
*   **Links:** Used to study `[[./mechanisms.md#driven-by-biological-processes]]`, `[[./phenomena.md#morphogenesis--regeneration--homeostasis]]`. Complements experimental `[[#biological-construction]]` and `[[#microscopy]]`.

---
