import { Link } from 'react-router-dom';
import './NotFound.scss';

function NotFound() {
  return (
    <div className="notFound">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/">Go back home</Link>
    </div>
  );
}

export default NotFound;
