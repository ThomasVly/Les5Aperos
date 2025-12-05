// Contact form JavaScript avec Easter Eggs
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const modal = document.getElementById('successModal');
    const closeBtn = document.querySelector('.close');
    const submitBtn = document.getElementById('submitBtn');
    
    // ==================== TRACKING STATISTIQUES ====================
    const startTime = Date.now();
    let totalCharactersTyped = 0;
    let otisWatched = false;
    let rgpdReminded = false;
    let piDecimalsKnown = 0;
    let lawnHeightPreferred = 50;
    let enchantmentFieldStolen = false;
    let userFormData = { nom: '', email: '', sujet: '', message: '' };
    
    // Tracker tous les caractères tapés
    document.addEventListener('keypress', function() {
        totalCharactersTyped++;
    });
    
    // Disparition progressive des entrées si l'utilisateur attend trop
    let inactivityTimer = null;
    let deletionInterval = null;
    const INACTIVITY_DELAY = 10000; // 10 secondes avant de commencer à effacer
    const DELETE_SPEED = 150; // Vitesse de suppression (ms par caractère)
    const formFields = ['nom', 'email', 'sujet', 'message'];
    let currentFieldIndex = 0;
    
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        clearInterval(deletionInterval);
        currentFieldIndex = 0;
        
        // Ne démarre le timer que si au moins un champ a du contenu
        const hasContent = formFields.some(f => document.getElementById(f).value.length > 0);
        if (hasContent) {
            inactivityTimer = setTimeout(startDeletion, INACTIVITY_DELAY);
        }
    }
    
    function startDeletion() {
        deletionInterval = setInterval(() => {
            // Trouver le champ actuel avec du contenu
            while (currentFieldIndex < formFields.length) {
                const field = document.getElementById(formFields[currentFieldIndex]);
                if (field.value.length > 0) {
                    // Supprimer le dernier caractère
                    field.value = field.value.slice(0, -1);
                    return;
                }
                currentFieldIndex++;
            }
            // Tous les champs sont vides
            clearInterval(deletionInterval);
        }, DELETE_SPEED);
    }
    
    // Écouter les événements sur tous les champs du formulaire
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('input', resetInactivityTimer);
        field.addEventListener('focus', resetInactivityTimer);
    });
    
    // Easter Egg: Bulle Evereast Solutions
    const evereastKeywords = ['evereast', 'solutions', 'evereast-solutions', 'evereast solutions'];
    const evereastBubble = document.getElementById('evereastBubble');
    const closeBubble = document.getElementById('closeBubble');
    let bubbleShown = false;
    
    function checkEvereast(value) {
        const lowerValue = value.toLowerCase();
        return evereastKeywords.some(keyword => lowerValue.includes(keyword));
    }
    
    ['nom', 'email'].forEach(fieldId => {
        document.getElementById(fieldId).addEventListener('input', function() {
            if (!bubbleShown && checkEvereast(this.value)) {
                evereastBubble.classList.add('visible');
                bubbleShown = true;
            }
        });
    });
    
    closeBubble.addEventListener('click', () => {
        evereastBubble.classList.remove('visible');
    });
    
    // Faux Captcha
    let captchaVerified = false;
    const fakeCaptcha = document.getElementById('fakeCaptcha');
    const captchaSpinner = document.getElementById('captchaSpinner');
    const captchaCheckmark = document.getElementById('captchaCheckmark');
    const captchaText = document.getElementById('captchaText');
    const captchaTimer = document.getElementById('captchaTimer');
    
    fakeCaptcha.addEventListener('click', function() {
        if (captchaVerified || captchaSpinner.classList.contains('active')) return;
        
        captchaSpinner.classList.add('active');
        captchaText.textContent = 'Vérification en cours...';
        
        let timeLeft = 30;
        captchaTimer.textContent = `⏳ Analyse comportementale... ${timeLeft}s restantes`;
        
        const countdown = setInterval(() => {
            timeLeft--;
            const messages = [
                'Analyse des pixels...',
                'Vérification de l\'ADN numérique...',
                'Consultation des serveurs de la NASA...',
                'Interrogation de ChatGPT...',
                'Calcul de Pi...',
                'Téléchargement de plus de RAM...',
                'Négociation avec les robots...',
                'Vérification que vous n\'êtes pas un chat...'
            ];
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            captchaTimer.textContent = `⏳ ${randomMsg} ${timeLeft}s`;
            
            if (timeLeft <= 0) {
                clearInterval(countdown);
                captchaSpinner.classList.remove('active');
                captchaCheckmark.classList.add('active');
                captchaText.textContent = 'Inutile !';
                captchaTimer.textContent = '✅ Félicitations, vous avez attendu pour rien !';
                captchaVerified = true;
                submitBtn.disabled = false;
                
                // Rires moqueurs
                const laughAudio = new Audio('https://www.myinstants.com/media/sounds/sitcom-laughing-1.mp3');
                laughAudio.volume = 1;
                laughAudio.play().catch(() => {});
            }
        }, 1000);
    });
    
    // Fausse erreur sur le sujet
    const sujetField = document.getElementById('sujet');
    const sujetError = document.getElementById('sujet-error');
    let sujetWarningShown = false;
    let originalSujet = '';
    
    sujetField.addEventListener('blur', function() {
        if (this.value.trim().length > 0 && !sujetWarningShown) {
            sujetError.textContent = "Est-ce que vous êtes sûr que vous voulez nous contacter pour ça ? Ça m'a pas l'air très intéressant...";
            sujetError.style.color = '#e67e22';
            this.style.borderColor = '#e67e22';
            sujetWarningShown = true;
            originalSujet = this.value;
            
            // Vérifie après 5 secondes si le sujet a changé
            setTimeout(() => {
                if (sujetField.value === originalSujet) {
                    sujetError.textContent = "Bon, si tu y tiens...";
                    sujetError.style.color = '#27ae60';
                    sujetField.style.borderColor = '#27ae60';
                } else {
                    sujetError.textContent = '';
                    sujetField.style.borderColor = '';
                }
            }, 5000);
        }
    });
    
    // Easter Egg Otis - Tirade au début du message
    const messageField = document.getElementById('message');
    const otisModal = document.getElementById('otisModal');
    const closeOtis = document.getElementById('closeOtis');
    const otisVideo = document.getElementById('otisVideo');
    const otisTirade = document.getElementById('otisTirade');
    let otisShown = false;
    let otisFinished = false;
    
    const tirade = "Mais, vous savez, moi je ne crois pas qu'il y ait de bonne ou de mauvaise situation. Moi, si je devais résumer ma vie aujourd'hui avec vous, je dirais que c'est d'abord des rencontres, des gens qui m'ont tendu la main, peut-être à un moment où je ne pouvais pas, où j'étais seul chez moi. Et c'est assez curieux de se dire que les hasards, les rencontres forgent une destinée… Parce que quand on a le goût de la chose, quand on a le goût de la chose bien faite, le beau geste, parfois on ne trouve pas l'interlocuteur en face, je dirais, le miroir qui vous aide à avancer. Alors ce n'est pas mon cas, comme je le disais là, puisque moi au contraire, j'ai pu ; et je dis merci à la vie, je lui dis merci, je chante la vie, je danse la vie… Je ne suis qu'amour ! Et finalement, quand beaucoup de gens aujourd'hui me disent : « Mais comment fais-tu pour avoir cette humanité ? » Eh bien je leur réponds très simplement, je leur dis que c'est ce goût de l'amour, ce goût donc qui m'a poussé aujourd'hui à entreprendre une construction mécanique, mais demain, qui sait, peut-être simplement à me mettre au service de la communauté, à faire le don, le don de soi…";
    
    messageField.addEventListener('input', function() {
        if (!otisShown && this.value.length === 1) {
            otisShown = true;
            
            // Petit délai pour laisser l'utilisateur commencer à taper
            setTimeout(() => {
                otisModal.style.display = 'block';
                closeOtis.style.display = 'none';
                otisVideo.src = 'https://www.youtube.com/embed/YFLaKa3Kxe0?autoplay=1&enablejsapi=1';
                otisTirade.textContent = '';
                
                // Attendre 4s pour le chargement de la vidéo
                setTimeout(() => {
                    const totalDuration = 60000; // 60 secondes
                    const charDelay = totalDuration / tirade.length;
                    let currentIndex = 0;
                    
                    const tiradeInterval = setInterval(() => {
                        if (currentIndex < tirade.length) {
                            otisTirade.textContent += tirade[currentIndex];
                            currentIndex++;
                            otisTirade.scrollTop = otisTirade.scrollHeight;
                        } else {
                            clearInterval(tiradeInterval);
                            otisFinished = true;
                            otisWatched = true;
                            closeOtis.style.display = 'block';
                        }
                    }, charDelay);
                }, 4000);
            }, 2000); // Délai de 2s avant l'apparition de la popup
        }
    });
    
    closeOtis.addEventListener('click', () => {
        if (otisFinished) {
            otisModal.style.display = 'none';
            otisVideo.src = '';
        }
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === otisModal && otisFinished) {
            otisModal.style.display = 'none';
            otisVideo.src = '';
        }
    });
    
    // Konami Code Easter Egg
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateKonamiEasterEgg();
        }
    });
    
    // Shake Easter Egg (triple click sur le titre)
    let clickCount = 0;
    let clickTimer = null;
    const header = document.querySelector('header h1');
    
    header.addEventListener('click', function() {
        clickCount++;
        if (clickCount === 1) {
            clickTimer = setTimeout(() => clickCount = 0, 500);
        } else if (clickCount === 3) {
            clearTimeout(clickTimer);
            clickCount = 0;
            activateShakeEasterEgg();
        }
    });
    
    // Validation et soumission du formulaire
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = {
                nom: document.getElementById('nom').value,
                email: document.getElementById('email').value,
                sujet: document.getElementById('sujet').value,
                message: document.getElementById('message').value
            };
            
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (data.status === 'success') {
                    userFormData = { ...formData };
                    showSecondForm(formData.nom);
                    form.reset();
                }
            } catch (error) {
                console.error('Erreur:', error);
                showErrorModal();
            }
        }
    });
    
    // ==================== DEUXIÈME FORMULAIRE ====================
    const secondFormSection = document.getElementById('secondFormSection');
    const secondForm = document.getElementById('secondContactForm');
    const ageInput = document.getElementById('age');
    const ageDisplay = document.getElementById('ageDisplay');
    const lawnSlider = document.getElementById('lawnHeight');
    const lawnGrass = document.getElementById('lawnGrass');
    const lawnValue = document.getElementById('lawnValue');
    const cguCheckbox = document.getElementById('cguCheckbox');
    const bloodTypeModal = document.getElementById('bloodTypeModal');
    const rgpdModal = document.getElementById('rgpdModal');
    const bloodTypeSelect = document.getElementById('bloodType');
    
    // Variable pour stocker le nom de l'utilisateur
    let userName = '';
    
    // Les décimales de Pi pour validation (100 premières décimales)
    const PI_DECIMALS = '1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679';
    
    // Afficher le deuxième formulaire
    function showSecondForm(nom) {
        userName = nom; // Stocker le nom pour plus tard
        document.getElementById('contact-form-section').style.display = 'none';
        secondFormSection.style.display = 'block';
        secondFormSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Afficher la popup RGPD dès qu'un groupe sanguin est sélectionné
    bloodTypeSelect.addEventListener('change', function() {
        if (this.value) {
            rgpdReminded = true;
            rgpdModal.style.display = 'block';
        }
    });
    
    // Gestion de l'âge avec les décimales de Pi
    ageInput.addEventListener('input', function() {
        const value = this.value.replace(/[^0-9.]/g, '');
        this.value = value;
        
        if (value.startsWith('3.')) {
            const decimals = value.substring(2);
            let validDecimals = '';
            
            for (let i = 0; i < decimals.length; i++) {
                if (decimals[i] === PI_DECIMALS[i]) {
                    validDecimals += decimals[i];
                } else {
                    break;
                }
            }
            
            const age = validDecimals.length;
            piDecimalsKnown = age;
            ageDisplay.textContent = `Votre âge : ${age} ans 🎂`;
            
            if (age >= 18) {
                ageDisplay.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
            } else if (age >= 10) {
                ageDisplay.style.background = 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)';
            } else {
                ageDisplay.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }
        } else if (value === '3') {
            ageDisplay.textContent = 'Votre âge : 0 ans (ajoutez un point et les décimales de π)';
        } else {
            ageDisplay.textContent = 'Votre âge : 0 ans (commencez par 3.)';
            ageDisplay.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
        }
    });
    
    // Gestion du slider de pelouse
    lawnSlider.addEventListener('input', function() {
        const value = this.value;
        lawnHeightPreferred = value;
        lawnGrass.style.height = value + '%';
        lawnValue.textContent = value + ' cm';
    });
    
    // Gestion de la case CGU (50% de chance de ne pas se cocher)
    cguCheckbox.addEventListener('click', function(e) {
        if (Math.random() < 0.5) {
            e.preventDefault();
            this.checked = false;
            document.getElementById('cgu-error').textContent = "Oups, ça n'a pas marché ! Réessayez... 🎲";
            setTimeout(() => {
                document.getElementById('cgu-error').textContent = '';
            }, 2000);
        }
    });
    
    // Gestion du deuxième formulaire
    secondForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const bloodType = document.getElementById('bloodType').value;
        const cguChecked = cguCheckbox.checked;
        
        // Validation CGU
        if (!cguChecked) {
            document.getElementById('cgu-error').textContent = "Vous devez accepter les CGU !";
            return;
        }
        
        // Si groupe sanguin non rempli et RGPD pas encore vu
        if (!bloodType && !rgpdReminded) {
            bloodTypeModal.style.display = 'block';
            return;
        }
        
        // Si tout est OK, afficher le succès
        finalSuccess();
    });
    
    // Gestion des boutons du modal groupe sanguin
    document.getElementById('bloodNoBtn').addEventListener('click', function() {
        bloodTypeModal.style.display = 'none';
        rgpdReminded = true;
        rgpdModal.style.display = 'block';
    });
    
    document.getElementById('bloodYesBtn').addEventListener('click', function() {
        bloodTypeModal.style.display = 'none';
        rgpdReminded = true;
        rgpdModal.style.display = 'block';
    });
    
    // Fermeture du modal RGPD (retour au formulaire)
    document.getElementById('closeRgpd').addEventListener('click', function() {
        rgpdModal.style.display = 'none';
    });
    
    document.getElementById('closeRgpdBtn').addEventListener('click', function() {
        rgpdModal.style.display = 'none';
    });
    
    function finalSuccess() {
        secondFormSection.style.display = 'none';
        showSuccessModal(userName || 'Visiteur mystérieux');
        createConfetti();
    }
    
    // Fermeture du modal
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
    
    // Validation du formulaire
    function validateForm() {
        let isValid = true;
        const fields = ['nom', 'email', 'sujet', 'message'];
        
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        
        fields.forEach(field => {
            const el = document.getElementById(field);
            const value = el.value.trim();
            
            if (value === '') {
                showError(field, `Le ${field} est requis`);
                isValid = false;
            } else if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                showError(field, "L'email n'est pas valide");
                isValid = false;
            } else if (field === 'message' && value.length < 10) {
                showError(field, 'Le message doit contenir au moins 10 caractères');
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function showError(fieldId, message) {
        document.getElementById(fieldId + '-error').textContent = message;
        document.getElementById(fieldId).style.borderColor = '#e74c3c';
    }
    
    // Modals
    function showSuccessModal(nom) {
        const endTime = Date.now();
        const timeSpent = Math.floor((endTime - startTime) / 1000);
        const minutes = Math.floor(timeSpent / 60);
        const seconds = timeSpent % 60;
        const timeFormatted = minutes > 0 ? `${minutes}min ${seconds}s` : `${seconds}s`;
        
        // Appliquer des styles au modal pour le scroll
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.maxHeight = '60vh';
        modalContent.style.overflowY = 'auto';
        modalContent.style.scrollbarWidth = 'none';
        modalContent.style.msOverflowStyle = 'none';
        
        document.getElementById('modalBody').innerHTML = `
            <style>
                .modal-content::-webkit-scrollbar { display: none; }
            </style>
            <div class="success-animation">
                <span class="emoji">🎉</span>
                <h2>Félicitations ${nom} !</h2>
                <p>Votre message a été envoyé avec succès !</p>
                
                <div style="text-align: left; margin-top: 1rem; padding: 0.8rem; background: #f8f9fa; border-radius: 10px;">
                    <h3 style="color: #667eea; margin-bottom: 0.5rem; font-size: 1rem;">📊 Récapitulatif de votre expérience</h3>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.9rem;">
                        <li style="padding: 0.3rem 0; border-bottom: 1px solid #eee;">⏱️ Temps passé : <strong>${timeFormatted}</strong></li>
                        <li style="padding: 0.3rem 0; border-bottom: 1px solid #eee;">⌨️ Caractères tapés : <strong>${totalCharactersTyped}</strong></li>
                        <li style="padding: 0.3rem 0; border-bottom: 1px solid #eee;">${otisWatched ? '✅' : '❌'} Récital d'Otis</li>
                        <li style="padding: 0.3rem 0; border-bottom: 1px solid #eee;">${rgpdReminded ? '✅' : '❌'} Rappel RGPD</li>
                        <li style="padding: 0.3rem 0; border-bottom: 1px solid #eee;">${enchantmentFieldStolen ? '✅' : '❌'} Vol de champ mystérieux</li>
                        <li style="padding: 0.3rem 0; border-bottom: 1px solid #eee;">🥧 Décimales de π connues : <strong>${piDecimalsKnown}</strong></li>
                        <li style="padding: 0.3rem 0;">🌱 Taille d'herbe préférée : <strong>${lawnHeightPreferred} cm</strong></li>
                    </ul>
                </div>
                
                <div style="text-align: left; margin-top: 0.8rem; padding: 0.8rem; background: #e8f5e9; border-radius: 10px; border-left: 4px solid #27ae60;">
                    <h3 style="color: #27ae60; margin-bottom: 0.5rem; font-size: 1rem;">📋 Section sérieuse</h3>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.9rem;">
                        <li style="padding: 0.2rem 0;"><strong>Nom :</strong> ${userFormData.nom}</li>
                        <li style="padding: 0.2rem 0;"><strong>Email :</strong> ${userFormData.email}</li>
                        <li style="padding: 0.2rem 0;"><strong>Sujet :</strong> ${userFormData.sujet}</li>
                        <li style="padding: 0.2rem 0;"><strong>Message :</strong> ${userFormData.message.length > 80 ? userFormData.message.substring(0, 80) + '...' : userFormData.message}</li>
                    </ul>
                </div>
                
                <button onclick="window.location.href='/activity'" 
                        style="margin-top: 0.8rem; padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; border: none; border-radius: 25px; cursor: pointer;">
                    Fermer
                </button>
            </div>
        `;
        modal.style.display = 'block';
        
        // Badge médaille si temps < 2 minutes
        if (timeSpent < 120) {
            showBadgeNotification();
        }
    }
    
    // Afficher un badge style Steam en bas à droite
    function showBadgeNotification() {
        const badge = document.createElement('div');
        badge.id = 'speedBadge';
        badge.innerHTML = `
            <div class="steam-achievement">
                <div class="steam-achievement-icon">
                    <span>🏃</span>
                </div>
                <div class="steam-achievement-content">
                    <div class="steam-achievement-title">Speed Runner</div>
                    <div class="steam-achievement-desc">🏆 Formulaire complété en moins de 2 min</div>
                    <div class="steam-achievement-progress">
                        <div class="steam-achievement-progress-bar"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(badge);
        
        // Retirer le badge après 5 secondes
        setTimeout(() => {
            const badgeEl = document.getElementById('speedBadge');
            if (badgeEl) {
                const achievementDiv = badgeEl.querySelector('.steam-achievement');
                if (achievementDiv) {
                    achievementDiv.classList.add('slide-out');
                    setTimeout(() => {
                        if (document.getElementById('speedBadge')) {
                            document.getElementById('speedBadge').remove();
                        }
                    }, 400);
                }
            }
        }, 5000);
    }
    
    // Afficher le succès "À votre santé"
    function showCheersBadge() {
        const badge = document.createElement('div');
        badge.id = 'cheersBadge';
        badge.innerHTML = `
            <div class="steam-achievement cheers-achievement">
                <div class="steam-achievement-icon">
                    <span>🍻</span>
                </div>
                <div class="steam-achievement-content">
                    <div class="steam-achievement-title">À votre santé !</div>
                    <div class="steam-achievement-desc">🎉 Vous avez découvert le code secret des 5Apéros</div>
                    <div class="steam-achievement-progress">
                        <div class="steam-achievement-progress-bar"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(badge);
        
        // Retirer le badge après 5 secondes
        setTimeout(() => {
            const badgeEl = document.getElementById('cheersBadge');
            if (badgeEl) {
                const achievementDiv = badgeEl.querySelector('.steam-achievement');
                if (achievementDiv) {
                    achievementDiv.classList.add('slide-out');
                    setTimeout(() => {
                        if (document.getElementById('cheersBadge')) {
                            document.getElementById('cheersBadge').remove();
                        }
                    }, 400);
                }
            }
        }, 5000);
    }
    
    function showErrorModal() {
        document.getElementById('modalBody').innerHTML = `
            <div class="success-animation">
                <span class="emoji">😢</span>
                <h2 style="color: #e74c3c;">Oups !</h2>
                <p>Une erreur s'est produite. Veuillez réessayer.</p>
            </div>
        `;
        modal.style.display = 'block';
    }
    
    // Easter Eggs
    function activateKonamiEasterEgg() {
        const mainSection = document.querySelector('main');
        mainSection.classList.add('rainbow-background');
        setTimeout(() => mainSection.classList.remove('rainbow-background'), 10000);
    }
    
    function activateShakeEasterEgg() {
        const container = document.querySelector('.form-container');
        container.classList.add('shake');
        setTimeout(() => container.classList.remove('shake'), 500);
    }
    
    // Confetti animation
    function createConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                Object.assign(confetti.style, {
                    position: 'fixed',
                    left: Math.random() * 100 + '%',
                    top: '-10px',
                    width: '10px',
                    height: '10px',
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                    animation: 'confetti-fall 3s linear',
                    zIndex: '9999'
                });
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }, i * 30);
        }
    }
    
    // Easter Egg: Message spécial
    document.getElementById('message').addEventListener('input', function() {
        if (this.value.toLowerCase().includes('evereast solutions')) {
            Object.assign(this.style, {
                background: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
                backgroundSize: '400% 400%',
                animation: 'rainbow 3s ease infinite',
                color: 'white'
            });
        } else {
            Object.assign(this.style, { background: 'white', color: '#333' });
        }
    });

    // ==================== EASTER EGG 5APERO - TRINQUER ====================
    let cheersTriggered = false;
    
    function triggerCheers() {
        if (cheersTriggered) return;
        cheersTriggered = true;
        
        // Créer le container pour l'animation
        const cheersOverlay = document.createElement('div');
        cheersOverlay.id = 'cheersOverlay';
        cheersOverlay.innerHTML = `
            <div class="beer-left">🍺</div>
            <div class="beer-right">🍺</div>
        `;
        document.body.appendChild(cheersOverlay);
        
        // Ajouter les styles
        const style = document.createElement('style');
        style.textContent = `
            #cheersOverlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                pointer-events: none;
                z-index: 99999;
                overflow: hidden;
            }
            .beer-left, .beer-right {
                position: absolute;
                font-size: 600px;
                top: 50%;
                transform: translateY(-50%);
            }
            .beer-left {
                left: -700px;
                animation: beerFromLeft 0.6s ease-out forwards;
            }
            .beer-right {
                right: -700px;
                transform: translateY(-50%) scaleX(-1);
                animation: beerFromRight 0.6s ease-out forwards;
            }
            @keyframes beerFromLeft {
                0% { left: -700px; transform: translateY(-50%) rotate(-20deg); }
                70% { left: calc(50% - 400px); transform: translateY(-50%) rotate(10deg); }
                85% { left: calc(50% - 350px); transform: translateY(-50%) rotate(-5deg); }
                100% { left: calc(50% - 380px); transform: translateY(-50%) rotate(15deg); }
            }
            @keyframes beerFromRight {
                0% { right: -700px; transform: translateY(-50%) scaleX(-1) rotate(20deg); }
                70% { right: calc(50% - 400px); transform: translateY(-50%) scaleX(-1) rotate(-10deg); }
                85% { right: calc(50% - 350px); transform: translateY(-50%) scaleX(-1) rotate(5deg); }
                100% { right: calc(50% - 380px); transform: translateY(-50%) scaleX(-1) rotate(-15deg); }
            }
            #cheersOverlay.clink .beer-left,
            #cheersOverlay.clink .beer-right {
                animation: clinkShake 0.3s ease-in-out;
            }
            @keyframes clinkShake {
                0%, 100% { transform: translateY(-50%) rotate(15deg); }
                25% { transform: translateY(-50%) rotate(20deg) scale(1.1); }
                50% { transform: translateY(-50%) rotate(10deg); }
                75% { transform: translateY(-50%) rotate(18deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Effet de choc après l'approche
        setTimeout(() => {
            cheersOverlay.classList.add('clink');
            
            // Ajouter un son de "clink" visuel avec des étoiles
            for (let i = 0; i < 10; i++) {
                const star = document.createElement('div');
                star.textContent = '✨';
                star.style.cssText = `
                    position: fixed;
                    left: 50%;
                    top: 50%;
                    font-size: ${80 + Math.random() * 120}px;
                    z-index: 100000;
                    pointer-events: none;
                    animation: starBurst 0.8s ease-out forwards;
                    --tx: ${(Math.random() - 0.5) * 800}px;
                    --ty: ${(Math.random() - 0.5) * 800}px;
                `;
                document.body.appendChild(star);
                setTimeout(() => star.remove(), 800);
            }
            
            // Ajouter l'animation des étoiles
            const starStyle = document.createElement('style');
            starStyle.textContent = `
                @keyframes starBurst {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); opacity: 0; }
                }
            `;
            document.head.appendChild(starStyle);
        }, 600);
        
        // Retirer l'overlay après l'animation
        setTimeout(() => {
            cheersOverlay.style.transition = 'opacity 0.5s';
            cheersOverlay.style.opacity = '0';
            setTimeout(() => cheersOverlay.remove(), 500);
        }, 2000);
        
        // Afficher le succès après l'animation
        setTimeout(() => {
            showCheersBadge();
        }, 2500);
    }
    
    // Écouter tous les inputs pour détecter "5apero"
    document.addEventListener('input', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            const value = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (value.includes('5apero')) {
                triggerCheers();
            }
        }
    });

    // ==================== CHAMP ENCHANTEMENT MINECRAFT ====================
    const enchantmentGroup = document.getElementById('enchantmentGroup');
    const enchantmentInput = document.getElementById('enchantment');
    
    if (enchantmentGroup && enchantmentInput) {
        let handTriggered = false;
        
        // Détecter quand la souris s'approche du champ
        enchantmentGroup.addEventListener('mouseenter', function() {
            if (handTriggered) return;
            handTriggered = true;
            enchantmentFieldStolen = true;
            
            // La main arrive
            enchantmentGroup.classList.add('hand-approaching');
            
            // Après l'approche, la main attrape le champ
            setTimeout(() => {
                enchantmentGroup.classList.remove('hand-approaching');
                enchantmentGroup.classList.add('hand-grabbing');
                
                // Le champ disparaît
                setTimeout(() => {
                    enchantmentGroup.classList.remove('hand-grabbing');
                    enchantmentGroup.classList.add('field-gone');
                }, 500);
            }, 800);
        });
        
        // Aussi sur focus (pour les utilisateurs clavier/tactile)
        enchantmentInput.addEventListener('focus', function() {
            if (handTriggered) return;
            handTriggered = true;
            enchantmentFieldStolen = true;
            
            enchantmentGroup.classList.add('hand-approaching');
            
            setTimeout(() => {
                enchantmentGroup.classList.remove('hand-approaching');
                enchantmentGroup.classList.add('hand-grabbing');
                this.blur(); // Retirer le focus
                
                setTimeout(() => {
                    enchantmentGroup.classList.remove('hand-grabbing');
                    enchantmentGroup.classList.add('field-gone');
                }, 500);
            }, 800);
        });
    }
});
