"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  Camera,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  HardDrive,
  Cpu,
  Layers,
  ShieldCheck,
  Tag
} from "lucide-react";
import { ProductItem, ProductCategory } from "@/types";

const CATEGORY_TABS: { label: string; value: string; icon?: any }[] = [
  { label: "All Products", value: "" },
  { label: "CCTV Cameras", value: "CCTV_CAMERA" },
  { label: "DVR & NVR", value: "NVR_DVR" },
  { label: "CCTV Kits", value: "CCTV_KIT" },
  { label: "Storage (HDD)", value: "STORAGE_HDD" },
  { label: "Biometric Attendance", value: "BIOMETRIC_ATTENDANCE" },
  { label: "Access Control", value: "ACCESS_CONTROL" },
  { label: "Accessories", value: "ACCESSORIES" },
];

const SUBCATEGORIES_BY_CATEGORY: Record<string, { label: string; value: string }[]> = {
  CCTV_CAMERA: [
    { label: "IP Bullet (Outdoor)", value: "IP_BULLET" },
    { label: "IP Dome (Indoor/Ceiling)", value: "IP_DOME" },
    { label: "Analog Bullet (HD)", value: "ANALOG_BULLET" },
    { label: "Analog Dome (HD)", value: "ANALOG_DOME" },
    { label: "Wi-Fi 360° PT Camera", value: "WIFI_360" },
    { label: "PTZ Zoom Camera", value: "PTZ_CAMERA" },
    { label: "4G SIM Solar Camera", value: "SOLAR_4G" },
  ],
  NVR_DVR: [
    { label: "4CH HD DVR", value: "4CH_DVR" },
    { label: "8CH HD DVR", value: "8CH_DVR" },
    { label: "16CH HD DVR", value: "16CH_DVR" },
    { label: "4CH / 8CH PoE NVR", value: "POE_NVR" },
    { label: "16CH / 32CH 4K NVR", value: "4K_NVR" },
  ],
  CCTV_KIT: [
    { label: "4 Camera Complete Kit", value: "4CH_KIT" },
    { label: "8 Camera Complete Kit", value: "8CH_KIT" },
    { label: "16 Camera Commercial Kit", value: "16CH_KIT" },
  ],
  STORAGE_HDD: [
    { label: "1TB Surveillance HDD", value: "1TB_HDD" },
    { label: "2TB Surveillance HDD", value: "2TB_HDD" },
    { label: "4TB / 6TB Surveillance HDD", value: "4TB_HDD" },
    { label: "Surveillance MicroSD Card", value: "MICROSD" },
  ],
  BIOMETRIC_ATTENDANCE: [
    { label: "Fingerprint Attendance", value: "FINGERPRINT" },
    { label: "AI Face Recognition", value: "FACE_ATTENDANCE" },
    { label: "Card / RFID Attendance", value: "CARD_ACCESS" },
  ],
  ACCESS_CONTROL: [
    { label: "Smart Digital Door Lock", value: "SMART_LOCK" },
    { label: "EM Lock + Power Supply", value: "EM_LOCK" },
    { label: "Exit Switch & Accessories", value: "EXIT_SWITCH" },
  ],
  ACCESSORIES: [
    { label: "3+1 / Coaxial CCTV Cable", value: "CABLE" },
    { label: "Cat6 Pure Copper Network Cable", value: "CAT6_CABLE" },
    { label: "SMPS Power Supply Box", value: "POWER_SUPPLY" },
    { label: "PoE Network Switch", value: "POE_SWITCH" },
    { label: "CCTV Rack & Enclosure", value: "RACK" },
    { label: "BNC & DC Connectors", value: "CONNECTORS" },
  ],
};

