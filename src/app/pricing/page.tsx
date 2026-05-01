import Link from "next/link";

const plans = [
  {
    id: "free",
    nameAr: "مجاني",
    nameEn: "Free",
    price: "0",
    currency: "",
    period: "",
    descAr: "جرّب فوترني بدون أي تكلفة",
    descEn: "Try Fawtarni at no cost",
    highlight: false,
    badge: null,
    features: [
      { textAr: "3 فواتير شهرياً", textEn: "3 invoices/month", included: true },
      { textAr: "تصدير PDF", textEn: "PDF export", included: true },
      { textAr: "QR Code متوافق مع ZATCA", textEn: "ZATCA QR Code", included: true },
      { textAr: "10+ عملة مدعومة", textEn: "10+ currencies", included: true },
      { textAr: "حساب ضريبة تلقائي", textEn: "Auto tax calculation", included: true },
      { textAr: "لوجو الشركة", textEn: "Company logo", included: false },
      { textAr: "رقم تسلسلي تلقائي", textEn: "Auto serial numbers", included: false },
      { textAr: "حفظ بيانات البائع", textEn: "Save seller data", included: false },
      { textAr: "أرشيف فواتير", textEn: "Invoice archive", included: false },
      { textAr: "قوالب متعددة", textEn: "Multiple templates", included: false },
    ],
    ctaAr: "ابدأ مجاناً",
    ctaEn: "Start Free",
    ctaLink: "/create",
  },
  {
    id: "basic",
    nameAr: "أساسي",
    nameEn: "Basic",
    price: "19",
    currency: "ر.س",
    period: "/شهرياً",
    descAr: "للفريلانسرز وأصحاب الأعمال الصغيرة",
    descEn: "For freelancers & small businesses",
    highlight: true,
    badge: "الأكثر شعبية",
    features: [
      { textAr: "فواتير غير محدودة", textEn: "Unlimited invoices", included: true },
      { textAr: "تصدير PDF", textEn: "PDF export", included: true },
      { textAr: "QR Code متوافق مع ZATCA", textEn: "ZATCA QR Code", included: true },
      { textAr: "10+ عملة مدعومة", textEn: "10+ currencies", included: true },
      { textAr: "حساب ضريبة تلقائي", textEn: "Auto tax calculation", included: true },
      { textAr: "لوجو الشركة", textEn: "Company logo", included: true },
      { textAr: "رقم تسلسلي تلقائي", textEn: "Auto serial numbers", included: true },
      { textAr: "حفظ بيانات البائع", textEn: "Save seller data", included: true },
      { textAr: "أرشيف فواتير", textEn: "Invoice archive", included: true },
      { textAr: "قوالب متعددة", textEn: "Multiple templates", included: false },
    ],
    ctaAr: "اشترك الآن",
    ctaEn: "Subscribe Now",
    ctaLink: "/create",
  },
  {
    id: "pro",
    nameAr: "احترافي",
    nameEn: "Professional",
    price: "49",
    currency: "ر.س",
    period: "/شهرياً",
    descAr: "للشركات اللي محتاجة كل المميزات",
    descEn: "For businesses needing all features",
    highlight: false,
    badge: null,
    features: [
      { textAr: "فواتير غير محدودة", textEn: "Unlimited invoices", included: true },
      { textAr: "تصدير PDF", textEn: "PDF export", included: true },
      { textAr: "QR Code متوافق مع ZATCA", textEn: "ZATCA QR Code", included: true },
      { textAr: "10+ عملة مدعومة", textEn: "10+ currencies", included: true },
      { textAr: "حساب ضريبة تلقائي", textEn: "Auto tax calculation", included: true },
      { textAr: "لوجو الشركة", textEn: "Company logo", included: true },
      { textAr: "رقم تسلسلي تلقائي", textEn: "Auto serial numbers", included: true },
      { textAr: "حفظ بيانات البائع", textEn: "Save seller data", included: true },
      { textAr: "أرشيف فواتير", textEn: "Invoice archive", included: true },
      { textAr: "قوالب متعددة", textEn: "Multiple templates", included: true },
      { textAr: "فواتير متكررة تلقائية", textEn: "Recurring invoices", included: true },
      { textAr: "تقارير مالية", textEn: "Financial reports", included: true },
      { textAr: "تصدير Excel", textEn: "Excel export", included: true },
      { textAr: "إرسال بالإيميل", textEn: "Email delivery", included: true },
      { textAr: "دعم فني أولوية", textEn: "Priority support", included: true },
    ],
    ctaAr: "اشترك الآن",
    ctaEn: "Subscribe Now",
    ctaLink: "/create",
  },
];

