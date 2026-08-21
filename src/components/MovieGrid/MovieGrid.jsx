import MovieCard from '../MovieCard/MovieCard';
import './MovieGrid.scss';

function MovieGrid({ movies, children }) {
  return (
    <div className="movieGrid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
      {children}
    </div>
  );
}

export default MovieGrid;
