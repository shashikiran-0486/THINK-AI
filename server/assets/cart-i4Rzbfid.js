import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BvjM3Bz9.js";
import { c as createLucideIcon, a as useCart, b as useAuth, L as Link, g as getProductImage, X, f as formatPrice, s as supabase, t as toast } from "./router-ccWGIwOv.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$2 = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$1);
const __iconNode = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
function CartPage() {
  const {
    items,
    setQty,
    remove,
    total,
    clear
  } = useCart();
  const {
    user
  } = useAuth();
  const [success, setSuccess] = reactExports.useState(null);
  const [processing, setProcessing] = reactExports.useState(false);
  const checkout = async () => {
    if (items.length === 0) return;
    setProcessing(true);
    try {
      if (user) {
        const {
          data: order,
          error
        } = await supabase.from("orders").insert({
          user_id: user.id,
          total_cents: total,
          status: "paid"
        }).select().single();
        if (error) throw error;
        const orderItems = items.map((i) => ({
          order_id: order.id,
          product_id: i.product.id,
          product_name: i.product.name,
          size: i.size,
          quantity: i.quantity,
          price_cents: i.product.price_cents
        }));
        await supabase.from("order_items").insert(orderItems);
        setSuccess(order.id.slice(0, 8).toUpperCase());
      } else {
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
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticker mb-4 text-base", children: "Order Confirmed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl", children: "YOU'RE SET. 🔥" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm text-muted-foreground", children: [
        "Order ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
          "#",
          success
        ] }),
        " is in. We'll email tracking soon."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "btn-chunk mt-6 bg-neon px-5 py-2 text-sm font-bold uppercase", children: "Keep Shopping" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-3 py-8 sm:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl sm:text-5xl", children: "YOUR BAG" }),
    items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your bag is empty." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "btn-chunk mt-4 inline-block bg-neon px-5 py-2 text-sm font-bold uppercase", children: "Browse Drops" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-6 lg:grid-cols-[1fr_320px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        items.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 border-2 border-ink bg-card p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: getProductImage(i.product.image_url), alt: i.product.name, className: "h-24 w-20 flex-shrink-0 border border-ink object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$id", params: {
                id: i.product.id
              }, className: "line-clamp-1 text-sm font-bold uppercase", children: i.product.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(i.product.id, i.size), "aria-label": "Remove", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Size: ",
              i.size
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border-2 border-ink", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty(i.product.id, i.size, i.quantity - 1), className: "px-2 py-1 hover:bg-neon", "aria-label": "Decrease", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3 w-3" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 text-sm font-bold", children: i.quantity }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty(i.product.id, i.size, i.quantity + 1), className: "px-2 py-1 hover:bg-neon", "aria-label": "Increase", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", children: formatPrice(i.product.price_cents * i.quantity) })
            ] })
          ] })
        ] }, `${i.product.id}-${i.size}`)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => clear(), className: "inline-flex items-center gap-1 text-xs font-bold uppercase text-muted-foreground hover:text-destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }),
          " Clear bag"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "h-fit border-2 border-ink bg-bone p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl", children: "SUMMARY" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-1 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(total) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Shipping" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: total >= 7500 ? "FREE" : "$8" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex justify-between border-t-2 border-ink pt-3 text-base font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(total + (total >= 7500 ? 0 : 800)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: checkout, disabled: processing, className: "btn-chunk mt-4 w-full bg-neon py-3 text-sm font-bold uppercase text-ink disabled:opacity-50", children: processing ? "Processing…" : "Checkout (Demo)" }),
        !user && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-center text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "underline", children: "Log in" }),
          " to save your order history."
        ] })
      ] })
    ] })
  ] });
}
export {
  CartPage as component
};
