import type { FormEvent, KeyboardEvent } from "react";
import type { Doc } from "~convex/_generated/dataModel";

import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { useState } from "react";

import { api } from "~convex/_generated/api";

import styles from "./buildings-list.module.scss";

type BuildingEntryProps = {
  building: Doc<"buildings">;
  residentCount: number;
};

function BuildingEntry({
  building,
  residentCount,
}: BuildingEntryProps) {
  const renameBuilding = useMutation(api.buildings.rename);
  const removeBuilding = useMutation(api.buildings.remove);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(
    building.name,
  );
  const [renameError, setRenameError] = useState<
    string | null
  >(null);
  const [deleteError, setDeleteError] = useState<
    string | null
  >(null);
  const [isRenamingSubmitting, setIsRenamingSubmitting]
    = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const label
    = residentCount === 1
      ? "1 resident"
      : `${residentCount} residents`;

  function startRename() {
    setIsRenaming(true);
    setRenameValue(building.name);
    setRenameError(null);
    setDeleteError(null);
  }

  function cancelRename() {
    setIsRenaming(false);
    setRenameError(null);
  }

  async function handleRenameSubmit() {
    const trimmed = renameValue.trim();
    if (!trimmed)
      return;
    setRenameError(null);
    setIsRenamingSubmitting(true);
    try {
      await renameBuilding({ id: building._id, name: trimmed });
      setIsRenaming(false);
    }
    catch (err) {
      setRenameError(
        err instanceof Error ? err.message : "Failed to rename.",
      );
    }
    finally {
      setIsRenamingSubmitting(false);
    }
  }

  async function handleDelete() {
    setDeleteError(null);
    setIsDeleting(true);
    try {
      await removeBuilding({ id: building._id });
    }
    catch (err) {
      if (err instanceof ConvexError) {
        setDeleteError(String(err.data));
      }
      else {
        setDeleteError(
          err instanceof Error
            ? err.message
            : "Failed to delete.",
        );
      }
    }
    finally {
      setIsDeleting(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      void handleRenameSubmit();
    }
    if (e.key === "Escape") {
      cancelRename();
    }
  }

  return (
    <div className={styles.buildings_list__entry_wrapper}>
      <div className={styles.buildings_list__entry}>
        {isRenaming
          ? (
              <input
                autoFocus
                className={
                  styles.buildings_list__entry_input
                }
                disabled={isRenamingSubmitting}
                onChange={(e) => {
                  setRenameValue(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                type="text"
                value={renameValue}
              />
            )
          : (
              <span
                className={
                  styles.buildings_list__entry_name
                }
              >
                {building.name}
              </span>
            )}
        <div className={styles.buildings_list__entry_right}>
          <span
            className={styles.buildings_list__entry_count}
          >
            {label}
          </span>
          <div
            className={styles.buildings_list__entry_actions}
          >
            {isRenaming
              ? (
                  <button
                    className={
                      styles.buildings_list__entry_btn
                    }
                    disabled={isRenamingSubmitting}
                    onClick={() => {
                      void handleRenameSubmit();
                    }}
                    type="button"
                  >
                    Save
                  </button>
                )
              : (
                  <>
                    <button
                      className={
                        styles.buildings_list__entry_btn
                      }
                      onClick={startRename}
                      type="button"
                    >
                      Rename
                    </button>
                    <button
                      className={
                        styles[
                          "buildings_list__entry_btn--delete"
                        ]
                      }
                      disabled={isDeleting}
                      onClick={() => {
                        void handleDelete();
                      }}
                      type="button"
                    >
                      Delete
                    </button>
                  </>
                )}
          </div>
        </div>
      </div>
      {renameError !== null && (
        <p
          className={styles.buildings_list__entry_error}
          role="alert"
        >
          {renameError}
        </p>
      )}
      {deleteError !== null && (
        <p
          className={styles.buildings_list__entry_error}
          role="alert"
        >
          {deleteError}
        </p>
      )}
    </div>
  );
}

export function BuildingsList() {
  const buildings = useQuery(api.buildings.list);
  const users = useQuery(api.users.list);
  const createBuilding = useMutation(api.buildings.create);
  const [name, setName] = useState("");
  const [createError, setCreateError] = useState<
    string | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (buildings === undefined || users === undefined) {
    return <div>Loading…</div>;
  }

  const residentCounts = new Map<string, number>();
  for (const user of users) {
    residentCounts.set(
      user.buildingId,
      (residentCounts.get(user.buildingId) ?? 0) + 1,
    );
  }

  async function handleCreate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setCreateError(null);
    setIsSubmitting(true);
    try {
      await createBuilding({ name });
      setName("");
    }
    catch (err) {
      setCreateError(
        err instanceof Error
          ? err.message
          : "Failed to create.",
      );
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.buildings_list}>
      <div>
        <form
          className={styles.buildings_list__create_form}
          onSubmit={handleCreate}
        >
          <div
            className={styles.buildings_list__create_field}
          >
            <label
              className={
                styles.buildings_list__create_label
              }
              htmlFor="building-name"
            >
              Building name
            </label>
            <input
              className={
                styles.buildings_list__create_input
              }
              id="building-name"
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="e.g. Torre Norte"
              required
              type="text"
              value={name}
            />
          </div>
          <button
            className={styles.buildings_list__create_submit}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Adding\u2026" : "Add Building"}
          </button>
        </form>
        {createError !== null && (
          <p
            className={styles.buildings_list__create_error}
            role="alert"
          >
            {createError}
          </p>
        )}
      </div>
      <div>
        {buildings.map(building => (
          <BuildingEntry
            building={building}
            key={building._id}
            residentCount={
              residentCounts.get(building._id) ?? 0
            }
          />
        ))}
      </div>
    </div>
  );
}
