/**
 * LLM Service - Core OpenAI Integration
 * 
 * Comprehensive service for flexible LLM interaction with robust error handling,
 * retry logic, streaming support, and analytics.
 */

import OpenAI from 'openai';
import {
  LLMConfig, 
  LLMRequest, 
  LLMResult, 
  LLMError, 
  LLMBatchRequest, 
  LLMBatchResult,
  LLMAnalytics,
  RetryPolicy,
  LLMRequestConfig,
  ModelType,
  LLMEventListener,
  LLMServiceEvent,
  APIProvider
} from './types';

export class LLMService {
  private openai: OpenAI;
  private config: LLMConfig;
  private analytics: LLMAnalytics;
  private defaultRetryPolicy: RetryPolicy;

  /**
   * Get current configuration
   */
  getConfig(): LLMConfig {
    return { ...this.config };
  }

  constructor(config: LLMConfig) {
    this.config = config;
    
    // Initialize OpenAI client with appropriate configuration
    const openaiConfig: any = {
      apiKey: config.apiKey
    };
    
    // Add provider-specific configuration
    if (config.apiProvider === 'openrouter') {
      openaiConfig.baseURL = 'https://openrouter.ai/api/v1';
    } else {
      // Standard OpenAI configuration
      openaiConfig.baseURL = config.baseURL;
      openaiConfig.organization = config.organization;
      openaiConfig.project = config.project;
    }
    
    // Allow browser usage - required for browser environments
    openaiConfig.dangerouslyAllowBrowser = true;
   
    this.openai = new OpenAI(openaiConfig);

    this.analytics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalTokensUsed: 0,
      averageResponseTime: 0,
      costEstimate: 0,
      modelUsage: {},
      errorBreakdown: {}
    };

