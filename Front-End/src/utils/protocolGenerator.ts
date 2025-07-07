/**
 * Protocol Generator Utility
 * 
 * Generates experimental protocols from concept design states and CSS vectors.
 * Can be used both as a standalone utility and integrated into the main framework.
 */

import { ConceptDesignState, CSSVector } from '../types';

/**
 * Protocol generation configuration
 */
interface ProtocolConfig {
  includeTimeEstimates: boolean;
  includeRiskAssessment: boolean;
  detailLevel: 'basic' | 'intermediate' | 'advanced';
  outputFormat: 'markdown' | 'json';
}

/**
 * Default protocol configuration
 */
const DEFAULT_CONFIG: ProtocolConfig = {
  includeTimeEstimates: true,
  includeRiskAssessment: false,
  detailLevel: 'intermediate',
  outputFormat: 'markdown'
};

/**
 * Protocol section interface
 */
interface ProtocolSection {
  title: string;
  content: string[];
  timeEstimate?: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

/**
 * Complete protocol interface
 */
interface GeneratedProtocol {
  title: string;
  objective: string;
  conceptId: string;
  timestamp: string;
  sections: ProtocolSection[];
  metadata: {
    materials: string[];
    mechanisms: string[];
    estimatedDuration: string;
    skillLevel: string;
  };
}

/**
 * Generate a comprehensive experimental protocol from concept design state
 */
export const generateProtocol = (
  conceptState: ConceptDesignState,
  config: ProtocolConfig = DEFAULT_CONFIG
): GeneratedProtocol => {
  const { objective, components, cssVectorDraft } = conceptState;
  const css = cssVectorDraft || {};
  
  const protocol: GeneratedProtocol = {
    title: `Experimental Protocol: ${objective}`,
    objective: objective || 'Design and validate a novel concept',
    conceptId: conceptState.id,
    timestamp: new Date().toISOString(),
    sections: [],
    metadata: {
      materials: components.materials,
      mechanisms: components.mechanisms,
      estimatedDuration: estimateProtocolDuration(conceptState, config),
      skillLevel: determineSkillLevel(conceptState, config)
    }
  };

  // Generate protocol sections
  protocol.sections = [
    generateOverviewSection(conceptState, css, config),
    generateMaterialsSection(conceptState, css, config),
    generateFabricationSection(conceptState, css, config),
    generateCharacterizationSection(conceptState, css, config),
    generateExperimentSection(conceptState, css, config),
    generateAnalysisSection(conceptState, css, config)
  ];

  return protocol;
};

/**
 * Generate overview section
 */
const generateOverviewSection = (
  conceptState: ConceptDesignState,
  css: Partial<CSSVector>,
  config: ProtocolConfig
): ProtocolSection => {
  const content: string[] = [
    `This protocol outlines the experimental procedure for: ${conceptState.objective}`,
    `Concept ID: ${conceptState.id}`,
    ''
  ];

  if (css.constraints?.objective_type) {
    content.push(`Primary Objective: ${css.constraints.objective_type}`);
  }

  if (conceptState.components.materials.length > 0) {
    content.push(`Key Materials: ${conceptState.components.materials.join(', ')}`);
  }

  if (conceptState.components.mechanisms.length > 0) {
    content.push(`Key Mechanisms: ${conceptState.components.mechanisms.join(', ')}`);
  }

  return {
    title: 'Protocol Overview',
    content,
    timeEstimate: config.includeTimeEstimates ? '30 minutes' : undefined
  };
};

/**
 * Generate materials section
 */
const generateMaterialsSection = (
  conceptState: ConceptDesignState,
  css: Partial<CSSVector>,
  config: ProtocolConfig
): ProtocolSection => {
  const content: string[] = ['### Required Materials:'];
  
  if (conceptState.components.materials.length > 0) {
    conceptState.components.materials.forEach(material => {
      content.push(`- ${material}`);
    });
  } else {
    content.push('- Materials to be specified based on design requirements');
  }

  content.push('', '### Required Equipment:');
  
  if (css.context?.fabrication_primary?.length) {
    css.context.fabrication_primary.forEach(method => {
      content.push(`- Equipment for ${method}`);
    });
  } else {
    content.push('- Equipment requirements to be determined');
  }

  return {
    title: 'Materials and Equipment',
    content,
    timeEstimate: config.includeTimeEstimates ? '1-2 hours' : undefined
  };
};

/**
 * Generate fabrication section
 */
const generateFabricationSection = (
  conceptState: ConceptDesignState,
  css: Partial<CSSVector>,
  config: ProtocolConfig
): ProtocolSection => {
  const content: string[] = ['### Fabrication/Synthesis:'];

  if (css.context?.fabrication_primary?.length) {
    css.context.fabrication_primary.forEach((method, index) => {
      content.push(`${index + 1}. **${method}**`);
      content.push('   - Follow standard procedures for this method');
      content.push('');
    });
  } else {
    content.push('1. Determine appropriate fabrication method');
    content.push('2. Optimize fabrication parameters');
    content.push('3. Prepare samples with consistent quality');
  }

  return {
    title: 'Fabrication and Synthesis',
    content,
    timeEstimate: config.includeTimeEstimates ? '4-8 hours' : undefined,
    riskLevel: 'medium'
  };
};

/**
 * Generate characterization section
 */
const generateCharacterizationSection = (
  conceptState: ConceptDesignState,
  css: Partial<CSSVector>,
  config: ProtocolConfig
): ProtocolSection => {
  const content: string[] = ['### Characterization:'];

  if (css.state?.basis?.length) {
    content.push(`- Measure ${css.state.basis.join(', ')}`);
  }

  if (css.interface?.output_mechanism?.length) {
    content.push(`- Use ${css.interface.output_mechanism.join(', ')} for measurements`);
  }

  if (css.memory?.mechanism_primary?.length) {
    content.push(`- Characterize ${css.memory.mechanism_primary.join(', ')}`);
  }

  if (content.length === 1) {
    content.push('- Define measurement procedures based on system properties');
  }

  return {
    title: 'Characterization Protocol',
    content,
    timeEstimate: config.includeTimeEstimates ? '2-4 hours' : undefined
  };
};

/**
 * Generate experiment section
 */
const generateExperimentSection = (
  conceptState: ConceptDesignState,
  css: Partial<CSSVector>,
  config: ProtocolConfig
): ProtocolSection => {
  const content: string[] = ['### Experimental Setup:'];

  if (css.context?.environment_type) {
    content.push(`- Environment: ${css.context.environment_type}`);
  }

  if (css.interface?.input_mechanism?.length) {
    content.push(`- Apply ${css.interface.input_mechanism.join(', ')} stimuli`);
  }

  content.push('', '### Testing Procedure:');
  content.push('1. Record baseline measurements');
  content.push('2. Apply defined stimuli');
  content.push('3. Monitor system response');
  content.push('4. Document all observations');

  return {
    title: 'Experimental Testing',
    content,
    timeEstimate: config.includeTimeEstimates ? '4-6 hours' : undefined
  };
};

/**
 * Generate analysis section
 */
const generateAnalysisSection = (
  conceptState: ConceptDesignState,
  css: Partial<CSSVector>,
  config: ProtocolConfig
): ProtocolSection => {
  const content: string[] = [
    '### Data Processing:',
    '- Compile all measurement data',
    '- Apply appropriate calibrations',
    '',
    '### Analysis:',
    '- Compare results against objectives',
    '- Evaluate system performance',
    '- Document key findings'
  ];

  if (css.constraints?.uncertainty_handling) {
    content.push(`- Handle uncertainties using ${css.constraints.uncertainty_handling}`);
  }

  return {
    title: 'Data Analysis',
    content,
    timeEstimate: config.includeTimeEstimates ? '2-4 hours' : undefined
  };
};

/**
 * Estimate protocol duration
 */
const estimateProtocolDuration = (
  conceptState: ConceptDesignState,
  config: ProtocolConfig
): string => {
  let baseDuration = 8; // hours
  
  baseDuration += conceptState.components.materials.length * 2;
  baseDuration += conceptState.components.mechanisms.length * 1;
  
  switch (config.detailLevel) {
    case 'basic':
      baseDuration *= 0.7;
      break;
    case 'advanced':
      baseDuration *= 1.5;
      break;
  }
  
  if (baseDuration < 24) {
    return `${Math.round(baseDuration)} hours`;
  } else {
    const days = Math.round(baseDuration / 8);
    return `${days} days`;
  }
};

/**
 * Determine skill level
 */
const determineSkillLevel = (
  conceptState: ConceptDesignState,
  config: ProtocolConfig
): string => {
  let complexity = conceptState.components.materials.length + conceptState.components.mechanisms.length * 2;
  
  if (config.detailLevel === 'advanced') complexity += 5;
  
  if (complexity <= 5) return 'Beginner';
  if (complexity <= 10) return 'Intermediate';
  return 'Advanced';
};

/**
 * Format protocol as markdown
 */
export const formatProtocolAsMarkdown = (protocol: GeneratedProtocol): string => {
  let markdown = `# ${protocol.title}\n\n`;
  markdown += `**Objective:** ${protocol.objective}\n`;
  markdown += `**Concept ID:** ${protocol.conceptId}\n`;
  markdown += `**Generated:** ${new Date(protocol.timestamp).toLocaleString()}\n`;
  markdown += `**Estimated Duration:** ${protocol.metadata.estimatedDuration}\n`;
  markdown += `**Skill Level:** ${protocol.metadata.skillLevel}\n\n`;

  protocol.sections.forEach(section => {
    markdown += `## ${section.title}\n\n`;
    
    if (section.timeEstimate) {
      markdown += `*Estimated Time: ${section.timeEstimate}*\n\n`;
    }

    section.content.forEach(line => {
      markdown += line ? `${line}\n` : '\n';
    });
    
    markdown += '\n';
  });

  return markdown;
};

/**
 * Create standalone protocol generation function
 */
export const createStandaloneProtocol = (
  conceptData: Partial<ConceptDesignState>,
  options: Partial<ProtocolConfig> = {}
): { protocol: GeneratedProtocol; markdown: string } => {
  const conceptState: ConceptDesignState = {
    id: conceptData.id || `concept_${Date.now()}`,
    objective: conceptData.objective || 'Novel concept validation',
    status: 'Proposed',
    components: {
      materials: conceptData.components?.materials || [],
      mechanisms: conceptData.components?.mechanisms || [],
      methods: conceptData.components?.methods || [],
      theoretical_concepts: conceptData.components?.theoretical_concepts || []
    },
    cssVectorDraft: conceptData.cssVectorDraft || {},
    fieldSuggestions: {}
  };

  const config = { ...DEFAULT_CONFIG, ...options };
  const protocol = generateProtocol(conceptState, config);
  const markdown = formatProtocolAsMarkdown(protocol);

  return { protocol, markdown };
}; 