import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
// vite preview inherits server.https from vite.config.ts, so this is HTTPS
// with the self-signed cert from @vitejs/plugin-basic-ssl.
const baseURL = `https://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    ignoreHTTPSErrors: true,
    // the PWA service worker would answer requests before page.route() sees them
    serviceWorkers: "block",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `vite preview --port ${PORT} --strictPort`,
    url: baseURL,
    ignoreHTTPSErrors: true,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
