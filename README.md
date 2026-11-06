# PetClinic Playwright Tests

End-to-end test suite for the [Bondar Academy PetClinic](https://petclinic.bondaracademy.com) web application,
written in **Playwright** with **TypeScript**.

I built this suite from scratch while following the
[Playwright UI Testing Mastery](https://bondaracademy.com/programs/playwright-ui-testing-mastery) program by
Bondar Academy. Each assignment was developed on its own branch, submitted as a pull request, reviewed by
Bondar Academy, and reworked based on the review comments before merging.

> A refactored version of this suite using the Page Object Model is available at
> [sid0701/petclinic-pw-pom](https://github.com/sid0701/petclinic-pw-pom).

---

## What the tests cover

26 tests in 11 spec files.

| Spec file | What it tests | Techniques used |
| --- | --- | --- |
| `input-fields.spec.ts` | Updating a pet type, cancelling an update, required-field validation | Text input, validation messages |
| `checkboxes.spec.ts` | Selecting and unselecting veterinarian specialties | Checkboxes, assertions on state |
| `lists-and-dropdowns.spec.ts` | Selecting pet types and validating the update | Dropdowns, list values |
| `datepicker.spec.ts` | Picking dates and validating the order of pet visits | Calendar widgets, date handling |
| `dialog-boxes.spec.ts` | Adding and deleting a pet type with a confirmation dialog | Browser dialogs |
| `web-tables.spec.ts` | Owner search, owners by city, pet details, specialty updates | Table rows and cells, filtering, `test.describe` |
| `api-requests.spec.ts` | Specialties and veterinarians created through the API, then checked and deleted in the UI | `request` fixture for setup and cleanup |
| `working-with-api.spec.ts` | Owners page with mocked data; veterinarians list with a modified API response | `page.route`, `route.fulfill`, `route.fetch` |
| `test-fixtures.spec.ts` | Owner, pet and visit created before the test and removed after it | Custom fixture with setup and teardown |
| `visual-testing.spec.ts` | The "Add Owner" button before and after filling in the form | `toHaveScreenshot` |
| `homework.spec.ts` | Home page welcome message | Smoke test from the starter template |

---

## Techniques demonstrated

- **User-facing locators** such as `getByRole` and `getByText`, with web-first assertions that wait automatically.
- **API-based test data:** tests create the data they need through the REST API and delete it afterwards, so
  they don't depend on existing records.
- **Custom fixture** (`custom-fixtures.ts`): creates an owner with a pet and a visit through the API, using
  [Faker](https://fakerjs.dev/) for random data, passes the owner's name to the test, and deletes the owner
  after the test.
- **Network mocking and interception:** replacing API responses with test data from `test-data/`, and changing
  a live response before the page receives it.
- **Waiting on network calls** with `page.waitForResponse` instead of fixed timeouts.
- **Visual comparison** of UI elements with screenshot assertions.
- **Single sign-in per run:** a global setup logs in once and reuses the saved session in every test.

---

## Tech stack

- [Playwright Test](https://playwright.dev) with TypeScript
- [Faker](https://fakerjs.dev/) for random test data
- [dotenv](https://github.com/motdotla/dotenv) for credentials
- Chromium

---

## Project structure

```
.
├── .auth/
│   ├── auth-setup.ts         # Global setup: signs in once and saves the session
│   └── user.json             # Saved session (git-ignored)
├── test-data/
│   ├── owners-page.json      # Mock data for the owners API
│   └── specialties.json      # Mock data for the veterinarians API
├── tests/                    # Spec files (see the table above)
├── custom-fixtures.ts        # testOwner fixture: API setup and teardown
├── playwright.config.ts      # Base URL, auth, timeouts, reporter
├── .env-SAMPLE               # Credentials template
└── tsconfig.json
```

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 24 or higher
- A PetClinic login (Bondar Academy account)

### Setup

```bash
npm install
npx playwright install chromium
cp .env-SAMPLE .env
```

Then add your PetClinic credentials to `.env`:

```ini
EMAIL='your.email@example.com'
PASSWORD='your-password'
```

`.env` is git-ignored, so your credentials stay on your machine.

### Running the tests

| Command | Description |
| --- | --- |
| `npx playwright test` | Run all tests |
| `npx playwright test tests/web-tables.spec.ts` | Run one spec file |
| `npx playwright test --ui` | Run in UI mode |
| `npx playwright test --headed` | Run with a visible browser |
| `npx playwright show-report` | Open the HTML report |

> **First run of the visual test:** the screenshot baselines are not committed, so create them once with
> `npx playwright test tests/visual-testing.spec.ts --update-snapshots`.

---

## How sign-in works

The sign-in setup comes from the Bondar Academy starter template:

1. Before any test runs, `.auth/auth-setup.ts` opens a browser, logs in with the credentials from `.env`, and
   saves the session to `.auth/user.json`.
2. It also captures the API access token, which the config sends as an `Authorization` header with every API
   request.
3. Every test starts already logged in through the `storageState` option.

---

## Notes

- Tests run one at a time (`workers: 1`) because they share one demo environment.
- The application is a shared demo, so data created by other users can occasionally affect results.

---

## Credits

Assignments and starter template by [Bondar Academy](https://bondaracademy.com), from the
[Playwright UI Testing Mastery](https://bondaracademy.com/programs/playwright-ui-testing-mastery) program.
Test code by Siddharth Gupta. README written with help from Claude Code.
