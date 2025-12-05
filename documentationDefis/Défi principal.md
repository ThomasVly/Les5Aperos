# Jeu Interactif - Documentation

## 🌐 Accès

**En ligne :** [https://les5aperos-app.thankfuldesert-9c4e98f2.westeurope.azurecontainerapps.io/game/reset](https://les5aperos-app.thankfuldesert-9c4e98f2.westeurope.azurecontainerapps.io/game/reset)

**En local :** `http://localhost:5000/game/reset`

---

## 📋 Table des matières
- [Vue d'ensemble](#vue-densemble)
- [Structure du jeu](#structure-du-jeu)
- [Format des scénarios](#format-des-scénarios)
- [Pédagogie NIRD](#pédagogie-nird)
- [Système de bilan](#système-de-bilan)

---

## 🎯 Vue d'ensemble

### Principe
Vous incarnez **Arnaud Psolescence**, proviseur de l'INSA Hauts de France. Le jeu vous propose des situations réelles de gestion informatique où vos décisions ont des conséquences environnementales, économiques, sociales et sur l'indépendance de l'établissement.

### Objectifs
- Comprendre l'impact du numérique sur l'environnement
- Découvrir les alternatives durables (réparation, réemploi, logiciels libres)
- Réfléchir aux vrais coûts et à l'indépendance technologique
- Apprendre par l'expérience et les conséquences de ses choix

---

## 🏗️ Structure du jeu

### Organisation
Le jeu fonctionne comme un **livre dont vous êtes le héros** :
- **15 situations** différentes à vivre
- **Plusieurs chemins** possibles selon vos décisions
- **2 fins** : succès ou échec

### Exemple de parcours

```
📧 Situation 1: Un clavier est cassé
   ├→ Choix A: Le réparer → Bien ! → Situation suivante
   └→ Choix B: Acheter du neuf → Moins bien → Autre situation

🔧 Situation 2: Idée de recycler les vieux PC
   ├→ Choix A: Lancer le projet → Excellent ! → Suite
   └→ Choix B: Trop compliqué → Dommage → Autre suite

[... et ainsi de suite jusqu'à la fin]

🏆 Fin: Votre bilan
   - 5 bonnes décisions ou plus → Félicitations !
   - Moins de 5 → Vous pouvez mieux faire
```

### Les 5 façons de présenter les situations

1. **📧 Email** - Vous recevez un message
2. **💬 Chat** - Une conversation rapide
3. **⚠️ Alerte** - Une notification urgente
4. **📝 Texte** - Une description détaillée
5. **🗣️ Dialogue** - Un échange avec réponses

---

## 📄 Format des scénarios

### Comment est créée une situation ?

Chaque situation est décrite dans un fichier texte (format JSON) avec ces informations :

**Les infos de base :**
- Le titre (ex: "Clavier cassé")
- Le type de présentation (email, chat, alerte...)
- Le texte de la situation
- L'expéditeur du message

**Les choix possibles :**
Chaque choix a :
- Le texte du bouton (ex: "Réparer")
- La situation suivante si on clique
- L'évaluation : bon choix, mauvais choix, ou neutre
- Les explications sur les 4 impacts (environnement, économie, social, souveraineté)

### Exemple simplifié

Imaginez une fiche de situation :

```
📋 SITUATION: Clavier cassé
📧 TYPE: Email
👤 DE: Un étudiant
📝 MESSAGE: "Mon clavier ne marche plus, j'ai perdu la touche E..."

🔘 CHOIX 1: "Réparer le clavier"
   → Bon choix ✓
   → Mène à: Situation 1A
   → Impacts:
     🌍 Environnement: Pas de déchet, pas de production
     💰 Économie: Coût faible, juste une réparation
     👥 Social: Valorise les techniciens locaux
     🛡️ Souveraineté: On reste autonomes

🔘 CHOIX 2: "Acheter un neuf"
   → Choix moyen ≈
   → Mène à: Situation 1B
   → Impacts:
     🌍 Environnement: Production = pollution
     💰 Économie: Dépense du budget
     👥 Social: Pas de nouvelle compétence
     🛡️ Souveraineté: On dépend des fournisseurs
```

---

## 🔄 Comment passe-t-on d'une situation à l'autre ?

### Le principe (sans jargon technique)

Imaginez un **livre dont vous êtes le héros** :

1. **Vous lisez une page** (= une situation s'affiche)
2. **Vous faites un choix** (= cliquez sur un bouton)
3. **Le livre note votre choix** dans une mémoire temporaire
4. **Il calcule votre score** (bon/mauvais choix)
5. **Il vous envoie à la page suivante** (= nouvelle situation)

### Ce qui se passe en coulisses

**Étape 1 : Vous cliquez**
→ Votre navigateur envoie votre choix au serveur

**Étape 2 : Le serveur note tout**
→ Il garde en mémoire tous vos choix
→ Il compte combien de bonnes/mauvaises décisions

**Étape 3 : Le serveur trouve la suite**
→ Il cherche quelle situation vient après selon votre choix

**Étape 4 : Il vous renvoie la nouvelle situation**
→ Votre écran affiche la situation suivante
→ Avec une petite animation de transition (fondu)

### Pourquoi c'est fluide ?

Le jeu **ne recharge pas toute la page** à chaque fois. C'est comme si on tournait juste une page du livre, pas comme si on fermait et rouvrait le livre à chaque fois. Ça donne des transitions douces et rapides.

---

## 📚 Pédagogie NIRD

### Les 4 dimensions à prendre en compte

Le jeu évalue chaque décision selon 4 critères :

#### 🌍 **Environnement**
*Quel est l'impact sur la planète ?*

**Exemples concrets :**
- Réparer un clavier = pas de déchet, pas de nouvelle fabrication
- Acheter du neuf = production polluante, transport, future mise au rebut
- Recycler de vieux PC = prolonger leur vie, éviter les déchets

#### 💰 **Économie**  
*Combien ça coûte vraiment ?*

**Exemples concrets :**
- Réparation = quelques euros de pièces
- Achat neuf = 50-100€ immédiat, mais combien de temps ça dure ?
- Projet de réemploi = investissement de départ, mais économies sur 5 ans

#### 👥 **Social**
*Quel impact sur les personnes ?*

**Exemples concrets :**
- Réparer = valoriser les compétences des techniciens
- Jeter/racheter = compétences qui s'atrophient
- Former aux logiciels libres = nouvelles compétences, autonomie

#### 🛡️ **Souveraineté**
*Est-ce qu'on reste indépendants ?*

**Exemples concrets :**
- Dépendre de Microsoft/Google = ils décident pour nous
- Utiliser du logiciel libre = on contrôle notre informatique
- Cloud américain = nos données partent à l'étranger

### Comment le jeu vous note

- ✅ **Bonne décision** : +1 point (durable et responsable)
- ≈ **Décision moyenne** : 0 point (pas idéal mais acceptable)
- ❌ **Mauvaise décision** : compté négativement

**À la fin :**
- 5 bonnes décisions ou plus → 🏆 Vous avez réussi !
- Moins de 5 → 📉 Il faut revoir votre stratégie

---

## 🎨 L'affichage à l'écran

### Le design rétro

Le jeu s'affiche sur l'écran d'un **ordinateur vintage** dessiné en pixel art. Toutes les situations apparaissent dans cet écran, comme si vous utilisiez vraiment un vieil ordinateur.

### Les éléments visuels

**Barre de progression** 📊
- En haut de chaque fenêtre
- Montre où vous en êtes dans le jeu (situation 5/15 par exemple)
- Se remplit progressivement en vert

**Fenêtre de dialogue** 💬
- Design rétro années 80-90
- Titre en haut avec bouton de fermeture ×
- Contenu au centre (email, chat, texte...)
- Boutons de choix en bas

**Animations douces** ✨
- Quand une situation apparaît : fondu d'entrée
- Quand elle disparaît : fondu de sortie
- Les emails "glissent" depuis le haut
- Les notifications "pulsent" pour attirer l'attention
- Les messages de chat apparaissent un par un

### Positionnement

La fenêtre de jeu s'adapte automatiquement à la taille de l'écran pixel art :
- Centrée sur l'écran de l'ordinateur
- Pas trop grande pour rester lisible
- Avec de l'espace en haut pour respirer
- Sur fond noir pour l'effet "écran allumé"

---

## 📊 Le bilan final

### Ce que vous voyez à la fin

À la fin du jeu, vous recevez un **rapport détaillé** qui analyse toutes vos décisions :

**En-tête du bilan** 🎯
```
Score: 3 bonnes décisions sur 10 choix
```

**Pour chaque mauvaise décision** ⚠️

Une "carte d'erreur" s'affiche avec :
- Le numéro de l'erreur (Erreur #1, #2...)
- La situation concernée
- Votre choix
- **Les 4 impacts expliqués** :
  - 🌍 Pourquoi c'était mauvais pour l'environnement
  - 💰 Pourquoi c'était mauvais économiquement
  - 👥 L'impact social
  - 🛡️ L'impact sur l'indépendance

**Exemple de carte d'erreur :**
```
┌────────────────────────────────────┐
│ ⚠️ ERREUR #1                       │
│ Situation: Clavier cassé           │
│ Votre choix: Acheter du neuf       │
│                                    │
│ 🌍 Environnement: NÉGATIF          │
│ Production = pollution + transport │
│                                    │
│ 💰 Économie: NÉGATIF               │
│ Coût d'achat supérieur             │
│                                    │
│ 👥 Social: NEUTRE                  │
│ Pas de nouvelle compétence         │
│                                    │
│ 🛡️ Souveraineté: NÉGATIF          │
│ Dépendance au fournisseur          │
└────────────────────────────────────┘
```

**Liste de vos bonnes décisions** ✅
- Énumération simple de ce que vous avez bien fait
- Pour vous féliciter et vous montrer le bon chemin

---

## 📁 Organisation des fichiers

Le jeu est organisé en deux parties :

### Côté serveur (backend)
Ce qui gère la logique et les données :
- `game.py` : Le "chef d'orchestre" qui décide quelle situation montrer
- `scenario_service.py` : Celui qui va chercher les situations dans les fichiers
- `scenarios.json` : Le fichier avec toutes les 15 situations
- `intro.json` : Le texte de l'introduction

### Côté navigateur (frontend)  
Ce qui s'affiche à l'écran :
- `dialog.js` : Le code qui affiche les fenêtres joliment
- `scenario.js` : Le code qui gère les transitions entre situations
- `ending.js` : Le code qui affiche le bilan final
- `dialog.css` : Les styles pour les fenêtres dialogues.
- `ending.css` : Les styles pour le bilan.
- `scenario.html` : La page du jeu
- `ending.html` : La page de fin

---

## 🎯 En résumé

**Ce que fait le jeu :**
- ✅ Vous fait **vivre des situations réelles** de gestion informatique
- ✅ Montre les **vraies conséquences** de chaque décision
- ✅ Explique **pourquoi** c'est bon ou mauvais (les 4 impacts)
- ✅ Rend le sujet **concret et amusant** au lieu de juste théorique

**L'objectif final :**
Faire comprendre que le numérique "responsable", ce n'est pas compliqué ni ennuyeux. C'est juste faire des choix intelligents qui :
- 🌍 Polluent moins
- 💰 Coûtent moins cher sur le long terme
- 👥 Valorisent les compétences locales
- 🛡️ Nous rendent plus indépendants

**En jouant 15 minutes**, on comprend des concepts qui prendraient des heures à expliquer en cours magistral.
