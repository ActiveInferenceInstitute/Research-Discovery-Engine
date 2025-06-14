import React from 'react';
import { AlgorithmResult } from '../../../types/algorithm.types';
import './styles.css';

interface CentralityResultProps {
  result: AlgorithmResult;
  darkMode?: boolean;
}

export const CentralityResult: React.FC<CentralityResultProps> = ({
  result,
  darkMode = false
}) => {
  // Sort nodes by centrality score
  const sortedNodes = [...result.data].sort((a, b) => b.betweenness - a.betweenness);

  return (
    <div className={`centrality-result ${darkMode ? 'dark' : 'light'}`}>
      <h3 className="centrality-result__title">{result.algorithmName} Results</h3>
      
      <div className="centrality-result__metadata">
        <div className="centrality-result__metadata-item">
          <span className="centrality-result__label">Execution Time:</span>
          <span className="centrality-result__value">{result.metadata.executionTime.toFixed(2)}ms</span>
        </div>
        <div className="centrality-result__metadata-item">
          <span className="centrality-result__label">Graph Size:</span>
          <span className="centrality-result__value">{result.metadata.graphSize} nodes</span>
        </div>
      </div>

      <div className="centrality-result__table-container">
        <table className="centrality-result__table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Node ID</th>
              <th>Betweenness Score</th>
            </tr>
          </thead>
          <tbody>
            {sortedNodes.map((node, index) => (
              <tr key={node.nodeId} className={index < 10 ? 'centrality-result__top-node' : ''}>
                <td>{index + 1}</td>
                <td>{node.nodeId}</td>
                <td>{node.betweenness.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 