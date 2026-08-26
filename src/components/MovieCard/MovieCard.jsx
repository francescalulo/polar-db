import { useEffect, useRef, useState } from 'react';
import { formatRating } from '../../utils/formatRating';

import useIsMobile from '../../hooks/useIsMobile';
import MoreInfoButton from '../MoreInfoButton/MoreInfoButton';
import BookmarkButton from '../BookmarkButton/BookmarkButton';
import ShareButton from '../ShareButton/ShareButton';
import ratingIcon from '../../assets/icons/ratings.svg';
import posterFallback from '../../assets/fallbacks/poster-fallback.png';

import './MovieCard.scss';

function MovieCard({ movie }) {
  const [isActive, setIsActive] = useState(false);
  const cardRef = useRef(null);
  const isBelowDesktop = useIsMobile(1024); // tablet + mobile tap to reveal; desktop keeps hover
  const isMobile = useIsMobile(768); // mobile gets a shorter genre list than tablet/desktop
  const genreLimit = isMobile ? 2 : 3;

  const handleCardClick = (e) => {
    if (!isBelowDesktop) return; // desktop relies on hover, not tap
    if (e.target.closest('a, button')) return; // let links/buttons handle their own click

    setIsActive((prev) => !prev);
  };

  useEffect(() => {
    if (!isActive) return;

    const handleOutsideClick = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setIsActive(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
    };
  }, [isActive]);

  return (
    <div
      className={'movieCard ' + (isActive ? 'movieCard--active' : '')}
      ref={cardRef}
      onClick={handleCardClick}
    >
      <img
        className="movieCard__poster"
        src={movie.poster_path || posterFallback}
        alt={movie.title}
      />
      <div className="movieCard__vignette" />

      <div className="movieCard__details">
        <div className="movieCard__overlay" />

        <div className="movieCard__info">
          <div className="movieCard__titleGroup">
            <h2 className="movieCard__title">{movie.title}</h2>

            <p className="movieCard__genre">
              {movie.genres?.slice(0, genreLimit).join(', ') ||
                'Genre unavailable'}
            </p>
          </div>

          <p className="movieCard__date">Release Date: {movie.release_date}</p>

          <p className="movieCard__overview">
            {movie.overview || 'No overview available.'}
          </p>
        </div>

        <MoreInfoButton movieId={movie.id} className="movieCard__moreInfo" />
      </div>

      <div className="movieCard__topRow">
        <div
          className="movieCard__rating"
          aria-label={'User Score: ' + formatRating(movie.vote_average)}
        >
          <img src={ratingIcon} alt="" className="movieCard__ratingIcon" />
          <span className="movieCard__ratingValue">
            {formatRating(movie.vote_average)}
          </span>
        </div>

        <BookmarkButton movie={movie} className="movieCard__bookmark" />
      </div>

      <ShareButton movie={movie} className="movieCard__share" />
    </div>
  );
}

export default MovieCard;
