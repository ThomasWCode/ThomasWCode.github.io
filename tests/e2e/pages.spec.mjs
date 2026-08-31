import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { pages, statusPageUrl } from "../support/page-manifest.mjs";
import { openDeterministicPage } from "../support/browser-fixtures.mjs";

for (const sitePage of pages) {
  test(`${sitePage.path} renders its shell, metadata and accessible content`, async ({ page }) => {
    const health = await openDeterministicPage(page, sitePage.path);

    await expect(page).toHaveTitle(sitePage.title);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(sitePage.heading);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", sitePage.canonical);
    await expect(page.getByRole("link", { name: "Website status" })).toHaveAttribute(
      "href",
      statusPageUrl,
    );
    await expect(page.locator('[aria-current="page"]')).toHaveCount(1);

    const duplicateIds = await page.locator("[id]").evaluateAll((elements) => {
      const seen = new Set();
      return elements
        .map((element) => element.id)
        .filter((id) => seen.has(id) || !seen.add(id));
    });
    expect(duplicateIds).toEqual([]);

    const overflows = await page.evaluate(() => ({
      body: document.body.scrollWidth - document.body.clientWidth,
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    expect(overflows.body).toBeLessThanOrEqual(1);
    expect(overflows.document).toBeLessThanOrEqual(1);

    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(
      accessibility.violations.map((violation) => ({
        id: violation.id,
        targets: violation.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
    health.assertHealthy();
  });
}

test("@smoke the homepage loads in each browser engine", async ({ page }) => {
  const health = await openDeterministicPage(page, "/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hi, I’m Tom.");
  await expect(page.getByRole("link", { name: "Website status" })).toBeVisible();
  health.assertHealthy();
});

test("@desktop-only the More menu opens, closes with Escape and restores focus", async ({ page }) => {
  await openDeterministicPage(page, "/");
  const toggle = page.getByRole("button", { name: "More" });

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#more-navigation")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});

test("@phone-only the mobile menu opens, closes with Escape and restores focus", async ({ page }) => {
  await openDeterministicPage(page, "/");
  const toggle = page.locator(".nav-toggle");

  await expect(toggle).toHaveAttribute("aria-label", "Open navigation menu");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#primary-navigation")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toHaveAttribute("aria-label", "Open navigation menu");
  await expect(toggle).toBeFocused();
});

test("the skip link moves keyboard focus to main content", async ({ page }) => {
  await openDeterministicPage(page, "/");

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("the current year and last-updated date use deterministic runtime values", async ({ page }) => {
  await openDeterministicPage(page, "/");

  await expect(page.locator("[data-current-year]")).toHaveText(String(new Date().getFullYear()));
  await expect(page.locator("[data-last-updated]")).toHaveText("31st August 2026");
  await expect(page.locator("[data-last-updated]")).toHaveAttribute("datetime", "2026-08-31");
});

test("the last-updated fallback survives an unavailable GitHub API", async ({ page }) => {
  await openDeterministicPage(page, "/", { githubStatus: 503 });

  await expect(page.locator("[data-last-updated]")).toHaveText("23rd August 2026");
});

test("analytics loads only after analytics consent", async ({ page }) => {
  let analyticsRequests = 0;
  await openDeterministicPage(page, "/", {
    onAnalyticsRequest() {
      analyticsRequests += 1;
    },
  });

  expect(analyticsRequests).toBe(0);
  await page.evaluate(() => {
    document.dispatchEvent(
      new CustomEvent("cookieyes_consent_update", {
        detail: { categories: { analytics: true } },
      }),
    );
  });
  await expect.poll(() => analyticsRequests).toBe(1);
});

test("@reduced-motion the reduced-motion stylesheet removes meaningful transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openDeterministicPage(page, "/");

  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
  const duration = await page.locator(".button").first().evaluate(
    (element) => getComputedStyle(element).transitionDuration,
  );
  expect(Math.max(...duration.split(",").map((value) => Number.parseFloat(value)))).toBeLessThanOrEqual(
    0.001,
  );
});

test("@no-js core content and the status link remain available without JavaScript", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hi, I’m Tom.");
  await expect(page.getByRole("link", { name: "Website status" })).toBeVisible();
  await expect(page.locator("[data-last-updated]")).toHaveText("23rd August 2026");
});
