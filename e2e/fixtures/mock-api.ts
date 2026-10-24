import { readFileSync } from "fs";
import type { Page } from "@playwright/test";

// Read rather than `import ... from "*.json"`, which needs an import attribute
// in ESM.
const etaDb = JSON.parse(
  readFileSync(new URL("eta-db.json", import.meta.url), "utf-8")
) as unknown;

// Any value works; it only has to differ from the empty string the app starts
// with, so that fetchDbFunc treats the fixture as a fresh database.
const FIXTURE_MD5 = "e2e-fixture-md5";

const isLocal = (url: string) =>
  url.startsWith("https://localhost") || url.startsWith("http://localhost");

/**
 * Serve a small fixture database instead of the ~8 MB production one and cut
 * off every live upstream, so a run is deterministic and needs no network.
 */
export const mockHkbusApi = async (page: Page) => {
  // Handlers are matched in reverse registration order, so this catch-all must
  // be registered first: anything still reaching the network would make a run
  // non-deterministic.
  await page.route("**/*", (route) =>
    isLocal(route.request().url()) ? route.continue() : route.abort()
  );
  // Every company's ETA endpoint answers in this shape; an empty list renders
  // the "no ETA" state rather than failing.
  await page.route("**/*.gov.hk/**", (route) =>
    route.fulfill({ json: { data: [] } })
  );
  await page.route("**/routeFareList.md5", (route) =>
    route.fulfill({ body: FIXTURE_MD5, contentType: "text/plain" })
  );
  await page.route("**/routeFareList.min.json", (route) =>
    route.fulfill({ json: etaDb })
  );
};
