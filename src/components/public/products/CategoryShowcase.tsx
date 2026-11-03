"use client";

import React from "react";
import {
  Camera,
  Cpu,
  Package,
  HardDrive,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight
} from "lucide-react";

interface CategoryShowcaseProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  counts: Record<string, number>;
}

export default function CategoryShowcase({
  selectedCategory,
  onSelectCategory,
  counts,
}: CategoryShowcaseProps) {
  const CATEGORIES = [
    {
      id: "CCTV_CAMERA",
      title: "CCTV Cameras",
      subtitle: "IP & Analog HD (Color Night Vision)",
      count: counts["CCTV_CAMERA"] || 0,
      icon: Camera,
      gradient: "from-blue-600 to-indigo-700",
      bgLight: "bg-blue-50/70 border-blue-200/80 hover:border-blue-500",
      iconColor: "text-blue-600",
    },
    {
      id: "NVR_DVR",
      title: "DVR & NVR Storage",
      subtitle: "4CH, 8CH, 16CH, 4K PoE Systems",
      count: counts["NVR_DVR"] || 0,
      icon: Cpu,
      gradient: "from-cyan-600 to-blue-700",
      bgLight: "bg-cyan-50/70 border-cyan-200/80 hover:border-cyan-500",
      iconColor: "text-cyan-600",
    },
    {
      id: "CCTV_KIT",
      title: "CCTV Combo Kits",
      subtitle: "Complete 4 & 8 Camera Setup with HDD",
      count: counts["CCTV_KIT"] || 0,
      icon: Package,
      gradient: "from-purple-600 to-indigo-800",
      bgLight: "bg-purple-50/70 border-purple-200/80 hover:border-purple-500",
      iconColor: "text-purple-600",
      badge: "MOST POPULAR",
    },
    {
      id: "STORAGE_HDD",
      title: "Surveillance HDDs",
      subtitle: "Seagate SkyHawk & WD Purple 24x7",
      count: counts["STORAGE_HDD"] || 0,
      icon: HardDrive,
      gradient: "from-sky-600 to-blue-800",
      bgLight: "bg-sky-50/70 border-sky-200/80 hover:border-sky-500",
      iconColor: "text-sky-600",
    },
    {
      id: "BIOMETRIC_ATTENDANCE",
      title: "Biometrics & Face AI",
      subtitle: "eSSL & Realtime Attendance Machines",
      count: counts["BIOMETRIC_ATTENDANCE"] || 0,
      icon: ShieldCheck,
      gradient: "from-emerald-600 to-teal-800",
      bgLight: "bg-emerald-50/70 border-emerald-200/80 hover:border-emerald-500",
      iconColor: "text-emerald-600",
    },
    {
      id: "ACCESSORIES",
      title: "Cables, SMPS & PoE",
      subtitle: "3+1 Pure Copper, Cat6 & Power Supplies",
      count: counts["ACCESSORIES"] || 0,
      icon: Zap,
      gradient: "from-amber-600 to-orange-700",
      bgLight: "bg-amber-50/70 border-amber-200/80 hover:border-amber-500",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="mb-10 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-blue-600">
            Explore Surveillance Hardware
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Shop by Category
          </h2>
        </div>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory("")}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            View All Categories ({counts["ALL"] || 0})
          </button>
        )}
      </div>

      {/* Grid of Visual Category Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {CATEGORIES.map((cat) => {
          const IconComp = cat.icon;
          const isActive = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(isActive ? "" : cat.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                isActive
                  ? "bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.02]"
                  : `${cat.bgLight} shadow-sm hover:shadow-md hover:-translate-y-0.5`
              }`}
            >
              {/* Badge if present */}
              {cat.badge && (
                <span className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  {cat.badge}
                </span>
              )}

              <div>
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
                    isActive ? "bg-white/20 text-white" : "bg-white shadow-sm " + cat.iconColor
                  }`}
                >
                  <IconComp className="w-6 h-6" />
                </div>

                <h3
                  className={`font-black text-xs sm:text-sm leading-snug ${
                    isActive ? "text-white" : "text-slate-900"
                  }`}
                >
                  {cat.title}
                </h3>
                <p
                  className={`text-[10px] mt-1 line-clamp-2 leading-tight ${
                    isActive ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {cat.subtitle}
                </p>
              </div>

              <div
                className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] font-bold ${
                  isActive
                    ? "border-white/20 text-blue-400"
                    : "border-slate-200/60 text-slate-600 group-hover:text-blue-600"
                }`}
              >
                <span>{cat.count} Items</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
