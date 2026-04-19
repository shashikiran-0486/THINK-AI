import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { getProductImage, formatPrice } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — ThinkBold" },
      { name: "description", content: "Review your ThinkBold bag." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, total, clear } = useCart();
  const { user } = useAuth();
  const [success, setSuccess] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const checkout = async () => {
    if (items.length === 0) return;
    setProcessing(true);
    try {
      if (user) {
        const { data: order, error } = await supabase
          .from("orders")
          .insert({ user_id: user.id, total_cents: total, status: "paid" })
          .select()
          .single();
        if (error) throw error;
        const orderItems = items.map((i) => ({
          order_id: order.id,
          product_id: i.product.id,
          product_name: i.product.name,
          size: i.size,
          quantity: i.quantity,
          price_cents: i.product.price_cents,
        }));
        await supabase.from("order_items").insert(orderItems);
        setSuccess(order.id.slice(0, 8).toUpperCase());
      } else {
        // Guest "checkout"
        setSuccess(Math.random().toString(36).slice(2, 10).toUpperCase());
      }
      await clear();
    } catch (e) {
      console.error(e);
      toast.error("Checkout failed. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <div className="sticker mb-4 text-base">Order Confirmed</div>
        <h1 className="text-4xl">YOU'RE SET. 🔥</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Order <span className="font-bold">#{success}</span> is in. We'll email tracking soon.
        </p>
        <Link to="/shop" className="btn-chunk mt-6 bg-neon px-5 py-2 text-sm font-bold uppercase">
          Keep Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-3 py-8 sm:px-6">
      <h1 className="text-4xl sm:text-5xl">YOUR BAG</h1>
      {items.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">Your bag is empty.</p>
          <Link to="/shop" className="btn-chunk mt-4 inline-block bg-neon px-5 py-2 text-sm font-bold uppercase">
            Browse Drops
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            {items.map((i) => (
              <div
                key={`${i.product.id}-${i.size}`}
                className="flex gap-3 border-2 border-ink bg-card p-3"
              >
                <img
                  src={getProductImage(i.product.image_url)}
                  alt={i.product.name}
                  className="h-24 w-20 flex-shrink-0 border border-ink object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link to="/product/$id" params={{ id: i.product.id }} className="line-clamp-1 text-sm font-bold uppercase">
                      {i.product.name}
                    </Link>
                    <button onClick={() => remove(i.product.id, i.size)} aria-label="Remove">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Size: {i.size}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center border-2 border-ink">
                      <button
                        onClick={() => setQty(i.product.id, i.size, i.quantity - 1)}
                        className="px-2 py-1 hover:bg-neon"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-sm font-bold">{i.quantity}</span>
                      <button
                        onClick={() => setQty(i.product.id, i.size, i.quantity + 1)}
                        className="px-2 py-1 hover:bg-neon"
                        aria-label="Increase"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold">
                      {formatPrice(i.product.price_cents * i.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => clear()}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" /> Clear bag
            </button>
          </div>

          <aside className="h-fit border-2 border-ink bg-bone p-4">
            <h2 className="text-xl">SUMMARY</h2>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{total >= 7500 ? "FREE" : "$8"}</span>
              </div>
            </div>
            <div className="mt-3 flex justify-between border-t-2 border-ink pt-3 text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(total + (total >= 7500 ? 0 : 800))}</span>
            </div>
            <button
              onClick={checkout}
              disabled={processing}
              className="btn-chunk mt-4 w-full bg-neon py-3 text-sm font-bold uppercase text-ink disabled:opacity-50"
            >
              {processing ? "Processing…" : "Checkout (Demo)"}
            </button>
            {!user && (
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                <Link to="/login" className="underline">Log in</Link> to save your order history.
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
