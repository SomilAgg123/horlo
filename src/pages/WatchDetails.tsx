import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Check,
  Plus,
  ChevronRight,
  ExternalLink,
  ScanSearch,
  Watch as WatchIcon,
} from 'lucide-react';
import { imagePath } from '../data/catalogue';
import { useDemo } from '../state/DemoProvider';
import { WatchCard } from '../components/WatchCard';

export default function WatchDetails() {
  const { id } = useParams();
  const { watches, state, toggleWatch } = useDemo();
  const [zoomed, setZoomed] = useState(false);
  const watch = watches.find((item) => item.id === id);
  if (!watch)
    return (
      <div className="empty-state">
        <WatchIcon size={40} />
        <h1>Watch not found</h1>
        <p>This piece may have been removed when the demo was reset.</p>
        <Link className="button button-dark" to="/">
          Explore the catalogue
        </Link>
      </div>
    );
  const collected = state.collectionIds.includes(watch.id);
  return (
    <>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link to="/">Discover</Link>
        <ChevronRight size={14} />
        <span>{watch.brand}</span>
        <ChevronRight size={14} />
        <span>{watch.model}</span>
      </nav>
      <div className="detail-layout">
        <div>
          <div className={`detail-image ${zoomed ? 'zoomed' : ''}`}>
            <span className="category-label">{watch.category}</span>
            <img
              src={imagePath(watch.image)}
              alt={`${watch.brand} ${watch.model}${watch.id.startsWith('custom-') ? '' : ' — original illustration'}`}
            />
            <button
              className="zoom-button"
              onClick={() => setZoomed(!zoomed)}
              aria-pressed={zoomed}
            >
              <ScanSearch size={18} />
              {zoomed ? 'Full view' : 'Dial detail'}
            </button>
          </div>
          <p className="image-caption">
            {watch.id.startsWith('custom-')
              ? 'Your personal timepiece'
              : 'Original illustration · Product proportions are illustrative'}
          </p>
        </div>
        <section className="detail-copy">
          <p className="eyebrow accent">{watch.brand}</p>
          <h1>{watch.model}</h1>
          <p className="reference">REFERENCE {watch.reference || 'CUSTOM WATCH'}</p>
          <p className="detail-description">
            {watch.description ||
              'A piece with a story of its own. Part of your personal collection.'}
          </p>
          <dl className="spec-table">
            {[
              ['Movement', watch.movement],
              ['Case size', watch.caseSizeLabel || `${watch.diameter} mm`],
              ['Case material', watch.material || 'Not specified'],
              ['Water resistance', watch.waterResistanceLabel || `${watch.waterResistance} m`],
              ['Dial', watch.dial || 'Not specified'],
              ['Style', watch.category],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <button
            className={`button button-wide ${collected ? 'button-saved' : 'button-dark'}`}
            onClick={() => toggleWatch(watch.id)}
          >
            {collected ? <Check size={18} /> : <Plus size={18} />}
            {collected ? 'In your collection · Remove' : 'Add to my collection'}
          </button>
          <p className="detail-help">A collection for the love of it. Nothing here is for sale.</p>
          {watch.source && (
            <a
              className="text-link manufacturer-link"
              href={watch.source}
              target="_blank"
              rel="noreferrer"
            >
              Explore at {watch.brand}
              <ExternalLink size={14} />
            </a>
          )}
        </section>
      </div>
      <section className="related-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow muted">KEEP EXPLORING</p>
            <h2>Another kind of character</h2>
          </div>
        </div>
        <div className="watch-grid">
          {watches
            .filter((item) => item.id !== watch.id && !item.id.startsWith('custom-'))
            .slice(0, 3)
            .map((item) => (
              <WatchCard watch={item} key={item.id} />
            ))}
        </div>
      </section>
    </>
  );
}
