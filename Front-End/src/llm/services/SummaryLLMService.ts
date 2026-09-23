/**
 * Summary LLM Service
 * 
 * Specialized service for generating research summaries using LLM
 */

import { LLMService } from '../LLMService';
import { 
  SummaryLLMRequest, 
  SummaryLLMResult, 
  LLMConfig,
  ResearchLLMContext,
  PromptTemplate 
} from '../types';

export class SummaryLLMService extends LLMService {
  private summaryTemplates: Map<string, PromptTemplate>;

  constructor(config: LLMConfig) {
    super(config);
    this.summaryTemplates = this.initializeSummaryTemplates();
  }

  /**
   * Generate a research summary using LLM
   */
  async generateSummary(request: SummaryLLMRequest): Promise<SummaryLLMResult> {
    const template = this.getSummaryTemplate(request.summaryType, request.targetAudience);
    const systemPrompt = this.buildSystemPrompt(template, request);
    const userPrompt = this.buildUserPrompt(template, request);

    const llmRequest = {
      systemPrompt,
      userPrompt,
      context: this.formatContext(request.context),
      config: {
        temperature: 0.7,
        maxTokens: this.getMaxTokensForLength(request.length),
        ...request.config
      }
    };

    const result = await this.generateText(llmRequest);
    
    if (!result.success) {
      return {
        ...result,
        summary: this.getEmptySummary()
      } as SummaryLLMResult;
    }

    return {
      ...result,
      summary: this.parseSummaryContent(result.content, request)
    } as SummaryLLMResult;
  }

  /**
   * Generate multiple summaries with different styles
   */
  async generateMultipleSummaries(
    context: ResearchLLMContext,
    summaryTypes: SummaryLLMRequest['summaryType'][],
    targetAudience: SummaryLLMRequest['targetAudience'] = 'researcher'
  ): Promise<{ [key: string]: SummaryLLMResult }> {
    const requests = summaryTypes.map(type => ({
      context,
      summaryType: type,
      targetAudience,
      length: 'standard' as const,
      includeReferences: true,
      includeFutureWork: true,
      userPrompt: `Generate a ${type} summary for the given research context.`
    }));

    const batchRequest = {
      requests: requests.map(req => ({
        systemPrompt: this.buildSystemPrompt(
          this.getSummaryTemplate(req.summaryType, req.targetAudience), 
          req
        ),
        userPrompt: this.buildUserPrompt(
          this.getSummaryTemplate(req.summaryType, req.targetAudience), 
          req
        ),
        context: this.formatContext(req.context)
      })),
      concurrency: 3
    };

    const batchResult = await this.generateBatch(batchRequest);
    const results: { [key: string]: SummaryLLMResult } = {};

    batchResult.results.forEach((result, index) => {
      if ('success' in result && result.success) {
        results[summaryTypes[index]] = {
          ...result,
          summary: this.parseSummaryContent(result.content, requests[index])
        } as SummaryLLMResult;
      }
    });

    return results;
  }

