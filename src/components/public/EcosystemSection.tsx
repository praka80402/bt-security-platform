"use client";

import React from "react";
import { Camera, HardDrive, Cpu, MonitorPlay, Wrench } from "lucide-react";

const NODES = [
  {
    id: "cameras",
    title: "Cameras",
    icon: Camera,
    textColor: "text-blue-500",
    glowClass: "border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    glowColor: "#3b82f6",
    pos: { top: "15%", left: "50%" },
    coords: { x2: 50, y2: 15 },
  },
  {
    id: "recorder",
    title: "Recorder",
    icon: HardDrive,
    textColor: "text-blue-500",
    glowClass: "border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    glowColor: "#3b82f6",
    pos: { top: "39.2%", left: "83.3%" },
    coords: { x2: 83.3, y2: 39.2 },
  },
  {
    id: "software",
    title: "Software",
    icon: MonitorPlay,
    textColor: "text-green-500",
    glowClass: "border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]",
    glowColor: "#22c55e",
    pos: { top: "78.3%", left: "70.6%" },
    coords: { x2: 70.6, y2: 78.3 },
  },
  {
    id: "ai",
    title: "AI",
    icon: Cpu,
    textColor: "text-green-500",
    glowClass: "border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]",
    glowColor: "#22c55e",
    pos: { top: "78.3%", left: "29.4%" },
    coords: { x2: 29.4, y2: 78.3 },
  },
  {
    id: "services",
    title: "Services",
    icon: Wrench,
    textColor: "text-orange-500",
    glowClass: "border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]",
    glowColor: "#f97316",
    pos: { top: "39.2%", left: "16.7%" },
    coords: { x2: 16.7, y2: 39.2 },
  }
];

export default function EcosystemSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#0a0f18] to-[#1a2332] pt-16 pb-24 px-4 text-center overflow-hidden border-t border-slate-800 border-b-4 border-b-blue-600 relative z-10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-4xl mx-auto space-y-4 mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">The Yash Ecosystem</h2>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
          A unified platform where hardware, software, networks, and intelligence function as one system
        </p>
      </div>

      <div className="relative w-full max-w-lg md:max-w-2xl mx-auto aspect-square">
        {/* SVG layer for lines and animations */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Main dotted circle track */}
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="#1e293b"
            strokeWidth="0.4"
            strokeDasharray="1 1"
            fill="none"
          />

          {/* Lines from center to nodes */}
          {NODES.map((node, i) => (
            <g key={node.id}>
              <line
                x1="50"
                y1="50"
                x2={node.coords.x2}
                y2={node.coords.y2}
                stroke="#1e293b"
                strokeWidth="0.4"
              />
              {/* Animated data pulse travelling outwards (with slightly offset starting times) */}
              <circle r="0.8" fill={node.glowColor} filter="blur(0.2px)">
                <animate
                  attributeName="cx"
                  values={`50;${node.coords.x2}`}
                  dur="3s"
                  begin={`${i * 0.4}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values={`50;${node.coords.y2}`}
                  dur="3s"
                  begin={`${i * 0.4}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.1;0.9;1"
                  dur="3s"
                  begin={`${i * 0.4}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
        </svg>

        {/* Center Logo Hub */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 
                     w-24 h-24 md:w-32 md:h-32 rounded-full border border-slate-700 bg-[#151a23] flex items-center justify-center
                     shadow-[0_0_40px_rgba(255,255,255,0.05)]"
        >
          <div className="text-white font-black text-xl md:text-2xl leading-tight">
            YASH<br/><span className="text-blue-500">CCTV</span>
          </div>
        </div>

        {/* Orbiting Nodes */}
        {NODES.map((node) => (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2.5 group"
            style={{ top: node.pos.top, left: node.pos.left }}
          >
            <div 
              className={`w-12 h-12 md:w-16 md:h-16 rounded-xl border bg-[#151a23] flex items-center justify-center
                          transition-transform duration-300 group-hover:scale-110 cursor-pointer ${node.glowClass} ${node.textColor}`}
            >
              <node.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            </div>
            <span className={`text-[10px] md:text-xs font-semibold tracking-wide ${node.textColor}`}>
              {node.title}
            </span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20"><svg className="relative block w-full h-[40px] md:h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" fill="#020617"></path></svg></div>
    </section>
  );
}



