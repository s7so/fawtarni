"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const ONBOARDING_KEY = "fawtarni_onboarding_seen";

const steps = [
  {
    icon: "👋",
    titleAr: "أهلاً بك في فوترني!",
    titleEn: "Welcome to Fawtarni!",
    descAr:
      "منصة فواتير عربية ذكية مصممة للفريلانسرز والشركات الصغيرة — مجانية بالكامل.",
  },
  {
    icon: "🧾",
    titleAr: "أنشئ فاتورتك الأولى",
    titleEn: "Create your first invoice",
    descAr:
      "أدخل بيانات البائع والمشتري، أضف البنود، واختر دولتك — الضريبة والعملة هتتملأ تلقائي.",
  },
  {
    icon: "🎨",
    titleAr: "اختر التصميم المناسب",
    titleEn: "Choose your template",
    descAr:
      "3 تصاميم احترافية — كلاسيكي، عصري، أو بسيط. شوف المعاينة المباشرة قبل ما تحمّل.",
  },
  {
    icon: "📤",
    titleAr: "شارك وأرسل بسهولة",
    titleEn: "Share instantly",
    descAr:
      "حمّل PDF، أو ابعت الفاتورة بالإيميل أو واتساب مباشرة — كل ده بضغطة زر.",
  },
];

export default function OnboardingDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) {
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem(ONBOARDING_KEY, "true");
  }, []);

  const handleNext = useCallback(() => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleClose();
    }
  }, [step, handleClose]);

  const handlePrev = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const current = steps[step];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Progress bar */}
            <div className="flex gap-1.5 px-6 pt-6">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full flex-1 transition-colors duration-300 ${
                    i <= step ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <div className="px-6 pt-8 pb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-6xl mb-5"
                  >
                    {current.icon}
                  </motion.div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {current.titleAr}
                  </h2>
                  <p className="text-sm text-gray-400 mb-3">
                    {current.titleEn}
                  </p>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {current.descAr}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex items-center justify-between">
              {step > 0 ? (
                <button
                  onClick={handlePrev}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-3 py-2"
                >
                  السابق
                </button>
              ) : (
                <button
                  onClick={handleClose}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-3 py-2"
                >
                  تخطي
                </button>
              )}

              {step < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
                >
                  التالي
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleClose();
                    router.push("/create");
                  }}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
                >
                  أنشئ فاتورتك الأولى
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
