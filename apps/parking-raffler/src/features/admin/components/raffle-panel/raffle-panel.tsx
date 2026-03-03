import type { SubmitEvent } from "react";
import type { Id } from "~convex/_generated/dataModel";
import type { PeriodEntryProps, SpotAssignmentRowProps } from "./types";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { useState } from "react";
import { api } from "~convex/_generated/api";
import { PHASE_LABELS } from "./consts";
import styles from "./raffle-panel.module.scss";
import { dateToTs, formatDate } from "./utils";

// ── CreatePeriodForm ──────────────────────────────────────

function CreatePeriodForm() {
  const createPeriod = useMutation(api.periods.create);
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [label, setLabel] = useState("");
  const [startDate, setStartDate] = useState("");

  async function handleSubmit(
    e: SubmitEvent<HTMLFormElement>,
  ) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await createPeriod({
        endDate: dateToTs(endDate),
        label: label.trim(),
        startDate: dateToTs(startDate),
      });
      setEndDate("");
      setLabel("");
      setStartDate("");
    }
    catch (err) {
      setError(
        err instanceof ConvexError
          ? String(err.data)
          : err instanceof Error
            ? err.message
            : "Failed to create period.",
      );
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className={styles.raffle_panel__create_section}
    >
      <h2
        className={styles.raffle_panel__section_title}
      >
        Create Period
      </h2>
      <form
        className={styles.raffle_panel__create_form}
        onSubmit={handleSubmit}
      >
        <div className={styles.raffle_panel__field}>
          <label
            className={styles.raffle_panel__label}
            htmlFor="period-label"
          >
            Label
          </label>
          <input
            className={styles.raffle_panel__input}
            id="period-label"
            onChange={(e) => {
              setLabel(e.target.value);
            }}
            placeholder="e.g. Q1 2025"
            required
            type="text"
            value={label}
          />
        </div>
        <div className={styles.raffle_panel__field}>
          <label
            className={styles.raffle_panel__label}
            htmlFor="period-start"
          >
            Start Date
          </label>
          <input
            className={styles.raffle_panel__input}
            id="period-start"
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            required
            type="date"
            value={startDate}
          />
        </div>
        <div className={styles.raffle_panel__field}>
          <label
            className={styles.raffle_panel__label}
            htmlFor="period-end"
          >
            End Date
          </label>
          <input
            className={styles.raffle_panel__input}
            id="period-end"
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
            required
            type="date"
            value={endDate}
          />
        </div>
        <button
          className={styles.raffle_panel__submit_btn}
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting
            ? "Creating\u2026"
            : "Create Period"}
        </button>
      </form>
      {error !== null && (
        <p
          className={styles.raffle_panel__error}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ── PeriodEntry ───────────────────────────────────────────

function PeriodEntry({
  onRaffleComplete,
  period,
}: PeriodEntryProps) {
  const runRaffle = useMutation(api.assignments.runRaffle);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [raffleError, setRaffleError]
    = useState<string | null>(null);

  async function handleRunRaffle() {
    setRaffleError(null);
    setIsRunning(true);
    try {
      const result = await runRaffle({});
      onRaffleComplete(result.totalFilled);
      setIsConfirming(false);
    }
    catch (err) {
      setRaffleError(
        err instanceof ConvexError
          ? String(err.data)
          : err instanceof Error
            ? err.message
            : "Raffle failed.",
      );
    }
    finally {
      setIsRunning(false);
    }
  }

  const showRunRaffle
    = period.phase === "current" && !period.raffleRun;

  return (
    <div className={styles.raffle_panel__period}>
      <div
        className={styles.raffle_panel__period_header}
      >
        <span
          className={
            styles.raffle_panel__period_label
          }
        >
          {period.label}
        </span>
        <span
          className={styles.raffle_panel__period_meta}
        >
          {formatDate(period.startDate)}
          {" — "}
          {formatDate(period.endDate)}
        </span>
        <span
          className={
            styles.raffle_panel__period_phase
          }
        >
          {PHASE_LABELS[period.phase] ?? period.phase}
        </span>
        <span
          className={
            styles.raffle_panel__period_raffle
          }
        >
          {period.raffleRun
            ? "Raffle run"
            : "Raffle not run"}
        </span>
      </div>
      {showRunRaffle && !isConfirming && (
        <div
          className={styles.raffle_panel__raffle_row}
        >
          <button
            className={styles.raffle_panel__run_btn}
            onClick={() => {
              setIsConfirming(true);
              setRaffleError(null);
            }}
            type="button"
          >
            Run Raffle
          </button>
          {raffleError !== null && (
            <p
              className={styles.raffle_panel__error}
              role="alert"
            >
              {raffleError}
            </p>
          )}
        </div>
      )}
      {showRunRaffle && isConfirming && (
        <div className={styles.raffle_panel__confirm}>
          <p
            className={
              styles.raffle_panel__confirm_text
            }
          >
            {"Auto-assignments will be created and "
              + "this action cannot be undone."
              + " Proceed?"}
          </p>
          <div
            className={styles.raffle_panel__actions}
          >
            <button
              className={
                styles["raffle_panel__btn--danger"]
              }
              disabled={isRunning}
              onClick={() => {
                void handleRunRaffle();
              }}
              type="button"
            >
              {isRunning
                ? "Running\u2026"
                : "Run Raffle"}
            </button>
            <button
              className={styles.raffle_panel__btn}
              onClick={() => {
                setIsConfirming(false);
                setRaffleError(null);
              }}
              type="button"
            >
              Cancel
            </button>
          </div>
          {raffleError !== null && (
            <p
              className={styles.raffle_panel__error}
              role="alert"
            >
              {raffleError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── SpotAssignmentRow ─────────────────────────────────────

function SpotAssignmentRow({
  currentUserId,
  residents,
  spot,
}: SpotAssignmentRowProps) {
  const assignMutation
    = useMutation(api.assignments.assign);
  const unassignMutation
    = useMutation(api.assignments.unassign);
  const [assignError, setAssignError]
    = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleChange(value: string) {
    setAssignError(null);
    setIsSubmitting(true);
    try {
      if (value === "") {
        await unassignMutation({ spotId: spot._id });
      }
      else {
        await assignMutation({
          spotId: spot._id,
          userId: value as Id<"users">,
        });
      }
    }
    catch (err) {
      setAssignError(
        err instanceof ConvexError
          ? String(err.data)
          : err instanceof Error
            ? err.message
            : "Failed to update assignment.",
      );
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <tr>
        <td className={styles.raffle_panel__td}>
          {spot.number}
        </td>
        <td className={styles.raffle_panel__td}>
          {spot.label}
        </td>
        <td className={styles.raffle_panel__td}>
          {spot.currentAssigneeName ?? "—"}
        </td>
        <td className={styles.raffle_panel__td}>
          <select
            className={styles.raffle_panel__select}
            disabled={isSubmitting}
            onChange={(e) => {
              void handleChange(e.target.value);
            }}
            value={currentUserId ?? ""}
          >
            <option value="">— None</option>
            {residents.map(r => (
              <option key={r._id} value={r._id}>
                {`${r.firstName} ${r.lastName}`}
              </option>
            ))}
          </select>
        </td>
      </tr>
      {assignError !== null && (
        <tr>
          <td
            className={styles.raffle_panel__td}
            colSpan={4}
          >
            <p
              className={styles.raffle_panel__error}
              role="alert"
            >
              {assignError}
            </p>
          </td>
        </tr>
      )}
    </>
  );
}

// ── RafflePanel (page export) ─────────────────────────────

export function RafflePanel() {
  const buildings = useQuery(api.buildings.list);
  const periods = useQuery(api.periods.list);
  const spots = useQuery(api.spots.list);
  const users = useQuery(api.users.list);
  const [lastRaffleFilled, setLastRaffleFilled]
    = useState<number | null>(null);

  const currentPeriod = periods?.find(
    p => p.phase === "current",
  );

  const currentAssignments = useQuery(
    api.assignments.listByPeriod,
    currentPeriod
      ? { periodId: currentPeriod._id }
      : "skip",
  );

  if (
    buildings === undefined
    || periods === undefined
    || spots === undefined
    || users === undefined
  ) {
    return <div>Loading…</div>;
  }

  if (
    currentPeriod !== undefined
    && currentAssignments === undefined
  ) {
    return <div>Loading…</div>;
  }

  const spotAssigneeMap = new Map<
    Id<"spots">,
    Id<"users">
  >();
  if (currentAssignments) {
    for (const a of currentAssignments) {
      spotAssigneeMap.set(a.spotId, a.userId);
    }
  }

  const totalUnassigned = spots.filter(
    s => s.currentAssigneeName === null,
  ).length;

  return (
    <div className={styles.raffle_panel}>
      <CreatePeriodForm />
      {lastRaffleFilled !== null && (
        <p
          className={
            styles.raffle_panel__raffle_result
          }
          role="status"
        >
          {`Raffle complete: ${lastRaffleFilled} spots `
            + `filled. ${totalUnassigned} remain `
            + `unassigned.`}
        </p>
      )}
      <div
        className={
          styles.raffle_panel__periods_section
        }
      >
        <h2
          className={
            styles.raffle_panel__section_title
          }
        >
          Periods
        </h2>
        {periods.length === 0
          ? (
              <p className={styles.raffle_panel__empty}>
                No periods yet.
              </p>
            )
          : periods.map(period => (
              <PeriodEntry
                key={period._id}
                onRaffleComplete={setLastRaffleFilled}
                period={period}
              />
            ))}
      </div>
      {currentPeriod !== undefined && (
        <div
          className={
            styles.raffle_panel__assign_section
          }
        >
          <h2
            className={
              styles.raffle_panel__section_title
            }
          >
            Manual Assignment Override
          </h2>
          {buildings.map((building) => {
            const buildingSpots = spots.filter(
              s => s.buildingId === building._id,
            );
            const residents = users.filter(
              u =>
                u.role === "resident"
                && u.buildingId === building._id,
            );
            return (
              <div
                className={
                  styles.raffle_panel__assign_group
                }
                key={building._id}
              >
                <h3
                  className={
                    styles
                      .raffle_panel__assign_building
                  }
                >
                  {building.name}
                </h3>
                <table
                  className={
                    styles.raffle_panel__table
                  }
                >
                  <thead>
                    <tr>
                      <th
                        className={
                          styles.raffle_panel__th
                        }
                      >
                        #
                      </th>
                      <th
                        className={
                          styles.raffle_panel__th
                        }
                      >
                        Label
                      </th>
                      <th
                        className={
                          styles.raffle_panel__th
                        }
                      >
                        Assigned Resident
                      </th>
                      <th
                        className={
                          styles.raffle_panel__th
                        }
                      >
                        Override
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {buildingSpots.map(spot => (
                      <SpotAssignmentRow
                        currentUserId={
                          spotAssigneeMap.get(
                            spot._id,
                          ) ?? null
                        }
                        key={spot._id}
                        residents={residents}
                        spot={spot}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
