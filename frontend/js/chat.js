const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Fonction pour afficher le texte caractère par caractère
function typeWriter(element, text, speed = 30) {
    let i = 0;
    element.textContent = '';

    return new Promise((resolve) => {
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                chatMessages.scrollTop = chatMessages.scrollHeight;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

// Fonction pour ajouter un message
async function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    const prefix = document.createElement('span');
    prefix.className = 'message-prefix';
    prefix.textContent = isUser ? '> YOU:' : '> BOT:';

    const content = document.createElement('p');

    messageDiv.appendChild(prefix);
    messageDiv.appendChild(content);
    chatMessages.appendChild(messageDiv);

    // Scroll automatique vers le bas
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Si c'est un message du bot, affiche avec effet typing
    if (!isUser) {
        await typeWriter(content, text, 30); // 30ms entre chaque caractère
    } else {
        content.textContent = text;
    }
}

// Fonction pour afficher l'indicateur de typing
function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing';
    typingDiv.id = 'typing-indicator';

    const prefix = document.createElement('span');
    prefix.className = 'message-prefix';
    prefix.textContent = '> BOT:';

    const content = document.createElement('p');
    content.textContent = 'En train de réfléchir';

    typingDiv.appendChild(prefix);
    typingDiv.appendChild(content);
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

// Envoyer un message
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Affiche le message utilisateur
    await addMessage(message, true);
    userInput.value = '';
    sendBtn.disabled = true;
    userInput.disabled = true;

    // Affiche l'indicateur de typing
    showTyping();

    try {
        // Appel à ton API Flask
        const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        // Retire l'indicateur et affiche la réponse avec effet typing
        removeTyping();
        await addMessage(data.response, false);

    } catch (error) {
        removeTyping();
        await addMessage('Oups ! Une erreur est survenue... 💀', false);
        console.error('Error:', error);
    }

    sendBtn.disabled = false;
    userInput.disabled = false;
    userInput.focus();
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Calcul responsive de la taille de base
function updateFontSize() {
    const screenWidth = document.querySelector('.screen-interface').offsetWidth;
    document.documentElement.style.setProperty('--base-font', `${screenWidth}px`);
}

window.addEventListener('resize', updateFontSize);
window.addEventListener('load', updateFontSize);
