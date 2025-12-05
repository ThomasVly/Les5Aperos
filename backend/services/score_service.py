import sqlite3
import os
import time
import threading
from pathlib import Path

# Chemin vers la DB - TOUJOURS local (Azure Files ne supporte pas bien SQLite)
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / 'scores.db'

# Timeout court car local
DB_TIMEOUT = 5

# Lock global pour éviter les accès concurrents
_db_lock = threading.Lock()
_db_initialized = False


def get_connection():
    """Crée une connexion SQLite"""
    return sqlite3.connect(DB_PATH, timeout=DB_TIMEOUT)


def init_db():
    """Crée la table si elle n'existe pas - thread-safe"""
    global _db_initialized
    
    if _db_initialized:
        return True
    
    with _db_lock:
        if _db_initialized:
            return True
        try:
            with get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS scores (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        pseudo TEXT NOT NULL,
                        score INTEGER NOT NULL
                    )
                ''')
                conn.commit()
            print("DB Init: Table scores prête")
            _db_initialized = True
            return True
        except Exception as e:
            print(f"Erreur DB Init: {e}")
            return False


def add_score(pseudo, score):
    """Ajoute un score dans la BDD"""
    try:
        # On tronque le pseudo pour sécurité
        clean_pseudo = pseudo[:12]

        # S'assurer que la table existe
        init_db()

        with get_connection() as conn:
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
        # S'assurer que la table existe
        init_db()

        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT pseudo, score FROM scores ORDER BY score DESC LIMIT ?', (limit,))
            results = cursor.fetchall()

        return [{'pseudo': row[0], 'score': row[1]} for row in results]
    except Exception as e:
        print(f"Erreur Get Scores: {e}")
        return []