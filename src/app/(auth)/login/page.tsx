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
      if (!res.ok) {
        setError(data.error || 'حدث خطأ غير متوقع');
        setLoading(false);
        return;
      }
      router.push('/dashboard');
    } catch {
      setError('حدث خطأ أثناء تسجيل الدخول');
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    window.location.href = '/api/auth/google';
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_38%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-6 sm:px-6 lg:px-8" dir="rtl">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_35px_90px_-40px_rgba(15,23,42,0.55)]">
        <div className="hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--primary)] via-[#5b52e0] to-[#4338ca] p-10 lg:flex">
          <div className="relative max-w-md text-center text-white">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/15 backdrop-blur-sm">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
            </div>
            <h2 className="mb-4 text-3xl font-extrabold leading-tight">مرحباً بك مرة أخرى</h2>
            <p className="mb-8 text-lg leading-8 text-white/80">تابع مشروعك، وحرّر الصفحات، وانشر التغييرات في ثوانٍ.</p>
            <div className="flex justify-center gap-3 text-sm font-semibold">
              <div className="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur">+15K صفحة</div>
              <div className="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur">⭐ 4.9 تقييم</div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-8 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-10 flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-sm font-extrabold text-white shadow-lg shadow-[var(--primary)]/25">B</div>
              <span className="text-2xl font-extrabold text-slate-900">Buildora</span>
            </Link>
            <h1 className="mb-2 text-3xl font-extrabold text-slate-900">مرحباً بعودتك</h1>
            <p className="mb-8 text-slate-500">سجّل دخولك للمتابعة إلى لوحة التحكم</p>

            {error && (
              <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                {error}
              </div>
            )}

            <button onClick={handleGoogleLogin} className="mb-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[var(--primary)] hover:bg-slate-50">
              <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" /><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" /><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" /><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.001-.001 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" /></svg>
              الدخول بحساب Google
            </button>

            <div className="mb-6 flex items-center gap-3">
              <hr className="flex-1 border-slate-200" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">أو بالبريد</span>
              <hr className="flex-1 border-slate-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">البريد الإلكتروني</label>
                <input name="email" type="email" required className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10" placeholder="example@email.com" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">كلمة المرور</label>
                <input name="password" type="password" required minLength={6} className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-[var(--primary)] py-3.5 text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/25 transition hover:bg-[var(--primary-dark)] disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    جاري الدخول...
                  </span>
                ) : 'تسجيل الدخول'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              ليس لديك حساب؟ <Link href="/register" className="font-bold text-[var(--primary)] hover:underline">إنشاء حساب مجاني</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
