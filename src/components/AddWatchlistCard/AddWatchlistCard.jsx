import { Link } from 'react-router-dom';

import './AddWatchlistCard.scss';

function AddWatchlistCard() {
  return (
    <Link
      to="/"
      className="addWatchlistCard"
      aria-label="Return to the Home page to add a movie"
    >
      <span className="addWatchlistCard__plus">+</span>
    </Link>
  );
}

export default AddWatchlistCard;