  private initializeSummaryTemplates(): Map<string, PromptTemplate> {
    const templates = new Map<string, PromptTemplate>();

    templates.set('technical-researcher', {
      name: 'Technical Summary for Researchers',
      description: 'Detailed technical summary for academic researchers',
      systemPrompt: `You are an expert research scientist generating technical summaries for academic researchers. 
Focus on scientific rigor, methodology, and detailed technical content. Use precise scientific language and include specific technical details.
Format your response as a structured summary with clear sections.`,
      userPromptTemplate: `Generate a technical summary of the research concept: "{concept}" in the domain of {domain}.

Context:
- Materials: {materials}
- Mechanisms: {mechanisms}
- Methods: {methods}
- Applications: {applications}

Requirements:
- Length: {length}
- Include technical methodology
- Focus on scientific accuracy
- Include implications for the field
{includeReferences ? "- Include relevant references" : ""}
{includeFutureWork ? "- Suggest future research directions" : ""}

Structure your response as:
1. Abstract (2-3 sentences)
2. Key Findings (3-5 bullet points)
3. Methodology (technical approach)
4. Implications (significance to the field)
{includeFutureWork ? "5. Future Work (research directions)" : ""}
{includeReferences ? "6. References (if applicable)" : ""}`,
      variables: ['concept', 'domain', 'materials', 'mechanisms', 'methods', 'applications', 'length', 'includeReferences', 'includeFutureWork'],
      defaultConfig: { temperature: 0.7, maxTokens: 1500 }
    });

    templates.set('executive-industry', {
      name: 'Executive Summary for Industry',
      description: 'High-level summary for industry professionals and executives',
      systemPrompt: `You are a strategic technology consultant generating executive summaries for industry leaders.
Focus on business implications, market potential, and practical applications. Use clear, accessible language while maintaining technical accuracy.
Emphasize value propositions and competitive advantages.`,
      userPromptTemplate: `Generate an executive summary of the research concept: "{concept}" in the domain of {domain}.

Context:
- Key Technologies: {materials}, {mechanisms}
- Applications: {applications}
- Methods: {methods}

Requirements:
- Length: {length}
- Focus on business value and market impact
- Highlight competitive advantages
- Include implementation feasibility
{includeFutureWork ? "- Identify market opportunities" : ""}

Structure your response as:
1. Executive Summary (business value in 2-3 sentences)
2. Key Value Propositions (3-4 bullet points)
3. Technical Approach (simplified for executives)
4. Market Implications (business impact)
{includeFutureWork ? "5. Market Opportunities (growth potential)" : ""}`,
      variables: ['concept', 'domain', 'materials', 'mechanisms', 'methods', 'applications', 'length', 'includeFutureWork'],
      defaultConfig: { temperature: 0.6, maxTokens: 1000 }
    });

    templates.set('educational-student', {
      name: 'Educational Summary for Students',
      description: 'Accessible summary for students and learners',
      systemPrompt: `You are an expert educator creating learning materials for students.
Focus on clarity, accessibility, and educational value. Use analogies and examples to explain complex concepts.
Structure information to support learning and understanding.`,
      userPromptTemplate: `Create an educational summary of the research concept: "{concept}" in the domain of {domain}.

Context:
- Core Materials: {materials}
- Key Mechanisms: {mechanisms}
- Research Methods: {methods}
- Real-world Applications: {applications}

Requirements:
- Length: {length}
- Use accessible language
- Include learning objectives
- Provide real-world examples
- Explain complex concepts clearly

Structure your response as:
1. Overview (what this research is about)
2. Key Concepts (main ideas to understand)
3. How It Works (simplified explanation)
4. Real-World Applications (practical examples)
5. Why It Matters (significance and impact)`,
      variables: ['concept', 'domain', 'materials', 'mechanisms', 'methods', 'applications', 'length'],
      defaultConfig: { temperature: 0.8, maxTokens: 1200 }
    });

    templates.set('comprehensive-general', {
      name: 'Comprehensive Summary for General Audience',
      description: 'Detailed but accessible summary for broad audience',
      systemPrompt: `You are a science communicator creating comprehensive yet accessible summaries for a general audience.
Balance technical accuracy with clarity. Use analogies and examples to make complex concepts understandable.
Include both scientific details and practical implications.`,
      userPromptTemplate: `Create a comprehensive summary of the research concept: "{concept}" in the domain of {domain}.

Context:
- Materials Involved: {materials}
- Key Mechanisms: {mechanisms}
- Research Methods: {methods}
- Potential Applications: {applications}

Requirements:
- Length: {length}
- Balance technical detail with accessibility
- Include background context
- Explain significance clearly
{includeReferences ? "- Reference key sources" : ""}
{includeFutureWork ? "- Discuss future possibilities" : ""}

Structure your response as:
1. Introduction (background and context)
2. What We Discovered (key findings)
3. How It Works (technical explanation made accessible)
4. Why It's Important (implications and significance)
5. Practical Applications (real-world uses)
{includeFutureWork ? "6. Future Possibilities (what's next)" : ""}
{includeReferences ? "7. Key References (important sources)" : ""}`,
      variables: ['concept', 'domain', 'materials', 'mechanisms', 'methods', 'applications', 'length', 'includeReferences', 'includeFutureWork'],
      defaultConfig: { temperature: 0.7, maxTokens: 2000 }
    });

    return templates;
  }

  private getSummaryTemplate(
    summaryType: SummaryLLMRequest['summaryType'], 
    targetAudience: SummaryLLMRequest['targetAudience']
  ): PromptTemplate {
    const key = `${summaryType}-${targetAudience}`;
    return this.summaryTemplates.get(key) || this.summaryTemplates.get('comprehensive-general')!;
  }

  private buildSystemPrompt(template: PromptTemplate, request: SummaryLLMRequest): string {
    return request.systemPrompt || template.systemPrompt;
  }

