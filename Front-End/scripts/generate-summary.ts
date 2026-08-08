#!/usr/bin/env tsx
/**
 * Standalone Summary Generator Script
 * 
 * This script demonstrates how to use the summary generation utilities
 * outside of the main application framework.
 * 
 * Usage:
 *   npx tsx DE/scripts/generate-summary.ts [options]
 * 
 * Options:
 *   --concept "concept name"              Target concept for summary
 *   --format markdown|json                Output format
 *   --headless                           Enable headless mode with file output
 *   --headless-output ./path             Custom output directory for headless mode
 *   --help, -h                          Show help message
 */

import { generateSummary, formatSummaryAsMarkdown, createStandaloneSummary } from '../src/utils/summaryGenerator';
import { ConceptDesignState } from '../src/types';

/**
 * Create a sample concept for demonstration
 */
function createSampleConcept(): Partial<ConceptDesignState> {
  return {
    objective: "Bio-Inspired Adaptive Material System",
    components: {
      materials: ["Shape_Memory_Polymer", "Carbon_Nanotubes", "Hydrogel_Matrix"],
      mechanisms: ["Shape_Memory_Effect", "Electrical_Conductivity", "pH_Sensitivity"],
      methods: ["3D_Printing", "Electrospinning", "Chemical_Crosslinking"],
      theoretical_concepts: ["Smart_Materials_Theory", "Biomimetics"]
    },
    cssVectorDraft: {
      context: {
        material_primary: ["Shape_Memory_Polymer", "Carbon_Nanotubes"],
        environment_type: "Physiological_Conditions"
      },
      constraints: {
        objective_type: "Adaptive_Response"
      }
    }
  };
}

interface CliOptions {
  concept?: string;
  format?: 'markdown' | 'json';
  headless?: boolean;
  headlessOutput?: string;
  help?: boolean;
}

/**
 * Parse command line arguments
 */
function parseArgs(): CliOptions {
  const args = (globalThis as any).process?.argv?.slice(2) || [];
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--concept':
        options.concept = args[++i];
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
        options.headless = true;
        options.headlessOutput = args[++i];
        break;
    }
  }

  return options;
}

/**
 * Display help information
 */
function showHelp() {
  console.log(`
Standalone Summary Generator

Usage:
  npx tsx DE/scripts/generate-summary.ts [options]

Options:
  --concept "name"            Target concept for summary
  --format format             Output format: markdown, json (default)
  --headless                  Enable headless mode with file output
  --headless-output dir       Custom output directory for headless mode
  --help, -h                 Show this help message

Examples:
  # Generate summary with default settings
  npx tsx DE/scripts/generate-summary.ts

  # Generate summary for specific concept
  npx tsx DE/scripts/generate-summary.ts --concept "Bio-Inspired Materials"

  # Headless mode with timestamped output
  npx tsx DE/scripts/generate-summary.ts --headless --format json

  # Headless mode with custom output directory
  npx tsx DE/scripts/generate-summary.ts --headless-output ./my-summaries
`);
}

/**
 * Initialize headless output (simplified implementation)
 */
async function setupHeadlessOutput(options: CliOptions) {
  if (!options.headless) return null;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outputDir = `${options.headlessOutput || './output'}/generate-summary_${timestamp}`;
  
  // Create output structure
  const headlessOutput = {
    outputDir,
    results: {} as any,
    report: {
      scriptName: 'generate-summary.ts',
      timestamp: new Date().toISOString(),
      startTime: Date.now(),
      inputFiles: [] as string[],
      processingSteps: [] as string[],
      outputFiles: [] as string[],
      errors: [] as string[],
      warnings: [] as string[],
      summary: '',
      duration: 0
    }
  };

  headlessOutput.report.processingSteps.push('Headless output system initialized');
  return headlessOutput;
}

/**
 * Save headless results (simplified implementation)
 */
