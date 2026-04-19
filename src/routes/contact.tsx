import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Instagram, Twitter, Youtube } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ThinkBold" },
      { name: "description", content: "Get in touch with ThinkBold or chat with ThinkAi 24/7." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(5, "Tell us a bit more").max(1000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setSent(true);
    toast.success("Message sent — we'll be in touch soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-3xl px-3 py-10 sm:px-6">
      <h1 className="text-5xl sm:text-6xl">SAY HI.</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Need a fast answer? Chat with <strong>ThinkAi</strong> 24/7 (bottom-right). For everything
        else, drop us a line.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4 border-2 border-ink bg-card p-5">
        {sent && (
          <div className="border-2 border-ink bg-neon p-3 text-sm font-bold uppercase">
            ✓ We got it. Reply within 24h.
          </div>
        )}
        <div>
          <label className="mb-1 block text-xs font-bold uppercase">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full border-2 border-ink bg-bone px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-magenta"
          />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full border-2 border-ink bg-bone px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-magenta"
          />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase">Message</label>
          <textarea
            rows={5}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="w-full border-2 border-ink bg-bone px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-magenta"
          />
          {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
        </div>
        <button type="submit" className="btn-chunk w-full bg-neon py-3 text-sm font-bold uppercase">
          Send Message
        </button>
      </form>

      <div className="mt-8 flex justify-center gap-4">
        {[Instagram, Twitter, Youtube].map((Icon, i) => (
          <a
            key={i}
            href="#"
            className="rounded-full border-2 border-ink bg-bone p-3 hover:bg-neon"
            aria-label="social"
          >
            <Icon className="h-5 w-5" />
          </a>
        ))}
      </div>
    </div>
  );
}
