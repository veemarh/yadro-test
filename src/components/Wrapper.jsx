import styles from "../assets/css/wrapper.module.css";

export default function Wrapper({title, children}) {
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}
