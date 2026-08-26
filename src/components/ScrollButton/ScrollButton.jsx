import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../utils/prefersReducedMotion';
import useIsMobile from '../../hooks/useIsMobile';
import chevronUpIcon from '../../assets/icons/chevron-up-icon.svg';
import chevronDownIcon from '../../assets/icons/chevron-down-icon.svg';
import './ScrollButton.scss';

const SCROLL_DURATION = 1100; // ms, how long the scroll animation takes
const IDLE_DELAY = 2500; // ms of no scrolling before the text label reveals

// Smooth ease-in-out curve so the scroll starts and ends gently instead of
// snapping at a constant speed.
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Custom smooth-scroll with an explicit duration, since the native
// `behavior: 'smooth'` option gives no control over speed and can feel
// like an abrupt jump for longer distances.
function smoothScrollTo(targetY, duration) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    window.scrollTo(0, startY + distance * easeInOutQuad(progress));

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function ScrollButton({ hasHero = true, hasBottomBar = false }) {
  const isMobile = useIsMobile(); // below tablet breakpoint (768px)
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const idleTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);

      // Reveal the text label once scrolling has paused for a bit, so the
      // button doesn't rely on the icon alone to be noticed.
      setIsIdle(false);
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setIsIdle(true), IDLE_DELAY);
    };

    handleScroll(); // set the correct state right away, don't wait for a scroll event
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(idleTimer.current);
    };
  }, []);

  const handleClick = () => {
    const targetY = hasScrolled ? 0 : window.innerHeight;

    if (prefersReducedMotion()) {
      window.scrollTo(0, targetY); // instant jump, no animation
    } else {
      smoothScrollTo(targetY, SCROLL_DURATION);
    }
  };

  // Only hero pages ever show a "scroll down" hint at all - pages
  // without a hero are always up-only. So mobile suppression only needs
  // to apply on the hero pages themselves.
  const suppressDownHint = hasHero ? isMobile : true;

  if (suppressDownHint && !hasScrolled) {
    return null;
  }

  // Kept identical to the aria-label so the visible text always matches
  // the accessible name (WCAG 2.5.3, Label in Name).
  const label = hasScrolled ? 'Scroll to top' : 'Scroll down';

  return (
    <button
      type="button"
      className={
        'scrollButton ' +
        (hasBottomBar ? 'scrollButton--raised ' : '') +
        (isIdle ? 'scrollButton--idle' : '')
      }
      aria-label={label}
      onClick={handleClick}
    >
      <span className="scrollButton__label" aria-hidden="true">
        {label}
      </span>
      <img
        src={hasScrolled ? chevronUpIcon : chevronDownIcon}
        alt=""
        className="scrollButton__icon"
      />
    </button>
  );
}

export default ScrollButton;
