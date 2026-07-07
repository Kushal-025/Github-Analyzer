# GitHub Profile Analyzer 🔍

A straight-talking senior dev review tool for GitHub profiles. No AI, no buzzwords — just honest feedback based on actual profile data.

## What it does

- Fetches any public GitHub profile via the GitHub Public API
- Shows profile card, stats, top repos, and a language breakdown chart
- Generates a **Senior Dev Review** — reads like a real person wrote it, not ChatGPT

## Tech Stack

- **React + Vite** — frontend app and dev server
- **Express + Node.js** — backend API for recent searches
- **MySQL** — optional persistence for search history
- **Tailwind CSS** — utility classes where needed
- **Recharts** — pie chart for language distribution
- **Axios** — cleaner than fetch for API calls
- **Lucide React** — icons

## Setup

```bash
# clone the repo (or just cd into this folder)
cd github-analyzer

# install frontend deps
npm install

# start the frontend
npm run dev
```

Frontend runs at `http://localhost:5173`

### Start the backend

```bash
cd server
npm install
node server.js
```

Backend runs at `http://localhost:5000`

### Full-stack flow

- The frontend calls the GitHub API directly.
- Each profile search is sent to the backend and saved in recent-search history.
- If MySQL is unavailable, the app still works using an in-memory fallback.

## Deploy to Vercel / Netlify

The frontend can be deployed as a Vite app. For a full-stack deployment, host the Express server separately or use a platform that supports both frontend and API routes.

## Rate Limits

GitHub Public API: **60 requests/hour** without authentication. If you hit the limit, wait ~1 hour or add a GitHub token (future feature).

## Folder Structure

```
src/
├── components/
│   ├── SearchBar.jsx       # username input + submit
│   ├── ProfileCard.jsx     # avatar, bio, stats
│   ├── StatsSection.jsx    # star/fork counts + language pie
│   ├── RepoList.jsx        # top 6 repos grid
│   ├── SeniorDevReview.jsx # the main review card
│   └── LoadingSkeleton.jsx # pulse skeleton while loading
├── hooks/
│   └── useGitHub.js        # data fetching hook
├── utils/
│   └── generateReview.js   # review generation logic (no AI)
├── App.jsx
├── App.css
└── index.css
```

## Notes

- The "Senior Dev Review" is 100% algorithmic — no API calls, no ChatGPT. It's logic + templates based on real profile signals (repos, stars, bio, descriptions, etc.)
- Pinned repos aren't available via the public REST API (requires GraphQL + auth), so it uses top repos by stars instead
