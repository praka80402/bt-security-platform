"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Filter,
  Search,
  Camera,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  CheckCircle2,
  Sparkles,
  Layers,
  ShoppingBag,
  RotateCcw
} from "lucide-react";
import { ProductItem } from "@/types";
import StoreTopNav from "./StoreTopNav";
import CategoryShowcase from "./CategoryShowcase";
import BrandShowcase from "./BrandShowcase";
import ProductCard from "./ProductCard";
import KitBuilderSection from "./KitBuilderSection";

interface ProductsStoreClientProps {
  initialProducts: ProductItem[] | any[];
}

export default function ProductsStoreClient({ initialProducts }: ProductsStoreClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(searchParams.get("subCategory") || "");
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get("brand") || "");
  const [selectedResolution, setSelectedResolution] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [showKitBuilder, setShowKitBuilder] = useState<boolean>(false);

  // Mobile Filter Drawer Toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state with URL params if user arrives via link
  useEffect(() => {
    const cat = searchParams.get("category");
    const brand = searchParams.get("brand");
    const sub = searchParams.get("subCategory");
    if (cat !== null) setSelectedCategory(cat);
    if (brand !== null) setSelectedBrand(brand);
    if (sub !== null) setSelectedSubCategory(sub);
  }, [searchParams]);

  // Counts calculations
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: initialProducts.length };
    initialProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [initialProducts]);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    initialProducts.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return counts;
  }, [initialProducts]);

  // Main Filter Logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Category
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // 2. Subcategory
      if (selectedSubCategory && product.subCategory !== selectedSubCategory) {
        return false;
      }

      // 3. Brand
      if (selectedBrand && product.brand !== selectedBrand) {
        return false;
      }

      // 4. In Stock
      if (inStockOnly && !product.inStock) {
        return false;
      }

      // 5. Price Range
      const pPrice = Number(product.price) || 0;
      if (priceRange === "under2000" && pPrice >= 2000) return false;
      if (priceRange === "2000to5000" && (pPrice < 2000 || pPrice > 5000)) return false;
      if (priceRange === "5000to10000" && (pPrice < 5000 || pPrice > 10000)) return false;
      if (priceRange === "above10000" && pPrice <= 10000) return false;

      // 6. Resolution (from specs or name)
      if (selectedResolution) {
        const text = `${product.name} ${product.specs || ""} ${product.description || ""}`.toLowerCase();
        if (!text.includes(selectedResolution.toLowerCase())) return false;
      }

      // 7. Search Query (Name, Model, Brand, Description, HSN)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          product.name.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          (product.modelNumber && product.modelNumber.toLowerCase().includes(q)) ||
          (product.hsnCode && product.hsnCode.includes(q)) ||
          (product.description && product.description.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [
    initialProducts,
    selectedCategory,
    selectedSubCategory,
    selectedBrand,
    selectedResolution,
    priceRange,
    inStockOnly,
    searchQuery,
  ]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "price_asc") {
      list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === "discount") {
      list.sort((a, b) => Number(b.discountPercent || 0) - Number(a.discountPercent || 0));
    } else if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else {
      // featured
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }, [filteredProducts, sortBy]);

  const resetAllFilters = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedBrand("");
    setSelectedResolution("");
    setPriceRange("");
    setInStockOnly(false);
    setSearchQuery("");
    setSortBy("featured");
  };

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedSubCategory) ||
    Boolean(selectedBrand) ||
    Boolean(selectedResolution) ||
    Boolean(priceRange) ||
    inStockOnly ||
    Boolean(searchQuery);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. Top Dropdown Bar (Header Menu) */}
      <StoreTopNav
        currentCategory={selectedCategory}
        currentBrand={selectedBrand}
        onSelectCategory={(cat, sub) => {
          setSelectedCategory(cat);
          if (sub) setSelectedSubCategory(sub);
          else setSelectedSubCategory("");
        }}
        onSelectBrand={(brand) => setSelectedBrand(brand)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Banner / Store Header */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Authorised Sales &amp; Distribution Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              CCTV Cameras, Kits &amp; Biometrics Store
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              100% Genuine Sealed Pack Products from CP Plus, Hikvision, Dahua, eSSL &amp; Seagate. Free doorstep delivery &amp; expert installation support across Patna, Khagaul and all Bihar districts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowKitBuilder(!showKitBuilder)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black shadow-lg shadow-blue-600/25 transition flex items-center gap-2 hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>{showKitBuilder ? "Hide Kit Configurator" : "Custom CCTV Kit Builder"}</span>
            </button>
          </div>
        </div>

        {/* 2. CCTV Kit Configurator Section (If Toggled or active) */}
        {showKitBuilder && <KitBuilderSection />}

        {/* 3. Visual "Shop by Category" Showcase */}
        <CategoryShowcase
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setSelectedSubCategory("");
          }}
          counts={categoryCounts}
        />

        {/* 4. Visual "Shop by Brand" Showcase */}
        <BrandShowcase
          selectedBrand={selectedBrand}
          onSelectBrand={(b) => setSelectedBrand(b)}
          brandCounts={brandCounts}
        />

        {/* 5. Main Store Layout (Sidebar Filters + Products Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start pt-2">
          
          {/* DESKTOP SIDEBAR FILTERS (cctvcart style) */}
          <aside className="hidden lg:block bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6 sticky top-[165px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                <Filter className="w-4 h-4 text-blue-600" />
                <span>Filters &amp; Search</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Filter: Categories Accordion */}
            <div className="space-y-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Category
              </span>
              <div className="space-y-1">
                {[
                  { label: "All Products", val: "" },
                  { label: "CCTV Cameras", val: "CCTV_CAMERA" },
                  { label: "DVR & NVR Storage", val: "NVR_DVR" },
                  { label: "CCTV Combo Kits", val: "CCTV_KIT" },
                  { label: "Surveillance HDDs", val: "STORAGE_HDD" },
                  { label: "Biometric Attendance", val: "BIOMETRIC_ATTENDANCE" },
                  { label: "Accessories & Cables", val: "ACCESSORIES" },
                ].map((item) => {
                  const isActive = selectedCategory === item.val;
                  const count = item.val ? categoryCounts[item.val] || 0 : categoryCounts["ALL"];

                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        setSelectedCategory(item.val);
                        setSelectedSubCategory("");
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between transition ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                          isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter: Resolution (Megapixels) */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Camera Resolution
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "All MP", val: "" },
                  { label: "2 MP (1080p)", val: "2 MP" },
                  { label: "2.4 MP", val: "2.4" },
                  { label: "4 MP (2K)", val: "4 MP" },
                  { label: "5 MP UHD", val: "5 MP" },
                  { label: "4K (8 MP)", val: "4K" },
                ].map((r) => (
                  <button
                    key={r.label}
                    onClick={() => setSelectedResolution(selectedResolution === r.val ? "" : r.val)}
                    className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold text-center transition border ${
                      selectedResolution === r.val
                        ? "bg-slate-900 border-slate-900 text-white font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Price Range */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Price Range
              </span>
              <div className="space-y-1">
                {[
                  { label: "All Prices", val: "" },
                  { label: "Under ₹2,000", val: "under2000" },
                  { label: "₹2,000 – ₹5,000", val: "2000to5000" },
                  { label: "₹5,000 – ₹10,000", val: "5000to10000" },
                  { label: "Above ₹10,000", val: "above10000" },
                ].map((pr) => (
                  <button
                    key={pr.label}
                    onClick={() => setPriceRange(priceRange === pr.val ? "" : pr.val)}
                    className={`w-full px-3 py-1.5 rounded-lg text-xs font-semibold text-left transition ${
                      priceRange === pr.val
                        ? "bg-blue-50 text-blue-700 font-bold border border-blue-200"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pr.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Stock Only */}
            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0"
                />
                <span>In Stock &amp; Ready to Ship</span>
              </label>
            </div>
          </aside>

          {/* MAIN PRODUCT LISTING AREA */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Search & Sort Controls Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
              
              {/* Live Search Input */}
              <div className="relative flex-1 min-w-[240px] max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search model no. (e.g. DS-2CE, CP-UVR), brand or specs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                <span>Filters {hasActiveFilters && "•"}</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="featured">Featured / Best Seller</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="discount">Biggest Discount (%)</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Active Filter Pills Bar */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold text-[11px]">Active Filters:</span>
                {selectedCategory && (
                  <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    Category: {selectedCategory.replace("_", " ")}
                    <button onClick={() => setSelectedCategory("")} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBrand && (
                  <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    Brand: {selectedBrand}
                    <button onClick={() => setSelectedBrand("")} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedResolution && (
                  <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    Resolution: {selectedResolution}
                    <button onClick={() => setSelectedResolution("")} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {priceRange && (
                  <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    Price: {priceRange}
                    <button onClick={() => setPriceRange("")} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="hover:text-amber-950">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={resetAllFilters}
                  className="text-blue-600 font-bold hover:underline text-[11px] ml-1"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Products Grid */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">No Products Match Your Filter</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Try searching for another model number, clearing brand filters, or resetting search.
                  </p>
                </div>
                <button
                  onClick={resetAllFilters}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}

          </main>
        </div>

      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900">Filter Products</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubCategory("");
                }}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              >
                <option value="">All Categories</option>
                <option value="CCTV_CAMERA">CCTV Cameras</option>
                <option value="NVR_DVR">DVR &amp; NVR</option>
                <option value="CCTV_KIT">CCTV Combo Kits</option>
                <option value="STORAGE_HDD">Surveillance HDDs</option>
                <option value="BIOMETRIC_ATTENDANCE">Biometric Attendance</option>
                <option value="ACCESSORIES">Accessories &amp; Cables</option>
              </select>
            </div>

            {/* Brand Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              >
                <option value="">All Brands</option>
                {Object.keys(brandCounts).map((b) => (
                  <option key={b} value={b}>
                    {b} ({brandCounts[b]})
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Apply Filters ({sortedProducts.length} Items)
              </button>
              <button
                onClick={() => {
                  resetAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
