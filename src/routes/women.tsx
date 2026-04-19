import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/category-page";

export const Route = createFileRoute("/women")({
  head: () => ({
    meta: [
      { title: "Women's Streetwear — ThinkBold" },
      { name: "description", content: "Women's crop tees, puffers, skirts and denim from ThinkBold." },
    ],
  }),
  component: () => (
    <CategoryPage
      category="women"
      title="WOMEN"
      tagline="Bold silhouettes. Statement pieces. No apologies."
    />
  ),
});
