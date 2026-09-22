import { db } from "@/lib/db";
import { Users, Wrench, Package, FileText, ArrowUpRight, ArrowRight, ClipboardList } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalLeads, totalTickets, totalProducts, totalAmc, totalQuotations] = await Promise.all([
    db.lead.count(),
    db.serviceTicket.count(),
    db.product.count(),
    db.amcContract.count(),
    db.quotation.count(),
  ]);

  const recentLeads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentTickets = await db.serviceTicket.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Business Overview</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Real-time metrics for Yash Enterprises CCTV & Biometrics operations
        </p>
      </div>

      {/* KPI Cards (Entire cards are clickable) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* Leads KPI Card */}
        <Link
          href="/admin/leads"
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 p-5 rounded-2xl flex items-center justify-between transition-all group shadow-md"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Customer Leads</span>
            <span className="text-3xl font-black text-white mt-1 block">{totalLeads}</span>
            <span className="text-xs text-blue-400 font-semibold flex items-center gap-1 mt-2 group-hover:translate-x-1 transition">
              Open Leads & Quotes <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
            <Users className="w-6 h-6" />
          </div>
        </Link>

        {/* Quotations KPI Card (New 5th Card) */}
        <Link
          href="/admin/quotations"
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 p-5 rounded-2xl flex items-center justify-between transition-all group shadow-md"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Quotations</span>
            <span className="text-3xl font-black text-white mt-1 block">{totalQuotations}</span>
            <span className="text-xs text-purple-400 font-semibold flex items-center gap-1 mt-2 group-hover:translate-x-1 transition">
              Manage Quotes <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition">
            <ClipboardList className="w-6 h-6" />
          </div>
        </Link>

        {/* Tickets KPI Card */}
        <Link
          href="/admin/tickets"
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl flex items-center justify-between transition-all group shadow-md"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Service Tickets</span>
            <span className="text-3xl font-black text-white mt-1 block">{totalTickets}</span>
            <span className="text-xs text-amber-400 font-semibold flex items-center gap-1 mt-2 group-hover:translate-x-1 transition">
              Manage Tickets <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
            <Wrench className="w-6 h-6" />
          </div>
        </Link>

        {/* Products KPI Card */}
        <Link
          href="/admin/products"
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/50 p-5 rounded-2xl flex items-center justify-between transition-all group shadow-md"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Catalog Products</span>
            <span className="text-3xl font-black text-white mt-1 block">{totalProducts}</span>
            <span className="text-xs text-sky-400 font-semibold flex items-center gap-1 mt-2 group-hover:translate-x-1 transition">
              Manage Catalog <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-110 transition">
            <Package className="w-6 h-6" />
          </div>
        </Link>

        {/* AMC KPI Card */}
        <Link
          href="/admin/amc"
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl flex items-center justify-between transition-all group shadow-md"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active AMC</span>
            <span className="text-3xl font-black text-white mt-1 block">{totalAmc}</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-2 group-hover:translate-x-1 transition">
              View Contracts <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
            <FileText className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Two Column Tables: Recent Leads & Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Leads */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" /> Recent Inquiries & Quotes
            </h3>
            <Link href="/admin/leads" className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
              <span>View All Leads</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentLeads.map((l) => (
              <Link
                key={l.id}
                href="/admin/leads"
                className="p-3.5 bg-slate-950/60 hover:bg-slate-800/80 rounded-xl border border-slate-800/80 flex items-center justify-between transition block group"
              >
                <div>
                  <p className="font-bold text-slate-200 text-sm group-hover:text-blue-400 transition">{l.name}</p>
                  <p className="text-xs text-slate-400">{l.phone} • {l.serviceType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {l.status}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Service Tickets */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" /> Recent Service Tickets
            </h3>
            <Link href="/admin/tickets" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
              <span>View All Tickets</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentTickets.map((t) => (
              <Link
                key={t.id}
                href="/admin/tickets"
                className="p-3.5 bg-slate-950/60 hover:bg-slate-800/80 rounded-xl border border-slate-800/80 flex items-center justify-between transition block group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-400">{t.ticketNumber}</span>
                    <span className="font-bold text-slate-200 text-sm group-hover:text-amber-400 transition">{t.customerName}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{t.issueDescription}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {t.status}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}