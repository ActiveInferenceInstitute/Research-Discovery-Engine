/**
 * LLM Error Classes
 * 
 * Custom error classes for better error handling in LLM operations
 */

/**
 * Base LLM Error class
 */
export class LLMError extends Error {
  public readonly type: string;
  public readonly code?: string;
  public readonly statusCode?: number;
  public retryAfter?: number;
  public readonly details?: any;

  constructor(
    message: string,
    type: string = 'llm_error',
    code?: string,
    statusCode?: number,
    details?: any
  ) {
    super(message);
    this.name = 'LLMError';
    this.type = type;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LLMError);
    }
  }

  /**
   * Create error from OpenAI API error
   */
  static fromOpenAIError(error: any): LLMError {
    const message = error?.error?.message || error?.message || 'Unknown OpenAI error';
    const code = error?.error?.code || error?.code;
    const statusCode = error?.status || error?.statusCode;

    let type = 'api_error';
    if (statusCode === 429) {
      type = 'rate_limit_error';
    } else if (statusCode >= 500) {
      type = 'api_error';
    } else if (statusCode >= 400) {
      type = 'validation_error';
    }

    const llmError = new LLMError(message, type, code, statusCode, error);
    
    // Extract retry-after header for rate limits
    if (type === 'rate_limit_error' && error?.headers?.['retry-after']) {
      llmError.retryAfter = parseInt(error.headers['retry-after']);
    }

    return llmError;
  }

  /**
   * Create network error
   */
  static networkError(message: string, details?: any): LLMError {
    return new LLMError(message, 'network_error', undefined, undefined, details);
  }

  /**
   * Create timeout error
   */
  static timeoutError(message: string, details?: any): LLMError {
    return new LLMError(message, 'timeout_error', undefined, undefined, details);
  }

  /**
   * Create validation error
   */
  static validationError(message: string, details?: any): LLMError {
    return new LLMError(message, 'validation_error', undefined, 400, details);
  }

  /**
   * Create rate limit error
   */
  static rateLimitError(message: string, retryAfter?: number, details?: any): LLMError {
    const error = new LLMError(message, 'rate_limit_error', 'rate_limit_exceeded', 429, details);
    error.retryAfter = retryAfter;
    return error;
  }
}

/**
 * Configuration Error class
 */
export class LLMConfigError extends Error {
  public readonly field?: string;
  public readonly value?: any;

  constructor(message: string, field?: string, value?: any) {
    super(message);
    this.name = 'LLMConfigError';
    this.field = field;
    this.value = value;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LLMConfigError);
    }
  }

  static invalidApiKey(): LLMConfigError {
    return new LLMConfigError('Invalid or missing OpenAI API key', 'apiKey');
  }

  static invalidModel(model: string): LLMConfigError {
    return new LLMConfigError(`Invalid model: ${model}`, 'model', model);
  }

  static invalidTemperature(temperature: number): LLMConfigError {
    return new LLMConfigError(
      `Invalid temperature: ${temperature}. Must be between 0 and 2.`,
      'temperature',
      temperature
    );
  }

  static invalidMaxTokens(maxTokens: number): LLMConfigError {
    return new LLMConfigError(
      `Invalid maxTokens: ${maxTokens}. Must be between 1 and 100000.`,
      'maxTokens',
      maxTokens
    );
  }
}

/**
 * Service Error class
 */
export class LLMServiceError extends Error {
  public readonly service: string;
  public readonly operation: string;
  public readonly cause?: Error;

  constructor(message: string, service: string, operation: string, cause?: Error) {
    super(message);
    this.name = 'LLMServiceError';
    this.service = service;
    this.operation = operation;
    this.cause = cause;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LLMServiceError);
    }
  }

  static serviceUnavailable(service: string, operation: string): LLMServiceError {
    return new LLMServiceError(
      `Service ${service} is currently unavailable for operation: ${operation}`,
      service,
      operation
    );
  }

  static operationFailed(service: string, operation: string, cause?: Error): LLMServiceError {
    return new LLMServiceError(
      `Operation ${operation} failed in service ${service}: ${cause?.message || 'Unknown error'}`,
      service,
      operation,
      cause
    );
  }

  static invalidInput(service: string, operation: string, details: string): LLMServiceError {
    return new LLMServiceError(
      `Invalid input for ${service}.${operation}: ${details}`,
      service,
      operation
    );
  }
}

/**
 * Type guard for LLM errors
 */
export function isLLMError(error: any): error is LLMError {
  return error instanceof LLMError || (error && error.name === 'LLMError');
}

/**
 * Type guard for config errors
 */
export function isLLMConfigError(error: any): error is LLMConfigError {
  return error instanceof LLMConfigError || (error && error.name === 'LLMConfigError');
}

/**
 * Type guard for service errors
 */
export function isLLMServiceError(error: any): error is LLMServiceError {
  return error instanceof LLMServiceError || (error && error.name === 'LLMServiceError');
}

/**
 * Format error for logging
 */
export function formatLLMError(error: any): string {
  if (isLLMError(error)) {
    return `LLMError [${error.type}]: ${error.message} (Code: ${error.code || 'N/A'}, Status: ${error.statusCode || 'N/A'})`;
  } else if (isLLMConfigError(error)) {
    return `LLMConfigError: ${error.message} (Field: ${error.field || 'N/A'})`;
  } else if (isLLMServiceError(error)) {
    return `LLMServiceError [${error.service}.${error.operation}]: ${error.message}`;
  } else {
    return `Unknown Error: ${error?.message || String(error)}`;
  }
} 