# Campus Film Club

Discover and track TV shows with a clean UI, instant search, smart filters, and a local watchlist — powered by the TVMaze API.

- Live demo: https://campus-film-club.vercel.app/
- Stack: React 19, React Router 7, Vite 7, Axios, ESLint

## Features

- Search TV shows by title (e.g., “star”, “batman”) using the public TVMaze API
- Detail page for each show with genres, language, rating, summary, and full episode list
- Filters
  - Genre (All or specific)
  - Language (All or specific)
  - Minimum rating (0–10)
- Pagination for search results
- Watchlist panel
  - Add/remove shows and clear all
  - Persists to localStorage
- Resilient UX with loading and error states

## Quick start

Prerequisites:
- Node.js 18+ (recommended) and npm

Install dependencies and start the dev server:

```powershell
# from the project root
npm install
npm run dev
```

Build for production and preview locally:

```powershell
npm run build
npm run preview
```

Lint the project:

```powershell
npm run lint
```

## Scripts

- `npm run dev` — Start Vite dev server
- `npm run build` — Build production bundle
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run ESLint on the project

## Project structure

```
.
├─ index.html
├─ package.json
├─ vite.config.js
├─ eslint.config.js
└─ src/
   ├─ main.jsx            # App bootstrap
   ├─ App.jsx             # Routes
   ├─ index.css           # Styles
   ├─ api/
   │  └─ tvmaze.js        # API client (TVMaze)
   ├─ components/
   │  ├─ SearchBox.jsx    # Query input (submit to search)
   │  ├─ Filters.jsx      # Genre/Language/Min Rating filters
   │  ├─ Pagination.jsx   # Page navigation
   │  ├─ TVCard.jsx       # Show card
   │  ├─ TVList.jsx       # Grid list of cards
   │  └─ WatchlistPanel.jsx # Persistent watchlist (localStorage)
   ├─ pages/
   │  ├─ Home.jsx         # Search + filters + list + pagination
   │  └─ ShowDetail.jsx   # Show information + episodes
   └─ state/
      └─ reducer.js       # App state, actions, reducer
```

## How it works

- Data: Axios client with base URL `https://api.tvmaze.com` in `src/api/tvmaze.js`
  - `searchShows(q)` → `/search/shows?q=<query>` (maps to `show` objects)
  - `getShow(id)` → `/shows/:id`
  - `getEpisodes(id)` → `/shows/:id/episodes`
- State management: React `useReducer` (`src/state/reducer.js`)
  - Tracks `items`, `loading`, `error`, `query`, `filters`, `watchlist`, `pageSize`
  - Persists `watchlist`, `query`, and `filters` to `localStorage`
- Routing: React Router (Home `/` and Show Detail `/show/:id`)
- UI: Lightweight components with accessible labels and sensible fallbacks (e.g., placeholder image)

## Configuration

This app uses the public TVMaze API and does not require API keys or environment variables.

If you fork and deploy, ensure your hosting supports static sites built with Vite (e.g., Vercel, Netlify). A working deployment is available here:

- https://campus-film-club.vercel.app/

## Troubleshooting

- Empty results: Try broader queries (e.g., `star`). The app defaults to `star` to provide an initial dataset.
- API/network errors: The UI will show an error card; use the “Try again” button.
- LocalStorage issues: In private mode, storage writes may be blocked. The app will still function without persistence.

## Acknowledgments

- TV data provided by the awesome [TVMaze API](https://www.tvmaze.com/api)

## License

License not specified by the repository. If you plan to use or distribute this code, please confirm the license with the repository owner.
