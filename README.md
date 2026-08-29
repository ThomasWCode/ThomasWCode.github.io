# thomaswhite.me

This repository contains the source for Tom White’s personal website. It is a dependency-free, multi-page site built with HTML, CSS and vanilla JavaScript. GitHub Pages processes the small YAML front matter at the top of each HTML file so that pages use clean URLs such as `/sport/` instead of `/sport.html`.

This document covers the files that normally need attention when content, pages, styling or media are updated. It intentionally does not cover committing, pushing or other Git workflows.

## Repository structure

- `index.html` is the homepage.
- The other root-level `.html` files are the individual pages. Each begins with a `permalink` value that controls its public URL.
- `CSS/general.css` contains the shared design system, layout, header, navigation, footer, reusable components, responsive rules and reduced-motion rules.
- `CSS/<page>.css` contains styles specific to the corresponding HTML page.
- `JS/script.js` contains all shared behaviour: consent-aware analytics, skip-link focus, navigation, dates, the contact form, gallery dialog, YouTube facades, audio controls and information toggles.
- `Images/` contains original or fallback images, local video files and the `optimized/` image derivatives.
- `Music/` contains released songs and preview audio.
- `Fonts/` contains the local Inter and Fraunces font files and their licence files.
- `logo-text.png`, `favicon.ico` and `favicon.png` are shared brand assets.
- `CNAME` sets the canonical GitHub Pages domain to `thomaswhite.me`.
- `vercel.json` redirects Vercel-hosted copies to the canonical domain and enables clean URLs.

## Page map

| Source file | Public path | Page-specific stylesheet | Notes |
| --- | --- | --- | --- |
| `index.html` | `/` | `CSS/index.css` | Homepage and links to the main areas of the site |
| `programming.html` | `/programming/` | `CSS/programming.css` | Programming projects |
| `sport.html` | `/sport/` | `CSS/sport.css` | Sport and race content |
| `music&drama.html` | `/music&drama/` | `CSS/music&drama.css` | Music and drama overview |
| `volunteering.html` | `/volunteering/` | `CSS/volunteering.css` | Volunteering content |
| `gallery.html` | `/gallery/` | `CSS/gallery.css` | Photo grid and expanded-image dialog |
| `tedx.html` | `/tedx/` | `CSS/tedx.css` | TEDx content and video facade |
| `youtube.html` | `/youtube/` | `CSS/youtube.css` | Old YouTube channel content |
| `testimonials.html` | `/testimonials/` | `CSS/testimonials.css` | Testimonials |
| `contact.html` | `/contact/` | `CSS/contact.css` | Formspree contact form and reCAPTCHA |

## Updating a page

- Keep the YAML front matter as the first three lines:

```yaml
---
permalink: /example/
---
```

- Update all page metadata together when the subject, title, summary, URL or main image changes:

  - `<title>`
  - `<meta name="description">`
  - canonical URL
  - Open Graph type, title, description, URL and image
  - JSON-LD structured data, when present

- Use absolute site paths beginning with `/`, for example `/Images/example.jpg` and `/CSS/example.css`. Do not use filesystem paths or `file://` URLs.
- Keep `CSS/general.css` before the page-specific stylesheet so that the page stylesheet can make deliberate local overrides.
- Keep `<script defer src="/JS/script.js"></script>` immediately before `</body>`.
- Keep the skip link pointing to `id="main-content"`.
- Give the current navigation link `aria-current="page"`. Remove that attribute from links that are not the current page.
- Keep the desktop navigation, mobile navigation and footer links consistent. A label or destination change is usually a site-wide change, not a one-page change.
- Preserve semantic heading order: one `<h1>`, then `<h2>` sections, followed by `<h3>` subsections where needed.
- Use real buttons for actions and links for navigation. Every interactive control must remain usable with a keyboard.
- Retain existing visible wording unless the content itself needs to change. Shared wording should be searched across every active HTML file before it is edited.

