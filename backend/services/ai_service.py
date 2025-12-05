"""
Service AI abstrait pour le chatbot.
- Production: Azure OpenAI (GPT-3.5-turbo avec limite budget)
- Développement: Ollama local ou réponses fake

Budget: ~20€/mois = ~12.5M tokens/mois
Limite par défaut: 150 tokens max par réponse
"""
import os
from random import choice

# Configuration
IS_PRODUCTION = os.environ.get('FLASK_ENV', 'development') == 'production'

# Import conditionnel Azure OpenAI
AZURE_OPENAI_AVAILABLE = False
if IS_PRODUCTION:
    try:
        from openai import AzureOpenAI
        AZURE_OPENAI_AVAILABLE = True
    except ImportError:
        print("Warning: openai package not installed")

# Import conditionnel Ollama
OLLAMA_AVAILABLE = False
try:
    import ollama
    OLLAMA_AVAILABLE = True
except ImportError:
    pass

# Mode fake pour dev sans Ollama
FAKE_OLLAMA = os.environ.get('FAKE_OLLAMA', 'true').lower() == 'true'

# Réponses fake pour le mode dev
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

# Prompt système pour le chatbot maladroit
SYSTEM_PROMPT = """Tu es un chatbot maladroit et à côté de la plaque. 
Tu réponds toujours de manière décalée, avec des associations d'idées absurdes.
Tu fais parfois des digressions sur des sujets complètement hors-sujet.
Tu es sympathique mais pas très utile. Maximum 10 lignes."""


class AIService:
    """Service AI abstrait pour le chatbot"""
    
    def __init__(self):
        self.is_production = IS_PRODUCTION and AZURE_OPENAI_AVAILABLE
        
        if self.is_production:
            endpoint = os.environ.get('AZURE_OPENAI_ENDPOINT')
            api_key = os.environ.get('AZURE_OPENAI_API_KEY')
            
            if not endpoint or not api_key:
                raise ValueError("AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY are required in production")
            
            self.client = AzureOpenAI(
                azure_endpoint=endpoint,
                api_key=api_key,
                api_version="2024-02-01"
            )
            
            self.deployment_name = os.environ.get('AZURE_OPENAI_DEPLOYMENT_NAME', 'gpt-4o-mini')
            
            # Limite de tokens pour le budget (20€/mois)
            # GPT-3.5-turbo: ~$0.002/1K tokens output
            # 20€ ≈ $22 → ~11M tokens output/mois
            # Avec marge de sécurité: 150 tokens max par réponse
            self.max_tokens = int(os.environ.get('AZURE_OPENAI_MAX_TOKENS', '150'))
            
        self.use_ollama = not IS_PRODUCTION and OLLAMA_AVAILABLE and not FAKE_OLLAMA
    
    def chat(self, message: str, option: str = "") -> str:
        """
        Génère une réponse du chatbot.
        
        Args:
            message: Message de l'utilisateur
            option: Option de variation (ex: "Répond en anglais")
            
        Returns:
            Réponse du chatbot
        """
        if self.is_production:
            return self._azure_openai_chat(message, option)
        elif self.use_ollama:
            return self._ollama_chat(message, option)
        else:
            return self._fake_chat()
    
    def _azure_openai_chat(self, message: str, option: str = "") -> str:
        """Chat via Azure OpenAI (production)"""
        try:
            system_content = SYSTEM_PROMPT
            if option:
                system_content = f"{option}. {SYSTEM_PROMPT}"
            
            response = self.client.chat.completions.create(
                model=self.deployment_name,
                messages=[
                    {"role": "system", "content": system_content},
                    {"role": "user", "content": message}
                ],
                max_tokens=self.max_tokens,
                temperature=1.5,  # Haute température pour des réponses créatives/maladroites
                top_p=0.95
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Azure OpenAI error: {e}")
            # Fallback sur réponse fake en cas d'erreur
            return choice(FAKE_RESPONSES)
    
    def _ollama_chat(self, message: str, option: str = "") -> str:
        """Chat via Ollama local (dev)"""
        try:
            messages = []
            
            system_content = SYSTEM_PROMPT
            if option:
                system_content = f"{option}. {SYSTEM_PROMPT}"
            
            messages.append({
                'role': 'system',
                'content': system_content
            })
            
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
            
        except Exception as e:
            print(f"Ollama error: {e}")
            return choice(FAKE_RESPONSES)
    
    def _fake_chat(self) -> str:
        """Réponse fake pour dev sans backend AI"""
        return choice(FAKE_RESPONSES)
    
    def get_usage_info(self) -> dict:
        """Retourne les infos d'utilisation (pour monitoring)"""
        return {
            'mode': 'azure_openai' if self.is_production else ('ollama' if self.use_ollama else 'fake'),
            'max_tokens': self.max_tokens if self.is_production else None,
            'model': self.deployment_name if self.is_production else 'chatbot-maladroit'
        }


# Instance singleton
ai_service = AIService()
