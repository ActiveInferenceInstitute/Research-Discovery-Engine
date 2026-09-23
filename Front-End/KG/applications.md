# Applications: Targeted Use Cases and Technologies

**Description:** This document catalogues potential or demonstrated applications, technological domains, or functional goals targeted by the systems, mechanisms, materials, or phenomena described in the CNM. These represent the target use cases (`[[./css.md#ApplicationNode]]`) for the knowledge components.

---

## Index of Applications

*   [Soft Robotics](#soft-robotics)
*   [Neuromorphic Computing / Hardware](#neuromorphic-computing--hardware)
*   [Active Matter Research / Control](#active-matter-research--control)
*   [Bioengineering / Biomedical Devices](#bioengineering--biomedical-devices)
*   [Materials Discovery / Design](#materials-discovery--design)
*   [Drug Delivery](#drug-delivery)
*   [Biosensing](#biosensing)
*   [Sensing (General)](#sensing-general)
*   [Structural Health Monitoring](#structural-health-monitoring)
*   [Self-Healing Materials Applications](#self-healing-materials-applications)
*   [Reconfigurable Systems / Modular Robotics](#reconfigurable-systems--modular-robotics)
*   [Nanotechnology / Micro-assembly](#nanotechnology--micro-assembly)
*   [Microrobotics](#microrobotics)
*   [Flexible Electronics](#flexible-electronics)
*   [Energy Harvesting](#energy-harvesting)
*   [Lab-on-a-Chip / Microfluidics Applications](#lab-on-a-chip--microfluidics-applications)
*   [Artificial Cells / Protocells](#artificial-cells--protocells)
*   [Unconventional / Physical Computing](#unconventional--physical-computing)
*   [Data Storage](#data-storage)
*   [Quantum Technologies](#quantum-technologies)
*   [Bioelectronics](#bioelectronics)
*   [Tissue Engineering](#tissue-engineering)
*   [Neural Interfaces](#neural-interfaces) 

---

### soft-robotics
*   **Application ID:** `soft-robotics` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Soft Robotics
*   **Description:** Development of robots primarily composed of soft, compliant materials, enabling safe human interaction, adaptation to unstructured environments, and biomimicry. Often relies on `[[./theoretical.md#embodied-intelligence-conceptual]]`.
*   **Relevant Systems/Mechanisms/Materials:** Enabled by `[[./materials.md#elastomers-general]]` (`[rus_design_2015]`), `[[./materials.md#hydrogels-general]]` (`[soto_programmable_2023]`), `[[./materials.md#shape-memory-polymers-smps]]`, `[[./materials.md#liquid-crystal-elastomers-lces]]` (`[palagi_bioinspired_2018]`, `[li_computational_2024]`), `[[./materials.md#magneto-elastic-composites]]` (`[hu_small-scale_2018]`). Requires `[[./mechanisms.md#mechanical-actuation]` (`[gepner_fluidic_2024]`), sensing `[[./mechanisms.md#mechanical-transduction]` (`[[./materials.md#piezoresistive-composites]]` `[thuruthel_soft_2019]`), and integrated control/computation (potentially `[[./mechanisms.md#physical-embodied-computation]]`, `[zhao_exploring_2024]`). Explores phenomena like `[[./phenomena.md#bio-inspired-actuation]]`. Design methods include `[[./methods.md#3d-printing-additive-manufacturing]]`, `[[./methods.md#inverse-design]]`. Example system `[wehner_integrated_2016]`.
*   **References:** `[rus_design_2015]`, `[soto_programmable_2023]`, `[pfeifer_self-organization_2007]`, `[li_computational_2024]`.

### neuromorphic-computing--hardware
*   **Application ID:** `neuromorphic-computing--hardware` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Neuromorphic Computing / Hardware
*   **Description:** Developing hardware systems that emulate the structure and function of biological nervous systems for efficient, brain-like computation. Aims to overcome limitations of von Neumann architecture for certain AI tasks. Conceptual basis `[mead_neuromorphic_1990]`.
*   **Relevant Systems/Mechanisms/Materials:** Core mechanism is `[[./mechanisms.md#neuromorphic-computation]]`. Relies heavily on memory mechanisms like `[[./mechanisms.md#resistance-switching-memristance]]`, `[[./mechanisms.md#phase-conformation-memory]]`, or `[[./mechanisms.md#dynamic-state-memory]]`. Implemented using materials/devices like `[[./materials.md#memristors]]` (`[yao_fully_2020]`), `[[./materials.md#nanowires]]` (`[kuncic_emergent_2018]`), `[[./materials.md#iontronic-devices]]` (`[kamsma_iontronic_2023]`), Photonics (`[wright_deep_2022]`), or even unconventional substrates `[stern_training_2024]`. Demonstrates phenomena like `[[./phenomena.md#synaptic-plasticity-emulation]]`, `[[./phenomena.md#associative-memory--pattern-completion]]`, `[[./phenomena.md#classification--regression-performance]]`. Requires fabrication (`[[./methods.md#micro-nano-fabrication]]`) and testing (`[[./methods.md#electrical-measurements]]`). Related theories: `[[./theoretical.md#network-theory]]`, `[[./theoretical.md#criticality--phase-transitions]]`.
*   **References:** `[yao_fully_2020]`, `[wan_artificial_2020]`, `[kaspar_rise_2021]`, `[kuncic_emergent_2018]`.

### active-matter-research--control
*   **Application ID:** `active-matter-research--control` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Active Matter Research / Control
*   **Description:** The study and control of systems composed of many interacting units that consume energy to generate motion or mechanical forces (`[[./theoretical.md#active-matter]]`). Applications include understanding biological collective behavior and designing microscopic robotic systems.
*   **Relevant Systems/Mechanisms/Materials:** Focuses on systems exhibiting phenomena like `[[./phenomena.md#flocking--schooling--swarming]]`, `[[./phenomena.md#clustering--aggregation--phase-separation]]`, `[[./phenomena.md#active-turbulence]]`, `[[./phenomena.md#collective-rotation--milling]]`. Core mechanisms include `[[./mechanisms.md#driven-by-physical-forces-dynamics]]`, self-propulsion `[[./mechanisms.md#mechanical-actuation]]`, communication `[[./mechanisms.md#indirect-relayed-sensing]]`. Uses materials like `[[./materials.md#active-matter-fluids]]`, `[[./materials.md#catalytic-particles]]` (`[ebbens_active_2016]`), `[[./materials.md#emulsion-droplets]]`. Studied via `[[./methods.md#particle-based-modeling]]`, `[[./methods.md#agent-based-modeling-abm]]`, `[[./methods.md#particle-cell-tracking-analysis]]`.
*   **References:** `[gompper_2025_2025]`, `[negi_emergent_2022]`, `[cavagna_scale-free_2010]`, `[lavergne_group_2019]`.

### bioengineering--biomedical-devices
*   **Application ID:** `bioengineering--biomedical-devices` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Bioengineering / Biomedical Devices
*   **Description:** Application of engineering principles to biological systems or the development of devices for interacting with biological systems, including diagnostics, therapeutics, and prosthetics.
*   **Relevant Systems/Mechanisms/Materials:** Includes areas like `[[#drug-delivery]]`, `[[#biosensing]]`, `[[#tissue-engineering]]`. Requires biocompatible materials (`[[./materials.md#hydrogels-general]]`, `[[./materials.md#elastomers-general]]`, `[[./materials.md#self-assembling-peptides]]`). Involves `[[#bioelectronics]]`, `[[#neural-interfaces]]` (`[buehler_innovative_2025]` summary). Utilizes `[[./materials.md#living-cells-and-tissues]]` as components or targets (`[gumuskaya_motile_2024]`). Uses `[[./methods.md#microfluidics]]` for device creation/operation (`[[#lab-on-a-chip--microfluidics-applications]]`).
*   **References:** `[levin_multiscale_2024]`, `[ciaunica_nested_nodate]`, `[gumuskaya_motile_2024]`, `[huang_self-regulation_2018]`.

### materials-discovery--design
*   **Application ID:** `materials-discovery--design` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Materials Discovery / Design
*   **Description:** Accelerating the discovery, design, and optimization of new materials with desired properties, often using computational and data-driven approaches (`[huang_increasingly_2022]`, `[falk_learning_2023]`, `[obrien_machine_2024]`). AI Impact `[buehler_innovative_2025]` review context `[lu_fine-tuning_2025]`.
*   **Relevant Systems/Mechanisms/Materials:** Utilizes computational methods like `[[./methods.md#simulation--modeling-methods]]`, ML (`[[./methods.md#ml-classificationregression-svm-mlp-k-means-som]]`), optimization (`[[./methods.md#optimization-algorithms]]`, esp. `[[./methods.md#inverse-design]]` (`[chen_metamaterials_2023]`) and `[[./methods.md#topology-optimization]]` (`[bordiga_automated_2024]`, `[li_computational_2024]`), potentially `[[./theoretical.md#active-inference-fep]]`). Targets discovery of specific `[[./materials.md]]` types (e.g., Quantum Materials `[thedford_promise_2023]`, Bioinspired Materials `[wegst_bioinspired_2015]`). Requires databases and simulation results.
*   **References:** `[huang_increasingly_2022]`, `[obrien_machine_2024]`, `[paixao_leveraging_2022]`, `[bordiga_automated_2024]`.

### drug-delivery
*   **Application ID:** `drug-delivery` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Targeted Drug Delivery
*   **Description:** Developing systems (often micro/nano-scale) to transport therapeutic agents to specific locations in the body and release them in a controlled manner. Review `[nelson_delivering_2023]`.
*   **Relevant Systems/Mechanisms/Materials:** Primarily enabled by `[[./phenomena.md#targeted-delivery]]`. Requires controlled release (`[[./mechanisms.md#chemical-actuation]]`), potentially navigation (`[[./phenomena.md#controlled-locomotion--navigation]]`). Uses vehicles like `[[./materials.md#emulsion-droplets]]` (`[lagzi_maze_2010]`), `[[./materials.md#self-assembling-peptides]]` (`[he_peptide-induced_2018]`), capsules (`[[./materials.md#microcapsule-composites]]`), or engineered `[[#microrobotics]]`. Often involves `[[./materials.md#hydrogels-general]]` or biodegradable polymers. May utilize `[[./phenomena.md#chemotaxis--taxis-behaviors]]` (`[holler_autoselective_2020]`).
*   **References:** `[nelson_delivering_2023]`, `[he_peptide-induced_2018]`, `[holler_autoselective_2020]`, `[hu_modular_2023]`.

### biosensing
*   **Application ID:** `biosensing` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Biosensing
*   **Description:** Detecting specific biological analytes (biomarkers, pathogens, DNA, proteins, metabolites) often for diagnostic or monitoring purposes.
*   **Relevant Systems/Mechanisms/Materials:** Requires high sensitivity and specificity, often using `[[./mechanisms.md#chemical-transduction]]` coupled with `[[./mechanisms.md#optical-response]]` or `[[./mechanisms.md#electrical-response]]`. Examples include OECT sensors (`[[./materials.md#conductive-polymers]]` `[luo_highly_2023]`), DNA nanopore sensors (`[zhang_nanopore_2022]`), LC-based sensors (`[[./materials.md#liquid-crystals-lcs]]` `[wang_liquid_2022]`), Peptide array sensors (`[[./materials.md#self-assembling-peptides]]` `[dawson_differential_2023]`). ML assist (`[luo_machine-learning-assisted_2022]`).
*   **References:** `[wang_liquid_2022]`, `[dawson_differential_2023]`, `[luo_highly_2023]`.

### sensing-general
*   **Application ID:** `sensing-general` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Sensing (General)
*   **Description:** Detecting various physical or chemical stimuli (beyond biological) using responsive materials and transduction mechanisms. Includes tactile sensing, pressure sensing, chemical vapor sensing, optical sensing, etc.
*   **Relevant Systems/Mechanisms/Materials:** Broad application leveraging any `[[./mechanisms.md#information-interface-sensing-and-transduction-mechanisms]]`. Piezoresistives (`[[./materials.md#piezoresistive-composites]]`) for strain. Responsive polymers (`[[./materials.md#photomechanochromic-polymers]]`) for force/light. Embedded sensors (`[[./materials.md#microcapsule-composites]]`). LCs for chemicals (`[wang_liquid_2022]`). Needs integration with readout systems.
*   **References:** `[thuruthel_soft_2019]`, `[wan_artificial_2020]` (review).

### structural-health-monitoring
*   **Application ID:** `structural-health-monitoring` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Structural Health Monitoring (SHM)
*   **Description:** Monitoring the integrity and condition of structures (buildings, bridges, aircraft) to detect damage or predict failure.
*   **Relevant Systems/Mechanisms/Materials:** Utilizes materials with embedded sensing (`[[./phenomena.md#damage-self-reporting]]`) enabled by `[[./mechanisms.md#mechanical-transduction]]` linked to `[[./mechanisms.md#optical-response]]` or `[[./mechanisms.md#electrical-response]]`. Materials like `[[./materials.md#photomechanochromic-polymers]]` (`[bayat_self-indicating_2024]`) or `[[./materials.md#microcapsule-composites]]` (`[hu_selfreporting_2024]`) are relevant. May involve distributed sensor networks (`[[./mechanisms.md#indirect-relayed-sensing]]`).
*   **References:** `[bayat_self-indicating_2024]`, `[hu_selfreporting_2024]`.

### self-healing-materials-applications
*   **Application ID:** `self-healing-materials-applications` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Self-Healing Materials Applications
*   **Description:** Using materials capable of autonomous damage repair (`[[./phenomena.md#self-healing--self-repair]]`) to enhance durability, lifespan, and safety of products and structures. Reviews (`[wool_self-healing_2008]`, `[terryn_review_2021]`).
*   **Relevant Systems/Mechanisms/Materials:** Direct application of materials like `[[./materials.md#polymma-co-nba-copolymers]]` (`[urban_key-and-lock_2018]`) or `[[./materials.md#microcapsule-composites]]` (`[calvino_microcapsule-containing_2018]`) capable of self-repair. Relevant to `[[#flexible-electronics]]`, protective coatings, soft robotics (`[rauba_self-healing_2024]`).
*   **References:** `[wool_self-healing_2008]`, `[urban_key-and-lock_2018]`, `[terryn_review_2021]`.

### reconfigurable-systems--modular-robotics
*   **Application ID:** `reconfigurable-systems--modular-robotics` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Reconfigurable Systems / Modular Robotics
*   **Description:** Designing systems (often robotic) composed of modules that can autonomously or externally be rearranged into different configurations to adapt to new tasks or environments.
*   **Relevant Systems/Mechanisms/Materials:** Requires controllable connections/interfaces, e.g., `[[./materials.md#btf-interface]]` (`[yang_self-amputating_2024]`). Uses `[[./mechanisms.md#shape-memory]]` (`[[./materials.md#shape-memory-polymers-smps]]`) or other stimuli-responsive actuation (`[[./mechanisms.md#mechanical-actuation]]`) for reconfiguration. Often involves `[[./mechanisms.md#self-organization--emergence-mechanisms]]` and `[[./mechanisms.md#collective-swarm-computation]]` principles (`[wang_robo-matter_2024]`). Magnetic assembly (`[ceron_programmable_2023]`). Origami/folding based (`[rus_design_2015]`). Microrobots (`[sitti_physical_2021]`). Metamaterial reconfiguration (`[louvet_reprogrammable_2024]`).
*   **References:** `[rus_design_2015]`, `[yang_self-amputating_2024]`, `[wang_robo-matter_2024]`.

### nanotechnology--micro-assembly
*   **Application ID:** `nanotechnology--micro-assembly` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Nanotechnology / Micro-assembly
*   **Description:** Building functional structures and devices at the nano/micro-scale, often using bottom-up self-assembly or robotic manipulation.
*   **Relevant Systems/Mechanisms/Materials:** Heavily relies on `[[./methods.md#self-assembly-methods]]` like `[[./methods.md#dna-directed-assembly]]` (`[ke_three-dimensional_2012]`, `[mcmullen_self-assembly_2022]`) and `[[./methods.md#colloidal-synthesis-assembly]]`. Utilizes materials like `[[./materials.md#dna]]`, `[[./materials.md#self-assembling-peptides]]`, `[[./materials.md#other-nanoparticles]]`. May use `[[./methods.md#micro-nano-fabrication]]` for templates or top-down components. Involves manipulation `[[./phenomena.md#manipulation-grasping-transport-release]` via micro-robots `[alapan_shape-encoded_2019]` or DNA walkers (`[sherman_precisely_2004]`). Related concepts (`[thedford_promise_2023]`).
*   **References:** `[ke_three-dimensional_2012]`, `[mcmullen_self-assembly_2022]`, `[sherman_precisely_2004]`, `[rothemund_folding_2006]`.

### microrobotics
*   **Application ID:** `microrobotics` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Microrobotics
*   **Description:** Development of autonomous or remotely controlled robotic systems operating at the micrometer scale, often for biomedical or micro-manipulation tasks. Reviews (`[ceylan_mobile_2017]`, `[sitti_physical_2021]`, `[huang_increasingly_2022]`).
*   **Relevant Systems/Mechanisms/Materials:** Require `[[./mechanisms.md#mechanical-actuation]]` for propulsion (`[[./phenomena.md#autonomous-self-propulsion]]`, `[[./phenomena.md#controlled-locomotion--navigation]]`) and `[[./phenomena.md#manipulation-grasping-transport-release]]`. Driven by fields (`[[./mechanisms.md#magnetic-transduction]]` `[[./methods.md#external-field-control]]` using `[[./materials.md#ferromagnetic-materials]]` `[khalil_precise_2015]`), chemical reactions (`[[./materials.md#catalytic-particles]]` `[ebbens_active_2016]`), or bio-hybrid designs (`[[./materials.md#living-cells-and-tissues]]` `[gumuskaya_motile_2024]`). May use collective behavior (`[[./phenomena.md#collective-motion--phase-behavior]]` `[wang_robo-matter_2024]`). Used for `[[#drug-delivery]]`.
*   **References:** See description; specific examples like `[khalil_precise_2015]`.

### flexible-electronics
*   **Application ID:** `flexible-electronics` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Flexible Electronics
*   **Description:** Electronic circuits and devices built on flexible or stretchable substrates, enabling wearable technology, conformable sensors, and soft robotics integration. Review (`[wan_artificial_2020]`).
*   **Relevant Systems/Mechanisms/Materials:** Relies on intrinsically flexible materials like `[[./materials.md#conductive-polymers]]`, `[[./materials.md#graphene--2d-materials]]`, `[[./materials.md#nanowires]]`, or composites like `[[./materials.md#piezoresistive-composites]]` fabricated on substrates like `[[./materials.md#elastomers-general]]`. Requires flexible memory (`[[./materials.md#memristors]]` adapted), sensors (`[[#sensing-general]]`), and potentially energy sources (`[[#energy-harvesting]]`). Enables integrated `[[./mechanisms.md#neuromorphic-computation]]`.
*   **References:** `[wan_artificial_2020]`, `[luo_highly_2023]`.

### energy-harvesting
*   **Application ID:** `energy-harvesting` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Energy Harvesting
*   **Description:** Devices capturing ambient energy (mechanical, thermal, solar, etc.) and converting it into usable electrical power (`[[./phenomena.md#energy-harvesting--conversion]]`). Key for self-powered devices, wireless sensors, wearables. Context (`[kaspar_rise_2021]`).
*   **Relevant Systems/Mechanisms/Materials:** Uses mechanisms like `[[./mechanisms.md#mechanical-transduction]]` (piezo/tribo `[kwak_optimal_2021]`), `[[./mechanisms.md#thermal-transduction]]` (thermoelectric), `[[./mechanisms.md#optical-transduction]]` (photovoltaic). Materials can include piezo polymers/ceramics, thermoelectrics, semiconductors, potentially engineered via `[[./materials.md#mechanical-metamaterials]]`.
*   **References:** `[kwak_optimal_2021]`, `[mcevoy_materials_2015]`.

### lab-on-a-chip--microfluidics-applications
*   **Application ID:** `lab-on-a-chip--microfluidics-applications` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Lab-on-a-Chip / Microfluidics Applications
*   **Description:** Miniaturized platforms integrating laboratory functions (sample handling, reaction, separation, detection) onto a small chip using `[[./methods.md#microfluidics]]`. Enables high-throughput screening, point-of-care diagnostics, controlled experiments. Basic concept `[thorsen_microfluidic_2002]`.
*   **Relevant Systems/Mechanisms/Materials:** Core method is `[[./methods.md#microfluidics]]`. Uses materials like `[[./materials.md#elastomers-general]]` (PDMS). Integrates sensing (`[[#biosensing]]`), control (`[[./methods.md#chemical-stimuli-control]]`), and potentially computation/sorting (`[lentz_low_2019]`). Used in areas like synthetic biology (`[sole_open_2024]`), drug delivery vehicle creation (`[hu_multi-compartment_2022]`). Review context `[fair_digital_2007]`.
*   **References:** `[thorsen_microfluidic_2002]`.

### artificial-cells--protocells
*   **Application ID:** `artificial-cells--protocells` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Artificial Cells / Protocells
*   **Description:** Synthetic constructs mimicking certain structural or functional aspects of biological cells, often involving compartmentalization (`[[./materials.md#lipid-bilayers]]`, `[[./materials.md#emulsion-droplets]]`) and potentially basic metabolism or information processing. Used to study origin of life (`[xavier_autocatalytic_2020]`) or build novel functional systems (`[hanczyc_chemical_2010]`). Context (`[sole_open_2024]`).
*   **Relevant Systems/Mechanisms/Materials:** Uses `[[./materials.md#lipid-bilayers]]`, `[[./materials.md#emulsion-droplets]]` for compartments. Incorporates reactions `[[./methods.md#chemical-pathway-network-modeling]]`, self-assembly `[[./methods.md#self-assembly-methods]]`, potentially basic sensing/response. Investigates `[[./mechanisms.md#driven-by-thermodynamic-statistical-principles]]` and `[[./mechanisms.md#self-organization--emergence-mechanisms]]`.
*   **References:** `[hanczyc_chemical_2010]`, `[xavier_autocatalytic_2020]`, `[sole_open_2024]`.

### unconventional--physical-computing
*   **Application ID:** `unconventional--physical-computing` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Unconventional / Physical Computing
*   **Description:** Harnessing non-standard physical processes or materials (beyond silicon electronics) to perform computation. Includes computing with waves (`[marcucci_theory_2020]`), slime molds (`[kramar_encoding_2021]`), chemical reactions (`[adamatzky_collision-based_2002]`), LCs (`[kos_nematic_2022]`), mechanical systems (`[jiao_mechanical_2023]`), etc. Covers `[[#neuromorphic-computing--hardware]]` and `[[./mechanisms.md#reservoir-computing]]` as sub-areas but is broader. Embodied approaches `[[./theoretical.md#embodied-intelligence-conceptual]]`. PI link `[[./theoretical.md#physical-intelligence-pi]]`. Review `[kaspar_rise_2021]`.
*   **Relevant Systems/Mechanisms/Materials:** Core mechanisms include `[[./mechanisms.md#physical-embodied-computation]]`. Leverages diverse materials and phenomena.
*   **References:** See description.

### data-storage
*   **Application ID:** `data-storage` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Data Storage
*   **Description:** Technologies for storing digital information. Relevant here are unconventional approaches like DNA data storage or memory devices based on material states.
*   **Relevant Systems/Mechanisms/Materials:** Enabled by `[[./phenomena.md#memory-storage--retrieval]]` mechanisms. DNA storage concept (`[[./materials.md#dna]]` `[mcmullen_self-assembly_2022]` implicit). Memristive memory (`[[./materials.md#memristors]]`). Molecular memory (`[kaspar_rise_2021]` context). Potentially LC defect memory (`[kos_nematic_2022]`).
*   **References:** Relevant mechanism/material references.

### quantum-technologies
*   **Application ID:** `quantum-technologies` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Quantum Technologies (Computing, Sensing, etc.)
*   **Description:** Technologies leveraging quantum mechanical phenomena (`[[./theoretical.md#quantum-mechanics]]`) for enhanced computation, communication, or sensing.
*   **Relevant Systems/Mechanisms/Materials:** Uses `[[./materials.md#quantum-systems]]`. Involves `[[./mechanisms.md#quantum-coherence-transport]]` mechanisms. Relevant materials: Superconductors, trapped ions, NV centers, potentially biological systems (`[lambert_quantum_2013]`). Quantum Reservoir Computing (`[sakurai_quantum_2022]`). Links plasmonics `[westerhout_plasmon_2018]`.
*   **References:** `[lambert_quantum_2013]`, `[sakurai_quantum_2022]`.

### bioelectronics
*   **Application ID:** `bioelectronics` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Bioelectronics
*   **Description:** Field integrating electronic devices and systems with biological entities. This includes implantable devices, biosensors, and systems for modulating biological activity.
*   **Relevant Systems/Mechanisms/Materials:** Uses `[[./materials.md#iontronic-devices]]`, `[[./materials.md#conductive-polymers]]`, `[[./materials.md#graphene--2d-materials]]`. Interacts with `[[./materials.md#living-cells-and-tissues]]`. Key for `[[#neural-interfaces]]`.
*   **Related Concepts:** `[[./theoretical.md#embodied-intelligence-conceptual]]`.

### tissue-engineering
*   **Application ID:** `tissue-engineering` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Tissue Engineering
*   **Description:** The use of a combination of cells, engineering and materials methods, and suitable biochemical and physicochemical factors to improve or replace biological tissues.
*   **Relevant Systems/Mechanisms/Materials:** Leverages `[[./materials.md#living-cells-and-tissues]]`, biomaterials like `[[./materials.md#hydrogels-general]]`, and `[[./methods.md#biological-construction]]`. Aims to achieve `[[./phenomena.md#morphogenesis--regeneration--homeostasis]]`.
*   **Related Applications:** `[[#bioengineering--biomedical-devices]]`.

### neural-interfaces
*   **Application ID:** `neural-interfaces` (`[[./css.md#ApplicationNode]]`)
*   **Human-Readable Title:** Neural Interfaces
*   **Description:** Devices that create a direct communication pathway between the nervous system and an external device, used for research, diagnostics, or therapeutic purposes (e.g., prosthetics, deep brain stimulation). (Often cited in the context of `[buehler_innovative_2025]` and neuromorphic research).
*   **Relevant Systems/Mechanisms/Materials:** Requires biocompatible and conductive materials (`[[./materials.md#metals]]`, `[[./materials.md#conductive-polymers]]`, `[[./materials.md#graphene--2d-materials]]`). Involves `[[./mechanisms.md#electrical-ionic-transduction]]` and `[[./mechanisms.md#electrical-response]]`. Part of `[[#bioelectronics]]`.
*   **Related Applications:** `[[#neuromorphic-computing--hardware]]`, `[[#bioengineering--biomedical-devices]]`.

---
