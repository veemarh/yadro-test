import axios from 'axios';

const BACKEND_URL = "https://jsonplaceholder.typicode.com/posts";
const REQUEST_TIMEOUT = 5000;

/**
 * Создает экземпляр API.
 *
 * @type {axios.AxiosInstance}
 * @property {string} baseURL - базовый URL сервера
 * @property {number} timeout - максимальное время ожидания ответа от сервера в миллисекундах
 */
export const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
});

/**
 * Получает список элементов с пагинацией.
 *
 * @param {number} page - номер страницы (по умолчанию 1)
 * @param {number} limit - количество элементов на странице (по умолчанию 10)
 * @returns {Promise<{totalItems: number, data: any}>} - массив элементов
 */
export const fetchItems = async (page = 1, limit = 10) => {
    try {
        const response = await api.get(`?_page=${page}&_limit=${limit}`);
        const totalItems = response.headers['x-total-count'];
        return {
            data: response.data,
            totalItems: parseInt(totalItems, 10),
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Получает детальную информацию об элементе.
 *
 * @param {number|string} id - идентификатор элемента
 * @returns {Promise<Object>} - данные элемента
 */
export const fetchItemById = async (id) => {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
