const fs = require('fs');
const path = require('path');

// Validate that all terminology is properly integrated
const terminology = require('../src/data/terminology.json');

console.log('🔍 Validating terminology integration...');

const novelTerms = Object.keys(terminology.novel_terms);
const borrowedTerms = Object.keys(terminology.borrowed_terms);

console.log(`✅ Found ${novelTerms.length} novel terms`);
console.log(`✅ Found ${borrowedTerms.length} borrowed terms`);

// Check for missing definitions
const allTerms = [...novelTerms, ...borrowedTerms];
const missingDescriptions = allTerms.filter(termId => {
  const termData = terminology.novel_terms[termId] || terminology.borrowed_terms[termId];
  return !termData.detailed_description || termData.detailed_description.length < 50;
});

if (missingDescriptions.length > 0) {
  console.warn(`⚠️  Terms needing better descriptions: ${missingDescriptions.join(', ')}`);
} else {
  console.log('✅ All terms have adequate descriptions');
}

console.log('📊 Terminology validation complete!');