import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

// Public: Submit a contact form message
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { page_id, name, email, phone, message, form_type } = body;

    if (!page_id || !name || !email) {
      return NextResponse.json({ error: 'الاسم والبريد مطلوبان' }, { status: 400 });
    }

    const supabase = getAdmin();
    const { data, error } = await supabase.from('messages').insert({
      page_id,
      name,
      email,
      phone: phone || '',
      message: message || '',
      form_type: form_type || 'contact',
      status: 'new',
    }).select().single();

    if (error) throw error;
    return NextResponse.json({ success: true, message: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Auth: Get messages for a user
export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('sb-access-token')?.value;
  if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = getAdmin();
  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const pageId = url.searchParams.get('page_id');

  let query = admin.from('messages')
    .select('*, pages!inner(id, title, slug, user_id)')
    .eq('pages.user_id', user.id)
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);
  if (pageId) query = query.eq('page_id', pageId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ messages: data || [] });
}
