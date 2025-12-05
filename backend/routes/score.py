from flask import Blueprint, jsonify, request
from services.score_service import *

# Création du Blueprint
score_bp = Blueprint('score', __name__)


@score_bp.route('/api/score', methods=['POST'])
def save_score_route():
    data = request.json
    pseudo = data.get('pseudo', 'Anonyme')
    score = data.get('score', 0)

    success = add_score(pseudo, score)

    if success:
        return jsonify({'status': 'success'})
    else:
        return jsonify({'status': 'error'}), 500


@score_bp.route('/api/leaderboard', methods=['GET'])
def get_leaderboard_route():
    scores = get_top_scores()
    return jsonify(scores)