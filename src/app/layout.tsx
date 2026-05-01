import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "فوترني - Fawtarni | منصة الفواتير العربية الذكية",
  description:
    "أنشئ فواتير احترافية عربي/إنجليزي مجاناً مع دعم ZATCA QR Code. منصة فواتير ذكية للفريلانسرز والشركات الصغيرة في الشرق الأوسط.",
  keywords: [
    "فواتير",
    "فاتورة",
    "فاتورة إلكترونية",
    "invoice",
    "ZATCA",
    "فوترني",
    "فواتير عربية",
    "Arabic invoice",
    "فريلانسر",
    "ضريبة القيمة المضافة",
    "VAT",
    "فاتورة مجانية",
    "إنشاء فاتورة",
    "فوترة إلكترونية",
    "هيئة الزكاة والضريبة",
  ],
  metadataBase: new URL("https://fawtarni.com"),
  openGraph: {
    title: "فوترني — أنشئ فواتير احترافية مجاناً",
    description:
      "منصة فواتير ذكية عربي/إنجليزي مع دعم ZATCA QR Code وتصدير PDF. مجاناً للفريلانسرز والشركات الصغيرة.",
    url: "https://fawtarni.com",
    siteName: "فوترني - Fawtarni",
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "فوترني — أنشئ فواتير احترافية مجاناً",
    description:
      "منصة فواتير ذكية عربي/إنجليزي مع دعم ZATCA QR Code وتصدير PDF فوري.",
  },
  alternates: {
    canonical: "https://fawtarni.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
