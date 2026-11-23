import { Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';

export default function About() {
  return (
    <div className="about-page">
      <h1>About Horlo</h1>
      <p className="about-intro">A watch collection app and interactive portfolio demo.</p>
      <div className="about-grid">
        <article>
          <h2>Local storage</h2>
          <p>
            Your collection, photos, and profile stay in this browser. Resetting the demo or
            clearing browser data removes them. No account is needed.
          </p>
        </article>
        <article>
          <h2>Sample catalogue</h2>
          <p>
            Original watch illustrations with specifications sourced from the manufacturers. An
            independent project, unaffiliated with the featured brands.
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
    </div>
  );
}
