'use client';

import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';

interface ToastMessage {
  id: number;
  productName: string;
  image?: string;
}

let toastId = 0;
// Global listener array – components subscribe; addToCart fires
const listeners: Array<(msg: ToastMessage) => void> = [];

/** Call this from anywhere to show the "Added to cart" toast */
export function showCartToast(productName: string, image?: string) {
  const msg: ToastMessage = { id: ++toastId, productName, image };
  listeners.forEach((fn) => fn(msg));
}

/** Drop this component once in a layout/page – it renders the toast UI */
export default function CartToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((msg: ToastMessage) => {
    setToasts((prev) => [...prev.slice(-2), msg]); // keep max 3
    // Auto-dismiss after 2.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== msg.id));
    }, 2500);
  }, []);

  useEffect(() => {
    listeners.push(addToast);
    return () => {
      const idx = listeners.indexOf(addToast);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, [addToast]);

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-white rounded-xl shadow-2xl border border-gray-100 p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 min-w-[260px] max-w-[340px] animate-slide-up"
        >
          {toast.image ? (
            <img
              src={toast.image}
              alt=""
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-green-600">Added to cart</span>
            </div>
            <p className="text-xs sm:text-sm text-[#1A1A1A] font-medium truncate">
              {toast.productName}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <button
              onClick={() => dismiss(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <Link
              href="/cart"
              className="text-[10px] sm:text-xs font-semibold text-[#C5A059] hover:text-[#1A1A1A] transition-colors whitespace-nowrap"
            >
              View Cart
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

