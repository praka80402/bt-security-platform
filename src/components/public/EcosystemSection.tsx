"use client";

import React from "react";
import { Camera, HardDrive, Cpu, MonitorPlay, Wrench } from "lucide-react";

const NODES = [
  {
    id: "cameras",
    title: "Cameras",
    icon: Camera,
    textColor: "text-blue-600",
    glowClass: "border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.2)]",
    glowColor: "#3b82f6",
    pos: { top: "15%", left: "50%" },
    coords: { x2: 50, y2: 15 },
  },
  {
    id: "recorder",
    title: "Recorder",
    icon: HardDrive,
    textColor: "text-blue-600",
    glowClass: "border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.2)]",
    glowColor: "#3b82f6",
    pos: { top: "39.2%", left: "83.3%" },
    coords: { x2: 83.3, y2: 39.2 },
  },
  {
    id: "software",
    title: "Software",
    icon: MonitorPlay,
    textColor: "text-emerald-600",
    glowClass: "border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    glowColor: "#10b981",
    pos: { top: "78.3%", left: "70.6%" },
    coords: { x2: 70.6, y2: 78.3 },
  },
  {
    id: "ai",
    title: "AI",
    icon: Cpu,
    textColor: "text-emerald-600",
    glowClass: "border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    glowColor: "#10b981",
    pos: { top: "78.3%", left: "29.4%" },
    coords: { x2: 29.4, y2: 78.3 },
  },
  {
    id: "services",
    title: "Services",
    icon: Wrench,
    textColor: "text-orange-600",
    glowClass: "border-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.2)]",
    glowColor: "#f97316",
    pos: { top: "39.2%", left: "16.7%" },
    coords: { x2: 16.7, y2: 39.2 },
  }
];

export default function EcosystemSection() {
  return (
    <section className="relative bg-slate-50 pt-16 pb-24 px-4 text-center overflow-hidden border-t border-slate-200 relative z-10">
      <div className="max-w-4xl mx-auto space-y-4 mb-16 relative z-30">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">The Yash Ecosystem</h2>
        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
          A unified platform where hardware, software, networks, and intelligence function as one system
        </p>
      </div>

      <div className="relative w-full max-w-lg md:max-w-2xl mx-auto aspect-square z-30">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="#cbd5e1"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            fill="none"
          />
          {NODES.map((node, i) => (
            <g key={node.id}>
              <line
                x1="50"
                y1="50"
                x2={node.coords.x2}
                y2={node.coords.y2}
                stroke="#cbd5e1"
                strokeWidth="0.5"
              />
              <circle r="1" fill={node.glowColor}>
                <animate attributeName="cx" values={`50;${node.coords.x2}`} dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                <animate attributeName="cy" values={`50;${node.coords.y2}`} dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
        </svg>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-24 md:w-32 md:h-32 rounded-full border border-slate-200 bg-white flex items-center justify-center shadow-xl">
          <div className="text-slate-900 font-black text-xl md:text-2xl leading-tight">
            YASH<br/><span className="text-blue-600">CCTV</span>
          </div>
        </div>

        {NODES.map((node) => (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2.5 group"
            style={{ top: node.pos.top, left: node.pos.left }}
          >
            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl border bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 cursor-pointer ${node.glowClass} ${node.textColor}`}>
              <node.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
            </div>
            <span className={`text-[10px] md:text-xs font-bold tracking-wide ${node.textColor}`}>
              {node.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
