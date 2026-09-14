import { db } from "@/lib/db";
import { Camera, Filter, CheckCircle2, MessageSquare } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; brand?: string };
}) {
  const where: any = {};
  if (searchParams.category) where.category = searchParams.category;
  if (searchParams.brand) where.brand = searchParams.brand;

  let products: any[] = [];
  try {
    products = await db.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Database query failed in ProductsPage:", error);
  }

  const categories = [
    { label: "All Products", value: "" },
    { label: "CCTV Cameras", value: "CCTV_CAMERA" },
    { label: "DVR & NVR Storage", value: "NVR_DVR" },
    { label: "Biometric Attendance", value: "BIOMETRIC_ATTENDANCE" },
    { label: "Access Control & Locks", value: "ACCESS_CONTROL" },
  ];

  const brands = ["All", "CP Plus", "Hikvision", "Dahua", "eSSL", "Matrix", "Realtime"];

  return (
    <div className="bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
            Yash Enterprises Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
            CCTV Cameras & Biometric Attendance Systems
          </h1>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl">
            100% genuine products with manufacturer warranty, professional installation, and technical setup support.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm mb-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Filter className="w-4 h-4 text-blue-600" /> Filter By Category:
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = (searchParams.category || "") === cat.value;
              return (
                <Link
                  key={cat.label}
                  href={`/products?${new URLSearchParams({
                    ...(cat.value && { category: cat.value }),
                    ...(searchParams.brand && { brand: searchParams.brand }),
                  }).toString()}`}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">Brand:</span>
            {brands.map((b) => {
              const isAll = b === "All";
              const isActive = isAll ? !searchParams.brand : searchParams.brand === b;
              return (
                <Link
                  key={b}
                  href={`/products?${new URLSearchParams({
                    ...(searchParams.category && { category: searchParams.category }),
                    ...(!isAll && { brand: b }),
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {b}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
            <Camera className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="font-bold text-slate-700">No products found in this filter.</p>
            <Link href="/products" className="text-xs text-blue-600 hover:underline mt-2 inline-block font-semibold">
              Reset all filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => {
              let featuresList: string[] = [];
              try {
                if (prod.features) {
                  featuresList = JSON.parse(prod.features);
                }
              } catch {
                featuresList = prod.features ? prod.features.split(",") : [];
              }

              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-card flex flex-col justify-between"
                >
                  <div>
                    <div className="h-52 bg-slate-100 relative flex items-center justify-center p-4">
                      {prod.imageUrl ? (
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="object-contain h-full w-full"
                        />
                      ) : (
                        <Camera className="w-16 h-16 text-slate-300" />
                      )}
                      <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {prod.brand}
                      </span>
                      {prod.modelNumber && (
                        <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm">
                          {prod.modelNumber}
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                        {prod.category.replace("_", " ")}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-1">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {prod.description}
                      </p>

                      {featuresList.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                          {featuresList.slice(0, 3).map((f, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Offer Price</span>
                        <span className="text-xl font-black text-slate-900">
                          {prod.price ? `₹${Number(prod.price).toLocaleString("en-IN")}` : "Get Quote"}
                        </span>
                      </div>
                      <a
                        href={`https://wa.me/919308907319?text=Hello%20Yash%20Enterprises,%20I%20want%20to%20order/enquire%20about:%20${encodeURIComponent(prod.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp Quote</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}