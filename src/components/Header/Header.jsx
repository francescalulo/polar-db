import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { searchMovies } from '../../services/movies';

import logoMark from '../../assets/images/polar-logo.svg';
import wordmark from '../../assets/images/polar-wordmark.svg';
import bookmarkIcon from '../../assets/icons/bookmark-icon-outline.svg';
import aboutIcon from '../../assets/icons/about-icon-outline.svg';
import searchIcon from '../../assets/icons/search-icon-outline.svg';
import searchIconFilled from '../../assets/icons/search-icon-filled.svg';
import posterFallback from '../../assets/fallbacks/poster-fallback.png';

import './Header.scss';

const SUGGESTION_LIMIT = 5;
const SUGGESTION_MIN_LENGTH = 2;
const SUGGESTION_DEBOUNCE_MS = 300;

// Wraps the part of a suggestion's title that matches the typed query in a
// styled span. Falls back to the plain title untouched when there's no
// substring match at all, which happens for genre-matched suggestions
// (e.g. typing "Comedy" won't literally appear inside most comedy titles).
function highlightMatch(title, query) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return title;

  const matchIndex = title.toLowerCase().indexOf(trimmedQuery.toLowerCase());
  if (matchIndex === -1) return title;

  const before = title.slice(0, matchIndex);
  const match = title.slice(matchIndex, matchIndex + trimmedQuery.length);
  const after = title.slice(matchIndex + trimmedQuery.length);

  return (
    <>
      {before}
      <span className="header__suggestionMatch">{match}</span>
      {after}
    </>
  );
}

function Header() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSuggestionsOpen(false);

    const trimmedQuery = query.trim();
    navigate(
      trimmedQuery
        ? '/search?q=' + encodeURIComponent(trimmedQuery)
        : '/search',
    );
  };

  const handleClearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsSuggestionsOpen(false);
  };

  const handleSuggestionClick = (movieId) => {
    setIsSuggestionsOpen(false);
    setHighlightedIndex(-1);
    navigate('/movie/' + movieId);
  };

  // Debounced live suggestions as the user types, so we're not firing a
  // request on every single keystroke
  useEffect(() => {
    if (query.trim().length < SUGGESTION_MIN_LENGTH) {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
      return;
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchMovies(query, {
          signal: controller.signal,
        });
        setSuggestions(results.slice(0, SUGGESTION_LIMIT));
        setIsSuggestionsOpen(true);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Failed to load search suggestions:', err.message);
        setSuggestions([]);
        setIsSuggestionsOpen(false);
      }
    }, SUGGESTION_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  // Whenever the suggestions list itself changes (new results, cleared,
  // etc.) drop any keyboard highlight from the previous list - covers
  // every case in one place instead of resetting it at each call site
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);

  // Close the dropdown on an outside click
  useEffect(() => {
    if (!isSuggestionsOpen) return;

    const handleOutsideClick = (e) => {
      if (!e.target.closest('.header__search')) {
        setIsSuggestionsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
    };
  }, [isSuggestionsOpen]);

  // Header stays mounted across every route, so without this the search
  // bar would keep showing a stale query after navigating away from the
  // results page. Only clears on an actual route change, not while typing
  // (query changes don't touch location.pathname), and it also correctly
  // leaves the bar alone while adjusting filters/sort on the results page
  // itself, since that only changes the URL's query string, not its path.
  useEffect(() => {
    if (location.pathname !== '/search') {
      setQuery('');
      setSuggestions([]);
      setIsSuggestionsOpen(false);
    }
  }, [location.pathname]);

  return (
    <header className="header">
      <div className="header__inner content-width">
        <Link to="/" className="header__logo" aria-label="Polar DB Home">
          <img src={logoMark} alt="" className="header__logoMark" />
          <img src={wordmark} alt="" className="header__logoWordmark" />
        </Link>

        <form
          className="header__search"
          onSubmit={handleSearchSubmit}
          role="search"
        >
          <input
            type="search"
            name="search"
            aria-label="Search movies"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isSuggestionsOpen && suggestions.length > 0}
            aria-controls="header__suggestionsList"
            aria-activedescendant={
              highlightedIndex >= 0 && suggestions[highlightedIndex]
                ? 'header__suggestion-' + suggestions[highlightedIndex].id
                : undefined
            }
            placeholder={isInputFocused ? 'Search titles or genres' : 'Search'}
            className="header__searchInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsInputFocused(true);
              if (suggestions.length > 0) setIsSuggestionsOpen(true);
            }}
            onBlur={() => setIsInputFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsSuggestionsOpen(false);
                return;
              }

              if (!isSuggestionsOpen || suggestions.length === 0) return;

              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex((prev) =>
                  prev <= 0 ? suggestions.length - 1 : prev - 1,
                );
              } else if (
                e.key === 'Enter' &&
                highlightedIndex >= 0 &&
                suggestions[highlightedIndex]
              ) {
                e.preventDefault();
                handleSuggestionClick(suggestions[highlightedIndex].id);
              }
            }}
          />
          {query && (
            <button
              type="button"
              className="header__searchClear"
              aria-label="Clear search"
              onClick={handleClearSearch}
            >
              ×
            </button>
          )}
          <button
            type="submit"
            className="header__searchButton"
            aria-label="Search"
          >
            <img
              src={query ? searchIconFilled : searchIcon}
              alt=""
              className="header__searchIcon"
            />
          </button>

          {isSuggestionsOpen && suggestions.length > 0 && (
            <ul
              className="header__suggestions"
              id="header__suggestionsList"
              role="listbox"
              aria-label="Search suggestions"
            >
              {suggestions.map((movie, index) => (
                <li
                  key={movie.id}
                  id={'header__suggestion-' + movie.id}
                  role="option"
                  aria-selected={index === highlightedIndex}
                >
                  <button
                    type="button"
                    tabIndex={-1}
                    className={
                      'header__suggestionItem' +
                      (index === highlightedIndex
                        ? ' header__suggestionItem--active'
                        : '')
                    }
                    onClick={() => handleSuggestionClick(movie.id)}
                  >
                    <img
                      src={movie.poster_path || posterFallback}
                      alt=""
                      className="header__suggestionPoster"
                    />
                    <span className="header__suggestionInfo">
                      <span
                        className="header__suggestionTitle"
                        title={movie.title}
                      >
                        {highlightMatch(movie.title, query)}
                      </span>
                      <span className="header__suggestionYear">
                        {movie.release_date
                          ? movie.release_date.slice(0, 4)
                          : ''}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>

        <nav className="header__nav" aria-label="Primary">
          <NavLink
            to="/watchlist"
            className="header__navLink"
            aria-label="My Watchlist"
          >
            <img src={bookmarkIcon} alt="" />
            <span className="header__navLabel">My Watchlist</span>
          </NavLink>
          <NavLink to="/about" className="header__navLink" aria-label="About">
            <img src={aboutIcon} alt="" />
            <span className="header__navLabel">About</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
