import { GraphAlgorithm, AlgorithmParameter, AlgorithmParameters, AlgorithmResult, GraphData } from '../../types/algorithm.types';

export abstract class BaseAlgorithm implements GraphAlgorithm {
  abstract name: string;
  abstract category: 'Gap Detection' | 'Pattern Recognition' | 'Relationship Analysis';
  abstract description: string;
  abstract parameters: AlgorithmParameter[];
  
  protected validateParameters(params: AlgorithmParameters): void {
    for (const param of this.parameters) {
      const value = params[param.name];
      if (value === undefined) {
        params[param.name] = param.defaultValue;
      } else if (param.validation && !param.validation(value)) {
        throw new Error(`Invalid value for parameter ${param.name}`);
      }
    }
  }

  protected createResult(data: any, params: AlgorithmParameters, startTime: number): AlgorithmResult {
    return {
      algorithmName: this.name,
      timestamp: Date.now(),
      data,
      metadata: {
        executionTime: Date.now() - startTime,
        graphSize: 0, // Will be set in execute
        parameters: params
      }
    };
  }

  async execute(graph: GraphData, params: AlgorithmParameters): Promise<AlgorithmResult> {
    const startTime = Date.now();
    
    // Validate parameters
    this.validateParameters(params);
    
    // Execute the algorithm
    const result = await this.executeAlgorithm(graph, params);
    
    // Add metadata
    result.metadata.graphSize = graph.nodes.length;
    
    return result;
  }

  protected abstract executeAlgorithm(graph: GraphData, params: AlgorithmParameters): Promise<AlgorithmResult>;
} 