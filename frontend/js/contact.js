// Contact form JavaScript avec Easter Eggs
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const modal = document.getElementById('successModal');
    const closeBtn = document.querySelector('.close');
    
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
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 500);
        } else if (clickCount === 3) {
            clearTimeout(clickTimer);
            clickCount = 0;
            activateShakeEasterEgg();
        }
    });
    
    // Validation du formulaire
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
                    headers: {
                        'Content-Type': 'application/json'
                    },
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
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Fonction de validation
    function validateForm() {
        let isValid = true;
        
        const nom = document.getElementById('nom');
        const email = document.getElementById('email');
        const sujet = document.getElementById('sujet');
        const message = document.getElementById('message');
        
        // Reset errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        
        if (nom.value.trim() === '') {
            showError('nom', 'Le nom est requis');
            isValid = false;
        }
        
        if (email.value.trim() === '') {
            showError('email', 'L\'email est requis');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError('email', 'L\'email n\'est pas valide');
            isValid = false;
        }
        
        if (sujet.value.trim() === '') {
            showError('sujet', 'Le sujet est requis');
            isValid = false;
        }
        
        if (message.value.trim() === '') {
            showError('message', 'Le message est requis');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError('message', 'Le message doit contenir au moins 10 caractères');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + '-error');
        errorElement.textContent = message;
        document.getElementById(fieldId).style.borderColor = '#e74c3c';
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Modal de succès
    function showSuccessModal(nom) {
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
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
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="success-animation">
                <span class="emoji">😢</span>
                <h2 style="color: #e74c3c;">Oups !</h2>
                <p>Une erreur s'est produite. Veuillez réessayer.</p>
            </div>
        `;
        modal.style.display = 'block';
    }
    
    // Easter Egg: Konami Code
    function activateKonamiEasterEgg() {
        document.body.classList.add('rainbow');
        alert('🎮 KONAMI CODE ACTIVÉ ! Vous avez débloqué le mode Arc-en-ciel ! 🌈');
        setTimeout(() => {
            document.body.classList.remove('rainbow');
        }, 10000);
    }
    
    // Easter Egg: Shake
    function activateShakeEasterEgg() {
        document.querySelector('.form-container').classList.add('shake');
        setTimeout(() => {
            document.querySelector('.form-container').classList.remove('shake');
        }, 500);
        alert('🎊 Vous avez trouvé l\'Easter Egg du triple-clic ! 🎊');
    }
    
    // Confetti animation
    function createConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-10px';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animation = 'confetti-fall 3s linear';
                confetti.style.zIndex = '9999';
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 30);
        }
    }
    
    // Easter Egg: Messages spéciaux
    const messageField = document.getElementById('message');
    messageField.addEventListener('input', function() {
        const text = this.value.toLowerCase();
        
        if (text.includes('konami')) {
            this.style.background = 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)';
            this.style.backgroundSize = '400% 400%';
            this.style.animation = 'rainbow 3s ease infinite';
            this.style.color = 'white';
        } else {
            this.style.background = 'white';
            this.style.color = '#333';
        }
    });
});
