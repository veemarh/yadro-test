import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {dataStore} from "../services/data-store.js";

export default function DetailsPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);

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

    if (loading) return <p>Загрузка...</p>;
    if (!item) return <p>Элемент не найден.</p>;

    return (
        <>
            <h1>DetailsPage</h1>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
            <button onClick={() => navigate(`/edit/${id}`)}>Редактировать</button>
        </>
    );
}
