import { tmdbFetch, getPosterUrl, getBackdropUrl } from './tmdbClient';
import { genreMap } from '../data/genreMap';
import { formatRuntime } from '../utils/formatRuntime';
import { formatRating } from '../utils/formatRating';

function findCertification(releaseDatesResults, countryCode = 'US') {
  const country = releaseDatesResults?.find(
    (entry) => entry.iso_3166_1 === countryCode,
  );
  const withCertification = country?.release_dates.find(
    (entry) => entry.certification,
  );
  return withCertification?.certification || '';
}

// Shapes a mapped movie object (posterUrl/releaseDate/voteAverage/etc,
// camelCase) into the minimal fields BookmarkButton/watchlist storage
// expects. Used wherever a movie needs a watchlist-ready entry attached.
function toWatchlistEntry(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.posterUrl,
    release_date: movie.releaseDate,
    vote_average: movie.voteAverage,
    overview: movie.overview,
    genres: movie.genres,
  };
}

// Main details call which includes release_dates via append_to_response so
// certification comes back in the same request instead of a third call.
export async function getMovieDetails(id) {
  const data = await tmdbFetch(`/movie/${id}`, {
    append_to_response: 'release_dates',
  });

  const posterUrl = getPosterUrl(data.poster_path, 'w780');
  const genres = data.genres.map((genre) => genre.name);

  const movieDetails = {
    id: data.id,
    title: data.title,
    posterUrl,
    backdropUrl: getBackdropUrl(data.backdrop_path, 'original'),
    backdropUrlTablet: getBackdropUrl(data.backdrop_path, 'w1280'),
    genres,
    runtime: data.runtime,
    overview: data.overview,
    voteAverage: data.vote_average,
    releaseDate: data.release_date,
    certification: findCertification(data.release_dates?.results),
  };

  return { ...movieDetails, watchlistEntry: toWatchlistEntry(movieDetails) };
}

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

export async function getMovieCredits(id) {
  const data = await tmdbFetch(`/movie/${id}/credits`);

  const director = data.crew.find(
    (crewMember) => crewMember.job === 'Director',
  );

  return {
    director: director?.name || 'Director unavailable',

    cast: data.cast.map((actor) => ({
      id: actor.id,
      creditId: actor.credit_id,
      name: actor.name,
      character: actor.character,
      profilePath: actor.profile_path,
    })),
  };
}

const CATEGORY_ENDPOINTS = {
  popular: '/movie/popular',
  upcoming: '/movie/upcoming',
  nowPlaying: '/movie/now_playing',
  topRated: '/movie/top_rated',
};

const REGION = 'US';

// Minimum vote count required for a movie to be shown, used by both
// searchMovies and getMoviesByCategory as a content-safety/quality floor.
const MIN_SEARCH_VOTE_COUNT = 5;

// Categories where movies are too new to have accumulated votes yet --
// exempted from the floor above instead of hardcoding one category name
// in the filter logic below.
const RECENCY_CATEGORIES = ['upcoming', 'nowPlaying'];

const RESULTS_PER_PAGE = 12;

// Inverted genreMap (name -> id, lowercased) so a query that matches a
// genre name exactly can be routed to Discover instead of Search, since
// Search only matches titles and has no way to search by genre at all.
const GENRE_NAME_TO_ID = Object.fromEntries(
  Object.entries(genreMap).map(([id, name]) => [
    name.toLowerCase(),
    Number(id),
  ]),
);

// Shared content-safety filter, used by both getMoviesByCategory and
// searchMovies so the two lists always apply identical rules. TMDB's own
// include_adult flag is inconsistently tagged and only targets hardcore
// content, so this backs it up with our own checks.
function filterSafeResults(results, minVoteCount) {
  return results
    .filter((movie) => !movie.adult)
    .filter((movie) => movie.poster_path)
    .filter((movie) => movie.vote_count >= minVoteCount);
}

