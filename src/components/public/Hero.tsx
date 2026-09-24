"use client";

import { useState } from "react";
import { ShieldCheck, Wrench, Clock, CheckCircle2, PhoneCall, Sparkles, Send } from "lucide-react";
import { useCallModal } from "@/context/CallModalContext";

export default function Hero() {
  const { openCallModal } = useCallModal();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    serviceType: "CCTV Installation",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-white text-slate-900 py-12 md:py-16 border-b border-slate-200">
      {/* Subtle light ambient glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-blue-50/70 blur-[110px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[250px] bg-amber-50/50 blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Heading & Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Badge & Slogan */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                #1 CCTV &amp; Biometric Service in Patna, Bihar
              </div>
              <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                🛡️ Safety You Can See. Service You Can Trust.
              </span>
            </div>

            {/* Main Headline (Strictly 2 lines) */}
            <h1 className="text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] font-black tracking-tight text-slate-950 leading-[1.2]">
              <span className="block">Securing Homes &amp; Businesses</span>
              <span className="block text-blue-600 underline decoration-blue-500/30">Across Patna &amp; Beyond</span>
            </h1>

            {/* Subtext */}
            <p className="text-slate-600 font-medium text-base sm:text-lg leading-relaxed max-w-2xl">
              <strong className="text-slate-900 font-black">Yash Enterprises</strong> brings you crystal-clear HD/IP CCTV cameras, AI-powered biometric attendance, and fast doorstep repair with verified engineers in Patna, Ara, Buxar, Hajipur, Chapra, Muzaffarpur, Masaurhi, Gaya, Barh, and Bakhtiarpur.
            </p>

            {/* Badges in Clean Light White Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 bg-slate-50 px-3.5 py-2.5 rounded-xl shadow-sm border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Same-Day Installation</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 bg-slate-50 px-3.5 py-2.5 rounded-xl shadow-sm border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>1-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 bg-slate-50 px-3.5 py-2.5 rounded-xl shadow-sm border border-slate-200">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Doorstep Repair in 4 Hrs</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                type="button"
                onClick={openCallModal}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-600/25 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <PhoneCall className="w-5 h-5 text-white" />
                <span>Call: +91 93089 07319</span>
              </button>
              <a
                href="#services"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold border border-slate-300 shadow-sm transition"
              >
                <Wrench className="w-5 h-5 text-slate-700" />
                <span>Explore Services</span>
              </a>
            </div>
          </div>

          {/* Right Column: Instant Quote Form (Pure Clean White Card) */}
          <div className="lg:col-span-5 lg:pt-0">
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xl relative text-slate-900">
              <div className="mb-6">
                <span className="text-xs uppercase font-black tracking-wider text-blue-600 block">Quick Inquiry</span>
                <h2 className="text-2xl font-black text-slate-950 mt-0.5">Book Free Site Survey</h2>
                <p className="text-xs text-slate-500 mt-1">Get custom quotation within 30 minutes</p>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-black text-slate-900">Inquiry Received!</h4>
                  <p className="text-xs text-slate-600">
                    Thank you! Our technical specialist from Yash Enterprises will call you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-blue-700 hover:underline pt-2 font-bold"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="hero-name" className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      id="hero-name"
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="hero-phone" className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      id="hero-phone"
                      type="tel"
                      required
                      placeholder="e.g. 9308907319"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="hero-service" className="block text-xs font-bold text-slate-700 mb-1">Required Service *</label>
                    <select
                      id="hero-service"
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer shadow-sm"
                    >
                      <option value="CCTV Installation">CCTV Installation (Home / Office)</option>
                      <option value="CCTV Repair">CCTV Repair & Troubleshooting</option>
                      <option value="Biometric Attendance">Biometric Attendance Machine</option>
                      <option value="Access Control">Face Recognition & Door Lock</option>
                      <option value="AMC Plan">AMC (Annual Maintenance Contract)</option>
                      <option value="Others">Others / Custom Requirement</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="hero-details" className="block text-xs font-bold text-slate-700 mb-1">Details (No. of Cameras / Location)</label>
                    <textarea
                      id="hero-details"
                      rows={2}
                      placeholder="e.g. 4 cameras needed for retail shop"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition"
                  >
                    {loading ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-400" />
                        <span>Get Instant Quote</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
