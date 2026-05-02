"use client";

import { useMemo } from "react";
import type { SavedInvoice } from "@/lib/storage";
import { CURRENCIES } from "@/lib/types";

interface Props {
  invoices: SavedInvoice[];
}

function formatAmount(amount: number, currency: string): string {
  const cur = CURRENCIES[currency];
  const formatted = amount.toFixed(2);
  return cur ? `${formatted} ${cur.symbol}` : formatted;
}

export default function TopClients({ invoices }: Props) {
  const topClients = useMemo(() => {
    const map = new Map<string, { name: string; total: number; count: number; currency: string }>();

    invoices.forEach((inv) => {
      const name = inv.buyerName || inv.buyerNameEn || "غير محدد";
      const existing = map.get(name);
      if (existing) {
        existing.total += inv.totalAmount;
        existing.count += 1;
      } else {
        map.set(name, { name, total: inv.totalAmount, count: 1, currency: inv.currency });
      }
    });

    return Array.from(map.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [invoices]);

  const maxTotal = topClients[0]?.total || 1;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4">
        أكبر العملاء <span className="text-gray-400 font-normal text-sm">/ Top Clients</span>
      </h3>

      {topClients.length === 0 ? (
        <div className="text-center text-gray-400 text-sm py-8">لا توجد بيانات</div>
      ) : (
        <div className="space-y-3">
          {topClients.map((client, idx) => (
            <div key={client.name} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 truncate">{client.name}</span>
                  <span className="text-sm font-bold text-gray-800 shrink-0 mr-2" dir="ltr">
                    {formatAmount(client.total, client.currency)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${(client.total / maxTotal) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {client.count} فاتورة
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
