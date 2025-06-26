#!/usr/bin/env tsx

/**
 * LLM-Enhanced Summary Generator
 * 
 * Uses OpenAI API to generate intelligent research summaries with deep analysis
 */

import { loadEnvironment } from './load-env';
import { createSummaryService, createProviderService } from '../src/llm/utils/factory';
import { createMockConceptDesignState } from '../src/utils/testUtils';
import { SummaryLLMRequest } from '../src/llm/types';
import * as fs from 'fs';
import * as path from 'path';

interface CliOptions {
  concept?: string;
  domain?: string;
  format?: 'markdown' | 'json';
  headless?: boolean;
  headlessOutput?: string;
  verbose?: boolean;
  help?: boolean;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--concept':
        options.concept = args[++i];
        break;
      case '--domain':
        options.domain = args[++i];
        break;
      case '--format':
        const format = args[++i];
        if (['markdown', 'json'].includes(format)) {
          options.format = format as 'markdown' | 'json';
        }
        break;
      case '--headless':
        options.headless = true;
        break;
      case '--headless-output':
        options.headlessOutput = args[++i];
        break;
      case '--verbose':
        options.verbose = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
    }
  }

  return options;
}

function showHelp() {
  console.log(`
LLM-Enhanced Summary Generator

Usage:
  npx tsx scripts/llm-generate-summary.ts [options]

Options:
  --concept name           Research concept to summarize
  --domain domain          Research domain (e.g., materials science, chemistry)
  --format format         Output format: markdown, json (default: markdown)
  --headless              Run in headless mode (no interactive prompts)
  --headless-output dir   Directory for headless output
  --verbose               Show detailed processing information
  --help, -h              Show this help message

Examples:
  # Generate summary for a specific concept
  npx tsx scripts/llm-generate-summary.ts --concept "Smart Materials"

  # Generate JSON output in headless mode
  npx tsx scripts/llm-generate-summary.ts --concept "Nanocomposites" --format json --headless

  # Generate with custom output directory
  npx tsx scripts/llm-generate-summary.ts --concept "Polymers" --headless-output ./results
`);
}

async function generateLLMSummary(concept: string, options: CliOptions): Promise<any> {
  if (options.verbose) {
    console.log(`🤖 Generating LLM-enhanced summary for: ${concept}`);
  }

  try {
    // Create LLM service based on provider
    const apiProvider = process.env.API_PROVIDER || 'openai';
    const summaryService = apiProvider === 'openrouter'
      ? createProviderService('openrouter')
      : createSummaryService();

    // Create concept state
    const conceptState = createMockConceptDesignState({ objective: concept });

    // Prepare LLM request
    const request: SummaryLLMRequest = {
      context: {
        concept: concept,
        domain: options.domain || 'materials science',
        materials: conceptState.components.materials,
        mechanisms: conceptState.components.mechanisms,
        methods: conceptState.components.methods,
        theoreticalConcepts: conceptState.components.theoretical_concepts,
        applications: ['aerospace', 'biomedical', 'electronics', 'automotive']
      },
      summaryType: 'comprehensive',
      targetAudience: 'researcher',
      length: 'detailed',
      includeReferences: true,
      includeFutureWork: true,
      userPrompt: `Generate a comprehensive research summary for ${concept}. Include current state of the art, key challenges, recent breakthroughs, and future research directions.`,
      config: {
        maxTokens: 2000,
        temperature: 0.7
      }
    };

    // Generate summary using LLM
    const result = await summaryService.generateSummary(request);

    if (!result.success) {
      throw new Error(`LLM summary generation failed: ${result.error}`);
    }

    if (options.verbose) {
      console.log(`✅ LLM summary generated successfully`);
      console.log(`📊 Token usage: ${result.usage.totalTokens} total (${result.usage.promptTokens} prompt + ${result.usage.completionTokens} completion)`);
      console.log(`⏱️  Generation time: ${result.metadata.duration}ms`);
    }

    // Create output object
    const output = {
      concept,
      llmSummary: {
        content: result.content,
        metadata: {
          model: result.metadata.model,
          temperature: result.metadata.temperature,
          tokenUsage: result.usage,
          generationTime: result.metadata.duration,
          timestamp: new Date().toISOString()
        }
      },
      conceptState,
      analysis: {
        wordCount: result.content.split(' ').length,
        readingTime: Math.ceil(result.content.split(' ').length / 200),
        complexity: result.usage.totalTokens > 1000 ? 'high' : 'medium',
        keyTopics: extractKeyTopics(result.content)
      }
    };

    return output;

  } catch (error) {
    console.error('❌ Error generating LLM summary:', error);
    throw error;
  }
}

