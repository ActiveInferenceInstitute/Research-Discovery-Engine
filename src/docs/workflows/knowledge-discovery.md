# Knowledge Discovery Workflows

This guide documents advanced workflows for knowledge discovery using the Research Discovery Engine. These workflows combine graph analysis, AI agents, and search capabilities to uncover new insights and research opportunities.

## Overview

Knowledge discovery workflows enable researchers to:

- **Identify Knowledge Gaps** - Find underexplored areas in research
- **Discover Hidden Connections** - Uncover non-obvious relationships between concepts
- **Generate Hypotheses** - Create testable research hypotheses
- **Find Cross-Domain Analogies** - Identify applicable concepts from other fields
- **Track Research Trends** - Monitor emerging areas and declining topics
- **Validate Assumptions** - Test existing knowledge against new data

## Core Discovery Patterns

### 1. Gap Discovery Workflow

Identify areas where knowledge is sparse or connections are missing.

```javascript
import DiscoveryEngineClient from '../../utils/de-client/index.js';
import { GraphUtils, GraphAnalyzer } from '../../utils/graph-utils/index.js';

class GapDiscoveryWorkflow {
    constructor(client) {
        this.client = client;
    }
    
    async discoverKnowledgeGaps(domain = 'materials-science') {
        console.log(`🔍 Discovering knowledge gaps in ${domain}...`);
        
        // 1. Get comprehensive domain graph
        const domainGraph = await this.client.graph.getGraph({
            categories: this.getDomainCategories(domain),
            limit: 1000,
            includeMetadata: true
        });
        
        const graph = new GraphUtils(domainGraph.nodes, domainGraph.links);
        
        // 2. Analyze graph structure for gaps
        const structuralGaps = this.findStructuralGaps(graph);
        
        // 3. Find semantic gaps using AI
        const semanticGaps = await this.findSemanticGaps(domain, domainGraph);
        
        // 4. Identify temporal gaps (declining research areas)
        const temporalGaps = await this.findTemporalGaps(domain);
        
        // 5. Cross-domain comparison gaps
        const crossDomainGaps = await this.findCrossDomainGaps(domain);
        
        return {
            structural: structuralGaps,
            semantic: semanticGaps,
            temporal: temporalGaps,
            crossDomain: crossDomainGaps,
            summary: this.summarizeGaps([
                ...structuralGaps,
                ...semanticGaps,
                ...temporalGaps,
                ...crossDomainGaps
            ])
        };
    }
    
    findStructuralGaps(graph) {
        const gaps = [];
        
        // Find isolated nodes (potential research islands)
        const centrality = graph.calculateCentrality();
        const isolatedNodes = Object.entries(centrality)
            .filter(([_, metrics]) => metrics.degree <= 1)
            .map(([nodeId, _]) => graph.getNode(nodeId));
        
        for (const node of isolatedNodes) {
            gaps.push({
                type: 'structural',
                subtype: 'isolated_concept',
                description: `${node.label} appears isolated with few connections`,
                nodeId: node.id,
                severity: 'medium',
                opportunity: 'Connect to related concepts or investigate integration challenges'
            });
        }
        
        // Find bridge gaps (missing connections between clusters)
        const components = graph.findConnectedComponents();
        if (components.length > 1) {
            for (let i = 0; i < components.length; i++) {
                for (let j = i + 1; j < components.length; j++) {
                    const comp1 = components[i];
                    const comp2 = components[j];
                    
                    gaps.push({
                        type: 'structural',
                        subtype: 'missing_bridge',
                        description: `No connections between ${comp1[0].category} and ${comp2[0].category} clusters`,
                        clusters: [
                            comp1.map(n => n.id),
                            comp2.map(n => n.id)
                        ],
                        severity: 'high',
                        opportunity: 'Investigate potential interdisciplinary connections'
                    });
                }
            }
        }
        
        // Find hub dependency gaps (over-reliance on single nodes)
        const averageDegree = graph.getStatistics().averageDegree;
        const hubs = Object.entries(centrality)
            .filter(([_, metrics]) => metrics.degree > averageDegree * 3)
            .map(([nodeId, _]) => graph.getNode(nodeId));
        
        for (const hub of hubs) {
            gaps.push({
                type: 'structural',
                subtype: 'hub_dependency',
                description: `${hub.label} is a critical hub with ${centrality[hub.id].degree} connections`,
                nodeId: hub.id,
                severity: 'medium',
                opportunity: 'Develop alternative pathways to reduce dependency'
            });
        }
        
        return gaps;
    }
    
    async findSemanticGaps(domain, graphData) {
        // Use AI agent to identify semantic gaps
        const gapAnalysis = await this.client.agents.triggerAction(
            'exploration-agent',
            'analyze_semantic_gaps',
            {
                domain,
                graph_summary: {
                    node_count: graphData.nodes.length,
                    categories: [...new Set(graphData.nodes.map(n => n.category))],
                    top_concepts: graphData.nodes
                        .sort((a, b) => (b.connections || 0) - (a.connections || 0))
                        .slice(0, 20)
                        .map(n => ({ id: n.id, label: n.label, category: n.category }))
                },
                analysis_depth: 'comprehensive'
            }
        );
        
        return gapAnalysis.results.semantic_gaps.map(gap => ({
            type: 'semantic',
            subtype: gap.gap_type,
            description: gap.description,
            concepts: gap.related_concepts,
            severity: gap.severity,
            opportunity: gap.research_opportunity,
            confidence: gap.confidence_score
        }));
    }
    
    async findTemporalGaps(domain) {
        // Analyze publication trends to find declining areas
        const trends = await this.client.graph.getAnalytics({
            metrics: ['temporal_trends'],
            domain,
            time_period: '5_years'
        });
        
        const decliningAreas = trends.temporal_analysis.declining_topics.map(topic => ({
            type: 'temporal',
            subtype: 'declining_research',
            description: `Research in ${topic.topic} has declined ${topic.decline_percentage}% over 5 years`,
            topic: topic.topic,
            severity: topic.decline_percentage > 50 ? 'high' : 'medium',
            opportunity: 'Revitalize with new approaches or technology',
            trend_data: topic.trend_data
        }));
        
        const emergingGaps = trends.temporal_analysis.rapid_growth_areas
            .filter(area => area.connection_density < 0.3) // High growth but low connections
            .map(area => ({
                type: 'temporal',
                subtype: 'emerging_isolation',
                description: `${area.topic} is growing rapidly but lacks connections to established knowledge`,
                topic: area.topic,
                severity: 'medium',
                opportunity: 'Bridge emerging area with established knowledge',
                growth_data: area.growth_data
            }));
        
        return [...decliningAreas, ...emergingGaps];
    }
    
    async findCrossDomainGaps(sourceDomain) {
        const analogySearch = await this.client.agents.triggerAction(
            'exploration-agent',
            'find_cross_domain_opportunities',
            {
                source_domain: sourceDomain,
                target_domains: ['biology', 'physics', 'chemistry', 'engineering', 'computer-science'],
                analysis_type: 'gap_identification'
            }
        );
        
        return analogySearch.results.cross_domain_gaps.map(gap => ({
            type: 'cross_domain',
            subtype: 'missing_analogy',
            description: `${gap.source_concept} could benefit from approaches used in ${gap.target_domain}`,
            source_concept: gap.source_concept,
            target_domain: gap.target_domain,
            analogy: gap.potential_analogy,
            severity: gap.potential_impact === 'high' ? 'high' : 'medium',
            opportunity: gap.research_direction,
            similarity_score: gap.similarity_score
        }));
    }
    
    getDomainCategories(domain) {
        const domainMapping = {
            'materials-science': ['materials', 'methods', 'properties', 'applications'],
            'biology': ['biological-systems', 'methods', 'organisms', 'applications'],
            'chemistry': ['compounds', 'reactions', 'methods', 'applications'],
            'physics': ['phenomena', 'methods', 'systems', 'applications']
        };
        
        return domainMapping[domain] || ['materials', 'methods', 'applications'];
    }
    
    summarizeGaps(allGaps) {
        const bySeverity = allGaps.reduce((acc, gap) => {
            acc[gap.severity] = (acc[gap.severity] || 0) + 1;
            return acc;
        }, {});
        
        const byType = allGaps.reduce((acc, gap) => {
            acc[gap.type] = (acc[gap.type] || 0) + 1;
            return acc;
        }, {});
        
        const topOpportunities = allGaps
            .filter(gap => gap.severity === 'high')
            .sort((a, b) => (b.confidence || 0.5) - (a.confidence || 0.5))
            .slice(0, 5);
        
        return {
            total_gaps: allGaps.length,
            by_severity: bySeverity,
            by_type: byType,
            top_opportunities: topOpportunities,
            recommendations: this.generateRecommendations(topOpportunities)
        };
    }
    
    generateRecommendations(topOpportunities) {
        return topOpportunities.map(opportunity => ({
            gap: opportunity.description,
            action: opportunity.opportunity,
            priority: opportunity.severity,
            approach: this.suggestApproach(opportunity)
        }));
    }
    
    suggestApproach(opportunity) {
        switch (opportunity.subtype) {
            case 'isolated_concept':
                return 'Literature review and expert consultation to find integration points';
            case 'missing_bridge':
                return 'Interdisciplinary workshop or collaboration initiative';
            case 'declining_research':
                return 'Technology review and modernization study';
            case 'missing_analogy':
                return 'Cross-domain research project or knowledge transfer study';
            default:
                return 'Focused research investigation';
        }
    }
}
```