const faqs = [
  {
    qAr: "هل أقدر أجرب قبل ما أدفع؟",
    qEn: "Can I try before paying?",
    aAr: "أكيد! الباقة المجانية تديك 3 فواتير شهرياً بدون أي تكلفة أو بطاقة ائتمان.",
  },
  {
    qAr: "هل أقدر أغيّر الباقة بعدين؟",
    qEn: "Can I change my plan later?",
    aAr: "طبعاً! تقدر تترقى أو تنزّل باقتك في أي وقت. التغيير يتم فوراً.",
  },
  {
    qAr: "إيه طرق الدفع المتاحة؟",
    qEn: "What payment methods are available?",
    aAr: "ندعم الدفع بالبطاقات الائتمانية (Visa, Mastercard) و Apple Pay و مدى.",
  },
  {
    qAr: "هل في عقد أو التزام؟",
    qEn: "Is there a contract?",
    aAr: "لا! الاشتراك شهري بدون أي عقد أو التزام. تقدر تلغي في أي وقت.",
  },
  {
    qAr: "هل فوترني متوافق مع ZATCA؟",
    qEn: "Is Fawtarni ZATCA compliant?",
    aAr: "نعم! فوترني متوافق مع متطلبات هيئة الزكاة والضريبة (ZATCA) المرحلة الأولى مع QR Code بتشفير TLV.",
  },
];

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-emerald-700">فوترني</span>
            <span className="text-sm text-gray-400">Fawtarni</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors hidden sm:inline">
              الرئيسية
            </Link>
            <Link href="/#features" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors hidden sm:inline">
              المميزات
            </Link>
            <Link
              href="/create"
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              أنشئ فاتورة مجاناً
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-bl from-emerald-700 via-emerald-800 to-emerald-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            خطط أسعار بسيطة وشفافة
          </h1>
          <p className="text-lg text-emerald-200 mb-2">Simple & transparent pricing</p>
          <p className="text-emerald-100 max-w-2xl mx-auto">
            ابدأ مجاناً وترقّى لما شغلك يكبر. بدون رسوم خفية — ادفع بس على اللي تستخدمه.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-6 -mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl p-8 border-2 transition-all duration-300 relative ${
                  plan.highlight
                    ? "bg-white border-emerald-500 shadow-xl shadow-emerald-100 scale-[1.02]"
                    : "bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-600 text-white text-sm font-bold rounded-full">
                    {plan.badge}
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{plan.nameAr}</h3>
                  <p className="text-sm text-gray-400 mb-4">{plan.nameEn}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-emerald-700">{plan.price}</span>
                    {plan.currency && (
                      <span className="text-lg text-gray-500">{plan.currency}</span>
                    )}
                    {plan.period && (
                      <span className="text-sm text-gray-400">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-3">{plan.descAr}</p>
                  <p className="text-xs text-gray-400">{plan.descEn}</p>
                </div>

                <div className="border-t border-gray-100 pt-6 mb-6">
                  <ul className="space-y-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        {f.included ? <CheckIcon /> : <XIcon />}
                        <div>
                          <span className={`text-sm ${f.included ? "text-gray-700" : "text-gray-400"}`}>
                            {f.textAr}
                          </span>
                          <span className={`text-xs mr-1 ${f.included ? "text-gray-400" : "text-gray-300"}`}>
                            / {f.textEn}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={plan.ctaLink}
                  className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition-colors ${
                    plan.highlight
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {plan.ctaAr}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison note */}
      <section className="pb-12 px-6">
        <div className="max-w-3xl mx-auto bg-emerald-50 rounded-2xl p-8 text-center border border-emerald-100">
          <h3 className="text-xl font-bold text-emerald-800 mb-2">ليه فوترني أرخص من المنافسين؟</h3>
          <p className="text-sm text-gray-500 mb-4">Why is Fawtarni cheaper than competitors?</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-700">19 ر.س</div>
              <div className="text-sm text-gray-600 mt-1">فوترني</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-400">57+ ر.س</div>
              <div className="text-sm text-gray-600 mt-1">Wafeq</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-400">120+ ر.س</div>
              <div className="text-sm text-gray-600 mt-1">Qoyod</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-6">
            فوترني مبني بتكنولوجيا حديثة وبدون تكاليف إضافية — عشان كده نقدر نقدملك نفس الجودة بسعر أقل بـ 3-6 مرات.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">أسئلة شائعة</h2>
            <p className="text-gray-500">Frequently Asked Questions</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-1">{faq.qAr}</h3>
                <p className="text-xs text-gray-400 mb-3">{faq.qEn}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.aAr}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-emerald-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">جاهز تبدأ؟</h2>
          <p className="text-emerald-200 text-lg mb-8">
            ابدأ بالباقة المجانية — بدون بطاقة ائتمان، بدون التزام
          </p>
          <Link
            href="/create"
            className="inline-block px-10 py-4 bg-white text-emerald-700 rounded-xl text-lg font-bold hover:bg-emerald-50 transition-colors shadow-lg"
          >
            أنشئ فاتورتك الآن — مجاناً
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-xl font-bold text-white">فوترني</span>
            <span className="text-sm text-gray-500 mr-2">Fawtarni</span>
            <p className="text-sm mt-1">منصة الفواتير العربية الذكية</p>
          </div>
          <div className="text-sm text-center md:text-left">
            <p>صُنع بالتعاون بين الإنسان والذكاء الاصطناعي</p>
            <p className="text-gray-500 mt-1">Built by Human + AI collaboration</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
