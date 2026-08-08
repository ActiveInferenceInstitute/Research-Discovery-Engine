/**
 * Knowledge Processing LLM Service
 * 
 * Specialized service for processing and analyzing knowledge using LLM
 */

import { LLMService } from '../LLMService';
import { 
  KnowledgeProcessingLLMRequest, 
  KnowledgeProcessingResult, 
  LLMConfig,
  PromptTemplate 
} from '../types';

export class KnowledgeLLMService extends LLMService {
  private knowledgeTemplates: Map<string, PromptTemplate>;

  constructor(config: LLMConfig) {
    super(config);
    this.knowledgeTemplates = this.initializeKnowledgeTemplates();
  }

  /**
   * Process knowledge using LLM
   */
  async processKnowledge(request: KnowledgeProcessingLLMRequest): Promise<KnowledgeProcessingResult> {
    const template = this.getKnowledgeTemplate(request.processingType, request.outputFormat);
    const systemPrompt = this.buildSystemPrompt(template, request);
    const userPrompt = this.buildUserPrompt(template, request);

    const llmRequest = {
      systemPrompt,
      userPrompt,
      context: this.formatSourceText(request.sourceText),
      config: {
        temperature: 0.4, // Moderate temperature for balanced creativity and accuracy
        maxTokens: this.getMaxTokensForProcessing(request.processingType),
        ...request.config
      }
    };

    const result = await this.generateText(llmRequest);
    
    if (!result.success) {
      return {
        ...result,
        extractedData: this.getEmptyExtraction()
      } as KnowledgeProcessingResult;
    }

    return {
      ...result,
      extractedData: this.parseKnowledgeContent(result.content, request)
    } as KnowledgeProcessingResult;
  }

  /**
   * Extract concepts from text
   */
  async extractConcepts(
    sourceText: string, 
    domain: string,
    maxConcepts: number = 20
  ): Promise<string[]> {
    const request: KnowledgeProcessingLLMRequest = {
      sourceText,
      processingType: 'extract_concepts',
      domain,
      outputFormat: 'structured',
      userPrompt: `Extract key concepts from the provided text.`,
      extractionTargets: [`Extract up to ${maxConcepts} key concepts`]
    };

    const result = await this.processKnowledge(request);
    return result.extractedData.concepts;
  }

  /**
   * Find relationships between concepts
   */
  async findRelationships(
    sourceText: string,
    concepts: string[],
    domain: string
  ): Promise<Array<{ source: string; target: string; relationship: string }>> {
    const request: KnowledgeProcessingLLMRequest = {
      sourceText,
      processingType: 'find_relationships',
      domain,
      outputFormat: 'structured',
      userPrompt: `Identify relationships between the concepts: ${concepts.join(', ')}`
    };

    const result = await this.processKnowledge(request);
    return result.extractedData.relationships;
  }

  /**
   * Generate research questions
   */
  async generateQuestions(
    sourceText: string,
    domain: string,
    questionType: 'exploratory' | 'hypothesis' | 'application' = 'exploratory'
  ): Promise<string[]> {
    const request: KnowledgeProcessingLLMRequest = {
      sourceText,
      processingType: 'generate_questions',
      domain,
      outputFormat: 'structured',
      userPrompt: `Generate ${questionType} research questions based on the text.`
    };

    const result = await this.processKnowledge(request);
    return result.extractedData.questions;
  }

