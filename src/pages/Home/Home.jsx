import { useEffect, useRef, useState } from 'react';
import { usePagination } from '../../hooks/usePagination';
import { getMoviesByCategory, getHeroMovies } from '../../services/movies';

import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import ScrollButton from '../../components/ScrollButton/ScrollButton';
import SubmenuTabBar from '../../components/SubmenuTabBar/SubmenuTabBar';
import MovieGrid from '../../components/MovieGrid/MovieGrid';

import './Home.scss';

function Home() {
  const gridRef = useRef(null);
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [isBarVisible, setIsBarVisible] = useState(false);

  const [activeTab, setActiveTab] = useState('popular');

  const {
    movies,
    setMovies,
    isLoadingMore,
    hasMore,
    setInitialResults,
    loadMore,
  } = usePagination();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [heroMovies, setHeroMovies] = useState([]);
  const [isHeroLoading, setIsHeroLoading] = useState(true);

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
  // back to page 1 -- "load more" below is the only thing allowed to
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
          {isLoading && <p className="home__status">Loading movies…</p>}
          {error && (
            <p className="home__status">Couldn't load movies: {error}</p>
          )}
          {!isLoading && !error && movies.length === 0 && (
            <p className="home__status">
              No movies available right now. Check back soon.
            </p>
          )}
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
