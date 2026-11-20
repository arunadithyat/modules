# AutomateGenie.ai

Business software for growing teams: ERPNext runs underneath as the engine,
AutomateGenie provides the entire user experience on top.

```
frontend/                 React + TypeScript app (the only UI customers see)
backend/apps/
  automategenie_core/     Frappe app: task-shaped API + shared features
docker/                   MariaDB + Redis for local development
scripts/setup-bench.sh    One-command local bench (Frappe, ERPNext, HRMS, our app)
docs/architecture.md      Rules every contributor should follow
```

## See the UI right now (no backend needed)

```bash
cd frontend
npm install
npm run dev:demo        # http://localhost:5173, runs on built-in demo data
```

## Full local setup

Prerequisites: Python 3.11+, Node 18+, yarn, Docker, and `pip install frappe-bench`.

```bash
cp .env.example .env              # change the passwords
./scripts/setup-bench.sh          # first run takes a while
cd frappe-bench && bench start    # API on http://localhost:8000

# in another terminal
cd frontend && cp .env.example .env && npm run dev
```

Sign in with `Administrator` and the `ADMIN_PASSWORD` from `.env`. Finish ERPNext's
setup wizard once at http://localhost:8000/app so a company exists.

## Backend tests

```bash
cd backend/apps/automategenie_core
python3 -m unittest automategenie_core.tests.test_modules   # pure logic, no bench needed
```

## What exists today

| Area | Status |
|---|---|
| Sign in / sign out with Frappe sessions + CSRF | Done |
| App shell, modules shown by installed app + user role | Done |
| Home summary (billed, to collect, open quotes, new leads) | Done |
| Quotes list, one-click quote to sales order | Done |
| Leads list and quick add | Done |
| Ask Genie bar (keyword routing; AI service next) | Started |
| Invoices, Stock, Production, People screens | Next |
