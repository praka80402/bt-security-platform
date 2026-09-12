"use client";

import "../admin.css";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (pathname === "/admin/login") return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!mounted) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm">Loading admin console...</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-300">
            Yash Enterprises Management Console
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-slate-400 font-mono">MySQL 8.0 Connected</span>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 bg-slate-950/60">
          {children}
        </main>
      </div>
    </div>
  );
}