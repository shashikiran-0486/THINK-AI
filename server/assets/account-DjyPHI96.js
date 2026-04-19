import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BvjM3Bz9.js";
import { c as createLucideIcon, b as useAuth, u as useNavigate, s as supabase, L as Link, f as formatPrice } from "./router-ccWGIwOv.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode);
function AccountPage() {
  const {
    user,
    loading,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/login"
    });
  }, [user, loading, navigate]);
  reactExports.useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("id, total_cents, status, created_at").order("created_at", {
      ascending: false
    }).then(({
      data
    }) => setOrders(data ?? []));
  }, [user]);
  if (loading || !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-sm", children: "Loading…" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-3 py-10 sm:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl", children: "HEY 👋" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: user.email })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
        await signOut();
        navigate({
          to: "/"
        });
      }, className: "inline-flex items-center gap-1 border-2 border-ink bg-bone px-3 py-2 text-xs font-bold uppercase hover:bg-neon", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3 w-3" }),
        " Log out"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-10 text-2xl", children: "ORDER HISTORY" }),
    orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm text-muted-foreground", children: [
      "No orders yet. ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "underline", children: "Start shopping →" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2", children: orders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 border-2 border-ink bg-card p-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
          "#",
          o.id.slice(0, 8).toUpperCase()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-3 rounded-full bg-neon px-2 py-0.5 text-[10px] font-bold uppercase", children: o.status })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: new Date(o.created_at).toLocaleDateString() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: formatPrice(o.total_cents) })
    ] }, o.id)) })
  ] });
}
export {
  AccountPage as component
};
