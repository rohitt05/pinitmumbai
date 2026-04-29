// Approximate lat/lng centroids for each of the 227 prabhags.
// Computed by subdividing the admin ward bounding box into a grid
// and assigning each prabhag a cell (sorted by ward_no).
// Includes a small deterministic jitter so bubbles don't stack perfectly.

import { WARD_BOUNDS } from './ward-lookup';
import { MUMBAI_PRABHAGS } from './mumbai-wards';

const _cache: Record<number, [number, number]> = {};

export function getPrabhagCentroid(wardNo: number): [number, number] {
  if (_cache[wardNo]) return _cache[wardNo];

  const prabhag = MUMBAI_PRABHAGS.find((p) => p.ward_no === wardNo);
  if (!prabhag) return [19.076, 72.877];

  const bounds = WARD_BOUNDS[prabhag.admin_ward];
  if (!bounds) return [19.076, 72.877];

  const peers = MUMBAI_PRABHAGS
    .filter((p) => p.admin_ward === prabhag.admin_ward)
    .sort((a, b) => a.ward_no - b.ward_no);

  const total = peers.length;
  const idx   = peers.findIndex((p) => p.ward_no === wardNo);
  const cols  = Math.ceil(Math.sqrt(total));
  const rows  = Math.ceil(total / cols);
  const col   = idx % cols;
  const row   = Math.floor(idx / cols);

  const latStep = (bounds.maxLat - bounds.minLat) / (rows || 1);
  const lngStep = (bounds.maxLng - bounds.minLng) / (cols || 1);

  // Small deterministic jitter (no RNG) so bubbles don't form a perfect grid
  const jLat = ((wardNo * 7)  % 13) * 0.00045;
  const jLng = ((wardNo * 11) % 7)  * 0.00045;

  const lat = bounds.minLat + latStep * (row + 0.5) + jLat;
  const lng = bounds.minLng + lngStep * (col + 0.5) + jLng;

  _cache[wardNo] = [lat, lng];
  return [lat, lng];
}
