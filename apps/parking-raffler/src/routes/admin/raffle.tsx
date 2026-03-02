import { createFileRoute } from "@tanstack/react-router";

import {
  RafflePanel,
} from "app/features/admin/components/raffle-panel/raffle-panel";

export const Route = createFileRoute("/admin/raffle")({
  component: RafflePanel,
});
