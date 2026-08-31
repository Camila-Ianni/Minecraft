/**
 * Módulo de Manipulación del DOM (dom.js)
 * Maneja el renderizado dinámico de tarjetas, estados de interfaz (carga, vacío, error) y modales.
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

// Generar representación visual de corazones para HP de Mobs
function generateHeartsHtml(hp) {
    if (!hp && hp !== 0) return '<span class="text-muted">N/A</span>';
    const hearts = Math.ceil(hp / 2);
    const displayHearts = Math.min(hearts, 15); // Mostrar máximo 15 corazones visuales para que no sature la tarjeta
    let html = `<div class="hp-container" title="${hp} HP (${hp / 2} Corazones)">`;
    html += `<span class="hp-text">❤ ${hp} HP</span> `;
    html += `<span class="hp-hearts">`;
    for (let i = 0; i < displayHearts; i++) {
        html += `<span class="heart-icon">❤</span>`;
    }
    if (hearts > 15) {
        html += `<span class="heart-more">+${hearts - 15}</span>`;
    }
    html += `</span></div>`;
    return html;
}

/**
 * Renderiza el estado de carga (Loading)
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
            <p class="state-subtitle">Conectando con la API de Astroworld MC</p>
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
            <h3 class="state-title">No se encontraron elementos</h3>
            <p class="state-subtitle">
                ${searchTerm ? `No hay resultados que coincidan con "<strong>${escapeHtml(searchTerm)}</strong>"` : 'No hay datos disponibles para los filtros seleccionados.'}
            </p>
            <p class="state-hint">Prueba con otros términos de búsqueda o restablece los filtros.</p>
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
 * Renderiza el estado de error de red / conexión
 * @param {HTMLElement} container 
 * @param {string} errorMessage 
 * @param {Function} onRetry 
 */
