'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User { id: string; name: string; email: string; username: string; plan: string; bio: string; created_at: string; }
interface Page { id: string; title: string; slug: string; is_published: boolean; views: number; created_at: string; user_id: string; users?: { name: string; email: string; username: string }; }
interface Stats { totalUsers: number; totalPages: number; publishedPages: number; totalViews: number; }

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [section, setSection] = useState<'overview' | 'users' | 'pages'>('overview');
  const [toast, setToast] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me').then(r => { if (!r.ok) throw ''; return r.json(); })
      .then(d => { setUser(d.user); loadAdminData(); })
      .catch(() => router.push('/login'));
  }, [router]);

  async function loadAdminData() {
    setLoading(true);
    try {
      const [adminRes, usersRes, pagesRes] = await Promise.all([fetch('/api/admin'), fetch('/api/admin/users'), fetch('/api/admin/pages')]);
      const adminData = await adminRes.json();
      const usersData = await usersRes.json();
      const pagesData = await pagesRes.json();
      setStats(adminData.stats);
      setUsers(usersData.users || []);
      setPages(pagesData.pages || []);
    } catch {}
    setLoading(false);
  }

  async function deleteUser(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم وجميع صفحاته؟')) return;
    await fetch('/api/admin/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: id }) });
    loadAdminData(); showToast('تم حذف المستخدم');
  }

  async function updateUserPlan(id: string, plan: string) {
    await fetch('/api/admin/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: id, updates: { plan } }) });
    loadAdminData(); showToast('تم تحديث الخطة');
  }

  async function togglePublish(id: string, current: boolean) {
    await fetch('/api/admin/pages', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pageId: id, updates: { is_published: !current } }) });
    loadAdminData(); showToast('تم التحديث');
  }

  async function deletePage(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟')) return;
    await fetch('/api/admin/pages', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pageId: id }) });
    loadAdminData(); showToast('تم حذف الصفحة');
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  const filteredUsers = users.filter(u => !searchQuery || u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPages = pages.filter(p => !searchQuery || p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.slug?.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">جاري التحميل...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-red-500/20">
                <span className="text-white font-extrabold text-sm">A</span>
              </div>
              <span className="text-lg font-extrabold text-[var(--heading)]">Admin Panel</span>
            </Link>
            <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-[10px] font-bold hidden sm:block">ADMIN</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-500 text-sm font-medium hover:text-[var(--primary)] transition hidden sm:block">لوحة المستخدم</Link>
            <Link href="/" className="text-gray-500 text-sm font-medium hover:text-[var(--primary)] transition hidden sm:block">الموقع</Link>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-red-500/20">{user?.name?.[0] || 'A'}</div>
              <span className="text-sm font-semibold text-[var(--heading)] hidden sm:block">{user?.name}</span>
            </div>
            <button onClick={logout} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex max-w-[1400px] mx-auto">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-64px)] p-4 pt-6 hidden md:block">
          <div className="text-[10px] uppercase text-gray-400 tracking-widest mb-3 px-3 font-bold">الإدارة</div>
          <div className="space-y-1">
            {[
              { id: 'overview', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>, label: 'نظرة عامة' },
              { id: 'users', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>, label: 'المستخدمين', count: users.length },
              { id: 'pages', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>, label: 'الصفحات', count: pages.length },
            ].map(item => (
              <button key={item.id} onClick={() => { setSection(item.id as any); setSearchQuery(''); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${section === item.id ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' : 'text-gray-500 hover:bg-gray-100 hover:text-[var(--heading)]'}`}>
                {item.icon}
                {item.label}
                {item.count !== undefined && (
                  <span className={`mr-auto text-xs px-2 py-0.5 rounded-full ${section === item.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>{item.count}</span>
                )}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {section === 'overview' && (
            <div className="space-y-6">
              <h1 className="text-xl font-extrabold text-[var(--heading)]">نظرة عامة</h1>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>, bg: 'bg-purple-50', color: 'text-[var(--primary)]', value: stats?.totalUsers || 0, label: 'المستخدمين' },
                  { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>, bg: 'bg-blue-50', color: 'text-blue-500', value: stats?.totalPages || 0, label: 'الصفحات' },
                  { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, bg: 'bg-emerald-50', color: 'text-emerald-500', value: stats?.publishedPages || 0, label: 'المنشورة' },
                  { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, bg: 'bg-amber-50', color: 'text-amber-500', value: stats?.totalViews || 0, label: 'المشاهدات' },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.bg} ${s.color} mb-3 group-hover:scale-110 transition-transform`}>{s.icon}</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[var(--heading)]">{s.value.toLocaleString()}</div>
                    <div className="text-xs text-gray-400 mt-1 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold">آخر المستخدمين</h2>
                    <button onClick={() => setSection('users')} className="text-[var(--primary)] text-xs font-semibold hover:underline">عرض الكل</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {users.slice(0, 5).map(u => (
                      <div key={u.id} className="flex items-center gap-3 px-6 py-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">{u.name?.[0]}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{u.name}</div>
                          <div className="text-xs text-gray-400 truncate">{u.email}</div>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.plan === 'pro' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>{u.plan}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold">آخر الصفحات</h2>
                    <button onClick={() => setSection('pages')} className="text-[var(--primary)] text-xs font-semibold hover:underline">عرض الكل</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {pages.slice(0, 5).map(p => (
                      <div key={p.id} className="flex items-center gap-3 px-6 py-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                          <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{p.title}</div>
                          <div className="text-xs text-gray-400">by {p.users?.name || 'غير معروف'}</div>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.is_published ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{p.is_published ? 'منشورة' : 'مسودة'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-xl font-extrabold text-[var(--heading)]">إدارة المستخدمين</h1>
                <div className="relative w-full sm:w-64">
                  <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="بحث بالاسم أو الإيميل..."
                    className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[var(--primary)] outline-none transition" />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="bg-gray-50">
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500">المستخدم</th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 hidden sm:table-cell">الاسم</th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500">الخطة</th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 hidden md:table-cell">التاريخ</th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500">إجراءات</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">{u.name?.[0]}</div>
                              <div>
                                <div className="text-sm font-semibold">{u.email}</div>
                                <div className="text-xs text-gray-400">@{u.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold hidden sm:table-cell">{u.name}</td>
                          <td className="px-6 py-4">
                            <select value={u.plan} onChange={e => updateUserPlan(u.id, e.target.value)}
                              className="px-3 py-1.5 border-2 border-gray-200 rounded-lg text-xs font-semibold focus:border-[var(--primary)] outline-none transition cursor-pointer">
                              <option value="free">مجاني</option>
                              <option value="pro">احترافي</option>
                              <option value="enterprise">مؤسسي</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-400 hidden md:table-cell">{new Date(u.created_at).toLocaleDateString('ar')}</td>
                          <td className="px-6 py-4">
                            <button onClick={() => deleteUser(u.id)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition">حذف</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredUsers.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">لا يوجد مستخدمين</div>}
              </div>
            </div>
          )}

          {section === 'pages' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-xl font-extrabold text-[var(--heading)]">إدارة الصفحات</h1>
                <div className="relative w-full sm:w-64">
                  <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="بحث بالعنوان أو slug..."
                    className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[var(--primary)] outline-none transition" />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="bg-gray-50">
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500">الصفحة</th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 hidden sm:table-cell">المالك</th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500">الحالة</th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 hidden md:table-cell">المشاهدات</th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500">إجراءات</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredPages.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                                <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                              </div>
                              <div>
                                <div className="text-sm font-semibold">{p.title}</div>
                                <div className="text-xs text-gray-400">/{p.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm hidden sm:table-cell">{p.users?.name || 'غير معروف'}</td>
                          <td className="px-6 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.is_published ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{p.is_published ? 'منشورة' : 'مسودة'}</span></td>
                          <td className="px-6 py-4 text-sm hidden md:table-cell">{p.views}</td>
                          <td className="px-6 py-4"><div className="flex gap-1.5">
                            {p.is_published && <Link href={'/p/' + p.slug} target="_blank" className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 transition">عرض</Link>}
                            <button onClick={() => togglePublish(p.id, p.is_published)} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 transition">{p.is_published ? 'إلغاء' : 'نشر'}</button>
                            <button onClick={() => deletePage(p.id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition">حذف</button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredPages.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">لا توجد صفحات</div>}
              </div>
            </div>
          )}
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[var(--heading)] text-white px-5 py-3 rounded-xl text-sm font-medium z-50 shadow-2xl flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" /></svg>
          {toast}
        </div>
      )}
    </div>
  );
}
