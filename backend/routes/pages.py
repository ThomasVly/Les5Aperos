from flask import Blueprint, render_template, jsonify, request
import os
from pathlib import Path
from datetime import datetime

from chatbot import chatbot
from services.storage_service import storage_service

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
    """Traitement du formulaire de contact - Azure Blob en prod, fichier local en dev"""
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

        # Sauvegarde via le service de stockage (Azure Blob ou fichier local)
        result = storage_service.save_contact(data)
        
        if result['status'] == 'success':
            return jsonify({
                'status': 'success',
                'message': result['message']
            })
        else:
            return jsonify({
                'status': 'error',
                'message': result['message']
            }), 500

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
