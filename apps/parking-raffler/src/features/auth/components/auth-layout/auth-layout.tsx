import type { ReactNode } from "react";

import { BuildingIcon, CpuIcon, ParkingIcon } from "../icons/icons";

import styles from "./auth-layout.module.scss";

type Feature = {
  description: string;
  icon: ReactNode;
  title: string;
};

type AuthLayoutProps = {
  adminEmail: string;
  children: ReactNode;
};

const PARKING_IMG = "https://images.unsplash.com/photo-1715079166936-1577f93c44fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";

const FEATURES: Feature[] = [
  {
    description: "Track parking availability instantly with IoT sensors",
    icon: <CpuIcon />,
    title: "Real-time Monitoring",
  },
  {
    description: "Easy access for building residents to manage slots",
    icon: <BuildingIcon />,
    title: "Resident Portal",
  },
];

export function AuthLayout({ adminEmail, children }: AuthLayoutProps) {
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
              href={`mailto:${adminEmail}`}
            >
              Contact your building administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
