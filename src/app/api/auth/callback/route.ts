import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const origin = req.nextUrl.origin;

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      // Create user profile if not exists
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (!existingUser) {
        const name = data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';
        const username = name.toLowerCase().replace(/\s+/g, '-') + '-' + data.user.id.slice(0, 8);

        await supabaseAdmin.from('users').insert({
          id: data.user.id,
          name,
          username,
          email: data.user.email || '',
          avatar: data.user.user_metadata?.avatar_url || '',
          password: ''
        });
      }

      const response = NextResponse.redirect(new URL('/dashboard', origin));

      response.cookies.set('sb-access-token', data.session.access_token, {
        httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30, path: '/'
      });
      response.cookies.set('sb-refresh-token', data.session.refresh_token, {
        httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30, path: '/'
      });

      return response;
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth_failed', origin));
}
