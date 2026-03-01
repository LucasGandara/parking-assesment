import type { FormEvent } from "react";
import type { Doc, Id } from "~convex/_generated/dataModel";

import clsx from "clsx";
import { useMutation, useQuery } from "convex/react";
import { Fragment, useState } from "react";

import { api } from "~convex/_generated/api";

import styles from "./users-table.module.scss";

type UserRow = Doc<"users"> & { buildingName: string | null };

type UserEditFormProps = {
  buildings: Array<Doc<"buildings">>;
  onClose: () => void;
  user: UserRow;
};

function UserEditForm({
  buildings,
  onClose,
  user,
}: UserEditFormProps) {
  const updateUser = useMutation(api.users.update);
  const [buildingId, setBuildingId] = useState<Id<"buildings">>(
    user.buildingId,
  );
  const [phone, setPhone] = useState(user.phone);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await updateUser({ buildingId, id: user._id, phone });
      onClose();
    }
    catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save.",
      );
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className={styles.users_table__edit_form}
      onSubmit={handleSubmit}
    >
      <div className={styles.users_table__edit_form_fields}>
        <div className={styles.users_table__edit_form_field}>
          <label
            className={styles.users_table__edit_form_label}
            htmlFor={`building-${user._id}`}
          >
            Building
          </label>
          <select
            className={styles.users_table__edit_form_select}
            id={`building-${user._id}`}
            onChange={(e) => {
              setBuildingId(
                e.target.value as Id<"buildings">,
              );
            }}
            value={buildingId}
          >
            {buildings.map(b => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.users_table__edit_form_field}>
          <label
            className={styles.users_table__edit_form_label}
            htmlFor={`phone-${user._id}`}
          >
            Phone
          </label>
          <input
            className={styles.users_table__edit_form_input}
            id={`phone-${user._id}`}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            type="tel"
            value={phone}
          />
        </div>
      </div>
      {error !== null && (
        <p
          className={styles.users_table__edit_form_error}
          role="alert"
        >
          {error}
        </p>
      )}
      <div className={styles.users_table__edit_form_actions}>
        <button
          className={styles.users_table__edit_form_submit}
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Saving\u2026" : "Save"}
        </button>
      </div>
    </form>
  );
}

export function UsersTable() {
  const users = useQuery(api.users.list);
  const buildings = useQuery(api.buildings.list);
  const [openEditId, setOpenEditId] = useState<
    Id<"users"> | null
  >(null);

  if (users === undefined || buildings === undefined) {
    return <div>Loading…</div>;
  }

  return (
    <table className={styles.users_table}>
      <thead>
        <tr>
          <th className={styles.users_table__th}>Full Name</th>
          <th className={styles.users_table__th}>Email</th>
          <th className={styles.users_table__th}>Phone</th>
          <th className={styles.users_table__th}>Building</th>
          <th className={styles.users_table__th}>Role</th>
          <th className={styles.users_table__th} />
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <Fragment key={user._id}>
            <tr>
              <td className={styles.users_table__td}>
                {`${user.firstName} ${user.lastName}`}
              </td>
              <td className={styles.users_table__td}>
                {user.email ?? "—"}
              </td>
              <td className={styles.users_table__td}>
                {user.phone}
              </td>
              <td className={styles.users_table__td}>
                {user.buildingName ?? "—"}
              </td>
              <td className={styles.users_table__td}>
                <span
                  className={clsx(
                    styles.users_table__badge,
                    styles[
                      `users_table__badge--${user.role}`
                    ],
                  )}
                >
                  {user.role}
                </span>
              </td>
              <td className={styles.users_table__td}>
                <button
                  className={styles.users_table__edit_btn}
                  onClick={() => {
                    setOpenEditId(user._id);
                  }}
                  type="button"
                >
                  Edit
                </button>
              </td>
            </tr>
            {openEditId === user._id && (
              <tr className={styles.users_table__edit_row}>
                <td colSpan={6}>
                  <UserEditForm
                    buildings={buildings}
                    onClose={() => {
                      setOpenEditId(null);
                    }}
                    user={user}
                  />
                </td>
              </tr>
            )}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}
