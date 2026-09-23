#!/usr/bin/env tsx

/**
 * LLM-Enhanced Knowledge Processing Script
 * 
 * Uses OpenAI API to extract concepts, relationships, and insights from research text
 */

import { loadEnvironment } from './load-env';
import { createKnowledgeService, createProviderService } from '../src/llm/utils/factory';
import { KnowledgeProcessingLLMRequest } from '../src/llm/types';
import * as fs from 'fs';
import * as path from 'path';

interface CliOptions {
  text?: string;
  file?: string;
  domain?: string;
  type?: 'extract_concepts' | 'find_relationships' | 'generate_questions' | 'summarize' | 'classify';
  format?: 'structured' | 'narrative' | 'bullets' | 'json';
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
      case '--text':
        options.text = args[++i];
        break;
      case '--file':
        options.file = args[++i];
        break;
      case '--domain':
        options.domain = args[++i];
        break;
      case '--type':
        const type = args[++i];
        if (['extract_concepts', 'find_relationships', 'generate_questions', 'summarize', 'classify'].includes(type)) {
          options.type = type as any;
        }
        break;
      case '--format':
        const format = args[++i];
        if (['structured', 'narrative', 'bullets', 'json'].includes(format)) {
          options.format = format as any;
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
LLM-Enhanced Knowledge Processing Tool

Usage:
  npx tsx scripts/llm-process-knowledge.ts [options]

Options:
  --text "text"              Text to process (in quotes)
  --file path               File path to process
  --domain domain           Research domain (e.g., materials science, chemistry)
  --type type               Processing type: extract_concepts, find_relationships, 
                           generate_questions, summarize, classify
  --format format           Output format: structured, narrative, bullets, json
  --headless                Run in headless mode
  --headless-output dir     Directory for headless output
  --verbose                 Show detailed processing information
  --help, -h                Show this help message

Examples:
  # Extract concepts from text
  npx tsx scripts/llm-process-knowledge.ts --text "Smart materials..." --type extract_concepts

  # Process a research file
  npx tsx scripts/llm-process-knowledge.ts --file research.txt --domain "materials science"

  # Generate research questions
  npx tsx scripts/llm-process-knowledge.ts --text "..." --type generate_questions --format bullets
`);
}

async function processKnowledge(sourceText: string, options: CliOptions): Promise<any> {
  if (options.verbose) {
    console.log(`🧠 Processing knowledge with LLM...`);
    console.log(`📝 Text length: ${sourceText.length} characters`);
  }

  try {
    // Create appropriate service based on provider
    const apiProvider = process.env.API_PROVIDER || 'openai';
    const knowledgeService = apiProvider === 'openrouter'
      ? createProviderService('openrouter')
      : createKnowledgeService();
      
    const domain = options.domain || 'materials science';
    const processingType = options.type || 'extract_concepts';
    const outputFormat = options.format || 'structured';

    const request: KnowledgeProcessingLLMRequest = {
      sourceText,
      processingType,
      domain,
      outputFormat,
      userPrompt: createUserPrompt(processingType, domain, sourceText),
      config: {
        maxTokens: 1500,
        temperature: 0.7
      }
    };

    const result = await knowledgeService.processKnowledge(request);

    if (!result.success) {
      throw new Error(`Knowledge processing failed: ${result.error}`);
    }

    if (options.verbose) {
      console.log(`✅ Knowledge processing completed`);
      console.log(`📊 Token usage: ${result.usage.totalTokens} total`);
      console.log(`⏱️  Processing time: ${result.metadata.duration}ms`);
    }

    // Create output object
    const output = {
      sourceText: sourceText.substring(0, 500) + (sourceText.length > 500 ? '...' : ''),
      processing: {
        type: processingType,
        domain,
        format: outputFormat,
        result: result.content,
        extractedData: result.extractedData || {}
      },
      metadata: {
        provider: apiProvider,
        model: result.metadata.model,
        tokenUsage: result.usage,
        processingTime: result.metadata.duration,
        timestamp: new Date().toISOString()
      },
      analysis: {
        textLength: sourceText.length,
        wordsProcessed: sourceText.split(' ').length,
        complexity: result.usage.totalTokens > 800 ? 'high' : 'medium'
      }
    };

    return output;

  } catch (error) {
    console.error('❌ Error processing knowledge:', error);
    throw error;
  }
}

function createUserPrompt(type: string, domain: string, text: string): string {
  const prompts = {
    extract_concepts: `Extract key scientific concepts from the following ${domain} text. Identify materials, mechanisms, processes, and theoretical concepts. Provide a structured list.`,
    find_relationships: `Analyze the following ${domain} text and identify relationships between different concepts, materials, and processes. Show how they connect and influence each other.`,
    generate_questions: `Based on the following ${domain} research text, generate insightful research questions that could guide future investigations and explore knowledge gaps.`,
    summarize: `Provide a comprehensive summary of the following ${domain} text, highlighting key findings, methodologies, and implications.`,
    classify: `Classify and categorize the content of the following ${domain} text according to relevant scientific taxonomies and research areas.`
  };
  
  return prompts[type] || prompts.extract_concepts;
}

function formatOutput(data: any, format: string): string {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }
  
  // Default structured format
  return `# LLM Knowledge Processing Results

**Processing Type:** ${data.processing.type}
**Domain:** ${data.processing.domain}
**Timestamp:** ${data.metadata.timestamp}
**Model:** ${data.metadata.model}
**Provider:** ${data.metadata.provider}

## Source Text (Preview)
${data.sourceText}

## Processing Results

${data.processing.result}

## Extracted Data
${formatExtractedData(data.processing.extractedData)}

## Analysis
- **Text Length:** ${data.analysis.textLength} characters
- **Words Processed:** ${data.analysis.wordsProcessed}
- **Complexity:** ${data.analysis.complexity}
- **Token Usage:** ${data.metadata.tokenUsage.totalTokens}
- **Processing Time:** ${data.metadata.processingTime}ms

---
*Processed using OpenAI LLM integration*
`;
}

function formatExtractedData(extractedData: any): string {
  if (!extractedData || Object.keys(extractedData).length === 0) {
    return 'No structured data extracted.';
  }

  let formatted = '';
  
  if (extractedData.concepts) {
    formatted += `\n### Concepts\n${extractedData.concepts.map((c: string) => `- ${c}`).join('\n')}`;
  }
  
