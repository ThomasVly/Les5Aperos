from .pages import pages_bp
from .game import game_bp
from .score import score_bp

def register_blueprints(app):
    """Enregistre tous les blueprints sur l'application Flask"""
    app.register_blueprint(pages_bp)
    app.register_blueprint(game_bp)
    app.register_blueprint(score_bp)
