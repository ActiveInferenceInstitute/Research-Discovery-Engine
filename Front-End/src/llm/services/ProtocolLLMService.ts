/**
 * Protocol LLM Service
 * 
 * Specialized service for generating experimental protocols using LLM
 */

import { LLMService } from '../LLMService';
import { 
  ProtocolLLMRequest, 
  ProtocolLLMResult, 
  LLMConfig,
  ResearchLLMContext,
  PromptTemplate 
} from '../types';

export class ProtocolLLMService extends LLMService {
  private protocolTemplates: Map<string, PromptTemplate>;

  constructor(config: LLMConfig) {
    super(config);
    this.protocolTemplates = this.initializeProtocolTemplates();
  }

  /**
   * Generate an experimental protocol using LLM
   */
  async generateProtocol(request: ProtocolLLMRequest): Promise<ProtocolLLMResult> {
    const template = this.getProtocolTemplate(request.protocolType, request.detailLevel);
    const systemPrompt = this.buildSystemPrompt(template, request);
    const userPrompt = this.buildUserPrompt(template, request);

    const llmRequest = {
      systemPrompt,
      userPrompt,
      context: this.formatContext(request.context),
      config: {
        temperature: 0.3, // Lower temperature for more structured, precise protocols
        maxTokens: this.getMaxTokensForDetail(request.detailLevel),
        ...request.config
      }
    };

    const result = await this.generateText(llmRequest);
    
    if (!result.success) {
      return {
        ...result,
        protocol: this.getEmptyProtocol()
      } as ProtocolLLMResult;
    }

    return {
      ...result,
      protocol: this.parseProtocolContent(result.content, request)
    } as ProtocolLLMResult;
  }

  /**
   * Generate safety assessment for a protocol
   */
  async generateSafetyAssessment(
    context: ResearchLLMContext,
    protocolContent: string
  ): Promise<{ 
    safetyRating: 'low' | 'medium' | 'high';
    hazards: string[];
    mitigations: string[];
    requirements: string[];
  }> {
    const systemPrompt = `You are an expert laboratory safety officer evaluating experimental protocols.
Analyze the protocol for potential hazards and provide comprehensive safety guidance.
Focus on material safety, equipment hazards, procedural risks, and environmental considerations.`;

    const userPrompt = `Evaluate the safety aspects of this experimental protocol:

Research Context:
${this.formatContext(context)}

Protocol:
${protocolContent}

Provide a safety assessment including:
1. Overall risk level (low/medium/high)
2. Identified hazards
3. Required safety mitigations
4. Special requirements or certifications needed

Format as structured sections.`;

    const result = await this.generateText({
      systemPrompt,
      userPrompt,
      config: { temperature: 0.2, maxTokens: 1500 }
    });

    if (!result.success) {
      return {
        safetyRating: 'high',
        hazards: ['Unable to assess - assume high risk'],
        mitigations: ['Seek expert consultation'],
        requirements: ['Professional safety review required']
      };
    }

    return this.parseSafetyAssessment(result.content);
  }

