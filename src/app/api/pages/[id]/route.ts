import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

async function requireAuth(req: NextRequest) {
  const accessToken = req.cookies.get('sb-access-token')?.value;
  if (!accessToken) return null;
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data: { user } } = await supabase.auth.getUser(accessToken);
  return user;
}

function getAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const supabase = getAdmin();
  const { data: page } = await supabase.from('pages').select('*').eq('id', id).eq('user_id', user.id).single();
  if (!page) return NextResponse.json({ error: 'الصفحة غير موجودة' }, { status: 404 });
  return NextResponse.json({ page });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const supabase = getAdmin();
  const updates: Record<string, any> = { updated_at: new Date().toISOString() };
  const allowed = ['title', 'content', 'seo_title', 'seo_description', 'seo_keywords', 'og_image', 'custom_css', 'custom_js', 'is_published', 'slug'];
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  const { data: page, error } = await supabase
    .from('pages').update(updates).eq('id', id).eq('user_id', user.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ page });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const supabase = getAdmin();
  await supabase.from('pages').delete().eq('id', id).eq('user_id', user.id);
  return NextResponse.json({ success: true });
}
