import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ThinkBold" },
      { name: "description", content: "ThinkBold is gen-z streetwear made loud, built to last past the trend cycle." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-3 py-10 sm:px-6">
      <h1 className="text-5xl sm:text-7xl">
        BUILT <span className="text-magenta">LOUD.</span>
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        ThinkBold started in 2024 in a basement studio with one rule: never make a piece you wouldn't
        wear out. Three years later, that's still the only rule.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {[
          { t: "MISSION", b: "Make streetwear that doesn't whisper. Heavyweight fabric, loud prints, fits that don't fade." },
          { t: "SUSTAINABILITY", b: "Small batch drops, recycled puffers, zero overproduction. Better, not more." },
          { t: "COMMUNITY", b: "Built with our community, not for it. Every drop starts in our Discord." },
        ].map((x) => (
          <div key={x.t} className="border-2 border-ink bg-card p-4">
            <div className="sticker mb-2">{x.t}</div>
            <p className="mt-2 text-sm">{x.b}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 border-2 border-ink bg-ink p-6 text-bone sm:p-10">
        <h2 className="text-3xl text-neon">THE TEAM</h2>
        <p className="mt-2 text-sm text-bone/80">
          Six designers, two pattern makers, a photographer, and ThinkAi. Yes — our AI concierge is on
          the team page. She works 24/7 and never asks for time off.
        </p>
      </div>
    </div>
  );
}
