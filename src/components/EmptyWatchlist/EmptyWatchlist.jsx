import AddWatchlistCard from '../AddWatchlistCard/AddWatchlistCard';

import './EmptyWatchlist.scss';

function EmptyWatchlist() {
  return (
    <div className="emptyWatchlist">
      <AddWatchlistCard />

      <div className="emptyWatchlist__message">
        <p className="emptyWatchlist__heading">
          Your Watchlist is as quiet as the northern sky tonight.
        </p>

        <p>
          Discover a movie and add it to your Watchlist to light the way.
        </p>
      </div>
    </div>
  );
}

export default EmptyWatchlist;