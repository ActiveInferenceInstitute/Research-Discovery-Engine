# Research Workflow Example

This example demonstrates a complete research workflow using the Research Discovery Engine, from literature exploration to concept design and protocol generation.

## Overview

This workflow covers:

1. **Literature Analysis** - Process and analyze research papers
2. **Knowledge Graph Exploration** - Navigate existing knowledge 
3. **Gap Identification** - Find research opportunities
4. **Concept Design** - Create and validate new research concepts
5. **Protocol Generation** - Generate experimental procedures
6. **Collaboration** - Share and collaborate on research

## Prerequisites

- Research Discovery Engine backend running
- Node.js 18+ or Python 3.8+
- Access to research documents (PDFs)

## Quick Start

```bash
# JavaScript/Node.js version
cd src/examples/research-workflow
npm install
npm run workflow

# Python version  
cd src/examples/research-workflow
pip install -r requirements.txt
python research_workflow.py
```

## Workflow Steps

### 1. Document Processing

Upload and process research papers to extract concepts and relationships:

```javascript
import DiscoveryEngineClient from '../../utils/de-client/index.js';

const client = new DiscoveryEngineClient();

async function processLiterature() {
    // Upload research papers
    const papers = [
        'smart_materials_review.pdf',
        'energy_harvesting_mechanisms.pdf',
        'biocompatible_polymers.pdf'
    ];
    
    const documents = [];
    
    for (const paper of papers) {
        console.log(`Processing ${paper}...`);
        
        const result = await client.documents.upload(
            paper,
            {
                category: 'research-paper',
                domain: 'materials-science',
                authors: ['extracted-from-metadata']
            },
            {
                extract_concepts: true,
                extract_relationships: true,
                generate_summary: true
            }
        );
        
        documents.push(result);
        
        // Wait for processing to complete
        let status = 'processing';
        while (status === 'processing') {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const statusResult = await client.documents.getStatus(result.id);
            status = statusResult.status;
        }
        
        console.log(`✅ ${paper} processed successfully`);
    }
    
    return documents;
}
```

### 2. Knowledge Graph Exploration

Explore the updated knowledge graph to understand the research landscape:

```javascript
async function exploreKnowledgeGraph() {
    console.log('🔍 Exploring knowledge graph...');
    
    // Get overview of all categories
    const overview = await client.graph.getAnalytics({
        metrics: ['centrality', 'clustering', 'density']
    });
    
    console.log('Knowledge Graph Overview:');
    console.log(`- Total concepts: ${overview.overview.total_nodes}`);
    console.log(`- Total relationships: ${overview.overview.total_relationships}`);
    console.log(`- Graph density: ${overview.overview.density.toFixed(3)}`);
    
    // Explore high-centrality concepts
    console.log('\nMost central concepts:');
    overview.centrality.most_central.slice(0, 5).forEach(concept => {
        console.log(`- ${concept.label} (${concept.category})`);
    });
    
    // Get materials related to energy applications
    const energyMaterials = await client.search.search(
        'energy harvesting materials smart responsive',
        {
            limit: 10,
            filters: { categories: ['materials', 'applications'] }
        }
    );
    
    console.log('\nEnergy-related materials:');
    energyMaterials.results.forEach(result => {
        console.log(`- ${result.node.label} (relevance: ${result.relevance_score.toFixed(2)})`);
    });
    
    return { overview, energyMaterials };
}
```

### 3. Gap Identification

Use AI agents to identify research gaps and opportunities:

