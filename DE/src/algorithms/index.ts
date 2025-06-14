export * from './base/BaseAlgorithm';
export * from './AlgorithmRegistry';
export * from './centrality/BetweennessCentrality';
export * from './gap/ResearchGapDetector';
export * from './cluster/ResearchClusterDetector';

// Initialize registry with available algorithms
import { AlgorithmRegistry } from './AlgorithmRegistry';
import { BetweennessCentrality } from './centrality/BetweennessCentrality';
import { ResearchGapDetector } from './gap/ResearchGapDetector';
import { ResearchClusterDetector } from './cluster/ResearchClusterDetector';

const registry = AlgorithmRegistry.getInstance();
registry.register(new BetweennessCentrality());
registry.register(new ResearchGapDetector());
registry.register(new ResearchClusterDetector()); 