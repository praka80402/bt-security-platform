"use client";

import React from "react";
import { ShieldCheck, Award, Clock, ThumbsUp, MapPin } from "lucide-react";

const CITIES = [
  { name: "Patna (HQ)", x: 50, y: 55, color: "bg-blue-500" },
  { name: "Hajipur", x: 52, y: 43, color: "bg-emerald-500" },
  { name: "Muzaffarpur", x: 58, y: 25, color: "bg-purple-500" },
  { name: "Chapra", x: 35, y: 44, color: "bg-pink-500" },
  { name: "Ara", x: 30, y: 60, color: "bg-orange-500" },
  { name: "Buxar", x: 12, y: 65, color: "bg-red-500" },
  { name: "Masaurhi", x: 48, y: 72, color: "bg-teal-500" },
  { name: "Gaya", x: 42, y: 88, color: "bg-yellow-500" },
  { name: "Bakhtiarpur", x: 65, y: 56, color: "bg-indigo-500" },
  { name: "Barh", x: 75, y: 58, color: "bg-cyan-500" },
];

export default function ServiceAreas() {
  return (
    <section className="bg-slate-950 py-20 px-4 border-y border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT: Why Trust Us */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Customers Trust Us</h2>
            <p className="text-slate-400 text-sm md:text-base">
              We provide end-to-end CCTV and security solutions with a commitment to quality, reliability, and fast support across Bihar.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Certified Professionals</h4>
                <p className="text-slate-400 text-sm mt-1">Our engineers and technicians are highly trained and certified by top security brands.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Fast Response Time</h4>
                <p className="text-slate-400 text-sm mt-1">We guarantee a 24 to 48-hour resolution time for all service and maintenance requests.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Genuine Products</h4>
                <p className="text-slate-400 text-sm mt-1">We only deal in 100% genuine, branded hardware with official manufacturer warranties.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20">
                <ThumbsUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">1-Year Free Service</h4>
                <p className="text-slate-400 text-sm mt-1">Every new installation comes with a comprehensive 1-year free on-site service warranty.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Service Map */}
        <div className="bg-slate-900 rounded-3xl p-5 md:p-8 border border-slate-800 shadow-2xl relative">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-xl md:text-2xl font-bold text-white">Our Service Areas in Bihar</h3>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Actively Serving
            </div>
          </div>

          {/* Abstract Map Area */}
          <div className="relative w-full aspect-square md:aspect-[4/3] bg-[#090d16] rounded-2xl border border-slate-800 overflow-hidden shadow-inner">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            {/* Connection Lines (from Patna to others) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
              {CITIES.map((city, i) => {
                if (city.name === "Patna (HQ)") return null;
                return (
                  <line 
                    key={`line-${i}`}
                    x1="50%" y1="55%" 
                    x2={`${city.x}%`} y2={`${city.y}%`} 
                    stroke="white" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 4"
                  />
                );
              })}
            </svg>

            {/* City Nodes */}
            {CITIES.map((city, i) => {
              const isHQ = city.name === "Patna (HQ)";
              return (
                <div 
                  key={`city-${i}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 group z-10 cursor-pointer"
                  style={{ left: `${city.x}%`, top: `${city.y}%` }}
                >
                  <div className={`relative flex items-center justify-center ${isHQ ? 'w-6 h-6' : 'w-4 h-4'}`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${city.color} opacity-40`}></span>
                    <span className={`relative inline-flex rounded-full ${city.color} shadow-[0_0_15px_currentColor] ${isHQ ? 'w-4 h-4' : 'w-2.5 h-2.5'}`}></span>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md bg-slate-900/90 backdrop-blur-sm border border-slate-700 text-[10px] md:text-xs font-bold text-white shadow-lg whitespace-nowrap transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${isHQ ? 'ring-1 ring-blue-500/50' : ''}`}>
                    {city.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
      </div>
    </section>
  );
}
