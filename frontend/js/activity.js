// JavaScript pour la page d'activité principale
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bienvenue dans l\'activité principale des Les5Aperos !');
    
    // Sélection des éléments principaux
    const computerImage = document.querySelector('.computer-image');
    const screenInterface = document.querySelector('.screen-interface');
    const computerWrapper = document.querySelector('.computer-wrapper');
    const gameMenu = document.querySelector('.game-menu');
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    
    function adjustScreenPosition() {
        if (!computerImage || !screenInterface) return;
        
        // Obtenir les dimensions réelles affichées de l'image
        const imgRect = computerImage.getBoundingClientRect();
        const wrapperRect = computerImage.parentElement.getBoundingClientRect();
        
        // Dimensions affichées de l'image (après object-fit: contain)
        const naturalWidth = computerImage.naturalWidth;
        const naturalHeight = computerImage.naturalHeight;
        const naturalRatio = naturalWidth / naturalHeight;
        
        // Calculer les dimensions réelles de l'image visible
        let displayedWidth, displayedHeight;
        const containerRatio = wrapperRect.width / wrapperRect.height;
        
        if (containerRatio > naturalRatio) {
            // Contrainte par la hauteur
            displayedHeight = wrapperRect.height;
            displayedWidth = displayedHeight * naturalRatio;
        } else {
            // Contrainte par la largeur
            displayedWidth = wrapperRect.width;
            displayedHeight = displayedWidth / naturalRatio;
        }
        
        // Calculer le décalage de l'image dans le wrapper
        // L'image est centrée horizontalement et alignée en bas (object-position: bottom)
        const offsetLeft = (wrapperRect.width - displayedWidth) / 2;
        const offsetTop = wrapperRect.height - displayedHeight; // Aligné en bas
        
        // Pourcentages de positionnement de l'écran sur l'image originale
        const screenTopPercent = 8.5 / 100;
        const screenLeftPercent = 16.8 / 100;
        const screenWidthPercent = 66.4 / 100;
        const screenHeightPercent = 59.5 / 100;
        
        // Calculer la position et taille en pixels
        const screenTop = offsetTop + (displayedHeight * screenTopPercent);
        const screenLeft = offsetLeft + (displayedWidth * screenLeftPercent);
        const screenWidth = displayedWidth * screenWidthPercent;
        const screenHeight = displayedHeight * screenHeightPercent;
        
        // Appliquer les styles
        screenInterface.style.top = screenTop + 'px';
        screenInterface.style.left = screenLeft + 'px';
        screenInterface.style.width = screenWidth + 'px';
        screenInterface.style.height = screenHeight + 'px';
        
        // Ajuster la taille des polices en fonction de la taille de l'écran
        const baseFontSize = Math.min(screenWidth, screenHeight);
        screenInterface.style.setProperty('--screen-width', screenWidth + 'px');
        screenInterface.style.setProperty('--screen-height', screenHeight + 'px');
        screenInterface.style.setProperty('--base-font', baseFontSize + 'px');
    }
    
    // Attendre que l'image soit chargée
    if (computerImage.complete) {
        adjustScreenPosition();
    } else {
        computerImage.addEventListener('load', adjustScreenPosition);
    }
    
    // Réajuster lors du redimensionnement de la fenêtre
    window.addEventListener('resize', adjustScreenPosition);

    // Initialiser le gestionnaire de dialogues
    const dialogManager = new DialogManager();
    
    // Fonction pour passer en plein écran
    function enterFullscreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }
    
    // Fonction pour afficher l'introduction type terminal
    function showIntroduction() {
        // Créer le container d'intro dans le screen-interface
        const terminalIntro = document.createElement('div');
        terminalIntro.className = 'terminal-intro active';
        terminalIntro.id = 'terminal-intro';
        
        const terminalContent = document.createElement('div');
        terminalContent.className = 'terminal-content';
        terminalIntro.appendChild(terminalContent);
        
        screenInterface.appendChild(terminalIntro);
        
        // Texte à afficher ligne par ligne
        const lines = [
            '> SYSTÈME DÉMARRÉ...',
            '> CHARGEMENT DU PROFIL UTILISATEUR...',
            '',
            '> BIENVENUE, ARNAUD PSOLESCENCE',
            '> PROVISEUR - INSA HAUTS DE FRANCE',
            '',
            '> ALERTE: NOUVEAU MESSAGE SYSTÈME',
            '> ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            '',
            'Vous êtes proviseur de l\'INSA Hauts de France,',
            'école de grande renommée nationale.',
            '',
            'Dans un contexte de dépendance numérique aux',
            'grandes sociétés et d\'obsolescence programmée,',
            'vous serez confronté à des décisions capitales',
            'pour l\'avenir de votre établissement.',
            '',
            'Au cours de cette journée spéciale, vos choix',
            'affecteront les aspects économiques, sociaux,',
            'culturels et la confidentialité de l\'école,',
            'des enseignants, des étudiants et de vous-même.',
            '',
            '> ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            '',
            '⚠️  FAITES LES BONS CHOIX ⚠️',
            '',
            '> APPUYEZ SUR ENTRÉE POUR CONTINUER...'
        ];
        
        let lineIndex = 0;
        let currentLineElement = null;
        
        function typeLine() {
            if (lineIndex < lines.length) {
                const lineText = lines[lineIndex];
                
                // Créer une nouvelle ligne si nécessaire
                if (!currentLineElement) {
                    currentLineElement = document.createElement('div');
                    currentLineElement.className = 'terminal-line';
                    currentLineElement.style.opacity = '1';
                    terminalContent.appendChild(currentLineElement);
                }
                
                // Ajouter le texte de la ligne complète (pas caractère par caractère)
                currentLineElement.textContent = lineText;
                
                // Faire défiler vers le bas
                terminalIntro.scrollTop = terminalIntro.scrollHeight;
                
                // Passer à la ligne suivante
                lineIndex++;
                currentLineElement = null;
                
                // Délai entre les lignes (vitesse de lecture humaine)
                // Lignes courtes : 600ms, lignes longues : 1200ms
                const delay = lineText.length > 50 ? 1200 : (lineText.length > 0 ? 600 : 300);
                setTimeout(typeLine, delay);
            } else {
                // Animation terminée - ajouter curseur à la fin
                const cursor = document.createElement('span');
                cursor.className = 'terminal-cursor';
                cursor.style.display = 'inline-block';
                terminalContent.appendChild(cursor);
                
                console.log('Introduction terminée');
                
                // Permettre de fermer en cliquant ou en appuyant sur Entrée
                const closeIntro = function() {
                    terminalIntro.classList.remove('active');
                    setTimeout(() => {
                        terminalIntro.remove();
                        console.log('Le jeu peut commencer !');
                    }, 300);
                };
                
                terminalIntro.addEventListener('click', closeIntro);
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                        closeIntro();
                    }
                });
            }
        }
        
        // Démarrer l'animation après un court délai
        setTimeout(typeLine, 500);
    }
    
    // Fonction pour passer en mode plein écran
    function enterGameMode() {
        console.log('enterGameMode appelé');
        
        // Masquer le menu
        if (gameMenu) {
            gameMenu.style.display = 'none';
        }
        
        // Masquer l'image de l'ordinateur mais garder le wrapper
        const computerImage = document.querySelector('.computer-image');
        if (computerImage) {
            computerImage.style.display = 'none';
        }
        
        // Agrandir le wrapper à plein écran
        if (computerWrapper) {
            computerWrapper.style.width = '100vw';
            computerWrapper.style.height = '100vh';
            computerWrapper.style.position = 'fixed';
            computerWrapper.style.top = '0';
            computerWrapper.style.left = '0';
            computerWrapper.style.zIndex = '1000';
        }
        
        // Mettre le screen-interface en plein écran
        if (screenInterface) {
            screenInterface.style.position = 'absolute';
            screenInterface.style.top = '0';
            screenInterface.style.left = '0';
            screenInterface.style.width = '100%';
            screenInterface.style.height = '100%';
            screenInterface.style.background = '#000';
        }
        
        // Afficher le bouton quitter
        const quitBtn = document.getElementById('quit-btn');
        if (quitBtn) {
            quitBtn.style.display = 'block';
        }
        
        console.log('Mode jeu activé - plein écran');
    }
    
    // Fonction pour quitter le mode jeu et revenir au menu
    function exitGameMode() {
        console.log('exitGameMode appelé');
        
        // Fermer tous les dialogues
        dialogManager.closeAll();
        
        // Masquer l'intro terminal si elle existe
        const terminalIntro = document.getElementById('terminal-intro');
        if (terminalIntro) {
            terminalIntro.remove();
        }
        
        // Réafficher l'image de l'ordinateur
        const computerImage = document.querySelector('.computer-image');
        if (computerImage) {
            computerImage.style.display = 'block';
        }
        
        // Réinitialiser le wrapper
        if (computerWrapper) {
            computerWrapper.style.width = '95vw';
            computerWrapper.style.height = '95vh';
            computerWrapper.style.position = 'relative';
            computerWrapper.style.top = '';
            computerWrapper.style.left = '';
            computerWrapper.style.zIndex = '';
        }
        
        // Réinitialiser le screen-interface
        if (screenInterface) {
            screenInterface.style.position = 'absolute';
            screenInterface.style.background = 'rgba(0, 0, 0, 0.95)';
            screenInterface.style.zIndex = '10';
            screenInterface.style.top = '';
            screenInterface.style.left = '';
            screenInterface.style.width = '';
            screenInterface.style.height = '';
        }
        
        // Réafficher le menu
        if (gameMenu) {
            gameMenu.style.display = 'flex';
        }
        
        // Masquer le bouton quitter
        const quitBtn = document.getElementById('quit-btn');
        if (quitBtn) {
            quitBtn.style.display = 'none';
        }
        
        // Réajuster la position de l'écran
        adjustScreenPosition();
        
        console.log('Retour au menu principal');
    }
    
    // Callback pour démarrer le jeu après l'intro
    dialogManager.on('start_game', function() {
        // Ici, votre collègue pourra ajouter la logique pour démarrer les scénarios
        console.log('Le jeu commence !');
        // Exemple : loadScenario('scenario1');
    });
    
    // Fonction pour afficher le menu
    function hideMenu() {
        if (gameMenu) {
            gameMenu.style.display = 'none';
        }
    }
    
    // Démarrer le jeu
    if (btnYes) {
        btnYes.addEventListener('click', function() {
            console.log('YES cliqué');
            enterGameMode();
            showIntroduction();
        });
    }
    
    // Bouton Non
    if (btnNo) {
        btnNo.addEventListener('click', function() {
            dialogManager.showNotification({
                title: 'AU REVOIR',
                icon: '👋',
                content: 'Peut-être une prochaine fois !',
                choices: [{
                    text: 'OK',
                    action: 'close'
                }],
                scenarioId: 'exit'
            });
        });
    }

    // ===== PANNEAU DE DEBUG =====
    const debugToggle = document.getElementById('debug-toggle');
    const debugPanel = document.getElementById('debug-panel');
    
    if (debugToggle) {
        debugToggle.addEventListener('click', function() {
            debugPanel.classList.toggle('active');
        });
    }
    
    // Bouton debug intro
    const debugIntro = document.getElementById('debug-intro');
    if (debugIntro) {
        debugIntro.addEventListener('click', function() {
            enterGameMode();
            showIntroduction();
        });
    }
    
    // Bouton debug mail
    const debugMail = document.getElementById('debug-mail');
    if (debugMail) {
        debugMail.addEventListener('click', function() {
            console.log('Debug mail cliqué');
            enterGameMode();
            
            dialogManager.showMail({
                title: "MAIL REÇU [DEBUG]",
                from: "test@lycee.fr",
                subject: "Ceci est un test de mail",
                content: "Bonjour Monsieur le Proviseur,\n\nCeci est un mail de test avec du contenu formaté.\n\nLes boîtes de dialogue fonctionnent correctement !\n\nCordialement,\nL'équipe technique",
                choices: [
                    { text: "Répondre", action: "reply" },
                    { text: "Ignorer", action: "close" }
                ],
                scenarioId: "debug_mail"
            });
        });
    }
    
    // Bouton debug choix
    const debugChoice = document.getElementById('debug-choice');
    if (debugChoice) {
        debugChoice.addEventListener('click', function() {
            enterGameMode();
            dialogManager.showChoice({
                title: "DÉCISION [DEBUG]",
                content: "Vous devez faire un choix important pour le lycée. Quelle option choisissez-vous ?",
                choices: [
                    { text: "Option A", action: "choice_a" },
                    { text: "Option B", action: "choice_b" },
                    { text: "Option C", action: "choice_c" }
                ],
                scenarioId: "debug_choice"
            });
        });
    }
    
    // Bouton debug narratif
    const debugNarrative = document.getElementById('debug-narrative');
    if (debugNarrative) {
        debugNarrative.addEventListener('click', function() {
            enterGameMode();
            dialogManager.showNarrative({
                title: "HISTOIRE [DEBUG]",
                content: [
                    "Il était une fois, dans un lycée numérique...",
                    "Les ordinateurs étaient vieux, mais pleins d'histoires à raconter.",
                    "Aujourd'hui commence une nouvelle aventure dans le monde de l'obsolescence programmée."
                ],
                choices: [
                    { text: "Continuer", action: "continue" }
                ],
                scenarioId: "debug_narrative"
            });
        });
    }
    
    // Bouton debug notification
    const debugNotification = document.getElementById('debug-notification');
    if (debugNotification) {
        debugNotification.addEventListener('click', function() {
            enterGameMode();
            dialogManager.showNotification({
                title: "ALERTE [DEBUG]",
                icon: "⚠️",
                content: "Ceci est une notification système de test. Tout fonctionne correctement !",
                choices: [
                    { text: "OK", action: "close" }
                ],
                scenarioId: "debug_notification"
            });
        });
    }
    
    // Bouton debug chat
    const debugChat = document.getElementById('debug-chat');
    if (debugChat) {
        debugChat.addEventListener('click', function() {
            enterGameMode();
            dialogManager.showChat({
                title: "CHAT INTERNE [DEBUG]",
                messages: [
                    { sender: "Technicien", text: "Bonjour, j'ai un problème avec le serveur !" },
                    { sender: "Vous", text: "Quel est le problème exactement ?" },
                    { sender: "Technicien", text: "Il fait des bruits bizarres et sent le brûlé... 🔥" },
                    { sender: "Vous", text: "Éteignez-le immédiatement !" }
                ],
                choices: [
                    { text: "Appeler les pompiers", action: "emergency" },
                    { text: "Fermer", action: "close" }
                ],
                scenarioId: "debug_chat"
            });
        });
    }
    
    // Bouton Quitter
    const quitBtn = document.getElementById('quit-btn');
    if (quitBtn) {
        quitBtn.addEventListener('click', function() {
            console.log('Bouton Quitter cliqué');
            exitGameMode();
        });
    }
    
    // Bouton quitter / retour menu
    const debugQuit = document.getElementById('debug-quit');
    if (debugQuit) {
        debugQuit.addEventListener('click', function() {
            // Fermer tous les dialogues
            dialogManager.close();
            
            // Fermer l'intro Star Wars si active
            const intro = document.getElementById('star-wars-intro');
            if (intro) {
                intro.classList.remove('active');
            }
            
            // Réafficher l'ordinateur et le fond
            if (computerSection) {
                computerSection.style.display = 'flex';
            }
            if (backgroundGifContainer) {
                backgroundGifContainer.style.display = 'block';
            }
            if (overlay) {
                overlay.style.display = 'block';
            }
            
            // Remettre le fond d'origine
            document.body.style.background = '';
            
            // Réinitialiser le screen-interface
            if (screenInterface) {
                screenInterface.style.position = 'absolute';
                screenInterface.style.display = 'flex';
                // Recalculer la position
                adjustScreenPosition();
            }
            
            // Réafficher le menu
            if (gameMenu) {
                gameMenu.style.display = 'block';
            }
            
            console.log('Retour au menu principal');
        });
    }
});
