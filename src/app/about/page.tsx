"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-emerald-700 text-white py-4 px-6 shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            فوترني
          </Link>
          <div className="flex gap-3">
            <Link
              href="/create"
              className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
            >
              أنشئ فاتورة
            </Link>
            <Link
              href="/"
              className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
            >
              الرئيسية
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* About Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-3xl font-bold text-gray-800 mb-6"
          >
            عن فوترني
          </motion.h1>

          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-4 text-gray-700 leading-relaxed"
          >
            <p className="text-lg">
              <strong className="text-emerald-700">فوترني</strong> هي منصة
              فواتير عربية ذكية مصممة خصيصاً للفريلانسرز والشركات الصغيرة في
              الشرق الأوسط وشمال أفريقيا.
            </p>
            <p>
              نؤمن إن إنشاء فاتورة احترافية لازم يكون سهل وسريع — بدون تعقيد
              ولا تكاليف مبالغة. عشان كده بنينا فوترني كأداة بسيطة وقوية في نفس
              الوقت.
            </p>
            <p>
              المنصة تدعم 18 دولة في الشرق الأوسط مع نسب الضرائب الصحيحة لكل
              دولة، و3 تصاميم فواتير احترافية، ومشاركة مباشرة عبر الإيميل
              وواتساب.
            </p>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-2xl font-bold text-gray-800 mb-6"
          >
            ليه فوترني؟
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: "🆓",
                title: "مجاني لفترة محدودة",
                desc: "استمتع بكل الميزات مجاناً لفترة محدودة — بدون حدود على عدد الفواتير",
              },
              {
                icon: "🌍",
                title: "18 دولة مدعومة",
                desc: "ضرائب صحيحة لكل دول الشرق الأوسط وشمال أفريقيا",
              },
              {
                icon: "🔒",
                title: "خصوصية كاملة",
                desc: "بياناتك محمية — يمكنك استخدام المنصة بدون إنشاء حساب",
              },
              {
                icon: "📱",
                title: "يعمل على كل الأجهزة",
                desc: "تصميم متجاوب + PWA — يعمل حتى بدون إنترنت",
              },
              {
                icon: "🎨",
                title: "3 تصاميم احترافية",
                desc: "كلاسيكي، عصري، وبسيط — اختر ما يناسب عملك",
              },
              {
                icon: "📤",
                title: "مشاركة فورية",
                desc: "إرسال بالإيميل وواتساب مباشرة من المنصة",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors"
              >
                <span className="text-2xl">{item.icon}</span>
                <h3 className="font-bold text-gray-800 mt-2">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-2xl font-bold text-gray-800 mb-6"
          >
            تواصل معنا
          </motion.h2>
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
          >
            <p className="text-gray-700 mb-6 leading-relaxed">
              عندك سؤال، اقتراح، أو مشكلة؟ نحب نسمع منك! تواصل معنا عبر أي من
              الطرق التالية:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="mailto:support@fawtarni.com"
                className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  📧
                </span>
                <div>
                  <p className="font-bold text-emerald-700 text-sm">
                    البريد الإلكتروني
                  </p>
                  <p className="text-emerald-600 text-sm" dir="ltr">
                    support@fawtarni.com
                  </p>
                </div>
              </a>
              <a
                href="https://github.com/s7so/fawtarni"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  💻
                </span>
                <div>
                  <p className="font-bold text-gray-700 text-sm">GitHub</p>
                  <p className="text-gray-500 text-sm" dir="ltr">
                    s7so/fawtarni
                  </p>
                </div>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
