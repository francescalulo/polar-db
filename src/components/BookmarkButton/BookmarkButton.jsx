import { useState } from 'react';
import bookmarkOutline from '../../assets/icons/bookmark-icon-outline.svg';
import bookmarkFilled from '../../assets/icons/bookmark-icon-filled.svg';
import './BookmarkButton.scss';

function BookmarkButton({ movie, className }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleClick = () => {
    setIsBookmarked((prev) => !prev);
    // TODO (Day 7): replace with real watchlist state + localStorage
    console.log(
      isBookmarked
        ? 'Removed "' + movie.title + '" from watchlist'
        : 'Added "' + movie.title + '" to watchlist',
    );
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
    </button>
  );
}

export default BookmarkButton;
