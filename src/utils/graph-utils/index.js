/**
 * Graph Utilities for Research Discovery Engine
 * 
 * This library provides utilities for knowledge graph manipulation,
 * analysis, and visualization preparation.
 */

/**
 * Graph data structure and manipulation utilities
 */
export class GraphUtils {
    constructor(nodes = [], links = []) {
        this.nodes = new Map(nodes.map(node => [node.id, node]));
        this.links = links;
        this.adjacencyList = this.buildAdjacencyList();
    }

    /**
     * Build adjacency list representation
     */
    buildAdjacencyList() {
        const adj = new Map();
        
        // Initialize adjacency list
        for (const node of this.nodes.values()) {
            adj.set(node.id, { outgoing: [], incoming: [] });
        }
        
        // Add edges
        for (const link of this.links) {
            if (adj.has(link.source)) {
                adj.get(link.source).outgoing.push({
                    target: link.target,
                    type: link.type,
                    weight: link.weight || 1.0,
                    properties: link.properties || {}
                });
            }
            
            if (adj.has(link.target)) {
                adj.get(link.target).incoming.push({
                    source: link.source,
                    type: link.type,
                    weight: link.weight || 1.0,
                    properties: link.properties || {}
                });
            }
        }
        
        return adj;
    }

    /**
     * Add a node to the graph
     */
    addNode(node) {
        this.nodes.set(node.id, node);
        if (!this.adjacencyList.has(node.id)) {
            this.adjacencyList.set(node.id, { outgoing: [], incoming: [] });
        }
        return this;
    }

    /**
     * Add a link to the graph
     */
    addLink(link) {
        this.links.push(link);
        
        // Update adjacency list
        if (this.adjacencyList.has(link.source)) {
            this.adjacencyList.get(link.source).outgoing.push({
                target: link.target,
                type: link.type,
                weight: link.weight || 1.0,
                properties: link.properties || {}
            });
        }
        
        if (this.adjacencyList.has(link.target)) {
            this.adjacencyList.get(link.target).incoming.push({
                source: link.source,
                type: link.type,
                weight: link.weight || 1.0,
                properties: link.properties || {}
            });
        }
        
        return this;
    }

    /**
     * Get node by ID
     */
    getNode(nodeId) {
        return this.nodes.get(nodeId);
    }

    /**
     * Get neighbors of a node
     */
    getNeighbors(nodeId, direction = 'both') {
        const adj = this.adjacencyList.get(nodeId);
        if (!adj) return [];
        
        const neighbors = [];
        
        if (direction === 'outgoing' || direction === 'both') {
            neighbors.push(...adj.outgoing.map(edge => ({
                node: this.nodes.get(edge.target),
                edge,
                direction: 'outgoing'
            })));
        }
        
        if (direction === 'incoming' || direction === 'both') {
            neighbors.push(...adj.incoming.map(edge => ({
                node: this.nodes.get(edge.source),
                edge,
                direction: 'incoming'
            })));
        }
        
        return neighbors;
    }

    /**
     * Find shortest path between two nodes
     */
    findShortestPath(sourceId, targetId, maxLength = 6) {
        if (sourceId === targetId) return [sourceId];
        
        const queue = [{ nodeId: sourceId, path: [sourceId] }];
        const visited = new Set();
        
        while (queue.length > 0) {
            const { nodeId, path } = queue.shift();
            
            if (visited.has(nodeId) || path.length > maxLength) continue;
            visited.add(nodeId);
            
            const neighbors = this.getNeighbors(nodeId);
            
            for (const neighbor of neighbors) {
                const neighborId = neighbor.node.id;
                
                if (neighborId === targetId) {
                    return [...path, neighborId];
                }
                
                if (!visited.has(neighborId)) {
                    queue.push({
                        nodeId: neighborId,
                        path: [...path, neighborId]
                    });
                }
            }
        }
        
        return null; // No path found
    }