```javascript
async function identifyResearchGaps(explorationResults) {
    console.log('🧠 Identifying research gaps...');
    
    // Use exploration agent to find knowledge gaps
    const gapAnalysis = await client.agents.triggerAction(
        'exploration-agent',
        'identify_knowledge_gaps',
        {
            focus_areas: ['smart-materials', 'energy-harvesting', 'biocompatibility'],
            current_concepts: explorationResults.energyMaterials.results.map(r => r.node.id),
            analysis_depth: 'comprehensive'
        }
    );
    
    console.log('Identified research gaps:');
    gapAnalysis.results.gaps.forEach(gap => {
        console.log(`- ${gap.description}`);
        console.log(`  Opportunity score: ${gap.opportunity_score.toFixed(2)}`);
        console.log(`  Required expertise: ${gap.required_expertise.join(', ')}`);
        console.log();
    });
    
    // Find analogous concepts from other domains
    const analogies = await client.agents.triggerAction(
        'exploration-agent',
        'find_cross_domain_analogies',
        {
            source_domain: 'materials-science',
            target_domains: ['biology', 'physics', 'chemistry'],
            concepts_of_interest: explorationResults.energyMaterials.results.slice(0, 3).map(r => r.node.id)
        }
    );
    
    console.log('Cross-domain analogies:');
    analogies.results.analogies.forEach(analogy => {
        console.log(`- ${analogy.source_concept} ↔ ${analogy.target_concept}`);
        console.log(`  Domain: ${analogy.target_domain}`);
        console.log(`  Similarity: ${analogy.similarity_score.toFixed(2)}`);
        console.log();
    });
    
    return { gaps: gapAnalysis.results.gaps, analogies: analogies.results.analogies };
}
```

### 4. Concept Design

Design new research concepts based on identified opportunities:

```javascript
async function designResearchConcepts(gapAnalysis) {
    console.log('🔬 Designing research concepts...');
    
    const concepts = [];
    
    // Create concepts based on top gaps
    for (const gap of gapAnalysis.gaps.slice(0, 3)) {
        console.log(`Designing concept for: ${gap.description}`);
        
        const concept = await client.concepts.create(
            gap.description,
            {
                // Initial components based on gap analysis
                materials: gap.suggested_materials || [],
                mechanisms: gap.suggested_mechanisms || [],
                methods: gap.suggested_methods || []
            },
            {
                // Constraints from gap requirements
                performance_targets: gap.performance_targets || {},
                feasibility_requirements: gap.feasibility_requirements || {},
                timeline: gap.estimated_timeline || 'medium-term'
            }
        );
        
        console.log(`✅ Created concept: ${concept.id}`);
        console.log(`   Title: ${concept.objective}`);
        console.log(`   Status: ${concept.status}`);
        
        // Enhance concept with AI suggestions
        const enhancement = await client.agents.triggerAction(
            'design-agent',
            'enhance_concept',
            {
                concept_id: concept.id,
                enhancement_type: 'comprehensive',
                consider_analogies: true
            }
        );
        
        if (enhancement.results.suggestions) {
            console.log('   AI Suggestions:');
            enhancement.results.suggestions.forEach(suggestion => {
                console.log(`   - ${suggestion.type}: ${suggestion.description}`);
            });
        }
        
        concepts.push(concept);
    }
    
    return concepts;
}
```

### 5. Concept Validation

Validate the designed concepts for feasibility and consistency:

```javascript
async function validateConcepts(concepts) {
    console.log('✅ Validating research concepts...');
    
    const validationResults = [];
    
    for (const concept of concepts) {
        console.log(`Validating concept: ${concept.id}`);
        
        // Run comprehensive validation
        const validation = await client.concepts.validate(
            concept.id,
            ['compatibility', 'physics', 'chemistry', 'feasibility'],
            'detailed'
        );
        
        console.log('Validation Results:');
        validation.forEach(result => {
            console.log(`- ${result.validation_type}: ${result.status}`);
            if (result.status === 'failed' || result.status === 'warning') {
                console.log(`  Issues: ${result.issues.join(', ')}`);
            }
            if (result.recommendations) {
                console.log(`  Recommendations: ${result.recommendations.join(', ')}`);
            }
        });
        
        // Calculate overall viability score
        const viabilityScore = validation.reduce((sum, v) => {
            return sum + (v.status === 'passed' ? 1 : v.status === 'warning' ? 0.5 : 0);
        }, 0) / validation.length;
        
        console.log(`Overall viability: ${(viabilityScore * 100).toFixed(1)}%`);
        console.log();
        
        validationResults.push({
            concept,
            validation,
            viabilityScore
        });
    }
    
    return validationResults;
}
```

### 6. Protocol Generation

Generate experimental protocols for the validated concepts:

