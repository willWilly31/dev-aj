import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { formatPrice } from '@/lib/menuData';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function CartFloatingButton() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  if (totalItems === 0) return null;

  return (
    <Link
      to="/cart"
      className={cn(
        'fixed bottom-6 left-4 right-4 z-40 flex items-center justify-between rounded-2xl bg-primary px-5 py-4 text-primary-foreground shadow-lg shadow-primary/30 transition-all active:scale-[0.98]',
        'animate-slide-up md:left-auto md:right-6 md:w-auto md:min-w-[320px]'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium opacity-90">{totalItems} item</p>
          <p className="text-lg font-bold">{formatPrice(totalPrice)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 font-semibold">
        Lihat Keranjang
        <ArrowRight className="h-5 w-5" />
      </div>
    </Link>
  );
}
