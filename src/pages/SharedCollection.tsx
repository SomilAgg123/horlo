import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, MapPin } from 'lucide-react';
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
      </div>
      <div className="section-heading">
        <div>
          <h2>
            Collection<span className="count-badge">{sample.length}</span>
          </h2>
        </div>
      </div>
      <div className="watch-grid">
        {sample.map((watch) => (
          <WatchCard watch={watch} readOnly key={watch.id} />
        ))}
      </div>
      <div className="shared-note">
        <p>This is a fixed example. Your collection stays in this browser.</p>
        <Link className="text-link" to="/collection">
          My collection
        </Link>
      </div>
    </>
  );
}
