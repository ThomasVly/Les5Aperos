// Script pour afficher l'écran de fin avec bilan NIRD détaillé
document.addEventListener('DOMContentLoaded', () => {
    console.log('Affichage de la fin du jeu...');
    
    const dialogManager = new DialogManager();
    const scenario = window.scenarioData;
    const score = window.gameScore || { good: 0, bad: 0, neutral: 0 };
    
    if (!scenario) {
        console.error('Aucune donnée de scénario trouvée');
        return;
    }
    
    console.log('Scénario de fin:', scenario);
    console.log('Score:', score);
    
    // Bouton retour au menu
    const quitBtn = document.getElementById('quit-btn');
    if (quitBtn) {
        quitBtn.addEventListener('click', () => {
            window.location.href = '/activity';
        });
    }
    
    // Créer les boutons manuellement avec redirections directes
    const screenInterface = document.querySelector('.screen-interface');
    
    // Créer un container pour les boutons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 10000; display: flex; gap: 20px;';
    
    // Bouton Recommencer
    const btnRestart = document.createElement('button');
    btnRestart.textContent = 'RECOMMENCER';
    btnRestart.style.cssText = 'padding: 15px 30px; font-family: "MultiTypePixel", monospace; font-size: 14px; background: #00ff00; color: #000; border: 2px solid #00ff00; cursor: pointer; text-shadow: 0 0 5px #00ff00;';
    btnRestart.addEventListener('click', () => {
        window.location.href = '/game/reset';
    });
    
    // Bouton Retour au menu
    const btnMenu = document.createElement('button');
    btnMenu.textContent = 'RETOUR AU MENU';
    btnMenu.style.cssText = 'padding: 15px 30px; font-family: "MultiTypePixel", monospace; font-size: 14px; background: #00ff00; color: #000; border: 2px solid #00ff00; cursor: pointer; text-shadow: 0 0 5px #00ff00;';
    btnMenu.addEventListener('click', () => {
        window.location.href = '/activity';
    });
    
    buttonContainer.appendChild(btnRestart);
    buttonContainer.appendChild(btnMenu);
    document.body.appendChild(buttonContainer);
    
    // Afficher la notification de fin avec tout le contenu du scénario
    dialogManager.showNotification({
        title: scenario.title || 'FIN DU JEU',
        icon: scenario.name.includes('good') ? '🌱' : '⚠️',
        content: scenario.content,
        choices: [],
        scenarioId: 'ending'
    });
});
