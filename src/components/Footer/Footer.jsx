import { Link, NavLink } from 'react-router-dom';
import wordmark from '../../assets/polar-wordmark.svg';
import './Footer.scss';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <Link to="/" className="footer__brand" aria-label="Polar DB Home">
            <img src={wordmark} alt="Polar+DB" className="footer__logo" />
            <p className="footer__tagline">
              Find your next film by the <span>light of the northern sky.</span>
            </p>
          </Link>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/watchlist">My Watchlist</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </div>

      <hr className="footer__divider" />

      <p className="footer__copyright">
        &copy; 2026 Movie App | Frances, Sara, and Talia
      </p>
    </footer>
  );
}

export default Footer;
