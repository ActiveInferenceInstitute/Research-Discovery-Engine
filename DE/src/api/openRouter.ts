import { OpenRouterConfig, AgentResponse, AgentError } from '../types/api.types';
import { AlgorithmResult } from '../types/algorithm.types';

export class OpenRouterClient {
  private config: OpenRouterConfig;
  private defaultHeaders: HeadersInit;

  constructor(config: OpenRouterConfig) {
    this.config = {
      ...config,
      baseUrl: 'https://openrouter.ai/api/v1'
    };
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Research Discovery Engine'
    };
  }

  private async handleResponse(response: Response): Promise<AgentResponse> {
    console.log('OpenRouter: Handling response...');
    if (!response.ok) {
      const error: AgentError = {
        code: response.status.toString(),
        message: response.statusText,
        retryable: response.status >= 500,
        action: 'retry'
      };
      throw error;
    }

    const data = await response.json();
    console.log('OpenRouter: Parsed response data:', data);
    return {
      content: data.choices[0].message.content,
      status: 'success',
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      }
    };
  }

  async complete(prompt: string): Promise<AgentResponse> {
    console.log('OpenRouter: Starting complete request...');
    const url = `${this.config.baseUrl}/chat/completions`;
    const body = {
      model: this.config.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      stream: false
    };

    try {
      console.log('OpenRouter: Making API request...');
      const response = await fetch(url, {
        method: 'POST',
        headers: this.defaultHeaders,
        body: JSON.stringify(body)
      });

      console.log('OpenRouter: Received response:', response.status);
      return this.handleResponse(response);
    } catch (error) {
      console.error('OpenRouter: Error in complete request:', error);
      const agentError: AgentError = {
        code: 'API_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        retryable: true,
        action: 'retry'
      };
      throw agentError;
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/models`, {
        headers: this.defaultHeaders
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async exploreGraph(algorithmResults: AlgorithmResult[], focusArea: string, depth: string): Promise<AgentResponse> {
    console.log('OpenRouter: Received algorithm results:', algorithmResults);
    
    // Format algorithm results for analysis
    const formattedResults = algorithmResults.map(result => {
      console.log('Processing result:', result);
      const formatted = {
        algorithmName: result.algorithmName,
        category: result.metadata.category,
        insights: this.extractInsights(result),
        keyNodes: this.extractKeyNodes(result),
        patterns: this.extractPatterns(result)
      };
      console.log('Formatted result:', formatted);
      return formatted;
    });

    console.log('OpenRouter: Formatted results:', formattedResults);

    const prompt = `You are an AI agent specialized in scientific research analysis.
                   Analyze the following algorithm results with the focus:
                   - Primary focus area: ${focusArea || 'general analysis'}
                   - Analysis depth: ${depth || 'comprehensive'}
                   
                   Algorithm Results:
                   ${JSON.stringify(formattedResults, null, 2)}
                   
                   Please provide:
                   1. A comprehensive analysis of the knowledge gaps and opportunities identified by the algorithms
                   2. Potential connections between important nodes identified by the algorithms
                   3. Areas requiring further investigation based on the algorithm insights
                   4. Missing relationships that could be valuable
                   5. Structural patterns and clusters identified by the algorithms
                   
                   Respond with:
                   1. A structured analysis in JSON format
                   2. Specific graph updates to represent your findings
                   3. Recommendations for next steps`;

    return this.complete(prompt);
  }

  private extractInsights(result: AlgorithmResult): string[] {
    console.log('Extracting insights from:', result);
    
    // Extract key insights based on algorithm type
    switch (result.algorithmName) {
      case 'BetweennessCentrality':
        return this.extractBetweennessInsights(result);
      case 'Research Gap Detector':
        return this.extractResearchGapInsights(result);
      case 'Research Cluster Detector':
        return this.extractResearchClusterInsights(result);
      default:
        console.log('No specific insight extraction for algorithm:', result.algorithmName);
        return [];
    }
  }

  private extractBetweennessInsights(result: AlgorithmResult): string[] {
    console.log('Extracting betweenness insights from:', result);
    const insights: string[] = [];
    const data = result.data as { nodeId: string; betweenness: number; componentId?: string }[];
    console.log('Betweenness data:', data);

    if (!data || data.length === 0) {
      console.log('No betweenness data available');
      return insights;
    }

    // Get component stats
    const componentStats = result.metadata.componentStats;
    if (componentStats) {
      insights.push(`Graph contains ${componentStats.totalComponents} components`);
      insights.push(`Found ${componentStats.isolatedNodes} isolated nodes`);
      
      const componentSizeDistribution = componentStats.componentSizes.reduce((acc, size) => {
        acc[size] = (acc[size] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      
      Object.entries(componentSizeDistribution)
        .sort(([a], [b]) => Number(a) - Number(b))
        .forEach(([size, count]) => {
          const sizeNum = Number(size);
          insights.push(`${count} component${count > 1 ? 's' : ''} with ${sizeNum} node${sizeNum > 1 ? 's' : ''}`);
        });
    }

    // Group nodes by component
    const componentNodes = data.reduce((acc, node) => {
      const componentId = node.componentId || 'unknown';
      if (!acc[componentId]) {
        acc[componentId] = [];
      }
      acc[componentId].push(node);
      return acc;
    }, {} as Record<string, typeof data>);

    // Analyze each component
    Object.entries(componentNodes).forEach(([componentId, nodes]) => {
      if (nodes.length === 1) {
        insights.push(`Node ${nodes[0].nodeId} is isolated`);
        return;
      }

      // Sort nodes by betweenness
      const sortedNodes = [...nodes].sort((a, b) => b.betweenness - a.betweenness);
      
      // Add insights for top nodes in this component
      const topNodes = sortedNodes.slice(0, 3);
      topNodes.forEach((node, index) => {
        insights.push(`In component ${componentId}, node ${node.nodeId} is a critical connector (rank ${index + 1}) with betweenness ${node.betweenness.toFixed(3)}`);
      });

      // Add component-level insights
      const maxBetweenness = sortedNodes[0].betweenness;
      const minBetweenness = sortedNodes[sortedNodes.length - 1].betweenness;
      insights.push(`Component ${componentId} has betweenness range from ${minBetweenness.toFixed(3)} to ${maxBetweenness.toFixed(3)}`);
    });

    console.log('Generated insights:', insights);
    return insights;
  }

  private extractResearchGapInsights(result: AlgorithmResult): string[] {
    console.log('Extracting research gap insights from:', result);
    const insights: string[] = [];
    const data = result.data as Array<{
      id: string;
      type: 'conceptual' | 'methodological' | 'experimental' | 'theoretical';
      sourceNodes: string[];
      targetNodes: string[];
      confidence: number;
      description: string;
      potentialConnections: Array<{
        nodeId: string;
        type: string;
        relevance: number;
      }>;
    }>;

    if (!data || data.length === 0) {
      console.log('No research gap data available');
      return insights;
    }

    // Group gaps by type
    const gapsByType = data.reduce((acc, gap) => {
      if (!acc[gap.type]) {
        acc[gap.type] = [];
      }
      acc[gap.type].push(gap);
      return acc;
    }, {} as Record<string, typeof data>);

    // Add insights for each gap type
    Object.entries(gapsByType).forEach(([type, gaps]) => {
      insights.push(`Found ${gaps.length} potential ${type} gaps`);

      // Add insights for top gaps in this type
      const topGaps = gaps
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3);

      topGaps.forEach(gap => {
        insights.push(gap.description);
        
        // Add insights about potential connections
        const topConnections = gap.potentialConnections
          .sort((a, b) => b.relevance - a.relevance)
          .slice(0, 2);

        if (topConnections.length > 0) {
          insights.push(`Potential connections through: ${topConnections.map(c => 
            `node ${c.nodeId} (${c.type}, relevance: ${c.relevance.toFixed(2)})`
          ).join(', ')}`);
        }
      });
    });

    // Add overall statistics
    const avgConfidence = data.reduce((sum, gap) => sum + gap.confidence, 0) / data.length;
    insights.push(`Average confidence in identified gaps: ${avgConfidence.toFixed(2)}`);

    console.log('Generated insights:', insights);
    return insights;
  }

  private extractResearchClusterInsights(result: AlgorithmResult): string[] {
    console.log('Extracting research cluster insights from:', result);
    const insights: string[] = [];
    const data = result.data as Array<{
      id: string;
      type: 'theoretical' | 'experimental' | 'methodological' | 'mixed';
      nodes: string[];
      cohesion: number;
      description: string;
      keyNodes: Array<{
        nodeId: string;
        role: 'central' | 'connector' | 'specialist';
        importance: number;
      }>;
      metadata: {
        size: number;
        density: number;
        citationCount: number;
        primaryTopics: string[];
      };
    }>;

    if (!data || data.length === 0) {
      console.log('No research cluster data available');
      return insights;
    }

    // Group clusters by type
    const clustersByType = data.reduce((acc, cluster) => {
      if (!acc[cluster.type]) {
        acc[cluster.type] = [];
      }
      acc[cluster.type].push(cluster);
      return acc;
    }, {} as Record<string, typeof data>);

    // Add insights for each cluster type
    Object.entries(clustersByType).forEach(([type, clusters]) => {
      insights.push(`Found ${clusters.length} ${type} research clusters`);

      // Add insights for top clusters in this type
      const topClusters = clusters
        .sort((a, b) => b.cohesion - a.cohesion)
        .slice(0, 3);

      topClusters.forEach(cluster => {
        insights.push(cluster.description);
        
        // Add insights about key nodes
        const centralNode = cluster.keyNodes.find(n => n.role === 'central');
        const connectorNode = cluster.keyNodes.find(n => n.role === 'connector');
        
        if (centralNode) {
          insights.push(`Central node: ${centralNode.nodeId} (importance: ${centralNode.importance.toFixed(2)})`);
        }
        if (connectorNode) {
          insights.push(`Connector node: ${connectorNode.nodeId} (importance: ${connectorNode.importance.toFixed(2)})`);
        }

        // Add insights about cluster metadata
        insights.push(`Cluster size: ${cluster.metadata.size} nodes`);
        insights.push(`Cluster density: ${cluster.metadata.density.toFixed(2)}`);
        if (cluster.metadata.citationCount > 0) {
          insights.push(`Internal citations: ${cluster.metadata.citationCount}`);
        }
        if (cluster.metadata.primaryTopics.length > 0) {
          insights.push(`Primary topics: ${cluster.metadata.primaryTopics.join(', ')}`);
        }
      });
    });

    // Add overall statistics
    const avgCohesion = data.reduce((sum, cluster) => sum + cluster.cohesion, 0) / data.length;
    insights.push(`Average cluster cohesion: ${avgCohesion.toFixed(2)}`);

    const totalNodes = new Set(data.flatMap(cluster => cluster.nodes)).size;
    insights.push(`Total unique nodes in clusters: ${totalNodes}`);

    console.log('Generated insights:', insights);
    return insights;
  }

  private extractKeyNodes(result: AlgorithmResult): string[] {
    // Extract important node IDs based on algorithm type
    switch (result.algorithmName) {
      case 'BetweennessCentrality':
        return this.extractBetweennessKeyNodes(result);
      case 'Research Gap Detector':
        return this.extractResearchGapKeyNodes(result);
      case 'Research Cluster Detector':
        return this.extractResearchClusterKeyNodes(result);
      default:
        return [];
    }
  }

  private extractBetweennessKeyNodes(result: AlgorithmResult): string[] {
    const data = result.data as { nodeId: string; betweenness: number; componentId?: string }[];
    
    // Group nodes by component
    const componentNodes = data.reduce((acc, node) => {
      const componentId = node.componentId || 'unknown';
      if (!acc[componentId]) {
        acc[componentId] = [];
      }
      acc[componentId].push(node);
      return acc;
    }, {} as Record<string, typeof data>);

    // Get top nodes from each component
    const keyNodes: string[] = [];
    Object.values(componentNodes).forEach(nodes => {
      if (nodes.length > 1) {  // Skip isolated nodes
        const topNodes = [...nodes]
          .sort((a, b) => b.betweenness - a.betweenness)
          .slice(0, 2)  // Get top 2 nodes from each component
          .map(node => node.nodeId);
        keyNodes.push(...topNodes);
      }
    });

    return keyNodes;
  }

  private extractResearchGapKeyNodes(result: AlgorithmResult): string[] {
    const data = result.data as Array<{
      sourceNodes: string[];
      targetNodes: string[];
      potentialConnections: Array<{
        nodeId: string;
        relevance: number;
      }>;
    }>;

    // Collect all nodes involved in gaps
    const keyNodes = new Set<string>();
    
    data.forEach(gap => {
      // Add source and target nodes
      gap.sourceNodes.forEach(nodeId => keyNodes.add(nodeId));
      gap.targetNodes.forEach(nodeId => keyNodes.add(nodeId));

      // Add potential connection nodes with high relevance
      gap.potentialConnections
        .filter(conn => conn.relevance > 0.5)
        .forEach(conn => keyNodes.add(conn.nodeId));
    });

    return Array.from(keyNodes);
  }

  private extractResearchClusterKeyNodes(result: AlgorithmResult): string[] {
    const data = result.data as Array<{
      keyNodes: Array<{
        nodeId: string;
        role: 'central' | 'connector' | 'specialist';
        importance: number;
      }>;
    }>;

    // Collect all key nodes, prioritizing central and connector nodes
    const keyNodes = new Set<string>();
    
    data.forEach(cluster => {
      // Add central and connector nodes first
      cluster.keyNodes
        .filter(node => node.role === 'central' || node.role === 'connector')
        .forEach(node => keyNodes.add(node.nodeId));

      // Add specialist nodes with high importance
      cluster.keyNodes
        .filter(node => node.role === 'specialist' && node.importance > 0.7)
        .forEach(node => keyNodes.add(node.nodeId));
    });

    return Array.from(keyNodes);
  }

  private extractPatterns(result: AlgorithmResult): { type: string; description: string; nodes: string[] }[] {
    // Extract patterns based on algorithm type
    switch (result.algorithmName) {
      case 'BetweennessCentrality':
        return this.extractBetweennessPatterns(result);
      case 'Research Gap Detector':
        return this.extractResearchGapPatterns(result);
      case 'Research Cluster Detector':
        return this.extractResearchClusterPatterns(result);
      default:
        return [];
    }
  }

  private extractBetweennessPatterns(result: AlgorithmResult): { type: string; description: string; nodes: string[] }[] {
    const data = result.data as { nodeId: string; betweenness: number; componentId?: string }[];
    const patterns: { type: string; description: string; nodes: string[] }[] = [];

    // Group nodes by component
    const componentNodes = data.reduce((acc, node) => {
      const componentId = node.componentId || 'unknown';
      if (!acc[componentId]) {
        acc[componentId] = [];
      }
      acc[componentId].push(node);
      return acc;
    }, {} as Record<string, typeof data>);

    // Analyze each component
    Object.entries(componentNodes).forEach(([componentId, nodes]) => {
      if (nodes.length === 1) {
        patterns.push({
          type: 'isolated-node',
          description: 'Isolated node with no connections',
          nodes: [nodes[0].nodeId]
        });
        return;
      }

      // Sort nodes by betweenness
      const sortedNodes = [...nodes].sort((a, b) => b.betweenness - a.betweenness);

      // Add pattern for high-betweenness nodes
      const highBetweennessNodes = sortedNodes
        .filter(node => node.betweenness > 0.5)
        .map(node => node.nodeId);
      
      if (highBetweennessNodes.length > 0) {
        patterns.push({
          type: 'high-betweenness-cluster',
          description: `Nodes with high betweenness centrality in component ${componentId}`,
          nodes: highBetweennessNodes
        });
      }

      // Add pattern for low-betweenness nodes
      const lowBetweennessNodes = sortedNodes
        .filter(node => node.betweenness < 0.1)
        .map(node => node.nodeId);
      
      if (lowBetweennessNodes.length > 0) {
        patterns.push({
          type: 'low-betweenness-cluster',
          description: `Nodes with low betweenness centrality in component ${componentId}`,
          nodes: lowBetweennessNodes
        });
      }
    });

    return patterns;
  }

  private extractResearchGapPatterns(result: AlgorithmResult): { type: string; description: string; nodes: string[] }[] {
    const data = result.data as Array<{
      type: string;
      sourceNodes: string[];
      targetNodes: string[];
      potentialConnections: Array<{
        nodeId: string;
        type: string;
        relevance: number;
      }>;
    }>;

    const patterns: { type: string; description: string; nodes: string[] }[] = [];

    // Group gaps by type
    const gapsByType = data.reduce((acc, gap) => {
      if (!acc[gap.type]) {
        acc[gap.type] = [];
      }
      acc[gap.type].push(gap);
      return acc;
    }, {} as Record<string, typeof data>);

    // Create patterns for each gap type
    Object.entries(gapsByType).forEach(([type, gaps]) => {
      // Create pattern for high-confidence gaps
      const highConfidenceGaps = gaps.filter(gap => 
        gap.potentialConnections.some(conn => conn.relevance > 0.7)
      );

      if (highConfidenceGaps.length > 0) {
        const nodes = new Set<string>();
        highConfidenceGaps.forEach(gap => {
          gap.sourceNodes.forEach(nodeId => nodes.add(nodeId));
          gap.targetNodes.forEach(nodeId => nodes.add(nodeId));
          gap.potentialConnections
            .filter(conn => conn.relevance > 0.7)
            .forEach(conn => nodes.add(conn.nodeId));
        });

        patterns.push({
          type: `high-confidence-${type}-gaps`,
          description: `Cluster of ${type} gaps with high-confidence potential connections`,
          nodes: Array.from(nodes)
        });
      }

      // Create pattern for isolated gaps
      const isolatedGaps = gaps.filter(gap => 
        gap.potentialConnections.every(conn => conn.relevance < 0.3)
      );

      if (isolatedGaps.length > 0) {
        const nodes = new Set<string>();
        isolatedGaps.forEach(gap => {
          gap.sourceNodes.forEach(nodeId => nodes.add(nodeId));
          gap.targetNodes.forEach(nodeId => nodes.add(nodeId));
        });

        patterns.push({
          type: `isolated-${type}-gaps`,
          description: `Cluster of ${type} gaps with limited connection potential`,
          nodes: Array.from(nodes)
        });
      }
    });

    return patterns;
  }

  private extractResearchClusterPatterns(result: AlgorithmResult): { type: string; description: string; nodes: string[] }[] {
    const data = result.data as Array<{
      type: string;
      nodes: string[];
      cohesion: number;
      keyNodes: Array<{
        nodeId: string;
        role: 'central' | 'connector' | 'specialist';
      }>;
    }>;

    const patterns: { type: string; description: string; nodes: string[] }[] = [];

    // Group clusters by type
    const clustersByType = data.reduce((acc, cluster) => {
      if (!acc[cluster.type]) {
        acc[cluster.type] = [];
      }
      acc[cluster.type].push(cluster);
      return acc;
    }, {} as Record<string, typeof data>);

    // Create patterns for each cluster type
    Object.entries(clustersByType).forEach(([type, clusters]) => {
      // Create pattern for high-cohesion clusters
      const highCohesionClusters = clusters.filter(cluster => cluster.cohesion > 0.7);

      if (highCohesionClusters.length > 0) {
        const nodes = new Set<string>();
        highCohesionClusters.forEach(cluster => {
          cluster.nodes.forEach(nodeId => nodes.add(nodeId));
        });

        patterns.push({
          type: `high-cohesion-${type}-clusters`,
          description: `Group of highly cohesive ${type} research clusters`,
          nodes: Array.from(nodes)
        });
      }

      // Create pattern for clusters with strong connectors
      const clustersWithConnectors = clusters.filter(cluster =>
        cluster.keyNodes.some(node => node.role === 'connector')
      );

      if (clustersWithConnectors.length > 0) {
        const nodes = new Set<string>();
        clustersWithConnectors.forEach(cluster => {
          cluster.nodes.forEach(nodeId => nodes.add(nodeId));
        });

        patterns.push({
          type: `connected-${type}-clusters`,
          description: `Group of ${type} clusters with strong inter-cluster connections`,
          nodes: Array.from(nodes)
        });
      }
    });

    return patterns;
  }
} 