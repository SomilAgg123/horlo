import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, ChevronDown, ChevronRight, Plus, ShieldCheck, X } from 'lucide-react';
import { categories, movements, watchSchema, imagePath } from '../data/catalogue';
import { useDemo } from '../state/DemoProvider';
import { preparePhoto } from '../lib/photo';

export default function AddWatch() {
  const { addCustomWatch, state } = useDemo();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  async function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    setError('');
    try {
      setPhoto(await preparePhoto(file));
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'Could not read this photo.');
    } finally {
      setProcessing(false);
      event.target.value = '';
    }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (processing) return;
    setError('');
    if (state.customWatches.length >= 30) {
      setError('This demo has room for 30 custom watches. Reset it to start a new collection.');
      return;
    }
    const form = new FormData(event.currentTarget);
    const result = watchSchema.safeParse({
      id: `custom-${crypto.randomUUID()}`,
      brand: String(form.get('brand') || ''),
      model: String(form.get('model') || ''),
      reference: String(form.get('reference') || '').trim(),
      category: form.get('category'),
      movement: form.get('movement'),
      diameter: Number(form.get('diameter')),
      waterResistance: Number(form.get('waterResistance') || 0),
      waterResistanceLabel: form.get('waterResistance') === '' ? 'Not specified' : undefined,
      material: String(form.get('material') || '').trim(),
      dial: String(form.get('dial') || '').trim(),
      description: String(form.get('description') || '').trim(),
      image: photo || '/watches/your-watch.svg',
      source: '',
      color: '#83929f',
      featured: false,
    });
    if (!result.success) {
      setError(
        'Check your watch details. Brand and model are required, and case size must be between 10 and 65 mm.',
      );
      return;
    }
    addCustomWatch(result.data);
    navigate(`/watch/${result.data.id}`);
  }
  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/collection">My collection</Link>
        <ChevronRight size={14} />
        <span>Add a watch</span>
      </nav>
      <div className="page-heading">
        <div>
          <p className="eyebrow muted">EVERY PIECE HAS A PLACE</p>
          <h1>Add your own watch</h1>
          <p className="page-subtitle">
            The heirloom, the everyday favourite, the unexpected find.
          </p>
        </div>
      </div>
      <form className="watch-form" onSubmit={submit}>
        <div className="form-photo-column">
          <div className={`photo-picker ${photo ? 'has-photo' : ''}`}>
            {photo ? (
              <>
                <img src={photo} alt="Your selected watch" />
                <button
                  className="remove-photo"
                  type="button"
                  aria-label="Remove selected photo"
                  disabled={processing}
                  onClick={() => setPhoto('')}
                >
                  <X size={17} />
                </button>
              </>
            ) : (
              <>
                <img
                  className="placeholder-watch"
                  src={imagePath('/watches/your-watch.svg')}
                  alt=""
                />
                <span className="photo-picker-caption">Give your watch a face.</span>
              </>
            )}
            <label className="button button-light photo-upload">
              <Camera size={17} />
              {processing ? 'Preparing photo…' : photo ? 'Change photo' : 'Choose a photo'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={choosePhoto}
                disabled={processing}
                aria-label="Watch photo"
              />
            </label>
          </div>
          <p className="form-hint">
            JPEG, PNG, or WebP · Up to 5 MB
            <br />
            Photos are resized and saved only in your browser.
          </p>
          <div className="privacy-note">
            <ShieldCheck size={19} />
            <p>Your photos and details stay on this device. Nothing is uploaded to a server.</p>
          </div>
        </div>
        <div className="form-panel">
          <h2>The essentials</h2>
          <p className="form-section-note">
            Start with what makes it yours. Fields marked * are required.
          </p>
          <div className="form-grid">
            <label>
              Brand *
              <input
                name="brand"
                required
                maxLength={60}
                placeholder="e.g. Seiko"
                autoComplete="off"
              />
            </label>
            <label>
              Model *
              <input
                name="model"
                required
                maxLength={100}
                placeholder="e.g. Alpinist"
                autoComplete="off"
              />
            </label>
            <label>
              Reference number
              <input name="reference" maxLength={80} placeholder="Optional" />
            </label>
            <label>
              Case size (mm) *
              <input
                name="diameter"
                type="number"
                required
                min="10"
                max="65"
                step="0.1"
                defaultValue="38"
              />
            </label>
            <label>
              Style
              <span className="select-wrap">
                <select name="category" defaultValue="Everyday">
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <ChevronDown size={16} />
              </span>
            </label>
            <label>
              Movement
              <span className="select-wrap">
                <select name="movement" defaultValue="Automatic">
                  {movements.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <ChevronDown size={16} />
              </span>
            </label>
            <label>
              Case material
              <input name="material" maxLength={100} placeholder="e.g. Stainless steel" />
            </label>
            <label>
              Dial colour
              <input name="dial" maxLength={60} placeholder="e.g. Forest green" />
            </label>
            <label>
              Water resistance (m)
              <input
                name="waterResistance"
                type="number"
                min="0"
                max="12000"
                placeholder="Leave blank if unknown"
              />
            </label>
            <label className="full-width">
              Its story
              <textarea
                name="description"
                rows={4}
                maxLength={1200}
                placeholder="Where you found it. Why you love it. A detail worth remembering."
              />
            </label>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="form-actions">
            <Link className="button button-light" to="/collection">
              Cancel
            </Link>
            <button className="button button-dark" type="submit" disabled={processing}>
              <Plus size={17} />
              Add to my collection
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
