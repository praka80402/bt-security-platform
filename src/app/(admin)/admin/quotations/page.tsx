"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { usePathname } from "next/navigation";

export default function QuotationsListPage() {
  const pathname = usePathname();
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Custom Popup State
  const [popup, setPopup] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    fetch('/api/admin/quotations')
      .then(res => res.json())
      .then(data => {
        if (data.success) setQuotations(data.quotations);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/quotations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setQuotations(quotations.map(q => q.id === id ? { ...q, status: newStatus } : q));
        setPopup({ show: true, message: "Status updated successfully!", type: "success" });
      } else {
        const errData = await res.json();
        setPopup({ show: true, message: `Failed to update status: ${errData.error}`, type: "error" });
      }
    } catch (e) {
      console.error(e);
      setPopup({ show: true, message: "Error updating status. Please check your connection.", type: "error" });
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'ACCEPTED') return <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"><CheckCircle className="w-3 h-3" /> Approved</span>;
    if (status === 'REJECTED') return <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30"><XCircle className="w-3 h-3" /> Reject</span>;
    return <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30"><Clock className="w-3 h-3" /> Pending</span>;
  };

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredQuotations = quotations.filter(q => {
    const date = new Date(q.createdAt);
    const matchesSearch = q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || q.quotationNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = filterYear ? date.getFullYear().toString() === filterYear : true;
    const matchesMonth = filterMonth ? (date.getMonth() + 1).toString() === filterMonth : true;
    const matchesStatus = filterStatus ? q.status === filterStatus : true;
    return matchesSearch && matchesYear && matchesMonth && matchesStatus;
  });

  return (
    <div className="space-y-6 relative pb-12">
      
      {/* Custom Popup Modal */}
      {popup.show && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center flex flex-col items-center">
            {popup.type === "success" ? (
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8" />
              </div>
            )}
            <h3 className="text-xl font-bold text-white mb-2">
              {popup.type === "success" ? "Success!" : "Error!"}
            </h3>
            <p className="text-slate-400 text-sm mb-6">{popup.message}</p>
            <button 
              onClick={() => setPopup({ ...popup, show: false })}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Header & Tabs */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Quotations Management</h1>
        <div className="flex border-b border-slate-800">
          <Link 
            href="/admin/quotations/new" 
            className="px-6 py-3 text-sm font-semibold text-slate-400 hover:text-white transition border-b-2 border-transparent hover:border-slate-600"
          >
            Create Quotation
          </Link>
          <div className="px-6 py-3 text-sm font-bold text-blue-400 border-b-2 border-blue-500">
            Saved Quotations
          </div>
        </div>
      </div>

      {/* Filters / Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name or quotation no..." 
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-3">
          <select 
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
          <select 
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Months</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="ACCEPTED">Approved</option>
            <option value="DRAFT">Pending</option>
            <option value="REJECTED">Reject</option>
          </select>
        </div>
      </div>

      {/* Quotations List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading quotations...</div>
        ) : filteredQuotations.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-white">No Quotations Found</h3>
            <p className="text-slate-500 text-sm mt-1">Try clearing your filters or create a new quotation.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Date</th>
                  <th className="p-4">Quotation No</th>
                  <th className="p-4">Client Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                {filteredQuotations.map(q => (
                  <tr key={q.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4 whitespace-nowrap">{new Date(q.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-mono text-blue-400">{q.quotationNo}</td>
                    <td className="p-4 font-semibold text-white">
                      {q.customerName}
                      {q.phone && <span className="block text-xs font-normal text-slate-500">{q.phone}</span>}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-slate-800 rounded text-xs">{q.type}</span>
                    </td>
                    <td className="p-4 text-right font-bold text-emerald-400">₹ {q.totalAmount.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      {getStatusBadge(q.status)}
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <select 
                        value={q.status}
                        onChange={(e) => updateStatus(q.id, e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-xs rounded p-1.5 text-slate-300 focus:outline-none"
                      >
                        <option value="DRAFT">Pending</option>
                        <option value="ACCEPTED">Approved</option>
                        <option value="REJECTED">Reject</option>
                      </select>
                      <Link 
                        href={`/admin/quotations/${q.id}`} 
                        className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded text-xs font-semibold transition flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
