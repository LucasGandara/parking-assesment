import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";

import { api } from "~convex/_generated/api";

import styles from "./parking-raffler-card.module.scss";

function formatSpot(label: string, number: number): string {
  return `${label} · #${number}`;
}

export function ParkingRafflerCard() {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const data = useQuery(
    api.assignments.getForCurrentUser,
  );

  async function handleLogout() {
    await signOut();
    await navigate({ to: "/login" });
  }

  if (data === undefined) {
    return <div>Loading…</div>;
  }

  const currentStatus = (() => {
    if (!data?.currentPeriod)
      return "No active period";
    if (data.currentSpot) {
      return formatSpot(
        data.currentSpot.label,
        data.currentSpot.number,
      );
    }
    return "No spot this period";
  })();

  const previousStatus = (() => {
    if (!data?.previousPeriod || !data.previousSpot) {
      return "—";
    }
    return formatSpot(
      data.previousSpot.label,
      data.previousSpot.number,
    );
  })();

  return (
    <div className={styles.parking_raffler_card}>
      <h2
        className={styles.parking_raffler_card__title}
      >
        Parking Raffler
      </h2>
      <dl
        className={styles.parking_raffler_card__list}
      >
        <div
          className={styles.parking_raffler_card__row}
        >
          <dt
            className={
              styles.parking_raffler_card__label
            }
          >
            Building
          </dt>
          <dd
            className={
              styles.parking_raffler_card__value
            }
          >
            {data?.buildingName ?? "—"}
          </dd>
        </div>
        <div
          className={styles.parking_raffler_card__row}
        >
          <dt
            className={
              styles.parking_raffler_card__label
            }
          >
            Current period
          </dt>
          <dd
            className={
              styles.parking_raffler_card__value
            }
          >
            {currentStatus}
          </dd>
        </div>
        <div
          className={styles.parking_raffler_card__row}
        >
          <dt
            className={
              styles.parking_raffler_card__label
            }
          >
            Previous period
          </dt>
          <dd
            className={
              styles.parking_raffler_card__value
            }
          >
            {previousStatus}
          </dd>
        </div>
      </dl>
      <div className={styles.parking_raffler_card__footer}>
        <button
          className={styles.parking_raffler_card__logout}
          onClick={handleLogout}
          type="button"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
