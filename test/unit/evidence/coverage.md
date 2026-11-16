# Unit test coverage

Generated: 2026-11-16T04:01:00.392Z

Command: `npm run test:unit`

## Run

| Suites | Tests | Passed | Failed | Skipped |
|---|---|---|---|---|
| 8 | 28 | 28 | 0 | 0 |

### Test cases

**test/unit/lib.test.ts**

- PASS: nav › lists the seven routes in order
- PASS: nav › normalizes trailing slashes and empty paths
- PASS: nav › marks home active only on the exact root
- PASS: nav › marks a section active on its route and sub-routes
- PASS: projects › exposes all/ai/systems/quant filters, quant last
- PASS: projects › returns every project for "all"
- PASS: projects › filters by category without mutating the input
- PASS: projects › numbers projects with two digits starting after the featured one
- PASS: projects › shows the featured thesis only for all and ai
- PASS: format › pads numbers to two digits
- PASS: format › formats yyyy-mm months
- PASS: format › rejects malformed months
- PASS: format › formats ranges, using "now" for open-ended roles
- PASS: awards › builds a newest-first log numbered from the oldest
- PASS: awards › keeps input order for awards in the same year
- PASS: awards › returns featured awards in their original order
- PASS: publications › splits authors around my name
- PASS: publications › handles me being first, last or alone
- PASS: publications › throws when I am not an author
- PASS: publications › renders BibTeX with "Last, First" authors and aligned fields
- PASS: publications › keeps hyphenated given names intact
- PASS: contact › builds an encoded mailto link
- PASS: contact › validates required fields and email shape
- PASS: socials › lists github, linkedin and email in that order (no Codeforces)
- PASS: socials › gives every social an svg path and an accessible label
- PASS: socials › contact rows skip email, which already has its own copy box
- PASS: socials › points email at a mailto link
- PASS: socials › throws on an unknown icon id

## Coverage (total)

| Metric | Coverage |
|---|---|
| lines | 100.00% (121/121) |
| statements | 100.00% (121/121) |
| functions | 100.00% (16/16) |
| branches | 98.18% (54/55) |

## Coverage per file

| File | Lines | Statements | Functions | Branches |
|---|---|---|---|---|
| src/lib/awards.ts | 100% | 100% | 100% | 100% |
| src/lib/contact.ts | 100% | 100% | 100% | 100% |
| src/lib/format.ts | 100% | 100% | 100% | 100% |
| src/lib/nav.ts | 100% | 100% | 100% | 100% |
| src/lib/projects.ts | 100% | 100% | 100% | 100% |
| src/lib/publications.ts | 100% | 100% | 100% | 91.66% |
| src/lib/socials.ts | 100% | 100% | 100% | 100% |
