"use client";

import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  appName: string;
};

export function Button({ children, className, appName }: ButtonProps) {
  return (
    <button
      className={className}
      // eslint-disable-next-line no-alert
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
}
