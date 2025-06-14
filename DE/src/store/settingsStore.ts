import { OpenRouterConfig, AgentConfig } from '../types/api.types';

// Constants for storage keys
const STORAGE_KEYS = {
  CONFIG: 'rde_agent_config'
} as const;

// Default configuration
const DEFAULT_CONFIG: AgentConfig = {
  openRouter: {
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'anthropic/claude-3-opus',
    maxTokens: 4000,
    temperature: 0.7,
    apiKey: '' // Empty string as default, will be set by user
  },
  maxRetries: 3,
  timeout: 30000,
  streaming: true
};

// Simple encryption/decryption for API key
const encrypt = (text: string): string => {
  // In a production environment, use a proper encryption library
  return btoa(text);
};

const decrypt = (encrypted: string): string => {
  // In a production environment, use a proper decryption library
  return atob(encrypted);
};

class SettingsStore {
  private static instance: SettingsStore;
  private config: AgentConfig;
  private listeners: Set<() => void>;

  private constructor() {
    this.listeners = new Set();
    this.config = this.loadConfig();
  }

  static getInstance(): SettingsStore {
    if (!SettingsStore.instance) {
      SettingsStore.instance = new SettingsStore();
    }
    return SettingsStore.instance;
  }

  private loadConfig(): AgentConfig {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return savedConfig ? JSON.parse(savedConfig) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  private saveConfig(config: AgentConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
      this.config = config;
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  // Public methods
  getConfig(): AgentConfig {
    return { ...this.config };
  }

  getApiKey(): string | null {
    return this.config.openRouter.apiKey || null;
  }

  setApiKey(apiKey: string | null): void {
    this.saveConfig({
      ...this.config,
      openRouter: {
        ...this.config.openRouter,
        apiKey: apiKey || ''
      }
    });
  }

  setModel(model: string): void {
    this.saveConfig({
      ...this.config,
      openRouter: {
        ...this.config.openRouter,
        model
      }
    });
  }

  setMaxTokens(maxTokens: number): void {
    this.saveConfig({
      ...this.config,
      openRouter: {
        ...this.config.openRouter,
        maxTokens
      }
    });
  }

  setTemperature(temperature: number): void {
    this.saveConfig({
      ...this.config,
      openRouter: {
        ...this.config.openRouter,
        temperature
      }
    });
  }

  setStreaming(streaming: boolean): void {
    this.saveConfig({
      ...this.config,
      streaming
    });
  }

  resetToDefaults(): void {
    this.saveConfig(DEFAULT_CONFIG);
  }

  // Subscribe to changes
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const settingsStore = SettingsStore.getInstance(); 