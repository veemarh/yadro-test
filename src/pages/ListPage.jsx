import {useEffect, useState} from "react";
import {Link, useSearchParams, useNavigate} from "react-router-dom";
import {dataStore} from "../services/data-store.js";

export default function ListPage() {
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const ITEMS_PER_PAGE = 10;

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    let page = parseInt(searchParams.get("page") || "1", 10);

    useEffect(() => {
        if (isNaN(page) || page < 1) {
            navigate("?page=1", {replace: true});
            return;
        }

        const loadItems = () => {
            setLoading(true);
            dataStore.getItemsWithChanges(page, ITEMS_PER_PAGE)
                .then(({data, totalItems}) => {
                    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

                    if (page > totalPages && totalPages > 0) {
                        navigate(`?page=${totalPages}`, {replace: true});
                        return;
                    }

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
    }, [page, navigate]);

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setSearchParams({page: newPage});
        }
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
