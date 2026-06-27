import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

async function requireAuth(req: NextRequest) {
  const accessToken = req.cookies.get('sb-access-token')?.value;
  if (!accessToken) return null;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user } } = await supabase.auth.getUser(accessToken);
  return user;
}

export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: pages } = await supabase
    .from('pages').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });

  return NextResponse.json({ pages: pages || [] });
}

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { title } = await req.json();

  // Check page limit for free plan
  const { count } = await supabase
    .from('pages').select('*', { count: 'exact', head: true }).eq('user_id', user.id);

  const { data: profile } = await supabase.from('users').select('plan').eq('id', user.id).single();
  if (profile?.plan === 'free' && (count || 0) >= 3) {
    return NextResponse.json({ error: 'لقد وصلت للحد الأقصى من الصفحات المجانية' }, { status: 403 });
  }

  let slug = (title || 'page').toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '') || 'page';
  const { data: existing } = await supabase.from('pages').select('id').eq('slug', slug).eq('user_id', user.id).single();
  if (existing) slug += '-' + Date.now();

  const { data: page, error } = await supabase
    .from('pages').insert({ user_id: user.id, title: title || 'صفحتي', slug, content: '[]' })
    .select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ page });
}
