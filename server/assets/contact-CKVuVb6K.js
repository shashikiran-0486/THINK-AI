import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BvjM3Bz9.js";
import { c as createLucideIcon, t as toast } from "./router-ccWGIwOv.js";
import { o as object, s as string } from "./schemas-D47Vmuoc.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$2 = [
  ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5", key: "2e1cvw" }],
  ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", key: "9exkf1" }],
  ["line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5", key: "r4j83e" }]
];
const Instagram = createLucideIcon("instagram", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
      key: "pff0z6"
    }
  ]
];
const Twitter = createLucideIcon("twitter", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",
      key: "1q2vi4"
    }
  ],
  ["path", { d: "m10 15 5-3-5-3z", key: "1jp15x" }]
];
const Youtube = createLucideIcon("youtube", __iconNode);
const schema = object({
  name: string().trim().min(1, "Name required").max(100),
  email: string().trim().email("Invalid email").max(255),
  message: string().trim().min(5, "Tell us a bit more").max(1e3)
});
function ContactPage() {
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    message: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  const [sent, setSent] = reactExports.useState(false);
  const submit = (e) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs = {};
      r.error.issues.forEach((i) => errs[i.path[0]] = i.message);
      setErrors(errs);
      return;
    }
    setErrors({});
    setSent(true);
    toast.success("Message sent — we'll be in touch soon.");
    setForm({
      name: "",
      email: "",
      message: ""
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-3 py-10 sm:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl sm:text-6xl", children: "SAY HI." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
      "Need a fast answer? Chat with ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "ThinkAi" }),
      " 24/7 (bottom-right). For everything else, drop us a line."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "mt-8 space-y-4 border-2 border-ink bg-card p-5", children: [
      sent && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-2 border-ink bg-neon p-3 text-sm font-bold uppercase", children: "✓ We got it. Reply within 24h." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-bold uppercase", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.name, onChange: (e) => setForm((f) => ({
          ...f,
          name: e.target.value
        })), className: "w-full border-2 border-ink bg-bone px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-magenta" }),
        errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: errors.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-bold uppercase", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: form.email, onChange: (e) => setForm((f) => ({
          ...f,
          email: e.target.value
        })), className: "w-full border-2 border-ink bg-bone px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-magenta" }),
        errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: errors.email })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-bold uppercase", children: "Message" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 5, value: form.message, onChange: (e) => setForm((f) => ({
          ...f,
          message: e.target.value
        })), className: "w-full border-2 border-ink bg-bone px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-magenta" }),
        errors.message && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: errors.message })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "btn-chunk w-full bg-neon py-3 text-sm font-bold uppercase", children: "Send Message" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex justify-center gap-4", children: [Instagram, Twitter, Youtube].map((Icon, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "rounded-full border-2 border-ink bg-bone p-3 hover:bg-neon", "aria-label": "social", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }, i)) })
  ] });
}
export {
  ContactPage as component
};
