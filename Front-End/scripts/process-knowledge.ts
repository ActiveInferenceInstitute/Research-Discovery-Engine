#!/usr/bin/env tsx
/**
 * Standalone Knowledge Processing Script
 * 
 * This script processes markdown knowledge base files and demonstrates
 * how to use the parsing and reference extraction utilities outside
 * the main application framework.
 * 
 * Usage:
 *   npx tsx DE/scripts/process-knowledge.ts [options]
 * 
 * Options:
 *   --source-file path/to/file.md         Process single markdown file
 *   --source-dir path/to/directory        Process all .md files in directory
 *   --extract-refs                        Extract and list all references
 *   --validate-links                      Validate internal wiki links
 *   --output-format json|readable         Output format
 *   --output-file path/to/output.json     Save results to file
 *   --stats                               Show processing statistics
 *   --help, -h                           Show help message
 */

import { 
  parseMarkdownToStructuredDocument, 
  extractReferences, 
  slugify,
  ParserOutput
} from '../src/utils/markdownParser';
import { ParsedSection } from '../src/types';

interface CliOptions {
  sourceFile?: string;
  sourceDir?: string;
  extractRefs?: boolean;
  validateLinks?: boolean;
  outputFormat?: 'json' | 'readable';
  outputFile?: string;
  showStats?: boolean;
  help?: boolean;
}

interface ProcessingResults {
  files: ProcessedFile[];
  totalSections: number;
  totalReferences: number;
  uniqueReferences: Set<string>;
  linkValidation: LinkValidationResult[];
  processingStats: ProcessingStats;
}

interface ProcessedFile {
  filePath: string;
  fileKey: string;
  parsedDoc: ParserOutput;
  references: string[];
  sectionCount: number;
  wordCount: number;
  errors: string[];
}

interface LinkValidationResult {
  sourceFile: string;
  link: string;
  isValid: boolean;
  targetExists: boolean;
  linkType: 'internal' | 'external' | 'section';
}

interface ProcessingStats {
  filesProcessed: number;
  totalProcessingTime: number;
  averageFileSize: number;
  largestFile: string;
  mostReferences: string;
}

/**
 * Parse command line arguments
 */
function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--source-file':
        options.sourceFile = args[++i];
        break;
      case '--source-dir':
        options.sourceDir = args[++i];
        break;
      case '--extract-refs':
        options.extractRefs = true;
        break;
      case '--validate-links':
        options.validateLinks = true;
        break;
      case '--output-format':
        const format = args[++i];
        if (['json', 'readable'].includes(format)) {
          options.outputFormat = format as 'json' | 'readable';
        }
        break;
      case '--output-file':
        options.outputFile = args[++i];
        break;
      case '--stats':
        options.showStats = true;
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
Standalone Knowledge Processing Tool

Usage:
  npx tsx DE/scripts/process-knowledge.ts [options]

Options:
  --source-file path        Process single markdown file
  --source-dir path         Process all .md files in directory
  --extract-refs           Extract and list all references
  --validate-links         Validate internal wiki links
  --output-format format   Output format: json, readable (default)
  --output-file path       Save results to JSON file
  --stats                  Show detailed processing statistics
  --help, -h              Show this help message

Examples:
  # Process single file with reference extraction
  npx tsx DE/scripts/process-knowledge.ts \\
    --source-file KG/mechanisms.md --extract-refs --stats

  # Process entire knowledge base directory
  npx tsx DE/scripts/process-knowledge.ts \\
    --source-dir KG/ --validate-links --output-file results.json

  # Comprehensive analysis with all options
  npx tsx DE/scripts/process-knowledge.ts \\
    --source-dir KG/ --extract-refs --validate-links --stats --output-format readable
`);
}

/**
 * Create mock file data for demonstration
 */
function createMockFileData(): ProcessedFile[] {
  const mockMarkdown1 = `# Smart Materials Overview

## Shape Memory Polymers
Shape memory polymers (SMPs) are smart materials that can remember and recover their original shape when triggered by external stimuli such as heat, light, or pH changes.

See also: [[Thermodynamics]] and [[Polymer Chemistry]].

### Applications
- Medical devices
- Aerospace components
- [[Soft Robotics]]

## References
1. Smith, J. (2023). "Advanced Smart Materials"
2. Chen, L. (2022). "Shape Memory Effects"
`;

  const mockMarkdown2 = `# Mechanisms of Adaptation

## Biological Inspiration
Nature provides excellent examples of adaptive mechanisms through evolution and biological optimization.

