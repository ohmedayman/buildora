import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

async function requireAuth(req: NextRequest) {
  const accessToken = req.cookies.get('sb-access-token')?.value;
  if (!accessToken) return null;
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data: { user } } = await supabase.auth.getUser(accessToken);
  return user;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('user_id');
  const admin = getAdmin();

  if (userId) {
    const { data } = await admin.from('products').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    return NextResponse.json({ products: data || [] });
  }

  // Public: get products for a user
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await admin.from('products').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  return NextResponse.json({ products: data || [] });
}

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const admin = getAdmin();

  const { data, error } = await admin.from('products').insert({
    user_id: user.id,
    name: body.name || 'منتج جديد',
    description: body.description || '',
    price: body.price || 0,
    image: body.image || '',
    category: body.category || '',
    is_active: body.is_active !== false,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}
