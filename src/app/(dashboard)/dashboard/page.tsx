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
    'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
    'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
    'linear-gradient(135deg, #F97316 0%, #F59E0B 100%)',
    'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gray-50)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--gray-400)' }}>جاري التحميل...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'overview' as const, label: 'نظرة عامة', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="2.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="2" width="7" height="7" rx="2.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="11" width="7" height="7" rx="2.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="7" height="7" rx="2.5" stroke="currentColor" strokeWidth="1.5"/></svg> },
    { id: 'pages' as const, label: 'صفحاتي', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 3.5A1.5 1.5 0 015.5 2h3.879a1.5 1.5 0 011.06.44l1.122 1.12A1.5 1.5 0 0012.62 4H14.5A1.5 1.5 0 0116 5.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 014 14.5v-11z" stroke="currentColor" strokeWidth="1.5"/></svg> },
    { id: 'templates' as const, label: 'القوالب', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="2.5" width="15" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2.5 8h15M8 2.5v15" stroke="currentColor" strokeWidth="1.5"/></svg> },
    { id: 'messages' as const, label: 'الرسائل', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 4.5A1.5 1.5 0 014.5 3h11A1.5 1.5 0 0117 4.5v7a1.5 1.5 0 01-1.5 1.5H6l-3 2.5V4.5z" stroke="currentColor" strokeWidth="1.5"/></svg> },
    { id: 'settings' as const, label: 'الإعدادات', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M3.46 3.46l1.42 1.42M15.12 15.12l1.42 1.42M3.46 16.54l1.42-1.42M15.12 4.88l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  ];

  const sidebarWidth = sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed)';

  return (
    <div className="min-h-screen" style={{ background: 'var(--gray-50)' }} dir="rtl">
      {/* Sidebar */}
      <aside
        className="fixed top-0 right-0 h-screen z-40 flex flex-col transition-all duration-300"
        style={{
          width: sidebarWidth,
          background: 'var(--gradient-sidebar)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          boxShadow: sidebarOpen ? '-4px 0 24px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gradient-primary)', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
              <span className="text-white font-bold text-sm">B</span>
            </div>
            {sidebarOpen && <span className="text-[16px] font-bold text-white tracking-tight">Buildora</span>}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          {sidebarOpen && (
            <div className="px-3 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.25)' }}>القائمة الرئيسية</span>
            </div>
          )}
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`sidebar-item w-full ${section === item.id ? 'active' : ''}`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="flex-shrink-0 relative z-10">{item.icon}</span>
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-right relative z-10">{item.label}</span>
                  {item.id === 'pages' && pages.length > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold relative z-10" style={{ background: 'rgba(99,102,241,0.2)', color: 'var(--primary-light)' }}>{pages.length}</span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* User Card */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {sidebarOpen ? (
            <div className="p-3 rounded-xl transition-all duration-200" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                  {user.name?.[0] || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-white truncate">{user.name}</div>
                  <div className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{user.email}</div>
                </div>
                <button onClick={logout} className="p-2 rounded-lg transition-all duration-200" style={{ color: 'rgba(255,255,255,0.3)' }} title="تسجيل الخروج" onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#EF4444'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 14H3.333A1.333 1.333 0 012 12.667V3.333A1.333 1.333 0 013.333 2H6M10.667 11.333L14 8l-3.333-3.333M14 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          ) : (
            <button onClick={logout} className="w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200" style={{ color: 'rgba(255,255,255,0.3)' }} title="تسجيل الخروج" onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#EF4444'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M6 14H3.333A1.333 1.333 0 012 12.667V3.333A1.333 1.333 0 013.333 2H6M10.667 11.333L14 8l-3.333-3.333M14 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="transition-all duration-300" style={{ marginRight: sidebarWidth }}>
        {/* Top Header */}
        <header className="h-16 sticky top-0 z-30 flex items-center justify-between px-6 glass" style={{ borderBottom: '1px solid var(--gray-200)' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2.5 rounded-xl hover:bg-[var(--gray-100)] text-[var(--gray-500)] transition-all duration-200">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                {sidebarOpen ? (
                  <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                )}
              </svg>
            </button>
            <div>
              <h1 className="text-[16px] font-bold" style={{ color: 'var(--gray-900)' }}>
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
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium transition-all duration-200"
              style={{ border: '1.5px solid var(--gray-200)', color: 'var(--gray-600)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-200)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.color = 'var(--gray-600)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.25 8.75L8.75 5.25M6.125 2.625H3.5a1.75 1.75 0 00-1.75 1.75v6.125a1.75 1.75 0 001.75 1.75h6.125a1.75 1.75 0 001.75-1.75V8.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="max-w-[120px] truncate">{sub}.{BASE}</span>
            </button>
            <button onClick={() => setShowNewPage(true)} className="btn-primary flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              صفحة جديدة
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {section === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8" style={{ background: 'var(--gradient-primary)', boxShadow: '0 8px 32px -4px rgba(99,102,241,0.3)' }}>
                <div className="absolute top-0 left-0 w-64 h-64 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', transform: 'translate(-30%, -50%)' }} />
                <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', transform: 'translate(20%, 40%)' }} />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-[13px] font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>مرحباً بعودتك</div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{user.name} 👋</h2>
                    <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.7)' }}>إليك ملخص صفحتك — أنشئ ونشر صفحاتك الاحترافية</p>
                  </div>
                  <a
                    href={`https://${sub}.${BASE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.25 8.75L8.75 5.25M6.125 2.625H3.5a1.75 1.75 0 00-1.75 1.75v6.125a1.75 1.75 0 001.75 1.75h6.125a1.75 1.75 0 001.75-1.75V8.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    زيارة صفحتي
                  </a>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'إجمالي الصفحات', value: stats.totalPages, icon: <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M4 3.5A1.5 1.5 0 015.5 2h3.879a1.5 1.5 0 011.06.44l1.122 1.12A1.5 1.5 0 0012.62 4H14.5A1.5 1.5 0 0116 5.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 014 14.5v-11z" stroke="currentColor" strokeWidth="1.3"/></svg>, color: '#6366F1', gradient: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)' },
                  { label: 'صفحات منشورة', value: stats.publishedPages, icon: <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.3"/><path d="M6.5 10l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>, color: '#10B981', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.08) 100%)' },
                  { label: 'إجمالي المشاهدات', value: stats.totalViews, icon: <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M10 4C4.5 4 1.5 10 1.5 10s3 6 8.5 6 8.5-6 8.5-6-3-6-8.5-6z" stroke="currentColor" strokeWidth="1.3"/><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.3"/></svg>, color: '#06B6D4', gradient: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(59,130,246,0.08) 100%)' },
                ].map((s, i) => (
                  <div key={i} className="stat-card" style={{ background: 'white', border: '1px solid var(--gray-200)' }}>
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full" style={{ background: s.gradient, transform: 'translate(30%, -30%)' }} />
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="stat-icon" style={{ background: s.gradient, color: s.color }}>
                        {s.icon}
                      </div>
                      <div>
                        <div className="text-[28px] font-bold" style={{ color: 'var(--gray-900)', lineHeight: 1.1 }}>{s.value}</div>
                        <div className="text-[12px] font-medium mt-0.5" style={{ color: 'var(--gray-500)' }}>{s.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Pages */}
              <div className="card-modern">
                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--gray-100)' }}>
                  <h3 className="text-[15px] font-bold" style={{ color: 'var(--gray-900)' }}>آخر الصفحات</h3>
                  {pages.length > 0 && (
                    <button onClick={() => setSection('pages')} className="text-[12px] font-semibold transition-colors" style={{ color: 'var(--primary)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-hover)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--primary)'}>
                      عرض الكل ←
                    </button>
                  )}
                </div>
                {pages.length > 0 ? (
                  <div>
                    {pages.slice(0, 5).map((p, idx) => (
                      <div key={p.id} className="flex items-center justify-between px-6 py-4 transition-all duration-200 group" style={{ borderBottom: idx < Math.min(pages.length, 5) - 1 ? '1px solid var(--gray-100)' : 'none' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: getPageGradient(p.title), boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                            {p.title[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold truncate" style={{ color: 'var(--gray-800)' }}>{p.title}</div>
                            <div className="text-[11px] mt-0.5" style={{ color: 'var(--gray-400)' }}>/{p.slug} · {formatDate(p.updated_at)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className={`badge ${p.is_published ? 'badge-success' : 'badge-draft'}`}>
                            {p.is_published ? 'منشورة' : 'مسودة'}
                          </span>
                          <Link href={'/dashboard/' + p.id} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200" style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }} onMouseLeave={e => { e.currentTarget.style.background = 'var(--gray-100)'; e.currentTarget.style.color = 'var(--gray-600)'; }}>
                            تعديل
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--gray-100)' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" stroke="var(--gray-300)" strokeWidth="1.5"/><path d="M9 7h6M9 12h6M9 17h3" stroke="var(--gray-300)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </div>
                    <p className="text-[14px] font-medium mb-1" style={{ color: 'var(--gray-600)' }}>لم تنشئ أي صفحة بعد</p>
                    <p className="text-[12px] mb-4" style={{ color: 'var(--gray-400)' }}>ابدأ بإنشاء صفحتك الأولى الآن</p>
                    <button onClick={() => setShowNewPage(true)} className="btn-primary">
                      + إنشاء صفحتك الأولى
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {section === 'pages' && (
            <div className="space-y-6 animate-fadeIn">
              {pages.length === 0 ? (
                <div className="card-modern py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--gray-100)' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" stroke="var(--gray-300)" strokeWidth="1.5"/><path d="M9 7h6M9 12h6M9 17h3" stroke="var(--gray-300)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                  <h3 className="text-[16px] font-bold mb-1" style={{ color: 'var(--gray-800)' }}>لا توجد صفحات</h3>
                  <p className="text-[13px] mb-5" style={{ color: 'var(--gray-400)' }}>ابدأ بإنشاء صفحتك الأولى</p>
                  <button onClick={() => setShowNewPage(true)} className="btn-primary">
                    + صفحة جديدة
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {pages.map(p => (
                    <div key={p.id} className="page-card">
                      {/* Preview */}
                      <div className="page-preview" style={{ background: getPageGradient(p.title) }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white/10 text-7xl font-bold">{p.title[0]}</span>
                        </div>
                        <div className="absolute top-3 right-3 z-10">
                          <span className={`badge backdrop-blur-sm ${p.is_published ? 'badge-success' : 'badge-draft'}`} style={{ background: p.is_published ? 'rgba(16,185,129,0.2)' : 'rgba(0,0,0,0.3)', color: 'white' }}>
                            {p.is_published ? 'منشورة' : 'مسودة'}
                          </span>
                        </div>
                        <div className="page-actions">
                          <Link href={'/dashboard/' + p.id} className="flex-1 py-2 bg-white rounded-lg text-[11px] font-bold text-center transition-colors" style={{ color: 'var(--gray-800)' }}>
                            تعديل
                          </Link>
                          {p.is_published && (
                            <a href={`https://${sub}.${BASE}/p/${p.slug}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 rounded-lg text-[11px] font-bold text-center transition-colors" style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--gray-800)' }}>
                              عرض
                            </a>
                          )}
                        </div>
                      </div>
                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-[14px] font-bold truncate" style={{ color: 'var(--gray-800)' }}>{p.title}</h3>
                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--gray-400)' }}>/{p.slug}</p>
                          </div>
                          <button onClick={() => deletePage(p.id)} className="p-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0" style={{ color: 'var(--gray-300)' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-300)'; }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.625 3.5h8.75M5.25 3.5V2.625a.875.875 0 01.875-.875h1.75a.875.875 0 01.875.875V3.5m2.625 0v7.875a1.75 1.75 0 01-1.75 1.75H4.375a1.75 1.75 0 01-1.75-1.75V3.5h9.75z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                        </div>
                        <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: '1px solid var(--gray-100)' }}>
                          <span className="text-[11px]" style={{ color: 'var(--gray-400)' }}>{p.views} مشاهدة</span>
                          <span style={{ color: 'var(--gray-300)' }}>·</span>
                          <span className="text-[11px]" style={{ color: 'var(--gray-400)' }}>{formatDate(p.updated_at)}</span>
                          <span className="mr-auto" />
                          <button
                            onClick={() => togglePublish(p.id, p.is_published)}
                            className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all duration-200"
                            style={p.is_published
                              ? { background: 'var(--gray-100)', color: 'var(--gray-600)' }
                              : { background: 'var(--gradient-primary)', color: 'white', boxShadow: '0 2px 8px rgba(99,102,241,0.2)' }
                            }
                            onMouseEnter={e => {
                              if (p.is_published) { e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger)'; }
                              else { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.3)'; }
                            }}
                            onMouseLeave={e => {
                              if (p.is_published) { e.currentTarget.style.background = 'var(--gray-100)'; e.currentTarget.style.color = 'var(--gray-600)'; }
                              else { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(99,102,241,0.2)'; }
                            }}
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
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--gray-900)' }}>اختر قالباً</h2>
                <p className="text-[13px] mt-1" style={{ color: 'var(--gray-500)' }}>ابدأ بسرعة مع قوالب احترافية جاهزة</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {templates.map(t => (
                  <button key={t.id} onClick={() => createFromTemplate(t.id)} className="card-modern p-5 text-right transition-all duration-300 group" style={{ border: '1.5px solid var(--gray-200)' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-200)'; e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(99,102,241,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 transition-transform duration-300 group-hover:scale-110" style={{ background: 'var(--primary-bg)' }}>
                      {t.thumbnail}
                    </div>
                    <h3 className="text-[13px] font-bold" style={{ color: 'var(--gray-800)' }}>{t.name}</h3>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--gray-400)' }}>{t.nameEn}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {section === 'settings' && (
            <div className="space-y-6 animate-fadeIn max-w-lg">
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--gray-900)' }}>الإعدادات</h2>
                <p className="text-[13px] mt-1" style={{ color: 'var(--gray-500)' }}>تعديل معلومات حسابك</p>
              </div>
              <div className="card-modern p-6">
                <SettingsForm user={user} showToast={showToast} />
              </div>
            </div>
          )}

          {section === 'messages' && <MessagesSection showToast={showToast} />}
        </main>
      </div>

      {/* New Page Modal */}
      {showNewPage && (
        <div className="modal-overlay" onClick={() => setShowNewPage(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[16px] font-bold" style={{ color: 'var(--gray-900)' }}>صفحة جديدة</h3>
              <button onClick={() => setShowNewPage(false)} className="p-2 rounded-xl transition-all duration-200" style={{ color: 'var(--gray-400)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-100)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
            <label className="block text-[12px] font-semibold mb-2" style={{ color: 'var(--gray-600)' }}>عنوان الصفحة</label>
            <input
              value={pageTitle}
              onChange={e => setPageTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createPage()}
              placeholder="مثال: صفحتي الشخصية"
              className="input-modern mb-5"
              autoFocus
            />
            <button onClick={createPage} className="btn-primary w-full py-3 text-[14px]">
              إنشاء وفتح المحرر
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slideUp" style={{ background: 'var(--gray-900)', color: 'white', padding: '12px 20px', borderRadius: 'var(--radius-xl)', fontSize: '13px', fontWeight: 600, boxShadow: '0 12px 32px -4px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--gray-900)' }}>الرسائل</h2>
          <p className="text-[13px] mt-1" style={{ color: 'var(--gray-500)' }}>{messages.length} رسالة</p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--gray-100)' }}>
          {(['all', 'new', 'read'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-4 py-2 rounded-lg text-[12px] font-semibold transition-all duration-200" style={filter === f ? { background: 'white', color: 'var(--gray-800)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { color: 'var(--gray-500)' }}>
              {f === 'all' ? 'الكل' : f === 'new' ? 'جديدة' : 'مقروءة'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--gray-100)' }}>
            <div className="w-5 h-5 border-2 border-[var(--gray-300)] border-t-[var(--primary)] rounded-full animate-spin" />
          </div>
          <span className="text-[13px]" style={{ color: 'var(--gray-400)' }}>جاري التحميل...</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="card-modern py-16 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--gray-100)' }}>
            <span className="text-3xl">📭</span>
          </div>
          <p className="text-[14px] font-medium" style={{ color: 'var(--gray-500)' }}>لا توجد رسائل</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg: any) => (
            <div key={msg.id} className="card-modern p-5 transition-all duration-200" style={msg.status === 'new' ? { borderColor: 'var(--primary-200)', borderRightWidth: '3px', borderRightColor: 'var(--primary)' } : {}}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-[14px] font-bold" style={{ color: 'var(--gray-800)' }}>{msg.name}</span>
                    <span className="text-[11px]" style={{ color: 'var(--gray-400)' }}>{msg.email}</span>
                    {msg.status === 'new' && <span className="badge badge-new">جديد</span>}
                  </div>
                  {msg.pages && <div className="text-[11px] mb-1.5" style={{ color: 'var(--gray-400)' }}>من صفحة: {msg.pages.title}</div>}
                  <p className="text-[13px] leading-relaxed mt-2" style={{ color: 'var(--gray-600)' }}>{msg.message}</p>
                  <div className="text-[10px] mt-2" style={{ color: 'var(--gray-400)' }}>{new Date(msg.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div className="flex gap-1.5 mr-3">
                  {msg.status === 'new' && (
                    <button onClick={() => markRead(msg.id)} className="p-2 rounded-lg transition-all duration-200" style={{ color: 'var(--gray-400)' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-bg)'; e.currentTarget.style.color = 'var(--primary)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }} title="تحديد كمقروء">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  )}
                  <button onClick={() => deleteMessage(msg.id)} className="p-2 rounded-lg transition-all duration-200" style={{ color: 'var(--gray-400)' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }} title="حذف">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </button>
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
        <label className="block text-[12px] font-semibold mb-2" style={{ color: 'var(--gray-600)' }}>الاسم</label>
        <input value={name} onChange={e => setName(e.target.value)} className="input-modern" />
      </div>
      <div>
        <label className="block text-[12px] font-semibold mb-2" style={{ color: 'var(--gray-600)' }}>اسم المستخدم</label>
        <input value={username} onChange={e => setUsername(e.target.value)} className="input-modern" />
        <p className="text-[11px] mt-2" style={{ color: 'var(--gray-400)' }}>صفحتك: <span className="font-semibold" style={{ color: 'var(--primary)' }}>{username}.buildora.vexonet.online</span></p>
      </div>
      <div>
        <label className="block text-[12px] font-semibold mb-2" style={{ color: 'var(--gray-600)' }}>نبذة عنك</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} className="input-modern min-h-[80px] resize-none" placeholder="اكتب شيئاً عنك..." />
      </div>
      <div className="pt-4" style={{ borderTop: '1px solid var(--gray-100)' }}>
        <label className="block text-[12px] font-semibold mb-2" style={{ color: 'var(--gray-600)' }}>دومين مخصص (Custom Domain)</label>
        <input value={customDomain} onChange={e => setCustomDomain(e.target.value)} className="input-modern" placeholder="www.example.com" />
        <p className="text-[11px] mt-2" style={{ color: 'var(--gray-400)' }}>أضف CNAME record يشير إلى <span className="font-semibold" style={{ color: 'var(--gray-600)' }}>cname.vercel-dns.com</span></p>
      </div>
      <button type="submit" disabled={saving} className="btn-primary w-full py-3 text-[14px] disabled:opacity-50" style={saving ? { opacity: 0.5 } : {}}>
        {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
      </button>
    </form>
  );
}
