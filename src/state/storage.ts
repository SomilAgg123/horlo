import { z } from 'zod';
import { catalogue, watchSchema } from '../data/catalogue';

export const STORAGE_KEY = 'horlo.demo.v1';
export const profileSchema = z.object({
  name: z.string().trim().min(1).max(60),
  bio: z.string().max(280),
  location: z.string().max(80),
});
const demoSchema = z.object({
  version: z.literal(1),
  collectionIds: z.array(z.string()).max(100),
  customWatches: z.array(watchSchema.refine((watch) => watch.id.startsWith('custom-'))).max(30),
  profile: profileSchema,
});
export type DemoState = z.infer<typeof demoSchema>;

export function freshDemo(): DemoState {
  return {
    version: 1,
    collectionIds: catalogue.slice(0, 3).map((watch) => watch.id),
    customWatches: [],
    profile: {
      name: 'Alex Morgan',
      bio: 'A soft spot for mechanical things and the stories they tell. Collecting slowly, wearing often.',
      location: 'London, UK',
    },
  };
}

export function parseDemo(raw: string): DemoState {
  const state = demoSchema.parse(JSON.parse(raw));
  const ids = new Set([...catalogue, ...state.customWatches].map((watch) => watch.id));
  return { ...state, collectionIds: [...new Set(state.collectionIds)].filter((id) => ids.has(id)) };
}

export function readDemo(storage: Pick<Storage, 'getItem'>): { state: DemoState; warning: string } {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return { state: raw ? parseDemo(raw) : freshDemo(), warning: '' };
  } catch {
    return {
      state: freshDemo(),
      warning: 'Your saved demo could not be loaded. We started a fresh collection.',
    };
  }
}

export function writeDemo(storage: Pick<Storage, 'setItem'>, state: DemoState): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
