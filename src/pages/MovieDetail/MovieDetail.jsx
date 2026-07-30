import { useEffect } from 'react';
import './MovieDetail.scss';

function MovieDetail() {
  // Set this page's title and meta description on mount (for browser tab + SEO)
  useEffect(() => {
    document.title = 'Polar DB | Movie Detail';

    const metaTag = document.querySelector('meta[name="description"]');
    const description =
      'View detailed information about this movie on Polar DB.';

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
    <div>
      <h1>Movie Detail</h1>
    </div>
  );
}

export default MovieDetail;
