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
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      router.push('/dashboard');
    } catch { setError('حدث خطأ'); setLoading(false); }
  }

  return (
    <div className="min-h-screen flex bg-white" dir="rtl">
      {/* Left - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[var(--accent)] via-[var(--primary)] to-[var(--primary-dark)] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
        <div className="relative text-center text-white max-w-md">
          <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold mb-4 leading-tight">أنشئ حسابك<br />وابدأ الآن</h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8">انضم لآلاف المستخدمين وابدأ ببناء صفحتك الاحترافية مجاناً.</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>, label: 'صفحات مجانية' },
              { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>, label: 'قوالب جاهزة' },
              { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>, label: 'نشر فوري' },
            ].map((item, i) => (
              <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-white/90 flex justify-center mb-2">{item.icon}</div>
                <div className="text-xs font-bold">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--primary)]/25">
              <span className="text-white font-extrabold text-sm">B</span>
            </div>
            <span className="text-2xl font-extrabold text-[var(--gray-900)]">Buildora</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-[var(--gray-900)] mb-2">أنشئ حسابك المجاني</h1>
          <p className="text-[var(--gray-500)] mb-8">ابدأ ببناء صفحتك في أقل من 30 ثانية</p>

          {error && (
            <div className="bg-[var(--danger-bg)] text-[var(--danger)] text-sm p-4 rounded-xl mb-6 border border-[var(--danger)]/10 flex items-center gap-2.5">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[var(--gray-700)] mb-2">الاسم الكامل</label>
              <input name="name" required
                className="w-full px-4 py-3.5 border-2 border-[var(--gray-200)] rounded-xl text-sm focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all duration-200"
                placeholder="اسمك هنا" />
            </div>
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
                placeholder="6 أحرف على الأقل" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[var(--primary)] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[var(--primary-dark)] transition-all duration-200 disabled:opacity-50 shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/35">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الإنشاء...
                </span>
              ) : 'إنشاء الحساب المجاني'}
            </button>
          </form>

          <p className="text-center text-xs text-[var(--gray-400)] mt-4">بإنشاء حسابك أنت توافق على الشروط وسياسة الخصوصية</p>

          <p className="text-center text-sm text-[var(--gray-500)] mt-6">
            لديك حساب بالفعل؟ <Link href="/login" className="text-[var(--primary)] font-bold hover:underline">تسجيل الدخول</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
