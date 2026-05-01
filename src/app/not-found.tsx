import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-800 to-emerald-950 flex items-center justify-center p-6" dir="rtl">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-emerald-400 mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-3">الصفحة مش موجودة</h1>
        <p className="text-emerald-200 mb-2">Page not found</p>
        <p className="text-emerald-300/70 text-sm mb-8">
          الرابط ده مش موجود أو ممكن يكون اتغير. جرب ترجع للصفحة الرئيسية.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-400 transition-colors"
          >
            الصفحة الرئيسية
          </Link>
          <Link
            href="/create"
            className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/20"
          >
            أنشئ فاتورة
          </Link>
        </div>
      </div>
    </div>
  );
}
