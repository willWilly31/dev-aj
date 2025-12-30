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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {item.popular && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground shadow-md">
            <Flame className="h-3 w-3" />
            Populer
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-bold text-foreground leading-tight">{item.name}</h3>
        <p className="mt-1 flex-1 text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatPrice(item.price)}
          </span>

          {quantity === 0 ? (
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="rounded-full px-4 font-semibold shadow-sm transition-all hover:shadow-glow"
            >
              + Tambah
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
