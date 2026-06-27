'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), password: form.get('password') })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      router.push('/dashboard');
    } catch { setError('حدث خطأ'); setLoading(false); }
  }

  function handleGoogleLogin() { window.location.href = '/api/auth/google'; }

  return (
    <div className="min-h-screen flex bg-white" dir="rtl">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--primary)]/25">
              <span className="text-white font-extrabold text-sm">B</span>
            </div>
            <span className="text-2xl font-extrabold text-[var(--gray-900)]">Buildora</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-[var(--gray-900)] mb-2">مرحباً بعودتك</h1>
          <p className="text-[var(--gray-500)] mb-8">سجّل دخولك للمتابعة إلى لوحة التحكم</p>

          {error && (
            <div className="bg-[var(--danger-bg)] text-[var(--danger)] text-sm p-4 rounded-xl mb-6 border border-[var(--danger)]/10 flex items-center gap-2.5">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              {error}
            </div>
          )}

          <button onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-[var(--gray-200)] rounded-xl py-3.5 font-semibold text-sm text-[var(--gray-700)] hover:bg-[var(--gray-50)] hover:border-[var(--gray-300)] transition-all duration-200 mb-6 shadow-sm">
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.001-.001 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
            الدخول بحساب Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <hr className="flex-1 border-[var(--gray-200)]" />
            <span className="text-xs text-[var(--gray-400)] font-semibold">أو سجّل بالبريد</span>
            <hr className="flex-1 border-[var(--gray-200)]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[var(--gray-700)] mb-2">البريد الإلكتروني</label>
              <input name="email" type="email" required
                className="w-full px-4 py-3.5 border-2 border-[var(--gray-200)] rounded-xl text-sm focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all duration-200"
                placeholder="example@email.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--gray-700)] mb-2">كلمة المرور</label>
              <input name="password" type="password" required minLength={6}
                className="w-full px-4 py-3.5 border-2 border-[var(--gray-200)] rounded-xl text-sm focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all duration-200"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[var(--primary)] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[var(--primary-dark)] transition-all duration-200 disabled:opacity-50 shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/35">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الدخول...
                </span>
              ) : 'تسجيل الدخول'}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--gray-500)] mt-8">
            ليس لديك حساب؟ <Link href="/register" className="text-[var(--primary)] font-bold hover:underline">إنشاء حساب مجاني</Link>
          </p>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[var(--primary)] via-[var(--primary-dark)] to-[#4338ca] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
        <div className="relative text-center text-white max-w-md">
          <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold mb-4 leading-tight">ابدأ ببناء صفحتك<br />الاحترافية الآن</h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8">صمّف صفحة مذهلة في دقائق بدون أي خبرة برمجية.</p>
          <div className="flex justify-center gap-4">
            <div className="bg-white/15 backdrop-blur-sm px-5 py-3 rounded-xl text-sm font-semibold border border-white/20">+15,000 صفحة منشورة</div>
            <div className="bg-white/15 backdrop-blur-sm px-5 py-3 rounded-xl text-sm font-semibold border border-white/20">⭐ 4.9 تقييم</div>
          </div>
        </div>
      </div>
    </div>
  );
}
