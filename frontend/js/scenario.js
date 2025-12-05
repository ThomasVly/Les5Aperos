// Script pour afficher un scénario via DialogManager
document.addEventListener('DOMContentLoaded', () => {
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
    
    // Préparer les choix avec soumission de formulaire
    const choices = scenario.choices ? scenario.choices.map((choice, index) => ({
        text: choice.text,
        action: `choice_${index}`
    })) : [];
    
    // Enregistrer les callbacks AVANT d'afficher les dialogs pour chaque choix
    choices.forEach((choice, index) => {
        dialogManager.on(`choice_${index}`, () => {
            console.log('Choix sélectionné:', index, choice);
            
            // Soumettre le formulaire correspondant
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/game/choose';
            
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'choice';
            input.value = index;
            
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
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
});
