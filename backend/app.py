from flask import Flask, render_template, jsonify
import os
from pathlib import Path

# Obtenir le chemin absolu du dossier frontend
BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / 'frontend'

app = Flask(__name__, 
            template_folder=str(FRONTEND_DIR),
            static_folder=str(FRONTEND_DIR))

@app.route('/')
def index():
    """Page d'accueil"""
    return render_template('index.html')

@app.route('/activity')
def activity():
    """Page d'activité principale"""
    return render_template('activity.html')

@app.route('/api/hello')
def hello():
    """Exemple d'endpoint API"""
    return jsonify({
        'message': 'Hello from Flask!',
        'status': 'success'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
