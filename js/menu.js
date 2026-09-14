/**
 * Módulo de Menú Principal (menu.js)
 * Controla la pantalla de inicio clásica de Minecraft, frases splash, sintetizador de audio y transiciones de vistas.
 */

// Lista de frases cortas estilo Minecraft para el Splash Text amarillo
const SPLASH_TEXTS = [
    "¡Got your nose!",
    "¡Also try Limbo!",
    "¡Creeper? Aww man!",
    "¡Vanilla JS!",
    "¡10/10 Parcial!",
    "¡Astroworld!",
    "¡Ianni Edition!",
    "¡Crafting DOM!"
];

/**
 * Sintetizador Web Audio API para el sonido de clic clásico de botones de Minecraft
 */
class SoundEffects {
    constructor() {
        this.audioCtx = null;
        this.soundEnabled = true;
    }

    init() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioCtx = new AudioContext();
            }
        }
    }

    playClick() {
        if (!this.soundEnabled) return;
        try {
            this.init();
            if (!this.audioCtx) return;
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }

            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            // Configurar frecuencia y curva de sonido similar al clic de piedra de Minecraft
            const baseFreq = 800 + Math.random() * 200;
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(baseFreq, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, this.audioCtx.currentTime + 0.04);

            gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.05);
        } catch (e) {
            // Ignorar silenciosamente si el navegador bloquea audio sin interacción previa
        }
    }
}

const sfx = new SoundEffects();

/**
 * Inicializar la pantalla de inicio y eventos de navegación
 */
function initMainMenu() {
    const splashEl = document.getElementById('splash-text');
    if (splashEl) {
        let lastIndex = -1;
        const rotateSplash = () => {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * SPLASH_TEXTS.length);
            } while (nextIndex === lastIndex && SPLASH_TEXTS.length > 1);

            lastIndex = nextIndex;
            splashEl.style.opacity = '0';
            setTimeout(() => {
                splashEl.textContent = SPLASH_TEXTS[nextIndex];
                splashEl.style.opacity = '1';
            }, 180);
        };

        rotateSplash();
        setInterval(rotateSplash, 4000);
    }

    // Agregar sonido a todos los botones, tarjetas y pestañas estilo Minecraft
    document.addEventListener('click', (e) => {
        if (e.target.closest('.mc-btn') || e.target.closest('.nav-tab-btn') || e.target.closest('.card-action-btn') || e.target.closest('.mc-modal-close') || e.target.closest('.mc-card')) {
            sfx.playClick();
        }
    });

    const mainMenu = document.getElementById('main-menu-screen');
    const explorerSection = document.getElementById('explorer-screen');
    const sandboxSection = document.getElementById('sandbox-screen');

    // Botón Singleplayer -> Inicia el juego 3D en Solitario / Offline
    const btnSingleplayer = document.getElementById('btn-singleplayer');
    if (btnSingleplayer) {
        btnSingleplayer.addEventListener('click', () => {
            switchView('singleplayer');
        });
    }

    // Botón Multiplayer -> Inicia el juego 3D Multijugador Real-Time Online
    const btnMultiplayer = document.getElementById('btn-multiplayer');
    if (btnMultiplayer) {
        btnMultiplayer.addEventListener('click', () => {
            switchView('multiplayer');
        });
    }

    // Botón Library -> Abre la Biblioteca y Base de Datos de la API
    const btnLibrary = document.getElementById('btn-library');
    if (btnLibrary) {
        btnLibrary.addEventListener('click', () => {
            switchView('explorer');
        });
    }

    // Botón AI Prompts -> Abrir modal de Bitácora de IA
    const btnPrompts = document.getElementById('btn-prompts-modal');
    if (btnPrompts) {
        btnPrompts.addEventListener('click', () => {
            openPromptsModal();
        });
    }

    // Botón Opciones
    const btnOptions = document.getElementById('btn-options');
    if (btnOptions) {
        btnOptions.addEventListener('click', () => {
            openPromptsModal();
        });
    }

    // Botón Salir
    const btnQuit = document.getElementById('btn-quit');
    if (btnQuit) {
        btnQuit.addEventListener('click', () => {
            alert('¡Gracias por jugar a Minecraft (Ianni Edition)! Puedes alternar entre Singleplayer y Library en cualquier momento.');
        });
    }

    // Botones para volver al Menú Principal desde las otras pantallas
    const backButtons = document.querySelectorAll('.btn-return-menu');
    backButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('menu');
        });
    });

    // Botón para alternar Sandbox 3D desde la barra de navegación del explorador
    const navBtnSandbox = document.getElementById('nav-btn-sandbox');
    if (navBtnSandbox) {
        navBtnSandbox.addEventListener('click', () => {
            switchView('sandbox');
        });
    }

    // Ejecutar pantalla de carga roja inicial estilo Mojang Studios (IANNI STUDIOS)
    runMojangBootScreen();
}

