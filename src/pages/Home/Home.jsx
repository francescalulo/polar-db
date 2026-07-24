import './Home.scss';
import Header from '../../components/Header/Header';
import MovieCard from "../../components/MovieCard/MovieCard";

// Movie Card Mock-up for preview purposes
const mockMovie = {
  id: 1,
  title: "Kraken 2026",
  poster_path: "https://image.tmdb.org/t/p/original/6kl4oAJgeGmxqNoDu4wk58YpORN.jpg",
  release_date: "2025-12-19",
  vote_average: 6.4,
  overview: "A marine biologist is doing research on a fish farm when she encounters...",
  genres: ["Horror", "Action", "Thriller"]
};

function Home() {
  return (
    <div>
      <Header />
      <MovieCard movie={mockMovie} />
    </div>
  );
}

export default Home;