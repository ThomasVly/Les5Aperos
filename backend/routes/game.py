from flask import Blueprint, session, render_template, request, redirect, url_for
from services import ScenarioService

game_bp = Blueprint('game', __name__)


def init_session():
    """Initialise une nouvelle session de jeu"""
    session['scenario'] = ScenarioService.get_start_scenario_id()
    session['history'] = []
    session['score'] = {'good': 0, 'bad': 0, 'neutral': 0}


@game_bp.route('/game')
def start():
    """Démarre une nouvelle partie"""
    init_session()
    return redirect(url_for('game.play'))


@game_bp.route('/game/play')
def play():
    """Affiche le scénario actuel"""
    # Si pas de session, en créer une
    if 'scenario' not in session:
        init_session()
    
    scenario_id = session['scenario']
    scenario = ScenarioService.get_scenario(scenario_id)
    
    if not scenario:
        # Scénario introuvable, reset
        init_session()
        scenario_id = session['scenario']
        scenario = ScenarioService.get_scenario(scenario_id)
    
    # Si c'est une fin, afficher le template ending
    if scenario.get('ending'):
        return render_template(
            'ending.html',
            scenario=scenario,
            history=session.get('history', []),
            score=session.get('score', {})
        )
    
    # Sinon afficher le scénario
    return render_template(
        'scenario.html',
        scenario=scenario,
        scenario_id=scenario_id
    )


@game_bp.route('/game/choose', methods=['POST'])
def choose():
    """Traite le choix du joueur"""
    if 'scenario' not in session:
        return redirect(url_for('game.start'))
    
    choice_index = int(request.form.get('choice', 0))
    current_id = session['scenario']
    scenario = ScenarioService.get_scenario(current_id)
    
    if not scenario or 'choices' not in scenario:
        return redirect(url_for('game.play'))
    
    # Récupérer le choix
    choices = scenario['choices']
    if choice_index < 0 or choice_index >= len(choices):
        return redirect(url_for('game.play'))
    
    choice = choices[choice_index]
    
    # Enregistrer dans l'historique
    history = session.get('history', [])
    history.append({
        'scenario_id': current_id,
        'scenario_name': scenario.get('name', ''),
        'choice_text': choice.get('text', ''),
        'effect': choice.get('effect', 'neutral')
    })
    session['history'] = history
    
    # Mettre à jour le score
    effect = choice.get('effect', 'neutral')
    score = session.get('score', {'good': 0, 'bad': 0, 'neutral': 0})
    score[effect] = score.get(effect, 0) + 1
    session['score'] = score
    
    # Passer au scénario suivant
    session['scenario'] = choice.get('next', current_id)
    
    return redirect(url_for('game.play'))


@game_bp.route('/game/reset')
def reset():
    """Remet à zéro la partie"""
    session.clear()
    return redirect(url_for('game.start'))
