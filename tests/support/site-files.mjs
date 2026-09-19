import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

export async function readSiteFile(relativePath) {
  return readFile(path.join(repositoryRoot, relativePath), "utf8");
}

export function stripFrontMatter(source) {
  return source.replace(/^---\r?\npermalink: [^\r\n]+\r?\n---\r?\n/, "");
}

export function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&rsquo;", "’")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

export function textContent(markup) {
  return decodeHtml(markup.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
}

export function formatSiteDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const monthName = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    month: "long",
    timeZone: "UTC",
  });
  const suffix =
    day >= 11 && day <= 13
      ? "th"
      : { 1: "st", 2: "nd", 3: "rd" }[day % 10] || "th";

  return `${day}${suffix} ${monthName} ${year}`;
}

export async function readEmbeddedLastUpdated(relativePath = "index.html") {
  const [, datetime, fallback] =
    (await readSiteFile(relativePath)).match(
      /<time data-last-updated datetime="([^"]+)"\s*>([\s\S]*?)<\/time\s*>/,
    ) || [];

  return { datetime, text: textContent(fallback || "") };
}
