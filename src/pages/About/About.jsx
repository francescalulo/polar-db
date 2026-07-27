import { useEffect } from 'react';
import wordmark from '../../assets/polar-wordmark.svg';
import './About.scss';

function About() {
  useEffect(() => {
    document.title = 'Polar DB | About';

    const metaTag = document.querySelector('meta[name="description"]');
    const description =
      'Learn about Polar DB, a movie discovery app for browsing, searching, and saving your favourite films.';

    if (metaTag) {
      metaTag.setAttribute('content', description);
    } else {
      const newMetaTag = document.createElement('meta');
      newMetaTag.name = 'description';
      newMetaTag.content = description;
      document.head.appendChild(newMetaTag);
    }
  }, []);

  return (
    <>
      <div className="about">
        <section className="about__intro">
          <h1 className="about__heading">
            About <img src={wordmark} alt="Polar+DB" className="about__logo" />
          </h1>
          <p>
            PolarDB is a movie discovery platform inspired by the beauty and
            mystery of the northern lights. Just as the aurora illuminates the
            night sky, PolarDB helps users discover new stories, unforgettable
            characters, and cinematic experiences from around the world.
          </p>
          <p>
            Whether you&apos;re searching for the latest releases, upcoming
            titles, or timeless classics, PolarDB provides an intuitive space to
            explore movie details, trailers, ratings, cast information, and
            personalized watchlists. With a clean interface and immersive
            design, PolarDB makes finding your next favourite movie simple and
            enjoyable.
          </p>
          <p>
            Designed for casual viewers and dedicated movie enthusiasts alike,
            PolarDB combines rich movie data with a modern
            northern-lights-inspired aesthetic to create a seamless movie
            exploration experience.
          </p>
        </section>

        <section className="about__info">
          <h2 className="about__infoHeading">General Info</h2>

          <div className="about__infoItem">
            <h3>Movie Data</h3>
            <p>
              Movie information, ratings, release dates, and artwork are
              provided through the TMDb API.
            </p>
          </div>

          <div className="about__infoItem">
            <h3>Watchlists</h3>
            <p>
              Users can save movies to their personal watchlist to keep track of
              films they want to watch in the future.
            </p>
          </div>

          <div className="about__infoItem">
            <h3>Search &amp; Discovery</h3>
            <p>
              Browse popular, upcoming, now-playing, and top-rated movies, or
              use the search feature to quickly discover new titles and hidden
              gems.
            </p>
          </div>

          <div className="about__infoItem">
            <h3>TMDb Attribution</h3>
            <p>
              This product uses the TMDb API but is not endorsed or certified by
              TMDb.
            </p>
            {/* TODO: add the official TMDb attribution logo here, sized smaller than our app logo.
                Download from https://www.themoviedb.org/about/logos-attribution and drop into src/assets/. */}
          </div>
        </section>
      </div>
    </>
  );
}

export default About;
