import { useEffect, useState } from 'react';
import chevronUpIcon from '../../assets/icons/chevron-up-icon.svg';
import chevronDownIcon from '../../assets/icons/chevron-down-icon.svg';
import './ScrollButton.scss';

const SCROLL_DURATION = 700; // ms, how long the scroll animation takes

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
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    handleScroll(); // set the correct state right away, don't wait for a scroll event
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (hasScrolled) {
      smoothScrollTo(0, SCROLL_DURATION);
    } else {
      smoothScrollTo(window.innerHeight, SCROLL_DURATION);
    }
  };

  // Pages without a hero have no "scroll down" state to hint at -- only
  // show the button once the user has actually scrolled, and only ever
  // as a scroll-to-top control.
  if (!hasHero && !hasScrolled) {
    return null;
  }

  return (
    <button
      type="button"
      className={'scrollButton ' + (hasBottomBar ? 'scrollButton--raised' : '')}
      aria-label={hasScrolled ? 'Scroll to top' : 'Scroll down'}
      onClick={handleClick}
    >
      <img
        src={hasScrolled ? chevronUpIcon : chevronDownIcon}
        alt=""
        className="scrollButton__icon"
      />
    </button>
  );
}

export default ScrollButton;
