"use client";

import { useEffect, useState } from "react";
import { Wrench, Phone, MapPin, UserCheck, RefreshCw, CheckCircle2 } from "lucide-react";
import { ServiceTicketItem } from "@/types";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<ServiceTicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<ServiceTicketItem | null>(null);
  const [assignName, setAssignName] = useState("");
  const [assignPhone, setAssignPhone] = useState("");
  const [statusVal, setStatusVal] = useState("ASSIGNED");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [saving, setSaving] = useState(false);

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
        <button
          onClick={fetchTickets}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Tickets</span>
        </button>
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

            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => {
                  setSelectedTicket(t);
                  setAssignName(t.technicianName || "");
                  setAssignPhone(t.technicianPhone || "");
                  setStatusVal(t.status);
                  setResolutionNotes(t.resolutionNotes || "");
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
              >
                Update / Assign Engineer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Slide-over to update ticket */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 text-white shadow-2xl">
            <h3 className="text-lg font-bold">Manage Ticket: {selectedTicket.ticketNumber}</h3>
            <p className="text-xs text-slate-400">Customer: {selectedTicket.customerName} ({selectedTicket.phone})</p>

            <form onSubmit={handleUpdateTicket} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ticket Status</label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="ASSIGNED">ASSIGNED (Technician Dispatched)</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (On Site)</option>
                  <option value="COMPLETED">COMPLETED (Resolved)</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Technician Name</label>
                <input
                  type="text"
                  placeholder="e.g. Amit Sharma"
                  value={assignName}
                  onChange={(e) => setAssignName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Technician Mobile Phone</label>
                <input
                  type="tel"
                  placeholder="e.g. 9871122334"
                  value={assignPhone}
                  onChange={(e) => setAssignPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resolution / Work Report Notes</label>
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
    </div>
  );
}