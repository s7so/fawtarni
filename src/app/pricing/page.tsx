"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

interface Plan {
  nameAr: string;
  nameEn: string;
  priceAr: string;
  priceEn: string;
  periodAr: string;
  periodEn: string;
  descAr: string;
  descEn: string;
  features: { ar: string; en: string; included: boolean }[];
  highlighted: boolean;
  badge?: string;
  ctaAr: string;
  ctaEn: string;
  ctaHref: string;
}

const plans: Plan[] = [
  {
    nameAr: "مجاني",
    nameEn: "Free",
    priceAr: "0",
    priceEn: "0",
    periodAr: "للأبد",
    periodEn: "forever",
    descAr: "مثالي للفريلانسرز اللي لسه بادئين",
    descEn: "Perfect for freelancers just starting out",
    highlighted: false,
    ctaAr: "ابدأ مجاناً",
    ctaEn: "Start Free",
    ctaHref: "/create",
    features: [
      { ar: "5 فواتير شهرياً", en: "5 invoices/month", included: true },
      { ar: "تصدير PDF", en: "PDF export", included: true },
      { ar: "ZATCA QR Code", en: "ZATCA QR Code", included: true },
      { ar: "عربي + إنجليزي", en: "Arabic + English", included: true },
      { ar: "10 عملات مدعومة", en: "10 currencies", included: true },
      { ar: "حساب الضريبة التلقائي", en: "Auto tax calculation", included: true },
      { ar: "قوالب فواتير متعددة", en: "Multiple templates", included: false },
      { ar: "شعار مخصص على الفاتورة", en: "Custom logo on invoice", included: false },
      { ar: "سجل الفواتير", en: "Invoice history", included: false },
      { ar: "دعم فني أولوية", en: "Priority support", included: false },
    ],
  },
  {
    nameAr: "برو",
    nameEn: "Pro",
    priceAr: "29",
    priceEn: "29",
    periodAr: "شهرياً",
    periodEn: "/month",
    descAr: "للفريلانسرز والشركات الصغيرة اللي محتاجة أكتر",
    descEn: "For freelancers & small businesses that need more",
    highlighted: true,
    badge: "الأكثر شعبية",
    ctaAr: "اشترك الآن",
    ctaEn: "Subscribe Now",
    ctaHref: "/create",
    features: [
      { ar: "فواتير غير محدودة", en: "Unlimited invoices", included: true },
      { ar: "تصدير PDF", en: "PDF export", included: true },
      { ar: "ZATCA QR Code", en: "ZATCA QR Code", included: true },
      { ar: "عربي + إنجليزي", en: "Arabic + English", included: true },
      { ar: "10 عملات مدعومة", en: "10 currencies", included: true },
      { ar: "حساب الضريبة التلقائي", en: "Auto tax calculation", included: true },
      { ar: "قوالب فواتير متعددة", en: "Multiple templates", included: true },
      { ar: "شعار مخصص على الفاتورة", en: "Custom logo on invoice", included: true },
      { ar: "سجل الفواتير", en: "Invoice history", included: true },
      { ar: "دعم فني أولوية", en: "Priority support", included: false },
    ],
  },
  {
    nameAr: "بزنس",
    nameEn: "Business",
    priceAr: "79",
    priceEn: "79",
    periodAr: "شهرياً",
    periodEn: "/month",
    descAr: "للشركات اللي محتاجة حلول متكاملة واحترافية",
    descEn: "For companies that need complete professional solutions",
    highlighted: false,
    ctaAr: "تواصل معنا",
    ctaEn: "Contact Us",
    ctaHref: "/create",
    features: [
      { ar: "فواتير غير محدودة", en: "Unlimited invoices", included: true },
      { ar: "تصدير PDF", en: "PDF export", included: true },
      { ar: "ZATCA QR Code", en: "ZATCA QR Code", included: true },
      { ar: "عربي + إنجليزي", en: "Arabic + English", included: true },
      { ar: "10 عملات مدعومة", en: "10 currencies", included: true },
      { ar: "حساب الضريبة التلقائي", en: "Auto tax calculation", included: true },
      { ar: "قوالب فواتير متعددة", en: "Multiple templates", included: true },
      { ar: "شعار مخصص على الفاتورة", en: "Custom logo on invoice", included: true },
      { ar: "سجل الفواتير", en: "Invoice history", included: true },
      { ar: "دعم فني أولوية", en: "Priority support", included: true },
    ],
  },
];

