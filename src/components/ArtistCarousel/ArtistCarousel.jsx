import { useEffect, useRef, useState } from 'react';

import ArtistCard from '../ArtistCard/ArtistCard';

import backIcon from '../../assets/icons/back-icon-outline.svg';
import nextIcon from '../../assets/icons/next-icon-outline.svg';

import './ArtistCarousel.scss';

function ArtistCarousel({ cast = [] }) {
  const carouselRef = useRef(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Limit the carousel so the cast list does not become endless.
  const displayedCast = cast.slice(0, 8);

  const updateScrollState = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollPrevious(el.scrollLeft > 0);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    updateScrollState();

    el.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [displayedCast.length]);

  const handlePrevious = () => {
    carouselRef.current?.scrollBy({
      left: -carouselRef.current.clientWidth,
      behavior: 'smooth',
    });
  };

  const handleNext = () => {
    carouselRef.current?.scrollBy({
      left: carouselRef.current.clientWidth,
      behavior: 'smooth',
    });
  };

  // Do not show the cast section when no cast data is available.
  if (displayedCast.length === 0) {
    return null;
  }

  return (
    <section className="artistCarousel" aria-labelledby="cast-heading">
      <h2 id="cast-heading" className="artistCarousel__title">
        Cast
      </h2>

      <div className="artistCarousel__content">
        {canScrollPrevious && (
          <button
            className="artistCarousel__button artistCarousel__button--previous"
            type="button"
            aria-label="View previous cast members"
            onClick={handlePrevious}
          >
            <img src={backIcon} alt="" />
          </button>
        )}

        <div ref={carouselRef} className="artistCarousel__list">
          {displayedCast.map((actor, index) => (
            <div
              key={actor.creditId || actor.id}
              className={
                index >= 6
                  ? 'artistCarousel__item artistCarousel__item--largerScreens'
                  : 'artistCarousel__item'
              }
            >
              <ArtistCard actor={actor} />
            </div>
          ))}
        </div>

        {canScrollNext && (
          <button
            className="artistCarousel__button artistCarousel__button--next"
            type="button"
            aria-label="View next cast members"
            onClick={handleNext}
          >
            <img src={nextIcon} alt="" />
          </button>
        )}
      </div>
    </section>
  );
}

export default ArtistCarousel;
