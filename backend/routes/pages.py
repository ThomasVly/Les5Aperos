from flask import Blueprint, app, render_template, jsonify, request
import os
from pathlib import Path
from datetime import datetime
from flask import Blueprint, render_template, request, jsonify

pages_bp = Blueprint('pages', __name__)

BASE_DIR = Path(__file__).resolve().parent.parent

@pages_bp.route('/')
def index():
    """Page d'accueil"""
    return render_template('index.html')


@pages_bp.route('/activity')
def activity():
    """Page d'activité principale"""
    return render_template('activity.html')

@pages_bp.route('/visualizer')
def visualizer():
    """Page du visualiseur"""
    return render_template('visualizer.html')

@pages_bp.route('/bureau')
def bureau():
    return render_template('bureau.html')

@pages_bp.route('/contact')
def contact():
    """Page de contact"""
    return render_template('contact.html')

@pages_bp.route('/api/contact', methods=['POST'])
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

@pages_bp.route('/nird')
def nird():
    """Page de la démarche NIRD"""
    return render_template('nird.html')

@pages_bp.route('/zerguemContreGoliath')
def zerguem_contre_goliath():
    """Page du jeu Zerguem contre Goliath"""
    return render_template('zerguem.html')



@pages_bp.route('/chatbot')
def chat_page():
    """Page du chatbot"""
    return render_template('chat.html')


@pages_bp.route('/api/chatbot', methods=['POST'])
def chat_api():
    """API pour le chatbot"""
    data = request.json
    message = data.get('message', '')

    # Appel à ton chatbot
    response = chatbot(message)

    return jsonify({'response': response})
