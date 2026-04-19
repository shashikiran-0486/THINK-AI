import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BvjM3Bz9.js";
import { u as useNavigate, L as Link, t as toast, s as supabase } from "./router-ccWGIwOv.js";
import { o as object, s as string } from "./schemas-D47Vmuoc.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const schema = object({
  email: string().trim().email("Invalid email").max(255),
  password: string().min(6, "Min 6 chars").max(100),
  display_name: string().trim().min(1).max(60)
});
function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = reactExports.useState({
    email: "",
    password: "",
    display_name: ""
  });
  const [loading, setLoading] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      toast.error(r.error.issues[0].message);
      return;
    }
    setLoading(true);
    const {
      error
    } = await supabase.auth.signUp({
      email: r.data.email,
      password: r.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
        data: {
          display_name: r.data.display_name
        }
      }
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created 🔥");
    navigate({
      to: "/account"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-3 py-12 sm:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl", children: "JOIN THE FAM" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "mt-6 space-y-4 border-2 border-ink bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-bold uppercase", children: "Display name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.display_name, onChange: (e) => setForm((f) => ({
          ...f,
          display_name: e.target.value
        })), className: "w-full border-2 border-ink bg-bone px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-magenta", required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-bold uppercase", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: form.email, onChange: (e) => setForm((f) => ({
          ...f,
          email: e.target.value
        })), className: "w-full border-2 border-ink bg-bone px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-magenta", required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-bold uppercase", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: form.password, onChange: (e) => setForm((f) => ({
          ...f,
          password: e.target.value
        })), className: "w-full border-2 border-ink bg-bone px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-magenta", required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: loading, className: "btn-chunk w-full bg-neon py-3 text-sm font-bold uppercase disabled:opacity-50", children: loading ? "…" : "Sign Up" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs", children: [
        "Already in? ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "font-bold underline", children: "Log in" })
      ] })
    ] })
  ] });
}
export {
  SignupPage as component
};