/**
 * Ejecuta la Pantalla de Carga Inicial Roja estilo Mojang Studios / IANNI STUDIOS (4 segundos)
 * @param {Function} onComplete 
 */
function runMojangBootScreen(onComplete) {
    const bootScreen = document.getElementById('app-boot-screen');
    const bootFill = document.getElementById('mojang-boot-fill');

    if (!bootScreen || !bootFill) {
        if (onComplete) onComplete();
        return;
    }

    bootScreen.classList.remove('fade-out');
    bootScreen.style.display = 'flex';
    bootFill.style.width = '0%';

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 1.3 + 0.5;
        if (progress > 100) progress = 100;

        bootFill.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                bootScreen.classList.add('fade-out');
                setTimeout(() => {
                    bootScreen.style.display = 'none';
                    if (onComplete) onComplete();
                }, 400);
            }, 300);
        }
    }, 40);
}

/**
 * Animación de Carga Oficial del Mundo (World Loading Square)
 * @param {Function} onComplete 
 */
function triggerWorldLoading(onComplete) {
    const loadingScreen = document.getElementById('world-loading-screen');
    const label = document.getElementById('loading-percent-label');
    const fill = document.getElementById('loading-square-fill');

    if (!loadingScreen) {
        if (onComplete) onComplete();
        return;
    }

    loadingScreen.classList.remove('hidden');
    if (label) label.textContent = '0%';
    if (fill) fill.style.height = '0%';

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 18) + 12;
        if (progress > 100) progress = 100;

        if (label) label.textContent = `${progress}%`;
        if (fill) fill.style.height = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                if (onComplete) onComplete();
            }, 250);
        }
    }, 120);
}

/**
 * Cambia dinámicamente la vista activa en la aplicación (Menu / Server List / Singleplayer / Multiplayer / Explorer)
 * @param {string} viewName 
 */
