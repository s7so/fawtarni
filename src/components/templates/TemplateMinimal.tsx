"use client";

import { InvoiceData, CURRENCIES, getCountryByCode } from "@/lib/types";

function formatAmount(amount: number, currency: string): string {
  const cur = CURRENCIES[currency];
  const formatted = amount.toFixed(2);
  return cur ? `${formatted} ${cur.symbol}` : formatted;
}

function Label({ ar, en, lang }: { ar: string; en: string; lang: string }) {
  if (lang === "ar") return <>{ar}</>;
  if (lang === "en") return <>{en}</>;
  return (
    <>
      {ar} / {en}
    </>
  );
}

interface Props {
  invoice: InvoiceData;
  qrDataUrl: string;
}

export default function TemplateMinimal({ invoice, qrDataUrl }: Props) {
  const lang = invoice.language;
  const isRtl = lang === "ar" || lang === "both";
  const cur = CURRENCIES[invoice.currency];

  return (
    <div
      id="invoice-preview"
      dir={isRtl ? "rtl" : "ltr"}
      className="bg-white text-gray-800 p-8 max-w-[210mm] mx-auto shadow-lg border border-gray-200 print:shadow-none print:border-none"
      style={{ fontFamily: "Arial, Tahoma, sans-serif", fontSize: "14px" }}
    >
      {/* Header — clean and simple */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {invoice.sellerLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={invoice.sellerLogo}
                alt="Logo"
                className="w-12 h-12 object-contain"
              />
            )}
            <p className="font-bold text-gray-900 text-lg">
              {lang === "en" ? invoice.sellerNameEn : invoice.sellerName}
            </p>
          </div>
          {invoice.sellerAddress && <p className="text-xs text-gray-400">{invoice.sellerAddress}</p>}
          {invoice.sellerTaxNumber && (
            <p className="text-xs text-gray-400">
              <Label ar="ض" en="Tax" lang={lang} />: {invoice.sellerTaxNumber}
            </p>
          )}
        </div>
        <div className={`text-${isRtl ? "left" : "right"}`}>
          <h1 className="text-2xl font-light text-gray-900 tracking-tight mb-3">
            <Label ar="فاتورة" en="INVOICE" lang={lang} />
          </h1>
          <div className="space-y-1 text-xs text-gray-500">
            <p>
              <span className="font-medium text-gray-700">#{invoice.invoiceNumber}</span>
            </p>
            <p>{invoice.issueDate}</p>
            <p>
              <Label ar="الاستحقاق" en="Due" lang={lang} />: {invoice.dueDate}
            </p>
          </div>
        </div>
      </div>

      {/* Buyer — single line style */}
      <div className="mb-8 pb-4 border-b border-gray-100">
        <p className="text-xs text-gray-400 mb-1">
          <Label ar="إلى" en="Bill To" lang={lang} />
        </p>
        <p className="font-semibold text-gray-800">
          {lang === "en" ? invoice.buyerNameEn : invoice.buyerName}
          {lang === "both" && invoice.buyerNameEn && (
            <span className="text-gray-400 font-normal"> / {invoice.buyerNameEn}</span>
          )}
        </p>
        {invoice.buyerAddress && <p className="text-xs text-gray-500">{invoice.buyerAddress}</p>}
        {invoice.buyerTaxNumber && (
          <p className="text-xs text-gray-400">
            <Label ar="ض" en="Tax" lang={lang} />: {invoice.buyerTaxNumber}
          </p>
        )}
      </div>

      {/* Items — minimal table */}
      <table className="w-full mb-8">
        <thead>
          <tr className="text-xs text-gray-400 border-b border-gray-200">
            <th className="py-2 text-start font-medium">
              <Label ar="الوصف" en="Description" lang={lang} />
            </th>
            <th className="py-2 text-center font-medium w-16">
              <Label ar="كمية" en="Qty" lang={lang} />
            </th>
            <th className="py-2 text-center font-medium w-24">
              <Label ar="السعر" en="Price" lang={lang} />
            </th>
            <th className="py-2 text-end font-medium w-24">
              <Label ar="المجموع" en="Amount" lang={lang} />
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-50">
              <td className="py-3 text-sm text-gray-700">{item.description || "—"}</td>
              <td className="py-3 text-center text-sm text-gray-500">{item.quantity}</td>
              <td className="py-3 text-center text-sm text-gray-500" dir="ltr">
                {formatAmount(item.unitPrice, invoice.currency)}
              </td>
              <td className="py-3 text-end text-sm font-medium text-gray-800" dir="ltr">
                {formatAmount(item.total, invoice.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals + QR */}
      <div className="flex justify-between items-end">
        <div>
          {qrDataUrl && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="QR" width={100} height={100} className="opacity-70" />
            </>
          )}
        </div>

        <div className="w-64 text-sm">
          <div className="flex justify-between py-1.5">
            <span className="text-gray-400">
              <Label ar="المجموع الفرعي" en="Subtotal" lang={lang} />
            </span>
            <span className="text-gray-700" dir="ltr">
              {formatAmount(invoice.subtotal, invoice.currency)}
            </span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between py-1.5">
              <span className="text-gray-400">
                <Label ar="خصم" en="Discount" lang={lang} />
              </span>
              <span className="text-red-500" dir="ltr">
                -{formatAmount(invoice.discount, invoice.currency)}
              </span>
            </div>
          )}
          <div className="flex justify-between py-1.5">
            <span className="text-gray-400">
              <Label ar={`${getCountryByCode(invoice.country)?.taxNameAr || "ضريبة"} ${invoice.taxRate}%`} en={`${getCountryByCode(invoice.country)?.taxNameEn || "Tax"} ${invoice.taxRate}%`} lang={lang} />
            </span>
            <span className="text-gray-700" dir="ltr">
              {formatAmount(invoice.taxAmount, invoice.currency)}
            </span>
          </div>
          <div className="flex justify-between py-3 mt-2 border-t-2 border-gray-900">
            <span className="font-bold text-gray-900">
              <Label ar="الإجمالي" en="Total" lang={lang} />
            </span>
            <span className="font-bold text-gray-900" dir="ltr">
              {formatAmount(invoice.totalAmount, invoice.currency)}
            </span>
          </div>
          <p className="text-xs text-gray-400 text-end">
            {cur ? (lang === "en" ? cur.nameEn : cur.nameAr) : invoice.currency}
          </p>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mt-8 text-sm">
          <p className="text-xs text-gray-400 mb-1">
            <Label ar="ملاحظات" en="Notes" lang={lang} />
          </p>
          <p className="text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-10 pt-4 border-t border-gray-100 text-center text-xs text-gray-300">
        fawtarni.com
      </div>
    </div>
  );
}
