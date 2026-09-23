/**
 * Summary Generator Utility
 * 
 * Generates comprehensive summaries from concept design states and related knowledge.
 * Can be used both as a standalone utility and integrated into the main framework.
 */

import { ConceptDesignState, NodeObject, GraphData } from '../types';

/**
 * Summary generation configuration
 */
interface SummaryConfig {
  includeComponents: boolean;
  includeRelatedWork: boolean;
  includeRecommendations: boolean;
  summaryLength: 'brief' | 'standard' | 'comprehensive';
  outputFormat: 'markdown' | 'json' | 'text';
  technicalLevel: 'general' | 'technical' | 'expert';
}

/**
 * Default summary configuration
 */
const DEFAULT_CONFIG: SummaryConfig = {
  includeComponents: true,
  includeRelatedWork: true,
  includeRecommendations: true,
  summaryLength: 'standard',
  outputFormat: 'markdown',
  technicalLevel: 'technical'
};

/**
 * Summary section interface
 */
interface SummarySection {
  title: string;
  content: string[];
  priority: 'high' | 'medium' | 'low';
}

/**
 * Generated summary interface
 */
interface GeneratedSummary {
  title: string;
  abstract: string;
  conceptId: string;
  timestamp: string;
  sections: SummarySection[];
  metadata: {
    wordCount: number;
    readingTime: string;
    complexity: 'low' | 'medium' | 'high';
    completeness: number;
    keywords: string[];
    relatedConcepts: string[];
  };
}

/**
 * Generate a comprehensive concept summary from design state
 */
export const generateSummary = (
  conceptState: ConceptDesignState,
  graphData?: GraphData,
  config: SummaryConfig = DEFAULT_CONFIG
): GeneratedSummary => {
  const { objective, components } = conceptState;
  
  // Generate abstract first
  const abstract = generateAbstract(conceptState, config);
  
  // Extract keywords
  const keywords = extractSummaryKeywords(conceptState, graphData);
  
  // Find related concepts
  const relatedConcepts = findRelatedConcepts(conceptState, graphData);
  
  const summary: GeneratedSummary = {
    title: `Concept Summary: ${objective}`,
    abstract,
    conceptId: conceptState.id,
    timestamp: new Date().toISOString(),
    sections: [],
    metadata: {
      wordCount: 0,
      readingTime: '',
      complexity: determineComplexity(conceptState, config),
      completeness: calculateCompleteness(conceptState),
      keywords,
      relatedConcepts
    }
  };

  // Generate sections based on config
  summary.sections = generateSummarySections(conceptState, graphData, config);

  // Calculate final metadata
  summary.metadata.wordCount = calculateWordCount(summary);
  summary.metadata.readingTime = estimateReadingTime(summary.metadata.wordCount);

  return summary;
};

/**
 * Generate abstract for the concept
 */
const generateAbstract = (
  conceptState: ConceptDesignState,
  config: SummaryConfig
): string => {
  const { objective, components, cssVectorDraft } = conceptState;
  const css = cssVectorDraft || {};
  
  let abstract = `This concept focuses on ${objective || 'a novel scientific approach'}.`;
  
  // Add component information
  if (components.materials.length > 0) {
    abstract += ` The design incorporates ${components.materials.length === 1 ? 'the material' : 'materials including'} ${components.materials.slice(0, 3).join(', ')}${components.materials.length > 3 ? ', and others' : ''}.`;
  }
  
  if (components.mechanisms.length > 0) {
    abstract += ` Key mechanisms involve ${components.mechanisms.slice(0, 2).join(' and ')}.`;
  }
  
  // Add objective information
  if (css.constraints?.objective_type) {
    abstract += ` The primary objective is ${css.constraints.objective_type}.`;
  }
  
  // Add validation status
  if (conceptState.status === 'Validated') {
    abstract += ' The concept has undergone initial validation.';
  } else if (conceptState.protocolOutline) {
    abstract += ' An experimental protocol has been developed for validation.';
  }
  
  return abstract;
};