    /**
     * Find all paths between two nodes up to maxLength
     */
    findAllPaths(sourceId, targetId, maxLength = 4) {
        const paths = [];
        
        const dfs = (currentId, target, path, visited) => {
            if (path.length > maxLength) return;
            
            if (currentId === target && path.length > 1) {
                paths.push([...path]);
                return;
            }
            
            const neighbors = this.getNeighbors(currentId);
            
            for (const neighbor of neighbors) {
                const neighborId = neighbor.node.id;
                
                if (!visited.has(neighborId)) {
                    visited.add(neighborId);
                    dfs(neighborId, target, [...path, neighborId], visited);
                    visited.delete(neighborId);
                }
            }
        };
        
        dfs(sourceId, targetId, [sourceId], new Set([sourceId]));
        return paths;
    }

    /**
     * Calculate node centrality measures
     */
    calculateCentrality() {
        const nodeIds = Array.from(this.nodes.keys());
        const centrality = {};
        
        // Degree centrality
        for (const nodeId of nodeIds) {
            const neighbors = this.getNeighbors(nodeId);
            const degree = neighbors.length;
            const normalizedDegree = nodeIds.length > 1 ? degree / (nodeIds.length - 1) : 0;
            
            centrality[nodeId] = {
                degree,
                normalizedDegree,
                inDegree: neighbors.filter(n => n.direction === 'incoming').length,
                outDegree: neighbors.filter(n => n.direction === 'outgoing').length
            };
        }
        
        // Betweenness centrality (simplified)
        for (const nodeId of nodeIds) {
            let betweenness = 0;
            
            for (const sourceId of nodeIds) {
                for (const targetId of nodeIds) {
                    if (sourceId !== targetId && sourceId !== nodeId && targetId !== nodeId) {
                        const paths = this.findAllPaths(sourceId, targetId, 5);
                        const pathsThroughNode = paths.filter(path => path.includes(nodeId));
                        
                        if (paths.length > 0) {
                            betweenness += pathsThroughNode.length / paths.length;
                        }
                    }
                }
            }
            
            centrality[nodeId].betweenness = betweenness;
        }
        
        return centrality;
    }

    /**
     * Find connected components
     */
    findConnectedComponents() {
        const visited = new Set();
        const components = [];
        
        const dfs = (nodeId, component) => {
            if (visited.has(nodeId)) return;
            
            visited.add(nodeId);
            component.push(this.nodes.get(nodeId));
            
            const neighbors = this.getNeighbors(nodeId);
            for (const neighbor of neighbors) {
                dfs(neighbor.node.id, component);
            }
        };
        
        for (const nodeId of this.nodes.keys()) {
            if (!visited.has(nodeId)) {
                const component = [];
                dfs(nodeId, component);
                components.push(component);
            }
        }
        
        return components;
    }

    /**
     * Filter graph by categories
     */
    filterByCategories(categories) {
        const categorySet = new Set(categories);
        const filteredNodes = Array.from(this.nodes.values())
            .filter(node => categorySet.has(node.category));
        const nodeIds = new Set(filteredNodes.map(n => n.id));
        
        const filteredLinks = this.links.filter(link => 
            nodeIds.has(link.source) && nodeIds.has(link.target)
        );
        
        return new GraphUtils(filteredNodes, filteredLinks);
    }

    /**
     * Get subgraph around a node
     */
    getSubgraph(centerNodeId, radius = 2) {
        const subgraphNodes = new Set([centerNodeId]);
        const subgraphLinks = [];
        
        // BFS to find nodes within radius
        const queue = [{ nodeId: centerNodeId, distance: 0 }];
        const visited = new Set([centerNodeId]);
        
        while (queue.length > 0) {
            const { nodeId, distance } = queue.shift();
            
            if (distance < radius) {
                const neighbors = this.getNeighbors(nodeId);
                
                for (const neighbor of neighbors) {
                    const neighborId = neighbor.node.id;
                    
                    if (!visited.has(neighborId)) {
                        visited.add(neighborId);
                        subgraphNodes.add(neighborId);
                        queue.push({ nodeId: neighborId, distance: distance + 1 });
                    }
                    
                    // Add edge if both nodes are in subgraph
                    if (subgraphNodes.has(neighborId)) {
                        if (neighbor.direction === 'outgoing') {
                            subgraphLinks.push({
                                source: nodeId,
                                target: neighborId,
                                type: neighbor.edge.type,
                                weight: neighbor.edge.weight
                            });
                        }
                    }
                }
            }
        }
        
        const nodes = Array.from(subgraphNodes).map(id => this.nodes.get(id));
        return new GraphUtils(nodes, subgraphLinks);
    }

