import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — ThinkBold" },
      { name: "description", content: "Create your ThinkBold account." },
    ],
  }),
  component: SignupPage,
});

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Min 6 chars").max(100),
  display_name: z.string().trim().min(1).max(60),
});

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", display_name: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      toast.error(r.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: r.data.email,
      password: r.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
        data: { display_name: r.data.display_name },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created 🔥");
    navigate({ to: "/account" });
  };

  return (
    <div className="mx-auto max-w-md px-3 py-12 sm:px-6">
      <h1 className="text-4xl">JOIN THE FAM</h1>
      <form onSubmit={submit} className="mt-6 space-y-4 border-2 border-ink bg-card p-5">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase">Display name</label>
          <input
            value={form.display_name}
            onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
            className="w-full border-2 border-ink bg-bone px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-magenta"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full border-2 border-ink bg-bone px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-magenta"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full border-2 border-ink bg-bone px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-magenta"
            required
          />
        </div>
        <button
          disabled={loading}
          className="btn-chunk w-full bg-neon py-3 text-sm font-bold uppercase disabled:opacity-50"
        >
          {loading ? "…" : "Sign Up"}
        </button>
        <p className="text-center text-xs">
          Already in? <Link to="/login" className="font-bold underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}
