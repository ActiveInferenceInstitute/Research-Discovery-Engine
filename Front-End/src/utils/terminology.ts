/**
 * Terminology Utilities
 * 
 * Utilities for working with the comprehensive terminology from the Discovery Engine research.
 * Provides search, filtering, and context-aware term suggestions.
 */

import terminologyData from '../data/terminology.json';

export interface Term {
  id: string;
  name: string;
  classification: 'Novel' | 'Borrowed';
  discipline: string;
  description: string;
  detailed_description: string;
  links: string[];
  usage_context: string;
  importance: 'foundational' | 'core' | 'advanced' | 'specialized';
}

export interface ArchetypeCategory {
  name: string;
  description: string;
  characteristics: string[];
  color: string;
  examples: string[];
}

export class TerminologyService {
  private static allTerms: Term[] = [];
  private static archetypes: Record<string, ArchetypeCategory> = {};

  static {
    // Initialize terms from JSON data
    this.allTerms = [
      ...Object.values(terminologyData.novel_terms),
      ...Object.values(terminologyData.borrowed_terms)
    ] as Term[];
    
    this.archetypes = terminologyData.archetype_categories as Record<string, ArchetypeCategory>;
  }

  /**
   * Get all terms
   */
  static getAllTerms(): Term[] {
    return this.allTerms;
  }

  /**
   * Get terms by classification
   */
  static getTermsByClassification(classification: 'Novel' | 'Borrowed'): Term[] {
    return this.allTerms.filter(term => term.classification === classification);
  }

  /**
   * Get terms by importance level
   */
  static getTermsByImportance(importance: Term['importance']): Term[] {
    return this.allTerms.filter(term => term.importance === importance);
  }

  /**
   * Get terms by usage context
   */
  static getTermsByContext(context: string): Term[] {
    return this.allTerms.filter(term => term.usage_context === context);
  }

