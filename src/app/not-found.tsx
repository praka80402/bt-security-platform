import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
          <Search className="w-8 h-8" />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-blue-600">
          404 - Page Not Found
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-3">
          Product or Page Not Found
        </h1>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          The surveillance product or page you are looking for may have been moved, renamed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition"
          >
            Explore CCTV Products
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
