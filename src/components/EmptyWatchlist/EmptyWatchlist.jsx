import { Link } from 'react-router-dom';
import './EmptyWatchlist.scss';

function EmptyWatchlist() {
  return (
    <div className="emptyWatchlist">
      {/* Return to the Home page when the empty card is clicked */}
      <Link
        to="/"
        className="emptyWatchlist__card"
        aria-label="Return to the Home page to add a movie"
      >
        <span className="emptyWatchlist__plus">+</span>
      </Link>

      <p className="emptyWatchlist__message">
        Sorry, you have no favourite movies. Return to the home page to add a
        favourite movie.
      </p>
    </div>
  );
}

export default EmptyWatchlist;