function extractKeyTopics(content: string): string[] {
  // Simple keyword extraction - could be enhanced with NLP
  const keywords = [
    'polymer', 'composite', 'nanoparticle', 'material', 'synthesis',
    'characterization', 'properties', 'application', 'performance',
    'structure', 'function', 'mechanism', 'process', 'technology'
  ];
  
  const found = keywords.filter(keyword => 
    content.toLowerCase().includes(keyword)
  );
  
  return found.slice(0, 5);
}

function formatOutput(data: any, format: string): string {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }
  
  // Default markdown format
  const summary = data.llmSummary;
  const analysis = data.analysis;
  
  return `# LLM-Enhanced Research Summary: ${data.concept}

**Generated:** ${summary.metadata.timestamp}
**Model:** ${summary.metadata.model}
**Token Usage:** ${summary.metadata.tokenUsage.totalTokens} tokens
**Generation Time:** ${summary.metadata.generationTime}ms

## AI-Generated Summary

${summary.content}

## Analysis

- **Word Count:** ${analysis.wordCount}
- **Reading Time:** ${analysis.readingTime} minutes
- **Complexity:** ${analysis.complexity}
- **Key Topics:** ${analysis.keyTopics.join(', ')}

## Concept Components

### Materials
${data.conceptState.components.materials.map((m: string) => `- ${m}`).join('\n')}

### Mechanisms
${data.conceptState.components.mechanisms.map((m: string) => `- ${m}`).join('\n')}

### Methods
${data.conceptState.components.methods.map((m: string) => `- ${m}`).join('\n')}

### Theoretical Concepts
${data.conceptState.components.theoretical_concepts.map((t: string) => `- ${t}`).join('\n')}

---
*Generated using OpenAI LLM integration*
`;
}

function saveHeadlessOutput(data: any, format: string, options: CliOptions): string {
  const baseDir = options.headlessOutput || './llm-summary-output';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outputDir = path.join(baseDir, `llm-summary_${timestamp}`);
  
  // Create output directory
  fs.mkdirSync(outputDir, { recursive: true });
  
  // Save core output
  const coreOutputPath = path.join(outputDir, 'core-output.json');
  fs.writeFileSync(coreOutputPath, JSON.stringify(data, null, 2));
  
  // Save formatted summary
  const summaryPath = path.join(outputDir, `summary.${format}`);
  const formattedContent = formatOutput(data, format);
  fs.writeFileSync(summaryPath, formattedContent);
  
  // Save processing report
  const reportPath = path.join(outputDir, 'processing-report.json');
  const report = {
    script: 'llm-generate-summary.ts',
    timestamp: new Date().toISOString(),
    concept: data.concept,
    domain: options.domain || 'materials science',
    apiProvider: process.env.API_PROVIDER || 'openai',
    llmModel: data.llmSummary.metadata.model,
    tokenUsage: data.llmSummary.metadata.tokenUsage,
    processingTime: data.llmSummary.metadata.generationTime,
    outputFiles: ['core-output.json', `summary.${format}`, 'processing-report.json'],
    status: 'success'
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`📁 Headless output saved to: ${outputDir}`);
  console.log(`📄 Core output: ${coreOutputPath}`);
  console.log(`📝 Summary: ${summaryPath}`);
  console.log(`📊 Report: ${reportPath}`);
  
  return outputDir;
}

async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    return;
  }

  const apiProvider = process.env.API_PROVIDER || 'openai';
  console.log(`🤖 LLM-Enhanced Research Summary Generator (using ${apiProvider})\n`);

  // Load and verify environment variables
  const envResult = loadEnvironment();
  if (!envResult.success) {
    console.error('❌ Error:', envResult.message);
    console.error(`Please set your ${apiProvider === 'openrouter' ? 'OpenRouter' : 'OpenAI'} API key in the .env file`);
    process.exit(1);
  }
  
  console.log('✅', envResult.message);
  if (envResult.apiKeyPreview) {
    console.log('🔑 API Key:', envResult.apiKeyPreview);
  }

  try {
    const concept = options.concept || 'Advanced Materials Research';
    const domain = options.domain || 'materials science';
    const format = options.format || 'markdown';

    console.log(`🔬 Concept: ${concept}`);
    console.log(`🔬 Domain: ${domain}`);
    console.log(`📄 Format: ${format}`);
    
    if (options.headless) {
      console.log('🤖 Running in headless mode...');
    }

    // Generate LLM summary
    const summaryData = await generateLLMSummary(concept, options);

    if (options.headless) {
      // Save to files
      const outputDir = saveHeadlessOutput(summaryData, format, options);
      console.log(`\n✅ LLM summary generation completed successfully`);
      console.log(`📁 Output directory: ${outputDir}`);
    } else {
      // Display to console
      const formattedOutput = formatOutput(summaryData, format);
      console.log('\n' + '='.repeat(80));
      console.log(formattedOutput);
      console.log('='.repeat(80));
    }

  } catch (error) {
    console.error('\n❌ Error during LLM summary generation:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateLLMSummary, formatOutput }; 