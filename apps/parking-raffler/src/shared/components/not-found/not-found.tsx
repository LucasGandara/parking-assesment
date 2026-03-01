import { Link } from "@tanstack/react-router";

import styles from "./not-found.module.scss";

export function NotFound() {
  return (
    <div className={styles.not_found}>
      <h1 className={styles.not_found__title}>404</h1>
      <p className={styles.not_found__message}>
        This page could not be found.
      </p>
      <Link className={styles.not_found__action} to="/">
        Go to Dashboard
      </Link>
    </div>
  );
}
