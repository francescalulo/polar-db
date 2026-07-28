import { useEffect } from 'react';
import './Home.scss';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import SubmenuTabBar from '../../components/SubmenuTabBar/SubmenuTabBar';
import MovieGrid from '../../components/MovieGrid/MovieGrid';
import { mockMovies } from '../../data/mockMovies';
import { mockHeroMovies } from '../../data/mockHeroMovies';

function Home() {
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

  return (
    <div className="home">
      <HeroCarousel movies={mockHeroMovies} />
      <SubmenuTabBar />
      <MovieGrid movies={mockMovies} />
    </div>
  );
}

export default Home;
