import { U as jsxRuntimeExports } from "./worker-entry-B-r-vGVl.js";
import { L as Link, g as getProductImage, f as formatPrice } from "./router-Ch4Sxf0h.js";
function ProductCard({ product }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/product/$id",
      params: { id: product.id },
      className: "group block",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] overflow-hidden border-2 border-ink bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: getProductImage(product.image_url),
              alt: product.name,
              loading: "lazy",
              width: 768,
              height: 896,
              className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            }
          ),
          product.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sticker absolute left-2 top-2", children: product.badge })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "line-clamp-1 text-sm font-bold uppercase", children: product.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-sm font-bold", children: formatPrice(product.price_cents) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase text-muted-foreground", children: product.category })
      ]
    }
  );
}
export {
  ProductCard as P
};
