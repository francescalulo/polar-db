import artistFallback from '../../assets/fallbacks/artist-fallback.png';
import './ArtistCard.scss';

function ArtistCard({ actor }) {
  const profileImage = actor.profilePath
    ? 'https://image.tmdb.org/t/p/w500' + actor.profilePath
    : artistFallback;

  return (
    <article className="artistCard">
      <img className="artistCard__image" src={profileImage} alt={actor.name} />

      <div className="artistCard__info">
        <h3 className="artistCard__name">{actor.name}</h3>

        <p className="artistCard__character">
          {actor.character || 'Character unavailable'}
        </p>
      </div>
    </article>
  );
}

export default ArtistCard;
