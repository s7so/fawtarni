"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Stars } from "@react-three/drei";
import { useRef, Suspense } from "react";
import { useAuth } from "@/lib/auth-context";

function AnimatedSphere() {
  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={1.5}>
      <Sphere args={[1, 64, 64]} scale={2.2}>
        <MeshDistortMaterial
          color="#059669"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="!absolute inset-0">
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#34d399" />
        <AnimatedSphere />
        <Stars radius={50} depth={60} count={1500} factor={4} saturation={0} fade speed={2} />
      </Suspense>
    </Canvas>
  );
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

function FeatureCard({
  icon,
  titleAr,
  titleEn,
  descAr,
}: {
  icon: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  index: number;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-7 border border-white/50 shadow-lg hover:shadow-2xl hover:shadow-emerald-200/30 transition-all duration-500 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <motion.div
          className="text-5xl mb-5 inline-block"
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">{titleAr}</h3>
        <p className="text-sm text-emerald-600 font-medium mb-3">{titleEn}</p>
        <p className="text-sm text-gray-600 leading-relaxed">{descAr}</p>
      </div>
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl group-hover:bg-emerald-400/20 transition-all duration-500" />
    </motion.div>
  );
}

function StepCard({
  number,
  titleAr,
  descAr,
}: {
  number: string;
  titleAr: string;
  descAr: string;
}) {
  return (
    <motion.div variants={fadeInScale} className="text-center relative">
      <motion.div
        whileHover={{ scale: 1.15, rotate: 360 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-5 shadow-lg shadow-emerald-300/40 rotate-3"
      >
        {number}
      </motion.div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{titleAr}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{descAr}</p>
    </motion.div>
  );
}

function FloatingParticle({ delay, x, size }: { delay: number; x: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-emerald-400/20"
      style={{ width: size, height: size, left: x }}
      animate={{
        y: [0, -100, -200, -300],
        opacity: [0, 0.6, 0.4, 0],
        scale: [0.5, 1, 0.8, 0.3],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: "easeOut",
      }}
    />
  );
}

function CountUp({ target, suffix = "" }: { target: string; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
      className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-300 to-emerald-100 bg-clip-text text-transparent"
    >
      {target}{suffix}
    </motion.span>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const navBg = useTransform(scrollYProgress, [0, 0.05], ["rgba(255,255,255,0)", "rgba(255,255,255,0.9)"]);
  const navShadow = useTransform(scrollYProgress, [0, 0.05], ["none", "0 4px 30px rgba(0,0,0,0.08)"]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        style={{ backgroundColor: navBg, boxShadow: navShadow }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              فوترني
            </span>
            <span className="text-sm text-gray-400 font-light">Fawtarni</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <a
              href="#features"
              className="text-sm text-gray-600 hover:text-emerald-600 transition-colors hidden sm:inline"
            >
              المميزات
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-gray-600 hover:text-emerald-600 transition-colors hidden sm:inline"
            >
              كيف يعمل
            </a>
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-emerald-600 transition-colors hidden sm:inline"
            >
              لوحة التحكم
            </Link>
            {!isAuthenticated && (
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-emerald-600 transition-colors hidden sm:inline"
              >
                تسجيل الدخول
              </Link>
            )}
            {isAuthenticated && (
              <Link
                href="/settings"
                className="text-sm text-gray-600 hover:text-emerald-600 transition-colors hidden sm:inline"
              >
                الإعدادات
              </Link>
            )}
            <Link
              href="/create"
              className="relative px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-sm font-bold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:scale-105 active:scale-95"
            >
              أنشئ فاتورة مجاناً
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 text-white overflow-hidden"
      >
        {/* 3D Background */}
        <div className="absolute inset-0 opacity-60">
          <Scene3D />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingParticle delay={0} x="10%" size={12} />
          <FloatingParticle delay={1} x="25%" size={8} />
          <FloatingParticle delay={2} x="40%" size={16} />
          <FloatingParticle delay={3} x="60%" size={10} />
          <FloatingParticle delay={4} x="75%" size={14} />
          <FloatingParticle delay={5} x="90%" size={9} />
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-gray-900/40 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500/15 backdrop-blur-md rounded-full text-sm mb-8 border border-emerald-400/30"
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            مجاني 100% — لا حاجة لبطاقة ائتمان
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight tracking-tight"
          >
            أنشئ فواتير
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
              احترافية
            </span>
            <br />
            <span className="text-3xl md:text-5xl lg:text-6xl font-light text-gray-300">
              في ثوانٍ معدودة
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            منصة فواتير ذكية مصممة للفريلانسرز والشركات في الشرق الأوسط
            <br />
            <span className="text-emerald-400">متوافقة مع ZATCA</span> — مع QR Code
            وتصدير PDF فوري
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              href="/create"
              className="group relative px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl text-lg font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">ابدأ الآن — مجاناً</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Link>
            <a
              href="#features"
              className="px-10 py-5 border-2 border-emerald-400/30 text-emerald-200 rounded-2xl text-lg font-medium hover:bg-emerald-400/10 hover:border-emerald-400/50 transition-all backdrop-blur-sm"
            >
              اكتشف المميزات ↓
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="grid grid-cols-3 gap-8 max-w-xl mx-auto"
          >
            <div className="text-center">
              <CountUp target="0" />
              <div className="text-sm text-gray-400 mt-2">تكلفة</div>
            </div>
            <div className="text-center">
              <CountUp target="10" suffix="+" />
              <div className="text-sm text-gray-400 mt-2">عملة مدعومة</div>
            </div>
            <div className="text-center">
              <CountUp target="PDF" />
              <div className="text-sm text-gray-400 mt-2">تصدير فوري</div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-emerald-400/40 rounded-full flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                المميزات
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              كل اللي محتاجه
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                {" "}في مكان واحد
              </span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-500 text-lg">
              Everything you need in one place
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
          >
            <FeatureCard
              icon="🧾"
              titleAr="فواتير ثنائية اللغة"
              titleEn="Bilingual Invoices"
              descAr="أنشئ فواتير بالعربي والإنجليزي أو بلغة واحدة — مصممة بشكل احترافي ومتوافقة مع المعايير المحلية."
              index={0}
            />
            <FeatureCard
              icon="📱"
              titleAr="QR Code متوافق مع ZATCA"
              titleEn="ZATCA Compliant QR"
              descAr="كود QR تلقائي يحتوي على بيانات الفاتورة بتشفير TLV متوافق مع هيئة الزكاة والضريبة."
              index={1}
            />
            <FeatureCard
              icon="📥"
              titleAr="تصدير PDF فوري"
              titleEn="Instant PDF Export"
              descAr="حمّل فاتورتك كملف PDF عالي الجودة جاهز للإرسال أو الطباعة بضغطة زر واحدة."
              index={2}
            />
            <FeatureCard
              icon="💰"
              titleAr="10+ عملة مدعومة"
              titleEn="10+ Currencies"
              descAr="دعم كامل للريال السعودي، الجنيه المصري، الدرهم الإماراتي، الدولار، واليورو والمزيد."
              index={3}
            />
            <FeatureCard
              icon="🔢"
              titleAr="حساب تلقائي للضريبة"
              titleEn="Auto Tax Calculation"
              descAr="حساب تلقائي لضريبة القيمة المضافة (VAT) بأي نسبة — مع دعم الخصومات."
              index={4}
            />
            <FeatureCard
              icon="🎨"
              titleAr="تصميم احترافي"
              titleEn="Professional Design"
              descAr="فواتير بتصميم أنيق واحترافي يعكس صورة عملك — مع معاينة مباشرة أثناء الإنشاء."
              index={5}
            />
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                الخطوات
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              كيف يعمل
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                {" "}فوترني؟
              </span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-500 text-lg">
              How does Fawtarni work?
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-16"
          >
            <StepCard
              number="1"
              titleAr="أدخل بياناتك"
              descAr="أدخل بيانات البائع والمشتري وأضف بنود الفاتورة — النظام يحسب الضريبة والإجمالي تلقائياً."
            />
            <StepCard
              number="2"
              titleAr="راجع الفاتورة"
              descAr="شاهد معاينة مباشرة للفاتورة أثناء الكتابة — مع QR Code تلقائي متوافق مع ZATCA."
            />
            <StepCard
              number="3"
              titleAr="حمّل وأرسل"
              descAr="حمّل الفاتورة كملف PDF وأرسلها للعميل — كل ده في أقل من دقيقة!"
            />
          </motion.div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50" />
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                الجمهور المستهدف
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-800 mb-12">
              مصمم
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                {" "}لمين؟
              </span>
            </motion.h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-5"
          >
            {[
              { icon: "💻", label: "فريلانسرز" },
              { icon: "🏪", label: "متاجر صغيرة" },
              { icon: "🎨", label: "مصممين" },
              { icon: "📸", label: "مصورين" },
              { icon: "✍️", label: "كتّاب محتوى" },
              { icon: "🔧", label: "مقدمي خدمات" },
              { icon: "👨‍💼", label: "استشاريين" },
              { icon: "🏢", label: "شركات ناشئة" },
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={fadeInScale}
                whileHover={{ scale: 1.08, y: -4 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 cursor-default"
              >
                <motion.div
                  className="text-4xl mb-3"
                  whileHover={{ scale: 1.3, rotate: 10 }}
                  transition={{ type: "spring" }}
                >
                  {item.icon}
                </motion.div>
                <p className="text-sm font-bold text-gray-700">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-800 to-gray-900" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center relative"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
          >
            جاهز تنشئ
            <br />
            <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              أول فاتورة؟
            </span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-emerald-200/80 text-xl mb-10 leading-relaxed">
            ابدأ الآن مجاناً — بدون تسجيل، بدون بطاقة ائتمان، بدون قيود
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
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              فوترني
            </span>
            <span className="text-sm text-gray-600 mr-2">Fawtarni</span>
            <p className="text-sm mt-2 text-gray-500">منصة الفواتير العربية الذكية</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-center md:text-left"
          >
            <p className="text-gray-400">صُنع بالتعاون بين الإنسان والذكاء الاصطناعي</p>
            <p className="text-gray-600 mt-1">Built by Human + AI collaboration</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
