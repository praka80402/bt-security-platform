import React from "react";
import { db } from "@/lib/db";
import { Building2, School, Store, Factory, Landmark, Hotel, Warehouse, Hospital, ShieldCheck } from "lucide-react";

// Category to Icon mapping helper
function getCategoryIcon(category: string) {
  const cat = category.toLowerCase();
  if (cat.includes("school") || cat.includes("college") || cat.includes("education")) return School;
  if (cat.includes("hospital") || cat.includes("health") || cat.includes("clinic")) return Hospital;
  if (cat.includes("mall") || cat.includes("retail") || cat.includes("shop") || cat.includes("showroom")) return Store;
  if (cat.includes("warehouse") || cat.includes("logistics")) return Warehouse;
  if (cat.includes("bank") || cat.includes("financial")) return Landmark;
  if (cat.includes("hotel") || cat.includes("banquet") || cat.includes("hospitality")) return Hotel;
  if (cat.includes("factory") || cat.includes("mill") || cat.includes("plant")) return Factory;
  return Building2;
}

export default async function ClientsMarquee() {
  // Fetch dynamic clients from MySQL via Prisma
  const clients = await db.client.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  // If no clients added by admin yet, do not render empty segment
  if (!clients || clients.length === 0) {
    return null;
  }

  // Ensure enough items for smooth wide-screen infinite marquee loop
  let baseList = [...clients];
  while (baseList.length < 6) {
    baseList = [...baseList, ...clients];
  }
  const displayList = [...baseList, ...baseList];

  return (
    <section className="bg-slate-50 py-10 border-t border-b border-slate-200/80 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-1.5 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          Trusted By Industry Leaders
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Our Valued Clients & Commercial Deployments
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Securing enterprises, commercial facilities, schools, and residential communities across Bihar & Jharkhand
        </p>
      </div>

      {/* Marquee Wrapper with soft gradient fade edges */}
      <div className="relative w-full overflow-hidden">
        {/* Left gradient mask */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        {/* Right gradient mask */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex gap-4 py-2">
          {displayList.map((client, idx) => {
            const Icon = getCategoryIcon(client.category);
            return (
              <div
                key={`${client.id}-${idx}`}
                aria-hidden={idx >= clients.length ? "true" : undefined}
                className="w-[220px] sm:w-[240px] shrink-0 bg-emerald-50/80 hover:bg-emerald-100/70 rounded-2xl border border-emerald-200/90 shadow-sm hover:shadow-md hover: hover:border-emerald-400 transition-all duration-200 p-3.5 flex flex-col justify-between group cursor-default"
              >
                <div>
                  {/* Top Bar: Icon, Sort Order & Active Status */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-black text-emerald-800 bg-white px-1.5 py-0.5 rounded-md border border-emerald-200/80">
                        #{client.sortOrder || ((idx % clients.length) + 1)}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-800 border border-emerald-300 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>

                  {/* Client Details */}
                  <div className="space-y-1">
                    <h4
                      className="text-xs sm:text-[13px] font-black text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1"
                      title={client.name}
                    >
                      {client.name}
                    </h4>
                    <p className="text-[11px] text-emerald-800/80 font-medium line-clamp-1">
                      {client.category}
                    </p>
                    <div className="pt-1.5">
                      <span className="inline-block text-[10px] font-bold text-emerald-900 bg-white border border-emerald-300 px-2 py-0.5 rounded-lg shadow-xs">
                        🛡️ {client.badge}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}