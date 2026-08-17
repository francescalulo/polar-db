import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logoMark from '../../assets/icons/favicon.svg';
import wordmark from '../../assets/polar-wordmark.svg';
import bookmarkIcon from '../../assets/icons/bookmark-icon-outline.svg';
import aboutIcon from '../../assets/icons/about-icon-outline.svg';
import searchIcon from '../../assets/icons/search-icon-outline.svg';
import './Header.scss';

function Header() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate('/search?q=' + encodeURIComponent(query.trim()));
  };

  const handleClearSearch = () => {
    setQuery('');
  };

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
            placeholder="Search"
            className="header__searchInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
            <img src={searchIcon} alt="" className="header__searchIcon" />
          </button>
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
