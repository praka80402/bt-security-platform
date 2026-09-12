"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, HardDrive, Cpu, Laptop, Wrench, ShieldCheck } from "lucide-react";

interface NodeData {
  id: string;
  title: string;
  href: string;
  tooltip: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  activeBg: string;
  inactiveBg: string;
  activeBorder: string;
  inactiveBorder: string;
  lineColor: string;
  dotColor: string;
  shadowColor: string;
  desktopPos: {
    top: string;
    left: string;
  };
  lineCoords: {
    x2: number;
    y2: number;
  };
}

const NODES: NodeData[] = [
  {
    id: "cameras",
    title: "Cameras",
    href: "#service-cctv",
    tooltip: "Explore CCTV Camera Installation & Models",
    icon: Camera,
    iconColor: "text-blue-600",
    activeBg: "bg-blue-50",
    inactiveBg: "bg-white",
    activeBorder: "border-blue-500",
    inactiveBorder: "border-slate-200",
    lineColor: "#2563eb", // blue-600
    dotColor: "#3b82f6",
    shadowColor: "rgba(37, 99, 235, 0.25)",
    desktopPos: { top: "6%", left: "50%" },
    lineCoords: { x2: 380, y2: 45 },
  },
  {
    id: "recorder",
    title: "Recorder",
    href: "#service-storage",
    tooltip: "Explore NVR, DVR & Surveillance Storage",
    icon: HardDrive,
    iconColor: "text-sky-600",
    activeBg: "bg-sky-50",
    inactiveBg: "bg-white",
    activeBorder: "border-sky-500",
    inactiveBorder: "border-slate-200",
    lineColor: "#0284c7", // sky-600
    dotColor: "#0ea5e9",
    shadowColor: "rgba(2, 132, 199, 0.25)",
    desktopPos: { top: "38%", left: "89%" },
    lineCoords: { x2: 675, y2: 195 },
  },
  {
    id: "software",
    title: "Software",
    href: "/services",
    tooltip: "Explore Mobile Live View & Remote CMS Software",
    icon: Laptop,
    iconColor: "text-emerald-600",
    activeBg: "bg-emerald-50",
    inactiveBg: "bg-white",
    activeBorder: "border-emerald-500",
    inactiveBorder: "border-slate-200",
    lineColor: "#059669", // emerald-600
    dotColor: "#10b981",
    shadowColor: "rgba(5, 150, 105, 0.25)",
    desktopPos: { top: "85%", left: "75%" },
    lineCoords: { x2: 570, y2: 430 },
  },
  {
    id: "ai",
    title: "AI & Biometric",
    href: "#service-biometric",
    tooltip: "Explore Biometric Attendance & AI Face Access Control",
    icon: Cpu,
    iconColor: "text-teal-600",
    activeBg: "bg-teal-50",
    inactiveBg: "bg-white",
    activeBorder: "border-teal-500",
    inactiveBorder: "border-slate-200",
    lineColor: "#0d9488", // teal-600
    dotColor: "#14b8a6",
    shadowColor: "rgba(13, 148, 136, 0.25)",
    desktopPos: { top: "85%", left: "25%" },
    lineCoords: { x2: 190, y2: 430 },
  },
  {
    id: "services",
    title: "Services",
    href: "#service-repair",
    tooltip: "Book Doorstep Repair & 4-Hour Engineer Visit",
    icon: Wrench,
    iconColor: "text-amber-600",
    activeBg: "bg-amber-50",
    inactiveBg: "bg-white",
    activeBorder: "border-amber-500",
    inactiveBorder: "border-slate-200",
    lineColor: "#d97706", // amber-600
    dotColor: "#f59e0b",
    shadowColor: "rgba(217, 119, 6, 0.25)",
    desktopPos: { top: "38%", left: "11%" },
    lineCoords: { x2: 85, y2: 195 },
  },
];

