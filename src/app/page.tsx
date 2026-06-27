import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--gray-100)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center shadow-md shadow-[var(--primary)]/20">
              <span className="text-white font-extrabold text-sm">B</span>
            </div>
            <span className="text-xl font-extrabold text-[var(--gray-900)]">Buildora</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <a href="#features" className="px-4 py-2 text-sm text-[var(--gray-600)] hover:text-[var(--primary)] transition font-medium rounded-xl hover:bg-[var(--primary-bg)]">المميزات</a>
            <a href="#how" className="px-4 py-2 text-sm text-[var(--gray-600)] hover:text-[var(--primary)] transition font-medium rounded-xl hover:bg-[var(--primary-bg)]">كيف تعمل</a>
            <Link href="/pricing" className="px-4 py-2 text-sm text-[var(--gray-600)] hover:text-[var(--primary)] transition font-medium rounded-xl hover:bg-[var(--primary-bg)]">الأسعار</Link>
            <div className="w-px h-5 bg-[var(--gray-200)] mx-2" />
            <Link href="/login" className="px-4 py-2 text-sm text-[var(--gray-700)] hover:text-[var(--primary)] transition font-semibold">دخول</Link>
            <Link href="/register" className="ml-2 px-6 py-2.5 bg-[var(--primary)] text-white text-sm rounded-xl font-bold hover:bg-[var(--primary-dark)] transition-all shadow-md shadow-[var(--primary)]/25 hover:shadow-lg hover:shadow-[var(--primary)]/30 hover:-translate-y-0.5">ابدأ مجاناً</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6 lg:px-12 bg-[var(--gray-50)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-[var(--primary-bg)] text-[var(--primary)] px-4 py-2 rounded-full text-xs font-bold mb-6">
                <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse" />
                منصة بناء صفحات #1 في المنطقة العربية
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-[3.5rem] leading-[1.15] font-extrabold text-[var(--gray-900)] mb-6">
                أي موقع لمشروعك
                <br />
                <span className="gradient-text">في ثوانٍ</span> فقط
              </h1>
              <p className="text-lg text-[var(--gray-500)] mb-8 leading-relaxed max-w-lg">
                صمّم صفحة ويب احترافية بدون أي خبرة برمجية. اسحب وأفلت العناصر، خصّص التصميم، وانشر صفحتك مباشرة.
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Link href="/register" className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[var(--primary-dark)] transition-all shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/35 hover:-translate-y-0.5">
                  ابدأ مجاناً الآن
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </Link>
                <Link href="#how" className="inline-flex items-center gap-2 border-2 border-[var(--gray-200)] text-[var(--gray-600)] px-8 py-4 rounded-xl font-bold hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all">
                  شاهد كيف تعمل
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-[var(--gray-500)]">
                {['مجاني للبدء', 'بدون بطاقة ائتمان', 'إلغاء في أي وقت'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-[480px] h-[380px] bg-gradient-to-br from-[var(--gray-100)] to-[var(--gray-200)] rounded-3xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5" />
                  <svg className="w-48 h-48 text-[var(--primary)]/30 animate-float" fill="currentColor" viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v14l-8-4-8 4V5z" /></svg>
                  <div className="absolute top-8 right-8 w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center animate-float" style={{animationDelay: '0.5s'}}>
                    <svg className="w-10 h-10 text-[var(--primary)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
                  </div>
                  <div className="absolute bottom-12 left-8 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center animate-float" style={{animationDelay: '1s'}}>
                    <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                  </div>
                  <div className="absolute top-1/2 left-12 w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center animate-float" style={{animationDelay: '1.5s'}}>
                    <svg className="w-7 h-7 text-[var(--success)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-[var(--gray-100)] bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-center text-sm font-bold text-[var(--gray-400)] mb-10">أرقام تتحدث عن نجاحنا</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '10,000+', label: 'مستخدم نشط' },
              { value: '99.9%', label: 'وقت التشغيل' },
              { value: '4.9/5', label: 'تقييم المستخدمين' },
              { value: '24/7', label: 'دعم فني متواصل' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl lg:text-4xl font-extrabold gradient-text mb-2">{s.value}</div>
                <div className="text-sm text-[var(--gray-500)] font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-[var(--primary-bg)] text-[var(--primary)] px-4 py-2 rounded-full text-xs font-bold mb-5">كيف تعمل</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[var(--gray-900)] mb-4">كيف تنشئ موقعك بسهولة</h2>
            <p className="text-[var(--gray-500)] text-lg">4 خطوات بسيطة لصفحتك الاحترافية</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'سجّل حسابك', desc: 'أنشئ حسابك المجاني في أقل من 30 ثانية', color: 'var(--primary)', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg> },
              { num: '02', title: 'اختر قالبك', desc: 'اختر من بين عشرات القوالب الجاهزة', color: 'var(--accent)', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88" /></svg> },
              { num: '03', title: 'اسحب وصمم', desc: 'اسحب العناصر وعدّل النصوص والألوان', color: 'var(--success)', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" /></svg> },
              { num: '04', title: 'انشر وشارك', desc: 'اضغط نشر وشارك صفحتك مع العالم', color: 'var(--warning)', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg> },
            ].map((s, i) => (
              <div key={i} className="relative bg-[var(--gray-50)] rounded-2xl p-7 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-[var(--gray-100)]">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{background: `${s.color}15`, color: s.color}}>
                  {s.icon}
                </div>
                <div className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center absolute -top-3 left-1/2 -translate-x-1/2" style={{background: s.color}}>{s.num}</div>
                <h3 className="text-base font-bold text-[var(--gray-900)] mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--gray-500)] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 lg:px-12 bg-[var(--gray-50)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-[var(--primary-bg)] text-[var(--primary)] px-4 py-2 rounded-full text-xs font-bold mb-5">المميزات</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[var(--gray-900)] mb-4">ليه تختار Buildora؟</h2>
            <p className="text-[var(--gray-500)] text-lg max-w-2xl mx-auto">كل الأدوات اللي تحتاجها لبناء صفحة ويب احترافية بدون تعقيد</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'تصميم احترافي', desc: 'أكثر من 25 عنصر جاهز بتصاميم حديثة بدون أي برمجة', color: 'var(--primary)', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg> },
              { title: 'سريع وفوري', desc: 'انشر صفحتك في ثوانٍ مع أداء عالي وسرعة تحميل مذهلة', color: 'var(--accent)', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg> },
              { title: 'متجاوب مع الأجهزة', desc: 'صفحتك تعمل بشكل مثالي على الجوال والتابلت والحاسوب', color: 'var(--success)', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" /></svg> },
              { title: 'SEO متقدم', desc: 'إعدادات SEO متكاملة لظهور صفحتك في محركات البحث', color: 'var(--primary)', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg> },
              { title: 'دومين خاص بيك', desc: 'احصل على subdomain مجاني مثل اسمك.buildora.vexonet.online', color: 'var(--warning)', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg> },
              { title: 'إحصائيات حية', desc: 'تتبع زوار صفحتك وشاهد تحليلات مفصلة في الوقت الحقيقي', color: 'var(--danger)', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg> },
            ].map((f, i) => (
              <div key={i} className="group bg-white rounded-2xl p-7 border border-[var(--gray-100)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110" style={{background: `${f.color}12`, color: f.color}}>{f.icon}</div>
                <h3 className="text-base font-bold text-[var(--gray-900)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--gray-500)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-[var(--primary-bg)] text-[var(--primary)] px-4 py-2 rounded-full text-xs font-bold mb-5">آراء عملائنا</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[var(--gray-900)] mb-4">ماذا يقول مستخدمونا؟</h2>
            <p className="text-[var(--gray-500)] text-lg">آلاف المستخدمين يثقون بـ Buildora</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: 'أفضل منصة بناء صفحات استخدمتها. التصميم الاحترافي والسهولة خلتني أبني صفحتي في ساعة!', author: 'أحمد محمد', role: 'رائد أعمال', color: 'var(--primary)' },
              { text: 'بفضل Buildora قدرت أعمل صفحة احترافية لمشروعي بدون ما أدفع لحد. النتائج كانت مبهرة!', author: 'سارة علي', role: 'مديرة تسويق', color: 'var(--accent)' },
              { text: 'الدعم الفني ممتاز والتحديثات مستمرة. منصة تستاهل كل دعم. أنصح الجميع يستخدمها!', author: 'خالد حسن', role: 'مطور مواقع', color: 'var(--success)' },
            ].map((t, i) => (
              <div key={i} className="bg-[var(--gray-50)] rounded-2xl p-7 border border-[var(--gray-100)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex gap-1 mb-4">{[1,2,3,4,5].map(j => <svg key={j} className="w-5 h-5 text-[var(--warning)]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                <p className="text-sm text-[var(--gray-600)] leading-relaxed mb-6">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3 border-t border-[var(--gray-200)] pt-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{background: t.color}}>{t.author[0]}</div>
                  <div><div className="text-sm font-bold text-[var(--gray-900)]">{t.author}</div><div className="text-xs text-[var(--gray-400)]">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 lg:px-12 bg-[var(--gray-50)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-[var(--primary-bg)] text-[var(--primary)] px-4 py-2 rounded-full text-xs font-bold mb-5">الأسعار</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[var(--gray-900)] mb-4">خطط أسعارنا</h2>
            <p className="text-[var(--gray-500)] text-lg">اختر الخطة المناسبة لاحتياجاتك</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'مجاني', price: '$0', period: '/شهر', features: ['3 صفحات', 'دومين مجاني', '500MB مساحة', 'دعم أساسي'], featured: false, color: 'var(--gray-500)' },
              { name: 'احترافي', price: '$29', period: '/شهر', features: ['صفحات غير محدودة', 'دومين خاص', '10GB مساحة', 'دعم أولوي', 'تحليلات متقدمة', 'إزالة العلامة التجارية'], featured: true, color: 'var(--primary)' },
              { name: 'مؤسسي', price: '$99', period: '/شهر', features: ['كل مميزات الاحترافي', 'SSL مخصص', '50GB مساحة', 'دعم 24/7', 'API متقدم', 'حسابات فريق'], featured: false, color: 'var(--accent)' },
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl p-8 border-2 transition-all duration-300 hover:-translate-y-1 ${plan.featured ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xl shadow-[var(--primary)]/20 scale-105' : 'bg-white border-[var(--gray-100)] hover:border-[var(--primary)]/30 hover:shadow-lg'}`}>
                <div className={`text-sm font-bold mb-2 ${plan.featured ? 'text-white/70' : 'text-[var(--gray-400)]'}`}>{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className={`text-sm ${plan.featured ? 'text-white/60' : 'text-[var(--gray-400)]'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <svg className={`w-5 h-5 flex-shrink-0 ${plan.featured ? 'text-white/80' : 'text-[var(--success)]'}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      <span className={plan.featured ? 'text-white/90' : 'text-[var(--gray-600)]'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`block text-center py-3.5 rounded-xl font-bold transition-all ${plan.featured ? 'bg-white text-[var(--primary)] hover:bg-gray-100 shadow-lg' : 'bg-[var(--gray-900)] text-white hover:bg-[var(--gray-800)]'}`}>ابدأ الآن</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] via-[var(--primary-dark)] to-[#4338ca]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-white rounded-full" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl lg:text-5xl font-extrabold mb-5">ابدأ مجاناً اليوم</h2>
          <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto">انضم لأكثر من 10,000 مستخدم وابدأ ببناء صفحتك الاحترافية الآن مجاناً</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-[var(--primary)] px-10 py-4 rounded-xl font-bold hover:bg-gray-50 transition shadow-xl text-lg hover:-translate-y-0.5">
            إنشاء حساب مجاني
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </Link>
          <p className="text-sm opacity-70 mt-6">لا حاجة لبطاقة ائتمان · إلغاء في أي وقت</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[var(--gray-900)] text-white py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center"><span className="text-white font-extrabold text-sm">B</span></div>
                <span className="text-xl font-extrabold">Buildora</span>
              </div>
              <p className="text-sm text-[var(--gray-400)] leading-relaxed">منصة بناء صفحات الويب الأسهل في المنطقة العربية.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm">المنتج</h4>
              <div className="space-y-3 text-sm text-[var(--gray-400)]">
                <Link href="/pricing" className="block hover:text-white transition">الأسعار</Link>
                <a href="#features" className="block hover:text-white transition">المميزات</a>
                <a href="#how" className="block hover:text-white transition">كيف تعمل</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm">الدعم</h4>
              <div className="space-y-3 text-sm text-[var(--gray-400)]">
                <a href="#" className="block hover:text-white transition">تواصل معنا</a>
                <a href="#" className="block hover:text-white transition">الشروط والأحكام</a>
                <a href="#" className="block hover:text-white transition">سياسة الخصوصية</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm">تابعنا</h4>
              <div className="flex gap-3">
                {[
                  <svg key="x" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
                  <svg key="ig" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z" clipRule="evenodd" /></svg>,
                  <svg key="yt" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>,
                ].map((icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[var(--primary)] transition-all hover:-translate-y-0.5">{icon}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--gray-500)]">© 2026 Buildora. جميع الحقوق محفوظة.</p>
            <p className="text-xs text-[var(--gray-600)]">صُنع بـ ❤️ في المنطقة العربية</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
