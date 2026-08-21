import { useContext } from 'react';
import { WatchlistContext } from '../context/WatchlistContext';

// Custom hook to use the watchlist context
export function useWatchlist() {
  const context = useContext(WatchlistContext);

  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }

  return context;
}
