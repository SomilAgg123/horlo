import { Check, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { imagePath, type Watch } from '../data/catalogue';
import { useDemo } from '../state/DemoProvider';

export function WatchCard({ watch, readOnly = false }: { watch: Watch; readOnly?: boolean }) {
  const { state, toggleWatch } = useDemo();
  const collected = state.collectionIds.includes(watch.id);
  return (
    <article className="watch-card">
      <div
        className="watch-image-wrap"
        style={{ '--watch-color': watch.color } as React.CSSProperties}
      >
        <span className="category-label">{watch.category}</span>
        {!readOnly && (
          <button
            className={`collect-button ${collected ? 'collected' : ''}`}
            onClick={() => toggleWatch(watch.id)}
            aria-label={`${collected ? 'Remove' : 'Add'} ${watch.brand} ${watch.model} ${collected ? 'from' : 'to'} collection`}
            aria-pressed={collected}
            title={collected ? 'In your collection' : 'Add to collection'}
          >
            {collected ? <Check size={18} /> : <Plus size={18} />}
          </button>
        )}
        <Link
          to={`/watch/${watch.id}`}
          className="watch-image-link"
          tabIndex={-1}
          aria-hidden="true"
        >
          <img src={imagePath(watch.image)} alt="" loading="lazy" />
        </Link>
      </div>
      <div className="watch-card-body">
        <span className="eyebrow brand-name">{watch.brand}</span>
        <h3>
          <Link to={`/watch/${watch.id}`}>{watch.model}</Link>
        </h3>
        <span className="reference">Ref. {watch.reference || 'Your own reference'}</span>
        <div className="watch-card-specs">
          <span>{watch.caseSizeLabel || `${watch.diameter} mm`}</span>
          <span className="spec-dot" />
          <span>{watch.movement}</span>
        </div>
      </div>
    </article>
  );
}
