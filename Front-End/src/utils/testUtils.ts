/**
 * Testing Utilities
 * 
 * This module provides utilities for testing React components and application logic
 * in the Discovery Engine application, including comprehensive LLM testing support.
 */

import { GraphData, NodeObject, LinkObject, ConceptDesignState, AgentMessage } from '../types';
import { calculateGraphStats, validateGraphData } from './dataTransformUtils';

// Import real LLM services
import { createLLMService, createSummaryService, createKnowledgeService, createProtocolService } from '../llm/utils/factory';
import { LLMService } from '../llm/LLMService';
import { SummaryLLMService } from '../llm/services/SummaryLLMService';
import { KnowledgeLLMService } from '../llm/services/KnowledgeLLMService';
import { ProtocolLLMService } from '../llm/services/ProtocolLLMService';

/**
 * Creates mock graph data for testing
 * 
 * @param nodeCount - Number of nodes to create
 * @param linkDensity - Link density (0-1, ratio of actual links to possible links)
 * @returns Mock graph data
 */
export const createMockGraphData = (
  nodeCount: number = 10,
  linkDensity: number = 0.2
): GraphData => {
  const nodes: NodeObject[] = [];
  const links: LinkObject[] = [];

  // Create nodes
  for (let i = 0; i < nodeCount; i++) {
    const nodeTypes = ['Material', 'Mechanism', 'Application', 'TheoreticalConcept'];
    const statuses = ['Validated', 'Proposed', 'Experimental'];
    
    nodes.push({
      id: `node-${i}`,
      type: nodeTypes[Math.floor(Math.random() * nodeTypes.length)] as any,
      label: `Test Node ${i}`,
      description: `This is a test node with ID ${i} created for testing purposes.`,
      origin: 'user_upload',
      status: statuses[Math.floor(Math.random() * statuses.length)] as any,
      references: [`ref-${i}`],
      sourceFileKey: 'test',

    });
  }

  // Create links based on density
  const maxPossibleLinks = (nodeCount * (nodeCount - 1)) / 2;
  const targetLinkCount = Math.floor(maxPossibleLinks * linkDensity);
  const linkTypes = ['related-to', 'EnablesMechanismEdge', 'ComposedOfMaterialEdge', 'UtilizesMethodEdge'];

  for (let i = 0; i < targetLinkCount; i++) {
    const sourceIndex = Math.floor(Math.random() * nodeCount);
    let targetIndex = Math.floor(Math.random() * nodeCount);
    
    // Ensure no self-links
    while (targetIndex === sourceIndex) {
      targetIndex = Math.floor(Math.random() * nodeCount);
    }

    // Check if link already exists
    const linkExists = links.some(link => 
      (link.source === nodes[sourceIndex].id && link.target === nodes[targetIndex].id) ||
      (link.source === nodes[targetIndex].id && link.target === nodes[sourceIndex].id)
    );

    if (!linkExists) {
      links.push({
        source: nodes[sourceIndex].id,
        target: nodes[targetIndex].id,
        type: linkTypes[Math.floor(Math.random() * linkTypes.length)] as any
      });
    }
  }

  return { nodes, links };
};

/**
 * Creates a mock concept design state for testing
 * 
 * @param overrides - Properties to override in the mock state
 * @returns Mock concept design state
 */
export const createMockConceptDesignState = (
  overrides: Partial<ConceptDesignState> = {}
): ConceptDesignState => {
  return {
    id: 'test-concept',
    objective: 'Test adaptive material system',
    status: 'Proposed',
    components: {
      materials: ['graphene--2d-materials', 'hydrogels-general'],
      mechanisms: ['biological-plasticity-mechanisms', 'energy-flow-dissipation'],
      methods: ['computational-modeling', 'experimental-validation'],
      theoretical_concepts: ['active-inference', 'complexity-theory']
    },
    cssVectorDraft: {
      context: {
        material_primary: ['test-material'],
        environment_type: 'laboratory'
      },
      interface: {
        input_mechanism: ['thermal'],
        output_mechanism: ['shape-change']
      }
    },
    protocolOutline: '# Test Protocol\n\n## Setup\n- Prepare test materials\n\n## Execution\n- Apply stimulus\n- Measure response',
    fieldSuggestions: {},
    ...overrides
  };
};

