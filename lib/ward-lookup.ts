// Lightweight point-in-polygon ward lookup using approximate bounding boxes.
// Falls back to nearest-centroid if outside all boxes.
// This avoids loading the full GeoJSON just for a ward key.

const WARD_BOUNDS: Record<string, { minLat: number; maxLat: number; minLng: number; maxLng: number }> = {
  'A':   { minLat: 18.893, maxLat: 18.935, minLng: 72.805, maxLng: 72.840 },
  'B':   { minLat: 18.935, maxLat: 18.965, minLng: 72.827, maxLng: 72.862 },
  'C':   { minLat: 18.944, maxLat: 18.975, minLng: 72.815, maxLng: 72.848 },
  'D':   { minLat: 18.958, maxLat: 18.985, minLng: 72.797, maxLng: 72.830 },
  'E':   { minLat: 18.972, maxLat: 19.008, minLng: 72.837, maxLng: 72.876 },
  'F/N': { minLat: 19.008, maxLat: 19.054, minLng: 72.845, maxLng: 72.893 },
  'F/S': { minLat: 18.990, maxLat: 19.022, minLng: 72.818, maxLng: 72.848 },
  'G/N': { minLat: 19.015, maxLat: 19.045, minLng: 72.826, maxLng: 72.858 },
  'G/S': { minLat: 18.988, maxLat: 19.020, minLng: 72.808, maxLng: 72.832 },
  'H/E': { minLat: 19.040, maxLat: 19.082, minLng: 72.836, maxLng: 72.875 },
  'H/W': { minLat: 19.042, maxLat: 19.082, minLng: 72.808, maxLng: 72.845 },
  'K/E': { minLat: 19.095, maxLat: 19.145, minLng: 72.848, maxLng: 72.906 },
  'K/W': { minLat: 19.095, maxLat: 19.145, minLng: 72.808, maxLng: 72.855 },
  'L':   { minLat: 19.055, maxLat: 19.105, minLng: 72.860, maxLng: 72.918 },
  'M/E': { minLat: 19.023, maxLat: 19.075, minLng: 72.898, maxLng: 72.953 },
  'M/W': { minLat: 19.030, maxLat: 19.075, minLng: 72.872, maxLng: 72.910 },
  'N':   { minLat: 19.080, maxLat: 19.135, minLng: 72.900, maxLng: 72.960 },
  'P/N': { minLat: 19.170, maxLat: 19.240, minLng: 72.842, maxLng: 72.900 },
  'P/S': { minLat: 19.130, maxLat: 19.185, minLng: 72.828, maxLng: 72.880 },
  'R/C': { minLat: 19.218, maxLat: 19.275, minLng: 72.818, maxLng: 72.870 },
  'R/N': { minLat: 19.240, maxLat: 19.300, minLng: 72.840, maxLng: 72.900 },
  'R/S': { minLat: 19.213, maxLat: 19.260, minLng: 72.845, maxLng: 72.890 },
  'S':   { minLat: 19.110, maxLat: 19.175, minLng: 72.920, maxLng: 72.978 },
  'T':   { minLat: 19.155, maxLat: 19.220, minLng: 72.940, maxLng: 72.995 },
};

export function getWardKeyFromLatLng(lat: number, lng: number): string {
  // First pass: find all wards whose bounding box contains the point
  const matches = Object.entries(WARD_BOUNDS).filter(
    ([, b]) => lat >= b.minLat && lat <= b.maxLat && lng >= b.minLng && lng <= b.maxLng
  );
  if (matches.length === 1) return matches[0][0];

  // If multiple overlap (bboxes can share edges), pick the one whose centroid is closest
  const candidates = matches.length > 0 ? matches : Object.entries(WARD_BOUNDS);
  let best = '';
  let bestDist = Infinity;
  for (const [key, b] of candidates) {
    const cLat = (b.minLat + b.maxLat) / 2;
    const cLng = (b.minLng + b.maxLng) / 2;
    const d = (lat - cLat) ** 2 + (lng - cLng) ** 2;
    if (d < bestDist) { bestDist = d; best = key; }
  }
  return best;
}
