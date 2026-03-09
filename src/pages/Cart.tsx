import { ArrowLeft, Minus, Plus, Trash2, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, CartItem } from '@/lib/cartStore';
import { formatPrice } from '@/lib/menuData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function CartItemCard({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 rounded-xl bg-card p-4 shadow-card">
      <img
        src={item.image}
        alt={item.name}
        className="h-20 w-20 rounded-lg object-cover"
      />
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-foreground">{item.name}</h3>
            <p className="text-sm text-primary font-semibold">
              {formatPrice(item.price)}
            </p>
          </div>
          <button
            onClick={() => {
              removeItem(item.id);
              toast.success(`${item.name} dihapus dari keranjang`);
            }}
            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Subtotal: {formatPrice(item.price * item.quantity)}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
            <Button
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Cart = () => {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;

    const orderDetails = items
      .map((item) => `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`)
      .join('\n');

    const message = `☕ *Pesanan Baru dari Warkop AJ*\n\n${orderDetails}\n\n*Total: ${formatPrice(totalPrice)}*\n\nMohon konfirmasi pesanan saya. Terima kasih! 🙏`;

    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    toast.success('Mengarahkan ke WhatsApp...');
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-secondary/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Keranjang</h1>
            <p className="text-xs text-muted-foreground">{totalItems} item</p>
          </div>
        </div>
      </header>

      <main className="container py-4">
        {items.length > 0 ? (
          <>
            {/* Cart Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>

            {/* Clear Cart */}
            <button
              onClick={() => {
                clearCart();
                toast.success('Keranjang dikosongkan');
              }}
              className="mt-4 w-full rounded-lg border border-destructive/30 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              Kosongkan Keranjang
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl">🛒</span>
            <h2 className="mt-4 text-xl font-bold text-foreground">Keranjang Kosong</h2>
            <p className="mt-2 text-muted-foreground">
              Yuk, tambahkan menu favoritmu!
            </p>
            <Link to="/">
              <Button className="mt-6 rounded-full px-8">Lihat Menu</Button>
            </Link>
          </div>
        )}
      </main>

      {/* Checkout Footer */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card p-4 shadow-lg">
          <div className="container">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-muted-foreground">Total Pembayaran</span>
              <span className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
            </div>
            <Button
              onClick={handleWhatsAppOrder}
              className="w-full gap-2 rounded-xl py-6 text-base font-bold shadow-glow"
            >
              <MessageCircle className="h-5 w-5" />
              Pesan via WhatsApp
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