/**
 * Creates mock agent messages for testing
 * 
 * @param count - Number of messages to create
 * @returns Array of mock agent messages
 */
export const createMockAgentMessages = (count: number = 5): AgentMessage[] => {
  const agents = ['Discovery Engine', 'Research Assistant', 'Exploration Agent', 'Consistency Agent'];
  const types: AgentMessage['type'][] = ['info', 'warning', 'suggestion', 'opportunity'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `test-msg-${i}`,
    sourceAgent: agents[Math.floor(Math.random() * agents.length)],
    type: types[Math.floor(Math.random() * types.length)],
    content: `Test message ${i}: This is a mock agent message for testing purposes.`,
    timestamp: Date.now() - (i * 60000), // Messages 1 minute apart
    action: Math.random() > 0.7 ? {
      type: 'explore-node',
      label: `Test Action ${i}`,
      payload: { test: true }
    } : undefined,
    relatedNodeIds: Math.random() > 0.8 ? [`node-${i}`] : undefined
  }));
};

/**
 * LLM Testing Utilities
 * 
 * Comprehensive utilities for testing LLM integration
 */
export const llmTestUtils = {
  /**
   * Create mock LLM configuration for testing
   */
  createMockLLMConfig: () => ({
    apiKey: 'test-api-key-mock',
    model: 'gpt-4o-mini' as const,
    maxTokens: 1000,
    temperature: 0.7,
    baseURL: undefined,
    organization: undefined,
    project: undefined
  }),

  /**
   * Create mock LLM request
   */
  createMockLLMRequest: (overrides: any = {}) => ({
    messages: [
      { role: 'system' as const, content: 'You are a research assistant.' },
      { role: 'user' as const, content: 'Test query for mock LLM.' }
    ],
    maxTokens: 1000,
    temperature: 0.7,
    ...overrides
  }),

  /**
   * Create mock LLM response
   */
  createMockLLMResponse: (overrides: any = {}) => ({
    success: true,
    content: 'This is a mock LLM response for testing purposes.',
    usage: {
      promptTokens: 50,
      completionTokens: 25,
      totalTokens: 75
    },
    metadata: {
      model: 'gpt-4o-mini',
      temperature: 0.7,
      requestId: 'test-request-123',
      timestamp: Date.now(),
      duration: 500,
      finishReason: 'completed' as const
    },
    ...overrides
  }),

  /**
   * Create mock summary LLM result
   */
  createMockSummaryResult: (concept: string = 'Test Concept') => ({
    success: true,
    content: `Mock summary content for ${concept}`,
    summary: {
      abstract: `This is a mock abstract for ${concept} research.`,
      keyFindings: [
        'Mock finding 1: Significant improvement in performance',
        'Mock finding 2: Novel approach to material design',
        'Mock finding 3: Potential for commercial applications'
      ],
      methodology: 'Mock methodology description with experimental details.',
      implications: [
        'Advancement in smart materials field',
        'Potential for sustainable technologies',
        'Opens new research directions'
      ],
      futureWork: [
        'Scale up for industrial applications',
        'Long-term stability studies',
        'Cost optimization analysis'
      ],
      references: [
        'Smith, J. et al. (2023). Advanced Materials Research',
        'Chen, L. (2022). Smart Material Applications'
      ]
    },
    usage: {
      promptTokens: 200,
      completionTokens: 150,
      totalTokens: 350
    },
    metadata: {
      model: 'gpt-4o',
      temperature: 0.5,
      requestId: 'summary-test-456',
      timestamp: Date.now(),
      duration: 1200,
      finishReason: 'completed' as const
    }
  }),

  /**
   * Create mock knowledge processing result
   */
  createMockKnowledgeResult: (domain: string = 'materials science') => ({
    success: true,
    content: `Mock knowledge processing for ${domain}`,
    extractedData: {
      concepts: [
        'Smart Materials',
        'Adaptive Systems',
        'Responsive Polymers',
        'Nanocomposites',
        'Shape Memory Alloys'
      ],
      relationships: [
        { source: 'Smart Materials', relationship: 'includes', target: 'Shape Memory Alloys' },
        { source: 'Adaptive Systems', relationship: 'utilizes', target: 'Responsive Polymers' },
        { source: 'Nanocomposites', relationship: 'enhances', target: 'Smart Materials' }
      ],
      questions: [
        'How can smart materials be optimized for energy efficiency?',
        'What are the long-term stability considerations?',
        'How do environmental factors affect performance?'
      ],
      classifications: {
        'material_type': 'Composite',
        'application_domain': 'Aerospace',
        'technology_readiness': 'TRL 6'
      }
    },
    usage: {
      promptTokens: 300,
      completionTokens: 200,
      totalTokens: 500
    },
    metadata: {
      model: 'gpt-4o',
      temperature: 0.4,
      requestId: 'knowledge-test-789',
      timestamp: Date.now(),
      duration: 800,
      finishReason: 'completed' as const
    }
  }),

  /**
   * Create mock protocol generation result
   */
  createMockProtocolResult: (objective: string = 'Test Protocol') => ({
    success: true,
    content: `Mock protocol for ${objective}`,
    protocol: {
      title: objective,
      objective: `Generate experimental protocol for ${objective}`,
      sections: [
        {
          title: 'Materials and Equipment',
          content: 'List of required materials and equipment for the experiment.',
          estimatedTime: '30 minutes'
        },
        {
          title: 'Preparation',
          content: 'Step-by-step preparation procedures.',
          estimatedTime: '1 hour'
        },
        {
          title: 'Experimental Procedure',
          content: 'Detailed experimental steps and measurements.',
          estimatedTime: '2 hours'
        },
        {
          title: 'Data Analysis',
          content: 'Methods for analyzing collected data.',
          estimatedTime: '1 hour'
        }
      ],
      safetyConsiderations: [
        'Wear appropriate personal protective equipment',
        'Ensure proper ventilation',
        'Handle chemicals according to safety data sheets'
      ],
      metadata: {
        estimatedDuration: '4.5 hours',
        skillLevel: 'intermediate',
        materials: ['polymer substrate', 'crosslinking agent', 'catalyst'],
        mechanisms: ['thermal curing', 'chemical crosslinking']
      }
    },
    usage: {
      promptTokens: 250,
      completionTokens: 180,
      totalTokens: 430
    },
    metadata: {
      model: 'gpt-4o',
      temperature: 0.3,
      requestId: 'protocol-test-101',
      timestamp: Date.now(),
      duration: 1000,
      finishReason: 'completed' as const
    }
  })
};