export default function EcosystemSection() {
  const [activeNode, setActiveNode] = useState<string>("cameras");

  return (
    <section className="relative bg-white text-slate-900 pt-6 pb-16 lg:pt-8 lg:pb-20 overflow-hidden border-t border-slate-200">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 lg:mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold uppercase tracking-wider shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Connected Security Architecture
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
            The Yash Security Ecosystem
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            A unified platform where hardware, software, networks, and intelligence function as one system
          </p>
        </div>

        {/* ================= DESKTOP CONSTELLATION ORBIT ================= */}
        <div className="hidden md:block relative w-full max-w-[780px] h-[520px] lg:h-[560px] mx-auto">
          {/* SVG Connecting Lines & Dashed Circle Orbit (Horizontal Ellipse to widen diagram) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 760 500"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
          >
            {/* Outer dotted orbit ellipse */}
            <ellipse
              cx="380"
              cy="250"
              rx="310"
              ry="205"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeDasharray="6 8"
            />
            {/* Inner secondary orbit ellipse */}
            <ellipse
              cx="380"
              cy="250"
              rx="190"
              ry="125"
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="3 5"
            />

            {/* Connecting Spoke Lines to Center (380, 250) */}
            {NODES.map((node) => {
              const isSelected = activeNode === node.id;
              return (
                <g key={node.id}>
                  {/* Spoke Line */}
                  <line
                    x1="380"
                    y1="250"
                    x2={node.lineCoords.x2}
                    y2={node.lineCoords.y2}
                    stroke={isSelected ? node.lineColor : "#cbd5e1"}
                    strokeWidth={isSelected ? "2.5" : "1.5"}
                    strokeOpacity={isSelected ? "1" : "0.7"}
                    strokeDasharray={isSelected ? "none" : "4 5"}
                    className="transition-all duration-300"
                  />
                  {/* Small decorative pulse dot on line */}
                  <circle
                    cx={380 + (node.lineCoords.x2 - 380) * 0.45}
                    cy={250 + (node.lineCoords.y2 - 250) * 0.45}
                    r={isSelected ? "5" : "3"}
                    fill={node.dotColor}
                    opacity={isSelected ? "1" : "0.75"}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
          </svg>

          {/* Center Hub: Yash Enterprises Core (Clickable -> redirects to #services) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <Link
              href="#services"
              title="View All Services"
              className="relative group cursor-pointer block"
            >
              {/* Soft amber & blue glow ring behind center */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-amber-400/20 via-blue-500/20 to-amber-400/20 blur-md group-hover:scale-110 transition-transform duration-300" />
              <div className="relative w-36 h-36 lg:w-40 lg:h-40 rounded-full bg-white border-2 border-amber-400 flex flex-col items-center justify-center p-3 text-center shadow-[0_10px_30px_rgba(217,119,6,0.15)] group-hover:shadow-[0_15px_35px_rgba(217,119,6,0.25)] group-hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 lg:w-14 lg:h-14 relative mb-1">
                  <Image
                    src="/images/logo.png"
                    alt="Yash Enterprises Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-black tracking-wider text-slate-900 uppercase leading-tight">
                  YASH
                </span>
                <span className="text-[10px] font-extrabold text-amber-600 tracking-wider">
                  ENTERPRISES
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Unified Platform
                </span>
              </div>
            </Link>
          </div>

          {/* 5 Orbiting Nodes (Clickable -> redirect to specific segment) */}
          {NODES.map((node) => {
            const isSelected = activeNode === node.id;
            const Icon = node.icon;
            return (
              <Link
                key={node.id}
                href={node.href}
                title={node.tooltip}
                style={{
                  top: node.desktopPos.top,
                  left: node.desktopPos.left,
                  transform: "translate(-50%, -50%)",
                }}
                className="absolute z-30 group cursor-pointer"
                onClick={() => setActiveNode(node.id)}
                onMouseEnter={() => setActiveNode(node.id)}
              >
                <div className="flex flex-col items-center">
                  {/* Icon Card */}
                  <div
                    style={{
                      boxShadow: isSelected
                        ? `0 10px 25px ${node.shadowColor}`
                        : "0 4px 14px rgba(15, 23, 42, 0.08)",
                    }}
                    className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                      isSelected
                        ? `${node.activeBg} ${node.activeBorder} scale-110`
                        : `${node.inactiveBg} ${node.inactiveBorder} hover:border-slate-400 hover:scale-105`
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 lg:w-7 lg:h-7 ${node.iconColor} transition-transform group-hover:scale-110`}
                    />
                  </div>
                  {/* Label */}
                  <span
                    className={`mt-2 text-xs font-bold tracking-wide transition-colors ${
                      isSelected
                        ? "text-slate-900 font-extrabold scale-105"
                        : "text-slate-600 group-hover:text-slate-900"
                    }`}
                  >
                    {node.title}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ================= MOBILE CONNECTED ROW (Clickable) ================= */}
        <div className="md:hidden grid grid-cols-5 gap-2">
          {NODES.map((node) => {
            const isSelected = activeNode === node.id;
            const Icon = node.icon;
            return (
              <Link
                key={node.id}
                href={node.href}
                onClick={() => setActiveNode(node.id)}
                className={`flex flex-col items-center p-2.5 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-blue-50/80 border-blue-500 shadow-md scale-105"
                    : "bg-white border-slate-200 text-slate-600 active:scale-95"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-1.5 ${
                    isSelected ? "bg-white shadow-sm" : "bg-slate-50"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${node.iconColor}`} />
                </div>
                <span className="text-[10px] font-bold truncate max-w-full text-center text-slate-800">
                  {node.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}