import { useEffect, useRef, useState } from 'react';
import './Home.scss';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import SubmenuTabBar from '../../components/SubmenuTabBar/SubmenuTabBar';
import MovieGrid from '../../components/MovieGrid/MovieGrid';
import { mockMovies } from '../../data/mockMovies';
import { mockHeroMovies } from '../../data/mockHeroMovies';

function Home() {
  const gridRef = useRef(null);
  const [isGridVisible, setIsGridVisible] = useState(false);

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
      <SubmenuTabBar isVisible={isGridVisible} />
      {/* MovieGrid doesn't forward a ref, so wrap it, this div is what the observer above watches */}
      <div ref={gridRef}>
        <MovieGrid movies={mockMovies} />
      </div>
    </div>
  );
}

export default Home;