  private initializeProtocolTemplates(): Map<string, PromptTemplate> {
    const templates = new Map<string, PromptTemplate>();

    templates.set('synthesis-basic', {
      name: 'Basic Synthesis Protocol',
      description: 'Simple synthesis protocol for basic materials',
      systemPrompt: `You are an experienced materials scientist creating synthesis protocols.
Focus on clear, step-by-step procedures that can be followed safely in a standard laboratory.
Include essential safety considerations and quality control measures.`,
      userPromptTemplate: `Create a synthesis protocol for: {concept}

Materials Context:
- Primary materials: {materials}
- Key mechanisms: {mechanisms}
- Target applications: {applications}

Requirements:
- Detail level: {detailLevel}
- Protocol type: synthesis

Structure your protocol as:
1. Objective
2. Materials List
3. Equipment Required
4. Safety Considerations
5. Procedure (step-by-step)
6. Characterization Methods
7. Expected Outcomes
8. Troubleshooting`,
      variables: ['concept', 'materials', 'mechanisms', 'applications', 'detailLevel'],
      defaultConfig: { temperature: 0.3, maxTokens: 2000 }
    });

    templates.set('characterization-intermediate', {
      name: 'Intermediate Characterization Protocol',
      description: 'Detailed characterization protocol with multiple techniques',
      systemPrompt: `You are an expert in materials characterization creating comprehensive analysis protocols.
Design protocols that provide thorough understanding of material properties and performance.
Include multiple complementary techniques and statistical considerations.`,
      userPromptTemplate: `Develop a characterization protocol for: {concept}

Research Context:
- Materials to analyze: {materials}
- Key mechanisms to study: {mechanisms}
- Target properties for {applications}

Requirements:
- Detail level: {detailLevel}
- Focus: comprehensive characterization
{timeConstraints ? "- Timeline: {timeConstraints}" : ""}

Include:
1. Protocol Overview
2. Sample Preparation
3. Characterization Techniques
4. Data Collection Procedures
5. Analysis Methods
6. Quality Assurance
7. Expected Results
8. Interpretation Guidelines`,
      variables: ['concept', 'materials', 'mechanisms', 'applications', 'detailLevel', 'timeConstraints'],
      defaultConfig: { temperature: 0.3, maxTokens: 2500 }
    });

    templates.set('testing-advanced', {
      name: 'Advanced Testing Protocol',
      description: 'Sophisticated testing protocol for performance evaluation',
      systemPrompt: `You are a senior researcher designing advanced testing protocols for cutting-edge materials.
Create rigorous, scientifically sound protocols that can validate novel concepts and provide publishable data.
Include statistical design, controls, and comprehensive analysis frameworks.`,
      userPromptTemplate: `Design an advanced testing protocol for: {concept}

Research Framework:
- Novel materials: {materials}
- Mechanisms under investigation: {mechanisms}
- Performance targets: {applications}

Protocol Requirements:
- Sophistication: {detailLevel}
- Testing focus: performance validation
{safetyRequirements ? "- Safety requirements: {safetyRequirements}" : ""}

Deliver:
1. Executive Summary
2. Experimental Design
3. Materials & Equipment
4. Safety Protocol
5. Detailed Procedures
6. Data Collection Framework
7. Statistical Analysis Plan
8. Success Criteria
9. Risk Management
10. Publication Considerations`,
      variables: ['concept', 'materials', 'mechanisms', 'applications', 'detailLevel', 'safetyRequirements'],
      defaultConfig: { temperature: 0.3, maxTokens: 3500 }
    });

    templates.set('comprehensive-advanced', {
      name: 'Comprehensive Research Protocol',
      description: 'Complete research protocol covering all phases',
      systemPrompt: `You are a research director creating comprehensive protocols for groundbreaking research projects.
Design complete experimental frameworks that cover synthesis, characterization, testing, and analysis.
Ensure scientific rigor, reproducibility, and consideration of broader implications.`,
      userPromptTemplate: `Create a comprehensive research protocol for: {concept}

Complete Research Context:
- Core materials: {materials}
- Key mechanisms: {mechanisms}
- Methods to employ: {methods}
- Target applications: {applications}

Project Scope:
- Complexity: {detailLevel}
- Full research lifecycle
{timeConstraints ? "- Project timeline: {timeConstraints}" : ""}
{resourceConstraints ? "- Available resources: {resourceConstraints}" : ""}

Comprehensive Protocol Structure:
1. Research Overview & Objectives
2. Literature Foundation
3. Materials & Methods
4. Synthesis Protocols
5. Characterization Framework
6. Performance Testing
7. Data Management Plan
8. Safety & Risk Assessment
9. Quality Assurance
10. Analysis & Interpretation
11. Reporting & Dissemination
12. Project Management`,
      variables: ['concept', 'materials', 'mechanisms', 'methods', 'applications', 'detailLevel', 'timeConstraints', 'resourceConstraints'],
      defaultConfig: { temperature: 0.3, maxTokens: 4000 }
    });

    return templates;
  }

