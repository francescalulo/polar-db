import { useEffect, useRef, useState } from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import MoreInfoButton from '../MoreInfoButton/MoreInfoButton';
import BookmarkButton from '../BookmarkButton/BookmarkButton';
import './HeroCarousel.scss';

const AUTO_ADVANCE_DELAY = 8000; // ms between auto-advances
const CLICK_TRANSITION_DURATION = 600; // ms, clicking a dash
const AUTO_TRANSITION_DURATION = 1000; // ms, auto-advance
const DRAG_TRANSITION_DURATION = 1000; // ms, drag or scroll
const DRAG_THRESHOLD = 50; // px — how far you need to drag before it counts
const WHEEL_THRESHOLD = 10; // minimum horizontal scroll before it counts
const WHEEL_COOLDOWN = DRAG_TRANSITION_DURATION + 200; // ms to ignore extra wheel events after one triggers

function HeroCarousel({ movies }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [transitionDuration, setTransitionDuration] = useState(
    CLICK_TRANSITION_DURATION,
  );
  const [transitionEasing, setTransitionEasing] = useState('ease');

  const dragStartX = useRef(null);
  const wheelCooldown = useRef(false);
  const movie = movies[currentIndex];
  const isMobile = useIsMobile();
  const heroImage = isMobile ? movie.poster : movie.backdrop;

  // Move to a specific slide by index. duration is split in half: half to
  // fade the current slide out, half to fade the next one in — so the whole
  // transition takes `duration` ms as long as the next slide's image is
  // already loaded. If it isn't, the fade-in waits for the image before
  // swapping, so the backdrop is never shown blank or stale.
  const goToSlide = (targetIndex, duration, easing = 'ease') => {
    if (targetIndex === currentIndex) {
      return;
    }

    setTransitionDuration(duration / 2);
    setTransitionEasing(easing);
    setIsVisible(false);

    const nextMovie = movies[targetIndex];
    const nextImage = isMobile ? nextMovie.poster : nextMovie.backdrop;
    const preloadImage = new Image();
    preloadImage.src = nextImage;

    const swapAndFadeIn = () => {
      setCurrentIndex(targetIndex);
      setIsVisible(true);
    };

    setTimeout(() => {
      if (preloadImage.complete) {
        // already loaded (e.g. cached from a previous cycle) — swap right away
        swapAndFadeIn();
      } else {
        // wait for it to finish loading before swapping, so the backdrop
        // never lags behind the text
        preloadImage.onload = swapAndFadeIn;
        preloadImage.onerror = swapAndFadeIn; // don't get stuck if it fails to load
      }
    }, duration / 2);
  };

  const goToNext = (duration, easing = 'ease') => {
    goToSlide((currentIndex + 1) % movies.length, duration, easing);
  };

  const goToPrevious = (duration, easing = 'ease') => {
    goToSlide(
      (currentIndex - 1 + movies.length) % movies.length,
      duration,
      easing,
    );
  };

  // Auto-advance every 8 seconds; resets whenever the slide changes,
  // whether that change came from the timer, a click, a drag, or a scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      goToNext(AUTO_TRANSITION_DURATION);
    }, AUTO_ADVANCE_DELAY);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Clicking a dash jumps straight to that slide
  const handleDashClick = (index) => {
    goToSlide(index, CLICK_TRANSITION_DURATION);
  };

  const handlePointerDown = (e) => {
    dragStartX.current = e.clientX;
  };

  const handlePointerUp = (e) => {
    if (dragStartX.current === null) {
      return;
    }

    const deltaX = e.clientX - dragStartX.current;
    dragStartX.current = null;

    if (Math.abs(deltaX) < DRAG_THRESHOLD) {
      return;
    }

    if (deltaX < 0) {
      // dragged left → next
      goToNext(DRAG_TRANSITION_DURATION, 'ease-out');
    } else {
      // dragged right → previous
      goToPrevious(DRAG_TRANSITION_DURATION, 'ease-out');
    }
  };

  const handleWheel = (e) => {
    if (wheelCooldown.current || Math.abs(e.deltaX) < WHEEL_THRESHOLD) {
      return;
    }

    wheelCooldown.current = true;

    if (e.deltaX < 0) {
      // scrolled left → next
      goToNext(DRAG_TRANSITION_DURATION, 'ease-out');
    } else {
      // scrolled right → previous
      goToPrevious(DRAG_TRANSITION_DURATION, 'ease-out');
    }

    setTimeout(() => {
      wheelCooldown.current = false;
    }, WHEEL_COOLDOWN);
  };

  return (
    <section
      className="hero"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      style={{
        '--hero-transition-duration': transitionDuration + 'ms',
        '--hero-transition-easing': transitionEasing,
      }}
    >
      <div
        className={
          'hero__content ' + (isVisible ? 'hero__content--visible' : '')
        }
      >
        <img className="hero__image" src={heroImage} alt="" />
        <div className="hero__overlay" />

        <div className="hero__card">
          <div className="hero__info">
            <div className="hero__titleGroup">
              <h2 className="hero__title">
                {movie.title} ({movie.year})
              </h2>
              <p className="hero__genre">{movie.genres.join(', ')}</p>
            </div>

            <div className="hero__details">
              <span className="hero__rating">★ {movie.rating}%</span>
              <span className="hero__dot" />
              <span>{movie.certification}</span>
              <span className="hero__dot" />
              <span>{movie.runtime}</span>
            </div>

            <p className="hero__synopsis">{movie.synopsis}</p>
          </div>

          <div className="hero__actions">
            <MoreInfoButton movieId={movie.id} className="hero__moreInfo" />
            <BookmarkButton
              movie={movie}
              showLabel
              className="hero__watchlist"
            />
          </div>
        </div>
      </div>

      <div className="hero__pagination">
        {movies.map((_, i) => (
          <button
            key={i}
            type="button"
            className={
              i === currentIndex
                ? 'hero__dash hero__dash--active'
                : 'hero__dash'
            }
            aria-label={'Go to slide ' + (i + 1)}
            onClick={() => handleDashClick(i)}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroCarousel;
