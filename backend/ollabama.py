import ollama


def ollama_chat(message, option=""):
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
