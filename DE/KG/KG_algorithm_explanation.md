# Knowledge Graph Algorithms

This document explains the implementation and usage of graph analysis algorithms in the Discovery Engine's knowledge graph.

## Core Algorithm Types

The knowledge graph supports several types of analysis algorithms:

1. Centrality Analysis (Betweenness Centrality)
2. Cluster Detection
3. Gap Detection
4. Vector Similarity Analysis

## Betweenness Centrality

### Implementation

```typescript
interface BetweennessResult {
  components: {
    id: string;
    nodes: string[];
    betweenness: Map<string, number>;
    size: number;
    isIsolated: boolean;
  }[];
  globalBetweenness: Map<string, number>;
  componentStats: {
    totalComponents: number;
    isolatedNodes: number;
    componentSizes: number[];
  };
}
```

### Usage Example

```typescript
// test-with-real-graph.ts
import { buildCNMGraph } from './src/utils/cnmBuilder';
import { BetweennessCentrality } from './src/algorithms/centrality/BetweennessCentrality';

async function testBetweenness() {
  // Load the actual knowledge graph
  const graphData = await buildCNMGraph();
  
  // Create algorithm instance
  const betweennessAlgo = new BetweennessCentrality();
  
  // Execute with parameters
  const result = await betweennessAlgo.execute(graphData, {
    normalize: true,
    directed: false
  });
  
  // Result contains:
  // - components: Array of graph components with their betweenness scores
  // - globalBetweenness: Map of node IDs to their global betweenness scores
  // - componentStats: Statistics about the graph components
}
```

### Key Features

1. **Component Analysis**
   - Identifies connected components in the graph
   - Calculates betweenness within each component
   - Handles isolated nodes

2. **Score Normalization**
   - Option to normalize scores for comparison
   - Considers graph size and component structure

3. **Directed/Undirected**
   - Supports both directed and undirected analysis
   - Respects edge directions when specified

## Cluster Detection

### Implementation

```typescript
interface ResearchCluster {
  id: string;
  nodes: string[];
  type: 'theoretical' | 'experimental' | 'methodological' | 'mixed';
  cohesion: number;
  description: string;
  keyNodes: {
    nodeId: string;
    role: 'central' | 'connector' | 'specialist';
    importance: number;
  }[];
  metadata: {
    size: number;
    density: number;
    citationCount: number;
    primaryTopics: string[];
  };
}
```

### Usage Example

```typescript
import { ResearchClusterDetector } from './src/algorithms/cluster/ResearchClusterDetector';

async function testClustering() {
  const graphData = await buildCNMGraph();
  
  const clusterAlgo = new ResearchClusterDetector();
  const result = await clusterAlgo.execute(graphData, {
    minClusterSize: 2,
    similarityThreshold: 0.5
  });
  
  // Result contains:
  // - Array of ResearchCluster objects
  // - Each cluster has metadata about its structure and content
}
```

### Key Features

1. **Multi-dimensional Clustering**
   - Uses node types and edge types
   - Considers node attributes (cssVector)
   - Incorporates citation relationships

2. **Cluster Characterization**
   - Identifies cluster types (theoretical/experimental/etc.)
   - Calculates cohesion scores
   - Identifies key nodes and their roles

3. **Metadata Analysis**
   - Tracks cluster size and density
   - Counts citations within clusters
   - Identifies primary topics

## Gap Detection

### Implementation

```typescript
interface ResearchGap {
  id: string;
  type: 'conceptual' | 'methodological' | 'experimental' | 'theoretical';
  sourceNodes: string[];
  targetNodes: string[];
  confidence: number;
  description: string;
  potentialConnections: {
    nodeId: string;
    type: string;
    relevance: number;
  }[];
}
```

### Usage Example

```typescript
import { ResearchGapDetector } from './src/algorithms/gap/ResearchGapDetector';

async function testGapDetection() {
  const graphData = await buildCNMGraph();
  
  const gapAlgo = new ResearchGapDetector();
  const result = await gapAlgo.execute(graphData, {
    minConfidence: 0.7,
    maxGapDistance: 3
  });
  
  // Result contains:
  // - Array of ResearchGap objects
  // - Each gap has metadata about potential connections
}
```

