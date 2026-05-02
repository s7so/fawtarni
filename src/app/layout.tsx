import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/lib/auth-context";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "فوترني - Fawtarni | منصة الفواتير العربية الذكية",
  description:
    "أنشئ فواتير احترافية عربي/إنجليزي مجاناً مع دعم ZATCA QR Code. منصة فواتير ذكية للفريلانسرز والشركات الصغيرة في الشرق الأوسط.",
  keywords: [
    "فواتير",
    "فاتورة",
    "invoice",
    "ZATCA",
    "فوترني",
    "فواتير عربية",
    "Arabic invoice",
    "فريلانسر",
    "ضريبة القيمة المضافة",
    "VAT",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "فوترني",
  },
  openGraph: {
    title: "فوترني - Fawtarni | منصة الفواتير العربية الذكية",
    description:
      "أنشئ فواتير احترافية عربي/إنجليزي مجاناً مع دعم ZATCA QR Code.",
    type: "website",
    locale: "ar_SA",
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
