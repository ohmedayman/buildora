'use client';

import Link from 'next/link';

const stats = [
  { value: '10K+', label: 'مستخدم نشط' },
  { value: '99.9%', label: 'وقت تشغيل' },
  { value: '4.9/5', label: 'تقييم المستخدمين' },
  { value: '24/7', label: 'دعم فني' },
];

const steps = [
  { num: '01', title: 'سجّل حسابك', desc: 'أنشئ حسابك المجاني في أقل من 30 ثانية' },
  { num: '02', title: 'اختر قالبك', desc: 'ابدأ من قوالب جاهزة ومصممة بعناية' },
  { num: '03', title: 'اسحب وصمم', desc: 'غيّر النصوص والألوان والهيكل بثوانٍ' },
  { num: '04', title: 'انشر وشارك', desc: 'نشر صفحتك مباشرة مع رابط جاهز للمشاركة' },
];

const features = [
  { title: 'تصميم احترافي', desc: 'قوالب حديثة ومكونات جاهزة ترفع مستوى أي صفحة', icon: '🧩' },
  { title: 'سريع جداً', desc: 'أداء عالي وسرعة تحميل مبهرة لكل الصفحات', icon: '⚡' },
  { title: 'متجاوب', desc: 'يعمل بشكل ممتاز على الجوال والتابلت والحاسوب', icon: '📱' },
  { title: 'SEO متقدم', desc: 'أدوات جاهزة لظهور أفضل في محركات البحث', icon: '🔎' },
  { title: 'دومين مجاني', desc: 'احصل على دومين جاهز مثل اسمك.buildora...', icon: '🌐' },
  { title: 'تحليلات مباشرة', desc: 'تابع زوارك وتفاعلهم في الوقت الفعلي', icon: '📈' },
];

