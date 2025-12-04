// Contact form JavaScript avec Easter Eggs
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const modal = document.getElementById('successModal');
    const closeBtn = document.querySelector('.close');
    const submitBtn = document.getElementById('submitBtn');
    
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
        
        let timeLeft = 2;
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
                captchaText.textContent = 'Vérifié !';
                captchaTimer.textContent = '✅ Félicitations, vous êtes probablement humain !';
                captchaVerified = true;
                submitBtn.disabled = false;
                
                // Rires moqueurs
                const laughAudio = new Audio('https://www.myinstants.com/media/sounds/evil-laugh.mp3');
                laughAudio.volume = 0.5;
                laughAudio.play().catch(() => {});
            }
        }, 1000);
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
                    showSuccessModal(formData.nom);
                    form.reset();
                    createConfetti();
                }
            } catch (error) {
                console.error('Erreur:', error);
                showErrorModal();
            }
        }
    });
    
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
        document.getElementById('modalBody').innerHTML = `
            <div class="success-animation">
                <span class="emoji">🎉</span>
                <h2>Félicitations ${nom} !</h2>
                <p>Votre message a été envoyé avec succès !</p>
                <p style="font-style: italic; color: #7f8c8d; margin-top: 1rem;">
                    Peut-être recevrez-vous le message tant attendu... 👀
                </p>
                <button onclick="document.getElementById('successModal').style.display='none'" 
                        style="margin-top: 1rem; padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; border: none; border-radius: 25px; cursor: pointer;">
                    Fermer
                </button>
            </div>
        `;
        modal.style.display = 'block';
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
});
