"use client";

import Link from "next/link";
import { useState } from "react";
import { Shield, Phone, MessageSquare, Menu, X, Wrench, Clock, ShieldCheck } from "lucide-react";
import { useCallModal } from "@/context/CallModalContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openCallModal } = useCallModal();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top announcement bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-200 font-medium">
              <span className="text-blue-400 font-bold">Yash Enterprises</span> — Authorised CCTV & Biometric Sales, Service & AMC
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs">
            <Link href="/track" className="hover:text-sky-400 flex items-center gap-1 font-semibold text-slate-300">
              <Clock className="w-3.5 h-3.5 text-sky-400" /> Track Service
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/admin/login" className="hover:text-slate-100 text-slate-400 font-medium">
              Staff / Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          
          {/* Logo with Yash Enterprises + Slogan + bestcctvservice */}
          <div className="flex items-center gap-6 lg:gap-10">
            <Link href="/" className="flex items-center gap-3.5 group shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-[68px] md:h-[68px] rounded-2xl bg-white p-1 shadow-md shadow-slate-200 border border-slate-200/80 flex items-center justify-center group-hover:scale-105 transition overflow-hidden">
                <img
                  src="/images/logo.png"
                  alt="Yash Enterprises Logo"
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl md:text-[26px] font-black tracking-tight text-slate-900 leading-none">
                    YASH<span className="text-blue-600 font-bold">ENTERPRISES</span>
                  </span>
                </div>
                <span className="block text-[11px] sm:text-xs font-extrabold text-blue-700 tracking-tight mt-1">
                  Safety You Can See. Service You Can Trust.
                </span>
                <span className="block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  bestcctvservice.com
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-700 ml-6 lg:ml-10">
              <Link href="/" className="hover:text-blue-600 transition px-2 py-1 rounded-md hover:bg-slate-50">
                Home
              </Link>
              <Link href="/products" className="hover:text-blue-600 transition px-2 py-1 rounded-md hover:bg-slate-50">
                CCTV & Biometrics
              </Link>
              <Link href="/services" className="hover:text-blue-600 transition px-2 py-1 rounded-md hover:bg-slate-50">
                Installation & Repair
              </Link>
              <Link href="/amc" className="hover:text-blue-600 transition px-2 py-1 rounded-md hover:bg-slate-50">
                AMC Plans
              </Link>
              <Link
                href="/track"
                className="flex items-center gap-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-full transition"
              >
                <Wrench className="w-4 h-4" /> Track Ticket
              </Link>
            </nav>
          </div>

          {/* CTAs (Strictly Single Line with generous gap from Track Ticket) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 flex-nowrap ml-6 xl:ml-10">
            <button
              type="button"
              onClick={openCallModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 transition shrink-0 whitespace-nowrap shadow-sm cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>+91 93089 07319</span>
            </button>
            <a
              href="https://wa.me/919308907319?text=Hi%20Yash%20Enterprises,%20I%20want%20a%20quotation%20for%20CCTV%20/%20Biometric%20system"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-md shadow-[#25D366]/20 transition shrink-0 whitespace-nowrap"
            >
              <img src="/images/whatsapp.svg" alt="WhatsApp" className="w-4 h-4 object-contain" />
              <span>WhatsApp Quote</span>
            </a>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-slate-800">
            Home
          </Link>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-slate-800">
            CCTV & Biometric Catalog
          </Link>
          <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-slate-800">
            Installation & Repair Services
          </Link>
          <Link href="/amc" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-slate-800">
            AMC Annual Maintenance Contracts
          </Link>
          <Link href="/track" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-semibold text-blue-600">
            Track Service Ticket
          </Link>
          <div className="pt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openCallModal();
              }}
              className="flex justify-center items-center gap-1.5 py-2.5 px-2 rounded-xl border border-slate-300 font-bold text-slate-800 text-xs whitespace-nowrap cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Call
            </button>
            <a
              href="https://wa.me/919308907319"
              className="flex justify-center items-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-600 text-white font-bold text-xs whitespace-nowrap shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" /> WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}