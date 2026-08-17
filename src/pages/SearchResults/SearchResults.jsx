import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieGrid from '../../components/MovieGrid/MovieGrid';
import { searchMovies } from '../../services/movies';
import './SearchResults.scss';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = query
      ? 'Polar DB | Search: ' + query
      : 'Polar DB | Search';
  }, [query]);

  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await searchMovies(query);
        setMovies(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setMovies([]);
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="searchResults content-width">
      <h1 className="searchResults__title">
        {query ? 'Results for “' + query + '”' : 'Search'}
      </h1>

      {isLoading && <p className="searchResults__status">Searching…</p>}
      {error && (
        <p className="searchResults__status">Couldn't load results: {error}</p>
      )}
      {!isLoading && !error && query && movies.length === 0 && (
        <p className="searchResults__status">No movies found for “{query}”.</p>
      )}
      {!isLoading && !error && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} />
          <p className="searchResults__end">
            You've reached the end of the search results.
          </p>
        </>
      )}
    </div>
  );
}

export default SearchResults;
