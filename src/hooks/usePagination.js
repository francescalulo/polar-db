import { useState } from 'react';

// Shared "page / totalPages / load more" state and logic for the two
// paginated movie lists (Home's category tabs, SearchResults' results).
// Each page still owns its own initial fetch (SearchResults needs its own
// AbortController, Home doesn't) - this only covers the load-more part,
// which was identical in both.
export function usePagination() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Call from the initial-fetch effect once results come back (or on
  // error/empty-query, passing []).
  const setInitialResults = (data) => {
    setMovies(data);
    setTotalPages(data.totalPages || 0);
    setPage(1);
  };

  // Call from the Load More button, passing a function that fetches a
  // given page number.
  const loadMore = async (fetchPage) => {
    const nextPage = page + 1;
    setIsLoadingMore(true);

    try {
      const data = await fetchPage(nextPage);
      setMovies((prev) => [...prev, ...data]);
      setTotalPages(data.totalPages || 0);
      setPage(nextPage);
    } catch (err) {
      console.error('Failed to load more movies:', err.message);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const hasMore = page < totalPages;

  return {
    movies,
    setMovies,
    isLoadingMore,
    hasMore,
    setInitialResults,
    loadMore,
  };
}
