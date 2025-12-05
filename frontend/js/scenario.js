// Script pour afficher un scénario via DialogManager
document.addEventListener('DOMContentLoaded', () => {
    // Ne pas exécuter sur la page de fin
    if (window.isEnding) {
        console.log('Page de fin détectée, scenario.js ne s\'exécute pas');
        return;
    }
    
    console.log('Chargement du scénario...');
    
    const dialogManager = new DialogManager();
    const scenario = window.scenarioData;
    
    if (!scenario) {
        console.error('Aucune donnée de scénario trouvée');
        return;
    }
    
    console.log('Scénario:', scenario);
    
    // Bouton quitter
    const quitBtn = document.getElementById('quit-btn');
    if (quitBtn) {
        quitBtn.addEventListener('click', () => {
            window.location.href = '/activity';
        });
    }
    
    // Charger le premier scénario
    loadScenario(scenario, dialogManager);
});

// Fonction pour charger et afficher un scénario
function loadScenario(scenario, dialogManager) {
    console.log('Chargement du scénario:', scenario);
    
    // Si c'est une fin, rediriger vers la page de fin
    if (scenario.ending) {
        window.location.href = '/game/play';
        return;
    }
    
    // Préparer les choix
    const choices = scenario.choices ? scenario.choices.map((choice, index) => ({
        text: choice.text,
        action: `choice_${index}`
    })) : [];
    
    // Nettoyer les anciens callbacks et enregistrer les nouveaux
    dialogManager.callbacks = {}; // Reset des callbacks
    
    // Enregistrer les callbacks pour chaque choix
    choices.forEach((choice, index) => {
        dialogManager.on(`choice_${index}`, async () => {
            console.log('Choix sélectionné:', index, choice);
            
            // Envoyer le choix via AJAX
            try {
                const formData = new FormData();
                formData.append('choice', index);
                
                const response = await fetch('/game/choose', {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement du scénario');
                }
                
                const data = await response.json();
                console.log('Nouveau scénario reçu:', data);
                console.log('Type du scénario:', data.scenario?.type);
                console.log('Ending?', data.scenario?.ending);
                console.log('Choices:', data.scenario?.choices);
                
                // Charger le nouveau scénario
                loadScenario(data.scenario, dialogManager);
                
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur lors du chargement du scénario');
            }
        });
    });
    
    // Afficher le dialog selon le type
    const type = scenario.type.toLowerCase();
    
    switch(type) {
        case 'mail':
            dialogManager.showMail({
                title: 'MAIL REÇU',
                from: scenario.source || 'Expéditeur inconnu',
                subject: scenario.title || 'Sans objet',
                content: scenario.content,
                choices: choices,
                scenarioId: scenario.name
            });
            break;
        
        case 'chat':
            dialogManager.showChat({
                title: scenario.title || 'CONVERSATION',
                messages: [
                    { sender: scenario.source, text: scenario.content }
                ],
                choices: choices,
                scenarioId: scenario.name
            });
            break;
        
        case 'notification':
            dialogManager.showNotification({
                title: scenario.title || 'NOTIFICATION',
                icon: scenario.ending ? '🎉' : '📢',
                content: scenario.content,
                choices: choices,
                scenarioId: scenario.name
            });
            break;
        
        default:
            // Dialogue narratif par défaut
            dialogManager.showNarrative({
                title: scenario.title || 'SYSTÈME',
                content: scenario.content.split('\n\n'),
                choices: choices,
                scenarioId: scenario.name
            });
    }
}
