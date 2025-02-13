import React, {useEffect, useState, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDataStore} from "../services/data-store.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormField from "../components/FormField.jsx";

const validationSchema = Yup.object().shape({
    title: Yup.string().required("Заголовок обязателен"),
    body: Yup.string().required("Описание обязательно"),
});

export default function EditPage() {
    const {getItemById, saveChange} = useDataStore();
    const {id} = useParams();
    const navigate = useNavigate();
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
            navigate(`/details/${id}`);
        } catch (error) {
            console.error("Ошибка сохранения изменений:", error);
        }
    };

    if (loading) return <p>Загрузка...</p>;

    return (
        <>
            <h1>Редактирование элемента</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormField label="Заголовок" name="title" register={register} error={errors.title} type="text"/>
                <FormField label="Описание" name="body" register={register} error={errors.body} as="textarea"/>
                <button type="submit" disabled={isSubmitting}>Сохранить</button>
                <button type="button" onClick={() => navigate(`/details/${id}`)}>Отмена</button>
            </form>
        </>
    );
}