Useful site-wide searches from the repository root include:

```powershell
rg -n "Text being replaced" -g "*.html" .
rg -n 'href="/example/"|aria-current="page"' -g "*.html" .
rg -n 'data-last-updated|data-current-year' -g "*.html" .
```

## Adding a page

- Copy the structure of the most similar existing page rather than starting with an empty document.
- Choose a root-level filename and matching clean permalink.
- Add a page-specific stylesheet in `CSS/`, even if it initially contains only a small number of rules.
- Set the title, description, canonical URL, Open Graph metadata, theme colour and JSON-LD deliberately. Do not copy another page’s metadata unchanged.
- Add the page to the appropriate navigation and footer locations across the site. Pages in the desktop “More” menu also need to remain accessible in the mobile navigation.
- Add `aria-current="page"` only on the new page’s own navigation entry.
- Include the shared header, footer, CookieYes script and `/JS/script.js`.
- Check the page at desktop, tablet and phone widths, including keyboard navigation and reduced-motion mode.

## Updating shared navigation or footer content

The shared header and footer are repeated in each HTML file rather than generated from a template. A navigation, logo, footer or shared-label change therefore needs to be made in all 11 active HTML files.

- Search before editing to find every occurrence.
- Update both the main navigation and its responsive/mobile presentation.
- Update footer link groups separately; their grouping is not identical to the header.
- Check every page’s `aria-current="page"` after changing navigation markup.
- Do not manually change only the visible copyright end year. `data-current-year` is replaced by JavaScript at runtime.
- Keep a real fallback inside every `<time data-last-updated>` element. `initialiseLastUpdated()` replaces it with the latest GitHub commit date when the API is available and leaves the embedded value in place when it is not.

## Images and ImageMagick

### Install ImageMagick

The commands below install ImageMagick; only one platform-specific command is needed.

```powershell
# Windows
winget install --id ImageMagick.Q16 -e
```

```bash
# macOS with Homebrew
brew install imagemagick

# Ubuntu or Debian
sudo apt update
sudo apt install imagemagick
```

Confirm that the installation is available before processing an image:

```powershell
magick -version
```

No JavaScript image library or package-manager dependency is required. ImageMagick is a system tool and must be available on `PATH`.

### Image locations and naming

- Put the original or fallback file in `Images/`.
- Put responsive WebP versions in `Images/optimized/`.
- Use lowercase descriptive filenames separated with hyphens.
- Name WebP derivatives with their actual pixel width, such as `example-480.webp`, `example-960.webp` and `example-1600.webp`.
- Do not label a 691-pixel image as `960w`, and do not upscale a small source merely to create a standard filename. A `srcset` width descriptor must match the file’s real intrinsic width.
- Keep an original/fallback file even when WebP is used. It belongs in the `<img src>` inside the `<picture>` element.

Inspect a new image before changing HTML:

