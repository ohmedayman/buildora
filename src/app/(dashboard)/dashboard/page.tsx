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

function getPageGradient(title: string) {
  const gradients = [
    'linear-gradient(135deg, #1B6B4A 0%, #22C55E 100%)',
    'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)',
    'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
    'linear-gradient(135deg, #DC2626 0%, #F87171 100%)',
    'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
    'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)',
    'linear-gradient(135deg, #9333EA 0%, #C084FC 100%)',
    'linear-gradient(135deg, #DB2777 0%, #F472B6 100%)',
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
  return gradients[Math.abs(hash) % gradients.length];
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9FAFB' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--primary)', boxShadow: '0 4px 14px rgba(27,107,74,0.3)' }}>
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'overview' as const, label: 'نظرة عامة', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> },
    { id: 'pages' as const, label: 'صفحاتي', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> },
    { id: 'templates' as const, label: 'القوالب', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg> },
    { id: 'messages' as const, label: 'الرسائل', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> },
    { id: 'settings' as const, label: 'الإعدادات', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
  ];

  const sidebarWidth = sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed)';

  return (
    <div className="min-h-screen" style={{ background: '#F9FAFB' }} dir="rtl">
      {/* Sidebar */}
      <aside
        className="fixed top-0 right-0 h-screen z-40 flex flex-col transition-all duration-300"
        style={{
          width: sidebarWidth,
          background: 'white',
          borderLeft: '1px solid #E5E7EB',
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5" style={{ borderBottom: '1px solid #F3F4F6' }}>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary)', boxShadow: '0 2px 8px rgba(27,107,74,0.25)' }}>
              <span className="text-white font-bold text-sm">B</span>
            </div>
            {sidebarOpen && <span className="text-[16px] font-bold" style={{ color: '#111827' }}>Buildora</span>}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {sidebarOpen && (
            <div className="px-3 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>القائمة</span>
            </div>
          )}
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200"
              style={{
                background: section === item.id ? 'var(--primary-bg)' : 'transparent',
                color: section === item.id ? 'var(--primary)' : '#6B7280',
              }}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-right">{item.label}</span>
                  {item.id === 'pages' && pages.length > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'var(--primary-100)', color: 'var(--primary)' }}>{pages.length}</span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-3" style={{ borderTop: '1px solid #F3F4F6' }}>
          {sidebarOpen ? (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: '#F9FAFB' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: 'var(--primary)' }}>
                {user.name?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold truncate" style={{ color: '#111827' }}>{user.name}</div>
                <div className="text-[11px] truncate" style={{ color: '#9CA3AF' }}>{user.email}</div>
              </div>
              <button onClick={logout} className="p-1.5 rounded-md transition-colors" style={{ color: '#9CA3AF' }} title="تسجيل الخروج">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
              </button>
            </div>
          ) : (
            <button onClick={logout} className="w-full flex items-center justify-center p-2.5 rounded-lg transition-colors" style={{ color: '#9CA3AF' }} title="تسجيل الخروج">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="transition-all duration-300" style={{ marginRight: sidebarWidth }}>
        {/* Header */}
        <header className="h-16 sticky top-0 z-30 flex items-center justify-between px-6" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E5E7EB' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg transition-colors" style={{ color: '#6B7280' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            <h1 className="text-[16px] font-bold" style={{ color: '#111827' }}>
              {section === 'overview' && 'نظرة عامة'}
              {section === 'pages' && 'صفحاتي'}
              {section === 'templates' && 'القوالب'}
              {section === 'messages' && 'الرسائل'}
              {section === 'settings' && 'الإعدادات'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { navigator.clipboard.writeText(`https://${sub}.${BASE}`); showToast('تم نسخ رابط صفحتك!'); }}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors"
              style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              <span className="max-w-[120px] truncate">{sub}.{BASE}</span>
            </button>
            <button onClick={() => setShowNewPage(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-all" style={{ background: 'var(--primary)', boxShadow: '0 2px 8px rgba(27,107,74,0.25)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              صفحة جديدة
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {section === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Welcome */}
              <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'linear-gradient(135deg, #1B6B4A 0%, #22C55E 100%)', boxShadow: '0 4px 20px rgba(27,107,74,0.2)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">مرحباً {user.name} 👋</h2>
                    <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.8)' }}>إليك ملخص صفحتك — أنشئ ونشر صفحاتك الاحترافية</p>
                  </div>
                  <a
                    href={`https://${sub}.${BASE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                    style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    زيارة صفحتي
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'إجمالي الصفحات', value: stats.totalPages, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>, color: '#1B6B4A', bg: '#F0FDF4' },
                  { label: 'صفحات منشورة', value: stats.publishedPages, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, color: '#059669', bg: '#ECFDF5' },
                  { label: 'إجمالي المشاهدات', value: stats.totalViews, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>, color: '#D97706', bg: '#FFFBEB' },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl p-5 transition-all" style={{ background: 'white', border: '1px solid #E5E7EB' }}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: s.bg, color: s.color }}>
                        {s.icon}
                      </div>
                      <div>
                        <div className="text-[28px] font-bold" style={{ color: '#111827', lineHeight: 1.1 }}>{s.value}</div>
                        <div className="text-[12px] font-medium mt-0.5" style={{ color: '#6B7280' }}>{s.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Pages */}
              <div className="rounded-xl" style={{ background: 'white', border: '1px solid #E5E7EB' }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <h3 className="text-[14px] font-bold" style={{ color: '#111827' }}>آخر الصفحات</h3>
                  {pages.length > 0 && (
                    <button onClick={() => setSection('pages')} className="text-[12px] font-semibold" style={{ color: 'var(--primary)' }}>
                      عرض الكل ←
                    </button>
                  )}
                </div>
                {pages.length > 0 ? (
                  <div>
                    {pages.slice(0, 5).map((p, idx) => (
                      <div key={p.id} className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: idx < Math.min(pages.length, 5) - 1 ? '1px solid #F3F4F6' : 'none' }}>
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: getPageGradient(p.title) }}>
                            {p.title[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold truncate" style={{ color: '#111827' }}>{p.title}</div>
                            <div className="text-[11px]" style={{ color: '#9CA3AF' }}>/{p.slug} · {formatDate(p.updated_at)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold" style={p.is_published ? { background: '#ECFDF5', color: '#059669' } : { background: '#F3F4F6', color: '#6B7280' }}>
                            {p.is_published ? 'منشورة' : 'مسودة'}
                          </span>
                          <Link href={'/dashboard/' + p.id} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors" style={{ background: '#F3F4F6', color: '#374151' }}>
                            تعديل
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#F3F4F6' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <p className="text-[14px] font-medium mb-1" style={{ color: '#374151' }}>لم تنشئ أي صفحة بعد</p>
                    <p className="text-[12px] mb-4" style={{ color: '#9CA3AF' }}>ابدأ بإنشاء صفحتك الأولى الآن</p>
                    <button onClick={() => setShowNewPage(true)} className="px-5 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all" style={{ background: 'var(--primary)', boxShadow: '0 2px 8px rgba(27,107,74,0.25)' }}>
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
                <div className="rounded-xl py-20 text-center" style={{ background: 'white', border: '1px solid #E5E7EB' }}>
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#F3F4F6' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <h3 className="text-[16px] font-bold mb-1" style={{ color: '#111827' }}>لا توجد صفحات</h3>
                  <p className="text-[13px] mb-5" style={{ color: '#9CA3AF' }}>ابدأ بإنشاء صفحتك الأولى</p>
                  <button onClick={() => setShowNewPage(true)} className="px-5 py-2.5 rounded-lg text-[13px] font-semibold text-white" style={{ background: 'var(--primary)' }}>
                    + صفحة جديدة
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {pages.map(p => (
                    <div key={p.id} className="rounded-xl overflow-hidden transition-all" style={{ background: 'white', border: '1px solid #E5E7EB' }}>
                      <div className="h-40 relative" style={{ background: getPageGradient(p.title) }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white/10 text-7xl font-bold">{p.title[0]}</span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                            {p.is_published ? 'منشورة' : 'مسودة'}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 translate-y-2 transition-all" style={{ opacity: 1, transform: 'translateY(0)' }}>
                          <Link href={'/dashboard/' + p.id} className="flex-1 py-2 bg-white rounded-lg text-[11px] font-bold text-center" style={{ color: '#111827' }}>
                            تعديل
                          </Link>
                          {p.is_published && (
                            <a href={`https://${sub}.${BASE}/p/${p.slug}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 rounded-lg text-[11px] font-bold text-center" style={{ background: 'rgba(255,255,255,0.9)', color: '#111827' }}>
                              عرض
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-[14px] font-bold truncate" style={{ color: '#111827' }}>{p.title}</h3>
                            <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>/{p.slug}</p>
                          </div>
                          <button onClick={() => deletePage(p.id)} className="p-1.5 rounded-md transition-colors" style={{ color: '#D1D5DB' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </div>
                        <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
                          <span className="text-[11px]" style={{ color: '#9CA3AF' }}>{p.views} مشاهدة</span>
                          <span style={{ color: '#D1D5DB' }}>·</span>
                          <span className="text-[11px]" style={{ color: '#9CA3AF' }}>{formatDate(p.updated_at)}</span>
                          <span className="mr-auto" />
                          <button
                            onClick={() => togglePublish(p.id, p.is_published)}
                            className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
                            style={p.is_published
                              ? { background: '#F3F4F6', color: '#374151' }
                              : { background: 'var(--primary)', color: 'white', boxShadow: '0 2px 6px rgba(27,107,74,0.2)' }
                            }
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
                <h2 className="text-xl font-bold" style={{ color: '#111827' }}>اختر قالباً</h2>
                <p className="text-[13px] mt-1" style={{ color: '#6B7280' }}>ابدأ بسرعة مع قوالب احترافية جاهزة</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {templates.map(t => (
                  <button key={t.id} onClick={() => createFromTemplate(t.id)} className="rounded-xl p-5 text-right transition-all" style={{ background: 'white', border: '1px solid #E5E7EB' }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3" style={{ background: '#F0FDF4' }}>
                      {t.thumbnail}
                    </div>
                    <h3 className="text-[13px] font-bold" style={{ color: '#111827' }}>{t.name}</h3>
                    <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{t.nameEn}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {section === 'settings' && (
            <div className="space-y-5 animate-fadeIn max-w-lg">
              <div>
                <h2 className="text-xl font-bold" style={{ color: '#111827' }}>الإعدادات</h2>
                <p className="text-[13px] mt-1" style={{ color: '#6B7280' }}>تعديل معلومات حسابك</p>
              </div>
              <div className="rounded-xl p-6" style={{ background: 'white', border: '1px solid #E5E7EB' }}>
                <SettingsForm user={user} showToast={showToast} />
              </div>
            </div>
          )}

          {section === 'messages' && <MessagesSection showToast={showToast} />}
        </main>
      </div>

      {/* Modal */}
      {showNewPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setShowNewPage(false)}>
          <div className="rounded-2xl w-full max-w-sm p-6" style={{ background: 'white', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-bold" style={{ color: '#111827' }}>صفحة جديدة</h3>
              <button onClick={() => setShowNewPage(false)} className="p-2 rounded-lg transition-colors" style={{ color: '#9CA3AF' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <label className="block text-[12px] font-semibold mb-2" style={{ color: '#374151' }}>عنوان الصفحة</label>
            <input
              value={pageTitle}
              onChange={e => setPageTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createPage()}
              placeholder="مثال: صفحتي الشخصية"
              className="w-full px-4 py-3 rounded-lg text-[13px] outline-none transition-all"
              style={{ border: '1.5px solid #E5E7EB', background: '#F9FAFB' }}
              autoFocus
            />
            <button onClick={createPage} className="w-full mt-4 py-3 rounded-lg text-[14px] font-semibold text-white" style={{ background: 'var(--primary)', boxShadow: '0 2px 8px rgba(27,107,74,0.25)' }}>
              إنشاء وفتح المحرر
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slideUp px-5 py-3 rounded-xl text-[13px] font-semibold text-white" style={{ background: '#111827', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
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
          <h2 className="text-xl font-bold" style={{ color: '#111827' }}>الرسائل</h2>
          <p className="text-[13px] mt-1" style={{ color: '#6B7280' }}>{messages.length} رسالة</p>
        </div>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#F3F4F6' }}>
          {(['all', 'new', 'read'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-4 py-2 rounded-md text-[12px] font-semibold transition-all" style={filter === f ? { background: 'white', color: '#111827', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { color: '#6B7280' }}>
              {f === 'all' ? 'الكل' : f === 'new' ? 'جديدة' : 'مقروءة'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16" style={{ color: '#9CA3AF' }}>جاري التحميل...</div>
      ) : messages.length === 0 ? (
        <div className="rounded-xl py-16 text-center" style={{ background: 'white', border: '1px solid #E5E7EB' }}>
          <p className="text-[14px] font-medium" style={{ color: '#6B7280' }}>لا توجد رسائل</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg: any) => (
            <div key={msg.id} className="rounded-xl p-5 transition-all" style={{ background: 'white', border: '1px solid #E5E7EB', borderRightWidth: msg.status === 'new' ? '3px' : '1px', borderRightColor: msg.status === 'new' ? 'var(--primary)' : '#E5E7EB' }}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-[14px] font-bold" style={{ color: '#111827' }}>{msg.name}</span>
                    <span className="text-[11px]" style={{ color: '#9CA3AF' }}>{msg.email}</span>
                    {msg.status === 'new' && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: '#ECFDF5', color: '#059669' }}>جديد</span>}
                  </div>
                  {msg.pages && <div className="text-[11px] mb-1.5" style={{ color: '#9CA3AF' }}>من صفحة: {msg.pages.title}</div>}
                  <p className="text-[13px] leading-relaxed mt-2" style={{ color: '#4B5563' }}>{msg.message}</p>
                  <div className="text-[10px] mt-2" style={{ color: '#9CA3AF' }}>{new Date(msg.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div className="flex gap-1.5 mr-3">
                  {msg.status === 'new' && <button onClick={() => markRead(msg.id)} className="p-2 rounded-md transition-colors" style={{ color: '#9CA3AF' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 13l4 4L19 7"/></svg></button>}
                  <button onClick={() => deleteMessage(msg.id)} className="p-2 rounded-md transition-colors" style={{ color: '#9CA3AF' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
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
    <form onSubmit={save} className="space-y-5">
      <div>
        <label className="block text-[12px] font-semibold mb-2" style={{ color: '#374151' }}>الاسم</label>
        <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-lg text-[13px] outline-none transition-all" style={{ border: '1.5px solid #E5E7EB', background: '#F9FAFB' }} />
      </div>
      <div>
        <label className="block text-[12px] font-semibold mb-2" style={{ color: '#374151' }}>اسم المستخدم</label>
        <input value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-lg text-[13px] outline-none transition-all" style={{ border: '1.5px solid #E5E7EB', background: '#F9FAFB' }} />
        <p className="text-[11px] mt-2" style={{ color: '#9CA3AF' }}>صفحتك: <span className="font-semibold" style={{ color: 'var(--primary)' }}>{username}.buildora.vexonet.online</span></p>
      </div>
      <div>
        <label className="block text-[12px] font-semibold mb-2" style={{ color: '#374151' }}>نبذة عنك</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full px-4 py-3 rounded-lg text-[13px] outline-none transition-all min-h-[80px] resize-none" style={{ border: '1.5px solid #E5E7EB', background: '#F9FAFB' }} placeholder="اكتب شيئاً عنك..." />
      </div>
      <div className="pt-4" style={{ borderTop: '1px solid #F3F4F6' }}>
        <label className="block text-[12px] font-semibold mb-2" style={{ color: '#374151' }}>دومين مخصص (Custom Domain)</label>
        <input value={customDomain} onChange={e => setCustomDomain(e.target.value)} className="w-full px-4 py-3 rounded-lg text-[13px] outline-none transition-all" style={{ border: '1.5px solid #E5E7EB', background: '#F9FAFB' }} placeholder="www.example.com" />
        <p className="text-[11px] mt-2" style={{ color: '#9CA3AF' }}>أضف CNAME record يشير إلى <span className="font-semibold" style={{ color: '#374151' }}>cname.vercel-dns.com</span></p>
      </div>
      <button type="submit" disabled={saving} className="w-full py-3 rounded-lg text-[14px] font-semibold text-white transition-all disabled:opacity-50" style={{ background: 'var(--primary)', boxShadow: '0 2px 8px rgba(27,107,74,0.25)' }}>
        {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
      </button>
    </form>
  );
}
