import { describe, expect, it } from 'vitest';
import { catalogue, filterWatches } from '../data/catalogue';
import { freshDemo, parseDemo, readDemo, STORAGE_KEY, writeDemo } from './storage';

describe('local demo persistence', () => {
  it('restores collection and profile changes across visits', () => {
    const data = new Map<string, string>();
    const storage = {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => {
        data.set(key, value);
      },
    };
    const state = freshDemo();
    state.collectionIds = [catalogue[4].id];
    state.profile.name = 'Morgan';
    expect(writeDemo(storage, state)).toBe(true);
    expect(readDemo(storage).state).toEqual(state);
    expect([...data.keys()]).toEqual([STORAGE_KEY]);
  });
  it('recovers from corrupt or obsolete data without crashing', () => {
    for (const raw of ['{broken', '{}', JSON.stringify({ ...freshDemo(), version: 2 })]) {
      const result = readDemo({ getItem: () => raw });
      expect(result.state).toEqual(freshDemo());
      expect(result.warning).toContain('fresh collection');
    }
  });
  it('handles unavailable storage', () => {
    const storage = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('quota');
      },
    };
    expect(readDemo(storage).warning).not.toBe('');
    expect(writeDemo(storage, freshDemo())).toBe(false);
  });
  it('drops stale collection IDs and duplicates', () => {
    const state = {
      ...freshDemo(),
      collectionIds: ['missing-watch', catalogue[0].id, catalogue[0].id],
    };
    expect(parseDemo(JSON.stringify(state)).collectionIds).toEqual([catalogue[0].id]);
  });
  it('rejects unsafe image data and links in imported browser state', () => {
    for (const field of [
      { image: 'javascript:alert(1)' },
      { source: 'javascript:alert(1)' },
      { image: 'data:image/svg+xml;base64,abc' },
    ]) {
      expect(() =>
        parseDemo(
          JSON.stringify({
            ...freshDemo(),
            customWatches: [{ ...catalogue[0], id: 'custom-example', ...field }],
          }),
        ),
      ).toThrow();
    }
  });
});

describe('catalogue exploration', () => {
  it('searches references, brands, and models without case sensitivity', () => {
    expect(filterWatches(catalogue, '  rOlEx ', 'All', 'curated')[0].brand).toBe('Rolex');
    expect(filterWatches(catalogue, catalogue[0].reference, 'All', 'curated')).toContainEqual(
      catalogue[0],
    );
  });
  it('combines category and query, and leaves catalogue order intact when sorting', () => {
    const originalIds = catalogue.map((watch) => watch.id);
    expect(filterWatches(catalogue, 'Rolex', 'Dress', 'curated')).toHaveLength(0);
    const sorted = filterWatches(catalogue, '', 'All', 'size');
    expect(sorted[0].diameter).toBe(Math.min(...catalogue.map((watch) => watch.diameter)));
    expect(catalogue.map((watch) => watch.id)).toEqual(originalIds);
  });
});
