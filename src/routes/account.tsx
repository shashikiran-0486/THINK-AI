import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/products";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [{ title: "Account — ThinkBold" }, { name: "description", content: "Your ThinkBold account." }],
  }),
  component: AccountPage,
});

type Order = {
  id: string;
  total_cents: number;
  status: string;
  created_at: string;
};

function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("id, total_cents, status, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as Order[]) ?? []));
  }, [user]);

  if (loading || !user) {
    return <div className="p-10 text-center text-sm">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-3 py-10 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl">HEY 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <button
          onClick={async () => {
            await signOut();
            navigate({ to: "/" });
          }}
          className="inline-flex items-center gap-1 border-2 border-ink bg-bone px-3 py-2 text-xs font-bold uppercase hover:bg-neon"
        >
          <LogOut className="h-3 w-3" /> Log out
        </button>
      </div>

      <h2 className="mt-10 text-2xl">ORDER HISTORY</h2>
      {orders.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          No orders yet. <Link to="/shop" className="underline">Start shopping →</Link>
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {orders.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 border-2 border-ink bg-card p-3 text-sm">
              <div>
                <span className="font-bold">#{o.id.slice(0, 8).toUpperCase()}</span>
                <span className="ml-3 rounded-full bg-neon px-2 py-0.5 text-[10px] font-bold uppercase">
                  {o.status}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(o.created_at).toLocaleDateString()}
              </div>
              <div className="font-bold">{formatPrice(o.total_cents)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
