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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "فوترني - Fawtarni",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "منصة فواتير عربية ذكية مجانية للفريلانسرز والشركات الصغيرة في الشرق الأوسط — دعم 18 دولة وضرائب متعددة",
  inLanguage: ["ar", "en"],
  author: {
    "@type": "Organization",
    name: "Fawtarni",
    url: "https://fawtarni.com",
  },
  featureList: [
    "Bilingual Arabic/English invoices",
    "ZATCA QR Code",
    "PDF export",
    "18 MENA countries tax support",
    "Email and WhatsApp sharing",
    "Analytics and Excel export",
    "PWA offline support",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
