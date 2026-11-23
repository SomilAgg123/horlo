import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Check, MapPin, LockKeyhole } from 'lucide-react';
import { useDemo } from '../state/DemoProvider';
import { profileSchema } from '../state/storage';

export default function Profile() {
  const { state, saveProfile } = useDemo();
  const [name, setName] = useState(state.profile.name);
  const [location, setLocation] = useState(state.profile.location);
  const [bio, setBio] = useState(state.profile.bio);
  const [error, setError] = useState('');
  function submit(event: FormEvent) {
    event.preventDefault();
    const result = profileSchema.safeParse({ name, location, bio });
    if (!result.success) {
      setError('Add a name between 1 and 60 characters.');
      return;
    }
    setError('');
    saveProfile(result.data);
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow muted">THE PERSON BEHIND THE PIECES</p>
          <h1>Collector profile</h1>
          <p className="page-subtitle">Make this little corner of Horlo your own.</p>
        </div>
      </div>
      <div className="profile-layout">
        <section className="profile-preview">
          <div className="profile-cover" />
          <div className="avatar">
            {name
              .trim()
              .split(/\s+/)
              .map((part) => part[0])
              .slice(0, 2)
              .join('') || 'H'}
          </div>
          <h2>{name.trim() || 'Your name'}</h2>
          {location && (
            <span className="profile-location">
              <MapPin size={15} />
              {location}
            </span>
          )}
          <p>{bio || 'A collection with a story of its own.'}</p>
          <div className="profile-count">
            <strong>{state.collectionIds.length}</strong>
            <span>TIMEPIECES, AND COUNTING</span>
          </div>
          <Link className="button button-light" to="/collection">
            View my collection
          </Link>
        </section>
        <form className="form-panel profile-form" onSubmit={submit}>
          <h2>A little about you</h2>
          <p className="form-section-note">
            Try a new name, add a story. This profile is part of your local demo.
          </p>
          <div className="form-grid">
            <label className="full-width">
              Display name *
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={60}
                autoComplete="off"
              />
            </label>
            <label className="full-width">
              Location
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                maxLength={80}
                placeholder="Your corner of the world"
                autoComplete="off"
              />
            </label>
            <label className="full-width">
              Your story
              <textarea
                rows={5}
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                maxLength={280}
              />
              <span className="character-count">{bio.length}/280</span>
            </label>
          </div>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <div className="privacy-note">
            <LockKeyhole size={18} />
            <p>This is not a public account. These details stay in this browser.</p>
          </div>
          <div className="form-actions">
            <button className="button button-dark" type="submit">
              <Check size={17} />
              Save profile
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
