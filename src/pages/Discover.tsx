import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, LayoutGrid, Rows3, ChevronDown, Plus } from 'lucide-react';
import { catalogue, categories, filterWatches, imagePath } from '../data/catalogue';
import { WatchCard } from '../components/WatchCard';
import { useDemo } from '../state/DemoProvider';

export default function Discover() {
  const { watches } = useDemo();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('curated');
  const [listView, setListView] = useState(false);
  const catalogueRef = useRef<HTMLElement>(null);
  const filtered = filterWatches(watches, query, category, sort);
  const featured = catalogue.find((watch) => watch.featured) || catalogue[0];
  function clear() {
    setQuery('');
    setCategory('All');
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow muted">A LITTLE OBSESSION WITH TIME</p>
          <h1>Discover</h1>
        </div>
        <Link className="button button-light" to="/add">
          <Plus size={17} /> Add a watch
        </Link>
      </div>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span className="hero-kicker">
            <span /> FOR THE LOVE OF WATCHES
          </span>
          <h2 id="hero-title">
            More than time.
            <br />
            <em>A little obsession.</em>
          </h2>
          <p>
            The pieces you love. The stories they tell.
            <br />
            Find your next favourite and make it yours.
          </p>
          <button
            className="button button-orange"
            onClick={() =>
              catalogueRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          >
            Explore the catalogue
          </button>
        </div>
        <Link
          to={`/watch/${featured.id}`}
          className="hero-art"
          aria-label={`Explore the ${featured.brand} ${featured.model}`}
        >
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <span className="hero-annotation">EVERY SECOND HAS A STORY</span>
          <img
            src={imagePath(featured.image)}
            alt={`Illustration of the ${featured.brand} ${featured.model}`}
          />
          <div className="hero-caption">
            <span className="eyebrow">THE EVERYDAY ICON</span>
            <span>
              {featured.brand} {featured.model}
            </span>
          </div>
        </Link>
      </section>
      <section className="catalogue-section" ref={catalogueRef} aria-labelledby="catalogue-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow muted">A CONSIDERED SELECTION</p>
            <h2 id="catalogue-title">
              Find your next favourite<span className="count-badge">{watches.length}</span>
            </h2>
          </div>
          <div className="view-switch" aria-label="Catalogue display">
            <button
              aria-label="Grid view"
              aria-pressed={!listView}
              className={!listView ? 'active' : ''}
              onClick={() => setListView(false)}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              aria-label="List view"
              aria-pressed={listView}
              className={listView ? 'active' : ''}
              onClick={() => setListView(true)}
            >
              <Rows3 size={18} />
            </button>
          </div>
        </div>
        <div className="catalogue-toolbar">
          <label className="search-field">
            <Search size={19} />
            <span className="sr-only">Search watches</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search brand, model or reference…"
            />
            {query && (
              <button aria-label="Clear search" onClick={() => setQuery('')}>
                <X size={16} />
              </button>
            )}
          </label>
          <label className="sort-field">
            <SlidersHorizontal size={16} />
            <span className="sr-only">Sort watches</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="curated">Curated selection</option>
              <option value="brand">Brand: A–Z</option>
              <option value="size">Case size: small first</option>
            </select>
            <ChevronDown size={15} />
          </label>
        </div>
        <div className="filter-row" aria-label="Watch categories">
          {['All', ...categories].map((item) => (
            <button
              key={item}
              className={`filter-chip ${category === item ? 'active' : ''}`}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item === 'All' ? 'All watches' : item}
            </button>
          ))}
          <span className="results-count" role="status">
            {filtered.length} {filtered.length === 1 ? 'watch' : 'watches'}
          </span>
        </div>
        {filtered.length ? (
          <div className={`watch-grid ${listView ? 'list-view' : ''}`}>
            {filtered.map((watch) => (
              <WatchCard watch={watch} key={watch.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Search size={32} />
            <h3>No watches found</h3>
            <p>Try another brand, reference, or category.</p>
            <button className="button button-dark" onClick={clear}>
              Clear filters
            </button>
          </div>
        )}
        <p className="catalogue-note">
          Selected for character, not price. Original illustrations; specifications sourced from the
          makers.
        </p>
      </section>
    </>
  );
}
