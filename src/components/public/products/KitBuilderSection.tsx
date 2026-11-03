"use client";

import React, { useState, useMemo } from "react";
import {
  Package,
  Camera,
  HardDrive,
  Cpu,
  CheckCircle2,
  ShoppingBag,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Zap,
  Wrench
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function KitBuilderSection() {
  const { addToCart } = useCart();

  const [channelCount, setChannelCount] = useState<4 | 8>(4);
  const [brand, setBrand] = useState<"Hikvision" | "CP Plus">("Hikvision");
  const [domeCount, setDomeCount] = useState(2);
  const [hddChoice, setHddChoice] = useState<"1TB" | "2TB" | "NONE">("1TB");
  const [withInstallation, setWithInstallation] = useState(true);
  const [added, setAdded] = useState(false);

  // Bullet count is automatically (channelCount - domeCount)
  const bulletCount = channelCount - domeCount;

  // Pricing Matrix
  const BASE_PRICE = useMemo(() => {
    if (channelCount === 4) {
      return brand === "Hikvision" ? 6499 : 5699; // 4 Cameras + DVR + SMPS + 90m Wire + Connectors
    } else {
      return brand === "Hikvision" ? 11999 : 10499; // 8 Cameras + 8CH DVR + SMPS + 180m Wire
    }
  }, [channelCount, brand]);

  const HDD_PRICE = useMemo(() => {
    if (hddChoice === "1TB") return 3399;
    if (hddChoice === "2TB") return 4799;
    return 0;
  }, [hddChoice]);

  const INSTALLATION_PRICE = useMemo(() => {
    return withInstallation ? channelCount * 350 : 0;
  }, [withInstallation, channelCount]);

  const TOTAL_KIT_PRICE = BASE_PRICE + HDD_PRICE + INSTALLATION_PRICE;
  const TOTAL_MRP = Math.round(TOTAL_KIT_PRICE * 1.4);
  const SAVINGS = TOTAL_MRP - TOTAL_KIT_PRICE;

  const handleAddKitToCart = () => {
    const kitProduct = {
      id: 99000 + (channelCount === 4 ? 400 : 800) + (brand === "Hikvision" ? 1 : 2),
      name: `${brand} ${channelCount}-Camera Complete CCTV Setup (${domeCount} Dome + ${bulletCount} Bullet + ${hddChoice} HDD)`,
      slug: `${brand.toLowerCase()}-${channelCount}ch-custom-cctv-kit`,
      brand,
      category: "CCTV_KIT",
      modelNumber: `CUSTOM-${brand.slice(0, 3).toUpperCase()}-${channelCount}CH`,
      price: BASE_PRICE + HDD_PRICE,
      mrp: TOTAL_MRP,
      imageUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      withInstallation,
    };

    addToCart(kitProduct, 1, withInstallation);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Yash Enterprises,\nI want to order custom CCTV Kit:\n• ${brand} ${channelCount} Channel Setup\n• Cameras: ${domeCount} Dome + ${bulletCount} Bullet\n• Hard Disk: ${hddChoice} Surveillance HDD\n• Installation in Bihar: ${withInstallation ? "YES (+₹" + INSTALLATION_PRICE + ")" : "NO"}\n• Estimated Total: ₹${TOTAL_KIT_PRICE.toLocaleString("en-IN")}`
  );

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl mb-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Interactive Kit Builder
              </span>
              <span className="text-xs text-slate-400">cctvcart-style Configurator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Build Your Complete CCTV Surveillance Kit
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Select your cameras, storage &amp; installation. Instant price calculator with 1-click cart addition.
            </p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/60 text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Starting From</span>
            <span className="text-2xl font-black text-emerald-400">₹8,499</span>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1 & 2: Interactive Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Channel Count & Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Setup Size */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                <label className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                  1. Choose Setup Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setChannelCount(4);
                      setDomeCount(2);
                    }}
                    className={`py-3 px-3 rounded-xl text-xs font-extrabold transition border ${
                      channelCount === 4
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"
                    }`}
                  >
                    4 Channel Setup
                    <span className="block text-[10px] font-normal opacity-80 mt-0.5">Homes &amp; Shops</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setChannelCount(8);
                      setDomeCount(4);
                    }}
                    className={`py-3 px-3 rounded-xl text-xs font-extrabold transition border ${
                      channelCount === 8
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"
                    }`}
                  >
                    8 Channel Setup
                    <span className="block text-[10px] font-normal opacity-80 mt-0.5">Offices &amp; Godowns</span>
                  </button>
                </div>
              </div>

              {/* Brand Choice */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                <label className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                  2. Choose Preferred Brand
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBrand("Hikvision")}
                    className={`py-3 px-3 rounded-xl text-xs font-extrabold transition border ${
                      brand === "Hikvision"
                        ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"
                    }`}
                  >
                    Hikvision
                    <span className="block text-[10px] font-normal opacity-80 mt-0.5">Turbo HD 5MP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBrand("CP Plus")}
                    className={`py-3 px-3 rounded-xl text-xs font-extrabold transition border ${
                      brand === "CP Plus"
                        ? "bg-sky-600 border-sky-500 text-white shadow-lg shadow-sky-600/30"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"
                    }`}
                  >
                    CP Plus
                    <span className="block text-[10px] font-normal opacity-80 mt-0.5">Cosmic HD 2.4MP</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Camera Mix (Dome vs Bullet) */}
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  3. Indoor vs Outdoor Camera Ratio (Total {channelCount} Cameras)
                </label>
                <span className="text-xs font-bold text-amber-400">
                  {domeCount} Indoor Dome + {bulletCount} Outdoor Bullet
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={channelCount}
                value={domeCount}
                onChange={(e) => setDomeCount(parseInt(e.target.value, 10))}
                className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>All Bullets (Outdoor)</span>
                <span>Balanced Mix</span>
                <span>All Domes (Indoor)</span>
              </div>
            </div>

            {/* Step 3: Hard Drive Storage */}
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                4. Surveillance Hard Drive (Seagate SkyHawk 24x7)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setHddChoice("1TB")}
                  className={`p-3 rounded-xl border text-left transition ${
                    hddChoice === "1TB"
                      ? "bg-blue-600/20 border-blue-500 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span className="font-bold text-sm block">1 TB SkyHawk</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Approx 15-20 days recording</span>
                  <span className="text-xs font-black text-emerald-400 block mt-1">+₹3,399</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHddChoice("2TB")}
                  className={`p-3 rounded-xl border text-left transition ${
                    hddChoice === "2TB"
                      ? "bg-blue-600/20 border-blue-500 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span className="font-bold text-sm block">2 TB SkyHawk</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Approx 30-40 days recording</span>
                  <span className="text-xs font-black text-emerald-400 block mt-1">+₹4,799</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHddChoice("NONE")}
                  className={`p-3 rounded-xl border text-left transition ${
                    hddChoice === "NONE"
                      ? "bg-blue-600/20 border-blue-500 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span className="font-bold text-sm block">No Hard Drive</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">I already have storage</span>
                  <span className="text-xs font-black text-slate-400 block mt-1">₹0</span>
                </button>
              </div>
            </div>

            {/* Step 4: Installation Checkbox */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={withInstallation}
                  onChange={(e) => setWithInstallation(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 text-blue-600 focus:ring-0"
                />
                <div>
                  <span className="font-bold text-xs text-white block">
                    Include Doorstep Professional Installation (Patna &amp; Bihar)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Wiring, camera mounting, DVR setup, mobile app configuration &amp; testing
                  </span>
                </div>
              </label>
              <span className="text-xs font-black text-blue-400 whitespace-nowrap pl-4">
                +₹{channelCount * 350} (₹350/cam)
              </span>
            </div>
          </div>

          {/* Column 3: Live Kit Summary Box */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-black text-sm text-white">Your Kit Includes:</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                  READY TO INSTALL
                </span>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>{channelCount} Cameras:</strong> {domeCount} Dome + {bulletCount} Bullet
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>{brand} DVR:</strong> {channelCount} Channel HD with Mobile App
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Storage:</strong> {hddChoice === "NONE" ? "No HDD Included" : `${hddChoice} Seagate SkyHawk 24x7`}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Cables:</strong> {channelCount === 4 ? "90m" : "180m"} Pure Copper 3+1 Roll
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Power Supply:</strong> {channelCount} Channel 12V SMPS Metal Box
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Connectors:</strong> {channelCount * 2} BNC + {channelCount} DC Pins
                  </span>
                </li>
                {withInstallation && (
                  <li className="flex items-center gap-2 text-blue-400 font-bold">
                    <Wrench className="w-4 h-4 shrink-0" />
                    <span>Doorstep Installation by Certified Engineer</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Kit Total</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">
                      ₹{TOTAL_KIT_PRICE.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-slate-500 line-through">
                      ₹{TOTAL_MRP.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  Save ₹{SAVINGS.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleAddKitToCart}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30"
                  }`}
                >
                  {added ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Kit Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add Complete Kit to Cart</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/919308907319?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Kit Inquiry</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
