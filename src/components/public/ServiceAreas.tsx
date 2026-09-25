"use client";

import React from "react";
import { ShieldCheck, Award, Clock, ThumbsUp, MapPin } from "lucide-react";

const CITIES = [
  { name: "Patna (HQ)", x: 50, y: 55, color: "bg-blue-500" },
  { name: "Khagaul", x: 47, y: 57, color: "bg-blue-400" },
  { name: "Arrah", x: 30, y: 60, color: "bg-orange-500" },
  { name: "Buxar", x: 12, y: 65, color: "bg-red-500" },
  { name: "Hajipur", x: 52, y: 43, color: "bg-emerald-500" },
  { name: "Chapra", x: 35, y: 44, color: "bg-pink-500" },
  { name: "Muzaffarpur", x: 58, y: 25, color: "bg-purple-500" },
  { name: "Masaurhi", x: 48, y: 72, color: "bg-teal-500" },
  { name: "Barh", x: 75, y: 58, color: "bg-cyan-500" },
  { name: "Bakhtiarpur", x: 65, y: 56, color: "bg-indigo-500" },
  { name: "Jehanabad", x: 45, y: 78, color: "bg-rose-500" },
  { name: "Nalanda", x: 60, y: 75, color: "bg-amber-500" },
  { name: "Gaya", x: 42, y: 88, color: "bg-yellow-500" },
  { name: "Gopalganj", x: 20, y: 20, color: "bg-lime-500" },
];

export default function ServiceAreas() {
  return (
    <section className="bg-white py-20 px-4 border-y border-slate-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT: Why Trust Us */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Customers Trust Us</h2>
            <p className="text-slate-600 text-sm md:text-base">
              We provide end-to-end CCTV and security solutions with a commitment to quality, reliability, and fast support across Bihar.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-900 font-bold text-lg">Certified Professionals</h4>
                <p className="text-slate-600 text-sm mt-1">Our engineers and technicians are highly trained and certified by top security brands.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-900 font-bold text-lg">Fast Response Time</h4>
                <p className="text-slate-600 text-sm mt-1">We guarantee a 24 to 48-hour resolution time for all service and maintenance requests.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-900 font-bold text-lg">Genuine Products</h4>
                <p className="text-slate-600 text-sm mt-1">We only deal in 100% genuine, branded hardware with official manufacturer warranties.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
                <ThumbsUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-900 font-bold text-lg">1-Year Free Service</h4>
                <p className="text-slate-600 text-sm mt-1">Every new installation comes with a comprehensive 1-year free on-site service warranty.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Service Map */}
        <div className="bg-slate-50 rounded-3xl p-5 md:p-8 border border-slate-200 shadow-lg relative">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900">Our Service Areas in Bihar</h3>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Actively Serving
            </div>
          </div>

          {/* Abstract Map Area */}
          <div className="relative w-full aspect-square md:aspect-[4/3] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
            
            {/* Bihar Map Silhouette Background */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full text-slate-100 opacity-[0.85] pointer-events-none" aria-hidden="true">
              <path 
                d="M 10.0,64.2 L 12.7,69.3 L 21.5,70.6 L 22.3,72.3 L 23.8,72.1 L 25.9,72.0 L 26.2,73.9 L 28.8,75.8 L 31.5,74.3 L 34.4,72.5 L 38.3,73.7 L 40.8,73.0 L 46.2,71.4 L 48.9,67.4 L 58.2,71.2 L 66.1,71.0 L 71.9,63.8 L 77.1,59.7 L 80.0,59.6 L 83.0,60.2 L 81.5,57.9 L 82.8,57.0 L 83.8,56.2 L 85.1,56.3 L 85.9,56.7 L 86.2,56.0 L 85.7,54.9 L 86.0,54.1 L 85.2,52.9 L 84.4,52.4 L 83.7,52.0 L 83.9,51.4 L 83.6,51.1 L 83.7,50.7 L 82.5,50.4 L 82.5,49.6 L 82.8,48.9 L 83.7,47.4 L 84.5,47.3 L 84.8,46.8 L 85.0,46.4 L 85.5,45.9 L 86.3,45.7 L 86.7,45.3 L 87.1,44.9 L 87.5,44.5 L 88.8,43.9 L 89.4,43.1 L 89.7,43.2 L 90.0,42.8 L 89.4,42.4 L 89.6,41.7 L 88.9,40.8 L 88.5,40.2 L 88.6,39.6 L 88.0,39.8 L 86.8,40.3 L 85.9,42.1 L 85.3,42.6 L 83.1,41.0 L 80.4,41.6 L 74.4,42.7 L 72.7,42.0 L 69.1,40.0 L 63.1,40.7 L 56.9,38.9 L 53.3,37.8 L 52.7,37.9 L 52.2,38.5 L 50.8,38.9 L 48.7,37.0 L 45.0,35.5 L 41.4,36.3 L 38.8,34.4 L 37.5,34.4 L 36.6,33.5 L 34.7,32.5 L 33.9,32.3 L 33.3,32.1 L 31.3,31.4 L 31.6,30.9 L 31.8,30.3 L 32.0,28.8 L 25.4,26.0 L 22.7,24.0 L 20.9,25.3 L 20.5,28.8 L 21.0,31.4 L 24.8,36.1 L 21.0,40.0 L 21.3,41.5 L 23.2,44.3 L 24.2,48.5 L 30.7,52.1 L 27.8,53.1 L 21.9,54.4 L 18.1,57.5 L 16.7,58.1 L 15.2,59.1 L 12.8,60.0 L 10.5,62.0 Z" 
                fill="currentColor" 
                stroke="#cbd5e1" 
                strokeWidth="0.5"
                transform="translate(0, -5) scale(1.05)"
              />
            </svg>
            
            {/* Connection Lines (from Patna to others) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
              {CITIES.map((city, i) => {
                if (city.name === "Patna (HQ)") return null;
                return (
                  <line 
                    key={`line-${i}`}
                    x1="50%" y1="55%" 
                    x2={`${city.x}%`} y2={`${city.y}%`} 
                    stroke="#94a3b8" 
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
                    <span className={`relative inline-flex rounded-full ${city.color} shadow-[0_0_10px_currentColor] ${isHQ ? 'w-4 h-4' : 'w-2.5 h-2.5'}`}></span>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[10px] md:text-xs font-bold text-slate-800 shadow-md whitespace-nowrap transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${isHQ ? 'ring-1 ring-blue-200' : ''}`}>
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
