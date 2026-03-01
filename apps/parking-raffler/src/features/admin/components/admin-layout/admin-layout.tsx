import { Link, Outlet } from "@tanstack/react-router";

import styles from "./admin-layout.module.scss";

const NAV_LINKS = [
  { label: "Users", to: "/admin/users" },
  { label: "Buildings", to: "/admin/buildings" },
  { label: "Spots", to: "/admin/spots" },
  { label: "Raffle", to: "/admin/raffle" },
] as const;

export function AdminLayout() {
  return (
    <div className={styles.admin_layout}>
      <nav className={styles.admin_layout__sidebar}>
        <ul className={styles.admin_layout__nav}>
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <Link
                activeOptions={{ exact: true }}
                activeProps={{
                  className:
                    styles["admin_layout__nav_link--active"],
                }}
                className={styles.admin_layout__nav_link}
                to={to}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className={styles.admin_layout__main}>
        <Outlet />
      </main>
    </div>
  );
}