    /**
     * Calculate graph statistics
     */
    getStatistics() {
        const nodeCount = this.nodes.size;
        const linkCount = this.links.length;
        const density = nodeCount > 1 ? (2 * linkCount) / (nodeCount * (nodeCount - 1)) : 0;
        
        // Category distribution
        const categories = {};
        for (const node of this.nodes.values()) {
            categories[node.category] = (categories[node.category] || 0) + 1;
        }
        
        // Link type distribution
        const linkTypes = {};
        for (const link of this.links) {
            linkTypes[link.type] = (linkTypes[link.type] || 0) + 1;
        }
        
        // Connected components
        const components = this.findConnectedComponents();
        const largestComponent = Math.max(...components.map(c => c.length));
        
        return {
            nodes: nodeCount,
            links: linkCount,
            density,
            categories,
            linkTypes,
            components: components.length,
            largestComponent,
            averageDegree: nodeCount > 0 ? (2 * linkCount) / nodeCount : 0
        };
    }

    /**
     * Export graph data in various formats
     */
    toJSON() {
        return {
            nodes: Array.from(this.nodes.values()),
            links: this.links
        };
    }

    toCytoscape() {
        return {
            elements: {
                nodes: Array.from(this.nodes.values()).map(node => ({
                    data: {
                        id: node.id,
                        label: node.label,
                        type: node.type,
                        category: node.category
                    }
                })),
                edges: this.links.map((link, index) => ({
                    data: {
                        id: `edge-${index}`,
                        source: link.source,
                        target: link.target,
                        type: link.type,
                        weight: link.weight
                    }
                }))
            }
        };
    }

    toD3() {
        return {
            nodes: Array.from(this.nodes.values()),
            links: this.links
        };
    }
}

/**
 * Graph analysis utilities
 */
export class GraphAnalyzer {
    static analyzeSimilarity(graph1, graph2) {
        const nodes1 = new Set(Array.from(graph1.nodes.keys()));
        const nodes2 = new Set(Array.from(graph2.nodes.keys()));
        
        const intersection = new Set([...nodes1].filter(x => nodes2.has(x)));
        const union = new Set([...nodes1, ...nodes2]);
        
        const jaccardSimilarity = union.size > 0 ? intersection.size / union.size : 0;
        
        return {
            jaccardSimilarity,
            commonNodes: intersection.size,
            totalNodes1: nodes1.size,
            totalNodes2: nodes2.size,
            unionSize: union.size
        };
    }

    static findCommunities(graph, algorithm = 'louvain') {
        // Simplified community detection
        const communities = [];
        const visited = new Set();
        
        for (const nodeId of graph.nodes.keys()) {
            if (!visited.has(nodeId)) {
                const community = [];
                const queue = [nodeId];
                
                while (queue.length > 0) {
                    const currentId = queue.shift();
                    if (visited.has(currentId)) continue;
                    
                    visited.add(currentId);
                    community.push(graph.nodes.get(currentId));
                    
                    const neighbors = graph.getNeighbors(currentId);
                    for (const neighbor of neighbors) {
                        if (!visited.has(neighbor.node.id) && 
                            neighbor.edge.weight > 0.5) { // Threshold for community
                            queue.push(neighbor.node.id);
                        }
                    }
                }
                
                if (community.length > 0) {
                    communities.push(community);
                }
            }
        }
        
        return communities;
    }

    static detectAnomalies(graph) {
        const centrality = graph.calculateCentrality();
        const stats = graph.getStatistics();
        const anomalies = [];
        
        // Find nodes with unusually high degree
        const avgDegree = stats.averageDegree;
        const degreeThreshold = avgDegree * 3;
        
        for (const [nodeId, metrics] of Object.entries(centrality)) {
            if (metrics.degree > degreeThreshold) {
                anomalies.push({
                    nodeId,
                    type: 'high_degree',
                    severity: metrics.degree / avgDegree,
                    description: `Node has ${metrics.degree} connections (avg: ${avgDegree.toFixed(1)})`
                });
            }
        }
        
        // Find isolated nodes
        for (const [nodeId, metrics] of Object.entries(centrality)) {
            if (metrics.degree === 0) {
                anomalies.push({
                    nodeId,
                    type: 'isolated',
                    severity: 1.0,
                    description: 'Node has no connections'
                });
            }
        }
        
        return anomalies;
    }
}

