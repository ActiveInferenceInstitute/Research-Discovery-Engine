/**
 * Enhanced Field Exploration Step Component
 * 
 * Incorporates comprehensive terminology and definitions from the Discovery Engine research.
 * Features interactive term definitions, contextual explanations, and enhanced UX.
 */

import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  Network, 
  TrendingUp, 
  Search,
  Filter,
  Eye,
  Brain,
  Zap,
  Activity,
  Target,
  Info,
  BookOpen,
  Lightbulb,
  HelpCircle
} from 'lucide-react';
import { GraphData, NodeObject } from '../../types';
import { TerminologyService, Term } from '../../utils/terminology';

interface FieldExplorationStepProps {
  onNext: () => void;
  graphData: GraphData | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

// Enhanced terminology-aware research communities
const RESEARCH_COMMUNITIES = [
  {
    id: 'neuromorphic',
    name: 'Neuromorphic Hardware',
    size: 45,
    color: '#8B5CF6',
    description: 'Brain-inspired electronic hardware and computing systems',
    keyTerms: ['neuromorphic-computation', 'memristors', 'synaptic-plasticity'],
    relatedTerminology: ['knowledge_graph', 'network_centrality'],
    keyTopics: ['memristors', 'nanowires', 'synaptic-plasticity', 'neuromorphic-chips'],
    icon: Brain,
    conceptualFramework: 'Physical implementation of computational intelligence in neural-inspired architectures'
  },
  {
    id: 'soft-intelligence', 
    name: 'Soft Physical Intelligence',
    size: 38,
    color: '#10B981',
    description: 'Intelligence emerging from soft, deformable materials and embodied cognition',
    keyTerms: ['physical-embodied-computation', 'mechanical-actuation', 'collective-intelligence'],
    relatedTerminology: ['conceptual_ecology', 'active_inference_agents'],
    keyTopics: ['soft-robotics', 'hydrogels', 'embodied-intelligence', 'mechanical-metamaterials'],
    icon: Activity,
    conceptualFramework: 'Material-based intelligence through physical computation and embodied cognition'
  },
  {
    id: 'active-matter',
    name: 'Active Matter Physics', 
    size: 32,
    color: '#F59E0B',
    description: 'Self-organizing systems and collective behaviors in non-equilibrium systems',
    keyTerms: ['free_energy_minimization', 'statistical-mechanics', 'community_detection'],
    relatedTerminology: ['cooccurrence_network', 'bayesian_embedding_updates'],
    keyTopics: ['self-organization', 'collective-behavior', 'dissipative-systems', 'swarm-intelligence'],
    icon: Zap,
    conceptualFramework: 'Emergent collective intelligence in driven, self-organizing material systems'
  },
  {
    id: 'knowledge-synthesis',
    name: 'Knowledge Synthesis & Discovery',
    size: 28, 
    color: '#EF4444',
    description: 'AI-driven knowledge extraction and synthesis methodologies',
    keyTerms: ['conceptual_nexus_model', 'knowledge_artifact', 'distillation_template'],
    relatedTerminology: ['probabilistic_knowledge_gap_engine', 'causal_trajectory_synthesis'],
    keyTopics: ['knowledge-graphs', 'ai-synthesis', 'research-discovery', 'hypothesis-generation'],
    icon: Target,
    conceptualFramework: 'Computational approaches to scientific knowledge discovery and synthesis'
  }
];

const FieldExplorationStep: React.FC<FieldExplorationStepProps> = ({
  onNext,
  graphData,
  searchQuery,
  onSearchChange
}) => {
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'communities' | 'archetypes' | 'terminology'>('communities');
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [showTermDefinition, setShowTermDefinition] = useState(false);

  // Get terminology for this step
  const stepTerms = useMemo(() => TerminologyService.getTermsForStep('explore'), []);
  const foundationalTerms = useMemo(() => TerminologyService.getFoundationalTerms(), []);
  const archetypes = useMemo(() => TerminologyService.getArchetypes(), []);

  // Calculate actual statistics from graph data
  const statistics = useMemo(() => {
    if (!graphData) return { nodes: 0, connections: 0, domains: 6, terminology: stepTerms.length };
    
    return {
      nodes: graphData.nodes.length,
      connections: graphData.links.length,
      domains: new Set(graphData.nodes.map(node => node.category || node.type)).size,
      terminology: stepTerms.length
    };
  }, [graphData, stepTerms]);

  // Filter communities based on search
  const filteredCommunities = useMemo(() => {
    if (!searchQuery) return RESEARCH_COMMUNITIES;
    return RESEARCH_COMMUNITIES.filter(community =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.keyTopics.some(topic => 
        topic.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      community.keyTerms.some(term => 
        term.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  // Filter terms based on search
  const filteredTerms = useMemo(() => {
    if (!searchQuery) return stepTerms;
    return TerminologyService.searchTerms(searchQuery);
  }, [searchQuery, stepTerms]);

  const handleTermClick = (term: Term) => {
    setSelectedTerm(term);
    setShowTermDefinition(true);
  };

  const renderTermDefinitionModal = () => {
    if (!selectedTerm || !showTermDefinition) return null;

    const formattedTerm = TerminologyService.formatTermForDisplay(selectedTerm);
    const termWithContext = TerminologyService.getTermWithContext(selectedTerm.id);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{formattedTerm.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${formattedTerm.badgeColor}`}>
                    {formattedTerm.badge}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{formattedTerm.subtitle}</p>
                <p className="text-gray-300">{selectedTerm.detailed_description}</p>
              </div>
              <button 
                onClick={() => setShowTermDefinition(false)}
                className="text-gray-400 hover:text-white p-2"
              >
                ×
              </button>
            </div>

            {termWithContext && (
              <>
                {/* Usage Examples */}
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Usage in Discovery Engine</h4>
                  <div className="space-y-2">
                    {termWithContext.usageExamples.map((example, i) => (
                      <div key={i} className="flex items-start space-x-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                        <span>{example}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Terms */}
                {termWithContext.relatedTerms.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Related Concepts</h4>
                    <div className="flex flex-wrap gap-2">
                      {termWithContext.relatedTerms.map((relatedTerm) => (
                        <button
                          key={relatedTerm.id}
                          onClick={() => handleTermClick(relatedTerm)}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
                        >
                          {relatedTerm.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                {selectedTerm.links.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-2">References</h4>
                    <div className="space-y-1">
                      {selectedTerm.links.map((link, i) => (
                        <div key={i} className="text-sm text-blue-400">
                          {link}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCommunityCard = (community: typeof RESEARCH_COMMUNITIES[0]) => (
    <div 
      key={community.id}
      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        selectedCommunity === community.id 
          ? 'border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-500/25' 
          : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
      }`}
      onClick={() => setSelectedCommunity(
        selectedCommunity === community.id ? null : community.id
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: community.color + '20', border: `2px solid ${community.color}` }}
          >
            <community.icon className="w-6 h-6" style={{ color: community.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">{community.name}</h3>
            <p className="text-gray-400 text-sm">{community.size} concepts</p>
          </div>
        </div>
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: community.color }}
        />
      </div>
      
      <p className="text-gray-300 text-sm mb-3">{community.description}</p>
      <p className="text-gray-400 text-xs mb-4 italic">{community.conceptualFramework}</p>
      
      {selectedCommunity === community.id && (
        <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
          <div>
            <h4 className="text-white font-medium mb-3">Key Topics:</h4>
            <div className="flex flex-wrap gap-2">
              {community.keyTopics.map((topic, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-3">Core Terminology:</h4>
            <div className="flex flex-wrap gap-2">
              {community.relatedTerminology.map((termId, i) => {
                const term = TerminologyService.getTerm(termId);
                if (!term) return null;
                
                return (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTermClick(term);
                    }}
                    className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-xs hover:bg-blue-800/50 transition-colors flex items-center space-x-1"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>{term.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderArchetypeCard = (archetype: any, key: string) => (
    <div 
      key={key}
      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        selectedArchetype === key 
          ? 'border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-500/25' 
          : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
      }`}
      onClick={() => setSelectedArchetype(selectedArchetype === key ? null : key)}
    >
      <div className={`mb-4 ${
        archetype.color === 'purple' ? 'text-purple-400' :
        archetype.color === 'blue' ? 'text-blue-400' :
        archetype.color === 'green' ? 'text-green-400' :
        'text-gray-400'
      }`}>
        <h3 className="font-semibold text-lg mb-2">{archetype.name}</h3>
        <p className="text-sm text-gray-400 mb-3">{archetype.description}</p>
        
        {/* Characteristics */}
        <div className="flex flex-wrap gap-1 mb-3">
          {archetype.characteristics.map((char: string, i: number) => (
            <span 
              key={i}
              className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs"
            >
              {char}
            </span>
          ))}
        </div>
      </div>
      
      {selectedArchetype === key && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h4 className="text-white font-medium mb-3">Examples:</h4>
          <div className="space-y-2">
            {archetype.examples.slice(0, 3).map((concept: string, i: number) => (
              <div 
                key={i}
                className={`p-2 rounded text-xs ${
                  archetype.color === 'purple' ? 'bg-purple-900/30 text-purple-300' :
                  archetype.color === 'blue' ? 'bg-blue-900/30 text-blue-300' :
                  archetype.color === 'green' ? 'bg-green-900/30 text-green-300' :
                  'bg-gray-700/30 text-gray-300'
                }`}
              >
                {concept}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTerminologyView = () => (
    <div className="bg-gray-800 rounded-xl p-8">
      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
        <BookOpen className="w-6 h-6 mr-3 text-green-400" />
        Discovery Engine Terminology
      </h2>
      <p className="text-gray-400 mb-6">
        Explore the comprehensive terminology underlying the Discovery Engine framework, 
        from novel innovations to established concepts from various disciplines.
      </p>

      {/* Foundational Terms */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Foundational Concepts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {foundationalTerms.map((term) => {
            const formatted = TerminologyService.formatTermForDisplay(term);
            return (
              <button
                key={term.id}
                onClick={() => handleTermClick(term)}
                className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-white">{formatted.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${formatted.badgeColor}`}>
                    {formatted.badge}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">{formatted.subtitle}</p>
                <p className="text-gray-300 text-sm line-clamp-2">{formatted.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Results or All Terms */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          {searchQuery ? `Search Results (${filteredTerms.length})` : `All Terms (${stepTerms.length})`}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(searchQuery ? filteredTerms : stepTerms).map((term) => {
            const formatted = TerminologyService.formatTermForDisplay(term);
            return (
              <button
                key={term.id}
                onClick={() => handleTermClick(term)}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-white text-sm">{formatted.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${formatted.badgeColor}`}>
                    {formatted.badge}
                  </span>
                </div>
                <p className="text-gray-300 text-xs line-clamp-2">{formatted.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Field Exploration</h1>
        <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
          Discover the research landscape of Material Intelligence through our <strong>Conceptual Ecology</strong> — 
          a structured map of domain concepts and their interrelationships, powered by comprehensive terminology 
          from the Discovery Engine research framework.
        </p>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">{statistics.nodes}</div>
          <div className="text-gray-300">Research Concepts</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">{statistics.connections}</div>
          <div className="text-gray-300">Knowledge Links</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">{statistics.domains}</div>
          <div className="text-gray-300">Research Domains</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-orange-400 mb-2">{statistics.terminology}</div>
          <div className="text-gray-300">Defined Terms</div>
        </div>
      </div>

      {/* Enhanced Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search communities, topics, or terminology..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('communities')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'communities' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Network className="w-4 h-4 inline mr-2" />
            Communities
          </button>
          <button
            onClick={() => setViewMode('archetypes')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'archetypes' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Archetypes
          </button>
          <button
            onClick={() => setViewMode('terminology')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'terminology' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Terminology
          </button>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'communities' ? (
        <div className="bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <Network className="w-6 h-6 mr-3 text-blue-400" />
            Research Communities
          </h2>
          <p className="text-gray-400 mb-6">
            Thematic clusters identified through <strong>Community Detection</strong> algorithms and 
            <strong>Network Centrality</strong> analysis of the knowledge graph. Each community represents 
            a distinct research ecosystem with shared conceptual foundations.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCommunities.map(renderCommunityCard)}
          </div>
        </div>
      ) : viewMode === 'archetypes' ? (
        <div className="bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
            Innovation Archetypes
          </h2>
          <p className="text-gray-400 mb-6">
            Strategic classification of concepts based on their influence and interdisciplinary reach, 
            derived from <strong>Network Centrality</strong> measures and <strong>Co-occurrence Analysis</strong>. 
            Each archetype represents a different role in the innovation ecosystem.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(archetypes).map(([key, archetype]) => 
              renderArchetypeCard(archetype, key)
            )}
          </div>
        </div>
      ) : (
        renderTerminologyView()
      )}

      {/* Next Step Button */}
      <div className="flex justify-center pt-8">
        <button 
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl flex items-center space-x-3 transition-colors text-lg font-medium shadow-lg hover:shadow-xl"
        >
          <span>Begin Discovery</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Term Definition Modal */}
      {renderTermDefinitionModal()}
    </div>
  );
};

export default FieldExplorationStep;