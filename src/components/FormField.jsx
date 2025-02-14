import styles from "../assets/css/form.module.css";

export default function FormField({label, name, register, error, as: Component = "input", ...rest}) {
    return (
        <div>
            <label className={styles.label}>
                {label}
                <Component className={`${styles.input} ${error && styles.errorInput}`} {...register(name)} {...rest} />
                {error && (<span className={styles.error}>{error.message || error}</span>)}
            </label>
        </div>
    );
}
