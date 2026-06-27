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
  const { data: users } = await admin.from('users').select('*').order('created_at', { ascending: false });
  return NextResponse.json({ users: users || [] });
}

export async function PUT(req: NextRequest) {
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getAdmin();
  const { userId, updates } = await req.json();

  const allowed = ['plan', 'name', 'username', 'bio', 'theme_color'];
  const patch: Record<string, any> = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) patch[key] = updates[key];
  }

  const { error } = await admin.from('users').update(patch).eq('id', userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getAdmin();
  const { userId } = await req.json();

  await admin.from('pages').delete().eq('user_id', userId);
  await admin.from('users').delete().eq('id', userId);
  await admin.auth.admin.deleteUser(userId);

  return NextResponse.json({ success: true });
}
