import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: page } = await supabaseAdmin.from('pages').select('seo_title, seo_description, seo_keywords, og_image, title').eq('slug', slug).eq('is_published', true).single();
  if (!page) return {};
  return {
    title: page.seo_title || page.title,
    description: page.seo_description || `صفحة ${page.title} - صُنعت على Buildora`,
    keywords: page.seo_keywords || page.title,
    openGraph: {
      title: page.seo_title || page.title,
      description: page.seo_description,
      images: page.og_image ? [{ url: page.og_image, width: 1200, height: 630 }] : [],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: page.seo_title || page.title, description: page.seo_description },
    robots: { index: true, follow: true },
  };
}

export default async function PublishedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: page } = await supabaseAdmin.from('pages').select('*, users(name, username)').eq('slug', slug).eq('is_published', true).single();
  if (!page) notFound();

  try { await supabaseAdmin.from('analytics').insert({ page_id: page.id, visitor_ip: '0.0.0.0', user_agent: '' }); } catch {}
  try { await supabaseAdmin.from('pages').update({ views: (page.views || 0) + 1 }).eq('id', page.id); } catch {}

  let elements: any[] = [];
  try { elements = JSON.parse(page.content || '[]'); } catch {}

  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&display=swap" rel="stylesheet" />
        {page.custom_css && <style dangerouslySetInnerHTML={{ __html: page.custom_css }} />}
      </head>
      <body style={{ fontFamily: "'Cairo', sans-serif", background: '#fff', color: '#0f172a', margin: 0 }}>
        {elements.map((el: any) => <RenderElement key={el.id} el={el} />)}
        {page.custom_js && <script dangerouslySetInnerHTML={{ __html: page.custom_js }} />}
      </body>
    </html>
  );
}

