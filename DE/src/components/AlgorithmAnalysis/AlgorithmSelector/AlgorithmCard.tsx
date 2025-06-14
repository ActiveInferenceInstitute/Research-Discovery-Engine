import React from 'react';
import { GraphAlgorithm } from '../../../types/algorithm.types';
import './styles.css';

interface AlgorithmCardProps {
  algorithm: GraphAlgorithm;
  isSelected: boolean;
  onClick: () => void;
  darkMode?: boolean;
}

export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({
  algorithm,
  isSelected,
  onClick,
  darkMode = false
}) => {
  return (
    <div
      className={`algorithm-card ${isSelected ? 'selected' : ''} ${darkMode ? 'dark' : 'light'}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className="algorithm-card__header">
        <h4 className="algorithm-card__title">{algorithm.name}</h4>
        <div className={`algorithm-card__checkbox ${isSelected ? 'checked' : ''}`}>
          {isSelected && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17L4 12" />
            </svg>
          )}
        </div>
      </div>
      <p className="algorithm-card__description">{algorithm.description}</p>
      <div className="algorithm-card__footer">
        <span className="algorithm-card__category">{algorithm.category}</span>
        <span className="algorithm-card__parameter-count">
          {algorithm.parameters.length} parameter{algorithm.parameters.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}; 