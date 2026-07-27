import './Home.scss';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import SubmenuTabBar from '../../components/SubmenuTabBar/SubmenuTabBar';
import MovieGrid from '../../components/MovieGrid/MovieGrid';
import { mockMovies } from '../../data/mockMovies';
import { mockHeroMovies } from '../../data/mockHeroMovies';

function Home() {
  return (
    <div className="home">
      <Header />
      <HeroCarousel movie={mockHeroMovies[0]} />
      <SubmenuTabBar />
      <MovieGrid movies={mockMovies} />
      <Footer />
    </div>
  );
}

export default Home;
