"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { ProductItem } from "@/types";

export interface CartItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  mrp?: number | null;
  imageUrl?: string | null;
  brand: string;
  modelNumber?: string | null;
  category: string;
  quantity: number;
  withInstallation?: boolean;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ProductItem | any, qty?: number, withInstallation?: boolean) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  toggleInstallation: (id: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalCount: number;
  subtotal: number;
  totalMrp: number;
  totalSavings: number;
  installationTotal: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const INSTALLATION_FEE_PER_UNIT = 350; // ₹350 per camera/unit in Patna & Bihar

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bt_security_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from storage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to LocalStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("bt_security_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to storage:", e);
    }
  }, [cart, isLoaded]);

  const addToCart = (product: ProductItem | any, qty = 1, withInstallation = false) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === product.id);
      const productPrice = product.price ? Number(product.price) : 0;
      const productMrp = product.mrp ? Number(product.mrp) : productPrice;

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        if (withInstallation) updated[existingIdx].withInstallation = true;
        return updated;
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: productPrice,
          mrp: productMrp,
          imageUrl: product.imageUrl,
          brand: product.brand,
          modelNumber: product.modelNumber,
          category: product.category,
          quantity: qty,
          withInstallation,
        },
      ];
    });

    setIsOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const toggleInstallation = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, withInstallation: !item.withInstallation } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Calculations
  const totalCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);

  const totalMrp = useMemo(() => {
    return cart.reduce((acc, item) => {
      const m = item.mrp && item.mrp > item.price ? item.mrp : item.price;
      return acc + m * item.quantity;
    }, 0);
  }, [cart]);

  const totalSavings = useMemo(() => Math.max(0, totalMrp - subtotal), [totalMrp, subtotal]);

  const installationTotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + (item.withInstallation ? INSTALLATION_FEE_PER_UNIT * item.quantity : 0);
    }, 0);
  }, [cart]);

  const grandTotal = useMemo(() => subtotal + installationTotal, [subtotal, installationTotal]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleInstallation,
        clearCart,
        isOpen,
        openCart,
        closeCart,
        totalCount,
        subtotal,
        totalMrp,
        totalSavings,
        installationTotal,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
