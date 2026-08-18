import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logoMark from '../../assets/icons/favicon.svg';
import wordmark from '../../assets/polar-wordmark.svg';
import bookmarkIcon from '../../assets/icons/bookmark-icon-outline.svg';
import aboutIcon from '../../assets/icons/about-icon-outline.svg';
import searchIcon from '../../assets/icons/search-icon-outline.svg';
import searchIconFilled from '../../assets/icons/search-icon-filled.svg';
import posterFallback from '../../assets/fallbacks/poster-fallback.png';
import { searchMovies } from '../../services/movies';
import './Header.scss';

const SUGGESTION_LIMIT = 5;
const SUGGESTION_MIN_LENGTH = 2;
const SUGGESTION_DEBOUNCE_MS = 300;

function Header() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSuggestionsOpen(false);
    navigate('/search?q=' + encodeURIComponent(query.trim()));
  };

  const handleClearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsSuggestionsOpen(false);
  };

  const handleSuggestionClick = (movieId) => {
    setIsSuggestionsOpen(false);
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
              if (e.key === 'Escape') setIsSuggestionsOpen(false);
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
            <ul className="header__suggestions">
              {suggestions.map((movie) => (
                <li key={movie.id}>
                  <button
                    type="button"
                    className="header__suggestionItem"
                    onClick={() => handleSuggestionClick(movie.id)}
                  >
                    <img
                      src={movie.poster_path || posterFallback}
                      alt=""
                      className="header__suggestionPoster"
                    />
                    <span className="header__suggestionInfo">
                      <span className="header__suggestionTitle">
                        {movie.title}
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
