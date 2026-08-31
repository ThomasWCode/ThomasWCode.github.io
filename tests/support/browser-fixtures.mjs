import { expect } from "@playwright/test";

const latestCommit = {
  commit: {
    committer: {
      date: "2026-08-31T12:00:00Z",
    },
  },
};

export async function installDeterministicRoutes(
  page,
  {
    githubStatus = 200,
    githubBody = [latestCommit],
    formspreeStatus = 200,
    onAnalyticsRequest = () => {},
  } = {},
) {
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());

    if (url.hostname === "127.0.0.1") {
      await route.continue();
      return;
    }

    if (url.hostname === "api.github.com") {
      await route.fulfill({ status: githubStatus, json: githubBody });
      return;
    }

    if (url.hostname === "formspree.io") {
      await route.fulfill({ status: formspreeStatus, json: { ok: formspreeStatus < 400 } });
      return;
    }

    if (url.hostname === "www.googletagmanager.com") {
      onAnalyticsRequest();
      await route.fulfill({ contentType: "text/javascript", body: "" });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "text/javascript",
      body: "",
    });
  });
}

export function watchPageHealth(page) {
  const errors = [];
  const failedLocalResponses = [];

  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (url.hostname === "127.0.0.1" && response.status() >= 400) {
      failedLocalResponses.push(`${response.status()} ${url.pathname}`);
    }
  });

  return {
    assertHealthy() {
      expect(errors, "page and console errors").toEqual([]);
      expect(failedLocalResponses, "failed local resources").toEqual([]);
    },
  };
}

export async function openDeterministicPage(page, path, routeOptions) {
  await installDeterministicRoutes(page, routeOptions);
  const health = watchPageHealth(page);
  await page.goto(path, { waitUntil: "domcontentloaded" });
  return health;
}
