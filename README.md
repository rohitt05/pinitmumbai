# PinIt Mumbai 📍

A lightweight, public, web-first civic issue reporting map for Mumbai & Thane — modelled on [NammaKasa](https://nammakasa.in).

Report roads, garbage, streetlights, water issues, safety incidents, and theft — no login required, just drop a pin with a photo.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Map | Leaflet.js + OpenStreetMap |
| Clustering | leaflet.markercluster |
| Backend / DB | Supabase (PostgreSQL + PostGIS) |
| Realtime | Supabase Realtime |
| Image Storage | Supabase Storage |
| Reverse Geocoding | Nominatim API (free) |
| Deployment | Vercel |
| Language | TypeScript |

## Getting Started

```bash
npx create-next-app@latest pinitmumbai --typescript --tailwind --app
cd pinitmumbai
npm install leaflet react-leaflet leaflet.markercluster
npm install @supabase/supabase-js
npm install date-fns
npm install -D @types/leaflet
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lqpeggadtuborolujbak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Ndc1KjeiiQMGqvijT47l3A_4fADnyf4
```

## Supabase Setup

1. Enable PostGIS extension
2. Run the SQL in `supabase/schema.sql`
3. Create Storage bucket `report-photos` (public)
4. Enable Realtime on `reports` table

## Project Structure

```
/app
  layout.tsx
  page.tsx
  /api
    /report/route.ts
    /reports/route.ts
    /upvote/route.ts
/components
  Map.tsx
  ReportModal.tsx
  PinPopup.tsx
  FilterBar.tsx
  HotspotLayer.tsx
/lib
  supabase.ts
  categories.ts
  reverseGeocode.ts
/types
  report.ts
```

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rohitt05/pinitmumbai)
