import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getMovieCredits,
  getMovieDetails,
  getMovieTrailer,
} from '../../services/movies';
import { formatRuntime } from '../../utils/formatRuntime';
import { formatRating } from '../../utils/formatRating';

import ScrollButton from '../../components/ScrollButton/ScrollButton';
import ArtistCarousel from '../../components/ArtistCarousel/ArtistCarousel';
import useIsMobile from '../../hooks/useIsMobile';
import BookmarkButton from '../../components/BookmarkButton/BookmarkButton';
import ShareButton from '../../components/ShareButton/ShareButton';
import backIcon from '../../assets/icons/back-icon-outline.svg';
import ratingIcon from '../../assets/icons/ratings.svg';
import posterFallback from '../../assets/fallbacks/poster-fallback.png';
import backdropFallback from '../../assets/fallbacks/backdrop-fallback.png';
import trailerFallback from '../../assets/fallbacks/trailer-fallback.png';

import './MovieDetail.scss';

function MovieDetail() {
  const { id } = useParams();
  const isMobile = useIsMobile(); // below tablet breakpoint (768px)
  const isBelowDesktop = useIsMobile(1024); // below desktop breakpoint which covers tablet + mobile

  // Movie details plus its related data (cast, director, trailer) - all
  // fetched together in one effect below, since the page needs all three
  // before it can render anything meaningful
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState('');
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local UI state - whether the trailer thumbnail has been swapped for
  // the playing embed, unrelated to the fetch above
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);

  // Fetches the movie's details, trailer, and credits together whenever
  // the route's :id changes. Trailer/credits failures are caught locally
  // and fall back to empty/placeholder values instead of failing the
  // whole page, since a movie can be missing a trailer or full credits
  useEffect(() => {
    let isMounted = true;

    const fetchMovie = async () => {
      setLoading(true);
      setError(null);

      try {
        const [details, trailerResult, creditsResult] = await Promise.all([
          getMovieDetails(id),
          getMovieTrailer(id).catch(() => null),
          getMovieCredits(id).catch(() => ({
            cast: [],
            director: 'Director unavailable',
          })),
        ]);

        if (isMounted) {
          setMovie(details);
          setCast(creditsResult.cast);
          setDirector(creditsResult.director);
          setTrailer(trailerResult);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setMovie(null);
          setCast([]);
          setDirector('');
          setLoading(false);
        }
      }
    };

    fetchMovie();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Sets the tab title and meta description once the movie has loaded
  useEffect(() => {
    if (!movie) return;

    document.title = 'Polar DB | ' + movie.title;

    const metaTag = document.querySelector('meta[name="description"]');
    const description = movie.overview
      ? movie.overview
      : 'Details for ' + movie.title + ' on Polar DB.';

    if (metaTag) {
      metaTag.setAttribute('content', description);
    } else {
      const newMetaTag = document.createElement('meta');
      newMetaTag.name = 'description';
      newMetaTag.content = description;
      document.head.appendChild(newMetaTag);
    }
  }, [movie]);

  if (loading) {
    return (
      <div className="movieDetail movieDetail--status" role="status">
        Loading movie…
      </div>
    );
  }

  if (error) {
    return (
      <div className="movieDetail movieDetail--status" role="status">
        Error: {error}
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="movieDetail content-width">
      <ScrollButton />
      <div className="movieDetail__hero">
        {/* Backdrop is never shown on mobile (hidden via CSS), so skip
            downloading it there entirely. Tablet gets the smaller w1280
            version, desktop gets the full-resolution original. */}
        {!isMobile && (
          <img
            src={
              (isBelowDesktop ? movie.backdropUrlTablet : movie.backdropUrl) ||
              backdropFallback
            }
            alt=""
            className="movieDetail__backdrop"
          />
        )}

        <div className="movieDetail__backdropOverlay" />

        <div className="movieDetail__heroContent content-width">
          <div className="movieDetail__heroBanner">
            <Link
              to="/"
              className="movieDetail__back"
              aria-label="Back to Home"
            >
              <img src={backIcon} alt="" />
              <span className="movieDetail__backLabel">Back to Home</span>
            </Link>

            {/* Only shown on mobile (CSS hides it at tablet+), so only load it there */}
            {isMobile && (
              <img
                src={movie.posterUrl || posterFallback}
                alt=""
                className="movieDetail__heroImage"
              />
            )}

            <div className="movieDetail__heroOverlay" />

            <div className="movieDetail__card">
              {/* Only shown at tablet+ (CSS hides it on mobile), so only load it there */}
              {!isMobile && (
                <img
                  src={movie.posterUrl || posterFallback}
                  alt=""
                  className="movieDetail__cardPoster"
                />
              )}

              <div className="movieDetail__cardVignette" />
              <div className="movieDetail__cardOverlay" />

              <div className="movieDetail__info">
                <h1 className="movieDetail__title">
                  {movie.title} ({movie.releaseDate?.slice(0, 4)})
                </h1>

                <p className="movieDetail__genres">{movie.genres.join(', ')}</p>

                <p className="movieDetail__director">Directed by {director}</p>

                <p className="movieDetail__release">
                  Release Date: {movie.releaseDate}
                </p>

                <div className="movieDetail__metaLine">
                  <span
                    className="movieDetail__rating"
                    aria-label={
                      'User Score: ' + formatRating(movie.voteAverage)
                    }
                  >
                    <img
                      src={ratingIcon}
                      alt=""
                      className="movieDetail__ratingIcon"
                    />
                    {formatRating(movie.voteAverage)}
                  </span>
                  {movie.certification && (
                    <>
                      {isMobile && <span className="movieDetail__dot" />}
                      <span>{movie.certification}</span>
                    </>
                  )}
                  {movie.runtime ? (
                    <>
                      {(isMobile || movie.certification) && (
                        <span className="movieDetail__dot" />
                      )}
                      <span>{formatRuntime(movie.runtime)}</span>
                    </>
                  ) : null}
                  <ShareButton
                    movie={movie}
                    className="movieDetail__share movieDetail__share--inline"
                  />
                </div>

                <div className="movieDetail__watchlistRow">
                  <BookmarkButton
                    movie={movie.watchlistEntry}
                    showLabel
                    className="movieDetail__watchlist"
                  />

                  <ShareButton
                    movie={movie}
                    className="movieDetail__share movieDetail__share--row"
                  />
                </div>
              </div>
            </div>
          </div>

          {trailer ? (
            <div className="movieDetail__trailerWrap">
              {isTrailerPlaying ? (
                <iframe
                  src={trailer.embedUrl + '?autoplay=1'}
                  title={movie.title + ' trailer'}
                  className="movieDetail__trailerFrame"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  className="movieDetail__trailerPreview"
                  onClick={() => setIsTrailerPlaying(true)}
                  aria-label={'Play trailer for ' + movie.title}
                >
                  <img
                    src={
                      'https://img.youtube.com/vi/' +
                      trailer.key +
                      '/hqdefault.jpg'
                    }
                    alt=""
                    className="movieDetail__trailerThumb"
                  />

                  <span className="movieDetail__playButton">
                    <svg
                      viewBox="0 0 24 24"
                      width="28"
                      height="28"
                      aria-hidden="true"
                    >
                      <polygon
                        points="6,4 20,12 6,20"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              )}
            </div>
          ) : (
            <div className="movieDetail__trailerWrap">
              <img
                src={trailerFallback}
                alt="Trailer not available"
                className="movieDetail__trailerFrame movieDetail__trailerThumb"
              />
            </div>
          )}

          <div className="movieDetail__overview">
            <h2>Overview</h2>
            <p>{movie.overview || 'No overview available.'}</p>
          </div>
        </div>
      </div>

      <ArtistCarousel cast={cast} />
    </div>
  );
}

export default MovieDetail;