/**
 * Mock LLM service implementations for testing
 */
export const mockLLMServices = {
  /**
   * Mock LLM service that returns predefined responses
   */
  createMockLLMService: () => ({
    generateCompletion: mockFn((request: any) => 
      Promise.resolve(llmTestUtils.createMockLLMResponse())
    ),
    processBatch: mockFn((requests: any[]) => 
      Promise.resolve({
        results: requests.map(() => llmTestUtils.createMockLLMResponse()),
        batchId: 'test-batch-123',
        completedAt: Date.now()
      })
    ),
    validateInput: mockFn(() => Promise.resolve(true))
  }),

  /**
   * Mock summary LLM service
   */
  createMockSummaryService: () => ({
    generateSummary: mockFn((request: any) => 
      Promise.resolve(llmTestUtils.createMockSummaryResult(request.context?.concept))
    ),
    generateExecutiveSummary: mockFn((context: any) => 
      Promise.resolve(`Executive summary for ${context.concept}`)
    ),
    generateTechnicalSummary: mockFn((context: any) => 
      Promise.resolve(`Technical summary for ${context.concept}`)
    )
  }),

  /**
   * Mock knowledge LLM service
   */
  createMockKnowledgeService: () => ({
    extractConcepts: mockFn((text: string, domain: string) => 
      Promise.resolve(['Concept 1', 'Concept 2', 'Concept 3'])
    ),
    findRelationships: mockFn((text: string, domain: string) => 
      Promise.resolve([
        { source: 'Concept 1', relationship: 'relates to', target: 'Concept 2' }
      ])
    ),
    generateQuestions: mockFn((text: string, domain: string) => 
      Promise.resolve([
        'What are the key challenges?',
        'How can this be improved?',
        'What are the applications?'
      ])
    ),
    processKnowledge: mockFn((request: any) => 
      Promise.resolve(llmTestUtils.createMockKnowledgeResult(request.domain))
    )
  }),

  /**
   * Mock protocol LLM service
   */
  createMockProtocolService: () => ({
    generateProtocol: mockFn((request: any) => 
      Promise.resolve(llmTestUtils.createMockProtocolResult(request.objective))
    ),
    generateSafetyGuidelines: mockFn((materials: string[]) => 
      Promise.resolve([
        'Handle materials with care',
        'Use appropriate PPE',
        'Follow disposal procedures'
      ])
    )
  })
};

