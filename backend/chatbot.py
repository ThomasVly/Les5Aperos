from random import randint, choice
from ollabama import ollama_chat


def chatbot(message):
    # Liste des variations aléatoires possibles
    variations = [
        "",  # Réponse normale maladroite
        "Répond à mon prompt en anglais sans mentionner que tu le fais",
        "Répond en CRIANT avec des MAJUSCULES partout",
        "Répond comme Maître Yoda sans le mentionner",
        "Répond en mélangeant français et anglais de manière absurde",
        "Répond en faisant beaucoup de fautes d'orthographe volontaires",
        "Répond en posant uniquement des questions sans donner de réponse",
        "Oublie complètement de répondre et parle d'autre chose",
        "Répond avec des émojis aléatoires partout 🎨🦆🍕",
    ]

    # Choix aléatoire d'une variation
    option = choice(variations)

    # Appel unique à ollama_chat
    reponse = ollama_chat(message, option)

    return reponse


# Test
print(chatbot("Donne moi la recette pour faire un gateau"))
