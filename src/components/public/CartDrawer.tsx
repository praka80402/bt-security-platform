"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  ArrowRight,
  Truck
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    toggleInstallation,
    clearCart,
    totalCount,
    subtotal,
    totalMrp,
    totalSavings,
    installationTotal,
    grandTotal,
  } = useCart();

  if (!isOpen) return null;

  const handleWhatsAppOrder = () => {
    let msg = `*🛒 NEW ORDER INQUIRY - YASH ENTERPRISES*\n`;
    msg += `Website: bestcctvservice.com\n`;
    msg += `------------------------------------\n`;

    cart.forEach((item, idx) => {
      msg += `*${idx + 1}. ${item.name}*\n`;
      msg += `   • Brand/Model: ${item.brand} ${item.modelNumber ? `(${item.modelNumber})` : ""}\n`;
      msg += `   • Qty: ${item.quantity} × ₹${item.price.toLocaleString("en-IN")}\n`;
      if (item.withInstallation) {
        msg += `   • + Doorstep Installation (+₹${(350 * item.quantity).toLocaleString("en-IN")})\n`;
      }
      msg += `   • Item Total: ₹${((item.price + (item.withInstallation ? 350 : 0)) * item.quantity).toLocaleString("en-IN")}\n\n`;
    });

    msg += `------------------------------------\n`;
    msg += `*Hardware Subtotal:* ₹${subtotal.toLocaleString("en-IN")}\n`;
    if (installationTotal > 0) {
      msg += `*Installation Charge:* ₹${installationTotal.toLocaleString("en-IN")}\n`;
    }
    msg += `*TOTAL AMOUNT:* ₹${grandTotal.toLocaleString("en-IN")}\n`;
    if (totalSavings > 0) {
      msg += `*Total Discount Saved:* ₹${totalSavings.toLocaleString("en-IN")}\n`;
    }
    msg += `------------------------------------\n`;
    msg += `Please confirm product availability, delivery timeline & payment details for Patna/Bihar.`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/919308907319?text=${encoded}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-blue-400" />
            <h2 className="font-black text-base">Your Cart</h2>
            <span className="bg-blue-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full">
              {totalCount} {totalCount === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery / Trust Ribbon */}
        <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900 font-semibold">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Fast Doorstep Delivery in Patna &amp; Bihar</span>
          </span>
          <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
            GST INVOICE
          </span>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Explore our authorized CP Plus, Hikvision &amp; eSSL surveillance equipment.
                </p>
              </div>
              <Link
                href="/products"
                onClick={closeCart}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition"
              >
                <span>Browse CCTV &amp; Biometrics</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            cart.map((item) => {
              const itemTotal = item.price * item.quantity;
              const hasDiscount = item.mrp && item.mrp > item.price;
              const isCameraOrKit =
                item.category === "CCTV_CAMERA" || item.category === "CCTV_KIT";

              return (
                <div
                  key={item.id}
                  className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-3 relative group"
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                          {item.brand} {item.modelNumber ? `• ${item.modelNumber}` : ""}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="font-bold text-slate-900 text-xs line-clamp-2 leading-tight">
                        {item.name}
                      </h4>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-sm font-black text-slate-900">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                        {hasDiscount && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{item.mrp?.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-slate-100 text-slate-600 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-slate-100 text-slate-600 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-xs font-black text-slate-900">
                      ₹{itemTotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Installation Option for Cameras/Kits */}
                  {isCameraOrKit && (
                    <label className="flex items-start gap-2 pt-1.5 border-t border-slate-200/60 cursor-pointer text-[11px] text-slate-700 select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(item.withInstallation)}
                        onChange={() => toggleInstallation(item.id)}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-0"
                      />
                      <span>
                        <span className="font-bold text-blue-600">Add Installation in Bihar</span>{" "}
                        (+₹{(350 * item.quantity).toLocaleString("en-IN")})
                      </span>
                    </label>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            {/* Savings Callout */}
            {totalSavings > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs font-bold text-emerald-800">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Your Total Savings:
                </span>
                <span>₹{totalSavings.toLocaleString("en-IN")}</span>
              </div>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Hardware Subtotal:</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {installationTotal > 0 && (
                <div className="flex justify-between text-blue-700 font-semibold">
                  <span>Doorstep Installation:</span>
                  <span>+₹{installationTotal.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping &amp; Delivery:</span>
                <span className="font-bold text-emerald-600 uppercase text-[10px]">FREE (Patna/Bihar)</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                <span>Total Amount:</span>
                <span className="text-lg text-blue-600">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-[10px] text-slate-400">
                *GST invoice provided on dispatch with 18% Input Tax Credit (ITC) eligibility.
              </p>
            </div>

            {/* WhatsApp Checkout Button */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition active:scale-[0.99]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Order via WhatsApp (Instant Bill)</span>
              </button>

              <button
                onClick={clearCart}
                className="w-full py-1 text-center text-[10px] text-slate-400 hover:text-rose-600 transition"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