```javascript
async function generateProtocols(validationResults) {
    console.log('📋 Generating experimental protocols...');
    
    const protocols = [];
    
    // Generate protocols for concepts with good viability scores
    const viableConcepts = validationResults.filter(v => v.viabilityScore > 0.7);
    
    for (const conceptResult of viableConcepts) {
        console.log(`Generating protocol for: ${conceptResult.concept.objective}`);
        
        const protocol = await client.concepts.generateProtocol(
            conceptResult.concept.id,
            {
                type: 'full',
                detailLevel: 'detailed',
                constraints: {
                    equipment_availability: 'standard_lab',
                    time_constraints: 'flexible',
                    safety_level: 'high'
                }
            }
        );
        
        console.log('Generated Protocol:');
        console.log(`- Title: ${protocol.title}`);
        console.log(`- Duration: ${protocol.estimated_duration}`);
        console.log(`- Steps: ${protocol.procedure.steps.length}`);
        console.log(`- Materials needed: ${protocol.materials.length}`);
        console.log(`- Equipment needed: ${protocol.equipment.length}`);
        
        // Save protocol details
        protocols.push({
            concept: conceptResult.concept,
            protocol,
            viabilityScore: conceptResult.viabilityScore
        });
        
        console.log();
    }
    
    return protocols;
}
```

### 7. Collaboration and Sharing

Prepare concepts for collaboration and sharing:

```javascript
async function shareResearch(protocols) {
    console.log('🤝 Preparing research for collaboration...');
    
    const collaborationPackages = [];
    
    for (const protocolResult of protocols) {
        // Create collaboration package
        const package = {
            concept: protocolResult.concept,
            protocol: protocolResult.protocol,
            viabilityScore: protocolResult.viabilityScore,
            
            // Generate collaboration materials
            summary: {
                title: protocolResult.concept.objective,
                abstract: `Research concept exploring ${protocolResult.concept.objective} with ${(protocolResult.viabilityScore * 100).toFixed(1)}% viability score.`,
                keywords: extractKeywords(protocolResult.concept),
                estimatedDuration: protocolResult.protocol.estimated_duration,
                requiredExpertise: protocolResult.protocol.required_expertise || ['materials-science']
            },
            
            // Collaboration metadata
            collaboration: {
                openToCollaboration: true,
                preferredPartners: ['materials-science', 'engineering', 'physics'],
                sharingLevel: 'open',
                intellectualProperty: 'shared'
            }
        };
        
        collaborationPackages.push(package);
        
        console.log(`✅ Collaboration package created for: ${package.summary.title}`);
        console.log(`   Keywords: ${package.summary.keywords.join(', ')}`);
        console.log(`   Required expertise: ${package.summary.requiredExpertise.join(', ')}`);
        console.log();
    }
    
    return collaborationPackages;
}

function extractKeywords(concept) {
    // Simple keyword extraction - in practice, use NLP
    const text = `${concept.objective} ${concept.description || ''}`;
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    
    return text.toLowerCase()
        .split(/\W+/)
        .filter(word => word.length > 3 && !commonWords.includes(word))
        .slice(0, 8);
}
```

### 8. Complete Workflow

Run the complete research workflow:

