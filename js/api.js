/**

 * Endpoints Principales:
 * - Astroworld MC API: https://api.astroworldmc.com/api/v1
 
 */

const API_BASE_URL = 'https://api.astroworldmc.com/api/v1';

/**
 * Obtener Skin y Avatar de Jugador desde la API REST Remota Gratuita MineSkin.eu
 * @param {string} username - Nombre de usuario de Minecraft (ej: Steve, Alex, Eiki, Cami)
 * @returns {Object} Objeto con URLs de avatar, cuerpo y skin completa
 */
function fetchMinecraftSkin(username = 'Steve') {
    const cleanName = encodeURIComponent(String(username).trim() || 'Steve');
    return {
        username: String(username).trim() || 'Steve',
        avatarUrl: `https://mineskin.eu/avatar/${cleanName}/100.png`,
        bodyUrl: `https://mineskin.eu/body/${cleanName}/100.png`,
        skinUrl: `https://mineskin.eu/skin/${cleanName}`
    };
}

/**
 * Función genérica y reutilizable para peticiones HTTP GET asíncronas
 * @param {string} endpoint - Ruta relativa del endpoint
 * @returns {Promise<Array|Object>}
 */
async function fetchFromApi(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText || 'No se pudo obtener respuesta del servidor'}`);
        }

        const data = await response.json();

        if (data && Array.isArray(data.data)) {
            return data.data;
        } else if (Array.isArray(data)) {
            return data;
        } else {
            throw new Error('El formato de respuesta recibido de la API no es válido.');
        }
    } catch (error) {
        console.error(`[API Error] Fallo al consultar endpoint "${endpoint}":`, error);
        throw error;
    }
}

/**
 * Obtener listado de Mobs en general
 * @returns {Promise<Array>}
 */
async function getMobs() {
    const all = await fetchFromApi('/mobs');
    const farmAnimals = ['cow', 'sheep', 'pig', 'chicken', 'horse', 'donkey', 'mule', 'rabbit'];
    
    // Filtrar mobs reales (hostiles, neutrales, jefes o no de granja)
    const mobsOnly = all.filter(mob => {
        const type = (mob.type || '').toLowerCase();
        const name = (mob.name || '').toLowerCase();
        return type === 'hostile' || type === 'neutral' || type === 'boss' || (!farmAnimals.includes(name) && type !== 'passive');
    });

    return mobsOnly.length > 0 ? mobsOnly : all;
}

/**
 * Obtener listado especializado de Animales y Fauna (Passive / Neutral / Tameable Animals)
 * Filtra y estructura los animales del ecosistema, listos para interactuar en el DOM.
 * @returns {Promise<Array>}
 */
async function getAnimals() {
    const allMobs = await fetchFromApi('/mobs');
    // Filtrar fauna y criaturas dóciles / animales
    const animals = allMobs.filter(mob => {
        const type = (mob.type || '').toLowerCase();
        const cat = (mob.category || '').toLowerCase();
        return type === 'passive' || mob.tameable || mob.breedable || cat === 'passive' || cat === 'animal';
    });

    return animals.map(animal => ({
        ...animal,
        isAnimal: true,
        category: animal.breedable ? 'Criable / Granja' : (animal.tameable ? 'Mascota / Domesticable' : 'Fauna Silvestre'),
        diet: animal.breedingItem || (animal.tamingMethod ? 'Alimento específico' : 'Herbívoro / Natural')
    }));
}

/**
 * Obtener listado de Ítems
 * @returns {Promise<Array>}
 */
async function getItems() {
    return await fetchFromApi('/items');
}

/**
 * Obtener listado de Biomas
 * @returns {Promise<Array>}
 */
async function getBiomes() {
    return await fetchFromApi('/biomes');
}

/**
 * Obtener listado de Encantamientos
 * @returns {Promise<Array>}
 */
async function getEnchantments() {
    return await fetchFromApi('/enchantments');
}

/**
 * Obtener listado de Estructuras
 * @returns {Promise<Array>}
 */
async function getStructures() {
    return await fetchFromApi('/structures');
}

/**
 * Consulta a la API pública de Dog CEO para obtener imágenes y datos caninos adicionales
 * @returns {Promise<string>}
 */
async function getRandomDogImage() {
    try {
        const res = await fetch('https://dog.ceo/api/breeds/image/random');
        if (res.ok) {
            const data = await res.json();
            return data.message;
        }
    } catch (e) {
        console.warn('Fallo opcional en Dog CEO API:', e);
    }
    return null;
}
