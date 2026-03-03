import type { Doc, Id } from "~convex/_generated/dataModel";

export type Resident = Doc<"users"> & {
  buildingName: string | null;
};

export type SpotAssignmentRowProps = {
  currentUserId: Id<"users"> | null;
  residents: Resident[];
  spot: Doc<"spots"> & {
    currentAssigneeName: string | null;
  };
};

export type PeriodEntryProps = {
  onRaffleComplete: (totalFilled: number) => void;
  period: Doc<"periods">;
};
