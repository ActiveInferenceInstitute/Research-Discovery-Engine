# Materials: Substrates for Cognition and Intelligence

**Description:** This document catalogues materials (nodes defined via `[[./css.md#MaterialNode]]`) implemented or analyzed in the reviewed studies. Each material serves as a physical substrate possessing specific properties (like those defined in `[[./css.md#ParameterNode]](role=MaterialProperty)) that enable core `[[./mechanisms.md]]` and underpin emergent `[[./phenomena.md]]` relevant to material cognition and embodied intelligence. Links point to associated `[[./theoretical.md]]`, `[[./methods.md]]`, and `[[./applications.md]]`.

---

## Index of Material Classes/Specific Materials

*   [Polymers and Elastomers](#polymers-and-elastomers)
    *   [elastomers-general](#elastomers-general)
    *   [hydrogels-general](#hydrogels-general)
    *   [pnipam-networks-in-ionic-liquid](#pnipam-networks-in-ionic-liquid)
    *   [polymma-co-nba-copolymers](#polymma-co-nba-copolymers)
    *   [shape-memory-polymers-smps](#shape-memory-polymers-smps)
    *   [photomechanochromic-polymers](#photomechanochromic-polymers)
    *   [conductive-polymers](#conductive-polymers)
    *   [ion-exchange-polymer-nafion](#ion-exchange-polymer-nafion)
    *   [misc-polymers](#misc-polymers)
    *   [block-copolymers](#block-copolymers)
*   [Composites](#composites)
    *   [piezoresistive-composites](#piezoresistive-composites)
    *   [magneto-elastic-composites](#magneto-elastic-composites)
    *   [conductive-filler-composites](#conductive-filler-composites)
    *   [microcapsule-composites](#microcapsule-composites)
    *   [phase-change-composites](#phase-change-composites)
    *   [btf-interface](#btf-interface)
    *   [lce-metamaterial-composites](#lce-metamaterial-composites)
    *   [mechanical-metamaterials](#mechanical-metamaterials)
*   [Biological and Bio-inspired Materials](#biological-and-bio-inspired-materials)
    *   [living-cells-and-tissues](#living-cells-and-tissues)
    *   [self-assembling-peptides](#self-assembling-peptides)
    *   [dna](#dna)
    *   [lipid-bilayers](#lipid-bilayers)
    *   [molecular-force-fields](#molecular-force-fields)
    *   [microtubules](#microtubules)
*   [Inorganic and Semiconductor Materials](#inorganic-and-semiconductor-materials)
    *   [silicon-si-and-porous-silicon-psi](#silicon-si-and-porous-silicon-psi)
    *   [oxides](#oxides)
    *   [metals](#metals)
    *   [ferromagnetic-materials](#ferromagnetic-materials)
    *   [fe3o4-nanoparticles](#fe3o4-nanoparticles)
    *   [graphene--2d-materials](#graphene--2d-materials)
    *   [nanowires](#nanowires)
    *   [other-nanoparticles](#other-nanoparticles)
    *   [catalytic-particles](#catalytic-particles)
    *   [quantum-dots](#quantum-dots)
*   [Liquid Crystals (LCs)](#liquid-crystals-lcs)
    *   [nematic-lcs](#nematic-lcs)
    *   [chiral-nematic-lcs](#chiral-nematic-lcs)
    *   [smectic-lcs](#smectic-lcs)
    *   [liquid-crystal-elastomers-lces](#liquid-crystal-elastomers-lces)
*   [Fluids and Colloids](#fluids-and-colloids)
    *   [aqueous-electrolytes](#aqueous-electrolytes)
    *   [ferrofluids](#ferrofluids)
    *   [emulsion-droplets](#emulsion-droplets)
    *   [ionic-liquids](#ionic-liquids)
    *   [organic-solvents](#organic-solvents)
    *   [active-matter-fluids](#active-matter-fluids)
    *   [colloidal-particles](#colloidal-particles)
*   [Granular Materials](#granular-materials)
    *   [granular-media](#granular-media)
*   [Other](#other)
    *   [memristors](#memristors) (Extracted as material type)
    *   [iontronic-devices](#iontronic-devices) (Extracted as material type)
    *   [plasmonics-metamaterials](#plasmonics-metamaterials) (Extracted concept)
    *   [quantum-systems](#quantum-systems) (Added abstract material type)
    *   [chemical-oscillators](#chemical-oscillators) (Added conceptual material type)
    *   [artificial-chemistries](#artificial-chemistries) (Added conceptual material type)
    *   [wave-propagation-media](#wave-propagation-media) (Added conceptual material type)
    *   [chemical-fuel](#chemical-fuel) (Generic material concept)

---

## Polymers and Elastomers

*   **Material ID:** `polymers-and-elastomers` (`[[./css.md#MaterialNode]](category=Polymer)`)
*   **Human-Readable Title:** Polymers and Elastomers (Class)
*   **Description:** Broad category encompassing materials composed of long-chain molecules, including flexible rubber-like elastomers. Processing `[[./methods.md#polymer-synthesis-processing]]`.

### elastomers-general
*   **Material ID:** `elastomers-general` (`[[./css.md#MaterialNode]](category=Polymer, state_of_matter=Soft Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#polymers-and-elastomers]]`
*   **Human-Readable Title:** Elastomers (PDMS, Silicone Rubbers, TPU, Polyjet Resins)
*   **Description:** Class of polymers exhibiting rubber-like elasticity. Examples: PDMS `[thorsen_microfluidic_2002]`, `[thuruthel_soft_2019]`; Silicone Rubbers `[soto_programmable_2023]`, `[hu_small-scale_2018]`; TPU `[riley_neuromorphic_2022]`, `[xiao_artificial_2020]`; Polyjet resins `[li_training_2024]`, `[yan_soft_2020]`.
*   **Key Properties:** Low elastic modulus (`[[./css.md#ParameterNode]](name=elastic_modulus)`), High strain capability, Compliance, Viscoelasticity.
*   **Enabled Mechanisms/Phenomena:** `[[./mechanisms.md#mechanical-actuation]]`, passive adaptation `[[./theoretical.md#embodied-intelligence-conceptual]]` (`[pfeifer_morphological_2006]`). Matrix for `[[#composites]]`. Substrate for `[[./mechanisms.md#physical-embodied-computation]]`, `[[./mechanisms.md#reservoir-computing]` (`[nakajima_information_2015]`).
*   **Associated Methods:** `[[./methods.md#3d-printing-additive-manufacturing]]`, `[[./methods.md#soft-lithography]]`, `[[./methods.md#mechanical-testing]]`.
*   **Associated Applications:** `[[./applications.md#soft-robotics]]` (`[rus_design_2015]`).

### hydrogels-general
*   **Material ID:** `hydrogels-general` (`[[./css.md#MaterialNode]](category=Polymer, state_of_matter=Gel)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#polymers-and-elastomers]]`
*   **Human-Readable Title:** Hydrogels (PAA, PNIPAm, Alginate, etc.)
*   **Description:** Crosslinked hydrophilic polymers absorbing water, exhibiting volume change. Examples: PAA `[zhao_phase_2021]`, PNIPAm `[chen_enormous-stiffness-changing_2022]`, Alginate `[holler_autoselective_2020]`, Na Polyacrylate `[soto_programmable_2023]`. Review context `[kaspar_rise_2021]`.
*   **Key Properties:** Stimuli-responsive swelling (`[[./phenomena.md#stimuli-responsive-property-switching]]`), High water content, Biocompatibility, Tunable mechanics, Permeability.
*   **Enabled Mechanisms/Phenomena:** Drives `[[./mechanisms.md#mechanical-actuation]` (`[soto_programmable_2023]`), enables `[[./mechanisms.md#chemical-transduction]` (`[archer_ph-responsive_2020]`), `[[./mechanisms.md#thermal-transduction]`, `[[./mechanisms.md#chemical-actuation]` (`[he_peptide-induced_2018]`), `[[./mechanisms.md#phase-conformation-memory]` (`[yu_hydrogels_2020]`). Matrix for `[[#phase-change-composites]]`.
*   **Associated Methods:** `[[./methods.md#polymer-synthesis-processing]]`, `[[./methods.md#mechanical-testing]]`, `[[./methods.md#biological-construction]` (`[holler_autoselective_2020]`).
*   **Associated Applications:** `[[./applications.md#soft-robotics]]`, `[[./applications.md#biosensing]]`, `[[./applications.md#drug-delivery]]`.

### pnipam-networks-in-ionic-liquid
*   **Material ID:** `pnipam-networks-in-ionic-liquid` (`[[./css.md#MaterialNode]](category=Composite, state_of_matter=Gel)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#hydrogels-general]]`; `[[./css.md#ComposedOfMaterialEdge]]` → `[[#ionic-liquids]]`
*   **Human-Readable Title:** PNIPAm-Ionic Liquid Ionogel (Extreme Stiffness Switching)
*   **Description:** PNIPAm hydrogel (`[[#hydrogels-general]]`) network in `[[#ionic-liquids]]` exhibiting extreme thermal stiffness switching via LLPS/vitrification (`[chen_enormous-stiffness-changing_2022]`).
*   **Key Properties:** >10⁵x reversible stiffness change, triggered by `[[./mechanisms.md#thermal-transduction]]`.
*   **Enabled Mechanisms/Phenomena:** Extreme `[[./phenomena.md#stimuli-responsive-property-switching]]`. Enables `[[./mechanisms.md#mechanical-actuation]]`, `[[./mechanisms.md#phase-conformation-memory]]`.
*   **Relevant Concepts:** `[[./theoretical.md#criticality--phase-transitions]]`.
*   **Associated Methods:** `[[./methods.md#polymer-synthesis-processing]]`, `[[./methods.md#mechanical-testing]]`, `[[./methods.md#thermal-analysis-dsc]]`.

### polymma-co-nba-copolymers
*   **Material ID:** `polymma-co-nba-copolymers` (`[[./css.md#MaterialNode]](category=Polymer, state_of_matter=Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#polymers-and-elastomers]]`
*   **Human-Readable Title:** Self-Healing p(MMA/nBA) Copolymers (via VdW Key-Lock)
*   **Description:** Copolymers of MMA/nBA exhibiting autonomous room temp self-healing via sequence-specific VdW interactions (`[urban_key-and-lock_2018]`). Context `[wool_self-healing_2008]`.
*   **Key Properties:** Autonomous `[[./phenomena.md#self-healing--self-repair]]`, Compositional sensitivity, Sequence-dependent VdW forces.
*   **Enabled Mechanisms/Phenomena:** Realizes `[[./phenomena.md#self-healing--self-repair]` via `[[./mechanisms.md#phase-conformation-memory]` (VdW contact recovery).
*   **Associated Methods:** `[[./methods.md#polymer-synthesis-processing]]`, `[[./methods.md#mechanical-testing]]`, `[[./methods.md#molecular-dynamics-md]`.

### shape-memory-polymers-smps
*   **Material ID:** `shape-memory-polymers-smps` (`[[./css.md#MaterialNode]](category=Polymer, state_of_matter=Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#polymers-and-elastomers]]`
*   **Human-Readable Title:** Shape Memory Polymers (SMPs)
*   **Description:** Polymers recovering original shape after temporary deformation upon stimulus (usually heat). Review `[terryn_review_2021]`. Usage (`[zhao_phase_2021]`, `[rus_design_2015]`, `[lee_shape_2022]`). Context (`[jiao_mechanical_2023-1]`).
*   **Key Properties:** Shape Fixity, Shape Recovery (`[[./css.md#ParameterNode]](name=shape_recovery_ratio)`), Tunable Transition Temp.
*   **Enabled Mechanisms/Phenomena:** Enables `[[./phenomena.md#shape-memory-effect]` via `[[./mechanisms.md#shape-memory]]` (form of `[[./mechanisms.md#phase-conformation-memory]]`). Enables programmed `[[./mechanisms.md#mechanical-actuation]]`.
*   **Associated Applications:** `[[./applications.md#soft-robotics]]`, `[[./applications.md#reconfigurable-systems]]`.
*   **Associated Methods:** `[[./methods.md#mechanical-testing]]`, `[[./methods.md#thermal-analysis-dsc]]`, `[[./methods.md#thermomechanical-programming]]`.

### photomechanochromic-polymers
*   **Material ID:** `photomechanochromic-polymers` (`[[./css.md#MaterialNode]](category=Polymer, state_of_matter=Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#polymers-and-elastomers]]`
*   **Human-Readable Title:** Photo/Mechanochromic Polymers (Color/Fluorescence Change)
*   **Description:** Polymers with units (mechanophores, photochromes `[hu_selfreporting_2025]`) changing optical properties upon force/light. Review `[bayat_self-indicating_2024]`.
*   **Key Properties:** Stimuli-responsive spectral change (`[[./phenomena.md#stimuli-responsive-property-switching]]`), Potential bistability.
*   **Enabled Mechanisms/Phenomena:** `[[./mechanisms.md#optical-transduction]]`, `[[./mechanisms.md#mechanical-transduction]]`, leading to `[[./mechanisms.md#optical-response]`. Molecular state = `[[./mechanisms.md#irreversible-state-change-memory]` or `[[./mechanisms.md#phase-conformation-memory]]`. Enables `[[./phenomena.md#damage-self-reporting]]`.
*   **Associated Applications:** `[[./applications.md#structural-health-monitoring]]`.
*   **Associated Methods:** `[[./methods.md#spectroscopy]]`, `[[./methods.md#mechanical-testing]]`. Control via `[[./methods.md#external-field-control]](Light)`, `[[./methods.md#mechanical-input-control]]`.

### conductive-polymers
*   **Material ID:** `conductive-polymers` (`[[./css.md#MaterialNode]](category=Polymer, state_of_matter=Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#polymers-and-elastomers]]`
*   **Human-Readable Title:** Conductive/Semiconducting Polymers (e.g., P3HT, PEDOT:PSS)
*   **Description:** Intrinsically conductive/semiconducting polymers. Examples: P3HT (`[luo_highly_2023]`), PEDOT:PSS (`[riley_neuromorphic_2022]`). Use context `[huang_increasingly_2022]`. Review `[wan_artificial_2020]`.
*   **Key Properties:** Electrical conductivity/semiconductivity, Ion conductivity (PEDOT:PSS), Electrochemical activity, Flexibility.
*   **Enabled Mechanisms/Phenomena:** Active layer in OECTs (`[[./mechanisms.md#chemical-transduction]]`, `[[./mechanisms.md#neuromorphic-computation]` `[luo_highly_2023]`). Component in flexible devices (`[[./mechanisms.md#physical-structural-memory]]`, `[[./mechanisms.md#neuromorphic-computation]` `[riley_neuromorphic_2022]`). Enable `[[./mechanisms.md#electrical-ionic-transduction]]`, `[[./mechanisms.md#electrical-response]]`.
*   **Associated Applications:** `[[./applications.md#flexible-electronics]]`, `[[./applications.md#biosensing]]`, `[[./applications.md#neuromorphic-hardware]]`.
*   **Associated Methods:** `[[./methods.md#polymer-synthesis-processing]]`, `[[./methods.md#electrical-measurements]]`.

### ion-exchange-polymer-nafion
*   **Material ID:** `ion-exchange-polymer-nafion` (`[[./css.md#MaterialNode]](category=Polymer, state_of_matter=Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#polymers-and-elastomers]]`
*   **Human-Readable Title:** Nafion (Proton/Cation Exchange Polymer)
*   **Description:** Sulfonated fluoropolymer with cation permselectivity. Used in fuel cells and active matter (`[esplandiu_radial_2022]`, `[fraxedas_collective_2024]`). Used with cells (`[holler_autoselective_2020]`).
*   **Key Properties:** High ionic conductivity, Selective cation transport, Fixed anionic groups, Robustness.
*   **Enabled Mechanisms/Phenomena:** Creates gradients for `[[./phenomena.md#autonomous-self-propulsion]` (`[[./mechanisms.md#mechanical-actuation]]`). Relies on `[[./mechanisms.md#electrical-ionic-transduction]]` / `[[./mechanisms.md#chemical-transduction]]` to drive motion via phoresis (`[[./mechanisms.md#driven-by-physical-forces-dynamics]]`) (`[esplandiu_unraveling_2018]`). Drives `[[./phenomena.md#clustering--aggregation--phase-separation]]`.
*   **Associated Methods:** `[[./methods.md#microscopy]](Tracking)`, `[[./methods.md#electrical-measurements]]`.

### misc-polymers
*   **Material ID:** `misc-polymers` (`[[./css.md#MaterialNode]](category=Polymer, state_of_matter=Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#polymers-and-elastomers]]`
*   **Human-Readable Title:** Miscellaneous Functional Polymers (e.g., PS, PMMA, Polynorbornene, PVP)
*   **Description:** Polymers used for specific roles. PS (`[madhusudanan_relaxation_2024]`), PMMA shells (`[hu_selfreporting_2024]`), Polynorbornene (`[kim_polymeric_2015]`), PVP (`[kuncic_emergent_2018]`). Context `[wegst_bioinspired_2015]`.
*   **Key Properties:** Vary: Tg (PS), fracture (PMMA), chemical reactivity, insulating matrix (PVP).
*   **Enabled Mechanisms/Phenomena:** `[[./mechanisms.md#phase-conformation-memory]` (glassy state `[madhusudanan_relaxation_2024]`). Memristive matrix (`[kuncic_emergent_2018]`). `[[./mechanisms.md#mechanical-transduction]` (rupture `[hu_selfreporting_2024]`). `[[./mechanisms.md#chemical-actuation]` (amplification `[kim_polymeric_2015]`).

### block-copolymers
*   **Material ID:** `block-copolymers` (`[[./css.md#MaterialNode]](category=Polymer, state_of_matter=Solid/Melt/Solution)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#polymers-and-elastomers]]`
*   **Human-Readable Title:** Block Copolymers (BCPs)
*   **Description:** Polymers composed of two or more distinct polymer blocks covalently linked. Undergo microphase separation (`[[./methods.md#bcp-phase-separation]]`). Used as templates (`[thedford_promise_2023]`). Foam used in `[[#btf-interface]]` (`[yang_self-amputating_2024]`). Theoretical context (`[angioletti-uberti_re-entrant_2012]`).
*   **Key Properties:** Microphase separation into nanoscale domains (spheres, cylinders, lamellae, gyroids). Properties depend on block identity, length, interaction parameter (χ).
*   **Enabled Mechanisms/Phenomena:** Key method for bottom-up nanopatterning (`[[./phenomena.md#periodic-pattern-formation]]`) via `[[./mechanisms.md#driven-by-thermodynamic-statistical-principles]]`. Template synthesis. Create specialized interfaces (`[[#btf-interface]]`).
*   **Associated Applications:** Nanopatterning, membranes, potentially data storage or controlled release.
*   **Associated Methods:** `[[./methods.md#polymer-synthesis-processing]]`, `[[./methods.md#bcp-phase-separation]]`, Annealing (`[[./methods.md#thermal-stimuli-control]]`), `[[./methods.md#x-ray-techniques]]`, `[[./methods.md#microscopy]]`.

---

## Composites

*   **Material ID:** `composites` (`[[./css.md#MaterialNode]](category=Composite)`)
*   **Human-Readable Title:** Composite Materials (Class)
*   **Description:** Combining distinct materials to achieve properties beyond individual components. Uses `[[./methods.md#composite-fabrication]]`. Context `[kaspar_rise_2021]`, `[sitti_physical_2021]`, `[jiao_mechanical_2023-1]`.

### piezoresistive-composites
*   **Material ID:** `piezoresistive-composites` (`[[./css.md#MaterialNode]](category=Composite, state_of_matter=Soft Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#composites]]`; Often `[[./css.md#ComposedOfMaterialEdge]]` → `[[#conductive-filler-composites]]`, `[[#elastomers-general]]`
*   **Human-Readable Title:** Piezoresistive Polymer Composites (Strain Sensing)
*   **Description:** Resistance changes significantly under strain. Examples: CNT/PDMS (`[thuruthel_soft_2019]`); Carbon/PLA (`[li_training_2024]`). Review `[wan_artificial_2020]`.
*   **Key Properties:** High Gauge Factor (`[[./css.md#ParameterNode]](name=gauge_factor)`), Flexibility.
*   **Enabled Mechanisms/Phenomena:** Enables `[[./mechanisms.md#mechanical-transduction]` for proprioception (`[thuruthel_soft_2019]`). Input for neuromorphic `[[./mechanisms.md#neuromorphic-computation]` (`[riley_neuromorphic_2022]`, `[luo_machine-learning-assisted_2022]`).
*   **Associated Methods:** `[[./methods.md#electrical-measurements]]`, `[[./methods.md#mechanical-testing]]`.

### magneto-elastic-composites
*   **Material ID:** `magneto-elastic-composites` (`[[./css.md#MaterialNode]](category=Composite, state_of_matter=Soft Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#composites]]`; `[[./css.md#ComposedOfMaterialEdge]]` → `[[#ferromagnetic-materials]]`, `[[#elastomers-general]]`
*   **Human-Readable Title:** Magneto-Elastic Composites (Magnetic Actuation/Shape Change)
*   **Description:** Magnetic particles (NdFeB `[hu_small-scale_2018]`, `[xia_dynamic_2022]`) in deformable matrix. Reviews (`[palagi_bioinspired_2018]`, `[jiao_mechanical_2023-1]`).
*   **Key Properties:** Magnetic response, Large deformation, Programmed magnetization.
*   **Enabled Mechanisms/Phenomena:** Remote `[[./mechanisms.md#mechanical-actuation]` via `[[./mechanisms.md#magnetic-transduction]]` (`[hu_small-scale_2018]`). Encodes magnetic `[[./mechanisms.md#shape-memory]` (`[xia_dynamic_2022]`).
*   **Associated Applications:** `[[./applications.md#soft-robotics]]`.

### conductive-filler-composites
*   **Material ID:** `conductive-filler-composites` (`[[./css.md#MaterialNode]](category=Composite, state_of_matter=Solid/Soft Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#composites]]`; `[[./css.md#ComposedOfMaterialEdge]]` → filler (`[[#other-nanoparticles]]` (CB), `[[#nanowires]]` (AgNW)) + matrix (`[[#misc-polymers]]`, `[[#elastomers-general]]`).
*   **Human-Readable Title:** Conductive Filler Composites (General Purpose)
*   **Description:** Embedding conductive nanoparticles for diverse functions. CB/TPU (`[xiao_artificial_2020]`), AgNW/PVP (`[kuncic_emergent_2018]`).
*   **Key Properties:** Tunable conductivity, Percolation, Filler-specific responses (Photothermal CB, Memristive Ag).
*   **Enabled Mechanisms/Phenomena:** Photothermal memory (`[[./mechanisms.md#phase-conformation-memory]]`) (`[xiao_artificial_2020]`). Neuromorphic networks (`[[./mechanisms.md#neuromorphic-computation]]`, `[[./mechanisms.md#resistance-switching-memristance]]`) (`[kuncic_emergent_2018]`). Exhibits `[[./phenomena.md#criticality--phase-transitions]]` (`[kuncic_emergent_2018]`).

### microcapsule-composites
*   **Material ID:** `microcapsule-composites` (`[[./css.md#MaterialNode]](category=Composite, state_of_matter=Solid/Soft Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#composites]]`; `[[./css.md#ComposedOfMaterialEdge]]` → microcapsules + matrix.
*   **Human-Readable Title:** Microcapsule Composites (Damage/Stimulus Responsive)
*   **Description:** Microcapsules release cargo upon rupture. Shell e.g., `[[#misc-polymers]]`(PMMA) `[hu_selfreporting_2024]`. Cargo: dyes, reactants (`[wool_self-healing_2008]`). Concept `[calvino_microcapsule-containing_2018]`. Use `[huang_self-regulation_2018]`. Structure `[hu_multi-compartment_2022]`.
*   **Key Properties:** Stimulus-triggered release, Threshold response.
*   **Enabled Mechanisms/Phenomena:** `[[./mechanisms.md#mechanical-transduction]]` triggers `[[./mechanisms.md#optical-response]]` (`[[./phenomena.md#damage-self-reporting]]`) or `[[./mechanisms.md#chemical-actuation]]` (`[[./phenomena.md#self-healing--self-repair]]`). Stores `[[./mechanisms.md#irreversible-state-change-memory]]`. Simple `[[./mechanisms.md#physical-embodied-computation]]` (thresholding).
*   **Associated Applications:** `[[./applications.md#structural-health-monitoring]]`.
*   **Associated Methods:** `[[./methods.md#microfluidics]]` (fab), `[[./methods.md#capillarity-assisted-particle-assembly]]` (assembly).

### phase-change-composites
*   **Material ID:** `phase-change-composites` (`[[./css.md#MaterialNode]](category=Composite, state_of_matter=Solid/Gel)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#composites]]`; `[[./css.md#ComposedOfMaterialEdge]]` → PCM + matrix (`[[#hydrogels-general]]` `[zhao_phase_2021]`).
*   **Human-Readable Title:** Phase Change Material (PCM) Composites
*   **Description:** Embedding Phase Change Materials (PCMs) in a matrix. Review `[kaspar_rise_2021]`. Context `[sitti_physical_2021]`.
*   **Key Properties:** Temp-triggered `[[./phenomena.md#phase-transitions]]`, Latent heat effects, Associated property changes.
*   **Enabled Mechanisms/Phenomena:** Stiffness change `[[./phenomena.md#stimuli-responsive-property-switching]]`. Enables `[[./mechanisms.md#mechanical-actuation]]`. Encodes `[[./mechanisms.md#phase-conformation-memory]]`. Potential `[[./mechanisms.md#physical-embodied-computation]]`.
*   **Associated Methods:** `[[./methods.md#composite-fabrication]]`, `[[./methods.md#mechanical-testing]]`, `[[./methods.md#thermal-analysis-dsc]]`.

### btf-interface
*   **Material ID:** `btf-interface` (`[[./css.md#MaterialNode]](category=Composite, state_of_matter=Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#composites]]`; `[[./css.md#ComposedOfMaterialEdge]]` → `[[#block-copolymers]]` foam + `[[#elastomers-general]]` silicone.
*   **Human-Readable Title:** Bicontinuous Thermoplastic Foam (BTF) Interface (Reversible Joint)
*   **Description:** Thermally switchable adhesive joint using infiltrated BCP foam (`[yang_self-amputating_2024]`).
*   **Key Properties:** Thermally reversible adhesion.
*   **Enabled Mechanisms/Phenomena:** Controlled `[[./mechanisms.md#mechanical-actuation]]` (assembly/disassembly). Uses `[[./mechanisms.md#phase-conformation-memory]]`. Enables `[[./phenomena.md#self-amputation]]`, `[[./phenomena.md#interfusion]]`. Trigger: `[[./mechanisms.md#thermal-transduction]]`.
*   **Associated Applications:** `[[./applications.md#reconfigurable-systems]]`.

### lce-metamaterial-composites
*   **Material ID:** `lce-metamaterial-composites` (`[[./css.md#MaterialNode]](category=Composite, state_of_matter=Soft Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#composites]]`, `[[#liquid-crystal-elastomers-lces]]`, `[[#mechanical-metamaterials]]`
*   **Human-Readable Title:** Liquid Crystal Elastomer (LCE) Metamaterials (Programmable Actuation)
*   **Description:** Microstructured LCE segments in elastomer matrix for programmed shape morphing (`[li_computational_2024]`). Reviews `[palagi_bioinspired_2018]`, `[jiao_mechanical_2023-1]`.
*   **Key Properties:** Large, programmable, anisotropic actuation via LC transition.
*   **Enabled Mechanisms/Phenomena:** Implements `[[./mechanisms.md#physical-embodied-computation]]` mapping stimulus (`[[./mechanisms.md#thermal-transduction]]`, `[[./mechanisms.md#optical-transduction]]`) to complex `[[./mechanisms.md#mechanical-actuation]]`. Basis for `[[./phenomena.md#bio-inspired-actuation]]`.
*   **Associated Applications:** `[[./applications.md#soft-robotics]]`.
*   **Associated Methods:** `[[./methods.md#topology-optimization]]`, `[[./methods.md#continuum-modeling]]`.
*   **Relevant Concepts:** `[[./theoretical.md#liquid-crystal-theory]]`, `[[./theoretical.md#continuum-mechanics]]`.

### mechanical-metamaterials
*   **Material ID:** `mechanical-metamaterials` (`[[./css.md#MaterialNode]](category=Composite/StructuredMaterial, state_of_matter=Solid/Soft Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#composites]]` (often)
*   **Human-Readable Title:** Mechanical Metamaterials (Architected Structure → Property)
*   **Description:** Properties from designed micro/macro-structure. Reviews (`[jiao_mechanical_2023]`, `[jiao_mechanical_2023-1]`). Models `[mengaldo_concise_2022]`. Integration `[kaspar_rise_2021]`. Examples (`[liao_tunable_2018]`, `[bordiga_automated_2024]`, `[yan_soft_2020]`, `[riley_neuromorphic_2022]`, `[jiao_mechanical_2023]`, `[lee_mechanical_2022]`, `[louvet_reprogrammable_2024]`). Bioinspiration `[wegst_bioinspired_2015]`.
*   **Key Properties:** Defined by structure: `[[./phenomena.md#unusual-mechanical-properties]]`, nonlinearity `[liao_tunable_2018]`, Energy Absorption `[jiao_mechanical_2023]`.
*   **Enabled Mechanisms/Phenomena:** Structure (`[[./css.md#SystemNode]](morphology_descriptor)`) encodes `[[./mechanisms.md#physical-embodied-computation]]` (Logic `[jiao_mechanical_2023]`, NNs `[lee_mechanical_2022]`, `[stern_training_2024]`, MVM `[louvet_reprogrammable_2024]`). Implements `[[./mechanisms.md#phase-conformation-memory]]` (bistability `[riley_neuromorphic_2022]`). Unique `[[./mechanisms.md#mechanical-actuation]]`. Exploits `[[./mechanisms.md#driven-by-physical-forces-dynamics]]` (instabilities `[liao_tunable_2018]`).
*   **Associated Methods:** Design (`[[./methods.md#topology-optimization]]`, `[[./methods.md#ai-driven-design]]`). Fab (`[[./methods.md#3d-printing-additive-manufacturing]]`). Char (`[[./methods.md#mechanical-testing]]`, `[[./methods.md#finite-element-method-femfea]]`).

---

## Biological and Bio-inspired Materials

*   **Material ID:** `biological-and-bio-inspired-materials` (`[[./css.md#MaterialNode]](category=Biological)`)
*   **Human-Readable Title:** Biological and Bio-inspired Materials (Class)

### living-cells-and-tissues
*   **Material ID:** `living-cells-and-tissues` (`[[./css.md#MaterialNode]](category=Biological, state_of_matter=Soft Solid/Liquid Culture)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#biological-and-bio-inspired-materials]]`
*   **Human-Readable Title:** Living Biological Cells and Tissues
*   **Description:** Building blocks used as model systems or active components. Examples: E. coli `[wadhams_making_2004]`, Slime molds `[boussard_memory_2019]`, Stem cells `[kriegman_scalable_2020]`, Human cells (`[gumuskaya_motile_2024]`), Organisms (Hydra `[maroudas-sacks_topological_2021]`), Brain/Neurons (`[obyrne_how_2022]`). Concept `[[./theoretical.md#basal-minimal-cognition-conceptual]]`. Collective intelligence `[[./theoretical.md#collective-intelligence-conceptual]]`. Context (`[wegst_bioinspired_2015]`).
*   **Key Properties:** Self-replication, Metabolism (`[[./mechanisms.md#energy-flow-dissipation]]`), Sensing, Signaling, Computation, Motility, Self-organization (`[[./phenomena.md#morphogenesis--regeneration--homeostasis]]`), Adaptation (`[[./mechanisms.md#biological-plasticity-mechanisms]`).
*   **Enabled Mechanisms/Phenomena:** Exhibit most `[[./mechanisms.md]]` and `[[./phenomena.md]]`. Core to `[[./mechanisms.md#driven-by-biological-processes]]`. Physical limits `[yang_physical_2021]`. Reflexivity `[wills_reflexivity_2019]`.
*   **Associated Methods:** Culture/Construct (`[[./methods.md#biological-construction]]`). Study (`[[./methods.md#microscopy]]`, `[[./methods.md#biological-manipulation]]`). Models (`[[./methods.md#modeling-cell--tissue]]`).

### self-assembling-peptides
*   **Material ID:** `self-assembling-peptides` (`[[./css.md#MaterialNode]](category=Biological, state_of_matter=Variable)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#biological-and-bio-inspired-materials]]`
*   **Human-Readable Title:** Self-Assembling Peptides (Designer Nanostructures)
*   **Description:** Synthetic polypeptides forming specific nanostructures. αHB array (`[dawson_differential_2023]`); pH-responsive conjugate (`[he_peptide-induced_2018]`).
*   **Key Properties:** Programmable assembly, Biocompatibility, Controlled functionality.
*   **Enabled Mechanisms/Phenomena:** Form `[[./phenomena.md#discrete-nanostructure-formation]` via `[[./mechanisms.md#equilibrium-self-assembly]]`. Enable `[[./mechanisms.md#chemical-transduction]` (`[dawson_differential_2023]`), `[[./mechanisms.md#chemical-actuation]` (`[he_peptide-induced_2018]`).
*   **Associated Applications:** `[[./applications.md#biosensing]]`, `[[./applications.md#drug-delivery]]`.
*   **Associated Methods:** Synthesis, `[[./methods.md#microscopy]]`, `[[./methods.md#spectroscopy]]`, `[[./methods.md#molecular-dynamics-md]`.

### dna
*   **Material ID:** `dna` (`[[./css.md#MaterialNode]](category=Biological, state_of_matter=Polymer in solution)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#biological-and-bio-inspired-materials]]`
*   **Human-Readable Title:** DNA (as Nanomaterial and Information Carrier)
*   **Description:** Used programmatically via complementarity. Examples: Walkers (`[sherman_precisely_2004]`), Origami (`[rothemund_folding_2006]`), Assembly director (`[mcmullen_self-assembly_2022]`), Computation (`[kim_nanoparticle-based_2020]`), Sensors (`[zhang_nanopore_2022]`). Context (`[wills_reflexivity_2019]`).
*   **Key Properties:** Sequence programmability, High info density, Thermal reversibility, Rigidity.
*   **Enabled Mechanisms/Phenomena:** Enables `[[./methods.md#dna-directed-assembly]` (via `[[./mechanisms.md#driven-by-algorithmic-computational-rules]]`, `[[./mechanisms.md#equilibrium-self-assembly]]`). Forms `[[./phenomena.md#discrete-nanostructure-formation]]`. `[[./mechanisms.md#mechanical-actuation]` (`[sherman_precisely_2004]`). `[[./mechanisms.md#physical-embodied-computation]` (`[kim_nanoparticle-based_2020]`). `[[./mechanisms.md#phase-conformation-memory]` (hybridized state). `[[./mechanisms.md#electrical-response]` (`[zhang_nanopore_2022]`).
*   **Associated Applications:** `[[./applications.md#nanotechnology]]`.
*   **Associated Methods:** `[[./methods.md#dna-synthesis-functionalization]]`, `[[./methods.md#thermal-stimuli-control]]`, `[[./methods.md#microscopy]]`, `[[./methods.md#gel-electrophoresis]]`.
*   **Relevant Concepts:** `[[./theoretical.md#assembly-theory-at]]`.

### lipid-bilayers
*   **Material ID:** `lipid-bilayers` (`[[./css.md#MaterialNode]](category=Biological, state_of_matter=Liquid Crystal)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#biological-and-bio-inspired-materials]]`
*   **Human-Readable Title:** Lipid Bilayers (Vesicles, Membranes)
*   **Description:** Self-assembled amphipathic lipid structures. E.g., GUVs. Usage: Hierarchy (`[hadorn_hierarchical_2012]`), templates (`[hadorn_specific_2012]`). Bio component (`[wadhams_making_2004]`).
*   **Key Properties:** Compartmentalization, Selective permeability, Fluidity, Functionalization surface, Biomimicry.
*   **Enabled Mechanisms/Phenomena:** Basis for `[[#living-cells-and-tissues]]`. Scaffold for `[[./mechanisms.md#equilibrium-self-assembly]` (`[hadorn_hierarchical_2012]`). Platform for `[[./methods.md#dna-directed-assembly]]`. Creates `[[./phenomena.md#biomimetic-compartments]]`.
*   **Associated Applications:** `[[./applications.md#artificial-cells--protocells]]`.
*   **Associated Methods:** `[[./methods.md#microfluidics]]`. Study `[[./methods.md#microscopy]]`.
*   **Relevant Concepts:** `[[./theoretical.md#statistical-mechanics--stochastic-thermodynamics]]`.

### molecular-force-fields
*   **Material ID:** `molecular-force-fields` (`[[./css.md#MaterialNode]](category=ComputationalModel, state_of_matter=NA)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#biological-and-bio-inspired-materials]]` (often models bio, but general)
*   **Human-Readable Title:** Molecular Force Fields (Simulation Constructs)
*   **Description:** Parameterized potential energy functions for particle simulation (`[[./methods.md#particle-based-modeling]]`). AMBER (`[foumthuim_solvent_2024]`), DPD (`[mcmullen_self-assembly_2022]`), LJ (`[negi_emergent_2022]`), Contact (`[varela-rosales_granular_2023]`). Reactive (`[zhang_active_2024]`).
*   **Key Properties:** Computational representation of inter-particle forces. Aims to reproduce material properties.
*   **Enabled Mechanisms/Phenomena:** *Simulates* `[[./mechanisms.md#equilibrium-self-assembly]]`, folding, healing (`[urban_key-and-lock_2018]`), active matter, mechanics. Used for `[[./methods.md#inverse-design]` (`[kriegman_scalable_2020]`). Enables *study* of `[[./mechanisms.md]]`, `[[./phenomena.md]]`.
*   **Associated Methods:** `[[./methods.md#molecular-dynamics-md]]`, `[[./methods.md#dissipative-particle-dynamics-dpd]]`, `[[./methods.md#monte-carlo-mc]]`.
*   **Relevant Concepts:** `[[./theoretical.md#statistical-mechanics--stochastic-thermodynamics]]`.

### microtubules
*   **Material ID:** `microtubules` (`[[./css.md#MaterialNode]](category=Biological, state_of_matter=Filament)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#biological-and-bio-inspired-materials]]`
*   **Human-Readable Title:** Microtubules (Cytoskeletal Filaments)
*   **Description:** Protein filaments (tubulin polymers) forming part of the cytoskeleton. Possess unique structural and potential quantum properties (`[babcock_ultraviolet_2024]`). Important in cellular mechanics and transport (`[wegst_bioinspired_2015]` context).
*   **Key Properties:** Structural rigidity, Dynamic instability, Serve as tracks for motor proteins, Potential for quantum coherence.
*   **Enabled Mechanisms/Phenomena:** May support collective `[[./mechanisms.md#optical-response]]` (superradiance `[babcock_ultraviolet_2024]`, `[[./phenomena.md#quantum-coherent-effects]]`). Part of cellular structure/transport mechanisms `[[./mechanisms.md#driven-by-biological-processes]]`.
*   **Associated Methods:** Purification, `[[./methods.md#microscopy]]`, `[[./methods.md#spectroscopy]]`.
*   **Relevant Concepts:** `[[./theoretical.md#quantum-mechanics]]` (hypothesized role).

---

## Inorganic and Semiconductor Materials

*   **Material ID:** `inorganic-and-semiconductor-materials` (`[[./css.md#MaterialNode]](category=Inorganic)`)
*   **Human-Readable Title:** Inorganic and Semiconductor Materials (Class)

### silicon-si-and-porous-silicon-psi
*   **Material ID:** `silicon-si-and-porous-silicon-psi` (`[[./css.md#MaterialNode]](category=Inorganic, state_of_matter=Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#inorganic-and-semiconductor-materials]]`
*   **Human-Readable Title:** Silicon (Si) and Porous Silicon (pSi) (Semiconductor Backbone)
*   **Description:** Elemental silicon and its porous form. Basis for electronics, MEMS/NEMS, neuromorphics. Substrate (`[de_nicola_graphene_2020]`). MEMS (`[tzanov_multi-frequency_2020]`). Devices (`[yao_fully_2020]`, `[lee_nanograin_2023]`). Context (`[mead_neuromorphic_1990]`).
*   **Key Properties:** Semiconductor, Mature Fab, Piezoresistivity. pSi: High surface area, tunable porosity/index, quantum confinement, charge trapping (`[lee_nanograin_2023]`).
*   **Enabled Mechanisms/Phenomena:** Enables `[[./mechanisms.md#electrical-ionic-transduction]]`. pSi enables `[[./mechanisms.md#phase-conformation-memory]]`, `[[./mechanisms.md#optical-response]]` modulation for `[[./mechanisms.md#neuromorphic-computation]]` (`[lee_nanograin_2023]`). NEMS structure `[[./mechanisms.md#mechanical-transduction]]`. `[[./mechanisms.md#optical-transduction]]`.
*   **Associated Methods:** `[[./methods.md#micro-nano-fabrication]]`, `[[./methods.md#etching]]`, `[[./methods.md#electrical-measurements]]`.

### oxides
*   **Material ID:** `oxides` (`[[./css.md#MaterialNode]](category=Inorganic, state_of_matter=Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#inorganic-and-semiconductor-materials]]`
*   **Human-Readable Title:** Oxides (Functional Insulators, Conductors, Memristors)
*   **Description:** Insulators (SiO₂ `[de_nicola_graphene_2020]`), Conductors (ITO `[riley_neuromorphic_2022]`), Memristors (HfOₓ, TaOₓ `[yao_fully_2020]`). Nanoparticles (Silica `[hu_selfreporting_2024]`; Iron Oxides `[[#fe3o4-nanoparticles]]`). Context (`[jiao_mechanical_2023-1]`).
*   **Key Properties:** Insulating/Conducting/Semiconducting, Transparent, Dielectric, Memristive (`[[./mechanisms.md#resistance-switching-memristance]]`), Surface chem.
*   **Enabled Mechanisms/Phenomena:** `[[./mechanisms.md#resistance-switching-memristance]` (`[yao_fully_2020]`). `[[./mechanisms.md#electrical-ionic-transduction]` (dielectrics). Transparent electrodes. Influence dynamics (`[fraxedas_collective_2024]`). Reporting/Sensing (`[hu_selfreporting_2024]`). Scaffolds (`[kamsma_brain-inspired_2024]`). Membranes (`[malevich_very-large-scale_2025]`).
*   **Associated Methods:** `[[./methods.md#thin-film-deposition]]`, `[[./methods.md#micro-nano-fabrication]]`, `[[./methods.md#electrical-measurements]]`, `[[./methods.md#microscopy]]`.

### metals
*   **Material ID:** `metals` (`[[./css.md#MaterialNode]](category=Inorganic, state_of_matter=Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#inorganic-and-semiconductor-materials]]`
*   **Human-Readable Title:** Metals (Conductors, Catalysts, Plasmonics, Magnetic)
*   **Description:** Conductive elements/alloys. Pt/Au catalyst (`[ebbens_active_2016]`), Au electrodes/plasmonics (`[de_nicola_graphene_2020]`), TiN (`[yao_fully_2020]`), Ni/Co magnets (`[yao_nematic_2022]`), Ag (`[kuncic_emergent_2018]`), Cu (`[yang_self-amputating_2024]`), Steel (`[varela-rosales_granular_2023]`). Context `[jiao_mechanical_2023-1]`.
*   **Key Properties:** Conductivity, Catalysis (Pt), Plasmonics (Au, Ag), Magnetism (Fe, Ni, Co), Stability (Au, Pt).
*   **Enabled Mechanisms/Phenomena:** Electrodes (`[[./mechanisms.md#electrical-ionic-transduction]]`). Catalysis drives `[[./mechanisms.md#mechanical-actuation]` (`[khalil_precise_2015]`), patterns (`[yang_emergent_2022]`). Plasmonics (`[[#plasmonics-metamaterials]]`) enhances `[[./mechanisms.md#optical-transduction]` (`[de_nicola_graphene_2020]`). Resistive switching (`[[./mechanisms.md#resistance-switching-memristance]]` `[kuncic_emergent_2018]`). Magnetic mechanisms (`[[./mechanisms.md#mechanical-actuation]]`, `[[./mechanisms.md#magnetic-transduction]]`). Joule heating (`[[./mechanisms.md#energy-flow-dissipation]]`) (`[yang_self-amputating_2024]`).
*   **Associated Methods:** `[[./methods.md#thin-film-deposition]]`, `[[./methods.md#micro-nano-fabrication]]`, `[[./methods.md#electrical-measurements]]`.

### ferromagnetic-materials
*   **Material ID:** `ferromagnetic-materials` (`[[./css.md#MaterialNode]](category=Inorganic, state_of_matter=Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#metals]]`
*   **Human-Readable Title:** Ferromagnetic Materials (Hard/Soft Magnets)
*   **Description:** Metals/alloys with spontaneous magnetization. NdFeB (`[hu_small-scale_2018]`, `[xia_dynamic_2022]`), Co (`[khalil_precise_2015]`, `[ceron_programmable_2023]`), Fe. Context (`[jiao_mechanical_2023-1]`). Model (`[stamps_active_2024]`). Use (`[yao_nematic_2022]`).
*   **Key Properties:** High susceptibility/permeability, Potential permanent magnetism (Hard) or reversible (Soft), Magnetic domains.
*   **Enabled Mechanisms/Phenomena:** `[[./mechanisms.md#mechanical-actuation]` (`[hu_small-scale_2018]`). `[[./mechanisms.md#driven-by-physical-forces-dynamics]` (`[ceron_programmable_2023]`). Magnetic `[[./mechanisms.md#shape-memory]` (`[xia_dynamic_2022]`). `[[./mechanisms.md#magnetic-transduction]]`.
*   **Associated Applications:** `[[./applications.md#microrobotics]]`.
*   **Associated Methods:** Control `[[./methods.md#external-field-control]](Magnetic)`. Theory `[[./theoretical.md#magnetic-field-theory]]`.

### fe3o4-nanoparticles
*   **Material ID:** `fe3o4-nanoparticles` (`[[./css.md#MaterialNode]](category=Inorganic, state_of_matter=Solid (colloid))`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#oxides]]`
*   **Human-Readable Title:** Iron Oxide Nanoparticles (Fe₃O₄, Superparamagnetic)
*   **Description:** Superparamagnetic magnetite/maghemite NPs. Core of `[[#ferrofluids]]` (`[crepaldi_evidence_2022]`). Use: assembly (`[hu_shaping_2019]`), ASI model (`[stamps_active_2024]`). Component (`[kaspar_rise_2021]`). Properties (`[lu_bioinspired_2018]`).
*   **Key Properties:** Superparamagnetism, High magnetization, Field responsive, Biocompatible.
*   **Enabled Mechanisms/Phenomena:** Control `[[#ferrofluids]]` (`[crepaldi_experimental_2023]`). `[[./mechanisms.md#driven-by-physical-forces-dynamics]]` for assembly (`[hu_shaping_2019]`). Underpin `[[./mechanisms.md#reservoir-computing]]`, `[[./mechanisms.md#phase-conformation-memory]]` in ferrofluids (`[crepaldi_evidence_2022]`). Enable magnetic `[[./mechanisms.md#mechanical-actuation]]`. Model FEP `[stamps_active_2024]`.
*   **Associated Methods:** `[[./methods.md#colloidal-synthesis-assembly]]`, `[[./methods.md#external-field-control]](Magnetic)`.

### graphene--2d-materials
*   **Material ID:** `graphene--2d-materials` (`[[./css.md#MaterialNode]](category=Inorganic, state_of_matter=Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#inorganic-and-semiconductor-materials]]`
*   **Human-Readable Title:** Graphene and Other 2D Materials
*   **Description:** Atomic layers (Graphene, MoS₂). Review `[liu_van_2016]`. Use: Photodetector (`[de_nicola_graphene_2020]`), THz modulator (`[malevich_very-large-scale_2025]`), OECT gate (`[luo_highly_2023]`), Nanofluidics (`[robin_long-term_2023]`).
*   **Key Properties:** Atomically thin, Excellent electrical/thermal props, High strength/flexibility, Tunable props (`[liu_van_2016]`), Strong light interaction.
*   **Enabled Mechanisms/Phenomena:** Active layer `[[./mechanisms.md#optical-transduction]` (`[de_nicola_graphene_2020]`), `[[./mechanisms.md#chemical-transduction]` (`[luo_highly_2023]`), `[[./mechanisms.md#electrical-ionic-transduction]]`. Tunable `[[./mechanisms.md#electrical-response]` (`[malevich_very-large-scale_2025]`). `[[./phenomena.md#enhanced-physical-properties]]`. Component in `[[#iontronic-devices]]`.
*   **Associated Methods:** Growth (`[[./methods.md#thin-film-deposition]](CVD)`), Fabrication (`[[./methods.md#micro-nano-fabrication]]`). Characterization (Raman `[[./methods.md#spectroscopy]]`, `[[./methods.md#microscopy]]`, `[[./methods.md#electrical-measurements]]`).

### nanowires
*   **Material ID:** `nanowires` (`[[./css.md#MaterialNode]](category=Inorganic, state_of_matter=Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#inorganic-and-semiconductor-materials]]`
*   **Human-Readable Title:** Nanowires (e.g., AgNW, SiNW) and Networks
*   **Description:** Quasi-1D structures. Silver (AgNW `[kuncic_emergent_2018]`), Silicon (SiNW `[lee_nanograin_2023]`). Often random networks.
*   **Key Properties:** High aspect ratio, Tunable electronics, Large surface area, Emergent network props (`[[./theoretical.md#network-theory]]`), Memristive junctions (`[kuncic_emergent_2018]`), Charge trapping (`[lee_nanograin_2023]`).
*   **Enabled Mechanisms/Phenomena:** Substrate `[[./mechanisms.md#neuromorphic-computation]` (`[kuncic_emergent_2018]`), `[[./mechanisms.md#reservoir-computing]` (`[loeffler_neuromorphic_2023]` refs). `[[./mechanisms.md#resistance-switching-memristance]]`. `[[./mechanisms.md#phase-conformation-memory]]`. Criticality (`[[./phenomena.md#criticality--phase-transitions]]`, `[kuncic_emergent_2018]`). `[[./phenomena.md#synaptic-plasticity-emulation]]`, `[[./phenomena.md#habituation--sensory-adaptation]]`.
*   **Associated Methods:** Synthesis, Deposition (`[[./methods.md#drop-casting]]`), Fabrication (`[[./methods.md#micro-nano-fabrication]]`). Characterization (`[[./methods.md#electrical-measurements]]`, `[[./methods.md#microscopy]]`). Modeling (`[[./methods.md#network-modeling]]`).

### other-nanoparticles
*   **Material ID:** `other-nanoparticles` (`[[./css.md#MaterialNode]](category=Varies (Inorganic/Polymer), state_of_matter=Solid (colloid))`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#inorganic-and-semiconductor-materials]]` or `[[#polymers-and-elastomers]]`
*   **Human-Readable Title:** Miscellaneous Nanoparticles (Functional Fillers/Tracers/Units)
*   **Description:** 0D particles. Carbon Black (CB `[xiao_artificial_2020]`), Ag (`[kim_nanoparticle-based_2020]`), TiO₂/PS (`[hu_shaping_2019]`), PS beads (`[fraxedas_collective_2024]`, `[varela-rosales_granular_2023]`), Silica (`[hu_selfreporting_2024]`), Au linker (`[ke_three-dimensional_2012]`, `[lee_shape_2022]`). Janus (`[nsamela_colloidal_2023]`).
*   **Key Properties:** Surface area, Quantum effects, Optical, Electrical, Magnetic, Catalytic, Functionalizable (`[[#dna]]`).
*   **Enabled Mechanisms/Phenomena:** Photothermal memory (`[xiao_artificial_2020]`). DNA logic (`[[./mechanisms.md#physical-embodied-computation]]` `[kim_nanoparticle-based_2020]`). Core `[[./phenomena.md#autonomous-self-propulsion]]`. Tracers (`[[./methods.md#particle-cell-tracking-analysis]]`). Assembly blocks (`[[./mechanisms.md#equilibrium-self-assembly]]` `[mcmullen_self-assembly_2022]`). Granular `[[./phenomena.md#collective-motion--phase-behavior]]`. QM material synth `[thedford_promise_2023]`. Trigger release (`[hu_selfreporting_2024]`).
*   **Associated Methods:** `[[./methods.md#colloidal-synthesis-assembly]]`. Characterization (`[[./methods.md#microscopy]]`, `[[./methods.md#dynamic-light-scattering]]`). Assembly (`[[./methods.md#evaporation-driven-assembly]]`, `[[./methods.md#dna-directed-assembly]]`).

### catalytic-particles
*   **Material ID:** `catalytic-particles` (`[[./css.md#MaterialNode]](category=Composite, state_of_matter=Solid (colloid))`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#other-nanoparticles]]` (often); Can be composed of `[[#metals]]` (Pt) and a base `[[#oxides]]`(SiO2) or `[[#other-nanoparticles]]`(PS).
*   **Human-Readable Title:** Catalytic Particles (e.g., Janus particles)
*   **Description:** Micro/nano particles functionalized with catalytic material (e.g., Platinum) often asymmetrically (Janus) to drive self-propulsion via decomposition of fuel (e.g., H2O2). (`[ebbens_active_2016]`, `[boniface_self-propulsion_2019]`, `[khalil_precise_2015]`, `[fraxedas_collective_2024]`). pH responsive `[archer_ph-responsive_2020]`. Collective behavior review `[nsamela_colloidal_2023]`.
*   **Key Properties:** Catalytic activity, Self-propulsion capability, Potential for stimuli-responsiveness.
*   **Enabled Mechanisms/Phenomena:** Primary driver for chemically-powered `[[./phenomena.md#autonomous-self-propulsion]]`. Interaction driven by `[[./mechanisms.md#driven-by-physical-forces-dynamics]]`. Exhibits `[[./phenomena.md#collective-motion--phase-behavior]]`. Used in `[[./applications.md#targeted-delivery]]`.
*   **Associated Methods:** Synthesis, Tracking (`[[./methods.md#particle-cell-tracking-analysis]]`). Modeling (`[[./methods.md#particle-based-modeling]]`).

### quantum-dots
*   **Material ID:** `quantum-dots` (`[[./css.md#MaterialNode]](category=Inorganic, state_of_matter=Solid (colloid))`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#inorganic-and-semiconductor-materials]]`
*   **Human-Readable Title:** Quantum Dots (Semiconductor Nanocrystals)
*   **Description:** Semiconductor nanoparticles exhibiting quantum mechanical properties due to size confinement. Used in composites (`[hu_modular_2023]`) and as building blocks (`[thedford_promise_2023]`).
*   **Key Properties:** Size-tunable optical/electronic properties, High photoluminescence quantum yield, Quantum confinement effects.
*   **Enabled Mechanisms/Phenomena:** Act as quantum emitters (`[[./mechanisms.md#optical-response]]`), components in light harvesting/detection (`[[./mechanisms.md#optical-transduction]]`). Building blocks for `[[./mechanisms.md#equilibrium-self-assembly]]`. Used in `[[#quantum-systems]]`.
*   **Associated Methods:** `[[./methods.md#colloidal-synthesis-assembly]]`, `[[./methods.md#spectroscopy]]`, `[[./methods.md#microscopy]]`.

---

## Liquid Crystals (LCs)

*   **Material ID:** `liquid-crystals-lcs` (`[[./css.md#MaterialNode]](category=LC, state_of_matter=Mesophase)`)
*   **Human-Readable Title:** Liquid Crystals (LCs - Class)
*   **Description:** Mesophases with long-range orientational order. Theory `[[./theoretical.md#liquid-crystal-theory]]`. Review `[wang_liquid_2022]`.

### nematic-lcs
*   **Material ID:** `nematic-lcs` (`[[./css.md#MaterialNode]](category=LC, state_of_matter=Mesophase)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#liquid-crystals-lcs]]`
*   **Human-Readable Title:** Nematic Liquid Crystals (NLCs)
*   **Description:** LC phase with orientational order only. 5CB (`[kos_nematic_2022]`). CCN47 (`[sasaki_large-scale_2016]`). Active (`[maroudas-sacks_topological_2021]`). Computing context (`[zhang_computing_2021]`). Use (`[wang_liquid_2022]`).
*   **Key Properties:** Birefringence, Anisotropy, Field/surface response, Topological defects.
*   **Enabled Mechanisms/Phenomena:** Sensing `[[./mechanisms.md#chemical-transduction]]` -> `[[./mechanisms.md#optical-response]]`. Computation `[[./mechanisms.md#physical-embodied-computation]]`, Memory `[[./mechanisms.md#topological-defect-memory]]` (`[kos_nematic_2022]`). Patterning `[[./phenomena.md#defect-pattern-formation]]`. Actuation `[[./mechanisms.md#mechanical-actuation]` (`[yao_nematic_2022]`).
*   **Associated Methods:** `[[./methods.md#microscopy]]`(POM), `[[./methods.md#continuum-modeling]]`.

### chiral-nematic-lcs
*   **Material ID:** `chiral-nematic-lcs` (`[[./css.md#MaterialNode]](category=LC, state_of_matter=Mesophase)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#nematic-lcs]]`
*   **Human-Readable Title:** Chiral Nematic LCs (Cholesterics)
*   **Description:** Nematics with chiral dopants inducing twist. MLC2037+zli811 (`[adamatzky_computing_2011]`), E7+CB15 (`[aya_reconfigurable_2020]`).
*   **Key Properties:** Selective reflection, Sensitive pitch, Unique defects.
*   **Enabled Mechanisms/Phenomena:** Computation `[[./mechanisms.md#physical-embodied-computation]` (`[adamatzky_computing_2011]`). `[[./phenomena.md#defect-pattern-formation]` (`[aya_reconfigurable_2020]`). Tunable `[[./mechanisms.md#optical-response]]`.

### smectic-lcs
*   **Material ID:** `smectic-lcs` (`[[./css.md#MaterialNode]](category=LC, state_of_matter=Mesophase)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#liquid-crystals-lcs]]`
*   **Human-Readable Title:** Smectic Liquid Crystals (Layered Order)
*   **Description:** LCs with layered (1D/2D) positional order. 10CB, 8OBE (`[aya_reconfigurable_2020]`). Theory `[zhang_computing_2021]`.
*   **Key Properties:** Layered structure, Layer elasticity, Characteristic defects.
*   **Enabled Mechanisms/Phenomena:** Specific `[[./phenomena.md#defect-pattern-formation]` under flow (`[aya_reconfigurable_2020]`). Model system `[zhang_computing_2021]`.

### liquid-crystal-elastomers-lces
*   **Material ID:** `liquid-crystal-elastomers-lces` (`[[./css.md#MaterialNode]](category=Composite, state_of_matter=Soft Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#liquid-crystals-lcs]]`, `[[#elastomers-general]]`
*   **Human-Readable Title:** Liquid Crystal Elastomers (LCEs - Actuating)
*   **Description:** Crosslinked polymers with LC mesogens. Combine elasticity and LC response. Use (`[li_computational_2024]`). Reviews (`[palagi_bioinspired_2018]`, `[rus_design_2015]`). Application (`[sitti_physical_2021]`).
*   **Key Properties:** Large, reversible, anisotropic actuation strain. Stimuli-responsive. Shape memory potential.
*   **Enabled Mechanisms/Phenomena:** Powerful `[[./mechanisms.md#mechanical-actuation]` driven by `[[./mechanisms.md#thermal-transduction]]`, `[[./mechanisms.md#optical-transduction]]`. Basis `[[./phenomena.md#bio-inspired-actuation]]`. Enables `[[./mechanisms.md#physical-embodied-computation]]`. Enables `[[./phenomena.md#stimuli-responsive-property-switching]]`.
*   **Associated Methods:** Synthesis/Alignment. `[[./methods.md#continuum-modeling]]`. `[[./methods.md#mechanical-testing]]`.

---

## Fluids and Colloids

*   **Material ID:** `fluids-and-colloids` (`[[./css.md#MaterialNode]](category=Fluid)`)
*   **Human-Readable Title:** Fluids and Colloids (Class)

### aqueous-electrolytes
*   **Material ID:** `aqueous-electrolytes` (`[[./css.md#MaterialNode]](category=Fluid, state_of_matter=Liquid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#fluids-and-colloids]]`
*   **Human-Readable Title:** Aqueous Electrolytes (Salt Solutions/Buffers)
*   **Description:** Water with dissolved ions. Medium for biology (`[wadhams_making_2004]`), ionics (`[kamsma_brain-inspired_2024]`), Nafion (`[holler_autoselective_2020]`), DNA (`[hadorn_specific_2012]`), iDEP (`[lentz_low_2019]`).
*   **Key Properties:** Ionic conductivity, Dielectric props, Osmotic pressure, Buffering, Solvation.
*   **Enabled Mechanisms/Phenomena:** Medium `[[./mechanisms.md#electrical-ionic-transduction]]`. Drives `[[./mechanisms.md#phase-conformation-memory]` (`[robin_long-term_2023]`), `[[./mechanisms.md#reservoir-computing]` (`[kamsma_brain-inspired_2024]`). Affects `[[./mechanisms.md#equilibrium-self-assembly]]`. Enables electrokinetics (`[[./mechanisms.md#driven-by-physical-forces-dynamics]]`).

### ferrofluids
*   **Material ID:** `ferrofluids` (`[[./css.md#MaterialNode]](category=Fluid, state_of_matter=Liquid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#fluids-and-colloids]]`; `[[./css.md#ComposedOfMaterialEdge]]` → `[[#fe3o4-nanoparticles]]` + Solvent
*   **Human-Readable Title:** Ferrofluids (Magnetically Responsive Colloids)
*   **Description:** Stable suspensions of magnetic NPs. E.g., `[crepaldi_evidence_2022]`. Usage (`[hu_shaping_2019]`). Context (`[kaspar_rise_2021]`).
*   **Key Properties:** Fluidity, Magnetic response, Field-induced structuring, History-dependent impedance (`[crepaldi_experimental_2023]`).
*   **Enabled Mechanisms/Phenomena:** Reservoir `[[./mechanisms.md#reservoir-computing]` (`[crepaldi_experimental_2023]`). Memory `[[./mechanisms.md#phase-conformation-memory]` (`[crepaldi_evidence_2022]`). `[[./mechanisms.md#driven-by-physical-forces-dynamics]` (`[[./phenomena.md#surface-topography-patterning]]`, `[[./phenomena.md#collective-rotation--milling]]`). Enable `[[./mechanisms.md#mechanical-actuation]]`.

### emulsion-droplets
*   **Material ID:** `emulsion-droplets` (`[[./css.md#MaterialNode]](category=Fluid, state_of_matter=Liquid dispersion)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#fluids-and-colloids]]`; `[[./css.md#ComposedOfMaterialEdge]]` → Dispersed Liq + Continuous Liq + Surfactant
*   **Human-Readable Title:** Emulsion Droplets (Liquid-in-Liquid Dispensations)
*   **Description:** Liquid droplets in immiscible liquid. Active (`[cejkova_dynamics_2014]`, `[hanczyc_fatty_2007]`). Assembly platform (`[hadorn_specific_2012]`). Template (`[hu_multi-compartment_2022]`). Collective (`[wang_collective_2019]`). Computation (`[fernando_pattern_2003]`). Protocells (`[hanczyc_chemical_2010]`).
*   **Key Properties:** Deformable interface, High surface area, Compartmentalization, Interface sensitivity (`[hanczyc_fatty_2007]`).
*   **Enabled Mechanisms/Phenomena:** `[[./mechanisms.md#mechanical-actuation]` (propulsion). `[[./mechanisms.md#chemical-transduction]` (chemotaxis). `[[./methods.md#dna-directed-assembly]]` platform. `[[./mechanisms.md#self-organization--emergence-mechanisms]]`. Phenomena: `[[./phenomena.md#autonomous-self-propulsion]]`, `[[./phenomena.md#chemotaxis--taxis-behaviors]]`, `[[./phenomena.md#clustering--aggregation--phase-separation]]`.
*   **Associated Methods:** Formation (`[[./methods.md#microfluidics]]`). Study (`[[./methods.md#microscopy]]`).

### ionic-liquids
*   **Material ID:** `ionic-liquids` (`[[./css.md#MaterialNode]](category=Fluid, state_of_matter=Liquid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#fluids-and-colloids]]`
*   **Human-Readable Title:** Ionic Liquids (ILs - Molten Salts)
*   **Description:** Low-melting point salts. Used as solvents (`[chen_enormous-stiffness-changing_2022]`).
*   **Key Properties:** Ionic conductivity, Wide electrochemical window, Unique solvation, Low vapor pressure.
*   **Enabled Mechanisms/Phenomena:** Enable unique phase separation driving `[[./phenomena.md#stimuli-responsive-property-switching]]`, `[[./mechanisms.md#phase-conformation-memory]` (`[chen_enormous-stiffness-changing_2022]`). Potential electrolyte for `[[#iontronic-devices]]` (`[kaspar_rise_2021]`).

### organic-solvents
*   **Material ID:** `organic-solvents` (`[[./css.md#MaterialNode]](category=Fluid, state_of_matter=Liquid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#fluids-and-colloids]]`
*   **Human-Readable Title:** Organic Solvents (Non-Aqueous Liquids)
*   **Description:** Used as reaction media, processing aids, phases. Folding (`[foumthuim_solvent_2024]`). Droplet matrix (`[wang_collective_2019]`). Dispersion (`[hu_shaping_2019]`).
*   **Key Properties:** Polarity, Viscosity, Volatility, Solvency.
*   **Enabled Mechanisms/Phenomena:** Influence folding `[[./mechanisms.md#equilibrium-self-assembly]]`. Phase for `[[#emulsion-droplets]]`. Needed for `[[./methods.md#evaporation-driven-assembly]]`. Mediate chemical signals. Affect active matter motility.

### active-matter-fluids
*   **Material ID:** `active-matter-fluids` (`[[./css.md#MaterialNode]](category=Fluid/Composite, state_of_matter=Liquid/Dispersion)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#fluids-and-colloids]]`; `[[./css.md#ComposedOfMaterialEdge]]` → Active Units + Fluid
*   **Human-Readable Title:** Active Matter Fluids (Self-Propelled Units)
*   **Description:** Systems of units converting energy to motion. Theory (`[goh_noisy_2022]`). Behavior (`[negi_collective_2024]`). Roadmap (`[gompper_2025_2025]`).
*   **Key Properties:** Self-propulsion, NESS, Collective motion, Interactions.
*   **Enabled Mechanisms/Phenomena:** Exhibit `[[./mechanisms.md#mechanical-actuation]]`, `[[./mechanisms.md#driven-by-physical-forces-dynamics]]`. Display `[[./phenomena.md#collective-motion--phase-behavior]]` (flocking, MIPS, turbulence, rotation). Transport application `[[./applications.md#microrobotics]]`.
*   **Associated Methods:** Modeling (`[[./methods.md#particle-based-modeling]]`, `[[./methods.md#agent-based-modeling-abm]]`, `[[./methods.md#continuum-modeling]]`). Observation (`[[./methods.md#particle-cell-tracking-analysis]]`).
*   **Relevant Concepts:** `[[./theoretical.md#active-matter]]`.

### colloidal-particles
*   **Material ID:** `colloidal-particles` (`[[./css.md#MaterialNode]](category=Fluid, state_of_matter=Dispersion)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#fluids-and-colloids]]`
*   **Human-Readable Title:** Colloidal Particles (General Dispersed Phase)
*   **Description:** Generic term for µm/sub-µm particles dispersed in fluid. Includes PS/silica beads (`[kamsma_brain-inspired_2024]`, `[alapan_shape-encoded_2019]`), functionalized beads (`[lee_shape_2022]`), DNA-coated `[mcmullen_self-assembly_2022]`. Used as building blocks for assembly. Differs from `[[#other-nanoparticles]]` by primary role as colloids vs specific functional NPs.
*   **Key Properties:** Size, shape `[lee_shape_2022]`, surface chemistry, interactions (electrostatic, depletion, van der Waals, specific binding `[[./materials.md#dna]]`).
*   **Enabled Mechanisms/Phenomena:** Key materials for studying `[[./methods.md#colloidal-assembly]]`. Exhibit `[[./phenomena.md#periodic-pattern-formation]` (`[kamsma_brain-inspired_2024]`), `[[./phenomena.md#clustering--aggregation--phase-separation]` (`[angioletti-uberti_re-entrant_2012]`). Basis for models of complex fluids / active matter.
*   **Associated Methods:** Synthesis (`[[./methods.md#colloidal-synthesis-assembly]]`), Manipulation (`[[./methods.md#external-field-control]]`), Observation (`[[./methods.md#microscopy]]`), Analysis (`[[./methods.md#dynamic-light-scattering]]`).

---

## Granular Materials

*   **Material ID:** `granular-materials` (`[[./css.md#MaterialNode]](category=Granular, state_of_matter=Solid (collection))`)
*   **Human-Readable Title:** Granular Materials (Class)

### granular-media
*   **Material ID:** `granular-media` (`[[./css.md#MaterialNode]](category=Granular, state_of_matter=Solid (collection))`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#granular-materials]]`
*   **Human-Readable Title:** Granular Media (e.g., Steel Spheres)
*   **Description:** Collections of discrete solid macroscopic particles. Example: Steel spheres `[varela-rosales_granular_2023]`. Robot context `[goldman_robot_2024]`.
*   **Key Properties:** Frictional interactions, Inelastic collisions, Jamming, Segregation, Avalanches.
*   **Enabled Mechanisms/Phenomena:** Exhibit `[[./mechanisms.md#driven-by-physical-forces-dynamics]]` (convection, segregation `[[./phenomena.md#clustering--aggregation--phase-separation]]`) under driving `[varela-rosales_granular_2023]`. Exploit `[[./mechanisms.md#energy-flow-dissipation]]`. Inspire swarm robots `[goldman_robot_2024]`. Potential logic/memory analogue.
*   **Associated Methods:** Simulation `[[./methods.md#discrete-element-method-dem]]`. Experiment `[[./methods.md#mechanical-input-control]]`. Theory (`[[./theoretical.md#statistical-mechanics--stochastic-thermodynamics]]`, `[[./theoretical.md#continuum-mechanics]]`).

---

## Other (Includes Devices / Composite Systems as Materials)

### memristors
*   **Material ID:** `memristors` (`[[./css.md#MaterialNode]](category=Device, state_of_matter=Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#other]]`
*   **Human-Readable Title:** Memristors (Resistive Switching Devices)
*   **Description:** Two-terminal devices exhibiting resistance dependent on history of voltage/current. Physical realization of `[[./mechanisms.md#resistance-switching-memristance]]`. Key components in neuromorphic computing hardware. Review `[wan_artificial_2020]`. Theoretical basis `[di_ventra_parallel_2013]`. Oxide-based (`[yao_fully_2020]`). Chemo/polymer-based (`[yang_memristor_2022]`). Conceptual use `[kaspar_rise_2021]`.
*   **Key Properties:** Resistance switching, Non-volatility, Analog memory potential, Synaptic mimicry.
*   **Enabled Mechanisms/Phenomena:** Core device for `[[./mechanisms.md#resistance-switching-memristance]]`. Enable `[[./phenomena.md#memristance]]`, `[[./phenomena.md#synaptic-plasticity-emulation]]`, `[[./phenomena.md#associative-memory--pattern-completion]]`. Basis for `[[./mechanisms.md#neuromorphic-computation]]`.
*   **Associated Applications:** `[[./applications.md#neuromorphic-hardware]]`, In-memory computing.
*   **Associated Methods:** Fabrication (`[[./methods.md#micro-nano-fabrication]]`). Characterization (`[[./methods.md#electrical-measurements]]`).

### iontronic-devices
*   **Material ID:** `iontronic-devices` (`[[./css.md#MaterialNode]](category=Device, state_of_matter=Solid/Gel/Liquid interface)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#other]]`
*   **Human-Readable Title:** Iontronic Devices
*   **Description:** Devices using controlled ion flow in electrolytes or solids to achieve functionality (switching, memory, logic, actuation). Includes ion channels, pumps, OECTs, ion diodes. Often interfaces solid state with electrolytes (`[[#aqueous-electrolytes]]`, `[[#ionic-liquids]]`). (`[robin_long-term_2023]`, `[kamsma_iontronic_2023]`, `[kamsma_chemically_2024]`, `[luo_highly_2023]`). Context (`[kaspar_rise_2021]`).
*   **Key Properties:** Ionic conduction, Electrochemical reactions, Gateable ion flow, Memory via ion distribution.
*   **Enabled Mechanisms/Phenomena:** Realize `[[./mechanisms.md#electrical-ionic-transduction]]`, `[[./mechanisms.md#chemical-transduction]` (`[luo_highly_2023]`). Store memory (`[[./mechanisms.md#phase-conformation-memory]` `[robin_long-term_2023]`). Perform computation (`[[./mechanisms.md#neuromorphic-computation]` `[kamsma_chemically_2024]`, `[[./mechanisms.md#reservoir-computing]]` `[kamsma_brain-inspired_2024]`). Enable `[[./phenomena.md#synaptic-plasticity-emulation]]`.
*   **Associated Applications:** `[[./applications.md#neuromorphic-hardware]]`, `[[./applications.md#biosensing]]`, `[[./applications.md#bioelectronics]]`.
*   **Associated Methods:** Fabrication (`[[./methods.md#micro-nano-fabrication]]`), Characterization (`[[./methods.md#electrical-measurements]]`), Modeling (`[[./methods.md#continuum-modeling]]` PNP/Electrokinetics).

### plasmonics-metamaterials
*   **Material ID:** `plasmonics-metamaterials` (`[[./css.md#MaterialNode]](category=Composite/StructuredMaterial, state_of_matter=Solid)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#other]]`, Related to `[[#metals]]`, `[[#mechanical-metamaterials]]`.
*   **Human-Readable Title:** Plasmonic / Optical Metamaterials
*   **Description:** Nanostructured materials (often `[[#metals]]`) designed to interact strongly with light via surface plasmon resonances, enabling exotic optical properties or enhancing light-matter interactions. Nanostructures designed for optical control. Metasurfaces `[malevich_very-large-scale_2025]`, `[chen_metamaterials_2023]`. Usage in photodetection (`[de_nicola_graphene_2020]`). Quantum interactions `[westerhout_plasmon_2018]`.
*   **Key Properties:** Strong light absorption/scattering/enhancement at specific frequencies, Subwavelength light confinement, Tunable response.
*   **Enabled Mechanisms/Phenomena:** Enable enhanced `[[./mechanisms.md#optical-transduction]` (`[de_nicola_graphene_2020]`). Modulate `[[./mechanisms.md#optical-response]` (`[chen_metamaterials_2023]`, `[malevich_very-large-scale_2025]`). Potential sensing mechanisms. Can generate `[[./phenomena.md#enhanced-physical-properties]]`.
*   **Associated Applications:** `[[./applications.md#sensing]]`, Photodetection, Optical switching, Invisibility cloaks (conceptual).
*   **Associated Methods:** Fabrication (`[[./methods.md#micro-nano-fabrication]]`), Characterization (`[[./methods.md#spectroscopy]]`, `[[./methods.md#microscopy]]`), Modeling (`[[./methods.md#finite-element-method-femfea]]` for EM waves).

### quantum-systems
*   **Material ID:** `quantum-systems` (`[[./css.md#MaterialNode]](category=Variable, state_of_matter=Variable)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#other]]`
*   **Human-Readable Title:** Quantum Mechanical Systems (Abstract/Physical)
*   **Description:** Physical systems where quantum mechanical effects (coherence, entanglement, superposition) are dominant or relevant for function. Can include single atoms/molecules, spin systems (`[goettems_physics_2024]`), excitonic systems (`[cao_quantum_2020]`), NV centers, superconducting circuits, potentially microtubules (`[babcock_ultraviolet_2024]`). Also abstract systems used in models (e.g., Quantum Reservoirs `[sakurai_quantum_2022]`). Nanoparticle quantum dots (`[thedford_promise_2023]`). Bio context (`[lambert_quantum_2013]`, `[wills_reflexivity_2019]`). Plasmonics (`[westerhout_plasmon_2018]`).
*   **Key Properties:** Quantum coherence (`[[./css.md#ParameterNode]](name=coherence_time)`), Superposition, Entanglement, Quantized energy levels.
*   **Enabled Mechanisms/Phenomena:** `[[./mechanisms.md#quantum-coherence-transport]` underpinning phenomena like efficient energy transfer (`[[./phenomena.md#photosynthesis]]`), magnetoreception (`[[./phenomena.md#magnetoreception]]`). Collective quantum emission (`[[./phenomena.md#superradiance]]`). Basis for Quantum Computing paradigms (`[[./applications.md#quantum-computing]]`). Can act as Quantum Reservoir for `[[./mechanisms.md#reservoir-computing]` (`[sakurai_quantum_2022]`).
*   **Associated Methods:** Modeling (`[[./methods.md#quantum-simulation]]`), Cryogenic Experiments, Advanced Spectroscopy (`[cao_quantum_2020]`).
*   **Relevant Concepts:** `[[./theoretical.md#quantum-mechanics]]`.

### chemical-oscillators
*   **Material ID:** `chemical-oscillators` (`[[./css.md#MaterialNode]](category=Chemical System, state_of_matter=Liquid/Gel)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#other]]`
*   **Human-Readable Title:** Chemical Oscillating Reactions (e.g., BZ Reaction)
*   **Description:** Non-equilibrium chemical systems exhibiting periodic oscillations in concentrations of reactant/intermediate species. Best known example: Belousov-Zhabotinsky (BZ) reaction (`[adamatzky_collision-based_2002]`). Used as basis for unconventional computation and pattern formation studies (`[penketh_is_2022]`). Example `[yang_emergent_2022]`.
*   **Key Properties:** Limit cycle dynamics, Excitable media potential, Pattern formation (waves, spirals `[[./phenomena.md#dynamic-chemicalcellular-patterns]]`).
*   **Enabled Mechanisms/Phenomena:** Dynamics implement `[[./mechanisms.md#physical-embodied-computation]` (e.g., logic gates `[adamatzky_collision-based_2002]`). Driven by `[[./mechanisms.md#reaction-diffusion-systems]]` / `[[./methods.md#chemical-pathway-network-modeling]]`. Uses `[[./mechanisms.md#energy-flow-dissipation]]` (driven by chemical potential difference).
*   **Associated Methods:** `[[./methods.md#chemical-stimuli-control]` (setup), `[[./methods.md#spectroscopy]]` / `[[./methods.md#microscopy]]` (observation). Modeling (`[[./methods.md#continuum-modeling]]`).

### artificial-chemistries
*   **Material ID:** `artificial-chemistries` (`[[./css.md#MaterialNode]](category=ComputationalModel, state_of_matter=NA)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#other]]`
*   **Human-Readable Title:** Artificial Chemistries (Computational Construct)
*   **Description:** Abstract computational systems inspired by chemical reactions, used to study self-organization, emergence, evolution, and computation. Molecules are data structures, reactions are rewrite rules. Examples (`[pervan_algorithmic_2020]`). Related concept (`[harrison_mind_2022]` minimal cognition). Self-replication models (`[xavier_autocatalytic_2020]`).
*   **Key Properties:** Rule-based dynamics, Potential for complexity/emergence from simple rules, Population dynamics, Reaction networks (`[[./methods.md#chemical-pathway-network-modeling]]`).
*   **Enabled Mechanisms/Phenomena:** Simulate `[[./mechanisms.md#driven-by-algorithmic-computational-rules]]`. Model emergence `[[./mechanisms.md#self-organization--emergence-mechanisms]]`. Explore information processing `[[./mechanisms.md#information-processing--computation-mechanisms]` (`[pervan_algorithmic_2020]`).
*   **Associated Methods:** Computational Simulation (`[[./methods.md#agent-based-modeling-abm]]` conceptually), Network analysis (`[[./methods.md#network-modeling]]`).

### wave-propagation-media
*   **Material ID:** `wave-propagation-media` (`[[./css.md#MaterialNode]](category=Material System/Computational Model, state_of_matter=Variable)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#other]]`
*   **Human-Readable Title:** Wave Propagation Media (Physical / Computational)
*   **Description:** Physical systems or computational models where information processing occurs via the propagation and interaction of waves (mechanical, optical, chemical, etc.). Includes excitable media (`[[#chemical-oscillators]]`), physical implementations for Reservoir Computing `[marcucci_theory_2020]`. Used for logic `[adamatzky_computing_2011]`. Slime mold (`[kramar_encoding_2021]`). Ferrofluid (`[crepaldi_experimental_2023]`).
*   **Key Properties:** Wave speed, Dispersion relations, Nonlinear interactions (collisions, reflections), Interference patterns.
*   **Enabled Mechanisms/Phenomena:** Implement `[[./mechanisms.md#reservoir-computing]` `[marcucci_theory_2020]`, `[[./mechanisms.md#physical-embodied-computation]` (collision-based logic `[adamatzky_computing_2011]`). Rely on `[[./mechanisms.md#driven-by-physical-forces-dynamics]]` or `[[./mechanisms.md#reaction-diffusion-systems]]`. Memory possible in interaction patterns `[[./mechanisms.md#dynamic-state-memory]]`.

### chemical-fuel
*   **Material ID:** `chemical-fuel` (`[[./css.md#MaterialNode]](category=Chemical, state_of_matter=Variable)`)
*   **Relation:** `[[./css.md#PartOfEdge]]` → `[[#other]]`
*   **Human-Readable Title:** Chemical Fuel (Generic)
*   **Description:** A generic placeholder for chemical substances that provide energy for processes, such as H₂O₂ for catalytic swimmers (`[ebbens_active_2016]`), or ATP in biological systems. Linked from `[[./mechanisms.md#energy-flow-dissipation]]`.
*   **Key Properties:** Energy density, Reactivity.
*   **Enabled Mechanisms/Phenomena:** Powers `[[./mechanisms.md#energy-flow-dissipation]]`, drives `[[./phenomena.md#autonomous-self-propulsion]]`.
