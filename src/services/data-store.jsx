import {fetchItemById, fetchItems} from "./api";
import {getModifiedItems, updateModifiedItem} from "./localstorage";
import {createContext, useContext, useState} from "react";

const DataStoreContext = createContext(null);

export function DataStoreProvider({children}) {
    const [serverData, setServerData] = useState({});
    const [modifiedItems, setModifiedItems] = useState(() => getModifiedItems());

    /**
     * Получает список элементов с учетом локальных изменений.
     *
     * @param {number} page - номер страницы
     * @param {number} limit - количество элементов на странице
     * @returns {Promise<{data: Object[], totalItems: number}>} - промис, возвращающий объект с объединёнными данными и общим количеством элементов
     */
    const getItemsWithChanges = async (page = 1, limit = 10) => {
        const {data, totalItems} = await fetchItems(page, limit);

        setServerData(prev => {
            const updated = {...prev};
            data.forEach(item => {
                updated[item.id] = item;
            });
            return updated;
        });

        const mergedData = data.map(item => ({
            ...item,
            ...(modifiedItems[item.id] || {}),
        }));

        return {data: mergedData, totalItems};
    };

    /**
     * Загружает отдельный элемент с сервера и применяет локальные изменения.
     *
     * @param {number|string} id - идентификатор элемента
     * @returns {Promise<Object|null>} - промис, возвращающий данные элемента или null в случае ошибки
     */
    const getItemById = async (id) => {
        let item = serverData[id];
        if (!item) {
            try {
                item = await fetchItemById(id);
                setServerData(prev => ({...prev, [id]: item}));
            } catch (error) {
                return null;
            }
        }
        return {
            ...item,
            ...(modifiedItems[id] || {}),
        };
    };

    /**
     * Сохраняет изменения элемента в памяти и localStorage.
     *
     * @param {number|string} id - идентификатор элемента
     * @param {Object} change - объект с изменениями полей элемента
     */
    const saveChange = (id, change) => {
        if (!serverData[id]) return;

        const original = serverData[id];
        const filteredChange = Object.keys(change).reduce((acc, key) => {
            if (change[key] !== original[key]) {
                acc[key] = change[key];
            }
            return acc;
        }, {});

        if (Object.keys(filteredChange).length) {
            setModifiedItems(prev => {
                const newModified = {
                    ...prev,
                    [id]: {...(prev[id] || {}), ...filteredChange}
                };
                updateModifiedItem(id, filteredChange);
                return newModified;
            });
        }
    };

    const value = {
        getItemsWithChanges,
        getItemById,
        saveChange,
    };

    return (
        <DataStoreContext.Provider value={value}>
            {children}
        </DataStoreContext.Provider>
    );
}

/**
 * Кастомный хук для доступа к DataStore.
 */
export function useDataStore() {
    return useContext(DataStoreContext);
}
