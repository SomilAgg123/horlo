import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  Watch,
  Compass,
  Layers3,
  Info,
  Code2,
  RotateCcw,
  Menu,
  X,
  Check,
  UserRound,
  BookOpen,
} from 'lucide-react';
import Discover from './pages/Discover';
import Collection from './pages/Collection';
import WatchDetails from './pages/WatchDetails';
import About from './pages/About';
import AddWatch from './pages/AddWatch';
import Profile from './pages/Profile';
import SharedCollection from './pages/SharedCollection';
import { useDemo } from './state/DemoProvider';

export default function App() {
  const { state, toast, warning, reset } = useDemo();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const resetDialog = useRef<HTMLDialogElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);
  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
    mainRef.current?.focus({ preventScroll: true });
    const page =
      pathname === '/'
        ? 'Discover'
        : pathname.startsWith('/watch/')
          ? 'Watch details'
          : pathname === '/collection'
            ? 'My collection'
            : pathname === '/add'
              ? 'Add a watch'
              : pathname === '/profile'
                ? 'Collector profile'
                : pathname.startsWith('/shared/')
                  ? 'The collector’s edit'
                  : 'About';
    document.title = `${page} — Horlo`;
  }, [pathname]);
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="mobile-header">
        <Link to="/" className="logo">
          <span className="logo-mark">
            <Watch size={23} />
          </span>
          horlo<span className="logo-period">.</span>
        </Link>
        <button
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <Link to="/" className="logo">
          <span className="logo-mark">
            <Watch size={23} />
          </span>
          horlo<span className="logo-period">.</span>
        </Link>
        <nav aria-label="Main navigation" onClick={() => setMenuOpen(false)}>
          <NavLink to="/" end>
            <Compass size={19} />
            Discover
          </NavLink>
          <NavLink to="/collection">
            <Layers3 size={19} />
            My collection<span className="nav-count">{state.collectionIds.length}</span>
          </NavLink>
          <NavLink to="/profile">
            <UserRound size={19} />
            My profile
          </NavLink>
          <NavLink to="/shared/collectors-edit">
            <BookOpen size={19} />
            Collector’s edit
          </NavLink>
          <NavLink to="/about">
            <Info size={19} />
            About Horlo
          </NavLink>
        </nav>
        <div className="sidebar-bottom">
          <button className="reset-demo" onClick={() => resetDialog.current?.showModal()}>
            <RotateCcw size={16} /> Reset demo
          </button>
          <a
            className="github-link"
            href="https://github.com/SomilAgg123/horlo"
            target="_blank"
            rel="noreferrer"
          >
            <Code2 size={17} />
            GitHub
          </a>
          <Link to="/profile" className="sidebar-profile" onClick={() => setMenuOpen(false)}>
            <div className="avatar avatar-small">
              {state.profile.name
                .split(' ')
                .map((part) => part[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <strong>{state.profile.name}</strong>
            </div>
          </Link>
        </div>
      </aside>
      <div className="main-shell" inert={menuOpen}>
        <main id="main-content" ref={mainRef} tabIndex={-1}>
          {warning && (
            <div className="storage-warning" role="alert">
              {warning}
            </div>
          )}
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/watch/:id" element={<WatchDetails key={pathname} />} />
            <Route path="/about" element={<About />} />
            <Route path="/add" element={<AddWatch />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shared/collectors-edit" element={<SharedCollection />} />
            <Route
              path="*"
              element={
                <div className="empty-state">
                  <h1>A moment off track.</h1>
                  <p>That page is not in the collection.</p>
                  <Link className="button button-dark" to="/">
                    Back to Discover
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>
        <footer className="site-footer">
          <span>
            horlo<span className="accent">.</span>
          </span>
          <span>
            By{' '}
            <a href="https://github.com/SomilAgg123" target="_blank" rel="noreferrer">
              Somil Aggarwal
            </a>
          </span>
        </footer>
      </div>
      <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">
        {toast && (
          <>
            <Check size={17} />
            {toast}
          </>
        )}
      </div>
      <dialog ref={resetDialog} className="modal">
        <div className="modal-heading">
          <RotateCcw size={24} />
          <button
            className="icon-button"
            aria-label="Close reset dialog"
            onClick={() => resetDialog.current?.close()}
          >
            <X size={20} />
          </button>
        </div>
        <h2>A fresh start?</h2>
        <p>
          This will remove your custom watches, photographs, profile edits, and collection changes
          from this demo. The sample collection will be restored.
        </p>
        <div className="modal-actions">
          <button className="button button-light" onClick={() => resetDialog.current?.close()}>
            Keep exploring
          </button>
          <button
            className="button button-dark"
            onClick={() => {
              reset();
              resetDialog.current?.close();
              setMenuOpen(false);
              navigate('/');
            }}
          >
            Reset demo
          </button>
        </div>
      </dialog>
    </div>
  );
}
