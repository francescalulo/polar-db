import { useReducer, useEffect } from 'react';
import { WatchlistContext } from './WatchlistContext';
import watchlistReducer from './WatchlistReducer';
import {
  watchlistStorageName,
  initialState,
  ACTIONS,
} from '../globals/globalVariables';

function WatchlistProvider({ children }) {
  const [state, dispatch] = useReducer(watchlistReducer, initialState);

  // Load the saved watchlist from localStorage once, on mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem(watchlistStorageName);

    if (savedWatchlist) {
      try {
        const parsedWatchlist = JSON.parse(savedWatchlist);
        dispatch({
          type: ACTIONS.LOAD_WATCHLIST,
          payload: parsedWatchlist,
        });
      } catch (error) {
        console.error('Error parsing watchlist from localStorage:', error);
        localStorage.removeItem(watchlistStorageName);
      }
    }
  }, []);

  // Actions - each one updates localStorage and dispatches together, so
  // the two never drift out of sync with each other
  const addMovie = (movie) => {
    const updatedWatchlist = [...state, movie];
    localStorage.setItem(
      watchlistStorageName,
      JSON.stringify(updatedWatchlist),
    );

    dispatch({
      type: ACTIONS.ADD_MOVIE,
      payload: movie,
    });
  };

  const removeMovie = (movieId) => {
    const updatedWatchlist = state.filter((movie) => movie.id !== movieId);
    localStorage.setItem(
      watchlistStorageName,
      JSON.stringify(updatedWatchlist),
    );

    dispatch({
      type: ACTIONS.REMOVE_MOVIE,
      payload: movieId,
    });
  };

  const value = {
    watchlist: state,
    addMovie,
    removeMovie,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export default WatchlistProvider;
