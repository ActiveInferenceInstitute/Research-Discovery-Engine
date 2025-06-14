const { buildCNMGraph } = require('./src/utils/cnmBuilder');
const { BetweennessCentrality } = require('./src/algorithms/centrality/BetweennessCentrality');
const { GraphData } = require('./src/types');

async function testBetweennessCentrality() {
  try {
    console.log("Loading knowledge graph...");
    const graphData = await buildCNMGraph();
    console.log(`Loaded graph with ${graphData.nodes.length} nodes and ${graphData.links.length} links`);

    // Create algorithm instance
    const betweennessAlgo = new BetweennessCentrality();
    
    // Test with different parameter combinations
    console.log("\nTesting Betweenness Centrality with different parameters...");
    
    // Test 1: Normalized, Undirected
    console.log("\nTest 1: Normalized, Undirected");
    const result1 = await betweennessAlgo.execute(graphData, {
      normalize: true,
      directed: false
    });
    
    // Test 2: Unnormalized, Undirected
    console.log("\nTest 2: Unnormalized, Undirected");
    const result2 = await betweennessAlgo.execute(graphData, {
      normalize: false,
      directed: false
    });
    
    // Test 3: Normalized, Directed
    console.log("\nTest 3: Normalized, Directed");
    const result3 = await betweennessAlgo.execute(graphData, {
      normalize: true,
      directed: true
    });

    // Analyze and display results
    console.log("\nResults Analysis:");
    
    // Get top 10 nodes by betweenness for each test
    const getTopNodes = (result: any, n: number = 10) => {
      return result.data
        .sort((a: any, b: any) => b.betweenness - a.betweenness)
        .slice(0, n)
        .map((item: any) => ({
          nodeId: item.nodeId,
          betweenness: item.betweenness.toFixed(4),
          componentId: item.componentId
        }));
    };

    console.log("\nTop 10 Nodes (Normalized, Undirected):");
    console.table(getTopNodes(result1));

    console.log("\nTop 10 Nodes (Unnormalized, Undirected):");
    console.table(getTopNodes(result2));

    console.log("\nTop 10 Nodes (Normalized, Directed):");
    console.table(getTopNodes(result3));

    // Component Analysis
    console.log("\nComponent Statistics:");
    console.log("Test 1 (Normalized, Undirected):");
    console.table(result1.metadata.componentStats);
    
    console.log("\nTest 2 (Unnormalized, Undirected):");
    console.table(result2.metadata.componentStats);
    
    console.log("\nTest 3 (Normalized, Directed):");
    console.table(result3.metadata.componentStats);

    // Performance Metrics
    console.log("\nPerformance Metrics:");
    const metrics = [
      { test: "Normalized, Undirected", time: result1.metadata.executionTime },
      { test: "Unnormalized, Undirected", time: result2.metadata.executionTime },
      { test: "Normalized, Directed", time: result3.metadata.executionTime }
    ];
    console.table(metrics);

  } catch (error) {
    console.error("Error testing Betweenness Centrality:", error);
  }
}

// Run the test
testBetweennessCentrality().catch(console.error); 