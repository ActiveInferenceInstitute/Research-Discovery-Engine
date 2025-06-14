import React from 'react';
import { AlgorithmResult } from '../../../types/algorithm.types';
import { CentralityResult } from './CentralityResult';
import './styles.css';

interface ResultDisplayProps {
  result: AlgorithmResult | null;
  darkMode?: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  darkMode = false
}) => {
  if (!result) {
    return null;
  }

  // Check if this is a centrality result by looking at the data structure
  const isCentralityResult = Array.isArray(result.data) && 
    result.data.length > 0 && 
    'nodeId' in result.data[0] && 
    'betweenness' in result.data[0];

  if (isCentralityResult) {
    return <CentralityResult result={result} darkMode={darkMode} />;
  }

  const renderValue = (value: any): React.ReactNode => {
    if (typeof value === 'object' && value !== null) {
      return (
        <pre className="result-display__json">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }
    return String(value);
  };

  return (
    <div className={`result-display ${darkMode ? 'dark' : 'light'}`}>
      <h3 className="result-display__title">Analysis Results</h3>
      <div className="result-display__content">
        {Object.entries(result).map(([key, value]) => (
          <div key={key} className="result-display__item">
            <span className="result-display__key">{key}:</span>
            <div className="result-display__value">
              {renderValue(value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 