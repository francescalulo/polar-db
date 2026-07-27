import MovieCard from '../MovieCard/MovieCard';
import './MovieGrid.scss';

function MovieGrid({ movies }) {
  return (
    <div className="movieGrid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

export default MovieGrid;