```powershell
magick identify -format "%f | %m | %wx%h | %b`n" "Images/example.jpg"
```

### Create responsive WebP files

The current optimized images use WebP with a reported quality setting of 92. Create only the sizes that the source can support without upscaling:

```powershell
magick "Images/example.jpg" -auto-orient -strip -colorspace sRGB -resize "480x>" -quality 92 -define webp:method=6 "Images/optimized/example-480.webp"
magick "Images/example.jpg" -auto-orient -strip -colorspace sRGB -resize "960x>" -quality 92 -define webp:method=6 "Images/optimized/example-960.webp"
magick "Images/example.jpg" -auto-orient -strip -colorspace sRGB -resize "1600x>" -quality 92 -define webp:method=6 "Images/optimized/example-1600.webp"
```

`-auto-orient` applies camera orientation, `-strip` removes unnecessary metadata, `-colorspace sRGB` gives browsers a predictable colour space, `-resize "480x>"` limits width without upscaling, and `webp:method=6` spends more processing time to reduce the output size.

If the source is narrower than one of the requested sizes, omit that output. For example, a 691-pixel source should normally have a 480-pixel derivative and a 691-pixel full-size WebP:

```powershell
magick "Images/example.png" -auto-orient -strip -colorspace sRGB -resize "480x>" -quality 92 -define webp:method=6 "Images/optimized/example-480.webp"
magick "Images/example.png" -auto-orient -strip -colorspace sRGB -quality 92 -define webp:method=6 "Images/optimized/example-691.webp"
```

Verify the generated dimensions and sizes:

```powershell
magick identify -format "%f | %m | %wx%h | quality=%Q | %b`n" "Images/optimized/example-*.webp"
```

### Add responsive image markup

Use a `<picture>` when optimized WebP files exist:

```html
<picture
  ><source
    type="image/webp"
    srcset="
      /Images/optimized/example-480.webp 480w,
      /Images/optimized/example-960.webp 960w
    "
    sizes="(max-width: 650px) 100vw, 33vw" />
  <img
    src="/Images/example.jpg"
    width="1600"
    height="1067"
    alt="A concise description of the image"
    loading="lazy"
    decoding="async"
