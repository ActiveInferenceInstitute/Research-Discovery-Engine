"use client";
import { ExternalLink, Github, X, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type SectionKey =
  | "coreMethodology"
  | "beyondIndividualPapers"
  | "collaboration"
  | "categoryTheory"
  | "activeInference"
  | "collaborativeEcosystem";

export default function MethodsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    coreMethodology: true,
    beyondIndividualPapers: true,
    collaboration: true,
    categoryTheory: true,
    activeInference: true,
    collaborativeEcosystem: true,
  });

  const toggleSection = (section: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl h-[80vh] p-4"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <Image
              src="/discover_mentor.png"
              alt="Discovery Mentor Methodology"
              fill
              className="object-contain invert"
              priority
            />
          </div>
        </div>
      )}

      <div className="max-w-[800px] mx-auto">
        <h1 className="text-5xl font-bold mb-8">Our Methodology</h1>
        {/* Core Methodology */}
        <section className="mb-8">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => toggleSection("coreMethodology")}
          >
            {openSections.coreMethodology ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
            <h2 className="text-3xl font-semibold mb-0 ml-2">
              A Multi-Stage, AI-Powered Approach
            </h2>
          </div>
          {openSections.coreMethodology && (
            <>
              <h3 className="text-2xl font-semibold mb-2">
                The Foundation: Deep Dive into the Scientific Literature:
              </h3>
              <h4 className="text-xl font-semibold mb-2">
                Foundation in Scientific Evidence
              </h4>
              <ul className="text-gray-300 list-disc list-inside mb-6">
                <li>
                  <strong>Automated, AI-Powered Analysis:</strong> You start by
                  feeding it a collection of research papers – your own work,
                  relevant publications, or even a broad corpus of literature.
                  Our engine performs a deep, structured analysis of each paper,
                  mimicking the critical evaluation of a seasoned peer reviewer,
                  creating a template with specific questions such that each
                  paper is distilled in the same format and the same structure.
                  This analysis is guided by sophisticated, self-evolving
                  templates rooted in statistical physics, aiming to extract the
                  core principles underlying the given concepts. The template
                  for concept definitions is iteratively updated from reading
                  each publication, such that each concept in the end is
                  represented as an embedding vector with subvectors that define
                  its more refined details. This is similar to Matryoshka nested
                  vectors.
                </li>
                <li>
                  <strong>Visualizing the Essence:</strong> For each paper, the
                  engine automatically generates a custom Mermaid diagram, where
                  parts of the concepts are represented as a logical graph with
                  the elements of Category Theory. This isn&apos;t a generic
                  illustration; it&apos;s a visual representation of the
                  specific physical concepts and their relationships as
                  described in that paper. This allows to quickly grasp the core
                  ideas and how they connect.
                </li>
                <li>
                  <strong>Quantitative Assessment:</strong> Beyond qualitative
                  analysis, the engine calculates a set of quantitative metrics,
                  providing a &quot;cognizant potential&quot; score for each
                  paper. This isn&apos;t about assigning a definitive
                  &quot;intelligence&quot; rating; it&apos;s about identifying
                  promising avenues for further exploration and self-correction
                  within the strategy of reinforcement learning.
                </li>
              </ul>
            </>
          )}
        </section>
        <div className="relative w-full aspect-[4/3] mb-8">
          <Image
            src="/ai_powered_research_platform_overview_components_grey.png"
            alt="ai powered research platform overview of components"
            fill
            className="mx-auto"
          />
        </div>

        {/* Beyond Individual Papers: Uncovering the Landscape of Knowledge */}
        <section className="mb-8">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => toggleSection("beyondIndividualPapers")}
          >
            {openSections.beyondIndividualPapers ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
            <h2 className="text-2xl font-semibold mb-0 ml-2">
              Beyond Individual Papers: Uncovering the Landscape of Knowledge
            </h2>
          </div>
          {openSections.beyondIndividualPapers && (
            <ul className="text-gray-300 list-disc list-inside mb-6">
              <li>
                <strong>Topic Modeling and Clustering:</strong> The engine uses
                advanced topic modeling (BERTopic, SciBert as a model and
                Sentence Transformers) to group papers based on semantic
                similarity (This is a first approximation, when concepts are
                extracted from text, next stage is to work directly with
                scientifically proven evidence, rather than rely on text). This
                reveals the hidden structure of the field, identifying distinct
                research areas and emerging trends. It&apos;s like creating a
                map of the intellectual landscape, where each scientific
                evidence is represented by a point, while the distances are
                various scores in hyperdimensional space.
              </li>
              <li>
                <strong>Hierarchical Relationships:</strong> We go beyond flat
                clusters. The engine uncovers hierarchical relationships between
                topics, showing how different research areas build upon each
                other or relate as sub-disciplines.
              </li>
              <li>
                <strong>Interactive Visualizations:</strong> Explore the
                research landscape through interactive visualizations:
                <ul className="list-disc list-inside ml-4">
                  <li>
                    <strong>t-SNE Plots:</strong> See how papers cluster
                    together in a 2D space, revealing their conceptual
                    proximity.
                  </li>
                  <li>
                    <strong>Intertopic Distance Maps:</strong> Understand the
                    relationships between different research areas.
                  </li>
                  <li>
                    <strong>Topic Hierarchy Diagrams:</strong> Explore the
                    hierarchical structure of the field.
                  </li>
                  <li>
                    <strong>Radar Charts:</strong> Compare the &quot;cognitive
                    potential&quot; of different research clusters across
                    various metrics.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Similarity Heatmap:</strong> Showing similarity between
                different clusters.
              </li>
              <li>
                <strong>Cluster Overlap:</strong> Showing clusters overlap in 2D
                projection.
              </li>
            </ul>
          )}
        </section>

        <div className="relative w-full aspect-video mb-8">
          <Image
            src="/ai_powered_research_analysis_process_grey.png"
            alt="ai powered research anaylsis process"
            fill
            className="mx-auto"
          />
        </div>
        {/* Collaboration */}
        <section className="mb-16">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => toggleSection("collaboration")}
          >
            {openSections.collaboration ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
            <h2 className="text-2xl font-semibold text-white mb-0 ml-2">
              Collaborative Refinement and Knowledge Co-Creation:
            </h2>
          </div>
          {openSections.collaboration && (
            <ul className="text-gray-300 list-disc list-inside ml-4">
              <li>
                <strong>Annotation and Debate:</strong> The engine isn&apos;t a
                black box. Researchers can annotate the AI&apos;s analysis,
                correcting errors, adding context, and engaging in constructive
                debate about interpretations. This is the feedback loop which is
                the basis for understanding user intentions. This is crucial for
                refining both the AI&apos;s understanding also getting into the
                community&apos;s collective knowledge.
              </li>
              <li>
                <strong>Living Templates:</strong> The analysis template itself
                is dynamic. It&apos;s constantly evolving based on user
                feedback, AI-powered suggestions, and new discoveries in the
                field. This ensures that scores of each concept are correctly
                mapped.
              </li>
              <li>
                <strong>Knowledge Synthesis:</strong> The engine doesn&apos;t
                just analyze individual papers; it synthesizes knowledge across
                the entire corpus, creating dynamic literature reviews,
                identifying open questions, and even suggesting new research
                hypotheses. In contrast to LLM random hallucinations, this
                process is directed by scores and metrics obtained from cluster
                analysis and the driving engine is Active Inference based on
                probabilities and minimization of uncertainty.
              </li>
            </ul>
          )}
        </section>

        <div className="relative w-full aspect-[9/6] mb-8">
          <Image
            src="/mapping_research_dynamics_and_collaboration_grey.png"
            alt="mapping research dynamics and collaboration"
            fill
            className="mx-auto"
          />
        </div>

        {/* Category Theory */}
        <section className="mb-16">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => toggleSection("categoryTheory")}
          >
            {openSections.categoryTheory ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
            <h2 className="text-2xl font-semibold text-white mb-0 ml-2">
              Category Theory-Inspired Generalization:
            </h2>
          </div>
          {openSections.categoryTheory && (
            <ul className="text-gray-300 list-disc list-inside ml-4">
              <li>
                <strong>Formal Representation:</strong> The analysis template
                incorporates concepts from Category Theory (CT) to provide a
                formal, abstract framework for representing material
                intelligence. This includes:
                <ul className="list-disc list-inside ml-4">
                  <li>
                    <strong>Objects:</strong> Representing physical entities or
                    concepts (e.g., energy states, memory states, material
                    components).
                  </li>
                  <li>
                    <strong>Morphisms:</strong> Representing relationships or
                    transformations between objects (e.g., energy transduction,
                    state transitions, interactions).
                  </li>
                  <li>
                    <strong>Functors:</strong> Representing mappings between
                    different categories (e.g., mapping microscopic interactions
                    to macroscopic behaviors).
                  </li>
                  <li>
                    <strong>Adjunctions:</strong> Representing relationships
                    between different levels of description (e.g., local rules
                    and global order).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Limits and Colimits:</strong> Use limits and colimits to
                reconstruct the universal model, representing stability and
                aggregation, respectively.
              </li>
              <li>
                <strong>Universal Model Construction:</strong> The CT framework
                enables the identification of universal properties and the
                construction of a universal model of material intelligence. This
                involves:
                <ul className="list-disc list-inside ml-4">
                  <li>
                    Identifying common substructures (objects and morphisms)
                    across different material systems.
                  </li>
                  <li>
                    Defining functors that map specific systems to the universal
                    model.
                  </li>
                  <li>
                    Using CT concepts (limits, colimits) to identify stable
                    states and emergent behaviors.
                  </li>
                  <li>
                    Using Graph Isomorphism Networks (GINs), part of Graph
                    Neural Networks, to check isomorphisms.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Transfer Learning:</strong> The CT framework facilitates
                transfer learning. Knowledge gained from analyzing one system
                can be transferred to others, even with different physical
                implementations, by identifying isomorphic structures and
                mapping between them.
              </li>
            </ul>
          )}
        </section>
        {/* Active Inference */}
        <section className="mb-16">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => toggleSection("activeInference")}
          >
            {openSections.activeInference ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
            <h2 className="text-2xl font-semibold text-white mb-0 ml-2">
              Active Inference as a Driver for Exploration:
            </h2>
          </div>
          {openSections.activeInference && (
            <ul className="text-gray-300 list-disc list-inside ml-4">
              <li>
                <strong>Uncertainty Minimization:</strong> The platform is
                designed to minimize uncertainty and maximize understanding
                through:
                <ul className="list-disc list-inside ml-4">
                  <li>Iterative template refinement.</li>
                  <li>AI-powered suggestions for new research directions.</li>
                  <li>
                    Targeted exploration of the knowledge graph based on user
                    intentions.
                  </li>
                </ul>
              </li>
              <li>
                <strong>User Intent Modeling:</strong> The system captures user
                intentions through:
                <ul className="list-disc list-inside ml-4">
                  <li>Explicit queries and search terms.</li>
                  <li>Selection of papers and concepts of interest.</li>
                  <li>Annotations and feedback.</li>
                  <li>Stated research goals.</li>
                </ul>
              </li>
              <li>
                <strong>Recommendation Engine:</strong> A recommendation engine,
                guided by active inference, suggests:
                <ul className="list-disc list-inside ml-4">
                  <li>Relevant papers and clusters.</li>
                  <li>Potential collaborators.</li>
                  <li>Missing information or gaps in knowledge.</li>
                  <li>Alternative research pathways.</li>
                </ul>
              </li>
              <li>
                <strong>Hypothesis Generation:</strong> The platform combines
                information from existing literature to generate novel research
                hypotheses.
              </li>
              <li>
                <strong>User-Driven Exploration:</strong> The researcher is an
                active agent within the ecosystem. Questions, feedback, and
                annotations guide the AI&apos;s analysis and shape the evolution
                of the platform.
              </li>
            </ul>
          )}
        </section>
        {/* A Collaborative Ecosystem for discovery (DeSci dynamic groups) */}
        <section className="mb-16">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => toggleSection("collaborativeEcosystem")}
          >
            {openSections.collaborativeEcosystem ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
            <h2 className="text-2xl font-semibold text-white mb-0 ml-2">
              A Collaborative Ecosystem for discovery (DeSci dynamic groups):
            </h2>
          </div>
          {openSections.collaborativeEcosystem && (
            <ul className="text-gray-300 list-disc list-inside ml-4">
              <li>
                <strong>
                  Skill-Based Matching (in contrast to title-based):
                </strong>{" "}
                The engine analyzes user profiles, including their research
                interests, publications, annotations, and contributions to the
                platform. This information is used to create automatically a
                &quot;skill profile&quot; for each user.
              </li>
              <li>
                <strong>Project-Based Groups:</strong> When a new research
                project or challenge is initiated (either by a user or suggested
                by the AI), the engine automatically identifies potential
                collaborators based on:
                <ul className="list-disc list-inside ml-4">
                  <li>
                    <strong>Complementary Skills:</strong> The system seeks
                    users with skills and expertise that complement the
                    project&apos;s needs.
                  </li>
                  <li>
                    <strong>Shared Interests:</strong> The system identifies
                    users who have expressed interest in related topics or
                    worked on similar papers.
                  </li>
                  <li>
                    <strong>&quot;Research Neighborhoods&quot;:</strong> The
                    system leverages the concept of &quot;research
                    neighborhoods&quot; to connect users who are exploring
                    similar areas of the knowledge landscape.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Dynamic Reconfiguration:</strong> Groups are not static.
                As a project evolves, the engine can suggest adding new members
                with relevant expertise or removing members whose skills are no
                longer needed or users becoming inactive. This ensures that
                groups remain agile and responsive to changing fields.
              </li>
              <li>
                <strong>Swarm Intelligence Integration:</strong> The platform
                facilitates the formation of dynamic groups inspired by swarm
                intelligence principles. Users with complementary skills can be
                algorithmically grouped to tackle specific challenges, mimicking
                the collaborative problem-solving seen in natural swarms.
              </li>
            </ul>
          )}
        </section>

        {/* Key Components */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Key Components</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Educational Platform */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 hover:bg-gray-800/70 transition-colors">
              <h3 className="text-2xl font-semibold mb-4">
                Educational Platform
              </h3>
              <p className="text-gray-300 mb-6">
                provides a proven framework for designing effective and
                accessible learning experiences
              </p>
              <a
                href="https://github.com/ActiveInferenceInstitute/Start"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300"
              >
                <Github className="w-5 h-5" />
                <span>View Repository</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            {/* Community Building and Event Infrastructure */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 hover:bg-gray-800/70 transition-colors">
              <h3 className="text-2xl font-semibold mb-4">
                Community Building and Event Infrastructure
              </h3>
              <p className="text-gray-300 mb-6">
                provides a strong foundation for building collaborative
                ecosystem. We will extend these proven methodologies to create a
                interconnected research community within the platform.
              </p>
              <a
                href="https://github.com/ActiveInferenceInstitute/Symposium"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300"
              >
                <Github className="w-5 h-5" />
                <span>View Repository</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            {/* Research Methodologies */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 hover:bg-gray-800/70 transition-colors">
              <h3 className="text-2xl font-semibold mb-4">
                Research Methodologies
              </h3>
              <p className="text-gray-300 mb-6">
                Our ongoing development of AI-powered research methodologies,
                including FieldSHIFT-2 and the IntelliDE framework, directly
                informs the architecture and functionalities of the platform.
              </p>
              <a
                href="https://github.com/ActiveInferenceInstitute/Active_InferAnts/tree/54330ff2658d1b3b80708536e4a9db744c8cf585/1_PREPARE/Methods/Research/FieldSHIFT-2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300"
              >
                <Github className="w-5 h-5" />
                <span>View FieldSHIFT-2 Repository</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/vbaulin/IntelliDE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300"
              >
                <Github className="w-5 h-5" />
                <span>View InelliDE Repository</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            {/* Mulit-Agent Real-World Applications */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 hover:bg-gray-800/70 transition-colors">
              <h3 className="text-2xl font-semibold mb-4">
                Mulit-Agent Real-World Applications
              </h3>
              <p className="text-gray-300 mb-6">
                demonstrates the versatility and adaptability of our core
                methodologies and our commitment to translating innovative AI
                approaches into practical, impactful solutions.
              </p>
              <a
                href="https://zenodo.org/records/13754586"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300"
              >
                <span>View Publication</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            {/* Diffusion of Thoughts */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 hover:bg-gray-800/70 transition-colors">
              <h3 className="text-2xl font-semibold mb-4">
                Diffusion of Thoughts
              </h3>
              <p className="text-gray-300 mb-6">
                An example of our ongoing development of AI-powered research
                methodologies. This repository integrates diffusion models and
                Chain-of-Thought (CoT) technique to improve the reasoning
                ability in autoregressive language models.
              </p>
              <a
                href="https://github.com/Alignment-Lab-AI/diffusion-of-thoughts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300"
              >
                <Github className="w-5 h-5" />
                <span>View Diffusion of thoughts Repository</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Project Development</h2>
          <div className="aspect-video w-full md:w-1/2 mx-auto bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/ed9iSi4cD3o"
              title="Project Overview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      </div>
    </div>
  );
}
