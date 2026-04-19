import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/category-page";

export const Route = createFileRoute("/accessories")({
  head: () => ({
    meta: [
      { title: "Accessories — ThinkBold" },
      { name: "description", content: "Sneakers, caps, bags and shades to finish the fit." },
    ],
  }),
  component: () => (
    <CategoryPage
      category="accessories"
      title="ACCESSORIES"
      tagline="The finishing touches that make the fit."
    />
  ),
});