/**
 * Graph layout utilities for visualization
 */
export class GraphLayout {
    static forceDirected(graph, options = {}) {
        const {
            width = 800,
            height = 600,
            iterations = 100,
            repulsionStrength = 1000,
            attractionStrength = 0.1
        } = options;
        
        const nodes = Array.from(graph.nodes.values());
        const links = graph.links;
        
        // Initialize positions
        const positions = {};
        for (const node of nodes) {
            positions[node.id] = {
                x: Math.random() * width,
                y: Math.random() * height,
                vx: 0,
                vy: 0
            };
        }
        
        // Force-directed layout simulation
        for (let iter = 0; iter < iterations; iter++) {
            // Reset forces
            for (const node of nodes) {
                positions[node.id].fx = 0;
                positions[node.id].fy = 0;
            }
            
            // Repulsion forces
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const node1 = nodes[i];
                    const node2 = nodes[j];
                    const pos1 = positions[node1.id];
                    const pos2 = positions[node2.id];
                    
                    const dx = pos1.x - pos2.x;
                    const dy = pos1.y - pos2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                    
                    const force = repulsionStrength / (distance * distance);
                    const fx = (dx / distance) * force;
                    const fy = (dy / distance) * force;
                    
                    pos1.fx += fx;
                    pos1.fy += fy;
                    pos2.fx -= fx;
                    pos2.fy -= fy;
                }
            }
            
            // Attraction forces
            for (const link of links) {
                const pos1 = positions[link.source];
                const pos2 = positions[link.target];
                
                if (pos1 && pos2) {
                    const dx = pos2.x - pos1.x;
                    const dy = pos2.y - pos1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                    
                    const force = attractionStrength * distance * (link.weight || 1);
                    const fx = (dx / distance) * force;
                    const fy = (dy / distance) * force;
                    
                    pos1.fx += fx;
                    pos1.fy += fy;
                    pos2.fx -= fx;
                    pos2.fy -= fy;
                }
            }
            
            // Update positions
            for (const node of nodes) {
                const pos = positions[node.id];
                pos.vx = (pos.vx + pos.fx) * 0.9; // Damping
                pos.vy = (pos.vy + pos.fy) * 0.9;
                pos.x += pos.vx;
                pos.y += pos.vy;
                
                // Keep within bounds
                pos.x = Math.max(50, Math.min(width - 50, pos.x));
                pos.y = Math.max(50, Math.min(height - 50, pos.y));
            }
        }
        
        return positions;
    }

    static hierarchical(graph, options = {}) {
        const {
            width = 800,
            height = 600,
            levelHeight = 100
        } = options;
        
        const nodes = Array.from(graph.nodes.values());
        const positions = {};
        
        // Group nodes by category (simplified hierarchical layout)
        const categories = {};
        for (const node of nodes) {
            if (!categories[node.category]) {
                categories[node.category] = [];
            }
            categories[node.category].push(node);
        }
        
        const categoryNames = Object.keys(categories);
        const levelWidth = width / Math.max(1, categoryNames.length);
        
        categoryNames.forEach((category, levelIndex) => {
            const nodesInCategory = categories[category];
            const nodeWidth = levelWidth / Math.max(1, nodesInCategory.length);
            
            nodesInCategory.forEach((node, nodeIndex) => {
                positions[node.id] = {
                    x: levelIndex * levelWidth + nodeIndex * nodeWidth + nodeWidth / 2,
                    y: levelIndex * levelHeight + 100
                };
            });
        });
        
        return positions;
    }

    static circular(graph, options = {}) {
        const {
            width = 800,
            height = 600,
            radius = 200
        } = options;
        
        const nodes = Array.from(graph.nodes.values());
        const positions = {};
        const centerX = width / 2;
        const centerY = height / 2;
        
        const angleStep = (2 * Math.PI) / nodes.length;
        
        nodes.forEach((node, index) => {
            const angle = index * angleStep;
            positions[node.id] = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        });
        
        return positions;
    }
}

