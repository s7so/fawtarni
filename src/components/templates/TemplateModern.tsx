"use client";

import { InvoiceData, CURRENCIES } from "@/lib/types";

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

export default function TemplateModern({ invoice, qrDataUrl }: Props) {
  const lang = invoice.language;
  const isRtl = lang === "ar" || lang === "both";
  const cur = CURRENCIES[invoice.currency];

  return (
    <div
      id="invoice-preview"
      dir={isRtl ? "rtl" : "ltr"}
      className="bg-white text-gray-800 max-w-[210mm] mx-auto shadow-lg border border-gray-200 print:shadow-none print:border-none overflow-hidden"
      style={{ fontFamily: "Arial, Tahoma, sans-serif", fontSize: "14px" }}
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 pb-12 relative">
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-t-[2rem]" />
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-4">
            {invoice.sellerLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={invoice.sellerLogo}
                alt="Logo"
                className="w-14 h-14 object-contain rounded-xl bg-white/20 p-1"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">
                <Label ar="فاتورة ضريبية" en="Tax Invoice" lang={lang} />
              </h1>
              <p className="text-indigo-200 text-sm mt-1">
                #{invoice.invoiceNumber}
              </p>
            </div>
          </div>
          <div className={`text-${isRtl ? "left" : "right"} text-sm`}>
            <div className="bg-white/15 rounded-lg px-4 py-3">
              <p className="text-indigo-200 text-xs">
                <Label ar="تاريخ الإصدار" en="Issue Date" lang={lang} />
              </p>
              <p className="font-semibold">{invoice.issueDate}</p>
              <p className="text-indigo-200 text-xs mt-2">
                <Label ar="تاريخ الاستحقاق" en="Due Date" lang={lang} />
              </p>
              <p className="font-semibold">{invoice.dueDate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 -mt-2">
        {/* Seller & Buyer Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="border-2 border-indigo-100 rounded-xl p-5">
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">
              <Label ar="البائع" en="From" lang={lang} />
            </h3>
            <p className="font-bold text-gray-900 text-base">
              {lang === "en" ? invoice.sellerNameEn : invoice.sellerName}
              {lang === "both" && invoice.sellerNameEn && (
                <span className="text-gray-400 text-sm font-normal"> / {invoice.sellerNameEn}</span>
              )}
            </p>
            {invoice.sellerAddress && <p className="text-sm text-gray-500 mt-1">{invoice.sellerAddress}</p>}
            {invoice.sellerTaxNumber && (
              <p className="text-xs text-gray-400 mt-2">
                <Label ar="الرقم الضريبي" en="Tax No." lang={lang} />: {invoice.sellerTaxNumber}
              </p>
            )}
            <div className="flex gap-4 mt-2 text-xs text-gray-400" dir="ltr">
              {invoice.sellerPhone && <span>{invoice.sellerPhone}</span>}
              {invoice.sellerEmail && <span>{invoice.sellerEmail}</span>}
            </div>
          </div>

          <div className="border-2 border-gray-100 rounded-xl p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              <Label ar="المشتري" en="To" lang={lang} />
            </h3>
            <p className="font-bold text-gray-900 text-base">
              {lang === "en" ? invoice.buyerNameEn : invoice.buyerName}
              {lang === "both" && invoice.buyerNameEn && (
                <span className="text-gray-400 text-sm font-normal"> / {invoice.buyerNameEn}</span>
              )}
            </p>
            {invoice.buyerAddress && <p className="text-sm text-gray-500 mt-1">{invoice.buyerAddress}</p>}
            {invoice.buyerTaxNumber && (
              <p className="text-xs text-gray-400 mt-2">
                <Label ar="الرقم الضريبي" en="Tax No." lang={lang} />: {invoice.buyerTaxNumber}
              </p>
            )}
            <div className="flex gap-4 mt-2 text-xs text-gray-400" dir="ltr">
              {invoice.buyerPhone && <span>{invoice.buyerPhone}</span>}
              {invoice.buyerEmail && <span>{invoice.buyerEmail}</span>}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="rounded-xl border border-gray-200 overflow-hidden mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-4 text-center w-12">#</th>
                <th className="py-4 px-4 text-start">
                  <Label ar="الوصف" en="Description" lang={lang} />
                </th>
                <th className="py-4 px-4 text-center w-20">
                  <Label ar="الكمية" en="Qty" lang={lang} />
                </th>
                <th className="py-4 px-4 text-center w-28">
                  <Label ar="سعر الوحدة" en="Unit Price" lang={lang} />
                </th>
                <th className="py-4 px-4 text-center w-28">
                  <Label ar="المجموع" en="Total" lang={lang} />
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="py-4 px-4 text-center text-sm text-gray-400">{idx + 1}</td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-800">{item.description || "—"}</td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600">{item.quantity}</td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600" dir="ltr">
                    {formatAmount(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="py-4 px-4 text-center text-sm font-semibold text-gray-800" dir="ltr">
                    {formatAmount(item.total, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals + QR */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col items-center">
            {qrDataUrl && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="ZATCA QR" width={120} height={120} className="rounded-lg" />
                <p className="text-xs text-gray-400 mt-1">ZATCA QR</p>
              </>
            )}
          </div>

          <div className="w-72">
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-500">
                <Label ar="المجموع الفرعي" en="Subtotal" lang={lang} />
              </span>
              <span className="font-medium text-gray-700" dir="ltr">
                {formatAmount(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-500">
                  <Label ar="الخصم" en="Discount" lang={lang} />
                </span>
                <span className="font-medium text-red-500" dir="ltr">
                  -{formatAmount(invoice.discount, invoice.currency)}
                </span>
              </div>
            )}
            <div className="flex justify-between py-2 text-sm border-b border-gray-200">
              <span className="text-gray-500">
                <Label ar={`ضريبة (${invoice.taxRate}%)`} en={`VAT (${invoice.taxRate}%)`} lang={lang} />
              </span>
              <span className="font-medium text-gray-700" dir="ltr">
                {formatAmount(invoice.taxAmount, invoice.currency)}
              </span>
            </div>
            <div className="flex justify-between py-3 mt-1">
              <span className="font-bold text-lg text-gray-900">
                <Label ar="الإجمالي" en="Total" lang={lang} />
              </span>
              <span className="font-bold text-lg text-indigo-600" dir="ltr">
                {formatAmount(invoice.totalAmount, invoice.currency)}
              </span>
            </div>
            <div className="text-xs text-gray-400 text-end">
              {cur ? (lang === "en" ? cur.nameEn : cur.nameAr) : invoice.currency}
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <h4 className="font-semibold text-indigo-700 mb-1 text-sm">
              <Label ar="ملاحظات" en="Notes" lang={lang} />
            </h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
          <Label
            ar="تم إنشاء هذه الفاتورة بواسطة فوترني — fawtarni.com"
            en="Generated by Fawtarni — fawtarni.com"
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}
