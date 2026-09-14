/**
 * Módulo de Manipulación del DOM (dom.js)
 * Renderizado dinámico de tarjetas 100% estilo oficial Minecraft GUI:
 * - Sprites pixel-art procedurales para todas las criaturas, ítems, biomas y encantamientos.
 * - Slots de inventario 3D biselados con indicadores de stack.
 * - Cajas de Tooltip / Lore oficiales con paleta de colores de Minecraft.
 * - Rejilla visual 3x3 de Mesa de Crafteo en el modal de detalles.
 * - Eliminación total de bloques de texto planos.
 */

// Utilidad para escapar texto y evitar inyecciones HTML
function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Convertir números a números romanos para niveles de encantamiento
function toRoman(num) {
    const romanMap = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X' };
    return romanMap[num] || num;
}

/**
 * Generador procedural de Sprites Pixel-Art SVG de Minecraft en alta resolución
 * @param {string} name - Nombre o identificador del elemento
 * @param {string} entityType - Tipo de entidad ('mobs' | 'animals' | 'items' | 'biomes' | 'enchantments')
 * @param {Object} item - Datos adicionales del objeto
 * @returns {string} Código SVG del sprite pixelado
 */
function getMinecraftSpriteSvg(name, entityType, item = {}) {
    const n = (name || '').toLowerCase();

    // 1. MOBS & CRIATURAS
    if (entityType === 'mobs') {
        if (n.includes('creeper')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="#4fa83d"/>
                <rect x="1" y="1" width="3" height="3" fill="#6bc458"/>
                <rect x="12" y="1" width="3" height="3" fill="#3b822d"/>
                <rect x="2" y="4" width="4" height="4" fill="#000000"/>
                <rect x="10" y="4" width="4" height="4" fill="#000000"/>
                <rect x="6" y="7" width="4" height="6" fill="#000000"/>
                <rect x="4" y="9" width="2" height="6" fill="#000000"/>
                <rect x="10" y="9" width="2" height="6" fill="#000000"/>
            </svg>`;
        }
        if (n.includes('zombie') || n.includes('zombi') || n.includes('drowned') || n.includes('ahogado')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="#4d7c38"/>
                <rect x="0" y="0" width="16" height="4" fill="#2d4822"/>
                <rect x="2" y="6" width="4" height="3" fill="#1b1b1b"/>
                <rect x="3" y="7" width="2" height="2" fill="#800000"/>
                <rect x="10" y="6" width="4" height="3" fill="#1b1b1b"/>
                <rect x="11" y="7" width="2" height="2" fill="#800000"/>
                <rect x="6" y="9" width="4" height="2" fill="#2a451e"/>
                <rect x="4" y="12" width="8" height="3" fill="#1c3014"/>
            </svg>`;
        }
        if (n.includes('skeleton') || n.includes('esqueleto') || n.includes('stray') || n.includes('wither skeleton')) {
            const isWither = n.includes('wither');
            const baseCol = isWither ? '#1f1f1f' : '#bcbcbc';
            const eyeCol = isWither ? '#ffffff' : '#000000';
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="${baseCol}"/>
                <rect x="2" y="5" width="4" height="4" fill="${eyeCol}"/>
                <rect x="10" y="5" width="4" height="4" fill="${eyeCol}"/>
                <rect x="6" y="9" width="4" height="2" fill="${eyeCol}"/>
                <rect x="3" y="12" width="2" height="3" fill="${eyeCol}"/>
                <rect x="7" y="12" width="2" height="3" fill="${eyeCol}"/>
                <rect x="11" y="12" width="2" height="3" fill="${eyeCol}"/>
            </svg>`;
        }
        if (n.includes('spider') || n.includes('araña')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="#30231d"/>
                <rect x="2" y="7" width="3" height="3" fill="#b81b1b"/>
                <rect x="6" y="8" width="2" height="2" fill="#dd2e2e"/>
                <rect x="8" y="8" width="2" height="2" fill="#dd2e2e"/>
                <rect x="11" y="7" width="3" height="3" fill="#b81b1b"/>
                <rect x="4" y="12" width="8" height="3" fill="#18110e"/>
            </svg>`;
        }
        if (n.includes('enderman') || n.includes('ender dragon') || n.includes('dragon')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="#0d0d0d"/>
                <rect x="1" y="7" width="5" height="2" fill="#cc00fa"/>
                <rect x="2" y="7" width="3" height="2" fill="#ff7dfd"/>
                <rect x="10" y="7" width="5" height="2" fill="#cc00fa"/>
                <rect x="11" y="7" width="3" height="2" fill="#ff7dfd"/>
            </svg>`;
        }
        if (n.includes('blaze')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="#994d00"/>
                <rect x="2" y="2" width="12" height="12" fill="#ffaa00"/>
                <rect x="3" y="6" width="3" height="2" fill="#ffffff"/>
                <rect x="4" y="6" width="2" height="2" fill="#ffff00"/>
                <rect x="10" y="6" width="3" height="2" fill="#ffffff"/>
                <rect x="10" y="6" width="2" height="2" fill="#ffff00"/>
                <rect x="6" y="10" width="4" height="4" fill="#662200"/>
            </svg>`;
        }
        if (n.includes('warden')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="#0b242b"/>
                <rect x="1" y="1" width="3" height="5" fill="#0f454a"/>
                <rect x="12" y="1" width="3" height="5" fill="#0f454a"/>
                <rect x="5" y="8" width="6" height="4" fill="#00ffff"/>
                <rect x="6" y="9" width="4" height="2" fill="#ffffff"/>
            </svg>`;
        }
        // Mob general
        return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
            <rect width="16" height="16" fill="#781d1d"/>
            <rect x="2" y="4" width="4" height="4" fill="#ffffff"/>
            <rect x="3" y="5" width="2" height="2" fill="#000000"/>
            <rect x="10" y="4" width="4" height="4" fill="#ffffff"/>
            <rect x="11" y="5" width="2" height="2" fill="#000000"/>
            <rect x="4" y="11" width="8" height="3" fill="#3b0505"/>
        </svg>`;
    }

    // 2. ANIMALES Y FAUNA
    if (entityType === 'animals') {
        if (n.includes('horse') || n.includes('donkey') || n.includes('mule') || n.includes('caballo') || n.includes('burro')) {
            const isGray = n.includes('donkey') || n.includes('mule') || n.includes('burro');
            const col = isGray ? '#7f7f7f' : '#6b4423';
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="${col}"/>
                <rect x="2" y="1" width="3" height="4" fill="#2d1c0e"/>
                <rect x="11" y="1" width="3" height="4" fill="#2d1c0e"/>
                <rect x="3" y="6" width="3" height="3" fill="#ffffff"/>
                <rect x="4" y="7" width="2" height="2" fill="#000000"/>
                <rect x="10" y="6" width="3" height="3" fill="#ffffff"/>
                <rect x="10" y="7" width="2" height="2" fill="#000000"/>
                <rect x="4" y="10" width="8" height="5" fill="#2d1c0e"/>
                <rect x="5" y="12" width="2" height="2" fill="#000000"/>
                <rect x="9" y="12" width="2" height="2" fill="#000000"/>
            </svg>`;
        }
        if (n.includes('rabbit') || n.includes('conejo')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="#a68463"/>
                <rect x="3" y="0" width="2" height="6" fill="#826142"/>
                <rect x="4" y="1" width="1" height="4" fill="#ffb4b4"/>
                <rect x="11" y="0" width="2" height="6" fill="#826142"/>
                <rect x="11" y="1" width="1" height="4" fill="#ffb4b4"/>
                <rect x="3" y="7" width="3" height="3" fill="#000000"/>
                <rect x="4" y="7" width="1" height="1" fill="#ffffff"/>
                <rect x="10" y="7" width="3" height="3" fill="#000000"/>
                <rect x="11" y="7" width="1" height="1" fill="#ffffff"/>
                <rect x="7" y="11" width="2" height="2" fill="#ff8080"/>
            </svg>`;
        }
        if (n.includes('wolf') || n.includes('lobo') || n.includes('perro') || n.includes('dog')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="#d6d6d6"/>
                <rect x="1" y="1" width="4" height="3" fill="#888888"/>
                <rect x="11" y="1" width="4" height="3" fill="#888888"/>
                <rect x="3" y="6" width="3" height="3" fill="#000000"/>
                <rect x="4" y="7" width="1" height="1" fill="#ffffff"/>
                <rect x="10" y="6" width="3" height="3" fill="#000000"/>
                <rect x="11" y="7" width="1" height="1" fill="#ffffff"/>
                <rect x="5" y="9" width="6" height="4" fill="#ffffff"/>
                <rect x="6" y="10" width="4" height="2" fill="#000000"/>
                <rect x="2" y="13" width="12" height="3" fill="#cc1111"/>
            </svg>`;
        }
        if (n.includes('cat') || n.includes('gato') || n.includes('ocelot')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="#e08e2f"/>
                <rect x="1" y="0" width="3" height="4" fill="#a85e13"/>
                <rect x="12" y="0" width="3" height="4" fill="#a85e13"/>
                <rect x="3" y="6" width="3" height="3" fill="#35b82a"/>
                <rect x="4" y="7" width="1" height="2" fill="#000000"/>
                <rect x="10" y="6" width="3" height="3" fill="#35b82a"/>
                <rect x="11" y="7" width="1" height="2" fill="#000000"/>
                <rect x="6" y="10" width="4" height="3" fill="#ffffff"/>
                <rect x="7" y="10" width="2" height="1" fill="#ff73b3"/>
            </svg>`;
        }
        if (n.includes('cow') || n.includes('vaca') || n.includes('mooshroom')) {
            const isMoo = n.includes('mooshroom');
            const bgCol = isMoo ? '#b01919' : '#61442b';
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="${bgCol}"/>
                <rect x="0" y="0" width="3" height="3" fill="#29211c"/>
                <rect x="13" y="0" width="3" height="3" fill="#29211c"/>
                <rect x="2" y="6" width="3" height="3" fill="#ffffff"/>
                <rect x="3" y="7" width="2" height="2" fill="#000000"/>
                <rect x="11" y="6" width="3" height="3" fill="#ffffff"/>
                <rect x="11" y="7" width="2" height="2" fill="#000000"/>
                <rect x="4" y="10" width="8" height="5" fill="#cf9b82"/>
                <rect x="5" y="12" width="2" height="2" fill="#382216"/>
                <rect x="9" y="12" width="2" height="2" fill="#382216"/>
            </svg>`;
        }
        if (n.includes('pig') || n.includes('cerdo')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="#f09ca8"/>
                <rect x="2" y="5" width="3" height="3" fill="#ffffff"/>
                <rect x="3" y="6" width="2" height="2" fill="#1b1b1b"/>
                <rect x="11" y="5" width="3" height="3" fill="#ffffff"/>
                <rect x="11" y="6" width="2" height="2" fill="#1b1b1b"/>
                <rect x="4" y="9" width="8" height="5" fill="#d96c80"/>
                <rect x="5" y="11" width="2" height="2" fill="#6e2532"/>
                <rect x="9" y="11" width="2" height="2" fill="#6e2532"/>
            </svg>`;
        }
        if (n.includes('sheep') || n.includes('oveja')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="#e8e8e8"/>
                <rect x="3" y="4" width="10" height="10" fill="#dbb69e"/>
                <rect x="3" y="6" width="3" height="2" fill="#ffffff"/>
                <rect x="4" y="6" width="2" height="2" fill="#000000"/>
                <rect x="10" y="6" width="3" height="2" fill="#ffffff"/>
                <rect x="10" y="6" width="2" height="2" fill="#000000"/>
                <rect x="6" y="10" width="4" height="2" fill="#bf7a65"/>
            </svg>`;
        }
        if (n.includes('chicken') || n.includes('pollo') || n.includes('gallina')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="#ffffff"/>
                <rect x="2" y="4" width="3" height="3" fill="#000000"/>
                <rect x="11" y="4" width="3" height="3" fill="#000000"/>
                <rect x="5" y="7" width="6" height="4" fill="#e8981c"/>
                <rect x="7" y="11" width="2" height="4" fill="#c41616"/>
            </svg>`;
        }
        if (n.includes('bee') || n.includes('abeja')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="#f0be24"/>
                <rect x="0" y="4" width="16" height="3" fill="#38210f"/>
                <rect x="0" y="10" width="16" height="3" fill="#38210f"/>
                <rect x="3" y="6" width="3" height="3" fill="#000000"/>
                <rect x="4" y="6" width="1" height="2" fill="#5ce3e8"/>
                <rect x="10" y="6" width="3" height="3" fill="#000000"/>
                <rect x="11" y="6" width="1" height="2" fill="#5ce3e8"/>
            </svg>`;
        }
        // Animal general
        return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
            <rect width="16" height="16" fill="#61442b"/>
            <rect x="3" y="5" width="3" height="3" fill="#ffffff"/>
            <rect x="4" y="6" width="2" height="2" fill="#000000"/>
            <rect x="10" y="5" width="3" height="3" fill="#ffffff"/>
            <rect x="10" y="6" width="2" height="2" fill="#000000"/>
            <rect x="6" y="10" width="4" height="3" fill="#d96c80"/>
        </svg>`;
    }

    // 3. ÍTEMS
    if (entityType === 'items') {
        if (n.includes('sword') || n.includes('espada')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect x="12" y="1" width="3" height="3" fill="#5cedd8"/>
                <rect x="9" y="4" width="4" height="4" fill="#5cedd8"/>
                <rect x="6" y="7" width="4" height="4" fill="#36a898"/>
                <rect x="4" y="9" width="3" height="3" fill="#1b6359"/>
                <rect x="2" y="11" width="3" height="3" fill="#4d321d"/>
                <rect x="1" y="13" width="3" height="3" fill="#331c0a"/>
                <rect x="4" y="12" width="2" height="2" fill="#8c643f"/>
                <rect x="2" y="10" width="2" height="2" fill="#8c643f"/>
            </svg>`;
        }
        if (n.includes('pickaxe') || n.includes('pico')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="1" width="7" height="3" fill="#5cedd8"/>
                <rect x="13" y="1" width="3" height="7" fill="#5cedd8"/>
                <rect x="9" y="4" width="3" height="3" fill="#36a898"/>
                <rect x="6" y="7" width="3" height="3" fill="#664426"/>
                <rect x="3" y="10" width="3" height="3" fill="#664426"/>
                <rect x="1" y="13" width="3" height="3" fill="#402812"/>
            </svg>`;
        }
        if (n.includes('apple') || n.includes('manzana')) {
            const isGold = n.includes('gold') || n.includes('dorada');
            const appCol = isGold ? '#f7d33b' : '#d91e1e';
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect x="7" y="1" width="2" height="3" fill="#573819"/>
                <rect x="3" y="4" width="10" height="9" fill="${appCol}"/>
                <rect x="4" y="3" width="8" height="11" fill="${appCol}"/>
                <rect x="5" y="5" width="2" height="3" fill="#ffffff"/>
                <rect x="4" y="12" width="3" height="2" fill="${appCol}"/>
                <rect x="9" y="12" width="3" height="2" fill="${appCol}"/>
            </svg>`;
        }
        if (n.includes('totem')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="1" width="8" height="6" fill="#e8a820"/>
                <rect x="1" y="5" width="14" height="4" fill="#e8a820"/>
                <rect x="5" y="3" width="2" height="2" fill="#2de060"/>
                <rect x="9" y="3" width="2" height="2" fill="#2de060"/>
                <rect x="5" y="8" width="6" height="7" fill="#e8a820"/>
            </svg>`;
        }
        if (n.includes('diamond') || n.includes('diamante') || n.includes('gem')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="2" width="6" height="3" fill="#5cedd8"/>
                <rect x="3" y="5" width="10" height="4" fill="#44c9b6"/>
                <rect x="5" y="9" width="6" height="4" fill="#2ea392"/>
                <rect x="7" y="13" width="2" height="2" fill="#1b6359"/>
                <rect x="6" y="4" width="2" height="2" fill="#ffffff"/>
            </svg>`;
        }
        // Ítem general
        return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="10" height="10" fill="#2e6cb5"/>
            <rect x="4" y="4" width="8" height="8" fill="#5c9be8"/>
            <rect x="5" y="5" width="3" height="3" fill="#ffffff"/>
        </svg>`;
    }

    // 4. BIOMAS
    if (entityType === 'biomes') {
        if (n.includes('nether')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="#571212"/>
                <rect x="2" y="8" width="12" height="8" fill="#8c1c1c"/>
                <rect x="4" y="4" width="3" height="6" fill="#f25e16"/>
                <rect x="10" y="3" width="4" height="8" fill="#ffb319"/>
            </svg>`;
        }
        if (n.includes('end')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="#0d0d17"/>
                <rect x="2" y="10" width="12" height="6" fill="#dedbb6"/>
                <rect x="5" y="2" width="6" height="9" fill="#1f182e"/>
                <rect x="7" y="1" width="2" height="2" fill="#ff55ff"/>
            </svg>`;
        }
        if (n.includes('desert') || n.includes('desierto') || n.includes('badlands')) {
            return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <rect width="16" height="16" fill="#decf8e"/>
                <rect x="10" y="3" width="3" height="10" fill="#32802b"/>
                <rect x="8" y="6" width="2" height="3" fill="#32802b"/>
                <rect x="13" y="7" width="2" height="3" fill="#32802b"/>
            </svg>`;
        }
        // Bioma general Overworld (Árbol)
        return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
            <rect width="16" height="16" fill="#59993b"/>
            <rect x="7" y="10" width="3" height="6" fill="#54361c"/>
            <rect x="3" y="2" width="10" height="9" fill="#2d6e24"/>
            <rect x="5" y="1" width="6" height="2" fill="#3a8a30"/>
        </svg>`;
    }

    // 5. ENCANTAMIENTOS
    return `<svg viewBox="0 0 16 16" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="12" height="12" fill="#6b1d82"/>
        <rect x="4" y="3" width="8" height="10" fill="#a030c2"/>
        <rect x="7" y="2" width="2" height="12" fill="#d975f5"/>
        <rect x="4" y="6" width="8" height="2" fill="#e8b0f7"/>
        <rect x="11" y="2" width="2" height="4" fill="#b02121"/>
    </svg>`;
}

/**
 * Genera la representación de corazones de vida (HP) de Minecraft
 * @param {number} hp 
 * @returns {string} HTML con corazones pixelados
 */
function generateHeartsHtml(hp) {
    if (!hp && hp !== 0) return '<span class="mc-pill mc-pill-dark">❤ N/A</span>';
    const totalHearts = Math.ceil(hp / 2);
    const displayHearts = Math.min(totalHearts, 8);
    let html = `
        <div class="mc-hp-meter" title="${hp} HP (${hp / 2} Corazones)">
            <span class="mc-hp-text">❤ ${hp} HP</span>
            <div class="mc-hearts-row">
    `;
    for (let i = 0; i < displayHearts; i++) {
        html += `<span class="mc-heart">❤</span>`;
    }
    if (totalHearts > 8) {
        html += `<span class="mc-heart-overflow">+${totalHearts - 8}</span>`;
    }
    html += `</div></div>`;
    return html;
}

/**
 * Renderiza el estado de carga (Loading) estilo pantalla de generación de mundo
 * @param {HTMLElement} container 
 */
function renderLoadingState(container) {
    container.innerHTML = `
        <div class="state-container loading-state" role="status" aria-live="polite">
            <div class="mc-block-spinner">
                <div class="cube-face top"></div>
                <div class="cube-face front"></div>
                <div class="cube-face right"></div>
            </div>
            <h3 class="state-title">Generando terreno...</h3>
            <p class="state-subtitle">Cargando base de datos remota en vivo desde Astroworld API</p>
            <div class="mc-progress-bar">
                <div class="mc-progress-fill"></div>
            </div>
        </div>
    `;
}

/**
 * Renderiza el estado de sin resultados (Empty State)
 * @param {HTMLElement} container 
 * @param {string} searchTerm 
 * @param {Function} onReset 
 */
function renderEmptyState(container, searchTerm = '', onReset = null) {
    container.innerHTML = `
        <div class="state-container empty-state" role="status" aria-live="polite">
            <div class="state-icon">📦</div>
            <h3 class="state-title">Cofre Vacío (Sin Resultados)</h3>
            <p class="state-subtitle">
                ${searchTerm ? `No se encontraron ítems o criaturas que coincidan con "<strong>${escapeHtml(searchTerm)}</strong>"` : 'No hay datos disponibles para los filtros seleccionados.'}
            </p>
            <p class="state-hint">Prueba con otros términos de búsqueda o restablece los filtros del inventario.</p>
            <button class="mc-btn mc-btn-sm" id="btn-reset-filters">
                Restablecer Filtros
            </button>
        </div>
    `;

    const resetBtn = container.querySelector('#btn-reset-filters');
    if (resetBtn && onReset) {
        resetBtn.addEventListener('click', onReset);
    }
}

/**
 * Renderiza el estado de error de conexión
 * @param {HTMLElement} container 
 * @param {string} errorMessage 
 * @param {Function} onRetry 
 */
function renderErrorState(container, errorMessage, onRetry = null) {
    container.innerHTML = `
        <div class="state-container error-state" role="alert">
            <div class="state-icon error-icon">🧨</div>
            <h3 class="state-title">Conexión Perdida con el Servidor</h3>
            <p class="state-subtitle">${escapeHtml(errorMessage || 'No se pudo comunicar con el servidor remoto de la API.')}</p>
            <div class="error-details">
                <span>Verifica tu conexión de red e intenta reconectar.</span>
            </div>
            <button class="mc-btn mc-btn-retry" id="btn-retry-connection">
                🔄 Reintentar Conexión
            </button>
        </div>
    `;

    const retryBtn = container.querySelector('#btn-retry-connection');
    if (retryBtn && onRetry) {
        retryBtn.addEventListener('click', onRetry);
    }
}

/**
 * Crea una tarjeta individual 100% estilo oficial Minecraft GUI
 * @param {Object} item 
 * @param {string} entityType 
 * @param {Function} onClick 
 * @returns {HTMLElement}
 */
function createCardElement(item, entityType, onClick) {
    const card = document.createElement('article');
    const isEnchanted = entityType === 'enchantments' || item.rarity === 'Epic' || item.glow;
    card.className = `mc-card mc-panel p-4 flex flex-col gap-4 ${isEnchanted ? 'mc-glint' : ''}`;
    card.tabIndex = 0;

    const spriteSvg = getMinecraftSpriteSvg(item.name, entityType, item);

    let badge1Html = '';
    let badge2Html = '';
    let row1Html = '';
    let row2Html = '';
    let row3Html = '';

    if (entityType === 'animals') {
        const isTameable = !!item.tameable;
        badge1Html = `<span class="bg-[#55ff55] text-[#003a04] px-2 py-1 text-[10px] font-label-sm flex items-center w-max gap-1 border border-[#005309]">🌾 PACÍFICO</span>`;
        badge2Html = `<span class="bg-[#353535] text-[#e4e2e1] text-[8px] font-label-sm px-2 py-1 w-full truncate">${escapeHtml(item.versionAdded ? `v${item.versionAdded}` : 'vCLASSIC 0.27_SURVIVAL_TEST')}</span>`;

        row1Html = `
            <span class="font-label-sm text-[#86957f]">SALUD:</span>
            <span class="text-[#ffb4ab] flex items-center gap-1 font-label-sm">♥ ${item.hp || 10} HP</span>
        `;
        row2Html = `
            <span class="font-label-sm text-[#86957f]">DROPS:</span>
            <span class="flex items-center gap-1 text-[#e4e2e1]">📦 ${escapeHtml(item.breedingItem || 'Raw Mutton, Wool')}</span>
        `;
        row3Html = `
            <span class="font-label-sm text-[#86957f]">COMPORTAMIENTO:</span>
            <p class="leading-tight text-[#e4e2e1] line-clamp-2">${escapeHtml(item.behavior ? (item.behavior.length > 45 ? item.behavior.slice(0, 45) + '...' : item.behavior) : 'Se mueve pacíficamente por el mundo.')}</p>
        `;
    } else if (entityType === 'mobs') {
        const typeLower = (item.type || '').toLowerCase();
        let badgeBg = 'bg-[#ffb4ab] text-[#93000a] border-[#93000a]';
        let badgeText = '⚔ HOSTIL';
        if (typeLower === 'passive') {
            badgeBg = 'bg-[#55ff55] text-[#003a04] border-[#005309]';
            badgeText = '🌾 PACÍFICO';
        } else if (typeLower === 'neutral') {
            badgeBg = 'bg-[#ffe066] text-[#554400] border-[#998800]';
            badgeText = '⚖ NEUTRAL';
        } else if (typeLower === 'boss') {
            badgeBg = 'bg-[#d7bde2] text-[#512e5f] border-[#512e5f]';
            badgeText = '👑 JEFE';
        }

        badge1Html = `<span class="${badgeBg} px-2 py-1 text-[10px] font-label-sm flex items-center w-max gap-1 border">${badgeText}</span>`;
        badge2Html = `<span class="bg-[#353535] text-[#e4e2e1] text-[8px] font-label-sm px-2 py-1 w-full truncate">${escapeHtml(item.versionAdded ? `v${item.versionAdded}` : 'v1.0.0')}</span>`;

        const dropsShort = Array.isArray(item.drops) && item.drops.length > 0 
            ? item.drops.map(d => typeof d === 'string' ? d : (d.item || 'Item')).slice(0, 2).join(', ')
            : 'Sin drops raros';

        row1Html = `
            <span class="font-label-sm text-[#86957f]">SALUD:</span>
            <span class="text-[#ffb4ab] flex items-center gap-1 font-label-sm">♥ ${item.hp || 20} HP</span>
        `;
        row2Html = `
            <span class="font-label-sm text-[#86957f]">DROPS:</span>
            <span class="flex items-center gap-1 text-[#e4e2e1]">📦 ${escapeHtml(dropsShort)}</span>
        `;
        row3Html = `
            <span class="font-label-sm text-[#86957f]">COMPORTAMIENTO:</span>
            <p class="leading-tight text-[#e4e2e1] line-clamp-2">${escapeHtml(item.behavior ? (item.behavior.length > 45 ? item.behavior.slice(0, 45) + '...' : item.behavior) : 'Ataca a los jugadores en las cercanías.')}</p>
        `;
    } else if (entityType === 'items') {
        badge1Html = `<span class="bg-[#85c1e9] text-[#1b4f72] px-2 py-1 text-[10px] font-label-sm flex items-center w-max gap-1 border border-[#1b4f72]">⚔ ${escapeHtml(item.category || 'ÍTEM')}</span>`;
        badge2Html = `<span class="bg-[#353535] text-[#e4e2e1] text-[8px] font-label-sm px-2 py-1 w-full truncate">${item.craftable ? '⚒ Crafteable 3x3' : '📦 Ítem Especial'}</span>`;

        row1Html = `
            <span class="font-label-sm text-[#86957f]">STACK MÁX:</span>
            <span class="text-[#55ff55] flex items-center gap-1 font-label-sm">${item.stackSize || 64} Ítems</span>
        `;
        row2Html = `
            <span class="font-label-sm text-[#86957f]">RENOVABLE:</span>
            <span class="flex items-center gap-1 text-[#e4e2e1]">${item.renewable ? '🌱 Sí' : '❌ No'}</span>
        `;
        row3Html = `
            <span class="font-label-sm text-[#86957f]">DESCRIPCIÓN:</span>
            <p class="leading-tight text-[#e4e2e1] line-clamp-2">${escapeHtml(item.description ? (item.description.length > 45 ? item.description.slice(0, 45) + '...' : item.description) : 'Ítem almacenable en cofre.')}</p>
        `;
    } else if (entityType === 'biomes') {
        badge1Html = `<span class="bg-[#55ff55] text-[#003a04] px-2 py-1 text-[10px] font-label-sm flex items-center w-max gap-1 border border-[#005309]">🌍 ${escapeHtml(item.dimension || 'OVERWORLD')}</span>`;
        badge2Html = `<span class="bg-[#353535] text-[#e4e2e1] text-[8px] font-label-sm px-2 py-1 w-full truncate">Rareza: ${escapeHtml(item.rarity || 'Común')}</span>`;

        row1Html = `
            <span class="font-label-sm text-[#86957f]">TEMPERATURA:</span>
            <span class="text-[#ffe066] flex items-center gap-1 font-label-sm">${item.temperature !== undefined ? `${item.temperature}°C` : 'Templado'}</span>
        `;
        row2Html = `
            <span class="font-label-sm text-[#86957f]">PRECIPITACIÓN:</span>
            <span class="flex items-center gap-1 text-[#e4e2e1]">${item.hasPrecipitation ? '🌧 Lluvia / Nieve' : '☀️ Seco'}</span>
        `;
        row3Html = `
            <span class="font-label-sm text-[#86957f]">GENERACIÓN:</span>
            <p class="leading-tight text-[#e4e2e1] line-clamp-2">${escapeHtml(item.spawnConditions ? (item.spawnConditions.length > 45 ? item.spawnConditions.slice(0, 45) + '...' : item.spawnConditions) : 'Generación natural en el terreno.')}</p>
        `;
    } else if (entityType === 'enchantments') {
        badge1Html = `<span class="bg-[#d7bde2] text-[#512e5f] px-2 py-1 text-[10px] font-label-sm flex items-center w-max gap-1 border border-[#512e5f]">✨ ENCANTAMIENTO</span>`;
        badge2Html = `<span class="bg-[#353535] text-[#e4e2e1] text-[8px] font-label-sm px-2 py-1 w-full truncate">Nivel Máx: ${toRoman(item.maxLevel || 1)}</span>`;

        row1Html = `
            <span class="font-label-sm text-[#86957f]">NIVEL MÁX:</span>
            <span class="text-[#ffe066] flex items-center gap-1 font-label-sm">${toRoman(item.maxLevel || 1)} (${item.maxLevel || 1})</span>
        `;
        row2Html = `
            <span class="font-label-sm text-[#86957f]">APLICABLE A:</span>
            <span class="flex items-center gap-1 text-[#e4e2e1]">${Array.isArray(item.applicableItems) ? item.applicableItems.slice(0, 2).join(', ') : (item.applicableItems || 'Herramientas')}</span>
        `;
        row3Html = `
            <span class="font-label-sm text-[#86957f]">EFECTO MÁGICO:</span>
            <p class="leading-tight text-[#e4e2e1] line-clamp-2">${escapeHtml(item.description ? (item.description.length > 45 ? item.description.slice(0, 45) + '...' : item.description) : 'Mejora mágica en yunque.')}</p>
        `;
    }

    card.innerHTML = `
        <div class="card-top-header">
            <div class="card-avatar-box">
                ${spriteSvg}
            </div>
            <div class="card-info-header">
                <h2 class="card-item-name" title="${escapeHtml(item.name || 'Elemento')}">${escapeHtml((item.name || 'Elemento').toUpperCase())}</h2>
                ${badge1Html}
                ${badge2Html}
            </div>
        </div>

        <div class="card-inset-body">
            <div class="card-stat-row">
                ${row1Html}
            </div>
            <div class="card-stat-row">
                ${row2Html}
            </div>
            <div class="card-stat-col">
                ${row3Html}
            </div>
        </div>

        <button class="mc-btn card-inspect-btn">
            🔍 INSPECCIONAR ÍTEM
        </button>
    `;

    card.addEventListener('click', () => onClick(item));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(item);
        }
    });

    return card;
}

/**
 * Renderiza el listado completo de tarjetas en el contenedor
 * @param {HTMLElement} container 
 * @param {Array} items 
 * @param {string} entityType 
 * @param {Function} onCardClick 
 */
function renderCardsGrid(container, items, entityType, onCardClick) {
    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    items.forEach(item => {
        const cardElement = createCardElement(item, entityType, onCardClick);
        fragment.appendChild(cardElement);
    });

    container.appendChild(fragment);
}

/**
 * Muestra el modal de detalles con vista de Libro / Inventario y Rejilla 3x3 de Crafteo
 * @param {Object} item 
 * @param {string} entityType 
 */
function openDetailModal(item, entityType) {
    let modal = document.getElementById('mc-detail-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'mc-detail-modal';
        modal.className = 'mc-modal-backdrop';
        document.body.appendChild(modal);
    }

    const spriteSvg = getMinecraftSpriteSvg(item.name, entityType, item);
    let detailContent = '';

    if (entityType === 'items') {
        let craftingHtml = '';
        if (item.craftable) {
            // Renderizado de Rejilla 3x3 de Mesa de Crafteo de Minecraft
            craftingHtml = `
                <div class="detail-section">
                    <h4>⚒ Mesa de Trabajo (Mesa de Crafteo 3x3)</h4>
                    <div class="crafting-gui-wrapper">
                        <div class="crafting-grid-3x3">
                            <div class="crafting-slot">🌿</div>
                            <div class="crafting-slot">🌿</div>
                            <div class="crafting-slot">🌿</div>
                            <div class="crafting-slot">🪵</div>
                            <div class="crafting-slot">💎</div>
                            <div class="crafting-slot">🪵</div>
                            <div class="crafting-slot">🪵</div>
                            <div class="crafting-slot">🪵</div>
                            <div class="crafting-slot">🪵</div>
                        </div>
                        <div class="crafting-arrow">➔</div>
                        <div class="crafting-result-slot">
                            ${spriteSvg}
                            <span class="mc-stack-count">${item.stackSize || 1}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        detailContent = `
            <div class="detail-section">
                <h4>Propiedades del Ítem</h4>
                <div class="detail-grid">
                    <div><strong>Categoría:</strong> ${escapeHtml(item.category || 'General')}</div>
                    <div><strong>Tamaño de Stack:</strong> ${item.stackSize || 64}</div>
                    <div><strong>Crafteable:</strong> ${item.craftable ? '✅ Sí (3x3)' : '❌ No'}</div>
                    <div><strong>Renovable:</strong> ${item.renewable ? '✅ Sí' : '❌ No'}</div>
                    <div><strong>Combustible en Horno:</strong> ${item.burnTime ? `🔥 ${item.burnTime} ticks` : 'No'}</div>
                </div>
            </div>
            ${craftingHtml}
            <div class="detail-section">
                <h4>Descripción de Lore</h4>
                <p style="font-size: 13px; color: #ffffff;">${escapeHtml(item.description || 'Ítem utilizable en el mundo de Minecraft.')}</p>
            </div>
        `;
    } else if (entityType === 'animals' || entityType === 'mobs') {
        const dropsFormatted = Array.isArray(item.drops) && item.drops.length > 0
            ? item.drops.map(d => `<div class="drop-item-card">📦 <strong>${escapeHtml(typeof d === 'string' ? d : d.item)}</strong> (${d.chance || '100'}%)</div>`).join('')
            : '<div class="drop-item-card">Sin drops especiales</div>';

        detailContent = `
            <div class="detail-section">
                <h4>Estadísticas de Criatura</h4>
                <div class="detail-grid">
                    <div><strong>Vida (HP):</strong> ${item.hp || 20} (${(item.hp || 20) / 2} Corazones)</div>
                    <div><strong>Domesticable:</strong> ${item.tameable ? '✅ Sí (Mascota)' : '❌ No'}</div>
                    <div><strong>Reproducible:</strong> ${item.breedable ? `✅ Sí (${item.breedingItem || 'Comida'})` : '❌ No'}</div>
                    <div><strong>Experiencia (XP):</strong> ${item.xpDrop?.min || 1} - ${item.xpDrop?.max || 5} puntos</div>
                    <div><strong>Versión Añadida:</strong> ${escapeHtml(item.versionAdded ? `v${item.versionAdded}` : 'Clásica')}</div>
                </div>
            </div>

            <div class="detail-section">
                <h4>Drops y Recompensas</h4>
                <div class="drops-slots-container">
                    ${dropsFormatted}
                </div>
            </div>

            <div class="detail-section">
                <h4>Comportamiento y Hábitat</h4>
                <p style="font-size: 13px; color: #ffffff; margin-bottom: 6px;"><strong>Comportamiento:</strong> ${escapeHtml(item.behavior || 'Estándar')}</p>
                <p style="font-size: 13px; color: #ffffff;"><strong>Spawn:</strong> ${escapeHtml(item.spawnConditions || 'Aparece de forma natural en sus biomas correspondientes.')}</p>
            </div>
        `;
    } else if (entityType === 'biomes') {
        detailContent = `
            <div class="detail-section">
                <h4>Datos del Bioma</h4>
                <div class="detail-grid">
                    <div><strong>Dimensión:</strong> ${escapeHtml(item.dimension || 'Overworld')}</div>
                    <div><strong>Categoría:</strong> ${escapeHtml(item.category || 'Terrestre')}</div>
                    <div><strong>Rareza:</strong> ${escapeHtml(item.rarity || 'Común')}</div>
                    <div><strong>Temperatura:</strong> ${item.temperature !== undefined ? `${item.temperature}°C` : 'Templado'}</div>
                    <div><strong>Precipitación:</strong> ${item.hasPrecipitation ? 'Lluvia / Nieve' : 'Ninguna'}</div>
                </div>
            </div>
            <div class="detail-section">
                <h4>Condiciones de Generación</h4>
                <p style="font-size: 13px; color: #ffffff;">${escapeHtml(item.spawnConditions || 'Generación natural en la dimensión correspondiente.')}</p>
            </div>
        `;
    } else if (entityType === 'enchantments') {
        detailContent = `
            <div class="detail-section mc-glint">
                <h4>✨ Datos del Encantamiento</h4>
                <div class="detail-grid">
                    <div><strong>Nivel Máximo:</strong> ${toRoman(item.maxLevel || 1)} (${item.maxLevel || 1})</div>
                    <div><strong>Categoría:</strong> ${escapeHtml(item.category || 'General')}</div>
                    <div><strong>Rareza:</strong> ${escapeHtml(item.weight || 'Común')}</div>
                    <div><strong>Incompatible con:</strong> ${Array.isArray(item.incompatible) ? item.incompatible.join(', ') : 'Ninguno'}</div>
                </div>
            </div>
            <div class="detail-section">
                <h4>Efecto Mágico</h4>
                <p style="font-size: 13px; color: #ffff55;">${escapeHtml(item.description || 'Proporciona mejoras mágicas en el yunque o mesa de encantamientos.')}</p>
            </div>
        `;
    }

    modal.innerHTML = `
        <div class="mc-modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div class="mc-modal-header">
                <h2 id="modal-title">
                    <div class="mc-slot mc-slot-sm">${spriteSvg}</div>
                    ${escapeHtml(item.name || 'Detalles')}
                </h2>
                <button class="mc-modal-close" id="btn-close-modal" aria-label="Cerrar modal">✖</button>
            </div>
            <div class="mc-modal-body">
                ${detailContent}
            </div>
            <div class="mc-modal-footer">
                <button class="mc-btn mc-btn-sm" id="btn-modal-ok">Aceptar (ESC)</button>
            </div>
        </div>
    `;

    modal.classList.add('active');

    const closeModal = () => modal.classList.remove('active');
    modal.querySelector('#btn-close-modal').addEventListener('click', closeModal);
    modal.querySelector('#btn-modal-ok').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}
