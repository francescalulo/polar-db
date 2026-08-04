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
        <p>Explore a movie and save it to light the way.</p>
      </div>
    </div>
  );
}

export default EmptyWatchlist;
