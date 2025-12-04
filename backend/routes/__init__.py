from .pages import pages_bp
from .api import api_bp

def register_blueprints(app):
    """Enregistre tous les blueprints sur l'application Flask"""
    app.register_blueprint(pages_bp)
    app.register_blueprint(api_bp, url_prefix='/api')
