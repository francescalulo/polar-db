import { useEffect, useRef, useState } from 'react';
import './Home.scss';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import SubmenuTabBar from '../../components/SubmenuTabBar/SubmenuTabBar';
import MovieGrid from '../../components/MovieGrid/MovieGrid';
import { getMoviesByCategory, getHeroMovies } from '../../services/movies';

function Home() {
  const gridRef = useRef(null);
  const [isGridVisible, setIsGridVisible] = useState(false);

  // Which SubmenuTabBar tab is active, lifted up from SubmenuTabBar so both
  // it and the fetch below can read/change the same value
  const [activeTab, setActiveTab] = useState('popular');

  // The fetched movie list, loading, and error states for that tab
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hero carousel's own movie list, fetched once on mount. It always
  // shows the same handful of Popular movies, independent of whichever
  // SubmenuTabBar tab is currently active, so it gets its own state
  // instead of sharing the grid's.
  const [heroMovies, setHeroMovies] = useState([]);
  const [isHeroLoading, setIsHeroLoading] = useState(true);

  // Set this page's title and meta description on mount (for browser tab + SEO)
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

  // Fetch the hero carousel's movies once when Home first mounts
  useEffect(() => {
    const fetchHeroMovies = async () => {
      setIsHeroLoading(true);

      try {
        const data = await getHeroMovies();
        setHeroMovies(data);
        setIsHeroLoading(false);
      } catch (err) {
        // If the hero fetch fails, just leave heroMovies empty and the rest
        // of the page (tabs + grid) still works fine without it
        console.error('Failed to load hero movies:', err.message);
        setHeroMovies([]);
        setIsHeroLoading(false);
      }
    };

    fetchHeroMovies();
  }, []);

  // Refetch the movie list whenever activeTab changes (tab click -> new
  // category -> new API call)
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getMoviesByCategory(activeTab);
        setMovies(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setMovies([]);
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [activeTab]);

  // Show the submenu bar once the movie grid scrolls into view
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

  return (
    <div className="home">
      {/* Only render once loaded, since HeroCarousel reads
          movies[currentIndex] immediately and would break on an empty array */}
      {!isHeroLoading && heroMovies.length > 0 && (
        <HeroCarousel movies={heroMovies} />
      )}
      <SubmenuTabBar
        isVisible={isGridVisible}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="home__content content-width">
        {/* MovieGrid doesn't forward a ref, so wrap it, this div is what the observer above watches */}
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
            <MovieGrid movies={movies} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
