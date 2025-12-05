from pathlib import Path
import os

# Chemins de base
BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / 'frontend'

# Configuration Flask
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.environ.get('FLASK_ENV', 'development') != 'production'
    HOST = '0.0.0.0'
    PORT = int(os.environ.get('PORT', 5000))
    
    # Mode fake Ollama (pour dev sans GPU/Ollama)
    # Mettre à False en production ou si Ollama est disponible
    FAKE_OLLAMA = os.environ.get('FAKE_OLLAMA', 'true').lower() == 'true'
    
    # === Azure Blob Storage (contacts) ===
    # En production, les contacts sont stockés dans Azure Blob Storage
    AZURE_STORAGE_CONNECTION_STRING = os.environ.get('AZURE_STORAGE_CONNECTION_STRING')
    AZURE_STORAGE_CONTAINER_NAME = os.environ.get('AZURE_STORAGE_CONTAINER_NAME', 'contacts')
    
    # === Azure OpenAI (chatbot en production) ===
    # Budget: ~20€/mois ≈ 12.5M tokens/mois
    # GPT-3.5-turbo: ~$0.002/1K tokens
    AZURE_OPENAI_ENDPOINT = os.environ.get('AZURE_OPENAI_ENDPOINT')
    AZURE_OPENAI_API_KEY = os.environ.get('AZURE_OPENAI_API_KEY')
    AZURE_OPENAI_DEPLOYMENT_NAME = os.environ.get('AZURE_OPENAI_DEPLOYMENT_NAME', 'gpt-4o-mini')
    AZURE_OPENAI_MAX_TOKENS = int(os.environ.get('AZURE_OPENAI_MAX_TOKENS', '150'))