```javascript
async function runCompleteWorkflow() {
    console.log('🚀 Starting complete research workflow...\n');
    
    try {
        // Step 1: Process literature
        console.log('='.repeat(50));
        const documents = await processLiterature();
        
        // Step 2: Explore knowledge graph
        console.log('='.repeat(50));
        const explorationResults = await exploreKnowledgeGraph();
        
        // Step 3: Identify gaps
        console.log('='.repeat(50));
        const gapAnalysis = await identifyResearchGaps(explorationResults);
        
        // Step 4: Design concepts
        console.log('='.repeat(50));
        const concepts = await designResearchConcepts(gapAnalysis);
        
        // Step 5: Validate concepts
        console.log('='.repeat(50));
        const validationResults = await validateConcepts(concepts);
        
        // Step 6: Generate protocols
        console.log('='.repeat(50));
        const protocols = await generateProtocols(validationResults);
        
        // Step 7: Prepare for collaboration
        console.log('='.repeat(50));
        const collaborationPackages = await shareResearch(protocols);
        
        // Summary
        console.log('='.repeat(50));
        console.log('🎉 Research workflow completed successfully!');
        console.log();
        console.log('Workflow Summary:');
        console.log(`- Documents processed: ${documents.length}`);
        console.log(`- Research gaps identified: ${gapAnalysis.gaps.length}`);
        console.log(`- Concepts designed: ${concepts.length}`);
        console.log(`- Protocols generated: ${protocols.length}`);
        console.log(`- Collaboration packages: ${collaborationPackages.length}`);
        
        // Export results
        const results = {
            documents,
            explorationResults,
            gapAnalysis,
            concepts,
            validationResults,
            protocols,
            collaborationPackages,
            timestamp: new Date().toISOString()
        };
        
        // Save to file
        const fs = require('fs');
        fs.writeFileSync(
            `research_workflow_results_${Date.now()}.json`, 
            JSON.stringify(results, null, 2)
        );
        
        console.log('\n📁 Results saved to research_workflow_results_*.json');
        
        return results;
        
    } catch (error) {
        console.error('❌ Workflow failed:', error.message);
        console.log('\n🔧 Troubleshooting tips:');
        console.log('1. Ensure the Discovery Engine backend is running');
        console.log('2. Check your API configuration');
        console.log('3. Verify document file paths');
        console.log('4. Check network connectivity');
        throw error;
    }
}

export { runCompleteWorkflow };
```

## Expected Outputs

The workflow produces:

1. **Processed Documents** - Structured knowledge from literature
2. **Knowledge Graph Insights** - Understanding of research landscape  
3. **Research Gaps** - Identified opportunities for new research
4. **Research Concepts** - AI-designed research proposals
5. **Validation Reports** - Feasibility and consistency analysis
6. **Experimental Protocols** - Detailed procedures for implementation
7. **Collaboration Packages** - Materials ready for sharing and partnership

## Customization

### Domain-Specific Workflows

Adapt the workflow for specific research domains:

```javascript
// Materials Science Focus
const materialsConfig = {
    documentCategories: ['materials-science', 'nanotechnology'],
    focusAreas: ['smart-materials', 'composites', 'nanostructures'],
    validationTypes: ['materials-compatibility', 'mechanical-properties', 'thermal-properties']
};

// Biomedical Focus  
const biomedicalConfig = {
    documentCategories: ['biomedical', 'biotechnology'],
    focusAreas: ['biocompatibility', 'drug-delivery', 'tissue-engineering'],
    validationTypes: ['biocompatibility', 'cytotoxicity', 'regulatory-compliance']
};
```

### Custom Validation Rules

Add domain-specific validation:

```javascript
async function customValidation(concept, domain) {
    switch (domain) {
        case 'materials':
            return await validateMaterialsProperties(concept);
        case 'biomedical':
            return await validateBiocompatibility(concept);
        case 'energy':
            return await validateEnergyEfficiency(concept);
        default:
            return await client.concepts.validate(concept.id);
    }
}
```

## Integration with External Tools

### Literature Databases

```javascript
// PubMed integration example
async function searchPubMed(query) {
    const pubmedResults = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}&retmode=json`
    );
    // Process and import papers
}
```

### Laboratory Information Systems

```javascript
// LIMS integration example
async function exportToLIMS(protocol) {
    const limsFormat = {
        protocol_id: protocol.id,
        title: protocol.title,
        steps: protocol.procedure.steps.map(step => ({
            order: step.order,
            description: step.description,
            duration: step.duration,
            materials: step.materials
        }))
    };
    
    // Export to LIMS system
    return await limsAPI.createProtocol(limsFormat);
}
```

## Next Steps

1. **Run the example workflow** with your research domain
2. **Customize for your specific needs** using the configuration options
3. **Integrate with your existing tools** using the provided patterns
4. **Extend with custom agents** for specialized research tasks
5. **Share results** with your research team using collaboration packages

For more advanced workflows, see:
- `src/examples/custom-agents/` - Building custom AI agents
- `src/docs/workflows/` - Specialized workflow documentation
- `docs/api-reference.md` - Full API capabilities 