import { tmdbFetch, getPosterUrl, getBackdropUrl } from './tmdbClient';

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
