"use client";

import { useMemo } from "react";
import type { SavedInvoice } from "@/lib/storage";

interface Props {
  invoices: SavedInvoice[];
}

const STATUS_CONFIG: Record<string, { labelAr: string; color: string }> = {
  draft: { labelAr: "مسودة", color: "#9ca3af" },
  sent: { labelAr: "مرسلة", color: "#3b82f6" },
  paid: { labelAr: "مدفوعة", color: "#10b981" },
  overdue: { labelAr: "متأخرة", color: "#ef4444" },
};

export default function InvoiceStatusChart({ invoices }: Props) {
  const statusData = useMemo(() => {
    const counts: Record<string, number> = { draft: 0, sent: 0, paid: 0, overdue: 0 };
    invoices.forEach((inv) => {
      counts[inv.status] = (counts[inv.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      ...STATUS_CONFIG[status],
    }));
  }, [invoices]);

  const total = invoices.length || 1;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4">
        حالة الفواتير <span className="text-gray-400 font-normal text-sm">/ Invoice Status</span>
      </h3>

      {invoices.length === 0 ? (
        <div className="text-center text-gray-400 text-sm py-8">لا توجد فواتير</div>
      ) : (
        <>
          {/* Donut chart via SVG */}
          <div className="flex items-center gap-6">
            <svg width="120" height="120" viewBox="0 0 120 120" className="shrink-0">
              {(() => {
                let cumulative = 0;
                const radius = 45;
                const circumference = 2 * Math.PI * radius;

                return statusData.map((d) => {
                  const pct = d.count / total;
                  const offset = cumulative * circumference;
                  cumulative += pct;

                  if (d.count === 0) return null;

                  return (
                    <circle
                      key={d.status}
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke={d.color}
                      strokeWidth="16"
                      strokeDasharray={`${pct * circumference} ${circumference}`}
                      strokeDashoffset={-offset}
                      transform="rotate(-90 60 60)"
                    />
                  );
                });
              })()}
              <text x="60" y="56" textAnchor="middle" className="text-2xl font-bold" fill="#1f2937">
                {invoices.length}
              </text>
              <text x="60" y="72" textAnchor="middle" className="text-xs" fill="#9ca3af">
                فاتورة
              </text>
            </svg>

            <div className="flex flex-col gap-2 flex-1">
              {statusData.map((d) => (
                <div key={d.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="text-sm text-gray-600">{d.labelAr}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
