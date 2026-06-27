import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function UserProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const { data: user } = await supabaseAdmin.from('users').select('id, name, username, bio, created_at').eq('username', username).single();
  if (!user) notFound();
  const { data: pages } = await supabaseAdmin.from('pages').select('title, slug, views, created_at').eq('user_id', user.id).eq('is_published', true).order('updated_at', { ascending: false });

  return (
    <html lang="ar" dir="rtl">
      <head><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap" rel="stylesheet" /></head>
      <body style={{ fontFamily: "'Cairo', sans-serif", background: '#f8fafc', color: '#0f172a', margin: 0 }}>
        <div style={{ background: 'linear-gradient(135deg,#6c63ff,#e91e63)', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>{user.name}</h1>
          <p style={{ fontSize: 16, opacity: 0.9 }}>{user.bio || 'مستخدم Buildora'}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: 20, fontSize: 13, marginTop: 12 }}>⚡ Buildora User</div>
        </div>
        <div style={{ maxWidth: 800, margin: '-30px auto 40px', padding: '0 20px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>📄 صفحات منشورة ({pages?.length || 0})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
            {(pages || []).map(p => (
              <Link key={p.slug} href={`/p/${p.slug}`} style={{ display: 'block', background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, textDecoration: 'none', color: 'inherit', transition: 'all 0.2s' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{p.title}</h3>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>/{p.slug} • {p.views} مشاهدة</p>
              </Link>
            ))}
          </div>
          {(!pages || pages.length === 0) && <p style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>لم ينشر أي صفحة بعد</p>}
        </div>
      </body>
    </html>
  );
}