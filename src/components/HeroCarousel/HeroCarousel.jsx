import MoreInfoButton from '../MoreInfoButton/MoreInfoButton';
import BookmarkButton from '../BookmarkButton/BookmarkButton';
import './HeroCarousel.scss';

function HeroCarousel({ movie }) {
  return (
    <section className="hero">
      <img className="hero__image" src={movie.backdrop} alt="" />
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
          <MoreInfoButton className="hero__moreInfo" />
          <BookmarkButton movie={movie} />
        </div>
      </div>

      <div className="hero__pagination">
        {[0, 1, 2, 3, 4].map((i) => (
          <button
            key={i}
            type="button"
            className={i === 0 ? 'hero__dash hero__dash--active' : 'hero__dash'}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroCarousel;
