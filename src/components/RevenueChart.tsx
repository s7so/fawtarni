"use client";

import { useMemo } from "react";
import type { SavedInvoice } from "@/lib/storage";

interface Props {
  invoices: SavedInvoice[];
}

const MONTH_NAMES_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export default function RevenueChart({ invoices }: Props) {
  const monthlyData = useMemo(() => {
    const now = new Date();
    const months: { month: string; revenue: number; pending: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();

      const monthInvoices = invoices.filter((inv) => {
        const invDate = new Date(inv.issueDate);
        return invDate.getMonth() === m && invDate.getFullYear() === y;
      });

      const revenue = monthInvoices
        .filter((inv) => inv.status === "paid")
        .reduce((s, inv) => s + inv.totalAmount, 0);

      const pending = monthInvoices
        .filter((inv) => inv.status === "sent" || inv.status === "overdue")
        .reduce((s, inv) => s + inv.totalAmount, 0);

      months.push({
        month: MONTH_NAMES_AR[m],
        revenue,
        pending,
      });
    }

    return months;
  }, [invoices]);

  const maxValue = Math.max(...monthlyData.map((d) => d.revenue + d.pending), 1);

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-1">
        الإيرادات الشهرية <span className="text-gray-400 font-normal text-sm">/ Monthly Revenue</span>
      </h3>
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> محصّلة
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" /> معلقة
        </span>
      </div>

      <div className="flex items-end gap-2 h-40">
        {monthlyData.map((d) => {
          const revenueH = (d.revenue / maxValue) * 100;
          const pendingH = (d.pending / maxValue) * 100;
          const totalH = revenueH + pendingH;

          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center justify-end h-32">
                {totalH > 0 ? (
                  <div
                    className="w-full max-w-[40px] rounded-t-lg overflow-hidden flex flex-col justify-end transition-all"
                    style={{ height: `${Math.max(totalH, 4)}%` }}
                  >
                    {pendingH > 0 && (
                      <div
                        className="bg-amber-400 w-full"
                        style={{ height: `${(pendingH / (totalH || 1)) * 100}%` }}
                      />
                    )}
                    <div
                      className="bg-emerald-500 w-full"
                      style={{ height: `${(revenueH / (totalH || 1)) * 100}%` }}
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-[40px] h-1 bg-gray-100 rounded" />
                )}
              </div>
              <span className="text-[10px] text-gray-400 mt-1">{d.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
