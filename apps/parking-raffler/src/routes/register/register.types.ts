import type { ReactNode } from "react";

export type BuildingFieldProps = {
  error?: string;
  onChange: (id: string) => void;
};

export type EBProps = { children: ReactNode; fallback: ReactNode };
export type EBState = { hasError: boolean };

export type FormErrors = {
  buildingId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  phone?: string;
  submit?: string;
};
