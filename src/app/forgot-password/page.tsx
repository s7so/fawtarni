"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setSubmitting(true);

      const result = await resetPassword(email);
      if (result.error) {
        setError(result.error);
      } else {
        setSent(true);
      }
      setSubmitting(false);
    },
    [email, resetPassword]
  );

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">تم الإرسال!</h2>
          <p className="text-gray-500 mb-6">
            لو البريد الإلكتروني مسجل عندنا، هتلاقي رابط إعادة تعيين كلمة المرور في صندوق الوارد.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            الرجوع لتسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-emerald-700">فوترني</h1>
            <p className="text-sm text-gray-400 mt-1">Fawtarni</p>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            نسيت كلمة المرور
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            أدخل بريدك الإلكتروني وهنرسلك رابط إعادة التعيين
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني <span className="text-gray-400 text-xs">/ Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
                placeholder="name@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
            >
              {submitting ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
              ← الرجوع لتسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
