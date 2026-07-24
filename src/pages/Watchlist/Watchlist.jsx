import { useEffect, useState } from 'react';
import MovieCard from '../../components/MovieCard/MovieCard';
import EmptyWatchlist from '../../components/EmptyWatchlist/EmptyWatchlist';
import './Watchlist.scss';

function Watchlist() {
  const [watchlistMovies, setWatchlistMovies] = useState([]);

  useEffect(() => {
    const savedMovies = localStorage.getItem('watchlist');

    if (savedMovies) {
      setWatchlistMovies(JSON.parse(savedMovies));
    }
  }, []);

  return (
    <main className="watchlist">
      <h1 className="watchlist__title">My Watchlist</h1>

      {watchlistMovies.length === 0 ? (
        <EmptyWatchlist />
      ) : (
        <div className="watchlist__grid">
          {watchlistMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Watchlist;