import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NotFound.scss';

function NotFound() {
  useEffect(() => {
    document.title = 'Polar DB | Page Not Found';

    const metaTag = document.querySelector('meta[name="description"]');
    const description = "The page you're looking for doesn't exist.";

    if (metaTag) {
      metaTag.setAttribute('content', description);
    } else {
      const newMetaTag = document.createElement('meta');
      newMetaTag.name = 'description';
      newMetaTag.content = description;
      document.head.appendChild(newMetaTag);
    }
  }, []);

  return (
    <div className="notFound">
      <h1 className="notFound__code">404</h1>
      <p className="notFound__message">Page not found.</p>
      <Link to="/" className="notFound__link">
        Go back home
      </Link>
    </div>
  );
}

export default NotFound;
