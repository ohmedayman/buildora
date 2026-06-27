import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/callback`,
      }
    });

    if (error) {
      console.error('Register error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الحساب' }, { status: 400 });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        name,
        email: data.user.email,
        username: name.toLowerCase().replace(/\s+/g, '-') + '-' + data.user.id.slice(0, 8)
      }
    });

    if (data.session) {
      response.cookies.set('sb-access-token', data.session.access_token, {
        httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 30, path: '/'
      });
      response.cookies.set('sb-refresh-token', data.session.refresh_token, {
        httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 30, path: '/'
      });
    }

    return response;
  } catch (err: any) {
    console.error('Register catch error:', err);
    return NextResponse.json({ error: 'حدث خطأ في الخادم: ' + err.message }, { status: 500 });
  }
}
