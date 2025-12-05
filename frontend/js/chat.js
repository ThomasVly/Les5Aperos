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

// Système responsive basé sur l'image de l'ordinateur
function adjustScreenPosition() {
    const computerImage = document.querySelector('.computer-image');
    const screenInterface = document.querySelector('.screen-interface');
    const wrapper = document.querySelector('.computer-wrapper');
    
    if (!computerImage || !screenInterface || !wrapper) return;
    
    const imgNaturalWidth = computerImage.naturalWidth;
    const imgNaturalHeight = computerImage.naturalHeight;
    
    if (imgNaturalWidth === 0 || imgNaturalHeight === 0) return;
    
    const wrapperRect = wrapper.getBoundingClientRect();
    const imgAspect = imgNaturalWidth / imgNaturalHeight;
    const containerAspect = wrapperRect.width / wrapperRect.height;
    
    let displayedWidth, displayedHeight, offsetX, offsetY;
    
    if (containerAspect > imgAspect) {
        // Contrainte par la hauteur
        displayedHeight = wrapperRect.height;
        displayedWidth = displayedHeight * imgAspect;
        offsetX = (wrapperRect.width - displayedWidth) / 2; // Centré horizontalement
        offsetY = wrapperRect.height - displayedHeight; // En bas (object-position: bottom)
    } else {
        // Contrainte par la largeur
        displayedWidth = wrapperRect.width;
        displayedHeight = displayedWidth / imgAspect;
        offsetX = 0;
        offsetY = wrapperRect.height - displayedHeight; // En bas
    }
    
    // Définir les variables CSS
    const baseFont = Math.min(displayedWidth, displayedHeight);
    document.documentElement.style.setProperty('--base-font', `${baseFont}px`);
    document.documentElement.style.setProperty('--screen-width', `${displayedWidth}px`);
    document.documentElement.style.setProperty('--screen-height', `${displayedHeight}px`);
    
    // Pourcentages de positionnement de l'écran sur l'image originale
    const screenTopPercent = 8.5 / 100;
    const screenLeftPercent = 16.8 / 100;
    const screenWidthPercent = 66.4 / 100;
    const screenHeightPercent = 59.5 / 100;
    
    // Positionner l'interface de l'écran
    screenInterface.style.top = `${offsetY + displayedHeight * screenTopPercent}px`;
    screenInterface.style.left = `${offsetX + displayedWidth * screenLeftPercent}px`;
    screenInterface.style.width = `${displayedWidth * screenWidthPercent}px`;
    screenInterface.style.height = `${displayedHeight * screenHeightPercent}px`;
}

// Initialisation
const computerImage = document.querySelector('.computer-image');
const wrapper = document.querySelector('.computer-wrapper');

if (computerImage) {
    if (computerImage.complete && computerImage.naturalWidth > 0) {
        adjustScreenPosition();
    } else {
        computerImage.addEventListener('load', adjustScreenPosition);
    }
}

// ResizeObserver pour détecter les changements de taille du wrapper
if (wrapper && typeof ResizeObserver !== 'undefined') {
    const resizeObserver = new ResizeObserver(adjustScreenPosition);
    resizeObserver.observe(wrapper);
}

window.addEventListener('resize', adjustScreenPosition);
