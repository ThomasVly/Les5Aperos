import * as THREE from 'three';

// ==================== CONSTANTES DE CONFIGURATION ====================
const CONFIG = {
    // Analyse audio
    FFT_SIZE: 2048,
    ANALYSIS_INTERVAL_MS: 20,
    
    // Détection de beats
    BEAT_THRESHOLD: 1.35,
    ENERGY_HISTORY_SIZE: 43,
    
    // Bandes de fréquences
    BASS_RANGE: [0, 10],
    MID_RANGE: [10, 40],
    TREBLE_RANGE: [40, 100],
    
    // Visualisation
    SPHERE_RADIUS: 3,
    SPHERE_DETAIL: 30,
    CAMERA_DISTANCE: 14,
    
    // Animation
    BEAT_PULSE_DURATION: 100,
    DEFORMATION_INTENSITY: 1.2,
};

// ==================== GEOMETRIES DISPONIBLES ====================
const GEOMETRIES = [
    { name: 'Sphere', create: (radius, detail) => new THREE.IcosahedronGeometry(radius, detail) },
    { name: 'Cube', create: (radius, detail) => new THREE.BoxGeometry(radius * 2, radius * 2, radius * 2, detail, detail, detail) },
    { name: 'Torus', create: (radius, detail) => new THREE.TorusGeometry(radius * 0.8, radius * 0.3, detail, detail * 2) },
];

let currentGeometryIndex = 0;
let lastGeometryChange = Date.now();
const GEOMETRY_CHANGE_INTERVAL = 5000; // 10 secondes

// ==================== VARIABLES GLOBALES ====================
let scene, camera, renderer, sphere;
let audioContext, analyser, audioSource;
let isPlaying = false;
let isPaused = false;
let startTime = 0;
let pauseTime = 0;
let animationId = null;
let originalPositions = [];

// Stockage des morceaux
const songsLibrary = [];
let currentSongIndex = -1;
let colorTime = 0;
let manualColor = null; // null = rainbow automatique, sinon couleur manuelle

// Liste des fichiers audio par défaut
const DEFAULT_SONGS = [
    { path: '/frontend/src/SCC_Tech.mp3', name: 'Techno toujours pareil' }
];

// API exportée
export const audioData = {
    beatmap: [],
    audioBuffer: null,
    
    getCurrentBeat() {
        if (!isPlaying || currentSongIndex < 0) return null;
        const currentTime = audioContext.currentTime - startTime;
        return songsLibrary[currentSongIndex]?.beatmap?.find(beat => Math.abs(beat.time - currentTime) < 0.05);
    },
    
    getEnergyBands() {
        if (!analyser) return { bass: 0, mid: 0, treble: 0, overall: 0 };
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        
        const bass = getAverageFrequency(dataArray, CONFIG.BASS_RANGE[0], CONFIG.BASS_RANGE[1]);
        const mid = getAverageFrequency(dataArray, CONFIG.MID_RANGE[0], CONFIG.MID_RANGE[1]);
        const treble = getAverageFrequency(dataArray, CONFIG.TREBLE_RANGE[0], CONFIG.TREBLE_RANGE[1]);
        const overall = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
        
        return { bass, mid, treble, overall };
    },
    
    isOnBeat(tolerance = 0.1) {
        if (!isPlaying || currentSongIndex < 0) return false;
        const currentTime = audioContext.currentTime - startTime;
        return songsLibrary[currentSongIndex]?.beatmap?.some(beat => Math.abs(beat.time - currentTime) < tolerance);
    }
};

// ==================== INITIALISATION THREE.JS ====================
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, CONFIG.CAMERA_DISTANCE);
    camera.lookAt(0, 0, 0);
    
    // Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x667eea, 1, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x764ba2, 1, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);
    
    // Sphère
    const geometry = new THREE.IcosahedronGeometry(CONFIG.SPHERE_RADIUS, CONFIG.SPHERE_DETAIL);
    const material = new THREE.MeshStandardMaterial({
        color: 0x667eea,
        wireframe: true,
        emissive: 0x667eea,
        emissiveIntensity: 0.3,
    });
    
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    // Sauvegarder les positions originales
    const positions = sphere.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        originalPositions.push(new THREE.Vector3(
            positions.getX(i),
            positions.getY(i),
            positions.getZ(i)
        ));
    }
    
    // Gestion du redimensionnement
    window.addEventListener('resize', onWindowResize);
    
    // Démarrer la boucle de rendu
    animate();
}

