#!/usr/bin/env tsx
/**
 * Standalone Testing & Validation Script
 * 
 * This script provides comprehensive testing capabilities for the Research Discovery Engine,
 * including graph validation, component testing, and data integrity checks.
 * 
 * Usage:
 *   npx tsx DE/scripts/run-tests.ts [options]
 * 
 * Options:
 *   --test-type unit|integration|validation   Type of tests to run
 *   --component ComponentName                 Test specific component
 *   --generate-mock-data                      Generate fresh mock data
 *   --validate-graph                          Validate graph data integrity
 *   --performance-test                        Run performance benchmarks
 *   --output-format json|readable             Output format
 *   --verbose                                 Show detailed test output
 *   --help, -h                               Show help message
 */

import 'dotenv/config';
import { 
  createMockGraphData,
  createMockConceptDesignState,
  createMockAgentMessages,
  createMockHandlers,
  testDataGenerators,
  graphTestUtils,
  llmTestUtils,
  llmPerformanceTestUtils
} from '../src/utils/testUtils';
import { createLLMService, createSummaryService, createKnowledgeService, createProtocolService } from '../src/llm/utils/factory';
import { validateGraphData, calculateGraphStats } from '../src/utils/dataTransformUtils';
import { generateSummary } from '../src/utils/summaryGenerator';
import { generateProtocol } from '../src/utils/protocolGenerator';
import { GraphData, ConceptDesignState } from '../src/types';

interface CliOptions {
  testType?: 'unit' | 'integration' | 'validation' | 'llm' | 'all';
  component?: string;
  generateMockData?: boolean;
  validateGraph?: boolean;
  performanceTest?: boolean;
  llmTest?: boolean;
  outputFormat?: 'json' | 'readable';
  verbose?: boolean;
  help?: boolean;
}

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  details?: string;
  errors?: string[];
}

interface TestSuite {
  name: string;
  results: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  totalDuration: number;
}

/**
 * Parse command line arguments
 */
