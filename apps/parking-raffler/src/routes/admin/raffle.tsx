import { createFileRoute } from "@tanstack/react-router";

import {
  ComingSoon,
} from "app/features/admin/components/coming-soon/coming-soon";

export const Route = createFileRoute("/admin/raffle")({
  component: ComingSoon,
});
