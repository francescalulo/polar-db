import { useWatchlist } from '../../hooks/useWatchlist';
import bookmarkOutline from '../../assets/icons/bookmark-icon-outline.svg';
import bookmarkFilled from '../../assets/icons/bookmark-icon-filled.svg';
import './BookmarkButton.scss';

function BookmarkButton({ movie, className, showLabel = false }) {
  const { watchlist, addMovie, removeMovie } = useWatchlist();

  // Check whether this movie is already in the watchlist
  const isBookmarked = watchlist.some(
    (savedMovie) => savedMovie.id === movie.id,
  );

  const handleClick = () => {
    if (isBookmarked) {
      removeMovie(movie.id);
    } else {
      addMovie(movie);
    }
  };

  return (
    <button
      className={'bookmarkButton ' + (className || '')}
      type="button"
      aria-label={isBookmarked ? 'Remove from watchlist' : 'Add to watchlist'}
      aria-pressed={isBookmarked}
      onClick={handleClick}
    >
      <img src={isBookmarked ? bookmarkFilled : bookmarkOutline} alt="" />
      {showLabel && (
        <span className="bookmarkButton__label">
          {isBookmarked ? 'Added to Watchlist' : 'Add to My Watchlist'}
        </span>
      )}
    </button>
  );
}

export default BookmarkButton;
