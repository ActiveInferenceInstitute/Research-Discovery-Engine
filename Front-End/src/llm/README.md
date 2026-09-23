# LLM Module - Research Discovery Engine

## Overview

The LLM (Large Language Model) module provides comprehensive AI-powered research capabilities for the Research Discovery Engine. This module integrates with OpenAI's API to provide intelligent text generation, analysis, and knowledge processing functionalities.

## Architecture

```
src/llm/
├── LLMService.ts           # Core LLM service with OpenAI integration
├── index.ts                # Main module exports
├── types/                  # TypeScript type definitions
│   └── index.ts
├── config/                 # Configuration management
│   └── LLMConfig.ts
├── services/               # Specialized LLM services
│   ├── SummaryLLMService.ts
│   ├── ProtocolLLMService.ts
│   └── KnowledgeLLMService.ts
└── utils/                  # Utility functions and helpers
    ├── factory.ts          # Service factory functions
    └── errors.ts           # Error handling classes
```

## Features

### Core Capabilities
- **OpenAI API Integration**: Full integration with OpenAI's GPT models
- **Multiple Model Support**: Support for GPT-4o, GPT-4-turbo, GPT-3.5-turbo, and more
- **Flexible Configuration**: Environment-based configuration with model-specific optimizations
- **Error Handling**: Comprehensive error handling with retry policies
- **Token Management**: Intelligent token usage tracking and optimization

### Specialized Services
- **Summary Generation**: Research-focused summary generation with multiple formats
- **Protocol Creation**: Experimental protocol generation with safety considerations  
- **Knowledge Processing**: Concept extraction, relationship identification, and question generation

### Research-Specific Features
- **Context-Aware Processing**: Domain-specific knowledge processing
- **Multi-Format Output**: Support for structured, narrative, and JSON outputs
- **Quality Metrics**: Built-in quality assessment and validation
- **Batch Processing**: Efficient handling of multiple requests

## Quick Start

### 1. Environment Setup

```bash
# Copy the environment template
cp .env.example .env

# Edit .env with your OpenAI API key
OPENAI_API_KEY=your_api_key_here
```

### 2. Basic Usage

```typescript
import { createSummaryService, createKnowledgeService } from '../src/llm';

// Generate a research summary
const summaryService = createSummaryService();
const summaryResult = await summaryService.generateSummary({
  context: {
    concept: 'quantum dots',
    domain: 'nanotechnology'
  },
  summaryType: 'comprehensive',
  targetAudience: 'researcher'
});

// Process knowledge
const knowledgeService = createKnowledgeService();
const concepts = await knowledgeService.extractConcepts(
  'Your research text here',
  'materials science'
);
```

### 3. CLI Scripts

```bash
# Generate LLM-enhanced summaries
./scripts/llm-generate-summary.ts --concept "graphene" --domain "materials science"

# Process knowledge with LLM
./scripts/llm-process-knowledge.ts --domain "chemistry" --input-text "Your text here"
```

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API key | - | ✅ |
| `OPENAI_MODEL` | Default model | `gpt-4o-mini` | ❌ |
| `OPENAI_MAX_TOKENS` | Token limit | `2000` | ❌ |
| `OPENAI_TEMPERATURE` | Response creativity | `0.7` | ❌ |
| `OPENAI_BASE_URL` | Custom API endpoint | - | ❌ |
| `OPENAI_ORGANIZATION` | Organization ID | - | ❌ |
| `OPENAI_PROJECT` | Project ID | - | ❌ |

### Model-Specific Configurations

The module automatically optimizes settings for different models:

- **GPT-4o**: Best for complex research tasks (4000 tokens, temp 0.7)
- **GPT-4o-mini**: Efficient for general tasks (2000 tokens, temp 0.7)
- **GPT-4-turbo**: High-quality analysis (4000 tokens, temp 0.6)
- **GPT-3.5-turbo**: Fast processing (1500 tokens, temp 0.8)

## API Reference

### Core Service Classes

#### LLMService
Base service for all LLM operations.

```typescript
class LLMService {
  constructor(config: LLMConfig)
  
  async generateCompletion(request: LLMRequest): Promise<LLMResult>
  async processBatch(requests: LLMBatchRequest): Promise<LLMBatchResult>
  async validateInput(request: LLMRequest): Promise<boolean>
}
```

#### SummaryLLMService
Specialized service for research summaries.

```typescript
class SummaryLLMService extends LLMService {
  async generateSummary(request: SummaryLLMRequest): Promise<SummaryLLMResult>
  async generateExecutiveSummary(context: ResearchLLMContext): Promise<string>
  async generateTechnicalSummary(context: ResearchLLMContext): Promise<string>
}
```

#### KnowledgeLLMService
Service for knowledge extraction and processing.

