"use client";

import { useEffect, useState } from "react";
import { FileText, Phone, Mail, Calendar, RefreshCw } from "lucide-react";
import { AmcContractItem } from "@/types";

export default function AdminAmcPage() {
  const [contracts, setContracts] = useState<AmcContractItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAmc = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/amc");
      const data = await res.json();
      if (data.contracts) setContracts(data.contracts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmc();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Annual Maintenance Contracts (AMC)</h1>
          <p className="text-xs text-slate-400 mt-1">Manage corporate and society maintenance renewals</p>
        </div>
        <button
          onClick={fetchAmc}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Contracts</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Contract ID</th>
                <th className="px-6 py-4">Client / Entity</th>
                <th className="px-6 py-4">Plan Type</th>
                <th className="px-6 py-4">Coverage</th>
                <th className="px-6 py-4">Validity</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    No active AMC contracts found.
                  </td>
                </tr>
              ) : (
                contracts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-mono font-bold text-sky-400 whitespace-nowrap">
                      {c.contractNumber}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-white block">{c.customerName}</span>
                      {c.companyName && (
                        <span className="text-xs text-slate-400">{c.companyName}</span>
                      )}
                      <a href={`tel:${c.phone}`} className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-0.5 font-semibold">
                        <Phone className="w-3 h-3" /> {c.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-200">
                      {c.planType}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="block font-semibold text-slate-200">{c.totalCameras} Cameras</span>
                      {c.totalBiometrics > 0 && (
                        <span className="text-slate-400 block">{c.totalBiometrics} Biometrics</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                      <div>Start: {new Date(c.startDate).toLocaleDateString()}</div>
                      <div>End: {new Date(c.endDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}