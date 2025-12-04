from flask import Blueprint, jsonify

api_bp = Blueprint('api', __name__)


@api_bp.route('/hello')
def hello():
    """Exemple d'endpoint API"""
    return jsonify({
        'message': 'Hello from Flask!',
        'status': 'success'
    })