const templates = [
  { name: 'صفحة هبوط', category: 'تسويق', color: '#1B6B4A' },
  { name: 'متجر إلكتروني', category: 'تجارة', color: '#7C3AED' },
  { name: 'مدونة', category: 'محتوى', color: '#0891B2' },
  { name: 'بورتفوليو', category: 'عمل حر', color: '#D97706' },
  { name: 'موقع شركة', category: 'أعمال', color: '#2563EB' },
  { name: 'موقع شخصي', category: 'تعريف', color: '#DC2626' },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#F9FAFB' }} dir="rtl">
      {/* Navbar */}
      <nav className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E5E7EB' }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl font-extrabold text-white" style={{ background: 'var(--primary)', boxShadow: '0 2px 8px rgba(27,107,74,0.25)' }}>
              B
            </div>
            <span className="text-xl font-extrabold" style={{ color: '#111827' }}>Buildora</span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            <a href="#features" className="rounded-lg px-4 py-2 text-sm font-medium transition" style={{ color: '#374151' }}>المميزات</a>
            <a href="#how" className="rounded-lg px-4 py-2 text-sm font-medium transition" style={{ color: '#374151' }}>كيف تعمل</a>
            <Link href="/pricing" className="rounded-lg px-4 py-2 text-sm font-medium transition" style={{ color: '#374151' }}>الأسعار</Link>
            <div className="mx-2 h-5 w-px" style={{ background: '#E5E7EB' }} />
            <Link href="/login" className="px-4 py-2 text-sm font-semibold transition" style={{ color: '#374151' }}>دخول</Link>
            <Link href="/register" className="ml-2 rounded-lg px-6 py-2.5 text-sm font-bold text-white transition" style={{ background: 'var(--primary)', boxShadow: '0 2px 8px rgba(27,107,74,0.25)' }}>
              ابدأ مجاناً
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="px-6 py-20 lg:px-12 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-6" style={{ background: '#F0FDF4', color: 'var(--primary)' }}>
                <span className="h-2 w-2 rounded-full" style={{ background: 'var(--primary)' }} />
                منصة بناء صفحات #1 في المنطقة العربية
              </div>
              <h1 className="mb-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl" style={{ color: '#111827' }}>
                أنشئ موقعك
                <span style={{ color: 'var(--primary)' }}> في ثوانٍ</span>
                <br />
                بدون تعقيد
              </h1>
              <p className="mb-8 max-w-2xl text-lg leading-8" style={{ color: '#6B7280' }}>
                صمم صفحة احترافية، اجمع بين العناصر بسهولة، وشاركها فوراً. كل هذا في منصة واحدة تبقي تجربة البناء بسيطة وممتعة.
              </p>
              <div className="mb-8 flex flex-wrap items-center gap-4">
                <Link href="/register" className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-lg font-bold text-white transition" style={{ background: 'var(--primary)', boxShadow: '0 4px 14px rgba(27,107,74,0.3)' }}>
                  ابدأ مجاناً الآن
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </Link>
                <Link href="#how" className="rounded-xl border px-8 py-4 text-lg font-bold transition" style={{ borderColor: '#E5E7EB', color: '#374151', background: 'white' }}>
                  شاهد كيف تعمل
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: '#6B7280' }}>
                {['مجاني للبدء', 'بدون بطاقة ائتمان', 'إلغاء في أي وقت'].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-full px-3 py-2" style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <svg className="h-4 w-4" style={{ color: 'var(--success)' }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #E5E7EB', boxShadow: '0 20px 50px -12px rgba(0,0,0,0.15)' }}>
              <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1B6B4A 0%, #22C55E 100%)' }}>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>معاينة الصفحة</p>
                    <h2 className="text-xl font-extrabold">صفحة هبوط احترافية</h2>
                  </div>
                  <div className="rounded-full px-3 py-1 text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.2)' }}>Live</div>
                </div>
                <div className="rounded-xl p-4 backdrop-blur" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="mb-4 h-3 w-24 rounded-full" style={{ background: 'rgba(255,255,255,0.8)' }} />
                  <div className="mb-3 h-3 w-32 rounded-full" style={{ background: 'rgba(255,255,255,0.6)' }} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.15)' }}>
                      <div className="mb-2 h-2 w-16 rounded-full" style={{ background: 'rgba(255,255,255,0.8)' }} />
                      <div className="h-2 w-24 rounded-full" style={{ background: 'rgba(255,255,255,0.6)' }} />
                    </div>
                    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.15)' }}>
                      <div className="mb-2 h-2 w-16 rounded-full" style={{ background: 'rgba(255,255,255,0.8)' }} />
                      <div className="h-2 w-24 rounded-full" style={{ background: 'rgba(255,255,255,0.6)' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-6 py-16 lg:px-12" style={{ background: 'white', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl p-6 text-center" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                <div className="mb-2 text-3xl font-extrabold" style={{ color: '#111827' }}>{stat.value}</div>
                <div className="text-sm font-medium" style={{ color: '#6B7280' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="px-6 py-20 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-5" style={{ background: '#F0FDF4', color: 'var(--primary)' }}>كيف تعمل</div>
              <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: '#111827' }}>بناء موقعك أصبح أسهل من أي وقت</h2>
              <p className="mx-auto mt-3 max-w-2xl text-lg" style={{ color: '#6B7280' }}>4 خطوات بسيطة تمنحك صفحة احترافية جاهزة للنشر</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {steps.map((step) => (
                <div key={step.num} className="rounded-xl p-7 transition-all" style={{ background: 'white', border: '1px solid #E5E7EB' }}>
                  <div className="mb-5 h-14 w-14 rounded-xl flex items-center justify-center text-2xl" style={{ background: '#F0FDF4' }}>
                    {step.num === '01' ? '👋' : step.num === '02' ? '🎨' : step.num === '03' ? '✨' : '🚀'}
                  </div>
                  <div className="mb-3 text-sm font-bold" style={{ color: 'var(--primary)' }}>{step.num}</div>
                  <h3 className="mb-2 text-lg font-extrabold" style={{ color: '#111827' }}>{step.title}</h3>
                  <p className="text-sm leading-7" style={{ color: '#6B7280' }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-6 py-20 lg:px-12" style={{ background: 'white' }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-5" style={{ background: '#F0FDF4', color: 'var(--primary)' }}>المميزات</div>
              <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: '#111827' }}>كل ما تحتاجه في مكان واحد</h2>
              <p className="mx-auto mt-3 max-w-2xl text-lg" style={{ color: '#6B7280' }}>من تجربة التصميم إلى النشر، كل شيء مصمم ليكون بسيطاً وقوياً</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-xl p-7 transition-all" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                  <div className="mb-4 h-12 w-12 rounded-xl flex items-center justify-center text-xl" style={{ background: '#F0FDF4' }}>{feature.icon}</div>
                  <h3 className="mb-2 text-lg font-extrabold" style={{ color: '#111827' }}>{feature.title}</h3>
                  <p className="text-sm leading-7" style={{ color: '#6B7280' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Templates */}
        <section className="px-6 py-20 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-5" style={{ background: '#F0FDF4', color: 'var(--primary)' }}>القوالب</div>
              <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: '#111827' }}>قوالب احترافية مصممة لتناسب مختلف القطاعات</h2>
              <p className="mx-auto mt-3 max-w-2xl text-lg" style={{ color: '#6B7280' }}>اختر من بين عشرات القوالب الجاهزة وابدأ في تعديلها حسب احتياجك</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((t, i) => (
                <Link key={i} href="/register" className="rounded-xl overflow-hidden transition-all" style={{ background: 'white', border: '1px solid #E5E7EB' }}>
                  <div className="h-44 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${t.color} 0%, ${t.color}dd 100%)` }}>
                    <span className="text-white/20 text-6xl font-bold">{t.name[0]}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-[14px] font-bold" style={{ color: '#111827' }}>{t.name}</h3>
                    <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{t.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 lg:px-12">
          <div className="mx-auto max-w-6xl rounded-2xl p-10 sm:p-14 text-white" style={{ background: 'linear-gradient(135deg, #1B6B4A 0%, #22C55E 100%)', boxShadow: '0 4px 20px rgba(27,107,74,0.2)' }}>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-extrabold sm:text-4xl">حوّل فكرتك إلى صفحة جاهزة خلال دقائق</h2>
                <p className="mt-4 text-lg" style={{ color: 'rgba(255,255,255,0.85)' }}>انضم لعشرات الآلاف من المستخدمين وابدأ ببناء مشروعك الآن مجاناً.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/register" className="rounded-xl px-7 py-3.5 text-lg font-bold transition" style={{ background: 'white', color: 'var(--primary)' }}>إنشاء حساب مجاني</Link>
                <Link href="/pricing" className="rounded-xl border px-7 py-3.5 text-lg font-bold transition" style={{ borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white' }}>عرض الأسعار</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-16 lg:px-12" style={{ background: '#111827', color: 'white' }}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-10 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-extrabold text-white" style={{ background: 'var(--primary)' }}>B</div>
                <span className="text-xl font-extrabold">Buildora</span>
              </div>
              <p className="max-w-sm text-sm leading-7" style={{ color: '#9CA3AF' }}>منصة بسيطة ومؤثرة لبناء الصفحات والمنتجات الرقمية في دقائق.</p>
            </div>
            <div>
              <h3 className="mb-4 font-bold">المنتج</h3>
              <div className="space-y-3 text-sm" style={{ color: '#9CA3AF' }}>
                <Link href="/pricing" className="block transition hover:text-white">الأسعار</Link>
                <a href="#features" className="block transition hover:text-white">المميزات</a>
                <a href="#how" className="block transition hover:text-white">كيف تعمل</a>
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-bold">الدعم</h3>
              <div className="space-y-3 text-sm" style={{ color: '#9CA3AF' }}>
                <a href="#" className="block transition hover:text-white">تواصل معنا</a>
                <a href="#" className="block transition hover:text-white">الشروط</a>
                <a href="#" className="block transition hover:text-white">الخصوصية</a>
              </div>
            </div>
          </div>
          <div className="pt-6 text-center text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: '#6B7280' }}>
            © 2026 Buildora. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
}