function onWindowResize() {
    const container = document.getElementById('canvas-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function changeGeometry() {
    if (!sphere) return;
    
    currentGeometryIndex = (currentGeometryIndex + 1) % GEOMETRIES.length;
    const geometryConfig = GEOMETRIES[currentGeometryIndex];
    
    // Créer la nouvelle géométrie
    const newGeometry = geometryConfig.create(CONFIG.SPHERE_RADIUS, CONFIG.SPHERE_DETAIL);
    
    // Remplacer la géométrie
    sphere.geometry.dispose();
    sphere.geometry = newGeometry;
    
    // Mettre à jour les positions originales
    originalPositions = [];
    const positions = sphere.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        originalPositions.push(new THREE.Vector3(
            positions.getX(i),
            positions.getY(i),
            positions.getZ(i)
        ));
    }
    
    console.log(`Changement de forme: ${geometryConfig.name}`);
}

// ==================== INITIALISATION AUDIO ====================
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = CONFIG.FFT_SIZE;
        analyser.connect(audioContext.destination);
    }
}

// ==================== GESTION DE LA LISTE ====================
function renderSongsList() {
    const songsList = document.getElementById('songs-list');
    
    if (songsLibrary.length === 0) {
        songsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">♪♫</div>
                <p>Aucun son chargé</p>
                <p style="font-size: 0.85em; margin-top: 10px;">Cliquez sur "Ajouter un son" pour commencer</p>
            </div>
        `;
        return;
    }
    
    songsList.innerHTML = '';
    
    songsLibrary.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        if (index === currentSongIndex) songItem.classList.add('active');
        if (song.analyzing) songItem.classList.add('analyzing');
        
        const duration = song.audioBuffer ? song.audioBuffer.duration : 0;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const durationStr = song.audioBuffer ? `${minutes}:${seconds.toString().padStart(2, '0')}` : '--:--';
        
        const bpm = song.bpm || '---';
        const beatsCount = song.beatmap ? song.beatmap.length : '---';
        
        songItem.innerHTML = `
            <div class="song-name">${song.name}</div>
            <div class="song-info">
                <span>⏱️ ${durationStr}</span>
                <span>♫ ${bpm} BPM</span>
            </div>
        `;
        
        songItem.addEventListener('click', () => {
            if (song.ready) {
                playSong(index);
            }
        });
        
        songsList.appendChild(songItem);
    });
}

// ==================== CHARGEMENT DES FICHIERS ====================
async function loadSongFile(file) {
    const songData = {
        name: file.name.replace(/\.[^/.]+$/, ''),
        file: file,
        audioBuffer: null,
        beatmap: null,
        bpm: null,
        ready: false,
        analyzing: true
    };
    
    const index = songsLibrary.push(songData) - 1;
    renderSongsList();
    
    try {
        initAudioContext();
        
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        songsLibrary[index].audioBuffer = audioBuffer;
        console.log(`Audio chargé: ${audioBuffer.duration.toFixed(2)}s`);
        
        // Analyser le morceau
        const analysisResult = await analyzeSong(audioBuffer);
        songsLibrary[index].beatmap = analysisResult.beatmap;
        songsLibrary[index].bpm = analysisResult.bpm;
        songsLibrary[index].analyzing = false;
        songsLibrary[index].ready = true;
        
        renderSongsList();
        
        console.log(`Analyse terminée: ${analysisResult.beatmap.length} beats détectés`);
        
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        songsLibrary.splice(index, 1);
        renderSongsList();
        alert(`Erreur lors du chargement de ${file.name}`);
    }
}

async function loadSongFromURL(url, name) {
    const songData = {
        name: name,
        url: url,
        audioBuffer: null,
        beatmap: null,
        bpm: null,
        ready: false,
        analyzing: true
    };
    
    const index = songsLibrary.push(songData) - 1;
    renderSongsList();
    
    try {
        initAudioContext();
        
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        songsLibrary[index].audioBuffer = audioBuffer;
        console.log(`Audio chargé: ${name} - ${audioBuffer.duration.toFixed(2)}s`);
        
        const analysisResult = await analyzeSong(audioBuffer);
        songsLibrary[index].beatmap = analysisResult.beatmap;
        songsLibrary[index].bpm = analysisResult.bpm;
        songsLibrary[index].analyzing = false;
        songsLibrary[index].ready = true;
        
        renderSongsList();
        
        console.log(`${name}: ${analysisResult.beatmap.length} beats détectés`);
        
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        songsLibrary.splice(index, 1);
        renderSongsList();
    }
}

// Event listener pour l'ajout de fichiers
document.getElementById('file-input').addEventListener('change', async (event) => {
    const files = Array.from(event.target.files);
    
    for (const file of files) {
        if (file.type.startsWith('audio/')) {
            await loadSongFile(file);
        }
    }
    
    event.target.value = '';
});

// ==================== ANALYSE AUDIO ====================
async function analyzeSong(audioBuffer) {
    const sampleRate = audioBuffer.sampleRate;
    const channelData = audioBuffer.getChannelData(0);
    const samplesPerAnalysis = Math.floor(sampleRate * CONFIG.ANALYSIS_INTERVAL_MS / 1000);
    
    const energyHistory = [];
    const detectedBeats = [];
    
    for (let i = 0; i < channelData.length; i += samplesPerAnalysis) {
        const chunk = channelData.slice(i, i + samplesPerAnalysis);
        
        const bassEnergy = calculateBandEnergy(chunk, 'bass');
        const midEnergy = calculateBandEnergy(chunk, 'mid');
        const trebleEnergy = calculateBandEnergy(chunk, 'treble');
        
        energyHistory.push(bassEnergy);
        if (energyHistory.length > CONFIG.ENERGY_HISTORY_SIZE) {
            energyHistory.shift();
        }
        
        const averageEnergy = energyHistory.reduce((sum, e) => sum + e, 0) / energyHistory.length;
        
        if (bassEnergy > averageEnergy * CONFIG.BEAT_THRESHOLD && energyHistory.length >= CONFIG.ENERGY_HISTORY_SIZE) {
            const time = i / sampleRate;
            
            if (detectedBeats.length === 0 || time - detectedBeats[detectedBeats.length - 1].time > 0.1) {
                const intensity = Math.min((bassEnergy / averageEnergy) - 1, 1);
                
                detectedBeats.push({
                    time,
                    intensity,
                    bassEnergy: bassEnergy / 255,
                    midEnergy: midEnergy / 255,
                    trebleEnergy: trebleEnergy / 255,
                    fired: false
                });
            }
        }
    }
    
    const bpm = calculateBPM(detectedBeats);
    
    return { beatmap: detectedBeats, bpm, duration: audioBuffer.duration };
}

function calculateRMS(chunk) {
    let sum = 0;
    for (let i = 0; i < chunk.length; i++) {
        sum += chunk[i] * chunk[i];
    }
    return Math.sqrt(sum / chunk.length) * 255;
}

function calculateBandEnergy(chunk, band) {
    let sum = 0;
    let weight = 1;
    
    if (band === 'bass') {
        weight = 1.5;
    } else if (band === 'treble') {
        weight = 0.7;
    }
    
    for (let i = 0; i < chunk.length; i++) {
        sum += Math.abs(chunk[i]);
    }
    
    return (sum / chunk.length) * 255 * weight;
}

function calculateBPM(beats) {
    if (beats.length < 2) return 0;
    
    const intervals = [];
    for (let i = 1; i < beats.length; i++) {
        intervals.push(beats[i].time - beats[i - 1].time);
    }
    
    const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
    return Math.round(60 / avgInterval);
}

function getAverageFrequency(dataArray, startIndex, endIndex) {
    let sum = 0;
    let count = 0;
    
    for (let i = startIndex; i <= endIndex && i < dataArray.length; i++) {
        sum += dataArray[i];
        count++;
    }
    
    return count > 0 ? sum / count : 0;
}

// ==================== LECTURE ====================
function playSong(index) {
    if (index < 0 || index >= songsLibrary.length || !songsLibrary[index].ready) return;
    
    // Arrêter la lecture en cours
    if (audioSource) {
        audioSource.stop();
        audioSource.disconnect();
    }
    
    currentSongIndex = index;
    const song = songsLibrary[index];
    
    // Réinitialiser les flags fired
    song.beatmap.forEach(beat => beat.fired = false);
    
    // Créer la source audio
    audioSource = audioContext.createBufferSource();
    audioSource.buffer = song.audioBuffer;
    audioSource.loop = true;
    audioSource.connect(analyser);
    audioSource.start(0);
    
    isPlaying = true;
    isPaused = false;
    pauseTime = 0;
    startTime = audioContext.currentTime;
    
    // Mettre à jour l'UI
    renderSongsList();
    document.getElementById('center-message').style.display = 'none';
    
    // Afficher les infos
    const duration = song.audioBuffer.duration;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    //document.getElementById('duration-value').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    //document.getElementById('bpm-value').textContent = song.bpm || 'N/A';
    //document.getElementById('beats-value').textContent = song.beatmap.length;
    //document.getElementById('info-overlay').classList.add('visible');
    
    // Afficher les contrôles audio
    document.getElementById('audio-controls').classList.add('visible');
    document.getElementById('total-time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('play-pause-icon').textContent = '⏸';
    
    console.log(`Lecture: ${song.name}`);
}

// ==================== CONTRÔLES AUDIO ====================
function togglePlayPause() {
    if (currentSongIndex < 0) return;
    
    if (isPlaying && !isPaused) {
        pauseAudio();
    } else if (isPaused) {
        resumeAudio();
    }
}

function pauseAudio() {
    if (!isPlaying || isPaused) return;
    
    // Sauvegarder le temps actuel
    pauseTime = audioContext.currentTime - startTime;
    
    // Arrêter la source
    if (audioSource) {
        audioSource.stop();
        audioSource.disconnect();
    }
    
    isPaused = true;
    isPlaying = false;
    
    // Mettre à jour l'icône
    document.getElementById('play-pause-icon').textContent = '▶';
    
    console.log(`Pause à ${pauseTime.toFixed(2)}s`);
}

function resumeAudio() {
    if (!isPaused || currentSongIndex < 0) return;
    
    const song = songsLibrary[currentSongIndex];
    
    // Créer une nouvelle source
    audioSource = audioContext.createBufferSource();
    audioSource.buffer = song.audioBuffer;
    audioSource.loop = true;
    audioSource.connect(analyser);
    audioSource.start(0, pauseTime);
    
    // Ajuster le temps de départ
    startTime = audioContext.currentTime - pauseTime;
    
    isPaused = false;
    isPlaying = true;
    
    // Mettre à jour l'icône
    document.getElementById('play-pause-icon').textContent = '⏸';
    
    console.log(`Reprise depuis ${pauseTime.toFixed(2)}s`);
}

function seekTo(percentage) {
    if (currentSongIndex < 0) return;
    
    const song = songsLibrary[currentSongIndex];
    const duration = song.audioBuffer.duration;
    const newTime = duration * percentage;
    
    // Arrêter la source actuelle
    if (audioSource) {
        audioSource.stop();
        audioSource.disconnect();
    }
    
    // Créer une nouvelle source au nouveau temps
    audioSource = audioContext.createBufferSource();
    audioSource.buffer = song.audioBuffer;
    audioSource.loop = true;
    audioSource.connect(analyser);
    audioSource.start(0, newTime);
    
    // Mettre à jour les temps
    startTime = audioContext.currentTime - newTime;
    pauseTime = newTime;
    
    if (!isPlaying && !isPaused) {
        // Si ce n'était pas en lecture, mettre en pause
        audioSource.stop();
        audioSource.disconnect();
        isPaused = true;
    } else {
        isPlaying = true;
        isPaused = false;
    }
    
    console.log(`Seek vers ${newTime.toFixed(2)}s`);
}

function updateProgressBar() {
    if (currentSongIndex < 0 || !isPlaying) return;
    
    const song = songsLibrary[currentSongIndex];
    let currentTime = audioContext.currentTime - startTime;
    const duration = song.audioBuffer.duration;
    
    // Gérer la boucle : ramener le temps dans la durée de la chanson
    currentTime = currentTime % duration;
    
    const percentage = (currentTime / duration) * 100;
    
    // Mettre à jour la barre de progression
    document.getElementById('progress-fill').style.width = `${percentage}%`;
    
    // Mettre à jour le temps actuel
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    document.getElementById('current-time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// ==================== EVENT LISTENERS ====================
document.getElementById('play-pause-btn').addEventListener('click', togglePlayPause);

document.getElementById('progress-bar').addEventListener('click', (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = x / rect.width;
    seekTo(percentage);
});

// Color picker event listeners
const colorPickerBtn = document.getElementById('color-picker-btn');
const colorSliderPanel = document.getElementById('color-slider-panel');
const colorSlider = document.getElementById('color-slider');

let clickTimeout = null;

// Gestion du clic simple vs double-clic
colorPickerBtn.addEventListener('click', (event) => {
    event.preventDefault();
    
    if (clickTimeout !== null) {
        // Double-clic détecté
        clearTimeout(clickTimeout);
        clickTimeout = null;
        
        // Retour au mode rainbow
        manualColor = null;
        colorSliderPanel.classList.remove('active');
        console.log('Retour au mode rainbow automatique');
    } else {
        // Premier clic - attendre pour voir si double-clic
        clickTimeout = setTimeout(() => {
            // Simple clic confirmé - toggle le slider
            colorSliderPanel.classList.toggle('active');
            clickTimeout = null;
        }, 250);
    }
});

// Fonction pour calculer la couleur RGB à partir de la position du slider
function getColorFromSliderValue(value) {
    // Convertir 0-360 en couleur RGB
    const hue = value;
    const c = 1; // Chroma à 100%
    const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
    const m = 0;
    
    let r, g, b;
    if (hue >= 0 && hue < 60) {
        [r, g, b] = [c, x, 0];
    } else if (hue >= 60 && hue < 120) {
        [r, g, b] = [x, c, 0];
    } else if (hue >= 120 && hue < 180) {
        [r, g, b] = [0, c, x];
    } else if (hue >= 180 && hue < 240) {
        [r, g, b] = [0, x, c];
    } else if (hue >= 240 && hue < 300) {
        [r, g, b] = [x, 0, c];
    } else {
        [r, g, b] = [c, 0, x];
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return `rgb(${r}, ${g}, ${b})`;
}

// Fonction pour mettre à jour la couleur du thumb
function updateThumbColor(value) {
    const color = getColorFromSliderValue(value);
    colorSlider.style.setProperty('--thumb-color', color);
}

// Quand le slider change
colorSlider.addEventListener('input', (event) => {
    const hue = parseInt(event.target.value);
    manualColor = hue / 360; // Convertir 0-360 en 0-1 pour HSL
    updateThumbColor(hue);
    console.log(`Couleur manuelle sélectionnée: hue=${hue}`);
});

// Initialiser la couleur du thumb au chargement
updateThumbColor(colorSlider.value);

// ==================== BOUCLE D'ANIMATION ====================
function animate() {
    animationId = requestAnimationFrame(animate);
    
    if (!sphere) return;
    
    sphere.rotation.y += 0.002;
    
    // Vérifier si c'est le moment de changer de forme
    if (isPlaying && Date.now() - lastGeometryChange > GEOMETRY_CHANGE_INTERVAL) {
        changeGeometry();
        lastGeometryChange = Date.now();
    }
    
    if (analyser && isPlaying && currentSongIndex >= 0) {
        // Update color time for smooth rainbow cycling (0.15 cycles per second)
        colorTime += 0.15 / 60;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        
        const bassEnergy = getAverageFrequency(dataArray, CONFIG.BASS_RANGE[0], CONFIG.BASS_RANGE[1]) / 255;
        const midEnergy = getAverageFrequency(dataArray, CONFIG.MID_RANGE[0], CONFIG.MID_RANGE[1]) / 255;
        const trebleEnergy = getAverageFrequency(dataArray, CONFIG.TREBLE_RANGE[0], CONFIG.TREBLE_RANGE[1]) / 255;
        
        const currentTime = audioContext.currentTime - startTime;
        const currentBeat = songsLibrary[currentSongIndex].beatmap.find(beat => Math.abs(beat.time - currentTime) < 0.05);
        
        deformSphere(bassEnergy, midEnergy, trebleEnergy, currentBeat);
        
        if (currentBeat && !currentBeat.fired) {
            currentBeat.fired = true;
            window.dispatchEvent(new CustomEvent('beatHit', {
                detail: {
                    time: currentBeat.time,
                    intensity: currentBeat.intensity
                }
            }));
        }
        
        // Mettre à jour la barre de progression
        updateProgressBar();
    }
    
    renderer.render(scene, camera);
}

// ==================== DÉFORMATION ====================
function deformSphere(bassEnergy, midEnergy, trebleEnergy, currentBeat) {
    const positions = sphere.geometry.attributes.position;
    const time = Date.now() * 0.001;
    
    const globalScale = 1 + bassEnergy * 0.15;
    sphere.scale.setScalar(globalScale);
    
    let beatPulse = 0;
    if (currentBeat) {
        beatPulse = currentBeat.intensity * 2.0;
    }
    
    for (let i = 0; i < positions.count; i++) {
        const original = originalPositions[i];
        
        const noiseX = Math.sin(original.x * 2 + time * 2) * Math.cos(original.y * 2);
        const noiseY = Math.cos(original.y * 2 + time * 2) * Math.sin(original.z * 2);
        const noiseZ = Math.sin(original.z * 2 + time * 2) * Math.cos(original.x * 2);
        
        const bassAmp = bassEnergy * 0.8;
        const midAmp = midEnergy * 0.6;
        const trebleAmp = trebleEnergy * 0.4;
        
        const factor = 1 + (noiseX * bassAmp + noiseY * midAmp + noiseZ * trebleAmp) * CONFIG.DEFORMATION_INTENSITY;
        
        if (currentBeat) {
            const direction = original.clone().normalize();
            const radialDeformation = beatPulse * 0.3;
            
            positions.setXYZ(
                i,
                original.x * factor + direction.x * radialDeformation,
                original.y * factor + direction.y * radialDeformation,
                original.z * factor + direction.z * radialDeformation
            );
        } else {
            positions.setXYZ(
                i,
                original.x * factor,
                original.y * factor,
                original.z * factor
            );
        }
    }
    
    positions.needsUpdate = true;
    
    // Couleur : manuelle ou rainbow automatique
    const baseHue = manualColor !== null ? manualColor : (colorTime % 1.0);
    const energyIntensity = (bassEnergy * 0.4 + midEnergy * 0.3 + trebleEnergy * 0.3);
    const lightness = 0.4 + energyIntensity * 0.3; // Pulse brightness with music
    const emissiveIntensity = 0.2 + energyIntensity * 0.4; // Stronger emissive pulse
    
    sphere.material.color.setHSL(baseHue, 0.9, lightness);
    sphere.material.emissive.setHSL(baseHue, 0.9, emissiveIntensity);
}

// ==================== DÉMARRAGE ====================
initThreeJS();
console.log('Audio Visualizer initialisé ✨');

// Charger les fichiers par défaut
DEFAULT_SONGS.forEach(song => {
    loadSongFromURL(song.path, song.name);
});
