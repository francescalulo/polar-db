import bookmarkOutline from '../../assets/icons/bookmark-icon-outline.svg';
import shareOutline from '../../assets/icons/share-icon-outline.svg';
import MoreInfoButton from '../MoreInfoButton/MoreInfoButton';
import './MovieCard.scss';

function MovieCard({ movie }) {
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
            <p className="movieCard__genre">{movie.genres.join(', ')}</p>
          </div>
          <p className="movieCard__date">Release Date: {movie.release_date}</p>
          <p className="movieCard__overview">{movie.overview}</p>
        </div>

        <MoreInfoButton className="movieCard__moreInfo" />
      </div>

      <div className="movieCard__topRow">
        <div
          className="movieCard__rating"
          aria-label={`User Score: ${Math.round(movie.vote_average * 10)}%`}
        >
          <span>★ {Math.round(movie.vote_average * 10)}%</span>
        </div>
        <button className="movieCard__bookmark" aria-label="Add to watchlist" type="button">
          <img src={bookmarkOutline} alt="" />
        </button>
      </div>

      <button className="movieCard__share" aria-label="Share" type="button">
        <img src={shareOutline} alt="" />
      </button>
    </div>
  );
}

export default MovieCard;