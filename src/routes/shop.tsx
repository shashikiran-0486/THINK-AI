import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All — ThinkBold" },
      { name: "description", content: "Browse the full ThinkBold streetwear catalog." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<"all" | "men" | "women" | "accessories">("all");
  const [sort, setSort] = useState<"new" | "low" | "high">("new");

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .then(({ data }) => setProducts((data as unknown as Product[]) ?? []));
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (sort === "low") list = [...list].sort((a, b) => a.price_cents - b.price_cents);
    if (sort === "high") list = [...list].sort((a, b) => b.price_cents - a.price_cents);
    return list;
  }, [products, category, sort]);

  return (
    <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6">
      <h1 className="text-4xl sm:text-5xl">SHOP ALL</h1>
      <p className="mt-1 text-sm text-muted-foreground">{filtered.length} pieces in rotation.</p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {(["all", "men", "women", "accessories"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border-2 border-ink px-3 py-1 text-xs font-bold uppercase transition ${
              category === c ? "bg-ink text-bone" : "bg-bone hover:bg-neon"
            }`}
          >
            {c}
          </button>
        ))}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="ml-auto rounded-md border-2 border-ink bg-bone px-2 py-1 text-xs font-bold uppercase"
        >
          <option value="new">Newest</option>
          <option value="low">Price ↑</option>
          <option value="high">Price ↓</option>
        </select>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
