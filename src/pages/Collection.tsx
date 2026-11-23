import { Link } from 'react-router-dom';
import { Plus, Watch as WatchIcon, Layers3, Sparkles } from 'lucide-react';
import { WatchCard } from '../components/WatchCard';
import { useDemo } from '../state/DemoProvider';

export default function Collection() {
  const { state, watches } = useDemo();
  const collection = watches.filter((watch) => state.collectionIds.includes(watch.id));
  const brands = new Set(collection.map((watch) => watch.brand)).size;
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow muted">PERSONAL PIECES, PERSONAL STORIES</p>
          <h1>My collection</h1>
          <p className="page-subtitle">A few good watches. Your kind of time.</p>
        </div>
        <div className="heading-actions">
          <Link className="button button-light" to="/">
            Explore watches
          </Link>
          <Link className="button button-dark" to="/add">
            <Plus size={18} />
            Add your own
          </Link>
        </div>
      </div>
      <div className="collection-banner">
        <div className="avatar">
          {state.profile.name
            .split(' ')
            .map((part) => part[0])
            .slice(0, 2)
            .join('')}
        </div>
        <div>
          <p className="eyebrow">THE COLLECTOR</p>
          <h2>{state.profile.name}</h2>
          <p>{state.profile.bio}</p>
        </div>
        <span className="demo-pill">Your demo collection</span>
      </div>
      <div className="stats-row">
        <div>
          <WatchIcon size={20} />
          <span>
            <strong>{collection.length}</strong> Timepieces
          </span>
        </div>
        <div>
          <Layers3 size={20} />
          <span>
            <strong>{brands}</strong> {brands === 1 ? 'Brand' : 'Brands'}
          </span>
        </div>
        <div>
          <Sparkles size={20} />
          <span>
            <strong>100%</strong> Your taste
          </span>
        </div>
      </div>
      {collection.length ? (
        <div className="watch-grid">
          {collection.map((watch) => (
            <WatchCard key={watch.id} watch={watch} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <WatchIcon size={38} />
          <h2>A collection starts with one.</h2>
          <p>Discover a watch you love, then tap the plus to make it yours.</p>
          <Link className="button button-dark" to="/">
            Explore watches
          </Link>
        </div>
      )}
      <p className="catalogue-note">
        This collection belongs to your browser. Explore freely; you can reset the demo anytime.
      </p>
    </>
  );
}
