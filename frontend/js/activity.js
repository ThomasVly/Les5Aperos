// JavaScript pour la page d'activité principale
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bienvenue dans l\'activité principale des Les5Aperos !');
    
    // Ajuster la position de l'écran en fonction de la taille réelle de l'image
    const computerImage = document.querySelector('.computer-image');
    const screenInterface = document.querySelector('.screen-interface');
    
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
    
    // Gestion des boutons du menu
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    
    if (btnYes) {
        btnYes.addEventListener('click', function() {
            // Rediriger vers le jeu
            window.location.href = '/game';
        });
    }
    
    if (btnNo) {
        btnNo.addEventListener('click', function() {
            // Retourner à l'accueil
            window.location.href = '/';
        });
    }
});
