"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Camera,
  ShoppingBag,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Wrench,
  Tag,
  ArrowRight,
  ChevronRight,
  Clock,
  Sparkles,
  MapPin,
  Check,
  HelpCircle,
  Package
} from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductDetailClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [withInstallation, setWithInstallation] = useState(
    product.category === "CCTV_CAMERA" || product.category === "CCTV_KIT"
  );
  const [activeImage, setActiveImage] = useState<string>(product.imageUrl || "");
  const [added, setAdded] = useState(false);

  // Pincode Checker State
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  // Parse specs & features
  let featuresList: string[] = [];
  try {
    if (product.features) featuresList = JSON.parse(product.features);
  } catch {
    featuresList = product.features ? product.features.split(",") : [];
  }

  let specsObj: Record<string, string> = {};
  try {
    if (product.specs) specsObj = JSON.parse(product.specs);
  } catch {}

  // Parse gallery images
  let galleryList: string[] = [product.imageUrl].filter(Boolean);
  try {
    if (product.galleryImages) {
      const parsed = JSON.parse(product.galleryImages);
      if (Array.isArray(parsed) && parsed.length > 0) {
        galleryList = parsed;
      }
    }
  } catch {}

  const hasDiscount = product.mrp && Number(product.mrp) > Number(product.price);
  const savings = hasDiscount ? Number(product.mrp) - Number(product.price) : 0;
  const installationFee = withInstallation ? 350 * quantity : 0;
  const grandTotal = Number(product.price || 0) * quantity + installationFee;

  const handleAddToCart = () => {
    addToCart(product, quantity, withInstallation);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim()) return;
    if (pincode.startsWith("80") || pincode.startsWith("81") || pincode.startsWith("82")) {
      setPincodeStatus("FAST_BIHAR");
    } else {
      setPincodeStatus("PAN_INDIA");
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Yash Enterprises,\nI want to buy / enquire about:\n• Product: ${product.name}\n• Model: ${product.modelNumber || "N/A"}\n• Brand: ${product.brand}\n• Quantity: ${quantity}\n• Installation in Bihar: ${withInstallation ? "YES (+₹" + installationFee + ")" : "NO"}\n• Total Amount: ₹${grandTotal.toLocaleString("en-IN")}\nLink: https://www.bestcctvservice.com/products/${product.slug}`
  );

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link href="/products" className="hover:text-blue-600 transition">
            CCTV &amp; Biometrics Store
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-blue-600 transition"
          >
            {product.category.replace("_", " ")}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Image Gallery Stage (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Image Stage */}
            <div className="h-96 sm:h-[450px] bg-slate-100/70 rounded-3xl border border-slate-200/80 p-8 flex items-center justify-center relative overflow-hidden group">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <Camera className="w-24 h-24 text-slate-300" />
              )}

              {/* Discount Tag */}
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{product.discountPercent || Math.round((savings / Number(product.mrp)) * 100)}% OFF</span>
                </div>
              )}

              {/* Stock Status Badge */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 text-xs font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>In Stock • Ready to Dispatch</span>
              </div>
            </div>

            {/* Thumbnail Gallery (if multiple) */}
            {galleryList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryList.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-20 h-20 rounded-2xl border-2 p-2 bg-slate-50 shrink-0 transition ${
                      activeImage === imgUrl ? "border-blue-600 shadow-md" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${i}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Points Under Image */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-[11px] font-bold text-slate-800">
                  {product.warranty || "2 Years Official Warranty"}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-bold text-slate-800">
                  Same-Day Dispatch in Bihar
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details, Commercial Pricing & Actions (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Title & Brand Header */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-slate-900 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.brand}
                </span>
                {product.modelNumber && (
                  <span className="bg-blue-50 text-blue-700 text-xs font-mono font-bold px-3 py-1 rounded-full border border-blue-200">
                    Model: {product.modelNumber}
                  </span>
                )}
                {product.hsnCode && (
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">
                    HSN: {product.hsnCode}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                {product.description}
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50 rounded-3xl p-5 sm:p-6 border border-slate-200/90 space-y-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  ₹{Number(product.price || 0).toLocaleString("en-IN")}
                </span>
                {hasDiscount && (
                  <span className="text-base text-slate-400 line-through">
                    ₹{Number(product.mrp).toLocaleString("en-IN")}
                  </span>
                )}
                {savings > 0 && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-lg">
                    You Save ₹{savings.toLocaleString("en-IN")} (Incl. GST)
                  </span>
                )}
              </div>

              {/* Tax & GST Credit Callout */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3 text-xs text-slate-700 font-semibold">
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs shrink-0">
                  18%
                </span>
                <div>
                  <span className="font-bold text-slate-900 block">GST Tax Invoice with ITC Eligibility</span>
                  <span className="text-[11px] text-slate-500">
                    Input Tax Credit claimable on your company / shop GST registration.
                  </span>
                </div>
              </div>

              {/* Doorstep Installation Add-on Option */}
              {(product.category === "CCTV_CAMERA" || product.category === "CCTV_KIT") && (
                <div className="bg-blue-50/80 rounded-2xl p-4 border border-blue-200/80 space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={withInstallation}
                      onChange={(e) => setWithInstallation(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-blue-950">
                          Add Professional Doorstep Installation in Patna / Bihar
                        </span>
                        <span className="text-xs font-black text-blue-700">
                          +₹{350 * quantity} (₹350/unit)
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-800/80 mt-0.5">
                        Includes camera mounting, clean wiring, DVR integration, smartphone live view configuration &amp; testing.
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Quantity Selector & Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700">Quantity:</span>
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3.5 py-2 hover:bg-slate-100 text-slate-700 font-bold transition"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-xs font-black text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3.5 py-2 hover:bg-slate-100 text-slate-700 font-bold transition"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-xs font-bold text-slate-500">
                    Total: <strong className="text-slate-900 font-black">₹{grandTotal.toLocaleString("en-IN")}</strong>
                  </span>
                </div>

                {/* Main Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`py-3.5 px-6 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.99] ${
                      added
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20"
                    }`}
                  >
                    {added ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-blue-400" />
                        <span>Add to Cart (₹{grandTotal.toLocaleString("en-IN")})</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://wa.me/919308907319?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition active:scale-[0.99]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Instant WhatsApp Order</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Pincode Delivery Estimator */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Check Doorstep Delivery in Bihar:
              </span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode (e.g. 801105)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500 flex-1 max-w-xs font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                >
                  Check
                </button>
              </form>

              {pincodeStatus === "FAST_BIHAR" && (
                <p className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Same-Day or 24-Hour Engineer Doorstep Delivery available in Patna &amp; Bihar!
                </p>
              )}
              {pincodeStatus === "PAN_INDIA" && (
                <p className="text-xs text-blue-700 font-bold flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  Courier Shipping Available (2-4 business days).
                </p>
              )}
            </div>

            {/* Highlights Bullet List */}
            {featuresList.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Product Highlights
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {featuresList.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>

        {/* Technical Specifications Table (cctvcart style) */}
        {Object.keys(specsObj).length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-blue-600">
                Detailed Hardware Specifications
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Technical Specifications Sheet
              </h2>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm">
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(specsObj).map(([key, val], idx) => (
                    <tr
                      key={key}
                      className={idx % 2 === 0 ? "bg-slate-50/70" : "bg-white"}
                    >
                      <td className="px-5 py-3.5 font-bold text-slate-700 w-1/3 sm:w-1/4 border-r border-slate-100">
                        {key}
                      </td>
                      <td className="px-5 py-3.5 text-slate-800 font-medium">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Package Contents / In The Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-black text-slate-900">What's In The Box:</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              1× {product.name}
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              1× Mounting Screws &amp; Wall Plugs
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              1× Drill Hole Template &amp; Seal
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              1× User Manual &amp; Warranty Certificate
            </div>
          </div>
        </div>

        {/* Related Products from same category */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-blue-600">
                  Similar Hardware
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Frequently Bought Together
                </h2>
              </div>
              <Link
                href={`/products?category=${product.category}`}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>View More in {product.category.replace("_", " ")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rel) => (
                <div
                  key={rel.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between hover:shadow-lg transition group"
                >
                  <Link href={`/products/${rel.slug}`} className="block">
                    <div className="h-40 bg-slate-100 rounded-xl p-3 flex items-center justify-center mb-3">
                      {rel.imageUrl ? (
                        <img
                          src={rel.imageUrl}
                          alt={rel.name}
                          className="h-full w-full object-contain group-hover:scale-105 transition"
                        />
                      ) : (
                        <Camera className="w-12 h-12 text-slate-300" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase">
                      {rel.brand}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs line-clamp-2 mt-1">
                      {rel.name}
                    </h4>
                  </Link>

                  <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                    <span className="text-sm font-black text-slate-900">
                      ₹{Number(rel.price || 0).toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() => addToCart(rel, 1)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
