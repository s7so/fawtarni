"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { InvoiceData, InvoiceItem, CURRENCIES, createEmptyInvoice, saveSellerData } from "@/lib/types";
import InvoicePreview from "./InvoicePreview";

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
}: {
  label: string;
  labelEn: string;
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  dir?: string;
  required?: boolean;
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
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
      />
    </div>
  );
}

export default function InvoiceForm() {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [generating, setGenerating] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setInvoice(createEmptyInvoice());
  }, []);

  const updateField = useCallback(
    <K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => {
      setInvoice((prev) => prev ? { ...prev, [field]: value } : prev);
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
    },
    [recalculate]
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

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      alert("حجم الصورة كبير جداً. الحد الأقصى 500KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        updateField("sellerLogo", dataUrl);
      }
    };
    reader.readAsDataURL(file);
  }, [updateField]);

  const handleSaveSellerData = useCallback(() => {
    if (!invoice) return;
    saveSellerData({
      sellerLogo: invoice.sellerLogo,
      sellerName: invoice.sellerName,
      sellerNameEn: invoice.sellerNameEn,
      sellerAddress: invoice.sellerAddress,
      sellerTaxNumber: invoice.sellerTaxNumber,
      sellerPhone: invoice.sellerPhone,
      sellerEmail: invoice.sellerEmail,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  }, [invoice]);

  const handleDownloadPDF = useCallback(async () => {
    if (!invoice) return;
    setGenerating(true);
    let wrapper: HTMLDivElement | null = null;
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      wrapper = document.createElement("div");
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
      if (wrapper && wrapper.parentNode) {
        document.body.removeChild(wrapper);
      }
      setGenerating(false);
    }
  }, [invoice]);

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
      <header className="bg-emerald-700 text-white py-4 px-6 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold">
            فوترني <span className="text-emerald-200 text-sm font-normal">Fawtarni</span>
          </a>
          <div className="flex gap-3">
            {/* Tab Switcher */}
            <div className="flex bg-emerald-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("form")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "form"
                    ? "bg-white text-emerald-700"
                    : "text-emerald-200 hover:text-white"
                }`}
              >
                ✏️ تعديل
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "preview"
                    ? "bg-white text-emerald-700"
                    : "text-emerald-200 hover:text-white"
                }`}
              >
                👁️ معاينة
              </button>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={generating}
              className="px-4 py-2 bg-white text-emerald-700 hover:bg-emerald-50 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
            >
              {generating ? "جاري التحميل..." : "📥 تحميل PDF"}
            </button>
          </div>
        </div>
      </header>

      {/* Hidden preview for PDF generation (always in DOM) */}
      {activeTab !== "preview" && (
        <div className="fixed left-[-9999px] top-0" aria-hidden="true">
          <InvoicePreview invoice={invoice} />
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6">
        {/* Preview Tab */}
        {activeTab === "preview" && (
          <div className="mb-6">
            <InvoicePreview invoice={invoice} />
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
                <div className="border-b-2 border-emerald-200 pb-2 mb-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-emerald-700">
                      بيانات البائع <span className="text-gray-400 font-normal text-sm">/ Seller Information</span>
                    </h2>
                    <button
                      onClick={handleSaveSellerData}
                      className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors flex items-center gap-1"
                    >
                      {savedNotice ? "تم الحفظ!" : "💾 حفظ بياناتي"}
                    </button>
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="mb-5 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-emerald-300 transition-colors">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    لوجو الشركة <span className="text-gray-400 text-xs">/ Company Logo</span>
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
                          onClick={() => updateField("sellerLogo", "")}
                          className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-3xl">
                        🏢
                      </div>
                    )}
                    <div>
                      <label className="cursor-pointer px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors inline-block">
                        {invoice.sellerLogo ? "تغيير اللوجو" : "رفع لوجو"}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/svg+xml,image/webp"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG — حد أقصى 500KB</p>
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
                <SectionTitle ar="بيانات المشتري" en="Buyer Information" />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="نسبة الضريبة (%)"
                    labelEn="Tax Rate (%)"
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

              {/* Preview Button at Bottom */}
              <button
                onClick={() => setActiveTab("preview")}
                className="w-full py-4 bg-emerald-600 text-white rounded-xl text-lg font-bold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                👁️ معاينة الفاتورة / Preview Invoice
              </button>
          </div>
        )}
      </div>
    </div>
  );
}