function switchView(viewName) {
    const mainMenu = document.getElementById('main-menu-screen');
    const serverListSection = document.getElementById('server-list-screen');
    const explorerSection = document.getElementById('explorer-screen');
    const sandboxSection = document.getElementById('sandbox-screen');
    const mpBadge = document.getElementById('mp-hud-badge');
    const mpChat = document.getElementById('mp-chat-container');

    if (viewName === 'server-list') {
        if (mainMenu) mainMenu.classList.add('hidden');
        if (explorerSection) explorerSection.classList.add('hidden');
        if (sandboxSection) sandboxSection.classList.add('hidden');
        if (serverListSection) serverListSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    if (viewName === 'singleplayer' || viewName === 'multiplayer' || viewName === 'sandbox') {
        const isMp = (viewName === 'multiplayer');
        window.isMultiplayerMode = isMp;

        triggerWorldLoading(() => {
            if (mainMenu) mainMenu.classList.add('hidden');
            if (serverListSection) serverListSection.classList.add('hidden');
            if (explorerSection) explorerSection.classList.add('hidden');
            if (sandboxSection) sandboxSection.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (!isMp) {
                // Modo Solitario / Offline: Ocultar HUD multijugador y desconectar socket
                if (mpBadge) mpBadge.style.display = 'none';
                if (mpChat) mpChat.style.display = 'none';
                if (window.minecraftMultiplayer && typeof window.minecraftMultiplayer.disconnect === 'function') {
                    window.minecraftMultiplayer.disconnect();
                }
            } else {
                // Modo Multijugador: Mostrar HUD multijugador y conectar socket
                if (mpBadge) mpBadge.style.display = 'flex';
                if (mpChat) mpChat.style.display = 'flex';
                if (window.minecraftMultiplayer && typeof window.minecraftMultiplayer.init === 'function') {
                    window.minecraftMultiplayer.init(window.minecraftMultiplayer.username || 'Steve');
                }
            }

            if (window.minecraftSandbox && typeof window.minecraftSandbox.init === 'function') {
                window.minecraftSandbox.init();
            }
        });
        return;
    }

    if (viewName === 'explorer') {
        if (mainMenu) mainMenu.classList.add('hidden');
        if (serverListSection) serverListSection.classList.add('hidden');
        if (sandboxSection) sandboxSection.classList.add('hidden');
        if (explorerSection) explorerSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (window.app && typeof window.app.initOnce === 'function') {
            window.app.initOnce();
        }
    } else {
        if (document.exitPointerLock) document.exitPointerLock();
        if (explorerSection) explorerSection.classList.add('hidden');
        if (sandboxSection) sandboxSection.classList.add('hidden');
        if (serverListSection) serverListSection.classList.add('hidden');
        if (mainMenu) mainMenu.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Abre el modal con la información de la Bitácora de IA (PROMPTS.md)
 */
function openPromptsModal() {
    let modal = document.getElementById('mc-prompts-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'mc-prompts-modal';
        modal.className = 'mc-modal-backdrop active';
        modal.innerHTML = `
            <div class="mc-modal-content" role="dialog" aria-modal="true">
                <div class="mc-modal-header">
                    <h2>Bitácora de IA - PROMPTS.md</h2>
                    <button class="mc-modal-close" id="btn-close-prompts">✖</button>
                </div>
                <div class="mc-modal-body prompts-modal-body">
                    <div class="detail-section" style="background: rgba(255, 183, 197, 0.25); border: 2px solid #ffb7c5; padding: 12px 16px; margin-bottom: 14px; border-radius: 4px;">
                        <h4 style="color: #d81b60; margin-bottom: 6px; font-size: 14px;">📌 Declaración de Uso de IA</h4>
                        <p style="font-size: 12.5px; color: #222; margin: 0; font-weight: 600; line-height: 1.4;">
                            La Inteligencia Artificial (IA) fue utilizada <strong>única y exclusivamente para la planeación del proyecto y la búsqueda de recursos visuales</strong> (referencias de diseño, paletas de colores rosa pastel/sakura, texturas e inspiración estética para el mundo 3D).
                        </p>
                    </div>
                    <div class="detail-section">
                        <h4>1. Modelo de IA Utilizado</h4>
                        <p><strong>Google Gemini</strong> (asistente para planeación y consulta de referencias visuales).</p>
                    </div>
                    <div class="detail-section">
                        <h4>2. Alcance de los Prompts</h4>
                        <ul>
                            <li><strong>Planeación del Proyecto:</strong> Definición de la idea general, organización de requerimientos y estructuración de objetivos.</li>
                            <li><strong>Recursos Visuales:</strong> Búsqueda de imágenes de referencia para la estética Cherry Blossom, paletas de colores rosados/sakura, inspiraciones para animales 3D voxel y skins de personajes.</li>
                        </ul>
                    </div>
                </div>
                <div class="mc-modal-footer">
                    <button class="mc-btn mc-btn-sm" id="btn-ok-prompts">Cerrar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const close = () => modal.classList.remove('active');
        modal.querySelector('#btn-close-prompts').addEventListener('click', close);
        modal.querySelector('#btn-ok-prompts').addEventListener('click', close);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });
    } else {
        modal.classList.add('active');
    }
}
