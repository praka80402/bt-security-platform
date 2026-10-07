import { getCollections, getInvoices } from "../../finance/actions";
import { IndianRupee, TrendingUp, Calendar, PieChart, Activity, ArrowLeft } from "lucide-react";
import Link from "next/link";
import MonthYearFilter from "./Filter";

export const dynamic = 'force-dynamic';

export default async function IncomeReportPage({ searchParams }: { searchParams: { m?: string, y?: string } }) {
  // Fetch generated bills (invoices) and payment collections
  const invoices = await getInvoices();
  const collections = await getCollections();

  const selectedMonth = searchParams?.m ? Number(searchParams.m) : null;
  const selectedYear = searchParams?.y ? Number(searchParams.y) : null;

  let totalIncome = 0;
  let thisMonth = 0;
  let thisWeek = 0;
  
  let bySource: Record<string, number> = { SALES: 0, SERVICE: 0 };
  let byCategory: Record<string, number> = { CCTV: 0, BIOMETRIC: 0, FIRE: 0, OTHER: 0 };
  
  let byMonth: Record<string, number> = {};
  const now = new Date();
  const yearToPopulate = selectedYear || now.getFullYear();
  const isCurrentYear = yearToPopulate === now.getFullYear();
  const maxMonth = isCurrentYear ? now.getMonth() + 1 : 12;
  
  for (let m = 1; m <= maxMonth; m++) {
    byMonth[`${yearToPopulate}-${String(m).padStart(2, '0')}`] = 0;
  }
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0,0,0,0);

  // We consider Generated Bills (Invoices) as the primary source of Revenue/Income
  invoices.forEach(inv => {
    const amt = Number(inv.totalAmount) || 0;
    totalIncome += amt;
    
    const d = new Date(inv.createdAt);
    if (d >= startOfMonth) thisMonth += amt;
    if (d >= startOfWeek) thisWeek += amt;

    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!byMonth[monthKey]) byMonth[monthKey] = 0;
    byMonth[monthKey] += amt;
    
    // If a filter is applied, only add to bySource and byCategory if it matches the selected month/year
    const matchesFilter = (!selectedYear || d.getFullYear() === selectedYear) && (!selectedMonth || (d.getMonth() + 1) === selectedMonth);
    
    if (matchesFilter) {
      let meta = { supplierRef: "" };
      try { meta = { ...meta, ...JSON.parse(inv.notes || "{}") } } catch(e) {}
      
      // Determine Source
      if (meta.supplierRef.startsWith("TKT-")) {
        bySource.SERVICE += amt;
      } else {
        bySource.SALES += amt;
      }
      
      // Determine Category from item names
      let cat = "OTHER";
      if (inv.items && inv.items.length > 0) {
        const firstItem = inv.items[0].name.toLowerCase();
        if (firstItem.includes("cctv") || firstItem.includes("camera") || firstItem.includes("dvr") || firstItem.includes("nvr") || firstItem.includes("hdd")) {
          cat = "CCTV";
        } else if (firstItem.includes("biometric") || firstItem.includes("attendance")) {
          cat = "BIOMETRIC";
        } else if (firstItem.includes("fire") || firstItem.includes("smoke")) {
          cat = "FIRE";
        }
      }
      
      if (byCategory[cat] !== undefined) byCategory[cat] += amt;
      else byCategory.OTHER += amt;
    }
  });

  // Also process manual Collections that might not have an invoice
  collections.forEach(col => {
    // If it's linked to a ticket, it might be double counting if they also generated a bill.
    // Assuming collections without ticketNumber/supplierRef are direct income.
    let meta = { source: "SALES", category: "OTHER", ticketNumber: "" };
    try { meta = { ...meta, ...JSON.parse(col.notes || "{}") } } catch(e) {}
    
    // Only count collections that aren't already billed (to avoid double counting, or if user wants all, we can include all. Let's include all for now if they are pure collections)
    // Actually, usually they either generate a bill OR record a collection. Let's add them up!
    const amt = Number(col.totalAmount) || 0;
    totalIncome += amt;
    
    const d = new Date(col.createdAt);
    if (d >= startOfMonth) thisMonth += amt;
    if (d >= startOfWeek) thisWeek += amt;

    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!byMonth[monthKey]) byMonth[monthKey] = 0;
    byMonth[monthKey] += amt;
    
    const matchesFilter = (!selectedYear || d.getFullYear() === selectedYear) && (!selectedMonth || (d.getMonth() + 1) === selectedMonth);

    if (matchesFilter) {
      if (meta.source === "SERVICE" || meta.ticketNumber) bySource.SERVICE += amt; 
      else bySource.SALES += amt;
      
      const cat = (meta.category || "OTHER").toUpperCase();
      if (byCategory[cat] !== undefined) byCategory[cat] += amt;
      else byCategory.OTHER += amt;
    }
  });

  const filteredTotalIncome = Object.values(bySource).reduce((a, b) => a + b, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link href="/admin/reports" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Data & Reports
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
            Company Revenue Dashboard
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Payment collections analyzed by time, source, and category.</p>
        </div>
        <div>
          <MonthYearFilter />
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-600/20">
          <div className="flex items-center gap-2 text-emerald-100 font-bold mb-2">
            <IndianRupee className="w-5 h-5" /> {selectedMonth || selectedYear ? "INCOME (SELECTED PERIOD)" : "TOTAL INCOME (ALL TIME)"}
          </div>
          <div className="text-4xl font-black">₹{(selectedMonth || selectedYear ? filteredTotalIncome : totalIncome).toLocaleString()}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 font-bold mb-2">
            <Calendar className="w-5 h-5 text-blue-500" /> THIS MONTH
          </div>
          <div className="text-3xl font-black text-slate-800">₹{thisMonth.toLocaleString()}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 font-bold mb-2">
            <Activity className="w-5 h-5 text-amber-500" /> THIS WEEK
          </div>
          <div className="text-3xl font-black text-slate-800">₹{thisWeek.toLocaleString()}</div>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Source Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 border-b pb-3">
            <PieChart className="w-5 h-5 text-indigo-500" /> Income by Source
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-bold text-slate-700">Sales & Projects</span>
                <span className="font-bold text-lg text-emerald-600">₹{bySource.SALES.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="bg-indigo-500 h-3 rounded-full" style={{ width: filteredTotalIncome > 0 ? `${(bySource.SALES/filteredTotalIncome)*100}%` : '0%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-bold text-slate-700">Service & Maintenance</span>
                <span className="font-bold text-lg text-emerald-600">₹{bySource.SERVICE.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="bg-amber-500 h-3 rounded-full" style={{ width: filteredTotalIncome > 0 ? `${(bySource.SERVICE/filteredTotalIncome)*100}%` : '0%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 border-b pb-3">
            <PieChart className="w-5 h-5 text-pink-500" /> Income by Item / Category
          </h2>
          <div className="space-y-5">
            {Object.entries(byCategory).sort((a,b) => b[1]-a[1]).map(([cat, val], idx) => {
              const colors = ['bg-pink-500', 'bg-blue-500', 'bg-emerald-500', 'bg-slate-400'];
              const color = colors[idx % colors.length];
              return (
                <div key={cat}>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="font-bold text-slate-700">{cat}</span>
                    <span className="font-bold text-emerald-600">₹{val.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`${color} h-2 rounded-full`} style={{ width: filteredTotalIncome > 0 ? `${(val/filteredTotalIncome)*100}%` : '0%' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
      </div>

      {/* Month-wise Income */}
      <details className="bg-white border border-slate-200 rounded-2xl shadow-sm mt-6 group">
        <summary className="p-6 text-lg font-bold text-slate-800 flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Month-wise Income Trend
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform"><path d="m6 9 6 6 6-6"/></svg>
        </summary>
        <div className="px-6 pb-6 space-y-4 border-t pt-4">
          {Object.entries(byMonth)
            .sort((a,b) => b[0].localeCompare(a[0])) // Sort descending (latest month first)
            .map(([monthKey, val]) => {
            const [y, m] = monthKey.split("-");
            const dateObj = new Date(Number(y), Number(m)-1, 1);
            const friendlyName = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
            const maxVal = Math.max(...Object.values(byMonth), 1);
            return (
              <div key={monthKey} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition gap-4">
                <div className="font-bold text-slate-700 w-40">{friendlyName}</div>
                <div className="flex items-center gap-4 flex-1 md:justify-end">
                   <div className="w-full md:max-w-md bg-slate-100 rounded-full h-3 hidden md:block flex-1">
                     <div className="bg-blue-500 h-3 rounded-full" style={{ width: Math.min((val/maxVal)*100, 100) + '%' }}></div>
                   </div>
                   <div className="font-black text-lg text-emerald-600 min-w-[120px] text-right">₹{val.toLocaleString()}</div>
                </div>
              </div>
            );
          })}
          {Object.keys(byMonth).length === 0 && (
            <div className="text-center text-slate-500 py-4">No data available yet.</div>
          )}
        </div>
      </details>
    </div>
  );
}
