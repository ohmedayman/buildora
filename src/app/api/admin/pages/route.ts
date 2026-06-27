import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'admin@buildora.com').split(',');

async function requireAdmin(req: NextRequest) {
  const accessToken = req.cookies.get('sb-access-token')?.value;
  if (!accessToken) return null;
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) return null;
  return user;
}

function getAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function GET(req: NextRequest) {
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getAdmin();
  const { data: pages } = await admin.from('pages').select('*, users(name, email, username)').order('created_at', { ascending: false });
  return NextResponse.json({ pages: pages || [] });
}

export async function PUT(req: NextRequest) {
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getAdmin();
  const { pageId, updates } = await req.json();

  const { error } = await admin.from('pages').update(updates).eq('id', pageId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getAdmin();
  const { pageId } = await req.json();

  await admin.from('analytics').delete().eq('page_id', pageId);
  await admin.from('pages').delete().eq('id', pageId);

  return NextResponse.json({ success: true });
}
