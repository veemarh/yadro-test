import {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useDataStore} from "../services/data-store.jsx";
import styles from "../assets/css/pages.module.css";
import Wrapper from "../components/Wrapper.jsx";

export default function DetailsPage() {
    const {getItemById} = useDataStore();
    const {id} = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const loadItemDetails = () => {
            setLoading(true);
            setError(null);
            getItemById(id)
                .then((data) => {
                    if (!data) {
                        throw new Error("Item not found");
                    }
                    setItem(data);
                })
                .catch(() => {
                    setError("Failed to load item.");
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        loadItemDetails();
    }, [id]);

    const handleBack = () => {
        if (location.state && location.state.from) {
            navigate(location.state.from);
        } else {
            navigate("/");
        }
    };

    if (loading) return <h1>Loading...</h1>;
    if (!item || error) return (
        <>
            <h1>{error}</h1>
            <div className={styles.buttons}>
                <button onClick={() => window.location.reload()}>Reload the page</button>
            </div>
        </>
    );

    return (
        <Wrapper title={`Details Item #${id}`}>
            <div className={styles.details}>
                <span className={styles.linkBack} onClick={handleBack}>&lt;</span>
                <div className={styles.item}>
                    <div className={styles.inner}>
                        <span className={styles.user}>By User #{item.userId}</span>
                        <h2>{item.title}</h2>
                        <p className={styles.description}>{item.body}</p>
                    </div>
                    <div className={styles.buttons}>
                        <button
                            onClick={() => navigate(`/edit/${id}`, {state: location.state || "/"})}>Edit
                        </button>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