  private initializeKnowledgeTemplates(): Map<string, PromptTemplate> {
    const templates = new Map<string, PromptTemplate>();

    templates.set('extract_concepts-structured', {
      name: 'Concept Extraction (Structured)',
      description: 'Extract key concepts in structured format',
      systemPrompt: `You are an expert knowledge analyst specializing in concept extraction from scientific texts.
Your task is to identify and extract the most important concepts, terms, and ideas from the provided text.
Focus on domain-specific terminology, key principles, methods, materials, and theoretical concepts.
Present results in a clear, structured format.`,
      userPromptTemplate: `Analyze the following text and extract key concepts relevant to {domain}:

TEXT TO ANALYZE:
{sourceText}

EXTRACTION REQUIREMENTS:
- Extract concepts that are most relevant to {domain}
- Focus on scientific terms, methods, materials, and principles
- Include both explicit and implicit concepts
- Prioritize concepts that appear multiple times or are emphasized
{extractionTargets ? "- Specific targets: {extractionTargets}" : ""}

FORMAT: Provide a numbered list of concepts, with brief explanations where helpful.`,
      variables: ['domain', 'sourceText', 'extractionTargets'],
      defaultConfig: { temperature: 0.4, maxTokens: 2000 }
    });

    templates.set('find_relationships-structured', {
      name: 'Relationship Extraction (Structured)',
      description: 'Find relationships between concepts in structured format',
      systemPrompt: `You are an expert in knowledge graph construction and relationship analysis.
Your task is to identify meaningful relationships between concepts in scientific texts.
Focus on causal relationships, dependencies, hierarchies, and functional connections.
Present relationships in a structured, machine-readable format.`,
      userPromptTemplate: `Analyze the relationships between concepts in this text about {domain}:

TEXT TO ANALYZE:
{sourceText}

RELATIONSHIP ANALYSIS:
- Identify connections between different concepts, methods, and materials
- Look for causal relationships (A causes B, A enables B)
- Find hierarchical relationships (A is a type of B, A contains B)
- Discover functional relationships (A is used for B, A affects B)
- Include temporal relationships (A occurs before B)

FORMAT: List relationships as "Source -> Relationship -> Target" with brief justification.`,
      variables: ['domain', 'sourceText'],
      defaultConfig: { temperature: 0.4, maxTokens: 2000 }
    });

    templates.set('generate_questions-structured', {
      name: 'Question Generation (Structured)',
      description: 'Generate research questions in structured format',
      systemPrompt: `You are a research strategist specializing in identifying knowledge gaps and formulating research questions.
Your task is to generate insightful, actionable research questions based on scientific content.
Focus on questions that would advance the field, fill knowledge gaps, or explore new applications.
Present questions in order of importance and research potential.`,
      userPromptTemplate: `Based on this text about {domain}, generate research questions:

TEXT TO ANALYZE:
{sourceText}

QUESTION GENERATION FOCUS:
- Identify knowledge gaps and unexplored areas
- Formulate questions about mechanisms, applications, and optimization
- Consider interdisciplinary opportunities
- Include both fundamental and applied research questions
- Focus on feasible but impactful investigations

FORMAT: Numbered list of research questions with brief rationale for each.`,
      variables: ['domain', 'sourceText'],
      defaultConfig: { temperature: 0.6, maxTokens: 1500 }
    });

    templates.set('classify-structured', {
      name: 'Text Classification (Structured)',
      description: 'Classify and categorize content',
      systemPrompt: `You are an expert in scientific text classification and taxonomy.
Your task is to classify and categorize content according to established scientific frameworks.
Focus on accurate classification that would be useful for knowledge organization and retrieval.
Present classifications with confidence levels and justifications.`,
      userPromptTemplate: `Classify this text about {domain} according to relevant scientific categories:

TEXT TO CLASSIFY:
{sourceText}

CLASSIFICATION TASKS:
- Determine the primary research area/subdomain
- Classify the type of research (theoretical, experimental, computational, review)
- Identify the main methods or approaches used
- Categorize the materials or systems discussed
- Assess the research stage (basic research, applied research, development)

FORMAT: Provide classification categories with confidence levels and brief justifications.`,
      variables: ['domain', 'sourceText'],
      defaultConfig: { temperature: 0.3, maxTokens: 1500 }
    });

    templates.set('summarize-narrative', {
      name: 'Knowledge Summarization (Narrative)',
      description: 'Create narrative summaries of knowledge content',
      systemPrompt: `You are an expert science writer specializing in knowledge synthesis and summarization.
Your task is to create clear, comprehensive summaries that capture the essential knowledge from scientific content.
Focus on the most important insights, findings, and implications while maintaining scientific accuracy.
Present information in a logical, narrative flow that builds understanding.`,
      userPromptTemplate: `Create a comprehensive summary of this {domain} content:

CONTENT TO SUMMARIZE:
{sourceText}

SUMMARIZATION REQUIREMENTS:
- Capture the main concepts, findings, and insights
- Explain the significance and implications
- Maintain scientific accuracy while ensuring accessibility
- Organize information logically
- Highlight novel or important contributions

FORMAT: Narrative summary with clear sections for different aspects of the content.`,
      variables: ['domain', 'sourceText'],
      defaultConfig: { temperature: 0.5, maxTokens: 2000 }
    });

    return templates;
  }

