import React, { useState } from 'react';
import { GraphAlgorithm, AlgorithmResult, AlgorithmParameters, GraphData } from '../../types/algorithm.types';
import { AlgorithmRegistry } from '../../algorithms/AlgorithmRegistry';
import { AlgorithmSelector } from './AlgorithmSelector';
import { ParameterConfig } from './ParameterConfig';
import { ResultDisplay } from './ResultDisplay';
import './styles.css';

interface AlgorithmAnalysisProps {
  graph: GraphData;
  darkMode?: boolean;
}

interface SelectedAlgorithm {
  id: string;
  instance: GraphAlgorithm;
  parameters: AlgorithmParameters;
}

export const AlgorithmAnalysis: React.FC<AlgorithmAnalysisProps> = ({
  graph,
  darkMode = false
}) => {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<SelectedAlgorithm[]>([]);
  const [results, setResults] = useState<AlgorithmResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleAlgorithmSelect = (algorithmId: string, isSelected: boolean) => {
    console.log('Algorithm selection:', { algorithmId, isSelected });
    const registry = AlgorithmRegistry.getInstance();
    const algorithm = registry.getAlgorithm(algorithmId);
    
    if (!algorithm) {
      console.error('Algorithm not found:', algorithmId);
      return;
    }

    if (isSelected) {
      // Initialize parameters with default values
      const defaultParameters = algorithm.parameters.reduce((acc, param) => ({
        ...acc,
        [param.name]: param.defaultValue
      }), {});

      console.log('Adding algorithm with parameters:', { algorithmId, defaultParameters });
      setSelectedAlgorithms(prev => [...prev, {
        id: algorithmId,
        instance: algorithm,
        parameters: defaultParameters
      }]);
    } else {
      console.log('Removing algorithm:', algorithmId);
      setSelectedAlgorithms(prev => prev.filter(alg => alg.id !== algorithmId));
    }
  };

  const handleParameterChange = (algorithmId: string, newParams: AlgorithmParameters) => {
    console.log('Parameter change:', { algorithmId, newParams });
    setSelectedAlgorithms(prev => prev.map(alg => 
      alg.id === algorithmId ? { ...alg, parameters: newParams } : alg
    ));
  };

  const handleExecute = async () => {
    console.log('Starting execution with selected algorithms:', selectedAlgorithms);
    
    if (selectedAlgorithms.length === 0) {
      setError('No algorithms selected');
      return;
    }

    try {
      setError(null);
      setIsExecuting(true);
      const newResults: AlgorithmResult[] = [];
      const errors: string[] = [];

      for (const { instance, parameters } of selectedAlgorithms) {
        try {
          console.log(`Executing ${instance.name} with parameters:`, parameters);
          console.log('Graph data:', graph);
          
          const result = await instance.execute(graph, parameters);
          console.log(`${instance.name} execution result:`, result);
          
          if (!result.data || result.data.length === 0) {
            console.error(`${instance.name} returned no data`);
            errors.push(`${instance.name} returned no data`);
            continue;
          }
          
          console.log(`Adding result for ${instance.name}:`, result);
          newResults.push(result);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.error(`Error executing ${instance.name}:`, errorMessage);
          errors.push(`${instance.name}: ${errorMessage}`);
        }
      }

      if (errors.length > 0) {
        console.error('Execution errors:', errors);
        setError(errors.join('\n'));
      }

      if (newResults.length > 0) {
        console.log('Setting results:', newResults);
        setResults(newResults);
      } else {
        console.error('No valid results produced');
        setError('No algorithms produced valid results');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during execution';
      console.error('Execution error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className={`algorithm-analysis ${darkMode ? 'dark' : 'light'}`}>
      <div className="algorithm-analysis__header">
        <h2>Algorithm Analysis</h2>
      </div>

      <div className="algorithm-analysis__content">
        <AlgorithmSelector
          selectedAlgorithms={selectedAlgorithms.map(alg => alg.id)}
          onSelect={handleAlgorithmSelect}
          darkMode={darkMode}
        />

        {selectedAlgorithms.map(({ id, instance, parameters }) => (
          <div key={id} className="algorithm-analysis__algorithm-section">
            <h3 className="algorithm-analysis__algorithm-title">{instance.name}</h3>
            <ParameterConfig
              algorithm={instance}
              parameters={parameters}
              onChange={(newParams) => handleParameterChange(id, newParams)}
              darkMode={darkMode}
            />
          </div>
        ))}

        {error && (
          <div className="algorithm-analysis__error">
            {error}
          </div>
        )}

        {selectedAlgorithms.length > 0 && (
          <button
            className={`algorithm-analysis__execute-button ${isExecuting ? 'executing' : ''}`}
            onClick={handleExecute}
            disabled={isExecuting || selectedAlgorithms.some(alg => Object.keys(alg.parameters).length === 0)}
          >
            {isExecuting ? 'Executing...' : 'Execute Analysis'}
          </button>
        )}

        {results.length > 0 && (
          <div className="algorithm-analysis__results">
            {results.map((result, index) => (
              <ResultDisplay
                key={`${result.algorithmName}-${index}`}
                result={result}
                darkMode={darkMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 