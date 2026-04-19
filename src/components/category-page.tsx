import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "./product-card";
import type { Product } from "@/lib/products";

export function CategoryPage({
  category,
  title,
  tagline,
}: {
  category: "men" | "women" | "accessories";
  title: string;
  tagline: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .then(({ data }) => setProducts((data as unknown as Product[]) ?? []));
  }, [category]);

  return (
    <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6">
      <div className="border-2 border-ink bg-ink p-6 text-bone sm:p-10">
        <h1 className="text-5xl sm:text-7xl">
          <span className="text-neon">{title.slice(0, 1)}</span>
          {title.slice(1)}
        </h1>
        <p className="mt-2 max-w-lg text-sm text-bone/70 sm:text-base">{tagline}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted-foreground">Loading drops…</p>
      )}
    </div>
  );
}