/**
 * LLM performance testing utilities
 */
export const llmPerformanceTestUtils = {
  /**
   * Measure LLM response time
   */
  measureResponseTime: async (operation: () => Promise<any>) => {
    const startTime = Date.now();
    const result = await operation();
    const endTime = Date.now();
    return {
      result,
      duration: endTime - startTime,
      timestamp: startTime
    };
  },

  /**
   * Test token usage efficiency
   */
  calculateTokenEfficiency: (result: any) => {
    const { usage } = result;
    if (!usage) return { efficiency: 0, details: 'No usage data' };
    
    const efficiency = usage.completionTokens / usage.totalTokens;
    return {
      efficiency: Math.round(efficiency * 100),
      details: `${usage.completionTokens}/${usage.totalTokens} tokens used effectively`
    };
  },

  /**
   * Simulate load testing for LLM services
   */
  simulateLoad: async (service: any, requestCount: number = 10) => {
    const startTime = Date.now();
    const promises = [];
    
    for (let i = 0; i < requestCount; i++) {
      promises.push(service.generateText({ 
        userPrompt: `Test request ${i}`,
        config: { maxTokens: 10, temperature: 0 }
      }));
    }
    
    const results = await Promise.allSettled(promises);
    const endTime = Date.now();
    
    const successful = results.filter(r => 
      r.status === 'fulfilled' && (r.value as any)?.success
    ).length;
    const failed = results.filter(r => 
      r.status === 'rejected' || (r.status === 'fulfilled' && !(r.value as any)?.success)
    ).length;
    
    return {
      totalRequests: requestCount,
      successful,
      failed,
      successRate: (successful / requestCount) * 100,
      totalDuration: endTime - startTime,
      averageResponseTime: (endTime - startTime) / requestCount
    };
  }
};

/**
 * Mock functions for testing component interactions
 */
export const createMockHandlers = () => ({
  onNodeSelect: mockFn(),
  onTriggerAgent: mockFn(),
  onUpdateObjective: mockFn(),
  onUpdateComponentSelection: mockFn(),
  onUpdateCssField: mockFn(),
  onSearchInputChange: mockFn(),
  onSearchSubmit: mockFn(),
  onToggleDarkMode: mockFn(),
  onNavigateToWikiSection: mockFn(),
  onSetActiveMode: mockFn(),
  onBreadcrumbNavigate: mockFn(),
  onFilterComplete: mockFn(),
  
  // LLM-specific mock handlers
  onLLMSummaryGenerate: mockFn(),
  onLLMKnowledgeProcess: mockFn(),
  onLLMProtocolGenerate: mockFn(),
  onLLMConfigUpdate: mockFn()
});

/**
 * Helper to wait for async operations in tests
 * 
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after the specified time
 */
export const waitFor = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper to simulate user interactions
 */
export const simulateUserInteraction = {
  /**
   * Simulates typing in an input field
   */
  type: (element: HTMLInputElement, text: string) => {
    element.value = text;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  },

  /**
   * Simulates clicking an element
   */
  click: (element: HTMLElement) => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  },

  /**
   * Simulates form submission
   */
  submit: (form: HTMLFormElement) => {
    form.dispatchEvent(new Event('submit', { bubbles: true }));
  }
};

/**
 * Utilities for testing graph operations
 */
