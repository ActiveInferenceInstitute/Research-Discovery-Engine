import { BetweennessCentrality } from './algorithms/centrality/BetweennessCentrality';
import { buildCNMGraph } from './utils/cnmBuilder';

// Run the test
async function testBetweenness() {
    try {
        console.log("Loading knowledge graph...");
        const graphData = await buildCNMGraph();
        console.log(`Loaded graph with ${graphData.nodes.length} nodes and ${graphData.links.length} links`);

        console.log("\nRunning betweenness centrality...");
        const betweennessAlgo = new BetweennessCentrality();
        const result = await betweennessAlgo.execute(graphData, {
            normalize: true,
            directed: false
        });

        // Show top 10 nodes by betweenness
        const topNodes = result.data
            .sort((a, b) => b.betweenness - a.betweenness)
            .slice(0, 10)
            .map(item => ({
                nodeId: item.nodeId,
                betweenness: item.betweenness.toFixed(4)
            }));

        console.log("\nTop 10 Nodes by Betweenness:");
        console.table(topNodes);

    } catch (error) {
        console.error("Error:", error);
    }
}

// Export the function so Vite can run it
export { testBetweenness }; 