import { createFileRoute } from "@tanstack/react-router";

import {
  SpotsList,
} from "app/features/admin/components/spots-list/spots-list";

export const Route = createFileRoute("/admin/spots")({
  component: SpotsList,
});
