"use client";

import React from "react";

interface BrandShowcaseProps {
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  brandCounts?: Record<string, number>;
  onSelectKit?: () => void;
  isKitSelected?: boolean;
}

export default function BrandShowcase({
  selectedBrand,
  onSelectBrand,
  onSelectKit,
  isKitSelected = false,
}: BrandShowcaseProps) {
  const BRANDS = [
    {
      id: "hikvision",
      name: "Hikvision",
      logo: "/images/brands/hikvision.png",
      isKit: false,
    },
    {
      id: "prama",
      name: "Prama",
      logo: "/images/brands/prama.png",
      isKit: false,
    },
    {
      id: "ezviz",
      name: "EZVIZ",
      logo: "/images/brands/ezviz.png",
      isKit: false,
    },
    {
      id: "seagate",
      name: "Seagate",
      logo: "/images/brands/seagate.png",
      isKit: false,
    },
    {
      id: "cpplus",
      name: "CP Plus",
      logo: "/images/brands/cpplus.png",
      isKit: false,
    },
    {
      id: "cctvkits",
      name: "CCTV Kits",
      logo: "/images/brands/cctvkits.png",
      isKit: true,
    },
  ];

  return (
    <section className="mb-14 pt-2">
      {/* Section Header with 2-Tone Colors and Underline */}
      <div className="text-center mb-9">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight uppercase">
          <span className="text-[#0077B6]">SHOP BY </span>
          <span className="bg-gradient-to-r from-[#00B4D8] to-[#2EC4B6] bg-clip-text text-transparent">
            BRAND
          </span>
        </h2>
        {/* Dual-color accent line (Blue to Teal) */}
        <div className="flex items-center justify-center mt-2.5 mb-2.5">
          <div className="h-1 w-12 bg-[#0077B6] rounded-l-full"></div>
          <div className="h-1 w-12 bg-[#2EC4B6] rounded-r-full"></div>
        </div>
        <p className="text-sm sm:text-base text-slate-500 font-medium">
          Discover our trusted brands
        </p>

        {(selectedBrand || isKitSelected) && (
          <div className="mt-3">
            <button
              onClick={() => onSelectBrand("")}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            >
              <span>Selected: {isKitSelected ? "CCTV Kits" : selectedBrand}</span>
              <span className="text-[10px] ml-1 font-extrabold underline">Clear filter</span>
            </button>
          </div>
        )}
      </div>

      {/* 3 Columns Grid matching cctvcart.in */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {BRANDS.map((b) => {
          const isActive = b.isKit ? isKitSelected : selectedBrand === b.name;

          return (
            <div
              key={b.id}
              onClick={() => {
                if (b.isKit) {
                  if (onSelectKit) onSelectKit();
                  else onSelectBrand(isActive ? "" : "CCTV_KIT");
                } else {
                  onSelectBrand(isActive ? "" : b.name);
                }
              }}
              className={`group relative h-36 sm:h-44 rounded-3xl border transition-all duration-300 flex items-center justify-center p-6 sm:p-8 cursor-pointer select-none overflow-hidden ${
                isActive
                  ? "bg-gradient-to-r from-[#2998ec] via-[#38bdf8] to-[#48d597] border-transparent shadow-xl shadow-cyan-500/25 scale-[1.02] ring-2 ring-[#0077B6]/30"
                  : "bg-white border-slate-200/80 shadow-sm hover:bg-gradient-to-r hover:from-[#2998ec] hover:via-[#38bdf8] hover:to-[#48d597] hover:border-transparent hover:shadow-xl hover:shadow-cyan-500/25 hover:-translate-y-1.5 hover:scale-[1.02]"
              }`}
            >
              <img
                src={b.logo}
                alt={b.name}
                className="max-h-12 sm:max-h-16 max-w-[78%] object-contain transition-transform duration-300 group-hover:scale-105 pointer-events-none drop-shadow-sm"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
