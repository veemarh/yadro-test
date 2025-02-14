import {useEffect, useState} from "react";
import {Link, useSearchParams, useNavigate, useLocation} from "react-router-dom";
import {useDataStore} from "../services/data-store.jsx";
import styles from "../assets/css/pages.module.css";
import Wrapper from "../components/Wrapper.jsx";

export default function ListPage() {
    const {getItemsWithChanges} = useDataStore();
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const ITEMS_PER_PAGE = 10;

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    let page = parseInt(searchParams.get("page") || "1", 10);

    useEffect(() => {
        if (isNaN(page) || page < 1) {
            navigate("?page=1", {replace: true});
            return;
        }

        const loadItems = () => {
            setLoading(true);
            getItemsWithChanges(page, ITEMS_PER_PAGE)
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

    if (loading) return <h1>Loading...</h1>;
    if (!items) return <h1>Not found.</h1>;

    return (
        <Wrapper title={"List Page"}>
            <ul className={styles.list}>
                {items.map((item) => (
                    <li className={styles.card} key={item.id}>
                        <Link className={`${styles.item}`} to={`/details/${item.id}`}
                              state={{from: location.pathname + location.search}}>
                            <span className={styles.cardTitle}>{item.title}</span>
                            <hr/>
                            <div className={styles.cardMedium}><span
                                className={styles.mediumContent}> {item.body}</span>
                            </div>
                            <div className={styles.cardBottom}>
                                <span>ID #{item.id}</span>
                                <span>User #{item.userId}</span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            <div className={styles.buttons}>
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>&lt;</button>
                <span>{page} of {totalPages}</span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>&gt;</button>
            </div>
        </Wrapper>
    );
};
