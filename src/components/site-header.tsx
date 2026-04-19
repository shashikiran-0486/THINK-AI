import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

const navLinks = [
  { to: "/shop", label: "Shop" },
  { to: "/men", label: "Men" },
  { to: "/women", label: "Women" },
  { to: "/accessories", label: "Accessories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-bone/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6">
        <Link to="/" className="flex items-center gap-1">
          <span className="font-display text-xl tracking-tight sm:text-2xl">THINK</span>
          <span className="rounded-sm bg-neon px-1.5 font-display text-xl tracking-tight text-ink sm:text-2xl">
            BOLD
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-semibold uppercase lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="hover:text-magenta"
              activeProps={{ className: "text-magenta underline underline-offset-4" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to={user ? "/account" : "/login"}
            className="rounded-md p-2 hover:bg-muted"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link to="/cart" className="relative rounded-md p-2 hover:bg-muted" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-magenta px-1 text-[10px] font-bold text-bone">
                {count}
              </span>
            )}
          </Link>
          <button
            className="rounded-md p-2 hover:bg-muted lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t-2 border-ink bg-bone lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-3 py-3 sm:px-6">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="border-b border-ink/10 py-3 text-base font-semibold uppercase last:border-0"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Marquee */}
      <div className="overflow-hidden border-t-2 border-ink bg-ink text-bone">
        <div className="flex whitespace-nowrap py-1.5 text-xs font-bold uppercase tracking-wider animate-marquee">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 items-center gap-6 px-3">
              <span>🔥 New Drop Live</span>
              <span className="text-neon">★</span>
              <span>Free Shipping Over $75</span>
              <span className="text-magenta">★</span>
              <span>30-Day Returns</span>
              <span className="text-neon">★</span>
              <span>ThinkAi Style Concierge 24/7</span>
              <span className="text-magenta">★</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
