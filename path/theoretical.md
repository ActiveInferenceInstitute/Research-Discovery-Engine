# Theoretical Concepts: Frameworks for Material Cognition

**Description:** This document catalogues major theoretical frameworks, principles, and abstract concepts used across the analyzed literature to understand, model, or design systems related to material cognition and embodied intelligence. Each concept serves as a [[./css.md#TheoreticalConceptNode]] in the knowledge graph.

---

## Index of Theoretical Concepts

*   [Statistical Mechanics / Stochastic Thermodynamics](#statistical-mechanics--stochastic-thermodynamics)
*   [Information Theory](#information-theory)
*   [Thermodynamics of Information](#thermodynamics-of-information)
*   [Thermodynamic Uncertainty Relations](#thermodynamic-uncertainty-relations)
*   [Active Inference / Free Energy Principle (FEP)](#active-inference-fep)
*   [Bayesian Mechanics](#bayesian-mechanics)
*   [Continuum Mechanics](#continuum-mechanics)
*   [Liquid Crystal Theory](#liquid-crystal-theory)
*   [Network Theory](#network-theory)
*   [Dynamical Systems Theory](#dynamical-systems-theory)
*   [Criticality / Phase Transitions](#criticality--phase-transitions)
*   [Assembly Theory (AT)](#assembly-theory-at)
*   [Reaction-Diffusion Systems](#reaction-diffusion-systems)
*   [Quantum Mechanics](#quantum-mechanics)
*   [Embodied Intelligence (Conceptual)](#embodied-intelligence-conceptual)
*   [Collective Intelligence (Conceptual)](#collective-intelligence-conceptual)
*   [Basal / Minimal Cognition (Conceptual)](#basal-minimal-cognition-conceptual)
*   [Physical Intelligence (PI)](#physical-intelligence-pi)
*   [Category Theory](#category-theory)
*   [Control Theory](#control-theory)
*   [Active Matter Theory](#active-matter-theory)
*   [Magnetism Theory](#magnetic-field-theory)

---

### statistical-mechanics--stochastic-thermodynamics
*   **Concept ID:** `statistical-mechanics--stochastic-thermodynamics` ([[./css.md#TheoreticalConceptNode]](field=Physics))
*   **Human-Readable Title:** Physics of Many Particles and Fluctuations
*   **Description:** Frameworks describing systems with many degrees of freedom using probability distributions over microstates (Statistical Mechanics) and analyzing fluctuating thermodynamic quantities like work, heat, and entropy production in small systems or along single trajectories (Stochastic Thermodynamics). Key tools: master equations, Fokker-Planck, Langevin, Fluctuation Theorems ([ritort_nonequilibrium_2024]), NESS, detailed/local balance.
*   **Links & Relevance:**
    *   Underpins understanding of [[./mechanisms.md#energy-flow-dissipation]].
    *   Enables analysis of NESS formation ([[./phenomena.md#ness-states]]) via [[./mechanisms.md#driven-by-thermodynamic-statistical-principles]] ([freitas_emergent_2022]).
    *   Foundation for [[#thermodynamics-of-information]] ([sartori_thermodynamic_2014]).
    *   Foundation for [[#thermodynamic-uncertainty-relations]].
    *   Models systems in [[./methods.md#particle-based-modeling]], ([[./mechanisms.md#driven-by-physical-forces-dynamics]] [negi_emergent_2022]).
    *   Connects to [[#active-inference-fep]] via path integrals ([friston_path_2023]).
    *   Relates to [[#criticality--phase-transitions]].
    *   Applied to network training ([seung_statistical_1992]), reactions ([shaberi_optimal_2025]).
*   **Methods Used:** Theoretical analysis ([[./methods.md#mathematical-analysis]]), simulation methods ([[./methods.md#statistical-mechanics--stochastic-thermodynamics]], [[./methods.md#langevin-dynamics]], [[./methods.md#monte-carlo-mc]]).

### information-theory
*   **Concept ID:** `information-theory` ([[./css.md#TheoreticalConceptNode]](field=InfoTheory, Mathematics))
*   **Human-Readable Title:** Quantifying Information and Uncertainty
*   **Description:** Mathematical framework quantifying concepts like uncertainty (Shannon entropy H), correlations (mutual information I), information flow, coding limits, and cost of information (bits). Central to communication and computation.
*   **Links & Relevance:**
    *   Quantifies capacity in [[./mechanisms.md#memory--adaptation-mechanisms] ([boussard_memory_2019]).
    *   Measures complexity in [[./mechanisms.md#information-processing--computation-mechanisms] ([langton_computation_1990]) and information synergy/flow ([aguilera_exploring_2018]).
    *   Key component of [[#thermodynamics-of-information]].
    *   Basis for [[#active-inference-fep]] (surprisal, KL divergence [friston_free-energy_2010]).
    *   Used to bound sensing precision ([govern_optimal_2014]) and transmission ([bryant_physical_2023]).
*   **Methods Used:** [[./methods.md#information-theory-metrics]].

### thermodynamics-of-information
*   **Concept ID:** `thermodynamics-of-information` ([[./css.md#TheoreticalConceptNode]](field=Physics, InfoTheory))
*   **Human-Readable Title:** Physics of Information Processing Costs
*   **Description:** Investigates thermodynamic costs (energy dissipation, entropy production) of information processing: measurement ([parrondo_thermodynamics_2015]), memory erasure (Landauer), computation, feedback control (Maxwell's demon). Formalized via Generalized Second Laws. Reviews: [parrondo_thermodynamics_2015], [ritort_nonequilibrium_2024].
*   **Links & Relevance:**
    *   Connects [[#statistical-mechanics--stochastic-thermodynamics]] and [[#information-theory]] to constrain physical processing.
    *   Bounds efficiency of [[./mechanisms.md#memory--adaptation-mechanisms]] and [[./mechanisms.md#information-processing--computation-mechanisms]]. Links to [[./mechanisms.md#energy-flow-dissipation]].
    *   Explains [[./phenomena.md#information-thermodynamics-effects]] (Information Engines [toyabe_experimental_2010], [boyd_correlation-powered_2017]).
    *   Quantifies costs of adaptation/sensing ([sartori_thermodynamic_2014], [govern_optimal_2014]).
    *   Applied to molecular machines ([sagawa_thermodynamics_2013]), biology ([kringelbach_thermodynamics_2024]).
*   **Methods Used:** [[./methods.md#statistical-mechanics--stochastic-thermodynamics]].

### thermodynamic-uncertainty-relations
*   **Concept ID:** `thermodynamic-uncertainty-relations` ([[./css.md#TheoreticalConceptNode]](field=Physics))
*   **Human-Readable Title:** Cost-Precision Tradeoffs in Dynamics (TURs)
*   **Description:** Inequalities bounding minimal thermodynamic cost (dissipation) required to achieve a given precision (variance) in dynamic observables in non-equilibrium systems ([barato_thermodynamic_2015]). Explores speed-accuracy-dissipation tradeoffs. Studies: ([ziyin_universal_2023], [freitas_emergent_2022], [dieball_direct_2023], [cocconi_dissipation-accuracy_2025]).
*   **Links & Relevance:**
    *   Quantifies tradeoffs between precision ([[./css.md#MetricNode]]) and [[./mechanisms.md#energy-flow-dissipation]].
    *   Constrains efficiency of biological processes ([yang_physical_2021]), computation/sensing accuracy ([[./phenomena.md#dissipation-accuracy-tradeoff]]).
    *   Impacts system dynamics ([[./css.md#SystemNode]](dynamics_node_ref)).
*   **Methods Used:** [[./methods.md#statistical-mechanics--stochastic-thermodynamics]], simulation [[./methods.md#simulation--modeling-methods]].

### active-inference-fep
*   **Concept ID:** `active-inference-fep` ([[./css.md#TheoreticalConceptNode]](field=InfoTheory, Biology, CS))
*   **Human-Readable Title:** Active Inference & Free Energy Principle (FEP)
*   **Description:** Normative principle: self-organizing systems minimize variational free energy (surprise bound) via perception (belief update) and action (sampling). Unifies perception, action, learning, homeostasis. Core papers: ([friston_free-energy_2010], [parr_active_2022]).
*   **Links & Relevance:**
    *   Implementation for [[./mechanisms.md#neuromorphic-computation]] ([stamps_active_2024]), embodied AI ([pezzulo_active_2024]).
    *   Integrates [[./mechanisms.md#information-interface-sensing-and-transduction-mechanisms]], [[./mechanisms.md#bayesian-inference--probabilistic-computation]], [[./mechanisms.md#adaptation-and-learning-mechanisms]], [[./mechanisms.md#actuation--response-mechanisms]].
    *   Framework for understanding bio-agency ([mcmillen_collective_2024]), [[#basal-minimal-cognition-conceptual]] ([seifert_reinforcement_2024]). Bioelectricity link ([lagasse_future_2023]). Brain link ([kringelbach_thermodynamics_2024]).
    *   Foundation for [[#bayesian-mechanics]]. Formalism for physics ([friston_path_2023], [friston_free_2023]). Debate with physics ([kiefer_psychophysical_2020]).
*   **Methods Used:** Bayesian inference ([[./methods.md#ml-classificationregression-svm-mlp-k-means-som]] context), control theory, [[./methods.md#network-modeling]] (predictive coding).

### bayesian-mechanics
*   **Concept ID:** `bayesian-mechanics` ([[./css.md#TheoreticalConceptNode]](field=Physics, InfoTheory, Mathematics))
*   **Human-Readable Title:** Bayesian Mechanics: A Physics of Beliefs
*   **Description:** Framework deriving equations of motion for belief dynamics (probabilities on statistical manifolds) in self-organizing systems, often based on FEP. Aims for a "physics for sentient systems" using info geometry, gauge theory, stochastic thermodynamics ([ramstead_bayesian_2023]).
*   **Links & Relevance:**
    *   Provides mathematical language (differential geometry, stochastic calculus) for [[#active-inference-fep]] dynamics ([ramstead_bayesian_2023]).
    *   Describes belief update dynamics ([[./mechanisms.md#bayesian-inference--probabilistic-computation]]).
    *   Connects to [[#statistical-mechanics--stochastic-thermodynamics]], [[#information-theory]].
*   **Methods Used:** Differential geometry ([[./methods.md#mathematical-analysis]]), stochastic calculus.

### continuum-mechanics
*   **Concept ID:** `continuum-mechanics` ([[./css.md#TheoreticalConceptNode]](field=Physics))
*   **Human-Readable Title:** Physics of Continuous Materials (Solids & Fluids)
*   **Description:** Modeling materials as continuous media (stress, strain, density, velocity fields) governed by constitutive laws and conservation principles. Covers elasticity, fluid dynamics. Used for soft robotics ([rus_design_2015]), metamaterials ([jiao_mechanical_2023-1]), biomechanics ([maroudas-sacks_topological_2021]), active matter fluids ([negi_emergent_2022]).
*   **Links & Relevance:**
    *   Describes physics enabling [[./mechanisms.md#mechanical-actuation] ([xia_dynamic_2022]), [[./mechanisms.md#mechanical-transduction]], [[./mechanisms.md#physical-embodied-computation] ([son_emergent_2024]).
    *   Drives [[./mechanisms.md#driven-by-physical-forces-dynamics]] ([liao_tunable_2018]).
    *   Foundation for [[./methods.md#finite-element-method-femfea]]. Crucial for active matter ([pak_generalized_2014]).
    *   Describes materials like [[./materials.md#elastomers-general]], [[./materials.md#hydrogels-general]], [[./materials.md#fluids-and-colloids]]. Underpins [[./phenomena.md#controlled-locomotion--navigation]] dynamics.
*   **Methods Used:** PDE solving ([[./methods.md#continuum-modeling]], [[./methods.md#finite-element-method-femfea]]), [[./methods.md#mechanical-testing]] (parameters).

### liquid-crystal-theory
*   **Concept ID:** `liquid-crystal-theory` ([[./css.md#TheoreticalConceptNode]](field=Physics))
*   **Human-Readable Title:** Physics of Liquid Crystals (LCs)
*   **Description:** Physics describing partially ordered LCs ([[./materials.md#liquid-crystals-lcs]]) based on director field, elastic energy, response to fields/flow, and topological defects. Context ([wang_liquid_2022]). Active nematic analogies ([maroudas-sacks_topological_2021]). Comp. potential ([zhang_computing_2021]).
*   **Links & Relevance:**
    *   Enables understanding sensing ([[./mechanisms.md#chemical-transduction]], [[./mechanisms.md#optical-response]]), [[./mechanisms.md#physical-embodied-computation] ([kos_nematic_2022], [zhang_logic_2022]), [[./phenomena.md#defect-pattern-formation] ([sasaki_large-scale_2016]), [[./mechanisms.md#physical-structural-memory] ([kos_nematic_2022]). Explains LCE ([[./materials.md#liquid-crystal-elastomers-lces]]) actuation ([palagi_bioinspired_2018]).
*   **Methods Used:** [[./methods.md#microscopy]](POM), [[./methods.md#continuum-modeling]].

### network-theory
*   **Concept ID:** `network-theory` ([[./css.md#TheoreticalConceptNode]](field=Mathematics, CS, Physics))
*   **Human-Readable Title:** Analyzing Systems as Connected Graphs
*   **Description:** Approach analyzing systems as nodes/edges. Includes graph theory, topology, network stats, dynamics on networks, ANN design. Concepts: degree, clustering, paths, centrality, communities, robustness.
*   **Links & Relevance:**
    *   Foundation for [[./mechanisms.md#neuromorphic-computation] ([yao_fully_2020]), both ANNs ([yang_task_2019]) and physical nets ([kuncic_emergent_2018]). Models bio nets (GRNs). Underpins [[#collective-intelligence-conceptual]] (agent interactions). Used in [[./mechanisms.md#indirect-relayed-sensing]]. Analyses structure affecting [[./mechanisms.md#self-organization--emergence-mechanisms]]. Related to topology [millan_topology_2025]. Links to criticality [[#criticality--phase-transitions]] ([obyrne_how_2022]). Applied to chem nets ([lin_intelligent_2021]).
*   **Methods Used:** Graph analysis ([[./methods.md#network-topology-analysis]]), Statistical analysis ([[./methods.md#statistical-analysis]]), [[./methods.md#network-modeling]] simulations.

### dynamical-systems-theory
*   **Concept ID:** `dynamical-systems-theory` ([[./css.md#TheoreticalConceptNode]](field=Mathematics, Physics))
*   **Human-Readable Title:** Understanding How Systems Change Over Time
*   **Description:** Study of systems evolving according to fixed rules (ODEs/diff eqns). Concepts: state space, attractors, stability, bifurcations, chaos, patterns. Used for [[#reaction-diffusion-systems]], CAs ([langton_computation_1990]), Reservoir Computing ([hauser_towards_2011-1]), Neural Dynamics ([feng_optimal_2020]), Active Matter ([negi_emergent_2022]), [[#bayesian-mechanics]]. Review [muller_what_2017-1].
*   **Links & Relevance:**
    *   Describes dynamics ([[./css.md#SystemNode]](dynamics_node_ref)) in [[./mechanisms.md#self-organization--emergence-mechanisms]]. Basis for [[./mechanisms.md#information-processing--computation-mechanisms]]. Informs stability of [[./mechanisms.md#memory--adaptation-mechanisms]]. Linked to [[#criticality--phase-transitions]] (bifurcations [jiao_mechanical_2023]). Explains agent behavior ([horibe_mode_2011]).
*   **Methods Used:** [[./methods.md#numerical-ode-pde-solvers]], Phase space analysis, Bifurcation analysis, [[./methods.md#network-modeling]].

### criticality--phase-transitions
*   **Concept ID:** `criticality--phase-transitions` ([[./css.md#TheoreticalConceptNode]](field=Physics))
*   **Human-Readable Title:** Behavior at the Brink: Criticality and Transitions
*   **Description:** Study of systems near critical points (phase transitions) exhibiting scale-invariance, power-laws (avalanches [obyrne_how_2022]), enhanced sensitivity/complexity. Includes SOC, EOC concepts. Grounded in [[#statistical-mechanics--stochastic-thermodynamics]].
*   **Links & Relevance:**
    *   Hypothesized principle for brain ([obyrne_how_2022]), ANNs ([zhang_edge_2021]), swarms ([cavagna_scale-free_2010]), networks ([kuncic_emergent_2018]). Goal for neuromorphic systems ([srinivasa_criticality_2015]). Connects to [[#dynamical-systems-theory]] (bifurcations). Relevant to material transitions ([chen_enormous-stiffness-changing_2022]) underpinning [[./mechanisms.md#physical-structural-memory]]. Drives organization [[./mechanisms.md#criticality-driven-organization]]. Affects computation [[./mechanisms.md#information-processing--computation-mechanisms]]. Phenomena: [[./phenomena.md#scale-free-dynamics--criticality]], [[./phenomena.md#phase-transitions]].
*   **Methods Used:** [[./methods.md#statistical-analysis]] (power laws), [[./methods.md#network-modeling]], [[./methods.md#mathematical-analysis]] (renormalization).

### assembly-theory-at
*   **Concept ID:** `assembly-theory-at` ([[./css.md#TheoreticalConceptNode]](field=Chemistry, InfoTheory))
*   **Human-Readable Title:** Quantifying Complexity via Assembly History
*   **Description:** Framework quantifying complexity (Assembly Index 'a') based on minimum steps to construct an object from primitives, considering unique assembly pathways ([sharma_assembly_2023]). Distinguishes selected vs random objects based on 'a' and abundance.
*   **Links & Relevance:**
    *   Provides complexity measure ([[./css.md#ParameterNode]](name=assembly_index)). Relevant to [[./mechanisms.md#driven-by-thermodynamic-statistical-principles]] (assembly kinetics). Useful for analyzing [[./methods.md#self-assembly-methods]] or [[./mechanisms.md#driven-by-biological-processes]].
*   **Methods Used:** Pathway analysis ([[./methods.md#mathematical-analysis]]), kinetic modeling ([sharma_assembly_2023]).

### reaction-diffusion-systems
*   **Concept ID:** `reaction-diffusion-systems` ([[./css.md#TheoreticalConceptNode]](field=Mathematics, Biology, Chemistry))
*   **Human-Readable Title:** Pattern Formation via Chemical Reactions and Diffusion
*   **Description:** Mathematical models describing spatio-temporal patterns (e.g., Turing) from local reactions and diffusion. Often coupled non-linear PDEs. Basis for morphogenesis modeling ([grodstein_closing_2023]). Oscillators ([yang_emergent_2022], BZ [adamatzky_collision-based_2002]). Links ([lin_intelligent_2021], [wills_reflexivity_2019]).
*   **Links & Relevance:**
    *   Mechanism [[./mechanisms.md#reaction-diffusion-systems] for [[./phenomena.md#dynamic-chemicalcellular-patterns]]. Basis for chemical [[./mechanisms.md#physical-embodied-computation] ([adamatzky_collision-based_2002]). Couples chemical kinetics [[./mechanisms.md#chemical-transduction]] with transport. Relies on [[#dynamical-systems-theory]]. Link to [[#criticality--phase-transitions]] ([shaberi_optimal_2025]).
*   **Methods Used:** PDE solving ([[./methods.md#continuum-modeling]]), Stability analysis ([[./methods.md#mathematical-analysis]] [shaberi_optimal_2025]).

### quantum-mechanics
*   **Concept ID:** `quantum-mechanics` ([[./css.md#TheoreticalConceptNode]](field=Physics))
*   **Human-Readable Title:** Applying Quantum Principles to Complex Systems
*   **Description:** Using QM (coherence, superposition, entanglement, tunneling, spin dynamics, QFT) to explain phenomena or for novel computation. Includes quantum biology ([lambert_quantum_2013], [cao_quantum_2020]), Quantum RC ([sakurai_quantum_2022]), quantum effects in materials ([wills_reflexivity_2019], [goettems_physics_2024], [babcock_ultraviolet_2024], [thedford_promise_2023]). Plasmonics ([westerhout_plasmon_2018]).
*   **Links & Relevance:**
    *   Explains [[./mechanisms.md#quantum-coherence-transport] for photosynthesis ([[./phenomena.md#photosynthesis]]), magnetoreception ([[./phenomena.md#magnetoreception]]). Basis for novel [[./mechanisms.md#information-processing--computation-mechanisms]] (QRC [[./mechanisms.md#reservoir-computing]] [sakurai_quantum_2022]). Describes [[./materials.md#quantum-systems]]. Link to [[#statistical-mechanics--stochastic-thermodynamics]].
*   **Methods Used:** [[./methods.md#quantum-simulation]], [[./methods.md#spectroscopy]], theoretical analysis ([[./methods.md#mathematical-analysis]]).

### embodied-intelligence-conceptual
*   **Concept ID:** `embodied-intelligence-conceptual` ([[./css.md#TheoreticalConceptNode]](field=AI, Robotics, Cognitive Science))
*   **Human-Readable Title:** Embodied Intelligence & Morphological Computation
*   **Description:** Frameworks emphasizing the role of the physical body (morphology, materials) and environment interaction in generating intelligent behavior. Cognition arises from coupled brain-body-environment dynamics. Morphological computation outsources computation to physics. Core idea [pfeifer_morphological_2006]. Reviews [hughes_embodied_2022], [harrison_mind_2022], [muller_what_2017], [foumthuim_morphological_2013]. Biology link [levin_self-improvising_2024]. AI [lee_what_2022].
*   **Links & Relevance:**
    *   Conceptual basis for [[./mechanisms.md#physical-embodied-computation]]. Highlights interplay between sensing [[./mechanisms.md#information-interface-sensing-and-transduction-mechanisms]], actuation [[./mechanisms.md#actuation--response-mechanisms]], [[./materials.md]], and [[#dynamical-systems-theory]]. Central to soft robotics ([mengaldo_concise_2022], [rus_design_2015]). Links to [[#physical-intelligence-pi]]. Contrasted with disembodied AI. Link to [[#control-theory]] ([hoffmann_trade-offs_2014]).
*   **Methods Used:** Conceptual analysis, robotics experiments ([[./methods.md#physical-robot-experiments]]), simulations ([[./methods.md#simulation--modeling-methods]]).

### collective-intelligence-conceptual
*   **Concept ID:** `collective-intelligence-conceptual` ([[./css.md#TheoreticalConceptNode]](field=Biology, CS, Robotics))
*   **Human-Readable Title:** Collective and Swarm Intelligence
*   **Description:** How groups of simpler interacting agents achieve complex, adaptive behaviors. Focuses on decentralized control, local interactions, communication, emergent coordination, collective decision-making. Biology ([levin_multiscale_2024], [mcmillen_collective_2024], [couzin_collective_2009]). Cognition ([ciaunica_nested_nodate]). Swarm robotics ([sitti_physical_2021], [wang_robo-matter_2024]). Synthetic bio ([sole_open_2024]).
*   **Links & Relevance:**
    *   Underpins [[./mechanisms.md#collective-swarm-computation]] and [[./phenomena.md#collective-decision-making]]. Explains emergence in [[./mechanisms.md#self-organization--emergence-mechanisms]]. Relies on interactions and communication [[./mechanisms.md#indirect-relayed-sensing]]. Social aspects of [[./phenomena.md#flocking--schooling--swarming]] ([puy_selective_2024]).
*   **Methods Used:** [[./methods.md#agent-based-modeling-abm]], [[#network-theory]], observational studies.

### basal-minimal-cognition-conceptual
*   **Concept ID:** `basal-minimal-cognition-conceptual` ([[./css.md#TheoreticalConceptNode]](field=Biology, Philosophy, Cognitive Science))
*   **Human-Readable Title:** Basal and Minimal Cognition
*   **Description:** Exploring foundations/minimal requirements for cognition (learning, memory, agency, decision-making) in non-neural or simple systems (cells [harrison_mind_2022], tissues, plants, slime molds [boussard_memory_2019], microbes, artificial systems [hanczyc_chemical_2010]). Challenges anthropocentrism. Includes TAME models ([seifert_reinforcement_2024], [rouleau_multiple_2023]). Scaling [mcmillen_collective_2024], nesting ([ciaunica_nested_nodate]). Molecular link ([wills_reflexivity_2019]).
*   **Links & Relevance:**
    *   Investigates fundamental [[./mechanisms.md]] enabling basic cognitive [[./phenomena.md]]. Connects to [[#embodied-intelligence-conceptual]]. Basis for [[#collective-intelligence-conceptual]]. Integration with [[#active-inference-fep]], RL ([seifert_reinforcement_2024]).
*   **Methods Used:** Comparative biology, behavioral assays, synthetic biology, computational modeling ([[./methods.md#biological-construction]], [[./methods.md#simulation--modeling-methods]]).

### physical-intelligence-pi
*   **Concept ID:** `physical-intelligence-pi` ([[./css.md#TheoreticalConceptNode]](field=Robotics, Materials Science))
*   **Human-Readable Title:** Physical Intelligence (PI) Paradigm
*   **Description:** Embedding functionalities (sensing, actuation, control, memory, computation) directly into the physical body (material, structure) of an agent, reducing reliance on centralized digital computation. Defined/reviewed [sitti_physical_2021]. Connects materials ([kaspar_rise_2021], [jiao_mechanical_2023-1]) with robotics ([sitti_physical_2021]).
*   **Links & Relevance:**
    *   Leverages/integrates multiple [[./mechanisms.md]] (esp. [[./mechanisms.md#physical-embodied-computation]], [[./mechanisms.md#physical-structural-memory]], responsive actuation/sensing). Builds on [[#embodied-intelligence-conceptual]]. Central goal for soft/micro robotics ([paixao_leveraging_2022]).
*   **Methods Used:** Materials synthesis/fabrication ([[./methods.md#composite-fabrication]]), modeling ([[./methods.md#continuum-modeling]]), experiments ([[./methods.md#mechanical-testing]]).

### category-theory
*   **Concept ID:** `category-theory` ([[./css.md#TheoreticalConceptNode]](field=Mathematics, CS))
*   **Human-Readable Title:** Category Theory (Abstract Structure & Relations)
*   **Description:** Branch of mathematics dealing with abstract structures and structure-preserving transformations (functors, natural transformations). Focuses on objects and morphisms (arrows) and their composition. Provides a language for analogy, hierarchy, compositionality, universal properties (limits, colimits). Introduced for cognition ([phillips_what_2022], [healy_episodic_2019]). Used for representation learning ([sheshmani_categorical_2022]). Framework for general intelligence ([yuan_categorical_2023]). For data integration ([koupil_unified_2022], [purvine_category_2016]). Transformer lens ([pan_token_2024], [buehler_graph-aware_2025]).
*   **Links & Relevance:**
    *   Provides formalisms potentially unifying concepts like compositionality, analogy, structural relations relevant across [[./mechanisms.md]] and [[./phenomena.md]]. Used to define [[#embodied-intelligence-conceptual]] models ([fuchslin_morphological_2013]). Could potentially formalize the CNM schema itself ([[./css.md]]) or parts of the Discovery Engine process ([[./process.md]]). Analyzes information flow ([bryant_physical_2023]).
*   **Methods Used:** [[./methods.md#mathematical-analysis]]. Potential implementation in programming languages (e.g., Haskell). Used to develop representation learning algorithms.

### control-theory
*   **Concept ID:** `control-theory` ([[./css.md#TheoreticalConceptNode]](field=Engineering, Mathematics))
*   **Human-Readable Title:** Control Theory
*   **Description:** Engineering and mathematical framework dealing with the behavior of dynamical systems with inputs, aiming to design controllers that modify system behavior to achieve stability, optimality, or tracking objectives. Core concepts include feedback, stability analysis (Lyapunov), optimal control, adaptive control. Basis for engineered systems ([paixao_leveraging_2022], [khalil_precise_2015]) and understanding biological regulation ([bechtel_grounding_2021]). Relation to morphological computation [hoffmann_trade-offs_2014].
*   **Links & Relevance:**
    *   Underpins design/implementation of [[./methods.md#feedback-control-loops]]. Used to regulate [[./mechanisms.md#actuation--response-mechanisms]]. Enables robust homeostasis ([[./phenomena.md#morphogenesis--regeneration--homeostasis]]) in biological systems. Adaptive control is a form of [[./mechanisms.md#algorithmic-adaptation-learning]]. Provides framework for agent interaction with environment. Key component of [[#active-inference-fep]].

### active-matter-theory
*   **Concept ID:** `active-matter-theory` ([[./css.md#TheoreticalConceptNode]](field=Physics))
*   **Human-Readable Title:** Active Matter (Theory)
*   **Description:** Theoretical frameworks (often extending statistical mechanics or hydrodynamics) to describe systems composed of self-propelled units that consume energy and exhibit collective behaviors distinct from equilibrium systems. Focuses on emergent order, phase transitions (MIPS), and non-equilibrium dynamics. Core papers [goh_noisy_2022], roadmap [gompper_2025_2025].
*   **Links & Relevance:**
    *   Explains phenomena like [[./phenomena.md#flocking--schooling--swarming]], [[./phenomena.md#active-turbulence]].
    *   Relies on [[#statistical-mechanics--stochastic-thermodynamics]] and [[#continuum-mechanics]] (for hydrodynamic models).
    *   Describes systems made of [[./materials.md#active-matter-fluids]].
*   **Methods Used:** [[./methods.md#particle-based-modeling]], [[./methods.md#continuum-modeling]], [[./methods.md#statistical-analysis]].

### magnetic-field-theory
*   **Concept ID:** `magnetic-field-theory` ([[./css.md#TheoreticalConceptNode]](field=Physics))
*   **Human-Readable Title:** Magnetic Field Theory (Maxwell's Equations)
*   **Description:** Classical theory of electromagnetism describing magnetic fields, their generation by currents and magnetic materials, and their interaction with matter. Based on Maxwell's equations.
*   **Links & Relevance:**
    *   Underpins understanding of [[./mechanisms.md#magnetic-transduction]], magnetic [[./mechanisms.md#mechanical-actuation]].
    *   Explains properties of [[./materials.md#ferromagnetic-materials]] and behavior of [[./materials.md#ferrofluids]].
*   **Methods Used:** [[./methods.md#mathematical-analysis]], [[./methods.md#continuum-modeling]] (for field calculations).

---
