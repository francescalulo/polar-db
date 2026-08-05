import { useEffect, useRef, useState } from 'react';
import './Home.scss';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import SubmenuTabBar from '../../components/SubmenuTabBar/SubmenuTabBar';
import MovieGrid from '../../components/MovieGrid/MovieGrid';
import { mockHeroMovies } from '../../data/mockHeroMovies';
import { getMoviesByCategory } from '../../services/movies'; // NEW — replaces mockMovies import

function Home() {
  const gridRef = useRef(null);
  const [isGridVisible, setIsGridVisible] = useState(false);

  // NEW — which SubmenuTabBar tab is active, lifted up from SubmenuTabBar
  // so both it and the fetch below can read/change the same value
  const [activeTab, setActiveTab] = useState('popular');

  // NEW — the fetched movie list, loading, and error states for that tab,
  // same three-state pattern as MovieDetail's useEffect calls
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // NEW — refetch the movie list whenever activeTab changes (tab click ->
  // new category -> new API call). Same fetch pattern from the lecture:
  // set loading, try/fetch/set data, catch/set error, always end up out of
  // loading either way.
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
      <HeroCarousel movies={mockHeroMovies} />
      {/* NEW — activeTab/onTabChange passed down so SubmenuTabBar is now controlled by Home */}
      <SubmenuTabBar
        isVisible={isGridVisible}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {/* MovieGrid doesn't forward a ref, so wrap it, this div is what the observer above watches */}
      <div ref={gridRef}>
        {/* NEW — loading/error/empty states before rendering the real grid */}
        {isLoading && <p className="home__status">Loading movies…</p>}
        {error && <p className="home__status">Couldn't load movies: {error}</p>}
        {!isLoading && !error && <MovieGrid movies={movies} />}
      </div>
    </div>
  );
}

export default Home;
