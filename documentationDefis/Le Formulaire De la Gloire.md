# 📧 Documentation de la Page Contact - Les5Aperos

> Un formulaire de contact qui n'est pas juste un formulaire de contact...

## Accéder au formulaire

**En ligne :** [https://les5aperos-app.thankfuldesert-9c4e98f2.westeurope.azurecontainerapps.io/contact](https://les5aperos-app.thankfuldesert-9c4e98f2.westeurope.azurecontainerapps.io/contact)

**En local :** `http://localhost:5000/contact`

Ou cliquez sur le bouton "?" en bas a droite de l'écran depuis le `/bureau`

## 🎯 Aperçu

La page `/contact` est un formulaire de contact interactif avec de nombreux **easter eggs** cachés, conçu dans un esprit humoristique pour la Nuit de l'Info 2025.

---

## Evenements et happenings

### 1. 🏃 Succès "Speed Runner" (Style Steam)
**Comment le déclencher :** Complétez les deux formulaires en **moins de 2 minutes**.

**Effet :** Une notification style Steam/achievement apparaît en bas à droite de l'écran avec :
- 🏃 Icône de coureur
- Titre "Speed Runner"
- Description "🏆 Formulaire complété en moins de 2 min"
- Barre de progression animée

---

### 2. 🏢 Bulle Evereast Solutions
**Comment le déclencher :** Tapez "evereast", "solutions" ou "evereast solutions" dans le champ **Nom** ou **Email**.

**Effet :** Une bulle apparaît avec :
- Le texte "Vous venez d'ici ?"
- Un lien cliquable vers [evereast-solutions.com](https://evereast-solutions.com/)
- Un bouton pour fermer la bulle

**Bonus :** Si vous écrivez "evereast solutions" dans le champ **Message**, celui-ci devient un arc-en-ciel animé !

---

### 3. 🎬 Easter Egg Otis (Astérix & Obélix : Mission Cléopâtre)
**Comment le déclencher :** Commencez à taper dans le champ **Message** (dès le premier caractère).

**Effet :** Après 2 secondes, une popup modale apparaît avec :
- Un message d'introduction sarcastique
- La vidéo YouTube de la célèbre tirade d'Otis
- Le texte de la tirade qui s'affiche progressivement (synchronisé avec la vidéo, ~60 secondes)
- La fermeture n'est possible qu'à la **fin** de la tirade complète

> *"Mais, vous savez, moi je ne crois pas qu'il y ait de bonne ou de mauvaise situation..."*

---

### 4. ⏳ Faux Captcha Trollesque
**Comment le déclencher :** Cliquez sur le captcha "Je ne suis pas un robot".

**Effet :**
- Un spinner apparaît avec un compte à rebours de **30 secondes**
- Des messages aléatoires défilent :
  - "Analyse des pixels..."
  - "Vérification de l'ADN numérique..."
  - "Consultation des serveurs de la NASA..."
  - "Interrogation de ChatGPT..."
  - "Calcul de Pi..."
  - "Téléchargement de plus de RAM..."
  - "Négociation avec les robots..."
  - "Vérification que vous n'êtes pas un chat..."
- À la fin : un rire moqueur audio + message "Inutile ! Félicitations, vous avez attendu pour rien !"

---

### 5. 😒 Critique du Sujet
**Comment le déclencher :** Remplissez le champ **Sujet** et cliquez ailleurs (blur).

**Effet :**
1. Message orange : *"Est-ce que vous êtes sûr que vous voulez nous contacter pour ça ? Ça m'a pas l'air très intéressant..."*
2. Après 5 secondes, si vous n'avez pas changé le sujet : *"Bon, si tu y tiens..."* (en vert)

---

### 6. 🗑️ Effacement par Inactivité
**Comment le déclencher :** Ne touchez à rien pendant **10 secondes** après avoir commencé à remplir un champ.

**Effet :** Les caractères de vos champs s'effacent progressivement, un par un (150ms par caractère), en commençant par le premier champ non-vide.

---

## 📝 Deuxième Formulaire (Après soumission du premier)

Après avoir validé le premier formulaire, un deuxième apparaît avec encore plus de surprises :

### 7. 🔮 Champ d'Enchantement Minecraft (Vol Mystérieux)
**Fonctionnement :** Un champ mystérieux écrit en **caractères de table d'enchantement Minecraft** (Standard Galactic Alphabet) apparaît en haut du deuxième formulaire.

**Comment le déclencher :** Survolez le champ ou essayez de cliquer dessus.

**Effet :** 
- Une main 🖐️ apparaît depuis le côté droit de l'écran
- La main attrape le champ et le label
- Elle les emmène hors de l'écran
- Message final : "Le champ a été volé ! 🖐️"

> Le label affiche "ᔑリ∷ᒷᔑꖎ ᓵ𝙹↸ᒷ" et le placeholder "ℸ ̣ ||!¡ᒷ ||𝙹⚍∷ ᒲᒷᓭᓭᔑ⊣ᒷ"

---

### 8. 🥧 Âge en Décimales de Pi
**Fonctionnement :** Pour indiquer votre âge, vous devez écrire les décimales de π (Pi).

- `3.14` → 2 ans (2 décimales correctes)
- `3.1415` → 4 ans
- `3.14159265` → 8 ans

Le nombre de décimales correctes = votre âge affiché.

---

### 9. 🩸 Groupe Sanguin & RGPD
**Comment le déclencher :** 
- Sélectionnez n'importe quel groupe sanguin, **OU**
- Essayez de soumettre sans remplir le groupe sanguin

**Effet :**
1. Si vous sélectionnez un groupe : popup RGPD immédiate
2. Si vous ne remplissez pas : popup "Vous nous faites pas confiance ? 😢"
3. Peu importe votre choix, vous recevez un rappel RGPD expliquant que ces données ne peuvent pas être collectées
4. Lien vers [l'Article 9 du RGPD sur la CNIL](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article9)

---

### 10. 🌱 Slider de Hauteur de Pelouse
**Fonctionnement :** Un slider vertical vous demande à quelle hauteur vous tondez votre pelouse (0-100 cm).

**Effet visuel :** L'herbe dans le visuel change de hauteur en temps réel selon la valeur du slider.

---

### 11. 🎲 Case CGU Capricieuse
**Comment le déclencher :** Essayez de cocher la case "J'accepte les CGU".

**Effet :** **50% de chance** que la case refuse de se cocher !
- Message d'erreur : "Oups, ça n'a pas marché ! Réessayez... 🎲"

**Bonus :** Le lien CGU pointe vers... un Rickroll 🎵

---

### 12. 🎉 Récapitulatif Final
**Après avoir tout validé :**

Un récapitulatif complet de votre expérience apparaît avec :
- ⏱️ Temps passé
- ⌨️ Nombre de caractères tapés
- ✅ Si vous avez regardé la tirade d'Otis
- ✅ Si vous avez reçu le rappel RGPD
- ✅ Vol de champ mystérieux
- 🥧 Nombre de décimales de π connues
- 🌱 Hauteur d'herbe préférée
- 📋 Récapitulatif sérieux (Nom, Email, Sujet, Message)
- 🎊 Animation de confettis

---

## 🥚 Easter Eggs & Fonctionnalités Cachées

### 1. 🍻 Code Secret "5Apéro"
**Comment le déclencher :** Tapez "5Apero" (ou "5apéro", "5apero", "5APERO") dans **n'importe quel champ** du formulaire.

**Effet ÉPIQUE :**
1. Deux **ÉNORMES** bières 🍺 arrivent des côtés de l'écran
2. Elles s'entrechoquent au centre pour **TRINQUER**
3. Des étoiles ✨ géantes explosent au point d'impact
4. Un succès Steam "**À votre santé !**" 🍻 apparaît avec le message :
   - "🎉 Vous avez découvert le code secret des 5Apéros"

> C'est le **MAGNUM OPUS** du formulaire !

---


### 1. 🎮 Konami Code
**Comment le déclencher :** Tapez la séquence de touches légendaire :
```
↑ ↑ ↓ ↓ ← → ← → B A
```

**Effet :** L'arrière-plan de la page devient un arc-en-ciel animé pendant 10 secondes.

---

### 2. 🖱️ Triple Clic sur le Titre
**Comment le déclencher :** Cliquez rapidement 3 fois sur le titre "Formulaire de Contact des 5Apéros" dans le header.

**Effet :** Le formulaire entier se met à trembler (effet shake).


## 🔗 Liens Cachés

| Élément | Destination |
|---------|------------|
| Bulle Evereast | [evereast-solutions.com](https://evereast-solutions.com/) |
| Vidéo Otis | [YouTube - Tirade d'Otis](https://www.youtube.com/watch?v=YFLaKa3Kxe0) |
| Lien CGU | [Rickroll](https://www.youtube.com/watch?v=dQw4w9WgXcQ) 🎵 |
| Rappel RGPD | [CNIL - Article 9](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article9) |


---

*Documentation créée pour la Nuit de l'Info 2025 - Les5Aperos - INSA*
