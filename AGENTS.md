# Repository instructions

## Architecture

This repository contains the source for `thomaswhite.me`. It is a dependency-free, multi-page site built with HTML, CSS, and vanilla JavaScript. GitHub Pages processes YAML front matter in each root-level HTML file to provide clean URLs. Do not introduce a framework, package manager, build step, or dependency unless the task explicitly requires it.

- `index.html` is the homepage; the other root-level `.html` files are individual pages.
- `CSS/general.css` contains shared design tokens, layout, navigation, footer, components, responsive rules, and reduced-motion rules.
- `CSS/<page>.css` contains page-specific styles.
- `JS/script.js` contains all shared behaviour.
- `Images/` contains originals/fallbacks, local videos, and `Images/optimized/` derivatives.
- `Music/` contains released songs and preview audio.
- `Fonts/` contains local Inter and Fraunces files and licences.
- `logo-text.png`, `favicon.ico`, and `favicon.png` are shared brand assets.
- `CNAME` sets the canonical domain to `thomaswhite.me`.

## Page map

| Source | Public path | Page stylesheet |
| --- | --- | --- |
| `index.html` | `/` | `CSS/index.css` |
| `programming.html` | `/programming/` | `CSS/programming.css` |
| `sport.html` | `/sport/` | `CSS/sport.css` |
| `music&drama.html` | `/music&drama/` | `CSS/music&drama.css` |
| `volunteering.html` | `/volunteering/` | `CSS/volunteering.css` |
| `gallery.html` | `/gallery/` | `CSS/gallery.css` |
| `tedx.html` | `/tedx/` | `CSS/tedx.css` |
| `youtube.html` | `/youtube/` | `CSS/youtube.css` |
| `testimonials.html` | `/testimonials/` | `CSS/testimonials.css` |
| `contact.html` | `/contact/` | `CSS/contact.css` |

## Editing HTML

- Preserve YAML front matter as the first three lines:

  ```yaml
  ---
  permalink: /example/
  ---
  ```

- When a page’s subject, title, summary, URL, or main image changes, update `<title>`, the meta description, canonical URL, Open Graph metadata, and JSON-LD together.
- Use absolute site paths beginning with `/`. Do not use filesystem paths or `file://` URLs.
- Load `CSS/general.css` before the page stylesheet.
- Keep `<script defer src="/JS/script.js"></script>` immediately before `</body>`.
- Keep the skip link targeting `id="main-content"`.
- Apply `aria-current="page"` only to the current page’s navigation link.
- Preserve one `<h1>` and a logical `<h2>`/`<h3>` hierarchy.
- Use buttons for actions and links for navigation. Keep every control keyboard-operable.
- Retain existing visible wording unless the requested content change requires otherwise.
- Search every active root-level HTML file before changing shared wording or markup.

## Adding pages

- Copy the most similar existing page.
- Add a root-level HTML file, a clean permalink, and a page-specific stylesheet in `CSS/`.
- Set metadata deliberately; do not retain metadata copied from another page.
- Add the page to the relevant desktop navigation, mobile navigation, and footer locations across the site.
- Add `aria-current="page"` only on the new page.
- Include the shared header, footer, CookieYes script, and `/JS/script.js`.
- Verify desktop, tablet, phone, keyboard, and reduced-motion behaviour.

## Shared navigation and footer

The header and footer are repeated in every active HTML page rather than generated from a template.

- Search all root-level HTML files before editing shared content.
- Update desktop and mobile navigation separately.
- Update footer link groups separately; they are not identical to the header.
- Recheck `aria-current="page"` on every page after navigation changes.
- Do not manually update only the copyright end year; `data-current-year` is populated at runtime.
- Keep fallback text inside each `<time data-last-updated>`. `initialiseLastUpdated()` replaces it only when the GitHub API is available.

Useful searches:

```bash
rg -n "Text being replaced" -g "*.html" .
rg -n 'href="/example/"|aria-current="page"' -g "*.html" .
rg -n 'data-last-updated|data-current-year' -g "*.html" .
```

## Styling

- Put shared colours, typography, spacing, components, header/footer rules, and breakpoints in `CSS/general.css`.
- Put page-specific layout and components in the corresponding page stylesheet.
- Reuse existing custom properties in `:root`.
- Follow the existing 1024, 768, and 480 pixel breakpoints unless a component requires otherwise.
- Preserve visible focus, contrast, reduced-motion support, and touch-device behaviour.
- Preserve the warm editorial design: cream backgrounds, deep green, warm accents, Fraunces headings, and Inter body text.
- Prefer a page-specific class over altering a shared selector for a one-page issue.

