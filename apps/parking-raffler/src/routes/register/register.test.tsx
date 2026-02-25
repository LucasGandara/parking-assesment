import type { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RegisterForm } from ".";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockSignIn = vi.hoisted(() => vi.fn());
const mockNavigate = vi.hoisted(() => vi.fn());
const mockUseQuery = vi.hoisted(() => vi.fn());

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

vi.mock("convex/react", () => ({
  useQuery: mockUseQuery,
}));

vi.mock("../../../convex/_generated/api", () => ({
  api: { buildings: { list: {} } },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

type Building = { _id: string; name: string };

const BUILDINGS: Building[] = [
  { _id: "b1", name: "Tower A" },
  { _id: "b2", name: "Tower B" },
];

async function fillValidForm(
  user: ReturnType<typeof userEvent.setup>,
) {
  await user.type(screen.getByLabelText("First name"), "Jane");
  await user.type(screen.getByLabelText("Last name"), "Doe");
  await user.type(
    screen.getByLabelText("Email"),
    "jane@unosquare.com",
  );
  await user.type(screen.getByLabelText("Password"), "secret12");
  await user.click(screen.getByLabelText("Building"));
  await user.click(screen.getByRole("option", { name: "Tower A" }));
  await user.type(
    screen.getByLabelText("Phone number"),
    "1234567890",
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("registerForm", () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    mockNavigate.mockReset();
    mockUseQuery.mockReturnValue(BUILDINGS);
  });

  // --- Rendering ---

  it("renders all 6 fields", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText("First name")).toBeInTheDocument();
    expect(screen.getByLabelText("Last name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Building")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Phone number"),
    ).toBeInTheDocument();
  });

  it("renders the Create Account submit button", () => {
    render(<RegisterForm />);

    expect(
      screen.getByRole("button", { name: "Create Account" }),
    ).toBeInTheDocument();
  });

  it("renders Sign in link pointing to /login", () => {
    render(<RegisterForm />);

    expect(
      screen.getByRole("link", { name: "Sign in" }),
    ).toHaveAttribute("href", "/login");
  });

  it("renders phone hint text at all times", () => {
    render(<RegisterForm />);

    expect(
      screen.getByText("10 digits, no spaces or dashes"),
    ).toBeInTheDocument();
  });

  it("does not show error alerts on initial render", () => {
    render(<RegisterForm />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  // --- Building dropdown states ---

  it("disables building input while buildings are loading", () => {
    mockUseQuery.mockReturnValue(undefined);
    render(<RegisterForm />);

    expect(screen.getByLabelText("Building")).toBeDisabled();
  });

  it("shows Loading placeholder while buildings are loading", () => {
    mockUseQuery.mockReturnValue(undefined);
    render(<RegisterForm />);

    expect(screen.getByLabelText("Building")).toHaveAttribute(
      "placeholder",
      "Loading\u2026",
    );
  });

  it("shows no-buildings message when list is empty", async () => {
    mockUseQuery.mockReturnValue([]);
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.click(screen.getByLabelText("Building"));

    expect(
      screen.getByText(/No buildings available/),
    ).toBeInTheDocument();
  });

  it("renders building options in the dropdown", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.click(screen.getByLabelText("Building"));

    expect(
      screen.getByRole("option", { name: "Tower A" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Tower B" }),
    ).toBeInTheDocument();
  });

  // --- Validation errors ---

  it("shows required errors for all empty fields on submit", async () => {
    mockUseQuery.mockReturnValue([]);
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.click(
      screen.getByRole("button", { name: "Create Account" }),
    );

    const alerts = await screen.findAllByRole("alert");

    expect(alerts.length).toBeGreaterThanOrEqual(5);
  });

  it("shows email domain error for non-unosquare address", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(
      screen.getByLabelText("Email"),
      "test@gmail.com",
    );
    await user.click(
      screen.getByRole("button", { name: "Create Account" }),
    );

    await waitFor(() => {
      expect(
        screen
          .getAllByRole("alert")
          .some(
            el =>
              el.textContent
              === "Only @unosquare.com email addresses are accepted.",
          ),
      ).toBe(true);
    });
  });

  it("shows password length error for short password", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText("Password"), "short");
    await user.click(
      screen.getByRole("button", { name: "Create Account" }),
    );

    await waitFor(() => {
      expect(
        screen
          .getAllByRole("alert")
          .some(
            el =>
              el.textContent
              === "Password must be at least 8 characters.",
          ),
      ).toBe(true);
    });
  });

  it("shows phone format error for invalid phone", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText("Phone number"), "12345");
    await user.click(
      screen.getByRole("button", { name: "Create Account" }),
    );

    await waitFor(() => {
      expect(
        screen
          .getAllByRole("alert")
          .some(
            el =>
              el.textContent
              === "Phone number must be exactly 10 digits.",
          ),
      ).toBe(true);
    });
  });

  it("does not call signIn when validation fails", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.click(
      screen.getByRole("button", { name: "Create Account" }),
    );

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  // --- Server errors ---

  it("shows domain error returned from server", async () => {
    mockSignIn.mockRejectedValue(
      new Error("Only @unosquare.com email addresses are accepted."),
    );
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.click(
      screen.getByRole("button", { name: "Create Account" }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Only @unosquare.com email addresses are accepted.",
      );
    });
  });

  it("shows duplicate email error returned from server", async () => {
    mockSignIn.mockRejectedValue(
      new Error("Account already exists for this email."),
    );
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.click(
      screen.getByRole("button", { name: "Create Account" }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "An account with this email already exists.",
      );
    });
  });

  // --- Success ---

  it("calls signIn with all fields and flow=signUp on success", async () => {
    mockSignIn.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.click(
      screen.getByRole("button", { name: "Create Account" }),
    );

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("password", {
        buildingId: "b1",
        email: "jane@unosquare.com",
        firstName: "Jane",
        flow: "signUp",
        lastName: "Doe",
        password: "secret12",
        phone: "1234567890",
      });
    });
  });

  it("navigates to / on successful registration", async () => {
    mockSignIn.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.click(
      screen.getByRole("button", { name: "Create Account" }),
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
    });
  });
});
