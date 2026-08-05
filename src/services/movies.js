import { tmdbFetch, getPosterUrl, getBackdropUrl } from './tmdbClient';
import { genreMap } from '../data/genreMap';

function findCertification(releaseDatesResults, countryCode = 'US') {
  const country = releaseDatesResults?.find(
    (entry) => entry.iso_3166_1 === countryCode,
  );
  const withCertification = country?.release_dates.find(
    (entry) => entry.certification,
  );
  return withCertification?.certification || '';
}

// Main details call — includes release_dates via append_to_response so
// certification comes back in the same request instead of a third call.
export async function getMovieDetails(id) {
  const data = await tmdbFetch(`/movie/${id}`, {
    append_to_response: 'release_dates',
  });

  return {
    id: data.id,
    title: data.title,
    posterUrl: getPosterUrl(data.poster_path),
    backdropUrl: getBackdropUrl(data.backdrop_path, 'original'),
    genres: data.genres.map((genre) => genre.name),
    runtime: data.runtime,
    overview: data.overview,
    voteAverage: data.vote_average,
    releaseDate: data.release_date,
    certification: findCertification(data.release_dates?.results),
  };
}

// Separate trailer call — TMDB videos endpoint isn't filtered server-side,
// so we filter down to the first official YouTube trailer here.
export async function getMovieTrailer(id) {
  const data = await tmdbFetch(`/movie/${id}/videos`);

  const trailer = data.results.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer',
  );

  if (!trailer) return null;

  return {
    key: trailer.key,
    youtubeUrl: `https://www.youtube.com/watch?v=${trailer.key}`,
    embedUrl: `https://www.youtube.com/embed/${trailer.key}`,
  };
}

// Maps SubmenuTabBar's tab keys directly to their TMDB list endpoint, so
// Home can call this with whatever tab is currently active.
const CATEGORY_ENDPOINTS = {
  popular: '/movie/popular',
  upcoming: '/movie/upcoming',
  nowPlaying: '/movie/now_playing',
  topRated: '/movie/top_rated',
};

// "Now Playing" and "Upcoming" are calculated per-region by TMDB (each
// country has its own theatrical release calendar) — without a region
// param, TMDB falls back to a loose window that can include movies
// released months or even years ago. CA matches our audience/institution.
const REGION = 'CA';
const CATEGORIES_NEEDING_REGION = new Set(['upcoming', 'nowPlaying']);

// Fetches one page of a movie list (Popular / Upcoming / Now Playing / Top
// Rated) and maps each raw TMDB result into the SAME shape mockMovies.js
// already uses, so MovieGrid/MovieCard need zero changes to consume it.
export async function getMoviesByCategory(category) {
  const endpoint = CATEGORY_ENDPOINTS[category];

  if (!endpoint) {
    throw new Error(`Unknown movie category: ${category}`);
  }

  const params = CATEGORIES_NEEDING_REGION.has(category)
    ? { region: REGION }
    : {};
  const data = await tmdbFetch(endpoint, params);

  return data.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    poster_path: getPosterUrl(movie.poster_path), // turn relative path into a full image URL
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    overview: movie.overview,
    // genre_ids -> real names; filter(Boolean) drops any id we don't
    // recognize instead of showing "undefined" in the UI
    genres: movie.genre_ids.map((id) => genreMap[id]).filter(Boolean),
  }));
}
