import { createFileRoute } from "@tanstack/react-router";

import {
  BuildingsList,
} from "app/features/admin/components/buildings-list/buildings-list";

export const Route = createFileRoute("/admin/buildings")({
  component: BuildingsPage,
});

function BuildingsPage() {
  return <BuildingsList />;
}
