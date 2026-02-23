import type { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from ".";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockSignIn = vi.hoisted(() => vi.fn());
const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("@convex-dev/auth/react", () => ({
  useAuthActions: () => ({ signIn: mockSignIn }),
}));

vi.mock(
  "@tanstack/react-router",
  async (importOriginal) => {
    const actual = await importOriginal<
      typeof import("@tanstack/react-router")
    >();
    const { createElement } = await import("react");
    return {
      ...actual,
      Link: ({ children, to }: { children: ReactNode; to: string }) =>
        createElement("a", { href: to }, children),
      useNavigate: () => mockNavigate,
    };
  },
);

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("loginForm", () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    mockNavigate.mockReset();
  });

  it("renders all form fields", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign In" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Sign up" }),
    ).toBeInTheDocument();
  });

  it("renders Forgot password as a non-interactive span", () => {
    render(<LoginForm />);

    const forgot = screen.getByText("Forgot password?");

    expect(forgot.tagName).toBe("SPAN");
    expect(
      screen.queryByRole("link", { name: /forgot password/i }),
    ).not.toBeInTheDocument();
  });

  it("does not show an error message on initial render", () => {
    render(<LoginForm />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows error message when sign-in fails", async () => {
    mockSignIn.mockRejectedValue(new Error("bad credentials"));
    const user = userEvent.setup();

    render(<LoginForm />);
    await user.type(screen.getByLabelText("Email"), "test@unosquare.com");
    await user.type(screen.getByLabelText("Password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Invalid email or password.",
      );
    });
  });

  it("navigates to / after successful sign-in", async () => {
    mockSignIn.mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<LoginForm />);
    await user.type(screen.getByLabelText("Email"), "test@unosquare.com");
    await user.type(screen.getByLabelText("Password"), "correctpassword");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
    });
  });

  it("calls signIn with email, password, and flow=signIn", async () => {
    mockSignIn.mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<LoginForm />);
    await user.type(screen.getByLabelText("Email"), "user@unosquare.com");
    await user.type(screen.getByLabelText("Password"), "mypassword");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("password", {
        email: "user@unosquare.com",
        flow: "signIn",
        password: "mypassword",
      });
    });
  });
});
