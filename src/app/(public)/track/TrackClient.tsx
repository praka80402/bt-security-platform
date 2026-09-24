"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  Wrench, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  Phone, 
  MapPin,
  Calendar
} from "lucide-react";
import { ServiceTicketItem } from "@/types";

function TrackContent() {
  const searchParams = useSearchParams();
  const initialTicket = searchParams.get("ticket") || "";
  
  const [query, setQuery] = useState(initialTicket);
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<ServiceTicketItem[]>([]);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async (searchVal?: string) => {
    const term = (searchVal !== undefined ? searchVal : query).trim();
    if (!term) return;

    setLoading(true);
    setErrorMsg("");
    setSearched(true);

    try {
      const isTicketNum = term.toUpperCase().startsWith("TKT");
      const url = isTicketNum
        ? `/api/tickets?ticketNumber=${encodeURIComponent(term)}`
        : `/api/tickets?phone=${encodeURIComponent(term)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        if (data.ticket) {
          setTickets([data.ticket]);
        } else if (data.tickets) {
          setTickets(data.tickets);
        } else {
          setTickets([]);
        }
      } else {
        setTickets([]);
        setErrorMsg(data.error || "No service ticket found.");
      }
    } catch {
      setErrorMsg("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTicket) {
      handleSearch(initialTicket);
    }
  }, [initialTicket]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">Pending Assignment</span>;
      case "ASSIGNED":
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">Technician Assigned</span>;
      case "IN_PROGRESS":
        return <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">Work In Progress</span>;
      case "COMPLETED":
        return <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">Completed & Resolved</span>;
      case "CANCELLED":
        return <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-bold">Cancelled</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md mb-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Enter Ticket ID (TKT-1001) or 10-Digit Mobile Number"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            {loading ? "Searching..." : "Track Status"}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm flex items-center gap-2 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search Results */}
      {searched && tickets.length === 0 && !loading && !errorMsg && (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
          <Wrench className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No Tickets Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            We could not find any active service ticket matching &quot;{query}&quot;. Please verify the details or call our office.
          </p>
        </div>
      )}

      {tickets.length > 0 && (
        <div className="space-y-6">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-md space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ticket Number</span>
                  <span className="text-2xl font-black text-slate-900 tracking-wide">{t.ticketNumber}</span>
                </div>
                <div>{getStatusBadge(t.status)}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">Customer Details</span>
                  <p className="font-bold text-slate-900">{t.customerName}</p>
                  <p className="text-slate-600 text-xs flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600" /> {t.phone}
                  </p>
                  <p className="text-slate-600 text-xs flex items-start gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" /> {t.address}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">Assigned Engineer</span>
                  {t.technicianName ? (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-emerald-600" /> {t.technicianName}
                      </p>
                      {t.technicianPhone && (
                        <a
                          href={`tel:${t.technicianPhone}`}
                          className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" /> Call: {t.technicianPhone}
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-800 font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Assigning senior engineer to your location...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">Reported Issue</span>
                <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 leading-relaxed">
                  {t.issueDescription}
                </p>
              </div>

              {t.resolutionNotes && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-emerald-700 block mb-1 uppercase tracking-wider">Engineer Work Report</span>
                  <p className="text-xs sm:text-sm text-emerald-900 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 leading-relaxed font-medium">
                    {t.resolutionNotes}
                  </p>
                </div>
              )}

              <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Registered on: {new Date(t.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TrackClient() {
  return (
    <Suspense fallback={<div className="text-center text-sm py-12 text-slate-500">Loading tracker...</div>}>
      <TrackContent />
    </Suspense>
  );
}
