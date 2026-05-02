"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import InvoiceForm from "@/components/InvoiceForm";

function CreateContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  return <InvoiceForm editInvoiceId={editId || undefined} />;
}

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      }
    >
      <CreateContent />
    </Suspense>
  );
}
