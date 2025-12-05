from flask import Blueprint, session, render_template, request, redirect, url_for, jsonify
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
    
    # Si c'est une fin, générer le bilan personnalisé
    if scenario.get('ending'):
        history = session.get('history', [])
        score = session.get('score', {})
        
        # Générer le bilan détaillé basé sur l'historique
        detailed_report = generate_detailed_report(history, score, scenario_id)
        
        # Injecter le bilan dans le contenu du scénario
        scenario_with_report = scenario.copy()
        scenario_with_report['detailed_report'] = detailed_report
        
        return render_template(
            'ending.html',
            scenario=scenario_with_report,
            history=history,
            score=score
        )
    
    # Sinon afficher le scénario
    return render_template(
        'scenario.html',
        scenario=scenario,
        scenario_id=scenario_id
    )


def generate_detailed_report(history, score, ending_scenario):
    """Génère un rapport détaillé basé sur l'historique des choix"""
    bad_choices = []
    good_choices = []
    neutral_choices = []
    
    # Analyser chaque choix
    for entry in history:
        effect = entry.get('effect', 'neutral')
        scenario_name = entry.get('scenario_name', '')
        choice_text = entry.get('choice_text', '')
        scenario_id = entry.get('scenario_id', '')
        
        # Récupérer les détails du scénario et du choix
        scenario_data = ScenarioService.get_scenario(scenario_id)
        if scenario_data and 'choices' in scenario_data:
            for choice in scenario_data['choices']:
                if choice.get('text') == choice_text:
                    nird_impact = choice.get('nird_impact', {})
                    
                    choice_analysis = {
                        'scenario_name': scenario_name,
                        'choice_text': choice_text,
                        'effect': effect,
                        'nird_impact': nird_impact
                    }
                    
                    if effect == 'bad':
                        bad_choices.append(choice_analysis)
                    elif effect == 'good':
                        good_choices.append(choice_analysis)
                    else:
                        neutral_choices.append(choice_analysis)
                    break
    
    return {
        'bad_choices': bad_choices,
        'good_choices': good_choices,
        'neutral_choices': neutral_choices,
        'total_choices': len(history),
        'score': score
    }


@game_bp.route('/game/choose', methods=['POST'])
def choose():
    """Traite le choix du joueur"""
    if 'scenario' not in session:
        return {'error': 'Session invalide'}, 400
    
    choice_index = int(request.form.get('choice', 0))
    current_id = session['scenario']
    scenario = ScenarioService.get_scenario(current_id)
    
    if not scenario or 'choices' not in scenario:
        return {'error': 'Scénario invalide'}, 400
    
    # Récupérer le choix
    choices = scenario['choices']
    if choice_index < 0 or choice_index >= len(choices):
        return {'error': 'Choix invalide'}, 400
    
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
    next_scenario_id = choice.get('next', current_id)
    session['scenario'] = next_scenario_id
    
    # Retourner le nouveau scénario en JSON
    next_scenario = ScenarioService.get_scenario(next_scenario_id)
    return {
        'scenario': next_scenario,
        'history': history,
        'score': score
    }


@game_bp.route('/game/reset')
def reset():
    """Remet à zéro la partie"""
    session.clear()
    return redirect(url_for('game.start'))
