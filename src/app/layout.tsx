import type { Metadata } from "next";
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