    this.defaultRetryPolicy = {
      maxRetries: config.maxRetries || 5,
      baseDelay: config.retryDelay || 5000,
      maxDelay: 30000,
      backoffMultiplier: 2,
      retryCondition: (error: LLMError) => 
        error.type === 'rate_limit_error' || 
        error.type === 'network_error' ||
        (error.type === 'api_error' && error.statusCode !== undefined && 
         (error.statusCode >= 500 || error.statusCode === 429))
    };
  }

  /**
   * Main method for making LLM requests
   */
  async generateText(request: LLMRequest): Promise<LLMResult> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.analytics.totalRequests++;

      // Build messages array
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
      
      if (request.systemPrompt) {
        messages.push({
          role: 'system',
          content: request.systemPrompt
        });
      }

      // Add context if provided
      let userContent = request.userPrompt;
      if (request.context) {
        userContent = `Context: ${request.context}\n\n${userContent}`;
      }

      // Add examples if provided
      if (request.examples && request.examples.length > 0) {
        const examplesText = request.examples
          .map(ex => `Example:\nInput: ${ex.input}\nOutput: ${ex.output}`)
          .join('\n\n');
        userContent = `${examplesText}\n\n${userContent}`;
      }

      messages.push({
        role: 'user',
        content: userContent
      });

      // Merge configurations
      const finalConfig = this.mergeConfig(request.config);

      // Make the API call with retry logic
      const response = await this.makeRequestWithRetry(async () => {
        // Create request parameters based on provider
        const requestParams: any = {
          model: finalConfig.model || this.config.model,
          messages,
          max_tokens: finalConfig.maxTokens || this.config.maxTokens,
          temperature: finalConfig.temperature ?? this.config.temperature,
          top_p: finalConfig.topP,
          frequency_penalty: finalConfig.frequencyPenalty,
          presence_penalty: finalConfig.presencePenalty,
          stop: finalConfig.stop,
          stream: false,
          seed: finalConfig.seed,
          logit_bias: finalConfig.logitBias,
        };
        
        // Add OpenRouter-specific headers if needed
        const headers: Record<string, string> = {};
        if (this.config.apiProvider === 'openrouter') {
          headers['HTTP-Referer'] = 'https://research-discovery-engine.example.com';
          headers['X-Title'] = 'Research Discovery Engine';
        }
        
        return await this.openai.chat.completions.create(requestParams, { headers });
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Update analytics
      this.updateAnalytics(response, duration, true);

      // Build result
      const result: LLMResult = {
        content: response.choices[0]?.message?.content || '',
        success: true,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0
        },
        metadata: {
          model: response.model,
          temperature: finalConfig.temperature ?? this.config.temperature,
          maxTokens: finalConfig.maxTokens || this.config.maxTokens,
          requestId,
          timestamp: startTime,
          duration,
          finishReason: response.choices[0]?.finish_reason || 'unknown'
        },
        rawResponse: response
      };

      return result;

    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      const llmError = this.handleError(error);
      this.updateAnalytics(null, duration, false, llmError);

      return {
        content: '',
        success: false,
        error: llmError.message,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        metadata: {
          model: request.config?.model || this.config.model,
          temperature: request.config?.temperature ?? this.config.temperature,
          maxTokens: request.config?.maxTokens || this.config.maxTokens,
          requestId,
          timestamp: startTime,
          duration,
          finishReason: 'error'
        }
      };
    }
  }

  /**
   * Streaming text generation
   */
  async *generateTextStream(request: LLMRequest): AsyncGenerator<string, void, unknown> {
    try {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
      
      if (request.systemPrompt) {
        messages.push({ role: 'system', content: request.systemPrompt });
      }

      let userContent = request.userPrompt;
      if (request.context) {
        userContent = `Context: ${request.context}\n\n${userContent}`;
      }

      messages.push({ role: 'user', content: userContent });

      const finalConfig = this.mergeConfig(request.config);

      // Create request parameters based on provider
      const requestParams: any = {
        model: finalConfig.model || this.config.model,
        messages,
        max_tokens: finalConfig.maxTokens || this.config.maxTokens,
        temperature: finalConfig.temperature ?? this.config.temperature,
        stream: true
      };
      
      // Add OpenRouter-specific headers if needed
      const headers: Record<string, string> = {};
      if (this.config.apiProvider === 'openrouter') {
        headers['HTTP-Referer'] = 'https://research-discovery-engine.example.com';
        headers['X-Title'] = 'Research Discovery Engine';
      }
      const stream = await this.openai.chat.completions.create(requestParams, { headers });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }

    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Batch processing of multiple requests
   */
  async generateBatch(batchRequest: LLMBatchRequest): Promise<LLMBatchResult> {
    const startTime = Date.now();
    const results: (LLMResult | LLMError)[] = [];
    const concurrency = batchRequest.concurrency || 5;
    
    let successfulRequests = 0;
    let failedRequests = 0;
    let totalUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

    // Process requests in batches
    for (let i = 0; i < batchRequest.requests.length; i += concurrency) {
      const batch = batchRequest.requests.slice(i, i + concurrency);
      const promises = batch.map(async (request, index) => {
        try {
          const result = await this.generateText(request);
          
          if (result.success) {
            successfulRequests++;
            totalUsage.promptTokens += result.usage.promptTokens;
            totalUsage.completionTokens += result.usage.completionTokens;
            totalUsage.totalTokens += result.usage.totalTokens;
          } else {
            failedRequests++;
            if (batchRequest.onError) {
              const error: LLMError = {
                type: 'api_error',
                message: result.error || 'Unknown error'
              };
              batchRequest.onError(error, request, i + index);
            }
          }

          return result;
        } catch (error) {
          failedRequests++;
          const llmError = this.handleError(error);
          if (batchRequest.onError) {
            batchRequest.onError(llmError, request, i + index);
          }
          return llmError;
        }
      });

      const batchResults = await Promise.all(promises);
      results.push(...batchResults);

      // Progress callback
      if (batchRequest.onProgress) {
        batchRequest.onProgress(results.length, batchRequest.requests.length);
      }
    }

    const totalDuration = Date.now() - startTime;

    return {
      results,
      totalRequests: batchRequest.requests.length,
      successfulRequests,
      failedRequests,
      totalDuration,
      totalUsage
    };
  }

  /**
   * Get analytics data
   */
  getAnalytics(): LLMAnalytics {
    return { ...this.analytics };
  }

  /**
   * Reset analytics
   */
  resetAnalytics(): void {
    this.analytics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalTokensUsed: 0,
      averageResponseTime: 0,
      costEstimate: 0,
      modelUsage: {},
      errorBreakdown: {}
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<LLMConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Reinitialize OpenAI client with updated configuration
    const openaiConfig: any = {
      apiKey: this.config.apiKey
    };
    
    // Add provider-specific configuration
    if (this.config.apiProvider === 'openrouter') {
      openaiConfig.baseURL = 'https://openrouter.ai/api/v1';
    } else {
      // Standard OpenAI configuration
      openaiConfig.baseURL = this.config.baseURL;
      openaiConfig.organization = this.config.organization;
      openaiConfig.project = this.config.project;
    }
    
    this.openai = new OpenAI(openaiConfig);
  }

  /**
   * Test connection to OpenAI API
   */
  async testConnection(): Promise<boolean> {
    try {
      const headers: Record<string, string> = {};
      if (this.config.apiProvider === 'openrouter') {
        headers['HTTP-Referer'] = 'https://research-discovery-engine.example.com';
        headers['X-Title'] = 'Research Discovery Engine';
      }
      
      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5,
        temperature: 0
      }, { headers });
      
      return response.choices.length > 0;
    } catch {
      return false;
    }
  }

  // Private methods

  private mergeConfig(requestConfig?: LLMRequestConfig): LLMRequestConfig {
    return {
      model: requestConfig?.model || this.config.model,
      maxTokens: requestConfig?.maxTokens || this.config.maxTokens,
      temperature: requestConfig?.temperature ?? this.config.temperature,
      topP: requestConfig?.topP,
      frequencyPenalty: requestConfig?.frequencyPenalty,
      presencePenalty: requestConfig?.presencePenalty,
      stop: requestConfig?.stop,
      stream: requestConfig?.stream,
      seed: requestConfig?.seed,
      logitBias: requestConfig?.logitBias,
    };
  }

  private async makeRequestWithRetry<T>(
    requestFn: () => Promise<T>,
    retryPolicy: RetryPolicy = this.defaultRetryPolicy
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= retryPolicy.maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        const llmError = this.handleError(error);
        
        if (attempt === retryPolicy.maxRetries || !retryPolicy.retryCondition(llmError)) {
          throw error;
        }

        const delay = Math.min(
          retryPolicy.baseDelay * Math.pow(retryPolicy.backoffMultiplier, attempt),
          retryPolicy.maxDelay
        );

        console.log(`Retry attempt ${attempt + 1}/${retryPolicy.maxRetries} after ${delay}ms delay. Error: ${llmError.message}`);
        await new Promise<void>(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }

  private handleError(error: any): LLMError {
    // Handle OpenRouter-specific errors
    if (this.config.apiProvider === 'openrouter') {
      if (error?.status === 429 || (error?.error && error?.error.type === 'insufficient_quota')) {
        return {
          type: 'rate_limit_error',
          message: 'OpenRouter rate limit exceeded or insufficient quota',
          code: error.error?.code,
          statusCode: error.status || 429,
          retryAfter: error.headers?.['retry-after'] ? parseInt(error.headers['retry-after']) : 5
        };
      }
    }
    
    // Handle OpenRouter-specific errors
    if (this.config.apiProvider === 'openrouter') {
      if (error?.status === 429 || (error?.error && error?.error.type === 'insufficient_quota')) {
        return {
          type: 'rate_limit_error',
          message: 'OpenRouter rate limit exceeded or insufficient quota',
          code: error.error?.code,
          statusCode: error.status || 429,
          retryAfter: error.headers?.['retry-after'] ? parseInt(error.headers['retry-after']) : 5
        };
      }
    }
    
    if (error?.error?.type === 'insufficient_quota') {
      return {
        type: 'rate_limit_error',
        message: 'Insufficient quota. Please check your billing.',
        code: error.error.code,
        statusCode: error.status
      };
    }

    if (error?.status === 429) {
      return {
        type: 'rate_limit_error',
        message: 'Rate limit exceeded',
        code: error.error?.code,
        statusCode: error.status,
        retryAfter: error.headers?.['retry-after']
      };
    }

    if (error?.status >= 500) {
      return {
        type: 'api_error',
        message: 'Server error',
        code: error.error?.code,
        statusCode: error.status
      };
    }

    if (error?.status >= 400) {
      return {
        type: 'validation_error',
        message: error.error?.message || 'Invalid request',
        code: error.error?.code,
        statusCode: error.status
      };
    }

    if (error?.code === 'ENOTFOUND' || error?.code === 'ECONNREFUSED') {
      return {
        type: 'network_error',
        message: 'Network connection failed',
        details: error
      };
    }

    return {
      type: 'api_error',
      message: error?.message || 'Unknown error occurred',
      details: error
    };
  }

  private updateAnalytics(
    response: OpenAI.Chat.Completions.ChatCompletion | null,
    duration: number,
    success: boolean,
    error?: LLMError
  ): void {
    if (success && response) {
      this.analytics.successfulRequests++;
      this.analytics.totalTokensUsed += response.usage?.total_tokens || 0;
      
      // Update model usage
      const model = response.model;
      this.analytics.modelUsage[model] = (this.analytics.modelUsage[model] || 0) + 1;
      
      // Estimate cost (rough estimates for common models)
      this.analytics.costEstimate += this.estimateCost(response);
    } else {
      this.analytics.failedRequests++;
      
      if (error) {
        this.analytics.errorBreakdown[error.type] = 
          (this.analytics.errorBreakdown[error.type] || 0) + 1;
      }
    }

    // Update average response time
    const totalTime = this.analytics.averageResponseTime * (this.analytics.totalRequests - 1) + duration;
    this.analytics.averageResponseTime = totalTime / this.analytics.totalRequests;
  }

  private estimateCost(response: OpenAI.Chat.Completions.ChatCompletion): number {
    const usage = response.usage;
    if (!usage) return 0;

    // Rough cost estimates (USD per 1K tokens) - update these as needed
    const openaiCosts: Record<string, { input: number; output: number }> = {
      'gpt-4o': { input: 0.005, output: 0.015 },
      'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-3.5-turbo': { input: 0.0015, output: 0.002 }
    };
    
    // OpenRouter models are mostly free tier or have different pricing
    const openrouterCosts: Record<string, { input: number; output: number }> = {
      'google/gemini-2.0-flash-exp:free': { input: 0, output: 0 },
      'google/gemini-2.0-pro-exp-02-05:free': { input: 0, output: 0 },
      'deepseek/deepseek-r1-distill-llama-70b:free': { input: 0, output: 0 },
      'openrouter/quasar-alpha': { input: 0, output: 0 }
    };
    
    // Select the appropriate cost model based on provider
    const costPerModel = this.config.apiProvider === 'openrouter' 
      ? openrouterCosts 
      : openaiCosts;

    const model = response.model;
    const costs = costPerModel[model] || { input: 0, output: 0 };
    
    const inputCost = (usage.prompt_tokens / 1000) * costs.input;
    const outputCost = (usage.completion_tokens / 1000) * costs.output;
    
    return inputCost + outputCost;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 