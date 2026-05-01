"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  getSavedInvoices,
  deleteInvoice,
  updateInvoiceStatus,
  getSavedClients,
  deleteClient,
  type SavedInvoice,
  type SavedClient,
} from "@/lib/storage";
import { CURRENCIES } from "@/lib/types";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const STATUS_MAP: Record<SavedInvoice["status"], { labelAr: string; labelEn: string; color: string }> = {
  draft: { labelAr: "مسودة", labelEn: "Draft", color: "bg-gray-100 text-gray-600" },
  sent: { labelAr: "مرسلة", labelEn: "Sent", color: "bg-blue-100 text-blue-700" },
  paid: { labelAr: "مدفوعة", labelEn: "Paid", color: "bg-emerald-100 text-emerald-700" },
  overdue: { labelAr: "متأخرة", labelEn: "Overdue", color: "bg-red-100 text-red-700" },
};

function formatAmount(amount: number, currency: string): string {
  const cur = CURRENCIES[currency];
  const formatted = amount.toFixed(2);
  return cur ? `${formatted} ${cur.symbol}` : formatted;
}

function StatCard({
  titleAr,
  titleEn,
  value,
  icon,
  color,
}: {
  titleAr: string;
  titleEn: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${color}`}>
          {icon}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500 mt-1">
        {titleAr} <span className="text-gray-300">/ {titleEn}</span>
      </p>
    </motion.div>
  );
}

type TabType = "invoices" | "clients";

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<SavedInvoice[]>([]);
  const [clients, setClients] = useState<SavedClient[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("invoices");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadedInvoices = getSavedInvoices();
    const loadedClients = getSavedClients();
    requestAnimationFrame(() => {
      setInvoices(loadedInvoices);
      setClients(loadedClients);
      setLoaded(true);
    });
  }, []);

  const handleDeleteInvoice = useCallback((id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفاتورة؟")) return;
    deleteInvoice(id);
    setInvoices(getSavedInvoices());
  }, []);

  const handleStatusChange = useCallback((id: string, status: SavedInvoice["status"]) => {
    updateInvoiceStatus(id, status);
    setInvoices(getSavedInvoices());
  }, []);

  const handleDeleteClient = useCallback((id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العميل؟")) return;
    deleteClient(id);
    setClients(getSavedClients());
  }, []);

  const filteredInvoices =
    statusFilter === "all" ? invoices : invoices.filter((i) => i.status === statusFilter);

  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const pendingAmount = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, i) => sum + i.totalAmount, 0);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-emerald-700 text-white py-4 px-6 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            فوترني <span className="text-emerald-200 text-sm font-normal">Fawtarni</span>
          </Link>
          <Link
            href="/create"
            className="px-5 py-2.5 bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl text-sm font-bold transition-colors shadow-sm"
          >
            + فاتورة جديدة
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            titleAr="إجمالي الفواتير"
            titleEn="Total Invoices"
            value={invoices.length}
            icon="📄"
            color="bg-emerald-50"
          />
          <StatCard
            titleAr="الإيرادات المحصلة"
            titleEn="Revenue"
            value={formatAmount(totalRevenue, "SAR")}
            icon="💰"
            color="bg-green-50"
          />
          <StatCard
            titleAr="مبالغ معلقة"
            titleEn="Pending"
            value={formatAmount(pendingAmount, "SAR")}
            icon="⏳"
            color="bg-amber-50"
          />
          <StatCard
            titleAr="العملاء"
            titleEn="Clients"
            value={clients.length}
            icon="👥"
            color="bg-blue-50"
          />
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "invoices"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            الفواتير ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab("clients")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "clients"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            العملاء ({clients.length})
          </button>
        </div>

        {/* Invoices Tab */}
        {activeTab === "invoices" && (
          <>
            {/* Status Filters */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {[
                { key: "all", label: "الكل" },
                { key: "draft", label: "مسودة" },
                { key: "sent", label: "مرسلة" },
                { key: "paid", label: "مدفوعة" },
                { key: "overdue", label: "متأخرة" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === f.key
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                      : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredInvoices.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm"
              >
                <div className="text-5xl mb-4">📄</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {invoices.length === 0 ? "مفيش فواتير لسه" : "مفيش فواتير بالفلتر ده"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {invoices.length === 0
                    ? "أنشئ أول فاتورة وابدأ تتبع إيراداتك"
                    : "جرب فلتر تاني"}
                </p>
                {invoices.length === 0 && (
                  <Link
                    href="/create"
                    className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                  >
                    + أنشئ فاتورة جديدة
                  </Link>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-3"
              >
                {filteredInvoices.map((inv) => {
                  const statusInfo = STATUS_MAP[inv.status];
                  return (
                    <motion.div
                      key={inv.id}
                      variants={fadeInUp}
                      className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-800 text-sm" dir="ltr">
                            {inv.invoiceNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusInfo.color}`}
                          >
                            {statusInfo.labelAr}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {inv.buyerName || inv.buyerNameEn || "بدون عميل"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{inv.issueDate}</p>
                      </div>
                      <div className="text-left" dir="ltr">
                        <p className="font-bold text-gray-800">
                          {formatAmount(inv.totalAmount, inv.currency)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <select
                          value={inv.status}
                          onChange={(e) =>
                            handleStatusChange(inv.id, e.target.value as SavedInvoice["status"])
                          }
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="draft">مسودة</option>
                          <option value="sent">مرسلة</option>
                          <option value="paid">مدفوعة</option>
                          <option value="overdue">متأخرة</option>
                        </select>
                        <Link
                          href={`/create?edit=${inv.id}`}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-medium transition-colors"
                        >
                          تعديل
                        </Link>
                        <button
                          onClick={() => handleDeleteInvoice(inv.id)}
                          className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors"
                        >
                          حذف
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </>
        )}

        {/* Clients Tab */}
        {activeTab === "clients" && (
          <>
            {clients.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm"
              >
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">مفيش عملاء محفوظين</h3>
                <p className="text-gray-500 mb-6">
                  لما تنشئ فاتورة، اضغط &quot;حفظ العميل&quot; علشان يتحفظ هنا
                </p>
                <Link
                  href="/create"
                  className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                >
                  + أنشئ فاتورة جديدة
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {clients.map((client) => (
                  <motion.div
                    key={client.id}
                    variants={fadeInUp}
                    className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-800">{client.name}</h4>
                        {client.nameEn && (
                          <p className="text-sm text-gray-400">{client.nameEn}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-red-400 hover:text-red-600 text-sm transition-colors"
                        title="حذف"
                      >
                        ✕
                      </button>
                    </div>
                    {client.email && (
                      <p className="text-xs text-gray-500 mb-1" dir="ltr">
                        {client.email}
                      </p>
                    )}
                    {client.phone && (
                      <p className="text-xs text-gray-500 mb-1" dir="ltr">
                        {client.phone}
                      </p>
                    )}
                    {client.taxNumber && (
                      <p className="text-xs text-gray-400">
                        الرقم الضريبي: <span dir="ltr">{client.taxNumber}</span>
                      </p>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
