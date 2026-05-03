"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { InvoiceData, InvoiceItem, CURRENCIES, COUNTRIES, getCountryByCode, createEmptyInvoice } from "@/lib/types";
import InvoicePreview, { type TemplateName, TEMPLATES } from "./InvoicePreview";
import ShareInvoiceDialog from "./ShareInvoiceDialog";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import {
  getSellerProfile,
  saveSellerProfile,
  getSavedClients,
  saveClient,
  saveInvoice,
  getInvoiceById,
  type SellerProfile,
  type SavedClient,
  type SavedInvoice,
} from "@/lib/storage";
import {
  saveCloudInvoice,
  saveCloudClient,
  saveCloudProfile,
  getCloudProfile,
  getCloudClients,
  canCreateInvoice,
} from "@/lib/cloud-storage";
import { useAuth } from "@/lib/auth-context";
import { supabaseEnabled } from "@/lib/supabase";

function SectionTitle({ ar, en }: { ar: string; en: string }) {
  return (
    <h2 className="text-lg font-bold text-emerald-700 border-b-2 border-emerald-200 pb-2 mb-4">
      {ar} <span className="text-gray-400 font-normal text-sm">/ {en}</span>
    </h2>
  );
}

function FormField({
  label,
  labelEn,
  value,
  onChange,
  placeholder,
  type = "text",
  dir,
  required,
  error,
}: {
  label: string;
  labelEn: string;
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  dir?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} <span className="text-gray-400 text-xs">/ {labelEn}</span>
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors ${
          error ? "border-red-400 bg-red-50" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function SavedBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {label}
    </span>
  );
}

interface ValidationErrors {
  sellerName?: string;
  items?: string;
}

