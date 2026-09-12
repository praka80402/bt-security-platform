"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  RefreshCw, 
  X, 
  MessageSquare, 
  Send, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Smartphone
} from "lucide-react";
import { LeadItem } from "@/types";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [activeTab, setActiveTab] = useState<"whatsapp" | "email" | "sms" | "quote">("whatsapp");

  // Custom response message state
  const [customMsg, setCustomMsg] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Quotation state
  const [quoteDetails, setQuoteDetails] = useState({
    packageTitle: "CP Plus 4 Camera Full HD Security Kit",
    quantity: "4 Cameras + 1 DVR + 1TB HDD",
    amount: "13500",
    warranty: "1 Year On-site Comprehensive Warranty",
    notes: "Includes power supply, BNC connectors, and free mobile app viewing setup.",
  });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.leads) setLeads(data.leads);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // When a lead is selected, prefill customized message
  const handleSelectLead = (lead: LeadItem) => {
    setSelectedLead(lead);
    setActiveTab("whatsapp");
    setCustomMsg(
      `Hello ${lead.name}, thank you for contacting Yash Enterprises (bestcctvservice.com) regarding "${lead.serviceType}". We have received your requirement: "${lead.message || "Site Survey"}". Our senior technical engineer can visit your location for a free inspection. What time would be convenient for you?`
    );
  };

  // Update Status in database
  const handleStatusChange = async (newStatus: string) => {
    if (!selectedLead) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedLead.id, status: newStatus }),
      });
      if (res.ok) {
        setSelectedLead({ ...selectedLead, status: newStatus as any });
        setLeads((prev) =>
          prev.map((l) => (l.id === selectedLead.id ? { ...l, status: newStatus as any } : l))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Clean phone number for WhatsApp (e.g. ensure 91 prefix)
  const getWhatsAppLink = (phone: string, text: string) => {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.length === 10) clean = `91${clean}`;
    return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
  };

  // Generate formatted Quotation text
  const getQuotationText = () => {
    if (!selectedLead) return "";
    return `*OFFICIAL ESTIMATE & QUOTATION*
*Yash Enterprises - Best CCTV & Biometric Solutions*
Domain: bestcctvservice.com | Phone: +91 93089 07319
-----------------------------------------
*Client Name:* ${selectedLead.name}
*Phone:* ${selectedLead.phone}
*Requirement:* ${selectedLead.serviceType}

*PROPOSED PACKAGE DETAILS:*
📦 *Package:* ${quoteDetails.packageTitle}
🔢 *Hardware:* ${quoteDetails.quantity}
💰 *Total Amount:* ₹${Number(quoteDetails.amount).toLocaleString("en-IN")} (All inclusive)
🛡️ *Warranty:* ${quoteDetails.warranty}
📝 *Remarks:* ${quoteDetails.notes}

_Call us at +91 93089 07319 to confirm your installation slot._`;
  };

  return (
    <div className="space-y-6 relative">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Customer Leads & Inquiries</h1>
          <p className="text-xs text-slate-400 mt-1">
            Click any lead to open half-screen drawer for quick response via WhatsApp, Email, SMS & Quotation
          </p>
        </div>
        <button
          onClick={fetchLeads}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Phone / Email</th>
                <th className="px-6 py-4">Requested Service</th>
                <th className="px-6 py-4">Message / Notes</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                    No inquiries received yet.
                  </td>
                </tr>
              ) : (
                leads.map((l) => (
                  <tr
                    key={l.id}
                    onClick={() => handleSelectLead(l)}
                    className={`cursor-pointer transition ${
                      selectedLead?.id === l.id
                        ? "bg-blue-600/15 border-l-4 border-blue-500"
                        : "hover:bg-slate-800/50"
                    }`}
                  >
                    <td className="px-6 py-4 font-bold text-white whitespace-nowrap">
                      {l.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <span className="text-blue-400 flex items-center gap-1 font-semibold">
                        <Phone className="w-3 h-3" /> {l.phone}
                      </span>
                      {l.email && (
                        <span className="text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {l.email}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold px-2.5 py-1 rounded-md">
                        {l.serviceType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300 max-w-xs truncate">
                      {l.message || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          l.status === "NEW"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : l.status === "CONTACTED"
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                            : l.status === "CONVERTED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                      {new Date(l.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectLead(l);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm inline-flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* HALF SCREEN SLIDE-OVER DRAWER */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          {/* Backdrop click to close */}
          <div className="flex-1" onClick={() => setSelectedLead(null)} />

          {/* Half Screen Drawer Panel */}
          <div className="w-full sm:w-4/5 md:w-3/5 lg:w-1/2 bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-y-auto animate-slideIn">
            
            {/* Drawer Header */}
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 block">Lead Details</span>
                <h2 className="text-xl font-black text-white">{selectedLead.name}</h2>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">
              
              {/* Customer Info Card & Status Controller */}
              <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">Lead Status</span>
                    <select
                      value={selectedLead.status}
                      disabled={updatingStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="mt-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="NEW">🟡 NEW (Uncontacted)</option>
                      <option value="CONTACTED">🔵 CONTACTED (Discussed)</option>
                      <option value="CONVERTED">🟢 CONVERTED (Won Deal)</option>
                      <option value="CLOSED">⚪ CLOSED (Not Interested)</option>
                    </select>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Received on</span>
                    <span className="text-xs text-slate-300 font-semibold">
                      {new Date(selectedLead.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Mobile Phone</span>
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="text-sm font-bold text-blue-400 hover:underline flex items-center gap-1.5"
                    >
                      <Phone className="w-4 h-4" /> {selectedLead.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Service Requested</span>
                    <span className="font-bold text-slate-200">{selectedLead.serviceType}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-xs block mb-1">Customer Requirement / Message:</span>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
                    {selectedLead.message || "No specific comments provided by customer."}
                  </div>
                </div>
              </div>

              {/* Action Tabs: WhatsApp, Email, SMS, Quotation */}
              <div className="space-y-4">
                <div className="flex border-b border-slate-800 gap-2 pb-2">
                  <button
                    onClick={() => setActiveTab("whatsapp")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                      activeTab === "whatsapp"
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                        : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("email")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                      activeTab === "email"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("sms")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                      activeTab === "sms"
                        ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                        : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>SMS</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("quote")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                      activeTab === "quote"
                        ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                        : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Send Quotation</span>
                  </button>
                </div>

                {/* TAB 1: WHATSAPP QUICK RESPONSE */}
                {activeTab === "whatsapp" && (
                  <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4" /> Send Instant WhatsApp Reply
                      </span>
                      <span className="text-[10px] text-slate-400">To: {selectedLead.phone}</span>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">
                        Edit Message before sending:
                      </label>
                      <textarea
                        rows={5}
                        value={customMsg}
                        onChange={(e) => setCustomMsg(e.target.value)}
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
                      />
                    </div>

                    <a
                      href={getWhatsAppLink(selectedLead.phone, customMsg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition"
                    >
                      <Send className="w-4 h-4" />
                      <span>Open & Send via WhatsApp</span>
                    </a>
                  </div>
                )}

                {/* TAB 2: EMAIL RESPONSE */}
                {activeTab === "email" && (
                  <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                        <Mail className="w-4 h-4" /> Send Email Response
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {selectedLead.email ? `To: ${selectedLead.email}` : "No email provided (enter below)"}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">Email Subject:</label>
                      <input
                        type="text"
                        defaultValue={`Yash Enterprises - Quotation & Consultation for ${selectedLead.serviceType}`}
                        id="emailSubject"
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">Email Body:</label>
                      <textarea
                        rows={5}
                        value={customMsg}
                        onChange={(e) => setCustomMsg(e.target.value)}
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                      />
                    </div>

                    <a
                      href={`mailto:${selectedLead.email || ""}?subject=${encodeURIComponent(
                        `Yash Enterprises - ${selectedLead.serviceType}`
                      )}&body=${encodeURIComponent(customMsg)}`}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition"
                    >
                      <Send className="w-4 h-4" />
                      <span>Open in Email Client</span>
                    </a>
                  </div>
                )}

                {/* TAB 3: SMS RESPONSE */}
                {activeTab === "sms" && (
                  <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4" /> Send Direct SMS
                      </span>
                      <span className="text-[10px] text-slate-400">To: {selectedLead.phone}</span>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">SMS Text:</label>
                      <textarea
                        rows={4}
                        value={customMsg}
                        onChange={(e) => setCustomMsg(e.target.value)}
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 leading-relaxed font-sans"
                      />
                    </div>

                    <a
                      href={`sms:${selectedLead.phone}?body=${encodeURIComponent(customMsg)}`}
                      className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 transition"
                    >
                      <Send className="w-4 h-4" />
                      <span>Launch Native SMS App</span>
                    </a>
                  </div>
                )}

                {/* TAB 4: SEND QUOTATION BUILDER */}
                {activeTab === "quote" && (
                  <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <FileText className="w-4 h-4" /> Prepare & Dispatch Quotation
                      </span>
                      <span className="text-[10px] text-slate-400">For {selectedLead.name}</span>
                    </div>

                    {/* Quotation Inputs */}
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">Package Title</label>
                        <input
                          type="text"
                          value={quoteDetails.packageTitle}
                          onChange={(e) => setQuoteDetails({ ...quoteDetails, packageTitle: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Hardware / Qty</label>
                          <input
                            type="text"
                            value={quoteDetails.quantity}
                            onChange={(e) => setQuoteDetails({ ...quoteDetails, quantity: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Total Amount (₹ INR)</label>
                          <input
                            type="number"
                            value={quoteDetails.amount}
                            onChange={(e) => setQuoteDetails({ ...quoteDetails, amount: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">Warranty & Service Terms</label>
                        <input
                          type="text"
                          value={quoteDetails.warranty}
                          onChange={(e) => setQuoteDetails({ ...quoteDetails, warranty: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Generated Quotation Live Preview Card */}
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Quotation Format Preview:
                      </span>
                      <pre className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-[11px] text-amber-200/90 whitespace-pre-wrap font-mono leading-relaxed max-h-40 overflow-y-auto">
                        {getQuotationText()}
                      </pre>
                    </div>

                    {/* Quotation Send Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <a
                        href={getWhatsAppLink(selectedLead.phone, getQuotationText())}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Send on WhatsApp</span>
                      </a>

                      <a
                        href={`mailto:${selectedLead.email || ""}?subject=${encodeURIComponent(
                          `Official Quotation from Yash Enterprises: ${selectedLead.serviceType}`
                        )}&body=${encodeURIComponent(getQuotationText())}`}
                        className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Send via Email</span>
                      </a>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}