  private getProtocolTemplate(
    protocolType: ProtocolLLMRequest['protocolType'], 
    detailLevel: ProtocolLLMRequest['detailLevel']
  ): PromptTemplate {
    const key = `${protocolType}-${detailLevel}`;
    return this.protocolTemplates.get(key) || this.protocolTemplates.get('synthesis-basic')!;
  }

  private buildSystemPrompt(template: PromptTemplate, request: ProtocolLLMRequest): string {
    return request.systemPrompt || template.systemPrompt;
  }

  private buildUserPrompt(template: PromptTemplate, request: ProtocolLLMRequest): string {
    if (request.userPrompt) return request.userPrompt;

    let prompt = template.userPromptTemplate;
    const context = request.context;

    // Replace template variables
    prompt = prompt.replace('{concept}', context.concept);
    prompt = prompt.replace('{materials}', context.materials?.join(', ') || 'various materials');
    prompt = prompt.replace('{mechanisms}', context.mechanisms?.join(', ') || 'various mechanisms');
    prompt = prompt.replace('{methods}', context.methods?.join(', ') || 'standard methods');
    prompt = prompt.replace('{applications}', context.applications?.join(', ') || 'research applications');
    prompt = prompt.replace('{detailLevel}', request.detailLevel);
    
    // Handle optional constraints
    if (request.timeConstraints) {
      prompt = prompt.replace('{timeConstraints}', request.timeConstraints);
    }
    if (request.resourceConstraints?.length) {
      prompt = prompt.replace('{resourceConstraints}', request.resourceConstraints.join(', '));
    }
    if (request.safetyRequirements?.length) {
      prompt = prompt.replace('{safetyRequirements}', request.safetyRequirements.join(', '));
    }

    // Remove unfilled placeholders
    prompt = prompt.replace(/\{[^}]*\}/g, '');

