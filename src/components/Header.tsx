import { ShoppingCart, MapPin } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { Link } from 'react-router-dom';

export function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo & Location */}
        <div className="flex flex-col">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍜</span>
            <h1 className="text-xl font-extrabold text-foreground">
              Warung<span className="text-primary">Medan</span>
            </h1>
          </Link>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>Medan, Sumatera Utara</span>
          </div>
        </div>

        {/* Cart Button */}
        <Link
          to="/cart"
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-all hover:shadow-glow active:scale-95"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow-sm">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
