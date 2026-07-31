import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getMovieTrailer } from '../../services/movies';
import './MovieDetail.scss';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMovie = async () => {
      setLoading(true);
      setError(null);

      try {
        const [details, trailerResult] = await Promise.all([
          getMovieDetails(id),
          getMovieTrailer(id).catch(() => null), // missing trailer shouldn't break the page
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

  if (loading) return <div className="movieDetail movieDetail--status">Loading movie...</div>;
  if (error) return <div className="movieDetail movieDetail--status">Error: {error}</div>;
  if (!movie) return null;

  return (
    <div className="movieDetail">
      {movie.backdropUrl && (
        <img src={movie.backdropUrl} alt="" className="movieDetail__backdrop" />
      )}

      <div className="movieDetail__content">
        {movie.posterUrl && (
          <img src={movie.posterUrl} alt={movie.title} className="movieDetail__poster" />
        )}

        <div className="movieDetail__info">
          <h1 className="movieDetail__title">{movie.title}</h1>

          <div className="movieDetail__meta">
            <span>{movie.releaseDate}</span>
            {movie.certification && <span>{movie.certification}</span>}
            <span>{movie.runtime} min</span>
            <span>★ {Math.round(movie.voteAverage * 10)}%</span>
          </div>

          <p className="movieDetail__genres">{movie.genres.join(', ')}</p>

          <p className="movieDetail__overview">{movie.overview}</p>

          {trailer && (
            <a
              href={trailer.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="movieDetail__trailer"
            >
              Watch Trailer
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
