/**
 * Módulo de Menú Principal (menu.js)
 * Controla la pantalla de inicio clásica de Minecraft, frases splash, sintetizador de audio y transiciones de vistas.
 */

// Lista de frases para el Splash Text amarillo de Minecraft
const SPLASH_TEXTS = [
    "¡Plataformas de Desarrollo 2026!",
    "¡100% Vanilla JavaScript!",
    "¡Astroworld API Connected!",
    "¡Crafting in the DOM!",
    "¡Async/Await Power!",
    "¡No Libraries Needed!",
    "¡Responsive CSS3 Grid!",
    "¡Got your nose!",
    "¡Creeper? Aww man!",
    "¡10/10 Parcial Ready!"
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
        const randomSplash = SPLASH_TEXTS[Math.floor(Math.random() * SPLASH_TEXTS.length)];
        splashEl.textContent = randomSplash;
    }

    // Agregar sonido a todos los botones estilo Minecraft
    document.addEventListener('click', (e) => {
        if (e.target.closest('.mc-btn') || e.target.closest('.nav-tab-btn')) {
            sfx.playClick();
        }
    });

    const mainMenu = document.getElementById('main-menu-screen');
    const explorerSection = document.getElementById('explorer-screen');
    const sandboxSection = document.getElementById('sandbox-screen');

    // Botón Singleplayer -> Ir al Explorador de API
    const btnSingleplayer = document.getElementById('btn-singleplayer');
    if (btnSingleplayer) {
        btnSingleplayer.addEventListener('click', () => {
            switchView('explorer');
        });
    }

    // Botón Sandbox 3D -> Ir al visor 3D de CSS Minecraft
    const btnSandbox = document.getElementById('btn-sandbox-3d');
    if (btnSandbox) {
        btnSandbox.addEventListener('click', () => {
            switchView('sandbox');
        });
    }

    // Botón Opciones / Bitácora IA -> Abrir modal de PROMPTS.md
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
            alert('¡Gracias por jugar con el Minecraft Hub! Puedes volver al menú principal en cualquier momento.');
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
}

/**
 * Alterna entre las vistas SPA: 'menu', 'explorer', 'sandbox'
 * @param {string} viewName 
 */
function switchView(viewName) {
    const mainMenu = document.getElementById('main-menu-screen');
    const explorerSection = document.getElementById('explorer-screen');
    const sandboxSection = document.getElementById('sandbox-screen');

    if (viewName === 'explorer') {
        mainMenu.classList.add('hidden');
        sandboxSection.classList.add('hidden');
        explorerSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Si es la primera vez que se entra, inicializar carga de la API
        if (window.app && typeof window.app.initOnce === 'function') {
            window.app.initOnce();
        }
    } else if (viewName === 'sandbox') {
        mainMenu.classList.add('hidden');
        explorerSection.classList.add('hidden');
        sandboxSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Vista 'menu'
        explorerSection.classList.add('hidden');
        sandboxSection.classList.add('hidden');
        mainMenu.classList.remove('hidden');
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
                    <div class="detail-section">
                        <h4>1. Modelo de IA Utilizado</h4>
                        <p><strong>Google Gemini</strong> (asistente de programación Antigravity).</p>
                    </div>
                    <div class="detail-section">
                        <h4>2. Prompts Clave de Desarrollo</h4>
                        <ul>
                            <li><strong>Asincronismo & API:</strong> Estructuración de peticiones remotas con <code>fetch()</code> y <code>async/await</code> para la API de Astroworld con validación de estados HTTP.</li>
                            <li><strong>Filtrado Reactivo en Memoria:</strong> Lógica de búsqueda combinada (texto + categoría) en arreglos de datos sin recargar la página.</li>
                            <li><strong>Manipulación del DOM:</strong> Renderizado dinámico de tarjetas, badges de vida y control de estados (Loading, Empty, Error).</li>
                            <li><strong>Maquetación Semántica:</strong> HTML5 nativo y CSS3 con temática clásica de Minecraft (Main menu, botones de piedra y Grid).</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>3. Justificación de Decisiones</h4>
                        <p><strong>Aceptadas:</strong> Modularización del código JS (api.js, dom.js, app.js), filtros adaptativos dinámicos, audio sintetizado nativo y recuperación de errores con botón de reintento.</p>
                        <p><strong>Descartadas:</strong> Librerías externas (Axios, React, Bootstrap) y datos JSON estáticos locales para cumplir al 100% con la consigna.</p>
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
