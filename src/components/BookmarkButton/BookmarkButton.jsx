import { useEffect, useState } from 'react';
import bookmarkOutline from '../../assets/icons/bookmark-icon-outline.svg';
import bookmarkFilled from '../../assets/icons/bookmark-icon-filled.svg';
import './BookmarkButton.scss';

function BookmarkButton({ movie, className, onRemove }) {
  // Keep track of whether this movie is bookmarked
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Check localStorage when the movie card loads
  useEffect(() => {
    const savedMovies =
      JSON.parse(localStorage.getItem('watchlist')) || [];

    const movieIsSaved = savedMovies.some(
      (savedMovie) => savedMovie.id === movie.id
    );

    setIsBookmarked(movieIsSaved);
  }, [movie.id]);

  // Add or remove the movie when the bookmark is clicked
  const handleClick = () => {
    const savedMovies =
      JSON.parse(localStorage.getItem('watchlist')) || [];

    if (isBookmarked) {
      // Remove this movie from the saved movies
      const updatedMovies = savedMovies.filter(
        (savedMovie) => savedMovie.id !== movie.id
      );

      localStorage.setItem(
        'watchlist',
        JSON.stringify(updatedMovies)
      );

      setIsBookmarked(false);

      // Update the Watchlist page right away
      if (onRemove) {
        onRemove(movie.id);
      }
    } else {
      // Check that the movie is not already saved
      const alreadySaved = savedMovies.some(
        (savedMovie) => savedMovie.id === movie.id
      );

      if (!alreadySaved) {
        const updatedMovies = [...savedMovies, movie];

        localStorage.setItem(
          'watchlist',
          JSON.stringify(updatedMovies)
        );
      }

      setIsBookmarked(true);
    }
  };

  return (
    <button
      className={'bookmarkButton ' + (className || '')}
      type="button"
      aria-label={
        isBookmarked
          ? 'Remove from watchlist'
          : 'Add to watchlist'
      }
      aria-pressed={isBookmarked}
      onClick={handleClick}
    >
      <img
        src={isBookmarked ? bookmarkFilled : bookmarkOutline}
        alt=""
      />
    </button>
  );
}

export default BookmarkButton;