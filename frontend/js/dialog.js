// Gestionnaire de boîtes de dialogue rétro
class DialogManager {
    constructor() {
        this.container = null;
        this.currentDialog = null;
        this.callbacks = {};
        this.init();
    }

    init() {
        // Créer le container principal s'il n'existe pas
        if (!document.querySelector('.dialog-container')) {
            this.container = document.createElement('div');
            this.container.className = 'dialog-container';
            
            // Ajouter au screen-interface
            const screenInterface = document.querySelector('.screen-interface');
            if (screenInterface) {
                screenInterface.appendChild(this.container);
            } else {
                console.warn('screen-interface non trouvé, ajout au body');
                document.body.appendChild(this.container);
            }
        } else {
            this.container = document.querySelector('.dialog-container');
        }
        console.log('DialogManager initialisé', this.container);
    }

    // Créer une boîte de mail
    showMail(data) {
        console.log('showMail appelé avec data:', data);
        
        try {
            const dialog = this.createDialogBox(data.title);
            
            const mailHeader = document.createElement('div');
            mailHeader.className = 'mail-header';
            mailHeader.innerHTML = `
                <div class="mail-from"><strong>De:</strong> ${data.from}</div>
                <div class="mail-subject"><strong>Objet:</strong> ${data.subject}</div>
            `;
            
            const mailContent = document.createElement('div');
            mailContent.className = 'mail-content';
            mailContent.textContent = data.content;
            
            const body = dialog.querySelector('.dialog-body');
            body.appendChild(mailHeader);
            body.appendChild(mailContent);
            
            // Ajouter les boutons de choix
            if (data.choices && data.choices.length > 0) {
                const footer = this.createFooter(data.choices, data.scenarioId);
                dialog.appendChild(footer);
            }
            
            console.log('Dialogue mail créé, appel de show()');
            this.show(dialog);
            return dialog;
        } catch(error) {
            console.error('Erreur dans showMail:', error);
            throw error;
        }
    }

    // Créer une boîte de dialogue avec choix multiples
    showChoice(data) {
        const dialog = this.createDialogBox(data.title);
        
        const content = document.createElement('div');
        content.className = 'narrative-content';
        content.textContent = data.content;
        
        const body = dialog.querySelector('.dialog-body');
        body.appendChild(content);
        
        // Ajouter les boutons de choix
        if (data.choices && data.choices.length > 0) {
            const footer = this.createFooter(data.choices, data.scenarioId);
            dialog.appendChild(footer);
        }
        
        this.show(dialog);
        return dialog;
    }

    // Créer une boîte de dialogue narrative (description)
    showNarrative(data) {
        const dialog = this.createDialogBox(data.title);
        
        const content = document.createElement('div');
        content.className = 'narrative-content';
        
        // Si le contenu est un tableau de paragraphes
        if (Array.isArray(data.content)) {
            data.content.forEach(paragraph => {
                const p = document.createElement('p');
                p.textContent = paragraph;
                content.appendChild(p);
            });
        } else {
            content.textContent = data.content;
        }
        
        const body = dialog.querySelector('.dialog-body');
        body.appendChild(content);
        
        // Bouton pour continuer
        const footer = this.createFooter([{
            text: 'Continuer',
            action: 'continue'
        }], data.scenarioId);
        dialog.appendChild(footer);
        
        this.show(dialog);
        return dialog;
    }

    // Créer une notification
    showNotification(data) {
        const dialog = this.createDialogBox(data.title);
        
        const icon = document.createElement('div');
        icon.className = 'notification-icon';
        icon.textContent = data.icon || '⚠️';
        
        const text = document.createElement('div');
        text.className = 'notification-text';
        text.textContent = data.content;
        
        const body = dialog.querySelector('.dialog-body');
        body.appendChild(icon);
        body.appendChild(text);
        
        // Bouton OK
        const footer = this.createFooter([{
            text: 'OK',
            action: 'close'
        }], data.scenarioId);
        dialog.appendChild(footer);
        
        this.show(dialog);
        return dialog;
    }