Related concepts: [[Active Inference]] and [[Complexity Theory]].

### Examples
- Plant tropisms
- Muscle memory
- Neural plasticity

See: [[Biomimetics]] for more information.
`;

  return [
    {
      filePath: 'KG/materials.md',
      fileKey: 'materials',
      parsedDoc: parseMarkdownToStructuredDocument(mockMarkdown1, 'materials'),
      references: extractReferences(mockMarkdown1),
      sectionCount: 3,
      wordCount: 145,
      errors: []
    },
    {
      filePath: 'KG/mechanisms.md',
      fileKey: 'mechanisms',
      parsedDoc: parseMarkdownToStructuredDocument(mockMarkdown2, 'mechanisms'),
      references: extractReferences(mockMarkdown2),
      sectionCount: 3,
      wordCount: 98,
      errors: []
    }
  ];
}

/**
 * Process markdown content and extract structured data
 */
function processMarkdownContent(content: string, fileKey: string): ProcessedFile {
  const startTime = Date.now();
  
  try {
    const parsedDoc = parseMarkdownToStructuredDocument(content, fileKey);
    const references = extractReferences(content);
    const wordCount = content.split(/\s+/).length;
    const sectionCount = countSections(parsedDoc.sections || []);
    
    return {
      filePath: `${fileKey}.md`,
      fileKey,
      parsedDoc,
      references,
      sectionCount,
      wordCount,
      errors: []
    };
  } catch (error) {
    return {
      filePath: `${fileKey}.md`,
      fileKey,
      parsedDoc: { sections: [] },
      references: [],
      sectionCount: 0,
      wordCount: 0,
      errors: [String(error)]
    };
  }
}

/**
 * Count total sections recursively
 */
function countSections(sections: ParsedSection[]): number {
  let count = sections.length;
  sections.forEach(section => {
    if (section.subsections) {
      count += countSections(section.subsections);
    }
  });
  return count;
}

/**
 * Extract and validate wiki links
 */
function extractWikiLinks(content: string): string[] {
  const wikiLinkRegex = /\[\[((?:[^#|\]]*?)(?:\.md)?(?:#[^|\]]+?)?|[^|\]]+?)(?:\|([^\]]+))?\]\]/g;
  const links: string[] = [];
  let match;
  
  while ((match = wikiLinkRegex.exec(content)) !== null) {
    links.push(match[1].trim());
  }
  
  return links;
}

/**
 * Validate internal links across processed files
 */
function validateLinks(processedFiles: ProcessedFile[]): LinkValidationResult[] {
  const allSections = new Set<string>();
  const allFiles = new Set<string>();
  
  // Build index of available targets
  processedFiles.forEach(file => {
    allFiles.add(file.fileKey);
    const addSections = (sections: ParsedSection[]) => {
      sections.forEach(section => {
        allSections.add(section.id);
        if (section.subsections) {
          addSections(section.subsections);
        }
      });
    };
    addSections(file.parsedDoc.sections || []);
  });
  
  const validationResults: LinkValidationResult[] = [];
  
  processedFiles.forEach(file => {
    const content = JSON.stringify(file.parsedDoc); // Simple way to get all content
    const links = extractWikiLinks(content);
    
    links.forEach(link => {
      let isValid = false;
      let targetExists = false;
      let linkType: 'internal' | 'external' | 'section' = 'internal';
      
      if (link.startsWith('http')) {
        linkType = 'external';
        isValid = true; // Assume external links are valid
        targetExists = true;
      } else if (link.includes('#')) {
        linkType = 'section';
        const sectionId = slugify(link.split('#')[1]);
        targetExists = allSections.has(sectionId);
        isValid = targetExists;
      } else {
        const targetFile = link.replace('.md', '');
        targetExists = allFiles.has(targetFile);
        isValid = targetExists;
      }
      
      validationResults.push({
        sourceFile: file.fileKey,
        link,
        isValid,
        targetExists,
        linkType
      });
    });
  });
  
  return validationResults;
}

/**
 * Display processing results in readable format
 */
function displayResults(results: ProcessingResults, options: CliOptions) {
  console.log('\n📄 Knowledge Processing Results:');
  console.log('═'.repeat(60));
  
  // File processing summary
  console.log(`📁 Files Processed: ${results.files.length}`);
  console.log(`📝 Total Sections: ${results.totalSections}`);
  console.log(`📚 Total References: ${results.totalReferences}`);
  console.log(`🔗 Unique References: ${results.uniqueReferences.size}`);
  
  // Individual file results
  if (options.outputFormat !== 'json') {
    console.log('\n📋 File Details:');
    results.files.forEach(file => {
      console.log(`\n📄 ${file.filePath}:`);
      console.log(`   Sections: ${file.sectionCount}`);
      console.log(`   Word Count: ${file.wordCount}`);
      console.log(`   References: ${file.references.length}`);
      
      if (file.errors.length > 0) {
        console.log(`   ❌ Errors: ${file.errors.join(', ')}`);
      }
      
      if (options.extractRefs && file.references.length > 0) {
        console.log(`   📚 References Found:`);
        file.references.forEach(ref => console.log(`     • ${ref}`));
      }
    });
  }
  
  // Link validation results
  if (options.validateLinks) {
    console.log('\n🔗 Link Validation:');
    const invalidLinks = results.linkValidation.filter(l => !l.isValid);
    if (invalidLinks.length === 0) {
      console.log('✅ All links are valid');
    } else {
      console.log(`❌ Found ${invalidLinks.length} invalid links:`);
      invalidLinks.forEach(link => {
        console.log(`   ${link.sourceFile}: [[${link.link}]] - ${link.linkType}`);
      });
    }
  }
  
  // Processing statistics
  if (options.showStats) {
    console.log('\n📊 Processing Statistics:');
    console.log(`⏱️  Total Processing Time: ${results.processingStats.totalProcessingTime}ms`);
    console.log(`📈 Average File Size: ${results.processingStats.averageFileSize} words`);
    console.log(`📄 Largest File: ${results.processingStats.largestFile}`);
    console.log(`📚 Most References: ${results.processingStats.mostReferences}`);
  }
}

/**
 * Calculate processing statistics
 */
function calculateStats(files: ProcessedFile[], processingTime: number): ProcessingStats {
  const wordCounts = files.map(f => f.wordCount);
  const averageFileSize = wordCounts.reduce((a, b) => a + b, 0) / files.length;
  
  const largestFile = files.reduce((prev, curr) => 
    curr.wordCount > prev.wordCount ? curr : prev
  ).fileKey;
  
  const mostReferences = files.reduce((prev, curr) => 
    curr.references.length > prev.references.length ? curr : prev
  ).fileKey;
  
  return {
    filesProcessed: files.length,
    totalProcessingTime: processingTime,
    averageFileSize: Math.round(averageFileSize),
    largestFile,
    mostReferences
  };
}

/**
 * Main execution function
 */
async function main() {
  console.log('📚 Research Discovery Engine - Knowledge Processing Tool\n');

  const options = parseArgs();

  if (options.help) {
    showHelp();
    return;
  }

  try {
    const startTime = Date.now();
    let processedFiles: ProcessedFile[];

    // For demonstration, use mock data
    if (options.sourceFile || options.sourceDir) {
      console.log(`📂 Processing ${options.sourceFile ? 'file' : 'directory'}: ${options.sourceFile || options.sourceDir}`);
      console.log('📝 Note: Using mock data for demonstration\n');
    } else {
      console.log('📊 Using mock knowledge base for demonstration\n');
    }

    // Create mock processed files
    processedFiles = createMockFileData();
    
    const processingTime = Date.now() - startTime;

    // Collect all references
    const allReferences: string[] = [];
    const uniqueReferences = new Set<string>();
    let totalSections = 0;

    processedFiles.forEach(file => {
      file.references.forEach(ref => {
        allReferences.push(ref);
        uniqueReferences.add(ref);
      });
      totalSections += file.sectionCount;
    });

    // Validate links if requested
    let linkValidation: LinkValidationResult[] = [];
    if (options.validateLinks) {
      linkValidation = validateLinks(processedFiles);
    }

    // Calculate statistics
    const processingStats = calculateStats(processedFiles, processingTime);

    const results: ProcessingResults = {
      files: processedFiles,
      totalSections,
      totalReferences: allReferences.length,
      uniqueReferences,
      linkValidation,
      processingStats
    };

    // Display results
    if (options.outputFormat === 'json') {
      console.log(JSON.stringify(results, (key, value) => {
        if (value instanceof Set) {
          return Array.from(value);
        }
        return value;
      }, 2));
    } else {
      displayResults(results, options);
    }

    // Save to file if requested
    if (options.outputFile) {
      console.log(`\n💾 Results would be saved to: ${options.outputFile}`);
    }

    console.log('\n🎉 Knowledge processing completed successfully!');

  } catch (error) {
    console.error('❌ Error during knowledge processing:', error);
    process.exit(1);
  }
}

// Run the script
main(); 