### 2. Hidden Connection Discovery

Find non-obvious relationships between concepts using graph algorithms and AI.

```javascript
class HiddenConnectionWorkflow {
    constructor(client) {
        this.client = client;
    }
    
    async discoverHiddenConnections(concepts, maxDistance = 3) {
        console.log('🔗 Discovering hidden connections...');
        
        // 1. Find all indirect paths between concepts
        const indirectPaths = await this.findIndirectPaths(concepts, maxDistance);
        
        // 2. Analyze connection strength patterns
        const connectionPatterns = await this.analyzeConnectionPatterns(concepts);
        
        // 3. Find semantic similarities not reflected in structure
        const semanticConnections = await this.findSemanticConnections(concepts);
        
        // 4. Identify temporal correlations
        const temporalConnections = await this.findTemporalConnections(concepts);
        
        // 5. Cross-reference with external knowledge sources
        const externalConnections = await this.findExternalConnections(concepts);
        
        return {
            indirect_paths: indirectPaths,
            connection_patterns: connectionPatterns,
            semantic_connections: semanticConnections,
            temporal_connections: temporalConnections,
            external_connections: externalConnections,
            recommendations: this.generateConnectionRecommendations([
                ...indirectPaths,
                ...semanticConnections,
                ...temporalConnections
            ])
        };
    }
    
    async findIndirectPaths(concepts, maxDistance) {
        const graph = await this.client.graph.getGraph({ limit: 5000 });
        const graphUtils = new GraphUtils(graph.nodes, graph.links);
        
        const hiddenConnections = [];
        
        for (let i = 0; i < concepts.length; i++) {
            for (let j = i + 1; j < concepts.length; j++) {
                const concept1 = concepts[i];
                const concept2 = concepts[j];
                
                // Check if directly connected
                const directConnection = graph.links.find(link =>
                    (link.source === concept1 && link.target === concept2) ||
                    (link.source === concept2 && link.target === concept1)
                );
                
                if (!directConnection) {
                    // Find indirect paths
                    const paths = graphUtils.findAllPaths(concept1, concept2, maxDistance);
                    
                    if (paths.length > 0) {
                        // Analyze path quality
                        const pathAnalysis = await this.analyzePaths(paths, graphUtils);
                        
                        hiddenConnections.push({
                            concept1,
                            concept2,
                            paths: pathAnalysis.paths,
                            strength: pathAnalysis.averageStrength,
                            confidence: pathAnalysis.confidence,
                            discovery_type: 'indirect_path'
                        });
                    }
                }
            }
        }
        
        return hiddenConnections.sort((a, b) => b.strength - a.strength);
    }
    
    async analyzePaths(paths, graphUtils) {
        const pathAnalysis = [];
        
        for (const path of paths) {
            let pathStrength = 1.0;
            const pathDetails = [];
            
            for (let i = 0; i < path.length - 1; i++) {
                const sourceId = path[i];
                const targetId = path[i + 1];
                
                // Find the link
                const link = graphUtils.links.find(l =>
                    (l.source === sourceId && l.target === targetId) ||
                    (l.source === targetId && l.target === sourceId)
                );
                
                if (link) {
                    pathStrength *= (link.weight || 0.5);
                    pathDetails.push({
                        from: graphUtils.getNode(sourceId).label,
                        to: graphUtils.getNode(targetId).label,
                        relationship: link.type,
                        strength: link.weight || 0.5
                    });
                }
            }
            
            pathAnalysis.push({
                path: path.map(id => graphUtils.getNode(id).label),
                details: pathDetails,
                strength: pathStrength,
                length: path.length
            });
        }
        
        const averageStrength = pathAnalysis.reduce((sum, p) => sum + p.strength, 0) / pathAnalysis.length;
        const confidence = Math.min(1.0, pathAnalysis.length * 0.2); // More paths = higher confidence
        
        return {
            paths: pathAnalysis,
            averageStrength,
            confidence
        };
    }
    
    async findSemanticConnections(concepts) {
        // Use AI to find semantic similarities
        const semanticAnalysis = await this.client.agents.triggerAction(
            'exploration-agent',
            'find_semantic_connections',
            {
                concepts: concepts,
                similarity_threshold: 0.6,
                analysis_depth: 'deep'
            }
        );
        
        return semanticAnalysis.results.semantic_connections.map(connection => ({
            concept1: connection.concept1,
            concept2: connection.concept2,
            similarity_score: connection.similarity_score,
            similarity_aspects: connection.similarity_aspects,
            discovery_type: 'semantic_similarity',
            evidence: connection.evidence
        }));
    }
    
    async findTemporalConnections(concepts) {
        // Analyze co-occurrence in literature over time
        const temporalAnalysis = await this.client.graph.getAnalytics({
            metrics: ['temporal_correlation'],
            concepts: concepts,
            time_window: '10_years'
        });
        
        return temporalAnalysis.temporal_correlations
            .filter(corr => corr.correlation_strength > 0.7)
            .map(corr => ({
                concept1: corr.concept1,
                concept2: corr.concept2,
                correlation_strength: corr.correlation_strength,
                temporal_pattern: corr.pattern_type,
                discovery_type: 'temporal_correlation',
                time_periods: corr.time_periods
            }));
    }
    
    async findExternalConnections(concepts) {
        // Check external knowledge sources for connections
        const externalSources = [
            'wikipedia',
            'wikidata',
            'scientific_databases'
        ];
        
        const connections = [];
        
        for (const source of externalSources) {
            const sourceConnections = await this.queryExternalSource(source, concepts);
            connections.push(...sourceConnections);
        }
        
        return connections;
    }
    
    async queryExternalSource(source, concepts) {
        // Simplified external source querying
        // In practice, this would use APIs like Wikipedia, Wikidata, etc.
        
        const mockConnections = concepts.slice(0, 2).map((concept, index) => ({
            concept1: concept,
            concept2: concepts[(index + 1) % concepts.length],
            source: source,
            evidence: `External reference found in ${source}`,
            confidence: 0.8,
            discovery_type: 'external_reference'
        }));
        
        return mockConnections;
    }
    
    generateConnectionRecommendations(allConnections) {
        const recommendations = [];
        
        // High-strength connections
        const strongConnections = allConnections
            .filter(conn => (conn.strength || conn.similarity_score || conn.correlation_strength) > 0.7)
            .slice(0, 5);
        
        for (const connection of strongConnections) {
            recommendations.push({
                type: 'investigate_connection',
                description: `Strong hidden connection found between ${connection.concept1} and ${connection.concept2}`,
                action: 'Conduct literature review to validate connection',
                priority: 'high',
                evidence: connection.evidence || connection.paths || 'Statistical correlation'
            });
        }
        
        // Novel discovery patterns
        const novelConnections = allConnections
            .filter(conn => conn.discovery_type === 'semantic_similarity')
            .slice(0, 3);
        
        for (const connection of novelConnections) {
            recommendations.push({
                type: 'novel_hypothesis',
                description: `Semantic analysis suggests unexplored relationship between ${connection.concept1} and ${connection.concept2}`,
                action: 'Design experiments to test relationship',
                priority: 'medium',
                evidence: connection.similarity_aspects
            });
        }
        
        return recommendations;
    }
}
```

