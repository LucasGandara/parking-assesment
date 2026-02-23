import type { ReactNode } from "react";

export type Feature = {
  description: string;
  icon: ReactNode;
  title: string;
};

export type AuthLayoutProps = {
  adminEmail: string;
  children: ReactNode;
};