/></picture>
```

- The `<img>` width and height must be the fallback image’s real intrinsic dimensions. They reserve the correct layout space; CSS can still crop the visible card with `object-fit: cover`.
- The `srcset` descriptors must equal the actual widths reported by ImageMagick.
- The `sizes` value describes the image’s approximate rendered width. Use the existing neighbouring image as the pattern: homepage cards use `33vw` or `66vw`, while gallery cards vary with their grid span.
- Use meaningful alt text that describes the image in context. Do not repeat nearby captions word for word unless that is the clearest description.
- Use `loading="lazy"` and `decoding="async"` for below-the-fold images. The main above-the-fold image should not be lazy-loaded and may use `fetchpriority="high"`.
- After replacing an image, update the fallback `src`, every WebP source, intrinsic dimensions, alt text if the subject changed, and any Open Graph image that deliberately uses it. Changing only `src` is insufficient because browsers that support WebP will keep using the old `srcset`.

### Gallery images

Each gallery entry has additional data used by the expanded dialog:

- `data-full-src` is the image displayed in the dialog. Prefer an optimized display-sized WebP rather than a multi-megabyte camera original.
- `data-caption` supplies the dialog caption.
- The button’s `aria-label`, the image’s `alt` text and the visible `<figcaption>` each need to remain accurate.
- Update the visible photo count near the gallery heading when entries are added or removed.
- Keep the dialog controls and IDs at the bottom of `gallery.html`; `initialiseGallery()` depends on them.
- Test opening an image, the previous/next buttons, Left and Right Arrow keys, Escape, clicking the backdrop, and focus returning to the originating thumbnail.

## Styling

- Put site-wide colours, type, spacing, shared components, header/footer rules and breakpoints in `CSS/general.css`.
- Put page-specific layouts and components in the matching page stylesheet.
- Reuse the existing CSS custom properties in `:root` instead of adding slightly different hard-coded colours or spacing values.
- Follow the existing responsive breakpoints at 1024, 768 and 480 pixels unless a component has a specific reason to differ.
- Keep focus styles, readable colour contrast, reduced-motion handling and touch-device behaviour intact.
- Preserve the warm editorial direction: cream backgrounds, deep green, warm accents, Fraunces headings and Inter body text.
- Avoid changing shared selectors for a one-page problem when a page-specific class can contain the change.

## JavaScript behaviour

All JavaScript is in `JS/script.js` and runs after `DOMContentLoaded`. Keep function names and initialization order stable unless behaviour genuinely requires a structural change.

- `initialiseAnalytics()` loads Google Analytics only after CookieYes reports analytics consent.
- `initialiseSkipLink()` moves keyboard focus to the main content.
- `initialiseNavigation()` controls the desktop “More” menu and mobile navigation, including Escape and focus behaviour.
- `initialiseCurrentYear()` updates elements marked with `data-current-year`.
- `initialiseLastUpdated()` obtains the latest repository commit date and updates elements marked with `data-last-updated`.
- `initialiseContactForm()` validates and submits the contact form and controls its status, success and spam-blocked views.
- `initialiseGallery()` controls the expanded gallery dialog.
- `initialiseYouTubeFacades()` replaces a facade with an autoplaying iframe only after the visitor clicks it.
- `initialiseTrackAudio()` prevents simultaneous track playback and resets altered playback rates.
- `initialiseInfoToggles()` controls sections linked through `aria-controls` and `data-info-toggle`.

When adding behaviour, prefer extending the existing relevant initializer. If a new initializer is necessary, call it once inside the `DOMContentLoaded` handler and make it return safely when its page-specific elements are absent.

## Contact form

- The form action in `contact.html` points to Formspree. Changing it requires a corresponding Formspree endpoint that accepts the same field names.
- The page loads Google reCAPTCHA and contains the public site key. The corresponding private configuration is not stored in this repository.
- Keep `id`, `name`, `<label for>`, required state and autocomplete values aligned when changing fields.
- Update the JavaScript validation in `initialiseContactForm()` if required fields or field IDs change.
- Keep `formStatus`, `thankYouMessage`, `spamBlockedMessage`, `sendAnotherBtn` and `tryAgainBtn` aligned with the IDs used by JavaScript.
- A successful-looking local layout does not prove that Formspree or reCAPTCHA is configured correctly. Test a real submission on the deployed domain after any integration change.

## YouTube and local video

- YouTube facades use `class="youtube-facade"`, `data-videoid` and `data-video-title`. Supply the bare video ID, not a full YouTube URL.
- Keep a thumbnail and accessible button text visible before the iframe loads.
- Local videos belong in `Images/`. Use the smaller optimized file for normal playback when one exists and retain the original only when it is intentionally required.

## Audio

- Released tracks belong in `Music/Songs/`; unfinished clips belong in `Music/Previews/`.
- Use MP3 sources with `type="audio/mpeg"` and `preload="metadata"`.
- Give site-managed players the `track-audio` class so that starting one pauses the others.
- Update the visible title, release label, description, artwork and artwork alt text together.
- Test playback, pausing, moving between tracks and the rate-reset notification.

## Fonts, logos, favicons and domain files

- The local font faces are declared at the top of `CSS/general.css`. If a font file is replaced, update its `@font-face` URL and retain the corresponding licence in `Fonts/`.
- `logo-text.png` is the static header logo.
- Keep both favicon links in page heads when changing the favicon files.
- Update `CNAME`, every canonical URL, Open Graph URL, structured-data URL, contact/identity references and the destination in `vercel.json` together if the public domain changes.

## Local checks

A quick static server is enough to inspect CSS, JavaScript and assets without opening files through `file://`:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/index.html`. With this basic server, use filenames such as `/sport.html` instead of clean production paths. It does not process the YAML front matter, so the three front-matter lines may appear as text; that is a preview limitation, not production output.

CookieYes is registered to the public domain and may log a website-URL warning on localhost. That warning is expected during local preview; verify CookieYes on the deployed domain before treating it as an integration failure.

Before considering an update complete:

- Check the changed page at wide desktop, tablet and phone widths.
- Navigate without a mouse and confirm visible focus, logical tab order and Escape behaviour.
- Check that every changed image loads, has accurate alt text and reserves the correct aspect ratio before loading.
- Check the browser console for errors.
- Follow every changed internal and external link.
- Verify page title, description, canonical URL and social image.
- Check header and footer consistency across all pages after shared changes.
- Confirm that the page remains usable with JavaScript disabled where practical.
- Confirm reduced-motion behaviour when animation or transition code changes.
- Run whitespace validation:

```powershell
git diff --check
```

The repository does not currently have a package manifest, build command or general automated test suite. Do not report a build as passing when only manual or structural checks have been run.
