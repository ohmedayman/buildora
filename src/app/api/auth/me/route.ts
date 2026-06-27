import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('sb-access-token')?.value;
  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Get profile from users table
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await supabaseAdmin
    .from('users')
    .select('id, name, username, email, plan, bio, theme_color, custom_domain, created_at')
    .eq('id', user.id)
    .single();

  if (!profile) {
    // Auto-create profile
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
    const username = name.toLowerCase().replace(/\s+/g, '-') + '-' + user.id.slice(0, 8);

    await supabaseAdmin.from('users').insert({
      id: user.id,
      name,
      username,
      email: user.email || '',
      avatar: user.user_metadata?.avatar_url || '',
      password: ''
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name,
        username,
        email: user.email,
        plan: 'free',
        bio: '',
        theme_color: '#6c63ff',
        created_at: new Date().toISOString()
      }
    });
  }

  return NextResponse.json({ user: profile });
}

export async function PUT(req: NextRequest) {
  const accessToken = req.cookies.get('sb-access-token')?.value;
  if (!accessToken) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json();
  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const updates: Record<string, any> = {};
  const allowed = ['name', 'username', 'bio', 'theme_color', 'custom_domain'];
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  updates.updated_at = new Date().toISOString();

  const { data: profile, error: updateError } = await supabaseAdmin
    .from('users').update(updates).eq('id', user.id).select('id, name, username, email, plan, bio, theme_color, custom_domain, created_at').single();

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  return NextResponse.json({ user: profile });
}
