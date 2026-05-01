export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
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

import { peekNextInvoiceNumber, loadSellerData, loadSellerLogo } from "./storage";

export function generateInvoiceNumber(): string {
  return peekNextInvoiceNumber();
}

export function createEmptyInvoice(): InvoiceData {
  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 30);

  const saved = loadSellerData();
  const logo = loadSellerLogo();

  return {
    invoiceNumber: generateInvoiceNumber(),
    issueDate: today.toISOString().split("T")[0],
    dueDate: due.toISOString().split("T")[0],
    currency: "SAR",
    language: "both",
    sellerName: saved?.sellerName ?? "",
    sellerNameEn: saved?.sellerNameEn ?? "",
    sellerAddress: saved?.sellerAddress ?? "",
    sellerTaxNumber: saved?.sellerTaxNumber ?? "",
    sellerPhone: saved?.sellerPhone ?? "",
    sellerEmail: saved?.sellerEmail ?? "",
    sellerLogo: logo ?? "",
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
