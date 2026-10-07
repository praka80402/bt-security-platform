"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

export default function MonthYearFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const month = searchParams.get("m") || "";
  const year = searchParams.get("y") || "";

  const updateFilter = (newMonth: string, newYear: string) => {
    const params = new URLSearchParams();
    if (newMonth) params.set("m", newMonth);
    if (newYear) params.set("y", newYear);
    router.push(`?${params.toString()}`);
  };

  const handleClear = () => {
    router.push("?");
  };

  return (
    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-2 shadow-sm">
      <Filter className="w-4 h-4 text-slate-400 ml-1" />
      <select 
        value={month} 
        onChange={(e) => updateFilter(e.target.value, year)}
        className="bg-slate-50 border border-slate-200 text-sm rounded p-1 outline-none"
      >
        <option value="">All Months</option>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
      
      <select 
        value={year} 
        onChange={(e) => updateFilter(month, e.target.value)}
        className="bg-slate-50 border border-slate-200 text-sm rounded p-1 outline-none"
      >
        <option value="">All Years</option>
        <option value="2024">2024</option>
        <option value="2025">2025</option>
        <option value="2026">2026</option>
        <option value="2027">2027</option>
      </select>
      
      {(month || year) && (
        <button type="button" onClick={handleClear} className="text-rose-600 hover:bg-rose-50 text-xs font-bold px-3 py-1.5 rounded transition">
          Clear
        </button>
      )}
    </div>
  );
}
