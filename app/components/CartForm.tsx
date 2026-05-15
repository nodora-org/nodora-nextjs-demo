"use client";

import { useEffect, useState } from "react";

const PRODUCTS = [
  { id: 1, name: "Wireless Headphones", price: 49.99 },
  { id: 2, name: "Mechanical Keyboard", price: 79.99 },
  { id: 3, name: "Gaming Mouse", price: 34.99 },
];

const COUNTRIES = [
  { code: "us", label: "United States" },
  { code: "ca", label: "Canada" },
  { code: "gb", label: "United Kingdom" },
  { code: "de", label: "Germany" },
  { code: "au", label: "Australia" },
];

type Quantities = Record<number, number>;

export default function CartForm() {
  const [quantities, setQuantities] = useState<Quantities>({ 1: 1 });
  const [country, setCountry] = useState("us");
  const [freeShipping, setFreeShipping] = useState<boolean | null>(null);
  const [threshold, setThreshold] = useState<number | null>(null);
  const [eligibleCountries, setEligibleCountries] = useState<string[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<
    "free" | "standard" | "express"
  >("standard");
  const [loading, setLoading] = useState(false);

  const total = Object.entries(quantities).reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find((p) => p.id === Number(id));
    return sum + (product?.price ?? 0) * qty;
  }, 0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ total, country }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setFreeShipping(data.eligible);
          setThreshold(data.threshold ?? null);
          setEligibleCountries(data.eligible_countries ?? []);
          if (data.eligible) {
            setSelectedShipping("free");
          } else if (selectedShipping === "free") {
            setSelectedShipping("standard");
          }
        }
      })
      .catch(() => {
        if (!cancelled) setFreeShipping(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [total, country]);

  function setQty(id: number, qty: number) {
    setQuantities((prev) => {
      if (qty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: qty };
    });
  }

  const cartItems = PRODUCTS.filter((p) => (quantities[p.id] ?? 0) > 0);
  const shippingCost =
    selectedShipping === "free"
      ? 0
      : selectedShipping === "standard"
      ? 5.99
      : 14.99;

  const orderTotal = total + shippingCost;

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold tracking-tight">Your Cart</h1>

      <div className="flex flex-col gap-3">
        {PRODUCTS.map((product) => {
          const qty = quantities[product.id] ?? 0;
          return (
            <div
              key={product.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-3 bg-white dark:bg-zinc-900"
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm">{product.name}</span>
                <span className="text-xs text-zinc-500">
                  ${product.price.toFixed(2)} each
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty(product.id, qty - 1)}
                    className="w-7 h-7 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-sm font-medium">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(product.id, qty + 1)}
                    className="w-7 h-7 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    +
                  </button>
                </div>
                {qty > 0 && (
                  <span className="text-sm font-medium w-16 text-right">
                    ${(product.price * qty).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" htmlFor="country">
          Ship to
        </label>
        <select
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Shipping</span>
          {loading && (
            <span className="text-xs text-zinc-400 animate-pulse">
              Checking eligibility…
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {freeShipping && (
            <label className="flex items-center justify-between gap-3 rounded-xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping"
                  value="free"
                  checked={selectedShipping === "free"}
                  onChange={() => setSelectedShipping("free")}
                  className="accent-emerald-500"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    Free Shipping
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-500">
                    5–7 business days
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                $0.00
              </span>
            </label>
          )}

          <label className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 cursor-pointer hover:border-zinc-400 transition-colors">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shipping"
                value="standard"
                checked={selectedShipping === "standard"}
                onChange={() => setSelectedShipping("standard")}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Standard Shipping</span>
                <span className="text-xs text-zinc-500">5–7 business days</span>
              </div>
            </div>
            <span className="text-sm font-medium">$5.99</span>
          </label>

          <label className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 cursor-pointer hover:border-zinc-400 transition-colors">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shipping"
                value="express"
                checked={selectedShipping === "express"}
                onChange={() => setSelectedShipping("express")}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Express Shipping</span>
                <span className="text-xs text-zinc-500">1–2 business days</span>
              </div>
            </div>
            <span className="text-sm font-medium">$14.99</span>
          </label>
        </div>

        {!loading &&
          !freeShipping &&
          threshold &&
          threshold > total &&
          eligibleCountries.includes(country) && (
            <p className="text-xs text-zinc-500 mt-1">
              Add ${(threshold - total).toFixed(2)} more to unlock free
              shipping.
            </p>
          )}
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-4 flex flex-col gap-2">
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
          <span>Shipping</span>
          <span>
            {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between font-semibold text-base pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <span>Total</span>
          <span>${orderTotal.toFixed(2)}</span>
        </div>
      </div>

      <button
        disabled={cartItems.length === 0}
        className="h-12 rounded-full bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 font-medium text-sm transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Place Order
      </button>
    </div>
  );
}
