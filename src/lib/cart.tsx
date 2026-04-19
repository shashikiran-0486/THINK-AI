import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "./products";

export type CartItem = {
  product: Product;
  size: string;
  quantity: number;
};

type CartCtx = {
  items: CartItem[];
  add: (product: Product, size: string, qty?: number) => Promise<void>;
  remove: (productId: string, size: string) => Promise<void>;
  setQty: (productId: string, size: string, qty: number) => Promise<void>;
  clear: () => Promise<void>;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "thinkbold_cart_v1";

type StoredItem = { productId: string; size: string; quantity: number };

function loadLocal(): StoredItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredItem[]) : [];
  } catch {
    return [];
  }
}

function saveLocal(items: StoredItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Load product catalog once
  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .then(({ data }) => {
        if (data) setProducts(data as unknown as Product[]);
      });
  }, []);

  // Hydrate cart from localStorage when products are loaded
  useEffect(() => {
    if (products.length === 0) return;
    const stored = loadLocal();
    const hydrated: CartItem[] = stored
      .map((s) => {
        const p = products.find((pp) => pp.id === s.productId);
        return p ? { product: p, size: s.size, quantity: s.quantity } : null;
      })
      .filter(Boolean) as CartItem[];
    setItems(hydrated);
  }, [products]);

  const persist = (next: CartItem[]) => {
    saveLocal(next.map((i) => ({ productId: i.product.id, size: i.size, quantity: i.quantity })));
  };

  const add: CartCtx["add"] = async (product, size, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id && i.size === size);
      let next: CartItem[];
      if (idx >= 0) {
        next = prev.map((i, k) => (k === idx ? { ...i, quantity: i.quantity + qty } : i));
      } else {
        next = [...prev, { product, size, quantity: qty }];
      }
      persist(next);
      return next;
    });
  };

  const remove: CartCtx["remove"] = async (productId, size) => {
    setItems((prev) => {
      const next = prev.filter((i) => !(i.product.id === productId && i.size === size));
      persist(next);
      return next;
    });
  };

  const setQty: CartCtx["setQty"] = async (productId, size, qty) => {
    setItems((prev) => {
      const next =
        qty <= 0
          ? prev.filter((i) => !(i.product.id === productId && i.size === size))
          : prev.map((i) =>
              i.product.id === productId && i.size === size ? { ...i, quantity: qty } : i,
            );
      persist(next);
      return next;
    });
  };

  const clear: CartCtx["clear"] = async () => {
    setItems([]);
    persist([]);
  };

  const total = items.reduce((sum, i) => sum + i.product.price_cents * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, setQty, clear, total, count }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside <CartProvider>");
  return v;
}
