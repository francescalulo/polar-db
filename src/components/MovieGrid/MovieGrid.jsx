import MovieCard from '../MovieCard/MovieCard';
import './MovieGrid.scss';

function MovieGrid({ movies, onRemove, children }) {
  return (
    <div className="movieGrid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onRemove={onRemove} />
      ))}
      {children}
    </div>
  );
}

export default MovieGrid;