/**
 * Generate summary sections based on configuration
 */
const generateSummarySections = (
  conceptState: ConceptDesignState,
  graphData?: GraphData,
  config: SummaryConfig
): SummarySection[] => {
  const sections: SummarySection[] = [];

  // 1. Concept Overview (always included)
  sections.push(generateOverviewSection(conceptState, config));

  // 2. Components Section
  if (config.includeComponents) {
    sections.push(generateComponentsSection(conceptState, config));
  }

  // 3. Technical Details Section
  if (config.technicalLevel !== 'general') {
    sections.push(generateTechnicalSection(conceptState, config));
  }

  // 4. Related Work Section
  if (config.includeRelatedWork && graphData) {
    sections.push(generateRelatedWorkSection(conceptState, graphData, config));
  }

  // 5. Recommendations Section
  if (config.includeRecommendations) {
    sections.push(generateRecommendationsSection(conceptState, config));
  }

  return sections;
};

/**
 * Generate concept overview section
 */
const generateOverviewSection = (
  conceptState: ConceptDesignState,
  config: SummaryConfig
): SummarySection => {
  const { objective, components, cssVectorDraft } = conceptState;
  const css = cssVectorDraft || {};
  
  const content: string[] = [
    `**Concept ID:** ${conceptState.id}`,
    `**Objective:** ${objective || 'To be defined'}`,
    `**Current Status:** ${conceptState.status || 'In Development'}`,
    ''
  ];

  if (css.constraints?.objective_type) {
    content.push(`**Primary Goal:** ${css.constraints.objective_type}`);
  }

  // Add brief description based on components
  if (components.materials.length > 0 || components.mechanisms.length > 0) {
    content.push('', '**Concept Description:**');
    content.push(`This concept ${objective ? 'aims to ' + objective.toLowerCase() : 'represents a novel approach'} through the integration of specific materials and mechanisms.`);
    
    if (css.context?.environment_type) {
      content.push(`The system operates in a ${css.context.environment_type} environment.`);
    }
  }

  // Add novelty assessment
  content.push('', '**Innovation Aspects:**');
  if (components.materials.length > 1 && components.mechanisms.length > 0) {
    content.push('- Novel combination of materials and mechanisms');
  }
  if (css.adaptation?.mechanism_primary?.length) {
    content.push('- Incorporation of adaptive capabilities');
  }
  if (css.memory?.mechanism_primary?.length) {
    content.push('- Integration of memory mechanisms');
  }
  if (content[content.length - 1].startsWith('**Innovation')) {
    content.push('- Systematic approach to concept development');
  }

  return {
    title: 'Concept Overview',
    content,
    priority: 'high'
  };
};

/**
 * Generate components section
 */
const generateComponentsSection = (
  conceptState: ConceptDesignState,
  config: SummaryConfig
): SummarySection => {
  const { components } = conceptState;
  
  const content: string[] = [];

  // Materials subsection
  if (components.materials.length > 0) {
    content.push('### Materials');
    components.materials.forEach((material: string) => {
      content.push(`- **${material}**`);
    });
    content.push('');
  }

  // Mechanisms subsection
  if (components.mechanisms.length > 0) {
    content.push('### Mechanisms');
    components.mechanisms.forEach((mechanism: string) => {
      content.push(`- **${mechanism}**`);
    });
    content.push('');
  }

  // Methods subsection
  if (components.methods && components.methods.length > 0) {
    content.push('### Methods');
    components.methods.forEach((method: string) => {
      content.push(`- **${method}**`);
    });
    content.push('');
  }

  // Theoretical concepts
  if (components.theoretical_concepts && components.theoretical_concepts.length > 0) {
    content.push('### Theoretical Foundation');
    components.theoretical_concepts.forEach((concept: string) => {
      content.push(`- **${concept}**`);
    });
    content.push('');
  }

  if (content.length === 0) {
    content.push('Components are still being defined for this concept.');
  }

  return {
    title: 'Component Analysis',
    content,
    priority: 'high'
  };
};

