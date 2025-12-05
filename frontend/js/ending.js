// Fonctions utilitaires pour créer l'interface de rapport
function createReportInterface(scenario, report, score) {
    const container = document.createElement('div');
    container.className = 'ending-report-container';
    container.style.cssText = `
        width: 90%;
        max-width: 800px;
        max-height: 85%;
        background: #000;
        border: 4px solid #00ff00;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
        overflow-y: auto;
        padding: 0;
        font-family: 'MultiTypePixel', 'Courier New', monospace;
        color: #00ff00;
    `;
    
    // Header
    const header = document.createElement('div');
    header.style.cssText = `
        background: #00ff00;
        color: #000;
        padding: 15px;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        border-bottom: 4px solid #00ff00;
    `;
    header.textContent = scenario.name === 'Fin - Approche durable' ? '🌱 BILAN NUMÉRIQUE RESPONSABLE' : '⚠️ BILAN NUMÉRIQUE';
    container.appendChild(header);
    
    // Score global
    const scoreSection = document.createElement('div');
    scoreSection.style.cssText = `
        background: rgba(0, 255, 0, 0.1);
        padding: 20px;
        margin: 10px;
        border: 2px solid #00ff00;
        text-align: center;
    `;
    const total = score.good + score.bad + score.neutral;
    const percentage = total > 0 ? Math.round((score.good / total) * 100) : 0;
    scoreSection.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 10px;">SCORE GLOBAL</div>
        <div style="font-size: 36px; color: ${percentage >= 70 ? '#00ff00' : percentage >= 40 ? '#ffff00' : '#ff0000'};">${percentage}%</div>
        <div style="margin-top: 10px;">Bons choix: ${score.good} | Neutres: ${score.neutral} | Mauvais: ${score.bad}</div>
    `;
    container.appendChild(scoreSection);
    
    // Section des erreurs
    if (report.bad_choices && report.bad_choices.length > 0) {
        const errorsTitle = document.createElement('div');
        errorsTitle.style.cssText = `
            background: rgba(255, 0, 0, 0.2);
            padding: 10px 20px;
            margin: 10px 10px 0 10px;
            border: 2px solid #ff0000;
            color: #ff0000;
            font-size: 18px;
        `;
        errorsTitle.textContent = `❌ ${report.bad_choices.length} ERREUR${report.bad_choices.length > 1 ? 'S' : ''} IDENTIFIÉE${report.bad_choices.length > 1 ? 'S' : ''} (ANALYSE NIRD)`;
        container.appendChild(errorsTitle);
        
        report.bad_choices.forEach((choice, index) => {
            const errorBox = createErrorBox(choice, index + 1);
            container.appendChild(errorBox);
        });
    }
    
    // Section des bons choix
    if (report.good_choices && report.good_choices.length > 0) {
        const goodTitle = document.createElement('div');
        goodTitle.style.cssText = `
            background: rgba(0, 255, 0, 0.2);
            padding: 10px 20px;
            margin: 20px 10px 0 10px;
            border: 2px solid #00ff00;
            color: #00ff00;
            font-size: 18px;
        `;
        goodTitle.textContent = `✅ ${report.good_choices.length} BON${report.good_choices.length > 1 ? 'S' : ''} CHOIX`;
        container.appendChild(goodTitle);
        
        const goodList = document.createElement('div');
        goodList.style.cssText = `
            margin: 0 10px 10px 10px;
            padding: 15px;
            border: 2px solid #00ff00;
            border-top: none;
        `;
        report.good_choices.forEach((choice) => {
            const item = document.createElement('div');
            item.style.cssText = `margin: 10px 0; padding-left: 20px;`;
            item.innerHTML = `<span style="color: #00ff00;">✨</span> ${choice.choice_text}`;
            goodList.appendChild(item);
        });
        container.appendChild(goodList);
    }
    
    return container;
}

function createErrorBox(choice, errorNumber) {
    const box = document.createElement('div');
    box.style.cssText = `
        margin: 10px;
        border: 2px solid #ff0000;
        background: rgba(255, 0, 0, 0.05);
    `;
    
    // Titre de l'erreur
    const title = document.createElement('div');
    title.style.cssText = `
        background: rgba(255, 0, 0, 0.2);
        padding: 10px 15px;
        color: #ff0000;
        font-size: 16px;
        border-bottom: 2px solid #ff0000;
    `;
    title.textContent = `🔴 ERREUR ${errorNumber} : ${choice.choice_text}`;
    box.appendChild(title);
    
    // Contexte
    const context = document.createElement('div');
    context.style.cssText = `
        padding: 10px 15px;
        color: #aaa;
        font-size: 12px;
        border-bottom: 1px solid rgba(255, 0, 0, 0.3);
    `;
    context.textContent = `Contexte : ${choice.scenario_name}`;
    box.appendChild(context);
    
    // Impacts NIRD
    if (choice.nird_impact) {
        const impactsContainer = document.createElement('div');
        impactsContainer.style.cssText = `padding: 15px;`;
        
        const impacts = [
            { key: 'environnement', icon: '🌍', label: 'ENVIRONNEMENT', color: '#00cc00' },
            { key: 'economique', icon: '💰', label: 'ÉCONOMIQUE', color: '#ffaa00' },
            { key: 'social', icon: '👥', label: 'SOCIAL', color: '#00aaff' },
            { key: 'souverainete', icon: '🇫🇷', label: 'SOUVERAINETÉ', color: '#ff00aa' }
        ];
        
        impacts.forEach(impact => {
            if (choice.nird_impact[impact.key]) {
                const impactBox = document.createElement('div');
                impactBox.style.cssText = `
                    margin: 10px 0;
                    padding: 10px;
                    border-left: 4px solid ${impact.color};
                    background: rgba(0, 255, 0, 0.05);
                `;
                impactBox.innerHTML = `
                    <div style="color: ${impact.color}; font-weight: bold; margin-bottom: 5px;">
                        ${impact.icon} ${impact.label}
                    </div>
                    <div style="color: #fff; font-size: 14px; line-height: 1.4;">
                        ${choice.nird_impact[impact.key]}
                    </div>
                `;
                impactsContainer.appendChild(impactBox);
            }
        });
        
        box.appendChild(impactsContainer);
    }
    
    return box;
}

function displayClassicEnding(dialogManager, scenario) {
    // Affichage classique du texte
    scenario.content = scenario.content;
    
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
}

// Script principal
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
    
    // Créer l'interface de bilan stylisée
    const detailedReport = scenario.detailed_report;
    
    if (detailedReport) {
        // Créer un conteneur pour le bilan
        const reportContainer = createReportInterface(scenario, detailedReport, score);
        
        // Afficher dans un dialogue personnalisé
        const screenInterface = document.querySelector('.screen-interface');
        const dialogContainer = document.createElement('div');
        dialogContainer.className = 'dialog-container active ending-report';
        dialogContainer.appendChild(reportContainer);
        screenInterface.appendChild(dialogContainer);
    } else {
        // Affichage classique si pas de rapport détaillé
        displayClassicEnding(dialogManager, scenario);
    }
});
