"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function PrivacyPage() {
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
          سياسة الخصوصية
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Privacy Policy — آخر تحديث: مايو 2025
        </p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              1. المقدمة
            </h2>
            <p>
              مرحباً بك في فوترني. نحن نحترم خصوصيتك ونلتزم بحماية بياناتك
              الشخصية. توضح هذه السياسة كيف نجمع بياناتك ونستخدمها ونحميها عند
              استخدامك لمنصتنا.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              2. البيانات التي نجمعها
            </h2>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>
                <strong>بيانات الحساب:</strong> البريد الإلكتروني وكلمة المرور
                عند إنشاء حساب
              </li>
              <li>
                <strong>بيانات الفواتير:</strong> معلومات البائع والمشتري وبنود
                الفاتورة التي تدخلها
              </li>
              <li>
                <strong>بيانات الاستخدام:</strong> معلومات تقنية مثل نوع المتصفح
                والجهاز لتحسين الخدمة
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              3. كيف نستخدم بياناتك
            </h2>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>تقديم خدمة إنشاء وإدارة الفواتير</li>
              <li>حفظ بياناتك ومزامنتها بين أجهزتك</li>
              <li>تحسين المنصة وتجربة المستخدم</li>
              <li>التواصل معك بخصوص تحديثات مهمة للخدمة</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              4. تخزين البيانات وحمايتها
            </h2>
            <p>
              نستخدم Supabase كمزود للبنية التحتية السحابية، والذي يوفر تشفير
              البيانات أثناء النقل والتخزين. بياناتك محمية بسياسات أمان صارمة
              (Row Level Security) تضمن أن كل مستخدم يرى بياناته فقط.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              5. التخزين المحلي
            </h2>
            <p>
              يمكنك استخدام فوترني بدون إنشاء حساب. في هذه الحالة، تُحفظ
              بياناتك محلياً في متصفحك (localStorage) ولا تُرسل لأي خادم خارجي.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              6. مشاركة البيانات
            </h2>
            <p>
              نحن <strong>لا نبيع أو نشارك</strong> بياناتك الشخصية مع أطراف
              ثالثة. لا نستخدم بياناتك لأغراض إعلانية. قد نشارك بيانات مجهولة
              الهوية لأغراض إحصائية فقط.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              7. حقوقك
            </h2>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>حق الوصول إلى بياناتك الشخصية</li>
              <li>حق تصحيح بياناتك</li>
              <li>حق حذف حسابك وبياناتك بالكامل</li>
              <li>حق تصدير بياناتك (CSV/Excel)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              8. ملفات الكوكيز
            </h2>
            <p>
              نستخدم ملفات الكوكيز الأساسية فقط لتشغيل الخدمة (مثل جلسة تسجيل
              الدخول). لا نستخدم كوكيز تتبع أو إعلانات.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              9. التعديلات على السياسة
            </h2>
            <p>
              قد نحدّث هذه السياسة من وقت لآخر. سنخطرك بأي تغييرات جوهرية عبر
              البريد الإلكتروني أو إشعار داخل المنصة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-700 mb-3">
              10. تواصل معنا
            </h2>
            <p>
              لأي استفسارات حول سياسة الخصوصية، تواصل معنا عبر صفحة{" "}
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
