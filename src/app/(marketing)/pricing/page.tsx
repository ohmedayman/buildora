import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الأسعار - Buildora | خطط تناسب الجميع',
  description: 'اختر الخطة المناسبة لاحتياجاتك. ابدأ مجاناً مع 3 صفحات أو ارفع الخطة للاحترافية.',
  openGraph: { title: 'الأسعار - Buildora', description: 'خطط أسعار تناسب الجميع' },
};

const plans = [
  {
    name: 'مجاني', price: '0', period: 'مجاناً للأبد', icon: '🆓',
    features: ['3 صفحات', '100MB تخزين', 'دومين Buildora مجاني', 'SSL أساسي', '25+ عنصر جاهز', 'دعم مجتمعي'],
    cta: 'ابدأ مجاناً', featured: false,
  },
  {
    name: 'احترافي', price: '19', period: '$19/شهر', icon: '⭐',
    features: ['صفحات غير محدودة', '5GB تخزين', 'دومين مخصص', 'SSL مجاني', 'كل القوالب والعناصر', 'SEO متقدم', 'إحصائيات مفصلة', 'دعم أولوي 24/7'],
    cta: 'اشترك الآن', featured: true,
  },
  {
    name: 'مؤسسات', price: '49', period: '$49/شهر', icon: '🏢',
    features: ['كل مميزات الاحترافي', '50GB تخزين', 'عدة دومينات', 'API كامل', 'تخصيص CSS/JS كامل', 'SLA 99.9%', 'مدير حساب مخصص', 'دعم هاتفي'],
    cta: 'تواصل معنا', featured: false,
  },
];

const faqs = [
  { q: 'هل يمكنني الترقية من مجاني لاحترافي؟', a: 'نعم، يمكنك الترقية في أي وقت من لوحة التحكم وستتغير الخطة فوراً.' },
  { q: 'هل يمكنني إلغاء الاشتراك؟', a: 'نعم، يمكنك الإلغاء في أي وقت وسيبقى الحساب نشطاً حتى نهاية فترة الفوترة.' },
  { q: 'هل تقبلون طرق الدفع المختلفة؟', a: 'نعم، نقبل بطاقات الائتمان والتحويل البنكي وPayPal.' },
  { q: 'هل يوجد خصم للسنوي؟', a: 'نعم، نوفر خصم 20% عند الاشتراك السنوي.' },
];

export default function PricingPage() {
  return (
    <div className='min-h-screen bg-slate-50 text-slate-900' style={{ fontFamily: "'Cairo', sans-serif" }} dir='rtl'>
      <nav className='sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl'>
        <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12'>
          <Link href='/' className='flex items-center gap-2.5'>
            <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-sm font-extrabold text-white shadow-lg shadow-[var(--primary)]/25'>B</div>
            <span className='text-xl font-extrabold text-slate-900'>Buildora</span>
          </Link>
          <div className='flex items-center gap-4 text-sm'>
            <Link href='/' className='text-slate-600 transition hover:text-[var(--primary)]'>الرئيسية</Link>
            <Link href='/login' className='text-slate-600 transition hover:text-[var(--primary)]'>دخول</Link>
            <Link href='/register' className='rounded-2xl bg-[var(--primary)] px-5 py-2.5 font-bold text-white shadow-lg shadow-[var(--primary)]/20 transition hover:bg-[var(--primary-dark)]'>ابدأ مجاناً</Link>
          </div>
        </div>
      </nav>

      <section className='px-6 py-20 text-center text-white lg:px-12'>
        <div className='mx-auto max-w-6xl rounded-[32px] bg-gradient-to-br from-[var(--primary)] via-[#5b52e0] to-cyan-500 p-10 shadow-2xl shadow-[var(--primary)]/20 sm:p-14'>
          <div className='mx-auto inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur'>💰 خطط الأسعار</div>
          <h1 className='mt-6 text-4xl font-extrabold sm:text-5xl'>اختر الخطة التي تناسبك</h1>
          <p className='mx-auto mt-4 max-w-2xl text-lg text-white/85'>ابدأ مجاناً ثم ارتقِ عندما تصبح احتياجاتك أكبر. لا توجد رسوم خفية أو تعقيدات.</p>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-6 py-16 lg:px-12'>
        <div className='grid gap-8 md:grid-cols-3'>
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-[28px] border p-8 shadow-sm transition hover:-translate-y-1 ${plan.featured ? 'border-[var(--primary)] bg-white shadow-xl shadow-[var(--primary)]/10' : 'border-slate-200 bg-white'}`}>
              {plan.featured && <div className='mb-6 inline-flex rounded-full bg-[var(--primary-bg)] px-3 py-1 text-sm font-bold text-[var(--primary)]'>الأكثر شيوعاً</div>}
              <div className='mb-5 text-4xl'>{plan.icon}</div>
              <h3 className='text-xl font-extrabold text-slate-900'>{plan.name}</h3>
              <div className='mt-4 flex items-baseline gap-1'>
                <span className='text-5xl font-extrabold text-slate-900'>${plan.price}</span>
                {plan.price !== '0' && <span className='text-sm text-slate-400'>/شهر</span>}
              </div>
              <p className='mt-2 text-sm text-slate-500'>{plan.period}</p>
              <ul className='mt-8 space-y-3 text-sm text-slate-600'>
                {plan.features.map((feature) => (
                  <li key={feature} className='flex items-center gap-3'>
                    <span className='flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600'>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href='/register' className={`mt-8 block rounded-2xl py-3.5 text-center text-sm font-bold transition ${plan.featured ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className='bg-white px-6 py-20 lg:px-12'>
        <div className='mx-auto max-w-3xl'>
          <div className='mb-10 text-center'>
            <h2 className='text-3xl font-extrabold text-slate-900'>أسئلة متكررة</h2>
          </div>
          <div className='space-y-3'>
            {faqs.map((faq) => (
              <details key={faq.q} className='overflow-hidden rounded-2xl border border-slate-200 bg-slate-50'>
                <summary className='flex cursor-pointer items-center justify-between px-6 py-4 font-bold text-slate-800'>{faq.q}<span className='text-slate-400'>▾</span></summary>
                <div className='px-6 pb-4 text-sm leading-7 text-slate-600'>{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 py-20 lg:px-12'>
        <div className='mx-auto max-w-4xl rounded-[32px] bg-gradient-to-br from-slate-900 to-slate-700 p-10 text-center text-white shadow-2xl'>
          <h2 className='text-3xl font-extrabold'>جاهز تبدأ؟</h2>
          <p className='mx-auto mt-4 max-w-2xl text-lg text-slate-300'>سجّل الآن وابدأ مجاناً بدون بطاقة ائتمان.</p>
          <Link href='/register' className='mt-8 inline-block rounded-2xl bg-white px-8 py-3.5 text-lg font-bold text-slate-900 transition hover:bg-slate-100'>ابدأ مجاناً</Link>
        </div>
      </section>

      <footer className='bg-slate-900 px-6 py-8 text-center text-sm text-slate-500'>
        © 2026 Buildora. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}
