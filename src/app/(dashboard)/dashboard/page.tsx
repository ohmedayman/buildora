'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User { id: string; name: string; username: string; email: string; plan: string; bio: string; }
interface Page { id: string; title: string; slug: string; is_published: boolean; views: number; updated_at: string; created_at: string; content?: string; }
interface Stats { totalPages: number; publishedPages: number; totalViews: number; }
interface Template { id: string; name: string; nameEn: string; thumbnail: string; category: string; content: string; }

function formatDate(d: string) {
  const date = new Date(d);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'الآن';
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;
  return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
}

function getPageColor(title: string) {
  const colors = [
    'from-indigo-500 to-purple-600',
    'from-cyan-500 to-blue-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-violet-500 to-purple-600',
    'from-sky-500 to-indigo-600',
    'from-fuchsia-500 to-pink-600',
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [stats, setStats] = useState<Stats>({ totalPages: 0, publishedPages: 0, totalViews: 0 });
  const [templates, setTemplates] = useState<Template[]>([]);
  const [section, setSection] = useState<'overview' | 'pages' | 'templates' | 'settings' | 'messages'>('overview');
  const [showNewPage, setShowNewPage] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const [toast, setToast] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const BASE = 'buildora.vexonet.online';

  useEffect(() => {
    fetch('/api/auth/me').then(r => { if (!r.ok) throw ''; return r.json(); })
      .then(d => { setUser(d.user); loadData(); })
      .catch(() => router.push('/login'));
  }, [router]);

  async function loadData() {
    try {
      const [pagesRes, templatesRes] = await Promise.all([fetch('/api/pages'), fetch('/api/templates')]);
      const pagesData = await pagesRes.json();
      const templatesData = await templatesRes.json();
      const p = pagesData.pages || [];
      setPages(p);
      setTemplates(templatesData.templates || []);
      setStats({
        totalPages: p.length,
        publishedPages: p.filter((x: Page) => x.is_published).length,
        totalViews: p.reduce((s: number, x: Page) => s + (x.views || 0), 0),
      });
    } catch {}
    setLoading(false);
  }

  async function createPage() {
    if (!pageTitle.trim()) return;
    const r = await fetch('/api/pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: pageTitle }) });
    const d = await r.json();
    if (d.page) { setShowNewPage(false); setPageTitle(''); router.push('/dashboard/' + d.page.id); }
    else showToast(d.error || 'حدث خطأ');
  }

  async function createFromTemplate(id: string) {
    const tpl = templates.find(t => t.id === id);
    if (!tpl) return;
    const r = await fetch('/api/pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: tpl.name }) });
    const d = await r.json();
    if (d.page) {
      await fetch('/api/pages/' + d.page.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: tpl.content }) });
      router.push('/dashboard/' + d.page.id);
    }
  }

  async function togglePublish(id: string, current: boolean) {
    await fetch('/api/pages/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_published: !current }) });
    loadData();
    showToast(current ? 'تم إلغاء النشر' : 'تم النشر بنجاح');
  }

  async function deletePage(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟')) return;
    await fetch('/api/pages/' + id, { method: 'DELETE' });
    loadData();
    showToast('تم حذف الصفحة');
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  const sub = user?.username || user?.name?.toLowerCase().replace(/\s+/g, '') || '';

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--gray-50)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[var(--gray-400)]">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'overview' as const, label: 'نظرة عامة', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="2" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="11" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/></svg> },
    { id: 'pages' as const, label: 'صفحاتي', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 3.5A1.5 1.5 0 015.5 2h3.879a1.5 1.5 0 011.06.44l1.122 1.12A1.5 1.5 0 0012.62 4H14.5A1.5 1.5 0 0116 5.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 014 14.5v-11z" stroke="currentColor" strokeWidth="1.5"/></svg> },
    { id: 'templates' as const, label: 'القوالب', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="2.5" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2.5 8h15M8 2.5v15" stroke="currentColor" strokeWidth="1.5"/></svg> },
    { id: 'messages' as const, label: 'الرسائل', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 4.5A1.5 1.5 0 014.5 3h11A1.5 1.5 0 0117 4.5v7a1.5 1.5 0 01-1.5 1.5H6l-3 2.5V4.5z" stroke="currentColor" strokeWidth="1.5"/></svg> },
    { id: 'settings' as const, label: 'الإعدادات', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M3.46 3.46l1.42 1.42M15.12 15.12l1.42 1.42M3.46 16.54l1.42-1.42M15.12 4.88l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  ];

  const sidebarWidth = sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed)';

  return (
    <div className="min-h-screen bg-[var(--gray-50)]" dir="rtl">
      {/* Sidebar */}
      <aside
        className="fixed top-0 right-0 h-screen bg-white border-l border-[var(--gray-200)] z-40 flex flex-col transition-all duration-300 ease-in-out"
        style={{ width: sidebarWidth }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-[var(--gray-100)]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            {sidebarOpen && <span className="text-[15px] font-bold text-[var(--gray-900)]">Buildora</span>}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                section === item.id
                  ? 'bg-[var(--primary-bg)] text-[var(--primary)] font-semibold'
                  : 'text-[var(--gray-500)] hover:bg-[var(--gray-50)] hover:text-[var(--gray-700)]'
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-right">{item.label}</span>
                  {item.id === 'pages' && pages.length > 0 && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-[var(--gray-100)] text-[var(--gray-500)] font-medium">{pages.length}</span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-[var(--gray-100)]">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--gray-50)] transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.name?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[var(--gray-800)] truncate">{user.name}</div>
                <div className="text-[11px] text-[var(--gray-400)] truncate">{user.email}</div>
              </div>
              <button onClick={logout} className="p-1.5 rounded-md hover:bg-[var(--danger-bg)] text-[var(--gray-400)] hover:text-[var(--danger)] transition-colors" title="تسجيل الخروج">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 14H3.333A1.333 1.333 0 012 12.667V3.333A1.333 1.333 0 013.333 2H6M10.667 11.333L14 8l-3.333-3.333M14 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          ) : (
            <button onClick={logout} className="w-full flex items-center justify-center p-2.5 rounded-lg hover:bg-[var(--danger-bg)] text-[var(--gray-400)] hover:text-[var(--danger)] transition-colors" title="تسجيل الخروج">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M6 14H3.333A1.333 1.333 0 012 12.667V3.333A1.333 1.333 0 013.333 2H6M10.667 11.333L14 8l-3.333-3.333M14 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="transition-all duration-300 ease-in-out" style={{ marginRight: sidebarWidth }}>
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-[var(--gray-200)] sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-[var(--gray-100)] text-[var(--gray-500)] transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            <div>
              <h1 className="text-[15px] font-semibold text-[var(--gray-900)]">
                {section === 'overview' && 'نظرة عامة'}
                {section === 'pages' && 'صفحاتي'}
                {section === 'templates' && 'القوالب'}
                {section === 'messages' && 'الرسائل'}
                {section === 'settings' && 'الإعدادات'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { navigator.clipboard.writeText(`https://${sub}.${BASE}`); showToast('تم نسخ رابط صفحتك!'); }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--gray-200)] hover:bg-[var(--gray-50)] text-[var(--gray-500)] text-[12px] font-medium transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.25 8.75L8.75 5.25M6.125 2.625H3.5a1.75 1.75 0 00-1.75 1.75v6.125a1.75 1.75 0 001.75 1.75h6.125a1.75 1.75 0 001.75-1.75V8.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="max-w-[120px] truncate">{sub}.{BASE}</span>
            </button>
            <button onClick={() => setShowNewPage(true)} className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg text-[13px] font-semibold transition-colors shadow-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              صفحة جديدة
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {section === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Welcome */}
              <div className="bg-white rounded-xl border border-[var(--gray-200)] p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--gray-900)]">مرحباً {user.name} 👋</h2>
                    <p className="text-[13px] text-[var(--gray-500)] mt-1">إليك ملخص صفحتك — أنشئ ونشر صفحاتك الاحترافية</p>
                  </div>
                  <a
                    href={`https://${sub}.${BASE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--gray-200)] rounded-lg text-[13px] font-medium text-[var(--gray-600)] hover:bg-[var(--gray-50)] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.25 8.75L8.75 5.25M6.125 2.625H3.5a1.75 1.75 0 00-1.75 1.75v6.125a1.75 1.75 0 001.75 1.75h6.125a1.75 1.75 0 001.75-1.75V8.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    زيارة صفحتي
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'إجمالي الصفحات', value: stats.totalPages, icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 3.5A1.5 1.5 0 015.5 2h3.879a1.5 1.5 0 011.06.44l1.122 1.12A1.5 1.5 0 0012.62 4H14.5A1.5 1.5 0 0116 5.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 014 14.5v-11z" stroke="currentColor" strokeWidth="1.3"/></svg>, color: 'var(--primary)', bg: 'var(--primary-bg)' },
                  { label: 'صفحات منشورة', value: stats.publishedPages, icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.3"/><path d="M6.5 10l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>, color: 'var(--success)', bg: 'var(--success-bg)' },
                  { label: 'إجمالي المشاهدات', value: stats.totalViews, icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4C4.5 4 1.5 10 1.5 10s3 6 8.5 6 8.5-6 8.5-6-3-6-8.5-6z" stroke="currentColor" strokeWidth="1.3"/><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.3"/></svg>, color: 'var(--accent)', bg: 'var(--accent-bg)' },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-xl border border-[var(--gray-200)] p-5 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: s.bg, color: s.color }}>
                        {s.icon}
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[var(--gray-900)]">{s.value}</div>
                        <div className="text-[12px] text-[var(--gray-500)] font-medium">{s.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Pages */}
              <div className="bg-white rounded-xl border border-[var(--gray-200)]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--gray-100)]">
                  <h3 className="text-[14px] font-semibold text-[var(--gray-900)]">آخر الصفحات</h3>
                  {pages.length > 0 && (
                    <button onClick={() => setSection('pages')} className="text-[12px] font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors">عرض الكل</button>
                  )}
                </div>
                {pages.length > 0 ? (
                  <div className="divide-y divide-[var(--gray-100)]">
                    {pages.slice(0, 5).map(p => (
                      <div key={p.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-[var(--gray-25)] transition-colors group">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${getPageColor(p.title)} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}>
                            {p.title[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-[var(--gray-800)] truncate">{p.title}</div>
                            <div className="text-[11px] text-[var(--gray-400)]">/{p.slug} · {formatDate(p.updated_at)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${p.is_published ? 'bg-[var(--success-bg)] text-[var(--success)]' : 'bg-[var(--gray-100)] text-[var(--gray-500)]'}`}>
                            {p.is_published ? 'منشورة' : 'مسودة'}
                          </span>
                          <Link href={'/dashboard/' + p.id} className="px-2.5 py-1.5 rounded-md bg-[var(--gray-100)] text-[var(--gray-600)] text-[11px] font-medium hover:bg-[var(--primary)] hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                            تعديل
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-12 text-center">
                    <div className="w-12 h-12 rounded-xl bg-[var(--gray-100)] flex items-center justify-center mx-auto mb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" stroke="var(--gray-300)" strokeWidth="1.5"/><path d="M9 7h6M9 12h6M9 17h3" stroke="var(--gray-300)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </div>
                    <p className="text-[13px] text-[var(--gray-500)] mb-3">لم تنشئ أي صفحة بعد</p>
                    <button onClick={() => setShowNewPage(true)} className="text-[13px] font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors">
                      + إنشاء صفحتك الأولى
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {section === 'pages' && (
            <div className="space-y-5 animate-fadeIn">
              {pages.length === 0 ? (
                <div className="bg-white rounded-xl border border-[var(--gray-200)] py-16 text-center">
                  <div className="w-14 h-14 rounded-xl bg-[var(--gray-100)] flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" stroke="var(--gray-300)" strokeWidth="1.5"/><path d="M9 7h6M9 12h6M9 17h3" stroke="var(--gray-300)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                  <h3 className="text-[15px] font-semibold text-[var(--gray-800)] mb-1">لا توجد صفحات</h3>
                  <p className="text-[13px] text-[var(--gray-400)] mb-4">ابدأ بإنشاء صفحتك الأولى</p>
                  <button onClick={() => setShowNewPage(true)} className="px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg text-[13px] font-semibold transition-colors shadow-sm">
                    + صفحة جديدة
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {pages.map(p => (
                    <div key={p.id} className="bg-white rounded-xl border border-[var(--gray-200)] overflow-hidden hover:shadow-md transition-all duration-300 group">
                      {/* Preview Thumbnail */}
                      <div className={`h-36 bg-gradient-to-br ${getPageColor(p.title)} relative overflow-hidden`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white/20 text-6xl font-bold">{p.title[0]}</span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold backdrop-blur-sm ${p.is_published ? 'bg-white/20 text-white' : 'bg-black/20 text-white/80'}`}>
                            {p.is_published ? 'منشورة' : 'مسودة'}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
                          <Link href={'/dashboard/' + p.id} className="px-3 py-1.5 bg-white rounded-md text-[11px] font-semibold text-[var(--gray-800)] hover:bg-[var(--gray-50)] transition-colors shadow-sm">
                            تعديل
                          </Link>
                          {p.is_published && (
                            <a href={`https://${sub}.${BASE}/${p.slug}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white/90 rounded-md text-[11px] font-semibold text-[var(--gray-800)] hover:bg-white transition-colors shadow-sm">
                              عرض
                            </a>
                          )}
                        </div>
                      </div>
                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-[14px] font-semibold text-[var(--gray-800)] truncate">{p.title}</h3>
                            <p className="text-[11px] text-[var(--gray-400)] mt-0.5">/{p.slug}</p>
                          </div>
                          <button onClick={() => deletePage(p.id)} className="p-1.5 rounded-md hover:bg-[var(--danger-bg)] text-[var(--gray-300)] hover:text-[var(--danger)] transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.625 3.5h8.75M5.25 3.5V2.625a.875.875 0 01.875-.875h1.75a.875.875 0 01.875.875V3.5m2.625 0v7.875a1.75 1.75 0 01-1.75 1.75H4.375a1.75 1.75 0 01-1.75-1.75V3.5h9.75z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-[11px] text-[var(--gray-400)]">{p.views} مشاهدة</span>
                          <span className="text-[11px] text-[var(--gray-400)]">·</span>
                          <span className="text-[11px] text-[var(--gray-400)]">{formatDate(p.updated_at)}</span>
                          <span className="mr-auto" />
                          <button
                            onClick={() => togglePublish(p.id, p.is_published)}
                            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                              p.is_published
                                ? 'bg-[var(--gray-100)] text-[var(--gray-600)] hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]'
                                : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]'
                            }`}
                          >
                            {p.is_published ? 'إلغاء النشر' : 'نشر'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === 'templates' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-[var(--gray-900)]">اختر قالباً</h2>
                <p className="text-[13px] text-[var(--gray-500)] mt-1">ابدأ بسرعة مع قوالب احترافية جاهزة</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {templates.map(t => (
                  <button key={t.id} onClick={() => createFromTemplate(t.id)} className="bg-white border border-[var(--gray-200)] rounded-xl p-5 text-right hover:border-[var(--primary)] hover:shadow-md transition-all duration-200 group">
                    <div className="w-12 h-12 rounded-lg bg-[var(--primary-bg)] flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                      {t.thumbnail}
                    </div>
                    <h3 className="text-[13px] font-semibold text-[var(--gray-800)]">{t.name}</h3>
                    <p className="text-[11px] text-[var(--gray-400)] mt-0.5">{t.nameEn}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {section === 'settings' && (
            <div className="space-y-5 animate-fadeIn max-w-lg">
              <div>
                <h2 className="text-lg font-bold text-[var(--gray-900)]">الإعدادات</h2>
                <p className="text-[13px] text-[var(--gray-500)] mt-1">تعديل معلومات حسابك</p>
              </div>
              <div className="bg-white rounded-xl border border-[var(--gray-200)] p-5">
                <SettingsForm user={user} showToast={showToast} />
              </div>
            </div>
          )}

          {section === 'messages' && <MessagesSection showToast={showToast} />}
        </main>
      </div>

      {/* New Page Modal */}
      {showNewPage && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewPage(false)}>
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold text-[var(--gray-900)]">صفحة جديدة</h3>
              <button onClick={() => setShowNewPage(false)} className="p-1.5 rounded-lg hover:bg-[var(--gray-100)] text-[var(--gray-400)] transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
            <label className="block text-[12px] font-medium text-[var(--gray-600)] mb-1.5">عنوان الصفحة</label>
            <input
              value={pageTitle}
              onChange={e => setPageTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createPage()}
              placeholder="مثال: صفحتي الشخصية"
              className="w-full px-4 py-2.5 border border-[var(--gray-200)] rounded-lg text-[13px] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all mb-4"
              autoFocus
            />
            <button onClick={createPage} className="w-full py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg text-[13px] font-semibold transition-colors shadow-sm">
              إنشاء وفتح المحرر
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--gray-900)] text-white px-4 py-2.5 rounded-lg text-[13px] font-medium z-50 shadow-xl flex items-center gap-2 animate-slideUp">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="var(--success)" strokeWidth="1.5"/><path d="M5.5 8l2 2 3-3" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {toast}
        </div>
      )}
    </div>
  );
}

function MessagesSection({ showToast }: { showToast: (m: string) => void }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'read'>('all');

  useEffect(() => { loadMessages(); }, [filter]);

  async function loadMessages() {
    setLoading(true);
    const url = filter === 'all' ? '/api/messages' : `/api/messages?status=${filter}`;
    const r = await fetch(url);
    const d = await r.json();
    setMessages(d.messages || []);
    setLoading(false);
  }

  async function markRead(id: string) {
    await fetch('/api/messages/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'read' }) });
    loadMessages();
    showToast('تم تحديد كمقروء');
  }

  async function deleteMessage(id: string) {
    if (!confirm('هل أنت متأكد من حذف الرسالة؟')) return;
    await fetch('/api/messages/' + id, { method: 'DELETE' });
    loadMessages();
    showToast('تم حذف الرسالة');
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--gray-900)]">الرسائل</h2>
          <p className="text-[13px] text-[var(--gray-500)] mt-1">{messages.length} رسالة</p>
        </div>
        <div className="flex gap-1 bg-[var(--gray-100)] p-0.5 rounded-lg">
          {(['all', 'new', 'read'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition ${filter === f ? 'bg-white shadow-sm text-[var(--gray-800)]' : 'text-[var(--gray-500)]'}`}>
              {f === 'all' ? 'الكل' : f === 'new' ? 'جديدة' : 'مقروءة'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--gray-400)]">جاري التحميل...</div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--gray-200)] py-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-[13px] text-[var(--gray-500)]">لا توجد رسائل</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg: any) => (
            <div key={msg.id} className={`bg-white rounded-xl border p-4 transition ${msg.status === 'new' ? 'border-[var(--primary)]/30 border-l-[3px] border-l-[var(--primary)]' : 'border-[var(--gray-200)]'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[13px] font-semibold text-[var(--gray-800)]">{msg.name}</span>
                    <span className="text-[11px] text-[var(--gray-400)]">{msg.email}</span>
                    {msg.status === 'new' && <span className="px-1.5 py-0.5 bg-[var(--primary)] text-white text-[9px] font-bold rounded">جديد</span>}
                  </div>
                  {msg.pages && <div className="text-[11px] text-[var(--gray-400)] mb-1">من صفحة: {msg.pages.title}</div>}
                  <p className="text-[13px] text-[var(--gray-600)] mt-2">{msg.message}</p>
                  <div className="text-[10px] text-[var(--gray-400)] mt-2">{new Date(msg.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div className="flex gap-1 mr-3">
                  {msg.status === 'new' && <button onClick={() => markRead(msg.id)} className="p-1.5 rounded-md hover:bg-[var(--primary-bg)] text-[var(--gray-400)] hover:text-[var(--primary)] transition text-[11px]">✓</button>}
                  <button onClick={() => deleteMessage(msg.id)} className="p-1.5 rounded-md hover:bg-[var(--danger-bg)] text-[var(--gray-400)] hover:text-[var(--danger)] transition text-[11px]">✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsForm({ user, showToast }: { user: User; showToast: (m: string) => void }) {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [customDomain, setCustomDomain] = useState((user as any).custom_domain || '');
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload: Record<string, any> = { name, username, bio };
    if (customDomain) payload.custom_domain = customDomain;
    const r = await fetch('/api/auth/me', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const d = await r.json();
    setSaving(false);
    if (d.user) showToast('تم الحفظ'); else showToast(d.error || 'خطأ');
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div>
        <label className="block text-[12px] font-medium text-[var(--gray-600)] mb-1.5">الاسم</label>
        <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 border border-[var(--gray-200)] rounded-lg text-[13px] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all" />
      </div>
      <div>
        <label className="block text-[12px] font-medium text-[var(--gray-600)] mb-1.5">اسم المستخدم</label>
        <input value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-2.5 border border-[var(--gray-200)] rounded-lg text-[13px] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all" />
        <p className="text-[11px] text-[var(--gray-400)] mt-1">صفحتك: <span className="text-[var(--primary)] font-medium">{username}.buildora.vexonet.online</span></p>
      </div>
      <div>
        <label className="block text-[12px] font-medium text-[var(--gray-600)] mb-1.5">نبذة عنك</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full px-4 py-2.5 border border-[var(--gray-200)] rounded-lg text-[13px] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all min-h-[80px] resize-none" placeholder="اكتب شيئاً عنك..." />
      </div>
      <div className="pt-2 border-t border-[var(--gray-100)]">
        <label className="block text-[12px] font-medium text-[var(--gray-600)] mb-1.5">دومين مخصص (Custom Domain)</label>
        <input value={customDomain} onChange={e => setCustomDomain(e.target.value)} className="w-full px-4 py-2.5 border border-[var(--gray-200)] rounded-lg text-[13px] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all" placeholder="www.example.com" />
        <p className="text-[11px] text-[var(--gray-400)] mt-1">أضف CNAME record يشير إلى <span className="font-medium">cname.vercel-dns.com</span></p>
      </div>
      <button type="submit" disabled={saving} className="w-full py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg text-[13px] font-semibold transition-colors shadow-sm disabled:opacity-50">
        {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
      </button>
    </form>
  );
}
