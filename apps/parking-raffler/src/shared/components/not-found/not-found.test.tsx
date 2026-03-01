import type { ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NotFound } from "./not-found";

vi.mock(
  "@tanstack/react-router",
  async (importOriginal) => {
    const actual = await importOriginal<
      typeof import("@tanstack/react-router")
    >();
    const { createElement } = await import("react");
    return {
      ...actual,
      Link: (
        { children, to }: { children: ReactNode; to: string },
      ) => createElement("a", { href: to }, children),
    };
  },
);

describe("notFound", () => {
  it("renders a page not found message", () => {
    render(<NotFound />);
    expect(
      screen.getByText(/page could not be found/i),
    ).toBeInTheDocument();
  });

  it("renders a Go to Dashboard link pointing to /", () => {
    render(<NotFound />);
    const link = screen.getByRole("link", {
      name: "Go to Dashboard",
    });
    expect(link).toHaveAttribute("href", "/");
  });
});
