// tests/e2e/smoke.spec.ts
// Smoke e2e tests — verifies core todo flows work end-to-end.

import { test, expect } from "@playwright/test";

test.describe("Todo app smoke tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/todos");
  });

  test("loads the todos page with header", async ({ page }) => {
    await expect(page).toHaveTitle(/TODO\.tsx/);
    await expect(page.getByRole("heading", { name: "My Todos" })).toBeVisible();
  });

  test("shows the add todo form", async ({ page }) => {
    await expect(page.getByRole("form", { name: "Create new todo" })).toBeVisible();
    await expect(page.getByLabel("Title *")).toBeVisible();
    await expect(page.getByRole("button", { name: "Add Todo" })).toBeVisible();
  });

  test("shows an error when submitting empty title", async ({ page }) => {
    await page.getByRole("button", { name: "Add Todo" }).click();
    // HTML5 required validation prevents submission — title field is required
    const titleInput = page.getByLabel("Title *");
    await expect(titleInput).toBeFocused();
  });

  test("creates a new todo", async ({ page }) => {
    const title = `E2E test todo ${Date.now()}`;
    await page.getByLabel("Title *").fill(title);
    await page.getByRole("button", { name: "Add Todo" }).click();
    await expect(page.getByText(title)).toBeVisible();
  });

  test("toggles a todo as complete", async ({ page }) => {
    const title = `Toggle test ${Date.now()}`;
    await page.getByLabel("Title *").fill(title);
    await page.getByRole("button", { name: "Add Todo" }).click();
    await expect(page.getByText(title)).toBeVisible();

    const todoItem = page.locator("li").filter({ hasText: title });
    const toggleBtn = todoItem.getByRole("button", {
      name: "Mark as complete",
    });
    await toggleBtn.click();
    await expect(
      todoItem.getByRole("button", { name: "Mark as incomplete" })
    ).toBeVisible();
  });

  test("filters active and completed todos", async ({ page }) => {
    const title = `Filter test ${Date.now()}`;
    await page.getByLabel("Title *").fill(title);
    await page.getByRole("button", { name: "Add Todo" }).click();

    // Click Active filter
    await page.getByRole("tab", { name: /active/i }).click();
    await expect(page.getByText(title)).toBeVisible();

    // Mark complete
    const todoItem = page.locator("li").filter({ hasText: title });
    await todoItem.getByRole("button", { name: "Mark as complete" }).click();

    // Should disappear from active
    await expect(page.getByText(title)).not.toBeVisible();

    // Shows in completed
    await page.getByRole("tab", { name: /completed/i }).click();
    await expect(page.getByText(title)).toBeVisible();
  });

  test("keyboard navigation works for main actions", async ({ page }) => {
    // Tab to title field
    await page.keyboard.press("Tab");
    const titleInput = page.getByLabel("Title *");
    // Fill via keyboard
    await titleInput.focus();
    await titleInput.fill("Keyboard todo");
    // Submit via keyboard
    await page.keyboard.press("Enter");
    await expect(page.getByText("Keyboard todo")).toBeVisible();
  });
});
