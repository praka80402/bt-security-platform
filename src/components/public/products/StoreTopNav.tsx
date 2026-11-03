"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Camera,
  HardDrive,
  Cpu,
  Layers,
  ShieldCheck,
  Package,
  Wrench,
  Sparkles,
  Zap
} from "lucide-react";

interface StoreTopNavProps {
  currentCategory?: string;
  currentBrand?: string;
  onSelectCategory: (cat: string, sub?: string) => void;
  onSelectBrand: (brand: string) => void;
}

export default function StoreTopNav({
  currentCategory,
  currentBrand,
  onSelectCategory,
  onSelectBrand,
}: StoreTopNavProps) {
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);

  const catRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatMenuOpen(false);
      }
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) {
        setBrandMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const CATEGORY_GROUPS = [
    {
      title: "CCTV Cameras",
      cat: "CCTV_CAMERA",
      icon: Camera,
      items: [
        { label: "All CCTV Cameras", sub: "" },
        { label: "IP Bullet Cameras (Outdoor)", sub: "IP_BULLET" },
        { label: "IP Dome Cameras (Ceiling)", sub: "IP_DOME" },
        { label: "Analog Bullet Cameras (Full Color)", sub: "ANALOG_BULLET" },
        { label: "Analog Dome Cameras (HD Audio)", sub: "ANALOG_DOME" },
        { label: "Wi-Fi 360° PT Smart Cameras", sub: "WIFI_360" },
        { label: "PTZ Zoom & Solar 4G Cameras", sub: "PTZ_CAMERA" },
      ],
    },
    {
      title: "DVR & NVR Recorders",
      cat: "NVR_DVR",
      icon: Cpu,
      items: [
        { label: "All Recorders", sub: "" },
        { label: "4 Channel HD DVRs", sub: "4CH_DVR" },
        { label: "8 Channel HD DVRs", sub: "8CH_DVR" },
        { label: "16 Channel Commercial DVRs", sub: "16CH_DVR" },
        { label: "4CH / 8CH PoE NVRs", sub: "POE_NVR" },
        { label: "16CH / 32CH 4K NVRs", sub: "4K_NVR" },
      ],
    },
    {
      title: "CCTV Combo Kits",
      cat: "CCTV_KIT",
      icon: Package,
      items: [
        { label: "All CCTV Kits", sub: "" },
        { label: "4 Camera Complete Setup", sub: "4CH_KIT" },
        { label: "8 Camera Commercial Kit", sub: "8CH_KIT" },
        { label: "Custom CCTV Kit Configurator", sub: "BUILDER" },
      ],
    },
    {
      title: "Surveillance Hard Drives",
      cat: "STORAGE_HDD",
      icon: HardDrive,
      items: [
        { label: "All Hard Drives", sub: "" },
        { label: "1TB Seagate SkyHawk HDD", sub: "1TB_HDD" },
        { label: "2TB Seagate SkyHawk HDD", sub: "2TB_HDD" },
        { label: "4TB WD Purple Surveillance HDD", sub: "4TB_HDD" },
      ],
    },
    {
      title: "Biometrics & Attendance",
      cat: "BIOMETRIC_ATTENDANCE",
      icon: ShieldCheck,
      items: [
        { label: "All Biometric Systems", sub: "" },
        { label: "Fingerprint Attendance (eSSL)", sub: "FINGERPRINT" },
        { label: "AI Face Recognition (Realtime)", sub: "FACE_ATTENDANCE" },
        { label: "Card & RFID Attendance", sub: "CARD_ACCESS" },
      ],
    },
    {
      title: "Accessories & Cables",
      cat: "ACCESSORIES",
      icon: Zap,
      items: [
        { label: "All Accessories", sub: "" },
        { label: "3+1 Pure Copper CCTV Cable", sub: "CABLE" },
        { label: "Cat6 UTP Network Cable", sub: "CAT6_CABLE" },
        { label: "SMPS Power Supply Metal Boxes", sub: "POWER_SUPPLY" },
        { label: "PoE Switches & Connectors", sub: "POE_SWITCH" },
      ],
    },
  ];

  const BRANDS_LIST = [
    { name: "CP Plus", tag: "Most Popular in India" },
    { name: "Hikvision", tag: "World No. 1 Surveillance" },
    { name: "Dahua", tag: "Smart AI & Starlight" },
    { name: "Prama", tag: "Make In India Security" },
    { name: "eSSL", tag: "Biometric & Attendance Leader" },
    { name: "Realtime", tag: "AI Face Recognition" },
    { name: "Seagate", tag: "SkyHawk Surveillance HDDs" },
    { name: "Western Digital", tag: "WD Purple Surveillance" },
    { name: "Sparsh", tag: "Indigenous Security Systems" },
    { name: "Matrix", tag: "Enterprise Telecom & Security" },
  ];

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 shadow-md sticky top-[97px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13 py-2 text-xs font-bold gap-3 overflow-x-auto no-scrollbar">
          
          {/* Left: Dropdowns */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Category Mega Dropdown */}
            <div className="relative" ref={catRef}>
              <button
                type="button"
                onClick={() => {
                  setCatMenuOpen(!catMenuOpen);
                  setBrandMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                  catMenuOpen
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                }`}
              >
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Shop by Category</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${catMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Mega Menu Flyout */}
              {catMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-[720px] max-w-[95vw] bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-6 grid grid-cols-2 sm:grid-cols-3 gap-6 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {CATEGORY_GROUPS.map((grp) => {
                    const IconComp = grp.icon;
                    return (
                      <div key={grp.title} className="space-y-2">
                        <div
                          onClick={() => {
                            onSelectCategory(grp.cat);
                            setCatMenuOpen(false);
                          }}
                          className="flex items-center gap-2 font-black text-xs text-blue-600 uppercase tracking-wider cursor-pointer hover:underline"
                        >
                          <IconComp className="w-4 h-4" />
                          <span>{grp.title}</span>
                        </div>
                        <ul className="space-y-1.5 pl-1">
                          {grp.items.map((sub) => (
                            <li key={sub.label}>
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectCategory(grp.cat, sub.sub);
                                  setCatMenuOpen(false);
                                }}
                                className="text-xs text-slate-600 hover:text-blue-600 hover:font-bold transition text-left block w-full py-0.5"
                              >
                                {sub.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Brand Dropdown */}
            <div className="relative" ref={brandRef}>
              <button
                type="button"
                onClick={() => {
                  setBrandMenuOpen(!brandMenuOpen);
                  setCatMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                  brandMenuOpen
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Shop by Brand</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${brandMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Brand Menu Flyout */}
              {brandMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 font-black text-xs text-slate-400 uppercase tracking-wider">
                    Authorized Partner Brands
                  </div>
                  <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
                    {BRANDS_LIST.map((b) => (
                      <button
                        key={b.name}
                        type="button"
                        onClick={() => {
                          onSelectBrand(b.name);
                          setBrandMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between text-xs transition ${
                          currentBrand === b.name
                            ? "bg-blue-50 text-blue-700 font-bold"
                            : "hover:bg-slate-50 text-slate-800"
                        }`}
                      >
                        <span className="font-bold">{b.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{b.tag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Direct Links (CCTV Cart Style) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onSelectCategory("CCTV_KIT")}
              className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 transition text-xs flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5 text-purple-400" />
              <span>4CH / 8CH Complete Kits</span>
            </button>
            <button
              onClick={() => onSelectCategory("STORAGE_HDD")}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs flex items-center gap-1.5"
            >
              <HardDrive className="w-3.5 h-3.5 text-sky-400" />
              <span>Surveillance HDDs</span>
            </button>
            <Link
              href="/calculator"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span>Storage Calculator</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
