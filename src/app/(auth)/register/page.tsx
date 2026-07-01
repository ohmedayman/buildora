'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.get('name'), email: form.get('email'), password: form.get('password') })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'حدث خطأ غير متوقع');
        setLoading(false);
        return;
      }
      router.push('/dashboard');
    } catch {
      setError('حدث خطأ أثناء إنشاء الحساب');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.16),_transparent_35%),linear-gradient(135deg,_#f8fafc_0%,_#ecfeff_100%)] px-4 py-6 sm:px-6 lg:px-8" dir="rtl">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_35px_90px_-40px_rgba(15,23,42,0.55)]">
        <div className="hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--accent)] via-[var(--primary)] to-[#4338ca] p-10 lg:flex">
          <div className="relative max-w-md text-center text-white">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/15 backdrop-blur-sm">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
            </div>
            <h2 className="mb-4 text-3xl font-extrabold leading-tight">أنشئ حسابك الآن</h2>
            <p className="mb-8 text-lg leading-8 text-white/80">ابدأ مشروعك بالملايين من القوالب والميزات المتاحة للمبتدئين والمحترفين.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'صفحات مجانية' },
                { label: 'قوالب جاهزة' },
                { label: 'نشر فوري' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/20 bg-white/15 px-3 py-3 text-sm font-semibold backdrop-blur">{item.label}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-8 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-10 flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-sm font-extrabold text-white shadow-lg shadow-[var(--primary)]/25">B</div>
              <span className="text-2xl font-extrabold text-slate-900">Buildora</span>
            </Link>
            <h1 className="mb-2 text-3xl font-extrabold text-slate-900">أنشئ حسابك المجاني</h1>
            <p className="mb-8 text-slate-500">ابدأ ببناء صفحتك في أقل من 30 ثانية</p>

            {error && (
              <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">الاسم الكامل</label>
                <input name="name" required className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10" placeholder="اسمك هنا" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">البريد الإلكتروني</label>
                <input name="email" type="email" required className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10" placeholder="example@email.com" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">كلمة المرور</label>
                <input name="password" type="password" required minLength={6} className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10" placeholder="6 أحرف على الأقل" />
              </div>
              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-[var(--primary)] py-3.5 text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/25 transition hover:bg-[var(--primary-dark)] disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    جاري الإنشاء...
                  </span>
                ) : 'إنشاء الحساب المجاني'}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-slate-400">بإنشاء حسابك أنت توافق على الشروط وسياسة الخصوصية</p>
            <p className="mt-6 text-center text-sm text-slate-500">
              لديك حساب بالفعل؟ <Link href="/login" className="font-bold text-[var(--primary)] hover:underline">تسجيل الدخول</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
