import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t-2 border-ink bg-ink text-bone">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-1">
            <span className="font-display text-2xl">THINK</span>
            <span className="rounded-sm bg-neon px-1.5 font-display text-2xl text-ink">BOLD</span>
          </div>
          <p className="mt-3 text-sm text-bone/70">
            Streetwear made loud. Built for nights you'll remember.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase">Shop</h4>
          <ul className="space-y-1 text-sm text-bone/80">
            <li><Link to="/men">Men</Link></li>
            <li><Link to="/women">Women</Link></li>
            <li><Link to="/accessories">Accessories</Link></li>
            <li><Link to="/shop">All</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase">Company</h4>
          <ul className="space-y-1 text-sm text-bone/80">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase">Help</h4>
          <ul className="space-y-1 text-sm text-bone/80">
            <li>Shipping: 3–5 days</li>
            <li>Returns: 30 days</li>
            <li>Ask ThinkAi 24/7 →</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-bone/10 py-4 text-center text-xs text-bone/50">
        © {new Date().getFullYear()} ThinkBold. All rights reserved.
      </div>
    </footer>
  );
}
