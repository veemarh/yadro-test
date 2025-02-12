import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {dataStore} from "../services/data-store.js";

export default function EditPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const loadItemDetails = () => {
            setLoading(true);
            dataStore.getItemById(id)
                .then((data) => {
                    setItem(data);
                })
                .catch((error) => {
                    console.error("Ошибка загрузки элемента:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        loadItemDetails();
    }, [id]);

    // Простая валидация формы
    const validate = () => {
        const errors = {};
        if (!item.title.trim()) {
            errors.title = "Заголовок обязателен";
        }
        if (!item.body.trim()) {
            errors.body = "Описание обязательно";
        }
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        // Готовим обновленные данные; сохраняем все поля, чтобы не потерять другие данные элемента
        const updatedData = {
            ...item
        };

        dataStore.saveChange(id, updatedData);
        navigate(`/details/${id}`);
    };

    if (loading) return <p>Загрузка...</p>;
    if (!item) return <p>Элемент не найден.</p>;

    return (
        <>
            <h1>Редактирование элемента</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Заголовок:
                        <input
                            type="text"
                            value={item.title}
                            onChange={(e) => setItem(prevItem => ({
                                ...prevItem,
                                title: e.target.value
                            }))}
                        />
                    </label>
                    {errors.title && (
                        <span style={{color: "red"}}>{errors.title}</span>
                    )}
                </div>
                <div>
                    <label>
                        Описание:
                        <textarea
                            value={item.body}
                            onChange={(e) => setItem(prevItem => ({
                                ...prevItem,
                                body: e.target.value
                            }))}
                        />
                    </label>
                    {errors.body && (
                        <span style={{color: "red"}}>{errors.body}</span>
                    )}
                </div>
                <button type="submit">Сохранить</button>
                <button type="button" onClick={() => navigate(`/details/${id}`)}>Отмена</button>
            </form>
        </>
    );
}
