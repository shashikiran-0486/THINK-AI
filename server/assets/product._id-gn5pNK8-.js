import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BvjM3Bz9.js";
import { d as useParams, a as useCart, s as supabase, g as getProductImage, f as formatPrice, t as toast } from "./router-ccWGIwOv.js";
import { P as ProductCard } from "./product-card-BVrjvdah.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function ProductPage() {
  const {
    id
  } = useParams({
    from: "/product/$id"
  });
  const [product, setProduct] = reactExports.useState(null);
  const [related, setRelated] = reactExports.useState([]);
  const [size, setSize] = reactExports.useState(null);
  const {
    add
  } = useCart();
  reactExports.useEffect(() => {
    supabase.from("products").select("*").eq("id", id).maybeSingle().then(({
      data
    }) => {
      const p = data;
      setProduct(p);
      setSize(p?.sizes?.[0] ?? null);
      if (p) {
        supabase.from("products").select("*").eq("category", p.category).neq("id", p.id).limit(4).then(({
          data: rel
        }) => setRelated(rel ?? []));
      }
    });
  }, [id]);
  if (!product) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-sm text-muted-foreground", children: "Loading…" });
  }
  const handleAdd = async () => {
    if (!size) return;
    await add(product, size, 1);
    toast.success(`Added ${product.name} (${size}) to bag`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-3 py-8 sm:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden border-2 border-ink bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: getProductImage(product.image_url), alt: product.name, className: "h-full w-full object-cover", width: 768, height: 896 }),
        product.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sticker absolute left-3 top-3", children: product.badge })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold uppercase text-magenta", children: product.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl sm:text-4xl", children: product.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-2xl font-bold", children: formatPrice(product.price_cents) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: product.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-xs font-bold uppercase", children: "Size" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: product.sizes.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSize(s), className: `min-w-12 border-2 border-ink px-3 py-2 text-sm font-bold uppercase transition ${size === s ? "bg-ink text-bone" : "bg-bone hover:bg-neon"}`, children: s }, s)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleAdd, disabled: !size, className: "btn-chunk mt-6 w-full bg-neon py-3 text-sm font-bold uppercase text-ink disabled:opacity-50", children: "Add to Bag" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-1 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "★ Free shipping over $75" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "★ 30-day returns, no questions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "★ Runs oversized — size down for regular fit" })
        ] })
      ] })
    ] }),
    related.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-2xl", children: "YOU MIGHT ALSO DIG" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: related.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p }, p.id)) })
    ] })
  ] });
}
export {
  ProductPage as component
};
