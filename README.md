# Les5Aperos

> 🍻 Projet réalisé pour la Nuit de l'Info 2025 - Les 5Apéros - INSA Hauts de France

## 🌐 Accès en ligne

**Site déployé :** [https://les5aperos-app.thankfuldesert-9c4e98f2.westeurope.azurecontainerapps.io/](https://les5aperos-app.thankfuldesert-9c4e98f2.westeurope.azurecontainerapps.io/)

---

## Installation

### Prérequis
- Python 3.x installé sur votre système
- (Optionnel) [Ollama](https://ollama.ai/) pour le chatbot IA en local

### Configuration de l'environnement virtuel

1. **Créer l'environnement virtuel**
   ```bash
   python -m venv venv
   ```

2. **Activer l'environnement virtuel**
   
   - Sur Windows (PowerShell) :
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   
   - Sur Windows (CMD) :
     ```cmd
     venv\Scripts\activate.bat
     ```
   
   - Sur Linux/Mac :
     ```bash
     source venv/bin/activate
     ```

3. **Installer les dépendances**
   ```bash
   pip install -r backend/requirements.txt
   ```

---

## Lancement du projet

### Mode standard (sans Ollama)

Par défaut, le chatbot fonctionne en mode "fake" avec des réponses humoristiques pré-enregistrées.

1. Assurez-vous que l'environnement virtuel est activé
2. Lancez le serveur Flask :
   ```bash
   python backend/app.py
   ```
3. Ouvrez votre navigateur à l'adresse : `http://localhost:5000`

### Mode avec Ollama (IA locale)

Pour utiliser le chatbot avec un vrai modèle IA local :

1. **Installer Ollama** depuis [ollama.ai](https://ollama.ai/)

2. **Télécharger un modèle** (exemple avec llama2) :
   ```bash
   ollama pull llama2
   ```

3. **Créer le modèle personnalisé** (optionnel) :
   ```bash
   ollama create chatbot-maladroit -f Modelfile
   ```

4. **Lancer avec Ollama activé** :
   ```bash
   # Windows PowerShell
   $env:FAKE_OLLAMA="false"; python backend/app.py
   
   # Linux/Mac
   FAKE_OLLAMA=false python backend/app.py
   ```

---

## 🗺️ Pages & Features disponibles

| Route | Description |
|-------|-------------|
| `http://localhost:5000/` | Page d'accueil avec intro animée |
| `http://localhost:5000/bureau` | Bureau Windows XP avec icônes cliquables |
| `http://localhost:5000/activity` | Page d'activité principale |
| `http://localhost:5000/visualizer` | 🎵 Sonneries Explorer - Visualiseur audio style WinAmp |
| `http://localhost:5000/chatbot` | 🤖 Chatbot maladroit (avec ou sans Ollama) |
| `http://localhost:5000/contact` | 📧 Formulaire de contact avec 15+ easter eggs |
| `http://localhost:5000/nird` | 🌐 Page Wikipedia sur la démarche NIRD |
| `http://localhost:5000/zerguemContreGoliath` | 🔫 Mini-jeu laser - Détruire les virus |
| `http://localhost:5000/game/reset` | 🎮 Jeu interactif principal (scénarios) |

---

## 🔌 Endpoints API

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/hello` | GET | Exemple d'endpoint API (retourne JSON) |
| `/api/contact` | POST | Soumettre le formulaire de contact |
| `/api/chatbot` | POST | Envoyer un message au chatbot |

---

## 📁 Structure du projet

```
Les5Aperos/
├── backend/
│   ├── app.py              # Point d'entrée Flask
│   ├── config.py           # Configuration
│   ├── requirements.txt    # Dépendances Python
│   ├── chatbot.py          # Logique du chatbot
│   ├── ollabama.py         # Intégration Ollama
│   ├── routes/             # Routes Flask
│   ├── services/           # Services (AI, stockage)
│   └── data/               # Données JSON
├── frontend/
│   ├── *.html              # Templates HTML
│   ├── css/                # Styles CSS
│   ├── js/                 # JavaScript
│   └── src/                # Assets (images, polices)
├── contacts/               # Formulaires de contact sauvegardés
└── documentationDefis/     # Documentation des défis
```

---

## 🎮 Easter Eggs

Le projet contient de nombreux easter eggs cachés, notamment sur la page `/contact`. Consultez la documentation dans `documentationDefis/Le Formulaire De la Gloire.md` pour découvrir les 15+ secrets !

**Quelques indices :**
- 🎹 Konami Code sur le formulaire
- 🍻 Tapez "5Apero" n'importe où...
- 🔮 Un champ mystérieux se fait voler par une main

---

*Projet créé pour la Nuit de l'Info 2024 - Équipe Les5Apéros - INSA Toulouse*
