import {fetchItemById, fetchItems} from './api';
import {getModifiedItems, updateModifiedItem} from './localstorage';

class DataStore {
    constructor() {
        this.serverData = {};
        this.modifiedItems = getModifiedItems();
    }

    /**
     * Получает список элементов с учетом локальных изменений.
     *
     * @param {number} page - номер страницы
     * @param {number} limit - количество элементов на странице
     * @returns {Promise<{data: Object[], totalItems: number}>} - промис, возвращающий объект с объединёнными данными и общим количеством элементов
     */
    async getItemsWithChanges(page = 1, limit = 10) {
        const {data, totalItems} = await fetchItems(page, limit);

        data.forEach((item) => {
            this.serverData[item.id] = item;
        });

        const mergedData = data.map((item) => ({
            ...item,
            ...(this.modifiedItems[item.id] || {}),
        }));
        return {data: mergedData, totalItems};
    }

    /**
     * агружает отдельный элемент с сервера и применяет локальные изменения.
     *
     * @param {number|string} id - идентификатор элемента
     * @returns {Promise<Object|null>} - промис, возвращающий данные элемента или null в случае ошибки
     */
    async getItemById(id) {
        if (!this.serverData[id]) {
            try {
                this.serverData[id] = await fetchItemById(id);
            } catch (error) {
                console.error(`Ошибка загрузки элемента ${id}:`, error);
                return null;
            }
        }
        return this.loadDataById(id);
    }

    /**
     * Сохраняет изменения элемента в памяти и localStorage.
     *
     * @param {number|string} id - идентификатор элемента
     * @param {Object} change - объект с изменениями полей элемента
     */
    saveChange(id, change) {
        if (!this.serverData[id]) return;

        const original = this.serverData[id];
        const filteredChange = Object.keys(change).reduce((acc, key) => {
            if (change[key] !== original[key]) acc[key] = change[key];
            return acc;
        }, {});

        if (Object.keys(filteredChange).length) {
            this.modifiedItems[id] = {...this.modifiedItems[id], ...filteredChange};
            updateModifiedItem(id, filteredChange);
        }
    }

    /**
     * Возвращает актуальные данные элемента.
     *
     * @param {number|string} id - идентификатор элемента
     * @returns {Object} - объект с актуальными данными элемента.
     */
    loadDataById(id) {
        return {
            ...this.serverData[id],
            ...this.modifiedItems[id],
        };
    }
}

export const dataStore = new DataStore();
