import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThinkAiWidget } from "@/components/thinkai-widget";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display">404</h1>
        <h2 className="mt-2 text-xl font-bold uppercase">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That page is somewhere else. Let's get you back to the drop.
        </p>
        <Link
          to="/"
          className="btn-chunk mt-6 inline-block bg-neon px-5 py-2 text-sm font-bold uppercase"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ThinkBold — Bold Streetwear & ThinkAi Concierge" },
      {
        name: "description",
        content:
          "ThinkBold: gen-z streetwear made loud. Shop drops & chat with ThinkAi, our 24/7 AI style concierge.",
      },
      { property: "og:title", content: "ThinkBold — Bold Streetwear" },
      {
        property: "og:description",
        content: "Streetwear made loud. Plus ThinkAi, your 24/7 AI style concierge.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        <ThinkAiWidget />
        <Toaster position="top-center" richColors />
      </CartProvider>
    </AuthProvider>
  );
}
