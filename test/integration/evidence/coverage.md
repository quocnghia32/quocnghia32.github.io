# Integration test coverage

Generated: 2026-11-16T04:27:47.764Z

Command: `npm run test:integration`

## Run

| Suites | Tests | Passed | Failed | Skipped |
|---|---|---|---|---|
| 17 | 39 | 39 | 0 | 0 |

### Test cases

**test/integration/pages.test.ts**

- PASS: every route › / renders the shared shell with the right tab active
- PASS: every route › /projects renders the shared shell with the right tab active
- PASS: every route › /experience renders the shared shell with the right tab active
- PASS: every route › /skills renders the shared shell with the right tab active
- PASS: every route › /publications renders the shared shell with the right tab active
- PASS: every route › /awards renders the shared shell with the right tab active
- PASS: every route › /contact renders the shared shell with the right tab active
- PASS: 404 › renders a not-found page with a way back home and no active tab
- PASS: home › keeps the hero short: name, role, one-line bio, CTAs, logo socials
- PASS: home › splits strengths into an AI column and a Software column, three each
- PASS: home › hero bio covers school, APCS, current role, MoMo work and strengths
- PASS: home › shows the portrait with fixed dimensions and alt text, with the terminal card beside it
- PASS: home › shows a two-command terminal card
- PASS: projects › renders filters, the featured thesis and one card per project
- PASS: projects › groups projects into main work and a "built for fun" quant group
- PASS: projects › puts the side-project quant strategies last
- PASS: projects › links out only where a project has a public link, opening in a new tab
- PASS: experience › lists both MoMo roles newest first, then education
- PASS: skills › renders every skill group and a decorative marquee
- PASS: publications › renders each paper with my name highlighted and hidden abstract/bibtex panels
- PASS: awards › renders three highlight cards and a full judge log
- PASS: contact › has a labelled form, copy button and social rows with logos

**test/integration/scripts.test.ts**

- PASS: project filter on the rendered /projects page › shows only quant projects and hides the featured thesis
- PASS: project filter on the rendered /projects page › brings everything back on "all" and keeps the thesis for "ai"
- PASS: project filter on the rendered /projects page › hides a whole group when none of its cards match
- PASS: project filter on the rendered /projects page › is a no-op on pages without filters
- PASS: publication toggles on /publications › opens and closes the abstract and bibtex panels independently
- PASS: contact page › copies the email and resets the label
- PASS: contact page › reports a copy failure instead of throwing
- PASS: contact page › shows inline errors on an empty submit and does not navigate
- PASS: contact page › opens a filled mailto on a valid submit and clears errors
- PASS: mailto navigation › hands the URL to the test hook when one is installed
- PASS: mailto navigation › falls back to location.assign
- PASS: mailto navigation › does nothing on pages without the contact form
- PASS: effects › moves the spotlight with the pointer
- PASS: effects › marks the header as scrolled past the threshold
- PASS: effects › reveals elements when they intersect
- PASS: effects › reveals everything immediately without IntersectionObserver
- PASS: main wiring › initialises every behaviour on astro:page-load

## Coverage (total)

| Metric | Coverage |
|---|---|
| lines | 99.56% (456/458) |
| statements | 99.56% (456/458) |
| functions | 97.36% (37/38) |
| branches | 95.90% (164/171) |

## Coverage per file

| File | Lines | Statements | Functions | Branches |
|---|---|---|---|---|
| src/components/Icon.astro | 100% | 100% | 100% | 100% |
| src/components/Socials.astro | 100% | 100% | 100% | 100% |
| src/layouts/Base.astro | 100% | 100% | 100% | 100% |
| src/lib/awards.ts | 100% | 100% | 100% | 100% |
| src/lib/contact.ts | 100% | 100% | 100% | 100% |
| src/lib/format.ts | 100% | 100% | 100% | 71.42% |
| src/lib/nav.ts | 100% | 100% | 100% | 100% |
| src/lib/projects.ts | 87.5% | 87.5% | 66.66% | 100% |
| src/lib/publications.ts | 100% | 100% | 100% | 70% |
| src/lib/socials.ts | 100% | 100% | 100% | 66.66% |
| src/pages/404.astro | 100% | 100% | 100% | 100% |
| src/pages/awards.astro | 100% | 100% | 100% | 100% |
| src/pages/contact.astro | 100% | 100% | 100% | 100% |
| src/pages/experience.astro | 100% | 100% | 100% | 100% |
| src/pages/index.astro | 100% | 100% | 100% | 100% |
| src/pages/projects.astro | 100% | 100% | 100% | 100% |
| src/pages/publications.astro | 100% | 100% | 100% | 100% |
| src/pages/skills.astro | 100% | 100% | 100% | 100% |
| src/scripts/contact.ts | 100% | 100% | 100% | 100% |
| src/scripts/effects.ts | 100% | 100% | 100% | 100% |
| src/scripts/main.ts | 100% | 100% | 100% | 100% |
| src/scripts/projects-filter.ts | 100% | 100% | 100% | 100% |
| src/scripts/publications.ts | 100% | 100% | 100% | 75% |