function RenderElement({ el }: { el: any }) {
  const c = el.content || {};
  const s = el.style || {};

  const baseStyle: React.CSSProperties = {
    padding: s.padding, margin: s.margin, backgroundColor: s.bgColor, color: s.textColor,
    borderRadius: s.borderRadius, fontSize: s.fontSize, fontWeight: s.fontWeight as any,
    textAlign: s.textAlign as any, width: s.width, maxWidth: s.maxWidth, height: s.height,
    border: s.border, boxShadow: s.boxShadow, opacity: s.opacity ? parseFloat(s.opacity) : undefined,
  };

  switch (el.type) {
    case 'heading': return <h1 style={{ fontSize: s.fontSize || '36px', fontWeight: s.fontWeight || '800', textAlign: (s.textAlign as any) || 'center', padding: s.padding || '16px 20px', color: s.textColor }}>{c.text}</h1>;
    case 'subheading': return <h2 style={{ fontSize: s.fontSize || '24px', fontWeight: s.fontWeight || '700', textAlign: (s.textAlign as any) || 'center', padding: s.padding || '8px 20px', color: s.textColor }}>{c.text}</h2>;
    case 'paragraph': return <p style={{ fontSize: s.fontSize || '16px', lineHeight: 1.8, textAlign: (s.textAlign as any) || 'center', padding: s.padding || '8px 20px', color: s.textColor || '#475569', maxWidth: 700, margin: '0 auto' }}>{c.text}</p>;
    case 'list': return <ul style={{ padding: '16px 20px', maxWidth: 600, margin: '0 auto' }}>{(c.items || []).map((item: string, i: number) => <li key={i} style={{ padding: '6px 0', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>{c.style === 'check' ? '✓' : c.style === 'bullet' ? '●' : `${i+1}.`} {item}</li>)}</ul>;
    case 'quote': return <blockquote style={{ borderRight: '4px solid #6c63ff', padding: '16px 24px', margin: '16px auto', maxWidth: 600, background: '#f8fafc', borderRadius: '0 8px 8px 0' }}><p style={{ fontSize: 16, fontStyle: 'italic', color: '#475569' }}>"{c.text}"</p><footer style={{ fontSize: 13, color: '#94a3b8', marginTop: 8 }}>— {c.author}</footer></blockquote>;
    case 'image': return c.src ? <div style={{ textAlign: 'center', padding: 16 }}><img src={c.src} alt={c.alt || ''} style={{ maxWidth: c.width || '100%', borderRadius: s.borderRadius || 8 }} /></div> : null;
    case 'video': return c.url ? <div style={{ textAlign: 'center', padding: 16 }}><iframe src={c.url} style={{ width: '100%', maxWidth: 640, aspectRatio: '16/9', borderRadius: 8, border: 'none' }} /></div> : null;
    case 'icon': return <div style={{ textAlign: 'center', padding: 16 }}><span style={{ fontSize: c.size || 48 }}>{c.emoji}</span></div>;
    case 'button': return <div style={{ textAlign: 'center', padding: 16 }}><a href={c.link || '#'} style={{ display: 'inline-block', padding: '14px 36px', background: c.variant === 'secondary' ? 'transparent' : '#6c63ff', color: c.variant === 'secondary' ? '#6c63ff' : '#fff', border: c.variant === 'secondary' ? '2px solid #6c63ff' : 'none', borderRadius: s.borderRadius || 8, fontSize: s.fontSize || 16, fontWeight: s.fontWeight || 600, textDecoration: 'none' }}>{c.text}</a></div>;
    case 'buttons-group': return <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: 16, flexWrap: 'wrap' }}>{(c.buttons || []).map((btn: any, i: number) => <a key={i} href={btn.link || '#'} style={{ display: 'inline-block', padding: '12px 28px', background: btn.variant === 'secondary' ? '#f1f5f9' : '#6c63ff', color: btn.variant === 'secondary' ? '#475569' : '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>{btn.text}</a>)}</div>;
    case 'link': return <div style={{ textAlign: 'center', padding: 16 }}><a href={c.url || '#'} style={{ color: '#6c63ff', fontSize: 16, fontWeight: 600, textDecoration: 'underline' }}>{c.text}</a></div>;
    case 'form': return <div style={{ padding: '40px 20px', maxWidth: 500, margin: '0 auto' }}><h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>{c.title}</h2><div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{(c.fields || []).map((f: string, i: number) => i === c.fields.length - 1 ? <textarea key={i} placeholder={f} style={{ padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 15, minHeight: 100 }} /> : <input key={i} placeholder={f} style={{ padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 15 }} />)}<button style={{ padding: 14, background: '#6c63ff', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{c.submitText}</button></div></div>;
    case 'newsletter': return <div style={{ padding: '60px 20px', textAlign: 'center', background: s.bgColor || 'linear-gradient(135deg,#6c63ff,#e91e63)', color: '#fff' }}><h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{c.title}</h2><p style={{ opacity: 0.9, marginBottom: 24 }}>{c.subtitle}</p><div style={{ display: 'flex', justifyContent: 'center', gap: 8, maxWidth: 400, margin: '0 auto' }}><input placeholder="بريدك الإلكتروني" style={{ flex: 1, padding: '14px 16px', borderRadius: 8, border: 'none', fontSize: 15 }} /><button style={{ padding: '14px 24px', background: '#fff', color: '#6c63ff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700 }}>{c.buttonText}</button></div></div>;
    case 'countdown': return <div style={{ padding: '40px 20px', textAlign: 'center' }}><p style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>{c.label}</p><div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>{['أيام','ساعات','دقائق','ثواني'].map((l,i) => <div key={i} style={{ background: '#1a1a2e', color: '#fff', borderRadius: 8, padding: '16px 20px', minWidth: 70 }}><div style={{ fontSize: 28, fontWeight: 800 }}>00</div><div style={{ fontSize: 11, opacity: 0.7 }}>{l}</div></div>)}</div></div>;
    case 'counter': return <div style={{ padding: '60px 20px', background: s.bgColor || '#f8fafc' }}><div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>{(c.items || []).map((n: any, i: number) => <div key={i} style={{ textAlign: 'center' }}><div style={{ fontSize: 40, fontWeight: 800, color: '#6c63ff' }}>{n.value}</div><div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{n.label}</div></div>)}</div></div>;
    case 'hero': return <div style={{ background: c.bgGradient || `linear-gradient(135deg,${c.bgColor || '#6c63ff'},#1d4ed8)`, color: '#fff', padding: '80px 32px', textAlign: 'center' }}>{c.badge && <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: 20, fontSize: 13, marginBottom: 16 }}>{c.badge}</div>}<h1 style={{ fontSize: 44, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>{c.title}</h1><p style={{ fontSize: 20, opacity: 0.9, marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>{c.subtitle}</p><a href={c.buttonLink || '#'} style={{ display: 'inline-block', padding: '16px 40px', background: '#fff', color: c.bgColor || '#6c63ff', borderRadius: 8, fontSize: 18, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>{c.buttonText}</a></div>;
    case 'hero-split': return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 400, background: c.bgColor || '#f8fafc' }}><div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 40px' }}><h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>{c.title}</h1><p style={{ fontSize: 18, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>{c.subtitle}</p><div><a href={c.buttonLink || '#'} style={{ display: 'inline-block', padding: '14px 32px', background: '#6c63ff', color: '#fff', borderRadius: 8, fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>{c.buttonText}</a></div></div><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>{c.image ? <img src={c.image} style={{ width: '100%', maxWidth: 400, borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }} /> : <div style={{ width: '100%', maxWidth: 400, aspectRatio: '1', background: '#e2e8f0', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>صورة</div>}</div></div>;
    case 'features-grid': return <div style={{ padding: '60px 20px', textAlign: 'center' }}><h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{c.title}</h2>{c.subtitle && <p style={{ color: '#64748b', marginBottom: 40, fontSize: 16 }}>{c.subtitle}</p>}<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, maxWidth: 1000, margin: '0 auto' }}>{(c.items || []).map((item: any, i: number) => <div key={i} style={{ textAlign: 'center', padding: 24 }}><div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div><h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3><p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{item.desc}</p></div>)}</div></div>;
    case 'features-cards': return <div style={{ padding: '60px 20px' }}><h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 40 }}>{c.title}</h2><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, maxWidth: 900, margin: '0 auto' }}>{(c.items || []).map((item: any, i: number) => <div key={i} style={{ padding: 32, borderRadius: 16, border: '1px solid #e2e8f0', borderTop: `3px solid ${item.color || '#6c63ff'}`, background: '#fff' }}><div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div><h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3><p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{item.desc}</p></div>)}</div></div>;
    case 'stats': return <div style={{ background: s.bgColor || '#1a1a2e', padding: '60px 20px' }}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 32, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>{(c.items || []).map((item: any, i: number) => <div key={i}><div style={{ fontSize: 40, fontWeight: 800, color: '#6c63ff' }}>{item.value}</div><div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>{item.label}</div></div>)}</div></div>;
    case 'pricing-table': return <div style={{ padding: '60px 20px', background: '#f8fafc', textAlign: 'center' }}><h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{c.title}</h2>{c.subtitle && <p style={{ color: '#64748b', marginBottom: 40 }}>{c.subtitle}</p>}<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, maxWidth: 1000, margin: '0 auto' }}>{(c.plans || []).map((plan: any, i: number) => <div key={i} style={{ padding: 32, borderRadius: 16, border: plan.featured ? '2px solid #6c63ff' : '1px solid #e2e8f0', background: plan.featured ? 'rgba(108,99,255,0.03)' : '#fff', position: 'relative', transform: plan.featured ? 'scale(1.05)' : 'none' }}>{plan.featured && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#6c63ff', color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>الأكثر شيوعاً</div>}<h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{plan.name}</h3><div style={{ marginBottom: 20 }}><span style={{ fontSize: 40, fontWeight: 800, color: '#6c63ff' }}>${plan.price}</span><span style={{ fontSize: 14, color: '#94a3b8' }}>{plan.period}</span></div><ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: 24 }}>{(plan.features || []).map((f: string, j: number) => <li key={j} style={{ padding: '8px 0', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #f1f5f9' }}><span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>{f}</li>)}</ul><a href="#" style={{ display: 'block', padding: '14px', background: plan.featured ? '#6c63ff' : 'transparent', color: plan.featured ? '#fff' : '#6c63ff', border: plan.featured ? 'none' : '2px solid #6c63ff', borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>{plan.cta}</a></div>)}</div></div>;
    case 'testimonials': return <div style={{ padding: '60px 20px', textAlign: 'center' }}><h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 40 }}>{c.title}</h2><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, maxWidth: 1000, margin: '0 auto' }}>{(c.items || []).map((item: any, i: number) => <div key={i} style={{ background: '#f8fafc', borderRadius: 16, padding: 32, textAlign: 'center' }}><div style={{ fontSize: 32, marginBottom: 12 }}>{item.avatar}</div><p style={{ fontSize: 15, fontStyle: 'italic', color: '#475569', marginBottom: 16, lineHeight: 1.6 }}>"{item.text}"</p><div style={{ fontWeight: 700, fontSize: 15 }}>{item.author}</div><div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{item.role}</div></div>)}</div></div>;
    case 'faq': return <div style={{ padding: '60px 20px', maxWidth: 700, margin: '0 auto' }}><h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 40 }}>{c.title}</h2>{(c.items || []).map((item: any, i: number) => <div key={i} style={{ borderBottom: '1px solid #e2e8f0', padding: '20px 0' }}><div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: '#1a1a2e' }}>{item.q}</div><div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{item.a}</div></div>)}</div>;
    case 'cta': return <div style={{ background: s.bgColor || '#6c63ff', padding: '60px 20px', textAlign: 'center', color: '#fff' }}><h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>{c.title}</h2><p style={{ fontSize: 18, opacity: 0.9, marginBottom: 28 }}>{c.subtitle}</p><a href="#" style={{ display: 'inline-block', padding: '16px 40px', background: '#fff', color: s.bgColor || '#6c63ff', borderRadius: 8, fontSize: 18, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>{c.buttonText}</a></div>;
    case 'team': return <div style={{ padding: '60px 20px', textAlign: 'center' }}><h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 40 }}>{c.title}</h2><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 24, maxWidth: 800, margin: '0 auto' }}>{(c.members || []).map((m: any, i: number) => <div key={i} style={{ textAlign: 'center' }}><div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 12px' }}>{m.avatar}</div><div style={{ fontWeight: 700, fontSize: 16 }}>{m.name}</div><div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{m.role}</div></div>)}</div></div>;
    case 'logo-cloud': return <div style={{ padding: '60px 20px', textAlign: 'center' }}><h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 32, color: '#94a3b8' }}>{c.title}</h2><div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', fontSize: 36 }}>{(c.logos || []).map((logo: string, i: number) => <span key={i} style={{ opacity: 0.4 }}>{logo}</span>)}</div></div>;
    case 'footer': return <footer style={{ background: '#0f172a', color: '#fff', padding: '32px 20px', textAlign: 'center' }}><p style={{ opacity: 0.7, fontSize: 14, marginBottom: 12 }}>{c.text}</p>{c.links && c.links.length > 0 && <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>{c.links.map((l: any, i: number) => <a key={i} href={l.url} style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'none' }}>{l.text}</a>)}</div>}</footer>;
    case 'section': return <div style={{ padding: s.padding || '20px', minHeight: 60 }}>{c.children}</div>;
    default: return null;
  }
}