    return prompt;
  }

  private formatContext(context: ResearchLLMContext): string {
    const parts = [`Research Focus: ${context.concept}`, `Domain: ${context.domain}`];
    
    if (context.materials?.length) {
      parts.push(`Key Materials: ${context.materials.join(', ')}`);
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

  private getMaxTokensForDetail(detailLevel: ProtocolLLMRequest['detailLevel']): number {
    switch (detailLevel) {
      case 'basic': return 2000;
      case 'intermediate': return 3000;
      case 'advanced': return 4000;
      default: return 2500;
    }
  }

  private parseProtocolContent(content: string, request: ProtocolLLMRequest): ProtocolLLMResult['protocol'] {
    const lines = content.split('\n').filter(line => line.trim());
    
    const protocol = {
      title: '',
      objective: '',
      materials: [] as string[],
      equipment: [] as string[],
      procedures: [] as Array<{ step: number; description: string; duration?: string; safety?: string[] }>,
      analysis: [] as string[],
      expectedOutcomes: [] as string[],
      troubleshooting: [] as Array<{ issue: string; solution: string }>
    };

    let currentSection = 'title';
    let stepCounter = 1;

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Section detection
      if (trimmed.match(/^(objective|goal|purpose)/i)) {
        currentSection = 'objective';
      } else if (trimmed.match(/^(materials?|chemicals?|reagents?)/i)) {
        currentSection = 'materials';
      } else if (trimmed.match(/^(equipment|instruments?|apparatus)/i)) {
        currentSection = 'equipment';
      } else if (trimmed.match(/^(procedure|method|steps?)/i)) {
        currentSection = 'procedures';
        stepCounter = 1;
      } else if (trimmed.match(/^(analysis|characterization|measurement)/i)) {
        currentSection = 'analysis';
      } else if (trimmed.match(/^(expected|outcomes?|results?)/i)) {
        currentSection = 'expectedOutcomes';
      } else if (trimmed.match(/^(troubleshooting|problems?|issues?)/i)) {
        currentSection = 'troubleshooting';
      } else if (trimmed && !trimmed.match(/^\d+\./)) {
        // Content processing
        if (currentSection === 'title' && !protocol.title) {
          protocol.title = trimmed.replace(/^(protocol|title):\s*/i, '');
        } else if (currentSection === 'objective' && !protocol.objective) {
          protocol.objective = trimmed.replace(/^(objective|goal|purpose):\s*/i, '');
        } else if (trimmed.match(/^[-•*]/)) {
          // Bullet points
          const cleanItem = trimmed.replace(/^[-•*]\s*/, '');
          if (currentSection === 'materials') {
            protocol.materials.push(cleanItem);
          } else if (currentSection === 'equipment') {
            protocol.equipment.push(cleanItem);
          } else if (currentSection === 'analysis') {
            protocol.analysis.push(cleanItem);
          } else if (currentSection === 'expectedOutcomes') {
            protocol.expectedOutcomes.push(cleanItem);
          }
        } else if (currentSection === 'procedures' && trimmed.match(/^\d+\./)) {
          // Numbered procedure steps
          const stepText = trimmed.replace(/^\d+\.\s*/, '');
          protocol.procedures.push({
            step: stepCounter++,
            description: stepText
          });
        } else if (currentSection === 'troubleshooting') {
          // Simple troubleshooting parsing
          if (trimmed.includes(':')) {
            const [issue, solution] = trimmed.split(':', 2);
            protocol.troubleshooting.push({
              issue: issue.trim(),
              solution: solution.trim()
            });
          }
        }
      }
    }

    // Set default title if none found
    if (!protocol.title) {
      protocol.title = `${request.protocolType.charAt(0).toUpperCase() + request.protocolType.slice(1)} Protocol for ${request.context.concept}`;
    }

    return protocol;
  }

  private parseSafetyAssessment(content: string): {
    safetyRating: 'low' | 'medium' | 'high';
    hazards: string[];
    mitigations: string[];
    requirements: string[];
  } {
    const lines = content.split('\n').filter(line => line.trim());
    
    let safetyRating: 'low' | 'medium' | 'high' = 'medium';
    const hazards: string[] = [];
    const mitigations: string[] = [];
    const requirements: string[] = [];
    
    let currentSection = '';

    for (const line of lines) {
      const trimmed = line.trim().toLowerCase();
      
      if (trimmed.includes('risk level') || trimmed.includes('safety rating')) {
        if (trimmed.includes('low')) safetyRating = 'low';
        else if (trimmed.includes('high')) safetyRating = 'high';
        else safetyRating = 'medium';
      } else if (trimmed.includes('hazard')) {
        currentSection = 'hazards';
      } else if (trimmed.includes('mitigation') || trimmed.includes('safety measure')) {
        currentSection = 'mitigations';
      } else if (trimmed.includes('requirement') || trimmed.includes('certification')) {
        currentSection = 'requirements';
      } else if (line.trim().match(/^[-•*]/)) {
        const cleanItem = line.trim().replace(/^[-•*]\s*/, '');
        if (currentSection === 'hazards') hazards.push(cleanItem);
        else if (currentSection === 'mitigations') mitigations.push(cleanItem);
        else if (currentSection === 'requirements') requirements.push(cleanItem);
      }
    }

    return { safetyRating, hazards, mitigations, requirements };
  }

  private getEmptyProtocol(): ProtocolLLMResult['protocol'] {
    return {
      title: 'Protocol Generation Failed',
      objective: '',
      materials: [],
      equipment: [],
      procedures: [],
      analysis: [],
      expectedOutcomes: [],
      troubleshooting: []
    };
  }
} 