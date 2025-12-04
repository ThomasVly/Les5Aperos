from pathlib import Path

# Chemins de base
BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / 'frontend'

# Configuration Flask
class Config:
    DEBUG = True
    HOST = '0.0.0.0'
    PORT = 5000
