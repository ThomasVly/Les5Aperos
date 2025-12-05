// JavaScript pour la page d'activité principale
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bienvenue dans l\'activité principale des Les5Aperos !');
    
    // Ajuster la position de l'écran en fonction de la taille réelle de l'image
    const computerImage = document.querySelector('.computer-image');
    const screenInterface = document.querySelector('.screen-interface');
    
    function adjustScreenPosition() {
        if (!computerImage || !screenInterface) return;
        
        // Ne pas ajuster si on est en mode jeu
        const wrapper = computerImage.parentElement;
        if (wrapper && wrapper.classList.contains('game-mode')) return;
        
        // Obtenir les dimensions réelles affichées de l'image
        const imgRect = computerImage.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();
        
        // Dimensions affichées de l'image (après object-fit: contain)
        const naturalWidth = computerImage.naturalWidth;
        const naturalHeight = computerImage.naturalHeight;
        
        if (!naturalWidth || !naturalHeight) return; // Image pas encore chargée
        
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
        // L'image est centrée avec object-position: center
        const offsetLeft = (wrapperRect.width - displayedWidth) / 2;
        const offsetTop = (wrapperRect.height - displayedHeight) / 2;
        
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
    
    // Éléments principaux
    const computerWrapper = document.querySelector('.computer-wrapper');
    const gameMenu = document.querySelector('.game-menu');
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const quitBtn = document.getElementById('quit-btn');
    
    // Fonction pour afficher l'intro terminal
    async function showIntro() {
        const intro = document.createElement('div');
        intro.className = 'terminal-intro active';
        intro.id = 'terminal-intro';
        
        const content = document.createElement('div');
        content.className = 'terminal-content';
        intro.appendChild(content);
        screenInterface.appendChild(intro);
        
        // Charger le contenu de l'intro depuis le fichier JSON
        let lines = [];
        try {
            const response = await fetch('/frontend/data/intro.json');
            const data = await response.json();
            lines = data.lines;
        } catch (error) {
            console.error('Erreur chargement intro:', error);
            // Fallback minimal si le fichier ne charge pas
            lines = [
                '> SYSTÈME DÉMARRÉ...',
                '> Erreur de chargement des données',
                '> APPUYEZ SUR ENTRÉE POUR CONTINUER...'
            ];
        }
        
        let i = 0;
        function showLine() {
            if (i < lines.length) {
                const line = document.createElement('div');
                line.className = 'terminal-line';
                line.textContent = lines[i];
                content.appendChild(line);
                intro.scrollTop = intro.scrollHeight;
                i++;
                const delay = lines[i - 1].length > 50 ? 1200 : (lines[i - 1].length > 0 ? 600 : 300);
                setTimeout(showLine, delay);
            } else {
                const cursor = document.createElement('span');
                cursor.className = 'terminal-cursor';
                content.appendChild(cursor);
                
                const close = () => {
                    intro.remove();
                    window.location.href = '/game';
                };
                intro.addEventListener('click', close);
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') close();
                });
            }
        }
        setTimeout(showLine, 500);
    }
    
    // Passer en mode jeu
    function enterGameMode() {
        // 1. Ajouter la classe pour déclencher l'animation de zoom
        computerWrapper.classList.add('game-mode');
        gameMenu.style.display = 'none';
        
        // 2. Attendre la fin de l'animation de zoom (1.5s) avant de rediriger
        setTimeout(() => {
            window.location.href = '/game';
        }, 1500);
    }
    
    // Quitter le mode jeu
    function exitGameMode() {
        const intro = document.getElementById('terminal-intro');
        if (intro) intro.remove();
        
        computerWrapper.classList.remove('game-mode');
        gameMenu.style.display = 'flex';
        quitBtn.style.display = 'none';
        adjustScreenPosition();
    }
    
    // Gestion des boutons
    if (btnYes) {
        btnYes.addEventListener('click', function() {
            // Rediriger vers le bureau
            window.location.href = '/bureau';
        });
    }
    
    if (btnNo) {
        btnNo.addEventListener('click', () => window.location.href = '/');
    }
    
    if (quitBtn) {
        quitBtn.addEventListener('click', exitGameMode);
    }
});
