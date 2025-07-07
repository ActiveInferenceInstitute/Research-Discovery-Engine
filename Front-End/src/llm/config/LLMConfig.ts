/**
 * LLM Configuration Management
 * 
 * Handles configuration loading and validation for LLM services
 */

import { LLMConfig, ModelType, APIProvider } from '../types';

export class LLMConfigManager {
  private static instance: LLMConfigManager;
  private config: LLMConfig | null = null;

  private constructor() {}

  static getInstance(): LLMConfigManager {
    if (!LLMConfigManager.instance) {
      LLMConfigManager.instance = new LLMConfigManager();
    }
    return LLMConfigManager.instance;
  }

  /**
   * Load configuration from environment variables
   */
  loadFromEnvironment(): LLMConfig {
    // Determine which API provider to use
    const apiProvider = (import.meta.env.VITE_API_PROVIDER || 'openai').toLowerCase() as APIProvider;
    
    // Get the appropriate API key based on provider
    let apiKey: string | undefined;
    if (apiProvider === 'openrouter') {
      apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey) {
        console.warn('VITE_OPENROUTER_API_KEY environment variable is missing when using OpenRouter');
        apiKey = 'missing-key';
      }
    } else {
      // Default to OpenAI
      apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        console.warn('VITE_OPENAI_API_KEY environment variable is missing when using OpenAI');
        apiKey = 'missing-key';
      }
    }
    
    // Clean the API key by removing any whitespace/newlines
    apiKey = apiKey.replace(/\s+/g, '');
    
    this.config = {
      apiProvider,
      apiKey,
      model: apiProvider === 'openrouter' 
        ? (import.meta.env.VITE_OPENROUTER_MODEL as ModelType) || 'google/gemini-2.0-flash-exp:free'
        : (import.meta.env.VITE_OPENAI_MODEL as ModelType) || 'gpt-4o-mini',
      maxTokens: parseInt(import.meta.env.VITE_LLM_MAX_TOKENS || import.meta.env.VITE_OPENAI_MAX_TOKENS || '2000'),
      temperature: parseFloat(import.meta.env.VITE_LLM_TEMPERATURE || import.meta.env.VITE_OPENAI_TEMPERATURE || '0.7'),
      baseURL: apiProvider === 'openrouter' 
        ? 'https://openrouter.ai/api/v1'
        : import.meta.env.VITE_OPENAI_BASE_URL,
      organization: import.meta.env.VITE_OPENAI_ORGANIZATION,
      project: import.meta.env.VITE_OPENAI_PROJECT,
      maxRetries: parseInt(import.meta.env.VITE_LLM_MAX_RETRIES || '5'),
      retryDelay: parseInt(import.meta.env.VITE_LLM_RETRY_DELAY || '5000')
    };

    this.validateConfig(this.config);
    return this.config;
  }

  /**
   * Get current configuration
   */
  getConfig(): LLMConfig {
    if (!this.config) {
      return this.loadFromEnvironment();
    }
    return this.config;
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<LLMConfig>): void {
    if (!this.config) {
      this.loadFromEnvironment();
    }
    this.config = { ...this.config!, ...updates };
    this.validateConfig(this.config);
  }

  /**
   * Validate configuration
   */
  private validateConfig(config: LLMConfig): void {
    if (!config.apiKey || config.apiKey.length < 10) {
      throw new Error('Invalid API key');
    }

    if (config.maxTokens < 1 || config.maxTokens > 100000) {
      throw new Error('Invalid max tokens: must be between 1 and 100000');
    }

    if (config.temperature < 0 || config.temperature > 2) {
      throw new Error('Invalid temperature: must be between 0 and 2');
    }
    
    if (config.apiProvider !== 'openai' && config.apiProvider !== 'openrouter') {
      throw new Error('Invalid API provider: must be "openai" or "openrouter"');
    }
  }

  /**
   * Get model-specific configurations
   */
  getModelConfig(model: ModelType): Partial<LLMConfig> {
    const baseConfig = this.getConfig();
    
    // Model configurations for different providers
    const openaiModelConfigs: Record<string, Partial<LLMConfig>> = {
      'gpt-4o': { maxTokens: 4000, temperature: 0.7 },
      'gpt-4o-mini': { maxTokens: 2000, temperature: 0.7 },
      'gpt-4-turbo': { maxTokens: 4000, temperature: 0.6 },
      'gpt-4': { maxTokens: 2000, temperature: 0.6 },
      'gpt-3.5-turbo': { maxTokens: 1500, temperature: 0.8 }
    };
    
    const openrouterModelConfigs: Record<string, Partial<LLMConfig>> = {
      'google/gemini-2.0-flash-exp:free': { maxTokens: 2000, temperature: 0.7 },
      'google/gemini-2.0-pro-exp-02-05:free': { maxTokens: 4000, temperature: 0.7 },
      'google/gemini-2.0-flash-thinking-exp:free': { maxTokens: 2000, temperature: 0.7 },
      'deepseek/deepseek-r1-distill-llama-70b:free': { maxTokens: 2000, temperature: 0.7 },
      'openrouter/quasar-alpha': { maxTokens: 4000, temperature: 0.7 }
    };
    
    // Select the appropriate config based on provider
    const modelConfigs = baseConfig.apiProvider === 'openrouter' 
      ? openrouterModelConfigs 
      : openaiModelConfigs;

    return {
      ...baseConfig,
      model,
      ...(modelConfigs[model] || {})
    };
  }

  /**
   * Get research-optimized configuration
   */
  getResearchConfig(): LLMConfig {
    const baseConfig = this.getConfig();
    const model = baseConfig.model;
      
    return {
      ...baseConfig,
      model,
      temperature: 0.5, // More conservative for research
      maxTokens: 4000
    };
  }

  /**
   * Get protocol-optimized configuration
   */
  getProtocolConfig(): LLMConfig {
    const baseConfig = this.getConfig();
    const model = baseConfig.model;
      
    return {
      ...baseConfig,
      model,
      temperature: 0.3, // Very conservative for structured protocols
      maxTokens: 3000
    };
  }

  /**
   * Get summary-optimized configuration
   */
  getSummaryConfig(): LLMConfig {
    const baseConfig = this.getConfig();
    const model = baseConfig.model;
      
    return {
      ...baseConfig,
      model,
      temperature: 0.7, // Balanced for readable summaries
      maxTokens: 2500
    };
  }
}

// Export singleton instance
export const llmConfig = LLMConfigManager.getInstance();