function renderErrorState(container, errorMessage, onRetry = null) {
    container.innerHTML = `
        <div class="state-container error-state" role="alert">
            <div class="state-icon error-icon">⚠</div>
            <h3 class="state-title">Error de Conexión</h3>
            <p class="state-subtitle">${escapeHtml(errorMessage || 'No se pudo comunicar con el servidor remoto.')}</p>
            <div class="error-details">
                <span>Verifica tu conexión a internet o intenta nuevamente en unos momentos.</span>
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
 * Renderiza una tarjeta individual según el tipo de entidad
 * @param {Object} item 
 * @param {string} entityType 
 * @param {Function} onClick 
 * @returns {HTMLElement}
 */
function createCardElement(item, entityType, onClick) {
    const card = document.createElement('article');
    card.className = `mc-card entity-${entityType}`;
    card.tabIndex = 0; // Accesible por teclado

    let badgeClass = 'badge-default';
    let badgeText = item.type || item.category || item.dimension || 'General';

    if (entityType === 'mobs') {
        const typeLower = (item.type || '').toLowerCase();
        if (typeLower === 'hostile') badgeClass = 'badge-hostile';
        else if (typeLower === 'passive') badgeClass = 'badge-passive';
        else if (typeLower === 'neutral') badgeClass = 'badge-neutral';
        else if (typeLower === 'boss') badgeClass = 'badge-boss';
    } else if (entityType === 'biomes') {
        const dimLower = (item.dimension || '').toLowerCase();
        if (dimLower.includes('nether')) badgeClass = 'badge-nether';
        else if (dimLower.includes('end')) badgeClass = 'badge-end';
        else badgeClass = 'badge-overworld';
    }

    let cardBodyHtml = '';

    if (entityType === 'mobs') {
        const dropsText = Array.isArray(item.drops) && item.drops.length > 0 
            ? item.drops.map(d => typeof d === 'string' ? d.replace(/@\{item=(.*?);.*/, '$1') : (d.item || JSON.stringify(d))).slice(0, 3).join(', ')
            : 'Sin drops especiales';

        cardBodyHtml = `
            <div class="card-header">
                <span class="entity-badge ${badgeClass}">${escapeHtml(badgeText)}</span>
                <span class="version-tag">${escapeHtml(item.versionAdded ? `v${item.versionAdded}` : 'Classic')}</span>
            </div>
            <h3 class="card-title">${escapeHtml(item.name || 'Desconocido')}</h3>
            <div class="card-stats">
                ${generateHeartsHtml(item.hp)}
                <div class="stat-item">
                    <span class="stat-label">Comportamiento:</span>
                    <span class="stat-value">${escapeHtml(item.behavior ? (item.behavior.slice(0, 75) + '...') : 'Estándar')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Drops:</span>
                    <span class="stat-value text-accent">${escapeHtml(dropsText)}</span>
                </div>
            </div>
        `;
    } else if (entityType === 'items') {
        cardBodyHtml = `
            <div class="card-header">
                <span class="entity-badge badge-item">${escapeHtml(item.category || 'Item')}</span>
                <span class="version-tag">${item.craftable ? '⚒ Crafteable' : '⚔ No Crafteable'}</span>
            </div>
            <h3 class="card-title">${escapeHtml(item.name || 'Item')}</h3>
            <div class="card-stats">
                <div class="stat-item">
                    <span class="stat-label">Stack Máx:</span>
                    <span class="stat-value stat-stack">${escapeHtml(item.stackSize || 64)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Descripción:</span>
                    <span class="stat-value">${escapeHtml(item.description ? (item.description.slice(0, 80) + '...') : 'Ítem de Minecraft')}</span>
                </div>
                ${item.renewable ? '<div class="stat-item"><span class="badge-renewable">🌱 Renovable</span></div>' : ''}
            </div>
        `;
    } else if (entityType === 'biomes') {
        cardBodyHtml = `
            <div class="card-header">
                <span class="entity-badge ${badgeClass}">${escapeHtml(item.dimension || 'Overworld')}</span>
                <span class="version-tag">${escapeHtml(item.rarity || 'Común')}</span>
            </div>
            <h3 class="card-title">${escapeHtml(item.name || 'Bioma')}</h3>
            <div class="card-stats">
                <div class="stat-item">
                    <span class="stat-label">Categoría:</span>
                    <span class="stat-value">${escapeHtml(item.category || 'Terrestre')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Temperatura:</span>
                    <span class="stat-value">${escapeHtml(item.temperature !== undefined ? `${item.temperature}°` : 'Templado')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Precipitación:</span>
                    <span class="stat-value">${item.hasPrecipitation ? '🌧 Sí (Lluvia/Nieve)' : '☀️ Seco'}</span>
                </div>
            </div>
        `;
    } else if (entityType === 'enchantments') {
        cardBodyHtml = `
            <div class="card-header">
                <span class="entity-badge badge-enchant">${escapeHtml(item.category || 'Encantamiento')}</span>
                <span class="version-tag">Nivel Máx: ${toRoman(item.maxLevel || 1)}</span>
            </div>
            <h3 class="card-title">${escapeHtml(item.name || 'Encantamiento')}</h3>
            <div class="card-stats">
                <div class="stat-item">
                    <span class="stat-label">Efecto:</span>
                    <span class="stat-value">${escapeHtml(item.description ? (item.description.slice(0, 85) + '...') : 'Efecto mágico')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Aplicable a:</span>
                    <span class="stat-value text-accent">${Array.isArray(item.applicableItems) ? item.applicableItems.slice(0, 3).join(', ') : 'Herramientas/Armaduras'}</span>
                </div>
            </div>
        `;
    } else {
        cardBodyHtml = `
            <div class="card-header">
                <span class="entity-badge badge-default">${escapeHtml(item.category || entityType)}</span>
            </div>
            <h3 class="card-title">${escapeHtml(item.name || 'Elemento')}</h3>
            <div class="card-stats">
                <p class="stat-value">${escapeHtml(JSON.stringify(item).slice(0, 80))}...</p>
            </div>
        `;
    }

    card.innerHTML = `
        ${cardBodyHtml}
        <div class="card-footer">
            <span class="btn-inspect">🔍 Ver Detalles</span>
        </div>
    `;

    // Eventos de clic y teclado (Enter/Espacio)
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
 * Muestra el modal de detalles con información completa del ítem
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

    let detailContent = '';

    if (entityType === 'mobs') {
        const dropsFormatted = Array.isArray(item.drops)
            ? item.drops.map(d => `<li>📦 <strong>${escapeHtml(typeof d === 'string' ? d : d.item)}</strong> (Probabilidad: ${d.chance || '100'}%)</li>`).join('')
            : '<li>Sin drops</li>';

        const spawnBiomes = Array.isArray(item.spawnBiomes) && item.spawnBiomes.length > 0
            ? item.spawnBiomes.join(', ')
            : 'Generación específica';

        detailContent = `
            <div class="detail-section">
                <h4>Estadísticas de Combate</h4>
                <div class="detail-grid">
                    <div><strong>Puntos de Vida (HP):</strong> ${item.hp || 0} (${(item.hp || 0) / 2} corazones)</div>
                    <div><strong>Daño Fácil:</strong> ${item.damage?.easy ?? 'N/A'}</div>
                    <div><strong>Daño Normal:</strong> ${item.damage?.normal ?? 'N/A'}</div>
                    <div><strong>Daño Difícil:</strong> ${item.damage?.hard ?? 'N/A'}</div>
                    <div><strong>Experiencia (XP):</strong> ${item.xpDrop?.min || 0} - ${item.xpDrop?.max || 0}</div>
                    <div><strong>Domesticable:</strong> ${item.tameable ? '✅ Sí' : '❌ No'}</div>
                    <div><strong>Criable / Reproducible:</strong> ${item.breedable ? `✅ Sí (${item.breedingItem || 'Comida'})` : '❌ No'}</div>
                </div>
            </div>

            <div class="detail-section">
                <h4>Comportamiento y Biomas</h4>
                <p><strong>Comportamiento:</strong> ${escapeHtml(item.behavior || 'Estándar')}</p>
                <p><strong>Condiciones de Aparición:</strong> ${escapeHtml(item.spawnConditions || 'Aparece de forma natural en la oscuridad.')}</p>
                <p><strong>Biomas de Spawn:</strong> ${escapeHtml(spawnBiomes)}</p>
                ${item.weaknesses ? `<p><strong>Debilidades:</strong> ${escapeHtml(Array.isArray(item.weaknesses) ? item.weaknesses.join(', ') : item.weaknesses)}</p>` : ''}
            </div>

            <div class="detail-section">
                <h4>Drops y Recompensas</h4>
                <ul class="drops-list">${dropsFormatted}</ul>
            </div>

            ${item.notes ? `
            <div class="detail-section detail-notes">
                <h4>Notas y Curiosidades</h4>
                <p>${escapeHtml(item.notes)}</p>
            </div>` : ''}
        `;
    } else if (entityType === 'items') {
        detailContent = `
            <div class="detail-section">
                <h4>Propiedades del Ítem</h4>
                <div class="detail-grid">
                    <div><strong>Categoría:</strong> ${escapeHtml(item.category || 'General')}</div>
                    <div><strong>Tamaño de Stack:</strong> ${item.stackSize || 64}</div>
                    <div><strong>Crafteable:</strong> ${item.craftable ? '✅ Sí' : '❌ No'}</div>
                    <div><strong>Renovable:</strong> ${item.renewable ? '✅ Sí' : '❌ No'}</div>
                    <div><strong>Combustible en Horno:</strong> ${item.burnTime ? `🔥 ${item.burnTime} ticks` : 'No'}</div>
                </div>
            </div>
            <div class="detail-section">
                <h4>Descripción</h4>
                <p>${escapeHtml(item.description || 'Sin descripción detallada.')}</p>
            </div>
            ${item.recipe ? `
            <div class="detail-section">
                <h4>Receta de Crafteo</h4>
                <pre class="recipe-box">${escapeHtml(JSON.stringify(item.recipe, null, 2))}</pre>
            </div>` : ''}
        `;
    } else if (entityType === 'biomes') {
        detailContent = `
            <div class="detail-section">
                <h4>Datos del Bioma</h4>
                <div class="detail-grid">
                    <div><strong>Dimensión:</strong> ${escapeHtml(item.dimension || 'Overworld')}</div>
                    <div><strong>Categoría:</strong> ${escapeHtml(item.category || 'Terrestre')}</div>
                    <div><strong>Rareza:</strong> ${escapeHtml(item.rarity || 'Común')}</div>
                    <div><strong>Temperatura:</strong> ${item.temperature ?? 'N/A'}</div>
                    <div><strong>Precipitación:</strong> ${item.hasPrecipitation ? 'Lluvia / Nieve' : 'Ninguna'}</div>
                </div>
            </div>
            <div class="detail-section">
                <h4>Spawns y Fauna</h4>
                <p>${escapeHtml(item.spawnConditions || 'Fauna y flora estándar de su respectiva dimensión.')}</p>
            </div>
        `;
    } else {
        detailContent = `
            <div class="detail-section">
                <pre class="recipe-box">${escapeHtml(JSON.stringify(item, null, 2))}</pre>
            </div>
        `;
    }

    modal.innerHTML = `
        <div class="mc-modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div class="mc-modal-header">
                <h2 id="modal-title">${escapeHtml(item.name || 'Detalles')}</h2>
                <button class="mc-modal-close" id="btn-close-modal" aria-label="Cerrar modal">✖</button>
            </div>
            <div class="mc-modal-body">
                ${detailContent}
            </div>
            <div class="mc-modal-footer">
                <button class="mc-btn mc-btn-sm" id="btn-modal-ok">Aceptar</button>
            </div>
        </div>
    `;

    modal.classList.add('active');

    // Cerrar al hacer clic en botón de cerrar, backdrop o presionar Escape
    const closeModal = () => {
        modal.classList.remove('active');
    };

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
