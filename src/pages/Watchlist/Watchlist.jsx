import { useEffect, useState } from 'react';

import ScrollButton from '../../components/ScrollButton/ScrollButton';
import AddWatchlistCard from '../../components/AddWatchlistCard/AddWatchlistCard';
import EmptyWatchlist from '../../components/EmptyWatchlist/EmptyWatchlist';
import MovieGrid from '../../components/MovieGrid/MovieGrid';

import './Watchlist.scss';

function Watchlist() {
  useEffect(() => {
    document.title = 'Polar DB | Watchlist';

    const metaTag = document.querySelector('meta[name="description"]');
    const description =
      'View and manage the movies you have saved to your Polar DB watchlist.';

    if (metaTag) {
      metaTag.setAttribute('content', description);
    } else {
      const newMetaTag = document.createElement('meta');
      newMetaTag.name = 'description';
      newMetaTag.content = description;
      document.head.appendChild(newMetaTag);
    }
  }, []);

  // Read the saved watchlist when the state is first created
  const [watchlistMovies, setWatchlistMovies] = useState(() => {
    const savedMovies = localStorage.getItem('watchlist');

    return savedMovies ? JSON.parse(savedMovies) : [];
  });

  // Save the watchlist whenever the state changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlistMovies));
  }, [watchlistMovies]);

  // Remove one movie from the current watchlist
  const handleRemoveMovie = (movieId) => {
    setWatchlistMovies((currentMovies) =>
      currentMovies.filter((movie) => movie.id !== movieId),
    );
  };

  return (
    <div className="watchlist content-width">
      <ScrollButton hasHero={false} />
      <h1 className="watchlist__title">My Watchlist</h1>

      {watchlistMovies.length === 0 ? (
        <EmptyWatchlist />
      ) : (
        <MovieGrid movies={watchlistMovies} onRemove={handleRemoveMovie}>
          <AddWatchlistCard />
        </MovieGrid>
      )}
    </div>
  );
}

export default Watchlist;
