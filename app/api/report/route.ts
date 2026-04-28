import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const VALID_CATEGORIES = ['roads', 'garbage', 'streetlight', 'water', 'safety', 'theft', 'other'];

// Simple in-memory rate limiter: IP -> [timestamp, ...]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) || []).filter(
    (t) => now - t < RATE_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT) return true;
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Max 5 reports per hour.' },
      { status: 429 }
    );
  }

  const formData = await req.formData();
  const photo = formData.get('photo') as File | null;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string | null;
  const area_name = formData.get('area_name') as string | null;
  const lat = parseFloat(formData.get('lat') as string);
  const lng = parseFloat(formData.get('lng') as string);

  // Validate
  if (!photo) {
    return NextResponse.json({ error: 'Photo is required.' }, { status: 400 });
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Invalid category.' }, { status: 400 });
  }
  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Valid lat/lng required.' }, { status: 400 });
  }

  // Upload photo
  const arrayBuffer = await photo.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileName = `${Date.now()}-${randomUUID()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from('report-photos')
    .upload(fileName, buffer, { contentType: 'image/jpeg', upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from('report-photos')
    .getPublicUrl(fileName);

  const photo_url = urlData.publicUrl;

  // Insert report
  const { data, error: insertError } = await supabase
    .from('reports')
    .insert({ lat, lng, category, description: description || null, area_name: area_name || null, photo_url })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id, report: data }, { status: 201 });
}
