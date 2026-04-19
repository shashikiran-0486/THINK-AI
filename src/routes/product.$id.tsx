import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getProductImage, formatPrice, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Product — ThinkBold" },
      { name: "description", content: "Shop this piece on ThinkBold." },
    ],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <h1 className="text-3xl">Product not found</h1>
      <Link to="/shop" className="mt-4 inline-block underline">Back to shop</Link>
    </div>
  ),
});

function ProductPage() {
  const { id } = useParams({ from: "/product/$id" });
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [size, setSize] = useState<string | null>(null);
  const { add } = useCart();

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        const p = data as unknown as Product | null;
        setProduct(p);
        setSize(p?.sizes?.[0] ?? null);
        if (p) {
          supabase
            .from("products")
            .select("*")
            .eq("category", p.category)
            .neq("id", p.id)
            .limit(4)
            .then(({ data: rel }) => setRelated((rel as unknown as Product[]) ?? []));
        }
      });
  }, [id]);

  if (!product) {
    return <div className="p-10 text-center text-sm text-muted-foreground">Loading…</div>;
  }

  const handleAdd = async () => {
    if (!size) return;
    await add(product, size, 1);
    toast.success(`Added ${product.name} (${size}) to bag`);
  };

  return (
    <div className="mx-auto max-w-6xl px-3 py-8 sm:px-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative overflow-hidden border-2 border-ink bg-card">
          <img
            src={getProductImage(product.image_url)}
            alt={product.name}
            className="h-full w-full object-cover"
            width={768}
            height={896}
          />
          {product.badge && <span className="sticker absolute left-3 top-3">{product.badge}</span>}
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-magenta">{product.category}</p>
          <h1 className="mt-1 text-3xl sm:text-4xl">{product.name}</h1>
          <p className="mt-2 text-2xl font-bold">{formatPrice(product.price_cents)}</p>
          <p className="mt-4 text-sm text-muted-foreground">{product.description}</p>

          <div className="mt-6">
            <p className="mb-2 text-xs font-bold uppercase">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-12 border-2 border-ink px-3 py-2 text-sm font-bold uppercase transition ${
                    size === s ? "bg-ink text-bone" : "bg-bone hover:bg-neon"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!size}
            className="btn-chunk mt-6 w-full bg-neon py-3 text-sm font-bold uppercase text-ink disabled:opacity-50"
          >
            Add to Bag
          </button>

          <div className="mt-6 space-y-1 text-xs text-muted-foreground">
            <p>★ Free shipping over $75</p>
            <p>★ 30-day returns, no questions</p>
            <p>★ Runs oversized — size down for regular fit</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-4 text-2xl">YOU MIGHT ALSO DIG</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
