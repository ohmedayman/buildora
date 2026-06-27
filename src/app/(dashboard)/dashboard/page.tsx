'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User { id: string; name: string; username: string; email: string; plan: string; bio: string; }
interface Page { id: string; title: string; slug: string; is_published: boolean; views: number; updated_at: string; created_at: string; }
interface Stats { totalPages: number; publishedPages: number; totalViews: number; recentPages: Page[]; }
interface Template { id: string; name: string; nameEn: string; thumbnail: string; category: string; content: string; }

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [section, setSection] = useState('overview');
  const [showNewPage, setShowNewPage] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const [toast, setToast] = useState('');

  const BASE = 'buildora.vexonet.online';

  useEffect(() => {
    fetch('/api/auth/me').then(r => { if (!r.ok) throw ''; return r.json(); })
      .then(d => { setUser(d.user); loadStats(); loadPages(); loadTemplates(); })
      .catch(() => router.push('/login'));
  }, [router]);

  async function loadStats() {
    try {
      const r = await fetch('/api/pages');
      const d = await r.json();
      const p = d.pages || [];
      setPages(p);
      setStats({ totalPages: p.length, publishedPages: p.filter((x: Page) => x.is_published).length, totalViews: p.reduce((s: number, x: Page) => s + (x.views || 0), 0), recentPages: p.slice(0, 5) });
    } catch {}
  }

  async function loadPages() { const r = await fetch('/api/pages'); const d = await r.json(); setPages(d.pages || []); }
  async function loadTemplates() { const r = await fetch('/api/templates'); const d = await r.json(); setTemplates(d.templates || []); }

  async function createPage() {
    if (!pageTitle.trim()) return;
    const r = await fetch('/api/pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: pageTitle }) });
    const d = await r.json();
    if (d.page) router.push('/dashboard/' + d.page.id);
    else showToast(d.error || 'حدث خطأ');
  }

  async function createFromTemplate(id: string) {
    const tpl = templates.find(t => t.id === id);
    if (!tpl) return;
    const r = await fetch('/api/pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: tpl.name }) });
    const d = await r.json();
    if (d.page) { await fetch('/api/pages/' + d.page.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: tpl.content }) }); router.push('/dashboard/' + d.page.id); }
  }

  async function togglePublish(id: string, current: boolean) { await fetch('/api/pages/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_published: !current }) }); loadPages(); loadStats(); }
  async function deletePage(id: string) { if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟')) return; await fetch('/api/pages/' + id, { method: 'DELETE' }); loadPages(); loadStats(); showToast('تم حذف الصفحة'); }
  async function logout() { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/'); }
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  const sub = user?.username || user?.name?.toLowerCase().replace(/\s+/g, '') || '';

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-[var(--gray-50)]"><div className="w-10 h-10 border-[3px] border-[var(--primary)] border-t-transparent rounded-full animate-spin" /></div>;

  const navItems = [
    { id: 'overview', label: 'نظرة عامة', icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg> },
    { id: 'pages', label: 'صفحاتي', icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg> },
    { id: 'templates', label: 'القوالب', icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg> },
    { id: 'settings', label: 'الإعدادات', icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  return (
    <div className="min-h-screen bg-[var(--gray-50)]" dir="rtl">
      {/* Top Navbar */}
      <nav className="bg-white/80 backdrop-blur-2xl border-b border-[var(--gray-100)]/50 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
                <span className="text-white font-extrabold text-xs">B</span>
              </div>
              <span className="text-xl font-extrabold text-[var(--gray-900)] hidden sm:block">Buildora</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { navigator.clipboard.writeText(`https://${sub}.${BASE}`); showToast('تم النسخ!'); }}
              className="hidden sm:flex items-center gap-2 bg-[var(--gray-50)] px-3.5 py-2 rounded-xl border border-[var(--gray-200)] hover:bg-[var(--gray-100)] transition-all duration-300 text-xs text-[var(--gray-500)] font-medium cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-4.888a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L5.25 8.689" /></svg>
              {sub}.{BASE}
            </button>
            <Link href="/pricing" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white text-xs font-semibold hover:shadow-lg hover:shadow-[var(--primary)]/25 transition-all duration-300">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
              ترقية
            </Link>
            <div className="flex items-center gap-2.5 pl-3 border-l border-[var(--gray-200)]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white text-xs font-bold shadow-sm">{user.name[0]}</div>
              <span className="text-sm font-semibold text-[var(--gray-700)] hidden sm:block">{user.name}</span>
            </div>
            <button onClick={logout} className="p-2 rounded-xl hover:bg-[var(--danger-bg)] text-[var(--gray-400)] hover:text-[var(--danger)] transition-all duration-300">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex max-w-[1400px] mx-auto">
        {/* Sidebar */}
        <aside className="w-64 p-4 pt-8 hidden lg:block">
          <div className="text-[10px] uppercase text-[var(--gray-400)] tracking-widest mb-4 px-4 font-bold">القائمة</div>
          <div className="space-y-1">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${section === item.id ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-lg shadow-[var(--primary)]/20' : 'text-[var(--gray-500)] hover:bg-[var(--gray-100)] hover:text-[var(--gray-700)]'}`}>
                {item.icon}{item.label}
                {item.id === 'pages' && pages.length > 0 && <span className={`mr-auto text-[10px] px-2 py-0.5 rounded-full ${section === item.id ? 'bg-white/20' : 'bg-[var(--gray-200)] text-[var(--gray-500)]'}`}>{pages.length}</span>}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {section === 'overview' && (
            <div className="space-y-7 animate-fadeIn">
              {/* Welcome Header */}
              <div className="bg-gradient-to-br from-[var(--primary)] via-[#7c3aed] to-[var(--accent)] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden">
                <div className="absolute -top-20 -left-20 w-56 h-56 bg-white/5 rounded-full" />
                <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-white/5 rounded-full" />
                <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-white/3 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white/60 text-xs font-medium">متصل</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">مرحباً {user.name}!</h1>
                  <p className="text-white/70 text-base mb-6">ابدأ ببناء صفحتك الاحترافية الآن</p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => setShowNewPage(true)}
                      className="inline-flex items-center gap-2.5 bg-white px-6 py-3 rounded-2xl text-sm font-bold text-[var(--primary)] hover:bg-white/90 transition-all duration-300 shadow-xl shadow-black/10 hover:scale-105">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                      صفحة جديدة
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(`https://${sub}.${BASE}`); showToast('تم النسخ!'); }}
                      className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-2xl text-sm font-semibold hover:bg-white/25 transition-all duration-300 border border-white/20">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-4.888a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L5.25 8.689" /></svg>
                      {sub}.{BASE}
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>, bg: 'var(--primary-bg)', color: 'var(--primary)', value: stats?.totalPages || 0, label: 'الصفحات', trend: '+2 هذا الأسبوع' },
                  { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, bg: 'var(--success-bg)', color: 'var(--success)', value: stats?.totalViews || 0, label: 'المشاهدات', trend: 'مستمر' },
                  { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>, bg: 'var(--warning-bg)', color: 'var(--warning)', value: stats?.publishedPages || 0, label: 'منشورة', trend: 'جاهزة للعرض' },
                  { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m3 0H9.75m3 0H9.75m0 3H9.75m-3 0H6.75m0-3H6.75m0 3H6.75m0 0H4.5M3 3h18M3 3v18" /></svg>, bg: 'var(--accent-bg)', color: 'var(--accent)', value: stats?.totalPages ? (stats.totalPages - stats.publishedPages) : 0, label: 'مسودات', trend: 'قابلة للتعديل' },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-3xl border border-[var(--gray-100)] p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{background: s.bg, color: s.color}}>{s.icon}</div>
                      <span className="text-[10px] font-medium text-[var(--gray-400)]">{s.trend}</span>
                    </div>
                    <div className="text-3xl font-extrabold text-[var(--gray-900)]">{s.value}</div>
                    <div className="text-xs text-[var(--gray-400)] mt-1 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-base font-bold text-[var(--gray-900)] mb-4">إجراءات سريعة</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <button onClick={() => setShowNewPage(true)} className="bg-white border border-dashed border-[var(--gray-200)] rounded-3xl p-6 text-center hover:border-[var(--primary)] hover:bg-[var(--primary-bg)]/50 transition-all duration-500 group">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--primary-bg)] flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 text-[var(--primary)]">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    </div>
                    <div className="text-sm font-bold text-[var(--gray-900)] mb-1">صفحة جديدة</div>
                    <div className="text-xs text-[var(--gray-400)]">ابدأ من الصفر</div>
                  </button>
                  <button onClick={() => setSection('templates')} className="bg-white border border-dashed border-[var(--gray-200)] rounded-3xl p-6 text-center hover:border-[var(--accent)] hover:bg-[var(--accent-bg)]/50 transition-all duration-500 group">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--accent-bg)] flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-300 text-[var(--accent)]">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
                    </div>
                    <div className="text-sm font-bold text-[var(--gray-900)] mb-1">من قالب</div>
                    <div className="text-xs text-[var(--gray-400)]">{templates.length} قالب جاهز</div>
                  </button>
                  <button onClick={() => setSection('settings')} className="bg-white border border-dashed border-[var(--gray-200)] rounded-3xl p-6 text-center hover:border-[var(--warning)] hover:bg-[var(--warning-bg)]/50 transition-all duration-500 group">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--warning-bg)] flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--warning)] group-hover:text-white transition-all duration-300 text-[var(--warning)]">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div className="text-sm font-bold text-[var(--gray-900)] mb-1">الإعدادات</div>
                    <div className="text-xs text-[var(--gray-400)]">تعديل الحساب</div>
                  </button>
                </div>
              </div>

              {/* Recent Pages */}
              <div className="bg-white rounded-3xl border border-[var(--gray-100)] overflow-hidden">
                <div className="flex justify-between items-center px-7 py-5 border-b border-[var(--gray-100)]">
                  <div>
                    <h2 className="text-base font-bold text-[var(--gray-900)]">آخر الصفحات</h2>
                    <p className="text-xs text-[var(--gray-400)] mt-1">{stats?.recentPages?.length || 0} من أصل {pages.length}</p>
                  </div>
                  {pages.length > 0 && <button onClick={() => setSection('pages')} className="text-[var(--primary)] text-xs font-semibold hover:underline">عرض الكل</button>}
                </div>
                {stats?.recentPages?.length ? (
                  <div className="divide-y divide-[var(--gray-50)]">
                    {stats.recentPages.map(p => (
                      <div key={p.id} className="flex items-center justify-between px-7 py-4 hover:bg-[var(--gray-50)] transition-colors duration-300">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-[var(--primary-bg)] flex items-center justify-center">
                            <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-[var(--gray-900)]">{p.title}</div>
                            <div className="text-xs text-[var(--gray-400)]">/{p.slug}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.is_published ? 'bg-[var(--success-bg)] text-[var(--success)]' : 'bg-[var(--warning-bg)] text-[var(--warning)]'}`}>{p.is_published ? 'منشورة' : 'مسودة'}</span>
                          <div className="flex gap-1.5">
                            <Link href={'/dashboard/' + p.id} className="px-3 py-1.5 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white rounded-xl text-[11px] font-semibold hover:shadow-md transition-all duration-300">تعديل</Link>
                            <button onClick={() => togglePublish(p.id, p.is_published)} className="px-3 py-1.5 bg-[var(--gray-100)] text-[var(--gray-600)] rounded-xl text-[11px] font-semibold hover:bg-[var(--gray-200)] transition-all duration-300">{p.is_published ? 'إلغاء' : 'نشر'}</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-7 py-16 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-[var(--gray-100)] flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[var(--gray-300)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                    </div>
                    <h3 className="text-base font-bold text-[var(--gray-900)] mb-2">لا توجد صفحات بعد</h3>
                    <p className="text-sm text-[var(--gray-400)] mb-5">ابدأ بإنشاء صفحتك الأولى</p>
                    <button onClick={() => setShowNewPage(true)} className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white px-6 py-2.5 rounded-2xl text-sm font-semibold hover:shadow-lg hover:shadow-[var(--primary)]/25 transition-all duration-300">+ إنشاء صفحة</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {section === 'pages' && (
            <div className="space-y-7 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-extrabold text-[var(--gray-900)]">صفحاتي</h2>
                  <p className="text-sm text-[var(--gray-400)] mt-1">{pages.length} صفحة</p>
                </div>
                <button onClick={() => setShowNewPage(true)} className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white px-5 py-2.5 rounded-2xl text-sm font-semibold hover:shadow-lg hover:shadow-[var(--primary)]/25 transition-all duration-300">+ صفحة جديدة</button>
              </div>
              {pages.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[var(--gray-100)] py-16 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-[var(--gray-100)] flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[var(--gray-300)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">لا توجد صفحات</h3>
                  <p className="text-sm text-[var(--gray-400)] mb-5">ابدأ بإنشاء صفحتك الأولى</p>
                  <button onClick={() => setShowNewPage(true)} className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:shadow-lg hover:shadow-[var(--primary)]/25 transition-all duration-300">+ إنشاء صفحة</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {pages.map(p => (
                    <div key={p.id} className="bg-white rounded-3xl border border-[var(--gray-100)] p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-500 group">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.is_published ? 'bg-[var(--success-bg)] text-[var(--success)]' : 'bg-[var(--warning-bg)] text-[var(--warning)]'}`}>{p.is_published ? 'منشورة' : 'مسودة'}</span>
                        <button onClick={() => deletePage(p.id)} className="p-1.5 rounded-xl hover:bg-[var(--danger-bg)] text-[var(--gray-300)] hover:text-[var(--danger)] transition-all duration-300 opacity-0 group-hover:opacity-100">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-[var(--primary-bg)] flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                      </div>
                      <h3 className="text-sm font-bold text-[var(--gray-900)] mb-1">{p.title}</h3>
                      <p className="text-xs text-[var(--gray-400)] mb-4">/{p.slug} · {p.views} مشاهدة</p>
                      <div className="flex gap-2">
                        <Link href={'/dashboard/' + p.id} className="flex-1 px-3 py-2 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white rounded-xl text-xs font-semibold text-center hover:shadow-md transition-all duration-300">فتح المحرر</Link>
                        <button onClick={() => togglePublish(p.id, p.is_published)} className="px-3 py-2 bg-[var(--gray-100)] text-[var(--gray-600)] rounded-xl text-xs font-semibold hover:bg-[var(--gray-200)] transition-all duration-300">{p.is_published ? 'إلغاء' : 'نشر'}</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === 'templates' && (
            <div className="space-y-7 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-extrabold text-[var(--gray-900)]">القوالب الجاهزة</h2>
                <p className="text-sm text-[var(--gray-400)] mt-1">اختر قالباً لبدء بناء صفحتك بسرعة</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {templates.map(t => (
                  <div key={t.id} onClick={() => createFromTemplate(t.id)} className="bg-white border border-[var(--gray-100)] rounded-3xl p-6 cursor-pointer hover:border-[var(--primary)] hover:shadow-lg transition-all duration-500 group">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--primary-bg)] flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{t.thumbnail}</div>
                    <h3 className="text-sm font-bold text-[var(--gray-900)] mb-1">{t.name}</h3>
                    <p className="text-xs text-[var(--gray-400)]">{t.nameEn}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'settings' && (
            <div className="space-y-7 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-extrabold text-[var(--gray-900)]">الإعدادات</h2>
                <p className="text-sm text-[var(--gray-400)] mt-1">تعديل معلومات حسابك</p>
              </div>
              <div className="bg-white rounded-3xl border border-[var(--gray-100)] p-7 max-w-lg">
                <SettingsForm user={user} showToast={showToast} />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* New Page Modal */}
      {showNewPage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewPage(false)}>
          <div className="bg-white rounded-3xl w-full max-w-sm p-7 shadow-2xl animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-extrabold text-[var(--gray-900)]">صفحة جديدة</h3>
              <button onClick={() => setShowNewPage(false)} className="w-8 h-8 rounded-xl hover:bg-[var(--gray-100)] flex items-center justify-center text-[var(--gray-400)] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <label className="block text-xs font-semibold text-[var(--gray-600)] mb-2">عنوان الصفحة</label>
            <input value={pageTitle} onChange={e => setPageTitle(e.target.value)} placeholder="مثال: صفحتي الشخصية"
              className="w-full px-5 py-3.5 border-2 border-[var(--gray-200)] rounded-2xl text-sm focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all duration-300 mb-5" />
            <button onClick={createPage} className="w-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white py-3.5 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-[var(--primary)]/25 transition-all duration-300">إنشاء وفتح المحرر</button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="fixed bottom-6 right-6 bg-[var(--gray-900)] text-white px-5 py-3.5 rounded-2xl text-sm font-medium z-50 shadow-2xl flex items-center gap-2.5 animate-slideUp"><svg className="w-4 h-4 text-[var(--success)]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>{toast}</div>}
    </div>
  );
}

function SettingsForm({ user, showToast }: { user: User; showToast: (m: string) => void }) {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const r = await fetch('/api/auth/me', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, username, bio }) });
    const d = await r.json(); setSaving(false);
    if (d.user) showToast('تم الحفظ'); else showToast(d.error || 'خطأ');
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-[var(--gray-600)] mb-2">الاسم</label>
        <input value={name} onChange={e => setName(e.target.value)} className="w-full px-5 py-3.5 border-2 border-[var(--gray-200)] rounded-2xl text-sm focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all duration-300" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--gray-600)] mb-2">اسم المستخدم</label>
        <input value={username} onChange={e => setUsername(e.target.value)} className="w-full px-5 py-3.5 border-2 border-[var(--gray-200)] rounded-2xl text-sm focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all duration-300" />
        <p className="text-xs text-[var(--gray-400)] mt-1.5">صفحتك: <span className="text-[var(--primary)] font-semibold">{username}.buildora.vexonet.online</span></p>
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--gray-600)] mb-2">نبذة عنك</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full px-5 py-3.5 border-2 border-[var(--gray-200)] rounded-2xl text-sm focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all duration-300 min-h-[90px] resize-none" placeholder="اكتب شيئاً عنك..." />
      </div>
      <button type="submit" disabled={saving} className="w-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/35 disabled:opacity-50">{saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</button>
    </form>
  );
}
