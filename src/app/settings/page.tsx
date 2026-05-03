"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { getSellerProfile, saveSellerProfile, type SellerProfile } from "@/lib/storage";
import { saveCloudProfile, getCloudProfile, migrateLocalToCloud, getMonthlyInvoiceCount } from "@/lib/cloud-storage";
import { supabaseEnabled } from "@/lib/supabase";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};


export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const [profile, setProfile] = useState<SellerProfile>({
    name: "",
    nameEn: "",
    address: "",
    taxNumber: "",
    phone: "",
    email: "",
    logo: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<string | null>(null);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    async function load() {
      // Try cloud first, fall back to localStorage
      let p: SellerProfile | null = null;
      if (supabaseEnabled && isAuthenticated) {
        p = await getCloudProfile();
        const count = await getMonthlyInvoiceCount();
        setMonthlyCount(count);
      }
      if (!p) p = getSellerProfile();
      if (p) setProfile(p);
      setLoaded(true);
    }

    if (!loading) load();
  }, [loading, isAuthenticated, router]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    saveSellerProfile(profile);
    if (supabaseEnabled && isAuthenticated) {
      await saveCloudProfile(profile);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [profile, isAuthenticated]);

  const handleMigrate = useCallback(async () => {
    setMigrating(true);
    const result = await migrateLocalToCloud();
    setMigrationResult(
      `تم نقل ${result.invoices} فاتورة و ${result.clients} عميل${result.profile ? " وبيانات البائع" : ""}`
    );
    setMigrating(false);
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.push("/");
  }, [signOut, router]);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      alert("حجم اللوجو لازم يكون أقل من 500KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfile((prev) => ({ ...prev, logo: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  }, []);

  if (loading || !loaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-emerald-700 text-white py-4 px-6 shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            فوترني <span className="text-emerald-200 text-sm font-normal">Fawtarni</span>
          </Link>
          <div className="flex gap-3 items-center">
            <Link
              href="/dashboard"
              className="px-3 py-2 text-emerald-200 hover:text-white text-sm transition-colors"
            >
              لوحة التحكم
            </Link>
            <Link
              href="/create"
              className="px-4 py-2 bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl text-sm font-bold transition-colors"
            >
              + فاتورة جديدة
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-3xl font-bold text-gray-800"
        >
          الإعدادات <span className="text-gray-400 text-lg font-normal">/ Settings</span>
        </motion.h1>

        {/* Account Info */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-bold text-emerald-700 border-b-2 border-emerald-200 pb-2 mb-4">
            الحساب <span className="text-gray-400 font-normal text-sm">/ Account</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">البريد الإلكتروني</p>
              <p className="font-medium text-gray-800" dir="ltr">
                {user?.email || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">فواتير هذا الشهر</p>
              <p className="font-medium text-gray-800">
                {monthlyCount}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Seller Profile */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-bold text-emerald-700 border-b-2 border-emerald-200 pb-2 mb-4">
            بيانات البائع <span className="text-gray-400 font-normal text-sm">/ Seller Profile</span>
          </h2>

          {/* Logo */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              شعار الشركة <span className="text-gray-400 text-xs">/ Logo</span>
            </label>
            <div className="flex items-center gap-4">
              {profile.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.logo} alt="Logo" className="w-16 h-16 object-contain rounded border" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="text-sm text-gray-500"
              />
              {profile.logo && (
                <button
                  onClick={() => setProfile((p) => ({ ...p, logo: "" }))}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  إزالة
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "name" as const, label: "اسم الشركة", labelEn: "Company Name", placeholder: "شركة فوترني" },
              { key: "nameEn" as const, label: "الاسم بالإنجليزي", labelEn: "English Name", placeholder: "Fawtarni Co.", dir: "ltr" },
              { key: "address" as const, label: "العنوان", labelEn: "Address", placeholder: "الرياض، السعودية" },
              { key: "taxNumber" as const, label: "الرقم الضريبي", labelEn: "Tax Number", placeholder: "300000000000003", dir: "ltr" },
              { key: "phone" as const, label: "الهاتف", labelEn: "Phone", placeholder: "+966 5xxxxxxxx", dir: "ltr" },
              { key: "email" as const, label: "البريد الإلكتروني", labelEn: "Email", placeholder: "info@company.com", dir: "ltr" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} <span className="text-gray-400 text-xs">/ {field.labelEn}</span>
                </label>
                <input
                  type="text"
                  value={profile[field.key]}
                  onChange={(e) => setProfile((p) => ({ ...p, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  dir={field.dir}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
            >
              {saved ? "تم الحفظ!" : saving ? "جاري الحفظ..." : "حفظ البيانات"}
            </button>
          </div>
        </motion.div>

        {/* Data Migration */}
        {supabaseEnabled && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-bold text-emerald-700 border-b-2 border-emerald-200 pb-2 mb-4">
              نقل البيانات <span className="text-gray-400 font-normal text-sm">/ Data Migration</span>
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              لو عندك بيانات محفوظة في المتصفح (localStorage) من قبل إنشاء الحساب،
              تقدر تنقلها للسحابة عشان تحافظ عليها.
            </p>
            <button
              onClick={handleMigrate}
              disabled={migrating}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
            >
              {migrating ? "جاري النقل..." : "نقل البيانات من المتصفح للسحابة"}
            </button>
            {migrationResult && (
              <p className="mt-3 text-sm text-emerald-600 font-medium">{migrationResult}</p>
            )}
          </motion.div>
        )}

        {/* Sign Out */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <button
            onClick={handleSignOut}
            className="px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl text-sm font-bold transition-colors"
          >
            تسجيل الخروج
          </button>
        </motion.div>
      </div>
    </div>
  );
}