// Maps one raw TMDB result into the shape MovieGrid/MovieCard consume.
// Shared by both getMoviesByCategory and searchMovies.
function mapToMovieSummary(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: getPosterUrl(movie.poster_path),
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    overview: movie.overview,
    genres: movie.genre_ids.map((id) => genreMap[id]).filter(Boolean),
  };
}

// Fetches one page of a movie list (Popular / Upcoming / Now Playing / Top
// Rated), capped to 12 results, and maps each raw TMDB result so
// MovieGrid/MovieCard need zero changes to consume it.
export async function getMoviesByCategory(category, { page = 1 } = {}) {
  const endpoint = CATEGORY_ENDPOINTS[category];
  if (!endpoint) {
    throw new Error(`Unknown movie category: ${category}`);
  }
  const data = await tmdbFetch(endpoint, {
    region: REGION,
    include_adult: false,
    page,
  });

  // Upcoming and Now Playing movies haven't been out long enough (or out
  // at all) to collect meaningful votes yet, so the usual floor would
  // wrongly filter most of them out -- Popular and Top Rated are always
  // already-established, widely-voted movies, so it's still a useful
  // spam/quality filter there.
  const minVoteCount = RECENCY_CATEGORIES.includes(category)
    ? 0
    : MIN_SEARCH_VOTE_COUNT;

  const safeResults = filterSafeResults(data.results, minVoteCount);
  const movies = safeResults.slice(0, RESULTS_PER_PAGE).map(mapToMovieSummary);
  movies.totalPages = data.total_pages;
  return movies;
}

const SORT_COMPARATORS = {
  relevance: null,
  rating: (a, b) => b.vote_average - a.vote_average,
  newest: (a, b) => (b.release_date || '').localeCompare(a.release_date || ''),
};

// TMDB reference: https://developer.themoviedb.org/reference/search-movie
// A query that matches a genre name exactly is routed to Discover instead
// (https://developer.themoviedb.org/reference/discover-movie), since
// Search only matches titles and can't match by genre.
export async function searchMovies(
  query,
  { page = 1, sortBy = 'relevance', primaryReleaseYear, signal } = {},
) {
  if (!query?.trim()) return [];

  const trimmedQuery = query.trim();
  const matchedGenreId = GENRE_NAME_TO_ID[trimmedQuery.toLowerCase()];

  const data = matchedGenreId
    ? await tmdbFetch(
        '/discover/movie',
        {
          with_genres: matchedGenreId,
          region: REGION,
          include_adult: false,
          primary_release_year: primaryReleaseYear || undefined,
          sort_by: 'popularity.desc',
          page,
        },
        { signal },
      )
    : await tmdbFetch(
        '/search/movie',
        {
          query: trimmedQuery,
          include_adult: false,
          region: REGION,
          primary_release_year: primaryReleaseYear || undefined,
          page,
        },
        { signal },
      );

  const results = filterSafeResults(data.results, MIN_SEARCH_VOTE_COUNT).map(
    mapToMovieSummary,
  );

  const comparator = SORT_COMPARATORS[sortBy];
  const sorted = comparator ? [...results].sort(comparator) : results;

  // TMDB always returns 20 results per page with no way to ask for fewer,
  // so the 12-per-load cap is enforced here by trimming what TMDB gives us
  // before it ever reaches the UI.
  const movies = sorted.slice(0, RESULTS_PER_PAGE);

  // Attach pagination info directly on the returned array (arrays are
  // objects, this is safe) instead of changing the return shape to
  // { movies, totalPages }. That would force Header's suggestions dropdown
  // to be rewritten too, when only SearchResults actually needs this.
  movies.totalPages = data.total_pages;
  movies.isGenreMatch = Boolean(matchedGenreId);

  return movies;
}

const HERO_MOVIE_COUNT = 5;

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
    rating: formatRating(movie.voteAverage),
    certification: movie.certification,
    runtime: formatRuntime(movie.runtime),
    synopsis: movie.overview,
    backdrop: movie.backdropUrl,
    backdropTablet: movie.backdropUrlTablet,
    poster: movie.posterUrl,
    watchlistEntry: toWatchlistEntry(movie),
  }));
}
