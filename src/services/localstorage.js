const STORAGE_KEY = "yadro_test_modified";
let cachedData = null;

/**
 * Загружает данные из localStorage в память.
 *
 * @return {Object} - объект с изменениями
 */
const loadCache = () => {
    if (cachedData === null) {
        try {
            cachedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch (error) {
            cachedData = {};
        }
    }
    return cachedData;
};

/**
 * Получает объект изменений из localStorage.
 *
 * @return {Object} - объект изменений
 */
export const getModifiedItems = () => loadCache();

/**
 * Обновляет данные элемента в localStorage и памяти.
 *
 * @param {number|string} id - идентификатор элемента
 * @param {Object} updatedData - новые данные элемента
 * @returns {void}
 */
export const updateModifiedItem = (id, updatedData) => {
    try {
        const cache = loadCache();
        cache[id] = {...cache[id], ...updatedData};
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch (error) {
        throw error;
    }
};
