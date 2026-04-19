import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-B-r-vGVl.js";
import { s as supabase } from "./router-Ch4Sxf0h.js";
import { P as ProductCard } from "./product-card-4R5fqQ7j.js";
function CategoryPage({
  category,
  title,
  tagline
}) {
  const [products, setProducts] = reactExports.useState([]);
  reactExports.useEffect(() => {
    supabase.from("products").select("*").eq("category", category).then(({ data }) => setProducts(data ?? []));
  }, [category]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-3 py-8 sm:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-ink bg-ink p-6 text-bone sm:p-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl sm:text-7xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neon", children: title.slice(0, 1) }),
        title.slice(1)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-lg text-sm text-bone/70 sm:text-base", children: tagline })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", children: products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p }, p.id)) }),
    products.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 text-center text-sm text-muted-foreground", children: "Loading drops…" })
  ] });
}
export {
  CategoryPage as C
};