    // Créer une boîte de chat
    showChat(data) {
        const dialog = this.createDialogBox(data.title);
        
        const body = dialog.querySelector('.dialog-body');
        
        // Ajouter les messages
        if (data.messages && data.messages.length > 0) {
            data.messages.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'chat-message';
                messageDiv.innerHTML = `
                    <div class="chat-sender">${msg.sender}</div>
                    <div class="chat-text">${msg.text}</div>
                `;
                body.appendChild(messageDiv);
            });
        }
        
        // Ajouter les boutons de réponse
        if (data.choices && data.choices.length > 0) {
            const footer = this.createFooter(data.choices, data.scenarioId);
            dialog.appendChild(footer);
        }
        
        this.show(dialog);
        return dialog;
    }

    // Créer la structure de base d'une boîte de dialogue
    createDialogBox(title) {
        const dialog = document.createElement('div');
        dialog.className = 'dialog-box';
        
        const header = document.createElement('div');
        header.className = 'dialog-header';
        header.innerHTML = `
            <div class="dialog-title">${title}</div>
            <button class="dialog-close">×</button>
        `;
        
        const body = document.createElement('div');
        body.className = 'dialog-body';
        
        dialog.appendChild(header);
        dialog.appendChild(body);
        
        // Gérer la fermeture
        header.querySelector('.dialog-close').addEventListener('click', () => {
            this.close();
        });
        
        return dialog;
    }

    // Créer le pied de page avec boutons
    createFooter(choices, scenarioId) {
        const footer = document.createElement('div');
        footer.className = 'dialog-footer';
        
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'dialog-btn';
            btn.textContent = choice.text;
            btn.dataset.action = choice.action;
            btn.dataset.nextScenario = choice.nextScenario || '';
            
            btn.addEventListener('click', () => {
                this.handleChoice(choice, scenarioId);
            });
            
            footer.appendChild(btn);
        });
        
        return footer;
    }

    // Gérer un choix
    handleChoice(choice, scenarioId) {
        console.log('handleChoice appelé:', choice.action, 'Callbacks disponibles:', Object.keys(this.callbacks));
        
        // Callback personnalisé
        if (this.callbacks[choice.action]) {
            console.log('Exécution du callback pour:', choice.action);
            this.callbacks[choice.action](choice, scenarioId);
        } else {
            console.warn('Aucun callback trouvé pour:', choice.action);
        }
        
        // Actions par défaut
        if (choice.action === 'close') {
            this.close();
        } else if (choice.action === 'continue') {
            this.close();
        } else if (choice.nextScenario) {
            // Transition vers le scénario suivant
            this.close(() => {
                if (this.callbacks.nextScenario) {
                    this.callbacks.nextScenario(choice.nextScenario, choice);
                }
            });
        }
        
        // Stocker le choix pour le suivi du jeu
        this.saveChoice(scenarioId, choice);
    }

    // Sauvegarder un choix
    saveChoice(scenarioId, choice) {
        const choices = JSON.parse(localStorage.getItem('gameChoices') || '{}');
        choices[scenarioId] = {
            action: choice.action,
            text: choice.text,
            timestamp: new Date().toISOString(),
            nextScenario: choice.nextScenario
        };
        localStorage.setItem('gameChoices', JSON.stringify(choices));
    }

    // Récupérer l'historique des choix
    getChoices() {
        return JSON.parse(localStorage.getItem('gameChoices') || '{}');
    }

    // Afficher la boîte de dialogue
    show(dialog) {
        console.log('Tentative d\'affichage du dialogue', dialog);
        
        if (!this.container) {
            console.error('Container non initialisé, réinitialisation...');
            this.init();
        }
        
        if (!this.container) {
            console.error('Impossible de créer le container !');
            return;
        }
        
        if (this.currentDialog) {
            this.container.removeChild(this.currentDialog);
        }
        
        this.container.innerHTML = '';
        this.container.appendChild(dialog);
        this.container.classList.add('active');
        this.currentDialog = dialog;
        
        console.log('Dialogue affiché avec succès', this.container);
        
        // Animation d'apparition
        dialog.style.animation = 'dialog-appear 0.3s ease-out';
    }

    // Fermer la boîte de dialogue
    close(callback) {
        if (!this.currentDialog) return;
        
        // Animation de fermeture
        this.currentDialog.classList.add('fade-out');
        
        setTimeout(() => {
            this.container.classList.remove('active');
            if (this.currentDialog) {
                this.container.innerHTML = '';
                this.currentDialog = null;
            }
            
            if (callback) callback();
        }, 300);
    }
    
    // Fermer tous les dialogues
    closeAll() {
        if (this.container) {
            this.container.classList.remove('active');
            this.container.innerHTML = '';
            this.currentDialog = null;
        }
    }

    // Enregistrer un callback
    on(event, callback) {
        this.callbacks[event] = callback;
    }

    // Réinitialiser le jeu
    resetGame() {
        localStorage.removeItem('gameChoices');
        this.close();
    }
}

// Export pour utilisation globale
window.DialogManager = DialogManager;
