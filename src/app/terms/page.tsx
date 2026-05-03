"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-emerald-700 text-white py-4 px-6 shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            فوترني
          </Link>
          <Link
            href="/"
            className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            الرئيسية
          </Link>
        </div>
      </header>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="max-w-4xl mx-auto px-6 py-12"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          شروط الاستخدام
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Terms of Service — آخر تحديث: مايو 2025
        </p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              1. قبول الشروط
            </h2>
            <p>
              باستخدامك لمنصة فوترني، فإنك توافق على هذه الشروط والأحكام. إذا
              كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              2. وصف الخدمة
            </h2>
            <p>
              فوترني هي منصة إلكترونية لإنشاء وإدارة الفواتير باللغتين العربية
              والإنجليزية. تتيح لك المنصة:
            </p>
            <ul className="list-disc list-inside space-y-2 mr-4 mt-2">
              <li>إنشاء فواتير احترافية بتصاميم متعددة</li>
              <li>تصدير الفواتير بصيغة PDF</li>
              <li>إدارة العملاء وسجل الفواتير</li>
              <li>إرسال الفواتير عبر البريد الإلكتروني وواتساب</li>
              <li>تصدير التقارير والإحصائيات</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              3. حسابات المستخدمين
            </h2>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>يمكنك استخدام المنصة بدون إنشاء حساب (التخزين المحلي)</li>
              <li>عند إنشاء حساب، أنت مسؤول عن الحفاظ على سرية بيانات الدخول</li>
              <li>يجب أن تكون المعلومات المقدمة صحيحة ودقيقة</li>
              <li>يحق لنا تعليق أو إلغاء أي حساب يخالف هذه الشروط</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              4. الاستخدام المقبول
            </h2>
            <p>تلتزم بعدم استخدام المنصة في:</p>
            <ul className="list-disc list-inside space-y-2 mr-4 mt-2">
              <li>أي نشاط غير قانوني أو احتيالي</li>
              <li>إنشاء فواتير مزيفة أو مضللة</li>
              <li>انتحال شخصية أفراد أو شركات أخرى</li>
              <li>محاولة اختراق أو تعطيل المنصة</li>
              <li>إرسال رسائل مزعجة (spam) عبر ميزات المشاركة</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              5. الملكية الفكرية
            </h2>
            <p>
              جميع حقوق الملكية الفكرية للمنصة (التصميم، الكود، العلامة
              التجارية) محفوظة لفوترني. الفواتير التي تنشئها هي ملكك بالكامل.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              6. المسؤولية والضمان
            </h2>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>
                الخدمة مقدمة &quot;كما هي&quot; بدون أي ضمانات صريحة أو ضمنية
              </li>
              <li>
                فوترني ليست مسؤولة عن أي خسائر ناتجة عن استخدام المنصة
              </li>
              <li>
                أنت المسؤول عن التأكد من صحة بيانات الفواتير ومطابقتها للقوانين
                المحلية
              </li>
              <li>
                فوترني لا تقدم استشارات ضريبية أو محاسبية — استشر متخصصاً
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              7. الامتثال الضريبي
            </h2>
            <p>
              نسب الضرائب المعروضة في المنصة هي للإرشاد فقط وقد لا تكون محدّثة.
              المستخدم مسؤول عن التأكد من النسب الصحيحة حسب قوانين بلده. فوترني
              لا تتحمل أي مسؤولية عن أخطاء في حساب الضرائب.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              8. إنهاء الخدمة
            </h2>
            <p>
              يمكنك التوقف عن استخدام المنصة في أي وقت. يحق لنا إيقاف الخدمة أو
              تعديلها مع إشعار مسبق معقول. في حالة إيقاف الخدمة، سنوفر لك وسيلة
              لتصدير بياناتك.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              9. التعديلات
            </h2>
            <p>
              نحتفظ بحق تعديل هذه الشروط. سيتم إخطارك بالتغييرات الجوهرية.
              استمرارك في استخدام المنصة بعد التعديل يعني موافقتك على الشروط
              الجديدة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              10. القانون الحاكم
            </h2>
            <p>
              تخضع هذه الشروط لقوانين جمهورية مصر العربية. أي نزاع ينشأ عن
              استخدام المنصة يُحل ودياً أولاً، وفي حالة تعذر ذلك يُحال للمحاكم
              المختصة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              11. تواصل معنا
            </h2>
            <p>
              لأي استفسارات حول شروط الاستخدام، تواصل معنا عبر صفحة{" "}
              <Link
                href="/about"
                className="text-emerald-600 hover:text-emerald-700 underline"
              >
                تواصل معنا
              </Link>
              .
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
