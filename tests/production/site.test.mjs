import assert from "node:assert/strict";
import test from "node:test";
import { pages, productionBaseUrl, statusPageUrl } from "../support/page-manifest.mjs";
import { textContent } from "../support/site-files.mjs";

const baseUrl = (process.env.PRODUCTION_BASE_URL || productionBaseUrl).replace(/\/$/, "");
const publicStatusUrl = process.env.STATUS_PAGE_URL || statusPageUrl;

async function fetchWithRetries(url, attempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(15_000),
        headers: { "User-Agent": "thomaswhite.me production test" },
      });
      if (response.status >= 500 && attempt < attempts) {
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

for (const page of pages) {
  test(`production ${page.path} serves the expected page contract`, async () => {
    const response = await fetchWithRetries(`${baseUrl}${page.path}`);
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") || "", /^text\/html/i);
    assert.ok(
      textContent(html).includes(page.monitorKeyword),
      `${page.path} is missing ${page.monitorKeyword}`,
    );
    assert.ok(html.includes(`<link rel="canonical" href="${page.canonical}"`));
    assert.ok(html.includes(`href="${publicStatusUrl}"`));
  });
}

test("the public status subdomain serves the branded status page over HTTPS", async () => {
  assert.match(publicStatusUrl, /^https:\/\//);
  const response = await fetchWithRetries(publicStatusUrl);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Thomas White|Website status/i);
});