/**
 * Graph transformation utilities
 */
export class GraphTransform {
    static merge(graph1, graph2) {
        const mergedNodes = new Map();
        const mergedLinks = [];
        
        // Merge nodes (graph2 takes precedence for duplicates)
        for (const node of graph1.nodes.values()) {
            mergedNodes.set(node.id, { ...node });
        }
        
        for (const node of graph2.nodes.values()) {
            mergedNodes.set(node.id, { ...node });
        }
        
        // Merge links (remove duplicates)
        const linkSet = new Set();
        
        for (const link of [...graph1.links, ...graph2.links]) {
            const linkKey = `${link.source}-${link.type}-${link.target}`;
            if (!linkSet.has(linkKey)) {
                linkSet.add(linkKey);
                mergedLinks.push({ ...link });
            }
        }
        
        return new GraphUtils(Array.from(mergedNodes.values()), mergedLinks);
    }

    static project(graph, projectionType = 'bipartite') {
        if (projectionType === 'bipartite') {
            // Project bipartite graph to single node type
            const materialNodes = Array.from(graph.nodes.values())
                .filter(node => node.category === 'materials');
            
            const projectedLinks = [];
            
            for (let i = 0; i < materialNodes.length; i++) {
                for (let j = i + 1; j < materialNodes.length; j++) {
                    const node1 = materialNodes[i];
                    const node2 = materialNodes[j];
                    
                    // Find common neighbors
                    const neighbors1 = new Set(graph.getNeighbors(node1.id).map(n => n.node.id));
                    const neighbors2 = new Set(graph.getNeighbors(node2.id).map(n => n.node.id));
                    
                    const commonNeighbors = [...neighbors1].filter(id => neighbors2.has(id));
                    
                    if (commonNeighbors.length > 0) {
                        projectedLinks.push({
                            source: node1.id,
                            target: node2.id,
                            type: 'shared-connections',
                            weight: commonNeighbors.length,
                            properties: { commonNeighbors }
                        });
                    }
                }
            }
            
            return new GraphUtils(materialNodes, projectedLinks);
        }
        
        return graph;
    }

    static aggregate(graph, aggregateBy = 'category') {
        if (aggregateBy === 'category') {
            const categoryNodes = {};
            const categoryLinks = {};
            
            // Create category nodes
            for (const node of graph.nodes.values()) {
                if (!categoryNodes[node.category]) {
                    categoryNodes[node.category] = {
                        id: node.category,
                        label: node.category.charAt(0).toUpperCase() + node.category.slice(1),
                        type: 'CategoryNode',
                        category: 'category',
                        count: 0,
                        nodes: []
                    };
                }
                categoryNodes[node.category].count++;
                categoryNodes[node.category].nodes.push(node);
            }
            
            // Create category links
            for (const link of graph.links) {
                const sourceNode = graph.nodes.get(link.source);
                const targetNode = graph.nodes.get(link.target);
                
                if (sourceNode && targetNode) {
                    const sourceCategory = sourceNode.category;
                    const targetCategory = targetNode.category;
                    
                    if (sourceCategory !== targetCategory) {
                        const linkKey = `${sourceCategory}-${targetCategory}`;
                        const reverseLinkKey = `${targetCategory}-${sourceCategory}`;
                        
                        if (!categoryLinks[linkKey] && !categoryLinks[reverseLinkKey]) {
                            categoryLinks[linkKey] = {
                                source: sourceCategory,
                                target: targetCategory,
                                type: 'category-connection',
                                weight: 0,
                                count: 0
                            };
                        }
                        
                        const existingLink = categoryLinks[linkKey] || categoryLinks[reverseLinkKey];
                        existingLink.weight += (link.weight || 1);
                        existingLink.count++;
                    }
                }
            }
            
            return new GraphUtils(
                Object.values(categoryNodes),
                Object.values(categoryLinks)
            );
        }
        
        return graph;
    }
}

export default GraphUtils; 