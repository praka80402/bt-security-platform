"use client";

import React from "react";

interface CategoryShowcaseProps {
  selectedCategory: string;
  selectedSubCategory?: string;
  onSelectCategory: (cat: string, subCat?: string) => void;
  counts: Record<string, number>;
}

export default function CategoryShowcase({
  selectedCategory,
  selectedSubCategory = "",
  onSelectCategory,
  counts,
}: CategoryShowcaseProps) {
  const CATEGORIES = [
    {
      id: "CCTV_CAMERA_IP",
      title: "IP Camera",
      category: "CCTV_CAMERA",
      subCategory: "IP_CAMERA",
      image: "/images/categories/ip_camera.png",
    },
    {
      id: "CCTV_CAMERA_ANALOG",
      title: "Analog Camera",
      category: "CCTV_CAMERA",
      subCategory: "ANALOG_BULLET",
      image: "/images/categories/analog_camera.png",
    },
    {
      id: "NVR_DVR_DVR",
      title: "DVR",
      category: "NVR_DVR",
      subCategory: "DVR",
      image: "/images/categories/dvr.png",
    },
    {
      id: "NVR_DVR_NVR",
      title: "NVR",
      category: "NVR_DVR",
      subCategory: "NVR",
      image: "/images/categories/nvr.png",
    },
    {
      id: "STORAGE_HDD",
      title: "Hard Drives",
      category: "STORAGE_HDD",
      subCategory: "",
      image: "/images/categories/hard_drives.png",
    },
    {
      id: "BIOMETRIC_ATTENDANCE",
      title: "Access Control",
      category: "BIOMETRIC_ATTENDANCE",
      subCategory: "",
      image: "/images/categories/access_control.png",
    },
    {
      id: "ACCESSORIES_VDP",
      title: "Video Door Phone",
      category: "ACCESSORIES",
      subCategory: "VDP",
      image: "/images/categories/video_door_phone.png",
    },
    {
      id: "ACCESSORIES_PANEL",
      title: "Interactive Panels",
      category: "ACCESSORIES",
      subCategory: "IFPD",
      image: "/images/categories/interactive_panels.png",
    },
  ];

  return (
    <section className="mb-14 pt-4">
      {/* Section Header with 2-Tone Underline */}
      <div className="text-center mb-9">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase">
          SHOP BY CATEGORY
        </h2>
        {/* Dual-color accent line (Blue to Teal) */}
        <div className="flex items-center justify-center mt-2.5 mb-2.5">
          <div className="h-1 w-12 bg-[#0077B6] rounded-l-full"></div>
          <div className="h-1 w-12 bg-[#2EC4B6] rounded-r-full"></div>
        </div>
        <p className="text-sm sm:text-base text-slate-500 font-medium">
          Discover our curated collections
        </p>

        {selectedCategory && (
          <div className="mt-3">
            <button
              onClick={() => onSelectCategory("", "")}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            >
              <span>Showing: {selectedCategory.replace(/_/g, " ")}</span>
              <span className="text-[10px] ml-1 font-extrabold underline">Clear filter</span>
            </button>
          </div>
        )}
      </div>

      {/* 4 Columns x 2 Rows Grid matching cctvcart.in */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {CATEGORIES.map((cat) => {
          const isCategoryMatch = selectedCategory === cat.category;
          const isSubMatch = !cat.subCategory || selectedSubCategory === cat.subCategory;
          const isActive = isCategoryMatch && isSubMatch;

          return (
            <div
              key={cat.id}
              onClick={() => {
                if (isActive) {
                  onSelectCategory("", "");
                } else {
                  onSelectCategory(cat.category, cat.subCategory);
                }
              }}
              className={`group relative rounded-3xl bg-white border-2 transition-all duration-300 p-5 sm:p-6 flex flex-col items-center justify-between text-center cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1.5 select-none ${
                isActive
                  ? "border-[#0077B6] shadow-[0_12px_28px_rgba(0,119,182,0.18)] ring-2 ring-[#0077B6]/20 bg-sky-50/20"
                  : "border-slate-200/80 hover:border-[#00B4D8] hover:shadow-[0_14px_32px_rgba(0,180,216,0.18)]"
              }`}
            >
              {/* Inner Floating Squircle Tile with Soft Drop-Shadow */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-3 sm:p-4 mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="max-w-full max-h-full object-contain filter drop-shadow-sm pointer-events-none"
                  loading="lazy"
                />
              </div>

              {/* Category Title below tile */}
              <h3
                className={`font-bold text-sm sm:text-base tracking-tight transition-colors duration-200 ${
                  isActive
                    ? "text-[#0077B6] font-extrabold"
                    : "text-slate-900 group-hover:text-[#0077B6]"
                }`}
              >
                {cat.title}
              </h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}
