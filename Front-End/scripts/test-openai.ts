#!/usr/bin/env tsx

import { loadEnvironment } from './load-env';
import { createLLMService, createProviderService } from '../src/llm/utils/factory';

async function testConnection() {
  console.log('🔄 Testing LLM API Connection...\n');

  // Load environment variables
  const envResult = loadEnvironment();
  if (!envResult.success) {
    console.error('❌ Environment loading failed:', envResult.message);
    process.exit(1);
  }

  console.log('✅ Environment loaded successfully');
  console.log('🔑 API Key:', envResult.apiKeyPreview);

  // Determine which API provider to use
  const apiProvider = process.env.API_PROVIDER || 'openai';
  console.log(`🤖 Using API Provider: ${apiProvider}`);

  try {
    // Create appropriate LLM service based on provider
    const llmService = apiProvider === 'openrouter'
      ? createProviderService('openrouter')
      : createLLMService();
    
    console.log('🔄 Testing connection...');
    
    // Test connection
    const isConnected = await llmService.testConnection();
    
    if (isConnected) {
      console.log(`✅ Successfully connected to ${apiProvider === 'openrouter' ? 'OpenRouter' : 'OpenAI'} API`);
      
      // Send a simple test request
      console.log('🔄 Sending test request...');
      
      const response = await llmService.generateText({
        userPrompt: 'Say "Hello from the Research Discovery Engine!" and nothing else.'
      });
      
      if (response.success) {
        console.log('✅ Test request successful');
        console.log('📝 Response:', response.content);
        console.log('📊 Token usage:', response.usage);
        console.log('⏱️  Response time:', response.metadata.duration, 'ms');
      } else {
        console.error('❌ Test request failed:', response.error);
      }
    } else {
      console.error(`❌ Failed to connect to ${apiProvider === 'openrouter' ? 'OpenRouter' : 'OpenAI'} API`);
    }
  } catch (error) {
    console.error(`❌ Error testing ${apiProvider === 'openrouter' ? 'OpenRouter' : 'OpenAI'} connection:`, error);
  }
}

testConnection();