"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  Package, 
  FileText, 
  Building2,
  LogOut, 
  Shield, 
  Globe,
  X,
  BarChart
} from "lucide-react";

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Customer Leads", href: "/admin/leads", icon: Users },
    { label: "Quotations", href: "/admin/quotations", icon: FileText },
    { label: "Service Tickets", href: "/admin/tickets", icon: Wrench },
    { label: "Product Catalog", href: "/admin/products", icon: Package },
    { label: "AMC Contracts", href: "/admin/amc", icon: FileText },
    { label: "Clients Marquee", href: "/admin/clients", icon: Building2 },
    { label: "Data & Reports", href: "/admin/reports", icon: BarChart },
    { label: "Team / Staff", href: "/admin/team", icon: Shield },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen overflow-y-auto flex flex-col border-r border-slate-800 custom-scrollbar shadow-2xl md:shadow-none">
      {/* Header / Logo */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
            <img src="/images/logo.png" alt="Yash Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-tight">Yash Admin</h2>
            <span className="text-[10px] text-amber-400 font-bold block">Safety You Can See</span>
            <span className="text-[10px] text-slate-400 font-medium">bestcctvservice.com</span>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <Globe className="w-4 h-4 text-sky-400" />
          <span>View Public Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}