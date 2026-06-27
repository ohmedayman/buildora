import { NextResponse } from 'next/server';

function t(id: string, name: string, nameEn: string, thumbnail: string, category: string, description: string, content: any[]) {
  return { id, name, nameEn, thumbnail, category, description, content: JSON.stringify(content) };
}

const templates = [
  t('portfolio', 'الملف الشخصي', 'Portfolio', '🎨', 'شخصي', 'اعرض أعمالك ومهاراتك', [
    { id: 't1', type: 'hero', content: { title: 'مرحباً، أنا [اسمك]', subtitle: 'مصمم | مطور | مبدع', buttonText: 'شاهد أعمالي', bgColor: '#2563eb', bgGradient: 'linear-gradient(135deg,#2563ff,#7c3aed)' } },
    { id: 't2', type: 'stats', content: { items: [{ value: '+50', label: 'مشروع' }, { value: '+30', label: 'عميل' }, { value: '+5', label: 'سنوات' }, { value: '100%', label: 'رضا' }] } },
    { id: 't3', type: 'features-grid', content: { title: 'مهاراتي', subtitle: 'خبرات تميزني', items: [{ icon: '🎨', title: 'UI/UX', desc: 'تصاميم عصرية' }, { icon: '💻', title: 'تطوير', desc: 'React, Next.js' }, { icon: '📱', title: 'موبايل', desc: 'متجاوب' }] } },
    { id: 't4', type: 'testimonial', content: { text: 'مصمم موهوب ومحترف', author: 'عميل', role: 'مدير', avatar: '👨‍💼' } },
    { id: 't5', type: 'cta', content: { title: 'هل لديك مشروع؟', subtitle: 'دعنا نتحدث', buttonText: 'تواصل معي', bgColor: '#6c63ff' } },
    { id: 't6', type: 'footer', content: { text: '© 2026 Buildora', links: [] } },
  ]),
  t('saas', 'صفحة SaaS', 'SaaS', '🚀', 'تقنية', 'للبرامج كخدمة', [
    { id: 't1', type: 'hero', content: { title: 'أتمتة أعمالك بالذكاء الاصطناعي', subtitle: 'منصة ذكية توفر 80% من الوقت', buttonText: 'ابدأ مجاناً', bgColor: '#4f46e5', bgGradient: 'linear-gradient(135deg,#4f46e5,#7c3aed)', badge: '⚡ أداء فائق' } },
    { id: 't2', type: 'logo-cloud', content: { title: 'موثوق من 500+ شركة', logos: ['🏢', '🏦', '🏛️', '🏥', '🎓', '🏭'] } },
    { id: 't3', type: 'features-grid', content: { title: 'لماذا تختارنا؟', subtitle: 'حلول متكاملة', items: [{ icon: '🤖', title: 'AI', desc: 'تحليلات ذكية' }, { icon: '⚡', title: 'سرعة', desc: 'أداء فائق' }, { icon: '🔒', title: 'أمان', desc: 'حماية عالية' }, { icon: '📊', title: 'تحليلات', desc: 'تقارير مفصلة' }, { icon: '🔌', title: 'تكامل', desc: 'دمج سهل' }, { icon: '🌍', title: 'دعم', desc: 'متعدد اللغات' }] } },
    { id: 't4', type: 'stats', content: { items: [{ value: '500+', label: 'شركة' }, { value: '99.9%', label: 'تشغيل' }, { value: '10M+', label: 'عملية' }, { value: '4.9/5', label: 'تقييم' }] } },
    { id: 't5', type: 'pricing-table', content: { title: 'خطط الأسعار', subtitle: 'اختر الخطة', plans: [{ name: 'Starter', price: '0', featured: false, features: ['1000 عملية', 'دعم بريد'], cta: 'ابدأ مجاناً' }, { name: 'Pro', price: '49', featured: true, features: ['50K عملية', 'دعم أولوي', 'API'], cta: 'اشترك الآن' }, { name: 'Enterprise', price: '199', featured: false, features: ['غير محدود', 'مدير حساب', 'SLA'], cta: 'تواصل معنا' }] } },
    { id: 't6', type: 'testimonials', content: { title: 'آراء العملاء', items: [{ text: 'غيرت طريقة عملنا', author: 'أحمد', role: 'CTO', avatar: '👨‍💼' }, { text: 'دعم فني ممتاز', author: 'سارة', role: 'مديرة', avatar: '👩‍💼' }] } },
    { id: 't7', type: 'cta', content: { title: 'جاهز لأتمتة أعمالك؟', subtitle: 'ابدأ مجاناً', buttonText: 'ابدأ الآن', bgColor: '#4f46e5' } },
    { id: 't8', type: 'footer', content: { text: '© 2026 Buildora', links: [{ text: 'الخصوصية', url: '#' }, { text: 'تواصل', url: '#' }] } },
  ]),
  t('restaurant', 'مطعم وكافيه', 'Restaurant', '🍕', 'مطاعم', 'للمطاعم والكافيهات', [
    { id: 't1', type: 'hero', content: { title: 'مرحباً بكم في مطعمنا', subtitle: 'أشهى الأطباق والمأكولات', buttonText: 'اطلب الآن', bgColor: '#dc2626', bgGradient: 'linear-gradient(135deg,#dc2626,#ea580c)', badge: '🍕 توصيل مجاني' } },
    { id: 't2', type: 'features-grid', content: { title: 'قائمتنا المميزة', subtitle: 'أشهى الأطباق', items: [{ icon: '🍔', title: 'برجر', desc: 'لحم طازج' }, { icon: '🍕', title: 'بيتزا', desc: 'إيطالية' }, { icon: '🥗', title: 'سلط', desc: 'طازجة' }, { icon: '🍝', title: 'معكرونة', desc: 'عالمية' }, { icon: '🍰', title: 'حلويات', desc: 'شرقية وغربية' }, { icon: '☕', title: 'مشروبات', desc: 'قهوة مختصة' }] } },
    { id: 't3', type: 'counter', content: { items: [{ value: '+500', label: 'عميل يومياً' }, { value: '4.8', label: 'تقييم' }, { value: '+20', label: 'طبق' }, { value: '15+', label: 'سنة' }] } },
    { id: 't4', type: 'testimonials', content: { title: 'ماذا يقول عملاؤنا', items: [{ text: 'أفضل مطعم!', author: 'محمد', role: 'عميل', avatar: '👨‍💼' }] } },
    { id: 't5', type: 'cta', content: { title: 'هل أنت جائع؟', subtitle: 'اطلب الآن', buttonText: 'اطلب', bgColor: '#dc2626' } },
    { id: 't6', type: 'footer', content: { text: '© 2026 مطعمنا', links: [{ text: 'Instagram', url: '#' }] } },
  ]),
  t('ecommerce', 'المتجر الإلكتروني', 'E-Commerce', '🛒', 'تجارة', 'للمتاجر الإلكترونية', [
    { id: 't1', type: 'hero', content: { title: 'تسوّق أحدث المنتجات', subtitle: 'أسعار مميزة وشحن مجاني', buttonText: 'تسوّق الآن', bgColor: '#ea580c', bgGradient: 'linear-gradient(135deg,#ea580c,#dc2626)', badge: '🔥 خصم 20%' } },
    { id: 't2', type: 'features-grid', content: { title: 'لماذا تتسوق من عندنا؟', subtitle: 'تجربة تسوّق مميزة', items: [{ icon: '🚚', title: 'شحن مجاني', desc: 'للطلبات فوق $50' }, { icon: '🔄', title: 'إرجاع', desc: 'خلال 30 يوم' }, { icon: '💳', title: 'دفع آمن', desc: 'جميع الوسائل' }, { icon: '⭐', title: 'أصلي', desc: '100%' }, { icon: '🎁', title: 'هدايا', desc: 'مع كل طلب' }, { icon: '📱', title: 'تطبيق', desc: 'تسوّق من هاتفك' }] } },
    { id: 't3', type: 'stats', content: { items: [{ value: '+10K', label: 'منتج' }, { value: '+50K', label: 'عميل' }, { value: '4.9', label: 'تقييم' }, { value: '24/7', label: 'دعم' }] } },
    { id: 't4', type: 'cta', content: { title: 'خصم 20% على أول طلب', subtitle: 'استخدم الكود FIRST20', buttonText: 'تسوّق', bgColor: '#ea580c' } },
    { id: 't5', type: 'footer', content: { text: '© 2026 متجرنا', links: [{ text: 'الخصوصية', url: '#' }] } },
  ]),
  t('education', 'التعليم والتدريب', 'Education', '🎓', 'تعليم', 'للأكاديميات ومقدمي الدورات', [
    { id: 't1', type: 'hero', content: { title: 'استثمر في مستقبلك', subtitle: 'دورات تدريبية مع شهادات معتمدة', buttonText: 'تصفح الدورات', bgColor: '#059669', bgGradient: 'linear-gradient(135deg,#059669,#10b981)', badge: '🎓 شهادات معتمدة' } },
    { id: 't2', type: 'features-grid', content: { title: 'ماذا نقدم؟', subtitle: 'حلول تعليمية', items: [{ icon: '📚', title: 'دورات', desc: '+100 دورة' }, { icon: '👨‍🏫', title: 'مدربون', desc: 'خبراء' }, { icon: '🎓', title: 'شهادات', desc: 'معتمدة' }, { icon: '📱', title: 'أونلاين', desc: 'تعلم من أي مكان' }, { icon: '💬', title: 'دعم', desc: 'فوري' }, { icon: '💰', title: 'أسعار', desc: 'منافسة' }] } },
    { id: 't3', type: 'counter', content: { items: [{ value: '+5K', label: 'طالب' }, { value: '+100', label: 'دورة' }, { value: '+50', label: 'مدرب' }, { value: '95%', label: 'رضا' }] } },
    { id: 't4', type: 'testimonials', content: { title: 'قصص نجاح', items: [{ text: 'غيرت مساري المهني', author: 'نورة', role: 'مطور', avatar: '👩‍💻' }] } },
    { id: 't5', type: 'cta', content: { title: 'ابدأ التعلم', subtitle: 'سجّل الآن', buttonText: 'ابدأ مجاناً', bgColor: '#059669' } },
    { id: 't6', type: 'footer', content: { text: '© 2026 أكاديمتنا', links: [{ text: 'تواصل', url: '#' }] } },
  ]),
  t('agency', 'وكالة رقمية', 'Agency', '🏢', 'أعمال', 'للوكالات الرقمية', [
    { id: 't1', type: 'hero', content: { title: 'نحوّل أفكارك لواقع رقمي', subtitle: 'وكالة متخصصة بالتصميم والتطوير', buttonText: 'شاهد أعمالنا', bgColor: '#0f172a', bgGradient: 'linear-gradient(135deg,#0f172a,#1e293b)', badge: '🏆 أفضل وكالة' } },
    { id: 't2', type: 'features-grid', content: { title: 'خدماتنا', subtitle: 'حلول رقمية', items: [{ icon: '🎨', title: 'تصميم', desc: 'UI/UX' }, { icon: '💻', title: 'تطوير', desc: 'مواقع وتطبيقات' }, { icon: '📈', title: 'تسويق', desc: 'SEO وإعلانات' }, { icon: '🎬', title: 'إنتاج', desc: 'فيديو ومحتوى' }, { icon: '💡', title: 'استشارة', desc: 'استراتيجية' }, { icon: '📱', title: 'موبايل', desc: 'تطبيقات' }] } },
    { id: 't3', type: 'team', content: { title: 'فريقنا', members: [{ name: 'أحمد', role: 'CEO', avatar: '👨‍💼' }, { name: 'سارة', role: 'مصممة', avatar: '👩‍🎨' }, { name: 'محمد', role: 'مطور', avatar: '👨‍💻' }] } },
    { id: 't4', type: 'logo-cloud', content: { title: 'شركاؤنا', logos: ['🏢', '🏦', '🏛️', '🏥', '🎓', '🏭'] } },
    { id: 't5', type: 'cta', content: { title: 'مشروع؟', subtitle: 'دعنا نتحدث', buttonText: 'تواصل معنا', bgColor: '#0f172a' } },
    { id: 't6', type: 'footer', content: { text: '© 2026 وكالتنا', links: [{ text: 'المدونة', url: '#' }] } },
  ]),
  t('wedding', 'دعوة زفاف', 'Wedding', '💍', 'مناسبات', 'لدعوة زفاف أو مناسبة', [
    { id: 't1', type: 'hero', content: { title: 'يسعدنا دعوتكم', subtitle: 'مشاركتنا فرحتنا', buttonText: 'تأكيد الحضور', bgColor: '#be185d', bgGradient: 'linear-gradient(135deg,#be185d,#ec4899)', badge: '💍 دعوة زفاف' } },
    { id: 't2', type: 'counter', content: { items: [{ value: '15', label: 'يوم' }, { value: '08', label: 'ساعة' }, { value: '30', label: 'دقيقة' }, { value: '45', label: 'ثانية' }] } },
    { id: 't3', type: 'features-grid', content: { title: 'تفاصيل الحفل', items: [{ icon: '📅', title: 'التاريخ', desc: '15 يونيو 2026' }, { icon: '🕐', title: 'الوقت', desc: '8 مساءً' }, { icon: '📍', title: 'المكان', desc: 'قاعة الأفراح' }, { icon: '👔', title: 'ال dress code', desc: 'رسمياً' }] } },
    { id: 't4', type: 'cta', content: { title: 'نتطلع لحضوركم', subtitle: 'أكدوا قبل 10 يونيو', buttonText: 'تأكيد', bgColor: '#be185d' } },
    { id: 't5', type: 'footer', content: { text: 'شكراً لكم', links: [] } },
  ]),
  t('nonprofit', 'منظمات غير ربحية', 'Non-Profit', '❤️', 'مجتمعي', 'للجمعيات الخيرية', [
    { id: 't1', type: 'hero', content: { title: 'معاً نصنع الفرق', subtitle: 'نعمل لتحسين حياة المحتاجين', buttonText: 'تبرع الآن', bgColor: '#dc2626', bgGradient: 'linear-gradient(135deg,#dc2626,#b91c1c)', badge: '❤️ تبرعات آمنة' } },
    { id: 't2', type: 'stats', content: { items: [{ value: '+10K', label: 'مستفيد' }, { value: '+500', label: 'متبرع' }, { value: '+20', label: 'مشروع' }, { value: '95%', label: 'وصول' }] } },
    { id: 't3', type: 'features-grid', content: { title: 'مشاريعنا', subtitle: 'مجالات متعددة', items: [{ icon: '📚', title: 'تعليم', desc: 'توفير التعليم' }, { icon: '🏥', title: 'صحة', desc: 'رعاية صحية' }, { icon: '🏠', title: 'إسكان', desc: 'مساكن آمنة' }, { icon: '💧', title: 'مياه', desc: 'نظيفة للقرى' }] } },
    { id: 't4', type: 'cta', content: { title: 'ساهم معنا', subtitle: 'كل مساهمة تحدث فرقاً', buttonText: 'تبرع', bgColor: '#dc2626' } },
    { id: 't5', type: 'footer', content: { text: '© 2026 جمعيتنا', links: [{ text: 'التقارير', url: '#' }] } },
  ]),
  t('gym', 'صالة رياضية', 'Gym', '💪', 'رياضة', 'للمراكز الرياضية', [
    { id: 't1', type: 'hero', content: { title: 'hape قوتك معنا', subtitle: 'صالة بأحدث المعدات', buttonText: 'ابدأ الآن', bgColor: '#1a1a2e', bgGradient: 'linear-gradient(135deg,#1a1a2e,#dc2626)', badge: '💪 اشترك مجاناً' } },
    { id: 't2', type: 'features-grid', content: { title: 'خدماتنا', subtitle: 'تجربة رياضية', items: [{ icon: '🏋️', title: 'أجهزة', desc: 'حديثة' }, { icon: '🧘', title: 'يوجا', desc: 'حصص' }, { icon: '🥊', title: 'ملاكمة', desc: 'تدريب' }, { icon: '🏊', title: 'سباحة', desc: 'مسبح' }, { icon: '🥗', title: 'تغذية', desc: 'استشارة' }, { icon: '📱', title: 'تطبيق', desc: 'تتبع' }] } },
    { id: 't3', type: 'pricing-table', content: { title: 'خطط الاشتراك', plans: [{ name: 'أساسي', price: '29', featured: false, features: ['دخول الصالة', 'أجهزة'], cta: 'اشترك' }, { name: 'احترافي', price: '59', featured: true, features: ['حصص', 'مدرب 2/شهر', 'تطبيق'], cta: 'اشترك الآن' }, { name: 'VIP', price: '99', featured: false, features: ['مدرب شخصي', 'spa', 'تغذية'], cta: 'تواصل' }] } },
    { id: 't4', type: 'testimonials', content: { title: 'قصص نجاح', items: [{ text: 'خسرت 15 كجم!', author: 'خالد', role: 'عضو', avatar: '💪' }] } },
    { id: 't5', type: 'cta', content: { title: 'جاهز تغير حياتك؟', subtitle: 'جرّب أسبوع مجاني', buttonText: 'جرّب', bgColor: '#dc2626' } },
    { id: 't6', type: 'footer', content: { text: '© 2026 صالتنا', links: [{ text: 'Instagram', url: '#' }] } },
  ]),
  t('event', 'حدث أو مؤتمر', 'Event', '🎪', 'فعاليات', 'لفعاليات والمؤتمرات', [
    { id: 't1', type: 'hero', content: { title: 'مؤتمر التقنية 2026', subtitle: '3 أيام من التعلم', buttonText: 'احجز مقعدك', bgColor: '#7c3aed', bgGradient: 'linear-gradient(135deg,#7c3aed,#a855f7)', badge: '🎪 الأكبر' } },
    { id: 't2', type: 'counter', content: { items: [{ value: '45', label: 'يوم' }, { value: '12', label: 'ساعة' }, { value: '30', label: 'دقيقة' }, { value: '00', label: 'ثانية' }] } },
    { id: 't3', type: 'features-grid', content: { title: 'لماذا تحضر؟', items: [{ icon: '🎤', title: '+30 متحدث', desc: 'عالميون' }, { icon: '🤝', title: 'networking', desc: 'تعرّف' }, { icon: '📚', title: 'ورش', desc: '+20 ورشة' }, { icon: '🏆', title: 'جوائز', desc: '$10K' }, { icon: '🎬', title: 'عرض حي', desc: 'مباشر' }, { icon: '📱', title: 'تطبيق', desc: 'خاص' }] } },
    { id: 't4', type: 'pricing-table', content: { title: 'التذاكر', plans: [{ name: 'مجاني', price: '0', featured: false, features: ['جلسات عامة', 'تطبيق'], cta: 'سجّل' }, { name: 'احترافي', price: '99', featured: true, features: ['ورش', 'شهادة', 'تغذية'], cta: 'احجز' }, { name: 'VIP', price: '299', featured: false, features: ['مقعد أول صف', 'لقاء Speakers', 'حفل'], cta: 'احجز VIP' }] } },
    { id: 't5', type: 'team', content: { title: 'المتحدثون', members: [{ name: 'د. أحمد', role: 'AI', avatar: '👨‍💻' }, { name: 'سارة', role: 'Google', avatar: '👩‍💼' }] } },
    { id: 't6', type: 'cta', content: { title: 'لا تفوّت!', subtitle: 'احجز الآن', buttonText: 'احجز', bgColor: '#7c3aed' } },
    { id: 't7', type: 'footer', content: { text: '© 2026 المؤتمر', links: [{ text: 'تواصل', url: '#' }] } },
  ]),
  t('medical', 'عيادة أو مركز صحي', 'Medical', '🏥', 'صحة', 'للعيادات والمراكز الطبية', [
    { id: 't1', type: 'hero', content: { title: 'صحتك أمانة', subtitle: 'مركز طبي بأفضل الأطباء', buttonText: 'احجز موعد', bgColor: '#0891b2', bgGradient: 'linear-gradient(135deg,#0891b2,#06b6d4)', badge: '🏥 حجز أونلاين' } },
    { id: 't2', type: 'features-grid', content: { title: 'أقسامنا', subtitle: 'رعاية شاملة', items: [{ icon: '🫀', title: 'قلب', desc: 'طب القلب' }, { icon: '🦷', title: 'أسنان', desc: 'علاج وتركيب' }, { icon: '👁️', title: 'عيون', desc: 'فحص وعلاج' }, { icon: '🦴', title: 'عظام', desc: 'أمراض العظام' }, { icon: '🧠', title: 'أعصاب', desc: 'طب الأعصاب' }, { icon: '👶', title: 'أطفال', desc: 'رعاية' }] } },
    { id: 't3', type: 'stats', content: { items: [{ value: '+20', label: 'طبيب' }, { value: '+5K', label: 'مريض' }, { value: '+15', label: 'قسم' }, { value: '98%', label: 'رضا' }] } },
    { id: 't4', type: 'testimonial', content: { text: 'خدمة ممتازة وأطباء محترفون', author: 'مريض', role: 'عميل', avatar: '👨‍💼' } },
    { id: 't5', type: 'cta', content: { title: 'احجز موعدك', subtitle: 'لا تؤجل صحتك', buttonText: 'احجز', bgColor: '#0891b2' } },
    { id: 't6', type: 'footer', content: { text: '© 2026 مركزنا', links: [{ text: 'تواصل', url: '#' }] } },
  ]),
  t('realestate', 'العقارات', 'Real Estate', '🏠', 'عقارات', 'لشركات العقارات', [
    { id: 't1', type: 'hero', content: { title: 'اكتشف عقارك المثالي', subtitle: 'فيلل وشقق وأراضي', buttonText: 'تصفح العروض', bgColor: '#1d4ed8', bgGradient: 'linear-gradient(135deg,#1d4ed8,#2563eb)', badge: '🏠 عروض حصرية' } },
    { id: 't2', type: 'features-grid', content: { title: 'خدماتنا', subtitle: 'حلول عقارية', items: [{ icon: '🏠', title: 'بيع', desc: 'أفضل سعر' }, { icon: '🔑', title: 'إيجار', desc: 'شقق وفيلل' }, { icon: '🏗', title: 'استثمار', desc: 'ذكي' }, { icon: '📐', title: 'تقييم', desc: 'احترافي' }, { icon: '📋', title: 'توثيق', desc: 'قانوني' }, { icon: '🏦', title: 'تمويل', desc: 'مساعدة' }] } },
    { id: 't3', type: 'counter', content: { items: [{ value: '+1000', label: 'عقار' }, { value: '+500', label: 'عميل' }, { value: '+10', label: 'سنوات' }, { value: '99%', label: 'رضا' }] } },
    { id: 't4', type: 'cta', content: { title: 'ابحث عن عقارك', subtitle: 'تواصل معنا', buttonText: 'تواصل', bgColor: '#1d4ed8' } },
    { id: 't5', type: 'footer', content: { text: '© 2026 شركتنا', links: [{ text: 'تواصل', url: '#' }] } },
  ]),
];

export async function GET() {
  return NextResponse.json({ templates });
}
