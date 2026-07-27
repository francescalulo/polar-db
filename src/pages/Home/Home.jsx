import './Home.scss';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import SubmenuTabBar from '../../components/SubmenuTabBar/SubmenuTabBar';
import MovieGrid from '../../components/MovieGrid/MovieGrid';
import { mockMovies } from '../../data/mockMovies';
import { mockHeroMovies } from '../../data/mockHeroMovies';

function Home() {
  return (
    <div className="home">
      <HeroCarousel movie={mockHeroMovies[0]} />
      <SubmenuTabBar />
      <MovieGrid movies={mockMovies} />
    </div>
  );
}

export default Home;
