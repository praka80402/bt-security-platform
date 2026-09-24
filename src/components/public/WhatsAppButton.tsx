"use client";

import { MessageSquare, Phone } from "lucide-react";
import { useCallModal } from "@/context/CallModalContext";

export default function WhatsAppButton() {
  const { openCallModal } = useCallModal();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 floating-actions transition-opacity duration-300">
      {/* Click to Call Floating Button */}
      <button
        type="button"
        onClick={openCallModal}
        title="Call Technician"
        className="w-13 h-13 p-3 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 hover:scale-110 transition-all flex items-center justify-center border-2 border-white"
      >
        <Phone className="w-6 h-6" />
      </button>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919308907319?text=Hello,%20I%20need%20a%20quote%20for%20CCTV%20/%20Biometric%20service"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        className="w-14 h-14 p-2.5 rounded-full bg-[#25D366] text-white shadow-2xl hover:bg-[#20ba59] hover:scale-110 transition-all flex items-center justify-center border-2 border-white animate-bounce"
      >
        <img
          src="/images/whatsapp.svg"
          alt="WhatsApp Chat"
          className="w-8 h-8 object-contain fill-white text-white drop-shadow-sm"
        />
      </a>
    </div>
  );
}