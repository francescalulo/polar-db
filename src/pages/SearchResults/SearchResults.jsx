import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ScrollButton from '../../components/ScrollButton/ScrollButton';
import MovieGrid from '../../components/MovieGrid/MovieGrid';
import { searchMovies } from '../../services/movies';
import './SearchResults.scss';

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort') || 'relevance';
  const year = searchParams.get('year') || '';

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isGenreMatch, setIsGenreMatch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = query
      ? 'Polar DB | Search: ' + query
      : 'Polar DB | Search';

    const metaTag = document.querySelector('meta[name="description"]');
    const description = query
      ? 'Search results for "' + query + '" on Polar DB.'
      : 'Search for movies by title, genre, or year on Polar DB.';

    if (metaTag) {
      metaTag.setAttribute('content', description);
    } else {
      const newMetaTag = document.createElement('meta');
      newMetaTag.name = 'description';
      newMetaTag.content = description;
      document.head.appendChild(newMetaTag);
    }
  }, [query]);

  // Runs on the query itself or any filter change, and always resets back
  // to page 1 -- "load more" below is the only thing allowed to advance it
  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      setTotalPages(0);
      setIsGenreMatch(false);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await searchMovies(query, {
          sortBy,
          primaryReleaseYear: year,
          signal: controller.signal,
        });
        setMovies(data);
        setTotalPages(data.totalPages || 0);
        setIsGenreMatch(Boolean(data.isGenreMatch));
        setPage(1);
        setIsLoading(false);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setMovies([]);
        setTotalPages(0);
        setIsGenreMatch(false);
        setIsLoading(false);
      }
    };

    fetchResults();

    return () => controller.abort();
  }, [query, sortBy, year]);

  const handleSortChange = (e) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('sort', e.target.value);
    setSearchParams(nextParams);
  };

  const handleYearChange = (e) => {
    const nextParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      nextParams.set('year', e.target.value);
    } else {
      nextParams.delete('year');
    }
    setSearchParams(nextParams);
  };

  const hasActiveFilters = sortBy !== 'relevance' || Boolean(year);

  const handleClearFilters = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('sort');
    nextParams.delete('year');
    setSearchParams(nextParams);
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setIsLoadingMore(true);

    try {
      const data = await searchMovies(query, {
        page: nextPage,
        sortBy,
        primaryReleaseYear: year,
      });
      setMovies((prev) => [...prev, ...data]);
      setTotalPages(data.totalPages || 0);
      setPage(nextPage);
    } catch (err) {
      console.error('Failed to load more results:', err.message);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const hasMore = page < totalPages;
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, index) => currentYear - index,
  );

  return (
    <div className="searchResults content-width">
      <ScrollButton hasHero={false} />
      <div className="searchResults__inner">
        <h1 className="searchResults__title">
          {query ? (
            <>
              Results for “<span className="searchResults__query">{query}</span>
              ”
            </>
          ) : (
            'Search'
          )}
        </h1>

        {!query && (
          <div className="searchResults__prompt">
            <p className="searchResults__promptHeading">
              The northern sky is waiting.
            </p>
            <p className="searchResults__promptText">
              Type a title or genre above to find your next watch.
            </p>
          </div>
        )}

        {query && (
          <div className="searchResults__filters">
            <label className="searchResults__filterLabel">
              Sort by
              <select
                className="searchResults__sortSelect"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="newest">Newest First</option>
              </select>
            </label>

            <label className="searchResults__filterLabel">
              Year
              <select
                className="searchResults__yearSelect"
                value={year}
                onChange={handleYearChange}
              >
                <option value="">All Years</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>

            {hasActiveFilters && (
              <button
                type="button"
                className="searchResults__clearFilters"
                onClick={handleClearFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {!isLoading && !error && isGenreMatch && (
          <p className="searchResults__genreNote">
            Showing movies in the “
            <span className="searchResults__query">{query}</span>” genre.
          </p>
        )}

        <div aria-live="polite" aria-atomic="true">
          {isLoading && <p className="searchResults__status">Searching…</p>}
          {error && (
            <p className="searchResults__status">
              Couldn't load results: {error}
            </p>
          )}
          {!isLoading && !error && query && movies.length === 0 && (
            <div className="searchResults__status">
              <p className="searchResults__statusHeading">
                No lights on the horizon for “
                <span className="searchResults__query">{query}</span>”.
              </p>
              <p className="searchResults__statusText">
                Try a different title or genre to find your next watch.
              </p>
            </div>
          )}
        </div>
        {!isLoading && !error && movies.length > 0 && (
          <>
            <MovieGrid movies={movies} />

            {hasMore && (
              <button
                type="button"
                className="searchResults__loadMore"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? 'Loading…' : 'Load More'}
              </button>
            )}

            {!hasMore && (
              <div className="searchResults__end">
                <p className="searchResults__endHeading">
                  You've reached the edge of the northern sky.
                </p>
                <p className="searchResults__endText">
                  That's everything we found for “
                  <span className="searchResults__query">{query}</span>”.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
