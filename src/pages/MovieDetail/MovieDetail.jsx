import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMovieDetails, getMovieTrailer } from '../../services/movies';
import { formatRuntime } from '../../utils/formatRuntime';
import useIsMobile from '../../hooks/useIsMobile';
import BookmarkButton from '../../components/BookmarkButton/BookmarkButton';
import ShareButton from '../../components/ShareButton/ShareButton';
import backIcon from '../../assets/icons/back-icon-outline.svg';
import './MovieDetail.scss';

// TEMP placeholder until Sara/Talia add credits data (director + cast) to the API
const TEMP_DIRECTOR = 'John Doe';

function MovieDetail() {
  const { id } = useParams();
  const isMobile = useIsMobile(); // below tablet breakpoint (768px)
  const isBelowDesktop = useIsMobile(1024); // below desktop breakpoint which covers tablet + mobile
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMovie = async () => {
      setLoading(true);
      setError(null);

      try {
        const [details, trailerResult] = await Promise.all([
          getMovieDetails(id),
          getMovieTrailer(id).catch(() => null),
        ]);

        if (isMounted) {
          setMovie(details);
          setTrailer(trailerResult);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setMovie(null);
          setLoading(false);
        }
      }
    };

    fetchMovie();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading)
    return (
      <div className="movieDetail movieDetail--status">Loading movie...</div>
    );
  if (error)
    return (
      <div className="movieDetail movieDetail--status">Error: {error}</div>
    );
  if (!movie) return null;

  return (
    <div className="movieDetail">
      <div className="movieDetail__hero">
        {/* Backdrop is never shown on mobile (hidden via CSS), so skip
            downloading it there entirely. Tablet gets the smaller w1280
            version, desktop gets the full-resolution original. */}
        {!isMobile && movie.backdropUrl && (
          <img
            src={isBelowDesktop ? movie.backdropUrlTablet : movie.backdropUrl}
            alt=""
            className="movieDetail__backdrop"
          />
        )}
        <div className="movieDetail__backdropOverlay" />

        <div className="movieDetail__heroBanner">
          <Link to="/" className="movieDetail__back">
            <img src={backIcon} alt="" />
            <span className="movieDetail__backLabel">Back</span>
          </Link>

          {/* Only shown on mobile (CSS hides it at tablet+), so only load it there */}
          {isMobile && movie.posterUrl && (
            <img
              src={movie.posterUrl}
              alt=""
              className="movieDetail__heroImage"
            />
          )}
          <div className="movieDetail__heroOverlay" />

          <div className="movieDetail__card">
            {/* Only shown at tablet+ (CSS hides it on mobile), so only load it there */}
            {!isMobile && movie.posterUrl && (
              <img
                src={movie.posterUrl}
                alt=""
                className="movieDetail__cardPoster"
              />
            )}
            <div className="movieDetail__cardOverlay" />

            <div className="movieDetail__info">
              <h1 className="movieDetail__title">
                {movie.title} ({movie.releaseDate?.slice(0, 4)})
              </h1>
              <p className="movieDetail__genres">{movie.genres.join(', ')}</p>
              <p className="movieDetail__director">
                Directed by {TEMP_DIRECTOR}
              </p>
              <p className="movieDetail__release">
                Release Date: {movie.releaseDate}
              </p>

              <div className="movieDetail__metaLine">
                <span
                  className="movieDetail__rating"
                  aria-label={`User Score: ${Math.round(movie.voteAverage * 10)}%`}
                >
                  ★ {Math.round(movie.voteAverage * 10)}%
                </span>
                {movie.certification && <span>{movie.certification}</span>}
                {movie.runtime && <span>{formatRuntime(movie.runtime)}</span>}
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

        {trailer && (
          <div className="movieDetail__trailerWrap">
            {isTrailerPlaying ? (
              <iframe
                src={trailer.embedUrl + '?autoplay=1'}
                title={`${movie.title} trailer`}
                className="movieDetail__trailerFrame"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                className="movieDetail__trailerPreview"
                onClick={() => setIsTrailerPlaying(true)}
                aria-label={`Play trailer for ${movie.title}`}
              >
                <img
                  src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`}
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
        )}

        <div className="movieDetail__overview">
          <h2>Overview</h2>
          <p>{movie.overview}</p>
        </div>
      </div>

      {/* Cast section goes here */}
    </div>
  );
}

export default MovieDetail;
