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
  sellerLogo: string;
  sellerName: string;
  sellerNameEn: string;
  sellerAddress: string;
  sellerTaxNumber: string;
  sellerPhone: string;
  sellerEmail: string;
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

const INVOICE_COUNTER_KEY = "fawtarni_invoice_counter";
const SELLER_DATA_KEY = "fawtarni_seller_data";

export function generateInvoiceNumber(): string {
  if (typeof window === "undefined") {
    return "INV-0001";
  }
  const counter = parseInt(localStorage.getItem(INVOICE_COUNTER_KEY) || "0", 10) + 1;
  localStorage.setItem(INVOICE_COUNTER_KEY, String(counter));
  return `INV-${String(counter).padStart(4, "0")}`;
}

export interface SellerData {
  sellerLogo: string;
  sellerName: string;
  sellerNameEn: string;
  sellerAddress: string;
  sellerTaxNumber: string;
  sellerPhone: string;
  sellerEmail: string;
}

export function saveSellerData(data: SellerData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SELLER_DATA_KEY, JSON.stringify(data));
}

export function loadSellerData(): SellerData | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(SELLER_DATA_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as SellerData;
  } catch {
    return null;
  }
}

export function createEmptyInvoice(): InvoiceData {
  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 30);

  const savedSeller = loadSellerData();

  return {
    invoiceNumber: generateInvoiceNumber(),
    issueDate: today.toISOString().split("T")[0],
    dueDate: due.toISOString().split("T")[0],
    currency: "SAR",
    language: "both",
    sellerLogo: savedSeller?.sellerLogo || "",
    sellerName: savedSeller?.sellerName || "",
    sellerNameEn: savedSeller?.sellerNameEn || "",
    sellerAddress: savedSeller?.sellerAddress || "",
    sellerTaxNumber: savedSeller?.sellerTaxNumber || "",
    sellerPhone: savedSeller?.sellerPhone || "",
    sellerEmail: savedSeller?.sellerEmail || "",
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
