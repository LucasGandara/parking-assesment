import styles from "./coming-soon.module.scss";

export function ComingSoon() {
  return (
    <div className={styles.coming_soon}>
      <h2 className={styles.coming_soon__title}>
        Coming Soon
      </h2>
      <p className={styles.coming_soon__subtitle}>
        This section is not yet available.
      </p>
    </div>
  );
}
