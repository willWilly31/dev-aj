import { Minus, Plus, Flame } from 'lucide-react';
import { MenuItem, formatPrice } from '@/lib/menuData';
import { useCartStore } from '@/lib/cartStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addItem(item);
    toast.success(`${item.name} ditambahkan ke keranjang`, {
      duration: 1500,
    });
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-500 hover:shadow-lg hover:-translate-y-1.5 border border-border/30">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {item.popular && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full gradient-warm px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow">
            <Flame className="h-3 w-3" />
            Favorit
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 pt-3">
        <h3 className="font-display font-semibold text-foreground leading-snug tracking-tight">{item.name}</h3>
        <p className="mt-1.5 flex-1 text-sm text-muted-foreground line-clamp-2 font-light">
          {item.description}
        </p>

        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-lg font-bold text-gold font-display">
            {formatPrice(item.price)}
          </span>

          {quantity === 0 ? (
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="rounded-full px-4 font-semibold shadow-sm transition-all hover:shadow-glow gradient-warm border-0 text-primary-foreground"
            >
              Tambah
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateQuantity(item.id, quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center font-bold">{quantity}</span>
              <Button
                size="icon"
                className="h-8 w-8 rounded-full shadow-sm"
                onClick={() => updateQuantity(item.id, quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
