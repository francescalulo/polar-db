import './ArtistCard.scss';

function ArtistCard({ actor }) {
  // TODO: Replace with the team's placeholder image once it has been added.
  const profileImage = actor.profilePath
    ? `https://image.tmdb.org/t/p/w500${actor.profilePath}`
    : '';

  return (
    <article className="artistCard">
      <img
        className="artistCard__image"
        src={profileImage}
        alt={actor.name}
      />

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