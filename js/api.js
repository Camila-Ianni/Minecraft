/**
 * Módulo de Comunicación con la API REST de Astroworld MC
 * Implementación en JavaScript Vanilla con async/await y fetch() nativo.
 * API Endpoint Base: https://api.astroworldmc.com/api/v1
 */

const API_BASE_URL = 'https://api.astroworldmc.com/api/v1';

/**
 * Función genérica y reutilizable para realizar peticiones HTTP GET asíncronas
 * @param {string} endpoint - Ruta relativa del endpoint (ej. '/mobs')
 * @returns {Promise<Array>} - Promesa con el array de datos devuelto por la API
 */
async function fetchFromApi(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        // Validar si el código de estado HTTP está en el rango 200-299
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText || 'No se pudo obtener la respuesta del servidor'}`);
        }

        const data = await response.json();

        // La API de Astroworld retorna un objeto con formato: { success: true, count: N, data: [...] }
        if (data && Array.isArray(data.data)) {
            return data.data;
        } else if (Array.isArray(data)) {
            return data;
        } else {
            throw new Error('El formato de respuesta recibido de la API no es válido.');
        }
    } catch (error) {
        console.error(`[Astroworld API Error] Fallo al consultar endpoint "${endpoint}":`, error);
        throw error;
    }
}

/**
 * Obtener listado de Mobs
 * @returns {Promise<Array>}
 */
async function getMobs() {
    return await fetchFromApi('/mobs');
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
