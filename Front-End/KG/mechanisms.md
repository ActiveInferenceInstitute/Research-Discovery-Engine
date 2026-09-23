# Mechanisms: Core Processes of Material Cognition

**Description:** This document details the fundamental processes (nodes defined via `[[./css.md#MechanismNode]]`) identified across the analyzed literature that enable or constitute cognitive-like functions in materials and embodied systems. These mechanisms act as the functional 'verbs', transforming energy and information, updating states, driving adaptation, generating responses, and creating emergent structures. Each mechanism is linked to relevant `[[./theoretical.md]]`, `[[./methods.md]]`, `[[./materials.md]]`, `[[./phenomena.md]]`, and related mechanisms.

---

## Index of Mechanisms

*   [Core Constraint / Enabling Process](#core-constraint-enabling-process)
    *   [energy-flow-dissipation](#energy-flow-dissipation)
*   [Information Interface: Sensing and Transduction Mechanisms](#information-interface-sensing-and-transduction-mechanisms)
    *   [mechanical-transduction](#mechanical-transduction)
    *   [thermal-transduction](#thermal-transduction)
    *   [optical-transduction](#optical-transduction)
    *   [chemical-transduction](#chemical-transduction)
    *   [electrical-ionic-transduction](#electrical-ionic-transduction)
    *   [magnetic-transduction](#magnetic-transduction)
    *   [acoustic-transduction](#acoustic-transduction)
    *   [indirect-relayed-sensing](#indirect-relayed-sensing)
*   [Actuation and Response Mechanisms](#actuation-and-response-mechanisms)
    *   [mechanical-actuation](#mechanical-actuation)
    *   [chemical-actuation](#chemical-actuation)
    *   [optical-response](#optical-response)
    *   [electrical-response](#electrical-response)
*   [Information Processing and Computation Mechanisms](#information-processing-and-computation-mechanisms)
    *   [neuromorphic-computation](#neuromorphic-computation)
    *   [reservoir-computing](#reservoir-computing)
    *   [physical-embodied-computation](#physical-embodied-computation)
    *   [bayesian-inference-probabilistic-computation](#bayesian-inference-probabilistic-computation)
    *   [collective-swarm-computation](#collective-swarm-computation)
*   [Self-Organization and Emergence Mechanisms](#self-organization-and-emergence-mechanisms)
    *   [driven-by-physical-forces-dynamics](#driven-by-physical-forces-dynamics)
    *   [driven-by-thermodynamic-statistical-principles](#driven-by-thermodynamic-statistical-principles) (Category)
        *   [equilibrium-self-assembly](#equilibrium-self-assembly)
        *   [ness-selection--dissipative-adaptation](#ness-selection--dissipative-adaptation)
        *   [criticality-driven-organization](#criticality-driven-organization)
    *   [driven-by-biological-processes](#driven-by-biological-processes)
    *   [driven-by-algorithmic-computational-rules](#driven-by-algorithmic-computational-rules)
*   [Memory and Adaptation Mechanisms](#memory-and-adaptation-mechanisms)
    *   [physical-structural-memory-mechanisms](#physical-structural-memory-mechanisms) (Category)
        *   [resistance-switching-memristance](#resistance-switching-memristance)
        *   [phase-conformation-memory](#phase-conformation-memory)
        *   [shape-memory](#shape-memory)
        *   [topological-defect-memory](#topological-defect-memory)
        *   [irreversible-state-change-memory](#irreversible-state-change-memory)
    *   [dynamic-state-memory](#dynamic-state-memory)
    *   [environmental-memory](#environmental-memory)
    *   [adaptation-and-learning-mechanisms](#adaptation-and-learning-mechanisms) (Category)
        *   [algorithmic-adaptation-learning](#algorithmic-adaptation-learning) (Category)
            *   [supervised-learning-algorithms](#supervised-learning-algorithms)
            *   [reinforcement-learning-algorithms](#reinforcement-learning-algorithms)
            *   [unsupervised-correlation-learning-algorithms](#unsupervised-correlation-learning-algorithms)
            *   [evolutionary-algorithms](#evolutionary-algorithms)
        *   [physical-intrinsic-learning-rules](#physical-intrinsic-learning-rules)
        *   [biological-plasticity-mechanisms](#biological-plasticity-mechanisms) (Category)
            *   [synaptic-plasticity](#synaptic-plasticity)
            *   [cellular-tissue-plasticity](#cellular-tissue-plasticity)
            *   [developmental-plasticity](#developmental-plasticity)
            *   [immune-system-adaptation](#immune-system-adaptation)
*   [Mechanism Interplay and Connections](#mechanism-interplay-and-connections)

---

## Core Constraint / Enabling Process
*   **Slug (for internal reference, will be ID):** `core-constraint-enabling-process`

### energy-flow-dissipation
*   **Mechanism ID:** `energy-flow-dissipation` (`[[./css.md#MechanismNode]](category=Energy, timescale_qualitative=Variable, energy_domain=Variable)`)
*   **Human-Readable Title:** The Engine: Energy Use and Loss in Systems
*   **Description:** Fundamental physical necessity for energy uptake, transduction, utilization (work), and dissipation (heat) in active, cognitive, or non-equilibrium systems. Encompasses acquisition, conversion, work driving processes (`[[#actuation-and-response-mechanisms]]`, `[[#information-processing-and-computation-mechanisms]]`, `[[#memory-and-adaptation-mechanisms]]`), and loss (`[parrondo_thermodynamics_2015]`, `[ritort_nonequilibrium_2024]`). Underpins analysis of costs, efficiency limits (`[yu_energy_2022]`), stability, distance from equilibrium (`[freitas_emergent_2022]`).
*   **Process/Primitives:** Energy Uptake (sources like Chemical `[[./materials.md#chemical-fuel]]`, Electrical, Light), Energy Transduction (`[[./phenomena.md#energy-harvesting--conversion]]`), Work Performance, Heat Dissipation (Joule heating `[yao_fully_2020]`, viscous drag `[ceron_programmable_2023]`, inelastic collisions `[varela-rosales_granular_2023]`). Quantification via entropy production (`[[./css.md#ParameterNode]](name=entropy_production)`).
*   **Role/Connections:** Provides necessary power (`[[./css.md#RequiresEnergyEdge]]` link to `[[./css.md#EnergyTypeNode]]`). Imposes constraints (`[[./theoretical.md#thermodynamic-uncertainty-relations]]`). Essential for maintaining non-equilibrium steady states (`[[./phenomena.md#ness-states]]`, `[benjamin_role_2023]`) crucial for living/cognitive systems (`[yang_physical_2021]`). Interplay with information formalized by `[[./theoretical.md#thermodynamics-of-information]]` (`[sagawa_thermodynamics_2013]`). Links dissipation and adaptation (`[[#biological-plasticity-mechanisms]]`, `[[#ness-selection--dissipative-adaptation]]`). Underpins `[[./phenomena.md#information-thermodynamics-effects]` (`[sartori_thermodynamic_2014]`). Affects stability/decay of `[[#dynamic-state-memory]]` and switching in `[[#physical-structural-memory-mechanisms]]`. Drives `[[#driven-by-thermodynamic-statistical-principles]]`.
*   **Theoretical Concepts:** `[[./theoretical.md#statistical-mechanics--stochastic-thermodynamics]]`, `[[./theoretical.md#thermodynamics-of-information]]`, `[[./theoretical.md#thermodynamic-uncertainty-relations]]`.
*   **Methods Used:** `[[./methods.md#thermal-analysis-dsc]]`, Power Measurements (`[[./methods.md#electrical-measurements]]`, `[[./methods.md#mechanical-testing]]`), Theoretical Analysis (`[[./methods.md#statistical-mechanics--stochastic-thermodynamics]]`).
*   **Example Citations:** `[yang_physical_2021]`, `[friston_free_2023]`, `[ritort_nonequilibrium_2024]`.

---

## Information Interface: Sensing and Transduction Mechanisms
*   **Slug (for internal reference, will be ID):** `information-interface-sensing-and-transduction-mechanisms`
*   **Mechanism ID:** `information-interface-sensing-and-transduction-mechanisms` (`[[./css.md#MechanismNode]](category=Sensing)`)
*   **Human-Readable Title:** How Systems Sense the World (Category)
*   **Description:** Processes enabling a system (`[[./css.md#SystemNode]]`) to acquire information about its internal state or external environment by converting physical/chemical signals into processable internal signals. Represents the Input interface. Relies on `[[#energy-flow-dissipation]]`. Cost analysed `[govern_optimal_2014]`. Used in `[[./methods.md#feedback-control-loops]]`. Relevant Theory: `[[./theoretical.md#information-theory]]`.

### mechanical-transduction
*   **Mechanism ID:** `mechanical-transduction` (`[[./css.md#PartOfEdge]]` → `[[#information-interface-sensing-and-transduction-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Sensing, energy_domain=Mechanical)`)
*   **Human-Readable Title:** Sensing Force and Shape
*   **Description:** Converts physical forces, pressures, strains, vibrations, or impacts into other signal forms (electrical, optical, chemical) or mechanical states. Enables mechanosensing.
*   **Physics/Primitives:** Piezoelectricity, piezoresistivity, triboelectricity, mechanochemistry (`[hu_self-reporting_2025]`), mechanical phase transitions, buckling (`[liao_tunable_2018]`), contact sensing.
*   **Enabling Materials:** `[[./materials.md#piezoresistive-composites]]` (`[thuruthel_soft_2019]`), piezo materials (`[kwak_optimal_2021]`), `[[./materials.md#photomechanochromic-polymers]]` (`[bayat_self-indicating_2024]`), `[[./materials.md#microcapsule-composites]]`, `[[./materials.md#mechanical-metamaterials]]` (`[riley_neuromorphic_2022]`).
*   **Connections:** Triggers `[[#optical-response]]`, `[[#electrical-response]]`. Input for `[[#neuromorphic-computation]]` (`[riley_neuromorphic_2022]`), mechanical NNs (`[stern_training_2024]`). Writes `[[#physical-structural-memory-mechanisms]]`. Input method `[[./methods.md#mechanical-input-control]]`, measured `[[./methods.md#mechanical-testing]]`. Theory: `[[./theoretical.md#continuum-mechanics]]`. Application: `[[./applications.md#sensing-general]]`, `[[./applications.md#structural-health-monitoring]]`.

### thermal-transduction
*   **Mechanism ID:** `thermal-transduction` (`[[./css.md#PartOfEdge]]` → `[[#information-interface-sensing-and-transduction-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Sensing, energy_domain=Thermal)`)
*   **Human-Readable Title:** Sensing Temperature
*   **Description:** Detects temperature changes or heat flow, causing changes in signals or state.
*   **Physics/Primitives:** Thermoelectricity, pyroelectricity, temperature-dependent phase transitions (`[chen_enormous-stiffness-changing_2022]`), thermoresistivity, Arrhenius kinetics.
*   **Enabling Materials:** `[[./materials.md#phase-change-composites]]` (`[zhao_phase_2021]`), thermocouples, responsive `[[./materials.md#hydrogels-general]]` (`[yu_hydrogels_2020]`), `[[./materials.md#pnipam-networks-in-ionic-liquid]]`.
*   **Connections:** Triggers thermal `[[#mechanical-actuation]]` (`[zhao_phase_2021]`) or writes `[[#phase-conformation-memory]]`. Input `[[./methods.md#thermal-stimuli-control]]`, measurement `[[./methods.md#thermal-analysis-dsc]]`. Causes `[[./phenomena.md#stimuli-responsive-property-switching]]`. Links to `[[#energy-flow-dissipation]]`.

### optical-transduction
*   **Mechanism ID:** `optical-transduction` (`[[./css.md#PartOfEdge]]` → `[[#information-interface-sensing-and-transduction-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Sensing, energy_domain=Optical)`)
*   **Human-Readable Title:** Sensing Light
*   **Description:** Converts incident photons into electrical, thermal, chemical signals, or state changes. E.g., Vision (`[mead_neuromorphic_1990]`), photodetection (`[de_nicola_graphene_2020]`).
*   **Physics/Primitives:** Photovoltaic, photoconductivity, photothermal effect, photochemistry (`[bayat_self-indicating_2024]`). Plasmonics (`[[./materials.md#plasmonics-metamaterials]]`). Basis for `[[./phenomena.md#photodetection-qe]]`, `[[./phenomena.md#photosynthesis]]` (`[cao_quantum_2020]`).
*   **Enabling Materials:** Semiconductors (`[[./materials.md#silicon-si-and-porous-silicon-psi]]` `[lee_nanograin_2023]`, `[[./materials.md#graphene--2d-materials]]`), Photothermal (`[[./materials.md#conductive-filler-composites]]` `[xiao_artificial_2020]`), Photochromic (`[[./materials.md#photomechanochromic-polymers]]`), LCEs (`[[./materials.md#liquid-crystal-elastomers-lces]]`). Bio (`[lambert_quantum_2013]`).
*   **Connections:** Writes `[[#phase-conformation-memory]]` (`[xiao_artificial_2020]`). Input for `[[#neuromorphic-computation]]` (`[wright_deep_2022]`). Drives `[[#mechanical-actuation]]` (`[li_computational_2024]`). Input `[[./methods.md#external-field-control]](Light)`. Output `[[#optical-response]]`. Analyzed via `[[./methods.md#spectroscopy]]`.

### chemical-transduction
*   **Mechanism ID:** `chemical-transduction` (`[[./css.md#PartOfEdge]]` → `[[#information-interface-sensing-and-transduction-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Sensing, energy_domain=Chemical)`)
*   **Human-Readable Title:** Sensing Chemicals
*   **Description:** Detects chemical species/properties (concentration, pH, binding) causing signal/state changes. Biological (`[wadhams_making_2004]`).
*   **Physics/Primitives:** Molecular Recognition (`[dawson_differential_2023]`), Catalysis, pH/Ion Sensing (`[archer_ph-responsive_2020]`), Ion exchange.
*   **Enabling Materials:** Functionalized surfaces (`[[./materials.md#liquid-crystals-lcs]]` `[wang_liquid_2022]`), OECTs (`[[./materials.md#conductive-polymers]]` `[luo_highly_2023]`), Hydrogels (`[[./materials.md#hydrogels-general]]` `[archer_ph-responsive_2020]`), Peptides (`[[./materials.md#self-assembling-peptides]]` `[dawson_differential_2023]`), Nanopores (`[zhang_nanopore_2022]`), Droplets (`[hanczyc_chemical_2010]`).
*   **Connections:** Drives `[[#mechanical-actuation]]` (chemotaxis `[hanczyc_fatty_2007]`). Input for computation (`[lin_intelligent_2021]`). Triggers `[[#chemical-actuation]]` (`[he_peptide-induced_2018]`). Input via `[[./methods.md#chemical-stimuli-control]]`. Causes `[[./phenomena.md#chemotaxis--taxis-behaviors]]`. Implicitly writes memory state. Target: `[[./applications.md#biosensing]]`.

### electrical-ionic-transduction
*   **Mechanism ID:** `electrical-ionic-transduction` (`[[./css.md#PartOfEdge]]` → `[[#information-interface-sensing-and-transduction-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Sensing, energy_domain=Electrical)`)
*   **Human-Readable Title:** Sensing Electricity and Ions
*   **Description:** Sensing electrical properties (V, I, E, Z `[crepaldi_experimental_2023]`) or ionic states/flux. Key for electronics, ionics, bioelectricity (`[lagasse_future_2023]`).
*   **Physics/Primitives:** Resistance/Conductance Measurement, Ion Sensing, Field Effect, Electrochemistry, Electrokinetics (`[alapan_shape-encoded_2019]`), Channel Gating. Nernst-Planck (`[kamsma_iontronic_2023]`).
*   **Enabling Materials:** Electrodes (`[[./materials.md#metals]]`), Semiconductors (`[[./materials.md#silicon-si-and-porous-silicon-psi]]` `[mead_neuromorphic_1990]`), Electrolytes (`[[./materials.md#aqueous-electrolytes]]`), Nanopores/channels (`[lee_nanograin_2023]`, `[robin_long-term_2023]`), `[[./materials.md#memristors]]` (`[di_ventra_parallel_2013]`), `[[./materials.md#living-cells-and-tissues]]`, `[[./materials.md#graphene--2d-materials]]`.
*   **Connections:** Links physics to `[[#information-processing-and-computation-mechanisms]]`. Essential for `[[#physical-structural-memory-mechanisms]]` read/write. Drives actuation (`[[#mechanical-actuation]]`). Enables `[[./phenomena.md#bioelectricity]]`. Readout mechanism. Input `[[./methods.md#external-field-control]](Electric)`, measured `[[./methods.md#electrical-measurements]]`.

### magnetic-transduction
*   **Mechanism ID:** `magnetic-transduction` (`[[./css.md#PartOfEdge]]` → `[[#information-interface-sensing-and-transduction-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Sensing, energy_domain=Magnetic)`)
*   **Human-Readable Title:** Sensing Magnetism
*   **Description:** Detecting magnetic fields via physical material effects.
*   **Physics/Primitives:** Hall effect, Magnetoresistance, Domain switching.
*   **Enabling Materials:** Magnetic sensors (GMR), `[[./materials.md#ferromagnetic-materials]]`, `[[./materials.md#fe3o4-nanoparticles]]` (`[stamps_active_2024]`).
*   **Connections:** Input for control (`[khalil_precise_2015]`), feedback for `[[#mechanical-actuation]]` driven by `[[./methods.md#external-field-control]](Magnetic)`. Causes `[[./phenomena.md#magnetoreception]]`. Reads `[[#physical-structural-memory-mechanisms]]`.

### acoustic-transduction
*   **Mechanism ID:** `acoustic-transduction` (`[[./css.md#PartOfEdge]]` → `[[#information-interface-sensing-and-transduction-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Sensing, energy_domain=Mechanical)`)
*   **Human-Readable Title:** Sensing Sound and Vibration
*   **Description:** Converting acoustic energy into other signals.
*   **Physics/Primitives:** Piezoelectricity, Pressure detection, Resonance.
*   **Enabling Materials:** Piezoelectric materials, MEMS (`[mcevoy_materials_2015]`), Oscillators (`[ziepke_acoustic_2024]`).
*   **Connections:** Input for `[[#collective-swarm-computation]]` (`[ziepke_acoustic_2024]`). Input `[[./methods.md#mechanical-input-control]]`. Creates `[[./phenomena.md#acoustic-response]]`.

### indirect-relayed-sensing
*   **Mechanism ID:** `indirect-relayed-sensing` (`[[./css.md#PartOfEdge]]` → `[[#information-interface-sensing-and-transduction-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Sensing, energy_domain=Variable)`)
*   **Human-Readable Title:** Collective / Networked Sensing
*   **Description:** Inferring non-local information via networked communication or signal propagation. Enables collective perception (`[ziepke_acoustic_2024]`). Core to `[[./theoretical.md#collective-intelligence-conceptual]]` (`[levin_multiscale_2024]`).
*   **Physics/Algorithms:** Message Passing (`[rubenstein_programmable_2014]`), Signal propagation (waves/diffusion `[kim_polymeric_2015]`), Consensus algorithms.
*   **Enabling Systems:** Networked agents (`[goldman_robot_2024]`), Tissues (`[mcmillen_collective_2024]`).
*   **Connections:** Aggregates local sensing. Input for `[[#collective-swarm-computation]]`. Relies on `[[./theoretical.md#network-theory]]`. Essential for `[[./phenomena.md#flocking--schooling--swarming]]` coordination (`[couzin_collective_2009]`).

---

## Actuation and Response Mechanisms
*   **Slug (for internal reference, will be ID):** `actuation-and-response-mechanisms`
*   **Mechanism ID:** `actuation-and-response-mechanisms` (`[[./css.md#MechanismNode]](category=Actuation)`)
*   **Human-Readable Title:** How Systems Act and Respond (Category)
*   **Description:** Processes generating physical outputs (force, motion, state changes, signal emission) enabling interaction or internal state modification. Output interface. Requires `[[#energy-flow-dissipation]]`. Driven by `[[#information-processing-and-computation-mechanisms]]` or `[[#information-interface-sensing-and-transduction-mechanisms]]`.

### mechanical-actuation
*   **Mechanism ID:** `mechanical-actuation` (`[[./css.md#PartOfEdge]]` → `[[#actuation-and-response-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Actuation, energy_domain=Variable)`)
*   **Human-Readable Title:** Generating Motion and Force
*   **Description:** Producing movement, force, shape change, stiffness change. Core for robotics (`[pfeifer_self-organization_2007]`) and active matter (`[gompper_2025_2025]`). Reviews: (`[ceylan_mobile_2017]`).
*   **Physics/Primitives:** Motion (translation `[khona_global_2025]`), Force Generation, Shape Change (`[xia_dynamic_2022]`), Stiffness Change (`[jiao_mechanical_2023]`), Locomotion Modes (`[lu_bioinspired_2018]`). Propulsion (`[khalil_precise_2015]`).
*   **Enabling Materials:** Motors, Responsive polymers (`[[./materials.md#shape-memory-polymers-smps]]`, `[[./materials.md#liquid-crystal-elastomers-lces]]`), Elastomers (`[milana_morphological_2022]`), Hydrogels (`[soto_programmable_2023]`), Active particles (`[fraxedas_collective_2024]`), Bio-motors (`[kriegman_scalable_2020]`), BTF Interface (`[yang_self-amputating_2024]`), Metamaterials (`[yan_soft_2020]`). DNA motors (`[sherman_precisely_2004]`). Magnetic materials (`[ceron_programmable_2023]`).
*   **Connections:** Realizes `[[./phenomena.md#autonomous-self-propulsion]]`, `[[./phenomena.md#controlled-locomotion--navigation]]`, `[[./phenomena.md#manipulation-grasping-transport-release]]`, `[[./phenomena.md#bio-inspired-actuation]]`. Output of computation/sensing.

### chemical-actuation
*   **Mechanism ID:** `chemical-actuation` (`[[./css.md#PartOfEdge]]` → `[[#actuation-and-response-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Actuation, energy_domain=Chemical)`)
*   **Human-Readable Title:** Releasing/Producing Chemicals
*   **Description:** Generating output via controlled release or production of chemical species.
*   **Physics/Primitives:** Triggered Release, Reaction Modulation (`[lin_intelligent_2021]`).
*   **Enabling Materials:** Responsive materials (`[[./materials.md#hydrogels-general]]` `[he_peptide-induced_2018]`, `[[./materials.md#microcapsule-composites]]`), Electrochemical systems (`[yang_memristor_2022]`), Bacteria (`[huang_self-regulation_2018]`), Signal cascades (`[kim_polymeric_2015]`).
*   **Connections:** Enables `[[./phenomena.md#targeted-delivery]]`. Can create `[[#environmental-memory]]`. Output driven by sensing/computation. Used in `[[./applications.md#drug-delivery]]`.

### optical-response
*   **Mechanism ID:** `optical-response` (`[[./css.md#PartOfEdge]]` → `[[#actuation-and-response-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Actuation, energy_domain=Optical)`)
*   **Human-Readable Title:** Changing How Light Interacts
*   **Description:** Material exhibits changes in optical properties (color, fluorescence, transmission, polarization) or emits light as primary output.
*   **Physics/Primitives:** Chromism (`[bayat_self-indicating_2024]`), Fluorescence Modulation, Transparency/Reflectance Switching (`[wang_liquid_2022]`), Light Emission (`[babcock_ultraviolet_2024]`). Beam control (`[malevich_very-large-scale_2025]`).
*   **Enabling Materials:** `[[./materials.md#photomechanochromic-polymers]]`, `[[./materials.md#liquid-crystals-lcs]]`, Dyes, PCMs, Metasurfaces (`[chen_metamaterials_2023]`). Bio-reporters (`[elowitz_synthetic_2000]`). Quantum Emitters (`[[./materials.md#quantum-systems]]`).
*   **Connections:** Primary readout for `[[#optical-transduction]]`, `[[#mechanical-transduction]]` (`[bayat_self-indicating_2024]`). Reads `[[#physical-structural-memory-mechanisms]]` state. Methods: `[[./methods.md#spectroscopy]]`, `[[./methods.md#microscopy]]`. Causes `[[./phenomena.md#stimuli-responsive-property-switching]]`.

### electrical-response
*   **Mechanism ID:** `electrical-response` (`[[./css.md#PartOfEdge]]` → `[[#actuation-and-response-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Actuation, energy_domain=Electrical)`)
*   **Human-Readable Title:** Generating Electrical Signals
*   **Description:** Generation or modulation of electrical current, voltage, or impedance as primary output.
*   **Physics/Primitives:** Current Generation (`[kwak_optimal_2021]`), Voltage Generation, Conductance/Resistance Modulation (`[yao_fully_2020]`), Electrochemical potential (`[yang_emergent_2022]`). Impedance mod (`[crepaldi_evidence_2022]`). Graphene conductivity tune (`[malevich_very-large-scale_2025]`). Ion flow mod (`[zhang_nanopore_2022]`).
*   **Enabling Materials:** Piezo/tribo materials, Electrochemical systems, Memristors readout, Transistors, Graphene, Fuel Cells (`[[./materials.md#living-cells-and-tissues]]`).
*   **Connections:** Output drives electronic computation/control. Enables `[[./phenomena.md#energy-harvesting--conversion]]`. Output of `[[#physical-structural-memory-mechanisms]]` or `[[#electrical-ionic-transduction]]`, `[[#mechanical-transduction]]`. Measured via `[[./methods.md#electrical-measurements]]`.

---

## Information Processing and Computation Mechanisms
*   **Slug (for internal reference, will be ID):** `information-processing-and-computation-mechanisms`
*   **Mechanism ID:** `information-processing-and-computation-mechanisms` (`[[./css.md#MechanismNode]](category=Computation)`)
*   **Human-Readable Title:** How Systems Compute Information (Category)
*   **Description:** Processes enabling transformation, storage, retrieval, and manipulation of information. Core part of Dynamics (`[[./css.md#SystemNode]](dynamics_node_ref)`). Requires `[[#energy-flow-dissipation]]`. Involves `[[#memory-and-adaptation-mechanisms]]`. Theory: `[[./theoretical.md#information-theory]]`, `[[./theoretical.md#thermodynamics-of-information]]`. Enables cognitive functions `[[./theoretical.md#basal-minimal-cognition-conceptual]]`. Results in `[[./phenomena.md#information-processing--computation]]` phenomena.

### neuromorphic-computation
*   **Mechanism ID:** `neuromorphic-computation` (`[[./css.md#PartOfEdge]]` → `[[#information-processing-and-computation-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Computation, energy_domain=Electrical/Ionic/Chemical)`)
*   **Human-Readable Title:** Brain-Inspired Computing
*   **Description:** Computation mimicking neural/synaptic structure/dynamics (spiking, plasticity). Exploits `[[./phenomena.md#criticality--phase-transitions]]`. Reviews `[kaspar_rise_2021]`, `[mead_neuromorphic_1990]`. Embodied `[hughes_embodied_2022]`. Theory `[seung_statistical_1992]`. Bio links (`[rouleau_multiple_2023]`).
*   **Physics/Primitives:** Weighted Summation, Nonlinear Activation (`[[./phenomena.md#nonlinear-dynamics]]`), Thresholding, Spiking (I&F `[luo_highly_2023]`), Plasticity (`[[#algorithmic-adaptation-learning]]`, `[[#synaptic-plasticity]]`). STDP (`[[./phenomena.md#synaptic-plasticity-emulation]]`).
*   **Enabling Systems:** Sim (`[yang_task_2019]`). Hardware (`[yao_fully_2020]`). Materials: `[[./materials.md#memristors]]`, `[[./materials.md#nanowires]]` (`[loeffler_neuromorphic_2023]`), `[[./materials.md#iontronic-devices]]` (`[kamsma_iontronic_2023]`), Photonics (`[wright_deep_2022]`), Mechanics (`[stern_training_2024]`), ASI (`[stamps_active_2024]`).
*   **Connections:** Implements `[[./phenomena.md#learning--adaptive-behavior]]`. Uses `[[#physical-structural-memory-mechanisms]]`. Exploits `[[./theoretical.md#network-theory]]`. Enables `[[./phenomena.md#classification--regression-performance]]`, `[[./phenomena.md#associative-memory--pattern-completion]]`. Application: `[[./applications.md#neuromorphic-computing--hardware]]`. Measured via `[[./methods.md#electrical-measurements]]`. Evaluated `[[./methods.md#ml-classificationregression-svm-mlp-k-means-som]]`.

### reservoir-computing
*   **Mechanism ID:** `reservoir-computing` (`[[./css.md#PartOfEdge]]` → `[[#information-processing-and-computation-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Computation, energy_domain=Variable)`)
*   **Human-Readable Title:** Computing with Complex Dynamics
*   **Description:** Using fixed, complex dynamics ("reservoir") for high-D temporal data transformation, training only simple readout. Concepts (`[muller_what_2017]`). Review (`[kaspar_rise_2021]`). Quantum (`[sakurai_quantum_2022]`).
*   **Physics/Primitives:** Nonlinear Spatio-temporal Transformation, Fading Memory (`[[#dynamic-state-memory]]`), High-Dimensional Projection, Separability property.
*   **Enabling Systems:** `[[./materials.md#elastomers-general]]` (`[nakajima_information_2015]`), Fluids (`[fernando_pattern_2003]`, `[[./materials.md#ferrofluids]]` `[crepaldi_experimental_2023]`), `[[./materials.md#nanowires]]` (`[loeffler_neuromorphic_2023]` refs), Molecules (`[tanaka_molecular_2018]`), `[[./materials.md#aqueous-electrolytes]]` (`[kamsma_brain-inspired_2024]`), `[[./materials.md#wave-propagation-media]]` (`[marcucci_theory_2020]`).
*   **Connections:** Relies on `[[#dynamic-state-memory]]`. Readout adapted via `[[#supervised-learning-algorithms]]`. Theory `[[./theoretical.md#dynamical-systems-theory]]`. Enables `[[./phenomena.md#reservoir-computing-dynamics]]`. Results in `[[./phenomena.md#classification--regression-performance]]`.

### physical-embodied-computation
*   **Mechanism ID:** `physical-embodied-computation` (`[[./css.md#PartOfEdge]]` → `[[#information-processing-and-computation-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Computation, energy_domain=Mechanical/Thermal/Chemical etc.)`)
*   **Human-Readable Title:** Computing with Physics and Shape
*   **Description:** Computation via material properties, structure, physical dynamics. Core of `[[./theoretical.md#embodied-intelligence-conceptual]]` (`[pfeifer_morphological_2006]`). Frameworks/Debate (`[muller_what_2017]`, `[mengaldo_concise_2022]`). In biology (`[wills_reflexivity_2019]`). Logic context (`[chen_enormous-stiffness-changing_2022]`). Molecule context (`[sharma_assembly_2023]`). Review (`[kaspar_rise_2021]`).
*   **Physics/Primitives:** Logic Gates (`[adamatzky_computing_2011]`), Switching, Thresholding (`[vihmar_how_2023]`), Filtering (`[bordiga_automated_2024]`), Linear Algebra (`[louvet_reprogrammable_2024]`), Gradient Ascent/Descent (`[buckley_natural_2024]`). FSM (`[adamatzky_collision-based_2002]`).
*   **Enabling Systems:** `[[./materials.md#mechanical-metamaterials]]` (`[jiao_mechanical_2023-1]`), `[[./materials.md#liquid-crystals-lcs]]` (`[kos_nematic_2022]`), Collision Systems, Chemical Networks (`[lin_intelligent_2021]`), Micromachines (`[barnaveli_pressure-gated_2024]`). Used in robotics (`[xi_emergent_2024-1]`). Designed via `[[./methods.md#inverse-design]]`.
*   **Connections:** Blurs `[[./materials.md]]`, `[[./theoretical.md#dynamical-systems-theory]]`, structure. Coupled to sensing/actuation. Uses local physics. Can use `[[#physical-structural-memory-mechanisms]]`. Enables `[[./phenomena.md#logical-operation-execution]]`. Links to `[[./theoretical.md#physical-intelligence-pi]]`.

### bayesian-inference-probabilistic-computation
*   **Mechanism ID:** `bayesian-inference-probabilistic-computation` (`[[./css.md#PartOfEdge]]` → `[[#information-processing-and-computation-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Computation, energy_domain=Variable/None(theoretical))`)
*   **Human-Readable Title:** Computing with Probability and Beliefs
*   **Description:** System dynamics perform or approximate Bayesian belief updating or probabilistic optimization. Key frameworks: `[[./theoretical.md#active-inference-fep]]` (`[friston_free_2023]`), `[[./theoretical.md#bayesian-mechanics]]` (`[ramstead_bayesian_2023]`). Bio applications (`[pezzulo_active_2024]`). Underpins biological regulation (`[govern_optimal_2014]`). Minimal cognition link (`[seifert_reinforcement_2024]`).
*   **Physics/Primitives:** Belief Update (Variational Inference), Prediction Error Calculation, Sampling, Precision Weighting.
*   **Enabling Systems:** Theoretical models (`[friston_path_2023]`), Simulation (`[friston_free_energy_2010]`), Physical (`[stamps_active_2024]`), Neural (`[benjamin_role_2023]`), Statistical hardware (`[seung_statistical_1992]`).
*   **Connections:** Unifies perception (`[[#information-interface-sensing-and-transduction-mechanisms]]`), action (`[[#actuation-and-response-mechanisms]]`), learning (`[[#adaptation-and-learning-mechanisms]]`). Deep links to `[[./theoretical.md#statistical-mechanics--stochastic-thermodynamics]]`, `[[./theoretical.md#information-theory]]`. Enables `[[./phenomena.md#active-inference]]`. Can be seen as realization of `[[./phenomena.md#statistical-inference-computations]]` performed by the system (`[decelle_inferring_2024]`).

### collective-swarm-computation
*   **Mechanism ID:** `collective-swarm-computation` (`[[./css.md#PartOfEdge]]` → `[[#information-processing-and-computation-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Computation, energy_domain=Variable)`)
*   **Human-Readable Title:** Distributed Computation in Groups
*   **Description:** Computation via decentralized interactions among multiple simple agents. Concept `[[./theoretical.md#collective-intelligence-conceptual]]` (`[couzin_collective_2009]`). Used (`[heyman_supermind_2024]`). Synthetic biology (`[sole_open_2024]`). Robotics (`[lowen_towards_2025]`).
*   **Physics/Primitives:** Consensus (`[march-pons_consensus_2024]`), Distributed Algorithms (Gradients, Task Allocation, Sorting `[zhang_classical_2025]`). Stigmergy `[[#environmental-memory]]`.
*   **Enabling Systems:** Robot Swarms (`[rubenstein_programmable_2014]`), Bio systems (`[theraulaz_spatial_2002]`). Simulation (`[[./methods.md#agent-based-modeling-abm]]`).
*   **Connections:** Requires communication (`[[#indirect-relayed-sensing]]`). Underpins `[[./phenomena.md#collective-decision-making]]`. Relies on `[[#driven-by-algorithmic-computational-rules]]`. Relates to `[[./theoretical.md#network-theory]]`. Acoustic implementation (`[ziepke_acoustic_2024]`).

---

## Self-Organization and Emergence Mechanisms
*   **Slug (for internal reference, will be ID):** `self-organization-and-emergence-mechanisms`
*   **Mechanism ID:** `self-organization-and-emergence-mechanisms` (`[[./css.md#MechanismNode]](category=Self-Organization)`)
*   **Human-Readable Title:** How Structures and Patterns Form Spontaneously (Category)
*   **Description:** Processes generating macroscopic order (`[[./phenomena.md#self-assembly-and-pattern-formation]]`, `[[./phenomena.md#collective-motion--phase-behavior]]`) from local interactions without centralized control. Requires `[[#energy-flow-dissipation]]`. Key for complexity (`[[./theoretical.md#assembly-theory-at]]`), life (`[wills_reflexivity_2019]`). Connects scales (`[pfeifer_self-organization_2007]`). Theories: `[[./theoretical.md#statistical-mechanics--stochastic-thermodynamics]]`, `[[./theoretical.md#dynamical-systems-theory]]`.

### driven-by-physical-forces-dynamics
*   **Mechanism ID:** `driven-by-physical-forces-dynamics` (`[[./css.md#PartOfEdge]]` → `[[#self-organization-and-emergence-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Self-Organization, energy_domain=Mechanical/Electromagnetic/Chemical Potential etc.)`)
*   **Human-Readable Title:** Formation via Physical Interactions
*   **Description:** Order emerging from mechanics, hydrodynamics (`[pak_generalized_2014]`), electromagnetism (`[ceron_programmable_2023]`), surface forces (`[hu_shaping_2019]`), instabilities (`[liao_tunable_2018]`). Active matter swarming/patterning (`[negi_emergent_2022]`). Defect dynamics (`[maroudas-sacks_topological_2021]`, `[sasaki_large-scale_2016]`). Robotics (`[goldman_robot_2024]`). Granular (`[varela-rosales_granular_2023]`). Phoretic (`[fraxedas_collective_2024]`).
*   **Local Rules:** Force laws (contact, viscous, magnetic, capillary), Instability criteria, Alignment rules.
*   **Connections:** Requires `[[#energy-flow-dissipation]]`. Uses `[[./materials.md]]` properties. Creates morphology for `[[#physical-embodied-computation]]`. Underpins `[[./phenomena.md#flocking--schooling--swarming]]`, `[[./phenomena.md#clustering--aggregation--phase-separation]]`, `[[./phenomena.md#defect-pattern-formation]]`. Theories: `[[./theoretical.md#continuum-mechanics]]`, `[[./theoretical.md#liquid-crystal-theory]]`. Methods: `[[./methods.md#particle-based-modeling]]`, `[[./methods.md#continuum-modeling]]`.

### driven-by-thermodynamic-statistical-principles
*   **Mechanism ID:** `driven-by-thermodynamic-statistical-principles` (`[[./css.md#PartOfEdge]]` → `[[#self-organization-and-emergence-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Self-Organization, energy_domain=Thermal/Chemical Potential)`) (Category)
*   **Human-Readable Title:** Formation Driven by Thermodynamics and Statistics
*   **Description:** Order driven by fundamental thermodynamic principles (minimizing free energy, maximizing entropy) or statistical dynamics (selection of probable states/pathways). Includes equilibrium assembly, NESS formation, dissipative adaptation, critical behavior.
*   **Connections:** Underpins `[[./methods.md#self-assembly-methods]]`. Links to `[[#energy-flow-dissipation]]`. Foundational for `[[./phenomena.md#criticality--phase-transitions]]`. Methods: `[[./methods.md#thermal-analysis-dsc]]`, `[[./methods.md#statistical-mechanics--stochastic-thermodynamics]]`. Sub-types: `[[#equilibrium-self-assembly]]`, `[[#ness-selection--dissipative-adaptation]]`, `[[#criticality-driven-organization]]`.

#### equilibrium-self-assembly
*   **Mechanism ID:** `equilibrium-self-assembly` (`[[./css.md#PartOfEdge]]` → `[[#driven-by-thermodynamic-statistical-principles]]`) (`[[./css.md#MechanismNode]](category=Self-Organization)`)
*   **Human-Readable Title:** Building Structures via Equilibrium Interactions
*   **Description:** Spontaneous formation of ordered structures by seeking lowest free energy state. Examples: Crystallization (`[angioletti-uberti_re-entrant_2012]`), Protein/Polymer folding (`[foumthuim_solvent_2024]`), DNA origami (`[rothemund_folding_2006]`), BCPs (`[thedford_promise_2023]`), Peptide assembly (`[dawson_differential_2023]`). Colloid/Vesicle systems (`[mcmullen_self-assembly_2022]`, `[hadorn_specific_2012]`).
*   **Local Rules:** Minimize interaction energy, Maximize entropy subject to constraints. Defined by potentials (`[koehler_how_2024]`).
*   **Connections:** Creates `[[./phenomena.md#discrete-nanostructure-formation]]`, `[[./phenomena.md#periodic-pattern-formation]]`. Uses `[[./materials.md]]` (`[[./materials.md#dna]]`, `[[./materials.md#self-assembling-peptides]]`). Creates `[[#phase-conformation-memory]]`. Methods: `[[./methods.md#monte-carlo-mc]]`, `[[./methods.md#thermal-stimuli-control]]`. Theory: `[[./theoretical.md#statistical-mechanics--stochastic-thermodynamics]]`.

#### ness-selection--dissipative-adaptation
*   **Mechanism ID:** `ness-selection--dissipative-adaptation` (`[[./css.md#PartOfEdge]]` → `[[#driven-by-thermodynamic-statistical-principles]]`) (`[[./css.md#MechanismNode]](category=Self-Organization)`)
*   **Human-Readable Title:** Organizing via Continuous Energy Flow and Dissipation
*   **Description:** Formation/selection of stable states/structures far from equilibrium, requiring constant energy throughput. Includes dissipative structures, NESS selection (`[freitas_emergent_2022]`, `[aprahamian_non-equilibrium_2023]`), dissipative adaptation (`[england_dissipative_2015]`, `[goettems_physics_2024]`). Key for active matter/life (`[yang_physical_2021]`). FEP link (`[friston_free_2023]`).
*   **Local Rules:** Driven dynamics, violating detailed balance globally. Potential minimization in path space. Kinetic asymmetry.
*   **Connections:** Requires `[[#energy-flow-dissipation]]`. Creates `[[./phenomena.md#ness-states]]`. Concepts: `[[./theoretical.md#statistical-mechanics--stochastic-thermodynamics]]`. Methods: `[[./methods.md#statistical-mechanics--stochastic-thermodynamics]]`, Non-equilibrium simulation (`[[./methods.md#non-equilibrium-simulations]]`).

#### criticality-driven-organization
*   **Mechanism ID:** `criticality-driven-organization` (`[[./css.md#PartOfEdge]]` → `[[#driven-by-thermodynamic-statistical-principles]]`) (`[[./css.md#MechanismNode]](category=Self-Organization)`)
*   **Human-Readable Title:** Organizing at the Edge of Chaos
*   **Description:** Systems spontaneously tuning to or operating near a critical point (`[[./phenomena.md#criticality--phase-transitions]]`), exhibiting scale invariance, power laws, high sensitivity. SOC, EOC concepts. Proposed for brain (`[obyrne_how_2022]`), NNs (`[zhang_edge_2021]`).
*   **Local Rules:** Interactions balancing order/disorder. Feedback tuning to critical value (`[srinivasa_criticality_2015]`). Learning dynamics (`[aguilera_exploring_2018]`).
*   **Connections:** Specific type of `[[#driven-by-thermodynamic-statistical-principles]]`. Links `[[./theoretical.md#statistical-mechanics--stochastic-thermodynamics]]` and `[[./theoretical.md#dynamical-systems-theory]]` (`[feng_optimal_2020]`). Optimal for `[[#information-processing-and-computation-mechanisms]]`. Phenomena: `[[./phenomena.md#scale-free-dynamics--criticality]]`. Methods: `[[./methods.md#statistical-analysis]]` (power laws). Seen in CAs (`[langton_computation_1990]`).

### driven-by-biological-processes
*   **Mechanism ID:** `driven-by-biological-processes` (`[[./css.md#PartOfEdge]]` → `[[#self-organization-and-emergence-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Self-Organization)`)
*   **Human-Readable Title:** Structure Formation in Living Systems
*   **Description:** Emergence of complex biological organization (morphogenesis `[grodstein_closing_2023]`, repair `[levin_self-improvising_2024]`) via genetic rules enacted through collective cellular behaviors. Concepts: `[[./theoretical.md#collective-intelligence-conceptual]]`. Bioelectricity (`[lagasse_future_2023]`). Biobots (`[kriegman_scalable_2020]`). Examples (`[maroudas-sacks_topological_2021]`). Molecular basis (`[wills_reflexivity_2019]`).
*   **Local Rules:** GRN logic, Cell signaling (`[wadhams_making_2004]`), Bioelectric/mechanical interaction. `[[./phenomena.md#reaction-diffusion-systems]]`.
*   **Connections:** Uses `[[./materials.md#living-cells-and-tissues]]`. Embodies `[[#biological-plasticity-mechanisms]]`. Integrates physical/chemical mechanisms. Uses `[[#energy-flow-dissipation]]`. Underpins `[[./phenomena.md#morphogenesis--regeneration--homeostasis]]`. Studied via `[[./methods.md#biological-construction]]`, `[[./methods.md#modeling-cell--tissue]]`.

### driven-by-algorithmic-computational-rules
*   **Mechanism ID:** `driven-by-algorithmic-computational-rules` (`[[./css.md#PartOfEdge]]` → `[[#self-organization-and-emergence-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Self-Organization)`)
*   **Human-Readable Title:** Formation Driven by Programs/Algorithms
*   **Description:** Global order arising from agents/components executing explicit algorithms/rules. CAs (`[langton_computation_1990]`), swarm algorithms (`[rubenstein_programmable_2014]`, `[mertan_no-brainer_2025]`), DNA assembly rules (`[ke_three-dimensional_2012]`). Simulation examples (`[schmickl_how_2016]`, `[fuchslin_evolving_2006]`). Ant behavior models (`[zhang_classical_2025]`).
*   **Local Rules:** CA updates, FSM transitions, DNA hybridization, Agent code (`[theraulaz_spatial_2002]`).
*   **Connections:** Links to `[[#collective-swarm-computation]]`. Substrate for computation `[[#physical-embodied-computation]]`. Methods: `[[./methods.md#agent-based-modeling-abm]]`. Concepts: `[[./theoretical.md#network-theory]]`. Produces `[[./phenomena.md#algorithmically-generated-patterns]]`.

---

## Memory and Adaptation Mechanisms
*   **Slug (for internal reference, will be ID):** `memory-and-adaptation-mechanisms`
*   **Mechanism ID:** `memory-and-adaptation-mechanisms` (`[[./css.md#MechanismNode]](category=Memory/Adaptation)`) (Category)
*   **Human-Readable Title:** How Systems Remember and Adapt (Category)
*   **Description:** Processes enabling information storage (`M`) and behavior modification based on history/feedback (`A`). Underpins `[[./phenomena.md#memory--adaptation]]`. Needs `[[#energy-flow-dissipation]]`.

### physical-structural-memory-mechanisms
*   **Mechanism ID:** `physical-structural-memory-mechanisms` (`[[./css.md#PartOfEdge]]` → `[[#memory-and-adaptation-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Memory)`) (Category)
*   **Human-Readable Title:** Physical / Structural Memory Mechanisms (Category)
*   **Description:** Memory encoded via persistent physical/chemical states or configurations. Links to `[[./materials.md]]`. Subtypes: `[[#resistance-switching-memristance]]`, `[[#phase-conformation-memory]]`, `[[#shape-memory]]`, `[[#topological-defect-memory]]`, `[[#irreversible-state-change-memory]]`. Basis for `[[./phenomena.md#memory-storage--retrieval]]`.

#### resistance-switching-memristance
*   **Mechanism ID:** `resistance-switching-memristance` (`[[./css.md#PartOfEdge]]` → `[[#physical-structural-memory-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Memory, energy_domain=Electrical)`)
*   **Human-Readable Title:** Memory via Resistance Change (Memristors)
*   **Description:** Storing info as resistance state dependent on V/I history. Ion migration, filament dynamics. Key for hardware `[[#neuromorphic-computation]]`. Review `[wan_artificial_2020]`. Theory `[di_ventra_parallel_2013]`.
*   **Enabling Materials:** `[[./materials.md#memristors]]` (Oxides `[yao_fully_2020]`, Polymers `[riley_neuromorphic_2022]`), Ionic conductors, Atomic switches (`[kuncic_emergent_2018]`).
*   **Connections:** Read via `[[#electrical-ionic-transduction]]`. Causes `[[./phenomena.md#memristance]]`, `[[./phenomena.md#synaptic-plasticity-emulation]]`.

#### phase-conformation-memory
*   **Mechanism ID:** `phase-conformation-memory` (`[[./css.md#PartOfEdge]]` → `[[#physical-structural-memory-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Memory)`)
*   **Human-Readable Title:** Memory via Material Phase or Molecular Shape
*   **Description:** Info stored in material phase (solid/liquid, crystal/amorphous, nematic/isotropic `[kos_nematic_2022]`) or persistent molecular/polymer conformation (folding `[foumthuim_solvent_2024]`, glassy state `[madhusudanan_relaxation_2024]`). Includes charge trap state (`[lee_nanograin_2023]`). Context `[reiter_memorizing_2020]`. Ferrofluid states (`[crepaldi_evidence_2022]`). Magnetic domains. Ion states (`[robin_long-term_2023]`). Bistability (`[riley_neuromorphic_2022]`).
*   **Physics/Primitives:** Phase transition hysteresis, Metastability, Glass dynamics, Chain relaxation, Folding landscape, Ionic configuration.
*   **Enabling Materials:** `[[./materials.md#phase-change-composites]]` (`[zhao_phase_2021]`), Glassy `[[./materials.md#misc-polymers]]` (`[madhusudanan_relaxation_2024]`), `[[./materials.md#liquid-crystals-lcs]]`, `[[./materials.md#ionic-liquids]]` (`[chen_enormous-stiffness-changing_2022]`). Ionics (`[kamsma_brain-inspired_2024]`). `[[./materials.md#ferrofluids]]`. `[[./materials.md#nanowires]]`. Magnetic `[[./materials.md#ferromagnetic-materials]]` (ASI `[stamps_active_2024]`). Hydrogels (`[yu_hydrogels_2020]`).
*   **Connections:** State triggered by T, light, fields (`[[#thermal-transduction]]`, `[[#optical-transduction]]`, `[[#electrical-ionic-transduction]]`). Readout via physical properties. Linked to `[[./phenomena.md#phase-transitions]]`.

#### shape-memory
*   **Mechanism ID:** `shape-memory` (`[[./css.md#PartOfEdge]]` → `[[#physical-structural-memory-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Memory)`)
*   **Human-Readable Title:** Remembering Shape
*   **Description:** Material stores "permanent" shape recoverable after deformation upon trigger. (`[lee_shape_2022]`). Magnetic (`[xia_dynamic_2022]`). Use context (`[terryn_review_2021]`).
*   **Physics/Primitives:** Release of stored elastic strain via phase transition (T_g, T_m, martensitic).
*   **Enabling Materials:** `[[./materials.md#shape-memory-polymers-smps]]`, SMAs, `[[./materials.md#magneto-elastic-composites]]`. Potential `[[./materials.md#liquid-crystal-elastomers-lces]]`. Review (`[mcevoy_materials_2015]`).
*   **Connections:** Triggered `[[#thermal-transduction]]`. Causes `[[#mechanical-actuation]]`. Underpins `[[./phenomena.md#shape-memory-effect]]`.

#### topological-defect-memory
*   **Mechanism ID:** `topological-defect-memory` (`[[./css.md#PartOfEdge]]` → `[[#physical-structural-memory-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Memory)`)
*   **Human-Readable Title:** Memory in Material Structure Defects
*   **Description:** Info stored in configuration/type/location of topological defects. Nematic bit `[kos_nematic_2022]`. Experimental (`[aya_reconfigurable_2020]`). Bio (`[maroudas-sacks_topological_2021]`). Theory (`[zhang_computing_2021]`).
*   **Physics/Primitives:** Defect stability/metastability, Interaction forces, Defect dynamics. Topological constraints.
*   **Enabling Materials:** `[[./materials.md#liquid-crystals-lcs]]`. Other ordered systems? Biological networks (`[maroudas-sacks_topological_2021]`).
*   **Connections:** Readout `[[#optical-response]]`. Enable `[[#physical-embodied-computation]]`. Formation `[[#driven-by-physical-forces-dynamics]]`. Theory `[[./theoretical.md#liquid-crystal-theory]]`. Phenomena `[[./phenomena.md#defect-pattern-formation]]`.

#### irreversible-state-change-memory
*   **Mechanism ID:** `irreversible-state-change-memory` (`[[./css.md#PartOfEdge]]` → `[[#physical-structural-memory-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Memory)`)
*   **Human-Readable Title:** One-Time Recording Memory
*   **Description:** Memory via irreversible physical/chemical change (damage, reaction). Used for passive recording/indication. Damage reporting `[bayat_self-indicating_2024]`.
*   **Physics/Primitives:** Capsule rupture (`[hu_self-reporting_2025]`), Irreversible reaction (`[kim_polymeric_2015]`), Bond cleavage, Fracture.
*   **Enabling Materials:** `[[./materials.md#microcapsule-composites]]` (`[hu_self-reporting_2025]`), some `[[./materials.md#photomechanochromic-polymers]]`, Self-immolative polymers (`[kim_polymeric_2015]`).
*   **Connections:** Triggered `[[#mechanical-transduction]]`, `[[#chemical-transduction]]`. Readout `[[#optical-response]]`, `[[./methods.md#mechanical-testing]]`. Related self-healing (`[wool_self-healing_2008]`).

### dynamic-state-memory
*   **Mechanism ID:** `dynamic-state-memory` (`[[./css.md#PartOfEdge]]` → `[[#memory-and-adaptation-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Memory)`)
*   **Human-Readable Title:** Fleeting Memory in System Dynamics
*   **Description:** Transient memory in ongoing dynamics or decaying states. Essential for temporal processing. Short-term plasticity (`[martin_synaptic_2000]`). Brain activity (`[obyrne_how_2022]`). Bio (`[boussard_memory_2019]`). Material (`[wan_artificial_2020]`).
*   **Physics/Primitives:** Fading Memory, Temporal Integration, Echo states, Activity Persistence, Transient polarization (`[kamsma_iontronic_2023]`), Short-term charge trap (`[lee_nanograin_2023]`), Hysteresis (`[milana_morphological_2022]`). Flow states (`[kramar_encoding_2021]`). Relaxation (`[falk_learning_2023]`).
*   **Enabling Systems:** ANNs/RNNs (`[yang_task_2019]`). Physical reservoirs (`[nakajima_information_2015]`, `[[./materials.md#ferrofluids]]` `[crepaldi_experimental_2023]`). Relaxation systems (`[reiter_memorizing_2020]`).
*   **Connections:** Core for `[[#reservoir-computing]]`. Supports temporal `[[#neuromorphic-computation]]`. Influenced by `[[#energy-flow-dissipation]]`. Enables `[[./phenomena.md#short-term-memory]]`, `[[./phenomena.md#synaptic-plasticity-emulation]]` (PPF). Links to `[[./theoretical.md#dynamical-systems-theory]]`.

### environmental-memory
*   **Mechanism ID:** `environmental-memory` (`[[./css.md#PartOfEdge]]` → `[[#memory-and-adaptation-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Memory)`)
*   **Human-Readable Title:** Memory Written onto the World (Stigmergy)
*   **Description:** Indirect memory via agent modifications to environment influencing later behavior. Social insects, swarm robots. Concept (`[couzin_collective_2009]`).
*   **Physics/Primitives:** Trail deposition, Environmental structuring, Gradient creation.
*   **Examples:** Ant trails (`[theraulaz_spatial_2002]`), Termite mounds. Swarm robots (`[sitti_physical_2021]`). Slime mold (`[kramar_encoding_2021]`).
*   **Connections:** Mechanism for `[[#collective-swarm-computation]]`. Links past `[[#actuation-and-response-mechanisms]]` to future `[[#information-interface-sensing-and-transduction-mechanisms]]`. Key for `[[./theoretical.md#collective-intelligence-conceptual]]`. Drives `[[#self-organization-and-emergence-mechanisms]]`.

### adaptation-and-learning-mechanisms
*   **Mechanism ID:** `adaptation-and-learning-mechanisms` (`[[./css.md#PartOfEdge]]` → `[[#memory-and-adaptation-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Adaptation)`) (Category)
*   **Human-Readable Title:** How Systems Learn and Adapt (Category)
*   **Description:** Processes enabling modification of system state/behavior based on experience, feedback, optimization. Includes algorithms and physical/biological processes.

#### algorithmic-adaptation-learning
*   **Mechanism ID:** `algorithmic-adaptation-learning` (`[[./css.md#PartOfEdge]]` → `[[#adaptation-and-learning-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Adaptation)`) (Category)
*   **Human-Readable Title:** Adaptation via Algorithms (Machine Learning / AI)
*   **Description:** Adaptation implemented via explicit computational algorithms (e.g., ML). Includes `[[#supervised-learning-algorithms]]`, `[[#reinforcement-learning-algorithms]]`, `[[#unsupervised-correlation-learning-algorithms]]`, `[[#evolutionary-algorithms]]`. Drives `[[./phenomena.md#learning--adaptive-behavior]]`. Uses `[[./methods.md#optimization-algorithms]]`. Modifies state memory.

##### supervised-learning-algorithms
*   **Mechanism ID:** `supervised-learning-algorithms` (`[[./css.md#PartOfEdge]]` → `[[#algorithmic-adaptation-learning]]`) (`[[./css.md#MechanismNode]](category=Adaptation)`)
*   **Human-Readable Title:** Learning from Labeled Examples
*   **Description:** Adaptation guided by labeled data or explicit error signals. Neural nets (`[yang_task_2019]`). Physical (`[stern_training_2024]`). Used for Classification/Regression (`[[./phenomena.md#classification--regression-performance]]`). Chemical system (`[banda_online_2013]`).
*   **Physics/Primitives:** Error calc, Gradient descent/backprop (`[yang_memristor_2022]`), Regression (`[nakajima_information_2015]`).
*   **Connections:** Requires error feedback. Modifies parameters `[[#physical-structural-memory-mechanisms]]` in hardware NNs. Methods `[[./methods.md#backpropagation-and-training]]`. Theory `[[./theoretical.md#network-theory]]`.

##### reinforcement-learning-algorithms
*   **Mechanism ID:** `reinforcement-learning-algorithms` (`[[./css.md#PartOfEdge]]` → `[[#algorithmic-adaptation-learning]]`) (`[[./css.md#MechanismNode]](category=Adaptation)`)
*   **Human-Readable Title:** Learning via Trial-and-Error (Reward/Punishment)
*   **Description:** Agent learns policy to maximize cumulative reward via environment interaction. Applied (`[lowen_towards_2025]`, `[zhao_exploring_2024]`). Bio model (`[seifert_reinforcement_2024]`). Criticality link (`[aguilera_exploring_2018]`). Review (`[huang_increasingly_2022]`).
*   **Physics/Primitives:** Policy Evaluation, Policy Improvement, Temporal Difference learning, Reward Prediction Error. Exploration. Uses ANNs (`[zhao_exploring_2024]`).
*   **Connections:** Needs reward signal. Learns policy for `[[#actuation-and-response-mechanisms]]`. Methods `[[./methods.md#reinforcement-learning]]`. Drives `[[./phenomena.md#learning--adaptive-behavior]]`. Modifies parameters `[[#physical-structural-memory-mechanisms]]`.

##### unsupervised-correlation-learning-algorithms
*   **Mechanism ID:** `unsupervised-correlation-learning-algorithms` (`[[./css.md#PartOfEdge]]` → `[[#algorithmic-adaptation-learning]]`) (`[[./css.md#MechanismNode]](category=Adaptation)`)
*   **Human-Readable Title:** Learning Patterns from Data (Unsupervised)
*   **Description:** Adaptation based on identifying correlations/patterns in input data without labels/rewards. Hebbian rules. Hopfield (`[riley_neuromorphic_2022]`). RBMs (`[decelle_inferring_2024]`). Bio (`[martin_synaptic_2000]`). Criticality (`[aguilera_exploring_2018]`). Physical (`[buckley_natural_2024]`). FEP (`[[./theoretical.md#active-inference-fep]]`).
*   **Physics/Primitives:** Hebbian, STDP (`[srinivasa_criticality_2015]`), Competitive Learning, PCA. Clustering (`[[./methods.md#ml-classificationregression-svm-mlp-k-means-som]]`).
*   **Connections:** Drives `[[./phenomena.md#synaptic-plasticity-emulation]]`. Modifies weights `[[#physical-structural-memory-mechanisms]]`. Enables `[[./phenomena.md#associative-memory--pattern-completion]]`. Used in `[[#neuromorphic-computation]]`.

##### evolutionary-algorithms
*   **Mechanism ID:** `evolutionary-algorithms` (`[[./css.md#PartOfEdge]]` → `[[#algorithmic-adaptation-learning]]`) (`[[./css.md#MechanismNode]](category=Adaptation)`)
*   **Human-Readable Title:** Learning through Simulated Evolution
*   **Description:** Population-based optimization via selection, mutation, crossover. Designs robots (`[kriegman_scalable_2020]`), behaviors (`[lowen_towards_2025]`), algorithms (`[gregor_self-organizing_2020]`). Design (`[howard_evolving_2019]`). System (`[fuchslin_evolving_2006]`). Material design (`[falk_learning_2023]`).
*   **Physics/Primitives:** Selection, Mutation, Crossover. Population dynamics.
*   **Connections:** Methods `[[./methods.md#evolutionary-algorithms]]`. Optimizes parameters/structures. Enables complex emergent behavior `[[./phenomena.md#learning--adaptive-behavior]]`.

#### physical-intrinsic-learning-rules
*   **Mechanism ID:** `physical-intrinsic-learning-rules` (`[[./css.md#PartOfEdge]]` → `[[#adaptation-and-learning-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Adaptation)`)
*   **Human-Readable Title:** Learning via Physical Adaptation Laws
*   **Description:** Adaptation arising from physical laws/material properties directly. E.g., Natural Induction (`[buckley_natural_2024]`), Mech Backprop (`[li_training_2024]`), Conductance update (`[kuncic_emergent_2018]`), Dissipative Adaptation (`[england_dissipative_2015]`). Coupled (`[stern_training_2024]`). Phase memory (`[yu_hydrogels_2020]`). Aging (`[reiter_memorizing_2020]`). Ion dynamics (`[robin_long-term_2023]`, `[kamsma_iontronic_2023]`). Active Inference physical (`[stamps_active_2024]`). Bio (`[wadhams_making_2004]`). Healing (`[wool_self-healing_2008]`).
*   **Physics/Primitives:** Viscoelastic relaxation, Physics-based gradients, Potential minimization, Energy/stress minimization. Threshold dynamics (`[hu_multi-compartment_2022]`). Pressure gating (`[barnaveli_pressure-gated_2024]`).
*   **Connections:** Modifies `[[#physical-structural-memory-mechanisms]]`. Results in `[[./phenomena.md#learning--adaptive-behavior]]`. Links adaptation `A` to dynamics `T`. Theory `[[./theoretical.md#statistical-mechanics--stochastic-thermodynamics]]`.

#### biological-plasticity-mechanisms
*   **Mechanism ID:** `biological-plasticity-mechanisms` (`[[./css.md#PartOfEdge]]` → `[[#adaptation-and-learning-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Adaptation)`) (Category)
*   **Human-Readable Title:** How Living Systems Adapt (Beyond Learning Rules)
*   **Description:** Adaptive processes inherent in biology: cell responses, tissue remodeling, development, homeostasis, immunity. Basis `[[./theoretical.md#basal-minimal-cognition-conceptual]]`. Inspires materials (`[terryn_review_2021]`). Driven by `[[#energy-flow-dissipation]]`. Involves `[[#driven-by-biological-processes]]`. Subtypes: `[[#synaptic-plasticity]]`, `[[#cellular-tissue-plasticity]]`, `[[#developmental-plasticity]]`, `[[#immune-system-adaptation]]`.

##### synaptic-plasticity
*   **Mechanism ID:** `synaptic-plasticity` (`[[./css.md#PartOfEdge]]` → `[[#biological-plasticity-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Adaptation)`)
*   **Human-Readable Title:** Adapting Connections Between Neurons
*   **Description:** Activity-dependent modification of synaptic strength. Hebbian, STDP, LTD, LTP. Key for brain learning/memory. Review (`[martin_synaptic_2000]`). Target for `[[#neuromorphic-computation]]` (`[loeffler_neuromorphic_2023]`). STDP rule (`[srinivasa_criticality_2015]`).
*   **Physics/Primitives:** Hebbian, STDP window, LTD/LTP protocols, Receptor trafficking.
*   **Connections:** Stores info in synaptic weights `[[#physical-structural-memory-mechanisms]]`. Enables `[[./phenomena.md#learning--adaptive-behavior]]`, `[[./phenomena.md#associative-memory--pattern-completion]]`. Simulated `[[#unsupervised-correlation-learning-algorithms]]`.

##### cellular-tissue-plasticity
*   **Mechanism ID:** `cellular-tissue-plasticity` (`[[./css.md#PartOfEdge]]` → `[[#biological-plasticity-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Adaptation)`)
*   **Human-Readable Title:** Adaptation at Cell and Tissue Levels
*   **Description:** Cells/tissues adapt state/function/structure to cues. Homeostasis, physiological adaptation, regeneration, repair, remodeling. Studied (`[levin_multiscale_2024]`). Xenobots (`[kriegman_scalable_2020]`). Bacteria (`[wadhams_making_2004]`). Taxis (`[sitti_physical_2021]`). Sensory adapt (`[sartori_thermodynamic_2014]`, `[boussard_memory_2019]`). Failure -> cancer (`[lagasse_future_2023]`). Metabolism/Signaling (`[monzel_energetics_2024]`).
*   **Physics/Primitives:** Homeostatic feedback, Stress response, Cell fate change, Coordinated migration/proliferation, Mechanics feedback (`[maroudas-sacks_topological_2021]`), Bioelectric signaling (`[levin_multiscale_2024]`).
*   **Connections:** Drives `[[./phenomena.md#morphogenesis--regeneration--homeostasis]]`, `[[./phenomena.md#self-healing--self-repair]]`. Uses `[[#information-interface-sensing-and-transduction-mechanisms]]`. Involves `[[./theoretical.md#collective-intelligence-conceptual]]`. Needs `[[./materials.md#living-cells-and-tissues]]`. Studied `[[./methods.md#biological-manipulation]]`.

##### developmental-plasticity
*   **Mechanism ID:** `developmental-plasticity` (`[[./css.md#PartOfEdge]]` → `[[#biological-plasticity-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Adaptation)`)
*   **Human-Readable Title:** Adaptation During Development
*   **Description:** Development adjusts trajectories/outcomes response to genetic/environmental variation. Canalization, regulation. Context (`[levin_multiscale_2024]`). Concept (`[ciaunica_nested_nodate]`).
*   **Physics/Primitives:** Robust morphogenesis, Feedback for target morphology (`[lagasse_future_2023]`), Environmental gene regulation.
*   **Connections:** Crucial during `[[./phenomena.md#morphogenesis--regeneration--homeostasis]]`. Linked to `[[#driven-by-biological-processes]]`. Relies on epigenetic memory `[[#phase-conformation-memory]]`.

##### immune-system-adaptation
*   **Mechanism ID:** `immune-system-adaptation` (`[[./css.md#PartOfEdge]]` → `[[#biological-plasticity-mechanisms]]`) (`[[./css.md#MechanismNode]](category=Adaptation)`)
*   **Human-Readable Title:** Learning and Adaptation in Immunity
*   **Description:** Immune system recognition, self/non-self discrimination, specific responses, immunological memory. Innate/adaptive branches. Link brain/cognition (`[ciaunica_nested_nodate]`).
*   **Physics/Primitives:** Clonal selection/expansion, Somatic hypermutation, Affinity maturation, Memory cells, Trained immunity (epigenetics).
*   **Connections:** Molecular memory (`[[#phase-conformation-memory]]`). Underpins `[[./phenomena.md#immunological-memory]]`. Uses `[[#chemical-transduction]]` (antigen recog).

---

## Mechanism Interplay and Connections
*   **Slug (for internal reference, will be ID):** `mechanism-interplay-and-connections`
*   **Description:** The interplay between these mechanisms enables complex cognitive behaviors.
*   **Perception-Action Loops:** Sensing (`[[#information-interface-sensing-and-transduction-mechanisms]]`) → Computation (`[[#information-processing-and-computation-mechanisms]]`) → Action (`[[#actuation-and-response-mechanisms]]`) → Environmental Change → Sensing. (Formalized by `[[./theoretical.md#active-inference-fep]]` (`[parr_active_2022]`)).
*   **Learning & Memory:** Adaptation (`[[#adaptation-and-learning-mechanisms]]`) modifies Memory (`[[#memory-and-adaptation-mechanisms]]`) based on experience (processed input), biasing future Computation and Action.
*   **Embodied Intelligence:** Integration of physical mechanisms within morphology (`[[#physical-embodied-computation]]`, sensing, actuation, memory) (`[pfeifer_morphological_2006]`). Links to `[[./theoretical.md#embodied-intelligence-conceptual]]`.
*   **Self-Organization & Function:** Self-organization (`[[#self-organization-and-emergence-mechanisms]]`) creates structures enabling function (Computation `[langton_computation_1990]`, Memory `[kos_nematic_2022]`, Actuation `[xi_emergent_2024-1]`).
*   **Energy Constraints:** Energy flow (`[[#energy-flow-dissipation]]`) powers active mechanisms and `[[./theoretical.md#thermodynamics-of-information]]` / `[[./theoretical.md#thermodynamic-uncertainty-relations]]` constrain their efficiency/precision.
*   **Hierarchy/Scale:** Mechanisms interact across levels (`[levin_multiscale_2024]`). Connects `[[./theoretical.md#collective-intelligence-conceptual]]` to individual agent behavior.

---