export const graphTestUtils = {
  /**
   * Finds a node by ID in test graph data
   */
  findNodeById: (graphData: GraphData, id: string): NodeObject | undefined => 
    graphData.nodes.find(node => node.id === id),

  /**
   * Finds links connected to a specific node
   */
  findLinksForNode: (graphData: GraphData, nodeId: string): LinkObject[] => 
    graphData.links.filter(link => 
      link.source === nodeId || link.target === nodeId
    ),

  /**
   * Counts nodes by type
   */
  countNodesByType: (graphData: GraphData): Record<string, number> => {
    const counts: Record<string, number> = {};
    graphData.nodes.forEach(node => {
      const type = node.type || 'unknown';
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  },

  /**
   * Validates graph data structure
   */
  validateGraphStructure: (graphData: GraphData): boolean => {
    const nodeIds = new Set(graphData.nodes.map(node => node.id));
    
    // Check that all links reference existing nodes
    return graphData.links.every(link => {
      return nodeIds.has(link.source) && nodeIds.has(link.target);
    });
  }
};

/**
 * Mock implementations for external dependencies
 */
export const mockImplementations = {
  /**
   * Mock localStorage for testing
   */
  localStorage: {
    store: {} as Record<string, string>,
    getItem: mockFn((key: string) => mockImplementations.localStorage.store[key] || null),
    setItem: mockFn((key: string, value: string) => {
      mockImplementations.localStorage.store[key] = value;
    }),
    removeItem: mockFn((key: string) => {
      delete mockImplementations.localStorage.store[key];
    }),
    clear: mockFn(() => {
      mockImplementations.localStorage.store = {};
    })
  },

  /**
   * Mock fetch for API testing
   */
  fetch: mockFn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve('')
    })
  ),

  /**
   * Mock console methods to prevent test output pollution
   */
  console: {
    log: mockFn(),
    warn: mockFn(),
    error: mockFn(),
    group: mockFn(),
    groupEnd: mockFn()
  },

  /**
   * Mock OpenAI API for LLM testing
   */
  openai: {
    chat: {
      completions: {
        create: mockFn((params: any) => 
          Promise.resolve({
            id: 'test-completion-123',
            object: 'chat.completion',
            created: Date.now(),
            model: params.model || 'gpt-4o-mini',
            choices: [{
              index: 0,
              message: {
                role: 'assistant',
                content: 'Mock LLM response for testing'
              },
              finish_reason: 'stop'
            }],
            usage: {
              prompt_tokens: 50,
              completion_tokens: 25,
              total_tokens: 75
            }
          })
        )
      }
    }
  }
};

/**
 * Test data generators for specific scenarios
 */
export const testDataGenerators = {
  /**
   * Creates graph data with isolated nodes (for testing connectivity)
   */
  createGraphWithIsolatedNodes: (): GraphData => {
    const connectedNodes = createMockGraphData(5, 0.4);
    const isolatedNodes: NodeObject[] = [
      {
        id: 'isolated-1',
        type: 'Material',
        label: 'Isolated Material',
        description: 'An isolated node for testing',
        origin: 'user_upload',
        status: 'Proposed'
      },
      {
        id: 'isolated-2',
        type: 'Mechanism',
        label: 'Isolated Mechanism',
        description: 'Another isolated node for testing',
        origin: 'user_upload',
        status: 'Proposed'
      }
    ];

    return {
      nodes: [...connectedNodes.nodes, ...isolatedNodes],
      links: connectedNodes.links
    };
  },

  /**
   * Creates graph data with circular dependencies
   */
  createGraphWithCircularDependencies: (): GraphData => {
    const nodes: NodeObject[] = [
      { id: 'A', type: 'Material', label: 'Node A', origin: 'user_upload', status: 'Validated' },
      { id: 'B', type: 'Mechanism', label: 'Node B', origin: 'user_upload', status: 'Validated' },
      { id: 'C', type: 'Application', label: 'Node C', origin: 'user_upload', status: 'Validated' }
    ];

    const links: LinkObject[] = [
      { source: 'A', target: 'B', type: 'EnablesMechanismEdge' },
      { source: 'B', target: 'C', type: 'EnablesMechanismEdge' },
      { source: 'C', target: 'A', type: 'ComposedOfMaterialEdge' }
    ];

    return { nodes, links };
  },

  /**
   * Creates large graph data for performance testing
   */
  createLargeGraphData: (nodeCount: number = 1000): GraphData => 
    createMockGraphData(nodeCount, 0.1),

  /**
   * Create test concept for LLM testing
   */
  createTestConcept: (concept: string = 'Smart Materials') => createMockConceptDesignState({
    objective: concept,
    components: {
      materials: ['test-material-1', 'test-material-2'],
      mechanisms: ['test-mechanism-1'],
      methods: ['test-method-1'],
      theoretical_concepts: ['test-theory-1']
    }
  }),

  /**
   * Create test agent messages with LLM content
   */
  createTestAgentMessages: (count: number = 5) => createMockAgentMessages(count).map(msg => ({
    ...msg,
    content: `LLM-enhanced: ${msg.content}`,
    sourceAgent: msg.sourceAgent + ' (LLM)'
  })),

  /**
   * Create comprehensive test research context
   */
  createTestResearchContext: (domain: string = 'materials science') => ({
    concept: 'Advanced Adaptive Materials',
    domain,
    materials: ['shape-memory-polymers', 'carbon-nanotubes', 'hydrogels'],
    mechanisms: ['thermal-response', 'electrical-conductivity', 'ph-sensitivity'],
    applications: ['soft-robotics', 'biomedical-devices', 'smart-textiles'],
    researchQuestions: [
      'How can we optimize response time?',
      'What are the durability considerations?',
      'How do we scale manufacturing?'
    ]
  })
};

