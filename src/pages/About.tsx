import { Link } from 'react-router-dom';
import { Code2, Watch, HardDrive, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="about-page">
      <p className="eyebrow accent">A PERSONAL PROJECT</p>
      <h1>
        A little obsession.
        <br />
        An open project.
      </h1>
      <p className="about-intro">
        Horlo is a space for the watches you love and the collection you’re making your own.
      </p>
      <div className="about-grid">
        <article>
          <Watch />
          <h2>Built to explore</h2>
          <p>
            Browse a considered selection of watches, dive into the details, and save your
            favourites. This is an interactive portfolio demo, not a shop.
          </p>
        </article>
        <article>
          <HardDrive />
          <h2>Yours, locally</h2>
          <p>
            Your collection stays in this browser. There are no accounts or backend services.
            Clearing browser data or resetting the demo removes your changes.
          </p>
        </article>
        <article>
          <Heart />
          <h2>Made with care</h2>
          <p>
            A new chapter for an earlier React and FastAPI project. Original watch illustrations, a
            smaller architecture, and a love for the details.
          </p>
        </article>
      </div>
      <div className="about-actions">
        <a
          href="https://github.com/SomilAgg123/horlo"
          target="_blank"
          rel="noreferrer"
          className="button button-dark"
        >
          <Code2 size={18} /> View the source
        </a>
        <Link to="/" className="button button-light">
          Explore Horlo
        </Link>
      </div>
      <p className="catalogue-note">
        Independent personal project. Watch brands belong to their respective owners. No affiliation
        or endorsement is implied.
      </p>
    </div>
  );
}
