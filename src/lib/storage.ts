const KEYS = {
  SELLER_PROFILE: "fawtarni_seller_profile",
  INVOICES: "fawtarni_invoices",
  CLIENTS: "fawtarni_clients",
} as const;

export interface SellerProfile {
  name: string;
  nameEn: string;
  address: string;
  taxNumber: string;
  phone: string;
  email: string;
  logo: string; // base64 data URL
}

export interface SavedClient {
  id: string;
  name: string;
  nameEn: string;
  address: string;
  taxNumber: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface SavedInvoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  buyerName: string;
  buyerNameEn: string;
  totalAmount: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "overdue";
  createdAt: string;
  data: string; // JSON stringified InvoiceData
}

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable
  }
}

// --- Seller Profile ---

export function getSellerProfile(): SellerProfile | null {
  return safeGet<SellerProfile | null>(KEYS.SELLER_PROFILE, null);
}

export function saveSellerProfile(profile: SellerProfile): void {
  safeSet(KEYS.SELLER_PROFILE, profile);
}

// --- Invoices ---

export function getSavedInvoices(): SavedInvoice[] {
  return safeGet<SavedInvoice[]>(KEYS.INVOICES, []);
}

export function saveInvoice(invoice: SavedInvoice): void {
  const invoices = getSavedInvoices();
  const idx = invoices.findIndex((i) => i.id === invoice.id);
  if (idx >= 0) {
    invoices[idx] = invoice;
  } else {
    invoices.unshift(invoice);
  }
  safeSet(KEYS.INVOICES, invoices);
}

export function deleteInvoice(id: string): void {
  const invoices = getSavedInvoices().filter((i) => i.id !== id);
  safeSet(KEYS.INVOICES, invoices);
}

export function getInvoiceById(id: string): SavedInvoice | undefined {
  return getSavedInvoices().find((i) => i.id === id);
}

export function updateInvoiceStatus(id: string, status: SavedInvoice["status"]): void {
  const invoices = getSavedInvoices();
  const invoice = invoices.find((i) => i.id === id);
  if (invoice) {
    invoice.status = status;
    safeSet(KEYS.INVOICES, invoices);
  }
}

// --- Clients ---

export function getSavedClients(): SavedClient[] {
  return safeGet<SavedClient[]>(KEYS.CLIENTS, []);
}

export function saveClient(client: SavedClient): void {
  const clients = getSavedClients();
  const idx = clients.findIndex((c) => c.id === client.id);
  if (idx >= 0) {
    clients[idx] = client;
  } else {
    clients.unshift(client);
  }
  safeSet(KEYS.CLIENTS, clients);
}

export function deleteClient(id: string): void {
  const clients = getSavedClients().filter((c) => c.id !== id);
  safeSet(KEYS.CLIENTS, clients);
}
