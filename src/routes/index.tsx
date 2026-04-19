import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ThinkBold — Streetwear Made Loud" },
      {
        name: "description",
        content:
          "Bold gen-z streetwear drops. Shop hoodies, cargos, sneakers & accessories. 24/7 ThinkAi style concierge.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [trending, setTrending] = useState<Product[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("trending", true)
      .limit(6)
      .then(({ data }) => setTrending((data as unknown as Product[]) ?? []));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b-2 border-ink bg-ink text-bone">
        <div className="mx-auto grid max-w-7xl gap-6 px-3 py-10 sm:px-6 sm:py-16 md:grid-cols-2 md:items-center md:gap-8">
          <div>
            <span className="sticker mb-3">Drop 04 — Live</span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl leading-none sm:text-6xl md:text-7xl"
            >
              <span className="block">WEAR</span>
              <span className="block text-neon">YOUR</span>
              <span className="block">VOLUME.</span>
            </motion.h1>
            <p className="mt-4 max-w-md text-sm text-bone/70 sm:text-base">
              Streetwear built for the after-hours. Loud prints, heavyweight fabric, and a 24/7 AI
              style concierge that actually gets it.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-chunk inline-flex items-center gap-2 bg-neon px-5 py-3 text-sm font-bold uppercase text-ink">
                Shop the Drop <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/about" className="btn-chunk inline-flex items-center gap-2 bg-bone px-5 py-3 text-sm font-bold uppercase text-ink">
                Our Story
              </Link>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative aspect-[4/5] overflow-hidden border-2 border-bone"
          >
            <img src={heroImg} alt="ThinkBold drop 04 hero" className="h-full w-full object-cover" width={1536} height={1024} />
            <div className="sticker absolute right-2 top-2">🔥 Hot</div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-3 py-10 sm:px-6 sm:py-14">
        <h2 className="mb-5 text-3xl sm:text-4xl">Shop By Vibe</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { to: "/men", label: "Men", color: "bg-neon" },
            { to: "/women", label: "Women", color: "bg-magenta text-bone" },
            { to: "/accessories", label: "Accessories", color: "bg-ink text-bone" },
          ].map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className={`group relative flex h-40 items-end overflow-hidden border-2 border-ink p-4 ${c.color} transition hover:scale-[1.02]`}
            >
              <span className="font-display text-3xl uppercase">{c.label}</span>
              <ArrowRight className="absolute right-4 top-4 h-5 w-5 transition group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="mx-auto max-w-7xl px-3 pb-10 sm:px-6 sm:pb-14">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-3xl sm:text-4xl">🔥 Trending</h2>
          <Link to="/shop" className="text-xs font-bold uppercase underline underline-offset-4">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* THINKAI STRIP */}
      <section className="border-y-2 border-ink bg-magenta text-bone">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-3 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-start gap-3">
            <div className="rounded-full border-2 border-bone bg-ink p-2">
              <Sparkles className="h-6 w-6 text-neon" />
            </div>
            <div>
              <div className="font-display text-2xl sm:text-3xl">MEET THINKAI.</div>
              <p className="mt-1 max-w-md text-sm text-bone/90">
                Your 24/7 AI style concierge. Ask for outfit ideas, sizing help, or order info —
                instant answers, zero hold music.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              document
                .querySelector<HTMLButtonElement>('button[aria-label="Open ThinkAi chat"]')
                ?.click();
            }}
            className="btn-chunk inline-flex items-center gap-2 bg-neon px-5 py-3 text-sm font-bold uppercase text-ink"
          >
            <Zap className="h-4 w-4" /> Chat with ThinkAi
          </button>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="mx-auto max-w-3xl px-3 py-14 text-center sm:px-6">
        <h2 className="text-3xl sm:text-4xl">BUILT LOUD. WORN LOUDER.</h2>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          ThinkBold is for the kids who don't fade into the background. Every drop is small,
          intentional, and engineered to last past the trend cycle.
        </p>
      </section>
    </div>
  );
}
