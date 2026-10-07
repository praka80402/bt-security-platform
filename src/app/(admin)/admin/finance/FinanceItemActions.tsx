"use client";

import { deleteFinanceRecord } from "./actions";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function FinanceItemActions({ id, isInvoice }: { id: number, isInvoice: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    setLoading(true);
    await deleteFinanceRecord(id);
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2 mt-2 justify-end">
      {isInvoice && (
        <Link 
          href={`/admin/finance/invoice/new?editId=${id}`}
          className="text-xs flex items-center gap-1 font-medium text-amber-600 hover:underline border border-amber-200 bg-amber-50 px-2 py-1 rounded transition"
        >
          <Edit className="w-3 h-3" /> Edit
        </Link>
      )}
      <button 
        onClick={handleDelete}
        disabled={loading}
        className="text-xs flex items-center gap-1 font-medium text-rose-600 hover:underline border border-rose-200 bg-rose-50 px-2 py-1 rounded transition disabled:opacity-50"
      >
        <Trash2 className="w-3 h-3" /> Delete
      </button>
    </div>
  );
}
