from flask import Flask, render_template, jsonify, request
import os
from pathlib import Path
from datetime import datetime

from config import Config, FRONTEND_DIR
from routes import register_blueprints

BASE_DIR = Path(__file__).resolve().parent.parent


def create_app():
    """Factory function pour créer l'application Flask"""
    app = Flask(
        __name__,
        template_folder=str(FRONTEND_DIR),
        static_folder=str(FRONTEND_DIR)
    )
    
    app.config.from_object(Config)
    register_blueprints(app)
    
    return app


app = create_app()

@app.route('/contact')
def contact():
    """Page de contact"""
    return render_template('contact.html')

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    """Traitement du formulaire de contact"""
    try:
        data = request.get_json()
        
        # Validation basique
        required_fields = ['nom', 'email', 'sujet', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'status': 'error',
                    'message': f'Le champ {field} est requis'
                }), 400
        
        # Sauvegarde du message dans un fichier (pour démo)
        contacts_dir = BASE_DIR / 'contacts'
        contacts_dir.mkdir(exist_ok=True)
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = contacts_dir / f'contact_{timestamp}.txt'
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Nom: {data['nom']}\n")
            f.write(f"Email: {data['email']}\n")
            f.write(f"Sujet: {data['sujet']}\n")
            f.write(f"Message:\n{data['message']}\n")
        
        return jsonify({
            'status': 'success',
            'message': 'Votre message a été envoyé avec succès !'
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(
        debug=Config.DEBUG,
        host=Config.HOST,
        port=Config.PORT
    )
