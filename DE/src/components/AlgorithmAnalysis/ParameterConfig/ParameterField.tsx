import React, { useState, useEffect } from 'react';
import { AlgorithmParameter } from '../../../types/algorithm.types';
import { Tooltip } from '../../common/Tooltip';

interface ParameterFieldProps {
  parameter: AlgorithmParameter;
  value: any;
  onChange: (value: any) => void;
  darkMode?: boolean;
}

export const ParameterField: React.FC<ParameterFieldProps> = ({
  parameter,
  value,
  onChange,
  darkMode = false
}) => {
  const [error, setError] = useState<string | null>(null);

  // Initialize with default value if not set
  useEffect(() => {
    if (value === undefined && parameter.defaultValue !== undefined) {
      onChange(parameter.defaultValue);
    }
  }, []);

  // Validate value whenever it changes
  useEffect(() => {
    if (parameter.validation) {
      const isValid = parameter.validation(value);
      setError(isValid ? null : `Invalid value for ${parameter.name}`);
    } else {
      // Basic type validation
      switch (parameter.type) {
        case 'boolean':
          if (typeof value !== 'boolean') {
            setError(`Value must be a boolean`);
          } else {
            setError(null);
          }
          break;
        case 'number':
          if (typeof value !== 'number' || isNaN(value)) {
            setError(`Value must be a number`);
          } else {
            setError(null);
          }
          break;
        case 'string':
          if (typeof value !== 'string') {
            setError(`Value must be a string`);
          } else {
            setError(null);
          }
          break;
      }
    }
  }, [value, parameter]);

  const handleChange = (newValue: any) => {
    let processedValue = newValue;

    // Type conversion based on parameter type
    switch (parameter.type) {
      case 'number':
        processedValue = parseFloat(newValue);
        if (isNaN(processedValue)) {
          setError(`Invalid number value`);
          return;
        }
        break;
      case 'boolean':
        processedValue = Boolean(newValue);
        break;
      case 'string':
        processedValue = String(newValue);
        break;
    }

    // Validate before updating
    if (parameter.validation && !parameter.validation(processedValue)) {
      setError(`Invalid value for ${parameter.name}`);
      return;
    }

    onChange(processedValue);
  };

  const renderInput = () => {
    switch (parameter.type) {
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => handleChange(e.target.checked)}
            className="parameter-field__input parameter-field__input--checkbox"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={value ?? ''}
            onChange={(e) => handleChange(e.target.value)}
            className="parameter-field__input parameter-field__input--number"
          />
        );
      case 'string':
      default:
        return (
          <input
            type="text"
            value={value ?? ''}
            onChange={(e) => handleChange(e.target.value)}
            className="parameter-field__input parameter-field__input--text"
          />
        );
    }
  };

  return (
    <div className={`parameter-field ${error ? 'error' : ''} ${darkMode ? 'dark' : 'light'}`}>
      <label className="parameter-field__label">
        <Tooltip content={parameter.description} darkMode={darkMode}>
          <span className="parameter-field__name">{parameter.name}</span>
        </Tooltip>
      </label>
      {renderInput()}
      {error && <div className="parameter-field__error">{error}</div>}
    </div>
  );
}; 