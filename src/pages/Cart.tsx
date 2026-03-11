import { useState, useEffect } from 'react';
import { ArrowLeft, Minus, Plus, Trash2, MessageCircle, StickyNote, Printer, Bluetooth } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, CartItem, OrderType, PaymentMethod } from '@/lib/cartStore';
import { formatPrice } from '@/lib/menuData';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { connectPrinter, isPrinterConnected, getPrinterName, printReceipt as btPrintReceipt, ReceiptData } from '@/lib/bluetoothPrinter';

const quickNotes = [
  'Tanpa Gula', 'Gula Sedikit', 'Es Sedikit', 'Es Banyak',
  'Panas', 'Kurang Manis', 'Extra Es', 'Pedas Sedang',
];

function NoteModal({ item, open, onOpenChange }: { item: CartItem | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { updateNote } = useCartStore();
  const [note, setNote] = useState(item?.note || '');

  const handleSave = () => {
    if (item) {
      updateNote(item.id, note.trim() || null);
      toast.success('Catatan disimpan');
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">📝 Catatan Item</DialogTitle>
        </DialogHeader>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Contoh: tanpa gula, es sedikit..."
          rows={3}
        />
        <div className="grid grid-cols-2 gap-2">
          {quickNotes.map((qn) => (
            <button
              key={qn}
              onClick={() => setNote(qn)}
              className="py-2 text-xs rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              {qn}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Batal</Button>
          <Button onClick={handleSave} className="flex-1">Simpan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CartItemCard({ item, onOpenNote }: { item: CartItem; onOpenNote: (item: CartItem) => void }) {
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
            {item.note && (
              <p className="text-xs text-blue-600 mt-0.5">• {item.note}</p>
            )}
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
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {formatPrice(item.price * item.quantity)}
            </span>
            <button
              onClick={() => onOpenNote(item)}
              className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
            >
              <StickyNote className="h-3 w-3 inline mr-0.5" />
              {item.note ? 'Edit' : 'Catatan'}
            </button>
          </div>
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

function ReceiptPreview({ onClose }: { onClose: () => void }) {
  const { items, orderType, paymentMethod, getTotalPrice, getTax, getGrandTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const orderId = String(Date.now()).slice(-4);
  const now = new Date();

  const handlePrint = () => {
    window.print();
  };

  const handleRawBT = () => {
    // RawBT intercepts window.print() or intent URL
    // First try intent for RawBT app
    const intentUrl = `intent://print#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end`;
    window.location.href = intentUrl;
    // Fallback to window.print after short delay
    setTimeout(() => window.print(), 500);
  };

  const handleNewOrder = () => {
    clearCart();
    onClose();
    navigate('/');
    toast.success('Pesanan baru siap!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-sm rounded-2xl shadow-lg overflow-hidden">
        {/* Thermal Receipt - ID used by print CSS */}
        <div id="thermal-receipt" className="p-6 text-center border-b border-dashed border-border" style={{ fontFamily: "'Courier New', monospace" }}>
          <div className="receipt-title font-bold text-xl">WARKOP AJ</div>
          <div className="text-[10px] mt-0.5">Kopi & Makanan Khas Medan</div>
          <div className="receipt-divider my-2 border-t border-dashed border-border" />
          
          <div className="text-left text-xs space-y-0.5">
            <div className="receipt-row flex justify-between">
              <span>Order</span>
              <span className="font-bold">#{orderId}</span>
            </div>
            <div className="receipt-row flex justify-between">
              <span>Tipe</span>
              <span className="font-bold">{orderType === 'dine' ? 'Dine In' : 'Take Away'}</span>
            </div>
            <div className="receipt-row flex justify-between">
              <span>Bayar</span>
              <span className="font-bold uppercase">{paymentMethod}</span>
            </div>
            <div className="receipt-row flex justify-between">
              <span>Tgl</span>
              <span>{now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="receipt-row flex justify-between">
              <span>Jam</span>
              <span>{now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          <div className="receipt-divider my-2 border-t border-dashed border-border" />

          <div className="text-left text-xs space-y-1">
            {items.map((item) => (
              <div key={item.id}>
                <div className="font-bold">{item.name}</div>
                {item.note && <div className="text-[9px]">*({item.note})</div>}
                <div className="receipt-row flex justify-between">
                  <span>{item.quantity}x {formatPrice(item.price)}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="receipt-divider my-2 border-t border-dashed border-border" />

          <div className="text-left text-xs space-y-0.5">
            <div className="receipt-row flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            <div className="receipt-row flex justify-between">
              <span>PPN 11%</span>
              <span>{formatPrice(getTax())}</span>
            </div>
            <div className="receipt-divider my-1 border-t border-dashed border-border" />
            <div className="receipt-row receipt-total flex justify-between font-bold text-sm">
              <span>TOTAL</span>
              <span>{formatPrice(getGrandTotal())}</span>
            </div>
          </div>

          <div className="receipt-divider my-2 border-t border-dashed border-border" />
          <div className="text-[9px] text-center space-y-0.5">
            <p>Terima kasih!</p>
            <p>IG: @warkopaj</p>
            <p className="italic">"Ngopi Santai, Rasa Istimewa!"</p>
          </div>
        </div>

        {/* Actions - hidden when printing */}
        <div className="p-4 space-y-2 print:hidden">
          <Button onClick={handleRawBT} className="w-full gap-2 font-bold">
            <Printer className="h-4 w-4" />
            🖨️ Cetak via RawBT
          </Button>
          <Button onClick={handlePrint} variant="outline" className="w-full gap-2 text-xs">
            <Printer className="h-4 w-4" />
            Print Biasa
          </Button>
          <Button onClick={handleNewOrder} variant="secondary" className="w-full">
            Pesanan Baru
          </Button>
        </div>
      </div>
    </div>
  );
}

const Cart = () => {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice, getTotalItems, getTax, getGrandTotal, orderType, setOrderType, paymentMethod, setPaymentMethod } = useCartStore();
  const totalItems = getTotalItems();

  const [noteItem, setNoteItem] = useState<CartItem | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [cashAmount, setCashAmount] = useState('');

  const grandTotal = getGrandTotal();
  const cashNum = parseFloat(cashAmount) || 0;
  const change = cashNum - grandTotal;

  const handleOpenNote = (item: CartItem) => {
    setNoteItem(item);
    setNoteOpen(true);
  };

  const handleConfirmPayment = () => {
    if (items.length === 0) return;
    if (paymentMethod === 'cash' && cashNum < grandTotal) {
      toast.error(`Uang kurang ${formatPrice(grandTotal - cashNum)}`);
      return;
    }
    setShowReceipt(true);
  };

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;

    const orderDetails = items
      .map((item) => {
        let line = `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`;
        if (item.note) line += `\n  _(${item.note})_`;
        return line;
      })
      .join('\n');

    const typeLabel = orderType === 'dine' ? 'Dine In' : 'Take Away';
    const message = `☕ *Pesanan Baru dari Warkop AJ*\n\n📋 Tipe: *${typeLabel}*\n\n${orderDetails}\n\nSubtotal: ${formatPrice(getTotalPrice())}\nPPN 11%: ${formatPrice(getTax())}\n*Grand Total: ${formatPrice(grandTotal)}*\n\nBayar: *${paymentMethod.toUpperCase()}*\n\nMohon konfirmasi pesanan saya. Terima kasih! 🙏`;

    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Mengarahkan ke WhatsApp...');
  };

  const quickCashAmounts = [5000, 10000, 20000, 50000, 100000, 200000].filter(n => n >= grandTotal).slice(0, 3);

  if (showReceipt) {
    return <ReceiptPreview onClose={() => setShowReceipt(false)} />;
  }

  return (
    <div className="min-h-screen bg-background pb-52">
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
            {/* Order Type */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setOrderType('dine')}
                className={cn(
                  'flex-1 py-2.5 text-sm rounded-xl font-bold transition-all',
                  orderType === 'dine'
                    ? 'bg-foreground text-background'
                    : 'border border-border text-muted-foreground'
                )}
              >
                🍽️ Dine In
              </button>
              <button
                onClick={() => setOrderType('takeaway')}
                className={cn(
                  'flex-1 py-2.5 text-sm rounded-xl font-bold transition-all',
                  orderType === 'takeaway'
                    ? 'bg-foreground text-background'
                    : 'border border-border text-muted-foreground'
                )}
              >
                🥡 Take Away
              </button>
            </div>

            {/* Cart Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <CartItemCard key={item.id} item={item} onOpenNote={handleOpenNote} />
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

            {/* Summary */}
            <div className="mt-4 rounded-2xl bg-secondary/50 p-4 space-y-1.5">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>PPN 11%</span>
                <span>{formatPrice(getTax())}</span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-4">
              <p className="text-sm font-semibold text-foreground mb-2">Metode Pembayaran</p>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { id: 'cash' as const, icon: '💵', label: 'Cash' },
                  { id: 'transfer' as const, icon: '🏦', label: 'Transfer' },
                  { id: 'qris' as const, icon: '📱', label: 'QRIS' },
                ]).map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={cn(
                      'p-3 rounded-2xl border-2 text-center transition-all',
                      paymentMethod === pm.id
                        ? 'border-foreground bg-secondary'
                        : 'border-border bg-card'
                    )}
                  >
                    <div className="text-2xl">{pm.icon}</div>
                    <div className={cn(
                      'text-xs mt-1 font-medium',
                      paymentMethod === pm.id ? 'text-foreground font-bold' : 'text-muted-foreground'
                    )}>
                      {pm.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cash Input */}
            {paymentMethod === 'cash' && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-muted-foreground">Uang Diterima</p>
                <input
                  type="number"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-secondary px-4 py-3 rounded-xl text-2xl font-bold text-right focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="grid grid-cols-4 gap-2">
                  {quickCashAmounts.map((n) => (
                    <button
                      key={n}
                      onClick={() => setCashAmount(String(n))}
                      className="py-2 bg-secondary rounded-xl text-xs font-semibold hover:bg-secondary/80 transition-colors"
                    >
                      {formatPrice(n)}
                    </button>
                  ))}
                  <button
                    onClick={() => setCashAmount(String(grandTotal))}
                    className="py-2 bg-foreground text-background rounded-xl text-xs font-semibold"
                  >
                    Pas
                  </button>
                </div>
                {cashNum >= grandTotal && cashNum > 0 && (
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-xl px-4 py-3 flex justify-between">
                    <span className="text-green-700 dark:text-green-400 font-semibold">Kembalian</span>
                    <span className="text-green-700 dark:text-green-400 font-bold">{formatPrice(change)}</span>
                  </div>
                )}
              </div>
            )}
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
          <div className="container space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Grand Total</span>
              <span className="text-xl font-bold text-primary">{formatPrice(grandTotal)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={handleWhatsAppOrder}
                className="gap-2 rounded-xl py-5"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button
                onClick={handleConfirmPayment}
                className="gap-2 rounded-xl py-5 font-bold shadow-glow"
              >
                Bayar ✓
              </Button>
            </div>
          </div>
        </div>
      )}

      <NoteModal item={noteItem} open={noteOpen} onOpenChange={setNoteOpen} />
    </div>
  );
};

export default Cart;