/**
 * Custom matchers for testing
 */
export const customMatchers = {
  /**
   * Checks if a graph contains a specific node
   */
  toContainNode: (graphData: GraphData, nodeId: string): boolean => 
    graphData.nodes.some(node => node.id === nodeId),

  /**
   * Checks if a graph contains a specific link
   */
  toContainLink: (graphData: GraphData, sourceId: string, targetId: string): boolean => 
    graphData.links.some(link => {
      return (link.source === sourceId && link.target === targetId) || 
             (link.source === targetId && link.target === sourceId);
    }),

  /**
   * Checks if an agent message has specific properties
   */
  toHaveAgentMessage: (
    messages: AgentMessage[], 
    sourceAgent: string, 
    type: AgentMessage['type']
  ): boolean => 
    messages.some(msg => msg.sourceAgent === sourceAgent && msg.type === type),

  /**
   * Checks if LLM result has expected structure
   */
  toHaveValidLLMResult: (result: any): boolean => 
    result && typeof result.success === 'boolean' && 
    result.content && result.usage && result.metadata,

  /**
   * Checks if LLM usage is within expected bounds
   */
  toHaveReasonableTokenUsage: (result: any, maxTokens: number = 5000): boolean => 
    result.usage && result.usage.totalTokens <= maxTokens && result.usage.totalTokens > 0
};

/**
 * Test environment setup helpers
 */
export const testSetup = {
  /**
   * Sets up mock environment for component testing
   */
  setupMockEnvironment: () => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: mockImplementations.localStorage
    });

    // Mock console methods
    Object.assign(console, mockImplementations.console);

    // Mock fetch
    global.fetch = mockImplementations.fetch as any;
  },

  /**
   * Sets up mock LLM environment
   */
  setupMockLLMEnvironment: () => {
    // Mock environment variables
    process.env.OPENAI_API_KEY = 'test-api-key';
    process.env.OPENAI_MODEL = 'gpt-4o-mini';
    process.env.OPENAI_MAX_TOKENS = '2000';
    process.env.OPENAI_TEMPERATURE = '0.7';

    // Setup basic mock environment
    testSetup.setupMockEnvironment();
  },

  /**
   * Cleans up after tests
   */
  cleanup: () => {
    clearAllMocks();
    mockImplementations.localStorage.clear();
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_MODEL;
    delete process.env.OPENAI_MAX_TOKENS;
    delete process.env.OPENAI_TEMPERATURE;
  }
};

/**
 * Simple mock function implementation
 */
function mockFn(implementation?: (...args: any[]) => any) {
  const fn = implementation || (() => {});
  (fn as any).mockClear = () => {};
  (fn as any).mockReset = () => {};
  return fn;
}

/**
 * Clear all mocks
 */
function clearAllMocks() {
  // In a real test environment, this would clear Jest mocks
}

// Export a mock jest object for non-test environments
if (typeof (globalThis as any).jest === 'undefined') {
  (globalThis as any).jest = {
    fn: mockFn,
    clearAllMocks: clearAllMocks
  };
} 