import './Home.scss';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SubmenuTabBar from '../../components/SubmenuTabBar/SubmenuTabBar';
import MovieCard from '../../components/MovieCard/MovieCard';
import MovieGrid from '../../components/MovieGrid/MovieGrid';

// Movie Card Mock-up for preview purposes
const mockMovies = [
  {
    id: 1,
    title: 'Kraken 2026',
    poster_path:
      'https://image.tmdb.org/t/p/original/6kl4oAJgeGmxqNoDu4wk58YpORN.jpg',
    release_date: '2025-12-19',
    vote_average: 6.4,
    overview:
      'A marine biologist is doing research on a fish farm when she encounters...',
    genres: ['Horror', 'Action', 'Thriller'],
  },
  {
    id: 2,
    title: 'Kraken 2026',
    poster_path:
      'https://image.tmdb.org/t/p/original/6kl4oAJgeGmxqNoDu4wk58YpORN.jpg',
    release_date: '2025-12-19',
    vote_average: 6.4,
    overview:
      'A marine biologist is doing research on a fish farm when she encounters...',
    genres: ['Horror', 'Action', 'Thriller'],
  },
  {
    id: 3,
    title: 'Kraken 2026',
    poster_path:
      'https://image.tmdb.org/t/p/original/6kl4oAJgeGmxqNoDu4wk58YpORN.jpg',
    release_date: '2025-12-19',
    vote_average: 6.4,
    overview:
      'A marine biologist is doing research on a fish farm when she encounters...',
    genres: ['Horror', 'Action', 'Thriller'],
  },
  {
    id: 4,
    title: 'Kraken 2026',
    poster_path:
      'https://image.tmdb.org/t/p/original/6kl4oAJgeGmxqNoDu4wk58YpORN.jpg',
    release_date: '2025-12-19',
    vote_average: 6.4,
    overview:
      'A marine biologist is doing research on a fish farm when she encounters...',
    genres: ['Horror', 'Action', 'Thriller'],
  },
  {
    id: 5,
    title: 'Kraken 2026',
    poster_path:
      'https://image.tmdb.org/t/p/original/6kl4oAJgeGmxqNoDu4wk58YpORN.jpg',
    release_date: '2025-12-19',
    vote_average: 6.4,
    overview:
      'A marine biologist is doing research on a fish farm when she encounters...',
    genres: ['Horror', 'Action', 'Thriller'],
  },
  {
    id: 6,
    title: 'Kraken 2026',
    poster_path:
      'https://image.tmdb.org/t/p/original/6kl4oAJgeGmxqNoDu4wk58YpORN.jpg',
    release_date: '2025-12-19',
    vote_average: 6.4,
    overview:
      'A marine biologist is doing research on a fish farm when she encounters...',
    genres: ['Horror', 'Action', 'Thriller'],
  },
  {
    id: 7,
    title: 'Kraken 2026',
    poster_path:
      'https://image.tmdb.org/t/p/original/6kl4oAJgeGmxqNoDu4wk58YpORN.jpg',
    release_date: '2025-12-19',
    vote_average: 6.4,
    overview:
      'A marine biologist is doing research on a fish farm when she encounters...',
    genres: ['Horror', 'Action', 'Thriller'],
  },
  {
    id: 8,
    title: 'Kraken 2026',
    poster_path:
      'https://image.tmdb.org/t/p/original/6kl4oAJgeGmxqNoDu4wk58YpORN.jpg',
    release_date: '2025-12-19',
    vote_average: 6.4,
    overview:
      'A marine biologist is doing research on a fish farm when she encounters...',
    genres: ['Horror', 'Action', 'Thriller'],
  },
  {
    id: 9,
    title: 'Kraken 2026',
    poster_path:
      'https://image.tmdb.org/t/p/original/6kl4oAJgeGmxqNoDu4wk58YpORN.jpg',
    release_date: '2025-12-19',
    vote_average: 6.4,
    overview:
      'A marine biologist is doing research on a fish farm when she encounters...',
    genres: ['Horror', 'Action', 'Thriller'],
  },
  {
    id: 10,
    title: 'Kraken 2026',
    poster_path:
      'https://image.tmdb.org/t/p/original/6kl4oAJgeGmxqNoDu4wk58YpORN.jpg',
    release_date: '2025-12-19',
    vote_average: 6.4,
    overview:
      'A marine biologist is doing research on a fish farm when she encounters...',
    genres: ['Horror', 'Action', 'Thriller'],
  },
  {
    id: 11,
    title: 'Kraken 2026',
    poster_path:
      'https://image.tmdb.org/t/p/original/6kl4oAJgeGmxqNoDu4wk58YpORN.jpg',
    release_date: '2025-12-19',
    vote_average: 6.4,
    overview:
      'A marine biologist is doing research on a fish farm when she encounters...',
    genres: ['Horror', 'Action', 'Thriller'],
  },
  {
    id: 12,
    title: 'Kraken 2026',
    poster_path:
      'https://image.tmdb.org/t/p/original/6kl4oAJgeGmxqNoDu4wk58YpORN.jpg',
    release_date: '2025-12-19',
    vote_average: 6.4,
    overview:
      'A marine biologist is doing research on a fish farm when she encounters...',
    genres: ['Horror', 'Action', 'Thriller'],
  },

  // placeholder cards
];

function Home() {
  return (
    <div className="home">
      <Header />
      <SubmenuTabBar />
      <MovieGrid movies={mockMovies} />
      <Footer />
    </div>
  );
}

export default Home;