## JavaScript

All JavaScript is in `JS/script.js` and initializes after `DOMContentLoaded`. Preserve initializer names and order unless the requested behaviour requires restructuring.

- `initialiseAnalytics()`: consent-aware Google Analytics.
- `initialiseSkipLink()`: keyboard focus transfer.
- `initialiseNavigation()`: desktop “More” menu and mobile navigation.
- `initialiseCurrentYear()`: `data-current-year` elements.
- `initialiseLastUpdated()`: latest GitHub commit date with an embedded fallback.
- `initialiseContactForm()`: validation, submission, and result views.
- `initialiseGallery()`: expanded-image dialog.
- `initialiseYouTubeFacades()`: click-to-load YouTube embeds.
- `initialiseTrackAudio()`: exclusive playback and rate reset.
- `initialiseInfoToggles()`: `aria-controls`/`data-info-toggle` sections.

Extend the relevant initializer when possible. A new initializer must be called once in the `DOMContentLoaded` handler and return safely when its page-specific elements are absent.

## Images

- Store originals/fallbacks in `Images/` and responsive WebP files in `Images/optimized/`.
- Use lowercase, descriptive, hyphenated filenames.
- Name derivatives with their true pixel width, such as `example-480.webp`.
- Never upscale a source merely to create a standard size.
- Ensure every `srcset` width descriptor equals the image’s intrinsic width.
- Retain a fallback file for the `<img src>` inside `<picture>`.
- Match existing derivatives: WebP quality 92 with `webp:method=6`.

```bash
magick identify -format "%f | %m | %wx%h | %b\n" "Images/example.jpg"
magick "Images/example.jpg" -auto-orient -strip -colorspace sRGB -resize "480x>" -quality 92 -define webp:method=6 "Images/optimized/example-480.webp"
magick "Images/example.jpg" -auto-orient -strip -colorspace sRGB -resize "960x>" -quality 92 -define webp:method=6 "Images/optimized/example-960.webp"
magick identify -format "%f | %m | %wx%h | quality=%Q | %b\n" "Images/optimized/example-*.webp"
```

When changing an image, update the fallback `src`, every WebP source, intrinsic `width` and `height`, contextual alt text, and any applicable Open Graph image. Use `loading="lazy"` and `decoding="async"` below the fold; do not lazy-load the primary above-the-fold image.

For gallery entries:

- Keep `data-full-src`, `data-caption`, the button’s `aria-label`, image alt text, and `<figcaption>` aligned.
- Prefer an optimized display-sized WebP for `data-full-src`.
- Update the visible photo count when adding or removing entries.
- Preserve the dialog controls and IDs required by `initialiseGallery()`.
- Test previous/next controls, arrow keys, Escape, backdrop closing, and focus restoration.

## Integrations and media

- The contact form uses Formspree and Google reCAPTCHA. Keep field `id`, `name`, `label for`, required state, autocomplete values, and JavaScript validation aligned. Private configuration is not in this repository.
- Keep `formStatus`, `thankYouMessage`, `spamBlockedMessage`, `sendAnotherBtn`, and `tryAgainBtn` aligned with `initialiseContactForm()`.
- YouTube facades require `class="youtube-facade"`, a bare `data-videoid`, `data-video-title`, a thumbnail, and accessible button text.
- Local videos belong in `Images/`; use optimized versions for normal playback when available.
- Released audio belongs in `Music/Songs/` and unfinished clips in `Music/Previews/`. Use MP3, `type="audio/mpeg"`, `preload="metadata"`, and `class="track-audio"`.
- If changing the domain, update `CNAME`, canonical and Open Graph URLs, structured-data URLs, and identity/contact references together.
- If replacing fonts, update the relevant `@font-face` URL and retain its licence in `Fonts/`.

## Verification

There is no package manifest, build command, or general automated test suite. Do not claim a build or automated test pass.

For relevant changes:

1. Run `git diff --check`.
2. Preview with `python -m http.server 8000 --bind 127.0.0.1` and use `/index.html`-style paths. This server does not process YAML front matter.
3. Check affected pages at wide desktop, tablet, and phone widths.
4. Navigate without a mouse; verify focus, tab order, and Escape behaviour.
5. Check the browser console, changed assets, internal and external links, metadata, and header/footer consistency.
6. Confirm reduced-motion behaviour for animation changes and basic usability without JavaScript where practical.
7. Test Formspree, reCAPTCHA, CookieYes, and canonical-domain behaviour on the deployed domain when those integrations change.
