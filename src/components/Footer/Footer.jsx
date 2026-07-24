import wordmark from '../../assets/polar-wordmark.svg';
import './Footer.scss';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <img src={wordmark} alt="Polar+DB" className="footer__logo" />
          <p className="footer__tagline">Find your next film by the light of the northern sky.</p>
        </div>

        {/* TODO (Day 6): swap hrefs for React Router <Link> once routes exist */}
        <nav className="footer__nav" aria-label="Footer">
          <a href="/">Home</a>
          <a href="#">My Watchlist</a>
          <a href="#">About</a>
        </nav>
      </div>

      <hr className="footer__divider" />

      <p className="footer__copyright">&copy; 2026 FWD44 | For Educational Purposes Only</p>
    </footer>
  );
}

export default Footer;
