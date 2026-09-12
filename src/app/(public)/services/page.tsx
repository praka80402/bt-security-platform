"use client";

import { useState } from "react";
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    city: "Local",
    serviceType: "CCTV_INSTALL",
    issueDescription: "",
  });

  const [loading, setLoading] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<{ ticketNumber: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.ticket) {
        setCreatedTicket(data.ticket);
      } else {
        setErrorMsg(data.error || "Failed to submit request. Please call us directly.");
      }
    } catch {
      setErrorMsg("Network error. Please call +91 93089 07319.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Doorstep Service & Installation
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900">
            Book A Certified Engineer Visit
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Need new CCTV cameras installed or existing setup repaired? Yash Enterprises guarantees fast doorstep support within 4 business hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Booking Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200/80 shadow-md">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Book Service or Repair</h2>
            <p className="text-xs text-slate-500 mb-6">
              Fill the form below to register a ticket in our system. You will receive an instant Ticket ID to track your engineer in real-time.
            </p>

            {createdTicket ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Service Ticket Created!</h3>
                <p className="text-sm text-slate-600">
                  Your service ticket has been registered in Yash Enterprises platform.
                </p>
                
                <div className="bg-white border-2 border-dashed border-emerald-300 rounded-xl p-4 inline-block my-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-widest">Your Ticket Number</span>
                  <span className="text-3xl font-black text-emerald-700 tracking-wider">
                    {createdTicket.ticketNumber}
                  </span>
                </div>

                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Please save this ticket number. Our engineer will contact you shortly to confirm the visit time.
                </p>

                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <Link
                    href={`/track?ticket=${createdTicket.ticketNumber}`}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition"
                  >
                    Track Ticket Live
                  </Link>
                  <button
                    onClick={() => {
                      setCreatedTicket(null);
                      setFormData({
                        customerName: "",
                        phone: "",
                        address: "",
                        city: "Local",
                        serviceType: "CCTV_INSTALL",
                        issueDescription: "",
                      });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition"
                  >
                    Book Another Service
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Kumar"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9308907319"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Required *</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="CCTV_INSTALL">New CCTV Camera Installation</option>
                    <option value="CCTV_REPAIR">CCTV Repair / Camera Not Working</option>
                    <option value="BIOMETRIC_SETUP">Biometric Attendance Machine Setup</option>
                    <option value="ACCESS_LOCK">Access Control & EM Door Lock</option>
                    <option value="CAMERA_SHIFTING">Camera Relocation / Shifting to New Place</option>
                    <option value="DVR_PASSWORD">DVR / NVR Password Reset & HDD Issue</option>
                    <option value="OTHER">Other / Custom Security Requirement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Premises Address *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Shop/Flat/Plot No., Society Name, Landmark, Street"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Problem / Requirement Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. 2 dome cameras are showing black screen, DVR is continuously beeping..."
                    value={formData.issueDescription}
                    onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Submitting Ticket...</span>
                  ) : (
                    <>
                      <Wrench className="w-4 h-4" />
                      <span>Confirm Service Booking</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right: Service Pricing & SLAs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-2xl shadow-xl">
              <span className="text-xs uppercase font-extrabold tracking-widest text-sky-400">
                Transparent Pricing
              </span>
              <h3 className="text-xl font-bold mt-1 mb-4">Standard Service Visit Rates</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-700/60">
                  <span className="text-slate-300">Visiting / Inspection Charge</span>
                  <span className="font-bold text-emerald-400">₹299 (Adjustable in repair)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700/60">
                  <span className="text-slate-300">Camera Installation (Per Point)</span>
                  <span className="font-bold text-emerald-400">From ₹250 / point</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700/60">
                  <span className="text-slate-300">DVR / NVR Configuration</span>
                  <span className="font-bold text-emerald-400">₹450</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700/60">
                  <span className="text-slate-300">Biometric Software Installation</span>
                  <span className="font-bold text-emerald-400">₹650</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Doorstep visit in 4 hours across major city areas.</span>
              </div>
            </div>

            {/* Emergency Hotline */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl space-y-3">
              <h4 className="text-base font-bold text-slate-900">Need Immediate Help?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Call our technical support desk directly to schedule priority repairs or emergency society camera blackout service.
              </p>
              <a
                href="tel:+919308907319"
                className="inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-800 text-sm"
              >
                Direct Call: +91 93089 07319 <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}