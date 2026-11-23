import rawWatches from './watches.json';
import { z } from 'zod';

export const categories = ['Diver', 'Chronograph', 'Dress', 'Field', 'Everyday'] as const;
export const movements = ['Automatic', 'Manual', 'Quartz', 'Spring Drive'] as const;
export const watchSchema = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .max(80),
  brand: z.string().trim().min(1).max(60),
  model: z.string().trim().min(1).max(100),
  reference: z.string().max(80),
  category: z.enum(categories),
  movement: z.enum(movements),
  diameter: z.number().min(10).max(65),
  waterResistance: z.number().min(0).max(12000),
  waterResistanceLabel: z.string().max(80).optional(),
  caseSizeLabel: z.string().max(80).optional(),
  material: z.string().max(100),
  dial: z.string().max(60),
  color: z.string().regex(/^#[a-fA-F0-9]{6}$/),
  description: z.string().max(1200),
  image: z
    .string()
    .max(900000)
    .refine(
      (value) =>
        /^\/watches\/[a-z0-9-]+\.svg$/.test(value) ||
        /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value),
    ),
  source: z.string().refine((value) => value === '' || /^https:\/\//.test(value)),
  featured: z.boolean(),
});
export type Watch = z.infer<typeof watchSchema>;
export const catalogue: Watch[] = z.array(watchSchema).parse(rawWatches);

export function imagePath(path: string) {
  return path.startsWith('data:') ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

export function filterWatches(watches: Watch[], query: string, category: string, sort: string) {
  const normalized = query.trim().toLocaleLowerCase();
  const filtered = watches.filter(
    (watch) =>
      (category === 'All' || watch.category === category) &&
      `${watch.brand} ${watch.model} ${watch.reference} ${watch.movement}`
        .toLocaleLowerCase()
        .includes(normalized),
  );
  if (sort === 'brand') filtered.sort((a, b) => a.brand.localeCompare(b.brand));
  if (sort === 'size') filtered.sort((a, b) => a.diameter - b.diameter);
  return filtered;
}
