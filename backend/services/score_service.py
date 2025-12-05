import sqlite3
from pathlib import Path

# Chemin vers la DB (à la racine de backend)
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / 'scores.db'


def init_db():
    """Crée la table si elle n'existe pas"""
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                           CREATE TABLE IF NOT EXISTS scores
                           (
                               id
                               INTEGER
                               PRIMARY
                               KEY
                               AUTOINCREMENT,
                               pseudo
                               TEXT
                               NOT
                               NULL,
                               score
                               INTEGER
                               NOT
                               NULL
                           )
                           ''')
            conn.commit()
    except Exception as e:
        print(f"Erreur DB Init: {e}")


def add_score(pseudo, score):
    """Ajoute un score dans la BDD"""
    try:
        # On tronque le pseudo pour sécurité
        clean_pseudo = pseudo[:12]

        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute('INSERT INTO scores (pseudo, score) VALUES (?, ?)', (clean_pseudo, score))
            conn.commit()
        return True
    except Exception as e:
        print(f"Erreur Add Score: {e}")
        return False


def get_top_scores(limit=10):
    """Récupère le top 10"""
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT pseudo, score FROM scores ORDER BY score DESC LIMIT ?', (limit,))
            results = cursor.fetchall()

        return [{'pseudo': row[0], 'score': row[1]} for row in results]
    except Exception as e:
        print(f"Erreur Get Scores: {e}")
        return []