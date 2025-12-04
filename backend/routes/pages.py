from flask import Blueprint, render_template

pages_bp = Blueprint('pages', __name__)


@pages_bp.route('/')
def index():
    """Page d'accueil"""
    return render_template('index.html')


@pages_bp.route('/activity')
def activity():
    """Page d'activité principale"""
    return render_template('activity.html')
