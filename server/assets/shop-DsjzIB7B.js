import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-B-r-vGVl.js";
import { s as supabase } from "./router-Ch4Sxf0h.js";
import { P as ProductCard } from "./product-card-4R5fqQ7j.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function ShopPage() {
  const [products, setProducts] = reactExports.useState([]);
  const [category, setCategory] = reactExports.useState("all");
  const [sort, setSort] = reactExports.useState("new");
  reactExports.useEffect(() => {
    supabase.from("products").select("*").then(({
      data
    }) => setProducts(data ?? []));
  }, []);
  const filtered = reactExports.useMemo(() => {
    let list = products;
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (sort === "low") list = [...list].sort((a, b) => a.price_cents - b.price_cents);
    if (sort === "high") list = [...list].sort((a, b) => b.price_cents - a.price_cents);
    return list;
  }, [products, category, sort]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-3 py-8 sm:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl sm:text-5xl", children: "SHOP ALL" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
      filtered.length,
      " pieces in rotation."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-wrap items-center gap-2", children: [
      ["all", "men", "women", "accessories"].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCategory(c), className: `rounded-full border-2 border-ink px-3 py-1 text-xs font-bold uppercase transition ${category === c ? "bg-ink text-bone" : "bg-bone hover:bg-neon"}`, children: c }, c)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: sort, onChange: (e) => setSort(e.target.value), className: "ml-auto rounded-md border-2 border-ink bg-bone px-2 py-1 text-xs font-bold uppercase", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "new", children: "Newest" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "low", children: "Price ↑" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "high", children: "Price ↓" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", children: filtered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p }, p.id)) })
  ] });
}
export {
  ShopPage as component
};
