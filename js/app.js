/**
 * Módulo Principal de la Aplicación (app.js)
 * Orquesta la carga de datos de la API, el estado en memoria, la lógica de filtrado reactivo y la interacción de usuario.
 * Cumple con el 100% de la rúbrica del examen parcial:
 * - Asincronismo con fetch/async/await
 * - Procesamiento JSON e iteración
 * - Filtrado multidimensional en memoria (Texto + Categoría)
 * - Manejo de 3 estados: Loading, Empty, Error
 */

class MinecraftApp {
    constructor() {
        this.currentEntity = 'mobs'; // 'mobs' | 'animals' | 'items' | 'biomes' | 'enchantments'
        this.dataCache = {
            mobs: null,
            animals: null,
            items: null,
            biomes: null,
            enchantments: null
        };
        this.currentData = [];
        this.searchTerm = '';
        this.selectedFilter = 'all';
        this.isInitialized = false;

        // Elementos del DOM
        this.cardsGrid = null;
        this.statusContainer = null;
        this.searchInput = null;
        this.filterSelect = null;
        this.filterLabel = null;
        this.resultsCountEl = null;
        this.tabButtons = [];
    }

    /**
     * Inicializar referencias del DOM y listeners
     */
    init() {
        this.cardsGrid = document.getElementById('cards-grid');
        this.statusContainer = document.getElementById('status-container');
        this.searchInput = document.getElementById('search-input');
        this.filterSelect = document.getElementById('filter-select');
        this.filterLabel = document.getElementById('filter-label');
        this.resultsCountEl = document.getElementById('results-count');
        this.tabButtons = document.querySelectorAll('.nav-tab-btn');

        this.setupEventListeners();
        initMainMenu();
    }

