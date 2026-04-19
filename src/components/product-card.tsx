import { Link } from "@tanstack/react-router";
import { getProductImage, formatPrice, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group block"
    >
      <div className="relative aspect-[3/4] overflow-hidden border-2 border-ink bg-card">
        <img
          src={getProductImage(product.image_url)}
          alt={product.name}
          loading="lazy"
          width={768}
          height={896}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="sticker absolute left-2 top-2">{product.badge}</span>
        )}
      </div>
      <div className="mt-2 flex items-start justify-between gap-2">
        <h3 className="line-clamp-1 text-sm font-bold uppercase">{product.name}</h3>
        <span className="shrink-0 text-sm font-bold">{formatPrice(product.price_cents)}</span>
      </div>
      <p className="text-xs uppercase text-muted-foreground">{product.category}</p>
    </Link>
  );
}
