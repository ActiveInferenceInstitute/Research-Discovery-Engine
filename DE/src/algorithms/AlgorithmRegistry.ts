import { GraphAlgorithm, AlgorithmCategory } from '../types/algorithm.types';

export class AlgorithmRegistry {
  private static instance: AlgorithmRegistry;
  private algorithms: Map<string, GraphAlgorithm> = new Map();

  private constructor() {}

  static getInstance(): AlgorithmRegistry {
    if (!AlgorithmRegistry.instance) {
      AlgorithmRegistry.instance = new AlgorithmRegistry();
    }
    return AlgorithmRegistry.instance;
  }

  register(algorithm: GraphAlgorithm): void {
    if (this.algorithms.has(algorithm.name)) {
      throw new Error(`Algorithm with name ${algorithm.name} is already registered`);
    }
    this.algorithms.set(algorithm.name, algorithm);
  }

  getAlgorithm(name: string): GraphAlgorithm | undefined {
    return this.algorithms.get(name);
  }

  getAllAlgorithms(): GraphAlgorithm[] {
    return Array.from(this.algorithms.values());
  }

  getAlgorithmsByCategory(category: AlgorithmCategory): GraphAlgorithm[] {
    return this.getAllAlgorithms().filter(alg => alg.category === category);
  }

  unregister(name: string): boolean {
    return this.algorithms.delete(name);
  }
} 