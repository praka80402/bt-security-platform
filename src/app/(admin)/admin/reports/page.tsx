"use client";

import { useState, useEffect } from "react";
import { Download, FileText, FileSpreadsheet, File, Printer, ArrowRight } from "lucide-react";

type DataType = "QUOTATIONS" | "TICKETS" | "LEADS";
type PeriodType = "MONTH" | "QUARTER" | "HALF_YEAR" | "YEAR" | "ALL";

export default function ReportsPage() {
  const [dataType, setDataType] = useState<DataType>("QUOTATIONS");
  const [period, setPeriod] = useState<PeriodType>("MONTH");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [dataType, period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = "";
      if (dataType === "QUOTATIONS") url = "/api/admin/quotations";
      if (dataType === "TICKETS") url = "/api/tickets";
      if (dataType === "LEADS") url = "/api/leads";

      const res = await fetch(url);
      const json = await res.json();
      
      let rawData = [];
      if (dataType === "QUOTATIONS") rawData = json.quotations || [];
      if (dataType === "TICKETS") rawData = json.tickets || [];
      if (dataType === "LEADS") rawData = json.leads || [];

      // Filter by period
      const filtered = filterDataByPeriod(rawData, period);
      setData(filtered);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const filterDataByPeriod = (items: any[], p: PeriodType) => {
    if (p === "ALL") return items;
    const now = new Date();
    let startDate = new Date();
    
    if (p === "MONTH") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (p === "QUARTER") {
      const q = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), q * 3, 1);
    } else if (p === "HALF_YEAR") {
      const half = now.getMonth() < 6 ? 0 : 6;
      startDate = new Date(now.getFullYear(), half, 1);
    } else if (p === "YEAR") {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    return items.filter(item => new Date(item.createdAt) >= startDate);
  };

  const getHeaders = () => {
    if (dataType === "QUOTATIONS") return ["Date", "Quotation No", "Customer", "Phone", "Location", "Total Amount", "Status"];
    if (dataType === "TICKETS") return ["Date", "Ticket No", "Customer", "Phone", "Location", "Service Type", "Status"];
    if (dataType === "LEADS") return ["Date", "Name", "Phone", "Location", "Service Required", "Status"];
    return [];
  };

  const getRow = (item: any) => {
    const date = new Date(item.createdAt).toLocaleDateString();
    if (dataType === "QUOTATIONS") return [date, item.quotationNo, item.customerName, item.phone, item.address || "-", `Rs. ${item.totalAmount}`, item.status];
    if (dataType === "TICKETS") return [date, item.ticketNumber, item.customerName, item.phone, item.city || item.address || "-", item.serviceType, item.status];
    if (dataType === "LEADS") return [date, item.name, item.phone, item.city || item.address || "-", item.serviceRequired, item.status];
    return [];
  };

  const downloadCSV = () => {
    const headers = getHeaders();
    const rows = data.map(item => getRow(item).map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Yash_Enterprises_${dataType}_Report.csv`;
    a.click();
  };

  const downloadWord = () => {
    const headers = getHeaders();
    const rows = data.map(item => getRow(item));
    
    let html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Report</title></head><body>
      <h2>Yash Enterprises - ${dataType} Report</h2>
      <p>Period: ${period}</p>
      <p>Total Records: ${data.length}</p>
      <table border="1" style="width:100%; border-collapse: collapse; text-align: left;">
        <thead><tr>${headers.map(h => `<th style="padding:8px; background:#f3f4f6;">${h}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map(r => `<tr>${r.map(c => `<td style="padding:8px;">${c}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
      </body></html>
    `;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Yash_Enterprises_${dataType}_Report.doc`;
    link.click();
  };

  const printPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto print:max-w-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Data Export & Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Evaluate your monthly, quarterly, and annual performance.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={downloadCSV} disabled={data.length === 0} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition disabled:opacity-50">
            <FileSpreadsheet className="w-4 h-4" /> Excel / CSV
          </button>
          <button onClick={downloadWord} disabled={data.length === 0} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition disabled:opacity-50">
            <FileText className="w-4 h-4" /> Word
          </button>
          <button onClick={printPDF} disabled={data.length === 0} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-lg transition disabled:opacity-50">
            <Printer className="w-4 h-4" /> PDF / Print
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 mb-8 print:hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Data Module</label>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setDataType("QUOTATIONS")} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${dataType === 'QUOTATIONS' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Quotations</button>
              <button onClick={() => setDataType("TICKETS")} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${dataType === 'TICKETS' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Service Tickets</button>
              <button onClick={() => setDataType("LEADS")} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${dataType === 'LEADS' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Sales Leads</button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Time Period</label>
            <select 
              value={period} 
              onChange={(e) => setPeriod(e.target.value as PeriodType)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-shadow"
            >
              <option value="MONTH">This Month</option>
              <option value="QUARTER">This Quarter</option>
              <option value="HALF_YEAR">This Half Year</option>
              <option value="YEAR">This Year</option>
              <option value="ALL">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Printable Area */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden print:border-none print:shadow-none">
        <div className="p-6 border-b border-slate-200 hidden print:block">
          <h2 className="text-2xl font-black text-slate-900">Yash Enterprises - {dataType} Report</h2>
          <p className="text-slate-500 font-medium">Period: {period.replace("_", " ")} | Total Records: {data.length}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 print:bg-slate-100">
                {getHeaders().map((h, i) => (
                  <th key={i} className="py-3 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">Loading data...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">No records found for this period.</td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                    {getRow(item).map((cell, i) => (
                      <td key={i} className="py-2.5 px-4 text-sm font-medium text-slate-800">{cell}</td>
                    ))}
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
