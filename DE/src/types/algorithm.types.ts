import { NodeObject, LinkObject, GraphData as GraphDataType } from './index';

export type AlgorithmCategory = 'Gap Detection' | 'Pattern Recognition' | 'Relationship Analysis';

// Re-export GraphData
export type GraphData = GraphDataType;

export interface AlgorithmParameter {
  name: string;
  type: 'string' | 'number' | 'boolean';
  description: string;
  defaultValue: any;
  validation?: (value: any) => boolean;
}

export interface AlgorithmParameters {
  [key: string]: any;
}

export interface AlgorithmResult {
  algorithmName: string;
  timestamp: number;
  data: any[];
  metadata: {
    executionTime: number;
    graphSize: number;
    parameters: AlgorithmParameters;
    category: AlgorithmCategory;
    componentStats?: {
      totalComponents: number;
      isolatedNodes: number;
      componentSizes: number[];
    };
  };
}

export interface GraphAlgorithm {
  name: string;
  category: AlgorithmCategory;
  description: string;
  parameters: AlgorithmParameter[];
  execute: (graph: GraphData, params: AlgorithmParameters) => Promise<AlgorithmResult>;
} 