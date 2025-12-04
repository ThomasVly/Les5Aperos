from flask import Flask

from config import Config, FRONTEND_DIR
from routes import register_blueprints


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

if __name__ == '__main__':
    app.run(
        debug=Config.DEBUG,
        host=Config.HOST,
        port=Config.PORT
    )
