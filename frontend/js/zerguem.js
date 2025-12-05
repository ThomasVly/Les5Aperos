let score = 0;
let health = 100;
let gameActive = false;
let spawnInterval;
let difficultySpeed = 1500;

// Variables pour le Cheat Code
let clickHistory = []; // Historique des timestamps des clics
let isCheatActive = false; // Est-ce que le mode permanent est activé ?
let laserTimeout; // Pour gérer la disparition du laser

function startGame() {
    gameActive = true;
    score = 0;
    health = 100;

    // Réinitialiser le cheat code à chaque partie
    clickHistory = [];
    isCheatActive = false;

    // On cache le laser au début (il n'apparaîtra qu'au clic)
    const laser = document.getElementById('laser-beam');
    if(laser) {
        laser.style.display = 'none';
        laser.classList.add('active'); // On garde l'animation CSS prête
    }

    // 1. Déclencher l'animation CSS
    document.body.classList.add('game-active');

    // 2. Cacher le bouton start
    document.getElementById('start-screen').style.display = 'none';

    // 3. Attendre la fin du zoom (1.5s) avant de commencer à faire apparaître les virus
    setTimeout(() => {
        document.getElementById('game-hud').style.display = 'flex';
        updateHUD();
        gameLoop();
    }, 1500);
}

function updateHUD() {
    document.getElementById('score-display').innerText = `SCORE: ${score}`;
    // Si le cheat est actif, on affiche un petit indicateur rigolo
    const cheatText = isCheatActive ? " [OVERDRIVE]" : "";
    document.getElementById('health-display').innerText = `SYS.INTEGRITY: ${health}%`;
    if(health < 30) document.getElementById('health-display').style.color = 'red';
}

function gameLoop() {
    if (!gameActive) return;
    spawnVirus();
    if (difficultySpeed > 400) difficultySpeed -= 30;
    spawnInterval = setTimeout(gameLoop, difficultySpeed);
}

function spawnVirus() {
    const screen = document.querySelector('.screen-interface');
    const virus = document.createElement('div');
    virus.className = 'virus-popup';
    virus.dataset.alive = "true";
    virus.innerHTML = '<div class="virus-header"><span class="virus-close">x</span></div><div class="virus-body">👾</div>';

    // Position aléatoire
    const x = Math.random() * (screen.clientWidth - 50);
    const y = Math.random() * (screen.clientHeight - 80) + 30; // +30 pour éviter le HUD
    virus.style.left = x + 'px';
    virus.style.top = y + 'px';

    screen.appendChild(virus);

    setTimeout(() => {
        if (virus.parentNode && gameActive && virus.dataset.alive === "true"){
            damageSystem();
            virus.remove();
        }
    }, 2000);
}

// Fonction appelée quand le laser touche un virus
function burnVirus(v) {
    if (v.dataset.alive === "false") return;
    v.dataset.alive = "false";

    score += 100; // On ajoute les points

    // --- VÉRIFICATION VICTOIRE ---
    if (score >= 2000) {
        gameWin();
        return; // On arrête là pour ne pas mettre à jour le HUD inutilement
    }
    // -----------------------------

    v.classList.add('burning');
    setTimeout(() => v.remove(), 300);
    updateHUD();
}


function damageSystem() {
    health -= 10;
    updateHUD();

    const overlay = document.getElementById('damage-overlay');

    // 1. RESET : On retire la classe active pour pouvoir la relancer
    overlay.classList.remove('active');

    // 2. REFLOW : Force le navigateur à prendre en compte le reset
    void overlay.offsetWidth;

    // 3. START : On active l'animation de l'overlay
    overlay.classList.add('active');

    // 4. NETTOYAGE : On retire la classe à la fin pour être propre
    overlay.addEventListener('animationend', () => {
        overlay.classList.remove('active');
    }, { once: true });

    if (health <= 0) gameOver();


    // 3. ACTIVATION
    overlay.classList.add('active');

    // 4. NETTOYAGE APRÈS ANIMATION
    overlay.addEventListener('animationend', () => {
        overlay.classList.remove('active');
        overlay.innerHTML = ''; // On vide pour être propre
    }, { once: true });

    if (health <= 0) gameOver();
}

// --- NOUVELLE FONCTION MATHÉMATIQUE DE COLLISION ---
function checkLaserCollision(originX, originY, mouseX, mouseY) {
    const viruses = document.querySelectorAll('.virus-popup');

    viruses.forEach(virus => {
        if (virus.dataset.alive === "false") return; // Ignorer les morts

        // 1. Obtenir le centre du virus
        // virus.offsetLeft est relatif au parent (.screen-interface), c'est parfait.
        const vCenterX = virus.offsetLeft + (virus.offsetWidth / 2);
        const vCenterY = virus.offsetTop + (virus.offsetHeight / 2);
        const radius = virus.offsetWidth / 2; // Rayon approximatif du virus (30px)

        // 2. Mathématiques : Distance Point (Virus) à Segment (Laser)
        // Segment défini par P1(originX, originY) et P2(mouseX, mouseY)

        const dx = mouseX - originX;
        const dy = mouseY - originY;
        const lenSq = dx * dx + dy * dy; // Longueur au carré du laser

        // Projection scalaire
        // t est la position du virus projetée sur la ligne du laser (0 = base, 1 = bout du laser)
        let t = ((vCenterX - originX) * dx + (vCenterY - originY) * dy) / lenSq;

        // On clippe t entre 0 et 1 car le laser a une longueur finie !
        // Si le virus est derrière la base ou plus loin que la souris, t sera hors limites.
        t = Math.max(0, Math.min(1, t));

        // Coordonnées du point le plus proche sur le rayon laser
        const closestX = originX + t * dx;
        const closestY = originY + t * dy;

        // Distance entre le centre du virus et ce point le plus proche
        const distX = vCenterX - closestX;
        const distY = vCenterY - closestY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        // 3. COLLISION !
        // Si la distance est inférieure au rayon du virus + épaisseur du laser (env 5px)
        if (distance < radius + 5) {
            burnVirus(virus);
        }
    });
}