### 3. Hypothesis Generation Workflow

Generate testable research hypotheses based on knowledge graph analysis.

```javascript
class HypothesisGenerationWorkflow {
    constructor(client) {
        this.client = client;
    }
    
    async generateHypotheses(researchArea, parameters = {}) {
        console.log(`💡 Generating hypotheses for ${researchArea}...`);
        
        const {
            noveltyThreshold = 0.7,
            feasibilityThreshold = 0.6,
            maxHypotheses = 10
        } = parameters;
        
        // 1. Analyze current knowledge state
        const knowledgeState = await this.analyzeKnowledgeState(researchArea);
        
        // 2. Generate hypotheses using different strategies
        const gapBasedHypotheses = await this.generateGapBasedHypotheses(knowledgeState);
        const analogyBasedHypotheses = await this.generateAnalogyBasedHypotheses(knowledgeState);
        const combinationHypotheses = await this.generateCombinationHypotheses(knowledgeState);
        const contradictionHypotheses = await this.generateContradictionHypotheses(knowledgeState);
        
        // 3. Evaluate and rank hypotheses
        const allHypotheses = [
            ...gapBasedHypotheses,
            ...analogyBasedHypotheses,
            ...combinationHypotheses,
            ...contradictionHypotheses
        ];
        
        const evaluatedHypotheses = await this.evaluateHypotheses(allHypotheses);
        
        // 4. Filter and select top hypotheses
        const selectedHypotheses = evaluatedHypotheses
            .filter(h => h.novelty >= noveltyThreshold && h.feasibility >= feasibilityThreshold)
            .sort((a, b) => (b.novelty * b.feasibility) - (a.novelty * a.feasibility))
            .slice(0, maxHypotheses);
        
        return {
            research_area: researchArea,
            knowledge_state: knowledgeState.summary,
            generated_hypotheses: selectedHypotheses,
            generation_strategies: {
                gap_based: gapBasedHypotheses.length,
                analogy_based: analogyBasedHypotheses.length,
                combination: combinationHypotheses.length,
                contradiction: contradictionHypotheses.length
            },
            recommendations: this.generateResearchRecommendations(selectedHypotheses)
        };
    }
    
    async analyzeKnowledgeState(researchArea) {
        const graphData = await this.client.graph.getGraph({
            categories: [researchArea],
            limit: 1000,
            includeMetadata: true
        });
        
        const graph = new GraphUtils(graphData.nodes, graphData.links);
        const stats = graph.getStatistics();
        const centrality = graph.calculateCentrality();
        const components = graph.findConnectedComponents();
        
        // Identify knowledge maturity indicators
        const maturityIndicators = {
            density: stats.density,
            connectivity: components.length === 1 ? 'high' : 'fragmented',
            coverage: this.assessCoverage(graphData.nodes),
            recency: await this.assessRecency(researchArea),
            consensus: await this.assessConsensus(researchArea)
        };
        
        return {
            graph: graphData,
            statistics: stats,
            centrality,
            components,
            maturity: maturityIndicators,
            summary: this.summarizeKnowledgeState(maturityIndicators, stats)
        };
    }
    
    async generateGapBasedHypotheses(knowledgeState) {
        const hypotheses = [];
        
        // Find structural gaps and generate hypotheses to fill them
        const isolatedNodes = Object.entries(knowledgeState.centrality)
            .filter(([_, metrics]) => metrics.degree <= 1)
            .map(([nodeId, _]) => knowledgeState.graph.nodes.find(n => n.id === nodeId));
        
        for (const node of isolatedNodes) {
            const hypothesis = await this.client.agents.triggerAction(
                'hypothesis-agent',
                'generate_connection_hypothesis',
                {
                    isolated_concept: node,
                    domain_context: knowledgeState.summary,
                    generation_strategy: 'gap_filling'
                }
            );
            
            if (hypothesis.results.hypothesis) {
                hypotheses.push({
                    type: 'gap_based',
                    subtype: 'connection_hypothesis',
                    statement: hypothesis.results.hypothesis.statement,
                    rationale: hypothesis.results.hypothesis.rationale,
                    testability: hypothesis.results.hypothesis.testability,
                    source_concept: node.id,
                    predicted_connections: hypothesis.results.hypothesis.predicted_connections
                });
            }
        }
        
        // Generate hypotheses for missing bridges between components
        if (knowledgeState.components.length > 1) {
            for (let i = 0; i < knowledgeState.components.length - 1; i++) {
                const comp1 = knowledgeState.components[i];
                const comp2 = knowledgeState.components[i + 1];
                
                const bridgeHypothesis = await this.client.agents.triggerAction(
                    'hypothesis-agent',
                    'generate_bridge_hypothesis',
                    {
                        component1: comp1.slice(0, 3), // Top 3 nodes from each component
                        component2: comp2.slice(0, 3),
                        generation_strategy: 'bridge_building'
                    }
                );
                
                if (bridgeHypothesis.results.hypothesis) {
                    hypotheses.push({
                        type: 'gap_based',
                        subtype: 'bridge_hypothesis',
                        statement: bridgeHypothesis.results.hypothesis.statement,
                        rationale: bridgeHypothesis.results.hypothesis.rationale,
                        testability: bridgeHypothesis.results.hypothesis.testability,
                        connects_components: [i, i + 1]
                    });
                }
            }
        }
        
        return hypotheses;
    }
    
    async generateAnalogyBasedHypotheses(knowledgeState) {
        const analogyAnalysis = await this.client.agents.triggerAction(
            'exploration-agent',
            'find_cross_domain_analogies',
            {
                source_domain: knowledgeState.summary.primary_domain,
                target_domains: ['biology', 'physics', 'chemistry', 'engineering'],
                concepts: knowledgeState.graph.nodes.slice(0, 10).map(n => n.id),
                analogy_depth: 'deep'
            }
        );
        
        const hypotheses = [];
        
        for (const analogy of analogyAnalysis.results.analogies) {
            const hypothesis = await this.client.agents.triggerAction(
                'hypothesis-agent',
                'generate_analogy_hypothesis',
                {
                    analogy: analogy,
                    target_domain: knowledgeState.summary.primary_domain,
                    generation_strategy: 'cross_domain_transfer'
                }
            );
            
            if (hypothesis.results.hypothesis) {
                hypotheses.push({
                    type: 'analogy_based',
                    subtype: 'cross_domain_transfer',
                    statement: hypothesis.results.hypothesis.statement,
                    rationale: hypothesis.results.hypothesis.rationale,
                    testability: hypothesis.results.hypothesis.testability,
                    source_analogy: analogy,
                    transfer_mechanism: hypothesis.results.hypothesis.transfer_mechanism
                });
            }
        }
        
        return hypotheses;
    }
    
    async generateCombinationHypotheses(knowledgeState) {
        const hypotheses = [];
        const nodes = knowledgeState.graph.nodes;
        
        // Generate hypotheses about novel combinations
        for (let i = 0; i < Math.min(nodes.length, 10); i++) {
            for (let j = i + 1; j < Math.min(nodes.length, 10); j++) {
                const node1 = nodes[i];
                const node2 = nodes[j];
                
                // Check if they're already connected
                const existingConnection = knowledgeState.graph.links.find(link =>
                    (link.source === node1.id && link.target === node2.id) ||
                    (link.source === node2.id && link.target === node1.id)
                );
                
                if (!existingConnection) {
                    const combinationHypothesis = await this.client.agents.triggerAction(
                        'hypothesis-agent',
                        'generate_combination_hypothesis',
                        {
                            concept1: node1,
                            concept2: node2,
                            generation_strategy: 'novel_combination'
                        }
                    );
                    
                    if (combinationHypothesis.results.hypothesis) {
                        hypotheses.push({
                            type: 'combination',
                            subtype: 'novel_synthesis',
                            statement: combinationHypothesis.results.hypothesis.statement,
                            rationale: combinationHypothesis.results.hypothesis.rationale,
                            testability: combinationHypothesis.results.hypothesis.testability,
                            combining_concepts: [node1.id, node2.id],
                            predicted_properties: combinationHypothesis.results.hypothesis.predicted_properties
                        });
                    }
                }
            }
        }
        
        return hypotheses.slice(0, 5); // Limit to avoid too many combinations
    }
    
    async generateContradictionHypotheses(knowledgeState) {
        // Find potential contradictions or alternative explanations
        const contradictionAnalysis = await this.client.agents.triggerAction(
            'consistency-agent',
            'find_potential_contradictions',
            {
                domain_knowledge: knowledgeState.summary,
                analysis_depth: 'comprehensive'
            }
        );
        
        const hypotheses = [];
        
        for (const contradiction of contradictionAnalysis.results.potential_contradictions) {
            const hypothesis = await this.client.agents.triggerAction(
                'hypothesis-agent',
                'generate_alternative_hypothesis',
                {
                    contradiction: contradiction,
                    generation_strategy: 'alternative_explanation'
                }
            );
            
            if (hypothesis.results.hypothesis) {
                hypotheses.push({
                    type: 'contradiction',
                    subtype: 'alternative_explanation',
                    statement: hypothesis.results.hypothesis.statement,
                    rationale: hypothesis.results.hypothesis.rationale,
                    testability: hypothesis.results.hypothesis.testability,
                    challenges: contradiction.existing_belief,
                    distinguishing_predictions: hypothesis.results.hypothesis.distinguishing_predictions
                });
            }
        }
        
        return hypotheses;
    }
    
    async evaluateHypotheses(hypotheses) {
        const evaluatedHypotheses = [];
        
        for (const hypothesis of hypotheses) {
            const evaluation = await this.client.agents.triggerAction(
                'evaluation-agent',
                'evaluate_hypothesis',
                {
                    hypothesis: hypothesis,
                    evaluation_criteria: ['novelty', 'feasibility', 'impact', 'testability']
                }
            );
            
            evaluatedHypotheses.push({
                ...hypothesis,
                novelty: evaluation.results.scores.novelty,
                feasibility: evaluation.results.scores.feasibility,
                impact: evaluation.results.scores.impact,
                testability: evaluation.results.scores.testability,
                overall_score: evaluation.results.overall_score,
                evaluation_notes: evaluation.results.notes
            });
        }
        
        return evaluatedHypotheses;
    }
    
    assessCoverage(nodes) {
        // Assess how well the domain is covered
        const categories = [...new Set(nodes.map(n => n.category))];
        const expectedCategories = ['materials', 'methods', 'applications', 'properties'];
        const coverage = categories.filter(c => expectedCategories.includes(c)).length / expectedCategories.length;
        
        return {
            score: coverage,
            level: coverage > 0.8 ? 'comprehensive' : coverage > 0.5 ? 'moderate' : 'limited',
            missing_areas: expectedCategories.filter(c => !categories.includes(c))
        };
    }
    
    async assessRecency(researchArea) {
        const recentActivity = await this.client.graph.getAnalytics({
            metrics: ['temporal_activity'],
            domain: researchArea,
            time_period: '2_years'
        });
        
        return {
            activity_level: recentActivity.activity_level,
            growth_rate: recentActivity.growth_rate,
            trend: recentActivity.trend
        };
    }
    
    async assessConsensus(researchArea) {
        // Mock consensus assessment - in practice, analyze literature agreement
        return {
            level: 'moderate',
            controversial_topics: [],
            agreement_score: 0.75
        };
    }
    
    summarizeKnowledgeState(maturityIndicators, stats) {
        let maturityLevel = 'emerging';
        
        if (maturityIndicators.density > 0.3 && maturityIndicators.connectivity === 'high') {
            maturityLevel = 'mature';
        } else if (maturityIndicators.density > 0.1) {
            maturityLevel = 'developing';
        }
        
        return {
            maturity_level: maturityLevel,
            primary_domain: 'materials-science', // Would be detected from data
            key_characteristics: {
                density: maturityIndicators.density,
                connectivity: maturityIndicators.connectivity,
                coverage: maturityIndicators.coverage.level
            },
            research_opportunities: this.identifyOpportunities(maturityIndicators, stats)
        };
    }
    
    identifyOpportunities(maturityIndicators, stats) {
        const opportunities = [];
        
        if (maturityIndicators.density < 0.2) {
            opportunities.push('Increase connections between existing concepts');
        }
        
        if (maturityIndicators.coverage.score < 0.7) {
            opportunities.push(`Explore missing areas: ${maturityIndicators.coverage.missing_areas.join(', ')}`);
        }
        
        if (maturityIndicators.connectivity === 'fragmented') {
            opportunities.push('Bridge isolated knowledge clusters');
        }
        
        return opportunities;
    }
    
    generateResearchRecommendations(hypotheses) {
        return hypotheses.slice(0, 3).map(hypothesis => ({
            hypothesis: hypothesis.statement,
            priority: hypothesis.overall_score > 0.8 ? 'high' : hypothesis.overall_score > 0.6 ? 'medium' : 'low',
            research_approach: this.suggestResearchApproach(hypothesis),
            required_resources: this.estimateResources(hypothesis),
            timeline: this.estimateTimeline(hypothesis),
            collaboration_needs: this.identifyCollaborationNeeds(hypothesis)
        }));
    }
    
    suggestResearchApproach(hypothesis) {
        switch (hypothesis.type) {
            case 'gap_based':
                return 'Literature review followed by experimental validation';
            case 'analogy_based':
                return 'Cross-domain collaboration and proof-of-concept studies';
            case 'combination':
                return 'Systematic synthesis and characterization studies';
            case 'contradiction':
                return 'Comparative experimental design to test alternatives';
            default:
                return 'Mixed-method research approach';
        }
    }
    
    estimateResources(hypothesis) {
        const baseResources = ['Literature access', 'Research personnel'];
        
        if (hypothesis.testability > 0.7) {
            baseResources.push('Laboratory access', 'Equipment', 'Materials');
        }
        
        if (hypothesis.type === 'analogy_based') {
            baseResources.push('Cross-domain expertise', 'Collaboration tools');
        }
        
        return baseResources;
    }
    
    estimateTimeline(hypothesis) {
        if (hypothesis.feasibility > 0.8) return '6-12 months';
        if (hypothesis.feasibility > 0.6) return '1-2 years';
        return '2-3 years';
    }
    
    identifyCollaborationNeeds(hypothesis) {
        const needs = [];
        
        if (hypothesis.type === 'analogy_based') {
            needs.push(`Experts in ${hypothesis.source_analogy.source_domain}`);
        }
        
        if (hypothesis.testability > 0.8) {
            needs.push('Experimental specialists');
        }
        
        if (hypothesis.impact > 0.8) {
            needs.push('Industry partners for application development');
        }
        
        return needs;
    }
}
```

