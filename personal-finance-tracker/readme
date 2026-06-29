# FinTrack Pro

A personal finance tracker built with vanilla JavaScript — track income and expenses, visualize cash flow, and manage your transactions, all stored locally in your browser.

🔗 **Live demo:** [fintrackpro-blaezy.vercel.app](https://fintrackpro-blaezy.vercel.app)

## Features

- **Authentication** — register and log in with username/password, session persisted via `localStorage`
- **Dashboard overview** — live cards for current balance, total income, total expense, and transaction count
- **Cash flow chart** — income vs. expenses visualized with Chart.js, theme-aware (adapts to dark mode)
- **Transaction management** — add, edit, and delete transactions with category tagging
- **Search & filter** — search by description/category and filter by type (income/expense), synced across views
- **Dark mode** — full theme toggle with persisted preference
- **Settings** — update full name and preferred currency
- **Sample data loader** — instantly populate the app with sample transactions for testing/demo purposes
- **Reset all data** — clear all transactions with a confirmation prompt

## Tech Stack

- **HTML5 / CSS3** — custom design system using CSS variables for theming (light/dark mode)
- **Vanilla JavaScript** — no frameworks, DOM manipulation, event delegation
- **Chart.js** — for the cash flow bar chart
- **Font Awesome** — icons
- **localStorage** — client-side persistence for users and transactions (no backend/database)
- **Vercel** — deployment

## How It Works

All data lives in the browser's `localStorage`:

- `registeredUsers` — array of all registered user accounts
- `user` — the currently logged-in user's session
- `transaction_<username>` — each user's transactions, scoped individually so accounts don't share data
- `theme` — persisted light/dark mode preference

Since there's no backend, this is a fully client-side app — refreshing or closing the browser won't lose your data, but it is local to the specific browser/device you're using.


## Running Locally

1. Clone the repo
2. Open the project folder with a local server (e.g. VS Code's Live Server extension) — **ES module/localStorage features require a server, not `file://`**
3. Visit `register.html` to create an account, then log in

## Known Limitations

- Not yet responsive for smaller screen sizes (mobile/tablet support planned)
- Data is local to the browser — no cross-device sync (no backend)
- Single currency display at a time (no live conversion between currencies)

## Author

Built by **Blaezy** as part of frontend development practice (Sheryians Coding School, Cohort 3.0).
