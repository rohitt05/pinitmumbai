import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const bbox = searchParams.get('bbox'); // minLat,minLng,maxLat,maxLng

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

  return NextResponse.json({ reports: data });
}