/**
 * Generate technical details section
 */
const generateTechnicalSection = (
  conceptState: ConceptDesignState,
  config: SummaryConfig
): SummarySection => {
  const { cssVectorDraft } = conceptState;
  const css = cssVectorDraft || {};
  
  const content: string[] = [];

  // System architecture
  if (css.context || css.interface || css.dynamics) {
    content.push('### System Architecture');
    
    if (css.context?.morphology_type) {
      content.push(`- **Morphology:** ${css.context.morphology_type} (Scale: ${css.context.morphology_scale || 'TBD'})`);
    }
    
    if (css.context?.fabrication_primary?.length) {
      content.push(`- **Fabrication:** ${css.context.fabrication_primary.join(', ')}`);
    }
    
    if (css.interface?.input_mechanism?.length || css.interface?.output_mechanism?.length) {
      content.push('- **Interface:**');
      if (css.interface.input_mechanism?.length) {
        content.push(`  - Input: ${css.interface.input_mechanism.join(', ')}`);
      }
      if (css.interface.output_mechanism?.length) {
        content.push(`  - Output: ${css.interface.output_mechanism.join(', ')}`);
      }
    }
    
    content.push('');
  }

  // Operational parameters
  if (css.state || css.memory || css.adaptation) {
    content.push('### Operational Parameters');
    
    if (css.state?.basis?.length) {
      content.push(`- **State Basis:** ${css.state.basis.join(', ')}`);
    }
    
    if (css.memory?.mechanism_primary?.length) {
      content.push(`- **Memory System:** ${css.memory.mechanism_primary.join(', ')}`);
      if (css.memory.timescale_retention) {
        content.push(`  - Retention: ${css.memory.timescale_retention}`);
      }
      if (css.memory.capacity_estimate) {
        content.push(`  - Capacity: ${css.memory.capacity_estimate}`);
      }
    }
    
    if (css.adaptation?.mechanism_primary?.length) {
      content.push(`- **Adaptation:** ${css.adaptation.mechanism_primary.join(', ')}`);
      if (css.adaptation.timescale) {
        content.push(`  - Timescale: ${css.adaptation.timescale}`);
      }
    }
    
    content.push('');
  }

  if (content.length === 0) {
    content.push('Technical specifications are being developed.');
  }

  return {
    title: 'Technical Specifications',
    content,
    priority: 'medium'
  };
};

/**
 * Generate related work section
 */
const generateRelatedWorkSection = (
  conceptState: ConceptDesignState,
  graphData: GraphData,
  config: SummaryConfig
): SummarySection => {
  const content: string[] = [];
  
  // Find related nodes based on components
  const relatedNodes = findRelatedNodes(conceptState, graphData);
  
  if (relatedNodes.length > 0) {
    content.push('### Related Concepts and Research');
    
    // Group by type
    const groupedNodes = groupNodesByType(relatedNodes);
    
    Object.entries(groupedNodes).forEach(([type, nodes]) => {
      if (nodes.length > 0) {
        content.push(``, `#### ${type}s`);
        nodes.slice(0, 5).forEach((node: NodeObject) => {
          content.push(`- **${node.label || node.id}**`);
          if (node.description && config.summaryLength !== 'brief') {
            const desc = node.description.substring(0, 150);
            content.push(`  ${desc}${desc.length < node.description.length ? '...' : ''}`);
          }
        });
      }
    });
  }

  if (content.length === 0) {
    content.push('Related work analysis pending completion of knowledge base integration.');
  }

  return {
    title: 'Related Work',
    content,
    priority: 'medium'
  };
};

/**
 * Generate recommendations section
 */