const faqs: { questionAr: string; questionEn: string; answerAr: string; answerEn: string }[] = [
  {
    questionAr: "هل الباقة المجانية فعلاً مجانية للأبد؟",
    questionEn: "Is the free plan really free forever?",
    answerAr: "أيوه! الباقة المجانية مجانية تماماً بدون أي رسوم خفية. تقدر تنشئ حتى 5 فواتير شهرياً مع كل المميزات الأساسية.",
    answerEn: "Yes! The free plan is completely free with no hidden fees. You can create up to 5 invoices per month with all basic features.",
  },
  {
    questionAr: "أقدر أغير الباقة في أي وقت؟",
    questionEn: "Can I change my plan anytime?",
    answerAr: "طبعاً! تقدر تترقى أو تنزل باقتك في أي وقت. لو ترقيت، هتدفع الفرق فقط للفترة المتبقية.",
    answerEn: "Of course! You can upgrade or downgrade anytime. If you upgrade, you only pay the difference for the remaining period.",
  },
  {
    questionAr: "إيه طرق الدفع المتاحة؟",
    questionEn: "What payment methods are available?",
    answerAr: "نقبل بطاقات Visa و Mastercard و Apple Pay و مدى. كمان نقبل التحويل البنكي للباقات السنوية.",
    answerEn: "We accept Visa, Mastercard, Apple Pay, and Mada. We also accept bank transfers for annual plans.",
  },
  {
    questionAr: "هل في خصم للاشتراك السنوي؟",
    questionEn: "Is there an annual discount?",
    answerAr: "أيوه! لما تشترك سنوياً بتوفر شهرين مجاناً — يعني بتدفع 10 شهور بس بدل 12.",
    answerEn: "Yes! Annual subscriptions save you 2 months free — you only pay for 10 months instead of 12.",
  },
];

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <motion.div
      variants={fadeInScale}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`relative rounded-3xl p-8 border transition-all duration-300 flex flex-col ${
        plan.highlighted
          ? "bg-gradient-to-b from-emerald-50 to-white border-emerald-300 shadow-2xl shadow-emerald-200/40 scale-[1.03]"
          : "bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl hover:border-emerald-200"
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-5 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-500/30">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{plan.nameAr}</h3>
        <p className="text-sm text-emerald-600 font-medium">{plan.nameEn}</p>
      </div>

      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-bold text-gray-900">{plan.priceAr}</span>
          <span className="text-xl text-gray-500">ر.س</span>
        </div>
        <p className="text-sm text-gray-400 mt-1">{plan.periodAr} / {plan.periodEn}</p>
      </div>

      <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">{plan.descAr}</p>

      <div className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-3">
            {feature.included ? <CheckIcon /> : <XIcon />}
            <span className={`text-sm ${feature.included ? "text-gray-700" : "text-gray-400"}`}>
              {feature.ar}
            </span>
          </div>
        ))}
      </div>

      <Link
        href={plan.ctaHref}
        className={`block w-full text-center py-3.5 rounded-xl text-sm font-bold transition-all ${
          plan.highlighted
            ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:scale-[1.02] active:scale-[0.98]"
            : "bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 hover:border-emerald-300"
        }`}
      >
        {plan.ctaAr}
        <span className="text-xs font-normal opacity-70 mr-2">/ {plan.ctaEn}</span>
      </Link>
    </motion.div>
  );
}

function FAQItem({ faq }: { faq: (typeof faqs)[0] }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <h4 className="font-bold text-gray-800 mb-2">{faq.questionAr}</h4>
      <p className="text-xs text-emerald-600 mb-3">{faq.questionEn}</p>
      <p className="text-sm text-gray-600 leading-relaxed">{faq.answerAr}</p>
    </motion.div>
  );
}

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              فوترني
            </span>
            <span className="text-sm text-gray-400 font-light">Fawtarni</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-emerald-600 transition-colors hidden sm:inline"
            >
              الرئيسية
            </Link>
            <Link
              href="/create"
              className="relative px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-sm font-bold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:scale-105 active:scale-95"
            >
              أنشئ فاتورة مجاناً
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/20 rounded-full blur-[100px]" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500/15 backdrop-blur-md rounded-full text-sm text-white mb-6 border border-emerald-400/30">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              وفّر شهرين مع الاشتراك السنوي
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            اختر الباقة
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
              المناسبة لعملك
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            ابدأ مجاناً وترقى لما تحتاج — بدون عقود طويلة أو رسوم خفية
            <br />
            <span className="text-emerald-400 text-sm">
              Start free and upgrade when you need — no long contracts or hidden fees
            </span>
          </motion.p>
        </motion.div>
      </section>

      {/* Plans */}
      <section className="py-20 px-6 -mt-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {plans.map((plan) => (
            <PlanCard key={plan.nameEn} plan={plan} />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-400 mt-10"
        >
          جميع الأسعار بالريال السعودي — شاملة ضريبة القيمة المضافة
          <br />
          <span className="text-xs">All prices in SAR — VAT included</span>
        </motion.p>
      </section>

      {/* Comparison Banner */}
      <section className="py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-50" />
        <div className="absolute top-10 right-0 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto relative"
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              ليه فوترني؟
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              قيمة حقيقية
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                {" "}بسعر مناسب
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {[
              {
                icon: "🔒",
                titleAr: "بدون عقود",
                descAr: "اشترك شهرياً وألغِ في أي وقت بدون أي التزامات.",
              },
              {
                icon: "💳",
                titleAr: "دفع آمن",
                descAr: "دفع مشفر وآمن عبر بوابات دفع معتمدة محلياً ودولياً.",
              },
              {
                icon: "🚀",
                titleAr: "ترقية فورية",
                descAr: "ترقى في أي لحظة واستمتع بكل المميزات الجديدة فوراً.",
              },
            ].map((item) => (
              <motion.div
                key={item.titleAr}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{item.titleAr}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.descAr}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                أسئلة شائعة
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              عندك سؤال؟
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                {" "}عندنا إجابة
              </span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-500">
              Frequently Asked Questions
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} faq={faq} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-800 to-gray-900" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/20 rounded-full blur-[100px]" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold mb-6 text-white"
          >
            ابدأ مجاناً
            <br />
            <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              وترقى لما تحتاج
            </span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-emerald-200/80 text-lg mb-10">
            أنشئ أول فاتورة في أقل من دقيقة — مجاناً وبدون تسجيل
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link
              href="/create"
              className="group relative inline-block px-12 py-5 bg-white text-emerald-700 rounded-2xl text-xl font-bold hover:bg-emerald-50 transition-all shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">أنشئ فاتورتك الآن</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/0 via-emerald-100/50 to-emerald-100/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              فوترني
            </span>
            <span className="text-sm text-gray-600 mr-2">Fawtarni</span>
            <p className="text-sm mt-2 text-gray-500">منصة الفواتير العربية الذكية</p>
          </div>
          <div className="text-sm text-center md:text-left">
            <p className="text-gray-400">صُنع بالتعاون بين الإنسان والذكاء الاصطناعي</p>
            <p className="text-gray-600 mt-1">Built by Human + AI collaboration</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
