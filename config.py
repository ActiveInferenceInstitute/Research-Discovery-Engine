# config.py
"""
Configuration management for Discovery Engine (Disc-Eng)
Loads settings from .env file with sensible defaults
"""

import os
from dotenv import load_dotenv
from typing import Optional
import sys

# Load environment variables from .env file
load_dotenv()

class Config:
    """Configuration class that loads settings from environment variables"""
    
    # LLM Settings
    LLM_PROVIDER: str = os.getenv('LLM_PROVIDER', 'openrouter')
    OPENROUTER_API_KEY: Optional[str] = os.getenv('OPENROUTER_API_KEY')
    GEMINI_API_KEY: Optional[str] = os.getenv('GEMINI_API_KEY')
    
    # Processing Settings
    BATCH_SIZE: int = int(os.getenv('BATCH_SIZE', '10'))
    MAX_RETRIES: int = int(os.getenv('MAX_RETRIES', '3'))
    TIMEOUT_SECONDS: int = int(os.getenv('TIMEOUT_SECONDS', '30'))
    
    # Directory Paths
    INPUT_DIR: str = os.getenv('INPUT_DIR', '../AI-4/')
    OUTPUT_DIR: str = os.getenv('OUTPUT_DIR', '../synthetic/publications6GIN10/')
    CACHE_DIR: str = os.getenv('CACHE_DIR', '.embedding_cache/')
    
    # Analysis Settings
    MIN_CLUSTER_SIZE: int = int(os.getenv('MIN_CLUSTER_SIZE', '5'))
    EMBEDDING_MODEL: str = os.getenv('EMBEDDING_MODEL', 'sentence-transformers/all-MiniLM-L6-v2')
    
    @classmethod
    def validate(cls) -> bool:
        """Validate required configuration"""
        errors = []
        
        # Check LLM provider is valid
        valid_providers = ['openrouter', 'google']
        if cls.LLM_PROVIDER not in valid_providers:
            errors.append(f"LLM_PROVIDER must be one of {valid_providers}, got: {cls.LLM_PROVIDER}")
        
        # Check API keys based on provider
        if cls.LLM_PROVIDER == 'openrouter':
            if not cls.OPENROUTER_API_KEY or cls.OPENROUTER_API_KEY == 'your_openrouter_key_here':
                errors.append("OPENROUTER_API_KEY is required when using OpenRouter provider")
        
        if cls.LLM_PROVIDER == 'google':
            if not cls.GEMINI_API_KEY or cls.GEMINI_API_KEY == 'your_gemini_key_here':
                errors.append("GEMINI_API_KEY is required when using Google Gemini provider")
        
        if errors:
            error_msg = "Configuration validation failed:\n" + "\n".join(f"  - {error}" for error in errors)
            raise ValueError(error_msg)
        
        return True
    
    @classmethod
    def print_config(cls) -> None:
        """Print current configuration (without sensitive data)"""
        print("=" * 50)
        print("Discovery Engine Configuration")
        print("=" * 50)
        print(f"LLM Provider: {cls.LLM_PROVIDER}")
        print(f"API Key Set: {'✅' if cls.get_current_api_key() else '❌'}")
        print(f"Batch Size: {cls.BATCH_SIZE}")
        print(f"Max Retries: {cls.MAX_RETRIES}")
        print(f"Timeout: {cls.TIMEOUT_SECONDS}s")
        print(f"Input Dir: {cls.INPUT_DIR}")
        print(f"Output Dir: {cls.OUTPUT_DIR}")
        print(f"Cache Dir: {cls.CACHE_DIR}")
        print(f"Min Cluster Size: {cls.MIN_CLUSTER_SIZE}")
        print(f"Embedding Model: {cls.EMBEDDING_MODEL}")
        print("=" * 50)
    
    @classmethod
    def get_current_api_key(cls) -> Optional[str]:
        """Get the API key for the current provider"""
        if cls.LLM_PROVIDER == 'openrouter':
            return cls.OPENROUTER_API_KEY
        elif cls.LLM_PROVIDER == 'google':
            return cls.GEMINI_API_KEY
        return None

# Create global config instance
config = Config()

# If run directly, perform setup check
if __name__ == "__main__":
    print("Discovery Engine Configuration Check")
    print("====================================")
    config.print_config()
    print()
    
    try:
        config.validate()
        print("✅ Configuration validation passed!")
    except ValueError as e:
        print(f"❌ Configuration error:\n{e}")