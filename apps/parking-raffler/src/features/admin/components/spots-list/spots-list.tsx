import type { KeyboardEvent } from "react";
import type { Doc } from "~convex/_generated/dataModel";

import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { useState } from "react";

import { api } from "~convex/_generated/api";

import styles from "./spots-list.module.scss";

type SpotWithAssignee = Doc<"spots"> & {
  currentAssigneeName: string | null;
};

// ── SpotRow ───────────────────────────────────────────────

type SpotRowProps = {
  spot: SpotWithAssignee;
};

function SpotRow({ spot }: SpotRowProps) {
  const removeSpot = useMutation(api.spots.remove);
  const updateSpot = useMutation(api.spots.update);

  const [deleteError, setDeleteError]
    = useState<string | null>(null);
  const [editError, setEditError]
    = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState(spot.label);
  const [editNumber, setEditNumber] = useState(spot.number);
  const [isConfirmingDelete, setIsConfirmingDelete]
    = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditSubmitting, setIsEditSubmitting]
    = useState(false);

  function startEdit() {
    setEditError(null);
    setEditLabel(spot.label);
    setEditNumber(spot.number);
    setIsConfirmingDelete(false);
    setIsEditing(true);
  }

  function cancelEdit() {
    setEditError(null);
    setIsEditing(false);
  }

  async function handleEditSubmit() {
    setEditError(null);
    setIsEditSubmitting(true);
    try {
      await updateSpot({
        id: spot._id,
        label: editLabel.trim(),
        number: editNumber,
      });
      setIsEditing(false);
    }
    catch (err) {
      setEditError(
        err instanceof ConvexError
          ? String(err.data)
          : err instanceof Error
            ? err.message
            : "Failed to save.",
      );
    }
    finally {
      setIsEditSubmitting(false);
    }
  }

  function handleKeyDown(
    e: KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Enter")
      void handleEditSubmit();
    if (e.key === "Escape")
      cancelEdit();
  }

  function activateDelete() {
    if (spot.currentAssigneeName !== null) {
      setDeleteError(null);
      setIsConfirmingDelete(true);
      setIsEditing(false);
    }
    else {
      void handleDelete();
    }
  }

  async function handleDelete() {
    setDeleteError(null);
    setIsDeleting(true);
    try {
      await removeSpot({ id: spot._id });
    }
    catch (err) {
      setDeleteError(
        err instanceof ConvexError
          ? String(err.data)
          : err instanceof Error
            ? err.message
            : "Failed to delete.",
      );
      setIsConfirmingDelete(false);
    }
    finally {
      setIsDeleting(false);
    }
  }

  // ── Edit mode ───────────────────────────────────────────

  if (isEditing) {
    return (
      <>
        <tr>
          <td className={styles.spots_list__td}>
            <input
              autoFocus
              className={styles.spots_list__input}
              disabled={isEditSubmitting}
              min={1}
              onChange={(e) => {
                setEditNumber(Number(e.target.value));
              }}
              onKeyDown={handleKeyDown}
              type="number"
              value={editNumber}
            />
          </td>
          <td className={styles.spots_list__td}>
            <input
              className={styles.spots_list__input}
              disabled={isEditSubmitting}
              onChange={(e) => {
                setEditLabel(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              type="text"
              value={editLabel}
            />
          </td>
          <td className={styles.spots_list__td}>
            {spot.currentAssigneeName ?? "—"}
          </td>
          <td className={styles.spots_list__td}>
            <div className={styles.spots_list__actions}>
              <button
                className={styles.spots_list__btn}
                disabled={isEditSubmitting}
                onClick={() => {
                  void handleEditSubmit();
                }}
                type="button"
              >
                Save
              </button>
              <button
                className={styles.spots_list__btn}
                onClick={cancelEdit}
                type="button"
              >
                Cancel
              </button>
            </div>
          </td>
        </tr>
        {editError !== null && (
          <tr>
            <td
              className={styles.spots_list__td}
              colSpan={4}
            >
              <p
                className={styles.spots_list__error}
                role="alert"
              >
                {editError}
              </p>
            </td>
          </tr>
        )}
      </>
    );
  }

  // ── Delete-confirm mode ─────────────────────────────────

  if (isConfirmingDelete) {
    return (
      <tr>
        <td
          className={styles.spots_list__td}
          colSpan={4}
        >
          <div className={styles.spots_list__confirm}>
            <span
              className={styles.spots_list__confirm_text}
            >
              {`Delete this spot? `
                + `${spot.currentAssigneeName}'s assignment`
                + ` will be removed.`}
            </span>
            <div className={styles.spots_list__actions}>
              <button
                className={
                  styles["spots_list__btn--danger"]
                }
                disabled={isDeleting}
                onClick={() => {
                  void handleDelete();
                }}
                type="button"
              >
                {isDeleting
                  ? "Deleting\u2026"
                  : "Delete"}
              </button>
              <button
                className={styles.spots_list__btn}
                onClick={() => {
                  setIsConfirmingDelete(false);
                }}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
          {deleteError !== null && (
            <p
              className={styles.spots_list__error}
              role="alert"
            >
              {deleteError}
            </p>
          )}
        </td>
      </tr>
    );
  }

  // ── Read mode ───────────────────────────────────────────

  return (
    <>
      <tr>
        <td className={styles.spots_list__td}>
          {spot.number}
        </td>
        <td className={styles.spots_list__td}>
          {spot.label}
        </td>
        <td className={styles.spots_list__td}>
          {spot.currentAssigneeName ?? "—"}
        </td>
        <td className={styles.spots_list__td}>
          <div className={styles.spots_list__actions}>
            <button
              className={styles.spots_list__btn}
              onClick={startEdit}
              type="button"
            >
              Edit
            </button>
            <button
              className={
                styles["spots_list__btn--delete"]
              }
              disabled={isDeleting}
              onClick={activateDelete}
              type="button"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
      {deleteError !== null && (
        <tr>
          <td
            className={styles.spots_list__td}
            colSpan={4}
          >
            <p
              className={styles.spots_list__error}
              role="alert"
            >
              {deleteError}
            </p>
          </td>
        </tr>
      )}
    </>
  );
}

// ── BuildingSection ───────────────────────────────────────

type BuildingSectionProps = {
  building: Doc<"buildings">;
  spots: SpotWithAssignee[];
};

function BuildingSection({
  building,
  spots,
}: BuildingSectionProps) {
  const createSpot = useMutation(api.spots.create);

  const [addError, setAddError]
    = useState<string | null>(null);
  const [addLabel, setAddLabel] = useState("");
  const [addNumber, setAddNumber] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddSubmitting, setIsAddSubmitting]
    = useState(false);

  function startAdd() {
    const next
      = spots.length === 0
        ? 1
        : Math.max(...spots.map(s => s.number)) + 1;
    setAddError(null);
    setAddLabel(`A${next}`);
    setAddNumber(next);
    setIsAdding(true);
  }

  function cancelAdd() {
    setAddError(null);
    setIsAdding(false);
  }

  async function handleAddSubmit() {
    setAddError(null);
    setIsAddSubmitting(true);
    try {
      await createSpot({
        buildingId: building._id,
        label: addLabel.trim(),
        number: addNumber,
      });
      setIsAdding(false);
    }
    catch (err) {
      setAddError(
        err instanceof ConvexError
          ? String(err.data)
          : err instanceof Error
            ? err.message
            : "Failed to create.",
      );
    }
    finally {
      setIsAddSubmitting(false);
    }
  }

  return (
    <div className={styles.spots_list__section}>
      <div className={styles.spots_list__section_header}>
        <span className={styles.spots_list__section_name}>
          {building.name}
        </span>
        <button
          className={styles.spots_list__btn}
          onClick={startAdd}
          type="button"
        >
          Add Spot
        </button>
      </div>
      <table className={styles.spots_list__table}>
        <thead>
          <tr>
            <th className={styles.spots_list__th}>#</th>
            <th className={styles.spots_list__th}>
              Label
            </th>
            <th className={styles.spots_list__th}>
              Current Assignee
            </th>
            <th className={styles.spots_list__th} />
          </tr>
        </thead>
        <tbody>
          {spots.map(spot => (
            <SpotRow key={spot._id} spot={spot} />
          ))}
          {isAdding && (
            <>
              <tr>
                <td className={styles.spots_list__td}>
                  <input
                    autoFocus
                    className={styles.spots_list__input}
                    disabled={isAddSubmitting}
                    min={1}
                    onChange={(e) => {
                      setAddNumber(
                        Number(e.target.value),
                      );
                    }}
                    type="number"
                    value={addNumber}
                  />
                </td>
                <td className={styles.spots_list__td}>
                  <input
                    className={styles.spots_list__input}
                    disabled={isAddSubmitting}
                    onChange={(e) => {
                      setAddLabel(e.target.value);
                    }}
                    type="text"
                    value={addLabel}
                  />
                </td>
                <td className={styles.spots_list__td}>
                  —
                </td>
                <td className={styles.spots_list__td}>
                  <div
                    className={
                      styles.spots_list__actions
                    }
                  >
                    <button
                      className={styles.spots_list__btn}
                      disabled={isAddSubmitting}
                      onClick={() => {
                        void handleAddSubmit();
                      }}
                      type="button"
                    >
                      {isAddSubmitting
                        ? "Saving\u2026"
                        : "Save"}
                    </button>
                    <button
                      className={styles.spots_list__btn}
                      onClick={cancelAdd}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
              {addError !== null && (
                <tr>
                  <td
                    className={styles.spots_list__td}
                    colSpan={4}
                  >
                    <p
                      className={styles.spots_list__error}
                      role="alert"
                    >
                      {addError}
                    </p>
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── SpotsList (page export) ───────────────────────────────

export function SpotsList() {
  const buildings = useQuery(api.buildings.list);
  const spots = useQuery(api.spots.list);

  if (buildings === undefined || spots === undefined) {
    return <div>Loading…</div>;
  }

  return (
    <div className={styles.spots_list}>
      {buildings.map(building => (
        <BuildingSection
          building={building}
          key={building._id}
          spots={spots.filter(
            s => s.buildingId === building._id,
          )}
        />
      ))}
    </div>
  );
}
