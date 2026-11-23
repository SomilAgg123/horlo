import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, MapPin, Quote } from 'lucide-react';
import { catalogue } from '../data/catalogue';
import { WatchCard } from '../components/WatchCard';
import { useDemo } from '../state/DemoProvider';

const sampleIds = ['rolex-submariner', 'cartier-tank', 'casio-a168', 'hamilton-khaki'];

export default function SharedCollection() {
  const { notify } = useDemo();
  const [showLink, setShowLink] = useState(false);
  const sample = catalogue.filter((watch) => sampleIds.includes(watch.id));
  const url = `${window.location.origin}${window.location.pathname}#/shared/collectors-edit`;
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      notify('Example collection link copied');
    } catch {
      setShowLink(true);
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow muted">A COLLECTION IN FOCUS</p>
          <h1>The collector’s edit</h1>
        </div>
        <button className="button button-light" onClick={copyLink}>
          <Copy size={17} />
          Copy example link
        </button>
      </div>
      {showLink && (
        <label className="copy-fallback">
          Copy this example collection link
          <input readOnly value={url} onFocus={(event) => event.target.select()} />
        </label>
      )}
      <section className="editorial-cover">
        <div>
          <span className="hero-kicker">THE EVERYDAY ROTATION</span>
          <h2>
            Four watches.
            <br />A thousand occasions.
          </h2>
          <p>
            A diver for the weekend. A classic for the evening.
            <br />A reminder that a good collection is simply your collection.
          </p>
        </div>
        <span className="editorial-word">
          COLLECT
          <br />
          WITH
          <br />
          <em>CHARACTER.</em>
        </span>
      </section>
      <div className="shared-intro">
        <div className="shared-person">
          <div className="avatar">AM</div>
          <div>
            <h2>Alex Morgan</h2>
            <span>
              <MapPin size={14} />
              London, UK · Sample collector
            </span>
          </div>
        </div>
        <div className="collector-quote">
          <Quote size={21} />
          <p>“The best watch is the one you find yourself reaching for.”</p>
        </div>
      </div>
      <div className="section-heading">
        <div>
          <p className="eyebrow muted">THE COLLECTION</p>
          <h2>
            Different days. Different dials.<span className="count-badge">{sample.length}</span>
          </h2>
        </div>
      </div>
      <div className="watch-grid">
        {sample.map((watch) => (
          <WatchCard watch={watch} readOnly key={watch.id} />
        ))}
      </div>
      <div className="shared-note">
        <p>
          This is a fixed example of a public collection. Your own collection and profile remain in
          your browser.
        </p>
        <Link className="text-link" to="/collection">
          Curate your own collection
        </Link>
      </div>
    </>
  );
}
