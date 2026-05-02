import type { SavedInvoice } from "./storage";
import { CURRENCIES } from "./types";

function formatAmount(amount: number, currency: string): string {
  const cur = CURRENCIES[currency];
  const formatted = amount.toFixed(2);
  return cur ? `${formatted} ${cur.symbol}` : formatted;
}

const STATUS_LABELS: Record<string, string> = {
  draft: "مسودة / Draft",
  sent: "مرسلة / Sent",
  paid: "مدفوعة / Paid",
  overdue: "متأخرة / Overdue",
};

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportInvoicesToCSV(invoices: SavedInvoice[]): void {
  const BOM = "\uFEFF";
  const headers = [
    "رقم الفاتورة / Invoice No.",
    "تاريخ الإصدار / Issue Date",
    "تاريخ الاستحقاق / Due Date",
    "اسم العميل / Client Name",
    "المبلغ / Amount",
    "العملة / Currency",
    "الحالة / Status",
  ];

  const rows = invoices.map((inv) => [
    escapeCSV(inv.invoiceNumber),
    escapeCSV(inv.issueDate),
    escapeCSV(inv.dueDate),
    escapeCSV(inv.buyerName || inv.buyerNameEn || "—"),
    inv.totalAmount.toFixed(2),
    escapeCSV(inv.currency),
    escapeCSV(STATUS_LABELS[inv.status] || inv.status),
  ]);

  const csv = BOM + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadFile(csv, "fawtarni-invoices.csv", "text/csv;charset=utf-8");
}

export function exportInvoicesToExcel(invoices: SavedInvoice[]): void {
  const headers = [
    "رقم الفاتورة",
    "تاريخ الإصدار",
    "تاريخ الاستحقاق",
    "اسم العميل",
    "المبلغ",
    "العملة",
    "الحالة",
  ];

  const rows = invoices.map((inv) => [
    inv.invoiceNumber,
    inv.issueDate,
    inv.dueDate,
    inv.buyerName || inv.buyerNameEn || "—",
    inv.totalAmount.toFixed(2),
    inv.currency,
    STATUS_LABELS[inv.status] || inv.status,
  ]);

  const xmlRows = rows
    .map(
      (row) =>
        "<Row>" +
        row.map((cell) => `<Cell><Data ss:Type="String">${escapeXML(cell)}</Data></Cell>`).join("") +
        "</Row>"
    )
    .join("\n");

  const headerRow =
    "<Row>" +
    headers
      .map((h) => `<Cell ss:StyleID="header"><Data ss:Type="String">${escapeXML(h)}</Data></Cell>`)
      .join("") +
    "</Row>";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Default"><Alignment ss:Horizontal="Right" ss:Vertical="Center"/></Style>
    <Style ss:ID="header"><Font ss:Bold="1"/><Interior ss:Color="#059669" ss:Pattern="Solid"/><Font ss:Color="#FFFFFF" ss:Bold="1"/></Style>
  </Styles>
  <Worksheet ss:Name="الفواتير">
    <Table>
      ${headerRow}
      ${xmlRows}
    </Table>
  </Worksheet>
</Workbook>`;

  downloadFile(xml, "fawtarni-invoices.xls", "application/vnd.ms-excel");
}

export function exportMonthlyReport(invoices: SavedInvoice[]): void {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthInvoices = invoices.filter((inv) => {
    const d = new Date(inv.issueDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const paid = monthInvoices.filter((i) => i.status === "paid");
  const pending = monthInvoices.filter((i) => i.status === "sent" || i.status === "overdue");
  const drafts = monthInvoices.filter((i) => i.status === "draft");

  const totalRevenue = paid.reduce((s, i) => s + i.totalAmount, 0);
  const totalPending = pending.reduce((s, i) => s + i.totalAmount, 0);
  const totalDrafts = drafts.reduce((s, i) => s + i.totalAmount, 0);

  const monthName = now.toLocaleDateString("ar-SA", { month: "long", year: "numeric" });

  const BOM = "\uFEFF";
  const lines = [
    `تقرير شهري — ${monthName}`,
    `Monthly Report — ${now.toLocaleDateString("en", { month: "long", year: "numeric" })}`,
    "",
    "الملخص / Summary",
    "—".repeat(40),
    `إجمالي الفواتير / Total Invoices: ${monthInvoices.length}`,
    `الإيرادات المحصلة / Revenue (Paid): ${totalRevenue.toFixed(2)}`,
    `المبالغ المعلقة / Pending: ${totalPending.toFixed(2)}`,
    `المسودات / Drafts: ${totalDrafts.toFixed(2)}`,
    "",
    "التفاصيل / Details",
    "—".repeat(40),
    ["رقم الفاتورة", "التاريخ", "العميل", "المبلغ", "الحالة"].join("\t"),
    ...monthInvoices.map((inv) =>
      [
        inv.invoiceNumber,
        inv.issueDate,
        inv.buyerName || inv.buyerNameEn || "—",
        formatAmount(inv.totalAmount, inv.currency),
        STATUS_LABELS[inv.status] || inv.status,
      ].join("\t")
    ),
  ];

  const content = BOM + lines.join("\n");
  const filename = `fawtarni-report-${currentYear}-${String(currentMonth + 1).padStart(2, "0")}.txt`;
  downloadFile(content, filename, "text/plain;charset=utf-8");
}

function escapeXML(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
