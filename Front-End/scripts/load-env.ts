#!/usr/bin/env tsx
/**
 * Environment Variable Loader Utility
 * 
 * This utility ensures consistent loading of environment variables
 * from the .env file located in the DE directory (parent of scripts)
 */

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load environment variables from the .env file in the DE directory
 */
export function loadEnvironment(): { success: boolean; message: string; apiKeyPreview?: string } {
  // Try to find .env file in parent directory (DE folder)
  const envPath = resolve(__dirname, '..', '.env');
  const envExamplePath = resolve(__dirname, '..', '.env.example');
  
  if (existsSync(envPath)) {
    // Load from .env file
    const result = config({ path: envPath });
    
    if (result.error) {
      return {
        success: false,
        message: `Failed to load .env file: ${result.error.message}`
      };
    }
    
    // Determine which API provider to use
    const apiProvider = (process.env.API_PROVIDER || 'openai').toLowerCase();
    
    // Get the appropriate API key based on provider
    let apiKey: string | undefined;
    if (apiProvider === 'openrouter') {
      apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        return {
          success: false,
          message: 'OPENROUTER_API_KEY not found in .env file when using OpenRouter'
        };
      }
    } else {
      // Default to OpenAI
      apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return {
          success: false,
          message: 'OPENAI_API_KEY not found in .env file'
        };
      }
    }
    
    // Clean the API key by removing any whitespace/newlines
    apiKey = apiKey.replace(/\s+/g, '');
    
    // Update the environment variable
    if (apiProvider === 'openrouter') {
      process.env.OPENROUTER_API_KEY = apiKey;
    } else {
      process.env.OPENAI_API_KEY = apiKey;
    }
    
    return {
      success: true,
      message: `Environment variables loaded successfully from .env (API Provider: ${apiProvider})`,
      apiKeyPreview: apiKey.substring(0, 20) + '...'
    };
    
  } else if (existsSync(envExamplePath)) {
    // Load from .env.example as fallback
    const result = config({ path: envExamplePath });
    
    return {
      success: false,
      message: 'Using .env.example - please create .env with your actual API key (OpenAI or OpenRouter)'
    };
    
  } else {
    return {
      success: false,
      message: 'No .env file found in DE directory. Please create one with your API key (OpenAI or OpenRouter).'
    };
  }
}

/**
 * Load environment and exit if unsuccessful (for scripts that require API access)
 */
export function requireEnvironment(): void {
  const result = loadEnvironment();
  
  if (!result.success) {
    console.error('❌ Environment loading failed:', result.message);
    console.error('📝 Please create a .env file in the DE directory with your API key');
    console.error('   For OpenAI: OPENAI_API_KEY=your_key_here');
    console.error('   For OpenRouter: API_PROVIDER=openrouter OPENROUTER_API_KEY=your_key_here');
    process.exit(1);
  }
  
  console.log('✅', result.message);
  if (result.apiKeyPreview) {
    console.log('🔑 API Key:', result.apiKeyPreview);
  }
}

// If run directly, test the environment loading
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🔧 Testing Environment Variable Loading...\n');
  
  const result = loadEnvironment();
  
  if (result.success) {
    console.log('✅', result.message);
    console.log('🔑 API Key Preview:', result.apiKeyPreview);
    
    // Show provider-specific information
    const apiProvider = process.env.API_PROVIDER || 'openai';
    if (apiProvider === 'openrouter') {
      console.log('🤖 Provider: OpenRouter');
      console.log('🤖 Model:', process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free');
    } else {
      console.log('🤖 Provider: OpenAI');
      console.log('🤖 Model:', process.env.OPENAI_MODEL || 'gpt-4o-mini');
    }
    
    console.log('🎛️  Max Tokens:', process.env.LLM_MAX_TOKENS || process.env.OPENAI_MAX_TOKENS || '2000');
    console.log('🌡️  Temperature:', process.env.LLM_TEMPERATURE || process.env.OPENAI_TEMPERATURE || '0.7');
    console.log('🔄 Max Retries:', process.env.LLM_MAX_RETRIES || '5');
    console.log('⏱️  Retry Delay:', process.env.LLM_RETRY_DELAY || '5000');
  } else {
    console.error('❌', result.message);
    process.exit(1);
  }
}