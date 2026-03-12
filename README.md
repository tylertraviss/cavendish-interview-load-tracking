# Load Tracking Dashboard

Interactive web app for exploring and analyzing load tracking data. Built for an interview exercise to demonstrate front‑end architecture, data visualization, and UX around large tabular datasets.

## Features

- **CSV upload & parsing**: Import load tracking data from CSV (via `papaparse` / `xlsx`).
- **Filtering & search**: Quickly slice data by key fields (e.g. date ranges, status, lanes, carriers).
- **Sorting & pagination**: Efficient navigation of large tables.
- **Charts & metrics**: High‑level KPIs and trends visualized with `recharts`.
- **Responsive UI**: Accessible, keyboard‑friendly UI using `shadcn-ui`, Radix primitives, and Tailwind.

## Tech stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: shadcn-ui, Radix UI, Tailwind CSS, Lucide icons
- **State / data**: React Query for async data (where applicable)
- **Testing**: Vitest, Testing Library, Playwright (E2E)
- **Tooling**: ESLint, TypeScript, PostCSS

## Getting started

```sh
git clone <REPO_URL>
cd cavendish-interview-load-tracking
npm install
npm run dev
```

The app will be available at `http://localhost:5173` by default (Vite).

## Running tests

```sh
# Unit / integration tests
npm test

# Watch mode
npm run test:watch

# E2E tests (requires dev server running on another terminal)
npm run dev
npx playwright test
```

## Project structure (high level)

- `src/` – main application code
  - `components/` – reusable presentational and layout components
  - `features/` – load‑tracking specific screens, tables, and charts
  - `lib/` – utilities (parsers, formatting, table helpers, etc.)
- `public/` – static assets

## Notes for reviewers

- The focus of this project is **data-heavy UI**, with attention to performance, UX, and code organization.
- I’ve optimized for **clarity and maintainability** over over‑engineering; most pieces can be extended (e.g. adding new filters, derived metrics, or visualizations) with minimal changes.
