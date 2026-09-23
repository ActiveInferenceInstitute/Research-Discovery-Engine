/**
 * LLM Service Factory Functions
 * 
 * Convenient factory functions for creating LLM service instances
 */

import { LLMService } from '../LLMService';
import { SummaryLLMService } from '../services/SummaryLLMService';
import { ProtocolLLMService } from '../services/ProtocolLLMService';
import { KnowledgeLLMService } from '../services/KnowledgeLLMService';
import { llmConfig } from '../config/LLMConfig';
import { LLMConfig, ModelType, APIProvider } from '../types';

/**
 * Create a standard LLM service instance
 */
export function createLLMService(config?: Partial<LLMConfig>): LLMService {
  const finalConfig = config ? { ...llmConfig.getConfig(), ...config } : llmConfig.getConfig();
  return new LLMService(finalConfig);
}

/**
 * Create a summary-optimized LLM service
 */
export function createSummaryService(config?: Partial<LLMConfig>): SummaryLLMService {
  const baseConfig = llmConfig.getSummaryConfig();
  const finalConfig = config ? { ...baseConfig, ...config } : baseConfig;
  return new SummaryLLMService(finalConfig);
}

/**
 * Create a protocol-optimized LLM service
 */
export function createProtocolService(config?: Partial<LLMConfig>): ProtocolLLMService {
  const baseConfig = llmConfig.getProtocolConfig();
  const finalConfig = config ? { ...baseConfig, ...config } : baseConfig;
  return new ProtocolLLMService(finalConfig);
}

/**
 * Create a knowledge processing LLM service
 */
export function createKnowledgeService(config?: Partial<LLMConfig>): KnowledgeLLMService {
  const baseConfig = llmConfig.getResearchConfig();
  const finalConfig = config ? { ...baseConfig, ...config } : baseConfig;
  return new KnowledgeLLMService(finalConfig);
}

/**
 * Create a service optimized for a specific model
 */
export function createModelOptimizedService(model: ModelType, config?: Partial<LLMConfig>): LLMService {
  const baseConfig = llmConfig.getModelConfig(model) as LLMConfig;
  const finalConfig = config ? { ...baseConfig, ...config } as LLMConfig : baseConfig;
  return new LLMService(finalConfig);
}

/**
 * Create a service with a specific API provider
 */
export function createProviderService(
  provider: APIProvider,
  model?: ModelType,
  config?: Partial<LLMConfig>
): LLMService {
  const baseConfig = llmConfig.getConfig();
  const finalConfig = {
    ...baseConfig,
    apiProvider: provider,
    model: model || (provider === 'openrouter' ? 'google/gemini-2.0-flash-exp:free' : 'gpt-4o-mini'),
    ...config
  };
  return new LLMService(finalConfig as LLMConfig);
}

/**
 * Create a batch of services for different tasks
 */
export function createServiceSuite(): {
  summary: SummaryLLMService;
  protocol: ProtocolLLMService;
  knowledge: KnowledgeLLMService;
  general: LLMService;
} {
  return {
    summary: createSummaryService(),
    protocol: createProtocolService(),
    knowledge: createKnowledgeService(),
    general: createLLMService()
  };
} 