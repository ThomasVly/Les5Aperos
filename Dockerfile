# Dockerfile pour Les5Aperos - Flask App
FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /app

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_ENV=production

# === Variables Azure (à configurer via Azure App Service ou docker run -e) ===
# AZURE_STORAGE_CONNECTION_STRING - Connexion Blob Storage pour contacts
# AZURE_STORAGE_CONTAINER_NAME - Nom du container (default: contacts)
# AZURE_OPENAI_ENDPOINT - Endpoint Azure OpenAI
# AZURE_OPENAI_API_KEY - Clé API Azure OpenAI
# AZURE_OPENAI_DEPLOYMENT_NAME - Nom du déploiement (default: gpt-35-turbo)
# AZURE_OPENAI_MAX_TOKENS - Limite tokens par réponse (default: 150, budget ~20€/mois)

# Installer les dépendances système
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copier les requirements et installer les dépendances Python
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copier le code de l'application
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Exposer le port
EXPOSE 5000

# Lancer l'application avec Gunicorn
WORKDIR /app/backend
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--threads", "4", "app:app"]
