import {fetchItems} from "../services/api.js";
import {useEffect, useState} from "react";
import {Link, useSearchParams} from "react-router-dom";

export default function ListPage() {
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const ITEMS_PER_PAGE = 10;

    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10);

    useEffect(() => {
        const loadItems = () => {
            setLoading(true);
            fetchItems(page, ITEMS_PER_PAGE)
                .then(({data, totalItems}) => {
                    setItems(data);
                    setTotalItems(totalItems);
                })
                .catch((error) => {
                    console.error("Ошибка загрузки элементов:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        loadItems();
    }, [page]);

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        setSearchParams({page: newPage});
    };

    if (loading) return <p>Загрузка...</p>;

    return (
        <>
            <h1>ListPage</h1>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        <Link to={`/details/${item.id}`}>{item.title}</Link>
                        <hr/>
                        {item.body}
                    </li>
                ))}
            </ul>
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Предыдущая</button>
            <span>Страница {page} из {totalPages}</span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Следующая</button>
        </>
    );
};
