import { useEffect, useState } from 'react';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MovieCard from '../../components/MovieCard/MovieCard';
import EmptyWatchlist from '../../components/EmptyWatchlist/EmptyWatchlist';

import './Watchlist.scss';

function Watchlist() {
  // Store all movies saved to the user's watchlist
  const [watchlistMovies, setWatchlistMovies] = useState([]);

  // Load saved movies from localStorage when the page first loads
  useEffect(() => {
    const savedMovies = localStorage.getItem('watchlist');

    if (savedMovies) {
      setWatchlistMovies(JSON.parse(savedMovies));
    }
  }, []);

  // Remove a movie from the watchlist
  const handleRemoveMovie = (movieId) => {
    // Keep every movie except the one being removed
    const updatedMovies = watchlistMovies.filter(
      (movie) => movie.id !== movieId
    );

    // Update the page with the new movie list
    setWatchlistMovies(updatedMovies);

    // Save the updated list back to localStorage
    localStorage.setItem(
      'watchlist',
      JSON.stringify(updatedMovies)
    );
  };

  return (
    <>
      <Header />

      <main className="watchlist">
        <h1 className="watchlist__title">My Watchlist</h1>

        {/* Show the empty state if there are no saved movies */}
        {watchlistMovies.length === 0 ? (
          <EmptyWatchlist />
        ) : (
          <div className="watchlist__grid">
            {/* Display a MovieCard for each saved movie */}
            {watchlistMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onRemove={handleRemoveMovie}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Watchlist;