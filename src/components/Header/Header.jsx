import { Link } from 'react-router-dom';
import logoMark from '../../assets/icons/favicon.svg';
import wordmark from '../../assets/polar-wordmark.svg';
import bookmarkIcon from '../../assets/icons/bookmark-icon-outline.svg';
import aboutIcon from '../../assets/icons/about-icon-outline.svg';
import searchIcon from '../../assets/icons/search-icon-outline.svg';
import './Header.scss';

function Header() {
  return (
    <header className="header">
      <Link to="/" className="header__logo" aria-label="Polar DB Home">
        <img src={logoMark} alt="" className="header__logoMark" />
        <img src={wordmark} alt="" className="header__logoWordmark" />
      </Link>

      <div className="header__search">
        <input
          type="search"
          placeholder="Search"
          className="header__searchInput"
        />
        <img src={searchIcon} alt="" className="header__searchIcon" />
      </div>

      <nav className="header__nav" aria-label="Primary">
        <Link
          to="/watchlist"
          className="header__navLink"
          aria-label="My Watchlist"
        >
          <img src={bookmarkIcon} alt="" />
          <span className="header__navLabel">My Watchlist</span>
        </Link>
        <Link to="/about" className="header__navLink" aria-label="About">
          <img src={aboutIcon} alt="" />
          <span className="header__navLabel">About</span>
        </Link>
      </nav>
    </header>
  );
}

export default Header;