  /**
   * Search terms by name or description
   */
  static searchTerms(query: string): Term[] {
    const lowercaseQuery = query.toLowerCase();
    return this.allTerms.filter(term => 
      term.name.toLowerCase().includes(lowercaseQuery) ||
      term.description.toLowerCase().includes(lowercaseQuery) ||
      term.detailed_description.toLowerCase().includes(lowercaseQuery) ||
      term.discipline.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get a specific term by ID
   */
  static getTerm(id: string): Term | undefined {
    return this.allTerms.find(term => term.id === id);
  }

  /**
   * Get related terms based on discipline overlap
   */
  static getRelatedTerms(termId: string): Term[] {
    const term = this.getTerm(termId);
    if (!term) return [];

    const termDisciplines = term.discipline.split(', ').map(d => d.trim().toLowerCase());
    
    return this.allTerms.filter(otherTerm => {
      if (otherTerm.id === termId) return false;
      
      const otherDisciplines = otherTerm.discipline.split(', ').map(d => d.trim().toLowerCase());
      return termDisciplines.some(discipline => 
        otherDisciplines.some(otherDiscipline => 
          otherDiscipline.includes(discipline) || discipline.includes(otherDiscipline)
        )
      );
    }).slice(0, 5); // Limit to 5 related terms
  }

  /**
   * Get terms relevant to a specific workflow step
   */
  static getTermsForStep(step: 'explore' | 'discover' | 'innovate'): Term[] {
    const contextMap = {
      explore: ['field_exploration', 'knowledge_representation', 'foundational_technology', 'community_identification'],
      discover: ['gap_discovery', 'network_analysis', 'relationship_analysis', 'quality_assessment'],
      innovate: ['innovation_planning', 'advanced_reasoning', 'agent_systems', 'dynamic_learning']
    };

    const relevantContexts = contextMap[step];
    return this.allTerms.filter(term => 
      relevantContexts.includes(term.usage_context) || term.importance === 'foundational'
    );
  }

  /**
   * Get archetype categories
   */
  static getArchetypes(): Record<string, ArchetypeCategory> {
    return this.archetypes;
  }

  /**
   * Get foundational terms (most important for understanding the system)
   */
  static getFoundationalTerms(): Term[] {
    return this.getTermsByImportance('foundational');
  }

  /**
   * Get novel terms (Discovery Engine innovations)
   */
  static getNovelTerms(): Term[] {
    return this.getTermsByClassification('Novel');
  }

  /**
   * Get term definition with context
   */
  static getTermWithContext(termId: string): {
    term: Term;
    relatedTerms: Term[];
    usageExamples: string[];
  } | null {
    const term = this.getTerm(termId);
    if (!term) return null;

    const relatedTerms = this.getRelatedTerms(termId);
    
    // Generate usage examples based on context
    const usageExamples = this.generateUsageExamples(term);

    return {
      term,
      relatedTerms,
      usageExamples
    };
  }

  /**
   * Generate usage examples for a term
   */
  private static generateUsageExamples(term: Term): string[] {
    const examples: Record<string, string[]> = {
      field_exploration: [
        "Used in the exploration phase to map research communities",
        "Helps identify thematic clusters and research domains"
      ],
      gap_discovery: [
        "Applied to identify missing connections between concepts", 
        "Enables systematic discovery of research opportunities"
      ],
      innovation_planning: [
        "Guides the synthesis of multi-step research trajectories",
        "Supports protocol development and validation planning"
      ],
      knowledge_representation: [
        "Fundamental to how concepts are structured and connected",
        "Enables querying and reasoning about scientific knowledge"
      ],
      network_analysis: [
        "Used to analyze relationships and importance in knowledge graphs",
        "Helps identify influential concepts and research clusters"
      ]
    };

    return examples[term.usage_context] || [
      `Applied in ${term.discipline} research contexts`,
      `Contributes to ${term.usage_context.replace('_', ' ')} capabilities`
    ];
  }

  /**
   * Get term suggestions for auto-complete
   */
  static getTermSuggestions(partial: string, limit: number = 5): Term[] {
    const lowercasePartial = partial.toLowerCase();
    
    // Prioritize exact name matches, then description matches
    const nameMatches = this.allTerms.filter(term => 
      term.name.toLowerCase().startsWith(lowercasePartial)
    );
    
    const descriptionMatches = this.allTerms.filter(term => 
      !term.name.toLowerCase().startsWith(lowercasePartial) &&
      term.description.toLowerCase().includes(lowercasePartial)
    );

    return [...nameMatches, ...descriptionMatches].slice(0, limit);
  }

  /**
   * Format term for display
   */
  static formatTermForDisplay(term: Term): {
    title: string;
    subtitle: string;
    badge: string;
    badgeColor: string;
    description: string;
  } {
    const badgeColors = {
      Novel: 'bg-blue-600',
      Borrowed: 'bg-gray-600'
    };

    const importanceColors = {
      foundational: 'text-purple-400',
      core: 'text-blue-400', 
      advanced: 'text-green-400',
      specialized: 'text-orange-400'
    };

    return {
      title: term.name,
      subtitle: term.discipline,
      badge: term.classification,
      badgeColor: badgeColors[term.classification],
      description: term.description
    };
  }

  /**
   * Check if a concept name matches any known term
   */
  static findMatchingTerm(conceptName: string): Term | undefined {
    const normalizedName = conceptName.toLowerCase().replace(/[-_]/g, ' ');
    
    return this.allTerms.find(term => {
      const normalizedTermName = term.name.toLowerCase().replace(/[-_]/g, ' ');
      return normalizedTermName.includes(normalizedName) || 
             normalizedName.includes(normalizedTermName);
    });
  }

  /**
   * Get terms that should be highlighted in a given text
   */
  static getHighlightableTerms(text: string): Term[] {
    const words = text.toLowerCase().split(/\s+/);
    const matchingTerms: Term[] = [];

    this.allTerms.forEach(term => {
      const termWords = term.name.toLowerCase().split(/\s+/);
      
      // Check if all words of the term appear in the text
      const allWordsPresent = termWords.every(termWord => 
        words.some(word => word.includes(termWord) || termWord.includes(word))
      );

      if (allWordsPresent) {
        matchingTerms.push(term);
      }
    });

    return matchingTerms;
  }
}