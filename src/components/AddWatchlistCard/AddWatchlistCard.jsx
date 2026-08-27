import { Link } from 'react-router-dom';
import addIcon from '../../assets/icons/add-icon-outline.svg';

import './AddWatchlistCard.scss';

function AddWatchlistCard() {
  return (
    <Link
      to="/"
      className="addWatchlistCard"
      aria-label="Return to the Home page to add a movie"
    >
      <img src={addIcon} alt="" className="addWatchlistCard__plus" />
    </Link>
  );
}

export default AddWatchlistCard;
