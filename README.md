# Polar DB — FWDP 3400 Project 01

## Project Overview

This project is for Web Scripting 3 (FWDP 3400), Project 01.
Polar DB is a fully responsive movie discovery app built with React, powered by [The Movie Database (TMDB) API](https://www.themoviedb.org/).

Users can browse popular, upcoming, now playing, and top rated movies, search by title or genre, view full movie details (cast, trailer, rating, certification), and save favourites to a personal watchlist stored in the browser.

## Team Members

- **Talia** — Original repo scaffold and npm setup, base TMDB API layer (shared fetch client + service functions), About page, MovieDetail endpoint wiring, NotFound/404 page and wildcard fallback route
- **Sara** — Watchlist page UI and its components (empty state, add-to-watchlist card), localStorage-backed favouriting, cast/artist UI and API wiring (getMovieCredits)
- **Frances** — Design system, Header/Footer/routing setup, Home page with its API wiring, search feature, MovieDetail hero and fallback image handling, accessibility polish

## Pages

- **Home** (`/`) — hero carousel of top movies, a Popular / Upcoming / Now Playing / Top Rated tab bar, 12 movies loaded at a time with a "Load More" button
- **About** (`/about`) — app description plus the required TMDb attribution (logo, sized smaller than our own, and the exact required sentence)
- **Individual Movie** (`/movie/:id`) — poster, backdrop, title, release date, runtime, certification, rating, genres, director, cast, trailer, and a favourite/unfavourite control
- **My Watchlist** (`/watchlist`) — favourited movies pulled from localStorage, or an empty-state message if there are none
- **Search** (`/search`) — search by title or genre with live suggestions, sort and year filters (stretch feature, not required by the brief)
- **404** (`*`) — fallback route for any unmatched URL

Every page shares one Header (logo linking home, search, nav) and Footer, both rendered once in `AppRouter`.

## Built With

- React + Vite
- React Router
- Sass, written as plain component-scoped `.scss` files with BEM-style class names (not CSS Modules)
- The Movie Database (TMDB) API
- React Context + `useReducer` for watchlist state, persisted to `localStorage` as a side effect

## Live Links

| Team Member | Live Site |
| ----------- | --------- |
| Talia       | TBD       |
| Sara        | TBD       |
| Frances     | TBD       |

Each team member deploys their own independent copy of the app to their own portfolio host, built from the same `main` branch.

## Project Requirements

This project follows the assignment brief:

- 4 required pages: Home, About, Individual Movie, My Favourites (plus Search and a 404 fallback as extras)
- Home page loads 12+ popular movies by default, with a UI control to switch between Popular / Top Rated / Now Playing / Upcoming
- Individual Movie page shows poster, title, release date, rating, plot summary, and a favourite/unfavourite control
- My Favourites page shows favourited movies from localStorage, or an empty-state message if there are none
- About page includes a short app description and the required TMDb attribution (logo smaller than our own logo, plus the required attribution sentence)
- Every page includes a logo linking home and mobile-friendly navigation
- Mobile-first, responsive from 320px to 1980px, with accessible colour contrast, alignment, and spacing
- Movie data comes from the TMDB API; favourites are stored in and read from localStorage, with duplicates prevented
- GitHub used for version control: `main` matches the final submission exactly, 2+ branches, 10+ commits, 2+ merges/PRs
- `.gitignore` excludes `node_modules`, `.env`, and system files — no API key is ever committed
- Built with Vite, deployed to each team member's own portfolio host

Search and the hero/featured carousel were originally scoped as optional stretch enhancements and were built after the four required pages were complete.

## Design System

Visual design comes from our Figma file ("Polar" branding — dark navy background with mint/teal glow accents). Design tokens live in `src/styles/_variables.scss` and `src/styles/_mixins.scss`.

- Font: [Inter](https://fonts.google.com/specimen/Inter) (Bold/Medium/Regular)
- Card and button styles, colours, and icon set are defined in the Figma "Components" page

The movie rating badge in our UI uses a plain rating icon, not the Rotten Tomatoes logo shown in the original mock-up, since our data comes from TMDB's `vote_average`, not Rotten Tomatoes.

## Environment Variables

Each team member needs their own TMDB API key in a local `.env` file (not committed):

```text
VITE_TMDB_API_KEY=your_api_key_here
```

Get a free key by creating a TMDB account and applying at the [TMDB API FAQ](https://www.themoviedb.org/faq/api).

## Getting Started

```bash
npm install
npm run dev
```

Compiled with Vite. Requires Node.js and a `.env` file with a valid TMDB API key (see above).

## Deployment

Each team member deploys their own copy to their own portfolio host, built from `main` with `npm run build`. `vite.config.js` and the `basename` on `BrowserRouter` (`src/routers/AppRouter.jsx`) are set to match each person's hosting path (root or subfolder), and an `.htaccess` file in `public/` rewrites unmatched routes back to `index.html` so client-side routing (e.g. linking or refreshing directly on `/about` or `/movie/123`) works correctly on the live site. Test with `npm run preview` locally before uploading.

## Movie Data Shape

Components are built against this shared contract:

```js
{ id, title, poster_path, release_date, vote_average, overview, genres }
```

## Git Workflow

Recommended workflow:

1. Pull the latest version from the repository.
2. Create or switch to your feature branch.
3. Make changes only to your assigned section.
4. Commit your changes with a clear message.
5. Push your branch.
6. Open a pull request into `staging`.
7. Merge `staging` into `main` after checking the site.

## Branch Strategy

```text
main                  - always deployable, matches the final submission
staging               - integration branch; feature branches merge here first
sectionName/yourname  - individual feature branches
```

Example branch names actually used on this project:

```text
about/talia
moviedetail/talia
fallback/talia
watchlist/sara
header/frances
home/frances
search-feature/frances
```

## Accessibility

- Mobile-first responsive layout, tested from 320px to 1980px
- Colour contrast checked against the design system's palette
- The scroll-to-top/bottom button and hero carousel both respect `prefers-reduced-motion`

## Attribution

This product uses the TMDb API but is not endorsed or certified by TMDb.
