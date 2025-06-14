# Betweenness Centrality Test Implementation

## Overview
This document details the implementation of the betweenness centrality test for the knowledge graph. The test successfully identifies the most central nodes in the graph based on their betweenness centrality scores.

## Files Involved

### 1. Test Implementation (`src/test-betweenness.ts`)
- Main test file that runs the betweenness centrality algorithm
- Imports and uses the BetweennessCentrality algorithm class
- Processes the graph data and outputs the top 10 most central nodes

### 2. Algorithm Implementation (`src/algorithms/centrality/BetweennessCentrality.ts`)
- Contains the actual betweenness centrality algorithm implementation
- Extends the base Algorithm class
- Implements the execute() method that performs the centrality calculations

### 3. Graph Data Loading (`src/utils/cnmBuilder.ts`)
- Handles loading and parsing of the knowledge graph data
- Processes markdown files from the KG directory
- Creates nodes and links for the graph structure

## Test Process Flow

1. **Graph Loading**
   - The test starts by loading the knowledge graph
   - Graph data is loaded from markdown files in the KG directory
   - Current graph contains 320 nodes and 1710 links

2. **Betweenness Calculation**
   - The BetweennessCentrality algorithm is instantiated
   - Algorithm processes the graph data
   - Calculates betweenness scores for all nodes

3. **Results Processing**
   - Results are sorted by betweenness score
   - Top 10 nodes are extracted
   - Scores are formatted to 4 decimal places

## Current Results

The test successfully identified the top 10 most central nodes in the graph:

1. energy-flow-dissipation (0.1624)
2. neuromorphic-computation (0.1275)
3. microscopy (0.1168)
4. living-cells-and-tissues (0.0999)
5. mechanical-actuation (0.0968)
6. physical-embodied-computation (0.0962)
7. driven-by-physical-forces-dynamics (0.0937)
8. phase-conformation-memory (0.0820)
9. information-interface-sensing-and-transduction-mechanisms (0.0767)
10. statistical-mechanics-stochastic-thermodynamics (0.0739)

## Running the Test

The test is integrated into the main application and runs automatically when the app starts. Results are output to the browser's console.

## Technical Details

- The test uses the app's existing graph data loading infrastructure
- Betweenness scores are normalized (between 0 and 1)
- The algorithm treats the graph as undirected
- Results are displayed in a formatted table in the console

## Future Improvements

- Add visualization of the results
- Implement caching of betweenness scores
- Add export functionality for the results
- Consider adding other centrality measures for comparison
