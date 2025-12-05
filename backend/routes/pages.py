from flask import Blueprint, render_template, request, jsonify
from chatbot import chatbot  # Import de ton chatbot

pages_bp = Blueprint('pages', __name__)


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


@pages_bp.route('/chat')
def chat_page():
    """Page du chatbot"""
    return render_template('chat.html')


@pages_bp.route('/api/chat', methods=['POST'])
def chat_api():
    """API pour le chatbot"""
    data = request.json
    message = data.get('message', '')

    # Appel à ton chatbot
    response = chatbot(message)

    return jsonify({'response': response})
