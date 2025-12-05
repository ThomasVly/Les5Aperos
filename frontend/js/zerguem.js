let score = 0;
let health = 100;
let gameActive = false;
let spawnInterval;


// --- NOUVELLES VARIABLES DE DIFFICULTÉ ---
let difficultySpeed = 1000; // Temps entre l'apparition des virus (ms)
let damageDelay = 2000;     // Temps avant que le virus n'attaque (ms)

// Variables pour le Cheat Code
let clickHistory = []; // Historique des timestamps des clics
let isCheatActive = false; // Est-ce que le mode permanent est activé ?
let laserTimeout; // Pour gérer la disparition du laser

function startGameLaser() {
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
    }, damageDelay);
}

// Fonction appelée quand le laser touche un virus
function burnVirus(v) {
    if (v.dataset.alive === "false") return;
    v.dataset.alive = "false";

    score += 100;

    // --- DIFFICULTÉ SANS LIMITE (NO LIMIT) ---

    // On retire le Math.max(...). La vitesse descend purement linéairement.
    difficultySpeed = 1500 - (score / 5);
    damageDelay = 2000 - (score / 5);

    // Petite sécurité technique : on ne descend pas en dessous de 1ms
    // (Sinon à 30 000 points, le jeu deviendrait négatif et buguerait)
    if (difficultySpeed < 1) difficultySpeed = 1;
    if (damageDelay < 1) damageDelay = 1;

    // ------------------------------------------

    if (score >= 50000) {
        gameWin();
        return;
    }

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
    gameActive = false;
    clearTimeout(spawnInterval);
    document.querySelectorAll('.virus-popup').forEach(v => v.remove());
    document.getElementById('game-hud').style.display = 'none';
    document.getElementById('laser-beam').style.display = 'none';

    const endScreen = document.getElementById('end-screen');
    const endTitle = document.getElementById('end-title');
    const endMsg = document.getElementById('end-msg');

    endScreen.className = '';

    // Reset Formulaire
    document.getElementById('score-form').style.display = 'block';
    document.getElementById('leaderboard-container').style.display = 'none';
    document.getElementById('player-pseudo').value = '';
    document.getElementById('player-pseudo').disabled = false;

    if (type === 'win') {
        endScreen.classList.add('win');
        endTitle.innerText = "MISSION ACCOMPLIE";
        endMsg.innerText = "Système purifié.";
    } else {
        endScreen.classList.add('lose');
        endTitle.innerText = "ÉCHEC CRITIQUE";
        endMsg.innerText = "Système corrompu.";
    }

    document.getElementById('end-score-display').innerText = `SCORE FINAL: ${score}`;
    endScreen.style.display = 'block';
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


function submitScore() {
    const pseudoInput = document.getElementById('player-pseudo');
    const pseudo = pseudoInput.value.trim() || 'ANONYME';

    if(pseudo.length === 0) return;
    pseudoInput.disabled = true;

    // Appel à notre nouvelle route Flask
    fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pseudo: pseudo, score: score }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('score-form').style.display = 'none';
            loadLeaderboard();
        } else {
            alert("Erreur de connexion serveur.");
            pseudoInput.disabled = false;
        }
    });
}

function loadLeaderboard() {
    const container = document.getElementById('leaderboard-container');
    const table = document.getElementById('leaderboard-table');

    container.style.display = 'block';
    table.innerHTML = '<tr><td colspan="2">CHARGEMENT...</td></tr>';

    fetch('/api/leaderboard')
    .then(response => response.json())
    .then(data => {
        table.innerHTML = '';
        data.forEach((entry, index) => {
            const row = document.createElement('tr');
            let rank = (index + 1) + '.';
            if(index === 0) rank = '🥇';
            if(index === 1) rank = '🥈';
            if(index === 2) rank = '🥉';

            row.innerHTML = `<td>${rank} ${entry.pseudo}</td><td>${entry.score}</td>`;
            table.appendChild(row);
        });
    })
}





