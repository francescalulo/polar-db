import MoreInfoButton from '../MoreInfoButton/MoreInfoButton';
import BookmarkButton from '../BookmarkButton/BookmarkButton';
import ShareButton from '../ShareButton/ShareButton';
import './MovieCard.scss';

// Added onRemove so the Watchlist can update when a movie is removed
function MovieCard({ movie, onRemove }) {
  return (
    <div className="movieCard">
      <img
        className="movieCard__poster"
        src={movie.poster_path}
        alt={movie.title}
      />

      <div className="movieCard__details">
        <div className="movieCard__overlay" />

        <div className="movieCard__info">
          <div className="movieCard__titleGroup">
            <h3 className="movieCard__title">{movie.title}</h3>

            <p className="movieCard__genre">
              {movie.genres?.join(', ') || 'Genre unavailable'}
            </p>
          </div>

          <p className="movieCard__date">Release Date: {movie.release_date}</p>

          <p className="movieCard__overview">{movie.overview}</p>
        </div>

        <MoreInfoButton movieId={movie.id} className="movieCard__moreInfo" />
      </div>

      <div className="movieCard__topRow">
        <div
          className="movieCard__rating"
          aria-label={`User Score: ${Math.round(movie.vote_average * 10)}%`}
        >
          <span>★ {Math.round(movie.vote_average * 10)}%</span>
        </div>

        {/* Pass my remove function to the BookmarkButton */}
        <BookmarkButton movie={movie} onRemove={onRemove} />
      </div>

      <ShareButton movie={movie} className="movieCard__share" />
    </div>
  );
}

export default MovieCard;
