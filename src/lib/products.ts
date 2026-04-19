// Maps product image_url keys (slug) to bundled assets.
import hoodieLime from "@/assets/products/hoodie-lime.jpg";
import pufferMagenta from "@/assets/products/puffer-magenta.jpg";
import cargoBlack from "@/assets/products/cargo-black.jpg";
import teeWhite from "@/assets/products/tee-white.jpg";
import sneakersChunky from "@/assets/products/sneakers-chunky.jpg";
import vestMesh from "@/assets/products/vest-mesh.jpg";
import skirtCheck from "@/assets/products/skirt-check.jpg";
import cropPink from "@/assets/products/crop-pink.jpg";
import jeansWide from "@/assets/products/jeans-wide.jpg";
import capTrucker from "@/assets/products/cap-trucker.jpg";
import bagSling from "@/assets/products/bag-sling.jpg";
import sunglassesChrome from "@/assets/products/sunglasses-chrome.jpg";

export const productImages: Record<string, string> = {
  "hoodie-lime": hoodieLime,
  "puffer-magenta": pufferMagenta,
  "cargo-black": cargoBlack,
  "tee-white": teeWhite,
  "sneakers-chunky": sneakersChunky,
  "vest-mesh": vestMesh,
  "skirt-check": skirtCheck,
  "crop-pink": cropPink,
  "jeans-wide": jeansWide,
  "cap-trucker": capTrucker,
  "bag-sling": bagSling,
  "sunglasses-chrome": sunglassesChrome,
};

export function getProductImage(key: string): string {
  return productImages[key] ?? hoodieLime;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  category: "men" | "women" | "accessories";
  image_url: string;
  sizes: string[];
  badge: string | null;
  trending: boolean;
  featured: boolean;
};
