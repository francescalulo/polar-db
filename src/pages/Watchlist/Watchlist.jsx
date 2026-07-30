import { useEffect, useState } from 'react';

import AddWatchlistCard from '../../components/AddWatchlistCard/AddWatchlistCard';
import EmptyWatchlist from '../../components/EmptyWatchlist/EmptyWatchlist';
import MovieCard from '../../components/MovieCard/MovieCard';

import './Watchlist.scss';

function Watchlist() {
  // Read the saved watchlist when the state is first created
  const [watchlistMovies, setWatchlistMovies] = useState(() => {
    const savedMovies = localStorage.getItem('watchlist');

    return savedMovies ? JSON.parse(savedMovies) : [];
  });

  // Save the watchlist whenever the state changes
  useEffect(() => {
    localStorage.setItem(
      'watchlist',
      JSON.stringify(watchlistMovies),
    );
  }, [watchlistMovies]);

  // Remove one movie from the current watchlist
  const handleRemoveMovie = (movieId) => {
    setWatchlistMovies((currentMovies) =>
      currentMovies.filter((movie) => movie.id !== movieId),
    );
  };

  return (
    <div className="watchlist">
      <h1 className="watchlist__title">My Watchlist</h1>

      {watchlistMovies.length === 0 ? (
        <EmptyWatchlist />
      ) : (
        <div className="watchlist__grid">
          {watchlistMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onRemove={handleRemoveMovie}
            />
          ))}

          <AddWatchlistCard />
        </div>
      )}
    </div>
  );
}

export default Watchlist;
