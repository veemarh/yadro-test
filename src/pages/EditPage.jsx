import {useEffect, useState, useRef} from "react";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import {useDataStore} from "../services/data-store.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormField from "../components/FormField.jsx";
import styles from "../assets/css/pages.module.css";
import Wrapper from "../components/Wrapper.jsx";

const validationSchema = Yup.object().shape({
    title: Yup.string()
        .trim()
        .test("not-empty", "Title is required", (value) => !!value && value.replace(/\s/g, "").length > 0)
        .required("Title is required"),
    body: Yup.string()
        .trim()
        .test("not-empty", "Description is required", (value) => !!value && value.replace(/\s/g, "").length > 0)
        .required("Description is required"),
});

export default function EditPage() {
    const {getItemById, saveChange} = useDataStore();
    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const originalData = useRef({});
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        const loadItemDetails = () => {
            setLoading(true);
            getItemById(id)
                .then((data) => {
                    originalData.current = data;
                    reset(data);
                })
                .catch((error) => {
                    console.error("Ошибка загрузки элемента:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        loadItemDetails();
    }, [id, reset, getItemById]);

    const onSubmit = async (formData) => {
        const updatedData = {
            ...originalData.current,
            ...formData,
        };

        try {
            await saveChange(id, updatedData);
            handleBack();
        } catch (error) {
            console.error("Ошибка сохранения изменений:", error);
        }
    };

    const handleBack = () => {
        navigate(`/details/${id}`, {state: {from: location.state?.from || "/"}});
    };

    if (loading) return <h1>Loading...</h1>;
    if (!originalData.current) return (
        <>
            <h1>Couldn't process data.</h1>
            <div className={styles.buttons}>
                <button onClick={() => window.location.reload()}>Reload the page</button>
            </div>
        </>
    );

    return (
        <Wrapper title={`Edit Item #${id}`}>
            <div className={styles.details}>
                <div className={styles.item}>
                    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.inner}>
                            <FormField label="Title" name="title" register={register} error={errors.title}
                                       type="text"/>
                            <FormField label="Description" name="body" register={register} error={errors.body}
                                       as="textarea"/>
                        </div>
                        <div className={styles.buttons}>
                            <button className={styles.formButton} type="submit" disabled={isSubmitting}>Save</button>
                            <button className={`${styles.formButton} ${styles.cancel}`} type="button"
                                    onClick={handleBack}>Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Wrapper>
    );
}
