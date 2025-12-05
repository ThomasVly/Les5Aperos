# Visualizer - Gestionnaire de Sonneries

## Accéder au visualizer

**En ligne :** [https://les5aperos-app.thankfuldesert-9c4e98f2.westeurope.azurecontainerapps.io/visualizer](https://les5aperos-app.thankfuldesert-9c4e98f2.westeurope.azurecontainerapps.io/visualizer)

**En local :** `http://localhost:5000/visualizer`

Ou cliquez sur la tuile correspondante depuis le `/bureau`

## Fonctionnalités

### 1. Ajouter des fichiers audio
- Cliquez sur le bouton **"+ Ajouter un son"**
- Sélectionnez un ou plusieurs fichiers audio (MP3, WAV, OGG...)
- Attendez que l'analyse se termine (un loader s'affiche pendant le traitement)
- Vos morceaux apparaissent dans la liste de gauche avec leur durée et BPM

### 2. Lire un morceau
- Cliquez sur un morceau dans la liste de gauche
- La visualisation 3D démarre automatiquement
- Les contrôles audio apparaissent en bas de l'écran

### 3. Contrôler la lecture
- **Play/Pause** : Cliquez sur le bouton ▶/⏸ en bas de l'écran
- **Naviguer dans le morceau** : Cliquez n'importe où sur la barre de progression
- **Voir le temps écoulé** : Affiché au-dessus de la barre de progression (temps actuel / durée totale)

### 4. Personnaliser les couleurs
- **Ouvrir le sélecteur** : Cliquez sur le bouton 🎨 en bas à droite
- **Choisir une couleur** : Déplacez le slider vertical qui apparaît (parcourt toutes les couleurs)
- **Mode rainbow automatique** : Double-cliquez sur le bouton 🎨 pour activer/désactiver le mode arc-en-ciel

### 5. Retour au bureau
- Cliquez sur le bouton **"←"** en haut à gauche pour revenir à la page bureau

## Ce que fait la visualisation

- La forme 3D réagit en temps réel au son :
  - **Basses** : Font pulser la forme
  - **Médiums** : Créent des déformations
  - **Aigus** : Modifient l'intensité lumineuse
- La forme change automatiquement toutes les 5 secondes (sphère → cube → tore)

## Interface

- **Panneau de gauche** : Liste de vos morceaux avec leurs informations
- **Panneau de droite** : Visualisation 3D interactive
- **Contrôles audio** : Lecture et progression (en bas)
- **Sélecteur de couleur** : Bouton 🎨 (en bas à droite)