const generateRecommendationsSection = (
  conceptState: ConceptDesignState,
  config: SummaryConfig
): SummarySection => {
  const content: string[] = [];
  const { components, cssVectorDraft, status } = conceptState;
  const css = cssVectorDraft || {};

  content.push('### Next Steps');

  // Development recommendations
  if (components.materials.length === 0) {
    content.push('- **Material Selection:** Define specific materials for implementation');
  }

  if (components.mechanisms.length === 0) {
    content.push('- **Mechanism Definition:** Specify key operational mechanisms');
  }

  if (!css.interface?.input_mechanism?.length) {
    content.push('- **Input Interface:** Define input mechanisms for system control');
  }

  if (!css.interface?.output_mechanism?.length) {
    content.push('- **Output Interface:** Specify measurement and monitoring approaches');
  }

  if (!conceptState.protocolOutline) {
    content.push('- **Validation Protocol:** Develop experimental validation procedures');
  }

  // Research recommendations
  content.push('', '### Research Directions');
  content.push('- **Literature Review:** Conduct comprehensive review of related work');
  content.push('- **Collaboration Opportunities:** Identify potential research partnerships');

  return {
    title: 'Recommendations',
    content,
    priority: 'high'
  };
};

/**
 * Extract keywords from concept state
 */
const extractSummaryKeywords = (
  conceptState: ConceptDesignState,
  graphData?: GraphData
): string[] => {
  const keywords = new Set<string>();

  // Add from objective
  if (conceptState.objective) {
    conceptState.objective.split(/\s+/).forEach((word: string) => {
      if (word.length > 3 && !isCommonWord(word)) {
        keywords.add(word.toLowerCase());
      }
    });
  }

  // Add from components
  conceptState.components.materials.forEach((material: string) => keywords.add(material));
  conceptState.components.mechanisms.forEach((mechanism: string) => keywords.add(mechanism));
  
  if (conceptState.components.methods) {
    conceptState.components.methods.forEach((method: string) => keywords.add(method));
  }

  return Array.from(keywords).slice(0, 10);
};

/**
 * Find related concepts in the graph
 */
const findRelatedConcepts = (
  conceptState: ConceptDesignState,
  graphData?: GraphData
): string[] => {
  if (!graphData) return [];

  const relatedNodes = findRelatedNodes(conceptState, graphData);
  return relatedNodes
    .filter((node: NodeObject) => node.type === 'Concept' || node.type === 'KnowledgeArtifactNode')
    .map((node: NodeObject) => node.label || node.id)
    .slice(0, 5);
};

/**
 * Find related nodes in the graph based on concept components
 */
const findRelatedNodes = (
  conceptState: ConceptDesignState,
  graphData: GraphData
): NodeObject[] => {
  const componentIds = [
    ...conceptState.components.materials,
    ...conceptState.components.mechanisms,
    ...(conceptState.components.methods || [])
  ];

  const relatedNodes: NodeObject[] = [];
  const addedIds = new Set<string>();

  // Find direct matches
  componentIds.forEach((componentId: string) => {
    const node = graphData.nodes.find((n: NodeObject) => n.id === componentId);
    if (node && !addedIds.has(node.id)) {
      relatedNodes.push(node);
      addedIds.add(node.id);
    }
  });

  return relatedNodes.slice(0, 10);
};

/**
 * Group nodes by type
 */
const groupNodesByType = (nodes: NodeObject[]): Record<string, NodeObject[]> => {
  const groups: Record<string, NodeObject[]> = {};
  
  nodes.forEach((node: NodeObject) => {
    const type = node.type || 'Unknown';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(node);
  });

  return groups;
};

/**
 * Utility functions
 */
const isCommonWord = (word: string): boolean => {
  const commonWords = ['the', 'and', 'for', 'with', 'this', 'that', 'from', 'they', 'have', 'been'];
  return commonWords.includes(word.toLowerCase());
};