```typescript
class KnowledgeLLMService extends LLMService {
  async extractConcepts(text: string, domain: string, maxConcepts?: number): Promise<string[]>
  async findRelationships(text: string, domain: string): Promise<Relationship[]>
  async generateQuestions(text: string, domain: string, type?: string): Promise<string[]>
  async processKnowledge(request: KnowledgeProcessingLLMRequest): Promise<KnowledgeProcessingResult>
}
```

### Factory Functions

```typescript
// Create optimized service instances
createLLMService(config?: Partial<LLMConfig>): LLMService
createSummaryService(config?: Partial<LLMConfig>): SummaryLLMService
createProtocolService(config?: Partial<LLMConfig>): ProtocolLLMService
createKnowledgeService(config?: Partial<LLMConfig>): KnowledgeLLMService

// Create model-specific service
createModelOptimizedService(model: ModelType, config?: Partial<LLMConfig>): LLMService

// Create service suite
createServiceSuite(): {
  summary: SummaryLLMService;
  protocol: ProtocolLLMService;
  knowledge: KnowledgeLLMService;
  general: LLMService;
}
```

## Error Handling

The module provides comprehensive error handling with custom error classes:

### Error Types

- **LLMError**: Base LLM-related errors
- **LLMConfigError**: Configuration validation errors  
- **LLMServiceError**: Service operation errors

### Error Recovery

```typescript
import { LLMError, isLLMError } from '../src/llm';

try {
  const result = await llmService.generateCompletion(request);
} catch (error) {
  if (isLLMError(error)) {
    if (error.type === 'rate_limit_error') {
      // Handle rate limiting with retry
      console.log(`Rate limited. Retry after: ${error.retryAfter} seconds`);
    } else if (error.type === 'validation_error') {
      // Handle input validation errors
      console.log(`Validation error: ${error.message}`);
    }
  }
}
```

## CLI Scripts

### llm-generate-summary.ts

Generate research summaries using LLM integration.

```bash
./scripts/llm-generate-summary.ts \
  --concept "carbon nanotubes" \
  --domain "materials science" \
  --summary-type "comprehensive" \
  --target-audience "researcher" \
  --headless
```

**Options:**
- `--concept`: Research concept to summarize (required)
- `--domain`: Research domain context
- `--materials`: Comma-separated materials list
- `--mechanisms`: Comma-separated mechanisms list
- `--applications`: Comma-separated applications list
- `--summary-type`: technical|executive|educational|comprehensive
- `--target-audience`: researcher|student|industry|general
- `--length`: brief|standard|detailed|comprehensive
- `--headless`: Run without interactive output

### llm-process-knowledge.ts

Extract concepts and generate insights from text.

```bash
./scripts/llm-process-knowledge.ts \
  --domain "biochemistry" \
  --input-file "research-paper.txt" \
  --processing-type "extract_concepts" \
  --max-concepts 25 \
  --headless
```

**Options:**
- `--domain`: Research domain (required)
- `--input-file`: Text file to process
- `--input-text`: Direct text input
- `--processing-type`: extract_concepts|find_relationships|generate_questions|summarize|classify
- `--output-format`: structured|narrative|bullets|json
- `--max-concepts`: Maximum concepts to extract
- `--question-type`: exploratory|hypothesis|application

## Best Practices

### Configuration
- Always set appropriate token limits for your use case
- Use lower temperature values (0.3-0.5) for factual research content
- Use higher temperature values (0.7-0.9) for creative brainstorming
- Configure retry policies for production environments

### Usage Patterns
- Use specialized services (SummaryLLMService, KnowledgeLLMService) over the base LLMService
- Implement proper error handling with retry logic for rate limits
- Monitor token usage to optimize costs
- Validate inputs before sending to the API

### Performance
- Use batch processing for multiple similar requests
- Cache results when appropriate to avoid redundant API calls
- Choose the most cost-effective model for your specific task
- Implement request queuing for high-volume applications

## Integration with Research Discovery Engine

The LLM module integrates seamlessly with other components:

- **Scripts Integration**: Enhanced versions of existing deterministic scripts
- **Data Processing**: Intelligent analysis of research data
- **Knowledge Graphs**: LLM-powered relationship extraction
- **Research Workflows**: Automated research task completion

## Development

### Adding New Services

1. Create service class extending `LLMService`
2. Implement domain-specific methods
3. Add type definitions to `types/index.ts`
4. Create factory function in `utils/factory.ts`
5. Export from main `index.ts`

### Testing

```bash
# Install dependencies
npm install

# Run type checking
npx tsc --noEmit

# Test individual services
node -e "
const { createSummaryService } = require('./src/llm');
// Test code here
"
```

## Support

For issues, questions, or contributions:

1. Check the error logs for detailed error information
2. Verify your API key and configuration
3. Review the OpenAI API documentation for limits and requirements
4. Check network connectivity and firewall settings

## License

This module is part of the Research Discovery Engine project. 