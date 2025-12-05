from pathlib import Path
import os

# Chemins de base
BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / 'frontend'

# Configuration Flask
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = True
    HOST = '0.0.0.0'
    PORT = 5000
    
    # Mode fake Ollama (pour dev sans GPU/Ollama)
    # Mettre à False en production ou si Ollama est disponible
    FAKE_OLLAMA = os.environ.get('FAKE_OLLAMA', 'true').lower() == 'true'
