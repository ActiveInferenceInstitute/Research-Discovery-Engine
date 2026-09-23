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
  
  export interface TermContext {
    term: Term;
    relatedTerms: Term[];
    usageExamples: string[];
  }