"use client";

import "../admin.css";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sessionState, setSessionState] = useState<"checking" | "ok" | "failed">("checking");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setSessionState("ok");
      return;
    }

    setSessionState("checking");
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) {
          setSessionState("ok");
        } else {
          setSessionState("failed");
          router.push(`/admin/login?next=${encodeURIComponent(pathname)}`);
        }
      })
      .catch(() => {
        setSessionState("failed");
        router.push(`/admin/login?next=${encodeURIComponent(pathname)}`);
      });
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (sessionState === "checking") {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm">Checking your session...</div>;
  }

  if (sessionState === "failed") {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm">Redirecting to login...</div>;
  }

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden relative">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto w-full md:w-auto">
        <header className="h-16 shrink-0 bg-slate-900 border-b border-slate-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden p-2 -ml-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm font-semibold text-slate-300 hidden sm:block">
              Yash Enterprises Management Console
            </div>
            <div className="text-sm font-semibold text-slate-300 sm:hidden">
              Management Console
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">MySQL 8.0 Connected</span>
            <span className="text-xs text-slate-400 font-mono sm:hidden">Online</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-slate-950/60">
          {children}
        </main>
      </div>
    </div>
  );
}
