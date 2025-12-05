import json
from pathlib import Path


class ScenarioService:
    """Service pour charger et gérer les scénarios du jeu"""
    
    _scenarios = None
    _data_path = Path(__file__).resolve().parent.parent / 'data' / 'scenarios.json'
    
    @classmethod
    def load_scenarios(cls):
        """Charge les scénarios depuis le fichier JSON"""
        if cls._scenarios is None:
            with open(cls._data_path, 'r', encoding='utf-8') as f:
                cls._scenarios = json.load(f)
        return cls._scenarios
    
    @classmethod
    def get_scenario(cls, scenario_id: str) -> dict | None:
        """Récupère un scénario par son ID"""
        scenarios = cls.load_scenarios()
        return scenarios.get(scenario_id)
    
    @classmethod
    def get_start_scenario_id(cls) -> str:
        """Retourne l'ID du premier scénario"""
        return 'scenario_1'
    
    @classmethod
    def is_ending(cls, scenario_id: str) -> bool:
        """Vérifie si un scénario est une fin"""
        scenario = cls.get_scenario(scenario_id)
        return scenario.get('ending', False) if scenario else False
    
    @classmethod
    def reload(cls):
        """Force le rechargement des scénarios (utile en dev)"""
        cls._scenarios = None
        cls.load_scenarios()
