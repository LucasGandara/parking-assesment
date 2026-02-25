import { expect, test } from "@playwright/test";

test.describe("Login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("renders ParkSmart AI branding in the left panel", async ({ page }) => {
    await expect(page.getByText("ParkSmart AI").first()).toBeVisible();
    await expect(
      page.getByText("Intelligent Parking"),
    ).toBeVisible();
  });

  test("renders the sign-in form fields", async ({ page }) => {
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Sign In" }),
    ).toBeVisible();
  });

  test("renders the footer help text with admin mailto link", async ({ page }) => {
    const link = page.getByRole("link", {
      name: "Contact your building administrator",
    });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /^mailto:/);
  });

  test("Forgot password is not a link", async ({ page }) => {
    await expect(page.getByText("Forgot password?")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /forgot password/i }),
    ).not.toBeVisible();
  });

  test("Sign up link navigates to /register", async ({ page }) => {
    await page.getByRole("link", { name: "Sign up" }).click();
    await expect(page).toHaveURL(/\/register/);
  });

  test("displays error after failed sign-in attempt", async ({ page }) => {
    await page.getByLabel("Email").fill("test@unosquare.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByRole("alert")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("alert")).toHaveText(
      "Invalid email or password.",
    );
  });
});

test.describe("Register page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("renders ParkSmart AI branding in the left panel", async ({
    page,
  }) => {
    await expect(
      page.getByText("ParkSmart AI").first(),
    ).toBeVisible();
  });

  test("renders all 6 registration fields", async ({ page }) => {
    await expect(page.getByLabel("First name")).toBeVisible();
    await expect(page.getByLabel("Last name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByLabel("Building")).toBeVisible();
    await expect(page.getByLabel("Phone number")).toBeVisible();
  });

  test("renders phone hint text", async ({ page }) => {
    await expect(
      page.getByText("10 digits, no spaces or dashes"),
    ).toBeVisible();
  });

  test("renders footer with admin mailto link", async ({ page }) => {
    const link = page.getByRole("link", {
      name: "Contact your building administrator",
    });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /^mailto:/);
  });

  test("Sign in link navigates to /login", async ({ page }) => {
    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("shows required field errors on empty submit", async ({
    page,
  }) => {
    await page
      .getByRole("button", { name: "Create Account" })
      .click();
    await expect(
      page.getByRole("alert").first(),
    ).toBeVisible({ timeout: 5_000 });
  });

  test("building dropdown shows no-buildings message", async ({
    page,
  }) => {
    await page.getByLabel("Building").click();
    await expect(
      page.getByText(/Alicante/),
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Routing", () => {
  test("navigating to /login renders the login page title", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(
      page.getByRole("heading", { name: "Welcome back" }),
    ).toBeVisible();
  });
});
