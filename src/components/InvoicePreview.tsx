"use client";

import { useEffect, useRef, useState } from "react";
import { InvoiceData, CURRENCIES } from "@/lib/types";
import { generateZatcaQRData } from "@/lib/zatca";
import QRCode from "qrcode";

interface Props {
  invoice: InvoiceData;
}

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

export default function InvoicePreview({ invoice }: Props) {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const lang = invoice.language;
  const isRtl = lang === "ar" || lang === "both";
  const cur = CURRENCIES[invoice.currency];

  useEffect(() => {
    if (!invoice.sellerName && !invoice.sellerTaxNumber) return;

    const qrData = generateZatcaQRData(
      invoice.sellerName || invoice.sellerNameEn,
      invoice.sellerTaxNumber || "000000000000000",
      new Date(invoice.issueDate).toISOString(),
      invoice.totalAmount.toFixed(2),
      invoice.taxAmount.toFixed(2)
    );

    QRCode.toDataURL(qrData, { width: 150, margin: 1 }).then((url) => {
      setQrDataUrl(url);
    });
  }, [
    invoice.sellerName,
    invoice.sellerNameEn,
    invoice.sellerTaxNumber,
    invoice.issueDate,
    invoice.totalAmount,
    invoice.taxAmount,
  ]);

  return (
    <div
      id="invoice-preview"
      dir={isRtl ? "rtl" : "ltr"}
      className="bg-white text-gray-800 p-8 max-w-[210mm] mx-auto shadow-lg border border-gray-200 print:shadow-none print:border-none"
      style={{ fontFamily: "Arial, Tahoma, sans-serif", fontSize: "14px" }}
    >
      {/* Header */}
      <div className="flex justify-between items-start border-b-4 border-emerald-600 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-emerald-700 mb-1">
            <Label ar="فاتورة ضريبية" en="Tax Invoice" lang={lang} />
          </h1>
          <p className="text-gray-500 text-sm">
            <Label ar="رقم الفاتورة" en="Invoice No." lang={lang} />:{" "}
            <span className="font-semibold text-gray-700">{invoice.invoiceNumber}</span>
          </p>
        </div>
        <div className={`text-${isRtl ? "left" : "right"} text-sm text-gray-500`}>
          <p>
            <Label ar="تاريخ الإصدار" en="Issue Date" lang={lang} />:{" "}
            <span className="font-semibold text-gray-700">{invoice.issueDate}</span>
          </p>
          <p>
            <Label ar="تاريخ الاستحقاق" en="Due Date" lang={lang} />:{" "}
            <span className="font-semibold text-gray-700">{invoice.dueDate}</span>
          </p>
          <p>
            <Label ar="العملة" en="Currency" lang={lang} />:{" "}
            <span className="font-semibold text-gray-700">
              {cur ? (lang === "en" ? cur.nameEn : cur.nameAr) : invoice.currency}
            </span>
          </p>
        </div>
      </div>

      {/* Seller & Buyer */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-emerald-50 rounded-lg p-4">
          <h3 className="font-bold text-emerald-700 mb-2 text-base">
            <Label ar="البائع" en="Seller" lang={lang} />
          </h3>
          <p className="font-semibold text-gray-800">
            {lang === "en" ? invoice.sellerNameEn : invoice.sellerName}
            {lang === "both" && invoice.sellerNameEn && (
              <span className="text-gray-500 text-sm"> / {invoice.sellerNameEn}</span>
            )}
          </p>
          {invoice.sellerAddress && <p className="text-sm text-gray-600 mt-1">{invoice.sellerAddress}</p>}
          {invoice.sellerTaxNumber && (
            <p className="text-sm text-gray-600">
              <Label ar="الرقم الضريبي" en="Tax No." lang={lang} />: {invoice.sellerTaxNumber}
            </p>
          )}
          {invoice.sellerPhone && <p className="text-sm text-gray-600" dir="ltr">{invoice.sellerPhone}</p>}
          {invoice.sellerEmail && <p className="text-sm text-gray-600" dir="ltr">{invoice.sellerEmail}</p>}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-bold text-gray-700 mb-2 text-base">
            <Label ar="المشتري" en="Buyer" lang={lang} />
          </h3>
          <p className="font-semibold text-gray-800">
            {lang === "en" ? invoice.buyerNameEn : invoice.buyerName}
            {lang === "both" && invoice.buyerNameEn && (
              <span className="text-gray-500 text-sm"> / {invoice.buyerNameEn}</span>
            )}
          </p>
          {invoice.buyerAddress && <p className="text-sm text-gray-600 mt-1">{invoice.buyerAddress}</p>}
          {invoice.buyerTaxNumber && (
            <p className="text-sm text-gray-600">
              <Label ar="الرقم الضريبي" en="Tax No." lang={lang} />: {invoice.buyerTaxNumber}
            </p>
          )}
          {invoice.buyerPhone && <p className="text-sm text-gray-600" dir="ltr">{invoice.buyerPhone}</p>}
          {invoice.buyerEmail && <p className="text-sm text-gray-600" dir="ltr">{invoice.buyerEmail}</p>}
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse mb-6">
        <thead>
          <tr className="bg-emerald-600 text-white text-sm">
            <th className="py-3 px-4 text-center w-12">#</th>
            <th className="py-3 px-4 text-start">
              <Label ar="الوصف" en="Description" lang={lang} />
            </th>
            <th className="py-3 px-4 text-center w-20">
              <Label ar="الكمية" en="Qty" lang={lang} />
            </th>
            <th className="py-3 px-4 text-center w-28">
              <Label ar="سعر الوحدة" en="Unit Price" lang={lang} />
            </th>
            <th className="py-3 px-4 text-center w-28">
              <Label ar="المجموع" en="Total" lang={lang} />
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, idx) => (
            <tr key={item.id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="py-3 px-4 text-center text-sm">{idx + 1}</td>
              <td className="py-3 px-4 text-sm">{item.description || "—"}</td>
              <td className="py-3 px-4 text-center text-sm">{item.quantity}</td>
              <td className="py-3 px-4 text-center text-sm" dir="ltr">
                {formatAmount(item.unitPrice, invoice.currency)}
              </td>
              <td className="py-3 px-4 text-center text-sm font-semibold" dir="ltr">
                {formatAmount(item.total, invoice.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals + QR */}
      <div className="flex justify-between items-end">
        {/* QR Code */}
        <div className="flex flex-col items-center">
          {qrDataUrl && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="ZATCA QR" width={130} height={130} />
              <p className="text-xs text-gray-400 mt-1">ZATCA QR Code</p>
            </>
          )}
          <canvas ref={qrRef} className="hidden" />
        </div>

        {/* Totals */}
        <div className="w-72">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">
              <Label ar="المجموع الفرعي" en="Subtotal" lang={lang} />
            </span>
            <span className="font-semibold" dir="ltr">
              {formatAmount(invoice.subtotal, invoice.currency)}
            </span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">
                <Label ar="الخصم" en="Discount" lang={lang} />
              </span>
              <span className="font-semibold text-red-600" dir="ltr">
                -{formatAmount(invoice.discount, invoice.currency)}
              </span>
            </div>
          )}
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">
              <Label ar={`ضريبة القيمة المضافة (${invoice.taxRate}%)`} en={`VAT (${invoice.taxRate}%)`} lang={lang} />
            </span>
            <span className="font-semibold" dir="ltr">
              {formatAmount(invoice.taxAmount, invoice.currency)}
            </span>
          </div>
          <div className="flex justify-between py-3 bg-emerald-600 text-white rounded-b-lg px-4 -mx-0 mt-1">
            <span className="font-bold text-lg">
              <Label ar="الإجمالي" en="Total" lang={lang} />
            </span>
            <span className="font-bold text-lg" dir="ltr">
              {formatAmount(invoice.totalAmount, invoice.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-1">
            <Label ar="ملاحظات" en="Notes" lang={lang} />
          </h4>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
        <Label
          ar="تم إنشاء هذه الفاتورة بواسطة فوترني — fawtarni.com"
          en="Generated by Fawtarni — fawtarni.com"
          lang={lang}
        />
      </div>
    </div>
  );
}
