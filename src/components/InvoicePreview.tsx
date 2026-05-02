"use client";

import { useEffect, useState } from "react";
import { InvoiceData } from "@/lib/types";
import { generateZatcaQRData } from "@/lib/zatca";
import QRCode from "qrcode";
import TemplateClassic from "./templates/TemplateClassic";
import TemplateModern from "./templates/TemplateModern";
import TemplateMinimal from "./templates/TemplateMinimal";

export type TemplateName = "classic" | "modern" | "minimal";

export const TEMPLATES: { id: TemplateName; nameAr: string; nameEn: string }[] = [
  { id: "classic", nameAr: "كلاسيكي", nameEn: "Classic" },
  { id: "modern", nameAr: "عصري", nameEn: "Modern" },
  { id: "minimal", nameAr: "بسيط", nameEn: "Minimal" },
];

interface Props {
  invoice: InvoiceData;
  template?: TemplateName;
}

export default function InvoicePreview({ invoice, template = "classic" }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (!invoice.sellerName && !invoice.sellerNameEn) return;

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

  switch (template) {
    case "modern":
      return <TemplateModern invoice={invoice} qrDataUrl={qrDataUrl} />;
    case "minimal":
      return <TemplateMinimal invoice={invoice} qrDataUrl={qrDataUrl} />;
    default:
      return <TemplateClassic invoice={invoice} qrDataUrl={qrDataUrl} />;
  }
}
