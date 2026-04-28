import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const { id } = await req.json();

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Report ID required.' }, { status: 400 });
  }

  const { error } = await supabase.rpc('increment_upvote', { report_id: id });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
