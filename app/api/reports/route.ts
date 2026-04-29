import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── Dummy reports for UI preview (shown when DB is empty) ────────────────────
const DUMMY_REPORTS = [
  // Mumbai area
  { id: 'd-1', lat: 19.0760, lng: 72.8777, category: 'roads',       description: 'Large pothole near signal, vehicles swerving dangerously',  area_name: 'Dadar West',        photo_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&q=80', upvotes: 34, created_at: new Date(Date.now() - 2  * 60 * 1000).toISOString() },
  { id: 'd-2', lat: 19.0550, lng: 72.8352, category: 'garbage',     description: 'Overflowing municipal bins, no collection since 3 days',    area_name: 'Worli',             photo_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80', upvotes: 21, created_at: new Date(Date.now() - 18 * 60 * 1000).toISOString() },
  { id: 'd-3', lat: 19.0330, lng: 72.8654, category: 'streetlight', description: 'Entire lane dark after 9pm, feels unsafe',                  area_name: 'Prabhadevi',        photo_url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&q=80', upvotes: 12, created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
  { id: 'd-4', lat: 19.0178, lng: 72.8478, category: 'water',       description: 'Burst pipe flooding the footpath near market',              area_name: 'Mahim',             photo_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=80', upvotes: 58, created_at: new Date(Date.now() - 3  * 60 * 60 * 1000).toISOString() },
  { id: 'd-5', lat: 19.1136, lng: 72.8697, category: 'safety',      description: 'Open manhole, no cover, no barricade — very dangerous',    area_name: 'Andheri East',      photo_url: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&q=80', upvotes: 89, created_at: new Date(Date.now() - 5  * 60 * 60 * 1000).toISOString() },
  { id: 'd-6', lat: 19.1250, lng: 72.8360, category: 'theft',       description: 'Chain snatching incident reported near station exit',       area_name: 'Andheri West',      photo_url: 'https://images.unsplash.com/photo-1614107151491-6876eecbff89?w=600&q=80', upvotes: 7,  created_at: new Date(Date.now() - 7  * 60 * 60 * 1000).toISOString() },
  { id: 'd-7', lat: 19.0894, lng: 72.8656, category: 'roads',       description: 'Road completely dug up, no signage or diversion',          area_name: 'Vile Parle',        photo_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&q=80', upvotes: 43, created_at: new Date(Date.now() - 9  * 60 * 60 * 1000).toISOString() },
  { id: 'd-8', lat: 19.1450, lng: 72.8512, category: 'garbage',     description: 'Construction debris dumped on residential street',         area_name: 'Jogeshwari',        photo_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80', upvotes: 17, created_at: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString() },
  // Thane area
  { id: 'd-9',  lat: 19.2183, lng: 72.9781, category: 'roads',       description: 'Speed breaker broken, metal rod sticking out',             area_name: 'Thane West',        photo_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&q=80', upvotes: 25, created_at: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString() },
  { id: 'd-10', lat: 19.2090, lng: 72.9680, category: 'water',       description: 'No water supply for 48+ hours in the entire building',    area_name: 'Kopri',             photo_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=80', upvotes: 67, created_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() },
  { id: 'd-11', lat: 19.2320, lng: 73.0020, category: 'streetlight', description: 'Streetlight flickering all night, keeping residents awake', area_name: 'Manpada',           photo_url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&q=80', upvotes: 9,  created_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString() },
  { id: 'd-12', lat: 19.1920, lng: 72.9650, category: 'safety',      description: 'Illegal parking blocking fire truck access lane',          area_name: 'Naupada',           photo_url: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&q=80', upvotes: 31, created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString() },
  // Navi Mumbai
  { id: 'd-13', lat: 19.0330, lng: 73.0297, category: 'garbage',     description: 'Stray dogs surrounding garbage pile, biting risk',        area_name: 'Vashi',             photo_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80', upvotes: 44, created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
  { id: 'd-14', lat: 19.0170, lng: 73.0130, category: 'other',       description: 'Transformer making loud buzzing noise since yesterday',   area_name: 'Nerul',             photo_url: 'https://images.unsplash.com/photo-1614107151491-6876eecbff89?w=600&q=80', upvotes: 15, created_at: new Date(Date.now() - 55 * 60 * 60 * 1000).toISOString() },
  { id: 'd-15', lat: 19.1610, lng: 73.0090, category: 'roads',       description: 'Bridge approach road has collapsed edge, no railing',     area_name: 'Airoli',            photo_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&q=80', upvotes: 102, created_at: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString() },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const bbox = searchParams.get('bbox');

  let query = supabase
    .from('reports')
    .select('id, lat, lng, category, description, area_name, photo_url, upvotes, created_at')
    .order('created_at', { ascending: false })
    .limit(500);

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (bbox) {
    const [minLat, minLng, maxLat, maxLng] = bbox.split(',').map(Number);
    query = query
      .gte('lat', minLat)
      .lte('lat', maxLat)
      .gte('lng', minLng)
      .lte('lng', maxLng);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Merge dummy reports when DB is empty (dev/preview mode)
  const live = data ?? [];
  const merged = live.length === 0 ? DUMMY_REPORTS : live;

  // Apply category filter to dummy data too
  const filtered =
    category && category !== 'all'
      ? merged.filter((r) => r.category === category)
      : merged;

  return NextResponse.json({ reports: filtered });
}