## Integration Examples

### Running Discovery Workflows

```javascript
// Complete knowledge discovery pipeline
async function runDiscoveryPipeline(domain) {
    const client = new DiscoveryEngineClient();
    
    // 1. Discover knowledge gaps
    const gapWorkflow = new GapDiscoveryWorkflow(client);
    const gaps = await gapWorkflow.discoverKnowledgeGaps(domain);
    
    // 2. Find hidden connections
    const connectionWorkflow = new HiddenConnectionWorkflow(client);
    const connections = await connectionWorkflow.discoverHiddenConnections(
        gaps.summary.top_opportunities.map(opp => opp.nodeId).filter(Boolean)
    );
    
    // 3. Generate hypotheses
    const hypothesisWorkflow = new HypothesisGenerationWorkflow(client);
    const hypotheses = await hypothesisWorkflow.generateHypotheses(domain);
    
    return {
        gaps,
        connections,
        hypotheses,
        insights: generateInsights(gaps, connections, hypotheses)
    };
}

function generateInsights(gaps, connections, hypotheses) {
    return {
        research_priorities: combineFindings(gaps, hypotheses),
        collaboration_opportunities: identifyCollaborations(connections),
        innovation_potential: assessInnovationPotential(hypotheses),
        next_steps: recommendNextSteps(gaps, connections, hypotheses)
    };
}
```

## Best Practices

1. **Iterative Discovery** - Run workflows regularly to capture evolving knowledge
2. **Multi-Domain Analysis** - Compare findings across different research areas
3. **Validation** - Test discovered connections and hypotheses with domain experts
4. **Documentation** - Maintain records of discovery processes and outcomes
5. **Collaboration** - Share findings with research community for validation and extension

For implementation details and additional workflows, see:
- `src/examples/research-workflow/` - Complete workflow implementations
- `src/utils/graph-utils/` - Graph analysis utilities
- `docs/api-reference.md` - API documentation for discovery endpoints 