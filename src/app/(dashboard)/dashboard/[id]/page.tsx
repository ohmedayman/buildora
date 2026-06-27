'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import IconPicker from '@/components/IconPicker';

interface ElStyle {
  padding?: string; margin?: string;
  bgColor?: string; textColor?: string; borderRadius?: string;
  fontSize?: string; fontWeight?: string; textAlign?: string;
  width?: string; maxWidth?: string; height?: string;
  border?: string; boxShadow?: string;
  opacity?: string; gap?: string;
}

interface Element {
  id: string; type: string; content: any; style?: ElStyle;
  children?: Element[];
}

const ELEMENT_CATEGORIES = [
  { label: 'التخطيط', items: [
    { type: 'section', icon: '▢', name: 'قسم', desc: 'حاوية عناصر' },
    { type: 'columns-2', icon: '▥', name: 'عمودين', desc: 'عمودين متساويين' },
    { type: 'columns-3', icon: '⊞', name: '3 أعمدة', desc: 'ثلاثة أعمدة' },
    { type: 'columns-4', icon: '⊟', name: '4 أعمدة', desc: 'أربعة أعمدة' },
  ]},
  { label: 'النص', items: [
    { type: 'heading', icon: 'H1', name: 'عنوان', desc: 'عنوان رئيسي' },
    { type: 'subheading', icon: 'H2', name: 'عنوان فرعي', desc: 'عنوان ثانوي' },
    { type: 'paragraph', icon: '¶', name: 'فقرة', desc: 'نص طويل' },
    { type: 'list', icon: '≡', name: 'قائمة', desc: 'قائمة نقاط' },
    { type: 'quote', icon: '❝', name: 'اقتباس', desc: 'نص اقتباس' },
  ]},
  { label: 'الوسائط', items: [
    { type: 'image', icon: '🖼', name: 'صورة', desc: 'صورة أو شعار' },
    { type: 'video', icon: '▶', name: 'فيديو', desc: 'فيديو يوتيوب' },
    { type: 'icon', icon: '★', name: 'أيقونة', desc: 'أيقونة مزخرفة' },
    { type: 'gallery', icon: '⊞', name: 'معرض', desc: 'عدة صور' },
  ]},
  { label: 'الأزرار', items: [
    { type: 'button', icon: '◉', name: 'زر', desc: 'زر رئيسي' },
    { type: 'buttons-group', icon: '◎◎', name: 'مجموعة أزرار', desc: 'عدة أزرار' },
    { type: 'link', icon: '🔗', name: 'رابط', desc: 'نص تفاعلي' },
  ]},
  { label: 'التفاعل', items: [
    { type: 'form', icon: '📝', name: 'نموذج', desc: 'نموذج تواصل' },
    { type: 'newsletter', icon: '✉', name: 'نشرة', desc: 'اشتراك بريد' },
    { type: 'countdown', icon: '⏱', name: 'عد تنازلي', desc: 'مؤقت' },
    { type: 'counter', icon: '🔢', name: 'عدّاد', desc: 'رقم متحرك' },
  ]},
  { label: 'جاهز', items: [
    { type: 'hero', icon: '🏠', name: 'هيرو', desc: 'قسم رئيسي كامل' },
    { type: 'hero-split', icon: '◧', name: 'هيرو مقسوم', desc: 'نص + صورة' },
    { type: 'features-grid', icon: '⭐', name: 'مميزات', desc: 'شبكة مميزات' },
    { type: 'features-cards', icon: '🃏', name: 'كروت مميزات', desc: 'كروت أنيقة' },
    { type: 'stats', icon: '📊', name: 'إحصائيات', desc: 'أرقام وبيانات' },
    { type: 'pricing-table', icon: '💰', name: 'جدول أسعار', desc: 'خطط الأسعار' },
    { type: 'testimonials', icon: '💬', name: 'شهادات', desc: 'آراء العملاء' },
    { type: 'faq', icon: '❓', name: 'أسئلة شائعة', desc: 'Q&A' },
    { type: 'cta', icon: '📢', name: 'دعوة للعمل', desc: 'CTA Section' },
    { type: 'team', icon: '👥', name: 'الفريق', desc: 'أعضاء الفريق' },
    { type: 'logo-cloud', icon: '🏢', name: 'شركاء', desc: 'شعارات الشركاء' },
    { type: 'testimonial-carousel', icon: '🔄', name: 'عرض شهادات', desc: 'سلايدر شهادات' },
    { type: 'footer', icon: '📌', name: 'تذييل', desc: 'الفوتر' },
  ]},
];

const FONT_SIZES = ['12px','14px','16px','18px','20px','24px','28px','32px','36px','40px','48px','56px','64px'];
const FONT_WEIGHTS = ['300','400','500','600','700','800','900'];
const COLOR_PRESETS = ['#6c63ff','#e91e63','#059669','#2563eb','#d97706','#dc2626','#0f172a','#ffffff','#f8fafc','#1e293b'];

