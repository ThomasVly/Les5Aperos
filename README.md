# Les5Aperos

## Installation

### Prérequis
- Python 3.x installé sur votre système

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
   pip install -r requirements.txt
   ```

### Désactiver l'environnement virtuel

Lorsque vous avez terminé de travailler sur le projet :
```bash
deactivate
```

## Structure du projet

```
Les5Aperos/
├── backend/
│   └── app.py              # Application Flask
├── frontend/
│   ├── index.html          # Page d'accueil
│   ├── css/
│   │   └── style.css       # Styles CSS
│   └── js/
│       └── main.js         # JavaScript
├── venv/                   # Environnement virtuel
├── .env.example            # Exemple de configuration
├── requirements.txt        # Dépendances Python
└── README.md
```

## Lancement du projet

1. Assurez-vous que l'environnement virtuel est activé
2. Lancez le serveur Flask :
   ```bash
   python backend/app.py
   ```
3. Ouvrez votre navigateur à l'adresse : `http://localhost:5000`

## Endpoints API

- `GET /` - Page d'accueil
- `GET /api/hello` - Exemple d'endpoint API qui retourne un JSON
