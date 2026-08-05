import { tmdbFetch, getPosterUrl, getBackdropUrl } from './tmdbClient';
import { genreMap } from '../data/genreMap';
import { formatRuntime } from '../utils/formatRuntime';

function findCertification(releaseDatesResults, countryCode = 'US') {
  const country = releaseDatesResults?.find(
    (entry) => entry.iso_3166_1 === countryCode,
  );
  const withCertification = country?.release_dates.find(
    (entry) => entry.certification,
  );
  return withCertification?.certification || '';
}

// Main details call which includes release_dates via append_to_response so
// certification comes back in the same request instead of a third call.
export async function getMovieDetails(id) {
  const data = await tmdbFetch(`/movie/${id}`, {
    append_to_response: 'release_dates',
  });

  const posterUrl = getPosterUrl(data.poster_path, 'w780');
  const genres = data.genres.map((genre) => genre.name);

  return {
    id: data.id,
    title: data.title,
    posterUrl,
    backdropUrl: getBackdropUrl(data.backdrop_path, 'original'), // desktop: stretches full viewport width, needs max sharpness
    backdropUrlTablet: getBackdropUrl(data.backdrop_path, 'w1280'), // tablet: narrower viewport, smaller download without losing visible sharpness
    genres,
    runtime: data.runtime,
    overview: data.overview,
    voteAverage: data.vote_average,
    releaseDate: data.release_date,
    certification: findCertification(data.release_dates?.results),
    // Same reasoning as getHeroMovies below: BookmarkButton saves whatever
    // object it's given straight to localStorage, and the Watchlist page
    // reads it back through MovieCard, which expects poster_path /
    // release_date / vote_average, not this function's own posterUrl /
    // releaseDate / voteAverage field names.
    watchlistEntry: {
      id: data.id,
      title: data.title,
      poster_path: posterUrl,
      release_date: data.release_date,
      vote_average: data.vote_average,
      overview: data.overview,
      genres,
    },
  };
}
// Separate trailer call: TMDB videos endpoint isn't filtered server-side,
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
// country has its own theatrical release calendar) without a region
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

const HERO_MOVIE_COUNT = 5;

// Builds the small set of movies shown in Home's HeroCarousel. The carousel
// needs certification + runtime, which only the single-movie details
// endpoint returns (list endpoints don't include them) so this takes the
// top N Popular movies, then fetches full details for each one in parallel
// with getMovieDetails.
export async function getHeroMovies(count = HERO_MOVIE_COUNT) {
  const popular = await getMoviesByCategory('popular');
  const topMovies = popular.slice(0, count);

  const details = await Promise.all(
    topMovies.map((movie) => getMovieDetails(movie.id)),
  );

  return details.map((movie) => ({
    id: movie.id,
    title: movie.title,
    year: movie.releaseDate?.slice(0, 4),
    genres: movie.genres,
    rating: Math.round(movie.voteAverage * 10),
    certification: movie.certification,
    runtime: formatRuntime(movie.runtime),
    synopsis: movie.overview,
    backdrop: movie.backdropUrl,
    backdropTablet: movie.backdropUrlTablet,
    poster: movie.posterUrl,
    // A SEPARATE, MovieCard-shaped copy of this same movie. This is what
    // gets saved to localStorage if a user bookmarks straight from the
    // hero carousel, so it matches what the Watchlist page (via MovieCard)
    // expects to read. Without this, bookmarking from the hero would save
    // the fields above instead (poster/synopsis/rating), which MovieCard
    // doesn't know how to display, and the movie would show up broken on
    // the Watchlist page.
    watchlistEntry: {
      id: movie.id,
      title: movie.title,
      poster_path: movie.posterUrl,
      release_date: movie.releaseDate,
      vote_average: movie.voteAverage,
      overview: movie.overview,
      genres: movie.genres,
    },
  }));
}
