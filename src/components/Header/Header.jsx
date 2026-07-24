import wordmark from '../../assets/polar-wordmark.svg';
import searchIcon from '../../assets/icons/search-icon-outline.svg';
import bookmarkOutline from '../../assets/icons/bookmark-icon-outline.svg';
import aboutOutline from '../../assets/icons/about-icon-outline.svg';
import './Header.scss';

function Header({ activePage }) {
  return (
    <header className="header">
      <div className="header__bar">
        {/* TODO (Day 6): swap for React Router <Link to="/"> once routing is wired up */}
        <a href="/" className="header__logo">
          <img src={wordmark} alt="Polar+DB home" />
        </a>

        <div className="header__search">
          <input type="text" placeholder="Search" aria-label="Search movies" />
          <img src={searchIcon} alt="" />
        </div>

        <nav className="header__nav" aria-label="Primary">
          {/* TODO (Day 6): swap hrefs for React Router <Link> once routes exist */}
          <a
            href="#"
            className="header__navLink"
            aria-current={activePage === 'watchlist' ? 'page' : undefined}
          >
            <img src={bookmarkOutline} alt="" />
            <span>My Watchlist</span>
          </a>
          <a
            href="#"
            className="header__navLink"
            aria-current={activePage === 'about' ? 'page' : undefined}
          >
            <img src={aboutOutline} alt="" />
            <span>About</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
