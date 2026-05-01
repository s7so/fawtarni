import Link from "next/link";

function FeatureCard({ icon, titleAr, titleEn, descAr }: { icon: string; titleAr: string; titleEn: string; descAr: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{titleAr}</h3>
      <p className="text-sm text-gray-400 mb-2">{titleEn}</p>
      <p className="text-sm text-gray-600 leading-relaxed">{descAr}</p>
    </div>
  );
}

function StepCard({ number, titleAr, descAr }: { number: string; titleAr: string; descAr: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{titleAr}</h3>
      <p className="text-sm text-gray-600">{descAr}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-emerald-700">فوترني</span>
            <span className="text-sm text-gray-400">Fawtarni</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors hidden sm:inline">
              المميزات
            </a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors hidden sm:inline">
              كيف يعمل
            </a>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors hidden sm:inline">
              الأسعار
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
      <section className="bg-gradient-to-bl from-emerald-700 via-emerald-800 to-emerald-900 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 bg-emerald-600/50 rounded-full text-sm mb-6 border border-emerald-500/30">
            مجاني 100% — لا حاجة لبطاقة ائتمان
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            أنشئ فواتير احترافية
            <br />
            <span className="text-emerald-300">بالعربي والإنجليزي</span>
            <br />
            في ثوانٍ
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            منصة فواتير ذكية مصممة للفريلانسرز والشركات الصغيرة في الشرق الأوسط.
            <br />
            متوافقة مع ZATCA — مع QR Code وتصدير PDF فوري.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="px-8 py-4 bg-white text-emerald-700 rounded-xl text-lg font-bold hover:bg-emerald-50 transition-colors shadow-lg"
            >
              ابدأ الآن — مجاناً
            </Link>
            <a
              href="#features"
              className="px-8 py-4 border-2 border-emerald-400 text-emerald-100 rounded-xl text-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              اكتشف المميزات
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div>
              <div className="text-3xl font-bold text-emerald-300">0</div>
              <div className="text-sm text-emerald-200">تكلفة</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-300">10+</div>
              <div className="text-sm text-emerald-200">عملة مدعومة</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-300">PDF</div>
              <div className="text-sm text-emerald-200">تصدير فوري</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">كل اللي محتاجه في مكان واحد</h2>
            <p className="text-gray-500">Everything you need in one place</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon="🧾"
              titleAr="فواتير ثنائية اللغة"
              titleEn="Bilingual Invoices"
              descAr="أنشئ فواتير بالعربي والإنجليزي أو بلغة واحدة — مصممة بشكل احترافي ومتوافقة مع المعايير المحلية."
            />
            <FeatureCard
              icon="📱"
              titleAr="QR Code متوافق مع ZATCA"
              titleEn="ZATCA Compliant QR"
              descAr="كود QR تلقائي يحتوي على بيانات الفاتورة بتشفير TLV متوافق مع هيئة الزكاة والضريبة (المرحلة الأولى)."
            />
            <FeatureCard
              icon="📥"
              titleAr="تصدير PDF فوري"
              titleEn="Instant PDF Export"
              descAr="حمّل فاتورتك كملف PDF عالي الجودة جاهز للإرسال أو الطباعة بضغطة زر واحدة."
            />
            <FeatureCard
              icon="💰"
              titleAr="10+ عملة مدعومة"
              titleEn="10+ Currencies"
              descAr="دعم كامل للريال السعودي، الجنيه المصري، الدرهم الإماراتي، الدولار، واليورو والمزيد."
            />
            <FeatureCard
              icon="🔢"
              titleAr="حساب تلقائي للضريبة"
              titleEn="Auto Tax Calculation"
              descAr="حساب تلقائي لضريبة القيمة المضافة (VAT) بأي نسبة — مع دعم الخصومات."
            />
            <FeatureCard
              icon="🎨"
              titleAr="تصميم احترافي"
              titleEn="Professional Design"
              descAr="فواتير بتصميم أنيق واحترافي يعكس صورة عملك — مع معاينة مباشرة أثناء الإنشاء."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6 bg-emerald-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">كيف يعمل فوترني؟</h2>
            <p className="text-gray-500">How does Fawtarni work?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">مصمم لمين؟</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
              <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-emerald-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">جاهز تنشئ أول فاتورة؟</h2>
          <p className="text-emerald-200 text-lg mb-8">
            ابدأ الآن مجاناً — بدون تسجيل، بدون بطاقة ائتمان، بدون قيود
          </p>
          <Link
            href="/create"
            className="inline-block px-10 py-4 bg-white text-emerald-700 rounded-xl text-lg font-bold hover:bg-emerald-50 transition-colors shadow-lg"
          >
            أنشئ فاتورتك الآن
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
