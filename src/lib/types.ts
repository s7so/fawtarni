export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CountryTax {
  code: string;
  nameAr: string;
  nameEn: string;
  taxRate: number;
  taxNameAr: string;
  taxNameEn: string;
  currency: string;
}

export const COUNTRIES: CountryTax[] = [
  { code: "SA", nameAr: "السعودية", nameEn: "Saudi Arabia", taxRate: 15, taxNameAr: "ضريبة القيمة المضافة", taxNameEn: "VAT", currency: "SAR" },
  { code: "EG", nameAr: "مصر", nameEn: "Egypt", taxRate: 14, taxNameAr: "ضريبة القيمة المضافة", taxNameEn: "VAT", currency: "EGP" },
  { code: "AE", nameAr: "الإمارات", nameEn: "UAE", taxRate: 5, taxNameAr: "ضريبة القيمة المضافة", taxNameEn: "VAT", currency: "AED" },
  { code: "KW", nameAr: "الكويت", nameEn: "Kuwait", taxRate: 0, taxNameAr: "بدون ضريبة", taxNameEn: "No Tax", currency: "KWD" },
  { code: "QA", nameAr: "قطر", nameEn: "Qatar", taxRate: 0, taxNameAr: "بدون ضريبة", taxNameEn: "No Tax", currency: "QAR" },
  { code: "BH", nameAr: "البحرين", nameEn: "Bahrain", taxRate: 10, taxNameAr: "ضريبة القيمة المضافة", taxNameEn: "VAT", currency: "BHD" },
  { code: "OM", nameAr: "عُمان", nameEn: "Oman", taxRate: 5, taxNameAr: "ضريبة القيمة المضافة", taxNameEn: "VAT", currency: "OMR" },
  { code: "JO", nameAr: "الأردن", nameEn: "Jordan", taxRate: 16, taxNameAr: "ضريبة المبيعات", taxNameEn: "Sales Tax", currency: "JOD" },
  { code: "IQ", nameAr: "العراق", nameEn: "Iraq", taxRate: 15, taxNameAr: "ضريبة المبيعات", taxNameEn: "Sales Tax", currency: "USD" },
  { code: "LB", nameAr: "لبنان", nameEn: "Lebanon", taxRate: 11, taxNameAr: "ضريبة القيمة المضافة", taxNameEn: "VAT", currency: "USD" },
  { code: "PS", nameAr: "فلسطين", nameEn: "Palestine", taxRate: 16, taxNameAr: "ضريبة القيمة المضافة", taxNameEn: "VAT", currency: "USD" },
  { code: "LY", nameAr: "ليبيا", nameEn: "Libya", taxRate: 0, taxNameAr: "بدون ضريبة", taxNameEn: "No Tax", currency: "USD" },
  { code: "SD", nameAr: "السودان", nameEn: "Sudan", taxRate: 17, taxNameAr: "ضريبة القيمة المضافة", taxNameEn: "VAT", currency: "USD" },
  { code: "TN", nameAr: "تونس", nameEn: "Tunisia", taxRate: 19, taxNameAr: "ضريبة القيمة المضافة", taxNameEn: "VAT", currency: "USD" },
  { code: "DZ", nameAr: "الجزائر", nameEn: "Algeria", taxRate: 19, taxNameAr: "ضريبة القيمة المضافة", taxNameEn: "VAT", currency: "USD" },
  { code: "MA", nameAr: "المغرب", nameEn: "Morocco", taxRate: 20, taxNameAr: "ضريبة القيمة المضافة", taxNameEn: "VAT", currency: "USD" },
  { code: "YE", nameAr: "اليمن", nameEn: "Yemen", taxRate: 5, taxNameAr: "ضريبة المبيعات", taxNameEn: "Sales Tax", currency: "USD" },
  { code: "OTHER", nameAr: "أخرى", nameEn: "Other", taxRate: 0, taxNameAr: "ضريبة", taxNameEn: "Tax", currency: "USD" },
];

export function getCountryByCode(code: string): CountryTax | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  country: string;
  language: "ar" | "en" | "both";
  sellerName: string;
  sellerNameEn: string;
  sellerAddress: string;
  sellerTaxNumber: string;
  sellerPhone: string;
  sellerEmail: string;
  sellerLogo: string;
  buyerName: string;
  buyerNameEn: string;
  buyerAddress: string;
  buyerTaxNumber: string;
  buyerPhone: string;
  buyerEmail: string;
  items: InvoiceItem[];
  taxRate: number;
  discount: number;
  notes: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
}

export const CURRENCIES: Record<string, { symbol: string; nameAr: string; nameEn: string }> = {
  SAR: { symbol: "ر.س", nameAr: "ريال سعودي", nameEn: "Saudi Riyal" },
  EGP: { symbol: "ج.م", nameAr: "جنيه مصري", nameEn: "Egyptian Pound" },
  AED: { symbol: "د.إ", nameAr: "درهم إماراتي", nameEn: "UAE Dirham" },
  USD: { symbol: "$", nameAr: "دولار أمريكي", nameEn: "US Dollar" },
  EUR: { symbol: "€", nameAr: "يورو", nameEn: "Euro" },
  KWD: { symbol: "د.ك", nameAr: "دينار كويتي", nameEn: "Kuwaiti Dinar" },
  QAR: { symbol: "ر.ق", nameAr: "ريال قطري", nameEn: "Qatari Riyal" },
  BHD: { symbol: "د.ب", nameAr: "دينار بحريني", nameEn: "Bahraini Dinar" },
  OMR: { symbol: "ر.ع", nameAr: "ريال عماني", nameEn: "Omani Rial" },
  JOD: { symbol: "د.أ", nameAr: "دينار أردني", nameEn: "Jordanian Dinar" },
};

export function generateInvoiceNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `INV-${y}${m}${d}-${rand}`;
}

export function createEmptyInvoice(): InvoiceData {
  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 30);

  return {
    invoiceNumber: generateInvoiceNumber(),
    issueDate: today.toISOString().split("T")[0],
    dueDate: due.toISOString().split("T")[0],
    currency: "SAR",
    country: "SA",
    language: "both",
    sellerName: "",
    sellerNameEn: "",
    sellerAddress: "",
    sellerTaxNumber: "",
    sellerPhone: "",
    sellerEmail: "",
    sellerLogo: "",
    buyerName: "",
    buyerNameEn: "",
    buyerAddress: "",
    buyerTaxNumber: "",
    buyerPhone: "",
    buyerEmail: "",
    items: [
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ],
    taxRate: 15,
    discount: 0,
    notes: "",
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0,
  };
}
