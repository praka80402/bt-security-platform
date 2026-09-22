"use client";

import { useEffect, useState } from "react";
import { Wrench, Phone, MapPin, UserCheck, RefreshCw, CheckCircle2, Plus, X } from "lucide-react";
import { ServiceTicketItem } from "@/types";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<ServiceTicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<ServiceTicketItem | null>(null);
  
  // States for updating a ticket
  const [assignName, setAssignName] = useState("");
  const [assignPhone, setAssignPhone] = useState("");
  const [statusVal, setStatusVal] = useState("ASSIGNED");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // States for creating a ticket
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    customerName: "",
    phone: "",
    address: "",
    serviceType: "REPAIR",
    issueDescription: "",
    priority: "Normal",
    technicianName: "",
    technicianPhone: "",
    status: "PENDING"
  });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      if (data.tickets) setTickets(data.tickets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewTicket({
          customerName: "",
          phone: "",
          address: "",
          serviceType: "REPAIR",
          issueDescription: "",
          priority: "Normal",
          technicianName: "",
          technicianPhone: "",
          status: "PENDING"
        });
        fetchTickets();
      } else {
        alert("Failed to create ticket");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating ticket");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicianName: assignName,
          technicianPhone: assignPhone,
          status: statusVal,
          resolutionNotes,
        }),
      });
      if (res.ok) {
        setSelectedTicket(null);
        fetchTickets();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Service & Repair Tickets</h1>
          <p className="text-xs text-slate-400 mt-1">Assign engineers, track status, and close customer tickets</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchTickets}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 gap-4">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-sm font-black text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2.5 py-0.5 rounded-lg">
                  {t.ticketNumber}
                </span>
                <span className="font-bold text-white text-base">{t.customerName}</span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  t.priority === "High" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                  t.priority === "Urgent" ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse" :
                  "bg-slate-800 text-slate-300 border-slate-700"
                }`}>
                  {t.priority || "Normal"}
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  t.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                  t.status === "ASSIGNED" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                  t.status === "IN_PROGRESS" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                  t.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  "bg-rose-500/10 text-rose-400"
                }`}>
                  {t.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Phone: {t.phone}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{t.address}</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-0.5">Problem Reported:</span>
                {t.issueDescription}
              </div>

              {t.technicianName && (
                <div className="text-xs text-emerald-400 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  <span>Assigned to: <strong>{t.technicianName}</strong> {t.technicianPhone ? `(${t.technicianPhone})` : ""}</span>
                </div>
              )}
            </div>

            <div className="flex lg:flex-col gap-3 shrink-0">
              {t.status !== "COMPLETED" && (
                <button
                  onClick={() => {
                    setSelectedTicket(t);
                    setAssignName(t.technicianName || "");
                    setAssignPhone(t.technicianPhone || "");
                    setStatusVal(t.status);
                    setResolutionNotes(t.resolutionNotes || "");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600 hover:text-white text-blue-500 text-xs font-bold transition flex-1 lg:flex-none text-center"
                >
                  Update / Assign
                </button>
              )}
              {t.status === "COMPLETED" && (
                <div className="px-5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-bold flex items-center justify-center gap-2 flex-1 lg:flex-none">
                  <CheckCircle2 className="w-4 h-4" /> Solved
                </div>
              )}
            </div>
          </div>
        ))}
        {tickets.length === 0 && !loading && (
          <div className="text-center p-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-sm">
            No active tickets found.
          </div>
        )}
      </div>

      {/* Update/Assign Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              Update Ticket: <span className="text-blue-400">{selectedTicket.ticketNumber}</span>
            </h3>
            <form onSubmit={handleUpdateTicket} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Technician Name</label>
                  <input
                    type="text"
                    value={assignName}
                    onChange={(e) => setAssignName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Technician Phone</label>
                  <input
                    type="text"
                    value={assignPhone}
                    onChange={(e) => setAssignPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ticket Status</label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="ASSIGNED">Assigned to Engineer</option>
                  <option value="IN_PROGRESS">Work in Progress</option>
                  <option value="COMPLETED">Completed / Resolved</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Resolution Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Replaced faulty BNC connector and 12V power supply. All 4 cameras now working."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Ticket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/50 shrink-0">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" /> Create Support Ticket
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTicket} className="p-5 space-y-4 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Customer Name *</label>
                  <input type="text" required value={newTicket.customerName} onChange={e => setNewTicket({...newTicket, customerName: e.target.value})} className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. Sunil Verma" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number *</label>
                  <input type="text" required value={newTicket.phone} onChange={e => setNewTicket({...newTicket, phone: e.target.value})} className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="98XXXXXXXX" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Address *</label>
                  <input type="text" required value={newTicket.address} onChange={e => setNewTicket({...newTicket, address: e.target.value})} className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="Full address" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Service Type</label>
                  <select value={newTicket.serviceType} onChange={e => setNewTicket({...newTicket, serviceType: e.target.value})} className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500">
                    <option value="REPAIR">Repair & Maintenance</option>
                    <option value="CCTV_INSTALL">CCTV Installation</option>
                    <option value="BIOMETRIC_SETUP">Biometric Setup</option>
                    <option value="AMC_VISIT">AMC Visit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Priority Level</label>
                  <select value={newTicket.priority} onChange={e => setNewTicket({...newTicket, priority: e.target.value})} className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500">
                    <option value="Normal">Normal (Default)</option>
                    <option value="High">High (Needs Attention)</option>
                    <option value="Urgent">Urgent (Critical)</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Issue Description *</label>
                  <textarea required rows={3} value={newTicket.issueDescription} onChange={e => setNewTicket({...newTicket, issueDescription: e.target.value})} className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="Describe the problem in detail..." />
                </div>

                {/* Optional Assignment */}
                <div className="md:col-span-2 pt-2 border-t border-slate-800 mt-2">
                  <h3 className="text-xs font-bold text-emerald-400 mb-3">Optional: Direct Engineer Assignment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Assign To (Technician Name)</label>
                      <input type="text" value={newTicket.technicianName} onChange={e => {
                        setNewTicket({...newTicket, technicianName: e.target.value, status: e.target.value ? "ASSIGNED" : "PENDING"})
                      }} className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. Amit Kumar" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Technician Phone</label>
                      <input type="text" value={newTicket.technicianPhone} onChange={e => setNewTicket({...newTicket, technicianPhone: e.target.value})} className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="Technician's contact" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-4 shrink-0">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-semibold transition">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2">
                  {saving ? "Creating..." : "Create Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}