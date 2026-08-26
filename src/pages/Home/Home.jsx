import { useEffect, useRef, useState } from 'react';
import { usePagination } from '../../hooks/usePagination';
import { getMoviesByCategory, getHeroMovies } from '../../services/movies';

import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import ScrollButton from '../../components/ScrollButton/ScrollButton';
import SubmenuTabBar from '../../components/SubmenuTabBar/SubmenuTabBar';
import MovieGrid from '../../components/MovieGrid/MovieGrid';

import './Home.scss';

function Home() {
  // Tracks when the movie grid scrolls into view, so SubmenuTabBar and
  // ScrollButton know when to reveal themselves
  const gridRef = useRef(null);
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [isBarVisible, setIsBarVisible] = useState(false);

  // Which category tab (Popular/Upcoming/Now Playing/Top Rated) is active
  const [activeTab, setActiveTab] = useState('popular');

  // Paginated, tab-driven movie list - state and load-more logic come
  // from the shared hook, loading/error stay local since they're specific
  // to this page's own fetch effect below
  const { movies, isLoadingMore, hasMore, setInitialResults, loadMore } =
    usePagination();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hero carousel's movie list - separate from the tab-driven list above,
  // fetched once on mount and never re-fetched
  const [heroMovies, setHeroMovies] = useState([]);
  const [isHeroLoading, setIsHeroLoading] = useState(true);

  // Sets the tab title and meta description for this page
  useEffect(() => {
    document.title = 'Polar DB | Home';

    const metaTag = document.querySelector('meta[name="description"]');
    const description =
      'Discover popular, upcoming, now playing, and top rated movies on Polar DB.';

    if (metaTag) {
      metaTag.setAttribute('content', description);
    } else {
      const newMetaTag = document.createElement('meta');
      newMetaTag.name = 'description';
      newMetaTag.content = description;
      document.head.appendChild(newMetaTag);
    }
  }, []);

  // Fetches the hero carousel's movies once, on mount
  useEffect(() => {
    const fetchHeroMovies = async () => {
      setIsHeroLoading(true);

      try {
        const data = await getHeroMovies();
        setHeroMovies(data);
        setIsHeroLoading(false);
      } catch (err) {
        console.error('Failed to load hero movies:', err.message);
        setHeroMovies([]);
        setIsHeroLoading(false);
      }
    };

    fetchHeroMovies();
  }, []);

  // Refetch the movie list whenever activeTab changes, always resetting
  // back to page 1. The "load more" below is the only thing allowed to
  // advance it
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getMoviesByCategory(activeTab);
        setInitialResults(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setInitialResults([]);
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [activeTab]);

  // Watches whether the movie grid has scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsGridVisible(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '0px 0px -5% 0px' },
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoadMore = () =>
    loadMore((nextPage) => getMoviesByCategory(activeTab, { page: nextPage }));

  return (
    <div className="home">
      <h1 className="visually-hidden">Discover Movies</h1>
      <ScrollButton hasBottomBar={isBarVisible} />
      {!isHeroLoading && heroMovies.length > 0 && (
        <HeroCarousel movies={heroMovies} />
      )}
      <SubmenuTabBar
        isVisible={isGridVisible}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onVisibilityChange={setIsBarVisible}
      />
      <div className="home__content content-width">
        <div ref={gridRef}>
          {/* Announces loading/error/empty state changes to screen readers */}
          <div aria-live="polite" aria-atomic="true">
            {isLoading && <p className="home__status">Loading movies…</p>}
            {error && (
              <p className="home__status">Couldn't load movies: {error}</p>
            )}
            {!isLoading && !error && movies.length === 0 && (
              <p className="home__status">
                No movies available right now. Check back soon.
              </p>
            )}
          </div>

          {!isLoading && !error && movies.length > 0 && (
            <>
              <MovieGrid movies={movies} />

              {hasMore && (
                <button
                  type="button"
                  className="home__loadMore"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? 'Loading…' : 'Load More'}
                </button>
              )}

              {!hasMore && (
                <div className="home__end">
                  <p className="home__endHeading">
                    You've reached the edge of the aurora.
                  </p>
                  <p className="home__endText">
                    That's every movie we've got in this list for now.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
