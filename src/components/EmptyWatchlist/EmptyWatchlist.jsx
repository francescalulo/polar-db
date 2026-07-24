import './EmptyWatchlist.scss';

function EmptyWatchlist() {
  return (
    <div className="emptyWatchlist">
      <div className="emptyWatchlist__card">
        <span className="emptyWatchlist__plus">+</span>
      </div>

      <p className="emptyWatchlist__message">
        Sorry, you have no favourite movies. Return to the home page to add a favourite movie.
      </p>
    </div>
  );
}

export default EmptyWatchlist;