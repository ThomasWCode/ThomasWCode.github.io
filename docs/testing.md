# Test suite

## Install

- Install Node.js 24, which is recorded in `.nvmrc` and declared in `package.json`. npm only warns on a mismatch because `engine-strict` is not set; the version is not enforced.
- Run `npm ci` to install the pinned development-only test dependencies from `package-lock.json`.
- Install the browsers once:
  - Windows: `npx playwright install chromium firefox webkit`
  - Linux: `npx playwright install --with-deps chromium firefox webkit`
- The published site remains plain HTML, CSS and JavaScript. None of these packages are served to visitors and there is no production build step.

## Commands

- `npm run lint` checks shared JavaScript, test code and all CSS.
- `npm run test:static` checks every page’s front matter, metadata, shared shell, status link, HTML, local references and image contracts. It also exercises the clean-URL test server.
- `npm run test:e2e` runs the deterministic Playwright suite in Chromium desktop and phone modes, Firefox, WebKit, reduced-motion mode and no-JavaScript mode.
- `npm run test:visual` compares the seven committed Win32 visual baselines.
- `npm run test:visual:update` deliberately replaces those baselines after a reviewed visual change. Run this on Windows, inspect every changed PNG and commit only intended differences.
- `npm run test:lighthouse` runs three local audits each for the homepage, Programming, Gallery and Contact. The median gates are 85 performance, 95 accessibility, 90 best practices and 95 SEO.
- `npm run test:production` makes read-only checks against every published page and `https://status.thomaswhite.me/`.
- `npm run test:external-links` makes read-only reachability checks against published external links.
- `npm test` runs lint, static checks and the deterministic browser suite.
- `npm run check` adds visual regression and Lighthouse checks to `npm test`.
- `node scripts/audit.mjs` checks the development toolchain for known high or critical advisories with `npm audit`. It excuses an advisory only while the script lists it with a reason and npm audit finds no fix for it. The only one now is `braces` (GHSA-vfj7-8cjw-p6xm), which has no fixed release yet. Once a fix can be installed, the exception lapses and CI fails until the dependency is updated (`npm audit fix`, or `npm audit fix --force` when the fix lies outside a declared range) and the exception removed. An exception for an advisory npm audit no longer reports fails too, so none is left behind. GitHub auto-dismissed the braces alert as a development-only denial of service, so no Dependabot pull request will flag the fix; the lapse does. `tests/static/audit.test.mjs` covers these rules.
- `.github/dependabot.yml` asks Dependabot for routine version updates once a month, for releases at least a week old: one pull request for `@playwright/test`, one for the rest of the npm toolchain and one for the workflow actions. Security updates are not part of it: GitHub opens those as soon as an advisory is published. A Playwright update changes the browsers, so regenerate the visual baselines on its branch (`docs/updating-tests-and-baselines.md`) before merging.

## Test boundaries

- Deterministic browser tests replace CookieYes, Formspree, reCAPTCHA, Google Analytics and YouTube network requests, and pin the `Last-Modified` header of every page response so the footer date is fixed. They do not send contact messages or analytics events.
- The contact form suite tests local validation, spam handling, success, failure, reset and retry views with a stubbed Formspree response. A real Formspree or reCAPTCHA submission remains a deployed-site manual check.
- The clean-URL server strips the three-line YAML front matter in memory and maps `/example/` to `example.html`. It models GitHub Pages routing and contains no Vercel behavior.
- Production and external-link checks require internet access and can fail because of DNS, provider downtime, bot blocking or rate limits. They retry transient failures and never submit forms or mutate remote state.
- Browser failure videos, screenshots and traces are local artefacts under `test-results/`; CI retains failure artefacts for seven days.

## CI policy

- `.github/workflows/ci.yml` runs on pull requests, pushes to `main` and manual dispatch. It does not deploy or mutate the site.
- `.github/workflows/production-checks.yml` runs daily at approximately 06:15 UTC. External links run on Monday and on manual dispatch.
- There is deliberately no branch-protection requirement. A direct push to `main` can therefore be published before CI finishes. The safe local sequence is `npm ci`, `npx playwright install chromium firefox webkit`, `npm run check`, then `git push`.

## Related

- `docs/updating-tests-and-baselines.md` explains which of these checks and which visual baselines a given change has to update, and which it does not.