### Key Features

1. **Gap Identification**
   - Detects missing connections between nodes
   - Categorizes gaps by type
   - Calculates confidence scores

2. **Connection Analysis**
   - Identifies potential bridging nodes
   - Suggests connection types
   - Ranks relevance of potential connections

3. **Distance Metrics**
   - Uses graph distance to identify gaps
   - Considers node types and relationships
   - Respects edge directions and types

## Vector Similarity Analysis

### Implementation

```typescript
interface CSSVector {
  // Vector representation of node properties
  // Used for similarity calculations
}

interface SimilarityResult {
  nodeId: string;
  similarity: number;
  sharedProperties: string[];
}
```

### Usage Example

```typescript
import { VectorSimilarityAnalyzer } from './src/algorithms/vector/VectorSimilarityAnalyzer';

async function testVectorSimilarity() {
  const graphData = await buildCNMGraph();
  
  const vectorAlgo = new VectorSimilarityAnalyzer();
  const result = await vectorAlgo.execute(graphData, {
    targetNodeId: "some-node-id",
    minSimilarity: 0.5
  });
  
  // Result contains:
  // - Array of SimilarityResult objects
  // - Each result includes similarity score and shared properties
}
```

### Key Features

1. **Vector Operations**
   - Uses node cssVector properties
   - Calculates cosine similarity
   - Identifies shared properties

2. **Property Analysis**
   - Considers node types and attributes
   - Weights different properties
   - Handles missing values

## Testing Algorithms

To test these algorithms with the actual knowledge graph:

1. Create a test script:
```typescript
// test-algorithms.ts
import { buildCNMGraph } from './src/utils/cnmBuilder';
import { BetweennessCentrality } from './src/algorithms/centrality/BetweennessCentrality';
import { ResearchClusterDetector } from './src/algorithms/cluster/ResearchClusterDetector';
import { ResearchGapDetector } from './src/algorithms/gap/ResearchGapDetector';

async function testAllAlgorithms() {
  // Load the actual knowledge graph
  const graphData = await buildCNMGraph();
  
  // Test each algorithm
  const betweennessResult = await new BetweennessCentrality().execute(graphData, {
    normalize: true,
    directed: false
  });
  
  const clusterResult = await new ResearchClusterDetector().execute(graphData, {
    minClusterSize: 2,
    similarityThreshold: 0.5
  });
  
  const gapResult = await new ResearchGapDetector().execute(graphData, {
    minConfidence: 0.7,
    maxGapDistance: 3
  });
  
  // Log results
  console.log('Betweenness Results:', betweennessResult);
  console.log('Cluster Results:', clusterResult);
  console.log('Gap Results:', gapResult);
}

testAllAlgorithms().catch(console.error);
```

2. Run the test:
```bash
cd DE
npx ts-node test-algorithms.ts
```

## Algorithm Parameters

Each algorithm supports various parameters that can be tuned:

1. **Betweenness Centrality**
   - `normalize`: boolean - Whether to normalize scores
   - `directed`: boolean - Whether to consider edge directions

2. **Cluster Detection**
   - `minClusterSize`: number - Minimum nodes in a cluster
   - `similarityThreshold`: number - Minimum similarity score

3. **Gap Detection**
   - `minConfidence`: number - Minimum confidence score
   - `maxGapDistance`: number - Maximum graph distance

4. **Vector Similarity**
   - `minSimilarity`: number - Minimum similarity score
   - `maxResults`: number - Maximum results to return

## Result Interpretation

1. **Betweenness Centrality**
   - Higher scores indicate more important nodes
   - Component analysis shows graph structure
   - Isolated nodes are identified separately

2. **Cluster Detection**
   - Clusters show related research areas
   - Key nodes indicate important concepts
   - Metadata helps understand cluster significance

3. **Gap Detection**
   - Gaps indicate research opportunities
   - Confidence scores help prioritize
   - Potential connections suggest approaches

4. **Vector Similarity**
   - Similarity scores show related concepts
   - Shared properties explain relationships
   - Results can guide exploration
