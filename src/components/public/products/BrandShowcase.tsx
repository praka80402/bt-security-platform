"use client";

import React from "react";
import { Sparkles, Check } from "lucide-react";

interface BrandShowcaseProps {
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  brandCounts: Record<string, number>;
}

export default function BrandShowcase({
  selectedBrand,
  onSelectBrand,
  brandCounts,
}: BrandShowcaseProps) {
  const BRANDS = [
    { name: "CP Plus", color: "text-slate-900 border-slate-300" },
    { name: "Hikvision", color: "text-red-600 border-red-200" },
    { name: "Dahua", color: "text-sky-700 border-sky-200" },
    { name: "Prama", color: "text-emerald-700 border-emerald-200" },
    { name: "eSSL", color: "text-emerald-800 border-emerald-200" },
    { name: "Realtime", color: "text-purple-800 border-purple-200" },
    { name: "Seagate", color: "text-teal-700 border-teal-200" },
    { name: "Western Digital", color: "text-indigo-800 border-indigo-200" },
    { name: "Matrix", color: "text-amber-900 border-amber-200" },
    { name: "Sparsh", color: "text-orange-700 border-orange-200" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm mb-8 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-700">
            Shop by Authorized Brand
          </span>
        </div>
        {selectedBrand && (
          <button
            onClick={() => onSelectBrand("")}
            className="text-[11px] font-bold text-blue-600 hover:underline"
          >
            Clear Brand Filter
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onSelectBrand("")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            !selectedBrand
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          <span>All Brands</span>
        </button>

        {BRANDS.map((b) => {
          const isActive = selectedBrand === b.name;
          const count = brandCounts[b.name] || 0;

          return (
            <button
              key={b.name}
              onClick={() => onSelectBrand(isActive ? "" : b.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                isActive
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/30 scale-105"
                  : `bg-slate-50/80 hover:bg-white text-slate-800 border-slate-200 hover:border-slate-300`
              }`}
            >
              <span>{b.name}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
