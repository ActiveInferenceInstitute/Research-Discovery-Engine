import React from 'react';
import { AlgorithmRegistry } from '../../../algorithms/AlgorithmRegistry';
import { AlgorithmCategory } from '../../../types/algorithm.types';
import { AlgorithmCard } from './AlgorithmCard';
import './styles.css';

interface AlgorithmSelectorProps {
  selectedAlgorithms: string[];
  onSelect: (algorithmName: string, isSelected: boolean) => void;
  darkMode?: boolean;
}

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedAlgorithms,
  onSelect,
  darkMode = false
}) => {
  const registry = AlgorithmRegistry.getInstance();
  const categories: AlgorithmCategory[] = ['Gap Detection', 'Pattern Recognition', 'Relationship Analysis'];

  return (
    <div className={`algorithm-selector ${darkMode ? 'dark' : 'light'}`}>
      {categories.map(category => {
        const algorithms = registry.getAlgorithmsByCategory(category);
        if (algorithms.length === 0) return null;

        return (
          <div key={category} className="algorithm-selector__category">
            <h3 className="algorithm-selector__category-title">{category}</h3>
            <div className="algorithm-selector__grid">
              {algorithms.map(algorithm => (
                <AlgorithmCard
                  key={algorithm.name}
                  algorithm={algorithm}
                  isSelected={selectedAlgorithms.includes(algorithm.name)}
                  onClick={() => onSelect(algorithm.name, !selectedAlgorithms.includes(algorithm.name))}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>
        );
      })}
      {categories.every(category => registry.getAlgorithmsByCategory(category).length === 0) && (
        <div className="algorithm-selector__empty">
          <p>No algorithms available. Please check the algorithm registry configuration.</p>
        </div>
      )}
    </div>
  );
}; 