const DEFAULT_HSN: Record<string, string> = {
  CCTV_CAMERA: "852580",
  NVR_DVR: "852190",
  CCTV_KIT: "852580",
  STORAGE_HDD: "847170",
  BIOMETRIC_ATTENDANCE: "854370",
  ACCESS_CONTROL: "854370",
  ACCESSORIES: "850440",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [modalMode, setModalMode] = useState<"ADD" | "EDIT">("ADD");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "CCTV_CAMERA" as ProductCategory,
    subCategory: "ANALOG_BULLET",
    brand: "CP Plus",
    modelNumber: "",
    mrp: "",
    price: "",
    discountPercent: 0,
    description: "",
    features: "",
    imageUrl: "",
    warranty: "2 Years Brand Warranty",
    hsnCode: "852580",
    inStock: true,
    featured: false,
    isKit: false,
    // Dynamic spec fields
    specResolution: "2 MP Full HD",
    specLens: "3.6mm Fixed Lens",
    specNightVision: "20m Color Night Vision",
    specAudio: "Built-in Microphone",
    specWeatherproof: "IP67 Weatherproof",
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: number | null }>({
    show: false,
    id: null,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Update HSN & Subcategory automatically when category changes
  const handleCategoryChange = (cat: ProductCategory) => {
    const subList = SUBCATEGORIES_BY_CATEGORY[cat] || [];
    const firstSub = subList[0]?.value || "";
    const hsn = DEFAULT_HSN[cat] || "";

    setFormData((prev) => ({
      ...prev,
      category: cat,
      subCategory: firstSub,
      hsnCode: hsn,
      isKit: cat === "CCTV_KIT",
    }));
  };

  // Auto calculate discount percentage
  const handlePriceChange = (field: "mrp" | "price", val: string) => {
    setFormData((prev) => {
      const mrpNum = field === "mrp" ? parseFloat(val) : parseFloat(prev.mrp);
      const priceNum = field === "price" ? parseFloat(val) : parseFloat(prev.price);
      let disc = 0;
      if (mrpNum && priceNum && mrpNum > priceNum) {
        disc = Math.round(((mrpNum - priceNum) / mrpNum) * 100);
      }
      return {
        ...prev,
        [field]: val,
        discountPercent: disc,
      };
    });
  };

  const openAddModal = () => {
    setModalMode("ADD");
    setEditingId(null);
    setFormData({
      name: "",
      category: (selectedCategoryTab as ProductCategory) || "CCTV_CAMERA",
      subCategory: "ANALOG_BULLET",
      brand: "CP Plus",
      modelNumber: "",
      mrp: "",
      price: "",
      discountPercent: 0,
      description: "",
      features: "",
      imageUrl: "",
      warranty: "2 Years Brand Warranty",
      hsnCode: DEFAULT_HSN[selectedCategoryTab || "CCTV_CAMERA"] || "852580",
      inStock: true,
      featured: false,
      isKit: selectedCategoryTab === "CCTV_KIT",
      specResolution: "2 MP Full HD",
      specLens: "3.6mm Fixed Lens",
      specNightVision: "20m Color Night Vision",
      specAudio: "Built-in Microphone",
      specWeatherproof: "IP67 Weatherproof",
    });
    setShowModal(true);
  };

  const openEditModal = (p: ProductItem) => {
    setModalMode("EDIT");
    setEditingId(p.id);

    let parsedSpecs: Record<string, string> = {};
    try {
      if (p.specs) parsedSpecs = JSON.parse(p.specs);
    } catch {}

    setFormData({
      name: p.name,
      category: p.category,
      subCategory: p.subCategory || "",
      brand: p.brand,
      modelNumber: p.modelNumber || "",
      mrp: p.mrp ? String(p.mrp) : "",
      price: p.price ? String(p.price) : "",
      discountPercent: p.discountPercent || 0,
      description: p.description || "",
      features: p.features || "",
      imageUrl: p.imageUrl || "",
      warranty: p.warranty || "2 Years Brand Warranty",
      hsnCode: p.hsnCode || DEFAULT_HSN[p.category] || "",
      inStock: p.inStock,
      featured: p.featured,
      isKit: Boolean(p.isKit),
      specResolution: parsedSpecs["Resolution"] || "",
      specLens: parsedSpecs["Lens"] || "",
      specNightVision: parsedSpecs["Night Vision Range"] || parsedSpecs["Night Vision"] || "",
      specAudio: parsedSpecs["Audio"] || "",
      specWeatherproof: parsedSpecs["Ingress Protection"] || parsedSpecs["Weatherproof"] || "",
    });
    setShowModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const specsObj: Record<string, string> = {};
    if (formData.specResolution) specsObj["Resolution"] = formData.specResolution;
    if (formData.specLens) specsObj["Lens"] = formData.specLens;
    if (formData.specNightVision) specsObj["Night Vision Range"] = formData.specNightVision;
    if (formData.specAudio) specsObj["Audio"] = formData.specAudio;
    if (formData.specWeatherproof) specsObj["Ingress Protection"] = formData.specWeatherproof;
    if (formData.hsnCode) specsObj["HSN Code"] = formData.hsnCode;

    const payload = {
      name: formData.name,
      category: formData.category,
      subCategory: formData.subCategory,
      brand: formData.brand,
      modelNumber: formData.modelNumber,
      mrp: formData.mrp ? parseFloat(formData.mrp) : null,
      price: formData.price ? parseFloat(formData.price) : null,
      discountPercent: formData.discountPercent,
      description: formData.description,
      features: formData.features,
      specs: JSON.stringify(specsObj),
      imageUrl: formData.imageUrl,
      warranty: formData.warranty,
      hsnCode: formData.hsnCode,
      isKit: formData.isKit,
      inStock: formData.inStock,
      featured: formData.featured,
    };

    try {
      const url = modalMode === "ADD" ? "/api/products" : `/api/products/${editingId}`;
      const method = modalMode === "ADD" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save product");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await fetch(`/api/products/${deleteConfirm.id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  };

  // Filtered products list based on category tab & search
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesTab = !selectedCategoryTab || p.category === selectedCategoryTab;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.modelNumber && p.modelNumber.toLowerCase().includes(q)) ||
        (p.hsnCode && p.hsnCode.includes(q));

      return matchesTab && matchesSearch;
    });
  }, [products, selectedCategoryTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Product?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to remove this product? It will be removed from the public catalog.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, id: null })}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-rose-500/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Package className="w-7 h-7 text-blue-500" />
            CCTV &amp; Biometrics Inventory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Category-wise product catalog management, pricing, technical specifications &amp; stock control.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Category Tabs (Shop by Category in Admin) */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex flex-wrap gap-1.5 shadow-sm">
        {CATEGORY_TABS.map((tab) => {
          const isActive = selectedCategoryTab === tab.value;
          const count = tab.value
            ? products.filter((p) => p.category === tab.value).length
            : products.length;

          return (
            <button
              key={tab.label}
              onClick={() => setSelectedCategoryTab(tab.value)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-700 text-slate-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, brand, model no, or HSN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Showing <span className="font-bold text-white">{filteredProducts.length}</span> of{" "}
          <span className="font-bold text-white">{products.length}</span> products
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Category &amp; Subcategory</th>
                <th className="px-6 py-4">Brand / Model / HSN</th>
                <th className="px-6 py-4">Pricing &amp; Discount</th>
                <th className="px-6 py-4">Stock Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <p className="text-slate-400 text-sm">No products found in this category or search.</p>
                    <button
                      onClick={openAddModal}
                      className="mt-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Add Product Here
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      {/* Product Name & Image */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden flex items-center justify-center shrink-0 border border-slate-700/60 p-1">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                            ) : (
                              <Camera className="w-6 h-6 text-slate-500" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-white text-sm block leading-snug">{p.name}</span>
                            <div className="flex items-center gap-2 mt-1">
                              {p.featured && (
                                <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-extrabold px-1.5 py-0.5 rounded">
                                  FEATURED
                                </span>
                              )}
                              {p.isKit && (
                                <span className="text-[9px] bg-purple-500/20 text-purple-400 border border-purple-500/30 font-extrabold px-1.5 py-0.5 rounded">
                                  COMBO KIT
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400">{p.warranty || "2 Years"}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & SubCategory */}
                      <td className="px-6 py-4 text-xs">
                        <span className="font-bold text-blue-400 block">{p.category.replace("_", " ")}</span>
                        {p.subCategory && (
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full inline-block mt-1">
                            {p.subCategory.replace("_", " ")}
                          </span>
                        )}
                      </td>

                      {/* Brand, Model, HSN */}
                      <td className="px-6 py-4 text-xs">
                        <span className="font-bold text-slate-100 block">{p.brand}</span>
                        <span className="text-slate-400 block font-mono text-[11px]">{p.modelNumber || "—"}</span>
                        {p.hsnCode && <span className="text-[10px] text-slate-500 block">HSN: {p.hsnCode}</span>}
                      </td>

                      {/* Price & MRP */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-baseline gap-2">
                          <span className="font-black text-white text-sm">
                            {p.price ? `₹${Number(p.price).toLocaleString("en-IN")}` : "Get Quote"}
                          </span>
                          {p.mrp && Number(p.mrp) > Number(p.price) && (
                            <span className="text-xs text-slate-500 line-through">
                              ₹{Number(p.mrp).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                        {p.discountPercent && p.discountPercent > 0 ? (
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded inline-block mt-0.5">
                            {p.discountPercent}% OFF
                          </span>
                        ) : null}
                      </td>

                      {/* Stock Status */}
                      <td className="px-6 py-4 text-xs">
                        {p.inStock ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> In Stock
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-bold">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ show: true, id: p.id })}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category-Wise Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-5 text-white shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black">
                  {modalMode === "ADD" ? "Add Product (Category-Wise)" : "Edit Product"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set category, subcategory, commercial pricing, specs &amp; features.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {/* Product Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hikvision 2MP Full-Color Audio Bullet Camera"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category & SubCategory (Dynamic) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-blue-400 mb-1">Main Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value as ProductCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-blue-500"
                  >
                    <option value="CCTV_CAMERA">📹 CCTV Cameras</option>
                    <option value="NVR_DVR">📼 DVR &amp; NVR Storage</option>
                    <option value="CCTV_KIT">📦 CCTV Combo Kits</option>
                    <option value="STORAGE_HDD">💾 Surveillance Hard Drives</option>
                    <option value="BIOMETRIC_ATTENDANCE">👆 Biometric Attendance</option>
                    <option value="ACCESS_CONTROL">🔒 Access Control &amp; Locks</option>
                    <option value="ACCESSORIES">⚡ Cables, PoE &amp; SMPS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-blue-400 mb-1">Sub-Category *</label>
                  <select
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    {(SUBCATEGORIES_BY_CATEGORY[formData.category] || []).map((sub) => (
                      <option key={sub.value} value={sub.value}>
                        {sub.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Brand, Model Number & HSN */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CP Plus, Hikvision"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Model Number</label>
                  <input
                    type="text"
                    placeholder="e.g. DS-2CE10DF0T-FS"
                    value={formData.modelNumber}
                    onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">HSN Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 852580"
                    value={formData.hsnCode}
                    onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Pricing: MRP, Selling Price, Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">MRP (₹ Crossed)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2499"
                    value={formData.mrp}
                    onChange={(e) => handlePriceChange("mrp", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-400 mb-1">Offer Price (₹ Selling) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1799"
                    value={formData.price}
                    onChange={(e) => handlePriceChange("price", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Discount %</label>
                  <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-emerald-400 flex items-center justify-between">
                    <span>{formData.discountPercent}% OFF</span>
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Dynamic Technical Specifications */}
              <div className="space-y-2.5 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Technical Specifications (Shown on Product Page)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-0.5">Resolution / Megapixel</label>
                    <input
                      type="text"
                      placeholder="e.g. 2MP (1920x1080) / 4MP 2K"
                      value={formData.specResolution}
                      onChange={(e) => setFormData({ ...formData, specResolution: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-0.5">Lens Type</label>
                    <input
                      type="text"
                      placeholder="e.g. 2.8mm / 3.6mm Fixed Lens"
                      value={formData.specLens}
                      onChange={(e) => setFormData({ ...formData, specLens: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-0.5">Night Vision</label>
                    <input
                      type="text"
                      placeholder="e.g. 20m Full-Color White LED / 30m IR"
                      value={formData.specNightVision}
                      onChange={(e) => setFormData({ ...formData, specNightVision: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-0.5">Audio &amp; Mic</label>
                    <input
                      type="text"
                      placeholder="e.g. Built-in Mic / Two-way Talk"
                      value={formData.specAudio}
                      onChange={(e) => setFormData({ ...formData, specAudio: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Image URL & Warranty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Warranty Term</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 Years Brand Warranty"
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Comprehensive description of product capabilities..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="rounded border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-purple-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isKit}
                    onChange={(e) => setFormData({ ...formData, isKit: e.target.checked })}
                    className="rounded border-slate-700 text-purple-600 focus:ring-0"
                  />
                  <span>Is Complete CCTV Combo Kit</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition hover:scale-105"
                >
                  {saving ? "Saving..." : modalMode === "ADD" ? "Create Product" : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
