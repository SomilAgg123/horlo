import { Link } from 'react-router-dom';
import { Plus, Watch as WatchIcon, Layers3 } from 'lucide-react';
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
          <h1>My collection</h1>
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
          <h2>{state.profile.name}</h2>
        </div>
      </div>
      <div className="stats-row">
        <div>
          <WatchIcon size={20} />
          <span>
            <strong>{collection.length}</strong> {collection.length === 1 ? 'Watch' : 'Watches'}
          </span>
        </div>
        <div>
          <Layers3 size={20} />
          <span>
            <strong>{brands}</strong> {brands === 1 ? 'Brand' : 'Brands'}
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
          <h2>No watches yet</h2>
          <Link className="button button-dark" to="/">
            Explore watches
          </Link>
        </div>
      )}
    </>
  );
}
