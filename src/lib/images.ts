import type { ImageMetadata } from 'astro';

// Map processed images by filename so data-driven paths (site.ts uses
// "/assets/img/foo.jpg") resolve to optimized assets in src/assets/img.
const mods = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/img/*.{jpg,jpeg,png,webp}',
  { eager: true },
);

const byName: Record<string, ImageMetadata> = {};
for (const [path, mod] of Object.entries(mods)) {
  byName[path.split('/').pop()!] = mod.default;
}

export function img(pathOrName: string): ImageMetadata {
  const name = pathOrName.split('/').pop()!;
  const found = byName[name];
  if (!found) throw new Error(`Image not found in src/assets/img: ${name}`);
  return found;
}