  private buildUserPrompt(template: PromptTemplate, request: SummaryLLMRequest): string {
    if (request.userPrompt) return request.userPrompt;

    let prompt = template.userPromptTemplate;
    const context = request.context;

    // Replace template variables
    prompt = prompt.replace('{concept}', context.concept);
    prompt = prompt.replace('{domain}', context.domain);
    prompt = prompt.replace('{materials}', context.materials?.join(', ') || 'various materials');
    prompt = prompt.replace('{mechanisms}', context.mechanisms?.join(', ') || 'various mechanisms');
    prompt = prompt.replace('{methods}', context.methods?.join(', ') || 'various methods');
    prompt = prompt.replace('{applications}', context.applications?.join(', ') || 'various applications');
    prompt = prompt.replace('{length}', request.length);
    
    // Handle conditional sections
    prompt = prompt.replace(
      /\{includeReferences \? "([^"]*)" : "([^"]*)"\}/g,
      request.includeReferences ? '$1' : '$2'
    );
    prompt = prompt.replace(
      /\{includeFutureWork \? "([^"]*)" : "([^"]*)"\}/g,
      request.includeFutureWork ? '$1' : '$2'
    );

    return prompt;
  }

  private formatContext(context: ResearchLLMContext): string {
    const parts = [`Research Domain: ${context.domain}`, `Main Concept: ${context.concept}`];
    
    if (context.materials?.length) {
      parts.push(`Materials: ${context.materials.join(', ')}`);
    }
    if (context.mechanisms?.length) {
      parts.push(`Mechanisms: ${context.mechanisms.join(', ')}`);
    }
    if (context.methods?.length) {
      parts.push(`Methods: ${context.methods.join(', ')}`);
    }
    if (context.applications?.length) {
      parts.push(`Applications: ${context.applications.join(', ')}`);
    }

    return parts.join('\n');
  }

  private getMaxTokensForLength(length: SummaryLLMRequest['length']): number {
    switch (length) {
      case 'brief': return 800;
      case 'standard': return 1500;
      case 'detailed': return 2500;
      case 'comprehensive': return 4000;
      default: return 1500;
    }
  }

  private parseSummaryContent(content: string, request: SummaryLLMRequest): SummaryLLMResult['summary'] {
    // Simple parsing - in production you might want more sophisticated extraction
    const lines = content.split('\n').filter(line => line.trim());
    
    const sections = {
      abstract: '',
      keyFindings: [] as string[],
      methodology: '',
      implications: [] as string[],
      futureWork: [] as string[],
      references: [] as string[]
    };

    let currentSection = 'abstract';
    let abstractLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.match(/^(abstract|overview|introduction)/i)) {
        currentSection = 'abstract';
      } else if (trimmed.match(/^(key findings|findings|discoveries)/i)) {
        currentSection = 'keyFindings';
      } else if (trimmed.match(/^(methodology|approach|methods)/i)) {
        currentSection = 'methodology';
      } else if (trimmed.match(/^(implications|significance|impact)/i)) {
        currentSection = 'implications';
      } else if (trimmed.match(/^(future work|future|next steps)/i)) {
        currentSection = 'futureWork';
      } else if (trimmed.match(/^(references|sources)/i)) {
        currentSection = 'references';
      } else if (trimmed && !trimmed.match(/^\d+\./)) {
        // Content line
        if (currentSection === 'abstract') {
          abstractLines.push(trimmed);
        } else if (trimmed.match(/^[-•*]/)) {
          // Bullet point
          const cleanBullet = trimmed.replace(/^[-•*]\s*/, '');
          if (currentSection === 'keyFindings') {
            sections.keyFindings.push(cleanBullet);
          } else if (currentSection === 'implications') {
            sections.implications.push(cleanBullet);
          } else if (currentSection === 'futureWork') {
            sections.futureWork.push(cleanBullet);
          } else if (currentSection === 'references') {
            sections.references.push(cleanBullet);
          }
        } else if (currentSection === 'methodology') {
          sections.methodology += (sections.methodology ? ' ' : '') + trimmed;
        }
      }
    }

    sections.abstract = abstractLines.join(' ');

    return sections;
  }

  private getEmptySummary(): SummaryLLMResult['summary'] {
    return {
      abstract: '',
      keyFindings: [],
      methodology: '',
      implications: [],
      futureWork: [],
      references: []
    };
  }
} 