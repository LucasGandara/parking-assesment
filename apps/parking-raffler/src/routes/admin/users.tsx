import { createFileRoute } from "@tanstack/react-router";

import {
  UsersTable,
} from "app/features/admin/components/users-table/users-table";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

function UsersPage() {
  return <UsersTable />;
}
