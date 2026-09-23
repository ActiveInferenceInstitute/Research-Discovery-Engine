#!/usr/bin/env tsx
/**
 * OpenRouter API Test Script
 * 
 * This script tests the OpenRouter API integration with the Research Discovery Engine.
 * It sends a test request to OpenRouter and displays the response.
 */

import { loadEnvironment } from './load-env';
import { createProviderService } from '../src/llm/utils/factory';

async function testOpenRouter() {
  console.log('🔄 Testing OpenRouter API Connection...\n');

  // Load environment variables
  const envResult = loadEnvironment();
  if (!envResult.success) {
    console.error('❌ Environment loading failed:', envResult.message);
    process.exit(1);
  }

  // Check if API_PROVIDER is set to openrouter
  const apiProvider = process.env.API_PROVIDER || import.meta.env?.VITE_API_PROVIDER || 'openai';
  if (apiProvider !== 'openrouter') {
    console.error('❌ API_PROVIDER is not set to "openrouter" in your .env file');
    console.error('Please set API_PROVIDER=openrouter in your .env file');
    process.exit(1);
  }

  // Check if OPENROUTER_API_KEY is set
  if (!process.env.OPENROUTER_API_KEY && !import.meta.env?.VITE_OPENROUTER_API_KEY) {
    console.error('❌ OPENROUTER_API_KEY is not set in your .env file');
    console.error('Please set OPENROUTER_API_KEY=your_key_here in your .env file');
    process.exit(1);
  }

  console.log('✅ Environment loaded successfully');
  console.log('🔑 API Key:', envResult.apiKeyPreview);
  console.log('🤖 Model:', process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free');

  try {
    // Create OpenRouter service
    const openrouterService = createProviderService('openrouter');
    
    console.log('🔄 Testing connection to OpenRouter...');
    
    // Test connection
    const isConnected = await openrouterService.testConnection();
    
    if (isConnected) {
      console.log('✅ Successfully connected to OpenRouter API');
      
      // Send a simple test request
      console.log('🔄 Sending test request to OpenRouter...');
      
      const response = await openrouterService.generateText({
        userPrompt: 'Say "Hello from OpenRouter!" and nothing else.'
      });
      
      if (response.success) {
        console.log('✅ Test request successful');
        console.log('📝 Response:', response.content);
        console.log('📊 Token usage:', response.usage);
        console.log('⏱️  Response time:', response.metadata.duration, 'ms');
        console.log('🤖 Model used:', response.metadata.model);
      } else {
        console.error('❌ Test request failed:', response.error);
      }
    } else {
      console.error('❌ Failed to connect to OpenRouter API');
    }
  } catch (error) {
    console.error('❌ Error testing OpenRouter connection:', error);
  }
}

testOpenRouter();