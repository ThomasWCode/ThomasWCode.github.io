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
