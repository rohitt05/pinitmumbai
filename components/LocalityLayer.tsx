'use client';

// Locality labels are intentionally NOT rendered as custom tiles over the map.
// The CARTO Voyager basemap renders area names (Andheri East, Bandra, Worli, etc.)
// natively as part of the tile layer — no custom overlay needed.
// Ward hover info is handled by StatsCard (WardCard) — fixed bottom-left UI.

import { Report } from '@/types/report';

interface Props {
  visible: boolean;
  reports: Report[];
}

export default function LocalityLayer(_props: Props) {
  return null;
}