function genId() { return 'el-' + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

function getDefault(type: string): any {
  const d: Record<string, any> = {
    heading: { text: 'عنوان رئيسي', level: 'h1' },
    subheading: { text: 'عنوان فرعي', level: 'h2' },
    paragraph: { text: 'هذا نص تجريبي يمكنك تعديله. يمكنك كتابة أي محتوى هنا وتنسيقه حسب رغبتك.' },
    list: { items: ['البند الأول','البند الثاني','البند الثالث'], style: 'check' },
    quote: { text: 'هذا اقتباس رائع من شخصية مهمة', author: 'الاسم' },
    image: { src: '', alt: 'صورة', width: '100%' },
    video: { url: '', poster: '' },
    icon: { emoji: '⭐', size: '48px' },
    gallery: { images: [{src:'',alt:''},{src:'',alt:''},{src:'',alt:''}] },
    button: { text: 'ابدأ الآن', link: '#', variant: 'primary' },
    'buttons-group': { buttons: [{text:'ابدأ مجاناً',link:'#',variant:'primary'},{text:'شاهد العرض',link:'#',variant:'secondary'}] },
    link: { text: 'اضغط هنا', url: '#' },
    form: { title: 'تواصل معنا', fields: ['الاسم','البريد الإلكتروني','الرسالة'], submitText: 'إرسال' },
    newsletter: { title: 'اشترك في نشرتنا البريدية', subtitle: 'احصل على آخر الأخبار', buttonText: 'اشترك' },
    countdown: { date: '2026-12-31', label: 'ينتهي العرض خلال' },
    counter: { numbers: [{value:'500+',label:'عميل'},{value:'99%',label:'رضا'},{value:'24/7',label:'دعم'}] },
    hero: { title: 'مرحباً بك في منصتنا', subtitle: 'أفضل حل رقمي لاحتياجاتك', buttonText: 'ابدأ الآن مجاناً', buttonLink: '#', bgColor: '#6c63ff', bgGradient: 'linear-gradient(135deg,#6c63ff,#e91e63)', badge: 'جديد' },
    'hero-split': { title: 'ابدأ رحلتك الرقمية', subtitle: 'حلول مبتكرة لنمو أعمالك', buttonText: 'ابدأ الآن', image: '', bgColor: '#f8fafc' },
    'features-grid': { title: 'لماذا تختارنا؟', subtitle: 'نقدم لك أفضل الحلول', items: [{icon:'⚡',title:'سرعة فائقة',desc:'أداء عالي وسرعة تحميل مذهلة'},{icon:'🔒',title:'أمان متقدم',desc:'حماية بياناتك بأعلى المعايير'},{icon:'🎨',title:'تصميم عصري',desc:'واجهات أنيقة وسهلة الاستخدام'},{icon:'📱',title:'متوافق مع الجوال',desc:'تجربة مثالية على كل الأجهزة'},{icon:'🌍',title:'دعم متعدد اللغات',desc:'دعم كامل للعربية والإنجليزية'},{icon:'💰',title:'أسعار منافسة',desc:'خطط تناسب كل الميزانيات'}] },
    'features-cards': { title: 'مميزاتنا', items: [{icon:'🚀',title:'إطلاق سريع',desc:'ابدأ في دقائق',color:'#6c63ff'},{icon:'📊',title:'تحليلات متقدمة',desc:'تتبع أداءك',color:'#e91e63'},{icon:'🔔',title:'تنبيhes فورية',desc:'لا تفوتك أي شيء',color:'#059669'}] },
    stats: { items: [{value:'10,000+',label:'مستخدم نشط'},{value:'99.9%',label:'وقت التشغيل'},{value:'500K+',label:'صفحة تم إنشاؤها'},{value:'4.9/5',label:'تقييم المستخدمين'}], bgColor: '#1a1a2e' },
    'pricing-table': { title: 'خطط الأسعار', subtitle: 'اختر الخطة المناسبة', plans: [{name:'مجاني',price:'0',period:'/شهر',featured:false,features:['3 صفحات','شريحة واحدة','دعم أساسي'],cta:'ابدأ مجاناً'},{name:'احترافي',price:'29',period:'/شهر',featured:true,features:['صفحات غير محدودة','دومين مخصص','SEO متقدم','تحليلات','دعم أولوي'],cta:'ابدأ الآن'},{name:'مؤسسات',price:'99',period:'/شهر',featured:false,features:['كل مميزات احترافي','API','دعم مخصص','SLA','تدريب'],cta:'تواصل معنا'}] },
    testimonials: { title: 'ماذا يقول عملاؤنا', items: [{text:'أفضل منصة استخدمتها لبناء صفحتي. سهلة وسريعة ومميزة!',author:'أحمد محمد',role:'رائد أعمال',avatar:'👨‍💼'},{text:'التصميم الاحترافي والنتائج المبهرة جعلتني أنصح الجميع بالـ Buildora',author:'سارة علي',role:'مديرة تسويق',avatar:'👩‍💼'},{text:'دعم فني ممتاز وتحديثات مستمرة. منصة رائعة!',author:'خالد حسن',role:'مطور مواقع',avatar:'👨‍💻'}] },
    faq: { title: 'الأسئلة الشائعة', items: [{q:'كيف أبدأ باستخدام المنصة؟',a:'سجل حساب مجاني وابدأ ببناء صفحتك فوراً'},{q:'هل يمكنني استخدام دومين خاص؟',a:'نعم، يمكنك ربط أي دومين بحسابك'},{q:'هل يوجد سعر للخطة المجانية؟',a:'لا، الخطة المجانية مجانية تماماً'},{q:'كيف أحصل على الدعم؟',a:'فريق الدعم متاح على مدار الساعة'}] },
    cta: { title: 'جاهز للبدء؟', subtitle: 'انضم لأكثر من 10,000 مستخدم', buttonText: 'ابدأ مجاناً الآن', bgColor: '#6c63ff' },
    team: { title: 'فريق العمل', members: [{name:'أحمد',role:'الرئيس التنفيذي',avatar:'👨‍💼'},{name:'سارة',role:'مديرة التصميم',avatar:'👩‍🎨'},{name:'خالد',role:'lead مطور',avatar:'👨‍💻'}] },
    'logo-cloud': { title: 'شركاؤنا', logos: ['🏢','🏭','🏦','🏛️','🏥','🎓'] },
    'testimonial-carousel': { testimonials: [{text:'رائع!',author:'أحمد',rating:5},{text:'ممتاز!',author:'سارة',rating:5},{text:'أفضل منصة!',author:'خالد',rating:5}] },
    footer: { text: '© 2026 Buildora. جميع الحقوق محفوظة.', links: [{text:'الشروط',url:'#'},{text:'الخصوصية',url:'#'},{text:'تواصل معنا',url:'#'}] },
    section: {},
    'columns-2': {},
    'columns-3': {},
    'columns-4': {},
  };
  return d[type] || {};
}

function getDefaultStyle(type: string): ElStyle {
  if (['heading','subheading'].includes(type)) return { fontSize: type === 'heading' ? '36px' : '24px', fontWeight: '700', textAlign: 'center', padding: '16px 0' };
  if (type === 'paragraph') return { fontSize: '16px', textAlign: 'center', padding: '8px 20px', textColor: '#475569' };
  if (type === 'button') return { padding: '12px 32px', bgColor: '#6c63ff', textColor: '#ffffff', borderRadius: '8px', fontSize: '16px', fontWeight: '600' };
  if (type === 'section') return { padding: '40px 20px', margin: '8px 0' };
  if (type === 'divider') return { margin: '16px 0' };
  if (type === 'spacer') return { height: '40px' };
  if (type === 'hero') return { padding: '80px 32px', textAlign: 'center' };
  return {};
}

export default function BuilderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [elements, setElements] = useState<Element[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pageName, setPageName] = useState('');
  const [toast, setToast] = useState('');
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [leftTab, setLeftTab] = useState<'elements' | 'layers'>('elements');
  const [rightTab, setRightTab] = useState<'style' | 'settings'>('style');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    'التخطيط': true, 'النص': true, 'الوسائط': false, 'الأزرار': false, 'التفاعل': false, 'جاهز': true
  });
  const [iconPickerTarget, setIconPickerTarget] = useState<{elId: string; field: string; path?: number} | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/me').then(r => { if (!r.ok) throw ''; return r.json(); })
      .then(d => {}).catch(() => router.push('/login'));
    fetch('/api/pages/' + id).then(r => r.json()).then(d => {
      if (d.page) {
        setPageName(d.page.title);
        try { setElements(JSON.parse(d.page.content || '[]')); } catch {}
      }
    });
  }, [id, router]);

  function pushUndo() {
    setUndoStack(prev => [...prev.slice(-49), JSON.stringify(elements)]);
    setRedoStack([]);
  }
  function undo() {
    if (!undoStack.length) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack(r => [...r, JSON.stringify(elements)]);
    setUndoStack(u => u.slice(0, -1));
    setElements(JSON.parse(prev));
  }
  function redo() {
    if (!redoStack.length) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(u => [...u, JSON.stringify(elements)]);
    setRedoStack(r => r.slice(0, -1));
    setElements(JSON.parse(next));
  }

  function addElement(type: string) {
    pushUndo();
    const el: Element = { id: genId(), type, content: getDefault(type), style: getDefaultStyle(type), children: [] };
    setElements(prev => [...prev, el]);
    setSelectedId(el.id);
    toast_msg('تمت الإضافة');
  }

  function deleteEl(id: string) {
    pushUndo();
    setElements(prev => prev.filter(e => e.id !== id));
    if (selectedId === id) setSelectedId(null);
    toast_msg('تم الحذف');
  }

  function duplicateEl(id: string) {
    pushUndo();
    setElements(prev => {
      const idx = prev.findIndex(e => e.id === id);
      if (idx < 0) return prev;
      const clone = JSON.parse(JSON.stringify(prev[idx]));
      clone.id = genId();
      const arr = [...prev];
      arr.splice(idx + 1, 0, clone);
      return arr;
    });
    toast_msg('تم النسخ');
  }

  function moveEl(id: string, dir: number) {
    pushUndo();
    setElements(prev => {
      const i = prev.findIndex(e => e.id === id);
      if (i < 0) return prev;
      const ni = i + dir;
      if (ni < 0 || ni >= prev.length) return prev;
      const arr = [...prev];
      [arr[i], arr[ni]] = [arr[ni], arr[i]];
      return arr;
    });
  }

  function updateElStyle(id: string, style: Partial<ElStyle>) {
    setElements(prev => prev.map(e => e.id === id ? { ...e, style: { ...e.style, ...style } } : e));
  }

  function updateElContent(id: string, content: any) {
    setElements(prev => prev.map(e => e.id === id ? { ...e, content } : e));
  }

  const selectedEl = elements.find(e => e.id === selectedId);

  async function save(publish = false) {
    setSaving(true);
    const body: any = { content: JSON.stringify(elements), title: pageName || 'صفحتي' };
    if (publish) body.is_published = true;
    const r = await fetch('/api/pages/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setSaving(false);
    if (r.ok) toast_msg(publish ? 'تم النشر!' : 'تم الحفظ');
  }

  function toast_msg(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2500); }

  function onDragStart(e: React.DragEvent, type: string) {
    e.dataTransfer.setData('element-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  }

  function onCanvasDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(null);
    const type = e.dataTransfer.getData('element-type');
    const reorder = e.dataTransfer.getData('reorder-id');
    if (type) {
      addElement(type);
    } else if (reorder) {
      // reorder handled by drop position
    }
  }

  function onElDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData('reorder-id', id);
    e.dataTransfer.effectAllowed = 'move';
  }

  const deviceWidth = device === 'desktop' ? '100%' : device === 'tablet' ? '768px' : '375px';

  const filteredCats = searchQuery
    ? ELEMENT_CATEGORIES.map(c => ({ ...c, items: c.items.filter(i => i.name.includes(searchQuery) || i.desc.includes(searchQuery) || i.type.includes(searchQuery)) })).filter(c => c.items.length > 0)
    : ELEMENT_CATEGORIES;

  return (
    <div className="h-screen flex flex-col bg-[#f0f0f5]">
      {/* TOP BAR */}
      <nav className="flex items-center justify-between px-3 h-[48px] bg-[var(--bg-dark)] text-white flex-shrink-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition text-sm">←</Link>
          <div className="w-px h-5 bg-gray-600" />
          <span className="text-[var(--primary)] font-extrabold text-base tracking-tight">◆</span>
          <span className="font-extrabold text-sm">Buildora</span>
          <div className="w-px h-5 bg-gray-600" />
          <span className="text-gray-400 text-xs">{pageName || 'صفحتي'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={undo} disabled={!undoStack.length} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 text-xs" title="تراجع">↩</button>
          <button onClick={redo} disabled={!redoStack.length} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 text-xs" title="إعادة">↪</button>
          <div className="w-px h-5 bg-gray-600" />
          <div className="flex bg-white/10 rounded-lg p-0.5">
            {(['desktop','tablet','mobile'] as const).map(d => (
              <button key={d} onClick={() => setDevice(d)} className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition ${device === d ? 'bg-[#6c63ff] text-white' : 'text-gray-400 hover:text-white'}`}>
                {d === 'desktop' ? '🖥' : d === 'tablet' ? '📱' : '📲'}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-gray-600" />
          <button onClick={() => save(false)} disabled={saving} className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs font-semibold hover:bg-white/20 transition disabled:opacity-50">
            {saving ? '...' : '💾 حفظ'}
          </button>
          <button onClick={() => save(true)} disabled={saving} className="px-3 py-1.5 bg-[#6c63ff] text-white rounded-lg text-xs font-semibold hover:bg-[#5b52e0] transition disabled:opacity-50">
            🚀 نشر
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <aside className="w-[240px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          <div className="flex border-b border-gray-200">
            <button onClick={() => setLeftTab('elements')} className={`flex-1 py-2.5 text-xs font-bold transition ${leftTab === 'elements' ? 'text-[#6c63ff] border-b-2 border-[#6c63ff]' : 'text-gray-400 hover:text-gray-600'}`}>الأدوات</button>
            <button onClick={() => setLeftTab('layers')} className={`flex-1 py-2.5 text-xs font-bold transition ${leftTab === 'layers' ? 'text-[#6c63ff] border-b-2 border-[#6c63ff]' : 'text-gray-400 hover:text-gray-600'}`}>الطبقات</button>
          </div>
          {leftTab === 'elements' ? (
            <>
              <div className="p-2 border-b border-gray-100">
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="🔍 ابحث عن عنصر..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#6c63ff]" />
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredCats.map(cat => (
                  <div key={cat.label}>
                    <button onClick={() => setExpandedCats(p => ({...p, [cat.label]: !p[cat.label]}))} className="w-full flex items-center justify-between px-2 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider hover:bg-gray-50 rounded-lg transition">
                      {cat.label}
                      <span className="text-[10px]">{expandedCats[cat.label] ? '▾' : '▸'}</span>
                    </button>
                    {expandedCats[cat.label] && (
                      <div className="grid grid-cols-2 gap-1 pb-2">
                        {cat.items.map(item => (
                          <div key={item.type} draggable onDragStart={e => onDragStart(e, item.type)}
                            className="flex flex-col items-center gap-1 py-2.5 px-1 border border-gray-100 rounded-lg cursor-grab hover:border-[#6c63ff] hover:bg-[#6c63ff]/5 hover:shadow-sm active:cursor-grabbing transition-all select-none">
                            <span className="text-[#6c63ff] text-sm font-bold">{item.icon}</span>
                            <span className="text-[10px] text-gray-600 font-medium">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-2">
              {elements.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">لا توجد عناصر بعد</p>
              ) : (
                <div className="space-y-0.5">
                  {elements.map((el, i) => (
                    <div key={el.id} onClick={() => setSelectedId(el.id)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-xs transition ${selectedId === el.id ? 'bg-[#6c63ff]/10 text-[#6c63ff]' : 'text-gray-500 hover:bg-gray-50'}`}>
                      <span className="text-[10px] text-gray-300 w-4">{i + 1}</span>
                      <span className="flex-1 truncate font-medium">{getElLabel(el.type)}</span>
                      <button onClick={e => { e.stopPropagation(); moveEl(el.id, -1); }} className="text-[10px] opacity-50 hover:opacity-100" disabled={i === 0}>↑</button>
                      <button onClick={e => { e.stopPropagation(); moveEl(el.id, 1); }} className="text-[10px] opacity-50 hover:opacity-100" disabled={i === elements.length - 1}>↓</button>
                      <button onClick={e => { e.stopPropagation(); deleteEl(el.id); }} className="text-[10px] text-red-400 hover:text-red-600">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>

        {/* CANVAS */}
        <main className="flex-1 overflow-y-auto p-4 flex justify-center"
          onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
          onDrop={onCanvasDrop}>
          <div className="transition-all duration-300" style={{ width: deviceWidth, maxWidth: '100%' }}>
            <div ref={canvasRef} className="bg-white rounded-xl shadow-lg border border-gray-200 min-h-[600px] relative overflow-hidden">
              {elements.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-gray-300 select-none"
                  onDragOver={e => { e.preventDefault(); setDragOver('root'); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={onCanvasDrop}>
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6c63ff] to-[#e91e63] flex items-center justify-center text-white text-3xl mb-4 shadow-lg animate-bounce">◆</div>
                  <h3 className="text-gray-500 font-bold text-lg mb-1">ابدأ ببناء صفحتك</h3>
                  <p className="text-gray-400 text-sm mb-6">اسحب العناصر من الشريط الجانبي هنا</p>
                  <div className="flex gap-2">
                    <button onClick={() => addElement('hero')} className="px-4 py-2 bg-[#6c63ff] text-white rounded-lg text-sm font-semibold hover:bg-[#5b52e0] transition">+ هيرو</button>
                    <button onClick={() => addElement('features-grid')} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">+ مميزات</button>
                    <button onClick={() => addElement('pricing-table')} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">+ أسعار</button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {elements.map(el => (
                    <CanvasElement key={el.id} el={el} selected={selectedId === el.id}
                      onSelect={() => setSelectedId(el.id)}
                      onDelete={() => deleteEl(el.id)}
                      onDuplicate={() => duplicateEl(el.id)}
                      onDragStart={onElDragStart} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* RIGHT PANEL */}
        <aside className="w-[280px] bg-white border-l border-gray-200 flex flex-col flex-shrink-0 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button onClick={() => setRightTab('style')} className={`flex-1 py-2.5 text-xs font-bold transition ${rightTab === 'style' ? 'text-[#6c63ff] border-b-2 border-[#6c63ff]' : 'text-gray-400 hover:text-gray-600'}`}>التنسيق</button>
            <button onClick={() => setRightTab('settings')} className={`flex-1 py-2.5 text-xs font-bold transition ${rightTab === 'settings' ? 'text-[#6c63ff] border-b-2 border-[#6c63ff]' : 'text-gray-400 hover:text-gray-600'}`}>الإعدادات</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {rightTab === 'style' ? (
              selectedEl ? (
                <StylePanel element={selectedEl} updateStyle={(s) => updateElStyle(selectedEl.id, s)} updateContent={(c) => updateElContent(selectedEl.id, c)} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-300">
                  <div className="text-3xl mb-2">🎨</div>
                  <p className="text-xs text-gray-400">اختر عنصر لتعديله</p>
                </div>
              )
            ) : (
              <SettingsPanel pageId={id} />
            )}
          </div>
        </aside>
      </div>

      {toast && <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#1a1a2e] text-white px-5 py-2.5 rounded-xl text-sm font-medium z-50 shadow-xl">{toast}</div>}
    </div>
  );
}

function getElLabel(type: string): string {
  const map: Record<string, string> = {
    heading: 'عنوان', subheading: 'عنوان فرعي', paragraph: 'فقرة', list: 'قائمة', quote: 'اقتباس',
    image: 'صورة', video: 'فيديو', icon: 'أيقونة', gallery: 'معرض',
    button: 'زر', 'buttons-group': 'أزرار', link: 'رابط',
    form: 'نموذج', newsletter: 'نشرة', countdown: 'عد تنازلي', counter: 'عدّاد',
    hero: 'هيرو', 'hero-split': 'هيرو مقسوم', 'features-grid': 'مميزات', 'features-cards': 'كروت مميزات',
    stats: 'إحصائيات', 'pricing-table': 'أسعار', testimonials: 'شهادات', faq: 'أسئلة شائعة',
    cta: 'دعوة للعمل', team: 'فريق', 'logo-cloud': 'شركاء', 'testimonial-carousel': 'سلايدر شهادات',
    footer: 'تذييل', section: 'قسم', 'columns-2': 'عمودين', 'columns-3': '3 أعمدة', 'columns-4': '4 أعمدة',
  };
  return map[type] || type;
}

function CanvasElement({ el, selected, onSelect, onDelete, onDuplicate, onDragStart }: {
  el: Element; selected: boolean; onSelect: () => void; onDelete: () => void; onDuplicate: () => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}) {
  const s = el.style || {};
  const baseStyle: React.CSSProperties = {
    padding: s.padding, margin: s.margin, backgroundColor: s.bgColor, color: s.textColor,
    borderRadius: s.borderRadius, fontSize: s.fontSize, fontWeight: s.fontWeight as any,
    textAlign: s.textAlign as any, width: s.width, maxWidth: s.maxWidth, height: s.height,
    border: s.border, boxShadow: s.boxShadow, opacity: s.opacity ? parseFloat(s.opacity) : undefined,
    position: 'relative' as const,
  };

  return (
    <div onClick={onSelect} draggable onDragStart={e => onDragStart(e, el.id)}
      className={`group cursor-pointer transition-all ${selected ? 'ring-2 ring-[#6c63ff] ring-offset-1' : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-1'}`}
      style={baseStyle}>
      {selected && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-[#1a1a2e] rounded-lg px-1 py-0.5 shadow-lg z-50">
          <span className="text-[10px] text-gray-400 px-1.5 font-bold">{getElLabel(el.type)}</span>
          <div className="w-px h-3.5 bg-gray-600" />
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 rounded text-[10px] transition">✕</button>
          <button onClick={e => { e.stopPropagation(); onDuplicate(); }} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#6c63ff] rounded text-[10px] transition">⧉</button>
        </div>
      )}
      <RenderElement el={el} />
    </div>
  );
}

function RenderElement({ el }: { el: Element }) {
  const c = el.content || {};
  const s = el.style || {};

  switch (el.type) {
    case 'heading':
      return <h1 style={{ fontSize: s.fontSize || '36px', fontWeight: s.fontWeight || '800', textAlign: (s.textAlign as any) || 'center', padding: s.padding || '16px 20px', color: s.textColor }}>{c.text}</h1>;
    case 'subheading':
      return <h2 style={{ fontSize: s.fontSize || '24px', fontWeight: s.fontWeight || '700', textAlign: (s.textAlign as any) || 'center', padding: s.padding || '8px 20px', color: s.textColor }}>{c.text}</h2>;
    case 'paragraph':
      return <p style={{ fontSize: s.fontSize || '16px', lineHeight: 1.8, textAlign: (s.textAlign as any) || 'center', padding: s.padding || '8px 20px', color: s.textColor || '#475569', maxWidth: 700, margin: '0 auto' }}>{c.text}</p>;
    case 'list':
      return <ul style={{ padding: '16px 20px', maxWidth: 600, margin: '0 auto' }}>{(c.items || []).map((item: string, i: number) => <li key={i} style={{ padding: '6px 0', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>{c.style === 'check' ? '✓' : c.style === 'bullet' ? '●' : `${i+1}.`} {item}</li>)}</ul>;
    case 'quote':
      return <blockquote style={{ borderRight: '4px solid #6c63ff', padding: '16px 24px', margin: '16px auto', maxWidth: 600, background: '#f8fafc', borderRadius: '0 8px 8px 0' }}><p style={{ fontSize: 16, fontStyle: 'italic', color: '#475569' }}>"{c.text}"</p><footer style={{ fontSize: 13, color: '#94a3b8', marginTop: 8 }}>— {c.author}</footer></blockquote>;
    case 'image':
      return c.src ? <div style={{ textAlign: 'center', padding: 16 }}><img src={c.src} alt={c.alt || ''} style={{ maxWidth: c.width || '100%', borderRadius: s.borderRadius || 8 }} /></div> : <div style={{ padding: 20, textAlign: 'center', background: '#f1f5f9', borderRadius: 8, margin: 16, color: '#94a3b8', fontSize: 14 }}>🖼 اضغط هنا لإضافة صورة</div>;
    case 'video':
      return c.url ? <div style={{ textAlign: 'center', padding: 16 }}><iframe src={c.url} style={{ width: '100%', maxWidth: 640, aspectRatio: '16/9', borderRadius: 8, border: 'none' }} /></div> : <div style={{ padding: 20, textAlign: 'center', background: '#f1f5f9', borderRadius: 8, margin: 16, color: '#94a3b8', fontSize: 14 }}>▶ اضغط هنا لإضافة فيديو</div>;
    case 'icon':
      return <div style={{ textAlign: 'center', padding: 16 }}><span style={{ fontSize: c.size || 48 }}>{c.emoji}</span></div>;
    case 'gallery':
      return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, padding: 16 }}>{(c.images || []).map((img: any, i: number) => <div key={i} style={{ aspectRatio: '1', background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 12 }}>صورة {i+1}</div>)}</div>;
    case 'button':
      return <div style={{ textAlign: 'center', padding: 16 }}><a href={c.link || '#'} style={{ display: 'inline-block', padding: '14px 36px', background: c.variant === 'secondary' ? 'transparent' : '#6c63ff', color: c.variant === 'secondary' ? '#6c63ff' : '#fff', border: c.variant === 'secondary' ? '2px solid #6c63ff' : 'none', borderRadius: s.borderRadius || 8, fontSize: s.fontSize || 16, fontWeight: s.fontWeight || 600, textDecoration: 'none', transition: 'all 0.2s' }}>{c.text}</a></div>;
    case 'buttons-group':
      return <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: 16, flexWrap: 'wrap' }}>{(c.buttons || []).map((btn: any, i: number) => <a key={i} href={btn.link || '#'} style={{ display: 'inline-block', padding: '12px 28px', background: btn.variant === 'secondary' ? '#f1f5f9' : '#6c63ff', color: btn.variant === 'secondary' ? '#475569' : '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>{btn.text}</a>)}</div>;
    case 'link':
      return <div style={{ textAlign: 'center', padding: 16 }}><a href={c.url || '#'} style={{ color: '#6c63ff', fontSize: 16, fontWeight: 600, textDecoration: 'underline' }}>{c.text}</a></div>;
    case 'form':
      return <div style={{ padding: '40px 20px', maxWidth: 500, margin: '0 auto' }}><h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>{c.title}</h2><div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{(c.fields || []).map((f: string, i: number) => i === c.fields.length - 1 ? <textarea key={i} placeholder={f} style={{ padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 15, minHeight: 100 }} /> : <input key={i} placeholder={f} style={{ padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 15 }} />)}<button style={{ padding: 14, background: '#6c63ff', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{c.submitText}</button></div></div>;
    case 'newsletter':
      return <div style={{ padding: '60px 20px', textAlign: 'center', background: 'linear-gradient(135deg,#6c63ff,#e91e63)', color: '#fff' }}><h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{c.title}</h2><p style={{ opacity: 0.9, marginBottom: 24 }}>{c.subtitle}</p><div style={{ display: 'flex', justifyContent: 'center', gap: 8, maxWidth: 400, margin: '0 auto' }}><input placeholder="بريدك الإلكتروني" style={{ flex: 1, padding: '14px 16px', borderRadius: 8, border: 'none', fontSize: 15 }} /><button style={{ padding: '14px 24px', background: '#fff', color: '#6c63ff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700 }}>{c.buttonText}</button></div></div>;
    case 'countdown':
      return <div style={{ padding: '40px 20px', textAlign: 'center' }}><p style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>{c.label}</p><div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>{['أيام','ساعات','دقائق','ثواني'].map((l,i) => <div key={i} style={{ background: '#1a1a2e', color: '#fff', borderRadius: 8, padding: '16px 20px', minWidth: 70 }}><div style={{ fontSize: 28, fontWeight: 800 }}>00</div><div style={{ fontSize: 11, opacity: 0.7 }}>{l}</div></div>)}</div></div>;
    case 'counter':
      return <div style={{ padding: '60px 20px', background: '#f8fafc' }}><div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>{(c.numbers || []).map((n: any, i: number) => <div key={i} style={{ textAlign: 'center' }}><div style={{ fontSize: 40, fontWeight: 800, color: '#6c63ff' }}>{n.value}</div><div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{n.label}</div></div>)}</div></div>;
    case 'hero':
      return <div style={{ background: c.bgGradient || `linear-gradient(135deg,${c.bgColor || '#6c63ff'},#1d4ed8)`, color: '#fff', padding: '80px 32px', textAlign: 'center' }}>{c.badge && <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: 20, fontSize: 13, marginBottom: 16 }}>{c.badge}</div>}<h1 style={{ fontSize: 44, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>{c.title}</h1><p style={{ fontSize: 20, opacity: 0.9, marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>{c.subtitle}</p><a href={c.buttonLink || '#'} style={{ display: 'inline-block', padding: '16px 40px', background: '#fff', color: c.bgColor || '#6c63ff', borderRadius: 8, fontSize: 18, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>{c.buttonText}</a></div>;
    case 'hero-split':
      return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 400, background: c.bgColor || '#f8fafc' }}><div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 40px' }}><h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>{c.title}</h1><p style={{ fontSize: 18, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>{c.subtitle}</p><div><a href={c.buttonLink || '#'} style={{ display: 'inline-block', padding: '14px 32px', background: '#6c63ff', color: '#fff', borderRadius: 8, fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>{c.buttonText}</a></div></div><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>{c.image ? <img src={c.image} style={{ width: '100%', maxWidth: 400, borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }} /> : <div style={{ width: '100%', maxWidth: 400, aspectRatio: '1', background: '#e2e8f0', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>🖼 صورة</div>}</div></div>;
    case 'features-grid':
      return <div style={{ padding: '60px 20px', textAlign: 'center' }}><h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{c.title}</h2><p style={{ color: '#64748b', marginBottom: 40, fontSize: 16 }}>{c.subtitle}</p><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, maxWidth: 1000, margin: '0 auto' }}>{(c.items || []).map((item: any, i: number) => <div key={i} style={{ textAlign: 'center', padding: 24 }}><div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div><h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3><p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{item.desc}</p></div>)}</div></div>;
    case 'features-cards':
      return <div style={{ padding: '60px 20px' }}><h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 40 }}>{c.title}</h2><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, maxWidth: 900, margin: '0 auto' }}>{(c.items || []).map((item: any, i: number) => <div key={i} style={{ padding: 32, borderRadius: 16, border: '1px solid #e2e8f0', borderTop: `3px solid ${item.color || '#6c63ff'}`, background: '#fff' }}><div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div><h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3><p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{item.desc}</p></div>)}</div></div>;
    case 'stats':
      return <div style={{ background: s.bgColor || '#1a1a2e', padding: '60px 20px' }}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 32, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>{(c.items || []).map((item: any, i: number) => <div key={i}><div style={{ fontSize: 40, fontWeight: 800, color: '#6c63ff' }}>{item.value}</div><div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>{item.label}</div></div>)}</div></div>;
    case 'pricing-table':
      return <div style={{ padding: '60px 20px', background: '#f8fafc', textAlign: 'center' }}><h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{c.title}</h2><p style={{ color: '#64748b', marginBottom: 40 }}>{c.subtitle}</p><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, maxWidth: 1000, margin: '0 auto' }}>{(c.plans || []).map((plan: any, i: number) => <div key={i} style={{ padding: 32, borderRadius: 16, border: plan.featured ? '2px solid #6c63ff' : '1px solid #e2e8f0', background: plan.featured ? 'rgba(108,99,255,0.03)' : '#fff', position: 'relative', transform: plan.featured ? 'scale(1.05)' : 'none' }}>{plan.featured && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#6c63ff', color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>الأكثر شيوعاً</div>}<h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{plan.name}</h3><div style={{ marginBottom: 20 }}><span style={{ fontSize: 40, fontWeight: 800, color: '#6c63ff' }}>${plan.price}</span><span style={{ fontSize: 14, color: '#94a3b8' }}>{plan.period}</span></div><ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: 24 }}>{(plan.features || []).map((f: string, j: number) => <li key={j} style={{ padding: '8px 0', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #f1f5f9' }}><span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>{f}</li>)}</ul><a href="#" style={{ display: 'block', padding: '14px', background: plan.featured ? '#6c63ff' : 'transparent', color: plan.featured ? '#fff' : '#6c63ff', border: plan.featured ? 'none' : '2px solid #6c63ff', borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>{plan.cta}</a></div>)}</div></div>;
    case 'testimonials':
      return <div style={{ padding: '60px 20px', textAlign: 'center' }}><h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 40 }}>{c.title}</h2><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, maxWidth: 1000, margin: '0 auto' }}>{(c.items || []).map((item: any, i: number) => <div key={i} style={{ background: '#f8fafc', borderRadius: 16, padding: 32, textAlign: 'center' }}><div style={{ fontSize: 32, marginBottom: 12 }}>{item.avatar}</div><p style={{ fontSize: 15, fontStyle: 'italic', color: '#475569', marginBottom: 16, lineHeight: 1.6 }}>"{item.text}"</p><div style={{ fontWeight: 700, fontSize: 15 }}>{item.author}</div><div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{item.role}</div></div>)}</div></div>;
    case 'faq':
      return <div style={{ padding: '60px 20px', maxWidth: 700, margin: '0 auto' }}><h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 40 }}>{c.title}</h2>{(c.items || []).map((item: any, i: number) => <div key={i} style={{ borderBottom: '1px solid #e2e8f0', padding: '20px 0' }}><div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: '#1a1a2e' }}>{item.q}</div><div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{item.a}</div></div>)}</div>;
    case 'cta':
      return <div style={{ background: s.bgColor || '#6c63ff', padding: '60px 20px', textAlign: 'center', color: '#fff' }}><h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>{c.title}</h2><p style={{ fontSize: 18, opacity: 0.9, marginBottom: 28 }}>{c.subtitle}</p><a href="#" style={{ display: 'inline-block', padding: '16px 40px', background: '#fff', color: s.bgColor || '#6c63ff', borderRadius: 8, fontSize: 18, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>{c.buttonText}</a></div>;
    case 'team':
      return <div style={{ padding: '60px 20px', textAlign: 'center' }}><h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 40 }}>{c.title}</h2><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 24, maxWidth: 800, margin: '0 auto' }}>{(c.members || []).map((m: any, i: number) => <div key={i} style={{ textAlign: 'center' }}><div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 12px' }}>{m.avatar}</div><div style={{ fontWeight: 700, fontSize: 16 }}>{m.name}</div><div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{m.role}</div></div>)}</div></div>;
    case 'logo-cloud':
      return <div style={{ padding: '60px 20px', textAlign: 'center' }}><h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 32, color: '#94a3b8' }}>{c.title}</h2><div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', fontSize: 36 }}>{(c.logos || []).map((logo: string, i: number) => <span key={i} style={{ opacity: 0.4 }}>{logo}</span>)}</div></div>;
    case 'testimonial-carousel':
      return <div style={{ padding: '40px 20px', background: '#f8fafc' }}><div style={{ display: 'flex', justifyContent: 'center', gap: 20, overflowX: 'auto', padding: 20 }}>{(c.testimonials || []).map((t: any, i: number) => <div key={i} style={{ minWidth: 250, background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0', flexShrink: 0 }}><div style={{ color: '#f59e0b', fontSize: 16, marginBottom: 8 }}>{'★'.repeat(t.rating)}</div><p style={{ fontSize: 14, color: '#475569', marginBottom: 12 }}>{t.text}</p><div style={{ fontWeight: 700, fontSize: 13 }}>{t.author}</div></div>)}</div></div>;
    case 'footer':
      return <footer style={{ background: '#0f172a', color: '#fff', padding: '32px 20px', textAlign: 'center' }}><p style={{ opacity: 0.7, fontSize: 14, marginBottom: 12 }}>{c.text}</p>{c.links && <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>{c.links.map((l: any, i: number) => <a key={i} href={l.url} style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'none' }}>{l.text}</a>)}</div>}</footer>;
    case 'section':
      return <div style={{ padding: s.padding || '20px', minHeight: 60, border: '2px dashed #e2e8f0', borderRadius: 8, margin: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: 12 }}>📦 قسم - اسحب العناصر هنا</div>;
    case 'columns-2':
      return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 16 }}>{[1,2].map(i => <div key={i} style={{ minHeight: 80, border: '2px dashed #e2e8f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: 12 }}>عمود {i}</div>)}</div>;
    case 'columns-3':
      return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, padding: 16 }}>{[1,2,3].map(i => <div key={i} style={{ minHeight: 80, border: '2px dashed #e2e8f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: 12 }}>عمود {i}</div>)}</div>;
    case 'columns-4':
      return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, padding: 16 }}>{[1,2,3,4].map(i => <div key={i} style={{ minHeight: 80, border: '2px dashed #e2e8f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: 12 }}>عمود {i}</div>)}</div>;
    default: return null;
  }
}

function StylePanel({ element, updateStyle, updateContent }: { element: Element; updateStyle: (s: Partial<ElStyle>) => void; updateContent: (c: any) => void; }) {
  const s = element.style || {};
  const c = element.content;
  const [showIconPicker, setShowIconPicker] = useState<{field: string; idx?: number} | null>(null);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-gray-100 p-3"><div className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-2">{title}</div>{children}</div>
  );

  const Input = ({ label, value, onChange, type = 'text', placeholder }: any) => (
    <div className="mb-2"><label className="text-[10px] text-gray-500 font-semibold block mb-0.5">{label}</label>
    {type === 'color' ? <div className="flex gap-1.5 items-center"><input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)} className="w-7 h-7 rounded border border-gray-200 cursor-pointer" /><input value={value || ''} onChange={e => onChange(e.target.value)} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[11px]" placeholder="#000" /></div>
    : <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-[11px] outline-none focus:border-[#6c63ff]" />}
    </div>
  );

  const IconBtn = ({ value, onClick }: { value: string; onClick: () => void }) => (
    <div className="mb-2"><label className="text-[10px] text-gray-500 font-semibold block mb-0.5">الأيقونة</label>
    <button onClick={onClick} className="flex items-center gap-2 w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-[11px] hover:border-[#6c63ff] transition">
      <span className="text-lg">{value || '⭐'}</span>
      <span className="text-gray-400">اضغط للاختيار</span>
    </button></div>
  );

  return (
    <div className="relative">
      {showIconPicker && (
        <div className="absolute left-0 top-0 z-50"><IconPicker value="" onChange={(icon) => {
          if (showIconPicker.idx !== undefined) {
            const items = [...(c.items || [])];
            items[showIconPicker.idx] = {...items[showIconPicker.idx], icon};
            updateContent({...c, items});
          } else {
            updateContent({...c, [showIconPicker.field]: icon});
          }
          setShowIconPicker(null);
        }} onClose={() => setShowIconPicker(null)} /></div>
      )}
      {/* Content Section */}
      {element.type === 'heading' && <Section title="المحتوى"><Input label="النص" value={c.text} onChange={(v: string) => updateContent({...c, text: v})} /></Section>}
      {element.type === 'subheading' && <Section title="المحتوى"><Input label="النص" value={c.text} onChange={(v: string) => updateContent({...c, text: v})} /></Section>}
      {element.type === 'paragraph' && <Section title="المحتوى"><label className="text-[10px] text-gray-500 font-semibold block mb-0.5">النص</label><textarea value={c.text} onChange={e => updateContent({...c, text: e.target.value})} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-[11px] outline-none focus:border-[#6c63ff] min-h-20" /></Section>}
      {element.type === 'button' && <Section title="المحتوى"><Input label="النص" value={c.text} onChange={(v: string) => updateContent({...c, text: v})} /><Input label="الرابط" value={c.link} onChange={(v: string) => updateContent({...c, link: v})} /><div className="mb-2"><label className="text-[10px] text-gray-500 font-semibold block mb-0.5">النوع</label><div className="flex gap-1">{['primary','secondary'].map(v => <button key={v} onClick={() => updateContent({...c, variant: v})} className={`px-3 py-1 rounded text-[10px] font-semibold border ${c.variant === v ? 'bg-[#6c63ff] text-white border-[#6c63ff]' : 'border-gray-200 text-gray-500'}`}>{v === 'primary' ? 'رئيسي' : 'ثانوي'}</button>)}</div></div></Section>}
      {element.type === 'hero' && <Section title="المحتوى"><Input label="العنوان" value={c.title} onChange={(v: string) => updateContent({...c, title: v})} /><Input label="الوصف" value={c.subtitle} onChange={(v: string) => updateContent({...c, subtitle: v})} /><Input label="نص الزر" value={c.buttonText} onChange={(v: string) => updateContent({...c, buttonText: v})} /><Input label="رابط الزر" value={c.buttonLink} onChange={(v: string) => updateContent({...c, buttonLink: v})} /><Input label="الشارة" value={c.badge} onChange={(v: string) => updateContent({...c, badge: v})} /><Input label="اللون الأساسي" value={c.bgColor} onChange={(v: string) => updateContent({...c, bgColor: v})} type="color" /></Section>}
      {element.type === 'hero-split' && <Section title="المحتوى"><Input label="العنوان" value={c.title} onChange={(v: string) => updateContent({...c, title: v})} /><Input label="الوصف" value={c.subtitle} onChange={(v: string) => updateContent({...c, subtitle: v})} /><Input label="نص الزر" value={c.buttonText} onChange={(v: string) => updateContent({...c, buttonText: v})} /><Input label="رابط الصورة" value={c.image} onChange={(v: string) => updateContent({...c, image: v})} /></Section>}
      {element.type === 'quote' && <Section title="المحتوى"><Input label="الاقتباس" value={c.text} onChange={(v: string) => updateContent({...c, text: v})} /><Input label="المؤلف" value={c.author} onChange={(v: string) => updateContent({...c, author: v})} /></Section>}
      {element.type === 'list' && <Section title="المحتوى"><label className="text-[10px] text-gray-500 font-semibold block mb-0.5">البنود (كل سطر بند)</label><textarea value={(c.items || []).join('\n')} onChange={e => updateContent({...c, items: e.target.value.split('\n')})} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-[11px] min-h-20" /></Section>}
      {element.type === 'cta' && <Section title="المحتوى"><Input label="العنوان" value={c.title} onChange={(v: string) => updateContent({...c, title: v})} /><Input label="الوصف" value={c.subtitle} onChange={(v: string) => updateContent({...c, subtitle: v})} /><Input label="نص الزر" value={c.buttonText} onChange={(v: string) => updateContent({...c, buttonText: v})} /></Section>}
      {element.type === 'newsletter' && <Section title="المحتوى"><Input label="العنوان" value={c.title} onChange={(v: string) => updateContent({...c, title: v})} /><Input label="الوصف" value={c.subtitle} onChange={(v: string) => updateContent({...c, subtitle: v})} /><Input label="نص الزر" value={c.buttonText} onChange={(v: string) => updateContent({...c, buttonText: v})} /></Section>}
      {element.type === 'form' && <Section title="المحتوى"><Input label="العنوان" value={c.title} onChange={(v: string) => updateContent({...c, title: v})} /><Input label="نص الزر" value={c.submitText} onChange={(v: string) => updateContent({...c, submitText: v})} /></Section>}
      {element.type === 'icon' && <Section title="المحتوى"><IconBtn value={c.emoji} onClick={() => setShowIconPicker({field: 'emoji'})} /><Input label="الحجم" value={c.size} onChange={(v: string) => updateContent({...c, size: v})} /></Section>}
      {element.type === 'image' && <Section title="المحتوى"><Input label="الرابط" value={c.src} onChange={(v: string) => updateContent({...c, src: v})} /><Input label="الوصف" value={c.alt} onChange={(v: string) => updateContent({...c, alt: v})} /></Section>}
      {element.type === 'features-grid' && <Section title="المحتوى"><Input label="العنوان" value={c.title} onChange={(v: string) => updateContent({...c, title: v})} /><Input label="الوصف" value={c.subtitle} onChange={(v: string) => updateContent({...c, subtitle: v})} />{(c.items || []).map((item: any, i: number) => <div key={i} className="border-t border-gray-100 pt-2 mt-2"><div className="flex items-center justify-between mb-1"><span className="text-[10px] text-gray-400">الميزة {i+1}</span><button onClick={() => { const items = [...c.items]; items.splice(i,1); updateContent({...c, items}); }} className="text-[10px] text-red-400">✕</button></div><IconBtn value={item.icon} onClick={() => setShowIconPicker({field: 'icon', idx: i})} /><Input label="العنوان" value={item.title} onChange={(v: string) => { const items = [...c.items]; items[i] = {...items[i], title: v}; updateContent({...c, items}); }} /><Input label="الوصف" value={item.desc} onChange={(v: string) => { const items = [...c.items]; items[i] = {...items[i], desc: v}; updateContent({...c, items}); }} /></div>)}<button onClick={() => updateContent({...c, items: [...(c.items || []), {icon:'⭐',title:'ميزة جديدة',desc:'وصف الميزة'}]})} className="w-full py-1.5 border border-dashed border-gray-300 rounded-lg text-[10px] text-gray-400 hover:border-[#6c63ff] hover:text-[#6c63ff]">+ إضافة ميزة</button></Section>}
      {element.type === 'features-cards' && <Section title="المحتوى"><Input label="العنوان" value={c.title} onChange={(v: string) => updateContent({...c, title: v})} />{(c.items || []).map((item: any, i: number) => <div key={i} className="border-t border-gray-100 pt-2 mt-2"><div className="flex items-center justify-between mb-1"><span className="text-[10px] text-gray-400">الكروت {i+1}</span><button onClick={() => { const items = [...c.items]; items.splice(i,1); updateContent({...c, items}); }} className="text-[10px] text-red-400">✕</button></div><IconBtn value={item.icon} onClick={() => setShowIconPicker({field: 'icon', idx: i})} /><Input label="العنوان" value={item.title} onChange={(v: string) => { const items = [...c.items]; items[i] = {...items[i], title: v}; updateContent({...c, items}); }} /><Input label="الوصف" value={item.desc} onChange={(v: string) => { const items = [...c.items]; items[i] = {...items[i], desc: v}; updateContent({...c, items}); }} /><Input label="اللون" value={item.color} onChange={(v: string) => { const items = [...c.items]; items[i] = {...items[i], color: v}; updateContent({...c, items}); }} type="color" /></div>)}<button onClick={() => updateContent({...c, items: [...(c.items || []), {icon:'⭐',title:'كروت جديدة',desc:'وصف',color:'#6c63ff'}]})} className="w-full py-1.5 border border-dashed border-gray-300 rounded-lg text-[10px] text-gray-400 hover:border-[#6c63ff] hover:text-[#6c63ff]">+ إضافة كرت</button></Section>}
      {element.type === 'team' && <Section title="المحتوى"><Input label="العنوان" value={c.title} onChange={(v: string) => updateContent({...c, title: v})} />{(c.members || []).map((m: any, i: number) => <div key={i} className="border-t border-gray-100 pt-2 mt-2"><div className="flex items-center justify-between mb-1"><span className="text-[10px] text-gray-400">العضو {i+1}</span><button onClick={() => { const members = [...c.members]; members.splice(i,1); updateContent({...c, members}); }} className="text-[10px] text-red-400">✕</button></div><IconBtn value={m.avatar} onClick={() => setShowIconPicker({field: 'avatar', idx: i})} /><Input label="الاسم" value={m.name} onChange={(v: string) => { const members = [...c.members]; members[i] = {...members[i], name: v}; updateContent({...c, members}); }} /><Input label="الدور" value={m.role} onChange={(v: string) => { const members = [...c.members]; members[i] = {...members[i], role: v}; updateContent({...c, members}); }} /></div>)}<button onClick={() => updateContent({...c, members: [...(c.members || []), {avatar:'👤',name:'عضو جديد',role:'الدور'}]})} className="w-full py-1.5 border border-dashed border-gray-300 rounded-lg text-[10px] text-gray-400 hover:border-[#6c63ff] hover:text-[#6c63ff]">+ إضافة عضو</button></Section>}
      {element.type === 'testimonials' && <Section title="المحتوى"><Input label="العنوان" value={c.title} onChange={(v: string) => updateContent({...c, title: v})} />{(c.items || []).map((item: any, i: number) => <div key={i} className="border-t border-gray-100 pt-2 mt-2"><div className="flex items-center justify-between mb-1"><span className="text-[10px] text-gray-400">الشهادة {i+1}</span><button onClick={() => { const items = [...c.items]; items.splice(i,1); updateContent({...c, items}); }} className="text-[10px] text-red-400">✕</button></div><IconBtn value={item.avatar} onClick={() => setShowIconPicker({field: 'avatar', idx: i})} /><Input label="النص" value={item.text} onChange={(v: string) => { const items = [...c.items]; items[i] = {...items[i], text: v}; updateContent({...c, items}); }} /><Input label="المؤلف" value={item.author} onChange={(v: string) => { const items = [...c.items]; items[i] = {...items[i], author: v}; updateContent({...c, items}); }} /><Input label="الدور" value={item.role} onChange={(v: string) => { const items = [...c.items]; items[i] = {...items[i], role: v}; updateContent({...c, items}); }} /></div>)}<button onClick={() => updateContent({...c, items: [...(c.items || []), {avatar:'💬',text:'شهادة جديدة',author:'الاسم',role:'الدور'}]})} className="w-full py-1.5 border border-dashed border-gray-300 rounded-lg text-[10px] text-gray-400 hover:border-[#6c63ff] hover:text-[#6c63ff]">+ إضافة شهادة</button></Section>}

      {/* Typography */}
      <Section title="الخط">
        <div className="grid grid-cols-2 gap-1.5">
          <div><label className="text-[10px] text-gray-500 font-semibold block mb-0.5">الحجم</label>
            <select value={s.fontSize || ''} onChange={e => updateStyle({fontSize: e.target.value})} className="w-full px-2 py-1 border border-gray-200 rounded text-[11px] outline-none">
              <option value="">افتراضي</option>
              {FONT_SIZES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div><label className="text-[10px] text-gray-500 font-semibold block mb-0.5">الوزن</label>
            <select value={s.fontWeight || ''} onChange={e => updateStyle({fontWeight: e.target.value})} className="w-full px-2 py-1 border border-gray-200 rounded text-[11px] outline-none">
              <option value="">افتراضي</option>
              {FONT_WEIGHTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-2"><label className="text-[10px] text-gray-500 font-semibold block mb-0.5">محاذاة</label>
          <div className="flex gap-1">{['left','center','right'].map(a => <button key={a} onClick={() => updateStyle({textAlign: a})} className={`flex-1 py-1 rounded text-[10px] border ${s.textAlign === a ? 'bg-[#6c63ff] text-white border-[#6c63ff]' : 'border-gray-200 text-gray-500'}`}>{a === 'left' ? '←' : a === 'center' ? '↔' : '→'}</button>)}</div>
        </div>
      </Section>

      {/* Colors */}
      <Section title="الألوان">
        <Input label="لون النص" value={s.textColor} onChange={(v: string) => updateStyle({textColor: v})} type="color" />
        <Input label="لون الخلفية" value={s.bgColor} onChange={(v: string) => updateStyle({bgColor: v})} type="color" />
        <div className="flex flex-wrap gap-1 mt-1">{COLOR_PRESETS.map(c => <button key={c} onClick={() => updateStyle({bgColor: c})} className="w-5 h-5 rounded border border-gray-200" style={{background: c}} />)}</div>
      </Section>

      {/* Spacing */}
      <Section title="المسافات">
        <div className="grid grid-cols-2 gap-1.5">
          <Input label="Padding" value={s.padding} onChange={(v: string) => updateStyle({padding: v})} placeholder="16px 20px" />
          <Input label="Margin" value={s.margin} onChange={(v: string) => updateStyle({margin: v})} placeholder="0 auto" />
        </div>
        <Input label="الارتفاع" value={s.height} onChange={(v: string) => updateStyle({height: v})} placeholder="40px" />
      </Section>

      {/* Border & Effects */}
      <Section title="الحدود والأثر">
        <Input label="الحدود" value={s.borderRadius} onChange={(v: string) => updateStyle({borderRadius: v})} placeholder="8px" />
        <Input label="الظل" value={s.boxShadow} onChange={(v: string) => updateStyle({boxShadow: v})} placeholder="0 4px 15px rgba(0,0,0,0.1)" />
        <Input label="الشفافية" value={s.opacity} onChange={(v: string) => updateStyle({opacity: v})} placeholder="1" />
      </Section>
    </div>
  );
}

function SettingsPanel({ pageId }: { pageId: string }) {
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [customCss, setCustomCss] = useState('');

  useEffect(() => {
    fetch('/api/pages/' + pageId).then(r => r.json()).then(d => {
      if (d.page) {
        setSeoTitle(d.page.seo_title || '');
        setSeoDesc(d.page.seo_description || '');
        setSeoKeywords(d.page.seo_keywords || '');
        setCustomCss(d.page.custom_css || '');
      }
    });
  }, [pageId]);

  async function saveSettings() {
    await fetch('/api/pages/' + pageId, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ seo_title: seoTitle, seo_description: seoDesc, seo_keywords: seoKeywords, custom_css: customCss }) });
  }

  return (
    <div className="p-3 space-y-3">
      <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">SEO</div>
      <div><label className="text-[10px] text-gray-500 font-semibold block mb-0.5">عنوان الصفحة</label><input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-[11px] outline-none focus:border-[#6c63ff]" /></div>
      <div><label className="text-[10px] text-gray-500 font-semibold block mb-0.5">الوصف</label><textarea value={seoDesc} onChange={e => setSeoDesc(e.target.value)} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-[11px] outline-none focus:border-[#6c63ff] min-h-16" /></div>
      <div><label className="text-[10px] text-gray-500 font-semibold block mb-0.5">الكلمات المفتاحية</label><input value={seoKeywords} onChange={e => setSeoKeywords(e.target.value)} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-[11px] outline-none focus:border-[#6c63ff]" /></div>
      <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wider pt-2">CSS مخصص</div>
      <div><textarea value={customCss} onChange={e => setCustomCss(e.target.value)} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-[11px] outline-none focus:border-[#6c63ff] min-h-24 font-mono" placeholder=".my-class { color: red; }" /></div>
      <button onClick={saveSettings} className="w-full py-2 bg-[#6c63ff] text-white rounded-lg text-xs font-bold hover:bg-[#5b52e0]">حفظ الإعدادات</button>
    </div>
  );
}
