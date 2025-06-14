import React from 'react';
import { GraphAlgorithm, AlgorithmParameters } from '../../../types/algorithm.types';
import { ParameterField } from './ParameterField';
import './styles.css';

interface ParameterConfigProps {
  algorithm: GraphAlgorithm | null;
  parameters: AlgorithmParameters;
  onChange: (params: AlgorithmParameters) => void;
  darkMode?: boolean;
}

export const ParameterConfig: React.FC<ParameterConfigProps> = ({
  algorithm,
  parameters,
  onChange,
  darkMode = false
}) => {
  if (!algorithm) return null;

  const handleParameterChange = (name: string, value: any) => {
    onChange({
      ...parameters,
      [name]: value
    });
  };

  return (
    <div className={`parameter-config ${darkMode ? 'dark' : 'light'}`}>
      <h3 className="parameter-config__title">Parameters</h3>
      <div className="parameter-config__fields">
        {algorithm.parameters.map(param => (
          <ParameterField
            key={param.name}
            parameter={param}
            value={parameters[param.name]}
            onChange={(value) => handleParameterChange(param.name, value)}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
}; 