export default function InvoiceForm({ editInvoiceId }: { editInvoiceId?: string }) {
  const { isAuthenticated } = useAuth();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [generating, setGenerating] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);
  const [savedInvoiceMsg, setSavedInvoiceMsg] = useState(false);
  const [clients, setClients] = useState<SavedClient[]>([]);
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [planLimitReached, setPlanLimitReached] = useState(false);
  const [template, setTemplate] = useState<TemplateName>("classic");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function init() {
      let result: InvoiceData;

      if (editInvoiceId) {
        const saved = getInvoiceById(editInvoiceId);
        if (saved) {
          try {
            const data = JSON.parse(saved.data) as InvoiceData;
            result = { ...data, sellerLogo: data.sellerLogo || "" };
          } catch {
            result = createEmptyInvoice();
          }
        } else {
          result = createEmptyInvoice();
        }
      } else {
        const newInvoice = createEmptyInvoice();
        // Try cloud profile first, fall back to localStorage
        let profile = null;
        if (supabaseEnabled && isAuthenticated) {
          profile = await getCloudProfile();
        }
        if (!profile) profile = getSellerProfile();
        if (profile) {
          newInvoice.sellerName = profile.name;
          newInvoice.sellerNameEn = profile.nameEn;
          newInvoice.sellerAddress = profile.address;
          newInvoice.sellerTaxNumber = profile.taxNumber;
          newInvoice.sellerPhone = profile.phone;
          newInvoice.sellerEmail = profile.email;
          newInvoice.sellerLogo = profile.logo;
        }
        result = newInvoice;

        // Check plan limits for new invoices
        if (supabaseEnabled && isAuthenticated) {
          const { allowed } = await canCreateInvoice();
          if (!allowed) setPlanLimitReached(true);
        }
      }

      let loadedClients: SavedClient[];
      if (supabaseEnabled && isAuthenticated) {
        loadedClients = await getCloudClients();
      } else {
        loadedClients = getSavedClients();
      }

      requestAnimationFrame(() => {
        setInvoice(result);
        setClients(loadedClients);
      });
    }

    init();
  }, [editInvoiceId, isAuthenticated]);

  const updateField = useCallback(
    <K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => {
      setInvoice((prev) => (prev ? { ...prev, [field]: value } : prev));
      if (field === "sellerName" && errors.sellerName) {
        setErrors((e) => ({ ...e, sellerName: undefined }));
      }
    },
    [errors.sellerName]
  );

  const handleCountryChange = useCallback(
    (countryCode: string) => {
      const country = getCountryByCode(countryCode);
      if (!country) return;
      setInvoice((prev) => {
        if (!prev) return prev;
        const items = prev.items;
        const discount = prev.discount;
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const afterDiscount = subtotal - discount;
        const taxAmount = (afterDiscount * country.taxRate) / 100;
        const totalAmount = afterDiscount + taxAmount;
        return {
          ...prev,
          country: countryCode,
          currency: country.currency,
          taxRate: country.taxRate,
          subtotal,
          taxAmount,
          totalAmount,
        };
      });
    },
    []
  );

  const recalculate = useCallback((items: InvoiceItem[], taxRate: number, discount: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const afterDiscount = subtotal - discount;
    const taxAmount = (afterDiscount * taxRate) / 100;
    const totalAmount = afterDiscount + taxAmount;
    return { subtotal, taxAmount, totalAmount };
  }, []);

  const updateItem = useCallback(
    (id: string, field: keyof InvoiceItem, value: string | number) => {
      setInvoice((prev) => {
        if (!prev) return prev;
        const items = prev.items.map((item) => {
          if (item.id !== id) return item;
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updated.total = Number(updated.quantity) * Number(updated.unitPrice);
          }
          return updated;
        });
        const totals = recalculate(items, prev.taxRate, prev.discount);
        return { ...prev, items, ...totals };
      });
      if (errors.items) {
        setErrors((e) => ({ ...e, items: undefined }));
      }
    },
    [recalculate, errors.items]
  );

  const addItem = useCallback(() => {
    setInvoice((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: [
          ...prev.items,
          { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, total: 0 },
        ],
      };
    });
  }, []);

  const removeItem = useCallback(
    (id: string) => {
      setInvoice((prev) => {
        if (!prev) return prev;
        const items = prev.items.filter((item) => item.id !== id);
        if (items.length === 0) return prev;
        const totals = recalculate(items, prev.taxRate, prev.discount);
        return { ...prev, items, ...totals };
      });
    },
    [recalculate]
  );

  const updateTaxRate = useCallback(
    (rate: string) => {
      const taxRate = Number(rate) || 0;
      setInvoice((prev) => {
        if (!prev) return prev;
        const totals = recalculate(prev.items, taxRate, prev.discount);
        return { ...prev, taxRate, ...totals };
      });
    },
    [recalculate]
  );

  const updateDiscount = useCallback(
    (val: string) => {
      const discount = Number(val) || 0;
      setInvoice((prev) => {
        if (!prev) return prev;
        const totals = recalculate(prev.items, prev.taxRate, discount);
        return { ...prev, discount, ...totals };
      });
    },
    [recalculate]
  );

  const handleSaveSellerProfile = useCallback(async () => {
    if (!invoice) return;
    const profile: SellerProfile = {
      name: invoice.sellerName,
      nameEn: invoice.sellerNameEn,
      address: invoice.sellerAddress,
      taxNumber: invoice.sellerTaxNumber,
      phone: invoice.sellerPhone,
      email: invoice.sellerEmail,
      logo: invoice.sellerLogo,
    };
    saveSellerProfile(profile);
    if (supabaseEnabled && isAuthenticated) {
      await saveCloudProfile(profile);
    }
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2000);
  }, [invoice, isAuthenticated]);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      alert("حجم اللوجو لازم يكون أقل من 500KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setInvoice((prev) => (prev ? { ...prev, sellerLogo: result } : prev));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemoveLogo = useCallback(() => {
    setInvoice((prev) => (prev ? { ...prev, sellerLogo: "" } : prev));
    if (logoInputRef.current) logoInputRef.current.value = "";
  }, []);

  const handleSelectClient = useCallback(
    (client: SavedClient) => {
      if (!invoice) return;
      setInvoice({
        ...invoice,
        buyerName: client.name,
        buyerNameEn: client.nameEn,
        buyerAddress: client.address,
        buyerTaxNumber: client.taxNumber,
        buyerPhone: client.phone,
        buyerEmail: client.email,
      });
      setShowClientPicker(false);
    },
    [invoice]
  );

  const handleSaveClient = useCallback(async () => {
    if (!invoice || !invoice.buyerName) return;
    const client: SavedClient = {
      id: crypto.randomUUID(),
      name: invoice.buyerName,
      nameEn: invoice.buyerNameEn,
      address: invoice.buyerAddress,
      taxNumber: invoice.buyerTaxNumber,
      phone: invoice.buyerPhone,
      email: invoice.buyerEmail,
      createdAt: new Date().toISOString(),
    };
    saveClient(client);
    if (supabaseEnabled && isAuthenticated) {
      await saveCloudClient(client);
      const cloudClients = await getCloudClients();
      setClients(cloudClients);
    } else {
      setClients(getSavedClients());
    }
  }, [invoice, isAuthenticated]);

  const validate = useCallback((): boolean => {
    if (!invoice) return false;
    const newErrors: ValidationErrors = {};

    if (!invoice.sellerName.trim()) {
      newErrors.sellerName = "اسم البائع مطلوب";
    }

    const hasValidItem = invoice.items.some(
      (item) => item.description.trim() && item.unitPrice > 0
    );
    if (!hasValidItem) {
      newErrors.items = "أضف بند واحد على الأقل بوصف وسعر";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [invoice]);

  const handleSaveInvoice = useCallback(
    async (status: SavedInvoice["status"] = "draft") => {
      if (!invoice) return;
      if (!validate()) return;

      if (planLimitReached && !editInvoiceId) {
        alert("وصلت للحد الأقصى من الفواتير الشهرية. رقّي باقتك لإنشاء فواتير أكتر.");
        return;
      }

      const saved: SavedInvoice = {
        id: editInvoiceId || crypto.randomUUID(),
        invoiceNumber: invoice.invoiceNumber,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        buyerName: invoice.buyerName || invoice.buyerNameEn || "—",
        buyerNameEn: invoice.buyerNameEn,
        totalAmount: invoice.totalAmount,
        currency: invoice.currency,
        status,
        createdAt: new Date().toISOString(),
        data: JSON.stringify(invoice),
      };
      saveInvoice(saved);
      if (supabaseEnabled && isAuthenticated) {
        await saveCloudInvoice(saved);
      }
      setSavedInvoiceMsg(true);
      setTimeout(() => setSavedInvoiceMsg(false), 2000);
    },
    [invoice, editInvoiceId, validate, isAuthenticated, planLimitReached]
  );

  const handleDownloadPDF = useCallback(async () => {
    if (!invoice) return;
    if (!validate()) return;

    // Auto-save before downloading
    handleSaveInvoice("sent");

    setGenerating(true);
    try {
      const wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.left = "-9999px";
      wrapper.style.top = "0";
      wrapper.style.width = "794px";
      wrapper.style.backgroundColor = "#ffffff";
      wrapper.style.zIndex = "-9999";

      const element = document.getElementById("invoice-preview");
      if (!element) return;

      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.width = "794px";
      clone.style.maxWidth = "794px";
      clone.style.margin = "0";
      clone.style.padding = "32px";
      clone.style.boxSizing = "border-box";
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: 794,
      });

      document.body.removeChild(wrapper);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("حدث خطأ أثناء إنشاء الـ PDF. يرجى المحاولة مرة أخرى.");
    } finally {
      setGenerating(false);
    }
  }, [invoice, validate, handleSaveInvoice]);

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-emerald-700 text-white py-3 px-4 sm:py-4 sm:px-6 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl sm:text-2xl font-bold">
            فوترني <span className="text-emerald-200 text-xs sm:text-sm font-normal">Fawtarni</span>
          </Link>
          <div className="flex gap-2 sm:gap-3 items-center">
            <Link
              href="/dashboard"
              className="px-3 py-2 text-emerald-200 hover:text-white text-sm transition-colors hidden sm:inline"
            >
              لوحة التحكم
            </Link>
            {/* Tab Switcher */}
            <div className="flex bg-emerald-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("form")}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "form"
                    ? "bg-white text-emerald-700"
                    : "text-emerald-200 hover:text-white"
                }`}
              >
                تعديل
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "preview"
                    ? "bg-white text-emerald-700"
                    : "text-emerald-200 hover:text-white"
                }`}
              >
                معاينة
              </button>
            </div>
            <button
              onClick={() => handleSaveInvoice("draft")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 text-white rounded-lg text-sm font-bold transition-colors hidden sm:inline-block"
            >
              {savedInvoiceMsg ? "تم الحفظ!" : "حفظ"}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={generating}
              className="px-3 sm:px-4 py-2 bg-white text-emerald-700 hover:bg-emerald-50 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 hidden sm:inline-block"
            >
              {generating ? "جاري..." : "تحميل PDF"}
            </button>
            <button
              onClick={() => setShowShareDialog(true)}
              className="px-3 sm:px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold transition-colors hidden sm:inline-block"
            >
              إرسال
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3 sm:hidden z-50 safe-area-bottom">
        <button
          onClick={() => handleSaveInvoice("draft")}
          className="flex-1 py-3 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-bold transition-colors"
        >
          {savedInvoiceMsg ? "تم الحفظ!" : "حفظ"}
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={generating}
          className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
        >
          {generating ? "جاري..." : "PDF"}
        </button>
        <button
          onClick={() => setShowShareDialog(true)}
          className="flex-1 py-3 bg-amber-500 text-white rounded-xl text-sm font-bold transition-colors"
        >
          إرسال
        </button>
      </div>

      {/* Hidden preview for PDF generation (always in DOM) */}
      {activeTab !== "preview" && (
        <div className="fixed left-[-9999px] top-0" aria-hidden="true">
          <InvoicePreview invoice={invoice} template={template} />
        </div>
      )}

      <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-24 sm:pb-6">
        {/* Plan Limit Banner */}
        {planLimitReached && !editInvoiceId && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-amber-800 text-sm">وصلت للحد الأقصى (5 فواتير/شهر)</p>
              <p className="text-amber-600 text-xs mt-1">رقّي باقتك لإنشاء فواتير غير محدودة</p>
            </div>
            <Link
              href="/pricing"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold hover:bg-amber-700 transition-colors"
            >
              ترقية الباقة
            </Link>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === "preview" && (
          <div className="mb-6">
            {/* Template Selector */}
            <div className="flex gap-3 mb-4 justify-center">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    template === t.id
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
                  }`}
                >
                  {t.nameAr} <span className="text-xs opacity-70">/ {t.nameEn}</span>
                </button>
              ))}
            </div>
            <InvoicePreview invoice={invoice} template={template} />
          </div>
        )}

        {/* Form Tab */}
        {activeTab === "form" && (
          <div className="space-y-6">
            {/* Invoice Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <SectionTitle ar="إعدادات الفاتورة" en="Invoice Settings" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  label="رقم الفاتورة"
                  labelEn="Invoice No."
                  value={invoice.invoiceNumber}
                  onChange={(v) => updateField("invoiceNumber", v)}
                  dir="ltr"
                />
                <FormField
                  label="تاريخ الإصدار"
                  labelEn="Issue Date"
                  value={invoice.issueDate}
                  onChange={(v) => updateField("issueDate", v)}
                  type="date"
                />
                <FormField
                  label="تاريخ الاستحقاق"
                  labelEn="Due Date"
                  value={invoice.dueDate}
                  onChange={(v) => updateField("dueDate", v)}
                  type="date"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الدولة <span className="text-gray-400 text-xs">/ Country</span>
                  </label>
                  <select
                    value={invoice.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.nameAr} — {c.taxNameAr} {c.taxRate}%
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العملة <span className="text-gray-400 text-xs">/ Currency</span>
                  </label>
                  <select
                    value={invoice.currency}
                    onChange={(e) => updateField("currency", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    {Object.entries(CURRENCIES).map(([code, cur]) => (
                      <option key={code} value={code}>
                        {cur.nameAr} ({code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اللغة <span className="text-gray-400 text-xs">/ Language</span>
                </label>
                <div className="flex gap-4">
                  {(["both", "ar", "en"] as const).map((l) => (
                    <label key={l} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="language"
                        value={l}
                        checked={invoice.language === l}
                        onChange={() => updateField("language", l)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm">
                        {l === "both" ? "عربي + إنجليزي" : l === "ar" ? "عربي فقط" : "English only"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <SectionTitle ar="بيانات البائع" en="Seller Information" />
                <button
                  onClick={handleSaveSellerProfile}
                  className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                >
                  {savedProfile ? (
                    <SavedBadge label="تم الحفظ!" />
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      حفظ كملف شخصي
                    </>
                  )}
                </button>
              </div>

              {/* Logo Upload */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شعار الشركة <span className="text-gray-400 text-xs">/ Company Logo</span>
                </label>
                <div className="flex items-center gap-4">
                  {invoice.sellerLogo ? (
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={invoice.sellerLogo}
                        alt="Logo"
                        className="w-20 h-20 object-contain rounded-lg border border-gray-200 bg-white p-1"
                      />
                      <button
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -left-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition-colors cursor-pointer"
                    >
                      <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-[10px]">رفع لوجو</span>
                    </button>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div className="text-xs text-gray-400">
                    <p>PNG, JPG, SVG أو WebP</p>
                    <p>أقصى حجم: 500KB</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="اسم البائع"
                  labelEn="Seller Name (AR)"
                  value={invoice.sellerName}
                  onChange={(v) => updateField("sellerName", v)}
                  placeholder="اسم الشركة أو الشخص"
                  required
                  error={errors.sellerName}
                />
                <FormField
                  label="اسم البائع بالإنجليزي"
                  labelEn="Seller Name (EN)"
                  value={invoice.sellerNameEn}
                  onChange={(v) => updateField("sellerNameEn", v)}
                  placeholder="Company or person name"
                  dir="ltr"
                />
                <FormField
                  label="العنوان"
                  labelEn="Address"
                  value={invoice.sellerAddress}
                  onChange={(v) => updateField("sellerAddress", v)}
                  placeholder="العنوان الكامل"
                />
                <FormField
                  label="الرقم الضريبي"
                  labelEn="Tax Number"
                  value={invoice.sellerTaxNumber}
                  onChange={(v) => updateField("sellerTaxNumber", v)}
                  placeholder="300000000000003"
                  dir="ltr"
                />
                <FormField
                  label="الهاتف"
                  labelEn="Phone"
                  value={invoice.sellerPhone}
                  onChange={(v) => updateField("sellerPhone", v)}
                  placeholder="+966 5XX XXX XXXX"
                  dir="ltr"
                />
                <FormField
                  label="البريد الإلكتروني"
                  labelEn="Email"
                  value={invoice.sellerEmail}
                  onChange={(v) => updateField("sellerEmail", v)}
                  placeholder="email@example.com"
                  dir="ltr"
                  type="email"
                />
              </div>
            </div>

            {/* Buyer Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <SectionTitle ar="بيانات المشتري" en="Buyer Information" />
                <div className="flex gap-2">
                  {clients.length > 0 && (
                    <button
                      onClick={() => setShowClientPicker(!showClientPicker)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      اختر عميل محفوظ ({clients.length})
                    </button>
                  )}
                  {invoice.buyerName && (
                    <button
                      onClick={handleSaveClient}
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      حفظ العميل
                    </button>
                  )}
                </div>
              </div>

              {/* Client Picker Dropdown */}
              {showClientPicker && clients.length > 0 && (
                <div className="mb-4 bg-blue-50 rounded-lg p-3 border border-blue-200 max-h-48 overflow-y-auto">
                  <p className="text-xs text-blue-600 font-medium mb-2">اختر عميل محفوظ:</p>
                  <div className="space-y-1">
                    {clients.map((client) => (
                      <button
                        key={client.id}
                        onClick={() => handleSelectClient(client)}
                        className="w-full text-right px-3 py-2 bg-white rounded-md hover:bg-blue-100 text-sm transition-colors border border-transparent hover:border-blue-300"
                      >
                        <span className="font-medium text-gray-800">{client.name}</span>
                        {client.nameEn && (
                          <span className="text-gray-400 text-xs mr-2">({client.nameEn})</span>
                        )}
                        {client.phone && (
                          <span className="text-gray-400 text-xs mr-2" dir="ltr">
                            {client.phone}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="اسم المشتري"
                  labelEn="Buyer Name (AR)"
                  value={invoice.buyerName}
                  onChange={(v) => updateField("buyerName", v)}
                  placeholder="اسم العميل"
                />
                <FormField
                  label="اسم المشتري بالإنجليزي"
                  labelEn="Buyer Name (EN)"
                  value={invoice.buyerNameEn}
                  onChange={(v) => updateField("buyerNameEn", v)}
                  placeholder="Client name"
                  dir="ltr"
                />
                <FormField
                  label="العنوان"
                  labelEn="Address"
                  value={invoice.buyerAddress}
                  onChange={(v) => updateField("buyerAddress", v)}
                  placeholder="العنوان الكامل"
                />
                <FormField
                  label="الرقم الضريبي"
                  labelEn="Tax Number"
                  value={invoice.buyerTaxNumber}
                  onChange={(v) => updateField("buyerTaxNumber", v)}
                  placeholder="300000000000003"
                  dir="ltr"
                />
                <FormField
                  label="الهاتف"
                  labelEn="Phone"
                  value={invoice.buyerPhone}
                  onChange={(v) => updateField("buyerPhone", v)}
                  placeholder="+966 5XX XXX XXXX"
                  dir="ltr"
                />
                <FormField
                  label="البريد الإلكتروني"
                  labelEn="Email"
                  value={invoice.buyerEmail}
                  onChange={(v) => updateField("buyerEmail", v)}
                  placeholder="email@example.com"
                  dir="ltr"
                  type="email"
                />
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <SectionTitle ar="بنود الفاتورة" en="Invoice Items" />
              {errors.items && (
                <p className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{errors.items}</p>
              )}
              <div className="space-y-3">
                {invoice.items.map((item, idx) => (
                  <div key={item.id} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-400 text-sm mt-2 w-6 text-center">{idx + 1}</span>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          placeholder="وصف الخدمة أو المنتج"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                        placeholder="الكمية"
                        min={1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        dir="ltr"
                      />
                      <input
                        type="number"
                        value={item.unitPrice || ""}
                        onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))}
                        placeholder="سعر الوحدة"
                        min={0}
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        dir="ltr"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold text-gray-700 w-24 text-center" dir="ltr">
                        {item.total.toFixed(2)}
                      </span>
                      {invoice.items.length > 1 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-600 text-lg transition-colors"
                          title="حذف"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={addItem}
                className="mt-4 px-4 py-2 border-2 border-dashed border-emerald-300 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors w-full"
              >
                + إضافة بند جديد / Add Item
              </button>
            </div>

            {/* Tax & Discount */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <SectionTitle ar="الضريبة والخصم" en="Tax & Discount" />
              {(() => {
                const countryInfo = getCountryByCode(invoice.country);
                return countryInfo && countryInfo.code !== "OTHER" ? (
                  <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
                    {countryInfo.nameAr}: {countryInfo.taxNameAr} ({countryInfo.taxRate}%) — يمكنك تعديل النسبة يدوياً
                  </div>
                ) : null;
              })()}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label={`نسبة الضريبة (%) — ${getCountryByCode(invoice.country)?.taxNameAr || "ضريبة"}`}
                  labelEn={`Tax Rate (%) — ${getCountryByCode(invoice.country)?.taxNameEn || "Tax"}`}
                  value={invoice.taxRate}
                  onChange={updateTaxRate}
                  type="number"
                  dir="ltr"
                />
                <FormField
                  label="الخصم (مبلغ ثابت)"
                  labelEn="Discount (Fixed)"
                  value={invoice.discount || ""}
                  onChange={updateDiscount}
                  type="number"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <SectionTitle ar="ملاحظات" en="Notes" />
              <textarea
                value={invoice.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="أضف أي ملاحظات أو شروط دفع..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleSaveInvoice("draft")}
                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl text-lg font-bold hover:bg-gray-200 transition-colors border border-gray-200"
              >
                {savedInvoiceMsg ? "تم الحفظ!" : "حفظ كمسودة / Save Draft"}
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-xl text-lg font-bold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                معاينة الفاتورة / Preview Invoice
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Share/Send Invoice Dialog */}
      <ShareInvoiceDialog
        invoice={{
          invoiceNumber: invoice.invoiceNumber,
          buyerName: invoice.buyerName || invoice.buyerNameEn || "",
          buyerEmail: invoice.buyerEmail,
          sellerName: invoice.sellerName || invoice.sellerNameEn || "",
          totalAmount: invoice.totalAmount,
          currency: invoice.currency,
          issueDate: invoice.issueDate,
          dueDate: invoice.dueDate,
          items: invoice.items,
          subtotal: invoice.subtotal,
          taxAmount: invoice.taxAmount,
          taxRate: invoice.taxRate,
          discount: invoice.discount,
          notes: invoice.notes,
        }}
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        onDownloadPDF={handleDownloadPDF}
      />
    </div>
  );
}
