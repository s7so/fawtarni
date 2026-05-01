const SELLER_DATA_KEY = "fawtarni_seller_data";
const INVOICE_COUNTER_KEY = "fawtarni_invoice_counter";
const INVOICE_HISTORY_KEY = "fawtarni_invoice_history";
const SELLER_LOGO_KEY = "fawtarni_seller_logo";

export interface SellerData {
  sellerName: string;
  sellerNameEn: string;
  sellerAddress: string;
  sellerTaxNumber: string;
  sellerPhone: string;
  sellerEmail: string;
}

export interface SavedInvoice {
  id: string;
  invoiceNumber: string;
  buyerName: string;
  totalAmount: number;
  currency: string;
  issueDate: string;
  savedAt: string;
  data: string;
}

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage full or unavailable
  }
}

export function saveSellerData(data: SellerData): void {
  safeSet(SELLER_DATA_KEY, JSON.stringify(data));
}

export function loadSellerData(): SellerData | null {
  const raw = safeGet(SELLER_DATA_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SellerData;
  } catch {
    return null;
  }
}

export function getNextInvoiceNumber(): string {
  const raw = safeGet(INVOICE_COUNTER_KEY);
  const counter = raw ? Number(raw) + 1 : 1;
  safeSet(INVOICE_COUNTER_KEY, String(counter));
  return `INV-${String(counter).padStart(4, "0")}`;
}

export function saveSellerLogo(dataUrl: string): void {
  safeSet(SELLER_LOGO_KEY, dataUrl);
}

export function loadSellerLogo(): string | null {
  return safeGet(SELLER_LOGO_KEY);
}

export function removeSellerLogo(): void {
  try {
    localStorage.removeItem(SELLER_LOGO_KEY);
  } catch {
    // ignore
  }
}

export function saveInvoice(invoice: SavedInvoice): void {
  const history = loadInvoiceHistory();
  const existing = history.findIndex((h) => h.id === invoice.id);
  if (existing >= 0) {
    history[existing] = invoice;
  } else {
    history.unshift(invoice);
  }
  // keep last 100 invoices
  const trimmed = history.slice(0, 100);
  safeSet(INVOICE_HISTORY_KEY, JSON.stringify(trimmed));
}

export function loadInvoiceHistory(): SavedInvoice[] {
  const raw = safeGet(INVOICE_HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SavedInvoice[];
  } catch {
    return [];
  }
}

export function deleteInvoice(id: string): void {
  const history = loadInvoiceHistory().filter((h) => h.id !== id);
  safeSet(INVOICE_HISTORY_KEY, JSON.stringify(history));
}

export function loadInvoiceById(id: string): SavedInvoice | null {
  const history = loadInvoiceHistory();
  return history.find((h) => h.id === id) ?? null;
}
