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

// Deployed subfolder name must match vite.config.js's base/outDir and
// the folder name used on the FTP server, so routing and asset paths
// stay in sync no matter where this value is read from.
const APP_FOLDER_NAME = 'polar-db';

export { watchlistStorageName, initialState, ACTIONS, APP_FOLDER_NAME };
