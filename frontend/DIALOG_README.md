# Système de Boîtes de Dialogue Rétro

## 📦 Fichiers créés

### CSS
- **`css/dialog.css`** : Tous les styles pour les boîtes de dialogue rétro avec effets CRT, scanlines, et style pixel art années 80

### JavaScript
- **`js/dialog.js`** : Gestionnaire de boîtes de dialogue (classe `DialogManager`)
- **`js/scenarios.js`** : Base de données des scénarios du jeu
- **`js/activity.js`** : Fichier mis à jour avec l'intégration des dialogues

### HTML
- **`activity.html`** : Mis à jour avec les liens vers les nouveaux fichiers
- **`demo_dialogs.html`** : Page de démonstration autonome pour tester les dialogues

## 🎮 Types de Boîtes de Dialogue

### 1. Mail (`showMail`)
Boîte de dialogue style client mail rétro
```javascript
dialogManager.showMail({
    title: "MAIL REÇU",
    from: "expediteur@example.com",
    subject: "Objet du mail",
    content: "Contenu du message...",
    choices: [
        { text: "Répondre", action: "reply", nextScenario: "scenario2" },
        { text: "Ignorer", action: "close" }
    ],
    scenarioId: "mail_1"
});
```

### 2. Choix Multiple (`showChoice`)
Dialogue avec plusieurs options
```javascript
dialogManager.showChoice({
    title: "DÉCISION",
    content: "Texte de la question ou situation...",
    choices: [
        { text: "Option A", action: "choice_a", nextScenario: "scenario_a" },
        { text: "Option B", action: "choice_b", nextScenario: "scenario_b" }
    ],
    scenarioId: "choice_1"
});
```

### 3. Narratif (`showNarrative`)
Pour les descriptions et textes narratifs
```javascript
dialogManager.showNarrative({
    title: "HISTOIRE",
    content: [
        "Premier paragraphe...",
        "Deuxième paragraphe...",
        "Troisième paragraphe..."
    ],
    choices: [
        { text: "Continuer", action: "continue", nextScenario: "next" }
    ],
    scenarioId: "story_1"
});
```

### 4. Notification (`showNotification`)
Messages système avec icône
```javascript
dialogManager.showNotification({
    title: "ALERTE",
    icon: "⚠️", // Emoji ou symbole
    content: "Message de notification...",
    choices: [
        { text: "OK", action: "close" }
    ],
    scenarioId: "notif_1"
});
```

### 5. Chat (`showChat`)
Conversation style messagerie instantanée
```javascript
dialogManager.showChat({
    title: "CHAT INTERNE",
    messages: [
        { sender: "Alice", text: "Premier message" },
        { sender: "Bob", text: "Réponse" },
        { sender: "Alice", text: "Autre message" }
    ],
    choices: [
        { text: "Répondre", action: "reply" },
        { text: "Fermer", action: "close" }
    ],
    scenarioId: "chat_1"
});
```

## 🎨 Caractéristiques du Style

- **Couleurs** : Vert phosphorescent (#00ff00) sur fond noir, style terminal rétro
- **Bordures** : Épaisses avec effet de lueur (glow)
- **Effets** :
  - Scanlines CRT authentiques
  - Animation d'apparition style années 80
  - Effet de pixellisation
  - Ombres et lueurs vertes
  - Boutons avec effet hover interactif
- **Police** : MultiTypePixel (police pixel art)
- **Responsive** : S'adapte aux petits écrans

## 🔧 Utilisation

### Installation dans votre projet

1. **Inclure les fichiers CSS** dans votre HTML :
```html
<link rel="stylesheet" href="css/dialog.css">
```

2. **Inclure les fichiers JavaScript** :
```html
<script src="js/scenarios.js"></script>
<script src="js/dialog.js"></script>
```

3. **Initialiser le gestionnaire** :
```javascript
const dialogManager = new DialogManager();
```

4. **Afficher un dialogue** :
```javascript
dialogManager.showMail({ /* options */ });
```

### Dans l'écran d'ordinateur

Les dialogues s'affichent automatiquement dans le `.screen-interface` de votre ordinateur pixel art. Ils sont parfaitement dimensionnés pour rentrer dans l'écran.

## 📝 Ajouter des Scénarios

Éditez `js/scenarios.js` :

```javascript
const scenarios = {
    "mon_scenario": {
        type: "mail", // ou "choice", "narrative", "notification", "chat"
        title: "TITRE",
        from: "expediteur@mail.com", // pour type mail
        subject: "Sujet", // pour type mail
        content: "Contenu du message",
        choices: [
            {
                text: "Choix 1",
                action: "action_1",
                nextScenario: "scenario_suivant"
            }
        ]
    }
};
```

## 🎯 Callbacks et Actions

### Enregistrer des callbacks personnalisés

```javascript
dialogManager.on('action_personnalisee', function(choice, scenarioId) {
    console.log('Action déclenchée:', choice, scenarioId);
    // Votre logique ici
});
```

### Actions prédéfinies

- **`close`** : Ferme la boîte de dialogue
- **`continue`** : Ferme et continue
- **`nextScenario`** : Navigue vers le scénario spécifié dans `nextScenario`

### Navigation entre scénarios

```javascript
dialogManager.on('nextScenario', function(scenarioId, choice) {
    // Charger le scénario suivant
    loadScenario(scenarioId);
});
```

## 💾 Sauvegarde des Choix

Le système sauvegarde automatiquement tous les choix dans le localStorage :

```javascript
// Récupérer l'historique
const choices = dialogManager.getChoices();

// Réinitialiser
dialogManager.resetGame();
```

## 🧪 Tester

Ouvrez `demo_dialogs.html` dans votre navigateur pour tester tous les types de dialogues de manière interactive.

## 📱 Responsive

Les dialogues s'adaptent automatiquement :
- **Desktop** : Taille optimale
- **Tablette** : Largeur 95% avec ajustements de police
- **Mobile** : Plein écran avec boutons empilés verticalement

## 🎨 Personnalisation

### Changer les couleurs

Dans `css/dialog.css`, modifiez :
```css
/* Remplacer #00ff00 par votre couleur */
border: 4px solid #00ff00; /* Vert -> autre couleur */
color: #00ff00; /* Texte */
```

### Ajuster les animations

Modifiez les keyframes :
```css
@keyframes dialog-appear {
    /* Vos réglages */
}
```

## 🐛 Dépannage

**Les dialogues ne s'affichent pas** :
- Vérifiez que dialog.css est bien chargé
- Vérifiez la console pour les erreurs
- Assurez-vous que `.screen-interface` existe

**Problèmes de style** :
- Vérifiez que la police MultiTypePixel est chargée
- Inspectez l'élément pour voir les styles appliqués

**Scénarios qui ne se chargent pas** :
- Vérifiez `scenarios.js` pour les erreurs de syntaxe
- Vérifiez que les IDs de scénarios correspondent

## 📄 Licence

MIT - Les5Aperos
