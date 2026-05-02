import { getSupabase, supabaseEnabled } from "./supabase";
import type { SavedInvoice, SavedClient, SellerProfile } from "./storage";

// ============================================================
// Cloud Storage — Supabase-backed persistence
// Falls back gracefully when Supabase is not configured.
// ============================================================

// --- Profiles ---

export async function getCloudProfile(): Promise<SellerProfile | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!data) return null;

  return {
    name: data.seller_name,
    nameEn: data.seller_name_en,
    address: data.seller_address,
    taxNumber: data.seller_tax_number,
    phone: data.seller_phone,
    email: data.seller_email,
    logo: data.seller_logo,
  };
}

export async function saveCloudProfile(profile: SellerProfile): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("profiles")
    .update({
      seller_name: profile.name,
      seller_name_en: profile.nameEn,
      seller_address: profile.address,
      seller_tax_number: profile.taxNumber,
      seller_phone: profile.phone,
      seller_email: profile.email,
      seller_logo: profile.logo,
    })
    .eq("id", user.id);

  return !error;
}

// --- Invoices ---

export async function getCloudInvoices(): Promise<SavedInvoice[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    invoiceNumber: row.invoice_number,
    issueDate: row.issue_date,
    dueDate: row.due_date,
    buyerName: row.buyer_name,
    buyerNameEn: row.buyer_name_en,
    totalAmount: Number(row.total_amount),
    currency: row.currency,
    status: row.status as SavedInvoice["status"],
    createdAt: row.created_at,
    data: typeof row.data === "string" ? row.data : JSON.stringify(row.data),
  }));
}

export async function saveCloudInvoice(invoice: SavedInvoice): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const row = {
    id: invoice.id,
    user_id: user.id,
    invoice_number: invoice.invoiceNumber,
    issue_date: invoice.issueDate,
    due_date: invoice.dueDate,
    buyer_name: invoice.buyerName,
    buyer_name_en: invoice.buyerNameEn,
    total_amount: invoice.totalAmount,
    currency: invoice.currency,
    status: invoice.status,
    data: JSON.parse(invoice.data),
  };

  const { error } = await supabase
    .from("invoices")
    .upsert(row, { onConflict: "id" });

  return !error;
}

export async function deleteCloudInvoice(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  return !error;
}

export async function updateCloudInvoiceStatus(
  id: string,
  status: SavedInvoice["status"]
): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("invoices")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id);

  return !error;
}

// --- Clients ---

export async function getCloudClients(): Promise<SavedClient[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    nameEn: row.name_en,
    address: row.address,
    taxNumber: row.tax_number,
    phone: row.phone,
    email: row.email,
    createdAt: row.created_at,
  }));
}

export async function saveCloudClient(client: SavedClient): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const row = {
    id: client.id,
    user_id: user.id,
    name: client.name,
    name_en: client.nameEn,
    address: client.address,
    tax_number: client.taxNumber,
    phone: client.phone,
    email: client.email,
  };

  const { error } = await supabase
    .from("clients")
    .upsert(row, { onConflict: "id" });

  return !error;
}

export async function deleteCloudClient(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  return !error;
}

// --- Plan enforcement ---

export async function getMonthlyInvoiceCount(): Promise<number> {
  const supabase = getSupabase();
  if (!supabase) return 0;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", startOfMonth.toISOString());

  return count ?? 0;
}

export async function getUserPlan(): Promise<"free" | "pro" | "business"> {
  const supabase = getSupabase();
  if (!supabase) return "free";

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "free";

  const { data } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  return (data?.plan as "free" | "pro" | "business") ?? "free";
}

export const PLAN_LIMITS = {
  free: { invoicesPerMonth: 5 },
  pro: { invoicesPerMonth: Infinity },
  business: { invoicesPerMonth: Infinity },
} as const;

export async function canCreateInvoice(): Promise<{ allowed: boolean; remaining: number }> {
  const plan = await getUserPlan();
  const limit = PLAN_LIMITS[plan].invoicesPerMonth;

  if (limit === Infinity) return { allowed: true, remaining: Infinity };

  const count = await getMonthlyInvoiceCount();
  return { allowed: count < limit, remaining: Math.max(0, limit - count) };
}

// --- Migration helper: sync localStorage to cloud ---

export async function migrateLocalToCloud(): Promise<{
  invoices: number;
  clients: number;
  profile: boolean;
}> {
  if (!supabaseEnabled) return { invoices: 0, clients: 0, profile: false };

  const {
    getSavedInvoices,
    getSavedClients,
    getSellerProfile,
  } = await import("./storage");

  let invoiceCount = 0;
  let clientCount = 0;
  let profileMigrated = false;

  // Migrate profile
  const profile = getSellerProfile();
  if (profile && profile.name) {
    const ok = await saveCloudProfile(profile);
    if (ok) profileMigrated = true;
  }

  // Migrate invoices
  const invoices = getSavedInvoices();
  for (const inv of invoices) {
    const ok = await saveCloudInvoice(inv);
    if (ok) invoiceCount++;
  }

  // Migrate clients
  const clients = getSavedClients();
  for (const client of clients) {
    const ok = await saveCloudClient(client);
    if (ok) clientCount++;
  }

  return { invoices: invoiceCount, clients: clientCount, profile: profileMigrated };
}
