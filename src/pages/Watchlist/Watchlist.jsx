import { useEffect } from 'react';
import { useWatchlist } from '../../hooks/useWatchlist';

import ScrollButton from '../../components/ScrollButton/ScrollButton';
import AddWatchlistCard from '../../components/AddWatchlistCard/AddWatchlistCard';
import EmptyWatchlist from '../../components/EmptyWatchlist/EmptyWatchlist';
import MovieGrid from '../../components/MovieGrid/MovieGrid';

import './Watchlist.scss';

function Watchlist() {
  useEffect(() => {
    document.title = 'Polar DB | Watchlist';

    const metaTag = document.querySelector('meta[name="description"]');
    const description =
      'View and manage the movies you have saved to your Polar DB watchlist.';

    if (metaTag) {
      metaTag.setAttribute('content', description);
    } else {
      const newMetaTag = document.createElement('meta');
      newMetaTag.name = 'description';
      newMetaTag.content = description;
      document.head.appendChild(newMetaTag);
    }
  }, []);

  const { watchlist } = useWatchlist();

  return (
    <div className="watchlist content-width">
      <ScrollButton hasHero={false} />
      <h1 className="watchlist__title">My Watchlist</h1>

      {watchlist.length === 0 ? (
        <EmptyWatchlist />
      ) : (
        <MovieGrid movies={watchlist}>
          <AddWatchlistCard />
        </MovieGrid>
      )}
    </div>
  );
}

export default Watchlist;