// --- FONCTION DE DESSIN DU LASER (PARTAGÉE) ---
function drawLaser(e) {
    const screen = document.querySelector('.screen-interface');
    const laser = document.getElementById('laser-beam');
    if (!screen || !laser) return;

    const rect = screen.getBoundingClientRect();
    const scaleX = rect.width / screen.offsetWidth;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const maxSlide = 80;
    const ratioX = Math.max(0, Math.min(1, mouseX / rect.width));
    const baseOffsetX = (ratioX - 0.5) * maxSlide;

    laser.style.left = `calc(50% + ${baseOffsetX}px)`;

    const originX = (rect.width / 2) + (baseOffsetX * scaleX);
    const originY = rect.height;

    const deltaX = mouseX - originX;
    const deltaY = mouseY - originY;

    const visualDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const length = visualDistance / scaleX;

    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;

    laser.style.height = `${length}px`;
    laser.style.transform = `rotate(${angle}deg)`;

    // Vérifier les collisions car le laser est affiché
    const cssMouseX = mouseX / scaleX;
    const cssMouseY = mouseY / scaleX;
    const cssOriginX = (screen.offsetWidth / 2) + baseOffsetX;
    const cssOriginY = screen.offsetHeight;

    checkLaserCollision(cssOriginX, cssOriginY, cssMouseX, cssMouseY);
}


// --- GESTION DU CLIC (TIR + CHEAT) ---
document.addEventListener('mousedown', (e) => {
    if (!gameActive) return;

    // 1. Gestion du Cheat Code
    const now = Date.now();
    clickHistory.push(now);

    // On ne garde que les clics dela dermeier seconde
    clickHistory = clickHistory.filter(timestamp => now - timestamp < 1000);

    // Si 5 clics ou plus en 1  sec -> Activation CHEAT
    if (clickHistory.length >= 5 && !isCheatActive) {
        isCheatActive = true;
        // Petit effet sonore ou visuel console
        console.log("CHEAT ACTIVATED: INFINITE LASER");
        updateHUD(); // Pour changer la couleur du HUD
    }

    // 2. Affichage du Laser
    const laser = document.getElementById('laser-beam');
    laser.style.display = 'block';

    // On calcule tout de suite la position (pour que ça tire instantanément là où on clique)
    drawLaser(e);

    // 3. Gestion de la disparition (Sauf si cheat actif)
    if (!isCheatActive) {
        // On annule le précédent timer si on clique très vite (pour pas que ça clignote)
        if (laserTimeout) clearTimeout(laserTimeout);

        laserTimeout = setTimeout(() => {
            // On revérifie si le cheat n'a pas été activé entre temps
            if (!isCheatActive) {
                laser.style.display = 'none';
            }
        }, 20); // 0.02 secondes
    }
});


// --- GESTION DU MOUVEMENT (SUIVI) ---
document.addEventListener('mousemove', (e) => {
    if (!gameActive) return;

    const laser = document.getElementById('laser-beam');

    // Si le laser est visible (soit via le clic temporaire, soit via le cheat)
    // On met à jour sa position et ses collisions
    if (laser && laser.style.display !== 'none') {
        drawLaser(e);
    }
});



// --- GESTION DE L'ÉCRAN DE FIN ---
function showEndScreen(type) {
    // 1. Arrêt du jeu
    gameActive = false;
    clearTimeout(spawnInterval);
    document.querySelectorAll('.virus-popup').forEach(v => v.remove());

    // Cacher le HUD et le Laser
    document.getElementById('game-hud').style.display = 'none';
    document.getElementById('laser-beam').style.display = 'none';

    // 2. Préparation de l'écran
    const endScreen = document.getElementById('end-screen');
    const endTitle = document.getElementById('end-title');
    const endMsg = document.getElementById('end-msg');
    const endScore = document.getElementById('end-score');

    // Reset des classes
    endScreen.className = '';

    if (type === 'win') {
        endScreen.classList.add('win');
        endTitle.innerText = "MISSION ACCOMPLIE";
        endMsg.innerText = "Le système est purifié. Goliath a été repoussé.";
        // Petit son de victoire si tu en as un jour
    } else {
        endScreen.classList.add('lose');
        endTitle.innerText = "ÉCHEC CRITIQUE";
        endMsg.innerText = "Le système a été corrompu par les Big Tech.";
    }

    endScore.innerText = `SCORE FINAL: ${score}`;

    // 3. Affichage
    endScreen.style.display = 'block';

    // On retire le mode "Jeu Actif" pour arrêter les animations de fond éventuelles
    document.body.classList.remove('game-active');
}


function gameWin() {
    // Appel de la nouvelle fonction avec le paramètre 'win'
    showEndScreen('win');
}

function gameOver() {
    // Appel de la nouvelle fonction avec le paramètre 'lose'
    showEndScreen('lose');
}




