import { Link } from 'react-router-dom';
import './MoreInfoButton.scss';

function MoreInfoButton({ movieId, className }) {
  return (
    <Link
      to={'/movie/' + movieId}
      className={'moreInfoButton ' + (className || '')}
    >
      More Info
    </Link>
  );
}

export default MoreInfoButton;