async function saveHeadlessResults(headlessOutput: any, results: any) {
  if (!headlessOutput) return;

  try {
    // Use dynamic import to avoid TypeScript issues
    const fs = await import('fs');
    const path = await import('path');

    await fs.promises.mkdir(headlessOutput.outputDir, { recursive: true });

    // Update report
    headlessOutput.report.duration = Date.now() - headlessOutput.report.startTime;
    headlessOutput.report.results = results;
    headlessOutput.report.summary = `Summary generated successfully with ${results.summary?.metadata?.wordCount || 0} words`;

    // Save core output
    const coreOutputPath = path.join(headlessOutput.outputDir, 'core-output.json');
    await fs.promises.writeFile(coreOutputPath, JSON.stringify(results, null, 2));
    headlessOutput.report.outputFiles.push('core-output.json');

    // Save processing report
    const reportPath = path.join(headlessOutput.outputDir, 'processing-report.json');
    await fs.promises.writeFile(reportPath, JSON.stringify(headlessOutput.report, null, 2));

    // Save markdown output
    if (results.markdown) {
      const markdownPath = path.join(headlessOutput.outputDir, 'summary.md');
      await fs.promises.writeFile(markdownPath, results.markdown);
      headlessOutput.report.outputFiles.push('summary.md');
    }

    // Save human-readable summary
    const summaryContent = `# Summary Generation Report

## Overview
- **Script**: ${headlessOutput.report.scriptName}
- **Timestamp**: ${headlessOutput.report.timestamp}
- **Duration**: ${(headlessOutput.report.duration / 1000).toFixed(2)}s
- **Status**: ${headlessOutput.report.errors.length === 0 ? '✅ Success' : '❌ Failed'}

## Processing Steps
${headlessOutput.report.processingSteps.map((step: string) => `- ${step}`).join('\n')}

## Output Files
${headlessOutput.report.outputFiles.map((file: string) => `- ${file}`).join('\n')}

## Summary
${headlessOutput.report.summary}

## Results Overview
- **Word Count**: ${results.summary?.metadata?.wordCount || 'N/A'}
- **Reading Time**: ${results.summary?.metadata?.readingTime || 'N/A'}
- **Complexity**: ${results.summary?.metadata?.complexity || 'N/A'}
- **Keywords**: ${results.summary?.metadata?.keywords?.join(', ') || 'None'}
`;

    const summaryPath = path.join(headlessOutput.outputDir, 'report-summary.md');
    await fs.promises.writeFile(summaryPath, summaryContent);

    console.log(`\n📁 Headless output saved to: ${headlessOutput.outputDir}`);
    console.log(`📄 Core output: ${coreOutputPath}`);
    console.log(`📊 Report: ${reportPath}`);
    console.log(`📝 Summary: ${summaryPath}`);

  } catch (error) {
    console.error('❌ Failed to save headless output:', error);
  }
}

/**
 * Main demonstration function
 */
async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    return;
  }

  console.log('📊 Research Discovery Engine - Summary Generator\n');

  // Initialize headless output if requested
  const headlessOutput = await setupHeadlessOutput(options);

  try {
    // Create sample concept or use provided concept
    const conceptData = createSampleConcept();
    if (options.concept) {
      conceptData.objective = options.concept;
      if (headlessOutput) {
        headlessOutput.report.processingSteps.push(`Using custom concept: ${options.concept}`);
      }
    }
    
    if (!options.headless) {
      console.log('🔄 Generating summary...\n');
    }
    
    if (headlessOutput) {
      headlessOutput.report.processingSteps.push('Summary generation started');
    }

    // Generate summary using standalone function
    const { summary, markdown } = createStandaloneSummary(conceptData, undefined, {
      summaryLength: 'standard',
      technicalLevel: 'technical',
      includeComponents: true,
      includeRelatedWork: false,
      includeRecommendations: true,
      outputFormat: options.format || 'markdown'
    });

    const results = {
      summary,
      markdown,
      concept: conceptData,
      options
    };

    if (headlessOutput) {
      headlessOutput.report.processingSteps.push('Summary generation completed');
      await saveHeadlessResults(headlessOutput, results);
    } else {
      // Display results in normal mode
      console.log('✅ Summary generated successfully!\n');
      console.log('📄 Summary Content:');
      console.log('═'.repeat(60));
      console.log(markdown);
      console.log('═'.repeat(60));
      console.log(`\n📊 Summary Metadata:`);
      console.log(`   Word Count: ${summary.metadata.wordCount}`);
      console.log(`   Reading Time: ${summary.metadata.readingTime}`);
      console.log(`   Complexity: ${summary.metadata.complexity}`);
      console.log(`   Completeness: ${summary.metadata.completeness}%`);
      console.log(`   Keywords: ${summary.metadata.keywords.join(', ')}`);
    }

  } catch (error) {
    const errorMsg = `Summary generation failed: ${error}`;
    if (headlessOutput) {
      headlessOutput.report.errors.push(errorMsg);
      await saveHeadlessResults(headlessOutput, { error: String(error) });
    }
    console.error('❌ Error generating summary:', error);
  }
}

// Run the demonstration
main(); 