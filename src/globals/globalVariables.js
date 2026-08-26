// True app-wide constants used by more than one file - currently just
// the watchlist reducer/provider, since that's the only cross-cutting
// state the app has so far.

// localStorage key the watchlist is persisted under
const watchlistStorageName = 'watchlist';

// Watchlist starts empty until WatchlistProvider loads any saved data
// from localStorage on mount
const initialState = [];

// Action types dispatched to watchlistReducer
const ACTIONS = {
  LOAD_WATCHLIST: 'LOAD_WATCHLIST',
  ADD_MOVIE: 'ADD_MOVIE',
  REMOVE_MOVIE: 'REMOVE_MOVIE',
};

export { watchlistStorageName, initialState, ACTIONS };
