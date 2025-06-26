#!/usr/bin/env tsx

import 'dotenv/config';

console.log('🔍 Environment Variable Test');
console.log('============================');

// Test basic environment loading
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('PWD:', process.env.PWD);

// Test API key
const apiKey = process.env.OPENAI_API_KEY;
console.log('\n🔑 OpenAI API Key Test:');
console.log('Loaded:', apiKey ? 'YES' : 'NO');

if (apiKey) {
  console.log('Length:', apiKey.length);
  console.log('Starts with sk-:', apiKey.startsWith('sk-'));
  console.log('Has newlines:', apiKey.includes('\n'));
  console.log('Has carriage returns:', apiKey.includes('\r'));
  console.log('First 15 chars:', apiKey.substring(0, 15));
  console.log('Last 15 chars:', apiKey.substring(apiKey.length - 15));
  
  // Clean the API key
  const cleanKey = apiKey.replace(/[\r\n\s]/g, '');
  console.log('Clean key length:', cleanKey.length);
  console.log('Clean key differs from original:', cleanKey !== apiKey);
  
  if (cleanKey !== apiKey) {
    console.log('⚠️  API key contains whitespace/newlines');
    console.log('Setting clean key as OPENAI_API_KEY_CLEAN');
    process.env.OPENAI_API_KEY_CLEAN = cleanKey;
  }
}

// Test other OpenAI settings
console.log('\n⚙️  OpenAI Configuration:');
console.log('Model:', process.env.OPENAI_MODEL || 'not set');
console.log('Max Tokens:', process.env.OPENAI_MAX_TOKENS || 'not set');
console.log('Temperature:', process.env.OPENAI_TEMPERATURE || 'not set');

export { }; 