function parseArgs(): CliOptions {
  const args = process.argv.slice(2); // Get actual command line arguments
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--test-type':
        const testType = args[++i];
        if (['unit', 'integration', 'validation', 'llm', 'all'].includes(testType)) {
          options.testType = testType as 'unit' | 'integration' | 'validation' | 'llm' | 'all';
        }
        break;
      case '--component':
        options.component = args[++i];
        break;
      case '--generate-mock-data':
        options.generateMockData = true;
        break;
      case '--validate-graph':
        options.validateGraph = true;
        break;
      case '--performance-test':
        options.performanceTest = true;
        break;
      case '--llm-test':
        options.llmTest = true;
        break;
      case '--output-format':
        const format = args[++i];
        if (['json', 'readable'].includes(format)) {
          options.outputFormat = format as 'json' | 'readable';
        }
        break;
      case '--verbose':
        options.verbose = true;
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
Standalone Testing & Validation Tool

Usage:
  npx tsx DE/scripts/run-tests.ts [options]

Options:
  --test-type type          Type: unit, integration, validation, llm, all
  --component name          Test specific component (e.g., GraphUtils)
  --generate-mock-data     Generate and validate mock data
  --validate-graph         Validate graph data integrity
  --performance-test       Run performance benchmarks
  --llm-test              Run LLM integration tests
  --output-format format   Output format: json, readable (default)
  --verbose               Show detailed test output
  --help, -h              Show this help message

Examples:
  # Run all validation tests
  npx tsx DE/scripts/run-tests.ts --test-type validation --verbose

  # Test specific component
  npx tsx DE/scripts/run-tests.ts --component GraphUtils --test-type unit

  # Generate mock data and validate
  npx tsx DE/scripts/run-tests.ts --generate-mock-data --validate-graph

  # Comprehensive test suite
  npx tsx DE/scripts/run-tests.ts --test-type integration --performance-test --verbose
`);
}

/**
 * Run unit tests
 */
async function runUnitTests(component?: string): Promise<TestSuite> {
  const startTime = Date.now();
  const results: TestResult[] = [];
  
  console.log('🧪 Running Unit Tests...\n');

  // Test 1: Mock Data Generation
  results.push(await runTest('Mock Graph Data Generation', async () => {
    const mockData = createMockGraphData(50, 0.3);
    if (mockData.nodes.length !== 50) throw new Error(`Expected 50 nodes, got ${mockData.nodes.length}`);
    if (mockData.links.length === 0) throw new Error('No links generated');
    return `Generated ${mockData.nodes.length} nodes, ${mockData.links.length} links`;
  }));

  // Test 2: Concept State Generation
  results.push(await runTest('Mock Concept State Generation', async () => {
    const conceptState = createMockConceptDesignState();
    if (!conceptState.objective) throw new Error('No objective generated');
    if (!conceptState.components) throw new Error('No components generated');
    return `Generated concept: ${conceptState.objective}`;
  }));

  // Test 3: Agent Messages Generation
  results.push(await runTest('Mock Agent Messages Generation', async () => {
    const messages = createMockAgentMessages(10);
    if (messages.length !== 10) throw new Error(`Expected 10 messages, got ${messages.length}`);
    if (!messages[0].sourceAgent) throw new Error('No source agent defined');
    return `Generated ${messages.length} agent messages`;
  }));

  // Test 4: Graph Utilities
  if (!component || component.toLowerCase() === 'graphutils') {
    results.push(await runTest('Graph Utilities - Find Node', async () => {
      const mockData = createMockGraphData(10, 0.2);
      const foundNode = graphTestUtils.findNodeById(mockData, mockData.nodes[0].id);
      if (!foundNode) throw new Error('Failed to find existing node');
      return `Successfully found node: ${foundNode.label || foundNode.id}`;
    }));

    results.push(await runTest('Graph Utilities - Find Links', async () => {
      const mockData = createMockGraphData(10, 0.2);
      const nodeId = mockData.nodes[0].id;
      const links = graphTestUtils.findLinksForNode(mockData, nodeId);
      return `Found ${links.length} links for node ${nodeId}`;
    }));
  }

  const totalDuration = Date.now() - startTime;
  return createTestSuite('Unit Tests', results, totalDuration);
}

/**
 * Run integration tests
 */
async function runIntegrationTests(): Promise<TestSuite> {
  const startTime = Date.now();
  const results: TestResult[] = [];
  
  console.log('🔗 Running Integration Tests...\n');

  // Test 1: Summary Generation Integration
  results.push(await runTest('Summary Generation Integration', async () => {
    const conceptState = createMockConceptDesignState();
    const summary = generateSummary(conceptState, undefined, {
      summaryLength: 'standard',
      technicalLevel: 'technical',
      includeComponents: true,
      includeRelatedWork: false,
      includeRecommendations: true,
      outputFormat: 'markdown'
    });
    
    if (!summary.sections || summary.sections.length === 0) {
      throw new Error('No summary sections generated');
    }
    
    return `Generated summary with ${summary.sections.length} sections`;
  }));

  // Test 2: Protocol Generation Integration
  results.push(await runTest('Protocol Generation Integration', async () => {
    const conceptState = createMockConceptDesignState();
    const protocol = generateProtocol(conceptState, {
      detailLevel: 'intermediate',
      includeTimeEstimates: true,
      includeRiskAssessment: false,
      outputFormat: 'markdown'
    });
    
    if (!protocol.sections || protocol.sections.length === 0) {
      throw new Error('No protocol sections generated');
    }
    
    return `Generated protocol with ${protocol.sections.length} sections`;
  }));

  // Test 3: Data Transformation Pipeline
  results.push(await runTest('Data Transformation Pipeline', async () => {
    const graphData = createMockGraphData(20, 0.25);
    const stats = calculateGraphStats(graphData);
    const validation = validateGraphData(graphData);
    
    if (!validation.isValid && validation.errors.length > 0) {
      throw new Error(`Graph validation failed: ${validation.errors.join(', ')}`);
    }
    
    return `Processed graph: ${stats.totalNodes} nodes, ${stats.totalLinks} links, avg degree: ${stats.averageDegree.toFixed(2)}`;
  }));

  const totalDuration = Date.now() - startTime;
  return createTestSuite('Integration Tests', results, totalDuration);
}

/**
 * Run validation tests
 */
async function runValidationTests(): Promise<TestSuite> {
  const startTime = Date.now();
  const results: TestResult[] = [];
  
  console.log('✅ Running Validation Tests...\n');

  // Test 1: Graph Data Validation
  results.push(await runTest('Graph Data Validation', async () => {
    const graphData = createMockGraphData(100, 0.15);
    const validation = validateGraphData(graphData);
    
    const issues = validation.errors.length + validation.warnings.length;
    return `Validation complete. ${validation.errors.length} errors, ${validation.warnings.length} warnings`;
  }));

  // Test 2: Data Generators Validation
  results.push(await runTest('Test Data Generators Validation', async () => {
    const generators = testDataGenerators;
    
    // Test concept generator
    const concept = generators.createTestConcept();
    if (!concept.objective) throw new Error('Concept generator failed - no objective');
    
    // Test agent messages generator  
    const messages = generators.createTestAgentMessages();
    if (messages.length === 0) throw new Error('Agent messages generator failed');
    
    return `All data generators validated successfully`;
  }));

  // Test 3: Mock Handlers Validation
  results.push(await runTest('Mock Handlers Validation', async () => {
    const handlers = createMockHandlers();
    
    // Test that handlers are functions
    const handlerNames = Object.keys(handlers);
    const invalidHandlers = handlerNames.filter(name => typeof handlers[name as keyof typeof handlers] !== 'function');
    
    if (invalidHandlers.length > 0) {
      throw new Error(`Invalid handlers: ${invalidHandlers.join(', ')}`);
    }
    
    return `Validated ${handlerNames.length} mock handlers`;
  }));

  const totalDuration = Date.now() - startTime;
  return createTestSuite('Validation Tests', results, totalDuration);
}

/**
 * Run LLM integration tests
 */
async function runLLMTests(): Promise<TestSuite> {
  const startTime = Date.now();
  const results: TestResult[] = [];
  
  console.log('🤖 Running Real LLM Integration Tests...\n');

  // Test 1: LLM Configuration Test
  results.push(await runTest('Real LLM Configuration Test', async () => {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    if (!apiKey) throw new Error('OPENAI_API_KEY not found in environment');
    if (!apiKey.startsWith('sk-')) throw new Error('Invalid OpenAI API key format');
    return `LLM configuration validated: ${model}`;
  }));

  // Test 2: Real LLM Service Integration
  results.push(await runTest('Real LLM Service Integration', async () => {
    const service = createLLMService();
    const request = {
      userPrompt: 'Write a brief summary about advanced materials in 2 sentences.',
      systemPrompt: 'You are a helpful research assistant.',
      config: { maxTokens: 100, temperature: 0.7 }
    };
    const response = await service.generateText(request);
    if (!response.success) throw new Error(`LLM service failed: ${response.error}`);
    return `LLM service responded with ${response.usage.totalTokens} tokens: "${response.content.substring(0, 50)}..."`;
  }));

  // Test 3: Real LLM Summary Generation Test
  results.push(await runTest('Real LLM Summary Generation Test', async () => {
    const summaryService = createSummaryService();
    const request = {
      context: { 
        concept: 'Advanced Polymer Composites',
        domain: 'materials science',
        materials: ['shape memory polymers', 'carbon nanotubes'],
        applications: ['aerospace', 'biomedical devices']
      },
      summaryType: 'technical' as const,
      targetAudience: 'researcher' as const,
      length: 'brief' as const,
      includeReferences: false,
      includeFutureWork: false,
      userPrompt: 'Generate a technical summary of advanced polymer composites research.',
      config: { maxTokens: 200, temperature: 0.7 }
    };
    const summary = await summaryService.generateSummary(request);
    if (!summary.success) throw new Error(`Summary generation failed: ${summary.error}`);
    return `Generated summary: "${summary.content.substring(0, 100)}..."`;
  }));

  // Test 4: Real LLM Knowledge Processing Test
  results.push(await runTest('Real LLM Knowledge Processing Test', async () => {
    const knowledgeService = createKnowledgeService();
    const testText = 'Smart materials research focuses on polymers that respond to temperature changes, shape memory alloys for aerospace applications, and hydrogels for biomedical devices.';
    const concepts = await knowledgeService.extractConcepts(testText, 'materials science', 5);
    if (!concepts || concepts.length === 0) throw new Error('No concepts extracted');
    return `Extracted ${concepts.length} concepts: ${concepts.slice(0, 3).join(', ')}`;
  }));

  // Test 5: Real LLM Protocol Generation Test
  results.push(await runTest('Real LLM Protocol Generation Test', async () => {
    const protocolService = createProtocolService();
    const request = {
      context: {
        concept: 'Smart Hydrogel Synthesis',
        domain: 'materials science',
        materials: ['hydrogel matrix', 'crosslinking agents'],
        mechanisms: ['pH sensitivity', 'thermal response']
      },
      protocolType: 'synthesis' as const,
      detailLevel: 'intermediate' as const,
      userPrompt: 'Generate a synthesis protocol for smart hydrogel materials.',
      config: { maxTokens: 300, temperature: 0.7 }
    };
    const protocol = await protocolService.generateProtocol(request);
    if (!protocol.success) throw new Error(`Protocol generation failed: ${protocol.error}`);
    return `Generated protocol: "${protocol.content.substring(0, 100)}..."`;
  }));

  // Test 6: Real LLM Performance Measurement
  results.push(await runTest('Real LLM Performance Measurement', async () => {
    const service = createLLMService();
    const request = {
      userPrompt: 'Quick test response in one sentence.',
      config: { maxTokens: 50, temperature: 0.7 }
    };
    const performance = await llmPerformanceTestUtils.measureResponseTime(
      () => service.generateText(request)
    );
    if (performance.duration > 30000) throw new Error('LLM response too slow');
    return `LLM responded in ${performance.duration}ms`;
  }));

  // Test 7: Real LLM Load Testing
  results.push(await runTest('Real LLM Load Testing', async () => {
    const service = createLLMService();
    const loadTest = await llmPerformanceTestUtils.simulateLoad(service, 3); // Reduced for real API
    if (loadTest.successRate < 60) throw new Error(`Low success rate: ${loadTest.successRate}%`);
    return `Load test: ${loadTest.successful}/${loadTest.totalRequests} successful (${loadTest.successRate}%)`;
  }));

  const totalDuration = Date.now() - startTime;
  return createTestSuite('Real LLM Integration Tests', results, totalDuration);
}

/**
 * Run performance tests
 */
async function runPerformanceTests(): Promise<TestSuite> {
  const startTime = Date.now();
  const results: TestResult[] = [];
  
  console.log('⚡ Running Performance Tests...\n');

  // Test 1: Large Graph Generation Performance
  results.push(await runTest('Large Graph Generation Performance', async () => {
    const perfStart = Date.now();
    const largeGraph = createMockGraphData(1000, 0.1);
    const perfEnd = Date.now();
    
    const generationTime = perfEnd - perfStart;
    if (generationTime > 5000) { // More than 5 seconds
      throw new Error(`Generation too slow: ${generationTime}ms`);
    }
    
    return `Generated 1000-node graph in ${generationTime}ms`;
  }));

  // Test 2: Graph Statistics Performance
  results.push(await runTest('Graph Statistics Performance', async () => {
    const largeGraph = createMockGraphData(500, 0.2);
    
    const perfStart = Date.now();
    const stats = calculateGraphStats(largeGraph);
    const perfEnd = Date.now();
    
    const calculationTime = perfEnd - perfStart;
    if (calculationTime > 1000) { // More than 1 second
      throw new Error(`Statistics calculation too slow: ${calculationTime}ms`);
    }
    
    return `Calculated stats for ${stats.totalNodes} nodes in ${calculationTime}ms`;
  }));

  // Test 3: Summary Generation Performance
  results.push(await runTest('Summary Generation Performance', async () => {
    const conceptState = createMockConceptDesignState();
    
    const perfStart = Date.now();
    const summary = generateSummary(conceptState, undefined, {
      summaryLength: 'comprehensive',
      technicalLevel: 'technical',
      includeComponents: true,
      includeRelatedWork: true,
      includeRecommendations: true,
      outputFormat: 'markdown'
    });
    const perfEnd = Date.now();
    
    const generationTime = perfEnd - perfStart;
    if (generationTime > 2000) { // More than 2 seconds
      throw new Error(`Summary generation too slow: ${generationTime}ms`);
    }
    
    return `Generated detailed summary in ${generationTime}ms`;
  }));

  const totalDuration = Date.now() - startTime;
  return createTestSuite('Performance Tests', results, totalDuration);
}

/**
 * Run a single test and return result
 */
async function runTest(name: string, testFunction: () => Promise<string>): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    const details = await testFunction();
    const duration = Date.now() - startTime;
    
    console.log(`  ✅ ${name} (${duration}ms)`);
    return { name, passed: true, duration, details };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    console.log(`  ❌ ${name} (${duration}ms) - ${errorMessage}`);
    return { name, passed: false, duration, errors: [errorMessage] };
  }
}

/**
 * Create test suite summary
 */
function createTestSuite(name: string, results: TestResult[], totalDuration: number): TestSuite {
  const passedTests = results.filter(r => r.passed).length;
  const failedTests = results.filter(r => !r.passed).length;
  
  return {
    name,
    results,
    totalTests: results.length,
    passedTests,
    failedTests,
    totalDuration
  };
}

/**
 * Display test results
 */
function displayResults(testSuites: TestSuite[], options: CliOptions) {
  console.log('\n📊 Test Results Summary:');
  console.log('═'.repeat(60));
  
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let totalDuration = 0;
  
  testSuites.forEach(suite => {
    console.log(`\n📋 ${suite.name}:`);
    console.log(`   Tests: ${suite.totalTests}`);
    console.log(`   Passed: ${suite.passedTests} ✅`);
    console.log(`   Failed: ${suite.failedTests} ${suite.failedTests > 0 ? '❌' : ''}`);
    console.log(`   Duration: ${suite.totalDuration}ms`);
    
    if (options.verbose && suite.failedTests > 0) {
      console.log('   Failed Tests:');
      suite.results.filter(r => !r.passed).forEach(result => {
        console.log(`     • ${result.name}: ${result.errors?.join(', ')}`);
      });
    }
    
    totalTests += suite.totalTests;
    totalPassed += suite.passedTests;
    totalFailed += suite.failedTests;
    totalDuration += suite.totalDuration;
  });
  
  console.log('\n🎯 Overall Results:');
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   Passed: ${totalPassed} ✅`);
  console.log(`   Failed: ${totalFailed} ${totalFailed > 0 ? '❌' : ''}`);
  console.log(`   Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
  console.log(`   Total Duration: ${totalDuration}ms`);
  
  if (totalFailed === 0) {
    console.log('\n🎉 All tests passed! System is functioning correctly.');
  } else {
    console.log(`\n⚠️  ${totalFailed} test(s) failed. Please review the issues above.`);
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🧪 Research Discovery Engine - Testing & Validation Tool\n');

  const options = parseArgs();

  if (options.help) {
    showHelp();
    return;
  }

  try {
    const testSuites: TestSuite[] = [];

    // Run requested test types
    if (!options.testType || options.testType === 'unit' || options.testType === 'all') {
      const unitSuite = await runUnitTests(options.component);
      testSuites.push(unitSuite);
    }

    if (!options.testType || options.testType === 'integration' || options.testType === 'all') {
      const integrationSuite = await runIntegrationTests();
      testSuites.push(integrationSuite);
    }

    if (!options.testType || options.testType === 'validation' || options.testType === 'all') {
      const validationSuite = await runValidationTests();
      testSuites.push(validationSuite);
    }

    if (options.testType === 'llm' || options.testType === 'all' || options.llmTest) {
      const llmSuite = await runLLMTests();
      testSuites.push(llmSuite);
    }

    // Run performance tests if requested
    if (options.performanceTest) {
      const performanceSuite = await runPerformanceTests();
      testSuites.push(performanceSuite);
    }

    // Generate mock data if requested
    if (options.generateMockData) {
      console.log('\n🎲 Generating Fresh Mock Data...');
      const mockGraph = createMockGraphData(25, 0.3);
      const mockConcept = createMockConceptDesignState();
      const mockMessages = createMockAgentMessages(5);
      
      console.log(`✅ Generated mock graph: ${mockGraph.nodes.length} nodes, ${mockGraph.links.length} links`);
      console.log(`✅ Generated mock concept: ${mockConcept.objective}`);
      console.log(`✅ Generated mock messages: ${mockMessages.length} messages`);
    }

    // Display results
    if (options.outputFormat === 'json') {
      console.log('\n📄 Test Results (JSON):');
      console.log(JSON.stringify(testSuites, null, 2));
    } else {
      displayResults(testSuites, options);
    }

    console.log('\n🎉 Testing completed successfully!');

  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

// Run the script
main(); 