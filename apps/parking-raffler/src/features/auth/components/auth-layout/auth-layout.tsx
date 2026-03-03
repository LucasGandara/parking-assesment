import type { AuthLayoutProps } from "./types";
import { ParkingIcon } from "../icons/icons";
import styles from "./auth-layout.module.scss";
import { ADMIN_EMAIL, FEATURES, PARKING_IMG } from "./consts";

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.auth_layout}>

      <div className={styles.auth_layout__left}>
        <div className={styles.auth_layout__bg_pattern} />
        <div className={styles.auth_layout__left_inner}>

          <div className={styles.auth_layout__logo_row}>
            <div className={styles.auth_layout__logo_icon}>
              <ParkingIcon />
            </div>
            <div>
              <h1 className={styles.auth_layout__brand}>ParkSmart AI</h1>
              <p className={styles.auth_layout__brand_sub}>
                IoT Parking Solutions
              </p>
            </div>
          </div>

          <div className={styles.auth_layout__mid}>
            <div>
              <h2 className={styles.auth_layout__headline}>
                Intelligent Parking
                <br />
                Management System
              </h2>
              <p className={styles.auth_layout__desc}>
                Advanced robotics and IoT technology for seamless parking
                slot management in residential buildings.
              </p>
            </div>

            <div className={styles.auth_layout__features}>
              {FEATURES.map(feature => (
                <div
                  className={styles.auth_layout__feature}
                  key={feature.title}
                >
                  <div className={styles.auth_layout__feature_icon}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className={styles.auth_layout__feature_title}>
                      {feature.title}
                    </h3>
                    <p className={styles.auth_layout__feature_desc}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.auth_layout__image_wrap}>
              <img
                alt="Smart Parking Technology"
                className={styles.auth_layout__image}
                src={PARKING_IMG}
              />
            </div>
          </div>

          <p className={styles.auth_layout__copyright}>
            © 2026 ParkSmart AI. All rights reserved.
          </p>
        </div>
      </div>

      <div className={styles.auth_layout__right}>
        <div className={styles.auth_layout__right_content}>

          <div className={styles.auth_layout__mobile_logo}>
            <div className={styles.auth_layout__mobile_logo_icon}>
              <ParkingIcon />
            </div>
            <div>
              <h1 className={styles.auth_layout__brand}>ParkSmart AI</h1>
              <p className={styles.auth_layout__mobile_brand_sub}>
                IoT Parking Solutions
              </p>
            </div>
          </div>

          <div className={styles.auth_layout__card}>
            {children}
          </div>

          <p className={styles.auth_layout__help}>
            {"Need help? "}
            <a
              className={styles.auth_layout__help_link}
              href={`mailto:${ADMIN_EMAIL}`}
            >
              Contact your building administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
