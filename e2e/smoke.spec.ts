import { test, expect } from "@playwright/test";
import { mockHkbusApi } from "./fixtures/mock-api";

// Route keys are upper-cased with "+" and " " replaced by "-" (see src/db.ts),
// and linked to in lower case (see RouteRow).
const ROUTE_ID = "1a-1-star-ferry-sau-mau-ping-(central)";

test.beforeEach(async ({ page }) => {
  await mockHkbusApi(page);
});

test("boots and shows the home page", async ({ page }) => {
  await page.goto("/en");

  await expect(page.locator("#searchInput")).toBeVisible();
  // Visually hidden, so assert it is in the tree rather than visible.
  await expect(
    page.getByRole("heading", { name: "Dashboard - HK Bus ETA App" })
  ).toBeAttached();
});

test("filters the board by route number", async ({ page }) => {
  await page.goto("/en/board");
  const row = page.locator(`a[href="/en/route/${ROUTE_ID}"]`);
  await expect(row.first()).toBeVisible();

  await page.locator("#searchInput").fill("999");
  await expect(row).toHaveCount(0);

  await page.locator("#searchInput").fill("1A");
  await expect(row.first()).toBeVisible();
});

test("opens the ETA page for a route", async ({ page }) => {
  await page.goto(`/en/route/${ROUTE_ID}`);

  // The signal the project's own pre-renderer waits on (scripts/pre-rendering.js).
  await expect(page.locator("input#render")).toHaveAttribute("value", "done");
  await expect(page.locator("#route-eta-header")).toContainText("1A");
  await expect(page.locator("#route-eta-header")).toContainText(
    "Sau Mau Ping (CENTRAL)"
  );
});
