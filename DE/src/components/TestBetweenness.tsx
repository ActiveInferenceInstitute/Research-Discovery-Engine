import React, { useEffect, useState } from 'react';
import { BetweennessCentrality } from '../algorithms/centrality/BetweennessCentrality';
import { buildCNMGraph } from '../utils/cnmBuilder';

export function TestBetweenness() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function runTest() {
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

                // Get top 10 nodes by betweenness
                const topNodes = result.data
                    .sort((a, b) => b.betweenness - a.betweenness)
                    .slice(0, 10)
                    .map(item => ({
                        nodeId: item.nodeId,
                        betweenness: item.betweenness.toFixed(4)
                    }));

                setResults(topNodes);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }

        runTest();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Top 10 Nodes by Betweenness</h2>
            <table>
                <thead>
                    <tr>
                        <th>Node ID</th>
                        <th>Betweenness</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((node, i) => (
                        <tr key={i}>
                            <td>{node.nodeId}</td>
                            <td>{node.betweenness}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Run the test immediately
(async () => {
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
})(); 