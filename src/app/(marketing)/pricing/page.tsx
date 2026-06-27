import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الأسعار - Buildora | خطط تناسب الجميع',
  description: 'اختر الخطة المناسبة لاحتياجاتك. ابدأ مجاناً مع 3 صفحات или ا升级 للخطة الاحترافية.',
  openGraph: { title: 'الأسعار - Buildora', description: 'خطط أسعار تناسب الجميع' },
};

const plans = [
  {
    name: 'مجاني', price: '0', period: 'مجاناً للأبد', icon: '🆓',
    features: [
      { text: '3 صفحات', included: true },
      { text: '100MB تخزين', included: true },
      { text: 'دومين buildora.vexonet.online', included: true },
      { text: 'SSL أساسي', included: true },
      { text: '25+ عنصر جاهز', included: true },
      { text: 'دعم مجتمعي', included: true },
      { text: 'دومين مخصص', included: false },
      { text: 'SEO متقدم', included: false },
      { text: 'إحصائيات', included: false },
    ],
    cta: 'ابدأ مجاناً', featured: false, color: '#64748b'
  },
  {
    name: 'احترافي', price: '19', period: '$19/شهر', icon: '⭐',
    features: [
      { text: 'صفحات غير محدودة', included: true },
      { text: '5GB تخزين', included: true },
      { text: 'دومين مخصص', included: true },
      { text: 'SSL مجاني', included: true },
      { text: 'كل العناصر والقوالب', included: true },
      { text: 'SEO متقدم', included: true },
      { text: 'إحصائيات مفصلة', included: true },
      { text: 'بدون علامة Buildora', included: true },
      { text: 'دعم أولوي 24/7', included: true },
    ],
    cta: 'اشترك الآن', featured: true, color: '#6c63ff'
  },
  {
    name: 'مؤسسات', price: '49', period: '$49/شهر', icon: '🏢',
    features: [
      { text: 'كل مميزات الاحترافي', included: true },
      { text: '50GB تخزين', included: true },
      { text: 'عدة دومينات', included: true },
      { text: 'API كامل', included: true },
      { text: 'تخصيص CSS/JS كامل', included: true },
      { text: 'SLA 99.9%', included: true },
      { text: 'مدير حساب مخصص', included: true },
      { text: 'تدريب وتثبيت', included: true },
      { text: 'دعم هاتفي', included: true },
    ],
    cta: 'تواصل معنا', featured: false, color: '#059669'
  },
];

const faqs = [
  { q: 'هل يمكنني الترقية من مجاني لاحترافي؟', a: 'نعم يمكنك الترقية في أي وقت من لوحة التحكم. سيتم احتساب السعر المتبقي.' },
  { q: 'هل يمكنني إلغاء الاشتراك؟', a: 'نعم يمكنك الإلغاء في أي وقت. سيبقى حسابك نشطاً حتى نهاية فترة الفوترة.' },
  { q: 'هل تقبلون طرق الدفع المختلفة؟', a: 'نعم نقبل بطاقات الائتمان والتحويل البنكي وPayPal.' },
  { q: 'هل يوجد خصم للسنوي؟', a: 'نعم توفر خصم 20% عند الاشتراك السنوي.' },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 lg:px-12 py-4 border-b border-gray-100 bg-white/95 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-[#6c63ff] to-[#e91e63] rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-[#6c63ff]/25">B</div>
          <span className="text-xl font-extrabold text-[#1a1a2e]">Buildora</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-gray-600 hover:text-[#6c63ff] transition">الرئيسية</Link>
          <Link href="/login" className="text-gray-600 hover:text-[#6c63ff] transition">دخول</Link>
          <Link href="/register" className="px-5 py-2.5 bg-[#6c63ff] text-white rounded-xl font-bold hover:bg-[#5b52e0] transition shadow-lg shadow-[#6c63ff]/20">ابدأ مجاناً</Link>
        </div>
      </nav>

      {/* HERO */}
      <div className="bg-gradient-to-br from-[#6c63ff] to-[#e91e63] text-white py-20 text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-10 right-20 w-60 h-60 border border-white rounded-full" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-bold mb-6">💰 خطط الأسعار</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">خطط تناسب الجميع</h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto">ابدأ مجاناً و upgrade حسب احتياجك. لا توجد رسوم خفية.</p>
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((p, i) => (
            <div key={i} className={`rounded-2xl p-8 border-2 transition-all hover:-translate-y-2 ${p.featured ? 'border-[#6c63ff] shadow-xl relative bg-white' : 'border-gray-100 bg-white hover:shadow-lg'}`}>
              {p.featured && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6c63ff] to-[#e91e63] text-white px-6 py-2 rounded-full text-xs font-bold shadow-lg">⭐ الأكثر شيوعاً</div>}
              <div className="text-center pt-2">
                <div className="text-4xl mb-3">{p.icon}</div>
                <h3 className="text-xl font-extrabold text-[#1a1a2e] mb-2">{p.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="text-5xl font-extrabold" style={{color: p.color}}>${p.price}</span>
                  {p.price !== '0' && <span className="text-gray-400 text-sm">/شهر</span>}
                </div>
                <p className="text-sm text-gray-400 mb-8">{p.period}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map((f, j) => (
                  <li key={j} className={`flex items-center gap-3 text-sm ${f.included ? 'text-gray-700' : 'text-gray-300'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${f.included ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-300'}`}>
                      {f.included ? '✓' : '✕'}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>
              <Link href="/register" className={`block py-3.5 rounded-xl font-bold text-sm text-center transition ${p.featured ? 'bg-[#6c63ff] text-white hover:bg-[#5b52e0] shadow-lg shadow-[#6c63ff]/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#1a1a2e] mb-4">أسئلة متكررة عن الأسعار</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden group">
                <summary className="px-6 py-4 cursor-pointer font-bold text-[#1a1a2e] hover:text-[#6c63ff] transition flex items-center justify-between">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-180 transition">▾</span>
                </summary>
                <div className="px-6 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#6c63ff] to-[#e91e63] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-4">جاهز تبدأ؟</h2>
          <p className="text-lg opacity-90 mb-8">سجّل الآن وابدأ مجاناً بدون بطاقة ائتمان</p>
          <Link href="/register" className="inline-block bg-white text-[#6c63ff] px-10 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition shadow-xl">ابدأ مجاناً ←</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1a1a2e] text-gray-400 py-8 text-center text-sm">
        © 2026 Buildora. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}