  private getKnowledgeTemplate(
    processingType: KnowledgeProcessingLLMRequest['processingType'],
    outputFormat: KnowledgeProcessingLLMRequest['outputFormat']
  ): PromptTemplate {
    const key = `${processingType}-${outputFormat}`;
    return this.knowledgeTemplates.get(key) || this.knowledgeTemplates.get('extract_concepts-structured')!;
  }

  private buildSystemPrompt(template: PromptTemplate, request: KnowledgeProcessingLLMRequest): string {
    return request.systemPrompt || template.systemPrompt;
  }

  private buildUserPrompt(template: PromptTemplate, request: KnowledgeProcessingLLMRequest): string {
    if (request.userPrompt && !template.userPromptTemplate.includes('{')) {
      return request.userPrompt;
    }

    let prompt = template.userPromptTemplate;

    // Replace template variables
    prompt = prompt.replace('{domain}', request.domain);
    prompt = prompt.replace('{sourceText}', request.sourceText);
    
    if (request.extractionTargets?.length) {
      prompt = prompt.replace('{extractionTargets}', request.extractionTargets.join(', '));
    }

    // Remove unfilled placeholders
    prompt = prompt.replace(/\{[^}]*\}/g, '');

    return prompt;
  }

  private formatSourceText(sourceText: string): string {
    // Limit source text length to prevent token overflow
    const maxLength = 8000; // Adjust based on your needs
    if (sourceText.length > maxLength) {
      return sourceText.substring(0, maxLength) + '\n\n[Text truncated due to length...]';
    }
    return sourceText;
  }

  private getMaxTokensForProcessing(processingType: KnowledgeProcessingLLMRequest['processingType']): number {
    switch (processingType) {
      case 'extract_concepts': return 2000;
      case 'find_relationships': return 2500;
      case 'generate_questions': return 1500;
      case 'classify': return 1500;
      case 'summarize': return 2000;
      default: return 2000;
    }
  }

  private parseKnowledgeContent(
    content: string, 
    request: KnowledgeProcessingLLMRequest
  ): KnowledgeProcessingResult['extractedData'] {
    const lines = content.split('\n').filter(line => line.trim());
    
    const extractedData = {
      concepts: [] as string[],
      relationships: [] as Array<{ source: string; target: string; relationship: string }>,
      questions: [] as string[],
      classifications: {} as { [key: string]: string }
    };

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (request.processingType === 'extract_concepts') {
        // Extract concepts from numbered or bulleted lists
        if (trimmed.match(/^\d+\./) || trimmed.match(/^[-•*]/)) {
          const concept = trimmed.replace(/^\d+\.\s*/, '').replace(/^[-•*]\s*/, '');
          if (concept && concept.length > 2) {
            extractedData.concepts.push(concept);
          }
        }
      } else if (request.processingType === 'find_relationships') {
        // Parse relationships in format "Source -> Relationship -> Target"
        if (trimmed.includes('->')) {
          const parts = trimmed.split('->').map(p => p.trim());
          if (parts.length >= 3) {
            extractedData.relationships.push({
              source: parts[0],
              target: parts[2],
              relationship: parts[1]
            });
          }
        }
      } else if (request.processingType === 'generate_questions') {
        // Extract questions from numbered or bulleted lists
        if (trimmed.match(/^\d+\./) || trimmed.match(/^[-•*]/)) {
          const question = trimmed.replace(/^\d+\.\s*/, '').replace(/^[-•*]\s*/, '');
          if (question && question.includes('?')) {
            extractedData.questions.push(question);
          }
        }
      } else if (request.processingType === 'classify') {
        // Parse classifications in format "Category: Value"
        if (trimmed.includes(':')) {
          const [category, value] = trimmed.split(':', 2);
          if (category && value) {
            extractedData.classifications[category.trim()] = value.trim();
          }
        }
      }
    }

    return extractedData;
  }

  private getEmptyExtraction(): KnowledgeProcessingResult['extractedData'] {
    return {
      concepts: [],
      relationships: [],
      questions: [],
      classifications: {}
    };
  }
} 