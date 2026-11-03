"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Camera,
  ShoppingBag,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  Tag,
  ArrowRight
} from "lucide-react";
import { ProductItem } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: ProductItem | any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // Parse features / specs
  let featuresList: string[] = [];
  try {
    if (product.features) {
      featuresList = JSON.parse(product.features);
    }
  } catch {
    featuresList = product.features ? product.features.split(",") : [];
  }

  let parsedSpecs: Record<string, string> = {};
  try {
    if (product.specs) {
      parsedSpecs = JSON.parse(product.specs);
    }
  } catch {}

  const hasDiscount = product.mrp && Number(product.mrp) > Number(product.price);
  const savings = hasDiscount ? Number(product.mrp) - Number(product.price) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Yash Enterprises,\nI want to enquire / order:\n• Product: ${product.name}\n• Model: ${product.modelNumber || "N/A"}\n• Brand: ${product.brand}\n• Offer Price: ₹${Number(product.price || 0).toLocaleString("en-IN")}\nWebsite: https://www.bestcctvservice.com/products/${product.slug}`
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-200 flex flex-col justify-between group">
      {/* Upper Area: Clickable Link to PDP */}
      <Link href={`/products/${product.slug}`} className="block flex-1">
        {/* Product Image Stage */}
        <div className="h-60 bg-slate-100/70 relative flex items-center justify-center p-6 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <Camera className="w-16 h-16 text-slate-300" />
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>{product.discountPercent || Math.round((savings / Number(product.mrp)) * 100)}% OFF</span>
            </div>
          )}

          {/* Brand & Kit Badge */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
            <span className="bg-slate-900/85 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {product.brand}
            </span>
            {product.isKit && (
              <span className="bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                FULL KIT
              </span>
            )}
          </div>

          {/* Model Number Pill at Bottom Right */}
          {product.modelNumber && (
            <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-slate-700 text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-lg shadow-sm border border-slate-200/60">
              {product.modelNumber}
            </span>
          )}

          {/* Stock Indicator at Bottom Left */}
          <span className="absolute bottom-3 left-3 text-[10px] font-bold text-emerald-700 bg-emerald-50/90 border border-emerald-200/80 backdrop-blur-sm px-2 py-0.5 rounded-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>In Stock</span>
          </span>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-blue-600 uppercase tracking-wider">
            <span>{product.category.replace("_", " ")}</span>
            {product.subCategory && (
              <span className="text-[10px] text-slate-400 font-semibold lowercase">
                • {product.subCategory.replace("_", " ")}
              </span>
            )}
          </div>

          <h3 className="font-bold text-slate-900 text-base line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Key Tech Specs Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {parsedSpecs["Resolution"] && (
              <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                {parsedSpecs["Resolution"]}
              </span>
            )}
            {parsedSpecs["Night Vision Range"] && (
              <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                {parsedSpecs["Night Vision Range"]}
              </span>
            )}
            {parsedSpecs["Audio"] && (
              <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                {parsedSpecs["Audio"]}
              </span>
            )}
            {product.warranty && (
              <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {product.warranty}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Footer Area: Pricing & Dual CTA */}
      <div className="p-5 pt-0 border-t border-slate-100/80 mt-2">
        {/* Pricing Box */}
        <div className="flex items-baseline justify-between pt-3 pb-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {product.price ? `₹${Number(product.price).toLocaleString("en-IN")}` : "Get Quote"}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{Number(product.mrp).toLocaleString("en-IN")}
                </span>
              )}
            </div>
            {savings > 0 && (
              <span className="text-[10px] text-emerald-600 font-extrabold block">
                Save ₹{savings.toLocaleString("en-IN")} + 18% GST Input Credit
              </span>
            )}
          </div>
        </div>

        {/* Dual Actions: Add to Cart + WhatsApp Quote */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-slate-900 hover:bg-slate-800 text-white active:scale-95"
            }`}
          >
            {added ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <a
            href={`https://wa.me/919308907319?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