const determineComplexity = (
  conceptState: ConceptDesignState,
  config: SummaryConfig
): 'low' | 'medium' | 'high' => {
  let complexity = 0;
  
  complexity += conceptState.components.materials.length;
  complexity += conceptState.components.mechanisms.length * 2;
  complexity += (conceptState.components.methods?.length || 0);
  
  const css = conceptState.cssVectorDraft || {};
  if (css.adaptation?.mechanism_primary?.length) complexity += 3;
  if (css.memory?.mechanism_primary?.length) complexity += 3;

  if (complexity <= 3) return 'low';
  if (complexity <= 8) return 'medium';
  return 'high';
};

const calculateCompleteness = (conceptState: ConceptDesignState): number => {
  let score = 0;
  const maxScore = 10;

  if (conceptState.objective) score += 2;
  if (conceptState.components.materials.length > 0) score += 2;
  if (conceptState.components.mechanisms.length > 0) score += 2;
  if (conceptState.protocolOutline) score += 2;
  if (conceptState.status === 'Validated') score += 1;
  
  const css = conceptState.cssVectorDraft || {};
  if (css.interface?.input_mechanism?.length) score += 0.5;
  if (css.interface?.output_mechanism?.length) score += 0.5;

  return Math.round((score / maxScore) * 100);
};

const calculateWordCount = (summary: GeneratedSummary): number => {
  let words = summary.abstract.split(/\s+/).length;
  
  summary.sections.forEach((section: SummarySection) => {
    section.content.forEach((line: string) => {
      words += line.split(/\s+/).filter((word: string) => word.length > 0).length;
    });
  });

  return words;
};

const estimateReadingTime = (wordCount: number): string => {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
};

/**
 * Format summary as markdown
 */
export const formatSummaryAsMarkdown = (summary: GeneratedSummary): string => {
  let markdown = `# ${summary.title}\n\n`;
  
  // Add metadata
  markdown += `**Generated:** ${new Date(summary.timestamp).toLocaleString()}\n`;
  markdown += `**Reading Time:** ${summary.metadata.readingTime}\n`;
  markdown += `**Complexity:** ${summary.metadata.complexity}\n`;
  markdown += `**Completeness:** ${summary.metadata.completeness}%\n\n`;

  // Add abstract
  markdown += `## Abstract\n\n${summary.abstract}\n\n`;

  // Add keywords
  if (summary.metadata.keywords.length > 0) {
    markdown += `**Keywords:** ${summary.metadata.keywords.join(', ')}\n\n`;
  }

  // Add sections
  summary.sections.forEach((section: SummarySection) => {
    markdown += `## ${section.title}\n\n`;
    
    section.content.forEach((line: string) => {
      markdown += line ? `${line}\n` : '\n';
    });
    
    markdown += '\n';
  });

  return markdown;
};

/**
 * Create standalone summary generation function
 */
export const createStandaloneSummary = (
  conceptData: Partial<ConceptDesignState>,
  graphData?: GraphData,
  options: Partial<SummaryConfig> = {}
): { summary: GeneratedSummary; markdown: string } => {
  const conceptState: ConceptDesignState = {
    id: conceptData.id || `concept_${Date.now()}`,
    objective: conceptData.objective || 'Novel concept analysis',
    status: conceptData.status || 'Proposed',
    components: {
      materials: conceptData.components?.materials || [],
      mechanisms: conceptData.components?.mechanisms || [],
      methods: conceptData.components?.methods || [],
      theoretical_concepts: conceptData.components?.theoretical_concepts || []
    },
    cssVectorDraft: conceptData.cssVectorDraft || {},
    fieldSuggestions: {},
    protocolOutline: conceptData.protocolOutline
  };

  const config = { ...DEFAULT_CONFIG, ...options };
  const summary = generateSummary(conceptState, graphData, config);
  const markdown = formatSummaryAsMarkdown(summary);

  return { summary, markdown };
}; 