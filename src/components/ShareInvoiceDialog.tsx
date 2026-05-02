"use client";

import { useState, useCallback } from "react";
import { CURRENCIES } from "@/lib/types";

interface InvoiceShareData {
  invoiceNumber: string;
  buyerName: string;
  buyerEmail: string;
  sellerName: string;
  totalAmount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  discount: number;
  notes: string;
}

interface Props {
  invoice: InvoiceShareData;
  isOpen: boolean;
  onClose: () => void;
  onDownloadPDF?: () => void;
}

function formatAmount(amount: number, currency: string): string {
  const cur = CURRENCIES[currency];
  const formatted = amount.toFixed(2);
  return cur ? `${formatted} ${cur.symbol}` : formatted;
}

export default function ShareInvoiceDialog({ invoice, isOpen, onClose, onDownloadPDF }: Props) {
  const [copied, setCopied] = useState(false);
  const [emailTo, setEmailTo] = useState(invoice.buyerEmail || "");
  const [emailSent, setEmailSent] = useState(false);

  const getInvoiceSummary = useCallback(() => {
    const cur = CURRENCIES[invoice.currency];
    const currencyName = cur ? cur.nameAr : invoice.currency;

    const itemsList = invoice.items
      .filter((i) => i.description)
      .map((i, idx) => `${idx + 1}. ${i.description} — ${i.quantity} × ${formatAmount(i.unitPrice, invoice.currency)} = ${formatAmount(i.total, invoice.currency)}`)
      .join("\n");

    return [
      `فاتورة رقم: ${invoice.invoiceNumber}`,
      `من: ${invoice.sellerName}`,
      `إلى: ${invoice.buyerName}`,
      `التاريخ: ${invoice.issueDate}`,
      `تاريخ الاستحقاق: ${invoice.dueDate}`,
      "",
      "البنود:",
      itemsList,
      "",
      `المجموع الفرعي: ${formatAmount(invoice.subtotal, invoice.currency)}`,
      invoice.discount > 0 ? `الخصم: -${formatAmount(invoice.discount, invoice.currency)}` : "",
      `ضريبة (${invoice.taxRate}%): ${formatAmount(invoice.taxAmount, invoice.currency)}`,
      `الإجمالي: ${formatAmount(invoice.totalAmount, invoice.currency)} ${currencyName}`,
      "",
      invoice.notes ? `ملاحظات: ${invoice.notes}` : "",
      "",
      "— فوترني | fawtarni.com",
    ].filter(Boolean).join("\n");
  }, [invoice]);

  const getEmailSubject = useCallback(() => {
    return `فاتورة ${invoice.invoiceNumber} — ${formatAmount(invoice.totalAmount, invoice.currency)}`;
  }, [invoice]);

  const getEmailBody = useCallback(() => {
    const cur = CURRENCIES[invoice.currency];
    const currencyName = cur ? cur.nameAr : invoice.currency;

    return [
      `مرحباً ${invoice.buyerName || ""},`,
      "",
      `مرفق لكم فاتورة رقم ${invoice.invoiceNumber} بمبلغ ${formatAmount(invoice.totalAmount, invoice.currency)} ${currencyName}.`,
      "",
      "تفاصيل الفاتورة:",
      `• رقم الفاتورة: ${invoice.invoiceNumber}`,
      `• تاريخ الإصدار: ${invoice.issueDate}`,
      `• تاريخ الاستحقاق: ${invoice.dueDate}`,
      `• المبلغ الإجمالي: ${formatAmount(invoice.totalAmount, invoice.currency)}`,
      "",
      ...invoice.items
        .filter((i) => i.description)
        .map((i) => `  - ${i.description}: ${formatAmount(i.total, invoice.currency)}`),
      "",
      invoice.notes ? `ملاحظات: ${invoice.notes}` : "",
      "",
      "يرجى السداد قبل تاريخ الاستحقاق.",
      "",
      "شكراً لتعاملكم معنا.",
      `${invoice.sellerName}`,
      "",
      "— تم إنشاء هذه الفاتورة عبر فوترني | fawtarni.com",
    ].filter(Boolean).join("\n");
  }, [invoice]);

  const handleSendEmail = useCallback(() => {
    const subject = encodeURIComponent(getEmailSubject());
    const body = encodeURIComponent(getEmailBody());
    const mailto = `mailto:${encodeURIComponent(emailTo)}?subject=${subject}&body=${body}`;
    window.open(mailto, "_blank");
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  }, [emailTo, getEmailSubject, getEmailBody]);

  const handleSendEmailWithPDF = useCallback(() => {
    if (onDownloadPDF) {
      onDownloadPDF();
    }
    setTimeout(() => {
      handleSendEmail();
    }, 500);
  }, [onDownloadPDF, handleSendEmail]);

  const handleWhatsApp = useCallback(() => {
    const cur = CURRENCIES[invoice.currency];
    const currencyName = cur ? cur.nameAr : invoice.currency;

    const text = [
      `📄 *فاتورة رقم ${invoice.invoiceNumber}*`,
      "",
      `من: ${invoice.sellerName}`,
      `المبلغ: *${formatAmount(invoice.totalAmount, invoice.currency)} ${currencyName}*`,
      `تاريخ الاستحقاق: ${invoice.dueDate}`,
      "",
      ...invoice.items
        .filter((i) => i.description)
        .map((i) => `• ${i.description}: ${formatAmount(i.total, invoice.currency)}`),
      "",
      `الإجمالي: *${formatAmount(invoice.totalAmount, invoice.currency)}*`,
      "",
      "— فوترني | fawtarni.com",
    ].join("\n");

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }, [invoice]);

  const handleCopy = useCallback(async () => {
    const summary = getInvoiceSummary();
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = summary;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [getInvoiceSummary]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        {/* Dialog */}
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">
              إرسال الفاتورة <span className="text-gray-400 text-sm font-normal">/ Send Invoice</span>
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Invoice Preview Mini */}
          <div className="mx-5 mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-800 text-sm" dir="ltr">{invoice.invoiceNumber}</p>
                <p className="text-xs text-gray-500 mt-0.5">{invoice.buyerName}</p>
              </div>
              <div className="text-left">
                <p className="font-bold text-emerald-700" dir="ltr">
                  {formatAmount(invoice.totalAmount, invoice.currency)}
                </p>
                <p className="text-xs text-gray-400">{invoice.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Email Section */}
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                إيميل المستلم <span className="text-gray-400 font-normal">/ Recipient Email</span>
              </label>
              <input
                type="email"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                placeholder="client@example.com"
                dir="ltr"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Send via Email */}
            <button
              onClick={handleSendEmailWithPDF}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {emailSent ? (
                "تم فتح الإيميل!"
              ) : (
                <>
                  <span className="text-base">📧</span>
                  إرسال بالإيميل + تحميل PDF
                </>
              )}
            </button>

            {/* Email only (without PDF) */}
            <button
              onClick={handleSendEmail}
              className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium text-sm transition-colors border border-gray-200 flex items-center justify-center gap-2"
            >
              <span className="text-base">✉️</span>
              إرسال بالإيميل فقط (بدون PDF)
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400">أو شارك عبر</span>
              </div>
            </div>

            {/* Share Options Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="py-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 border border-[#25D366]/20"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                واتساب
              </button>

              {/* Copy */}
              <button
                onClick={handleCopy}
                className="py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 border border-gray-200"
              >
                <span className="text-base">{copied ? "✓" : "📋"}</span>
                {copied ? "تم النسخ!" : "نسخ الملخص"}
              </button>
            </div>

            {/* Download PDF only */}
            {onDownloadPDF && (
              <button
                onClick={() => { onDownloadPDF(); onClose(); }}
                className="w-full py-2.5 text-gray-500 hover:text-gray-700 text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-base">📥</span>
                تحميل PDF فقط
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
