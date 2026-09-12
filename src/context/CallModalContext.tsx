"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Phone, MessageSquare, X, Headphones, Copy, Check } from "lucide-react";

interface CallModalContextType {
  openCallModal: () => void;
  closeCallModal: () => void;
}

const CallModalContext = createContext<CallModalContextType>({
  openCallModal: () => {},
  closeCallModal: () => {},
});

export const useCallModal = () => useContext(CallModalContext);

export function CallModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      const userAgent = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileRegex.test(userAgent) || (typeof window !== "undefined" && window.innerWidth < 768);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const openCallModal = () => {
    // If on mobile device, directly trigger native phone dialer for instant 1-tap call
    if (isMobile) {
      window.location.href = "tel:+919308907319";
      return;
    }
    // If on desktop/laptop, open center modal without annoying Chrome Phone Link popup
    setIsOpen(true);
  };

  const closeCallModal = () => setIsOpen(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("+919308907319");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modalContent = isOpen ? (
    <div 
      className="global-call-modal-backdrop"
      onClick={closeCallModal}
    >
      <div
        className="global-call-modal-card bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 text-center space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeCallModal}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Header */}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center shadow-inner border border-blue-100">
          <Headphones className="w-8 h-8" />
        </div>

        {/* Title & Info */}
        <div>
          <span className="text-[11px] uppercase font-extrabold tracking-wider text-blue-600">
            Direct Technical Support
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-0.5">
            Yash Enterprises
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Authorised CCTV &amp; Biometric Doorstep Engineer
          </p>
        </div>

        {/* Display Number Box */}
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Hotline Number</span>
            <span className="text-lg font-black text-slate-900">+91 93089 07319</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons (100% Native-Popup Free) */}
        <div className="grid grid-cols-1 gap-3 pt-1">
          {/* 1-Click Copy & Call Action */}
          <button
            type="button"
            onClick={handleCopy}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-98 cursor-pointer ${
              copied
                ? "bg-emerald-600 text-white shadow-emerald-600/30"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                <span>Number Copied (+91 93089 07319)</span>
              </>
            ) : (
              <>
                <Phone className="w-4 h-4" />
                <span>Copy &amp; Call: +91 93089 07319</span>
              </>
            )}
          </button>

          {/* WhatsApp Direct Chat */}
          <a
            href="https://wa.me/919308907319?text=Hello%20Yash%20Enterprises,%20I%20want%20to%20talk%20to%20an%20expert%20regarding%20CCTV%20/%20Biometric%20services"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition active:scale-98"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp Directly</span>
          </a>
        </div>

        <p className="text-[11px] text-slate-400">
          Available 9:00 AM – 8:00 PM (Mon – Sun)
        </p>
      </div>
    </div>
  ) : null;

  return (
    <CallModalContext.Provider value={{ openCallModal, closeCallModal }}>
      {children}
      {mounted && typeof document !== "undefined" && modalContent
        ? createPortal(modalContent, document.body)
        : null}
    </CallModalContext.Provider>
  );
}
