import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/category-page";

export const Route = createFileRoute("/men")({
  head: () => ({
    meta: [
      { title: "Men's Streetwear — ThinkBold" },
      { name: "description", content: "Men's hoodies, tees, cargos and outerwear from ThinkBold." },
    ],
  }),
  component: () => (
    <CategoryPage
      category="men"
      title="MEN"
      tagline="Heavyweight fits, loud prints, after-hours energy."
    />
  ),
});
