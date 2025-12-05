import os
from random import choice

# Import conditionnel d'ollama
try:
    import ollama
    OLLAMA_AVAILABLE = True
except ImportError:
    OLLAMA_AVAILABLE = False

# Vérifie si on est en mode fake
FAKE_OLLAMA = os.environ.get('FAKE_OLLAMA', 'true').lower() == 'true'

# Réponses bidons pour le mode dev
FAKE_RESPONSES = [
    "Ah oui les gâteaux ! Il faut d'abord acheter un vélo rouge, puis appeler ta grand-mère pour lui demander la météo de demain. 🎂🚲",
    "Hmm, bonne question ! Personnellement je préfère les chaussettes au chocolat. Tu as essayé de brancher ton grille-pain sur la lune ?",
    "Attends, je réfléchis... *bruit de moteur* ... Ah non j'ai oublié ce que tu as dit. C'était quoi déjà ? Un hamster ?",
    "OH OUI JE SAIS ! Euh... non en fait je sais pas. Mais as-tu pensé à arroser tes plantes aujourd'hui ? 🌱",
    "La réponse est 42. Ou peut-être 43. En tout cas c'est un nombre, je crois. Ou une lettre. Bref.",
    "*se gratte la tête virtuellement* Tu veux dire comme quand on met du dentifrice sur une pizza ? C'est délicieux ça !",
    "Je ne comprends pas ta question mais je vais répondre quand même : les pingouins ne savent pas voler mais ils sont très bons en comptabilité.",
    "Excellente question ! La réponse se trouve page 394 du manuel. Quel manuel ? Aucune idée. Bonne chance ! 📖",
]


def ollama_chat(message, option=""):
    # Mode fake pour le dev
    if FAKE_OLLAMA or not OLLAMA_AVAILABLE:
        return choice(FAKE_RESPONSES)
    
    # Mode réel avec Ollama
    messages = []

    # Ajoute l'option comme instruction système si elle existe
    if option:
        messages.append({
            'role': 'system',
            'content': f"{option}. Reste toujours maladroit et à côté de la plaque. Maximum 10 lignes."
        })

    # Ajoute le message utilisateur
    messages.append({
        'role': 'user',
        'content': message
    })

    response = ollama.chat(
        model='chatbot-maladroit',
        messages=messages,
        options={
            'temperature': 1.8,
            'top_p': 0.95,
            'top_k': 60
        }
    )

    return response['message']['content']