  if (extractedData.relationships) {
    formatted += `\n### Relationships\n${extractedData.relationships.map((r: any) => `- ${r.source} ${r.relationship} ${r.target}`).join('\n')}`;
  }
  
  if (extractedData.questions) {
    formatted += `\n### Generated Questions\n${extractedData.questions.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n')}`;
  }
  
  if (extractedData.classifications) {
    formatted += `\n### Classifications\n${Object.entries(extractedData.classifications).map(([key, value]) => `- **${key}:** ${value}`).join('\n')}`;
  }
  
  return formatted || 'No specific data structure available.';
}

function saveHeadlessOutput(data: any, format: string, options: CliOptions): string {
  const baseDir = options.headlessOutput || './llm-knowledge-output';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outputDir = path.join(baseDir, `llm-knowledge_${timestamp}`);
  
  // Create output directory
  fs.mkdirSync(outputDir, { recursive: true });
  
  // Save core output
  const coreOutputPath = path.join(outputDir, 'core-output.json');
  fs.writeFileSync(coreOutputPath, JSON.stringify(data, null, 2));
  
  // Save formatted results
  const resultsPath = path.join(outputDir, `results.${format === 'json' ? 'json' : 'md'}`);
  const formattedContent = formatOutput(data, format);
  fs.writeFileSync(resultsPath, formattedContent);
  
  // Save processing report
  const reportPath = path.join(outputDir, 'processing-report.json');
  const report = {
    script: 'llm-process-knowledge.ts',
    timestamp: new Date().toISOString(),
    processingType: data.processing.type,
    domain: data.processing.domain,
    apiProvider: process.env.API_PROVIDER || 'openai',
    llmModel: data.metadata.model,
    tokenUsage: data.metadata.tokenUsage,
    processingTime: data.metadata.processingTime,
    outputFiles: ['core-output.json', `results.${format === 'json' ? 'json' : 'md'}`, 'processing-report.json'],
    status: 'success'
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`📁 Headless output saved to: ${outputDir}`);
  console.log(`📄 Core output: ${coreOutputPath}`);
  console.log(`📝 Results: ${resultsPath}`);
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
  console.log(`🧠 LLM-Enhanced Knowledge Processing Tool (using ${apiProvider})\n`);

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
    // Get source text
    let sourceText = '';
    
    if (options.file) {
      if (!fs.existsSync(options.file)) {
        throw new Error(`File not found: ${options.file}`);
      }
      sourceText = fs.readFileSync(options.file, 'utf-8');
      console.log(`📄 Processing file: ${options.file}`);
    } else if (options.text) {
      sourceText = options.text;
      console.log(`📝 Processing provided text`);
    } else {
      // Default test text
      sourceText = `Smart materials represent a revolutionary class of engineered materials that can respond to external stimuli such as temperature, pH, electric fields, and mechanical stress. These materials, including shape memory alloys, conducting polymers, and hydrogels, have applications in aerospace, biomedical devices, and soft robotics. Current research focuses on improving response times, developing multi-stimuli responsive systems, and scaling manufacturing processes for commercial applications.`;
      console.log(`📝 Using default research text for demonstration`);
    }

    const domain = options.domain || 'materials science';
    const type = options.type || 'extract_concepts';
    const format = options.format || 'structured';

    console.log(`🔬 Domain: ${domain}`);
    console.log(`⚙️  Processing Type: ${type}`);
    console.log(`📄 Output Format: ${format}`);

    if (options.headless) {
      console.log('🤖 Running in headless mode...');
    }

    // Process knowledge with LLM
    const knowledgeData = await processKnowledge(sourceText, options);

    if (options.headless) {
      // Save to files
      const outputDir = saveHeadlessOutput(knowledgeData, format, options);
      console.log(`\n✅ Knowledge processing completed successfully`);
      console.log(`📁 Output directory: ${outputDir}`);
    } else {
      // Display to console
      const formattedOutput = formatOutput(knowledgeData, format);
      console.log('\n' + '='.repeat(80));
      console.log(formattedOutput);
      console.log('='.repeat(80));
    }

  } catch (error) {
    console.error('\n❌ Error during knowledge processing:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { processKnowledge, formatOutput }; 