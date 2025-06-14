import React, { useState, useEffect } from 'react';
import { settingsStore } from '../../store/settingsStore';
import { AgentService } from '../../api/agentService';
import { AgentConfig } from '../../types/api.types';
import { 
  Key, 
  Settings, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface APISettingsProps {
  darkMode: boolean;
  onClose: () => void;
}

const APISettings: React.FC<APISettingsProps> = ({ darkMode, onClose }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Subscribe to config changes
  useEffect(() => {
    const savedApiKey = settingsStore.getApiKey();
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    return settingsStore.subscribe(() => {
      // Force re-render when config changes
      setApiKey(settingsStore.getApiKey() || '');
    });
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setValidationStatus('idle');
    setErrorMessage('');
  };

  const handleConfigChange = (key: keyof AgentConfig['openRouter'], value: string | number) => {
    if (key === 'maxTokens' || key === 'temperature') {
      settingsStore.setMaxTokens(Number(value));
    } else if (key === 'model') {
      settingsStore.setModel(value as string);
    }
  };

  const validateApiKey = async () => {
    setIsValidating(true);
    setValidationStatus('validating');
    setErrorMessage('');

    try {
      // Create a mock message handler that will help us detect validation errors
      const mockOnMessage = (message: any) => {
        if (message.type === 'error') {
          throw new Error(message.content);
        }
      };

      const agentService = new AgentService(apiKey, mockOnMessage);
      const isValid = await agentService.validateApiKey();

      if (isValid) {
        setValidationStatus('success');
        settingsStore.setApiKey(apiKey);
      } else {
        setValidationStatus('error');
        setErrorMessage('Invalid API key. Please check and try again.');
      }
    } catch (error) {
      setValidationStatus('error');
      if (error instanceof Error) {
        if (error.message.includes('API key') || error.message.includes('unauthorized')) {
          setErrorMessage('Invalid API key. Please check your OpenRouter API key and try again.');
        } else if (error.message.includes('network')) {
          setErrorMessage('Network error. Please check your internet connection and try again.');
        } else {
          setErrorMessage(error.message || 'Failed to validate API key');
        }
      } else {
        setErrorMessage('An unexpected error occurred while validating the API key');
      }
    } finally {
      setIsValidating(false);
    }
  };

  const resetSettings = () => {
    settingsStore.resetToDefaults();
    setApiKey('');
    setValidationStatus('idle');
    setErrorMessage('');
  };

  const config = settingsStore.getConfig();

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Settings className="mr-2" size={20} />
          API Settings
        </h2>
        <button
          onClick={onClose}
          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          ×
        </button>
      </div>

      <div className="space-y-6">
        {/* API Key Section */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center">
            <Key className="mr-2" size={16} />
            OpenRouter API Key
          </label>
          <div className="flex space-x-2">
            <input
              type="password"
              value={apiKey}
              onChange={handleApiKeyChange}
              className={`flex-1 p-2 rounded-md border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Enter your OpenRouter API key"
            />
            <button
              onClick={validateApiKey}
              disabled={isValidating || !apiKey}
              className={`px-4 py-2 rounded-md flex items-center ${
                isValidating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : darkMode
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {isValidating ? (
                <RefreshCw className="animate-spin" size={16} />
              ) : validationStatus === 'success' ? (
                <CheckCircle size={16} />
              ) : validationStatus === 'error' ? (
                <XCircle size={16} />
              ) : (
                'Validate'
              )}
            </button>
          </div>
          {errorMessage && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <AlertTriangle size={14} className="mr-1" />
              {errorMessage}
            </p>
          )}
        </div>

        {/* Model Configuration */}
        <div>
          <label className="block text-sm font-medium mb-2">Model</label>
          <select
            value={config.openRouter.model}
            onChange={(e) => handleConfigChange('model', e.target.value)}
            className={`w-full p-2 rounded-md border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="anthropic/claude-3-opus">Claude 3 Opus</option>
            <option value="anthropic/claude-3-sonnet">Claude 3 Sonnet</option>
            <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
          </select>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Advanced Settings</h3>
          
          <div>
            <label className="block text-sm mb-2">Max Tokens</label>
            <input
              type="number"
              value={config.openRouter.maxTokens}
              onChange={(e) => handleConfigChange('maxTokens', e.target.value)}
              className={`w-full p-2 rounded-md border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              min="1"
              max="16000"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Temperature</label>
            <input
              type="number"
              value={config.openRouter.temperature}
              onChange={(e) => handleConfigChange('temperature', e.target.value)}
              className={`w-full p-2 rounded-md border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              min="0"
              max="2"
              step="0.1"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={config.streaming}
              onChange={(e) => settingsStore.setStreaming(e.target.checked)}
              className="mr-2"
            />
            <label className="text-sm">Enable Streaming Responses</label>
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={resetSettings}
            className={`px-4 py-2 rounded-md ${
              darkMode 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-red-500 hover:bg-red-600'
            } text-white`}
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default APISettings; 