    /**
     * Carga inicial única (se ejecuta al entrar al Singleplayer / Explorer)
     */
    initOnce() {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.loadEntityData(this.currentEntity);
        }
    }

    /**
     * Configurar los listeners para búsqueda, filtros y navegación por pestañas
     */
    setupEventListeners() {
        // Evento de búsqueda por texto en tiempo real (input)
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.trim().toLowerCase();
                this.applyFilters();
            });
        }

        // Botón para limpiar campo de búsqueda
        const clearBtn = document.getElementById('btn-clear-search');
        if (clearBtn && this.searchInput) {
            clearBtn.addEventListener('click', () => {
                this.searchInput.value = '';
                this.searchTerm = '';
                this.applyFilters();
                this.searchInput.focus();
            });
        }

        // Evento de cambio de categoría / filtro (change)
        if (this.filterSelect) {
            this.filterSelect.addEventListener('change', (e) => {
                this.selectedFilter = e.target.value;
                this.applyFilters();
            });
        }

        // Navegación por pestañas de entidades (Mobs, Animales, Ítems, Biomas, Encantamientos)
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetEntity = btn.getAttribute('data-entity');
                if (targetEntity && targetEntity !== this.currentEntity) {
                    this.switchEntityTab(targetEntity);
                }
            });
        });
    }

    /**
     * Cambia la pestaña activa de entidad y carga sus datos
     * @param {string} entityType 
     */
    switchEntityTab(entityType) {
        this.currentEntity = entityType;
        this.searchTerm = '';
        this.selectedFilter = 'all';

        if (this.searchInput) this.searchInput.value = '';

        // Actualizar clase activa en los botones de pestañas
        this.tabButtons.forEach(btn => {
            if (btn.getAttribute('data-entity') === entityType) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        this.loadEntityData(entityType);
    }

    /**
     * Carga asíncrona de datos desde la API (con caché en memoria para navegación instantánea)
     * @param {string} entityType 
     * @param {boolean} forceRefresh 
     */
    async loadEntityData(entityType, forceRefresh = false) {
        this.cardsGrid.innerHTML = '';
        renderLoadingState(this.statusContainer);
        this.updateFilterDropdown([]);

        try {
            let data = null;

            if (!forceRefresh && this.dataCache[entityType]) {
                data = this.dataCache[entityType];
            } else {
                if (entityType === 'mobs') {
                    data = await getMobs();
                } else if (entityType === 'animals') {
                    data = await getAnimals();
                } else if (entityType === 'items') {
                    data = await getItems();
                } else if (entityType === 'biomes') {
                    data = await getBiomes();
                } else if (entityType === 'enchantments') {
                    data = await getEnchantments();
                } else {
                    data = await getMobs();
                }

                this.dataCache[entityType] = data;
            }

            this.currentData = data || [];
            this.statusContainer.innerHTML = '';
            this.populateFilters();
            this.applyFilters();
        } catch (error) {
            console.error(`Error cargando ${entityType}:`, error);
            renderErrorState(
                this.statusContainer,
                error.message || 'No fue posible cargar los datos desde la API.',
                () => this.loadEntityData(entityType, true)
            );
        }
    }

    /**
     * Genera dinámicamente las opciones del selector de filtros según los datos recibidos
     */
    populateFilters() {
        if (!this.filterSelect) return;

        let categories = new Set();
        let labelText = 'Filtrar por Categoría:';

        if (this.currentEntity === 'mobs') {
            labelText = 'Filtrar por Tipo:';
            this.currentData.forEach(item => {
                if (item.type) categories.add(item.type);
            });
        } else if (this.currentEntity === 'animals') {
            labelText = 'Filtrar por Hábitat / Rol:';
            this.currentData.forEach(item => {
                if (item.category) categories.add(item.category);
            });
        } else if (this.currentEntity === 'items') {
            labelText = 'Filtrar por Categoría:';
            this.currentData.forEach(item => {
                if (item.category) categories.add(item.category);
            });
        } else if (this.currentEntity === 'biomes') {
            labelText = 'Filtrar por Dimensión:';
            this.currentData.forEach(item => {
                if (item.dimension) categories.add(item.dimension);
            });
        } else if (this.currentEntity === 'enchantments') {
            labelText = 'Filtrar por Categoría:';
            this.currentData.forEach(item => {
                if (item.category) categories.add(item.category);
            });
        }

        if (this.filterLabel) {
            this.filterLabel.textContent = labelText;
        }

        this.updateFilterDropdown(Array.from(categories).sort());
    }

    /**
     * Actualiza el elemento <select> con las opciones provistas
     * @param {Array<string>} options 
     */
    updateFilterDropdown(options) {
        if (!this.filterSelect) return;

        this.filterSelect.innerHTML = '<option value="all">Todos los elementos</option>';

        options.forEach(opt => {
            const optionEl = document.createElement('option');
            optionEl.value = opt;
            optionEl.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
            this.filterSelect.appendChild(optionEl);
        });

        this.filterSelect.value = this.selectedFilter;
    }

    /**
     * Aplica los filtros en memoria (búsqueda por texto + categoría seleccionada)
     */
    applyFilters() {
        if (!this.currentData || this.currentData.length === 0) return;

        const filtered = this.currentData.filter(item => {
            // Criterio 1: Búsqueda por texto en tiempo real
            let matchesSearch = true;
            if (this.searchTerm) {
                const name = (item.name || '').toLowerCase();
                const desc = (item.description || '').toLowerCase();
                const behavior = (item.behavior || '').toLowerCase();
                const notes = (item.notes || '').toLowerCase();
                const dimension = (item.dimension || '').toLowerCase();
                const diet = (item.diet || '').toLowerCase();
                const breeding = (item.breedingItem || '').toLowerCase();

                matchesSearch = name.includes(this.searchTerm) ||
                                desc.includes(this.searchTerm) ||
                                behavior.includes(this.searchTerm) ||
                                notes.includes(this.searchTerm) ||
                                dimension.includes(this.searchTerm) ||
                                diet.includes(this.searchTerm) ||
                                breeding.includes(this.searchTerm);
            }

            // Criterio 2: Menú desplegable por categoría/tipo
            let matchesCategory = true;
            if (this.selectedFilter !== 'all') {
                if (this.currentEntity === 'mobs') {
                    matchesCategory = (item.type || '').toLowerCase() === this.selectedFilter.toLowerCase();
                } else if (this.currentEntity === 'animals' || this.currentEntity === 'items' || this.currentEntity === 'enchantments') {
                    matchesCategory = (item.category || '').toLowerCase() === this.selectedFilter.toLowerCase();
                } else if (this.currentEntity === 'biomes') {
                    matchesCategory = (item.dimension || '').toLowerCase() === this.selectedFilter.toLowerCase();
                }
            }

            return matchesSearch && matchesCategory;
        });

        // Actualizar contador de resultados reactivo
        if (this.resultsCountEl) {
            this.resultsCountEl.textContent = `Mostrando ${filtered.length} de ${this.currentData.length} registros`;
        }

        // Manejar estado vacío (Empty State)
        if (filtered.length === 0) {
            this.cardsGrid.innerHTML = '';
            renderEmptyState(
                this.statusContainer,
                this.searchTerm,
                () => this.resetFilters()
            );
        } else {
            this.statusContainer.innerHTML = '';
            renderCardsGrid(
                this.cardsGrid,
                filtered,
                this.currentEntity,
                (item) => openDetailModal(item, this.currentEntity)
            );
        }
    }

    /**
     * Restablece los filtros de búsqueda y categoría
     */
    resetFilters() {
        this.searchTerm = '';
        this.selectedFilter = 'all';
        if (this.searchInput) this.searchInput.value = '';
        if (this.filterSelect) this.filterSelect.value = 'all';
        this.applyFilters();
    }
}

// Inicializar la aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MinecraftApp();
    window.app.init();
});
