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

  const { count: totalUsers } = await admin.from('users').select('*', { count: 'exact', head: true });
  const { count: totalPages } = await admin.from('pages').select('*', { count: 'exact', head: true });
  const { count: publishedPages } = await admin.from('pages').select('*', { count: 'exact', head: true }).eq('is_published', true);
  const { data: allPages } = await admin.from('pages').select('id, views');
  const totalViews = (allPages || []).reduce((sum: number, p: any) => sum + (p.views || 0), 0);
  const { data: recentUsers } = await admin.from('users').select('id, name, email, username, plan, created_at').order('created_at', { ascending: false }).limit(10);
  const { data: recentPages } = await admin.from('pages').select('id, title, slug, is_published, views, created_at, user_id').order('created_at', { ascending: false }).limit(10);

  return NextResponse.json({
    stats: { totalUsers: totalUsers || 0, totalPages: totalPages || 0, publishedPages: publishedPages || 0, totalViews },
    recentUsers: recentUsers || [],
    recentPages: recentPages || [],
  });
}
