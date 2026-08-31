# Test suite

## Install

- Install Node.js 24, which is recorded in `.nvmrc` and enforced by `package.json`.
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
- `npm audit --audit-level=high` checks the development toolchain for known high or critical advisories.

## Test boundaries

- Deterministic browser tests replace CookieYes, GitHub, Formspree, reCAPTCHA, Google Analytics and YouTube network requests. They do not send contact messages or analytics events.
- The contact form suite tests local validation, spam handling, success, failure, reset and retry views with a stubbed Formspree response. A real Formspree or reCAPTCHA submission remains a deployed-site manual check.
- The clean-URL server strips the three-line YAML front matter in memory and maps `/example/` to `example.html`. It models GitHub Pages routing and contains no Vercel behavior.
- Production and external-link checks require internet access and can fail because of DNS, provider downtime, bot blocking or rate limits. They retry transient failures and never submit forms or mutate remote state.
- Browser failure videos, screenshots and traces are local artefacts under `test-results/`; CI retains failure artefacts for seven days.

## CI policy

- `.github/workflows/ci.yml` runs on pull requests, pushes to `main` and manual dispatch. It does not deploy or mutate the site.
- `.github/workflows/production-checks.yml` runs daily at approximately 06:15 UTC. External links run on Monday and on manual dispatch.
- There is deliberately no branch-protection requirement. A direct push to `main` can therefore be published before CI finishes. The safe local sequence is `npm ci`, `npx playwright install chromium firefox webkit`, `npm run check`, then `git push`.
